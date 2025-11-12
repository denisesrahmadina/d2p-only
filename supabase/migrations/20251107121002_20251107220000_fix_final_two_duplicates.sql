/*
  # Fix Final Two Duplicates

  1. Last Remaining Duplicates
    - Category A: Ranks 7-8 both at 95.00%
      - Rank 7: PT Industrial Machinery Systems (keep at 95.00%)
      - Rank 8: PT Steel Components Indonesia (change to 94.83%)
    - Category C: Ranks 8-9 both at 92.50%
      - Rank 8: PT Industrial Construction Supply (keep at 92.50%)
      - Rank 9: PT Infrastructure Components (change to 92.33%)

  2. Solution
    - Adjust rank 8 in Category A and rank 9 in Category C
*/

-- CATEGORY A - Rank 8: PT Steel Components Indonesia (95.00% → 94.83%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Steel Components Indonesia'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Steel Components Indonesia' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- CATEGORY C - Rank 9: PT Infrastructure Components (92.50% → 92.33%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Infrastructure Components'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Infrastructure Components' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );
