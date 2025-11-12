/*
  # Unit Locations Table

  1. New Table
    - `unit_locations`
      - Stores PLN Indonesia Power unit locations across Indonesia
      - Includes head office and all operational units
      - Contains geospatial data (latitude/longitude) for mapping
      - Address and location type information

  2. Security
    - Enable RLS on table
    - Public read access for location data
    - Authenticated users can manage locations

  3. Fields
    - no: Sequential number identifier
    - type: Location type (HEAD OFFICE or UNIT)
    - name: Unit/office name
    - address: Full address
    - latitude: Geospatial coordinate
    - longitude: Geospatial coordinate
*/

-- Create unit_locations table
CREATE TABLE IF NOT EXISTS unit_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  no integer NOT NULL,
  type text NOT NULL CHECK (type IN ('HEAD OFFICE', 'UNIT')),
  name text NOT NULL,
  address text NOT NULL,
  latitude numeric(10, 7) NOT NULL,
  longitude numeric(10, 7) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE unit_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view unit locations"
  ON unit_locations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create unit locations"
  ON unit_locations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update unit locations"
  ON unit_locations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete unit locations"
  ON unit_locations FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_unit_locations_no ON unit_locations(no);
CREATE INDEX IF NOT EXISTS idx_unit_locations_type ON unit_locations(type);
CREATE INDEX IF NOT EXISTS idx_unit_locations_name ON unit_locations(name);
CREATE INDEX IF NOT EXISTS idx_unit_locations_coordinates ON unit_locations(latitude, longitude);

