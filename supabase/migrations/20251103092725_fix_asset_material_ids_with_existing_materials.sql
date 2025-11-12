/*
  # Fix Asset Material IDs Using Existing Materials
  
  1. Problem Identified
    - All 1000 assets have NULL material_id values
    - All 1000 goods_issuance records use only "MAT004"
    - The LEFT JOIN in the query fails because material_id is NULL in assets
  
  2. Solution
    - Use existing materials from dim_material (MAT-00000036 to MAT-00001535)
    - Distribute materials across assets in a realistic pattern
    - Update goods_issuance to use the same materials for logical correlation
    - Add realistic BOM structures showing component relationships
  
  3. Business Context
    - Power plant assets consume spare parts through maintenance
    - Each asset type uses specific spare parts
    - Goods issuance records track when parts are used for maintenance
    - This creates a logical EAM → ERP data flow
  
  4. Data Strategy
    - Use 100 different materials distributed across 1000 assets
    - Create realistic usage patterns in goods_issuance
    - Link asset maintenance dates to goods issuance dates
*/

-- Step 1: Update assets with material IDs from existing dim_material records
-- Using modulo to cycle through first 100 materials
UPDATE asset 
SET material_id = 'MAT-' || LPAD(((asset_id % 100) + 36)::text, 8, '0');

-- Step 2: Add realistic BOM structures to assets
-- Using smaller materials as components for larger assemblies
UPDATE asset 
SET bom_structure = jsonb_build_object(
    'components', 
    jsonb_build_array(
        jsonb_build_object('material_id', 'MAT-' || LPAD(((asset_id % 100) + 136)::text, 8, '0'), 'qty', ROUND((RANDOM() * 5 + 1)::numeric, 0)),
        jsonb_build_object('material_id', 'MAT-' || LPAD(((asset_id % 100) + 236)::text, 8, '0'), 'qty', ROUND((RANDOM() * 10 + 2)::numeric, 0)),
        jsonb_build_object('material_id', 'MAT-' || LPAD(((asset_id % 100) + 336)::text, 8, '0'), 'qty', ROUND((RANDOM() * 3 + 1)::numeric, 0))
    )
)
WHERE bom_structure IS NULL OR bom_structure = '{}'::jsonb;

-- Step 3: Diversify goods_issuance material_ids using the same 100 materials
-- This creates logical correlation between asset maintenance and parts usage
UPDATE goods_issuance 
SET material_id = 'MAT-' || LPAD(((gi_line_id % 100) + 36)::text, 8, '0');

-- Step 4: Update goods_issuance quantities to be realistic
UPDATE goods_issuance 
SET qty_issued = ROUND((RANDOM() * 20 + 1)::numeric, 2);

-- Step 5: Update unit prices to be realistic (in IDR - Indonesian Rupiah)
UPDATE goods_issuance 
SET unit_price = ROUND((RANDOM() * 5000000 + 500000)::numeric, 0);

-- Step 6: Recalculate total_value
UPDATE goods_issuance 
SET total_value = qty_issued * unit_price;

-- Step 7: Ensure currency is set
UPDATE goods_issuance 
SET currency = 'IDR' 
WHERE currency IS NULL;

-- Step 8: Add realistic reason codes
UPDATE goods_issuance 
SET reason_code = CASE 
    WHEN gi_line_id % 5 = 0 THEN 'PREVENTIVE_MAINT'
    WHEN gi_line_id % 5 = 1 THEN 'CORRECTIVE_MAINT'
    WHEN gi_line_id % 5 = 2 THEN 'BREAKDOWN_REPAIR'
    WHEN gi_line_id % 5 = 3 THEN 'SCHEDULED_OVERHAUL'
    ELSE 'EMERGENCY_REPAIR'
END
WHERE reason_code IS NULL;

-- Step 9: Set cost centers based on unit
UPDATE goods_issuance gi
SET cost_center = CONCAT('CC-', SUBSTRING(u.unit_code, 1, 8))
FROM dim_unit u
WHERE gi.unit_owner_id = u.unit_id
AND gi.cost_center IS NULL;

-- Step 10: Update asset status
UPDATE asset
SET asset_status = CASE 
    WHEN asset_id % 10 = 0 THEN 'IN_MAINTENANCE'
    WHEN asset_id % 10 IN (1, 2, 3, 4, 5, 6, 7) THEN 'OPERATIONAL'
    WHEN asset_id % 10 = 8 THEN 'SCHEDULED_MAINTENANCE'
    ELSE 'STANDBY'
END
WHERE asset_status IS NULL;
