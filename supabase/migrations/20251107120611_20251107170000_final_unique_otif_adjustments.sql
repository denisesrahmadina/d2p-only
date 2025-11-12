/*
  # Final Unique OTIF Score Adjustments

  1. Problem
    - Still have duplicate OTIF percentages in several categories
    - Overall: ranks 5-9 all show 97.00%
    - Multiple categories have 2-3 suppliers with identical scores

  2. Solution
    - Make targeted adjustments to create unique scores for each rank
    - Adjust 1-2 deliveries per supplier to create small differences

  3. Target
    - Every supplier in ranks 4-10 must have a unique OTIF percentage
*/

-- OVERALL CATEGORY FIXES
-- Rank 5: PT Mineral Resources Indonesia - Keep at 97.00%
-- Rank 6: PT Turbine Systems International - Change to 96.89% (193/199 or adjust)
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

-- Rank 7: PT Industrial Chemicals Prima - Change to 96.78% (193/199.5 ~ adjust to 193/200 = 96.50%)
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

-- Rank 8: PT Construction Materials Prime - Change to 96.33% (193/200 = 96.50%, need less)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Construction Materials Prime'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Construction Materials Prime' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 5
  );

-- Rank 9: PT IT Solutions Indonesia - Change to 96.11%
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT IT Solutions Indonesia'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT IT Solutions Indonesia' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 4
  );

-- CATEGORY B FIXES
-- Rank 4: PT Batubara Mandiri - Keep at 95.00%
-- Rank 5: PT Coal Supplier Nusantara - Change to 94.89%
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Coal Supplier Nusantara'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Coal Supplier Nusantara' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- Rank 7: PT Energy Supply Chain - Keep at 94.00%
-- Rank 8: PT Fuel Trading International - Change to 93.89%
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

-- CATEGORY C FIXES
-- Rank 7: PT Civil Works Materials - Keep at 93.50%
-- Rank 8: PT Infrastructure Components - Change to 93.33%
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

-- CATEGORY D FIXES
-- Rank 4: PT Laboratory Equipment Trade - Keep at 94.50%
-- Rank 5: PT Process Chemicals Supply - Change to 94.33%
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

-- CATEGORY E FIXES
-- Rank 4: PT Computer Systems Supply - Keep at 94.50%
-- Rank 5: PT Software Systems Prima - Change to 94.33%
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

-- CATEGORY F FIXES
-- Rank 4: PT Office Supplies Indonesia - Keep at 95.50%
-- Rank 5: PT General Trading Prima - Change to 95.33%
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT General Trading Prima'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT General Trading Prima' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );
