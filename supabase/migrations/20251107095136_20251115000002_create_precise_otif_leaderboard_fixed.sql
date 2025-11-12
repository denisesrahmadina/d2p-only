/*
  # Create Precise OTIF Supplier Leaderboard
  
  1. Purpose
    - Create exact OTIF percentages for top 20 suppliers
    - Sequential decreasing percentages with no duplicates
    - Precise calculation to match target percentages exactly
  
  2. Data Structure
    - Rank 1: 98.5%, Rank 2: 97.5%, Rank 3: 96.5%, etc.
    - Each supplier has exact calculated deliveries to match percentage
*/

-- Clear existing data
TRUNCATE TABLE supplier_otif_deliveries CASCADE;

DO $$
DECLARE
  v_org_id TEXT := 'ID-POWER-001';
  v_supplier_record RECORD;
  v_total_deliveries INT;
  v_otif_count INT;
  v_non_otif_count INT;
  v_delivery_num INT;
  v_po_num INT;
  v_current_date DATE;
BEGIN
  -- Create suppliers with exact OTIF percentages
  FOR v_supplier_record IN (
    SELECT * FROM (VALUES
      ('SUP-001', 'PT Nusantara Logistik Prima', 98.5, 52, 200),
      ('SUP-002', 'PT Global Material Solutions', 97.5, 46, 200),
      ('SUP-003', 'PT Turbine Systems International', 96.5, 38, 200),
      ('SUP-004', 'PT Jaya Konsultan Energi', 95.5, 44, 200),
      ('SUP-005', 'PT Cahaya Listrik Indonesia', 94.5, 41, 200),
      ('SUP-006', 'PT Mega Power Equipment', 93.5, 36, 200),
      ('SUP-007', 'PT Sentosa Engineering Works', 92.5, 39, 200),
      ('SUP-008', 'PT Indo Thermal Solutions', 91.5, 35, 200),
      ('SUP-009', 'PT Wijaya Industrial Supply', 90.5, 42, 200),
      ('SUP-010', 'PT Karya Mandiri Electric', 89.5, 33, 200),
      ('SUP-011', 'PT Bintang Maintenance Services', 88.5, 37, 200),
      ('SUP-012', 'PT Sarana Power Components', 87.5, 31, 200),
      ('SUP-013', 'PT Teknologi Energi Nusantara', 86.5, 34, 200),
      ('SUP-014', 'PT Mitra Pasokan Industri', 85.5, 29, 200),
      ('SUP-015', 'PT Sumber Daya Equipment', 84.5, 32, 200),
      ('SUP-016', 'PT Anugrah Tehnik Listrik', 83.5, 28, 200),
      ('SUP-017', 'PT Persada Industrial Parts', 82.5, 30, 200),
      ('SUP-018', 'PT Indomax Supply Chain', 81.5, 26, 200),
      ('SUP-019', 'PT Graha Komponen Elektrik', 80.5, 27, 200),
      ('SUP-020', 'PT Bangun Makmur Materials', 79.5, 25, 200)
    ) AS t(supplier_id, supplier_name, target_otif_pct, contract_count, base_deliveries)
  ) LOOP
    v_total_deliveries := v_supplier_record.base_deliveries;
    v_otif_count := ROUND(v_total_deliveries * v_supplier_record.target_otif_pct / 100)::INT;
    v_non_otif_count := v_total_deliveries - v_otif_count;
    
    -- Generate OTIF deliveries
    FOR v_delivery_num IN 1..v_otif_count LOOP
      v_po_num := ((v_delivery_num - 1) / 4) + 1;
      v_current_date := CURRENT_DATE - (RANDOM() * 180)::INT;
      
      INSERT INTO supplier_otif_deliveries (
        organization_id, purchase_order_id, supplier_id, supplier_name,
        order_date, expected_delivery_date, actual_delivery_date,
        quantity_ordered, quantity_delivered,
        is_on_time, is_in_full, is_otif, delivery_status,
        delay_days, quantity_shortage, product_category, main_category,
        created_at, updated_at
      ) VALUES (
        v_org_id,
        v_supplier_record.supplier_id || '-PO-' || LPAD(v_po_num::TEXT, 4, '0'),
        v_supplier_record.supplier_id, v_supplier_record.supplier_name,
        v_current_date - 30, v_current_date, v_current_date,
        100 + (RANDOM() * 900)::INT, 100 + (RANDOM() * 900)::INT,
        TRUE, TRUE, TRUE, 'Completed', 0, 0,
        CASE (RANDOM() * 5)::INT
          WHEN 0 THEN 'Spare Part Turbine'
          WHEN 1 THEN 'Generator Components'
          WHEN 2 THEN 'Electrical Equipment'
          WHEN 3 THEN 'Control Systems'
          ELSE 'Maintenance Services'
        END,
        CASE (RANDOM() * 3)::INT
          WHEN 0 THEN 'Peralatan dan Komponen Mesin'
          WHEN 1 THEN 'Peralatan Listrik dan Elektronik'
          ELSE 'Jasa Pemeliharaan dan Perbaikan'
        END,
        NOW(), NOW()
      );
    END LOOP;
    
    -- Generate NON-OTIF deliveries
    FOR v_delivery_num IN 1..v_non_otif_count LOOP
      v_po_num := ((v_otif_count + v_delivery_num - 1) / 4) + 1;
      v_current_date := CURRENT_DATE - (RANDOM() * 180)::INT;
      
      DECLARE
        v_is_late BOOLEAN := RANDOM() < 0.6;
        v_delay INT := CASE WHEN v_is_late THEN 1 + (RANDOM() * 14)::INT ELSE 0 END;
        v_qty_ordered NUMERIC := 100 + (RANDOM() * 900)::INT;
      BEGIN
        INSERT INTO supplier_otif_deliveries (
          organization_id, purchase_order_id, supplier_id, supplier_name,
          order_date, expected_delivery_date, actual_delivery_date,
          quantity_ordered, quantity_delivered,
          is_on_time, is_in_full, is_otif, delivery_status,
          delay_days, quantity_shortage, product_category, main_category,
          created_at, updated_at
        ) VALUES (
          v_org_id,
          v_supplier_record.supplier_id || '-PO-' || LPAD(v_po_num::TEXT, 4, '0'),
          v_supplier_record.supplier_id, v_supplier_record.supplier_name,
          v_current_date - 30, v_current_date, v_current_date + v_delay,
          v_qty_ordered,
          CASE WHEN v_is_late THEN v_qty_ordered ELSE v_qty_ordered * (0.75 + RANDOM() * 0.2) END,
          NOT v_is_late, v_is_late, FALSE, 'Delayed/Incomplete',
          v_delay,
          CASE WHEN v_is_late THEN 0 ELSE v_qty_ordered * (0.05 + RANDOM() * 0.2) END,
          CASE (RANDOM() * 5)::INT
            WHEN 0 THEN 'Spare Part Turbine'
            WHEN 1 THEN 'Generator Components'
            WHEN 2 THEN 'Electrical Equipment'
            WHEN 3 THEN 'Control Systems'
            ELSE 'Maintenance Services'
          END,
          CASE (RANDOM() * 3)::INT
            WHEN 0 THEN 'Peralatan dan Komponen Mesin'
            WHEN 1 THEN 'Peralatan Listrik dan Elektronik'
            ELSE 'Jasa Pemeliharaan dan Perbaikan'
          END,
          NOW(), NOW()
        );
      END;
    END LOOP;
  END LOOP;
END $$;
