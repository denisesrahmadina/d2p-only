/*
  # Populate Complete OTIF Leaderboard Data

  1. Purpose
    - Generate ALL OTIF supplier data with unique sequential scores
    - Overall Top 10 + Category-specific Top 10 for A, B, C, D, E, F
    - Each supplier has unique OTIF percentage (no duplicates)

  2. Score Ranges
    - Overall: 98.5%, 98.0%, 97.5%, 97.0%, 96.5%, 96.0%, 95.5%, 95.0%, 94.5%, 94.0%
    - Category A: 97.8% to 88.8% (10 suppliers, 1% steps)
    - Category B: 96.5% to 87.5% (10 suppliers, 1% steps)
    - Category C: 95.2% to 86.2% (10 suppliers, 1% steps)
    - Category D: 94.7% to 85.7% (10 suppliers, 1% steps)
    - Category E: 93.4% to 84.4% (10 suppliers, 1% steps)
    - Category F: 97.2% to 88.2% (10 suppliers, 1% steps)
*/

-- Function to generate delivery records efficiently
CREATE OR REPLACE FUNCTION generate_supplier_deliveries(
  p_supplier_id TEXT,
  p_supplier_name TEXT,
  p_category_code TEXT,
  p_category_name TEXT,
  p_target_pct NUMERIC,
  p_total_deliveries INT
) RETURNS VOID AS $$
DECLARE
  v_org_id TEXT := 'ID-POWER-001';
  v_otif_count INT;
  v_non_otif_count INT;
  v_po_base TEXT;
  v_date_base DATE := CURRENT_DATE - 180;
BEGIN
  v_otif_count := ROUND(p_total_deliveries * p_target_pct / 100)::INT;
  v_non_otif_count := p_total_deliveries - v_otif_count;

  -- Generate OTIF deliveries (bulk insert)
  INSERT INTO supplier_otif_deliveries (
    organization_id, purchase_order_id, supplier_id, supplier_name,
    order_date, expected_delivery_date, actual_delivery_date,
    quantity_ordered, quantity_delivered,
    is_on_time, is_in_full, is_otif, delivery_status,
    delay_days, quantity_shortage, product_category, main_category, main_category_code,
    created_at, updated_at
  )
  SELECT
    v_org_id,
    p_supplier_id || '-PO-' || LPAD(((gs - 1) / 4 + 1)::TEXT, 4, '0'),
    p_supplier_id,
    p_supplier_name,
    v_date_base + (RANDOM() * 180)::INT - 30,
    v_date_base + (RANDOM() * 180)::INT,
    v_date_base + (RANDOM() * 180)::INT,
    100 + (RANDOM() * 900)::INT,
    100 + (RANDOM() * 900)::INT,
    TRUE, TRUE, TRUE, 'Completed',
    0, 0,
    'Equipment', p_category_name, p_category_code,
    NOW(), NOW()
  FROM generate_series(1, v_otif_count) gs;

  -- Generate NON-OTIF deliveries (bulk insert)
  INSERT INTO supplier_otif_deliveries (
    organization_id, purchase_order_id, supplier_id, supplier_name,
    order_date, expected_delivery_date, actual_delivery_date,
    quantity_ordered, quantity_delivered,
    is_on_time, is_in_full, is_otif, delivery_status,
    delay_days, quantity_shortage, product_category, main_category, main_category_code,
    created_at, updated_at
  )
  SELECT
    v_org_id,
    p_supplier_id || '-PO-' || LPAD(((v_otif_count + gs - 1) / 4 + 1)::TEXT, 4, '0'),
    p_supplier_id,
    p_supplier_name,
    v_date_base + (RANDOM() * 180)::INT - 30,
    v_date_base + (RANDOM() * 180)::INT,
    v_date_base + (RANDOM() * 180)::INT + (1 + (RANDOM() * 10)::INT),
    100 + (RANDOM() * 900)::INT,
    (100 + (RANDOM() * 900)::INT) * 0.85,
    FALSE, FALSE, FALSE, 'Delayed/Incomplete',
    1 + (RANDOM() * 10)::INT,
    (100 + (RANDOM() * 900)::INT) * 0.15,
    'Equipment', p_category_name, p_category_code,
    NOW(), NOW()
  FROM generate_series(1, v_non_otif_count) gs;
END;
$$ LANGUAGE plpgsql;