-- Insert data
INSERT INTO unit_locations (no, type, name, address, latitude, longitude) VALUES
(1, 'HEAD OFFICE', 'PLN IP HEAD OFFICE', 'Jl. Gatot Subroto No.Kav.18, Kuningan Tim., Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12950', -6.236831952, 106.8283021),
(2, 'UNIT', 'UBP ADP', 'Desa Bunton Kecamatan Adipala, Kabupaten Cilacap - Jawa Tengah 53271', -7.680855, 109.13677),
(3, 'UNIT', 'UBP ASM', 'Jalan Raya Banjarmasin Kotabaru KM 122, Desa Sei Baru, Jorong, Peleihari, Kalimantan Selatan', -3.9256582, 115.1062121),
(4, 'UNIT', 'UBP BEU', 'Jalan poros Labanan, kecamatan Teluk bayur, Kabupaten Berau, Kalimantan timur', 2.156172, 117.392044),
(5, 'UNIT', 'UBP BKL', 'Jalan Raya Bengkulu - Curup Km 72, Ujan MAS Atas, Kec. Ujan Mas, Kabupaten Kepahiang, Bengkulu 39125', -3.565236159, 102.5220812),
(6, 'UNIT', 'UBP BKT', 'Lubuk Sao, Kelurahan Tanjung Sani, Kecamatan Tanjung Raya, Kabupaten Agam, Provinsi Sumatera Barat', -0.310512197, 100.1170147),
(7, 'UNIT', 'UBP BLB', 'Jl. Laba Terusan Panimbang Desa Sukamaju Kec. Labuan , Kabupaten Pandeglang Banten', -6.394068, 105.826457),
(8, 'UNIT', 'UBP BLI', 'Jalan By Pass I Gusti Ngurah Rai No 535, Pesanggaran, Denpasar, 80222', -8.716829568, 115.2125177),
(9, 'UNIT', 'UBP BLT', 'Jl. Ir Sutami, Ds Lontar, Kec Kemiri, Kab Tangerang, Banten, 15531', -6.060247, 106.462752),
(10, 'UNIT', 'UBP BRU', 'Dusun Bawasalo, Desa Lampoko, Kec Balusu,Kab Barru, Sulawesi Selatan 90762', -4.291407, 119.631521),
(11, 'UNIT', 'UBP BSL', 'Jl. Suralaya, Gedung Ex. Pengembangan Usaha Komplek PLTU Suralaya, Kec. Pulomerak, Cilegon, Merak Banten', -5.8900361, 106.0378639),
(12, 'UNIT', 'UBP BTO', 'Tlk., Tlk. Bayur, Kec. Tlk. Bayur, Kabupaten Berau, Kalimantan Timur 77352', 2.1572, 117.393423),
(13, 'UNIT', 'UBP CLG', 'Jalan Raya Bojonegara, Desa Margasari, Kec. Puloampel, Kabupaten Serang, Banten 42454', -5.930819646, 106.1066293),
(14, 'UNIT', 'UBP GRT', 'Jl. Raya Surabaya  Probolinggo Km.73 PO BOX 11, Grati 67184, Desa Wates, Kecamatan Lekok Kabupaten Pasuruan', -7.652458, 113.026728),
(15, 'UNIT', 'UBP HTK', 'Jl.Hanurata KM 9 Kampung Holtekamp, Distrik Muara Tami, Kota Jayapura, Papua', -2.6153857, 140.7901396),
(16, 'UNIT', 'UBP JMB', 'Jl. Gunung Semeru No. 26 RT. 24 Kel. Payo Selincah Kec. Jambi Selatan', -1.596533305, 103.6468952),
(17, 'UNIT', 'UBP JPR', 'Jl. Cipatuguran, Pelabuhanratu, Kec. Pelabuhanratu, Kabupaten Sukabumi, Jawa Barat 43364', -7.022604, 106.545236),
(18, 'UNIT', 'UBP JRJ', 'Jl. Raya PLTU Jeranjang, Dusun Jeranjang Desa Taman Ayu, Kec. Gerung, Kab.  Lombok Barat, NTB', -8.6595, 116.07294),
(19, 'UNIT', 'UBP KMJ', 'PT. PLN Indonesia Power unit Darajat Kp. Cileuleuy Desa Padaawas Kec. Pasirwangi Kab. Garut Kode pos : 44161', -7.215024, 107.7377017),
(20, 'UNIT', 'UBP KRI', 'Jl. Pertambangan No. 39, Ranggam, Tebing, Kab. Karimun', 1.042577, 103.419748),
(22, 'UNIT', 'UBP LBA', 'Labuhan Angin,Desa Tapian Nauli 1,Kecamatan Tapian Nauli,Kabupaten Tapanuli Tengah Sumatera Utara 22500', 1.753368, 98.729214),
(23, 'UNIT', 'UBP MHK', 'Jl. Asmawarman No.18, Kelurahan Gunung Telihan, Kecamatan Bontang Barat, Kota Bontang', 0.13703, 117.45454),
(24, 'UNIT', 'UBP MRC', 'Jalan Raya Banyumas KM 8 Banjarnegara Jawa Tengah 53471', -7.401266607, 109.6107895),
(25, 'UNIT', 'UBP OMB', 'PLTU OMBILIN, jalan Prof M. Yamin, SH Desa Sijantang Koto, Kec Talawi, Sawahlunto', -0.6092727, 100.752877),
(26, 'UNIT', 'UBP PNS', 'PLN Pangkalan Susu, Dusun 6 Desa Tanjung pasir, Kec Pangkalan Susu Kabupaten Langkat, Sumatera Utara 20858. Tel. (0620) 51971. Fax. (0620) 51972', 4.119806329, 98.25893448),
(27, 'UNIT', 'UBP PRO', 'Jl. Laks RE Martadinata Jakarta Utara 14310. Tel. (62-21) 435 3914 (Hunting) Fax. (62-21) 4393-6461', -6.107862, 106.871324),
(28, 'UNIT', 'UBP SGL', 'JL. Komplek PLN Tromol Pos 7 Rajamandala Cipatat Bandung Barat Jawa Barat, Ciptaharja, Kec. Cipatat, Kabupaten Bandung Barat, Jawa Barat 40554', -6.841997, 107.363896),
(29, 'UNIT', 'UBP SGU', 'Jl. Parit Emas Desa Sungai Batu. kec kapuas, Kab. Sanggau, Kalimantan Barat', 0.030894, 110.555208),
(31, 'UNIT', 'UBP SLA', 'Jl. Suralaya No.21, Suralaya, Kec. Pulomerak, Kota Cilegon, Banten 42439', -5.891433, 106.032963),
(32, 'UNIT', 'UBP SMG', 'Jl. Ronggowarsito Komplek Pelabuhan Tanjung Emas, Semarang 50174', -6.951127586, 110.4308517),
(34, 'UNIT', 'UBP TLO', 'Jl. Urip Sumoharjo KM.7, Tello Baru, Kec. Panakkukang, Kota Makassar, Sulawesi Selatan 90233', -5.146317244, 119.4724274),
(35, 'UNIT', 'UBP TIR', 'Jl. Lintas Sumatera Padang - Painan KM 25, Teluk Kabung Tengah, Kec. Bungus Teluk Kabung, Kota Padang (24241), Sumatera Barat', -1.076059051, 100.3739375),
(36, 'UNIT', 'UBP JTG', 'Jl. PLTA Jatigede, Desa Kadujaya, Kecamatan Jatigede, Kabupaten Sumedang, Jawa Barat 45377', -6.83395, 108.10515);
