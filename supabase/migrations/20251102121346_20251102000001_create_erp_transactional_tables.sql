/*
  # Create ERP Transactional Tables for PLN Indonesia Power Procurement
  
  1. New Tables (ERP Layer - Operational System Simulation)
    - `purchase_order` - PO line items with natural keys
    - `goods_receipt` - GR transactions  
    - `goods_issuance` - GI transactions
    - `inventory_snapshot` - Daily inventory snapshots
    - `demand` - Various demand types (unit, consolidated, adjusted, nett, projected)
    - `forecast` - Annual and budget forecasts
    - `procurement_request` - DRP and PR data
    - `asset` - Asset data with BOM structure
    - `price_estimation` - Price estimates and should-cost analysis
    - `sourcing_event` - Tender/sourcing events (draft, scheduled, final)
    - `tender_scoring` - Tender evaluation and scoring
    - `supplier_performance` - Supplier performance evaluations
    - `fulfillment` - Fulfillment plans and notifications
    - `invoice` - Invoice transactions
    - `payment_term` - Payment term schedules
    - `settlement` - Financial settlements
    - `berita_acara` - Official reports (BA documents)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
  
  3. Important Notes
    - ERP tables use natural/business keys (not surrogate keys)
    - No FK constraints enforced (simulation of Oracle ERP)
    - Related to existing dim_* and fact_* tables via shared IDs
    - Designed for PLN Indonesia Power procurement operations
*/

