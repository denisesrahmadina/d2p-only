/*
  # Create DPK Units and Metrics Tables with Mock Data

  1. New Tables
    - `dim_unit` - Organizational units with budget information
      - unit_id (varchar, primary key)
      - unit_name (varchar)
      - unit_code (varchar)
      - opex_budget (numeric)
      - capex_budget (numeric)
      - total_budget (numeric, computed)
      - parent_org_id (varchar, references organizations)
      - fiscal_year (integer)
      - is_active (boolean)
      - created_date (timestamp)
      - modified_date (timestamp)

    - `fact_dpk_submission` - DPK submission tracking per unit
      - submission_id (bigserial, primary key)
      - unit_id (varchar, references dim_unit)
      - submission_type (varchar) - 'DPK', 'PR', 'STR'
      - submission_status (varchar) - 'Submitted', 'Not Submitted', 'In Progress'
      - submitted_by (varchar)
      - submission_date (timestamp)
      - fiscal_year (integer)
      - created_date (timestamp)

    - `fact_forecast_accuracy` - Forecast accuracy metrics per unit
      - accuracy_id (bigserial, primary key)
      - unit_id (varchar, references dim_unit)
      - period_type (varchar) - 'Monthly', 'Quarterly', 'Annual'
      - period_value (varchar)
      - forecast_qty (numeric)
      - actual_qty (numeric)
      - accuracy_percentage (numeric)
      - fiscal_year (integer)
      - created_date (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to read all data
    - Add policies for authenticated users to manage their data

  3. Mock Data
    - 12 organizational units with realistic budget allocations
    - DPK submission records with 70% submission rate
    - Forecast accuracy data ranging from 45% to 92%
    - Procurement Request and STR submission tracking
*/

-- Create Units Table
CREATE TABLE IF NOT EXISTS dim_unit (
  unit_id varchar(50) PRIMARY KEY,
  unit_name varchar(200) NOT NULL,
  unit_code varchar(20) NOT NULL,
  opex_budget numeric(20, 2) DEFAULT 0,
  capex_budget numeric(20, 2) DEFAULT 0,
  total_budget numeric(20, 2) GENERATED ALWAYS AS (opex_budget + capex_budget) STORED,
  parent_org_id varchar(50),
  fiscal_year integer DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  is_active boolean DEFAULT true,
  created_date timestamp DEFAULT now(),
  modified_date timestamp DEFAULT now()
);

ALTER TABLE dim_unit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read units"
  ON dim_unit FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous users to read units"
  ON dim_unit FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated users to manage units"
  ON dim_unit FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create DPK Submission Tracking Table
CREATE TABLE IF NOT EXISTS fact_dpk_submission (
  submission_id bigserial PRIMARY KEY,
  unit_id varchar(50) NOT NULL REFERENCES dim_unit(unit_id),
  submission_type varchar(50) NOT NULL,
  submission_status varchar(50) NOT NULL DEFAULT 'Not Submitted',
  submitted_by varchar(100),
  submission_date timestamp,
  fiscal_year integer DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  created_date timestamp DEFAULT now()
);

ALTER TABLE fact_dpk_submission ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read submissions"
  ON fact_dpk_submission FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous users to read submissions"
  ON fact_dpk_submission FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated users to manage submissions"
  ON fact_dpk_submission FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create Forecast Accuracy Table
CREATE TABLE IF NOT EXISTS fact_forecast_accuracy (
  accuracy_id bigserial PRIMARY KEY,
  unit_id varchar(50) NOT NULL REFERENCES dim_unit(unit_id),
  period_type varchar(50) NOT NULL,
  period_value varchar(100) NOT NULL,
  forecast_qty numeric(20, 4) DEFAULT 0,
  actual_qty numeric(20, 4) DEFAULT 0,
  accuracy_percentage numeric(5, 2) DEFAULT 0,
  fiscal_year integer DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  created_date timestamp DEFAULT now()
);

ALTER TABLE fact_forecast_accuracy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read forecast accuracy"
  ON fact_forecast_accuracy FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous users to read forecast accuracy"
  ON fact_forecast_accuracy FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated users to manage forecast accuracy"
  ON fact_forecast_accuracy FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_unit_fiscal_year ON dim_unit(fiscal_year, is_active);
