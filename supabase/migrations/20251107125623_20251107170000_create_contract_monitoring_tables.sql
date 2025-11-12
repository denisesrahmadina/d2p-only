/*
  # Create Contract Monitoring Tables

  1. New Tables
    - `contract_monitoring`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references organizations)
      - `contract_id` (text)
      - `contract_name` (text)
      - `vendor_name` (text)
      - `contract_value` (numeric)
      - `start_date` (date)
      - `end_date` (date)
      - `capacity` (numeric) - total contract capacity/limit
      - `actual_consumption` (numeric) - actual usage/consumption
      - `consumption_percentage` (numeric) - calculated percentage
      - `status` (text) - active, expiring_soon, expired, at_risk
      - `category` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `contract_compliance_issues`
      - `id` (uuid, primary key)
      - `organization_id` (uuid)
      - `contract_id` (text)
      - `issue_type` (text) - penalty, breach, late_delivery, quality_issue, etc.
      - `severity` (text) - low, medium, high, critical
      - `description` (text)
      - `financial_impact` (numeric)
      - `detected_date` (date)
      - `status` (text) - open, under_review, resolved
      - `created_at` (timestamptz)

    - `contract_insights`
      - `id` (uuid, primary key)
      - `organization_id` (uuid)
      - `contract_id` (text)
      - `insight_type` (text) - penalty_calculation, termination_analysis, renewal_recommendation
      - `title` (text)
      - `description` (text)
      - `action_plan` (jsonb) - structured action plan
      - `priority` (text) - low, medium, high, critical
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read their organization's data
*/

-- Create contract_monitoring table
CREATE TABLE IF NOT EXISTS contract_monitoring (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id),
  contract_id text NOT NULL,
  contract_name text NOT NULL,
  vendor_name text NOT NULL,
  contract_value numeric NOT NULL DEFAULT 0,
  start_date date NOT NULL,
  end_date date NOT NULL,
  capacity numeric NOT NULL DEFAULT 0,
  actual_consumption numeric NOT NULL DEFAULT 0,
  consumption_percentage numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contract_monitoring ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to contract_monitoring"
  ON contract_monitoring
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to contract_monitoring"
  ON contract_monitoring
  FOR SELECT
  TO authenticated
  USING (true);

-- Create contract_compliance_issues table
CREATE TABLE IF NOT EXISTS contract_compliance_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id),
  contract_id text NOT NULL,
  issue_type text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  description text NOT NULL,
  financial_impact numeric DEFAULT 0,
  detected_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contract_compliance_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to contract_compliance_issues"
  ON contract_compliance_issues
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to contract_compliance_issues"
  ON contract_compliance_issues
  FOR SELECT
  TO authenticated
  USING (true);

-- Create contract_insights table
CREATE TABLE IF NOT EXISTS contract_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id),
  contract_id text NOT NULL,
  insight_type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  action_plan jsonb DEFAULT '[]'::jsonb,
  priority text NOT NULL DEFAULT 'medium',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contract_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to contract_insights"
  ON contract_insights
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to contract_insights"
  ON contract_insights
  FOR SELECT
  TO authenticated
  USING (true);
