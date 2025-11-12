/*
  # Add unit_id column to unit_locations table

  1. Changes
    - Add unit_id VARCHAR(50) column to unit_locations if it doesn't exist
    - Create unique index on unit_id
    - Populate unit_id based on name (extract unit code from name)
    
  2. Purpose
    - Enable proper foreign key relationship with material_inventory_turnover
    - Maintain compatibility with existing inventory turnover data
*/

-- Add unit_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'unit_locations' AND column_name = 'unit_id'
  ) THEN
    ALTER TABLE unit_locations ADD COLUMN unit_id VARCHAR(50);
  END IF;
END $$;

-- Populate unit_id for existing records based on name pattern
UPDATE unit_locations 
SET unit_id = name 
WHERE unit_id IS NULL AND name LIKE 'UBP %';

UPDATE unit_locations 
SET unit_id = 'HO-001' 
WHERE unit_id IS NULL AND type = 'HEAD OFFICE';

-- Create unique index on unit_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_unit_locations_unit_id ON unit_locations(unit_id);
