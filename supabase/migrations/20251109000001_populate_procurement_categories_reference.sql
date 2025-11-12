/*
  # Populate Procurement Categories Reference Data

  ## Overview
  Populates the ref_procurement_categories table with all 6 main categories
  and their 34 subcategories with realistic benchmarks for Indonesian Power Company.

  ## Categories Structure
  - A: Energi Primer dan Jasa Penunjangnya (3 subcategories)
  - B: Peralatan Penunjang dan Sistem Mechanical/Electrical (9 subcategories)
  - C: Material, Consumable, dan General Supply (11 subcategories)
  - D: Asset Non-Operasional dan Penunjang Manajemen (6 subcategories)
  - E: Jasa dan Kontrak Pendukung (5 subcategories)
  - F: Peralatan Utama Pembangkit dan Project EPC (9 subcategories)
*/

-- Category A: Energi Primer dan Jasa Penunjangnya
INSERT INTO ref_procurement_categories (
  main_category_code, main_category_name, sub_category_name, description,
  typical_contract_value_min, typical_contract_value_max,
  typical_sourcing_days_min, typical_sourcing_days_max,
  target_savings_percentage, organization_id
) VALUES
('A', 'Energi Primer dan Jasa Penunjangnya', 'Energi Primer', 'Primary energy sources including coal, gas, and renewable energy', 5000000000, 50000000000, 45, 90, 10.0, 'ORG001'),
('A', 'Energi Primer dan Jasa Penunjangnya', 'Jasa Energi Primer', 'Primary energy services and support', 2000000000, 20000000000, 45, 90, 12.0, 'ORG001'),
('A', 'Energi Primer dan Jasa Penunjangnya', 'Transportasi Energi Primer', 'Transportation and logistics for primary energy', 1000000000, 15000000000, 30, 75, 11.0, 'ORG001'),

-- Category B: Peralatan Penunjang dan Sistem Mechanical/Electrical
('B', 'Peralatan Penunjang dan Sistem Mechanical/Electrical', 'Alat Komunikasi', 'Communication equipment and systems', 500000000, 5000000000, 25, 45, 14.0, 'ORG001'),
('B', 'Peralatan Penunjang dan Sistem Mechanical/Electrical', 'Alat Pengukur & Recorder', 'Measurement and recording instruments', 300000000, 3000000000, 25, 45, 15.0, 'ORG001'),
('B', 'Peralatan Penunjang dan Sistem Mechanical/Electrical', 'Bearing', 'Industrial bearings and components', 200000000, 2000000000, 25, 40, 13.0, 'ORG001'),
('B', 'Peralatan Penunjang dan Sistem Mechanical/Electrical', 'Filter Kabel', 'Filters and cable systems', 150000000, 1500000000, 20, 40, 14.0, 'ORG001'),
('B', 'Peralatan Penunjang dan Sistem Mechanical/Electrical', 'Kompressor, Motor Listrik, Peralatan', 'Compressors, electric motors, and equipment', 800000000, 8000000000, 30, 50, 16.0, 'ORG001'),
('B', 'Peralatan Penunjang dan Sistem Mechanical/Electrical', 'Instrumen & Kontrol', 'Instrumentation and control systems', 600000000, 6000000000, 30, 50, 15.0, 'ORG001'),
('B', 'Peralatan Penunjang dan Sistem Mechanical/Electrical', 'Peralatan Listrik/Elektronik', 'Electrical and electronic equipment', 500000000, 5000000000, 25, 45, 14.0, 'ORG001'),
('B', 'Peralatan Penunjang dan Sistem Mechanical/Electrical', 'Pipping & Connection', 'Piping systems and connections', 400000000, 4000000000, 25, 45, 13.0, 'ORG001'),
('B', 'Peralatan Penunjang dan Sistem Mechanical/Electrical', 'Pompa, Valve, Trap', 'Pumps, valves, and traps', 350000000, 3500000000, 25, 45, 14.0, 'ORG001'),

-- Category C: Material, Consumable, dan General Supply
('C', 'Material, Consumable, dan General Supply', 'Baut, Sekrup, Mur Non Metrik & Metrik', 'Bolts, screws, and nuts', 100000000, 800000000, 15, 30, 10.0, 'ORG001'),
('C', 'Material, Consumable, dan General Supply', 'Bahan Dasar Bangunan', 'Basic building materials', 200000000, 1500000000, 15, 35, 11.0, 'ORG001'),
('C', 'Material, Consumable, dan General Supply', 'Bahan Logam', 'Metal materials and components', 300000000, 2000000000, 20, 35, 12.0, 'ORG001'),
('C', 'Material, Consumable, dan General Supply', 'Belt Conveyor', 'Conveyor belts and systems', 250000000, 2500000000, 20, 40, 11.0, 'ORG001'),
('C', 'Material, Consumable, dan General Supply', 'Kawat Transmisi', 'Transmission wires and cables', 200000000, 2000000000, 20, 35, 10.0, 'ORG001'),
('C', 'Material, Consumable, dan General Supply', 'Kimia', 'Chemicals and chemical products', 150000000, 1500000000, 15, 30, 9.0, 'ORG001'),
('C', 'Material, Consumable, dan General Supply', 'Minyak & Pelumas', 'Oils and lubricants', 300000000, 3000000000, 15, 30, 8.0, 'ORG001'),
('C', 'Material, Consumable, dan General Supply', 'Pemindah Tenaga Mekanik & Penghubung', 'Mechanical power transmission and couplings', 200000000, 1800000000, 20, 35, 11.0, 'ORG001'),
('C', 'Material, Consumable, dan General Supply', 'Pengikat & Penahan', 'Fasteners and holders', 100000000, 1000000000, 15, 30, 10.0, 'ORG001'),
('C', 'Material, Consumable, dan General Supply', 'Peralatan Kerja/Tool', 'Work tools and equipment', 150000000, 1500000000, 15, 30, 12.0, 'ORG001'),
('C', 'Material, Consumable, dan General Supply', 'Perapat', 'Gaskets and seals', 100000000, 1200000000, 15, 30, 11.0, 'ORG001'),

