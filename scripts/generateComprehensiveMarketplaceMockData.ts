#!/usr/bin/env ts-node

/**
 * Comprehensive PLN Marketplace Mock Data Generator
 *
 * Generates 36-45 industrial filter products across 9 categories with:
 * - Detailed technical specifications
 * - Bulk pricing tiers
 * - Indonesian supplier profiles
 * - Realistic inventory and lead times
 * - Complete APBA workflow simulation data
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// COMPREHENSIVE PRODUCT DATA (36-45 PRODUCTS)
// ============================================================================

const comprehensiveProducts = [
  // ========== FILTER BAHAN BAKAR (5 PRODUCTS) ==========
  {
    item_code: 'FLT-BBK-101',
    item_name: 'Filter Solar Primary Stage Cartridge 150 LPM',
    item_description: 'Primary stage diesel fuel filter with 30 micron rating for initial particulate removal. Suitable for PLTD generators 250-500 kVA. Features built-in water drain bowl and differential pressure indicator.',
    category_id: 'CAT-FILTER-BBK',
    supplier_id: 'SUP-000001',
    unit_price: 875000.00,
    bulk_pricing: [
      { min_qty: 1, max_qty: 9, unit_price: 875000, discount: 0 },
      { min_qty: 10, max_qty: 49, unit_price: 787500, discount: 10 },
      { min_qty: 50, max_qty: null, unit_price: 700000, discount: 20 }
    ],
    stock_quantity: 85,
    reorder_point: 25,
    lead_time_days: 10,
    expedited_lead_time: 5,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filtration_rating: '30 micron nominal',
      flow_rate: { value: 150, unit: 'LPM' },
      pressure_rating: { working: '8 bar', burst: '32 bar' },
      temperature_range: { min: -10, max: 110, unit: '°C' },
      dimensions: { length: 280, diameter: 110, unit: 'mm' },
      weight: 1.8,
      connections: { inlet: 'BSP 3/4"', outlet: 'BSP 3/4"' },
      materials: { housing: 'Aluminum', element: 'Cellulose', bowl: 'Polycarbonate' }
    },
    compliance_certifications: ['ISO 9001:2015', 'SNI 19-6411-2000'],
    warranty_info: '12 bulan garansi manufaktur',
    is_active: true
  },
  {
    item_code: 'FLT-BBK-102',
    item_name: 'Filter Solar Secondary Fine 10 Micron High Flow 300 LPM',
    item_description: 'Secondary stage fine filter with 10 micron absolute rating for final fuel polishing before injection system. High flow capacity suitable for large PLTD installations. Includes bypass valve and mounting bracket.',
    category_id: 'CAT-FILTER-BBK',
    supplier_id: 'SUP-000001',
    unit_price: 1250000.00,
    bulk_pricing: [
      { min_qty: 1, max_qty: 9, unit_price: 1250000, discount: 0 },
      { min_qty: 10, max_qty: 24, unit_price: 1125000, discount: 10 },
      { min_qty: 25, max_qty: null, unit_price: 1000000, discount: 20 }
    ],
    stock_quantity: 62,
    reorder_point: 20,
    lead_time_days: 12,
    expedited_lead_time: 6,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filtration_rating: '10 micron absolute',
      beta_ratio: '>1000 @ 10 micron',
      flow_rate: { value: 300, unit: 'LPM' },
      pressure_rating: { working: '10 bar', burst: '40 bar' },
      temperature_range: { min: -20, max: 120, unit: '°C' },
      dimensions: { length: 320, diameter: 125, unit: 'mm' },
      weight: 2.4,
      bypass_valve: 'Built-in @ 2.5 bar differential',
      materials: { housing: '316L Stainless Steel', element: 'Microfiberglass' }
    },
    compliance_certifications: ['ISO 9001:2015', 'ISO 4548-12', 'SNI 19-6411-2000'],
    warranty_info: '18 bulan garansi komponen',
    is_active: true
  },
  {
    item_code: 'FLT-BBK-103',
    item_name: 'Separator Air-Solar Coalescing Type 400 LPM Kapasitas Bowl 1L',
    item_description: 'High-efficiency fuel-water separator using coalescing technology. Removes 99% free and emulsified water from diesel fuel. Automatic drain option available. Essential for fuel system protection in marine and industrial diesel engines.',
    category_id: 'CAT-FILTER-BBK',
    supplier_id: 'SUP-000003',
    unit_price: 3250000.00,
    bulk_pricing: [
      { min_qty: 1, max_qty: 4, unit_price: 3250000, discount: 0 },
      { min_qty: 5, max_qty: 14, unit_price: 2925000, discount: 10 },
      { min_qty: 15, max_qty: null, unit_price: 2600000, discount: 20 }
    ],
    stock_quantity: 28,
    reorder_point: 10,
    lead_time_days: 18,
    expedited_lead_time: 9,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      separator_type: 'Coalescing',
      water_removal_efficiency: '99%',
      flow_rate: { value: 400, unit: 'LPM' },
      bowl_capacity: '1000 ml',
      pressure_rating: { working: '7 bar', burst: '28 bar' },
      temperature_range: { min: 0, max: 90, unit: '°C' },
      dimensions: { length: 220, diameter: 150, height: 380, unit: 'mm' },
      weight: 5.2,
      automatic_drain: 'Optional float-type',
      materials: { housing: 'Aluminum alloy', bowl: 'Clear polycarbonate', element: 'Multi-layer coalescer' }
    },
    compliance_certifications: ['ISO 9001:2015', 'ISO 16332', 'API Standard 1581'],
    warranty_info: '24 bulan garansi housing, 12 bulan element',
    is_active: true
  },
  {
    item_code: 'FLT-BBK-104',
    item_name: 'Filter HFO Heavy Fuel Oil Duplex System 1500 LPM dengan Pemanas',
    item_description: 'Complete HFO filtration system with duplex configuration for continuous operation. Integrated electric heater maintains optimal fuel viscosity. Automatic changeover between filter vessels. Designed for large marine engines and power plant auxiliaries.',
    category_id: 'CAT-FILTER-BBK',
    supplier_id: 'SUP-000002',
    unit_price: 28500000.00,
    bulk_pricing: [
      { min_qty: 1, max_qty: 1, unit_price: 28500000, discount: 0 },
      { min_qty: 2, max_qty: 3, unit_price: 25650000, discount: 10 },
      { min_qty: 4, max_qty: null, unit_price: 22800000, discount: 20 }
    ],
    stock_quantity: 4,
    reorder_point: 2,
    lead_time_days: 45,
    expedited_lead_time: 30,
    unit_of_measure: 'SET',
    technical_specifications: {
      system_type: 'Duplex with auto changeover',
      filtration_rating: '60 micron',
      flow_rate: { value: 1500, unit: 'LPM', condition: '@ 98°C' },
      heater_power: '12 kW',
      heater_voltage: '380V 3-phase',
      pressure_rating: { working: '16 bar', test: '24 bar' },
      temperature_range: { min: 60, max: 150, unit: '°C' },
      dimensions: { length: 1800, width: 1000, height: 1600, unit: 'mm' },
      weight: 420,
      control_panel: 'Included with digital temperature controller',
      materials: { vessels: 'Carbon Steel A106', elements: 'Stainless steel wire mesh', piping: 'Carbon steel Sch 40' }
    },
    compliance_certifications: ['ISO 9001:2015', 'ASME B31.3', 'Lloyd\'s Register Approved'],
    warranty_info: '36 bulan garansi sistem, 12 bulan consumables',
    is_active: true
  },
  {
    item_code: 'FLT-BBK-105',
    item_name: 'Filter Biodiesel B20-B30 Compatible Spin-On 200 LPM',
    item_description: 'Biodiesel-compatible spin-on filter specifically designed for B20 and B30 fuel blends. Special sealing materials resist biodiesel degradation. Includes water-in-fuel sensor with 4-20mA output for monitoring systems. Ideal for modern biofuel-capable generators.',
    category_id: 'CAT-FILTER-BBK',
    supplier_id: 'SUP-000001',
    unit_price: 1650000.00,
    bulk_pricing: [
      { min_qty: 1, max_qty: 9, unit_price: 1650000, discount: 0 },
      { min_qty: 10, max_qty: 29, unit_price: 1485000, discount: 10 },
      { min_qty: 30, max_qty: null, unit_price: 1320000, discount: 20 }
    ],
    stock_quantity: 45,
    reorder_point: 15,
    lead_time_days: 14,
    expedited_lead_time: 7,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'Spin-on with integral sensor',
      biodiesel_compatibility: 'B20-B30',
      filtration_rating: '7 micron absolute',
      flow_rate: { value: 200, unit: 'LPM' },
      pressure_rating: { working: '9 bar', burst: '36 bar' },
      temperature_range: { min: -15, max: 105, unit: '°C' },
      water_sensor: { type: 'Capacitive', output: '4-20mA', alarm_threshold: '0.1% water' },
      dimensions: { diameter: 105, height: 195, unit: 'mm' },
      weight: 1.1,
      thread_size: 'M16 x 1.5',
      materials: { can: 'Steel powder coated', media: 'Synthetic blend', seals: 'Viton (biodiesel resistant)' }
    },
    compliance_certifications: ['ISO 9001:2015', 'EN 14214 (Biodiesel standard)', 'SNI 7182:2015'],
    warranty_info: '12 bulan garansi produk',
    is_active: true
  },

  // ========== FILTER BAHAN KIMIA (4 PRODUCTS) ==========
  {
    item_code: 'FLT-BKM-201',
    item_name: 'Filter Asam Kuat H2SO4/HCl PTFE Lined Y-Strainer DN50',
    item_description: 'Corrosion-resistant Y-strainer with full PTFE lining for concentrated acids (H2SO4, HCl, HNO3). Suitable for chemical dosing systems in water treatment plants. Flanged connections per DIN standard. Includes PTFE-coated screen basket.',
    category_id: 'CAT-FILTER-BKM',
    supplier_id: 'SUP-000003',
    unit_price: 5850000.00,
    bulk_pricing: [
      { min_qty: 1, max_qty: 2, unit_price: 5850000, discount: 0 },
      { min_qty: 3, max_qty: 5, unit_price: 5265000, discount: 10 },
      { min_qty: 6, max_qty: null, unit_price: 4680000, discount: 20 }
    ],
    stock_quantity: 12,
    reorder_point: 4,
    lead_time_days: 35,
    expedited_lead_time: 25,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      strainer_type: 'Y-Strainer PTFE Lined',
      chemical_compatibility: ['H2SO4 up to 98%', 'HCl up to 37%', 'HNO3 up to 70%'],
      filtration_rating: '100 mesh (149 micron)',
      size: 'DN50 (2 inch)',
      pressure_rating: 'PN16 (16 bar @ 20°C)',
      temperature_range: { min: -10, max: 120, unit: '°C' },
      flange_standard: 'DIN 2501 PN16',
      dimensions: { length: 280, width: 160, height: 220, unit: 'mm' },
      weight: 22,
      materials: { body: 'Carbon Steel + PTFE lining', screen: 'PTFE coated SS316', gasket: 'PTFE' }
    },
    compliance_certifications: ['ISO 9001:2015', 'ASME B16.34', 'DIN 3202'],
    warranty_info: '24 bulan garansi lining integrity',
    is_active: true
  },
  {
    item_code: 'FLT-BKM-202',
    item_name: 'Filter Caustic Soda NaOH 50% Basket Type 316L SS DN80',
    item_description: 'Heavy-duty basket strainer in 316L stainless steel for caustic soda (NaOH) service up to 50% concentration. Quick-opening hinged cover for easy maintenance. Perforated basket with 40 micron openings. Ideal for alkaline water treatment systems.',
    category_id: 'CAT-FILTER-BKM',
    supplier_id: 'SUP-000004',
    unit_price: 7250000.00,
    bulk_pricing: [
      { min_qty: 1, max_qty: 2, unit_price: 7250000, discount: 0 },
      { min_qty: 3, max_qty: 4, unit_price: 6525000, discount: 10 },
      { min_qty: 5, max_qty: null, unit_price: 5800000, discount: 20 }
    ],
    stock_quantity: 8,
    reorder_point: 3,
    lead_time_days: 40,
    expedited_lead_time: 28,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      strainer_type: 'Basket with quick-opening cover',
      chemical_compatibility: ['NaOH up to 50%', 'Sodium Hypochlorite', 'Alkaline solutions'],
      filtration_rating: '40 micron',
      size: 'DN80 (3 inch)',
      pressure_rating: 'PN25 (25 bar @ 20°C)',
      temperature_range: { min: 0, max: 100, unit: '°C' },
      flange_standard: 'ASME 150#',
      basket_volume: '3.5 liters',
      dimensions: { length: 480, width: 320, height: 400, unit: 'mm' },
      weight: 48,
      materials: { body: '316L SS (1.4404)', basket: '316L SS perforated', gasket: 'EPDM' }
    },
    compliance_certifications: ['ISO 9001:2015', 'ASME B16.34', 'NACE MR0175', 'PED 2014/68/EU'],
    warranty_info: '36 bulan garansi material dan workmanship',
    is_active: true
  },
  {
    item_code: 'FLT-BKM-203',
    item_name: 'Filter Kimia Dosing Boiler Treatment Polypropylene 80 LPM',
    item_description: 'Chemical-resistant polypropylene cartridge filter for boiler treatment chemical dosing. Handles phosphates, amines, oxygen scavengers, and pH adjusters. Single cartridge housing with quick-change design. Pressure gauge included.',
    category_id: 'CAT-FILTER-BKM',
    supplier_id: 'SUP-000006',
    unit_price: 2150000.00,
    bulk_pricing: [
      { min_qty: 1, max_qty: 4, unit_price: 2150000, discount: 0 },
      { min_qty: 5, max_qty: 9, unit_price: 1935000, discount: 10 },
      { min_qty: 10, max_qty: null, unit_price: 1720000, discount: 20 }
    ],
    stock_quantity: 22,
    reorder_point: 8,
    lead_time_days: 16,
    expedited_lead_time: 8,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      housing_type: 'Single cartridge - swing bolt',
      chemical_compatibility: ['Phosphate', 'Amine', 'Hydrazine', 'Tannin', 'DEAE', 'pH adjusters'],
      filtration_rating: '10 micron',
      cartridge_length: '10 inch',
      flow_rate: { value: 80, unit: 'LPM' },
      pressure_rating: { working: '6 bar', burst: '18 bar' },
      temperature_range: { min: 5, max: 60, unit: '°C' },
      connections: { inlet: 'BSP 1"', outlet: 'BSP 1"', drain: 'BSP 1/2"' },
      dimensions: { diameter: 130, height: 380, unit: 'mm' },
      weight: 3.2,
      pressure_gauge: 'Included 0-10 bar',
      materials: { housing: 'Polypropylene', cartridge: 'Polypropylene pleated', o_rings: 'EPDM' }
    },
    compliance_certifications: ['ISO 9001:2015', 'FDA CFR 21', 'NSF/ANSI 61'],
    warranty_info: '18 bulan garansi housing',
    is_active: true
  },
  {
    item_code: 'FLT-BKM-204',
    item_name: 'Filter Solvent Organik Stainless Steel 316 Cartridge 120 LPM',
    item_description: 'Solvent-compatible stainless steel filter for organic solvents, alcohols, and ketones. All-metal construction withstands aggressive chemicals. Replaceable pleated metal cartridge. Suitable for paint, coating, and chemical processing applications.',
    category_id: 'CAT-FILTER-BKM',
    supplier_id: 'SUP-000004',
    unit_price: 4950000.00,
    bulk_pricing: [
      { min_qty: 1, max_qty: 2, unit_price: 4950000, discount: 0 },
      { min_qty: 3, max_qty: 5, unit_price: 4455000, discount: 10 },
      { min_qty: 6, max_qty: null, unit_price: 3960000, discount: 20 }
    ],
    stock_quantity: 14,
    reorder_point: 5,
    lead_time_days: 28,
    expedited_lead_time: 18,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      housing_type: 'Single cartridge all-metal',
      chemical_compatibility: ['Acetone', 'MEK', 'Toluene', 'Xylene', 'IPA', 'Ethyl acetate'],
      filtration_rating: '25 micron',
      cartridge_type: 'Pleated stainless steel mesh',
      flow_rate: { value: 120, unit: 'LPM' },
      pressure_rating: { working: '20 bar', test: '30 bar' },
      temperature_range: { min: -20, max: 150, unit: '°C' },
      connections: { type: 'Threaded NPT', size: '1 inch' },
      dimensions: { diameter: 110, height: 420, unit: 'mm' },
      weight: 8.5,
      materials: { housing: '316 Stainless Steel', cartridge: '316 SS pleated mesh', seals: 'Viton' }
    },
    compliance_certifications: ['ISO 9001:2015', 'ATEX Zone 1', 'ASME B31.3'],
    warranty_info: '24 bulan garansi housing',
    is_active: true
  },

  // ========== FILTER BAHAN MINYAK (5 PRODUCTS) ==========
  {
    item_code: 'FLT-MNY-301',
    item_name: 'Filter Oli Turbin Uap Main Bearing Lubrication 3 Micron 400 LPM',
    item_description: 'High-precision turbine oil filter for main bearing lubrication systems. Beta 1000 rating at 3 micron ensures maximum bearing protection. Duplex configuration available for continuous operation during element changes. Critical for steam turbine reliability.',
    category_id: 'CAT-FILTER-MNY',
    supplier_id: 'SUP-000002',
    unit_price: 8750000.00,
    bulk_pricing: [
      { min_qty: 1, max_qty: 2, unit_price: 8750000, discount: 0 },
      { min_qty: 3, max_qty: 5, unit_price: 7875000, discount: 10 },
      { min_qty: 6, max_qty: null, unit_price: 7000000, discount: 20 }
    ],
    stock_quantity: 16,
    reorder_point: 6,
    lead_time_days: 25,
    expedited_lead_time: 15,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'Return line filter with bypass',
      application: 'Steam Turbine Main Lube Oil',
      filtration_rating: '3 micron absolute',
      beta_ratio: '>1000 @ 3 micron',
      flow_rate: { value: 400, unit: 'LPM' },
      oil_viscosity: 'ISO VG 32-68',
      pressure_rating: { working: '25 bar', burst: '100 bar' },
      bypass_valve: 'Integral @ 3.5 bar ΔP',
      differential_indicator: 'Visual + electrical switch',
      temperature_range: { min: -10, max: 100, unit: '°C' },
      connections: { type: 'Flanged SAE', size: 'SAE 24 (1-1/2")' },
      dimensions: { diameter: 180, height: 520, unit: 'mm' },
      weight: 28,
      materials: { housing: 'Aluminum alloy', element: 'Microfiberglass', support: 'SS304' }
    },
    compliance_certifications: ['ISO 9001:2015', 'ISO 16889', 'ISO 4406', 'API 614'],
    warranty_info: '36 bulan garansi housing, 12 bulan element',
    is_active: true
  },
  {
    item_code: 'FLT-MNY-302',
    item_name: 'Filter Oli Generator Bearing Spin-On Full Flow 12 Micron',
    item_description: 'Full-flow spin-on oil filter for generator bearing lubrication. Anti-drainback valve prevents dry starts. Relief valve protects against excessive pressure drop. Quick and easy element replacement. Suitable for generators up to 200 MW.',
    category_id: 'CAT-FILTER-MNY',
    supplier_id: 'SUP-000001',
    unit_price: 950000.00,
    bulk_pricing: [
      { min_qty: 1, max_qty: 11, unit_price: 950000, discount: 0 },
      { min_qty: 12, max_qty: 35, unit_price: 855000, discount: 10 },
      { min_qty: 36, max_qty: null, unit_price: 760000, discount: 20 }
    ],
    stock_quantity: 120,
    reorder_point: 40,
    lead_time_days: 8,
    expedited_lead_time: 4,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'Spin-on full flow',
      application: 'Generator Bearing Lubrication',
      filtration_rating: '12 micron nominal',
      flow_rate: { value: 120, unit: 'LPM' },
      pressure_rating: { working: '10 bar', burst: '40 bar' },
      anti_drainback_valve: 'Silicone rubber',
      bypass_valve: 'Opens @ 1.7 bar ΔP',
      temperature_range: { min: -30, max: 110, unit: '°C' },
      thread_size: '3/4"-16 UNF',
      dimensions: { diameter: 93, height: 142, unit: 'mm' },
      weight: 0.75,
      materials: { can: 'Steel with epoxy coating', media: 'Cellulose blend', gasket: 'Nitrile' }
    },
    compliance_certifications: ['ISO 9001:2015', 'ISO 4548-12'],
    warranty_info: '12 bulan garansi manufaktur',
    is_active: true
  },
  {
    item_code: 'FLT-MNY-303',
    item_name: 'Filter Hidraulik Tekanan Tinggi 5 Micron 350 Bar 150 LPM',
    item_description: 'High-pressure hydraulic filter for critical servo and proportional valve protection. Collapse-resistant element design. Electrical clogging indicator with 2-stage alarm. Used in turbine control systems, hydraulic governors, and precision actuators.',
    category_id: 'CAT-FILTER-MNY',
    supplier_id: 'SUP-000004',
    unit_price: 6450000.00,
    bulk_pricing: [
      { min_qty: 1, max_qty: 3, unit_price: 6450000, discount: 0 },
      { min_qty: 4, max_qty: 7, unit_price: 5805000, discount: 10 },
      { min_qty: 8, max_qty: null, unit_price: 5160000, discount: 20 }
    ],
    stock_quantity: 24,
    reorder_point: 8,
    lead_time_days: 22,
    expedited_lead_time: 12,
    unit_of_measure: 'PIECE',
    technical_specifications: {
      filter_type: 'High pressure element type',
      application: 'Hydraulic pressure line',
      filtration_rating: '5 micron absolute',
      beta_ratio: '>1000 @ 5 micron',
      flow_rate: { value: 150, unit: 'LPM' },
      pressure_rating: { working: '350 bar', test: '420 bar', burst: '525 bar' },
      collapse_rating: '>100 bar ΔP',
      clogging_indicator: { type: 'Visual + electrical', switch: '250VAC 2A', stages: 2 },
      temperature_range: { min: -30, max: 100, unit: '°C' },
      connections: { inlet: 'G 1"', outlet: 'G 1"' },
      dimensions: { diameter: 145, height: 265, unit: 'mm' },
      weight: 7.8,
      materials: { housing: 'Aluminum alloy', element: 'Microfiberglass with SS mesh', seals: 'Viton' }
    },
    compliance_certifications: ['ISO 9001:2015', 'ISO 16889', 'ISO 2942', 'ISO 3724'],
    warranty_info: '24 bulan garansi housing dan indicator',
    is_active: true
  },
  {
    item_code: 'FLT-MNY-304',
    item_name: 'Filter Oli Transformer Vacuum Dehydration System 250 LPM',
    item_description: 'Complete transformer oil purification system with vacuum dehydration and activated carbon treatment. Removes moisture, gases, and contaminants. Dual-stage filtration: coarse 25 micron + fine 1 micron. Suitable for transformer oil maintenance and commissioning.',
    category_id: 'CAT-FILTER-MNY',
    supplier_id: 'SUP-000003',
    unit_price: 45000000.00,
    bulk_pricing: [
      { min_qty: 1, max_qty: 1, unit_price: 45000000, discount: 0 },
      { min_qty: 2, max_qty: 2, unit_price: 40500000, discount: 10 }
    ],
    stock_quantity: 2,
    reorder_point: 1,
    lead_time_days: 60,
    expedited_lead_time: 45,
    unit_of_measure: 'SET',
    technical_specifications: {
      system_type: 'Vacuum dehydration with multi-stage filtration',
      application: 'Transformer oil purification',
      filtration_stages: [
        { stage: 1, rating: '25 micron', type: 'Pre-filter' },
        { stage: 2, rating: '1 micron', type: 'Fine filter' }
      ],
      flow_rate: { value: 250, unit: 'LPM', condition: '@ 60°C' },
      vacuum_level: '-0.095 MPa',
      dehydration_capacity: '15 kg/hr water removal',
      activated_carbon: '75 kg capacity',
      heating_element: { power: '48 kW', voltage: '380V 3-phase', control: 'PID temperature controller' },
      temperature_control: { range: '40-80°C', accuracy: '±2°C' },
      pressure_rating: { inlet: '4 bar max', vacuum_chamber: '-0.095 MPa' },
      dimensions: { length: 2200, width: 1200, height: 2000, unit: 'mm' },
      weight: 850,
      control_panel: 'Digital with PLC, touchscreen HMI',
      materials: { vessels: '316L Stainless Steel', piping: 'Stainless steel', vacuum_pump: 'Oil-sealed rotary vane' }
    },
    compliance_certifications: ['ISO 9001:2015', 'IEC 60422', 'IEC 60296', 'PLN-APP-2024-00567'],
    warranty_info: '36 bulan garansi sistem, 12 bulan consumables',
    is_active: true
  },
  {
    item_code: 'FLT-MNY-305',
    item_name: 'Filter Oli Gear Box Reducer Industrial 10 Micron 180 LPM',
    item_description: 'Off-line oil filtration cart for gearbox oil conditioning. Portable unit with pump, motor, and filters. Extends gearbox life by maintaining oil cleanliness. Includes particle counter connection port. Ideal for coal mills, ball mills, and large industrial gearboxes.',
    category_id: 'CAT-FILTER-MNY',
    supplier_id: 'SUP-000004',
    unit_price: 12500000.00,
    bulk_pricing: [
      { min_qty: 1, max_qty: 1, unit_price: 12500000, discount: 0 },
      { min_qty: 2, max_qty: 3, unit_price: 11250000, discount: 10 },
      { min_qty: 4, max_qty: null, unit_price: 10000000, discount: 20 }
    ],
    stock_quantity: 6,
    reorder_point: 2,
    lead_time_days: 35,
    expedited_lead_time: 20,
    unit_of_measure: 'SET',
    technical_specifications: {
      system_type: 'Portable kidney loop filtration',
      application: 'Off-line gearbox oil conditioning',
      filtration_rating: '10 micron absolute',
      flow_rate: { value: 180, unit: 'LPM' },
      pump_type: 'Gear pump',
      motor: { power: '3 kW', voltage: '380V 3-phase 50Hz' },
      filter_elements: 'Dual cartridge configuration',
      pressure_rating: { max: '10 bar' },
      hose_kit: '2 x 6m hoses with quick couplers',
      particle_counter_port: 'Included for ISO 4406 monitoring',
      dimensions: { length: 800, width: 600, height: 1100, unit: 'mm' },
      weight: 125,
      mobility: 'Mounted on wheeled cart with handle',
      materials: { housing: 'Steel powder coated', elements: 'Microfiberglass', frame: 'Steel' }
    },
    compliance_certifications: ['ISO 9001:2015', 'ISO 4406', 'AGMA 9005'],
    warranty_info: '24 bulan garansi sistem',
    is_active: true
  },

  // Continue with remaining categories...
  // I'll add the rest in the next section to keep this manageable
];

// Export for use
export { comprehensiveProducts };
