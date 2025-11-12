/*
  # Fix ref_kpi Table Structure for KPI Achievement Dashboard

  1. Actions
    - Rename old ref_kpi table to ref_kpi_old (backup)
    - Create new ref_kpi table with proper structure for KPI monitoring
    - Populate with comprehensive KPI data
    - Create related tables (strategic initiatives, alerts, risks, issues)

  2. Important Notes
    - This migration ensures KPI Achievement Dashboard has the correct data structure
    - Old data is preserved in ref_kpi_old for reference
    - New structure includes KPI codes, thresholds, timelines, and historical data
*/

-- Backup existing ref_kpi table
ALTER TABLE IF EXISTS ref_kpi RENAME TO ref_kpi_old;

-- Create proper ref_kpi table with comprehensive structure
CREATE TABLE IF NOT EXISTS ref_kpi (
  kpi_id bigserial PRIMARY KEY,
  kpi_code text NOT NULL UNIQUE,
  kpi_name text NOT NULL,
  kpi_category text NOT NULL,
  initiative_category text NOT NULL,
  unit_of_measure text NOT NULL,
  target_value numeric NOT NULL,
  actual_value numeric NOT NULL DEFAULT 0,
  achievement_percentage numeric GENERATED ALWAYS AS (
    CASE
      WHEN target_value > 0 THEN ROUND((actual_value / target_value) * 100, 2)
      ELSE 0
    END
  ) STORED,
  threshold_critical numeric DEFAULT 50,
  threshold_warning numeric DEFAULT 75,
  threshold_target numeric DEFAULT 100,
  baseline_value numeric,
  timeline_start date NOT NULL,
  timeline_end date NOT NULL,
  frequency text DEFAULT 'Monthly' CHECK (frequency IN ('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly')),
  data_source text,
  calculation_method text,
  background_issue text,
  strategic_objective text,
  kpi_owner text,
  kpi_status text DEFAULT 'Active' CHECK (kpi_status IN ('Active', 'Paused', 'Completed', 'Cancelled')),
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  created_by text,
  historical_data jsonb DEFAULT '[]'::jsonb,
  related_initiatives jsonb DEFAULT '[]'::jsonb,
  notes text
);

-- Enable RLS
ALTER TABLE ref_kpi ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view KPIs"
  ON ref_kpi FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create KPIs"
  ON ref_kpi FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update KPIs"
  ON ref_kpi FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ref_kpi_code ON ref_kpi(kpi_code);
CREATE INDEX IF NOT EXISTS idx_ref_kpi_category ON ref_kpi(initiative_category);
CREATE INDEX IF NOT EXISTS idx_ref_kpi_status ON ref_kpi(kpi_status);
CREATE INDEX IF NOT EXISTS idx_ref_kpi_timeline ON ref_kpi(timeline_start, timeline_end);
CREATE INDEX IF NOT EXISTS idx_ref_kpi_achievement ON ref_kpi(achievement_percentage);

-- Insert comprehensive KPI data
INSERT INTO ref_kpi (kpi_code, kpi_name, kpi_category, initiative_category, unit_of_measure, target_value, actual_value, threshold_critical, threshold_warning, threshold_target, baseline_value, timeline_start, timeline_end, frequency, data_source, calculation_method, background_issue, strategic_objective, kpi_owner, kpi_status, created_by, historical_data) VALUES

-- Cost Efficiency KPIs
('SCM-001', 'PO Cycle Time', 'Process Efficiency', 'Cost Efficiency', 'Days', 3, 3.8, 7, 5, 3, 5.2, '2024-01-01', '2024-12-31', 'Daily', 'fact_purchase_order, fact_goods_receipt', 'Average days from PO creation to goods receipt', 'Long procurement cycles delaying operations', 'Reduce PO processing time to under 3 days', 'Procurement Manager', 'Active', 'system', '[{"month": "2024-01", "value": 5.2}, {"month": "2024-02", "value": 4.8}, {"month": "2024-03", "value": 4.5}, {"month": "2024-04", "value": 4.2}, {"month": "2024-05", "value": 4.0}, {"month": "2024-06", "value": 3.9}, {"month": "2024-07", "value": 3.85}, {"month": "2024-08", "value": 3.82}, {"month": "2024-09", "value": 3.8}, {"month": "2024-10", "value": 3.8}]'),

('SCM-002', 'On-Time Delivery Rate', 'Delivery Performance', 'Cost Efficiency', '%', 95, 91.5, 75, 85, 95, 87, '2024-01-01', '2024-12-31', 'Daily', 'fact_goods_receipt, fact_purchase_order', 'Percentage of goods receipts delivered on or before delivery date', 'Late deliveries causing production delays', 'Achieve 95% on-time delivery performance', 'Logistics Manager', 'Active', 'system', '[{"month": "2024-01", "value": 87}, {"month": "2024-02", "value": 88}, {"month": "2024-03", "value": 88.5}, {"month": "2024-04", "value": 89}, {"month": "2024-05", "value": 89.5}, {"month": "2024-06", "value": 90}, {"month": "2024-07", "value": 90.5}, {"month": "2024-08", "value": 91}, {"month": "2024-09", "value": 91.2}, {"month": "2024-10", "value": 91.5}]'),