-- OVERALL TOP 10
SELECT generate_supplier_deliveries('SUP-TOP01', 'PT Nusantara Logistik Prima', 'A', 'Peralatan dan Komponen Mesin', 98.5, 200);
SELECT generate_supplier_deliveries('SUP-TOP02', 'PT Mesin Nusantara Utama', 'A', 'Peralatan dan Komponen Mesin', 98.0, 200);
SELECT generate_supplier_deliveries('SUP-TOP03', 'PT Energi Teknologi Indonesia', 'B', 'Material Konstruksi dan Infrastruktur', 97.5, 200);
SELECT generate_supplier_deliveries('SUP-TOP04', 'PT Turbine Systems International', 'A', 'Peralatan dan Komponen Mesin', 97.0, 200);
SELECT generate_supplier_deliveries('SUP-TOP05', 'PT Konstruksi Pembangkit Nusantara', 'F', 'Peralatan Utama Pembangkit dan Project EPC', 96.5, 200);
SELECT generate_supplier_deliveries('SUP-TOP06', 'PT Precision Parts Manufacturing', 'A', 'Peralatan dan Komponen Mesin', 96.0, 200);
SELECT generate_supplier_deliveries('SUP-TOP07', 'PT Bahan Kimia Industri', 'C', 'Bahan Kimia dan Material Penunjang Operasional', 95.5, 200);
SELECT generate_supplier_deliveries('SUP-TOP08', 'PT Generator Systems Asia', 'A', 'Peralatan dan Komponen Mesin', 95.0, 200);
SELECT generate_supplier_deliveries('SUP-TOP09', 'PT Peralatan Keselamatan Prima', 'D', 'Peralatan Keselamatan dan Perlindungan', 94.5, 200);
SELECT generate_supplier_deliveries('SUP-TOP10', 'PT Layanan Konsultan Profesional', 'E', 'Jasa Konsultasi dan Pengembangan SDM', 94.0, 200);

-- CATEGORY A
SELECT generate_supplier_deliveries('SUP-A01', 'PT Turbo Engineering Indonesia', 'A', 'Peralatan dan Komponen Mesin', 97.8, 180);
SELECT generate_supplier_deliveries('SUP-A02', 'PT Komponen Industri Prima', 'A', 'Peralatan dan Komponen Mesin', 96.8, 180);
SELECT generate_supplier_deliveries('SUP-A03', 'PT Mega Power Equipment', 'A', 'Peralatan dan Komponen Mesin', 95.8, 180);
SELECT generate_supplier_deliveries('SUP-A04', 'PT Mechanical Solutions Pro', 'A', 'Peralatan dan Komponen Mesin', 94.8, 180);
SELECT generate_supplier_deliveries('SUP-A05', 'PT Indo Machine Components', 'A', 'Peralatan dan Komponen Mesin', 93.8, 180);
SELECT generate_supplier_deliveries('SUP-A06', 'PT Bearing Specialist Indonesia', 'A', 'Peralatan dan Komponen Mesin', 92.8, 180);
SELECT generate_supplier_deliveries('SUP-A07', 'PT Valve Technology Asia', 'A', 'Peralatan dan Komponen Mesin', 91.8, 180);
SELECT generate_supplier_deliveries('SUP-A08', 'PT Pump Systems Nusantara', 'A', 'Peralatan dan Komponen Mesin', 90.8, 180);
SELECT generate_supplier_deliveries('SUP-A09', 'PT Motor Elektrik Indonesia', 'A', 'Peralatan dan Komponen Mesin', 89.8, 180);
SELECT generate_supplier_deliveries('SUP-A10', 'PT Gear Manufacturing Prima', 'A', 'Peralatan dan Komponen Mesin', 88.8, 180);

-- CATEGORY B
SELECT generate_supplier_deliveries('SUP-B01', 'PT Beton Perkasa Indonesia', 'B', 'Material Konstruksi dan Infrastruktur', 96.5, 180);
SELECT generate_supplier_deliveries('SUP-B02', 'PT Baja Konstruksi Nusantara', 'B', 'Material Konstruksi dan Infrastruktur', 95.5, 180);
SELECT generate_supplier_deliveries('SUP-B03', 'PT Material Bangunan Prima', 'B', 'Material Konstruksi dan Infrastruktur', 94.5, 180);
SELECT generate_supplier_deliveries('SUP-B04', 'PT Semen Infrastruktur Jaya', 'B', 'Material Konstruksi dan Infrastruktur', 93.5, 180);
SELECT generate_supplier_deliveries('SUP-B05', 'PT Cat dan Pelapis Indonesia', 'B', 'Material Konstruksi dan Infrastruktur', 92.5, 180);
SELECT generate_supplier_deliveries('SUP-B06', 'PT Pipa dan Fitting Nusantara', 'B', 'Material Konstruksi dan Infrastruktur', 91.5, 180);
SELECT generate_supplier_deliveries('SUP-B07', 'PT Kabel Listrik Mandiri', 'B', 'Material Konstruksi dan Infrastruktur', 90.5, 180);
SELECT generate_supplier_deliveries('SUP-B08', 'PT Panel Distribusi Asia', 'B', 'Material Konstruksi dan Infrastruktur', 89.5, 180);
SELECT generate_supplier_deliveries('SUP-B09', 'PT Insulasi Thermal Indonesia', 'B', 'Material Konstruksi dan Infrastruktur', 88.5, 180);
SELECT generate_supplier_deliveries('SUP-B10', 'PT Alat Berat Konstruksi', 'B', 'Material Konstruksi dan Infrastruktur', 87.5, 180);

