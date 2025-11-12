/*
  # Fix All Duplicate OTIF Scores for Ranks 1-10

  1. Duplicates Found
    - Kategori C: Ranks 2-3 both at 95.00%
    - Kategori D: Ranks 1-3 all at 95.50%
    - Kategori E: Ranks 2-3 both at 95.00%
    - Kategori F: Ranks 3-4 both at 95.50%

  2. Solution
    - Adjust specific suppliers to create unique percentages
    - Target descending order with unique scores

  3. Target Scores
    - Create clear separation between each rank
*/

-- KATEGORI C FIXES
-- Rank 3: PT Engineering Materials Trade (95.00% → 94.83%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Engineering Materials Trade'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Engineering Materials Trade' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- KATEGORI D FIXES
-- Rank 2: PT Chemical Supply Indonesia (95.50% → 95.33%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Chemical Supply Indonesia'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Chemical Supply Indonesia' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- Rank 3: PT Industrial Chemicals Prima (95.50% → 95.00%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Industrial Chemicals Prima'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Industrial Chemicals Prima' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 2
  );

-- KATEGORI E FIXES
-- Rank 3: PT Network Equipment Supply (95.00% → 94.83%)
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

-- KATEGORI F FIXES
-- Rank 4: PT Facility Management Supply (95.50% → 95.33%)
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
