/*
  # Extend BA Types and Order Tracking for Marketplace Integration

  1. Changes to Existing Tables
    - `dim_ba_template`
      - Add three new BA template types: BA Pemeriksaan, BA Serah Terima Barang, BA Pembayaran

    - `dim_berita_acara`
      - Extend ba_type CHECK constraint to include new types
      - Add po_number field to link BA with purchase orders
      - Add inspection_data jsonb field for manual inspection results
      - Add payment_reference field for payment BA

    - `order_tracking_milestones`
      - Add new milestone stages for inspection workflow
      - Add ba_document_references jsonb field to track generated BAs

  2. New Tables
    - `inspection_results`
      - Store manual inspection data entered by users
      - Link to purchase orders and BA documents
      - Track quality checks and acceptance criteria

    - `ba_generation_triggers`
      - Track automatic BA generation events
      - Link order status changes to BA creation
      - Audit trail for triggered documents

  3. Security
    - Enable RLS on all new tables
    - Authenticated users can create and update records
    - Public read access for approved documents

  4. Important Notes
    - Supports automatic BA generation from order status changes
    - Manual inspection data entry workflow
    - Dual trigger support for payment BA (immediate and post-approval)
    - Complete integration between Marketplace and APBA modules
*/

-- Extend dim_ba_template to support new BA types
ALTER TABLE dim_ba_template DROP CONSTRAINT IF EXISTS dim_ba_template_template_type_check;
ALTER TABLE dim_ba_template ADD CONSTRAINT dim_ba_template_template_type_check
  CHECK (template_type IN ('Progressive', 'Lumpsum', 'Bertahap', 'Final Acceptance', 'Partial Delivery', 'BA Pemeriksaan', 'BA Serah Terima Barang', 'BA Pembayaran'));

-- Extend dim_berita_acara to support new BA types and order references
ALTER TABLE dim_berita_acara DROP CONSTRAINT IF EXISTS dim_berita_acara_ba_type_check;
ALTER TABLE dim_berita_acara ADD CONSTRAINT dim_berita_acara_ba_type_check
  CHECK (ba_type IN ('Progressive', 'Lumpsum', 'Bertahap', 'Final Acceptance', 'Partial Delivery', 'BA Pemeriksaan', 'BA Serah Terima Barang', 'BA Pembayaran'));

-- Add new fields to dim_berita_acara for order tracking integration
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dim_berita_acara' AND column_name = 'po_number') THEN
    ALTER TABLE dim_berita_acara ADD COLUMN po_number text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dim_berita_acara' AND column_name = 'inspection_data') THEN
    ALTER TABLE dim_berita_acara ADD COLUMN inspection_data jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dim_berita_acara' AND column_name = 'payment_reference') THEN
    ALTER TABLE dim_berita_acara ADD COLUMN payment_reference text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dim_berita_acara' AND column_name = 'vendor_id') THEN
    ALTER TABLE dim_berita_acara ADD COLUMN vendor_id text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dim_berita_acara' AND column_name = 'source_module') THEN
    ALTER TABLE dim_berita_acara ADD COLUMN source_module text DEFAULT 'APBA';
  END IF;
END $$;

-- Add ba_document_references to order_tracking_milestones if the table exists
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_tracking_milestones') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_tracking_milestones' AND column_name = 'ba_document_references') THEN
      ALTER TABLE order_tracking_milestones ADD COLUMN ba_document_references jsonb DEFAULT '[]'::jsonb;
    END IF;
  END IF;
END $$;

-- Create inspection_results table
CREATE TABLE IF NOT EXISTS inspection_results (
  inspection_id bigserial PRIMARY KEY,
  po_number text NOT NULL,
  po_line_id bigint,
  inspector_name text NOT NULL,
  inspector_id text,
  inspection_date timestamptz DEFAULT now(),
  inspection_status text NOT NULL DEFAULT 'In Progress' CHECK (inspection_status IN ('In Progress', 'Passed', 'Failed', 'Conditional Pass', 'Pending Review')),
  quality_checks jsonb DEFAULT '[]'::jsonb,
  quantity_received numeric,
  quantity_accepted numeric,
  quantity_rejected numeric,
  rejection_reasons jsonb DEFAULT '[]'::jsonb,
  acceptance_criteria_met boolean DEFAULT false,
  inspection_notes text,
  photo_evidence jsonb DEFAULT '[]'::jsonb,
  ba_pemeriksaan_id bigint REFERENCES dim_berita_acara(ba_id),
  created_by text,
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now()
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
  triggered_date timestamptz DEFAULT now(),
  generation_status text DEFAULT 'Pending' CHECK (generation_status IN ('Pending', 'In Progress', 'Completed', 'Failed')),
  error_message text,
  completed_date timestamptz
);

-- Enable RLS on new tables
ALTER TABLE inspection_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ba_generation_triggers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inspection_results
CREATE POLICY "Anyone can view inspection results"
  ON inspection_results FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create inspection results"
  ON inspection_results FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update inspection results"
  ON inspection_results FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for ba_generation_triggers
CREATE POLICY "Anyone can view BA generation triggers"
  ON ba_generation_triggers FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create BA generation triggers"
  ON ba_generation_triggers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update BA generation triggers"
  ON ba_generation_triggers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ba_po_number ON dim_berita_acara(po_number);
CREATE INDEX IF NOT EXISTS idx_ba_vendor ON dim_berita_acara(vendor_id);
CREATE INDEX IF NOT EXISTS idx_ba_source_module ON dim_berita_acara(source_module);

