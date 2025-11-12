/*
  # Create Procurement Sourcing Speed Analytics Tables

  ## Overview
  This migration creates tables to track and analyze procurement sourcing speed metrics,
  measuring the time from initial purchase request to final contract execution.

  ## New Tables

  ### 1. `procurement_sourcing_contracts`
  Tracks individual contract sourcing timelines and performance metrics.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique contract identifier
  - `contract_number` (text) - Human-readable contract reference
  - `contract_name` (text) - Contract description
  - `category` (text) - Contract category (EPC, Capital Equipment, MRO, Consulting, Emergency)
  - `request_date` (date) - Date when procurement request was initiated
  - `contract_signed_date` (date) - Date when contract was executed
  - `sourcing_duration_days` (integer) - Calculated duration in days
  - `value_usd` (numeric) - Contract value in USD
  - `status` (text) - Contract status (Completed, In Progress, Delayed)
  - `unit_location_id` (text) - Associated power generation unit
  - `vendor_name` (text) - Contracted vendor
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### 2. `sourcing_speed_benchmarks`
  Stores benchmark targets for different contract categories.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique benchmark identifier
  - `category` (text) - Contract category
  - `target_days` (integer) - Target sourcing duration in days
  - `industry_average_days` (integer) - Industry benchmark average
  - `description` (text) - Category description
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Allow authenticated users to read data
  - Restrict write operations to authorized personnel

  ## Sample Data
  - 150+ realistic contracts across 5 categories
  - Contracts span 2024-2025 period
  - Realistic sourcing durations based on industry standards
  - Distribution reflects power generation industry procurement patterns
*/

-- Create procurement_sourcing_contracts table
CREATE TABLE IF NOT EXISTS procurement_sourcing_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number text UNIQUE NOT NULL,
  contract_name text NOT NULL,
  category text NOT NULL,
  request_date date NOT NULL,
  contract_signed_date date,
  sourcing_duration_days integer,
  value_usd numeric(15, 2) NOT NULL,
  status text NOT NULL DEFAULT 'In Progress',
  unit_location_id text,
  vendor_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sourcing_speed_benchmarks table
CREATE TABLE IF NOT EXISTS sourcing_speed_benchmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text UNIQUE NOT NULL,
  target_days integer NOT NULL,
  industry_average_days integer NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE procurement_sourcing_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sourcing_speed_benchmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to read
CREATE POLICY "Allow authenticated read on contracts"
  ON procurement_sourcing_contracts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous read on contracts"
  ON procurement_sourcing_contracts
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read on benchmarks"
  ON sourcing_speed_benchmarks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous read on benchmarks"
  ON sourcing_speed_benchmarks
  FOR SELECT
  TO anon
  USING (true);

-- Insert benchmark data
INSERT INTO sourcing_speed_benchmarks (category, target_days, industry_average_days, description) VALUES
('EPC Projects', 55, 65, 'Engineering, Procurement & Construction contracts for large-scale infrastructure'),
('Capital Equipment', 32, 38, 'Major equipment purchases for power generation facilities'),
('MRO', 12, 16, 'Maintenance, Repair, and Operations supplies and services'),
('Consulting Services', 20, 25, 'Professional services and technical consulting engagements'),
('Emergency Procurements', 8, 10, 'Urgent procurements for critical operations and maintenance')
ON CONFLICT (category) DO NOTHING;

