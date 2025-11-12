/*
  # Create Inventory Planning Tolerance Tables

  ## Summary
  Creates tables to track inventory planning tolerance metrics for each business unit location,
  enabling visualization of compliance with planned inventory levels on the Control Tower map.

  ## New Tables
  
  ### 1. `inventory_planning_tolerance`
  Stores aggregate tolerance metrics for each business unit with tolerance_percentage (0-100%)
  
  ### 2. `material_tolerance_details`
  Stores individual material tolerance details showing incompliant materials per unit

  ## Security
  - Enable RLS on both tables
  - Add policies for anonymous read and authenticated full access

  ## Sample Data
  - Populate with tolerance metrics for all existing business units
  - Include varying tolerance percentages across excellent (90-100%), good (80-90%), needs-attention (<80%)
*/

-- Create inventory_planning_tolerance table
CREATE TABLE IF NOT EXISTS inventory_planning_tolerance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id TEXT NOT NULL,
  tolerance_percentage NUMERIC(5,2) NOT NULL CHECK (tolerance_percentage >= 0 AND tolerance_percentage <= 100),
  materials_out_of_tolerance INTEGER DEFAULT 0,
  total_materials INTEGER DEFAULT 0,
  measurement_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'good' CHECK (status IN ('excellent', 'good', 'needs-attention')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_unit_location FOREIGN KEY (unit_id) REFERENCES unit_locations(unit_id) ON DELETE CASCADE,
  CONSTRAINT unique_unit_measurement UNIQUE (unit_id, measurement_date)
);

