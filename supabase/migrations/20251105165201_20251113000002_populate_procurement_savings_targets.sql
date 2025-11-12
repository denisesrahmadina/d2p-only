/*
  # Populate Procurement Savings Targets and Achievement Data

  ## Overview
  Populates comprehensive target and achievement data for 2025 showing:
  - Category A: Below Target (70% achievement)
  - Category B: Near Target (85% achievement)
  - Category C: On Target (95% achievement)
  - Category D: On Target (102% achievement)
  - Category E: Above Target (115% achievement)
  - Category F: Above Target (120% achievement)

  ## Data Structure
  - Yearly targets for all 6 categories
  - Monthly targets (evenly distributed)
  - YTD achievement data through November 2025
*/

-- Insert 2025 targets for all categories
INSERT INTO ref_procurement_savings_targets (
  organization_id, year, main_category_code, category_name, yearly_target_amount,
  monthly_targets, threshold_below, threshold_near, threshold_on
) VALUES
  -- Category A: Energi Primer (Target: 900B IDR, Actual will be ~630B = 70%)
  ('ORG001', 2025, 'A', 'Energi Primer dan Jasa Penunjangnya', 900000000000,
   jsonb_build_object(
     'Jan', 75000000000, 'Feb', 75000000000, 'Mar', 75000000000, 'Apr', 75000000000,
     'May', 75000000000, 'Jun', 75000000000, 'Jul', 75000000000, 'Aug', 75000000000,
     'Sep', 75000000000, 'Oct', 75000000000, 'Nov', 75000000000, 'Dec', 75000000000
   ), 80.0, 90.0, 100.0),

  -- Category B: Peralatan Penunjang (Target: 175B IDR, Actual will be ~148B = 85%)
  ('ORG001', 2025, 'B', 'Peralatan Penunjang dan Sistem ME', 175000000000,
   jsonb_build_object(
     'Jan', 14583333333, 'Feb', 14583333333, 'Mar', 14583333333, 'Apr', 14583333333,
     'May', 14583333333, 'Jun', 14583333333, 'Jul', 14583333333, 'Aug', 14583333333,
     'Sep', 14583333333, 'Oct', 14583333333, 'Nov', 14583333333, 'Dec', 14583333333
   ), 80.0, 90.0, 100.0),

  -- Category C: Material & Consumables (Target: 28B IDR, Actual will be ~26.8B = 95%)
  ('ORG001', 2025, 'C', 'Material, Consumable, dan General Supply', 28000000000,
   jsonb_build_object(
     'Jan', 2333333333, 'Feb', 2333333333, 'Mar', 2333333333, 'Apr', 2333333333,
     'May', 2333333333, 'Jun', 2333333333, 'Jul', 2333333333, 'Aug', 2333333333,
     'Sep', 2333333333, 'Oct', 2333333333, 'Nov', 2333333333, 'Dec', 2333333333
   ), 80.0, 90.0, 100.0),

  -- Category D: Asset Non-Operasional (Target: 37B IDR, Actual will be ~37.8B = 102%)
  ('ORG001', 2025, 'D', 'Asset Non-Operasional', 37000000000,
   jsonb_build_object(
     'Jan', 3083333333, 'Feb', 3083333333, 'Mar', 3083333333, 'Apr', 3083333333,
     'May', 3083333333, 'Jun', 3083333333, 'Jul', 3083333333, 'Aug', 3083333333,
     'Sep', 3083333333, 'Oct', 3083333333, 'Nov', 3083333333, 'Dec', 3083333333
   ), 80.0, 90.0, 100.0),

  -- Category E: Jasa dan Kontrak (Target: 6B IDR, Actual will be ~6.96B = 116%)
  ('ORG001', 2025, 'E', 'Jasa dan Kontrak Pendukung', 6000000000,
   jsonb_build_object(
     'Jan', 500000000, 'Feb', 500000000, 'Mar', 500000000, 'Apr', 500000000,
     'May', 500000000, 'Jun', 500000000, 'Jul', 500000000, 'Aug', 500000000,
     'Sep', 500000000, 'Oct', 500000000, 'Nov', 500000000, 'Dec', 500000000
   ), 80.0, 90.0, 100.0),

  -- Category F: Peralatan Utama (Target: 170B IDR, Actual will be ~203.9B = 120%)
  ('ORG001', 2025, 'F', 'Peralatan Utama Pembangkit', 170000000000,
   jsonb_build_object(
     'Jan', 14166666666, 'Feb', 14166666666, 'Mar', 14166666666, 'Apr', 14166666666,
     'May', 14166666666, 'Jun', 14166666666, 'Jul', 14166666666, 'Aug', 14166666666,
     'Sep', 14166666666, 'Oct', 14166666666, 'Nov', 14166666666, 'Dec', 14166666666
   ), 80.0, 90.0, 100.0);

-- Calculate and insert monthly achievement data for each category
-- We'll distribute the actual savings across months to show progressive achievement

-- Category A: Below Target (70% = 630B actual vs 900B target)
INSERT INTO fact_procurement_savings_achievement (
  organization_id, year, month, main_category_code, actual_savings, target_savings, contract_count
)
SELECT 
  'ORG001',
  2025,
  month_num,
  'A',
  CASE 
    WHEN month_num <= 11 THEN 57272727272  -- ~57.27B per month for 11 months = 630B
    ELSE 0
  END,
  75000000000,  -- Monthly target
  CASE 
    WHEN month_num <= 2 THEN 1
    WHEN month_num <= 11 THEN 0
    ELSE 0
  END
