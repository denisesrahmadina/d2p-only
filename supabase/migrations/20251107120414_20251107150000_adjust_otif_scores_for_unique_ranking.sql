/*
  # Adjust OTIF Scores for Unique Ranking (Ranks 4-10)

  1. Problem
    - After adding new suppliers, ranks 4-10 still show duplicate percentages
    - Need to fine-tune delivery counts to achieve unique OTIF percentages

  2. Solution
    - Adjust the is_otif flag on specific deliveries to create unique percentages
    - Target unique scores: 97.50%, 97.22%, 97.00%, 96.67%, 96.50%, 96.11%, 96.00%
    - Work with existing delivery counts to modify success rates

  3. Changes
    - Update specific delivery records to adjust OTIF percentages
    - Ensure each supplier in top 10 has a unique percentage
*/

-- First, let's see current state and adjust strategically
-- We'll modify some deliveries to create the desired unique percentages

-- For Overall ranking, we need to adjust the suppliers to have unique scores
-- Let's modify some of the newly added suppliers

-- Adjust PT Chemical Supply Indonesia to 97.50% (195 out of 200)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, delivery_status = 'late'
WHERE supplier_name = 'PT Chemical Supply Indonesia'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Chemical Supply Indonesia' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 2
  );

-- Adjust PT Office Supplies Indonesia to 97.22% (175 out of 180)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, delivery_status = 'late'
WHERE supplier_name = 'PT Office Supplies Indonesia'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Office Supplies Indonesia' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 5
  );

-- Adjust PT Coal Supplier Nusantara to 97.00% (194 out of 200)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, delivery_status = 'late'
WHERE supplier_name = 'PT Coal Supplier Nusantara'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Coal Supplier Nusantara' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 2
  );

-- Adjust PT Civil Engineering Supply to 96.67% (174 out of 180)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, delivery_status = 'late'
WHERE supplier_name = 'PT Civil Engineering Supply'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Civil Engineering Supply' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 6
  );

-- Adjust PT Laboratory Equipment Trade to 96.50% (193 out of 200)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, delivery_status = 'late'
WHERE supplier_name = 'PT Laboratory Equipment Trade'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Laboratory Equipment Trade' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 3
  );

-- Adjust PT Software Systems Prima to 96.11% (173 out of 180)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, delivery_status = 'late'
WHERE supplier_name = 'PT Software Systems Prima'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Software Systems Prima' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 7
  );

-- Adjust PT Infrastructure Components to 96.00% (192 out of 200)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, delivery_status = 'late'
WHERE supplier_name = 'PT Infrastructure Components'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Infrastructure Components' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 3
  );

-- Now adjust category-specific rankings
-- Category A: Ensure ranks 4-10 have unique scores
-- Already has: 97.78%, 97.00%, 96.67%
-- Need to adjust new ones to: 95.50%, 95.00%, 94.50%, 94.00%
-- These were already set correctly in the previous migration

-- Category B: Adjust for unique scores
-- Adjust PT Mineral Resources Indonesia to 97.33% (175/180 = 97.22%, change to 97.50% with 195/200)
-- Need to add more deliveries first, but let's adjust existing
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, delivery_status = 'late'
WHERE supplier_name = 'PT Mineral Resources Indonesia'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Mineral Resources Indonesia' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );

-- Category C: Adjust for spread
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, delivery_status = 'late'
WHERE supplier_name = 'PT Building Materials Indonesia'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Building Materials Indonesia' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 3
  );

-- Category D: Similar adjustments
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, delivery_status = 'late'
WHERE supplier_name = 'PT Water Treatment Supply'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Water Treatment Supply' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 3
  );

-- Category E: Adjustments
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, delivery_status = 'late'
WHERE supplier_name = 'PT Digital Infrastructure'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Digital Infrastructure' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 3
  );

-- Category F: Adjustments
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, delivery_status = 'late'
WHERE supplier_name = 'PT Facility Management Supply'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Facility Management Supply' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 2
  );

UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, delivery_status = 'late'
WHERE supplier_name = 'PT General Trading Prima'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT General Trading Prima' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 3
  );

-- Also update is_in_full to match is_otif for consistency
UPDATE supplier_otif_deliveries
SET is_in_full = is_otif
WHERE delivery_status = 'late';
