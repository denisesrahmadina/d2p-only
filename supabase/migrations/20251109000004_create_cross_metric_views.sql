/*
  # Create Unified Analytics Views for Cross-Metric Queries

  1. Views Created
    - v_contracts_savings_by_category: Savings metrics aggregated by category
    - v_contracts_sourcing_by_category: Sourcing speed metrics by category
    - v_supplier_otif_by_category: OTIF performance by category
    - v_category_performance_summary: Complete KPI summary per category

  2. Benefits
    - Single query access to category-level metrics
    - Optimized joins for dashboard performance
    - Consistent calculation logic across UI
    - Easy filtering and aggregation

  3. Important Notes
    - Views refresh automatically with underlying data
    - All monetary values remain in IDR
    - Percentages calculated consistently
    - Null-safe aggregations
*/

-- View 1: Procurement Savings by Category
CREATE OR REPLACE VIEW v_contracts_savings_by_category AS
SELECT
  cat.main_category_code,
  cat.main_category_name_id,
  cat.subcategory_code,
  cat.subcategory_name_id,
  COUNT(DISTINCT psc.contract_id) as contract_count,
  SUM(psc.final_contract_value) as total_contract_value,
  SUM(psc.owner_estimate) as total_owner_estimate,
  SUM(psc.savings_amount) as total_actual_savings,
  AVG(psc.savings_percentage) as avg_savings_percentage,
  MIN(psc.award_date) as earliest_award_date,
  MAX(psc.award_date) as latest_award_date,
  COUNT(DISTINCT psc.supplier_name) as supplier_count,
  cat.target_savings_percentage
FROM fact_procurement_savings_contract psc
INNER JOIN ref_procurement_categories cat ON psc.category_id = cat.id
WHERE psc.contract_status = 'Finalized'
GROUP BY
  cat.main_category_code,
  cat.main_category_name_id,
  cat.subcategory_code,
  cat.subcategory_name_id,
  cat.target_savings_percentage;

-- View 2: Sourcing Speed by Category
CREATE OR REPLACE VIEW v_contracts_sourcing_by_category AS
SELECT
  cat.main_category_code,
  cat.main_category_name_id,
  cat.subcategory_code,
  cat.subcategory_name_id,
  COUNT(DISTINCT sc.contract_number) as contract_count,
  AVG(sc.sourcing_duration_days) as avg_sourcing_days,
  MIN(sc.sourcing_duration_days) as min_sourcing_days,
  MAX(sc.sourcing_duration_days) as max_sourcing_days,
  STDDEV(sc.sourcing_duration_days) as stddev_sourcing_days,
  COUNT(*) FILTER (WHERE sc.sourcing_duration_days <= cat.target_sourcing_days) as within_target_count,
  COUNT(*) FILTER (WHERE sc.sourcing_duration_days > cat.target_sourcing_days) as beyond_target_count,
  AVG(sc.sourcing_duration_days) FILTER (WHERE sc.sourcing_duration_days <= cat.target_sourcing_days) as avg_within_target,
  AVG(sc.sourcing_duration_days) FILTER (WHERE sc.sourcing_duration_days > cat.target_sourcing_days) as avg_beyond_target,
  cat.target_sourcing_days,
  SUM(sc.value_usd * 15000) as total_contract_value_idr,
  COUNT(DISTINCT sc.vendor_name) as supplier_count
FROM procurement_sourcing_contracts sc
INNER JOIN ref_procurement_categories cat ON sc.category_id = cat.id
WHERE sc.status = 'Completed'
GROUP BY
  cat.main_category_code,
  cat.main_category_name_id,
  cat.subcategory_code,
  cat.subcategory_name_id,
  cat.target_sourcing_days;

