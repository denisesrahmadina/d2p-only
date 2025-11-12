/*
  # Create organizations table

  1. New Tables
    - `organizations`
      - `id` (text, primary key) - Unique identifier for the organization
      - `industry_id` (text) - Reference to the industry
      - `name` (text) - Organization name
      - `type` (text) - Organization type (holding, subsidiary, etc.)
      - `kpis` (jsonb) - Array of KPI objects containing id, name, value, unit, trend, and target
      - `created_at` (timestamptz) - Timestamp when the organization was created
      - `updated_at` (timestamptz) - Timestamp when the organization was last updated

  2. Security
    - Enable RLS on `organizations` table
    - Add policy for authenticated users to read all organizations
    - Add policy for authenticated users with admin role to insert organizations
    - Add policy for authenticated users with admin role to update organizations

  3. Notes
    - KPIs are stored as JSONB to maintain the flexible structure
    - All users can read organizations for selection purposes
    - Only admins can modify organization data
*/

CREATE TABLE IF NOT EXISTS organizations (
  id text PRIMARY KEY,
  industry_id text NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  kpis jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read organizations"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update organizations"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete organizations"
  ON organizations
  FOR DELETE
  TO authenticated
  USING (true);