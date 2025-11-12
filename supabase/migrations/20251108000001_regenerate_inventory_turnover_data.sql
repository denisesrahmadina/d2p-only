/*
  # Regenerate Inventory Turnover Data with New Formula

  1. Clear existing turnover data
  2. Generate realistic monthly data for each unit and material
  3. Calculate turnover ratio = consumption_quantity / average_inventory
  4. Set status based on turnover ratio thresholds
  5. Include data for multiple months (last 6 months)

  Formula: Turnover Ratio = Consumption Rate per Period / Average Inventory per Period
  - Higher ratio = Better performance
  - Typical ranges:
    - > 4.0: Excellent (critical status if too high - potential stockout risk)
    - 3.0 - 4.0: Good (normal status)
    - 2.0 - 3.0: Acceptable (normal status)
    - 1.0 - 2.0: Slow (warning status)
    - < 1.0: Very Slow (critical status - overstocking)
*/

-- Clear existing turnover data
DELETE FROM material_inventory_turnover;

-- Generate inventory turnover data for the last 6 months
-- For each material and unit combination
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
  CASE
    WHEN period_data.avg_inventory > 0
    THEN ROUND((period_data.consumption / period_data.avg_inventory)::numeric, 4)
    ELSE 0
  END as turnover_ratio,
  period_data.avg_inventory, -- Current stock = average inventory
  CASE
    WHEN period_data.avg_inventory > 0
    THEN ROUND((period_data.consumption / 30.0)::numeric, 4)
    ELSE 0
  END as demand_rate, -- Average daily demand
  period_data.turnover_days, -- Keep for backward compatibility
  period_data.replenish_date,
  CASE
    WHEN period_data.avg_inventory = 0 THEN 'critical'
    WHEN (period_data.consumption / NULLIF(period_data.avg_inventory, 0)) >= 4.0 THEN 'warning' -- Too high, risk of stockout
    WHEN (period_data.consumption / NULLIF(period_data.avg_inventory, 0)) >= 2.0 THEN 'normal'
    WHEN (period_data.consumption / NULLIF(period_data.avg_inventory, 0)) >= 1.0 THEN 'warning' -- Slow moving
    ELSE 'critical' -- Very slow or overstocked
  END as status,
  period_data.measure_date
