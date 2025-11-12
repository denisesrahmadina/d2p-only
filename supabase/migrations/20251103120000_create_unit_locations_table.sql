/*
  # Create Unit Locations Table for PLN Indonesia Power Business Units

  1. New Tables
    - `unit_locations`
      - `id` (uuid, primary key) - Unique identifier
      - `unit_id` (varchar) - Business unit identifier
      - `name` (varchar) - Business unit name
      - `type` (varchar) - Type of unit (HEAD OFFICE, UBP, etc.)
      - `full_name` (text) - Full business unit name
      - `address` (text) - Full street address
      - `city` (varchar) - City/regency name
      - `province` (varchar) - Province name
      - `region` (varchar) - Region classification
      - `postal_code` (varchar) - Postal code
      - `latitude` (decimal) - Latitude coordinate
      - `longitude` (decimal) - Longitude coordinate
      - `health_index` (decimal) - Performance health score (0-100)
      - `category` (varchar) - Unit category
      - `capacity_mw` (decimal) - Installed capacity in megawatts
      - `plant_type` (varchar) - Type of power plant
      - `commission_year` (int) - Year commissioned
      - `is_active` (boolean) - Active status
      - `created_at` (timestamp) - Record creation timestamp
      - `updated_at` (timestamp) - Record update timestamp

  2. Security
    - Enable RLS on `unit_locations` table
    - Add policy for anonymous read access
    - Add policy for authenticated full access

  3. Data
    - Populate with 36+ PLN Indonesia Power business unit locations
    - Include accurate coordinates for all major units across Indonesia
    - Include health index scores from existing data
*/

-- Create unit_locations table
CREATE TABLE IF NOT EXISTS unit_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL,
  full_name TEXT,
  address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  region VARCHAR(100),
  postal_code VARCHAR(20),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  health_index NUMERIC(5,2) DEFAULT 85.00,
  category TEXT DEFAULT 'Power Generation',
  capacity_mw DECIMAL(10, 2),
  plant_type VARCHAR(100),
  commission_year INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_unit_locations_name ON unit_locations(name);
CREATE INDEX IF NOT EXISTS idx_unit_locations_type ON unit_locations(type);
CREATE INDEX IF NOT EXISTS idx_unit_locations_province ON unit_locations(province);
CREATE INDEX IF NOT EXISTS idx_unit_locations_health_index ON unit_locations(health_index);
CREATE INDEX IF NOT EXISTS idx_unit_locations_coordinates ON unit_locations(latitude, longitude);

-- Enable Row Level Security
ALTER TABLE unit_locations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow anonymous read access to unit_locations"
  ON unit_locations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to unit_locations"
  ON unit_locations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert comprehensive PLN Indonesia Power business unit data with accurate coordinates
INSERT INTO unit_locations (unit_id, name, type, full_name, address, city, province, region, latitude, longitude, health_index, category, capacity_mw, plant_type, commission_year) VALUES
-- Head Office
('HO-001', 'HEAD OFFICE', 'HEAD OFFICE', 'PT PLN Indonesia Power - Kantor Pusat', 'Jl. KS. Tubun No.13, Slipi, Jakarta Barat', 'Jakarta Barat', 'DKI Jakarta', 'Java', -6.196694, 106.793333, 92.5, 'Corporate', NULL, NULL, NULL),

