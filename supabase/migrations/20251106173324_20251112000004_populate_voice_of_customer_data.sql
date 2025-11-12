/*
  # Populate Voice of Customer - Vendor Performance Data

  1. Data Population
    - Insert vendor performance scores for multiple categories
    - Include vendors in all performance categories (Green, Yellow, Red, Black)
    - Insert detailed performance issues with root causes
    - Link issues to specific units and departments

  2. Categories Covered
    - Renewable Energy Equipment (CAT-RENEW-001)
    - Mechanical Equipment (CAT-MECH-001)
    - Electrical Equipment (CAT-ELEC-001)
*/

-- Populate Vendor Performance Scores for Renewable Energy Equipment (CAT-RENEW-001)
INSERT INTO fact_vendor_performance_scores (
  category_code, vendor_id, vendor_name,
  procurement_score, quality_delivery_score, responsiveness_score, reliability_score, compliance_score,
  total_weighted_score, performance_category,
  evaluation_period, total_evaluations, last_evaluation_date
) VALUES
-- Green Vendors (60-100)
('CAT-RENEW-001', 'V-RENEW-001', 'Vestas Wind Systems',
 88, 92, 85, 90, 95,
 90.35, 'Green',
 '2025 Q3-Q4', 24, '2025-11-01'),

('CAT-RENEW-001', 'V-RENEW-002', 'Siemens Gamesa',
 82, 85, 90, 88, 92,
 87.50, 'Green',
 '2025 Q3-Q4', 22, '2025-10-28'),

('CAT-RENEW-001', 'V-RENEW-003', 'Goldwind',
 75, 78, 72, 80, 85,
 78.15, 'Green',
 '2025 Q3-Q4', 18, '2025-10-25'),

('CAT-RENEW-001', 'V-RENEW-004', 'Envision Energy',
 70, 75, 68, 73, 80,
 73.85, 'Green',
 '2025 Q3-Q4', 16, '2025-10-20'),

-- Yellow Vendors (20-60)
('CAT-RENEW-001', 'V-RENEW-005', 'Nordex SE',
 55, 48, 52, 58, 60,
 53.70, 'Yellow',
 '2025 Q3-Q4', 20, '2025-10-15'),

('CAT-RENEW-001', 'V-RENEW-006', 'Mingyang Smart Energy',
 45, 42, 48, 50, 55,
 47.15, 'Yellow',
 '2025 Q3-Q4', 14, '2025-10-10'),

('CAT-RENEW-001', 'V-RENEW-007', 'CSIC Haizhuang',
 38, 35, 40, 42, 45,
 39.65, 'Yellow',
 '2025 Q3-Q4', 12, '2025-10-05'),

-- Red Vendors (-20 to 20)
('CAT-RENEW-001', 'V-RENEW-008', 'Windtech Solutions',
 15, 8, 12, 18, 22,
 13.90, 'Red',
 '2025 Q3-Q4', 10, '2025-09-30'),

('CAT-RENEW-001', 'V-RENEW-009', 'EnergyCore Systems',
 -5, -10, 5, -8, 10,
 -3.75, 'Red',
 '2025 Q3-Q4', 8, '2025-09-25'),

-- Black Vendors (<-40)
('CAT-RENEW-001', 'V-RENEW-010', 'TurboPower Inc',
 -25, -35, -30, -40, -20,
 -32.50, 'Black',
 '2025 Q3-Q4', 6, '2025-09-20');

-- Populate Vendor Performance Scores for Mechanical Equipment (CAT-MECH-001)
INSERT INTO fact_vendor_performance_scores (
  category_code, vendor_id, vendor_name,
  procurement_score, quality_delivery_score, responsiveness_score, reliability_score, compliance_score,
  total_weighted_score, performance_category,
  evaluation_period, total_evaluations, last_evaluation_date
) VALUES
-- Green Vendors
('CAT-MECH-001', 'V-MECH-001', 'Grundfos',
 90, 88, 92, 87, 90,
 88.85, 'Green',
 '2025 Q3-Q4', 28, '2025-11-02'),

('CAT-MECH-001', 'V-MECH-002', 'Sulzer',
 85, 82, 88, 85, 87,
 84.90, 'Green',
 '2025 Q3-Q4', 25, '2025-10-30'),

('CAT-MECH-001', 'V-MECH-003', 'KSB SE',
 78, 80, 75, 82, 85,
 80.05, 'Green',
 '2025 Q3-Q4', 20, '2025-10-25'),

-- Yellow Vendors
('CAT-MECH-001', 'V-MECH-004', 'Atlas Copco',
 52, 55, 48, 58, 60,
 54.55, 'Yellow',
 '2025 Q3-Q4', 18, '2025-10-20'),

