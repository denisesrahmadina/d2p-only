/*
  # Create Perfect OTIF Leaderboards with Category F
  
  1. Purpose
    - Replace existing data with perfect sequential scores
    - Overall Top 10: 98.5%, 98.0%, 96.7%, 97%, 96%, 95%, 94%, 93%, 92%, 91%
    - Category F Top 10: 97.2% down to 88.2% (1% steps)
    - All unique suppliers with unique scores
    
  2. Categories
    - Overall: Multi-category top performers
    - Category F: Peralatan Utama Pembangkit dan Project EPC
*/

-- Clear ALL existing OTIF data for fresh start
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
  -- ==========================================
  -- OVERALL TOP 10 SUPPLIERS
  -- Exact percentages: 98.5%, 98.0%, 96.7%, 97%, 96%, 95%, 94%, 93%, 92%, 91%
  -- ==========================================
  FOR v_supplier_record IN (
    SELECT * FROM (VALUES
      ('SUP-001', 'PT Nusantara Logistik Prima', 98.5, 50, 200, 'A'),
      ('SUP-002', 'PT Mesin Nusantara Utama', 98.0, 38, 200, 'A'),
      ('SUP-003', 'PT Komponen Industri Prima', 96.7, 38, 200, 'A'),
      ('SUP-004', 'PT Turbine Systems International', 97.0, 50, 200, 'A'),
      ('SUP-005', 'PT Turbo Engineering Indonesia', 96.0, 38, 200, 'A'),
      ('SUP-006', 'PT Precision Parts Manufacturing', 95.0, 38, 200, 'A'),
      ('SUP-007', 'PT Generator Systems Asia', 94.0, 38, 200, 'A'),
      ('SUP-008', 'PT Mega Power Equipment', 93.0, 50, 200, 'A'),
      ('SUP-009', 'PT Mechanical Solutions Pro', 92.0, 38, 200, 'A'),
      ('SUP-010', 'PT Indo Machine Components', 91.0, 38, 200, 'A')
    ) AS t(supplier_id, supplier_name, target_otif_pct, contract_count, base_deliveries, category_code)
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
        delay_days, quantity_shortage, product_category, main_category, main_category_code,
        created_at, updated_at
      ) VALUES (
        v_org_id,
        v_supplier_record.supplier_id || '-PO-' || LPAD(v_po_num::TEXT, 4, '0'),
        v_supplier_record.supplier_id, v_supplier_record.supplier_name,
        v_current_date - 30, v_current_date, v_current_date,
        100 + (RANDOM() * 900)::INT, 100 + (RANDOM() * 900)::INT,
        TRUE, TRUE, TRUE, 'Completed', 0, 0,
        'Mechanical Equipment', 'Peralatan dan Komponen Mesin', v_supplier_record.category_code,
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
          delay_days, quantity_shortage, product_category, main_category, main_category_code,
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
          'Mechanical Equipment', 'Peralatan dan Komponen Mesin', v_supplier_record.category_code,
          NOW(), NOW()
        );
      END;
    END LOOP;
  END LOOP;

  -- ==========================================
  -- CATEGORY F: Peralatan Utama Pembangkit dan Project EPC
  -- Top 10: 97.2% down to 88.2% (1% steps)
  -- ==========================================
  FOR v_supplier_record IN (
    SELECT * FROM (VALUES
      ('SUP-F01', 'PT Konstruksi Pembangkit Nusantara', 97.2, 45, 180, 'F'),
      ('SUP-F02', 'PT Engineering Power Solutions', 96.2, 42, 180, 'F'),
      ('SUP-F03', 'PT Listrik Proyek Indonesia', 95.2, 40, 180, 'F'),
      ('SUP-F04', 'PT Pembangkit Energi Prima', 94.2, 38, 180, 'F'),
      ('SUP-F05', 'PT EPC Kontrak Specialist', 93.2, 35, 180, 'F'),
      ('SUP-F06', 'PT Utama Power Projects', 92.2, 33, 180, 'F'),
      ('SUP-F07', 'PT Konstruksi Elektrik Maju', 91.2, 30, 180, 'F'),
      ('SUP-F08', 'PT Project Management Indonesia', 90.2, 28, 180, 'F'),
      ('SUP-F09', 'PT Instalasi Pembangkit Mandiri', 89.2, 25, 180, 'F'),
      ('SUP-F10', 'PT EPC Engineering Services', 88.2, 22, 180, 'F')
    ) AS t(supplier_id, supplier_name, target_otif_pct, contract_count, base_deliveries, category_code)
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
        delay_days, quantity_shortage, product_category, main_category, main_category_code,
        created_at, updated_at
      ) VALUES (
        v_org_id,
        v_supplier_record.supplier_id || '-PO-' || LPAD(v_po_num::TEXT, 4, '0'),
        v_supplier_record.supplier_id, v_supplier_record.supplier_name,
        v_current_date - 30, v_current_date, v_current_date,
        100 + (RANDOM() * 900)::INT, 100 + (RANDOM() * 900)::INT,
        TRUE, TRUE, TRUE, 'Completed', 0, 0,
        CASE (RANDOM() * 3)::INT
          WHEN 0 THEN 'Power Plant Equipment'
          WHEN 1 THEN 'EPC Project Materials'
          ELSE 'Construction Equipment'
        END,
        'Peralatan Utama Pembangkit dan Project EPC', v_supplier_record.category_code,
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
          delay_days, quantity_shortage, product_category, main_category, main_category_code,
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
          'EPC Project Materials', 'Peralatan Utama Pembangkit dan Project EPC', v_supplier_record.category_code,
          NOW(), NOW()
        );
      END;
    END LOOP;
  END LOOP;

END $$;
