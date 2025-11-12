/*
  # Create Material Price History Tables

  ## Overview
  This migration creates tables to track historical price trends for materials across different business units and time periods.

  ## 1. New Tables

  ### fact_material_price_history
  - `id` (uuid, primary key)
  - `material_code` (text) - Material identification code
  - `material_name` (text) - Material name
  - `category_code` (text) - Category identification
  - `business_unit` (text) - Requestor unit name
  - `unit_id` (uuid) - Link to dim_units
  - `fiscal_year` (integer) - Year of the price point
  - `fiscal_month` (integer) - Month of the price point (1-12)
  - `period_label` (text) - Human-readable label (e.g., "Jan 2024")
  - `price_per_unit` (numeric) - Price at that time period
  - `quantity_ordered` (numeric) - Quantity ordered in that period
  - `total_amount` (numeric) - Total transaction amount
  - `currency` (text) - Currency code (default: IDR)
  - `vendor_id` (uuid) - Supplier for this transaction
  - `vendor_name` (text) - Supplier name
  - `po_count` (integer) - Number of POs in this aggregation
  - `dataset_id` (text) - Dataset identifier
  - `organization_id` (text) - Organization identifier
  - `created_at`, `updated_at` (timestamptz)

  ## 2. Security
  - Enable RLS on the table
  - Add policies for public read access (demo mode)
  - Add policies for authenticated users to manage data

  ## 3. Indexes
  - Create indexes on material_code, category_code, business_unit for filtering
  - Create indexes on fiscal_year, fiscal_month for time-based queries
  - Create composite index on (material_code, business_unit, fiscal_year, fiscal_month) for efficient trend queries
*/

-- Create the price history table
CREATE TABLE IF NOT EXISTS fact_material_price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_code text NOT NULL,
  material_name text NOT NULL,
  category_code text NOT NULL,
  business_unit text NOT NULL,
  unit_id uuid,
  fiscal_year integer NOT NULL,
  fiscal_month integer NOT NULL CHECK (fiscal_month BETWEEN 1 AND 12),
  period_label text NOT NULL,
  price_per_unit numeric NOT NULL DEFAULT 0,
  quantity_ordered numeric DEFAULT 0,
  total_amount numeric DEFAULT 0,
  currency text DEFAULT 'IDR',
  vendor_id uuid,
  vendor_name text,
  po_count integer DEFAULT 1,
  dataset_id text NOT NULL DEFAULT 'DATASET_A',
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_price_history_material ON fact_material_price_history(material_code);
CREATE INDEX IF NOT EXISTS idx_price_history_category ON fact_material_price_history(category_code);
CREATE INDEX IF NOT EXISTS idx_price_history_unit ON fact_material_price_history(business_unit);
CREATE INDEX IF NOT EXISTS idx_price_history_period ON fact_material_price_history(fiscal_year, fiscal_month);
CREATE INDEX IF NOT EXISTS idx_price_history_dataset ON fact_material_price_history(dataset_id);
CREATE INDEX IF NOT EXISTS idx_price_history_org ON fact_material_price_history(organization_id);

-- Composite index for efficient trend queries
CREATE INDEX IF NOT EXISTS idx_price_history_trend ON fact_material_price_history(
  material_code,
  business_unit,
  fiscal_year,
  fiscal_month
);

-- Enable RLS
ALTER TABLE fact_material_price_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view price history"
  ON fact_material_price_history FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage price history"
  ON fact_material_price_history FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
