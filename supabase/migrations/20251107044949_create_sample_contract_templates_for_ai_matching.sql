/*
  # Create Contract Templates for AI Template Matching Demo

  1. New Table
    - `contract_templates`
      - `id` (text, primary key)
      - `sourcing_event_id` (text, nullable - for already assigned templates)
      - `template_name` (text)
      - `template_content` (jsonb)
      - `status` (text)
      - `created_by` (text)
      - `created_at` (timestamptz)
      - `version` (integer)
      - `organization_id` (text)

  2. Sample Templates
    - Solar Power Purchase Agreement (matches "solar" keyword)
    - Wind Energy EPC Contract (matches "wind" keyword)
    - Battery Energy Storage Agreement (matches "battery/storage" keywords)
    - Hydroelectric Facility Contract (matches "hydro" keyword)

  3. Security
    - Enable RLS
    - Allow anonymous read access for demo purposes
*/

-- Create contract_templates table
CREATE TABLE IF NOT EXISTS contract_templates (
  id text PRIMARY KEY,
  sourcing_event_id text,
  template_name text NOT NULL,
  template_content jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'Draft',
  created_by text DEFAULT 'System',
  created_at timestamptz DEFAULT now(),
  version integer DEFAULT 1,
  organization_id text DEFAULT 'org-001'
);

-- Enable RLS
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (for demo)
CREATE POLICY "Allow anonymous read access to contract_templates"
  ON contract_templates
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated full access to contract_templates"
  ON contract_templates
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample templates for AI matching