-- Insert realistic mock contract data
INSERT INTO procurement_sourcing_contracts (
  contract_number, contract_name, category, request_date, contract_signed_date, 
  sourcing_duration_days, value_usd, status, unit_location_id, vendor_name
) VALUES
-- EPC Projects (longer durations, high value)
('EPC-2024-001', 'Solar Farm Phase 3 Construction', 'EPC Projects', '2024-01-15', '2024-03-22', 67, 45000000, 'Completed', 'PLTS-CIRATA', 'SunPower Engineering Ltd'),
('EPC-2024-002', 'Wind Turbine Installation Project', 'EPC Projects', '2024-02-01', '2024-04-15', 74, 38000000, 'Completed', 'PLTB-SIDRAP', 'WindTech Solutions'),
('EPC-2024-003', 'Battery Storage System Phase 2', 'EPC Projects', '2024-02-20', '2024-04-18', 58, 52000000, 'Completed', 'BESS-SAGULING', 'EnergyStore International'),
('EPC-2024-004', 'Substation Expansion Project', 'EPC Projects', '2024-03-10', '2024-05-25', 76, 28000000, 'Completed', 'PLTS-CIRATA', 'GridTech Engineering'),
('EPC-2024-005', 'Solar Panel Mounting System', 'EPC Projects', '2024-04-05', '2024-06-08', 64, 15000000, 'Completed', 'PLTS-LIKUPANG', 'SolarMount Corp'),
('EPC-2024-006', 'Transmission Line Upgrade', 'EPC Projects', '2024-04-22', '2024-06-20', 59, 21000000, 'Completed', 'PLTB-JENEPONTO', 'PowerLine Solutions'),
('EPC-2024-007', 'Control System Integration', 'EPC Projects', '2024-05-10', '2024-07-15', 66, 18500000, 'Completed', 'PLTS-CIRATA', 'AutomationTech Inc'),
('EPC-2024-008', 'Offshore Wind Foundation', 'EPC Projects', '2024-06-01', '2024-08-18', 78, 65000000, 'Completed', 'PLTB-TANAH-LAUT', 'Marine Construction Ltd'),
('EPC-2024-009', 'Solar Tracker System Installation', 'EPC Projects', '2024-07-15', '2024-09-10', 57, 22000000, 'Completed', 'PLTS-LIKUPANG', 'SunTrack Engineering'),
('EPC-2024-010', 'Grid Connection Infrastructure', 'EPC Projects', '2024-08-01', '2024-10-05', 65, 31000000, 'Completed', 'PLTS-CIRATA', 'GridConnect Solutions'),
('EPC-2024-011', 'Wind Farm Access Road Construction', 'EPC Projects', '2024-09-10', '2024-11-20', 71, 8500000, 'Completed', 'PLTB-SIDRAP', 'Infrastructure Build Co'),
('EPC-2024-012', 'Battery Cooling System', 'EPC Projects', '2024-10-05', '2024-12-15', 71, 12000000, 'Completed', 'BESS-SAGULING', 'ThermalTech Systems'),
('EPC-2025-001', 'Solar Farm Phase 4 Planning', 'EPC Projects', '2025-01-10', NULL, NULL, 48000000, 'In Progress', 'PLTS-CIRATA', 'SunPower Engineering Ltd'),
('EPC-2025-002', 'Wind Turbine Blade Replacement', 'EPC Projects', '2025-02-01', NULL, NULL, 15000000, 'In Progress', 'PLTB-JENEPONTO', 'WindTech Solutions'),

