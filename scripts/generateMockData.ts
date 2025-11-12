import { faker } from '@faker-js/faker';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

faker.seed(12345);

const INDONESIAN_CITIES = [
  'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang',
  'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi',
  'Bogor', 'Malang', 'Yogyakarta', 'Balikpapan', 'Banjarmasin'
];

const DEPARTMENTS = [
  'Procurement', 'Engineering', 'Operations', 'Maintenance',
  'IT', 'Finance', 'Quality Control', 'Logistics', 'Production'
];

const MATERIAL_CATEGORIES = [
  'Construction Materials', 'Industrial Equipment', 'Office Supplies',
  'Electronics', 'Safety Equipment', 'Raw Materials', 'Tools & Machinery',
  'Electrical Components', 'Plumbing Supplies', 'Automotive Parts'
];

const PO_STATUS_STEPS = [
  { step: 1, name: 'Order Placed' },
  { step: 2, name: 'Processing' },
  { step: 3, name: 'Shipped' },
  { step: 4, name: 'Delivery' },
  { step: 5, name: 'Arrived' },
  { step: 6, name: 'In Inspection' },
  { step: 7, name: 'Order Received' }
];

interface GenerationStats {
  vendors: number;
  contracts: number;
  items: number;
  prHeaders: number;
  prLines: number;
  poHeaders: number;
  poStatusLogs: number;
  baPemeriksaan: number;
  baSerahTerima: number;
  grHeaders: number;
  errors: string[];
}

interface Vendor {
  vendor_id: string;
  vendor_name?: string;
}

interface Material {
  material_id: string;
  material_description?: string;
  unit_of_measure?: string;
  material_map_price?: number;
  material_category?: string;
}

interface Contract {
  contract_id: string;
  vendor_id: string;
  material_id?: string;
}

interface Item {
  item_id: string;
  material_id?: string;
  unit_price?: number;
  uom?: string;
}

interface PRHeader {
  pr_id: string;
  pr_number: string;
  created_from_contract?: string;
  pr_date?: string;
  pr_status?: string;
}

interface POHeader {
  po_id: string;
  po_number: string;
  po_line_id: string;
  delivery_date?: string;
}

interface BAPemeriksaan {
  ba_pemeriksaan_id: string;
  ba_number: string;
  document_status?: string;
  inspection_date?: string;
}

interface BASerahTerima {
  ba_serah_terima_id: string;
  ba_number: string;
  document_status?: string;
}

const stats: GenerationStats = {
  vendors: 0,
  contracts: 0,
  items: 0,
  prHeaders: 0,
  prLines: 0,
  poHeaders: 0,
  poStatusLogs: 0,
  baPemeriksaan: 0,
  baSerahTerima: 0,
  grHeaders: 0,
  errors: []
};

async function checkExistingData() {
  console.log('\n📊 Checking existing data...');

  const { count: vendorCount } = await supabase
    .from('dim_vendor')
    .select('*', { count: 'exact', head: true });

  const { count: contractCount } = await supabase
    .from('dim_contract')
    .select('*', { count: 'exact', head: true });

  const { count: materialCount } = await supabase
    .from('dim_material')
    .select('*', { count: 'exact', head: true });

  console.log(`   Existing vendors: ${vendorCount || 0}`);
  console.log(`   Existing contracts: ${contractCount || 0}`);
  console.log(`   Existing materials: ${materialCount || 0}`);

  return { vendorCount: vendorCount || 0, contractCount: contractCount || 0, materialCount: materialCount || 0 };
}

