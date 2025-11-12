/*
  # Create Comprehensive OTIF Category Leaderboards
  
  1. Purpose
    - Create 6 complete leaderboards: Overall + 5 Categories (A-E)
    - Each leaderboard has Top 10 suppliers with unique sequential percentages
    - No duplicate scores within each category
    
  2. Structure
    - Overall Top 10: 98.5% down to 89.5% (1% steps)
    - Category A Top 10: 97.8% down to 88.8% (1% steps)
    - Category B Top 10: 96.9% down to 87.9% (1% steps)
    - Category C Top 10: 95.7% down to 86.7% (1% steps)
    - Category D Top 10: 94.6% down to 85.6% (1% steps)
    - Category E Top 10: 93.4% down to 84.4% (1% steps)
    
  3. Data Features
    - 60+ unique fictional supplier companies
    - Realistic contract counts per category
    - Precise OTIF percentages matching targets
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
  v_category_name TEXT;
BEGIN
  -- ===========================================
  -- OVERALL TOP 10 SUPPLIERS (Multi-Category)
  -- ===========================================
  FOR v_supplier_record IN (
    SELECT * FROM (VALUES
      ('SUP-001', 'PT Nusantara Logistik Prima', 98.5, 52, 200, 'Peralatan dan Komponen Mesin'),
      ('SUP-002', 'PT Global Material Solutions', 97.5, 48, 200, 'Peralatan Listrik dan Elektronik'),
      ('SUP-003', 'PT Turbine Systems International', 96.5, 45, 200, 'Peralatan dan Komponen Mesin'),
      ('SUP-004', 'PT Jaya Konsultan Energi', 95.5, 50, 200, 'Jasa Pemeliharaan dan Perbaikan'),
      ('SUP-005', 'PT Cahaya Listrik Indonesia', 94.5, 46, 200, 'Peralatan Listrik dan Elektronik'),
      ('SUP-006', 'PT Mega Power Equipment', 93.5, 44, 200, 'Peralatan dan Komponen Mesin'),
      ('SUP-007', 'PT Sentosa Engineering Works', 92.5, 42, 200, 'Bahan Kimia dan Material'),
      ('SUP-008', 'PT Indo Thermal Solutions', 91.5, 40, 200, 'Peralatan Keselamatan'),
      ('SUP-009', 'PT Wijaya Industrial Supply', 90.5, 38, 200, 'Peralatan dan Komponen Mesin'),
      ('SUP-010', 'PT Karya Mandiri Electric', 89.5, 36, 200, 'Peralatan Listrik dan Elektronik')
    ) AS t(supplier_id, supplier_name, target_otif_pct, contract_count, base_deliveries, main_category)
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
          ELSE 'Industrial Materials'
        END,
        v_supplier_record.main_category,
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
            ELSE 'Industrial Materials'
          END,
          v_supplier_record.main_category,
          NOW(), NOW()
        );
      END;
    END LOOP;
  END LOOP;

  -- ========================================
  -- CATEGORY A: Peralatan dan Komponen Mesin
  -- Top 10: 97.8% - 88.8%
  -- ========================================
  v_category_name := 'Peralatan dan Komponen Mesin';
  FOR v_supplier_record IN (
    SELECT * FROM (VALUES
      ('SUP-A01', 'PT Mesin Nusantara Utama', 97.8, 35, 150),
      ('SUP-A02', 'PT Komponen Industri Prima', 96.8, 32, 150),
      ('SUP-A03', 'PT Turbo Engineering Indonesia', 95.8, 30, 150),
      ('SUP-A04', 'PT Precision Parts Manufacturing', 94.8, 28, 150),
      ('SUP-A05', 'PT Generator Systems Asia', 93.8, 26, 150),
      ('SUP-A06', 'PT Mechanical Solutions Pro', 92.8, 24, 150),
      ('SUP-A07', 'PT Indo Machine Components', 91.8, 22, 150),
      ('SUP-A08', 'PT Turbine Parts Specialist', 90.8, 20, 150),
      ('SUP-A09', 'PT Power Equipment Supply', 89.8, 18, 150),
      ('SUP-A10', 'PT Industrial Machinery Hub', 88.8, 16, 150)
    ) AS t(supplier_id, supplier_name, target_otif_pct, contract_count, base_deliveries)
  ) LOOP
    v_total_deliveries := v_supplier_record.base_deliveries;
    v_otif_count := ROUND(v_total_deliveries * v_supplier_record.target_otif_pct / 100)::INT;
    v_non_otif_count := v_total_deliveries - v_otif_count;
    
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
        v_org_id, v_supplier_record.supplier_id || '-PO-' || LPAD(v_po_num::TEXT, 4, '0'),
        v_supplier_record.supplier_id, v_supplier_record.supplier_name,
        v_current_date - 30, v_current_date, v_current_date,
        100 + (RANDOM() * 900)::INT, 100 + (RANDOM() * 900)::INT,
        TRUE, TRUE, TRUE, 'Completed', 0, 0,
        CASE (RANDOM() * 3)::INT
          WHEN 0 THEN 'Spare Part Turbine'
          WHEN 1 THEN 'Generator Components'
          ELSE 'Mechanical Equipment'
        END,
        v_category_name, NOW(), NOW()
      );
    END LOOP;
    
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
          v_org_id, v_supplier_record.supplier_id || '-PO-' || LPAD(v_po_num::TEXT, 4, '0'),
          v_supplier_record.supplier_id, v_supplier_record.supplier_name,
          v_current_date - 30, v_current_date, v_current_date + v_delay,
          v_qty_ordered,
          CASE WHEN v_is_late THEN v_qty_ordered ELSE v_qty_ordered * (0.75 + RANDOM() * 0.2) END,
          NOT v_is_late, v_is_late, FALSE, 'Delayed/Incomplete',
          v_delay,
          CASE WHEN v_is_late THEN 0 ELSE v_qty_ordered * (0.05 + RANDOM() * 0.2) END,
          'Mechanical Equipment', v_category_name, NOW(), NOW()
        );
      END;
    END LOOP;
  END LOOP;

  -- ==========================================
  -- CATEGORY B: Peralatan Listrik dan Elektronik
  -- Top 10: 96.9% - 87.9%
  -- ==========================================
  v_category_name := 'Peralatan Listrik dan Elektronik';
  FOR v_supplier_record IN (
    SELECT * FROM (VALUES
      ('SUP-B01', 'PT Elektronik Maju Jaya', 96.9, 38, 150),
      ('SUP-B02', 'PT Listrik Prima Indonesia', 95.9, 36, 150),
      ('SUP-B03', 'PT Digital Control Systems', 94.9, 34, 150),
      ('SUP-B04', 'PT Electrical Component Pro', 93.9, 32, 150),
      ('SUP-B05', 'PT Smart Automation Tech', 92.9, 30, 150),
      ('SUP-B06', 'PT Power Electronics Supply', 91.9, 28, 150),
      ('SUP-B07', 'PT Industrial Electronics Co', 90.9, 26, 150),
      ('SUP-B08', 'PT Circuit Breaker Solutions', 89.9, 24, 150),
      ('SUP-B09', 'PT Transformer Systems Ltd', 88.9, 22, 150),
      ('SUP-B10', 'PT Electrical Equipment Hub', 87.9, 20, 150)
    ) AS t(supplier_id, supplier_name, target_otif_pct, contract_count, base_deliveries)
  ) LOOP
    v_total_deliveries := v_supplier_record.base_deliveries;
    v_otif_count := ROUND(v_total_deliveries * v_supplier_record.target_otif_pct / 100)::INT;
    v_non_otif_count := v_total_deliveries - v_otif_count;
    
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
        v_org_id, v_supplier_record.supplier_id || '-PO-' || LPAD(v_po_num::TEXT, 4, '0'),
        v_supplier_record.supplier_id, v_supplier_record.supplier_name,
        v_current_date - 30, v_current_date, v_current_date,
        100 + (RANDOM() * 900)::INT, 100 + (RANDOM() * 900)::INT,
        TRUE, TRUE, TRUE, 'Completed', 0, 0,
        CASE (RANDOM() * 3)::INT
          WHEN 0 THEN 'Electrical Equipment'
          WHEN 1 THEN 'Control Systems'
          ELSE 'Electronic Components'
        END,
        v_category_name, NOW(), NOW()
      );
    END LOOP;
    
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
          v_org_id, v_supplier_record.supplier_id || '-PO-' || LPAD(v_po_num::TEXT, 4, '0'),
          v_supplier_record.supplier_id, v_supplier_record.supplier_name,
          v_current_date - 30, v_current_date, v_current_date + v_delay,
          v_qty_ordered,
          CASE WHEN v_is_late THEN v_qty_ordered ELSE v_qty_ordered * (0.75 + RANDOM() * 0.2) END,
          NOT v_is_late, v_is_late, FALSE, 'Delayed/Incomplete',
          v_delay,
          CASE WHEN v_is_late THEN 0 ELSE v_qty_ordered * (0.05 + RANDOM() * 0.2) END,
          'Electronic Components', v_category_name, NOW(), NOW()
        );
      END;
    END LOOP;
  END LOOP;

  -- ==========================================
  -- CATEGORY C: Jasa Pemeliharaan dan Perbaikan
  -- Top 10: 95.7% - 86.7%
  -- ==========================================
  v_category_name := 'Jasa Pemeliharaan dan Perbaikan';
  FOR v_supplier_record IN (
    SELECT * FROM (VALUES
      ('SUP-C01', 'PT Maintenance Excellence Pro', 95.7, 40, 150),
      ('SUP-C02', 'PT Service Teknik Terpadu', 94.7, 38, 150),
      ('SUP-C03', 'PT Perbaikan Industri Mandiri', 93.7, 36, 150),
      ('SUP-C04', 'PT Overhaul Specialist Team', 92.7, 34, 150),
      ('SUP-C05', 'PT Preventive Care Solutions', 91.7, 32, 150),
      ('SUP-C06', 'PT Technical Support Services', 90.7, 30, 150),
      ('SUP-C07', 'PT Repair Workshop Indonesia', 89.7, 28, 150),
      ('SUP-C08', 'PT Maintenance Plus Network', 88.7, 26, 150),
      ('SUP-C09', 'PT Service Quality Partners', 87.7, 24, 150),
      ('SUP-C10', 'PT Industrial Care Group', 86.7, 22, 150)
    ) AS t(supplier_id, supplier_name, target_otif_pct, contract_count, base_deliveries)
  ) LOOP
    v_total_deliveries := v_supplier_record.base_deliveries;
    v_otif_count := ROUND(v_total_deliveries * v_supplier_record.target_otif_pct / 100)::INT;
    v_non_otif_count := v_total_deliveries - v_otif_count;
    
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
        v_org_id, v_supplier_record.supplier_id || '-PO-' || LPAD(v_po_num::TEXT, 4, '0'),
        v_supplier_record.supplier_id, v_supplier_record.supplier_name,
        v_current_date - 30, v_current_date, v_current_date,
        100 + (RANDOM() * 900)::INT, 100 + (RANDOM() * 900)::INT,
        TRUE, TRUE, TRUE, 'Completed', 0, 0,
        CASE (RANDOM() * 3)::INT
          WHEN 0 THEN 'Maintenance Services'
          WHEN 1 THEN 'Repair Services'
          ELSE 'Overhaul Services'
        END,
        v_category_name, NOW(), NOW()
      );
    END LOOP;
    
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
          v_org_id, v_supplier_record.supplier_id || '-PO-' || LPAD(v_po_num::TEXT, 4, '0'),
          v_supplier_record.supplier_id, v_supplier_record.supplier_name,
          v_current_date - 30, v_current_date, v_current_date + v_delay,
          v_qty_ordered,
          CASE WHEN v_is_late THEN v_qty_ordered ELSE v_qty_ordered * (0.75 + RANDOM() * 0.2) END,
          NOT v_is_late, v_is_late, FALSE, 'Delayed/Incomplete',
          v_delay,
          CASE WHEN v_is_late THEN 0 ELSE v_qty_ordered * (0.05 + RANDOM() * 0.2) END,
          'Maintenance Services', v_category_name, NOW(), NOW()
        );
      END;
    END LOOP;
  END LOOP;

  -- ==========================================
  -- CATEGORY D: Bahan Kimia dan Material
  -- Top 10: 94.6% - 85.6%
  -- ==========================================
  v_category_name := 'Bahan Kimia dan Material';
  FOR v_supplier_record IN (
    SELECT * FROM (VALUES
      ('SUP-D01', 'PT Chemical Industries Indonesia', 94.6, 34, 150),
      ('SUP-D02', 'PT Material Suplai Nusantara', 93.6, 32, 150),
      ('SUP-D03', 'PT Lubricant Solutions Pro', 92.6, 30, 150),
      ('SUP-D04', 'PT Industrial Chemicals Hub', 91.6, 28, 150),
      ('SUP-D05', 'PT Oil and Grease Supply', 90.6, 26, 150),
      ('SUP-D06', 'PT Coating Materials Expert', 89.6, 24, 150),
      ('SUP-D07', 'PT Raw Materials Trading', 88.6, 22, 150),
      ('SUP-D08', 'PT Chemical Treatment Co', 87.6, 20, 150),
      ('SUP-D09', 'PT Special Materials Group', 86.6, 18, 150),
      ('SUP-D10', 'PT Industrial Substance Ltd', 85.6, 16, 150)
    ) AS t(supplier_id, supplier_name, target_otif_pct, contract_count, base_deliveries)
  ) LOOP
    v_total_deliveries := v_supplier_record.base_deliveries;
    v_otif_count := ROUND(v_total_deliveries * v_supplier_record.target_otif_pct / 100)::INT;
    v_non_otif_count := v_total_deliveries - v_otif_count;
    
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
        v_org_id, v_supplier_record.supplier_id || '-PO-' || LPAD(v_po_num::TEXT, 4, '0'),
        v_supplier_record.supplier_id, v_supplier_record.supplier_name,
        v_current_date - 30, v_current_date, v_current_date,
        100 + (RANDOM() * 900)::INT, 100 + (RANDOM() * 900)::INT,
        TRUE, TRUE, TRUE, 'Completed', 0, 0,
        CASE (RANDOM() * 3)::INT
          WHEN 0 THEN 'Industrial Chemicals'
          WHEN 1 THEN 'Lubricants'
          ELSE 'Raw Materials'
        END,
        v_category_name, NOW(), NOW()
      );
    END LOOP;
    
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
          v_org_id, v_supplier_record.supplier_id || '-PO-' || LPAD(v_po_num::TEXT, 4, '0'),
          v_supplier_record.supplier_id, v_supplier_record.supplier_name,
          v_current_date - 30, v_current_date, v_current_date + v_delay,
          v_qty_ordered,
          CASE WHEN v_is_late THEN v_qty_ordered ELSE v_qty_ordered * (0.75 + RANDOM() * 0.2) END,
          NOT v_is_late, v_is_late, FALSE, 'Delayed/Incomplete',
          v_delay,
          CASE WHEN v_is_late THEN 0 ELSE v_qty_ordered * (0.05 + RANDOM() * 0.2) END,
          'Industrial Chemicals', v_category_name, NOW(), NOW()
        );
      END;
    END LOOP;
  END LOOP;

  -- ==========================================
  -- CATEGORY E: Peralatan Keselamatan
  -- Top 10: 93.4% - 84.4%
  -- ==========================================
  v_category_name := 'Peralatan Keselamatan';
  FOR v_supplier_record IN (
    SELECT * FROM (VALUES
      ('SUP-E01', 'PT Safety Equipment Pro', 93.4, 30, 150),
      ('SUP-E02', 'PT Alat Pelindung Diri Indonesia', 92.4, 28, 150),
      ('SUP-E03', 'PT Fire Protection Systems', 91.4, 26, 150),
      ('SUP-E04', 'PT Personal Protection Gear', 90.4, 24, 150),
      ('SUP-E05', 'PT Industrial Safety Supply', 89.4, 22, 150),
      ('SUP-E06', 'PT Emergency Response Equipment', 88.4, 20, 150),
      ('SUP-E07', 'PT Safety First Solutions', 87.4, 18, 150),
      ('SUP-E08', 'PT Protective Wear Specialist', 86.4, 16, 150),
      ('SUP-E09', 'PT Workplace Safety Hub', 85.4, 14, 150),
      ('SUP-E10', 'PT Security Systems Provider', 84.4, 12, 150)
    ) AS t(supplier_id, supplier_name, target_otif_pct, contract_count, base_deliveries)
  ) LOOP
    v_total_deliveries := v_supplier_record.base_deliveries;
    v_otif_count := ROUND(v_total_deliveries * v_supplier_record.target_otif_pct / 100)::INT;
    v_non_otif_count := v_total_deliveries - v_otif_count;
    
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
        v_org_id, v_supplier_record.supplier_id || '-PO-' || LPAD(v_po_num::TEXT, 4, '0'),
        v_supplier_record.supplier_id, v_supplier_record.supplier_name,
        v_current_date - 30, v_current_date, v_current_date,
        100 + (RANDOM() * 900)::INT, 100 + (RANDOM() * 900)::INT,
        TRUE, TRUE, TRUE, 'Completed', 0, 0,
        CASE (RANDOM() * 3)::INT
          WHEN 0 THEN 'Safety Equipment'
          WHEN 1 THEN 'Protective Gear'
          ELSE 'Fire Protection'
        END,
        v_category_name, NOW(), NOW()
      );
    END LOOP;
    
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
          v_org_id, v_supplier_record.supplier_id || '-PO-' || LPAD(v_po_num::TEXT, 4, '0'),
          v_supplier_record.supplier_id, v_supplier_record.supplier_name,
          v_current_date - 30, v_current_date, v_current_date + v_delay,
          v_qty_ordered,
          CASE WHEN v_is_late THEN v_qty_ordered ELSE v_qty_ordered * (0.75 + RANDOM() * 0.2) END,
          NOT v_is_late, v_is_late, FALSE, 'Delayed/Incomplete',
          v_delay,
          CASE WHEN v_is_late THEN 0 ELSE v_qty_ordered * (0.05 + RANDOM() * 0.2) END,
          'Safety Equipment', v_category_name, NOW(), NOW()
        );
      END;
    END LOOP;
  END LOOP;

END $$;
