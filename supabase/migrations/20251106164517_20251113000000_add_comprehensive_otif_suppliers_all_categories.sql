/*
  # Add Comprehensive OTIF Supplier Data for All Categories

  1. Purpose
    - Ensure each of the 6 main categories (A-F) has 10-15 suppliers with realistic OTIF performance data
    - Generate mock deliveries for new suppliers to support Top 10 supplier rankings
    - Maintain realistic performance distribution (high, medium, low performers)

  2. New Mock Data
    - Additional suppliers for each category
    - Delivery records spanning 2024-2025
    - Realistic OTIF, on-time, and in-full performance metrics
    - Varied delivery counts per supplier (15-50 deliveries)

  3. Categories Coverage
    - Category A (Energi Primer): 15 suppliers total
    - Category B (Peralatan Mechanical/Electrical): 15 suppliers total
    - Category C (Material & Consumable): 15 suppliers total
    - Category D (Asset Non-Operasional): 15 suppliers total
    - Category E (Jasa & Kontrak): 15 suppliers total
    - Category F (Peralatan Pembangkit & EPC): 15 suppliers total
*/

-- Category A: Additional high-performing suppliers
DO $$
DECLARE
  v_category_id uuid;
  v_supplier_record RECORD;
  v_delivery_num INTEGER;
  v_is_success BOOLEAN;
BEGIN
  SELECT id INTO v_category_id FROM ref_procurement_categories WHERE main_category_code = 'A' LIMIT 1;
  
  -- Define suppliers with their performance rates
  FOR v_supplier_record IN (
    SELECT * FROM (VALUES 
      ('SUP-A501', 'PT Batubara Premium Indonesia', 0.96, 0.98, 0.94, 30),
      ('SUP-A502', 'CV Energi Bersih Nusantara', 0.94, 0.97, 0.91, 28),
      ('SUP-A503', 'PT Solar Energy Solutions', 0.91, 0.95, 0.88, 26),
      ('SUP-A504', 'CV Fuel Supply Expert', 0.88, 0.92, 0.83, 24),
      ('SUP-A505', 'PT Gas Alam Terpadu', 0.85, 0.90, 0.78, 22),
      ('SUP-A506', 'CV Batubara Kualitas Prima', 0.82, 0.87, 0.74, 20),
      ('SUP-A507', 'PT Biomass Energy Indo', 0.75, 0.82, 0.65, 18),
      ('SUP-A508', 'CV LNG Supply Chain', 0.70, 0.78, 0.58, 16)
    ) AS t(supplier_id, supplier_name, on_time_rate, in_full_rate, otif_rate, delivery_count)
  ) LOOP
    -- Generate deliveries for each supplier
    FOR v_delivery_num IN 1..v_supplier_record.delivery_count LOOP
      v_is_success := (RANDOM() < v_supplier_record.otif_rate);
      
      INSERT INTO supplier_otif_deliveries (
        organization_id, purchase_order_id, supplier_id, supplier_name,
        order_date, expected_delivery_date, actual_delivery_date,
        quantity_ordered, quantity_delivered,
        is_on_time, is_in_full, is_otif,
        delivery_status, delay_days, quantity_shortage,
        product_category, main_category, sub_category,
        contract_id, main_category_code, category_id
      ) VALUES (
        'ORG001',
        v_supplier_record.supplier_id || '-' || LPAD(v_delivery_num::text, 3, '0'),
        v_supplier_record.supplier_id,
        v_supplier_record.supplier_name,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER + 30,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER + 30 + CASE WHEN RANDOM() < v_supplier_record.on_time_rate THEN 0 ELSE (RANDOM() * 10)::INTEGER END,
        1000 + (RANDOM() * 9000)::NUMERIC,
        (1000 + (RANDOM() * 9000)::NUMERIC) * CASE WHEN RANDOM() < v_supplier_record.in_full_rate THEN 1.0 ELSE 0.85 + RANDOM() * 0.14 END,
        RANDOM() < v_supplier_record.on_time_rate,
        RANDOM() < v_supplier_record.in_full_rate,
        v_is_success,
        CASE WHEN v_is_success THEN 'Delivered' ELSE 'Delayed' END,
        CASE WHEN RANDOM() < v_supplier_record.on_time_rate THEN 0 ELSE (RANDOM() * 10)::INTEGER END,
        CASE WHEN RANDOM() < v_supplier_record.in_full_rate THEN 0 ELSE (RANDOM() * 500)::NUMERIC END,
        'Batubara & Energi',
        'Energi Primer dan Jasa Penunjangnya',
        'Bahan Bakar',
        'CONTRACT-' || v_supplier_record.supplier_id,
        'A',
        v_category_id
      );
    END LOOP;
  END LOOP;
END $$;

-- Category B: Additional suppliers
DO $$
DECLARE
  v_category_id uuid;
  v_supplier_record RECORD;
  v_delivery_num INTEGER;
  v_is_success BOOLEAN;
BEGIN
  SELECT id INTO v_category_id FROM ref_procurement_categories WHERE main_category_code = 'B' LIMIT 1;
  
  FOR v_supplier_record IN (
    SELECT * FROM (VALUES 
      ('SUP-B511', 'PT Turbin Teknologi Advanced', 0.96, 0.98, 0.94, 28),
      ('SUP-B512', 'CV Generator Precision', 0.93, 0.96, 0.89, 26),
      ('SUP-B513', 'PT Boiler Systems Pro', 0.90, 0.94, 0.86, 24),
      ('SUP-B514', 'CV Control Panel Expert', 0.87, 0.91, 0.81, 22),
      ('SUP-B515', 'PT Motor Listrik Prima', 0.84, 0.88, 0.76, 20),
      ('SUP-B516', 'CV Transformer Solutions', 0.79, 0.85, 0.70, 18),
      ('SUP-B517', 'PT Switchgear Indonesia', 0.74, 0.80, 0.63, 16),
      ('SUP-B518', 'CV Instrumentasi Akurat', 0.68, 0.75, 0.55, 15)
    ) AS t(supplier_id, supplier_name, on_time_rate, in_full_rate, otif_rate, delivery_count)
  ) LOOP
    FOR v_delivery_num IN 1..v_supplier_record.delivery_count LOOP
      v_is_success := (RANDOM() < v_supplier_record.otif_rate);
      
      INSERT INTO supplier_otif_deliveries (
        organization_id, purchase_order_id, supplier_id, supplier_name,
        order_date, expected_delivery_date, actual_delivery_date,
        quantity_ordered, quantity_delivered,
        is_on_time, is_in_full, is_otif,
        delivery_status, delay_days, quantity_shortage,
        product_category, main_category, sub_category,
        contract_id, main_category_code, category_id
      ) VALUES (
        'ORG001',
        v_supplier_record.supplier_id || '-' || LPAD(v_delivery_num::text, 3, '0'),
        v_supplier_record.supplier_id,
        v_supplier_record.supplier_name,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER + 45,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER + 45 + CASE WHEN RANDOM() < v_supplier_record.on_time_rate THEN 0 ELSE (RANDOM() * 15)::INTEGER END,
        10 + (RANDOM() * 90)::NUMERIC,
        (10 + (RANDOM() * 90)::NUMERIC) * CASE WHEN RANDOM() < v_supplier_record.in_full_rate THEN 1.0 ELSE 0.80 + RANDOM() * 0.19 END,
        RANDOM() < v_supplier_record.on_time_rate,
        RANDOM() < v_supplier_record.in_full_rate,
        v_is_success,
        CASE WHEN v_is_success THEN 'Delivered' ELSE 'Partial' END,
        CASE WHEN RANDOM() < v_supplier_record.on_time_rate THEN 0 ELSE (RANDOM() * 15)::INTEGER END,
        CASE WHEN RANDOM() < v_supplier_record.in_full_rate THEN 0 ELSE (RANDOM() * 10)::NUMERIC END,
        'Mechanical & Electrical',
        'Peralatan Penunjang dan Sistem Mechanical/Electrical',
        'Peralatan Utama',
        'CONTRACT-' || v_supplier_record.supplier_id,
        'B',
        v_category_id
      );
    END LOOP;
  END LOOP;
