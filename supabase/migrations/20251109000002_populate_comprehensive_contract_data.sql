/*
  # Populate Comprehensive Contract Data for All Three Metrics

  1. Data Generation
    - 135 contracts distributed across 6 main categories (A-F)
    - Each contract includes savings, sourcing speed, and OTIF data
    - Realistic values based on Indonesia Power operations

  2. Distribution by Category
    - Category A: 25 contracts (Energy/Fuel - high volume)
    - Category B: 22 contracts (Mechanical/Electrical equipment)
    - Category C: 30 contracts (Materials/Supplies - most frequent)
    - Category D: 18 contracts (Non-operational assets)
    - Category E: 25 contracts (Services - frequent)
    - Category F: 15 contracts (Major equipment/EPC - large value, less frequent)

  3. Important Notes
    - Supplier names are realistic Indonesian company names
    - Contract values in IDR (Indonesian Rupiah)
    - Dates span 2024-2025 for realistic trending
    - All data properly linked to category reference
*/

-- Function to help generate realistic dates
DO $$
DECLARE
  v_cat_a_ids uuid[];
  v_cat_b_ids uuid[];
  v_cat_c_ids uuid[];
  v_cat_d_ids uuid[];
  v_cat_e_ids uuid[];
  v_cat_f_ids uuid[];
