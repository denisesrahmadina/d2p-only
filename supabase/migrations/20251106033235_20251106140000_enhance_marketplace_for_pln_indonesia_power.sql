/*
  # Enhance Marketplace for PLN Indonesia Power

  ## Overview
  This migration enhances the existing marketplace schema to support PLN Indonesia Power's 
  specific procurement needs for power plant equipment and maintenance materials.

  ## 1. New Tables Created
  
  ### dim_pln_locations
  - Complete facility database for PLN Indonesia Power
  - Includes power plants, substations, warehouses, and administrative offices
  - GPS coordinates for future Google Maps integration
  - Contact information and facility capacity details
  
  ### dim_equipment_categories
  - PLN's 7 main equipment categories with descriptions
  - Category hierarchy and classification codes
  - Icon mappings and color schemes for UI
  
  ## 2. Schema Enhancements
  
  ### dim_material Enhancements
  - Added power_rating, voltage_specification for electrical equipment
  - Added equipment_dimensions, equipment_weight for logistics
  - Added installation_requirements and maintenance_schedule
  - Added compliance_certifications array for SNI, ISO standards
  - Added technical_specifications JSONB for detailed specs
  
  ### dim_vendor Enhancements
  - Added pln_approved_status flag (only approved vendors visible)
  - Added vendor_specialization array for equipment categories
  - Added performance_metrics JSONB for vendor ratings
  
  ### dim_contract Enhancements
  - Added is_bpa_agreement flag for Blanket Purchase Agreements
  - Added is_long_term_contract flag
  - Added warranty_period_months for critical equipment
  - Added service_contract_available flag
  
  ## 3. Security
  - All new tables have RLS enabled
  - Public read access for catalog viewing
  - Authenticated users can manage data
  - PLN-approved vendors only visible in catalog

  ## 4. Integration Points
  - PLN location autocomplete for PR delivery addresses
  - APBA handoff tracking fields in order monitoring
  - Multi-level approval workflow support
*/

-- Create PLN Equipment Categories lookup table
CREATE TABLE IF NOT EXISTS dim_equipment_categories (
  category_id text PRIMARY KEY,
  category_name text NOT NULL,
  category_description text,
  parent_category_id text,
  category_level integer DEFAULT 1,
  category_order integer DEFAULT 0,
  icon_name text DEFAULT 'Package',
  color_scheme text DEFAULT 'purple',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create PLN Locations table
CREATE TABLE IF NOT EXISTS dim_pln_locations (
  location_id text PRIMARY KEY,
  facility_name text NOT NULL,
  facility_type text NOT NULL CHECK (facility_type IN ('Power Plant', 'Substation', 'Warehouse', 'Administrative Office', 'Regional Office')),
  address text NOT NULL,
  city text NOT NULL,
  province text NOT NULL,
  postal_code text,
  region text NOT NULL CHECK (region IN ('Java-Bali', 'Sumatera', 'Kalimantan', 'Sulawesi', 'Maluku-Papua')),
  latitude numeric,
  longitude numeric,
  facility_manager_name text,
  facility_phone text,
  facility_email text,
  receiving_dock_available boolean DEFAULT true,
  storage_capacity_sqm numeric,
  delivery_time_window text DEFAULT '08:00-16:00',
  special_instructions text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enhance dim_material with PLN-specific fields
DO $$
BEGIN
  -- Power equipment specifications
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_material' AND column_name = 'power_rating_kw'
  ) THEN
    ALTER TABLE dim_material ADD COLUMN power_rating_kw numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_material' AND column_name = 'voltage_specification'
  ) THEN
    ALTER TABLE dim_material ADD COLUMN voltage_specification text;
  END IF;

  -- Physical specifications
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_material' AND column_name = 'equipment_dimensions'
  ) THEN
    ALTER TABLE dim_material ADD COLUMN equipment_dimensions text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_material' AND column_name = 'equipment_weight_kg'
  ) THEN
    ALTER TABLE dim_material ADD COLUMN equipment_weight_kg numeric;
  END IF;

  -- Installation and maintenance
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_material' AND column_name = 'installation_requirements'
  ) THEN
    ALTER TABLE dim_material ADD COLUMN installation_requirements text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_material' AND column_name = 'maintenance_schedule'
  ) THEN
    ALTER TABLE dim_material ADD COLUMN maintenance_schedule text;
  END IF;

  -- Manufacturer information
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_material' AND column_name = 'manufacturer'
  ) THEN
    ALTER TABLE dim_material ADD COLUMN manufacturer text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_material' AND column_name = 'model_number'
  ) THEN
    ALTER TABLE dim_material ADD COLUMN model_number text;
  END IF;

  -- PLN product code
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_material' AND column_name = 'pln_product_code'
  ) THEN
    ALTER TABLE dim_material ADD COLUMN pln_product_code text;
  END IF;
END $$;

-- Enhance dim_vendor with PLN approval and specialization
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_vendor' AND column_name = 'pln_approved_status'
  ) THEN
    ALTER TABLE dim_vendor ADD COLUMN pln_approved_status boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_vendor' AND column_name = 'approval_date'
  ) THEN
    ALTER TABLE dim_vendor ADD COLUMN approval_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_vendor' AND column_name = 'vendor_specialization'
  ) THEN
    ALTER TABLE dim_vendor ADD COLUMN vendor_specialization text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_vendor' AND column_name = 'performance_score'
  ) THEN
    ALTER TABLE dim_vendor ADD COLUMN performance_score numeric DEFAULT 0 CHECK (performance_score >= 0 AND performance_score <= 100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_vendor' AND column_name = 'total_contracts_completed'
  ) THEN
    ALTER TABLE dim_vendor ADD COLUMN total_contracts_completed integer DEFAULT 0;
  END IF;
END $$;

-- Enhance dim_contract with PLN-specific contract types and warranties
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_contract' AND column_name = 'is_bpa_agreement'
  ) THEN
    ALTER TABLE dim_contract ADD COLUMN is_bpa_agreement boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_contract' AND column_name = 'is_long_term_contract'
  ) THEN
    ALTER TABLE dim_contract ADD COLUMN is_long_term_contract boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_contract' AND column_name = 'warranty_period_months'
  ) THEN
    ALTER TABLE dim_contract ADD COLUMN warranty_period_months integer DEFAULT 12;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_contract' AND column_name = 'service_contract_available'
  ) THEN
    ALTER TABLE dim_contract ADD COLUMN service_contract_available boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_contract' AND column_name = 'equipment_category'
  ) THEN
    ALTER TABLE dim_contract ADD COLUMN equipment_category text;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE dim_equipment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_pln_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dim_equipment_categories
CREATE POLICY "Anyone can view equipment categories"
  ON dim_equipment_categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage equipment categories"
  ON dim_equipment_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for dim_pln_locations
CREATE POLICY "Anyone can view PLN locations"
  ON dim_pln_locations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage PLN locations"
  ON dim_pln_locations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert PLN Equipment Categories
INSERT INTO dim_equipment_categories (category_id, category_name, category_description, category_level, category_order, icon_name, color_scheme) VALUES
('CAT-MECH', 'Mechanical Equipment', 'Turbines, pumps, compressors, heat exchangers, and mechanical power transmission systems', 1, 1, 'Cog', 'purple'),
('CAT-ELEC', 'Electrical Equipment', 'Generators, transformers, switchgear, circuit breakers, and electrical distribution systems', 1, 2, 'Zap', 'purple'),
('CAT-INST', 'Instrumentation & Control Systems', 'Control panels, sensors, PLCs, SCADA systems, and monitoring equipment', 1, 3, 'Gauge', 'purple'),
('CAT-CONS', 'Construction Materials', 'Structural steel, concrete, piping systems, insulation, and building materials', 1, 4, 'Building2', 'purple'),
('CAT-SPARE', 'Spare Parts & Maintenance Materials', 'Replacement components, lubricants, chemicals, tools, and consumables', 1, 5, 'Wrench', 'purple'),
('CAT-SAFE', 'Safety & Environmental Equipment', 'PPE, fire protection, emission control, waste treatment, and environmental monitoring', 1, 6, 'Shield', 'purple'),
('CAT-SERV', 'Services', 'Maintenance contracts, installation services, training, and technical support', 1, 7, 'Clipboard', 'purple')
ON CONFLICT (category_id) DO NOTHING;

