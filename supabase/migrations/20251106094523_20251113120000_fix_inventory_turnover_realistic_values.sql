/*
  # Fix Inventory Turnover with Realistic Values
  
  1. Changes
    - Update consumption_quantity and average_inventory to realistic values
    - Consumption: 50-500 units (not 10000+)
    - Average inventory: 30-300 units (not 10000+)
    - Maintain proper turnover_ratio = consumption / average_inventory
    - Keep all 100+ materials per unit
    
  2. Realistic Ranges
    - Small materials: consumption 50-150, inventory 30-100
    - Medium materials: consumption 150-300, inventory 100-200
    - Large materials: consumption 300-500, inventory 200-300
*/

-- Update all turnover records with realistic values
-- Using material_id hash to create varied but consistent values
UPDATE material_inventory_turnover
SET 
  -- Consumption: 50 to 500 units
  consumption_quantity = (50 + ((ASCII(SUBSTRING(material_id, 8, 1)) % 45) * 10))::NUMERIC,
  -- Average inventory: 30 to 300 units  
  average_inventory = (30 + ((ASCII(SUBSTRING(material_id, 9, 1)) % 27) * 10))::NUMERIC,
  -- Stock quantity: 20 to 250 units
  stock_quantity = (20 + ((ASCII(SUBSTRING(material_id, 7, 1)) % 23) * 10))::NUMERIC,
  -- Demand rate: 0.5 to 5.0 units per day
  demand_rate = ((ASCII(SUBSTRING(material_id, 8, 1)) % 45) + 5)::NUMERIC / 10.0
WHERE period_month = 11 AND period_year = 2025;

-- Recalculate turnover_ratio based on new values
-- turnover_ratio = consumption_quantity / average_inventory
UPDATE material_inventory_turnover
SET 
  turnover_ratio = ROUND((consumption_quantity / NULLIF(average_inventory, 0))::NUMERIC, 2),
  turnover_days = ROUND((365.0 / (consumption_quantity / NULLIF(average_inventory, 0)))::NUMERIC, 1)
WHERE period_month = 11 AND period_year = 2025 AND average_inventory > 0;

-- Update status based on turnover_ratio
-- Target ratio is 2.5x per year
UPDATE material_inventory_turnover
SET status = CASE
  WHEN turnover_ratio < 1.5 THEN 'critical'
  WHEN turnover_ratio < 2.0 THEN 'warning'
  ELSE 'normal'
END
WHERE period_month = 11 AND period_year = 2025;
