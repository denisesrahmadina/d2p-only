-- Populate monthly savings data for 2025 by category
-- This creates monthly records with planned and actual savings

-- For each category, insert 12 months of data
DO $$
DECLARE
  cat_rec RECORD;
  month_idx integer;
  ytd_actual numeric;
BEGIN
  -- Loop through each category target
  FOR cat_rec IN 
    SELECT 
      main_category_code,
      yearly_target_amount,
      ARRAY[jan_planned, feb_planned, mar_planned, apr_planned, may_planned, jun_planned,
            jul_planned, aug_planned, sep_planned, oct_planned, nov_planned, dec_planned] as monthly_plans
    FROM fact_procurement_yearly_savings_target
    WHERE year = 2025 AND organization_id = 'ORG001' AND main_category_code IS NOT NULL
  LOOP
    ytd_actual := 0;
    
    -- Insert 12 months for this category
    FOR month_idx IN 1..12 LOOP
      -- Calculate actual savings from contracts for this month and category
      SELECT COALESCE(SUM(savings_amount), 0) INTO ytd_actual
      FROM fact_procurement_savings_contract
      WHERE EXTRACT(YEAR FROM award_date) = 2025
        AND EXTRACT(MONTH FROM award_date) <= month_idx
        AND main_category_code = cat_rec.main_category_code
        AND organization_id = 'ORG001';
      
      -- Insert or update the monthly record
      INSERT INTO fact_procurement_savings_monthly (
        year, month, month_name, organization_id, main_category_code,
        actual_savings, monthly_planned_savings, yearly_target_amount,
        cumulative_ytd_savings, achievement_percentage, contracts_finalized, projected_savings
      )
      SELECT
        2025,
        month_idx,
        CASE month_idx
          WHEN 1 THEN 'Jan' WHEN 2 THEN 'Feb' WHEN 3 THEN 'Mar'
          WHEN 4 THEN 'Apr' WHEN 5 THEN 'May' WHEN 6 THEN 'Jun'
          WHEN 7 THEN 'Jul' WHEN 8 THEN 'Aug' WHEN 9 THEN 'Sep'
          WHEN 10 THEN 'Oct' WHEN 11 THEN 'Nov' WHEN 12 THEN 'Dec'
        END,
        'ORG001',
        cat_rec.main_category_code,
        COALESCE(
          (SELECT SUM(savings_amount)
           FROM fact_procurement_savings_contract
           WHERE EXTRACT(YEAR FROM award_date) = 2025
             AND EXTRACT(MONTH FROM award_date) = month_idx
             AND main_category_code = cat_rec.main_category_code
             AND organization_id = 'ORG001'),
          0
        ),
        cat_rec.monthly_plans[month_idx],
        cat_rec.yearly_target_amount,
        ytd_actual,
        CASE
          WHEN cat_rec.monthly_plans[month_idx] > 0
          THEN (COALESCE(
            (SELECT SUM(savings_amount)
             FROM fact_procurement_savings_contract
             WHERE EXTRACT(YEAR FROM award_date) = 2025
               AND EXTRACT(MONTH FROM award_date) = month_idx
               AND main_category_code = cat_rec.main_category_code
               AND organization_id = 'ORG001'),
            0
          ) / cat_rec.monthly_plans[month_idx]) * 100
          ELSE 0
        END,
        (SELECT COUNT(*)
         FROM fact_procurement_savings_contract
         WHERE EXTRACT(YEAR FROM award_date) = 2025
           AND EXTRACT(MONTH FROM award_date) = month_idx
           AND main_category_code = cat_rec.main_category_code
           AND organization_id = 'ORG001'),
        cat_rec.monthly_plans[month_idx]
      ON CONFLICT (year, month, organization_id) 
      WHERE main_category_code = cat_rec.main_category_code
      DO UPDATE SET
        actual_savings = EXCLUDED.actual_savings,
        monthly_planned_savings = EXCLUDED.monthly_planned_savings,
        yearly_target_amount = EXCLUDED.yearly_target_amount,
        cumulative_ytd_savings = EXCLUDED.cumulative_ytd_savings,
        achievement_percentage = EXCLUDED.achievement_percentage,
        contracts_finalized = EXCLUDED.contracts_finalized,
        projected_savings = EXCLUDED.projected_savings;
    END LOOP;
  END LOOP;
END $$;
