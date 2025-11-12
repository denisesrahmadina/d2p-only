/*
  # Add Health Index to Unit Locations

  1. Changes
    - Add `health_index` column to `unit_locations` table
    - Add `category` column to store unit category/region
    - Populate with realistic sample health index scores (60-98 range)
  
  2. Notes
    - Health index represents overall performance metric
    - Scores: Excellent (85-100), Good (70-84.9), Needs Attention (<70)
*/

-- Add health_index column
ALTER TABLE unit_locations 
ADD COLUMN IF NOT EXISTS health_index NUMERIC(5,2) DEFAULT 85.00;

-- Add category column
ALTER TABLE unit_locations 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Power Generation';

-- Update with sample health index scores and categories
UPDATE unit_locations SET health_index = 92.5, category = 'Corporate' WHERE type = 'HEAD OFFICE';
UPDATE unit_locations SET health_index = 88.3, category = 'Power Generation' WHERE name = 'UBP ADP';
UPDATE unit_locations SET health_index = 91.7, category = 'Power Generation' WHERE name = 'UBP ASM';
UPDATE unit_locations SET health_index = 76.4, category = 'Power Generation' WHERE name = 'UBP BEU';
UPDATE unit_locations SET health_index = 85.9, category = 'Power Generation' WHERE name = 'UBP BKL';
UPDATE unit_locations SET health_index = 94.2, category = 'Power Generation' WHERE name = 'UBP BLW';
UPDATE unit_locations SET health_index = 68.5, category = 'Power Generation' WHERE name = 'UBP BTG';
UPDATE unit_locations SET health_index = 87.1, category = 'Power Generation' WHERE name = 'UBP BTN';
UPDATE unit_locations SET health_index = 79.3, category = 'Power Generation' WHERE name = 'UBP GRT';
UPDATE unit_locations SET health_index = 90.6, category = 'Power Generation' WHERE name = 'UBP JRH';
UPDATE unit_locations SET health_index = 73.8, category = 'Power Generation' WHERE name = 'UBP KMJ';
UPDATE unit_locations SET health_index = 86.4, category = 'Power Generation' WHERE name = 'UBP KRY';
UPDATE unit_locations SET health_index = 95.1, category = 'Power Generation' WHERE name = 'UBP KTG';
UPDATE unit_locations SET health_index = 82.7, category = 'Power Generation' WHERE name = 'UBP LBH';
UPDATE unit_locations SET health_index = 89.9, category = 'Power Generation' WHERE name = 'UBP MKS';
UPDATE unit_locations SET health_index = 77.2, category = 'Power Generation' WHERE name = 'UBP MLY';
UPDATE unit_locations SET health_index = 84.5, category = 'Power Generation' WHERE name = 'UBP MNG';
UPDATE unit_locations SET health_index = 91.3, category = 'Power Generation' WHERE name = 'UBP MPL';
UPDATE unit_locations SET health_index = 66.8, category = 'Power Generation' WHERE name = 'UBP MSK';
UPDATE unit_locations SET health_index = 88.7, category = 'Power Generation' WHERE name = 'UBP MTR';
UPDATE unit_locations SET health_index = 93.4, category = 'Power Generation' WHERE name = 'UBP PBL';
UPDATE unit_locations SET health_index = 75.6, category = 'Power Generation' WHERE name = 'UBP PBR';
UPDATE unit_locations SET health_index = 87.8, category = 'Power Generation' WHERE name = 'UBP PJG';
UPDATE unit_locations SET health_index = 81.9, category = 'Power Generation' WHERE name = 'UBP PLM';
UPDATE unit_locations SET health_index = 89.2, category = 'Power Generation' WHERE name = 'UBP PMK';
UPDATE unit_locations SET health_index = 72.4, category = 'Power Generation' WHERE name = 'UBP PRP';
UPDATE unit_locations SET health_index = 85.1, category = 'Power Generation' WHERE name = 'UBP SAM';
UPDATE unit_locations SET health_index = 90.8, category = 'Power Generation' WHERE name = 'UBP SBY';
UPDATE unit_locations SET health_index = 78.5, category = 'Power Generation' WHERE name = 'UBP SBL';
UPDATE unit_locations SET health_index = 86.9, category = 'Power Generation' WHERE name = 'UBP SWJ';
UPDATE unit_locations SET health_index = 92.6, category = 'Power Generation' WHERE name = 'UBP TJB';
UPDATE unit_locations SET health_index = 74.3, category = 'Power Generation' WHERE name = 'UBP TNK';
UPDATE unit_locations SET health_index = 88.1, category = 'Power Generation' WHERE name = 'UBP TRG';

-- Set default for any remaining records
UPDATE unit_locations SET health_index = 80.0 WHERE health_index IS NULL;
UPDATE unit_locations SET category = 'Power Generation' WHERE category IS NULL;
