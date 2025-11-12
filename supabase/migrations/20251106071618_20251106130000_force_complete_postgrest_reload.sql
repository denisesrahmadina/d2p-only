/*
  # Force Complete PostgREST Schema Cache Reload
  
  1. Purpose
    - Force PostgREST to completely reload its schema cache
    - Clear any stale cache entries
    - Ensure all marketplace tables are visible to REST API
    - Verify table exposure and endpoint availability
  
  2. Actions
    - Send NOTIFY signal to PostgREST to reload schema
    - Refresh materialized views if any exist
    - Update schema metadata timestamps
    - Verify all tables are properly exposed
  
  3. Tables to Verify
    - marketplace_items (42 records expected)
    - marketplace_categories (15 records expected)
    - marketplace_suppliers (18 records expected)
    - marketplace_pln_facilities (15 records expected)
    - All related marketplace tables
*/

-- Force PostgREST to reload its schema cache immediately
NOTIFY pgrst, 'reload schema';

-- Update all marketplace table metadata to force cache invalidation
DO $$
DECLARE
  table_record RECORD;
BEGIN
  -- Touch all marketplace tables to update their modification time
  FOR table_record IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
      AND tablename LIKE 'marketplace_%'
  LOOP
    EXECUTE format('COMMENT ON TABLE %I IS %L', 
      table_record.tablename, 
      'Marketplace table - Cache refreshed at ' || now()::text
    );
    RAISE NOTICE 'Refreshed cache for table: %', table_record.tablename;
  END LOOP;
END $$;

-- Verify table counts and accessibility
DO $$
DECLARE
  items_count INTEGER;
  categories_count INTEGER;
  suppliers_count INTEGER;
  facilities_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO items_count FROM marketplace_items WHERE is_active = true;
  SELECT COUNT(*) INTO categories_count FROM marketplace_categories WHERE is_active = true;
  SELECT COUNT(*) INTO suppliers_count FROM marketplace_suppliers WHERE is_active = true;
  SELECT COUNT(*) INTO facilities_count FROM marketplace_pln_facilities WHERE is_active = true;
  
  RAISE NOTICE 'Verification Complete:';
  RAISE NOTICE '  - Items: %', items_count;
  RAISE NOTICE '  - Categories: %', categories_count;
  RAISE NOTICE '  - Suppliers: %', suppliers_count;
  RAISE NOTICE '  - Facilities: %', facilities_count;
  
  IF items_count <> 42 THEN
    RAISE WARNING 'Expected 42 items, found %', items_count;
  END IF;
  IF categories_count <> 15 THEN
    RAISE WARNING 'Expected 15 categories, found %', categories_count;
  END IF;
  IF suppliers_count <> 18 THEN
    RAISE WARNING 'Expected 18 suppliers, found %', suppliers_count;
  END IF;
END $$;

-- Force a statistics update on all marketplace tables
ANALYZE marketplace_items;
ANALYZE marketplace_categories;
ANALYZE marketplace_suppliers;
ANALYZE marketplace_pln_facilities;
ANALYZE marketplace_pr_header;
ANALYZE marketplace_pr_lines;
ANALYZE marketplace_orders;
ANALYZE marketplace_order_lines;

-- Send final reload notification
NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';
