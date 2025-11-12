/*
  # AI Bundling Demo - Procurement Requests Mock Data

  1. Purpose
    - Populate fact_procurement_request table with 15 diverse procurement requests
    - Designed to naturally form 4-6 logical bundles based on AI criteria
    - Demonstrates vendor consolidation, category matching, and delivery alignment

  2. Mock Data Distribution
    - 5 requests from Siemens Energy (Mechanical/Electrical) - Bundle 1
    - 3 requests from KSB Pumps (Mechanical) - Bundle 2
    - 4 requests from ABB Electrical (Electrical/Instrumentation) - Bundle 3
    - 3 requests from Various Civil contractors (Civil) - Bundle 4
    
  3. Bundling Criteria Coverage
    - Vendor consolidation opportunities
    - Category and type matching
    - Delivery schedule alignment (within 30 days)
    - Geographic proximity (same plants)
    - Spend leverage scenarios
*/

-- Delete existing demo data if any
DELETE FROM fact_procurement_request WHERE id LIKE 'PR-DEMO-%';

-- Insert Siemens Energy Mechanical/Electrical Bundle (High-value CAPEX)
INSERT INTO fact_procurement_request (
  id, title, category, requestor, amount, status, priority, due_date,
  description, vendor, quantity, delivery_location, estimated_price,
  organization_id, created_at, updated_at
) VALUES
-- PR-001: Turbine Blade Assembly - Plant A
('PR-DEMO-001', 'Turbine Blade Assembly for Steam Turbine Unit 3', 'Mechanical', 'Plant A - Power Generation',
 'Rp 12,500,000,000', 'Pending Approval', 'high', '2025-06-15',
 'High-performance turbine blades for 150MW steam turbine retrofit. Material: Inconel 718 with thermal barrier coating. Critical for Unit 3 overhaul project.',
 'Siemens Energy', '12 units', 'Plant A - Cilegon', 12500000000,
 'default-org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- PR-002: Generator Rotor - Plant A  
('PR-DEMO-002', 'Generator Rotor Core Replacement', 'Mechanical', 'Plant A - Power Generation',
 'Rp 9,250,000,000', 'Pending Approval', 'high', '2025-06-20',
 'Complete generator rotor core assembly for 150MW unit. Includes laminations, windings, and balancing. Synchronized delivery with turbine overhaul.',
 'Siemens Energy', '2 units', 'Plant A - Cilegon', 9250000000,
 'default-org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- PR-003: High Voltage Transformer - Plant B
('PR-DEMO-003', '150kV Power Transformer Upgrade', 'Electrical', 'Plant B - Electrical',
 'Rp 8,500,000,000', 'Pending Approval', 'high', '2025-06-25',
 'Step-up transformer 150kV/20kV, 200MVA capacity. Oil-immersed with on-load tap changer. Part of grid connection modernization.',
 'Siemens Energy', '3 units', 'Plant B - Labuan', 8500000000,
 'default-org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- PR-004: Control Panel System - Plant A
('PR-DEMO-004', 'Distributed Control System (DCS) Panels', 'Electrical', 'Plant A - Power Generation',
 'Rp 6,600,000,000', 'Pending Approval', 'medium', '2025-06-18',
 'Siemens PCS 7 DCS control panels for turbine monitoring and protection. Includes redundant controllers, I/O modules, and HMI workstations.',
 'Siemens Energy', '5 panels', 'Plant A - Cilegon', 6600000000,
 'default-org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- PR-005: Emergency Power Unit - Plant B
('PR-DEMO-005', 'Emergency Diesel Generator Set', 'Mechanical', 'Plant B - Electrical',
 'Rp 5,750,000,000', 'Pending Approval', 'medium', '2025-06-22',
 '2.5MW emergency diesel generator with automatic transfer switch. Provides backup power for critical systems during grid outage.',
 'Siemens Energy', '4 units', 'Plant B - Labuan', 5750000000,
 'default-org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert KSB Pumps Mechanical Bundle (Medium-value OPEX)
INSERT INTO fact_procurement_request (
  id, title, category, requestor, amount, status, priority, due_date,
  description, vendor, quantity, delivery_location, estimated_price,
  organization_id, created_at, updated_at
) VALUES
-- PR-006: Feedwater Pump - Plant C
('PR-DEMO-006', 'High-Pressure Feedwater Pump System', 'Mechanical', 'Plant C - Water Treatment',
 'Rp 5,300,000,000', 'Pending Approval', 'medium', '2025-05-10',
 'Multi-stage centrifugal pumps rated 250 bar, 180 m³/h. Includes mechanical seals, coupling, and vibration monitoring. For boiler feedwater system.',
 'KSB', '8 units', 'Plant C - Suralaya', 5300000000,
 'default-org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- PR-007: Circulation Pump System - Plant C
('PR-DEMO-007', 'Cooling Water Circulation Pumps', 'Mechanical', 'Plant C - Water Treatment',
 'Rp 4,100,000,000', 'Pending Approval', 'medium', '2025-05-15',
 'Large capacity circulation pumps for condenser cooling system. Flow rate 50,000 m³/h, head 15m. Bronze impeller for seawater service.',
 'KSB', '6 units', 'Plant C - Suralaya', 4100000000,
 'default-org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- PR-008: Boiler Feed Pump - Plant D
('PR-DEMO-008', 'Boiler Feedwater Pump Replacement', 'Mechanical', 'Plant D - Steam Generation',
 'Rp 4,700,000,000', 'Pending Approval', 'high', '2025-05-12',
 'Critical boiler feed pump for 300MW coal-fired unit. Vertical multi-stage design, 300 bar discharge pressure. Emergency procurement for failed pump.',
 'KSB', '4 units', 'Plant D - Paiton', 4700000000,
 'default-org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert ABB Electrical/Instrumentation Bundle (CAPEX)
INSERT INTO fact_procurement_request (
  id, title, category, requestor, amount, status, priority, due_date,
  description, vendor, quantity, delivery_location, estimated_price,
  organization_id, created_at, updated_at
) VALUES
-- PR-009: Variable Frequency Drives - Plant E
('PR-DEMO-009', 'Variable Frequency Drive Package', 'Electrical', 'Plant E - Automation',
 'Rp 7,000,000,000', 'Pending Approval', 'medium', '2025-07-05',
 'ABB ACS880 VFD systems 0.75kW to 250kW range. For motor speed control of auxiliary systems including fans, pumps, and conveyors. Energy efficiency upgrade.',
 'ABB', '15 units', 'Plant E - Tanjung Jati', 7000000000,
 'default-org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- PR-010: SCADA System Upgrade - Plant E
('PR-DEMO-010', 'Plant-wide SCADA System Modernization', 'Instrumentation', 'Plant E - Automation',
 'Rp 9,800,000,000', 'Pending Approval', 'high', '2025-07-08',
 'ABB Ability System 800xA SCADA platform upgrade. Includes servers, network infrastructure, operator stations, and system integration. 3-year support contract.',
 'ABB', '1 system', 'Plant E - Tanjung Jati', 9800000000,
 'default-org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- PR-011: Instrumentation Sensors - Plant A
('PR-DEMO-011', 'Smart Instrumentation Sensor Package', 'Instrumentation', 'Plant A - Power Generation',
 'Rp 5,300,000,000', 'Pending Approval', 'medium', '2025-07-10',
 'ABB intelligent pressure, temperature, and flow transmitters with HART protocol. Digital sensors for improved accuracy and remote diagnostics capability.',
 'ABB', '50 units', 'Plant A - Cilegon', 5300000000,
 'default-org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- PR-012: Motor Control Centers - Plant E
('PR-DEMO-012', 'Low Voltage Motor Control Centers', 'Electrical', 'Plant E - Automation',
 'Rp 5,600,000,000', 'Pending Approval', 'medium', '2025-07-06',
 'ABB MNS motor control centers for auxiliary motor management. Includes circuit breakers, soft starters, protection relays, and PLC integration.',
 'ABB', '8 panels', 'Plant E - Tanjung Jati', 5600000000,
 'default-org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Civil Works Bundle (Various vendors, same category)
INSERT INTO fact_procurement_request (
  id, title, category, requestor, amount, status, priority, due_date,
  description, vendor, quantity, delivery_location, estimated_price,
  organization_id, created_at, updated_at
) VALUES
-- PR-013: Foundation Reinforcement - Plant B
('PR-DEMO-013', 'Turbine Foundation Reinforcement Work', 'Civil', 'Plant B - Electrical',
 'Rp 8,200,000,000', 'Pending Approval', 'high', '2025-04-20',
 'Structural reinforcement of turbine-generator foundation. Includes seismic retrofit, crack repair, and grouting. Critical path item for overhaul project.',
 'PT Waskita Karya', '1 project', 'Plant B - Labuan', 8200000000,
 'default-org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- PR-014: Concrete Structural Work - Plant D
('PR-DEMO-014', 'Coal Storage Facility Expansion', 'Civil', 'Plant D - Steam Generation',
 'Rp 6,500,000,000', 'Pending Approval', 'medium', '2025-04-25',
 'Concrete construction for covered coal storage expansion. 5,000m² additional capacity. Includes foundation, walls, roof structure, and drainage.',
 'PT Adhi Karya', '1 project', 'Plant D - Paiton', 6500000000,
 'default-org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- PR-015: Steel Structure Framework - Plant C
('PR-DEMO-015', 'Cooling Tower Steel Structure Replacement', 'Civil', 'Plant C - Water Treatment',
 'Rp 7,800,000,000', 'Pending Approval', 'medium', '2025-04-22',
 'Replace corroded steel framework for cooling tower. Hot-dip galvanized structural steel, bolted connections. Design load: wind 150 km/h, seismic zone 4.',
 'PT Wijaya Karya', '1 project', 'Plant C - Suralaya', 7800000000,
 'default-org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

/*
  Summary Statistics:
  - Total Requests: 15
  - Total Value: 116.9 Billion IDR (~$7.8M USD)
  - Expected AI Bundles: 4
  
  Bundle 1 - Siemens Energy (Vendor Consolidation):
    5 requests, 42.6 Bn IDR, June 15-25, 2025
    Categories: Mechanical + Electrical
    Locations: Plant A (Cilegon) + Plant B (Labuan)
    Rationale: Same vendor enables volume pricing, synchronized project delivery
    
  Bundle 2 - KSB Pumps (Vendor + Category):
    3 requests, 14.1 Bn IDR, May 10-15, 2025  
    Category: Mechanical (Pumps)
    Locations: Plant C (Suralaya) + Plant D (Paiton)
    Rationale: Same supplier and equipment type, similar delivery schedule
    
  Bundle 3 - ABB Automation (Vendor + Technical Similarity):
    4 requests, 27.7 Bn IDR, July 5-10, 2025
    Categories: Electrical + Instrumentation
    Location: Primarily Plant E (Tanjung Jati) + Plant A
    Rationale: Integrated automation solution from single vendor
    
  Bundle 4 - Civil Construction (Category + Timeline):
    3 requests, 22.5 Bn IDR, April 20-25, 2025
    Category: Civil Works
    Locations: Plant B, C, D (Different regions)
    Rationale: Same work category, aligned schedules enable contractor efficiency
    
  Expected Benefits:
  - Potential Savings: ~14 Bn IDR (12% bundling discount)
  - Tender Reduction: 15 → 4 (73% reduction, saves ~165 days)
  - Administrative Efficiency: ~88 hours saved
*/
