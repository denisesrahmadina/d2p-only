/*
  # Update Inventory Turnover Formula and Structure

  1. Changes to material_inventory_turnover table
    - Add period_month and period_year columns for time-based analysis
    - Add consumption_quantity column (consumption rate per period)
    - Add average_inventory column (average inventory per period)
    - Update turnover calculation to: Consumption Rate / Average Inventory
    - Remove turnover_days (replaced with turnover_ratio)
    - Add period-based indexing

  2. Formula Change
    - OLD: turnover_days = stock_quantity / demand_rate
    - NEW: turnover_ratio = consumption_quantity / average_inventory
    - Higher ratio = better performance (faster inventory movement)

  3. Notes
    - Period is now adjustable by month/year
    - Turnover ratio is dimensionless (times per period)
    - Status thresholds adjusted for new formula
*/

-- Add new columns to material_inventory_turnover table
ALTER TABLE material_inventory_turnover
ADD COLUMN IF NOT EXISTS period_month INTEGER CHECK (period_month BETWEEN 1 AND 12),
ADD COLUMN IF NOT EXISTS period_year INTEGER CHECK (period_year >= 2024),
ADD COLUMN IF NOT EXISTS consumption_quantity NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_inventory NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS turnover_ratio NUMERIC(8,4) DEFAULT 0;

-- Update comment for turnover_days to mark as deprecated
COMMENT ON COLUMN material_inventory_turnover.turnover_days IS 'DEPRECATED: Use turnover_ratio instead. Formula: consumption_quantity / average_inventory';

-- Create index for period-based queries
CREATE INDEX IF NOT EXISTS idx_material_inventory_turnover_period
ON material_inventory_turnover(period_year, period_month);

-- Create index for turnover_ratio
CREATE INDEX IF NOT EXISTS idx_material_inventory_turnover_ratio
ON material_inventory_turnover(turnover_ratio);

-- Update critical_materials threshold to use ratio instead of days
ALTER TABLE critical_materials
ADD COLUMN IF NOT EXISTS threshold_turnover_ratio NUMERIC(6,2) DEFAULT 2.00;

COMMENT ON COLUMN critical_materials.threshold_turnover_ratio IS 'Minimum acceptable turnover ratio. Higher is better. Typical ranges: >3=Good, 2-3=Normal, 1-2=Warning, <1=Critical';
