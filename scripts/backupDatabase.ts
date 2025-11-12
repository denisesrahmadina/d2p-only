import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TABLES = [
  'dim_vendor',
  'dim_material',
  'dim_contract',
  'fact_item_master',
  'fact_pr_header',
  'fact_pr_line',
  'fact_po_header',
  'fact_po_status_log',
  'fact_ba_pemeriksaan',
  'fact_ba_serah_terima',
  'fact_gr_header'
];

async function backupDatabase() {
  console.log('🔄 Starting Database Backup...\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const backupDir = `./backups/${timestamp}`;

  if (!fs.existsSync('./backups')) {
    fs.mkdirSync('./backups');
  }
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const backupSummary: {
    timestamp: string;
    tables: Record<string, { records: number; status: string; error?: string }>;
  } = {
    timestamp: new Date().toISOString(),
    tables: {}
  };

  for (const table of TABLES) {
    try {
      console.log(`📦 Backing up ${table}...`);

      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' });

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
        backupSummary.tables[table] = { records: 0, status: 'error', error: error.message };
        continue;
      }

      const filename = `${backupDir}/${table}.json`;
      fs.writeFileSync(filename, JSON.stringify(data, null, 2));

      console.log(`   ✓ Backed up ${count} records to ${filename}`);
      backupSummary.tables[table] = { records: count || 0, status: 'success' };

    } catch (err) {
      const error = err as Error;
      console.log(`   ❌ Exception: ${error.message}`);
      backupSummary.tables[table] = { records: 0, status: 'error', error: error.message };
    }
  }

  fs.writeFileSync(
    `${backupDir}/backup_summary.json`,
    JSON.stringify(backupSummary, null, 2)
  );

  console.log('\n✅ Backup Complete!');
  console.log(`📁 Backup location: ${backupDir}`);

  const totalRecords = Object.values(backupSummary.tables)
    .reduce((sum: number, t) => sum + (t.records || 0), 0);
  console.log(`📊 Total records backed up: ${totalRecords}`);
}

backupDatabase().catch(console.error);
