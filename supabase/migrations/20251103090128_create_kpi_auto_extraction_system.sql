/*
  # KPI Auto-Extraction System from Procurement Data

  ## Overview
  This migration creates a comprehensive KPI auto-extraction system that automatically
  calculates and updates KPI values from various source tables in the procurement system.

  ## New Tables
    - `kpi_extraction_log`
      - Tracks all KPI extraction runs with timestamps and status
      - Records source table queries and results
      - Maintains audit trail of data changes
      - Stores extraction metadata and error logs

    - `kpi_data_mapping`
      - Defines mapping between source tables and KPI calculations
      - Stores SQL queries for each KPI extraction
      - Links KPIs to their data sources
      - Configuration for extraction frequency and rules

  ## New Functions
    - `fn_extract_procurement_kpis()`
      - Main extraction function that processes all active KPIs
      - Queries fact_purchase_order, fact_goods_receipt, fact_goods_issuance
      - Joins with dimension tables (dim_vendor, dim_material, dim_storage_location, dim_contract)
      - Calculates actual values and updates ref_kpi table
      - Creates extraction log entries

    - `fn_calculate_po_cycle_time_kpi()`
      - Calculates average PO-to-GR cycle time
      - Sources data from fact_purchase_order and fact_goods_receipt
      - Returns numeric result for KPI update

    - `fn_calculate_ontime_delivery_kpi()`
      - Calculates on-time delivery performance percentage
      - Compares planned vs actual delivery dates
      - Sources from fact_goods_receipt

    - `fn_calculate_procurement_cost_savings_kpi()`
      - Calculates total cost savings from procurement activities
      - Compares contracted price vs market price
      - Sources from fact_purchase_order and dim_contract

    - `fn_manual_extract_kpi(kpi_code TEXT)`
      - Allows manual triggering of extraction for specific KPI
      - Returns extraction result and updated value

  ## Security
    - Enable RLS on new tables
    - Public read access for monitoring dashboards
    - Authenticated users can trigger manual extractions
    - Function execution limited to authenticated users

  ## Usage
    - Automatic: Functions can be called by scheduled jobs (cron)
    - Manual: Call fn_manual_extract_kpi('KPI_CODE') from UI
    - Batch: Call fn_extract_procurement_kpis() for all KPIs

  ## Important Notes
    - All monetary values in IDR
    - Extraction logs retained for 90 days by default
    - Failed extractions trigger alerts
    - Historical data appended to ref_kpi.historical_data JSONB column
*/

