/*
  # Contract Lifecycle Management Schema

  1. New Tables
    - `fact_contract_template`
      - Contract templates generated from sourcing events
      - Tracks template content, sections, approval status
      - Links to sourcing events and organization
      - Version control for templates
      
    - `fact_contract_workspace`
      - Active contract workspaces for collaboration
      - Current content, locking mechanism, active editors
      - Links to approved templates and sourcing events
      
    - `fact_contract_change_log`
      - Individual change tracking for all edits
      - User attribution, change type, before/after content
      - Character count changes, AI suggestion tracking
      
    - `fact_contract_approval`
      - Multi-role approval workflow
      - Approver details, status, comments, insights review
      - Links to contract workspace and version
      
    - `ref_contract_ai_insight`
      - AI-generated contract insights and risk analysis
      - Categorized by risk type (Legal, Financial, Operational, etc.)
      - Severity levels, recommendations, application tracking

  2. Security
    - Enable RLS on all tables
    - Authenticated users can create and update
    - Public read access for anon users (demo purposes)

  3. Important Notes
    - All monetary values in IDR
    - Complete audit trail with user attribution
    - Categorized risk insights: Legal, Financial, Operational, Compliance, Delivery, Performance
    - Version control and change tracking for compliance
    - Multi-role approval workflow support
*/

