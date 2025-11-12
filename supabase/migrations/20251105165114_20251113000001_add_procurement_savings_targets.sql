/*
  # Add Procurement Savings Target Tracking System

  ## Overview
  Creates a comprehensive target tracking system for procurement savings with:
  - Category-level targets (yearly and monthly)
  - Automatic status calculation (below target, near target, on target)
  - Historical tracking of target achievement

  ## New Tables

  ### 1. `ref_procurement_savings_targets`
  Defines savings targets for each procurement category
  
  **Columns:**
  - `id` (uuid, primary key)
  - `organization_id` (text) - Organization identifier
  - `year` (integer) - Target year
  - `main_category_code` (text) - Category code (A-F)
  - `category_name` (text) - Full category name
  - `yearly_target_amount` (numeric) - Annual savings target in IDR
  - `quarterly_targets` (jsonb) - Quarterly breakdown of targets
  - `monthly_targets` (jsonb) - Monthly breakdown of targets
  - `threshold_below` (numeric) - Below target threshold percentage (default: 80%)
  - `threshold_near` (numeric) - Near target threshold percentage (default: 90%)
  - `threshold_on` (numeric) - On target threshold percentage (default: 100%)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `fact_procurement_savings_achievement`
  Tracks actual achievement vs targets by category and time period
  
  **Columns:**
  - `id` (uuid, primary key)
  - `organization_id` (text) - Organization identifier
  - `year` (integer) - Achievement year
  - `month` (integer) - Achievement month (1-12)
  - `main_category_code` (text) - Category code
  - `actual_savings` (numeric) - Actual savings achieved
  - `target_savings` (numeric) - Target for this period
  - `achievement_percentage` (numeric) - (actual/target * 100)
  - `status` (text) - 'below_target', 'near_target', 'on_target', 'above_target'
  - `contract_count` (integer) - Number of contracts contributing
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Status Calculation Logic
  - **Below Target**: < 80% of target
  - **Near Target**: 80% - 89.9% of target
  - **On Target**: 90% - 109.9% of target
  - **Above Target**: >= 110% of target

  ## Security
  - Enable RLS on all tables
  - Allow authenticated users to read data
*/

-- Create procurement savings targets reference table
CREATE TABLE IF NOT EXISTS ref_procurement_savings_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NOT NULL DEFAULT 'ORG001',
  year integer NOT NULL,
  main_category_code text NOT NULL,
  category_name text NOT NULL,
  yearly_target_amount numeric NOT NULL,
  quarterly_targets jsonb DEFAULT '{}',
  monthly_targets jsonb DEFAULT '{}',
  threshold_below numeric DEFAULT 80.0,
  threshold_near numeric DEFAULT 90.0,
  threshold_on numeric DEFAULT 100.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, year, main_category_code)
);

-- Create procurement savings achievement tracking table
CREATE TABLE IF NOT EXISTS fact_procurement_savings_achievement (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NOT NULL DEFAULT 'ORG001',
  year integer NOT NULL,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  main_category_code text NOT NULL,
  actual_savings numeric NOT NULL DEFAULT 0,
  target_savings numeric NOT NULL,
  achievement_percentage numeric GENERATED ALWAYS AS (
    CASE 
      WHEN target_savings > 0 THEN (actual_savings / target_savings * 100)
      ELSE 0 
    END
  ) STORED,
  status text GENERATED ALWAYS AS (
    CASE 
      WHEN target_savings = 0 THEN 'no_target'
      WHEN (actual_savings / target_savings * 100) < 80 THEN 'below_target'
      WHEN (actual_savings / target_savings * 100) < 90 THEN 'near_target'
      WHEN (actual_savings / target_savings * 100) < 110 THEN 'on_target'
      ELSE 'above_target'
    END
  ) STORED,
  contract_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, year, month, main_category_code)
);

-- Enable RLS
ALTER TABLE ref_procurement_savings_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_procurement_savings_achievement ENABLE ROW LEVEL SECURITY;

-- RLS Policies for targets
CREATE POLICY "Allow authenticated users to read savings targets"
  ON ref_procurement_savings_targets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous users to read savings targets"
  ON ref_procurement_savings_targets
  FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for achievement
CREATE POLICY "Allow authenticated users to read savings achievement"
  ON fact_procurement_savings_achievement
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous users to read savings achievement"
  ON fact_procurement_savings_achievement
  FOR SELECT
  TO anon
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_savings_targets_org_year_cat 
  ON ref_procurement_savings_targets(organization_id, year, main_category_code);

CREATE INDEX IF NOT EXISTS idx_savings_achievement_org_year_month_cat 
  ON fact_procurement_savings_achievement(organization_id, year, month, main_category_code);

CREATE INDEX IF NOT EXISTS idx_savings_achievement_status 
  ON fact_procurement_savings_achievement(status);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_ref_procurement_savings_targets_updated_at ON ref_procurement_savings_targets;
CREATE TRIGGER update_ref_procurement_savings_targets_updated_at
  BEFORE UPDATE ON ref_procurement_savings_targets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_fact_procurement_savings_achievement_updated_at ON fact_procurement_savings_achievement;
CREATE TRIGGER update_fact_procurement_savings_achievement_updated_at
  BEFORE UPDATE ON fact_procurement_savings_achievement
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
