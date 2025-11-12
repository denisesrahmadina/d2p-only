/*
  # Update Category Strategy Procurement Requests - 10 Categories Structure

  1. Data Reorganization
    - Clear existing procurement request data
    - Insert 50 new procurement requests organized into exactly 10 categories
    - Each category contains exactly 5 items

  2. Category Structure (10 categories with 5 items each):
    - Mechanical Equipment: Turbines, Generators, Pumps, Valves, Heat Exchangers
    - Electrical Equipment: Transformers, Switchgear, Circuit Breakers, Control Panels, Cables
    - Civil Works: Concrete, Rebar, Structural Steel, Pipes/Fittings, Insulation
    - Instrumentation & Control: Sensors, Control Systems, DCS Equipment, PLCs, Monitoring Tools
    - Spare Parts & Maintenance: Filters, Gaskets/Seals, Lubricants, Bearings, Tools
    - Fuel & Combustion: Coal, Burners, Fuel Handling Equipment, Storage Systems, Emission Controls
    - Safety & Environmental: Fire Protection, Environmental Monitoring, Wastewater Treatment, Safety Equipment, Compliance Tools
    - Engineering & Design: CAD Licenses, Technical Documentation, Design Services, Consulting, Training
    - Consumables: PPE, Cleaning Supplies, Office Materials, Chemicals, Utilities
    - IT & Communication: Networking Equipment, Communication Systems, Servers, Software, Security Systems

  3. Dataset Configuration
    - DATASET_A: Coal-fired power plant equipment focus
    - Organization: ORG001 (Indonesia Power)
    - Currency: Indonesian Rupiah (Rp)
    - Priority distribution: Mix of High, Medium, Low
    - Due dates: Q1-Q2 2025

  4. Important Notes
    - Realistic power plant equipment with industry-standard pricing in Rupiah
    - Coal-focused for Fuel & Combustion category as per requirements
    - Each item has proper material code, description, and requestor assignment
*/

-- Clear existing data for DATASET_A to ensure clean state
DELETE FROM fact_category_strategy_procurement_request
WHERE dataset_id = 'DATASET_A' AND organization_id = 'ORG001';

