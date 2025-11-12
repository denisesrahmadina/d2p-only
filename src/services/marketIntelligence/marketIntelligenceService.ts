import { supabase } from '../supabaseClient';
import {
  MarketIntelligenceSupplier,
  MarketIntelligenceNews,
  MarketIntelligenceFinancials,
  MarketIntelligencePatent,
  MarketIntelligenceOwnership,
  MarketIntelligencePerformanceHistory,
  SupplierWithDetails,
  MarketIntelligenceSummary,
  CategoryBreakdown,
  GlobalDistribution,
  SentimentTrend,
  MarketVisualizationData
} from '../../types/marketIntelligence';

export class MarketIntelligenceService {
  /**
   * Get all suppliers with optional filtering
   */
  static async getAllSuppliers(filters?: {
    contract_status?: string;
    category?: string;
    min_score?: number;
    risk_rating?: string;
  }): Promise<MarketIntelligenceSupplier[]> {
    try {
      let query = supabase
        .from('market_intelligence_suppliers')
        .select('*')
        .order('supplier_score', { ascending: false });

      if (filters?.contract_status) {
        query = query.eq('contract_status', filters.contract_status);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.min_score) {
        query = query.gte('supplier_score', filters.min_score);
      }

      if (filters?.risk_rating) {
        query = query.eq('risk_rating', filters.risk_rating);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      return [];
    }
  }

  /**
   * Get supplier details with all related data
   */
  static async getSupplierDetails(supplierId: string): Promise<SupplierWithDetails | null> {
    try {
      // Fetch supplier base data
      const { data: supplier, error: supplierError } = await supabase
        .from('market_intelligence_suppliers')
        .select('*')
        .eq('supplier_id', supplierId)
        .maybeSingle();

      if (supplierError) throw supplierError;
      if (!supplier) return null;

      // Fetch recent news
      const { data: news } = await supabase
        .from('market_intelligence_news')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('publication_date', { ascending: false })
        .limit(10);

      // Fetch latest financials
      const { data: financials } = await supabase
        .from('market_intelligence_financials')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('fiscal_year', { ascending: false })
        .order('fiscal_quarter', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fetch patents
      const { data: patents } = await supabase
        .from('market_intelligence_patents')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('filing_date', { ascending: false })
        .limit(10);

      // Fetch ownership
      const { data: ownership } = await supabase
        .from('market_intelligence_ownership')
        .select('*')
        .eq('supplier_id', supplierId);

      // Fetch performance history
      const { data: performanceHistory } = await supabase
        .from('market_intelligence_performance_history')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('evaluation_date', { ascending: false })
        .limit(12);

      // Calculate average sentiment
      const avgSentiment = news && news.length > 0
        ? news.reduce((sum, n) => sum + (n.sentiment_score || 0), 0) / news.length
        : 0;

      // Extract trending topics
      const topicsMap = new Map<string, number>();
      news?.forEach(n => {
        n.trending_topics?.forEach((topic: string) => {
          topicsMap.set(topic, (topicsMap.get(topic) || 0) + 1);
        });
      });
      const trendingTopics = Array.from(topicsMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([topic]) => topic);

      return {
        ...supplier,
        recent_news: news || [],
        latest_financials: financials || null,
        patents: patents || [],
        ownership: ownership || [],
        performance_history: performanceHistory || [],
        news_sentiment_avg: avgSentiment,
        trending_topics: trendingTopics
      };
    } catch (error) {
      console.error('Error fetching supplier details:', error);
      return null;
    }
  }

  /**
   * Get market intelligence summary
   */
  static async getMarketSummary(): Promise<MarketIntelligenceSummary> {
    try {
      const suppliers = await this.getAllSuppliers();

      const contracted = suppliers.filter(s => s.contract_status === 'Contracted');
      const watchlist = suppliers.filter(s => s.contract_status === 'Watchlist');
      const other = suppliers.filter(s => s.contract_status === 'Other');

      const avgScore = suppliers.reduce((sum, s) => sum + s.supplier_score, 0) / (suppliers.length || 1);

      const highPerformers = suppliers.filter(s => s.supplier_score >= 85).slice(0, 5);
      const atRisk = suppliers.filter(s => s.risk_rating === 'High' || s.risk_rating === 'Critical');

      // Get recent news count
      const { count: newsCount } = await supabase
        .from('market_intelligence_news')
        .select('*', { count: 'exact', head: true })
        .gte('publication_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      // Get sentiment distribution
      const { data: sentimentData } = await supabase
        .from('market_intelligence_news')
        .select('sentiment')
        .gte('publication_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      const positiveSentiment = sentimentData?.filter(s => s.sentiment === 'Positive').length || 0;
      const totalSentiment = sentimentData?.length || 1;

      // Get trending topics
      const { data: newsData } = await supabase
        .from('market_intelligence_news')
        .select('trending_topics')
        .gte('publication_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      const topicsMap = new Map<string, number>();
      newsData?.forEach(n => {
        n.trending_topics?.forEach((topic: string) => {
          topicsMap.set(topic, (topicsMap.get(topic) || 0) + 1);
        });
      });

      const trendingTopics = Array.from(topicsMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([topic, count]) => ({ topic, count }));

      return {
        total_suppliers: suppliers.length,
        contracted_count: contracted.length,
        watchlist_count: watchlist.length,
        other_count: other.length,
        avg_supplier_score: avgScore,
        high_performers: highPerformers,
        at_risk_suppliers: atRisk,
        recent_news_count: newsCount || 0,
        positive_sentiment_percentage: (positiveSentiment / totalSentiment) * 100,
        trending_topics: trendingTopics
      };
    } catch (error) {
      console.error('Error fetching market summary:', error);
      return {
        total_suppliers: 0,
        contracted_count: 0,
        watchlist_count: 0,
        other_count: 0,
        avg_supplier_score: 0,
        high_performers: [],
        at_risk_suppliers: [],
        recent_news_count: 0,
        positive_sentiment_percentage: 0,
        trending_topics: []
      };
    }
  }

  /**
   * Get category breakdown
   */
  static async getCategoryBreakdown(): Promise<CategoryBreakdown[]> {
    try {
      const suppliers = await this.getAllSuppliers();

      const categoryMap = new Map<string, MarketIntelligenceSupplier[]>();
      suppliers.forEach(supplier => {
        if (!categoryMap.has(supplier.category)) {
          categoryMap.set(supplier.category, []);
        }
        categoryMap.get(supplier.category)!.push(supplier);
      });

      const breakdowns: CategoryBreakdown[] = [];

      categoryMap.forEach((categorySuppliers, category) => {
        const avgScore = categorySuppliers.reduce((sum, s) => sum + s.supplier_score, 0) / categorySuppliers.length;
        const totalRevenue = categorySuppliers.reduce((sum, s) => sum + s.revenue_usd, 0);
        const contractedCount = categorySuppliers.filter(s => s.contract_status === 'Contracted').length;
        const topSupplier = categorySuppliers.sort((a, b) => b.supplier_score - a.supplier_score)[0];

        breakdowns.push({
          category,
          supplier_count: categorySuppliers.length,
          avg_score: avgScore,
          total_revenue: totalRevenue,
          contracted_count: contractedCount,
          top_supplier: topSupplier
        });
      });

      return breakdowns.sort((a, b) => b.total_revenue - a.total_revenue);
    } catch (error) {
      console.error('Error fetching category breakdown:', error);
      return [];
    }
  }

  /**
   * Get global distribution
   */
  static async getGlobalDistribution(): Promise<GlobalDistribution[]> {
    try {
      const suppliers = await this.getAllSuppliers();

      const regionMap = new Map<string, MarketIntelligenceSupplier[]>();
      suppliers.forEach(supplier => {
        const key = `${supplier.location_region}|${supplier.location_country}`;
        if (!regionMap.has(key)) {
          regionMap.set(key, []);
        }
        regionMap.get(key)!.push(supplier);
      });

      const distributions: GlobalDistribution[] = [];

      regionMap.forEach((regionSuppliers, key) => {
        const [region, country] = key.split('|');
        const avgScore = regionSuppliers.reduce((sum, s) => sum + s.supplier_score, 0) / regionSuppliers.length;
        const totalRevenue = regionSuppliers.reduce((sum, s) => sum + s.revenue_usd, 0);
        const contractedCount = regionSuppliers.filter(s => s.contract_status === 'Contracted').length;
        const coordinates = regionSuppliers[0].location_coordinates;

        distributions.push({
          region,
          country,
          supplier_count: regionSuppliers.length,
          contracted_count: contractedCount,
          avg_score: avgScore,
          total_revenue: totalRevenue,
          coordinates
        });
      });

      return distributions.sort((a, b) => b.supplier_count - a.supplier_count);
    } catch (error) {
      console.error('Error fetching global distribution:', error);
      return [];
    }
  }

  /**
   * Get sentiment trends over time
   */
  static async getSentimentTrends(days: number = 30): Promise<SentimentTrend[]> {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const { data: news } = await supabase
        .from('market_intelligence_news')
        .select('publication_date, sentiment, sentiment_score')
        .gte('publication_date', startDate.toISOString().split('T')[0])
        .order('publication_date', { ascending: true });

      if (!news || news.length === 0) return [];

      const trendsMap = new Map<string, {
        positive: number;
        neutral: number;
        negative: number;
        scores: number[];
      }>();

      news.forEach(item => {
        const date = item.publication_date;
        if (!trendsMap.has(date)) {
          trendsMap.set(date, { positive: 0, neutral: 0, negative: 0, scores: [] });
        }

        const trend = trendsMap.get(date)!;
        if (item.sentiment === 'Positive') trend.positive++;
        else if (item.sentiment === 'Neutral') trend.neutral++;
        else if (item.sentiment === 'Negative') trend.negative++;

        trend.scores.push(item.sentiment_score || 0);
      });

      const trends: SentimentTrend[] = [];
      trendsMap.forEach((counts, date) => {
        const avgSentiment = counts.scores.reduce((sum, s) => sum + s, 0) / counts.scores.length;
        trends.push({
          date,
          positive_count: counts.positive,
          neutral_count: counts.neutral,
          negative_count: counts.negative,
          avg_sentiment: avgSentiment
        });
      });

      return trends.sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error('Error fetching sentiment trends:', error);
      return [];
    }
  }

  /**
   * Get market visualization data
   */
  static async getMarketVisualizationData(): Promise<MarketVisualizationData> {
    try {
      const suppliers = await this.getAllSuppliers();

      const mostProfitable = suppliers.reduce((max, s) =>
        s.revenue_usd > (max?.revenue_usd || 0) ? s : max, suppliers[0]);

      const mostDiverse = suppliers.reduce((max, s) =>
        s.global_reach_countries > (max?.global_reach_countries || 0) ? s : max, suppliers[0]);

      const highestInnovation = suppliers.reduce((max, s) =>
        s.innovation_score > (max?.innovation_score || 0) ? s : max, suppliers[0]);

      const categoryBreakdown = await this.getCategoryBreakdown();
      const globalDistribution = await this.getGlobalDistribution();
      const sentimentTrends = await this.getSentimentTrends(30);

      return {
        supplier_summary: {
          most_profitable: mostProfitable,
          most_diverse: mostDiverse,
          highest_innovation: highestInnovation
        },
        category_breakdown: categoryBreakdown,
        global_distribution: globalDistribution,
        sentiment_trends: sentimentTrends,
        watchlist_insights: [] // Will be populated by AI service
      };
    } catch (error) {
      console.error('Error fetching market visualization data:', error);
      return {
        supplier_summary: {
          most_profitable: null,
          most_diverse: null,
          highest_innovation: null
        },
        category_breakdown: [],
        global_distribution: [],
        sentiment_trends: [],
        watchlist_insights: []
      };
    }
  }

  /**
   * Get recent news for a supplier
   */
  static async getSupplierNews(supplierId: string, limit: number = 10): Promise<MarketIntelligenceNews[]> {
    try {
      const { data, error } = await supabase
        .from('market_intelligence_news')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('publication_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching supplier news:', error);
      return [];
    }
  }

  /**
   * Search suppliers
   */
  static async searchSuppliers(query: string): Promise<MarketIntelligenceSupplier[]> {
    try {
      const { data, error } = await supabase
        .from('market_intelligence_suppliers')
        .select('*')
        .or(`company_name.ilike.%${query}%,description.ilike.%${query}%,location_country.ilike.%${query}%`)
        .order('supplier_score', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching suppliers:', error);
      return [];
    }
  }
}
