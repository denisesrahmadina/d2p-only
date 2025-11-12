/*
  # Populate Material Inventory Turnover with Comprehensive Data
  
  1. Changes
    - Clear and repopulate material_inventory_turnover table
    - Add 100-450 materials per unit based on size
    - Set period_month=11, period_year=2025
    - Add realistic turnover ratios, consumption, and inventory values
    
  2. Distribution
    - HO-001: 450 materials
    - Major units: 195-245 materials
    - Medium units: 120-180 materials
    - Smaller units: 100-120 materials
*/

-- Clear existing data for November 2025
DELETE FROM material_inventory_turnover 
WHERE period_month = 11 AND period_year = 2025;

-- HO-001: 450 materials
INSERT INTO material_inventory_turnover (
  material_id, unit_id, period_month, period_year, 
  turnover_ratio, consumption_quantity, average_inventory, 
  turnover_days, stock_quantity, demand_rate, status
)
SELECT 
  cm.material_id,
  'HO-001',
  11,
  2025,
  LEAST(4.5, GREATEST(0.8, 
    ROUND((1.5 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 30) / 10.0))::numeric, 2)
  )),
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 50) + 10) * 1000,
  ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 30) + 10) * 1000,
  ROUND((365.0 / LEAST(4.5, GREATEST(0.8, (1.5 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 30) / 10.0)))))::numeric, 1),
  ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 35) + 8) * 1000,
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 20) + 5)::NUMERIC / 10.0,
  CASE 
    WHEN ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 30) / 10.0) < 1.0 THEN 'critical'
    WHEN ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 30) / 10.0) < 2.0 THEN 'warning'
    ELSE 'normal'
  END
FROM critical_materials cm
ORDER BY cm.material_id
LIMIT 450;

-- UBP-SRY: 245 materials
INSERT INTO material_inventory_turnover (
  material_id, unit_id, period_month, period_year, 
  turnover_ratio, consumption_quantity, average_inventory, 
  turnover_days, stock_quantity, demand_rate, status
)
SELECT 
  cm.material_id,
  'UBP-SRY',
  11,
  2025,
  LEAST(4.5, GREATEST(0.8, 
    ROUND((1.2 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 32) / 10.0))::numeric, 2)
  )),
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 60) + 20) * 1000,
  ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 25) + 10) * 1000,
  ROUND((365.0 / LEAST(4.5, GREATEST(0.8, (1.2 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 32) / 10.0)))))::numeric, 1),
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 30) + 12) * 1000,
  ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 22) + 6)::NUMERIC / 10.0,
  CASE 
    WHEN ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 32) / 10.0) < 1.0 THEN 'critical'
    WHEN ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 32) / 10.0) < 2.2 THEN 'warning'
    ELSE 'normal'
  END
FROM critical_materials cm
ORDER BY cm.material_id
OFFSET 20 LIMIT 245;

-- UBP-PRK: 220 materials
INSERT INTO material_inventory_turnover (
  material_id, unit_id, period_month, period_year, 
  turnover_ratio, consumption_quantity, average_inventory, 
  turnover_days, stock_quantity, demand_rate, status
)
SELECT 
  cm.material_id,
  'UBP-PRK',
  11,
  2025,
  LEAST(4.5, GREATEST(0.8, 
    ROUND((2.0 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 28) / 10.0))::numeric, 2)
  )),
  ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 55) + 15) * 1000,
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 22) + 8) * 1000,
  ROUND((365.0 / LEAST(4.5, GREATEST(0.8, (2.0 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 28) / 10.0)))))::numeric, 1),
  ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 28) + 10) * 1000,
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 24) + 7)::NUMERIC / 10.0,
  'normal'
FROM critical_materials cm
ORDER BY cm.material_id
OFFSET 40 LIMIT 220;

-- Continue with remaining major units
-- UBP-MKS: 210 materials
INSERT INTO material_inventory_turnover (material_id, unit_id, period_month, period_year, turnover_ratio, consumption_quantity, average_inventory, turnover_days, stock_quantity, demand_rate, status)
SELECT cm.material_id, 'UBP-MKS', 11, 2025,
  LEAST(4.5, GREATEST(0.8, ROUND((1.0 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 30) / 10.0))::numeric, 2))),
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 50) + 12) * 1000,
  ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 28) + 12) * 1000,
  ROUND((365.0 / LEAST(4.5, GREATEST(0.8, (1.0 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 30) / 10.0)))))::numeric, 1),
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 32) + 10) * 1000,
  ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 20) + 5)::NUMERIC / 10.0,
  CASE WHEN ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 30) / 10.0) < 1.2 THEN 'warning' ELSE 'normal' END
FROM critical_materials cm ORDER BY cm.material_id OFFSET 60 LIMIT 210;

-- UBP-KMJ: 200, UBP-LBN: 195, UBP-PSG: 175
INSERT INTO material_inventory_turnover (material_id, unit_id, period_month, period_year, turnover_ratio, consumption_quantity, average_inventory, turnover_days, stock_quantity, demand_rate, status)
SELECT cm.material_id, 'UBP-KMJ', 11, 2025,
  LEAST(4.5, GREATEST(0.8, ROUND((2.2 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 25) / 10.0))::numeric, 2))),
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 48) + 18) * 1000, ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 20) + 8) * 1000,
  ROUND((365.0 / LEAST(4.5, GREATEST(0.8, (2.2 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 25) / 10.0)))))::numeric, 1),
  ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 26) + 9) * 1000, ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 22) + 6)::NUMERIC / 10.0, 'normal'
FROM critical_materials cm ORDER BY cm.material_id OFFSET 80 LIMIT 200;