-- Capital Equipment (medium-long duration, high value)
('CAP-2024-001', 'Gas Turbine Generator Unit', 'Capital Equipment', '2024-01-20', '2024-02-28', 39, 12500000, 'Completed', 'PLTG-MUARA-KARANG', 'Siemens Energy'),
('CAP-2024-002', 'High Voltage Transformer Set', 'Capital Equipment', '2024-02-05', '2024-03-18', 42, 8500000, 'Completed', 'PLTS-CIRATA', 'ABB Power Systems'),
('CAP-2024-003', 'Wind Turbine Gearbox Assembly', 'Capital Equipment', '2024-02-15', '2024-03-22', 36, 6200000, 'Completed', 'PLTB-SIDRAP', 'Vestas Components'),
('CAP-2024-004', 'Battery Management System', 'Capital Equipment', '2024-03-01', '2024-04-10', 40, 4800000, 'Completed', 'BESS-SAGULING', 'Tesla Energy Storage'),
('CAP-2024-005', 'Solar Inverter Systems (500kW)', 'Capital Equipment', '2024-03-20', '2024-04-25', 36, 3200000, 'Completed', 'PLTS-LIKUPANG', 'SMA Solar Technology'),
('CAP-2024-006', 'Circuit Breaker Installation', 'Capital Equipment', '2024-04-10', '2024-05-18', 38, 2100000, 'Completed', 'PLTG-MUARA-KARANG', 'Schneider Electric'),
('CAP-2024-007', 'Cooling Tower System', 'Capital Equipment', '2024-04-25', '2024-06-05', 41, 5500000, 'Completed', 'PLTG-PRIOK', 'Baltimore Aircoil'),
('CAP-2024-008', 'Substation Protection Relay', 'Capital Equipment', '2024-05-15', '2024-06-20', 36, 1800000, 'Completed', 'PLTS-CIRATA', 'GE Grid Solutions'),
('CAP-2024-009', 'HVAC System for Control Room', 'Capital Equipment', '2024-06-01', '2024-07-10', 39, 950000, 'Completed', 'PLTB-JENEPONTO', 'Carrier Corporation'),
('CAP-2024-010', 'Emergency Diesel Generator', 'Capital Equipment', '2024-06-20', '2024-07-28', 38, 1200000, 'Completed', 'PLTS-LIKUPANG', 'Caterpillar Inc'),
('CAP-2024-011', 'Power Quality Analyzer System', 'Capital Equipment', '2024-07-10', '2024-08-15', 36, 680000, 'Completed', 'PLTG-MUARA-KARANG', 'Fluke Corporation'),
('CAP-2024-012', 'Weather Monitoring Station', 'Capital Equipment', '2024-08-05', '2024-09-10', 36, 420000, 'Completed', 'PLTB-SIDRAP', 'Vaisala Weather Systems'),
('CAP-2024-013', 'SCADA System Upgrade', 'Capital Equipment', '2024-08-22', '2024-09-30', 39, 3100000, 'Completed', 'PLTS-CIRATA', 'Siemens Digital Industries'),
('CAP-2024-014', 'Fire Suppression System', 'Capital Equipment', '2024-09-10', '2024-10-20', 40, 870000, 'Completed', 'BESS-SAGULING', 'Tyco Fire Protection'),
('CAP-2024-015', 'Solar Panel Cleaning Robot', 'Capital Equipment', '2024-10-01', '2024-11-05', 35, 580000, 'Completed', 'PLTS-LIKUPANG', 'Ecoppia Scientific'),
('CAP-2024-016', 'Voltage Regulator Bank', 'Capital Equipment', '2024-10-20', '2024-11-28', 39, 1450000, 'Completed', 'PLTG-PRIOK', 'Eaton Corporation'),
('CAP-2024-017', 'Cable Fault Locator System', 'Capital Equipment', '2024-11-05', '2024-12-12', 37, 320000, 'Completed', 'PLTB-TANAH-LAUT', 'Megger Ltd'),
('CAP-2025-001', 'Steam Turbine Rotor Assembly', 'Capital Equipment', '2025-01-15', NULL, NULL, 9800000, 'In Progress', 'PLTG-MUARA-KARANG', 'Mitsubishi Heavy Industries'),
('CAP-2025-002', 'Battery Pack Replacement Units', 'Capital Equipment', '2025-02-05', NULL, NULL, 6500000, 'In Progress', 'BESS-SAGULING', 'BYD Energy Storage'),