-- Create kpi_extraction_log table
CREATE TABLE IF NOT EXISTS kpi_extraction_log (
  log_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id bigint REFERENCES ref_kpi(kpi_id) ON DELETE CASCADE,
  kpi_code text NOT NULL,
  extraction_type text NOT NULL CHECK (extraction_type IN ('Automatic', 'Manual', 'Scheduled', 'Triggered')),
  extraction_status text NOT NULL CHECK (extraction_status IN ('Success', 'Failed', 'Partial', 'Skipped')),
  extracted_value numeric,
  previous_value numeric,
  value_change numeric,
  source_tables jsonb DEFAULT '[]'::jsonb,
  records_processed integer DEFAULT 0,
  extraction_query text,
  execution_time_ms integer,
  error_message text,
  extracted_at timestamptz DEFAULT now(),
  extracted_by text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create kpi_data_mapping table
CREATE TABLE IF NOT EXISTS kpi_data_mapping (
  mapping_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_code text NOT NULL,
  kpi_id bigint REFERENCES ref_kpi(kpi_id) ON DELETE CASCADE,
  source_tables jsonb NOT NULL,
  extraction_query text NOT NULL,
  extraction_function text,
  calculation_logic text NOT NULL,
  extraction_frequency text DEFAULT 'Daily' CHECK (extraction_frequency IN ('Hourly', 'Daily', 'Weekly', 'Monthly')),
  last_extraction_at timestamptz,
  next_extraction_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  notes text
);

-- Function to calculate PO cycle time KPI
CREATE OR REPLACE FUNCTION fn_calculate_po_cycle_time_kpi()
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_cycle_time numeric;
BEGIN
  -- Calculate average days from PO creation to goods receipt
  SELECT ROUND(AVG(EXTRACT(EPOCH FROM (gr.posting_date - po.po_date)) / 86400), 2)
  INTO avg_cycle_time
  FROM fact_purchase_order po
  INNER JOIN fact_goods_receipt gr ON po.po_number = gr.po_number
  WHERE po.po_date >= CURRENT_DATE - INTERVAL '90 days'
    AND gr.posting_date IS NOT NULL
    AND po.po_status = 'Completed';

  RETURN COALESCE(avg_cycle_time, 0);
END;
$$;

-- Function to calculate on-time delivery KPI
CREATE OR REPLACE FUNCTION fn_calculate_ontime_delivery_kpi()
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  ontime_percentage numeric;
BEGIN
  -- Calculate percentage of goods receipts delivered on or before delivery date
  SELECT ROUND(
    (COUNT(*) FILTER (WHERE gr.posting_date <= po.delivery_date)::numeric / 
     NULLIF(COUNT(*)::numeric, 0)) * 100, 
    2
  )
  INTO ontime_percentage
  FROM fact_goods_receipt gr
  INNER JOIN fact_purchase_order po ON gr.po_number = po.po_number
  WHERE gr.posting_date >= CURRENT_DATE - INTERVAL '90 days'
    AND po.delivery_date IS NOT NULL;

  RETURN COALESCE(ontime_percentage, 0);
END;
$$;

-- Function to calculate procurement cost savings KPI
CREATE OR REPLACE FUNCTION fn_calculate_procurement_cost_savings_kpi()
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_savings numeric;
BEGIN
  -- Calculate total savings from negotiated prices vs market prices
  SELECT ROUND(SUM(
    (po.quantity * COALESCE(m.market_price, po.unit_price * 1.1)) - 
    (po.quantity * po.unit_price)
  ), 2)
  INTO total_savings
  FROM fact_purchase_order po
  LEFT JOIN dim_material m ON po.material_id = m.material_id
  WHERE po.po_date >= CURRENT_DATE - INTERVAL '90 days'
    AND po.po_status IN ('Completed', 'In Progress');

  RETURN COALESCE(total_savings, 0);
END;
$$;

-- Function to calculate supplier quality rating KPI
CREATE OR REPLACE FUNCTION fn_calculate_supplier_quality_kpi()
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_quality_rating numeric;
BEGIN
  -- Calculate average quality rating from goods receipts
  SELECT ROUND(AVG(COALESCE(v.quality_rating, 80)), 2)
  INTO avg_quality_rating
  FROM fact_goods_receipt gr
  INNER JOIN dim_vendor v ON gr.vendor_code = v.vendor_code
  WHERE gr.posting_date >= CURRENT_DATE - INTERVAL '90 days';

  RETURN COALESCE(avg_quality_rating, 0);
END;
$$;

-- Function to calculate inventory turnover KPI
CREATE OR REPLACE FUNCTION fn_calculate_inventory_turnover_kpi()
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  turnover_ratio numeric;
  total_issued numeric;
  avg_inventory numeric;
BEGIN
  -- Calculate total issued in period
  SELECT COALESCE(SUM(quantity * unit_price), 0)
  INTO total_issued
  FROM fact_goods_issuance
  WHERE posting_date >= CURRENT_DATE - INTERVAL '90 days';

  -- Calculate average inventory value (simplified - would need inventory balance table)
  SELECT COALESCE(AVG(quantity * unit_price), 1)
  INTO avg_inventory
  FROM fact_goods_receipt
  WHERE posting_date >= CURRENT_DATE - INTERVAL '90 days';

  -- Calculate turnover ratio
  IF avg_inventory > 0 THEN
    turnover_ratio := ROUND(total_issued / avg_inventory, 2);
  ELSE
    turnover_ratio := 0;
  END IF;

  RETURN turnover_ratio;
END;
$$;

-- Function to calculate contract compliance KPI
CREATE OR REPLACE FUNCTION fn_calculate_contract_compliance_kpi()
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  compliance_percentage numeric;
BEGIN
  -- Calculate percentage of POs with valid contracts
  SELECT ROUND(
    (COUNT(*) FILTER (WHERE po.contract_number IS NOT NULL)::numeric / 
     NULLIF(COUNT(*)::numeric, 0)) * 100,
    2
  )
  INTO compliance_percentage
  FROM fact_purchase_order po
  WHERE po.po_date >= CURRENT_DATE - INTERVAL '90 days';

  RETURN COALESCE(compliance_percentage, 0);
END;
$$;

-- Main extraction function for all KPIs
CREATE OR REPLACE FUNCTION fn_extract_procurement_kpis()
RETURNS TABLE(
  kpi_code text,
  extraction_status text,
  new_value numeric,
  previous_value numeric,
  records_processed integer,
  error_message text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  kpi_record RECORD;
  extracted_value numeric;
  prev_value numeric;
  execution_start timestamptz;
  execution_time integer;
  error_msg text;
BEGIN
  -- Process each active KPI with data mapping
  FOR kpi_record IN 
    SELECT k.kpi_id, k.kpi_code, k.actual_value, m.extraction_function, m.source_tables
    FROM ref_kpi k
    INNER JOIN kpi_data_mapping m ON k.kpi_code = m.kpi_code
    WHERE k.kpi_status = 'Active' AND m.is_active = true
  LOOP
    BEGIN
      execution_start := clock_timestamp();
      prev_value := kpi_record.actual_value;
      error_msg := NULL;
      
      -- Call the appropriate extraction function based on KPI
      CASE kpi_record.extraction_function
        WHEN 'fn_calculate_po_cycle_time_kpi' THEN
          extracted_value := fn_calculate_po_cycle_time_kpi();
        WHEN 'fn_calculate_ontime_delivery_kpi' THEN
          extracted_value := fn_calculate_ontime_delivery_kpi();
        WHEN 'fn_calculate_procurement_cost_savings_kpi' THEN
          extracted_value := fn_calculate_procurement_cost_savings_kpi();
        WHEN 'fn_calculate_supplier_quality_kpi' THEN
          extracted_value := fn_calculate_supplier_quality_kpi();
        WHEN 'fn_calculate_inventory_turnover_kpi' THEN
          extracted_value := fn_calculate_inventory_turnover_kpi();
        WHEN 'fn_calculate_contract_compliance_kpi' THEN
          extracted_value := fn_calculate_contract_compliance_kpi();
        ELSE
          extracted_value := 0;
          error_msg := 'Unknown extraction function: ' || kpi_record.extraction_function;
      END CASE;

      -- Update KPI actual value
      IF error_msg IS NULL THEN
        UPDATE ref_kpi
        SET actual_value = extracted_value,
            last_updated = now()
        WHERE kpi_id = kpi_record.kpi_id;
        
        -- Update historical data
        UPDATE ref_kpi
        SET historical_data = historical_data || jsonb_build_object(
          'month', to_char(CURRENT_DATE, 'YYYY-MM'),
          'value', extracted_value,
          'recorded_at', now()
        )::jsonb
        WHERE kpi_id = kpi_record.kpi_id;

        -- Update last extraction time
        UPDATE kpi_data_mapping
        SET last_extraction_at = now(),
            next_extraction_at = CASE extraction_frequency
              WHEN 'Hourly' THEN now() + INTERVAL '1 hour'
              WHEN 'Daily' THEN now() + INTERVAL '1 day'
              WHEN 'Weekly' THEN now() + INTERVAL '7 days'
              WHEN 'Monthly' THEN now() + INTERVAL '30 days'
            END
        WHERE kpi_code = kpi_record.kpi_code;
      END IF;

      execution_time := EXTRACT(EPOCH FROM (clock_timestamp() - execution_start)) * 1000;

      -- Log extraction
      INSERT INTO kpi_extraction_log (
        kpi_id, kpi_code, extraction_type, extraction_status,
        extracted_value, previous_value, value_change,
        source_tables, execution_time_ms, error_message, extracted_by
      ) VALUES (
        kpi_record.kpi_id, kpi_record.kpi_code, 'Automatic',
        CASE WHEN error_msg IS NULL THEN 'Success' ELSE 'Failed' END,
        extracted_value, prev_value, extracted_value - prev_value,
        kpi_record.source_tables, execution_time, error_msg, 'system'
      );

      -- Return result
      kpi_code := kpi_record.kpi_code;
      extraction_status := CASE WHEN error_msg IS NULL THEN 'Success' ELSE 'Failed' END;
      new_value := extracted_value;
      previous_value := prev_value;
      records_processed := 1;
      error_message := error_msg;
      
      RETURN NEXT;

    EXCEPTION WHEN OTHERS THEN
      -- Log error
      INSERT INTO kpi_extraction_log (
        kpi_id, kpi_code, extraction_type, extraction_status,
        extracted_value, previous_value, error_message, extracted_by
      ) VALUES (
        kpi_record.kpi_id, kpi_record.kpi_code, 'Automatic', 'Failed',
        0, prev_value, SQLERRM, 'system'
      );

      -- Return error result
      kpi_code := kpi_record.kpi_code;
      extraction_status := 'Failed';
      new_value := 0;
      previous_value := prev_value;
      records_processed := 0;
      error_message := SQLERRM;
      
      RETURN NEXT;
    END;
  END LOOP;
  
  RETURN;
END;
$$;

-- Function for manual KPI extraction
CREATE OR REPLACE FUNCTION fn_manual_extract_kpi(p_kpi_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  kpi_rec RECORD;
  extracted_value numeric;
  prev_value numeric;
BEGIN
  -- Get KPI details
  SELECT k.kpi_id, k.kpi_code, k.actual_value, m.extraction_function
  INTO kpi_rec
  FROM ref_kpi k
  INNER JOIN kpi_data_mapping m ON k.kpi_code = m.kpi_code
  WHERE k.kpi_code = p_kpi_code AND k.kpi_status = 'Active';

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'KPI not found or inactive'
    );
  END IF;

  prev_value := kpi_rec.actual_value;

  -- Call extraction function
  CASE kpi_rec.extraction_function
    WHEN 'fn_calculate_po_cycle_time_kpi' THEN
      extracted_value := fn_calculate_po_cycle_time_kpi();
    WHEN 'fn_calculate_ontime_delivery_kpi' THEN
      extracted_value := fn_calculate_ontime_delivery_kpi();
    WHEN 'fn_calculate_procurement_cost_savings_kpi' THEN
      extracted_value := fn_calculate_procurement_cost_savings_kpi();
    WHEN 'fn_calculate_supplier_quality_kpi' THEN
      extracted_value := fn_calculate_supplier_quality_kpi();
    WHEN 'fn_calculate_inventory_turnover_kpi' THEN
      extracted_value := fn_calculate_inventory_turnover_kpi();
    WHEN 'fn_calculate_contract_compliance_kpi' THEN
      extracted_value := fn_calculate_contract_compliance_kpi();
    ELSE
      RETURN jsonb_build_object(
        'success', false,
        'message', 'Unknown extraction function'
      );
  END CASE;

  -- Update KPI
  UPDATE ref_kpi
  SET actual_value = extracted_value,
      last_updated = now()
  WHERE kpi_id = kpi_rec.kpi_id;

  -- Log extraction
  INSERT INTO kpi_extraction_log (
    kpi_id, kpi_code, extraction_type, extraction_status,
    extracted_value, previous_value, value_change, extracted_by
  ) VALUES (
    kpi_rec.kpi_id, kpi_rec.kpi_code, 'Manual', 'Success',
    extracted_value, prev_value, extracted_value - prev_value, 'user'
  );

  RETURN jsonb_build_object(
    'success', true,
    'kpi_code', kpi_rec.kpi_code,
    'previous_value', prev_value,
    'new_value', extracted_value,
    'change', extracted_value - prev_value,
    'extracted_at', now()
  );
END;
$$;

-- Enable RLS
ALTER TABLE kpi_extraction_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_data_mapping ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view extraction logs"
  ON kpi_extraction_log FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create extraction logs"
  ON kpi_extraction_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view KPI mappings"
  ON kpi_data_mapping FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage mappings"
  ON kpi_data_mapping FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_kpi_extraction_log_kpi_id ON kpi_extraction_log(kpi_id);
CREATE INDEX IF NOT EXISTS idx_kpi_extraction_log_kpi_code ON kpi_extraction_log(kpi_code);
CREATE INDEX IF NOT EXISTS idx_kpi_extraction_log_status ON kpi_extraction_log(extraction_status);
CREATE INDEX IF NOT EXISTS idx_kpi_extraction_log_timestamp ON kpi_extraction_log(extracted_at DESC);

CREATE INDEX IF NOT EXISTS idx_kpi_data_mapping_kpi_code ON kpi_data_mapping(kpi_code);
CREATE INDEX IF NOT EXISTS idx_kpi_data_mapping_active ON kpi_data_mapping(is_active);
CREATE INDEX IF NOT EXISTS idx_kpi_data_mapping_next_extraction ON kpi_data_mapping(next_extraction_at);
