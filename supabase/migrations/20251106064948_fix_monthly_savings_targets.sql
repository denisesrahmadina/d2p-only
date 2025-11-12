/*
  # Fix Monthly Savings Target Values
  
  1. Changes
    - Update monthly_planned_savings to match performance status
    - For "On Target" categories (B, D, F): targets close to actual values (90-95% of actual)
    - For "Below Target" categories (A, C, E): targets higher than actual values (120-130% of actual)
  
  2. Logic
    - Category A (Below Target): Set targets to ~125% of actual
    - Category B (On Target): Set targets to ~92% of actual
    - Category C (Below Target): Set targets to ~128% of actual
    - Category D (On Target): Set targets to ~93% of actual
    - Category E (Below Target): Set targets to ~125% of actual
    - Category F (On Target): Set targets to ~94% of actual
*/

-- Category A: Below Target - targets should be HIGHER
UPDATE fact_procurement_savings_monthly
SET monthly_planned_savings = ROUND(actual_savings * 1.25)
WHERE year = 2025
  AND main_category_code = 'A'
  AND actual_savings > 0;

-- Category B: On Target - targets should be CLOSE (slightly lower)
UPDATE fact_procurement_savings_monthly
SET monthly_planned_savings = ROUND(actual_savings * 0.92)
WHERE year = 2025
  AND main_category_code = 'B'
  AND actual_savings > 0;

-- Category C: Below Target - targets should be HIGHER
UPDATE fact_procurement_savings_monthly
SET monthly_planned_savings = ROUND(actual_savings * 1.28)
WHERE year = 2025
  AND main_category_code = 'C'
  AND actual_savings > 0;

-- Category D: On Target - targets should be CLOSE (slightly lower)
UPDATE fact_procurement_savings_monthly
SET monthly_planned_savings = ROUND(actual_savings * 0.93)
WHERE year = 2025
  AND main_category_code = 'D'
  AND actual_savings > 0;

-- Category E: Below Target - targets should be HIGHER
UPDATE fact_procurement_savings_monthly
SET monthly_planned_savings = ROUND(actual_savings * 1.25)
WHERE year = 2025
  AND main_category_code = 'E'
  AND actual_savings > 0;

-- Category F: On Target - targets should be CLOSE (slightly lower)
UPDATE fact_procurement_savings_monthly
SET monthly_planned_savings = ROUND(actual_savings * 0.94)
WHERE year = 2025
  AND main_category_code = 'F'
  AND actual_savings > 0;

-- For December (month 12) with 0 actual, set reasonable target values
UPDATE fact_procurement_savings_monthly
SET monthly_planned_savings = CASE main_category_code
  WHEN 'A' THEN 120000000000  -- Below Target
  WHEN 'B' THEN 90000000000   -- On Target
  WHEN 'C' THEN 30000000000   -- Below Target
  WHEN 'D' THEN 35000000000   -- On Target
  WHEN 'E' THEN 8000000000    -- Below Target
  WHEN 'F' THEN 180000000000  -- On Target
  ELSE monthly_planned_savings
END
WHERE year = 2025
  AND month = 12
  AND actual_savings = 0;
