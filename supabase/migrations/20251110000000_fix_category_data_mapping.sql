/*
  # Fix Category Data Mapping for Contract Tables

  1. Problem Overview
    - Contract data inserted with legacy column names (main_category, sub_category, category)
    - New Indonesian category system uses main_category_code (A-F) and category_id
    - Views query main_category_code but data only populated in main_category/category
    - Results in blank pages when clicking category cards

  2. Solution Steps
    - Create category code mapping from legacy names to A-F codes
    - Update fact_procurement_savings_contract with proper category codes
    - Update procurement_sourcing_contracts with proper category codes
    - Update supplier_otif_deliveries with proper category codes
    - Link all records to ref_procurement_categories via category_id

  3. Category Mapping
    - Energy Procurement / Coal / Gas / LNG → Category A (Energi Primer)
    - Capital Equipment / Mechanical/Electrical → Category B (Peralatan M/E)
    - MRO / Materials / Consumables → Category C (Material & Consumable)
    - Asset Non-Operational → Category D (Asset Non-Operasional)
    - Consulting / Services / Professional → Category E (Jasa & Kontrak)
    - EPC Projects / Major Equipment → Category F (Peralatan Utama & EPC)

  4. Data Integrity
    - Preserve original category names in category column
    - Add main_category_code for new filtering
    - Link via category_id foreign key
    - Update organization_id where missing
*/

-- Step 1: Update fact_procurement_savings_contract with category codes
UPDATE fact_procurement_savings_contract
SET main_category_code = CASE
  -- Category A: Energi Primer dan Jasa Penunjangnya
  WHEN category IN ('Energy Procurement') OR main_category = 'A' THEN 'A'
  -- Category B: Peralatan Penunjang dan Sistem Mechanical/Electrical
  WHEN category IN ('Capital Equipment', 'MRO') OR main_category = 'B' THEN 'B'
  -- Category C: Material, Consumable, dan General Supply
  WHEN category IN ('Materials', 'Consumables', 'General Supply') OR main_category = 'C' THEN 'C'
  -- Category D: Asset Non-Operasional dan Penunjang Manajemen
  WHEN category IN ('Asset Management', 'Facility Management') OR main_category = 'D' THEN 'D'
  -- Category E: Jasa dan Kontrak Pendukung
  WHEN category IN ('Consulting Services', 'Professional Services', 'IT & Technology') OR main_category = 'E' THEN 'E'
  -- Category F: Peralatan Utama Pembangkit dan Project EPC
  WHEN category IN ('EPC Projects', 'Emergency Procurements') OR main_category = 'F' THEN 'F'
  ELSE 'C' -- Default to Category C for unmatched items
END
WHERE main_category_code IS NULL OR main_category_code = '';

