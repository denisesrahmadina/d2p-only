/*
  # Populate Comprehensive OTIF Supplier Data

  ## Overview
  Creates realistic mockup data for supplier OTIF leaderboard including:
  - 32 suppliers with varied performance levels
  - Supplier names across different categories
  - Contract names and associations
  - OTIF percentages ranging from excellent (95%+) to poor (<50%)
  - Multiple deliveries per supplier with realistic patterns

  ## Data Distribution
  - Strategic Suppliers (95%+ OTIF): 8 suppliers
  - Preferred Suppliers (85-94% OTIF): 10 suppliers
  - Standard Suppliers (70-84% OTIF): 8 suppliers
  - Below Standard (<70% OTIF): 6 suppliers

  ## Categories Covered
  All 6 main procurement categories (A-F)
*/

-- Clear existing mock data
DELETE FROM supplier_otif_deliveries WHERE organization_id = 'ORG001';
DELETE FROM supplier_otif_performance WHERE organization_id = 'ORG001';

-- Insert comprehensive supplier delivery data
DO $$
DECLARE
  v_suppliers TEXT[][] := ARRAY[
    ARRAY['SUP-101', 'PT Sumber Energi Mandiri', 'A', '0.98'],
    ARRAY['SUP-102', 'CV Prima Teknik Nusantara', 'B', '0.97'],
    ARRAY['SUP-103', 'PT Global Material Solutions', 'C', '0.96'],
    ARRAY['SUP-104', 'PT Cahaya Listrik Indonesia', 'F', '0.97'],
    ARRAY['SUP-105', 'PT Jaya Konsultan Energi', 'E', '0.98'],
    ARRAY['SUP-106', 'CV Mitra Equipment Sejahtera', 'B', '0.96'],
    ARRAY['SUP-107', 'PT Sumber Batubara Utama', 'A', '0.95'],
    ARRAY['SUP-108', 'PT Mekanika Presisi Indonesia', 'B', '0.97'],
    ARRAY['SUP-201', 'PT Energi Nusantara Abadi', 'A', '0.92'],
    ARRAY['SUP-202', 'CV Teknik Maju Bersama', 'B', '0.89'],
    ARRAY['SUP-203', 'PT Material Supply Chain', 'C', '0.91'],
    ARRAY['SUP-204', 'PT Indo Asset Management', 'D', '0.88'],
    ARRAY['SUP-205', 'CV Konsultan Profesional', 'E', '0.90'],
    ARRAY['SUP-206', 'PT Pembangkit Prima', 'F', '0.87'],
    ARRAY['SUP-207', 'PT Bahan Bakar Sejahtera', 'A', '0.93'],
    ARRAY['SUP-208', 'CV Spare Parts Solutions', 'C', '0.89'],
    ARRAY['SUP-209', 'PT Listrik Engineering', 'B', '0.91'],
    ARRAY['SUP-210', 'CV Jasa Maintenance Pro', 'E', '0.86'],
    ARRAY['SUP-301', 'PT Energi Regional', 'A', '0.82'],
    ARRAY['SUP-302', 'CV Alat Teknik Lokal', 'B', '0.78'],
    ARRAY['SUP-303', 'PT Consumable Indonesia', 'C', '0.81'],
    ARRAY['SUP-304', 'CV Office Supply Center', 'D', '0.75'],
    ARRAY['SUP-305', 'PT Service Provider', 'E', '0.79'],
    ARRAY['SUP-306', 'CV Project Contractor', 'F', '0.73'],
    ARRAY['SUP-307', 'PT Batubara Regional', 'A', '0.80'],
    ARRAY['SUP-308', 'CV Material Umum', 'C', '0.77'],
    ARRAY['SUP-401', 'CV Energi Budget', 'A', '0.65'],
    ARRAY['SUP-402', 'PT Teknik Ekonomis', 'B', '0.58'],
    ARRAY['SUP-403', 'CV Supply Basic', 'C', '0.62'],
    ARRAY['SUP-404', 'PT Service Standard', 'E', '0.55'],
    ARRAY['SUP-405', 'CV Project Small', 'F', '0.48'],
    ARRAY['SUP-406', 'PT Local Materials', 'C', '0.67']
  ];
  
  v_supplier_id TEXT;
  v_supplier_name TEXT;
  v_category TEXT;
  v_target_otif NUMERIC;
  v_contract_names TEXT[] := ARRAY[
    'Pengadaan Batubara Kalori Tinggi',
    'Kontrak Supply Material Operasional',
    'Perawatan Turbin Pembangkit',
    'Pengadaan Spare Part Generator',
    'Jasa Konsultansi Teknik',
    'Kontrak Maintenance Rutin',
    'Supply Bahan Kimia Boiler',
    'Pengadaan Peralatan Kontrol',
    'Jasa Cleaning dan Sanitation',
    'Kontrak IT Support',
    'Supply Office Equipment',
    'Pengadaan Alat Safety',
    'Jasa Security Services',
    'Kontrak Catering Karyawan',
    'Supply Raw Material Production'
  ];
  
  v_delivery_count INTEGER;
  v_actual_otif NUMERIC;
  v_order_date DATE;
  v_expected_date DATE;
  v_actual_date DATE;
  v_is_on_time BOOLEAN;
  v_is_in_full BOOLEAN;
  v_delay_days INTEGER;
  v_quantity_ordered INTEGER;
  v_quantity_delivered INTEGER;
  v_contract_name TEXT;
  i INTEGER;
  j INTEGER;
