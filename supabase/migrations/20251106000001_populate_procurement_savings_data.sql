/*
  # Populate Procurement Savings Sample Data

  1. Finalized Contracts (48 contracts)
    - Diverse categories: EPC Projects, Capital Equipment, MRO, Consulting Services
    - Business units across Indonesia Power operations
    - Award dates spanning last 12 months
    - Savings percentages ranging from 3% to 22%
    - Mix of high-value and standard procurements

  2. Pipeline Contracts (12 contracts)
    - Various pipeline statuses
    - Target savings projections
    - Expected award dates in coming months

  3. Monthly Trend Data (12 months)
    - Actual vs projected savings by month
    - Progressive improvement trend
*/

-- Insert finalized procurement savings contracts
INSERT INTO fact_procurement_savings_contract (
  contract_id, contract_name, supplier_name, category, business_unit,
  award_date, owner_estimate, final_contract_value, contract_status,
  contract_duration_months, notes
) VALUES
-- January 2025 Awards
('PSC-2025-001', 'Boiler Tube Replacement - PLTU Suralaya', 'PT Krakatau Steel', 'MRO', 'Generation Unit 1', '2025-01-15', 8500000000, 7225000000, 'Finalized', 6, 'Volume consolidation achieved 15% savings'),
('PSC-2025-002', 'SCADA System Upgrade - Regional Control', 'PT Schneider Electric Indonesia', 'IT & Technology', 'Engineering & IT', '2025-01-20', 12000000000, 10200000000, 'Finalized', 12, 'Strategic sourcing with OEM partnership'),
('PSC-2025-003', 'Turbine Blade Inspection Services', 'PT United Tractors', 'Consulting Services', 'Generation Unit 3', '2025-01-25', 3200000000, 2848000000, 'Finalized', 4, 'Competitive bidding resulted in 11% savings'),

-- February 2025 Awards
('PSC-2025-004', 'Solar Panel Procurement Phase 1', 'PT LG Energy Indonesia', 'Capital Equipment', 'Renewable Energy', '2025-02-10', 95000000000, 76000000000, 'Finalized', 18, 'Bulk procurement discount 20% achieved'),
('PSC-2025-005', 'Annual Facility Management Contract', 'PT ISS Indonesia', 'Facility Management', 'Corporate Services', '2025-02-14', 8500000000, 7650000000, 'Finalized', 12, 'Multi-year contract negotiation'),
('PSC-2025-006', 'Conveyor Belt Replacement - Coal Handling', 'PT Continental Belting', 'MRO', 'Generation Unit 2', '2025-02-18', 5400000000, 4860000000, 'Finalized', 3, 'Alternative supplier evaluation'),
('PSC-2025-007', 'Environmental Compliance Audit', 'PT SGS Indonesia', 'Professional Services', 'HSE & Compliance', '2025-02-22', 1800000000, 1620000000, 'Finalized', 6, 'Negotiated scope optimization'),

-- March 2025 Awards
('PSC-2025-008', 'EPC Contract - 50MW Solar Farm', 'PT Wika Energi', 'EPC Projects', 'Renewable Energy', '2025-03-05', 650000000000, 533000000000, 'Finalized', 24, 'Competitive tender with 18% savings'),
('PSC-2025-009', 'Fire Suppression System Upgrade', 'PT Tyco Indonesia', 'Capital Equipment', 'Generation Unit 1', '2025-03-12', 18000000000, 15300000000, 'Finalized', 8, 'Value engineering collaboration'),
('PSC-2025-010', 'Coal Quality Testing Services', 'PT Surveyor Indonesia', 'Consulting Services', 'Fuel Management', '2025-03-15', 2500000000, 2175000000, 'Finalized', 12, 'Service level renegotiation'),
('PSC-2025-011', 'Cooling Tower Maintenance', 'PT Brentwood Industries', 'MRO', 'Generation Unit 4', '2025-03-20', 6800000000, 5984000000, 'Finalized', 5, 'Preventive maintenance optimization'),

-- April 2025 Awards
('PSC-2025-012', 'Wind Turbine Nacelle Components', 'PT Vestas Indonesia', 'Capital Equipment', 'Renewable Energy', '2025-04-08', 120000000000, 100800000000, 'Finalized', 15, 'Direct OEM negotiation 16% discount'),
('PSC-2025-013', 'Plant Safety Training Program', 'PT SafetyFirst Indonesia', 'Professional Services', 'HSE & Compliance', '2025-04-12', 1200000000, 1080000000, 'Finalized', 12, 'Volume-based pricing achieved'),
('PSC-2025-014', 'Transformer Oil Replacement', 'PT Shell Indonesia', 'MRO', 'Transmission', '2025-04-18', 4500000000, 3915000000, 'Finalized', 2, 'Bulk order consolidation'),
('PSC-2025-015', 'Data Center Cooling Upgrade', 'PT APC by Schneider', 'IT & Technology', 'Engineering & IT', '2025-04-25', 25000000000, 21250000000, 'Finalized', 10, 'Energy efficiency focus reduced cost'),

-- May 2025 Awards
('PSC-2025-016', 'Emergency Generator Procurement', 'PT Cummins Indonesia', 'Capital Equipment', 'Generation Support', '2025-05-05', 38000000000, 32680000000, 'Finalized', 6, 'Strategic supplier relationship'),
('PSC-2025-017', 'Chimney Stack Inspection & Repair', 'PT Intraco Penta', 'MRO', 'Generation Unit 3', '2025-05-10', 9500000000, 8170000000, 'Finalized', 4, 'Competitive bidding process'),
('PSC-2025-018', 'ISO 50001 Energy Management Consulting', 'PT TUV Rheinland', 'Consulting Services', 'HSE & Compliance', '2025-05-15', 2200000000, 1980000000, 'Finalized', 8, 'Scope rationalization'),
('PSC-2025-019', 'Battery Storage System - 10MWh', 'PT Tesla Energy Indonesia', 'Capital Equipment', 'Renewable Energy', '2025-05-22', 180000000000, 147600000000, 'Finalized', 18, 'Technology partnership discount 18%'),

-- June 2025 Awards
('PSC-2025-020', 'Coal Crusher Spare Parts', 'PT FLSmidth Indonesia', 'MRO', 'Fuel Handling', '2025-06-03', 7200000000, 6336000000, 'Finalized', 3, 'Multi-year framework agreement'),
('PSC-2025-021', 'Plant Network Infrastructure Upgrade', 'PT Cisco Systems Indonesia', 'IT & Technology', 'Engineering & IT', '2025-06-10', 32000000000, 27200000000, 'Finalized', 12, 'Strategic technology partnership'),
('PSC-2025-022', 'Water Treatment Chemical Supply', 'PT Nalco Indonesia', 'MRO', 'Water Management', '2025-06-15', 15000000000, 13050000000, 'Finalized', 12, 'Volume commitment pricing'),
('PSC-2025-023', 'Environmental Impact Assessment', 'PT Golder Associates', 'Professional Services', 'HSE & Compliance', '2025-06-20', 3800000000, 3306000000, 'Finalized', 6, 'Competitive selection process'),

-- July 2025 Awards
('PSC-2025-024', 'EPC Contract - Substation Expansion', 'PT ABB Indonesia', 'EPC Projects', 'Transmission', '2025-07-05', 280000000000, 229600000000, 'Finalized', 20, 'Design optimization savings 18%'),
('PSC-2025-025', 'Industrial Valves Procurement', 'PT Flowserve Indonesia', 'Capital Equipment', 'Generation Unit 2', '2025-07-12', 22000000000, 18920000000, 'Finalized', 8, 'Standardization initiative'),
('PSC-2025-026', 'Predictive Maintenance Software', 'PT GE Digital Indonesia', 'IT & Technology', 'Asset Management', '2025-07-18', 45000000000, 38250000000, 'Finalized', 36, 'SaaS model negotiation'),
('PSC-2025-027', 'Ash Handling System Overhaul', 'PT Gammon Indonesia', 'MRO', 'Generation Unit 1', '2025-07-25', 28000000000, 24360000000, 'Finalized', 5, 'Engineering value analysis'),

-- August 2025 Awards
('PSC-2025-028', 'Solar Inverter Procurement', 'PT SMA Solar Indonesia', 'Capital Equipment', 'Renewable Energy', '2025-08-08', 55000000000, 46750000000, 'Finalized', 12, 'Competitive tender 15% savings'),
('PSC-2025-029', 'Compressed Air System Upgrade', 'PT Atlas Copco Indonesia', 'Capital Equipment', 'Generation Support', '2025-08-15', 18500000000, 16095000000, 'Finalized', 6, 'Energy efficiency design'),
('PSC-2025-030', 'Plant Security Services', 'PT Securitas Indonesia', 'Professional Services', 'Corporate Services', '2025-08-20', 12000000000, 10680000000, 'Finalized', 24, 'Multi-year contract savings'),
('PSC-2025-031', 'Instrumentation Calibration Services', 'PT Endress+Hauser', 'MRO', 'Instrumentation', '2025-08-25', 4200000000, 3738000000, 'Finalized', 12, 'Framework agreement benefits'),

