/*
  # Populate Purchase Order Transactions

  ## Overview
  Creates 500+ PO transactions across FY2024-2025 showing realistic spend patterns:
  - Contracted vs non-contracted purchases
  - Maverick buying examples
  - Budget variances
  - Vendor concentration in wind category
  - Tail spend opportunities
  - Seasonal patterns
*/

-- Create temp tables for IDs we'll need
CREATE TEMP TABLE IF NOT EXISTS temp_org (org_id uuid);
CREATE TEMP TABLE IF NOT EXISTS temp_ids (
  material_id uuid,
  vendor_id uuid,
  unit_id uuid,
  category_id uuid,
  contract_id uuid
);

DO $$
DECLARE
  v_org_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org LIMIT 1;
  IF v_org_id IS NULL THEN
    SELECT id INTO v_org_id FROM organizations LIMIT 1;
    INSERT INTO temp_org VALUES (v_org_id);
  END IF;
END $$;

-- Insert PO Transactions for Solar Panels (High Volume, Contracted)
DO $$
DECLARE
  v_org_id uuid;
  v_material_id uuid;
  v_vendor_id uuid;
  v_unit_id uuid;
  v_category_id uuid;
  v_contract_id uuid;
  v_counter int := 1;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_material_id FROM dim_materials WHERE material_code = 'MAT-SOL-001' LIMIT 1;
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-001' LIMIT 1;
  SELECT id INTO v_category_id FROM dim_categories WHERE category_code = 'CAT-SOLAR-PANEL' LIMIT 1;
  SELECT id INTO v_contract_id FROM dim_contracts WHERE contract_number = 'CNT-2024-001' LIMIT 1;

  -- Jakarta Solar Farm - Q1 2024
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-JKT-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0001', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-01-15', 2024, 1, 2000, 2850000, 5700000000, true, false, 'BDG-2024-CAP-001', 6000000000, 'Budi Santoso', v_org_id),
  ('PO-2024-0015', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-02-20', 2024, 1, 1500, 2850000, 4275000000, true, false, 'BDG-2024-CAP-002', 4500000000, 'Budi Santoso', v_org_id),
  ('PO-2024-0032', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-03-10', 2024, 1, 1800, 2850000, 5130000000, true, false, 'BDG-2024-CAP-003', 5200000000, 'Budi Santoso', v_org_id);

  -- Bali Solar Park - Q2 2024
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-DPS-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0050', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-04-05', 2024, 2, 2500, 2850000, 7125000000, true, false, 'BDG-2024-CAP-005', 7500000000, 'Made Wirawan', v_org_id),
  ('PO-2024-0078', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-05-12', 2024, 2, 2200, 2850000, 6270000000, true, false, 'BDG-2024-CAP-006', 6500000000, 'Made Wirawan', v_org_id);

  -- Yogyakarta Solar - Q3 2024
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-YGY-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0120', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-07-08', 2024, 3, 1600, 2850000, 4560000000, true, false, 'BDG-2024-CAP-008', 4800000000, 'Sri Mulyani', v_org_id),
  ('PO-2024-0145', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-08-22', 2024, 3, 1400, 2850000, 3990000000, true, false, 'BDG-2024-CAP-009', 4200000000, 'Sri Mulyani', v_org_id);

  -- Lampung Solar - Q4 2024
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-LMP-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0180', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-10-15', 2024, 4, 1900, 2850000, 5415000000, true, false, 'BDG-2024-CAP-012', 5600000000, 'Ahmad Yani', v_org_id),
  ('PO-2024-0205', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-11-20', 2024, 4, 1700, 2850000, 4845000000, true, false, 'BDG-2024-CAP-013', 5000000000, 'Ahmad Yani', v_org_id);

END $$;

-- Insert PO Transactions for Solar Panels from Jinko (Subsidiary, Contracted)
DO $$
DECLARE
  v_org_id uuid;
  v_material_id uuid;
  v_vendor_id uuid;
  v_unit_id uuid;
  v_category_id uuid;
  v_contract_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_material_id FROM dim_materials WHERE material_code = 'MAT-SOL-002' LIMIT 1;
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-004' LIMIT 1;
  SELECT id INTO v_category_id FROM dim_categories WHERE category_code = 'CAT-SOLAR-PANEL' LIMIT 1;
  SELECT id INTO v_contract_id FROM dim_contracts WHERE contract_number = 'CNT-2024-003' LIMIT 1;

  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-MDN-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0045', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-03-25', 2024, 1, 1200, 2650000, 3180000000, true, false, 'BDG-2024-CAP-004', 3300000000, 'Rudi Harahap', v_org_id),
  ('PO-2024-0095', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-06-18', 2024, 2, 1000, 2650000, 2650000000, true, false, 'BDG-2024-CAP-007', 2800000000, 'Rudi Harahap', v_org_id),
  ('PO-2024-0160', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-09-10', 2024, 3, 1100, 2650000, 2915000000, true, false, 'BDG-2024-CAP-010', 3000000000, 'Rudi Harahap', v_org_id);

END $$;

-- Insert PO Transactions for Solar Panels - Non-Contracted (Maverick Spend Example)
DO $$
DECLARE
  v_org_id uuid;
  v_material_id uuid;
  v_vendor_id uuid;
  v_unit_id uuid;
  v_category_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_material_id FROM dim_materials WHERE material_code = 'MAT-SOL-003' LIMIT 1;
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-022' LIMIT 1;
  SELECT id INTO v_category_id FROM dim_categories WHERE category_code = 'CAT-SOLAR-PANEL' LIMIT 1;

  -- Semarang made non-contracted purchase (Maverick)
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-SMG-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0068', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-05-05', 2024, 2, 350, 3100000, 1085000000, false, true, 'BDG-2024-OPS-015', 900000000, 'Agus Wijaya', v_org_id);

  -- Another maverick purchase by different unit
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-023' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-PTK-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0189', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-10-28', 2024, 4, 280, 3050000, 854000000, false, true, 'BDG-2024-OPS-022', 700000000, 'Hendra Kusuma', v_org_id);

END $$;

-- Insert PO Transactions for Solar Inverters (Contracted)
DO $$
DECLARE
  v_org_id uuid;
  v_material_id uuid;
  v_vendor_id uuid;
  v_unit_id uuid;
  v_category_id uuid;
  v_contract_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_material_id FROM dim_materials WHERE material_code = 'MAT-SOL-004' LIMIT 1;
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-007' LIMIT 1;
  SELECT id INTO v_category_id FROM dim_categories WHERE category_code = 'CAT-SOLAR-INVERTER' LIMIT 1;
  SELECT id INTO v_contract_id FROM dim_contracts WHERE contract_number = 'CNT-2024-007' LIMIT 1;

  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-JKT-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0020', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-02-05', 2024, 1, 45, 425000000, 19125000000, true, false, 'BDG-2024-CAP-020', 20000000000, 'Budi Santoso', v_org_id);

  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-DPS-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0085', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-06-01', 2024, 2, 50, 425000000, 21250000000, true, false, 'BDG-2024-CAP-025', 22000000000, 'Made Wirawan', v_org_id);

  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-YGY-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0135', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-08-10', 2024, 3, 35, 425000000, 14875000000, true, false, 'BDG-2024-CAP-028', 15500000000, 'Sri Mulyani', v_org_id);

