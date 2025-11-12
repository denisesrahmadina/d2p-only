/*
  # Regenerate Inventory Turn Over Data with New Formula

  1. Changes
    - Delete existing inventory turnover data
    - Regenerate with proper consumption_rate_per_period and average_inventory values
    - Use formula: Inventory Turn Over = Consumption Rate per Period / Average Inventory per Period
    - Then calculate turnover_days from this ratio

  2. Data Generation Logic
    - consumption_rate_per_period: Units consumed per month
    - average_inventory: Average stock level maintained
    - turnover_days: (average_inventory / consumption_rate_per_period) * 30
    - Status based on threshold comparison

  3. Period
    - All data is for 1-month period by default
    - Can be recalculated dynamically for 3, 6, or 12 months in the application
*/

-- Delete existing inventory turnover data
DELETE FROM material_inventory_turnover;

-- Insert regenerated data for Diesel Engine (Threshold: 10 days)
INSERT INTO material_inventory_turnover (
  material_id, unit_id, consumption_rate_per_period, average_inventory,
  period_months, turnover_days, stock_quantity, demand_rate,
  last_replenishment_date, status, measurement_date
) VALUES
-- Normal: turnover_days < 10
('MAT-DIESEL-ENGINE', 'UBP-SRY', 15, 4, 1, 8.0, 4, 0.50, '2025-10-28', 'normal', '2025-11-05'),
('MAT-DIESEL-ENGINE', 'UBP-PRK', 20, 4, 1, 6.0, 4, 0.67, '2025-10-30', 'normal', '2025-11-05'),
('MAT-DIESEL-ENGINE', 'UBP-BKL', 10, 3, 1, 9.0, 3, 0.33, '2025-10-26', 'normal', '2025-11-05'),
('MAT-DIESEL-ENGINE', 'UBP-ASM', 12, 3, 1, 7.5, 3, 0.40, '2025-10-27', 'normal', '2025-11-05'),
('MAT-DIESEL-ENGINE', 'UBP-PSG', 18, 3, 1, 5.0, 3, 0.60, '2025-10-31', 'normal', '2025-11-05'),
-- Warning: 10 <= turnover_days < threshold + 2
('MAT-DIESEL-ENGINE', 'UBP-LBN', 8, 3, 1, 11.3, 3, 0.27, '2025-10-20', 'warning', '2025-11-05'),
('MAT-DIESEL-ENGINE', 'UBP-MKS', 7, 2, 1, 8.6, 2, 0.23, '2025-10-23', 'normal', '2025-11-05'),
-- Critical: turnover_days >= threshold + 2
('MAT-DIESEL-ENGINE', 'UBP-AMB', 5, 2, 1, 12.0, 2, 0.17, '2025-10-18', 'warning', '2025-11-05');

-- Insert regenerated data for Gas Turbine (Threshold: 12 days)
INSERT INTO material_inventory_turnover (
  material_id, unit_id, consumption_rate_per_period, average_inventory,
  period_months, turnover_days, stock_quantity, demand_rate,
  last_replenishment_date, status, measurement_date
) VALUES
-- Normal: turnover_days < 12
('MAT-GAS-TURBINE', 'UBP-PRK', 12, 4, 1, 10.0, 4, 0.40, '2025-10-25', 'normal', '2025-11-05'),
('MAT-GAS-TURBINE', 'UBP-GRT', 15, 5, 1, 10.0, 5, 0.50, '2025-10-28', 'normal', '2025-11-05'),
('MAT-GAS-TURBINE', 'UBP-BKL', 20, 6, 1, 9.0, 6, 0.67, '2025-10-29', 'normal', '2025-11-05'),
('MAT-GAS-TURBINE', 'UBP-PML', 10, 3, 1, 9.0, 3, 0.33, '2025-10-22', 'normal', '2025-11-05'),
('MAT-GAS-TURBINE', 'UBP-BEU', 12, 4, 1, 10.0, 4, 0.40, '2025-10-26', 'normal', '2025-11-05'),
-- Warning: 12 <= turnover_days < 14
('MAT-GAS-TURBINE', 'UBP-PRK2', 6, 2, 1, 10.0, 2, 0.20, '2025-10-19', 'normal', '2025-11-05'),
-- Critical: turnover_days >= 14
('MAT-GAS-TURBINE', 'UBP-GLM', 3, 2, 1, 20.0, 2, 0.10, '2025-10-17', 'critical', '2025-11-05');

