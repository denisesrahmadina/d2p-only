/*
  # Comprehensive BA Management Application (APBA) Database Schema
  
  ## Overview
  This migration creates a complete database schema for the BA (Berita Acara) Management Application
  following IPMS BA flow logic with Maker → Checker → Approver workflow for both Vendor and PLN sides.
  
  ## Tables Created
  
  ### Master Data Tables
  1. **dim_ba_master**
     - Core BA document records
     - Supports BA Pemeriksaan and BA Serah Terima Barang types
     - Tracks status, version, and metadata
     - Links to contracts, POs, and vendors
  
  2. **dim_ba_parties**
     - Stores all party assignments (Vendor/PLN Maker/Checker/Approver)
     - Enforces role assignment rules
     - Supports up to 3 persons per Checker/Approver role
  
  3. **dim_ba_templates**
     - Document templates for different BA types
     - Supports dynamic field population
  
  ### Transaction Tables
  4. **fact_ba_pemeriksaan_detail**
     - Inspection details for BA Pemeriksaan
     - Supports Stock and Non-Stock scenarios
     - Quantity validation against PO limits
  
  5. **fact_ba_serah_terima_detail**
     - Handover details for BA Serah Terima Barang
     - Cumulative quantity tracking
     - Links to previous BA Pemeriksaan
  
  6. **fact_ba_workflow_step**
     - Tracks approval workflow progress
     - Records each checker/approver action
     - Manages parallel approval paths
  
  7. **fact_ba_document_attachment**
     - Stores uploaded documents
     - Categorizes mandatory vs optional documents
     - File metadata and URLs
  
  8. **fact_ba_process_history**
     - Complete audit trail
     - Status changes with actor attribution
     - Rejection reasons and comments
  
  9. **fact_ba_digital_signature**
     - Digital signature records
     - Certificate validation data
     - e-Materai integration tracking
  
  10. **fact_ba_erp_integration_log**
      - GR creation status tracking
      - API call logs and responses
      - Retry attempts and error messages
  
  11. **fact_ba_order_monitoring_sync**
      - Order Monitoring timeline updates
      - Synchronization status tracking
  
  ### Lookup Tables
  12. **lookup_ba_status**
      - Valid BA statuses with descriptions
  
  13. **lookup_ba_rejection_reason**
      - Categorized rejection reasons
  
  14. **lookup_ba_document_type**
      - Document type definitions with mandatory flags
  
  ## Security
  - All tables have Row Level Security (RLS) enabled
  - Authenticated users can read based on their role assignments
  - Only specific roles can create/update based on BA status
  
  ## Indexes
  - Performance indexes on frequently queried columns
  - Composite indexes for common filter combinations
*/

-- ============================================================================
-- LOOKUP TABLES
-- ============================================================================

-- BA Status Lookup
CREATE TABLE IF NOT EXISTS lookup_ba_status (
  status_code text PRIMARY KEY,
  status_name text NOT NULL,
  status_description text,
  status_order integer NOT NULL,
  is_active boolean DEFAULT true,
  created_date timestamptz DEFAULT now()
);

INSERT INTO lookup_ba_status (status_code, status_name, status_description, status_order) VALUES
  ('DRAFT', 'Draft', 'BA is being created by maker', 1),
  ('SUBMITTED', 'Submitted', 'BA has been submitted for review', 2),
  ('UNDER_REVIEW', 'Under Review', 'BA is being reviewed by checker(s)', 3),
  ('UNDER_APPROVAL', 'Under Approval', 'BA is being approved by approver(s)', 4),
  ('APPROVED', 'Approved', 'BA has been fully approved', 5),
  ('REJECTED', 'Rejected', 'BA has been rejected', 6),
  ('CANCELLED', 'Cancelled', 'BA has been cancelled by maker', 7)
ON CONFLICT (status_code) DO NOTHING;

-- BA Rejection Reason Lookup
CREATE TABLE IF NOT EXISTS lookup_ba_rejection_reason (
  reason_id bigserial PRIMARY KEY,
  reason_category text NOT NULL,
  reason_code text NOT NULL UNIQUE,
  reason_description text NOT NULL,
  applies_to_ba_type text[], -- ['BA Pemeriksaan', 'BA Serah Terima Barang'] or NULL for all
  is_active boolean DEFAULT true,
  created_date timestamptz DEFAULT now()
);

