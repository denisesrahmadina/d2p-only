/*
  # Create Cross-Metric Unified Views for Reporting

  ## Overview
  Creates database views that combine procurement savings, sourcing speed, and OTIF metrics
  for comprehensive reporting and dashboard visualization.

  ## Views Created
  1. `view_procurement_unified_metrics` - All three metrics per contract
  2. `view_category_performance_summary` - Aggregated by main category
  3. `view_supplier_comprehensive_scorecard` - Supplier performance across all metrics
  4. `view_monthly_performance_trends` - Time-series data for trending
  5. `view_business_unit_performance` - Performance by business unit

  ## Usage
  These views enable the Reporting page to display comprehensive analytics
  across all procurement metrics simultaneously.
*/

-- 1. Unified Contract Metrics View
CREATE OR REPLACE VIEW view_procurement_unified_metrics AS
SELECT
  psc.contract_id,
  psc.contract_name,
  psc.supplier_name,
  psc.main_category,
  psc.sub_category,
  psc.business_unit,
  psc.award_date,

  -- Procurement Savings Metrics
  psc.owner_estimate,
  psc.final_contract_value,
  psc.savings_amount,
  psc.savings_percentage,
  psc.contract_status,

  -- Sourcing Speed Metrics
  ss.request_date,
  ss.sourcing_duration_days,
  ss.status as sourcing_status,
  ss.current_process,

  -- OTIF Summary Metrics (aggregated from deliveries)
  COUNT(otif.id) FILTER (WHERE otif.delivery_status = 'delivered') as total_deliveries,
  COUNT(otif.id) FILTER (WHERE otif.is_otif = true) as otif_deliveries,
  ROUND(
    (COUNT(otif.id) FILTER (WHERE otif.is_otif = true)::numeric /
     NULLIF(COUNT(otif.id) FILTER (WHERE otif.delivery_status = 'delivered'), 0) * 100), 2
  ) as otif_percentage,
  ROUND(AVG(otif.delay_days) FILTER (WHERE otif.delay_days > 0), 2) as avg_delay_days,

  psc.organization_id,
  psc.created_at
FROM fact_procurement_savings_contract psc
LEFT JOIN procurement_sourcing_contracts ss
  ON psc.contract_id = ss.contract_number
LEFT JOIN supplier_otif_deliveries otif
  ON otif.purchase_order_id LIKE psc.contract_id || '%'
WHERE psc.organization_id = 'ORG001'
GROUP BY
  psc.contract_id, psc.contract_name, psc.supplier_name, psc.main_category,
  psc.sub_category, psc.business_unit, psc.award_date, psc.owner_estimate,
  psc.final_contract_value, psc.savings_amount, psc.savings_percentage,
  psc.contract_status, ss.request_date, ss.sourcing_duration_days,
  ss.status, ss.current_process, psc.organization_id, psc.created_at;

-- 2. Category Performance Summary View
CREATE OR REPLACE VIEW view_category_performance_summary AS
SELECT
  cat.main_category_code,
  cat.main_category_name,

  -- Contract Counts
  COUNT(DISTINCT psc.contract_id) as total_contracts,
  COUNT(DISTINCT psc.contract_id) FILTER (WHERE psc.contract_status = 'Finalized') as finalized_contracts,

  -- Procurement Savings Metrics
  SUM(psc.savings_amount) FILTER (WHERE psc.contract_status = 'Finalized') as total_savings,
  ROUND(AVG(psc.savings_percentage) FILTER (WHERE psc.contract_status = 'Finalized'), 2) as avg_savings_percentage,
  cat.target_savings_percentage as target_savings_percentage,

  -- Sourcing Speed Metrics
  ROUND(AVG(ss.sourcing_duration_days) FILTER (WHERE ss.status = 'Completed'), 2) as avg_sourcing_days,
  MIN(cat.typical_sourcing_days_min) as target_sourcing_days_min,
  MAX(cat.typical_sourcing_days_max) as target_sourcing_days_max,

  -- OTIF Metrics
  COUNT(otif.id) FILTER (WHERE otif.delivery_status = 'delivered') as total_deliveries,
  ROUND(
    (COUNT(otif.id) FILTER (WHERE otif.is_otif = true)::numeric /
     NULLIF(COUNT(otif.id) FILTER (WHERE otif.delivery_status = 'delivered'), 0) * 100), 2
  ) as otif_percentage,

  psc.organization_id
FROM ref_procurement_categories cat
LEFT JOIN fact_procurement_savings_contract psc
  ON cat.main_category_code = psc.main_category
  AND cat.organization_id = psc.organization_id