-- Step 2: Update subcategory_code based on sub_category
UPDATE fact_procurement_savings_contract
SET subcategory_code = CASE
  -- Category A subcategories
  WHEN main_category_code = 'A' AND (sub_category LIKE '%Energi Primer%' OR sub_category LIKE '%Coal%' OR sub_category LIKE '%Gas%' OR sub_category LIKE '%LNG%') THEN 'A-01'
  WHEN main_category_code = 'A' AND (sub_category LIKE '%Transportasi%' OR sub_category LIKE '%Transportation%') THEN 'A-02'
  WHEN main_category_code = 'A' AND sub_category LIKE '%Jasa%' THEN 'A-03'

  -- Category B subcategories
  WHEN main_category_code = 'B' AND sub_category LIKE '%Komunikasi%' THEN 'B-01'
  WHEN main_category_code = 'B' AND (sub_category LIKE '%Pengukur%' OR sub_category LIKE '%Recorder%') THEN 'B-02'
  WHEN main_category_code = 'B' AND sub_category LIKE '%Bearing%' THEN 'B-03'
  WHEN main_category_code = 'B' AND (sub_category LIKE '%Filter%' OR sub_category LIKE '%Kabel%') THEN 'B-04'
  WHEN main_category_code = 'B' AND (sub_category LIKE '%Kompressor%' OR sub_category LIKE '%Motor%' OR sub_category LIKE '%Peralatan%') THEN 'B-05'
  WHEN main_category_code = 'B' AND (sub_category LIKE '%Instrumen%' OR sub_category LIKE '%Kontrol%') THEN 'B-06'
  WHEN main_category_code = 'B' AND (sub_category LIKE '%Listrik%' OR sub_category LIKE '%Elektronik%') THEN 'B-07'
  WHEN main_category_code = 'B' AND (sub_category LIKE '%Pipping%' OR sub_category LIKE '%Connection%') THEN 'B-08'
  WHEN main_category_code = 'B' AND (sub_category LIKE '%Pompa%' OR sub_category LIKE '%Valve%' OR sub_category LIKE '%Trap%') THEN 'B-09'

  -- Category C subcategories
  WHEN main_category_code = 'C' AND (sub_category LIKE '%Consumable%' OR sub_category LIKE '%Office%') THEN 'C-01'
  WHEN main_category_code = 'C' AND sub_category LIKE '%Tools%' THEN 'C-02'
  WHEN main_category_code = 'C' AND sub_category LIKE '%Chemical%' THEN 'C-03'
  WHEN main_category_code = 'C' AND sub_category LIKE '%Safety%' THEN 'C-04'
  WHEN main_category_code = 'C' AND sub_category LIKE '%Operational%' THEN 'C-05'

  -- Category D subcategories
  WHEN main_category_code = 'D' AND sub_category LIKE '%Furniture%' THEN 'D-01'
  WHEN main_category_code = 'D' AND sub_category LIKE '%Vehicle%' THEN 'D-02'
  WHEN main_category_code = 'D' AND (sub_category LIKE '%IT%' OR sub_category LIKE '%Computer%') THEN 'D-03'
  WHEN main_category_code = 'D' AND sub_category LIKE '%Building%' THEN 'D-04'

  -- Category E subcategories
  WHEN main_category_code = 'E' AND sub_category LIKE '%Maintenance%' THEN 'E-01'
  WHEN main_category_code = 'E' AND sub_category LIKE '%Consulting%' THEN 'E-02'
  WHEN main_category_code = 'E' AND (sub_category LIKE '%Training%' OR sub_category LIKE '%Development%') THEN 'E-03'
  WHEN main_category_code = 'E' AND sub_category LIKE '%Security%' THEN 'E-04'
  WHEN main_category_code = 'E' AND sub_category LIKE '%Catering%' THEN 'E-05'

  -- Category F subcategories
  WHEN main_category_code = 'F' AND (sub_category LIKE '%Turbine%' OR sub_category LIKE '%Generator%') THEN 'F-01'
  WHEN main_category_code = 'F' AND sub_category LIKE '%Boiler%' THEN 'F-02'
  WHEN main_category_code = 'F' AND sub_category LIKE '%EPC%' THEN 'F-03'
  WHEN main_category_code = 'F' AND sub_category LIKE '%Civil%' THEN 'F-04'

  -- Default to first subcategory of respective category
  WHEN main_category_code IS NOT NULL THEN main_category_code || '-01'
  ELSE 'C-01'
END
WHERE subcategory_code IS NULL OR subcategory_code = '';

-- Step 3: Link to ref_procurement_categories via category_id
UPDATE fact_procurement_savings_contract psc
SET category_id = cat.id
FROM ref_procurement_categories cat
WHERE psc.main_category_code = cat.main_category_code
  AND psc.subcategory_code = cat.subcategory_code
  AND psc.category_id IS NULL;

-- If exact subcategory match not found, link to first subcategory of main category
UPDATE fact_procurement_savings_contract psc
SET category_id = cat.id
FROM ref_procurement_categories cat
WHERE psc.main_category_code = cat.main_category_code
  AND cat.subcategory_code = psc.main_category_code || '-01'
  AND psc.category_id IS NULL;

-- Step 4: Ensure organization_id is set
UPDATE fact_procurement_savings_contract
SET organization_id = 'ORG001'
WHERE organization_id IS NULL OR organization_id = '';

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
WHERE main_category_code IS NULL OR main_category_code = '';

-- Default subcategory for sourcing contracts
UPDATE procurement_sourcing_contracts
SET subcategory_code = main_category_code || '-01'
WHERE (subcategory_code IS NULL OR subcategory_code = '')
  AND main_category_code IS NOT NULL;

-- Link sourcing contracts to categories
UPDATE procurement_sourcing_contracts sc
SET category_id = cat.id
FROM ref_procurement_categories cat
WHERE sc.main_category_code = cat.main_category_code
  AND sc.subcategory_code = cat.subcategory_code
  AND sc.category_id IS NULL;

UPDATE procurement_sourcing_contracts sc
SET category_id = cat.id
FROM ref_procurement_categories cat
WHERE sc.main_category_code = cat.main_category_code
  AND cat.subcategory_code = sc.main_category_code || '-01'
  AND sc.category_id IS NULL;

