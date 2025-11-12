/*
  # Adjust Performance Status Thresholds

  ## Overview
  Updates the performance status logic to ensure Category E (74% achievement)
  displays as "Below Target" instead of "Near Target".

  ## Changes
  - Adjusts "Near Target" threshold from 80% to 85%
  - Below Target: < 85%
  - Near Target: 85-95%
  - On Target: >= 95%

  ## Result
  - Category A: 68% - Below Target ✓
  - Category B: 98% - On Target ✓
  - Category C: 72% - Below Target ✓
  - Category D: 102% - On Target ✓
  - Category E: 74% - Below Target ✓
  - Category F: 104% - On Target ✓
*/

DROP VIEW IF EXISTS v_category_performance_summary CASCADE;

CREATE OR REPLACE VIEW v_category_performance_summary AS
WITH base_categories AS (
  SELECT DISTINCT ON (main_category_code)
    main_category_code,
    main_category_name as main_category_name_id,
    description as main_category_description_id,
    sort_order as display_order,
    benchmark_savings_percentage as target_savings_percentage,
    typical_sourcing_days as target_sourcing_days,
    95.0 as target_otif_percentage
  FROM ref_procurement_categories
  WHERE is_active = true
  ORDER BY main_category_code, sort_order
),
savings_agg AS (
  SELECT
    main_category_code,
    COUNT(DISTINCT contract_id) as contract_count,
    SUM(savings_amount) as total_actual_savings,
    AVG(savings_percentage) as avg_savings_percentage,
    SUM(final_contract_value) as total_contract_value
  FROM fact_procurement_savings_contract
  WHERE contract_status = 'Finalized'
    AND main_category_code IS NOT NULL
  GROUP BY main_category_code
),
sourcing_agg AS (
  SELECT
    main_category_code,
    COUNT(DISTINCT contract_number) as contract_count,
    AVG(sourcing_duration_days) as avg_sourcing_days,
    SUM(value_usd * 15000) as total_contract_value_idr
  FROM procurement_sourcing_contracts
  WHERE status = 'Completed'
    AND main_category_code IS NOT NULL
  GROUP BY main_category_code
),
sourcing_targets AS (
  SELECT
    sc.main_category_code,
    COUNT(*) FILTER (WHERE sc.sourcing_duration_days <= bc.target_sourcing_days) as within_target_count,
    COUNT(*) FILTER (WHERE sc.sourcing_duration_days > bc.target_sourcing_days) as beyond_target_count
  FROM procurement_sourcing_contracts sc
  CROSS JOIN base_categories bc
  WHERE sc.status = 'Completed'
    AND sc.main_category_code IS NOT NULL
    AND sc.main_category_code = bc.main_category_code
  GROUP BY sc.main_category_code
),
otif_agg AS (
  SELECT
    main_category_code,
    COUNT(DISTINCT supplier_id) as supplier_count,
    COUNT(id) as total_deliveries,
    (COUNT(*) FILTER (WHERE is_otif = true)::numeric / NULLIF(COUNT(id), 0) * 100) as otif_percentage
  FROM supplier_otif_deliveries
  WHERE delivery_status = 'delivered'
    AND main_category_code IS NOT NULL
  GROUP BY main_category_code
),
otif_suppliers AS (
  SELECT
    main_category_code,
    COUNT(DISTINCT supplier_name) FILTER (WHERE
      (SELECT (COUNT(*) FILTER (WHERE is_otif = true)::numeric / NULLIF(COUNT(*), 0) * 100)
       FROM supplier_otif_deliveries sod2
       WHERE sod2.supplier_name = supplier_otif_deliveries.supplier_name
         AND sod2.main_category_code = supplier_otif_deliveries.main_category_code
         AND sod2.delivery_status = 'delivered'
      ) >= 95.0
    ) as suppliers_meeting_target,
    COUNT(DISTINCT supplier_name) FILTER (WHERE
      (SELECT (COUNT(*) FILTER (WHERE is_otif = true)::numeric / NULLIF(COUNT(*), 0) * 100)
       FROM supplier_otif_deliveries sod2
       WHERE sod2.supplier_name = supplier_otif_deliveries.supplier_name
         AND sod2.main_category_code = supplier_otif_deliveries.main_category_code
         AND sod2.delivery_status = 'delivered'
      ) < 95.0
    ) as suppliers_below_target
  FROM supplier_otif_deliveries
  WHERE delivery_status = 'delivered'
    AND main_category_code IS NOT NULL
  GROUP BY main_category_code
)
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
  COALESCE(st.within_target_count, 0) as sourcing_within_target,
  COALESCE(st.beyond_target_count, 0) as sourcing_beyond_target,
  cat.target_sourcing_days,

  -- OTIF Metrics
  COALESCE(otif.supplier_count, 0) as otif_supplier_count,
  COALESCE(otif.total_deliveries, 0) as total_deliveries,
  COALESCE(otif.otif_percentage, 0) as otif_percentage,
  COALESCE(os.suppliers_meeting_target, 0) as suppliers_meeting_otif,
  COALESCE(os.suppliers_below_target, 0) as suppliers_below_otif,
  cat.target_otif_percentage,

  -- Combined Metrics
  COALESCE(sav.total_contract_value, 0) as total_value_savings,
  COALESCE(src.total_contract_value_idr, 0) as total_value_sourcing,
  0 as total_value_otif,

  -- Performance Indicators (using achievement data with adjusted thresholds)
  CASE
    WHEN ach.achievement_percentage IS NOT NULL THEN
      CASE
        WHEN ach.achievement_percentage >= 95 THEN 'On Target'
        WHEN ach.achievement_percentage >= 85 THEN 'Near Target'
        ELSE 'Below Target'
      END
    ELSE
      CASE
        WHEN COALESCE(sav.avg_savings_percentage, 0) >= cat.target_savings_percentage THEN 'On Target'
        WHEN COALESCE(sav.avg_savings_percentage, 0) >= cat.target_savings_percentage * 0.9 THEN 'Near Target'
        ELSE 'Below Target'
      END
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

FROM base_categories cat
LEFT JOIN savings_agg sav ON cat.main_category_code = sav.main_category_code
LEFT JOIN v_savings_achievement_by_category ach ON cat.main_category_code = ach.main_category_code
LEFT JOIN sourcing_agg src ON cat.main_category_code = src.main_category_code
LEFT JOIN sourcing_targets st ON cat.main_category_code = st.main_category_code
LEFT JOIN otif_agg otif ON cat.main_category_code = otif.main_category_code
LEFT JOIN otif_suppliers os ON cat.main_category_code = os.main_category_code
ORDER BY cat.display_order;

GRANT SELECT ON v_category_performance_summary TO anon, authenticated;

COMMENT ON VIEW v_category_performance_summary IS 'Category performance with varied status: A (68% below), B (98% on), C (72% below), D (102% on), E (74% below), F (104% on)';
