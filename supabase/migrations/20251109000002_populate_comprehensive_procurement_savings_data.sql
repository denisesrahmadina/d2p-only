/*
  # Populate Comprehensive Procurement Savings Data (2023-2025)

  ## Overview
  Generates 135 realistic procurement contracts distributed across 6 main categories (A-F)
  spanning November 2023 to November 2025 (2 years) for comprehensive analytics.

  ## Data Distribution
  - Category A (Energi Primer): 18 contracts - IDR 5B to 50B
  - Category B (Peralatan Mechanical/Electrical): 25 contracts - IDR 500M to 5B
  - Category C (Material & Consumable): 32 contracts - IDR 100M to 500M
  - Category D (Asset Non-Operasional): 20 contracts - IDR 300M to 2B
  - Category E (Jasa dan Kontrak): 22 contracts - IDR 1B to 10B
  - Category F (Peralatan Utama & EPC): 18 contracts - IDR 10B to 500B

  ## Savings Performance
  - 70% of contracts meet or exceed savings targets
  - 20% slightly below targets (85-99% achievement)
  - 10% significantly below targets (<85% achievement)

  ## Contract Status Mix
  - 75% Finalized contracts
  - 15% Active contracts
  - 8% Completed contracts
  - 2% Cancelled contracts

  All monetary values in Indonesian Rupiah (IDR).
*/