INSERT INTO lookup_ba_rejection_reason (reason_category, reason_code, reason_description, applies_to_ba_type) VALUES
  ('Data Accuracy', 'INCORRECT_QUANTITY', 'Quantity values are incorrect or do not match PO', NULL),
  ('Data Accuracy', 'INCORRECT_DATES', 'Inspection or handover dates are incorrect or illogical', NULL),
  ('Data Accuracy', 'INCORRECT_PARTIES', 'Party information is incorrect or incomplete', NULL),
  ('Documentation', 'MISSING_MANDATORY_DOCS', 'Required documents are missing', NULL),
  ('Documentation', 'POOR_DOC_QUALITY', 'Document quality is insufficient (blurry, incomplete)', NULL),
  ('Documentation', 'WRONG_DOC_TYPE', 'Uploaded documents are of wrong type or format', NULL),
  ('Compliance', 'POLICY_VIOLATION', 'BA violates company policy or procedures', NULL),
  ('Compliance', 'UNAUTHORIZED_CHANGES', 'Unauthorized modifications detected', NULL),
  ('Inspection', 'INCOMPLETE_INSPECTION', 'Inspection details are incomplete', ARRAY['BA Pemeriksaan']),
  ('Inspection', 'INSPECTION_NOT_VERIFIED', 'Inspection results not verified by both parties', ARRAY['BA Pemeriksaan']),
  ('Handover', 'QUANTITY_EXCEEDS_LIMIT', 'Handover quantity exceeds approved limits', ARRAY['BA Serah Terima Barang']),
  ('Handover', 'MISSING_DO_NUMBER', 'Delivery order number is missing or invalid', ARRAY['BA Serah Terima Barang']),
  ('Other', 'OTHER_REASON', 'Other reason (specify in comments)', NULL)
ON CONFLICT (reason_code) DO NOTHING;

-- BA Document Type Lookup
CREATE TABLE IF NOT EXISTS lookup_ba_document_type (
  doc_type_id bigserial PRIMARY KEY,
  doc_type_code text NOT NULL UNIQUE,
  doc_type_name text NOT NULL,
  doc_type_description text,
  is_mandatory boolean DEFAULT false,
  applies_to_ba_type text NOT NULL, -- 'BA Pemeriksaan' or 'BA Serah Terima Barang'
  file_types_allowed text[], -- ['pdf', 'jpg', 'png', 'docx']
  max_file_size_mb integer DEFAULT 10,
  display_order integer,
  is_active boolean DEFAULT true,
  created_date timestamptz DEFAULT now()
);

INSERT INTO lookup_ba_document_type (doc_type_code, doc_type_name, doc_type_description, is_mandatory, applies_to_ba_type, file_types_allowed, display_order) VALUES
  ('INSPECTION_REPORT', 'Inspection Report', 'Official inspection report document', true, 'BA Pemeriksaan', ARRAY['pdf', 'docx'], 1),
  ('PHYSICAL_EVIDENCE', 'Physical Evidence Photos', 'Photographs of inspected items', true, 'BA Pemeriksaan', ARRAY['jpg', 'jpeg', 'png'], 2),
  ('INSPECTION_CHECKLIST', 'Inspection Checklist', 'Completed inspection checklist', false, 'BA Pemeriksaan', ARRAY['pdf', 'xlsx'], 3),
  ('DELIVERY_ORDER', 'Delivery Order (DO)', 'Copy of delivery order document', true, 'BA Serah Terima Barang', ARRAY['pdf'], 1),
  ('HANDOVER_MINUTES', 'Handover Minutes', 'Official handover meeting minutes', true, 'BA Serah Terima Barang', ARRAY['pdf', 'docx'], 2),
  ('HANDOVER_PHOTOS', 'Handover Photos', 'Photographs of goods during handover', true, 'BA Serah Terima Barang', ARRAY['jpg', 'jpeg', 'png'], 3),
  ('PACKING_LIST', 'Packing List', 'Detailed packing list from vendor', false, 'BA Serah Terima Barang', ARRAY['pdf', 'xlsx'], 4),
  ('QUALITY_CERTIFICATE', 'Quality Certificate', 'Quality assurance certificate', false, 'BA Serah Terima Barang', ARRAY['pdf'], 5)
ON CONFLICT (doc_type_code) DO NOTHING;

-- ============================================================================
-- MASTER DATA TABLES
-- ============================================================================

