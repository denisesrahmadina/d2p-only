/*
  # Update Monthly Savings Data with Target Information

  ## Overview
  Updates existing fact_procurement_savings_monthly records to include:
  - Monthly planned savings amounts from yearly target breakdown
  - Yearly target reference amounts
  - Cumulative year-to-date savings calculations
  - Achievement percentages (actual vs planned)

  ## Process
  1. Match monthly records with yearly target data
  2. Populate monthly_planned_savings from target breakdown
  3. Calculate cumulative YTD savings per month
  4. Compute achievement percentage for each month
  5. Ensure data consistency across all months

  ## Data Quality
  - All existing monthly records are preserved
  - New columns are populated based on target allocations
  - Historical months show actual achievement against targets
  - Future months can be projected based on planned amounts
*/

-- Update monthly savings records with planned amounts from yearly targets (2025 data)

-- January 2025 - Category A
UPDATE fact_procurement_savings_monthly
SET
  monthly_planned_savings = 11000000000,
  yearly_target_amount = 120000000000,
  cumulative_ytd_savings = actual_savings,
  achievement_percentage = CASE
    WHEN 11000000000 > 0 THEN (actual_savings / 11000000000) * 100
    ELSE 0
  END,
  main_category_code = 'A'
WHERE year = 2025 AND month = 1 AND organization_id = 'ORG001'
  AND main_category_code IS NULL;

-- Update all 2025 months with planned savings for each category
-- This uses a more scalable approach with a temporary function

DO $$
DECLARE
  month_data RECORD;
  target_data RECORD;
  ytd_sum numeric;
BEGIN
  -- For each category and month combination in 2025
  FOR target_data IN
    SELECT
      main_category_code,
      yearly_target_amount,
      ARRAY[jan_planned, feb_planned, mar_planned, apr_planned, may_planned, jun_planned,
            jul_planned, aug_planned, sep_planned, oct_planned, nov_planned, dec_planned] as monthly_plans
    FROM fact_procurement_yearly_savings_target
    WHERE year = 2025 AND organization_id = 'ORG001'
      AND main_category_code IS NOT NULL
  LOOP
    ytd_sum := 0;

    -- Update each month (1-12)
    FOR i IN 1..12 LOOP
      -- Get actual savings for this month/category
      SELECT COALESCE(actual_savings, 0) INTO month_data
      FROM fact_procurement_savings_monthly
      WHERE year = 2025
        AND month = i
        AND organization_id = 'ORG001'
        AND (main_category_code = target_data.main_category_code OR main_category_code IS NULL)
      LIMIT 1;

      -- Update cumulative sum
      ytd_sum := ytd_sum + COALESCE(month_data, 0);

      -- Update or insert the monthly record
      INSERT INTO fact_procurement_savings_monthly (
        year, month, month_name, organization_id, main_category_code,
        actual_savings, monthly_planned_savings, yearly_target_amount,
        cumulative_ytd_savings, achievement_percentage,
        contracts_finalized, projected_savings, average_savings_percentage
      )
      SELECT
        2025,
        i,
        CASE i
          WHEN 1 THEN 'Jan' WHEN 2 THEN 'Feb' WHEN 3 THEN 'Mar'
          WHEN 4 THEN 'Apr' WHEN 5 THEN 'May' WHEN 6 THEN 'Jun'
          WHEN 7 THEN 'Jul' WHEN 8 THEN 'Aug' WHEN 9 THEN 'Sep'
          WHEN 10 THEN 'Oct' WHEN 11 THEN 'Nov' WHEN 12 THEN 'Dec'
        END,
        'ORG001',
        target_data.main_category_code,
        COALESCE(
          (SELECT SUM(savings_amount)
           FROM fact_procurement_savings_contract
           WHERE EXTRACT(YEAR FROM award_date) = 2025
             AND EXTRACT(MONTH FROM award_date) = i
             AND main_category_code = target_data.main_category_code
             AND organization_id = 'ORG001'),
          0
        ),
        target_data.monthly_plans[i],
        target_data.yearly_target_amount,
        ytd_sum,
        CASE
          WHEN target_data.monthly_plans[i] > 0
          THEN (ytd_sum / target_data.monthly_plans[i]) * 100
          ELSE 0
        END,
        (SELECT COUNT(*)
         FROM fact_procurement_savings_contract
         WHERE EXTRACT(YEAR FROM award_date) = 2025
           AND EXTRACT(MONTH FROM award_date) = i
           AND main_category_code = target_data.main_category_code
           AND organization_id = 'ORG001'),
        target_data.monthly_plans[i],
        NULL
      ON CONFLICT (year, month, organization_id)
      WHERE main_category_code = target_data.main_category_code
      DO UPDATE SET
        monthly_planned_savings = EXCLUDED.monthly_planned_savings,
        yearly_target_amount = EXCLUDED.yearly_target_amount,
        cumulative_ytd_savings = EXCLUDED.cumulative_ytd_savings,
        achievement_percentage = EXCLUDED.achievement_percentage,
        actual_savings = EXCLUDED.actual_savings,
        contracts_finalized = EXCLUDED.contracts_finalized;
    END LOOP;
  END LOOP;
END $$;

-- Update organization-level aggregated monthly data (all categories combined)
DO $$
DECLARE
  ytd_sum numeric := 0;
  month_actual numeric;
  month_planned numeric;
