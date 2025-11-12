/*
  # Populate Comprehensive Procurement Savings Data Part 2 (Categories C, D, E, F)

  ## Continuation of comprehensive procurement contract data
  This file contains the remaining categories C, D, E, and F contracts.
*/

-- Category C: Material, Consumable, dan General Supply (32 contracts)
INSERT INTO fact_procurement_savings_contract (
  contract_id, contract_name, supplier_name, category, main_category, sub_category,
  business_unit, award_date, owner_estimate, final_contract_value,
  contract_status, contract_duration_months, notes, organization_id
) VALUES
('CTRT-C-2023-001', 'Fasteners Bulk Purchase 2023', 'PT Unimega Jaya', 'MRO', 'C', 'Baut, Sekrup, Mur Non Metrik & Metrik', 'PLTU Paiton', '2023-11-18', 320000000, 288000000, 'Completed', 12, 'Annual fasteners supply', 'ORG001'),
('CTRT-C-2023-002', 'Cement and Concrete Materials', 'PT Semen Indonesia', 'MRO', 'C', 'Bahan Dasar Bangunan', 'PLTS Cirata', '2023-12-05', 580000000, 522000000, 'Completed', 6, 'Construction materials', 'ORG001'),
('CTRT-C-2024-001', 'Steel Plates and Sheets', 'PT Krakatau Steel', 'MRO', 'C', 'Bahan Logam', 'PLTU Tanjung Jati', '2024-01-12', 720000000, 648000000, 'Finalized', 12, 'Structural steel materials', 'ORG001'),
('CTRT-C-2024-002', 'Conveyor Belt Replacement', 'PT Continental Belting', 'MRO', 'C', 'Belt Conveyor', 'PLTU Paiton', '2024-02-05', 1250000000, 1112500000, 'Finalized', 18, 'Heavy-duty conveyor belts', 'ORG001'),
('CTRT-C-2024-003', 'Power Cable Supply 2024', 'PT Voksel Electric', 'MRO', 'C', 'Kawat Transmisi', 'PLTS Cirata', '2024-03-10', 880000000, 792000000, 'Finalized', 12, 'Low voltage cables', 'ORG001'),
('CTRT-C-2024-004', 'Water Treatment Chemicals', 'PT Nalco Indonesia', 'MRO', 'C', 'Kimia', 'PLTG Muara Karang', '2024-04-08', 650000000, 585000000, 'Finalized', 24, 'Boiler water treatment', 'ORG001'),
('CTRT-C-2024-005', 'Turbine Oil Supply Contract', 'PT Shell Indonesia', 'MRO', 'C', 'Minyak & Pelumas', 'PLTU Tanjung Jati', '2024-05-12', 1450000000, 1305000000, 'Finalized', 18, 'Premium turbine lubricants', 'ORG001'),
('CTRT-C-2024-006', 'Coupling and Gear Components', 'PT Flender Indonesia', 'MRO', 'C', 'Pemindah Tenaga Mekanik & Penghubung', 'PLTG Cilegon', '2024-06-15', 890000000, 809100000, 'Finalized', 12, 'Power transmission parts', 'ORG001'),
('CTRT-C-2024-007', 'Industrial Fastening Systems', 'PT Hilti Indonesia', 'MRO', 'C', 'Pengikat & Penahan', 'PLTS Cirata', '2024-07-08', 420000000, 378000000, 'Finalized', 12, 'Anchoring and fixing systems', 'ORG001'),
('CTRT-C-2024-008', 'Hand Tools and Equipment', 'PT Stanley Black & Decker', 'MRO', 'C', 'Peralatan Kerja/Tool', 'PLTU Paiton', '2024-08-12', 580000000, 522000000, 'Finalized', 12, 'Professional tool kits', 'ORG001'),
('CTRT-C-2024-009', 'Gasket and Seal Package', 'PT Garlock Indonesia', 'MRO', 'C', 'Perapat', 'PLTG Muara Karang', '2024-09-05', 490000000, 446100000, 'Finalized', 12, 'High-temperature gaskets', 'ORG001'),
('CTRT-C-2024-010', 'Metric Bolts Annual Supply', 'PT Bossard Indonesia', 'MRO', 'C', 'Baut, Sekrup, Mur Non Metrik & Metrik', 'PLTU Tanjung Jati', '2024-10-10', 380000000, 342000000, 'Finalized', 12, 'Metric grade 8.8 bolts', 'ORG001'),
('CTRT-C-2024-011', 'Building Materials Q4 2024', 'PT Wijaya Karya Beton', 'MRO', 'C', 'Bahan Dasar Bangunan', 'PLTS Cirata', '2024-11-08', 620000000, 558000000, 'Finalized', 6, 'Precast concrete elements', 'ORG001'),
('CTRT-C-2025-001', 'Aluminum and Copper Materials', 'PT Freeport Indonesia', 'MRO', 'C', 'Bahan Logam', 'PLTG Cilegon', '2025-01-15', 780000000, 702000000, 'Active', 12, 'Non-ferrous metals', 'ORG001'),
('CTRT-C-2025-002', 'Conveyor Idlers and Rollers', 'PT Luff Industries', 'MRO', 'C', 'Belt Conveyor', 'PLTU Paiton', '2025-02-12', 1120000000, 1008000000, 'Active', 12, 'Conveyor components', 'ORG001'),
('CTRT-C-2025-003', 'Control Cable Supply', 'PT Supreme Cable', 'MRO', 'C', 'Kawat Transmisi', 'PLTS Cirata', '2025-03-08', 740000000, 666000000, 'Active', 12, 'Instrumentation cables', 'ORG001'),
('CTRT-C-2025-004', 'Cleaning Chemicals Package', 'PT Ecolab Indonesia', 'MRO', 'C', 'Kimia', 'PLTG Muara Karang', '2025-04-10', 520000000, 468000000, 'Active', 12, 'Industrial cleaning agents', 'ORG001'),
('CTRT-C-2025-005', 'Hydraulic Oil Annual Contract', 'PT Mobil Oil Indonesia', 'MRO', 'C', 'Minyak & Pelumas', 'PLTU Tanjung Jati', '2025-05-15', 1380000000, 1242000000, 'Active', 18, 'Hydraulic fluids ISO VG 46', 'ORG001'),
('CTRT-C-2025-006', 'Belt and Chain Drive Systems', 'PT Gates Indonesia', 'MRO', 'C', 'Pemindah Tenaga Mekanik & Penghubung', 'PLTG Cilegon', '2025-06-08', 820000000, 738000000, 'Active', 12, 'V-belts and timing belts', 'ORG001'),
('CTRT-C-2025-007', 'Clamps and Brackets', 'PT Mikalor Indonesia', 'MRO', 'C', 'Pengikat & Penahan', 'PLTS Cirata', '2025-07-12', 390000000, 351000000, 'Active', 6, 'Hose clamps and supports', 'ORG001'),
('CTRT-C-2025-008', 'Power Tools Replacement', 'PT Makita Indonesia', 'MRO', 'C', 'Peralatan Kerja/Tool', 'PLTU Paiton', '2025-08-05', 620000000, 558000000, 'Active', 12, 'Cordless power tools', 'ORG001'),
('CTRT-C-2025-009', 'O-Ring and Seal Kit', 'PT Trelleborg Indonesia', 'MRO', 'C', 'Perapat', 'PLTG Muara Karang', '2025-09-10', 460000000, 414000000, 'Active', 9, 'Comprehensive seal kits', 'ORG001'),
('CTRT-C-2025-010', 'Stainless Steel Fasteners', 'PT Bumax Indonesia', 'MRO', 'C', 'Baut, Sekrup, Mur Non Metrik & Metrik', 'PLTU Tanjung Jati', '2025-10-08', 410000000, 369000000, 'Active', 12, 'Corrosion-resistant fasteners', 'ORG001'),
('CTRT-C-2025-011', 'Ready-Mix Concrete Supply', 'PT Holcim Indonesia', 'MRO', 'C', 'Bahan Dasar Bangunan', 'PLTS Cirata', '2025-11-05', 680000000, 612000000, 'Active', 6, 'High-strength concrete', 'ORG001'),
('CTRT-C-2023-003', 'Stainless Steel Rods', 'PT Blue Scope Steel', 'MRO', 'C', 'Bahan Logam', 'PLTU Paiton', '2023-12-15', 650000000, 585000000, 'Completed', 6, 'Reinforcement materials', 'ORG001'),
('CTRT-C-2024-012', 'Belt Splicing Materials', 'PT Flexco Indonesia', 'MRO', 'C', 'Belt Conveyor', 'PLTU Tanjung Jati', '2024-12-10', 980000000, 882000000, 'Finalized', 12, 'Conveyor belt repair', 'ORG001'),
('CTRT-C-2024-013', 'Electrical Wire and Connectors', 'PT Erico Indonesia', 'MRO', 'C', 'Kawat Transmisi', 'PLTS Cirata', '2024-12-20', 680000000, 612000000, 'Finalized', 9, 'Grounding and bonding', 'ORG001'),
('CTRT-C-2024-014', 'Corrosion Inhibitor Chemicals', 'PT Cortec Indonesia', 'MRO', 'C', 'Kimia', 'PLTG Muara Karang', '2024-11-25', 520000000, 468000000, 'Finalized', 12, 'VCI corrosion protection', 'ORG001'),
('CTRT-C-2024-015', 'Grease and Lubrication Products', 'PT Castrol Indonesia', 'MRO', 'C', 'Minyak & Pelumas', 'PLTU Paiton', '2024-10-18', 1280000000, 1152000000, 'Finalized', 18, 'Multi-purpose greases', 'ORG001'),
('CTRT-C-2024-016', 'Shaft Coupling Systems', 'PT Rexnord Indonesia', 'MRO', 'C', 'Pemindah Tenaga Mekanik & Penghubung', 'PLTG Cilegon', '2024-09-22', 780000000, 702000000, 'Finalized', 12, 'Flexible couplings', 'ORG001'),
('CTRT-C-2024-017', 'Wire Rope and Slings', 'PT Teufelberger Indonesia', 'MRO', 'C', 'Pengikat & Penahan', 'PLTS Cirata', '2024-08-28', 450000000, 405000000, 'Finalized', 12, 'Lifting equipment', 'ORG001'),
('CTRT-C-2024-018', 'Measuring and Testing Tools', 'PT Mitutoyo Indonesia', 'MRO', 'C', 'Peralatan Kerja/Tool', 'PLTU Tanjung Jati', '2024-07-25', 580000000, 522000000, 'Finalized', 9, 'Precision measurement tools', 'ORG001');

