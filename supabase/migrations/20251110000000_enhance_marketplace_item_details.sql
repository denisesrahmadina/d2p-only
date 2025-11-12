/*
  # Enhance Marketplace Item Details

  1. Schema Enhancements
    - Add specifications JSONB column to `dim_material` for detailed technical specs
    - Add lead_time_days and delivery_notes to `dim_contract`
    - Add extended contact info to `dim_vendor`
    - Create `contract_documents` table for related documents (datasheets, brochures, certificates)
    - Add indexes for efficient querying

  2. New Tables
    - `contract_documents`
      - Document metadata including name, type, URL, description
      - Links to contracts for easy retrieval
      - Upload date and version tracking

  3. Security
    - Enable RLS on new tables
    - Allow public read access to documents for catalog viewing
    - Authenticated users can manage documents

  4. Sample Data
    - Populate specifications for existing materials
    - Add sample contract documents
    - Enhance vendor contact information
*/

-- Add new columns to dim_material for detailed specifications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_material' AND column_name = 'specifications'
  ) THEN
    ALTER TABLE dim_material ADD COLUMN specifications jsonb DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_material' AND column_name = 'technical_details'
  ) THEN
    ALTER TABLE dim_material ADD COLUMN technical_details text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_material' AND column_name = 'compliance_certifications'
  ) THEN
    ALTER TABLE dim_material ADD COLUMN compliance_certifications text[];
  END IF;
END $$;

-- Add new columns to dim_contract for delivery information
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_contract' AND column_name = 'lead_time_days'
  ) THEN
    ALTER TABLE dim_contract ADD COLUMN lead_time_days integer DEFAULT 30;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_contract' AND column_name = 'delivery_notes'
  ) THEN
    ALTER TABLE dim_contract ADD COLUMN delivery_notes text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_contract' AND column_name = 'shipping_options'
  ) THEN
    ALTER TABLE dim_contract ADD COLUMN shipping_options jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add extended contact information to dim_vendor
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_vendor' AND column_name = 'vendor_website'
  ) THEN
    ALTER TABLE dim_vendor ADD COLUMN vendor_website text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_vendor' AND column_name = 'vendor_primary_contact'
  ) THEN
    ALTER TABLE dim_vendor ADD COLUMN vendor_primary_contact text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_vendor' AND column_name = 'vendor_alternate_contact'
  ) THEN
    ALTER TABLE dim_vendor ADD COLUMN vendor_alternate_contact text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_vendor' AND column_name = 'vendor_location'
  ) THEN
    ALTER TABLE dim_vendor ADD COLUMN vendor_location jsonb;
  END IF;
END $$;

