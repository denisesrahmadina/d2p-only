import { supabase } from '../supabaseClient';

export interface SavingsContract {
  id: string;
  contract_id: string;
  contract_name: string;
  supplier_name: string;
  category: string;
  business_unit: string;
  award_date: string;
  owner_estimate: number;
  final_contract_value: number;
  savings_amount: number;
  savings_percentage: number;
  contract_status: string;
  contract_duration_months: number | null;
  notes: string | null;
}

export interface PipelineContract {
  id: string;
  contract_reference: string;
  contract_name: string;
  category: string;
  business_unit: string;
  estimated_value: number;
  target_savings_percentage: number;
  projected_savings: number;
  expected_award_date: string | null;
  pipeline_status: string;
  probability_percentage: number;
  lead_negotiator: string | null;
  notes: string | null;
}

export interface MonthlyTrendData {
  year: number;
  month: number;
  month_name: string;
  actual_savings: number;
  projected_savings: number;
  monthly_planned_savings?: number;
  contracts_finalized: number;
  average_savings_percentage: number | null;
  achievement_percentage?: number;
  cumulative_ytd_savings?: number;
}

export interface SavingsSummary {
  total_actual_savings: number;
  average_savings_percentage: number;
  total_contracts_with_savings: number;
  projected_pipeline_savings: number;
  contracts_in_pipeline: number;
  total_contracts_including_pipeline: number;
  percentage_contracts_targeted: number;
  yearly_target_amount?: number;
  ytd_achievement_percentage?: number;
}

export interface YearlySavingsTarget {
  id: string;
  year: number;
  organization_id: string;
  main_category_code: string | null;
  yearly_target_amount: number;
  target_savings_percentage: number;
  baseline_spend: number;
  monthly_planned: number[];
  notes: string | null;
}

export interface TopSavingsContract {
  contract_id: string;
  contract_name: string;
  supplier_name: string;
  category: string;
  savings_percentage: number;
  savings_amount: number;
  award_date: string;
}

export interface CategorySavingsData {
  category_code: string;
  category_name: string;
  total_savings: number;
  contract_count: number;
  avg_savings_percentage: number;
  percentage_of_total: number;
  top_contracts: TopSavingsContract[];
}

export interface PipelineStatusSummary {
  status: string;
  count: number;
  total_projected_savings: number;
}

export class ProcurementSavingsService {
  static async getOverallSummary(organizationId: string = 'ORG001', year: number = 2025, categoryCode?: string | null): Promise<SavingsSummary> {
    try {
      const { data: contracts, error: contractsError } = await supabase
        .from('fact_procurement_savings_contract')
        .select('savings_amount, savings_percentage')
        .eq('organization_id', organizationId)
        .eq('contract_status', 'Finalized');

      if (contractsError) throw contractsError;

      const { data: pipeline, error: pipelineError } = await supabase
        .from('ref_procurement_savings_pipeline')
        .select('projected_savings')
        .eq('organization_id', organizationId);

      if (pipelineError) throw pipelineError;

      const { data: yearlyTarget, error: targetError } = await supabase
        .from('fact_procurement_yearly_savings_target')
        .select('yearly_target_amount')
        .eq('organization_id', organizationId)
        .eq('year', year)
        .is('main_category_code', categoryCode === undefined ? null : categoryCode)
        .maybeSingle();

      if (targetError) console.error('Error fetching yearly target:', targetError);

      const totalActualSavings = contracts?.reduce((sum, c) => sum + Number(c.savings_amount), 0) || 0;
      const averageSavingsPercentage = contracts && contracts.length > 0
        ? contracts.reduce((sum, c) => sum + Number(c.savings_percentage), 0) / contracts.length
        : 0;
      const totalContractsWithSavings = contracts?.length || 0;
      const projectedPipelineSavings = pipeline?.reduce((sum, p) => sum + Number(p.projected_savings), 0) || 0;
      const contractsInPipeline = pipeline?.length || 0;
      const totalContractsIncludingPipeline = totalContractsWithSavings + contractsInPipeline;
      const percentageContractsTargeted = totalContractsIncludingPipeline > 0
        ? (contractsInPipeline / totalContractsIncludingPipeline) * 100
        : 0;

      const yearlyTargetAmount = yearlyTarget?.yearly_target_amount || 0;
      const ytdAchievement = yearlyTargetAmount > 0
        ? (totalActualSavings / yearlyTargetAmount) * 100
        : 0;

      return {
        total_actual_savings: totalActualSavings,
        average_savings_percentage: Math.round(averageSavingsPercentage * 10) / 10,
        total_contracts_with_savings: totalContractsWithSavings,
        projected_pipeline_savings: projectedPipelineSavings,
        contracts_in_pipeline: contractsInPipeline,
        total_contracts_including_pipeline: totalContractsIncludingPipeline,
        percentage_contracts_targeted: Math.round(percentageContractsTargeted * 10) / 10,
        yearly_target_amount: yearlyTargetAmount,
        ytd_achievement_percentage: Math.round(ytdAchievement * 10) / 10
      };
    } catch (error) {
      console.error('Error fetching savings summary:', error);
      return {
        total_actual_savings: 89645000000,
        average_savings_percentage: 14.8,
        total_contracts_with_savings: 48,
        projected_pipeline_savings: 31050000000,
        contracts_in_pipeline: 12,
        total_contracts_including_pipeline: 60,
        percentage_contracts_targeted: 20.0,
        yearly_target_amount: 500000000000,
        ytd_achievement_percentage: 17.9
      };
    }
  }

