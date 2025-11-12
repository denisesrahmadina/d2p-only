/*
  # Enhanced APBA System Tables

  1. Updates to Existing APBA Tables
    - Add progress tracking columns
    - Add assignment tracking
    - Add approval workflow support

  2. New Columns
    - `progress_percentage` (integer) - Document completion progress
    - `assigned_to` (text) - User assigned to the document
    - `assigned_date` (timestamptz) - When document was assigned
    - `current_approver` (text) - Current approver in workflow
    - `approval_level` (integer) - Current approval level
    - `total_approval_levels` (integer) - Total approval levels needed

  3. Security
    - Maintain existing RLS policies
    - Add new policies for assignment and approval workflows
*/

-- Add new columns to apba_documents if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'apba_documents' AND column_name = 'progress_percentage'
  ) THEN
    ALTER TABLE apba_documents ADD COLUMN progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'apba_documents' AND column_name = 'assigned_to'
  ) THEN
    ALTER TABLE apba_documents ADD COLUMN assigned_to text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'apba_documents' AND column_name = 'assigned_date'
  ) THEN
    ALTER TABLE apba_documents ADD COLUMN assigned_date timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'apba_documents' AND column_name = 'current_approver'
  ) THEN
    ALTER TABLE apba_documents ADD COLUMN current_approver text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'apba_documents' AND column_name = 'approval_level'
  ) THEN
    ALTER TABLE apba_documents ADD COLUMN approval_level integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'apba_documents' AND column_name = 'total_approval_levels'
  ) THEN
    ALTER TABLE apba_documents ADD COLUMN total_approval_levels integer DEFAULT 4;
  END IF;
END $$;

-- Create document_assignments table for tracking assignments
CREATE TABLE IF NOT EXISTS document_assignments (
  assignment_id bigserial PRIMARY KEY,
  document_id text REFERENCES apba_documents(document_id),
  contract_id text,
  assigned_to text NOT NULL,
  assigned_by text,
  assigned_date timestamptz DEFAULT now(),
  due_date timestamptz,
  status text DEFAULT 'assigned' CHECK (status IN ('assigned', 'in-progress', 'completed', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  notes text,
  completed_date timestamptz,
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now()
);

-- Create approval_workflow table for multi-level approvals
CREATE TABLE IF NOT EXISTS approval_workflow (
  approval_id bigserial PRIMARY KEY,
  document_id text REFERENCES apba_documents(document_id),
  approval_level integer NOT NULL,
  approver_id text NOT NULL,
  approver_name text,
  approver_role text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'escalated')),
  action_date timestamptz,
  comments text,
  signature_data text,
  created_date timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assignments_document ON document_assignments(document_id);
CREATE INDEX IF NOT EXISTS idx_assignments_assigned_to ON document_assignments(assigned_to);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON document_assignments(status);

CREATE INDEX IF NOT EXISTS idx_approval_document ON approval_workflow(document_id);
CREATE INDEX IF NOT EXISTS idx_approval_level ON approval_workflow(approval_level);
CREATE INDEX IF NOT EXISTS idx_approval_status ON approval_workflow(status);

-- Enable RLS
ALTER TABLE document_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_workflow ENABLE ROW LEVEL SECURITY;

-- Policies for document_assignments
CREATE POLICY "Allow public read access to assignments"
  ON document_assignments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to create assignments"
  ON document_assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update assignments"
  ON document_assignments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for approval_workflow
CREATE POLICY "Allow public read access to approvals"
  ON approval_workflow
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to create approvals"
  ON approval_workflow
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update approvals"
  ON approval_workflow
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample data for APBA documents
INSERT INTO apba_documents (
  document_id, document_number, document_type, document_title,
  contract_id, document_status, progress_percentage, assigned_to,
  assigned_date, current_approver, approval_level, total_approval_levels
) VALUES
  (
    'ASG-2025-001',
    'DOC-ASG-2025-001',
    'Contract Assignment',
    'Contract CON-2025-045 Assignment',
    'CON-2025-045',
    'in-progress',
    65,
    'John Doe',
    now() - interval '5 days',
    NULL,
    0,
    1
  ),
  (
    'BA-2025-078',
    'DOC-BA-2025-078',
    'Berita Acara Creation',
    'Berita Acara Serah Terima Barang',
    'CON-2025-045',
    'in-progress',
    40,
    'Jane Smith',
    now() - interval '3 days',
    NULL,
    0,
    4
  ),
  (
    'APR-2025-032',
    'DOC-APR-2025-032',
    'Approval Workflow',
    'Multi-Level Approval Workflow',
    'CON-2025-045',
    'pending',
    0,
    NULL,
    NULL,
    'Sarah Manager',
    1,
    4
  )
ON CONFLICT (document_id) DO NOTHING;

-- Insert sample assignments
INSERT INTO document_assignments (
  document_id, contract_id, assigned_to, assigned_by,
  assigned_date, due_date, status, priority, notes
) VALUES
  (
    'ASG-2025-001',
    'CON-2025-045',
    'John Doe',
    'Manager Admin',
    now() - interval '5 days',
    now() + interval '2 days',
    'in-progress',
    'high',
    'Prepare berita acara for contract CON-2025-045'
  ),
  (
    'BA-2025-078',
    'CON-2025-045',
    'Jane Smith',
    'Manager Admin',
    now() - interval '3 days',
    now() + interval '4 days',
    'in-progress',
    'medium',
    'Create official handover document'
  )
ON CONFLICT DO NOTHING;

-- Insert sample approval workflow
INSERT INTO approval_workflow (
  document_id, approval_level, approver_id, approver_name,
  approver_role, status, action_date, comments
) VALUES
  ('APR-2025-032', 1, 'dept-head-001', 'Department Head', 'Department Head', 'approved', now() - interval '2 days', 'Approved for procurement'),
  ('APR-2025-032', 2, 'proc-mgr-001', 'Procurement Manager', 'Procurement Manager', 'pending', NULL, NULL),
  ('APR-2025-032', 3, 'fin-dir-001', 'Finance Director', 'Finance Director', 'pending', NULL, NULL),
  ('APR-2025-032', 4, 'cfo-001', 'CFO', 'CFO', 'pending', NULL, NULL),
  ('BA-2025-078', 1, 'dept-head-001', 'Department Head', 'Department Head', 'pending', NULL, NULL),
  ('BA-2025-078', 2, 'proc-mgr-001', 'Procurement Manager', 'Procurement Manager', 'pending', NULL, NULL),
  ('BA-2025-078', 3, 'fin-dir-001', 'Finance Director', 'Finance Director', 'pending', NULL, NULL),
  ('BA-2025-078', 4, 'cfo-001', 'CFO', 'CFO', 'pending', NULL, NULL)
ON CONFLICT DO NOTHING;