-- Insert Mechanical Equipment (5 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('Steam Turbine - High Pressure', 'ME-TURB-001', 'Mechanical Equipment', 2, 'Unit', 45000000000, 'High pressure steam turbine for 500MW coal-fired power generation unit', 'Budi Santoso', 'High', '2025-03-15', 'DATASET_A', 'ORG001'),
('Synchronous Generator - 500MW', 'ME-GEN-001', 'Mechanical Equipment', 2, 'Unit', 55000000000, 'Synchronous generator 500MW, 50Hz, hydrogen-cooled for coal plant', 'Rina Kusuma', 'High', '2025-03-20', 'DATASET_A', 'ORG001'),
('Boiler Feed Water Pump', 'ME-PUMP-001', 'Mechanical Equipment', 4, 'Unit', 3500000000, 'High pressure boiler feed water pump, 1200 m³/hr capacity', 'Dedi Prasetyo', 'High', '2025-04-10', 'DATASET_A', 'ORG001'),
('Main Steam Control Valve', 'ME-VALVE-001', 'Mechanical Equipment', 8, 'Unit', 950000000, 'Main steam control valve, 600mm diameter, high temperature rated', 'Ahmad Rahman', 'Medium', '2025-04-25', 'DATASET_A', 'ORG001'),
('Heat Exchanger - Regenerative', 'ME-HX-001', 'Mechanical Equipment', 6, 'Unit', 2800000000, 'Regenerative heat exchanger for feedwater heating system', 'Sari Dewi', 'Medium', '2025-05-15', 'DATASET_A', 'ORG001');

-- Insert Electrical Equipment (5 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('Power Transformer - 500kV', 'EE-TRANS-001', 'Electrical Equipment', 3, 'Unit', 42000000000, 'Step-up power transformer 500kV, 300MVA, oil-immersed for grid connection', 'Indra Wijaya', 'High', '2025-03-10', 'DATASET_A', 'ORG001'),
('Gas Insulated Switchgear', 'EE-GIS-001', 'Electrical Equipment', 1, 'Set', 125000000000, 'Complete GIS system 500kV for main substation with control system', 'Budi Santoso', 'High', '2025-04-05', 'DATASET_A', 'ORG001'),
('Circuit Breaker - 500kV SF6', 'EE-CB-001', 'Electrical Equipment', 8, 'Unit', 5500000000, 'SF6 gas circuit breaker 500kV, 63kA interrupting capacity', 'Ahmad Rahman', 'High', '2025-04-15', 'DATASET_A', 'ORG001'),
('Motor Control Center Panel', 'EE-MCC-001', 'Electrical Equipment', 12, 'Panel', 850000000, 'Low voltage MCC panel with VFD drives, 400V auxiliary power', 'Sari Dewi', 'Medium', '2025-05-05', 'DATASET_A', 'ORG001'),
('Power Cable - XLPE 500kV', 'EE-CABLE-001', 'Electrical Equipment', 3000, 'Meter', 22000000, 'XLPE insulated underground power cable 500kV, copper conductor', 'Rina Kusuma', 'Medium', '2025-05-20', 'DATASET_A', 'ORG001');

-- Insert Civil Works (5 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('High-Strength Concrete K-500', 'CW-CONC-001', 'Civil Works', 8000, 'Cubic Meter', 2800000, 'Ready-mix high-strength concrete K-500 for turbine and boiler foundation', 'Dedi Prasetyo', 'High', '2025-03-05', 'DATASET_A', 'ORG001'),
('Steel Reinforcement Bar', 'CW-REBAR-001', 'Civil Works', 1200, 'Ton', 18000000, 'Deformed steel rebar various diameters for concrete reinforcement', 'Indra Wijaya', 'High', '2025-03-12', 'DATASET_A', 'ORG001'),
('Structural Steel Framework', 'CW-STEEL-001', 'Civil Works', 650, 'Ton', 38000000, 'Heavy structural steel for turbine building and coal handling structure', 'Budi Santoso', 'High', '2025-03-25', 'DATASET_A', 'ORG001'),
('Steam Piping System', 'CW-PIPE-001', 'Civil Works', 4000, 'Meter', 8500000, 'High pressure steam piping with insulation, main steam and reheat lines', 'Ahmad Rahman', 'Medium', '2025-04-20', 'DATASET_A', 'ORG001'),
('Thermal Insulation Material', 'CW-INSUL-001', 'Civil Works', 15000, 'Square Meter', 450000, 'High-temperature ceramic fiber insulation for boiler and piping', 'Sari Dewi', 'Low', '2025-06-01', 'DATASET_A', 'ORG001');

-- Insert Instrumentation & Control (5 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('Temperature Sensor - RTD Pt100', 'IC-TEMP-001', 'Instrumentation & Control', 150, 'Unit', 8500000, 'RTD temperature sensor Pt100 for boiler and turbine monitoring', 'Rina Kusuma', 'Medium', '2025-04-10', 'DATASET_A', 'ORG001'),
('Distributed Control System', 'IC-DCS-001', 'Instrumentation & Control', 1, 'System', 12500000000, 'Complete DCS system for 500MW coal plant automation and control', 'Dedi Prasetyo', 'High', '2025-03-20', 'DATASET_A', 'ORG001'),
('DCS Control Module', 'IC-DCS-002', 'Instrumentation & Control', 25, 'Unit', 185000000, 'DCS controller modules with I/O cards for plant-wide control', 'Indra Wijaya', 'High', '2025-03-30', 'DATASET_A', 'ORG001'),
('Programmable Logic Controller', 'IC-PLC-001', 'Instrumentation & Control', 18, 'Unit', 165000000, 'Industrial PLC system for auxiliary equipment automation', 'Budi Santoso', 'Medium', '2025-04-25', 'DATASET_A', 'ORG001'),
('Plant Monitoring System', 'IC-MON-001', 'Instrumentation & Control', 1, 'System', 2800000000, 'Integrated monitoring system with sensors for emissions and performance', 'Ahmad Rahman', 'Medium', '2025-05-10', 'DATASET_A', 'ORG001');

-- Insert Spare Parts & Maintenance (5 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('Air Filter Cartridges', 'SP-FILT-001', 'Spare Parts & Maintenance', 200, 'Unit', 2500000, 'High-efficiency air filter cartridges for combustion air intake system', 'Sari Dewi', 'Medium', '2025-04-15', 'DATASET_A', 'ORG001'),
('Turbine Seal Gaskets', 'SP-SEAL-001', 'Spare Parts & Maintenance', 100, 'Set', 15000000, 'High-temperature gasket and seal kit for steam turbine maintenance', 'Rina Kusuma', 'High', '2025-03-18', 'DATASET_A', 'ORG001'),
('Industrial Lubricating Oil', 'SP-LUBE-001', 'Spare Parts & Maintenance', 50000, 'Liter', 185000, 'Synthetic turbine oil ISO VG 46 for bearing lubrication system', 'Dedi Prasetyo', 'Medium', '2025-04-30', 'DATASET_A', 'ORG001'),
('Precision Bearing Set', 'SP-BEAR-001', 'Spare Parts & Maintenance', 24, 'Set', 125000000, 'Heavy-duty roller bearings for turbine and generator shaft support', 'Indra Wijaya', 'High', '2025-03-22', 'DATASET_A', 'ORG001'),
('Maintenance Tool Kit', 'SP-TOOL-001', 'Spare Parts & Maintenance', 15, 'Set', 85000000, 'Specialized tool set for turbine and boiler maintenance operations', 'Budi Santoso', 'Low', '2025-06-10', 'DATASET_A', 'ORG001');

-- Insert Fuel & Combustion (5 items - Coal focused)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('Bituminous Coal - High Grade', 'FC-COAL-001', 'Fuel & Combustion', 500000, 'Ton', 1850000, 'High-grade bituminous coal, 6000 kcal/kg, low sulfur content for boiler', 'Ahmad Rahman', 'High', '2025-03-08', 'DATASET_A', 'ORG001'),
('Coal Burner Assembly', 'FC-BURN-001', 'Fuel & Combustion', 16, 'Unit', 1250000000, 'Low-NOx coal burner system with flame stabilization for pulverized coal', 'Sari Dewi', 'High', '2025-03-28', 'DATASET_A', 'ORG001'),
('Coal Conveyor System', 'FC-CONV-001', 'Fuel & Combustion', 2, 'System', 8500000000, 'Belt conveyor system for coal handling from storage to mill bunkers', 'Rina Kusuma', 'High', '2025-04-12', 'DATASET_A', 'ORG001'),
('Coal Storage Silo', 'FC-STOR-001', 'Fuel & Combustion', 4, 'Unit', 4200000000, 'Concrete coal storage silo, 5000 ton capacity with reclaim system', 'Dedi Prasetyo', 'Medium', '2025-05-08', 'DATASET_A', 'ORG001'),
('Flue Gas Desulfurization Unit', 'FC-FGD-001', 'Fuel & Combustion', 1, 'System', 185000000000, 'Wet limestone FGD system for SO2 emission control, 99% efficiency', 'Indra Wijaya', 'High', '2025-04-18', 'DATASET_A', 'ORG001');

-- Insert Safety & Environmental (5 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('Fire Detection & Alarm System', 'SE-FIRE-001', 'Safety & Environmental', 1, 'System', 3500000000, 'Addressable fire detection system with automatic alarm for entire plant', 'Budi Santoso', 'High', '2025-03-15', 'DATASET_A', 'ORG001'),
('Continuous Emission Monitor', 'SE-CEMS-001', 'Safety & Environmental', 2, 'System', 4500000000, 'CEMS for NOx, SO2, CO2, and particulate matter monitoring', 'Ahmad Rahman', 'High', '2025-03-25', 'DATASET_A', 'ORG001'),
('Wastewater Treatment Plant', 'SE-WWTP-001', 'Safety & Environmental', 1, 'System', 25000000000, 'Industrial wastewater treatment plant 500 m³/hr for process water', 'Sari Dewi', 'High', '2025-04-22', 'DATASET_A', 'ORG001'),
('Emergency Response Equipment', 'SE-SAFE-001', 'Safety & Environmental', 1, 'Set', 2800000000, 'Complete emergency response equipment: fire trucks, ambulance, rescue gear', 'Rina Kusuma', 'Medium', '2025-05-12', 'DATASET_A', 'ORG001'),
('Environmental Compliance Software', 'SE-COMP-001', 'Safety & Environmental', 50, 'License', 45000000, 'Environmental monitoring and compliance reporting software system', 'Dedi Prasetyo', 'Low', '2025-06-05', 'DATASET_A', 'ORG001');

-- Insert Engineering & Design (5 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('CAD Software Licenses', 'ED-CAD-001', 'Engineering & Design', 25, 'License', 85000000, 'Professional 3D CAD software licenses for plant design and modification', 'Indra Wijaya', 'Medium', '2025-04-08', 'DATASET_A', 'ORG001'),
('Technical Documentation Package', 'ED-DOC-001', 'Engineering & Design', 1, 'Package', 1500000000, 'Complete technical documentation: drawings, manuals, procedures', 'Budi Santoso', 'High', '2025-03-12', 'DATASET_A', 'ORG001'),
('Plant Design Services', 'ED-DES-001', 'Engineering & Design', 12, 'Month', 450000000, 'Specialized engineering design services for plant optimization project', 'Ahmad Rahman', 'Medium', '2025-04-20', 'DATASET_A', 'ORG001'),
('Technical Consulting Services', 'ED-CONS-001', 'Engineering & Design', 6, 'Month', 850000000, 'Expert consulting for efficiency improvement and reliability enhancement', 'Sari Dewi', 'Medium', '2025-05-15', 'DATASET_A', 'ORG001'),
('Operator Training Program', 'ED-TRAIN-001', 'Engineering & Design', 100, 'Person', 35000000, 'Comprehensive operator training program for coal plant operations', 'Rina Kusuma', 'High', '2025-03-30', 'DATASET_A', 'ORG001');

-- Insert Consumables (5 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('Personal Protection Equipment', 'CO-PPE-001', 'Consumables', 500, 'Set', 4500000, 'Complete PPE set: helmet, safety shoes, gloves, glasses, harness', 'Dedi Prasetyo', 'High', '2025-03-18', 'DATASET_A', 'ORG001'),
('Industrial Cleaning Supplies', 'CO-CLEAN-001', 'Consumables', 2000, 'Set', 850000, 'Industrial cleaning supplies for equipment and facility maintenance', 'Indra Wijaya', 'Low', '2025-05-25', 'DATASET_A', 'ORG001'),
('Office Supplies Package', 'CO-OFFICE-001', 'Consumables', 12, 'Month', 25000000, 'Monthly office supplies for operations and administration staff', 'Budi Santoso', 'Low', '2025-04-15', 'DATASET_A', 'ORG001'),
('Water Treatment Chemicals', 'CO-CHEM-001', 'Consumables', 50000, 'Kilogram', 125000, 'Boiler water treatment chemicals: phosphate, hydrazine, pH control', 'Ahmad Rahman', 'Medium', '2025-04-05', 'DATASET_A', 'ORG001'),
('Utilities & Services', 'CO-UTIL-001', 'Consumables', 6, 'Month', 850000000, 'Utilities and services: electricity, water, internet, waste disposal', 'Sari Dewi', 'Medium', '2025-04-28', 'DATASET_A', 'ORG001');

-- Insert IT & Communication (5 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('Industrial Network Switch', 'IT-SWITCH-001', 'IT & Communication', 35, 'Unit', 125000000, 'Managed industrial ethernet switch with redundancy and VLAN support', 'Rina Kusuma', 'High', '2025-03-22', 'DATASET_A', 'ORG001'),
('Plant Communication System', 'IT-COMM-001', 'IT & Communication', 1, 'System', 2500000000, 'Integrated communication system: radio, telephone, PA, emergency alert', 'Dedi Prasetyo', 'High', '2025-04-02', 'DATASET_A', 'ORG001'),
('Industrial Server - Redundant', 'IT-SERVER-001', 'IT & Communication', 8, 'Unit', 285000000, 'High-availability industrial servers for SCADA, DCS, and historians', 'Indra Wijaya', 'High', '2025-03-28', 'DATASET_A', 'ORG001'),
('Plant Management Software', 'IT-SOFT-001', 'IT & Communication', 100, 'License', 65000000, 'Integrated plant management software: ERP, maintenance, inventory', 'Budi Santoso', 'Medium', '2025-04-18', 'DATASET_A', 'ORG001'),
('Cybersecurity System', 'IT-CYBER-001', 'IT & Communication', 1, 'System', 5500000000, 'Industrial cybersecurity platform with IDS/IPS, firewall, and SIEM', 'Ahmad Rahman', 'High', '2025-03-08', 'DATASET_A', 'ORG001');
