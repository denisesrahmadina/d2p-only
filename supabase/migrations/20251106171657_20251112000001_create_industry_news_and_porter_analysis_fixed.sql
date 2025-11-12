/*
  # Industry News and Porter's Five Forces Analysis

  1. New Tables
    - `fact_industry_news`
      - Stores industry news articles related to categories
      - Categorized as 'Hot News' or 'Other News'
      - Links to specific categories
    
    - `fact_porter_five_forces`
      - Stores Porter's Five Forces analysis for each category
      - Uses Likert scale (1-5) for each force
      - Includes AI-generated insights and action plans

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and anonymous users to read data
*/

-- Industry News Table
CREATE TABLE IF NOT EXISTS fact_industry_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text NOT NULL,
  news_title text NOT NULL,
  news_content text NOT NULL,
  news_type text NOT NULL CHECK (news_type IN ('Hot News', 'Other News')),
  source text NOT NULL,
  published_date date NOT NULL,
  impact_level text CHECK (impact_level IN ('High', 'Medium', 'Low')),
  related_vendors text[],
  key_takeaways text,
  ai_insights text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fact_industry_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to industry news"
  ON fact_industry_news
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to industry news"
  ON fact_industry_news
  FOR SELECT
  TO authenticated
  USING (true);

-- Porter's Five Forces Analysis Table
CREATE TABLE IF NOT EXISTS fact_porter_five_forces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text NOT NULL UNIQUE,
  category_name text NOT NULL,
  
  -- Porter's Five Forces (Likert Scale 1-5)
  threat_of_new_entrants int NOT NULL CHECK (threat_of_new_entrants BETWEEN 1 AND 5),
  bargaining_power_suppliers int NOT NULL CHECK (bargaining_power_suppliers BETWEEN 1 AND 5),
  bargaining_power_buyers int NOT NULL CHECK (bargaining_power_buyers BETWEEN 1 AND 5),
  threat_of_substitutes int NOT NULL CHECK (threat_of_substitutes BETWEEN 1 AND 5),
  industry_rivalry int NOT NULL CHECK (industry_rivalry BETWEEN 1 AND 5),
  
  -- Overall Assessment
  overall_competitive_position text,
  market_attractiveness_score decimal(3,2),
  
  -- AI Analysis
  ai_insights text,
  action_plan text,
  
  -- Strengths and Weaknesses
  key_strengths text[],
  key_vulnerabilities text[],
  strategic_recommendations text[],
  
  reference_period text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fact_porter_five_forces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to porter analysis"
  ON fact_porter_five_forces
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to porter analysis"
  ON fact_porter_five_forces
  FOR SELECT
  TO authenticated
  USING (true);

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_industry_news_category;
DROP INDEX IF EXISTS idx_industry_news_date;
DROP INDEX IF EXISTS idx_industry_news_type;
DROP INDEX IF EXISTS idx_porter_category;

-- Create indexes for better query performance
CREATE INDEX idx_industry_news_category ON fact_industry_news(category_code);
CREATE INDEX idx_industry_news_type ON fact_industry_news(news_type);
CREATE INDEX idx_porter_category ON fact_porter_five_forces(category_code);