INSERT INTO material_inventory_turnover (material_id, unit_id, period_month, period_year, turnover_ratio, consumption_quantity, average_inventory, turnover_days, stock_quantity, demand_rate, status)
SELECT cm.material_id, 'UBP-LBN', 11, 2025,
  LEAST(4.5, GREATEST(0.8, ROUND((0.9 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 28) / 10.0))::numeric, 2))),
  ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 45) + 10) * 1000, ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 30) + 15) * 1000,
  ROUND((365.0 / LEAST(4.5, GREATEST(0.8, (0.9 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 28) / 10.0)))))::numeric, 1),
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 35) + 12) * 1000, ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 18) + 4)::NUMERIC / 10.0,
  CASE WHEN ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 28) / 10.0) < 1.0 THEN 'critical' ELSE 'warning' END
FROM critical_materials cm ORDER BY cm.material_id OFFSET 100 LIMIT 195;

INSERT INTO material_inventory_turnover (material_id, unit_id, period_month, period_year, turnover_ratio, consumption_quantity, average_inventory, turnover_days, stock_quantity, demand_rate, status)
SELECT cm.material_id, 'UBP-PSG', 11, 2025,
  LEAST(4.5, GREATEST(0.8, ROUND((2.4 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 22) / 10.0))::numeric, 2))),
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 52) + 16) * 1000, ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 18) + 7) * 1000,
  ROUND((365.0 / LEAST(4.5, GREATEST(0.8, (2.4 + ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 22) / 10.0)))))::numeric, 1),
  ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 24) + 8) * 1000, ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 26) + 8)::NUMERIC / 10.0, 'normal'
FROM critical_materials cm ORDER BY cm.material_id OFFSET 120 LIMIT 175;

-- Medium and smaller units (165-100 materials)
INSERT INTO material_inventory_turnover (material_id, unit_id, period_month, period_year, turnover_ratio, consumption_quantity, average_inventory, turnover_days, stock_quantity, demand_rate, status)
SELECT cm.material_id, 'UBP-PLM', 11, 2025, LEAST(4.5, GREATEST(0.8, ROUND((1.3 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 28) / 10.0))::numeric, 2))),
  ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 50) + 10) * 1000, ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 30) + 10) * 1000,
  ROUND((365.0 / LEAST(4.5, GREATEST(0.8, (1.3 + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 28) / 10.0)))))::numeric, 1),
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 32) + 10) * 1000, ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 20) + 5)::NUMERIC / 10.0,
  CASE WHEN ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 28) / 10.0) < 1.5 THEN 'warning' ELSE 'normal' END
FROM critical_materials cm ORDER BY cm.material_id OFFSET 140 LIMIT 165;

-- Continue with all other units (ASM through AMB)
-- Using condensed format for brevity
INSERT INTO material_inventory_turnover (material_id, unit_id, period_month, period_year, turnover_ratio, consumption_quantity, average_inventory, turnover_days, stock_quantity, demand_rate, status)
SELECT cm.material_id, unit_configs.unit_id, 11, 2025,
  LEAST(4.5, GREATEST(0.8, ROUND((unit_configs.base_ratio + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 28) / 10.0))::numeric, 2))),
  ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 50) + 10) * 1000,
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 30) + 10) * 1000,
  ROUND((365.0 / LEAST(4.5, GREATEST(0.8, (unit_configs.base_ratio + ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 28) / 10.0)))))::numeric, 1),
  ((ASCII(SUBSTRING(cm.material_id, 8, 1)) % 32) + 10) * 1000,
  ((ASCII(SUBSTRING(cm.material_id, 9, 1)) % 20) + 5)::NUMERIC / 10.0,
  'normal'
FROM critical_materials cm
CROSS JOIN (
  SELECT 'UBP-ASM' as unit_id, 2.1 as base_ratio, 160 as mat_limit, 160 as mat_offset UNION ALL
  SELECT 'UBP-BRU', 2.3, 155, 180 UNION ALL
  SELECT 'UBP-LTR', 1.1, 150, 200 UNION ALL
  SELECT 'UBP-BKP', 2.0, 145, 220 UNION ALL
  SELECT 'UBP-PRK2', 2.1, 140, 240 UNION ALL
  SELECT 'UBP-GRT', 2.2, 135, 260 UNION ALL
  SELECT 'UBP-PBR', 1.7, 130, 280 UNION ALL
  SELECT 'UBP-SGG', 2.5, 125, 300 UNION ALL
  SELECT 'UBP-ADP', 1.4, 120, 320 UNION ALL
  SELECT 'UBP-BNG', 1.9, 115, 340 UNION ALL
  SELECT 'UBP-GLM', 1.0, 110, 360 UNION ALL
  SELECT 'UBP-BKL', 1.6, 108, 380 UNION ALL
  SELECT 'UBP-PSU', 1.2, 105, 400 UNION ALL
  SELECT 'UBP-KRY', 2.0, 102, 420 UNION ALL
  SELECT 'UBP-JRH', 1.8, 100, 440 UNION ALL
  SELECT 'UBP-PMK', 2.3, 100, 460 UNION ALL
  SELECT 'UBP-PML', 1.5, 100, 475 UNION ALL
  SELECT 'UBP-BEU', 1.1, 100, 485 UNION ALL
  SELECT 'UBP-SMD', 2.1, 100, 490 UNION ALL
  SELECT 'UBP-AMB', 1.7, 100, 495
) unit_configs
WHERE cm.material_id IN (
  SELECT material_id FROM critical_materials 
  ORDER BY material_id 
  OFFSET unit_configs.mat_offset 
  LIMIT unit_configs.mat_limit
);
