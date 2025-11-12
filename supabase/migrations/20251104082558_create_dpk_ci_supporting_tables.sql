/*
  # Create DPK and CI Supporting Tables
  
  1. New Tables
    - `dim_dpk_budget_approval` - Budget approval requests and responses
    - `dim_dpk_demand_consolidation` - Consolidated demand from multiple sources
    - `dim_dpk_netting_result` - Results of demand netting calculations
    - `dim_ci_inventory_alert` - Inventory alert configurations and triggers
    - `dim_ci_execution_log` - Execution management activity logs
    - `fact_dpk_upload` - User uploaded demand forecasts
    - `fact_str_transaction` - Stock Transfer Request transactions
    
  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their data
    
  3. Important Notes
    - Uses existing material, unit, and storage location references
    - Integrates with existing demand, forecast, and inventory tables
    - Supports annual and monthly rolling forecast workflows
*/

-- DPK Budget Approval Table
CREATE TABLE IF NOT EXISTS dim_dpk_budget_approval (
  approval_id bigserial PRIMARY KEY,
  forecast_type varchar(50) NOT NULL,
  fiscal_year integer NOT NULL,
  total_budget numeric(20, 2) NOT NULL,
  currency varchar(10) DEFAULT 'IDR',
  approval_status varchar(50) DEFAULT 'Pending',
  submitted_by varchar(100),
  submitted_date timestamp DEFAULT now(),
  approved_by varchar(100),
  approved_date timestamp,
  rejection_reason text,
  created_date timestamp DEFAULT now(),
  modified_date timestamp DEFAULT now()
);

ALTER TABLE dim_dpk_budget_approval ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read budget approvals"
  ON dim_dpk_budget_approval FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert budget approvals"
  ON dim_dpk_budget_approval FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update budget approvals"
  ON dim_dpk_budget_approval FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- DPK Demand Consolidation Table
CREATE TABLE IF NOT EXISTS dim_dpk_demand_consolidation (
  consolidation_id bigserial PRIMARY KEY,
  forecast_type varchar(50) NOT NULL,
  period_type varchar(50) NOT NULL,
  period_value varchar(100) NOT NULL,
  material_id varchar(50),
  unit_requestor_id varchar(50),
  erp_forecast_qty numeric(20, 4) DEFAULT 0,
  user_forecast_qty numeric(20, 4) DEFAULT 0,
  consolidated_qty numeric(20, 4) DEFAULT 0,
  unit_price numeric(20, 2) DEFAULT 0,
  total_value numeric(20, 2) DEFAULT 0,
  currency varchar(10) DEFAULT 'IDR',
  consolidation_date date DEFAULT CURRENT_DATE,
  is_approved boolean DEFAULT false,
  created_date timestamp DEFAULT now(),
  modified_date timestamp DEFAULT now()
);

ALTER TABLE dim_dpk_demand_consolidation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage demand consolidation"
  ON dim_dpk_demand_consolidation FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- DPK Netting Result Table
CREATE TABLE IF NOT EXISTS dim_dpk_netting_result (
  netting_id bigserial PRIMARY KEY,
  forecast_type varchar(50) NOT NULL,
  material_id varchar(50) NOT NULL,
  unit_requestor_id varchar(50),
  gross_demand_qty numeric(20, 4) DEFAULT 0,
  available_inventory_qty numeric(20, 4) DEFAULT 0,
  open_po_qty numeric(20, 4) DEFAULT 0,
  net_requirement_qty numeric(20, 4) DEFAULT 0,
  unit_price numeric(20, 2) DEFAULT 0,
  net_value numeric(20, 2) DEFAULT 0,
  currency varchar(10) DEFAULT 'IDR',
  netting_date date DEFAULT CURRENT_DATE,
  is_converted_to_drp boolean DEFAULT false,
  created_date timestamp DEFAULT now(),
  modified_date timestamp DEFAULT now()
);

ALTER TABLE dim_dpk_netting_result ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage netting results"
  ON dim_dpk_netting_result FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- User Uploaded Forecast Table
CREATE TABLE IF NOT EXISTS fact_dpk_upload (
  upload_id bigserial PRIMARY KEY,
  upload_type varchar(50) NOT NULL,
  material_id varchar(50) NOT NULL,
  unit_requestor_id varchar(50),
  period_type varchar(50) NOT NULL,
  period_value varchar(100) NOT NULL,
  forecast_qty numeric(20, 4) NOT NULL,
  unit_price numeric(20, 2),
  forecast_value numeric(20, 2),
  currency varchar(10) DEFAULT 'IDR',
  uploaded_by varchar(100),
  upload_date timestamp DEFAULT now(),
  created_date timestamp DEFAULT now()
);

