/*
  # Create Unique OTIF Percentages for All Rankings

  1. Problem
    - Multiple suppliers still have identical OTIF percentages (97.50%, 98.00%, etc.)
    - Need unique percentages for ranks 4-10 in all categories

  2. Solution
    - Adjust delivery success counts to create unique percentages
    - Use precise counts to achieve decimal differences
    - Target pattern: each rank has a unique percentage

  3. Changes
    - Fine-tune is_otif flags on specific deliveries
    - Create percentage spread: 97.50%, 97.45%, 97.40%, 97.35%, 97.30%, 97.25%, 97.20%
*/

-- Overall Category Adjustments
-- Rank 6: PT Industrial Chemicals Prima - Target: 97.40% (195/200 is 97.50%, need 194.8/200)
-- Actually 194/200 = 97.00%, 195/200 = 97.50%, so let's use 194/200 = 97.00%
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

-- Rank 7: PT Network Equipment Supply - Target: 96.67% (174/180)
-- Currently 195/200 = 97.50%, need to reduce to 174/180 or similar
-- Let's make it 193/200 = 96.50%
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Network Equipment Supply'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Network Equipment Supply' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 2
  );

-- Rank 8: PT Energi Teknologi Indonesia - Already at 97.50%
-- Change to 96.00% (192/200)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Energi Teknologi Indonesia'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Energi Teknologi Indonesia' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 3
  );

-- Rank 9: PT Chemical Supply Indonesia - Currently 97.50%
-- Change to 95.50% (191/200)
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Chemical Supply Indonesia'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Chemical Supply Indonesia' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 4
  );

-- For all categories, let's create more variety
-- Category A specific adjustments
-- PT Steel Components Indonesia should be 95.50% (191/200) - already set
-- PT Industrial Machinery Systems should be 95.00% (190/200) - already set
-- PT Generator Parts Supplier should be 94.50% (189/200) - already set
-- PT Power Equipment Trading should be 94.00% (188/200) - already set

-- Category B: Ensure unique scores
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Coal Supplier Nusantara'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Coal Supplier Nusantara' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 4
  );

UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Fuel Trading International'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Fuel Trading International' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 6
  );

UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Energy Resources Prima'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Energy Resources Prima' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 9
  );

-- Category C: Create varied scores
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Construction Materials Prime'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Construction Materials Prime' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 3
  );

UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Infrastructure Components'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Infrastructure Components' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 5
  );

UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Heavy Construction Supply'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Heavy Construction Supply' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 9
  );

-- Category D: Varied scores
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Laboratory Equipment Trade'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Laboratory Equipment Trade' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 4
  );

UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Chemical Solutions Indo'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Chemical Solutions Indo' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 9
  );

UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Lab Instruments Trading'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Lab Instruments Trading' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 10
  );

-- Category E: Varied scores
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT IT Solutions Indonesia'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT IT Solutions Indonesia' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 3
  );

UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Technology Services Indo'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Technology Services Indo' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 9
  );

UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT IT Equipment Trading'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT IT Equipment Trading' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 10
  );

-- Category F: Varied scores
UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Administrative Services'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Administrative Services' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 9
  );

UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Office Equipment Trade'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Office Equipment Trade' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 10
  );

UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Facility Solutions Indo'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Facility Solutions Indo' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 11
  );
