/*
  # Populate Sourcing Speed and OTIF Delivery Data

  1. Sourcing Speed Contracts
    - Link all 135 contracts to sourcing speed tracking
    - Calculate realistic sourcing durations based on category
    - Add contract descriptions and current status

  2. OTIF Delivery Records
    - Generate 1,000+ delivery records across all categories
    - Create realistic on-time and in-full performance data
    - Link deliveries to contracts and suppliers

  3. Important Notes
    - Sourcing speed varies by category complexity
    - OTIF performance reflects supplier tier and category
    - Multiple deliveries per contract for realistic tracking
*/

-- Update procurement_sourcing_contracts with category-linked data
DO $$
DECLARE
  v_contract RECORD;
  v_category RECORD;
  v_sourcing_days integer;
  v_request_date date;
  v_signed_date date;
BEGIN
  -- For each savings contract, create corresponding sourcing record
  FOR v_contract IN
    SELECT
      psc.contract_id,
      psc.contract_name,
      psc.supplier_name,
      psc.category,
      psc.business_unit,
      psc.award_date,
      psc.final_contract_value,
      psc.category_id,
      psc.main_category_code,
      psc.subcategory_code,
      cat.target_sourcing_days,
      cat.subcategory_name_id
    FROM fact_procurement_savings_contract psc
    LEFT JOIN ref_procurement_categories cat ON psc.category_id = cat.id
    WHERE psc.contract_status = 'Finalized'
  LOOP
    -- Calculate sourcing days with variance (+/- 30% of target)
    v_sourcing_days := v_contract.target_sourcing_days +
      ((random() * 0.6 - 0.3) * v_contract.target_sourcing_days)::integer;

    -- Ensure minimum 10 days
    IF v_sourcing_days < 10 THEN
      v_sourcing_days := 10;
    END IF;

    -- Calculate request date (working backwards from award date)
    v_request_date := v_contract.award_date - (v_sourcing_days || ' days')::interval;
    v_signed_date := v_contract.award_date + (random() * 7)::integer;

    -- Insert or update sourcing contract record
    INSERT INTO procurement_sourcing_contracts (
      contract_number,
      contract_name,
      category,
      request_date,
      contract_signed_date,
      sourcing_duration_days,
      value_usd,
      status,
      unit_location_id,
      vendor_name,
      current_process,
      category_id,
      main_category_code,
      subcategory_code,
      contract_description
    ) VALUES (
      v_contract.contract_id,
      v_contract.contract_name,
      v_contract.category,
      v_request_date,
      v_signed_date,
      v_sourcing_days,
      (v_contract.final_contract_value / 15000)::numeric, -- Convert IDR to USD approximation
      'Completed',
      NULL,
      v_contract.supplier_name,
      'Contract Signed',
      v_contract.category_id,
      v_contract.main_category_code,
      v_contract.subcategory_code,
      'Kontrak ' || v_contract.subcategory_name_id || ' untuk ' || v_contract.business_unit
    )
    ON CONFLICT (contract_number) DO UPDATE SET
      category_id = EXCLUDED.category_id,
      main_category_code = EXCLUDED.main_category_code,
      subcategory_code = EXCLUDED.subcategory_code,
      contract_description = EXCLUDED.contract_description;

  END LOOP;

  RAISE NOTICE 'Sourcing speed data populated for all contracts';
END $$;

-- Generate OTIF delivery records (10-15 deliveries per contract)
DO $$
DECLARE
  v_contract RECORD;
  v_delivery_seq integer;
  v_delivery_count integer;
  v_order_date date;
  v_expected_date date;
  v_actual_date date;
  v_is_on_time boolean;
  v_is_in_full boolean;
  v_delay_days integer;
  v_quantity_ordered integer;
  v_quantity_delivered integer;
  v_shortage integer;
  v_otif_probability numeric;
