/*
  # Populate Spend Analysis Mock Data

  ## Overview
  Populates comprehensive mock data for a sustainable power generation company
  operating in Indonesia, focusing on solar, wind, and battery storage procurement.
*/

-- First, get organization ID
DO $$
DECLARE
  v_org_id uuid;
BEGIN
  SELECT id INTO v_org_id FROM organizations WHERE org_id = 'indonesia-power' LIMIT 1;
  
  IF v_org_id IS NULL THEN
    SELECT id INTO v_org_id FROM organizations LIMIT 1;
  END IF;

  IF v_org_id IS NULL THEN
    INSERT INTO organizations (org_id, name, industry_id)
    VALUES ('spend-analysis-org', 'Indonesia Sustainable Power', 1)
    RETURNING id INTO v_org_id;
  END IF;

  CREATE TEMP TABLE IF NOT EXISTS temp_org (org_id uuid);
  DELETE FROM temp_org;
  INSERT INTO temp_org VALUES (v_org_id);
END $$;

-- Insert Categories
INSERT INTO dim_categories (id, category_code, category_name, parent_category_id, level, category_type, organization_id) VALUES
(gen_random_uuid(), 'CAT-SOLAR', 'Solar Energy Systems', NULL, 1, 'solar', (SELECT org_id FROM temp_org)),
(gen_random_uuid(), 'CAT-WIND', 'Wind Energy Systems', NULL, 1, 'wind', (SELECT org_id FROM temp_org)),
(gen_random_uuid(), 'CAT-BATTERY', 'Energy Storage Systems', NULL, 1, 'battery', (SELECT org_id FROM temp_org)),
(gen_random_uuid(), 'CAT-INFRA', 'Infrastructure & Services', NULL, 1, 'infrastructure', (SELECT org_id FROM temp_org))
ON CONFLICT (category_code) DO NOTHING;

-- Get parent category IDs and insert sub-categories
DO $$
DECLARE
  v_org_id uuid;
  v_solar_id uuid;
  v_wind_id uuid;
  v_battery_id uuid;
  v_infra_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM temp_org;
  SELECT id INTO v_solar_id FROM dim_categories WHERE category_code = 'CAT-SOLAR' LIMIT 1;
  SELECT id INTO v_wind_id FROM dim_categories WHERE category_code = 'CAT-WIND' LIMIT 1;
  SELECT id INTO v_battery_id FROM dim_categories WHERE category_code = 'CAT-BATTERY' LIMIT 1;
  SELECT id INTO v_infra_id FROM dim_categories WHERE category_code = 'CAT-INFRA' LIMIT 1;

  INSERT INTO dim_categories (category_code, category_name, parent_category_id, level, category_type, organization_id) VALUES
  ('CAT-SOLAR-PANEL', 'Solar Panels & Modules', v_solar_id, 2, 'solar', v_org_id),
  ('CAT-SOLAR-INVERTER', 'Solar Inverters', v_solar_id, 2, 'solar', v_org_id),
  ('CAT-SOLAR-MOUNT', 'Mounting & Racking Systems', v_solar_id, 2, 'solar', v_org_id),
  ('CAT-SOLAR-CABLE', 'Solar Cables & Connectors', v_solar_id, 2, 'solar', v_org_id),
  
  ('CAT-WIND-TURBINE', 'Wind Turbines', v_wind_id, 2, 'wind', v_org_id),
  ('CAT-WIND-BLADE', 'Turbine Blades', v_wind_id, 2, 'wind', v_org_id),
  ('CAT-WIND-TOWER', 'Wind Tower Components', v_wind_id, 2, 'wind', v_org_id),
  ('CAT-WIND-GEARBOX', 'Gearbox & Drivetrain', v_wind_id, 2, 'wind', v_org_id),
  
  ('CAT-BATT-LITHIUM', 'Lithium-Ion Batteries', v_battery_id, 2, 'battery', v_org_id),
  ('CAT-BATT-BMS', 'Battery Management Systems', v_battery_id, 2, 'battery', v_org_id),
  ('CAT-BATT-CONTAINER', 'Battery Storage Containers', v_battery_id, 2, 'battery', v_org_id),
  ('CAT-BATT-COOLING', 'Thermal Management Systems', v_battery_id, 2, 'battery', v_org_id),
  
  ('CAT-INFRA-CIVIL', 'Civil Works', v_infra_id, 2, 'infrastructure', v_org_id),
  ('CAT-INFRA-ELECTRICAL', 'Electrical Infrastructure', v_infra_id, 2, 'infrastructure', v_org_id),
  ('CAT-INFRA-MAINT', 'Maintenance Services', v_infra_id, 2, 'infrastructure', v_org_id),
  ('CAT-INFRA-CONSULT', 'Engineering Consulting', v_infra_id, 2, 'infrastructure', v_org_id)
  ON CONFLICT (category_code) DO NOTHING;