BEGIN
  FOR i IN 1..array_length(v_suppliers, 1) LOOP
    v_supplier_id := v_suppliers[i][1];
    v_supplier_name := v_suppliers[i][2];
    v_category := v_suppliers[i][3];
    v_target_otif := v_suppliers[i][4]::NUMERIC;
    
    v_delivery_count := CASE
      WHEN v_target_otif >= 0.95 THEN 35 + floor(random() * 15)::INTEGER
      WHEN v_target_otif >= 0.85 THEN 25 + floor(random() * 15)::INTEGER
      WHEN v_target_otif >= 0.70 THEN 15 + floor(random() * 15)::INTEGER
      ELSE 10 + floor(random() * 10)::INTEGER
    END;
    
    FOR j IN 1..v_delivery_count LOOP
      v_order_date := CURRENT_DATE - (180 - j * 3 || ' days')::INTERVAL;
      v_expected_date := v_order_date + (15 + floor(random() * 30)::INTEGER || ' days')::INTERVAL;
      v_actual_otif := v_target_otif + (random() * 0.08 - 0.04);
      v_is_on_time := random() < (v_actual_otif + 0.02);
      v_is_in_full := random() < (v_actual_otif + 0.03);
      
      IF v_is_on_time THEN
        v_actual_date := v_expected_date - floor(random() * 3)::INTEGER;
        v_delay_days := 0;
      ELSE
        v_delay_days := CASE
          WHEN v_target_otif >= 0.85 THEN 1 + floor(random() * 5)::INTEGER
          WHEN v_target_otif >= 0.70 THEN 1 + floor(random() * 10)::INTEGER
          ELSE 1 + floor(random() * 20)::INTEGER
        END;
        v_actual_date := v_expected_date + (v_delay_days || ' days')::INTERVAL;
      END IF;
      
      IF v_actual_date > CURRENT_DATE THEN
        CONTINUE;
      END IF;
      
      v_quantity_ordered := CASE v_category
        WHEN 'A' THEN 8000 + floor(random() * 12000)::INTEGER
        WHEN 'B' THEN 5 + floor(random() * 20)::INTEGER
        WHEN 'C' THEN 100 + floor(random() * 500)::INTEGER
        WHEN 'D' THEN 10 + floor(random() * 40)::INTEGER
        WHEN 'E' THEN floor(random() * 10)::INTEGER + 1
        WHEN 'F' THEN 2 + floor(random() * 8)::INTEGER
        ELSE 50 + floor(random() * 200)::INTEGER
      END;
      
      IF v_is_in_full THEN
        v_quantity_delivered := v_quantity_ordered;
      ELSE
        v_quantity_delivered := floor(v_quantity_ordered * (0.6 + random() * 0.35))::INTEGER;
      END IF;
      
      v_contract_name := v_contract_names[1 + floor(random() * array_length(v_contract_names, 1))::INTEGER];
      
      INSERT INTO supplier_otif_deliveries (
        organization_id, purchase_order_id, supplier_id, supplier_name,
        order_date, expected_delivery_date, actual_delivery_date,
        quantity_ordered, quantity_delivered,
        is_on_time, is_in_full, is_otif, delivery_status,
        delay_days, quantity_shortage, product_category,
        failure_reason, notes, main_category_code, category_id
      ) VALUES (
        'ORG001',
        v_supplier_id || '-PO-' || LPAD(j::TEXT, 4, '0'),
        v_supplier_id, v_supplier_name,
        v_order_date, v_expected_date, v_actual_date,
        v_quantity_ordered, v_quantity_delivered,
        v_is_on_time, v_is_in_full, (v_is_on_time AND v_is_in_full),
        'delivered',
        CASE WHEN v_is_on_time THEN NULL ELSE v_delay_days END,
        CASE WHEN v_is_in_full THEN NULL ELSE (v_quantity_ordered - v_quantity_delivered) END,
        v_contract_name,
        CASE
          WHEN NOT v_is_on_time AND NOT v_is_in_full THEN 'Keterlambatan produksi dan kekurangan bahan baku'
          WHEN NOT v_is_on_time THEN 'Keterlambatan pengiriman dari supplier'
          WHEN NOT v_is_in_full THEN 'Stock tidak mencukupi'
          ELSE NULL
        END,
        'Kontrak ' || v_contract_name || ' - Pengiriman ' || j,
        v_category,
        (SELECT id FROM ref_procurement_categories WHERE main_category_code = v_category LIMIT 1)
      );
    END LOOP;
  END LOOP;
