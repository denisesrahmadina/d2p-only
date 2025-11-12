/*
  # Create Inventory Tolerance Summary Table

  ## Overview
  Creates the inventory_tolerance_summary table to track inventory planning tolerance
  percentages for each power generation unit. Links to existing unit_locations table.

  ## New Table

  ### inventory_tolerance_summary
  - `id` (uuid, primary key) - Unique identifier
  - `unit_id` (uuid, foreign key) - References unit_locations.id
  - `tolerance_percentage` (numeric) - Percentage of items within tolerance (0-100)
  - `status` (text) - Performance status (excellent, good, needs_attention)
  - `last_calculated` (timestamptz) - When tolerance was last calculated
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Row Level Security enabled
  - Public read access for all users
  - Authenticated users can insert and update

  ## Performance
  - Indexes on unit_id, tolerance_percentage, and status for fast queries
*/

-- Create inventory_tolerance_summary table
CREATE TABLE IF NOT EXISTS inventory_tolerance_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES unit_locations(id) ON DELETE CASCADE,
  tolerance_percentage numeric(5, 2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'needs_attention',
  last_calculated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT check_tolerance_range CHECK (tolerance_percentage >= 0 AND tolerance_percentage <= 100),
  CONSTRAINT check_status_values CHECK (status IN ('excellent', 'good', 'needs_attention'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tolerance_unit_id ON inventory_tolerance_summary(unit_id);
CREATE INDEX IF NOT EXISTS idx_tolerance_percentage ON inventory_tolerance_summary(tolerance_percentage);
CREATE INDEX IF NOT EXISTS idx_tolerance_status ON inventory_tolerance_summary(status);

-- Enable Row Level Security
ALTER TABLE inventory_tolerance_summary ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow read access to all users for tolerance_summary"
  ON inventory_tolerance_summary FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert tolerance_summary"
  ON inventory_tolerance_summary FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update tolerance_summary"
  ON inventory_tolerance_summary FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);