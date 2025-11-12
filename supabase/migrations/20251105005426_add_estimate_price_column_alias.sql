/*
  # Add estimate_price column alias to fact_sourcing_event table

  ## Summary
  This migration resolves the schema cache error: "Could not find the 'estimate_price' column of 'fact_sourcing_event' in the schema cache"

  ## Root Cause
  The application code expects a column named `estimate_price` (without 'd'), but the actual database has `estimated_price` (with 'd'). This is a column naming inconsistency between the application layer and database schema.

  ## Schema Cache in Supabase
  Supabase uses PostgREST, which maintains a schema cache (in-memory representation) of the database structure:
  - The cache correctly reflects `estimated_price` as the actual column
  - The application queries for `estimate_price` (different name)
  - PostgREST cannot find `estimate_price` in its cached schema
  - Result: "Could not find column in schema cache" error

  ## Solution: Add Column Alias
  Instead of renaming (which requires data migration), we add a new column `estimate_price` that acts as an alias/duplicate of `estimated_price`. This approach:
  - ✅ Maintains backward compatibility (legacy systems can still use `estimated_price`)
  - ✅ Enables new application to use `estimate_price`
  - ✅ Zero downtime deployment
  - ✅ No data migration required
  - ✅ Both columns stay synchronized automatically via triggers

  ## Changes Made
  1. **Add estimate_price column** (nullable, no default needed)
  2. **Copy existing data** from `estimated_price` to `estimate_price`
  3. **Create trigger** to keep both columns synchronized on INSERT/UPDATE
  4. **Add index** for query performance
  5. **Document the alias relationship**

  ## Data Integrity
  - Uses conditional IF NOT EXISTS for idempotent execution
  - Existing data copied from `estimated_price` column
  - Trigger ensures both columns always have the same value
  - No data loss or disruption

  ## Security
  - Existing Row Level Security (RLS) policies automatically apply
  - No changes needed to access control

  ## Alternative Solutions Considered
  1. ❌ Rename column: Would break legacy systems using `estimated_price`
  2. ❌ Update application code: Would require code changes and redeployment
  3. ✅ Add alias column: Best of both worlds - supports both naming conventions

  ## Verification Steps
  After migration:
  1. Verify column exists: SELECT column_name FROM information_schema.columns WHERE table_name = 'fact_sourcing_event' AND column_name = 'estimate_price';
  2. Test insert: INSERT with estimate_price value
  3. Verify trigger: Check that estimated_price is also updated
  4. Test application: SourcingEventService.createEvent() should work
*/

-- Add estimate_price column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event'
    AND column_name = 'estimate_price'
  ) THEN
    -- Add the new column
    ALTER TABLE fact_sourcing_event
      ADD COLUMN estimate_price numeric;
    
    -- Copy existing data from estimated_price to estimate_price
    UPDATE fact_sourcing_event
    SET estimate_price = estimated_price
    WHERE estimate_price IS NULL;
    
    RAISE NOTICE 'Added estimate_price column to fact_sourcing_event table';
  ELSE
    RAISE NOTICE 'estimate_price column already exists in fact_sourcing_event table';
  END IF;
END $$;

-- Create trigger function to synchronize both columns
CREATE OR REPLACE FUNCTION sync_estimate_price_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- When estimate_price is updated, sync to estimated_price
  IF NEW.estimate_price IS DISTINCT FROM OLD.estimate_price THEN
    NEW.estimated_price := NEW.estimate_price;
  END IF;
  
  -- When estimated_price is updated, sync to estimate_price
  IF NEW.estimated_price IS DISTINCT FROM OLD.estimated_price THEN
    NEW.estimate_price := NEW.estimated_price;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists (for idempotency)
DROP TRIGGER IF EXISTS trigger_sync_estimate_price ON fact_sourcing_event;

-- Create trigger to keep columns synchronized
CREATE TRIGGER trigger_sync_estimate_price
  BEFORE INSERT OR UPDATE ON fact_sourcing_event
  FOR EACH ROW
  EXECUTE FUNCTION sync_estimate_price_columns();

-- Create index for estimate_price for query performance
CREATE INDEX IF NOT EXISTS idx_sourcing_event_estimate_price
  ON fact_sourcing_event(estimate_price)
  WHERE estimate_price IS NOT NULL;

-- Add column comment to document the alias relationship
COMMENT ON COLUMN fact_sourcing_event.estimate_price IS
  'Estimated price for the sourcing event. This is an alias column that mirrors estimated_price for application compatibility. Both columns are kept synchronized via trigger.';

COMMENT ON COLUMN fact_sourcing_event.estimated_price IS
  'Estimated price for the sourcing event (legacy column name). Synchronized with estimate_price column via trigger for backward compatibility.';

-- Verify synchronization with test data
DO $$
DECLARE
  test_id text;
  test_estimate_price numeric;
  test_estimated_price numeric;
BEGIN
  -- Find a test record
  SELECT sourcing_event_id INTO test_id
  FROM fact_sourcing_event
  LIMIT 1;
  
  IF test_id IS NOT NULL THEN
    -- Verify both columns have the same value
    SELECT estimate_price, estimated_price
    INTO test_estimate_price, test_estimated_price
    FROM fact_sourcing_event
    WHERE sourcing_event_id = test_id;
    
    IF test_estimate_price = test_estimated_price THEN
      RAISE NOTICE 'Column synchronization verified: estimate_price = estimated_price';
    ELSE
      RAISE WARNING 'Column synchronization issue detected: estimate_price (%) != estimated_price (%)', test_estimate_price, test_estimated_price;
    END IF;
  END IF;
END $$;