END $$;

-- Regenerate performance aggregation
INSERT INTO supplier_otif_performance (
  organization_id, supplier_id, supplier_name,
  period_start, period_end,
  total_deliveries, on_time_deliveries, in_full_deliveries, otif_deliveries,
  on_time_percentage, in_full_percentage, otif_percentage,
  avg_delay_days, supplier_tier
)
SELECT
  organization_id, supplier_id, supplier_name,
  DATE_TRUNC('month', MIN(order_date))::date as period_start,
  DATE_TRUNC('month', MAX(order_date))::date + INTERVAL '1 month - 1 day' as period_end,
  COUNT(*) FILTER (WHERE delivery_status = 'delivered') as total_deliveries,
  COUNT(*) FILTER (WHERE is_on_time = true) as on_time_deliveries,
  COUNT(*) FILTER (WHERE is_in_full = true) as in_full_deliveries,
  COUNT(*) FILTER (WHERE is_otif = true) as otif_deliveries,
  ROUND((COUNT(*) FILTER (WHERE is_on_time = true)::numeric /
         NULLIF(COUNT(*), 0) * 100), 2) as on_time_percentage,
  ROUND((COUNT(*) FILTER (WHERE is_in_full = true)::numeric /
         NULLIF(COUNT(*), 0) * 100), 2) as in_full_percentage,
  ROUND((COUNT(*) FILTER (WHERE is_otif = true)::numeric /
         NULLIF(COUNT(*), 0) * 100), 2) as otif_percentage,
  ROUND(AVG(delay_days) FILTER (WHERE delay_days > 0), 2) as avg_delay_days,
  CASE
    WHEN ROUND((COUNT(*) FILTER (WHERE is_otif = true)::numeric /
         NULLIF(COUNT(*), 0) * 100), 2) >= 95 THEN 'strategic'
    WHEN ROUND((COUNT(*) FILTER (WHERE is_otif = true)::numeric /
         NULLIF(COUNT(*), 0) * 100), 2) >= 85 THEN 'preferred'
    ELSE 'standard'
  END as supplier_tier
FROM supplier_otif_deliveries
WHERE delivery_status = 'delivered' AND organization_id = 'ORG001'
GROUP BY organization_id, supplier_id, supplier_name;

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW v_supplier_otif_leaderboard;
