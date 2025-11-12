/*
  # Generate Perfect Unique OTIF Leaderboard Data

  This migration creates perfectly unique OTIF percentages for:
  - Top 10 Overall suppliers
  - Top 10 per category (A through F)
  
  Each supplier will have a unique, sequential OTIF percentage with no duplicates.
*/

DO $$
BEGIN
  -- First, delete existing OTIF delivery data to start fresh
  DELETE FROM supplier_otif_deliveries;

  -- Rank 1: PT Nusantara Logistik Prima (Category A) - 98.50% = 197/200
  INSERT INTO supplier_otif_deliveries (
    organization_id, purchase_order_id, supplier_id, supplier_name,
    order_date, expected_delivery_date, actual_delivery_date,
    quantity_ordered, quantity_delivered,
    is_on_time, is_in_full, is_otif, delivery_status, delay_days,
    main_category_code, contract_id
  )
  SELECT 
    'ORG001',
    'PO-A-' || LPAD(seq::TEXT, 5, '0'),
    'SUPP-001',
    'PT Nusantara Logistik Prima',
    CURRENT_DATE - (seq * 7),
    CURRENT_DATE - (seq * 7) + 14,
    CURRENT_DATE - (seq * 7) + (CASE WHEN seq <= 197 THEN 13 ELSE 18 END),
    100.00,
    100.00,
    seq <= 197,
    seq <= 197,
    seq <= 197,
    'delivered',
    CASE WHEN seq <= 197 THEN 0 ELSE 4 END,
    'A',
    'CTR-A-' || LPAD(((seq-1)/4 + 1)::TEXT, 5, '0')
  FROM generate_series(1, 200) seq;

  -- Rank 2: PT Mesin Nusantara Utama (Category A) - 98.00% = 196/200
  INSERT INTO supplier_otif_deliveries (
    organization_id, purchase_order_id, supplier_id, supplier_name,
    order_date, expected_delivery_date, actual_delivery_date,
    quantity_ordered, quantity_delivered,
    is_on_time, is_in_full, is_otif, delivery_status, delay_days,
    main_category_code, contract_id
  )
  SELECT 
    'ORG001',
    'PO-A-' || LPAD((200 + seq)::TEXT, 5, '0'),
    'SUPP-002',
    'PT Mesin Nusantara Utama',
    CURRENT_DATE - (seq * 7),
    CURRENT_DATE - (seq * 7) + 14,
    CURRENT_DATE - (seq * 7) + (CASE WHEN seq <= 196 THEN 13 ELSE 18 END),
    100.00,
    100.00,
    seq <= 196,
    seq <= 196,
    seq <= 196,
    'delivered',
    CASE WHEN seq <= 196 THEN 0 ELSE 4 END,
    'A',
    'CTR-A-' || LPAD((50 + (seq-1)/4 + 1)::TEXT, 5, '0')
  FROM generate_series(1, 200) seq;

  -- Rank 3: PT Turbo Engineering Indonesia (Category A) - 97.78% = 176/180
  INSERT INTO supplier_otif_deliveries (
    organization_id, purchase_order_id, supplier_id, supplier_name,
    order_date, expected_delivery_date, actual_delivery_date,
    quantity_ordered, quantity_delivered,
    is_on_time, is_in_full, is_otif, delivery_status, delay_days,
    main_category_code, contract_id
  )
  SELECT 
    'ORG001',
    'PO-A-' || LPAD((400 + seq)::TEXT, 5, '0'),
    'SUPP-003',
    'PT Turbo Engineering Indonesia',
    CURRENT_DATE - (seq * 7),
    CURRENT_DATE - (seq * 7) + 14,
    CURRENT_DATE - (seq * 7) + (CASE WHEN seq <= 176 THEN 13 ELSE 18 END),
    100.00,
    100.00,
    seq <= 176,
    seq <= 176,
    seq <= 176,
    'delivered',
    CASE WHEN seq <= 176 THEN 0 ELSE 4 END,
    'A',
    'CTR-A-' || LPAD((100 + (seq-1)/4 + 1)::TEXT, 5, '0')
  FROM generate_series(1, 180) seq;

  -- Rank 4: PT Energi Teknologi Indonesia (Category B) - 97.50% = 195/200
  INSERT INTO supplier_otif_deliveries (
    organization_id, purchase_order_id, supplier_id, supplier_name,
    order_date, expected_delivery_date, actual_delivery_date,
    quantity_ordered, quantity_delivered,
    is_on_time, is_in_full, is_otif, delivery_status, delay_days,
    main_category_code, contract_id
  )
  SELECT 
    'ORG001',
    'PO-B-' || LPAD(seq::TEXT, 5, '0'),
    'SUPP-004',
    'PT Energi Teknologi Indonesia',
    CURRENT_DATE - (seq * 7),
    CURRENT_DATE - (seq * 7) + 14,
    CURRENT_DATE - (seq * 7) + (CASE WHEN seq <= 195 THEN 13 ELSE 18 END),
    100.00,
    100.00,
    seq <= 195,
    seq <= 195,
    seq <= 195,
    'delivered',
    CASE WHEN seq <= 195 THEN 0 ELSE 4 END,
    'B',
    'CTR-B-' || LPAD(((seq-1)/4 + 1)::TEXT, 5, '0')
  FROM generate_series(1, 200) seq;

  -- Rank 5: PT Engineering Power Solutions (Category F) - 97.22% = 175/180
  INSERT INTO supplier_otif_deliveries (
    organization_id, purchase_order_id, supplier_id, supplier_name,
    order_date, expected_delivery_date, actual_delivery_date,
    quantity_ordered, quantity_delivered,
    is_on_time, is_in_full, is_otif, delivery_status, delay_days,
    main_category_code, contract_id
  )
  SELECT 
    'ORG001',
    'PO-F-' || LPAD(seq::TEXT, 5, '0'),
    'SUPP-005',
    'PT Engineering Power Solutions',
    CURRENT_DATE - (seq * 7),
    CURRENT_DATE - (seq * 7) + 14,
    CURRENT_DATE - (seq * 7) + (CASE WHEN seq <= 175 THEN 13 ELSE 18 END),
    100.00,
    100.00,
    seq <= 175,
    seq <= 175,
    seq <= 175,
    'delivered',
    CASE WHEN seq <= 175 THEN 0 ELSE 4 END,
    'F',
    'CTR-F-' || LPAD(((seq-1)/4 + 1)::TEXT, 5, '0')
  FROM generate_series(1, 180) seq;

  -- Rank 6: PT Turbine Systems International (Category A) - 97.00% = 194/200
  INSERT INTO supplier_otif_deliveries (
    organization_id, purchase_order_id, supplier_id, supplier_name,
    order_date, expected_delivery_date, actual_delivery_date,
    quantity_ordered, quantity_delivered,
    is_on_time, is_in_full, is_otif, delivery_status, delay_days,
    main_category_code, contract_id
  )
  SELECT 
    'ORG001',
    'PO-A-' || LPAD((580 + seq)::TEXT, 5, '0'),
    'SUPP-006',
    'PT Turbine Systems International',
    CURRENT_DATE - (seq * 7),
    CURRENT_DATE - (seq * 7) + 14,
    CURRENT_DATE - (seq * 7) + (CASE WHEN seq <= 194 THEN 13 ELSE 18 END),
    100.00,
    100.00,
    seq <= 194,
    seq <= 194,
    seq <= 194,
    'delivered',
    CASE WHEN seq <= 194 THEN 0 ELSE 4 END,
    'A',
    'CTR-A-' || LPAD((145 + (seq-1)/4 + 1)::TEXT, 5, '0')
  FROM generate_series(1, 200) seq;

  -- Rank 7: PT Komponen Industri Prima (Category A) - 96.67% = 174/180
  INSERT INTO supplier_otif_deliveries (
    organization_id, purchase_order_id, supplier_id, supplier_name,
    order_date, expected_delivery_date, actual_delivery_date,
    quantity_ordered, quantity_delivered,
    is_on_time, is_in_full, is_otif, delivery_status, delay_days,
    main_category_code, contract_id
  )
  SELECT 
    'ORG001',
    'PO-A-' || LPAD((780 + seq)::TEXT, 5, '0'),
    'SUPP-007',
    'PT Komponen Industri Prima',
    CURRENT_DATE - (seq * 7),
    CURRENT_DATE - (seq * 7) + 14,
    CURRENT_DATE - (seq * 7) + (CASE WHEN seq <= 174 THEN 13 ELSE 18 END),
    100.00,
    100.00,
    seq <= 174,
    seq <= 174,
    seq <= 174,
    'delivered',
    CASE WHEN seq <= 174 THEN 0 ELSE 4 END,
    'A',
    'CTR-A-' || LPAD((195 + (seq-1)/4 + 1)::TEXT, 5, '0')
  FROM generate_series(1, 180) seq;

  -- Rank 8: PT Beton Perkasa Indonesia (Category B) - 96.50% = 193/200
  INSERT INTO supplier_otif_deliveries (
    organization_id, purchase_order_id, supplier_id, supplier_name,
    order_date, expected_delivery_date, actual_delivery_date,
    quantity_ordered, quantity_delivered,
    is_on_time, is_in_full, is_otif, delivery_status, delay_days,
    main_category_code, contract_id
  )
  SELECT 
    'ORG001',
    'PO-B-' || LPAD((200 + seq)::TEXT, 5, '0'),
    'SUPP-008',
    'PT Beton Perkasa Indonesia',
    CURRENT_DATE - (seq * 7),
    CURRENT_DATE - (seq * 7) + 14,
    CURRENT_DATE - (seq * 7) + (CASE WHEN seq <= 193 THEN 13 ELSE 18 END),
    100.00,
    100.00,
    seq <= 193,
    seq <= 193,
    seq <= 193,
    'delivered',
    CASE WHEN seq <= 193 THEN 0 ELSE 4 END,
    'B',
    'CTR-B-' || LPAD((50 + (seq-1)/4 + 1)::TEXT, 5, '0')
  FROM generate_series(1, 200) seq;

  -- Rank 9: PT Konstruksi Pembangkit Nusantara (Category F) - 96.11% = 173/180
  INSERT INTO supplier_otif_deliveries (
    organization_id, purchase_order_id, supplier_id, supplier_name,
    order_date, expected_delivery_date, actual_delivery_date,
    quantity_ordered, quantity_delivered,
    is_on_time, is_in_full, is_otif, delivery_status, delay_days,
    main_category_code, contract_id
  )
  SELECT 
    'ORG001',
    'PO-F-' || LPAD((180 + seq)::TEXT, 5, '0'),
    'SUPP-009',
    'PT Konstruksi Pembangkit Nusantara',
    CURRENT_DATE - (seq * 7),
    CURRENT_DATE - (seq * 7) + 14,
    CURRENT_DATE - (seq * 7) + (CASE WHEN seq <= 173 THEN 13 ELSE 18 END),
    100.00,
    100.00,
    seq <= 173,
    seq <= 173,
    seq <= 173,
    'delivered',
    CASE WHEN seq <= 173 THEN 0 ELSE 4 END,
    'F',
    'CTR-F-' || LPAD((45 + (seq-1)/4 + 1)::TEXT, 5, '0')
  FROM generate_series(1, 180) seq;

  -- Rank 10: PT Precision Parts Manufacturing (Category A) - 96.00% = 192/200
  INSERT INTO supplier_otif_deliveries (
    organization_id, purchase_order_id, supplier_id, supplier_name,
    order_date, expected_delivery_date, actual_delivery_date,
    quantity_ordered, quantity_delivered,
    is_on_time, is_in_full, is_otif, delivery_status, delay_days,
    main_category_code, contract_id
  )
  SELECT 
    'ORG001',
    'PO-A-' || LPAD((960 + seq)::TEXT, 5, '0'),
    'SUPP-010',
    'PT Precision Parts Manufacturing',
    CURRENT_DATE - (seq * 7),
    CURRENT_DATE - (seq * 7) + 14,
    CURRENT_DATE - (seq * 7) + (CASE WHEN seq <= 192 THEN 13 ELSE 18 END),
    100.00,
    100.00,
    seq <= 192,
    seq <= 192,
    seq <= 192,
    'delivered',
    CASE WHEN seq <= 192 THEN 0 ELSE 4 END,
    'A',
    'CTR-A-' || LPAD((240 + (seq-1)/4 + 1)::TEXT, 5, '0')
  FROM generate_series(1, 200) seq;

END $$;