('CAT-MECH-001', 'V-MECH-005', 'Xylem Inc',
 42, 38, 45, 48, 50,
 44.05, 'Yellow',
 '2025 Q3-Q4', 15, '2025-10-15'),

-- Red Vendors
('CAT-MECH-001', 'V-MECH-006', 'PumpTech Industries',
 18, 12, 20, 15, 25,
 16.35, 'Red',
 '2025 Q3-Q4', 12, '2025-10-10'),

('CAT-MECH-001', 'V-MECH-007', 'MechFlow Systems',
 -8, -12, -5, -10, 5,
 -7.35, 'Red',
 '2025 Q3-Q4', 9, '2025-10-05'),

-- Black Vendors
('CAT-MECH-001', 'V-MECH-008', 'Industrial Pumps Ltd',
 -30, -45, -35, -42, -28,
 -38.15, 'Black',
 '2025 Q3-Q4', 7, '2025-09-28');

-- Populate Vendor Performance Scores for Electrical Equipment (CAT-ELEC-001)
INSERT INTO fact_vendor_performance_scores (
  category_code, vendor_id, vendor_name,
  procurement_score, quality_delivery_score, responsiveness_score, reliability_score, compliance_score,
  total_weighted_score, performance_category,
  evaluation_period, total_evaluations, last_evaluation_date
) VALUES
-- Green Vendors
('CAT-ELEC-001', 'V-ELEC-001', 'Schneider Electric',
 92, 90, 88, 92, 95,
 91.15, 'Green',
 '2025 Q3-Q4', 30, '2025-11-03'),

('CAT-ELEC-001', 'V-ELEC-002', 'ABB Ltd',
 87, 85, 90, 88, 90,
 87.60, 'Green',
 '2025 Q3-Q4', 27, '2025-11-01'),

('CAT-ELEC-001', 'V-ELEC-003', 'Siemens AG',
 80, 82, 85, 83, 88,
 83.25, 'Green',
 '2025 Q3-Q4', 24, '2025-10-28'),

('CAT-ELEC-001', 'V-ELEC-004', 'Eaton Corporation',
 72, 75, 70, 78, 80,
 75.35, 'Green',
 '2025 Q3-Q4', 20, '2025-10-25'),

-- Yellow Vendors
('CAT-ELEC-001', 'V-ELEC-005', 'Emerson Electric',
 58, 52, 55, 60, 62,
 56.55, 'Yellow',
 '2025 Q3-Q4', 18, '2025-10-20'),

('CAT-ELEC-001', 'V-ELEC-006', 'Rockwell Automation',
 48, 45, 50, 52, 55,
 49.65, 'Yellow',
 '2025 Q3-Q4', 16, '2025-10-15'),

-- Red Vendors
('CAT-ELEC-001', 'V-ELEC-007', 'PowerGrid Solutions',
 12, 8, 15, 18, 20,
 13.95, 'Red',
 '2025 Q3-Q4', 11, '2025-10-10'),

('CAT-ELEC-001', 'V-ELEC-008', 'ElectroTech Systems',
 -10, -15, -5, -12, 8,
 -8.55, 'Red',
 '2025 Q3-Q4', 8, '2025-10-05'),

-- Black Vendors
('CAT-ELEC-001', 'V-ELEC-009', 'Voltage Controls Inc',
 -32, -48, -38, -45, -30,
 -40.45, 'Black',
 '2025 Q3-Q4', 5, '2025-09-30');

-- Populate Vendor Performance Issues
-- Issues for Black and Red Vendors (most problematic)
INSERT INTO fact_vendor_performance_issues (
  category_code, vendor_id, vendor_name, parameter_affected,
  issue_title, issue_description,
  reporting_unit, reporting_department, reported_by,
  severity, impact_score, issue_date, resolution_status
) VALUES
-- TurboPower Inc (Black) - Renewable Energy
('CAT-RENEW-001', 'V-RENEW-010', 'TurboPower Inc', 'Quality & Delivery',
 'Critical Quality Defects in Turbine Blades',
 'Multiple turbine blade failures detected during quality inspection. 15 out of 20 blades showed micro-cracks and structural weaknesses. This resulted in complete rejection of the shipment and project delays of 6 weeks.',
 'Unit 1 - Suralaya Power Plant', 'Operations & Maintenance', 'Ahmad Santoso, O&M Manager',
 'Critical', -45, '2025-09-15', 'Escalated'),

('CAT-RENEW-001', 'V-RENEW-010', 'TurboPower Inc', 'Reliability',
 'Repeated Delivery Failures',
 'Vendor failed to meet delivery schedules on 4 consecutive orders. Average delay of 8 weeks per shipment causing cascade delays in project timeline and financial penalties totaling $2.3M.',
 'Unit 2 - Paiton Power Plant', 'Procurement', 'Siti Nurhaliza, Procurement Lead',
 'Critical', -40, '2025-08-20', 'Escalated'),