CREATE INDEX IF NOT EXISTS idx_dpk_submission_unit ON fact_dpk_submission(unit_id, submission_type, fiscal_year);
CREATE INDEX IF NOT EXISTS idx_forecast_accuracy_unit ON fact_forecast_accuracy(unit_id, fiscal_year);

-- Insert Mock Units Data (12 units)
INSERT INTO dim_unit (unit_id, unit_name, unit_code, opex_budget, capex_budget, fiscal_year) VALUES
('UNIT-JAKBAR', 'Jakarta Barat Unit', 'JKB', 2500000000.00, 8500000000.00, 2025),
('UNIT-JAKTIM', 'Jakarta Timur Unit', 'JKT', 1800000000.00, 6200000000.00, 2025),
('UNIT-JAKSEL', 'Jakarta Selatan Unit', 'JKS', 3200000000.00, 9800000000.00, 2025),
('UNIT-JAKUT', 'Jakarta Utara Unit', 'JKU', 2100000000.00, 7500000000.00, 2025),
('UNIT-TANGSEL', 'Tangerang Selatan Unit', 'TGS', 1500000000.00, 5500000000.00, 2025),
('UNIT-BEKASI', 'Bekasi Unit', 'BKS', 1900000000.00, 6800000000.00, 2025),
('UNIT-DEPOK', 'Depok Unit', 'DPK', 1200000000.00, 4200000000.00, 2025),
('UNIT-BOGOR', 'Bogor Unit', 'BGR', 1600000000.00, 5800000000.00, 2025),
('UNIT-BANDUNG', 'Bandung Unit', 'BDG', 2800000000.00, 9200000000.00, 2025),
('UNIT-CIREBON', 'Cirebon Unit', 'CRB', 980000000.00, 3500000000.00, 2025),
('UNIT-SEMARANG', 'Semarang Unit', 'SMG', 2200000000.00, 7800000000.00, 2025),
('UNIT-SURABAYA', 'Surabaya Unit', 'SBY', 3500000000.00, 10500000000.00, 2025);

-- Insert Mock DPK Submission Data (70% submitted)
INSERT INTO fact_dpk_submission (unit_id, submission_type, submission_status, submitted_by, submission_date, fiscal_year) VALUES
('UNIT-JAKBAR', 'DPK', 'Submitted', 'Ahmad Budiman', '2025-01-15 09:30:00', 2025),
('UNIT-JAKTIM', 'DPK', 'Submitted', 'Siti Rahayu', '2025-01-18 14:20:00', 2025),
('UNIT-JAKSEL', 'DPK', 'Submitted', 'Budi Santoso', '2025-01-12 10:15:00', 2025),
('UNIT-JAKUT', 'DPK', 'Not Submitted', NULL, NULL, 2025),
('UNIT-TANGSEL', 'DPK', 'Submitted', 'Dewi Lestari', '2025-01-20 11:45:00', 2025),
('UNIT-BEKASI', 'DPK', 'Submitted', 'Eko Prasetyo', '2025-01-16 13:30:00', 2025),
('UNIT-DEPOK', 'DPK', 'Not Submitted', NULL, NULL, 2025),
('UNIT-BOGOR', 'DPK', 'Submitted', 'Fitri Handayani', '2025-01-19 15:00:00', 2025),
('UNIT-BANDUNG', 'DPK', 'Submitted', 'Gunawan Wijaya', '2025-01-14 08:45:00', 2025),
('UNIT-CIREBON', 'DPK', 'Not Submitted', NULL, NULL, 2025),
('UNIT-SEMARANG', 'DPK', 'Submitted', 'Hendra Kusuma', '2025-01-17 16:20:00', 2025),
('UNIT-SURABAYA', 'DPK', 'Not Submitted', NULL, NULL, 2025);