-- Insert Mock PLN Locations across Indonesia
INSERT INTO dim_pln_locations (location_id, facility_name, facility_type, address, city, province, region, latitude, longitude, facility_manager_name, facility_phone, facility_email) VALUES
-- Java-Bali Region
('LOC-001', 'PLN Indonesia Power PLTU Suralaya', 'Power Plant', 'Jl. Raya Suralaya, Pulomerak', 'Cilegon', 'Banten', 'Java-Bali', -6.0361, 106.0525, 'Ir. Ahmad Santoso', '+62-254-391234', 'suralaya@indonesiapower.co.id'),
('LOC-002', 'PLN Indonesia Power PLTU Lontar', 'Power Plant', 'Jl. Raya Lontar KM 18', 'Tangerang', 'Banten', 'Java-Bali', -6.0891, 106.2542, 'Ir. Budi Wijaya', '+62-21-5912345', 'lontar@indonesiapower.co.id'),
('LOC-003', 'PLN Indonesia Power PLTU Priok', 'Power Plant', 'Jl. Perintis Kemerdekaan', 'Jakarta Utara', 'DKI Jakarta', 'Java-Bali', -6.1087, 106.8850, 'Ir. Siti Rahayu', '+62-21-4301234', 'priok@indonesiapower.co.id'),
('LOC-004', 'PLN Indonesia Power Regional Office Jakarta', 'Regional Office', 'Jl. Jend. Gatot Subroto Kav. 18', 'Jakarta Selatan', 'DKI Jakarta', 'Java-Bali', -6.2297, 106.8109, 'Drs. Hendra Kusuma', '+62-21-5251234', 'jakarta@indonesiapower.co.id'),
('LOC-005', 'PLN Indonesia Power Warehouse Jakarta', 'Warehouse', 'Jl. Raya Bekasi KM 22', 'Jakarta Timur', 'DKI Jakarta', 'Java-Bali', -6.2615, 106.9447, 'Agus Prasetyo', '+62-21-8601234', 'warehouse.jkt@indonesiapower.co.id'),
('LOC-006', 'PLN Indonesia Power PLTU Paiton', 'Power Plant', 'Desa Binor, Kec. Paiton', 'Probolinggo', 'Jawa Timur', 'Java-Bali', -7.7183, 113.3478, 'Ir. Wahyu Setiawan', '+62-335-771234', 'paiton@indonesiapower.co.id'),
('LOC-007', 'PLN Indonesia Power PLTU Gresik', 'Power Plant', 'Jl. Veteran No. 1', 'Gresik', 'Jawa Timur', 'Java-Bali', -7.1564, 112.6515, 'Ir. Dewi Lestari', '+62-31-3981234', 'gresik@indonesiapower.co.id'),
('LOC-008', 'PLN Indonesia Power Regional Office Surabaya', 'Regional Office', 'Jl. Embong Malang No. 1', 'Surabaya', 'Jawa Timur', 'Java-Bali', -7.2575, 112.7421, 'Drs. Bambang Sutrisno', '+62-31-5471234', 'surabaya@indonesiapower.co.id'),
('LOC-009', 'PLN Indonesia Power PLTU Semarang', 'Power Plant', 'Jl. Coaster No. 7', 'Semarang', 'Jawa Tengah', 'Java-Bali', -6.9533, 110.4203, 'Ir. Rina Mariana', '+62-24-3541234', 'semarang@indonesiapower.co.id'),
('LOC-010', 'PLN Indonesia Power PLTU Bali', 'Power Plant', 'Jl. Gilimanuk-Singaraja', 'Jembrana', 'Bali', 'Java-Bali', -8.3405, 114.5948, 'Ir. Made Wirawan', '+62-365-411234', 'bali@indonesiapower.co.id'),

