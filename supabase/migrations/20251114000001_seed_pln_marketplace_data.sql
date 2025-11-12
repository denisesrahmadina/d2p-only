/*
  # Seed PLN Indonesia Power Marketplace Data

  ## Overview
  Populate the marketplace with realistic data for PLN Indonesia Power including:
  - PLN-approved suppliers with certifications
  - Equipment catalog across 7 categories
  - PLN facility locations across Indonesia
  - Technical specifications and compliance information

  ## Data Included
  - 10+ suppliers with performance ratings
  - 50+ items across all equipment categories
  - 15+ PLN facilities (power plants)
  - Technical specifications for each item
  - Compliance certifications
*/

-- ============================================================================
-- SUPPLIERS: PLN-Approved Vendors
-- ============================================================================

INSERT INTO marketplace_suppliers (supplier_id, supplier_code, supplier_name, contact_person, contact_email, contact_phone, address, city, province, postal_code, certifications, performance_rating, is_pln_approved) VALUES
  ('SUP-001', 'TRF-IND', 'Trafo Nusantara Indonesia', 'Ir. Budi Santoso', 'procurement@trafonusantara.co.id', '+62 21 8934 5000', 'Jl. Industri Raya No. 15, Kawasan Industri Jababeka', 'Cikarang', 'Jawa Barat', '17550', '["ISO 9001:2015", "ISO 14001:2015", "OHSAS 18001", "SNI"]'::jsonb, 4.7, true),
  ('SUP-002', 'GE-PWR', 'GE Power Indonesia', 'Agus Wijaya, M.Eng', 'sales.indonesia@ge.com', '+62 21 5091 8000', 'Menara Astra, Jl. Jend. Sudirman Kav 5-6', 'Jakarta', 'DKI Jakarta', '10220', '["ISO 9001:2015", "ISO 45001:2018", "API 616"]'::jsonb, 4.9, true),
  ('SUP-003', 'SIE-ID', 'Siemens Energy Indonesia', 'Dr. Siti Rahayu', 'energy.indonesia@siemens.com', '+62 21 5091 5000', 'World Trade Center 6, Jl. Jend. Sudirman Kav. 29-31', 'Jakarta', 'DKI Jakarta', '12920', '["ISO 9001:2015", "ISO 14001:2015", "IEC 62271"]'::jsonb, 4.8, true),
  ('SUP-004', 'ABB-ID', 'ABB Indonesia', 'Michael Anderson', 'info@id.abb.com', '+62 21 2902 2300', 'Lippo Kuningan, Jl. HR Rasuna Said Kav B-12', 'Jakarta', 'DKI Jakarta', '12940', '["ISO 9001:2015", "ISO 50001", "IEC 60076"]'::jsonb, 4.6, true),
  ('SUP-005', 'SCH-ID', 'Schneider Electric Indonesia', 'Lisa Wijaya', 'customer.id@schneider-electric.com', '+62 21 2553 6888', 'Kota Kasablanka, Jl. Casablanca Raya Kav. 88', 'Jakarta', 'DKI Jakarta', '12870', '["ISO 9001:2015", "ISO 14001:2015", "IEC 61850"]'::jsonb, 4.5, true),
  ('SUP-006', 'KRA-IND', 'Krakatau Engineering', 'Ir. Rudi Hartono', 'marketing@krakatausteel.com', '+62 254 392 1122', 'Jl. Industri No. 5, Cilegon', 'Cilegon', 'Banten', '42435', '["ISO 9001:2015", "ASME", "SNI"]'::jsonb, 4.4, true),
  ('SUP-007', 'WIK-IND', 'Wika Industri', 'Eko Prasetyo', 'corporate@wika.co.id', '+62 21 8370 5000', 'Jl. D.I. Panjaitan Kav. 9-10', 'Jakarta', 'DKI Jakarta', '13340', '["ISO 9001:2015", "ISO 14001:2015", "SNI"]'::jsonb, 4.3, true),
  ('SUP-008', 'HIT-ID', 'Hitachi Energy Indonesia', 'Tanaka Hiroshi', 'info@hitachienergy.com', '+62 21 2553 7000', 'Sahid Sudirman Center, Jl. Jend. Sudirman No. 86', 'Jakarta', 'DKI Jakarta', '10220', '["ISO 9001:2015", "IEC 60076", "IEEE C57"]'::jsonb, 4.7, true),
  ('SUP-009', 'MIT-IND', 'Mitsubishi Power Indonesia', 'Kenji Yamamoto', 'mhps.indonesia@mhps.com', '+62 21 5795 7800', 'Equity Tower, Jl. Jend. Sudirman Kav. 52-53', 'Jakarta', 'DKI Jakarta', '12190', '["ISO 9001:2015", "ISO 45001:2018", "API 616"]'::jsonb, 4.8, true),
  ('SUP-010', 'PAM-IND', 'Pindad Manufacturing', 'Kolonel Bambang S.', 'marketing@pindad.com', '+62 22 7303 171', 'Jl. Gatot Subroto No. 517', 'Bandung', 'Jawa Barat', '40284', '["ISO 9001:2015", "ISO 14001:2015", "SNI"]'::jsonb, 4.2, true)
ON CONFLICT (supplier_id) DO NOTHING;

-- ============================================================================
-- PLN FACILITIES: Power Plant Locations
-- ============================================================================

INSERT INTO marketplace_pln_facilities (facility_id, facility_code, facility_name, facility_type, address, city, province, postal_code, latitude, longitude, contact_person, contact_phone, contact_email) VALUES
  ('FAC-001', 'PLTU-SGR', 'PLTU Suralaya', 'Coal Power Plant', 'Jl. Raya Suralaya, Pulomerak', 'Cilegon', 'Banten', '42438', -6.0357, 106.0234, 'Ir. Dwi Atmoko', '+62 254 391 234', 'suralaya@indonesiapower.co.id'),
  ('FAC-002', 'PLTGU-MRK', 'PLTGU Muara Karang', 'Gas Power Plant', 'Jl. Pluit Karang Ayu', 'Jakarta Utara', 'DKI Jakarta', '14450', -6.1167, 106.7833, 'Ir. Hendra Kusuma', '+62 21 6695 123', 'muarakarang@indonesiapower.co.id'),
  ('FAC-003', 'PLTU-PRG', 'PLTU Paiton', 'Coal Power Plant', 'Desa Bhinor, Kecamatan Paiton', 'Probolinggo', 'Jawa Timur', '67291', -7.7333, 113.3833, 'Ir. Agung Wibowo', '+62 335 771 234', 'paiton@indonesiapower.co.id'),
  ('FAC-004', 'PLTGU-SRG', 'PLTGU Semarang', 'Gas Power Plant', 'Jl. Randugarut, Tugu', 'Semarang', 'Jawa Tengah', '50185', -6.9500, 110.4167, 'Ir. Siti Nurjanah', '+62 24 8666 123', 'semarang@indonesiapower.co.id'),
  ('FAC-005', 'PLTU-PKL', 'PLTU Pacitan', 'Coal Power Plant', 'Desa Ploso, Kecamatan Pacitan', 'Pacitan', 'Jawa Timur', '63515', -8.2000, 111.0500, 'Ir. Bambang Irianto', '+62 357 881 234', 'pacitan@indonesiapower.co.id'),
  ('FAC-006', 'PLTG-PLB', 'PLTG Palembang', 'Gas Turbine Plant', 'Jl. Kolone H. Burlian KM 7', 'Palembang', 'Sumatera Selatan', '30961', -2.9761, 104.7754, 'Ir. Edi Gunawan', '+62 711 411 234', 'palembang@indonesiapower.co.id'),
  ('FAC-007', 'PLTU-LAB', 'PLTU Labuan', 'Coal Power Plant', 'Desa Teluk Lada', 'Pandeglang', 'Banten', '42264', -6.4000, 105.7833, 'Ir. Yusuf Rahman', '+62 253 801 234', 'labuan@indonesiapower.co.id'),
  ('FAC-008', 'PLTGU-BLI', 'PLTGU Bali', 'Gas Power Plant', 'Jl. Pantai Gilimanuk', 'Jembrana', 'Bali', '82218', -8.1617, 114.4425, 'Ir. Made Sudana', '+62 365 611 234', 'bali@indonesiapower.co.id'),
  ('FAC-009', 'PLTU-JEP', 'PLTU Jepara', 'Coal Power Plant', 'Desa Tubanan, Kecamatan Kembang', 'Jepara', 'Jawa Tengah', '59454', -6.7500, 110.6667, 'Ir. Rina Wijayanti', '+62 291 591 234', 'jepara@indonesiapower.co.id'),
  ('FAC-010', 'PLTG-BDG', 'PLTG Bandung', 'Gas Turbine Plant', 'Jl. Soekarno Hatta No. 762', 'Bandung', 'Jawa Barat', '40294', -6.9389, 107.7014, 'Ir. Dedi Supriadi', '+62 22 7565 123', 'bandung@indonesiapower.co.id'),
  ('FAC-011', 'PLTU-KLT', 'PLTU Kaltim', 'Coal Power Plant', 'Desa Kariangau', 'Balikpapan', 'Kalimantan Timur', '76114', -1.1833, 116.8333, 'Ir. Ahmad Fauzi', '+62 542 761 234', 'kaltim@indonesiapower.co.id'),
  ('FAC-012', 'PLTGU-BKS', 'PLTGU Bekasi', 'Gas Power Plant', 'Jl. Raya Narogong KM 18', 'Bekasi', 'Jawa Barat', '17520', -6.2841, 107.0298, 'Ir. Rini Setiawati', '+62 21 8231 123', 'bekasi@indonesiapower.co.id'),
  ('FAC-013', 'PLTU-MKS', 'PLTU Makassar', 'Coal Power Plant', 'Jl. Perintis Kemerdekaan KM 17', 'Makassar', 'Sulawesi Selatan', '90245', -5.1167, 119.4667, 'Ir. Abdul Rahman', '+62 411 511 234', 'makassar@indonesiapower.co.id'),
  ('FAC-014', 'PLTG-MED', 'PLTG Medan', 'Gas Turbine Plant', 'Jl. Belawan Sicanang', 'Medan', 'Sumatera Utara', '20411', 3.7667, 98.7000, 'Ir. Taufik Hidayat', '+62 61 6941 123', 'medan@indonesiapower.co.id'),
  ('FAC-015', 'PLTU-PNG', 'PLTU Pangkalan Susu', 'Coal Power Plant', 'Desa Bagan Deli, Kecamatan Pangkalan Susu', 'Langkat', 'Sumatera Utara', '20857', 4.0500, 98.2833, 'Ir. Syahrial Lubis', '+62 621 931 234', 'pangkalansusu@indonesiapower.co.id')
ON CONFLICT (facility_id) DO NOTHING;

-- ============================================================================
-- MECHANICAL EQUIPMENT ITEMS
-- ============================================================================

INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, currency, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITEM-001', 'GTG-100MW', 'Gas Turbine Generator 100MW', 'Combined cycle gas turbine generator for power generation', 'CAT-MECH', 'SUP-002', 450000000000, 'IDR', 2, 240, 'Unit', '{"power_output": "100 MW", "fuel_type": "Natural Gas", "efficiency": "38.5%", "heat_rate": "9350 BTU/kWh", "emissions_nox": "< 25 ppm", "startup_time": "10 minutes", "weight": "120000 kg", "dimensions": "12m x 5m x 6m"}'::jsonb, '["ISO 9001:2015", "API 616", "EPA Tier 4"]'::jsonb, '5 years comprehensive warranty including parts and labor'),
  ('ITEM-002', 'STG-50MW', 'Steam Turbine Generator 50MW', 'High-efficiency steam turbine for coal power plants', 'CAT-MECH', 'SUP-009', 280000000000, 'IDR', 1, 180, 'Unit', '{"power_output": "50 MW", "steam_pressure": "12.5 MPa", "steam_temperature": "540°C", "efficiency": "42%", "weight": "85000 kg", "dimensions": "10m x 4m x 5m"}'::jsonb, '["ISO 9001:2015", "ASME", "API 612"]'::jsonb, '3 years warranty with extended service contracts available'),
  ('ITEM-003', 'CMP-5000', 'Centrifugal Compressor 5000 CFM', 'Industrial air compressor for power plant auxiliaries', 'CAT-MECH', 'SUP-006', 850000000, 'IDR', 5, 90, 'Unit', '{"capacity": "5000 CFM", "pressure": "150 PSI", "power": "750 kW", "weight": "4200 kg", "dimensions": "3.5m x 2m x 2.5m"}'::jsonb, '["ISO 9001:2015", "API 617"]'::jsonb, '2 years parts and labor warranty'),
  ('ITEM-004', 'PUMP-500', 'Boiler Feed Water Pump 500 GPM', 'High-pressure centrifugal pump for boiler water circulation', 'CAT-MECH', 'SUP-006', 420000000, 'IDR', 8, 60, 'Unit', '{"capacity": "500 GPM", "head": "1200 ft", "pressure": "3500 PSI", "power": "450 kW", "weight": "3800 kg"}'::jsonb, '["ISO 9001:2015", "API 610"]'::jsonb, '18 months warranty'),
  ('ITEM-005', 'HEX-1000', 'Heat Exchanger 1000 kW', 'Shell and tube heat exchanger for cooling systems', 'CAT-MECH', 'SUP-007', 185000000, 'IDR', 12, 45, 'Unit', '{"capacity": "1000 kW", "surface_area": "250 m²", "max_pressure": "16 bar", "max_temperature": "200°C", "weight": "2500 kg"}'::jsonb, '["ISO 9001:2015", "ASME Section VIII"]'::jsonb, '1 year warranty')
ON CONFLICT (item_id) DO NOTHING;

-- ============================================================================
-- ELECTRICAL EQUIPMENT ITEMS
-- ============================================================================

INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, currency, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITEM-006', 'TRF-150MVA', 'Power Transformer 150 MVA', 'Three-phase power transformer for high voltage transmission', 'CAT-ELEC', 'SUP-001', 12500000000, 'IDR', 3, 120, 'Unit', '{"voltage_rating": "150 kV", "power_rating": "150 MVA", "frequency": "50 Hz", "cooling_type": "ONAN/ONAF", "vector_group": "YNyn0", "weight": "85000 kg", "dimensions": "6.5m x 3.2m x 4.8m"}'::jsonb, '["IEC 60076", "IEEE C57.12.00", "ISO 9001:2015", "SPLN"]'::jsonb, '3 years warranty with 10 years expected life'),
  ('ITEM-007', 'GEN-100MVA', 'Synchronous Generator 100 MVA', 'Air-cooled synchronous generator for gas turbines', 'CAT-ELEC', 'SUP-002', 35000000000, 'IDR', 2, 180, 'Unit', '{"power_rating": "100 MVA", "voltage": "13.8 kV", "frequency": "50 Hz", "power_factor": "0.85", "cooling": "Air-cooled", "weight": "45000 kg"}'::jsonb, '["IEC 60034", "IEEE C50.13", "ISO 9001:2015"]'::jsonb, '5 years comprehensive warranty'),
  ('ITEM-008', 'CB-150KV', 'Circuit Breaker 150 kV', 'SF6 gas-insulated circuit breaker', 'CAT-ELEC', 'SUP-003', 1800000000, 'IDR', 10, 60, 'Unit', '{"voltage_rating": "150 kV", "rated_current": "2000 A", "breaking_current": "40 kA", "insulation_medium": "SF6 Gas", "weight": "3200 kg"}'::jsonb, '["IEC 62271-100", "IEEE C37.04", "ISO 9001:2015"]'::jsonb, '2 years warranty'),
  ('ITEM-009', 'SWG-20KV', 'Medium Voltage Switchgear 20 kV', 'Metal-enclosed switchgear for distribution', 'CAT-ELEC', 'SUP-005', 750000000, 'IDR', 15, 45, 'Unit', '{"voltage_rating": "20 kV", "rated_current": "1250 A", "short_circuit": "25 kA", "type": "Metal-enclosed", "weight": "2800 kg"}'::jsonb, '["IEC 62271-200", "ISO 9001:2015"]'::jsonb, '18 months warranty'),
  ('ITEM-010', 'CABLE-150KV', 'HV Power Cable 150 kV', 'XLPE insulated high voltage power cable', 'CAT-ELEC', 'SUP-004', 3500000, 'IDR', 5000, 30, 'Meter', '{"voltage_rating": "150 kV", "conductor_size": "1x800 mm²", "insulation_type": "XLPE", "max_temperature": "90°C", "weight_per_meter": "15.2 kg/m"}'::jsonb, '["IEC 60502", "IEEE 48", "SPLN T1.002"]'::jsonb, '25 years design life')
ON CONFLICT (item_id) DO NOTHING;

-- ============================================================================
-- INSTRUMENTATION & CONTROL ITEMS
-- ============================================================================

INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, currency, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITEM-011', 'PLC-500', 'Programmable Logic Controller PLC-500', 'Industrial PLC for power plant automation', 'CAT-INST', 'SUP-005', 185000000, 'IDR', 20, 60, 'Unit', '{"io_points": "512", "scan_time": "5 ms", "memory": "2 MB", "communication": "Ethernet/IP, Modbus TCP", "operating_temp": "-20°C to 60°C"}'::jsonb, '["IEC 61131", "UL 508", "CE"]'::jsonb, '3 years warranty'),
  ('ITEM-012', 'SCADA-PRO', 'SCADA System Professional', 'Supervisory control and data acquisition system', 'CAT-INST', 'SUP-005', 950000000, 'IDR', 5, 90, 'License', '{"max_tags": "50000", "redundancy": "Hot standby", "protocols": "OPC UA, Modbus, DNP3", "database": "SQL Server"}'::jsonb, '["ISO 9001:2015", "IEC 62351"]'::jsonb, '1 year software support included'),
  ('ITEM-013', 'TEMP-PT100', 'Temperature Sensor PT100', 'Precision RTD temperature sensor', 'CAT-INST', 'SUP-005', 1250000, 'IDR', 200, 14, 'Unit', '{"type": "PT100", "range": "-50°C to 500°C", "accuracy": "±0.15°C", "probe_length": "150 mm", "connection": "4-wire"}'::jsonb, '["IEC 60751", "ISO 9001:2015"]'::jsonb, '2 years warranty'),
  ('ITEM-014', 'PRESS-4-20', 'Pressure Transmitter 4-20mA', 'Smart pressure transmitter with HART protocol', 'CAT-INST', 'SUP-005', 8500000, 'IDR', 100, 30, 'Unit', '{"range": "0-250 bar", "output": "4-20 mA HART", "accuracy": "±0.075%", "material": "316 SS", "explosion_proof": "ATEX"}'::jsonb, '["IEC 61508", "ATEX", "ISO 9001:2015"]'::jsonb, '2 years warranty'),
  ('ITEM-015', 'FLOW-MAG', 'Electromagnetic Flow Meter DN200', 'Magnetic flow meter for water measurement', 'CAT-INST', 'SUP-005', 42000000, 'IDR', 50, 45, 'Unit', '{"size": "DN200", "range": "0-2000 m³/h", "accuracy": "±0.2%", "output": "4-20 mA, Pulse, HART", "protection": "IP67"}'::jsonb, '["ISO 4064", "OIML R49"]'::jsonb, '2 years warranty')