-- Category D: Asset Non-Operasional dan Penunjang Manajemen (20 contracts)
INSERT INTO fact_procurement_savings_contract (
  contract_id, contract_name, supplier_name, category, main_category, sub_category,
  business_unit, award_date, owner_estimate, final_contract_value,
  contract_status, contract_duration_months, notes, organization_id
) VALUES
('CTRT-D-2023-001', 'Mobile Crane Rental 2024', 'PT United Tractors Pandu', 'Facility Management', 'D', 'Alat-alat Besar', 'PLTU Paiton', '2023-11-25', 2800000000, 2520000000, 'Completed', 24, 'Heavy lifting equipment', 'ORG001'),
('CTRT-D-2024-001', 'Server Infrastructure Upgrade', 'PT Dell Indonesia', 'IT & Technology', 'D', 'Asset IT', 'Head Office', '2024-01-18', 1850000000, 1628500000, 'Finalized', 36, 'Data center expansion', 'ORG001'),
('CTRT-D-2024-002', 'Office Furniture Procurement', 'PT IKEA Indonesia', 'Facility Management', 'D', 'Barang/Jasa Pendukung Lainnya', 'Regional Office', '2024-02-10', 680000000, 612000000, 'Finalized', 6, 'Ergonomic office furniture', 'ORG001'),
('CTRT-D-2024-003', 'Fire Protection System', 'PT Tyco Indonesia', 'Facility Management', 'D', 'Peralatan K3 & Pemadam Api', 'PLTS Cirata', '2024-03-15', 1450000000, 1276000000, 'Finalized', 24, 'FM-200 fire suppression', 'ORG001'),
('CTRT-D-2024-004', 'Ash Handling Equipment', 'PT Metso Indonesia', 'Capital Equipment', 'D', 'Peralatan Penanganan Bahan Bakar & Abu', 'PLTU Paiton', '2024-04-08', 3200000000, 2816000000, 'Finalized', 18, 'Bottom ash conveyor system', 'ORG001'),
('CTRT-D-2024-005', 'Forklift Rental Service', 'PT Toyota Material Handling', 'Facility Management', 'D', 'Sewa Equipment Indirect', 'PLTU Tanjung Jati', '2024-05-12', 980000000, 882000000, 'Finalized', 24, 'Electric forklift fleet', 'ORG001'),
('CTRT-D-2024-006', 'Excavator Long-term Rental', 'PT Komatsu Indonesia', 'Facility Management', 'D', 'Alat-alat Besar', 'PLTS Cirata', '2024-06-15', 2400000000, 2112000000, 'Finalized', 36, 'PC200 excavator rental', 'ORG001'),
('CTRT-D-2024-007', 'Network Security Infrastructure', 'PT Cisco Systems Indonesia', 'IT & Technology', 'D', 'Asset IT', 'Head Office', '2024-07-10', 2100000000, 1848000000, 'Finalized', 24, 'Firewall and IPS systems', 'ORG001'),
('CTRT-D-2024-008', 'Cleaning Services Contract', 'PT ISS Indonesia', 'Facility Management', 'D', 'Barang/Jasa Pendukung Lainnya', 'All Sites', '2024-08-05', 1200000000, 1056000000, 'Finalized', 24, 'Facility housekeeping services', 'ORG001'),
('CTRT-D-2024-009', 'Safety Equipment Supply', 'PT MSA Indonesia', 'Facility Management', 'D', 'Peralatan K3 & Pemadam Api', 'PLTG Muara Karang', '2024-09-12', 820000000, 722400000, 'Finalized', 12, 'PPE and safety gear', 'ORG001'),
('CTRT-D-2024-10', 'Coal Feeder Maintenance', 'PT Kawasaki Heavy Industries', 'Capital Equipment', 'D', 'Peralatan Penanganan Bahan Bakar & Abu', 'PLTU Tanjung Jati', '2024-10-08', 2850000000, 2508000000, 'Finalized', 18, 'Coal feeder overhaul', 'ORG001'),
('CTRT-D-2024-011', 'Generator Set Rental', 'PT Rental Solutions Indonesia', 'Facility Management', 'D', 'Sewa Equipment Indirect', 'PLTS Cirata', '2024-11-10', 1150000000, 1035000000, 'Finalized', 12, 'Backup power rental', 'ORG001'),
('CTRT-D-2025-001', 'Wheel Loader Rental Package', 'PT Volvo Construction Equipment', 'Facility Management', 'D', 'Alat-alat Besar', 'PLTU Paiton', '2025-01-15', 2600000000, 2288000000, 'Active', 24, 'L120 wheel loader', 'ORG001'),
('CTRT-D-2025-002', 'Enterprise Software Licenses', 'PT Microsoft Indonesia', 'IT & Technology', 'D', 'Asset IT', 'Head Office', '2025-02-10', 1680000000, 1478400000, 'Active', 36, 'Office 365 and Azure', 'ORG001'),
('CTRT-D-2025-003', 'Catering Services Contract', 'PT Sodexo Indonesia', 'Facility Management', 'D', 'Barang/Jasa Pendukung Lainnya', 'All Sites', '2025-03-12', 1450000000, 1276000000, 'Active', 24, 'Employee meal services', 'ORG001'),
('CTRT-D-2025-004', 'Fire Alarm System Upgrade', 'PT Honeywell Safety Indonesia', 'Facility Management', 'D', 'Peralatan K3 & Pemadam Api', 'PLTG Cilegon', '2025-04-08', 1120000000, 985600000, 'Active', 18, 'Addressable fire alarm', 'ORG001'),
('CTRT-D-2025-005', 'Fly Ash Collection System', 'PT FLSmidth Indonesia', 'Capital Equipment', 'D', 'Peralatan Penanganan Bahan Bakar & Abu', 'PLTU Paiton', '2025-05-15', 3500000000, 3080000000, 'Active', 24, 'Electrostatic precipitator', 'ORG001'),
('CTRT-D-2025-006', 'Boom Lift Rental Service', 'PT Genie Indonesia', 'Facility Management', 'D', 'Sewa Equipment Indirect', 'PLTS Cirata', '2025-06-10', 880000000, 774400000, 'Active', 18, 'Aerial work platform', 'ORG001'),
('CTRT-D-2025-007', 'Backup Storage Solution', 'PT HPE Indonesia', 'IT & Technology', 'D', 'Asset IT', 'Head Office', '2025-07-12', 1920000000, 1689600000, 'Active', 24, 'Enterprise backup system', 'ORG001'),
('CTRT-D-2025-008', 'Security Services Contract', 'PT Securitas Indonesia', 'Facility Management', 'D', 'Barang/Jasa Pendukung Lainnya', 'All Sites', '2025-08-05', 1350000000, 1188000000, 'Active', 36, 'Security guard services', 'ORG001');

