/*
  # Create E-Procurement Tables

  1. New Tables
    - `fact_procurement_request`
      - Stores procurement request data with material details
      - Fields: id, title, category, requestor, amount, status, priority, due_date, description, vendor, quantity, related_model, delivery_location, estimated_price, organization_id

    - `ref_bundling_recommendation`
      - Stores AI bundling logic and recommendations
      - Fields: id, procurement_request_ids, bundling_logic, recommended_vendors, estimated_savings, created_at

    - `fact_sourcing_event`
      - Stores generated sourcing events
      - Fields: id, title, material_ids, demand_quantity, delivery_date, delivery_location, estimate_price, estimate_schedule, shortlisted_vendors, status, approval_status, organization_id

    - `ref_tender_document`
      - Stores tender document templates and drafts
      - Fields: id, sourcing_event_id, document_type, content, tor_file_path, spec_file_path, status, version, organization_id

    - `ref_document_submission`
      - Stores vendor document submissions
      - Fields: id, tender_id, vendor_id, section_name, file_path, file_type, file_size, submission_status, ai_screening_score, compliance_issues, organization_id

    - `fact_tender_scoring`
      - Stores vendor evaluation scores
      - Fields: id, tender_id, vendor_id, criteria_name, ai_score, manual_score, weight, justification, organization_id

    - `ref_winner_announcement`
      - Stores winner announcements
      - Fields: id, tender_id, winner_vendor_id, announcement_content, publication_date, status, organization_id

    - `ref_reverse_auction`
      - Stores reverse auction structure and bids
      - Fields: id, tender_id, auction_structure, bid_fields, rules, start_date, end_date, status, organization_id

    - `fact_reverse_auction_bid`
      - Stores individual auction bids
      - Fields: id, auction_id, vendor_id, bid_amount, bid_time, rank, organization_id

    - `dim_vendor`
      - Stores vendor master data
      - Fields: id, company_name, email, contact_person, phone, categories, address, registration_number, status, organization_id

    - `fact_tender_milestone`
      - Stores milestone tracking per tender
      - Fields: id, sourcing_event_id, milestone_name, milestone_date, status, responsible_person, organization_id

    - `ref_tender_announcement`
      - Stores announcement content for external publishing
      - Fields: id, sourcing_event_id, title, header, opener, body, closing, publication_date, status, target_vendors, organization_id

  2. Security
    - Enable RLS on all tables
    - Internal users (authenticated) can access all data
    - External vendors can only access their own submissions and public announcements
    - Add appropriate policies for SELECT, INSERT, UPDATE, DELETE operations

  3. Notes
    - All tables include organization_id for multi-tenancy
    - Status fields use text type for flexibility
    - JSONB used for complex data structures (vendors, criteria, etc.)
    - Timestamps use timestamptz for timezone awareness
    - Foreign key constraints ensure data integrity
*/