END $$;

-- Category C: Additional suppliers  
DO $$
DECLARE
  v_category_id uuid;
  v_supplier_record RECORD;
  v_delivery_num INTEGER;
  v_is_success BOOLEAN;
BEGIN
  SELECT id INTO v_category_id FROM ref_procurement_categories WHERE main_category_code = 'C' LIMIT 1;
  
  FOR v_supplier_record IN (
    SELECT * FROM (VALUES 
      ('SUP-C521', 'PT Spare Parts Premium', 0.97, 0.99, 0.96, 32),
      ('SUP-C522', 'CV Bearing & Seal Indo', 0.95, 0.97, 0.92, 30),
      ('SUP-C523', 'PT Filter Solutions Advanced', 0.92, 0.95, 0.88, 28),
      ('SUP-C524', 'CV Lubricant Specialist', 0.89, 0.92, 0.84, 26),
      ('SUP-C525', 'PT Chemical Supply Chain', 0.85, 0.89, 0.78, 24),
      ('SUP-C526', 'CV Safety Equipment Pro', 0.81, 0.85, 0.72, 22),
      ('SUP-C527', 'PT Tools & Hardware', 0.76, 0.81, 0.66, 20),
      ('SUP-C528', 'CV General Supplies Hub', 0.71, 0.76, 0.58, 18)
    ) AS t(supplier_id, supplier_name, on_time_rate, in_full_rate, otif_rate, delivery_count)
  ) LOOP
    FOR v_delivery_num IN 1..v_supplier_record.delivery_count LOOP
      v_is_success := (RANDOM() < v_supplier_record.otif_rate);
      
      INSERT INTO supplier_otif_deliveries (
        organization_id, purchase_order_id, supplier_id, supplier_name,
        order_date, expected_delivery_date, actual_delivery_date,
        quantity_ordered, quantity_delivered,
        is_on_time, is_in_full, is_otif,
        delivery_status, delay_days, quantity_shortage,
        product_category, main_category, sub_category,
        contract_id, main_category_code, category_id
      ) VALUES (
        'ORG001',
        v_supplier_record.supplier_id || '-' || LPAD(v_delivery_num::text, 3, '0'),
        v_supplier_record.supplier_id,
        v_supplier_record.supplier_name,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER + 14,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER + 14 + CASE WHEN RANDOM() < v_supplier_record.on_time_rate THEN 0 ELSE (RANDOM() * 7)::INTEGER END,
        100 + (RANDOM() * 900)::NUMERIC,
        (100 + (RANDOM() * 900)::NUMERIC) * CASE WHEN RANDOM() < v_supplier_record.in_full_rate THEN 1.0 ELSE 0.85 + RANDOM() * 0.14 END,
        RANDOM() < v_supplier_record.on_time_rate,
        RANDOM() < v_supplier_record.in_full_rate,
        v_is_success,
        CASE WHEN v_is_success THEN 'Delivered' ELSE 'Partial' END,
        CASE WHEN RANDOM() < v_supplier_record.on_time_rate THEN 0 ELSE (RANDOM() * 7)::INTEGER END,
        CASE WHEN RANDOM() < v_supplier_record.in_full_rate THEN 0 ELSE (RANDOM() * 50)::NUMERIC END,
        'Material & Consumable',
        'Material, Consumable, dan General Supply',
        'Spare Parts',
        'CONTRACT-' || v_supplier_record.supplier_id,
        'C',
        v_category_id
      );
    END LOOP;
  END LOOP;