-- Category E: Jasa dan Kontrak Pendukung (22 contracts)
INSERT INTO fact_procurement_savings_contract (
  contract_id, contract_name, supplier_name, category, main_category, sub_category,
  business_unit, award_date, owner_estimate, final_contract_value,
  contract_status, contract_duration_months, notes, organization_id
) VALUES
('CTRT-E-2023-001', 'Civil Construction Package', 'PT Waskita Karya', 'Consulting Services', 'E', 'Jasa Konstruksi', 'PLTS Cirata', '2023-11-20', 8500000000, 7395000000, 'Completed', 18, 'Substation foundation work', 'ORG001'),
('CTRT-E-2023-002', 'Technical Advisory Services', 'PT Grontmij Indonesia', 'Consulting Services', 'E', 'Jasa Konsultan', 'Head Office', '2023-12-10', 2200000000, 1980000000, 'Completed', 12, 'Engineering consulting', 'ORG001'),
('CTRT-E-2024-001', 'Power Plant Operations O&M', 'PT Pembangkitan Jawa Bali Services', 'Consulting Services', 'E', 'Jasa Operasi', 'PLTG Muara Karang', '2024-01-15', 6800000000, 5984000000, 'Finalized', 36, 'Operations and maintenance', 'ORG001'),
('CTRT-E-2024-002', 'Turbine Maintenance Contract', 'PT Siemens Service Indonesia', 'Consulting Services', 'E', 'Jasa Pemeliharaan', 'PLTU Tanjung Jati', '2024-02-10', 4500000000, 3915000000, 'Finalized', 24, 'Annual turbine overhaul', 'ORG001'),
('CTRT-E-2024-003', 'Logistics Management Services', 'PT DHL Supply Chain Indonesia', 'Consulting Services', 'E', 'Jasa Logistik Pihak Ketiga', 'All Sites', '2024-03-12', 3200000000, 2816000000, 'Finalized', 36, 'Spare parts logistics', 'ORG001'),
('CTRT-E-2024-004', 'Building Renovation Project', 'PT Adhi Karya', 'Consulting Services', 'E', 'Jasa Konstruksi', 'Head Office', '2024-04-08', 5600000000, 4928000000, 'Finalized', 12, 'Office building refurbishment', 'ORG001'),
('CTRT-E-2024-005', 'Environmental Consulting', 'PT ERM Indonesia', 'Consulting Services', 'E', 'Jasa Konsultan', 'PLTU Paiton', '2024-05-15', 1850000000, 1665000000, 'Finalized', 18, 'Environmental compliance', 'ORG001'),
('CTRT-E-2024-006', 'SCADA System Operations', 'PT Yokogawa Service Indonesia', 'Consulting Services', 'E', 'Jasa Operasi', 'PLTS Cirata', '2024-06-10', 4200000000, 3696000000, 'Finalized', 24, 'Remote monitoring services', 'ORG001'),
('CTRT-E-2024-007', 'Generator Maintenance Package', 'PT GE Power Service Indonesia', 'Consulting Services', 'E', 'Jasa Pemeliharaan', 'PLTG Cilegon', '2024-07-12', 5800000000, 5074000000, 'Finalized', 36, 'Long-term service agreement', 'ORG001'),
('CTRT-E-2024-008', 'Warehouse Management Services', 'PT Agility Logistics', 'Consulting Services', 'E', 'Jasa Logistik Pihak Ketiga', 'Regional Warehouse', '2024-08-05', 2400000000, 2112000000, 'Finalized', 24, 'Inventory management', 'ORG001'),
('CTRT-E-2024-009', 'Electrical Installation Work', 'PT Hutama Karya', 'Consulting Services', 'E', 'Jasa Konstruksi', 'PLTU Tanjung Jati', '2024-09-10', 7200000000, 6336000000, 'Finalized', 15, 'Electrical retrofit project', 'ORG001'),
('CTRT-E-2024-010', 'Legal Advisory Services', 'PT Baker McKenzie Indonesia', 'Consulting Services', 'E', 'Jasa Konsultan', 'Head Office', '2024-10-08', 1680000000, 1512000000, 'Finalized', 24, 'Corporate legal services', 'ORG001'),
('CTRT-E-2024-011', 'Control Room Operations', 'PT ABB Service Indonesia', 'Consulting Services', 'E', 'Jasa Operasi', 'PLTG Muara Karang', '2024-11-12', 5200000000, 4576000000, 'Finalized', 30, 'DCS operations support', 'ORG001'),
('CTRT-E-2025-001', 'Boiler Maintenance LTSA', 'PT Mitsubishi Hitachi Power Systems', 'Consulting Services', 'E', 'Jasa Pemeliharaan', 'PLTU Paiton', '2025-01-15', 6500000000, 5655000000, 'Active', 36, 'Boiler long-term service', 'ORG001'),
('CTRT-E-2025-002', 'Cold Chain Logistics', 'PT Yusen Logistics Indonesia', 'Consulting Services', 'E', 'Jasa Logistik Pihak Ketiga', 'All Sites', '2025-02-10', 2800000000, 2464000000, 'Active', 24, 'Temperature-controlled transport', 'ORG001'),
('CTRT-E-2025-003', 'Steel Structure Installation', 'PT Wijaya Karya Bangunan Gedung', 'Consulting Services', 'E', 'Jasa Konstruksi', 'PLTS Cirata', '2025-03-12', 6800000000, 5984000000, 'Active', 12, 'Solar panel mounting structure', 'ORG001'),
('CTRT-E-2025-004', 'Financial Advisory Services', 'PT Deloitte Indonesia', 'Consulting Services', 'E', 'Jasa Konsultan', 'Head Office', '2025-04-08', 2100000000, 1890000000, 'Active', 18, 'M&A advisory services', 'ORG001'),
('CTRT-E-2025-005', 'Plant Performance Monitoring', 'PT Emerson Process Management', 'Consulting Services', 'E', 'Jasa Operasi', 'PLTG Cilegon', '2025-05-15', 4800000000, 4224000000, 'Active', 24, 'Real-time optimization', 'ORG001'),
('CTRT-E-2025-006', 'Transformer Maintenance', 'PT ABB Transformer Service', 'Consulting Services', 'E', 'Jasa Pemeliharaan', 'PLTU Tanjung Jati', '2025-06-10', 3900000000, 3393000000, 'Active', 24, 'Power transformer servicing', 'ORG001'),
('CTRT-E-2025-007', 'International Freight Forwarding', 'PT Kuehne+Nagel Indonesia', 'Consulting Services', 'E', 'Jasa Logistik Pihak Ketiga', 'All Sites', '2025-07-12', 3600000000, 3168000000, 'Active', 36, 'Import/export logistics', 'ORG001'),
('CTRT-E-2025-008', 'Road Infrastructure Project', 'PT Pembangunan Perumahan', 'Consulting Services', 'E', 'Jasa Konstruksi', 'PLTU Paiton', '2025-08-05', 9200000000, 8096000000, 'Active', 18, 'Access road construction', 'ORG001'),
('CTRT-E-2025-009', 'IT Strategy Consulting', 'PT Accenture Indonesia', 'Consulting Services', 'E', 'Jasa Konsultan', 'Head Office', '2025-09-10', 2450000000, 2205000000, 'Active', 12, 'Digital transformation strategy', 'ORG001');

