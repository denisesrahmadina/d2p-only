export interface MarketIntelligenceSupplier {
  supplier_id: string;
  company_name: string;
  category: 'Power Generation' | 'Turbine Equipment' | 'Renewable Energy' | 'Electrical Systems' | 'Smart Grid Technology' | 'Energy Storage';
  contract_status: 'Contracted' | 'Watchlist' | 'Other';
  location_country: string;
  location_region: string;
  location_coordinates: {
    lat: number;
    lng: number;
  };
  supplier_score: number;
  market_position: number;
  global_reach_countries: number;
  revenue_usd: number;
  employee_count: number;
  founded_year: number;
  website: string;
  description: string;
  key_products: string[];
  certifications: string[];
  risk_rating: 'Low' | 'Moderate' | 'High' | 'Critical';
  innovation_score: number;
  created_at?: string;
  updated_at?: string;
}

export interface MarketIntelligenceNews {
  news_id: string;
  supplier_id: string;
  headline: string;
  summary: string;
  news_source: string;
  publication_date: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  sentiment_score: number;
  news_category: 'Contract Award' | 'Product Launch' | 'Financial Results' | 'Partnership' | 'Innovation' | 'Supply Chain' | 'Regulatory' | 'Executive Change' | 'Market Expansion' | 'Risk Alert';
  impact_level: 'Low' | 'Medium' | 'High' | 'Critical';
  trending_topics: string[];
  url?: string;
  created_at?: string;
}

export interface MarketIntelligenceFinancials {
  financial_id: string;
  supplier_id: string;
  fiscal_year: number;
  fiscal_quarter?: number;
  revenue_usd: number;
  net_income_usd: number;
  expenses_usd: number;
  profit_margin_percentage: number;
  market_cap_usd: number;
  yoy_revenue_growth: number;
  yoy_profit_growth: number;
  debt_to_equity_ratio: number;
  financial_health_score: number;
  created_at?: string;
}

export interface MarketIntelligencePatent {
  patent_id: string;
  supplier_id: string;
  patent_number: string;
  patent_title: string;
  filing_date: string;
  grant_date?: string;
  patent_status: 'Filed' | 'Granted' | 'Pending' | 'Rejected' | 'Expired';
  technology_area: string;
  innovation_type: 'Product' | 'Process' | 'Material' | 'Software' | 'System';
  impact_assessment: 'Low' | 'Medium' | 'High' | 'Breakthrough';
  description: string;
  inventors: string[];
  created_at?: string;
}

export interface MarketIntelligenceOwnership {
  ownership_id: string;
  supplier_id: string;
  entity_type: 'Parent Company' | 'Subsidiary' | 'Joint Venture' | 'Executive' | 'Major Shareholder';
  entity_name: string;
  ownership_percentage?: number;
  relationship_type: 'Owns' | 'Owned By' | 'Executive Role' | 'Board Member' | 'Investor';
  position_title?: string;
  executive_since?: string;
  location?: string;
  description?: string;
  created_at?: string;
}

export interface MarketIntelligencePerformanceHistory {
  history_id: string;
  supplier_id: string;
  evaluation_date: string;
  supplier_score: number;
  delivery_performance: number;
  quality_score: number;
  cost_competitiveness: number;
  innovation_score: number;
  responsiveness_score: number;
  news_sentiment_avg: number;
  news_mention_count: number;
  performance_trend: 'Improving' | 'Stable' | 'Declining';
  created_at?: string;
}

export interface SupplierWithDetails extends MarketIntelligenceSupplier {
  recent_news: MarketIntelligenceNews[];
  latest_financials: MarketIntelligenceFinancials | null;
  patents: MarketIntelligencePatent[];
  ownership: MarketIntelligenceOwnership[];
  performance_history: MarketIntelligencePerformanceHistory[];
  news_sentiment_avg: number;
  trending_topics: string[];
}

export interface MarketIntelligenceSummary {
  total_suppliers: number;
  contracted_count: number;
  watchlist_count: number;
  other_count: number;
  avg_supplier_score: number;
  high_performers: MarketIntelligenceSupplier[];
  at_risk_suppliers: MarketIntelligenceSupplier[];
  recent_news_count: number;
  positive_sentiment_percentage: number;
  trending_topics: { topic: string; count: number }[];
}

export interface CategoryBreakdown {
  category: string;
  supplier_count: number;
  avg_score: number;
  total_revenue: number;
  contracted_count: number;
  top_supplier: MarketIntelligenceSupplier | null;
}

export interface GlobalDistribution {
  region: string;
  country: string;
  supplier_count: number;
  contracted_count: number;
  avg_score: number;
  total_revenue: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface SentimentTrend {
  date: string;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
  avg_sentiment: number;
}

export interface AIInsight {
  insight_id: string;
  supplier_id: string;
  supplier_name: string;
  insight_type: 'Opportunity' | 'Risk' | 'Strategic' | 'Innovation' | 'Financial';
  title: string;
  description: string;
  confidence_score: number;
  financial_impact_estimate: number;
  risk_rating: 'Low' | 'Moderate' | 'Critical';
  ai_source_type: 'Predictive' | 'Prescriptive';
  recommended_action: string;
  data_sources: string[];
  generated_at: string;
}

export interface MarketVisualizationData {
  supplier_summary: {
    most_profitable: MarketIntelligenceSupplier | null;
    most_diverse: MarketIntelligenceSupplier | null;
    highest_innovation: MarketIntelligenceSupplier | null;
  };
  category_breakdown: CategoryBreakdown[];
  global_distribution: GlobalDistribution[];
  sentiment_trends: SentimentTrend[];
  watchlist_insights: AIInsight[];
}
