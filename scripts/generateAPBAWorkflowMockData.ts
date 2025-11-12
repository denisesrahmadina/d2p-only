#!/usr/bin/env ts-node

/**
 * APBA Workflow Mock Data Generator
 *
 * Generates realistic procurement workflow data including:
 * - Purchase Requisitions (PRs) with approval workflows
 * - Purchase Orders (POs) converted from approved PRs
 * - Order Tracking with 5-step delivery monitoring
 * - Goods Receipts and Invoice processing
 *
 * Simulates complete Procure-to-Invoice cycle for PLN Indonesia Power
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// PLN FACILITIES DATA
// ============================================================================

const plnFacilities = [
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
    is_active: true
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
    is_active: true
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
    is_active: true
  },
  {
    facility_id: 'FAC-PLN-004',
    facility_code: 'PLTD-BLW',
    facility_name: 'PLTD Belawan',
    facility_type: 'Diesel Power Plant',
    address: 'Jl. Pelabuhan Belawan',
    city: 'Medan',
    province: 'Sumatera Utara',
    postal_code: '20411',
    latitude: 3.7789,
    longitude: 98.6956,
    contact_person: 'Drs. Ahmad Rahman',
    contact_phone: '+62 61 6941234',
    contact_email: 'ahmad.rahman@pln.co.id',
    is_active: true
  },
  {
    facility_id: 'FAC-PLN-005',
    facility_code: 'PLTP-KMJ',
    facility_name: 'PLTP Kamojang',
    facility_type: 'Geothermal Power Plant',
    address: 'Desa Laksana, Kecamatan Ibun',
    city: 'Bandung',
    province: 'Jawa Barat',
    postal_code: '40384',
    latitude: -7.1456,
    longitude: 107.7934,
    contact_person: 'Ir. Eko Prasetyo, MSc',
    contact_phone: '+62 22 5951234',
    contact_email: 'eko.prasetyo@pln.co.id',
    is_active: true
  }
];

// ============================================================================
// PURCHASE REQUISITION MOCK DATA
// ============================================================================

interface MockPR {
  pr_number: string;
  pr_date: string;
  requestor_id: string;
  requestor_name: string;
  department: string;
  delivery_facility_id: string;
  pr_status: string;
  notes: string;
  line_items: Array<{
    line_number: number;
    item_code: string;
    quantity: number;
    notes?: string;
  }>;
}

const mockPurchaseRequisitions: MockPR[] = [
  {
    pr_number: 'PR-2025110001',
    pr_date: '2025-11-01T08:30:00Z',
    requestor_id: 'USR-001',
    requestor_name: 'Ir. Bambang Sutrisno',
    department: 'Maintenance Department',
    delivery_facility_id: 'FAC-PLN-001',
    pr_status: 'Approved',
    notes: 'Urgent requirement for fuel filter replacement - scheduled maintenance',
    line_items: [
      { line_number: 1, item_code: 'FLT-BBK-001', quantity: 10, notes: 'For Unit 1-5 generators' },
      { line_number: 2, item_code: 'FLT-BBK-004', quantity: 5, notes: 'Water separator for day tanks' },
      { line_number: 3, item_code: 'SPR-FLT-001', quantity: 50, notes: 'Spare cartridges' }
    ]
  },
  {
    pr_number: 'PR-2025110002',
    pr_date: '2025-11-02T09:15:00Z',
    requestor_id: 'USR-002',
    requestor_name: 'Ir. Hadi Purnomo',
    department: 'Operations Department',
    delivery_facility_id: 'FAC-PLN-002',
    pr_status: 'Approved',
    notes: 'Quarterly maintenance stock replenishment',
    line_items: [
      { line_number: 1, item_code: 'FLT-MNY-001', quantity: 4, notes: 'Turbine lube oil filters' },
      { line_number: 2, item_code: 'FLT-MNY-002', quantity: 12, notes: 'Generator bearing filters' },
      { line_number: 3, item_code: 'SRN-UAP-001', quantity: 8, notes: 'Steam line strainers' }
    ]
  },
  {
    pr_number: 'PR-2025110003',
    pr_date: '2025-11-03T10:45:00Z',
    requestor_id: 'USR-003',
    requestor_name: 'Ir. Siti Aminah, MT',
    department: 'Technical Services',
    delivery_facility_id: 'FAC-PLN-003',
    pr_status: 'In Procurement',
    notes: 'Gas turbine air intake filter replacement project',
    line_items: [
      { line_number: 1, item_code: 'FLT-UGS-001', quantity: 24, notes: 'Pre-filter stage - quarterly change' },
      { line_number: 2, item_code: 'FLT-UGS-002', quantity: 12, notes: 'Final HEPA filters' },
      { line_number: 3, item_code: 'FLT-UGS-003', quantity: 6, notes: 'Compressed air coalescers' }
    ]
  },
  {
    pr_number: 'PR-2025110004',
    pr_date: '2025-11-04T11:20:00Z',
    requestor_id: 'USR-004',
    requestor_name: 'Drs. Ahmad Rahman',
    department: 'Procurement Department',
    delivery_facility_id: 'FAC-PLN-004',
    pr_status: 'Pending Approval',
    notes: 'Emergency procurement for fuel system upgrade',
    line_items: [
      { line_number: 1, item_code: 'FLT-BBK-002', quantity: 2, notes: 'HFO filter assembly' },
      { line_number: 2, item_code: 'FLT-BBK-003', quantity: 8, notes: 'Biodiesel compatible filters' }
    ]
  },
  {
    pr_number: 'PR-2025110005',
    pr_date: '2025-11-05T08:00:00Z',
    requestor_id: 'USR-005',
    requestor_name: 'Ir. Eko Prasetyo, MSc',
    department: 'Water Treatment',
    delivery_facility_id: 'FAC-PLN-005',
    pr_status: 'Approved',
    notes: 'DM water plant filter renewal',
    line_items: [
      { line_number: 1, item_code: 'SRN-AIR-001', quantity: 1, notes: 'Multimedia filter vessel' },
      { line_number: 2, item_code: 'SRN-AIR-002', quantity: 1, notes: 'Pre-RO cartridge housing' },
      { line_number: 3, item_code: 'SRN-AIR-003', quantity: 100, notes: 'Carbon block cartridges' }
    ]
  },
  {
    pr_number: 'PR-2025110006',
    pr_date: '2025-11-05T14:30:00Z',
    requestor_id: 'USR-001',
    requestor_name: 'Ir. Bambang Sutrisno',
    department: 'Maintenance Department',
    delivery_facility_id: 'FAC-PLN-001',
    pr_status: 'Draft',
    notes: 'Planning for next month maintenance - pending budget approval',
    line_items: [
      { line_number: 1, item_code: 'FLT-MNY-003', quantity: 6, notes: 'Hydraulic filters' },
      { line_number: 2, item_code: 'SPR-FLT-002', quantity: 10, notes: 'O-ring seal kits' },
      { line_number: 3, item_code: 'SPR-FLT-003', quantity: 15, notes: 'Pressure gauges' }
    ]
  }
];

// ============================================================================
// PURCHASE ORDER MOCK DATA
// ============================================================================

interface MockPO {
  po_number: string;
  pr_number: string;
  supplier_id: string;
  delivery_facility_id: string;
  current_status: string;
  current_step: number;
  order_placed_date: string;
  processing_date?: string;
  shipped_date?: string;
  delivery_date?: string;
  arrived_date?: string;
  expected_delivery_date: string;
  tracking_number?: string;
  carrier?: string;
  is_delayed: boolean;
  notes: string;
  tracking_updates: Array<{
    status: string;
    location_name: string;
    latitude?: number;
    longitude?: number;
    timestamp: string;
    notes: string;
  }>;
}

const mockPurchaseOrders: MockPO[] = [
  {
    po_number: 'PO-2025110001',
    pr_number: 'PR-2025110001',
    supplier_id: 'SUP-000001',
    delivery_facility_id: 'FAC-PLN-001',
    current_status: 'ARRIVED_AT_DESTINATION',
    current_step: 5,
    order_placed_date: '2025-11-01T10:00:00Z',
    processing_date: '2025-11-01T14:00:00Z',
    shipped_date: '2025-11-02T08:00:00Z',
    delivery_date: '2025-11-03T09:00:00Z',
    arrived_date: '2025-11-03T15:30:00Z',
    expected_delivery_date: '2025-11-04T12:00:00Z',
    tracking_number: 'TRK-DNL-20251101-001',
    carrier: 'JNE Trucking',
    is_delayed: false,
    notes: 'Delivered on time, all items received in good condition',
    tracking_updates: [
      {
        status: 'ORDER_PLACED',
        location_name: 'PT Donaldson Indonesia - Bekasi',
        latitude: -6.2349,
        longitude: 107.0012,
        timestamp: '2025-11-01T10:00:00Z',
        notes: 'Order confirmed by supplier'
      },
      {
        status: 'PROCESSING_ORDER',
        location_name: 'Warehouse - PT Donaldson Indonesia',
        latitude: -6.2349,
        longitude: 107.0012,
        timestamp: '2025-11-01T14:00:00Z',
        notes: 'Picking and packing in progress'
      },
      {
        status: 'SHIPPED',
        location_name: 'Distribution Center Bekasi',
        latitude: -6.2415,
        longitude: 106.9990,
        timestamp: '2025-11-02T08:00:00Z',
        notes: 'Shipment departed, truck plate B 1234 XYZ'
      },
      {
        status: 'DELIVERY',
        location_name: 'En Route - Rest Area KM 47',
        latitude: -6.1123,
        longitude: 106.2345,
        timestamp: '2025-11-03T09:00:00Z',
        notes: 'In transit to PLTU Suralaya'
      },
      {
        status: 'ARRIVED_AT_DESTINATION',
        location_name: 'PLTU Suralaya - Receiving Area',
        latitude: -6.0342,
        longitude: 106.0212,
        timestamp: '2025-11-03T15:30:00Z',
        notes: 'Delivered and signed by Pak Joko - Warehouse'
      }
    ]
  },
  {
    po_number: 'PO-2025110002',
    pr_number: 'PR-2025110002',
    supplier_id: 'SUP-000002',
    delivery_facility_id: 'FAC-PLN-002',
    current_status: 'DELIVERY',
    current_step: 4,
    order_placed_date: '2025-11-02T11:00:00Z',
    processing_date: '2025-11-02T16:00:00Z',
    shipped_date: '2025-11-04T07:00:00Z',
    delivery_date: '2025-11-05T10:00:00Z',
    expected_delivery_date: '2025-11-06T12:00:00Z',
    tracking_number: 'TRK-PKR-20251102-002',
    carrier: 'TIKI Cargo',
    is_delayed: false,
    notes: 'Currently in transit from Bekasi to Probolinggo',
    tracking_updates: [
      {
        status: 'ORDER_PLACED',
        location_name: 'PT Parker Hannifin Indonesia - Bekasi',
        latitude: -6.2567,
        longitude: 107.0234,
        timestamp: '2025-11-02T11:00:00Z',
        notes: 'PO received and confirmed'
      },
      {
        status: 'PROCESSING_ORDER',
        location_name: 'Manufacturing Facility',
        latitude: -6.2567,
        longitude: 107.0234,
        timestamp: '2025-11-02T16:00:00Z',
        notes: 'Custom filtration units being assembled'
      },
      {
        status: 'SHIPPED',
        location_name: 'Jakarta Distribution Hub',
        latitude: -6.2088,
        longitude: 106.8456,
        timestamp: '2025-11-04T07:00:00Z',
        notes: 'Loaded on truck, ETA 2 days'
      },
      {
        status: 'DELIVERY',
        location_name: 'En Route - Surabaya Transit',
        latitude: -7.2575,
        longitude: 112.7521,
        timestamp: '2025-11-05T10:00:00Z',
        notes: 'Stopped at Surabaya hub, continuing to Probolinggo'
      }
    ]
  },
  {
    po_number: 'PO-2025110003',
    pr_number: 'PR-2025110003',
    supplier_id: 'SUP-000007',
    delivery_facility_id: 'FAC-PLN-003',
    current_status: 'PROCESSING_ORDER',
    current_step: 2,
    order_placed_date: '2025-11-04T09:00:00Z',
    processing_date: '2025-11-04T15:00:00Z',
    expected_delivery_date: '2025-11-18T12:00:00Z',
    tracking_number: 'TRK-CAM-20251104-003',
    carrier: 'Pandu Logistics',
    is_delayed: false,
    notes: 'Custom HEPA filters being manufactured, 14 day lead time',
    tracking_updates: [
      {
        status: 'ORDER_PLACED',
        location_name: 'PT Camfil Indonesia - Jakarta',
        latitude: -6.1754,
        longitude: 106.8272,
        timestamp: '2025-11-04T09:00:00Z',
        notes: 'Order received, technical review in progress'
      },
      {
        status: 'PROCESSING_ORDER',
        location_name: 'Manufacturing Facility',
        latitude: -6.1754,
        longitude: 106.8272,
        timestamp: '2025-11-04T15:00:00Z',
        notes: 'Manufacturing custom HEPA filters per specification'
      }
    ]
  },
  {
    po_number: 'PO-2025110005',
    pr_number: 'PR-2025110005',
    supplier_id: 'SUP-000008',
    delivery_facility_id: 'FAC-PLN-005',
    current_status: 'SHIPPED',
    current_step: 3,
    order_placed_date: '2025-11-05T10:00:00Z',
    processing_date: '2025-11-05T14:00:00Z',
    shipped_date: '2025-11-06T08:00:00Z',
    expected_delivery_date: '2025-11-08T12:00:00Z',
    tracking_number: 'TRK-PEN-20251105-005',
    carrier: 'Indah Cargo',
    is_delayed: false,
    notes: 'Large equipment shipment - multimedia filter vessel',
    tracking_updates: [
      {
        status: 'ORDER_PLACED',
        location_name: 'PT Pentair Indonesia - Tangerang',
        latitude: -6.2088,
        longitude: 106.6406,
        timestamp: '2025-11-05T10:00:00Z',
        notes: 'Order confirmed, warehouse allocation in progress'
      },
      {
        status: 'PROCESSING_ORDER',
        location_name: 'Warehouse Complex',
        latitude: -6.2088,
        longitude: 106.6406,
        timestamp: '2025-11-05T14:00:00Z',
        notes: 'Equipment tested and prepared for shipping'
      },
      {
        status: 'SHIPPED',
        location_name: 'Tangerang Loading Bay',
        latitude: -6.2088,
        longitude: 106.6406,
        timestamp: '2025-11-06T08:00:00Z',
        notes: 'Oversized load, using specialized truck'
      }
    ]
  }
];

// ============================================================================
// MAIN EXECUTION FUNCTION
// ============================================================================

async function generateAPBAMockData() {
  console.log('🚀 Starting APBA Workflow Mock Data Generation...\n');

  try {
    // Step 1: Insert PLN Facilities
    console.log('🏭 Step 1: Inserting PLN Facilities...');
    const { error: facilityError } = await supabase
      .from('marketplace_pln_facilities')
      .upsert(plnFacilities, { onConflict: 'facility_id' });

    if (facilityError) {
      console.error('❌ Error inserting facilities:', facilityError);
      throw facilityError;
    }
    console.log(`✅ Inserted ${plnFacilities.length} PLN facilities\n`);

    // Step 2: Fetch items to get prices
    console.log('📋 Step 2: Fetching item prices...');
    const { data: items, error: itemsError } = await supabase
      .from('marketplace_items')
      .select('item_id, item_code, unit_price');

    if (itemsError) {
      console.error('❌ Error fetching items:', itemsError);
      throw itemsError;
    }

    const itemPriceMap = new Map(items?.map(item => [item.item_code, { item_id: item.item_id, price: item.unit_price }]) || []);
    console.log(`✅ Loaded ${itemPriceMap.size} item prices\n`);

    // Step 3: Insert Purchase Requisitions
    console.log('📝 Step 3: Inserting Purchase Requisitions...');

    for (const prData of mockPurchaseRequisitions) {
      // Calculate total value
      let total_value = 0;
      const prLines = prData.line_items.map(line => {
        const itemData = itemPriceMap.get(line.item_code);
        if (!itemData) {
          console.warn(`   ⚠️  Item ${line.item_code} not found in marketplace`);
          return null;
        }
        const unit_price = itemData.price;
        const total_price = unit_price * line.quantity;
        total_value += total_price;

        return {
          line_number: line.line_number,
          item_id: itemData.item_id,
          quantity: line.quantity,
          unit_price,
          total_price,
          notes: line.notes
        };
      }).filter(line => line !== null);

      // Insert PR Header
      const { data: prHeader, error: prHeaderError } = await supabase
        .from('marketplace_pr_header')
        .upsert({
          pr_number: prData.pr_number,
          pr_date: prData.pr_date,
          requestor_id: prData.requestor_id,
          requestor_name: prData.requestor_name,
          department: prData.department,
          delivery_facility_id: prData.delivery_facility_id,
          total_value,
          pr_status: prData.pr_status,
          notes: prData.notes
        }, { onConflict: 'pr_number' })
        .select()
        .single();

      if (prHeaderError) {
        console.error(`   ❌ Error inserting PR ${prData.pr_number}:`, prHeaderError);
        continue;
      }

      // Insert PR Lines
      const linesWithPrId = prLines.map(line => ({
        ...line,
        pr_id: prHeader.pr_id
      }));

      const { error: prLinesError } = await supabase
        .from('marketplace_pr_lines')
        .upsert(linesWithPrId, { onConflict: 'pr_id,line_number' });

      if (prLinesError) {
        console.error(`   ❌ Error inserting PR lines for ${prData.pr_number}:`, prLinesError);
        continue;
      }

      console.log(`   ✓ Created PR ${prData.pr_number} (${prLines.length} lines, Total: Rp ${total_value.toLocaleString('id-ID')})`);
    }
    console.log(`✅ Inserted ${mockPurchaseRequisitions.length} purchase requisitions\n`);

    // Step 4: Insert Purchase Orders
    console.log('📦 Step 4: Inserting Purchase Orders...');

    for (const poData of mockPurchaseOrders) {
      // Get PR to link
      const { data: prData, error: prFetchError } = await supabase
        .from('marketplace_pr_header')
        .select('pr_id, total_value')
        .eq('pr_number', poData.pr_number)
        .single();

      if (prFetchError || !prData) {
        console.warn(`   ⚠️  PR ${poData.pr_number} not found for PO ${poData.po_number}`);
        continue;
      }

      // Insert Order
      const { data: order, error: orderError } = await supabase
        .from('marketplace_orders')
        .upsert({
          po_number: poData.po_number,
          pr_id: prData.pr_id,
          supplier_id: poData.supplier_id,
          delivery_facility_id: poData.delivery_facility_id,
          total_value: prData.total_value,
          current_status: poData.current_status,
          current_step: poData.current_step,
          order_placed_date: poData.order_placed_date,
          processing_date: poData.processing_date,
          shipped_date: poData.shipped_date,
          delivery_date: poData.delivery_date,
          arrived_date: poData.arrived_date,
          tracking_number: poData.tracking_number,
          carrier: poData.carrier,
          expected_delivery_date: poData.expected_delivery_date,
          is_delayed: poData.is_delayed,
          notes: poData.notes
        }, { onConflict: 'po_number' })
        .select()
        .single();

      if (orderError) {
        console.error(`   ❌ Error inserting PO ${poData.po_number}:`, orderError);
        continue;
      }

      // Insert Tracking Updates
      const trackingRecords = poData.tracking_updates.map(update => ({
        order_id: order.order_id,
        status: update.status,
        location_name: update.location_name,
        latitude: update.latitude,
        longitude: update.longitude,
        timestamp: update.timestamp,
        notes: update.notes
      }));

      const { error: trackingError } = await supabase
        .from('marketplace_order_tracking')
        .insert(trackingRecords);

      if (trackingError) {
        console.error(`   ❌ Error inserting tracking for PO ${poData.po_number}:`, trackingError);
        continue;
      }

      console.log(`   ✓ Created PO ${poData.po_number} (Status: ${poData.current_status}, ${poData.tracking_updates.length} tracking points)`);
    }
    console.log(`✅ Inserted ${mockPurchaseOrders.length} purchase orders with tracking\n`);

    // Summary
    console.log('📊 APBA Workflow Mock Data Summary:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✓ PLN Facilities: ${plnFacilities.length}`);
    console.log(`✓ Purchase Requisitions: ${mockPurchaseRequisitions.length}`);
    console.log(`  • Draft: ${mockPurchaseRequisitions.filter(pr => pr.pr_status === 'Draft').length}`);
    console.log(`  • Pending Approval: ${mockPurchaseRequisitions.filter(pr => pr.pr_status === 'Pending Approval').length}`);
    console.log(`  • Approved: ${mockPurchaseRequisitions.filter(pr => pr.pr_status === 'Approved').length}`);
    console.log(`  • In Procurement: ${mockPurchaseRequisitions.filter(pr => pr.pr_status === 'In Procurement').length}`);
    console.log(`✓ Purchase Orders: ${mockPurchaseOrders.length}`);
    console.log(`  • Order Placed: ${mockPurchaseOrders.filter(po => po.current_status === 'ORDER_PLACED').length}`);
    console.log(`  • Processing: ${mockPurchaseOrders.filter(po => po.current_status === 'PROCESSING_ORDER').length}`);
    console.log(`  • Shipped: ${mockPurchaseOrders.filter(po => po.current_status === 'SHIPPED').length}`);
    console.log(`  • In Delivery: ${mockPurchaseOrders.filter(po => po.current_status === 'DELIVERY').length}`);
    console.log(`  • Arrived: ${mockPurchaseOrders.filter(po => po.current_status === 'ARRIVED_AT_DESTINATION').length}`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n✨ APBA workflow mock data generation completed successfully!\n');

  } catch (error) {
    console.error('💥 Fatal error during APBA mock data generation:', error);
    process.exit(1);
  }
}

// Execute if running directly
if (require.main === module) {
  generateAPBAMockData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

export { generateAPBAMockData, plnFacilities, mockPurchaseRequisitions, mockPurchaseOrders };