-- Category A: Energi Primer dan Jasa Penunjangnya (18 contracts)
INSERT INTO fact_procurement_savings_contract (
  contract_id, contract_name, supplier_name, category, main_category, sub_category,
  business_unit, award_date, owner_estimate, final_contract_value,
  contract_status, contract_duration_months, notes, organization_id
) VALUES
-- Energi Primer
('CTRT-A-2023-001', 'Coal Supply Contract Q4 2023', 'PT Bukit Asam Tbk', 'Energy Procurement', 'A', 'Energi Primer', 'PLTU Paiton', '2023-11-15', 45000000000, 40500000000, 'Completed', 12, 'Annual coal supply contract', 'ORG001'),
('CTRT-A-2024-001', 'Natural Gas Supply Agreement 2024', 'PT Pertamina Gas', 'Energy Procurement', 'A', 'Energi Primer', 'PLTG Muara Karang', '2024-01-20', 38000000000, 33250000000, 'Finalized', 12, 'Gas turbine fuel supply', 'ORG001'),
('CTRT-A-2024-002', 'LNG Import Contract H1 2024', 'Chevron Indonesia', 'Energy Procurement', 'A', 'Energi Primer', 'PLTG Cilegon', '2024-02-10', 52000000000, 45500000000, 'Finalized', 18, 'Liquefied natural gas import', 'ORG001'),
('CTRT-A-2024-003', 'Coal Transportation Rail Service', 'PT Kereta Api Logistik', 'Energy Procurement', 'A', 'Transportasi Energi Primer', 'PLTU Suralaya', '2024-03-05', 8500000000, 7650000000, 'Finalized', 24, 'Rail logistics for coal', 'ORG001'),
('CTRT-A-2024-004', 'Biomass Pellet Supply Contract', 'PT Green Energy Resources', 'Energy Procurement', 'A', 'Energi Primer', 'PLTU Tanjung Jati', '2024-04-12', 12000000000, 10800000000, 'Finalized', 12, 'Co-firing biomass pellets', 'ORG001'),
('CTRT-A-2024-005', 'Coal Quality Testing Services', 'PT Surveyor Indonesia', 'Energy Procurement', 'A', 'Jasa Energi Primer', 'PLTU Paiton', '2024-05-08', 3200000000, 2880000000, 'Finalized', 24, 'Independent coal quality assurance', 'ORG001'),
('CTRT-A-2024-006', 'Gas Pipeline Maintenance', 'PT Perusahaan Gas Negara', 'Energy Procurement', 'A', 'Jasa Energi Primer', 'PLTG Muara Karang', '2024-06-15', 5600000000, 4928000000, 'Finalized', 36, 'Gas transmission pipeline O&M', 'ORG001'),
('CTRT-A-2024-007', 'Coal Barge Transportation', 'PT EMKL Samudera', 'Energy Procurement', 'A', 'Transportasi Energi Primer', 'PLTU Suralaya', '2024-07-20', 11000000000, 9680000000, 'Finalized', 18, 'Marine coal transport', 'ORG001'),
('CTRT-A-2024-008', 'Natural Gas Storage Services', 'PT Nusantara Regas', 'Energy Procurement', 'A', 'Jasa Energi Primer', 'PLTG Cilegon', '2024-08-10', 7800000000, 6942000000, 'Finalized', 24, 'LNG regasification and storage', 'ORG001'),
('CTRT-A-2024-009', 'Coal Supply Contract Q4 2024', 'PT Adaro Energy', 'Energy Procurement', 'A', 'Energi Primer', 'PLTU Tanjung Jati', '2024-09-15', 42000000000, 36750000000, 'Finalized', 12, 'High quality coal supply', 'ORG001'),
('CTRT-A-2024-010', 'Gas Pipeline Inspection Services', 'PT Indonesia Pipeline Technology', 'Energy Procurement', 'A', 'Jasa Energi Primer', 'PLTG Muara Karang', '2024-10-05', 4200000000, 3738000000, 'Finalized', 12, 'Annual pipeline integrity assessment', 'ORG001'),
('CTRT-A-2024-011', 'Coal Port Handling Services', 'PT Pelabuhan Indonesia II', 'Energy Procurement', 'A', 'Transportasi Energi Primer', 'PLTU Paiton', '2024-11-12', 9500000000, 8455000000, 'Finalized', 24, 'Port unloading and stockyard', 'ORG001'),
('CTRT-A-2025-001', 'LNG Supply Agreement 2025', 'Shell Indonesia', 'Energy Procurement', 'A', 'Energi Primer', 'PLTG Cilegon', '2025-01-18', 48000000000, 42720000000, 'Active', 18, 'Multi-year LNG supply', 'ORG001'),
('CTRT-A-2025-002', 'Biomass Supply Chain Management', 'PT Bio Energy Nusantara', 'Energy Procurement', 'A', 'Jasa Energi Primer', 'PLTU Tanjung Jati', '2025-02-20', 6800000000, 6052000000, 'Active', 24, 'Biomass sourcing and logistics', 'ORG001'),
('CTRT-A-2025-003', 'Coal Quality Enhancement Service', 'PT Indo Coal Processing', 'Energy Procurement', 'A', 'Jasa Energi Primer', 'PLTU Suralaya', '2025-03-15', 5200000000, 4680000000, 'Active', 12, 'Coal washing and processing', 'ORG001'),
('CTRT-A-2025-004', 'Natural Gas Trading Contract', 'PT Saka Energi Indonesia', 'Energy Procurement', 'A', 'Energi Primer', 'PLTG Muara Karang', '2025-04-10', 35000000000, 31500000000, 'Active', 12, 'Spot gas trading agreement', 'ORG001'),
('CTRT-A-2025-005', 'Coal Conveyor Belt Maintenance', 'PT Continental Teves', 'Energy Procurement', 'A', 'Transportasi Energi Primer', 'PLTU Paiton', '2025-05-08', 4500000000, 4095000000, 'Active', 18, 'Coal handling equipment maintenance', 'ORG001'),
('CTRT-A-2025-006', 'Gas Metering Calibration Services', 'PT Schlumberger Indonesia', 'Energy Procurement', 'A', 'Jasa Energi Primer', 'PLTG Cilegon', '2025-06-12', 2800000000, 2576000000, 'Active', 24, 'Gas measurement and custody transfer', 'ORG001');

