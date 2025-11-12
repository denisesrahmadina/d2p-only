/*
  # Create Tender AI Insights System

  1. New Tables
    - `fact_tender_ai_insight`
      - `id` (uuid, primary key)
      - `tender_id` (text) - Reference to tender being analyzed
      - `insight_type` (text) - Type of insight (Pricing, Supplier, Negotiation, Compliance, Risk)
      - `severity` (text) - Severity level (Critical, High, Medium, Low)
      - `risk_category` (text) - Risk category (Financial, Operational, Compliance, Delivery)
      - `title` (text) - Short insight title
      - `description` (text) - Detailed insight description
      - `affected_section` (text) - Which section/component is affected
      - `recommendations` (jsonb) - Array of recommended actions
      - `key_metrics` (jsonb) - Key metrics related to the insight
      - `confidence_score` (numeric) - AI confidence level (0-100)
      - `auto_applied` (boolean) - Whether insight was auto-applied
      - `applied_by` (text) - User who applied the insight
      - `user_action` (text) - User action taken (Acknowledged, Dismissed, Applied, Pending)
      - `user_comment` (text) - User comments on the insight
      - `organization_id` (uuid) - Organization reference
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `fact_tender_ai_insight` table
    - Add policies for authenticated users to read their organization's insights
    - Add policies for authenticated users to update insight actions
    - Add policies for anonymous users to read insights (for demo purposes)

  3. Indexes
    - Index on tender_id for fast insight retrieval
    - Index on insight_type for filtering
    - Index on severity for prioritization
    - Index on organization_id for multi-tenancy
*/

-- Create tender AI insights table
CREATE TABLE IF NOT EXISTS fact_tender_ai_insight (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id text NOT NULL,
  insight_type text NOT NULL CHECK (insight_type IN ('Pricing', 'Supplier', 'Negotiation', 'Compliance', 'Risk', 'Quality', 'Timeline')),
  severity text NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  risk_category text NOT NULL CHECK (risk_category IN ('Financial', 'Operational', 'Compliance', 'Delivery', 'Legal', 'Performance')),
  title text NOT NULL,
  description text NOT NULL,
  affected_section text NOT NULL,
  recommendations jsonb DEFAULT '[]'::jsonb,
  key_metrics jsonb DEFAULT '{}'::jsonb,
  confidence_score numeric(5,2) DEFAULT 85.0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  auto_applied boolean DEFAULT false,
  applied_by text,
  user_action text DEFAULT 'Pending' CHECK (user_action IN ('Pending', 'Acknowledged', 'Dismissed', 'Applied')),
  user_comment text,
  organization_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tender_ai_insight_tender_id ON fact_tender_ai_insight(tender_id);
CREATE INDEX IF NOT EXISTS idx_tender_ai_insight_type ON fact_tender_ai_insight(insight_type);
CREATE INDEX IF NOT EXISTS idx_tender_ai_insight_severity ON fact_tender_ai_insight(severity);
CREATE INDEX IF NOT EXISTS idx_tender_ai_insight_org ON fact_tender_ai_insight(organization_id);
CREATE INDEX IF NOT EXISTS idx_tender_ai_insight_created ON fact_tender_ai_insight(created_at DESC);

-- Enable Row Level Security
ALTER TABLE fact_tender_ai_insight ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read their organization's insights
CREATE POLICY "Users can read own organization tender insights"
  ON fact_tender_ai_insight
  FOR SELECT
  TO authenticated
  USING (
    organization_id::text IN (
      SELECT organization_id FROM users WHERE id::text = auth.uid()::text
    )
  );

-- Policy: Allow authenticated users to update insight actions
CREATE POLICY "Users can update own organization tender insights"
  ON fact_tender_ai_insight
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
CREATE POLICY "Users can insert tender insights"
  ON fact_tender_ai_insight
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id::text IN (
      SELECT organization_id FROM users WHERE id::text = auth.uid()::text
    )
  );

-- Policy: Allow anonymous read access for demo purposes
CREATE POLICY "Allow anonymous read for tender insights"
  ON fact_tender_ai_insight
  FOR SELECT
  TO anon
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_tender_insight_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trigger_update_tender_insight_timestamp ON fact_tender_ai_insight;
CREATE TRIGGER trigger_update_tender_insight_timestamp
  BEFORE UPDATE ON fact_tender_ai_insight
  FOR EACH ROW
  EXECUTE FUNCTION update_tender_insight_updated_at();
