/*
  # Enhance Sourcing Event Approval Workflow

  ## Summary
  This migration enhances the sourcing event approval workflow to support automated
  sourcing event creation from AI bundling and manager approval queue functionality.

  ## Changes

  1. **New Columns for fact_sourcing_event**
     - `created_by` (text): Email/name of the planner who created the event
     - `rejection_reason` (text): Manager's feedback when rejecting an event
     - `approved_at` (timestamptz): Timestamp when event was approved
     - `rejected_at` (timestamptz): Timestamp when event was rejected
     - `bundle_id` (text): Reference to the AI bundle that created this event (nullable)

  2. **Indexes for Performance**
     - Index on `approval_status` for manager queue filtering
     - Index on `status` and `approval_status` composite for efficient queries
     - Index on `created_by` for planner-specific filtering

  3. **Updated Constraints**
     - Ensure `approval_status` defaults to 'Pending' for new events

  ## Important Notes
  - Existing data is preserved
  - All new events will default to 'Pending' approval status
  - Manager approval workflow enabled for all sourcing events
*/

-- Add new columns to fact_sourcing_event table
ALTER TABLE fact_sourcing_event
ADD COLUMN IF NOT EXISTS created_by TEXT,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS bundle_id TEXT;

-- Update existing records to have a default created_by if null
UPDATE fact_sourcing_event
SET created_by = assigned_to
WHERE created_by IS NULL AND assigned_to IS NOT NULL;

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_sourcing_event_approval_status
ON fact_sourcing_event(approval_status);

CREATE INDEX IF NOT EXISTS idx_sourcing_event_status_approval
ON fact_sourcing_event(status, approval_status);

CREATE INDEX IF NOT EXISTS idx_sourcing_event_created_by
ON fact_sourcing_event(created_by);

CREATE INDEX IF NOT EXISTS idx_sourcing_event_organization_approval
ON fact_sourcing_event(organization_id, approval_status);

-- Add comment to explain approval workflow
COMMENT ON COLUMN fact_sourcing_event.created_by IS
'Email or name of the planner who created this sourcing event';

COMMENT ON COLUMN fact_sourcing_event.rejection_reason IS
'Manager feedback when event is rejected, used to guide planner revisions';

COMMENT ON COLUMN fact_sourcing_event.approved_at IS
'Timestamp when manager approved the event';

COMMENT ON COLUMN fact_sourcing_event.rejected_at IS
'Timestamp when manager rejected the event';

COMMENT ON COLUMN fact_sourcing_event.bundle_id IS
'Reference to AI bundling group ID if this event was created from bundle finalization';
