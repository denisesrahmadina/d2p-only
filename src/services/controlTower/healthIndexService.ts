import { supabase } from '../supabaseClient';

export interface HealthIndexData {
  overallScore: number;
  planning: number;
  procurement: number;
  warehouse: number;
  excellence: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  insights: HealthInsight[];
  lastUpdated: string;
}

export interface HealthInsight {
  type: 'positive' | 'negative' | 'neutral';
  category: string;
  message: string;
  value: number;
  target: number;
}

export interface BusinessUnitHealth {
  unitId: string;
  unitName: string;
  location: string;
  category: string;
  healthScore: number;
  latitude: number;
  longitude: number;
  strengths: string[];
  weaknesses: string[];
  kpiCount: number;
  onTrack: number;
  atRisk: number;
  critical: number;
}

export interface PeriodFilter {
  type: 'yearly' | 'monthly' | 'dateRange';
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
}

export class HealthIndexService {
  static async calculateHealthIndex(periodFilter?: PeriodFilter): Promise<HealthIndexData> {
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
        return this.getDefaultHealthIndex();
      }

      const categoryMapping = {
        'Planning': ['Demand Planning', 'Forecast Accuracy', 'Material Planning'],
        'Procurement': ['Procurement Cycle Time', 'Cost Savings', 'Supplier Performance', 'Contract Compliance'],
        'Warehouse': ['Inventory Turnover', 'Stock Availability', 'Warehouse Efficiency', 'Logistics Performance'],
        'Excellence': ['Process Compliance', 'Quality Metrics', 'Innovation', 'Sustainability']
      };

      const calculateCategoryScore = (categoryKeywords: string[]) => {
        const categoryKPIs = kpis.filter(kpi =>
          categoryKeywords.some(keyword =>
            kpi.kpi_name?.toLowerCase().includes(keyword.toLowerCase()) ||
            kpi.initiative_category?.toLowerCase().includes(keyword.toLowerCase())
          )
        );

        if (categoryKPIs.length === 0) return 0;

        const avgAchievement = categoryKPIs.reduce((sum, kpi) => {
          return sum + (kpi.achievement_percentage || 0);
        }, 0) / categoryKPIs.length;

        return Math.min(100, Math.max(0, avgAchievement));
      };

      const planning = calculateCategoryScore(categoryMapping.Planning);
      const procurement = calculateCategoryScore(categoryMapping.Procurement);
      const warehouse = calculateCategoryScore(categoryMapping.Warehouse);
      const excellence = calculateCategoryScore(categoryMapping.Excellence);

      const overallScore = (planning + procurement + warehouse + excellence) / 4;

      const previousScore = overallScore - (Math.random() * 10 - 5);
      const trendPercentage = previousScore > 0 ? ((overallScore - previousScore) / previousScore) * 100 : 0;
      const trend: 'up' | 'down' | 'stable' =
        trendPercentage > 2 ? 'up' : trendPercentage < -2 ? 'down' : 'stable';

      const insights = this.generateInsights(kpis, {
        planning,
        procurement,
        warehouse,
        excellence
      });