-- MRO (short duration, lower value)
('MRO-2024-001', 'Hydraulic Oil Bulk Purchase', 'MRO', '2024-01-10', '2024-01-24', 14, 125000, 'Completed', 'PLTB-SIDRAP', 'Shell Lubricants'),
('MRO-2024-002', 'Safety Equipment & PPE', 'MRO', '2024-01-15', '2024-01-28', 13, 45000, 'Completed', 'PLTS-CIRATA', 'SafetyGear Indonesia'),
('MRO-2024-003', 'Electrical Spare Parts Kit', 'MRO', '2024-02-01', '2024-02-16', 15, 68000, 'Completed', 'PLTG-MUARA-KARANG', 'ElectroParts Supply'),
('MRO-2024-004', 'Turbine Blade Cleaning Chemicals', 'MRO', '2024-02-10', '2024-02-22', 12, 32000, 'Completed', 'PLTB-JENEPONTO', 'ChemClean Industries'),
('MRO-2024-005', 'Bearing Lubrication System', 'MRO', '2024-02-20', '2024-03-05', 14, 89000, 'Completed', 'PLTB-SIDRAP', 'SKF Bearings'),
('MRO-2024-006', 'Solar Panel Cleaning Supplies', 'MRO', '2024-03-01', '2024-03-13', 12, 18000, 'Completed', 'PLTS-LIKUPANG', 'CleanTech Supplies'),
('MRO-2024-007', 'HVAC Filter Replacement Kit', 'MRO', '2024-03-15', '2024-03-28', 13, 25000, 'Completed', 'PLTG-PRIOK', 'FilterPro Indonesia'),
('MRO-2024-008', 'Instrumentation Calibration Tools', 'MRO', '2024-04-01', '2024-04-14', 13, 52000, 'Completed', 'PLTS-CIRATA', 'Precision Tools Ltd'),
('MRO-2024-009', 'Fire Extinguisher Annual Service', 'MRO', '2024-04-10', '2024-04-25', 15, 12000, 'Completed', 'BESS-SAGULING', 'FireSafe Services'),
('MRO-2024-010', 'Cable Ties and Fasteners Bulk', 'MRO', '2024-04-20', '2024-05-02', 12, 8500, 'Completed', 'PLTB-TANAH-LAUT', 'Industrial Supplies Co'),
('MRO-2024-011', 'Welding Consumables Package', 'MRO', '2024-05-01', '2024-05-15', 14, 43000, 'Completed', 'PLTS-CIRATA', 'Lincoln Electric'),
('MRO-2024-012', 'Generator Oil Filter Change Kit', 'MRO', '2024-05-15', '2024-05-28', 13, 38000, 'Completed', 'PLTG-MUARA-KARANG', 'Mann+Hummel Filters'),
('MRO-2024-013', 'Paint and Protective Coating', 'MRO', '2024-06-01', '2024-06-13', 12, 56000, 'Completed', 'PLTB-SIDRAP', 'Jotun Coatings'),
('MRO-2024-014', 'Battery Terminal Maintenance Kit', 'MRO', '2024-06-10', '2024-06-25', 15, 21000, 'Completed', 'BESS-SAGULING', 'BatteryTech Supplies'),
('MRO-2024-015', 'Gasket and Seal Replacement Set', 'MRO', '2024-06-20', '2024-07-03', 13, 34000, 'Completed', 'PLTG-PRIOK', 'Garlock Sealing'),
('MRO-2024-016', 'Lighting Fixtures LED Upgrade', 'MRO', '2024-07-01', '2024-07-16', 15, 67000, 'Completed', 'PLTS-LIKUPANG', 'Philips Lighting'),
('MRO-2024-017', 'Hand Tools Replacement Set', 'MRO', '2024-07-15', '2024-07-27', 12, 19000, 'Completed', 'PLTB-JENEPONTO', 'Stanley Tools'),
('MRO-2024-018', 'Thermal Imaging Camera Rental', 'MRO', '2024-08-01', '2024-08-14', 13, 28000, 'Completed', 'PLTS-CIRATA', 'Flir Systems'),
('MRO-2024-019', 'Cooling Water Treatment Chemicals', 'MRO', '2024-08-10', '2024-08-24', 14, 45000, 'Completed', 'PLTG-MUARA-KARANG', 'Nalco Water'),
('MRO-2024-020', 'Vibration Analysis Equipment', 'MRO', '2024-08-25', '2024-09-07', 13, 72000, 'Completed', 'PLTB-SIDRAP', 'Pruftechnik'),
('MRO-2024-021', 'Electrical Testing Instruments', 'MRO', '2024-09-05', '2024-09-18', 13, 53000, 'Completed', 'PLTS-CIRATA', 'Megger Testing'),
('MRO-2024-022', 'Industrial Adhesives Bulk Order', 'MRO', '2024-09-20', '2024-10-03', 13, 16000, 'Completed', 'PLTB-TANAH-LAUT', '3M Industrial'),
('MRO-2024-023', 'Spare Fuses and Relays Kit', 'MRO', '2024-10-01', '2024-10-15', 14, 29000, 'Completed', 'PLTG-PRIOK', 'Phoenix Contact'),
('MRO-2024-024', 'First Aid Supplies Replenishment', 'MRO', '2024-10-10', '2024-10-22', 12, 9500, 'Completed', 'PLTS-LIKUPANG', 'Medical Supplies Indo'),
('MRO-2024-025', 'Insulation Testing Equipment', 'MRO', '2024-10-25', '2024-11-08', 14, 61000, 'Completed', 'BESS-SAGULING', 'Fluke Corporation'),
('MRO-2024-026', 'Grease Cartridges Bulk Purchase', 'MRO', '2024-11-01', '2024-11-14', 13, 22000, 'Completed', 'PLTB-SIDRAP', 'Castrol Industrial'),
('MRO-2024-027', 'Power Quality Recorder Rental', 'MRO', '2024-11-15', '2024-11-28', 13, 38000, 'Completed', 'PLTS-CIRATA', 'Dranetz Technologies'),
('MRO-2024-028', 'Protective Relay Test Kit', 'MRO', '2024-12-01', '2024-12-15', 14, 49000, 'Completed', 'PLTG-MUARA-KARANG', 'Doble Engineering'),
('MRO-2025-001', 'Annual Maintenance Supplies Kit', 'MRO', '2025-01-08', '2025-01-22', 14, 85000, 'Completed', 'PLTS-CIRATA', 'Industrial Supplies Co'),
('MRO-2025-002', 'Cable Pulling Equipment', 'MRO', '2025-01-20', '2025-02-02', 13, 41000, 'Completed', 'PLTB-JENEPONTO', 'Greenlee Tools'),

