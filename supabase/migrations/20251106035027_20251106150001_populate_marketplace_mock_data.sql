/*
  # Populate Marketplace Mock Data for PLN Indonesia Power
  
  ## Mock Data Includes:
  1. PLN-approved suppliers (10 vendors)
  2. PLN facilities across Indonesia (12 power plants)
  3. Equipment and materials catalog (60+ items across 7 categories)
  4. Sample orders and tracking data
  
  ## Categories Covered:
  - Mechanical Equipment
  - Electrical Equipment
  - Instrumentation & Control Systems
  - Construction Materials
  - Spare Parts & Maintenance Materials
  - Safety & Environmental Equipment
  - Services
*/

-- ============================================================================
-- SUPPLIERS: PLN-Approved Vendors
-- ============================================================================

INSERT INTO marketplace_suppliers (supplier_id, supplier_code, supplier_name, contact_person, contact_email, contact_phone, address, city, province, certifications, performance_rating, is_pln_approved) VALUES
  ('SUP-001', 'GE-IND', 'GE Power Indonesia', 'Budi Santoso', 'budi.santoso@ge.com', '+62-21-5795-1234', 'Jl. Jenderal Sudirman Kav. 52-53', 'Jakarta', 'DKI Jakarta', '["ISO 9001:2015", "ISO 14001:2015", "OHSAS 18001"]'::jsonb, 4.8, true),
  ('SUP-002', 'SIEMENS-ID', 'Siemens Energy Indonesia', 'Dewi Kusuma', 'dewi.kusuma@siemens.com', '+62-21-5290-8000', 'Jl. Jend. Gatot Subroto Kav. 18', 'Jakarta', 'DKI Jakarta', '["ISO 9001:2015", "ISO 45001:2018", "SNI"]'::jsonb, 4.9, true),
  ('SUP-003', 'MITS-POWER', 'Mitsubishi Power Indonesia', 'Hiroshi Tanaka', 'h.tanaka@mhps.com', '+62-21-2553-9000', 'Wisma Mulia 42nd Floor', 'Jakarta', 'DKI Jakarta', '["ISO 9001:2015", "ISO 14001:2015"]'::jsonb, 4.7, true),
  ('SUP-004', 'ABB-IND', 'ABB Indonesia', 'Sarah Johnson', 'sarah.johnson@abb.com', '+62-21-2556-5555', 'Jl. Prof. Dr. Satrio Kav. 3-5', 'Jakarta', 'DKI Jakarta', '["ISO 9001:2015", "ISO 27001:2013"]'::jsonb, 4.6, true),
  ('SUP-005', 'SCHNEIDER', 'Schneider Electric Indonesia', 'Ahmad Rizki', 'ahmad.rizki@se.com', '+62-21-2553-5000', 'Menara Astra 35th Floor', 'Jakarta', 'DKI Jakarta', '["ISO 9001:2015", "ISO 50001:2018"]'::jsonb, 4.5, true),
  ('SUP-006', 'LOCAL-STEEL', 'PT Krakatau Steel', 'Bambang Prasetyo', 'b.prasetyo@krakatausteel.com', '+62-254-391-777', 'Jl. Industri No. 5', 'Cilegon', 'Banten', '["SNI 07-0065-2002", "ISO 9001:2015"]'::jsonb, 4.4, true),
  ('SUP-007', 'INDO-PUMP', 'PT Indopump Engineering', 'Siti Nurhaliza', 'siti.n@indopump.co.id', '+62-31-8483-900', 'Jl. Raya Rungkut Industri III', 'Surabaya', 'Jawa Timur', '["ISO 9001:2015"]'::jsonb, 4.3, true),
  ('SUP-008', 'SAFETY-PRO', 'PT Safety Equipment Indonesia', 'Michael Chen', 'm.chen@safetyequip.id', '+62-21-4584-5000', 'Kawasan Industri Jababeka', 'Bekasi', 'Jawa Barat', '["ISO 9001:2015", "CE Certification"]'::jsonb, 4.2, true),
  ('SUP-009', 'ENVIRO-TECH', 'PT Environmental Technology', 'Linda Wijaya', 'linda.w@envirotech.id', '+62-22-2009-3000', 'Jl. Soekarno Hatta No. 456', 'Bandung', 'Jawa Barat', '["ISO 14001:2015", "ISO 17025"]'::jsonb, 4.1, true),
  ('SUP-010', 'SERVICE-MAINT', 'PT Maintenance Services Pro', 'Agus Setiawan', 'agus.s@maintpro.id', '+62-21-5940-5000', 'Jl. Cikini Raya No. 88', 'Jakarta', 'DKI Jakarta', '["ISO 9001:2015", "ISO 55001"]'::jsonb, 4.0, true)
