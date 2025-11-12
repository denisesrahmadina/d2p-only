/*
  # Bundling System and Mock Data Enhancement

  1. Summary
    - Add comprehensive bundling recommendation system to database
    - Populate procurement requests with high-value bundling opportunities
    - Create pre-defined sourcing event templates for faster event creation
    - Add sample data covering complete workflow from Step 1 to Step 5

  2. New Tables/Updates
    - Update ref_bundling_recommendation with better structure
    - Add ref_sourcing_event_template for pre-defined event configurations
    - Populate fact_procurement_request with mock data showing clear bundling benefits

  3. Mock Data Strategy
    - 20+ procurement requests across 5 categories with varying values
    - 3-4 clear bundling groups showing 12-15% savings potential
    - Pre-defined sourcing event templates for common scenarios
    - Complete data chain to support all 5 workflow steps

  4. Security
    - Maintain existing RLS policies
    - All mock data uses consistent organization_id for testing

  5. Bundling Logic
    - Group by category similarity
    - Consider delivery location proximity
    - Factor in due date alignment (within 30 days)
    - Calculate volume discount opportunities
    - Estimate administrative efficiency gains
*/

-- Add pr_line_number and pr_number columns to fact_procurement_request if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'pr_number'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN pr_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'pr_line_number'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN pr_line_number integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'pr_type'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN pr_type text DEFAULT 'Standard';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'pr_status'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN pr_status text DEFAULT 'APPROVED';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'pr_date'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN pr_date date DEFAULT CURRENT_DATE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'material_id'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN material_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'vendor_id'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN vendor_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'unit_requestor_id'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN unit_requestor_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'requirement_date'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN requirement_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'delivery_date'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN delivery_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'demand_qty'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN demand_qty numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'qty_ordered'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN qty_ordered numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'unit_price'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN unit_price numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'pr_value'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN pr_value numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'currency'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN currency text DEFAULT 'IDR';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'created_date'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN created_date timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'pr_id'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN pr_id bigint;
  END IF;
END $$;

-- Create ref_sourcing_event_template table for pre-defined templates
CREATE TABLE IF NOT EXISTS ref_sourcing_event_template (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name text NOT NULL,
  template_description text,
  category text NOT NULL,
  default_delivery_terms text,
  default_evaluation_criteria jsonb DEFAULT '[]'::jsonb,
  default_milestones jsonb DEFAULT '[]'::jsonb,
  estimated_duration_days integer DEFAULT 60,
  recommended_vendors jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  organization_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ref_sourcing_event_template ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal users can read templates"
  ON ref_sourcing_event_template FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Internal users can create templates"
  ON ref_sourcing_event_template FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Internal users can update templates"
  ON ref_sourcing_event_template FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update ref_bundling_recommendation with additional fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_bundling_recommendation' AND column_name = 'category'
  ) THEN
    ALTER TABLE ref_bundling_recommendation ADD COLUMN category text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_bundling_recommendation' AND column_name = 'delivery_location'
  ) THEN
    ALTER TABLE ref_bundling_recommendation ADD COLUMN delivery_location text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_bundling_recommendation' AND column_name = 'average_due_date'
  ) THEN
    ALTER TABLE ref_bundling_recommendation ADD COLUMN average_due_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_bundling_recommendation' AND column_name = 'total_value'
  ) THEN
    ALTER TABLE ref_bundling_recommendation ADD COLUMN total_value numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_bundling_recommendation' AND column_name = 'request_count'
  ) THEN
    ALTER TABLE ref_bundling_recommendation ADD COLUMN request_count integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_bundling_recommendation' AND column_name = 'similarity_score'
  ) THEN
    ALTER TABLE ref_bundling_recommendation ADD COLUMN similarity_score numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_bundling_recommendation' AND column_name = 'status'
  ) THEN
    ALTER TABLE ref_bundling_recommendation ADD COLUMN status text DEFAULT 'Recommended';
  END IF;
END $$;

