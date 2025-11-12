/*
  # Fix Ranks 5-6 Duplicates in Categories C, D, E

  1. Duplicates
    - Kategori C: Ranks 5-6 both at 93.50%
    - Kategori D: Ranks 5-6 both at 93.50%
    - Kategori E: Ranks 5-6 both at 93.50%

  2. Solution
    - Adjust rank 6 in each category to 93.33%
*/

-- KATEGORI C - Rank 6: PT Construction Equipment Parts (93.50% → 93.33%)
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

-- KATEGORI D - Rank 6: PT Industrial Chemicals Prima (93.50% → 93.33%)
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

-- KATEGORI E - Rank 6: PT Network Equipment Supply (93.50% → 93.33%)
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