END $$;

-- Category D: Additional suppliers
DO $$
DECLARE
  v_category_id uuid;
  v_supplier_record RECORD;
  v_delivery_num INTEGER;
  v_is_success BOOLEAN;
BEGIN
  SELECT id INTO v_category_id FROM ref_procurement_categories WHERE main_category_code = 'D' LIMIT 1;
  
  FOR v_supplier_record IN (
    SELECT * FROM (VALUES 
      ('SUP-D531', 'PT Furniture Kantor Premium', 0.95, 0.98, 0.93, 25),
      ('SUP-D532', 'CV IT Equipment Solutions', 0.93, 0.96, 0.89, 24),
      ('SUP-D533', 'PT Office Automation Pro', 0.91, 0.94, 0.86, 23),
      ('SUP-D534', 'CV Alat Komunikasi Modern', 0.88, 0.92, 0.82, 22),
      ('SUP-D535', 'PT Vehicle Fleet Management', 0.86, 0.90, 0.79, 21),
      ('SUP-D536', 'CV Building Materials Indo', 0.83, 0.87, 0.74, 20),
      ('SUP-D537', 'PT Security Systems Advanced', 0.80, 0.85, 0.70, 19),
      ('SUP-D538', 'CV Facility Equipment', 0.77, 0.82, 0.66, 18),
      ('SUP-D539', 'PT Office Supplies Premium', 0.74, 0.79, 0.62, 17),
      ('SUP-D540', 'CV Asset Management Pro', 0.71, 0.76, 0.58, 16),
      ('SUP-D541', 'PT Infrastructure Support', 0.68, 0.73, 0.53, 15),
      ('SUP-D542', 'CV Property Equipment', 0.65, 0.70, 0.49, 14),
      ('SUP-D543', 'PT Management Tools Indonesia', 0.62, 0.67, 0.45, 13)
    ) AS t(supplier_id, supplier_name, on_time_rate, in_full_rate, otif_rate, delivery_count)
  ) LOOP
    FOR v_delivery_num IN 1..v_supplier_record.delivery_count LOOP
      v_is_success := (RANDOM() < v_supplier_record.otif_rate);
      
      INSERT INTO supplier_otif_deliveries (
        organization_id, purchase_order_id, supplier_id, supplier_name,
        order_date, expected_delivery_date, actual_delivery_date,
        quantity_ordered, quantity_delivered,
        is_on_time, is_in_full, is_otif,
        delivery_status, delay_days, quantity_shortage,
        product_category, main_category, sub_category,
        contract_id, main_category_code, category_id
      ) VALUES (
        'ORG001',
        v_supplier_record.supplier_id || '-' || LPAD(v_delivery_num::text, 3, '0'),
        v_supplier_record.supplier_id,
        v_supplier_record.supplier_name,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER + 30,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER + 30 + CASE WHEN RANDOM() < v_supplier_record.on_time_rate THEN 0 ELSE (RANDOM() * 10)::INTEGER END,
        5 + (RANDOM() * 95)::NUMERIC,
        (5 + (RANDOM() * 95)::NUMERIC) * CASE WHEN RANDOM() < v_supplier_record.in_full_rate THEN 1.0 ELSE 0.85 + RANDOM() * 0.14 END,
        RANDOM() < v_supplier_record.on_time_rate,
        RANDOM() < v_supplier_record.in_full_rate,
        v_is_success,
        CASE WHEN v_is_success THEN 'Delivered' ELSE 'Delayed' END,
        CASE WHEN RANDOM() < v_supplier_record.on_time_rate THEN 0 ELSE (RANDOM() * 10)::INTEGER END,
        CASE WHEN RANDOM() < v_supplier_record.in_full_rate THEN 0 ELSE (RANDOM() * 10)::NUMERIC END,
        'Asset Non-Operasional',
        'Asset Non-Operasional dan Penunjang Manajemen',
        'Peralatan Kantor',
        'CONTRACT-' || v_supplier_record.supplier_id,
        'D',
        v_category_id
      );
    END LOOP;
  END LOOP;
