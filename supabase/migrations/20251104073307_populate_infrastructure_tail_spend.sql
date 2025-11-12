/*
  # Populate Infrastructure and Tail Spend Transactions

  ## Overview
  Adds infrastructure services and tail spend examples showing:
  - Civil works and electrical infrastructure (contracted)
  - Maintenance services (mix of contracted and non-contracted)
  - Consulting services (mostly non-contracted)
  - Tail spend from small vendors (cables, mounting, misc items)
*/

CREATE TEMP TABLE IF NOT EXISTS temp_org (org_id uuid);

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

-- Civil Works (Contracted with PT Wika)
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
  SELECT id INTO v_material_id FROM dim_materials WHERE material_code = 'MAT-INFRA-001' LIMIT 1;
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-008' LIMIT 1;
  SELECT id INTO v_category_id FROM dim_categories WHERE category_code = 'CAT-INFRA-CIVIL' LIMIT 1;
  SELECT id INTO v_contract_id FROM dim_contracts WHERE contract_number = 'CNT-2023-012' LIMIT 1;

  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-JKT-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0010', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-01-25', 2024, 1, 1, 8500000000, 8500000000, true, false, 'BDG-2024-CAP-070', 9000000000, 'Budi Santoso', v_org_id);

  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-BDG-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0062', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-05-10', 2024, 2, 1, 12500000000, 12500000000, true, false, 'BDG-2024-CAP-075', 13000000000, 'Dedi Gunawan', v_org_id);

  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-DPS-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0150', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, v_contract_id, '2024-09-01', 2024, 3, 1, 9800000000, 9800000000, true, false, 'BDG-2024-CAP-080', 10000000000, 'Made Wirawan', v_org_id);

END $$;

-- Electrical Infrastructure (Mix of contracted and non-contracted)
DO $$
DECLARE
  v_org_id uuid;
  v_material_id uuid;
  v_vendor_id uuid;
  v_unit_id uuid;
  v_category_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_material_id FROM dim_materials WHERE material_code = 'MAT-INFRA-004' LIMIT 1;
  SELECT id INTO v_category_id FROM dim_categories WHERE category_code = 'CAT-INFRA-ELECTRICAL' LIMIT 1;

  -- Contracted purchase from Schneider (subsidiary)
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-026' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-SBY-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0040', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-03-15', 2024, 1, 8, 1850000000, 14800000000, false, false, 'BDG-2024-CAP-085', 15000000000, 'Bambang Susilo', v_org_id);

  -- Non-contracted from transactional vendor
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-028' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-MKS-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0125', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-07-25', 2024, 3, 5, 1920000000, 9600000000, false, false, 'BDG-2024-CAP-090', 10000000000, 'Arief Budiman', v_org_id);

END $$;

-- Maintenance Services (Mix showing gaps in contract coverage)
DO $$
DECLARE
  v_org_id uuid;
  v_material_id uuid;
  v_vendor_id uuid;
  v_unit_id uuid;
  v_category_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_material_id FROM dim_materials WHERE material_code = 'MAT-INFRA-006' LIMIT 1;
  SELECT id INTO v_category_id FROM dim_categories WHERE category_code = 'CAT-INFRA-MAINT' LIMIT 1;

  -- Non-contracted maintenance from transactional vendor
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-035' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-JKT-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0035', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-03-05', 2024, 1, 1, 2400000000, 2400000000, false, false, 'BDG-2024-OPS-100', 2500000000, 'Budi Santoso', v_org_id),
  ('PO-2024-0115', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-07-18', 2024, 3, 1, 2400000000, 2400000000, false, false, 'BDG-2024-OPS-105', 2500000000, 'Budi Santoso', v_org_id);

  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-BDG-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0080', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-05-28', 2024, 2, 1, 2400000000, 2400000000, false, false, 'BDG-2024-OPS-110', 2500000000, 'Dedi Gunawan', v_org_id);

  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-PLM-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0185', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-10-20', 2024, 4, 1, 2400000000, 2400000000, false, false, 'BDG-2024-OPS-115', 2500000000, 'Fikri Rahman', v_org_id);

END $$;

-- Consulting Services (Mostly non-contracted, opportunity for consolidation)
DO $$
DECLARE
  v_org_id uuid;
  v_material_id uuid;
  v_vendor_id uuid;
  v_unit_id uuid;
  v_category_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_material_id FROM dim_materials WHERE material_code = 'MAT-INFRA-008' LIMIT 1;
  SELECT id INTO v_category_id FROM dim_categories WHERE category_code = 'CAT-INFRA-CONSULT' LIMIT 1;

  -- Various consulting purchases from different tail vendors
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-043' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-JKT-HQ' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0048', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-04-01', 2024, 2, 1, 850000000, 850000000, false, false, 'BDG-2024-OPS-120', 900000000, 'Siti Nurhaliza', v_org_id);

  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-051' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-BDO-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0102', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-06-25', 2024, 2, 1, 720000000, 720000000, false, false, 'BDG-2024-OPS-125', 750000000, 'Wati Kusumawati', v_org_id);

END $$;

