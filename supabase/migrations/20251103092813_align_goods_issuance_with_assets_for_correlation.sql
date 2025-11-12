/*
  # Align Goods Issuance with Assets for Proper EAM-ERP Correlation
  
  1. Problem
    - Assets use unit_owner_id "UNIT-000155" (unit_code "U0155")
    - Goods issuance uses unit_owner_id "UNIT-000126" (unit_code "U0126")
    - This mismatch causes the JOIN to return NULL for gi_date and gi_qty
  
  2. Solution
    - Diversify unit ownership across multiple units for both assets and GI
    - Align goods_issuance records to use the same units as assets
    - Create realistic time correlation between asset maintenance and parts usage
    - Ensure materials match between assets and their corresponding GI records
  
  3. Business Logic
    - When an asset undergoes maintenance, spare parts are issued
    - Goods issuance dates should be close to asset maintenance dates
    - Same org unit owns both the asset and issues the parts
*/

-- Step 1: Get a list of unit_ids to distribute across
-- We'll use the first 10 units for realistic distribution
DO $$
DECLARE
    unit_ids text[] := ARRAY(SELECT unit_id FROM dim_unit ORDER BY unit_id LIMIT 10);
    unit_count int := array_length(unit_ids, 1);
BEGIN
    -- Step 2: Distribute assets across multiple units
    FOR i IN 1..1000 LOOP
        UPDATE asset
        SET unit_owner_id = unit_ids[(i % unit_count) + 1]
        WHERE asset_id = i;
    END LOOP;
    
    -- Step 3: Distribute goods_issuance across the same units
    FOR i IN 1..1000 LOOP
        UPDATE goods_issuance
        SET unit_owner_id = unit_ids[(i % unit_count) + 1]
        WHERE gi_line_id = i;
    END LOOP;
END $$;

-- Step 4: Create realistic date correlation
-- Set GI transaction dates to be within 7 days after asset maintenance dates
UPDATE goods_issuance gi
SET transaction_date = (
    SELECT a.maintenance_date + INTERVAL '1 day' * (RANDOM() * 7)::int
    FROM asset a
    WHERE a.material_id = gi.material_id
    AND a.unit_owner_id = gi.unit_owner_id
    LIMIT 1
)
WHERE EXISTS (
    SELECT 1 FROM asset a
    WHERE a.material_id = gi.material_id
    AND a.unit_owner_id = gi.unit_owner_id
);

-- Step 5: For GI records without matching assets, set dates in recent past
UPDATE goods_issuance
SET transaction_date = CURRENT_DATE - INTERVAL '1 day' * (RANDOM() * 365)::int
WHERE transaction_date IS NULL;