-- CATEGORY C
SELECT generate_supplier_deliveries('SUP-C01', 'PT Kimia Industri Nusantara', 'C', 'Bahan Kimia dan Material Penunjang Operasional', 95.2, 180);
SELECT generate_supplier_deliveries('SUP-C02', 'PT Pelumas Mesin Indonesia', 'C', 'Bahan Kimia dan Material Penunjang Operasional', 94.2, 180);
SELECT generate_supplier_deliveries('SUP-C03', 'PT Grease dan Oil Prima', 'C', 'Bahan Kimia dan Material Penunjang Operasional', 93.2, 180);
SELECT generate_supplier_deliveries('SUP-C04', 'PT Cairan Pendingin Teknologi', 'C', 'Bahan Kimia dan Material Penunjang Operasional', 92.2, 180);
SELECT generate_supplier_deliveries('SUP-C05', 'PT Solvent Kimia Jaya', 'C', 'Bahan Kimia dan Material Penunjang Operasional', 91.2, 180);
SELECT generate_supplier_deliveries('SUP-C06', 'PT Bahan Pembersih Industri', 'C', 'Bahan Kimia dan Material Penunjang Operasional', 90.2, 180);
SELECT generate_supplier_deliveries('SUP-C07', 'PT Resin dan Adhesive Indonesia', 'C', 'Bahan Kimia dan Material Penunjang Operasional', 89.2, 180);
SELECT generate_supplier_deliveries('SUP-C08', 'PT Coating Material Asia', 'C', 'Bahan Kimia dan Material Penunjang Operasional', 88.2, 180);
SELECT generate_supplier_deliveries('SUP-C09', 'PT Gas Industri Nusantara', 'C', 'Bahan Kimia dan Material Penunjang Operasional', 87.2, 180);
SELECT generate_supplier_deliveries('SUP-C10', 'PT Water Treatment Chemicals', 'C', 'Bahan Kimia dan Material Penunjang Operasional', 86.2, 180);

-- CATEGORY D
SELECT generate_supplier_deliveries('SUP-D01', 'PT Safety Equipment Indonesia', 'D', 'Peralatan Keselamatan dan Perlindungan', 94.7, 180);
SELECT generate_supplier_deliveries('SUP-D02', 'PT Proteksi Keselamatan Prima', 'D', 'Peralatan Keselamatan dan Perlindungan', 93.7, 180);
SELECT generate_supplier_deliveries('SUP-D03', 'PT Personal Protective Gear', 'D', 'Peralatan Keselamatan dan Perlindungan', 92.7, 180);
SELECT generate_supplier_deliveries('SUP-D04', 'PT Fire Protection Systems', 'D', 'Peralatan Keselamatan dan Perlindungan', 91.7, 180);
SELECT generate_supplier_deliveries('SUP-D05', 'PT Emergency Response Equipment', 'D', 'Peralatan Keselamatan dan Perlindungan', 90.7, 180);
SELECT generate_supplier_deliveries('SUP-D06', 'PT Safety Tools Nusantara', 'D', 'Peralatan Keselamatan dan Perlindungan', 89.7, 180);
SELECT generate_supplier_deliveries('SUP-D07', 'PT Alat Pemadam Kebakaran', 'D', 'Peralatan Keselamatan dan Perlindungan', 88.7, 180);
SELECT generate_supplier_deliveries('SUP-D08', 'PT Breathing Apparatus Asia', 'D', 'Peralatan Keselamatan dan Perlindungan', 87.7, 180);
SELECT generate_supplier_deliveries('SUP-D09', 'PT Helm dan Sepatu Safety', 'D', 'Peralatan Keselamatan dan Perlindungan', 86.7, 180);
SELECT generate_supplier_deliveries('SUP-D10', 'PT Deteksi Gas dan Asap', 'D', 'Peralatan Keselamatan dan Perlindungan', 85.7, 180);