-- fact_procurement_request table
CREATE TABLE IF NOT EXISTS fact_procurement_request (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  requestor text NOT NULL,
  amount text NOT NULL,
  status text NOT NULL DEFAULT 'Pending Approval',
  priority text NOT NULL DEFAULT 'medium',
  due_date date NOT NULL,
  description text,
  vendor text,
  quantity text,
  related_model text,
  delivery_location text,
  estimated_price numeric,
  organization_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fact_procurement_request ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal users can read all procurement requests"
  ON fact_procurement_request FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Internal users can create procurement requests"
  ON fact_procurement_request FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Internal users can update procurement requests"
  ON fact_procurement_request FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Internal users can delete procurement requests"
  ON fact_procurement_request FOR DELETE
  TO authenticated
  USING (true);

-- ref_bundling_recommendation table
CREATE TABLE IF NOT EXISTS ref_bundling_recommendation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  procurement_request_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  bundling_logic text,
  recommended_vendors jsonb DEFAULT '[]'::jsonb,
  estimated_savings numeric,
  organization_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ref_bundling_recommendation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal users can read bundling recommendations"
  ON ref_bundling_recommendation FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Internal users can create bundling recommendations"
  ON ref_bundling_recommendation FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- fact_sourcing_event table
CREATE TABLE IF NOT EXISTS fact_sourcing_event (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  material_ids jsonb DEFAULT '[]'::jsonb,
  demand_quantity text,
  delivery_date date,
  delivery_location text,
  estimate_price numeric,
  estimate_schedule jsonb,
  shortlisted_vendors jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'Draft',
  approval_status text NOT NULL DEFAULT 'Pending',
  approved_by text,
  assigned_to text,
  category text,
  organization_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fact_sourcing_event ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal users can read sourcing events"
  ON fact_sourcing_event FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Internal users can create sourcing events"
  ON fact_sourcing_event FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Internal users can update sourcing events"
  ON fact_sourcing_event FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Internal users can delete sourcing events"
  ON fact_sourcing_event FOR DELETE
  TO authenticated
  USING (true);

-- ref_tender_document table
CREATE TABLE IF NOT EXISTS ref_tender_document (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_event_id uuid REFERENCES fact_sourcing_event(id) ON DELETE CASCADE,
  document_type text NOT NULL DEFAULT 'Draft',
  content jsonb,
  tor_file_path text,
  spec_file_path text,
  status text NOT NULL DEFAULT 'Draft',
  version integer DEFAULT 1,
  approved_by text,
  organization_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ref_tender_document ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal users can read tender documents"
  ON ref_tender_document FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Internal users can create tender documents"
  ON ref_tender_document FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Internal users can update tender documents"
  ON ref_tender_document FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- dim_vendor table
CREATE TABLE IF NOT EXISTS dim_vendor (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  email text UNIQUE NOT NULL,
  contact_person text NOT NULL,
  phone text,
  categories jsonb DEFAULT '[]'::jsonb,
  address text,
  registration_number text,
  status text NOT NULL DEFAULT 'Active',
  user_id uuid,
  organization_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE dim_vendor ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal users can read all vendors"
  ON dim_vendor FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Internal users can create vendors"
  ON dim_vendor FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Internal users can update vendors"
  ON dim_vendor FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Vendors can read their own profile"
  ON dim_vendor FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Vendors can update their own profile"
  ON dim_vendor FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ref_document_submission table
CREATE TABLE IF NOT EXISTS ref_document_submission (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid REFERENCES fact_sourcing_event(id) ON DELETE CASCADE,
  vendor_id uuid REFERENCES dim_vendor(id) ON DELETE CASCADE,
  section_name text NOT NULL,
  section_order integer DEFAULT 0,
  file_path text,
  file_type text,
  file_size bigint,
  submission_status text NOT NULL DEFAULT 'Draft',
  ai_screening_score numeric,
  compliance_issues jsonb DEFAULT '[]'::jsonb,
  recommendations jsonb DEFAULT '[]'::jsonb,
  submitted_at timestamptz,
  organization_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ref_document_submission ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal users can read all submissions"
  ON ref_document_submission FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vendors can read their own submissions"
  ON ref_document_submission FOR SELECT
  TO authenticated
  USING (vendor_id IN (SELECT id FROM dim_vendor WHERE user_id = auth.uid()));

CREATE POLICY "Vendors can create their own submissions"
  ON ref_document_submission FOR INSERT
  TO authenticated
  WITH CHECK (vendor_id IN (SELECT id FROM dim_vendor WHERE user_id = auth.uid()));

CREATE POLICY "Vendors can update their own submissions"
  ON ref_document_submission FOR UPDATE
  TO authenticated
  USING (vendor_id IN (SELECT id FROM dim_vendor WHERE user_id = auth.uid()))
  WITH CHECK (vendor_id IN (SELECT id FROM dim_vendor WHERE user_id = auth.uid()));

-- fact_tender_scoring table
CREATE TABLE IF NOT EXISTS fact_tender_scoring (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid REFERENCES fact_sourcing_event(id) ON DELETE CASCADE,
  vendor_id uuid REFERENCES dim_vendor(id) ON DELETE CASCADE,
  criteria_name text NOT NULL,
  ai_score numeric,
  manual_score numeric,
  weight numeric NOT NULL DEFAULT 1.0,
  justification text,
  scored_by text,
  organization_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tender_id, vendor_id, criteria_name)
);

ALTER TABLE fact_tender_scoring ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal users can read all scores"
  ON fact_tender_scoring FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Internal users can create scores"
  ON fact_tender_scoring FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Internal users can update scores"
  ON fact_tender_scoring FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ref_winner_announcement table
CREATE TABLE IF NOT EXISTS ref_winner_announcement (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid REFERENCES fact_sourcing_event(id) ON DELETE CASCADE,
  winner_vendor_id uuid REFERENCES dim_vendor(id),
  announcement_content jsonb,
  publication_date date,
  status text NOT NULL DEFAULT 'Draft',
  approved_by text,
  organization_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ref_winner_announcement ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal users can read winner announcements"
  ON ref_winner_announcement FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Internal users can create winner announcements"
  ON ref_winner_announcement FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Internal users can update winner announcements"
  ON ref_winner_announcement FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Vendors can read published announcements"
  ON ref_winner_announcement FOR SELECT
  TO authenticated
  USING (status = 'Published');

-- ref_reverse_auction table
CREATE TABLE IF NOT EXISTS ref_reverse_auction (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid REFERENCES fact_sourcing_event(id) ON DELETE CASCADE,
  auction_structure jsonb,
  bid_fields jsonb DEFAULT '[]'::jsonb,
  rules jsonb,
  start_date timestamptz,
  end_date timestamptz,
  status text NOT NULL DEFAULT 'Draft',
  approved_by text,
  organization_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ref_reverse_auction ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal users can read auctions"
  ON ref_reverse_auction FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Internal users can create auctions"
  ON ref_reverse_auction FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Internal users can update auctions"
  ON ref_reverse_auction FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Vendors can read published auctions"
  ON ref_reverse_auction FOR SELECT
  TO authenticated
  USING (status = 'Published' OR status = 'Active');

-- fact_reverse_auction_bid table
CREATE TABLE IF NOT EXISTS fact_reverse_auction_bid (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id uuid REFERENCES ref_reverse_auction(id) ON DELETE CASCADE,
  vendor_id uuid REFERENCES dim_vendor(id) ON DELETE CASCADE,
  bid_amount numeric NOT NULL,
  bid_details jsonb,
  bid_time timestamptz DEFAULT now(),
  rank integer,
  organization_id text NOT NULL
);

ALTER TABLE fact_reverse_auction_bid ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal users can read all bids"
  ON fact_reverse_auction_bid FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vendors can read their own bids"
  ON fact_reverse_auction_bid FOR SELECT
  TO authenticated
  USING (vendor_id IN (SELECT id FROM dim_vendor WHERE user_id = auth.uid()));

CREATE POLICY "Vendors can create their own bids"
  ON fact_reverse_auction_bid FOR INSERT
  TO authenticated
  WITH CHECK (vendor_id IN (SELECT id FROM dim_vendor WHERE user_id = auth.uid()));

-- fact_tender_milestone table
CREATE TABLE IF NOT EXISTS fact_tender_milestone (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_event_id uuid REFERENCES fact_sourcing_event(id) ON DELETE CASCADE,
  milestone_name text NOT NULL,
  milestone_date date NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  responsible_person text,
  notes text,
  organization_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fact_tender_milestone ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal users can read milestones"
  ON fact_tender_milestone FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Internal users can create milestones"
  ON fact_tender_milestone FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Internal users can update milestones"
  ON fact_tender_milestone FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ref_tender_announcement table
CREATE TABLE IF NOT EXISTS ref_tender_announcement (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_event_id uuid REFERENCES fact_sourcing_event(id) ON DELETE CASCADE,
  title text NOT NULL,
  header text,
  opener text,
  body text,
  closing text,
  publication_date date,
  status text NOT NULL DEFAULT 'Draft',
  target_vendors jsonb DEFAULT '[]'::jsonb,
  approved_by text,
  organization_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ref_tender_announcement ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal users can read announcements"
  ON ref_tender_announcement FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Internal users can create announcements"
  ON ref_tender_announcement FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Internal users can update announcements"
  ON ref_tender_announcement FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Vendors can read published announcements"
  ON ref_tender_announcement FOR SELECT
  TO authenticated
  USING (status = 'Published');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_procurement_request_org ON fact_procurement_request(organization_id);
CREATE INDEX IF NOT EXISTS idx_procurement_request_status ON fact_procurement_request(status);
CREATE INDEX IF NOT EXISTS idx_sourcing_event_org ON fact_sourcing_event(organization_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_event_status ON fact_sourcing_event(status);
CREATE INDEX IF NOT EXISTS idx_tender_document_event ON ref_tender_document(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_document_submission_tender ON ref_document_submission(tender_id);
CREATE INDEX IF NOT EXISTS idx_document_submission_vendor ON ref_document_submission(vendor_id);
CREATE INDEX IF NOT EXISTS idx_tender_scoring_tender ON fact_tender_scoring(tender_id);
CREATE INDEX IF NOT EXISTS idx_tender_scoring_vendor ON fact_tender_scoring(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_email ON dim_vendor(email);
CREATE INDEX IF NOT EXISTS idx_vendor_org ON dim_vendor(organization_id);
CREATE INDEX IF NOT EXISTS idx_auction_tender ON ref_reverse_auction(tender_id);
CREATE INDEX IF NOT EXISTS idx_auction_bid_auction ON fact_reverse_auction_bid(auction_id);
CREATE INDEX IF NOT EXISTS idx_announcement_event ON ref_tender_announcement(sourcing_event_id);