END $$;

-- Category E: Additional suppliers
DO $$
DECLARE
  v_category_id uuid;
  v_supplier_record RECORD;
  v_delivery_num INTEGER;
  v_is_success BOOLEAN;
BEGIN
  SELECT id INTO v_category_id FROM ref_procurement_categories WHERE main_category_code = 'E' LIMIT 1;
  
  FOR v_supplier_record IN (
    SELECT * FROM (VALUES 
      ('SUP-E551', 'PT Maintenance Excellence', 0.96, 0.98, 0.94, 25),
      ('SUP-E552', 'CV Engineering Services Pro', 0.94, 0.97, 0.91, 24),
      ('SUP-E553', 'PT Konsultan Teknik Advanced', 0.91, 0.95, 0.87, 23),
      ('SUP-E554', 'CV Cleaning Service Premium', 0.88, 0.92, 0.82, 22),
      ('SUP-E555', 'PT Security Services Professional', 0.85, 0.89, 0.77, 21),
      ('SUP-E556', 'CV Catering & Facility', 0.81, 0.86, 0.72, 20),
      ('SUP-E557', 'PT Training & Development', 0.78, 0.83, 0.68, 19),
      ('SUP-E558', 'CV Legal Advisory Pro', 0.74, 0.79, 0.62, 18),
      ('SUP-E559', 'PT Audit & Compliance', 0.70, 0.75, 0.56, 17),
      ('SUP-E560', 'CV IT Services Integrated', 0.66, 0.71, 0.50, 16)
    ) AS t(supplier_id, supplier_name, on_time_rate, in_full_rate, otif_rate, delivery_count)
  ) LOOP
    FOR v_delivery_num IN 1..v_supplier_record.delivery_count LOOP
      v_is_success := (RANDOM() < v_supplier_record.otif_rate);
      
      INSERT INTO supplier_otif_deliveries (
        organization_id, purchase_order_id, supplier_id, supplier_name,
        order_date, expected_delivery_date, actual_delivery_date,
        quantity_ordered, quantity_delivered,
        is_on_time, is_in_full, is_otif,
        delivery_status, delay_days, quantity_shortage,
        product_category, main_category, sub_category,
        contract_id, main_category_code, category_id
      ) VALUES (
        'ORG001',
        v_supplier_record.supplier_id || '-' || LPAD(v_delivery_num::text, 3, '0'),
        v_supplier_record.supplier_id,
        v_supplier_record.supplier_name,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER + 30,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER + 30 + CASE WHEN RANDOM() < v_supplier_record.on_time_rate THEN 0 ELSE (RANDOM() * 10)::INTEGER END,
        1 + (RANDOM() * 9)::NUMERIC,
        (1 + (RANDOM() * 9)::NUMERIC) * CASE WHEN RANDOM() < v_supplier_record.in_full_rate THEN 1.0 ELSE 0.90 + RANDOM() * 0.09 END,
        RANDOM() < v_supplier_record.on_time_rate,
        RANDOM() < v_supplier_record.in_full_rate,
        v_is_success,
        CASE WHEN v_is_success THEN 'Completed' ELSE 'Delayed' END,
        CASE WHEN RANDOM() < v_supplier_record.on_time_rate THEN 0 ELSE (RANDOM() * 10)::INTEGER END,
        0,
        'Jasa & Services',
        'Jasa dan Kontrak Pendukung',
        'Jasa Konsultansi',
        'CONTRACT-' || v_supplier_record.supplier_id,
        'E',
        v_category_id
      );
    END LOOP;
  END LOOP;
END $$;

