/*
  # Voice of Customer - Vendor Performance Scoring

  1. New Tables
    - `fact_vendor_performance_scores`
      - Stores vendor performance scores across 5 key parameters
      - Includes weighted scores and overall category rating
      - Links to specific categories and reporting units
    
    - `fact_vendor_performance_issues`
      - Stores detailed performance issues and feedback
      - Links to specific units/departments that reported issues
      - Includes severity and impact assessment

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and anonymous users to read data
*/

-- Vendor Performance Scores Table
CREATE TABLE IF NOT EXISTS fact_vendor_performance_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text NOT NULL,
  vendor_id text NOT NULL,
  vendor_name text NOT NULL,
  
  -- Five Key Parameters (1-100 scale)
  procurement_score int NOT NULL CHECK (procurement_score BETWEEN -100 AND 100),
  quality_delivery_score int NOT NULL CHECK (quality_delivery_score BETWEEN -100 AND 100),
  responsiveness_score int NOT NULL CHECK (responsiveness_score BETWEEN -100 AND 100),
  reliability_score int NOT NULL CHECK (reliability_score BETWEEN -100 AND 100),
  compliance_score int NOT NULL CHECK (compliance_score BETWEEN -100 AND 100),
  
  -- Weights (totals to 100%)
  procurement_weight decimal(5,2) DEFAULT 15.00,
  quality_delivery_weight decimal(5,2) DEFAULT 30.00,
  responsiveness_weight decimal(5,2) DEFAULT 15.00,
  reliability_weight decimal(5,2) DEFAULT 25.00,
  compliance_weight decimal(5,2) DEFAULT 15.00,
  
  -- Calculated fields
  total_weighted_score decimal(5,2),
  performance_category text CHECK (performance_category IN ('Green', 'Yellow', 'Red', 'Black')),
  
  -- Evaluation details
  evaluation_period text NOT NULL,
  total_evaluations int DEFAULT 0,
  last_evaluation_date date,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Vendor Performance Issues Table
CREATE TABLE IF NOT EXISTS fact_vendor_performance_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text NOT NULL,
  vendor_id text NOT NULL,
  vendor_name text NOT NULL,
  
  -- Issue details
  parameter_affected text NOT NULL CHECK (parameter_affected IN ('Procurement', 'Quality & Delivery', 'Responsiveness', 'Reliability', 'Compliance')),
  issue_title text NOT NULL,
  issue_description text NOT NULL,
  
  -- Source of feedback
  reporting_unit text NOT NULL,
  reporting_department text,
  reported_by text,
  
  -- Impact assessment
  severity text NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  impact_score int CHECK (impact_score BETWEEN -50 AND 0),
  
  -- Issue status
  issue_date date NOT NULL,
  resolution_status text CHECK (resolution_status IN ('Open', 'In Progress', 'Resolved', 'Escalated')),
  resolution_date date,
  corrective_actions text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE fact_vendor_performance_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_vendor_performance_issues ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow anonymous read access to vendor performance scores"
  ON fact_vendor_performance_scores
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to vendor performance scores"
  ON fact_vendor_performance_scores
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous read access to vendor performance issues"
  ON fact_vendor_performance_issues
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to vendor performance issues"
  ON fact_vendor_performance_issues
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vendor_scores_category ON fact_vendor_performance_scores(category_code);
CREATE INDEX IF NOT EXISTS idx_vendor_scores_vendor ON fact_vendor_performance_scores(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_scores_category_performance ON fact_vendor_performance_scores(performance_category);
CREATE INDEX IF NOT EXISTS idx_vendor_issues_category ON fact_vendor_performance_issues(category_code);
CREATE INDEX IF NOT EXISTS idx_vendor_issues_vendor ON fact_vendor_performance_issues(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_issues_parameter ON fact_vendor_performance_issues(parameter_affected);
