/*
  # Populate Category Strategy Procurement Requests with Power Plant Equipment

  1. Data Population
    - Insert 50 procurement requests for power plant equipment
    - Each request represents a single material/item
    - Organized into 8 major categories:
      * Mechanical Equipment (8 items)
      * Electrical Equipment (8 items)
      * Civil Works (6 items)
      * Instrumentation and Control Systems (8 items)
      * Safety and Protection Equipment (6 items)
      * Auxiliary Systems (6 items)
      * Maintenance Equipment (4 items)
      * IT Infrastructure (4 items)

  2. Dataset Configuration
    - DATASET_A: Generation Equipment focused
    - Organization: ORG001 (Indonesia Power)

  3. Important Notes
    - Realistic power plant equipment with industry-standard pricing
    - Mix of High, Medium, and Low priority items
    - Due dates spread across Q1-Q2 2025
    - Requestors are procurement team members
*/

-- Insert Mechanical Equipment (8 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('Steam Turbine - High Pressure', 'ME-TURB-001', 'Mechanical Equipment', 2, 'Unit', 45000000000, 'High pressure steam turbine for 500MW power generation unit', 'Budi Santoso', 'High', '2025-03-15', 'DATASET_A', 'ORG001'),
('Gas Turbine - Combined Cycle', 'ME-TURB-002', 'Mechanical Equipment', 1, 'Unit', 85000000000, 'Gas turbine for combined cycle power plant, 300MW capacity', 'Ahmad Rahman', 'High', '2025-04-20', 'DATASET_A', 'ORG001'),
('Hydro Turbine - Francis Type', 'ME-TURB-003', 'Mechanical Equipment', 3, 'Unit', 25000000000, 'Francis type hydro turbine for hydroelectric power plant', 'Sari Dewi', 'Medium', '2025-05-10', 'DATASET_A', 'ORG001'),
('Generator - Synchronous 500MW', 'ME-GEN-001', 'Mechanical Equipment', 2, 'Unit', 55000000000, 'Synchronous generator 500MW, 50Hz, air-cooled', 'Rina Kusuma', 'High', '2025-03-20', 'DATASET_A', 'ORG001'),
('Cooling Water Pump', 'ME-PUMP-001', 'Mechanical Equipment', 8, 'Unit', 1500000000, 'Centrifugal cooling water pump, 5000 m³/hr capacity', 'Dedi Prasetyo', 'Medium', '2025-04-15', 'DATASET_A', 'ORG001'),
('Feedwater Pump', 'ME-PUMP-002', 'Mechanical Equipment', 6, 'Unit', 2500000000, 'High pressure feedwater pump for boiler system', 'Indra Wijaya', 'High', '2025-03-25', 'DATASET_A', 'ORG001'),
('Control Valve - Main Steam', 'ME-VALVE-001', 'Mechanical Equipment', 12, 'Unit', 850000000, 'Main steam control valve, 600mm diameter', 'Budi Santoso', 'Medium', '2025-05-20', 'DATASET_A', 'ORG001'),
('Heat Exchanger - Shell and Tube', 'ME-HX-001', 'Mechanical Equipment', 4, 'Unit', 3200000000, 'Shell and tube heat exchanger for cooling system', 'Ahmad Rahman', 'Medium', '2025-06-10', 'DATASET_A', 'ORG001');

-- Insert Electrical Equipment (8 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('Power Transformer - 500kV', 'EE-TRANS-001', 'Electrical Equipment', 3, 'Unit', 42000000000, 'Power transformer 500kV, 300MVA, oil-immersed', 'Sari Dewi', 'High', '2025-03-10', 'DATASET_A', 'ORG001'),
('Generator Step-Up Transformer', 'EE-TRANS-002', 'Electrical Equipment', 2, 'Unit', 38000000000, 'GSU transformer 500kV/22kV, 500MVA', 'Rina Kusuma', 'High', '2025-03-30', 'DATASET_A', 'ORG001'),
('Circuit Breaker - 500kV SF6', 'EE-CB-001', 'Electrical Equipment', 10, 'Unit', 5500000000, 'SF6 gas circuit breaker 500kV, 63kA rating', 'Dedi Prasetyo', 'High', '2025-04-05', 'DATASET_A', 'ORG001'),
('Gas Insulated Switchgear', 'EE-GIS-001', 'Electrical Equipment', 1, 'Set', 125000000000, 'Complete GIS system 500kV for substation', 'Indra Wijaya', 'High', '2025-05-15', 'DATASET_A', 'ORG001'),
('Motor Control Center', 'EE-MCC-001', 'Electrical Equipment', 6, 'Panel', 1200000000, 'Low voltage MCC panel with VFD, 400V', 'Budi Santoso', 'Medium', '2025-04-25', 'DATASET_A', 'ORG001'),
('Power Cable - 500kV XLPE', 'EE-CABLE-001', 'Electrical Equipment', 5000, 'Meter', 18000000, 'XLPE insulated power cable 500kV, copper conductor', 'Ahmad Rahman', 'Medium', '2025-06-01', 'DATASET_A', 'ORG001'),
('Busbar System - Aluminum', 'EE-BUS-001', 'Electrical Equipment', 1500, 'Meter', 12000000, 'Aluminum busbar 6300A, outdoor type', 'Sari Dewi', 'Medium', '2025-05-25', 'DATASET_A', 'ORG001'),
('Current Transformer - 500kV', 'EE-CT-001', 'Electrical Equipment', 24, 'Unit', 850000000, 'Current transformer 500kV for metering and protection', 'Rina Kusuma', 'Low', '2025-06-15', 'DATASET_A', 'ORG001');

-- Insert Civil Works (6 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('Reinforced Concrete Structure', 'CW-CONC-001', 'Civil Works', 5000, 'Cubic Meter', 2500000, 'Ready-mix concrete K-350 for turbine foundation', 'Dedi Prasetyo', 'High', '2025-03-05', 'DATASET_A', 'ORG001'),
('Structural Steel Framework', 'CW-STEEL-001', 'Civil Works', 800, 'Ton', 35000000, 'Structural steel for turbine building and equipment support', 'Indra Wijaya', 'High', '2025-03-20', 'DATASET_A', 'ORG001'),
('Pipe Support System', 'CW-PIPE-001', 'Civil Works', 500, 'Set', 8500000, 'Heavy-duty pipe support and hangers for main steam line', 'Budi Santoso', 'Medium', '2025-04-10', 'DATASET_A', 'ORG001'),
('Cable Tray System', 'CW-TRAY-001', 'Civil Works', 2000, 'Meter', 1200000, 'Galvanized cable tray system for power and control cables', 'Ahmad Rahman', 'Medium', '2025-05-05', 'DATASET_A', 'ORG001'),
('Equipment Foundation Pad', 'CW-FOUND-001', 'Civil Works', 50, 'Unit', 125000000, 'Reinforced concrete foundation pads for major equipment', 'Sari Dewi', 'High', '2025-03-15', 'DATASET_A', 'ORG001'),
('Access Platform and Stairs', 'CW-PLAT-001', 'Civil Works', 30, 'Set', 45000000, 'Steel grating platform and stairs for equipment access', 'Rina Kusuma', 'Low', '2025-06-20', 'DATASET_A', 'ORG001');

-- Insert Instrumentation and Control Systems (8 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('Programmable Logic Controller', 'IC-PLC-001', 'Instrumentation and Control Systems', 15, 'Unit', 185000000, 'Industrial PLC system for power plant automation', 'Dedi Prasetyo', 'High', '2025-04-01', 'DATASET_A', 'ORG001'),
('Distributed Control System', 'IC-DCS-001', 'Instrumentation and Control Systems', 1, 'System', 12500000000, 'Complete DCS system for 500MW power plant control', 'Indra Wijaya', 'High', '2025-03-25', 'DATASET_A', 'ORG001'),
('Flow Meter - Ultrasonic', 'IC-FLOW-001', 'Instrumentation and Control Systems', 40, 'Unit', 125000000, 'Ultrasonic flow meter for water and steam measurement', 'Budi Santoso', 'Medium', '2025-04-20', 'DATASET_A', 'ORG001'),
('Pressure Transmitter', 'IC-PRES-001', 'Instrumentation and Control Systems', 80, 'Unit', 35000000, 'Smart pressure transmitter 4-20mA with HART protocol', 'Ahmad Rahman', 'Medium', '2025-05-10', 'DATASET_A', 'ORG001'),
('Temperature Sensor - RTD', 'IC-TEMP-001', 'Instrumentation and Control Systems', 120, 'Unit', 8500000, 'RTD temperature sensor Pt100, industrial grade', 'Sari Dewi', 'Low', '2025-05-15', 'DATASET_A', 'ORG001'),
('Control Valve - Pneumatic', 'IC-VALVE-001', 'Instrumentation and Control Systems', 45, 'Unit', 95000000, 'Pneumatic control valve with positioner', 'Rina Kusuma', 'Medium', '2025-04-30', 'DATASET_A', 'ORG001'),
('Level Transmitter - Radar', 'IC-LEVEL-001', 'Instrumentation and Control Systems', 30, 'Unit', 145000000, 'Radar level transmitter for tank and vessel measurement', 'Dedi Prasetyo', 'Medium', '2025-05-20', 'DATASET_A', 'ORG001'),
('Vibration Monitoring System', 'IC-VIB-001', 'Instrumentation and Control Systems', 12, 'Set', 385000000, 'Turbine and generator vibration monitoring system', 'Indra Wijaya', 'High', '2025-04-15', 'DATASET_A', 'ORG001');

-- Insert Safety and Protection Equipment (6 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('Fire Detection System', 'SP-FIRE-001', 'Safety and Protection Equipment', 1, 'System', 2800000000, 'Addressable fire detection system for entire power plant', 'Budi Santoso', 'High', '2025-03-10', 'DATASET_A', 'ORG001'),
('Gas Detection System', 'SP-GAS-001', 'Safety and Protection Equipment', 50, 'Unit', 85000000, 'Multi-gas detector for hydrogen and combustible gases', 'Ahmad Rahman', 'High', '2025-04-05', 'DATASET_A', 'ORG001'),
('Emergency Shutdown System', 'SP-ESD-001', 'Safety and Protection Equipment', 1, 'System', 4500000000, 'Redundant emergency shutdown system with SIL3 rating', 'Sari Dewi', 'High', '2025-03-20', 'DATASET_A', 'ORG001'),
('Safety Relief Valve', 'SP-SRV-001', 'Safety and Protection Equipment', 20, 'Unit', 225000000, 'Spring-loaded safety relief valve for boiler protection', 'Rina Kusuma', 'High', '2025-04-10', 'DATASET_A', 'ORG001'),
('Fire Suppression System', 'SP-SUPP-001', 'Safety and Protection Equipment', 1, 'System', 3200000000, 'Water-based fire suppression system with foam capability', 'Dedi Prasetyo', 'Medium', '2025-05-01', 'DATASET_A', 'ORG001'),
('Personal Protective Equipment', 'SP-PPE-001', 'Safety and Protection Equipment', 500, 'Set', 5500000, 'Complete PPE set including helmet, safety shoes, and harness', 'Indra Wijaya', 'Medium', '2025-04-25', 'DATASET_A', 'ORG001');

-- Insert Auxiliary Systems (6 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('HVAC System - Control Room', 'AUX-HVAC-001', 'Auxiliary Systems', 2, 'System', 1850000000, 'Precision HVAC system for control room and DCS equipment', 'Budi Santoso', 'High', '2025-04-01', 'DATASET_A', 'ORG001'),
('Water Treatment Plant', 'AUX-WATER-001', 'Auxiliary Systems', 1, 'System', 8500000000, 'Demineralized water treatment plant 100 m³/hr capacity', 'Ahmad Rahman', 'High', '2025-03-15', 'DATASET_A', 'ORG001'),
('Compressed Air System', 'AUX-AIR-001', 'Auxiliary Systems', 4, 'Unit', 950000000, 'Oil-free air compressor system for instrument air', 'Sari Dewi', 'Medium', '2025-04-20', 'DATASET_A', 'ORG001'),
('Lubrication Oil System', 'AUX-LUBE-001', 'Auxiliary Systems', 2, 'System', 2200000000, 'Centralized lubrication system for turbine and generator', 'Rina Kusuma', 'High', '2025-03-30', 'DATASET_A', 'ORG001'),
('Cooling Tower', 'AUX-COOL-001', 'Auxiliary Systems', 2, 'Unit', 15000000000, 'Mechanical draft cooling tower 50,000 m³/hr capacity', 'Dedi Prasetyo', 'High', '2025-05-10', 'DATASET_A', 'ORG001'),
('Diesel Generator - Emergency', 'AUX-GEN-001', 'Auxiliary Systems', 3, 'Unit', 3500000000, 'Emergency diesel generator 2000kVA for blackout protection', 'Indra Wijaya', 'Medium', '2025-05-15', 'DATASET_A', 'ORG001');

-- Insert Maintenance Equipment (4 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('Overhead Crane - 100 Ton', 'MT-CRANE-001', 'Maintenance Equipment', 2, 'Unit', 12500000000, 'Double girder overhead crane for turbine hall maintenance', 'Budi Santoso', 'High', '2025-04-10', 'DATASET_A', 'ORG001'),
('Portable Testing Equipment', 'MT-TEST-001', 'Maintenance Equipment', 1, 'Set', 1850000000, 'Complete electrical testing equipment set for maintenance', 'Ahmad Rahman', 'Medium', '2025-05-05', 'DATASET_A', 'ORG001'),
('Vibration Analysis Tool', 'MT-VIB-001', 'Maintenance Equipment', 5, 'Unit', 385000000, 'Portable vibration analyzer for predictive maintenance', 'Sari Dewi', 'Medium', '2025-05-20', 'DATASET_A', 'ORG001'),
('Critical Spare Parts Kit', 'MT-SPARE-001', 'Maintenance Equipment', 1, 'Set', 25000000000, 'Complete critical spare parts inventory for 500MW unit', 'Rina Kusuma', 'High', '2025-03-25', 'DATASET_A', 'ORG001');

-- Insert IT Infrastructure (4 items)
INSERT INTO fact_category_strategy_procurement_request (material_name, material_code, category, quantity, unit_of_measure, unit_price, description, requestor, priority, due_date, dataset_id, organization_id) VALUES
('SCADA System', 'IT-SCADA-001', 'IT Infrastructure', 1, 'System', 4500000000, 'Complete SCADA system for power plant monitoring and control', 'Dedi Prasetyo', 'High', '2025-03-20', 'DATASET_A', 'ORG001'),
('Network Switch - Industrial', 'IT-SWITCH-001', 'IT Infrastructure', 30, 'Unit', 125000000, 'Industrial ethernet switch with redundancy support', 'Indra Wijaya', 'Medium', '2025-04-15', 'DATASET_A', 'ORG001'),
('Server - Redundant', 'IT-SERVER-001', 'IT Infrastructure', 6, 'Unit', 285000000, 'Industrial server for DCS and SCADA with redundancy', 'Budi Santoso', 'High', '2025-03-30', 'DATASET_A', 'ORG001'),
('Cybersecurity System', 'IT-CYBER-001', 'IT Infrastructure', 1, 'System', 3800000000, 'Industrial cybersecurity system with IDS/IPS and firewall', 'Ahmad Rahman', 'High', '2025-04-05', 'DATASET_A', 'ORG001');
