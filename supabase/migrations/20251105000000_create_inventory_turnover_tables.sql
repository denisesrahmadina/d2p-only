/*
  # Create Inventory Turn Over Tables for Critical Materials

  1. New Tables
    - `critical_materials`
      - `material_id` (text, primary key) - Unique material identifier
      - `material_name` (text) - Material name (Diesel Engine, Gas Turbine, etc.)
      - `material_code` (text) - Internal material code
      - `category` (text) - Material category
      - `description` (text) - Material description
      - `is_critical` (boolean) - Critical material flag
      - `threshold_days` (numeric) - Inventory turnover threshold in days
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

    - `material_inventory_turnover`
      - `id` (uuid, primary key) - Unique record identifier
      - `material_id` (text) - Reference to critical_materials
      - `unit_id` (text) - Reference to unit_locations
      - `turnover_days` (numeric) - Inventory turnover in days
      - `stock_quantity` (numeric) - Current stock quantity
      - `demand_rate` (numeric) - Average daily demand
      - `last_replenishment_date` (date) - Last replenishment date
      - `status` (text) - Status: normal, warning, critical
      - `measurement_date` (date) - Date of measurement
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for anonymous read access
    - Add policies for authenticated full access

  3. Data
    - Populate with 5 critical materials
    - Add inventory turnover data for multiple units per material
    - Include threshold highlighting for units exceeding acceptable levels
*/

