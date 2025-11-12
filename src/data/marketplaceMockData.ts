import {
  MarketplaceCategory,
  MarketplaceSupplier,
  MarketplaceItem,
  MarketplaceCartItem,
  PLNFacility,
  MarketplacePRHeader,
  MarketplacePRLine,
  MarketplaceOrder,
  MarketplaceOrderTracking,
  PRStatusSummary,
  OrderStatusSummary,
  CartSummary
} from '../types/marketplace';

/**
 * Mock Data for PLN Indonesia Power Marketplace
 * Based on Filter Product Categories
 */

// ============================================================================
// IN-MEMORY STORAGE FOR LOCALLY CREATED PRs
// ============================================================================

// This array will store PRs created locally without database
let localPRStorage: MarketplacePRHeader[] = [];
let localPRIdCounter = 1000; // Start from 1000 to avoid conflicts

/**
 * Add a PR to local storage
 */
export function addLocalPR(pr: MarketplacePRHeader): void {
  localPRStorage.push(pr);
}

/**
 * Get all locally stored PRs
 */
export function getLocalPRs(userId?: string): MarketplacePRHeader[] {
  if (userId) {
    return localPRStorage.filter(pr => pr.requestor_id === userId);
  }
  return localPRStorage;
}

/**
 * Get next PR ID
 */
export function getNextPRId(): number {
  return localPRIdCounter++;
}

/**
 * Clear local PR storage (useful for testing)
 */
export function clearLocalPRs(): void {
  localPRStorage = [];
  localPRIdCounter = 1000;
}

// ============================================================================
// CATEGORIES - Updated structure matching PLN categories
// ============================================================================

