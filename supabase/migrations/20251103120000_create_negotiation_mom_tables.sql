/*
  # Create Negotiation MoM (Minutes of Meeting) System

  1. New Tables
    - `ref_mom_template`: Store predefined MoM document templates
      - `id` (uuid, primary key)
      - `template_name` (text, unique)
      - `template_description` (text)
      - `template_category` (text) - e.g., 'Negotiation', 'Pre-Award', 'Technical Discussion'
      - `file_url` (text) - URL or path to the Word template
      - `is_active` (boolean) - Whether template is available for use
      - `organization_id` (text)
      - `created_at`, `updated_at` (timestamptz)

    - `ref_mom_document`: Track generated MoM documents linked to evaluations
      - `id` (uuid, primary key)
      - `sourcing_event_id` (text) - Links to tender evaluation
      - `template_id` (uuid) - References ref_mom_template
      - `document_name` (text)
      - `document_url` (text) - Link to the working document
      - `status` (text) - 'Draft', 'In Progress', 'Completed', 'Archived'
      - `created_by` (text) - User who created the document
      - `meeting_date` (date) - Date of the meeting
      - `participants` (jsonb) - List of meeting participants
      - `notes` (text) - Additional notes about the meeting
      - `organization_id` (text)
      - `created_at`, `updated_at` (timestamptz)

  2. Security
    - RLS enabled on all tables
    - Authenticated users can read all templates
    - Only authenticated users can create/manage MoM documents
    - Proper indexes for query performance

  3. Sample Data
    - Pre-populate with common negotiation MoM templates
    - Include various template categories for different meeting types
*/

-- MoM Template Table
CREATE TABLE IF NOT EXISTS ref_mom_template (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name text NOT NULL UNIQUE,
  template_description text,
  template_category text NOT NULL DEFAULT 'Negotiation',
  file_url text NOT NULL,
  is_active boolean DEFAULT true,
  organization_id text NOT NULL DEFAULT 'indonesia-power',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ref_mom_template ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read templates"
  ON ref_mom_template FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage templates"
  ON ref_mom_template FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- MoM Document Table
CREATE TABLE IF NOT EXISTS ref_mom_document (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_event_id text NOT NULL,
  template_id uuid REFERENCES ref_mom_template(id),
  document_name text NOT NULL,
  document_url text NOT NULL,
  status text NOT NULL DEFAULT 'Draft',
  created_by text,
  meeting_date date,
  participants jsonb DEFAULT '[]'::jsonb,
  notes text,
  organization_id text NOT NULL DEFAULT 'indonesia-power',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ref_mom_document ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read documents"
  ON ref_mom_document FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create documents"
  ON ref_mom_document FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update documents"
  ON ref_mom_document FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete documents"
  ON ref_mom_document FOR DELETE
  TO authenticated
  USING (true);

-- Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_mom_template_active ON ref_mom_template(is_active);
CREATE INDEX IF NOT EXISTS idx_mom_template_category ON ref_mom_template(template_category);
CREATE INDEX IF NOT EXISTS idx_mom_template_org ON ref_mom_template(organization_id);

CREATE INDEX IF NOT EXISTS idx_mom_document_event ON ref_mom_document(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_mom_document_template ON ref_mom_document(template_id);
CREATE INDEX IF NOT EXISTS idx_mom_document_status ON ref_mom_document(status);
CREATE INDEX IF NOT EXISTS idx_mom_document_org ON ref_mom_document(organization_id);
CREATE INDEX IF NOT EXISTS idx_mom_document_created ON ref_mom_document(created_at);

-- Populate Sample MoM Templates
INSERT INTO ref_mom_template (template_name, template_description, template_category, file_url, organization_id) VALUES
  (
    'Standard Negotiation MoM',
    'Standard template for vendor negotiation meetings including price discussions, technical clarifications, and delivery terms',
    'Negotiation',
    'https://docs.google.com/document/d/1-negotiation-template/edit',
    'indonesia-power'
  ),
  (
    'Technical Clarification MoM',
    'Template for technical discussion meetings to clarify specifications, requirements, and compliance matters',
    'Technical Discussion',
    'https://docs.google.com/document/d/2-technical-template/edit',
    'indonesia-power'
  ),
  (
    'Pre-Award Conference MoM',
    'Template for pre-award conference documenting final agreements, timeline commitments, and award conditions',
    'Pre-Award',
    'https://docs.google.com/document/d/3-preaward-template/edit',
    'indonesia-power'
  ),
  (
    'Commercial Discussion MoM',
    'Template focused on commercial terms including payment terms, warranties, penalties, and commercial conditions',
    'Commercial',
    'https://docs.google.com/document/d/4-commercial-template/edit',
    'indonesia-power'
  ),
  (
    'Compliance Review MoM',
    'Template for compliance and legal review meetings covering regulatory requirements and legal obligations',
    'Compliance',
    'https://docs.google.com/document/d/5-compliance-template/edit',
    'indonesia-power'
  );