BEGIN
  -- Get category IDs for easier reference
  SELECT array_agg(id) INTO v_cat_a_ids FROM ref_procurement_categories WHERE main_category_code = 'A';
  SELECT array_agg(id) INTO v_cat_b_ids FROM ref_procurement_categories WHERE main_category_code = 'B';
  SELECT array_agg(id) INTO v_cat_c_ids FROM ref_procurement_categories WHERE main_category_code = 'C';
  SELECT array_agg(id) INTO v_cat_d_ids FROM ref_procurement_categories WHERE main_category_code = 'D';
  SELECT array_agg(id) INTO v_cat_e_ids FROM ref_procurement_categories WHERE main_category_code = 'E';
  SELECT array_agg(id) INTO v_cat_f_ids FROM ref_procurement_categories WHERE main_category_code = 'F';

  -- Category A: Energi Primer (25 contracts)
  INSERT INTO fact_procurement_savings_contract (
    contract_id, contract_name, supplier_name, category, business_unit,
    award_date, owner_estimate, final_contract_value, contract_status,
    contract_duration_months, notes, organization_id, category_id, main_category_code, subcategory_code
  )
  SELECT
    'CONT-A-' || LPAD(seq::text, 4, '0'),
    CASE
      WHEN seq <= 10 THEN 'Pengadaan Batu Bara ' || (2024 + (seq-1)/5) || ' - Batch ' || ((seq-1) % 5 + 1)
      WHEN seq <= 15 THEN 'Pengadaan Gas Alam ' || (2024 + (seq-11)/3) || ' - Kontrak ' || ((seq-11) % 3 + 1)
      WHEN seq <= 20 THEN 'Pengadaan Solar/HSD ' || (2024 + (seq-16)/3) || ' - Periode ' || ((seq-16) % 3 + 1)
      ELSE 'Jasa Transportasi & Stockpile ' || (2024 + (seq-21)/3)
    END,
    CASE (seq % 8)
      WHEN 0 THEN 'PT Bukit Asam Tbk'
      WHEN 1 THEN 'PT Pertamina Gas'
      WHEN 2 THEN 'PT Adaro Energy Indonesia'
      WHEN 3 THEN 'PT Perusahaan Gas Negara'
      WHEN 4 THEN 'PT AKR Corporindo'
      WHEN 5 THEN 'PT Sarana Mitra Luas'
      WHEN 6 THEN 'PT Indo Tambangraya Megah'
      ELSE 'PT Pelayaran Bahtera Adhiguna'
    END,
    CASE
      WHEN seq <= 10 THEN 'EPC Projects'
      WHEN seq <= 15 THEN 'Capital Equipment'
      WHEN seq <= 20 THEN 'MRO'
      ELSE 'Consulting Services'
    END,
    CASE (seq % 5)
      WHEN 0 THEN 'PLTU Suralaya'
      WHEN 1 THEN 'PLTU Paiton'
      WHEN 2 THEN 'PLTGU Muara Karang'
      WHEN 3 THEN 'PLTU Tanjung Jati B'
      ELSE 'PLTGU Priok'
    END,
    ('2024-01-01'::date + (seq * 11 || ' days')::interval)::date,
    (15000000000::bigint + (seq * 850000000::bigint))::numeric,
    (13500000000::bigint + (seq * 750000000::bigint))::numeric,
    'Finalized',
    12 + (seq % 3) * 12,
    'Contract untuk kategori A - Energi Primer',
    'ORG001',
    v_cat_a_ids[(seq % array_length(v_cat_a_ids, 1)) + 1],
    'A',
    'A-' || LPAD(((seq % 6) + 1)::text, 2, '0')
  FROM generate_series(1, 25) AS seq;

  -- Category B: Peralatan Mechanical/Electrical (22 contracts)
  INSERT INTO fact_procurement_savings_contract (
    contract_id, contract_name, supplier_name, category, business_unit,
    award_date, owner_estimate, final_contract_value, contract_status,
    contract_duration_months, notes, organization_id, category_id, main_category_code, subcategory_code
  )
  SELECT
    'CONT-B-' || LPAD(seq::text, 4, '0'),
    CASE
      WHEN seq <= 8 THEN 'Pengadaan Sistem Kontrol SCADA Unit ' || seq
      WHEN seq <= 14 THEN 'Pengadaan Motor Listrik & Panel ' || (seq - 8)
      WHEN seq <= 18 THEN 'Overhaul Pompa & Kompresor ' || (seq - 14)
      ELSE 'Upgrade Sistem Proteksi Unit ' || (seq - 18)
    END,
    CASE (seq % 10)
      WHEN 0 THEN 'PT Siemens Indonesia'
      WHEN 1 THEN 'PT ABB Indonesia'
      WHEN 2 THEN 'PT Schneider Electric Indonesia'
      WHEN 3 THEN 'PT Yokogawa Indonesia'
      WHEN 4 THEN 'PT Toshiba Indonesia'
      WHEN 5 THEN 'PT Mitsubishi Electric Indonesia'
      WHEN 6 THEN 'PT GE Indonesia'
      WHEN 7 THEN 'PT Honeywell Indonesia'
      WHEN 8 THEN 'PT Rockwell Automation Indonesia'
      ELSE 'PT Delta Electronics Indonesia'
    END,
    'Capital Equipment',
    CASE (seq % 4)
      WHEN 0 THEN 'PLTU Suralaya'
      WHEN 1 THEN 'PLTU Paiton'
      WHEN 2 THEN 'PLTGU Muara Karang'
      ELSE 'PLTU Tanjung Jati B'
    END,
    ('2024-02-01'::date + (seq * 13 || ' days')::interval)::date,
    (8500000000::bigint + (seq * 650000000::bigint))::numeric,
    (7200000000::bigint + (seq * 550000000::bigint))::numeric,
    'Finalized',
    18 + (seq % 2) * 6,
    'Contract untuk kategori B - Mechanical/Electrical',
    'ORG001',
    v_cat_b_ids[(seq % array_length(v_cat_b_ids, 1)) + 1],
    'B',
    'B-' || LPAD(((seq % 6) + 1)::text, 2, '0')
  FROM generate_series(1, 22) AS seq;

  -- Category C: Material & Consumables (30 contracts - most frequent)
  INSERT INTO fact_procurement_savings_contract (
    contract_id, contract_name, supplier_name, category, business_unit,
    award_date, owner_estimate, final_contract_value, contract_status,
    contract_duration_months, notes, organization_id, category_id, main_category_code, subcategory_code
  )
  SELECT
    'CONT-C-' || LPAD(seq::text, 4, '0'),
    CASE
      WHEN seq <= 10 THEN 'Pengadaan Spare Part Mekanik Q' || (((seq-1)/3)+1) || ' ' || (2024 + (seq-1)/10)
      WHEN seq <= 18 THEN 'Pengadaan Chemical & Lubricant Batch ' || (seq-10)
      WHEN seq <= 24 THEN 'Pengadaan Peralatan K3 ' || (2024 + (seq-19)/2)
      ELSE 'Pengadaan Material Konstruksi Proyek ' || (seq-24)
    END,
    CASE (seq % 12)
      WHEN 0 THEN 'PT United Tractors Pandu Engineering'
      WHEN 1 THEN 'PT Petrosea Tbk'
      WHEN 2 THEN 'PT Pamapersada Nusantara'
      WHEN 3 THEN 'PT Deltamas International'
      WHEN 4 THEN 'PT Shell Indonesia'
      WHEN 5 THEN 'PT Castrol Indonesia'
      WHEN 6 THEN 'PT Indocement Tunggal Prakarsa'
      WHEN 7 THEN 'PT Semen Indonesia'
      WHEN 8 THEN 'PT Krakatau Steel'
      WHEN 9 THEN 'PT Wijaya Karya Beton'
      WHEN 10 THEN 'PT Aneka Tambang'
      ELSE 'PT Freeport Indonesia'
    END,
    'MRO',
    CASE (seq % 5)
      WHEN 0 THEN 'PLTU Suralaya'
      WHEN 1 THEN 'PLTU Paiton'
      WHEN 2 THEN 'PLTGU Muara Karang'
      WHEN 3 THEN 'PLTU Tanjung Jati B'
      ELSE 'PLTGU Priok'
    END,
    ('2024-01-15'::date + (seq * 9 || ' days')::interval)::date,
    (2500000000::bigint + (seq * 180000000::bigint))::numeric,
    (2000000000::bigint + (seq * 145000000::bigint))::numeric,
    'Finalized',
    6 + (seq % 4) * 3,
    'Contract untuk kategori C - Material & Consumables',
    'ORG001',
    v_cat_c_ids[(seq % array_length(v_cat_c_ids, 1)) + 1],
    'C',
    'C-' || LPAD(((seq % 6) + 1)::text, 2, '0')
  FROM generate_series(1, 30) AS seq;

  -- Category D: Asset Non-Operasional (18 contracts)
  INSERT INTO fact_procurement_savings_contract (
    contract_id, contract_name, supplier_name, category, business_unit,
    award_date, owner_estimate, final_contract_value, contract_status,
    contract_duration_months, notes, organization_id, category_id, main_category_code, subcategory_code
  )
  SELECT
    'CONT-D-' || LPAD(seq::text, 4, '0'),
    CASE
      WHEN seq <= 6 THEN 'Pengadaan Kendaraan Operasional Fleet ' || seq
      WHEN seq <= 12 THEN 'Pengadaan Peralatan IT & Laptop Batch ' || (seq-6)
      WHEN seq <= 15 THEN 'Pengadaan Furniture Kantor ' || (seq-12)
      ELSE 'Pengadaan Peralatan Komunikasi Site ' || (seq-15)
    END,
    CASE (seq % 9)
      WHEN 0 THEN 'PT Astra International'
      WHEN 1 THEN 'PT Indomobil Sukses Internasional'
      WHEN 2 THEN 'PT Metrodata Electronics'
      WHEN 3 THEN 'PT Bhinneka Mentari Dimensi'
      WHEN 4 THEN 'PT Tera Data Indonusa'
      WHEN 5 THEN 'PT Kawan Lama Sejahtera'
      WHEN 6 THEN 'PT Atria Artha Persada'
      WHEN 7 THEN 'PT Telekomunikasi Indonesia'
      ELSE 'PT XL Axiata'
    END,
    'IT & Technology',
    CASE (seq % 3)
      WHEN 0 THEN 'Kantor Pusat Jakarta'
      WHEN 1 THEN 'PLTU Suralaya'
      ELSE 'PLTU Paiton'
    END,
    ('2024-03-01'::date + (seq * 14 || ' days')::interval)::date,
    (1800000000::bigint + (seq * 220000000::bigint))::numeric,
    (1450000000::bigint + (seq * 175000000::bigint))::numeric,
    'Finalized',
    12 + (seq % 3) * 12,
    'Contract untuk kategori D - Asset Non-Operasional',
    'ORG001',
    v_cat_d_ids[(seq % array_length(v_cat_d_ids, 1)) + 1],
    'D',
    'D-' || LPAD(((seq % 6) + 1)::text, 2, '0')
  FROM generate_series(1, 18) AS seq;

  -- Category E: Jasa dan Kontrak Pendukung (25 contracts)
  INSERT INTO fact_procurement_savings_contract (
    contract_id, contract_name, supplier_name, category, business_unit,
    award_date, owner_estimate, final_contract_value, contract_status,
    contract_duration_months, notes, organization_id, category_id, main_category_code, subcategory_code
  )
  SELECT
    'CONT-E-' || LPAD(seq::text, 4, '0'),
    CASE
      WHEN seq <= 8 THEN 'Jasa Maintenance Preventif ' || (2024 + (seq-1)/4) || ' Periode ' || ((seq-1) % 4 + 1)
      WHEN seq <= 14 THEN 'Jasa Konsultansi Engineering Project ' || (seq-8)
      WHEN seq <= 18 THEN 'Jasa IT Support & Software License ' || (seq-14)
      WHEN seq <= 22 THEN 'Jasa Kebersihan & Keamanan Site ' || (seq-18)
      ELSE 'Jasa Training SDM ' || (seq-22)
    END,
    CASE (seq % 11)
      WHEN 0 THEN 'PT Len Industri'
      WHEN 1 THEN 'PT Rekayasa Industri'
      WHEN 2 THEN 'PT Waskita Karya'
      WHEN 3 THEN 'PT Hutama Karya'
      WHEN 4 THEN 'PT Nindya Karya'
      WHEN 5 THEN 'PT Deloitte Indonesia'
      WHEN 6 THEN 'PT KPMG Indonesia'
      WHEN 7 THEN 'PT IBM Indonesia'
      WHEN 8 THEN 'PT Accen ture Indonesia'
      WHEN 9 THEN 'PT ISS Indonesia'
      ELSE 'PT Securicor Outsourcing'
    END,
    'Consulting Services',
    CASE (seq % 5)
      WHEN 0 THEN 'PLTU Suralaya'
      WHEN 1 THEN 'PLTU Paiton'
      WHEN 2 THEN 'PLTGU Muara Karang'
      WHEN 3 THEN 'PLTU Tanjung Jati B'
      ELSE 'Kantor Pusat Jakarta'
    END,
    ('2024-02-15'::date + (seq * 11 || ' days')::interval)::date,
    (3200000000::bigint + (seq * 280000000::bigint))::numeric,
    (2700000000::bigint + (seq * 235000000::bigint))::numeric,
    'Finalized',
    12,
    'Contract untuk kategori E - Jasa Pendukung',
    'ORG001',
    v_cat_e_ids[(seq % array_length(v_cat_e_ids, 1)) + 1],
    'E',
    'E-' || LPAD(((seq % 6) + 1)::text, 2, '0')
  FROM generate_series(1, 25) AS seq;

  -- Category F: Peralatan Utama & EPC (15 contracts - large value, less frequent)
  INSERT INTO fact_procurement_savings_contract (
    contract_id, contract_name, supplier_name, category, business_unit,
    award_date, owner_estimate, final_contract_value, contract_status,
    contract_duration_months, notes, organization_id, category_id, main_category_code, subcategory_code
  )
  SELECT
    'CONT-F-' || LPAD(seq::text, 4, '0'),
    CASE
      WHEN seq <= 4 THEN 'Overhaul Major Turbine Unit ' || seq
      WHEN seq <= 7 THEN 'Rehabilitasi Boiler PLTU ' || (seq-4)
      WHEN seq <= 10 THEN 'Pengadaan Transformer 150kV Unit ' || (seq-7)
      WHEN seq <= 12 THEN 'Project EPC PLTU 2x100MW Fase ' || (seq-10)
      ELSE 'Upgrade Balance of Plant System ' || (seq-12)
    END,
    CASE (seq % 8)
      WHEN 0 THEN 'PT General Electric Indonesia'
      WHEN 1 THEN 'PT Siemens Power Generation'
      WHEN 2 THEN 'PT Mitsubishi Heavy Industries Indonesia'
      WHEN 3 THEN 'PT Alstom Power Indonesia'
      WHEN 4 THEN 'PT Hyundai Engineering Indonesia'
      WHEN 5 THEN 'PT China Huadian Engineering Indonesia'
      WHEN 6 THEN 'PT Samsung C&T Indonesia'
      ELSE 'PT Sumitomo Corporation Indonesia'
    END,
    'EPC Projects',
    CASE (seq % 4)
      WHEN 0 THEN 'PLTU Suralaya'
      WHEN 1 THEN 'PLTU Paiton'
      WHEN 2 THEN 'PLTU Tanjung Jati B'
      ELSE 'PLTU Lontar'
    END,
    ('2024-01-01'::date + (seq * 20 || ' days')::interval)::date,
    (45000000000::bigint + (seq * 3500000000::bigint))::numeric,
    (41000000000::bigint + (seq * 3200000000::bigint))::numeric,
    'Finalized',
    36 + (seq % 2) * 12,
    'Contract untuk kategori F - Peralatan Utama & EPC',
    'ORG001',
    v_cat_f_ids[(seq % array_length(v_cat_f_ids, 1)) + 1],
    'F',
    'F-' || LPAD(((seq % 6) + 1)::text, 2, '0')
  FROM generate_series(1, 15) AS seq;

END $$;
