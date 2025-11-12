/*
  # Complete Missing Units Turnover Data
  
  1. Changes
    - Delete old incomplete data for 7 units
    - Add complete 100-material data for each unit
    - Ensure all 27 UBP units have at least 100 materials
    
  2. Units to Fix
    - UBP-AMB (currently 5, should be 100)
    - UBP-SMD (currently 10, should be 100)
    - UBP-BEU (currently 15, should be 100)
    - UBP-PML (currently 25, should be 100)
    - UBP-PMK (currently 40, should be 100)
    - UBP-JRH (currently 60, should be 100)
    - UBP-KRY (currently 80, should be 102)
*/

-- Delete old incomplete data for these units
DELETE FROM material_inventory_turnover
WHERE period_month = 11 AND period_year = 2025
  AND unit_id IN ('UBP-AMB', 'UBP-SMD', 'UBP-BEU', 'UBP-PML', 'UBP-PMK', 'UBP-JRH', 'UBP-KRY');

-- Delete old tolerance data too
DELETE FROM material_tolerance_details
WHERE unit_id IN ('UBP-AMB', 'UBP-SMD', 'UBP-BEU', 'UBP-PML', 'UBP-PMK', 'UBP-JRH', 'UBP-KRY');

-- UBP-KRY: 102 materials
INSERT INTO material_inventory_turnover (material_id, unit_id, period_month, period_year, turnover_ratio, consumption_quantity, average_inventory, turnover_days, stock_quantity, demand_rate, status)
SELECT cm.material_id, 'UBP-KRY', 11, 2025,
  LEAST(4.5, GREATEST(0.8, ROUND((2.0 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 26) / 10.0))::numeric, 2))),
  (50 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) * 10))::NUMERIC,
  (30 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 27) * 10))::NUMERIC,
  ROUND((365.0 / LEAST(4.5, GREATEST(0.8, (2.0 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 26) / 10.0)))))::numeric, 1),
  (20 + ((ASCII(SUBSTRING(cm.material_id, 7, 1)) % 23) * 10))::NUMERIC,
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) + 5)::NUMERIC / 10.0,
  CASE WHEN ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 26) / 10.0) < 1.0 THEN 'critical' WHEN ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 26) / 10.0) < 1.5 THEN 'warning' ELSE 'normal' END
FROM critical_materials cm ORDER BY cm.material_id OFFSET 420 LIMIT 102;

INSERT INTO material_tolerance_details (unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, is_compliant, measurement_date)
SELECT 'UBP-KRY', cm.material_id, cm.material_name, (10 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 38)))::NUMERIC, 8::NUMERIC, 24::NUMERIC,
  (ROW_NUMBER() OVER (ORDER BY cm.material_id) % 100) < 91, '2025-11-05'::DATE
FROM critical_materials cm ORDER BY cm.material_id OFFSET 420 LIMIT 102;

-- UBP-JRH: 100 materials
INSERT INTO material_inventory_turnover (material_id, unit_id, period_month, period_year, turnover_ratio, consumption_quantity, average_inventory, turnover_days, stock_quantity, demand_rate, status)
SELECT cm.material_id, 'UBP-JRH', 11, 2025,
  LEAST(4.5, GREATEST(0.8, ROUND((1.8 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 28) / 10.0))::numeric, 2))),
  (50 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) * 10))::NUMERIC,
  (30 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 27) * 10))::NUMERIC,
  ROUND((365.0 / LEAST(4.5, GREATEST(0.8, (1.8 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 28) / 10.0)))))::numeric, 1),
  (20 + ((ASCII(SUBSTRING(cm.material_id, 7, 1)) % 23) * 10))::NUMERIC,
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) + 5)::NUMERIC / 10.0,
  'normal'
FROM critical_materials cm ORDER BY cm.material_id OFFSET 440 LIMIT 100;

INSERT INTO material_tolerance_details (unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, is_compliant, measurement_date)
SELECT 'UBP-JRH', cm.material_id, cm.material_name, (10 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 36)))::NUMERIC, 8::NUMERIC, 23::NUMERIC,
  (ROW_NUMBER() OVER (ORDER BY cm.material_id) % 100) < 87, '2025-11-05'::DATE
