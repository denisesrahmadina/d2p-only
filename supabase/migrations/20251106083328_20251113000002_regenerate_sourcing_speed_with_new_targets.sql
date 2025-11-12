/*
  # Regenerate Sourcing Speed Data with Updated Targets

  1. Purpose
    - Update existing sourcing speed data to reflect new category targets
    - Ensure Category D has comprehensive data
    - Apply realistic industry-specific timing

  2. New Targets Applied
    - Category A: 36 days (was 60)
    - Category B: 16 days (was 30-45)
    - Category C: 16 days (was 18-30)
    - Category D: 27 days (was 25-40)
    - Category E: 83 days (was 40-65)
    - Category F: 70 days (was 90-180)

  3. Performance Mix
    - Approximately 70% within target
    - 30% beyond target for realistic variance
*/

-- Delete existing sourcing speed data to regenerate
DELETE FROM procurement_sourcing_contracts;

-- Temporary function to generate dates
CREATE OR REPLACE FUNCTION gen_request_date(award_date DATE, duration_days INTEGER)
RETURNS DATE AS $$
BEGIN
  RETURN award_date - (duration_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- Category A: Energi Primer (Target 36 days) - mix 60% within, 40% beyond
INSERT INTO procurement_sourcing_contracts (contract_number, contract_name, category, main_category, sub_category, request_date, contract_signed_date, sourcing_duration_days, value_usd, status, unit_location_id, vendor_name)
VALUES
('PSC-A-001', 'Coal Supply Agreement Q1 2025', 'A', 'A', 'A-01', '2024-12-20', '2025-01-18', 29, 185000, 'Completed', 'PLTU-SUR', 'PT Bumi Energi Resources'),
('PSC-A-002', 'Natural Gas Supply 2025', 'A', 'A', 'A-02', '2024-11-22', '2024-12-25', 33, 120000, 'Completed', 'PLTG-MK', 'PT Gas Nusantara'),
('PSC-A-003', 'HSD Fuel Supply Q1', 'A', 'A', 'A-03', '2024-12-28', '2025-01-28', 31, 95000, 'Completed', 'PLTD-BPP', 'PT Pertamina Energy'),
('PSC-A-004', 'Coal Transport Services', 'A', 'A', 'A-04', '2024-11-25', '2024-12-29', 34, 45000, 'Completed', 'PLTU-SUR', 'PT Logistik Bara'),
('PSC-A-005', 'Biomass Co-firing Supply', 'A', 'A', 'A-06', '2025-01-08', '2025-02-08', 31, 38000, 'Completed', 'PLTU-LAB', 'PT Bio Energi'),
('PSC-A-006', 'Coal Supply Q2 2025', 'A', 'A', 'A-01', '2024-12-05', '2025-01-20', 46, 275000, 'Completed', 'PLTU-PAI', 'PT Energi Kalimantan'),
('PSC-A-007', 'Stockpile Management 2025', 'A', 'A', 'A-05', '2024-11-15', '2025-01-05', 51, 62000, 'Completed', 'PLTU-SUR', 'PT Stock Management'),
('PSC-A-008', 'Emergency Fuel Supply', 'A', 'A', 'A-03', '2024-12-01', '2025-01-28', 58, 48000, 'Completed', 'PLTD-KPG', 'PT Fuel Solutions'),
('PSC-A-009', 'Coal Supply Long Term', 'A', 'A', 'A-01', '2024-11-20', '2025-01-02', 43, 195000, 'Completed', 'PLTU-SUR', 'PT Coal Supply'),
('PSC-A-010', 'Gas Distribution Services', 'A', 'A', 'A-02', '2024-12-10', '2025-01-15', 36, 88000, 'Completed', 'PLTG-MK', 'PT Gas Distribution');

-- Category B: Peralatan Mekanikal (Target 16 days) - mix 75% within, 25% beyond
INSERT INTO procurement_sourcing_contracts (contract_number, contract_name, category, main_category, sub_category, request_date, contract_signed_date, sourcing_duration_days, value_usd, status, unit_location_id, vendor_name)
VALUES
('PSC-B-001', 'SCADA System Upgrade', 'B', 'B', 'B-01', '2025-01-06', '2025-01-20', 14, 85000, 'Completed', 'PLTU-SUR', 'PT Automation Tech'),
('PSC-B-002', 'Motor Listrik 500 KW', 'B', 'B', 'B-02', '2025-01-22', '2025-02-05', 14, 42000, 'Completed', 'PLTU-PAI', 'PT Electric Solutions'),
('PSC-B-003', 'HVAC System Control Room', 'B', 'B', 'B-05', '2025-01-05', '2025-01-19', 14, 68000, 'Completed', 'PLTG-MK', 'PT HVAC Indonesia'),
('PSC-B-004', 'Centrifugal Pump System', 'B', 'B', 'B-04', '2025-01-20', '2025-02-03', 14, 55000, 'Completed', 'PLTU-LAB', 'PT Pump Technology'),
('PSC-B-005', 'Safety System Upgrade', 'B', 'B', 'B-03', '2025-01-10', '2025-01-24', 14, 72000, 'Completed', 'PLTU-SUR', 'PT Safety Systems'),
('PSC-B-006', 'Conveyor Belt System', 'B', 'B', 'B-06', '2025-02-01', '2025-02-15', 14, 95000, 'Completed', 'PLTU-PAI', 'PT Material Handling'),
('PSC-B-007', 'Instrumentation Package', 'B', 'B', 'B-01', '2025-01-15', '2025-02-06', 22, 125000, 'Completed', 'PLTU-SUR', 'PT Instrumentation'),
('PSC-B-008', 'Air Compressor 150 bar', 'B', 'B', 'B-04', '2025-01-18', '2025-02-10', 23, 78000, 'Completed', 'PLTG-MK', 'PT Compressor Tech'),
('PSC-B-009', 'Control Panel Upgrade', 'B', 'B', 'B-02', '2025-01-12', '2025-01-26', 14, 52000, 'Completed', 'PLTU-LAB', 'PT Panel Systems'),
('PSC-B-010', 'Pump Package Complete', 'B', 'B', 'B-04', '2025-01-25', '2025-02-08', 14, 62000, 'Completed', 'PLTU-SUR', 'PT Hydraulic Systems'),
('PSC-B-011', 'Emergency Generator Set', 'B', 'B', 'B-02', '2025-02-05', '2025-02-19', 14, 48000, 'Completed', 'PLTG-MK', 'PT Genset Indonesia'),
('PSC-B-012', 'Crane Hoist System', 'B', 'B', 'B-06', '2025-01-28', '2025-02-11', 14, 88000, 'Completed', 'PLTU-PAI', 'PT Crane Solutions');

-- Category C: Material & Consumable (Target 16 days) - mix 70% within, 30% beyond
INSERT INTO procurement_sourcing_contracts (contract_number, contract_name, category, main_category, sub_category, request_date, contract_signed_date, sourcing_duration_days, value_usd, status, unit_location_id, vendor_name)
VALUES
('PSC-C-001', 'Mechanical Spare Parts Q1', 'C', 'C', 'C-01', '2025-01-12', '2025-01-25', 13, 125000, 'Completed', 'PLTU-SUR', 'PT Spare Parts Indo'),
('PSC-C-002', 'Electrical Spare Parts', 'C', 'C', 'C-02', '2025-01-08', '2025-01-21', 13, 98000, 'Completed', 'PLTU-PAI', 'PT Electric Parts'),
('PSC-C-003', 'Lubricants & Chemicals', 'C', 'C', 'C-03', '2025-01-15', '2025-01-28', 13, 85000, 'Completed', 'PLTU-LAB', 'PT Chemical Supply'),
('PSC-C-004', 'Office Stationery Annual', 'C', 'C', 'C-04', '2025-01-05', '2025-01-17', 12, 15000, 'Completed', 'HEAD-OFF', 'PT Office Supplies'),
('PSC-C-005', 'Safety Equipment Package', 'C', 'C', 'C-05', '2025-01-18', '2025-01-31', 13, 45000, 'Completed', 'ALL-UNITS', 'PT Safety Equipment'),
('PSC-C-006', 'Construction Materials', 'C', 'C', 'C-06', '2025-01-25', '2025-02-07', 13, 78000, 'Completed', 'PLTU-SUR', 'PT Material Bangunan'),
('PSC-C-007', 'Mechanical Spares Q2', 'C', 'C', 'C-01', '2025-02-10', '2025-02-23', 13, 95000, 'Completed', 'PLTG-MK', 'PT Components'),
('PSC-C-008', 'Chemical Package Special', 'C', 'C', 'C-03', '2025-01-22', '2025-02-15', 24, 62000, 'Completed', 'PLTU-PAI', 'PT Water Treatment'),
('PSC-C-009', 'Safety Equipment Special', 'C', 'C', 'C-05', '2025-01-12', '2025-02-08', 27, 38000, 'Completed', 'PLTU-SUR', 'PT Safety Pro'),
('PSC-C-010', 'Spare Parts Emergency', 'C', 'C', 'C-01', '2025-02-01', '2025-02-14', 13, 42000, 'Completed', 'PLTU-LAB', 'PT Fast Parts'),
('PSC-C-011', 'Electrical Components', 'C', 'C', 'C-02', '2025-01-28', '2025-02-10', 13, 55000, 'Completed', 'PLTG-MK', 'PT Electro Components'),
('PSC-C-012', 'Lubricant Package Q2', 'C', 'C', 'C-03', '2025-02-05', '2025-02-18', 13, 68000, 'Completed', 'PLTU-SUR', 'PT Oil Supply');

-- Category D: Asset Non-Operasional (Target 27 days) - mix 70% within, 30% beyond
INSERT INTO procurement_sourcing_contracts (contract_number, contract_name, category, main_category, sub_category, request_date, contract_signed_date, sourcing_duration_days, value_usd, status, unit_location_id, vendor_name)
VALUES
('PSC-D-001', 'Operational Vehicle Fleet', 'D', 'D', 'D-01', '2025-01-08', '2025-02-02', 25, 8500, 'Completed', 'HEAD-OFF', 'PT Auto Fleet'),
('PSC-D-002', 'IT Infrastructure Upgrade', 'D', 'D', 'D-02', '2025-01-05', '2025-01-30', 25, 12500, 'Completed', 'IT-DEPT', 'PT Tech Solutions'),
('PSC-D-003', 'Office Furniture Package', 'D', 'D', 'D-03', '2025-01-13', '2025-02-07', 25, 3200, 'Completed', 'HEAD-OFF', 'PT Office Furniture'),
('PSC-D-004', 'Communication Equipment', 'D', 'D', 'D-04', '2024-12-25', '2025-01-20', 26, 4800, 'Completed', 'ALL-UNITS', 'PT Radio Communication'),
('PSC-D-005', 'Laboratory Equipment', 'D', 'D', 'D-05', '2025-01-18', '2025-02-12', 25, 7500, 'Completed', 'QC-LAB', 'PT Lab Equipment'),
('PSC-D-006', 'Medical Equipment Package', 'D', 'D', 'D-06', '2025-01-08', '2025-02-03', 26, 5200, 'Completed', 'CORP-CLINIC', 'PT Medical Supply'),
('PSC-D-007', 'Laptop & Desktop 250 units', 'D', 'D', 'D-02', '2025-01-23', '2025-02-17', 25, 8900, 'Completed', 'IT-DEPT', 'PT Computer Indo'),
('PSC-D-008', 'Truck Fleet Procurement', 'D', 'D', 'D-01', '2025-01-15', '2025-02-22', 38, 12000, 'Completed', 'LOGISTICS', 'PT Heavy Vehicle'),
('PSC-D-009', 'Advanced Lab Equipment', 'D', 'D', 'D-05', '2025-01-20', '2025-03-02', 41, 9500, 'Completed', 'RD-LAB', 'PT Scientific Equipment'),
('PSC-D-010', 'Office Complex Furniture', 'D', 'D', 'D-03', '2025-01-22', '2025-03-01', 38, 6800, 'Completed', 'NEW-BUILDING', 'PT Interior Design'),
('PSC-D-011', 'Network Infrastructure', 'D', 'D', 'D-02', '2025-02-01', '2025-02-26', 25, 9200, 'Completed', 'IT-DEPT', 'PT Network Solutions'),
('PSC-D-012', 'Meeting Room Equipment', 'D', 'D', 'D-03', '2025-01-28', '2025-02-22', 25, 4500, 'Completed', 'HEAD-OFF', 'PT AV Systems'),
('PSC-D-013', 'Security Camera System', 'D', 'D', 'D-04', '2025-02-05', '2025-03-02', 25, 7800, 'Completed', 'ALL-UNITS', 'PT Security Tech');

-- Category E: Jasa & Kontrak (Target 83 days) - mix 70% within, 30% beyond
INSERT INTO procurement_sourcing_contracts (contract_number, contract_name, category, main_category, sub_category, request_date, contract_signed_date, sourcing_duration_days, value_usd, status, unit_location_id, vendor_name)
VALUES
('PSC-E-001', 'Maintenance Contract 2025', 'E', 'E', 'E-01', '2024-11-08', '2025-01-20', 73, 285000, 'Completed', 'PLTU-SUR', 'PT Maintenance Services'),
('PSC-E-002', 'Engineering Consultancy', 'E', 'E', 'E-02', '2024-11-05', '2025-01-15', 71, 125000, 'Completed', 'TECH-DIV', 'PT Engineering Consultant'),
('PSC-E-003', 'IT System Development', 'E', 'E', 'E-03', '2024-10-28', '2025-01-08', 72, 95000, 'Completed', 'IT-DEPT', 'PT Software House'),
('PSC-E-004', 'Security Services 2025', 'E', 'E', 'E-04', '2024-11-15', '2025-01-28', 74, 78000, 'Completed', 'ALL-UNITS', 'PT Security Services'),
('PSC-E-005', 'Training & Development', 'E', 'E', 'E-05', '2024-11-25', '2025-02-05', 72, 42000, 'Completed', 'HR-DEPT', 'PT Training Solutions'),
('PSC-E-006', 'Legal & Audit Services', 'E', 'E', 'E-06', '2024-10-20', '2025-01-30', 102, 58000, 'Completed', 'FINANCE', 'PT Legal Consultant'),
('PSC-E-007', 'Major Overhaul Services', 'E', 'E', 'E-01', '2024-10-25', '2025-02-10', 108, 385000, 'Completed', 'PLTU-PAI', 'PT Overhaul Specialist'),
('PSC-E-008', 'Facility Management 2025', 'E', 'E', 'E-04', '2024-11-12', '2025-02-01', 81, 65000, 'Completed', 'ALL-UNITS', 'PT Facility Services'),
('PSC-E-009', 'Technical Advisory', 'E', 'E', 'E-02', '2024-11-18', '2025-02-08', 82, 92000, 'Completed', 'TECH-DIV', 'PT Technical Consultant');

-- Category F: Peralatan Utama (Target 70 days) - mix 65% within, 35% beyond
INSERT INTO procurement_sourcing_contracts (contract_number, contract_name, category, main_category, sub_category, request_date, contract_signed_date, sourcing_duration_days, value_usd, status, unit_location_id, vendor_name)
VALUES
('PSC-F-001', 'Generator Upgrade 150 MW', 'F', 'F', 'F-01', '2024-11-20', '2025-02-02', 68, 485000, 'Completed', 'PLTU-SUR', 'PT Generator Systems'),
('PSC-F-002', 'Transformer 150 MVA', 'F', 'F', 'F-03', '2024-12-05', '2025-02-10', 65, 325000, 'Completed', 'PLTU-PAI', 'PT Transformer Tech'),
('PSC-F-003', 'Boiler Pressure Parts', 'F', 'F', 'F-02', '2024-12-10', '2025-02-15', 63, 285000, 'Completed', 'PLTU-LAB', 'PT Boiler Components'),
('PSC-F-004', 'BOP System Upgrade', 'F', 'F', 'F-06', '2024-12-18', '2025-02-22', 62, 195000, 'Completed', 'PLTG-MK', 'PT BOP Systems'),
('PSC-F-005', 'Gas Turbine Overhaul', 'F', 'F', 'F-05', '2024-11-18', '2025-02-18', 88, 625000, 'Completed', 'PLTG-MK', 'PT Turbine Services'),
('PSC-F-006', 'Switchgear 150 kV', 'F', 'F', 'F-03', '2024-12-02', '2025-02-28', 84, 425000, 'Completed', 'PLTU-SUR', 'PT Switchgear Indo'),
('PSC-F-007', 'Turbine Blade Replacement', 'F', 'F', 'F-01', '2024-12-08', '2025-02-12', 66, 385000, 'Completed', 'PLTU-PAI', 'PT Turbine Parts'),
('PSC-F-008', 'Cooling Tower Upgrade', 'F', 'F', 'F-06', '2024-12-15', '2025-02-20', 67, 245000, 'Completed', 'PLTU-SUR', 'PT Cooling Systems');

-- Drop temporary function
DROP FUNCTION gen_request_date(DATE, INTEGER);
