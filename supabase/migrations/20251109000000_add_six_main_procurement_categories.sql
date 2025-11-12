/*
  # Add Six Main Procurement Categories Structure

  ## Overview
  Extends the procurement savings and sourcing tables to support 6 main categories
  (A through F) with hierarchical subcategory structure for Indonesian Power Company.

  ## Changes

  ### 1. New Reference Table: `ref_procurement_categories`
  Stores the hierarchical structure of 6 main categories and their 34 subcategories:
  - Category A: Energi Primer dan Jasa Penunjangnya (3 subcategories)
  - Category B: Peralatan Penunjang dan Sistem Mechanical/Electrical (9 subcategories)
  - Category C: Material, Consumable, dan General Supply (11 subcategories)
  - Category D: Asset Non-Operasional dan Penunjang Manajemen (6 subcategories)
  - Category E: Jasa dan Kontrak Pendukung (5 subcategories)
  - Category F: Peralatan Utama Pembangkit dan Project EPC (9 subcategories)

  ### 2. Schema Extensions
  - Add `main_category` and `sub_category` columns to existing tables
  - Maintain backward compatibility with existing category field
  - Add category-specific benchmarks for metrics calculations

  ## Security
  - Enable RLS on new reference table
  - Public read access for category reference data
  - Authenticated users can manage categories
*/

-- Create reference table for procurement categories
CREATE TABLE IF NOT EXISTS ref_procurement_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  main_category_code text NOT NULL CHECK (main_category_code IN ('A', 'B', 'C', 'D', 'E', 'F')),
  main_category_name text NOT NULL,
  sub_category_name text NOT NULL,
  description text,
  typical_contract_value_min numeric,
  typical_contract_value_max numeric,
  typical_sourcing_days_min integer,
  typical_sourcing_days_max integer,
  target_savings_percentage numeric,
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(main_category_code, sub_category_name, organization_id)
);

-- Add main_category and sub_category columns to existing tables
ALTER TABLE fact_procurement_savings_contract
  ADD COLUMN IF NOT EXISTS main_category text,
  ADD COLUMN IF NOT EXISTS sub_category text;

ALTER TABLE procurement_sourcing_contracts
  ADD COLUMN IF NOT EXISTS main_category text,
  ADD COLUMN IF NOT EXISTS sub_category text;

ALTER TABLE supplier_otif_deliveries
  ADD COLUMN IF NOT EXISTS main_category text,
  ADD COLUMN IF NOT EXISTS sub_category text;

-- Add unique constraint to supplier_otif_performance if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'unique_supplier_otif_performance_period'
  ) THEN
    ALTER TABLE supplier_otif_performance
    ADD CONSTRAINT unique_supplier_otif_performance_period
    UNIQUE (organization_id, supplier_id, period_start, period_end);
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_main ON ref_procurement_categories(main_category_code);
CREATE INDEX IF NOT EXISTS idx_categories_org ON ref_procurement_categories(organization_id);
CREATE INDEX IF NOT EXISTS idx_savings_main_category ON fact_procurement_savings_contract(main_category);
CREATE INDEX IF NOT EXISTS idx_savings_sub_category ON fact_procurement_savings_contract(sub_category);
CREATE INDEX IF NOT EXISTS idx_sourcing_main_category ON procurement_sourcing_contracts(main_category);
CREATE INDEX IF NOT EXISTS idx_sourcing_sub_category ON procurement_sourcing_contracts(sub_category);
CREATE INDEX IF NOT EXISTS idx_otif_main_category ON supplier_otif_deliveries(main_category);

-- Enable RLS
ALTER TABLE ref_procurement_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ref_procurement_categories
CREATE POLICY "Anyone can view procurement categories"
  ON ref_procurement_categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create categories"
  ON ref_procurement_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON ref_procurement_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add helpful comment
COMMENT ON TABLE ref_procurement_categories IS 'Hierarchical procurement category structure for Indonesian Power Company with 6 main categories (A-F) and 34 subcategories';
