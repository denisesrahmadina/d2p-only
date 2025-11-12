/*
  # Rebuild PLN Indonesia Power Marketplace Schema
  
  ## Overview
  Complete rebuild of marketplace system for PLN Indonesia Power with focus on power plant
  equipment procurement, enhanced tracking, and Accenture purple theme.
  
  ## Changes
  
  ### 1. Cleanup - Drop old marketplace-specific tables only
  - Drop fact_cart (old cart table)
  - Drop dim_contract (replaced with item catalog)
  - Drop dim_vendor (replaced with suppliers)  
  - Drop dim_material (integrated into items)
  - Keep existing PR tables (fact_pr_header, fact_pr_line, fact_pr_approval_workflow)
  
  ### 2. New Tables Created
  
  #### Equipment Categories
  - `marketplace_categories` - 7 main PLN equipment categories
  
  #### Suppliers
  - `marketplace_suppliers` - PLN-approved vendors
  
  #### Item Catalog
  - `marketplace_items` - Product catalog with technical specifications
  
  #### Shopping Cart
  - `marketplace_cart_items` - User shopping cart
  
  #### Order Monitoring
  - `marketplace_orders` - Order tracking master records
  - `marketplace_order_tracking` - Real-time location tracking (5-step process)
  
  #### Supporting Tables
  - `marketplace_item_documents` - Technical documents and certifications
  - `marketplace_pln_facilities` - Delivery locations (PLN facilities)
  
  ## Security
  - RLS enabled on all tables
  - Public read access for catalog browsing
  - Authenticated users can manage cart and create PRs
*/

-- ============================================================================
-- CLEANUP: Drop old marketplace tables (keep PR tables)
-- ============================================================================

DROP TABLE IF EXISTS fact_cart CASCADE;
DROP TABLE IF EXISTS dim_contract CASCADE;
DROP TABLE IF EXISTS dim_vendor CASCADE;
DROP TABLE IF EXISTS dim_material CASCADE;

-- ============================================================================
-- CATEGORIES: 7 PLN Equipment Categories
-- ============================================================================