ON CONFLICT (supplier_id) DO NOTHING;

-- ============================================================================
-- PLN FACILITIES: Power Plant Locations
-- ============================================================================

INSERT INTO marketplace_pln_facilities (facility_id, facility_code, facility_name, facility_type, address, city, province, postal_code, latitude, longitude, contact_person, contact_phone, contact_email) VALUES
  ('FAC-001', 'PLTU-SRY', 'PLTU Suralaya', 'Coal-Fired Power Plant', 'Jl. Raya Suralaya, Pulomerak', 'Cilegon', 'Banten', '42455', -6.0344, 106.0272, 'Ir. Hendra Gunawan', '+62-254-601-111', 'suralaya@plnip.co.id'),
  ('FAC-002', 'PLTGU-MDR', 'PLTGU Muara Karang', 'Gas Turbine', 'Jl. Pluit Karang Ayu', 'Jakarta Utara', 'DKI Jakarta', '14450', -6.1167, 106.7833, 'Ir. Siti Aminah', '+62-21-6601-234', 'muarakarang@plnip.co.id'),
  ('FAC-003', 'PLTGU-TB', 'PLTGU Tanjung Priok', 'Combined Cycle', 'Jl. Raya Tanjung Priok', 'Jakarta Utara', 'DKI Jakarta', '14310', -6.1067, 106.8833, 'Ir. Deddy Firmansyah', '+62-21-4372-345', 'tanjungpriok@plnip.co.id'),
  ('FAC-004', 'PLTU-PBR', 'PLTU Paiton', 'Coal-Fired Power Plant', 'Desa Karanganyar', 'Probolinggo', 'Jawa Timur', '67291', -7.7167, 113.4667, 'Ir. Bambang Subagyo', '+62-335-771-345', 'paiton@plnip.co.id'),
  ('FAC-005', 'PLTGU-CBN', 'PLTGU Cikarang', 'Gas Turbine', 'Kawasan Industri Jababeka', 'Bekasi', 'Jawa Barat', '17550', -6.2894, 107.1553, 'Ir. Andi Susanto', '+62-21-8935-456', 'cikarang@plnip.co.id'),
  ('FAC-006', 'PLTU-RP', 'PLTU Rembang', 'Coal-Fired Power Plant', 'Desa Pasar Banggi', 'Rembang', 'Jawa Tengah', '59265', -6.7083, 111.3500, 'Ir. Wahyu Hidayat', '+62-295-691-567', 'rembang@plnip.co.id'),
  ('FAC-007', 'PLTGU-GRT', 'PLTGU Grati', 'Combined Cycle', 'Desa Grati, Kebomas', 'Gresik', 'Jawa Timur', '61124', -7.1667, 112.6500, 'Ir. Supri yanto', '+62-31-3981-678', 'grati@plnip.co.id'),
  ('FAC-008', 'PLTU-IND', 'PLTU Indramayu', 'Coal-Fired Power Plant', 'Desa Sumuradem', 'Indramayu', 'Jawa Barat', '45264', -6.3167, 108.3333, 'Ir. Rahmat Hidayat', '+62-234-271-789', 'indramayu@plnip.co.id'),
  ('FAC-009', 'PLTGU-SRY', 'PLTGU Semarang', 'Gas Turbine', 'Jl. Yos Sudarso', 'Semarang', 'Jawa Tengah', '50174', -6.9500, 110.4167, 'Ir. Eko Prasetyo', '+62-24-3520-890', 'semarang@plnip.co.id'),
  ('FAC-010', 'PLTU-CLP', 'PLTU Cilacap', 'Coal-Fired Power Plant', 'Desa Karangkandri', 'Cilacap', 'Jawa Tengah', '53211', -7.7333, 109.0167, 'Ir. Budi Santoso', '+62-282-541-901', 'cilacap@plnip.co.id'),
  ('FAC-011', 'PLTG-BLI', 'PLTG Bali', 'Gas Turbine', 'Jl. Bypass Ngurah Rai', 'Denpasar', 'Bali', '80361', -8.7500, 115.1667, 'Ir. Made Suardana', '+62-361-751-012', 'bali@plnip.co.id'),
  ('FAC-012', 'PLTGU-BTM', 'PLTGU Batam', 'Combined Cycle', 'Kawasan Industri Batamindo', 'Batam', 'Kepulauan Riau', '29433', 1.0833, 104.0333, 'Ir. Hendra Lim', '+62-778-461-123', 'batam@plnip.co.id')
