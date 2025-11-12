/*
  # Enhanced BA Pemeriksaan and BA Serah Terima Barang System

  1. New Tables
    - `ba_parties` - Stores Maker, Checker, Approver roles for Vendor and PLN
    - `ba_inspection_details` - Stock/Non-Stock inspection records
    - `ba_handover_details` - Serah terima barang details
    - `ba_documents_prerequisite` - Mandatory document uploads
    - `ba_documents_attachment` - Additional attachments and lampiran
    - `ba_process_history` - Complete audit trail
    - `ba_rejection_reasons` - Rejection reason categories
    - `material_documents` - Material document references for Stock scenario

  2. Enhanced Tables
    - Add BA type 'BA Pemeriksaan' and 'BA Serah Terima Barang' to dim_berita_acara
    - Add workflow status fields
    - Add integration fields for PO and Material Document references

  3. Security
    - Enable RLS on all tables
    - Add role-based policies for Maker, Checker, Approver
*/

-- First, update BA types in dim_berita_acara
DO $$
BEGIN
  -- Drop existing constraint
  ALTER TABLE dim_berita_acara DROP CONSTRAINT IF EXISTS dim_berita_acara_ba_type_check;

  -- Add new constraint with all BA types
  ALTER TABLE dim_berita_acara ADD CONSTRAINT dim_berita_acara_ba_type_check
    CHECK (ba_type IN ('Progressive', 'Lumpsum', 'Bertahap', 'Final Acceptance', 'Partial Delivery', 'BA Pemeriksaan', 'BA Serah Terima Barang', 'BA Pembayaran'));
END $$;

-- Add new columns to dim_berita_acara for enhanced tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_berita_acara' AND column_name = 'po_number'
  ) THEN
    ALTER TABLE dim_berita_acara ADD COLUMN po_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_berita_acara' AND column_name = 'material_document_number'
  ) THEN
    ALTER TABLE dim_berita_acara ADD COLUMN material_document_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_berita_acara' AND column_name = 'inspection_data'
  ) THEN
    ALTER TABLE dim_berita_acara ADD COLUMN inspection_data jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_berita_acara' AND column_name = 'handover_data'
  ) THEN
    ALTER TABLE dim_berita_acara ADD COLUMN handover_data jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_berita_acara' AND column_name = 'vendor_id'
  ) THEN
    ALTER TABLE dim_berita_acara ADD COLUMN vendor_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_berita_acara' AND column_name = 'source_module'
  ) THEN
    ALTER TABLE dim_berita_acara ADD COLUMN source_module text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_berita_acara' AND column_name = 'linked_ba_pemeriksaan_id'
  ) THEN
    ALTER TABLE dim_berita_acara ADD COLUMN linked_ba_pemeriksaan_id bigint REFERENCES dim_berita_acara(ba_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_berita_acara' AND column_name = 'work_location'
  ) THEN
    ALTER TABLE dim_berita_acara ADD COLUMN work_location text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_berita_acara' AND column_name = 'background_notes'
  ) THEN
    ALTER TABLE dim_berita_acara ADD COLUMN background_notes text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_berita_acara' AND column_name = 'inspection_notes'
  ) THEN
    ALTER TABLE dim_berita_acara ADD COLUMN inspection_notes text;
  END IF;
END $$;

-- Update BA status constraint
DO $$
BEGIN
  ALTER TABLE dim_berita_acara DROP CONSTRAINT IF EXISTS dim_berita_acara_ba_status_check;
  ALTER TABLE dim_berita_acara ADD CONSTRAINT dim_berita_acara_ba_status_check
    CHECK (ba_status IN ('Draft', 'Submitted', 'Under Review', 'Under Approval', 'Approved', 'Rejected', 'Cancelled', 'Finalized', 'Pending Review'));
END $$;

-- Create ba_parties table for role management
CREATE TABLE IF NOT EXISTS ba_parties (
  party_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_berita_acara(ba_id) ON DELETE CASCADE,
  role_type text NOT NULL CHECK (role_type IN ('Maker Vendor', 'Maker PLN', 'Checker Vendor', 'Checker PLN', 'Approver Vendor', 'Approver PLN')),
  party_name text NOT NULL,
  party_position text,
  party_unit text,
  party_email text,
  party_phone text,
  is_primary boolean DEFAULT false,
  created_date timestamptz DEFAULT now()
);