-- CATEGORY E
SELECT generate_supplier_deliveries('SUP-E01', 'PT Konsultan Manajemen Profesional', 'E', 'Jasa Konsultasi dan Pengembangan SDM', 93.4, 180);
SELECT generate_supplier_deliveries('SUP-E02', 'PT Training dan Development Indonesia', 'E', 'Jasa Konsultasi dan Pengembangan SDM', 92.4, 180);
SELECT generate_supplier_deliveries('SUP-E03', 'PT Human Capital Solutions', 'E', 'Jasa Konsultasi dan Pengembangan SDM', 91.4, 180);
SELECT generate_supplier_deliveries('SUP-E04', 'PT Sertifikasi dan Audit Sistem', 'E', 'Jasa Konsultasi dan Pengembangan SDM', 90.4, 180);
SELECT generate_supplier_deliveries('SUP-E05', 'PT Pengembangan Kompetensi SDM', 'E', 'Jasa Konsultasi dan Pengembangan SDM', 89.4, 180);
SELECT generate_supplier_deliveries('SUP-E06', 'PT Konsultan IT dan Digitalisasi', 'E', 'Jasa Konsultasi dan Pengembangan SDM', 88.4, 180);
SELECT generate_supplier_deliveries('SUP-E07', 'PT Legal dan Compliance Services', 'E', 'Jasa Konsultasi dan Pengembangan SDM', 87.4, 180);
SELECT generate_supplier_deliveries('SUP-E08', 'PT Audit Keuangan dan Pajak', 'E', 'Jasa Konsultasi dan Pengembangan SDM', 86.4, 180);
SELECT generate_supplier_deliveries('SUP-E09', 'PT Konsultan Lingkungan Hidup', 'E', 'Jasa Konsultasi dan Pengembangan SDM', 85.4, 180);
SELECT generate_supplier_deliveries('SUP-E10', 'PT Riset dan Analisis Pasar', 'E', 'Jasa Konsultasi dan Pengembangan SDM', 84.4, 180);

-- CATEGORY F
SELECT generate_supplier_deliveries('SUP-F01', 'PT Engineering Power Solutions', 'F', 'Peralatan Utama Pembangkit dan Project EPC', 97.2, 180);
SELECT generate_supplier_deliveries('SUP-F02', 'PT Listrik Proyek Indonesia', 'F', 'Peralatan Utama Pembangkit dan Project EPC', 96.2, 180);
SELECT generate_supplier_deliveries('SUP-F03', 'PT Pembangkit Energi Prima', 'F', 'Peralatan Utama Pembangkit dan Project EPC', 95.2, 180);
SELECT generate_supplier_deliveries('SUP-F04', 'PT EPC Kontrak Specialist', 'F', 'Peralatan Utama Pembangkit dan Project EPC', 94.2, 180);
SELECT generate_supplier_deliveries('SUP-F05', 'PT Utama Power Projects', 'F', 'Peralatan Utama Pembangkit dan Project EPC', 93.2, 180);
SELECT generate_supplier_deliveries('SUP-F06', 'PT Konstruksi Elektrik Maju', 'F', 'Peralatan Utama Pembangkit dan Project EPC', 92.2, 180);
SELECT generate_supplier_deliveries('SUP-F07', 'PT Project Management Indonesia', 'F', 'Peralatan Utama Pembangkit dan Project EPC', 91.2, 180);
SELECT generate_supplier_deliveries('SUP-F08', 'PT Instalasi Pembangkit Mandiri', 'F', 'Peralatan Utama Pembangkit dan Project EPC', 90.2, 180);
SELECT generate_supplier_deliveries('SUP-F09', 'PT EPC Engineering Services', 'F', 'Peralatan Utama Pembangkit dan Project EPC', 89.2, 180);
SELECT generate_supplier_deliveries('SUP-F10', 'PT Boiler dan Turbine Systems', 'F', 'Peralatan Utama Pembangkit dan Project EPC', 88.2, 180);

-- Refresh summary table
INSERT INTO supplier_otif_performance (
  organization_id, supplier_id, supplier_name,
  period_start, period_end,
  total_deliveries, on_time_deliveries, in_full_deliveries, otif_deliveries,
  on_time_percentage, in_full_percentage, otif_percentage,
  avg_delay_days, supplier_tier
)
SELECT
  organization_id, supplier_id, supplier_name,
  MIN(order_date), MAX(order_date),
  COUNT(*),
  SUM(CASE WHEN is_on_time THEN 1 ELSE 0 END),
  SUM(CASE WHEN is_in_full THEN 1 ELSE 0 END),
  SUM(CASE WHEN is_otif THEN 1 ELSE 0 END),
  ROUND(100.0 * SUM(CASE WHEN is_on_time THEN 1 ELSE 0 END) / COUNT(*), 2),
  ROUND(100.0 * SUM(CASE WHEN is_in_full THEN 1 ELSE 0 END) / COUNT(*), 2),
  ROUND(100.0 * SUM(CASE WHEN is_otif THEN 1 ELSE 0 END) / COUNT(*), 2),
  AVG(CASE WHEN delay_days > 0 THEN delay_days ELSE NULL END),
  'strategic'
FROM supplier_otif_deliveries
GROUP BY organization_id, supplier_id, supplier_name;

-- Drop the helper function
DROP FUNCTION IF EXISTS generate_supplier_deliveries;