END $$;

-- Insert Business Units
INSERT INTO dim_units (unit_code, unit_name, province, city, latitude, longitude, unit_type, organization_id) VALUES
('UNIT-JKT-01', 'Jakarta Solar Farm', 'DKI Jakarta', 'Jakarta', -6.2088, 106.8456, 'generation_plant', (SELECT org_id FROM temp_org)),
('UNIT-BDG-01', 'Bandung Wind Park', 'Jawa Barat', 'Bandung', -6.9175, 107.6191, 'generation_plant', (SELECT org_id FROM temp_org)),
('UNIT-SBY-01', 'Surabaya Battery Storage', 'Jawa Timur', 'Surabaya', -7.2575, 112.7521, 'generation_plant', (SELECT org_id FROM temp_org)),
('UNIT-MDN-01', 'Medan Solar Complex', 'Sumatera Utara', 'Medan', 3.5952, 98.6722, 'generation_plant', (SELECT org_id FROM temp_org)),
('UNIT-PLM-01', 'Palembang Wind Station', 'Sumatera Selatan', 'Palembang', -2.9761, 104.7754, 'generation_plant', (SELECT org_id FROM temp_org)),
('UNIT-DPS-01', 'Bali Solar Park', 'Bali', 'Denpasar', -8.6705, 115.2126, 'generation_plant', (SELECT org_id FROM temp_org)),
('UNIT-MKS-01', 'Makassar Energy Hub', 'Sulawesi Selatan', 'Makassar', -5.1477, 119.4327, 'generation_plant', (SELECT org_id FROM temp_org)),
('UNIT-BPN-01', 'Balikpapan Battery Facility', 'Kalimantan Timur', 'Balikpapan', -1.2379, 116.8529, 'generation_plant', (SELECT org_id FROM temp_org)),
('UNIT-SMG-01', 'Semarang Hybrid Plant', 'Jawa Tengah', 'Semarang', -6.9932, 110.4203, 'generation_plant', (SELECT org_id FROM temp_org)),
('UNIT-YGY-01', 'Yogyakarta Solar Array', 'DI Yogyakarta', 'Yogyakarta', -7.7956, 110.3695, 'generation_plant', (SELECT org_id FROM temp_org)),
('UNIT-PTK-01', 'Pontianak Wind Farm', 'Kalimantan Barat', 'Pontianak', -0.0263, 109.3425, 'generation_plant', (SELECT org_id FROM temp_org)),
('UNIT-BDO-01', 'Bandung Regional Office', 'Jawa Barat', 'Bandung', -6.9147, 107.6098, 'office', (SELECT org_id FROM temp_org)),
('UNIT-SBY-WH', 'Surabaya Warehouse', 'Jawa Timur', 'Surabaya', -7.2459, 112.7378, 'warehouse', (SELECT org_id FROM temp_org)),
('UNIT-JKT-HQ', 'Jakarta Headquarters', 'DKI Jakarta', 'Jakarta', -6.2293, 106.8311, 'office', (SELECT org_id FROM temp_org)),
('UNIT-LMP-01', 'Lampung Solar Station', 'Lampung', 'Bandar Lampung', -5.4292, 105.2619, 'generation_plant', (SELECT org_id FROM temp_org))
ON CONFLICT (unit_code) DO NOTHING;

