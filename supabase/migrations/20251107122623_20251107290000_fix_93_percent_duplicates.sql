/*
  # Fix 93.00% Duplicates in Categories C, D, E

  1. Duplicates at 93.00%
    - Kategori C: PT Structural Components Indo and PT Construction Equipment Parts
    - Kategori D: PT Laboratory Services Supply and PT Industrial Chemicals Prima
    - Kategori E: PT Network Equipment Supply and PT Software Systems Prima

  2. Solution
    - Adjust the second supplier in each pair to 92.83%
*/

-- KATEGORI C - PT Construction Equipment Parts (93.00% → 92.83%)
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

-- KATEGORI D - PT Industrial Chemicals Prima (93.00% → 92.83%)
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

-- KATEGORI E - PT Software Systems Prima (93.00% → 92.83%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Software Systems Prima'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Software Systems Prima' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );
