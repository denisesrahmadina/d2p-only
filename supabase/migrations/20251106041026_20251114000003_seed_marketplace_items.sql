-- Seed PLN Marketplace Items

-- Mechanical Equipment
INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, currency, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITEM-001', 'GTG-100MW', 'Gas Turbine Generator 100MW', 'Combined cycle gas turbine generator for power generation', 'CAT-MECH', 'SUP-002', 450000000000, 'IDR', 2, 240, 'Unit', '{"power_output": "100 MW", "fuel_type": "Natural Gas", "efficiency": "38.5%", "emissions_nox": "< 25 ppm"}'::jsonb, '["ISO 9001:2015", "API 616", "EPA Tier 4"]'::jsonb, '5 years comprehensive warranty'),
  ('ITEM-002', 'STG-50MW', 'Steam Turbine Generator 50MW', 'High-efficiency steam turbine for coal power plants', 'CAT-MECH', 'SUP-009', 280000000000, 'IDR', 1, 180, 'Unit', '{"power_output": "50 MW", "steam_pressure": "12.5 MPa", "efficiency": "42%"}'::jsonb, '["ISO 9001:2015", "ASME", "API 612"]'::jsonb, '3 years warranty'),
  ('ITEM-003', 'CMP-5000', 'Centrifugal Compressor 5000 CFM', 'Industrial air compressor for power plant auxiliaries', 'CAT-MECH', 'SUP-006', 850000000, 'IDR', 5, 90, 'Unit', '{"capacity": "5000 CFM", "pressure": "150 PSI", "power": "750 kW"}'::jsonb, '["ISO 9001:2015", "API 617"]'::jsonb, '2 years warranty')
ON CONFLICT (item_id) DO NOTHING;

-- Electrical Equipment
INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, currency, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITEM-006', 'TRF-150MVA', 'Power Transformer 150 MVA', 'Three-phase power transformer for high voltage transmission', 'CAT-ELEC', 'SUP-001', 12500000000, 'IDR', 3, 120, 'Unit', '{"voltage_rating": "150 kV", "power_rating": "150 MVA", "frequency": "50 Hz"}'::jsonb, '["IEC 60076", "IEEE C57.12.00", "ISO 9001:2015"]'::jsonb, '3 years warranty'),
  ('ITEM-007', 'GEN-100MVA', 'Synchronous Generator 100 MVA', 'Air-cooled synchronous generator for gas turbines', 'CAT-ELEC', 'SUP-002', 35000000000, 'IDR', 2, 180, 'Unit', '{"power_rating": "100 MVA", "voltage": "13.8 kV", "frequency": "50 Hz"}'::jsonb, '["IEC 60034", "IEEE C50.13"]'::jsonb, '5 years warranty'),
  ('ITEM-008', 'CB-150KV', 'Circuit Breaker 150 kV', 'SF6 gas-insulated circuit breaker', 'CAT-ELEC', 'SUP-003', 1800000000, 'IDR', 10, 60, 'Unit', '{"voltage_rating": "150 kV", "rated_current": "2000 A"}'::jsonb, '["IEC 62271-100", "IEEE C37.04"]'::jsonb, '2 years warranty')
ON CONFLICT (item_id) DO NOTHING;

-- Instrumentation & Control
INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, currency, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITEM-011', 'PLC-500', 'Programmable Logic Controller PLC-500', 'Industrial PLC for power plant automation', 'CAT-INST', 'SUP-005', 185000000, 'IDR', 20, 60, 'Unit', '{"io_points": "512", "scan_time": "5 ms", "memory": "2 MB"}'::jsonb, '["IEC 61131", "UL 508", "CE"]'::jsonb, '3 years warranty'),
  ('ITEM-012', 'SCADA-PRO', 'SCADA System Professional', 'Supervisory control and data acquisition system', 'CAT-INST', 'SUP-005', 950000000, 'IDR', 5, 90, 'License', '{"max_tags": "50000", "redundancy": "Hot standby"}'::jsonb, '["ISO 9001:2015", "IEC 62351"]'::jsonb, '1 year software support'),
  ('ITEM-013', 'TEMP-PT100', 'Temperature Sensor PT100', 'Precision RTD temperature sensor', 'CAT-INST', 'SUP-005', 1250000, 'IDR', 200, 14, 'Unit', '{"type": "PT100", "range": "-50°C to 500°C", "accuracy": "±0.15°C"}'::jsonb, '["IEC 60751"]'::jsonb, '2 years warranty')
