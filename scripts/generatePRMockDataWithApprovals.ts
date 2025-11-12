import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES module compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Approval statuses (matching database constraint)
const APPROVAL_STATUSES = [
  'Draft',
  'Pending Approval',
  'Requested Revision',
  'Approved',
  'Rejected',
  'In Procurement'
];

// Departments
const DEPARTMENTS = [
  'PLTU Suralaya',
  'PLTU Labuan',
  'PLTU Lontar',
  'PLTA Saguling',
  'PLTA Cirata',
  'PLTA Jatiluhur',
  'PLTU Banten 3 Lontar',
  'Kantor Pusat Jakarta'
];

// Requestors
const REQUESTORS = [
  { name: 'Budi Santoso', id: 'USR001' },
  { name: 'Siti Nurhaliza', id: 'USR002' },
  { name: 'Ahmad Hidayat', id: 'USR003' },
  { name: 'Dewi Kartika', id: 'USR004' },
  { name: 'Rudi Hartono', id: 'USR005' },
  { name: 'Linda Wijaya', id: 'USR006' },
  { name: 'Hendra Gunawan', id: 'USR007' },
  { name: 'Rina Susanti', id: 'USR008' }
];

// Approvers by level
const APPROVERS = {
  supervisor: [
    { name: 'Ir. Bambang Suryanto', id: 'APV001', role: 'Supervisor' },
    { name: 'Ir. Wati Kusuma', id: 'APV002', role: 'Supervisor' }
  ],
  manager: [
    { name: 'Drs. Agus Prasetyo', id: 'APV003', role: 'Manager' },
    { name: 'Ir. Sari Indah, MT', id: 'APV004', role: 'Manager' }
  ],
  director: [
    { name: 'Dr. Ir. Hadi Purnomo, MBA', id: 'APV005', role: 'Director' },
    { name: 'Prof. Dr. Sri Mulyani', id: 'APV006', role: 'Director' }
  ]
};

// Facilities for delivery
const FACILITIES = [
  { id: 'FAC001', name: 'PLTU Suralaya Unit 1-7', city: 'Cilegon', province: 'Banten' },
  { id: 'FAC002', name: 'PLTU Labuan', city: 'Pandeglang', province: 'Banten' },
  { id: 'FAC003', name: 'PLTU Lontar', city: 'Tangerang', province: 'Banten' },
  { id: 'FAC004', name: 'PLTA Saguling', city: 'Bandung Barat', province: 'Jawa Barat' },
  { id: 'FAC005', name: 'PLTA Cirata', city: 'Purwakarta', province: 'Jawa Barat' },
  { id: 'FAC006', name: 'Gudang Pusat Jakarta', city: 'Jakarta', province: 'DKI Jakarta' }
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(daysAgo: number, variance: number = 5): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo + Math.floor(Math.random() * variance));
  return date;
}

