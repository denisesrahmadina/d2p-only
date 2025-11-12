/*
  # Fix OTIF RPC Function to Include All Delivery Statuses

  1. Purpose
    - Update get_top_suppliers_global function to count ALL deliveries regardless of status
    - Current function only counts 'delivered' status, which skips delayed/partial deliveries
    - This causes incorrect OTIF calculations showing 100% for all suppliers

  2. Changes
    - Remove the WHERE delivery_status = 'delivered' filter
    - Include all deliveries to properly calculate OTIF percentages
    - OTIF calculation is based on is_otif boolean, not delivery_status
*/

CREATE OR REPLACE FUNCTION public.get_top_suppliers_global(
  p_category_code text DEFAULT NULL,
  p_limit integer DEFAULT 10
)
RETURNS TABLE(
  supplier_id text,
  supplier_name text,
  main_category_codes text[],
  total_contracts bigint,
  total_deliveries bigint,
  otif_percentage numeric,
  on_time_percentage numeric,
  in_full_percentage numeric,
  avg_delay_days numeric,
  total_contract_value numeric,
  supplier_tier text,
  latest_delivery_date date,
  consistency_score numeric
)
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  WITH supplier_stats AS (
    SELECT
      sod.supplier_name,
      ARRAY_AGG(DISTINCT sod.main_category_code) AS categories,
      COUNT(DISTINCT sod.contract_id) AS contract_count,
      COUNT(*) AS delivery_count,
      SUM(CASE WHEN sod.is_otif THEN 1 ELSE 0 END) AS otif_count,
      SUM(CASE WHEN sod.is_on_time THEN 1 ELSE 0 END) AS on_time_count,
      SUM(CASE WHEN sod.is_in_full THEN 1 ELSE 0 END) AS in_full_count,
      AVG(CASE WHEN sod.delay_days > 0 THEN sod.delay_days ELSE NULL END) AS avg_delay,
      MAX(sod.actual_delivery_date::date) AS last_delivery,
      STDDEV(CASE WHEN sod.is_otif THEN 100 ELSE 0 END) AS otif_stddev
    FROM supplier_otif_deliveries sod
    WHERE (p_category_code IS NULL OR sod.main_category_code = p_category_code)
    GROUP BY sod.supplier_name
    HAVING COUNT(*) >= 3  -- Minimum 3 deliveries for ranking
  )
  SELECT
    'SUPP-' || SUBSTRING(ss.supplier_name FROM 6 FOR 6) AS supplier_id,
    ss.supplier_name,
    ss.categories AS main_category_codes,
    ss.contract_count AS total_contracts,
    ss.delivery_count AS total_deliveries,
    ROUND((ss.otif_count::numeric / ss.delivery_count::numeric) * 100, 2) AS otif_percentage,
    ROUND((ss.on_time_count::numeric / ss.delivery_count::numeric) * 100, 2) AS on_time_percentage,
    ROUND((ss.in_full_count::numeric / ss.delivery_count::numeric) * 100, 2) AS in_full_percentage,
    ROUND(ss.avg_delay, 1) AS avg_delay_days,
    0::numeric AS total_contract_value,
    CASE
      WHEN (ss.otif_count::numeric / ss.delivery_count::numeric) >= 0.95 THEN 'strategic'
      WHEN (ss.otif_count::numeric / ss.delivery_count::numeric) >= 0.85 THEN 'preferred'
      ELSE 'standard'
    END AS supplier_tier,
    ss.last_delivery AS latest_delivery_date,
    -- Consistency score: higher OTIF with lower variance = better consistency
    ROUND(
      ((ss.otif_count::numeric / ss.delivery_count::numeric) * 100) -
      (COALESCE(ss.otif_stddev, 0) * 0.1),
      2
    ) AS consistency_score
  FROM supplier_stats ss
  ORDER BY
    (ss.otif_count::numeric / ss.delivery_count::numeric) DESC,
    ss.delivery_count DESC
  LIMIT p_limit;
END;
$function$;