-- Insert Vendors (Strategic)
INSERT INTO dim_vendor_extended (vendor_code, vendor_name, segmentation, is_local, is_subsidiary, performance_score, risk_score, compliance_score, primary_categories, organization_id) VALUES
('VEN-001', 'First Solar Indonesia', 'strategic', true, false, 92, 15, 95, ARRAY['CAT-SOLAR-PANEL', 'CAT-SOLAR-INVERTER'], (SELECT org_id FROM temp_org)),
('VEN-002', 'Vestas Wind Systems Asia', 'strategic', false, false, 88, 20, 92, ARRAY['CAT-WIND-TURBINE', 'CAT-WIND-TOWER'], (SELECT org_id FROM temp_org)),
('VEN-003', 'CATL Energy Storage', 'strategic', false, false, 90, 18, 94, ARRAY['CAT-BATT-LITHIUM', 'CAT-BATT-BMS'], (SELECT org_id FROM temp_org)),
('VEN-004', 'Jinko Solar Indonesia', 'strategic', true, true, 87, 22, 93, ARRAY['CAT-SOLAR-PANEL'], (SELECT org_id FROM temp_org)),
('VEN-005', 'Siemens Gamesa Indonesia', 'strategic', true, false, 91, 16, 96, ARRAY['CAT-WIND-TURBINE', 'CAT-WIND-GEARBOX'], (SELECT org_id FROM temp_org)),
('VEN-006', 'BYD Battery Systems', 'strategic', false, false, 85, 25, 90, ARRAY['CAT-BATT-LITHIUM'], (SELECT org_id FROM temp_org)),
('VEN-007', 'SMA Solar Technology', 'strategic', false, false, 89, 19, 93, ARRAY['CAT-SOLAR-INVERTER'], (SELECT org_id FROM temp_org)),
('VEN-008', 'PT Wika Energi', 'strategic', true, false, 86, 21, 91, ARRAY['CAT-INFRA-CIVIL', 'CAT-INFRA-ELECTRICAL'], (SELECT org_id FROM temp_org))
ON CONFLICT (vendor_code) DO NOTHING;

-- Insert Vendors (Preferred)
INSERT INTO dim_vendor_extended (vendor_code, vendor_name, segmentation, is_local, is_subsidiary, performance_score, risk_score, compliance_score, primary_categories, organization_id) VALUES
('VEN-010', 'Trina Solar Nusantara', 'preferred', true, false, 82, 28, 88, ARRAY['CAT-SOLAR-PANEL'], (SELECT org_id FROM temp_org)),
('VEN-011', 'ABB Power Solutions', 'preferred', false, false, 84, 24, 89, ARRAY['CAT-SOLAR-INVERTER'], (SELECT org_id FROM temp_org)),
('VEN-012', 'Nordex Indonesia', 'preferred', true, false, 81, 29, 87, ARRAY['CAT-WIND-TURBINE'], (SELECT org_id FROM temp_org)),
('VEN-013', 'LG Energy Solution', 'preferred', false, false, 83, 26, 90, ARRAY['CAT-BATT-LITHIUM'], (SELECT org_id FROM temp_org)),
('VEN-014', 'Huawei Solar Indonesia', 'preferred', true, true, 80, 30, 86, ARRAY['CAT-SOLAR-INVERTER'], (SELECT org_id FROM temp_org)),
('VEN-015', 'PT Adhi Karya Energi', 'preferred', true, false, 79, 31, 85, ARRAY['CAT-INFRA-CIVIL'], (SELECT org_id FROM temp_org)),
('VEN-016', 'Sungrow Power Supply', 'preferred', false, false, 82, 27, 88, ARRAY['CAT-SOLAR-INVERTER'], (SELECT org_id FROM temp_org)),
('VEN-017', 'Canadian Solar ASEAN', 'preferred', false, false, 81, 28, 87, ARRAY['CAT-SOLAR-PANEL'], (SELECT org_id FROM temp_org)),
('VEN-018', 'Envision Energy', 'preferred', false, false, 83, 25, 89, ARRAY['CAT-WIND-TURBINE'], (SELECT org_id FROM temp_org)),
('VEN-019', 'Tesla Energy Indonesia', 'preferred', false, false, 85, 23, 91, ARRAY['CAT-BATT-LITHIUM', 'CAT-BATT-BMS'], (SELECT org_id FROM temp_org)),
('VEN-020', 'PT Wijaya Karya Beton', 'preferred', true, false, 78, 32, 84, ARRAY['CAT-INFRA-CIVIL'], (SELECT org_id FROM temp_org)),
('VEN-021', 'Fronius Indonesia', 'preferred', false, false, 80, 29, 86, ARRAY['CAT-SOLAR-INVERTER'], (SELECT org_id FROM temp_org))
ON CONFLICT (vendor_code) DO NOTHING;