-- Create material_tolerance_details table
CREATE TABLE IF NOT EXISTS material_tolerance_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id TEXT NOT NULL,
  material_id TEXT NOT NULL,
  material_name TEXT NOT NULL,
  actual_quantity NUMERIC(10,2) NOT NULL DEFAULT 0,
  planned_quantity NUMERIC(10,2) NOT NULL DEFAULT 0,
  tolerance_percentage NUMERIC(6,2),
  is_compliant BOOLEAN DEFAULT true,
  measurement_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_unit_location_detail FOREIGN KEY (unit_id) REFERENCES unit_locations(unit_id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_inventory_tolerance_unit_id ON inventory_planning_tolerance(unit_id);
CREATE INDEX IF NOT EXISTS idx_inventory_tolerance_measurement_date ON inventory_planning_tolerance(measurement_date);
CREATE INDEX IF NOT EXISTS idx_inventory_tolerance_percentage ON inventory_planning_tolerance(tolerance_percentage);
CREATE INDEX IF NOT EXISTS idx_inventory_tolerance_status ON inventory_planning_tolerance(status);
CREATE INDEX IF NOT EXISTS idx_material_tolerance_unit_id ON material_tolerance_details(unit_id);
CREATE INDEX IF NOT EXISTS idx_material_tolerance_is_compliant ON material_tolerance_details(is_compliant);
CREATE INDEX IF NOT EXISTS idx_material_tolerance_measurement_date ON material_tolerance_details(measurement_date);

-- Enable Row Level Security
ALTER TABLE inventory_planning_tolerance ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_tolerance_details ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow anonymous read access to inventory_planning_tolerance"
  ON inventory_planning_tolerance FOR SELECT TO anon USING (true);

CREATE POLICY "Allow authenticated full access to inventory_planning_tolerance"
  ON inventory_planning_tolerance FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous read access to material_tolerance_details"
  ON material_tolerance_details FOR SELECT TO anon USING (true);

CREATE POLICY "Allow authenticated full access to material_tolerance_details"
  ON material_tolerance_details FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert sample tolerance data using existing unit_ids
INSERT INTO inventory_planning_tolerance (unit_id, tolerance_percentage, materials_out_of_tolerance, total_materials, status) VALUES
('HO-001', 95.2, 2, 42, 'excellent'),
('UBP-SRY', 93.8, 3, 48, 'excellent'),
('UBP-LTR', 94.5, 2, 38, 'excellent'),
('UBP-PRK', 91.3, 4, 46, 'excellent'),
('UBP-SGG', 92.7, 3, 41, 'excellent'),
('UBP-ADP', 90.8, 4, 43, 'excellent'),
('UBP-PRK2', 93.1, 3, 44, 'excellent'),
('UBP-ASM', 94.2, 2, 35, 'excellent'),
('UBP-JRH', 91.6, 3, 36, 'excellent'),
('UBP-PSG', 92.4, 3, 40, 'excellent'),
('UBP-LBN', 87.3, 5, 39, 'good'),
('UBP-GRT', 85.9, 6, 42, 'good'),
('UBP-BKL', 88.4, 4, 35, 'good'),
('UBP-PSU', 86.2, 5, 36, 'good'),
('UBP-KRY', 84.7, 6, 39, 'good'),
('UBP-BNG', 85.3, 5, 34, 'good'),
('UBP-PLM', 88.9, 4, 36, 'good'),
('UBP-BKP', 86.5, 5, 38, 'good'),
('UBP-SMD', 84.1, 6, 38, 'good'),
('UBP-MKS', 89.2, 4, 37, 'good'),
('UBP-BRU', 87.6, 4, 32, 'good'),
('UBP-PMK', 88.7, 4, 35, 'good'),
('UBP-PML', 85.8, 5, 35, 'good'),
('UBP-GLM', 86.9, 5, 38, 'good'),
('UBP-KMJ', 73.8, 9, 34, 'needs-attention'),
('UBP-PBR', 75.6, 8, 33, 'needs-attention'),
('UBP-BEU', 76.4, 8, 34, 'needs-attention'),
('UBP-AMB', 71.3, 10, 35, 'needs-attention')
ON CONFLICT (unit_id, measurement_date) DO UPDATE SET
  tolerance_percentage = EXCLUDED.tolerance_percentage,
  materials_out_of_tolerance = EXCLUDED.materials_out_of_tolerance,
  total_materials = EXCLUDED.total_materials,
  status = EXCLUDED.status,
  updated_at = NOW();

-- Insert material tolerance details for incompliant materials
INSERT INTO material_tolerance_details (unit_id, material_id, material_name, actual_quantity, planned_quantity, tolerance_percentage, is_compliant) VALUES
('UBP-KMJ', 'MAT-GEOTHERMAL-001', 'Geothermal Wellhead Equipment', 8, 12, 66.7, false),
('UBP-KMJ', 'MAT-PIPELINE-001', 'Steam Pipeline Components', 15, 20, 75.0, false),
('UBP-KMJ', 'MAT-TURBINE-BLADE-001', 'Turbine Blade Set', 4, 8, 50.0, false),
('UBP-KMJ', 'MAT-SEPARATOR-001', 'Steam Separator Units', 6, 10, 60.0, false),
('UBP-AMB', 'MAT-FUEL-TANK-001', 'Diesel Fuel Storage Tanks', 2, 4, 50.0, false),
('UBP-AMB', 'MAT-CONTROL-PANEL-001', 'Electrical Control Panels', 6, 10, 60.0, false),
('UBP-AMB', 'MAT-CABLE-001', 'High Voltage Cables (Meters)', 850, 1200, 70.8, false),
('UBP-AMB', 'MAT-BREAKER-001', 'Circuit Breakers', 15, 20, 75.0, false),
('UBP-PBR', 'MAT-COAL-CONVEYOR-001', 'Coal Conveyor Belt Segments', 12, 18, 66.7, false),
('UBP-PBR', 'MAT-BOILER-TUBE-001', 'Boiler Tubes', 28, 40, 70.0, false),
('UBP-PBR', 'MAT-VALVE-001', 'High Pressure Valves', 35, 50, 70.0, false),
('UBP-PBR', 'MAT-GASKET-001', 'Industrial Gaskets', 180, 250, 72.0, false),
('UBP-LBN', 'MAT-BURNER-001', 'Coal Burners', 8, 12, 66.7, false),
('UBP-LBN', 'MAT-ASH-HANDLER-001', 'Ash Handling Equipment', 4, 6, 66.7, false),
('UBP-LBN', 'MAT-PULVERIZER-001', 'Coal Pulverizer Parts', 15, 20, 75.0, false),
('UBP-SRY', 'MAT-PRECIPITATOR-001', 'Electrostatic Precipitator Parts', 22, 30, 73.3, false),
('UBP-SRY', 'MAT-FAN-BLADE-001', 'Induced Draft Fan Blades', 8, 12, 66.7, false);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_inventory_tolerance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_inventory_tolerance_updated_at ON inventory_planning_tolerance;
CREATE TRIGGER trigger_update_inventory_tolerance_updated_at
  BEFORE UPDATE ON inventory_planning_tolerance
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_tolerance_updated_at();

DROP TRIGGER IF EXISTS trigger_update_material_tolerance_updated_at ON material_tolerance_details;
CREATE TRIGGER trigger_update_material_tolerance_updated_at
  BEFORE UPDATE ON material_tolerance_details
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_tolerance_updated_at();