async function generateVendors(targetCount: number = 50) {
  console.log(`\n🏢 Generating vendors (target: ${targetCount})...`);

  const { data: existing } = await supabase
    .from('dim_vendor')
    .select('vendor_id');

  const existingCount = existing?.length || 0;
  const needed = Math.max(0, targetCount - existingCount);

  if (needed === 0) {
    console.log(`   ✓ Already have ${existingCount} vendors`);
    stats.vendors = existingCount;
    return existing!;
  }

  const vendors = [];
  for (let i = 0; i < needed; i++) {
    const vendorId = `VND${String(existingCount + i + 1).padStart(3, '0')}`;
    vendors.push({
      vendor_id: vendorId,
      vendor_name: `PT ${faker.company.name()} Indonesia`,
      vendor_category: faker.helpers.arrayElement(MATERIAL_CATEGORIES),
      vendor_address: faker.location.streetAddress(),
      vendor_contact: faker.person.fullName(),
      vendor_rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
      vendor_email: faker.internet.email().toLowerCase(),
      vendor_phone: `+62${faker.string.numeric(10)}`,
      vendor_city: faker.helpers.arrayElement(INDONESIAN_CITIES),
      vendor_province: 'Indonesia',
      is_active: true
    });
  }

  const { error } = await supabase
    .from('dim_vendor')
    .insert(vendors);

  if (error) {
    stats.errors.push(`Vendor generation: ${error.message}`);
    console.error(`   ✗ Error:`, error.message);
    return existing || [];
  }

  stats.vendors = existingCount + needed;
  console.log(`   ✓ Generated ${needed} new vendors (total: ${stats.vendors})`);

  const { data: allVendors } = await supabase.from('dim_vendor').select('vendor_id, vendor_name');
  return allVendors || [];
}

async function generateMaterials() {
  console.log(`\n📦 Checking materials...`);

  const { data: materials } = await supabase
    .from('dim_material')
    .select('material_id, material_description, unit_of_measure, material_map_price, material_category');

  if (!materials || materials.length === 0) {
    console.log(`   ⚠ No materials found. Please populate dim_material table first.`);
    stats.errors.push('No materials available');
    return [];
  }

  console.log(`   ✓ Found ${materials.length} materials`);
  return materials;
}

async function generateContracts(vendors: Vendor[], materials: Material[], targetCount: number = 50): Promise<Contract[]> {
  console.log(`\n📄 Generating contracts (target: ${targetCount})...`);

  if (vendors.length === 0 || materials.length === 0) {
    console.log(`   ✗ Cannot generate contracts without vendors and materials`);
    return [];
  }

  const { data: existing } = await supabase
    .from('dim_contract')
    .select('contract_id, vendor_id');

  const existingCount = existing?.length || 0;
  const needed = Math.max(0, targetCount - existingCount);

  if (needed === 0) {
    console.log(`   ✓ Already have ${existingCount} contracts`);
    stats.contracts = existingCount;
    return existing!;
  }

  const contracts = [];
  const startDate = new Date('2024-01-01');

  for (let i = 0; i < needed; i++) {
    const contractId = `C2025-${String(existingCount + i + 1).padStart(3, '0')}`;
    const vendor = faker.helpers.arrayElement(vendors);
    const material = faker.helpers.arrayElement(materials);
    const contractStart = faker.date.between({ from: startDate, to: new Date('2025-01-01') });
    const contractEnd = faker.date.future({ years: 2, refDate: contractStart });
    const contractValue = faker.number.int({ min: 100000000, max: 10000000000 });

    contracts.push({
      contract_id: contractId,
      contract_number: contractId,
      contract_scope: `Supply of ${material.material_description} for ${faker.helpers.arrayElement(['Construction', 'Operations', 'Maintenance', 'Production'])} purposes`,
      contract_status: faker.helpers.weightedArrayElement([
        { value: 'Active', weight: 8 },
        { value: 'Draft', weight: 1 },
        { value: 'Expired', weight: 1 }
      ]),
      contract_start_date: contractStart.toISOString().split('T')[0],
      contract_end_date: contractEnd.toISOString().split('T')[0],
      contract_value_limit: contractValue,
      contract_currency: 'IDR',
      material_id: material.material_id,
      vendor_id: vendor.vendor_id
    });
  }

  const { error } = await supabase
    .from('dim_contract')
    .insert(contracts);

  if (error) {
    stats.errors.push(`Contract generation: ${error.message}`);
    console.error(`   ✗ Error:`, error.message);
    return existing || [];
  }

  stats.contracts = existingCount + needed;
  console.log(`   ✓ Generated ${needed} new contracts (total: ${stats.contracts})`);

  const { data: allContracts } = await supabase
    .from('dim_contract')
    .select('contract_id, vendor_id, material_id');
  return allContracts || [];
}

