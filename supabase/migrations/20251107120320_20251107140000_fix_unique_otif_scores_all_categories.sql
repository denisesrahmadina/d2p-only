/*
  # Fix Unique OTIF Scores for Ranks 4-10 Across All Categories

  1. Problem
    - Current supplier leaderboards have duplicate OTIF percentages for ranks 4-10
    - Categories C, D, E have no suppliers at all
    - Categories B and F have only 2 suppliers each
    - Category A has only 6 suppliers
    - We need at least 10 suppliers per category with unique OTIF scores

  2. Solution
    - Add new suppliers to each category (A through F) plus Overall
    - Ensure each supplier has a unique OTIF percentage for ranks 4-10
    - Create realistic delivery data to support these percentages

  3. Changes
    - Add 40+ new suppliers across all categories
    - Insert delivery records for each supplier
    - Ensure unique OTIF percentages by careful calculation
*/

-- Category A: Add suppliers for ranks 7-10
DO $$
DECLARE
  v_org_id text := 'ORG001';
  v_supplier_name text;
  v_delivery_count integer;
  v_otif_count integer;
  v_order_date date;
  v_i integer;
BEGIN
  -- Rank 7: 95.50%
  v_supplier_name := 'PT Steel Components Indonesia';
  v_delivery_count := 200;
  v_otif_count := 191;
  FOR v_i IN 1..v_delivery_count LOOP
    v_order_date := '2025-01-01'::date + (v_i || ' days')::interval;
    INSERT INTO supplier_otif_deliveries (
      organization_id, purchase_order_id, supplier_id, supplier_name,
      order_date, expected_delivery_date, actual_delivery_date,
      quantity_ordered, quantity_delivered,
      is_on_time, is_in_full, is_otif,
      delivery_status, product_category, main_category_code, contract_id
    ) VALUES (
      v_org_id,
      'PO-A-SC-' || LPAD(v_i::text, 4, '0'),
      'SUPP-A-007',
      v_supplier_name,
      v_order_date,
      v_order_date + interval '7 days',
      v_order_date + interval '6 days',
      100,
      100,
      v_i <= v_otif_count,
      v_i <= v_otif_count,
      v_i <= v_otif_count,
      CASE WHEN v_i <= v_otif_count THEN 'delivered' ELSE 'late' END,
      'Turbine Components',
      'A',
      'CTR-A-SC-2025'
    );
  END LOOP;

  -- Rank 8: 95.00%
  v_supplier_name := 'PT Industrial Machinery Systems';
  v_delivery_count := 200;
  v_otif_count := 190;
  FOR v_i IN 1..v_delivery_count LOOP
    v_order_date := '2025-01-01'::date + (v_i || ' days')::interval;
    INSERT INTO supplier_otif_deliveries (
      organization_id, purchase_order_id, supplier_id, supplier_name,
      order_date, expected_delivery_date, actual_delivery_date,
      quantity_ordered, quantity_delivered,
      is_on_time, is_in_full, is_otif,
      delivery_status, product_category, main_category_code, contract_id
    ) VALUES (
      v_org_id,
      'PO-A-IMS-' || LPAD(v_i::text, 4, '0'),
      'SUPP-A-008',
      v_supplier_name,
      v_order_date,
      v_order_date + interval '7 days',
      v_order_date + interval '6 days',
      100,
      100,
      v_i <= v_otif_count,
      v_i <= v_otif_count,
      v_i <= v_otif_count,
      CASE WHEN v_i <= v_otif_count THEN 'delivered' ELSE 'late' END,
      'Turbine Components',
      'A',
      'CTR-A-IMS-2025'
    );
  END LOOP;

  -- Rank 9: 94.50%
  v_supplier_name := 'PT Generator Parts Supplier';
  v_delivery_count := 200;
  v_otif_count := 189;
  FOR v_i IN 1..v_delivery_count LOOP
    v_order_date := '2025-01-01'::date + (v_i || ' days')::interval;
    INSERT INTO supplier_otif_deliveries (
      organization_id, purchase_order_id, supplier_id, supplier_name,
      order_date, expected_delivery_date, actual_delivery_date,
      quantity_ordered, quantity_delivered,
      is_on_time, is_in_full, is_otif,
      delivery_status, product_category, main_category_code, contract_id
    ) VALUES (
      v_org_id,
      'PO-A-GPS-' || LPAD(v_i::text, 4, '0'),
      'SUPP-A-009',
      v_supplier_name,
      v_order_date,
      v_order_date + interval '7 days',
      v_order_date + interval '6 days',
      100,
      100,
      v_i <= v_otif_count,
      v_i <= v_otif_count,
      v_i <= v_otif_count,
      CASE WHEN v_i <= v_otif_count THEN 'delivered' ELSE 'late' END,
      'Turbine Components',
      'A',
      'CTR-A-GPS-2025'
    );
  END LOOP;

  -- Rank 10: 94.00%
  v_supplier_name := 'PT Power Equipment Trading';
  v_delivery_count := 200;
  v_otif_count := 188;
  FOR v_i IN 1..v_delivery_count LOOP
    v_order_date := '2025-01-01'::date + (v_i || ' days')::interval;
    INSERT INTO supplier_otif_deliveries (
      organization_id, purchase_order_id, supplier_id, supplier_name,
      order_date, expected_delivery_date, actual_delivery_date,
      quantity_ordered, quantity_delivered,
      is_on_time, is_in_full, is_otif,
      delivery_status, product_category, main_category_code, contract_id
    ) VALUES (
      v_org_id,
      'PO-A-PET-' || LPAD(v_i::text, 4, '0'),
      'SUPP-A-010',
      v_supplier_name,
      v_order_date,
      v_order_date + interval '7 days',
      v_order_date + interval '6 days',
      100,
      100,
      v_i <= v_otif_count,
      v_i <= v_otif_count,
      v_i <= v_otif_count,
      CASE WHEN v_i <= v_otif_count THEN 'delivered' ELSE 'late' END,
      'Turbine Components',
      'A',
      'CTR-A-PET-2025'
    );
  END LOOP;

  RAISE NOTICE 'Category A: Added suppliers for ranks 7-10';