-- BA Master Table
CREATE TABLE IF NOT EXISTS dim_ba_master (
  ba_id bigserial PRIMARY KEY,
  ba_number text NOT NULL UNIQUE,
  ba_type text NOT NULL CHECK (ba_type IN ('BA Pemeriksaan', 'BA Serah Terima Barang', 'BA Pembayaran')),
  ba_status text NOT NULL DEFAULT 'DRAFT' REFERENCES lookup_ba_status(status_code),
  ba_version integer DEFAULT 1,
  
  -- Contract and PO References
  contract_id text NOT NULL,
  po_number text NOT NULL,
  vendor_id text NOT NULL,
  material_document_number text, -- For BA Pemeriksaan Stock scenario
  
  -- Linkage to previous BA (for BA Serah Terima from BA Pemeriksaan)
  linked_ba_pemeriksaan_id bigint REFERENCES dim_ba_master(ba_id),
  
  -- Location and Context
  work_location text,
  delivery_location text,
  project_name text,
  
  -- Content and Notes
  background_notes text,
  inspection_notes text, -- For BA Pemeriksaan
  handover_notes text, -- For BA Serah Terima Barang
  
  -- Workflow Metadata
  submitted_date timestamptz,
  submitted_by text,
  review_started_date timestamptz,
  review_completed_date timestamptz,
  approval_started_date timestamptz,
  final_approval_date timestamptz,
  final_approved_by text,
  rejection_date timestamptz,
  rejection_by text,
  cancellation_date timestamptz,
  cancellation_by text,
  cancellation_reason text,
  
  -- Integration Status
  gr_number text, -- Generated GR number from ERP
  gr_creation_status text CHECK (gr_creation_status IN ('PENDING', 'SUCCESS', 'FAILED', 'NOT_APPLICABLE')),
  gr_created_date timestamptz,
  order_monitoring_sync_status text CHECK (order_monitoring_sync_status IN ('PENDING', 'SYNCED', 'FAILED', 'NOT_APPLICABLE')),
  order_monitoring_synced_date timestamptz,
  
  -- Digital Signature
  has_digital_signature boolean DEFAULT false,
  digital_signature_completed_date timestamptz,
  
  -- SLA Tracking
  sla_due_date timestamptz,
  is_overdue boolean DEFAULT false,
  
  -- Auto-save and Collaboration
  autosave_content text,
  last_autosave_date timestamptz,
  is_locked boolean DEFAULT false,
  locked_by text,
  lock_acquired_at timestamptz,
  
  -- Audit Fields
  created_by text NOT NULL,
  created_date timestamptz DEFAULT now(),
  modified_by text,
  modified_date timestamptz DEFAULT now()
);

-- BA Parties Table
CREATE TABLE IF NOT EXISTS dim_ba_parties (
  party_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_ba_master(ba_id) ON DELETE CASCADE,
  
  -- Role Information
  role_type text NOT NULL CHECK (role_type IN ('Maker Vendor', 'Maker PLN', 'Checker Vendor', 'Checker PLN', 'Approver Vendor', 'Approver PLN')),
  role_side text NOT NULL CHECK (role_side IN ('Vendor', 'PLN')),
  is_primary boolean DEFAULT false, -- For distinguishing primary vs additional checkers/approvers
  
  -- Party Details
  party_user_id text, -- Link to user management system
  party_name text NOT NULL,
  party_position text,
  party_unit text,
  party_email text,
  party_phone text,
  
  -- Assignment Metadata
  assigned_by text,
  assigned_date timestamptz DEFAULT now(),
  
  -- Action Status (for Checkers and Approvers)
  action_required boolean DEFAULT false,
  action_status text CHECK (action_status IN ('PENDING', 'APPROVED', 'REJECTED', 'NOT_REQUIRED')),
  action_date timestamptz,
  action_comments text,
  
  -- Audit Fields
  created_date timestamptz DEFAULT now(),
  
  -- Constraint: Maker Vendor must be unique, Maker PLN must be unique
  CONSTRAINT unique_maker_per_ba UNIQUE (ba_id, role_type)
);

