/*
  # Create Category Strategy Procurement Request Table

  1. New Tables
    - `fact_category_strategy_procurement_request`
      - Stores procurement requests specifically for Category Strategy workflow
      - Each record represents a single material/item
      - Fields: id, material_name, material_code, category, quantity, unit_of_measure, unit_price, total_amount, description, requestor, priority, due_date, dataset_id, organization_id, created_at

  2. Security
    - Enable RLS on the table
    - Allow public read access for demo purposes
    - Authenticated users can create, update, and delete records

  3. Important Notes
    - This table is separate from fact_procurement_request to maintain clean separation
    - Designed specifically for Category Strategy workflow
    - Each procurement request represents a single material only
    - Supports multi-tenancy through dataset_id and organization_id
    - Power plant equipment focus: turbines, generators, transformers, etc.
*/

-- Create the procurement request table for Category Strategy
CREATE TABLE IF NOT EXISTS fact_category_strategy_procurement_request (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_name text NOT NULL,
  material_code text NOT NULL,
  category text NOT NULL,
  quantity numeric NOT NULL CHECK (quantity > 0),
  unit_of_measure text NOT NULL,
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  total_amount numeric GENERATED ALWAYS AS (quantity * unit_price) STORED,
  description text,
  requestor text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  due_date date NOT NULL,
  dataset_id text NOT NULL CHECK (dataset_id IN ('DATASET_A', 'DATASET_B')),
  organization_id text NOT NULL DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE fact_category_strategy_procurement_request ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read for demo, authenticated users can manage
CREATE POLICY "Anyone can view category strategy procurement requests"
  ON fact_category_strategy_procurement_request FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create category strategy procurement requests"
  ON fact_category_strategy_procurement_request FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update category strategy procurement requests"
  ON fact_category_strategy_procurement_request FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete category strategy procurement requests"
  ON fact_category_strategy_procurement_request FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for optimal query performance
CREATE INDEX IF NOT EXISTS idx_cat_strat_pr_category ON fact_category_strategy_procurement_request(category);
CREATE INDEX IF NOT EXISTS idx_cat_strat_pr_dataset ON fact_category_strategy_procurement_request(dataset_id);
CREATE INDEX IF NOT EXISTS idx_cat_strat_pr_org ON fact_category_strategy_procurement_request(organization_id);
CREATE INDEX IF NOT EXISTS idx_cat_strat_pr_priority ON fact_category_strategy_procurement_request(priority);
CREATE INDEX IF NOT EXISTS idx_cat_strat_pr_due_date ON fact_category_strategy_procurement_request(due_date);
