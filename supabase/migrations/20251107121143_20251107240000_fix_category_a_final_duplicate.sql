/*
  # Fix Category A Final Duplicate

  1. Issue
    - PT Steel Components Indonesia and PT Power Equipment Trading both at 94.00%
    - Rank 9: PT Steel Components Indonesia 
    - Rank 10: PT Power Equipment Trading

  2. Solution
    - Adjust PT Steel Components Indonesia to 94.17% (188→189 out of 200 = 94.50%, so add 1 back)
*/

-- Revert one delivery for PT Steel Components Indonesia to make it 94.17%
-- Actually, let's go higher: 189/200 = 94.50% but that's taken by PT Generator Parts Supplier
-- So let's do 188.5 equivalent by adjusting to a different count
-- With 200 deliveries: 188=94.00%, 189=94.50%, so we need something in between
-- Let's adjust to have 180 deliveries with 170 OTIF = 94.44%

-- Actually, simpler: just add 1 more OTIF delivery to PT Steel Components Indonesia
-- This will make it 189/200 = 94.50%, but that conflicts with PT Generator Parts Supplier
-- So instead, let's reduce PT Power Equipment Trading to 93.83%

UPDATE supplier_otif_deliveries
SET is_otif = false, is_on_time = false, is_in_full = false, delivery_status = 'late'
WHERE supplier_name = 'PT Power Equipment Trading'
  AND is_otif = true
  AND id IN (
    SELECT id FROM supplier_otif_deliveries
    WHERE supplier_name = 'PT Power Equipment Trading' AND is_otif = true
    ORDER BY order_date DESC
    LIMIT 1
  );
