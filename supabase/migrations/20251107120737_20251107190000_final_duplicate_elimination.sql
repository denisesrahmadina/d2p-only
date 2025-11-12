/*
  # Final Duplicate Elimination

  1. Remaining Duplicates
    - Overall: Ranks 7-8 both at 96.50%
    - Category B: Ranks 6-7 both at 94.00%
    - Category C: Ranks 5-6 both at 94.00%
    - Category D: Ranks 6-7 both at 93.50%
    - Category E: Ranks 6-7 both at 93.50%

  2. Solution
    - Adjust one supplier in each duplicate pair

  3. Target
    - All ranks 4-10 have unique OTIF percentages
*/

-- OVERALL - Rank 8: PT Turbine Systems International (currently 96.50%)
-- Change to 96.33%
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Turbine Systems International'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Turbine Systems International' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- CATEGORY B - Rank 7: PT Fuel Logistics Indonesia (currently 94.00%)
-- Change to 93.83%
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Fuel Logistics Indonesia'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Fuel Logistics Indonesia' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- CATEGORY C - Rank 6: PT Industrial Construction Supply (currently 94.00%)
-- Change to 93.83%
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

-- CATEGORY D - Rank 7: PT Process Chemicals Supply (currently 93.50%)
-- Change to 93.33%
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

-- CATEGORY E - Rank 7: PT Software Systems Prima (currently 93.50%)
-- Change to 93.33%
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