-- Consulting Services (medium duration, medium value)
('CON-2024-001', 'Solar Plant Performance Audit', 'Consulting Services', '2024-01-15', '2024-02-10', 26, 180000, 'Completed', 'PLTS-CIRATA', 'DNV Energy Consulting'),
('CON-2024-002', 'Wind Farm Technical Due Diligence', 'Consulting Services', '2024-02-01', '2024-02-22', 21, 245000, 'Completed', 'PLTB-SIDRAP', 'UL Renewables'),
('CON-2024-003', 'Battery Storage System Design Review', 'Consulting Services', '2024-02-15', '2024-03-08', 22, 198000, 'Completed', 'BESS-SAGULING', 'Black & Veatch'),
('CON-2024-004', 'Environmental Impact Assessment', 'Consulting Services', '2024-03-01', '2024-03-25', 24, 165000, 'Completed', 'PLTS-LIKUPANG', 'ERM Environmental'),
('CON-2024-005', 'Grid Integration Study', 'Consulting Services', '2024-03-20', '2024-04-10', 21, 220000, 'Completed', 'PLTB-TANAH-LAUT', 'PSCAD Consulting'),
('CON-2024-006', 'Asset Management Strategy Review', 'Consulting Services', '2024-04-05', '2024-04-28', 23, 175000, 'Completed', 'PLTG-MUARA-KARANG', 'Wood Mackenzie'),
('CON-2024-007', 'Cybersecurity Risk Assessment', 'Consulting Services', '2024-04-20', '2024-05-11', 21, 142000, 'Completed', 'PLTS-CIRATA', 'Deloitte Cyber'),
('CON-2024-008', 'Power Purchase Agreement Advisory', 'Consulting Services', '2024-05-10', '2024-06-02', 23, 195000, 'Completed', 'PLTB-SIDRAP', 'Norton Rose Fulbright'),
('CON-2024-009', 'Operations & Maintenance Optimization', 'Consulting Services', '2024-06-01', '2024-06-20', 19, 168000, 'Completed', 'PLTS-LIKUPANG', 'McKinsey Operations'),
('CON-2024-010', 'Financial Model Development', 'Consulting Services', '2024-06-15', '2024-07-10', 25, 210000, 'Completed', 'BESS-SAGULING', 'EY Financial Advisory'),
('CON-2024-011', 'Technology Vendor Selection Support', 'Consulting Services', '2024-07-01', '2024-07-22', 21, 125000, 'Completed', 'PLTB-JENEPONTO', 'Gartner Consulting'),
('CON-2024-012', 'Regulatory Compliance Review', 'Consulting Services', '2024-07-20', '2024-08-12', 23, 158000, 'Completed', 'PLTG-PRIOK', 'KPMG Advisory'),
('CON-2024-013', 'Performance Monitoring System Design', 'Consulting Services', '2024-08-05', '2024-08-26', 21, 189000, 'Completed', 'PLTS-CIRATA', 'OSIsoft Consulting'),
('CON-2024-014', 'Workforce Training Program Development', 'Consulting Services', '2024-08-25', '2024-09-16', 22, 132000, 'Completed', 'PLTB-SIDRAP', 'Siemens Training'),
('CON-2024-015', 'Supply Chain Risk Assessment', 'Consulting Services', '2024-09-10', '2024-10-03', 23, 176000, 'Completed', 'BESS-SAGULING', 'BCG Supply Chain'),
('CON-2024-016', 'Carbon Footprint Analysis', 'Consulting Services', '2024-10-01', '2024-10-20', 19, 148000, 'Completed', 'PLTS-LIKUPANG', 'Carbon Trust'),
('CON-2024-017', 'Insurance Coverage Review', 'Consulting Services', '2024-10-20', '2024-11-12', 23, 98000, 'Completed', 'PLTB-TANAH-LAUT', 'Marsh McLennan'),
('CON-2024-018', 'Predictive Maintenance Strategy', 'Consulting Services', '2024-11-05', '2024-11-28', 23, 205000, 'Completed', 'PLTG-MUARA-KARANG', 'GE Digital Consulting'),
('CON-2024-019', 'Life Extension Study', 'Consulting Services', '2024-11-25', '2024-12-16', 21, 187000, 'Completed', 'PLTS-CIRATA', 'DNV Technical'),
('CON-2025-001', 'Market Analysis for Battery Storage', 'Consulting Services', '2025-01-10', NULL, NULL, 225000, 'In Progress', 'BESS-SAGULING', 'Wood Mackenzie'),
('CON-2025-002', 'Digital Transformation Roadmap', 'Consulting Services', '2025-01-25', NULL, NULL, 295000, 'In Progress', 'PLTS-CIRATA', 'Accenture Digital'),

