/*
  # Create Procurement Savings Analytics Tables

  1. New Tables
    - `fact_procurement_savings_contract`
      - Stores contract-level procurement savings data
      - Tracks owner estimate (baseline), final contract value, and realized savings
      - Links to business units, suppliers, and categories
      - Enables drill-down analysis of cost efficiency achievements

    - `ref_procurement_savings_pipeline`
      - Tracks contracts in negotiation pipeline with expected savings
      - Monitors pipeline status and projected award dates
      - Supports forecasting and opportunity analysis

    - `fact_procurement_savings_monthly`
      - Aggregated monthly savings data for trend analysis
      - Tracks actual vs projected savings performance over time
      - Enables executive dashboard visualizations

  2. Security
    - Enable RLS on all tables
    - Authenticated users can create and update
    - Public read access for demo purposes

  3. Important Notes
    - All monetary values in IDR (Indonesian Rupiah)
    - Savings percentage calculated as ((owner_estimate - final_value) / owner_estimate) * 100
    - Pipeline contracts excluded from actual savings but included in projections
    - Categories aligned with existing procurement taxonomy
*/

-- Create fact_procurement_savings_contract table
CREATE TABLE IF NOT EXISTS fact_procurement_savings_contract (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id text UNIQUE NOT NULL,
  contract_name text NOT NULL,
  supplier_name text NOT NULL,
  category text NOT NULL CHECK (category IN (
    'EPC Projects',
    'Capital Equipment',
    'MRO',
    'Consulting Services',
    'Emergency Procurements',
    'IT & Technology',
    'Facility Management',
    'Professional Services'
  )),
  business_unit text NOT NULL,
  award_date date NOT NULL,
  owner_estimate numeric NOT NULL,
  final_contract_value numeric NOT NULL,
  savings_amount numeric GENERATED ALWAYS AS (owner_estimate - final_contract_value) STORED,
  savings_percentage numeric GENERATED ALWAYS AS (
    CASE
      WHEN owner_estimate > 0 THEN ((owner_estimate - final_contract_value) / owner_estimate) * 100
      ELSE 0
    END
  ) STORED,
  contract_status text NOT NULL DEFAULT 'Finalized' CHECK (contract_status IN ('Finalized', 'Active', 'Completed', 'Cancelled')),
  contract_duration_months integer,
  notes text,
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ref_procurement_savings_pipeline table
CREATE TABLE IF NOT EXISTS ref_procurement_savings_pipeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_reference text UNIQUE NOT NULL,
  contract_name text NOT NULL,
  category text NOT NULL,
  business_unit text NOT NULL,
  estimated_value numeric NOT NULL,
  target_savings_percentage numeric NOT NULL,
  projected_savings numeric GENERATED ALWAYS AS (estimated_value * target_savings_percentage / 100) STORED,
  expected_award_date date,
  pipeline_status text NOT NULL DEFAULT 'In Negotiation' CHECK (pipeline_status IN (
    'In Negotiation',
    'Awaiting Approval',
    'Under Technical Review',
    'Pending Budget',
    'Vendor Selection'
  )),
  probability_percentage integer DEFAULT 75 CHECK (probability_percentage BETWEEN 0 AND 100),
  lead_negotiator text,
  notes text,
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fact_procurement_savings_monthly table
CREATE TABLE IF NOT EXISTS fact_procurement_savings_monthly (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  month integer NOT NULL CHECK (month BETWEEN 1 AND 12),
  month_name text NOT NULL,
  actual_savings numeric NOT NULL DEFAULT 0,
  projected_savings numeric NOT NULL DEFAULT 0,
  contracts_finalized integer DEFAULT 0,
  average_savings_percentage numeric,
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now(),
  UNIQUE(year, month, organization_id)
);

-- Enable RLS
ALTER TABLE fact_procurement_savings_contract ENABLE ROW LEVEL SECURITY;
ALTER TABLE ref_procurement_savings_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_procurement_savings_monthly ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fact_procurement_savings_contract
CREATE POLICY "Anyone can view procurement savings contracts"
  ON fact_procurement_savings_contract FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create savings contracts"
  ON fact_procurement_savings_contract FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update savings contracts"
  ON fact_procurement_savings_contract FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for ref_procurement_savings_pipeline
CREATE POLICY "Anyone can view pipeline contracts"
  ON ref_procurement_savings_pipeline FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create pipeline contracts"
  ON ref_procurement_savings_pipeline FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pipeline contracts"
  ON ref_procurement_savings_pipeline FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for fact_procurement_savings_monthly
CREATE POLICY "Anyone can view monthly savings"
  ON fact_procurement_savings_monthly FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create monthly savings"
  ON fact_procurement_savings_monthly FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update monthly savings"
  ON fact_procurement_savings_monthly FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_savings_contract_category ON fact_procurement_savings_contract(category);
CREATE INDEX IF NOT EXISTS idx_savings_contract_business_unit ON fact_procurement_savings_contract(business_unit);
CREATE INDEX IF NOT EXISTS idx_savings_contract_award_date ON fact_procurement_savings_contract(award_date);
CREATE INDEX IF NOT EXISTS idx_savings_contract_status ON fact_procurement_savings_contract(contract_status);
CREATE INDEX IF NOT EXISTS idx_savings_contract_organization ON fact_procurement_savings_contract(organization_id);
CREATE INDEX IF NOT EXISTS idx_savings_contract_savings_pct ON fact_procurement_savings_contract(savings_percentage);

CREATE INDEX IF NOT EXISTS idx_pipeline_status ON ref_procurement_savings_pipeline(pipeline_status);
CREATE INDEX IF NOT EXISTS idx_pipeline_category ON ref_procurement_savings_pipeline(category);
CREATE INDEX IF NOT EXISTS idx_pipeline_expected_date ON ref_procurement_savings_pipeline(expected_award_date);
CREATE INDEX IF NOT EXISTS idx_pipeline_organization ON ref_procurement_savings_pipeline(organization_id);

CREATE INDEX IF NOT EXISTS idx_monthly_savings_date ON fact_procurement_savings_monthly(year, month);
CREATE INDEX IF NOT EXISTS idx_monthly_savings_organization ON fact_procurement_savings_monthly(organization_id);
