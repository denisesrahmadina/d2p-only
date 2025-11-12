/*
  # Populate Vendors Data

  1. Content
    - Insert 25 vendor records across multiple categories
    - Realistic Indonesian company names
    - Vendor categories matching material specializations
    - Ratings from 3.5 to 5.0 stars
    - Contact information and addresses

  2. Vendor Categories
    - Construction Suppliers
    - Office Equipment Suppliers
    - Industrial Equipment Suppliers
    - Electronics & IT Suppliers
    - Raw Materials & Chemicals Suppliers
*/

INSERT INTO dim_vendor (vendor_id, vendor_name, vendor_category, vendor_address, vendor_contact, vendor_rating, vendor_email, vendor_phone, vendor_city, vendor_province, is_active) VALUES
-- Construction Suppliers
('VEN-001', 'PT Semen Indah Nusantara', 'Construction Materials', 'Jl. Raya Bogor KM 45, Cikarang', 'Budi Santoso', 4.5, 'sales@semenindah.co.id', '+62-21-89765432', 'Bekasi', 'Jawa Barat', true),
('VEN-002', 'CV Baja Kuat Mandiri', 'Steel & Metal Products', 'Jl. Industri No. 123, Kawasan Industri MM2100', 'Agus Wijaya', 4.7, 'order@bajakuat.co.id', '+62-21-89123456', 'Bekasi', 'Jawa Barat', true),
('VEN-003', 'Toko Bangunan Maju Jaya', 'Building Materials', 'Jl. Pahlawan No. 78, Kelapa Gading', 'Siti Rahayu', 4.2, 'info@majujaya.com', '+62-21-45678901', 'Jakarta Utara', 'DKI Jakarta', true),
('VEN-004', 'PT Kayu Jati Prima', 'Wood & Timber', 'Jl. Raya Cirebon KM 25, Subang', 'Joko Prabowo', 4.6, 'sales@kayujati.co.id', '+62-260-512345', 'Subang', 'Jawa Barat', true),
('VEN-005', 'CV Cat dan Coating Sejahtera', 'Paint & Coatings', 'Jl. Margonda Raya No. 234, Depok', 'Dewi Lestari', 4.4, 'order@catsejahtera.com', '+62-21-77889900', 'Depok', 'Jawa Barat', true),
('VEN-006', 'PT Keramik Indah Permai', 'Tiles & Ceramics', 'Jl. Cikarang Baru No. 67, Cikarang', 'Rudi Hermawan', 4.8, 'info@keramikindah.co.id', '+62-21-89234567', 'Bekasi', 'Jawa Barat', true),

-- Office Suppliers
('VEN-007', 'PT Stationery Indo Sukses', 'Office Supplies', 'Jl. Sudirman No. 45, Senayan', 'Linda Wijaya', 4.3, 'sales@stationeryindo.com', '+62-21-52123456', 'Jakarta Selatan', 'DKI Jakarta', true),
('VEN-008', 'Toko Furniture Kantor Modern', 'Office Furniture', 'Jl. Gatot Subroto KM 3, Kebayoran', 'Bambang Sutrisno', 4.5, 'order@furniturekantor.com', '+62-21-52789012', 'Jakarta Selatan', 'DKI Jakarta', true),
('VEN-009', 'CV Alat Tulis Pratama', 'Stationery & Paper', 'Jl. Cikini Raya No. 89, Menteng', 'Ani Kusuma', 4.1, 'info@alattulis.co.id', '+62-21-31234567', 'Jakarta Pusat', 'DKI Jakarta', true),

-- Industrial Equipment Suppliers
('VEN-010', 'PT Mesin Industri Teknik', 'Industrial Machinery', 'Jl. Pulogadung No. 123, Kawasan Industri', 'Hendra Gunawan', 4.7, 'sales@mesinindustri.co.id', '+62-21-46123456', 'Jakarta Timur', 'DKI Jakarta', true),
('VEN-011', 'CV Perkakas Profesional', 'Power Tools & Equipment', 'Jl. Raya Bekasi KM 18, Cakung', 'Yudi Prasetyo', 4.6, 'order@perkakas.com', '+62-21-46789012', 'Jakarta Timur', 'DKI Jakarta', true),
('VEN-012', 'PT Safety Equipment Indonesia', 'Safety Equipment', 'Jl. Industri Raya No. 56, Cibitung', 'Ratna Sari', 4.8, 'info@safety-eq.co.id', '+62-21-89345678', 'Bekasi', 'Jawa Barat', true),
('VEN-013', 'Toko Las dan Teknik', 'Welding & Tools', 'Jl. Otista Raya No. 234, Jatinegara', 'Budiman Santoso', 4.4, 'sales@lasdanteknik.com', '+62-21-85678901', 'Jakarta Timur', 'DKI Jakarta', true),
('VEN-014', 'CV Generator Power Mandiri', 'Generators & Compressors', 'Jl. Raya Narogong KM 12, Cileungsi', 'Andi Firmansyah', 4.5, 'order@genpower.co.id', '+62-21-82345678', 'Bogor', 'Jawa Barat', true),