-- Tail Spend - Solar Cables and Connectors
DO $$
DECLARE
  v_org_id uuid;
  v_material_id uuid;
  v_vendor_id uuid;
  v_unit_id uuid;
  v_category_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_material_id FROM dim_materials WHERE material_code = 'MAT-SOL-009' LIMIT 1;
  SELECT id INTO v_category_id FROM dim_categories WHERE category_code = 'CAT-SOLAR-CABLE' LIMIT 1;

  -- Multiple small purchases from tail vendors (consolidation opportunity)
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-038' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-YGY-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0072', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-05-15', 2024, 2, 5000, 45000, 225000000, false, false, 'BDG-2024-OPS-130', 250000000, 'Sri Mulyani', v_org_id);

  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-045' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-LMP-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0130', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-08-05', 2024, 3, 3000, 48000, 144000000, false, false, 'BDG-2024-OPS-135', 150000000, 'Ahmad Yani', v_org_id);

  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-049' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-SMG-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0168', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-09-22', 2024, 3, 4000, 46000, 184000000, false, false, 'BDG-2024-OPS-140', 200000000, 'Agus Wijaya', v_org_id);

END $$;

-- Tail Spend - Mounting Hardware
DO $$
DECLARE
  v_org_id uuid;
  v_material_id uuid;
  v_vendor_id uuid;
  v_unit_id uuid;
  v_category_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_material_id FROM dim_materials WHERE material_code = 'MAT-SOL-008' LIMIT 1;
  SELECT id INTO v_category_id FROM dim_categories WHERE category_code = 'CAT-SOLAR-MOUNT' LIMIT 1;

  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-039' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-MDN-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0095', 2, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-06-18', 2024, 2, 150, 3800000, 570000000, false, false, 'BDG-2024-OPS-145', 600000000, 'Rudi Harahap', v_org_id);

  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-048' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-DPS-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0155', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-09-08', 2024, 3, 120, 3950000, 474000000, false, false, 'BDG-2024-OPS-150', 500000000, 'Made Wirawan', v_org_id);

END $$;

-- Tail Spend - Electrical Infrastructure Small Items
DO $$
DECLARE
  v_org_id uuid;
  v_material_id uuid;
  v_vendor_id uuid;
  v_unit_id uuid;
  v_category_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_material_id FROM dim_materials WHERE material_code = 'MAT-INFRA-005' LIMIT 1;
  SELECT id INTO v_category_id FROM dim_categories WHERE category_code = 'CAT-INFRA-ELECTRICAL' LIMIT 1;

  -- Multiple small electrical purchases
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-037' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-BPN-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0142', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-08-18', 2024, 3, 3, 285000000, 855000000, false, false, 'BDG-2024-OPS-155', 900000000, 'Andi Wijaya', v_org_id);

  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-040' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-MKS-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0198', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-11-12', 2024, 4, 2, 295000000, 590000000, false, false, 'BDG-2024-OPS-160', 600000000, 'Arief Budiman', v_org_id);

  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-042' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-PTK-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0210', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-11-28', 2024, 4, 2, 288000000, 576000000, false, false, 'BDG-2024-OPS-165', 600000000, 'Hendra Kusuma', v_org_id);

  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-044' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-SBY-WH' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0075', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-05-20', 2024, 2, 1, 310000000, 310000000, false, false, 'BDG-2024-OPS-170', 320000000, 'Dewi Lestari', v_org_id);

  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-046' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-JKT-HQ' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0165', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-09-18', 2024, 3, 1, 298000000, 298000000, false, false, 'BDG-2024-OPS-175', 310000000, 'Siti Nurhaliza', v_org_id);

END $$;

-- Maintenance Services from Tail Vendors
DO $$
DECLARE
  v_org_id uuid;
  v_material_id uuid;
  v_vendor_id uuid;
  v_unit_id uuid;
  v_category_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_material_id FROM dim_materials WHERE material_code = 'MAT-INFRA-007' LIMIT 1;
  SELECT id INTO v_category_id FROM dim_categories WHERE category_code = 'CAT-INFRA-MAINT' LIMIT 1;

  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-041' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-PLM-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0118', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-07-20', 2024, 3, 1, 580000000, 580000000, false, false, 'BDG-2024-OPS-180', 600000000, 'Fikri Rahman', v_org_id);

  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-047' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-BDG-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0192', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-10-30', 2024, 4, 1, 620000000, 620000000, false, false, 'BDG-2024-OPS-185', 650000000, 'Dedi Gunawan', v_org_id);

  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-050' LIMIT 1;
  SELECT id INTO v_unit_id FROM dim_units WHERE unit_code = 'UNIT-SMG-01' LIMIT 1;
  INSERT INTO fact_purchase_orders (po_number, po_line_number, material_id, vendor_id, unit_id, category_id, contract_id, po_date, fiscal_year, fiscal_quarter, quantity, unit_price, total_amount, has_contract, is_maverick, budget_code, budgeted_amount, requestor_name, organization_id)
  VALUES 
  ('PO-2024-0140', 1, v_material_id, v_vendor_id, v_unit_id, v_category_id, NULL, '2024-08-15', 2024, 3, 1, 595000000, 595000000, false, false, 'BDG-2024-OPS-190', 620000000, 'Agus Wijaya', v_org_id);

END $$;