/*
  # Fix Absolute Final Duplicates at 92.50%

  1. Last Duplicates
    - Kategori C: Ranks 7-8 both at 92.50%
    - Kategori D: Ranks 7-8 both at 92.50%
    - Kategori E: Ranks 7-8 both at 92.50%

  2. Solution
    - Adjust rank 8 in each category to 92.33%
*/

-- KATEGORI C - Rank 8: PT Industrial Construction Supply (92.50% → 92.33%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Industrial Construction Supply'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Industrial Construction Supply' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- KATEGORI D - Rank 8: PT Process Chemicals Supply (92.50% → 92.33%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Process Chemicals Supply'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Process Chemicals Supply' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- KATEGORI E - Rank 8: PT Digital Equipment Trade (92.50% → 92.33%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Digital Equipment Trade'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Digital Equipment Trade' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );
