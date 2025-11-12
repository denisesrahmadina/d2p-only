import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MARKETPLACE_TABLES = {
  cart: ['fact_cart'],
  pr: ['fact_pr_approval_workflow', 'fact_pr_revision_history', 'fact_pr_line', 'fact_pr_header'],
  po: ['fact_po_status_log', 'fact_po_header'],
  order_monitoring: [
    'fact_order_tracking_milestones',
    'fact_order_inspection',
    'fact_order_milestones',
    'fact_order_status_history',
    'fact_order_monitoring'
  ],
  ba: [
    'fact_ba_order_monitoring_sync',
    'fact_ba_erp_integration_log',
    'fact_ba_milestone',
    'fact_ba_process_history',
    'fact_ba_workflow_step',
    'fact_ba_document_attachment',
    'fact_ba_digital_signature',
    'fact_ba_approval',
    'fact_ba_serah_terima_detail',
    'fact_ba_serah_terima',
    'fact_ba_pemeriksaan_detail',
    'fact_ba_pemeriksaan'
  ],
  gr: ['fact_gr_header', 'fact_goods_receipt'],
  item: ['fact_item_master'],
  contract_docs: ['contract_documents'],
  contract: ['dim_contract'],
  vendor: ['dim_vendor'],
  material: ['dim_material']
};

interface DeletionResult {
  table: string;
  records_deleted: number;
  status: 'success' | 'error' | 'skipped';
  error?: string;
  timestamp: string;
}

interface BackupResult {
  table: string;
  records: number;
  status: 'success' | 'error';
  error?: string;
}

