/*
  # Populate Inventory Turnover Mock Data

  1. Data Strategy
    - Generate turnover data for all 60 business units
    - Include 5 critical materials per unit
    - Vary turnover ratios to show performance diversity:
      * High performers (ratio ≥ 3.0): ~30% of units
      * Average performers (ratio 2.0-3.0): ~50% of units
      * Low performers (ratio < 2.0): ~20% of units
    - Include current month and last 3 months of data

  2. Geographic Diversity
    - Spread performance levels across all regions (Sumatra, Java, Kalimantan, Sulawesi, Nusa Tenggara, Maluku, Papua)
    - Vary material types and consumption patterns by region

  3. Realistic Values
    - Consumption quantities: 50-250 units/month
    - Average inventory: 25-350 units
    - Turnover ratios: 0.5-8.0 (showing full performance spectrum)
*/

-- Clear existing data to start fresh
DELETE FROM material_inventory_turnover;

-- Update critical materials with turnover ratio thresholds
UPDATE critical_materials 
SET threshold_turnover_ratio = CASE material_id
  WHEN 'MAT-001' THEN 2.5
  WHEN 'MAT-002' THEN 3.0
  WHEN 'MAT-003' THEN 2.0
  WHEN 'MAT-004' THEN 3.5
  WHEN 'MAT-005' THEN 2.5
  ELSE 2.0
END
WHERE material_id IN ('MAT-001', 'MAT-002', 'MAT-003', 'MAT-004', 'MAT-005');

-- Generate inventory turnover data for current month and last 3 months
INSERT INTO material_inventory_turnover (
  material_id,
  unit_id,
  period_month,
  period_year,
  consumption_quantity,
  average_inventory,
  turnover_ratio,
  stock_quantity,
  demand_rate,
  turnover_days,
  last_replenishment_date,
  status,
  measurement_date
)
SELECT
  m.material_id,
  u.unit_id,
  period_data.month,
  period_data.year,
  period_data.consumption,
  period_data.avg_inventory,
  -- Calculate turnover ratio
  CASE
    WHEN period_data.avg_inventory > 0
    THEN ROUND((period_data.consumption / period_data.avg_inventory)::numeric, 4)
    ELSE 0
  END as turnover_ratio,
  period_data.avg_inventory,
  ROUND((period_data.consumption / 30.0)::numeric, 4) as demand_rate,
  -- Calculate turnover days for backward compatibility
  CASE
    WHEN period_data.consumption > 0
    THEN ROUND((30.0 * period_data.avg_inventory / period_data.consumption)::numeric, 2)
    ELSE 0
  END as turnover_days,
  period_data.replenish_date,
  -- Determine status based on turnover ratio
  CASE
    WHEN period_data.avg_inventory = 0 THEN 'critical'
    WHEN (period_data.consumption / NULLIF(period_data.avg_inventory, 0)) >= 3.0 THEN 'normal'
    WHEN (period_data.consumption / NULLIF(period_data.avg_inventory, 0)) >= 2.0 THEN 'normal'
    WHEN (period_data.consumption / NULLIF(period_data.avg_inventory, 0)) >= 1.0 THEN 'warning'
    ELSE 'critical'
  END as status,
  period_data.measure_date
FROM critical_materials m
CROSS JOIN unit_locations u
CROSS JOIN LATERAL (
  SELECT
    gen.month,
    gen.year,
    gen.measure_date,
    -- Generate realistic consumption quantities varying by unit performance tier
    CASE
      -- High performers (fast-moving inventory)
      WHEN (ABS(HASHTEXT(u.unit_id || m.material_id)) % 100) < 30 THEN
        (120 + (RANDOM() * 80))::numeric
      -- Average performers
      WHEN (ABS(HASHTEXT(u.unit_id || m.material_id)) % 100) < 80 THEN
        (80 + (RANDOM() * 60))::numeric
      -- Low performers (slow-moving inventory)
      ELSE
        (40 + (RANDOM() * 40))::numeric
    END as consumption,
    -- Generate realistic inventory levels (inversely correlated with performance)
    CASE
      -- High performers (lower inventory, faster turnover)
      WHEN (ABS(HASHTEXT(u.unit_id || m.material_id)) % 100) < 30 THEN
        (25 + (RANDOM() * 30))::numeric
      -- Average performers
      WHEN (ABS(HASHTEXT(u.unit_id || m.material_id)) % 100) < 80 THEN
        (60 + (RANDOM() * 60))::numeric
      -- Low performers (higher inventory, slower turnover)
      ELSE
        (120 + (RANDOM() * 100))::numeric
    END as avg_inventory,
    gen.replenish_date
  FROM (
    SELECT
      month_series.month,
      month_series.year,
      DATE(month_series.year || '-' || LPAD(month_series.month::text, 2, '0') || '-15') as measure_date,
      DATE(month_series.year || '-' || LPAD(month_series.month::text, 2, '0') || '-' ||
           (20 + (RANDOM() * 8)::int)::text) as replenish_date
    FROM (
      SELECT
        CASE
          WHEN (EXTRACT(MONTH FROM CURRENT_DATE) - s.val) >= 1
          THEN (EXTRACT(MONTH FROM CURRENT_DATE) - s.val)::int
          ELSE (EXTRACT(MONTH FROM CURRENT_DATE) - s.val + 12)::int
        END as month,
        CASE
          WHEN (EXTRACT(MONTH FROM CURRENT_DATE) - s.val) >= 1
          THEN EXTRACT(YEAR FROM CURRENT_DATE)::int
          ELSE EXTRACT(YEAR FROM CURRENT_DATE)::int - 1
        END as year
      FROM generate_series(0, 3) as s(val)
    ) as month_series
  ) as gen
) as period_data
WHERE m.is_critical = true
ORDER BY period_data.year DESC, period_data.month DESC, u.unit_id, m.material_id;

-- Update statistics for query optimization
ANALYZE material_inventory_turnover;
ANALYZE critical_materials;