-- Category D: Asset Non-Operasional dan Penunjang Manajemen
('D', 'Asset Non-Operasional dan Penunjang Manajemen', 'Alat-alat Besar', 'Heavy equipment and machinery', 500000000, 5000000000, 30, 60, 13.0, 'ORG001'),
('D', 'Asset Non-Operasional dan Penunjang Manajemen', 'Asset IT', 'IT assets and infrastructure', 400000000, 4000000000, 25, 50, 14.0, 'ORG001'),
('D', 'Asset Non-Operasional dan Penunjang Manajemen', 'Barang/Jasa Pendukung Lainnya', 'Other supporting goods and services', 300000000, 3000000000, 20, 45, 12.0, 'ORG001'),
('D', 'Asset Non-Operasional dan Penunjang Manajemen', 'Peralatan K3 & Pemadam Api', 'Safety equipment and fire suppression', 250000000, 2500000000, 20, 40, 11.0, 'ORG001'),
('D', 'Asset Non-Operasional dan Penunjang Manajemen', 'Peralatan Penanganan Bahan Bakar & Abu', 'Fuel and ash handling equipment', 600000000, 6000000000, 30, 55, 13.0, 'ORG001'),
('D', 'Asset Non-Operasional dan Penunjang Manajemen', 'Sewa Equipment Indirect', 'Indirect equipment rental', 200000000, 2000000000, 15, 35, 10.0, 'ORG001'),

-- Category E: Jasa dan Kontrak Pendukung
('E', 'Jasa dan Kontrak Pendukung', 'Jasa Konstruksi', 'Construction services', 2000000000, 20000000000, 40, 75, 13.0, 'ORG001'),
('E', 'Jasa dan Kontrak Pendukung', 'Jasa Konsultan', 'Consulting services', 500000000, 5000000000, 30, 60, 11.0, 'ORG001'),
('E', 'Jasa dan Kontrak Pendukung', 'Jasa Operasi', 'Operations services', 1500000000, 15000000000, 35, 70, 12.0, 'ORG001'),
('E', 'Jasa dan Kontrak Pendukung', 'Jasa Pemeliharaan', 'Maintenance services', 1000000000, 10000000000, 30, 65, 14.0, 'ORG001'),
('E', 'Jasa dan Kontrak Pendukung', 'Jasa Logistik Pihak Ketiga', 'Third-party logistics services', 800000000, 8000000000, 25, 55, 13.0, 'ORG001'),

-- Category F: Peralatan Utama Pembangkit dan Project EPC
('F', 'Peralatan Utama Pembangkit dan Project EPC', 'Boiler', 'Boiler systems and components', 20000000000, 200000000000, 90, 180, 18.0, 'ORG001'),
('F', 'Peralatan Utama Pembangkit dan Project EPC', 'Generator', 'Generator systems', 15000000000, 150000000000, 90, 180, 17.0, 'ORG001'),
('F', 'Peralatan Utama Pembangkit dan Project EPC', 'Mesin Diesel', 'Diesel engines', 10000000000, 100000000000, 75, 150, 16.0, 'ORG001'),
('F', 'Peralatan Utama Pembangkit dan Project EPC', 'Sewa Mesin Pembangkit', 'Generator rental services', 5000000000, 50000000000, 45, 90, 15.0, 'ORG001'),
('F', 'Peralatan Utama Pembangkit dan Project EPC', 'Transformator', 'Transformer systems', 12000000000, 120000000000, 80, 160, 17.0, 'ORG001'),
('F', 'Peralatan Utama Pembangkit dan Project EPC', 'Turbine Air', 'Water turbines', 18000000000, 180000000000, 90, 180, 19.0, 'ORG001'),
('F', 'Peralatan Utama Pembangkit dan Project EPC', 'Turbine Gas', 'Gas turbines', 25000000000, 250000000000, 100, 180, 20.0, 'ORG001'),
('F', 'Peralatan Utama Pembangkit dan Project EPC', 'Turbine Uap', 'Steam turbines', 22000000000, 220000000000, 95, 180, 19.0, 'ORG001'),
('F', 'Peralatan Utama Pembangkit dan Project EPC', 'Project EPC', 'Engineering, Procurement, and Construction projects', 30000000000, 500000000000, 120, 240, 22.0, 'ORG001')

ON CONFLICT (main_category_code, sub_category_name, organization_id) DO NOTHING;

-- Verify data insertion
DO $$
DECLARE
  category_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO category_count FROM ref_procurement_categories WHERE organization_id = 'ORG001';

  IF category_count = 43 THEN
    RAISE NOTICE 'Successfully inserted all 43 procurement categories (6 main, 43 subcategories)';
  ELSE
    RAISE WARNING 'Expected 43 categories, but found %', category_count;
  END IF;
END $$;
