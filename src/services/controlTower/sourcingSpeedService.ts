import { supabase } from '../supabaseClient';

export interface SourcingContract {
  id: string;
  contractNumber: string;
  contractName: string;
  category: string;
  requestDate: string;
  contractSignedDate: string | null;
  sourcingDurationDays: number | null;
  valueUsd: number;
  status: string;
  unitLocationId: string | null;
  vendorName: string;
  currentProcess: string | null;
}

export interface SourcingBenchmark {
  id: string;
  category: string;
  targetDays: number;
  industryAverageDays: number;
  description: string | null;
}

export interface CategoryPerformance {
  category: string;
  averageDays: number;
  contractCount: number;
  targetDays: number;
  industryAverageDays: number;
  performanceVsTarget: number;
  performanceVsIndustry: number;
}

export interface OverallSummary {
  averageDays: number;
  totalContracts: number;
  completedContracts: number;
  inProgressContracts: number;
  previousPeriodAverage: number;
  percentChange: number;
  withinTargetCount?: number;
  beyondTargetCount?: number;
  withinTargetPercentage?: number;
}

export interface SourcingDistribution {
  range: string;
  count: number;
  percentage: number;
  min: number;
  max: number;
}

class SourcingSpeedService {
  async getOverallSummary(): Promise<OverallSummary> {
    // Get all contracts with their target information
    const { data: contracts, error } = await supabase
      .from('procurement_sourcing_contracts')
      .select(`
        sourcing_duration_days,
        status,
        request_date,
        main_category_code
      `)
      .eq('status', 'Completed')
      .not('sourcing_duration_days', 'is', null);

    if (error) throw error;

    // Get benchmarks for target comparison from ref_procurement_categories
    const { data: benchmarks } = await supabase
      .from('ref_procurement_categories')
      .select('main_category_code, target_sourcing_days');

    // Create a map of unique category targets
    const categoryTargets = new Map<string, number>();
    benchmarks?.forEach(b => {
      if (!categoryTargets.has(b.main_category_code)) {
        categoryTargets.set(b.main_category_code, b.target_sourcing_days);
      }
    });

    const completedContracts = contracts?.length || 0;
    const totalDays = contracts?.reduce((sum, c) => sum + (c.sourcing_duration_days || 0), 0) || 0;
    const averageDays = completedContracts > 0 ? totalDays / completedContracts : 0;

    // Calculate within target count
    let withinTargetCount = 0;
    let beyondTargetCount = 0;

    contracts?.forEach(contract => {
      const targetDays = categoryTargets.get(contract.main_category_code) || 60; // Default target

      if (contract.sourcing_duration_days <= targetDays) {
        withinTargetCount++;
      } else {
        beyondTargetCount++;
      }
    });

    const withinTargetPercentage = completedContracts > 0
      ? Math.round((withinTargetCount / completedContracts) * 100)
      : 0;

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const threeMonthsAgoStr = threeMonthsAgo.toISOString().split('T')[0];

    const previousPeriodContracts = contracts?.filter(
      c => c.request_date < threeMonthsAgoStr
    ) || [];

    const prevTotal = previousPeriodContracts.reduce((sum, c) => sum + (c.sourcing_duration_days || 0), 0);
    const previousPeriodAverage = previousPeriodContracts.length > 0
      ? prevTotal / previousPeriodContracts.length
      : averageDays;

    const percentChange = previousPeriodAverage > 0
      ? ((averageDays - previousPeriodAverage) / previousPeriodAverage) * 100
      : 0;

    const { data: allContracts } = await supabase
      .from('procurement_sourcing_contracts')
      .select('status');

    const totalContracts = allContracts?.length || 0;
    const inProgressContracts = allContracts?.filter(c => c.status === 'In Progress').length || 0;

    return {
      averageDays: Math.round(averageDays * 10) / 10,
      totalContracts,
      completedContracts,
      inProgressContracts,
      previousPeriodAverage: Math.round(previousPeriodAverage * 10) / 10,
      percentChange: Math.round(percentChange * 10) / 10,
      withinTargetCount,
      beyondTargetCount,
      withinTargetPercentage
    };
  }

  async getCategoryPerformance(): Promise<CategoryPerformance[]> {
    const { data: contracts, error: contractsError } = await supabase
      .from('procurement_sourcing_contracts')
      .select('category, sourcing_duration_days')
      .eq('status', 'Completed')
      .not('sourcing_duration_days', 'is', null);

    if (contractsError) throw contractsError;

    const { data: benchmarks, error: benchmarksError } = await supabase
      .from('sourcing_speed_benchmarks')
      .select('*');

    if (benchmarksError) throw benchmarksError;

    const categoryMap = new Map<string, { totalDays: number; count: number }>();

    contracts?.forEach(contract => {
      const existing = categoryMap.get(contract.category) || { totalDays: 0, count: 0 };
      categoryMap.set(contract.category, {
        totalDays: existing.totalDays + (contract.sourcing_duration_days || 0),
        count: existing.count + 1
      });
    });

    const performance: CategoryPerformance[] = [];

    categoryMap.forEach((stats, category) => {
      const benchmark = benchmarks?.find(b => b.category === category);
      const averageDays = stats.totalDays / stats.count;
      const targetDays = benchmark?.target_days || 0;
      const industryAverageDays = benchmark?.industry_average_days || 0;

      performance.push({
        category,
        averageDays: Math.round(averageDays * 10) / 10,
        contractCount: stats.count,
        targetDays,
        industryAverageDays,
        performanceVsTarget: targetDays > 0 ? Math.round(((averageDays - targetDays) / targetDays) * 100) : 0,
        performanceVsIndustry: industryAverageDays > 0 ? Math.round(((averageDays - industryAverageDays) / industryAverageDays) * 100) : 0
      });
    });

    return performance.sort((a, b) => b.averageDays - a.averageDays);
  }

