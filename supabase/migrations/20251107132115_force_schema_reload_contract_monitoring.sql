/*
  # Force Schema Reload for Contract Monitoring Tables

  This migration forces Supabase to reload the schema cache by performing
  a harmless schema operation that triggers the PostgREST reload.
  
  1. Changes
    - Add and remove a temporary column to force schema cache refresh
    - This ensures the contract_monitoring, contract_compliance_issues, 
      and contract_insights tables are properly recognized by the REST API
*/

-- Force schema reload by performing a schema-altering operation
DO $$ 
BEGIN
  -- Add a temporary column
  ALTER TABLE contract_monitoring ADD COLUMN IF NOT EXISTS temp_reload_trigger boolean DEFAULT false;
  
  -- Remove it immediately
  ALTER TABLE contract_monitoring DROP COLUMN IF EXISTS temp_reload_trigger;
  
  -- Ensure RLS is enabled (redundant but ensures proper setup)
  ALTER TABLE contract_monitoring ENABLE ROW LEVEL SECURITY;
  ALTER TABLE contract_compliance_issues ENABLE ROW LEVEL SECURITY;
  ALTER TABLE contract_insights ENABLE ROW LEVEL SECURITY;
END $$;

-- Verify data exists
DO $$
DECLARE
  contract_count integer;
BEGIN
  SELECT COUNT(*) INTO contract_count FROM contract_monitoring;
  
  IF contract_count = 0 THEN
    RAISE WARNING 'No contracts found in contract_monitoring table';
  ELSE
    RAISE NOTICE 'Found % contracts in contract_monitoring table', contract_count;
  END IF;
END $$;
