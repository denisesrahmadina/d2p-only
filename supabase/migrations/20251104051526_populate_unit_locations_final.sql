/*
  # Populate unit locations for inventory turnover - Final

  1. Changes
    - Insert missing unit location records with correct type field ('UNIT')
    - Support inventory turnover foreign key relationships
    
  2. Purpose
    - Enable proper display of unit information in inventory turnover panel
*/

-- Add province and region columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'unit_locations' AND column_name = 'province'
  ) THEN
    ALTER TABLE unit_locations ADD COLUMN province VARCHAR(100);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'unit_locations' AND column_name = 'region'
  ) THEN
    ALTER TABLE unit_locations ADD COLUMN region VARCHAR(100);
  END IF;
END $$;

-- Insert missing unit locations
INSERT INTO unit_locations (no, unit_id, name, type, address, province, region, latitude, longitude, health_index, category) VALUES
(101, 'UBP-SRY', 'UBP Suralaya', 'UNIT', 'Jl. Raya Suralaya, Pulomerak, Cilegon', 'Banten', 'Java', -6.035556, 105.931944, 91.5, 'Power Generation'),
(102, 'UBP-LBN', 'UBP Labuan', 'UNIT', 'Desa Teluk Lada, Labuan, Pandeglang', 'Banten', 'Java', -6.379444, 105.747500, 87.3, 'Power Generation'),
(103, 'UBP-PRK', 'UBP Priok', 'UNIT', 'Jl. Enggano, Tanjung Priok, Jakarta Utara', 'DKI Jakarta', 'Java', -6.106111, 106.891111, 88.7, 'Power Generation'),
(104, 'UBP-SGG', 'UBP Saguling', 'UNIT', 'Desa Girimukti, Saguling, Bandung Barat', 'Jawa Barat', 'Java', -6.862778, 107.373889, 90.2, 'Power Generation'),
(105, 'UBP-LTR', 'UBP Lontar', 'UNIT', 'Desa Lontar, Kemiri, Tangerang', 'Banten', 'Java', -6.058056, 106.395000, 89.8, 'Power Generation'),
(106, 'UBP-ADP', 'UBP Adipala', 'UNIT', 'Desa Adipala, Cilacap', 'Jawa Tengah', 'Java', -7.722778, 109.091944, 88.3, 'Power Generation'),
(107, 'UBP-ASM', 'UBP Asam-asam', 'UNIT', 'Desa Asam-asam, Tanah Laut', 'Kalimantan Selatan', 'Kalimantan', -3.985000, 115.484444, 91.7, 'Power Generation'),
(108, 'UBP-MKS', 'UBP Makassar', 'UNIT', 'Jl. Perintis Kemerdekaan, Makassar', 'Sulawesi Selatan', 'Sulawesi', -5.147778, 119.437222, 89.9, 'Power Generation'),
(109, 'UBP-PSG', 'UBP Pesanggaran', 'UNIT', 'Desa Pesanggaran, Denpasar', 'Bali', 'Bali-Nusa Tenggara', -8.726111, 115.225556, 88.5, 'Power Generation'),
(110, 'UBP-AMB', 'UBP Ambon', 'UNIT', 'Jl. Patimura, Ambon', 'Maluku', 'Maluku-Papua', -3.695278, 128.181389, 81.3, 'Power Generation'),
(111, 'UBP-BKL', 'UBP Belawan', 'UNIT', 'Jl. Yos Sudarso, Belawan, Medan', 'Sumatera Utara', 'Sumatra', 3.780833, 98.684722, 85.9, 'Power Generation'),
(112, 'UBP-GRT', 'UBP Grati', 'UNIT', 'Desa Grati, Pasuruan', 'Jawa Timur', 'Java', -7.762222, 113.019722, 79.3, 'Power Generation'),
(113, 'UBP-PRK2', 'UBP Perak', 'UNIT', 'Jl. Perak Timur, Surabaya', 'Jawa Timur', 'Java', -7.212778, 112.722500, 86.5, 'Power Generation'),
(114, 'UBP-PML', 'UBP Pemaron', 'UNIT', 'Desa Pemaron, Buleleng', 'Bali', 'Bali-Nusa Tenggara', -8.118056, 114.631667, 87.2, 'Power Generation'),
(115, 'UBP-GLM', 'UBP Gilimanuk', 'UNIT', 'Desa Gilimanuk, Jembrana', 'Bali', 'Bali-Nusa Tenggara', -8.163889, 114.442222, 84.8, 'Power Generation'),
(116, 'UBP-KMJ', 'UBP Kamojang', 'UNIT', 'Desa Laksana, Ibun, Bandung', 'Jawa Barat', 'Java', -7.137222, 107.796389, 73.8, 'Power Generation'),
(117, 'UBP-PBR', 'UBP Pelabuhan Ratu', 'UNIT', 'Desa Buniwangi, Pelabuhan Ratu, Sukabumi', 'Jawa Barat', 'Java', -6.988056, 106.533889, 75.6, 'Power Generation'),
(118, 'UBP-JRH', 'UBP Jeneponto', 'UNIT', 'Desa Tamalatea, Jeneponto', 'Sulawesi Selatan', 'Sulawesi', -5.709167, 119.756111, 90.6, 'Power Generation'),
(119, 'UBP-BRU', 'UBP Barru', 'UNIT', 'Desa Sumpang Binangae, Barru', 'Sulawesi Selatan', 'Sulawesi', -4.420556, 119.641111, 85.3, 'Power Generation'),
(120, 'UBP-KRY', 'UBP Keramasan', 'UNIT', 'Desa Keramasan, Palembang', 'Sumatera Selatan', 'Sumatra', -3.041667, 104.759722, 86.4, 'Power Generation'),
(121, 'UBP-PSU', 'UBP Pangkalan Susu', 'UNIT', 'Desa Pangkalan Susu, Langkat', 'Sumatera Utara', 'Sumatra', 4.057222, 98.316111, 82.4, 'Power Generation'),
(122, 'UBP-PMK', 'UBP Poso', 'UNIT', 'Desa Pamona, Poso', 'Sulawesi Tengah', 'Sulawesi', -1.397778, 120.752500, 89.2, 'Power Generation'),
(123, 'UBP-BNG', 'UBP Bengkulu', 'UNIT', 'Desa Pulau Baai, Bengkulu', 'Bengkulu', 'Sumatra', -3.767778, 102.268333, 78.9, 'Power Generation'),
(124, 'UBP-PLM', 'UBP Paiton', 'UNIT', 'Desa Paiton, Probolinggo', 'Jawa Timur', 'Java', -7.731667, 113.473611, 81.9, 'Power Generation'),
(125, 'UBP-BKP', 'UBP Balikpapan', 'UNIT', 'Jl. Jend. Sudirman, Balikpapan', 'Kalimantan Timur', 'Kalimantan', -1.262778, 116.829444, 83.6, 'Power Generation'),
(126, 'UBP-SMD', 'UBP Samarinda', 'UNIT', 'Jl. MT Haryono, Samarinda', 'Kalimantan Timur', 'Kalimantan', -0.502106, 117.153709, 80.7, 'Power Generation'),
(127, 'UBP-BEU', 'UBP Bitung', 'UNIT', 'Desa Aertembaga, Bitung', 'Sulawesi Utara', 'Sulawesi', 1.452500, 125.188611, 76.4, 'Power Generation')
ON CONFLICT (unit_id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  province = EXCLUDED.province,
  region = EXCLUDED.region,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  health_index = EXCLUDED.health_index,
  updated_at = NOW();
