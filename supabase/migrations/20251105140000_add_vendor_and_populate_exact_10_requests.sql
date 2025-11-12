/*
  # Add Vendor Column and Populate 10 Exact Procurement Requests

  1. Schema Changes
    - Add `vendor` column to fact_category_strategy_procurement_request table
    - Add `status` column with constraint for valid status values

  2. Data Population
    - Clear existing data for DATASET_A
    - Insert exactly 10 procurement requests as specified in requirements:
      * Turbines (Mechanical Equipment, 10 units, Siemens)
      * Generators (Mechanical Equipment, 5 units, Siemens)
      * Pumps (Mechanical Equipment, 7 units, ABB)
      * Transformers (Electrical Equipment, 8 units, Schneider)
      * Switchgear (Electrical Equipment, 6 units, ABB)
      * Concrete (Civil Works, 1000 units, Local Co.)
      * Sensors (Instrumentation & Control, 20 units, Honeywell)
      * Filters (Spare Parts & Maintenance, 50 units, Siemens)
      * Coal (Fuel and Combustion, 200 units, BP)
      * Fire Protection System (Safety and Environmental, 15 units, Local Co.)

  3. Important Notes
    - All items start with "Pending" status
    - Organized into 5 distinct categories
    - Realistic pricing in Indonesian Rupiah
    - Dataset: DATASET_A, Organization: ORG001
*/

-- Add vendor column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_category_strategy_procurement_request' AND column_name = 'vendor'
  ) THEN
    ALTER TABLE fact_category_strategy_procurement_request ADD COLUMN vendor text;
  END IF;
END $$;

-- Add status column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_category_strategy_procurement_request' AND column_name = 'status'
  ) THEN
    ALTER TABLE fact_category_strategy_procurement_request
    ADD COLUMN status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Completed', 'Rejected'));
  END IF;
END $$;

-- Clear existing data for DATASET_A to ensure clean state
DELETE FROM fact_category_strategy_procurement_request
WHERE dataset_id = 'DATASET_A' AND organization_id = 'ORG001';

-- Insert the exact 10 procurement requests as specified
INSERT INTO fact_category_strategy_procurement_request
  (material_name, material_code, category, quantity, unit_of_measure, unit_price, vendor, status, description, requestor, priority, due_date, dataset_id, organization_id)
VALUES
  -- 1. Turbines (Mechanical Equipment)
  (
    'Turbines',
    'ME-TURB-001',
    'Mechanical Equipment',
    10,
    'Unit',
    45000000000,
    'Siemens',
    'Pending',
    'High pressure steam turbines for 500MW power generation',
    'Budi Santoso',
    'High',
    '2025-03-15',
    'DATASET_A',
    'ORG001'
  ),

  -- 2. Generators (Mechanical Equipment)
  (
    'Generators',
    'ME-GEN-001',
    'Mechanical Equipment',
    5,
    'Unit',
    55000000000,
    'Siemens',
    'Pending',
    'Synchronous generators 500MW, 50Hz for power plant',
    'Ahmad Rahman',
    'High',
    '2025-03-20',
    'DATASET_A',
    'ORG001'
  ),

  -- 3. Pumps (Mechanical Equipment)
  (
    'Pumps',
    'ME-PUMP-001',
    'Mechanical Equipment',
    7,
    'Unit',
    2500000000,
    'ABB',
    'Pending',
    'High pressure boiler feed water pumps',
    'Sari Dewi',
    'High',
    '2025-04-10',
    'DATASET_A',
    'ORG001'
  ),

  -- 4. Transformers (Electrical Equipment)
  (
    'Transformers',
    'EE-TRANS-001',
    'Electrical Equipment',
    8,
    'Unit',
    42000000000,
    'Schneider',
    'Pending',
    'Power transformers 500kV, 300MVA for grid connection',
    'Rina Kusuma',
    'High',
    '2025-03-10',
    'DATASET_A',
    'ORG001'
  ),

  -- 5. Switchgear (Electrical Equipment)
  (
    'Switchgear',
    'EE-SWITCH-001',
    'Electrical Equipment',
    6,
    'Unit',
    125000000000,
    'ABB',
    'Pending',
    'Gas insulated switchgear 500kV for substation',
    'Dedi Prasetyo',
    'High',
    '2025-04-05',
    'DATASET_A',
    'ORG001'
  ),

  -- 6. Concrete (Civil Works)
  (
    'Concrete',
    'CW-CONC-001',
    'Civil Works',
    1000,
    'Cubic Meter',
    2800000,
    'Local Co.',
    'Pending',
    'High-strength ready-mix concrete K-500 for foundation',
    'Indra Wijaya',
    'High',
    '2025-03-05',
    'DATASET_A',
    'ORG001'
  ),

  -- 7. Sensors (Instrumentation & Control)
  (
    'Sensors',
    'IC-SENS-001',
    'Instrumentation & Control',
    20,
    'Unit',
    85000000,
    'Honeywell',
    'Pending',
    'Industrial sensors for temperature and pressure monitoring',
    'Budi Santoso',
    'Medium',
    '2025-04-20',
    'DATASET_A',
    'ORG001'
  ),

  -- 8. Filters (Spare Parts & Maintenance)
  (
    'Filters',
    'SP-FILT-001',
    'Spare Parts & Maintenance',
    50,
    'Unit',
    15000000,
    'Siemens',
    'Pending',
    'High-efficiency air filter cartridges for maintenance',
    'Ahmad Rahman',
    'Medium',
    '2025-04-15',
    'DATASET_A',
    'ORG001'
  ),

  -- 9. Coal (Fuel and Combustion)
  (
    'Coal',
    'FC-COAL-001',
    'Fuel and Combustion',
    200,
    'Ton',
    1850000,
    'BP',
    'Pending',
    'High-grade bituminous coal for power generation',
    'Sari Dewi',
    'High',
    '2025-03-08',
    'DATASET_A',
    'ORG001'
  ),

  -- 10. Fire Protection System (Safety and Environmental)
  (
    'Fire Protection System',
    'SE-FIRE-001',
    'Safety and Environmental',
    15,
    'Unit',
    250000000,
    'Local Co.',
    'Pending',
    'Addressable fire detection and suppression system',
    'Rina Kusuma',
    'High',
    '2025-03-15',
    'DATASET_A',
    'ORG001'
  );
