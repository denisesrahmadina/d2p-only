/*
  # Add main_category_code to procurement_sourcing_contracts

  1. Changes
    - Add main_category_code and sub_category columns
    - Update existing data to populate these columns from category field
    - Create index for better query performance

  2. Notes
    - Existing category field contains main category codes (A, B, C, D, E, F)
    - This aligns with the view's expectation of main_category_code
*/

-- Add columns if they don't exist
ALTER TABLE procurement_sourcing_contracts 
ADD COLUMN IF NOT EXISTS main_category_code text,
ADD COLUMN IF NOT EXISTS sub_category text;

-- Update existing data to populate main_category_code from category
UPDATE procurement_sourcing_contracts
SET main_category_code = main_category
WHERE main_category_code IS NULL AND main_category IS NOT NULL;

-- For records that only have category, use that
UPDATE procurement_sourcing_contracts
SET main_category_code = category
WHERE main_category_code IS NULL AND category IS NOT NULL;

-- Update sub_category from existing sub_category field if it exists
UPDATE procurement_sourcing_contracts
SET sub_category = COALESCE(sub_category, main_category_code || '-01')
WHERE sub_category IS NULL AND main_category_code IS NOT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_sourcing_contracts_main_category 
  ON procurement_sourcing_contracts(main_category_code);

CREATE INDEX IF NOT EXISTS idx_sourcing_contracts_status 
  ON procurement_sourcing_contracts(status);
