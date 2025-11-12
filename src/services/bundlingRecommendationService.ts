import { supabase } from './supabaseClient';
import { EProcurementRequest } from './eProcurementRequestService';

export interface BundlingRecommendation {
  id: string;
  procurement_request_ids: string[];
  category: string;
  delivery_location: string;
  average_due_date: string;
  total_value: number;
  request_count: number;
  estimated_savings: number;
  similarity_score: number;
  bundling_logic: string;
  recommended_vendors: string[];
  status: 'Recommended' | 'Applied' | 'Rejected';
  organization_id: string;
  bundle_insights?: any;
  tender_count_reduction?: number;
  created_at?: string;
}

export interface BundlingGroup {
  category: string;
  requests: EProcurementRequest[];
  estimatedSavings: number;
  commonDeliveryLocation: string | null;
  averageDueDate: string;
  similarityScore: number;
  bundlingRationale: string;
  recommendedVendors: string[];
}

export class BundlingRecommendationService {
  static async getAllRecommendations(organizationId: string): Promise<BundlingRecommendation[]> {
    const { data, error } = await supabase
      .from('ref_bundling_recommendation')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'Recommended')
      .order('estimated_savings', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getRecommendationById(id: string): Promise<BundlingRecommendation | null> {
    const { data, error } = await supabase
      .from('ref_bundling_recommendation')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async analyzeBundlingOpportunities(
    requests: EProcurementRequest[]
  ): Promise<BundlingGroup[]> {
    const groupedByCategory: { [key: string]: EProcurementRequest[] } = {};

    requests.forEach(req => {
      if (!groupedByCategory[req.category]) {
        groupedByCategory[req.category] = [];
      }
      groupedByCategory[req.category].push(req);
    });

    return Object.entries(groupedByCategory).map(([category, categoryRequests]) => {
      const totalAmount = categoryRequests.reduce((sum, req) => {
        const amount = parseFloat(req.amount.replace(/[^0-9.]/g, ''));
        return sum + amount;
      }, 0);

      const estimatedSavings = Math.round(totalAmount * 0.12);

      const deliveryLocations = categoryRequests
        .map(r => r.delivery_location)
        .filter(loc => loc);
      const commonDeliveryLocation = deliveryLocations.length > 0
        ? deliveryLocations[0] || null
        : null;

      const dueDates = categoryRequests.map(r => new Date(r.due_date).getTime());
      const avgDueDate = new Date(
        dueDates.reduce((sum, date) => sum + date, 0) / dueDates.length
      );
      const averageDueDate = avgDueDate.toISOString().split('T')[0];

      const similarityScore = this.calculateSimilarityScore(categoryRequests);
      const vendors = Array.from(new Set(categoryRequests.map(r => r.vendor).filter(v => v)));
      const recommendedVendors = vendors.slice(0, 3);

      const bundlingRationale = this.generateBundlingRationale(
        categoryRequests,
        similarityScore,
        commonDeliveryLocation,
        vendors.length
      );

      return {
        category,
        requests: categoryRequests,
        estimatedSavings,
        commonDeliveryLocation,
        averageDueDate,
        similarityScore,
        bundlingRationale,
        recommendedVendors: recommendedVendors as string[]
      };
    });
  }

  private static calculateSimilarityScore(requests: EProcurementRequest[]): number {
    if (requests.length < 2) return 100;

    let score = 100;

    const categories = new Set(requests.map(r => r.category));
    if (categories.size > 1) score -= 20;

    const vendors = new Set(requests.map(r => r.vendor).filter(v => v));
    if (vendors.size === 1) score += 5;
    else if (vendors.size > 3) score -= 15;

    const locations = new Set(requests.map(r => r.delivery_location).filter(l => l));
    if (locations.size === 1) score += 5;
    else if (locations.size > 2) score -= 10;

    const dueDates = requests.map(r => new Date(r.due_date).getTime());
    const dateRange = Math.max(...dueDates) - Math.min(...dueDates);
    const daysDifference = dateRange / (1000 * 60 * 60 * 24);
    if (daysDifference <= 7) score += 5;
    else if (daysDifference > 30) score -= 10;

    return Math.max(Math.min(score, 100), 60);
  }

  private static generateBundlingRationale(
    requests: EProcurementRequest[],
    similarityScore: number,
    commonLocation: string | null,
    vendorCount: number
  ): string {
    if (requests.length === 1) {
      return "Single request - consider adding similar requests to increase savings";
    }

    const category = requests[0].category;
    const requestCount = requests.length;
    const tenderReduction = requestCount - 1;
    const timeSavings = tenderReduction * 15;

    let rationale = '';

    if (similarityScore >= 90) {
      rationale = `Excellent bundling opportunity: All ${requestCount} requests are for ${category}`;
    } else if (similarityScore >= 75) {
      rationale = `Good bundling opportunity: ${requestCount} ${category} requests`;
    } else {
      rationale = `Moderate bundling opportunity: ${requestCount} requests`;
    }

    if (vendorCount === 1) {
      const vendor = requests[0].vendor;
      rationale += ` with the same vendor (${vendor})`;
    } else if (vendorCount <= 2) {
      rationale += ` with compatible vendors`;
    }

    if (commonLocation) {
      rationale += `, same delivery location (${commonLocation})`;
    }

    const dueDates = requests.map(r => new Date(r.due_date));
    const dateRange = Math.max(...dueDates.map(d => d.getTime())) - Math.min(...dueDates.map(d => d.getTime()));
    const daysDiff = Math.round(dateRange / (1000 * 60 * 60 * 24));

    if (daysDiff <= 10) {
      rationale += `, and similar due dates (within ${daysDiff} days)`;
    }

    rationale += `. Consolidation enables volume discount of 12% and reduces tender processing time by ${timeSavings} days (${tenderReduction} tender${tenderReduction > 1 ? 's' : ''} eliminated).`;

    if (vendorCount === 1) {
      rationale += ' Same supplier and category create optimal bundling scenario.';
    } else if (similarityScore >= 85) {
      rationale += ' High technical compatibility across requests.';
    }

    return rationale;
  }

  static async createRecommendation(
    recommendation: Omit<BundlingRecommendation, 'id' | 'created_at'>
  ): Promise<BundlingRecommendation> {
    const { data, error } = await supabase
      .from('ref_bundling_recommendation')
      .insert([recommendation])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateRecommendationStatus(
    id: string,
    status: 'Applied' | 'Rejected'
  ): Promise<BundlingRecommendation> {
    const { data, error } = await supabase
      .from('ref_bundling_recommendation')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async generateAndSaveRecommendations(
    requests: EProcurementRequest[],
    organizationId: string
  ): Promise<BundlingRecommendation[]> {
    const groups = await this.analyzeBundlingOpportunities(requests);
    const recommendations: BundlingRecommendation[] = [];

    for (const group of groups) {
      if (group.requests.length < 2) continue;

      const totalValue = group.requests.reduce((sum, req) => {
        return sum + (req.estimated_price || 0);
      }, 0);

      const recommendation: Omit<BundlingRecommendation, 'id' | 'created_at'> = {
        procurement_request_ids: group.requests.map(r => r.id),
        category: group.category,
        delivery_location: group.commonDeliveryLocation || 'Multiple locations',
        average_due_date: group.averageDueDate,
        total_value: totalValue,
        request_count: group.requests.length,
        estimated_savings: group.estimatedSavings,
        similarity_score: group.similarityScore,
        bundling_logic: group.bundlingRationale,
        recommended_vendors: group.recommendedVendors,
        status: 'Recommended',
        organization_id: organizationId,
        tender_count_reduction: group.requests.length - 1
      };

      try {
        const created = await this.createRecommendation(recommendation);
        recommendations.push(created);
      } catch (error) {
        console.error('Failed to create bundling recommendation:', error);
      }
    }

    return recommendations;
  }

  static async getRecommendationsForRequests(
    requestIds: string[],
    organizationId: string
  ): Promise<BundlingRecommendation[]> {
    const { data, error } = await supabase
      .from('ref_bundling_recommendation')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'Recommended');

    if (error) throw error;

    return (data || []).filter(rec => {
      const recIds = rec.procurement_request_ids as string[];
      return requestIds.some(id => recIds.includes(id));
    });
  }

  static mapRecommendationToGroup(
    recommendation: BundlingRecommendation,
    allRequests: EProcurementRequest[]
  ): BundlingGroup {
    const requests = allRequests.filter(req =>
      (recommendation.procurement_request_ids as string[]).includes(req.id)
    );

    return {
      category: recommendation.category,
      requests,
      estimatedSavings: recommendation.estimated_savings,
      commonDeliveryLocation: recommendation.delivery_location,
      averageDueDate: recommendation.average_due_date,
      similarityScore: recommendation.similarity_score,
      bundlingRationale: recommendation.bundling_logic,
      recommendedVendors: recommendation.recommended_vendors as string[]
    };
  }
}
