/*
  # Fix Very Last Duplicate in Category A

  1. Last Duplicate
    - Category A: Ranks 8-9 both at 94.50%
      - Rank 8: PT Generator Parts Supplier (keep at 94.50%)
      - Rank 9: PT Steel Components Indonesia (change to 94.33%)

  2. Solution
    - Adjust PT Steel Components Indonesia to 94.33%
*/

-- CATEGORY A - Rank 9: PT Steel Components Indonesia (94.50% → 94.33%)
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