export const mockCategories: MarketplaceCategory[] = [
  {
    category_id: 'CAT-FASTENERS',
    category_code: 'FAST',
    category_name: 'BAUT, SEKRUP, MUR METRIK',
    description: 'Bolts, screws, nuts and metric fasteners for power plant equipment assembly and maintenance',
    icon_name: 'Wrench',
    display_order: 1,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    category_id: 'CAT-BEARINGS',
    category_code: 'BEAR',
    category_name: 'BEARING',
    description: 'Ball bearings, roller bearings, journal bearings and bearing accessories for rotating equipment',
    icon_name: 'Circle',
    display_order: 2,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    category_id: 'CAT-FILTERS',
    category_code: 'FILT',
    category_name: 'FILTER',
    description: 'Fuel filters, oil filters, air filters, chemical filters and filtration systems for power plant applications',
    icon_name: 'Filter',
    display_order: 3,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    category_id: 'CAT-INSULATION',
    category_code: 'INSL',
    category_name: 'ISOLASI',
    description: 'Thermal, electrical, and acoustic insulation materials for power generation equipment',
    icon_name: 'Shield',
    display_order: 4,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    category_id: 'CAT-VALVES',
    category_code: 'VALV',
    category_name: 'VALVE, TRAP',
    description: 'Industrial valves, control valves, safety valves, steam traps and valve accessories',
    icon_name: 'Settings',
    display_order: 5,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

// ============================================================================
// SUPPLIERS
// ============================================================================

export const mockSuppliers: MarketplaceSupplier[] = [
  {
    supplier_id: 'SUP-000001',
    supplier_code: 'DNL-ID',
    supplier_name: 'PT Air Filter Indonesia',
    contact_person: 'Budi Santoso',
    contact_email: 'budi.santoso@donaldson.co.id',
    contact_phone: '+62-21-8934567',
    address: 'Jl. Jababeka XIV Blok W No. 5-6',
    city: 'Bekasi',
    province: 'Jawa Barat',
    postal_code: '17530',
    certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'OHSAS 18001'],
    performance_rating: 4.8,
    is_pln_approved: true,
    is_active: true,
    notes: 'Premier supplier of industrial filtration solutions',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    supplier_id: 'SUP-000002',
    supplier_code: 'PKR-ID',
    supplier_name: 'PT Air Filter Indonesia',
    contact_person: 'Siti Nurhaliza',
    contact_email: 'siti.nurhaliza@parker.com',
    contact_phone: '+62-21-8901234',
    address: 'Kawasan Industri MM2100 Blok HH-1',
    city: 'Bekasi',
    province: 'Jawa Barat',
    postal_code: '17520',
    certifications: ['ISO 9001:2015', 'ISO 14001:2015'],
    performance_rating: 4.7,
    is_pln_approved: true,
    is_active: true,
    notes: 'Global leader in motion and control technologies',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    supplier_id: 'SUP-000003',
    supplier_code: 'PLF-ID',
    supplier_name: 'PT Air Filter Indonesia',
    contact_person: 'Rudi Hartono',
    contact_email: 'rudi.hartono@pall.com',
    contact_phone: '+62-21-2934567',
    address: 'Gedung Cyber 2 Tower Lt. 10',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    postal_code: '12950',
    certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'API Q1'],
    performance_rating: 4.9,
    is_pln_approved: true,
    is_active: true,
    notes: 'Advanced filtration and separations solutions',
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    supplier_id: 'SUP-000004',
    supplier_code: 'RSX-ID',
    supplier_name: 'PT Air Filter Indonesia',
    contact_person: 'Andi Wijaya',
    contact_email: 'andi.wijaya@rockwool.co.id',
    contact_phone: '+62-21-8905678',
    address: 'Jl. Raya Serang KM 14',
    city: 'Tangerang',
    province: 'Banten',
    postal_code: '15710',
    certifications: ['ISO 9001:2015', 'ISO 14001:2015'],
    performance_rating: 4.6,
    is_pln_approved: true,
    is_active: true,
    notes: 'Leading insulation materials supplier',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    supplier_id: 'SUP-000005',
    supplier_code: 'KIZ-ID',
    supplier_name: 'PT Air Filter Indonesia',
    contact_person: 'Dewi Sartika',
    contact_email: 'dewi.sartika@kitz.co.id',
    contact_phone: '+62-21-8907890',
    address: 'Kawasan Industri Pulogadung',
    city: 'Jakarta Timur',
    province: 'DKI Jakarta',
    postal_code: '13920',
    certifications: ['ISO 9001:2015', 'API 6D', 'ASME'],
    performance_rating: 4.8,
    is_pln_approved: true,
    is_active: true,
    notes: 'Industrial valve specialist for power generation',
    created_at: '2024-03-15T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    supplier_id: 'SUP-000006',
    supplier_code: 'SKF-ID',
    supplier_name: 'PT Air Filter Indonesia',
    contact_person: 'Agus Setiawan',
    contact_email: 'agus.setiawan@skf.com',
    contact_phone: '+62-21-8956789',
    address: 'Jl. Raya Bekasi KM 22',
    city: 'Bekasi',
    province: 'Jawa Barat',
    postal_code: '17530',
    certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'TS 16949'],
    performance_rating: 4.9,
    is_pln_approved: true,
    is_active: true,
    notes: 'World-leading bearing and seal manufacturer',
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    supplier_id: 'SUP-000007',
    supplier_code: 'WRG-ID',
    supplier_name: 'PT Air Filter Indonesia',
    contact_person: 'Made Wirawan',
    contact_email: 'made.wirawan@wurth.co.id',
    contact_phone: '+62-21-5678901',
    address: 'Jl. Gatot Subroto Kav. 32',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    postal_code: '12950',
    certifications: ['ISO 9001:2015', 'DIN Standards'],
    performance_rating: 4.7,
    is_pln_approved: true,
    is_active: true,
    notes: 'Premium fasteners and assembly products supplier',
    created_at: '2024-04-15T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    supplier_id: 'SUP-000008',
    supplier_code: 'NSK-ID',
    supplier_name: 'PT Air Filter Indonesia',
    contact_person: 'Yanto Kurniawan',
    contact_email: 'yanto.kurniawan@nsk.com',
    contact_phone: '+62-21-4567890',
    address: 'Kawasan Industri JIEP Blok A',
    city: 'Surabaya',
    province: 'Jawa Timur',
    postal_code: '60177',
    certifications: ['ISO 9001:2015', 'ISO 14001:2015'],
    performance_rating: 4.8,
    is_pln_approved: true,
    is_active: true,
    notes: 'Precision bearing technology specialist',
    created_at: '2024-05-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    supplier_id: 'SUP-000009',
    supplier_code: 'SPX-ID',
    supplier_name: 'PT Air Filter Indonesia',
    contact_person: 'Rina Kusuma',
    contact_email: 'rina.kusuma@spiraxsarco.com',
    contact_phone: '+62-21-3456789',
    address: 'Gedung Cakrawala Lt. 15',
    city: 'Jakarta Pusat',
    province: 'DKI Jakarta',
    postal_code: '10340',
    certifications: ['ISO 9001:2015', 'PED Certified'],
    performance_rating: 4.9,
    is_pln_approved: true,
    is_active: true,
    notes: 'Steam system and control valve experts',
    created_at: '2024-05-15T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    supplier_id: 'SUP-000010',
    supplier_code: 'CAM-ID',
    supplier_name: 'PT Air Filter Indonesia',
    contact_person: 'Bambang Hermawan',
    contact_email: 'bambang.hermawan@camfil.com',
    contact_phone: '+62-21-2345678',
    address: 'Jl. Industri Raya No. 45',
    city: 'Tangerang',
    province: 'Banten',
    postal_code: '15134',
    certifications: ['ISO 9001:2015', 'ISO 14644', 'ASHRAE'],
    performance_rating: 4.8,
    is_pln_approved: true,
    is_active: true,
    notes: 'Air filtration and clean air solutions',
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

// ============================================================================
// PLN FACILITIES
// ============================================================================

export const mockPLNFacilities: PLNFacility[] = [
  {
    facility_id: 'FAC-PLN-001',
    facility_code: 'PLTU-SRY',
    facility_name: 'PLTU Suralaya',
    facility_type: 'Steam Power Plant',
    address: 'Jl. Raya Suralaya KM 12',
    city: 'Cilegon',
    province: 'Banten',
    postal_code: '42447',
    latitude: -6.0342,
    longitude: 106.0212,
    contact_person: 'Ir. Bambang Sutrisno',
    contact_phone: '+62 254 391234',
    contact_email: 'bambang.sutrisno@pln.co.id',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    facility_id: 'FAC-PLN-002',
    facility_code: 'PLTU-PBR',
    facility_name: 'PLTU Paiton',
    facility_type: 'Steam Power Plant',
    address: 'Jl. Raya Surabaya-Situbondo KM 141',
    city: 'Probolinggo',
    province: 'Jawa Timur',
    postal_code: '67291',
    latitude: -7.7234,
    longitude: 113.4567,
    contact_person: 'Ir. Hadi Purnomo',
    contact_phone: '+62 335 771001',
    contact_email: 'hadi.purnomo@pln.co.id',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    facility_id: 'FAC-PLN-003',
    facility_code: 'PLTGU-CRB',
    facility_name: 'PLTGU Cikarang Listrindo',
    facility_type: 'Gas Turbine Power Plant',
    address: 'Kawasan Industri Jababeka',
    city: 'Cikarang',
    province: 'Jawa Barat',
    postal_code: '17530',
    latitude: -6.2934,
    longitude: 107.1567,
    contact_person: 'Ir. Siti Aminah, MT',
    contact_phone: '+62 21 8934567',
    contact_email: 'siti.aminah@pln.co.id',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

// ============================================================================
// MARKETPLACE ITEMS
// ============================================================================

export const mockMarketplaceItems: MarketplaceItem[] = [
  // ========== FASTENERS CATEGORY (10 items) ==========
  {
    item_id: 'ITEM-FAST-001',
    item_code: 'BLT-HEX-M12',
    item_name: 'BAUT HEXAGON SOCKET M12 x 50mm - Stainless A4-70',
    item_description: 'Hexagon socket head cap screw M12 x 50mm, stainless steel A4-70 for high temperature and corrosive environments',
    category_id: 'CAT-FASTENERS',
    supplier_id: 'SUP-000007',
    unit_price: 12500,
    currency: 'IDR',
    stock_quantity: 5000,
    lead_time_days: 7,
    unit_of_measure: 'PCS',
    technical_specifications: { material: 'Stainless Steel A4-70', size: 'M12 x 50mm', finish: 'Passivated', strength_grade: 'A4-70' },
    compliance_certifications: ['ISO 9001:2015', 'DIN 912'],
    warranty_info: '12 months manufacturer warranty',
    image_url: '/images/fasteners/hex-socket-bolt.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FAST-002',
    item_code: 'BLT-NUT-M16',
    item_name: 'BAUT DAN MUR SET M16 - Complete with Washers',
    item_description: 'Complete bolt and nut set M16, stainless steel grade 304, includes hex bolt, hex nut, flat washer and spring washer',
    category_id: 'CAT-FASTENERS',
    supplier_id: 'SUP-000007',
    unit_price: 28000,
    currency: 'IDR',
    stock_quantity: 2500,
    lead_time_days: 10,
    unit_of_measure: 'SET',
    technical_specifications: { material: 'Stainless Steel 304', size: 'M16', includes: 'Bolt, Nut, Flat Washer, Spring Washer' },
    compliance_certifications: ['ISO 9001:2015', 'DIN Standards'],
    warranty_info: '12 months manufacturer warranty',
    image_url: '/images/fasteners/bolt-nut-set.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FAST-003',
    item_code: 'BLT-SP-TI-M20',
    item_name: 'BAUT DAN MUR JENIS KHUSUS - Titanium Alloy M20',
    item_description: 'Special titanium alloy Ti-6Al-4V bolt and nut set M20 for critical high-temperature turbine applications',
    category_id: 'CAT-FASTENERS',
    supplier_id: 'SUP-000007',
    unit_price: 425000,
    currency: 'IDR',
    stock_quantity: 500,
    lead_time_days: 21,
    unit_of_measure: 'SET',
    technical_specifications: { material: 'Titanium Ti-6Al-4V', size: 'M20 x 80mm', temperature_range: '-200°C to 400°C' },
    compliance_certifications: ['ISO 9001:2015', 'AMS Standards'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/fasteners/titanium-bolt-set.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FAST-004',
    item_code: 'BLT-ANCHOR-M24',
    item_name: 'BAUT JENIS KHUSUS - Anchor Bolt M24',
    item_description: 'Heavy-duty anchor bolt M24 x 500mm with expansion sleeve for concrete foundation mounting, 30kN load capacity',
    category_id: 'CAT-FASTENERS',
    supplier_id: 'SUP-000007',
    unit_price: 89000,
    currency: 'IDR',
    stock_quantity: 1000,
    lead_time_days: 14,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'M24 x 500mm', type: 'Expansion Anchor', load_capacity: '30 kN', material: 'Carbon Steel Grade 8.8' },
    compliance_certifications: ['ISO 9001:2015', 'ASTM F1554'],
    warranty_info: '18 months manufacturer warranty',
    image_url: '/images/fasteners/anchor-bolt.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FAST-005',
    item_code: 'NUT-HEX-M20',
    item_name: 'MUR HEXAGON M20 - DIN 934 Standard',
    item_description: 'Hexagon nut M20, stainless steel A2-70, DIN 934 standard for general assembly applications',
    category_id: 'CAT-FASTENERS',
    supplier_id: 'SUP-000007',
    unit_price: 8500,
    currency: 'IDR',
    stock_quantity: 8000,
    lead_time_days: 5,
    unit_of_measure: 'PCS',
    technical_specifications: { material: 'Stainless Steel A2-70', size: 'M20', standard: 'DIN 934' },
    compliance_certifications: ['ISO 9001:2015', 'DIN 934'],
    warranty_info: '12 months manufacturer warranty',
    image_url: '/images/fasteners/hex-nut.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FAST-006',
    item_code: 'ACC-WASHER-KIT',
    item_name: 'PERLENGKAPAN BAUT - Washer & Lock Kit',
    item_description: 'Comprehensive bolt accessory kit including flat washers, spring washers, and lock washers - 500 pieces assorted',
    category_id: 'CAT-FASTENERS',
    supplier_id: 'SUP-000007',
    unit_price: 375000,
    currency: 'IDR',
    stock_quantity: 150,
    lead_time_days: 7,
    unit_of_measure: 'KIT',
    technical_specifications: { contents: '500 pieces assorted', types: 'Flat, Spring, Lock washers', sizes: 'M8 to M24', material: 'Stainless Steel 304' },
    compliance_certifications: ['ISO 9001:2015'],
    warranty_info: '12 months manufacturer warranty',
    image_url: '/images/fasteners/washer-kit.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FAST-007',
    item_code: 'SCR-HEX-M8',
    item_name: 'SEKRUP HEXAGON SOCKET M8 x 40mm',
    item_description: 'Hexagon socket set screw M8 x 40mm, stainless steel A4 marine grade for electrical panel mounting',
    category_id: 'CAT-FASTENERS',
    supplier_id: 'SUP-000007',
    unit_price: 6500,
    currency: 'IDR',
    stock_quantity: 10000,
    lead_time_days: 5,
    unit_of_measure: 'PCS',
    technical_specifications: { material: 'Stainless Steel A4', size: 'M8 x 40mm', head_type: 'Socket Head Cap' },
    compliance_certifications: ['ISO 9001:2015', 'DIN 912'],
    warranty_info: '12 months manufacturer warranty',
    image_url: '/images/fasteners/socket-screw.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FAST-008',
    item_code: 'SCR-SELF-TAP-ST6',
    item_name: 'SEKRUP JENIS KHUSUS - Self-Tapping ST6',
    item_description: 'Self-tapping screw ST6 x 50mm with hex washer head for sheet metal and thin wall applications',
    category_id: 'CAT-FASTENERS',
    supplier_id: 'SUP-000007',
    unit_price: 2500,
    currency: 'IDR',
    stock_quantity: 15000,
    lead_time_days: 5,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'ST6 x 50mm', head_type: 'Hex Washer Head', material: 'Carbon Steel', finish: 'Zinc Plated' },
    compliance_certifications: ['ISO 9001:2015'],
    warranty_info: '12 months manufacturer warranty',
    image_url: '/images/fasteners/self-tapping-screw.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FAST-009',
    item_code: 'SCR-MCH-M6',
    item_name: 'SEKRUP MESIN M6 x 20mm',
    item_description: 'Machine screw M6 x 20mm, pan head, Phillips drive for electrical control panel assembly',
    category_id: 'CAT-FASTENERS',
    supplier_id: 'SUP-000007',
    unit_price: 1800,
    currency: 'IDR',
    stock_quantity: 25000,
    lead_time_days: 3,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'M6 x 20mm', head_type: 'Pan Head', drive: 'Phillips', material: 'Stainless Steel 304' },
    compliance_certifications: ['ISO 9001:2015'],
    warranty_info: '12 months manufacturer warranty',
    image_url: '/images/fasteners/machine-screw.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FAST-010',
    item_code: 'STUD-M16X200',
    item_name: 'STUD BOLT M16 x 200mm - ASTM B7',
    item_description: 'Threaded stud bolt M16 x 200mm, ASTM A193 Grade B7 alloy steel for high-temperature flange connections',
    category_id: 'CAT-FASTENERS',
    supplier_id: 'SUP-000007',
    unit_price: 32000,
    currency: 'IDR',
    stock_quantity: 3000,
    lead_time_days: 10,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'M16 x 200mm', material: 'ASTM A193 Grade B7', temperature_range: '-29°C to 540°C' },
    compliance_certifications: ['ISO 9001:2015', 'ASTM A193'],
    warranty_info: '18 months manufacturer warranty',
    image_url: '/images/fasteners/stud-bolt.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },

  // ========== BEARINGS CATEGORY (7 items) ==========
  {
    item_id: 'ITEM-BEAR-001',
    item_code: 'BRG-BALL-6310',
    item_name: 'BALL BEARING Deep Groove 6310-2RS',
    item_description: 'Deep groove ball bearing 6310-2RS, double sealed, 50mm bore for electric motors, pumps and industrial machinery',
    category_id: 'CAT-BEARINGS',
    supplier_id: 'SUP-000006',
    unit_price: 165000,
    currency: 'IDR',
    stock_quantity: 800,
    lead_time_days: 7,
    unit_of_measure: 'PCS',
    technical_specifications: { bore: '50mm', outer_diameter: '110mm', width: '27mm', type: 'Deep Groove', sealing: 'Double Rubber Sealed (2RS)' },
    compliance_certifications: ['ISO 9001:2015', 'ISO 14001:2015'],
    warranty_info: '36 months manufacturer warranty',
    image_url: '/images/bearings/ball-bearing-6310.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-BEAR-002',
    item_code: 'BRG-JOUR-150MM',
    item_name: 'JOURNAL BEARING RADIAL 150mm ID - Bronze',
    item_description: 'Cylindrical journal bearing 150mm ID, bronze alloy CuSn10 for heavy-duty rotating equipment and turbines',
    category_id: 'CAT-BEARINGS',
    supplier_id: 'SUP-000006',
    unit_price: 3750000,
    currency: 'IDR',
    stock_quantity: 80,
    lead_time_days: 18,
    unit_of_measure: 'PCS',
    technical_specifications: { inner_diameter: '150mm', outer_diameter: '220mm', material: 'Bronze CuSn10', application: 'Heavy Rotating Equipment' },
    compliance_certifications: ['ISO 9001:2015'],
    warranty_info: '36 months manufacturer warranty',
    image_url: '/images/bearings/journal-bearing.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-BEAR-003',
    item_code: 'BRG-ACC-MAINT-KIT',
    item_name: 'PERLENGKAPAN BEARING - Professional Maintenance Kit',
    item_description: 'Complete bearing maintenance kit with grease gun, bearing puller, induction heater, seals and premium lubricants',
    category_id: 'CAT-BEARINGS',
    supplier_id: 'SUP-000006',
    unit_price: 8500000,
    currency: 'IDR',
    stock_quantity: 30,
    lead_time_days: 21,
    unit_of_measure: 'KIT',
    technical_specifications: { contents: 'Grease gun, hydraulic puller, induction heater, seal kit, lubricant', application: 'Professional bearing maintenance' },
    compliance_certifications: ['ISO 9001:2015'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/bearings/maintenance-kit.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-BEAR-004',
    item_code: 'BRG-PLW-UCP210',
    item_name: 'PILLOW BEARING UCP210 - 50mm',
    item_description: 'Pillow block bearing UCP210, 50mm bore, cast iron housing with triple-lip seals for conveyor and industrial machinery',
    category_id: 'CAT-BEARINGS',
    supplier_id: 'SUP-000008',
    unit_price: 425000,
    currency: 'IDR',
    stock_quantity: 200,
    lead_time_days: 10,
    unit_of_measure: 'PCS',
    technical_specifications: { bore: '50mm', housing_material: 'Cast Iron', seal_type: 'Triple Lip', mounting: '4-bolt base' },
    compliance_certifications: ['ISO 9001:2015'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/bearings/pillow-block.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-BEAR-005',
    item_code: 'BRG-ROLL-22220',
    item_name: 'ROLLER BEARING Spherical 22220 CC',
    item_description: 'Spherical roller bearing 22220 CC with optimized internal geometry for heavy loads, misalignment and mining equipment',
    category_id: 'CAT-BEARINGS',
    supplier_id: 'SUP-000006',
    unit_price: 2850000,
    currency: 'IDR',
    stock_quantity: 100,
    lead_time_days: 14,
    unit_of_measure: 'PCS',
    technical_specifications: { bore: '100mm', outer_diameter: '180mm', type: 'Spherical Roller', cage: 'Steel', clearance: 'C3' },
    compliance_certifications: ['ISO 9001:2015', 'ISO 14001:2015'],
    warranty_info: '36 months manufacturer warranty',
    image_url: '/images/bearings/spherical-roller.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-BEAR-006',
    item_code: 'BRG-SELF-1210K',
    item_name: 'SELF ALIGNING BEARING 1210K',
    item_description: 'Self-aligning ball bearing 1210K, 50mm bore with adapter sleeve for shaft misalignment compensation up to 3 degrees',
    category_id: 'CAT-BEARINGS',
    supplier_id: 'SUP-000006',
    unit_price: 385000,
    currency: 'IDR',
    stock_quantity: 150,
    lead_time_days: 10,
    unit_of_measure: 'PCS',
    technical_specifications: { bore: '50mm', type: 'Self-Aligning Ball', misalignment: '±3 degrees', includes: 'Adapter sleeve' },
    compliance_certifications: ['ISO 9001:2015'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/bearings/self-aligning.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-BEAR-007',
    item_code: 'BRG-THRUST-51210',
    item_name: 'THRUST BEARING 51210',
    item_description: 'Single direction thrust ball bearing 51210 for axial loads in vertical pumps, motors and compressors',
    category_id: 'CAT-BEARINGS',
    supplier_id: 'SUP-000006',
    unit_price: 275000,
    currency: 'IDR',
    stock_quantity: 200,
    lead_time_days: 10,
    unit_of_measure: 'PCS',
    technical_specifications: { bore: '50mm', outer_diameter: '78mm', type: 'Single Direction Thrust', application: 'Axial loads' },
    compliance_certifications: ['ISO 9001:2015'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/bearings/thrust-bearing.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },

  // ========== FILTERS CATEGORY (9 items) ==========
  {
    item_id: 'ITEM-FLT-001',
    item_code: 'FLT-BBK-HFO-DX',
    item_name: 'FILTER BAHAN BAKAR - Heavy Fuel Oil Duplex System',
    item_description: 'Automatic duplex HFO filter system, 150 micron, changeover without shutdown, 500 L/min capacity for power generation',
    category_id: 'CAT-FILTERS',
    supplier_id: 'SUP-000003',
    unit_price: 15750000,
    currency: 'IDR',
    stock_quantity: 25,
    lead_time_days: 35,
    unit_of_measure: 'UNIT',
    technical_specifications: { filtration: '150 micron', flow_rate: '500 L/min', type: 'Duplex automatic', material: 'Stainless Steel 316' },
    compliance_certifications: ['ISO 9001:2015', 'API Certified'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/filters/hfo-duplex.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FLT-002',
    item_code: 'FLT-CHM-PP-5M',
    item_name: 'FILTER BAHAN KIMIA - Polypropylene Cartridge',
    item_description: 'Chemical resistant polypropylene filter cartridge, 5 micron, 20 inch length for acid and alkali chemical applications',
    category_id: 'CAT-FILTERS',
    supplier_id: 'SUP-000003',
    unit_price: 285000,
    currency: 'IDR',
    stock_quantity: 300,
    lead_time_days: 10,
    unit_of_measure: 'PCS',
    technical_specifications: { filtration: '5 micron', length: '20 inch', material: 'Polypropylene', chemical_resistant: 'Yes' },
    compliance_certifications: ['ISO 9001:2015', 'FDA CFR 21'],
    warranty_info: '12 months manufacturer warranty',
    image_url: '/images/filters/chemical-cartridge.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FLT-003',
    item_code: 'FLT-OIL-TURB-25M',
    item_name: 'FILTER BAHAN MINYAK - Turbine Oil Filter 25M',
    item_description: 'High-capacity turbine lube oil filter, 25 micron glass fiber media, 300 L/min for steam and gas turbine lubrication',
    category_id: 'CAT-FILTERS',
    supplier_id: 'SUP-000003',
    unit_price: 1850000,
    currency: 'IDR',
    stock_quantity: 120,
    lead_time_days: 14,
    unit_of_measure: 'PCS',
    technical_specifications: { filtration: '25 micron', flow_rate: '300 L/min', media: 'Glass fiber', application: 'Turbine lube oil' },
    compliance_certifications: ['ISO 9001:2015', 'ISO 14001:2015'],
    warranty_info: '18 months manufacturer warranty',
    image_url: '/images/filters/turbine-oil-filter.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FLT-004',
    item_code: 'FLT-SP-COALESC',
    item_name: 'FILTER KHUSUS - Coalescent Filter Separator',
    item_description: 'High-efficiency coalescent filter separator, 99.9% water removal efficiency from fuel and hydraulic oil systems',
    category_id: 'CAT-FILTERS',
    supplier_id: 'SUP-000003',
    unit_price: 4250000,
    currency: 'IDR',
    stock_quantity: 60,
    lead_time_days: 21,
    unit_of_measure: 'PCS',
    technical_specifications: { efficiency: '99.9%', type: 'Coalescer', application: 'Water separation', flow_rate: '200 L/min' },
    compliance_certifications: ['ISO 9001:2015', 'API Certified'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/filters/coalescer.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FLT-005',
    item_code: 'FLT-MULTI-BAG-4',
    item_name: 'FILTER MULTI FUNGSI - Multi-Bag Housing',
    item_description: 'Stainless steel 304 four-bag filter housing, 400 L/min total capacity for multiple industrial filtration applications',
    category_id: 'CAT-FILTERS',
    supplier_id: 'SUP-000003',
    unit_price: 12500000,
    currency: 'IDR',
    stock_quantity: 35,
    lead_time_days: 28,
    unit_of_measure: 'UNIT',
    technical_specifications: { capacity: '4 bags', flow_rate: '400 L/min', material: 'Stainless Steel 304', pressure_rating: '10 bar' },
    compliance_certifications: ['ISO 9001:2015', 'ASME Code'],
    warranty_info: '36 months manufacturer warranty',
    image_url: '/images/filters/multi-bag-housing.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FLT-006',
    item_code: 'FLT-AIR-HEPA-H13',
    item_name: 'FILTER UDARA DAN GAS - Turbine Inlet HEPA',
    item_description: 'HEPA H13 filter for gas turbine inlet air, 99.95% efficiency at 0.3 micron, high airflow capacity for power generation',
    category_id: 'CAT-FILTERS',
    supplier_id: 'SUP-000010',
    unit_price: 2750000,
    currency: 'IDR',
    stock_quantity: 90,
    lead_time_days: 20,
    unit_of_measure: 'PCS',
    technical_specifications: { efficiency: '99.95% at 0.3 micron', type: 'HEPA H13', dimensions: '610x610x292mm', application: 'Gas turbine inlet' },
    compliance_certifications: ['ISO 9001:2015', 'EN 1822'],
    warranty_info: '18 months manufacturer warranty',
    image_url: '/images/filters/hepa-filter.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FLT-007',
    item_code: 'FLT-WATER-RO-8040',
    item_name: 'PENYARINGAN AIR - RO Membrane 8040',
    item_description: 'Reverse osmosis membrane 8x40 inch, 99.5% salt rejection, 10000 GPD capacity for demineralized water production',
    category_id: 'CAT-FILTERS',
    supplier_id: 'SUP-000003',
    unit_price: 6500000,
    currency: 'IDR',
    stock_quantity: 50,
    lead_time_days: 25,
    unit_of_measure: 'PCS',
    technical_specifications: { size: '8x40 inch', rejection: '99.5%', capacity: '10000 GPD', application: 'DM water production' },
    compliance_certifications: ['ISO 9001:2015', 'NSF Certified'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/filters/ro-membrane.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FLT-008',
    item_code: 'FLT-STEAM-CYC-DN100',
    item_name: 'SARINGAN UAP - Steam Separator Cyclone',
    item_description: 'Cyclone-type steam separator DN100, 98% moisture removal efficiency for superheated steam applications in boilers',
    category_id: 'CAT-FILTERS',
    supplier_id: 'SUP-000009',
    unit_price: 18500000,
    currency: 'IDR',
    stock_quantity: 20,
    lead_time_days: 35,
    unit_of_measure: 'UNIT',
    technical_specifications: { size: 'DN100', efficiency: '98% moisture removal', type: 'Cyclone', material: 'Stainless Steel 316' },
    compliance_certifications: ['ISO 9001:2015', 'PED Certified'],
    warranty_info: '36 months manufacturer warranty',
    image_url: '/images/filters/steam-separator.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-FLT-009',
    item_code: 'FLT-SPARE-MAINT-KIT',
    item_name: 'SPARE PART DAN PERLENGKAPAN FILTER - Maintenance Kit',
    item_description: 'Complete filter maintenance kit with replacement cartridges, seals, O-rings, differential pressure gauges and tools',
    category_id: 'CAT-FILTERS',
    supplier_id: 'SUP-000003',
    unit_price: 3250000,
    currency: 'IDR',
    stock_quantity: 80,
    lead_time_days: 14,
    unit_of_measure: 'KIT',
    technical_specifications: { contents: 'Cartridges, seals, O-rings, DP gauge, tools', applications: 'Universal filter maintenance' },
    compliance_certifications: ['ISO 9001:2015'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/filters/maintenance-kit.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },

  // ========== INSULATION CATEGORY (6 items) ==========
  {
    item_id: 'ITEM-INSL-001',
    item_code: 'INSL-ELEC-OIL-200L',
    item_name: 'ISOLASI LISTRIK CAIR - Transformer Oil 200L',
    item_description: 'High-grade mineral transformer oil 200 liter drum, excellent dielectric properties for power transformers and switchgear',
    category_id: 'CAT-INSULATION',
    supplier_id: 'SUP-000004',
    unit_price: 8500000,
    currency: 'IDR',
    stock_quantity: 40,
    lead_time_days: 14,
    unit_of_measure: 'DRUM',
    technical_specifications: { volume: '200 liters', breakdown_voltage: '>60 kV', dielectric_loss: '<0.05%', application: 'Power transformers' },
    compliance_certifications: ['IEC 60296', 'ISO 9001:2015'],
    warranty_info: '36 months shelf life',
    image_url: '/images/insulation/transformer-oil.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-INSL-002',
    item_code: 'INSL-ELEC-SF6-40KG',
    item_name: 'ISOLASI LISTRIK GAS - SF6 Gas 40kg Cylinder',
    item_description: 'Sulfur hexafluoride (SF6) gas 40kg cylinder, 99.995% purity for high-voltage switchgear and circuit breakers',
    category_id: 'CAT-INSULATION',
    supplier_id: 'SUP-000004',
    unit_price: 45000000,
    currency: 'IDR',
    stock_quantity: 15,
    lead_time_days: 30,
    unit_of_measure: 'CYL',
    technical_specifications: { weight: '40 kg', purity: '99.995%', application: 'High-voltage switchgear', dielectric_strength: 'Superior' },
    compliance_certifications: ['IEC 60376', 'ISO 9001:2015'],
    warranty_info: '60 months shelf life',
    image_url: '/images/insulation/sf6-gas.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-INSL-003',
    item_code: 'INSL-ELEC-NOMEX-410',
    item_name: 'ISOLASI LISTRIK PADAT - Nomex Paper 410',
    item_description: 'Nomex 410 aramid paper, 0.25mm thickness, Class C (220°C) high-temperature electrical insulation for motors and transformers',
    category_id: 'CAT-INSULATION',
    supplier_id: 'SUP-000004',
    unit_price: 15750000,
    currency: 'IDR',
    stock_quantity: 60,
    lead_time_days: 21,
    unit_of_measure: 'ROLL',
    technical_specifications: { thickness: '0.25mm', width: '1000mm', length: '100m', temperature_class: '220°C (Class C)' },
    compliance_certifications: ['IEC 60641', 'UL Recognized'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/insulation/nomex-paper.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-INSL-004',
    item_code: 'INSL-THERMAL-CERAMIC-100',
    item_name: 'ISOLASI PANAS - Ceramic Fiber Blanket 100mm',
    item_description: 'Ceramic fiber blanket 100mm thickness, 1260°C maximum temperature rated for boiler, furnace and kiln insulation',
    category_id: 'CAT-INSULATION',
    supplier_id: 'SUP-000004',
    unit_price: 2850000,
    currency: 'IDR',
    stock_quantity: 150,
    lead_time_days: 14,
    unit_of_measure: 'M2',
    technical_specifications: { thickness: '100mm', max_temp: '1260°C', density: '128 kg/m³', thermal_conductivity: 'Low' },
    compliance_certifications: ['ASTM C892', 'ISO 9001:2015'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/insulation/ceramic-fiber.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-INSL-005',
    item_code: 'INSL-ACOUSTIC-FOAM-50',
    item_name: 'ISOLASI SUARA - Acoustic Foam Panel 50mm',
    item_description: 'High-density acoustic foam panel 50mm thickness, NRC 0.85 for noise reduction in power plant control rooms',
    category_id: 'CAT-INSULATION',
    supplier_id: 'SUP-000004',
    unit_price: 185000,
    currency: 'IDR',
    stock_quantity: 500,
    lead_time_days: 7,
    unit_of_measure: 'PCS',
    technical_specifications: { thickness: '50mm', size: '600x600mm', NRC: '0.85', fire_rating: 'Class A' },
    compliance_certifications: ['ASTM E84', 'ISO 9001:2015'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/insulation/acoustic-foam.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-INSL-006',
    item_code: 'INSL-ACC-AL-JACKET',
    item_name: 'PERLENGKAPAN ISOLATOR - Aluminum Jacketing',
    item_description: 'Aluminum jacketing 0.5mm thickness, 1200mm width for exterior insulation protection with corrosion-resistant finish',
    category_id: 'CAT-INSULATION',
    supplier_id: 'SUP-000004',
    unit_price: 3750000,
    currency: 'IDR',
    stock_quantity: 100,
    lead_time_days: 12,
    unit_of_measure: 'ROLL',
    technical_specifications: { thickness: '0.5mm', width: '1200mm', length: '50m', finish: 'Mill finish/Stucco embossed' },
    compliance_certifications: ['ASTM B209', 'ISO 9001:2015'],
    warranty_info: '36 months manufacturer warranty',
    image_url: '/images/insulation/aluminum-jacket.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },

  // ========== VALVES CATEGORY (15 items) ==========
  {
    item_id: 'ITEM-VALV-001',
    item_code: 'VLV-AUTO-RELIEF-DN50',
    item_name: 'AUTOMATIC PROTECTION VALVE - Safety Relief DN50',
    item_description: 'Spring-loaded safety relief valve DN50, adjustable set pressure 1-16 bar for automatic overpressure protection in boilers',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-000005',
    unit_price: 4850000,
    currency: 'IDR',
    stock_quantity: 70,
    lead_time_days: 18,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'DN50', set_pressure: 'Adjustable 1-16 bar', material: 'Carbon steel body, SS internals', connection: 'Flanged' },
    compliance_certifications: ['ASME Section VIII', 'ISO 9001:2015'],
    warranty_info: '36 months manufacturer warranty',
    image_url: '/images/valves/safety-relief.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-VALV-002',
    item_code: 'VLV-BALL-2PC-DN100',
    item_name: 'BALL VALVE 2-Piece DN100 Full Bore',
    item_description: 'Two-piece full bore ball valve DN100, stainless steel 316, PN40 rated with ISO 5211 mounting pad for actuation',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-000005',
    unit_price: 3250000,
    currency: 'IDR',
    stock_quantity: 90,
    lead_time_days: 14,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'DN100', type: '2-piece full bore', material: 'Stainless Steel 316', pressure: 'PN40' },
    compliance_certifications: ['API 6D', 'ISO 5211', 'ISO 9001:2015'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/valves/ball-valve.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-VALV-003',
    item_code: 'VLV-BTF-WAFER-DN200',
    item_name: 'BUTTERFLY VALVE Wafer Type DN200',
    item_description: 'Wafer-type butterfly valve DN200, ductile iron body with EPDM liner, PN16 for water and low-pressure service',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-000005',
    unit_price: 4500000,
    currency: 'IDR',
    stock_quantity: 60,
    lead_time_days: 16,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'DN200', type: 'Wafer', body: 'Ductile iron', liner: 'EPDM', pressure: 'PN16' },
    compliance_certifications: ['API 609', 'ISO 5752', 'ISO 9001:2015'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/valves/butterfly-valve.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-VALV-004',
    item_code: 'VLV-CHECK-SWING-DN80',
    item_name: 'CHECK VALVE Swing Type DN80',
    item_description: 'Swing check valve DN80, bronze body, PN25 rated, horizontal installation for preventing backflow in piping systems',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-000005',
    unit_price: 1850000,
    currency: 'IDR',
    stock_quantity: 120,
    lead_time_days: 12,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'DN80', type: 'Swing check', material: 'Bronze', pressure: 'PN25' },
    compliance_certifications: ['API 6D', 'ISO 9001:2015'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/valves/check-valve.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-VALV-005',
    item_code: 'VLV-DIAPHRAGM-DN50',
    item_name: 'DIAPHRAGMA/BELLOW VALVE DN50',
    item_description: 'Diaphragm valve DN50, PTFE-lined cast iron body for corrosive chemical service with manual handwheel operation',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-000005',
    unit_price: 5250000,
    currency: 'IDR',
    stock_quantity: 45,
    lead_time_days: 20,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'DN50', type: 'Diaphragm', lining: 'PTFE', material: 'Cast iron body', operation: 'Manual' },
    compliance_certifications: ['ISO 9001:2015', 'DIN 28458'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/valves/diaphragm-valve.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-VALV-006',
    item_code: 'VLV-FLOAT-DN25',
    item_name: 'FLOAT VALVE DN25',
    item_description: 'Float valve DN25, brass body with stainless steel float, PN16 for automatic water level control in storage tanks',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-000005',
    unit_price: 975000,
    currency: 'IDR',
    stock_quantity: 150,
    lead_time_days: 10,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'DN25', material: 'Brass body, SS float', type: 'Automatic float', pressure: 'PN16' },
    compliance_certifications: ['ISO 9001:2015'],
    warranty_info: '18 months manufacturer warranty',
    image_url: '/images/valves/float-valve.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-VALV-007',
    item_code: 'VLV-GATE-RS-DN150',
    item_name: 'GATE VALVE Rising Stem DN150',
    item_description: 'Rising stem gate valve DN150, cast steel body, bolted bonnet, PN40 for high-pressure steam and water applications',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-000005',
    unit_price: 8750000,
    currency: 'IDR',
    stock_quantity: 40,
    lead_time_days: 25,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'DN150', type: 'Rising stem', material: 'Cast steel', pressure: 'PN40', ends: 'Flanged RF' },
    compliance_certifications: ['API 600', 'ISO 9001:2015'],
    warranty_info: '36 months manufacturer warranty',
    image_url: '/images/valves/gate-valve.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-VALV-008',
    item_code: 'VLV-GLOBE-Y-DN50',
    item_name: 'GLOBE VALVE Y-Pattern DN50',
    item_description: 'Y-pattern globe valve DN50, carbon steel body with stainless steel 316 trim for throttling and flow control',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-000005',
    unit_price: 4250000,
    currency: 'IDR',
    stock_quantity: 80,
    lead_time_days: 16,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'DN50', pattern: 'Y-type', trim: 'SS 316', body: 'Carbon steel', pressure: 'PN40' },
    compliance_certifications: ['API 623', 'ISO 9001:2015'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/valves/globe-valve.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-VALV-009',
    item_code: 'VLV-3WAY-DN40',
    item_name: 'MULTI DIRECTION VALVE - 3-Way DN40',
    item_description: 'Three-way ball valve DN40, L-port configuration, stainless steel 316 for diverting or mixing flow in process systems',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-000005',
    unit_price: 4750000,
    currency: 'IDR',
    stock_quantity: 65,
    lead_time_days: 18,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'DN40', ports: '3-way L-port', material: 'Stainless Steel 316', pressure: 'PN40' },
    compliance_certifications: ['ISO 5211', 'ISO 9001:2015'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/valves/3-way-valve.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-VALV-010',
    item_code: 'VLV-NEEDLE-SS-15MM',
    item_name: 'NEEDLE VALVE Stainless Steel 15mm',
    item_description: 'Needle valve 15mm (1/2 inch), stainless steel 316, 6000 psi rated for precise flow control in instrument lines',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-000005',
    unit_price: 975000,
    currency: 'IDR',
    stock_quantity: 200,
    lead_time_days: 10,
    unit_of_measure: 'PCS',
    technical_specifications: { size: '15mm (1/2")', material: 'Stainless Steel 316', pressure: '6000 psi', connection: 'NPT threaded' },
    compliance_certifications: ['ISO 9001:2015'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/valves/needle-valve.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-VALV-011',
    item_code: 'VLV-PISTON-PN-DN65',
    item_name: 'PISTON VALVE Pneumatic DN65',
    item_description: 'Pneumatic piston valve DN65 with rack and pinion actuator, PN40, stainless steel 316 for automated on-off control',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-000009',
    unit_price: 12500000,
    currency: 'IDR',
    stock_quantity: 35,
    lead_time_days: 28,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'DN65', actuation: 'Pneumatic rack-pinion', body: 'Stainless Steel 316', pressure: 'PN40' },
    compliance_certifications: ['ISO 5211', 'ISO 9001:2015'],
    warranty_info: '36 months manufacturer warranty',
    image_url: '/images/valves/piston-valve.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-VALV-012',
    item_code: 'VLV-MOV-DN100',
    item_name: 'POWER OPERATED VALVE - Motor Operated DN100',
    item_description: 'Motor-operated gate valve DN100 with electric actuator 380V 3-phase, 4-20mA control signal for remote operation',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-000009',
    unit_price: 28500000,
    currency: 'IDR',
    stock_quantity: 25,
    lead_time_days: 35,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'DN100', actuation: 'Electric motor 380V', body: 'Cast steel', control: '4-20mA signal' },
    compliance_certifications: ['API 600', 'IEC 60034', 'ISO 9001:2015'],
    warranty_info: '36 months manufacturer warranty',
    image_url: '/images/valves/motor-operated.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-VALV-013',
    item_code: 'VLV-SPARE-SEAL-KIT',
    item_name: 'SPARE PART VALVE - Universal Seal and Seat Kit',
    item_description: 'Universal valve spare parts kit including seats, seals, gaskets, O-rings and packing for valve maintenance',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-000005',
    unit_price: 4250000,
    currency: 'IDR',
    stock_quantity: 100,
    lead_time_days: 14,
    unit_of_measure: 'KIT',
    technical_specifications: { contents: 'Seats, seals, gaskets, O-rings, packing', materials: 'PTFE, Viton, EPDM, Graphite', applications: 'Universal valve types' },
    compliance_certifications: ['ISO 9001:2015'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/valves/spare-parts.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-VALV-014',
    item_code: 'VLV-SPRING-RELIEF-DN32',
    item_name: 'SPRING VALVE DN32 Pressure Relief',
    item_description: 'Spring-loaded pressure relief valve DN32, adjustable set pressure 1-10 bar for system overpressure protection',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-000009',
    unit_price: 2450000,
    currency: 'IDR',
    stock_quantity: 110,
    lead_time_days: 14,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'DN32', set_pressure: '1-10 bar adjustable', material: 'Bronze body, SS spring', connection: 'Threaded BSP' },
    compliance_certifications: ['ASME Section VIII', 'ISO 9001:2015'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/valves/spring-relief.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    item_id: 'ITEM-VALV-015',
    item_code: 'VLV-TRAP-FLOAT-DN25',
    item_name: 'TRAP - Float Steam Trap DN25',
    item_description: 'Mechanical float-type steam trap DN25, cast iron body with stainless steel internals for continuous condensate discharge',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-000009',
    unit_price: 2450000,
    currency: 'IDR',
    stock_quantity: 100,
    lead_time_days: 14,
    unit_of_measure: 'PCS',
    technical_specifications: { size: 'DN25', type: 'Float steam trap', body: 'Cast iron', internals: 'Stainless steel', max_pressure: '21 bar', max_temp: '220°C' },
    compliance_certifications: ['ISO 9001:2015', 'PED Certified'],
    warranty_info: '24 months manufacturer warranty',
    image_url: '/images/valves/steam-trap.jpg',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

// ============================================================================
// SHOPPING CART (User-specific)
// ============================================================================

export const mockCartItems: MarketplaceCartItem[] = [
  {
    cart_item_id: 1,
    user_id: 'USR-001',
    item_id: 'ITEM-FLT-BBK-001',
    quantity: 10,
    unit_price: 1250000,
    total_price: 12500000,
    notes: 'For Unit 1-5 generators',
    added_at: '2025-11-05T10:00:00Z',
    updated_at: '2025-11-05T10:00:00Z'
  },
  {
    cart_item_id: 2,
    user_id: 'USR-001',
    item_id: 'ITEM-SPR-FLT-001',
    quantity: 50,
    unit_price: 350000,
    total_price: 17500000,
    notes: 'Spare cartridges',
    added_at: '2025-11-05T10:15:00Z',
    updated_at: '2025-11-05T10:15:00Z'
  }
];

// ============================================================================
// PURCHASE REQUISITIONS
// ============================================================================

export const mockPRHeaders: MarketplacePRHeader[] = [
  {
    pr_id: 1,
    pr_number: 'PR-2025110001',
    pr_date: '2025-11-01T08:30:00Z',
    requestor_id: 'USR-001',
    requestor_name: 'Ir. Bambang Sutrisno',
    department: 'Maintenance Department',
    delivery_facility_id: 'FAC-PLN-001',
    total_value: 50000000,
    currency: 'IDR',
    pr_status: 'Approved',
    notes: 'Urgent requirement for fuel filter replacement - scheduled maintenance',
    created_at: '2025-11-01T08:30:00Z',
    updated_at: '2025-11-02T10:00:00Z'
  },
  {
    pr_id: 2,
    pr_number: 'PR-2025110002',
    pr_date: '2025-11-02T09:15:00Z',
    requestor_id: 'USR-002',
    requestor_name: 'Ir. Hadi Purnomo',
    department: 'Operations Department',
    delivery_facility_id: 'FAC-PLN-002',
    total_value: 75000000,
    currency: 'IDR',
    pr_status: 'Approved',
    notes: 'Quarterly maintenance stock replenishment',
    created_at: '2025-11-02T09:15:00Z',
    updated_at: '2025-11-03T14:00:00Z'
  },
  {
    pr_id: 3,
    pr_number: 'PR-2025110003',
    pr_date: '2025-11-03T10:45:00Z',
    requestor_id: 'USR-003',
    requestor_name: 'Ir. Siti Aminah, MT',
    department: 'Technical Services',
    delivery_facility_id: 'FAC-PLN-003',
    total_value: 120000000,
    currency: 'IDR',
    pr_status: 'Approved',
    notes: 'Gas turbine air intake filter replacement project',
    created_at: '2025-11-03T10:45:00Z',
    updated_at: '2025-11-04T09:00:00Z'
  },
  {
    pr_id: 4,
    pr_number: 'PR-2025110004',
    pr_date: '2025-11-04T11:20:00Z',
    requestor_id: 'USR-004',
    requestor_name: 'Drs. Ahmad Rahman',
    department: 'Procurement Department',
    delivery_facility_id: 'FAC-PLN-001',
    total_value: 25000000,
    currency: 'IDR',
    pr_status: 'Pending Approval',
    notes: 'Emergency procurement for fuel system upgrade',
    created_at: '2025-11-04T11:20:00Z',
    updated_at: '2025-11-04T11:20:00Z'
  },
  {
    pr_id: 5,
    pr_number: 'PR-2025110005',
    pr_date: '2025-11-05T08:00:00Z',
    requestor_id: 'USR-005',
    requestor_name: 'Ir. Eko Prasetyo, MSc',
    department: 'Water Treatment',
    delivery_facility_id: 'FAC-PLN-003',
    total_value: 180000000,
    currency: 'IDR',
    pr_status: 'Approved',
    notes: 'DM water plant filter renewal',
    created_at: '2025-11-05T08:00:00Z',
    updated_at: '2025-11-05T16:00:00Z'
  },
  {
    pr_id: 6,
    pr_number: 'PR-2025110006',
    pr_date: '2025-11-05T14:30:00Z',
    requestor_id: 'USR-001',
    requestor_name: 'Ir. Bambang Sutrisno',
    department: 'Maintenance Department',
    delivery_facility_id: 'FAC-PLN-001',
    total_value: 35000000,
    currency: 'IDR',
    pr_status: 'Pending Approval',
    notes: 'Planning for next month maintenance - pending budget approval',
    created_at: '2025-11-05T14:30:00Z',
    updated_at: '2025-11-05T14:30:00Z'
  },
  {
    pr_id: 7,
    pr_number: 'PR-2025110007',
    pr_date: '2025-10-28T09:00:00Z',
    requestor_id: 'USR-002',
    requestor_name: 'Siti Nurhaliza',
    department: 'PLTU Labuan',
    delivery_facility_id: 'FAC-PLN-002',
    total_value: 95000000,
    currency: 'IDR',
    pr_status: 'Pending Approval',
    notes: 'Boiler maintenance parts - awaiting manager approval',
    created_at: '2025-10-28T09:00:00Z',
    updated_at: '2025-10-28T09:00:00Z'
  },
  {
    pr_id: 8,
    pr_number: 'PR-2025110008',
    pr_date: '2025-10-26T11:30:00Z',
    requestor_id: 'USR-003',
    requestor_name: 'Ahmad Hidayat',
    department: 'PLTA Saguling',
    delivery_facility_id: 'FAC-PLN-004',
    total_value: 155000000,
    currency: 'IDR',
    pr_status: 'Requested Revision',
    notes: 'Hydro turbine components - specification clarification needed',
    created_at: '2025-10-26T11:30:00Z',
    updated_at: '2025-10-27T14:00:00Z'
  },
  {
    pr_id: 9,
    pr_number: 'PR-2025110009',
    pr_date: '2025-10-25T14:00:00Z',
    requestor_id: 'USR-004',
    requestor_name: 'Dewi Kartika',
    department: 'PLTU Lontar',
    delivery_facility_id: 'FAC-PLN-003',
    total_value: 275000000,
    currency: 'IDR',
    pr_status: 'Approved',
    notes: 'Gas turbine overhaul kit - vendor evaluation in progress',
    created_at: '2025-10-25T14:00:00Z',
    updated_at: '2025-10-30T10:00:00Z'
  },
  {
    pr_id: 10,
    pr_number: 'PR-2025110010',
    pr_date: '2025-10-22T10:15:00Z',
    requestor_id: 'USR-005',
    requestor_name: 'Rudi Hartono',
    department: 'PLTA Cirata',
    delivery_facility_id: 'FAC-PLN-005',
    total_value: 420000000,
    currency: 'IDR',
    pr_status: 'Rejected',
    notes: 'Rejected - Budget exceeded for this quarter',
    created_at: '2025-10-22T10:15:00Z',
    updated_at: '2025-10-24T16:00:00Z'
  },
  {
    pr_id: 11,
    pr_number: 'PR-2025110011',
    pr_date: '2025-10-20T13:45:00Z',
    requestor_id: 'USR-006',
    requestor_name: 'Linda Wijaya',
    department: 'PLTU Suralaya',
    delivery_facility_id: 'FAC-PLN-001',
    total_value: 185000000,
    currency: 'IDR',
    pr_status: 'Approved',
    notes: 'Cooling system upgrade - all approvals received',
    created_at: '2025-10-20T13:45:00Z',
    updated_at: '2025-10-23T11:00:00Z'
  },
  {
    pr_id: 12,
    pr_number: 'PR-2025110012',
    pr_date: '2025-10-18T08:30:00Z',
    requestor_id: 'USR-007',
    requestor_name: 'Hendra Gunawan',
    department: 'Kantor Pusat Jakarta',
    delivery_facility_id: 'FAC-PLN-006',
    total_value: 65000000,
    currency: 'IDR',
    pr_status: 'Pending Approval',
    notes: 'IT infrastructure upgrade - pending director approval',
    created_at: '2025-10-18T08:30:00Z',
    updated_at: '2025-10-18T08:30:00Z'
  },
  {
    pr_id: 13,
    pr_number: 'PR-2025110013',
    pr_date: '2025-10-15T16:00:00Z',
    requestor_id: 'USR-008',
    requestor_name: 'Rina Susanti',
    department: 'PLTU Banten 3 Lontar',
    delivery_facility_id: 'FAC-PLN-003',
    total_value: 115000000,
    currency: 'IDR',
    pr_status: 'Approved',
    notes: 'Control system upgrade - contract negotiation phase',
    created_at: '2025-10-15T16:00:00Z',
    updated_at: '2025-10-19T09:30:00Z'
  }
];

// ============================================================================
// PURCHASE ORDERS
// ============================================================================

export const mockOrders: MarketplaceOrder[] = [
  {
    order_id: 1,
    po_number: 'PO-2025110001',
    pr_id: 1,
    supplier_id: 'SUP-000001',
    delivery_facility_id: 'FAC-PLN-001',
    total_value: 50000000,
    currency: 'IDR',
    current_status: 'ARRIVED_AT_DESTINATION',
    current_step: 5,
    order_placed_date: '2025-11-01T10:00:00Z',
    processing_date: '2025-11-01T14:00:00Z',
    shipped_date: '2025-11-02T08:00:00Z',
    delivery_date: '2025-11-03T09:00:00Z',
    arrived_date: '2025-11-03T15:30:00Z',
    tracking_number: 'TRK-DNL-20251101-001',
    carrier: 'JNE Trucking',
    expected_delivery_date: '2025-11-04T12:00:00Z',
    is_delayed: false,
    notes: 'Delivered on time, all items received in good condition',
    created_at: '2025-11-01T10:00:00Z',
    updated_at: '2025-11-03T15:30:00Z'
  },
  {
    order_id: 2,
    po_number: 'PO-2025110002',
    pr_id: 2,
    supplier_id: 'SUP-000002',
    delivery_facility_id: 'FAC-PLN-002',
    total_value: 75000000,
    currency: 'IDR',
    current_status: 'DELIVERY',
    current_step: 4,
    order_placed_date: '2025-11-02T11:00:00Z',
    processing_date: '2025-11-02T16:00:00Z',
    shipped_date: '2025-11-04T07:00:00Z',
    delivery_date: '2025-11-05T10:00:00Z',
    tracking_number: 'TRK-PKR-20251102-002',
    carrier: 'TIKI Cargo',
    expected_delivery_date: '2025-11-06T12:00:00Z',
    is_delayed: false,
    notes: 'Currently in transit from Bekasi to Probolinggo',
    created_at: '2025-11-02T11:00:00Z',
    updated_at: '2025-11-05T10:00:00Z'
  },
  {
    order_id: 3,
    po_number: 'PO-2025110003',
    pr_id: 3,
    supplier_id: 'SUP-000003',
    delivery_facility_id: 'FAC-PLN-003',
    total_value: 120000000,
    currency: 'IDR',
    current_status: 'PROCESSING_ORDER',
    current_step: 2,
    order_placed_date: '2025-11-04T09:00:00Z',
    processing_date: '2025-11-04T15:00:00Z',
    tracking_number: 'TRK-CAM-20251104-003',
    carrier: 'Pandu Logistics',
    expected_delivery_date: '2025-11-18T12:00:00Z',
    is_delayed: false,
    notes: 'Custom HEPA filters being manufactured, 14 day lead time',
    created_at: '2025-11-04T09:00:00Z',
    updated_at: '2025-11-04T15:00:00Z'
  },
  {
    order_id: 4,
    po_number: 'PO-2025110005',
    pr_id: 5,
    supplier_id: 'SUP-000001',
    delivery_facility_id: 'FAC-PLN-003',
    total_value: 180000000,
    currency: 'IDR',
    current_status: 'SHIPPED',
    current_step: 3,
    order_placed_date: '2025-11-05T10:00:00Z',
    processing_date: '2025-11-05T14:00:00Z',
    shipped_date: '2025-11-06T08:00:00Z',
    tracking_number: 'TRK-PEN-20251105-005',
    carrier: 'Indah Cargo',
    expected_delivery_date: '2025-11-08T12:00:00Z',
    is_delayed: false,
    notes: 'Large equipment shipment - multimedia filter vessel',
    created_at: '2025-11-05T10:00:00Z',
    updated_at: '2025-11-06T08:00:00Z'
  },
  {
    order_id: 5,
    po_number: 'PO-2025110006',
    pr_id: 6,
    supplier_id: 'SUP-000004',
    delivery_facility_id: 'FAC-PLN-004',
    total_value: 95000000,
    currency: 'IDR',
    current_status: 'ORDER_PLACED',
    current_step: 1,
    order_placed_date: '2025-11-06T13:00:00Z',
    tracking_number: 'TRK-BGO-20251106-006',
    carrier: 'Pos Indonesia Cargo',
    expected_delivery_date: '2025-11-12T12:00:00Z',
    is_delayed: false,
    notes: 'New order placed for electrical control panels',
    created_at: '2025-11-06T13:00:00Z',
    updated_at: '2025-11-06T13:00:00Z'
  },
  {
    order_id: 6,
    po_number: 'PO-2025110007',
    pr_id: 7,
    supplier_id: 'SUP-000005',
    delivery_facility_id: 'FAC-PLN-005',
    total_value: 210000000,
    currency: 'IDR',
    current_status: 'PROCESSING_ORDER',
    current_step: 2,
    order_placed_date: '2025-11-03T08:00:00Z',
    processing_date: '2025-11-03T14:00:00Z',
    tracking_number: 'TRK-BDG-20251103-007',
    carrier: 'JNE Trucking',
    expected_delivery_date: '2025-11-15T12:00:00Z',
    is_delayed: false,
    notes: 'Industrial UPS systems being configured and tested',
    created_at: '2025-11-03T08:00:00Z',
    updated_at: '2025-11-03T14:00:00Z'
  },
  {
    order_id: 7,
    po_number: 'PO-2025110008',
    pr_id: 8,
    supplier_id: 'SUP-000002',
    delivery_facility_id: 'FAC-PLN-001',
    total_value: 85000000,
    currency: 'IDR',
    current_status: 'SHIPPED',
    current_step: 3,
    order_placed_date: '2025-11-04T11:00:00Z',
    processing_date: '2025-11-04T16:00:00Z',
    shipped_date: '2025-11-05T09:00:00Z',
    tracking_number: 'TRK-JKT-20251104-008',
    carrier: 'TIKI Cargo',
    expected_delivery_date: '2025-11-08T12:00:00Z',
    is_delayed: false,
    notes: 'Safety equipment shipment en route to Cilegon',
    created_at: '2025-11-04T11:00:00Z',
    updated_at: '2025-11-05T09:00:00Z'
  },
  {
    order_id: 8,
    po_number: 'PO-2025110009',
    pr_id: 9,
    supplier_id: 'SUP-000003',
    delivery_facility_id: 'FAC-PLN-006',
    total_value: 145000000,
    currency: 'IDR',
    current_status: 'DELIVERY',
    current_step: 4,
    order_placed_date: '2025-10-28T10:00:00Z',
    processing_date: '2025-10-28T15:00:00Z',
    shipped_date: '2025-10-30T08:00:00Z',
    delivery_date: '2025-11-06T11:00:00Z',
    tracking_number: 'TRK-SRY-20251028-009',
    carrier: 'Indah Cargo',
    expected_delivery_date: '2025-11-07T12:00:00Z',
    is_delayed: false,
    notes: 'Cooling tower components currently being delivered',
    created_at: '2025-10-28T10:00:00Z',
    updated_at: '2025-11-06T11:00:00Z'
  },
  {
    order_id: 9,
    po_number: 'PO-2025110010',
    pr_id: 10,
    supplier_id: 'SUP-000001',
    delivery_facility_id: 'FAC-PLN-007',
    total_value: 165000000,
    currency: 'IDR',
    current_status: 'ARRIVED_AT_DESTINATION',
    current_step: 5,
    order_placed_date: '2025-10-25T09:00:00Z',
    processing_date: '2025-10-25T14:00:00Z',
    shipped_date: '2025-10-27T08:00:00Z',
    delivery_date: '2025-10-30T10:00:00Z',
    arrived_date: '2025-10-30T16:00:00Z',
    tracking_number: 'TRK-MDN-20251025-010',
    carrier: 'Pandu Logistics',
    expected_delivery_date: '2025-10-30T12:00:00Z',
    is_delayed: false,
    notes: 'Transformer components delivered and inspected successfully',
    created_at: '2025-10-25T09:00:00Z',
    updated_at: '2025-10-30T16:00:00Z'
  },
  {
    order_id: 10,
    po_number: 'PO-2025110011',
    pr_id: 11,
    supplier_id: 'SUP-000004',
    delivery_facility_id: 'FAC-PLN-008',
    total_value: 78000000,
    currency: 'IDR',
    current_status: 'ORDER_PLACED',
    current_step: 1,
    order_placed_date: '2025-11-07T10:00:00Z',
    tracking_number: 'TRK-SMD-20251107-011',
    carrier: 'JNE Trucking',
    expected_delivery_date: '2025-11-13T12:00:00Z',
    is_delayed: false,
    notes: 'Chemical treatment supplies order confirmed',
    created_at: '2025-11-07T10:00:00Z',
    updated_at: '2025-11-07T10:00:00Z'
  },
  {
    order_id: 11,
    po_number: 'PO-2025110012',
    pr_id: 12,
    supplier_id: 'SUP-000005',
    delivery_facility_id: 'FAC-PLN-002',
    total_value: 195000000,
    currency: 'IDR',
    current_status: 'PROCESSING_ORDER',
    current_step: 2,
    order_placed_date: '2025-11-01T14:00:00Z',
    processing_date: '2025-11-02T09:00:00Z',
    tracking_number: 'TRK-PKL-20251101-012',
    carrier: 'TIKI Cargo',
    expected_delivery_date: '2025-11-16T12:00:00Z',
    is_delayed: false,
    notes: 'Turbine spare parts undergoing quality inspection',
    created_at: '2025-11-01T14:00:00Z',
    updated_at: '2025-11-02T09:00:00Z'
  },
  {
    order_id: 12,
    po_number: 'PO-2025110013',
    pr_id: 13,
    supplier_id: 'SUP-000002',
    delivery_facility_id: 'FAC-PLN-009',
    total_value: 112000000,
    currency: 'IDR',
    current_status: 'SHIPPED',
    current_step: 3,
    order_placed_date: '2025-10-30T11:00:00Z',
    processing_date: '2025-10-30T16:00:00Z',
    shipped_date: '2025-11-02T08:00:00Z',
    tracking_number: 'TRK-BKS-20251030-013',
    carrier: 'Pos Indonesia Cargo',
    expected_delivery_date: '2025-11-09T12:00:00Z',
    is_delayed: false,
    notes: 'Monitoring equipment shipped from Bekasi warehouse',
    created_at: '2025-10-30T11:00:00Z',
    updated_at: '2025-11-02T08:00:00Z'
  }
];

// ============================================================================
// SUMMARY STATISTICS
// ============================================================================

export const mockPRStatusSummary: PRStatusSummary = {
  total: mockPRHeaders.length,
  pending_approval: mockPRHeaders.filter(pr => pr.pr_status === 'Pending Approval').length,
  approved: mockPRHeaders.filter(pr => pr.pr_status === 'Approved').length,
  rejected: mockPRHeaders.filter(pr => pr.pr_status === 'Rejected').length,
  completed: mockPRHeaders.filter(pr => pr.pr_status === 'Completed').length,
  cancelled: mockPRHeaders.filter(pr => pr.pr_status === 'Cancelled').length
};

export const mockOrderStatusSummary: OrderStatusSummary = {
  total: mockOrders.length,
  order_placed: mockOrders.filter(o => o.current_status === 'ORDER_PLACED').length,
  processing: mockOrders.filter(o => o.current_status === 'PROCESSING_ORDER').length,
  shipped: mockOrders.filter(o => o.current_status === 'SHIPPED').length,
  delivery: mockOrders.filter(o => o.current_status === 'DELIVERY').length,
  arrived: mockOrders.filter(o => o.current_status === 'ARRIVED_AT_DESTINATION').length,
  delayed: mockOrders.filter(o => o.is_delayed).length
};

// Helper function to populate items with category and supplier details
export const getItemsWithDetails = (): MarketplaceItem[] => {
  return mockMarketplaceItems.map(item => ({
    ...item,
    category: mockCategories.find(c => c.category_id === item.category_id),
    supplier: mockSuppliers.find(s => s.supplier_id === item.supplier_id)
  }));
};

// Helper function to populate cart items with item details
export const getCartWithDetails = (userId: string): MarketplaceCartItem[] => {
  return mockCartItems
    .filter(cart => cart.user_id === userId)
    .map(cart => ({
      ...cart,
      item: getItemsWithDetails().find(i => i.item_id === cart.item_id)
    }));
};

// Generate PR lines for a given PR
function generatePRLines(prId: number, prNumber: string) {
  // Get some random items for this PR
  const availableItems = getItemsWithDetails();
  const numLines = Math.floor(Math.random() * 3) + 1; // 1-3 lines per PR
  const lines = [];

  for (let i = 0; i < numLines; i++) {
    const item = availableItems[Math.floor(Math.random() * Math.min(10, availableItems.length))];
    if (item) {
      const quantity = Math.floor(Math.random() * 5) + 1;
      lines.push({
        pr_line_id: prId * 100 + i + 1,
        pr_id: prId,
        line_number: i + 1,
        item_id: item.item_id,
        item: item,
        quantity: quantity,
        unit_price: item.unit_price,
        total_price: quantity * item.unit_price,
        delivery_date: new Date(Date.now() + (item.lead_time_days || 30) * 24 * 60 * 60 * 1000).toISOString(),
        notes: ''
      });
    }
  }

  return lines;
}

// Generate approval workflow for a given PR
function generatePRApprovals(prId: number, prStatus: string) {
  const approvals = [];

  // Level 1: Department Manager
  approvals.push({
    approval_id: prId * 10 + 1,
    pr_id: prId,
    approval_level: 1,
    approver_id: 'approver-bs',
    approver_name: 'Budi Santoso',
    approver_role: 'Department Manager',
    approval_status: ['Pending Approval', 'Draft'].includes(prStatus) ? 'Pending' : 'Approved',
    action_date: ['Pending Approval', 'Draft'].includes(prStatus) ? null : new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    comments: ['Pending Approval', 'Draft'].includes(prStatus) ? null : 'Approved. All items are necessary for scheduled maintenance.',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  });

  // Level 2: Procurement Manager
  approvals.push({
    approval_id: prId * 10 + 2,
    pr_id: prId,
    approval_level: 2,
    approver_id: 'approver-rk',
    approver_name: 'Rina Kartika',
    approver_role: 'Procurement Manager',
    approval_status: ['Approved', 'In Procurement'].includes(prStatus) ? 'Approved' : 'Pending',
    action_date: ['Approved', 'In Procurement'].includes(prStatus) ? new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() : null,
    comments: ['Approved', 'In Procurement'].includes(prStatus) ? 'Budget verified. Proceeding with procurement process.' : null,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  });

  // Level 3: Finance Director
  approvals.push({
    approval_id: prId * 10 + 3,
    pr_id: prId,
    approval_level: 3,
    approver_id: 'approver-hg',
    approver_name: 'Hendra Gunawan',
    approver_role: 'Finance Director',
    approval_status: ['In Procurement'].includes(prStatus) ? 'Approved' : 'Pending',
    action_date: ['In Procurement'].includes(prStatus) ? new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() : null,
    comments: ['In Procurement'].includes(prStatus) ? 'Financial approval granted. Proceed with vendor selection.' : null,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  });

  return approvals;
}

// Helper function to populate PRs with facility details, lines, and approvals
export const getPRsWithDetails = (userId?: string) => {
  // Combine predefined mock PRs with locally created PRs
  let allPRs = [...mockPRHeaders, ...localPRStorage];

  // For demo purposes, show all PRs regardless of user ID
  // In production, you would filter by userId
  // if (userId) {
  //   allPRs = allPRs.filter(pr => pr.requestor_id === userId);
  // }

  return allPRs.map(pr => {
    // Get delivery facility
    const delivery_facility = mockPLNFacilities.find(f => f.facility_id === pr.delivery_facility_id);

    // Generate PR lines with item details
    const lines = generatePRLines(pr.pr_id, pr.pr_number);

    // Generate approval workflow
    const approvals = generatePRApprovals(pr.pr_id, pr.pr_status);

    return {
      ...pr,
      delivery_facility,
      lines,
      approvals
    };
  });
};

// Helper function to populate orders with details
export const getOrdersWithDetails = () => {
  return mockOrders.map(order => ({
    ...order,
    supplier: mockSuppliers.find(s => s.supplier_id === order.supplier_id),
    delivery_facility: mockPLNFacilities.find(f => f.facility_id === order.delivery_facility_id)
  }));
};

export default {
  mockCategories,
  mockSuppliers,
  mockPLNFacilities,
  mockMarketplaceItems,
  mockCartItems,
  mockPRHeaders,
  mockOrders,
  mockPRStatusSummary,
  mockOrderStatusSummary,
  getItemsWithDetails,
  getCartWithDetails,
  getPRsWithDetails,
  getOrdersWithDetails
};

// ============================================================================
// EXPANDED MARKETPLACE ITEMS - Comprehensive Power Plant Supplies
// ============================================================================

export const expandedMarketplaceItems: MarketplaceItem[] = [
  // Additional BALL BEARING items
  {
    item_id: 'ITM-BEAR-BALL-001',
    item_code: 'BRG-BALL-6310-2RS',
    item_name: 'BALL BEARING Deep Groove 6310-2RS',
    description: 'Deep groove ball bearing 6310-2RS, double sealed. Chrome steel construction. 50mm bore x 110mm OD x 27mm width. For electric motors, pumps, and industrial equipment. SKF equivalent quality.',
    category_id: 'CAT-BEARINGS',
    supplier_id: 'SUP-FILTER-02',
    unit_of_measure: 'pieces',
    unit_price: 165000,
    minimum_order_quantity: 10,
    stock_quantity: 500,
    lead_time_days: 7,
    warranty_months: 24,
    specifications: {
      bearing_type: 'Deep Groove Ball Bearing',
      designation: '6310-2RS',
      bore_diameter: '50mm',
      outer_diameter: '110mm',
      width: '27mm',
      seal_type: 'Double rubber seal',
      dynamic_load_rating: '61.8 kN',
      static_load_rating: '41.5 kN',
      applications: 'Motors, pumps, fans, general industrial'
    },
    images: ['/images/products/bearing-ball-6310.jpg'],
    is_active: true,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z'
  },

  // CHECK VALVE
  {
    item_id: 'ITM-VALV-CHECK-001',
    item_code: 'VLV-CHECK-SWING-DN80',
    item_name: 'CHECK VALVE Swing Type DN80',
    description: 'Swing check valve DN80 (3 inch). Cast iron body with bronze disc. Prevents backflow. PN16 rating. Flanged connections. For water and low-pressure steam applications.',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-FILTER-03',
    unit_of_measure: 'pieces',
    unit_price: 1850000,
    minimum_order_quantity: 2,
    stock_quantity: 80,
    lead_time_days: 14,
    warranty_months: 24,
    specifications: {
      valve_type: 'Swing check valve',
      size: 'DN80 (3 inch)',
      body_material: 'Cast iron GG25',
      disc_material: 'Bronze',
      pressure_rating: 'PN16',
      connection: 'Flanged ANSI 125',
      applications: 'Water systems, steam, pumps'
    },
    images: ['/images/products/check-valve-swing.jpg'],
    is_active: true,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z'
  },

  // GATE VALVE
  {
    item_id: 'ITM-VALV-GATE-001',
    item_code: 'VLV-GATE-RS-DN150',
    item_name: 'GATE VALVE Rising Stem DN150',
    description: 'Rising stem gate valve DN150 (6 inch). Cast steel body. Bolted bonnet. Handwheel operated. PN25 rating. For on-off service in steam, water, and oil applications.',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-FILTER-03',
    unit_of_measure: 'pieces',
    unit_price: 8750000,
    minimum_order_quantity: 1,
    stock_quantity: 40,
    lead_time_days: 21,
    warranty_months: 36,
    specifications: {
      valve_type: 'Gate valve, rising stem',
      size: 'DN150 (6 inch)',
      body_material: 'Cast steel WCB',
      trim_material: 'Stainless steel 13Cr',
      pressure_rating: 'PN25',
      connection: 'Flanged ANSI 150',
      operator: 'Handwheel',
      applications: 'Steam, water, oil systems'
    },
    images: ['/images/products/gate-valve-rising.jpg'],
    is_active: true,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z'
  },

  // GLOBE VALVE
  {
    item_id: 'ITM-VALV-GLOBE-001',
    item_code: 'VLV-GLOBE-Y-DN50',
    item_name: 'GLOBE VALVE Y-Pattern DN50',
    description: 'Y-pattern globe valve DN50 (2 inch). Stainless steel 316 body. PTFE packing. Suitable for throttling and on-off service. PN40 rating. For high-pressure steam and thermal oil.',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-FILTER-03',
    unit_of_measure: 'pieces',
    unit_price: 4250000,
    minimum_order_quantity: 2,
    stock_quantity: 60,
    lead_time_days: 18,
    warranty_months: 24,
    specifications: {
      valve_type: 'Globe valve, Y-pattern',
      size: 'DN50 (2 inch)',
      body_material: 'Stainless steel 316',
      disc_material: 'Stainless steel 316',
      pressure_rating: 'PN40',
      connection: 'Flanged',
      temperature_range: '-20°C to +350°C',
      applications: 'Steam, thermal oil, throttling service'
    },
    images: ['/images/products/globe-valve-y.jpg'],
    is_active: true,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z'
  },

  // NEEDLE VALVE
  {
    item_id: 'ITM-VALV-NEEDLE-001',
    item_code: 'VLV-NEEDLE-SS-15MM',
    item_name: 'NEEDLE VALVE Stainless Steel 15mm',
    description: 'Precision needle valve 15mm (1/2 inch). Stainless steel 316 construction. Fine flow control. 6000 psi rating. For instrument and sampling lines. NPT threaded connections.',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-FILTER-03',
    unit_of_measure: 'pieces',
    unit_price: 975000,
    minimum_order_quantity: 5,
    stock_quantity: 150,
    lead_time_days: 10,
    warranty_months: 24,
    specifications: {
      valve_type: 'Needle valve',
      size: '15mm (1/2 inch)',
      body_material: 'Stainless steel 316',
      pressure_rating: '6000 psi (414 bar)',
      connection: '1/2 inch NPT',
      stem_type: 'Non-rotating',
      applications: 'Instrument lines, sampling, flow control'
    },
    images: ['/images/products/needle-valve.jpg'],
    is_active: true,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z'
  },

  // STEAM TRAP
  {
    item_id: 'ITM-VALV-TRAP-001',
    item_code: 'VLV-TRAP-FLT-DN25',
    item_name: 'TRAP - Float Steam Trap DN25',
    description: 'Mechanical float-type steam trap DN25 (1 inch). Cast iron body with stainless steel internals. Continuous condensate discharge. For process heating and steam tracing applications.',
    category_id: 'CAT-VALVES',
    supplier_id: 'SUP-FILTER-03',
    unit_of_measure: 'pieces',
    unit_price: 2450000,
    minimum_order_quantity: 5,
    stock_quantity: 100,
    lead_time_days: 14,
    warranty_months: 24,
    specifications: {
      trap_type: 'Float steam trap',
      size: 'DN25 (1 inch)',
      body_material: 'Cast iron',
      internals: 'Stainless steel',
      max_pressure: '21 bar',
      max_temperature: '220°C',
      connection: 'Screwed BSP',
      applications: 'Process heating, steam tracing, heat exchangers'
    },
    images: ['/images/products/steam-trap-float.jpg'],
    is_active: true,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z'
  }
];

