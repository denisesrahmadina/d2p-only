/*
  # Update Inventory Turn Over Formula

  1. Changes
    - Add `consumption_rate_per_period` column to store consumption rate per period
    - Add `average_inventory` column to store average inventory per period
    - Add `period_months` column to store the calculation period in months
    - Update existing records with calculated values based on new formula
    - Modify indexes to optimize queries with new columns

  2. Formula Change
    - Old: turnover_days = stock_quantity / demand_rate
    - New: turnover_ratio = consumption_rate_per_period / average_inventory
    - turnover_days represents days of inventory coverage

  3. Notes
    - Keeping demand_rate for backward compatibility
    - New formula: Consumption Rate per Period ÷ Average Inventory per Period
    - Default period is 1 month (30 days)
*/

-- Add new columns to material_inventory_turnover table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'material_inventory_turnover' AND column_name = 'consumption_rate_per_period'
  ) THEN
    ALTER TABLE material_inventory_turnover
    ADD COLUMN consumption_rate_per_period NUMERIC(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'material_inventory_turnover' AND column_name = 'average_inventory'
  ) THEN
    ALTER TABLE material_inventory_turnover
    ADD COLUMN average_inventory NUMERIC(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'material_inventory_turnover' AND column_name = 'period_months'
  ) THEN
    ALTER TABLE material_inventory_turnover
    ADD COLUMN period_months INTEGER DEFAULT 1;
  END IF;
END $$;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_material_inventory_turnover_period ON material_inventory_turnover(period_months);
CREATE INDEX IF NOT EXISTS idx_material_inventory_turnover_consumption ON material_inventory_turnover(consumption_rate_per_period);

-- Update existing records with calculated values based on new formula
-- Formula: consumption_rate_per_period = demand_rate * (period_months * 30)
-- average_inventory = stock_quantity (as a starting point)
UPDATE material_inventory_turnover
SET
  consumption_rate_per_period = demand_rate * 30,  -- Convert daily demand to monthly
  average_inventory = stock_quantity,
  period_months = 1
WHERE consumption_rate_per_period = 0 OR average_inventory = 0;

-- Add comment to the table explaining the new formula
COMMENT ON COLUMN material_inventory_turnover.consumption_rate_per_period IS 'Total consumption during the period (units consumed per period)';
COMMENT ON COLUMN material_inventory_turnover.average_inventory IS 'Average inventory level during the period';
COMMENT ON COLUMN material_inventory_turnover.period_months IS 'Calculation period in months (1, 3, 6, or 12)';
COMMENT ON COLUMN material_inventory_turnover.turnover_days IS 'Inventory turnover in days - calculated as (average_inventory / consumption_rate_per_period) * (period_months * 30)';
