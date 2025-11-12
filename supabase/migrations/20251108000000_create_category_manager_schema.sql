/*
  # Create Category Manager Schema

  1. New Tables
    - `dim_category` - Master category hierarchy and classification
    - `dim_material` - Material master data linked to categories
    - `fact_spend_summary` - Aggregated spend data by category
    - `fact_supplier_performance` - Supplier KPIs and ratings
    - `fact_supplier_feedback` - Voice of Supplier data
    - `fact_mi_reference` - Market Intelligence reference data
    - `fact_kraljic_matrix` - Kraljic positioning with auto-calculation
    - `fact_category_strategy` - Strategic levers and action plans
    - `fact_category_action_plan` - Detailed playbook initiatives
    - `fact_category_ai_insight` - AI-generated recommendations
    - `fact_category_audit_log` - Full audit trail

  2. Security
    - Enable RLS on all tables
    - Public read access for demo
    - Authenticated users can create/update

  3. Important Notes
    - Two pre-seeded datasets: Generation Equipment & Electrical/IT Infrastructure
    - Full integration with Spend Analysis, MI, Cost Estimator
    - AI insight system with confidence scoring
    - Approval workflow compatible with CLM pattern
*/

-- Dimension: Category Master
CREATE TABLE IF NOT EXISTS dim_category (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text UNIQUE NOT NULL,
  category_name text NOT NULL,
  parent_category_code text,
  level integer NOT NULL CHECK (level BETWEEN 1 AND 4),
  classification text NOT NULL CHECK (classification IN ('Centralized', 'Decentralized', 'Pending')),
  classification_rationale text,
  total_annual_spend numeric DEFAULT 0,
  business_units_count integer DEFAULT 0,
  vendor_count integer DEFAULT 0,
  strategic_importance text CHECK (strategic_importance IN ('High', 'Medium', 'Low')),
  dataset_id text NOT NULL CHECK (dataset_id IN ('DATASET_A', 'DATASET_B')),
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Dimension: Material Master
CREATE TABLE IF NOT EXISTS dim_material (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_code text UNIQUE NOT NULL,
  material_name text NOT NULL,
  category_code text NOT NULL,
  unit_of_measure text NOT NULL,
  standard_price numeric,
  lead_time_days integer,
  criticality text CHECK (criticality IN ('Critical', 'Important', 'Standard')),
  substitution_available boolean DEFAULT false,
  dataset_id text NOT NULL,
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now()
);

-- Fact: Spend Summary
CREATE TABLE IF NOT EXISTS fact_spend_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text NOT NULL,
  business_unit text NOT NULL,
  fiscal_year integer NOT NULL,
  fiscal_quarter integer CHECK (fiscal_quarter BETWEEN 1 AND 4),
  total_spend numeric NOT NULL DEFAULT 0,
  contract_coverage_pct numeric DEFAULT 0,
  maverick_spend_pct numeric DEFAULT 0,
  vendor_count integer DEFAULT 0,
  po_count integer DEFAULT 0,
  avg_po_value numeric,
  dataset_id text NOT NULL,
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now()
);

-- Fact: Supplier Performance
CREATE TABLE IF NOT EXISTS fact_supplier_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id text NOT NULL,
  vendor_name text NOT NULL,
  category_code text NOT NULL,
  evaluation_period text NOT NULL,
  delivery_score numeric CHECK (delivery_score BETWEEN 0 AND 100),
  quality_score numeric CHECK (quality_score BETWEEN 0 AND 100),
  cost_score numeric CHECK (cost_score BETWEEN 0 AND 100),
  collaboration_score numeric CHECK (collaboration_score BETWEEN 0 AND 100),
  overall_score numeric CHECK (overall_score BETWEEN 0 AND 100),
  total_po_value numeric DEFAULT 0,
  on_time_delivery_pct numeric,
  defect_rate_ppm numeric,
  dataset_id text NOT NULL,
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now()
);

-- Fact: Supplier Feedback
CREATE TABLE IF NOT EXISTS fact_supplier_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id text NOT NULL,
  vendor_name text NOT NULL,
  category_code text NOT NULL,
  feedback_date date NOT NULL,
  feedback_type text CHECK (feedback_type IN ('Payment', 'Forecasting', 'Collaboration', 'Process', 'Quality', 'General')),
  sentiment text CHECK (sentiment IN ('Positive', 'Neutral', 'Negative')),
  feedback_text text NOT NULL,
  action_required boolean DEFAULT false,
  action_taken text,
  dataset_id text NOT NULL,
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now()
);

-- Fact: Market Intelligence Reference
CREATE TABLE IF NOT EXISTS fact_mi_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text NOT NULL,
  reference_period text NOT NULL,
  supply_demand_balance text CHECK (supply_demand_balance IN ('Tight', 'Balanced', 'Surplus')),
  price_trend text CHECK (price_trend IN ('Rising', 'Stable', 'Declining')),
  price_volatility_index numeric CHECK (price_volatility_index BETWEEN 0 AND 10),
  capacity_utilization_pct numeric,
  innovation_index numeric CHECK (innovation_index BETWEEN 0 AND 10),
  market_concentration text CHECK (market_concentration IN ('High', 'Medium', 'Low')),
  supply_risk_score numeric CHECK (supply_risk_score BETWEEN 0 AND 10),
  forecasted_growth_pct numeric,
  key_insights text,
  dataset_id text NOT NULL,
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now()
);