FROM generate_series(1, 11) AS month_num;

-- Category B: Near Target (85% = 148.6B actual vs 175B target)
INSERT INTO fact_procurement_savings_achievement (
  organization_id, year, month, main_category_code, actual_savings, target_savings, contract_count
)
SELECT 
  'ORG001',
  2025,
  month_num,
  'B',
  CASE 
    WHEN month_num <= 11 THEN 13509090909  -- ~13.5B per month for 11 months = 148.6B
    ELSE 0
  END,
  14583333333,  -- Monthly target
  CASE 
    WHEN month_num IN (2, 5, 10) THEN 4
    ELSE 0
  END
FROM generate_series(1, 11) AS month_num;

-- Category C: On Target (95% = 26.8B actual vs 28B target)
INSERT INTO fact_procurement_savings_achievement (
  organization_id, year, month, main_category_code, actual_savings, target_savings, contract_count
)
SELECT 
  'ORG001',
  2025,
  month_num,
  'C',
  CASE 
    WHEN month_num <= 11 THEN 2436363636  -- ~2.43B per month for 11 months = 26.8B
    ELSE 0
  END,
  2333333333,  -- Monthly target
  CASE 
    WHEN month_num IN (1, 3, 6, 9, 11) THEN 2
    WHEN month_num IN (4, 7) THEN 3
    ELSE 1
  END
FROM generate_series(1, 11) AS month_num;

-- Category D: On Target (102% = 37.87B actual vs 37B target)
INSERT INTO fact_procurement_savings_achievement (
  organization_id, year, month, main_category_code, actual_savings, target_savings, contract_count
)
SELECT 
  'ORG001',
  2025,
  month_num,
  'D',
  CASE 
    WHEN month_num <= 11 THEN 3442727272  -- ~3.44B per month for 11 months = 37.87B
    ELSE 0
  END,
  3083333333,  -- Monthly target
  CASE 
    WHEN month_num IN (3, 8) THEN 3
    ELSE 0
  END
FROM generate_series(1, 11) AS month_num;

-- Category E: Above Target (116% = 6.96B actual vs 6B target)
INSERT INTO fact_procurement_savings_achievement (
  organization_id, year, month, main_category_code, actual_savings, target_savings, contract_count
)
SELECT 
  'ORG001',
  2025,
  month_num,
  'E',
  CASE 
    WHEN month_num <= 11 THEN 632727272  -- ~632M per month for 11 months = 6.96B
    ELSE 0
  END,
  500000000,  -- Monthly target
  CASE 
    WHEN month_num IN (1, 4, 7, 9, 11) THEN 2
    WHEN month_num = 2 THEN 1
    ELSE 0
  END
FROM generate_series(1, 11) AS month_num;

-- Category F: Above Target (120% = 203.95B actual vs 170B target)
INSERT INTO fact_procurement_savings_achievement (
  organization_id, year, month, main_category_code, actual_savings, target_savings, contract_count
)
SELECT 
  'ORG001',
  2025,
  month_num,
  'F',
  CASE 
    WHEN month_num <= 11 THEN 18540909090  -- ~18.5B per month for 11 months = 203.95B
    ELSE 0
  END,
  14166666666,  -- Monthly target
  CASE 
    WHEN month_num IN (5, 11) THEN 1
    WHEN month_num IN (2, 8) THEN 2
    ELSE 0
  END
FROM generate_series(1, 11) AS month_num;

-- Create a view for easy querying of current year achievement summary
CREATE OR REPLACE VIEW v_procurement_savings_achievement_summary AS
SELECT 
  a.main_category_code,
  t.category_name,
  t.yearly_target_amount,
  SUM(a.actual_savings) AS ytd_actual_savings,
  (SUM(a.actual_savings) / t.yearly_target_amount * 100) AS ytd_achievement_percentage,
  CASE 
    WHEN (SUM(a.actual_savings) / t.yearly_target_amount * 100) < t.threshold_below THEN 'below_target'
    WHEN (SUM(a.actual_savings) / t.yearly_target_amount * 100) < t.threshold_near THEN 'near_target'
    WHEN (SUM(a.actual_savings) / t.yearly_target_amount * 100) < 110 THEN 'on_target'
    ELSE 'above_target'
  END AS ytd_status,
  COUNT(DISTINCT CASE WHEN a.contract_count > 0 THEN a.month END) AS months_with_contracts,
  SUM(a.contract_count) AS total_contracts,
  t.threshold_below,
  t.threshold_near,
  t.threshold_on
FROM fact_procurement_savings_achievement a
JOIN ref_procurement_savings_targets t 
  ON a.organization_id = t.organization_id 
  AND a.year = t.year 
  AND a.main_category_code = t.main_category_code
WHERE a.organization_id = 'ORG001' AND a.year = 2025
GROUP BY 
  a.main_category_code, 
  t.category_name, 
  t.yearly_target_amount,
  t.threshold_below,
  t.threshold_near,
  t.threshold_on
ORDER BY a.main_category_code;