-- September 2025 Awards
('PSC-2025-032', 'Wind Farm Access Road Construction', 'PT Waskita Karya', 'EPC Projects', 'Renewable Energy', '2025-09-05', 85000000000, 70550000000, 'Finalized', 10, 'Competitive bidding 17% savings'),
('PSC-2025-033', 'DCS System Upgrade', 'PT Yokogawa Indonesia', 'IT & Technology', 'Generation Unit 4', '2025-09-12', 68000000000, 58480000000, 'Finalized', 14, 'Technology refresh program'),
('PSC-2025-034', 'Boiler Inspection Services', 'PT Lloyd Register', 'Consulting Services', 'Generation Unit 2', '2025-09-18', 2800000000, 2464000000, 'Finalized', 4, 'Preferred supplier agreement'),
('PSC-2025-035', 'Electrical Cables & Accessories', 'PT Kabel Indonesia', 'MRO', 'Electrical Maintenance', '2025-09-25', 16000000000, 14080000000, 'Finalized', 6, 'Bulk procurement savings'),

-- October 2025 Awards
('PSC-2025-036', 'Battery Management System', 'PT Siemens Indonesia', 'Capital Equipment', 'Renewable Energy', '2025-10-08', 42000000000, 35700000000, 'Finalized', 12, 'System integration benefits 15%'),
('PSC-2025-037', 'Crane Maintenance Services', 'PT Konecranes Indonesia', 'MRO', 'Material Handling', '2025-10-15', 8800000000, 7744000000, 'Finalized', 12, 'Annual contract optimization'),
('PSC-2025-038', 'Cyber Security Assessment', 'PT Deloitte Indonesia', 'Professional Services', 'Engineering & IT', '2025-10-20', 5500000000, 4785000000, 'Finalized', 6, 'Scope-focused engagement'),
('PSC-2025-039', 'Heat Exchanger Overhaul', 'PT Alfa Laval Indonesia', 'MRO', 'Generation Unit 3', '2025-10-28', 19000000000, 16340000000, 'Finalized', 4, 'Refurbishment vs new decision'),

-- November 2025 Awards
('PSC-2025-040', 'Smart Metering Infrastructure', 'PT Landis+Gyr Indonesia', 'IT & Technology', 'Transmission', '2025-11-05', 75000000000, 63750000000, 'Finalized', 18, 'Large-scale deployment discount'),
('PSC-2025-041', 'Industrial Lubricants Supply', 'PT Shell Lubricants', 'MRO', 'Generation Support', '2025-11-12', 11000000000, 9790000000, 'Finalized', 12, 'Annual supply agreement'),
('PSC-2025-042', 'Plant Performance Optimization Study', 'PT Bechtel Indonesia', 'Consulting Services', 'Generation Unit 1', '2025-11-18', 8500000000, 7395000000, 'Finalized', 8, 'Performance-based pricing'),
('PSC-2025-043', 'Substation Transformer Procurement', 'PT Unindo', 'Capital Equipment', 'Transmission', '2025-11-25', 95000000000, 80750000000, 'Finalized', 10, 'Competitive tender 15% savings'),

-- December 2025 Awards (Recent)
('PSC-2025-044', 'Emergency Response Equipment', 'PT Caterpillar Indonesia', 'Capital Equipment', 'Generation Support', '2025-12-05', 24000000000, 20640000000, 'Finalized', 5, 'Equipment standardization'),
('PSC-2025-045', 'Wastewater Treatment Upgrade', 'PT Veolia Indonesia', 'EPC Projects', 'Water Management', '2025-12-10', 125000000000, 103750000000, 'Finalized', 15, 'Design-build approach 17% savings'),
('PSC-2025-046', 'Plant Modernization Consulting', 'PT McKinsey Indonesia', 'Professional Services', 'Strategy & Planning', '2025-12-15', 15000000000, 13200000000, 'Finalized', 6, 'Value-based fee structure'),
('PSC-2025-047', 'Diesel Fuel Supply Contract', 'PT Pertamina', 'MRO', 'Fuel Management', '2025-12-20', 85000000000, 76500000000, 'Finalized', 12, 'Volume-based pricing 10% savings'),
('PSC-2025-048', 'Hydrogen Pilot Project Equipment', 'PT Air Products Indonesia', 'Capital Equipment', 'Innovation Lab', '2025-12-28', 180000000000, 147600000000, 'Finalized', 20, 'Early adopter advantage 18%');