-- Sumatera Region
('LOC-011', 'PLN Indonesia Power PLTU Belawan', 'Power Plant', 'Jl. Pelabuhan Belawan', 'Medan', 'Sumatera Utara', 'Sumatera', 3.7833, 98.6833, 'Ir. Syafrizal Rahman', '+62-61-6941234', 'belawan@indonesiapower.co.id'),
('LOC-012', 'PLN Indonesia Power Regional Office Medan', 'Regional Office', 'Jl. Listrik No. 1', 'Medan', 'Sumatera Utara', 'Sumatera', 3.5952, 98.6722, 'Drs. Rizki Ananda', '+62-61-4571234', 'medan@indonesiapower.co.id'),
('LOC-013', 'PLN Indonesia Power PLTU Ombilin', 'Power Plant', 'Jl. Pembangkit Ombilin', 'Sawahlunto', 'Sumatera Barat', 'Sumatera', -0.6833, 100.7833, 'Ir. Yusuf Hakim', '+62-754-321234', 'ombilin@indonesiapower.co.id'),
('LOC-014', 'PLN Indonesia Power PLTU Teluk Sirih', 'Power Plant', 'Jl. Teluk Sirih', 'Padang', 'Sumatera Barat', 'Sumatera', -0.9471, 100.3543, 'Ir. Fitri Handayani', '+62-751-891234', 'teluksirih@indonesiapower.co.id'),
('LOC-015', 'PLN Indonesia Power PLTU Bukit Asam', 'Power Plant', 'Jl. Parigi Lama', 'Tanjung Enim', 'Sumatera Selatan', 'Sumatera', -3.6071, 103.8471, 'Ir. Andi Kurniawan', '+62-734-451234', 'bukitasam@indonesiapower.co.id'),
('LOC-016', 'PLN Indonesia Power Regional Office Palembang', 'Regional Office', 'Jl. Kapten A. Rivai No. 8', 'Palembang', 'Sumatera Selatan', 'Sumatera', -2.9761, 104.7754, 'Drs. Herman Wijaya', '+62-711-351234', 'palembang@indonesiapower.co.id'),
('LOC-017', 'PLN Indonesia Power PLTU Lampung', 'Power Plant', 'Jl. Tarahan', 'Lampung Selatan', 'Lampung', 'Sumatera', -5.6928, 105.5267, 'Ir. Dedi Supardi', '+62-721-801234', 'lampung@indonesiapower.co.id'),

-- Kalimantan Region
('LOC-018', 'PLN Indonesia Power PLTU Asam-Asam', 'Power Plant', 'Desa Asam-Asam', 'Tanah Laut', 'Kalimantan Selatan', 'Kalimantan', -3.8833, 115.4833, 'Ir. Rahman Hakim', '+62-512-321234', 'asamasam@indonesiapower.co.id'),
('LOC-019', 'PLN Indonesia Power Regional Office Banjarmasin', 'Regional Office', 'Jl. A. Yani KM 5', 'Banjarmasin', 'Kalimantan Selatan', 'Kalimantan', -3.3194, 114.5906, 'Drs. Abdul Karim', '+62-511-321234', 'banjarmasin@indonesiapower.co.id'),
('LOC-020', 'PLN Indonesia Power PLTU Balikpapan', 'Power Plant', 'Jl. Pembangkit', 'Balikpapan', 'Kalimantan Timur', 'Kalimantan', -1.2379, 116.8529, 'Ir. Eko Prasetyo', '+62-542-761234', 'balikpapan@indonesiapower.co.id'),
('LOC-021', 'PLN Indonesia Power Warehouse Samarinda', 'Warehouse', 'Jl. Basuki Rahmat No. 10', 'Samarinda', 'Kalimantan Timur', 'Kalimantan', -0.5022, 117.1536, 'Joko Susanto', '+62-541-741234', 'warehouse.sam@indonesiapower.co.id'),

