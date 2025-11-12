/*
  # Create Yearly Savings Target System

  ## Overview
  Restructures the procurement savings tracking from an average-based model to a
  yearly target-based accountability system. This enables organizations to set
  annual savings goals and track monthly progress towards those targets.

  ## Changes

  1. New Table: fact_procurement_yearly_savings_target
    - Stores annual savings targets by year, organization, and category
    - Defines monthly planned savings breakdown
    - Supports category-specific and organization-wide targets

  2. Modified Table: fact_procurement_savings_monthly
    - Adds monthly_planned_savings column for month-specific targets
    - Adds yearly_target_amount column for reference
    - Adds cumulative_ytd_savings for year-to-date tracking
    - Adds achievement_percentage for monthly performance

  3. New Views
    - v_yearly_savings_progress: YTD progress against annual targets
    - v_monthly_savings_performance: Monthly actual vs planned comparison
    - v_category_yearly_savings: Category-specific yearly performance

  ## Security
    - Enable RLS on all new tables
    - Public read access for demo purposes
    - Authenticated users can create and update records

  ## Data Model
    - Yearly targets are set at organization and category levels
    - Monthly planned savings allocate the yearly target across 12 months
    - Actual savings from contracts are summed by month
    - Achievement calculated as: (actual / planned) * 100
*/

-- Create yearly savings target table
CREATE TABLE IF NOT EXISTS fact_procurement_yearly_savings_target (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NOT NULL DEFAULT 'ORG001',
  year integer NOT NULL,
  main_category_code text,
  yearly_target_amount numeric NOT NULL,
  target_savings_percentage numeric NOT NULL,
  baseline_spend numeric NOT NULL,

  -- Monthly planned breakdown (in IDR)
  jan_planned numeric DEFAULT 0,
  feb_planned numeric DEFAULT 0,
  mar_planned numeric DEFAULT 0,
  apr_planned numeric DEFAULT 0,
  may_planned numeric DEFAULT 0,
  jun_planned numeric DEFAULT 0,
  jul_planned numeric DEFAULT 0,
  aug_planned numeric DEFAULT 0,
  sep_planned numeric DEFAULT 0,
  oct_planned numeric DEFAULT 0,
  nov_planned numeric DEFAULT 0,
  dec_planned numeric DEFAULT 0,

  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(year, organization_id, main_category_code)
);

-- Add columns to fact_procurement_savings_monthly
DO $$
BEGIN
  -- Add monthly_planned_savings column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_savings_monthly'
    AND column_name = 'monthly_planned_savings'
  ) THEN
    ALTER TABLE fact_procurement_savings_monthly
    ADD COLUMN monthly_planned_savings numeric DEFAULT 0;
  END IF;

  -- Add yearly_target_amount column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_savings_monthly'
    AND column_name = 'yearly_target_amount'
  ) THEN
    ALTER TABLE fact_procurement_savings_monthly
    ADD COLUMN yearly_target_amount numeric DEFAULT 0;
  END IF;

  -- Add cumulative_ytd_savings column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_savings_monthly'
    AND column_name = 'cumulative_ytd_savings'
  ) THEN
    ALTER TABLE fact_procurement_savings_monthly
    ADD COLUMN cumulative_ytd_savings numeric DEFAULT 0;
  END IF;

  -- Add achievement_percentage column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_savings_monthly'
    AND column_name = 'achievement_percentage'
  ) THEN
    ALTER TABLE fact_procurement_savings_monthly
    ADD COLUMN achievement_percentage numeric DEFAULT 0;
  END IF;

  -- Add main_category_code column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_savings_monthly'
    AND column_name = 'main_category_code'
  ) THEN
    ALTER TABLE fact_procurement_savings_monthly
    ADD COLUMN main_category_code text;
  END IF;
END $$;

-- Enable RLS on yearly savings target table
ALTER TABLE fact_procurement_yearly_savings_target ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fact_procurement_yearly_savings_target
CREATE POLICY "Anyone can view yearly savings targets"
  ON fact_procurement_yearly_savings_target FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create yearly savings targets"
  ON fact_procurement_yearly_savings_target FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update yearly savings targets"
  ON fact_procurement_yearly_savings_target FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create view: Yearly savings progress by category
CREATE OR REPLACE VIEW v_yearly_savings_progress AS
SELECT
  t.year,
  t.organization_id,
  t.main_category_code,
  t.yearly_target_amount,
  t.target_savings_percentage,
  t.baseline_spend,
  COALESCE(SUM(m.actual_savings), 0) as ytd_actual_savings,
  COALESCE(SUM(m.monthly_planned_savings), 0) as ytd_planned_savings,
  CASE
    WHEN t.yearly_target_amount > 0
    THEN (COALESCE(SUM(m.actual_savings), 0) / t.yearly_target_amount) * 100
    ELSE 0
  END as ytd_achievement_percentage,
  COUNT(m.id) as months_reported,
  t.yearly_target_amount - COALESCE(SUM(m.actual_savings), 0) as remaining_target
FROM fact_procurement_yearly_savings_target t
LEFT JOIN fact_procurement_savings_monthly m
  ON m.year = t.year
  AND m.organization_id = t.organization_id
  AND (m.main_category_code = t.main_category_code OR (m.main_category_code IS NULL AND t.main_category_code IS NULL))
GROUP BY t.id, t.year, t.organization_id, t.main_category_code,
         t.yearly_target_amount, t.target_savings_percentage, t.baseline_spend;

-- Create view: Monthly savings performance
CREATE OR REPLACE VIEW v_monthly_savings_performance AS
SELECT
  m.year,
  m.month,
  m.month_name,
  m.organization_id,
  m.main_category_code,
  m.actual_savings,
  m.monthly_planned_savings,
  m.achievement_percentage,
  m.cumulative_ytd_savings,
  m.contracts_finalized,
  CASE
    WHEN m.achievement_percentage >= 100 THEN 'Exceeded'
    WHEN m.achievement_percentage >= 90 THEN 'On Track'
    WHEN m.achievement_percentage >= 75 THEN 'At Risk'
    ELSE 'Below Target'
  END as performance_status
FROM fact_procurement_savings_monthly m
ORDER BY m.year, m.month;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_yearly_target_year_org_cat
  ON fact_procurement_yearly_savings_target(year, organization_id, main_category_code);

CREATE INDEX IF NOT EXISTS idx_monthly_savings_year_month_cat
  ON fact_procurement_savings_monthly(year, month, main_category_code);

-- Add comment explaining the target allocation logic
COMMENT ON TABLE fact_procurement_yearly_savings_target IS
  'Stores annual procurement savings targets with monthly planned breakdown. Monthly planned amounts should sum to yearly_target_amount. Use this table to set goals and track year-over-year improvement.';

COMMENT ON COLUMN fact_procurement_yearly_savings_target.baseline_spend IS
  'Expected total spend for the year before savings. Calculated as: yearly_target_amount / target_savings_percentage * 100';
