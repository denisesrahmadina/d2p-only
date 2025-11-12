/*
  # Fix Category Data Mapping for Contract Tables

  This migration adds the missing category columns and populates them with proper mappings.
*/

-- Step 1: Add category columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_savings_contract'
    AND column_name = 'main_category_code'
  ) THEN
    ALTER TABLE fact_procurement_savings_contract
    ADD COLUMN main_category_code text,
    ADD COLUMN subcategory_code text,
    ADD COLUMN category_id uuid REFERENCES ref_procurement_categories(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'procurement_sourcing_contracts'
    AND column_name = 'main_category_code'
  ) THEN
    ALTER TABLE procurement_sourcing_contracts
    ADD COLUMN main_category_code text,
    ADD COLUMN subcategory_code text,
    ADD COLUMN category_id uuid REFERENCES ref_procurement_categories(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'supplier_otif_deliveries'
    AND column_name = 'main_category_code'
  ) THEN
    ALTER TABLE supplier_otif_deliveries
    ADD COLUMN main_category_code text,
    ADD COLUMN category_id uuid REFERENCES ref_procurement_categories(id);
  END IF;
END $$;

-- Step 2: Update fact_procurement_savings_contract with category codes
UPDATE fact_procurement_savings_contract
SET main_category_code = CASE
  WHEN category IN ('Energy Procurement') OR main_category = 'A' THEN 'A'
  WHEN category IN ('Capital Equipment', 'MRO') OR main_category = 'B' THEN 'B'
  WHEN category IN ('Materials', 'Consumables', 'General Supply') OR main_category = 'C' THEN 'C'
  WHEN category IN ('Asset Management', 'Facility Management') OR main_category = 'D' THEN 'D'
  WHEN category IN ('Consulting Services', 'Professional Services', 'IT & Technology') OR main_category = 'E' THEN 'E'
  WHEN category IN ('EPC Projects', 'Emergency Procurements') OR main_category = 'F' THEN 'F'
  ELSE 'C'
END
WHERE main_category_code IS NULL;

-- Step 3: Update subcategory_code (format: A01, B01, etc. no hyphen)
UPDATE fact_procurement_savings_contract
SET subcategory_code = main_category_code || '01'
WHERE subcategory_code IS NULL AND main_category_code IS NOT NULL;

-- Step 4: Link to ref_procurement_categories
UPDATE fact_procurement_savings_contract psc
SET category_id = cat.id
FROM ref_procurement_categories cat
WHERE psc.main_category_code = cat.main_category_code
  AND cat.sub_category_code = psc.subcategory_code
  AND psc.category_id IS NULL;

-- Step 5: Update procurement_sourcing_contracts
UPDATE procurement_sourcing_contracts
SET main_category_code = CASE
  WHEN category LIKE '%EPC%' OR category LIKE '%Power Plant%' THEN 'F'
  WHEN category LIKE '%Equipment%' OR category LIKE '%Mechanical%' OR category LIKE '%Electrical%' THEN 'B'
  WHEN category LIKE '%Coal%' OR category LIKE '%Gas%' OR category LIKE '%Fuel%' OR category LIKE '%Energy%' THEN 'A'
  WHEN category LIKE '%Maintenance%' OR category LIKE '%Service%' OR category LIKE '%Consulting%' THEN 'E'
  WHEN category LIKE '%Material%' OR category LIKE '%Supply%' OR category LIKE '%MRO%' THEN 'C'
  WHEN category LIKE '%Asset%' OR category LIKE '%Facility%' THEN 'D'
  ELSE 'C'
END
WHERE main_category_code IS NULL;

UPDATE procurement_sourcing_contracts
SET subcategory_code = main_category_code || '01'
WHERE subcategory_code IS NULL AND main_category_code IS NOT NULL;

UPDATE procurement_sourcing_contracts sc
SET category_id = cat.id
FROM ref_procurement_categories cat
WHERE sc.main_category_code = cat.main_category_code
  AND cat.sub_category_code = sc.subcategory_code
  AND sc.category_id IS NULL;

-- Step 6: Update supplier_otif_deliveries (uses main_category and product_category)
UPDATE supplier_otif_deliveries
SET main_category_code = CASE
  WHEN product_category LIKE '%EPC%' OR product_category LIKE '%Power Plant%' OR main_category = 'F' THEN 'F'
  WHEN product_category LIKE '%Equipment%' OR product_category LIKE '%Mechanical%' OR product_category LIKE '%Electrical%' OR main_category = 'B' THEN 'B'
  WHEN product_category LIKE '%Coal%' OR product_category LIKE '%Gas%' OR product_category LIKE '%Fuel%' OR product_category LIKE '%Energy%' OR main_category = 'A' THEN 'A'
  WHEN product_category LIKE '%Maintenance%' OR product_category LIKE '%Service%' OR product_category LIKE '%Consulting%' OR main_category = 'E' THEN 'E'
  WHEN product_category LIKE '%Material%' OR product_category LIKE '%Supply%' OR product_category LIKE '%MRO%' OR main_category = 'C' THEN 'C'
  WHEN product_category LIKE '%Asset%' OR product_category LIKE '%Facility%' OR main_category = 'D' THEN 'D'
  ELSE 'C'
END
WHERE main_category_code IS NULL;

UPDATE supplier_otif_deliveries od
SET category_id = cat.id
FROM ref_procurement_categories cat
WHERE od.main_category_code = cat.main_category_code
  AND cat.sub_category_code = od.main_category_code || '01'
  AND od.category_id IS NULL;

-- Step 7: Create indexes
CREATE INDEX IF NOT EXISTS idx_savings_main_category_code ON fact_procurement_savings_contract(main_category_code);
CREATE INDEX IF NOT EXISTS idx_sourcing_main_category_code ON procurement_sourcing_contracts(main_category_code);
CREATE INDEX IF NOT EXISTS idx_otif_main_category_code ON supplier_otif_deliveries(main_category_code);