-- Insert comprehensive mock procurement request data (20+ requests across 5 categories)
INSERT INTO fact_procurement_request (
  id, pr_number, pr_line_number, pr_id, title, category, requestor, unit_requestor_id, amount,
  status, pr_status, priority, due_date, requirement_date, delivery_date, description, vendor, vendor_id,
  quantity, demand_qty, unit_price, pr_value, material_id, delivery_location, estimated_price,
  organization_id, pr_type, currency, created_date
) VALUES
  -- Engine Parts Bundle Group (High Value - 5 requests)
  ('PR-2025-001-1', 'PR-2025-001', 1, 1001, 'Engine Block Components Type A', 'Engine Parts', 'Production Team Alpha', 'PROD-ALPHA', 'Rp 850,000,000', 'Approved', 'APPROVED', 'high', '2025-03-15', '2025-03-15', '2025-03-20', 'High-performance engine blocks for Model X2000. Heat-resistant alloy, requires quality certification.', 'PT Mesin Jaya', 'V-1001', '200 units', 200, 4250000, 850000000, 'MAT-ENG-001', 'Jakarta Warehouse', 850000000, 'default-org', 'Standard', 'IDR', now() - interval '2 days'),

  ('PR-2025-002-1', 'PR-2025-002', 1, 1002, 'Engine Cylinder Heads Premium', 'Engine Parts', 'Engineering Dept', 'ENG-DEPT', 'Rp 720,000,000', 'Approved', 'APPROVED', 'high', '2025-03-18', '2025-03-18', '2025-03-25', 'Premium cylinder heads with advanced cooling channels. Compatible with X2000 series.', 'PT Mesin Jaya', 'V-1001', '150 units', 150, 4800000, 720000000, 'MAT-ENG-002', 'Jakarta Warehouse', 720000000, 'default-org', 'Standard', 'IDR', now() - interval '2 days'),

  ('PR-2025-003-1', 'PR-2025-003', 1, 1003, 'Crankshaft Assembly Set', 'Engine Parts', 'Production Team Alpha', 'PROD-ALPHA', 'Rp 680,000,000', 'Approved', 'APPROVED', 'high', '2025-03-20', '2025-03-20', '2025-03-28', 'Forged steel crankshafts with balanced design. High-torque specification.', 'PT Mesin Jaya', 'V-1001', '180 units', 180, 3777778, 680000000, 'MAT-ENG-003', 'Jakarta Warehouse', 680000000, 'default-org', 'Standard', 'IDR', now() - interval '1 day'),

  ('PR-2025-004-1', 'PR-2025-004', 1, 1004, 'Piston and Ring Kit', 'Engine Parts', 'Quality Assurance', 'QA-TEAM', 'Rp 540,000,000', 'Approved', 'APPROVED', 'medium', '2025-03-22', '2025-03-22', '2025-03-30', 'Complete piston assembly with compression rings. Meets Euro 6 standards.', 'PT Mesin Jaya', 'V-1001', '250 units', 250, 2160000, 540000000, 'MAT-ENG-004', 'Jakarta Warehouse', 540000000, 'default-org', 'Standard', 'IDR', now() - interval '1 day'),

  ('PR-2025-005-1', 'PR-2025-005', 1, 1005, 'Camshaft and Valve Train', 'Engine Parts', 'Production Team Beta', 'PROD-BETA', 'Rp 460,000,000', 'Approved', 'APPROVED', 'medium', '2025-03-25', '2025-03-25', '2025-04-02', 'Variable valve timing camshafts. Performance-optimized profile.', 'PT Mesin Jaya', 'V-1001', '160 units', 160, 2875000, 460000000, 'MAT-ENG-005', 'Jakarta Warehouse', 460000000, 'default-org', 'Standard', 'IDR', now()),

  -- Electronics Bundle Group (High Value - 4 requests)
  ('PR-2025-006-1', 'PR-2025-006', 1, 1006, 'ECU Control Modules Advanced', 'Electronics', 'R&D Team', 'RND-TEAM', 'Rp 1,200,000,000', 'Approved', 'APPROVED', 'high', '2025-03-10', '2025-03-10', '2025-03-18', 'AI-powered ECU with predictive diagnostics. CAN-BUS and OBD-II compatible.', 'PT Elektronik Indonesia', 'V-2001', '150 units', 150, 8000000, 1200000000, 'MAT-ELE-001', 'Bandung Facility', 1200000000, 'default-org', 'Standard', 'IDR', now() - interval '3 days'),

  ('PR-2025-007-1', 'PR-2025-007', 1, 1007, 'Sensor Suite Complete Package', 'Electronics', 'Engineering Dept', 'ENG-DEPT', 'Rp 580,000,000', 'Approved', 'APPROVED', 'high', '2025-03-12', '2025-03-12', '2025-03-20', 'Complete sensor package: MAF, MAP, O2, knock sensors. High precision.', 'PT Elektronik Indonesia', 'V-2001', '300 sets', 300, 1933333, 580000000, 'MAT-ELE-002', 'Bandung Facility', 580000000, 'default-org', 'Standard', 'IDR', now() - interval '3 days'),

  ('PR-2025-008-1', 'PR-2025-008', 1, 1008, 'Wiring Harness Premium Grade', 'Electronics', 'Production Team Alpha', 'PROD-ALPHA', 'Rp 420,000,000', 'Approved', 'APPROVED', 'medium', '2025-03-15', '2025-03-15', '2025-03-23', 'Fire-resistant wiring harness with waterproof connectors. Full vehicle set.', 'PT Elektronik Indonesia', 'V-2001', '200 sets', 200, 2100000, 420000000, 'MAT-ELE-003', 'Bandung Facility', 420000000, 'default-org', 'Standard', 'IDR', now() - interval '2 days'),

  ('PR-2025-009-1', 'PR-2025-009', 1, 1009, 'Display and Infotainment Units', 'Electronics', 'R&D Team', 'RND-TEAM', 'Rp 890,000,000', 'Approved', 'APPROVED', 'high', '2025-03-08', '2025-03-08', '2025-03-16', '10-inch touchscreen with navigation and connectivity. Android Auto compatible.', 'PT Elektronik Indonesia', 'V-2001', '180 units', 180, 4944444, 890000000, 'MAT-ELE-004', 'Bandung Facility', 890000000, 'default-org', 'Standard', 'IDR', now() - interval '4 days'),

  -- Brake System Bundle Group (Medium Value - 3 requests)
  ('PR-2025-010-1', 'PR-2025-010', 1, 1010, 'Brake Disc Ventilated Type', 'Brake System', 'Safety Team', 'SAFETY-TEAM', 'Rp 450,000,000', 'Approved', 'APPROVED', 'high', '2025-03-20', '2025-03-20', '2025-03-28', 'Ventilated brake discs with ceramic coating. ISO safety certified.', 'PT Rem Aman', 'V-3001', '500 units', 500, 900000, 450000000, 'MAT-BRK-001', 'Surabaya Plant', 450000000, 'default-org', 'Standard', 'IDR', now() - interval '1 day'),

  ('PR-2025-011-1', 'PR-2025-011', 1, 1011, 'Brake Caliper Assembly Heavy Duty', 'Brake System', 'Engineering Dept', 'ENG-DEPT', 'Rp 380,000,000', 'Approved', 'APPROVED', 'medium', '2025-03-22', '2025-03-22', '2025-03-30', 'Heavy-duty calipers with anti-lock capability. Corrosion resistant.', 'PT Rem Aman', 'V-3001', '400 units', 400, 950000, 380000000, 'MAT-BRK-002', 'Surabaya Plant', 380000000, 'default-org', 'Standard', 'IDR', now() - interval '1 day'),

  ('PR-2025-012-1', 'PR-2025-012', 1, 1012, 'Brake Pad Performance Grade', 'Brake System', 'Quality Assurance', 'QA-TEAM', 'Rp 290,000,000', 'Approved', 'APPROVED', 'medium', '2025-03-25', '2025-03-25', '2025-04-02', 'Low-dust brake pads with excellent heat dissipation. Long-life formula.', 'PT Rem Aman', 'V-3001', '600 sets', 600, 483333, 290000000, 'MAT-BRK-003', 'Surabaya Plant', 290000000, 'default-org', 'Standard', 'IDR', now()),

  -- Frame & Chassis Bundle Group (Very High Value - 2 requests)
  ('PR-2025-013-1', 'PR-2025-013', 1, 1013, 'Chassis Frame Reinforced Steel', 'Frame & Chassis', 'Assembly Team', 'ASSY-TEAM', 'Rp 2,100,000,000', 'Approved', 'APPROVED', 'high', '2025-03-28', '2025-03-28', '2025-04-05', 'Reinforced steel chassis for SUV production. Stress-tested and corrosion resistant.', 'PT Rangka Kuat', 'V-4001', '100 units', 100, 21000000, 2100000000, 'MAT-CHS-001', 'Bekasi Factory', 2100000000, 'default-org', 'Standard', 'IDR', now()),

  ('PR-2025-014-1', 'PR-2025-014', 1, 1014, 'Subframe and Mounting Brackets', 'Frame & Chassis', 'Production Team Alpha', 'PROD-ALPHA', 'Rp 680,000,000', 'Approved', 'APPROVED', 'medium', '2025-03-30', '2025-03-30', '2025-04-08', 'Complete subframe assembly with reinforced mounting points. Powder-coated finish.', 'PT Rangka Kuat', 'V-4001', '150 units', 150, 4533333, 680000000, 'MAT-CHS-002', 'Bekasi Factory', 680000000, 'default-org', 'Standard', 'IDR', now()),

  -- Suspension System Bundle Group (Medium-High Value - 4 requests)
  ('PR-2025-015-1', 'PR-2025-015', 1, 1015, 'Shock Absorber Adjustable Type', 'Suspension', 'Engineering Dept', 'ENG-DEPT', 'Rp 680,000,000', 'Approved', 'APPROVED', 'medium', '2025-04-05', '2025-04-05', '2025-04-12', 'Adjustable shock absorbers with 100,000km durability. Gas-charged design.', 'PT Suspensi Prima', 'V-5001', '300 units', 300, 2266667, 680000000, 'MAT-SUS-001', 'Jakarta Warehouse', 680000000, 'default-org', 'Standard', 'IDR', now()),

  ('PR-2025-016-1', 'PR-2025-016', 1, 1016, 'Coil Spring Heavy Load Rating', 'Suspension', 'Production Team Beta', 'PROD-BETA', 'Rp 340,000,000', 'Approved', 'APPROVED', 'medium', '2025-04-08', '2025-04-08', '2025-04-15', 'Heavy-duty coil springs supporting 2-ton load. Progressive rate design.', 'PT Suspensi Prima', 'V-5001', '400 sets', 400, 850000, 340000000, 'MAT-SUS-002', 'Jakarta Warehouse', 340000000, 'default-org', 'Standard', 'IDR', now()),

  ('PR-2025-017-1', 'PR-2025-017', 1, 1017, 'Control Arm and Bushing Kit', 'Suspension', 'Quality Assurance', 'QA-TEAM', 'Rp 420,000,000', 'Approved', 'APPROVED', 'medium', '2025-04-10', '2025-04-10', '2025-04-18', 'Complete control arm assembly with polyurethane bushings. Noise-dampening design.', 'PT Suspensi Prima', 'V-5001', '350 sets', 350, 1200000, 420000000, 'MAT-SUS-003', 'Jakarta Warehouse', 420000000, 'default-org', 'Standard', 'IDR', now()),

  ('PR-2025-018-1', 'PR-2025-018', 1, 1018, 'Stabilizer Bar Anti-Roll', 'Suspension', 'Safety Team', 'SAFETY-TEAM', 'Rp 280,000,000', 'Approved', 'APPROVED', 'low', '2025-04-12', '2025-04-12', '2025-04-20', 'Anti-roll stabilizer bars with adjustable stiffness. Improves handling.', 'PT Suspensi Prima', 'V-5001', '250 units', 250, 1120000, 280000000, 'MAT-SUS-004', 'Jakarta Warehouse', 280000000, 'default-org', 'Standard', 'IDR', now()),

  -- Additional individual requests for variety (Lower value, diverse categories)
  ('PR-2025-019-1', 'PR-2025-019', 1, 1019, 'Premium Tire Set All-Season', 'Wheels & Tires', 'Procurement Team', 'PROC-TEAM', 'Rp 320,000,000', 'Approved', 'APPROVED', 'medium', '2025-04-15', '2025-04-15', '2025-04-22', 'All-season radial tires 225/65R17. Fuel efficiency A, wet grip A rating.', 'PT Ban Berkualitas', 'V-6001', '400 sets', 400, 800000, 320000000, 'MAT-WHL-001', 'Tangerang Distribution', 320000000, 'default-org', 'Standard', 'IDR', now()),

  ('PR-2025-020-1', 'PR-2025-020', 1, 1020, 'LED Headlight Assembly', 'Lighting System', 'Production Team Alpha', 'PROD-ALPHA', 'Rp 480,000,000', 'Approved', 'APPROVED', 'medium', '2025-04-18', '2025-04-18', '2025-04-25', 'Full LED headlight assembly with adaptive beam. ECE R112 compliant.', 'PT Cahaya Terang', 'V-7001', '220 sets', 220, 2181818, 480000000, 'MAT-LGT-001', 'Jakarta Warehouse', 480000000, 'default-org', 'Standard', 'IDR', now())