-- Insert Mock Procurement Request Submission Data (60% submitted)
INSERT INTO fact_dpk_submission (unit_id, submission_type, submission_status, submitted_by, submission_date, fiscal_year) VALUES
('UNIT-JAKBAR', 'PR', 'Submitted', 'Ahmad Budiman', '2025-01-25 10:30:00', 2025),
('UNIT-JAKTIM', 'PR', 'Submitted', 'Siti Rahayu', '2025-01-28 09:20:00', 2025),
('UNIT-JAKSEL', 'PR', 'Not Submitted', NULL, NULL, 2025),
('UNIT-JAKUT', 'PR', 'Not Submitted', NULL, NULL, 2025),
('UNIT-TANGSEL', 'PR', 'Submitted', 'Dewi Lestari', '2025-01-26 14:45:00', 2025),
('UNIT-BEKASI', 'PR', 'Submitted', 'Eko Prasetyo', '2025-01-29 11:30:00', 2025),
('UNIT-DEPOK', 'PR', 'Not Submitted', NULL, NULL, 2025),
('UNIT-BOGOR', 'PR', 'Submitted', 'Fitri Handayani', '2025-01-27 13:00:00', 2025),
('UNIT-BANDUNG', 'PR', 'Not Submitted', NULL, NULL, 2025),
('UNIT-CIREBON', 'PR', 'Not Submitted', NULL, NULL, 2025),
('UNIT-SEMARANG', 'PR', 'Submitted', 'Hendra Kusuma', '2025-01-30 15:20:00', 2025),
('UNIT-SURABAYA', 'PR', 'Submitted', 'Indra Gunawan', '2025-01-24 08:45:00', 2025);

-- Insert Mock STR Submission Data (58% submitted)
INSERT INTO fact_dpk_submission (unit_id, submission_type, submission_status, submitted_by, submission_date, fiscal_year) VALUES
('UNIT-JAKBAR', 'STR', 'Submitted', 'Ahmad Budiman', '2025-02-01 10:30:00', 2025),
('UNIT-JAKTIM', 'STR', 'Not Submitted', NULL, NULL, 2025),
('UNIT-JAKSEL', 'STR', 'Submitted', 'Budi Santoso', '2025-02-02 09:20:00', 2025),
('UNIT-JAKUT', 'STR', 'Not Submitted', NULL, NULL, 2025),
('UNIT-TANGSEL', 'STR', 'Submitted', 'Dewi Lestari', '2025-02-03 14:45:00', 2025),
('UNIT-BEKASI', 'STR', 'Not Submitted', NULL, NULL, 2025),
('UNIT-DEPOK', 'STR', 'Not Submitted', NULL, NULL, 2025),
('UNIT-BOGOR', 'STR', 'Submitted', 'Fitri Handayani', '2025-02-04 13:00:00', 2025),
('UNIT-BANDUNG', 'STR', 'Submitted', 'Gunawan Wijaya', '2025-02-05 11:30:00', 2025),
('UNIT-CIREBON', 'STR', 'Not Submitted', NULL, NULL, 2025),
('UNIT-SEMARANG', 'STR', 'Submitted', 'Hendra Kusuma', '2025-02-06 15:20:00', 2025),
('UNIT-SURABAYA', 'STR', 'Submitted', 'Indra Gunawan', '2025-02-07 08:45:00', 2025);

-- Insert Mock Forecast Accuracy Data (with varying accuracy from 45% to 92%)
INSERT INTO fact_forecast_accuracy (unit_id, period_type, period_value, forecast_qty, actual_qty, accuracy_percentage, fiscal_year) VALUES
-- High performers
('UNIT-JAKBAR', 'Quarterly', 'Q4-2024', 1500.00, 1380.00, 92.00, 2025),
('UNIT-JAKTIM', 'Quarterly', 'Q4-2024', 1200.00, 1056.00, 88.00, 2025),
('UNIT-BANDUNG', 'Quarterly', 'Q4-2024', 1800.00, 1548.00, 86.00, 2025),
('UNIT-SEMARANG', 'Quarterly', 'Q4-2024', 1400.00, 1176.00, 84.00, 2025),

-- Medium performers
('UNIT-BEKASI', 'Quarterly', 'Q4-2024', 1100.00, 880.00, 80.00, 2025),
('UNIT-BOGOR', 'Quarterly', 'Q4-2024', 900.00, 675.00, 75.00, 2025),
('UNIT-TANGSEL', 'Quarterly', 'Q4-2024', 800.00, 576.00, 72.00, 2025),

-- Bottom 5 performers
('UNIT-SURABAYA', 'Quarterly', 'Q4-2024', 2000.00, 1280.00, 64.00, 2025),
('UNIT-JAKUT', 'Quarterly', 'Q4-2024', 1300.00, 728.00, 56.00, 2025),
('UNIT-JAKSEL', 'Quarterly', 'Q4-2024', 1600.00, 832.00, 52.00, 2025),
('UNIT-DEPOK', 'Quarterly', 'Q4-2024', 700.00, 336.00, 48.00, 2025),
('UNIT-CIREBON', 'Quarterly', 'Q4-2024', 600.00, 270.00, 45.00, 2025);
