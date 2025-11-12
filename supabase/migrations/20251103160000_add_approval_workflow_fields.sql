/*
  # Add Approval Workflow Fields to Winner Selection and MoM Documents

  1. Changes to ref_winner_selection
    - Add approval_status field to track workflow stages
    - Add approved_by and approval_date for manager approval tracking
    - Add rejection_reason for documenting why a selection was rejected
    - Add submitted_by to track who submitted for approval
    - Add submission_date to track when submitted

  2. Changes to ref_mom_document
    - Add approval_required boolean flag
    - Add approved_by and approval_date fields
    - Add approval_status field

  3. Security
    - Maintain existing RLS policies
    - Add indexes for new status fields
*/

-- Add approval workflow fields to ref_winner_selection
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_winner_selection' AND column_name = 'approval_status'
  ) THEN
    ALTER TABLE ref_winner_selection
      ADD COLUMN approval_status text DEFAULT 'Draft',
      ADD COLUMN submitted_by text,
      ADD COLUMN submission_date timestamptz,
      ADD COLUMN approved_by text,
      ADD COLUMN approval_date timestamptz,
      ADD COLUMN rejection_reason text;
  END IF;
END $$;

-- Add approval workflow fields to ref_mom_document
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_mom_document' AND column_name = 'approval_required'
  ) THEN
    ALTER TABLE ref_mom_document
      ADD COLUMN approval_required boolean DEFAULT false,
      ADD COLUMN approval_status text DEFAULT 'Not Required',
      ADD COLUMN approved_by text,
      ADD COLUMN approval_date timestamptz;
  END IF;
END $$;

-- Create indexes for approval status fields
CREATE INDEX IF NOT EXISTS idx_winner_approval_status
  ON ref_winner_selection(approval_status);

CREATE INDEX IF NOT EXISTS idx_winner_submitted_by
  ON ref_winner_selection(submitted_by);

CREATE INDEX IF NOT EXISTS idx_mom_approval_status
  ON ref_mom_document(approval_status);

-- Add comment explaining approval statuses
COMMENT ON COLUMN ref_winner_selection.approval_status IS
  'Approval workflow status: Draft, Pending Approval, Approved, Rejected';

COMMENT ON COLUMN ref_mom_document.approval_status IS
  'MoM approval status: Not Required, Pending, Approved, Rejected';