async function generateItems(contracts: Contract[], materials: Material[], targetCount: number = 50): Promise<Item[]> {
  console.log(`\n🛍️ Generating items (target: ${targetCount})...`);

  if (contracts.length === 0) {
    console.log(`   ✗ Cannot generate items without contracts`);
    return [];
  }

  const { data: existing } = await supabase
    .from('fact_item_master')
    .select('item_id');

  const existingCount = existing?.length || 0;
  const needed = Math.max(0, targetCount - existingCount);

  if (needed === 0) {
    console.log(`   ✓ Already have ${existingCount} items`);
    stats.items = existingCount;
    const { data } = await supabase.from('fact_item_master').select('*');
    return data || [];
  }

  const items = [];
  for (let i = 0; i < needed; i++) {
    const itemId = `ITM${String(existingCount + i + 1).padStart(3, '0')}`;
    const contract = faker.helpers.arrayElement(contracts);
    const material = materials.find(m => m.material_id === contract.material_id) || faker.helpers.arrayElement(materials);
    const price = parseInt(material.material_map_price || '100000');

    items.push({
      item_id: itemId,
      item_name: material.material_description,
      material_id: material.material_id,
      material_desc: material.material_description,
      category: material.material_category || faker.helpers.arrayElement(MATERIAL_CATEGORIES),
      uom: material.unit_of_measure,
      unit_price: price,
      stock_qty: faker.number.int({ min: 0, max: 1000 }),
      image_url: `https://picsum.photos/seed/${itemId}/400/300`,
      contract_id: contract.contract_id,
      is_active: true
    });
  }

  const { error } = await supabase
    .from('fact_item_master')
    .insert(items);

  if (error) {
    stats.errors.push(`Item generation: ${error.message}`);
    console.error(`   ✗ Error:`, error.message);
    return existing || [];
  }

  stats.items = existingCount + needed;
  console.log(`   ✓ Generated ${needed} new items (total: ${stats.items})`);

  const { data: allItems } = await supabase.from('fact_item_master').select('*');
  return allItems || [];
}

async function generatePRs(contracts: Contract[], items: Item[], targetCount: number = 50): Promise<PRHeader[]> {
  console.log(`\n📋 Generating procurement requests (target: ${targetCount})...`);

  if (contracts.length === 0 || items.length === 0) {
    console.log(`   ✗ Cannot generate PRs without contracts and items`);
    return [];
  }

  const { data: existing } = await supabase
    .from('fact_pr_header')
    .select('pr_id, pr_number');

  const existingCount = existing?.length || 0;
  const needed = Math.max(0, targetCount - existingCount);

  if (needed === 0) {
    console.log(`   ✓ Already have ${existingCount} PRs`);
    stats.prHeaders = existingCount;
    return existing!;
  }

  const prHeaders = [];
  const prLines = [];

  const statusDistribution = [
    ...Array(Math.floor(needed * 0.2)).fill('Draft'),
    ...Array(Math.floor(needed * 0.3)).fill('Pending Approval'),
    ...Array(Math.ceil(needed * 0.5)).fill('Approved')
  ];

  for (let i = 0; i < needed; i++) {
    const prNumber = `PR2025-${String(existingCount + i + 1).padStart(3, '0')}`;
    const item = faker.helpers.arrayElement(items);
    const contract = contracts.find(c => c.contract_id === item.contract_id) || faker.helpers.arrayElement(contracts);
    const quantity = faker.number.int({ min: 5, max: 100 });
    const subtotal = quantity * item.unit_price;
    const prDate = faker.date.between({ from: '2025-01-01', to: '2025-03-01' });
    const status = statusDistribution[i];

    prHeaders.push({
      pr_number: prNumber,
      requestor_name: faker.person.fullName(),
      department: faker.helpers.arrayElement(DEPARTMENTS),
      pr_date: prDate.toISOString().split('T')[0],
      total_value: subtotal,
      currency: 'IDR',
      pr_status: status,
      approver_name: status !== 'Draft' ? faker.person.fullName() : null,
      approval_date: status === 'Approved' ? faker.date.soon({ days: 3, refDate: prDate }).toISOString().split('T')[0] : null,
      created_from_contract: contract.contract_id
    });
  }

  const { data: insertedPRs, error: prError } = await supabase
    .from('fact_pr_header')
    .insert(prHeaders)
    .select('pr_id, pr_number');

  if (prError) {
    stats.errors.push(`PR header generation: ${prError.message}`);
    console.error(`   ✗ Error:`, prError.message);
    return existing || [];
  }

  for (let i = 0; i < insertedPRs.length; i++) {
    const pr = insertedPRs[i];
    const item = faker.helpers.arrayElement(items);
    const quantity = faker.number.int({ min: 5, max: 100 });
    const subtotal = quantity * item.unit_price;

    prLines.push({
      pr_id: pr.pr_id,
      pr_number: pr.pr_number,
      line_number: 1,
      item_id: item.item_id,
      material_id: item.material_id,
      quantity,
      uom: item.uom,
      unit_price: item.unit_price,
      subtotal
    });
  }

  const { error: lineError } = await supabase
    .from('fact_pr_line')
    .insert(prLines);

  if (lineError) {
    stats.errors.push(`PR line generation: ${lineError.message}`);
    console.error(`   ✗ PR line error:`, lineError.message);
  } else {
    stats.prLines = prLines.length;
  }

  stats.prHeaders = existingCount + needed;
  console.log(`   ✓ Generated ${needed} new PRs with ${prLines.length} lines (total: ${stats.prHeaders})`);

  const { data: allPRs } = await supabase
    .from('fact_pr_header')
    .select('pr_id, pr_number, pr_status, total_value, created_from_contract, pr_date');
  return allPRs || [];
}

