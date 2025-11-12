/*
  # Fix Procurement Savings Target Percentages
  
  1. Changes
    - Add target columns to ref_procurement_categories table
    - Populate with correct target values that match performance status
    - Update values to ensure:
      * "Below Target" categories have target % HIGHER than achievement %
      * "On Target" categories have target % close to achievement %
  
  2. Target Values
    - Category A: Below Target → Target 18% (actual 15.19%)
    - Category B: On Target → Target 14% (actual 15.58%)
    - Category C: Below Target → Target 15% (actual 12.29%)
    - Category D: On Target → Target 12.5% (actual 14.83%)
    - Category E: Below Target → Target 13% (actual 11.64%)
    - Category F: On Target → Target 18% (actual 16.0%)
*/

-- Add target columns to ref_procurement_categories if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_procurement_categories' AND column_name = 'target_savings_percentage'
  ) THEN
    ALTER TABLE ref_procurement_categories 
    ADD COLUMN target_savings_percentage NUMERIC(5,2) DEFAULT 10.0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_procurement_categories' AND column_name = 'target_sourcing_days'
  ) THEN
    ALTER TABLE ref_procurement_categories 
    ADD COLUMN target_sourcing_days INTEGER DEFAULT 60;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_procurement_categories' AND column_name = 'target_otif_percentage'
  ) THEN
    ALTER TABLE ref_procurement_categories 
    ADD COLUMN target_otif_percentage NUMERIC(5,2) DEFAULT 95.0;
  END IF;

  -- Add main_category columns if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_procurement_categories' AND column_name = 'main_category_name_id'
  ) THEN
    ALTER TABLE ref_procurement_categories 
    ADD COLUMN main_category_name_id TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_procurement_categories' AND column_name = 'main_category_description_id'
  ) THEN
    ALTER TABLE ref_procurement_categories 
    ADD COLUMN main_category_description_id TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_procurement_categories' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE ref_procurement_categories 
    ADD COLUMN display_order INTEGER DEFAULT 1;
  END IF;
END $$;

-- Update target savings percentages to match status logic
-- Below Target: target % should be HIGHER than actual %
-- On Target: target % should be close to actual %

UPDATE ref_procurement_categories 
SET 
  target_savings_percentage = 18.0,  -- Below Target: actual 15.19%
  target_sourcing_days = 60,
  target_otif_percentage = 95.0,
  main_category_name_id = main_category_name,
  main_category_description_id = description,
  display_order = 1
WHERE main_category_code = 'A';

UPDATE ref_procurement_categories 
SET 
  target_savings_percentage = 14.0,  -- On Target: actual 15.58%
  target_sourcing_days = 35,
  target_otif_percentage = 95.0,
  main_category_name_id = main_category_name,
  main_category_description_id = description,
  display_order = 2
WHERE main_category_code = 'B';

UPDATE ref_procurement_categories 
SET 
  target_savings_percentage = 15.0,  -- Below Target: actual 12.29%
  target_sourcing_days = 20,
  target_otif_percentage = 95.0,
  main_category_name_id = main_category_name,
  main_category_description_id = description,
  display_order = 3
WHERE main_category_code = 'C';

UPDATE ref_procurement_categories 
SET 
  target_savings_percentage = 12.5,  -- On Target: actual 14.83%
  target_sourcing_days = 25,
  target_otif_percentage = 95.0,
  main_category_name_id = main_category_name,
  main_category_description_id = description,
  display_order = 4
WHERE main_category_code = 'D';

UPDATE ref_procurement_categories 
SET 
  target_savings_percentage = 13.0,  -- Below Target: actual 11.64%
  target_sourcing_days = 30,
  target_otif_percentage = 95.0,
  main_category_name_id = main_category_name,
  main_category_description_id = description,
  display_order = 5
WHERE main_category_code = 'E';

UPDATE ref_procurement_categories 
SET 
  target_savings_percentage = 18.0,  -- On Target: actual 16.0%
  target_sourcing_days = 45,
  target_otif_percentage = 95.0,
  main_category_name_id = main_category_name,
  main_category_description_id = description,
  display_order = 6
WHERE main_category_code = 'F';
