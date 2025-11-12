/*
  # Add approval_status column to fact_sourcing_event table

  ## Summary
  This migration resolves the schema cache error: "Could not find the 'approval_status' column of 'fact_sourcing_event' in the schema cache"

  ## Root Cause
  The application code expects an `approval_status` column in the `fact_sourcing_event` table, but the actual database schema doesn't have this column. The existing table uses `event_status` instead, which serves a different purpose.

  ## Changes Made
  1. **Add approval_status column**
     - Data type: `text` to store approval workflow states
     - Default value: `'Pending'` for backward compatibility with existing records
     - NOT NULL constraint to ensure data integrity
     - Values: 'Pending', 'Approved', 'Rejected'

  2. **Add supporting approval fields**
     - `approved_by`: text field to track who approved/rejected the event
     - `approved_at`: timestamptz field to track when approval occurred

  3. **Add performance index**
     - Create index on approval_status for efficient filtering queries
     - This improves performance when querying events by approval status

  4. **Add column comment**
     - Document the purpose and valid values for the approval_status column

  ## Data Integrity
  - Uses IF NOT EXISTS check to ensure idempotent execution
  - Existing records will automatically get 'Pending' as default approval_status
  - No data loss or disruption to existing functionality
  - Maintains all existing columns and constraints

  ## Security
  - Existing Row Level Security (RLS) policies automatically apply to new columns
  - No changes needed to access control policies
  - Authenticated users can read and update approval status per existing policies

  ## Verification Steps
  After migration:
  1. Verify column exists: SELECT column_name FROM information_schema.columns WHERE table_name = 'fact_sourcing_event' AND column_name = 'approval_status';
  2. Test insert: INSERT INTO fact_sourcing_event (sourcing_event_id, sourcing_event_name) VALUES ('TEST-001', 'Test Event');
  3. Test select: SELECT sourcing_event_id, approval_status FROM fact_sourcing_event WHERE sourcing_event_id = 'TEST-001';
  4. Test update: UPDATE fact_sourcing_event SET approval_status = 'Approved', approved_by = 'admin@example.com' WHERE sourcing_event_id = 'TEST-001';
*/

-- Add approval_status column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event'
    AND column_name = 'approval_status'
  ) THEN
    ALTER TABLE fact_sourcing_event
      ADD COLUMN approval_status text NOT NULL DEFAULT 'Pending';
    
    RAISE NOTICE 'Added approval_status column to fact_sourcing_event table';
  ELSE
    RAISE NOTICE 'approval_status column already exists in fact_sourcing_event table';
  END IF;
END $$;

-- Add approved_by column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event'
    AND column_name = 'approved_by'
  ) THEN
    ALTER TABLE fact_sourcing_event
      ADD COLUMN approved_by text;
    
    RAISE NOTICE 'Added approved_by column to fact_sourcing_event table';
  ELSE
    RAISE NOTICE 'approved_by column already exists in fact_sourcing_event table';
  END IF;
END $$;

-- Add approved_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event'
    AND column_name = 'approved_at'
  ) THEN
    ALTER TABLE fact_sourcing_event
      ADD COLUMN approved_at timestamptz;
    
    RAISE NOTICE 'Added approved_at column to fact_sourcing_event table';
  ELSE
    RAISE NOTICE 'approved_at column already exists in fact_sourcing_event table';
  END IF;
END $$;

-- Create index for approval_status for better query performance
CREATE INDEX IF NOT EXISTS idx_sourcing_event_approval_status
  ON fact_sourcing_event(approval_status);

-- Add comment to document the column purpose and valid values
COMMENT ON COLUMN fact_sourcing_event.approval_status IS
  'Approval workflow status for sourcing events. Valid values: Pending (default), Approved, Rejected. Used to track manager approval before events can be published or executed.';

COMMENT ON COLUMN fact_sourcing_event.approved_by IS
  'Email or identifier of the user who approved or rejected the sourcing event';

COMMENT ON COLUMN fact_sourcing_event.approved_at IS
  'Timestamp when the sourcing event was approved or rejected';