LEFT JOIN procurement_sourcing_contracts ss
  ON psc.contract_id = ss.contract_number
LEFT JOIN supplier_otif_deliveries otif
  ON otif.main_category = cat.main_category_code
  AND otif.organization_id = cat.organization_id
WHERE cat.organization_id = 'ORG001'
GROUP BY
  cat.main_category_code, cat.main_category_name,
  cat.target_savings_percentage, psc.organization_id
ORDER BY cat.main_category_code;

-- 3. Supplier Comprehensive Scorecard View
CREATE OR REPLACE VIEW view_supplier_comprehensive_scorecard AS
SELECT
  psc.supplier_name,

  -- Contract Information
  COUNT(DISTINCT psc.contract_id) as total_contracts,
  SUM(psc.final_contract_value) as total_contract_value,

  -- Savings Performance
  SUM(psc.savings_amount) FILTER (WHERE psc.contract_status = 'Finalized') as total_savings,
  ROUND(AVG(psc.savings_percentage) FILTER (WHERE psc.contract_status = 'Finalized'), 2) as avg_savings_percentage,

  -- Sourcing Speed Performance
  ROUND(AVG(ss.sourcing_duration_days) FILTER (WHERE ss.status = 'Completed'), 2) as avg_sourcing_days,
  COUNT(DISTINCT ss.contract_number) FILTER (WHERE ss.status = 'Completed') as completed_sourcing_count,

  -- OTIF Performance
  perf.total_deliveries,
  perf.otif_percentage,
  perf.on_time_percentage,
  perf.in_full_percentage,
  perf.supplier_tier,

  -- Categories served
  STRING_AGG(DISTINCT psc.main_category, ', ' ORDER BY psc.main_category) as categories_served,

  psc.organization_id
FROM fact_procurement_savings_contract psc
LEFT JOIN procurement_sourcing_contracts ss
  ON psc.contract_id = ss.contract_number
LEFT JOIN LATERAL (
    SELECT
      supplier_name,
      SUM(total_deliveries) as total_deliveries,
      ROUND(AVG(otif_percentage), 2) as otif_percentage,
      ROUND(AVG(on_time_percentage), 2) as on_time_percentage,
      ROUND(AVG(in_full_percentage), 2) as in_full_percentage,
      MODE() WITHIN GROUP (ORDER BY supplier_tier) as supplier_tier
    FROM supplier_otif_performance
    WHERE supplier_name = psc.supplier_name
    GROUP BY supplier_name
  ) perf ON true
WHERE psc.organization_id = 'ORG001'
GROUP BY
  psc.supplier_name, perf.total_deliveries, perf.otif_percentage,
  perf.on_time_percentage, perf.in_full_percentage,
  perf.supplier_tier, psc.organization_id
ORDER BY total_contract_value DESC;

-- 4. Monthly Performance Trends View
CREATE OR REPLACE VIEW view_monthly_performance_trends AS
SELECT
  DATE_TRUNC('month', psc.award_date)::date as month_date,
  TO_CHAR(psc.award_date, 'YYYY-MM') as month_key,
  TO_CHAR(psc.award_date, 'Mon YYYY') as month_label,

  -- Contract Volume
  COUNT(DISTINCT psc.contract_id) as contracts_awarded,

  -- Savings Metrics
  SUM(psc.savings_amount) FILTER (WHERE psc.contract_status IN ('Finalized', 'Completed')) as monthly_savings,
  ROUND(AVG(psc.savings_percentage) FILTER (WHERE psc.contract_status IN ('Finalized', 'Completed')), 2) as avg_savings_percentage,

  -- Sourcing Speed Metrics
  ROUND(AVG(ss.sourcing_duration_days) FILTER (WHERE ss.status = 'Completed'), 2) as avg_sourcing_days,
  COUNT(DISTINCT ss.contract_number) FILTER (WHERE ss.status = 'Completed') as completed_sourcing,

  -- OTIF Metrics (for deliveries in that month)
  COUNT(otif.id) FILTER (WHERE otif.delivery_status = 'delivered'
    AND DATE_TRUNC('month', otif.actual_delivery_date) = DATE_TRUNC('month', psc.award_date)) as deliveries_completed,
  ROUND(
    (COUNT(otif.id) FILTER (WHERE otif.is_otif = true
      AND otif.delivery_status = 'delivered'
      AND DATE_TRUNC('month', otif.actual_delivery_date) = DATE_TRUNC('month', psc.award_date))::numeric /
     NULLIF(COUNT(otif.id) FILTER (WHERE otif.delivery_status = 'delivered'
      AND DATE_TRUNC('month', otif.actual_delivery_date) = DATE_TRUNC('month', psc.award_date)), 0) * 100), 2
  ) as monthly_otif_percentage,

  psc.organization_id
