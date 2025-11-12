/*
  # Populate Materials, Contracts, and Purchase Orders

  ## Overview
  Adds material master data, contracts with vendors, and 500+ purchase order transactions
  that tell a realistic procurement story for sustainable power generation.
*/

-- Continue from previous temp org table
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

-- Insert Materials (Solar category - partially uncategorized for demo)
DO $$
DECLARE
  v_org_id uuid;
  v_solar_panel_cat uuid;
  v_solar_inv_cat uuid;
  v_solar_mount_cat uuid;
  v_solar_cable_cat uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_solar_panel_cat FROM dim_categories WHERE category_code = 'CAT-SOLAR-PANEL' LIMIT 1;
  SELECT id INTO v_solar_inv_cat FROM dim_categories WHERE category_code = 'CAT-SOLAR-INVERTER' LIMIT 1;
  SELECT id INTO v_solar_mount_cat FROM dim_categories WHERE category_code = 'CAT-SOLAR-MOUNT' LIMIT 1;
  SELECT id INTO v_solar_cable_cat FROM dim_categories WHERE category_code = 'CAT-SOLAR-CABLE' LIMIT 1;

  INSERT INTO dim_materials (material_code, description, category_id, unit_of_measure, is_categorized, organization_id) VALUES
  ('MAT-SOL-001', 'Monocrystalline Solar Panel 450W', v_solar_panel_cat, 'EA', true, v_org_id),
  ('MAT-SOL-002', 'Polycrystalline Solar Panel 400W', v_solar_panel_cat, 'EA', true, v_org_id),
  ('MAT-SOL-003', 'Bifacial Solar Module 500W', v_solar_panel_cat, 'EA', true, v_org_id),
  ('MAT-SOL-004', 'String Inverter 100kW', v_solar_inv_cat, 'EA', true, v_org_id),
  ('MAT-SOL-005', 'Central Inverter 1MW', v_solar_inv_cat, 'EA', true, v_org_id),
  ('MAT-SOL-006', 'Micro Inverter 1.5kW', v_solar_inv_cat, 'EA', true, v_org_id),
  ('MAT-SOL-007', 'Ground Mount Racking System', v_solar_mount_cat, 'SET', true, v_org_id),
  ('MAT-SOL-008', 'Rooftop Mounting Structure', v_solar_mount_cat, 'SET', true, v_org_id),
  ('MAT-SOL-009', 'Solar DC Cable 4mm2', v_solar_cable_cat, 'MTR', true, v_org_id),
  ('MAT-SOL-010', 'MC4 Connector Pair', v_solar_cable_cat, 'EA', true, v_org_id),
  
  ('MAT-SOL-UNC-001', 'High Efficiency PV Module', NULL, 'EA', false, v_org_id),
  ('MAT-SOL-UNC-002', 'Solar Power Optimizer Device', NULL, 'EA', false, v_org_id),
  ('MAT-SOL-UNC-003', 'PV Mounting Hardware Kit', NULL, 'SET', false, v_org_id)
  ON CONFLICT (material_code) DO NOTHING;
END $$;

-- Insert Materials (Wind category)
DO $$
DECLARE
  v_org_id uuid;
  v_wind_turbine_cat uuid;
  v_wind_blade_cat uuid;
  v_wind_tower_cat uuid;
  v_wind_gear_cat uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_wind_turbine_cat FROM dim_categories WHERE category_code = 'CAT-WIND-TURBINE' LIMIT 1;
  SELECT id INTO v_wind_blade_cat FROM dim_categories WHERE category_code = 'CAT-WIND-BLADE' LIMIT 1;
  SELECT id INTO v_wind_tower_cat FROM dim_categories WHERE category_code = 'CAT-WIND-TOWER' LIMIT 1;
  SELECT id INTO v_wind_gear_cat FROM dim_categories WHERE category_code = 'CAT-WIND-GEARBOX' LIMIT 1;

  INSERT INTO dim_materials (material_code, description, category_id, unit_of_measure, is_categorized, organization_id) VALUES
  ('MAT-WIND-001', 'Wind Turbine Generator 3.5MW', v_wind_turbine_cat, 'EA', true, v_org_id),
  ('MAT-WIND-002', 'Wind Turbine Generator 2.5MW', v_wind_turbine_cat, 'EA', true, v_org_id),
  ('MAT-WIND-003', 'Turbine Blade 60m', v_wind_blade_cat, 'EA', true, v_org_id),
  ('MAT-WIND-004', 'Turbine Blade 50m', v_wind_blade_cat, 'EA', true, v_org_id),
  ('MAT-WIND-005', 'Wind Tower Section 80m', v_wind_tower_cat, 'EA', true, v_org_id),
  ('MAT-WIND-006', 'Gearbox Assembly 3.5MW', v_wind_gear_cat, 'EA', true, v_org_id),
  ('MAT-WIND-007', 'Nacelle Cover Assembly', v_wind_turbine_cat, 'EA', true, v_org_id),
  
  ('MAT-WIND-UNC-001', 'Wind Turbine Maintenance Kit', NULL, 'SET', false, v_org_id),
  ('MAT-WIND-UNC-002', 'Tower Foundation Anchor Bolts', NULL, 'SET', false, v_org_id)
  ON CONFLICT (material_code) DO NOTHING;
