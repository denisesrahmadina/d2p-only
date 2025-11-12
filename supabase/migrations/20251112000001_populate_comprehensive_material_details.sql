/*
  # Populate Comprehensive Material Details for Control Tower

  ## Summary
  Generates realistic mock data for material-level details across all Business Units,
  supporting the new Detail view functionality in Control Tower metrics.

  ## Data Generated

  ### 1. Material Inventory Turnover Data
    - Expands existing 5 critical materials to include multiple materials per unit
    - Adds consumption_quantity, average_inventory, and turnover_ratio for each
    - Covers all 28 standardized Business Units
    - Period: November 2025

  ### 2. Material Tolerance Details
    - Creates detailed material records for each Business Unit
    - Includes current_stock, minimum_stock, maximum_stock
    - Mixes compliant and non-compliant materials for realistic scenarios
    - Calculates is_compliant based on stock ranges

  ## Materials Included
    - Diesel Engine (MAT-DIESEL-ENGINE)
    - Gas Turbine (MAT-GAS-TURBINE)
    - Transformer (MAT-TRANSFORMER)
    - Heat Exchanger (MAT-HEAT-EXCHANGER)
    - Boiler (MAT-BOILER)
    - Steam Turbine (MAT-STEAM-TURBINE)
    - Generator (MAT-GENERATOR)
    - Control Panel (MAT-CONTROL-PANEL)
    - Cooling Tower (MAT-COOLING-TOWER)
    - Fuel Pump (MAT-FUEL-PUMP)

  ## Security
    - Uses existing RLS policies (no changes needed)
*/

-- First, ensure we have additional critical materials
INSERT INTO critical_materials (material_id, material_name, material_code, category, description, threshold_turnover_ratio) VALUES
('MAT-STEAM-TURBINE', 'Steam Turbine', 'ST-001', 'Power Generation Equipment', 'High-efficiency steam turbines for thermal power plants', 2.00),
('MAT-GENERATOR', 'Generator', 'GN-001', 'Power Generation Equipment', 'High-capacity electrical generators', 2.50),
('MAT-CONTROL-PANEL', 'Control Panel', 'CP-001', 'Electrical Equipment', 'Industrial control and monitoring panels', 3.00),
('MAT-COOLING-TOWER', 'Cooling Tower', 'CT-001', 'Thermal Equipment', 'Industrial cooling towers for heat dissipation', 2.00),
('MAT-FUEL-PUMP', 'Fuel Pump', 'FP-001', 'Fuel System', 'High-pressure fuel pumps for power generation', 2.50)
ON CONFLICT (material_id) DO UPDATE SET
  material_name = EXCLUDED.material_name,
  description = EXCLUDED.description,
  threshold_turnover_ratio = EXCLUDED.threshold_turnover_ratio,
  updated_at = NOW();

-- Delete existing material_inventory_turnover data for November 2025 to avoid conflicts
DELETE FROM material_inventory_turnover
WHERE period_month = 11 AND period_year = 2025;

-- Generate comprehensive inventory turnover data for all 28 Business Units
-- This uses realistic variations in consumption, inventory, and turnover ratios