FROM critical_materials cm ORDER BY cm.material_id OFFSET 440 LIMIT 100;

-- UBP-PMK: 100 materials
INSERT INTO material_inventory_turnover (material_id, unit_id, period_month, period_year, turnover_ratio, consumption_quantity, average_inventory, turnover_days, stock_quantity, demand_rate, status)
SELECT cm.material_id, 'UBP-PMK', 11, 2025,
  LEAST(4.5, GREATEST(0.8, ROUND((2.3 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 24) / 10.0))::numeric, 2))),
  (50 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) * 10))::NUMERIC,
  (30 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 27) * 10))::NUMERIC,
  ROUND((365.0 / LEAST(4.5, GREATEST(0.8, (2.3 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 24) / 10.0)))))::numeric, 1),
  (20 + ((ASCII(SUBSTRING(cm.material_id, 7, 1)) % 23) * 10))::NUMERIC,
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) + 5)::NUMERIC / 10.0,
  'normal'
FROM critical_materials cm ORDER BY cm.material_id OFFSET 460 LIMIT 100;

INSERT INTO material_tolerance_details (unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, is_compliant, measurement_date)
SELECT 'UBP-PMK', cm.material_id, cm.material_name, (10 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 39)))::NUMERIC, 8::NUMERIC, 25::NUMERIC,
  (ROW_NUMBER() OVER (ORDER BY cm.material_id) % 100) < 93, '2025-11-05'::DATE
FROM critical_materials cm ORDER BY cm.material_id OFFSET 460 LIMIT 100;

-- UBP-PML: 100 materials
INSERT INTO material_inventory_turnover (material_id, unit_id, period_month, period_year, turnover_ratio, consumption_quantity, average_inventory, turnover_days, stock_quantity, demand_rate, status)
SELECT cm.material_id, 'UBP-PML', 11, 2025,
  LEAST(4.5, GREATEST(0.8, ROUND((1.5 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 30) / 10.0))::numeric, 2))),
  (50 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) * 10))::NUMERIC,
  (30 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 27) * 10))::NUMERIC,
  ROUND((365.0 / LEAST(4.5, GREATEST(0.8, (1.5 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 30) / 10.0)))))::numeric, 1),
  (20 + ((ASCII(SUBSTRING(cm.material_id, 7, 1)) % 23) * 10))::NUMERIC,
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) + 5)::NUMERIC / 10.0,
  CASE WHEN ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 30) / 10.0) < 1.0 THEN 'warning' ELSE 'normal' END
FROM critical_materials cm ORDER BY cm.material_id OFFSET 475 LIMIT 100;

INSERT INTO material_tolerance_details (unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, is_compliant, measurement_date)
SELECT 'UBP-PML', cm.material_id, cm.material_name, (10 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 37)))::NUMERIC, 8::NUMERIC, 24::NUMERIC,
  (ROW_NUMBER() OVER (ORDER BY cm.material_id) % 100) < 89, '2025-11-05'::DATE
FROM critical_materials cm ORDER BY cm.material_id OFFSET 475 LIMIT 100;

-- UBP-BEU: 100 materials
INSERT INTO material_inventory_turnover (material_id, unit_id, period_month, period_year, turnover_ratio, consumption_quantity, average_inventory, turnover_days, stock_quantity, demand_rate, status)
SELECT cm.material_id, 'UBP-BEU', 11, 2025,
  LEAST(4.5, GREATEST(0.8, ROUND((1.1 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 31) / 10.0))::numeric, 2))),
  (50 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) * 10))::NUMERIC,
  (30 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 27) * 10))::NUMERIC,
  ROUND((365.0 / LEAST(4.5, GREATEST(0.8, (1.1 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 31) / 10.0)))))::numeric, 1),
  (20 + ((ASCII(SUBSTRING(cm.material_id, 7, 1)) % 23) * 10))::NUMERIC,
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) + 5)::NUMERIC / 10.0,
  CASE WHEN ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 31) / 10.0) < 1.2 THEN 'warning' ELSE 'normal' END
FROM critical_materials cm ORDER BY cm.material_id OFFSET 485 LIMIT 100;