-- View 3: Supplier OTIF by Category
CREATE OR REPLACE VIEW v_supplier_otif_by_category AS
SELECT
  cat.main_category_code,
  cat.main_category_name_id,
  cat.subcategory_code,
  cat.subcategory_name_id,
  COUNT(DISTINCT od.supplier_id) as supplier_count,
  COUNT(od.id) as total_deliveries,
  COUNT(*) FILTER (WHERE od.is_otif = true) as otif_deliveries,
  COUNT(*) FILTER (WHERE od.is_on_time = true) as on_time_deliveries,
  COUNT(*) FILTER (WHERE od.is_in_full = true) as in_full_deliveries,
  (COUNT(*) FILTER (WHERE od.is_otif = true)::numeric / NULLIF(COUNT(od.id), 0) * 100) as otif_percentage,
  (COUNT(*) FILTER (WHERE od.is_on_time = true)::numeric / NULLIF(COUNT(od.id), 0) * 100) as on_time_percentage,
  (COUNT(*) FILTER (WHERE od.is_in_full = true)::numeric / NULLIF(COUNT(od.id), 0) * 100) as in_full_percentage,
  AVG(od.delay_days) FILTER (WHERE od.delay_days IS NOT NULL) as avg_delay_days,
  SUM(od.contract_value) as total_contract_value,
  cat.target_otif_percentage,
  COUNT(DISTINCT od.supplier_name) FILTER (WHERE
    (SELECT (COUNT(*) FILTER (WHERE is_otif = true)::numeric / NULLIF(COUNT(*), 0) * 100)
     FROM supplier_otif_deliveries
     WHERE supplier_name = od.supplier_name AND main_category_code = cat.main_category_code
    ) >= cat.target_otif_percentage
  ) as suppliers_meeting_target,
  COUNT(DISTINCT od.supplier_name) FILTER (WHERE
    (SELECT (COUNT(*) FILTER (WHERE is_otif = true)::numeric / NULLIF(COUNT(*), 0) * 100)
     FROM supplier_otif_deliveries
     WHERE supplier_name = od.supplier_name AND main_category_code = cat.main_category_code
    ) < cat.target_otif_percentage
  ) as suppliers_below_target
FROM supplier_otif_deliveries od
INNER JOIN ref_procurement_categories cat ON od.category_id = cat.id
WHERE od.delivery_status = 'delivered'
GROUP BY
  cat.main_category_code,
  cat.main_category_name_id,
  cat.subcategory_code,
  cat.subcategory_name_id,
  cat.target_otif_percentage;

-- View 4: Complete Category Performance Summary
CREATE OR REPLACE VIEW v_category_performance_summary AS
SELECT
  cat.main_category_code,
  cat.main_category_name_id,
  cat.main_category_description_id,
  cat.display_order,

  -- Savings Metrics
  COALESCE(sav.contract_count, 0) as savings_contract_count,
  COALESCE(sav.total_actual_savings, 0) as total_savings_amount,
  COALESCE(sav.avg_savings_percentage, 0) as avg_savings_percentage,
  cat.target_savings_percentage,

  -- Sourcing Speed Metrics
  COALESCE(src.contract_count, 0) as sourcing_contract_count,
  COALESCE(src.avg_sourcing_days, 0) as avg_sourcing_days,
  COALESCE(src.within_target_count, 0) as sourcing_within_target,
  COALESCE(src.beyond_target_count, 0) as sourcing_beyond_target,
  cat.target_sourcing_days,

  -- OTIF Metrics
  COALESCE(otif.supplier_count, 0) as otif_supplier_count,
  COALESCE(otif.total_deliveries, 0) as total_deliveries,
  COALESCE(otif.otif_percentage, 0) as otif_percentage,
  COALESCE(otif.suppliers_meeting_target, 0) as suppliers_meeting_otif,
  COALESCE(otif.suppliers_below_target, 0) as suppliers_below_otif,
  cat.target_otif_percentage,

  -- Combined Metrics
  COALESCE(sav.total_contract_value, 0) as total_value_savings,
  COALESCE(src.total_contract_value_idr, 0) as total_value_sourcing,
  COALESCE(otif.total_contract_value, 0) as total_value_otif,

  -- Performance Indicators
  CASE
    WHEN COALESCE(sav.avg_savings_percentage, 0) >= cat.target_savings_percentage THEN 'On Target'
    WHEN COALESCE(sav.avg_savings_percentage, 0) >= cat.target_savings_percentage * 0.9 THEN 'Near Target'
    ELSE 'Below Target'
  END as savings_performance_status,

  CASE
    WHEN COALESCE(src.avg_sourcing_days, 999) <= cat.target_sourcing_days THEN 'On Target'
    WHEN COALESCE(src.avg_sourcing_days, 999) <= cat.target_sourcing_days * 1.1 THEN 'Near Target'
    ELSE 'Below Target'
  END as sourcing_performance_status,

  CASE
    WHEN COALESCE(otif.otif_percentage, 0) >= cat.target_otif_percentage THEN 'On Target'
    WHEN COALESCE(otif.otif_percentage, 0) >= cat.target_otif_percentage * 0.95 THEN 'Near Target'
    ELSE 'Below Target'
  END as otif_performance_status