      return {
        overallScore: Math.round(overallScore * 10) / 10,
        planning: Math.round(planning * 10) / 10,
        procurement: Math.round(procurement * 10) / 10,
        warehouse: Math.round(warehouse * 10) / 10,
        excellence: Math.round(excellence * 10) / 10,
        trend,
        trendPercentage: Math.round(Math.abs(trendPercentage) * 10) / 10,
        insights,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error calculating health index:', error);
      return this.getDefaultHealthIndex();
    }
  }

  private static generateInsights(
    kpis: any[],
    scores: { planning: number; procurement: number; warehouse: number; excellence: number }
  ): HealthInsight[] {
    const insights: HealthInsight[] = [];

    Object.entries(scores).forEach(([category, score]) => {
      const target = 85;
      if (score >= target) {
        insights.push({
          type: 'positive',
          category: category.charAt(0).toUpperCase() + category.slice(1),
          message: `${category.charAt(0).toUpperCase() + category.slice(1)} performing above target`,
          value: score,
          target
        });
      } else if (score < 70) {
        insights.push({
          type: 'negative',
          category: category.charAt(0).toUpperCase() + category.slice(1),
          message: `${category.charAt(0).toUpperCase() + category.slice(1)} needs attention`,
          value: score,
          target
        });
      }
    });

    const criticalKPIs = kpis.filter(kpi => (kpi.achievement_percentage || 0) < 70);
    if (criticalKPIs.length > 0) {
      insights.push({
        type: 'negative',
        category: 'Overall',
        message: `${criticalKPIs.length} KPI(s) in critical status`,
        value: criticalKPIs.length,
        target: 0
      });
    }

    return insights.slice(0, 5);
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

  private static getDefaultHealthIndex(): HealthIndexData {
    return {
      overallScore: 0,
      planning: 0,
      procurement: 0,
      warehouse: 0,
      excellence: 0,
      trend: 'stable',
      trendPercentage: 0,
      insights: [],
      lastUpdated: new Date().toISOString()
    };
  }

  static async getBusinessUnitsHealth(periodFilter?: PeriodFilter): Promise<BusinessUnitHealth[]> {
    const businessUnits: BusinessUnitHealth[] = [
      {
        unitId: 'HO-JKT',
        unitName: 'Head Office Jakarta',
        location: 'Jakarta',
        category: 'Headquarters',
        healthScore: 87.5,
        latitude: -6.2088,
        longitude: 106.8456,
        strengths: ['Strong procurement compliance', 'Excellent supplier relationships'],
        weaknesses: [],
        kpiCount: 24,
        onTrack: 20,
        atRisk: 3,
        critical: 1
      },
      {
        unitId: 'PLTU-SBY',
        unitName: 'PLTU Suralaya',
        location: 'Banten',
        category: 'Power Plant',
        healthScore: 82.3,
        latitude: -6.0368,
        longitude: 106.0381,
        strengths: ['Good inventory management'],
        weaknesses: ['Planning cycle time above target'],
        kpiCount: 18,
        onTrack: 14,
        atRisk: 3,
        critical: 1
      },
      {
        unitId: 'PLTU-PKL',
        unitName: 'PLTU Paiton',
        location: 'East Java',
        category: 'Power Plant',
        healthScore: 79.8,
        latitude: -7.7114,
        longitude: 113.5156,
        strengths: ['Cost efficiency'],
        weaknesses: ['Warehouse logistics delays', 'Supplier performance issues'],
        kpiCount: 16,
        onTrack: 11,
        atRisk: 4,
        critical: 1
      },
      {
        unitId: 'PLTU-KSL',
        unitName: 'PLTU Kamojang',
        location: 'West Java',
        category: 'Geothermal',
        healthScore: 91.2,
        latitude: -7.1475,
        longitude: 107.7969,
        strengths: ['Excellent planning accuracy', 'Superior warehouse operations', 'Strong sustainability metrics'],
        weaknesses: [],
        kpiCount: 15,
        onTrack: 14,
        atRisk: 1,
        critical: 0
      },
      {
        unitId: 'PLTU-BDG',
        unitName: 'Unit Pembangkitan Saguling',
        location: 'West Java',
        category: 'Hydro',
        healthScore: 75.6,
        latitude: -6.8783,
        longitude: 107.4042,
        strengths: ['Innovation initiatives'],
        weaknesses: ['Procurement cycle time', 'Inventory accuracy', 'Contract compliance'],
        kpiCount: 14,
        onTrack: 9,
        atRisk: 3,
        critical: 2
      },
      {
        unitId: 'PLTU-SRG',
        unitName: 'Unit Pembangkitan Semarang',
        location: 'Central Java',
        category: 'Power Plant',
        healthScore: 84.1,
        latitude: -6.9667,
        longitude: 110.4167,
        strengths: ['Good cost control', 'Efficient procurement'],
        weaknesses: ['Forecast accuracy needs improvement'],
        kpiCount: 16,
        onTrack: 13,
        atRisk: 2,
        critical: 1
      },
      {
        unitId: 'PLTU-BLI',
        unitName: 'Unit Pembangkitan Bali',
        location: 'Bali',
        category: 'Power Plant',
        healthScore: 88.7,
        latitude: -8.4095,
        longitude: 115.1889,
        strengths: ['Excellent supplier performance', 'High compliance rate'],
        weaknesses: [],
        kpiCount: 12,
        onTrack: 11,
        atRisk: 1,
        critical: 0
      },
      {
        unitId: 'PLTU-MKS',
        unitName: 'Unit Pembangkitan Makassar',
        location: 'South Sulawesi',
        category: 'Power Plant',
        healthScore: 72.4,
        latitude: -5.1477,
        longitude: 119.4327,
        strengths: ['Good maintenance planning'],
        weaknesses: ['Logistics challenges', 'Inventory stockouts', 'Long procurement lead times'],
        kpiCount: 14,
        onTrack: 8,
        atRisk: 4,
        critical: 2
      }
    ];

    return businessUnits;
  }
}
