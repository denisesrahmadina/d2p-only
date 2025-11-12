/*
  # Marketplace Tables with Pricing Data

  1. New Tables
    - `dim_material`
      - Material master data with descriptions, categories, and pricing
      - Unit of measure, material types, and classification hierarchy
      - Map prices and active status flags

    - `dim_vendor`
      - Vendor master data with company information
      - Contact details, categories, and ratings
      - Address and performance metrics

    - `dim_contract`
      - Contract master data linking vendors and materials
      - Contract scope, status, dates, and value limits
      - Bill of Quantities (BOQ) with item-level pricing
      - Terms of Payment (TOP) and milestone tracking
      - Digital and wet signature tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Authenticated users can create and update records

  3. Important Notes
    - All prices in IDR (Indonesian Rupiah)
    - BOQ structure includes item, quantity, unit_price, unit, available_quantity
    - Contract status: Active, Draft, Expired, Suspended
    - Supports multi-currency for future expansion
*/

-- Create dim_material table
CREATE TABLE IF NOT EXISTS dim_material (
  material_id text PRIMARY KEY,
  material_description text NOT NULL,
  material_category text,
  material_category_sa text,
  material_category_level1 text,
  material_category_level2 text,
  material_map_price text,
  unit_of_measure text NOT NULL,
  material_type text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create dim_vendor table
CREATE TABLE IF NOT EXISTS dim_vendor (
  vendor_id text PRIMARY KEY,
  vendor_name text NOT NULL,
  vendor_category text,
  vendor_address text,
  vendor_contact text,
  vendor_rating numeric DEFAULT 0 CHECK (vendor_rating >= 0 AND vendor_rating <= 5),
  vendor_email text,
  vendor_phone text,
  vendor_city text,
  vendor_province text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create dim_contract table
CREATE TABLE IF NOT EXISTS dim_contract (
  contract_id text PRIMARY KEY,
  contract_number text NOT NULL UNIQUE,
  contract_scope text NOT NULL,
  contract_status text NOT NULL DEFAULT 'Active' CHECK (contract_status IN ('Active', 'Expired', 'Suspended', 'Draft')),
  contract_start_date date NOT NULL,
  contract_end_date date NOT NULL,
  contract_value_limit numeric NOT NULL DEFAULT 0,
  contract_currency text NOT NULL DEFAULT 'IDR',
  contract_boq jsonb DEFAULT '[]'::jsonb,
  contract_milestone jsonb DEFAULT '[]'::jsonb,
  contract_top jsonb DEFAULT '[]'::jsonb,
  material_id text NOT NULL REFERENCES dim_material(material_id),
  vendor_id text NOT NULL REFERENCES dim_vendor(vendor_id),
  digital_sign_wet_sign text,
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE dim_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_vendor ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_contract ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dim_material
CREATE POLICY "Anyone can view materials"
  ON dim_material FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create materials"
  ON dim_material FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update materials"
  ON dim_material FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for dim_vendor
CREATE POLICY "Anyone can view vendors"
  ON dim_vendor FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create vendors"
  ON dim_vendor FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update vendors"
  ON dim_vendor FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for dim_contract
CREATE POLICY "Anyone can view contracts"
  ON dim_contract FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create contracts"
  ON dim_contract FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update contracts"
  ON dim_contract FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_material_category ON dim_material(material_category);
CREATE INDEX IF NOT EXISTS idx_material_active ON dim_material(is_active);
CREATE INDEX IF NOT EXISTS idx_vendor_category ON dim_vendor(vendor_category);
CREATE INDEX IF NOT EXISTS idx_vendor_rating ON dim_vendor(vendor_rating);
CREATE INDEX IF NOT EXISTS idx_contract_status ON dim_contract(contract_status);
CREATE INDEX IF NOT EXISTS idx_contract_material_id ON dim_contract(material_id);
CREATE INDEX IF NOT EXISTS idx_contract_vendor_id ON dim_contract(vendor_id);
CREATE INDEX IF NOT EXISTS idx_contract_dates ON dim_contract(contract_start_date, contract_end_date);