async function generatePOs(prs: PRHeader[], contracts: Contract[], items: Item[], targetCount: number = 50): Promise<POHeader[]> {
  console.log(`\n🛒 Generating purchase orders (target: ${targetCount})...`);

  const approvedPRs = prs.filter(pr => pr.pr_status === 'Approved');

  if (approvedPRs.length === 0) {
    console.log(`   ✗ No approved PRs available`);
    return [];
  }

  const { data: existing } = await supabase
    .from('fact_po_header')
    .select('po_line_id, po_number, po_status');

  const existingCount = existing?.length || 0;
  const needed = Math.min(Math.max(0, targetCount - existingCount), approvedPRs.length);

  if (needed === 0) {
    console.log(`   ✓ Already have ${existingCount} POs`);
    stats.poHeaders = existingCount;
    return existing!;
  }

  const poHeaders = [];
  const statusDistribution = [
    ...Array(Math.floor(needed * 0.2)).fill('Placed'),
    ...Array(Math.floor(needed * 0.15)).fill('Processing'),
    ...Array(Math.floor(needed * 0.15)).fill('Shipped'),
    ...Array(Math.floor(needed * 0.2)).fill('Delivered'),
    ...Array(Math.floor(needed * 0.15)).fill('Inspected'),
    ...Array(Math.ceil(needed * 0.15)).fill('GR Posted')
  ];

  for (let i = 0; i < needed; i++) {
    const pr = approvedPRs[i];
    const poNumber = `PO2025-${String(existingCount + i + 1).padStart(3, '0')}`;
    const contract = contracts.find(c => c.contract_id === pr.created_from_contract);
    const item = items.find(it => it.contract_id === pr.created_from_contract) || faker.helpers.arrayElement(items);
    const poDate = new Date(pr.pr_date);
    poDate.setDate(poDate.getDate() + faker.number.int({ min: 3, max: 7 }));
    const deliveryDate = new Date(poDate);
    deliveryDate.setDate(deliveryDate.getDate() + faker.number.int({ min: 14, max: 45 }));

    poHeaders.push({
      po_number: poNumber,
      po_line_number: 1,
      vendor_id: contract.vendor_id,
      pr_id: pr.pr_id,
      pr_number: pr.pr_number,
      contract_id: contract.contract_id,
      material_id: item.material_id,
      po_date: poDate.toISOString().split('T')[0],
      expected_delivery_date: deliveryDate.toISOString().split('T')[0],
      delivery_date: ['Delivered', 'Inspected', 'GR Posted'].includes(statusDistribution[i])
        ? deliveryDate.toISOString().split('T')[0]
        : null,
      po_value: pr.total_value,
      currency: 'IDR',
      po_status: statusDistribution[i],
      qty_ordered: faker.number.int({ min: 10, max: 100 }),
      qty_received: statusDistribution[i] === 'GR Posted' ? faker.number.int({ min: 10, max: 100 }) : 0,
      uom: item.uom,
      po_description: `Purchase order for ${item.item_name}`
    });
  }

  const { data: insertedPOs, error: poError } = await supabase
    .from('fact_po_header')
    .insert(poHeaders)
    .select('po_line_id, po_number, po_status, po_date, delivery_date, qty_ordered');

  if (poError) {
    stats.errors.push(`PO generation: ${poError.message}`);
    console.error(`   ✗ Error:`, poError.message);
    return existing || [];
  }

  const statusLogs = [];
  for (const po of insertedPOs) {
    const statusIndex = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Inspected', 'GR Posted'].indexOf(po.po_status);
    const currentStep = Math.min(statusIndex + 1, 7);
    const stepInfo = PO_STATUS_STEPS[currentStep - 1];

    statusLogs.push({
      po_number: po.po_number,
      po_line_id: po.po_line_id,
      step: stepInfo.step,
      step_name: stepInfo.name,
      step_timestamp: new Date().toISOString(),
      location: faker.helpers.arrayElement(INDONESIAN_CITIES),
      remarks: currentStep >= 4 ? `Delivered to ${faker.helpers.arrayElement(INDONESIAN_CITIES)}` : null
    });
  }

  const { error: logError } = await supabase
    .from('fact_po_status_log')
    .insert(statusLogs);

  if (logError) {
    stats.errors.push(`PO status log: ${logError.message}`);
    console.error(`   ✗ Status log error:`, logError.message);
  } else {
    stats.poStatusLogs = statusLogs.length;
  }

  stats.poHeaders = existingCount + needed;
  console.log(`   ✓ Generated ${needed} new POs with ${statusLogs.length} status logs (total: ${stats.poHeaders})`);

  const { data: allPOs } = await supabase
    .from('fact_po_header')
    .select('*');
  return allPOs || [];
}