END $$;

-- Category B: Add suppliers for ranks 3-10
DO $$
DECLARE
  v_org_id text := 'ORG001';
  v_supplier_name text;
  v_delivery_count integer;
  v_otif_count integer;
  v_order_date date;
  v_i integer;
  v_suppliers text[] := ARRAY[
    'PT Coal Supplier Nusantara',
    'PT Mineral Resources Indonesia',
    'PT Fuel Trading International',
    'PT Energy Resources Prima',
    'PT Batubara Mandiri',
    'PT Fuel Logistics Indonesia',
    'PT Energy Supply Chain',
    'PT Coal Mining Services'
  ];
  v_otif_counts integer[] := ARRAY[196, 195, 194, 191, 190, 189, 188, 187];
  v_supplier_codes text[] := ARRAY['CSN', 'MRI', 'FTI', 'ERP', 'BM', 'FLI', 'ESC', 'CMS'];
  v_idx integer;
BEGIN
  v_delivery_count := 200;
  
  FOR v_idx IN 1..8 LOOP
    v_supplier_name := v_suppliers[v_idx];
    v_otif_count := v_otif_counts[v_idx];
    
    FOR v_i IN 1..v_delivery_count LOOP
      v_order_date := '2025-01-01'::date + (v_i || ' days')::interval;
      INSERT INTO supplier_otif_deliveries (
        organization_id, purchase_order_id, supplier_id, supplier_name,
        order_date, expected_delivery_date, actual_delivery_date,
        quantity_ordered, quantity_delivered,
        is_on_time, is_in_full, is_otif,
        delivery_status, product_category, main_category_code, contract_id
      ) VALUES (
        v_org_id,
        'PO-B-' || v_supplier_codes[v_idx] || '-' || LPAD(v_i::text, 4, '0'),
        'SUPP-B-' || LPAD((v_idx + 2)::text, 3, '0'),
        v_supplier_name,
        v_order_date,
        v_order_date + interval '5 days',
        v_order_date + interval '4 days',
        1000,
        1000,
        v_i <= v_otif_count,
        v_i <= v_otif_count,
        v_i <= v_otif_count,
        CASE WHEN v_i <= v_otif_count THEN 'delivered' ELSE 'late' END,
        'Coal & Fuel',
        'B',
        'CTR-B-' || v_supplier_codes[v_idx] || '-2025'
      );
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Category B: Added 8 suppliers for complete top 10';
END $$;

-- Category C: Add 10 suppliers
DO $$
DECLARE
  v_org_id text := 'ORG001';
  v_supplier_name text;
  v_delivery_count integer;
  v_otif_count integer;
  v_order_date date;
  v_i integer;
  v_suppliers text[] := ARRAY[
    'PT Construction Materials Prime',
    'PT Civil Engineering Supply',
    'PT Infrastructure Components',
    'PT Building Materials Indonesia',
    'PT Heavy Construction Supply',
    'PT Engineering Materials Trade',
    'PT Construction Equipment Parts',
    'PT Industrial Construction Supply',
    'PT Civil Works Materials',
    'PT Structural Components Indo'
  ];
  v_otif_counts integer[] := ARRAY[197, 196, 195, 194, 191, 190, 189, 188, 187, 186];
  v_supplier_codes text[] := ARRAY['CMP', 'CES', 'IC', 'BMI', 'HCS', 'EMT', 'CEP', 'ICS', 'CWM', 'SCI'];
  v_idx integer;
