/*
  # Add Indonesian Procurement Categories Structure

  1. New Tables
    - `ref_procurement_categories`
      - Stores the 6 main Indonesian procurement categories (A-F)
      - Contains 34 subcategories across all main categories
      - Includes Indonesian names and descriptions
      - Links categories with target benchmarks

  2. Schema Extensions
    - Add category_id to existing contract tables
    - Add main_category_code for easy filtering
    - Add target benchmarks per category

  3. Security
    - Enable RLS on category reference table
    - Public read access for category lookups
    - Authenticated users can manage categories

  4. Important Notes
    - Main categories: A, B, C, D, E, F
    - All names stored in Indonesian (Bahasa Indonesia)
    - Target sourcing days vary by category complexity
    - Categories aligned with Indonesia Power procurement standards
*/

-- Create ref_procurement_categories table
CREATE TABLE IF NOT EXISTS ref_procurement_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  main_category_code text NOT NULL CHECK (main_category_code IN ('A', 'B', 'C', 'D', 'E', 'F')),
  main_category_name_id text NOT NULL,
  main_category_description_id text,
  subcategory_code text NOT NULL UNIQUE,
  subcategory_name_id text NOT NULL,
  subcategory_description_id text,
  target_sourcing_days integer,
  target_otif_percentage numeric DEFAULT 95.0,
  target_savings_percentage numeric DEFAULT 10.0,
  is_active boolean DEFAULT true,
  display_order integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(main_category_code, subcategory_code)
);

-- Add category columns to existing tables if not exists
DO $$
BEGIN
  -- Add to fact_procurement_savings_contract
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_savings_contract'
    AND column_name = 'category_id'
  ) THEN
    ALTER TABLE fact_procurement_savings_contract
    ADD COLUMN category_id uuid REFERENCES ref_procurement_categories(id),
    ADD COLUMN main_category_code text,
    ADD COLUMN subcategory_code text;
  END IF;

  -- Add to procurement_sourcing_contracts
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'procurement_sourcing_contracts'
    AND column_name = 'category_id'
  ) THEN
    ALTER TABLE procurement_sourcing_contracts
    ADD COLUMN category_id uuid REFERENCES ref_procurement_categories(id),
    ADD COLUMN main_category_code text,
    ADD COLUMN subcategory_code text,
    ADD COLUMN contract_description text;
  END IF;

  -- Add to supplier_otif_deliveries
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'supplier_otif_deliveries'
    AND column_name = 'category_id'
  ) THEN
    ALTER TABLE supplier_otif_deliveries
    ADD COLUMN category_id uuid REFERENCES ref_procurement_categories(id),
    ADD COLUMN main_category_code text,
    ADD COLUMN contract_name text,
    ADD COLUMN contract_description text,
    ADD COLUMN contract_id text,
    ADD COLUMN contract_value numeric;
  END IF;
END $$;

-- Enable RLS on ref_procurement_categories
ALTER TABLE ref_procurement_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ref_procurement_categories
CREATE POLICY "Anyone can view procurement categories"
  ON ref_procurement_categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON ref_procurement_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON ref_procurement_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_main_code ON ref_procurement_categories(main_category_code);
CREATE INDEX IF NOT EXISTS idx_categories_sub_code ON ref_procurement_categories(subcategory_code);
CREATE INDEX IF NOT EXISTS idx_categories_active ON ref_procurement_categories(is_active);

CREATE INDEX IF NOT EXISTS idx_savings_category_id ON fact_procurement_savings_contract(category_id);
CREATE INDEX IF NOT EXISTS idx_savings_main_category ON fact_procurement_savings_contract(main_category_code);

CREATE INDEX IF NOT EXISTS idx_sourcing_category_id ON procurement_sourcing_contracts(category_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_main_category ON procurement_sourcing_contracts(main_category_code);

CREATE INDEX IF NOT EXISTS idx_otif_category_id ON supplier_otif_deliveries(category_id);
CREATE INDEX IF NOT EXISTS idx_otif_main_category ON supplier_otif_deliveries(main_category_code);
