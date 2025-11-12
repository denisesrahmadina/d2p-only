/*
  # Create Historical Unit Price Analysis Tables

  ## Overview
  This migration creates tables to store and analyze historical buying prices per business unit (region) 
  for procurement materials, enabling trend analysis and AI-driven insights.

  ## New Tables
  
  ### `fact_historical_unit_prices`
  Stores historical buying price records per business unit and material
  - `id` (uuid, primary key)
  - `organization_id` (uuid, foreign key)
  - `business_unit` (text) - Region/Unit name (e.g., Java 1, Sumatra, Java 2)
  - `category_id` (uuid, foreign key) - Reference to category
  - `material_code` (text) - Material identifier
  - `material_name` (text) - Material description
  - `price_per_unit` (numeric) - Historical price per unit
  - `unit_of_measure` (text) - UOM (e.g., KG, L, PCS)
  - `purchase_date` (date) - Date of purchase
  - `vendor_name` (text) - Supplier name
  - `quantity_purchased` (numeric) - Quantity in transaction
  - `total_value` (numeric) - Total transaction value
  - `period_month` (integer) - Month (1-12)
  - `period_year` (integer) - Year
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `dim_business_units`
  Dimension table for business units/regions
  - `id` (uuid, primary key)
  - `organization_id` (uuid, foreign key)
  - `unit_code` (text) - Unique unit code
  - `unit_name` (text) - Display name
  - `region` (text) - Geographic region
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ### `fact_unit_price_insights`
  AI-generated insights and action plans based on price trends
  - `id` (uuid, primary key)
  - `organization_id` (uuid, foreign key)
  - `business_unit` (text)
  - `category_id` (uuid)
  - `material_code` (text)
  - `analysis_period_start` (date)
  - `analysis_period_end` (date)
  - `average_price` (numeric)
  - `lowest_price` (numeric)
  - `highest_price` (numeric)
  - `price_trend` (text) - Rising, Falling, Stable
  - `trend_percentage` (numeric) - Percentage change
  - `insight_summary` (text) - AI-generated insight
  - `action_plan` (jsonb) - Array of recommended actions
  - `priority` (text) - High, Medium, Low
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated user access
*/

-- Create business units dimension table
CREATE TABLE IF NOT EXISTS dim_business_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  unit_code text NOT NULL,
  unit_name text NOT NULL,
  region text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, unit_code)
);

-- Create historical unit prices fact table
CREATE TABLE IF NOT EXISTS fact_historical_unit_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  business_unit text NOT NULL,
  category_id uuid,
  material_code text NOT NULL,
  material_name text NOT NULL,
  price_per_unit numeric(15,2) NOT NULL,
  unit_of_measure text NOT NULL,
  purchase_date date NOT NULL,
  vendor_name text,
  quantity_purchased numeric(15,2),
  total_value numeric(15,2),
  period_month integer NOT NULL CHECK (period_month >= 1 AND period_month <= 12),
  period_year integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_historical_unit_prices_lookup 
  ON fact_historical_unit_prices(organization_id, business_unit, material_code, purchase_date);

CREATE INDEX IF NOT EXISTS idx_historical_unit_prices_period 
  ON fact_historical_unit_prices(period_year, period_month);

-- Create unit price insights table
CREATE TABLE IF NOT EXISTS fact_unit_price_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  business_unit text NOT NULL,
  category_id uuid,
  material_code text NOT NULL,
  analysis_period_start date NOT NULL,
  analysis_period_end date NOT NULL,
  average_price numeric(15,2),
  lowest_price numeric(15,2),
  highest_price numeric(15,2),
  price_trend text CHECK (price_trend IN ('Rising', 'Falling', 'Stable')),
  trend_percentage numeric(5,2),
  insight_summary text,
  action_plan jsonb,
  priority text CHECK (priority IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE dim_business_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_historical_unit_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_unit_price_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow anonymous read access for demo
CREATE POLICY "Allow anonymous read access to business units"
  ON dim_business_units FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access to historical unit prices"
  ON fact_historical_unit_prices FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access to unit price insights"
  ON fact_unit_price_insights FOR SELECT
  TO anon
  USING (true);

-- Authenticated user policies
CREATE POLICY "Authenticated users can read business units"
  ON dim_business_units FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read historical unit prices"
  ON fact_historical_unit_prices FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read unit price insights"
  ON fact_unit_price_insights FOR SELECT
  TO authenticated
  USING (true);