#!/usr/bin/env ts-node

/**
 * PLN Indonesia Power Marketplace - Filter Product Mock Data Generator
 *
 * Generates comprehensive mock data for industrial filtration products across 9 categories:
 * 1. Filter Bahan Bakar (Fuel Filters)
 * 2. Filter Bahan Kimia (Chemical Filters)
 * 3. Filter Bahan Minyak (Oil Filters)
 * 4. Filter Khusus (Specialized Filters)
 * 5. Filter Multi Fungsi (Multifunctional Filters)
 * 6. Filter Udara dan Gas (Air and Gas Filters)
 * 7. Penyaringan Air (Water Filtration)
 * 8. Saringan Uap (Steam Filters)
 * 9. Spare Part dan Perlengakapan Filter (Spare Parts)
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// CATEGORY DEFINITIONS
// ============================================================================

const filterCategories = [
  {
    category_id: 'CAT-FILTER-BBK',
    category_code: 'FLT-BBK',
    category_name: 'Filter Bahan Bakar',
    description: 'Filters for diesel fuel, heavy fuel oil (HFO), marine fuel oil (MFO), and biodiesel blends used in PLN power generation facilities',
    icon_name: 'Fuel',
    display_order: 1,
    is_active: true
  },
  {
    category_id: 'CAT-FILTER-BKM',
    category_code: 'FLT-BKM',
    category_name: 'Filter Bahan Kimia',
    description: 'Chemical filters for processing acids, alkalis, solvents, and treatment chemicals in power plant operations',
    icon_name: 'Droplet',
    display_order: 2,
    is_active: true
  },
  {
    category_id: 'CAT-FILTER-MNY',
    category_code: 'FLT-MNY',
    category_name: 'Filter Bahan Minyak',
    description: 'Lubricating oil filters for turbines, generators, hydraulic systems, and auxiliary equipment',
    icon_name: 'Droplets',
    display_order: 3,
    is_active: true
  },
  {
    category_id: 'CAT-FILTER-KHS',
    category_code: 'FLT-KHS',
    category_name: 'Filter Khusus',
    description: 'Specialized filters for unique applications, custom-engineered solutions, and advanced filtration technologies',
    icon_name: 'Shield',
    display_order: 4,
    is_active: true
  },
  {
    category_id: 'CAT-FILTER-MLF',
    category_code: 'FLT-MLF',
    category_name: 'Filter Multi Fungsi',
    description: 'Multifunctional filters combining multiple filtration technologies or serving multiple purposes',
    icon_name: 'GitBranch',
    display_order: 5,
    is_active: true
  },
  {
    category_id: 'CAT-FILTER-UGS',
    category_code: 'FLT-UGS',
    category_name: 'Filter Udara dan Gas',
    description: 'Air and gas filters for gas turbine intake, compressed air systems, and flue gas treatment',
    icon_name: 'Wind',
    display_order: 6,
    is_active: true
  },
  {
    category_id: 'CAT-FILTER-AIR',
    category_code: 'SRN-AIR',
    category_name: 'Penyaringan Air',
    description: 'Water filtration systems for raw water treatment, demineralized water production, and cooling water',
    icon_name: 'Waves',
    display_order: 7,
    is_active: true
  },
  {
    category_id: 'CAT-FILTER-UAP',
    category_code: 'SRN-UAP',
    category_name: 'Saringan Uap',
    description: 'Steam strainers and filters for steam distribution systems, process steam, and turbine applications',
    icon_name: 'CloudRain',
    display_order: 8,
    is_active: true
  },
  {
    category_id: 'CAT-SPARE-FLT',
    category_code: 'SPR-FLT',
    category_name: 'Spare Part dan Perlengkapan Filter',
    description: 'Replacement parts, accessories, and consumables for all filter types',
    icon_name: 'Package',
    display_order: 9,
    is_active: true
  }
];

// ============================================================================
// SUPPLIER DEFINITIONS
// ============================================================================

const suppliers = [
  {
    supplier_id: 'SUP-000001',
    supplier_code: 'DNL-ID',
    supplier_name: 'PT Donaldson Indonesia',
    contact_person: 'Budi Santoso',
    contact_email: 'budi.santoso@donaldson.co.id',
    contact_phone: '+62 21 5555 1001',
    address: 'Kawasan Industri MM2100 Blok A-1',
    city: 'Bekasi',
    province: 'Jawa Barat',
    postal_code: '17520',
    certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'SNI Certified'],
    performance_rating: 4.8,
    is_pln_approved: true,
    is_active: true
  },
  {
    supplier_id: 'SUP-000002',
    supplier_code: 'PKR-ID',
    supplier_name: 'PT Parker Hannifin Indonesia',
    contact_person: 'Siti Rahma',
    contact_email: 'siti.rahma@parker.com',
    contact_phone: '+62 21 5555 1002',
    address: 'Jl. Raya Narogong KM 26',
    city: 'Bekasi',
    province: 'Jawa Barat',
    postal_code: '17530',
    certifications: ['ISO 9001:2015', 'ISO 45001', 'PLN Approved'],
    performance_rating: 4.9,
    is_pln_approved: true,
    is_active: true
  },
  {
    supplier_id: 'SUP-000003',
    supplier_code: 'PALL-ID',
    supplier_name: 'PT Pall Indonesia',
    contact_person: 'Ahmad Hidayat',
    contact_email: 'ahmad.hidayat@pall.com',
    contact_phone: '+62 21 5555 1003',
    address: 'Gedung Wisma 77 Tower B Lt. 15',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    postal_code: '12190',
    certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'ASME Certified'],
    performance_rating: 4.7,
    is_pln_approved: true,
    is_active: true
  },
  {
    supplier_id: 'SUP-000004',
    supplier_code: 'HYD-ID',
    supplier_name: 'PT Hydac Indonesia',
    contact_person: 'Dewi Lestari',
    contact_email: 'dewi.lestari@hydac.com',
    contact_phone: '+62 21 5555 1004',
    address: 'Kawasan Industri Jababeka Blok V-12',
    city: 'Cikarang',
    province: 'Jawa Barat',
    postal_code: '17530',
    certifications: ['ISO 9001:2015', 'ISO 16889', 'PLN Approved'],
    performance_rating: 4.6,
    is_pln_approved: true,
    is_active: true
  },
  {
    supplier_id: 'SUP-000005',
    supplier_code: 'MAN-ID',
    supplier_name: 'PT Mann+Hummel Indonesia',
    contact_person: 'Rudi Hermawan',
    contact_email: 'rudi.hermawan@mann-hummel.com',
    contact_phone: '+62 21 5555 1005',
    address: 'Jl. Industri Raya III No. 8',
    city: 'Tangerang',
    province: 'Banten',
    postal_code: '15134',
    certifications: ['ISO 9001:2015', 'ISO/TS 16949', 'SNI Certified'],
    performance_rating: 4.5,
    is_pln_approved: true,
    is_active: true
  },
  {
    supplier_id: 'SUP-000006',
    supplier_code: 'FLX-ID',
    supplier_name: 'PT Filtrex Indonesia',
    contact_person: 'Nina Kartika',
    contact_email: 'nina.kartika@filtrex.co.id',
    contact_phone: '+62 21 5555 1006',
    address: 'Kawasan Industri Pulogadung',
    city: 'Jakarta Timur',
    province: 'DKI Jakarta',
    postal_code: '13920',
    certifications: ['ISO 9001:2015', 'PLN Approved'],
    performance_rating: 4.4,
    is_pln_approved: true,
    is_active: true
  },
  {
    supplier_id: 'SUP-000007',
    supplier_code: 'CAM-ID',
    supplier_name: 'PT Camfil Indonesia',
    contact_person: 'Hendra Wijaya',
    contact_email: 'hendra.wijaya@camfil.com',
    contact_phone: '+62 21 5555 1007',
    address: 'Gedung Gajah Unit J',
    city: 'Jakarta Pusat',
    province: 'DKI Jakarta',
    postal_code: '10270',
    certifications: ['ISO 9001:2015', 'ISO 14644', 'Eurovent Certified'],
    performance_rating: 4.7,
    is_pln_approved: true,
    is_active: true
  },
  {
    supplier_id: 'SUP-000008',
    supplier_code: 'PEN-ID',
    supplier_name: 'PT Pentair Indonesia',
    contact_person: 'Lisa Anggraini',
    contact_email: 'lisa.anggraini@pentair.com',
    contact_phone: '+62 21 5555 1008',
    address: 'Komplek Ruko Sentra Niaga Blok A-5',
    city: 'Tangerang Selatan',
    province: 'Banten',
    postal_code: '15310',
    certifications: ['ISO 9001:2015', 'NSF Certified', 'PLN Approved'],
    performance_rating: 4.6,
    is_pln_approved: true,
    is_active: true
  }
];

// ============================================================================
// FILTER PRODUCTS DATA
// ============================================================================

const filterProducts = [
  // ========== FILTER BAHAN BAKAR (FUEL FILTERS) ==========
  {
    item_code: 'FLT-BBK-001',
    item_name: 'Filter Bahan Bakar Solar Premium - Kapasitas 500 L/jam',
    item_description: 'Filter cartridge type dengan efisiensi tinggi untuk penyaringan bahan bakar solar pada sistem pembangkit listrik diesel. Dilengkapi water separator dengan efisiensi 95%. Material housing stainless steel 316L. Cocok untuk PLTD dengan generator 500-1000 kVA.',
    category_id: 'CAT-FILTER-BBK',
    supplier_id: 'SUP-000001',
    unit_price: 1250000.00,
    currency: 'IDR',
    stock_quantity: 45,
    lead_time_days: 10,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'Cartridge',
      filtration_rating: '10 micron absolute',
      beta_ratio: '>1000 @ 10 micron',
      flow_rate: { value: 500, unit: 'L/hr', condition: '@ 25°C, clean filter' },
      pressure_rating: { working: '10 bar', burst: '40 bar', test: '15 bar' },
      temperature_range: { min: -20, max: 120, unit: '°C' },
      connections: { inlet: 'BSP 1"', outlet: 'BSP 1"', drain: 'BSP 1/2"' },
      filter_media: { type: 'Cellulose + Synthetic blend', area: '2.5 m²', efficiency: '99.9%' },
      water_separation: { capability: true, efficiency: '95%', type: 'Coalescing' },
      dimensions: { length: 350, width: 250, height: 450, unit: 'mm' },
      weight: 12.5,
      service_life: '6 months or 2000 hours'
    },
    compliance_certifications: ['SNI 19-1234-2020', 'ISO 9001:2015', 'PLN-APP-2024-00123'],
    warranty_info: '12 bulan garansi penuh dari tanggal instalasi',
    is_active: true
  },
  {
    item_code: 'FLT-BBK-002',
    item_name: 'Filter HFO (Heavy Fuel Oil) Duplex Assembly - 2000 L/jam',
    item_description: 'Filter assembly duplex untuk HFO dengan sistem automatic changeover. Dilengkapi preheater terintegrasi untuk menjaga suhu optimal HFO. Material konstruksi carbon steel dengan coating anti korosi. Ideal untuk PLTMG skala besar.',
    category_id: 'CAT-FILTER-BBK',
    supplier_id: 'SUP-000002',
    unit_price: 8500000.00,
    currency: 'IDR',
    stock_quantity: 12,
    lead_time_days: 21,
    unit_of_measure: 'SET',
    technical_specifications: {
      filter_type: 'Duplex Assembly with Auto Changeover',
      filtration_rating: '25 micron',
      flow_rate: { value: 2000, unit: 'L/hr', condition: '@ 98°C' },
      pressure_rating: { working: '16 bar', burst: '64 bar' },
      temperature_rating: { min: 60, max: 150, unit: '°C' },
      preheater: { type: 'Electric', power: '6 kW', voltage: '380V 3-phase' },
      connections: { inlet: 'Flange DN80 PN16', outlet: 'Flange DN80 PN16' },
      material: { housing: 'Carbon Steel A105', element: 'Stainless Steel Wire Mesh' },
      dimensions: { length: 1200, width: 800, height: 1500, unit: 'mm' },
      weight: 285,
      differential_pressure_switch: true
    },
    compliance_certifications: ['ISO 9001:2015', 'ASME B31.3', 'PLN-APP-2024-00145'],
    warranty_info: '24 bulan untuk housing, 12 bulan untuk elemen filter',
    is_active: true
  },
  {
    item_code: 'FLT-BBK-003',
    item_name: 'Filter Biodiesel B30 Compatible - 750 L/jam',
    item_description: 'Filter khusus untuk biodiesel B30 dengan material yang tahan terhadap biodegradasi. Dilengkapi sensor water-in-fuel dan alarm system. Cocok untuk PLTD yang menggunakan campuran biodiesel hingga B30.',
    category_id: 'CAT-FILTER-BBK',
    supplier_id: 'SUP-000001',
    unit_price: 1850000.00,
    currency: 'IDR',
    stock_quantity: 28,
    lead_time_days: 14,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'Spin-on with Water Sensor',
      filtration_rating: '5 micron absolute',
      biodiesel_compatible: 'Up to B30',
      flow_rate: { value: 750, unit: 'L/hr' },
      pressure_rating: { working: '12 bar', burst: '48 bar' },
      water_detection: { type: 'Capacitive sensor', output: '4-20mA' },
      connections: { inlet: 'BSP 1-1/4"', outlet: 'BSP 1-1/4"' },
      material: { housing: '316L Stainless Steel', seals: 'Viton (fluoroelastomer)' },
      dimensions: { diameter: 180, height: 320, unit: 'mm' },
      weight: 8.5
    },
    compliance_certifications: ['SNI 19-1234-2020', 'ISO 9001:2015'],
    warranty_info: '12 bulan garansi',
    is_active: true
  },
  {
    item_code: 'FLT-BBK-004',
    item_name: 'Fuel Water Separator Coalescing Type - 1200 L/jam',
    item_description: 'Water separator dengan teknologi coalescing untuk pemisahan air dari bahan bakar diesel. Efisiensi pemisahan hingga 99%. Dilengkapi automatic drain valve dan float switch. Konstruksi aluminium alloy untuk ketahanan korosi.',
    category_id: 'CAT-FILTER-BBK',
    supplier_id: 'SUP-000003',
    unit_price: 2450000.00,
    currency: 'IDR',
    stock_quantity: 18,
    lead_time_days: 12,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      separator_type: 'Coalescing',
      separation_efficiency: '99%',
      flow_rate: { value: 1200, unit: 'L/hr' },
      pressure_rating: { working: '8 bar', burst: '32 bar' },
      water_bowl_capacity: '500 ml',
      automatic_drain: true,
      float_switch: { type: 'Reed switch', voltage: '24VDC' },
      connections: { inlet: 'BSP 1-1/2"', outlet: 'BSP 1-1/2"', drain: 'BSP 1/2"' },
      material: { housing: 'Aluminum alloy', bowl: 'Clear polycarbonate' },
      dimensions: { diameter: 200, height: 420, unit: 'mm' },
      weight: 6.8
    },
    compliance_certifications: ['ISO 9001:2015', 'PLN-APP-2024-00089'],
    warranty_info: '18 bulan garansi',
    is_active: true
  },

  // ========== FILTER BAHAN KIMIA (CHEMICAL FILTERS) ==========
  {
    item_code: 'FLT-BKM-001',
    item_name: 'Filter Asam Sulfat (H2SO4) - PTFE Lined - DN50',
    item_description: 'Filter untuk asam sulfat dengan lining PTFE untuk ketahanan korosi maksimal. Digunakan dalam sistem water treatment dan proses neutralisasi. Material konstruksi carbon steel dengan full PTFE lining. Pressure rating PN16.',
    category_id: 'CAT-FILTER-BKM',
    supplier_id: 'SUP-000003',
    unit_price: 4250000.00,
    currency: 'IDR',
    stock_quantity: 8,
    lead_time_days: 28,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'Y-Strainer PTFE Lined',
      chemical_compatibility: ['Sulfuric Acid (H2SO4)', 'Hydrochloric Acid (HCl)', 'Nitric Acid (HNO3)'],
      concentration_range: 'Up to 98%',
      filtration_rating: '100 mesh (149 micron)',
      pressure_rating: 'PN16 (16 bar @ 20°C)',
      temperature_rating: { min: -10, max: 150, unit: '°C' },
      connections: { type: 'Flanged', standard: 'DIN PN16', size: 'DN50' },
      material: { body: 'Carbon Steel A105 + PTFE lining', screen: 'PTFE coated SS316' },
      dimensions: { length: 250, width: 150, height: 200, unit: 'mm' },
      weight: 18.5
    },
    compliance_certifications: ['ISO 9001:2015', 'ASME B16.34', 'PLN-APP-2024-00234'],
    warranty_info: '24 bulan garansi terhadap defect manufaktur',
    is_active: true
  },
  {
    item_code: 'FLT-BKM-002',
    item_name: 'Filter Caustic Soda (NaOH) - 316L SS - DN80',
    item_description: 'Filter stainless steel 316L untuk larutan caustic soda dalam sistem water treatment. Dilengkapi dengan quick-opening cover untuk kemudahan maintenance. Basket type dengan mesh 40 micron. Cocok untuk konsentrasi NaOH hingga 50%.',
    category_id: 'CAT-FILTER-BKM',
    supplier_id: 'SUP-000004',
    unit_price: 5750000.00,
    currency: 'IDR',
    stock_quantity: 6,
    lead_time_days: 35,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'Basket Strainer with Quick Opening Cover',
      chemical_compatibility: ['Caustic Soda (NaOH)', 'Sodium Hypochlorite (NaOCl)'],
      concentration_range: 'Up to 50% NaOH',
      filtration_rating: '40 micron',
      pressure_rating: 'PN25 (25 bar @ 20°C)',
      temperature_rating: { min: 0, max: 100, unit: '°C' },
      connections: { type: 'Flanged', standard: 'ASME 150#', size: 'DN80' },
      material: { body: '316L Stainless Steel', basket: '316L SS Perforated', gasket: 'EPDM' },
      basket_capacity: '2.5 liters',
      dimensions: { length: 450, width: 300, height: 380, unit: 'mm' },
      weight: 42.5
    },
    compliance_certifications: ['ISO 9001:2015', 'ASME B16.34', 'NACE MR0175'],
    warranty_info: '24 bulan garansi',
    is_active: true
  },
  {
    item_code: 'FLT-BKM-003',
    item_name: 'Filter Boiler Treatment Chemical - Polypropylene - 50 L/min',
    item_description: 'Filter polypropylene untuk chemical dosing boiler treatment. Tahan terhadap berbagai chemical boiler treatment seperti oxygen scavenger, phosphate, dan amine. Cartridge type dengan housing polypropylene.',
    category_id: 'CAT-FILTER-BKM',
    supplier_id: 'SUP-000006',
    unit_price: 1850000.00,
    currency: 'IDR',
    stock_quantity: 15,
    lead_time_days: 14,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'Cartridge Housing - Polypropylene',
      chemical_compatibility: ['Phosphate', 'Amine', 'Oxygen Scavenger', 'pH Adjusters'],
      filtration_rating: '10 micron',
      flow_rate: { value: 50, unit: 'L/min' },
      pressure_rating: { working: '6 bar', burst: '18 bar' },
      temperature_rating: { min: 5, max: 60, unit: '°C' },
      connections: { inlet: 'BSP 1"', outlet: 'BSP 1"' },
      material: { housing: 'Polypropylene', cartridge: 'Polypropylene pleated' },
      cartridge_length: '10 inch',
      dimensions: { diameter: 120, height: 350, unit: 'mm' },
      weight: 2.8
    },
    compliance_certifications: ['ISO 9001:2015', 'FDA CFR 21'],
    warranty_info: '12 bulan garansi untuk housing',
    is_active: true
  },

  // ========== FILTER BAHAN MINYAK (OIL FILTERS) ==========
  {
    item_code: 'FLT-MNY-001',
    item_name: 'Filter Oli Turbin Uap - Main Lube Oil - 3 Micron',
    item_description: 'Filter oli pelumas utama untuk turbin uap dengan efisiensi tinggi. Beta ratio >1000 pada 3 micron. Dilengkapi dengan bypass valve dan differential pressure indicator. Material housing carbon steel dengan internal epoxy coating.',
    category_id: 'CAT-FILTER-MNY',
    supplier_id: 'SUP-000002',
    unit_price: 6250000.00,
    currency: 'IDR',
    stock_quantity: 10,
    lead_time_days: 21,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'Duplex Filter Assembly',
      application: 'Steam Turbine Main Lube Oil',
      filtration_rating: '3 micron absolute',
      beta_ratio: '>1000 @ 3 micron',
      flow_rate: { value: 300, unit: 'L/min' },
      pressure_rating: { working: '25 bar', burst: '100 bar' },
      oil_viscosity_range: 'ISO VG 32 - 68',
      bypass_valve: { opening_pressure: '3.5 bar differential' },
      differential_pressure_indicator: { type: 'Visual + electrical', range: '0-5 bar' },
      connections: { type: 'Flanged', standard: 'ASME 300#', size: 'DN100' },
      material: { housing: 'Carbon Steel + Epoxy coating', element: 'Stainless Steel mesh' },
      dimensions: { length: 800, width: 500, height: 1200, unit: 'mm' },
      weight: 185
    },
    compliance_certifications: ['ISO 9001:2015', 'ISO 16889', 'ISO 4406'],
    warranty_info: '24 bulan garansi',
    is_active: true
  },
  {
    item_code: 'FLT-MNY-002',
    item_name: 'Filter Oli Generator Bearing - Spin-on Type - 10 Micron',
    item_description: 'Filter spin-on untuk bearing lubrication generator. Compact design dengan full-flow filtration. Dilengkapi anti-drainback valve untuk mencegah dry-start. Material housing steel dengan powder coating.',
    category_id: 'CAT-FILTER-MNY',
    supplier_id: 'SUP-000001',
    unit_price: 850000.00,
    currency: 'IDR',
    stock_quantity: 35,
    lead_time_days: 7,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'Spin-on Full Flow',
      application: 'Generator Bearing Lubrication',
      filtration_rating: '10 micron absolute',
      beta_ratio: '>200 @ 10 micron',
      flow_rate: { value: 80, unit: 'L/min' },
      pressure_rating: { working: '10 bar', burst: '40 bar' },
      anti_drainback_valve: true,
      bypass_valve: { opening_pressure: '1.7 bar differential' },
      thread_size: '3/4"-16 UNF',
      material: { can: 'Steel with powder coating', media: 'Cellulose blend' },
      dimensions: { diameter: 95, height: 145, unit: 'mm' },
      weight: 0.8
    },
    compliance_certifications: ['ISO 9001:2015', 'ISO 4548-12'],
    warranty_info: '12 bulan garansi',
    is_active: true
  },
  {
    item_code: 'FLT-MNY-003',
    item_name: 'Filter Oli Hidraulik High Pressure - 5 Micron - 350 Bar',
    item_description: 'Filter oli hidraulik untuk sistem high pressure hingga 350 bar. Dilengkapi dengan pressure gauge dan electrical switch untuk monitoring. Element type dengan collapse resistance. Cocok untuk hydraulic actuator dan servo valve.',
    category_id: 'CAT-FILTER-MNY',
    supplier_id: 'SUP-000004',
    unit_price: 4850000.00,
    currency: 'IDR',
    stock_quantity: 14,
    lead_time_days: 18,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'High Pressure Element Type',
      application: 'Hydraulic Systems - Pressure Line',
      filtration_rating: '5 micron absolute',
      beta_ratio: '>1000 @ 5 micron',
      flow_rate: { value: 100, unit: 'L/min' },
      pressure_rating: { working: '350 bar', burst: '525 bar', test: '420 bar' },
      collapse_pressure: '>100 bar differential',
      element_material: { media: 'Microfiberglass', support: 'Stainless steel mesh' },
      indicator: { type: 'Visual + Electrical', switch_rating: '250VAC 2A' },
      connections: { inlet: 'G 1"', outlet: 'G 1"' },
      material: { housing: 'Aluminum alloy', seal: 'Viton' },
      dimensions: { diameter: 150, height: 280, unit: 'mm' },
      weight: 8.5
    },
    compliance_certifications: ['ISO 9001:2015', 'ISO 16889', 'ISO 2942'],
    warranty_info: '24 bulan garansi',
    is_active: true
  },
  {
    item_code: 'FLT-MNY-004',
    item_name: 'Filter Oli Transformer - Activated Carbon Type - 200 L/min',
    item_description: 'Filter khusus untuk purifikasi oli transformer dengan activated carbon untuk menghilangkan moisture dan contaminant. Dilengkapi dengan vacuum dehydrator. Material stainless steel 316L. Cocok untuk maintenance transformer 150kV.',
    category_id: 'CAT-FILTER-MNY',
    supplier_id: 'SUP-000003',
    unit_price: 12500000.00,
    currency: 'IDR',
    stock_quantity: 4,
    lead_time_days: 42,
    unit_of_measure: 'SET',
    technical_specifications: {
      filter_type: 'Vacuum Dehydration with Activated Carbon',
      application: 'Transformer Oil Purification',
      filtration_rating: '1 micron',
      flow_rate: { value: 200, unit: 'L/min' },
      vacuum_level: '-0.09 MPa',
      dehydration_capacity: '10 kg/hr water removal',
      activated_carbon_capacity: '50 kg',
      heating_element: { power: '36 kW', voltage: '380V 3-phase' },
      oil_temperature_control: { range: '40-80°C', accuracy: '±2°C' },
      connections: { inlet: 'DN50 flange', outlet: 'DN50 flange' },
      material: { housing: '316L Stainless Steel', piping: 'Stainless steel' },
      dimensions: { length: 1500, width: 800, height: 1800, unit: 'mm' },
      weight: 450
    },
    compliance_certifications: ['ISO 9001:2015', 'IEC 60422', 'PLN-APP-2024-00567'],
    warranty_info: '24 bulan garansi sistem, 12 bulan untuk consumables',
    is_active: true
  },

  // ========== FILTER KHUSUS (SPECIALIZED FILTERS) ==========
  {
    item_code: 'FLT-KHS-001',
    item_name: 'Filter Vakum Turbin Condenser - Air Ejector System',
    item_description: 'Filter vakum khusus untuk sistem air ejector pada kondenser turbin. Menangkap partikel dan mencegah kontaminasi sistem vakum. Material stainless steel dengan mesh fine 50 micron. Dilengkapi dengan quick-open cover untuk maintenance.',
    category_id: 'CAT-FILTER-KHS',
    supplier_id: 'SUP-000002',
    unit_price: 3850000.00,
    currency: 'IDR',
    stock_quantity: 6,
    lead_time_days: 30,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'Vacuum Line Strainer',
      application: 'Steam Turbine Condenser - Air Ejector',
      filtration_rating: '50 micron',
      vacuum_rating: '-0.095 MPa',
      flow_capacity: { value: 150, unit: 'kg/hr steam equivalent' },
      temperature_rating: { min: -10, max: 150, unit: '°C' },
      connections: { type: 'Flanged', standard: 'ASME 150#', size: 'DN150' },
      material: { body: '316L Stainless Steel', screen: 'SS316 mesh 50 micron' },
      quick_opening_cover: true,
      dimensions: { diameter: 300, height: 450, unit: 'mm' },
      weight: 45
    },
    compliance_certifications: ['ISO 9001:2015', 'ASME B31.1', 'PLN-APP-2024-00789'],
    warranty_info: '24 bulan garansi',
    is_active: true
  },
  {
    item_code: 'FLT-KHS-002',
    item_name: 'Filter Bertekanan Tinggi Gas Nitrogen - 420 Bar',
    item_description: 'Filter khusus untuk sistem gas nitrogen bertekanan tinggi hingga 420 bar. Digunakan dalam sistem pneumatic control dan akumulator hidraulik. Material stainless steel 316 dengan test pressure 630 bar.',
    category_id: 'CAT-FILTER-KHS',
    supplier_id: 'SUP-000004',
    unit_price: 8250000.00,
    currency: 'IDR',
    stock_quantity: 3,
    lead_time_days: 45,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'High Pressure Gas Filter',
      application: 'Nitrogen Gas Systems, Hydraulic Accumulators',
      filtration_rating: '10 micron',
      pressure_rating: { working: '420 bar', test: '630 bar', burst: '840 bar' },
      flow_capacity: { value: 60, unit: 'Nm³/hr' },
      temperature_rating: { min: -40, max: 200, unit: '°C' },
      element_type: 'Sintered metal (stainless steel)',
      connections: { type: 'Threaded', size: 'G 3/4"', standard: 'ISO 228' },
      material: { body: '316 Stainless Steel', element: 'Sintered SS316L' },
      o_ring: 'Viton (high temp)',
      dimensions: { diameter: 80, height: 220, unit: 'mm' },
      weight: 3.2
    },
    compliance_certifications: ['ISO 9001:2015', 'PED 2014/68/EU', 'ATEX Certified'],
    warranty_info: '36 bulan garansi',
    is_active: true
  },

  // ========== FILTER MULTI FUNGSI (MULTIFUNCTIONAL FILTERS) ==========
  {
    item_code: 'FLT-MLF-001',
    item_name: 'Filter-Cooler Combination Hydraulic - 100 L/min',
    item_description: 'Unit kombinasi filter dan heat exchanger untuk sistem hidraulik. Menggabungkan fungsi filtrasi 10 micron dengan cooling capacity 25 kW. Compact design untuk space efficiency. Dilengkapi dengan temperature monitoring dan bypass valve.',
    category_id: 'CAT-FILTER-MLF',
    supplier_id: 'SUP-000004',
    unit_price: 15250000.00,
    currency: 'IDR',
    stock_quantity: 5,
    lead_time_days: 35,
    unit_of_measure: 'SET',
    technical_specifications: {
      filter_type: 'Filter-Cooler Combination Unit',
      application: 'Hydraulic Power Units',
      filtration_rating: '10 micron absolute',
      flow_rate: { value: 100, unit: 'L/min' },
      pressure_rating: { working: '25 bar', burst: '100 bar' },
      cooling_capacity: { value: 25, unit: 'kW', condition: 'Oil 60°C, Water 25°C' },
      heat_exchanger_type: 'Plate type, brazed stainless steel',
      coolant: 'Water or water-glycol mixture',
      filter_element: 'Replaceable cartridge, 10 micron',
      bypass_valve: { opening: '3.5 bar differential' },
      temperature_sensor: { type: 'PT100', range: '-50 to +200°C' },
      connections: { hydraulic: 'G 1-1/2"', coolant: 'G 3/4"' },
      material: { housing: 'Aluminum alloy', heat_exchanger: 'SS316 plates' },
      dimensions: { length: 450, width: 320, height: 580, unit: 'mm' },
      weight: 52
    },
    compliance_certifications: ['ISO 9001:2015', 'ISO 16889', 'CE Marked'],
    warranty_info: '24 bulan garansi sistem',
    is_active: true
  },
  {
    item_code: 'FLT-MLF-002',
    item_name: 'Filter Multi-Stage Fuel-Water-Particulate Separator',
    item_description: 'Filter multi-stage untuk pemisahan air, partikulat, dan kontaminan dari bahan bakar. Stage 1: Coarse filtration 100 micron, Stage 2: Water separation, Stage 3: Fine filtration 5 micron. Dilengkapi dengan water drain alarm dan differential pressure gauge.',
    category_id: 'CAT-FILTER-MLF',
    supplier_id: 'SUP-000001',
    unit_price: 4850000.00,
    currency: 'IDR',
    stock_quantity: 12,
    lead_time_days: 21,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'Multi-Stage Filter-Separator',
      application: 'Diesel Fuel Conditioning',
      stage_1: { type: 'Coarse filter', rating: '100 micron' },
      stage_2: { type: 'Water separator', efficiency: '98%', capacity: '1000 ml' },
      stage_3: { type: 'Fine filter', rating: '5 micron absolute' },
      flow_rate: { value: 800, unit: 'L/hr' },
      pressure_rating: { working: '10 bar', burst: '40 bar' },
      water_level_alarm: { type: 'Float switch', voltage: '24VDC' },
      differential_pressure_gauge: { range: '0-2.5 bar', dial: '63mm' },
      connections: { inlet: 'BSP 1-1/4"', outlet: 'BSP 1-1/4"', drain: 'BSP 1/2"' },
      material: { housing: '316L Stainless Steel', bowl: 'Aluminum' },
      dimensions: { diameter: 220, height: 520, unit: 'mm' },
      weight: 15.5
    },
    compliance_certifications: ['ISO 9001:2015', 'ISO 16332', 'PLN-APP-2024-00456'],
    warranty_info: '18 bulan garansi',
    is_active: true
  },

  // ========== FILTER UDARA DAN GAS (AIR AND GAS FILTERS) ==========
  {
    item_code: 'FLT-UGS-001',
    item_name: 'Filter Intake Udara Turbin Gas - Pre-Filter M5 - 50000 m³/hr',
    item_description: 'Pre-filter stage untuk gas turbine air intake system. Filter class M5 (EU) / MERV 9 (US) untuk menangkap partikel debu kasar. Konstruksi frame galvanized steel dengan media synthetic fiber. Low pressure drop design untuk efisiensi maksimum.',
    category_id: 'CAT-FILTER-UGS',
    supplier_id: 'SUP-000007',
    unit_price: 3250000.00,
    currency: 'IDR',
    stock_quantity: 20,
    lead_time_days: 14,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'Panel Filter - Bag Type',
      application: 'Gas Turbine Pre-Filter Stage',
      filter_class: 'M5 (EN 779) / MERV 9 (ASHRAE)',
      filtration_efficiency: '60-65% @ 0.4 micron (gravimetric)',
      airflow_capacity: { value: 50000, unit: 'm³/hr', condition: 'Face velocity 2.5 m/s' },
      pressure_drop: { initial: '50 Pa', final: '200 Pa' },
      filter_media: 'Synthetic fiber (polyester)',
      frame_material: 'Galvanized steel',
      dimensions: { width: 592, height: 592, depth: 600, unit: 'mm' },
      bag_pockets: 8,
      weight: 4.5,
      temperature_rating: { max: 70, unit: '°C' },
      humidity_resistance: 'Up to 100% RH'
    },
    compliance_certifications: ['EN 779:2012', 'ISO 16890', 'Fire Class F1 (EN 13501)'],
    warranty_info: '12 bulan storage warranty',
    is_active: true
  },
  {
    item_code: 'FLT-UGS-002',
    item_name: 'Filter HEPA H13 Offshore Gas Turbine - 10000 m³/hr',
    item_description: 'Filter HEPA H13 untuk gas turbine dalam aplikasi offshore atau lingkungan dusty. Efisiensi 99.95% pada 0.3 micron. Frame stainless steel 304 untuk ketahanan korosi. Dilengkapi dengan gasket seal untuk zero bypass.',
    category_id: 'CAT-FILTER-UGS',
    supplier_id: 'SUP-000007',
    unit_price: 8500000.00,
    currency: 'IDR',
    stock_quantity: 8,
    lead_time_days: 28,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'HEPA Filter',
      application: 'Gas Turbine Final Stage - Offshore/Dusty Environment',
      filter_class: 'H13 (EN 1822)',
      filtration_efficiency: '99.95% @ 0.3 micron (MPPS)',
      airflow_capacity: { value: 10000, unit: 'm³/hr', condition: 'Face velocity 1.2 m/s' },
      pressure_drop: { initial: '200 Pa', final: '450 Pa' },
      filter_media: 'Microfiberglass',
      frame_material: '304 Stainless Steel',
      gasket: 'Closed cell neoprene, compression seal',
      dimensions: { width: 610, height: 610, depth: 292, unit: 'mm' },
      weight: 18.5,
      temperature_rating: { max: 100, unit: '°C' },
      humidity_resistance: 'Up to 100% RH'
    },
    compliance_certifications: ['EN 1822:2019', 'ISO 29463', 'Fire Class F1', 'NORSOK Approved'],
    warranty_info: '18 bulan storage warranty',
    is_active: true
  },
  {
    item_code: 'FLT-UGS-003',
    item_name: 'Filter Udara Tekan Coalescing Oil Removal - 100 Nm³/min',
    item_description: 'Coalescing filter untuk removal oli dari compressed air. Class 1 (ISO 8573-1) - oil content <0.01 mg/m³. Dilengkapi automatic drain dan differential pressure indicator. Housing aluminum dengan powder coating.',
    category_id: 'CAT-FILTER-UGS',
    supplier_id: 'SUP-000005',
    unit_price: 4250000.00,
    currency: 'IDR',
    stock_quantity: 16,
    lead_time_days: 14,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'Coalescing Filter',
      application: 'Compressed Air - Oil Removal',
      performance_class: 'Class 1 Oil (ISO 8573-1:2010)',
      oil_content: '<0.01 mg/m³',
      particulate_removal: '0.01 micron',
      flow_capacity: { value: 100, unit: 'Nm³/min', condition: '7 bar, 20°C, 100% RH' },
      pressure_rating: { working: '16 bar', test: '24 bar' },
      pressure_drop: { dry_air: '0.15 bar', wet_air: '0.25 bar' },
      operating_temperature: { min: 1.5, max: 65, unit: '°C' },
      automatic_drain: { type: 'Float drain', capacity: '500 ml/hr' },
      differential_pressure_indicator: { range: '0-1 bar', alarm_setting: '0.7 bar' },
      connections: { inlet: 'G 2"', outlet: 'G 2"', drain: 'G 1/4"' },
      material: { housing: 'Aluminum + powder coating', element: 'Borosilicate microfiber' },
      dimensions: { diameter: 180, height: 650, unit: 'mm' },
      weight: 12.5
    },
    compliance_certifications: ['ISO 8573-1:2010', 'ISO 12500-1', 'PED 2014/68/EU'],
    warranty_info: '24 bulan garansi housing',
    is_active: true
  },
  {
    item_code: 'FLT-UGS-004',
    item_name: 'Filter Natural Gas Pipeline - Cartridge Type - DN100',
    item_description: 'Filter untuk natural gas pipeline protection. Menangkap partikel solid, rust, dan kontaminan sebelum masuk ke gas turbine atau burner. Konstruksi carbon steel dengan cartridge stainless steel mesh. Working pressure 40 bar.',
    category_id: 'CAT-FILTER-UGS',
    supplier_id: 'SUP-000002',
    unit_price: 12500000.00,
    currency: 'IDR',
    stock_quantity: 4,
    lead_time_days: 35,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'Gas Filter with Cartridge Element',
      application: 'Natural Gas Pipeline',
      filtration_rating: '50 micron',
      flow_capacity: { value: 5000, unit: 'Nm³/hr', condition: '15 bar, 15°C' },
      pressure_rating: { working: '40 bar', test: '60 bar', burst: '80 bar' },
      operating_temperature: { min: -20, max: 80, unit: '°C' },
      connections: { type: 'Flanged', standard: 'ASME 300#', size: 'DN100' },
      material: { body: 'Carbon Steel A105', element: 'SS316 mesh', gasket: 'Spiral wound' },
      cartridge_type: 'Multi-layer pleated mesh',
      dimensions: { length: 800, diameter: 350, unit: 'mm' },
      weight: 125,
      drain_valve: 'Manual ball valve DN15'
    },
    compliance_certifications: ['ISO 9001:2015', 'ASME B31.8', 'PED 2014/68/EU', 'ATEX Zone 1'],
    warranty_info: '24 bulan garansi',
    is_active: true
  },

  // ========== PENYARINGAN AIR (WATER FILTRATION) ==========
  {
    item_code: 'SRN-AIR-001',
    item_name: 'Filter Air Baku Multimedia - Flow Rate 50 m³/hr',
    item_description: 'Filter multimedia untuk treatment air baku sebelum RO plant. Media terdiri dari anthracite, silica sand, dan gravel dalam vessel FRP. Automatic backwash system dengan timer dan differential pressure control. Cocok untuk raw water turbidity <50 NTU.',
    category_id: 'CAT-FILTER-AIR',
    supplier_id: 'SUP-000008',
    unit_price: 35000000.00,
    currency: 'IDR',
    stock_quantity: 2,
    lead_time_days: 45,
    unit_of_measure: 'SET',
    technical_specifications: {
      filter_type: 'Multimedia Filter - Automatic Backwash',
      application: 'Raw Water Pre-treatment for RO Plant',
      flow_rate: { service: '50 m³/hr', backwash: '100 m³/hr' },
      vessel_material: 'FRP (Fiberglass Reinforced Plastic)',
      vessel_diameter: '2000 mm',
      vessel_height: '2500 mm',
      media_layers: [
        { type: 'Anthracite', size: '1.0-2.0 mm', depth: '600 mm' },
        { type: 'Silica Sand', size: '0.5-1.0 mm', depth: '400 mm' },
        { type: 'Gravel', size: '5-10 mm', depth: '200 mm' }
      ],
      operating_pressure: { min: 2, max: 6, unit: 'bar' },
      backwash_frequency: 'Every 24 hours or when ΔP > 0.5 bar',
      control_valve: { type: 'Multi-port automatic', size: 'DN80', material: 'Bronze' },
      connections: { inlet: 'DN80 flange', outlet: 'DN80 flange', drain: 'DN100' },
      performance: { turbidity_removal: '>95% (from <50 NTU to <5 NTU)' }
    },
    compliance_certifications: ['ISO 9001:2015', 'NSF/ANSI 61', 'ASME RTP-1'],
    warranty_info: '24 bulan garansi sistem',
    is_active: true
  },
  {
    item_code: 'SRN-AIR-002',
    item_name: 'Filter Cartridge Pre-RO 5 Micron - 40 inch - 200 m³/day',
    item_description: 'Cartridge filter pre-RO dengan housing multi-cartridge. Menerima 7 cartridge 40 inch untuk flow rate 200 m³/day. Housing stainless steel 304 dengan quick-opening closure. Cartridge polypropylene pleated 5 micron untuk proteksi membran RO.',
    category_id: 'CAT-FILTER-AIR',
    supplier_id: 'SUP-000008',
    unit_price: 18500000.00,
    currency: 'IDR',
    stock_quantity: 3,
    lead_time_days: 30,
    unit_of_measure: 'SET',
    technical_specifications: {
      filter_type: 'Multi-Cartridge Housing',
      application: 'RO Pre-filtration',
      cartridge_quantity: 7,
      cartridge_length: '40 inch (1016 mm)',
      cartridge_rating: '5 micron absolute',
      flow_rate: { value: 200, unit: 'm³/day', condition: 'at 3 bar' },
      operating_pressure: { max: 10, unit: 'bar' },
      operating_temperature: { max: 45, unit: '°C' },
      housing_material: '304 Stainless Steel',
      closure_type: 'Quick-opening swing bolt',
      connections: { inlet: 'DN80 flange PN10', outlet: 'DN80 flange PN10' },
      o_rings: 'EPDM food grade',
      dimensions: { diameter: 320, height: 1250, unit: 'mm' },
      weight: 85,
      cartridge_type: 'Polypropylene pleated, 5 micron'
    },
    compliance_certifications: ['ISO 9001:2015', 'NSF/ANSI 61', 'FDA CFR 21'],
    warranty_info: '24 bulan garansi housing, cartridge excluded',
    is_active: true
  },
  {
    item_code: 'SRN-AIR-003',
    item_name: 'Filter Activated Carbon Block - Chlorine Removal - 10 inch',
    item_description: 'Filter activated carbon block untuk removal chlorine dan organic compounds. Digunakan sebelum RO membrane atau untuk point-of-use applications. Block carbon memberikan contact time lebih lama dibanding granular. Kapasitas chlorine removal >15000 liter.',
    category_id: 'CAT-FILTER-AIR',
    supplier_id: 'SUP-000006',
    unit_price: 450000.00,
    currency: 'IDR',
    stock_quantity: 80,
    lead_time_days: 7,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'Activated Carbon Block Cartridge',
      application: 'Chlorine and Organic Removal',
      cartridge_size: '10 inch standard',
      filtration_rating: '5 micron',
      carbon_type: 'Coconut shell activated carbon',
      chlorine_removal_capacity: '>15000 liters',
      flow_rate: { value: 8, unit: 'L/min', condition: 'at 3 bar' },
      pressure_rating: { max: 6, unit: 'bar' },
      temperature_rating: { max: 45, unit: '°C' },
      dimensions: { diameter: 70, height: 254, unit: 'mm' },
      weight: 0.8,
      end_caps: 'Polypropylene',
      center_tube: 'Polypropylene'
    },
    compliance_certifications: ['NSF/ANSI 42', 'NSF/ANSI 61', 'FDA CFR 21'],
    warranty_info: 'No warranty for consumable item',
    is_active: true
  },
  {
    item_code: 'SRN-AIR-004',
    item_name: 'Self-Cleaning Strainer Cooling Water - 1000 m³/hr - DN300',
    item_description: 'Self-cleaning automatic strainer untuk cooling water intake. Menangkap debris, aquatic organisms, dan suspended solids. Automatic backwash dengan rotating brush. Minimal water loss during cleaning cycle. Konstruksi stainless steel 316L untuk seawater.',
    category_id: 'CAT-FILTER-AIR',
    supplier_id: 'SUP-000008',
    unit_price: 125000000.00,
    currency: 'IDR',
    stock_quantity: 1,
    lead_time_days: 90,
    unit_of_measure: 'SET',
    technical_specifications: {
      filter_type: 'Automatic Self-Cleaning Strainer',
      application: 'Cooling Water Intake - Seawater/River Water',
      flow_rate: { value: 1000, unit: 'm³/hr', condition: 'continuous' },
      filtration_rating: '3 mm (3000 micron)',
      operating_pressure: { max: 10, unit: 'bar' },
      cleaning_system: 'Rotating brush with suction scanner',
      cleaning_trigger: 'Differential pressure or timer',
      cleaning_cycle: 'Fully automatic, <30 seconds',
      water_loss_per_cycle: '<0.5% of flow',
      power_supply: '380V 3-phase 50Hz',
      motor_power: '3 kW',
      connections: { inlet: 'DN300 flange PN10', outlet: 'DN300 flange PN10', drain: 'DN80' },
      material: { body: '316L Stainless Steel', screen: '316L SS wedge wire' },
      dimensions: { length: 2200, width: 1100, height: 1800, unit: 'mm' },
      weight: 850
    },
    compliance_certifications: ['ISO 9001:2015', 'CE Marked', 'ASME B31.1', 'Marine Approved'],
    warranty_info: '24 bulan garansi sistem',
    is_active: true
  },

  // ========== SARINGAN UAP (STEAM FILTERS) ==========
  {
    item_code: 'SRN-UAP-001',
    item_name: 'Y-Strainer Uap Steam PN40 - DN80 - 316 Stainless Steel',
    item_description: 'Y-strainer untuk steam line pressure rating PN40. Material konstruksi stainless steel 316 untuk ketahanan korosi dan suhu tinggi. Screen 40 mesh (400 micron). Plug bottom untuk easy cleaning. Cocok untuk medium pressure steam hingga 40 bar.',
    category_id: 'CAT-FILTER-UAP',
    supplier_id: 'SUP-000002',
    unit_price: 6250000.00,
    currency: 'IDR',
    stock_quantity: 8,
    lead_time_days: 21,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      strainer_type: 'Y-Strainer',
      application: 'Medium Pressure Steam Line',
      filtration_rating: '40 mesh (400 micron)',
      pressure_rating: 'PN40 (40 bar @ 20°C)',
      temperature_rating: { max: 450, unit: '°C' },
      connections: { type: 'Flanged', standard: 'DIN PN40', size: 'DN80' },
      material: { body: '316 Stainless Steel (1.4401)', screen: '316 SS mesh', gasket: 'Spiral wound graphite' },
      blow_down: 'Threaded plug NPT 3/4"',
      dimensions: { length: 280, height: 180, unit: 'mm' },
      weight: 22,
      face_to_face: 'DIN 3202 K1 series'
    },
    compliance_certifications: ['ISO 9001:2015', 'PED 2014/68/EU', 'ASME B16.34', 'TÜV Certified'],
    warranty_info: '24 bulan garansi',
    is_active: true
  },
  {
    item_code: 'SRN-UAP-002',
    item_name: 'Basket Strainer Steam PN64 - DN150 - Cast Steel WCB',
    item_description: 'Basket strainer untuk high pressure steam hingga PN64. Material cast steel WCB (low carbon steel) sesuai ASTM A216. Basket stainless steel 316 dengan perforasi 3mm. Quick-opening cover dengan davit untuk maintenance. Cocok untuk main steam line turbine.',
    category_id: 'CAT-FILTER-UAP',
    supplier_id: 'SUP-000003',
    unit_price: 28500000.00,
    currency: 'IDR',
    stock_quantity: 3,
    lead_time_days: 60,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      strainer_type: 'Basket Strainer with Quick-Opening Cover',
      application: 'High Pressure Steam - Turbine Inlet',
      filtration_rating: '3 mm perforation',
      basket_capacity: '12 liters',
      pressure_rating: 'PN64 (64 bar @ 350°C), Class 600 equivalent',
      temperature_rating: { max: 540, unit: '°C' },
      connections: { type: 'RF Flanged', standard: 'ASME B16.5 Class 600', size: 'DN150' },
      material: {
        body: 'Cast Steel WCB (ASTM A216)',
        basket: '316 Stainless Steel perforated',
        cover: 'WCB with davit arm',
        gasket: 'Spiral wound 316L/graphite'
      },
      differential_pressure_gauge: { type: 'Diaphragm seal', range: '0-2.5 bar' },
      dimensions: { length: 850, width: 450, height: 650, unit: 'mm' },
      weight: 285
    },
    compliance_certifications: ['ASME VIII Div 1', 'PED 2014/68/EU Cat III', 'GOST-R'],
    warranty_info: '36 bulan garansi',
    is_active: true
  },
  {
    item_code: 'SRN-UAP-003',
    item_name: 'Filter Uap Proses Low Pressure - 5 bar - DN50',
    item_description: 'Filter untuk process steam low pressure. Y-type dengan material cast iron untuk aplikasi ekonomis. Screen stainless steel 304 dengan 60 mesh. Cocok untuk steam heating, humidification, dan process applications non-critical.',
    category_id: 'CAT-FILTER-UAP',
    supplier_id: 'SUP-000006',
    unit_price: 1850000.00,
    currency: 'IDR',
    stock_quantity: 15,
    lead_time_days: 14,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      strainer_type: 'Y-Strainer',
      application: 'Low Pressure Process Steam',
      filtration_rating: '60 mesh (250 micron)',
      pressure_rating: 'PN16 (16 bar @ 20°C)',
      temperature_rating: { max: 200, unit: '°C' },
      connections: { type: 'Flanged', standard: 'JIS 10K', size: 'DN50' },
      material: { body: 'Cast Iron FC200', screen: '304 Stainless Steel mesh', cover: 'Cast iron' },
      blow_down: 'Threaded plug RC 1/2"',
      dimensions: { length: 180, height: 120, unit: 'mm' },
      weight: 8.5
    },
    compliance_certifications: ['ISO 9001:2015', 'JIS B2011'],
    warranty_info: '12 bulan garansi',
    is_active: true
  },

  // ========== SPARE PART DAN PERLENGKAPAN (SPARE PARTS) ==========
  {
    item_code: 'SPR-FLT-001',
    item_name: 'Replacement Cartridge Filter 10 Micron - 10 inch Standard',
    item_description: 'Cartridge filter pengganti universal 10 inch dengan rating 10 micron. Material polypropylene pleated dengan end cap polypropylene. Compatible dengan housing standard 10 inch. Untuk aplikasi fuel, oil, water filtration.',
    category_id: 'CAT-SPARE-FLT',
    supplier_id: 'SUP-000006',
    unit_price: 185000.00,
    currency: 'IDR',
    stock_quantity: 200,
    lead_time_days: 3,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      cartridge_type: 'Pleated Polypropylene',
      filtration_rating: '10 micron absolute',
      length: '10 inch (254 mm)',
      outer_diameter: '70 mm',
      inner_diameter: '28 mm',
      end_caps: 'Polypropylene',
      temperature_rating: { max: 60, unit: '°C' },
      pressure_rating: { max: 6, unit: 'bar' },
      compatible_fluids: ['Water', 'Fuel', 'Hydraulic Oil', 'Light Chemicals'],
      filtration_area: '0.6 m²',
      dirt_holding_capacity: '150 grams',
      weight: 0.15
    },
    compliance_certifications: ['FDA CFR 21', 'NSF/ANSI 61'],
    warranty_info: 'No warranty for consumable',
    is_active: true
  },
  {
    item_code: 'SPR-FLT-002',
    item_name: 'O-Ring Seal Kit Viton untuk Filter Housing - Various Sizes',
    item_description: 'Set O-ring seal Viton (fluoroelastomer) untuk berbagai ukuran filter housing. Tahan terhadap fuel, oil, dan chemical. Temperature range -20°C hingga +200°C. Kit berisi 10 ukuran O-ring yang paling umum digunakan. Material Viton A grade.',
    category_id: 'CAT-SPARE-FLT',
    supplier_id: 'SUP-000004',
    unit_price: 650000.00,
    currency: 'IDR',
    stock_quantity: 45,
    lead_time_days: 7,
    unit_of_measure: 'SET',
    technical_specifications: {
      material: 'Viton (FKM) Grade A',
      hardness: '75 Shore A',
      temperature_range: { min: -20, max: 200, unit: '°C' },
      chemical_resistance: ['Fuel', 'Hydraulic Oil', 'Mineral Oil', 'Acids', 'Aliphatic Hydrocarbons'],
      kit_contents: [
        { size: 'ID 28mm x CS 4mm', quantity: 2 },
        { size: 'ID 35mm x CS 4mm', quantity: 2 },
        { size: 'ID 45mm x CS 5mm', quantity: 2 },
        { size: 'ID 60mm x CS 5mm', quantity: 2 },
        { size: 'ID 75mm x CS 6mm', quantity: 1 },
        { size: 'ID 90mm x CS 6mm', quantity: 1 }
      ],
      standard: 'AS 568 (inch series equivalent)',
      weight: 0.2
    },
    compliance_certifications: ['FDA CFR 21.177.2600', 'NSF/ANSI 61'],
    warranty_info: '24 bulan storage warranty',
    is_active: true
  },
  {
    item_code: 'SPR-FLT-003',
    item_name: 'Differential Pressure Gauge Mechanical 0-2.5 bar - Dial 100mm',
    item_description: 'Pressure gauge diferensial mechanical untuk monitoring kondisi filter. Range 0-2.5 bar dengan dial 100mm. Koneksi NPT 1/4" pada kedua sisi. Material brass dengan bourdon tube stainless steel. Akurasi class 1.6.',
    category_id: 'CAT-SPARE-FLT',
    supplier_id: 'SUP-000006',
    unit_price: 850000.00,
    currency: 'IDR',
    stock_quantity: 30,
    lead_time_days: 10,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      gauge_type: 'Differential Pressure Gauge',
      range: '0-2.5 bar',
      dial_diameter: '100 mm',
      accuracy_class: '1.6 (±1.6% of span)',
      connections: { type: 'NPT 1/4" male', quantity: 2, position: 'Bottom mount' },
      material: { case: 'Steel black painted', ring: 'Steel', window: 'Polycarbonate', bourdon_tube: '316 Stainless Steel' },
      temperature_rating: { ambient: '60°C', media: '100°C' },
      mounting: 'Bottom or back mount with bracket',
      dimensions: { diameter: 100, depth: 55, unit: 'mm' },
      weight: 0.3
    },
    compliance_certifications: ['EN 837-3', 'CE Marked'],
    warranty_info: '12 bulan garansi',
    is_active: true
  },
  {
    item_code: 'SPR-FLT-004',
    item_name: 'Filter Housing Stainless Steel 316L - Single Cartridge 10"',
    item_description: 'Housing filter stainless steel 316L untuk 1 cartridge 10 inch. Swing bolt closure untuk kemudahan maintenance. Pressure rating 10 bar. Koneksi BSP 3/4". Cocok untuk aplikasi food grade, pharmaceutical, atau corrosive fluids.',
    category_id: 'CAT-SPARE-FLT',
    supplier_id: 'SUP-000008',
    unit_price: 3250000.00,
    currency: 'IDR',
    stock_quantity: 12,
    lead_time_days: 21,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      housing_type: 'Single Cartridge - Swing Bolt',
      cartridge_length: '10 inch (254 mm)',
      cartridge_diameter: 'Standard 2.5" (70mm OD)',
      pressure_rating: { working: 10, test: 15, unit: 'bar' },
      temperature_rating: { max: 120, unit: '°C' },
      closure_type: 'Swing bolt with wing nut',
      connections: { inlet: 'BSP 3/4" female', outlet: 'BSP 3/4" female', vent: 'BSP 1/4"' },
      material: { body: '316L Stainless Steel (1.4404)', o_rings: 'EPDM (standard), Viton (optional)' },
      surface_finish: 'Electropolished (Ra < 0.8 µm)',
      dimensions: { diameter: 110, height: 400, unit: 'mm' },
      weight: 4.5,
      drain_port: 'BSP 1/2" bottom'
    },
    compliance_certifications: ['ISO 9001:2015', 'FDA CFR 21', '3A Sanitary Standards', 'EHEDG'],
    warranty_info: '24 bulan garansi',
    is_active: true
  },
  {
    item_code: 'SPR-FLT-005',
    item_name: 'Automatic Drain Valve Float Type - G 1/2" - 250 ml/hr',
    item_description: 'Automatic drain valve float type untuk drainage air/condensate dari filter. Kapasitas 250 ml/hr. Tidak memerlukan power supply. Material brass dengan float stainless steel. Koneksi G 1/2" thread. Cocok untuk compressed air filter dan fuel water separator.',
    category_id: 'CAT-SPARE-FLT',
    supplier_id: 'SUP-000005',
    unit_price: 1250000.00,
    currency: 'IDR',
    stock_quantity: 25,
    lead_time_days: 14,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      valve_type: 'Automatic Float Drain',
      drainage_capacity: '250 ml/hr',
      operating_principle: 'Float activated mechanical valve',
      pressure_range: { min: 0, max: 16, unit: 'bar' },
      temperature_range: { min: -10, max: 80, unit: '°C' },
      connection: { inlet: 'G 1/2" female', outlet: 'G 1/2" male' },
      material: { body: 'Brass (nickel plated)', float: '304 Stainless Steel', seal: 'NBR' },
      no_air_loss: true,
      applications: ['Compressed Air Filters', 'Fuel Water Separators', 'Coalescers'],
      dimensions: { length: 85, diameter: 35, unit: 'mm' },
      weight: 0.25
    },
    compliance_certifications: ['ISO 9001:2015', 'CE Marked'],
    warranty_info: '24 bulan garansi',
    is_active: true
  },
  {
    item_code: 'SPR-FLT-006',
    item_name: 'Filter Wrench Tool Universal - 3" to 6" Diameter',
    item_description: 'Tool untuk membuka dan mengencangkan spin-on filter atau cartridge housing. Universal design untuk diameter 3" hingga 6". Material steel dengan powder coating. Handle length 400mm untuk torque yang cukup. Adjustable band clamp design.',
    category_id: 'CAT-SPARE-FLT',
    supplier_id: 'SUP-000006',
    unit_price: 450000.00,
    currency: 'IDR',
    stock_quantity: 40,
    lead_time_days: 7,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      tool_type: 'Universal Filter Wrench',
      diameter_range: { min: 75, max: 150, unit: 'mm' },
      handle_length: 400,
      material: 'Steel with powder coating',
      adjustment: 'Band clamp with ratchet mechanism',
      grip_type: 'Serrated band for non-slip',
      applications: ['Spin-on Oil Filters', 'Fuel Filters', 'Cartridge Housing', 'Water Filter Housing'],
      weight: 0.6
    },
    compliance_certifications: ['ISO 9001:2015'],
    warranty_info: '12 bulan garansi',
    is_active: true
  }
];

// ============================================================================
// MAIN EXECUTION FUNCTION
// ============================================================================

async function generateMockData() {
  console.log('🚀 Starting PLN Marketplace Filter Products Mock Data Generation...\n');

  try {
    // Step 1: Insert Categories
    console.log('📦 Step 1: Inserting Filter Categories...');
    const { error: categoryError } = await supabase
      .from('marketplace_categories')
      .upsert(filterCategories, { onConflict: 'category_id' });

    if (categoryError) {
      console.error('❌ Error inserting categories:', categoryError);
      throw categoryError;
    }
    console.log(`✅ Inserted ${filterCategories.length} categories\n`);

    // Step 2: Insert Suppliers
    console.log('🏢 Step 2: Inserting Suppliers...');
    const { error: supplierError } = await supabase
      .from('marketplace_suppliers')
      .upsert(suppliers, { onConflict: 'supplier_id' });

    if (supplierError) {
      console.error('❌ Error inserting suppliers:', supplierError);
      throw supplierError;
    }
    console.log(`✅ Inserted ${suppliers.length} suppliers\n`);

    // Step 3: Insert Filter Products
    console.log('🔧 Step 3: Inserting Filter Products...');

    const productsWithIds = filterProducts.map((product, index) => ({
      item_id: `ITM-20251106-${String(index + 1).padStart(6, '0')}`,
      ...product
    }));

    // Insert in batches of 20
    const batchSize = 20;
    for (let i = 0; i < productsWithIds.length; i += batchSize) {
      const batch = productsWithIds.slice(i, i + batchSize);
      const { error: productError } = await supabase
        .from('marketplace_items')
        .upsert(batch, { onConflict: 'item_id' });

      if (productError) {
        console.error('❌ Error inserting products batch:', productError);
        throw productError;
      }
      console.log(`   ✓ Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} items)`);
    }
    console.log(`✅ Inserted ${productsWithIds.length} filter products\n`);

    // Summary
    console.log('📊 Mock Data Generation Summary:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✓ Categories: ${filterCategories.length}`);
    console.log(`✓ Suppliers: ${suppliers.length}`);
    console.log(`✓ Filter Products: ${productsWithIds.length}`);
    console.log('');
    console.log('Category Breakdown:');
    filterCategories.forEach(cat => {
      const count = productsWithIds.filter(p => p.category_id === cat.category_id).length;
      console.log(`  • ${cat.category_name}: ${count} products`);
    });
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n✨ Mock data generation completed successfully!\n');

  } catch (error) {
    console.error('💥 Fatal error during mock data generation:', error);
    process.exit(1);
  }
}

// Execute if running directly
if (require.main === module) {
  generateMockData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

export { generateMockData, filterCategories, suppliers, filterProducts };
