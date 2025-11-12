/*
  # Voice of Supplier - Business Plans and Process Feedback

  1. New Tables
    - `fact_supplier_business_plan`
      - Stores supplier strategic plans, R&D investments, and growth initiatives
      - Links to specific categories and suppliers
      - Includes financial planning and strategic focus areas
    
    - `fact_supplier_process_feedback`
      - Stores operational feedback from internal teams
      - Performance reviews and efficiency assessments
      - Quality control and compliance tracking

    - `fact_supplier_rd_initiatives`
      - Detailed R&D projects and innovation initiatives
      - Investment amounts and expected outcomes
      - Timeline and collaboration opportunities

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and anonymous users to read data
*/

-- Supplier Business Plan Table
CREATE TABLE IF NOT EXISTS fact_supplier_business_plan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text NOT NULL,
  supplier_id text NOT NULL,
  supplier_name text NOT NULL,
  
  -- Strategic Focus
  strategic_vision text NOT NULL,
  strategic_priorities text[] NOT NULL,
  alignment_score int CHECK (alignment_score BETWEEN 1 AND 100),
  
  -- Financial Information
  annual_revenue_usd bigint,
  rd_investment_usd bigint,
  rd_investment_percentage decimal(5,2),
  financial_stability_rating text CHECK (financial_stability_rating IN ('Excellent', 'Good', 'Fair', 'Poor')),
  
  -- Growth Plans
  projected_growth_percentage decimal(5,2),
  expansion_markets text[],
  new_product_launches int DEFAULT 0,
  capacity_expansion_planned boolean DEFAULT false,
  
  -- Collaboration Opportunities
  joint_development_interest boolean DEFAULT false,
  innovation_partnership_potential text,
  strategic_partnership_level text CHECK (strategic_partnership_level IN ('Preferred', 'Strategic', 'Transactional', 'Under Review')),
  
  -- AI Analysis
  ai_strategic_insights text,
  collaboration_recommendations text,
  risk_assessment text,
  
  planning_period text NOT NULL,
  last_updated date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Supplier R&D Initiatives Table
CREATE TABLE IF NOT EXISTS fact_supplier_rd_initiatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text NOT NULL,
  supplier_id text NOT NULL,
  supplier_name text NOT NULL,
  
  -- Initiative Details
  initiative_title text NOT NULL,
  initiative_description text NOT NULL,
  technology_area text NOT NULL,
  
  -- Investment
  investment_amount_usd bigint,
  investment_timeline text,
  
  -- Status and Progress
  status text CHECK (status IN ('Planning', 'In Progress', 'Completed', 'On Hold')),
  completion_percentage int CHECK (completion_percentage BETWEEN 0 AND 100),
  expected_completion_date date,
  
  -- Impact and Opportunities
  potential_impact text CHECK (potential_impact IN ('High', 'Medium', 'Low')),
  collaboration_opportunity boolean DEFAULT false,
  relevance_to_company text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Supplier Process Feedback Table
CREATE TABLE IF NOT EXISTS fact_supplier_process_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text NOT NULL,
  supplier_id text NOT NULL,
  supplier_name text NOT NULL,
  
  -- Feedback Source
  feedback_period text NOT NULL,
  reporting_unit text NOT NULL,
  reporting_department text NOT NULL,
  evaluator_name text,
  evaluation_date date NOT NULL,
  
  -- Performance Scores (1-100)
  communication_score int CHECK (communication_score BETWEEN 1 AND 100),
  responsiveness_score int CHECK (responsiveness_score BETWEEN 1 AND 100),
  flexibility_score int CHECK (flexibility_score BETWEEN 1 AND 100),
  innovation_score int CHECK (innovation_score BETWEEN 1 AND 100),
  cost_competitiveness_score int CHECK (cost_competitiveness_score BETWEEN 1 AND 100),
  technical_capability_score int CHECK (technical_capability_score BETWEEN 1 AND 100),
  
  -- Overall Assessment
  overall_score int CHECK (overall_score BETWEEN 1 AND 100),
  performance_rating text CHECK (performance_rating IN ('Excellent', 'Good', 'Satisfactory', 'Needs Improvement', 'Poor')),
  
  -- Detailed Feedback
  strengths text,
  areas_for_improvement text,
  efficiency_initiatives text,
  quality_control_assessment text,
  compliance_status text CHECK (compliance_status IN ('Fully Compliant', 'Minor Issues', 'Major Issues', 'Non-Compliant')),
  
  -- Recommendations
  recommended_actions text,
  follow_up_required boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE fact_supplier_business_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_supplier_rd_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_supplier_process_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow anonymous read access to supplier business plan"
  ON fact_supplier_business_plan
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to supplier business plan"
  ON fact_supplier_business_plan
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous read access to supplier rd initiatives"
  ON fact_supplier_rd_initiatives
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to supplier rd initiatives"
  ON fact_supplier_rd_initiatives
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous read access to supplier process feedback"
  ON fact_supplier_process_feedback
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to supplier process feedback"
  ON fact_supplier_process_feedback
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_supplier_business_plan_category ON fact_supplier_business_plan(category_code);
CREATE INDEX IF NOT EXISTS idx_supplier_business_plan_supplier ON fact_supplier_business_plan(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_rd_initiatives_category ON fact_supplier_rd_initiatives(category_code);
CREATE INDEX IF NOT EXISTS idx_supplier_rd_initiatives_supplier ON fact_supplier_rd_initiatives(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_process_feedback_category ON fact_supplier_process_feedback(category_code);
CREATE INDEX IF NOT EXISTS idx_supplier_process_feedback_supplier ON fact_supplier_process_feedback(supplier_id);
