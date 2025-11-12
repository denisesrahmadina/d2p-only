/*
  # Digital Signature System for Contract Lifecycle

  1. New Tables
    - `fact_contract_draft`
      - Contract drafts created from approved templates
      - Tracks draft content, version, status, and creator
      - Links to approved templates and sourcing events
      - Supports versioning and draft lifecycle management

    - `fact_digital_signature`
      - Digital signatures for contract approvals
      - Captures signature data (image/drawn), metadata
      - Tracks signer information, timestamp, IP address
      - Links to approval records and contracts
      - Stores signature certificate and verification data

    - `fact_signed_contract`
      - Final approved contracts with all signatures
      - Links to workspace, approvals, and signatures
      - Stores final contract content and PDF reference
      - Tracks execution date and contract lifecycle

    - `fact_signature_audit_log`
      - Complete audit trail for all signature activities
      - Tracks signature requests, views, completions
      - Records all signature-related actions with timestamps
      - Maintains compliance documentation

  2. Security
    - Enable RLS on all tables
    - Authenticated users can create and update records
    - Public read access for anon users (demo purposes)
    - Audit logs are immutable after creation

  3. Important Notes
    - Digital signatures include timestamp, IP, device info
    - Signature certificates generated for authenticity
    - Complete audit trail maintained for compliance
    - Supports multiple signature types: drawn, typed, uploaded
    - Two-role approval required: Procurement Manager + Requestor
*/

-- Create fact_contract_draft table
CREATE TABLE IF NOT EXISTS fact_contract_draft (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_template_id uuid REFERENCES fact_contract_template(id) ON DELETE SET NULL,
  sourcing_event_id text NOT NULL,
  draft_name text NOT NULL,
  draft_content jsonb NOT NULL DEFAULT '{}'::jsonb,
  draft_status text NOT NULL DEFAULT 'Draft' CHECK (draft_status IN ('Draft', 'In Review', 'Ready for Approval', 'Approved', 'Rejected')),
  version integer NOT NULL DEFAULT 1,
  created_by text NOT NULL,
  last_modified_by text,
  submitted_for_approval_at timestamptz,
  submitted_by text,
  organization_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fact_digital_signature table
CREATE TABLE IF NOT EXISTS fact_digital_signature (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_approval_id uuid REFERENCES fact_contract_approval(id) ON DELETE CASCADE,
  contract_workspace_id uuid REFERENCES fact_contract_workspace(id) ON DELETE CASCADE,
  signer_id text NOT NULL,
  signer_name text NOT NULL,
  signer_role text NOT NULL,
  signature_type text NOT NULL CHECK (signature_type IN ('Drawn', 'Typed', 'Uploaded', 'Certificate')),
  signature_data text NOT NULL,
  signature_image_url text,
  signed_at timestamptz DEFAULT now(),
  ip_address text,
  device_info text,
  location_info text,
  signature_certificate jsonb,
  verification_hash text,
  is_verified boolean DEFAULT true,
  organization_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create fact_signed_contract table
CREATE TABLE IF NOT EXISTS fact_signed_contract (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_workspace_id uuid NOT NULL REFERENCES fact_contract_workspace(id) ON DELETE CASCADE,
  contract_name text NOT NULL,
  final_content jsonb NOT NULL,
  contract_pdf_url text,
  execution_date timestamptz DEFAULT now(),
  expiry_date timestamptz,
  contract_value numeric,
  contract_status text DEFAULT 'Active' CHECK (contract_status IN ('Active', 'Expired', 'Terminated', 'Completed')),
  all_approvals_complete boolean DEFAULT false,
  procurement_manager_signature_id uuid REFERENCES fact_digital_signature(id),
  requestor_signature_id uuid REFERENCES fact_digital_signature(id),
  created_by text NOT NULL,
  organization_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fact_signature_audit_log table
CREATE TABLE IF NOT EXISTS fact_signature_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  digital_signature_id uuid REFERENCES fact_digital_signature(id) ON DELETE CASCADE,
  contract_workspace_id uuid,
  action_type text NOT NULL CHECK (action_type IN ('Signature Requested', 'Document Viewed', 'Signature Started', 'Signature Completed', 'Signature Verified', 'Signature Rejected')),
  actor_id text NOT NULL,
  actor_name text NOT NULL,
  action_details jsonb,
  ip_address text,
  user_agent text,
  timestamp timestamptz DEFAULT now(),
  organization_id uuid
);

-- Enable RLS
ALTER TABLE fact_contract_draft ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_digital_signature ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_signed_contract ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_signature_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fact_contract_draft
CREATE POLICY "Anyone can view contract drafts"
  ON fact_contract_draft FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create drafts"
  ON fact_contract_draft FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update drafts"
  ON fact_contract_draft FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for fact_digital_signature
CREATE POLICY "Anyone can view digital signatures"
  ON fact_digital_signature FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create signatures"
  ON fact_digital_signature FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update signatures"
  ON fact_digital_signature FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for fact_signed_contract
CREATE POLICY "Anyone can view signed contracts"
  ON fact_signed_contract FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create signed contracts"
  ON fact_signed_contract FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update signed contracts"
  ON fact_signed_contract FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for fact_signature_audit_log
CREATE POLICY "Anyone can view signature audit logs"
  ON fact_signature_audit_log FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create audit logs"
  ON fact_signature_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contract_draft_template ON fact_contract_draft(contract_template_id);
CREATE INDEX IF NOT EXISTS idx_contract_draft_sourcing_event ON fact_contract_draft(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_contract_draft_status ON fact_contract_draft(draft_status);
CREATE INDEX IF NOT EXISTS idx_contract_draft_created_by ON fact_contract_draft(created_by);
CREATE INDEX IF NOT EXISTS idx_contract_draft_organization ON fact_contract_draft(organization_id);

CREATE INDEX IF NOT EXISTS idx_digital_signature_approval ON fact_digital_signature(contract_approval_id);
CREATE INDEX IF NOT EXISTS idx_digital_signature_workspace ON fact_digital_signature(contract_workspace_id);
CREATE INDEX IF NOT EXISTS idx_digital_signature_signer ON fact_digital_signature(signer_id);
CREATE INDEX IF NOT EXISTS idx_digital_signature_signed_at ON fact_digital_signature(signed_at);

CREATE INDEX IF NOT EXISTS idx_signed_contract_workspace ON fact_signed_contract(contract_workspace_id);
CREATE INDEX IF NOT EXISTS idx_signed_contract_status ON fact_signed_contract(contract_status);
CREATE INDEX IF NOT EXISTS idx_signed_contract_execution_date ON fact_signed_contract(execution_date);
CREATE INDEX IF NOT EXISTS idx_signed_contract_pm_signature ON fact_signed_contract(procurement_manager_signature_id);
CREATE INDEX IF NOT EXISTS idx_signed_contract_requestor_signature ON fact_signed_contract(requestor_signature_id);

CREATE INDEX IF NOT EXISTS idx_signature_audit_signature ON fact_signature_audit_log(digital_signature_id);
CREATE INDEX IF NOT EXISTS idx_signature_audit_workspace ON fact_signature_audit_log(contract_workspace_id);
CREATE INDEX IF NOT EXISTS idx_signature_audit_actor ON fact_signature_audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_signature_audit_timestamp ON fact_signature_audit_log(timestamp);
