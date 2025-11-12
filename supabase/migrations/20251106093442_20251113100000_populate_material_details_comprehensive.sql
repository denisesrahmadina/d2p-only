/*
  # Populate Material Detail Tables with Comprehensive Data
  
  1. Changes
    - Populate material_tolerance_details with 100+ materials per unit
    - Ensure each unit has realistic stock levels and tolerance compliance
    - Align with inventory_planning_tolerance aggregate data
    
  2. Data Distribution
    - Each unit gets materials matching their total_materials count from inventory_planning_tolerance
    - Materials distributed with realistic within/out of tolerance ratios
*/

-- First, clear existing data
DELETE FROM material_tolerance_details;

-- Generate comprehensive material tolerance details for all units
-- Using the critical_materials we created earlier

-- HO-001: 450 materials (92.4% tolerance = 34 out of tolerance)
INSERT INTO material_tolerance_details (
  unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, 
  is_compliant, measurement_date
)
SELECT 
  'HO-001',
  cm.material_id,
  cm.material_name,
  -- Current stock varies realistically
  (10 + ((ASCII(SUBSTRING(cm.material_id, 5, 1)) % 40)))::NUMERIC,
  -- Min stock
  8::NUMERIC,
  -- Max stock  
  25::NUMERIC,
  -- Compliance: ~92.4% should be compliant
  (ROW_NUMBER() OVER (ORDER BY cm.material_id) % 100) < 92,
  '2025-11-05'::DATE
FROM critical_materials cm
LIMIT 450;

-- UBP-SRY: 245 materials (89.8% tolerance = 25 out of tolerance)
INSERT INTO material_tolerance_details (
  unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, 
  is_compliant, measurement_date
)
SELECT 
  'UBP-SRY',
  cm.material_id,
  cm.material_name,
  (10 + ((ASCII(SUBSTRING(cm.material_id, 6, 1)) % 35)))::NUMERIC,
  8::NUMERIC,
  22::NUMERIC,
  (ROW_NUMBER() OVER (ORDER BY cm.material_id) % 100) < 90,
  '2025-11-05'::DATE
FROM critical_materials cm
OFFSET 20 LIMIT 245;

-- UBP-PRK: 220 materials (91.4% tolerance)
INSERT INTO material_tolerance_details (
  unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, 
  is_compliant, measurement_date
)
SELECT 
  'UBP-PRK',
  cm.material_id,
  cm.material_name,
  (10 + ((ASCII(SUBSTRING(cm.material_id, 5, 1)) % 38)))::NUMERIC,
  8::NUMERIC,
  24::NUMERIC,
  (ROW_NUMBER() OVER (ORDER BY cm.material_id) % 100) < 91,
  '2025-11-05'::DATE
FROM critical_materials cm
OFFSET 40 LIMIT 220;

-- UBP-MKS: 210 materials (87.6% tolerance)
INSERT INTO material_tolerance_details (
  unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, 
  is_compliant, measurement_date
)
SELECT 
  'UBP-MKS',
  cm.material_id,
  cm.material_name,
  (10 + ((ASCII(SUBSTRING(cm.material_id, 7, 1)) % 36)))::NUMERIC,
  8::NUMERIC,
  23::NUMERIC,
  (ROW_NUMBER() OVER (ORDER BY cm.material_id) % 100) < 88,
  '2025-11-05'::DATE
FROM critical_materials cm
OFFSET 60 LIMIT 210;

-- UBP-KMJ: 200 materials (93.5% tolerance)
INSERT INTO material_tolerance_details (
  unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, 
  is_compliant, measurement_date
)
SELECT 
  'UBP-KMJ',
  cm.material_id,
  cm.material_name,
  (10 + ((ASCII(SUBSTRING(cm.material_id, 6, 1)) % 37)))::NUMERIC,
  8::NUMERIC,
  24::NUMERIC,
  (ROW_NUMBER() OVER (ORDER BY cm.material_id) % 100) < 94,
  '2025-11-05'::DATE
FROM critical_materials cm
OFFSET 80 LIMIT 200;

-- UBP-LBN: 195 materials (88.2% tolerance)
INSERT INTO material_tolerance_details (
  unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, 
  is_compliant, measurement_date
)
SELECT 
  'UBP-LBN',
  cm.material_id,
  cm.material_name,
  (10 + ((ASCII(SUBSTRING(cm.material_id, 5, 1)) % 34)))::NUMERIC,
  8::NUMERIC,
  22::NUMERIC,
  (ROW_NUMBER() OVER (ORDER BY cm.material_id) % 100) < 88,
  '2025-11-05'::DATE
FROM critical_materials cm
OFFSET 100 LIMIT 195;

-- UBP-PSG: 175 materials (94.3% tolerance)
INSERT INTO material_tolerance_details (
  unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, 
  is_compliant, measurement_date
)
SELECT 
  'UBP-PSG',
  cm.material_id,
  cm.material_name,
  (10 + ((ASCII(SUBSTRING(cm.material_id, 6, 1)) % 39)))::NUMERIC,
  8::NUMERIC,
  25::NUMERIC,
  (ROW_NUMBER() OVER (ORDER BY cm.material_id) % 100) < 94,
  '2025-11-05'::DATE
FROM critical_materials cm
OFFSET 120 LIMIT 175;

-- Continue with remaining units (165-100 materials each)
-- Using batch approach for efficiency

DO $$
DECLARE
  unit_configs TEXT[][] := ARRAY[
    ['UBP-PLM', '165', '140', '86'],
    ['UBP-ASM', '160', '160', '91'],
    ['UBP-BRU', '155', '180', '93'],
    ['UBP-LTR', '150', '200', '85'],
    ['UBP-BKP', '145', '220', '91'],
    ['UBP-PRK2', '140', '240', '88'],
    ['UBP-GRT', '135', '260', '93'],
    ['UBP-PBR', '130', '280', '89'],
    ['UBP-SGG', '125', '300', '95'],
    ['UBP-ADP', '120', '320', '84'],
    ['UBP-BNG', '115', '340', '90'],
    ['UBP-GLM', '110', '360', '88'],
    ['UBP-BKL', '108', '380', '93'],
    ['UBP-PSU', '105', '400', '87'],
    ['UBP-KRY', '102', '420', '91'],
    ['UBP-JRH', '100', '440', '87'],
    ['UBP-PMK', '100', '460', '93'],
    ['UBP-PML', '100', '475', '89'],
    ['UBP-BEU', '100', '485', '85'],
    ['UBP-SMD', '100', '490', '94'],
    ['UBP-AMB', '100', '495', '88']
  ];
  config TEXT[];
BEGIN
  FOREACH config SLICE 1 IN ARRAY unit_configs
  LOOP
    EXECUTE format('
      INSERT INTO material_tolerance_details (
        unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, 
        is_compliant, measurement_date
      )
      SELECT 
        %L,
        cm.material_id,
        cm.material_name,
        (10 + ((ASCII(SUBSTRING(cm.material_id, 5, 1)) %% 38)))::NUMERIC,
        8::NUMERIC,
        24::NUMERIC,
        (ROW_NUMBER() OVER (ORDER BY cm.material_id) %% 100) < %s,
        ''2025-11-05''::DATE
      FROM critical_materials cm
      OFFSET %s LIMIT %s
    ', config[1], config[4], config[3], config[2]);
  END LOOP;
END $$;