ON CONFLICT (facility_id) DO NOTHING;

-- ============================================================================
-- ITEMS: Mechanical Equipment
-- ============================================================================

INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITM-MECH-001', 'GT-9300-10MW', 'Gas Turbine Generator 10MW', 'High-efficiency gas turbine generator for combined cycle power plants', 'CAT-MECH', 'SUP-001', 125000000000, 2, 180, 'Unit', '{"capacity": "10 MW", "efficiency": "38%", "fuel": "Natural Gas", "weight": "45 tons"}'::jsonb, '["ISO 9001", "CE Mark", "IEC 61000"]'::jsonb, '24 months parts and labor'),
  ('ITM-MECH-002', 'ST-8500-50MW', 'Steam Turbine 50MW', 'Multi-stage steam turbine for coal-fired power plants', 'CAT-MECH', 'SUP-002', 285000000000, 1, 240, 'Unit', '{"capacity": "50 MW", "steam_pressure": "125 bar", "temperature": "540°C", "weight": "180 tons"}'::jsonb, '["ISO 9001", "ASME Certification"]'::jsonb, '36 months parts and labor'),
  ('ITM-MECH-003', 'CP-5000-HP', 'Centrifugal Pump 5000HP', 'Heavy-duty boiler feed pump for high-pressure applications', 'CAT-MECH', 'SUP-007', 8500000000, 5, 90, 'Unit', '{"power": "5000 HP", "flow_rate": "1200 m3/h", "head": "850 m", "material": "Stainless Steel 316"}'::jsonb, '["ISO 9001", "API 610"]'::jsonb, '18 months'),
  ('ITM-MECH-004', 'COMP-RC-2500', 'Reciprocating Compressor', 'Industrial air compressor for plant operations', 'CAT-MECH', 'SUP-003', 4200000000, 3, 120, 'Unit', '{"capacity": "2500 CFM", "pressure": "10 bar", "power": "500 HP", "cooling": "Water-cooled"}'::jsonb, '["ISO 9001", "ASME"]'::jsonb, '12 months'),
  ('ITM-MECH-005', 'HX-SHELL-500', 'Heat Exchanger Shell & Tube', 'Large capacity heat exchanger for steam condensation', 'CAT-MECH', 'SUP-003', 6800000000, 4, 150, 'Unit', '{"area": "500 m2", "design_pressure": "25 bar", "material": "Carbon Steel with SS tubes", "weight": "25 tons"}'::jsonb, '["ASME VIII Div 1", "PED 2014/68/EU"]'::jsonb, '24 months'),
  ('ITM-MECH-006', 'CT-FAN-300HP', 'Cooling Tower Fan Assembly', 'Large diameter cooling tower fan with motor', 'CAT-MECH', 'SUP-004', 1850000000, 8, 60, 'Unit', '{"power": "300 HP", "diameter": "8 m", "airflow": "450000 m3/h", "material": "FRP Blades"}'::jsonb, '["ISO 9001"]'::jsonb, '12 months'),
  ('ITM-MECH-007', 'GB-PLAN-5000', 'Planetary Gearbox 5000HP', 'Heavy-duty gearbox for turbine applications', 'CAT-MECH', 'SUP-002', 3200000000, 3, 180, 'Unit', '{"power": "5000 HP", "ratio": "15.5:1", "torque": "850000 Nm", "weight": "12 tons"}'::jsonb, '["ISO 9001", "AGMA"]'::jsonb, '24 months'),
  ('ITM-MECH-008', 'BFP-MULTI-8ST', 'Boiler Feed Pump 8-Stage', 'Multi-stage centrifugal pump for boiler feed water', 'CAT-MECH', 'SUP-007', 9500000000, 2, 120, 'Unit', '{"stages": 8, "flow": "800 m3/h", "head": "1200 m", "temperature": "165°C", "power": "3500 HP"}'::jsonb, '["API 610", "ISO 9001"]'::jsonb, '18 months'),
  ('ITM-MECH-009', 'VALVE-CTRL-DN500', 'Control Valve DN500', 'High-temperature control valve for steam applications', 'CAT-MECH', 'SUP-004', 285000000, 15, 45, 'Unit', '{"size": "DN500", "pressure_class": "PN100", "temperature": "540°C", "material": "A351 CF8M"}'::jsonb, '["ISO 9001", "API 600"]'::jsonb, '12 months'),
  ('ITM-MECH-010', 'BEARING-TILT-PAD', 'Tilting Pad Bearing Assembly', 'Precision tilting pad bearing for turbine main shaft', 'CAT-MECH', 'SUP-002', 1450000000, 6, 90, 'Unit', '{"bore": "600 mm", "load_capacity": "150 tons", "speed": "3600 RPM", "material": "Babbitt lined"}'::jsonb, '["ISO 9001"]'::jsonb, '12 months')