FROM ref_procurement_categories cat
LEFT JOIN (
  SELECT
    main_category_code,
    COUNT(contract_id) as contract_count,
    SUM(savings_amount) as total_actual_savings,
    AVG(savings_percentage) as avg_savings_percentage,
    SUM(final_contract_value) as total_contract_value
  FROM fact_procurement_savings_contract
  WHERE contract_status = 'Finalized'
  GROUP BY main_category_code
) sav ON cat.main_category_code = sav.main_category_code

LEFT JOIN (
  SELECT
    main_category_code,
    COUNT(contract_number) as contract_count,
    AVG(sourcing_duration_days) as avg_sourcing_days,
    COUNT(*) FILTER (WHERE sourcing_duration_days <= (
      SELECT target_sourcing_days FROM ref_procurement_categories rc
      WHERE rc.main_category_code = procurement_sourcing_contracts.main_category_code
      LIMIT 1
    )) as within_target_count,
    COUNT(*) FILTER (WHERE sourcing_duration_days > (
      SELECT target_sourcing_days FROM ref_procurement_categories rc
      WHERE rc.main_category_code = procurement_sourcing_contracts.main_category_code
      LIMIT 1
    )) as beyond_target_count,
    SUM(value_usd * 15000) as total_contract_value_idr
  FROM procurement_sourcing_contracts
  WHERE status = 'Completed'
  GROUP BY main_category_code
) src ON cat.main_category_code = src.main_category_code

LEFT JOIN (
  SELECT
    main_category_code,
    COUNT(DISTINCT supplier_id) as supplier_count,
    COUNT(id) as total_deliveries,
    (COUNT(*) FILTER (WHERE is_otif = true)::numeric / NULLIF(COUNT(id), 0) * 100) as otif_percentage,
    SUM(contract_value) as total_contract_value,
    COUNT(DISTINCT supplier_name) FILTER (WHERE
      (SELECT (COUNT(*) FILTER (WHERE is_otif = true)::numeric / NULLIF(COUNT(*), 0) * 100)
       FROM supplier_otif_deliveries sod2
       WHERE sod2.supplier_name = supplier_otif_deliveries.supplier_name
         AND sod2.main_category_code = supplier_otif_deliveries.main_category_code
      ) >= 95.0
    ) as suppliers_meeting_target,
    COUNT(DISTINCT supplier_name) FILTER (WHERE
      (SELECT (COUNT(*) FILTER (WHERE is_otif = true)::numeric / NULLIF(COUNT(*), 0) * 100)
       FROM supplier_otif_deliveries sod2
       WHERE sod2.supplier_name = supplier_otif_deliveries.supplier_name
         AND sod2.main_category_code = supplier_otif_deliveries.main_category_code
      ) < 95.0
    ) as suppliers_below_target
  FROM supplier_otif_deliveries
  WHERE delivery_status = 'delivered'
  GROUP BY main_category_code
) otif ON cat.main_category_code = otif.main_category_code

WHERE cat.is_active = true
  AND cat.subcategory_code = cat.main_category_code || '-01' -- Only get first subcategory for main summary
ORDER BY cat.display_order;

-- Create indexes on view source tables for better performance
CREATE INDEX IF NOT EXISTS idx_savings_contract_status ON fact_procurement_savings_contract(contract_status);
CREATE INDEX IF NOT EXISTS idx_sourcing_status ON procurement_sourcing_contracts(status);
CREATE INDEX IF NOT EXISTS idx_otif_delivery_status ON supplier_otif_deliveries(delivery_status);

-- Grant select permissions on views
GRANT SELECT ON v_contracts_savings_by_category TO anon, authenticated;
GRANT SELECT ON v_contracts_sourcing_by_category TO anon, authenticated;
GRANT SELECT ON v_supplier_otif_by_category TO anon, authenticated;
GRANT SELECT ON v_category_performance_summary TO anon, authenticated;
