/*
  # Populate Comprehensive OTIF Delivery Data (2023-2025)

  ## Overview
  Generates 800-1200 delivery records linked to procurement contracts for supplier performance tracking.
  Each contract gets 6-10 delivery records distributed over its duration.

  ## OTIF Performance by Supplier Tier
  - Strategic suppliers: 90-98% OTIF
  - Preferred suppliers: 80-89% OTIF
  - Standard suppliers: 65-79% OTIF

  ## Delivery Frequency by Category
  - Category A: Monthly deliveries (major shipments)
  - Category B: Bi-weekly deliveries
  - Category C: Weekly deliveries
  - Category D: Monthly deliveries
  - Category E: Milestone-based (monthly)
  - Category F: Milestone-based (quarterly)

  ## Failure Reasons by Category
  - Category A: Logistics/customs delays, weather conditions
  - Category B: Quality issues requiring rework, technical specifications
  - Category C: Supplier capacity constraints, production delays
  - Category D: Administrative delays, documentation issues
  - Category E: Scope changes, coordination issues
  - Category F: Technical dependencies, engineering changes
*/

-- Create temporary function to generate multiple deliveries per contract
CREATE OR REPLACE FUNCTION generate_deliveries_for_contract(
  p_contract_id TEXT,
  p_supplier_name TEXT,
  p_main_category TEXT,
  p_sub_category TEXT,
  p_award_date DATE,
  p_contract_duration_months INTEGER,
  p_organization_id TEXT DEFAULT 'ORG001'
)
RETURNS VOID AS $$
DECLARE
  v_delivery_count INTEGER;
  v_delivery_frequency_days INTEGER;
  v_supplier_tier TEXT;
  v_base_otif_rate NUMERIC;
  v_delivery_date DATE;
  v_expected_date DATE;
  v_actual_date DATE;
  v_quantity_ordered NUMERIC;
  v_quantity_delivered NUMERIC;
  v_is_on_time BOOLEAN;
  v_is_in_full BOOLEAN;
  v_is_otif BOOLEAN;
  v_delay_days INTEGER;
  v_quantity_shortage NUMERIC;
  v_failure_reason TEXT;
  v_delivery_status TEXT;
  v_i INTEGER;