ON CONFLICT (item_id) DO NOTHING;

-- ============================================================================
-- CONSTRUCTION MATERIALS ITEMS
-- ============================================================================

INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, currency, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITEM-016', 'STEEL-H400', 'Structural Steel H-Beam 400x200', 'Heavy duty structural steel beam', 'CAT-CONS', 'SUP-006', 15000000, 'IDR', 500, 30, 'Ton', '{"grade": "SS400", "dimensions": "400x200x8x13 mm", "length": "12 m", "weight": "66 kg/m", "yield_strength": "245 MPa"}'::jsonb, '["JIS G3101", "SNI 07-0052", "ISO 9001:2015"]'::jsonb, 'Material certification included'),
  ('ITEM-017', 'PIPE-SCH80', 'Carbon Steel Pipe 12" Sch 80', 'Seamless carbon steel pipe for high pressure', 'CAT-CONS', 'SUP-006', 8500000, 'IDR', 1000, 45, 'Meter', '{"size": "12 inch", "schedule": "80", "material": "ASTM A106 Gr.B", "pressure_rating": "PN100", "weight": "84.6 kg/m"}'::jsonb, '["ASTM A106", "ASME B36.10", "SNI"]'::jsonb, 'Mill test certificate provided'),
  ('ITEM-018', 'INSUL-MW', 'Mineral Wool Insulation 100mm', 'High-temperature insulation for pipes and equipment', 'CAT-CONS', 'SUP-007', 185000, 'IDR', 5000, 21, 'M²', '{"thickness": "100 mm", "density": "128 kg/m³", "max_temp": "650°C", "thermal_conductivity": "0.042 W/mK", "width": "1200 mm"}'::jsonb, '["ASTM C612", "ISO 9001:2015"]'::jsonb, 'Performance guarantee 10 years'),
  ('ITEM-019', 'CONCRETE-K350', 'Ready Mix Concrete K-350', 'High strength concrete for structural applications', 'CAT-CONS', 'SUP-007', 1250000, 'IDR', 0, 3, 'M³', '{"strength": "K-350 (29 MPa)", "slump": "12±2 cm", "max_aggregate": "20 mm", "cement_type": "PPC", "water_cement_ratio": "0.45"}'::jsonb, '["SNI 2847", "SNI 7656", "ISO 9001:2015"]'::jsonb, 'Strength test certificate included'),
  ('ITEM-020', 'PAINT-HT', 'High Temperature Paint Silver', 'Heat-resistant paint for equipment up to 600°C', 'CAT-CONS', 'SUP-007', 385000, 'IDR', 500, 14, 'Liter', '{"max_temp": "600°C", "finish": "Silver", "coverage": "8-10 m²/L", "dry_time": "2 hours", "volume_solids": "55%"}'::jsonb, '["ISO 12944", "ASTM D3363"]'::jsonb, '2 years shelf life')
ON CONFLICT (item_id) DO NOTHING;

-- ============================================================================
-- SPARE PARTS & MAINTENANCE MATERIALS
-- ============================================================================

INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, currency, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITEM-021', 'BEAR-6320', 'Deep Groove Ball Bearing 6320', 'Heavy duty bearing for rotating equipment', 'CAT-SPARE', 'SUP-006', 2850000, 'IDR', 100, 30, 'Unit', '{"bore": "100 mm", "outer_diameter": "215 mm", "width": "47 mm", "load_rating": "140 kN", "max_speed": "4300 rpm"}'::jsonb, '["ISO 15:2017", "DIN 625"]'::jsonb, '1 year warranty'),
  ('ITEM-022', 'SEAL-MECH', 'Mechanical Seal Type 21', 'Cartridge mechanical seal for pumps', 'CAT-SPARE', 'SUP-006', 8500000, 'IDR', 80, 45, 'Unit', '{"shaft_size": "65 mm", "pressure": "16 bar", "temperature": "-20 to 200°C", "material": "SiC/Carbon", "spring": "Hastelloy C"}'::jsonb, '["API 682", "ISO 3069"]'::jsonb, '18 months warranty'),
  ('ITEM-023', 'FILTER-HYD', 'Hydraulic Filter Element', 'High-efficiency hydraulic filter cartridge', 'CAT-SPARE', 'SUP-006', 750000, 'IDR', 200, 21, 'Unit', '{"filtration": "10 micron", "flow_rate": "180 L/min", "pressure_drop": "0.35 bar", "collapse_pressure": "21 bar", "media": "Glass fiber"}'::jsonb, '["ISO 2941", "ISO 3968"]'::jsonb, '6 months warranty'),
  ('ITEM-024', 'OIL-TURB', 'Turbine Oil ISO VG 46', 'Premium turbine lubricating oil', 'CAT-SPARE', 'SUP-006', 185000, 'IDR', 2000, 14, 'Liter', '{"viscosity": "ISO VG 46", "viscosity_index": "95", "flash_point": "220°C", "pour_point": "-12°C", "rust_prevention": "Pass ASTM D665"}'::jsonb, '["ISO 8068", "DIN 51515"]'::jsonb', '3 years shelf life'),
  ('ITEM-025', 'GASKET-SPR', 'Spiral Wound Gasket 12"', 'High-pressure spiral wound gasket with graphite filler', 'CAT-SPARE', 'SUP-006', 1250000, 'IDR', 150, 21, 'Unit', '{"size": "12 inch", "class": "300#", "material": "316 SS + Graphite", "max_pressure": "51 bar", "max_temp": "538°C"}'::jsonb, '["ASME B16.20", "API 601"]'::jsonb, 'Single use item')
ON CONFLICT (item_id) DO NOTHING;

-- ============================================================================
-- SAFETY & ENVIRONMENTAL EQUIPMENT
-- ============================================================================

INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, currency, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITEM-026', 'FIRE-FM200', 'FM-200 Fire Suppression System', 'Clean agent fire suppression for electrical rooms', 'CAT-SAFE', 'SUP-010', 285000000, 'IDR', 10, 60, 'System', '{"agent": "HFC-227ea", "coverage": "200 m³", "discharge_time": "10 seconds", "cylinders": "4 x 100L", "pressure": "25 bar"}'::jsonb, '["NFPA 2001", "ISO 14520", "UL Listed"]'::jsonb, '3 years warranty on equipment'),
  ('ITEM-027', 'CEMS-CONT', 'Continuous Emission Monitoring System', 'Multi-gas emission analyzer for stack monitoring', 'CAT-SAFE', 'SUP-005', 750000000, 'IDR', 5, 90, 'System', '{"gases": "SO2, NOx, CO, O2, Particulate", "range_SO2": "0-500 ppm", "range_NOx": "0-500 ppm", "accuracy": "±2% FS", "data_logger": "Included"}'::jsonb, '["EPA", "ISO 14001", "PROPER"]'::jsonb, '2 years warranty with annual calibration'),
  ('ITEM-028', 'PPE-ARC', 'Arc Flash Protection Kit', 'Complete arc-rated PPE kit for electrical work', 'CAT-SAFE', 'SUP-010', 15000000, 'IDR', 50, 30, 'Set', '{"arc_rating": "40 cal/cm²", "includes": "Suit, Hood, Gloves, Shoes", "standards": "NFPA 70E, ASTM F1506", "size_range": "M, L, XL"}'::jsonb, '["NFPA 70E", "ASTM F1506", "IEC 61482"]'::jsonb, 'No warranty - consumable safety item'),
  ('ITEM-029', 'SPILL-KIT', 'Oil Spill Response Kit 1000L', 'Emergency oil spill containment and cleanup kit', 'CAT-SAFE', 'SUP-010', 28000000, 'IDR', 30, 21, 'Kit', '{"capacity": "1000 L", "absorbent_type": "Polypropylene", "includes": "Pads, Booms, Bags, Gloves", "container": "Wheeled bin", "weight": "85 kg"}'::jsonb, '["ISO 14001", "MARPOL"]'::jsonb, '2 years shelf life for absorbents'),
  ('ITEM-030', 'SAFTY-SHW', 'Emergency Safety Shower & Eyewash', 'Combination emergency shower and eyewash station', 'CAT-SAFE', 'SUP-010', 35000000, 'IDR', 25, 45, 'Unit', '{"flow_shower": "75 L/min", "flow_eyewash": "11 L/min", "material": "304 SS", "activation": "Push paddle", "freeze_protection": "Optional"}'::jsonb, '["ANSI Z358.1", "EN 15154", "ISO 9001:2015"]'::jsonb, '3 years warranty on mechanical parts')
ON CONFLICT (item_id) DO NOTHING;

-- ============================================================================
-- SERVICES
-- ============================================================================

INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, currency, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITEM-031', 'SVC-MAINT-TRF', 'Transformer Maintenance Service', 'Annual preventive maintenance for power transformers', 'CAT-SERV', 'SUP-001', 125000000, 'IDR', 0, 30, 'Service', '{"scope": "Oil testing, BDV test, Thermography, Visual inspection, Report", "duration": "3 days", "team_size": "4 technicians", "equipment": "Test equipment included"}'::jsonb, '["ISO 9001:2015", "SPLN"]'::jsonb, 'Service guarantee 6 months'),
  ('ITEM-032', 'SVC-INST-GTG', 'Gas Turbine Installation Service', 'Complete installation and commissioning of gas turbines', 'CAT-SERV', 'SUP-002', 850000000, 'IDR', 0, 60, 'Service', '{"scope": "Rigging, Installation, Alignment, Commissioning, Testing", "duration": "45 days", "team": "10 engineers", "training": "Operations training included"}'::jsonb, '["ISO 9001:2015", "API 616"]'::jsonb, 'Installation warranty 2 years'),
  ('ITEM-033', 'SVC-TRAIN-SCADA', 'SCADA System Training', 'Comprehensive SCADA operator training program', 'CAT-SERV', 'SUP-005', 45000000, 'IDR', 0, 21, 'Course', '{"duration": "5 days", "participants": "Up to 12", "location": "On-site", "includes": "Materials, Certificates", "trainer": "Certified instructor"}'::jsonb, '["ISO 9001:2015"]'::jsonb, 'Training materials included'),
  ('ITEM-034', 'SVC-INSP-BOILER', 'Boiler Inspection Service', 'Comprehensive boiler inspection and NDT testing', 'CAT-SERV', 'SUP-006', 95000000, 'IDR', 0, 30, 'Service', '{"scope": "Visual, UT, RT, MT, PT, Thickness measurement", "duration": "5 days", "team": "5 NDT Level II inspectors", "report": "Full inspection report"}'::jsonb, '["ASNT Level II", "ISO 9712", "ASME"]'::jsonb, 'Report validity 1 year'),
  ('ITEM-035', 'SVC-CALIB-INST', 'Instrument Calibration Service', 'On-site calibration service for process instruments', 'CAT-SERV', 'SUP-005', 2500000, 'IDR', 0, 14, 'Instrument', '{"scope": "Calibration per manufacturer specs", "standards": "Traceable to national standards", "documentation": "Calibration certificate", "validity": "1 year"}'::jsonb, '["ISO 17025", "ISO 9001:2015"]'::jsonb, 'Calibration valid 1 year')
ON CONFLICT (item_id) DO NOTHING;