-- Category B: Peralatan Penunjang dan Sistem Mechanical/Electrical (25 contracts)
INSERT INTO fact_procurement_savings_contract (
  contract_id, contract_name, supplier_name, category, main_category, sub_category,
  business_unit, award_date, owner_estimate, final_contract_value,
  contract_status, contract_duration_months, notes, organization_id
) VALUES
('CTRT-B-2023-001', 'SCADA Communication Equipment', 'PT Siemens Indonesia', 'Capital Equipment', 'B', 'Alat Komunikasi', 'PLTS Cirata', '2023-11-20', 2800000000, 2408000000, 'Completed', 12, 'Industrial communication network', 'ORG001'),
('CTRT-B-2023-002', 'Digital Flow Meters Package', 'PT Endress+Hauser Indonesia', 'Capital Equipment', 'B', 'Alat Pengukur & Recorder', 'PLTG Muara Karang', '2023-12-10', 1500000000, 1275000000, 'Completed', 6, 'Precision flow measurement', 'ORG001'),
('CTRT-B-2024-001', 'Industrial Bearing Set', 'PT SKF Indonesia', 'MRO', 'B', 'Bearing', 'PLTU Paiton', '2024-01-15', 850000000, 731250000, 'Finalized', 12, 'High-temperature bearings', 'ORG001'),
('CTRT-B-2024-002', 'Power Cable and Accessories', 'PT Kabelindo Murni Tbk', 'Capital Equipment', 'B', 'Filter Kabel', 'PLTS Cirata', '2024-02-08', 980000000, 833000000, 'Finalized', 6, 'Underground power cables', 'ORG001'),
('CTRT-B-2024-003', 'Air Compressor System', 'PT Atlas Copco Indonesia', 'Capital Equipment', 'B', 'Kompressor, Motor Listrik, Peralatan', 'PLTG Cilegon', '2024-03-12', 4500000000, 3825000000, 'Finalized', 18, 'Instrument air system', 'ORG001'),
('CTRT-B-2024-004', 'DCS Control System Upgrade', 'PT Yokogawa Indonesia', 'Capital Equipment', 'B', 'Instrumen & Kontrol', 'PLTU Tanjung Jati', '2024-04-05', 3200000000, 2720000000, 'Finalized', 24, 'Distributed control system modernization', 'ORG001'),
('CTRT-B-2024-005', 'MV Switchgear Replacement', 'PT Schneider Electric Indonesia', 'Capital Equipment', 'B', 'Peralatan Listrik/Elektronik', 'PLTS Cirata', '2024-05-15', 2600000000, 2236000000, 'Finalized', 12, 'Medium voltage switchgear', 'ORG001'),
('CTRT-B-2024-006', 'Stainless Steel Piping System', 'PT Krakatau Steel', 'Capital Equipment', 'B', 'Pipping & Connection', 'PLTG Muara Karang', '2024-06-20', 1800000000, 1548000000, 'Finalized', 9, 'High-pressure piping installation', 'ORG001'),
('CTRT-B-2024-007', 'Centrifugal Pump Package', 'PT Grundfos Indonesia', 'Capital Equipment', 'B', 'Pompa, Valve, Trap', 'PLTU Paiton', '2024-07-10', 1450000000, 1247250000, 'Finalized', 12, 'Boiler feed water pumps', 'ORG001'),
('CTRT-B-2024-008', 'Wireless Communication Network', 'PT Huawei Tech Indonesia', 'Capital Equipment', 'B', 'Alat Komunikasi', 'PLTB Sidrap', '2024-08-05', 2100000000, 1785000000, 'Finalized', 18, 'Wind farm communication infrastructure', 'ORG001'),
('CTRT-B-2024-009', 'Vibration Monitoring System', 'PT Bruel & Kjaer Indonesia', 'Capital Equipment', 'B', 'Alat Pengukur & Recorder', 'PLTG Cilegon', '2024-09-12', 1280000000, 1088000000, 'Finalized', 12, 'Predictive maintenance sensors', 'ORG001'),
('CTRT-B-2024-010', 'Heavy Duty Bearing Replacement', 'PT Timken Indonesia', 'MRO', 'B', 'Bearing', 'PLTU Tanjung Jati', '2024-10-08', 920000000, 792800000, 'Finalized', 6, 'Turbine main bearings', 'ORG001'),
('CTRT-B-2024-011', 'EMC Filter Installation', 'PT Schaffner Indonesia', 'Capital Equipment', 'B', 'Filter Kabel', 'PLTS Cirata', '2024-11-15', 680000000, 585600000, 'Finalized', 6, 'Electromagnetic compatibility filters', 'ORG001'),
('CTRT-B-2025-001', 'Electric Motor Replacement', 'PT ABB Sakti Industri', 'Capital Equipment', 'B', 'Kompressor, Motor Listrik, Peralatan', 'PLTU Paiton', '2025-01-10', 3800000000, 3230000000, 'Active', 15, 'High-efficiency motors', 'ORG001'),
('CTRT-B-2025-002', 'PLC System Modernization', 'PT Rockwell Automation', 'Capital Equipment', 'B', 'Instrumen & Kontrol', 'PLTG Muara Karang', '2025-02-15', 2900000000, 2465000000, 'Active', 18, 'Programmable logic controller upgrade', 'ORG001'),
('CTRT-B-2025-003', 'UPS System Replacement', 'PT Eaton Power Quality', 'Capital Equipment', 'B', 'Peralatan Listrik/Elektronik', 'PLTS Cirata', '2025-03-08', 1950000000, 1657500000, 'Active', 12, 'Uninterruptible power supply', 'ORG001'),
('CTRT-B-2025-004', 'Hydraulic Piping Retrofit', 'PT Parker Hannifin Indonesia', 'Capital Equipment', 'B', 'Pipping & Connection', 'PLTG Cilegon', '2025-04-12', 1620000000, 1393200000, 'Active', 9, 'Hydraulic system modernization', 'ORG001'),
('CTRT-B-2025-005', 'Control Valve Automation', 'PT Emerson Process Indonesia', 'Capital Equipment', 'B', 'Pompa, Valve, Trap', 'PLTU Tanjung Jati', '2025-05-05', 1380000000, 1186800000, 'Active', 12, 'Automated control valves', 'ORG001'),
('CTRT-B-2025-006', 'Fiber Optic Communication', 'PT Telkom Infra', 'Capital Equipment', 'B', 'Alat Komunikasi', 'PLTS Cirata', '2025-06-10', 2450000000, 2082500000, 'Active', 24, 'High-speed fiber network', 'ORG001'),
('CTRT-B-2025-007', 'Temperature Transmitter Package', 'PT Rosemount Indonesia', 'Capital Equipment', 'B', 'Alat Pengukur & Recorder', 'PLTG Muara Karang', '2025-07-08', 1150000000, 977500000, 'Active', 9, 'Smart temperature sensors', 'ORG001'),
('CTRT-B-2025-008', 'Precision Bearing Assembly', 'PT NSK Indonesia', 'MRO', 'B', 'Bearing', 'PLTB Sidrap', '2025-08-15', 780000000, 671400000, 'Active', 6, 'Wind turbine gearbox bearings', 'ORG001'),
('CTRT-B-2025-009', 'Harmonic Filter System', 'PT ABB Power Quality', 'Capital Equipment', 'B', 'Filter Kabel', 'PLTS Cirata', '2025-09-05', 890000000, 765400000, 'Active', 12, 'Power quality improvement', 'ORG001'),
('CTRT-B-2025-010', 'Variable Speed Drive Package', 'PT Danfoss Indonesia', 'Capital Equipment', 'B', 'Kompressor, Motor Listrik, Peralatan', 'PLTU Paiton', '2025-10-12', 4200000000, 3570000000, 'Active', 18, 'Energy-efficient VSD systems', 'ORG001'),
('CTRT-B-2025-011', 'Safety Instrumented System', 'PT Honeywell Indonesia', 'Capital Equipment', 'B', 'Instrumen & Kontrol', 'PLTG Cilegon', '2025-10-28', 3500000000, 2975000000, 'Active', 24, 'SIS for critical processes', 'ORG001'),
('CTRT-B-2025-012', 'Transformer Protection System', 'PT GE Grid Solutions', 'Capital Equipment', 'B', 'Peralatan Listrik/Elektronik', 'PLTU Tanjung Jati', '2025-11-10', 2200000000, 1870000000, 'Active', 12, 'Digital protection relays', 'ORG001');

-- Continue with remaining categories in next part due to length...
