/*
  # Fix Very Last Duplicate in Kategori C

  1. Last Duplicate
    - Kategori C: Ranks 8-9 both at 92.00%
      - Rank 8: PT Industrial Construction Supply
      - Rank 9: PT Infrastructure Components

  2. Solution
    - Adjust PT Infrastructure Components to 91.83%
*/

-- KATEGORI C - Rank 9: PT Infrastructure Components (92.00% → 91.83%)
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
