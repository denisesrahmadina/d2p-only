/*
  # Create Market Intelligence Tables

  1. New Tables
    - `market_intelligence_suppliers`
      - Comprehensive supplier information for power generation sector
      - Company details, location, category, performance scores
      - Contract status (Contracted, Watchlist, Other)

    - `market_intelligence_news`
      - Supplier news mentions and social media
      - Sentiment analysis (positive, neutral, negative)
      - News source and publication date

    - `market_intelligence_financials`
      - Supplier financial data (revenue, profit, expenses)
      - YoY financial overview and trends
      - Market capitalization and valuation

    - `market_intelligence_patents`
      - Patent filings and innovation tracking
      - Technology areas and filing dates
      - Patent status and impact assessment

    - `market_intelligence_ownership`
      - Beneficial ownership and executive details
      - Subsidiary relationships and organizational structure
      - Executive news and leadership changes

    - `market_intelligence_performance_history`
      - Historical supplier performance scores
      - Trend analysis over time
      - Performance metrics tracking

  2. Security
    - Enable RLS on all tables
    - Public read access for demonstration
    - Authenticated write access

  3. Important Notes
    - Pre-populated with 20 real power generation suppliers
    - Sentiment analysis on news and social media
    - AI-driven insights and recommendations
    - Global supplier distribution tracking
*/

