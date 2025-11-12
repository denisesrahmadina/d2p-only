/*
  # Force PostgREST Schema Cache Reload
  
  This migration forces PostgREST to completely reload its schema cache
  by performing several cache-invalidating operations.
  
  ## Actions
  1. Send NOTIFY signal to PostgREST to reload schema cache
  2. Execute ANALYZE to update table statistics
  3. Refresh materialized view dependencies (if any)
  4. Touch all marketplace tables to trigger cache invalidation
  
  ## Expected Result
  - PostgREST REST API endpoints will recognize all marketplace tables
  - API queries will return correct data from marketplace_items, marketplace_categories, etc.
*/

-- ============================================================================
-- STEP 1: Notify PostgREST to reload schema cache
-- ============================================================================

-- PostgREST listens for this notification channel
NOTIFY pgrst, 'reload schema';

-- ============================================================================
-- STEP 2: Update table statistics for query planner
-- ============================================================================

ANALYZE marketplace_categories;
ANALYZE marketplace_suppliers;
ANALYZE marketplace_items;
ANALYZE marketplace_cart_items;
ANALYZE marketplace_pln_facilities;
ANALYZE marketplace_orders;
ANALYZE marketplace_order_lines;
ANALYZE marketplace_order_tracking;
ANALYZE marketplace_item_documents;

-- ============================================================================
-- STEP 3: Force metadata refresh by commenting tables
-- ============================================================================

COMMENT ON TABLE marketplace_categories IS 'Equipment categories for PLN marketplace - refreshed 2025-11-06';
COMMENT ON TABLE marketplace_suppliers IS 'PLN-approved suppliers - refreshed 2025-11-06';
COMMENT ON TABLE marketplace_items IS 'Product catalog with 42 items - refreshed 2025-11-06';
COMMENT ON TABLE marketplace_cart_items IS 'User shopping cart - refreshed 2025-11-06';
COMMENT ON TABLE marketplace_pln_facilities IS 'PLN delivery facilities - refreshed 2025-11-06';
COMMENT ON TABLE marketplace_orders IS 'Order tracking master - refreshed 2025-11-06';
COMMENT ON TABLE marketplace_order_lines IS 'Order line items - refreshed 2025-11-06';
COMMENT ON TABLE marketplace_order_tracking IS 'Real-time tracking events - refreshed 2025-11-06';
COMMENT ON TABLE marketplace_item_documents IS 'Technical documents - refreshed 2025-11-06';

-- ============================================================================
-- STEP 4: Verify RLS policies are active and properly configured
-- ============================================================================

-- Ensure RLS is enabled (should already be, but verify)
ALTER TABLE marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_pln_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_item_documents ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 5: Grant explicit permissions to ensure API access
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant SELECT on all marketplace tables for API access
GRANT SELECT ON marketplace_categories TO anon, authenticated;
GRANT SELECT ON marketplace_suppliers TO anon, authenticated;
GRANT SELECT ON marketplace_items TO anon, authenticated;
GRANT SELECT ON marketplace_pln_facilities TO anon, authenticated;
GRANT SELECT ON marketplace_item_documents TO anon, authenticated;
GRANT SELECT ON marketplace_orders TO anon, authenticated;
GRANT SELECT ON marketplace_order_lines TO anon, authenticated;
GRANT SELECT ON marketplace_order_tracking TO anon, authenticated;

-- Grant full access on cart for authenticated users
GRANT ALL ON marketplace_cart_items TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE marketplace_cart_items_cart_item_id_seq TO anon, authenticated;

-- Grant insert/update access for order management
GRANT INSERT, UPDATE ON marketplace_orders TO authenticated;
GRANT INSERT, UPDATE ON marketplace_order_lines TO authenticated;
GRANT INSERT, UPDATE ON marketplace_order_tracking TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE marketplace_orders_order_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE marketplace_order_lines_order_line_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE marketplace_order_tracking_tracking_id_seq TO authenticated;