-- Purchase Order (ERP Transactional)
CREATE TABLE IF NOT EXISTS purchase_order (
  po_line_id BIGSERIAL PRIMARY KEY,
  po_number VARCHAR(50) NOT NULL,
  po_line_number INT NOT NULL,
  po_description VARCHAR(500),
  po_status VARCHAR(50) DEFAULT 'OPEN',
  material_id VARCHAR(50),
  vendor_id VARCHAR(50),
  contract_id VARCHAR(50),
  receiving_unit_id VARCHAR(50),
  po_date DATE,
  order_date DATE,
  expected_delivery_date DATE,
  qty_ordered DECIMAL(18,4) DEFAULT 0,
  qty_received DECIMAL(18,4) DEFAULT 0,
  unit_price DECIMAL(18,4) DEFAULT 0,
  total_po_value DECIMAL(18,2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'IDR',
  transaction_date DATE DEFAULT CURRENT_DATE,
  created_date TIMESTAMP DEFAULT NOW(),
  modified_date TIMESTAMP DEFAULT NOW(),
  UNIQUE(po_number, po_line_number)
);

CREATE INDEX IF NOT EXISTS idx_po_number ON purchase_order(po_number);
CREATE INDEX IF NOT EXISTS idx_po_material ON purchase_order(material_id);
CREATE INDEX IF NOT EXISTS idx_po_vendor ON purchase_order(vendor_id);
CREATE INDEX IF NOT EXISTS idx_po_date ON purchase_order(po_date);
CREATE INDEX IF NOT EXISTS idx_po_status ON purchase_order(po_status);

ALTER TABLE purchase_order ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to purchase_order"
  ON purchase_order FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to purchase_order"
  ON purchase_order FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Goods Receipt (ERP Transactional)
CREATE TABLE IF NOT EXISTS goods_receipt (
  gr_line_id BIGSERIAL PRIMARY KEY,
  gr_number VARCHAR(50) NOT NULL,
  gr_line_number INT NOT NULL,
  gr_date DATE DEFAULT CURRENT_DATE,
  receipt_date DATE DEFAULT CURRENT_DATE,
  po_number VARCHAR(50),
  po_line_id BIGINT,
  material_id VARCHAR(50),
  vendor_id VARCHAR(50),
  contract_id VARCHAR(50),
  receiving_unit_id VARCHAR(50),
  storage_location_id VARCHAR(50),
  qty_ordered DECIMAL(18,4) DEFAULT 0,
  qty_received DECIMAL(18,4) DEFAULT 0,
  unit_price DECIMAL(18,4) DEFAULT 0,
  total_value DECIMAL(18,2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'IDR',
  order_date DATE,
  created_date TIMESTAMP DEFAULT NOW(),
  UNIQUE(gr_number, gr_line_number)
);

CREATE INDEX IF NOT EXISTS idx_gr_number ON goods_receipt(gr_number);
CREATE INDEX IF NOT EXISTS idx_gr_date ON goods_receipt(gr_date);
CREATE INDEX IF NOT EXISTS idx_gr_po ON goods_receipt(po_number);
CREATE INDEX IF NOT EXISTS idx_gr_material ON goods_receipt(material_id);

ALTER TABLE goods_receipt ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to goods_receipt"
  ON goods_receipt FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to goods_receipt"
  ON goods_receipt FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Goods Issuance (ERP Transactional)
CREATE TABLE IF NOT EXISTS goods_issuance (
  gi_line_id BIGSERIAL PRIMARY KEY,
  gi_number VARCHAR(50) NOT NULL,
  gi_line_number INT NOT NULL,
  transaction_date DATE DEFAULT CURRENT_DATE,
  material_id VARCHAR(50),
  unit_owner_id VARCHAR(50),
  storage_location_id VARCHAR(50),
  qty_issued DECIMAL(18,4) DEFAULT 0,
  unit_price DECIMAL(18,4) DEFAULT 0,
  total_value DECIMAL(18,2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'IDR',
  reason_code VARCHAR(50),
  cost_center VARCHAR(50),
  created_date TIMESTAMP DEFAULT NOW(),
  UNIQUE(gi_number, gi_line_number)
);

CREATE INDEX IF NOT EXISTS idx_gi_number ON goods_issuance(gi_number);
CREATE INDEX IF NOT EXISTS idx_gi_date ON goods_issuance(transaction_date);
CREATE INDEX IF NOT EXISTS idx_gi_material ON goods_issuance(material_id);

ALTER TABLE goods_issuance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to goods_issuance"
  ON goods_issuance FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to goods_issuance"
  ON goods_issuance FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Inventory Snapshot (ERP Transactional)
CREATE TABLE IF NOT EXISTS inventory_snapshot (
  inventory_snapshot_id BIGSERIAL PRIMARY KEY,
  snapshot_date DATE DEFAULT CURRENT_DATE,
  material_id VARCHAR(50) NOT NULL,
  storage_location_id VARCHAR(50) NOT NULL,
  unit_owner_id VARCHAR(50),
  stock_qty DECIMAL(18,4) DEFAULT 0,
  stock_value DECIMAL(18,2) DEFAULT 0,
  unit_price_map DECIMAL(18,4) DEFAULT 0,
  optimized_stock_qty DECIMAL(18,4) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'IDR',
  created_date TIMESTAMP DEFAULT NOW(),
  UNIQUE(material_id, storage_location_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_inv_snapshot_date ON inventory_snapshot(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_inv_material ON inventory_snapshot(material_id);
CREATE INDEX IF NOT EXISTS idx_inv_location ON inventory_snapshot(storage_location_id);

ALTER TABLE inventory_snapshot ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to inventory_snapshot"
  ON inventory_snapshot FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to inventory_snapshot"
  ON inventory_snapshot FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Demand (ERP Transactional)
CREATE TABLE IF NOT EXISTS demand (
  demand_id BIGSERIAL PRIMARY KEY,
  demand_type VARCHAR(50) NOT NULL,
  material_id VARCHAR(50),
  unit_requestor_id VARCHAR(50),
  requirement_date DATE,
  used_date DATE,
  demand_qty DECIMAL(18,4) DEFAULT 0,
  is_selected_for_procurement BOOLEAN DEFAULT false,
  created_date TIMESTAMP DEFAULT NOW(),
  modified_date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_demand_type ON demand(demand_type);
CREATE INDEX IF NOT EXISTS idx_demand_material ON demand(material_id);
CREATE INDEX IF NOT EXISTS idx_demand_unit ON demand(unit_requestor_id);
CREATE INDEX IF NOT EXISTS idx_demand_date ON demand(requirement_date);

ALTER TABLE demand ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to demand"
  ON demand FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to demand"
  ON demand FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Forecast (ERP Transactional)  
CREATE TABLE IF NOT EXISTS forecast (
  forecast_id BIGSERIAL PRIMARY KEY,
  forecast_type VARCHAR(50) NOT NULL,
  material_id VARCHAR(50),
  unit_requestor_id VARCHAR(50),
  forecast_date DATE DEFAULT CURRENT_DATE,
  requirement_date DATE,
  forecast_qty DECIMAL(18,4) DEFAULT 0,
  forecast_value DECIMAL(18,2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'IDR',
  created_date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forecast_type ON forecast(forecast_type);
CREATE INDEX IF NOT EXISTS idx_forecast_material ON forecast(material_id);
CREATE INDEX IF NOT EXISTS idx_forecast_date ON forecast(forecast_date);

ALTER TABLE forecast ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to forecast"
  ON forecast FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to forecast"
  ON forecast FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Procurement Request (ERP Transactional)
CREATE TABLE IF NOT EXISTS procurement_request (
  pr_id BIGSERIAL PRIMARY KEY,
  pr_number VARCHAR(50) NOT NULL,
  pr_line_number INT NOT NULL,
  pr_type VARCHAR(50) NOT NULL,
  pr_status VARCHAR(50) DEFAULT 'DRAFT',
  pr_date DATE DEFAULT CURRENT_DATE,
  material_id VARCHAR(50),
  vendor_id VARCHAR(50),
  unit_requestor_id VARCHAR(50),
  requirement_date DATE,
  delivery_date DATE,
  demand_qty DECIMAL(18,4) DEFAULT 0,
  qty_ordered DECIMAL(18,4) DEFAULT 0,
  unit_price DECIMAL(18,4) DEFAULT 0,
  pr_value DECIMAL(18,2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'IDR',
  created_date TIMESTAMP DEFAULT NOW(),
  UNIQUE(pr_number, pr_line_number)
);

CREATE INDEX IF NOT EXISTS idx_pr_number ON procurement_request(pr_number);
CREATE INDEX IF NOT EXISTS idx_pr_type ON procurement_request(pr_type);
CREATE INDEX IF NOT EXISTS idx_pr_status ON procurement_request(pr_status);
CREATE INDEX IF NOT EXISTS idx_pr_material ON procurement_request(material_id);

ALTER TABLE procurement_request ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to procurement_request"
  ON procurement_request FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to procurement_request"
  ON procurement_request FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Asset (ERP Transactional)
CREATE TABLE IF NOT EXISTS asset (
  asset_id BIGSERIAL PRIMARY KEY,
  asset_number VARCHAR(50) NOT NULL UNIQUE,
  material_id VARCHAR(50),
  unit_owner_id VARCHAR(50),
  bom_structure JSONB,
  quantity DECIMAL(18,4) DEFAULT 1,
  maintenance_date DATE,
  next_maintenance_date DATE,
  asset_status VARCHAR(50) DEFAULT 'ACTIVE',
  created_date TIMESTAMP DEFAULT NOW(),
  modified_date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_asset_number ON asset(asset_number);
CREATE INDEX IF NOT EXISTS idx_asset_material ON asset(material_id);
CREATE INDEX IF NOT EXISTS idx_asset_unit ON asset(unit_owner_id);

ALTER TABLE asset ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to asset"
  ON asset FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to asset"
  ON asset FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Price Estimation (ERP Transactional)
CREATE TABLE IF NOT EXISTS price_estimation (
  price_estimation_id BIGSERIAL PRIMARY KEY,
  estimation_type VARCHAR(50) NOT NULL,
  material_id VARCHAR(50),
  estimation_date DATE DEFAULT CURRENT_DATE,
  material_price DECIMAL(18,4) DEFAULT 0,
  should_cost_calculation TEXT,
  should_cost_value DECIMAL(18,4) DEFAULT 0,
  component_id VARCHAR(50),
  component_price DECIMAL(18,4) DEFAULT 0,
  cost_variable_name VARCHAR(200),
  cost_variable_rate DECIMAL(18,6) DEFAULT 0,
  rate_source VARCHAR(200),
  data_source VARCHAR(200),
  currency VARCHAR(10) DEFAULT 'IDR',
  created_date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_est_type ON price_estimation(estimation_type);
CREATE INDEX IF NOT EXISTS idx_price_est_material ON price_estimation(material_id);
CREATE INDEX IF NOT EXISTS idx_price_est_date ON price_estimation(estimation_date);

ALTER TABLE price_estimation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to price_estimation"
  ON price_estimation FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to price_estimation"
  ON price_estimation FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Sourcing Event (ERP Transactional)
CREATE TABLE IF NOT EXISTS sourcing_event (
  sourcing_event_line_id BIGSERIAL PRIMARY KEY,
  sourcing_event_id VARCHAR(50) NOT NULL,
  sourcing_event_name VARCHAR(200),
  event_status VARCHAR(50) DEFAULT 'DRAFT',
  material_id VARCHAR(50),
  material_qty DECIMAL(18,4) DEFAULT 0,
  estimated_price DECIMAL(18,4) DEFAULT 0,
  tender_start_date DATE,
  tender_end_date DATE,
  tender_milestone_date JSONB,
  milestone_progress VARCHAR(200),
  assigned_procurement_executioner VARCHAR(200),
  tender_documents JSONB,
  currency VARCHAR(10) DEFAULT 'IDR',
  created_date TIMESTAMP DEFAULT NOW(),
  modified_date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sourcing_event_id ON sourcing_event(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_status ON sourcing_event(event_status);
CREATE INDEX IF NOT EXISTS idx_sourcing_material ON sourcing_event(material_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_start ON sourcing_event(tender_start_date);

ALTER TABLE sourcing_event ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to sourcing_event"
  ON sourcing_event FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to sourcing_event"
  ON sourcing_event FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Tender Scoring (ERP Transactional)
CREATE TABLE IF NOT EXISTS tender_scoring (
  tender_scoring_id BIGSERIAL PRIMARY KEY,
  sourcing_event_id VARCHAR(50) NOT NULL,
  sourcing_event_line_id BIGINT,
  vendor_id VARCHAR(50),
  selection_criteria VARCHAR(200),
  criteria_weight DECIMAL(5,2) DEFAULT 0,
  criteria_score DECIMAL(5,2) DEFAULT 0,
  weighted_score DECIMAL(5,2) DEFAULT 0,
  total_score DECIMAL(5,2) DEFAULT 0,
  is_winner BOOLEAN DEFAULT false,
  evaluation_date DATE DEFAULT CURRENT_DATE,
  evaluator VARCHAR(200),
  created_date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tender_scoring_event ON tender_scoring(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_tender_scoring_vendor ON tender_scoring(vendor_id);
CREATE INDEX IF NOT EXISTS idx_tender_scoring_winner ON tender_scoring(is_winner);

ALTER TABLE tender_scoring ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to tender_scoring"
  ON tender_scoring FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to tender_scoring"
  ON tender_scoring FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Supplier Performance (ERP Transactional)
CREATE TABLE IF NOT EXISTS supplier_performance (
  supplier_performance_id BIGSERIAL PRIMARY KEY,
  evaluation_type VARCHAR(50) NOT NULL,
  vendor_id VARCHAR(50),
  contract_id VARCHAR(50),
  evaluation_period_start DATE,
  evaluation_period_end DATE,
  evaluation_date DATE DEFAULT CURRENT_DATE,
  quality_score DECIMAL(5,2) DEFAULT 0,
  delivery_score DECIMAL(5,2) DEFAULT 0,
  cost_score DECIMAL(5,2) DEFAULT 0,
  service_score DECIMAL(5,2) DEFAULT 0,
  total_aggregate_score DECIMAL(5,2) DEFAULT 0,
  qualification_score DECIMAL(5,2) DEFAULT 0,
  qualification_status VARCHAR(50),
  created_date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_supplier_perf_vendor ON supplier_performance(vendor_id);
CREATE INDEX IF NOT EXISTS idx_supplier_perf_contract ON supplier_performance(contract_id);
CREATE INDEX IF NOT EXISTS idx_supplier_perf_type ON supplier_performance(evaluation_type);

ALTER TABLE supplier_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to supplier_performance"
  ON supplier_performance FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to supplier_performance"
  ON supplier_performance FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fulfillment (ERP Transactional)
CREATE TABLE IF NOT EXISTS fulfillment (
  fulfillment_id BIGSERIAL PRIMARY KEY,
  fulfillment_type VARCHAR(50) NOT NULL,
  fulfillment_number VARCHAR(50) NOT NULL UNIQUE,
  material_id VARCHAR(50),
  unit_id VARCHAR(50),
  fulfillment_date DATE DEFAULT CURRENT_DATE,
  planned_qty DECIMAL(18,4) DEFAULT 0,
  actual_qty DECIMAL(18,4) DEFAULT 0,
  fulfillment_status VARCHAR(50) DEFAULT 'PLANNED',
  notification_message TEXT,
  created_date TIMESTAMP DEFAULT NOW(),
  modified_date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fulfillment_type ON fulfillment(fulfillment_type);
CREATE INDEX IF NOT EXISTS idx_fulfillment_material ON fulfillment(material_id);
CREATE INDEX IF NOT EXISTS idx_fulfillment_unit ON fulfillment(unit_id);
CREATE INDEX IF NOT EXISTS idx_fulfillment_date ON fulfillment(fulfillment_date);

ALTER TABLE fulfillment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to fulfillment"
  ON fulfillment FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to fulfillment"
  ON fulfillment FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Invoice (ERP Transactional)
CREATE TABLE IF NOT EXISTS invoice (
  invoice_line_id BIGSERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) NOT NULL,
  invoice_line_number INT NOT NULL,
  invoice_date DATE DEFAULT CURRENT_DATE,
  invoice_type VARCHAR(50) DEFAULT 'STANDARD',
  po_number VARCHAR(50),
  gr_number VARCHAR(50),
  vendor_id VARCHAR(50),
  contract_id VARCHAR(50),
  material_id VARCHAR(50),
  qty_invoiced DECIMAL(18,4) DEFAULT 0,
  unit_price DECIMAL(18,4) DEFAULT 0,
  line_amount DECIMAL(18,2) DEFAULT 0,
  tax_amount DECIMAL(18,2) DEFAULT 0,
  total_amount DECIMAL(18,2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'IDR',
  payment_status VARCHAR(50) DEFAULT 'PENDING',
  due_date DATE,
  created_date TIMESTAMP DEFAULT NOW(),
  UNIQUE(invoice_number, invoice_line_number)
);

CREATE INDEX IF NOT EXISTS idx_invoice_number ON invoice(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoice_date ON invoice(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoice_vendor ON invoice(vendor_id);
CREATE INDEX IF NOT EXISTS idx_invoice_po ON invoice(po_number);

ALTER TABLE invoice ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to invoice"
  ON invoice FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to invoice"
  ON invoice FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Payment Term (ERP Transactional)
CREATE TABLE IF NOT EXISTS payment_term (
  payment_term_id BIGSERIAL PRIMARY KEY,
  contract_id VARCHAR(50),
  invoice_number VARCHAR(50),
  term_number INT NOT NULL,
  number_of_terms INT DEFAULT 1,
  payment_type VARCHAR(50),
  payee_information JSONB,
  payment_value DECIMAL(18,2) DEFAULT 0,
  payment_percentage DECIMAL(5,2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'IDR',
  payment_due_date DATE,
  payment_date DATE,
  payment_status VARCHAR(50) DEFAULT 'PENDING',
  created_date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_term_contract ON payment_term(contract_id);
CREATE INDEX IF NOT EXISTS idx_payment_term_invoice ON payment_term(invoice_number);
CREATE INDEX IF NOT EXISTS idx_payment_term_due ON payment_term(payment_due_date);
CREATE INDEX IF NOT EXISTS idx_payment_term_status ON payment_term(payment_status);

ALTER TABLE payment_term ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to payment_term"
  ON payment_term FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to payment_term"
  ON payment_term FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Settlement (ERP Transactional)
CREATE TABLE IF NOT EXISTS settlement (
  settlement_id BIGSERIAL PRIMARY KEY,
  settlement_number VARCHAR(50) NOT NULL UNIQUE,
  settlement_date DATE DEFAULT CURRENT_DATE,
  settlement_type VARCHAR(50),
  vendor_id VARCHAR(50),
  contract_id VARCHAR(50),
  invoice_number VARCHAR(50),
  settlement_amount DECIMAL(18,2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'IDR',
  settlement_status VARCHAR(50) DEFAULT 'PENDING',
  created_date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_settlement_number ON settlement(settlement_number);
CREATE INDEX IF NOT EXISTS idx_settlement_date ON settlement(settlement_date);
CREATE INDEX IF NOT EXISTS idx_settlement_vendor ON settlement(vendor_id);
CREATE INDEX IF NOT EXISTS idx_settlement_contract ON settlement(contract_id);

ALTER TABLE settlement ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to settlement"
  ON settlement FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to settlement"
  ON settlement FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Berita Acara (ERP Transactional)
CREATE TABLE IF NOT EXISTS berita_acara (
  ba_id BIGSERIAL PRIMARY KEY,
  ba_number VARCHAR(50) NOT NULL UNIQUE,
  ba_type VARCHAR(50) NOT NULL,
  ba_date DATE DEFAULT CURRENT_DATE,
  contract_id VARCHAR(50),
  vendor_id VARCHAR(50),
  material_services_list JSONB,
  fulfilled_items_list JSONB,
  approver_checker_details JSONB,
  is_finalized BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  qualification_result VARCHAR(50),
  created_date TIMESTAMP DEFAULT NOW(),
  modified_date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ba_number ON berita_acara(ba_number);
CREATE INDEX IF NOT EXISTS idx_ba_type ON berita_acara(ba_type);
CREATE INDEX IF NOT EXISTS idx_ba_date ON berita_acara(ba_date);
CREATE INDEX IF NOT EXISTS idx_ba_contract ON berita_acara(contract_id);
CREATE INDEX IF NOT EXISTS idx_ba_vendor ON berita_acara(vendor_id);

ALTER TABLE berita_acara ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to berita_acara"
  ON berita_acara FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to berita_acara"
  ON berita_acara FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