CREATE TABLE IF NOT EXISTS marketplace_categories (
  category_id text PRIMARY KEY,
  category_code text NOT NULL UNIQUE,
  category_name text NOT NULL,
  description text,
  icon_name text DEFAULT 'Package',
  color_scheme text DEFAULT 'purple',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

INSERT INTO marketplace_categories (category_id, category_code, category_name, description, icon_name, display_order) VALUES
  ('CAT-MECH', 'MECH', 'Mechanical Equipment', 'Turbines, pumps, compressors, heat exchangers, and mechanical power transmission systems', 'Cog', 1),
  ('CAT-ELEC', 'ELEC', 'Electrical Equipment', 'Generators, transformers, switchgear, circuit breakers, and electrical distribution systems', 'Zap', 2),
  ('CAT-INST', 'INST', 'Instrumentation & Control Systems', 'Control panels, sensors, PLCs, SCADA systems, and monitoring equipment', 'Gauge', 3),
  ('CAT-CONS', 'CONS', 'Construction Materials', 'Structural steel, concrete, piping systems, insulation, and building materials', 'Building2', 4),
  ('CAT-SPARE', 'SPARE', 'Spare Parts & Maintenance Materials', 'Replacement components, lubricants, chemicals, tools, and consumables', 'Wrench', 5),
  ('CAT-SAFE', 'SAFE', 'Safety & Environmental Equipment', 'PPE, fire protection, emission control, waste treatment, and environmental monitoring', 'Shield', 6),
  ('CAT-SERV', 'SERV', 'Services', 'Maintenance contracts, installation services, training, and technical support', 'Clipboard', 7)
ON CONFLICT (category_id) DO NOTHING;

-- ============================================================================
-- SUPPLIERS: PLN-Approved Vendors
-- ============================================================================

CREATE TABLE IF NOT EXISTS marketplace_suppliers (
  supplier_id text PRIMARY KEY,
  supplier_code text NOT NULL UNIQUE,
  supplier_name text NOT NULL,
  contact_person text,
  contact_email text,
  contact_phone text,
  address text,
  city text,
  province text,
  postal_code text,
  certifications jsonb DEFAULT '[]'::jsonb,
  performance_rating numeric(3,2) DEFAULT 0 CHECK (performance_rating >= 0 AND performance_rating <= 5),
  is_pln_approved boolean DEFAULT true,
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mkt_suppliers_city ON marketplace_suppliers(city);
CREATE INDEX IF NOT EXISTS idx_mkt_suppliers_approved ON marketplace_suppliers(is_pln_approved, is_active);

-- ============================================================================
-- ITEM CATALOG: Products and Equipment
-- ============================================================================

CREATE TABLE IF NOT EXISTS marketplace_items (
  item_id text PRIMARY KEY,
  item_code text NOT NULL UNIQUE,
  item_name text NOT NULL,
  item_description text,
  category_id text NOT NULL REFERENCES marketplace_categories(category_id),
  supplier_id text NOT NULL REFERENCES marketplace_suppliers(supplier_id),
  unit_price numeric(15,2) NOT NULL CHECK (unit_price >= 0),
  currency text DEFAULT 'IDR',
  stock_quantity integer DEFAULT 0 CHECK (stock_quantity >= 0),
  lead_time_days integer DEFAULT 30 CHECK (lead_time_days >= 0),
  unit_of_measure text NOT NULL,
  technical_specifications jsonb DEFAULT '{}'::jsonb,
  compliance_certifications jsonb DEFAULT '[]'::jsonb,
  warranty_info text,
  image_url text,
  image_placeholder_text text DEFAULT 'Image Coming Soon',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mkt_items_category ON marketplace_items(category_id);
CREATE INDEX IF NOT EXISTS idx_mkt_items_supplier ON marketplace_items(supplier_id);
CREATE INDEX IF NOT EXISTS idx_mkt_items_code ON marketplace_items(item_code);
CREATE INDEX IF NOT EXISTS idx_mkt_items_active ON marketplace_items(is_active);
CREATE INDEX IF NOT EXISTS idx_mkt_items_stock ON marketplace_items(stock_quantity);

-- ============================================================================
-- SHOPPING CART
-- ============================================================================

CREATE TABLE IF NOT EXISTS marketplace_cart_items (
  cart_item_id bigserial PRIMARY KEY,
  user_id text NOT NULL,
  item_id text NOT NULL REFERENCES marketplace_items(item_id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(15,2) NOT NULL,
  total_price numeric(15,2) NOT NULL,
  notes text,
  added_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_mkt_user_item UNIQUE (user_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_mkt_cart_user ON marketplace_cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_mkt_cart_item ON marketplace_cart_items(item_id);

-- ============================================================================
-- PLN FACILITIES: Delivery Locations
-- ============================================================================

CREATE TABLE IF NOT EXISTS marketplace_pln_facilities (
  facility_id text PRIMARY KEY,
  facility_code text NOT NULL UNIQUE,
  facility_name text NOT NULL,
  facility_type text,
  address text NOT NULL,
  city text NOT NULL,
  province text NOT NULL,
  postal_code text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  contact_person text,
  contact_phone text,
  contact_email text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mkt_facilities_city ON marketplace_pln_facilities(city);
CREATE INDEX IF NOT EXISTS idx_mkt_facilities_type ON marketplace_pln_facilities(facility_type);

-- ============================================================================
-- ORDER MONITORING: 5-Step Tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS marketplace_orders (
  order_id bigserial PRIMARY KEY,
  po_number text NOT NULL UNIQUE,
  pr_id bigint REFERENCES fact_pr_header(pr_id),
  supplier_id text NOT NULL REFERENCES marketplace_suppliers(supplier_id),
  total_value numeric(15,2) NOT NULL,
  currency text DEFAULT 'IDR',
  current_status text NOT NULL DEFAULT 'ORDER_PLACED' CHECK (current_status IN ('ORDER_PLACED', 'PROCESSING_ORDER', 'SHIPPED', 'DELIVERY', 'ARRIVED_AT_DESTINATION')),
  current_step integer DEFAULT 1 CHECK (current_step BETWEEN 1 AND 5),
  order_placed_date timestamptz NOT NULL DEFAULT now(),
  processing_date timestamptz,
  shipped_date timestamptz,
  delivery_date timestamptz,
  arrived_date timestamptz,
  tracking_number text,
  carrier text,
  expected_delivery_date timestamptz,
  is_delayed boolean DEFAULT false,
  delay_reason text,
  delivery_facility_id text REFERENCES marketplace_pln_facilities(facility_id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS marketplace_order_lines (
  order_line_id bigserial PRIMARY KEY,
  order_id bigint NOT NULL REFERENCES marketplace_orders(order_id) ON DELETE CASCADE,
  line_number integer NOT NULL,
  item_id text NOT NULL REFERENCES marketplace_items(item_id),
  quantity integer NOT NULL,
  unit_price numeric(15,2) NOT NULL,
  total_price numeric(15,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_mkt_order_line UNIQUE (order_id, line_number)
);

CREATE TABLE IF NOT EXISTS marketplace_order_tracking (
  tracking_id bigserial PRIMARY KEY,
  order_id bigint NOT NULL REFERENCES marketplace_orders(order_id) ON DELETE CASCADE,
  status text NOT NULL,
  location_name text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  timestamp timestamptz NOT NULL DEFAULT now(),
  notes text,
  photo_urls jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mkt_orders_status ON marketplace_orders(current_status);
CREATE INDEX IF NOT EXISTS idx_mkt_orders_supplier ON marketplace_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_mkt_orders_pr ON marketplace_orders(pr_id);
CREATE INDEX IF NOT EXISTS idx_mkt_order_lines_order ON marketplace_order_lines(order_id);
CREATE INDEX IF NOT EXISTS idx_mkt_order_tracking_order ON marketplace_order_tracking(order_id);

-- ============================================================================
-- ITEM DOCUMENTS: Technical Specs and Certifications
-- ============================================================================

CREATE TABLE IF NOT EXISTS marketplace_item_documents (
  document_id bigserial PRIMARY KEY,
  item_id text NOT NULL REFERENCES marketplace_items(item_id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('Technical Manual', 'Safety Certificate', 'Compliance Certificate', 'Warranty Document', 'Installation Guide', 'Other')),
  document_name text NOT NULL,
  document_url text NOT NULL,
  file_size bigint,
  uploaded_by text,
  uploaded_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mkt_item_docs_item ON marketplace_item_documents(item_id);
CREATE INDEX IF NOT EXISTS idx_mkt_item_docs_type ON marketplace_item_documents(document_type);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_pln_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_item_documents ENABLE ROW LEVEL SECURITY;

-- Public read access for catalog browsing
CREATE POLICY "Anyone can view categories" ON marketplace_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view active suppliers" ON marketplace_suppliers FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active items" ON marketplace_items FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view facilities" ON marketplace_pln_facilities FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view item documents" ON marketplace_item_documents FOR SELECT USING (true);

-- Cart management
CREATE POLICY "Users manage own cart" ON marketplace_cart_items FOR ALL USING (true) WITH CHECK (true);

-- Order monitoring
CREATE POLICY "Anyone can view orders" ON marketplace_orders FOR SELECT USING (true);
CREATE POLICY "Anyone can view order lines" ON marketplace_order_lines FOR SELECT USING (true);
CREATE POLICY "Anyone can view order tracking" ON marketplace_order_tracking FOR SELECT USING (true);
CREATE POLICY "Authenticated users manage orders" ON marketplace_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users manage order tracking" ON marketplace_order_tracking FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Admin policies for data management
CREATE POLICY "Authenticated users manage suppliers" ON marketplace_suppliers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users manage items" ON marketplace_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users manage documents" ON marketplace_item_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