-- Insert Vendors (Transactional)
INSERT INTO dim_vendor_extended (vendor_code, vendor_name, segmentation, is_local, is_subsidiary, performance_score, risk_score, compliance_score, primary_categories, organization_id) VALUES
('VEN-022', 'LONGi Green Energy', 'transactional', false, false, 75, 35, 82, ARRAY['CAT-SOLAR-PANEL'], (SELECT org_id FROM temp_org)),
('VEN-023', 'JA Solar Indonesia', 'transactional', true, false, 74, 36, 81, ARRAY['CAT-SOLAR-PANEL'], (SELECT org_id FROM temp_org)),
('VEN-024', 'Growatt New Energy', 'transactional', false, false, 73, 37, 80, ARRAY['CAT-SOLAR-INVERTER'], (SELECT org_id FROM temp_org)),
('VEN-025', 'PT Jaya Konstruksi', 'transactional', true, false, 72, 38, 79, ARRAY['CAT-INFRA-CIVIL'], (SELECT org_id FROM temp_org)),
('VEN-026', 'Schneider Electric Indonesia', 'transactional', true, true, 76, 34, 83, ARRAY['CAT-INFRA-ELECTRICAL'], (SELECT org_id FROM temp_org)),
('VEN-027', 'Delta Electronics Indonesia', 'transactional', true, false, 74, 36, 81, ARRAY['CAT-SOLAR-INVERTER'], (SELECT org_id FROM temp_org)),
('VEN-028', 'PT Teknik Elektro Mandiri', 'transactional', true, false, 71, 39, 78, ARRAY['CAT-INFRA-ELECTRICAL'], (SELECT org_id FROM temp_org)),
('VEN-029', 'Risen Energy Indonesia', 'transactional', true, false, 73, 37, 80, ARRAY['CAT-SOLAR-PANEL'], (SELECT org_id FROM temp_org)),
('VEN-030', 'Chint Power Systems', 'transactional', false, false, 72, 38, 79, ARRAY['CAT-SOLAR-INVERTER'], (SELECT org_id FROM temp_org)),
('VEN-031', 'PT Surya Teknik Indonesia', 'transactional', true, false, 70, 40, 77, ARRAY['CAT-SOLAR-MOUNT'], (SELECT org_id FROM temp_org)),
('VEN-032', 'GoodWe Indonesia', 'transactional', true, false, 71, 39, 78, ARRAY['CAT-SOLAR-INVERTER'], (SELECT org_id FROM temp_org)),
('VEN-033', 'PT Energi Cahaya Nusantara', 'transactional', true, false, 69, 41, 76, ARRAY['CAT-SOLAR-CABLE'], (SELECT org_id FROM temp_org)),
('VEN-034', 'Deye Solar Indonesia', 'transactional', false, false, 70, 40, 77, ARRAY['CAT-SOLAR-INVERTER'], (SELECT org_id FROM temp_org)),
('VEN-035', 'PT Multi Engineering', 'transactional', true, false, 68, 42, 75, ARRAY['CAT-INFRA-MAINT'], (SELECT org_id FROM temp_org)),
('VEN-036', 'Solis Inverter Indonesia', 'transactional', true, false, 71, 39, 78, ARRAY['CAT-SOLAR-INVERTER'], (SELECT org_id FROM temp_org))
ON CONFLICT (vendor_code) DO NOTHING;

