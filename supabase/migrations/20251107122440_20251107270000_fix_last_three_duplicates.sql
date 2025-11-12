/*
  # Fix Last Three Duplicates

  1. Remaining Duplicates
    - Kategori C: Ranks 4-5 both at 94.00%
    - Kategori D: Ranks 4-5 both at 94.00%
    - Kategori E: Ranks 4-5 both at 94.00%

  2. Solution
    - Adjust rank 5 in each category to 93.83%
*/

-- KATEGORI C - Rank 5: PT Construction Equipment Parts (94.00% → 93.83%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Construction Equipment Parts'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Construction Equipment Parts' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- KATEGORI D - Rank 5: PT Industrial Chemicals Prima (94.00% → 93.83%)
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

-- KATEGORI E - Rank 5: PT Network Equipment Supply (94.00% → 93.83%)
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