BEGIN
  -- Determine delivery frequency and count based on category
  CASE p_main_category
    WHEN 'A' THEN  -- Monthly for energy
      v_delivery_frequency_days := 30;
      v_delivery_count := LEAST(p_contract_duration_months, 8 + (RANDOM() * 4)::INTEGER);
    WHEN 'B' THEN  -- Bi-weekly for equipment
      v_delivery_frequency_days := 14;
      v_delivery_count := LEAST(p_contract_duration_months * 2, 6 + (RANDOM() * 4)::INTEGER);
    WHEN 'C' THEN  -- Weekly for materials
      v_delivery_frequency_days := 7;
      v_delivery_count := LEAST(p_contract_duration_months * 4, 8 + (RANDOM() * 6)::INTEGER);
    WHEN 'D' THEN  -- Monthly for assets
      v_delivery_frequency_days := 30;
      v_delivery_count := LEAST(p_contract_duration_months, 6 + (RANDOM() * 4)::INTEGER);
    WHEN 'E' THEN  -- Monthly for services
      v_delivery_frequency_days := 30;
      v_delivery_count := LEAST(p_contract_duration_months, 6 + (RANDOM() * 4)::INTEGER);
    WHEN 'F' THEN  -- Quarterly for EPC
      v_delivery_frequency_days := 90;
      v_delivery_count := LEAST((p_contract_duration_months / 3)::INTEGER, 4 + (RANDOM() * 3)::INTEGER);
    ELSE
      v_delivery_frequency_days := 30;
      v_delivery_count := 6;
  END CASE;

  -- Determine supplier tier based on name patterns
  IF p_supplier_name ILIKE '%Siemens%' OR p_supplier_name ILIKE '%GE%' OR p_supplier_name ILIKE '%ABB%' OR
     p_supplier_name ILIKE '%Schneider%' OR p_supplier_name ILIKE '%Mitsubishi%' OR p_supplier_name ILIKE '%Shell%' OR
     p_supplier_name ILIKE '%Pertamina%' THEN
    v_supplier_tier := 'strategic';
    v_base_otif_rate := 0.93;  -- 93% base OTIF
  ELSIF p_supplier_name ILIKE 'PT%' AND (p_supplier_name ILIKE '%Indonesia%' OR p_supplier_name ILIKE '%Tbk%') THEN
    v_supplier_tier := 'preferred';
    v_base_otif_rate := 0.84;  -- 84% base OTIF
  ELSE
    v_supplier_tier := 'standard';
    v_base_otif_rate := 0.71;  -- 71% base OTIF
  END IF;

  -- Generate deliveries
  FOR v_i IN 1..v_delivery_count LOOP
    -- Calculate delivery dates
    v_expected_date := p_award_date + (v_i * v_delivery_frequency_days || ' days')::INTERVAL;

    -- Only create delivered records for past dates
    IF v_expected_date <= CURRENT_DATE THEN
      -- Determine if this delivery is OTIF based on supplier tier
      v_is_otif := RANDOM() < (v_base_otif_rate + (RANDOM() * 0.1 - 0.05));  -- Add variance

      -- Generate quantities
      v_quantity_ordered := 100 + (RANDOM() * 900)::INTEGER;

      IF v_is_otif THEN
        -- OTIF delivery
        v_actual_date := v_expected_date - (RANDOM() * 2)::INTEGER;  -- Delivered early or on-time
        v_quantity_delivered := v_quantity_ordered;
        v_is_on_time := TRUE;
        v_is_in_full := TRUE;
        v_delay_days := 0;
        v_quantity_shortage := 0;
        v_failure_reason := NULL;
        v_delivery_status := 'delivered';
      ELSE
        -- Non-OTIF delivery - determine type of failure
        IF RANDOM() < 0.6 THEN
          -- Late delivery but in full
          v_delay_days := 1 + (RANDOM() * 7)::INTEGER;
          v_actual_date := v_expected_date + (v_delay_days || ' days')::INTERVAL;
          v_quantity_delivered := v_quantity_ordered;
          v_is_on_time := FALSE;
          v_is_in_full := TRUE;
          v_quantity_shortage := 0;

          -- Category-specific failure reasons for delays
          v_failure_reason := CASE p_main_category
            WHEN 'A' THEN CASE WHEN RANDOM() < 0.5 THEN 'Logistics delay due to port congestion' ELSE 'Weather conditions affecting transportation' END
            WHEN 'B' THEN CASE WHEN RANDOM() < 0.5 THEN 'Quality inspection requiring additional time' ELSE 'Technical specification verification' END
            WHEN 'C' THEN CASE WHEN RANDOM() < 0.5 THEN 'Production capacity constraints' ELSE 'Raw material supply delay' END
            WHEN 'D' THEN CASE WHEN RANDOM() < 0.5 THEN 'Import documentation processing' ELSE 'Customs clearance delay' END
            WHEN 'E' THEN CASE WHEN RANDOM() < 0.5 THEN 'Resource availability coordination' ELSE 'Scope clarification required' END
            WHEN 'F' THEN CASE WHEN RANDOM() < 0.5 THEN 'Engineering design approval delay' ELSE 'Factory acceptance test scheduling' END
          END;
        ELSIF RANDOM() < 0.7 THEN
          -- On time but partial delivery
          v_actual_date := v_expected_date;
          v_quantity_shortage := (v_quantity_ordered * (0.05 + RANDOM() * 0.15))::NUMERIC(10,2);
          v_quantity_delivered := v_quantity_ordered - v_quantity_shortage;
          v_is_on_time := TRUE;
          v_is_in_full := FALSE;
          v_delay_days := 0;

          v_failure_reason := CASE p_main_category
            WHEN 'A' THEN 'Partial shipment due to vessel capacity'
            WHEN 'B' THEN 'Manufacturing yield lower than expected'
            WHEN 'C' THEN 'Supplier production capacity limitation'
            WHEN 'D' THEN 'Partial approval for release'
            WHEN 'E' THEN 'Phased delivery as per revised schedule'
            WHEN 'F' THEN 'Milestone completion partial achievement'
          END;
        ELSE
          -- Late and partial
          v_delay_days := 1 + (RANDOM() * 5)::INTEGER;
          v_actual_date := v_expected_date + (v_delay_days || ' days')::INTERVAL;
          v_quantity_shortage := (v_quantity_ordered * (0.05 + RANDOM() * 0.12))::NUMERIC(10,2);
          v_quantity_delivered := v_quantity_ordered - v_quantity_shortage;
          v_is_on_time := FALSE;
          v_is_in_full := FALSE;

          v_failure_reason := CASE p_main_category
            WHEN 'A' THEN 'Combined logistics and supply constraints'
            WHEN 'B' THEN 'Quality issues and production delays'
            WHEN 'C' THEN 'Multiple supplier coordination issues'
            WHEN 'D' THEN 'Import clearance and quantity discrepancy'
            WHEN 'E' THEN 'Resource constraints and timeline extension'
            WHEN 'F' THEN 'Technical dependencies and procurement delays'
          END;
        END IF;

        v_delivery_status := 'delivered';
      END IF;

      -- Insert delivery record
      INSERT INTO supplier_otif_deliveries (
        organization_id, purchase_order_id, supplier_id, supplier_name,
        order_date, expected_delivery_date, actual_delivery_date,
        quantity_ordered, quantity_delivered,
        is_on_time, is_in_full, is_otif,
        delivery_status, delay_days, quantity_shortage,
        product_category, main_category, sub_category, failure_reason
      ) VALUES (
        p_organization_id,
        p_contract_id || '-PO-' || LPAD(v_i::TEXT, 3, '0'),
        SUBSTRING(MD5(p_supplier_name) FROM 1 FOR 8),
        p_supplier_name,
        v_expected_date - 30,  -- Order date 30 days before expected delivery
        v_expected_date,
        v_actual_date,
        v_quantity_ordered,
        v_quantity_delivered,
        v_is_on_time,
        v_is_in_full,
        v_is_otif,
        v_delivery_status,
        v_delay_days,
        v_quantity_shortage,
        p_sub_category,
        p_main_category,
        p_sub_category,
        v_failure_reason
      );

    ELSIF v_expected_date <= CURRENT_DATE + INTERVAL '30 days' THEN
      -- Pending delivery in next 30 days
      INSERT INTO supplier_otif_deliveries (
        organization_id, purchase_order_id, supplier_id, supplier_name,
        order_date, expected_delivery_date, actual_delivery_date,
        quantity_ordered, quantity_delivered,
        is_on_time, is_in_full, is_otif,
        delivery_status, product_category, main_category, sub_category
      ) VALUES (
        p_organization_id,
        p_contract_id || '-PO-' || LPAD(v_i::TEXT, 3, '0'),
        SUBSTRING(MD5(p_supplier_name) FROM 1 FOR 8),
        p_supplier_name,
        v_expected_date - 30,
        v_expected_date,
        NULL,
        100 + (RANDOM() * 900)::INTEGER,
        0,
        FALSE,
        FALSE,
        FALSE,
        'pending',
        p_sub_category,
        p_main_category,
        p_sub_category
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Generate deliveries for all contracts
DO $$
DECLARE
  contract_record RECORD;
BEGIN
  FOR contract_record IN
    SELECT
      contract_id,
      supplier_name,
      main_category,
      sub_category,
      award_date,
      COALESCE(contract_duration_months, 12) as contract_duration_months,
      organization_id
    FROM fact_procurement_savings_contract
    WHERE organization_id = 'ORG001'
      AND contract_status IN ('Finalized', 'Completed', 'Active')
    ORDER BY award_date
  LOOP
    PERFORM generate_deliveries_for_contract(
      contract_record.contract_id,
      contract_record.supplier_name,
      contract_record.main_category,
      contract_record.sub_category,
      contract_record.award_date,
      contract_record.contract_duration_months,
      contract_record.organization_id
    );
  END LOOP;
END $$;

-- Calculate and populate supplier OTIF performance aggregates
INSERT INTO supplier_otif_performance (
  organization_id, supplier_id, supplier_name,
  period_start, period_end,
  total_deliveries, on_time_deliveries, in_full_deliveries, otif_deliveries,
  on_time_percentage, in_full_percentage, otif_percentage,
  avg_delay_days, supplier_tier
)
SELECT
  organization_id,
  supplier_id,
  supplier_name,
  DATE_TRUNC('quarter', MIN(order_date))::date as period_start,
  (DATE_TRUNC('quarter', MAX(order_date)) + INTERVAL '3 months - 1 day')::date as period_end,
  COUNT(*) FILTER (WHERE delivery_status = 'delivered') as total_deliveries,
  COUNT(*) FILTER (WHERE is_on_time = true AND delivery_status = 'delivered') as on_time_deliveries,
  COUNT(*) FILTER (WHERE is_in_full = true AND delivery_status = 'delivered') as in_full_deliveries,
  COUNT(*) FILTER (WHERE is_otif = true AND delivery_status = 'delivered') as otif_deliveries,
  ROUND((COUNT(*) FILTER (WHERE is_on_time = true AND delivery_status = 'delivered')::numeric /
         NULLIF(COUNT(*) FILTER (WHERE delivery_status = 'delivered'), 0) * 100), 2) as on_time_percentage,
  ROUND((COUNT(*) FILTER (WHERE is_in_full = true AND delivery_status = 'delivered')::numeric /
         NULLIF(COUNT(*) FILTER (WHERE delivery_status = 'delivered'), 0) * 100), 2) as in_full_percentage,
  ROUND((COUNT(*) FILTER (WHERE is_otif = true AND delivery_status = 'delivered')::numeric /
         NULLIF(COUNT(*) FILTER (WHERE delivery_status = 'delivered'), 0) * 100), 2) as otif_percentage,
  ROUND(AVG(delay_days) FILTER (WHERE delay_days > 0), 2) as avg_delay_days,
  CASE
    WHEN ROUND((COUNT(*) FILTER (WHERE is_otif = true AND delivery_status = 'delivered')::numeric /
         NULLIF(COUNT(*) FILTER (WHERE delivery_status = 'delivered'), 0) * 100), 2) >= 90 THEN 'strategic'
    WHEN ROUND((COUNT(*) FILTER (WHERE is_otif = true AND delivery_status = 'delivered')::numeric /
         NULLIF(COUNT(*) FILTER (WHERE delivery_status = 'delivered'), 0) * 100), 2) >= 80 THEN 'preferred'
    ELSE 'standard'
  END as supplier_tier
FROM supplier_otif_deliveries
WHERE delivery_status = 'delivered'
  AND organization_id = 'ORG001'
GROUP BY organization_id, supplier_id, supplier_name, DATE_TRUNC('quarter', order_date)
ON CONFLICT (organization_id, supplier_id, period_start, period_end) DO UPDATE
SET
  total_deliveries = EXCLUDED.total_deliveries,
  on_time_deliveries = EXCLUDED.on_time_deliveries,
  in_full_deliveries = EXCLUDED.in_full_deliveries,
  otif_deliveries = EXCLUDED.otif_deliveries,
  on_time_percentage = EXCLUDED.on_time_percentage,
  in_full_percentage = EXCLUDED.in_full_percentage,
  otif_percentage = EXCLUDED.otif_percentage,
  avg_delay_days = EXCLUDED.avg_delay_days,
  supplier_tier = EXCLUDED.supplier_tier;

-- Drop temporary function
DROP FUNCTION IF EXISTS generate_deliveries_for_contract;

-- Verification query
DO $$
DECLARE
  total_deliveries INTEGER;
  delivered_count INTEGER;
  pending_count INTEGER;
  otif_deliveries INTEGER;
  overall_otif_pct NUMERIC;
  strategic_suppliers INTEGER;
  total_suppliers INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_deliveries FROM supplier_otif_deliveries WHERE organization_id = 'ORG001';
  SELECT COUNT(*) INTO delivered_count FROM supplier_otif_deliveries WHERE delivery_status = 'delivered';
  SELECT COUNT(*) INTO pending_count FROM supplier_otif_deliveries WHERE delivery_status = 'pending';
  SELECT COUNT(*) INTO otif_deliveries FROM supplier_otif_deliveries WHERE is_otif = true;

  SELECT ROUND((otif_deliveries::numeric / NULLIF(delivered_count, 0) * 100), 2) INTO overall_otif_pct;

  SELECT COUNT(DISTINCT supplier_id) INTO strategic_suppliers
  FROM supplier_otif_performance WHERE supplier_tier = 'strategic';

  SELECT COUNT(DISTINCT supplier_id) INTO total_suppliers FROM supplier_otif_performance;

  RAISE NOTICE 'Total delivery records: %', total_deliveries;
  RAISE NOTICE 'Delivered: %, Pending: %', delivered_count, pending_count;
  RAISE NOTICE 'OTIF deliveries: % (%.2f%%)', otif_deliveries, overall_otif_pct;
  RAISE NOTICE 'Strategic suppliers: % out of % total', strategic_suppliers, total_suppliers;
END $$;