async function generateBAPemeriksaan(pos: POHeader[], contracts: Contract[], targetCount: number = 50): Promise<BAPemeriksaan[]> {
  console.log(`\n🔍 Generating BA Pemeriksaan (target: ${targetCount})...`);

  const deliveredPOs = pos.filter(po => ['Delivered', 'Inspected', 'GR Posted'].includes(po.po_status));

  if (deliveredPOs.length === 0) {
    console.log(`   ✗ No delivered POs available`);
    return [];
  }

  const { data: existing } = await supabase
    .from('fact_ba_pemeriksaan')
    .select('ba_pemeriksaan_id, ba_number, document_status');

  const existingCount = existing?.length || 0;
  const needed = Math.min(Math.max(0, targetCount - existingCount), deliveredPOs.length);

  if (needed === 0) {
    console.log(`   ✓ Already have ${existingCount} BA Pemeriksaan`);
    stats.baPemeriksaan = existingCount;
    return existing!;
  }

  const baRecords = [];
  const statusDistribution = [
    ...Array(Math.floor(needed * 0.2)).fill('Draft'),
    ...Array(Math.floor(needed * 0.2)).fill('Submitted'),
    ...Array(Math.ceil(needed * 0.6)).fill('Approved')
  ];

  for (let i = 0; i < needed; i++) {
    const po = deliveredPOs[i];
    const baNumber = `BAP2025-${String(existingCount + i + 1).padStart(3, '0')}`;
    const inspectionDate = new Date(po.delivery_date || po.po_date);
    inspectionDate.setDate(inspectionDate.getDate() + faker.number.int({ min: 1, max: 3 }));
    const qtyChecked = po.qty_ordered;
    const qtyApproved = Math.floor(qtyChecked * faker.number.float({ min: 0.95, max: 1.0 }));
    const qtyRejected = qtyChecked - qtyApproved;
    const status = statusDistribution[i];

    baRecords.push({
      ba_number: baNumber,
      po_number: po.po_number,
      po_line_id: po.po_line_id,
      contract_id: po.contract_id,
      vendor_id: po.vendor_id,
      material_id: po.material_id,
      inspection_date: inspectionDate.toISOString().split('T')[0],
      qty_checked: qtyChecked,
      qty_approved: qtyApproved,
      qty_rejected: qtyRejected,
      uom: po.uom,
      document_status: status,
      maker_pln: faker.person.fullName(),
      maker_vendor: faker.person.fullName(),
      checker_pln: faker.person.fullName(),
      approver_pln: status === 'Approved' ? faker.person.fullName() : null,
      approval_date: status === 'Approved'
        ? faker.date.soon({ days: 2, refDate: inspectionDate }).toISOString().split('T')[0]
        : null,
      inspection_notes: qtyRejected > 0 ? `${qtyRejected} units rejected due to quality issues` : 'All items passed inspection'
    });
  }

  const { data: inserted, error } = await supabase
    .from('fact_ba_pemeriksaan')
    .insert(baRecords)
    .select('ba_pemeriksaan_id, ba_number, document_status');

  if (error) {
    stats.errors.push(`BA Pemeriksaan: ${error.message}`);
    console.error(`   ✗ Error:`, error.message);
    return existing || [];
  }

  stats.baPemeriksaan = existingCount + needed;
  console.log(`   ✓ Generated ${needed} new BA Pemeriksaan (total: ${stats.baPemeriksaan})`);

  return inserted;
}