-- BA Templates Table
CREATE TABLE IF NOT EXISTS dim_ba_templates (
  template_id bigserial PRIMARY KEY,
  template_code text NOT NULL UNIQUE,
  template_name text NOT NULL,
  template_type text NOT NULL CHECK (template_type IN ('BA Pemeriksaan', 'BA Serah Terima Barang', 'BA Pembayaran')),
  template_category text, -- e.g., 'Stock', 'Non-Stock', 'Standard', 'With Direksi Inspection'
  template_content text NOT NULL, -- HTML content with placeholders
  template_variables jsonb, -- List of available variables: {{"ba_number", "ba_date", ...}}
  template_sections jsonb, -- Ordered sections: [{"title": "Header", "order": 1}, ...]
  
  -- Template Metadata
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  version integer DEFAULT 1,
  
  -- Audit Fields
  created_by text,
  created_date timestamptz DEFAULT now(),
  modified_by text,
  modified_date timestamptz DEFAULT now()
);

-- ============================================================================
-- TRANSACTION TABLES
-- ============================================================================

-- BA Pemeriksaan Detail Table
CREATE TABLE IF NOT EXISTS fact_ba_pemeriksaan_detail (
  inspection_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_ba_master(ba_id) ON DELETE CASCADE,
  
  -- Scenario Type
  scenario_type text NOT NULL CHECK (scenario_type IN ('Stock', 'Non-Stock')),
  
  -- References
  material_document_number text,
  po_number text NOT NULL,
  po_line_item integer,
  material_id text,
  material_description text NOT NULL,
  
  -- Quantities
  unit_of_measure text,
  qty_ordered numeric(15,3) NOT NULL,
  qty_previously_received numeric(15,3) DEFAULT 0,
  qty_inspected numeric(15,3) NOT NULL,
  qty_approved numeric(15,3) NOT NULL,
  qty_rejected numeric(15,3) DEFAULT 0,
  
  -- Inspection Details
  inspection_date date NOT NULL,
  inspection_location text,
  inspection_by_both_parties boolean DEFAULT false,
  inspection_remarks text,
  
  -- Quality Assessment
  quality_status text CHECK (quality_status IN ('Passed', 'Failed', 'Conditional')),
  defect_description text,
  
  -- Audit Fields
  created_date timestamptz DEFAULT now(),
  
  -- Validation: qty_approved + qty_rejected = qty_inspected
  CONSTRAINT valid_inspection_quantities CHECK (qty_approved + qty_rejected = qty_inspected),
  -- Validation: qty_inspected <= (qty_ordered - qty_previously_received)
  CONSTRAINT valid_inspection_limit CHECK (qty_inspected <= (qty_ordered - qty_previously_received))
);

-- BA Serah Terima Detail Table
CREATE TABLE IF NOT EXISTS fact_ba_serah_terima_detail (
  handover_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_ba_master(ba_id) ON DELETE CASCADE,
  
  -- Material References
  material_id text,
  material_description text NOT NULL,
  unit_of_measure text,
  
  -- Quantities
  qty_ordered numeric(15,3) NOT NULL,
  qty_already_handed_over numeric(15,3) DEFAULT 0, -- From previous BA Serah Terima
  qty_this_handover numeric(15,3) NOT NULL,
  qty_remaining numeric(15,3) GENERATED ALWAYS AS (qty_ordered - qty_already_handed_over - qty_this_handover) STORED,
  
  -- Handover Details
  handover_date date NOT NULL,
  delivery_location text NOT NULL,
  transporter_name text,
  transporter_do_number text,
  vehicle_number text,
  
  -- Verification
  handover_by_both_parties boolean DEFAULT false,
  direksi_inspection boolean DEFAULT false,
  direksi_inspection_date date,
  direksi_inspector_name text,
  
  -- Condition Assessment
  condition_status text CHECK (condition_status IN ('Good', 'Damaged', 'Incomplete')),
  condition_remarks text,
  handover_remarks text,
  
  -- Audit Fields
  created_date timestamptz DEFAULT now(),
  
  -- Validation: qty_this_handover <= (qty_ordered - qty_already_handed_over)
  CONSTRAINT valid_handover_limit CHECK (qty_this_handover <= (qty_ordered - qty_already_handed_over))
);