('CAT-RENEW-001', 'V-RENEW-010', 'TurboPower Inc', 'Compliance',
 'Missing Safety Certifications',
 'Equipment delivered without required ISO 9001 and IEC 61400 certifications. Documentation provided was incomplete and did not meet contractual requirements, forcing equipment quarantine.',
 'Unit 1 - Suralaya Power Plant', 'Quality Assurance', 'Budi Hartono, QA Director',
 'Critical', -35, '2025-09-01', 'In Progress'),

('CAT-RENEW-001', 'V-RENEW-010', 'TurboPower Inc', 'Responsiveness',
 'Poor Communication and Support',
 'Vendor consistently unresponsive to technical queries and support requests. Average response time of 10 days compared to industry standard of 24-48 hours. Multiple escalations required.',
 'Unit 3 - Labuan Power Plant', 'Engineering', 'Dewi Kusuma, Chief Engineer',
 'High', -30, '2025-08-15', 'Open'),

-- EnergyCore Systems (Red) - Renewable Energy
('CAT-RENEW-001', 'V-RENEW-009', 'EnergyCore Systems', 'Quality & Delivery',
 'Substandard Component Quality',
 'Inverter units failed field testing with 40% failure rate. Components did not meet specified technical parameters for voltage regulation and power factor correction.',
 'Unit 2 - Paiton Power Plant', 'Technical Services', 'Rudi Wijaya, Technical Manager',
 'High', -25, '2025-09-10', 'In Progress'),

('CAT-RENEW-001', 'V-RENEW-009', 'EnergyCore Systems', 'Reliability',
 'Inconsistent Product Quality',
 'Quality varies significantly between batches. Some deliveries meet specifications while others fall short, making inventory management and installation planning extremely difficult.',
 'Unit 1 - Suralaya Power Plant', 'Operations', 'Linda Hermawan, Operations Manager',
 'Medium', -20, '2025-08-25', 'Open'),

-- Windtech Solutions (Red) - Renewable Energy
('CAT-RENEW-001', 'V-RENEW-008', 'Windtech Solutions', 'Procurement',
 'Price Discrepancies and Hidden Costs',
 'Vendor invoiced additional charges not specified in contract. Multiple line items with unclear descriptions. Final cost 22% higher than agreed purchase order value.',
 'Corporate Procurement', 'Finance & Procurement', 'Andi Pratama, Procurement Director',
 'High', -18, '2025-09-20', 'Escalated'),

('CAT-RENEW-001', 'V-RENEW-008', 'Windtech Solutions', 'Compliance',
 'Incomplete Documentation',
 'Technical drawings, maintenance manuals, and spare parts lists incomplete or incorrect. This delays commissioning activities and increases operational risk.',
 'Unit 3 - Labuan Power Plant', 'Documentation Control', 'Maria Tan, Documentation Lead',
 'Medium', -15, '2025-09-05', 'In Progress'),

-- Industrial Pumps Ltd (Black) - Mechanical Equipment
('CAT-MECH-001', 'V-MECH-008', 'Industrial Pumps Ltd', 'Quality & Delivery',
 'Catastrophic Pump Failures',
 'Three pump units experienced catastrophic failures within first month of operation. Root cause analysis revealed substandard materials and poor manufacturing quality control.',
 'Unit 1 - Muara Karang Plant', 'Maintenance', 'Hendra Gunawan, Maintenance Head',
 'Critical', -48, '2025-09-18', 'Escalated'),

('CAT-MECH-001', 'V-MECH-008', 'Industrial Pumps Ltd', 'Reliability',
 'Chronic Delivery Delays',
 'All six orders delayed by minimum 10 weeks. Vendor cited various excuses including material shortages, production issues, and logistical problems without proactive communication.',
 'Unit 2 - Priok Power Plant', 'Supply Chain', 'Yanto Kusuma, Supply Chain Manager',
 'Critical', -42, '2025-08-30', 'Escalated'),

('CAT-MECH-001', 'V-MECH-008', 'Industrial Pumps Ltd', 'Responsiveness',
 'No After-Sales Support',
 'Vendor completely unresponsive after delivery. Technical support requests ignored. No spare parts availability. Effectively abandoned customer post-sale.',
 'Unit 1 - Muara Karang Plant', 'Operations', 'Dian Sastro, Operations Supervisor',
 'Critical', -38, '2025-09-10', 'Escalated'),

-- MechFlow Systems (Red) - Mechanical Equipment
('CAT-MECH-001', 'V-MECH-007', 'MechFlow Systems', 'Quality & Delivery',
 'Below Specification Performance',
 'Compressor units delivered with performance 15% below guaranteed specifications. Efficiency ratings not met, impacting operational costs.',
 'Unit 3 - Tanjung Priok Plant', 'Engineering', 'Eko Prasetyo, Senior Engineer',
 'High', -22, '2025-09-15', 'In Progress'),