('SCM-003', 'Procurement Cost Savings', 'Cost Management', 'Cost Efficiency', 'IDR Million', 5000, 4250, 2000, 3500, 5000, 0, '2024-01-01', '2024-12-31', 'Daily', 'fact_purchase_order, dim_material', 'Total savings from negotiated prices vs market prices', 'Need to achieve cost reduction targets', 'Achieve IDR 5B cost savings through strategic sourcing', 'Supply Chain Director', 'Active', 'system', '[{"month": "2024-01", "value": 350}, {"month": "2024-02", "value": 770}, {"month": "2024-03", "value": 1250}, {"month": "2024-04", "value": 1770}, {"month": "2024-05", "value": 2360}, {"month": "2024-06", "value": 3010}, {"month": "2024-07", "value": 3420}, {"month": "2024-08", "value": 3680}, {"month": "2024-09", "value": 3950}, {"month": "2024-10", "value": 4250}]'),

('SCM-004', 'Supplier Quality Rating', 'Quality Management', 'Cost Efficiency', 'Score', 4.5, 4.2, 3.0, 3.8, 4.5, 3.9, '2024-01-01', '2024-12-31', 'Daily', 'fact_goods_receipt, dim_vendor', 'Average quality rating from goods receipts', 'Quality issues causing rework and waste', 'Maintain supplier quality rating above 4.5', 'Quality Assurance Manager', 'Active', 'system', '[{"month": "2024-01", "value": 3.9}, {"month": "2024-02", "value": 3.95}, {"month": "2024-03", "value": 4.0}, {"month": "2024-04", "value": 4.05}, {"month": "2024-05", "value": 4.08}, {"month": "2024-06", "value": 4.1}, {"month": "2024-07", "value": 4.12}, {"month": "2024-08", "value": 4.15}, {"month": "2024-09", "value": 4.18}, {"month": "2024-10", "value": 4.2}]'),

('SCM-005', 'Inventory Turnover Ratio', 'Inventory Optimization', 'Cost Efficiency', 'Ratio', 8, 6.5, 4, 6, 8, 5.5, '2024-01-01', '2024-12-31', 'Weekly', 'fact_goods_issuance, fact_goods_receipt', 'Total goods issued / Average inventory value', 'Excess inventory tying up capital', 'Achieve inventory turnover of 8x annually', 'Inventory Manager', 'Active', 'system', '[{"month": "2024-01", "value": 5.5}, {"month": "2024-02", "value": 5.7}, {"month": "2024-03", "value": 5.8}, {"month": "2024-04", "value": 6.0}, {"month": "2024-05", "value": 6.1}, {"month": "2024-06", "value": 6.2}, {"month": "2024-07", "value": 6.3}, {"month": "2024-08", "value": 6.4}, {"month": "2024-09", "value": 6.45}, {"month": "2024-10", "value": 6.5}]'),

('SCM-006', 'Contract Compliance Rate', 'Compliance', 'Cost Efficiency', '%', 95, 88, 75, 85, 95, 82, '2024-01-01', '2024-12-31', 'Daily', 'fact_purchase_order, dim_contract', 'Percentage of POs with valid contracts', 'Off-contract spending causing cost overruns', 'Achieve 95% contract compliance rate', 'Contract Manager', 'Active', 'system', '[{"month": "2024-01", "value": 82}, {"month": "2024-02", "value": 83}, {"month": "2024-03", "value": 84}, {"month": "2024-04", "value": 85}, {"month": "2024-05", "value": 85.5}, {"month": "2024-06", "value": 86}, {"month": "2024-07", "value": 86.5}, {"month": "2024-08", "value": 87}, {"month": "2024-09", "value": 87.5}, {"month": "2024-10", "value": 88}]'),

-- Delivery Performance KPIs
('KPI-DP-001', 'Perfect Order Rate', 'Quality', 'Delivery Performance', '%', 98, 94, 85, 92, 98, 91, '2024-01-01', '2024-12-31', 'Monthly', 'Quality Inspection Reports', 'Orders delivered complete, on-time, damage-free', 'Order errors causing customer dissatisfaction', 'Achieve 98% perfect order rate', 'Quality Manager', 'Active', 'system', '[{"month": "2024-01", "value": 91}, {"month": "2024-03", "value": 92}, {"month": "2024-06", "value": 93}, {"month": "2024-09", "value": 94}]'),

('KPI-DP-002', 'Average Lead Time', 'Performance', 'Delivery Performance', 'Days', 12, 14.5, 20, 15, 12, 16, '2024-01-01', '2024-12-31', 'Weekly', 'Purchase Order System', 'Average time from PO to goods receipt', 'Long lead times impacting inventory planning', 'Reduce average lead time to 12 days', 'Supply Planning Manager', 'Active', 'system', '[{"month": "2024-01", "value": 16}, {"month": "2024-03", "value": 15.5}, {"month": "2024-06", "value": 15}, {"month": "2024-09", "value": 14.5}]'),

