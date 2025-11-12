/*
  # Create Template AI Suggestion System

  ## Overview
  This migration creates a table to store AI-generated clause recommendations
  for contract templates based on sourcing event and tender document analysis.

  ## New Tables

  ### 1. `fact_template_ai_suggestion`
  Stores AI-generated recommendations for contract clause improvements.

  **Columns:**
  - `id` (uuid, primary key) - Unique suggestion identifier
  - `template_id` (uuid, foreign key) - Reference to contract template
  - `sourcing_event_id` (text) - Reference to source sourcing event
  - `clause_category` (text) - Category of clause (legal, financial, delivery, etc.)
  - `suggested_clause_text` (text) - The actual recommended clause text
  - `confidence_score` (numeric) - AI confidence level (0.0 to 1.0)
  - `applied_status` (text) - Status: pending, accepted, rejected
  - `applied_by` (text) - User who accepted/rejected the suggestion
  - `applied_at` (timestamptz) - When the suggestion was applied
  - `reasoning` (text) - Explanation for the AI recommendation
  - `section_reference` (text) - Target section in template for this clause
  - `priority` (text) - Suggestion priority: critical, high, medium, low
  - `organization_id` (uuid) - Multi-tenancy support
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  - Enable RLS on fact_template_ai_suggestion table
  - Allow authenticated users to read and manage suggestions
  - Allow anonymous users to read suggestions (demo purposes)

  ## Important Notes
  - Confidence scores range from 0.0 (low confidence) to 1.0 (high confidence)
  - Applied status tracks lifecycle: pending -> accepted/rejected
  - Links to both template and sourcing event for full traceability
  - Priority helps users focus on most important recommendations first
*/

-- Create fact_template_ai_suggestion table
CREATE TABLE IF NOT EXISTS fact_template_ai_suggestion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES fact_contract_template(id) ON DELETE CASCADE,
  sourcing_event_id text NOT NULL,
  clause_category text NOT NULL CHECK (clause_category IN ('Legal', 'Financial', 'Delivery', 'Performance', 'Compliance', 'Risk Management', 'Termination', 'Special Conditions')),
  suggested_clause_text text NOT NULL,
  confidence_score numeric(3, 2) NOT NULL DEFAULT 0.75 CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
  applied_status text NOT NULL DEFAULT 'pending' CHECK (applied_status IN ('pending', 'accepted', 'rejected')),
  applied_by text,
  applied_at timestamptz,
  reasoning text NOT NULL,
  section_reference text NOT NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  organization_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE fact_template_ai_suggestion ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fact_template_ai_suggestion
CREATE POLICY "Anyone can view AI suggestions"
  ON fact_template_ai_suggestion FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create AI suggestions"
  ON fact_template_ai_suggestion FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update AI suggestions"
  ON fact_template_ai_suggestion FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete AI suggestions"
  ON fact_template_ai_suggestion FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_template_ai_suggestion_template ON fact_template_ai_suggestion(template_id);
CREATE INDEX IF NOT EXISTS idx_template_ai_suggestion_sourcing_event ON fact_template_ai_suggestion(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_template_ai_suggestion_status ON fact_template_ai_suggestion(applied_status);
CREATE INDEX IF NOT EXISTS idx_template_ai_suggestion_priority ON fact_template_ai_suggestion(priority);
CREATE INDEX IF NOT EXISTS idx_template_ai_suggestion_category ON fact_template_ai_suggestion(clause_category);
CREATE INDEX IF NOT EXISTS idx_template_ai_suggestion_organization ON fact_template_ai_suggestion(organization_id);