ON CONFLICT (item_id) DO NOTHING;

-- Construction Materials
INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, currency, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITEM-016', 'STEEL-H400', 'Structural Steel H-Beam 400x200', 'Heavy duty structural steel beam', 'CAT-CONS', 'SUP-006', 15000000, 'IDR', 500, 30, 'Ton', '{"grade": "SS400", "dimensions": "400x200x8x13 mm", "length": "12 m"}'::jsonb, '["JIS G3101", "SNI 07-0052"]'::jsonb, 'Material certification included'),
  ('ITEM-017', 'PIPE-SCH80', 'Carbon Steel Pipe 12" Sch 80', 'Seamless carbon steel pipe for high pressure', 'CAT-CONS', 'SUP-006', 8500000, 'IDR', 1000, 45, 'Meter', '{"size": "12 inch", "schedule": "80", "material": "ASTM A106 Gr.B"}'::jsonb, '["ASTM A106", "ASME B36.10"]'::jsonb, 'Mill test certificate')
ON CONFLICT (item_id) DO NOTHING;

-- Spare Parts
INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, currency, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITEM-021', 'BEAR-6320', 'Deep Groove Ball Bearing 6320', 'Heavy duty bearing for rotating equipment', 'CAT-SPARE', 'SUP-006', 2850000, 'IDR', 100, 30, 'Unit', '{"bore": "100 mm", "outer_diameter": "215 mm", "load_rating": "140 kN"}'::jsonb, '["ISO 15:2017", "DIN 625"]'::jsonb, '1 year warranty'),
  ('ITEM-022', 'SEAL-MECH', 'Mechanical Seal Type 21', 'Cartridge mechanical seal for pumps', 'CAT-SPARE', 'SUP-006', 8500000, 'IDR', 80, 45, 'Unit', '{"shaft_size": "65 mm", "pressure": "16 bar", "temperature": "-20 to 200°C"}'::jsonb, '["API 682", "ISO 3069"]'::jsonb, '18 months warranty')
ON CONFLICT (item_id) DO NOTHING;

-- Safety Equipment
INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, currency, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITEM-026', 'FIRE-FM200', 'FM-200 Fire Suppression System', 'Clean agent fire suppression for electrical rooms', 'CAT-SAFE', 'SUP-010', 285000000, 'IDR', 10, 60, 'System', '{"agent": "HFC-227ea", "coverage": "200 m³", "discharge_time": "10 seconds"}'::jsonb, '["NFPA 2001", "ISO 14520", "UL Listed"]'::jsonb, '3 years warranty'),
  ('ITEM-027', 'CEMS-CONT', 'Continuous Emission Monitoring System', 'Multi-gas emission analyzer for stack monitoring', 'CAT-SAFE', 'SUP-005', 750000000, 'IDR', 5, 90, 'System', '{"gases": "SO2, NOx, CO, O2", "range_SO2": "0-500 ppm", "accuracy": "±2% FS"}'::jsonb, '["EPA", "ISO 14001", "PROPER"]'::jsonb, '2 years warranty')
ON CONFLICT (item_id) DO NOTHING;

-- Services
INSERT INTO marketplace_items (item_id, item_code, item_name, item_description, category_id, supplier_id, unit_price, currency, stock_quantity, lead_time_days, unit_of_measure, technical_specifications, compliance_certifications, warranty_info) VALUES
  ('ITEM-031', 'SVC-MAINT-TRF', 'Transformer Maintenance Service', 'Annual preventive maintenance for power transformers', 'CAT-SERV', 'SUP-001', 125000000, 'IDR', 0, 30, 'Service', '{"scope": "Oil testing, BDV test, Thermography, Report", "duration": "3 days"}'::jsonb, '["ISO 9001:2015", "SPLN"]'::jsonb, '6 months service guarantee'),
  ('ITEM-032', 'SVC-INST-GTG', 'Gas Turbine Installation Service', 'Complete installation and commissioning of gas turbines', 'CAT-SERV', 'SUP-002', 850000000, 'IDR', 0, 60, 'Service', '{"scope": "Installation, Alignment, Commissioning, Testing", "duration": "45 days"}'::jsonb, '["ISO 9001:2015", "API 616"]'::jsonb, '2 years installation warranty')
ON CONFLICT (item_id) DO NOTHING;