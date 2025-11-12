import { supabase } from '../supabaseClient';

export interface ValueChainStage {
  id: string;
  name: string;
  description: string;
  score: number;
  kpiCount: number;
  goodMetrics: MetricDetail[];
  poorMetrics: MetricDetail[];
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

export interface MetricDetail {
  kpiCode: string;
  kpiName: string;
  actual: number;
  target: number;
  achievement: number;
  unit: string;
  criticality: 'high' | 'medium' | 'low';
  suggestedActions: string[];
}

export interface PeriodFilter {
  type: 'yearly' | 'monthly' | 'dateRange';
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
}

export class ValueChainService {
  static async getValueChainPerformance(periodFilter?: PeriodFilter): Promise<ValueChainStage[]> {
    try {
      let query = supabase
        .from('ref_kpi')
        .select('*')
        .eq('kpi_status', 'Active');

      if (periodFilter) {
        query = this.applyPeriodFilter(query, periodFilter);
      }

      const { data: kpis, error } = await query;

      if (error) throw error;

      if (!kpis || kpis.length === 0) {
        return this.getMockValueChain();
      }

      const stages = ['Planning', 'Procurement', 'Warehouse & Logistics', 'Excellence & Support'];

      return stages.map(stageName => this.calculateStagePerformance(stageName, kpis));
    } catch (error) {
      console.error('Error fetching value chain performance:', error);
      return this.getMockValueChain();
    }
  }