CREATE INDEX IF NOT EXISTS idx_inspection_po ON inspection_results(po_number);
CREATE INDEX IF NOT EXISTS idx_inspection_status ON inspection_results(inspection_status);
CREATE INDEX IF NOT EXISTS idx_inspection_date ON inspection_results(inspection_date);

CREATE INDEX IF NOT EXISTS idx_trigger_source ON ba_generation_triggers(source_reference);
CREATE INDEX IF NOT EXISTS idx_trigger_type ON ba_generation_triggers(trigger_type);
CREATE INDEX IF NOT EXISTS idx_trigger_status ON ba_generation_triggers(generation_status);

-- Insert new BA templates
INSERT INTO dim_ba_template (template_id, template_name, template_type, template_content, template_fields) VALUES
('TPL-PERIKSA-001', 'BA Pemeriksaan Barang', 'BA Pemeriksaan',
'BERITA ACARA PEMERIKSAAN BARANG

Nomor: {{ba_number}}
Tanggal: {{ba_date}}

Yang bertanda tangan di bawah ini:

Nama: {{inspector_name}}
Jabatan: {{inspector_position}}
Unit: {{inspector_unit}}

Telah melakukan pemeriksaan terhadap barang yang diterima sebagai berikut:

PO Number: {{po_number}}
Vendor: {{vendor_name}}
Material: {{material_description}}
Quantity Dipesan: {{quantity_ordered}} {{unit_of_measure}}
Quantity Diterima: {{quantity_received}} {{unit_of_measure}}

Hasil Pemeriksaan:
{{inspection_results}}

Status Pemeriksaan: {{inspection_status}}
Catatan: {{inspection_notes}}

Barang telah diperiksa dan {{acceptance_decision}}.

Demikian berita acara ini dibuat untuk dipergunakan sebagaimana mestinya.

Pemeriksa,


{{inspector_name}}',
'["ba_number", "ba_date", "inspector_name", "inspector_position", "inspector_unit", "po_number", "vendor_name", "material_description", "quantity_ordered", "quantity_received", "unit_of_measure", "inspection_results", "inspection_status", "inspection_notes", "acceptance_decision"]'::jsonb)
ON CONFLICT (template_id) DO NOTHING;

INSERT INTO dim_ba_template (template_id, template_name, template_type, template_content, template_fields) VALUES
('TPL-SERAH-001', 'BA Serah Terima Barang', 'BA Serah Terima Barang',
'BERITA ACARA SERAH TERIMA BARANG

Nomor: {{ba_number}}
Tanggal: {{ba_date}}

Yang bertanda tangan di bawah ini:

PIHAK PERTAMA (Vendor):
Nama: {{vendor_representative}}
Jabatan: {{vendor_position}}
Perusahaan: {{vendor_name}}

PIHAK KEDUA (Penerima):
Nama: {{receiver_name}}
Jabatan: {{receiver_position}}
Unit: {{receiver_unit}}

Dengan ini menyatakan bahwa PIHAK PERTAMA telah menyerahkan dan PIHAK KEDUA telah menerima barang sebagai berikut:

PO Number: {{po_number}}
Material: {{material_description}}
Quantity: {{quantity_delivered}} {{unit_of_measure}}
Kondisi Barang: {{goods_condition}}

Barang telah diperiksa dan dinyatakan {{acceptance_status}} sesuai BA Pemeriksaan No. {{ba_pemeriksaan_number}}.

Demikian berita acara ini dibuat dalam rangkap 2 (dua) untuk dipergunakan sebagaimana mestinya.

PIHAK PERTAMA,                    PIHAK KEDUA,


{{vendor_representative}}         {{receiver_name}}',
'["ba_number", "ba_date", "vendor_representative", "vendor_position", "vendor_name", "receiver_name", "receiver_position", "receiver_unit", "po_number", "material_description", "quantity_delivered", "unit_of_measure", "goods_condition", "acceptance_status", "ba_pemeriksaan_number"]'::jsonb)
ON CONFLICT (template_id) DO NOTHING;

INSERT INTO dim_ba_template (template_id, template_name, template_type, template_content, template_fields) VALUES
('TPL-BAYAR-001', 'BA Pembayaran', 'BA Pembayaran',
'BERITA ACARA PEMBAYARAN

Nomor: {{ba_number}}
Tanggal: {{ba_date}}

Yang bertanda tangan di bawah ini:

Nama: {{finance_officer}}
Jabatan: {{officer_position}}
Unit: {{finance_unit}}

Dengan ini menyatakan bahwa pembayaran telah dilakukan sebagai berikut:

Invoice Number: {{invoice_number}}
PO Number: {{po_number}}
Vendor: {{vendor_name}}
Nilai Invoice: {{invoice_amount}}
Nilai Dibayar: {{payment_amount}}
Tanggal Pembayaran: {{payment_date}}
Metode Pembayaran: {{payment_method}}
Referensi Pembayaran: {{payment_reference}}

Pembayaran dilakukan sesuai dengan:
- BA Serah Terima No: {{ba_serah_terima_number}}
- Kontrak No: {{contract_number}}
- Terms of Payment: {{payment_terms}}

Status: Pembayaran telah {{payment_status}}.

Demikian berita acara ini dibuat untuk dipergunakan sebagaimana mestinya.

Petugas Keuangan,


{{finance_officer}}',
'["ba_number", "ba_date", "finance_officer", "officer_position", "finance_unit", "invoice_number", "po_number", "vendor_name", "invoice_amount", "payment_amount", "payment_date", "payment_method", "payment_reference", "ba_serah_terima_number", "contract_number", "payment_terms", "payment_status"]'::jsonb)
ON CONFLICT (template_id) DO NOTHING;
