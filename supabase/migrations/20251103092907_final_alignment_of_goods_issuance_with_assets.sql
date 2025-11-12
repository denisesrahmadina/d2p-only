/*
  # Final Alignment of Goods Issuance with Assets
  
  1. Issue Identified
    - Assets are using UNIT-000001 through UNIT-000010
    - Goods issuance is still using UNIT-000126
    - This causes the JOIN to fail and return NULL values
  
  2. Solution
    - Update goods_issuance to use the same 10 units as assets
    - Create realistic correlations where GI records match assets by material AND unit
    - Set transaction dates close to asset maintenance dates
  
  3. Business Scenario
    - Asset "AST-00000100" with material "MAT-00000036" owned by "UNIT-000001"
    - When this asset gets maintenance on 2025-08-16
    - Spare parts (same material) are issued from inventory
    - GI record shows parts issued to "UNIT-000001" on a date near 2025-08-16
*/

-- Step 1: Distribute goods_issuance across the same 10 units as assets
-- Pattern: gi_line_id modulo 10 maps to UNIT-000001 through UNIT-000010
UPDATE goods_issuance
SET unit_owner_id = 'UNIT-' || LPAD(((gi_line_id % 10) + 1)::text, 6, '0');

-- Step 2: Align transaction dates with asset maintenance dates
-- For each GI record, find a matching asset with same material_id and unit_owner_id
-- Set GI transaction_date to be 0-7 days after the asset's maintenance_date
UPDATE goods_issuance gi
SET transaction_date = (
    SELECT a.maintenance_date + INTERVAL '1 day' * (RANDOM() * 7)::int
    FROM asset a
    WHERE a.material_id = gi.material_id
    AND a.unit_owner_id = gi.unit_owner_id
    ORDER BY RANDOM()
    LIMIT 1
)
WHERE EXISTS (
    SELECT 1 FROM asset a
    WHERE a.material_id = gi.material_id
    AND a.unit_owner_id = gi.unit_owner_id
);

-- Step 3: For any GI records that don't have matching assets, 
-- set dates to recent past (last year)
UPDATE goods_issuance
SET transaction_date = CURRENT_DATE - INTERVAL '1 day' * (RANDOM() * 365)::int
WHERE transaction_date IS NULL;

-- Step 4: Update cost centers to match the new unit assignments
UPDATE goods_issuance gi
SET cost_center = CONCAT('CC-', u.unit_code)
FROM dim_unit u
WHERE gi.unit_owner_id = u.unit_id;

-- Verification query - this should now show matching records
SELECT 
    COUNT(*) as total_matches,
    COUNT(DISTINCT a.material_id) as unique_materials,
    COUNT(DISTINCT a.unit_owner_id) as unique_units
FROM asset a
INNER JOIN goods_issuance g 
    ON a.material_id = g.material_id 
    AND a.unit_owner_id = g.unit_owner_id;
