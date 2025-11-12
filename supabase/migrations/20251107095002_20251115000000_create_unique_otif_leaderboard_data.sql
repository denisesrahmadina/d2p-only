/*
  # Create Unique OTIF Supplier Leaderboard Data
  
  1. Purpose
    - Create a complete leaderboard of 20 suppliers with unique OTIF percentages
    - Each supplier has sequential, non-repeating scores
    - Includes supplier name, contract count, and performance metrics
  
  2. Data Structure
    - Rank 1-20 suppliers from 98.5% down to 79.5% (1% decrements)
    - Realistic contract counts varying between suppliers
    - All fictional company names
  
  3. Changes
    - Clear existing OTIF delivery data
    - Insert new comprehensive supplier performance data
*/

-- Clear existing OTIF data for clean slate
TRUNCATE TABLE supplier_otif_deliveries CASCADE;

-- Insert comprehensive leaderboard data with unique percentages
-- Top 20 Suppliers with descending OTIF percentages (no duplicates)

DO $$
DECLARE
  v_org_id TEXT := 'ID-POWER-001';
  v_supplier_data RECORD;
  v_po_counter INT;
  v_delivery_counter INT;
  v_total_deliveries INT;
  v_otif_deliveries INT;
  v_current_date DATE;
BEGIN
  -- Define supplier data with unique OTIF percentages
  FOR v_supplier_data IN (
    SELECT * FROM (VALUES
      -- Rank 1-3: Top Tier (98.5% - 96.5%)
      ('SUP-001', 'PT Nusantara Logistik Prima', 98.5, 52),
      ('SUP-002', 'PT Global Material Solutions', 97.5, 46),
      ('SUP-003', 'PT Turbine Systems International', 96.5, 38),
      
      -- Rank 4-6: Excellent Tier (95.5% - 93.5%)
      ('SUP-004', 'PT Jaya Konsultan Energi', 95.5, 44),
      ('SUP-005', 'PT Cahaya Listrik Indonesia', 94.5, 41),
      ('SUP-006', 'PT Mega Power Equipment', 93.5, 36),
      
      -- Rank 7-9: Good Tier (92.5% - 90.5%)
      ('SUP-007', 'PT Sentosa Engineering Works', 92.5, 39),
      ('SUP-008', 'PT Indo Thermal Solutions', 91.5, 35),
      ('SUP-009', 'PT Wijaya Industrial Supply', 90.5, 42),
      
      -- Rank 10-12: Above Average (89.5% - 87.5%)
      ('SUP-010', 'PT Karya Mandiri Electric', 89.5, 33),
      ('SUP-011', 'PT Bintang Maintenance Services', 88.5, 37),
      ('SUP-012', 'PT Sarana Power Components', 87.5, 31),
      
      -- Rank 13-15: Average (86.5% - 84.5%)
      ('SUP-013', 'PT Teknologi Energi Nusantara', 86.5, 34),
      ('SUP-014', 'PT Mitra Pasokan Industri', 85.5, 29),
      ('SUP-015', 'PT Sumber Daya Equipment', 84.5, 32),
      
      -- Rank 16-18: Below Average (83.5% - 81.5%)
      ('SUP-016', 'PT Anugrah Tehnik Listrik', 83.5, 28),
      ('SUP-017', 'PT Persada Industrial Parts', 82.5, 30),
      ('SUP-018', 'PT Indomax Supply Chain', 81.5, 26),
      
      -- Rank 19-20: Needs Improvement (80.5% - 79.5%)
      ('SUP-019', 'PT Graha Komponen Elektrik', 80.5, 27),
      ('SUP-020', 'PT Bangun Makmur Materials', 79.5, 25)
    ) AS t(supplier_id, supplier_name, otif_percentage, contract_count)
  ) LOOP
    -- Calculate deliveries based on OTIF percentage
    v_total_deliveries := v_supplier_data.contract_count * 4; -- 4 deliveries per contract on average
    v_otif_deliveries := ROUND(v_total_deliveries * v_supplier_data.otif_percentage / 100)::INT;
    
    -- Generate purchase orders and deliveries for each supplier
    FOR v_po_counter IN 1..v_supplier_data.contract_count LOOP
      -- Determine deliveries per PO (3-5 deliveries)
      DECLARE
        v_deliveries_per_po INT := 3 + (RANDOM() * 2)::INT;
        v_po_id TEXT := v_supplier_data.supplier_id || '-PO-' || LPAD(v_po_counter::TEXT, 4, '0');
      BEGIN
        FOR v_delivery_counter IN 1..v_deliveries_per_po LOOP
          -- Calculate delivery date (within last 6 months)
          v_current_date := CURRENT_DATE - (RANDOM() * 180)::INT;
          
          -- Determine if this delivery should be OTIF based on target percentage
          DECLARE
            v_is_otif BOOLEAN;
            v_is_on_time BOOLEAN;
            v_is_in_full BOOLEAN;
            v_delay_days INT;
            v_quantity_ordered NUMERIC;
            v_quantity_delivered NUMERIC;
            v_product_category TEXT;
            v_main_category TEXT;
          BEGIN
            -- Determine OTIF status to match target percentage
            v_is_otif := (RANDOM() * 100) <= v_supplier_data.otif_percentage;
            
            -- Set on-time and in-full based on OTIF
            IF v_is_otif THEN
              v_is_on_time := TRUE;
              v_is_in_full := TRUE;
              v_delay_days := 0;
              v_quantity_ordered := 100 + (RANDOM() * 900)::INT;
              v_quantity_delivered := v_quantity_ordered;
            ELSE
              -- Random failure: either late or incomplete
              IF RANDOM() < 0.6 THEN
                -- Late delivery
                v_is_on_time := FALSE;
                v_is_in_full := TRUE;
                v_delay_days := 1 + (RANDOM() * 14)::INT;
                v_quantity_ordered := 100 + (RANDOM() * 900)::INT;
                v_quantity_delivered := v_quantity_ordered;
              ELSE
                -- Incomplete delivery
                v_is_on_time := TRUE;
                v_is_in_full := FALSE;
                v_delay_days := 0;
                v_quantity_ordered := 100 + (RANDOM() * 900)::INT;
                v_quantity_delivered := v_quantity_ordered * (0.7 + RANDOM() * 0.25);
              END IF;
            END IF;
            
            -- Assign product category
            CASE (RANDOM() * 7)::INT
              WHEN 0 THEN 
                v_product_category := 'Spare Part Turbine';
                v_main_category := 'Peralatan dan Komponen Mesin';
              WHEN 1 THEN 
                v_product_category := 'Generator Components';
                v_main_category := 'Peralatan dan Komponen Mesin';
              WHEN 2 THEN 
                v_product_category := 'Electrical Equipment';
                v_main_category := 'Peralatan Listrik dan Elektronik';
              WHEN 3 THEN 
                v_product_category := 'Control Systems';
                v_main_category := 'Peralatan Listrik dan Elektronik';
              WHEN 4 THEN 
                v_product_category := 'Maintenance Services';
                v_main_category := 'Jasa Pemeliharaan dan Perbaikan';
              WHEN 5 THEN 
                v_product_category := 'Industrial Chemicals';
                v_main_category := 'Bahan Kimia dan Material';
              ELSE 
                v_product_category := 'Safety Equipment';
                v_main_category := 'Peralatan Keselamatan';
            END CASE;
            
            -- Insert delivery record
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
              main_category,
              created_at,
              updated_at
            ) VALUES (
              v_org_id,
              v_po_id,
              v_supplier_data.supplier_id,
              v_supplier_data.supplier_name,
              v_current_date - 30,
              v_current_date,
              CASE WHEN v_is_on_time THEN v_current_date ELSE v_current_date + v_delay_days END,
              v_quantity_ordered,
              v_quantity_delivered,
              v_is_on_time,
              v_is_in_full,
              v_is_otif,
              CASE WHEN v_is_otif THEN 'Completed' ELSE 'Delayed/Incomplete' END,
              v_delay_days,
              v_quantity_ordered - v_quantity_delivered,
              v_product_category,
              v_main_category,
              NOW(),
              NOW()
            );
          END;
        END LOOP;
      END;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Successfully created OTIF leaderboard data for 20 suppliers with unique percentages';
END $$;