async function generateBASerahTerima(baPemeriksaan: BAPemeriksaan[], pos: POHeader[], targetCount: number = 50): Promise<BASerahTerima[]> {
  console.log(`\n📦 Generating BA Serah Terima (target: ${targetCount})...`);

  const approvedBA = baPemeriksaan.filter(ba => ba.document_status === 'Approved');

  if (approvedBA.length === 0) {
    console.log(`   ✗ No approved BA Pemeriksaan available`);
    return [];
  }

  const { data: existing } = await supabase
    .from('fact_ba_serah_terima')
    .select('ba_serah_terima_id, ba_number, document_status');

  const existingCount = existing?.length || 0;
  const needed = Math.min(Math.max(0, targetCount - existingCount), approvedBA.length);

  if (needed === 0) {
    console.log(`   ✓ Already have ${existingCount} BA Serah Terima`);
    stats.baSerahTerima = existingCount;
    return existing!;
  }

  const { data: fullBAPemeriksaan } = await supabase
    .from('fact_ba_pemeriksaan')
    .select('*')
    .in('ba_number', approvedBA.map(ba => ba.ba_number));

  const baRecords = [];
  const statusDistribution = [
    ...Array(Math.floor(needed * 0.2)).fill('Draft'),
    ...Array(Math.floor(needed * 0.2)).fill('Submitted'),
    ...Array(Math.ceil(needed * 0.6)).fill('Approved')
  ];

  for (let i = 0; i < needed; i++) {
    const parentBA = fullBAPemeriksaan![i];
    const baNumber = `BAST2025-${String(existingCount + i + 1).padStart(3, '0')}`;
    const handoverDate = new Date(parentBA.inspection_date);
    handoverDate.setDate(handoverDate.getDate() + faker.number.int({ min: 1, max: 2 }));
    const status = statusDistribution[i];

    baRecords.push({
      ba_number: baNumber,
      linked_ba_pemeriksaan: parentBA.ba_number,
      linked_ba_pemeriksaan_id: parentBA.ba_pemeriksaan_id,
      po_number: parentBA.po_number,
      po_line_id: parentBA.po_line_id,
      contract_id: parentBA.contract_id,
      vendor_id: parentBA.vendor_id,
      material_id: parentBA.material_id,
      handover_date: handoverDate.toISOString().split('T')[0],
      qty_handover: parentBA.qty_approved,
      uom: parentBA.uom,
      document_status: status,
      maker_pln: faker.person.fullName(),
      maker_vendor: faker.person.fullName(),
      approver_pln: status === 'Approved' ? faker.person.fullName() : null,
      approval_date: status === 'Approved'
        ? faker.date.soon({ days: 1, refDate: handoverDate }).toISOString().split('T')[0]
        : null,
      handover_notes: `Handover of ${parentBA.qty_approved} ${parentBA.uom} completed successfully`
    });
  }

  const { data: inserted, error } = await supabase
    .from('fact_ba_serah_terima')
    .insert(baRecords)
    .select('ba_serah_terima_id, ba_number, document_status');

  if (error) {
    stats.errors.push(`BA Serah Terima: ${error.message}`);
    console.error(`   ✗ Error:`, error.message);
    return existing || [];
  }

  stats.baSerahTerima = existingCount + needed;
  console.log(`   ✓ Generated ${needed} new BA Serah Terima (total: ${stats.baSerahTerima})`);

  return inserted;
}