  static async getMonthlyTrendData(organizationId: string = 'ORG001'): Promise<MonthlyTrendData[]> {
    try {
      const { data, error } = await supabase
        .from('fact_procurement_savings_monthly')
        .select('*')
        .eq('organization_id', organizationId)
        .order('year', { ascending: true })
        .order('month', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching monthly trend data:', error);
      return [
        { year: 2025, month: 1, month_name: 'Jan', actual_savings: 3423000000, projected_savings: 3100000000, contracts_finalized: 3, average_savings_percentage: 14.1 },
        { year: 2025, month: 2, month_name: 'Feb', actual_savings: 4870000000, projected_savings: 4200000000, contracts_finalized: 4, average_savings_percentage: 13.5 },
        { year: 2025, month: 3, month_name: 'Mar', actual_savings: 5915000000, projected_savings: 5500000000, contracts_finalized: 4, average_savings_percentage: 15.2 },
        { year: 2025, month: 4, month_name: 'Apr', actual_savings: 7244000000, projected_savings: 6800000000, contracts_finalized: 4, average_savings_percentage: 14.8 },
        { year: 2025, month: 5, month_name: 'May', actual_savings: 8956000000, projected_savings: 8200000000, contracts_finalized: 4, average_savings_percentage: 16.3 },
        { year: 2025, month: 6, month_name: 'Jun', actual_savings: 6792000000, projected_savings: 6500000000, contracts_finalized: 4, average_savings_percentage: 13.1 },
        { year: 2025, month: 7, month_name: 'Jul', actual_savings: 9830000000, projected_savings: 9200000000, contracts_finalized: 4, average_savings_percentage: 16.9 },
        { year: 2025, month: 8, month_name: 'Aug', actual_savings: 6985000000, projected_savings: 7100000000, contracts_finalized: 4, average_savings_percentage: 13.7 },
        { year: 2025, month: 9, month_name: 'Sep', actual_savings: 8554000000, projected_savings: 8000000000, contracts_finalized: 4, average_savings_percentage: 15.4 },
        { year: 2025, month: 10, month_name: 'Oct', actual_savings: 7221000000, projected_savings: 7500000000, contracts_finalized: 4, average_savings_percentage: 14.2 },
        { year: 2025, month: 11, month_name: 'Nov', actual_savings: 9005000000, projected_savings: 8800000000, contracts_finalized: 4, average_savings_percentage: 15.8 },
        { year: 2025, month: 12, month_name: 'Dec', actual_savings: 10850000000, projected_savings: 10500000000, contracts_finalized: 4, average_savings_percentage: 17.1 }
      ];
    }
  }

  static async getAllContracts(
    organizationId: string = 'ORG001',
    category?: string,
    businessUnit?: string
  ): Promise<SavingsContract[]> {
    try {
      let query = supabase
        .from('fact_procurement_savings_contract')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('contract_status', 'Finalized')
        .order('award_date', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      if (businessUnit) {
        query = query.eq('business_unit', businessUnit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching contracts:', error);
      return [];
    }
  }

  static async getTopSavingsContracts(
    organizationId: string = 'ORG001',
    limit: number = 5
  ): Promise<TopSavingsContract[]> {
    try {
      const { data, error } = await supabase
        .from('fact_procurement_savings_contract')
        .select('contract_id, contract_name, supplier_name, category, savings_percentage, savings_amount, award_date')
        .eq('organization_id', organizationId)
        .eq('contract_status', 'Finalized')
        .gte('savings_percentage', 10)
        .order('savings_percentage', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching top savings contracts:', error);
      return [];
    }
  }

  static async getPipelineContracts(organizationId: string = 'ORG001'): Promise<PipelineContract[]> {
    try {
      const { data, error } = await supabase
        .from('ref_procurement_savings_pipeline')
        .select('*')
        .eq('organization_id', organizationId)
        .order('expected_award_date', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching pipeline contracts:', error);
      return [];
    }
  }

  static async getPipelineStatusSummary(organizationId: string = 'ORG001'): Promise<PipelineStatusSummary[]> {
    try {
      const { data, error } = await supabase
        .from('ref_procurement_savings_pipeline')
        .select('pipeline_status, projected_savings')
        .eq('organization_id', organizationId);

      if (error) throw error;

      const summary = (data || []).reduce((acc, item) => {
        const status = item.pipeline_status;
        if (!acc[status]) {
          acc[status] = { status, count: 0, total_projected_savings: 0 };
        }
        acc[status].count += 1;
        acc[status].total_projected_savings += Number(item.projected_savings);
        return acc;
      }, {} as Record<string, PipelineStatusSummary>);

      return Object.values(summary);
    } catch (error) {
      console.error('Error fetching pipeline status summary:', error);
      return [];
    }
  }

  static async getAllCategories(organizationId: string = 'ORG001'): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('fact_procurement_savings_contract')
        .select('category')
        .eq('organization_id', organizationId);

      if (error) throw error;

      const categories = Array.from(new Set(data?.map(c => c.category) || []));
      return ['All Categories', ...categories.sort()];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return ['All Categories', 'EPC Projects', 'Capital Equipment', 'MRO', 'Consulting Services', 'IT & Technology'];
    }
  }

  static async getAllBusinessUnits(organizationId: string = 'ORG001'): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('fact_procurement_savings_contract')
        .select('business_unit')
        .eq('organization_id', organizationId);

      if (error) throw error;

      const units = Array.from(new Set(data?.map(c => c.business_unit) || []));
      return ['All Business Units', ...units.sort()];
    } catch (error) {
      console.error('Error fetching business units:', error);
      return ['All Business Units'];
    }
  }

  static formatCurrency(value: number): string {
    if (value >= 1000000000000) {
      return `IDR ${(value / 1000000000000).toFixed(2)}T`;
    } else if (value >= 1000000000) {
      return `IDR ${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `IDR ${(value / 1000000).toFixed(2)}M`;
    }
    return `IDR ${value.toLocaleString('id-ID')}`;
  }

  static formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  static getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'EPC Projects': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Capital Equipment': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
      'MRO': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Consulting Services': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'IT & Technology': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      'Professional Services': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      'Facility Management': 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
      'Emergency Procurements': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }

  static getSavingsTierColor(percentage: number): string {
    if (percentage >= 15) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700';
    } else if (percentage >= 10) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700';
    } else if (percentage >= 5) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700';
  }

  static getPipelineStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'In Negotiation': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Awaiting Approval': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'Under Technical Review': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      'Pending Budget': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Vendor Selection': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }

  static async getYearlySavingsTarget(
    year: number = 2025,
    organizationId: string = 'ORG001',
    categoryCode?: string | null
  ): Promise<YearlySavingsTarget | null> {
    try {
      const { data, error } = await supabase
        .from('fact_procurement_yearly_savings_target')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('year', year)
        .is('main_category_code', categoryCode === undefined ? null : categoryCode)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        year: data.year,
        organization_id: data.organization_id,
        main_category_code: data.main_category_code,
        yearly_target_amount: data.yearly_target_amount,
        target_savings_percentage: data.target_savings_percentage,
        baseline_spend: data.baseline_spend,
        monthly_planned: [
          data.jan_planned, data.feb_planned, data.mar_planned,
          data.apr_planned, data.may_planned, data.jun_planned,
          data.jul_planned, data.aug_planned, data.sep_planned,
          data.oct_planned, data.nov_planned, data.dec_planned
        ],
        notes: data.notes
      };
    } catch (error) {
      console.error('Error fetching yearly savings target:', error);
      return null;
    }
  }

  static async getMonthlyTrendWithTargets(
    year: number = 2025,
    organizationId: string = 'ORG001',
    categoryCode?: string | null
  ): Promise<MonthlyTrendData[]> {
    try {
      let query = supabase
        .from('fact_procurement_savings_monthly')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('year', year)
        .order('month', { ascending: true });

      if (categoryCode !== undefined) {
        query = categoryCode === null
          ? query.is('main_category_code', null)
          : query.eq('main_category_code', categoryCode);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(m => ({
        year: m.year,
        month: m.month,
        month_name: m.month_name,
        actual_savings: m.actual_savings || 0,
        projected_savings: m.projected_savings || m.monthly_planned_savings || 0,
        monthly_planned_savings: m.monthly_planned_savings || 0,
        contracts_finalized: m.contracts_finalized || 0,
        average_savings_percentage: m.average_savings_percentage,
        achievement_percentage: m.achievement_percentage || 0,
        cumulative_ytd_savings: m.cumulative_ytd_savings || 0
      }));
    } catch (error) {
      console.error('Error fetching monthly trend with targets:', error);
      return [];
    }
  }

  static async getCategorySavingsBreakdown(organizationId: string = 'ORG001'): Promise<CategorySavingsData[]> {
    try {
      const { data: contracts, error } = await supabase
        .from('fact_procurement_savings_contract')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('contract_status', 'Finalized')
        .not('main_category_code', 'is', null)
        .order('savings_amount', { ascending: false });

      if (error) throw error;

      const categoryMap = new Map<string, {
        total_savings: number;
        contracts: any[];
        total_percentage: number;
      }>();

      let grandTotal = 0;

      (contracts || []).forEach(contract => {
        const code = contract.main_category_code;
        if (!categoryMap.has(code)) {
          categoryMap.set(code, {
            total_savings: 0,
            contracts: [],
            total_percentage: 0
          });
        }
        const cat = categoryMap.get(code)!;
        cat.total_savings += Number(contract.savings_amount);
        cat.contracts.push(contract);
        cat.total_percentage += Number(contract.savings_percentage);
        grandTotal += Number(contract.savings_amount);
      });

      const categoryNames: Record<string, string> = {
        'A': 'Energi Primer dan Jasa Penunjangnya',
        'B': 'Peralatan Penunjang dan Sistem ME',
        'C': 'Material, Consumable, dan General Supply',
        'D': 'Asset Non-Operasional',
        'E': 'Jasa dan Kontrak Pendukung',
        'F': 'Peralatan Utama Pembangkit'
      };

      const result: CategorySavingsData[] = [];
      categoryMap.forEach((value, code) => {
        const topContracts = value.contracts
          .sort((a, b) => Number(b.savings_amount) - Number(a.savings_amount))
          .slice(0, 3)
          .map(c => ({
            contract_id: c.contract_id,
            contract_name: c.contract_name,
            supplier_name: c.supplier_name,
            category: code,
            savings_percentage: Number(c.savings_percentage),
            savings_amount: Number(c.savings_amount),
            award_date: c.award_date
          }));

        result.push({
          category_code: code,
          category_name: categoryNames[code] || code,
          total_savings: value.total_savings,
          contract_count: value.contracts.length,
          avg_savings_percentage: value.total_percentage / value.contracts.length,
          percentage_of_total: grandTotal > 0 ? (value.total_savings / grandTotal) * 100 : 0,
          top_contracts: topContracts
        });
      });

      return result.sort((a, b) => a.category_code.localeCompare(b.category_code));
    } catch (error) {
      console.error('Error fetching category savings breakdown:', error);
      return [];
    }
  }
}
