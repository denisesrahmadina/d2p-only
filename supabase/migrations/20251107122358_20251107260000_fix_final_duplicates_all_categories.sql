/*
  # Fix Final Duplicates in All Categories

  1. Remaining Duplicates
    - Kategori C: Ranks 3-4 both at 94.50%
    - Kategori D: Ranks 3-4 both at 94.50%
    - Kategori E: Ranks 3-4 both at 94.50%
    - Kategori F: Ranks 4-5 both at 95.00%

  2. Solution
    - Adjust rank 4 in C, D, E and rank 5 in F to unique values
*/

-- KATEGORI C - Rank 4: PT Construction Materials Prime (94.50% → 94.33%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Construction Materials Prime'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Construction Materials Prime' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- KATEGORI D - Rank 4: PT Industrial Chemicals Prima (94.50% → 94.33%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Industrial Chemicals Prima'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Industrial Chemicals Prima' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- KATEGORI E - Rank 4: PT Network Equipment Supply (94.50% → 94.33%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Network Equipment Supply'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Network Equipment Supply' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- KATEGORI F - Rank 5: PT Facility Management Supply (95.00% → 94.83%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Facility Management Supply'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Facility Management Supply' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );
