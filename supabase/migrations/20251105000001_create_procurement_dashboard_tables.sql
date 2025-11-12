/*
  # Create Procurement Officer Dashboard Tables

  1. New Tables
    - `renewable_sourcing_events`
      - `id` (text, primary key) - Sourcing event ID (e.g., RSE-2025-001)
      - `title` (text) - Event title
      - `category` (text) - Renewable category: Solar, Wind, Battery
      - `description` (text) - Event description
      - `status` (text) - Draft, Scheduled, In Progress, Completed
      - `deadline` (date) - Submission deadline
      - `assigned_personnel` (text) - Assigned procurement officer name
      - `budget_estimate` (numeric) - Estimated budget in IDR
      - `vendor_invited_count` (integer) - Number of vendors invited
      - `vendor_submitted_count` (integer) - Number of vendors who submitted
      - `evaluation_progress` (numeric) - Evaluation completion percentage (0-100)
      - `approval_status` (text) - Pending, Approved, Rejected
      - `organization_id` (text) - Organization reference
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Update timestamp

    - `vendor_submissions`
      - `id` (uuid, primary key) - Unique submission ID
      - `sourcing_event_id` (text) - Reference to renewable_sourcing_events
      - `vendor_name` (text) - Vendor company name
      - `invitation_date` (date) - Date vendor was invited
      - `submission_date` (date) - Actual submission date (nullable)
      - `submission_status` (text) - Invited, Submitted, Pending, Overdue
      - `document_completeness` (numeric) - Document completeness percentage (0-100)
      - `technical_doc_status` (text) - Complete, Incomplete, Missing
      - `financial_doc_status` (text) - Complete, Incomplete, Missing
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Update timestamp

    - `tender_evaluations`
      - `id` (uuid, primary key) - Unique evaluation ID
      - `sourcing_event_id` (text) - Reference to renewable_sourcing_events
      - `evaluator_name` (text) - Evaluator personnel name
      - `evaluation_criteria` (text) - Technical, Financial, Compliance
      - `progress_percentage` (numeric) - Evaluation progress (0-100)
      - `status` (text) - Not Started, In Progress, Completed
      - `assigned_date` (date) - Date assigned to evaluator
      - `completion_date` (date) - Date completed (nullable)
      - `notes` (text) - Evaluation notes
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Update timestamp

    - `procurement_insights`
      - `id` (uuid, primary key) - Unique insight ID
      - `sourcing_event_id` (text) - Reference to renewable_sourcing_events (nullable)
      - `insight_type` (text) - Deadline, Participation, Assignment, Approval
      - `severity` (text) - Critical, Warning, Info
      - `title` (text) - Insight title
      - `description` (text) - Insight description
      - `suggested_action` (text) - Recommended action
      - `is_resolved` (boolean) - Resolution status
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Update timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for anonymous read access
    - Add policies for authenticated full access

  3. Data
    - Populate with 5 renewable energy sourcing events
    - Add vendor submission data for each event
    - Include evaluation assignments with progress tracking
    - Generate actionable insights based on event status
*/

-- Create renewable_sourcing_events table
CREATE TABLE IF NOT EXISTS renewable_sourcing_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Solar', 'Wind', 'Battery')),
  description TEXT,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Scheduled', 'In Progress', 'Completed', 'Cancelled')),
  deadline DATE NOT NULL,
  assigned_personnel TEXT NOT NULL,
  budget_estimate NUMERIC(15,2) DEFAULT 0,
  vendor_invited_count INTEGER DEFAULT 0,
  vendor_submitted_count INTEGER DEFAULT 0,
  evaluation_progress NUMERIC(5,2) DEFAULT 0 CHECK (evaluation_progress >= 0 AND evaluation_progress <= 100),
  approval_status TEXT DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')),
  organization_id TEXT DEFAULT 'indonesia-power',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vendor_submissions table
CREATE TABLE IF NOT EXISTS vendor_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_event_id TEXT NOT NULL REFERENCES renewable_sourcing_events(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  invitation_date DATE NOT NULL,
  submission_date DATE,
  submission_status TEXT DEFAULT 'Invited' CHECK (submission_status IN ('Invited', 'Submitted', 'Pending', 'Overdue')),
  document_completeness NUMERIC(5,2) DEFAULT 0 CHECK (document_completeness >= 0 AND document_completeness <= 100),
  technical_doc_status TEXT DEFAULT 'Missing' CHECK (technical_doc_status IN ('Complete', 'Incomplete', 'Missing')),
  financial_doc_status TEXT DEFAULT 'Missing' CHECK (financial_doc_status IN ('Complete', 'Incomplete', 'Missing')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tender_evaluations table
CREATE TABLE IF NOT EXISTS tender_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_event_id TEXT NOT NULL REFERENCES renewable_sourcing_events(id) ON DELETE CASCADE,
  evaluator_name TEXT NOT NULL,
  evaluation_criteria TEXT NOT NULL CHECK (evaluation_criteria IN ('Technical', 'Financial', 'Compliance', 'Overall')),
  progress_percentage NUMERIC(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  status TEXT DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Completed', 'On Hold')),
  assigned_date DATE NOT NULL,
  completion_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create procurement_insights table
CREATE TABLE IF NOT EXISTS procurement_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_event_id TEXT REFERENCES renewable_sourcing_events(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('Deadline', 'Participation', 'Assignment', 'Approval', 'Evaluation')),
  severity TEXT DEFAULT 'Info' CHECK (severity IN ('Critical', 'Warning', 'Info')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  suggested_action TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_renewable_sourcing_events_status ON renewable_sourcing_events(status);
CREATE INDEX IF NOT EXISTS idx_renewable_sourcing_events_category ON renewable_sourcing_events(category);
CREATE INDEX IF NOT EXISTS idx_renewable_sourcing_events_org ON renewable_sourcing_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_vendor_submissions_event ON vendor_submissions(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_vendor_submissions_status ON vendor_submissions(submission_status);
CREATE INDEX IF NOT EXISTS idx_tender_evaluations_event ON tender_evaluations(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_tender_evaluations_evaluator ON tender_evaluations(evaluator_name);
CREATE INDEX IF NOT EXISTS idx_procurement_insights_event ON procurement_insights(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_procurement_insights_severity ON procurement_insights(severity);

-- Enable Row Level Security
ALTER TABLE renewable_sourcing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_insights ENABLE ROW LEVEL SECURITY;

-- Create policies for renewable_sourcing_events
CREATE POLICY "Allow anonymous read access to renewable_sourcing_events"
  ON renewable_sourcing_events FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to renewable_sourcing_events"
  ON renewable_sourcing_events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for vendor_submissions
CREATE POLICY "Allow anonymous read access to vendor_submissions"
  ON vendor_submissions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to vendor_submissions"
  ON vendor_submissions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for tender_evaluations
CREATE POLICY "Allow anonymous read access to tender_evaluations"
  ON tender_evaluations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to tender_evaluations"
  ON tender_evaluations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for procurement_insights
CREATE POLICY "Allow anonymous read access to procurement_insights"
  ON procurement_insights FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to procurement_insights"
  ON procurement_insights FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