-- Category F: Peralatan Utama Pembangkit dan Project EPC (18 contracts)
INSERT INTO fact_procurement_savings_contract (
  contract_id, contract_name, supplier_name, category, main_category, sub_category,
  business_unit, award_date, owner_estimate, final_contract_value,
  contract_status, contract_duration_months, notes, organization_id
) VALUES
('CTRT-F-2023-001', 'Boiler Tube Replacement', 'PT Sumitomo Corporation', 'EPC Projects', 'F', 'Boiler', 'PLTU Paiton', '2023-11-25', 45000000000, 36000000000, 'Completed', 24, 'Waterwall tube replacement', 'ORG001'),
('CTRT-F-2024-001', 'Generator Rotor Refurbishment', 'PT GE Power Indonesia', 'EPC Projects', 'F', 'Generator', 'PLTU Tanjung Jati', '2024-01-20', 38000000000, 30400000000, 'Finalized', 18, 'Generator overhaul project', 'ORG001'),
('CTRT-F-2024-002', 'Diesel Engine Package', 'PT MAN Energy Solutions', 'EPC Projects', 'F', 'Mesin Diesel', 'PLTD Bangka', '2024-02-15', 28000000000, 22960000000, 'Finalized', 24, 'Emergency diesel generators', 'ORG001'),
('CTRT-F-2024-003', 'Mobile Power Plant Rental', 'PT Aggreko Indonesia', 'EPC Projects', 'F', 'Sewa Mesin Pembangkit', 'Temporary Site', '2024-03-10', 12000000000, 10200000000, 'Finalized', 12, 'Temporary power supply 50MW', 'ORG001'),
('CTRT-F-2024-004', 'Power Transformer 150MVA', 'PT Schneider Electric Manufacturing', 'EPC Projects', 'F', 'Transformator', 'PLTS Cirata', '2024-04-12', 42000000000, 34650000000, 'Finalized', 18, 'Step-up transformer', 'ORG001'),
('CTRT-F-2024-005', 'Hydro Turbine Modernization', 'PT Andritz Hydro Indonesia', 'EPC Projects', 'F', 'Turbine Air', 'PLTA Saguling', '2024-05-15', 65000000000, 52000000000, 'Finalized', 30, 'Francis turbine upgrade', 'ORG001'),
('CTRT-F-2024-006', 'Gas Turbine Package GE 9F', 'PT General Electric Indonesia', 'EPC Projects', 'F', 'Turbine Gas', 'PLTG Muara Karang', '2024-06-20', 180000000000, 144000000000, 'Finalized', 36, 'Combined cycle gas turbine', 'ORG001'),
('CTRT-F-2024-007', 'Steam Turbine Retrofit', 'PT Mitsubishi Power Indonesia', 'EPC Projects', 'F', 'Turbine Uap', 'PLTU Paiton', '2024-07-10', 95000000000, 76000000000, 'Finalized', 30, 'Steam turbine efficiency upgrade', 'ORG001'),
('CTRT-F-2024-008', 'Solar Farm EPC 100MWp', 'PT Pembangkit Jawa Bali EPC', 'EPC Projects', 'F', 'Project EPC', 'PLTS Cirata Phase 3', '2024-08-15', 250000000000, 195000000000, 'Finalized', 24, 'Floating solar PV project', 'ORG001'),
('CTRT-F-2024-009', 'Boiler Economizer Installation', 'PT Babcock Hitachi', 'EPC Projects', 'F', 'Boiler', 'PLTU Tanjung Jati', '2024-09-10', 32000000000, 26560000000, 'Finalized', 18, 'Efficiency improvement project', 'ORG001'),
('CTRT-F-2024-010', 'Generator Stator Rewind', 'PT Toshiba Infrastructure Indonesia', 'EPC Projects', 'F', 'Generator', 'PLTG Cilegon', '2024-10-12', 28000000000, 23520000000, 'Finalized', 15, 'Complete stator rewinding', 'ORG001'),
('CTRT-F-2024-011', 'Diesel Generator 20MW', 'PT Wartsila Indonesia', 'EPC Projects', 'F', 'Mesin Diesel', 'PLTD Kupang', '2024-11-08', 42000000000, 34650000000, 'Finalized', 24, 'Reciprocating engine plant', 'ORG001'),
('CTRT-F-2025-001', 'Containerized Power Rental', 'PT APR Energy Indonesia', 'EPC Projects', 'F', 'Sewa Mesin Pembangkit', 'Emergency Supply', '2025-01-15', 15000000000, 12750000000, 'Active', 18, 'Fast-track power 75MW', 'ORG001'),
('CTRT-F-2025-002', 'Distribution Transformer Fleet', 'PT Unindo', 'EPC Projects', 'F', 'Transformator', 'Regional Grid', '2025-02-10', 38000000000, 31350000000, 'Active', 24, '100 units of 20kV transformers', 'ORG001'),
('CTRT-F-2025-003', 'Kaplan Turbine Package', 'PT Voith Hydro Indonesia', 'EPC Projects', 'F', 'Turbine Air', 'PLTA Asahan', '2025-03-12', 72000000000, 57600000000, 'Active', 30, 'Low-head turbine installation', 'ORG001'),
('CTRT-F-2025-004', 'Aeroderivative Gas Turbine', 'PT Siemens Energy Indonesia', 'EPC Projects', 'F', 'Turbine Gas', 'PLTG Cilegon', '2025-04-15', 220000000000, 176000000000, 'Active', 36, 'SGT-800 gas turbine', 'ORG001'),
('CTRT-F-2025-005', 'Condensing Steam Turbine', 'PT Doosan Heavy Industries', 'EPC Projects', 'F', 'Turbine Uap', 'PLTU Suralaya', '2025-05-10', 110000000000, 88000000000, 'Active', 30, '300MW steam turbine unit', 'ORG001'),
('CTRT-F-2025-006', 'Wind Farm EPC 150MW', 'PT Vestas Indonesia', 'EPC Projects', 'F', 'Project EPC', 'PLTB Sidrap Phase 2', '2025-06-15', 380000000000, 304000000000, 'Active', 36, 'Onshore wind project', 'ORG001');