BEGIN
  v_delivery_count := 200;
  
  FOR v_idx IN 1..10 LOOP
    v_supplier_name := v_suppliers[v_idx];
    v_otif_count := v_otif_counts[v_idx];
    
    FOR v_i IN 1..v_delivery_count LOOP
      v_order_date := '2025-01-01'::date + (v_i || ' days')::interval;
      INSERT INTO supplier_otif_deliveries (
        organization_id, purchase_order_id, supplier_id, supplier_name,
        order_date, expected_delivery_date, actual_delivery_date,
        quantity_ordered, quantity_delivered,
        is_on_time, is_in_full, is_otif,
        delivery_status, product_category, main_category_code, contract_id
      ) VALUES (
        v_org_id,
        'PO-C-' || v_supplier_codes[v_idx] || '-' || LPAD(v_i::text, 4, '0'),
        'SUPP-C-' || LPAD(v_idx::text, 3, '0'),
        v_supplier_name,
        v_order_date,
        v_order_date + interval '10 days',
        v_order_date + interval '9 days',
        500,
        500,
        v_i <= v_otif_count,
        v_i <= v_otif_count,
        v_i <= v_otif_count,
        CASE WHEN v_i <= v_otif_count THEN 'delivered' ELSE 'late' END,
        'Civil Works',
        'C',
        'CTR-C-' || v_supplier_codes[v_idx] || '-2025'
      );
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Category C: Added 10 suppliers';
END $$;

-- Category D: Add 10 suppliers
DO $$
DECLARE
  v_org_id text := 'ORG001';
  v_supplier_name text;
  v_delivery_count integer;
  v_otif_count integer;
  v_order_date date;
  v_i integer;
  v_suppliers text[] := ARRAY[
    'PT Chemical Supply Indonesia',
    'PT Laboratory Equipment Trade',
    'PT Industrial Chemicals Prima',
    'PT Water Treatment Supply',
    'PT Chemical Solutions Indo',
    'PT Lab Instruments Trading',
    'PT Process Chemicals Supply',
    'PT Environmental Solutions',
    'PT Chemical Products Indonesia',
    'PT Laboratory Services Supply'
  ];
  v_otif_counts integer[] := ARRAY[197, 196, 195, 194, 191, 190, 189, 188, 187, 186];
  v_supplier_codes text[] := ARRAY['CSI', 'LET', 'ICP', 'WTS', 'CSO', 'LIT', 'PCS', 'ES', 'CPI', 'LSS'];
  v_idx integer;
BEGIN
  v_delivery_count := 200;
  
  FOR v_idx IN 1..10 LOOP
    v_supplier_name := v_suppliers[v_idx];
    v_otif_count := v_otif_counts[v_idx];
    
    FOR v_i IN 1..v_delivery_count LOOP
      v_order_date := '2025-01-01'::date + (v_i || ' days')::interval;
      INSERT INTO supplier_otif_deliveries (
        organization_id, purchase_order_id, supplier_id, supplier_name,
        order_date, expected_delivery_date, actual_delivery_date,
        quantity_ordered, quantity_delivered,
        is_on_time, is_in_full, is_otif,
        delivery_status, product_category, main_category_code, contract_id
      ) VALUES (
        v_org_id,
        'PO-D-' || v_supplier_codes[v_idx] || '-' || LPAD(v_i::text, 4, '0'),
        'SUPP-D-' || LPAD(v_idx::text, 3, '0'),
        v_supplier_name,
        v_order_date,
        v_order_date + interval '7 days',
        v_order_date + interval '6 days',
        200,
        200,
        v_i <= v_otif_count,
        v_i <= v_otif_count,
        v_i <= v_otif_count,
        CASE WHEN v_i <= v_otif_count THEN 'delivered' ELSE 'late' END,
        'Chemicals & Lab',
        'D',
        'CTR-D-' || v_supplier_codes[v_idx] || '-2025'
      );
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Category D: Added 10 suppliers';
END $$;