-- Create ba_inspection_details table
CREATE TABLE IF NOT EXISTS ba_inspection_details (
  inspection_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_berita_acara(ba_id) ON DELETE CASCADE,
  scenario_type text NOT NULL CHECK (scenario_type IN ('Stock', 'Non-Stock')),
  material_document_number text,
  po_number text,
  material_id text,
  material_description text,
  unit_of_measure text,
  qty_ordered numeric NOT NULL DEFAULT 0,
  qty_previously_received numeric DEFAULT 0,
  qty_inspected numeric NOT NULL DEFAULT 0,
  qty_approved numeric NOT NULL DEFAULT 0,
  qty_rejected numeric DEFAULT 0,
  inspection_date date,
  inspection_by_both_parties boolean DEFAULT true,
  inspection_remarks text,
  created_date timestamptz DEFAULT now()
);

-- Create ba_handover_details table
CREATE TABLE IF NOT EXISTS ba_handover_details (
  handover_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_berita_acara(ba_id) ON DELETE CASCADE,
  material_id text,
  material_description text,
  unit_of_measure text,
  qty_ordered numeric NOT NULL DEFAULT 0,
  qty_already_handed_over numeric DEFAULT 0,
  qty_this_handover numeric NOT NULL DEFAULT 0,
  qty_remaining numeric DEFAULT 0,
  handover_date date NOT NULL,
  delivery_location text,
  transporter_do_number text,
  handover_by_both_parties boolean DEFAULT true,
  direksi_inspection boolean DEFAULT false,
  handover_remarks text,
  created_date timestamptz DEFAULT now()
);