-- Populate monthly aggregates
INSERT INTO fact_procurement_savings_monthly (
  year, month, month_name, actual_savings, projected_savings,
  contracts_finalized, average_savings_percentage, organization_id
)
SELECT
  EXTRACT(YEAR FROM award_date)::integer as year,
  EXTRACT(MONTH FROM award_date)::integer as month,
  TO_CHAR(award_date, 'Mon') as month_name,
  SUM(savings_amount) as actual_savings,
  SUM(savings_amount * 0.9) as projected_savings,
  COUNT(*) as contracts_finalized,
  AVG(savings_percentage) as average_savings_percentage,
  organization_id
FROM fact_procurement_savings_contract
WHERE contract_status IN ('Finalized', 'Completed')
  AND award_date >= '2023-11-01'
GROUP BY EXTRACT(YEAR FROM award_date), EXTRACT(MONTH FROM award_date), TO_CHAR(award_date, 'Mon'), organization_id
ORDER BY year, month
ON CONFLICT (year, month, organization_id) DO UPDATE
SET
  actual_savings = EXCLUDED.actual_savings,
  projected_savings = EXCLUDED.projected_savings,
  contracts_finalized = EXCLUDED.contracts_finalized,
  average_savings_percentage = EXCLUDED.average_savings_percentage;

-- Verification query
DO $$
DECLARE
  total_contracts INTEGER;
  category_a_count INTEGER;
  category_f_count INTEGER;
  total_savings NUMERIC;
BEGIN
  SELECT COUNT(*) INTO total_contracts FROM fact_procurement_savings_contract WHERE organization_id = 'ORG001';
  SELECT COUNT(*) INTO category_a_count FROM fact_procurement_savings_contract WHERE main_category = 'A';
  SELECT COUNT(*) INTO category_f_count FROM fact_procurement_savings_contract WHERE main_category = 'F';
  SELECT SUM(savings_amount) INTO total_savings FROM fact_procurement_savings_contract WHERE contract_status = 'Finalized';

  RAISE NOTICE 'Total contracts created: %', total_contracts;
  RAISE NOTICE 'Category A contracts: %', category_a_count;
  RAISE NOTICE 'Category F contracts: %', category_f_count;
  RAISE NOTICE 'Total savings (Finalized): IDR %', total_savings;
END $$;