  async getLongestDurationContracts(limit: number = 10): Promise<SourcingContract[]> {
    const { data, error } = await supabase
      .from('procurement_sourcing_contracts')
      .select('*')
      .eq('status', 'Completed')
      .not('sourcing_duration_days', 'is', null)
      .order('sourcing_duration_days', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(contract => ({
      id: contract.id,
      contractNumber: contract.contract_number,
      contractName: contract.contract_name,
      category: contract.category,
      requestDate: contract.request_date,
      contractSignedDate: contract.contract_signed_date,
      sourcingDurationDays: contract.sourcing_duration_days,
      valueUsd: contract.value_usd,
      status: contract.status,
      unitLocationId: contract.unit_location_id,
      vendorName: contract.vendor_name,
      currentProcess: contract.current_process
    }));
  }

  async getLongestDurationContractsByCategory(category: string | null = null, limit: number = 10): Promise<SourcingContract[]> {
    let query = supabase
      .from('procurement_sourcing_contracts')
      .select('*')
      .eq('status', 'Completed')
      .not('sourcing_duration_days', 'is', null);

    if (category && category !== 'All Categories') {
      query = query.eq('category', category);
    }

    const { data, error } = await query
      .order('sourcing_duration_days', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(contract => ({
      id: contract.id,
      contractNumber: contract.contract_number,
      contractName: contract.contract_name,
      category: contract.category,
      requestDate: contract.request_date,
      contractSignedDate: contract.contract_signed_date,
      sourcingDurationDays: contract.sourcing_duration_days,
      valueUsd: contract.value_usd,
      status: contract.status,
      unitLocationId: contract.unit_location_id,
      vendorName: contract.vendor_name,
      currentProcess: contract.current_process
    }));
  }

  async getSourcingDistribution(): Promise<SourcingDistribution[]> {
    const { data: contracts, error } = await supabase
      .from('procurement_sourcing_contracts')
      .select('sourcing_duration_days')
      .eq('status', 'Completed')
      .not('sourcing_duration_days', 'is', null);

    if (error) throw error;

    const total = contracts?.length || 0;
    if (total === 0) return [];

    const ranges = [
      { range: '0-10 days', min: 0, max: 10, count: 0 },
      { range: '11-20 days', min: 11, max: 20, count: 0 },
      { range: '21-30 days', min: 21, max: 30, count: 0 },
      { range: '31-40 days', min: 31, max: 40, count: 0 },
      { range: '41-50 days', min: 41, max: 50, count: 0 },
      { range: '51-60 days', min: 51, max: 60, count: 0 },
      { range: '61+ days', min: 61, max: 999, count: 0 }
    ];

    contracts?.forEach(contract => {
      const days = contract.sourcing_duration_days || 0;
      const range = ranges.find(r => days >= r.min && days <= r.max);
      if (range) range.count++;
    });

    return ranges.map(r => ({
      range: r.range,
      count: r.count,
      percentage: Math.round((r.count / total) * 100 * 10) / 10,
      min: r.min,
      max: r.max
    }));
  }

  async getContractsByDurationRange(minDays: number, maxDays: number): Promise<SourcingContract[]> {
    let query = supabase
      .from('procurement_sourcing_contracts')
      .select('*')
      .eq('status', 'Completed')
      .not('sourcing_duration_days', 'is', null)
      .gte('sourcing_duration_days', minDays);

    if (maxDays < 999) {
      query = query.lte('sourcing_duration_days', maxDays);
    }

    const { data, error } = await query.order('sourcing_duration_days', { ascending: false });

    if (error) throw error;

    return (data || []).map(contract => ({
      id: contract.id,
      contractNumber: contract.contract_number,
      contractName: contract.contract_name,
      category: contract.category,
      requestDate: contract.request_date,
      contractSignedDate: contract.contract_signed_date,
      sourcingDurationDays: contract.sourcing_duration_days,
      valueUsd: contract.value_usd,
      status: contract.status,
      unitLocationId: contract.unit_location_id,
      vendorName: contract.vendor_name,
      currentProcess: contract.current_process
    }));
  }

  async getBenchmarks(): Promise<SourcingBenchmark[]> {
    const { data, error } = await supabase
      .from('sourcing_speed_benchmarks')
      .select('*')
      .order('target_days', { ascending: true });

    if (error) throw error;

    return (data || []).map(benchmark => ({
      id: benchmark.id,
      category: benchmark.category,
      targetDays: benchmark.target_days,
      industryAverageDays: benchmark.industry_average_days,
      description: benchmark.description
    }));
  }

  async getContractsByCategory(category: string): Promise<SourcingContract[]> {
    const { data, error } = await supabase
      .from('procurement_sourcing_contracts')
      .select('*')
      .eq('category', category)
      .order('sourcing_duration_days', { ascending: false });

    if (error) throw error;

    return (data || []).map(contract => ({
      id: contract.id,
      contractNumber: contract.contract_number,
      contractName: contract.contract_name,
      category: contract.category,
      requestDate: contract.request_date,
      contractSignedDate: contract.contract_signed_date,
      sourcingDurationDays: contract.sourcing_duration_days,
      valueUsd: contract.value_usd,
      status: contract.status,
      unitLocationId: contract.unit_location_id,
      vendorName: contract.vendor_name,
      currentProcess: contract.current_process
    }));
  }

  async getAllCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('procurement_sourcing_contracts')
      .select('category')
      .order('category');

    if (error) throw error;

    const uniqueCategories = Array.from(new Set(data?.map(d => d.category) || []));
    return uniqueCategories;
  }
}

export const sourcingSpeedService = new SourcingSpeedService();
