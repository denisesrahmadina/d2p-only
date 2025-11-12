/*
  # Add Requested Revision Status to PR Status Constraint

  ## Overview
  Adds 'Requested Revision' status to the allowed PR status values.

  ## Changes
  - Drop existing constraint
  - Add new constraint with 'Requested Revision' included
*/

-- Drop the existing constraint
ALTER TABLE fact_pr_header DROP CONSTRAINT IF EXISTS fact_pr_header_pr_status_check;

-- Add updated constraint with 'Requested Revision'
ALTER TABLE fact_pr_header ADD CONSTRAINT fact_pr_header_pr_status_check
  CHECK (pr_status IN ('Draft', 'Pending Approval', 'Requested Revision', 'Approved', 'Rejected', 'In Procurement', 'Completed', 'Cancelled'));

-- Add comment
COMMENT ON CONSTRAINT fact_pr_header_pr_status_check ON fact_pr_header IS 'Valid PR status values including revision workflow';
