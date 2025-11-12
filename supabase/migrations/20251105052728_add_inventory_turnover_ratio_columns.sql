/*
  # Add Inventory Turnover Ratio Columns

  1. Changes to material_inventory_turnover table
    - Add period_month and period_year columns for time-based analysis
    - Add consumption_quantity column (consumption rate per period)
    - Add average_inventory column (average inventory per period)
    - Add turnover_ratio column (consumption_quantity / average_inventory)
    - Add period-based indexing for efficient queries

  2. Formula
    - Turnover Ratio = Consumption Quantity / Average Inventory
    - Higher ratio = better performance (faster inventory movement)
    - Typical ranges: ≥3.0 = Excellent, 2.0-3.0 = Good, <2.0 = Needs Attention

  3. Security
    - No changes to RLS policies (already configured)
*/

-- Add new columns to material_inventory_turnover table
ALTER TABLE material_inventory_turnover
ADD COLUMN IF NOT EXISTS period_month INTEGER CHECK (period_month BETWEEN 1 AND 12),
ADD COLUMN IF NOT EXISTS period_year INTEGER CHECK (period_year >= 2024),
ADD COLUMN IF NOT EXISTS consumption_quantity NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_inventory NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS turnover_ratio NUMERIC(8,4) DEFAULT 0;

-- Create indexes for period-based queries
CREATE INDEX IF NOT EXISTS idx_material_inventory_turnover_period
ON material_inventory_turnover(period_year, period_month);

CREATE INDEX IF NOT EXISTS idx_material_inventory_turnover_ratio
ON material_inventory_turnover(turnover_ratio);

-- Update critical_materials table to include turnover ratio threshold
ALTER TABLE critical_materials
ADD COLUMN IF NOT EXISTS threshold_turnover_ratio NUMERIC(6,2) DEFAULT 2.00;

-- Add comments to explain the new columns
COMMENT ON COLUMN material_inventory_turnover.period_month IS 'Month of the measurement period (1-12)';
COMMENT ON COLUMN material_inventory_turnover.period_year IS 'Year of the measurement period';
COMMENT ON COLUMN material_inventory_turnover.consumption_quantity IS 'Total quantity consumed during the period';
COMMENT ON COLUMN material_inventory_turnover.average_inventory IS 'Average inventory level during the period';
COMMENT ON COLUMN material_inventory_turnover.turnover_ratio IS 'Inventory turnover ratio (consumption_quantity / average_inventory). Higher is better.';
COMMENT ON COLUMN material_inventory_turnover.turnover_days IS 'DEPRECATED: Legacy field kept for backward compatibility';
COMMENT ON COLUMN critical_materials.threshold_turnover_ratio IS 'Minimum acceptable turnover ratio. Typical: ≥3.0=Excellent, 2.0-3.0=Good, <2.0=Needs Attention';