-- Category F: Additional suppliers
DO $$
DECLARE
  v_category_id uuid;
  v_supplier_record RECORD;
  v_delivery_num INTEGER;
  v_is_success BOOLEAN;
BEGIN
  SELECT id INTO v_category_id FROM ref_procurement_categories WHERE main_category_code = 'F' LIMIT 1;
  
  FOR v_supplier_record IN (
    SELECT * FROM (VALUES 
      ('SUP-F571', 'PT Turbine Systems International', 0.95, 0.98, 0.93, 20),
      ('SUP-F572', 'CV EPC Contractor Premium', 0.93, 0.96, 0.89, 19),
      ('SUP-F573', 'PT Power Plant Engineering', 0.90, 0.94, 0.85, 18),
      ('SUP-F574', 'CV Generator Systems Pro', 0.87, 0.91, 0.80, 17),
      ('SUP-F575', 'PT Renewable Energy Tech', 0.84, 0.88, 0.75, 16),
      ('SUP-F576', 'CV Steam Turbine Indo', 0.80, 0.85, 0.70, 15),
      ('SUP-F577', 'PT Gas Turbine Solutions', 0.76, 0.81, 0.64, 14),
      ('SUP-F578', 'CV Boiler Technology Advanced', 0.72, 0.77, 0.58, 13),
      ('SUP-F579', 'PT HRSG Systems Indonesia', 0.68, 0.73, 0.52, 12),
      ('SUP-F580', 'CV Cooling Tower Expert', 0.64, 0.69, 0.46, 11),
      ('SUP-F581', 'PT Condenser Systems', 0.60, 0.65, 0.40, 10)
    ) AS t(supplier_id, supplier_name, on_time_rate, in_full_rate, otif_rate, delivery_count)
  ) LOOP
    FOR v_delivery_num IN 1..v_supplier_record.delivery_count LOOP
      v_is_success := (RANDOM() < v_supplier_record.otif_rate);
      
      INSERT INTO supplier_otif_deliveries (
        organization_id, purchase_order_id, supplier_id, supplier_name,
        order_date, expected_delivery_date, actual_delivery_date,
        quantity_ordered, quantity_delivered,
        is_on_time, is_in_full, is_otif,
        delivery_status, delay_days, quantity_shortage,
        product_category, main_category, sub_category,
        contract_id, main_category_code, category_id
      ) VALUES (
        'ORG001',
        v_supplier_record.supplier_id || '-' || LPAD(v_delivery_num::text, 3, '0'),
        v_supplier_record.supplier_id,
        v_supplier_record.supplier_name,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER + 90,
        DATE '2024-01-01' + (RANDOM() * 365)::INTEGER + 90 + CASE WHEN RANDOM() < v_supplier_record.on_time_rate THEN 0 ELSE (RANDOM() * 20)::INTEGER END,
        1 + (RANDOM() * 4)::NUMERIC,
        (1 + (RANDOM() * 4)::NUMERIC) * CASE WHEN RANDOM() < v_supplier_record.in_full_rate THEN 1.0 ELSE 0.80 + RANDOM() * 0.19 END,
        RANDOM() < v_supplier_record.on_time_rate,
        RANDOM() < v_supplier_record.in_full_rate,
        v_is_success,
        CASE WHEN v_is_success THEN 'Delivered' ELSE 'Delayed' END,
        CASE WHEN RANDOM() < v_supplier_record.on_time_rate THEN 0 ELSE (RANDOM() * 20)::INTEGER END,
        CASE WHEN RANDOM() < v_supplier_record.in_full_rate THEN 0 ELSE 1 END,
        'Peralatan Pembangkit',
        'Peralatan Utama Pembangkit dan Project EPC',
        'Peralatan Utama',
        'CONTRACT-' || v_supplier_record.supplier_id,
        'F',
        v_category_id
      );
    END LOOP;
  END LOOP;
END $$;
