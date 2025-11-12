/*
  # Populate Indonesian Procurement Category Reference Data

  1. Category Structure (6 Main Categories)
    - A: Energi Primer dan Jasa Penunjangnya
    - B: Peralatan Penunjang dan Sistem Mechanical/Electrical
    - C: Material, Consumable, dan General Supply
    - D: Asset Non-Operasional dan Penunjang Manajemen
    - E: Jasa dan Kontrak Pendukung
    - F: Peralatan Utama Pembangkit dan Project EPC

  2. Subcategories
    - 34 subcategories distributed across the 6 main categories
    - Each with specific target benchmarks

  3. Important Notes
    - All names in Indonesian (Bahasa Indonesia)
    - Target values based on Indonesia Power standards
    - Display order reflects priority/frequency
*/

-- Insert Category A: Energi Primer dan Jasa Penunjangnya
INSERT INTO ref_procurement_categories (main_category_code, main_category_name_id, main_category_description_id, subcategory_code, subcategory_name_id, subcategory_description_id, target_sourcing_days, target_otif_percentage, target_savings_percentage, display_order) VALUES
('A', 'Energi Primer dan Jasa Penunjangnya', 'Pengadaan bahan bakar, energi primer, dan jasa pendukung operasional pembangkit', 'A-01', 'Batu Bara', 'Pengadaan batu bara untuk pembangkit listrik', 45, 95.0, 8.0, 1),
('A', 'Energi Primer dan Jasa Penunjangnya', 'Pengadaan bahan bakar, energi primer, dan jasa pendukung operasional pembangkit', 'A-02', 'Gas Alam', 'Pengadaan gas alam untuk pembangkit', 60, 98.0, 5.0, 2),
('A', 'Energi Primer dan Jasa Penunjangnya', 'Pengadaan bahan bakar, energi primer, dan jasa pendukung operasional pembangkit', 'A-03', 'Solar/HSD', 'Pengadaan bahan bakar minyak (High Speed Diesel)', 30, 97.0, 6.0, 3),
('A', 'Energi Primer dan Jasa Penunjangnya', 'Pengadaan bahan bakar, energi primer, dan jasa pendukung operasional pembangkit', 'A-04', 'Jasa Transportasi Bahan Bakar', 'Jasa angkutan dan logistik bahan bakar', 50, 92.0, 10.0, 4),
('A', 'Energi Primer dan Jasa Penunjangnya', 'Pengadaan bahan bakar, energi primer, dan jasa pendukung operasional pembangkit', 'A-05', 'Jasa Stockpile Management', 'Jasa pengelolaan area penyimpanan bahan bakar', 40, 90.0, 12.0, 5),
('A', 'Energi Primer dan Jasa Penunjangnya', 'Pengadaan bahan bakar, energi primer, dan jasa pendukung operasional pembangkit', 'A-06', 'Biomassa dan Energi Terbarukan', 'Pengadaan bahan bakar biomassa dan sumber energi terbarukan', 55, 93.0, 7.0, 6);

-- Insert Category B: Peralatan Penunjang dan Sistem Mechanical/Electrical
INSERT INTO ref_procurement_categories (main_category_code, main_category_name_id, main_category_description_id, subcategory_code, subcategory_name_id, subcategory_description_id, target_sourcing_days, target_otif_percentage, target_savings_percentage, display_order) VALUES
('B', 'Peralatan Penunjang dan Sistem Mechanical/Electrical', 'Pengadaan peralatan mekanikal, elektrikal, dan sistem penunjang', 'B-01', 'Sistem Kontrol dan Instrumentasi', 'Peralatan kontrol, SCADA, dan instrumentasi', 90, 94.0, 15.0, 7),
('B', 'Peralatan Penunjang dan Sistem Mechanical/Electrical', 'Pengadaan peralatan mekanikal, elektrikal, dan sistem penunjang', 'B-02', 'Peralatan Electrical Auxiliary', 'Motor listrik, panel listrik, transformer kecil', 70, 95.0, 14.0, 8),
('B', 'Peralatan Penunjang dan Sistem Mechanical/Electrical', 'Pengadaan peralatan mekanikal, elektrikal, dan sistem penunjang', 'B-03', 'Sistem Proteksi dan Safety', 'Perangkat proteksi elektrik dan sistem keselamatan', 80, 98.0, 12.0, 9),
('B', 'Peralatan Penunjang dan Sistem Mechanical/Electrical', 'Pengadaan peralatan mekanikal, elektrikal, dan sistem penunjang', 'B-04', 'Pompa dan Kompresor', 'Pompa air, kompresor udara, dan peralatan fluid handling', 65, 93.0, 13.0, 10),
('B', 'Peralatan Penunjang dan Sistem Mechanical/Electrical', 'Pengadaan peralatan mekanikal, elektrikal, dan sistem penunjang', 'B-05', 'Sistem HVAC', 'Heating, Ventilation, Air Conditioning untuk ruang kontrol', 60, 92.0, 11.0, 11),
('B', 'Peralatan Penunjang dan Sistem Mechanical/Electrical', 'Pengadaan peralatan mekanikal, elektrikal, dan sistem penunjang', 'B-06', 'Peralatan Material Handling', 'Conveyor, crane, hoist, dan peralatan pemindahan material', 75, 91.0, 16.0, 12);

