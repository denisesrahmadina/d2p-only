/*
  # Eliminate Last Remaining Duplicates

  1. Remaining Duplicates
    - Overall: Ranks 9-10 both at 96.00%
    - Category A: Ranks 6-7 both at 95.50%
    - Category B: Ranks 8-9 both at 93.00%
    - Category C: Ranks 7-8 both at 93.00%

  2. Solution
    - Adjust the lower rank in each pair to a slightly lower percentage
*/

-- OVERALL - Rank 10: PT Energi Teknologi Indonesia (96.00% → 95.83%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Energi Teknologi Indonesia'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Energi Teknologi Indonesia' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- CATEGORY A - Rank 7: PT Steel Components Indonesia (95.50% → 95.33%)
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

-- CATEGORY B - Rank 9: PT Coal Mining Services (93.00% → 92.83%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Coal Mining Services'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Coal Mining Services' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- CATEGORY C - Rank 8: PT Industrial Construction Supply (93.00% → 92.83%)
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
