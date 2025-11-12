/*
  # Repopulate 7 Units with 100 Materials Each (With Defaults)
  
  Provide default values for all required fields
*/

-- UBP-KRY: 102 materials
INSERT INTO material_inventory_turnover (material_id, unit_id, period_month, period_year, turnover_ratio, consumption_quantity, average_inventory, turnover_days, stock_quantity, demand_rate, status)
SELECT 
  cm.material_id, 'UBP-KRY', 11, 2025,
  COALESCE(ROUND(((50 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) * 10)) / NULLIF((30 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 27) * 10)), 0))::NUMERIC, 2), 2.0),
  (50 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) * 10))::NUMERIC,
  (30 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 27) * 10))::NUMERIC,
  COALESCE(ROUND((365.0 / NULLIF(((50 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) * 10)) / NULLIF((30 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 27) * 10)), 0)), 0))::NUMERIC, 1), 180.0),
  (20 + ((ASCII(SUBSTRING(cm.material_id, 7, 1)) % 23) * 10))::NUMERIC,
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) + 5)::NUMERIC / 10.0,
  'normal'
FROM (SELECT * FROM critical_materials ORDER BY material_id OFFSET 420 LIMIT 102) cm;

INSERT INTO material_tolerance_details (unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, is_compliant, measurement_date)
SELECT 
  'UBP-KRY', cm.material_id, cm.material_name, 
  (10 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 38)))::NUMERIC, 8::NUMERIC, 24::NUMERIC,
  (ROW_NUMBER() OVER (ORDER BY cm.material_id) % 100) < 91, '2025-11-05'::DATE
FROM (SELECT * FROM critical_materials ORDER BY material_id OFFSET 420 LIMIT 102) cm;

-- Other 6 units (100 materials each)
INSERT INTO material_inventory_turnover (material_id, unit_id, period_month, period_year, turnover_ratio, consumption_quantity, average_inventory, turnover_days, stock_quantity, demand_rate, status)
SELECT 
  cm.material_id, unit_configs.unit_id, 11, 2025,
  COALESCE(ROUND(((50 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) * 10)) / NULLIF((30 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 27) * 10)), 0))::NUMERIC, 2), 2.0),
  (50 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) * 10))::NUMERIC,
  (30 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 27) * 10))::NUMERIC,
  COALESCE(ROUND((365.0 / NULLIF(((50 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) * 10)) / NULLIF((30 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 27) * 10)), 0)), 0))::NUMERIC, 1), 180.0),
  (20 + ((ASCII(SUBSTRING(cm.material_id, 7, 1)) % 23) * 10))::NUMERIC,
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 45) + 5)::NUMERIC / 10.0,
  'normal'
FROM (SELECT * FROM critical_materials ORDER BY material_id OFFSET 400 LIMIT 100) cm
CROSS JOIN (VALUES 
  ('UBP-JRH'), ('UBP-PMK'), ('UBP-PML'), ('UBP-BEU'), ('UBP-SMD'), ('UBP-AMB')
) AS unit_configs(unit_id);

INSERT INTO material_tolerance_details (unit_id, material_id, material_name, current_stock, minimum_stock, maximum_stock, is_compliant, measurement_date)
SELECT 
  unit_configs.unit_id, cm.material_id, cm.material_name,
  (10 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 38)))::NUMERIC, 8::NUMERIC, 24::NUMERIC,
  (ROW_NUMBER() OVER (PARTITION BY unit_configs.unit_id ORDER BY cm.material_id) % 100) < 88, '2025-11-05'::DATE
FROM (SELECT * FROM critical_materials ORDER BY material_id OFFSET 400 LIMIT 100) cm
CROSS JOIN (VALUES 
  ('UBP-JRH'), ('UBP-PMK'), ('UBP-PML'), ('UBP-BEU'), ('UBP-SMD'), ('UBP-AMB')
) AS unit_configs(unit_id);