-- Fact: Kraljic Matrix
CREATE TABLE IF NOT EXISTS fact_kraljic_matrix (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text NOT NULL,
  profit_impact_score numeric NOT NULL CHECK (profit_impact_score BETWEEN 0 AND 100),
  supply_risk_score numeric NOT NULL CHECK (supply_risk_score BETWEEN 0 AND 100),
  kraljic_quadrant text NOT NULL CHECK (kraljic_quadrant IN ('Strategic', 'Leverage', 'Bottleneck', 'Routine')),
  calculation_method text DEFAULT 'Auto',
  manual_override boolean DEFAULT false,
  override_rationale text,
  approved_by text,
  approved_at timestamptz,
  dataset_id text NOT NULL,
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fact: Category Strategy
CREATE TABLE IF NOT EXISTS fact_category_strategy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text NOT NULL,
  kraljic_quadrant text NOT NULL,
  strategic_lever text NOT NULL,
  lever_description text,
  impact_score numeric CHECK (impact_score BETWEEN 0 AND 10),
  implementation_complexity text CHECK (implementation_complexity IN ('Low', 'Medium', 'High')),
  forecasted_savings_pct numeric,
  forecasted_savings_amount numeric,
  implementation_timeline text,
  status text NOT NULL DEFAULT 'Proposed' CHECK (status IN ('Proposed', 'Under Review', 'Approved', 'In Progress', 'Completed')),
  approved_by text,
  approved_at timestamptz,
  dataset_id text NOT NULL,
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fact: Category Action Plan
CREATE TABLE IF NOT EXISTS fact_category_action_plan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('Supplier Development', 'Rationalization', 'Cost Optimization', 'Innovation', 'Process Improvement', 'Risk Mitigation')),
  action_title text NOT NULL,
  action_description text NOT NULL,
  source_analysis text CHECK (source_analysis IN ('Internal', 'External', 'VoC', 'VoS', 'AI Generated')),
  priority text CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
  owner text,
  target_completion_date date,
  status text NOT NULL DEFAULT 'Planned' CHECK (status IN ('Planned', 'In Progress', 'Completed', 'Cancelled')),
  expected_impact_amount numeric,
  actual_impact_amount numeric,
  kpi_linkage text,
  dataset_id text NOT NULL,
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fact: Category AI Insight
CREATE TABLE IF NOT EXISTS fact_category_ai_insight (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text,
  insight_type text NOT NULL CHECK (insight_type IN ('Predictive', 'Prescriptive', 'Explanatory', 'Diagnostic')),
  insight_title text NOT NULL,
  insight_description text NOT NULL,
  confidence_score numeric CHECK (confidence_score BETWEEN 0 AND 100),
  financial_impact_estimate numeric,
  risk_level text CHECK (risk_level IN ('Low', 'Moderate', 'Critical')),
  ai_source_type text CHECK (ai_source_type IN ('Predictive Model', 'Prescriptive Analytics', 'Pattern Recognition', 'Simulation')),
  key_variables jsonb,
  user_action text CHECK (user_action IN ('Pending', 'Accepted', 'Rejected', 'Deferred')),
  user_comment text,
  dataset_id text NOT NULL,
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fact: Category Audit Log
CREATE TABLE IF NOT EXISTS fact_category_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text,
  action_type text NOT NULL,
  action_description text NOT NULL,
  user_id text NOT NULL,
  user_name text NOT NULL,
  before_value jsonb,
  after_value jsonb,
  ip_address text,
  dataset_id text NOT NULL,
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE dim_category ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_spend_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_supplier_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_supplier_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_mi_reference ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_kraljic_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_category_strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_category_action_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_category_ai_insight ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_category_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read for demo)
CREATE POLICY "Anyone can view categories" ON dim_category FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage categories" ON dim_category FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can view materials" ON dim_material FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage materials" ON dim_material FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can view spend summary" ON fact_spend_summary FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage spend summary" ON fact_spend_summary FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can view supplier performance" ON fact_supplier_performance FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage supplier performance" ON fact_supplier_performance FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can view supplier feedback" ON fact_supplier_feedback FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage supplier feedback" ON fact_supplier_feedback FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can view MI reference" ON fact_mi_reference FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage MI reference" ON fact_mi_reference FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can view kraljic matrix" ON fact_kraljic_matrix FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage kraljic matrix" ON fact_kraljic_matrix FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can view category strategy" ON fact_category_strategy FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage category strategy" ON fact_category_strategy FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can view action plan" ON fact_category_action_plan FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage action plan" ON fact_category_action_plan FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can view AI insights" ON fact_category_ai_insight FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage AI insights" ON fact_category_ai_insight FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can view audit log" ON fact_category_audit_log FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create audit log" ON fact_category_audit_log FOR INSERT TO authenticated WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_category_code ON dim_category(category_code);
CREATE INDEX IF NOT EXISTS idx_category_dataset ON dim_category(dataset_id);
CREATE INDEX IF NOT EXISTS idx_material_category ON dim_material(category_code);
CREATE INDEX IF NOT EXISTS idx_spend_category ON fact_spend_summary(category_code);
CREATE INDEX IF NOT EXISTS idx_supplier_perf_category ON fact_supplier_performance(category_code);
CREATE INDEX IF NOT EXISTS idx_kraljic_category ON fact_kraljic_matrix(category_code);
CREATE INDEX IF NOT EXISTS idx_strategy_category ON fact_category_strategy(category_code);
CREATE INDEX IF NOT EXISTS idx_action_plan_category ON fact_category_action_plan(category_code);
CREATE INDEX IF NOT EXISTS idx_ai_insight_category ON fact_category_ai_insight(category_code);
