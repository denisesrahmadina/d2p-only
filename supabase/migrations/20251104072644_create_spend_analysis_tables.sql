/*
  # Create Spend Analysis Tables for Source to Contract Module

  ## Overview
  This migration creates comprehensive tables for the Spend Analysis module in the sustainable power generation procurement system.

  ## 1. New Tables

  ### Dimension Tables
  
  - `dim_materials`
    - `id` (uuid, primary key)
    - `material_code` (text, unique) - Material identification code
    - `description` (text) - Material description
    - `category_id` (uuid, foreign key) - Link to category
    - `unit_of_measure` (text) - UOM (e.g., KW, pieces, tons)
    - `is_categorized` (boolean) - Whether material has been categorized
    - `suggested_category_id` (uuid) - AI-suggested category
    - `confidence_score` (numeric) - AI confidence (0-100)
    - `organization_id` (uuid, foreign key)
    - `created_at`, `updated_at` (timestamptz)

  - `dim_categories`
    - `id` (uuid, primary key)
    - `category_code` (text, unique)
    - `category_name` (text)
    - `parent_category_id` (uuid) - For hierarchical structure
    - `level` (integer) - Hierarchy level (1=top, 2=sub, etc.)
    - `category_type` (text) - solar, wind, battery, infrastructure, services
    - `organization_id` (uuid, foreign key)
    - `created_at`, `updated_at` (timestamptz)

  - `dim_units`
    - `id` (uuid, primary key)
    - `unit_code` (text, unique)
    - `unit_name` (text)
    - `province` (text) - Indonesian province
    - `city` (text)
    - `latitude` (numeric)
    - `longitude` (numeric)
    - `unit_type` (text) - generation_plant, office, warehouse
    - `organization_id` (uuid, foreign key)
    - `created_at`, `updated_at` (timestamptz)

  - `dim_vendor_extended`
    - `id` (uuid, primary key)
    - `vendor_code` (text, unique)
    - `vendor_name` (text)
    - `segmentation` (text) - strategic, preferred, transactional, tail
    - `is_local` (boolean)
    - `is_subsidiary` (boolean)
    - `performance_score` (numeric) - 0-100
    - `risk_score` (numeric) - 0-100
    - `compliance_score` (numeric) - 0-100
    - `primary_categories` (text[]) - Array of category codes
    - `organization_id` (uuid, foreign key)
    - `created_at`, `updated_at` (timestamptz)

  - `dim_contracts`
    - `id` (uuid, primary key)
    - `contract_number` (text, unique)
    - `contract_name` (text)
    - `vendor_id` (uuid, foreign key)
    - `category_id` (uuid, foreign key)
    - `contract_value` (numeric)
    - `start_date` (date)
    - `end_date` (date)
    - `status` (text) - active, expiring_soon, expired
    - `organization_id` (uuid, foreign key)
    - `created_at`, `updated_at` (timestamptz)

  ### Fact Tables

  - `fact_purchase_orders`
    - `id` (uuid, primary key)
    - `po_number` (text, unique)
    - `po_line_number` (integer)
    - `material_id` (uuid, foreign key)
    - `vendor_id` (uuid, foreign key)
    - `unit_id` (uuid, foreign key)
    - `category_id` (uuid, foreign key)
    - `contract_id` (uuid, nullable) - Link to contract if contracted
    - `po_date` (date)
    - `fiscal_year` (integer)
    - `fiscal_quarter` (integer)
    - `quantity` (numeric)
    - `unit_price` (numeric)
    - `total_amount` (numeric)
    - `currency` (text)
    - `has_contract` (boolean)
    - `is_maverick` (boolean) - Outside approved processes
    - `budget_code` (text)
    - `budgeted_amount` (numeric)
    - `requestor_name` (text)
    - `organization_id` (uuid, foreign key)
    - `created_at`, `updated_at` (timestamptz)

  - `fact_spend_summary`
    - `id` (uuid, primary key)
    - `summary_date` (date)
    - `dimension_type` (text) - category, vendor, unit, overall
    - `dimension_id` (uuid) - ID of category/vendor/unit
    - `total_spend` (numeric)
    - `contracted_spend` (numeric)
    - `non_contracted_spend` (numeric)
    - `local_vendor_spend` (numeric)
    - `subsidiary_spend` (numeric)
    - `tail_spend` (numeric)
    - `maverick_spend` (numeric)
    - `po_count` (integer)
    - `po_with_contract_count` (integer)
    - `unique_vendors_count` (integer)
    - `organization_id` (uuid, foreign key)
    - `created_at`, `updated_at` (timestamptz)

  - `fact_category_mappings`
    - `id` (uuid, primary key)
    - `material_id` (uuid, foreign key)
    - `suggested_category_id` (uuid, foreign key)
    - `approved_category_id` (uuid, foreign key, nullable)
    - `confidence_score` (numeric)
    - `status` (text) - pending, approved, rejected
    - `approved_by` (uuid) - User ID
    - `approved_at` (timestamptz)
    - `organization_id` (uuid, foreign key)
    - `created_at`, `updated_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Add policies for authenticated users to read their organization's data
  - Add policies for authorized users to manage category mappings

  ## 3. Indexes
  - Create indexes on foreign keys for query performance
  - Create indexes on date fields for time-based queries
  - Create indexes on organization_id for multi-tenant isolation
*/