-- Create fact_contract_template table
CREATE TABLE IF NOT EXISTS fact_contract_template (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_event_id text NOT NULL,
  template_name text NOT NULL,
  template_content jsonb NOT NULL DEFAULT '{}'::jsonb,
  template_sections jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending Approval', 'Approved', 'Rejected')),
  version integer NOT NULL DEFAULT 1,
  created_by text NOT NULL,
  approved_by text,
  approval_status text DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')),
  approval_date timestamptz,
  rejection_reason text,
  organization_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fact_contract_workspace table
CREATE TABLE IF NOT EXISTS fact_contract_workspace (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_template_id uuid REFERENCES fact_contract_template(id) ON DELETE CASCADE,
  sourcing_event_id text NOT NULL,
  current_content jsonb NOT NULL DEFAULT '{}'::jsonb,
  workspace_status text NOT NULL DEFAULT 'Active' CHECK (workspace_status IN ('Active', 'Locked', 'Archived', 'Submitted for Approval')),
  locked_by text,
  locked_at timestamptz,
  active_editors jsonb DEFAULT '[]'::jsonb,
  organization_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fact_contract_change_log table
CREATE TABLE IF NOT EXISTS fact_contract_change_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_workspace_id uuid NOT NULL REFERENCES fact_contract_workspace(id) ON DELETE CASCADE,
  changed_by text NOT NULL,
  change_type text NOT NULL CHECK (change_type IN ('Content Edit', 'AI Suggestion Applied', 'Section Added', 'Section Deleted', 'Format Change')),
  change_location text NOT NULL,
  previous_content text,
  new_content text,
  ai_suggestion_id uuid,
  character_count_change integer DEFAULT 0,
  timestamp timestamptz DEFAULT now(),
  organization_id uuid
);

-- Create fact_contract_approval table
CREATE TABLE IF NOT EXISTS fact_contract_approval (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_workspace_id uuid NOT NULL REFERENCES fact_contract_workspace(id) ON DELETE CASCADE,
  contract_version integer NOT NULL DEFAULT 1,
  approver_id text NOT NULL,
  approver_name text NOT NULL,
  approver_role text NOT NULL CHECK (approver_role IN ('Procurement Manager', 'Requestor', 'Legal', 'Finance')),
  approval_status text NOT NULL DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected', 'Revision Required')),
  comments text,
  ai_insights_reviewed boolean DEFAULT false,
  reviewed_at timestamptz,
  decision_notes text,
  organization_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create ref_contract_ai_insight table
CREATE TABLE IF NOT EXISTS ref_contract_ai_insight (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_workspace_id uuid NOT NULL REFERENCES fact_contract_workspace(id) ON DELETE CASCADE,
  insight_type text NOT NULL CHECK (insight_type IN ('Compliance Issue', 'Risk Factor', 'Missing Clause', 'Improvement Suggestion', 'Legal Risk', 'Financial Risk', 'Delivery Risk')),
  risk_category text NOT NULL CHECK (risk_category IN ('Legal', 'Financial', 'Operational', 'Compliance', 'Delivery', 'Performance')),
  severity text NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  title text NOT NULL,
  description text NOT NULL,
  affected_section text NOT NULL,
  recommendations jsonb DEFAULT '[]'::jsonb,
  auto_applied boolean DEFAULT false,
  applied_by text,
  applied_at timestamptz,
  organization_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE fact_contract_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_contract_workspace ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_contract_change_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_contract_approval ENABLE ROW LEVEL SECURITY;
ALTER TABLE ref_contract_ai_insight ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fact_contract_template
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'fact_contract_template' 
    AND policyname = 'Anyone can view contract templates'
  ) THEN
    CREATE POLICY "Anyone can view contract templates"
      ON fact_contract_template FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'fact_contract_template' 
    AND policyname = 'Authenticated users can create templates'
  ) THEN
    CREATE POLICY "Authenticated users can create templates"
      ON fact_contract_template FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'fact_contract_template' 
    AND policyname = 'Authenticated users can update templates'
  ) THEN
    CREATE POLICY "Authenticated users can update templates"
      ON fact_contract_template FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- RLS Policies for fact_contract_workspace
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'fact_contract_workspace' 
    AND policyname = 'Anyone can view contract workspaces'
  ) THEN
    CREATE POLICY "Anyone can view contract workspaces"
      ON fact_contract_workspace FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'fact_contract_workspace' 
    AND policyname = 'Authenticated users can create workspaces'
  ) THEN
    CREATE POLICY "Authenticated users can create workspaces"
      ON fact_contract_workspace FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'fact_contract_workspace' 
    AND policyname = 'Authenticated users can update workspaces'
  ) THEN
    CREATE POLICY "Authenticated users can update workspaces"
      ON fact_contract_workspace FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- RLS Policies for fact_contract_change_log
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'fact_contract_change_log' 
    AND policyname = 'Anyone can view change logs'
  ) THEN
    CREATE POLICY "Anyone can view change logs"
      ON fact_contract_change_log FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'fact_contract_change_log' 
    AND policyname = 'Authenticated users can create change logs'
  ) THEN
    CREATE POLICY "Authenticated users can create change logs"
      ON fact_contract_change_log FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- RLS Policies for fact_contract_approval
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'fact_contract_approval' 
    AND policyname = 'Anyone can view approvals'
  ) THEN
    CREATE POLICY "Anyone can view approvals"
      ON fact_contract_approval FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'fact_contract_approval' 
    AND policyname = 'Authenticated users can create approvals'
  ) THEN
    CREATE POLICY "Authenticated users can create approvals"
      ON fact_contract_approval FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'fact_contract_approval' 
    AND policyname = 'Authenticated users can update approvals'
  ) THEN
    CREATE POLICY "Authenticated users can update approvals"
      ON fact_contract_approval FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- RLS Policies for ref_contract_ai_insight
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ref_contract_ai_insight' 
    AND policyname = 'Anyone can view AI insights'
  ) THEN
    CREATE POLICY "Anyone can view AI insights"
      ON ref_contract_ai_insight FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ref_contract_ai_insight' 
    AND policyname = 'Authenticated users can create insights'
  ) THEN
    CREATE POLICY "Authenticated users can create insights"
      ON ref_contract_ai_insight FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ref_contract_ai_insight' 
    AND policyname = 'Authenticated users can update insights'
  ) THEN
    CREATE POLICY "Authenticated users can update insights"
      ON ref_contract_ai_insight FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contract_template_sourcing_event ON fact_contract_template(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_contract_template_status ON fact_contract_template(status);
CREATE INDEX IF NOT EXISTS idx_contract_template_organization ON fact_contract_template(organization_id);

CREATE INDEX IF NOT EXISTS idx_contract_workspace_template ON fact_contract_workspace(contract_template_id);
CREATE INDEX IF NOT EXISTS idx_contract_workspace_sourcing_event ON fact_contract_workspace(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_contract_workspace_status ON fact_contract_workspace(workspace_status);
CREATE INDEX IF NOT EXISTS idx_contract_workspace_organization ON fact_contract_workspace(organization_id);

CREATE INDEX IF NOT EXISTS idx_contract_change_log_workspace ON fact_contract_change_log(contract_workspace_id);
CREATE INDEX IF NOT EXISTS idx_contract_change_log_changed_by ON fact_contract_change_log(changed_by);
CREATE INDEX IF NOT EXISTS idx_contract_change_log_timestamp ON fact_contract_change_log(timestamp);

CREATE INDEX IF NOT EXISTS idx_contract_approval_workspace ON fact_contract_approval(contract_workspace_id);
CREATE INDEX IF NOT EXISTS idx_contract_approval_approver ON fact_contract_approval(approver_id);
CREATE INDEX IF NOT EXISTS idx_contract_approval_status ON fact_contract_approval(approval_status);

CREATE INDEX IF NOT EXISTS idx_contract_ai_insight_workspace ON ref_contract_ai_insight(contract_workspace_id);
CREATE INDEX IF NOT EXISTS idx_contract_ai_insight_category ON ref_contract_ai_insight(risk_category);
CREATE INDEX IF NOT EXISTS idx_contract_ai_insight_severity ON ref_contract_ai_insight(severity);