ALTER TABLE fact_dpk_upload ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage uploads"
  ON fact_dpk_upload FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- CI Inventory Alert Configuration Table
CREATE TABLE IF NOT EXISTS dim_ci_inventory_alert (
  alert_id bigserial PRIMARY KEY,
  alert_type varchar(50) NOT NULL,
  material_id varchar(50) NOT NULL,
  storage_location_id varchar(50),
  unit_owner_id varchar(50),
  threshold_type varchar(50) NOT NULL,
  threshold_value numeric(20, 4) NOT NULL,
  current_value numeric(20, 4),
  alert_status varchar(50) DEFAULT 'Active',
  severity varchar(20) DEFAULT 'Medium',
  alert_message text,
  triggered_date timestamp,
  resolved_date timestamp,
  created_date timestamp DEFAULT now(),
  modified_date timestamp DEFAULT now()
);

ALTER TABLE dim_ci_inventory_alert ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage inventory alerts"
  ON dim_ci_inventory_alert FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- CI Execution Log Table
CREATE TABLE IF NOT EXISTS dim_ci_execution_log (
  execution_id bigserial PRIMARY KEY,
  execution_type varchar(50) NOT NULL,
  reference_number varchar(100),
  material_id varchar(50),
  from_location varchar(50),
  to_location varchar(50),
  qty_requested numeric(20, 4),
  qty_executed numeric(20, 4),
  execution_status varchar(50) DEFAULT 'Pending',
  requester varchar(100),
  approver varchar(100),
  execution_date date,
  completion_date date,
  notes text,
  created_date timestamp DEFAULT now(),
  modified_date timestamp DEFAULT now()
);

ALTER TABLE dim_ci_execution_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage execution logs"
  ON dim_ci_execution_log FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- STR (Stock Transfer Request) Transaction Table
CREATE TABLE IF NOT EXISTS fact_str_transaction (
  str_id bigserial PRIMARY KEY,
  str_number varchar(50) UNIQUE NOT NULL,
  str_type varchar(50) NOT NULL,
  material_id varchar(50) NOT NULL,
  from_storage_location varchar(50) NOT NULL,
  to_storage_location varchar(50) NOT NULL,
  from_unit varchar(50),
  to_unit varchar(50),
  requested_qty numeric(20, 4) NOT NULL,
  approved_qty numeric(20, 4),
  executed_qty numeric(20, 4),
  unit_price numeric(20, 2),
  total_value numeric(20, 2),
  currency varchar(10) DEFAULT 'IDR',
  request_status varchar(50) DEFAULT 'Draft',
  requested_by varchar(100),
  request_date date DEFAULT CURRENT_DATE,
  approved_by varchar(100),
  approval_date date,
  executed_by varchar(100),
  execution_date date,
  settlement_status varchar(50) DEFAULT 'Pending',
  settlement_date date,
  notes text,
  created_date timestamp DEFAULT now(),
  modified_date timestamp DEFAULT now()
);

ALTER TABLE fact_str_transaction ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage STR transactions"
  ON fact_str_transaction FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dpk_budget_fiscal_year ON dim_dpk_budget_approval(fiscal_year, forecast_type);
CREATE INDEX IF NOT EXISTS idx_dpk_consolidation_period ON dim_dpk_demand_consolidation(period_type, period_value);
CREATE INDEX IF NOT EXISTS idx_dpk_netting_material ON dim_dpk_netting_result(material_id, forecast_type);
CREATE INDEX IF NOT EXISTS idx_dpk_upload_period ON fact_dpk_upload(period_type, period_value);
CREATE INDEX IF NOT EXISTS idx_ci_alert_material ON dim_ci_inventory_alert(material_id, alert_status);
CREATE INDEX IF NOT EXISTS idx_ci_execution_type ON dim_ci_execution_log(execution_type, execution_status);
CREATE INDEX IF NOT EXISTS idx_str_number ON fact_str_transaction(str_number);
CREATE INDEX IF NOT EXISTS idx_str_status ON fact_str_transaction(request_status, settlement_status);