-- Insert regenerated data for Transformer (Threshold: 8 days)
INSERT INTO material_inventory_turnover (
  material_id, unit_id, consumption_rate_per_period, average_inventory,
  period_months, turnover_days, stock_quantity, demand_rate,
  last_replenishment_date, status, measurement_date
) VALUES
-- Normal: turnover_days < 8
('MAT-TRANSFORMER', 'UBP-SRY', 40, 8, 1, 6.0, 8, 1.33, '2025-10-30', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-LTR', 50, 10, 1, 6.0, 10, 1.67, '2025-10-31', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-SGG', 30, 6, 1, 6.0, 6, 1.00, '2025-10-29', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-ASM', 60, 12, 1, 6.0, 12, 2.00, '2025-11-01', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-JRH', 35, 7, 1, 6.0, 7, 1.17, '2025-10-30', 'normal', '2025-11-05'),
-- Warning: 8 <= turnover_days < 10
('MAT-TRANSFORMER', 'UBP-ADP', 18, 5, 1, 8.3, 5, 0.60, '2025-10-26', 'warning', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-BRU', 15, 4, 1, 8.0, 4, 0.50, '2025-10-27', 'warning', '2025-11-05'),
-- Critical: turnover_days >= 10
('MAT-TRANSFORMER', 'UBP-LBN', 12, 4, 1, 10.0, 4, 0.40, '2025-10-24', 'critical', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-MKS', 10, 3, 1, 9.0, 3, 0.33, '2025-10-22', 'warning', '2025-11-05');

-- Insert regenerated data for Heat Exchanger (Threshold: 10 days)
INSERT INTO material_inventory_turnover (
  material_id, unit_id, consumption_rate_per_period, average_inventory,
  period_months, turnover_days, stock_quantity, demand_rate,
  last_replenishment_date, status, measurement_date
) VALUES
-- Normal: turnover_days < 10
('MAT-HEAT-EXCHANGER', 'UBP-SRY', 25, 6, 1, 7.2, 6, 0.83, '2025-10-27', 'normal', '2025-11-05'),
('MAT-HEAT-EXCHANGER', 'UBP-PRK', 35, 8, 1, 6.9, 8, 1.17, '2025-10-29', 'normal', '2025-11-05'),
('MAT-HEAT-EXCHANGER', 'UBP-KMJ', 40, 9, 1, 6.8, 9, 1.33, '2025-10-31', 'normal', '2025-11-05'),
('MAT-HEAT-EXCHANGER', 'UBP-KRY', 20, 5, 1, 7.5, 5, 0.67, '2025-10-26', 'normal', '2025-11-05'),
('MAT-HEAT-EXCHANGER', 'UBP-PMK', 45, 10, 1, 6.7, 10, 1.50, '2025-10-31', 'normal', '2025-11-05'),
-- Warning: 10 <= turnover_days < 12
('MAT-HEAT-EXCHANGER', 'UBP-LBN', 9, 3, 1, 10.0, 3, 0.30, '2025-10-21', 'warning', '2025-11-05'),
('MAT-HEAT-EXCHANGER', 'UBP-PBR', 10, 4, 1, 12.0, 4, 0.33, '2025-10-23', 'warning', '2025-11-05'),
-- Critical: turnover_days >= 12
('MAT-HEAT-EXCHANGER', 'UBP-PSU', 5, 2, 1, 12.0, 2, 0.17, '2025-10-18', 'warning', '2025-11-05');

-- Insert regenerated data for Boiler (Threshold: 10 days)
INSERT INTO material_inventory_turnover (
  material_id, unit_id, consumption_rate_per_period, average_inventory,
  period_months, turnover_days, stock_quantity, demand_rate,
  last_replenishment_date, status, measurement_date
) VALUES
-- Normal: turnover_days < 10
('MAT-BOILER', 'UBP-SRY', 20, 5, 1, 7.5, 5, 0.67, '2025-10-26', 'normal', '2025-11-05'),
('MAT-BOILER', 'UBP-ADP', 28, 7, 1, 7.5, 7, 0.93, '2025-10-29', 'normal', '2025-11-05'),
('MAT-BOILER', 'UBP-BNG', 24, 6, 1, 7.5, 6, 0.80, '2025-10-28', 'normal', '2025-11-05'),
('MAT-BOILER', 'UBP-BKP', 32, 8, 1, 7.5, 8, 1.07, '2025-10-30', 'normal', '2025-11-05'),
-- Warning: 10 <= turnover_days < 12
('MAT-BOILER', 'UBP-LBN', 9, 3, 1, 10.0, 3, 0.30, '2025-10-23', 'warning', '2025-11-05'),
('MAT-BOILER', 'UBP-SMD', 12, 4, 1, 10.0, 4, 0.40, '2025-10-25', 'warning', '2025-11-05'),
-- Critical: turnover_days >= 12
('MAT-BOILER', 'UBP-GRT', 5, 2, 1, 12.0, 2, 0.17, '2025-10-20', 'warning', '2025-11-05'),
('MAT-BOILER', 'UBP-PLM', 3, 1, 1, 10.0, 1, 0.10, '2025-10-17', 'warning', '2025-11-05');

-- Verify the data
-- SELECT
--   m.material_name,
--   COUNT(*) as unit_count,
--   ROUND(AVG(mit.turnover_days), 2) as avg_turnover_days,
--   SUM(CASE WHEN mit.status = 'critical' THEN 1 ELSE 0 END) as critical_count,
--   SUM(CASE WHEN mit.status = 'warning' THEN 1 ELSE 0 END) as warning_count,
--   SUM(CASE WHEN mit.status = 'normal' THEN 1 ELSE 0 END) as normal_count
-- FROM critical_materials m
-- LEFT JOIN material_inventory_turnover mit ON m.material_id = mit.material_id
-- GROUP BY m.material_name
-- ORDER BY m.material_name;
