/*
  # Create AI Insights and Action Plans System for Source to Contract Module

  1. New Tables
    - `fact_ai_insight_action_plan`
      - `id` (uuid, primary key) - Unique insight identifier
      - `module` (text) - Source to Contract module (tender_analytics, cost_estimator, market_intelligence, etc.)
      - `page` (text) - Specific page or view within module (quote_detail, evaluation_process, sourcing_summary, etc.)
      - `view_mode` (text) - View mode if applicable (table, graph, etc.)
      - `context_id` (text) - ID of the entity being viewed (tender_id, estimate_id, etc.)
      - `insight_type` (text) - Category of insight (Pricing, Supplier, Negotiation, Compliance, Risk, Quality, Timeline, Strategic)
      - `severity` (text) - Priority level (Critical, High, Medium, Low)
      - `risk_category` (text) - Risk area (Financial, Operational, Compliance, Delivery, Legal, Performance)
      - `title` (text) - Short insight headline
      - `description` (text) - Detailed insight explanation
      - `affected_section` (text) - Which section/component is affected
      - `key_metrics` (jsonb) - Key data points and metrics related to insight
      - `action_plan` (jsonb) - Array of recommended action steps
      - `confidence_score` (numeric) - AI confidence level (0-100)
      - `auto_generated` (boolean) - Whether insight was automatically generated
      - `user_action` (text) - User response (Pending, Acknowledged, Dismissed, Applied, In_Progress)
      - `acknowledged_by` (text) - User who acknowledged the insight
      - `acknowledged_at` (timestamptz) - When insight was acknowledged
      - `user_comment` (text) - User notes and comments
      - `organization_id` (uuid) - Organization reference
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `fact_ai_insight_action_plan` table
    - Add policies for authenticated users to read their organization's insights
    - Add policies for authenticated users to update insight actions and comments
    - Add policies for anonymous users to read insights (for demo purposes)

  3. Indexes
    - Index on module and page for fast filtering
    - Index on context_id for entity-specific insights
    - Index on insight_type and severity for prioritization
    - Index on organization_id for multi-tenancy
    - Index on created_at for chronological sorting

  4. Notes
    - This table supports AI insights across all Source to Contract module pages
    - Insights can be automatically generated based on data patterns
    - Action plans provide step-by-step recommendations
    - User interactions are tracked for feedback and improvement
*/

-- Create AI insights and action plans table
CREATE TABLE IF NOT EXISTS fact_ai_insight_action_plan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module text NOT NULL CHECK (module IN (
    'tender_analytics', 'cost_estimator', 'market_intelligence',
    'category_manager', 'e_procurement', 'contract_lifecycle',
    'spend_analysis'
  )),
  page text NOT NULL,
  view_mode text,
  context_id text,
  insight_type text NOT NULL CHECK (insight_type IN (
    'Pricing', 'Supplier', 'Negotiation', 'Compliance', 'Risk',
    'Quality', 'Timeline', 'Strategic', 'Cost_Optimization', 'Market_Trend'
  )),
  severity text NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  risk_category text NOT NULL CHECK (risk_category IN (
    'Financial', 'Operational', 'Compliance', 'Delivery', 'Legal', 'Performance'
  )),
  title text NOT NULL,
  description text NOT NULL,
  affected_section text,
  key_metrics jsonb DEFAULT '{}'::jsonb,
  action_plan jsonb DEFAULT '[]'::jsonb,
  confidence_score numeric(5,2) DEFAULT 85.0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  auto_generated boolean DEFAULT true,
  user_action text DEFAULT 'Pending' CHECK (user_action IN (
    'Pending', 'Acknowledged', 'Dismissed', 'Applied', 'In_Progress'
  )),
  acknowledged_by text,
  acknowledged_at timestamptz,
  user_comment text,
  organization_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_insight_module_page ON fact_ai_insight_action_plan(module, page);
CREATE INDEX IF NOT EXISTS idx_ai_insight_context ON fact_ai_insight_action_plan(context_id);
CREATE INDEX IF NOT EXISTS idx_ai_insight_type ON fact_ai_insight_action_plan(insight_type);
CREATE INDEX IF NOT EXISTS idx_ai_insight_severity ON fact_ai_insight_action_plan(severity);
CREATE INDEX IF NOT EXISTS idx_ai_insight_org ON fact_ai_insight_action_plan(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_insight_created ON fact_ai_insight_action_plan(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_insight_user_action ON fact_ai_insight_action_plan(user_action);

-- Enable Row Level Security
ALTER TABLE fact_ai_insight_action_plan ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read their organization's insights
CREATE POLICY "Users can read own organization AI insights"
  ON fact_ai_insight_action_plan
  FOR SELECT
  TO authenticated
  USING (
    organization_id::text IN (
      SELECT organization_id FROM users WHERE id::text = auth.uid()::text
    )
  );

-- Policy: Allow authenticated users to update insight actions
CREATE POLICY "Users can update own organization AI insights"
  ON fact_ai_insight_action_plan
  FOR UPDATE
  TO authenticated
  USING (
    organization_id::text IN (
      SELECT organization_id FROM users WHERE id::text = auth.uid()::text
    )
  )
  WITH CHECK (
    organization_id::text IN (
      SELECT organization_id FROM users WHERE id::text = auth.uid()::text
    )
  );

-- Policy: Allow authenticated users to insert insights
CREATE POLICY "Users can insert AI insights"
  ON fact_ai_insight_action_plan
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id::text IN (
      SELECT organization_id FROM users WHERE id::text = auth.uid()::text
    )
  );

-- Policy: Allow anonymous read access for demo purposes
CREATE POLICY "Allow anonymous read for AI insights"
  ON fact_ai_insight_action_plan
  FOR SELECT
  TO anon
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_insight_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trigger_update_ai_insight_timestamp ON fact_ai_insight_action_plan;
CREATE TRIGGER trigger_update_ai_insight_timestamp
  BEFORE UPDATE ON fact_ai_insight_action_plan
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_insight_updated_at();
