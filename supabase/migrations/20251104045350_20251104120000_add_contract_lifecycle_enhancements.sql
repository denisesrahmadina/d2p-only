/*
  # Contract Lifecycle Management Enhancements - Sustainable Power Generation

  1. New Tables
    - `ref_clause_library`
      - Predefined contract clauses organized by category
      - Includes environmental compliance, renewable energy certifications, carbon offset, ESG reporting
      - Supports solar, wind, battery storage, and other renewable energy contract types
      
    - `fact_contract_personnel_assignment`
      - Personnel assigned to contract workspaces
      - Tracks role, expertise area, workload, and assignment status
      - Links to contract workspace and user information
      
    - `ref_template_recommendation`
      - AI-generated template recommendations based on sourcing events
      - Confidence scores and reasoning for recommendations
      - Links templates to sourcing events with context analysis
      
    - `fact_legal_collaboration`
      - Inline comments and discussions on contract clauses
      - Thread support for nested conversations
      - Links to specific contract sections and users
      
    - `ref_approval_workflow_config`
      - Configurable approval workflows (serial/parallel)
      - Role-based routing rules and value thresholds
      - Contract type specific approval paths
      
    - `fact_digital_signature`
      - Digital signature records with timestamps
      - IP address tracking and certificate storage
      - Multi-party signature workflow support
      
    - `fact_writing_insight_decision`
      - User decisions on AI writing insights (approve/reject)
      - Rationale logging for audit compliance
      - Links to AI insights and contract workspaces

  2. Security
    - Enable RLS on all new tables
    - Authenticated users can create and update
    - Public read access for demo purposes

  3. Important Notes
    - All content in sustainable power generation context
    - Comprehensive audit trails for compliance
    - Support for ESG and renewable energy requirements
*/

-- Create ref_clause_library table
CREATE TABLE IF NOT EXISTS ref_clause_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clause_category text NOT NULL CHECK (clause_category IN (
    'Environmental Compliance',
    'Renewable Energy Certification',
    'Carbon Offset',
    'Performance Guarantee',
    'ESG Reporting',
    'Local Content',
    'Grid Interconnection',
    'Warranty',
    'Force Majeure',
    'Liability',
    'Payment Terms',
    'Delivery Schedule'
  )),
  clause_title text NOT NULL,
  clause_content text NOT NULL,
  contract_type text[] DEFAULT ARRAY[]::text[],
  is_mandatory boolean DEFAULT false,
  is_critical boolean DEFAULT false,
  applicable_to_solar boolean DEFAULT true,
  applicable_to_wind boolean DEFAULT true,
  applicable_to_battery boolean DEFAULT true,
  applicable_to_hydro boolean DEFAULT true,
  tags text[] DEFAULT ARRAY[]::text[],
  created_by text NOT NULL,
  organization_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fact_contract_personnel_assignment table
