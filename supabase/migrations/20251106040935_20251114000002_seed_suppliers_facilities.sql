-- Seed PLN Indonesia Power Marketplace - Suppliers and Facilities

-- SUPPLIERS
INSERT INTO marketplace_suppliers (supplier_id, supplier_code, supplier_name, contact_person, contact_email, contact_phone, address, city, province, postal_code, certifications, performance_rating, is_pln_approved) VALUES
  ('SUP-001', 'TRF-IND', 'Trafo Nusantara Indonesia', 'Ir. Budi Santoso', 'procurement@trafonusantara.co.id', '+62 21 8934 5000', 'Jl. Industri Raya No. 15, Kawasan Industri Jababeka', 'Cikarang', 'Jawa Barat', '17550', '["ISO 9001:2015", "ISO 14001:2015", "OHSAS 18001", "SNI"]'::jsonb, 4.7, true),
  ('SUP-002', 'GE-PWR', 'GE Power Indonesia', 'Agus Wijaya, M.Eng', 'sales.indonesia@ge.com', '+62 21 5091 8000', 'Menara Astra, Jl. Jend. Sudirman Kav 5-6', 'Jakarta', 'DKI Jakarta', '10220', '["ISO 9001:2015", "ISO 45001:2018", "API 616"]'::jsonb, 4.9, true),
  ('SUP-003', 'SIE-ID', 'Siemens Energy Indonesia', 'Dr. Siti Rahayu', 'energy.indonesia@siemens.com', '+62 21 5091 5000', 'World Trade Center 6, Jl. Jend. Sudirman Kav. 29-31', 'Jakarta', 'DKI Jakarta', '12920', '["ISO 9001:2015", "ISO 14001:2015", "IEC 62271"]'::jsonb, 4.8, true),
  ('SUP-004', 'ABB-ID', 'ABB Indonesia', 'Michael Anderson', 'info@id.abb.com', '+62 21 2902 2300', 'Lippo Kuningan, Jl. HR Rasuna Said Kav B-12', 'Jakarta', 'DKI Jakarta', '12940', '["ISO 9001:2015", "ISO 50001", "IEC 60076"]'::jsonb, 4.6, true),
  ('SUP-005', 'SCH-ID', 'Schneider Electric Indonesia', 'Lisa Wijaya', 'customer.id@schneider-electric.com', '+62 21 2553 6888', 'Kota Kasablanka, Jl. Casablanca Raya Kav. 88', 'Jakarta', 'DKI Jakarta', '12870', '["ISO 9001:2015", "ISO 14001:2015", "IEC 61850"]'::jsonb, 4.5, true),
  ('SUP-006', 'KRA-IND', 'Krakatau Engineering', 'Ir. Rudi Hartono', 'marketing@krakatausteel.com', '+62 254 392 1122', 'Jl. Industri No. 5, Cilegon', 'Cilegon', 'Banten', '42435', '["ISO 9001:2015", "ASME", "SNI"]'::jsonb, 4.4, true),
  ('SUP-007', 'WIK-IND', 'Wika Industri', 'Eko Prasetyo', 'corporate@wika.co.id', '+62 21 8370 5000', 'Jl. D.I. Panjaitan Kav. 9-10', 'Jakarta', 'DKI Jakarta', '13340', '["ISO 9001:2015", "ISO 14001:2015", "SNI"]'::jsonb, 4.3, true),
  ('SUP-008', 'HIT-ID', 'Hitachi Energy Indonesia', 'Tanaka Hiroshi', 'info@hitachienergy.com', '+62 21 2553 7000', 'Sahid Sudirman Center, Jl. Jend. Sudirman No. 86', 'Jakarta', 'DKI Jakarta', '10220', '["ISO 9001:2015", "IEC 60076", "IEEE C57"]'::jsonb, 4.7, true),
  ('SUP-009', 'MIT-IND', 'Mitsubishi Power Indonesia', 'Kenji Yamamoto', 'mhps.indonesia@mhps.com', '+62 21 5795 7800', 'Equity Tower, Jl. Jend. Sudirman Kav. 52-53', 'Jakarta', 'DKI Jakarta', '12190', '["ISO 9001:2015", "ISO 45001:2018", "API 616"]'::jsonb, 4.8, true),
  ('SUP-010', 'PAM-IND', 'Pindad Manufacturing', 'Kolonel Bambang S.', 'marketing@pindad.com', '+62 22 7303 171', 'Jl. Gatot Subroto No. 517', 'Bandung', 'Jawa Barat', '40284', '["ISO 9001:2015", "ISO 14001:2015", "SNI"]'::jsonb, 4.2, true)
ON CONFLICT (supplier_id) DO NOTHING;

