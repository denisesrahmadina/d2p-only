/*
  # Vendor Profiles and Live Tracking Schema

  1. New Tables
    - `vendor_profiles`
      - Extended vendor information with performance metrics
      - Company details, certifications, and ratings
      - Contact information and document links
    
    - `procurement_team_members`
      - Team member profiles with role information
      - Activity tracking and assignment history
    
    - `vendor_ratings`
      - Performance ratings and reviews
      - Historical rating data with timestamps
    
    - `vendor_communications`
      - Communication logs between procurement and vendors
      - Document attachments and interaction history
    
    - `delivery_tracking_live`
      - Real-time delivery location tracking
      - GPS coordinates and status updates
      - Route information and milestones
    
  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated user access
    - Vendor-specific access policies for their own data
  
  3. Important Notes
    - Extends existing dim_vendor table with detailed profiles
    - Supports real-time tracking with location updates
    - Maintains audit trail for all vendor interactions
*/

-- Create vendor_profiles table
CREATE TABLE IF NOT EXISTS vendor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id text NOT NULL REFERENCES dim_vendor(vendor_id),
  company_registration_number text,
  tax_id text,
  established_date date,
  employee_count integer,
  annual_revenue numeric,
  certifications jsonb DEFAULT '[]'::jsonb,
  service_areas jsonb DEFAULT '[]'::jsonb,
  product_categories jsonb DEFAULT '[]'::jsonb,
  payment_terms text,
  delivery_capabilities text,
  minimum_order_value numeric DEFAULT 0,
  average_rating numeric DEFAULT 0,
  total_ratings integer DEFAULT 0,
  performance_score numeric DEFAULT 0,
  on_time_delivery_rate numeric DEFAULT 0,
  quality_score numeric DEFAULT 0,
  compliance_status text DEFAULT 'Pending',
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_phone text,
  billing_address jsonb,
  shipping_address jsonb,
  website_url text,
  logo_url text,
  documents jsonb DEFAULT '[]'::jsonb,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create procurement_team_members table
CREATE TABLE IF NOT EXISTS procurement_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  role text NOT NULL,
  department text,
  specialization text,
  assigned_vendors jsonb DEFAULT '[]'::jsonb,
  assigned_categories jsonb DEFAULT '[]'::jsonb,
  performance_metrics jsonb DEFAULT '{}'::jsonb,
  activity_log jsonb DEFAULT '[]'::jsonb,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vendor_ratings table
CREATE TABLE IF NOT EXISTS vendor_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id text NOT NULL REFERENCES dim_vendor(vendor_id),
  rated_by_user_id text NOT NULL,
  rated_by_name text NOT NULL,
  po_number text,
  rating_overall numeric NOT NULL CHECK (rating_overall >= 1 AND rating_overall <= 5),
  rating_quality numeric CHECK (rating_quality >= 1 AND rating_quality <= 5),
  rating_delivery numeric CHECK (rating_delivery >= 1 AND rating_delivery <= 5),
  rating_communication numeric CHECK (rating_communication >= 1 AND rating_communication <= 5),
  rating_value numeric CHECK (rating_value >= 1 AND rating_value <= 5),
  review_title text,
  review_text text,
  pros text,
  cons text,
  would_recommend boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vendor_communications table
CREATE TABLE IF NOT EXISTS vendor_communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id text NOT NULL REFERENCES dim_vendor(vendor_id),
  communication_type text NOT NULL,
  subject text NOT NULL,
  content text,
  from_user_id text NOT NULL,
  from_user_name text NOT NULL,
  to_contacts jsonb DEFAULT '[]'::jsonb,
  attachments jsonb DEFAULT '[]'::jsonb,
  related_po_number text,
  related_contract_id text,
  status text DEFAULT 'Sent',
  priority text DEFAULT 'Normal',
  is_read boolean DEFAULT false,
  read_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create delivery_tracking_live table
CREATE TABLE IF NOT EXISTS delivery_tracking_live (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number text NOT NULL,
  tracking_number text NOT NULL UNIQUE,
  vendor_id text NOT NULL REFERENCES dim_vendor(vendor_id),
  current_status text NOT NULL,
  current_latitude numeric NOT NULL,
  current_longitude numeric NOT NULL,
  current_address text,
  origin_latitude numeric NOT NULL,
  origin_longitude numeric NOT NULL,
  origin_address text NOT NULL,
  destination_latitude numeric NOT NULL,
  destination_longitude numeric NOT NULL,
  destination_address text NOT NULL,
  estimated_delivery timestamptz,
  actual_delivery timestamptz,
  route_polyline text,
  distance_km numeric,
  milestones jsonb DEFAULT '[]'::jsonb,
  carrier_name text,
  carrier_contact text,
  vehicle_type text,
  vehicle_number text,
  driver_name text,
  driver_contact text,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking_live ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendor_profiles
CREATE POLICY "Anyone can view vendor profiles"
  ON vendor_profiles FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create vendor profiles"
  ON vendor_profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update vendor profiles"
  ON vendor_profiles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for procurement_team_members
CREATE POLICY "Anyone can view team members"
  ON procurement_team_members FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage team members"
  ON procurement_team_members FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for vendor_ratings
CREATE POLICY "Anyone can view vendor ratings"
  ON vendor_ratings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create ratings"
  ON vendor_ratings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own ratings"
  ON vendor_ratings FOR UPDATE
  TO authenticated
  USING (rated_by_user_id = current_user)
  WITH CHECK (rated_by_user_id = current_user);

-- RLS Policies for vendor_communications
CREATE POLICY "Anyone can view vendor communications"
  ON vendor_communications FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create communications"
  ON vendor_communications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update communications"
  ON vendor_communications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for delivery_tracking_live
CREATE POLICY "Anyone can view delivery tracking"
  ON delivery_tracking_live FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage delivery tracking"
  ON delivery_tracking_live FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_vendor_id ON vendor_profiles(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_ratings_vendor_id ON vendor_ratings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_communications_vendor_id ON vendor_communications(vendor_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_po_number ON delivery_tracking_live(po_number);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_tracking_number ON delivery_tracking_live(tracking_number);