-- Electronics & IT Suppliers
('VEN-015', 'PT Komputer Solusi Teknologi', 'Computers & IT Equipment', 'Jl. Mangga Dua Raya No. 45, Mangga Dua', 'Denny Kurniawan', 4.6, 'sales@komputersolusi.com', '+62-21-62123456', 'Jakarta Utara', 'DKI Jakarta', true),
('VEN-016', 'CV Elektronik Prima Nusantara', 'Electronics & Components', 'Jl. Glodok Plaza Blok A No. 12, Glodok', 'Fenny Lim', 4.4, 'info@elektronikprima.co.id', '+62-21-62789012', 'Jakarta Barat', 'DKI Jakarta', true),
('VEN-017', 'PT Jaringan Network Solutions', 'Network Equipment', 'Jl. HR Rasuna Said Kav 3, Kuningan', 'Rizal Ahmad', 4.7, 'order@jaringan.net.id', '+62-21-52567890', 'Jakarta Selatan', 'DKI Jakarta', true),
('VEN-018', 'Toko Printer dan Toner Sejahtera', 'Printer & Supplies', 'Jl. Pramuka No. 123, Matraman', 'Sinta Dewi', 4.2, 'sales@printersejahtera.com', '+62-21-85901234', 'Jakarta Timur', 'DKI Jakarta', true),
('VEN-019', 'CV Storage Solutions Indo', 'Data Storage Devices', 'Jl. Fatmawati Raya No. 67, Cilandak', 'Tommy Wibowo', 4.5, 'info@storage-id.com', '+62-21-75123456', 'Jakarta Selatan', 'DKI Jakarta', true),

-- Raw Materials & Chemicals Suppliers
('VEN-020', 'PT Kimia Industri Sukses', 'Industrial Chemicals', 'Jl. Raya Cikupa KM 5, Tangerang', 'Haryanto Wijaya', 4.6, 'sales@kimiaindustri.co.id', '+62-21-59123456', 'Tangerang', 'Banten', true),
('VEN-021', 'CV Logam Mulia Mandiri', 'Metals & Alloys', 'Jl. Industri Jababeka Blok H No. 34, Cikarang', 'Suryanto Budiman', 4.7, 'order@logammulia.com', '+62-21-89456789', 'Bekasi', 'Jawa Barat', true),
('VEN-022', 'PT Plastik Resin Indonesia', 'Plastic Materials', 'Jl. Raya Serang KM 18, Balaraja', 'Wulan Sari', 4.5, 'info@plastikresin.co.id', '+62-21-59567890', 'Tangerang', 'Banten', true),
('VEN-023', 'Toko Minyak dan Pelumas Jaya', 'Lubricants & Oils', 'Jl. Pulo Gadung Trade Center Blok 5C No. 15', 'Ridwan Hakim', 4.3, 'sales@minyakpelumas.com', '+62-21-46234567', 'Jakarta Timur', 'DKI Jakarta', true),
('VEN-024', 'CV Perekat dan Sealant Pratama', 'Adhesives & Sealants', 'Jl. Raya Bekasi KM 22, Cakung', 'Indah Permata', 4.4, 'order@perekat.co.id', '+62-21-46890123', 'Jakarta Timur', 'DKI Jakarta', true),
('VEN-025', 'PT Multi Chemical Supply', 'General Chemicals', 'Jl. Gaya Motor Raya No. 88, Sunter', 'Darmawan Putra', 4.6, 'info@multichemical.co.id', '+62-21-65123456', 'Jakarta Utara', 'DKI Jakarta', true);