ON CONFLICT (id) DO NOTHING;

-- Insert bundling recommendations based on the mock data
INSERT INTO ref_bundling_recommendation (
  id, procurement_request_ids, category, delivery_location, average_due_date,
  total_value, request_count, estimated_savings, similarity_score, bundling_logic,
  recommended_vendors, status, organization_id
) VALUES
  (
    'e1f1a1b1-1111-1111-1111-111111111111',
    '["PR-2025-001-1", "PR-2025-002-1", "PR-2025-003-1", "PR-2025-004-1", "PR-2025-005-1"]'::jsonb,
    'Engine Parts',
    'Jakarta Warehouse',
    '2025-03-20',
    3250000000,
    5,
    390000000,
    95,
    'Excellent bundling opportunity: All 5 requests are for engine components with the same vendor (PT Mesin Jaya), same delivery location (Jakarta Warehouse), and similar due dates (within 10 days). Consolidation enables volume discount of 12% and reduces tender processing time by 60 days (4 tenders eliminated). Same supplier and category create optimal bundling scenario.',
    '["PT Mesin Jaya", "PT Komponen Otomotif", "PT Mesin Industri"]'::jsonb,
    'Recommended',
    'default-org'
  ),
  (
    'e2f2a2b2-2222-2222-2222-222222222222',
    '["PR-2025-006-1", "PR-2025-007-1", "PR-2025-008-1", "PR-2025-009-1"]'::jsonb,
    'Electronics',
    'Bandung Facility',
    '2025-03-13',
    3090000000,
    4,
    370800000,
    92,
    'Excellent bundling opportunity: All electronics components from same vendor (PT Elektronik Indonesia), identical delivery location (Bandung Facility), and aligned due dates (within 8 days). Volume consolidation yields 12% cost savings and eliminates 3 separate tenders, saving 45 days of procurement time. High technical compatibility across electronic systems.',
    '["PT Elektronik Indonesia", "PT Teknologi Canggih", "PT Sistem Elektronik"]'::jsonb,
    'Recommended',
    'default-org'
  ),
  (
    'e3f3a3b3-3333-3333-3333-333333333333',
    '["PR-2025-010-1", "PR-2025-011-1", "PR-2025-012-1"]'::jsonb,
    'Brake System',
    'Surabaya Plant',
    '2025-03-24',
    1120000000,
    3,
    134400000,
    88,
    'Good bundling opportunity: All brake system components share same vendor (PT Rem Aman), delivery location (Surabaya Plant), and close due dates (within 5 days). Bundling creates 12% volume discount and saves 30 days by eliminating 2 separate tenders. Complete brake system procurement in single sourcing event improves supplier coordination.',
    '["PT Rem Aman", "PT Sistem Pengereman", "PT Safety Components"]'::jsonb,
    'Recommended',
    'default-org'
  ),
  (
    'e4f4a4b4-4444-4444-4444-444444444444',
    '["PR-2025-013-1", "PR-2025-014-1"]'::jsonb,
    'Frame & Chassis',
    'Bekasi Factory',
    '2025-03-29',
    2780000000,
    2,
    333600000,
    90,
    'Excellent bundling opportunity: Both chassis components from same vendor (PT Rangka Kuat), same location (Bekasi Factory), and adjacent due dates (2 days apart). High-value procurement benefits significantly from 12% volume discount. Single tender eliminates 15 days of processing time and improves delivery coordination for complete chassis assembly.',
    '["PT Rangka Kuat", "PT Konstruksi Baja", "PT Frame Manufacturing"]'::jsonb,
    'Recommended',
    'default-org'
  ),
  (
    'e5f5a5b5-5555-5555-5555-555555555555',
    '["PR-2025-015-1", "PR-2025-016-1", "PR-2025-017-1", "PR-2025-018-1"]'::jsonb,
    'Suspension',
    'Jakarta Warehouse',
    '2025-04-09',
    1720000000,
    4,
    206400000,
    91,
    'Excellent bundling opportunity: Complete suspension system with same vendor (PT Suspensi Prima), identical delivery location (Jakarta Warehouse), and tight due date clustering (7 days). Volume bundling achieves 12% savings and eliminates 3 tenders, reducing procurement cycle by 45 days. Integrated suspension package ensures component compatibility.',
    '["PT Suspensi Prima", "PT Shock Absorber Indo", "PT Komponen Kendaraan"]'::jsonb,
    'Recommended',
    'default-org'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert pre-defined sourcing event templates
INSERT INTO ref_sourcing_event_template (
  id, template_name, template_description, category, default_delivery_terms,
  default_evaluation_criteria, default_milestones, estimated_duration_days,
  recommended_vendors, is_active, organization_id
) VALUES
  (
    'f1a1b1c1-1111-1111-1111-111111111111',
    'Standard Automotive Parts Procurement',
    'Standard template for automotive component procurement with quality assurance',
    'Automotive Components',
    'FOB Destination, Delivery within 30 days of PO issuance',
    '[
      {"name": "Technical Compliance", "weight": 40, "description": "Meets all technical specifications and quality standards"},
      {"name": "Price Competitiveness", "weight": 30, "description": "Competitive pricing with transparent cost breakdown"},
      {"name": "Delivery Schedule", "weight": 20, "description": "Ability to meet required delivery timeline"},
      {"name": "Past Performance", "weight": 10, "description": "Track record of successful deliveries"}
    ]'::jsonb,
    '[
      {"name": "Tender Announcement", "days_offset": 0, "description": "Publish tender announcement to qualified vendors"},
      {"name": "Submission Deadline", "days_offset": 21, "description": "Final date for vendor document submission"},
      {"name": "Technical Evaluation", "days_offset": 28, "description": "Complete technical evaluation of submissions"},
      {"name": "Commercial Evaluation", "days_offset": 35, "description": "Price and commercial terms evaluation"},
      {"name": "Winner Announcement", "days_offset": 42, "description": "Announce winning vendor and award contract"}
    ]'::jsonb,
    60,
    '[]'::jsonb,
    true,
    'default-org'
  ),
  (
    'f2a2b2c2-2222-2222-2222-222222222222',
    'High-Value Electronics Procurement',
    'Template for high-value electronic components with stringent quality requirements',
    'Electronics',
    'CIF Destination, Insurance included, 45-day delivery',
    '[
      {"name": "Technical Capability", "weight": 35, "description": "Advanced technical capability and R&D support"},
      {"name": "Quality Certifications", "weight": 25, "description": "ISO 9001, ISO/TS 16949, and product certifications"},
      {"name": "Price Competitiveness", "weight": 25, "description": "Total cost of ownership including support"},
      {"name": "Delivery and Logistics", "weight": 15, "description": "Reliable delivery and supply chain management"}
    ]'::jsonb,
    '[
      {"name": "Tender Announcement", "days_offset": 0, "description": "Publish tender with detailed technical specs"},
      {"name": "Pre-bid Meeting", "days_offset": 7, "description": "Technical clarification meeting with vendors"},
      {"name": "Submission Deadline", "days_offset": 28, "description": "Vendor proposal submission cutoff"},
      {"name": "Technical Evaluation", "days_offset": 42, "description": "Detailed technical assessment and testing"},
      {"name": "Price Evaluation", "days_offset": 49, "description": "Commercial evaluation and negotiation"},
      {"name": "Final Selection", "days_offset": 56, "description": "Board approval and contract award"}
    ]'::jsonb,
    75,
    '[]'::jsonb,
    true,
    'default-org'
  ),
  (
    'f3a3b3c3-3333-3333-3333-333333333333',
    'Safety-Critical Components (Brake Systems)',
    'Specialized template for safety-critical components requiring certification',
    'Safety Systems',
    'FOB Destination, Certified testing required, 30-day delivery',
    '[
      {"name": "Safety Certifications", "weight": 50, "description": "ISO, ECE, and national safety certifications"},
      {"name": "Quality Assurance", "weight": 20, "description": "QA processes and testing capabilities"},
      {"name": "Price", "weight": 20, "description": "Competitive pricing with warranty coverage"},
      {"name": "Technical Support", "weight": 10, "description": "Engineering support and documentation"}
    ]'::jsonb,
    '[
      {"name": "Tender Publication", "days_offset": 0, "description": "Announce tender with safety requirements"},
      {"name": "Vendor Qualification", "days_offset": 14, "description": "Review vendor certifications and qualifications"},
      {"name": "Submission Deadline", "days_offset": 28, "description": "Technical and commercial proposal submission"},
      {"name": "Safety Assessment", "days_offset": 42, "description": "Detailed safety compliance evaluation"},
      {"name": "Sample Testing", "days_offset": 56, "description": "Physical sample testing and validation"},
      {"name": "Contract Award", "days_offset": 63, "description": "Final approval and contract signing"}
    ]'::jsonb,
    90,
    '[]'::jsonb,
    true,
    'default-org'
  ),
  (
    'f4a4b4c4-4444-4444-4444-444444444444',
    'Structural Components (Chassis & Frame)',
    'Template for large structural components with engineering validation',
    'Structural Components',
    'Ex-Works, Buyer arranges transport, 60-day delivery',
    '[
      {"name": "Engineering Capability", "weight": 35, "description": "CAD/CAM capability and engineering support"},
      {"name": "Manufacturing Quality", "weight": 30, "description": "Production capability and quality control"},
      {"name": "Cost Efficiency", "weight": 25, "description": "Total landed cost including logistics"},
      {"name": "Delivery Reliability", "weight": 10, "description": "On-time delivery track record"}
    ]'::jsonb,
    '[
      {"name": "RFI Release", "days_offset": 0, "description": "Request for Information to assess capability"},
      {"name": "Site Visit", "days_offset": 14, "description": "Facility inspection and capability assessment"},
      {"name": "RFQ Release", "days_offset": 21, "description": "Request for Quotation with detailed specs"},
      {"name": "Proposal Submission", "days_offset": 35, "description": "Vendor proposal and sample submission"},
      {"name": "Technical Review", "days_offset": 49, "description": "Engineering evaluation and sample testing"},
      {"name": "Negotiation", "days_offset": 56, "description": "Price and terms negotiation"},
      {"name": "Contract Award", "days_offset": 70, "description": "Final approval and PO issuance"}
    ]'::jsonb,
    90,
    '[]'::jsonb,
    true,
    'default-org'
  )
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_procurement_request_category ON fact_procurement_request(category);
CREATE INDEX IF NOT EXISTS idx_procurement_request_pr_number ON fact_procurement_request(pr_number);
CREATE INDEX IF NOT EXISTS idx_bundling_recommendation_category ON ref_bundling_recommendation(category);
CREATE INDEX IF NOT EXISTS idx_bundling_recommendation_status ON ref_bundling_recommendation(status);
CREATE INDEX IF NOT EXISTS idx_sourcing_event_template_category ON ref_sourcing_event_template(category);
CREATE INDEX IF NOT EXISTS idx_sourcing_event_template_active ON ref_sourcing_event_template(is_active);