BEGIN
  FOR i IN 1..12 LOOP
    -- Calculate actual savings for the month across all categories
    SELECT COALESCE(SUM(savings_amount), 0) INTO month_actual
    FROM fact_procurement_savings_contract
    WHERE EXTRACT(YEAR FROM award_date) = 2025
      AND EXTRACT(MONTH FROM award_date) = i
      AND organization_id = 'ORG001';

    -- Get planned savings for the month from overall target
    SELECT
      CASE i
        WHEN 1 THEN jan_planned WHEN 2 THEN feb_planned WHEN 3 THEN mar_planned
        WHEN 4 THEN apr_planned WHEN 5 THEN may_planned WHEN 6 THEN jun_planned
        WHEN 7 THEN jul_planned WHEN 8 THEN aug_planned WHEN 9 THEN sep_planned
        WHEN 10 THEN oct_planned WHEN 11 THEN nov_planned WHEN 12 THEN dec_planned
      END INTO month_planned
    FROM fact_procurement_yearly_savings_target
    WHERE year = 2025
      AND organization_id = 'ORG001'
      AND main_category_code IS NULL;

    ytd_sum := ytd_sum + month_actual;

    -- Insert or update organization-level monthly record
    INSERT INTO fact_procurement_savings_monthly (
      year, month, month_name, organization_id, main_category_code,
      actual_savings, monthly_planned_savings, yearly_target_amount,
      cumulative_ytd_savings, achievement_percentage, contracts_finalized,
      projected_savings
    ) VALUES (
      2025,
      i,
      CASE i
        WHEN 1 THEN 'Jan' WHEN 2 THEN 'Feb' WHEN 3 THEN 'Mar'
        WHEN 4 THEN 'Apr' WHEN 5 THEN 'May' WHEN 6 THEN 'Jun'
        WHEN 7 THEN 'Jul' WHEN 8 THEN 'Aug' WHEN 9 THEN 'Sep'
        WHEN 10 THEN 'Oct' WHEN 11 THEN 'Nov' WHEN 12 THEN 'Dec'
      END,
      'ORG001',
      NULL,
      month_actual,
      month_planned,
      500000000000,
      ytd_sum,
      CASE
        WHEN month_planned > 0 THEN (month_actual / month_planned) * 100
        ELSE 0
      END,
      (SELECT COUNT(*)
       FROM fact_procurement_savings_contract
       WHERE EXTRACT(YEAR FROM award_date) = 2025
         AND EXTRACT(MONTH FROM award_date) = i
         AND organization_id = 'ORG001'),
      month_planned
    )
    ON CONFLICT (year, month, organization_id)
    WHERE main_category_code IS NULL
    DO UPDATE SET
      actual_savings = EXCLUDED.actual_savings,
      monthly_planned_savings = EXCLUDED.monthly_planned_savings,
      yearly_target_amount = EXCLUDED.yearly_target_amount,
      cumulative_ytd_savings = EXCLUDED.cumulative_ytd_savings,
      achievement_percentage = EXCLUDED.achievement_percentage,
      contracts_finalized = EXCLUDED.contracts_finalized,
      projected_savings = EXCLUDED.projected_savings;
  END LOOP;
END $$;

-- Create or refresh a helper function to recalculate monthly data
CREATE OR REPLACE FUNCTION refresh_monthly_savings_data(p_year integer, p_org_id text)
RETURNS void AS $$
DECLARE
  category_rec RECORD;
  ytd_sum numeric;
  month_actual numeric;
BEGIN
  -- Loop through each category
  FOR category_rec IN
    SELECT main_category_code, yearly_target_amount,
           ARRAY[jan_planned, feb_planned, mar_planned, apr_planned, may_planned, jun_planned,
                 jul_planned, aug_planned, sep_planned, oct_planned, nov_planned, dec_planned] as plans
    FROM fact_procurement_yearly_savings_target
    WHERE year = p_year AND organization_id = p_org_id
  LOOP
    ytd_sum := 0;

    -- Update each month
    FOR i IN 1..12 LOOP
      SELECT COALESCE(SUM(savings_amount), 0) INTO month_actual
      FROM fact_procurement_savings_contract
      WHERE EXTRACT(YEAR FROM award_date) = p_year
        AND EXTRACT(MONTH FROM award_date) = i
        AND organization_id = p_org_id
        AND (main_category_code = category_rec.main_category_code
             OR (main_category_code IS NULL AND category_rec.main_category_code IS NULL));

      ytd_sum := ytd_sum + month_actual;

      UPDATE fact_procurement_savings_monthly
      SET
        actual_savings = month_actual,
        monthly_planned_savings = category_rec.plans[i],
        yearly_target_amount = category_rec.yearly_target_amount,
        cumulative_ytd_savings = ytd_sum,
        achievement_percentage = CASE
          WHEN category_rec.plans[i] > 0 THEN (month_actual / category_rec.plans[i]) * 100
          ELSE 0
        END
      WHERE year = p_year
        AND month = i
        AND organization_id = p_org_id
        AND (main_category_code = category_rec.main_category_code
             OR (main_category_code IS NULL AND category_rec.main_category_code IS NULL));
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the refresh for 2025
SELECT refresh_monthly_savings_data(2025, 'ORG001');