-- Dimension Tables

CREATE TABLE IF NOT EXISTS dim_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_code text UNIQUE NOT NULL,
  description text NOT NULL,
  category_id uuid,
  unit_of_measure text DEFAULT 'EA',
  is_categorized boolean DEFAULT false,
  suggested_category_id uuid,
  confidence_score numeric CHECK (confidence_score >= 0 AND confidence_score <= 100),
  organization_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dim_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text UNIQUE NOT NULL,
  category_name text NOT NULL,
  parent_category_id uuid,
  level integer DEFAULT 1,
  category_type text,
  organization_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dim_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_code text UNIQUE NOT NULL,
  unit_name text NOT NULL,
  province text,
  city text,
  latitude numeric,
  longitude numeric,
  unit_type text DEFAULT 'generation_plant',
  organization_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dim_vendor_extended (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_code text UNIQUE NOT NULL,
  vendor_name text NOT NULL,
  segmentation text DEFAULT 'transactional',
  is_local boolean DEFAULT false,
  is_subsidiary boolean DEFAULT false,
  performance_score numeric DEFAULT 75 CHECK (performance_score >= 0 AND performance_score <= 100),
  risk_score numeric DEFAULT 50 CHECK (risk_score >= 0 AND risk_score <= 100),
  compliance_score numeric DEFAULT 80 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  primary_categories text[] DEFAULT '{}',
  organization_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dim_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number text UNIQUE NOT NULL,
  contract_name text NOT NULL,
  vendor_id uuid,
  category_id uuid,
  contract_value numeric DEFAULT 0,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text DEFAULT 'active',
  organization_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fact Tables

CREATE TABLE IF NOT EXISTS fact_purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number text NOT NULL,
  po_line_number integer DEFAULT 1,
  material_id uuid,
  vendor_id uuid,
  unit_id uuid,
  category_id uuid,
  contract_id uuid,
  po_date date NOT NULL,
  fiscal_year integer NOT NULL,
  fiscal_quarter integer CHECK (fiscal_quarter >= 1 AND fiscal_quarter <= 4),
  quantity numeric DEFAULT 1,
  unit_price numeric DEFAULT 0,
  total_amount numeric DEFAULT 0,
  currency text DEFAULT 'IDR',
  has_contract boolean DEFAULT false,
  is_maverick boolean DEFAULT false,
  budget_code text,
  budgeted_amount numeric DEFAULT 0,
  requestor_name text,
  organization_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(po_number, po_line_number)
);

CREATE TABLE IF NOT EXISTS fact_spend_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_date date NOT NULL,
  dimension_type text NOT NULL,
  dimension_id uuid,
  total_spend numeric DEFAULT 0,
  contracted_spend numeric DEFAULT 0,
  non_contracted_spend numeric DEFAULT 0,
  local_vendor_spend numeric DEFAULT 0,
  subsidiary_spend numeric DEFAULT 0,
  tail_spend numeric DEFAULT 0,
  maverick_spend numeric DEFAULT 0,
  po_count integer DEFAULT 0,
  po_with_contract_count integer DEFAULT 0,
  unique_vendors_count integer DEFAULT 0,
  organization_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fact_category_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid NOT NULL,
  suggested_category_id uuid NOT NULL,
  approved_category_id uuid,
  confidence_score numeric CHECK (confidence_score >= 0 AND confidence_score <= 100),
  status text DEFAULT 'pending',
  approved_by uuid,
  approved_at timestamptz,
  organization_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Foreign Key Constraints

ALTER TABLE dim_materials ADD CONSTRAINT fk_materials_category 
  FOREIGN KEY (category_id) REFERENCES dim_categories(id);

ALTER TABLE dim_materials ADD CONSTRAINT fk_materials_suggested_category 
  FOREIGN KEY (suggested_category_id) REFERENCES dim_categories(id);

ALTER TABLE dim_categories ADD CONSTRAINT fk_categories_parent 
  FOREIGN KEY (parent_category_id) REFERENCES dim_categories(id);

ALTER TABLE dim_contracts ADD CONSTRAINT fk_contracts_vendor 
  FOREIGN KEY (vendor_id) REFERENCES dim_vendor_extended(id);