-- Java Region Units
('UBP-SRY', 'UBP Suralaya', 'UBP', 'Unit Bisnis Pembangkitan Suralaya', 'Jl. Raya Suralaya, Pulomerak, Cilegon', 'Cilegon', 'Banten', 'Java', -6.035556, 105.931944, 91.5, 'Power Generation', 3400.0, 'PLTU - Coal', 1984),
('UBP-LBN', 'UBP Labuan', 'UBP', 'Unit Bisnis Pembangkitan Labuan', 'Desa Teluk Lada, Labuan, Pandeglang', 'Pandeglang', 'Banten', 'Java', -6.379444, 105.747500, 87.3, 'Power Generation', 600.0, 'PLTU - Coal', 2006),
('UBP-LTR', 'UBP Lontar', 'UBP', 'Unit Bisnis Pembangkitan Lontar', 'Desa Lontar, Kemiri, Tangerang', 'Tangerang', 'Banten', 'Java', -6.058056, 106.395000, 89.8, 'Power Generation', 945.0, 'PLTU - Coal', 2012),
('UBP-PRK', 'UBP Priok', 'UBP', 'Unit Bisnis Pembangkitan Priok', 'Jl. Enggano, Tanjung Priok, Jakarta Utara', 'Jakarta Utara', 'DKI Jakarta', 'Java', -6.106111, 106.891111, 88.7, 'Power Generation', 1196.0, 'PLTGU/PLTD', 1983),
('UBP-SGG', 'UBP Saguling', 'UBP', 'Unit Bisnis Pembangkitan Saguling', 'Desa Girimukti, Saguling, Bandung Barat', 'Bandung Barat', 'Jawa Barat', 'Java', -6.862778, 107.373889, 90.2, 'Power Generation', 700.0, 'PLTA - Hydro', 1985),
('UBP-KMJ', 'UBP Kamojang', 'UBP', 'Unit Bisnis Pembangkitan Kamojang', 'Desa Laksana, Ibun, Bandung', 'Bandung', 'Jawa Barat', 'Java', -7.137222, 107.796389, 73.8, 'Power Generation', 235.0, 'PLTP - Geothermal', 1983),
('UBP-PBR', 'UBP Pelabuhan Ratu', 'UBP', 'Unit Bisnis Pembangkitan Pelabuhan Ratu', 'Desa Buniwangi, Pelabuhan Ratu, Sukabumi', 'Sukabumi', 'Jawa Barat', 'Java', -6.988056, 106.533889, 75.6, 'Power Generation', 1050.0, 'PLTU - Coal', 2011),
('UBP-ADP', 'UBP Adipala', 'UBP', 'Unit Bisnis Pembangkitan Adipala', 'Desa Adipala, Cilacap', 'Cilacap', 'Jawa Tengah', 'Java', -7.722778, 109.091944, 88.3, 'Power Generation', 660.0, 'PLTU - Coal', 2012),
('UBP-GRT', 'UBP Grati', 'UBP', 'Unit Bisnis Pembangkitan Grati', 'Desa Grati, Pasuruan', 'Pasuruan', 'Jawa Timur', 'Java', -7.762222, 113.019722, 79.3, 'Power Generation', 300.0, 'PLTGU', 1996),
('UBP-PRK2', 'UBP Perak', 'UBP', 'Unit Bisnis Pembangkitan Perak', 'Jl. Perak Timur, Surabaya', 'Surabaya', 'Jawa Timur', 'Java', -7.212778, 112.722500, 86.5, 'Power Generation', 564.0, 'PLTGU', 1999),

-- Sumatra Region Units
('UBP-BKL', 'UBP Belawan', 'UBP', 'Unit Bisnis Pembangkitan Belawan', 'Jl. Yos Sudarso, Belawan, Medan', 'Medan', 'Sumatera Utara', 'Sumatra', 3.780833, 98.684722, 85.9, 'Power Generation', 210.0, 'PLTGU', 1990),
('UBP-PSU', 'UBP Pangkalan Susu', 'UBP', 'Unit Bisnis Pembangkitan Pangkalan Susu', 'Desa Pangkalan Susu, Langkat', 'Langkat', 'Sumatera Utara', 'Sumatra', 4.057222, 98.316111, 82.4, 'Power Generation', 400.0, 'PLTU - Coal', 2015),
('UBP-KRY', 'UBP Keramasan', 'UBP', 'Unit Bisnis Pembangkitan Keramasan', 'Desa Keramasan, Palembang', 'Palembang', 'Sumatera Selatan', 'Sumatra', -3.041667, 104.759722, 86.4, 'Power Generation', 310.0, 'PLTU - Coal', 2006),
('UBP-BML', 'UBP Bukit Asam', 'UBP', 'Unit Bisnis Pembangkitan Bukit Asam', 'Tanjung Enim, Muara Enim', 'Muara Enim', 'Sumatera Selatan', 'Sumatra', -3.650833, 103.899167, 84.1, 'Power Generation', 130.0, 'PLTU - Coal', 2012),
('UBP-BNG', 'UBP Bengkulu', 'UBP', 'Unit Bisnis Pembangkitan Bengkulu', 'Desa Pulau Baai, Bengkulu', 'Bengkulu', 'Bengkulu', 'Sumatra', -3.767778, 102.268333, 78.9, 'Power Generation', 100.0, 'PLTU - Coal', 2012),
('UBP-PLM', 'UBP Paiton', 'UBP', 'Unit Bisnis Pembangkitan Paiton', 'Desa Paiton, Probolinggo', 'Probolinggo', 'Jawa Timur', 'Java', -7.731667, 113.473611, 81.9, 'Power Generation', 800.0, 'PLTU - Coal', 1999),