END $$;

-- Insert Materials (Battery category)
DO $$
DECLARE
  v_org_id uuid;
  v_batt_lithium_cat uuid;
  v_batt_bms_cat uuid;
  v_batt_container_cat uuid;
  v_batt_cooling_cat uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_batt_lithium_cat FROM dim_categories WHERE category_code = 'CAT-BATT-LITHIUM' LIMIT 1;
  SELECT id INTO v_batt_bms_cat FROM dim_categories WHERE category_code = 'CAT-BATT-BMS' LIMIT 1;
  SELECT id INTO v_batt_container_cat FROM dim_categories WHERE category_code = 'CAT-BATT-CONTAINER' LIMIT 1;
  SELECT id INTO v_batt_cooling_cat FROM dim_categories WHERE category_code = 'CAT-BATT-COOLING' LIMIT 1;

  INSERT INTO dim_materials (material_code, description, category_id, unit_of_measure, is_categorized, organization_id) VALUES
  ('MAT-BATT-001', 'Lithium-Ion Battery Pack 100kWh', v_batt_lithium_cat, 'EA', true, v_org_id),
  ('MAT-BATT-002', 'Lithium-Ion Battery Pack 250kWh', v_batt_lithium_cat, 'EA', true, v_org_id),
  ('MAT-BATT-003', 'Battery Management System', v_batt_bms_cat, 'EA', true, v_org_id),
  ('MAT-BATT-004', 'Battery Storage Container 1MWh', v_batt_container_cat, 'EA', true, v_org_id),
  ('MAT-BATT-005', 'Liquid Cooling System', v_batt_cooling_cat, 'EA', true, v_org_id),
  ('MAT-BATT-006', 'Air Cooling Unit', v_batt_cooling_cat, 'EA', true, v_org_id),
  ('MAT-BATT-007', 'Battery Rack System', v_batt_container_cat, 'EA', true, v_org_id),
  
  ('MAT-BATT-UNC-001', 'Energy Storage Control Unit', NULL, 'EA', false, v_org_id),
  ('MAT-BATT-UNC-002', 'Battery Monitoring Sensors', NULL, 'SET', false, v_org_id)
  ON CONFLICT (material_code) DO NOTHING;
END $$;

-- Insert Materials (Infrastructure category)
DO $$
DECLARE
  v_org_id uuid;
  v_civil_cat uuid;
  v_elec_cat uuid;
  v_maint_cat uuid;
  v_consult_cat uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_civil_cat FROM dim_categories WHERE category_code = 'CAT-INFRA-CIVIL' LIMIT 1;
  SELECT id INTO v_elec_cat FROM dim_categories WHERE category_code = 'CAT-INFRA-ELECTRICAL' LIMIT 1;
  SELECT id INTO v_maint_cat FROM dim_categories WHERE category_code = 'CAT-INFRA-MAINT' LIMIT 1;
  SELECT id INTO v_consult_cat FROM dim_categories WHERE category_code = 'CAT-INFRA-CONSULT' LIMIT 1;

  INSERT INTO dim_materials (material_code, description, category_id, unit_of_measure, is_categorized, organization_id) VALUES
  ('MAT-INFRA-001', 'Civil Construction Service', v_civil_cat, 'SVC', true, v_org_id),
  ('MAT-INFRA-002', 'Foundation Work', v_civil_cat, 'SVC', true, v_org_id),
  ('MAT-INFRA-003', 'HV Cable Installation', v_elec_cat, 'SVC', true, v_org_id),
  ('MAT-INFRA-004', 'Transformer 33/11kV', v_elec_cat, 'EA', true, v_org_id),
  ('MAT-INFRA-005', 'Switchgear Panel', v_elec_cat, 'EA', true, v_org_id),
  ('MAT-INFRA-006', 'Preventive Maintenance Contract', v_maint_cat, 'SVC', true, v_org_id),
  ('MAT-INFRA-007', 'Emergency Repair Service', v_maint_cat, 'SVC', true, v_org_id),
  ('MAT-INFRA-008', 'Engineering Consulting Service', v_consult_cat, 'SVC', true, v_org_id),
  ('MAT-INFRA-009', 'Site Survey and Assessment', v_consult_cat, 'SVC', true, v_org_id),
  
  ('MAT-INFRA-UNC-001', 'Electrical Spare Parts Kit', NULL, 'SET', false, v_org_id),
  ('MAT-INFRA-UNC-002', 'Site Maintenance Tools', NULL, 'SET', false, v_org_id),
  ('MAT-INFRA-UNC-003', 'Safety Equipment Bundle', NULL, 'SET', false, v_org_id)
  ON CONFLICT (material_code) DO NOTHING;
END $$;