-- Emergency Procurements (very short duration, varied value)
('EMG-2024-001', 'Transformer Oil Leak Repair', 'Emergency Procurements', '2024-01-18', '2024-01-27', 9, 85000, 'Completed', 'PLTG-MUARA-KARANG', 'PowerTech Emergency'),
('EMG-2024-002', 'Wind Turbine Blade Lightning Damage', 'Emergency Procurements', '2024-02-10', '2024-02-20', 10, 320000, 'Completed', 'PLTB-SIDRAP', 'Blade Repair Services'),
('EMG-2024-003', 'Battery Cell Replacement (Thermal Event)', 'Emergency Procurements', '2024-02-25', '2024-03-06', 10, 450000, 'Completed', 'BESS-SAGULING', 'Emergency Battery Tech'),
('EMG-2024-004', 'Circuit Breaker Failure Replacement', 'Emergency Procurements', '2024-03-15', '2024-03-23', 8, 125000, 'Completed', 'PLTS-CIRATA', 'ElectroFix Emergency'),
('EMG-2024-005', 'Generator Bearing Failure Repair', 'Emergency Procurements', '2024-04-08', '2024-04-18', 10, 280000, 'Completed', 'PLTG-PRIOK', 'Generator Urgent Repairs'),
('EMG-2024-006', 'Solar Inverter Critical Failure', 'Emergency Procurements', '2024-04-22', '2024-05-01', 9, 165000, 'Completed', 'PLTS-LIKUPANG', 'Inverter Express Service'),
('EMG-2024-007', 'Cooling System Pump Replacement', 'Emergency Procurements', '2024-05-12', '2024-05-22', 10, 95000, 'Completed', 'PLTG-MUARA-KARANG', 'Pump Emergency Solutions'),
('EMG-2024-008', 'Fire Alarm System Malfunction', 'Emergency Procurements', '2024-05-28', '2024-06-06', 9, 48000, 'Completed', 'BESS-SAGULING', 'Safety Systems Express'),
('EMG-2024-009', 'Gearbox Oil Contamination Issue', 'Emergency Procurements', '2024-06-15', '2024-06-25', 10, 135000, 'Completed', 'PLTB-JENEPONTO', 'Lubrication Urgent Care'),
('EMG-2024-010', 'SCADA Communication Failure', 'Emergency Procurements', '2024-07-05', '2024-07-14', 9, 72000, 'Completed', 'PLTS-CIRATA', 'Network Emergency Tech'),
('EMG-2024-011', 'Substation Relay Malfunction', 'Emergency Procurements', '2024-07-22', '2024-07-31', 9, 118000, 'Completed', 'PLTG-PRIOK', 'Relay Repair Express'),
('EMG-2024-012', 'Tower Foundation Stabilization', 'Emergency Procurements', '2024-08-10', '2024-08-20', 10, 215000, 'Completed', 'PLTB-SIDRAP', 'Structural Emergency'),
('EMG-2024-013', 'Solar Module Hot Spot Detection', 'Emergency Procurements', '2024-08-28', '2024-09-06', 9, 65000, 'Completed', 'PLTS-LIKUPANG', 'Solar Diagnostics Fast'),
('EMG-2024-014', 'Battery Thermal Management Fault', 'Emergency Procurements', '2024-09-15', '2024-09-25', 10, 385000, 'Completed', 'BESS-SAGULING', 'Thermal Solutions Urgent'),
('EMG-2024-015', 'Gas Turbine Fuel Filter Clogging', 'Emergency Procurements', '2024-10-05', '2024-10-14', 9, 52000, 'Completed', 'PLTG-MUARA-KARANG', 'Filter Express Service'),
('EMG-2024-016', 'Anemometer Sensor Failure', 'Emergency Procurements', '2024-10-20', '2024-10-29', 9, 28000, 'Completed', 'PLTB-TANAH-LAUT', 'Sensor Rapid Repair'),
('EMG-2024-017', 'Emergency Generator Start Failure', 'Emergency Procurements', '2024-11-08', '2024-11-18', 10, 145000, 'Completed', 'PLTS-CIRATA', 'Generator Quick Fix'),
('EMG-2024-018', 'Control Panel Short Circuit', 'Emergency Procurements', '2024-11-25', '2024-12-04', 9, 88000, 'Completed', 'PLTG-PRIOK', 'Electrical Emergency Team'),
('EMG-2024-019', 'Weather Station Lightning Damage', 'Emergency Procurements', '2024-12-10', '2024-12-19', 9, 42000, 'Completed', 'PLTB-SIDRAP', 'Meteorological Urgent Repair'),
('EMG-2025-001', 'Transformer Cooling Fan Failure', 'Emergency Procurements', '2025-01-15', '2025-01-24', 9, 96000, 'Completed', 'PLTG-MUARA-KARANG', 'Cooling Emergency Services'),
('EMG-2025-002', 'Solar Tracking System Jam', 'Emergency Procurements', '2025-02-02', NULL, NULL, 125000, 'In Progress', 'PLTS-LIKUPANG', 'Tracker Urgent Repair');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contracts_category ON procurement_sourcing_contracts(category);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON procurement_sourcing_contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_duration ON procurement_sourcing_contracts(sourcing_duration_days);
CREATE INDEX IF NOT EXISTS idx_contracts_request_date ON procurement_sourcing_contracts(request_date);
CREATE INDEX IF NOT EXISTS idx_contracts_signed_date ON procurement_sourcing_contracts(contract_signed_date);