-- Create contract_documents table
CREATE TABLE IF NOT EXISTS contract_documents (
  document_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id text NOT NULL REFERENCES dim_contract(contract_id) ON DELETE CASCADE,
  document_name text NOT NULL,
  document_type text NOT NULL CHECK (document_type IN ('Datasheet', 'Brochure', 'Certificate', 'Technical Drawing', 'User Manual', 'Warranty', 'Specification Sheet', 'Test Report', 'Other')),
  document_url text NOT NULL,
  document_description text,
  file_size_kb integer,
  mime_type text,
  version text DEFAULT '1.0',
  uploaded_by text,
  upload_date timestamptz DEFAULT now(),
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on contract_documents
ALTER TABLE contract_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contract_documents
CREATE POLICY "Anyone can view public documents"
  ON contract_documents FOR SELECT
  USING (is_public = true);

CREATE POLICY "Authenticated users can create documents"
  ON contract_documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update documents"
  ON contract_documents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete documents"
  ON contract_documents FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contract_documents_contract_id ON contract_documents(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_documents_type ON contract_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_material_specifications ON dim_material USING gin(specifications);

-- Populate sample specifications for existing materials
UPDATE dim_material
SET
  specifications = jsonb_build_object(
    'voltage_rating', '150 kV',
    'power_rating', '150 MVA',
    'frequency', '50 Hz',
    'cooling_type', 'ONAN/ONAF',
    'vector_group', 'YNyn0',
    'weight', '85000 kg',
    'dimensions', '6.5m x 3.2m x 4.8m',
    'insulation_class', 'A',
    'temperature_rise', '65°C'
  ),
  technical_details = 'Three-phase power transformer designed for high voltage transmission applications. Features advanced cooling system with forced air and natural oil circulation. Complies with IEC 60076 standards.',
  compliance_certifications = ARRAY['IEC 60076', 'IEEE C57.12.00', 'ISO 9001:2015', 'SPLN']
WHERE material_id = 'MAT-001';

UPDATE dim_material
SET
  specifications = jsonb_build_object(
    'power_output', '100 MW',
    'fuel_type', 'Natural Gas',
    'efficiency', '38.5%',
    'heat_rate', '9350 BTU/kWh',
    'emissions_nox', '< 25 ppm',
    'startup_time', '10 minutes',
    'weight', '120000 kg',
    'dimensions', '12m x 5m x 6m'
  ),
  technical_details = 'Advanced combined cycle gas turbine generator with low emissions technology. Features rapid start capability and excellent part-load efficiency. Ideal for peak load and intermediate duty applications.',
  compliance_certifications = ARRAY['ISO 9001:2015', 'API 616', 'ASME', 'EPA Tier 4']
WHERE material_id = 'MAT-002';

UPDATE dim_material
SET
  specifications = jsonb_build_object(
    'voltage_rating', '150 kV',
    'rated_current', '2000 A',
    'breaking_current', '40 kA',
    'insulation_medium', 'SF6 Gas',
    'operating_mechanism', 'Spring',
    'weight', '3200 kg',
    'dimensions', '2.8m x 1.2m x 2.5m',
    'operating_temperature', '-40°C to +50°C'
  ),
  technical_details = 'SF6 gas-insulated circuit breaker with spring operating mechanism. Features high breaking capacity and excellent performance in harsh environments. Maintenance-free design with sealed gas compartment.',
  compliance_certifications = ARRAY['IEC 62271-100', 'IEEE C37.04', 'ISO 9001:2015']
WHERE material_id = 'MAT-003';

UPDATE dim_material
SET
  specifications = jsonb_build_object(
    'voltage_rating', '150 kV',
    'conductor_size', '1x800 mm²',
    'insulation_type', 'XLPE',
    'screen_type', 'Copper Wire',
    'outer_sheath', 'PE',
    'max_temperature', '90°C',
    'bending_radius', '3500 mm',
    'weight_per_meter', '15.2 kg/m'
  ),
  technical_details = 'Cross-linked polyethylene insulated high voltage power cable suitable for underground transmission. Features excellent electrical properties and long service life. UV-resistant outer sheath.',
  compliance_certifications = ARRAY['IEC 60502', 'IEEE 48', 'SPLN T1.002']
WHERE material_id = 'MAT-004';

-- Populate delivery information for contracts
UPDATE dim_contract
SET
  lead_time_days = 120,
  delivery_notes = 'Delivery requires specialized transportation. Site preparation must be completed before delivery. Installation support available upon request.',
  shipping_options = jsonb_build_array(
    jsonb_build_object('method', 'Heavy Cargo Truck', 'duration_days', 7, 'cost', 25000000),
    jsonb_build_object('method', 'Rail Transport', 'duration_days', 14, 'cost', 18000000)
  )
WHERE material_id = 'MAT-001';

UPDATE dim_contract
SET
  lead_time_days = 240,
  delivery_notes = 'Factory acceptance test required before shipment. Requires crane for offloading. Technical team available for installation and commissioning.',
  shipping_options = jsonb_build_array(
    jsonb_build_object('method', 'Sea Freight + Heavy Transport', 'duration_days', 45, 'cost', 150000000)
  )
WHERE material_id = 'MAT-002';

UPDATE dim_contract
SET
  lead_time_days = 60,
  delivery_notes = 'Standard delivery with protective packaging. Installation manual included. Technical support available remotely.',
  shipping_options = jsonb_build_array(
    jsonb_build_object('method', 'Standard Truck', 'duration_days', 5, 'cost', 5000000),
    jsonb_build_object('method', 'Express Delivery', 'duration_days', 2, 'cost', 8500000)
  )
WHERE material_id = 'MAT-003';

-- Enhance vendor contact information
UPDATE dim_vendor
SET
  vendor_email = 'procurement@trafonusantara.co.id',
  vendor_phone = '+62 21 8934 5000',
  vendor_website = 'https://www.trafonusantara.co.id',
  vendor_primary_contact = 'Ir. Budi Santoso - Sales Manager',
  vendor_alternate_contact = 'Dewi Kusuma - Technical Support',
  vendor_location = jsonb_build_object(
    'latitude', -6.3271,
    'longitude', 107.1503,
    'address', 'Jl. Industri Raya No. 15, Kawasan Industri Jababeka',
    'city', 'Cikarang',
    'province', 'Jawa Barat'
  )
WHERE vendor_id = 'VEN-001';

UPDATE dim_vendor
SET
  vendor_email = 'sales.indonesia@ge.com',
  vendor_phone = '+62 21 5091 8000',
  vendor_website = 'https://www.ge.com/gas-power',
  vendor_primary_contact = 'Agus Wijaya, M.Eng - Account Manager',
  vendor_alternate_contact = 'Sarah Johnson - Technical Director',
  vendor_location = jsonb_build_object(
    'latitude', -6.2088,
    'longitude', 106.8456,
    'address', 'Menara Astra, Jl. Jend. Sudirman Kav 5-6',
    'city', 'Jakarta',
    'province', 'DKI Jakarta'
  )
WHERE vendor_id = 'VEN-002';

UPDATE dim_vendor
SET
  vendor_email = 'energy.indonesia@siemens.com',
  vendor_phone = '+62 21 5091 5000',
  vendor_website = 'https://www.siemens.com/id',
  vendor_primary_contact = 'Dr. Siti Rahayu - Business Development',
  vendor_alternate_contact = 'Michael Schmidt - Technical Consultant',
  vendor_location = jsonb_build_object(
    'latitude', -6.2088,
    'longitude', 106.8456,
    'address', 'World Trade Center 6, Jl. Jend. Sudirman Kav. 29-31',
    'city', 'Jakarta',
    'province', 'DKI Jakarta'
  )
WHERE vendor_id = 'VEN-003';

-- Insert sample contract documents
INSERT INTO contract_documents (contract_id, document_name, document_type, document_url, document_description, file_size_kb, mime_type)
VALUES
  ('CON-001', 'Power Transformer Technical Datasheet', 'Datasheet', '/documents/power-transformer-150mva-datasheet.pdf', 'Complete technical specifications and performance data', 2450, 'application/pdf'),
  ('CON-001', 'IEC 60076 Compliance Certificate', 'Certificate', '/documents/iec-60076-certificate.pdf', 'International standard compliance certification', 850, 'application/pdf'),
  ('CON-001', 'Installation and Maintenance Manual', 'User Manual', '/documents/transformer-installation-manual.pdf', 'Comprehensive installation, operation and maintenance guide', 5600, 'application/pdf'),
  ('CON-001', 'Factory Test Report', 'Test Report', '/documents/transformer-test-report.pdf', 'Factory acceptance test results and quality verification', 1200, 'application/pdf'),
  ('CON-002', 'Gas Turbine Product Brochure', 'Brochure', '/documents/gas-turbine-100mw-brochure.pdf', 'Marketing brochure with key features and benefits', 3200, 'application/pdf'),
  ('CON-002', 'Technical Specification Sheet', 'Specification Sheet', '/documents/gas-turbine-specs.pdf', 'Detailed technical specifications and drawings', 4100, 'application/pdf'),
  ('CON-002', 'EPA Tier 4 Certificate', 'Certificate', '/documents/epa-tier4-certificate.pdf', 'Environmental compliance certification', 650, 'application/pdf'),
  ('CON-002', 'Warranty Information', 'Warranty', '/documents/gas-turbine-warranty.pdf', '5-year comprehensive warranty terms and conditions', 450, 'application/pdf'),
  ('CON-003', 'Circuit Breaker Datasheet', 'Datasheet', '/documents/circuit-breaker-150kv-datasheet.pdf', 'Technical specifications and electrical characteristics', 1800, 'application/pdf'),
  ('CON-003', 'IEC 62271-100 Certificate', 'Certificate', '/documents/iec-62271-certificate.pdf', 'High-voltage switchgear standard certification', 720, 'application/pdf'),
  ('CON-003', 'Assembly Drawing', 'Technical Drawing', '/documents/circuit-breaker-assembly.pdf', 'Detailed assembly and dimensional drawings', 2200, 'application/pdf')
ON CONFLICT DO NOTHING;
