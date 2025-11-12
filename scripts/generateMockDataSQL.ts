import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function executeSQLInserts() {
  console.log('🚀 Starting SQL-Based Mock Data Generation\n');

  const queries = [
    // Step 1: Generate Vendors
    {
      name: 'Generate 50 Vendors',
      sql: `
        INSERT INTO dim_vendor (vendor_id, vendor_name, vendor_category, vendor_address, vendor_contact, vendor_rating, vendor_email, vendor_phone, vendor_city, vendor_province, is_active)
        SELECT
          'VND' || LPAD((ROW_NUMBER() OVER ())::text, 3, '0'),
          'PT ' || (ARRAY['Maju Jaya', 'Sejahtera Abadi', 'Karya Mandiri', 'Berkah Sentosa', 'Wijaya Group', 'Prima Indo', 'Sukses Makmur', 'Nusantara', 'Buana Raya', 'Mekar Jaya'])[CEIL(RANDOM() * 10)::INT] || ' ' || (ARRAY['Indonesia', 'Nusantara', 'Persada', 'Utama', 'Pratama'])[CEIL(RANDOM() * 5)::INT],
          (ARRAY['Construction Materials', 'Industrial Equipment', 'Electronics', 'Safety Equipment', 'Raw Materials'])[CEIL(RANDOM() * 5)::INT],
          'Jl. ' || (ARRAY['Sudirman', 'Thamrin', 'Gatot Subroto', 'Kuningan', 'Rasuna Said'])[CEIL(RANDOM() * 5)::INT] || ' No. ' || CEIL(RANDOM() * 100)::INT,
          (ARRAY['Ahmad', 'Budi', 'Candra', 'Dedi', 'Eko'])[CEIL(RANDOM() * 5)::INT] || ' ' || (ARRAY['Pratama', 'Wijaya', 'Santoso', 'Kusuma', 'Firmansyah'])[CEIL(RANDOM() * 5)::INT],
          3.5 + (RANDOM() * 1.5),
          'vendor' || (ROW_NUMBER() OVER ())::text || '@company.co.id',
          '+62' || LPAD(FLOOR(RANDOM() * 10000000000)::text, 10, '0'),
          (ARRAY['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Palembang'])[CEIL(RANDOM() * 7)::INT],
          'Indonesia',
          true
        FROM generate_series(1, 50);
      `
    },
    // Step 2: Generate Materials
    {
      name: 'Generate 50 Materials',
      sql: `
        INSERT INTO dim_material (material_id, material_description, material_category, unit_of_measure, is_active)
        SELECT
          'MAT-' || LPAD((ROW_NUMBER() OVER ())::text, 4, '0'),
          (ARRAY['Steel Pipes', 'Electrical Cables', 'Concrete Blocks', 'Transformers', 'Circuit Breakers', 'Safety Helmets', 'Work Gloves', 'Measuring Tools', 'Power Generators', 'Control Panels'])[CEIL(RANDOM() * 10)::INT] || ' Type ' || CEIL(RANDOM() * 5)::INT,
          (ARRAY['Construction Materials', 'Electrical Equipment', 'Safety Gear', 'Industrial Tools', 'Power Equipment'])[CEIL(RANDOM() * 5)::INT],
          (ARRAY['PCS', 'M', 'KG', 'SET', 'UNIT'])[CEIL(RANDOM() * 5)::INT],
          true
        FROM generate_series(1, 50);
      `
    },
    // Step 3: Generate Contracts
    {
      name: 'Generate 50 Contracts',
      sql: `
        INSERT INTO dim_contract (contract_id, contract_number, contract_scope, contract_status, contract_start_date, contract_end_date, contract_value_limit, contract_currency, material_id, vendor_id)
        SELECT
          'CNT-2025-' || LPAD(n::text, 3, '0'),
          'CONTRACT-2025-' || LPAD(n::text, 3, '0'),
          'Supply Agreement for ' || m.material_description,
          (ARRAY['Active', 'Active', 'Active', 'Expired'])[CEIL(RANDOM() * 4)::INT],
          '2024-01-01'::date + (RANDOM() * 365)::int,
          '2025-12-31'::date,
          (50000000 + RANDOM() * 450000000)::numeric,
          'IDR',
          m.material_id,
          v.vendor_id
        FROM generate_series(1, 50) n
        CROSS JOIN LATERAL (SELECT material_id, material_description FROM dim_material ORDER BY RANDOM() LIMIT 1) m
        CROSS JOIN LATERAL (SELECT vendor_id FROM dim_vendor ORDER BY RANDOM() LIMIT 1) v;
      `
    },
    // Step 4: Generate Items
    {
      name: 'Generate 50 Items',
      sql: `
        INSERT INTO fact_item_master (item_id, item_name, material_id, material_desc, category, uom, unit_price, stock_qty, contract_id, is_active)
        SELECT
          'ITM' || LPAD(n::text, 3, '0'),
          m.material_description,
          m.material_id,
          m.material_description,
          m.material_category,
          m.unit_of_measure,
          (100000 + RANDOM() * 9900000)::numeric,
          (10 + RANDOM() * 990)::int,
          c.contract_id,
          true
        FROM generate_series(1, 50) n
        CROSS JOIN LATERAL (SELECT material_id, material_description, material_category, unit_of_measure FROM dim_material ORDER BY RANDOM() LIMIT 1) m
        CROSS JOIN LATERAL (SELECT contract_id FROM dim_contract ORDER BY RANDOM() LIMIT 1) c;
      `
    },
    // Step 5: Generate PR Headers
    {
      name: 'Generate 50 PR Headers',
      sql: `
        INSERT INTO fact_pr_header (pr_number, requestor_name, requestor_id, department, pr_date, total_value, currency, pr_status, created_from_contract)
        SELECT
          'PR2025-' || LPAD(n::text, 3, '0'),
          (ARRAY['Ahmad Santoso', 'Budi Prasetyo', 'Candra Wijaya', 'Dedi Firmansyah', 'Eko Kusuma'])[CEIL(RANDOM() * 5)::INT],
          'USR-' || LPAD(CEIL(RANDOM() * 20)::text, 3, '0'),
          (ARRAY['Procurement', 'Engineering', 'Operations', 'Maintenance', 'Production'])[CEIL(RANDOM() * 5)::INT],
          '2025-01-01'::date + (RANDOM() * 90)::int,
          (5000000 + RANDOM() * 45000000)::numeric,
          'IDR',
          CASE
            WHEN RANDOM() < 0.2 THEN 'Draft'
            WHEN RANDOM() < 0.5 THEN 'Pending Approval'
            ELSE 'Approved'
          END,
          c.contract_id
        FROM generate_series(1, 50) n
        CROSS JOIN LATERAL (SELECT contract_id FROM dim_contract ORDER BY RANDOM() LIMIT 1) c;
      `
    },
    // Step 6: Generate PR Lines
    {
      name: 'Generate 50 PR Lines',
      sql: `
        INSERT INTO fact_pr_line (pr_id, pr_number, line_number, item_id, material_id, quantity, uom, unit_price, subtotal)
        SELECT
          pr.pr_id,
          pr.pr_number,
          1,
          i.item_id,
          i.material_id,
          (5 + RANDOM() * 95)::int,
          i.uom,
          i.unit_price,
          ((5 + RANDOM() * 95)::int * i.unit_price)::numeric
        FROM fact_pr_header pr
        CROSS JOIN LATERAL (SELECT item_id, material_id, uom, unit_price FROM fact_item_master ORDER BY RANDOM() LIMIT 1) i;
      `
    },
    // Step 7: Generate PO Headers
    {
      name: 'Generate 50 PO Headers',
      sql: `
        INSERT INTO fact_po_header (po_number, po_line_number, vendor_id, pr_id, pr_number, contract_id, material_id, po_date, delivery_date, expected_delivery_date, po_value, currency, po_status, qty_ordered, qty_received, uom)
        SELECT
          'PO2025-' || LPAD(ROW_NUMBER() OVER ()::text, 3, '0'),
          1,
          c.vendor_id,
          pr.pr_id,
          pr.pr_number,
          pr.created_from_contract,
          prl.material_id,
          pr.pr_date + (5 + RANDOM() * 10)::int,
          pr.pr_date + (20 + RANDOM() * 40)::int,
          pr.pr_date + (20 + RANDOM() * 40)::int,
          prl.subtotal,
          'IDR',
          (ARRAY['Placed', 'Processing', 'Shipped', 'Delivered', 'Inspected', 'GR Posted'])[CEIL(RANDOM() * 6)::INT],
          prl.quantity,
          0,
          prl.uom
        FROM fact_pr_header pr
        JOIN fact_pr_line prl ON pr.pr_id = prl.pr_id
        JOIN dim_contract c ON pr.created_from_contract = c.contract_id
        WHERE pr.pr_status = 'Approved'
        LIMIT 50;
      `
    },
    // Step 8: Generate PO Status Logs
    {
      name: 'Generate PO Status Logs',
      sql: `
        INSERT INTO fact_po_status_log (po_number, po_line_id, step, step_name, step_timestamp, location)
        SELECT
          po.po_number,
          po.po_line_id,
          s.step,
          s.step_name,
          po.po_date + (s.step * 2 + RANDOM() * 5)::int,
          (ARRAY['Jakarta', 'Surabaya', 'Bandung', 'Semarang'])[CEIL(RANDOM() * 4)::INT]
        FROM fact_po_header po
        CROSS JOIN (
          SELECT 1 as step, 'Order Placed' as step_name UNION ALL
          SELECT 2, 'Processing' UNION ALL
          SELECT 3, 'Shipped' UNION ALL
          SELECT 4, 'Delivery'
        ) s;
      `
    },
    // Step 9: Generate BA Pemeriksaan
    {
      name: 'Generate 30 BA Pemeriksaan',
      sql: `
        INSERT INTO fact_ba_pemeriksaan (ba_number, po_number, po_line_id, contract_id, vendor_id, material_id, inspection_date, qty_checked, qty_approved, qty_rejected, uom, document_status, maker_pln, maker_vendor)
        SELECT
          'BAP2025-' || LPAD(ROW_NUMBER() OVER ()::text, 3, '0'),
          po.po_number,
          po.po_line_id,
          po.contract_id,
          po.vendor_id,
          po.material_id,
          po.delivery_date + (1 + RANDOM() * 3)::int,
          po.qty_ordered,
          (po.qty_ordered * (0.95 + RANDOM() * 0.05))::int,
          (po.qty_ordered * (RANDOM() * 0.05))::int,
          po.uom,
          CASE
            WHEN RANDOM() < 0.2 THEN 'Draft'
            WHEN RANDOM() < 0.4 THEN 'Submitted'
            ELSE 'Approved'
          END,
          'Agus Prasetyo (PLN Supervisor)',
          'Vendor Inspector',
          po.delivery_date + (1 + RANDOM() * 3)::int,
          inspection_notes
        FROM fact_po_header po
        WHERE po.po_status IN ('Delivered', 'Inspected', 'GR Posted')
        LIMIT 30;
      `
    },
    // Step 10: Generate BA Serah Terima
    {
      name: 'Generate 18 BA Serah Terima',
      sql: `
        INSERT INTO fact_ba_serah_terima (ba_number, linked_ba_pemeriksaan, linked_ba_pemeriksaan_id, po_number, po_line_id, contract_id, vendor_id, material_id, handover_date, qty_handover, uom, document_status, maker_pln, maker_vendor)
        SELECT
          'BAST2025-' || LPAD(ROW_NUMBER() OVER ()::text, 3, '0'),
          bp.ba_number,
          bp.ba_pemeriksaan_id,
          bp.po_number,
          bp.po_line_id,
          bp.contract_id,
          bp.vendor_id,
          bp.material_id,
          bp.inspection_date + (1 + RANDOM() * 2)::int,
          bp.qty_approved,
          bp.uom,
          CASE
            WHEN RANDOM() < 0.3 THEN 'Draft'
            WHEN RANDOM() < 0.5 THEN 'Submitted'
            ELSE 'Approved'
          END,
          'Handover PLN Officer',
          'Handover Vendor Officer'
        FROM fact_ba_pemeriksaan bp
        WHERE bp.document_status = 'Approved'
        LIMIT 18;
      `
    },
    // Step 11: Generate Goods Receipts
    {
      name: 'Generate 10 Goods Receipts',
      sql: `
        INSERT INTO fact_gr_header (gr_number, ba_serah_terima, ba_serah_terima_id, po_number, po_line_id, contract_id, vendor_id, material_id, gr_date, qty_received, qty_rejected, uom, gr_value, currency, gr_status, created_by)
        SELECT
          'GR2025-' || LPAD(ROW_NUMBER() OVER ()::text, 3, '0'),
          bst.ba_number,
          bst.ba_serah_terima_id,
          bst.po_number,
          bst.po_line_id,
          bst.contract_id,
          bst.vendor_id,
          bst.material_id,
          bst.handover_date + 1,
          bst.qty_handover,
          0,
          bst.uom,
          (bst.qty_handover * 500000)::numeric,
          'IDR',
          CASE WHEN RANDOM() < 0.9 THEN 'Posted' ELSE 'Failed' END,
          'System Auto-Post'
        FROM fact_ba_serah_terima bst
        WHERE bst.document_status = 'Approved'
        LIMIT 10;
      `
    }
  ];

  for (const query of queries) {
    console.log(`📝 ${query.name}...`);
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: query.sql });

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);

        const { error: directError } = await supabase
          .from('_raw_sql_exec')
          .select('*')
          .eq('query', query.sql);

        if (directError) {
          console.log(`   ℹ️  Trying direct execution...`);
        }
      } else {
        console.log(`   ✅ Success`);
      }
    } catch (err) {
      const error = err as Error;
      console.log(`   ⚠️  ${error.message}`);
    }
  }

  console.log('\n✅ Mock data generation completed via SQL!\n');

  console.log('📊 Verifying data...');
  const tables = [
    'dim_vendor', 'dim_material', 'dim_contract',
    'fact_item_master', 'fact_pr_header', 'fact_pr_line',
    'fact_po_header', 'fact_po_status_log',
    'fact_ba_pemeriksaan', 'fact_ba_serah_terima', 'fact_gr_header'
  ];

  for (const table of tables) {
    const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
    console.log(`   ${table}: ${count || 0} records`);
  }
}

executeSQLInserts().catch(console.error);