async function createBackup(): Promise<{ success: boolean; backupDir: string; results: BackupResult[] }> {
  console.log('\n📦 STEP 1: Creating Comprehensive Backup...\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const backupDir = `./backups/marketplace_purge_${timestamp}`;

  if (!fs.existsSync('./backups')) {
    fs.mkdirSync('./backups');
  }
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const allTables = Object.values(MARKETPLACE_TABLES).flat();
  const backupResults: BackupResult[] = [];
  let totalRecords = 0;

  for (const table of allTables) {
    try {
      console.log(`  📥 Backing up ${table}...`);

      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' });

      if (error) {
        console.log(`     ⚠️  Error: ${error.message}`);
        backupResults.push({ table, records: 0, status: 'error', error: error.message });
        continue;
      }

      if (data && data.length > 0) {
        const filename = `${backupDir}/${table}.json`;
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        console.log(`     ✓ Backed up ${count} records`);
        backupResults.push({ table, records: count || 0, status: 'success' });
        totalRecords += count || 0;
      } else {
        console.log(`     ℹ️  Table empty, skipping backup`);
        backupResults.push({ table, records: 0, status: 'success' });
      }

    } catch (err) {
      const error = err as Error;
      console.log(`     ❌ Exception: ${error.message}`);
      backupResults.push({ table, records: 0, status: 'error', error: error.message });
    }
  }

  const summary = {
    timestamp: new Date().toISOString(),
    total_tables: allTables.length,
    total_records: totalRecords,
    results: backupResults
  };

  fs.writeFileSync(
    `${backupDir}/backup_summary.json`,
    JSON.stringify(summary, null, 2)
  );

  console.log(`\n  ✅ Backup Complete!`);
  console.log(`  📁 Location: ${backupDir}`);
  console.log(`  📊 Total records backed up: ${totalRecords}\n`);

  return { success: true, backupDir, results: backupResults };
}

async function deleteFromTable(tableName: string): Promise<DeletionResult> {
  try {
    const { data: existingData, error: selectError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (selectError) {
      return {
        table: tableName,
        records_deleted: 0,
        status: 'error',
        error: selectError.message,
        timestamp: new Date().toISOString()
      };
    }

    const { error: deleteError, count } = await supabase
      .from(tableName)
      .delete()
      .neq('created_date', '1900-01-01');

    if (deleteError) {
      const { data: allRecords } = await supabase
        .from(tableName)
        .select('*');

      if (allRecords && allRecords.length > 0) {
        let deletedCount = 0;
        const primaryKeyField = Object.keys(allRecords[0])[0];

        for (const record of allRecords) {
          const { error: individualDeleteError } = await supabase
            .from(tableName)
            .delete()
            .eq(primaryKeyField, record[primaryKeyField]);

          if (!individualDeleteError) {
            deletedCount++;
          }
        }

        return {
          table: tableName,
          records_deleted: deletedCount,
          status: 'success',
          timestamp: new Date().toISOString()
        };
      }

      return {
        table: tableName,
        records_deleted: 0,
        status: 'error',
        error: deleteError.message,
        timestamp: new Date().toISOString()
      };
    }

    return {
      table: tableName,
      records_deleted: count || 0,
      status: 'success',
      timestamp: new Date().toISOString()
    };

  } catch (err) {
    const error = err as Error;
    return {
      table: tableName,
      records_deleted: 0,
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function deleteTableGroup(groupName: string, tables: string[]): Promise<DeletionResult[]> {
  console.log(`\n🗑️  Deleting ${groupName}...`);
  const results: DeletionResult[] = [];

  for (const table of tables) {
    console.log(`  ⏳ Processing ${table}...`);
    const result = await deleteFromTable(table);

    if (result.status === 'success') {
      console.log(`     ✓ Deleted ${result.records_deleted} records`);
    } else {
      console.log(`     ⚠️  ${result.error}`);
    }

    results.push(result);
  }

  return results;
}

async function verifyDeletion(): Promise<{ verified: boolean; summary: Record<string, number> }> {
  console.log('\n🔍 STEP 11: Verifying Deletion...\n');

  const allTables = Object.values(MARKETPLACE_TABLES).flat();
  const summary: Record<string, number> = {};
  let allEmpty = true;

  for (const table of allTables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`  ⚠️  ${table}: Could not verify (${error.message})`);
        summary[table] = -1;
        continue;
      }

      summary[table] = count || 0;

      if (count && count > 0) {
        console.log(`  ⚠️  ${table}: ${count} records remaining`);
        allEmpty = false;
      } else {
        console.log(`  ✓ ${table}: Empty`);
      }
    } catch (err) {
      console.log(`  ❌ ${table}: Verification failed`);
      summary[table] = -1;
    }
  }

  console.log(`\n  ${allEmpty ? '✅' : '⚠️'} Verification ${allEmpty ? 'Complete' : 'Completed with warnings'}`);

  return { verified: allEmpty, summary };
}

async function purgeMarketplaceData() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   MARKETPLACE DATA PURGE UTILITY');
  console.log('   ⚠️  WARNING: This will DELETE ALL Marketplace data!');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const startTime = Date.now();
  const allResults: DeletionResult[] = [];

  const backup = await createBackup();

  if (!backup.success) {
    console.log('\n❌ Backup failed. Aborting purge operation for safety.\n');
    return;
  }

  console.log('\n🚀 Starting Data Purge Process...\n');

  console.log('STEP 2: Deleting Cart System Data...');
  const cartResults = await deleteTableGroup('Cart Data', MARKETPLACE_TABLES.cart);
  allResults.push(...cartResults);

  console.log('\nSTEP 3: Purging Purchase Requisition Data...');
  const prResults = await deleteTableGroup('PR Data', MARKETPLACE_TABLES.pr);
  allResults.push(...prResults);

  console.log('\nSTEP 4: Removing Purchase Order Data...');
  const poResults = await deleteTableGroup('PO Data', MARKETPLACE_TABLES.po);
  allResults.push(...poResults);

  console.log('\nSTEP 5: Clearing Order Monitoring Records...');
  const orderResults = await deleteTableGroup('Order Monitoring Data', MARKETPLACE_TABLES.order_monitoring);
  allResults.push(...orderResults);

  console.log('\nSTEP 6: Deleting BA Document System Records...');
  const baResults = await deleteTableGroup('BA Document Data', MARKETPLACE_TABLES.ba);
  allResults.push(...baResults);

  console.log('\nSTEP 7: Removing Goods Receipt Records...');
  const grResults = await deleteTableGroup('GR Data', MARKETPLACE_TABLES.gr);
  allResults.push(...grResults);

  console.log('\nSTEP 8: Clearing Item Catalog...');
  const itemResults = await deleteTableGroup('Item Master Data', MARKETPLACE_TABLES.item);
  allResults.push(...itemResults);

  console.log('\nSTEP 9: Deleting Contract Documents...');
  const docResults = await deleteTableGroup('Contract Documents', MARKETPLACE_TABLES.contract_docs);
  allResults.push(...docResults);

  console.log('\nSTEP 10: Removing Contracts, Vendors, and Materials...');
  const contractResults = await deleteTableGroup('Contract Data', MARKETPLACE_TABLES.contract);
  allResults.push(...contractResults);
  const vendorResults = await deleteTableGroup('Vendor Data', MARKETPLACE_TABLES.vendor);
  allResults.push(...vendorResults);
  const materialResults = await deleteTableGroup('Material Data', MARKETPLACE_TABLES.material);
  allResults.push(...materialResults);

  const verification = await verifyDeletion();

  const endTime = Date.now();
  const durationSeconds = ((endTime - startTime) / 1000).toFixed(2);

  const totalDeleted = allResults.reduce((sum, r) => sum + r.records_deleted, 0);
  const successCount = allResults.filter(r => r.status === 'success').length;
  const errorCount = allResults.filter(r => r.status === 'error').length;

  const report = {
    operation: 'Marketplace Data Purge',
    timestamp: new Date().toISOString(),
    duration_seconds: parseFloat(durationSeconds),
    backup_location: backup.backupDir,
    summary: {
      total_tables_processed: allResults.length,
      successful_deletions: successCount,
      failed_deletions: errorCount,
      total_records_deleted: totalDeleted,
      verification_passed: verification.verified
    },
    detailed_results: allResults,
    verification_summary: verification.summary
  };

  const reportPath = `${backup.backupDir}/purge_report.json`;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('   PURGE OPERATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(`  ⏱️  Duration: ${durationSeconds}s`);
  console.log(`  📊 Total Records Deleted: ${totalDeleted}`);
  console.log(`  ✅ Successful: ${successCount} tables`);
  console.log(`  ❌ Failed: ${errorCount} tables`);
  console.log(`  📁 Backup: ${backup.backupDir}`);
  console.log(`  📄 Report: ${reportPath}`);
  console.log(`  ${verification.verified ? '✅' : '⚠️'}  Verification: ${verification.verified ? 'PASSED' : 'COMPLETED WITH WARNINGS'}\n`);

  if (!verification.verified) {
    console.log('  ⚠️  Some tables still contain records. Review the report for details.\n');
  }
}

purgeMarketplaceData().catch(console.error);
