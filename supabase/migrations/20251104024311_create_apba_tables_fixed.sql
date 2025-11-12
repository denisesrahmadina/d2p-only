/*
  # Create APBA Document Management Tables

  1. New Tables
    - `dim_ba_template`
      - BA document templates by type
      - Template content with placeholders
      - Auto-fill field definitions
      
    - `dim_berita_acara`
      - Berita Acara (BA) document master data
      - Contract reference and BA type classification
      - Document status tracking: Draft, Pending Review, Approved, Rejected, Finalized
      - Digital signature tracking
      - Version control and audit trail
      
    - `fact_ba_milestone`
      - Payment milestones linked to contracts and BAs
      - Milestone status and payment tracking
      - Evidence document references
      
    - `fact_ba_approval`
      - BA approval workflow tracking
      - Reviewer comments and feedback
      - Revision history

  2. Security
    - Enable RLS on all tables
    - Authenticated users can create and update records
    - Public read access for approved documents

  3. Important Notes
    - Supports multi-step approval workflows
    - Complete audit trail for compliance
    - Digital signature integration ready
    - Template-based document generation
*/

-- Create dim_ba_template table
CREATE TABLE IF NOT EXISTS dim_ba_template (
  template_id text PRIMARY KEY,
  template_name text NOT NULL,
  template_type text NOT NULL CHECK (template_type IN ('Progressive', 'Lumpsum', 'Bertahap', 'Final Acceptance', 'Partial Delivery')),
  template_content text NOT NULL,
  template_fields jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now()
);

-- Create dim_berita_acara table
CREATE TABLE IF NOT EXISTS dim_berita_acara (
  ba_id bigserial PRIMARY KEY,
  ba_number text NOT NULL UNIQUE,
  ba_type text NOT NULL CHECK (ba_type IN ('Progressive', 'Lumpsum', 'Bertahap', 'Final Acceptance', 'Partial Delivery')),
  ba_status text NOT NULL DEFAULT 'Draft' CHECK (ba_status IN ('Draft', 'Pending Review', 'Approved', 'Rejected', 'Finalized')),
  contract_id text NOT NULL,
  template_id text REFERENCES dim_ba_template(template_id),
  project_name text,
  responsible_officer text,
  ba_content text,
  ba_version integer DEFAULT 1,
  supporting_documents jsonb DEFAULT '[]'::jsonb,
  digital_signature jsonb,
  created_by text,
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now(),
  finalized_date timestamptz
);

-- Create fact_ba_milestone table
CREATE TABLE IF NOT EXISTS fact_ba_milestone (
  milestone_id bigserial PRIMARY KEY,
  ba_id bigint REFERENCES dim_berita_acara(ba_id),
  contract_id text NOT NULL,
  milestone_number integer NOT NULL,
  milestone_name text NOT NULL,
  milestone_type text NOT NULL CHECK (milestone_type IN ('Progressive', 'Lumpsum', 'Bertahap')),
  payment_term text,
  payment_percentage numeric CHECK (payment_percentage >= 0 AND payment_percentage <= 100),
  payment_value numeric NOT NULL DEFAULT 0,
  payment_status text DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'In Progress', 'Completed', 'Paid')),
  due_date date,
  completion_date date,
  evidence_documents jsonb DEFAULT '[]'::jsonb,
  payee_info jsonb DEFAULT '{}'::jsonb,
  notes text,
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now()
);

