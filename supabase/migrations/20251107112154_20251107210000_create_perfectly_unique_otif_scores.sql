/*
  # Create Perfectly Unique OTIF Scores for All Suppliers

  This migration ensures each supplier has a unique OTIF percentage by:
  1. Adjusting delivery counts to allow for more granular percentages
  2. Setting exact OTIF counts to achieve target percentages
  3. Creating perfectly sequential scores with no duplicates

  Target percentages for top 10:
  1. 98.50%
  2. 98.00%
  3. 97.78%
  4. 97.50%
  5. 97.22%
  6. 97.00%
  7. 96.67%
  8. 96.50%
  9. 96.11%
  10. 96.00%
*/

DO $$
DECLARE
  supplier_rec RECORD;
  target_deliveries INT;
  target_otif INT;
  current_deliveries INT;
  records_to_add INT;
  records_to_remove INT;
BEGIN
  -- Create lookup table for exact target configurations
  CREATE TEMP TABLE supplier_targets (
    supplier_name TEXT,
    main_category_code TEXT,
    target_total INT,
    target_otif INT,
    target_percentage NUMERIC
  );

  -- OVERALL TOP 10 (mixed categories)
  INSERT INTO supplier_targets VALUES
    ('PT Nusantara Logistik Prima', 'A', 200, 197, 98.50),
    ('PT Mesin Nusantara Utama', 'A', 200, 196, 98.00),
    ('PT Turbo Engineering Indonesia', 'A', 180, 176, 97.78),
    ('PT Energi Teknologi Indonesia', 'B', 200, 195, 97.50),
    ('PT Engineering Power Solutions', 'F', 180, 175, 97.22),
    ('PT Turbine Systems International', 'A', 200, 194, 97.00),
    ('PT Komponen Industri Prima', 'A', 180, 174, 96.67),
    ('PT Konstruksi Pembangkit Nusantara', 'F', 200, 193, 96.50),
    ('PT Beton Perkasa Indonesia', 'B', 180, 173, 96.11),
    ('PT Precision Parts Manufacturing', 'A', 200, 192, 96.00);

  -- Process each supplier target
  FOR supplier_rec IN SELECT * FROM supplier_targets LOOP
    -- Get current delivery count for this supplier
    SELECT COUNT(*) INTO current_deliveries
    FROM supplier_otif_deliveries
    WHERE supplier_name = supplier_rec.supplier_name
      AND main_category_code = supplier_rec.main_category_code;

    -- Adjust total delivery count if needed
    IF current_deliveries < supplier_rec.target_total THEN
      -- Add new delivery records
      records_to_add := supplier_rec.target_total - current_deliveries;
      
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
        main_category_code,
        contract_id
      )
      SELECT 
        'ORG001',
        'PO-' || LPAD((FLOOR(RANDOM() * 900000) + 100000)::TEXT, 7, '0'),
        supplier_rec.supplier_name,
        supplier_rec.supplier_name,
        CURRENT_DATE - (FLOOR(RANDOM() * 365) + 30)::INT,
        CURRENT_DATE - (FLOOR(RANDOM() * 365))::INT,
        CURRENT_DATE - (FLOOR(RANDOM() * 365))::INT,
        ROUND((RANDOM() * 900 + 100)::NUMERIC, 2),
        ROUND((RANDOM() * 900 + 100)::NUMERIC, 2),
        true,
        true,
        true,
        'delivered',
        0,
        supplier_rec.main_category_code,
        'CTR-' || LPAD((FLOOR(RANDOM() * 900000) + 100000)::TEXT, 7, '0')
      FROM generate_series(1, records_to_add);
      
    ELSIF current_deliveries > supplier_rec.target_total THEN
      -- Remove excess records
      records_to_remove := current_deliveries - supplier_rec.target_total;
      
      DELETE FROM supplier_otif_deliveries
      WHERE id IN (
        SELECT id
        FROM supplier_otif_deliveries
        WHERE supplier_name = supplier_rec.supplier_name
          AND main_category_code = supplier_rec.main_category_code
        ORDER BY RANDOM()
        LIMIT records_to_remove
      );
    END IF;

    -- Now set exact OTIF count
    -- First, set all to NOT OTIF
    UPDATE supplier_otif_deliveries
    SET is_otif = false,
        is_on_time = false,
        delay_days = ROUND(1 + RANDOM() * 5)
    WHERE supplier_name = supplier_rec.supplier_name
      AND main_category_code = supplier_rec.main_category_code;

    -- Then set exactly target_otif records to OTIF
    UPDATE supplier_otif_deliveries
    SET is_otif = true,
        is_on_time = true,
        is_in_full = true,
        delay_days = 0
    WHERE id IN (
      SELECT id
      FROM supplier_otif_deliveries
      WHERE supplier_name = supplier_rec.supplier_name
        AND main_category_code = supplier_rec.main_category_code
      ORDER BY RANDOM()
      LIMIT supplier_rec.target_otif
    );
  END LOOP;

  DROP TABLE supplier_targets;
END $$;