FROM critical_materials m
CROSS JOIN unit_locations u
CROSS JOIN LATERAL (
  SELECT
    gen.month,
    gen.year,
    gen.measure_date,
    -- Generate realistic consumption quantities based on material and unit characteristics
    CASE m.material_id
      WHEN 'MAT-001' THEN -- Diesel Engine (High consumption at certain units)
        CASE u.unit_id
          WHEN 'UNIT-PLN-001' THEN 120 + (RANDOM() * 30)::numeric -- Suralaya: High consumption
          WHEN 'UNIT-PLN-002' THEN 95 + (RANDOM() * 25)::numeric  -- Muara Karang
          WHEN 'UNIT-PLN-003' THEN 85 + (RANDOM() * 20)::numeric  -- Priok
          WHEN 'UNIT-PLN-004' THEN 75 + (RANDOM() * 20)::numeric  -- Cilegon
          WHEN 'UNIT-PLN-005' THEN 110 + (RANDOM() * 25)::numeric -- Labuan
          ELSE 60 + (RANDOM() * 15)::numeric
        END
      WHEN 'MAT-002' THEN -- Gas Turbine Blade
        CASE u.unit_id
          WHEN 'UNIT-PLN-001' THEN 45 + (RANDOM() * 15)::numeric
          WHEN 'UNIT-PLN-002' THEN 55 + (RANDOM() * 20)::numeric
          WHEN 'UNIT-PLN-006' THEN 65 + (RANDOM() * 20)::numeric -- Muara Tawar: High gas turbine usage
          WHEN 'UNIT-PLN-007' THEN 50 + (RANDOM() * 15)::numeric -- Grati
          ELSE 35 + (RANDOM() * 10)::numeric
        END
      WHEN 'MAT-003' THEN -- Generator Rotor
        CASE u.unit_id
          WHEN 'UNIT-PLN-001' THEN 25 + (RANDOM() * 10)::numeric
          WHEN 'UNIT-PLN-003' THEN 30 + (RANDOM() * 12)::numeric
          WHEN 'UNIT-PLN-005' THEN 28 + (RANDOM() * 10)::numeric
          ELSE 20 + (RANDOM() * 8)::numeric
        END
      WHEN 'MAT-004' THEN -- Turbine Oil Filter
        CASE u.unit_id
          WHEN 'UNIT-PLN-001' THEN 200 + (RANDOM() * 50)::numeric
          WHEN 'UNIT-PLN-002' THEN 180 + (RANDOM() * 45)::numeric
          WHEN 'UNIT-PLN-006' THEN 220 + (RANDOM() * 55)::numeric
          ELSE 150 + (RANDOM() * 40)::numeric
        END
      WHEN 'MAT-005' THEN -- Control System Module
        CASE u.unit_id
          WHEN 'UNIT-PLN-001' THEN 35 + (RANDOM() * 12)::numeric
          WHEN 'UNIT-PLN-002' THEN 40 + (RANDOM() * 15)::numeric
          WHEN 'UNIT-PLN-008' THEN 45 + (RANDOM() * 15)::numeric -- Paiton: High tech
          ELSE 25 + (RANDOM() * 10)::numeric
        END
      ELSE 50 + (RANDOM() * 15)::numeric
    END as consumption,
    -- Generate realistic average inventory levels
    CASE m.material_id
      WHEN 'MAT-001' THEN -- Diesel Engine (Higher stock levels)
        CASE u.unit_id
          WHEN 'UNIT-PLN-001' THEN 180 + (RANDOM() * 40)::numeric
          WHEN 'UNIT-PLN-002' THEN 160 + (RANDOM() * 35)::numeric
          WHEN 'UNIT-PLN-003' THEN 140 + (RANDOM() * 30)::numeric
          WHEN 'UNIT-PLN-004' THEN 130 + (RANDOM() * 30)::numeric
          WHEN 'UNIT-PLN-005' THEN 170 + (RANDOM() * 35)::numeric
          ELSE 120 + (RANDOM() * 25)::numeric
        END
      WHEN 'MAT-002' THEN -- Gas Turbine Blade
        CASE u.unit_id
          WHEN 'UNIT-PLN-001' THEN 70 + (RANDOM() * 20)::numeric
          WHEN 'UNIT-PLN-002' THEN 80 + (RANDOM() * 25)::numeric
          WHEN 'UNIT-PLN-006' THEN 90 + (RANDOM() * 25)::numeric
          WHEN 'UNIT-PLN-007' THEN 75 + (RANDOM() * 20)::numeric
          ELSE 55 + (RANDOM() * 15)::numeric
        END
      WHEN 'MAT-003' THEN -- Generator Rotor
        CASE u.unit_id
          WHEN 'UNIT-PLN-001' THEN 40 + (RANDOM() * 12)::numeric
          WHEN 'UNIT-PLN-003' THEN 45 + (RANDOM() * 15)::numeric
          WHEN 'UNIT-PLN-005' THEN 42 + (RANDOM() * 12)::numeric
          ELSE 32 + (RANDOM() * 10)::numeric
        END
      WHEN 'MAT-004' THEN -- Turbine Oil Filter
        CASE u.unit_id
          WHEN 'UNIT-PLN-001' THEN 280 + (RANDOM() * 60)::numeric
          WHEN 'UNIT-PLN-002' THEN 250 + (RANDOM() * 55)::numeric
          WHEN 'UNIT-PLN-006' THEN 300 + (RANDOM() * 65)::numeric
          ELSE 200 + (RANDOM() * 50)::numeric
        END
      WHEN 'MAT-005' THEN -- Control System Module
        CASE u.unit_id
          WHEN 'UNIT-PLN-001' THEN 50 + (RANDOM() * 15)::numeric
          WHEN 'UNIT-PLN-002' THEN 55 + (RANDOM() * 18)::numeric
          WHEN 'UNIT-PLN-008' THEN 60 + (RANDOM() * 18)::numeric
          ELSE 38 + (RANDOM() * 12)::numeric
        END
      ELSE 80 + (RANDOM() * 20)::numeric
    END as avg_inventory,
    -- Calculate turnover days for backward compatibility
    CASE
      WHEN (CASE m.material_id
        WHEN 'MAT-001' THEN
          CASE u.unit_id
            WHEN 'UNIT-PLN-001' THEN 120 + (RANDOM() * 30)::numeric
            WHEN 'UNIT-PLN-002' THEN 95 + (RANDOM() * 25)::numeric
            ELSE 60 + (RANDOM() * 15)::numeric
          END
        ELSE 50 + (RANDOM() * 15)::numeric
      END) > 0
      THEN ROUND((30.0 * (CASE m.material_id
        WHEN 'MAT-001' THEN
          CASE u.unit_id
            WHEN 'UNIT-PLN-001' THEN 180 + (RANDOM() * 40)::numeric
            ELSE 120 + (RANDOM() * 25)::numeric
          END
        ELSE 80 + (RANDOM() * 20)::numeric
      END) / (CASE m.material_id
        WHEN 'MAT-001' THEN
          CASE u.unit_id
            WHEN 'UNIT-PLN-001' THEN 120 + (RANDOM() * 30)::numeric
            ELSE 60 + (RANDOM() * 15)::numeric
          END
        ELSE 50 + (RANDOM() * 15)::numeric
      END))::numeric, 2)
      ELSE 0
    END as turnover_days,
    gen.replenish_date
  FROM (
    SELECT
      month_series.month,
      month_series.year,
      DATE(month_series.year || '-' || LPAD(month_series.month::text, 2, '0') || '-' ||
           (15 + (RANDOM() * 10)::int)::text) as measure_date,
      DATE(month_series.year || '-' || LPAD(month_series.month::text, 2, '0') || '-' ||
           (20 + (RANDOM() * 8)::int)::text) as replenish_date
    FROM (
      SELECT
        CASE
          WHEN s.val <= 6 THEN (EXTRACT(MONTH FROM CURRENT_DATE) - s.val + 12)::int % 12 + 1
          ELSE (EXTRACT(MONTH FROM CURRENT_DATE) - s.val + 12)::int % 12 + 1
        END as month,
        CASE
          WHEN (EXTRACT(MONTH FROM CURRENT_DATE) - s.val) <= 0
          THEN EXTRACT(YEAR FROM CURRENT_DATE)::int - 1
          ELSE EXTRACT(YEAR FROM CURRENT_DATE)::int
        END as year
      FROM generate_series(1, 6) as s(val)
    ) as month_series
  ) as gen
) as period_data
WHERE m.is_critical = true
ORDER BY period_data.year DESC, period_data.month DESC, u.unit_id, m.material_id;

-- Update statistics
ANALYZE critical_materials;
ANALYZE material_inventory_turnover;
