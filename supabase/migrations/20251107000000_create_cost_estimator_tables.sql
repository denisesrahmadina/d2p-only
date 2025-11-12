/*
  # Cost Estimator Module - Database Schema

  1. New Tables
    - `dim_item`
      - Master data for cost estimation items
      - Includes item details, category, unit, image references

    - `fact_cost_structure_standard`
      - Standard cost breakdown by component
      - Material %, Labor %, Logistics %, Overhead %

    - `fact_cost_variable`
      - External cost factors (commodities, forex, macro indicators)
      - Time series data for historical trends

    - `fact_mi_reference`
      - Market intelligence reference documents
      - Links to reports, sources, and insights

    - `fact_cost_model_reference`
      - Historical BOQ and RFI data
      - Reference baselines from past contracts

    - `fact_cost_baseline`
      - Calculated baseline costs for items
      - Formula and component breakdown

    - `fact_cost_forecast`
      - 12-month forward-looking projections
      - Confidence intervals and scenarios

    - `fact_cost_ai_insight`
      - AI-generated recommendations and alerts
      - Priority levels and affected items

  2. Security
    - Enable RLS on all tables
    - Allow anonymous read access for demo purposes
*/

-- Master Item Dimension Table
CREATE TABLE IF NOT EXISTS dim_item (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_code text UNIQUE NOT NULL,
  item_name text NOT NULL,
  category text NOT NULL,
  sub_category text,
  unit_of_measure text NOT NULL,
  description text,
  image_url text,
  dataset text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE dim_item ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to dim_item"
  ON dim_item FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to dim_item"
  ON dim_item FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Cost Structure Standard Table
CREATE TABLE IF NOT EXISTS fact_cost_structure_standard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES dim_item(id) ON DELETE CASCADE,
  material_percentage decimal(5,2) NOT NULL,
  labor_percentage decimal(5,2) NOT NULL,
  logistics_percentage decimal(5,2) NOT NULL,
  overhead_percentage decimal(5,2) NOT NULL,
  effective_date timestamptz DEFAULT now(),
  historical_avg_material decimal(5,2),
  historical_avg_labor decimal(5,2),
  historical_avg_logistics decimal(5,2),
  historical_avg_overhead decimal(5,2),
  ai_recommendation text,
  variance_from_avg decimal(5,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT percentage_sum_check CHECK (
    material_percentage + labor_percentage + logistics_percentage + overhead_percentage = 100
  )
);

ALTER TABLE fact_cost_structure_standard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to fact_cost_structure_standard"
  ON fact_cost_structure_standard FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to fact_cost_structure_standard"
  ON fact_cost_structure_standard FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Cost Variable Table (External Factors)
CREATE TABLE IF NOT EXISTS fact_cost_variable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variable_code text NOT NULL,
  variable_name text NOT NULL,
  variable_type text NOT NULL,
  current_rate decimal(15,4) NOT NULL,
  rate_date timestamptz NOT NULL,
  previous_rate decimal(15,4),
  rate_change_percentage decimal(7,2),
  unit text,
  source_reference text,
  is_alert_active boolean DEFAULT false,
  alert_type text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fact_cost_variable ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to fact_cost_variable"
  ON fact_cost_variable FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to fact_cost_variable"
  ON fact_cost_variable FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Market Intelligence Reference Table
CREATE TABLE IF NOT EXISTS fact_mi_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code text UNIQUE NOT NULL,
  title text NOT NULL,
  document_type text NOT NULL,
  source text NOT NULL,
  publish_date timestamptz NOT NULL,
  document_url text,
  summary text,
  key_insights jsonb,
  related_variables text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fact_mi_reference ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to fact_mi_reference"
  ON fact_mi_reference FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to fact_mi_reference"
  ON fact_mi_reference FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Cost Model Reference Table (BOQ/RFI Historical Data)
CREATE TABLE IF NOT EXISTS fact_cost_model_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code text UNIQUE NOT NULL,
  item_id uuid REFERENCES dim_item(id) ON DELETE CASCADE,
  reference_type text NOT NULL,
  reference_source text NOT NULL,
  reference_date timestamptz NOT NULL,
  quantity decimal(15,4) NOT NULL,
  unit_cost decimal(15,2) NOT NULL,
  total_cost decimal(15,2) NOT NULL,
  material_cost decimal(15,2),
  labor_cost decimal(15,2),
  logistics_cost decimal(15,2),
  overhead_cost decimal(15,2),
  vendor_name text,
  contract_number text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fact_cost_model_reference ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to fact_cost_model_reference"
  ON fact_cost_model_reference FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to fact_cost_model_reference"
  ON fact_cost_model_reference FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Cost Baseline Table
CREATE TABLE IF NOT EXISTS fact_cost_baseline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES dim_item(id) ON DELETE CASCADE,
  baseline_name text NOT NULL,
  baseline_type text NOT NULL,
  reference_source text NOT NULL,
  quantity decimal(15,4) NOT NULL,
  base_unit_cost decimal(15,2) NOT NULL,
  material_cost decimal(15,2) NOT NULL,
  labor_cost decimal(15,2) NOT NULL,
  logistics_cost decimal(15,2) NOT NULL,
  overhead_cost decimal(15,2) NOT NULL,
  total_baseline_cost decimal(15,2) NOT NULL,
  calculation_formula text,
  applied_variables jsonb,
  effective_date timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  created_by text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fact_cost_baseline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to fact_cost_baseline"
  ON fact_cost_baseline FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to fact_cost_baseline"
  ON fact_cost_baseline FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Cost Forecast Table
CREATE TABLE IF NOT EXISTS fact_cost_forecast (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES dim_item(id) ON DELETE CASCADE,
  baseline_id uuid REFERENCES fact_cost_baseline(id) ON DELETE CASCADE,
  forecast_month timestamptz NOT NULL,
  forecasted_unit_cost decimal(15,2) NOT NULL,
  forecasted_total_cost decimal(15,2) NOT NULL,
  confidence_level text,
  scenario_type text DEFAULT 'baseline',
  material_cost_forecast decimal(15,2),
  labor_cost_forecast decimal(15,2),
  logistics_cost_forecast decimal(15,2),
  overhead_cost_forecast decimal(15,2),
  applied_assumptions jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fact_cost_forecast ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to fact_cost_forecast"
  ON fact_cost_forecast FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to fact_cost_forecast"
  ON fact_cost_forecast FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- AI Insight Table
CREATE TABLE IF NOT EXISTS fact_cost_ai_insight (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_code text UNIQUE NOT NULL,
  insight_type text NOT NULL,
  priority_level text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  affected_items uuid[],
  affected_variables text[],
  recommendation text,
  potential_impact_percentage decimal(7,2),
  confidence_score decimal(5,2),
  source_reference_id uuid REFERENCES fact_mi_reference(id),
  is_active boolean DEFAULT true,
  generated_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fact_cost_ai_insight ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to fact_cost_ai_insight"
  ON fact_cost_ai_insight FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to fact_cost_ai_insight"
  ON fact_cost_ai_insight FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dim_item_category ON dim_item(category);
CREATE INDEX IF NOT EXISTS idx_dim_item_dataset ON dim_item(dataset);
CREATE INDEX IF NOT EXISTS idx_cost_structure_item ON fact_cost_structure_standard(item_id);
CREATE INDEX IF NOT EXISTS idx_cost_variable_type ON fact_cost_variable(variable_type, rate_date);
CREATE INDEX IF NOT EXISTS idx_cost_model_ref_item ON fact_cost_model_reference(item_id);
CREATE INDEX IF NOT EXISTS idx_cost_baseline_item ON fact_cost_baseline(item_id, is_active);
CREATE INDEX IF NOT EXISTS idx_cost_forecast_item ON fact_cost_forecast(item_id, forecast_month);
CREATE INDEX IF NOT EXISTS idx_ai_insight_priority ON fact_cost_ai_insight(priority_level, is_active);