async function generateGRs(baSerahTerima: BASerahTerima[], targetCount: number = 50): Promise<unknown[]> {
  console.log(`\n✅ Generating Goods Receipts (target: ${targetCount})...`);

  const approvedBAST = baSerahTerima.filter(ba => ba.document_status === 'Approved');

  if (approvedBAST.length === 0) {
    console.log(`   ✗ No approved BA Serah Terima available`);
    return [];
  }

  const { data: existing } = await supabase
    .from('fact_gr_header')
    .select('gr_id, gr_number');

  const existingCount = existing?.length || 0;
  const needed = Math.min(Math.max(0, targetCount - existingCount), approvedBAST.length);

  if (needed === 0) {
    console.log(`   ✓ Already have ${existingCount} GRs`);
    stats.grHeaders = existingCount;
    return existing!;
  }

  const { data: fullBASerahTerima } = await supabase
    .from('fact_ba_serah_terima')
    .select('*')
    .in('ba_number', approvedBAST.map(ba => ba.ba_number));

  const { data: items } = await supabase
    .from('fact_item_master')
    .select('item_id, unit_price, material_id');

  const grRecords = [];

  for (let i = 0; i < needed; i++) {
    const bast = fullBASerahTerima![i];
    const grNumber = `GR2025-${String(existingCount + i + 1).padStart(3, '0')}`;
    const grDate = new Date(bast.handover_date);
    grDate.setDate(grDate.getDate() + 1);
    const qtyReceived = bast.qty_handover;
    const qtyRejected = i < 3 ? faker.number.int({ min: 0, max: 5 }) : 0;

    const item = items?.find(it => it.material_id === bast.material_id);
    const grValue = qtyReceived * (item?.unit_price || 100000);

    grRecords.push({
      gr_number: grNumber,
      ba_serah_terima: bast.ba_number,
      ba_serah_terima_id: bast.ba_serah_terima_id,
      po_number: bast.po_number,
      po_line_id: bast.po_line_id,
      contract_id: bast.contract_id,
      vendor_id: bast.vendor_id,
      material_id: bast.material_id,
      gr_date: grDate.toISOString().split('T')[0],
      qty_received: qtyReceived,
      qty_rejected: qtyRejected,
      uom: bast.uom,
      gr_value: grValue,
      currency: 'IDR',
      gr_status: i < 3 ? 'Failed' : 'Posted',
      gr_notes: qtyRejected > 0 ? `${qtyRejected} units rejected during GR posting` : 'GR posted successfully',
      created_by: faker.person.fullName()
    });
  }

  const { error } = await supabase
    .from('fact_gr_header')
    .insert(grRecords);

  if (error) {
    stats.errors.push(`GR generation: ${error.message}`);
    console.error(`   ✗ Error:`, error.message);
    return existing || [];
  }

  stats.grHeaders = existingCount + needed;
  console.log(`   ✓ Generated ${needed} new GRs (total: ${stats.grHeaders})`);

  return grRecords;
}

async function main() {
  console.log('🚀 Starting Mock Data Generation for Procurement System');
  console.log('================================================\n');

  try {
    await checkExistingData();

    const vendors = await generateVendors(50);
    const materials = await generateMaterials();
    const contracts = await generateContracts(vendors, materials, 50);
    const items = await generateItems(contracts, materials, 50);
    const prs = await generatePRs(contracts, items, 50);
    const pos = await generatePOs(prs, contracts, items, 50);
    const baPemeriksaan = await generateBAPemeriksaan(pos, contracts, 50);
    const baSerahTerima = await generateBASerahTerima(baPemeriksaan, pos, 50);
    await generateGRs(baSerahTerima, 50);

    console.log('\n\n📊 GENERATION SUMMARY');
    console.log('================================================');
    console.log(`✓ Vendors:          ${stats.vendors}`);
    console.log(`✓ Contracts:        ${stats.contracts}`);
    console.log(`✓ Items:            ${stats.items}`);
    console.log(`✓ PR Headers:       ${stats.prHeaders}`);
    console.log(`✓ PR Lines:         ${stats.prLines}`);
    console.log(`✓ PO Headers:       ${stats.poHeaders}`);
    console.log(`✓ PO Status Logs:   ${stats.poStatusLogs}`);
    console.log(`✓ BA Pemeriksaan:   ${stats.baPemeriksaan}`);
    console.log(`✓ BA Serah Terima:  ${stats.baSerahTerima}`);
    console.log(`✓ GR Headers:       ${stats.grHeaders}`);
    console.log('------------------------------------------------');
    console.log(`   TOTAL RECORDS:   ${stats.vendors + stats.contracts + stats.items + stats.prHeaders + stats.prLines + stats.poHeaders + stats.poStatusLogs + stats.baPemeriksaan + stats.baSerahTerima + stats.grHeaders}`);

    if (stats.errors.length > 0) {
      console.log('\n⚠️  ERRORS ENCOUNTERED:');
      stats.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    console.log('\n✅ Mock data generation completed!');
    console.log('================================================\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