-- Kalimantan Region Units
('UBP-ASM', 'UBP Asam-asam', 'UBP', 'Unit Bisnis Pembangkitan Asam-asam', 'Desa Asam-asam, Tanah Laut', 'Tanah Laut', 'Kalimantan Selatan', 'Kalimantan', -3.985000, 115.484444, 91.7, 'Power Generation', 130.0, 'PLTU - Coal', 2004),
('UBP-BKP', 'UBP Balikpapan', 'UBP', 'Unit Bisnis Pembangkitan Balikpapan', 'Jl. Jend. Sudirman, Balikpapan', 'Balikpapan', 'Kalimantan Timur', 'Kalimantan', -1.262778, 116.829444, 83.6, 'Power Generation', 120.0, 'PLTD', 1985),
('UBP-SMD', 'UBP Samarinda', 'UBP', 'Unit Bisnis Pembangkitan Samarinda', 'Jl. MT Haryono, Samarinda', 'Samarinda', 'Kalimantan Timur', 'Kalimantan', -0.502106, 117.153709, 80.7, 'Power Generation', 85.0, 'PLTD', 1988),

-- Sulawesi Region Units
('UBP-MKS', 'UBP Makassar', 'UBP', 'Unit Bisnis Pembangkitan Makassar', 'Jl. Perintis Kemerdekaan, Makassar', 'Makassar', 'Sulawesi Selatan', 'Sulawesi', -5.147778, 119.437222, 89.9, 'Power Generation', 165.0, 'PLTD', 1983),
('UBP-JRH', 'UBP Jeneponto', 'UBP', 'Unit Bisnis Pembangkitan Jeneponto', 'Desa Tamalatea, Jeneponto', 'Jeneponto', 'Sulawesi Selatan', 'Sulawesi', -5.709167, 119.756111, 90.6, 'Power Generation', 100.0, 'PLTU - Coal', 2011),
('UBP-BRU', 'UBP Barru', 'UBP', 'Unit Bisnis Pembangkitan Barru', 'Desa Sumpang Binangae, Barru', 'Barru', 'Sulawesi Selatan', 'Sulawesi', -4.420556, 119.641111, 85.3, 'Power Generation', 100.0, 'PLTU - Coal', 2014),
('UBP-PMK', 'UBP Poso', 'UBP', 'Unit Bisnis Pembangkitan Poso', 'Desa Pamona, Poso', 'Poso', 'Sulawesi Tengah', 'Sulawesi', -1.397778, 120.752500, 89.2, 'Power Generation', 195.0, 'PLTA - Hydro', 2012),
('UBP-BEU', 'UBP Bitung', 'UBP', 'Unit Bisnis Pembangkitan Bitung', 'Desa Aertembaga, Bitung', 'Bitung', 'Sulawesi Utara', 'Sulawesi', 1.452500, 125.188611, 76.4, 'Power Generation', 100.0, 'PLTD', 1992),