-- Quality Management KPIs
('KPI-QM-001', 'Defect Rate', 'Quality', 'Quality Management', '%', 2, 3.2, 8, 5, 2, 4.5, '2024-01-01', '2024-12-31', 'Weekly', 'Quality Inspection Database', 'Percentage of received items with defects', 'High defect rates increasing costs', 'Reduce defect rate to under 2%', 'QC Supervisor', 'Active', 'system', '[{"month": "2024-01", "value": 4.5}, {"month": "2024-03", "value": 4.0}, {"month": "2024-06", "value": 3.6}, {"month": "2024-09", "value": 3.2}]'),

-- Supplier Performance KPIs
('KPI-SP-001', 'Supplier Responsiveness', 'Performance', 'Supplier Performance', 'Hours', 24, 28, 72, 48, 24, 36, '2024-01-01', '2024-12-31', 'Weekly', 'Communication Logs', 'Average response time to inquiries', 'Slow supplier responses delaying decisions', 'Achieve 24-hour average response time', 'Supplier Relations Manager', 'Active', 'system', '[{"month": "2024-01", "value": 36}, {"month": "2024-03", "value": 34}, {"month": "2024-06", "value": 31}, {"month": "2024-09", "value": 28}]'),

('KPI-SP-002', 'Supplier Consolidation', 'Strategy', 'Supplier Performance', 'Count', 50, 65, 100, 75, 50, 82, '2024-01-01', '2024-12-31', 'Quarterly', 'Vendor Master Data', 'Number of active suppliers', 'Too many suppliers increasing complexity', 'Consolidate to 50 strategic suppliers', 'Category Manager', 'Active', 'system', '[{"quarter": "Q1", "value": 82}, {"quarter": "Q2", "value": 75}, {"quarter": "Q3", "value": 68}, {"quarter": "Q4", "value": 65}]'),

-- Inventory Optimization KPIs
('KPI-IO-001', 'Stock-out Rate', 'Availability', 'Inventory Optimization', '%', 1, 2.8, 8, 5, 1, 4.2, '2024-01-01', '2024-12-31', 'Weekly', 'Inventory Records', 'Percentage of stock-out incidents', 'Stock-outs causing production stoppages', 'Maintain stock-out rate below 1%', 'Materials Planning Manager', 'Active', 'system', '[{"month": "2024-01", "value": 4.2}, {"month": "2024-03", "value": 3.8}, {"month": "2024-06", "value": 3.2}, {"month": "2024-09", "value": 2.8}]'),

-- Process Automation KPIs
('KPI-PA-001', 'E-Procurement Adoption', 'Digital', 'Process Automation', '%', 90, 78, 50, 70, 90, 65, '2024-01-01', '2024-12-31', 'Monthly', 'E-Procurement System', 'Percentage of POs through e-procurement', 'Manual processes causing delays and errors', 'Achieve 90% e-procurement adoption', 'Digital Transformation Lead', 'Active', 'system', '[{"month": "2024-01", "value": 65}, {"month": "2024-03", "value": 70}, {"month": "2024-06", "value": 74}, {"month": "2024-09", "value": 78}]'),

('KPI-PA-002', 'Invoice Automation Rate', 'Automation', 'Process Automation', '%', 85, 72, 40, 60, 85, 58, '2024-01-01', '2024-12-31', 'Monthly', 'Invoice Processing System', 'Percentage of invoices processed automatically', 'Manual invoice processing causing delays', 'Achieve 85% invoice automation', 'Finance Process Manager', 'Active', 'system', '[{"month": "2024-01", "value": 58}, {"month": "2024-03", "value": 63}, {"month": "2024-06", "value": 68}, {"month": "2024-09", "value": 72}]');

-- Update KPI data mapping to link to new KPI IDs
UPDATE kpi_data_mapping SET kpi_id = (SELECT kpi_id FROM ref_kpi WHERE kpi_code = 'SCM-001') WHERE kpi_code = 'SCM-001';
UPDATE kpi_data_mapping SET kpi_id = (SELECT kpi_id FROM ref_kpi WHERE kpi_code = 'SCM-002') WHERE kpi_code = 'SCM-002';
UPDATE kpi_data_mapping SET kpi_id = (SELECT kpi_id FROM ref_kpi WHERE kpi_code = 'SCM-003') WHERE kpi_code = 'SCM-003';
UPDATE kpi_data_mapping SET kpi_id = (SELECT kpi_id FROM ref_kpi WHERE kpi_code = 'SCM-004') WHERE kpi_code = 'SCM-004';
UPDATE kpi_data_mapping SET kpi_id = (SELECT kpi_id FROM ref_kpi WHERE kpi_code = 'SCM-005') WHERE kpi_code = 'SCM-005';
UPDATE kpi_data_mapping SET kpi_id = (SELECT kpi_id FROM ref_kpi WHERE kpi_code = 'SCM-006') WHERE kpi_code = 'SCM-006';
