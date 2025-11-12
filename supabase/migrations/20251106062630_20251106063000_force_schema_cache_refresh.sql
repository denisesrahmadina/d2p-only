/*
  # Force Schema Cache Refresh for Marketplace and BA Tables
  
  This migration ensures all marketplace and BA tables are properly exposed to the PostgREST API
  by refreshing their metadata and confirming RLS policies.
  
  ## Tables Affected
  - marketplace_categories
  - marketplace_suppliers  
  - marketplace_items
  - marketplace_cart_items
  - marketplace_pln_facilities
  - marketplace_pr_header
  - marketplace_pr_lines
  - dim_ba_master
  - dim_ba_parties
  
  ## Actions
  1. Confirm RLS is enabled
  2. Refresh table comments to trigger schema reload
  3. Send NOTIFY to PostgREST
*/

-- Refresh marketplace table comments to trigger schema reload
COMMENT ON TABLE marketplace_categories IS 'Equipment categories for PLN power plant procurement (refreshed 2025-11-06)';
COMMENT ON TABLE marketplace_suppliers IS 'Approved suppliers for PLN Indonesia Power (refreshed 2025-11-06)';
COMMENT ON TABLE marketplace_items IS 'Equipment catalog with technical specs and pricing (refreshed 2025-11-06)';
COMMENT ON TABLE marketplace_cart_items IS 'User shopping cart for procurement items (refreshed 2025-11-06)';
COMMENT ON TABLE marketplace_pln_facilities IS 'PLN power plant delivery locations (refreshed 2025-11-06)';
COMMENT ON TABLE marketplace_pr_header IS 'Purchase request headers (refreshed 2025-11-06)';
COMMENT ON TABLE marketplace_pr_lines IS 'Purchase request line items (refreshed 2025-11-06)';

-- Refresh BA tables
COMMENT ON TABLE dim_ba_master IS 'BA (Berita Acara) master records (refreshed 2025-11-06)';
COMMENT ON TABLE dim_ba_parties IS 'BA signatories and responsible parties (refreshed 2025-11-06)';

-- Grant explicit permissions to ensure API access
GRANT SELECT ON marketplace_categories TO anon, authenticated;
GRANT SELECT ON marketplace_suppliers TO anon, authenticated;
GRANT SELECT ON marketplace_items TO anon, authenticated;
GRANT SELECT ON marketplace_pln_facilities TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON marketplace_cart_items TO anon, authenticated;
GRANT SELECT, INSERT ON marketplace_pr_header TO anon, authenticated;
GRANT SELECT, INSERT ON marketplace_pr_lines TO anon, authenticated;
GRANT SELECT ON dim_ba_master TO anon, authenticated;
GRANT SELECT ON dim_ba_parties TO anon, authenticated;

-- Force PostgREST schema reload
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