-- Step 6: Update supplier_otif_deliveries
UPDATE supplier_otif_deliveries
SET main_category_code = CASE
  WHEN category LIKE '%EPC%' OR category LIKE '%Power Plant%' THEN 'F'
  WHEN category LIKE '%Equipment%' OR category LIKE '%Mechanical%' OR category LIKE '%Electrical%' THEN 'B'
  WHEN category LIKE '%Coal%' OR category LIKE '%Gas%' OR category LIKE '%Fuel%' OR category LIKE '%Energy%' THEN 'A'
  WHEN category LIKE '%Maintenance%' OR category LIKE '%Service%' OR category LIKE '%Consulting%' THEN 'E'
  WHEN category LIKE '%Material%' OR category LIKE '%Supply%' OR category LIKE '%MRO%' THEN 'C'
  WHEN category LIKE '%Asset%' OR category LIKE '%Facility%' THEN 'D'
  ELSE 'C'
END
WHERE main_category_code IS NULL OR main_category_code = '';

-- Link OTIF deliveries to categories
UPDATE supplier_otif_deliveries od
SET category_id = cat.id
FROM ref_procurement_categories cat
WHERE od.main_category_code = cat.main_category_code
  AND cat.subcategory_code = od.main_category_code || '-01'
  AND od.category_id IS NULL;

-- Step 7: Create indexes for optimized queries
CREATE INDEX IF NOT EXISTS idx_savings_main_category_code ON fact_procurement_savings_contract(main_category_code);
CREATE INDEX IF NOT EXISTS idx_savings_subcategory_code ON fact_procurement_savings_contract(subcategory_code);
CREATE INDEX IF NOT EXISTS idx_savings_category_id ON fact_procurement_savings_contract(category_id);

CREATE INDEX IF NOT EXISTS idx_sourcing_main_category_code ON procurement_sourcing_contracts(main_category_code);
CREATE INDEX IF NOT EXISTS idx_sourcing_category_id ON procurement_sourcing_contracts(category_id);

CREATE INDEX IF NOT EXISTS idx_otif_main_category_code ON supplier_otif_deliveries(main_category_code);
CREATE INDEX IF NOT EXISTS idx_otif_category_id ON supplier_otif_deliveries(category_id);

-- Verification queries
DO $$
DECLARE
  savings_count INTEGER;
  sourcing_count INTEGER;
  otif_count INTEGER;
  savings_with_category INTEGER;
  sourcing_with_category INTEGER;
  otif_with_category INTEGER;
BEGIN
  -- Count total records
  SELECT COUNT(*) INTO savings_count FROM fact_procurement_savings_contract;
  SELECT COUNT(*) INTO sourcing_count FROM procurement_sourcing_contracts;
  SELECT COUNT(*) INTO otif_count FROM supplier_otif_deliveries;

  -- Count records with category mapping
  SELECT COUNT(*) INTO savings_with_category
  FROM fact_procurement_savings_contract
  WHERE main_category_code IS NOT NULL AND category_id IS NOT NULL;

  SELECT COUNT(*) INTO sourcing_with_category
  FROM procurement_sourcing_contracts
  WHERE main_category_code IS NOT NULL AND category_id IS NOT NULL;

  SELECT COUNT(*) INTO otif_with_category
  FROM supplier_otif_deliveries
  WHERE main_category_code IS NOT NULL AND category_id IS NOT NULL;

  RAISE NOTICE '=== Category Data Mapping Results ===';
  RAISE NOTICE 'Savings Contracts: % total, % mapped (%.1f%%)',
    savings_count, savings_with_category,
    CASE WHEN savings_count > 0 THEN (savings_with_category::numeric / savings_count * 100) ELSE 0 END;
  RAISE NOTICE 'Sourcing Contracts: % total, % mapped (%.1f%%)',
    sourcing_count, sourcing_with_category,
    CASE WHEN sourcing_count > 0 THEN (sourcing_with_category::numeric / sourcing_count * 100) ELSE 0 END;
  RAISE NOTICE 'OTIF Deliveries: % total, % mapped (%.1f%%)',
    otif_count, otif_with_category,
    CASE WHEN otif_count > 0 THEN (otif_with_category::numeric / otif_count * 100) ELSE 0 END;

  -- Show distribution by category
  RAISE NOTICE '';
  RAISE NOTICE '=== Category Distribution ===';
  FOR i IN
    SELECT
      main_category_code,
      COUNT(*) as contract_count
    FROM fact_procurement_savings_contract
    WHERE main_category_code IS NOT NULL
    GROUP BY main_category_code
    ORDER BY main_category_code
  LOOP
    RAISE NOTICE 'Category %: % contracts', i.main_category_code, i.contract_count;
  END LOOP;
END $$;