-- Insert Category C: Material, Consumable, dan General Supply
INSERT INTO ref_procurement_categories (main_category_code, main_category_name_id, main_category_description_id, subcategory_code, subcategory_name_id, subcategory_description_id, target_sourcing_days, target_otif_percentage, target_savings_percentage, display_order) VALUES
('C', 'Material, Consumable, dan General Supply', 'Pengadaan material habis pakai, spare part, dan supplies umum', 'C-01', 'Spare Part Mekanik', 'Suku cadang komponen mekanik pembangkit', 35, 90.0, 18.0, 13),
('C', 'Material, Consumable, dan General Supply', 'Pengadaan material habis pakai, spare part, dan supplies umum', 'C-02', 'Spare Part Elektrik', 'Suku cadang komponen elektrik', 35, 90.0, 17.0, 14),
('C', 'Material, Consumable, dan General Supply', 'Pengadaan material habis pakai, spare part, dan supplies umum', 'C-03', 'Chemical dan Lubricant', 'Bahan kimia, pelumas, dan fluida operasional', 25, 94.0, 15.0, 15),
('C', 'Material, Consumable, dan General Supply', 'Pengadaan material habis pakai, spare part, dan supplies umum', 'C-04', 'Alat Tulis Kantor (ATK)', 'Perlengkapan dan alat tulis kantor', 15, 96.0, 20.0, 16),
('C', 'Material, Consumable, dan General Supply', 'Pengadaan material habis pakai, spare part, dan supplies umum', 'C-05', 'Peralatan K3 dan Safety Equipment', 'Alat pelindung diri dan peralatan keselamatan kerja', 20, 97.0, 16.0, 17),
('C', 'Material, Consumable, dan General Supply', 'Pengadaan material habis pakai, spare part, dan supplies umum', 'C-06', 'Material Konstruksi dan Fabrikasi', 'Besi, baja, beton, dan material konstruksi', 30, 92.0, 14.0, 18);

-- Insert Category D: Asset Non-Operasional dan Penunjang Manajemen
INSERT INTO ref_procurement_categories (main_category_code, main_category_name_id, main_category_description_id, subcategory_code, subcategory_name_id, subcategory_description_id, target_sourcing_days, target_otif_percentage, target_savings_percentage, display_order) VALUES
('D', 'Asset Non-Operasional dan Penunjang Manajemen', 'Pengadaan aset pendukung operasional dan manajemen perusahaan', 'D-01', 'Kendaraan Operasional', 'Mobil, truk, dan kendaraan untuk operasional', 90, 95.0, 10.0, 19),
('D', 'Asset Non-Operasional dan Penunjang Manajemen', 'Pengadaan aset pendukung operasional dan manajemen perusahaan', 'D-02', 'Peralatan IT dan Komputer', 'Laptop, desktop, server, dan perangkat IT', 45, 93.0, 19.0, 20),
('D', 'Asset Non-Operasional dan Penunjang Manajemen', 'Pengadaan aset pendukung operasional dan manajemen perusahaan', 'D-03', 'Furniture dan Perlengkapan Kantor', 'Meja, kursi, lemari, dan furniture kantor', 40, 94.0, 17.0, 21),
('D', 'Asset Non-Operasional dan Penunjang Manajemen', 'Pengadaan aset pendukung operasional dan manajemen perusahaan', 'D-04', 'Peralatan Komunikasi', 'Radio, telepon, dan sistem komunikasi', 35, 92.0, 15.0, 22),
('D', 'Asset Non-Operasional dan Penunjang Manajemen', 'Pengadaan aset pendukung operasional dan manajemen perusahaan', 'D-05', 'Peralatan Laboratorium', 'Instrumen dan peralatan laboratorium pengujian', 60, 91.0, 13.0, 23),
('D', 'Asset Non-Operasional dan Penunjang Manajemen', 'Pengadaan aset pendukung operasional dan manajemen perusahaan', 'D-06', 'Peralatan Medis dan Klinik', 'Peralatan kesehatan untuk klinik perusahaan', 50, 96.0, 11.0, 24);