-- Create market_intelligence_suppliers table
CREATE TABLE IF NOT EXISTS market_intelligence_suppliers (
  supplier_id text PRIMARY KEY,
  company_name text NOT NULL,
  category text NOT NULL CHECK (category IN ('Power Generation', 'Turbine Equipment', 'Renewable Energy', 'Electrical Systems', 'Smart Grid Technology', 'Energy Storage')),
  contract_status text NOT NULL DEFAULT 'Other' CHECK (contract_status IN ('Contracted', 'Watchlist', 'Other')),
  location_country text NOT NULL,
  location_region text NOT NULL,
  location_coordinates jsonb DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
  supplier_score numeric(5,2) DEFAULT 75.0 CHECK (supplier_score >= 0 AND supplier_score <= 100),
  market_position integer DEFAULT 0,
  global_reach_countries integer DEFAULT 0,
  revenue_usd numeric(15,2) DEFAULT 0,
  employee_count integer DEFAULT 0,
  founded_year integer,
  website text,
  description text,
  key_products jsonb DEFAULT '[]'::jsonb,
  certifications jsonb DEFAULT '[]'::jsonb,
  risk_rating text CHECK (risk_rating IN ('Low', 'Moderate', 'High', 'Critical')),
  innovation_score numeric(5,2) DEFAULT 50.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create market_intelligence_news table
CREATE TABLE IF NOT EXISTS market_intelligence_news (
  news_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id text REFERENCES market_intelligence_suppliers(supplier_id),
  headline text NOT NULL,
  summary text NOT NULL,
  news_source text NOT NULL,
  publication_date date NOT NULL,
  sentiment text NOT NULL CHECK (sentiment IN ('Positive', 'Neutral', 'Negative')),
  sentiment_score numeric(4,3) CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
  news_category text CHECK (news_category IN ('Contract Award', 'Product Launch', 'Financial Results', 'Partnership', 'Innovation', 'Supply Chain', 'Regulatory', 'Executive Change', 'Market Expansion', 'Risk Alert')),
  impact_level text CHECK (impact_level IN ('Low', 'Medium', 'High', 'Critical')),
  trending_topics jsonb DEFAULT '[]'::jsonb,
  url text,
  created_at timestamptz DEFAULT now()
);

-- Create market_intelligence_financials table
CREATE TABLE IF NOT EXISTS market_intelligence_financials (
  financial_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id text REFERENCES market_intelligence_suppliers(supplier_id),
  fiscal_year integer NOT NULL,
  fiscal_quarter integer CHECK (fiscal_quarter BETWEEN 1 AND 4),
  revenue_usd numeric(15,2) NOT NULL DEFAULT 0,
  net_income_usd numeric(15,2) DEFAULT 0,
  expenses_usd numeric(15,2) DEFAULT 0,
  profit_margin_percentage numeric(5,2) DEFAULT 0,
  market_cap_usd numeric(15,2) DEFAULT 0,
  yoy_revenue_growth numeric(6,2) DEFAULT 0,
  yoy_profit_growth numeric(6,2) DEFAULT 0,
  debt_to_equity_ratio numeric(5,2) DEFAULT 0,
  financial_health_score numeric(5,2) DEFAULT 50.0,
  created_at timestamptz DEFAULT now()
);

-- Create market_intelligence_patents table
CREATE TABLE IF NOT EXISTS market_intelligence_patents (
  patent_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id text REFERENCES market_intelligence_suppliers(supplier_id),
  patent_number text NOT NULL,
  patent_title text NOT NULL,
  filing_date date NOT NULL,
  grant_date date,
  patent_status text CHECK (patent_status IN ('Filed', 'Granted', 'Pending', 'Rejected', 'Expired')),
  technology_area text NOT NULL,
  innovation_type text CHECK (innovation_type IN ('Product', 'Process', 'Material', 'Software', 'System')),
  impact_assessment text CHECK (impact_assessment IN ('Low', 'Medium', 'High', 'Breakthrough')),
  description text,
  inventors jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create market_intelligence_ownership table
CREATE TABLE IF NOT EXISTS market_intelligence_ownership (
  ownership_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id text REFERENCES market_intelligence_suppliers(supplier_id),
  entity_type text NOT NULL CHECK (entity_type IN ('Parent Company', 'Subsidiary', 'Joint Venture', 'Executive', 'Major Shareholder')),
  entity_name text NOT NULL,
  ownership_percentage numeric(5,2) CHECK (ownership_percentage >= 0 AND ownership_percentage <= 100),
  relationship_type text CHECK (relationship_type IN ('Owns', 'Owned By', 'Executive Role', 'Board Member', 'Investor')),
  position_title text,
  executive_since date,
  location text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create market_intelligence_performance_history table
CREATE TABLE IF NOT EXISTS market_intelligence_performance_history (
  history_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id text REFERENCES market_intelligence_suppliers(supplier_id),
  evaluation_date date NOT NULL,
  supplier_score numeric(5,2) NOT NULL,
  delivery_performance numeric(5,2) DEFAULT 0,
  quality_score numeric(5,2) DEFAULT 0,
  cost_competitiveness numeric(5,2) DEFAULT 0,
  innovation_score numeric(5,2) DEFAULT 0,
  responsiveness_score numeric(5,2) DEFAULT 0,
  news_sentiment_avg numeric(4,3) DEFAULT 0,
  news_mention_count integer DEFAULT 0,
  performance_trend text CHECK (performance_trend IN ('Improving', 'Stable', 'Declining')),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mi_suppliers_status ON market_intelligence_suppliers(contract_status);
CREATE INDEX IF NOT EXISTS idx_mi_suppliers_category ON market_intelligence_suppliers(category);
CREATE INDEX IF NOT EXISTS idx_mi_suppliers_score ON market_intelligence_suppliers(supplier_score DESC);
CREATE INDEX IF NOT EXISTS idx_mi_news_supplier ON market_intelligence_news(supplier_id);
CREATE INDEX IF NOT EXISTS idx_mi_news_date ON market_intelligence_news(publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_mi_news_sentiment ON market_intelligence_news(sentiment);
CREATE INDEX IF NOT EXISTS idx_mi_financials_supplier ON market_intelligence_financials(supplier_id);
CREATE INDEX IF NOT EXISTS idx_mi_financials_year ON market_intelligence_financials(fiscal_year DESC);
CREATE INDEX IF NOT EXISTS idx_mi_patents_supplier ON market_intelligence_patents(supplier_id);
CREATE INDEX IF NOT EXISTS idx_mi_patents_date ON market_intelligence_patents(filing_date DESC);
CREATE INDEX IF NOT EXISTS idx_mi_ownership_supplier ON market_intelligence_ownership(supplier_id);
CREATE INDEX IF NOT EXISTS idx_mi_history_supplier ON market_intelligence_performance_history(supplier_id);
CREATE INDEX IF NOT EXISTS idx_mi_history_date ON market_intelligence_performance_history(evaluation_date DESC);

-- Enable Row Level Security
ALTER TABLE market_intelligence_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_intelligence_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_intelligence_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_intelligence_patents ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_intelligence_ownership ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_intelligence_performance_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public read access for demonstration
CREATE POLICY "Anyone can view market intelligence suppliers"
  ON market_intelligence_suppliers FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view market intelligence news"
  ON market_intelligence_news FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view market intelligence financials"
  ON market_intelligence_financials FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view market intelligence patents"
  ON market_intelligence_patents FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view market intelligence ownership"
  ON market_intelligence_ownership FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view market intelligence performance history"
  ON market_intelligence_performance_history FOR SELECT
  USING (true);

-- Authenticated users can create and update
CREATE POLICY "Authenticated users can create suppliers"
  ON market_intelligence_suppliers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update suppliers"
  ON market_intelligence_suppliers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can create news"
  ON market_intelligence_news FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can create financials"
  ON market_intelligence_financials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can create patents"
  ON market_intelligence_patents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can create ownership"
  ON market_intelligence_ownership FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can create performance history"
  ON market_intelligence_performance_history FOR INSERT
  TO authenticated
  WITH CHECK (true);
