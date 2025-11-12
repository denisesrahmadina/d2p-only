import { supabase } from './supabaseClient';

export interface SourcingEventProcurementRequest {
  id: string;
  sourcing_event_id: string;
  request_id: string;
  unit: string;
  material: string;
  vendor?: string;
  category: string;
  value_bn_idr: number;
  delivery_date: string;
  request_type: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export class SourcingEventProcurementRequestService {
  static async getRequestsForSourcingEvent(
    sourcingEventId: string
  ): Promise<SourcingEventProcurementRequest[]> {
    const { data, error } = await supabase
      .from('fact_sourcing_event_procurement_requests')
      .select('*')
      .eq('sourcing_event_id', sourcingEventId)
      .order('request_id', { ascending: true });

    if (error) {
      console.error('Error fetching procurement requests:', error);
      throw error;
    }

    return data || [];
  }

  static async getTotalValueForSourcingEvent(
    sourcingEventId: string
  ): Promise<number> {
    const requests = await this.getRequestsForSourcingEvent(sourcingEventId);
    return requests.reduce((sum, req) => sum + Number(req.value_bn_idr), 0);
  }

  static getAIInsight(sourcingEventId: string): string {
    const insights: { [key: string]: string } = {
      'SRC-2025-001': 'AI grouped Siemens mechanical components from Plant A and B due to identical CAPEX classification, overlapping delivery schedules, and single-source supplier availability. Expected cost efficiency: 6%. Procurement cycle reduction: 18%. Consolidated event reduces three requests into one sourcing process.',
      'SRC-2025-002': 'AI combined ABB electrical systems with shared project timeline and category similarity. Anticipated price leverage: 4% and administrative reduction of 33%.',
      'SRC-2025-003': 'AI identified Schneider automation systems with compatible technical scope and delivery period. Bundling expected to improve vendor response time by 12% and save 5% on logistics.'
    };

    return insights[sourcingEventId] || 'AI bundling analysis provides optimized procurement efficiency through strategic consolidation of related requests.';
  }

  static getEfficiencyMetrics(sourcingEventId: string) {
    const metrics: { [key: string]: { costEfficiency: number; timeReduction: number; adminReduction: number } } = {
      'SRC-2025-001': { costEfficiency: 6, timeReduction: 18, adminReduction: 33 },
      'SRC-2025-002': { costEfficiency: 4, timeReduction: 15, adminReduction: 33 },
      'SRC-2025-003': { costEfficiency: 5, timeReduction: 12, adminReduction: 25 }
    };

    return metrics[sourcingEventId] || { costEfficiency: 5, timeReduction: 15, adminReduction: 30 };
  }
}