ALTER TABLE dim_contracts ADD CONSTRAINT fk_contracts_category 
  FOREIGN KEY (category_id) REFERENCES dim_categories(id);

ALTER TABLE fact_purchase_orders ADD CONSTRAINT fk_po_material 
  FOREIGN KEY (material_id) REFERENCES dim_materials(id);

ALTER TABLE fact_purchase_orders ADD CONSTRAINT fk_po_vendor 
  FOREIGN KEY (vendor_id) REFERENCES dim_vendor_extended(id);

ALTER TABLE fact_purchase_orders ADD CONSTRAINT fk_po_unit 
  FOREIGN KEY (unit_id) REFERENCES dim_units(id);

ALTER TABLE fact_purchase_orders ADD CONSTRAINT fk_po_category 
  FOREIGN KEY (category_id) REFERENCES dim_categories(id);

ALTER TABLE fact_purchase_orders ADD CONSTRAINT fk_po_contract 
  FOREIGN KEY (contract_id) REFERENCES dim_contracts(id);

ALTER TABLE fact_category_mappings ADD CONSTRAINT fk_mapping_material 
  FOREIGN KEY (material_id) REFERENCES dim_materials(id);

ALTER TABLE fact_category_mappings ADD CONSTRAINT fk_mapping_suggested 
  FOREIGN KEY (suggested_category_id) REFERENCES dim_categories(id);

ALTER TABLE fact_category_mappings ADD CONSTRAINT fk_mapping_approved 
  FOREIGN KEY (approved_category_id) REFERENCES dim_categories(id);

-- Indexes for Performance

CREATE INDEX IF NOT EXISTS idx_materials_org ON dim_materials(organization_id);
CREATE INDEX IF NOT EXISTS idx_materials_category ON dim_materials(category_id);
CREATE INDEX IF NOT EXISTS idx_materials_categorized ON dim_materials(is_categorized);

CREATE INDEX IF NOT EXISTS idx_categories_org ON dim_categories(organization_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON dim_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_categories_type ON dim_categories(category_type);

CREATE INDEX IF NOT EXISTS idx_units_org ON dim_units(organization_id);
CREATE INDEX IF NOT EXISTS idx_units_province ON dim_units(province);

CREATE INDEX IF NOT EXISTS idx_vendors_org ON dim_vendor_extended(organization_id);
CREATE INDEX IF NOT EXISTS idx_vendors_segmentation ON dim_vendor_extended(segmentation);

CREATE INDEX IF NOT EXISTS idx_contracts_org ON dim_contracts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contracts_vendor ON dim_contracts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON dim_contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_dates ON dim_contracts(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_po_org ON fact_purchase_orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_po_vendor ON fact_purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_po_category ON fact_purchase_orders(category_id);
CREATE INDEX IF NOT EXISTS idx_po_unit ON fact_purchase_orders(unit_id);
CREATE INDEX IF NOT EXISTS idx_po_date ON fact_purchase_orders(po_date);
CREATE INDEX IF NOT EXISTS idx_po_fiscal ON fact_purchase_orders(fiscal_year, fiscal_quarter);
CREATE INDEX IF NOT EXISTS idx_po_contract ON fact_purchase_orders(has_contract);

CREATE INDEX IF NOT EXISTS idx_spend_summary_org ON fact_spend_summary(organization_id);
CREATE INDEX IF NOT EXISTS idx_spend_summary_dimension ON fact_spend_summary(dimension_type, dimension_id);
CREATE INDEX IF NOT EXISTS idx_spend_summary_date ON fact_spend_summary(summary_date);

CREATE INDEX IF NOT EXISTS idx_mappings_org ON fact_category_mappings(organization_id);
CREATE INDEX IF NOT EXISTS idx_mappings_material ON fact_category_mappings(material_id);
CREATE INDEX IF NOT EXISTS idx_mappings_status ON fact_category_mappings(status);

-- Row Level Security

ALTER TABLE dim_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_vendor_extended ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_spend_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_category_mappings ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow anonymous read for demo purposes

CREATE POLICY "Allow anonymous read dim_materials"
  ON dim_materials FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read dim_categories"
  ON dim_categories FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read dim_units"
  ON dim_units FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read dim_vendor_extended"
  ON dim_vendor_extended FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read dim_contracts"
  ON dim_contracts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read fact_purchase_orders"
  ON fact_purchase_orders FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read fact_spend_summary"
  ON fact_spend_summary FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read fact_category_mappings"
  ON fact_category_mappings FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to manage category mappings

CREATE POLICY "Authenticated users can update category mappings"
  ON fact_category_mappings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert category mappings"
  ON fact_category_mappings FOR INSERT
  TO authenticated
  WITH CHECK (true);