CREATE TABLE IF NOT EXISTS fact_contract_personnel_assignment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_workspace_id uuid NOT NULL REFERENCES fact_contract_workspace(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  user_name text NOT NULL,
  user_role text NOT NULL CHECK (user_role IN (
    'Procurement Lead',
    'Legal Counsel',
    'Technical Reviewer',
    'Finance Manager',
    'Project Manager',
    'ESG Compliance Officer'
  )),
  expertise_area text[] DEFAULT ARRAY[]::text[],
  current_workload integer DEFAULT 0,
  assignment_status text DEFAULT 'Active' CHECK (assignment_status IN ('Active', 'Completed', 'Reassigned')),
  assigned_by text NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  organization_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create ref_template_recommendation table
CREATE TABLE IF NOT EXISTS ref_template_recommendation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_event_id text NOT NULL,
  template_id uuid REFERENCES fact_contract_template(id) ON DELETE CASCADE,
  recommendation_reason text NOT NULL,
  confidence_score decimal(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  analysis_context jsonb DEFAULT '{}'::jsonb,
  contract_type text NOT NULL,
  estimated_value text,
  recommended_clauses text[] DEFAULT ARRAY[]::text[],
  is_selected boolean DEFAULT false,
  organization_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create fact_legal_collaboration table
CREATE TABLE IF NOT EXISTS fact_legal_collaboration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_workspace_id uuid NOT NULL REFERENCES fact_contract_workspace(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES fact_legal_collaboration(id) ON DELETE CASCADE,
  clause_section text NOT NULL,
  comment_text text NOT NULL,
  comment_type text DEFAULT 'General' CHECK (comment_type IN ('General', 'Question', 'Suggestion', 'Concern', 'Approval', 'Rejection')),
  commenter_id text NOT NULL,
  commenter_name text NOT NULL,
  commenter_role text NOT NULL,
  is_resolved boolean DEFAULT false,
  resolved_by text,
  resolved_at timestamptz,
  organization_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create ref_approval_workflow_config table
CREATE TABLE IF NOT EXISTS ref_approval_workflow_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_name text NOT NULL,
  contract_type text NOT NULL,
  min_value decimal,
  max_value decimal,
  workflow_type text DEFAULT 'Serial' CHECK (workflow_type IN ('Serial', 'Parallel', 'Hybrid')),
  approval_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  sla_hours integer DEFAULT 72,
  escalation_path jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  organization_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fact_digital_signature table
CREATE TABLE IF NOT EXISTS fact_digital_signature (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_workspace_id uuid NOT NULL REFERENCES fact_contract_workspace(id) ON DELETE CASCADE,
  approval_id uuid REFERENCES fact_contract_approval(id) ON DELETE CASCADE,
  signer_id text NOT NULL,
  signer_name text NOT NULL,
  signer_role text NOT NULL,
  signature_data text,
  signature_method text DEFAULT 'Digital' CHECK (signature_method IN ('Digital', 'Electronic', 'Biometric')),
  ip_address text,
  device_info text,
  certificate_id text,
  certificate_issuer text,
  signature_timestamp timestamptz DEFAULT now(),
  is_valid boolean DEFAULT true,
  validation_timestamp timestamptz,
  organization_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create fact_writing_insight_decision table
CREATE TABLE IF NOT EXISTS fact_writing_insight_decision (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_insight_id uuid NOT NULL REFERENCES ref_contract_ai_insight(id) ON DELETE CASCADE,
  contract_workspace_id uuid NOT NULL REFERENCES fact_contract_workspace(id) ON DELETE CASCADE,
  decision text NOT NULL CHECK (decision IN ('Approved', 'Rejected', 'Modified', 'Deferred')),
  decision_by text NOT NULL,
  decision_role text NOT NULL,
  rationale text,
  modified_content text,
  decision_timestamp timestamptz DEFAULT now(),
  organization_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE ref_clause_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_contract_personnel_assignment ENABLE ROW LEVEL SECURITY;
ALTER TABLE ref_template_recommendation ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_legal_collaboration ENABLE ROW LEVEL SECURITY;
ALTER TABLE ref_approval_workflow_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_digital_signature ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_writing_insight_decision ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ref_clause_library
CREATE POLICY "Anyone can view clause library"
  ON ref_clause_library FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create clauses"
  ON ref_clause_library FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clauses"
  ON ref_clause_library FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for fact_contract_personnel_assignment
CREATE POLICY "Anyone can view personnel assignments"
  ON fact_contract_personnel_assignment FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create assignments"
  ON fact_contract_personnel_assignment FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update assignments"
  ON fact_contract_personnel_assignment FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for ref_template_recommendation
CREATE POLICY "Anyone can view template recommendations"
  ON ref_template_recommendation FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create recommendations"
  ON ref_template_recommendation FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update recommendations"
  ON ref_template_recommendation FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for fact_legal_collaboration
CREATE POLICY "Anyone can view legal comments"
  ON fact_legal_collaboration FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON fact_legal_collaboration FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update comments"
  ON fact_legal_collaboration FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for ref_approval_workflow_config
CREATE POLICY "Anyone can view workflow configs"
  ON ref_approval_workflow_config FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create workflow configs"
  ON ref_approval_workflow_config FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update workflow configs"
  ON ref_approval_workflow_config FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for fact_digital_signature
CREATE POLICY "Anyone can view digital signatures"
  ON fact_digital_signature FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create signatures"
  ON fact_digital_signature FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for fact_writing_insight_decision
CREATE POLICY "Anyone can view insight decisions"
  ON fact_writing_insight_decision FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create insight decisions"
  ON fact_writing_insight_decision FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update insight decisions"
  ON fact_writing_insight_decision FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_clause_library_category ON ref_clause_library(clause_category);
CREATE INDEX IF NOT EXISTS idx_clause_library_contract_type ON ref_clause_library USING GIN(contract_type);
CREATE INDEX IF NOT EXISTS idx_clause_library_organization ON ref_clause_library(organization_id);

CREATE INDEX IF NOT EXISTS idx_personnel_assignment_workspace ON fact_contract_personnel_assignment(contract_workspace_id);
CREATE INDEX IF NOT EXISTS idx_personnel_assignment_user ON fact_contract_personnel_assignment(user_id);
CREATE INDEX IF NOT EXISTS idx_personnel_assignment_role ON fact_contract_personnel_assignment(user_role);

CREATE INDEX IF NOT EXISTS idx_template_recommendation_sourcing ON ref_template_recommendation(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_template_recommendation_template ON ref_template_recommendation(template_id);
CREATE INDEX IF NOT EXISTS idx_template_recommendation_confidence ON ref_template_recommendation(confidence_score);

CREATE INDEX IF NOT EXISTS idx_legal_collaboration_workspace ON fact_legal_collaboration(contract_workspace_id);
CREATE INDEX IF NOT EXISTS idx_legal_collaboration_parent ON fact_legal_collaboration(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_legal_collaboration_commenter ON fact_legal_collaboration(commenter_id);

CREATE INDEX IF NOT EXISTS idx_workflow_config_contract_type ON ref_approval_workflow_config(contract_type);
CREATE INDEX IF NOT EXISTS idx_workflow_config_active ON ref_approval_workflow_config(is_active);

CREATE INDEX IF NOT EXISTS idx_digital_signature_workspace ON fact_digital_signature(contract_workspace_id);
CREATE INDEX IF NOT EXISTS idx_digital_signature_approval ON fact_digital_signature(approval_id);
CREATE INDEX IF NOT EXISTS idx_digital_signature_signer ON fact_digital_signature(signer_id);

CREATE INDEX IF NOT EXISTS idx_insight_decision_insight ON fact_writing_insight_decision(ai_insight_id);
CREATE INDEX IF NOT EXISTS idx_insight_decision_workspace ON fact_writing_insight_decision(contract_workspace_id);
CREATE INDEX IF NOT EXISTS idx_insight_decision_by ON fact_writing_insight_decision(decision_by);