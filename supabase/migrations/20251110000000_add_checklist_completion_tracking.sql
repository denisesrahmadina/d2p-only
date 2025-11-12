/*
  # Add Checklist Completion Tracking Fields

  1. Schema Changes
    - Add `checklist_completed_status` field to `fact_sourcing_event` table
      - Tracks the completion status of procurement checklists
      - Values: 'Not Started', 'In Progress', 'Completed', 'Submitted for Approval', 'Approved'
    - Add `checklist_submitted_at` timestamp field
      - Records when checklist was submitted for manager approval
    - Add `checklist_submitted_by` field
      - Records who submitted the completed checklist

  2. Purpose
    - Enable tracking of checklist completion workflow
    - Support manager approval of completed checklists before tender preparation
    - Maintain audit trail of checklist submissions

  3. Migration Safety
    - Uses IF NOT EXISTS to prevent errors on re-run
    - Sets default values for existing records
    - Maintains backward compatibility
*/

-- Add checklist completion tracking columns to fact_sourcing_event
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'checklist_completed_status'
  ) THEN
    ALTER TABLE fact_sourcing_event
    ADD COLUMN checklist_completed_status text DEFAULT 'Not Started';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'checklist_submitted_at'
  ) THEN
    ALTER TABLE fact_sourcing_event
    ADD COLUMN checklist_submitted_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'checklist_submitted_by'
  ) THEN
    ALTER TABLE fact_sourcing_event
    ADD COLUMN checklist_submitted_by text;
  END IF;
END $$;

-- Add comment explaining the checklist_completed_status field
COMMENT ON COLUMN fact_sourcing_event.checklist_completed_status IS 'Tracks procurement checklist completion status: Not Started, In Progress, Completed, Submitted for Approval, Approved';
COMMENT ON COLUMN fact_sourcing_event.checklist_submitted_at IS 'Timestamp when completed checklist was submitted for manager approval';
COMMENT ON COLUMN fact_sourcing_event.checklist_submitted_by IS 'User who submitted the completed checklist for approval';