-- Insert Category E: Jasa dan Kontrak Pendukung
INSERT INTO ref_procurement_categories (main_category_code, main_category_name_id, main_category_description_id, subcategory_code, subcategory_name_id, subcategory_description_id, target_sourcing_days, target_otif_percentage, target_savings_percentage, display_order) VALUES
('E', 'Jasa dan Kontrak Pendukung', 'Pengadaan jasa konsultansi, maintenance, dan layanan pendukung', 'E-01', 'Jasa Maintenance dan Repair', 'Jasa pemeliharaan dan perbaikan peralatan', 40, 89.0, 14.0, 25),
('E', 'Jasa dan Kontrak Pendukung', 'Pengadaan jasa konsultansi, maintenance, dan layanan pendukung', 'E-02', 'Jasa Konsultansi Teknik', 'Konsultan engineering dan technical advisory', 60, 92.0, 12.0, 26),
('E', 'Jasa dan Kontrak Pendukung', 'Pengadaan jasa konsultansi, maintenance, dan layanan pendukung', 'E-03', 'Jasa IT dan Software', 'Jasa pengembangan sistem, software license, IT support', 50, 94.0, 16.0, 27),
('E', 'Jasa dan Kontrak Pendukung', 'Pengadaan jasa konsultansi, maintenance, dan layanan pendukung', 'E-04', 'Jasa Kebersihan dan Keamanan', 'Cleaning service, security service, dan facility management', 30, 95.0, 18.0, 28),
('E', 'Jasa dan Kontrak Pendukung', 'Pengadaan jasa konsultansi, maintenance, dan layanan pendukung', 'E-05', 'Jasa Training dan Development', 'Pelatihan SDM dan pengembangan kompetensi', 45, 93.0, 15.0, 29),
('E', 'Jasa dan Kontrak Pendukung', 'Pengadaan jasa konsultansi, maintenance, dan layanan pendukung', 'E-06', 'Jasa Audit dan Legal', 'Jasa audit, konsultan hukum, dan compliance', 55, 96.0, 10.0, 30);

-- Insert Category F: Peralatan Utama Pembangkit dan Project EPC
INSERT INTO ref_procurement_categories (main_category_code, main_category_name_id, main_category_description_id, subcategory_code, subcategory_name_id, subcategory_description_id, target_sourcing_days, target_otif_percentage, target_savings_percentage, display_order) VALUES
('F', 'Peralatan Utama Pembangkit dan Project EPC', 'Pengadaan peralatan utama dan proyek konstruksi pembangkit listrik', 'F-01', 'Turbine dan Generator', 'Turbin uap/gas dan generator utama', 180, 98.0, 8.0, 31),
('F', 'Peralatan Utama Pembangkit dan Project EPC', 'Pengadaan peralatan utama dan proyek konstruksi pembangkit listrik', 'F-02', 'Boiler dan Sistem Pembakaran', 'Boiler, burner, dan sistem pembakaran', 150, 97.0, 9.0, 32),
('F', 'Peralatan Utama Pembangkit dan Project EPC', 'Pengadaan peralatan utama dan proyek konstruksi pembangkit listrik', 'F-03', 'Transformer dan Switchgear', 'Trafo daya dan peralatan switching tegangan tinggi', 120, 96.0, 10.0, 33),
('F', 'Peralatan Utama Pembangkit dan Project EPC', 'Pengadaan peralatan utama dan proyek konstruksi pembangkit listrik', 'F-04', 'Project EPC Pembangkit Baru', 'Engineering, Procurement, Construction pembangkit baru', 365, 95.0, 7.0, 34),
('F', 'Peralatan Utama Pembangkit dan Project EPC', 'Pengadaan peralatan utama dan proyek konstruksi pembangkit listrik', 'F-05', 'Overhaul dan Capital Dredging', 'Proyek overhaul mayor dan pekerjaan capital', 180, 94.0, 11.0, 35),
('F', 'Peralatan Utama Pembangkit dan Project EPC', 'Pengadaan peralatan utama dan proyek konstruksi pembangkit listrik', 'F-06', 'Sistem Balance of Plant (BOP)', 'Sistem penunjang pembangkit (cooling, water treatment, dll)', 140, 93.0, 12.0, 36);