-- Insert pipeline contracts (forecasted opportunities)
INSERT INTO ref_procurement_savings_pipeline (
  contract_reference, contract_name, category, business_unit,
  estimated_value, target_savings_percentage, expected_award_date,
  pipeline_status, probability_percentage, lead_negotiator, notes
) VALUES
('PIP-2026-001', 'Advanced Metering Infrastructure - Phase 2', 'IT & Technology', 'Transmission', 95000000000, 14, '2026-01-20', 'In Negotiation', 85, 'Dimas Prastio', 'Leveraging Phase 1 learnings'),
('PIP-2026-002', 'Geothermal Plant EPC Contract', 'EPC Projects', 'Renewable Energy', 850000000000, 16, '2026-02-15', 'Awaiting Approval', 75, 'Jefferson Soesetyo', 'Board approval pending'),
('PIP-2026-003', 'Fleet Management System', 'IT & Technology', 'Corporate Services', 28000000000, 12, '2026-01-30', 'Under Technical Review', 80, 'Intan Pratiwi', 'Technical specifications finalization'),
('PIP-2026-004', 'Industrial 3D Printing Equipment', 'Capital Equipment', 'Innovation Lab', 45000000000, 18, '2026-02-28', 'In Negotiation', 70, 'Bambang Sutrisno', 'Technology partnership discussions'),
('PIP-2026-005', 'Carbon Capture System Pilot', 'Capital Equipment', 'Innovation Lab', 220000000000, 15, '2026-03-15', 'Pending Budget', 65, 'Siti Nurhaliza', 'Grant funding application'),
('PIP-2026-006', 'Drone Inspection Services', 'Professional Services', 'Asset Management', 12000000000, 10, '2026-01-25', 'Vendor Selection', 90, 'Dimas Prastio', 'Shortlisted to 3 vendors'),
('PIP-2026-007', 'AI-Powered Predictive Analytics', 'IT & Technology', 'Engineering & IT', 38000000000, 13, '2026-02-10', 'In Negotiation', 75, 'Jefferson Soesetyo', 'POC successfully completed'),
('PIP-2026-008', 'Mobile Substation Units', 'Capital Equipment', 'Transmission', 125000000000, 14, '2026-03-05', 'Awaiting Approval', 80, 'Intan Pratiwi', 'Emergency preparedness initiative'),
('PIP-2026-009', 'Biodiversity Impact Assessment', 'Professional Services', 'HSE & Compliance', 8500000000, 9, '2026-01-18', 'Under Technical Review', 85, 'Bambang Sutrisno', 'Regulatory requirement'),
('PIP-2026-010', 'Solar Panel Recycling Facility', 'EPC Projects', 'Renewable Energy', 165000000000, 17, '2026-04-01', 'In Negotiation', 70, 'Siti Nurhaliza', 'Circular economy initiative'),
('PIP-2026-011', 'Blockchain Supply Chain Platform', 'IT & Technology', 'Procurement', 22000000000, 11, '2026-02-20', 'Vendor Selection', 75, 'Dimas Prastio', 'Digital transformation project'),
('PIP-2026-012', 'Green Hydrogen Electrolyzer', 'Capital Equipment', 'Innovation Lab', 320000000000, 19, '2026-05-01', 'Pending Budget', 60, 'Jefferson Soesetyo', 'Strategic partnership exploration');

-- Insert monthly trend data (last 12 months)
INSERT INTO fact_procurement_savings_monthly (year, month, month_name, actual_savings, projected_savings, contracts_finalized, average_savings_percentage) VALUES
(2025, 1, 'Jan', 3423000000, 3100000000, 3, 14.1),
(2025, 2, 'Feb', 4870000000, 4200000000, 4, 13.5),
(2025, 3, 'Mar', 5915000000, 5500000000, 4, 15.2),
(2025, 4, 'Apr', 7244000000, 6800000000, 4, 14.8),
(2025, 5, 'May', 8956000000, 8200000000, 4, 16.3),
(2025, 6, 'Jun', 6792000000, 6500000000, 4, 13.1),
(2025, 7, 'Jul', 9830000000, 9200000000, 4, 16.9),
(2025, 8, 'Aug', 6985000000, 7100000000, 4, 13.7),
(2025, 9, 'Sep', 8554000000, 8000000000, 4, 15.4),
(2025, 10, 'Oct', 7221000000, 7500000000, 4, 14.2),
(2025, 11, 'Nov', 9005000000, 8800000000, 4, 15.8),
(2025, 12, 'Dec', 10850000000, 10500000000, 4, 17.1);