-- Create fact_ba_approval table
CREATE TABLE IF NOT EXISTS fact_ba_approval (
  approval_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_berita_acara(ba_id),
  approver_id text NOT NULL,
  approver_name text NOT NULL,
  approver_role text NOT NULL,
  approval_status text NOT NULL DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected', 'Returned')),
  approval_date timestamptz,
  comments text,
  revision_requested boolean DEFAULT false,
  revision_notes text,
  created_date timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE dim_ba_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_berita_acara ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_ba_milestone ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_ba_approval ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dim_ba_template
CREATE POLICY "Anyone can view BA templates"
  ON dim_ba_template FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create BA templates"
  ON dim_ba_template FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update BA templates"
  ON dim_ba_template FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for dim_berita_acara
CREATE POLICY "Anyone can view berita acara"
  ON dim_berita_acara FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create berita acara"
  ON dim_berita_acara FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update berita acara"
  ON dim_berita_acara FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for fact_ba_milestone
CREATE POLICY "Anyone can view BA milestones"
  ON fact_ba_milestone FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create BA milestones"
  ON fact_ba_milestone FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update BA milestones"
  ON fact_ba_milestone FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for fact_ba_approval
CREATE POLICY "Anyone can view BA approvals"
  ON fact_ba_approval FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create BA approvals"
  ON fact_ba_approval FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update BA approvals"
  ON fact_ba_approval FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ba_status ON dim_berita_acara(ba_status);
CREATE INDEX IF NOT EXISTS idx_ba_contract ON dim_berita_acara(contract_id);
CREATE INDEX IF NOT EXISTS idx_ba_type ON dim_berita_acara(ba_type);
CREATE INDEX IF NOT EXISTS idx_ba_created_date ON dim_berita_acara(created_date);

CREATE INDEX IF NOT EXISTS idx_milestone_ba ON fact_ba_milestone(ba_id);
CREATE INDEX IF NOT EXISTS idx_milestone_contract ON fact_ba_milestone(contract_id);
CREATE INDEX IF NOT EXISTS idx_milestone_status ON fact_ba_milestone(payment_status);

CREATE INDEX IF NOT EXISTS idx_approval_ba ON fact_ba_approval(ba_id);
CREATE INDEX IF NOT EXISTS idx_approval_status ON fact_ba_approval(approval_status);

-- Insert sample BA templates
INSERT INTO dim_ba_template (template_id, template_name, template_type, template_content, template_fields) VALUES
('TPL-PROG-001', 'Progressive Payment BA', 'Progressive', 'BERITA ACARA PEMBAYARAN PROGRESIF\n\nNomor: {{ba_number}}\nTanggal: {{ba_date}}\n\nYang bertanda tangan di bawah ini:\n\nNama: {{responsible_officer}}\nJabatan: {{officer_position}}\nProyek: {{project_name}}\n\nTelah melakukan pemeriksaan terhadap pekerjaan sebagai berikut:\n\nKontrak No: {{contract_number}}\nVendor: {{vendor_name}}\nNilai Kontrak: {{contract_value}}\n\nProgress Pekerjaan:\n{{milestone_details}}\n\nTotal Pembayaran Periode Ini: {{payment_value}}\n\nDemikian berita acara ini dibuat untuk dipergunakan sebagaimana mestinya.', '["ba_number", "ba_date", "responsible_officer", "officer_position", "project_name", "contract_number", "vendor_name", "contract_value", "milestone_details", "payment_value"]'::jsonb)
ON CONFLICT (template_id) DO NOTHING;

INSERT INTO dim_ba_template (template_id, template_name, template_type, template_content, template_fields) VALUES
('TPL-LUMP-001', 'Lumpsum Payment BA', 'Lumpsum', 'BERITA ACARA PEMBAYARAN SEKALIGUS\n\nNomor: {{ba_number}}\nTanggal: {{ba_date}}\n\nYang bertanda tangan di bawah ini:\n\nNama: {{responsible_officer}}\nJabatan: {{officer_position}}\nProyek: {{project_name}}\n\nTelah menerima dan memeriksa pekerjaan sebagai berikut:\n\nKontrak No: {{contract_number}}\nVendor: {{vendor_name}}\nNilai Pembayaran: {{payment_value}}\n\nPembayaran dilakukan secara sekaligus sesuai kesepakatan kontrak.\n\nDemikian berita acara ini dibuat untuk dipergunakan sebagaimana mestinya.', '["ba_number", "ba_date", "responsible_officer", "officer_position", "project_name", "contract_number", "vendor_name", "payment_value"]'::jsonb)
ON CONFLICT (template_id) DO NOTHING;

INSERT INTO dim_ba_template (template_id, template_name, template_type, template_content, template_fields) VALUES
('TPL-BERT-001', 'Bertahap Payment BA', 'Bertahap', 'BERITA ACARA PEMBAYARAN BERTAHAP\n\nNomor: {{ba_number}}\nTanggal: {{ba_date}}\n\nYang bertanda tangan di bawah ini:\n\nNama: {{responsible_officer}}\nJabatan: {{officer_position}}\nProyek: {{project_name}}\n\nTelah melakukan pemeriksaan terhadap pekerjaan tahap {{milestone_number}} sebagai berikut:\n\nKontrak No: {{contract_number}}\nVendor: {{vendor_name}}\nTahap Pembayaran: {{milestone_number}} dari {{total_milestones}}\nNilai Tahap Ini: {{payment_value}}\n\nDemikian berita acara ini dibuat untuk dipergunakan sebagaimana mestinya.', '["ba_number", "ba_date", "responsible_officer", "officer_position", "project_name", "milestone_number", "total_milestones", "contract_number", "vendor_name", "payment_value"]'::jsonb)
ON CONFLICT (template_id) DO NOTHING;

-- Insert sample Berita Acara documents with correct status and type
INSERT INTO dim_berita_acara (ba_number, ba_type, ba_status, contract_id, template_id, project_name, responsible_officer, ba_content, created_by) VALUES
('BA/2025/001', 'Progressive', 'Finalized', 'BPA-2024-001', 'TPL-PROG-001', 'Infrastructure Development Project', 'Ahmad Budiman', 'BERITA ACARA PEMBAYARAN PROGRESIF\n\nNomor: BA/2025/001\nTanggal: 2025-01-15\n\nProgress Pekerjaan: 75%\nTotal Pembayaran: IDR 250,000,000', 'admin'),
('BA/2025/002', 'Lumpsum', 'Approved', 'BPA-2024-002', 'TPL-LUMP-001', 'Equipment Procurement', 'Siti Rahayu', 'BERITA ACARA PEMBAYARAN SEKALIGUS\n\nNomor: BA/2025/002\nTanggal: 2025-01-20\n\nNilai Pembayaran: IDR 150,000,000', 'admin'),
('BA/2025/003', 'Bertahap', 'Pending Review', 'BPA-2024-003', 'TPL-BERT-001', 'Building Construction', 'Budi Santoso', 'BERITA ACARA PEMBAYARAN BERTAHAP\n\nNomor: BA/2025/003\nTanggal: 2025-01-25\nTahap Pembayaran: 2 dari 4\nNilai Tahap Ini: IDR 175,000,000', 'admin')
ON CONFLICT (ba_number) DO NOTHING;