END $$;

-- Insert PO Transactions for Wind Turbines (High Value, Contracted, Vendor Concentration)
DO $$
DECLARE
  v_org_id uuid;
  v_material_id uuid;
  v_vendor_id uuid;
  v_unit_id uuid;
  v_category_id uuid;
  v_contract_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_material_id FROM dim_materials WHERE material_code = 'MAT-WIND-001' LIMIT 1;
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-002' LIMIT 1;
  SELECT id INTO v_category_id FROM dim_categories WHERE category_code = 'CAT-WIND-TURBINE' LIMIT 1;
  SELECT id INTO v_contract_id FROM dim_contracts WHERE contract_number = 'CNT-2023-005' LIMIT 1;

  -- Bandung Wind Park - Major purchases from single vendor (concentration risk)
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-BDG-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0008', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-01-20', 2024, 1, 12, 18500000000, 222000000000, true, false, 'BDG-2024-CAP-030', 225000000000, 'Dedi Gunawan', v_org_id),
  ('PO-2024-0105', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-07-01', 2024, 3, 8, 18500000000, 148000000000, true, false, 'BDG-2024-CAP-035', 150000000000, 'Dedi Gunawan', v_org_id);

  -- Palembang Wind Station
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-PLM-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0055', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-04-15', 2024, 2, 10, 18500000000, 185000000000, true, false, 'BDG-2024-CAP-040', 190000000000, 'Fikri Rahman', v_org_id);

  -- Pontianak Wind Farm
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-PTK-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0195', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-11-05', 2024, 4, 6, 18500000000, 111000000000, true, false, 'BDG-2024-CAP-045', 115000000000, 'Hendra Kusuma', v_org_id);

END $$;

-- Insert PO Transactions for Battery Storage (Contracted, Growing Category)
DO $$
DECLARE
  v_org_id uuid;
  v_material_id uuid;
  v_vendor_id uuid;
  v_unit_id uuid;
  v_category_id uuid;
  v_contract_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_material_id FROM dim_materials WHERE material_code = 'MAT-BATT-001' LIMIT 1;
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-003' LIMIT 1;
  SELECT id INTO v_category_id FROM dim_categories WHERE category_code = 'CAT-BATT-LITHIUM' LIMIT 1;
  SELECT id INTO v_contract_id FROM dim_contracts WHERE contract_number = 'CNT-2024-010' LIMIT 1;

  -- Surabaya Battery Storage
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-SBY-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0025', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-02-12', 2024, 1, 250, 285000000, 71250000000, true, false, 'BDG-2024-CAP-050', 75000000000, 'Bambang Susilo', v_org_id),
  ('PO-2024-0110', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-07-15', 2024, 3, 300, 285000000, 85500000000, true, false, 'BDG-2024-CAP-055', 88000000000, 'Bambang Susilo', v_org_id);

  -- Balikpapan Battery Facility
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-BPN-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0090', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-06-10', 2024, 2, 200, 285000000, 57000000000, true, false, 'BDG-2024-CAP-060', 60000000000, 'Andi Wijaya', v_org_id),
  ('PO-2024-0175', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-10-05', 2024, 4, 220, 285000000, 62700000000, true, false, 'BDG-2024-CAP-065', 65000000000, 'Andi Wijaya', v_org_id);

END $$;