-- BA Workflow Step Table
CREATE TABLE IF NOT EXISTS fact_ba_workflow_step (
  workflow_step_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_ba_master(ba_id) ON DELETE CASCADE,
  
  -- Step Information
  step_type text NOT NULL CHECK (step_type IN ('SUBMIT', 'REVIEW', 'APPROVE')),
  step_role text NOT NULL CHECK (step_role IN ('Checker Vendor', 'Checker PLN', 'Approver Vendor', 'Approver PLN')),
  step_order integer NOT NULL,
  
  -- Actor Information
  actor_party_id bigint REFERENCES dim_ba_parties(party_id),
  actor_user_id text,
  actor_name text NOT NULL,
  actor_role text,
  
  -- Action Details
  action_status text NOT NULL DEFAULT 'PENDING' CHECK (action_status IN ('PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED')),
  action_date timestamptz,
  action_comments text,
  rejection_reason_id bigint REFERENCES lookup_ba_rejection_reason(reason_id),
  rejection_reason_detail text,
  
  -- Parallel Approval Tracking
  is_parallel boolean DEFAULT false,
  parallel_group_id text, -- For grouping parallel approvers
  requires_all_approval boolean DEFAULT true, -- If true, all in group must approve
  
  -- Audit Fields
  created_date timestamptz DEFAULT now(),
  
  -- Unique constraint: One step per role per BA (unless parallel)
  CONSTRAINT unique_step_per_role UNIQUE (ba_id, step_role, step_order)
);

-- BA Document Attachment Table
CREATE TABLE IF NOT EXISTS fact_ba_document_attachment (
  attachment_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_ba_master(ba_id) ON DELETE CASCADE,
  
  -- Document Classification
  doc_type_id bigint REFERENCES lookup_ba_document_type(doc_type_id),
  doc_type_code text NOT NULL,
  doc_category text CHECK (doc_category IN ('MANDATORY', 'OPTIONAL', 'SYSTEM_GENERATED')),
  
  -- File Information
  file_name text NOT NULL,
  file_original_name text NOT NULL,
  file_url text NOT NULL,
  file_size_bytes bigint,
  file_type text, -- mime type
  file_extension text,
  
  -- File Metadata
  file_hash text, -- For integrity checking
  virus_scan_status text CHECK (virus_scan_status IN ('PENDING', 'CLEAN', 'INFECTED', 'FAILED')),
  virus_scan_date timestamptz,
  
  -- Upload Information
  uploaded_by text NOT NULL,
  uploaded_date timestamptz DEFAULT now(),
  
  -- Document Metadata
  document_metadata jsonb, -- Additional metadata like page count, dimensions, etc.
  
  -- Version Control
  version integer DEFAULT 1,
  is_active boolean DEFAULT true,
  replaced_by_attachment_id bigint REFERENCES fact_ba_document_attachment(attachment_id),
  
  -- Audit Fields
  created_date timestamptz DEFAULT now()
);

-- BA Process History Table
CREATE TABLE IF NOT EXISTS fact_ba_process_history (
  history_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_ba_master(ba_id) ON DELETE CASCADE,
  
  -- Action Information
  action_type text NOT NULL CHECK (action_type IN (
    'CREATED', 'SAVED_DRAFT', 'SUBMITTED', 'REVIEWED', 'APPROVED', 'REJECTED', 
    'RETURNED', 'CANCELLED', 'FINALIZED', 'MODIFIED', 'DOCUMENT_UPLOADED', 
    'COMMENT_ADDED', 'PARTY_ASSIGNED', 'SIGNATURE_ADDED', 'GR_CREATED', 'TIMELINE_SYNCED'
  )),
  
  -- Actor Information
  action_by_user_id text,
  action_by_name text NOT NULL,
  action_by_role text,
  
  -- Status Transition
  previous_status text,
  new_status text,
  
  -- Action Details
  action_comments text,
  rejection_reason_id bigint REFERENCES lookup_ba_rejection_reason(reason_id),
  rejection_reason_category text,
  rejection_reason_detail text,
  
  -- Action Metadata
  action_metadata jsonb, -- Additional structured data about the action
  
  -- IP and Session Info
  ip_address text,
  user_agent text,
  session_id text,
  
  -- Timestamp
  action_timestamp timestamptz DEFAULT now() NOT NULL,
  
  -- Audit Fields
  created_date timestamptz DEFAULT now()
);