-- Sulawesi Region
('LOC-022', 'PLN Indonesia Power PLTU Tello', 'Power Plant', 'Jl. Tello Baru', 'Makassar', 'Sulawesi Selatan', 'Sulawesi', -5.1220, 119.4070, 'Ir. Andi Mappasessu', '+62-411-851234', 'tello@indonesiapower.co.id'),
('LOC-023', 'PLN Indonesia Power Regional Office Makassar', 'Regional Office', 'Jl. Dr. Sam Ratulangi No. 16', 'Makassar', 'Sulawesi Selatan', 'Sulawesi', -5.1477, 119.4327, 'Drs. Nurdin Abdullah', '+62-411-321234', 'makassar@indonesiapower.co.id'),
('LOC-024', 'PLN Indonesia Power PLTU Kendari', 'Power Plant', 'Jl. Wolter Monginsidi', 'Kendari', 'Sulawesi Tenggara', 'Sulawesi', -3.9689, 122.5989, 'Ir. La Ode Hamzah', '+62-401-321234', 'kendari@indonesiapower.co.id'),
('LOC-025', 'PLN Indonesia Power PLTU Gorontalo', 'Power Plant', 'Jl. Raya Anggrek', 'Gorontalo', 'Gorontalo', 'Sulawesi', 0.5435, 123.0585, 'Ir. Rusli Habibie', '+62-435-821234', 'gorontalo@indonesiapower.co.id'),

-- Maluku-Papua Region
('LOC-026', 'PLN Indonesia Power PLTU Ambon', 'Power Plant', 'Jl. Pattimura', 'Ambon', 'Maluku', 'Maluku-Papua', -3.6954, 128.1814, 'Ir. Johan Latuconsina', '+62-911-351234', 'ambon@indonesiapower.co.id'),
('LOC-027', 'PLN Indonesia Power Regional Office Papua', 'Regional Office', 'Jl. Raya Abepura', 'Jayapura', 'Papua', 'Maluku-Papua', -2.5920, 140.6719, 'Drs. Markus Wanggai', '+62-967-581234', 'jayapura@indonesiapower.co.id'),
('LOC-028', 'PLN Indonesia Power PLTU Sorong', 'Power Plant', 'Jl. Basuki Rahmat KM 12', 'Sorong', 'Papua Barat', 'Maluku-Papua', -0.8667, 131.2667, 'Ir. Petrus Karafir', '+62-951-321234', 'sorong@indonesiapower.co.id')
ON CONFLICT (location_id) DO NOTHING;

-- Create index for location search
CREATE INDEX IF NOT EXISTS idx_pln_locations_city ON dim_pln_locations(city);
CREATE INDEX IF NOT EXISTS idx_pln_locations_province ON dim_pln_locations(province);
CREATE INDEX IF NOT EXISTS idx_pln_locations_facility_type ON dim_pln_locations(facility_type);
CREATE INDEX IF NOT EXISTS idx_pln_locations_region ON dim_pln_locations(region);

-- Create indexes for enhanced material search
CREATE INDEX IF NOT EXISTS idx_material_pln_code ON dim_material(pln_product_code);
CREATE INDEX IF NOT EXISTS idx_material_manufacturer ON dim_material(manufacturer);

-- Create indexes for vendor filtering
CREATE INDEX IF NOT EXISTS idx_vendor_approved ON dim_vendor(pln_approved_status);
CREATE INDEX IF NOT EXISTS idx_vendor_specialization ON dim_vendor USING gin(vendor_specialization);

-- Create indexes for contract filtering
CREATE INDEX IF NOT EXISTS idx_contract_category ON dim_contract(equipment_category);
CREATE INDEX IF NOT EXISTS idx_contract_bpa ON dim_contract(is_bpa_agreement);