-- Insert Vendors (Tail)
INSERT INTO dim_vendor_extended (vendor_code, vendor_name, segmentation, is_local, is_subsidiary, performance_score, risk_score, compliance_score, primary_categories, organization_id) VALUES
('VEN-037', 'PT Karya Mandiri Elektrik', 'tail', true, false, 65, 45, 72, ARRAY['CAT-INFRA-ELECTRICAL'], (SELECT org_id FROM temp_org)),
('VEN-038', 'Toko Surya Jaya', 'tail', true, false, 62, 48, 70, ARRAY['CAT-SOLAR-CABLE'], (SELECT org_id FROM temp_org)),
('VEN-039', 'CV Matahari Energi', 'tail', true, false, 63, 47, 71, ARRAY['CAT-SOLAR-MOUNT'], (SELECT org_id FROM temp_org)),
('VEN-040', 'PT Listrik Bersama', 'tail', true, false, 61, 49, 69, ARRAY['CAT-INFRA-ELECTRICAL'], (SELECT org_id FROM temp_org)),
('VEN-041', 'UD Angin Barokah', 'tail', true, false, 60, 50, 68, ARRAY['CAT-INFRA-MAINT'], (SELECT org_id FROM temp_org)),
('VEN-042', 'CV Teknik Sejahtera', 'tail', true, false, 64, 46, 72, ARRAY['CAT-INFRA-ELECTRICAL'], (SELECT org_id FROM temp_org)),
('VEN-043', 'PT Konsultan Energi Prima', 'tail', true, false, 66, 44, 73, ARRAY['CAT-INFRA-CONSULT'], (SELECT org_id FROM temp_org)),
('VEN-044', 'Toko Listrik Cahaya', 'tail', true, false, 59, 51, 67, ARRAY['CAT-INFRA-ELECTRICAL'], (SELECT org_id FROM temp_org)),
('VEN-045', 'CV Sumber Tegangan', 'tail', true, false, 61, 49, 69, ARRAY['CAT-SOLAR-CABLE'], (SELECT org_id FROM temp_org)),
('VEN-046', 'UD Makmur Elektro', 'tail', true, false, 58, 52, 66, ARRAY['CAT-INFRA-ELECTRICAL'], (SELECT org_id FROM temp_org)),
('VEN-047', 'PT Service Center Energi', 'tail', true, false, 62, 48, 70, ARRAY['CAT-INFRA-MAINT'], (SELECT org_id FROM temp_org)),
('VEN-048', 'CV Baut dan Mur Nusantara', 'tail', true, false, 57, 53, 65, ARRAY['CAT-SOLAR-MOUNT'], (SELECT org_id FROM temp_org)),
('VEN-049', 'Toko Kabel Sejahtera', 'tail', true, false, 60, 50, 68, ARRAY['CAT-SOLAR-CABLE'], (SELECT org_id FROM temp_org)),
('VEN-050', 'PT Bengkel Teknik Lokal', 'tail', true, false, 59, 51, 67, ARRAY['CAT-INFRA-MAINT'], (SELECT org_id FROM temp_org)),
('VEN-051', 'CV Energi Konsultindo', 'tail', true, false, 63, 47, 71, ARRAY['CAT-INFRA-CONSULT'], (SELECT org_id FROM temp_org))
ON CONFLICT (vendor_code) DO NOTHING;