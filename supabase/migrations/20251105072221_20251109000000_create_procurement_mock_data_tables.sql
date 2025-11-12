-- ============================================================================
-- ITEM MASTER TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS fact_item_master (
  item_id text PRIMARY KEY,
  item_name text NOT NULL,
  material_id text REFERENCES dim_material(material_id),
  material_desc text NOT NULL,
  category text NOT NULL,
  uom text NOT NULL DEFAULT 'pcs',
  unit_price numeric NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  stock_qty integer NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  image_url text,
  contract_id text REFERENCES dim_contract(contract_id),
  is_active boolean DEFAULT true,
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now()
);

-- ============================================================================
-- PROCUREMENT REQUEST TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS fact_pr_header (
  pr_id bigserial PRIMARY KEY,
  pr_number text NOT NULL UNIQUE,
  requestor_name text NOT NULL,
  requestor_id text,
  department text NOT NULL,
  pr_date date NOT NULL DEFAULT CURRENT_DATE,
  total_value numeric NOT NULL DEFAULT 0 CHECK (total_value >= 0),
  currency text NOT NULL DEFAULT 'IDR',
  pr_status text NOT NULL DEFAULT 'Draft'
    CHECK (pr_status IN ('Draft', 'Pending Approval', 'Approved', 'Rejected', 'In Procurement', 'Completed')),
  approver_name text,
  approver_id text,
  approval_date date,
  created_from_contract text REFERENCES dim_contract(contract_id),
  notes text,
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fact_pr_line (
  pr_line_id bigserial PRIMARY KEY,
  pr_id bigint NOT NULL REFERENCES fact_pr_header(pr_id) ON DELETE CASCADE,
  pr_number text NOT NULL,
  line_number integer NOT NULL DEFAULT 1,
  item_id text REFERENCES fact_item_master(item_id),
  material_id text REFERENCES dim_material(material_id),
  quantity integer NOT NULL CHECK (quantity > 0),
  uom text NOT NULL DEFAULT 'pcs',
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  subtotal numeric NOT NULL CHECK (subtotal >= 0),
  notes text,
  created_date timestamptz DEFAULT now(),
  CONSTRAINT unique_pr_line UNIQUE (pr_id, line_number)
);

-- ============================================================================
-- PURCHASE ORDER TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS fact_po_header (
  po_line_id bigserial PRIMARY KEY,
  po_number text NOT NULL,
  po_line_number integer NOT NULL DEFAULT 1,
  vendor_id text NOT NULL REFERENCES dim_vendor(vendor_id),
  pr_id bigint REFERENCES fact_pr_header(pr_id),
  pr_number text,
  contract_id text REFERENCES dim_contract(contract_id),
  material_id text REFERENCES dim_material(material_id),
  po_date date NOT NULL DEFAULT CURRENT_DATE,
  delivery_date date,
  expected_delivery_date date,
  po_value numeric NOT NULL DEFAULT 0 CHECK (po_value >= 0),
  currency text NOT NULL DEFAULT 'IDR',
  po_status text NOT NULL DEFAULT 'Placed'
    CHECK (po_status IN ('Placed', 'Processing', 'Shipped', 'Delivered', 'Inspected', 'GR Posted', 'Cancelled')),
  qty_ordered integer NOT NULL CHECK (qty_ordered > 0),
  qty_received integer DEFAULT 0 CHECK (qty_received >= 0),
  uom text NOT NULL DEFAULT 'pcs',
  po_description text,
  receiving_unit_id text,
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now(),
  CONSTRAINT unique_po_line UNIQUE (po_number, po_line_number)
);

CREATE TABLE IF NOT EXISTS fact_po_status_log (
  log_id bigserial PRIMARY KEY,
  po_number text NOT NULL,
  po_line_id bigint REFERENCES fact_po_header(po_line_id),
  step integer NOT NULL CHECK (step >= 1 AND step <= 7),
  step_name text NOT NULL,
  step_timestamp timestamptz NOT NULL DEFAULT now(),
  location text,
  remarks text,
  created_date timestamptz DEFAULT now()
);

-- ============================================================================
-- BA PEMERIKSAAN (INSPECTION) TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS fact_ba_pemeriksaan (
  ba_pemeriksaan_id bigserial PRIMARY KEY,
  ba_number text NOT NULL UNIQUE,
  po_number text NOT NULL,
  po_line_id bigint REFERENCES fact_po_header(po_line_id),
  contract_id text NOT NULL REFERENCES dim_contract(contract_id),
  vendor_id text NOT NULL REFERENCES dim_vendor(vendor_id),
  material_id text REFERENCES dim_material(material_id),
  inspection_date date NOT NULL,
  qty_checked integer NOT NULL CHECK (qty_checked >= 0),
  qty_approved integer NOT NULL CHECK (qty_approved >= 0),
  qty_rejected integer NOT NULL DEFAULT 0 CHECK (qty_rejected >= 0),
  uom text NOT NULL DEFAULT 'pcs',
  document_status text NOT NULL DEFAULT 'Draft'
    CHECK (document_status IN ('Draft', 'Submitted', 'Approved', 'Rejected')),
  maker_pln text NOT NULL,
  maker_vendor text NOT NULL,
  checker_pln text,
  approver_pln text,
  approval_date date,
  inspection_notes text,
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now(),
  CONSTRAINT check_qty_approved_valid CHECK (qty_approved <= qty_checked),
  CONSTRAINT check_qty_rejected_valid CHECK (qty_rejected = qty_checked - qty_approved)
);

-- ============================================================================
-- BA SERAH TERIMA (HANDOVER) TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS fact_ba_serah_terima (
  ba_serah_terima_id bigserial PRIMARY KEY,
  ba_number text NOT NULL UNIQUE,
  linked_ba_pemeriksaan text REFERENCES fact_ba_pemeriksaan(ba_number),
  linked_ba_pemeriksaan_id bigint REFERENCES fact_ba_pemeriksaan(ba_pemeriksaan_id),
  po_number text NOT NULL,
  po_line_id bigint REFERENCES fact_po_header(po_line_id),
  contract_id text NOT NULL REFERENCES dim_contract(contract_id),
  vendor_id text NOT NULL REFERENCES dim_vendor(vendor_id),
  material_id text REFERENCES dim_material(material_id),
  handover_date date NOT NULL,
  qty_handover integer NOT NULL CHECK (qty_handover > 0),
  uom text NOT NULL DEFAULT 'pcs',
  document_status text NOT NULL DEFAULT 'Draft'
    CHECK (document_status IN ('Draft', 'Submitted', 'Approved', 'Rejected')),
  maker_pln text NOT NULL,
  maker_vendor text NOT NULL,
  approver_pln text,
  approval_date date,
  handover_notes text,
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now()
);

-- ============================================================================
-- GOODS RECEIPT TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS fact_gr_header (
  gr_id bigserial PRIMARY KEY,
  gr_number text NOT NULL UNIQUE,
  ba_serah_terima text REFERENCES fact_ba_serah_terima(ba_number),
  ba_serah_terima_id bigint REFERENCES fact_ba_serah_terima(ba_serah_terima_id),
  po_number text NOT NULL,
  po_line_id bigint REFERENCES fact_po_header(po_line_id),
  contract_id text NOT NULL REFERENCES dim_contract(contract_id),
  vendor_id text NOT NULL REFERENCES dim_vendor(vendor_id),
  material_id text REFERENCES dim_material(material_id),
  gr_date date NOT NULL DEFAULT CURRENT_DATE,
  qty_received integer NOT NULL CHECK (qty_received > 0),
  qty_rejected integer DEFAULT 0 CHECK (qty_rejected >= 0),
  uom text NOT NULL DEFAULT 'pcs',
  gr_value numeric NOT NULL DEFAULT 0 CHECK (gr_value >= 0),
  currency text NOT NULL DEFAULT 'IDR',
  gr_status text NOT NULL DEFAULT 'Posted'
    CHECK (gr_status IN ('Posted', 'Failed', 'Cancelled')),
  gr_notes text,
  created_by text,
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_item_master_contract ON fact_item_master(contract_id);
CREATE INDEX IF NOT EXISTS idx_item_master_material ON fact_item_master(material_id);
CREATE INDEX IF NOT EXISTS idx_item_master_category ON fact_item_master(category);
CREATE INDEX IF NOT EXISTS idx_item_master_active ON fact_item_master(is_active);

CREATE INDEX IF NOT EXISTS idx_pr_header_status ON fact_pr_header(pr_status);
CREATE INDEX IF NOT EXISTS idx_pr_header_date ON fact_pr_header(pr_date DESC);
CREATE INDEX IF NOT EXISTS idx_pr_header_contract ON fact_pr_header(created_from_contract);
CREATE INDEX IF NOT EXISTS idx_pr_line_pr_id ON fact_pr_line(pr_id);
CREATE INDEX IF NOT EXISTS idx_pr_line_item ON fact_pr_line(item_id);

CREATE INDEX IF NOT EXISTS idx_po_header_number ON fact_po_header(po_number);
CREATE INDEX IF NOT EXISTS idx_po_header_vendor ON fact_po_header(vendor_id);
CREATE INDEX IF NOT EXISTS idx_po_header_pr ON fact_po_header(pr_id);
CREATE INDEX IF NOT EXISTS idx_po_header_status ON fact_po_header(po_status);
CREATE INDEX IF NOT EXISTS idx_po_header_date ON fact_po_header(po_date DESC);
CREATE INDEX IF NOT EXISTS idx_po_status_log_po ON fact_po_status_log(po_number);

CREATE INDEX IF NOT EXISTS idx_ba_pemeriksaan_po ON fact_ba_pemeriksaan(po_number);
CREATE INDEX IF NOT EXISTS idx_ba_pemeriksaan_contract ON fact_ba_pemeriksaan(contract_id);
CREATE INDEX IF NOT EXISTS idx_ba_pemeriksaan_vendor ON fact_ba_pemeriksaan(vendor_id);
CREATE INDEX IF NOT EXISTS idx_ba_pemeriksaan_status ON fact_ba_pemeriksaan(document_status);
CREATE INDEX IF NOT EXISTS idx_ba_pemeriksaan_date ON fact_ba_pemeriksaan(inspection_date DESC);

CREATE INDEX IF NOT EXISTS idx_ba_serah_terima_po ON fact_ba_serah_terima(po_number);
CREATE INDEX IF NOT EXISTS idx_ba_serah_terima_linked ON fact_ba_serah_terima(linked_ba_pemeriksaan);
CREATE INDEX IF NOT EXISTS idx_ba_serah_terima_contract ON fact_ba_serah_terima(contract_id);
CREATE INDEX IF NOT EXISTS idx_ba_serah_terima_status ON fact_ba_serah_terima(document_status);
CREATE INDEX IF NOT EXISTS idx_ba_serah_terima_date ON fact_ba_serah_terima(handover_date DESC);

CREATE INDEX IF NOT EXISTS idx_gr_header_po ON fact_gr_header(po_number);
CREATE INDEX IF NOT EXISTS idx_gr_header_ba ON fact_gr_header(ba_serah_terima);
CREATE INDEX IF NOT EXISTS idx_gr_header_contract ON fact_gr_header(contract_id);
CREATE INDEX IF NOT EXISTS idx_gr_header_vendor ON fact_gr_header(vendor_id);
CREATE INDEX IF NOT EXISTS idx_gr_header_status ON fact_gr_header(gr_status);
CREATE INDEX IF NOT EXISTS idx_gr_header_date ON fact_gr_header(gr_date DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE fact_item_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_pr_header ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_pr_line ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_po_header ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_po_status_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_ba_pemeriksaan ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_ba_serah_terima ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_gr_header ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view items"
  ON fact_item_master FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create items"
  ON fact_item_master FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update items"
  ON fact_item_master FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view PRs"
  ON fact_pr_header FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create PRs"
  ON fact_pr_header FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update PRs"
  ON fact_pr_header FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view PR lines"
  ON fact_pr_line FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create PR lines"
  ON fact_pr_line FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view POs"
  ON fact_po_header FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create POs"
  ON fact_po_header FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update POs"
  ON fact_po_header FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view PO status logs"
  ON fact_po_status_log FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create PO status logs"
  ON fact_po_status_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view BA Pemeriksaan"
  ON fact_ba_pemeriksaan FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create BA Pemeriksaan"
  ON fact_ba_pemeriksaan FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update BA Pemeriksaan"
  ON fact_ba_pemeriksaan FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view BA Serah Terima"
  ON fact_ba_serah_terima FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create BA Serah Terima"
  ON fact_ba_serah_terima FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update BA Serah Terima"
  ON fact_ba_serah_terima FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view GRs"
  ON fact_gr_header FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create GRs"
  ON fact_gr_header FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update GRs"
  ON fact_gr_header FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);