/*
  # Create Industries Table
  
  1. New Tables
    - `industries`
      - `id` (uuid, primary key) - Auto-generated UUID
      - `industry_id` (text, unique) - Original string identifier (e.g., 'energy-oil-gas')
      - `name` (text) - Industry name
      - `sector` (text) - Sector classification
      - `description` (text) - Industry description
      - `key_metrics` (jsonb) - Array of key performance metrics
      - `regulatory_bodies` (jsonb) - Array of regulatory organizations
      - `sustainability_focus` (jsonb) - Array of sustainability initiatives
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp
      
  2. Security
    - Enable RLS on `industries` table
    - Add policy for public read access (anyone can view industries)
    - Add policies for authenticated users to manage industries
    
  3. Data Migration
    - Imports existing industry data from JSON structure
*/

-- Create industries table
CREATE TABLE IF NOT EXISTS industries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id text UNIQUE NOT NULL,
  name text NOT NULL,
  sector text NOT NULL,
  description text NOT NULL,
  key_metrics jsonb DEFAULT '[]'::jsonb,
  regulatory_bodies jsonb DEFAULT '[]'::jsonb,
  sustainability_focus jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on industry_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_industries_industry_id ON industries(industry_id);

-- Enable RLS
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view industries"
  ON industries
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert industries"
  ON industries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update industries"
  ON industries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete industries"
  ON industries
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert initial industry data
INSERT INTO industries (industry_id, name, sector, description, key_metrics, regulatory_bodies, sustainability_focus)
VALUES 
  (
    'energy-oil-gas',
    'Energy - Oil & Gas',
    'Energy',
    'Integrated oil and gas companies involved in exploration, production, refining, and distribution',
    '["Production Volume (bpd)", "Reserves (boe)", "Refinery Throughput", "Carbon Intensity", "Safety Performance"]'::jsonb,
    '["SKK Migas", "Ministry of Energy and Mineral Resources", "Environmental Ministry"]'::jsonb,
    '["Net-Zero Emissions", "Renewable Energy Transition", "Environmental Compliance", "Community Development"]'::jsonb
  ),
  (
    'petrochemicals',
    'Petrochemicals & Chemicals',
    'Materials',
    'Chemical manufacturing and petrochemical production companies',
    '["Production Capacity (Mt/year)", "Plant Utilization Rate", "Product Quality Index", "Energy Efficiency", "Safety Score"]'::jsonb,
    '["Ministry of Industry", "Environmental Ministry", "BPOM (Food and Drug Authority)"]'::jsonb,
    '["Circular Economy", "Waste Reduction", "Energy Efficiency", "Product Innovation"]'::jsonb
  ),
  (
    'heavy-equipment',
    'Heavy Equipment & Machinery',
    'Industrials',
    'Heavy equipment distribution, services, and logistics companies',
    '["Equipment Sales (units)", "Service Revenue", "Fleet Utilization", "Customer Satisfaction", "Parts Availability"]'::jsonb,
    '["Ministry of Industry", "Ministry of Transportation", "Ministry of Public Works"]'::jsonb,
    '["Equipment Efficiency", "Emission Reduction", "Sustainable Operations", "Digital Transformation"]'::jsonb
  ),
  (
    'financial-services',
    'Financial Services - Banking',
    'Financials',
    'Commercial banks, investment banks, and financial services companies',
    '["Total Assets", "Net Income", "Capital Adequacy Ratio", "Return on Assets (ROA)", "Digital Adoption Rate"]'::jsonb,
    '["Bank Indonesia (Central Bank)", "OJK (Financial Services Authority)", "LPS (Deposit Insurance Corporation)"]'::jsonb,
    '["Sustainable Finance", "Financial Inclusion", "Digital Banking", "ESG Investment"]'::jsonb
  ),
  (
    'insurance',
    'Insurance Services',
    'Financials',
    'Life insurance, general insurance, and reinsurance companies',
    '["Gross Premiums Written", "Combined Ratio", "Claims Ratio", "Policy Retention Rate", "Solvency Ratio"]'::jsonb,
    '["OJK (Financial Services Authority)", "Ministry of Finance", "Indonesian Insurance Association"]'::jsonb,
    '["Climate Risk Management", "Inclusive Insurance", "Digital Innovation", "Customer Protection"]'::jsonb
  ),
  (
    'power-utilities',
    'Power & Utilities',
    'Utilities',
    'Electric power generation, transmission, and distribution companies',
    '["Installed Capacity (MW)", "Energy Generation (TWh)", "Grid Reliability (%)", "Transmission Losses (%)", "Customer Satisfaction"]'::jsonb,
    '["Ministry of Energy and Mineral Resources", "Electricity Regulatory Commission", "Environmental Ministry"]'::jsonb,
    '["Renewable Energy Integration", "Grid Modernization", "Energy Efficiency", "Carbon Emission Reduction"]'::jsonb
  ),
  (
    'natural-resources',
    'Natural Resources & Agriculture',
    'Materials',
    'Agricultural commodities, plantation, and natural resource companies',
    '["Production Volume (tons)", "Yield per Hectare", "Sustainability Score", "Export Revenue", "Land Bank (hectares)"]'::jsonb,
    '["Ministry of Agriculture", "Indonesian Palm Oil Association", "Environmental Ministry", "Ministry of Trade"]'::jsonb,
    '["Sustainable Agriculture", "Zero Deforestation", "Biodiversity Conservation", "Community Development"]'::jsonb
  ),
  (
    'renewable-energy',
    'Renewable Energy',
    'Utilities',
    'Solar, wind, geothermal, and other renewable energy companies',
    '["Renewable Capacity (MW)", "Energy Generation (TWh)", "Capacity Factor", "Grid Availability", "Carbon Offset"]'::jsonb,
    '["Ministry of Energy and Mineral Resources", "PLN (State Electricity Company)", "Environmental Ministry"]'::jsonb,
    '["Clean Energy Production", "Grid Integration", "Energy Storage", "Community Impact"]'::jsonb
  ),
  (
    'technology-consulting',
    'Technology Consulting & Services',
    'Technology',
    'Professional services companies providing technology consulting, system integration, and digital transformation services',
    '["Project Success Rate", "Client Satisfaction Score", "Revenue Growth", "Consultant Utilization", "Digital Transformation ROI"]'::jsonb,
    '["Ministry of Communication and Information", "Indonesian Software Association", "Professional Services Council"]'::jsonb,
    '["Digital Innovation", "Sustainable Technology", "Green IT Solutions", "Knowledge Transfer"]'::jsonb
  ),
  (
    'shared-services',
    'Shared Service Centers',
    'Business Services',
    'Centralized business service delivery organizations providing finance, HR, IT, and procurement services across multiple business units',
    '["Cost per Transaction", "SLA Compliance Rate", "Process Automation Level", "Customer Satisfaction Score", "Service Quality Index"]'::jsonb,
    '["Financial Reporting Standards Board", "Labor Relations Authority", "Data Protection Commission", "Internal Audit Standards"]'::jsonb,
    '["Digital Transformation", "Process Optimization", "Employee Experience", "Operational Excellence"]'::jsonb
  )
ON CONFLICT (industry_id) DO NOTHING;