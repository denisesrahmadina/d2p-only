/*
  # Fix Category Performance Views

  Fixes the v_category_performance_summary view to properly aggregate data.
*/

-- Drop and recreate the main category performance summary view
DROP VIEW IF EXISTS v_category_performance_summary CASCADE;

CREATE OR REPLACE VIEW v_category_performance_summary AS
WITH category_list AS (
  SELECT DISTINCT
    main_category_code,
    main_category_name,
    description,
    sort_order
  FROM ref_procurement_categories
  WHERE is_active = true
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
    COUNT(*) FILTER (WHERE sc.sourcing_duration_days <= 60) as within_target_count,
    COUNT(*) FILTER (WHERE sc.sourcing_duration_days > 60) as beyond_target_count
  FROM procurement_sourcing_contracts sc
  WHERE sc.status = 'Completed'
    AND sc.main_category_code IS NOT NULL
  GROUP BY sc.main_category_code
),
otif_agg AS (
  SELECT
    main_category_code,
    COUNT(DISTINCT supplier_id) as supplier_count,
    COUNT(id) as total_deliveries,
    (COUNT(*) FILTER (WHERE is_otif = true)::numeric / NULLIF(COUNT(id), 0) * 100) as otif_percentage,
    SUM(0) as total_contract_value
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
  cat.main_category_name as main_category_name_id,
  cat.description as main_category_description_id,
  cat.sort_order as display_order,

  -- Savings Metrics
  COALESCE(sav.contract_count, 0) as savings_contract_count,
  COALESCE(sav.total_actual_savings, 0) as total_savings_amount,
  COALESCE(sav.avg_savings_percentage, 0) as avg_savings_percentage,
  10.0 as target_savings_percentage,

  -- Sourcing Speed Metrics
  COALESCE(src.contract_count, 0) as sourcing_contract_count,
  COALESCE(src.avg_sourcing_days, 0) as avg_sourcing_days,
  COALESCE(st.within_target_count, 0) as sourcing_within_target,
  COALESCE(st.beyond_target_count, 0) as sourcing_beyond_target,
  60 as target_sourcing_days,

  -- OTIF Metrics
  COALESCE(otif.supplier_count, 0) as otif_supplier_count,
  COALESCE(otif.total_deliveries, 0) as total_deliveries,
  COALESCE(otif.otif_percentage, 0) as otif_percentage,
  COALESCE(os.suppliers_meeting_target, 0) as suppliers_meeting_otif,
  COALESCE(os.suppliers_below_target, 0) as suppliers_below_otif,
  95.0 as target_otif_percentage,

  -- Combined Metrics
  COALESCE(sav.total_contract_value, 0) as total_value_savings,
  COALESCE(src.total_contract_value_idr, 0) as total_value_sourcing,
  COALESCE(otif.total_contract_value, 0) as total_value_otif,

  -- Performance Indicators
  CASE
    WHEN COALESCE(sav.avg_savings_percentage, 0) >= 10.0 THEN 'On Target'
    WHEN COALESCE(sav.avg_savings_percentage, 0) >= 9.0 THEN 'Near Target'
    ELSE 'Below Target'
  END as savings_performance_status,

  CASE
    WHEN COALESCE(src.avg_sourcing_days, 999) <= 60 THEN 'On Target'
    WHEN COALESCE(src.avg_sourcing_days, 999) <= 66 THEN 'Near Target'
    ELSE 'Below Target'
  END as sourcing_performance_status,

  CASE
    WHEN COALESCE(otif.otif_percentage, 0) >= 95.0 THEN 'On Target'
    WHEN COALESCE(otif.otif_percentage, 0) >= 90.0 THEN 'Near Target'
    ELSE 'Below Target'
  END as otif_performance_status

FROM category_list cat
LEFT JOIN savings_agg sav ON cat.main_category_code = sav.main_category_code
LEFT JOIN sourcing_agg src ON cat.main_category_code = src.main_category_code
LEFT JOIN sourcing_targets st ON cat.main_category_code = st.main_category_code
LEFT JOIN otif_agg otif ON cat.main_category_code = otif.main_category_code
LEFT JOIN otif_suppliers os ON cat.main_category_code = os.main_category_code
ORDER BY cat.sort_order;

-- Grant permissions
GRANT SELECT ON v_category_performance_summary TO anon, authenticated;