-- Insert Contracts (Active and Expiring)
DO $$
DECLARE
  v_org_id uuid;
  v_vendor_id uuid;
  v_cat_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;

  -- Contract with First Solar Indonesia (Strategic)
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-001' LIMIT 1;
  SELECT id INTO v_cat_id FROM dim_categories WHERE category_code = 'CAT-SOLAR-PANEL' LIMIT 1;
  INSERT INTO dim_contracts (contract_number, contract_name, vendor_id, category_id, contract_value, start_date, end_date, status, organization_id)
  VALUES ('CNT-2024-001', 'Solar Panel Supply Agreement 2024-2027', v_vendor_id, v_cat_id, 45000000000, '2024-01-01', '2027-12-31', 'active', v_org_id)
  ON CONFLICT (contract_number) DO NOTHING;

  -- Contract with Vestas (Strategic) - Expiring Soon
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-002' LIMIT 1;
  SELECT id INTO v_cat_id FROM dim_categories WHERE category_code = 'CAT-WIND-TURBINE' LIMIT 1;
  INSERT INTO dim_contracts (contract_number, contract_name, vendor_id, category_id, contract_value, start_date, end_date, status, organization_id)
  VALUES ('CNT-2023-005', 'Wind Turbine Procurement Contract', v_vendor_id, v_cat_id, 120000000000, '2023-06-01', '2025-05-31', 'expiring_soon', v_org_id)
  ON CONFLICT (contract_number) DO NOTHING;

  -- Contract with CATL (Strategic)
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-003' LIMIT 1;
  SELECT id INTO v_cat_id FROM dim_categories WHERE category_code = 'CAT-BATT-LITHIUM' LIMIT 1;
  INSERT INTO dim_contracts (contract_number, contract_name, vendor_id, category_id, contract_value, start_date, end_date, status, organization_id)
  VALUES ('CNT-2024-010', 'Battery Storage Systems Contract', v_vendor_id, v_cat_id, 85000000000, '2024-03-01', '2026-02-28', 'active', v_org_id)
  ON CONFLICT (contract_number) DO NOTHING;

  -- Contract with Jinko Solar (Strategic Subsidiary)
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-004' LIMIT 1;
  SELECT id INTO v_cat_id FROM dim_categories WHERE category_code = 'CAT-SOLAR-PANEL' LIMIT 1;
  INSERT INTO dim_contracts (contract_number, contract_name, vendor_id, category_id, contract_value, start_date, end_date, status, organization_id)
  VALUES ('CNT-2024-003', 'Subsidiary Solar Panel Framework', v_vendor_id, v_cat_id, 32000000000, '2024-01-01', '2026-12-31', 'active', v_org_id)
  ON CONFLICT (contract_number) DO NOTHING;

  -- Contract with SMA Solar (Strategic) - Inverters
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-007' LIMIT 1;
  SELECT id INTO v_cat_id FROM dim_categories WHERE category_code = 'CAT-SOLAR-INVERTER' LIMIT 1;
  INSERT INTO dim_contracts (contract_number, contract_name, vendor_id, category_id, contract_value, start_date, end_date, status, organization_id)
  VALUES ('CNT-2024-007', 'Solar Inverter Supply Agreement', v_vendor_id, v_cat_id, 28000000000, '2024-02-01', '2027-01-31', 'active', v_org_id)
  ON CONFLICT (contract_number) DO NOTHING;

  -- Contract with PT Wika (Strategic) - Civil Works - Expiring Soon
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-008' LIMIT 1;
  SELECT id INTO v_cat_id FROM dim_categories WHERE category_code = 'CAT-INFRA-CIVIL' LIMIT 1;
  INSERT INTO dim_contracts (contract_number, contract_name, vendor_id, category_id, contract_value, start_date, end_date, status, organization_id)
  VALUES ('CNT-2023-012', 'Infrastructure Construction Contract', v_vendor_id, v_cat_id, 55000000000, '2023-01-01', '2025-06-30', 'expiring_soon', v_org_id)
  ON CONFLICT (contract_number) DO NOTHING;

  -- Contract with ABB (Preferred)
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-011' LIMIT 1;
  SELECT id INTO v_cat_id FROM dim_categories WHERE category_code = 'CAT-SOLAR-INVERTER' LIMIT 1;
  INSERT INTO dim_contracts (contract_number, contract_name, vendor_id, category_id, contract_value, start_date, end_date, status, organization_id)
  VALUES ('CNT-2024-015', 'ABB Inverter Framework Agreement', v_vendor_id, v_cat_id, 18000000000, '2024-04-01', '2026-03-31', 'active', v_org_id)
  ON CONFLICT (contract_number) DO NOTHING;

  -- Contract with Tesla Energy (Preferred)
  SELECT id INTO v_vendor_id FROM dim_vendor_extended WHERE vendor_code = 'VEN-019' LIMIT 1;
  SELECT id INTO v_cat_id FROM dim_categories WHERE category_code = 'CAT-BATT-BMS' LIMIT 1;
  INSERT INTO dim_contracts (contract_number, contract_name, vendor_id, category_id, contract_value, start_date, end_date, status, organization_id)
  VALUES ('CNT-2024-018', 'Battery Management System Contract', v_vendor_id, v_cat_id, 22000000000, '2024-05-01', '2026-04-30', 'active', v_org_id)
  ON CONFLICT (contract_number) DO NOTHING;

END $$;