FROM fact_procurement_savings_contract psc
LEFT JOIN procurement_sourcing_contracts ss
  ON psc.contract_id = ss.contract_number
LEFT JOIN supplier_otif_deliveries otif
  ON otif.purchase_order_id LIKE psc.contract_id || '%'
WHERE psc.organization_id = 'ORG001'
  AND psc.award_date >= '2023-11-01'
GROUP BY DATE_TRUNC('month', psc.award_date), TO_CHAR(psc.award_date, 'YYYY-MM'),
         TO_CHAR(psc.award_date, 'Mon YYYY'), psc.organization_id
ORDER BY month_date;

-- 5. Business Unit Performance View
CREATE OR REPLACE VIEW view_business_unit_performance AS
SELECT
  psc.business_unit,

  -- Contract Metrics
  COUNT(DISTINCT psc.contract_id) as total_contracts,
  SUM(psc.final_contract_value) as total_contract_value,

  -- Savings Performance
  SUM(psc.savings_amount) FILTER (WHERE psc.contract_status = 'Finalized') as total_savings,
  ROUND(AVG(psc.savings_percentage) FILTER (WHERE psc.contract_status = 'Finalized'), 2) as avg_savings_percentage,

  -- Sourcing Efficiency
  ROUND(AVG(ss.sourcing_duration_days) FILTER (WHERE ss.status = 'Completed'), 2) as avg_sourcing_days,

  -- OTIF Performance
  COUNT(otif.id) FILTER (WHERE otif.delivery_status = 'delivered') as total_deliveries,
  ROUND(
    (COUNT(otif.id) FILTER (WHERE otif.is_otif = true)::numeric /
     NULLIF(COUNT(otif.id) FILTER (WHERE otif.delivery_status = 'delivered'), 0) * 100), 2
  ) as otif_percentage,

  -- Category Distribution
  STRING_AGG(DISTINCT psc.main_category, ', ' ORDER BY psc.main_category) as categories,

  psc.organization_id
FROM fact_procurement_savings_contract psc
LEFT JOIN procurement_sourcing_contracts ss
  ON psc.contract_id = ss.contract_number
LEFT JOIN supplier_otif_deliveries otif
  ON otif.purchase_order_id LIKE psc.contract_id || '%'
WHERE psc.organization_id = 'ORG001'
GROUP BY psc.business_unit, psc.organization_id
ORDER BY total_contract_value DESC;

-- Grant SELECT permissions on views
GRANT SELECT ON view_procurement_unified_metrics TO anon, authenticated;
GRANT SELECT ON view_category_performance_summary TO anon, authenticated;
GRANT SELECT ON view_supplier_comprehensive_scorecard TO anon, authenticated;
GRANT SELECT ON view_monthly_performance_trends TO anon, authenticated;
GRANT SELECT ON view_business_unit_performance TO anon, authenticated;

-- Create helpful comments on views
COMMENT ON VIEW view_procurement_unified_metrics IS 'Unified view combining savings, sourcing speed, and OTIF metrics per contract';
COMMENT ON VIEW view_category_performance_summary IS 'Performance metrics aggregated by main procurement category (A-F)';
COMMENT ON VIEW view_supplier_comprehensive_scorecard IS 'Comprehensive supplier performance across all three metrics';
COMMENT ON VIEW view_monthly_performance_trends IS 'Monthly time-series data for trending analysis';
COMMENT ON VIEW view_business_unit_performance IS 'Performance metrics by business unit/power plant';

-- Verification queries
DO $$
DECLARE
  unified_count INTEGER;
  category_count INTEGER;
  supplier_count INTEGER;
  monthly_count INTEGER;
  business_unit_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO unified_count FROM view_procurement_unified_metrics;
  SELECT COUNT(*) INTO category_count FROM view_category_performance_summary;
  SELECT COUNT(*) INTO supplier_count FROM view_supplier_comprehensive_scorecard;
  SELECT COUNT(*) INTO monthly_count FROM view_monthly_performance_trends;
  SELECT COUNT(*) INTO business_unit_count FROM view_business_unit_performance;

  RAISE NOTICE '=== Cross-Metric Views Created ===';
  RAISE NOTICE 'Unified Metrics View: % contracts', unified_count;
  RAISE NOTICE 'Category Summary: % categories', category_count;
  RAISE NOTICE 'Supplier Scorecard: % suppliers', supplier_count;
  RAISE NOTICE 'Monthly Trends: % months', monthly_count;
  RAISE NOTICE 'Business Unit Performance: % units', business_unit_count;
END $$;