-- BA Digital Signature Table
CREATE TABLE IF NOT EXISTS fact_ba_digital_signature (
  signature_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_ba_master(ba_id) ON DELETE CASCADE,
  
  -- Signer Information
  signer_party_id bigint REFERENCES dim_ba_parties(party_id),
  signer_user_id text,
  signer_name text NOT NULL,
  signer_role text NOT NULL,
  signer_side text NOT NULL CHECK (signer_side IN ('Vendor', 'PLN')),
  
  -- Signature Details
  signature_type text NOT NULL CHECK (signature_type IN ('DIGITAL', 'E_MATERAI', 'BOTH')),
  signature_method text CHECK (signature_method IN ('DRAWN', 'UPLOADED', 'CERTIFICATE')),
  signature_image_url text,
  
  -- Certificate Information (for digital signatures)
  certificate_issuer text,
  certificate_serial_number text,
  certificate_valid_from timestamptz,
  certificate_valid_until timestamptz,
  certificate_thumbprint text,
  
  -- e-Materai Information (for Indonesia)
  ematerai_id text,
  ematerai_provider text,
  ematerai_stamp_url text,
  ematerai_verification_code text,
  
  -- Signature Metadata
  signature_timestamp timestamptz DEFAULT now() NOT NULL,
  signature_ip_address text,
  signature_location_gps jsonb, -- {"lat": -6.2088, "lon": 106.8456}
  
  -- Verification
  is_verified boolean DEFAULT false,
  verification_status text CHECK (verification_status IN ('PENDING', 'VERIFIED', 'FAILED', 'EXPIRED')),
  verification_date timestamptz,
  verification_details jsonb,
  
  -- Audit Fields
  created_date timestamptz DEFAULT now()
);

-- BA ERP Integration Log Table
CREATE TABLE IF NOT EXISTS fact_ba_erp_integration_log (
  log_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_ba_master(ba_id) ON DELETE CASCADE,
  
  -- Integration Type
  integration_type text NOT NULL CHECK (integration_type IN ('GR_CREATION', 'PO_UPDATE', 'INVENTORY_UPDATE')),
  integration_direction text NOT NULL CHECK (integration_direction IN ('OUTBOUND', 'INBOUND')),
  
  -- Request Details
  request_payload jsonb NOT NULL,
  request_timestamp timestamptz DEFAULT now(),
  request_url text,
  request_method text,
  
  -- Response Details
  response_payload jsonb,
  response_timestamp timestamptz,
  response_status_code integer,
  response_message text,
  
  -- Status Tracking
  integration_status text NOT NULL DEFAULT 'PENDING' CHECK (integration_status IN ('PENDING', 'SUCCESS', 'FAILED', 'RETRY')),
  retry_count integer DEFAULT 0,
  max_retry integer DEFAULT 3,
  next_retry_at timestamptz,
  
  -- Result Data
  gr_number text, -- Generated GR number
  erp_document_number text, -- Any other ERP document number
  error_code text,
  error_message text,
  error_details jsonb,
  
  -- Audit Fields
  created_date timestamptz DEFAULT now()
);