-- Category E: Add 10 suppliers
DO $$
DECLARE
  v_org_id text := 'ORG001';
  v_supplier_name text;
  v_delivery_count integer;
  v_otif_count integer;
  v_order_date date;
  v_i integer;
  v_suppliers text[] := ARRAY[
    'PT IT Solutions Indonesia',
    'PT Software Systems Prima',
    'PT Network Equipment Supply',
    'PT Digital Infrastructure',
    'PT Technology Services Indo',
    'PT IT Equipment Trading',
    'PT Computer Systems Supply',
    'PT Telecom Solutions',
    'PT IT Support Services',
    'PT Digital Equipment Trade'
  ];
  v_otif_counts integer[] := ARRAY[197, 196, 195, 194, 191, 190, 189, 188, 187, 186];
  v_supplier_codes text[] := ARRAY['ITSI', 'SSP', 'NES', 'DI', 'TSI', 'ITET', 'CSS', 'TS', 'ITSS', 'DET'];
  v_idx integer;
BEGIN
  v_delivery_count := 200;
  
  FOR v_idx IN 1..10 LOOP
    v_supplier_name := v_suppliers[v_idx];
    v_otif_count := v_otif_counts[v_idx];
    
    FOR v_i IN 1..v_delivery_count LOOP
      v_order_date := '2025-01-01'::date + (v_i || ' days')::interval;
      INSERT INTO supplier_otif_deliveries (
        organization_id, purchase_order_id, supplier_id, supplier_name,
        order_date, expected_delivery_date, actual_delivery_date,
        quantity_ordered, quantity_delivered,
        is_on_time, is_in_full, is_otif,
        delivery_status, product_category, main_category_code, contract_id
      ) VALUES (
        v_org_id,
        'PO-E-' || v_supplier_codes[v_idx] || '-' || LPAD(v_i::text, 4, '0'),
        'SUPP-E-' || LPAD(v_idx::text, 3, '0'),
        v_supplier_name,
        v_order_date,
        v_order_date + interval '3 days',
        v_order_date + interval '2 days',
        50,
        50,
        v_i <= v_otif_count,
        v_i <= v_otif_count,
        v_i <= v_otif_count,
        CASE WHEN v_i <= v_otif_count THEN 'delivered' ELSE 'late' END,
        'IT & Telecom',
        'E',
        'CTR-E-' || v_supplier_codes[v_idx] || '-2025'
      );
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Category E: Added 10 suppliers';
END $$;

-- Category F: Add 8 more suppliers for ranks 3-10
DO $$
DECLARE
  v_org_id text := 'ORG001';
  v_supplier_name text;
  v_delivery_count integer;
  v_otif_count integer;
  v_order_date date;
  v_i integer;
  v_suppliers text[] := ARRAY[
    'PT Office Supplies Indonesia',
    'PT Facility Management Supply',
    'PT General Trading Prima',
    'PT Administrative Services',
    'PT Office Equipment Trade',
    'PT Facility Solutions Indo',
    'PT Business Support Supply',
    'PT Office Management Services'
  ];
  v_otif_counts integer[] := ARRAY[196, 195, 194, 191, 190, 189, 188, 187];
  v_supplier_codes text[] := ARRAY['OSI', 'FMS', 'GTP', 'AS', 'OET', 'FSI', 'BSS', 'OMS'];
  v_idx integer;
BEGIN
  v_delivery_count := 200;
  
  FOR v_idx IN 1..8 LOOP
    v_supplier_name := v_suppliers[v_idx];
    v_otif_count := v_otif_counts[v_idx];
    
    FOR v_i IN 1..v_delivery_count LOOP
      v_order_date := '2025-01-01'::date + (v_i || ' days')::interval;
      INSERT INTO supplier_otif_deliveries (
        organization_id, purchase_order_id, supplier_id, supplier_name,
        order_date, expected_delivery_date, actual_delivery_date,
        quantity_ordered, quantity_delivered,
        is_on_time, is_in_full, is_otif,
        delivery_status, product_category, main_category_code, contract_id
      ) VALUES (
        v_org_id,
        'PO-F-' || v_supplier_codes[v_idx] || '-' || LPAD(v_i::text, 4, '0'),
        'SUPP-F-' || LPAD((v_idx + 2)::text, 3, '0'),
        v_supplier_name,
        v_order_date,
        v_order_date + interval '5 days',
        v_order_date + interval '4 days',
        100,
        100,
        v_i <= v_otif_count,
        v_i <= v_otif_count,
        v_i <= v_otif_count,
        CASE WHEN v_i <= v_otif_count THEN 'delivered' ELSE 'late' END,
        'General Supplies',
        'F',
        'CTR-F-' || v_supplier_codes[v_idx] || '-2025'
      );
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Category F: Added 8 suppliers for complete top 10';
END $$;