function createApprovalChain(status: string, totalValue: number) {
  const chain = [];

  // Level 1: Supervisor (always required)
  const supervisor = getRandomElement(APPROVERS.supervisor);
  const supervisorStatus = ['Draft'].includes(status) ? 'pending' : 'approved';
  chain.push({
    level: 1,
    role: 'Supervisor',
    approver_id: supervisor.id,
    approver_name: supervisor.name,
    status: supervisorStatus,
    approved_date: supervisorStatus === 'approved' ? getRandomDate(14, 3).toISOString() : null,
    comments: supervisorStatus === 'approved' ? 'Disetujui, sesuai kebutuhan operasional' : null
  });

  // Level 2: Manager (required if value > 50M)
  if (totalValue > 50000000) {
    const manager = getRandomElement(APPROVERS.manager);
    let managerStatus = 'pending';
    if (['Approved', 'Rejected', 'In Procurement'].includes(status)) {
      managerStatus = 'approved';
    } else if (status === 'Pending Approval' && supervisorStatus === 'approved') {
      managerStatus = 'pending';
    } else if (status === 'Requested Revision') {
      managerStatus = 'revision_requested';
    } else {
      managerStatus = 'pending';
    }

    chain.push({
      level: 2,
      role: 'Manager',
      approver_id: manager.id,
      approver_name: manager.name,
      status: managerStatus,
      approved_date: managerStatus === 'approved' ? getRandomDate(10, 2).toISOString() : null,
      comments: managerStatus === 'approved' ? 'Approved. Budget tersedia' :
                managerStatus === 'revision_requested' ? 'Perlu klarifikasi spesifikasi teknis' : null
    });
  }

  // Level 3: Director (required if value > 200M)
  if (totalValue > 200000000) {
    const director = getRandomElement(APPROVERS.director);
    let directorStatus = 'pending';
    if (['Approved', 'In Procurement'].includes(status)) {
      directorStatus = 'approved';
    } else if (status === 'Rejected') {
      directorStatus = 'rejected';
    } else {
      directorStatus = 'pending';
    }

    chain.push({
      level: 3,
      role: 'Director',
      approver_id: director.id,
      approver_name: director.name,
      status: directorStatus,
      approved_date: directorStatus === 'approved' ? getRandomDate(5, 2).toISOString() : null,
      comments: directorStatus === 'approved' ? 'Final approval granted' :
                directorStatus === 'rejected' ? 'Budget tidak mencukupi untuk periode ini' : null
    });
  }

  return chain;
}