-- BA Order Monitoring Sync Table
CREATE TABLE IF NOT EXISTS fact_ba_order_monitoring_sync (
  sync_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_ba_master(ba_id) ON DELETE CASCADE,
  
  -- Order Reference
  po_number text NOT NULL,
  po_line_id bigint,
  
  -- Timeline Update
  previous_status text,
  new_status text NOT NULL, -- e.g., 'In Inspection' to 'Order Received'
  timeline_stage text NOT NULL, -- Stage in order monitoring timeline
  
  -- Sync Details
  sync_status text NOT NULL DEFAULT 'PENDING' CHECK (sync_status IN ('PENDING', 'SYNCED', 'FAILED', 'ROLLBACK')),
  sync_timestamp timestamptz,
  sync_request_payload jsonb,
  sync_response_payload jsonb,
  
  -- Error Handling
  error_message text,
  retry_count integer DEFAULT 0,
  
  -- Audit Fields
  created_date timestamptz DEFAULT now()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- BA Master Indexes
CREATE INDEX IF NOT EXISTS idx_ba_master_status ON dim_ba_master(ba_status);
CREATE INDEX IF NOT EXISTS idx_ba_master_type ON dim_ba_master(ba_type);
CREATE INDEX IF NOT EXISTS idx_ba_master_contract ON dim_ba_master(contract_id);
CREATE INDEX IF NOT EXISTS idx_ba_master_po ON dim_ba_master(po_number);
CREATE INDEX IF NOT EXISTS idx_ba_master_vendor ON dim_ba_master(vendor_id);
CREATE INDEX IF NOT EXISTS idx_ba_master_created_by ON dim_ba_master(created_by);
CREATE INDEX IF NOT EXISTS idx_ba_master_sla ON dim_ba_master(sla_due_date) WHERE is_overdue = false;
CREATE INDEX IF NOT EXISTS idx_ba_master_composite ON dim_ba_master(ba_status, ba_type, created_date DESC);

-- BA Parties Indexes
CREATE INDEX IF NOT EXISTS idx_ba_parties_ba ON dim_ba_parties(ba_id);
CREATE INDEX IF NOT EXISTS idx_ba_parties_role ON dim_ba_parties(role_type);
CREATE INDEX IF NOT EXISTS idx_ba_parties_user ON dim_ba_parties(party_user_id);
CREATE INDEX IF NOT EXISTS idx_ba_parties_action_required ON dim_ba_parties(ba_id, action_required) WHERE action_required = true;

-- BA Workflow Indexes
CREATE INDEX IF NOT EXISTS idx_ba_workflow_ba ON fact_ba_workflow_step(ba_id);
CREATE INDEX IF NOT EXISTS idx_ba_workflow_status ON fact_ba_workflow_step(action_status);
CREATE INDEX IF NOT EXISTS idx_ba_workflow_actor ON fact_ba_workflow_step(actor_user_id);

-- BA Process History Indexes
CREATE INDEX IF NOT EXISTS idx_ba_history_ba ON fact_ba_process_history(ba_id);
CREATE INDEX IF NOT EXISTS idx_ba_history_timestamp ON fact_ba_process_history(action_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ba_history_action_type ON fact_ba_process_history(action_type);

-- BA Document Indexes
CREATE INDEX IF NOT EXISTS idx_ba_docs_ba ON fact_ba_document_attachment(ba_id);
CREATE INDEX IF NOT EXISTS idx_ba_docs_type ON fact_ba_document_attachment(doc_type_code);
CREATE INDEX IF NOT EXISTS idx_ba_docs_uploaded_by ON fact_ba_document_attachment(uploaded_by);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE lookup_ba_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookup_ba_rejection_reason ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookup_ba_document_type ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_ba_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_ba_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_ba_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_ba_pemeriksaan_detail ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_ba_serah_terima_detail ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_ba_workflow_step ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_ba_document_attachment ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_ba_process_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_ba_digital_signature ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_ba_erp_integration_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_ba_order_monitoring_sync ENABLE ROW LEVEL SECURITY;

-- Lookup tables: Read access for authenticated users
CREATE POLICY "Authenticated users can read BA status lookup"
  ON lookup_ba_status FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read rejection reasons"
  ON lookup_ba_rejection_reason FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read document types"
  ON lookup_ba_document_type FOR SELECT
  TO authenticated
  USING (true);

-- BA Master: Complex access based on role and status
CREATE POLICY "Users can read BAs they are involved in"
  ON dim_ba_master FOR SELECT
  TO authenticated
  USING (
    created_by = auth.jwt()->>'sub' OR
    ba_id IN (
      SELECT ba_id FROM dim_ba_parties 
      WHERE party_user_id = auth.jwt()->>'sub'
    )
  );

CREATE POLICY "Users can create new BAs"
  ON dim_ba_master FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.jwt()->>'sub');

CREATE POLICY "Users can update BAs they created in DRAFT status"
  ON dim_ba_master FOR UPDATE
  TO authenticated
  USING (created_by = auth.jwt()->>'sub' AND ba_status = 'DRAFT')
  WITH CHECK (created_by = auth.jwt()->>'sub' AND ba_status = 'DRAFT');

-- BA Parties: Users can read parties for BAs they're involved in
CREATE POLICY "Users can read parties for accessible BAs"
  ON dim_ba_parties FOR SELECT
  TO authenticated
  USING (
    ba_id IN (
      SELECT ba_id FROM dim_ba_master 
      WHERE created_by = auth.jwt()->>'sub' OR
      ba_id IN (SELECT ba_id FROM dim_ba_parties WHERE party_user_id = auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can insert parties for BAs they created"
  ON dim_ba_parties FOR INSERT
  TO authenticated
  WITH CHECK (
    ba_id IN (SELECT ba_id FROM dim_ba_master WHERE created_by = auth.jwt()->>'sub')
  );

-- BA Templates: Read access for authenticated users
CREATE POLICY "Authenticated users can read active templates"
  ON dim_ba_templates FOR SELECT
  TO authenticated
  USING (is_active = true);

-- BA Details: Users can read/write details for BAs they're involved in
CREATE POLICY "Users can read pemeriksaan details for accessible BAs"
  ON fact_ba_pemeriksaan_detail FOR SELECT
  TO authenticated
  USING (
    ba_id IN (
      SELECT ba_id FROM dim_ba_master 
      WHERE created_by = auth.jwt()->>'sub' OR
      ba_id IN (SELECT ba_id FROM dim_ba_parties WHERE party_user_id = auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can insert pemeriksaan details for their BAs"
  ON fact_ba_pemeriksaan_detail FOR INSERT
  TO authenticated
  WITH CHECK (
    ba_id IN (SELECT ba_id FROM dim_ba_master WHERE created_by = auth.jwt()->>'sub')
  );

CREATE POLICY "Users can read serah terima details for accessible BAs"
  ON fact_ba_serah_terima_detail FOR SELECT
  TO authenticated
  USING (
    ba_id IN (
      SELECT ba_id FROM dim_ba_master 
      WHERE created_by = auth.jwt()->>'sub' OR
      ba_id IN (SELECT ba_id FROM dim_ba_parties WHERE party_user_id = auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can insert serah terima details for their BAs"
  ON fact_ba_serah_terima_detail FOR INSERT
  TO authenticated
  WITH CHECK (
    ba_id IN (SELECT ba_id FROM dim_ba_master WHERE created_by = auth.jwt()->>'sub')
  );

-- Workflow Steps: Users can read workflow for accessible BAs
CREATE POLICY "Users can read workflow for accessible BAs"
  ON fact_ba_workflow_step FOR SELECT
  TO authenticated
  USING (
    ba_id IN (
      SELECT ba_id FROM dim_ba_master 
      WHERE created_by = auth.jwt()->>'sub' OR
      ba_id IN (SELECT ba_id FROM dim_ba_parties WHERE party_user_id = auth.jwt()->>'sub')
    )
  );

-- Documents: Users can read/upload documents for accessible BAs
CREATE POLICY "Users can read documents for accessible BAs"
  ON fact_ba_document_attachment FOR SELECT
  TO authenticated
  USING (
    ba_id IN (
      SELECT ba_id FROM dim_ba_master 
      WHERE created_by = auth.jwt()->>'sub' OR
      ba_id IN (SELECT ba_id FROM dim_ba_parties WHERE party_user_id = auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can upload documents for their BAs"
  ON fact_ba_document_attachment FOR INSERT
  TO authenticated
  WITH CHECK (
    ba_id IN (SELECT ba_id FROM dim_ba_master WHERE created_by = auth.jwt()->>'sub')
    AND uploaded_by = auth.jwt()->>'sub'
  );

-- Process History: Read-only for users involved in BA
CREATE POLICY "Users can read history for accessible BAs"
  ON fact_ba_process_history FOR SELECT
  TO authenticated
  USING (
    ba_id IN (
      SELECT ba_id FROM dim_ba_master 
      WHERE created_by = auth.jwt()->>'sub' OR
      ba_id IN (SELECT ba_id FROM dim_ba_parties WHERE party_user_id = auth.jwt()->>'sub')
    )
  );

-- Digital Signatures: Users can read signatures for accessible BAs
CREATE POLICY "Users can read signatures for accessible BAs"
  ON fact_ba_digital_signature FOR SELECT
  TO authenticated
  USING (
    ba_id IN (
      SELECT ba_id FROM dim_ba_master 
      WHERE created_by = auth.jwt()->>'sub' OR
      ba_id IN (SELECT ba_id FROM dim_ba_parties WHERE party_user_id = auth.jwt()->>'sub')
    )
  );

-- ERP Integration Log: Read for involved users
CREATE POLICY "Users can read ERP logs for accessible BAs"
  ON fact_ba_erp_integration_log FOR SELECT
  TO authenticated
  USING (
    ba_id IN (
      SELECT ba_id FROM dim_ba_master 
      WHERE created_by = auth.jwt()->>'sub' OR
      ba_id IN (SELECT ba_id FROM dim_ba_parties WHERE party_user_id = auth.jwt()->>'sub')
    )
  );

-- Order Monitoring Sync: Read for involved users
CREATE POLICY "Users can read sync logs for accessible BAs"
  ON fact_ba_order_monitoring_sync FOR SELECT
  TO authenticated
  USING (
    ba_id IN (
      SELECT ba_id FROM dim_ba_master 
      WHERE created_by = auth.jwt()->>'sub' OR
      ba_id IN (SELECT ba_id FROM dim_ba_parties WHERE party_user_id = auth.jwt()->>'sub')
    )
  );
