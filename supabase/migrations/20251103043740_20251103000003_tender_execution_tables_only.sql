/*
  # Create Tender Execution Tables

  1. New Tables
    - `ref_tender_announcement_v2`: Announcement management with auto-generation
    - `ref_document_submission_section`: Document submission requirements setup
    - `ref_tender_evaluation`: Tender evaluation with AI scoring
    - `ref_winner_selection`: Winner selection tracking

  2. Security
    - RLS enabled on all tables
    - Authenticated users have full CRUD access
    - Proper indexes for query performance

  3. Features
    - Support for announcement auto-generation from sourcing events
    - Configurable document submission sections per tender
    - AI score recommendations with manual override capability
    - Complete winner selection workflow
*/

-- Tender Announcement Table
CREATE TABLE IF NOT EXISTS ref_tender_announcement_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_event_id text NOT NULL,
  title text NOT NULL,
  header text,
  opener text,
  body text,
  closing text,
  publication_date date,
  status text NOT NULL DEFAULT 'Draft',
  target_vendors jsonb DEFAULT '[]'::jsonb,
  approved_by text,
  organization_id text NOT NULL DEFAULT 'indonesia-power',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ref_tender_announcement_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage announcements v2" ON ref_tender_announcement_v2
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Document Submission Sections Table
CREATE TABLE IF NOT EXISTS ref_document_submission_section (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_event_id text NOT NULL,
  section_name text NOT NULL,
  section_description text,
  section_order integer NOT NULL,
  is_required boolean DEFAULT true,
  file_types_allowed text[],
  max_file_size_mb integer DEFAULT 10,
  organization_id text NOT NULL DEFAULT 'indonesia-power',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ref_document_submission_section ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage submission sections" ON ref_document_submission_section
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tender Evaluation Table
CREATE TABLE IF NOT EXISTS ref_tender_evaluation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_event_id text NOT NULL,
  vendor_id text NOT NULL,
  criteria_name text NOT NULL,
  ai_score numeric,
  manual_score numeric,
  weight numeric NOT NULL DEFAULT 1.0,
  justification text,
  scored_by text,
  organization_id text NOT NULL DEFAULT 'indonesia-power',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(sourcing_event_id, vendor_id, criteria_name)
);

ALTER TABLE ref_tender_evaluation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage evaluations" ON ref_tender_evaluation
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Winner Selection Table
CREATE TABLE IF NOT EXISTS ref_winner_selection (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_event_id text NOT NULL UNIQUE,
  winner_vendor_id text NOT NULL,
  total_score numeric NOT NULL,
  weighted_score numeric NOT NULL,
  selection_date date DEFAULT CURRENT_DATE,
  selected_by text,
  justification text,
  status text NOT NULL DEFAULT 'Selected',
  organization_id text NOT NULL DEFAULT 'indonesia-power',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ref_winner_selection ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage winner selections" ON ref_winner_selection
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_announcement_v2_event ON ref_tender_announcement_v2(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_announcement_v2_status ON ref_tender_announcement_v2(status);
CREATE INDEX IF NOT EXISTS idx_announcement_v2_org ON ref_tender_announcement_v2(organization_id);

CREATE INDEX IF NOT EXISTS idx_submission_section_event ON ref_document_submission_section(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_submission_section_order ON ref_document_submission_section(sourcing_event_id, section_order);
CREATE INDEX IF NOT EXISTS idx_submission_section_org ON ref_document_submission_section(organization_id);

CREATE INDEX IF NOT EXISTS idx_evaluation_event ON ref_tender_evaluation(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_vendor ON ref_tender_evaluation(vendor_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_event_vendor ON ref_tender_evaluation(sourcing_event_id, vendor_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_org ON ref_tender_evaluation(organization_id);

CREATE INDEX IF NOT EXISTS idx_winner_event ON ref_winner_selection(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_winner_vendor ON ref_winner_selection(winner_vendor_id);
CREATE INDEX IF NOT EXISTS idx_winner_org ON ref_winner_selection(organization_id);
