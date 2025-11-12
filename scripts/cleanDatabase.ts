import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cleanDatabase() {
  console.log('🧹 Starting Database Cleanup...\n');
  console.log('⚠️  This will DELETE ALL data from procurement tables!\n');

  const tablesToClean = [
    { name: 'fact_gr_header', description: 'Goods Receipts' },
    { name: 'fact_ba_serah_terima', description: 'BA Serah Terima' },
    { name: 'fact_ba_pemeriksaan', description: 'BA Pemeriksaan' },
    { name: 'fact_po_status_log', description: 'PO Status Logs' },
    { name: 'fact_po_header', description: 'Purchase Orders' },
    { name: 'fact_pr_line', description: 'PR Line Items' },
    { name: 'fact_pr_header', description: 'Procurement Requests' },
    { name: 'fact_item_master', description: 'Item Master' },
    { name: 'dim_contract', description: 'Contracts' },
    { name: 'dim_vendor', description: 'Vendors' },
    { name: 'dim_material', description: 'Materials' }
  ];

  let totalDeleted = 0;

  for (const table of tablesToClean) {
    try {
      console.log(`🗑️  Cleaning ${table.description} (${table.name})...`);

      const { error: deleteError, count } = await supabase
        .from(table.name)
        .delete()
        .neq('created_date', '1900-01-01');

      if (deleteError) {
        console.log(`   ⚠️  Error: ${deleteError.message}`);
        console.log(`   Trying alternative cleanup method...`);

        const { data: allData } = await supabase
          .from(table.name)
          .select('*');

        if (allData && allData.length > 0) {
          for (const record of allData) {
            const primaryKey = Object.keys(record)[0];
            await supabase
              .from(table.name)
              .delete()
              .eq(primaryKey, record[primaryKey]);
          }
          console.log(`   ✓ Deleted ${allData.length} records`);
          totalDeleted += allData.length;
        } else {
          console.log(`   ✓ Table already empty`);
        }
      } else {
        console.log(`   ✓ Deleted ${count || 0} records`);
        totalDeleted += count || 0;
      }

    } catch (err) {
      const error = err as Error;
      console.log(`   ❌ Exception: ${error.message}`);
    }
  }

  console.log('\n✅ Database Cleanup Complete!');
  console.log(`📊 Total records deleted: ${totalDeleted}`);
  console.log('\n💡 Database is now ready for mock data generation.');
}

cleanDatabase().catch(console.error);