-- PLN FACILITIES
INSERT INTO marketplace_pln_facilities (facility_id, facility_code, facility_name, facility_type, address, city, province, postal_code, latitude, longitude, contact_person, contact_phone, contact_email) VALUES
  ('FAC-001', 'PLTU-SGR', 'PLTU Suralaya', 'Coal Power Plant', 'Jl. Raya Suralaya, Pulomerak', 'Cilegon', 'Banten', '42438', -6.0357, 106.0234, 'Ir. Dwi Atmoko', '+62 254 391 234', 'suralaya@indonesiapower.co.id'),
  ('FAC-002', 'PLTGU-MRK', 'PLTGU Muara Karang', 'Gas Power Plant', 'Jl. Pluit Karang Ayu', 'Jakarta Utara', 'DKI Jakarta', '14450', -6.1167, 106.7833, 'Ir. Hendra Kusuma', '+62 21 6695 123', 'muarakarang@indonesiapower.co.id'),
  ('FAC-003', 'PLTU-PRG', 'PLTU Paiton', 'Coal Power Plant', 'Desa Bhinor, Kecamatan Paiton', 'Probolinggo', 'Jawa Timur', '67291', -7.7333, 113.3833, 'Ir. Agung Wibowo', '+62 335 771 234', 'paiton@indonesiapower.co.id'),
  ('FAC-004', 'PLTGU-SRG', 'PLTGU Semarang', 'Gas Power Plant', 'Jl. Randugarut, Tugu', 'Semarang', 'Jawa Tengah', '50185', -6.9500, 110.4167, 'Ir. Siti Nurjanah', '+62 24 8666 123', 'semarang@indonesiapower.co.id'),
  ('FAC-005', 'PLTU-PKL', 'PLTU Pacitan', 'Coal Power Plant', 'Desa Ploso, Kecamatan Pacitan', 'Pacitan', 'Jawa Timur', '63515', -8.2000, 111.0500, 'Ir. Bambang Irianto', '+62 357 881 234', 'pacitan@indonesiapower.co.id'),
  ('FAC-006', 'PLTG-PLB', 'PLTG Palembang', 'Gas Turbine Plant', 'Jl. Kolone H. Burlian KM 7', 'Palembang', 'Sumatera Selatan', '30961', -2.9761, 104.7754, 'Ir. Edi Gunawan', '+62 711 411 234', 'palembang@indonesiapower.co.id'),
  ('FAC-007', 'PLTU-LAB', 'PLTU Labuan', 'Coal Power Plant', 'Desa Teluk Lada', 'Pandeglang', 'Banten', '42264', -6.4000, 105.7833, 'Ir. Yusuf Rahman', '+62 253 801 234', 'labuan@indonesiapower.co.id'),
  ('FAC-008', 'PLTGU-BLI', 'PLTGU Bali', 'Gas Power Plant', 'Jl. Pantai Gilimanuk', 'Jembrana', 'Bali', '82218', -8.1617, 114.4425, 'Ir. Made Sudana', '+62 365 611 234', 'bali@indonesiapower.co.id'),
  ('FAC-009', 'PLTU-JEP', 'PLTU Jepara', 'Coal Power Plant', 'Desa Tubanan, Kecamatan Kembang', 'Jepara', 'Jawa Tengah', '59454', -6.7500, 110.6667, 'Ir. Rina Wijayanti', '+62 291 591 234', 'jepara@indonesiapower.co.id'),
  ('FAC-010', 'PLTG-BDG', 'PLTG Bandung', 'Gas Turbine Plant', 'Jl. Soekarno Hatta No. 762', 'Bandung', 'Jawa Barat', '40294', -6.9389, 107.7014, 'Ir. Dedi Supriadi', '+62 22 7565 123', 'bandung@indonesiapower.co.id'),
  ('FAC-011', 'PLTU-KLT', 'PLTU Kaltim', 'Coal Power Plant', 'Desa Kariangau', 'Balikpapan', 'Kalimantan Timur', '76114', -1.1833, 116.8333, 'Ir. Ahmad Fauzi', '+62 542 761 234', 'kaltim@indonesiapower.co.id'),
  ('FAC-012', 'PLTGU-BKS', 'PLTGU Bekasi', 'Gas Power Plant', 'Jl. Raya Narogong KM 18', 'Bekasi', 'Jawa Barat', '17520', -6.2841, 107.0298, 'Ir. Rini Setiawati', '+62 21 8231 123', 'bekasi@indonesiapower.co.id'),
  ('FAC-013', 'PLTU-MKS', 'PLTU Makassar', 'Coal Power Plant', 'Jl. Perintis Kemerdekaan KM 17', 'Makassar', 'Sulawesi Selatan', '90245', -5.1167, 119.4667, 'Ir. Abdul Rahman', '+62 411 511 234', 'makassar@indonesiapower.co.id'),
  ('FAC-014', 'PLTG-MED', 'PLTG Medan', 'Gas Turbine Plant', 'Jl. Belawan Sicanang', 'Medan', 'Sumatera Utara', '20411', 3.7667, 98.7000, 'Ir. Taufik Hidayat', '+62 61 6941 123', 'medan@indonesiapower.co.id'),
  ('FAC-015', 'PLTU-PNG', 'PLTU Pangkalan Susu', 'Coal Power Plant', 'Desa Bagan Deli, Kecamatan Pangkalan Susu', 'Langkat', 'Sumatera Utara', '20857', 4.0500, 98.2833, 'Ir. Syahrial Lubis', '+62 621 931 234', 'pangkalansusu@indonesiapower.co.id')
ON CONFLICT (facility_id) DO NOTHING;