ON CONFLICT (item_id) DO NOTHING;

-- ============================================================================
-- ITEMS: Electrical Equipment  
-- ============================================================================

INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITM-ELEC-001', 'XFMR-150MVA-20/150', 'Power Transformer 150MVA', 'Three-phase oil-immersed power transformer', 'CAT-ELEC', 'SUP-002', 45000000000, 1, 210, 'Unit', '{"capacity": "150 MVA", "voltage_primary": "150 kV", "voltage_secondary": "20 kV", "cooling": "ONAN/ONAF", "weight": "125 tons"}'::jsonb, '["IEC 60076", "ISO 9001"]'::jsonb, '36 months'),
  ('ITM-ELEC-002', 'GEN-SYNC-75MVA', 'Synchronous Generator 75MVA', 'Large synchronous generator for turbine coupling', 'CAT-ELEC', 'SUP-001', 68000000000, 1, 240, 'Unit', '{"capacity": "75 MVA", "voltage": "13.8 kV", "speed": "3000 RPM", "power_factor": "0.85", "weight": "95 tons"}'::jsonb, '["IEC 60034", "ISO 9001"]'::jsonb, '24 months'),
  ('ITM-ELEC-003', 'SG-GIS-150KV', 'Gas Insulated Switchgear 150kV', 'Compact GIS for high-voltage applications', 'CAT-ELEC', 'SUP-004', 85000000000, 1, 180, 'Bay', '{"voltage": "150 kV", "current": "3150 A", "frequency": "50 Hz", "insulation": "SF6 Gas", "bays": "3"}'::jsonb, '["IEC 62271-203", "ISO 9001"]'::jsonb, '24 months'),
  ('ITM-ELEC-004', 'CB-VCB-20KV-2000A', 'Vacuum Circuit Breaker 20kV', 'Medium voltage vacuum circuit breaker', 'CAT-ELEC', 'SUP-005', 1850000000, 8, 90, 'Unit', '{"voltage": "20 kV", "current": "2000 A", "breaking_capacity": "31.5 kA", "mechanism": "Spring operated"}'::jsonb, '["IEC 62271-100", "ISO 9001"]'::jsonb, '18 months'),
  ('ITM-ELEC-005', 'RELAY-DIFF-XFMR', 'Transformer Differential Relay', 'Digital differential protection relay for transformers', 'CAT-ELEC', 'SUP-004', 425000000, 12, 60, 'Unit', '{"type": "Numerical", "ct_ratio_range": "1-10000", "communication": "IEC 61850", "inputs": "12 CT + 8 VT"}'::jsonb, '["IEC 60255", "ISO 9001"]'::jsonb, '24 months'),
  ('ITM-ELEC-006', 'MCC-LV-2500A', 'Motor Control Center 2500A', 'Low voltage motor control center with VFDs', 'CAT-ELEC', 'SUP-005', 3200000000, 4, 120, 'Panel', '{"voltage": "690 V", "main_busbar": "2500 A", "compartments": "12", "ip_rating": "IP54"}'::jsonb, '["IEC 61439", "ISO 9001"]'::jsonb, '18 months'),
  ('ITM-ELEC-007', 'CAP-BANK-25MVAR', 'Capacitor Bank 25MVAR', 'Power factor correction capacitor bank', 'CAT-ELEC', 'SUP-004', 1250000000, 6, 75, 'Panel', '{"capacity": "25 MVAR", "voltage": "20 kV", "steps": "5 x 5 MVAR", "switching": "Automatic", "detuned": "7%"}'::jsonb, '["IEC 60871", "ISO 9001"]'::jsonb, '12 months'),
  ('ITM-ELEC-008', 'BUSBAR-AL-5000A', 'Aluminum Busbar System 5000A', 'Main busbar system for switchgear', 'CAT-ELEC', 'SUP-006', 850000000, 10, 60, 'Set', '{"current": "5000 A", "voltage": "20 kV", "material": "Aluminum 6101-T6", "length": "12 m", "support": "Epoxy insulators"}'::jsonb, '["IEC 61238", "ISO 9001"]'::jsonb, '12 months'),
  ('ITM-ELEC-009', 'UPS-500KVA-ONLINE', 'UPS System 500kVA Online', 'Double-conversion online UPS for critical loads', 'CAT-ELEC', 'SUP-005', 2800000000, 3, 90, 'Unit', '{"capacity": "500 kVA", "topology": "Double Conversion", "input_voltage": "400 V", "output_voltage": "400 V", "backup_time": "15 min"}'::jsonb, '["IEC 62040", "ISO 9001"]'::jsonb, '24 months'),
  ('ITM-ELEC-010', 'CABLE-XLPE-300MM', 'XLPE Power Cable 300mm²', 'Medium voltage XLPE insulated power cable', 'CAT-ELEC', 'SUP-006', 1250000, 50000, 45, 'Meter', '{"conductor": "Copper 300mm²", "insulation": "XLPE", "voltage": "20 kV", "armoring": "SWA", "standard": "IEC 60502"}'::jsonb, '["SNI 04-6629.6", "ISO 9001"]'::jsonb, '12 months')