-- 1. Solar Power Purchase Agreement (matches "solar" keyword)
INSERT INTO contract_templates (
  id,
  sourcing_event_id,
  template_name,
  template_content,
  status,
  created_by,
  version,
  organization_id
) VALUES (
  'template-solar-ppa-001',
  NULL,
  'Solar Power Purchase Agreement - 100MW Installation',
  jsonb_build_object(
    'header', jsonb_build_object(
      'Contract ID', 'PPA-SOLAR-2025-XXX',
      'Contract Type', 'Solar Power Purchase Agreement',
      'Project Name', '[Project Name]',
      'Capacity', '100 MW',
      'Technology', 'Photovoltaic Solar',
      'Effective Date', '[Effective Date]',
      'Duration', '25 years'
    ),
    'parties', jsonb_build_object(
      'Buyer', 'PT Indonesia Power',
      'Buyer Address', 'Jakarta, Indonesia',
      'Seller', '[Winning Bidder]',
      'Seller Address', '[Vendor Address]',
      'Project Location', '[Project Site]'
    ),
    'scope', jsonb_build_object(
      'Description', 'Supply and installation of solar PV system',
      'Capacity', '100 MW peak output',
      'Components', 'Solar panels, inverters, mounting systems, transformers',
      'Services', 'Engineering, procurement, construction, commissioning',
      'Performance', 'Minimum 80% performance ratio'
    ),
    'pricing', jsonb_build_object(
      'Total Contract Value', '[Contract Value]',
      'Payment Terms', 'Milestone-based payments',
      'Price Structure', 'Fixed price per kWh',
      'Warranty', '10 years product, 25 years performance'
    ),
    'delivery', jsonb_build_object(
      'Construction Period', '18 months',
      'Commissioning', '6 months',
      'Commercial Operation', '24 months from signing'
    ),
    'compliance', jsonb_build_object(
      'TKDN', '40% minimum local content',
      'Environmental', 'AMDAL compliance required',
      'Safety', 'K3L certification',
      'Standards', 'IEC 61730, IEC 61215'
    )
  ),
  'Approved',
  'Contract Management System',
  1,
  'org-001'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Wind Energy EPC Contract (matches "wind" keyword)
INSERT INTO contract_templates (
  id,
  sourcing_event_id,
  template_name,
  template_content,
  status,
  created_by,
  version,
  organization_id
) VALUES (
  'template-wind-epc-001',
  NULL,
  'Wind Energy EPC Contract - Onshore Wind Farm',
  jsonb_build_object(
    'header', jsonb_build_object(
      'Contract ID', 'WIND-EPC-2025-XXX',
      'Contract Type', 'Engineering, Procurement, Construction Agreement',
      'Project Name', '[Wind Farm Project]',
      'Capacity', '[Total Capacity]',
      'Technology', 'Onshore Wind Turbines',
      'Effective Date', '[Effective Date]',
      'Duration', '24 months construction'
    ),
    'parties', jsonb_build_object(
      'Owner', 'PT Indonesia Power',
      'Owner Address', 'Jakarta, Indonesia',
      'EPC Contractor', '[Winning Bidder]',
      'Contractor Address', '[Vendor Address]',
      'Site Location', '[Wind Farm Location]'
    ),
    'scope', jsonb_build_object(
      'Description', 'Supply and installation of wind turbines',
      'Turbine Count', '[Number of Turbines]',
      'Capacity per Unit', '3.5 MW per turbine',
      'Components', 'Turbines, towers, foundations, grid connection',
      'Performance', 'Guaranteed capacity factor'
    ),
    'pricing', jsonb_build_object(
      'Total Contract Value', '[Contract Value]',
      'Payment Terms', 'Progress-based payments',
      'Price Breakdown', 'Equipment 60%, Installation 30%, Testing 10%',
      'Warranty', '5 years comprehensive'
    ),
    'delivery', jsonb_build_object(
      'Engineering', '6 months',
      'Procurement', '12 months',
      'Construction', '18 months',
      'Commissioning', '6 months'
    ),
    'compliance', jsonb_build_object(
      'TKDN', '40% minimum local content',
      'Environmental', 'Environmental impact assessment',
      'Safety', 'International safety standards',
      'Certification', 'IEC 61400, ISO 9001'
    )
  ),
  'Approved',
  'Contract Management System',
  1,
  'org-001'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Battery Energy Storage Agreement (matches "battery" or "storage" keywords)
INSERT INTO contract_templates (
  id,
  sourcing_event_id,
  template_name,
  template_content,
  status,
  created_by,
  version,
  organization_id
) VALUES (
  'template-battery-storage-001',
  NULL,
  'Battery Energy Storage System Agreement',
  jsonb_build_object(
    'header', jsonb_build_object(
      'Contract ID', 'BESS-2025-XXX',
      'Contract Type', 'Battery Energy Storage Supply Agreement',
      'Project Name', '[BESS Project]',
      'Capacity', '[MWh Capacity]',
      'Technology', 'Lithium-ion Battery Storage',
      'Effective Date', '[Effective Date]',
      'Duration', '20 years operation'
    ),
    'parties', jsonb_build_object(
      'Owner', 'PT Indonesia Power',
      'Owner Address', 'Jakarta, Indonesia',
      'Supplier', '[Winning Bidder]',
      'Supplier Address', '[Vendor Address]',
      'Installation Site', '[BESS Location]'
    ),
    'scope', jsonb_build_object(
      'Description', 'Grid-scale battery energy storage system',
      'Capacity', '50 MWh storage capacity',
      'Power Rating', '25 MW output',
      'Components', 'Battery cells, inverters, BMS, cooling system',
      'Performance', 'Round-trip efficiency >85%'
    ),
    'pricing', jsonb_build_object(
      'Total Contract Value', '[Contract Value]',
      'Payment Terms', 'Delivery and installation milestones',
      'Price Structure', 'Fixed price turnkey solution',
      'Warranty', '10 years or 4000 cycles'
    ),
    'delivery', jsonb_build_object(
      'Delivery Period', '9 months',
      'Installation', '3 months',
      'Testing', '2 months',
      'Commercial Operation', '12 months from signing'
    ),
    'compliance', jsonb_build_object(
      'Safety', 'UL 9540, IEC 62619 certification',
      'Environmental', 'Battery recycling plan required',
      'Performance', 'Capacity retention guarantees',
      'Standards', 'IEEE 1547, IEC 61850'
    )
  ),
  'Approved',
  'Contract Management System',
  1,
  'org-001'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Hydroelectric Facility Contract (matches "hydro" keyword)
INSERT INTO contract_templates (
  id,
  sourcing_event_id,
  template_name,
  template_content,
  status,
  created_by,
  version,
  organization_id
) VALUES (
  'template-hydro-upgrade-001',
  NULL,
  'Hydroelectric Facility Upgrade Contract',
  jsonb_build_object(
    'header', jsonb_build_object(
      'Contract ID', 'HYDRO-UP-2025-XXX',
      'Contract Type', 'Hydroelectric Modernization Agreement',
      'Project Name', '[Hydro Plant Name]',
      'Capacity', '[MW Capacity]',
      'Technology', 'Hydroelectric Power Generation',
      'Effective Date', '[Effective Date]',
      'Duration', '15 months upgrade'
    ),
    'parties', jsonb_build_object(
      'Owner', 'PT Indonesia Power',
      'Owner Address', 'Jakarta, Indonesia',
      'Contractor', '[Winning Bidder]',
      'Contractor Address', '[Vendor Address]',
      'Facility Location', '[Hydro Plant Location]'
    ),
    'scope', jsonb_build_object(
      'Description', 'Upgrade and modernization of hydroelectric facility',
      'Work Included', 'Turbine refurbishment, generator upgrade, control systems',
      'Efficiency Improvement', 'Target 15% efficiency gain',
      'Capacity Enhancement', 'Maintain or increase capacity',
      'Reliability', 'Extended operational life'
    ),
    'pricing', jsonb_build_object(
      'Total Contract Value', '[Contract Value]',
      'Payment Terms', 'Stage completion payments',
      'Price Breakdown', 'Equipment 50%, Labor 30%, Testing 20%',
      'Warranty', '3 years comprehensive warranty'
    ),
    'delivery', jsonb_build_object(
      'Engineering', '3 months',
      'Equipment Supply', '6 months',
      'Installation', '9 months',
      'Testing and Commissioning', '3 months'
    ),
    'compliance', jsonb_build_object(
      'Environmental', 'Water quality and flow compliance',
      'Safety', 'Dam safety regulations',
      'Performance', 'Output and efficiency guarantees',
      'Standards', 'IEC 60193, IEEE standards'
    )
  ),
  'Approved',
  'Contract Management System',
  1,
  'org-001'
)
ON CONFLICT (id) DO NOTHING;

-- Verify templates created
SELECT id, template_name, status, created_at
FROM contract_templates
ORDER BY created_at DESC;