INSERT INTO material_tolerance_details (unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, is_compliant, measurement_date)
SELECT 'UBP-BEU', cm.material_id, cm.material_name, (10 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 35)))::NUMERIC, 8::NUMERIC, 22::NUMERIC,
  (ROW_NUMBER() OVER (ORDER BY cm.material_id) % 100) < 85, '2025-11-05'::DATE
FROM critical_materials cm ORDER BY cm.material_id OFFSET 485 LIMIT 100;

-- UBP-SMD: 100 materials
INSERT INTO material_inventory_turnover (material_id, unit_id, period_month, period_year, turnover_ratio, consumption_quantity, average_inventory, turnover_days, stock_quantity, demand_rate, status)
SELECT cm.material_id, 'UBP-SMD', 11, 2025,
  LEAST(4.5, GREATEST(0.8, ROUND((2.1 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 27) / 10.0))::numeric, 2))),
  (50 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) * 10))::NUMERIC,
  (30 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 27) * 10))::NUMERIC,
  ROUND((365.0 / LEAST(4.5, GREATEST(0.8, (2.1 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 27) / 10.0)))))::numeric, 1),
  (20 + ((ASCII(SUBSTRING(cm.material_id, 7, 1)) % 23) * 10))::NUMERIC,
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) + 5)::NUMERIC / 10.0,
  'normal'
FROM critical_materials cm ORDER BY cm.material_id OFFSET 490 LIMIT 100;

INSERT INTO material_tolerance_details (unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, is_compliant, measurement_date)
SELECT 'UBP-SMD', cm.material_id, cm.material_name, (10 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 40)))::NUMERIC, 8::NUMERIC, 26::NUMERIC,
  (ROW_NUMBER() OVER (ORDER BY cm.material_id) % 100) < 94, '2025-11-05'::DATE
FROM critical_materials cm ORDER BY cm.material_id OFFSET 490 LIMIT 100;

-- UBP-AMB: 100 materials  
INSERT INTO material_inventory_turnover (material_id, unit_id, period_month, period_year, turnover_ratio, consumption_quantity, average_inventory, turnover_days, stock_quantity, demand_rate, status)
SELECT cm.material_id, 'UBP-AMB', 11, 2025,
  LEAST(4.5, GREATEST(0.8, ROUND((1.7 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 29) / 10.0))::numeric, 2))),
  (50 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) * 10))::NUMERIC,
  (30 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 27) * 10))::NUMERIC,
  ROUND((365.0 / LEAST(4.5, GREATEST(0.8, (1.7 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 29) / 10.0)))))::numeric, 1),
  (20 + ((ASCII(SUBSTRING(cm.material_id, 7, 1)) % 23) * 10))::NUMERIC,
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) + 5)::NUMERIC / 10.0,
  'normal'
FROM critical_materials cm ORDER BY cm.material_id OFFSET 495 LIMIT 100;

INSERT INTO material_tolerance_details (unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, is_compliant, measurement_date)
SELECT 'UBP-AMB', cm.material_id, cm.material_name, (10 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 38)))::NUMERIC, 8::NUMERIC, 24::NUMERIC,
  (ROW_NUMBER() OVER (ORDER BY cm.material_id) % 100) < 88, '2025-11-05'::DATE
FROM critical_materials cm ORDER BY cm.material_id OFFSET 495 LIMIT 100;

-- Update turnover ratios based on consumption/inventory
UPDATE material_inventory_turnover
SET 
  turnover_ratio = ROUND((consumption_quantity / NULLIF(average_inventory, 0))::NUMERIC, 2),
  turnover_days = ROUND((365.0 / (consumption_quantity / NULLIF(average_inventory, 0)))::NUMERIC, 1),
  status = CASE
    WHEN (consumption_quantity / NULLIF(average_inventory, 0)) < 1.5 THEN 'critical'
    WHEN (consumption_quantity / NULLIF(average_inventory, 0)) < 2.0 THEN 'warning'
    ELSE 'normal'
  END
WHERE period_month = 11 AND period_year = 2025 
  AND unit_id IN ('UBP-AMB', 'UBP-SMD', 'UBP-BEU', 'UBP-PML', 'UBP-PMK', 'UBP-JRH', 'UBP-KRY')
  AND average_inventory > 0;