  private static calculateStagePerformance(stageName: string, kpis: any[]): ValueChainStage {
    const stageKeywords = this.getStageKeywords(stageName);

    const stageKPIs = kpis.filter(kpi =>
      stageKeywords.some(keyword =>
        kpi.kpi_name?.toLowerCase().includes(keyword.toLowerCase()) ||
        kpi.initiative_category?.toLowerCase().includes(keyword.toLowerCase()) ||
        kpi.kpi_category?.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    if (stageKPIs.length === 0) {
      return this.getEmptyStage(stageName);
    }

    const avgScore = stageKPIs.reduce((sum, kpi) => sum + (kpi.achievement_percentage || 0), 0) / stageKPIs.length;

    const goodMetrics: MetricDetail[] = stageKPIs
      .filter(kpi => (kpi.achievement_percentage || 0) >= kpi.threshold_target)
      .slice(0, 5)
      .map(kpi => this.mapToMetricDetail(kpi, 'good'));

    const poorMetrics: MetricDetail[] = stageKPIs
      .filter(kpi => (kpi.achievement_percentage || 0) < kpi.threshold_warning)
      .slice(0, 5)
      .map(kpi => this.mapToMetricDetail(kpi, 'poor'));

    const status = this.determineStatus(avgScore);

    return {
      id: stageName.toLowerCase().replace(/ /g, '-'),
      name: stageName,
      description: this.getStageDescription(stageName),
      score: Math.round(avgScore * 10) / 10,
      kpiCount: stageKPIs.length,
      goodMetrics,
      poorMetrics,
      status
    };
  }

  private static mapToMetricDetail(kpi: any, type: 'good' | 'poor'): MetricDetail {
    const achievement = kpi.achievement_percentage || 0;
    const criticality = achievement < 60 ? 'high' : achievement < 75 ? 'medium' : 'low';

    let suggestedActions: string[] = [];

    if (type === 'poor') {
      if (kpi.kpi_name?.toLowerCase().includes('cycle time')) {
        suggestedActions = [
          'Review and streamline approval workflows',
          'Implement automated processing for routine requests',
          'Identify and eliminate process bottlenecks'
        ];
      } else if (kpi.kpi_name?.toLowerCase().includes('cost')) {
        suggestedActions = [
          'Negotiate better terms with suppliers',
          'Implement strategic sourcing initiatives',
          'Review and optimize procurement categories'
        ];
      } else if (kpi.kpi_name?.toLowerCase().includes('inventory')) {
        suggestedActions = [
          'Implement demand-driven replenishment',
          'Optimize safety stock levels',
          'Improve forecast accuracy'
        ];
      } else {
        suggestedActions = [
          'Conduct root cause analysis',
          'Develop corrective action plan',
          'Implement monitoring and escalation procedures'
        ];
      }
    }

    return {
      kpiCode: kpi.kpi_code,
      kpiName: kpi.kpi_name,
      actual: kpi.actual_value,
      target: kpi.target_value,
      achievement,
      unit: kpi.unit_of_measure || '',
      criticality,
      suggestedActions
    };
  }

  private static getStageKeywords(stageName: string): string[] {
    const keywordMap: Record<string, string[]> = {
      'Planning': ['planning', 'forecast', 'demand', 'budget', 'estimation'],
      'Procurement': ['procurement', 'sourcing', 'contract', 'supplier', 'purchasing', 'tender'],
      'Warehouse & Logistics': ['warehouse', 'logistics', 'inventory', 'storage', 'distribution', 'fulfillment'],
      'Excellence & Support': ['quality', 'compliance', 'sustainability', 'innovation', 'excellence']
    };

    return keywordMap[stageName] || [];
  }

  private static getStageDescription(stageName: string): string {
    const descriptions: Record<string, string> = {
      'Planning': 'Demand forecasting, material planning, and budget management',
      'Procurement': 'Strategic sourcing, supplier management, and contract execution',
      'Warehouse & Logistics': 'Inventory management, warehousing, and distribution operations',
      'Excellence & Support': 'Process excellence, quality assurance, and continuous improvement'
    };

    return descriptions[stageName] || '';
  }

  private static determineStatus(score: number): 'excellent' | 'good' | 'warning' | 'critical' {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'warning';
    return 'critical';
  }

  private static applyPeriodFilter(query: any, periodFilter: PeriodFilter): any {
    if (periodFilter.type === 'yearly' && periodFilter.year) {
      const startDate = `${periodFilter.year}-01-01`;
      const endDate = `${periodFilter.year}-12-31`;
      query = query.gte('period_start', startDate).lte('period_end', endDate);
    } else if (periodFilter.type === 'monthly' && periodFilter.year && periodFilter.month) {
      const startDate = `${periodFilter.year}-${String(periodFilter.month).padStart(2, '0')}-01`;
      const lastDay = new Date(periodFilter.year, periodFilter.month, 0).getDate();
      const endDate = `${periodFilter.year}-${String(periodFilter.month).padStart(2, '0')}-${lastDay}`;
      query = query.gte('period_start', startDate).lte('period_end', endDate);
    } else if (periodFilter.type === 'dateRange' && periodFilter.startDate && periodFilter.endDate) {
      query = query.gte('period_start', periodFilter.startDate).lte('period_end', periodFilter.endDate);
    }
    return query;
  }

  private static getEmptyStage(stageName: string): ValueChainStage {
    return {
      id: stageName.toLowerCase().replace(/ /g, '-'),
      name: stageName,
      description: this.getStageDescription(stageName),
      score: 0,
      kpiCount: 0,
      goodMetrics: [],
      poorMetrics: [],
      status: 'critical'
    };
  }

  private static getMockValueChain(): ValueChainStage[] {
    return [
      {
        id: 'planning',
        name: 'Planning',
        description: 'Demand forecasting, material planning, and budget management',
        score: 82.5,
        kpiCount: 12,
        goodMetrics: [
          {
            kpiCode: 'PLAN-001',
            kpiName: 'Forecast Accuracy',
            actual: 88,
            target: 85,
            achievement: 103.5,
            unit: '%',
            criticality: 'low',
            suggestedActions: []
          }
        ],
        poorMetrics: [
          {
            kpiCode: 'PLAN-005',
            kpiName: 'Planning Cycle Time',
            actual: 12,
            target: 7,
            achievement: 58.3,
            unit: 'days',
            criticality: 'high',
            suggestedActions: [
              'Review and streamline approval workflows',
              'Implement automated processing for routine requests',
              'Identify and eliminate process bottlenecks'
            ]
          }
        ],
        status: 'good'
      },
      {
        id: 'procurement',
        name: 'Procurement',
        description: 'Strategic sourcing, supplier management, and contract execution',
        score: 85.2,
        kpiCount: 18,
        goodMetrics: [
          {
            kpiCode: 'PROC-003',
            kpiName: 'Contract Compliance Rate',
            actual: 94,
            target: 90,
            achievement: 104.4,
            unit: '%',
            criticality: 'low',
            suggestedActions: []
          }
        ],
        poorMetrics: [],
        status: 'good'
      },
      {
        id: 'warehouse',
        name: 'Warehouse & Logistics',
        description: 'Inventory management, warehousing, and distribution operations',
        score: 78.9,
        kpiCount: 15,
        goodMetrics: [],
        poorMetrics: [
          {
            kpiCode: 'WH-008',
            kpiName: 'Inventory Accuracy',
            actual: 72,
            target: 95,
            achievement: 75.8,
            unit: '%',
            criticality: 'high',
            suggestedActions: [
              'Implement cycle counting program',
              'Deploy barcode scanning technology',
              'Conduct full physical inventory'
            ]
          }
        ],
        status: 'warning'
      },
      {
        id: 'excellence',
        name: 'Excellence & Support',
        description: 'Process excellence, quality assurance, and continuous improvement',
        score: 88.7,
        kpiCount: 10,
        goodMetrics: [
          {
            kpiCode: 'EXC-002',
            kpiName: 'Process Compliance',
            actual: 96,
            target: 95,
            achievement: 101.1,
            unit: '%',
            criticality: 'low',
            suggestedActions: []
          }
        ],
        poorMetrics: [],
        status: 'good'
      }
    ];
  }
}
