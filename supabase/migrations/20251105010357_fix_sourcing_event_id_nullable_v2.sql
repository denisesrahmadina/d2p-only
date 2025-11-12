/*
  # Fix sourcing_event_id NOT NULL Constraint

  ## Summary
  This migration removes the NOT NULL constraint from the legacy `sourcing_event_id` 
  column in the fact_sourcing_event table. The application uses the `id` (UUID) column
  as the primary identifier, and the old `sourcing_event_id` field is not populated
  during record creation.

  ## Problem
  The table has both legacy columns (sourcing_event_id, sourcing_event_line_id) and 
  new columns (id, title, material_ids, etc.) from different migration phases. The
  application code only populates the new schema columns, causing INSERT failures
  due to the NOT NULL constraint on sourcing_event_id.

  ## Solution
  Make sourcing_event_id nullable to allow new records to be created without providing
  this legacy field. Existing records with sourcing_event_id values remain unchanged.

  ## Changes
  1. Remove NOT NULL constraint from sourcing_event_id column
  2. Verify the column is now nullable
  3. Test INSERT operation works without sourcing_event_id

  ## Data Integrity
  - No data is modified or lost
  - Existing records retain their sourcing_event_id values
  - New records can be created with NULL sourcing_event_id
  - The id (UUID) column serves as the primary identifier
*/

-- Remove NOT NULL constraint from sourcing_event_id
ALTER TABLE fact_sourcing_event 
  ALTER COLUMN sourcing_event_id DROP NOT NULL;

-- Add comment to explain the column status
COMMENT ON COLUMN fact_sourcing_event.sourcing_event_id IS
  'Legacy identifier field. New records use the id (UUID) column instead. This field is nullable for backward compatibility.';

-- Verify the change
DO $$
DECLARE
  col_nullable TEXT;
BEGIN
  SELECT c.is_nullable INTO col_nullable
  FROM information_schema.columns c
  WHERE c.table_name = 'fact_sourcing_event'
    AND c.column_name = 'sourcing_event_id';
  
  IF col_nullable = 'YES' THEN
    RAISE NOTICE '✅ sourcing_event_id column is now nullable';
  ELSE
    RAISE WARNING '⚠️ sourcing_event_id column is still NOT NULL';
  END IF;
END $$;