-- Bali & Nusa Tenggara Region Units
('UBP-PSG', 'UBP Pesanggaran', 'UBP', 'Unit Bisnis Pembangkitan Pesanggaran', 'Desa Pesanggaran, Denpasar', 'Denpasar', 'Bali', 'Bali-Nusa Tenggara', -8.726111, 115.225556, 88.5, 'Power Generation', 230.0, 'PLTD/PLTG', 1986),
('UBP-PML', 'UBP Pemaron', 'UBP', 'Unit Bisnis Pembangkitan Pemaron', 'Desa Pemaron, Buleleng', 'Buleleng', 'Bali', 'Bali-Nusa Tenggara', -8.118056, 114.631667, 87.2, 'Power Generation', 110.0, 'PLTG', 1995),
('UBP-GLM', 'UBP Gilimanuk', 'UBP', 'Unit Bisnis Pembangkitan Gilimanuk', 'Desa Gilimanuk, Jembrana', 'Jembrana', 'Bali', 'Bali-Nusa Tenggara', -8.163889, 114.442222, 84.8, 'Power Generation', 100.0, 'PLTG', 1996),
('UBP-MPL', 'UBP Mataram', 'UBP', 'Unit Bisnis Pembangkitan Mataram', 'Jl. Tgh Ibrahim Khalidy, Mataram', 'Mataram', 'Nusa Tenggara Barat', 'Bali-Nusa Tenggara', -8.583333, 116.116667, 91.3, 'Power Generation', 50.0, 'PLTD', 1990),
('UBP-BM', 'UBP Bima', 'UBP', 'Unit Bisnis Pembangkitan Bima', 'Desa Sape, Bima', 'Bima', 'Nusa Tenggara Barat', 'Bali-Nusa Tenggara', -8.467222, 118.716667, 82.5, 'Power Generation', 30.0, 'PLTD', 1995),
('UBP-KPG', 'UBP Kupang', 'UBP', 'Unit Bisnis Pembangkitan Kupang', 'Jl. Perintis Kemerdekaan, Kupang', 'Kupang', 'Nusa Tenggara Timur', 'Bali-Nusa Tenggara', -10.178611, 123.597222, 79.4, 'Power Generation', 50.0, 'PLTD', 1988),

-- Maluku & Papua Region Units
('UBP-AMB', 'UBP Ambon', 'UBP', 'Unit Bisnis Pembangkitan Ambon', 'Jl. Patimura, Ambon', 'Ambon', 'Maluku', 'Maluku-Papua', -3.695278, 128.181389, 81.3, 'Power Generation', 80.0, 'PLTD', 1990),
('UBP-TTE', 'UBP Ternate', 'UBP', 'Unit Bisnis Pembangkitan Ternate', 'Jl. Bastiong, Ternate', 'Ternate', 'Maluku Utara', 'Maluku-Papua', 0.788889, 127.378333, 78.6, 'Power Generation', 50.0, 'PLTD', 1992),
('UBP-SRG', 'UBP Sorong', 'UBP', 'Unit Bisnis Pembangkitan Sorong', 'Jl. Basuki Rahmat, Sorong', 'Sorong', 'Papua Barat', 'Maluku-Papua', -0.866667, 131.252778, 76.9, 'Power Generation', 50.0, 'PLTD', 1995),
('UBP-JYP', 'UBP Jayapura', 'UBP', 'Unit Bisnis Pembangkitan Jayapura', 'Jl. Koti, Jayapura', 'Jayapura', 'Papua', 'Maluku-Papua', -2.533333, 140.716667, 77.8, 'Power Generation', 80.0, 'PLTD', 1991),

-- Additional Strategic Units
('UBP-BTG', 'UBP Bontang', 'UBP', 'Unit Bisnis Pembangkitan Bontang', 'Desa Bontang Lestari, Bontang', 'Bontang', 'Kalimantan Timur', 'Kalimantan', 0.116944, 117.482222, 68.5, 'Power Generation', 100.0, 'PLTD', 1986),
('UBP-MSK', 'UBP Manokwari', 'UBP', 'Unit Bisnis Pembangkitan Manokwari', 'Jl. Yos Sudarso, Manokwari', 'Manokwari', 'Papua Barat', 'Maluku-Papua', -0.862778, 134.083889, 66.8, 'Power Generation', 30.0, 'PLTD', 1993)

ON CONFLICT (unit_id) DO UPDATE SET
  name = EXCLUDED.name,
  full_name = EXCLUDED.full_name,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  province = EXCLUDED.province,
  region = EXCLUDED.region,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  health_index = EXCLUDED.health_index,
  category = EXCLUDED.category,
  capacity_mw = EXCLUDED.capacity_mw,
  plant_type = EXCLUDED.plant_type,
  updated_at = NOW();

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_unit_locations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_unit_locations_updated_at ON unit_locations;
CREATE TRIGGER trigger_update_unit_locations_updated_at
  BEFORE UPDATE ON unit_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_unit_locations_updated_at();
