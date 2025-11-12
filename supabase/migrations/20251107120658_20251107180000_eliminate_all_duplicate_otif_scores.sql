/*
  # Eliminate All Duplicate OTIF Scores

  1. Remaining Duplicates
    - Overall: Ranks 7-10 all have 96.50% (4 suppliers)
    - Category B: Ranks 5-6 have 94.50%, Ranks 8-9 have 93.50%
    - Category C: Ranks 4-5 have 94.50%, Ranks 8-9 have 93.00%
    - Category D: Ranks 5-6 have 94.00%
    - Category E: Ranks 5-6 have 94.00%

  2. Solution
    - Make targeted adjustments to create unique percentages
    - Adjust 1-3 deliveries per supplier as needed

  3. Target
    - Every rank 4-10 has a unique OTIF percentage within its category
*/

-- OVERALL CATEGORY - Fix ranks 7-10 (all at 96.50%)
-- Rank 7: PT Beton Perkasa Indonesia - Keep at 96.50%
-- Rank 8: PT Facility Management Supply - Change to 96.33%
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

-- Rank 9: PT Industrial Chemicals Prima - Change to 96.11%
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

-- Rank 10: PT Network Equipment Supply - Change to 96.00%
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Network Equipment Supply'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Network Equipment Supply' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 3
  );

-- CATEGORY B - Fix duplicates
-- Ranks 5-6: Both at 94.50%
-- Rank 6: PT Fuel Logistics Indonesia - Change to 94.33%
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

-- Ranks 8-9: Both at 93.50%
-- Rank 9: PT Coal Mining Services - Change to 93.33%
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

-- CATEGORY C - Fix duplicates
-- Ranks 4-5: Both at 94.50%
-- Rank 5: PT Construction Equipment Parts - Change to 94.33%
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

-- Ranks 8-9: Both at 93.00%
-- Rank 9: PT Infrastructure Components - Change to 92.83%
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

-- CATEGORY D - Fix ranks 5-6 (both at 94.00%)
-- Rank 6: PT Process Chemicals Supply - Change to 93.83%
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

-- CATEGORY E - Fix ranks 5-6 (both at 94.00%)
-- Rank 6: PT Software Systems Prima - Change to 93.83%
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