BEGIN
  FOR v_contract IN
    SELECT
      psc.contract_id,
      psc.contract_name,
      psc.supplier_name,
      psc.category,
      psc.business_unit,
      psc.award_date,
      psc.final_contract_value,
      psc.category_id,
      psc.main_category_code,
      psc.subcategory_code,
      cat.target_otif_percentage,
      cat.subcategory_name_id
    FROM fact_procurement_savings_contract psc
    LEFT JOIN ref_procurement_categories cat ON psc.category_id = cat.id
    WHERE psc.contract_status = 'Finalized'
    ORDER BY psc.award_date
  LOOP
    -- Determine number of deliveries (8-15 per contract)
    v_delivery_count := 8 + (random() * 7)::integer;

    -- OTIF probability based on category target
    v_otif_probability := v_contract.target_otif_percentage / 100.0;

    FOR v_delivery_seq IN 1..v_delivery_count LOOP
      -- Order date after contract award
      v_order_date := v_contract.award_date + (v_delivery_seq * 15 + (random() * 10)::integer || ' days')::interval;

      -- Expected delivery 20-40 days after order
      v_expected_date := v_order_date + (20 + (random() * 20)::integer || ' days')::interval;

      -- Determine if delivery is on time (based on OTIF probability + some randomness)
      v_is_on_time := random() < (v_otif_probability + 0.02);

      IF v_is_on_time THEN
        -- On time: 0-2 days early or exactly on time
        v_actual_date := v_expected_date - (random() * 2)::integer;
        v_delay_days := 0;
      ELSE
        -- Late: 1-15 days delay
        v_delay_days := 1 + (random() * 14)::integer;
        v_actual_date := v_expected_date + (v_delay_days || ' days')::interval;
      END IF;

      -- Quantity ordered (varies by category)
      v_quantity_ordered := CASE v_contract.main_category_code
        WHEN 'A' THEN 5000 + (random() * 10000)::integer  -- Fuel/energy in tons
        WHEN 'B' THEN 5 + (random() * 15)::integer        -- Equipment in units
        WHEN 'C' THEN 100 + (random() * 400)::integer     -- Materials in units
        WHEN 'D' THEN 10 + (random() * 30)::integer       -- Assets in units
        WHEN 'E' THEN 1                                    -- Services (man-hours or contracts)
        ELSE 2 + (random() * 5)::integer                   -- Large equipment
      END;

      -- Determine if in full (slightly higher probability than on-time)
      v_is_in_full := random() < (v_otif_probability + 0.03);

      IF v_is_in_full THEN
        v_quantity_delivered := v_quantity_ordered;
        v_shortage := 0;
      ELSE
        -- Partial delivery: 70-99% of ordered
        v_quantity_delivered := (v_quantity_ordered * (0.7 + random() * 0.29))::integer;
        v_shortage := v_quantity_ordered - v_quantity_delivered;
      END IF;

      -- Only create delivered records (not pending)
      IF v_actual_date <= CURRENT_DATE THEN
        INSERT INTO supplier_otif_deliveries (
          organization_id,
          purchase_order_id,
          supplier_id,
          supplier_name,
          order_date,
          expected_delivery_date,
          actual_delivery_date,
          quantity_ordered,
          quantity_delivered,
          is_on_time,
          is_in_full,
          is_otif,
          delivery_status,
          delay_days,
          quantity_shortage,
          product_category,
          failure_reason,
          notes,
          category_id,
          main_category_code,
          contract_name,
          contract_description,
          contract_id,
          contract_value
        ) VALUES (
          'ORG001',
          v_contract.contract_id || '-PO-' || LPAD(v_delivery_seq::text, 3, '0'),
          'SUPP-' || SUBSTRING(v_contract.supplier_name, 4, 10),
          v_contract.supplier_name,
          v_order_date,
          v_expected_date,
          v_actual_date,
          v_quantity_ordered,
          v_quantity_delivered,
          v_is_on_time,
          v_is_in_full,
          (v_is_on_time AND v_is_in_full),
          'delivered',
          CASE WHEN v_is_on_time THEN NULL ELSE v_delay_days END,
          CASE WHEN v_is_in_full THEN NULL ELSE v_shortage END,
          v_contract.subcategory_name_id,
          CASE
            WHEN NOT v_is_on_time AND NOT v_is_in_full THEN 'Late delivery and quantity shortage'
            WHEN NOT v_is_on_time THEN 'Supplier delay in production/logistics'
            WHEN NOT v_is_in_full THEN 'Partial shipment due to stock availability'
            ELSE NULL
          END,
          'Delivery ' || v_delivery_seq || ' untuk kontrak ' || v_contract.contract_id,
          v_contract.category_id,
          v_contract.main_category_code,
          v_contract.contract_name,
          'Pengiriman untuk ' || v_contract.subcategory_name_id,
          v_contract.contract_id,
          v_contract.final_contract_value / v_delivery_count -- Distribute contract value
        );
      END IF;

    END LOOP;

  END LOOP;

  RAISE NOTICE 'OTIF delivery data populated for all contracts';
END $$;

-- Update supplier OTIF performance summary
INSERT INTO supplier_otif_performance (
  organization_id,
  supplier_id,
  supplier_name,
  period_start,
  period_end,
  total_deliveries,
  on_time_deliveries,
  in_full_deliveries,
  otif_deliveries,
  on_time_percentage,
  in_full_percentage,
  otif_percentage,
  avg_delay_days,
  supplier_tier
)
SELECT
  'ORG001',
  'SUPP-' || SUBSTRING(supplier_name, 4, 10),
  supplier_name,
  MIN(order_date),
  MAX(order_date),
  COUNT(*),
  COUNT(*) FILTER (WHERE is_on_time = true),
  COUNT(*) FILTER (WHERE is_in_full = true),
  COUNT(*) FILTER (WHERE is_otif = true),
  (COUNT(*) FILTER (WHERE is_on_time = true)::numeric / COUNT(*) * 100),
  (COUNT(*) FILTER (WHERE is_in_full = true)::numeric / COUNT(*) * 100),
  (COUNT(*) FILTER (WHERE is_otif = true)::numeric / COUNT(*) * 100),
  AVG(delay_days) FILTER (WHERE delay_days IS NOT NULL),
  CASE
    WHEN (COUNT(*) FILTER (WHERE is_otif = true)::numeric / COUNT(*) * 100) >= 95 THEN 'strategic'
    WHEN (COUNT(*) FILTER (WHERE is_otif = true)::numeric / COUNT(*) * 100) >= 85 THEN 'preferred'
    ELSE 'standard'
  END
FROM supplier_otif_deliveries
WHERE organization_id = 'ORG001'
  AND delivery_status = 'delivered'
GROUP BY supplier_name
ON CONFLICT (organization_id, supplier_id, period_start, period_end)
DO UPDATE SET
  total_deliveries = EXCLUDED.total_deliveries,
  on_time_deliveries = EXCLUDED.on_time_deliveries,
  in_full_deliveries = EXCLUDED.in_full_deliveries,
  otif_deliveries = EXCLUDED.otif_deliveries,
  on_time_percentage = EXCLUDED.on_time_percentage,
  in_full_percentage = EXCLUDED.in_full_percentage,
  otif_percentage = EXCLUDED.otif_percentage,
  avg_delay_days = EXCLUDED.avg_delay_days,
  supplier_tier = EXCLUDED.supplier_tier,
  updated_at = now();
