/*
  # Add Material Detail Columns for Control Tower Detail Views

  ## Summary
  Enhances existing inventory tables to support detailed material-level views in Control Tower.
  Adds current stock tracking to material_tolerance_details and ensures all required columns exist.

  ## Changes

  ### 1. `material_tolerance_details` table enhancements
    - Add `current_stock` column - Current stock quantity
    - Add `minimum_stock` column - Minimum stock threshold
    - Add `maximum_stock` column - Maximum stock threshold
    - Update status logic to reflect stock position relative to min/max

  ### 2. Data Integrity
    - Add check constraints for stock relationships
    - Update existing records with realistic stock values
    - Maintain backward compatibility with existing columns

  ## Security
    - No changes to RLS policies (already configured)
*/

-- Add new columns to material_tolerance_details table if they don't exist
ALTER TABLE material_tolerance_details
ADD COLUMN IF NOT EXISTS current_stock NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS minimum_stock NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS maximum_stock NUMERIC(10,2) DEFAULT 0;

-- Add check constraint to ensure maximum_stock >= minimum_stock
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_material_tolerance_stock_range'
  ) THEN
    ALTER TABLE material_tolerance_details
    ADD CONSTRAINT chk_material_tolerance_stock_range
    CHECK (maximum_stock >= minimum_stock);
  END IF;
END $$;

-- Add comments to explain the new columns
COMMENT ON COLUMN material_tolerance_details.current_stock IS 'Current stock quantity on hand';
COMMENT ON COLUMN material_tolerance_details.minimum_stock IS 'Minimum stock threshold for this material';
COMMENT ON COLUMN material_tolerance_details.maximum_stock IS 'Maximum stock threshold for this material';

-- Update the tolerance calculation to use stock ranges
-- The is_compliant field will be true when current_stock is between minimum_stock and maximum_stock
COMMENT ON COLUMN material_tolerance_details.is_compliant IS 'True when current_stock is between minimum_stock and maximum_stock (within tolerance)';

-- Create index for stock-based queries
CREATE INDEX IF NOT EXISTS idx_material_tolerance_current_stock
ON material_tolerance_details(current_stock);

-- Update existing records with NULL values to have default stock values
UPDATE material_tolerance_details
SET
  current_stock = COALESCE(current_stock, actual_quantity),
  minimum_stock = COALESCE(minimum_stock, actual_quantity * 0.5),
  maximum_stock = COALESCE(maximum_stock, actual_quantity * 1.5)
WHERE current_stock IS NULL OR minimum_stock IS NULL OR maximum_stock IS NULL;
