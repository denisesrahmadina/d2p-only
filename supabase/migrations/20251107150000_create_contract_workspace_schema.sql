/*
  # Contract Workspace Schema

  1. New Tables
    - `contract_reviews`
      - Core contract review tracking table
      - Stores contract metadata, status, and workflow stage
      - Links to vendor and contract lifecycle data

    - `vendor_feedback`
      - Vendor submitted feedback on contract terms
      - Categorized by feedback type and sentiment
      - Linked to specific contract sections

    - `ai_suggested_changes`
      - AI-generated contract modifications based on vendor feedback
      - Includes confidence scores and reasoning
      - Tracks acceptance status

    - `stakeholder_approvals`
      - Multi-stakeholder approval workflow
      - Supports procurement, legal, finance, and executive reviews
      - Tracks approval status and comments

    - `internal_comments`
      - Internal team discussions and notes
      - Supports collaboration during review process

  2. Security
    - Enable RLS on all tables
    - Allow anonymous read access for demo purposes
    - In production, restrict to authenticated users with proper role checks
*/

CREATE TABLE IF NOT EXISTS contract_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id text NOT NULL,
  vendor_name text NOT NULL,
  contract_type text NOT NULL,
  contract_value numeric NOT NULL,
  deadline timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending_review',
  stage text NOT NULL DEFAULT 'stage_1_selection',
  original_content jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending_review', 'in_review', 'approved', 'rejected')),
  CONSTRAINT valid_stage CHECK (stage IN ('stage_1_selection', 'stage_2_ai_review', 'stage_3_approval'))
);

CREATE TABLE IF NOT EXISTS vendor_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_review_id uuid NOT NULL REFERENCES contract_reviews(id) ON DELETE CASCADE,
  section_name text NOT NULL,
  feedback_type text NOT NULL,
  feedback_text text NOT NULL,
  sentiment text NOT NULL DEFAULT 'neutral',
  priority text NOT NULL DEFAULT 'medium',
  submitted_at timestamptz DEFAULT now(),
  CONSTRAINT valid_feedback_type CHECK (feedback_type IN ('modification_request', 'clarification', 'concern', 'suggestion')),
  CONSTRAINT valid_sentiment CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  CONSTRAINT valid_priority CHECK (priority IN ('high', 'medium', 'low'))
);

CREATE TABLE IF NOT EXISTS ai_suggested_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_review_id uuid NOT NULL REFERENCES contract_reviews(id) ON DELETE CASCADE,
  vendor_feedback_id uuid REFERENCES vendor_feedback(id) ON DELETE SET NULL,
  section_name text NOT NULL,
  change_type text NOT NULL,
  original_text text NOT NULL,
  suggested_text text NOT NULL,
  reasoning text NOT NULL,
  confidence_score numeric NOT NULL DEFAULT 0.0,
  accepted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_change_type CHECK (change_type IN ('text_modification', 'clause_addition', 'clause_removal', 'term_adjustment')),
  CONSTRAINT valid_confidence CHECK (confidence_score >= 0 AND confidence_score <= 1)
);

CREATE TABLE IF NOT EXISTS stakeholder_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_review_id uuid NOT NULL REFERENCES contract_reviews(id) ON DELETE CASCADE,
  stakeholder_type text NOT NULL,
  approval_status text NOT NULL DEFAULT 'pending',
  approved_by text,
  approved_at timestamptz,
  comments text,
  CONSTRAINT valid_stakeholder_type CHECK (stakeholder_type IN ('procurement', 'legal', 'finance', 'executive')),
  CONSTRAINT valid_approval_status CHECK (approval_status IN ('pending', 'approved', 'rejected', 'escalated'))
);

CREATE TABLE IF NOT EXISTS internal_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_review_id uuid NOT NULL REFERENCES contract_reviews(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  comment_text text NOT NULL,
  comment_type text NOT NULL DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_comment_type CHECK (comment_type IN ('general', 'question', 'concern', 'suggestion'))
);

ALTER TABLE contract_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggested_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholder_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to contract_reviews"
  ON contract_reviews FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous write access to contract_reviews"
  ON contract_reviews FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous read access to vendor_feedback"
  ON vendor_feedback FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous write access to vendor_feedback"
  ON vendor_feedback FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous read access to ai_suggested_changes"
  ON ai_suggested_changes FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous write access to ai_suggested_changes"
  ON ai_suggested_changes FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous read access to stakeholder_approvals"
  ON stakeholder_approvals FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous write access to stakeholder_approvals"
  ON stakeholder_approvals FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous read access to internal_comments"
  ON internal_comments FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous write access to internal_comments"
  ON internal_comments FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_contract_reviews_status ON contract_reviews(status);
CREATE INDEX IF NOT EXISTS idx_contract_reviews_stage ON contract_reviews(stage);
CREATE INDEX IF NOT EXISTS idx_vendor_feedback_contract ON vendor_feedback(contract_review_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_contract ON ai_suggested_changes(contract_review_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_approvals_contract ON stakeholder_approvals(contract_review_id);
CREATE INDEX IF NOT EXISTS idx_internal_comments_contract ON internal_comments(contract_review_id);
