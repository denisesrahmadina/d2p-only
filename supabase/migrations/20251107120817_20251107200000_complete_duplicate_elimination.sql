/*
  # Complete Duplicate Elimination - Final Pass

  1. Remaining Duplicates
    - Overall: Ranks 9-10 both at 96.00%
    - Category A: Ranks 5-6 both at 96.00%
    - Category B: Ranks 7-8 both at 93.50%
    - Category C: Ranks 6-7 both at 93.50%
    - Category D: Ranks 7-8 both at 93.00%
    - Category E: Ranks 7-8 both at 93.00%

  2. Solution
    - Adjust the second supplier in each duplicate pair to a lower score
*/

-- OVERALL - Rank 10: PT Facility Management Supply (96.00% → 95.83%)
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

-- CATEGORY A - Rank 6: PT Precision Parts Manufacturing (96.00% → 95.83%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Precision Parts Manufacturing'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Precision Parts Manufacturing' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- CATEGORY B - Rank 8: PT Fuel Trading International (93.50% → 93.33%)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Fuel Trading International'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Fuel Trading International' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- CATEGORY C - Rank 7: PT Industrial Construction Supply (93.50% → 93.33%)
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

-- CATEGORY D - Rank 8: PT Process Chemicals Supply (93.00% → 92.83%)
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

-- CATEGORY E - Rank 8: PT Digital Equipment Trade (93.00% → 92.83%)
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