async function generatePRMockData() {
  console.log('🚀 Starting PR Mock Data Generation with Approval Workflows...\n');

  try {
    // Get existing materials/items for PR lines
    const { data: materials, error: matError } = await supabase
      .from('marketplace_items')
      .select('*')
      .limit(50);

    if (matError) throw matError;
    if (!materials || materials.length === 0) {
      console.error('❌ No items found in database. Please run marketplace data generation first.');
      return;
    }

    console.log(`✅ Found ${materials.length} items to use in PRs\n`);

    // Generate 30 PRs with various statuses
    const prData = [];
    const prLineData = [];
    const approvalHistoryData = [];

    for (let i = 1; i <= 30; i++) {
      const requestor = getRandomElement(REQUESTORS);
      const department = getRandomElement(DEPARTMENTS);
      const facility = getRandomElement(FACILITIES);
      const status = getRandomElement(APPROVAL_STATUSES);

      // Generate random number of lines (2-6 items)
      const lineCount = 2 + Math.floor(Math.random() * 5);
      const prLines = [];
      let totalValue = 0;

      for (let j = 0; j < lineCount; j++) {
        const item = getRandomElement(materials);
        const quantity = (5 + Math.floor(Math.random() * 20)) * 10; // 50-250 in multiples of 10
        const unitPrice = item.unit_price || 100000;
        const lineValue = quantity * unitPrice;
        totalValue += lineValue;

        prLines.push({
          material_code: item.item_code,
          material_name: item.item_name,
          quantity: quantity,
          unit_price: unitPrice,
          line_value: lineValue,
          uom: item.unit_of_measure || 'PCS'
        });
      }

      const timestamp = Date.now();
      const prNumber = `PR-${new Date().getFullYear()}-${String(timestamp + i).slice(-6)}`;
      const prDate = getRandomDate(20, 15);

      // Create approval chain based on value
      const approvalChain = createApprovalChain(status, totalValue);

      // Determine current approver based on status
      let currentApprover = null;
      if (status === 'Pending Approval') {
        // Find the first pending approval in the chain
        const pendingApproval = approvalChain.find(a => a.status === 'pending');
        if (pendingApproval) {
          currentApprover = pendingApproval;
        }
      }

      const prRecord = {
        pr_number: prNumber,
        requestor_name: requestor.name,
        requestor_id: requestor.id,
        department: department,
        pr_date: prDate.toISOString().split('T')[0],
        total_value: totalValue,
        currency: 'IDR',
        pr_status: status,
        approver_name: currentApprover?.approver_name || null,
        approver_id: currentApprover?.approver_id || null,
        approval_date: status === 'Approved' ? getRandomDate(5).toISOString().split('T')[0] : null,
        notes: `Permintaan barang untuk ${department}`,
        delivery_location_data: {
          facility_id: facility.id,
          facility_name: facility.name,
          city: facility.city,
          province: facility.province
        },
        requirement_date: getRandomDate(-5, 20).toISOString().split('T')[0],
        attachment_count: Math.floor(Math.random() * 3),
        attachment_metadata: {
          files: [
            { name: 'justification.pdf', size: 245000, type: 'application/pdf' }
          ]
        },
        approval_chain: approvalChain
      };

      prData.push(prRecord);

      // Store line data with reference to PR index
      prLines.forEach((line, idx) => {
        prLineData.push({
          prIndex: i - 1,
          lineNumber: idx + 1,
          ...line
        });
      });

      // Generate approval history for this PR
      approvalChain.forEach((step, stepIdx) => {
        if (step.status !== 'pending') {
          approvalHistoryData.push({
            prIndex: i - 1,
            approval_level: step.level,
            approver_id: step.approver_id,
            approver_name: step.approver_name,
            approver_role: step.role,
            action: step.status === 'approved' ? 'Approved' :
                    step.status === 'rejected' ? 'Rejected' :
                    'Revision Requested',
            comments: step.comments,
            action_date: step.approved_date,
            previous_status: stepIdx === 0 ? 'Draft' : `Pending ${step.role}`,
            new_status: step.status === 'approved' ?
              (stepIdx < approvalChain.length - 1 ? `Pending ${approvalChain[stepIdx + 1].role}` : 'Approved') :
              step.status === 'rejected' ? 'Rejected' : 'Revision Requested'
          });
        }
      });
    }

    console.log(`📝 Generated ${prData.length} PR headers`);
    console.log(`📋 Generated ${prLineData.length} PR line items`);
    console.log(`📊 Generated ${approvalHistoryData.length} approval history records\n`);

    // Insert PR headers
    console.log('💾 Inserting PR headers...');
    const { data: insertedPRs, error: prError } = await supabase
      .from('fact_pr_header')
      .insert(prData)
      .select('pr_id, pr_number');

    if (prError) throw prError;
    console.log(`✅ Inserted ${insertedPRs?.length} PR headers\n`);

    // Insert PR lines
    console.log('💾 Inserting PR line items...');
    const linesWithPRId = prLineData.map(line => {
      const prRecord = insertedPRs![line.prIndex];
      const { prIndex, lineNumber, material_code, material_name, unit_price, line_value, ...lineData } = line;
      return {
        pr_id: prRecord.pr_id,
        pr_number: prRecord.pr_number,
        line_number: lineNumber,
        unit_price: unit_price,
        subtotal: line_value,
        ...lineData
      };
    });

    const { error: lineError } = await supabase
      .from('fact_pr_line')
      .insert(linesWithPRId);

    if (lineError) throw lineError;
    console.log(`✅ Inserted ${linesWithPRId.length} PR line items\n`);

    // Insert approval history
    console.log('💾 Inserting approval history...');
    const historyWithPRId = approvalHistoryData.map(history => {
      const prRecord = insertedPRs![history.prIndex];
      const { prIndex, ...historyData } = history;
      return {
        pr_id: prRecord.pr_id,
        pr_number: prRecord.pr_number,
        ...historyData
      };
    });

    const { error: historyError } = await supabase
      .from('fact_pr_approval_history')
      .insert(historyWithPRId);

    if (historyError) throw historyError;
    console.log(`✅ Inserted ${historyWithPRId.length} approval history records\n`);

    // Summary by status
    console.log('📊 PR Summary by Status:');
    const statusCounts: Record<string, number> = {};
    prData.forEach(pr => {
      statusCounts[pr.pr_status] = (statusCounts[pr.pr_status] || 0) + 1;
    });

    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });

    console.log('\n✨ Mock PR data generation completed successfully!');

  } catch (error) {
    console.error('❌ Error generating PR mock data:', error);
    throw error;
  }
}

// Run the script
generatePRMockData()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