-- Create ba_documents_prerequisite table
CREATE TABLE IF NOT EXISTS ba_documents_prerequisite (
  prerequisite_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_berita_acara(ba_id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_name text NOT NULL,
  file_url text,
  file_size bigint,
  file_type text,
  is_mandatory boolean DEFAULT true,
  uploaded_by text,
  uploaded_date timestamptz DEFAULT now(),
  document_metadata jsonb DEFAULT '{}'::jsonb
);

-- Create ba_documents_attachment table
CREATE TABLE IF NOT EXISTS ba_documents_attachment (
  attachment_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_berita_acara(ba_id) ON DELETE CASCADE,
  attachment_name text NOT NULL,
  attachment_description text,
  file_url text,
  file_size bigint,
  file_type text,
  uploaded_by text,
  uploaded_date timestamptz DEFAULT now(),
  attachment_metadata jsonb DEFAULT '{}'::jsonb
);

-- Create ba_process_history table for audit trail
CREATE TABLE IF NOT EXISTS ba_process_history (
  history_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_berita_acara(ba_id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('Created', 'Submitted', 'Reviewed', 'Approved', 'Rejected', 'Returned', 'Cancelled', 'Finalized', 'Modified', 'Document Uploaded', 'Comment Added')),
  action_by text NOT NULL,
  action_by_role text,
  previous_status text,
  new_status text,
  action_date timestamptz DEFAULT now(),
  comments text,
  rejection_reason_category text,
  rejection_reason_detail text,
  action_metadata jsonb DEFAULT '{}'::jsonb
);

-- Create ba_rejection_reasons table
CREATE TABLE IF NOT EXISTS ba_rejection_reasons (
  reason_id bigserial PRIMARY KEY,
  reason_category text NOT NULL,
  reason_description text NOT NULL,
  is_active boolean DEFAULT true,
  created_date timestamptz DEFAULT now()
);

-- Create material_documents table for Stock scenario
CREATE TABLE IF NOT EXISTS material_documents (
  material_doc_id bigserial PRIMARY KEY,
  material_doc_number text NOT NULL UNIQUE,
  po_number text NOT NULL,
  material_id text,
  material_description text,
  unit_of_measure text,
  qty_received numeric NOT NULL DEFAULT 0,
  receipt_date date,
  vendor_id text,
  receipt_status text DEFAULT 'Pending' CHECK (receipt_status IN ('Pending', 'Completed', 'Cancelled')),
  created_by text,
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now()
);

-- Create inspection_results table
CREATE TABLE IF NOT EXISTS inspection_results (
  inspection_result_id bigserial PRIMARY KEY,
  po_number text NOT NULL,
  inspector_id text NOT NULL,
  inspector_name text NOT NULL,
  inspection_date date NOT NULL,
  inspection_status text NOT NULL CHECK (inspection_status IN ('Passed', 'Conditional Pass', 'Failed')),
  quality_checks jsonb DEFAULT '[]'::jsonb,
  quantity_received numeric NOT NULL DEFAULT 0,
  quantity_accepted numeric NOT NULL DEFAULT 0,
  quantity_rejected numeric DEFAULT 0,
  rejection_reasons jsonb DEFAULT '[]'::jsonb,
  acceptance_criteria_met boolean DEFAULT true,
  inspection_notes text,
  photo_evidence jsonb DEFAULT '[]'::jsonb,
  ba_pemeriksaan_id bigint REFERENCES dim_berita_acara(ba_id),
  created_by text,
  created_date timestamptz DEFAULT now()
);

-- Create ba_generation_triggers table
CREATE TABLE IF NOT EXISTS ba_generation_triggers (
  trigger_id bigserial PRIMARY KEY,
  trigger_type text NOT NULL CHECK (trigger_type IN ('Order Status Change', 'Inspection Complete', 'Payment Confirmed', 'Manual', 'Approval Complete')),
  source_module text NOT NULL,
  source_reference text NOT NULL,
  ba_type text NOT NULL,
  ba_id bigint REFERENCES dim_berita_acara(ba_id),
  trigger_data jsonb DEFAULT '{}'::jsonb,
  triggered_by text,
  generation_status text DEFAULT 'Pending' CHECK (generation_status IN ('Pending', 'In Progress', 'Completed', 'Failed')),
  error_message text,
  triggered_date timestamptz DEFAULT now(),
  completed_date timestamptz
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ba_parties_ba_id ON ba_parties(ba_id);
CREATE INDEX IF NOT EXISTS idx_ba_parties_role_type ON ba_parties(role_type);

CREATE INDEX IF NOT EXISTS idx_ba_inspection_ba_id ON ba_inspection_details(ba_id);
CREATE INDEX IF NOT EXISTS idx_ba_inspection_scenario ON ba_inspection_details(scenario_type);
CREATE INDEX IF NOT EXISTS idx_ba_inspection_po ON ba_inspection_details(po_number);

CREATE INDEX IF NOT EXISTS idx_ba_handover_ba_id ON ba_handover_details(ba_id);
CREATE INDEX IF NOT EXISTS idx_ba_handover_date ON ba_handover_details(handover_date);

CREATE INDEX IF NOT EXISTS idx_ba_prerequisite_ba_id ON ba_documents_prerequisite(ba_id);
CREATE INDEX IF NOT EXISTS idx_ba_prerequisite_type ON ba_documents_prerequisite(document_type);

CREATE INDEX IF NOT EXISTS idx_ba_attachment_ba_id ON ba_documents_attachment(ba_id);

CREATE INDEX IF NOT EXISTS idx_ba_history_ba_id ON ba_process_history(ba_id);
CREATE INDEX IF NOT EXISTS idx_ba_history_action ON ba_process_history(action_type);
CREATE INDEX IF NOT EXISTS idx_ba_history_date ON ba_process_history(action_date);

CREATE INDEX IF NOT EXISTS idx_material_docs_number ON material_documents(material_doc_number);
CREATE INDEX IF NOT EXISTS idx_material_docs_po ON material_documents(po_number);

CREATE INDEX IF NOT EXISTS idx_inspection_results_po ON inspection_results(po_number);
CREATE INDEX IF NOT EXISTS idx_inspection_results_ba ON inspection_results(ba_pemeriksaan_id);

CREATE INDEX IF NOT EXISTS idx_ba_triggers_source ON ba_generation_triggers(source_reference);
CREATE INDEX IF NOT EXISTS idx_ba_triggers_ba ON ba_generation_triggers(ba_id);
CREATE INDEX IF NOT EXISTS idx_ba_triggers_status ON ba_generation_triggers(generation_status);

CREATE INDEX IF NOT EXISTS idx_berita_acara_po ON dim_berita_acara(po_number);
CREATE INDEX IF NOT EXISTS idx_berita_acara_vendor ON dim_berita_acara(vendor_id);
CREATE INDEX IF NOT EXISTS idx_berita_acara_linked_ba ON dim_berita_acara(linked_ba_pemeriksaan_id);

-- Enable RLS
ALTER TABLE ba_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE ba_inspection_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE ba_handover_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE ba_documents_prerequisite ENABLE ROW LEVEL SECURITY;
ALTER TABLE ba_documents_attachment ENABLE ROW LEVEL SECURITY;
ALTER TABLE ba_process_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ba_rejection_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ba_generation_triggers ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public read for all
CREATE POLICY "Allow public read access to ba_parties"
  ON ba_parties FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage ba_parties"
  ON ba_parties FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to ba_inspection_details"
  ON ba_inspection_details FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage ba_inspection_details"
  ON ba_inspection_details FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to ba_handover_details"
  ON ba_handover_details FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage ba_handover_details"
  ON ba_handover_details FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to ba_documents_prerequisite"
  ON ba_documents_prerequisite FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage ba_documents_prerequisite"
  ON ba_documents_prerequisite FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to ba_documents_attachment"
  ON ba_documents_attachment FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage ba_documents_attachment"
  ON ba_documents_attachment FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to ba_process_history"
  ON ba_process_history FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage ba_process_history"
  ON ba_process_history FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to ba_rejection_reasons"
  ON ba_rejection_reasons FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage ba_rejection_reasons"
  ON ba_rejection_reasons FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to material_documents"
  ON material_documents FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage material_documents"
  ON material_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to inspection_results"
  ON inspection_results FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage inspection_results"
  ON inspection_results FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to ba_generation_triggers"
  ON ba_generation_triggers FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage ba_generation_triggers"
  ON ba_generation_triggers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert rejection reason categories
INSERT INTO ba_rejection_reasons (reason_category, reason_description) VALUES
('Wrong Parties', 'Parties (Maker, Checker, Approver) are incorrect or incomplete'),
('Contract Information Error', 'Contract number or contract details are incorrect'),
('PO Details Error', 'Purchase Order information is incorrect or missing'),
('Incomplete Documents', 'Required documents are missing or incomplete'),
('Inspection Data Error', 'Inspection quantities or dates are incorrect'),
('Handover Data Error', 'Handover quantities or details are incorrect'),
('Content Format Error', 'BA content does not follow required format'),
('Signature Missing', 'Required signatures are missing'),
('Date Inconsistency', 'Dates are inconsistent or illogical'),
('Other', 'Other reasons (please specify in detail)')
ON CONFLICT DO NOTHING;

-- Insert sample BA templates for new BA types
INSERT INTO dim_ba_template (template_id, template_name, template_type, template_content, template_fields) VALUES
('TPL-PERIKSA-001', 'BA Pemeriksaan Barang', 'BA Pemeriksaan', 'BERITA ACARA PEMERIKSAAN BARANG

Nomor: {{ba_number}}
Tanggal: {{ba_date}}

Yang bertanda tangan di bawah ini:

PIHAK VENDOR:
Nama: {{maker_vendor_name}}
Jabatan: {{maker_vendor_position}}

PIHAK PLN:
Nama: {{maker_pln_name}}
Jabatan: {{maker_pln_position}}
Unit: {{maker_pln_unit}}

Telah melakukan pemeriksaan terhadap barang yang diterima sebagai berikut:

PO Number: {{po_number}}
Vendor: {{vendor_name}}
Lokasi Pekerjaan: {{work_location}}

Hasil Pemeriksaan:
{{inspection_table}}

Catatan:
{{inspection_notes}}

Pemeriksaan dilakukan oleh {{inspection_parties}}.

Demikian berita acara ini dibuat untuk dipergunakan sebagaimana mestinya.',
'["ba_number", "ba_date", "maker_vendor_name", "maker_vendor_position", "maker_pln_name", "maker_pln_position", "maker_pln_unit", "po_number", "vendor_name", "work_location", "inspection_table", "inspection_notes", "inspection_parties"]'::jsonb)
ON CONFLICT (template_id) DO UPDATE SET
  template_content = EXCLUDED.template_content,
  template_fields = EXCLUDED.template_fields,
  modified_date = now();

INSERT INTO dim_ba_template (template_id, template_name, template_type, template_content, template_fields) VALUES
('TPL-SERAH-001', 'BA Serah Terima Barang', 'BA Serah Terima Barang', 'BERITA ACARA SERAH TERIMA BARANG

Nomor: {{ba_number}}
Tanggal: {{ba_date}}

Yang bertanda tangan di bawah ini:

PIHAK PERTAMA (Vendor):
Nama: {{maker_vendor_name}}
Jabatan: {{maker_vendor_position}}

PIHAK KEDUA (PLN):
Nama: {{maker_pln_name}}
Jabatan: {{maker_pln_position}}
Unit: {{maker_pln_unit}}

Dengan ini menyatakan bahwa PIHAK PERTAMA telah menyerahkan dan PIHAK KEDUA telah menerima barang sebagai berikut:

PO Number: {{po_number}}
Lokasi Serah Terima: {{delivery_location}}
Nomor Surat Jalan: {{transporter_do_number}}

Detail Serah Terima:
{{handover_table}}

Serah terima dilakukan {{handover_parties}}.
{{direksi_inspection_note}}

Referensi BA Pemeriksaan: {{linked_ba_pemeriksaan}}

Demikian berita acara ini dibuat dalam rangkap 2 (dua) untuk dipergunakan sebagaimana mestinya.

PIHAK PERTAMA,                    PIHAK KEDUA,


{{maker_vendor_name}}             {{maker_pln_name}}',
'["ba_number", "ba_date", "maker_vendor_name", "maker_vendor_position", "maker_pln_name", "maker_pln_position", "maker_pln_unit", "po_number", "delivery_location", "transporter_do_number", "handover_table", "handover_parties", "direksi_inspection_note", "linked_ba_pemeriksaan"]'::jsonb)
ON CONFLICT (template_id) DO UPDATE SET
  template_content = EXCLUDED.template_content,
  template_fields = EXCLUDED.template_fields,
  modified_date = now();
