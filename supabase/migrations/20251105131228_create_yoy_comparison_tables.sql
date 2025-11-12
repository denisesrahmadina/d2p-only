/*
  # Year-over-Year Comparison Tables for DPK Dashboard

  1. New Tables
    - `fact_yoy_forecast_accuracy`
      - Stores forecast accuracy metrics by fiscal year for year-over-year comparison
      - Fields: fiscal_year, accuracy_percentage, material_count, submission_rate
      
    - `fact_yoy_demand_submission`
      - Tracks demand submission counts by material type and fiscal year
      - Fields: fiscal_year, material_type, material_count, submission_date
      
    - `fact_yoy_budget`
      - Annual budget tracking with quarterly breakdown
      - Fields: fiscal_year, quarter, budget_amount, actual_amount, variance_percentage

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read data
    - Restrict write access to authorized roles only

  3. Sample Data
    - Populate with 2024 and 2025 comparison data for demonstration
    - Include realistic variations and trends
*/

-- Create fact_yoy_forecast_accuracy table
CREATE TABLE IF NOT EXISTS fact_yoy_forecast_accuracy (
  id SERIAL PRIMARY KEY,
  fiscal_year INTEGER NOT NULL,
  accuracy_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  material_count INTEGER NOT NULL DEFAULT 0,
  submission_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fiscal_year)
);

-- Create fact_yoy_demand_submission table
CREATE TABLE IF NOT EXISTS fact_yoy_demand_submission (
  id SERIAL PRIMARY KEY,
  fiscal_year INTEGER NOT NULL,
  material_type VARCHAR(100) NOT NULL,
  material_count INTEGER NOT NULL DEFAULT 0,
  submission_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fiscal_year, material_type)
);

-- Create fact_yoy_budget table
CREATE TABLE IF NOT EXISTS fact_yoy_budget (
  id SERIAL PRIMARY KEY,
  fiscal_year INTEGER NOT NULL,
  quarter VARCHAR(10) NOT NULL,
  budget_amount DECIMAL(20,2) NOT NULL DEFAULT 0,
  actual_amount DECIMAL(20,2) NOT NULL DEFAULT 0,
  variance_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'IDR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fiscal_year, quarter)
);

-- Enable RLS
ALTER TABLE fact_yoy_forecast_accuracy ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_yoy_demand_submission ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_yoy_budget ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to read
CREATE POLICY "Allow authenticated users to read forecast accuracy"
  ON fact_yoy_forecast_accuracy
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anon users to read forecast accuracy"
  ON fact_yoy_forecast_accuracy
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated users to read demand submission"
  ON fact_yoy_demand_submission
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anon users to read demand submission"
  ON fact_yoy_demand_submission
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated users to read budget"
  ON fact_yoy_budget
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anon users to read budget"
  ON fact_yoy_budget
  FOR SELECT
  TO anon
  USING (true);

-- Insert sample data for forecast accuracy (2024 vs 2025)
INSERT INTO fact_yoy_forecast_accuracy (fiscal_year, accuracy_percentage, material_count, submission_rate)
VALUES 
  (2024, 78.5, 245, 82.3),
  (2025, 85.2, 287, 89.1)
ON CONFLICT (fiscal_year) DO UPDATE
SET 
  accuracy_percentage = EXCLUDED.accuracy_percentage,
  material_count = EXCLUDED.material_count,
  submission_rate = EXCLUDED.submission_rate,
  updated_at = NOW();

-- Insert sample data for demand submission by material type
INSERT INTO fact_yoy_demand_submission (fiscal_year, material_type, material_count, submission_date)
VALUES
  -- 2024 data
  (2024, 'Coal', 42, '2024-12-31'),
  (2024, 'Gas Turbine Parts', 38, '2024-12-31'),
  (2024, 'Boiler Components', 35, '2024-12-31'),
  (2024, 'Generator Parts', 28, '2024-12-31'),
  (2024, 'Electrical Equipment', 45, '2024-12-31'),
  (2024, 'Lubricants', 32, '2024-12-31'),
  (2024, 'Chemicals', 25, '2024-12-31'),
  -- 2025 data
  (2025, 'Coal', 48, NOW()),
  (2025, 'Gas Turbine Parts', 45, NOW()),
  (2025, 'Boiler Components', 42, NOW()),
  (2025, 'Generator Parts', 35, NOW()),
  (2025, 'Electrical Equipment', 52, NOW()),
  (2025, 'Lubricants', 38, NOW()),
  (2025, 'Chemicals', 27, NOW())
ON CONFLICT (fiscal_year, material_type) DO UPDATE
SET 
  material_count = EXCLUDED.material_count,
  submission_date = EXCLUDED.submission_date;

-- Insert sample data for budget (quarterly breakdown)
INSERT INTO fact_yoy_budget (fiscal_year, quarter, budget_amount, actual_amount, variance_percentage, currency)
VALUES
  -- 2024 data
  (2024, 'Q1', 85000000000, 82500000000, -2.94, 'IDR'),
  (2024, 'Q2', 92000000000, 94800000000, 3.04, 'IDR'),
  (2024, 'Q3', 88000000000, 87200000000, -0.91, 'IDR'),
  (2024, 'Q4', 95000000000, 98500000000, 3.68, 'IDR'),
  -- 2025 data
  (2025, 'Q1', 95000000000, 93200000000, -1.89, 'IDR'),
  (2025, 'Q2', 105000000000, 107500000000, 2.38, 'IDR'),
  (2025, 'Q3', 98000000000, 0, 0, 'IDR'),
  (2025, 'Q4', 110000000000, 0, 0, 'IDR')
ON CONFLICT (fiscal_year, quarter) DO UPDATE
SET 
  budget_amount = EXCLUDED.budget_amount,
  actual_amount = EXCLUDED.actual_amount,
  variance_percentage = EXCLUDED.variance_percentage,
  updated_at = NOW();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_yoy_forecast_accuracy_year ON fact_yoy_forecast_accuracy(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_yoy_demand_submission_year ON fact_yoy_demand_submission(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_yoy_budget_year ON fact_yoy_budget(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_yoy_budget_quarter ON fact_yoy_budget(quarter);