ON CONFLICT (item_id) DO NOTHING;

-- ============================================================================
-- ITEMS: Instrumentation & Control
-- ============================================================================

INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITM-INST-001', 'DCS-SYSTEM-500IO', 'Distributed Control System', 'Complete DCS system with 500 I/O points for power plant', 'CAT-INST', 'SUP-004', 18500000000, 1, 180, 'System', '{"io_points": 500, "controllers": 5, "operator_stations": 3, "communication": "Ethernet/IP", "redundancy": "Full"}'::jsonb, '["IEC 61131", "ISO 9001", "SIL 2"]'::jsonb, '36 months'),
  ('ITM-INST-002', 'PLC-S7-1500', 'PLC Siemens S7-1500', 'Advanced PLC for automation control', 'CAT-INST', 'SUP-002', 285000000, 15, 60, 'Unit', '{"cpu": "S7-1516F-3 PN/DP", "memory": "1 MB", "io_capacity": "8192", "communication": "Profinet, Profibus"}'::jsonb, '["CE Mark", "ISO 9001"]'::jsonb, '24 months'),
  ('ITM-INST-003', 'SCADA-ENTERPRISE', 'SCADA System Enterprise License', 'Full-featured SCADA software with unlimited tags', 'CAT-INST', 'SUP-004', 6500000000, 5, 90, 'License', '{"tags": "Unlimited", "clients": 50, "redundancy": "Hot Standby", "historian": "Included", "mobile_access": "Yes"}'::jsonb, '["ISO 9001"]'::jsonb, '12 months support'),
  ('ITM-INST-004', 'TEMP-RTD-PT100', 'RTD Temperature Sensor PT100', 'High-accuracy platinum RTD sensor', 'CAT-INST', 'SUP-005', 2850000, 200, 30, 'Unit', '{"type": "PT100", "range": "-50 to 400°C", "accuracy": "Class A", "connection": "4-wire", "protection": "IP68"}'::jsonb, '["IEC 60751", "ISO 9001"]'::jsonb, '12 months'),
  ('ITM-INST-005', 'PRESS-TX-SMART', 'Smart Pressure Transmitter', 'Digital pressure transmitter with HART protocol', 'CAT-INST', 'SUP-005', 8500000, 150, 45, 'Unit', '{"range": "0-100 bar", "output": "4-20 mA + HART", "accuracy": "0.075%", "material": "316 SS", "display": "LCD"}'::jsonb, '["IEC 61508", "ISO 9001"]'::jsonb, '18 months'),
  ('ITM-INST-006', 'FLOW-VORTEX-DN150', 'Vortex Flow Meter DN150', 'Steam flow measurement with temperature compensation', 'CAT-INST', 'SUP-005', 28500000, 30, 60, 'Unit', '{"size": "DN150", "fluid": "Steam/Gas", "range": "0-50000 kg/h", "accuracy": "1%", "output": "4-20mA + Pulse"}'::jsonb, '["ISO 5167", "ISO 9001"]'::jsonb, '18 months'),
  ('ITM-INST-007', 'LEVEL-RADAR-GUIDED', 'Guided Wave Radar Level Sensor', 'Level measurement for tanks and vessels', 'CAT-INST', 'SUP-005', 18500000, 50, 45, 'Unit', '{"type": "Guided Wave Radar", "range": "0-20 m", "accuracy": "±2 mm", "process_temp": "-40 to 200°C", "output": "4-20mA + HART"}'::jsonb, '["IEC 61508", "ATEX"]'::jsonb, '18 months'),
  ('ITM-INST-008', 'VALVE-POSITIONER-SMART', 'Smart Valve Positioner', 'Digital valve positioner with diagnostics', 'CAT-INST', 'SUP-005', 12500000, 80, 30, 'Unit', '{"input": "4-20 mA", "communication": "HART/Foundation Fieldbus", "air_supply": "1.4-7 bar", "diagnostics": "Advanced"}'::jsonb, '["IEC 61508", "ISO 9001"]'::jsonb, '24 months'),
  ('ITM-INST-009', 'ANALYZER-GAS-MULTI', 'Multi-Gas Analyzer', 'Continuous gas analyzer for emissions monitoring', 'CAT-INST', 'SUP-009', 185000000, 8, 120, 'Unit', '{"parameters": "CO, CO2, NOx, SO2, O2", "method": "NDIR + Electrochemical", "range": "Varies", "certification": "QAL1"}'::jsonb, '["EN 15267", "ISO 9001"]'::jsonb, '24 months'),
  ('ITM-INST-010', 'HMI-PANEL-15INCH', 'Industrial HMI Panel 15 inch', 'Touchscreen HMI for local control', 'CAT-INST', 'SUP-004', 18500000, 40, 45, 'Unit', '{"display": "15 inch TFT", "resolution": "1024x768", "touch": "Capacitive", "cpu": "ARM Cortex", "communication": "Ethernet, Profinet"}'::jsonb, '["CE Mark", "UL Listed"]'::jsonb, '24 months')
ON CONFLICT (item_id) DO NOTHING;

-- Continue with more items in next block...