-- Create critical_materials table
CREATE TABLE IF NOT EXISTS critical_materials (
  material_id TEXT PRIMARY KEY,
  material_name TEXT NOT NULL,
  material_code TEXT,
  category TEXT DEFAULT 'Critical Component',
  description TEXT,
  is_critical BOOLEAN DEFAULT true,
  threshold_days NUMERIC(5,2) DEFAULT 10.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create material_inventory_turnover table
CREATE TABLE IF NOT EXISTS material_inventory_turnover (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id TEXT NOT NULL REFERENCES critical_materials(material_id),
  unit_id TEXT NOT NULL,
  turnover_days NUMERIC(6,2) NOT NULL,
  stock_quantity NUMERIC(10,2) DEFAULT 0,
  demand_rate NUMERIC(8,4) DEFAULT 0,
  last_replenishment_date DATE,
  status TEXT DEFAULT 'normal' CHECK (status IN ('normal', 'warning', 'critical')),
  measurement_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_unit_location FOREIGN KEY (unit_id) REFERENCES unit_locations(unit_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_critical_materials_name ON critical_materials(material_name);
CREATE INDEX IF NOT EXISTS idx_critical_materials_is_critical ON critical_materials(is_critical);
CREATE INDEX IF NOT EXISTS idx_material_inventory_turnover_material ON material_inventory_turnover(material_id);
CREATE INDEX IF NOT EXISTS idx_material_inventory_turnover_unit ON material_inventory_turnover(unit_id);
CREATE INDEX IF NOT EXISTS idx_material_inventory_turnover_status ON material_inventory_turnover(status);
CREATE INDEX IF NOT EXISTS idx_material_inventory_turnover_measurement_date ON material_inventory_turnover(measurement_date);

-- Enable Row Level Security
ALTER TABLE critical_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_inventory_turnover ENABLE ROW LEVEL SECURITY;

-- Create policies for critical_materials
CREATE POLICY "Allow anonymous read access to critical_materials"
  ON critical_materials FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to critical_materials"
  ON critical_materials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for material_inventory_turnover
CREATE POLICY "Allow anonymous read access to material_inventory_turnover"
  ON material_inventory_turnover FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to material_inventory_turnover"
  ON material_inventory_turnover FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert critical materials data
INSERT INTO critical_materials (material_id, material_name, material_code, category, description, threshold_days) VALUES
('MAT-DIESEL-ENGINE', 'Diesel Engine', 'DE-001', 'Power Generation Equipment', 'High-performance diesel engines for power generation units', 10.00),
('MAT-GAS-TURBINE', 'Gas Turbine', 'GT-001', 'Power Generation Equipment', 'Gas turbines for combined cycle power plants', 12.00),
('MAT-TRANSFORMER', 'Transformer', 'TR-001', 'Electrical Equipment', 'High-voltage power transformers for distribution systems', 8.00),
('MAT-HEAT-EXCHANGER', 'Heat Exchanger', 'HE-001', 'Thermal Equipment', 'Industrial heat exchangers for cooling and heating systems', 10.00),
('MAT-BOILER', 'Boiler', 'BL-001', 'Thermal Equipment', 'Industrial boilers for steam generation', 10.00)
ON CONFLICT (material_id) DO UPDATE SET
  material_name = EXCLUDED.material_name,
  description = EXCLUDED.description,
  threshold_days = EXCLUDED.threshold_days,
  updated_at = NOW();

-- Insert sample inventory turnover data for Diesel Engine
INSERT INTO material_inventory_turnover (material_id, unit_id, turnover_days, stock_quantity, demand_rate, last_replenishment_date, status) VALUES
('MAT-DIESEL-ENGINE', 'UBP-SRY', 7.8, 4, 0.51, '2025-10-28', 'normal'),
('MAT-DIESEL-ENGINE', 'UBP-LBN', 12.5, 3, 0.24, '2025-10-20', 'warning'),
('MAT-DIESEL-ENGINE', 'UBP-PRK', 6.2, 5, 0.81, '2025-10-30', 'normal'),
('MAT-DIESEL-ENGINE', 'UBP-BKL', 9.1, 2, 0.22, '2025-10-26', 'normal'),
('MAT-DIESEL-ENGINE', 'UBP-ASM', 8.4, 3, 0.36, '2025-10-27', 'normal'),
('MAT-DIESEL-ENGINE', 'UBP-MKS', 11.3, 2, 0.18, '2025-10-23', 'warning'),
('MAT-DIESEL-ENGINE', 'UBP-PSG', 5.9, 4, 0.68, '2025-10-31', 'normal'),
('MAT-DIESEL-ENGINE', 'UBP-AMB', 14.2, 2, 0.14, '2025-10-18', 'critical')
ON CONFLICT DO NOTHING;

-- Insert sample inventory turnover data for Gas Turbine
INSERT INTO material_inventory_turnover (material_id, unit_id, turnover_days, stock_quantity, demand_rate, last_replenishment_date, status) VALUES
('MAT-GAS-TURBINE', 'UBP-PRK', 10.5, 3, 0.29, '2025-10-25', 'normal'),
('MAT-GAS-TURBINE', 'UBP-GRT', 8.7, 4, 0.46, '2025-10-28', 'normal'),
('MAT-GAS-TURBINE', 'UBP-PRK2', 13.8, 2, 0.14, '2025-10-19', 'warning'),
('MAT-GAS-TURBINE', 'UBP-BKL', 7.3, 5, 0.68, '2025-10-29', 'normal'),
('MAT-GAS-TURBINE', 'UBP-PML', 11.9, 2, 0.17, '2025-10-22', 'normal'),
('MAT-GAS-TURBINE', 'UBP-GLM', 15.4, 1, 0.06, '2025-10-17', 'critical'),
('MAT-GAS-TURBINE', 'UBP-BEU', 9.6, 3, 0.31, '2025-10-26', 'normal')
ON CONFLICT DO NOTHING;

-- Insert sample inventory turnover data for Transformer
INSERT INTO material_inventory_turnover (material_id, unit_id, turnover_days, stock_quantity, demand_rate, last_replenishment_date, status) VALUES
('MAT-TRANSFORMER', 'UBP-SRY', 6.4, 8, 1.25, '2025-10-30', 'normal'),
('MAT-TRANSFORMER', 'UBP-LBN', 10.2, 4, 0.39, '2025-10-24', 'critical'),
('MAT-TRANSFORMER', 'UBP-LTR', 5.8, 10, 1.72, '2025-10-31', 'normal'),
('MAT-TRANSFORMER', 'UBP-SGG', 7.1, 6, 0.85, '2025-10-29', 'normal'),
('MAT-TRANSFORMER', 'UBP-ADP', 9.3, 5, 0.54, '2025-10-26', 'warning'),
('MAT-TRANSFORMER', 'UBP-ASM', 4.9, 12, 2.45, '2025-11-01', 'normal'),
('MAT-TRANSFORMER', 'UBP-MKS', 11.7, 3, 0.26, '2025-10-22', 'critical'),
('MAT-TRANSFORMER', 'UBP-JRH', 6.8, 7, 1.03, '2025-10-30', 'normal'),
('MAT-TRANSFORMER', 'UBP-BRU', 8.5, 4, 0.47, '2025-10-27', 'warning')
ON CONFLICT DO NOTHING;

-- Insert sample inventory turnover data for Heat Exchanger
INSERT INTO material_inventory_turnover (material_id, unit_id, turnover_days, stock_quantity, demand_rate, last_replenishment_date, status) VALUES
('MAT-HEAT-EXCHANGER', 'UBP-SRY', 8.9, 6, 0.67, '2025-10-27', 'normal'),
('MAT-HEAT-EXCHANGER', 'UBP-LBN', 12.4, 3, 0.24, '2025-10-21', 'warning'),
('MAT-HEAT-EXCHANGER', 'UBP-PRK', 7.5, 8, 1.07, '2025-10-29', 'normal'),
('MAT-HEAT-EXCHANGER', 'UBP-KMJ', 6.2, 9, 1.45, '2025-10-31', 'normal'),
('MAT-HEAT-EXCHANGER', 'UBP-PBR', 11.8, 4, 0.34, '2025-10-23', 'warning'),
('MAT-HEAT-EXCHANGER', 'UBP-PSU', 14.6, 2, 0.14, '2025-10-18', 'critical'),
('MAT-HEAT-EXCHANGER', 'UBP-KRY', 9.3, 5, 0.54, '2025-10-26', 'normal'),
('MAT-HEAT-EXCHANGER', 'UBP-PMK', 5.7, 10, 1.75, '2025-10-31', 'normal')
ON CONFLICT DO NOTHING;

-- Insert sample inventory turnover data for Boiler
INSERT INTO material_inventory_turnover (material_id, unit_id, turnover_days, stock_quantity, demand_rate, last_replenishment_date, status) VALUES
('MAT-BOILER', 'UBP-SRY', 9.7, 5, 0.52, '2025-10-26', 'normal'),
('MAT-BOILER', 'UBP-LBN', 11.3, 3, 0.27, '2025-10-23', 'warning'),
('MAT-BOILER', 'UBP-ADP', 7.8, 7, 0.90, '2025-10-29', 'normal'),
('MAT-BOILER', 'UBP-GRT', 13.5, 2, 0.15, '2025-10-20', 'critical'),
('MAT-BOILER', 'UBP-BNG', 8.4, 6, 0.71, '2025-10-28', 'normal'),
('MAT-BOILER', 'UBP-PLM', 15.2, 1, 0.07, '2025-10-17', 'critical'),
('MAT-BOILER', 'UBP-BKP', 6.9, 8, 1.16, '2025-10-30', 'normal'),
('MAT-BOILER', 'UBP-SMD', 10.6, 4, 0.38, '2025-10-25', 'warning')
ON CONFLICT DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_inventory_turnover_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at for critical_materials
DROP TRIGGER IF EXISTS trigger_update_critical_materials_updated_at ON critical_materials;
CREATE TRIGGER trigger_update_critical_materials_updated_at
  BEFORE UPDATE ON critical_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_turnover_updated_at();

-- Create trigger to automatically update updated_at for material_inventory_turnover
DROP TRIGGER IF EXISTS trigger_update_material_inventory_turnover_updated_at ON material_inventory_turnover;
CREATE TRIGGER trigger_update_material_inventory_turnover_updated_at
  BEFORE UPDATE ON material_inventory_turnover
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_turnover_updated_at();
