/*
  # Order Tracking and Proof of Delivery System

  1. New Tables
    - `order_tracking_milestones`
      - `milestone_id` (bigserial, primary key)
      - `po_line_id` (bigint, foreign key to fact_purchase_order)
      - `milestone_status` (text) - Status name (Order Placed, Processing, Shipped, etc.)
      - `milestone_location` (text) - Location description
      - `milestone_timestamp` (timestamptz) - When milestone was reached
      - `description` (text) - Detailed description
      - `completed` (boolean) - Whether milestone is completed
      - `latitude` (numeric) - GPS latitude
      - `longitude` (numeric) - GPS longitude
      - `created_date` (timestamptz)
      - `modified_date` (timestamptz)

    - `proof_of_delivery`
      - `proof_id` (bigserial, primary key)
      - `po_line_id` (bigint, foreign key to fact_purchase_order)
      - `upload_date` (timestamptz)
      - `uploaded_by` (text) - User ID who uploaded
      - `proof_type` (text) - 'photo', 'document', or 'signature'
      - `file_url` (text) - URL to file in storage
      - `file_name` (text) - Original file name
      - `file_size` (bigint) - File size in bytes
      - `mime_type` (text) - File MIME type
      - `signature_data` (text) - Base64 signature if applicable
      - `notes` (text) - Additional notes
      - `gps_latitude` (numeric) - GPS coordinates at upload
      - `gps_longitude` (numeric)
      - `created_date` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their order tracking
*/

-- Create order_tracking_milestones table
CREATE TABLE IF NOT EXISTS order_tracking_milestones (
  milestone_id bigserial PRIMARY KEY,
  po_line_id bigint REFERENCES fact_purchase_order(po_line_id),
  milestone_status text NOT NULL,
  milestone_location text,
  milestone_timestamp timestamptz NOT NULL DEFAULT now(),
  description text,
  completed boolean DEFAULT false,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now()
);

-- Create proof_of_delivery table
CREATE TABLE IF NOT EXISTS proof_of_delivery (
  proof_id bigserial PRIMARY KEY,
  po_line_id bigint REFERENCES fact_purchase_order(po_line_id),
  upload_date timestamptz DEFAULT now(),
  uploaded_by text,
  proof_type text CHECK (proof_type IN ('photo', 'document', 'signature')),
  file_url text,
  file_name text,
  file_size bigint,
  mime_type text,
  signature_data text,
  notes text,
  gps_latitude numeric(10, 7),
  gps_longitude numeric(10, 7),
  created_date timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tracking_milestones_po ON order_tracking_milestones(po_line_id);
CREATE INDEX IF NOT EXISTS idx_tracking_milestones_status ON order_tracking_milestones(milestone_status);
CREATE INDEX IF NOT EXISTS idx_tracking_milestones_timestamp ON order_tracking_milestones(milestone_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_proof_delivery_po ON proof_of_delivery(po_line_id);
CREATE INDEX IF NOT EXISTS idx_proof_delivery_type ON proof_of_delivery(proof_type);
CREATE INDEX IF NOT EXISTS idx_proof_delivery_date ON proof_of_delivery(upload_date DESC);

-- Enable Row Level Security
ALTER TABLE order_tracking_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_of_delivery ENABLE ROW LEVEL SECURITY;

-- Policies for order_tracking_milestones
CREATE POLICY "Allow public read access to tracking milestones"
  ON order_tracking_milestones
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert tracking milestones"
  ON order_tracking_milestones
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update tracking milestones"
  ON order_tracking_milestones
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for proof_of_delivery
CREATE POLICY "Allow public read access to proof of delivery"
  ON proof_of_delivery
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert proof"
  ON proof_of_delivery
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update own proof"
  ON proof_of_delivery
  FOR UPDATE
  TO authenticated
  USING (uploaded_by = current_user)
  WITH CHECK (uploaded_by = current_user);

CREATE POLICY "Allow authenticated users to delete own proof"
  ON proof_of_delivery
  FOR DELETE
  TO authenticated
  USING (uploaded_by = current_user);
