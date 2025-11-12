/*
  # Clean Sourcing Events Mock Data

  ## Summary
  This migration removes all existing mock data and placeholder records from the
  sourcing events system to ensure a clean slate for the new AI bundling workflow.

  ## Changes

  1. **Delete All Existing Data**
     - Remove all records from `fact_sourcing_event` table
     - Remove all related milestone data from `ref_sourcing_event_milestone`
     - Remove all related tender documents
     - Remove all related procurement checklist items

  2. **Reset Sequences**
     - Reset any auto-increment sequences if applicable

  ## Important Notes
  - This creates a clean environment where sourcing events only appear after
    being created from finalized AI bundles in Step 1
  - Both "Select Event" and "Manager Approval" pages will show empty states
  - No mock or placeholder data will remain
*/

-- Delete all related procurement checklist items first (foreign key constraint)
DELETE FROM ref_procurement_checklist;

-- Delete all tender documents
DELETE FROM ref_tender_document;

-- Delete all sourcing event milestones
DELETE FROM ref_sourcing_event_milestone;

-- Delete all sourcing events
DELETE FROM fact_sourcing_event;

-- Add comment to track cleanup
COMMENT ON TABLE fact_sourcing_event IS
'Sourcing events table - cleaned on 2025-11-08. Only populated by AI bundling workflow.';