INSERT INTO material_inventory_turnover
(material_id, unit_id, period_month, period_year, consumption_quantity, average_inventory, turnover_ratio, turnover_days, stock_quantity, demand_rate, last_replenishment_date, status, measurement_date)
VALUES
-- UBP-SRY (Suralaya) - Large coal plant
('MAT-DIESEL-ENGINE', 'UBP-SRY', 11, 2025, 45.00, 15.00, 3.00, 10.0, 15, 1.50, '2025-11-01', 'normal', '2025-11-05'),
('MAT-GAS-TURBINE', 'UBP-SRY', 11, 2025, 30.00, 12.00, 2.50, 12.0, 12, 1.00, '2025-11-02', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-SRY', 11, 2025, 60.00, 18.00, 3.33, 9.0, 18, 2.00, '2025-11-01', 'normal', '2025-11-05'),
('MAT-HEAT-EXCHANGER', 'UBP-SRY', 11, 2025, 38.00, 14.00, 2.71, 11.1, 14, 1.27, '2025-11-03', 'normal', '2025-11-05'),
('MAT-BOILER', 'UBP-SRY', 11, 2025, 52.00, 16.00, 3.25, 9.2, 16, 1.73, '2025-11-01', 'normal', '2025-11-05'),
('MAT-STEAM-TURBINE', 'UBP-SRY', 11, 2025, 25.00, 10.00, 2.50, 12.0, 10, 0.83, '2025-11-04', 'normal', '2025-11-05'),
('MAT-GENERATOR', 'UBP-SRY', 11, 2025, 48.00, 14.00, 3.43, 8.8, 14, 1.60, '2025-11-02', 'normal', '2025-11-05'),
('MAT-CONTROL-PANEL', 'UBP-SRY', 11, 2025, 72.00, 20.00, 3.60, 8.3, 20, 2.40, '2025-11-01', 'normal', '2025-11-05'),

-- UBP-LBN (Labuan) - Gas plant
('MAT-DIESEL-ENGINE', 'UBP-LBN', 11, 2025, 18.00, 12.00, 1.50, 20.0, 12, 0.60, '2025-10-28', 'critical', '2025-11-05'),
('MAT-GAS-TURBINE', 'UBP-LBN', 11, 2025, 42.00, 16.00, 2.63, 11.4, 16, 1.40, '2025-11-03', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-LBN', 11, 2025, 28.00, 15.00, 1.87, 16.1, 15, 0.93, '2025-10-29', 'warning', '2025-11-05'),
('MAT-COOLING-TOWER', 'UBP-LBN', 11, 2025, 35.00, 14.00, 2.50, 12.0, 14, 1.17, '2025-11-02', 'normal', '2025-11-05'),
('MAT-FUEL-PUMP', 'UBP-LBN', 11, 2025, 56.00, 18.00, 3.11, 9.6, 18, 1.87, '2025-11-01', 'normal', '2025-11-05'),

-- UBP-PRK (Priok) - Combined cycle
('MAT-DIESEL-ENGINE', 'UBP-PRK', 11, 2025, 55.00, 16.00, 3.44, 8.7, 16, 1.83, '2025-11-02', 'normal', '2025-11-05'),
('MAT-GAS-TURBINE', 'UBP-PRK', 11, 2025, 64.00, 18.00, 3.56, 8.4, 18, 2.13, '2025-11-01', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-PRK', 11, 2025, 45.00, 15.00, 3.00, 10.0, 15, 1.50, '2025-11-03', 'normal', '2025-11-05'),
('MAT-GENERATOR', 'UBP-PRK', 11, 2025, 52.00, 20.00, 2.60, 11.5, 20, 1.73, '2025-11-02', 'normal', '2025-11-05'),
('MAT-CONTROL-PANEL', 'UBP-PRK', 11, 2025, 68.00, 22.00, 3.09, 9.7, 22, 2.27, '2025-11-01', 'normal', '2025-11-05'),

-- UBP-BKL (Bangka Belitung) - Small diesel
('MAT-DIESEL-ENGINE', 'UBP-BKL', 11, 2025, 32.00, 14.00, 2.29, 13.1, 14, 1.07, '2025-11-03', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-BKL', 11, 2025, 24.00, 10.00, 2.40, 12.5, 10, 0.80, '2025-11-04', 'normal', '2025-11-05'),
('MAT-FUEL-PUMP', 'UBP-BKL', 11, 2025, 38.00, 16.00, 2.38, 12.6, 16, 1.27, '2025-11-02', 'normal', '2025-11-05'),

-- UBP-ASM (Asam-asam) - Coal plant
('MAT-BOILER', 'UBP-ASM', 11, 2025, 58.00, 20.00, 2.90, 10.3, 20, 1.93, '2025-11-02', 'normal', '2025-11-05'),
('MAT-STEAM-TURBINE', 'UBP-ASM', 11, 2025, 42.00, 16.00, 2.63, 11.4, 16, 1.40, '2025-11-03', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-ASM', 11, 2025, 50.00, 18.00, 2.78, 10.8, 18, 1.67, '2025-11-02', 'normal', '2025-11-05'),
('MAT-HEAT-EXCHANGER', 'UBP-ASM', 11, 2025, 36.00, 12.00, 3.00, 10.0, 12, 1.20, '2025-11-04', 'normal', '2025-11-05'),
('MAT-GENERATOR', 'UBP-ASM', 11, 2025, 44.00, 16.00, 2.75, 10.9, 16, 1.47, '2025-11-02', 'normal', '2025-11-05'),

-- UBP-MKS (Makassar) - Gas turbine
('MAT-GAS-TURBINE', 'UBP-MKS', 11, 2025, 22.00, 14.00, 1.57, 19.1, 14, 0.73, '2025-10-30', 'critical', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-MKS', 11, 2025, 26.00, 15.00, 1.73, 17.3, 15, 0.87, '2025-10-29', 'warning', '2025-11-05'),
('MAT-COOLING-TOWER', 'UBP-MKS', 11, 2025, 30.00, 12.00, 2.50, 12.0, 12, 1.00, '2025-11-03', 'normal', '2025-11-05'),

-- Continue with remaining Business Units...
-- UBP-PSG (Pesanggaran)
('MAT-DIESEL-ENGINE', 'UBP-PSG', 11, 2025, 46.00, 14.00, 3.29, 9.1, 14, 1.53, '2025-11-02', 'normal', '2025-11-05'),
('MAT-GENERATOR', 'UBP-PSG', 11, 2025, 40.00, 15.00, 2.67, 11.3, 15, 1.33, '2025-11-03', 'normal', '2025-11-05'),
('MAT-FUEL-PUMP', 'UBP-PSG', 11, 2025, 52.00, 16.00, 3.25, 9.2, 16, 1.73, '2025-11-02', 'normal', '2025-11-05'),

-- UBP-AMB (Ambon)
('MAT-DIESEL-ENGINE', 'UBP-AMB', 11, 2025, 16.00, 10.00, 1.60, 18.8, 10, 0.53, '2025-10-31', 'warning', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-AMB', 11, 2025, 20.00, 12.00, 1.67, 18.0, 12, 0.67, '2025-10-30', 'warning', '2025-11-05'),

-- UBP-LTR (Lombok-Timur)
('MAT-DIESEL-ENGINE', 'UBP-LTR', 11, 2025, 48.00, 16.00, 3.00, 10.0, 16, 1.60, '2025-11-03', 'normal', '2025-11-05'),
('MAT-GAS-TURBINE', 'UBP-LTR', 11, 2025, 36.00, 14.00, 2.57, 11.7, 14, 1.20, '2025-11-03', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-LTR', 11, 2025, 54.00, 18.00, 3.00, 10.0, 18, 1.80, '2025-11-02', 'normal', '2025-11-05'),

-- UBP-SGG (Saguling)
('MAT-GENERATOR', 'UBP-SGG', 11, 2025, 58.00, 20.00, 2.90, 10.3, 20, 1.93, '2025-11-02', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-SGG', 11, 2025, 62.00, 22.00, 2.82, 10.6, 22, 2.07, '2025-11-02', 'normal', '2025-11-05'),
('MAT-CONTROL-PANEL', 'UBP-SGG', 11, 2025, 70.00, 20.00, 3.50, 8.6, 20, 2.33, '2025-11-01', 'normal', '2025-11-05'),

-- UBP-ADP (Adipala)
('MAT-DIESEL-ENGINE', 'UBP-ADP', 11, 2025, 38.00, 14.00, 2.71, 11.1, 14, 1.27, '2025-11-03', 'normal', '2025-11-05'),
('MAT-BOILER', 'UBP-ADP', 11, 2025, 44.00, 16.00, 2.75, 10.9, 16, 1.47, '2025-11-02', 'normal', '2025-11-05'),
('MAT-STEAM-TURBINE', 'UBP-ADP', 11, 2025, 32.00, 12.00, 2.67, 11.3, 12, 1.07, '2025-11-03', 'normal', '2025-11-05'),

-- UBP-PRK2 (Priok 2)
('MAT-GAS-TURBINE', 'UBP-PRK2', 11, 2025, 50.00, 18.00, 2.78, 10.8, 18, 1.67, '2025-11-02', 'normal', '2025-11-05'),
('MAT-GENERATOR', 'UBP-PRK2', 11, 2025, 46.00, 16.00, 2.88, 10.4, 16, 1.53, '2025-11-03', 'normal', '2025-11-05'),
('MAT-CONTROL-PANEL', 'UBP-PRK2', 11, 2025, 64.00, 20.00, 3.20, 9.4, 20, 2.13, '2025-11-01', 'normal', '2025-11-05'),

-- UBP-JRH (Jarang)
('MAT-DIESEL-ENGINE', 'UBP-JRH', 11, 2025, 40.00, 15.00, 2.67, 11.3, 15, 1.33, '2025-11-03', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-JRH', 11, 2025, 42.00, 16.00, 2.63, 11.4, 16, 1.40, '2025-11-02', 'normal', '2025-11-05'),

-- UBP-GRT (Grati)
('MAT-STEAM-TURBINE', 'UBP-GRT', 11, 2025, 36.00, 14.00, 2.57, 11.7, 14, 1.20, '2025-11-03', 'normal', '2025-11-05'),
('MAT-BOILER', 'UBP-GRT', 11, 2025, 40.00, 16.00, 2.50, 12.0, 16, 1.33, '2025-11-03', 'normal', '2025-11-05'),

-- UBP-PSU (Pesanggaran Utility)
('MAT-DIESEL-ENGINE', 'UBP-PSU', 11, 2025, 24.00, 15.00, 1.60, 18.8, 15, 0.80, '2025-10-31', 'warning', '2025-11-05'),
('MAT-FUEL-PUMP', 'UBP-PSU', 11, 2025, 28.00, 14.00, 2.00, 15.0, 14, 0.93, '2025-11-02', 'normal', '2025-11-05'),

-- UBP-KRY (Karya)
('MAT-TRANSFORMER', 'UBP-KRY', 11, 2025, 34.00, 14.00, 2.43, 12.3, 14, 1.13, '2025-11-03', 'normal', '2025-11-05'),
('MAT-GENERATOR', 'UBP-KRY', 11, 2025, 38.00, 16.00, 2.38, 12.6, 16, 1.27, '2025-11-02', 'normal', '2025-11-05'),

-- UBP-BNG (Bangka)
('MAT-DIESEL-ENGINE', 'UBP-BNG', 11, 2025, 42.00, 16.00, 2.63, 11.4, 16, 1.40, '2025-11-03', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-BNG', 11, 2025, 36.00, 14.00, 2.57, 11.7, 14, 1.20, '2025-11-03', 'normal', '2025-11-05'),

-- UBP-PLM (Palembang)
('MAT-BOILER', 'UBP-PLM', 11, 2025, 18.00, 16.00, 1.13, 26.5, 16, 0.60, '2025-10-25', 'critical', '2025-11-05'),
('MAT-STEAM-TURBINE', 'UBP-PLM', 11, 2025, 20.00, 14.00, 1.43, 21.0, 14, 0.67, '2025-10-28', 'warning', '2025-11-05'),

-- UBP-BKP (Bakaru)
('MAT-GENERATOR', 'UBP-BKP', 11, 2025, 48.00, 16.00, 3.00, 10.0, 16, 1.60, '2025-11-03', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-BKP', 11, 2025, 52.00, 18.00, 2.89, 10.4, 18, 1.73, '2025-11-02', 'normal', '2025-11-05'),

-- UBP-SMD (Samarinda)
('MAT-GAS-TURBINE', 'UBP-SMD', 11, 2025, 32.00, 14.00, 2.29, 13.1, 14, 1.07, '2025-11-03', 'normal', '2025-11-05'),
('MAT-COOLING-TOWER', 'UBP-SMD', 11, 2025, 28.00, 12.00, 2.33, 12.9, 12, 0.93, '2025-11-03', 'normal', '2025-11-05'),

-- UBP-KMJ (Kamojang)
('MAT-STEAM-TURBINE', 'UBP-KMJ', 11, 2025, 44.00, 16.00, 2.75, 10.9, 16, 1.47, '2025-11-02', 'normal', '2025-11-05'),
('MAT-GENERATOR', 'UBP-KMJ', 11, 2025, 50.00, 18.00, 2.78, 10.8, 18, 1.67, '2025-11-02', 'normal', '2025-11-05'),

-- UBP-PBR (Paiton)
('MAT-BOILER', 'UBP-PBR', 11, 2025, 62.00, 20.00, 3.10, 9.7, 20, 2.07, '2025-11-02', 'normal', '2025-11-05'),
('MAT-STEAM-TURBINE', 'UBP-PBR', 11, 2025, 56.00, 18.00, 3.11, 9.6, 18, 1.87, '2025-11-02', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-PBR', 11, 2025, 58.00, 20.00, 2.90, 10.3, 20, 1.93, '2025-11-02', 'normal', '2025-11-05'),

-- UBP-BRU (Barru)
('MAT-DIESEL-ENGINE', 'UBP-BRU', 11, 2025, 28.00, 12.00, 2.33, 12.9, 12, 0.93, '2025-11-03', 'normal', '2025-11-05'),
('MAT-FUEL-PUMP', 'UBP-BRU', 11, 2025, 32.00, 14.00, 2.29, 13.1, 14, 1.07, '2025-11-03', 'normal', '2025-11-05'),

-- UBP-PML (Pemali)
('MAT-GENERATOR', 'UBP-PML', 11, 2025, 40.00, 16.00, 2.50, 12.0, 16, 1.33, '2025-11-03', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-PML', 11, 2025, 36.00, 14.00, 2.57, 11.7, 14, 1.20, '2025-11-03', 'normal', '2025-11-05'),

-- UBP-GLM (Golomori)
('MAT-GAS-TURBINE', 'UBP-GLM', 11, 2025, 20.00, 16.00, 1.25, 24.0, 16, 0.67, '2025-10-27', 'critical', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-GLM', 11, 2025, 24.00, 14.00, 1.71, 17.5, 14, 0.80, '2025-10-30', 'warning', '2025-11-05'),

-- UBP-BEU (Belitung)
('MAT-DIESEL-ENGINE', 'UBP-BEU', 11, 2025, 34.00, 14.00, 2.43, 12.3, 14, 1.13, '2025-11-03', 'normal', '2025-11-05'),
('MAT-FUEL-PUMP', 'UBP-BEU', 11, 2025, 38.00, 16.00, 2.38, 12.6, 16, 1.27, '2025-11-02', 'normal', '2025-11-05'),

-- UBP-PMK (Pamekasan)
('MAT-DIESEL-ENGINE', 'UBP-PMK', 11, 2025, 52.00, 16.00, 3.25, 9.2, 16, 1.73, '2025-11-02', 'normal', '2025-11-05'),
('MAT-TRANSFORMER', 'UBP-PMK', 11, 2025, 46.00, 14.00, 3.29, 9.1, 14, 1.53, '2025-11-02', 'normal', '2025-11-05');

-- Now populate material_tolerance_details with comprehensive data
-- First, delete existing records for the current measurement period
DELETE FROM material_tolerance_details
WHERE measurement_date = '2025-11-05';

-- Insert material tolerance details for all Business Units
INSERT INTO material_tolerance_details
(unit_id, material_id, material_name, actual_quantity, planned_quantity, tolerance_percentage, is_compliant, current_stock, minimum_stock, maximum_stock, measurement_date)
VALUES
-- UBP-SRY materials
('UBP-SRY', 'MAT-DIESEL-ENGINE', 'Diesel Engine', 15.00, 15.00, 100.0, true, 15.00, 10.00, 20.00, '2025-11-05'),
('UBP-SRY', 'MAT-GAS-TURBINE', 'Gas Turbine', 12.00, 12.00, 100.0, true, 12.00, 8.00, 16.00, '2025-11-05'),
('UBP-SRY', 'MAT-TRANSFORMER', 'Transformer', 18.00, 18.00, 100.0, true, 18.00, 12.00, 24.00, '2025-11-05'),
('UBP-SRY', 'MAT-HEAT-EXCHANGER', 'Heat Exchanger', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05'),
('UBP-SRY', 'MAT-BOILER', 'Boiler', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),
('UBP-SRY', 'MAT-STEAM-TURBINE', 'Steam Turbine', 10.00, 10.00, 100.0, true, 10.00, 8.00, 14.00, '2025-11-05'),
('UBP-SRY', 'MAT-GENERATOR', 'Generator', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05'),
('UBP-SRY', 'MAT-CONTROL-PANEL', 'Control Panel', 20.00, 20.00, 100.0, true, 20.00, 15.00, 25.00, '2025-11-05'),

-- UBP-LBN materials (some out of tolerance)
('UBP-LBN', 'MAT-DIESEL-ENGINE', 'Diesel Engine', 8.00, 12.00, 66.7, false, 8.00, 10.00, 20.00, '2025-11-05'),
('UBP-LBN', 'MAT-GAS-TURBINE', 'Gas Turbine', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),
('UBP-LBN', 'MAT-TRANSFORMER', 'Transformer', 15.00, 15.00, 100.0, true, 15.00, 10.00, 20.00, '2025-11-05'),
('UBP-LBN', 'MAT-COOLING-TOWER', 'Cooling Tower', 22.00, 14.00, 157.1, false, 22.00, 10.00, 18.00, '2025-11-05'),
('UBP-LBN', 'MAT-FUEL-PUMP', 'Fuel Pump', 18.00, 18.00, 100.0, true, 18.00, 14.00, 24.00, '2025-11-05'),

-- UBP-PRK materials
('UBP-PRK', 'MAT-DIESEL-ENGINE', 'Diesel Engine', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),
('UBP-PRK', 'MAT-GAS-TURBINE', 'Gas Turbine', 18.00, 18.00, 100.0, true, 18.00, 14.00, 22.00, '2025-11-05'),
('UBP-PRK', 'MAT-TRANSFORMER', 'Transformer', 15.00, 15.00, 100.0, true, 15.00, 12.00, 20.00, '2025-11-05'),
('UBP-PRK', 'MAT-GENERATOR', 'Generator', 20.00, 20.00, 100.0, true, 20.00, 16.00, 24.00, '2025-11-05'),
('UBP-PRK', 'MAT-CONTROL-PANEL', 'Control Panel', 22.00, 22.00, 100.0, true, 22.00, 18.00, 28.00, '2025-11-05'),

-- UBP-BKL materials
('UBP-BKL', 'MAT-DIESEL-ENGINE', 'Diesel Engine', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05'),
('UBP-BKL', 'MAT-TRANSFORMER', 'Transformer', 10.00, 10.00, 100.0, true, 10.00, 8.00, 14.00, '2025-11-05'),
('UBP-BKL', 'MAT-FUEL-PUMP', 'Fuel Pump', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),

-- UBP-ASM materials
('UBP-ASM', 'MAT-BOILER', 'Boiler', 20.00, 20.00, 100.0, true, 20.00, 16.00, 24.00, '2025-11-05'),
('UBP-ASM', 'MAT-STEAM-TURBINE', 'Steam Turbine', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),
('UBP-ASM', 'MAT-TRANSFORMER', 'Transformer', 18.00, 18.00, 100.0, true, 18.00, 14.00, 22.00, '2025-11-05'),
('UBP-ASM', 'MAT-HEAT-EXCHANGER', 'Heat Exchanger', 12.00, 12.00, 100.0, true, 12.00, 10.00, 16.00, '2025-11-05'),
('UBP-ASM', 'MAT-GENERATOR', 'Generator', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),

-- UBP-MKS materials (some out of tolerance)
('UBP-MKS', 'MAT-GAS-TURBINE', 'Gas Turbine', 6.00, 14.00, 42.9, false, 6.00, 10.00, 18.00, '2025-11-05'),
('UBP-MKS', 'MAT-TRANSFORMER', 'Transformer', 15.00, 15.00, 100.0, true, 15.00, 12.00, 20.00, '2025-11-05'),
('UBP-MKS', 'MAT-COOLING-TOWER', 'Cooling Tower', 12.00, 12.00, 100.0, true, 12.00, 10.00, 16.00, '2025-11-05'),

-- Continue with additional units...
('UBP-PSG', 'MAT-DIESEL-ENGINE', 'Diesel Engine', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05'),
('UBP-PSG', 'MAT-GENERATOR', 'Generator', 15.00, 15.00, 100.0, true, 15.00, 12.00, 20.00, '2025-11-05'),
('UBP-PSG', 'MAT-FUEL-PUMP', 'Fuel Pump', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),

('UBP-AMB', 'MAT-DIESEL-ENGINE', 'Diesel Engine', 10.00, 10.00, 100.0, true, 10.00, 8.00, 14.00, '2025-11-05'),
('UBP-AMB', 'MAT-TRANSFORMER', 'Transformer', 12.00, 12.00, 100.0, true, 12.00, 10.00, 16.00, '2025-11-05'),

('UBP-LTR', 'MAT-DIESEL-ENGINE', 'Diesel Engine', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),
('UBP-LTR', 'MAT-GAS-TURBINE', 'Gas Turbine', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05'),
('UBP-LTR', 'MAT-TRANSFORMER', 'Transformer', 18.00, 18.00, 100.0, true, 18.00, 14.00, 24.00, '2025-11-05'),

('UBP-SGG', 'MAT-GENERATOR', 'Generator', 20.00, 20.00, 100.0, true, 20.00, 16.00, 24.00, '2025-11-05'),
('UBP-SGG', 'MAT-TRANSFORMER', 'Transformer', 22.00, 22.00, 100.0, true, 22.00, 18.00, 28.00, '2025-11-05'),
('UBP-SGG', 'MAT-CONTROL-PANEL', 'Control Panel', 20.00, 20.00, 100.0, true, 20.00, 16.00, 26.00, '2025-11-05'),

('UBP-ADP', 'MAT-DIESEL-ENGINE', 'Diesel Engine', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05'),
('UBP-ADP', 'MAT-BOILER', 'Boiler', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),
('UBP-ADP', 'MAT-STEAM-TURBINE', 'Steam Turbine', 12.00, 12.00, 100.0, true, 12.00, 10.00, 16.00, '2025-11-05'),

('UBP-PRK2', 'MAT-GAS-TURBINE', 'Gas Turbine', 18.00, 18.00, 100.0, true, 18.00, 14.00, 22.00, '2025-11-05'),
('UBP-PRK2', 'MAT-GENERATOR', 'Generator', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),
('UBP-PRK2', 'MAT-CONTROL-PANEL', 'Control Panel', 20.00, 20.00, 100.0, true, 20.00, 16.00, 26.00, '2025-11-05'),

('UBP-JRH', 'MAT-DIESEL-ENGINE', 'Diesel Engine', 15.00, 15.00, 100.0, true, 15.00, 12.00, 20.00, '2025-11-05'),
('UBP-JRH', 'MAT-TRANSFORMER', 'Transformer', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),

('UBP-GRT', 'MAT-STEAM-TURBINE', 'Steam Turbine', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05'),
('UBP-GRT', 'MAT-BOILER', 'Boiler', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),

('UBP-PSU', 'MAT-DIESEL-ENGINE', 'Diesel Engine', 7.00, 15.00, 46.7, false, 7.00, 12.00, 20.00, '2025-11-05'),
('UBP-PSU', 'MAT-FUEL-PUMP', 'Fuel Pump', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05'),

('UBP-KRY', 'MAT-TRANSFORMER', 'Transformer', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05'),
('UBP-KRY', 'MAT-GENERATOR', 'Generator', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),

('UBP-BNG', 'MAT-DIESEL-ENGINE', 'Diesel Engine', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),
('UBP-BNG', 'MAT-TRANSFORMER', 'Transformer', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05'),

('UBP-PLM', 'MAT-BOILER', 'Boiler', 5.00, 16.00, 31.3, false, 5.00, 12.00, 20.00, '2025-11-05'),
('UBP-PLM', 'MAT-STEAM-TURBINE', 'Steam Turbine', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05'),

('UBP-BKP', 'MAT-GENERATOR', 'Generator', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),
('UBP-BKP', 'MAT-TRANSFORMER', 'Transformer', 18.00, 18.00, 100.0, true, 18.00, 14.00, 22.00, '2025-11-05'),

('UBP-SMD', 'MAT-GAS-TURBINE', 'Gas Turbine', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05'),
('UBP-SMD', 'MAT-COOLING-TOWER', 'Cooling Tower', 12.00, 12.00, 100.0, true, 12.00, 10.00, 16.00, '2025-11-05'),

('UBP-KMJ', 'MAT-STEAM-TURBINE', 'Steam Turbine', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),
('UBP-KMJ', 'MAT-GENERATOR', 'Generator', 18.00, 18.00, 100.0, true, 18.00, 14.00, 22.00, '2025-11-05'),

('UBP-PBR', 'MAT-BOILER', 'Boiler', 20.00, 20.00, 100.0, true, 20.00, 16.00, 24.00, '2025-11-05'),
('UBP-PBR', 'MAT-STEAM-TURBINE', 'Steam Turbine', 18.00, 18.00, 100.0, true, 18.00, 14.00, 22.00, '2025-11-05'),
('UBP-PBR', 'MAT-TRANSFORMER', 'Transformer', 20.00, 20.00, 100.0, true, 20.00, 16.00, 26.00, '2025-11-05'),

('UBP-BRU', 'MAT-DIESEL-ENGINE', 'Diesel Engine', 12.00, 12.00, 100.0, true, 12.00, 10.00, 16.00, '2025-11-05'),
('UBP-BRU', 'MAT-FUEL-PUMP', 'Fuel Pump', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05'),

('UBP-PML', 'MAT-GENERATOR', 'Generator', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),
('UBP-PML', 'MAT-TRANSFORMER', 'Transformer', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05'),

('UBP-GLM', 'MAT-GAS-TURBINE', 'Gas Turbine', 4.00, 16.00, 25.0, false, 4.00, 12.00, 20.00, '2025-11-05'),
('UBP-GLM', 'MAT-TRANSFORMER', 'Transformer', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05'),

('UBP-BEU', 'MAT-DIESEL-ENGINE', 'Diesel Engine', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05'),
('UBP-BEU', 'MAT-FUEL-PUMP', 'Fuel Pump', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),

('UBP-PMK', 'MAT-DIESEL-ENGINE', 'Diesel Engine', 16.00, 16.00, 100.0, true, 16.00, 12.00, 20.00, '2025-11-05'),
('UBP-PMK', 'MAT-TRANSFORMER', 'Transformer', 14.00, 14.00, 100.0, true, 14.00, 10.00, 18.00, '2025-11-05');

-- Update inventory_planning_tolerance table with recalculated values based on new material details
UPDATE inventory_planning_tolerance ipt
SET
  materials_out_of_tolerance = (
    SELECT COUNT(*)
    FROM material_tolerance_details mtd
    WHERE mtd.unit_id = ipt.unit_id
    AND mtd.is_compliant = false
    AND mtd.measurement_date = '2025-11-05'
  ),
  total_materials = (
    SELECT COUNT(*)
    FROM material_tolerance_details mtd
    WHERE mtd.unit_id = ipt.unit_id
    AND mtd.measurement_date = '2025-11-05'
  )
WHERE EXISTS (
  SELECT 1
  FROM material_tolerance_details mtd
  WHERE mtd.unit_id = ipt.unit_id
  AND mtd.measurement_date = '2025-11-05'
);

-- Recalculate tolerance_percentage
UPDATE inventory_planning_tolerance
SET tolerance_percentage = CASE
  WHEN total_materials > 0 THEN
    ROUND(((total_materials - materials_out_of_tolerance)::NUMERIC / total_materials::NUMERIC * 100), 2)
  ELSE 100.0
END,
status = CASE
  WHEN ((total_materials - materials_out_of_tolerance)::NUMERIC / NULLIF(total_materials, 0)::NUMERIC * 100) >= 90 THEN 'excellent'
  WHEN ((total_materials - materials_out_of_tolerance)::NUMERIC / NULLIF(total_materials, 0)::NUMERIC * 100) >= 80 THEN 'good'
  ELSE 'needs-attention'
END
WHERE total_materials > 0;
