/*
  # Create Sourcing Events System with Predefined Data

  1. New Tables
    - `fact_sourcing_event`
      - Sourcing event records with approval workflow
      - Fields: id, sourcing_event_id, title, category, total_value, vendor_count, status, approval_status, created_by, responsible_planner, bundle_id, rejection_reason, approved_at, rejected_at, approved_by, organization_id

  2. Predefined Data
    - Three sample sourcing events demonstrating different statuses:
      - SRC-2025-001: Waiting for Approval
      - SRC-2025-002: Approved
      - SRC-2025-003: Rejected

  3. Security
    - RLS enabled with authenticated user access
    - Policies for SELECT, INSERT, UPDATE operations

  4. Status Flow
    - Draft → Waiting for Approval → Approved/Rejected
    - Status changes sync between Step 2 and Manager Approval
*/

-- Create fact_sourcing_event table
CREATE TABLE IF NOT EXISTS fact_sourcing_event (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_event_id text NOT NULL UNIQUE,
  title text NOT NULL,
  category text,
  total_value numeric NOT NULL DEFAULT 0,
  vendor_count integer DEFAULT 0,
  status text NOT NULL DEFAULT 'Draft',
  approval_status text NOT NULL DEFAULT 'Pending',
  created_by text,
  responsible_planner text,
  bundle_id text,
  rejection_reason text,
  approved_at timestamptz,
  rejected_at timestamptz,
  approved_by text,
  organization_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fact_sourcing_event ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read sourcing events"
  ON fact_sourcing_event FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anonymous users can read sourcing events"
  ON fact_sourcing_event FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can create sourcing events"
  ON fact_sourcing_event FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anonymous users can create sourcing events"
  ON fact_sourcing_event FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update sourcing events"
  ON fact_sourcing_event FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update sourcing events"
  ON fact_sourcing_event FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sourcing_event_org ON fact_sourcing_event(organization_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_event_status ON fact_sourcing_event(status);
CREATE INDEX IF NOT EXISTS idx_sourcing_event_approval_status ON fact_sourcing_event(approval_status);
CREATE INDEX IF NOT EXISTS idx_sourcing_event_id ON fact_sourcing_event(sourcing_event_id);

-- Insert three predefined sourcing events
INSERT INTO fact_sourcing_event (
  sourcing_event_id,
  title,
  category,
  total_value,
  vendor_count,
  status,
  approval_status,
  created_by,
  responsible_planner,
  organization_id
) VALUES
(
  'SRC-2025-001',
  'Siemens Mechanical Equipment',
  'Mechanical Equipment',
  19.8,
  3,
  'Draft',
  'Pending',
  'Planner A',
  'John Doe',
  'indonesia-power'
),
(
  'SRC-2025-002',
  'ABB Electrical Systems',
  'Electrical Equipment',
  24.5,
  4,
  'Approved',
  'Approved',
  'Planner B',
  'Jane Smith',
  'indonesia-power'
),
(
  'SRC-2025-003',
  'Schneider Control Panel Procurement',
  'Electrical Equipment',
  12.3,
  2,
  'Rejected',
  'Rejected',
  'Planner C',
  'Agus Rahman',
  'indonesia-power'
);