('CAT-MECH-001', 'V-MECH-007', 'MechFlow Systems', 'Reliability',
 'Warranty Claim Issues',
 'Vendor disputes legitimate warranty claims, creating lengthy resolution processes. Multiple failed components not honored under warranty terms.',
 'Corporate Legal', 'Legal & Compliance', 'Sarah Lestari, Legal Counsel',
 'Medium', -18, '2025-09-01', 'In Progress'),

-- Voltage Controls Inc (Black) - Electrical Equipment
('CAT-ELEC-001', 'V-ELEC-009', 'Voltage Controls Inc', 'Quality & Delivery',
 'Dangerous Electrical Faults',
 'Multiple electrical panels showed dangerous wiring faults and grounding issues. Immediate safety shutdown required. Equipment posed serious electrocution and fire risks.',
 'Unit 1 - Cilegon Plant', 'Safety & Health', 'Dr. Bambang Susilo, Safety Director',
 'Critical', -50, '2025-09-22', 'Escalated'),

('CAT-ELEC-001', 'V-ELEC-009', 'Voltage Controls Inc', 'Reliability',
 'Complete Shipment Rejection',
 'Entire shipment of 25 control panels rejected due to failing safety inspections. None met Indonesian electrical safety standards (SNI). Total loss of $850K.',
 'Unit 2 - Jakarta Plant', 'Quality Control', 'Agus Setiawan, QC Manager',
 'Critical', -45, '2025-09-12', 'Escalated'),

('CAT-ELEC-001', 'V-ELEC-009', 'Voltage Controls Inc', 'Compliance',
 'Fraudulent Certifications',
 'Vendor provided falsified safety certificates. Investigation revealed documents were forged. Legal action initiated. Vendor blacklisted pending investigation.',
 'Corporate Compliance', 'Risk & Compliance', 'Ratna Dewi, Compliance Officer',
 'Critical', -48, '2025-09-05', 'Escalated'),

-- ElectroTech Systems (Red) - Electrical Equipment
('CAT-ELEC-001', 'V-ELEC-008', 'ElectroTech Systems', 'Quality & Delivery',
 'Component Compatibility Issues',
 'Electrical components not compatible with existing systems despite specifications. Required extensive modifications and rework costing additional $120K.',
 'Unit 3 - Bekasi Plant', 'Engineering', 'Fajar Nugroho, Electrical Engineer',
 'High', -28, '2025-09-18', 'In Progress'),

('CAT-ELEC-001', 'V-ELEC-008', 'ElectroTech Systems', 'Responsiveness',
 'Poor Technical Documentation',
 'Installation and commissioning manuals inadequate. Technical support slow to respond. Delayed commissioning by 4 weeks.',
 'Unit 3 - Bekasi Plant', 'Commissioning', 'Lina Oktavia, Commissioning Lead',
 'Medium', -20, '2025-09-08', 'Open'),

-- Issues for Yellow Vendors (moderate problems)
-- Nordex SE (Yellow) - Renewable Energy
('CAT-RENEW-001', 'V-RENEW-005', 'Nordex SE', 'Quality & Delivery',
 'Occasional Quality Inconsistencies',
 'Some turbine components show minor quality variations. While within acceptable tolerances, consistency could be improved to reduce inspection time.',
 'Unit 2 - Paiton Power Plant', 'Quality Control', 'Wati Sumarno, QC Inspector',
 'Medium', -12, '2025-10-10', 'In Progress'),

('CAT-RENEW-001', 'V-RENEW-005', 'Nordex SE', 'Responsiveness',
 'Delayed Technical Responses',
 'Technical queries sometimes take 3-5 days for response instead of promised 48 hours. Not critical but impacts planning efficiency.',
 'Unit 1 - Suralaya Power Plant', 'Engineering', 'Rian Hidayat, Project Engineer',
 'Low', -8, '2025-10-05', 'Open'),

-- Atlas Copco (Yellow) - Mechanical Equipment  
('CAT-MECH-001', 'V-MECH-004', 'Atlas Copco', 'Procurement',
 'Pricing Above Market Average',
 'Vendor pricing 8-12% above market average for comparable equipment. Limited flexibility in negotiations.',
 'Corporate Procurement', 'Strategic Sourcing', 'Indra Wijaya, Category Manager',
 'Medium', -10, '2025-10-15', 'Open'),

('CAT-MECH-001', 'V-MECH-004', 'Atlas Copco', 'Reliability',
 'Lead Time Variability',
 'Delivery lead times vary significantly (6-12 weeks range). Makes project planning challenging.',
 'Unit 2 - Priok Power Plant', 'Planning', 'Nina Karlina, Planning Manager',
 'Low', -8, '2025-10-08', 'Open');
