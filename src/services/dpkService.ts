import { supabase } from './supabaseClient';

class CacheManager {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly TTL = 5 * 60 * 1000;

  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const keysToDelete = Array.from(this.cache.keys()).filter(key => key.includes(pattern));
    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

const cache = new CacheManager();

class RetryManager {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;

        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt);
          console.warn(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`, error.message);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`Operation failed after ${maxRetries} retries: ${lastError?.message || 'Unknown error'}`);
  }
}

export interface DemandForecast {
  forecast_id?: number;
  forecast_type: string;
  material_id: string;
  unit_requestor_id?: string;
  forecast_date: string;
  requirement_date?: string;
  forecast_qty: number;
  forecast_value?: number;
  currency?: string;
}

export interface DemandConsolidation {
  consolidation_id?: number;
  forecast_type: string;
  period_type: string;
  period_value: string;
  material_id: string;
  unit_requestor_id?: string;
  erp_forecast_qty: number;
  user_forecast_qty: number;
  consolidated_qty: number;
  unit_price: number;
  total_value: number;
  currency?: string;
  is_approved?: boolean;
}

export interface BudgetApproval {
  approval_id?: number;
  forecast_type: string;
  fiscal_year: number;
  total_budget: number;
  currency?: string;
  approval_status: string;
  submitted_by?: string;
  approved_by?: string;
  rejection_reason?: string;
}

export interface NettingResult {
  netting_id?: number;
  forecast_type: string;
  material_id: string;
  unit_requestor_id?: string;
  gross_demand_qty: number;
  available_inventory_qty: number;
  open_po_qty: number;
  net_requirement_qty: number;
  unit_price: number;
  net_value: number;
  currency?: string;
  is_converted_to_drp?: boolean;
}

export interface UserForecastUpload {
  upload_id?: number;
  upload_type: string;
  material_id: string;
  unit_requestor_id?: string;
  period_type: string;
  period_value: string;
  forecast_qty: number;
  unit_price?: number;
  forecast_value?: number;
  currency?: string;
  uploaded_by?: string;
}

export class DPKService {
  // ===== DEMAND FORECAST =====

  static async getERPForecastData(forecastType: string, periodType: string): Promise<DemandForecast[]> {
    const { data, error } = await supabase
      .from('forecast')
      .select('*')
      .eq('forecast_type', forecastType)
      .order('requirement_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async generateERPForecast(forecastType: string, year: number): Promise<DemandForecast[]> {
    // TODO: Replace with agentConsoleService when integration is ready
    // For now, generate mock forecast based on historical data

    const { data: historicalData } = await supabase
      .from('demand')
      .select('material_id, unit_requestor_id, demand_qty')
      .gte('requirement_date', `${year - 1}-01-01`)
      .lte('requirement_date', `${year - 1}-12-31`);

    if (!historicalData || historicalData.length === 0) {
      return [];
    }

    // Group by material and calculate average
    const materialMap = new Map<string, { total: number; count: number; unit: string }>();

    historicalData.forEach(item => {
      const key = `${item.material_id}-${item.unit_requestor_id || 'GENERAL'}`;
      const existing = materialMap.get(key) || { total: 0, count: 0, unit: item.unit_requestor_id };
      materialMap.set(key, {
        total: existing.total + (Number(item.demand_qty) || 0),
        count: existing.count + 1,
        unit: item.unit_requestor_id
      });
    });

    // Generate quarterly forecasts
    const forecasts: DemandForecast[] = [];
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

    materialMap.forEach((value, key) => {
      const [material_id, unit] = key.split('-');
      const avgQty = value.total / value.count / 4; // Average per quarter

      quarters.forEach((q, idx) => {
        const month = (idx * 3) + 1;
        forecasts.push({
          forecast_type: forecastType,
          material_id,
          unit_requestor_id: unit === 'GENERAL' ? undefined : unit,
          forecast_date: new Date().toISOString().split('T')[0],
          requirement_date: `${year}-${String(month).padStart(2, '0')}-01`,
          forecast_qty: Math.round(avgQty * (0.9 + Math.random() * 0.2)), // +/- 10% variance
          currency: 'IDR'
        });
      });
    });

    // Save to database
    const { data, error } = await supabase
      .from('forecast')
      .insert(forecasts)
      .select();

    if (error) throw error;
    return data || forecasts;
  }

  // ===== DEMAND CONSOLIDATION =====

  static async uploadUserForecast(uploads: UserForecastUpload[]): Promise<boolean> {
    const { error } = await supabase
      .from('fact_dpk_upload')
      .insert(uploads);

    if (error) throw error;
    return true;
  }

  static async consolidateDemand(forecastType: string, periodType: string, periodValue: string): Promise<DemandConsolidation[]> {
    // Get ERP forecasts
    const { data: erpData } = await supabase
      .from('forecast')
      .select('material_id, unit_requestor_id, forecast_qty')
      .eq('forecast_type', forecastType);

    // Get user uploads
    const { data: userData } = await supabase
      .from('fact_dpk_upload')
      .select('material_id, unit_requestor_id, forecast_qty')
      .eq('period_type', periodType)
      .eq('period_value', periodValue);

    // Consolidate by material
    const consolidationMap = new Map<string, DemandConsolidation>();

    (erpData || []).forEach(item => {
      const key = `${item.material_id}-${item.unit_requestor_id || 'GENERAL'}`;
      const existing = consolidationMap.get(key) || {
        forecast_type: forecastType,
        period_type: periodType,
        period_value: periodValue,
        material_id: item.material_id,
        unit_requestor_id: item.unit_requestor_id,
        erp_forecast_qty: 0,
        user_forecast_qty: 0,
        consolidated_qty: 0,
        unit_price: 0,
        total_value: 0,
        currency: 'IDR'
      };

      existing.erp_forecast_qty += Number(item.forecast_qty) || 0;
      consolidationMap.set(key, existing);
    });

    (userData || []).forEach(item => {
      const key = `${item.material_id}-${item.unit_requestor_id || 'GENERAL'}`;
      const existing = consolidationMap.get(key) || {
        forecast_type: forecastType,
        period_type: periodType,
        period_value: periodValue,
        material_id: item.material_id,
        unit_requestor_id: item.unit_requestor_id,
        erp_forecast_qty: 0,
        user_forecast_qty: 0,
        consolidated_qty: 0,
        unit_price: 0,
        total_value: 0,
        currency: 'IDR'
      };

      existing.user_forecast_qty += Number(item.forecast_qty) || 0;
      consolidationMap.set(key, existing);
    });

    // Calculate consolidated quantities
    const consolidations = Array.from(consolidationMap.values()).map(item => ({
      ...item,
      consolidated_qty: item.erp_forecast_qty + item.user_forecast_qty,
      total_value: (item.erp_forecast_qty + item.user_forecast_qty) * item.unit_price
    }));

    // Save to database
    const { data, error } = await supabase
      .from('dim_dpk_demand_consolidation')
      .upsert(consolidations, {
        onConflict: 'consolidation_id',
        ignoreDuplicates: false
      })
      .select();

    if (error) throw error;
    return data || consolidations;
  }

  static async getConsolidatedDemand(forecastType: string, periodType: string): Promise<DemandConsolidation[]> {
    const { data, error } = await supabase
      .from('dim_dpk_demand_consolidation')
      .select('*')
      .eq('forecast_type', forecastType)
      .eq('period_type', periodType)
      .order('period_value', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // ===== BUDGET APPROVAL =====

  static async submitBudgetApproval(approval: BudgetApproval): Promise<BudgetApproval> {
    const { data, error } = await supabase
      .from('dim_dpk_budget_approval')
      .insert({
        ...approval,
        approval_status: 'Pending',
        submitted_date: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getBudgetApprovals(fiscalYear?: number): Promise<BudgetApproval[]> {
    let query = supabase
      .from('dim_dpk_budget_approval')
      .select('*')
      .order('submitted_date', { ascending: false });

    if (fiscalYear) {
      query = query.eq('fiscal_year', fiscalYear);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async approveBudget(approvalId: number, approvedBy: string): Promise<boolean> {
    const { error } = await supabase
      .from('dim_dpk_budget_approval')
      .update({
        approval_status: 'Approved',
        approved_by: approvedBy,
        approved_date: new Date().toISOString()
      })
      .eq('approval_id', approvalId);

    if (error) throw error;
    return true;
  }

  // ===== DEMAND NETTING =====

  static async performDemandNetting(forecastType: string, materialIds?: string[]): Promise<NettingResult[]> {
    // Get consolidated demand
    const { data: demandData } = await supabase
      .from('dim_dpk_demand_consolidation')
      .select('material_id, unit_requestor_id, consolidated_qty')
      .eq('forecast_type', forecastType)
      .eq('is_approved', true);

    if (!demandData || demandData.length === 0) {
      return [];
    }

    // Get inventory data
    const { data: inventoryData } = await supabase
      .from('inventory_snapshot')
      .select('material_id, stock_qty, unit_price_map')
      .order('snapshot_date', { ascending: false })
      .limit(1000);

    // Get open PO data
    const { data: poData } = await supabase
      .from('purchase_order')
      .select('material_id, qty_ordered')
      .in('po_status', ['Open', 'Confirmed']);

    // Create inventory map
    const inventoryMap = new Map<string, { qty: number; price: number }>();
    (inventoryData || []).forEach(item => {
      const existing = inventoryMap.get(item.material_id) || { qty: 0, price: 0 };
      inventoryMap.set(item.material_id, {
        qty: existing.qty + (Number(item.stock_qty) || 0),
        price: Number(item.unit_price_map) || 0
      });
    });

    // Create open PO map
    const poMap = new Map<string, number>();
    (poData || []).forEach(item => {
      const existing = poMap.get(item.material_id) || 0;
      poMap.set(item.material_id, existing + (Number(item.qty_ordered) || 0));
    });

    // Calculate netting
    const nettingResults: NettingResult[] = demandData.map(item => {
      const inventory = inventoryMap.get(item.material_id) || { qty: 0, price: 0 };
      const openPO = poMap.get(item.material_id) || 0;
      const grossDemand = Number(item.consolidated_qty) || 0;
      const netRequirement = Math.max(0, grossDemand - inventory.qty - openPO);

      return {
        forecast_type: forecastType,
        material_id: item.material_id,
        unit_requestor_id: item.unit_requestor_id,
        gross_demand_qty: grossDemand,
        available_inventory_qty: inventory.qty,
        open_po_qty: openPO,
        net_requirement_qty: netRequirement,
        unit_price: inventory.price,
        net_value: netRequirement * inventory.price,
        currency: 'IDR',
        is_converted_to_drp: false
      };
    });

    // Save to database
    const { data, error } = await supabase
      .from('dim_dpk_netting_result')
      .upsert(nettingResults, {
        onConflict: 'netting_id',
        ignoreDuplicates: false
      })
      .select();

    if (error) throw error;
    return data || nettingResults;
  }

  static async getNettingResults(forecastType: string): Promise<NettingResult[]> {
    const { data, error } = await supabase
      .from('dim_dpk_netting_result')
      .select('*')
      .eq('forecast_type', forecastType)
      .order('net_requirement_qty', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // ===== DRP GENERATION =====

  static async generateDRP(forecastType: string, nettingIds?: number[]): Promise<any[]> {
    let query = supabase
      .from('dim_dpk_netting_result')
      .select('*')
      .eq('forecast_type', forecastType)
      .eq('is_converted_to_drp', false)
      .gt('net_requirement_qty', 0);

    if (nettingIds && nettingIds.length > 0) {
      query = query.in('netting_id', nettingIds);
    }

    const { data: nettingData, error } = await query;
    if (error) throw error;

    if (!nettingData || nettingData.length === 0) {
      return [];
    }

    // Generate DRP records
    const drpRecords = nettingData.map(item => ({
      material_id: item.material_id,
      unit_requestor_id: item.unit_requestor_id,
      requirement_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      demand_qty: item.net_requirement_qty,
      demand_type: 'DRP',
      is_selected_for_procurement: true
    }));

    // Insert into demand table
    const { data: drpData, error: drpError } = await supabase
      .from('demand')
      .insert(drpRecords)
      .select();

    if (drpError) throw drpError;

    // Mark netting results as converted
    await supabase
      .from('dim_dpk_netting_result')
      .update({ is_converted_to_drp: true })
      .in('netting_id', nettingData.map(n => n.netting_id));

    return drpData || drpRecords;
  }

  // ===== DASHBOARD STATISTICS =====

  static async getDashboardStats(forecastType: string): Promise<any> {
    const [forecasts, consolidations, approvals, netting] = await Promise.all([
      this.getERPForecastData(forecastType, 'annual'),
      this.getConsolidatedDemand(forecastType, 'annual'),
      this.getBudgetApprovals(new Date().getFullYear()),
      this.getNettingResults(forecastType)
    ]);

    const totalForecastQty = forecasts.reduce((sum, f) => sum + (Number(f.forecast_qty) || 0), 0);
    const totalConsolidatedQty = consolidations.reduce((sum, c) => sum + (Number(c.consolidated_qty) || 0), 0);
    const totalNetRequirement = netting.reduce((sum, n) => sum + (Number(n.net_requirement_qty) || 0), 0);
    const totalBudget = approvals.filter(a => a.approval_status === 'Approved')
      .reduce((sum, a) => sum + (Number(a.total_budget) || 0), 0);

    return {
      totalForecastQty,
      totalConsolidatedQty,
      totalNetRequirement,
      totalBudget,
      forecastCount: forecasts.length,
      consolidationCount: consolidations.length,
      approvalCount: approvals.filter(a => a.approval_status === 'Approved').length,
      pendingApprovalCount: approvals.filter(a => a.approval_status === 'Pending').length
    };
  }

  // ===== DPK OVERVIEW DASHBOARD =====

  static async getDPKSubmissionStats(fiscalYear: number = new Date().getFullYear()): Promise<{
    totalUnits: number;
    submittedUnits: number;
    notSubmittedUnits: number;
    submissionPercentage: number;
  }> {
    const cacheKey = `dpk_submission_stats_${fiscalYear}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const result = await RetryManager.withRetry(async () => {
        const { data: units, error: unitsError } = await supabase
          .from('dim_unit')
          .select('unit_id')
          .eq('fiscal_year', fiscalYear)
          .eq('is_active', true);

        if (unitsError) throw new Error(`Failed to fetch units: ${unitsError.message}`);

        const { data: submissions, error: submissionsError } = await supabase
          .from('fact_dpk_submission')
          .select('unit_id, submission_status')
          .eq('submission_type', 'DPK')
          .eq('fiscal_year', fiscalYear);

        if (submissionsError) throw new Error(`Failed to fetch submissions: ${submissionsError.message}`);

        const totalUnits = units?.length || 0;
        const submittedUnits = submissions?.filter(s => s.submission_status === 'Submitted').length || 0;
        const notSubmittedUnits = totalUnits - submittedUnits;
        const submissionPercentage = totalUnits > 0 ? (submittedUnits / totalUnits) * 100 : 0;

        return {
          totalUnits,
          submittedUnits,
          notSubmittedUnits,
          submissionPercentage: Math.round(submissionPercentage * 10) / 10
        };
      });

      cache.set(cacheKey, result);
      return result;
    } catch (error: any) {
      console.error('Error fetching DPK submission stats:', error);
      throw new Error(`Unable to load DPK submission statistics: ${error.message}`);
    }
  }

  static async getBottom5ForecastAccuracy(fiscalYear: number = new Date().getFullYear()): Promise<Array<{
    unit_id: string;
    unit_name: string;
    accuracy_percentage: number;
  }>> {
    const cacheKey = `bottom5_accuracy_${fiscalYear}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const result = await RetryManager.withRetry(async () => {
        const { data, error } = await supabase
          .from('fact_forecast_accuracy')
          .select(`
            unit_id,
            accuracy_percentage,
            dim_unit!inner(unit_name)
          `)
          .eq('fiscal_year', fiscalYear)
          .order('accuracy_percentage', { ascending: true })
          .limit(5);

        if (error) throw new Error(`Failed to fetch forecast accuracy: ${error.message}`);

        return (data || []).map(item => ({
          unit_id: item.unit_id,
          unit_name: (item.dim_unit as any).unit_name,
          accuracy_percentage: Number(item.accuracy_percentage)
        }));
      });

      cache.set(cacheKey, result);
      return result;
    } catch (error: any) {
      console.error('Error fetching bottom 5 forecast accuracy:', error);
      throw new Error(`Unable to load forecast accuracy data: ${error.message}`);
    }
  }

  static async getPRSubmissionStats(fiscalYear: number = new Date().getFullYear()): Promise<{
    totalUnits: number;
    submittedUnits: number;
    submissionPercentage: number;
  }> {
    const cacheKey = `pr_submission_stats_${fiscalYear}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const result = await RetryManager.withRetry(async () => {
        const { data: units, error: unitsError } = await supabase
          .from('dim_unit')
          .select('unit_id')
          .eq('fiscal_year', fiscalYear)
          .eq('is_active', true);

        if (unitsError) throw new Error(`Failed to fetch units: ${unitsError.message}`);

        const { data: submissions, error: submissionsError } = await supabase
          .from('fact_dpk_submission')
          .select('unit_id, submission_status')
          .eq('submission_type', 'PR')
          .eq('fiscal_year', fiscalYear);

        if (submissionsError) throw new Error(`Failed to fetch PR submissions: ${submissionsError.message}`);

        const totalUnits = units?.length || 0;
        const submittedUnits = submissions?.filter(s => s.submission_status === 'Submitted').length || 0;
        const submissionPercentage = totalUnits > 0 ? (submittedUnits / totalUnits) * 100 : 0;

        return {
          totalUnits,
          submittedUnits,
          submissionPercentage: Math.round(submissionPercentage * 10) / 10
        };
      });

      cache.set(cacheKey, result);
      return result;
    } catch (error: any) {
      console.error('Error fetching PR submission stats:', error);
      throw new Error(`Unable to load PR submission statistics: ${error.message}`);
    }
  }

  static async getSTRSubmissionStats(fiscalYear: number = new Date().getFullYear()): Promise<{
    totalUnits: number;
    submittedUnits: number;
    submissionPercentage: number;
  }> {
    const cacheKey = `str_submission_stats_${fiscalYear}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const result = await RetryManager.withRetry(async () => {
        const { data: units, error: unitsError } = await supabase
          .from('dim_unit')
          .select('unit_id')
          .eq('fiscal_year', fiscalYear)
          .eq('is_active', true);

        if (unitsError) throw new Error(`Failed to fetch units: ${unitsError.message}`);

        const { data: submissions, error: submissionsError } = await supabase
          .from('fact_dpk_submission')
          .select('unit_id, submission_status')
          .eq('submission_type', 'STR')
          .eq('fiscal_year', fiscalYear);

        if (submissionsError) throw new Error(`Failed to fetch STR submissions: ${submissionsError.message}`);

        const totalUnits = units?.length || 0;
        const submittedUnits = submissions?.filter(s => s.submission_status === 'Submitted').length || 0;
        const submissionPercentage = totalUnits > 0 ? (submittedUnits / totalUnits) * 100 : 0;

        return {
          totalUnits,
          submittedUnits,
          submissionPercentage: Math.round(submissionPercentage * 10) / 10
        };
      });

      cache.set(cacheKey, result);
      return result;
    } catch (error: any) {
      console.error('Error fetching STR submission stats:', error);
      throw new Error(`Unable to load STR submission statistics: ${error.message}`);
    }
  }


  static invalidateCache(pattern?: string): void {
    cache.invalidate(pattern);
  }

  // ===== YEAR-OVER-YEAR COMPARISON METHODS =====

  static async getYearOverYearForecastAccuracy(): Promise<{
    lastYear: { year: number; accuracy: number; materialCount: number; submissionRate: number };
    currentYear: { year: number; accuracy: number; materialCount: number; submissionRate: number };
    change: { accuracy: number; materialCount: number; submissionRate: number };
  }> {
    const cacheKey = 'yoy_forecast_accuracy';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const result = await RetryManager.withRetry(async () => {
        const { data, error } = await supabase
          .from('fact_yoy_forecast_accuracy')
          .select('*')
          .order('fiscal_year', { ascending: false })
          .limit(2);

        if (error) throw new Error(`Failed to fetch year-over-year forecast accuracy: ${error.message}`);

        if (!data || data.length < 2) {
          throw new Error('Insufficient data for year-over-year comparison');
        }

        const currentYear = data[0];
        const lastYear = data[1];

        return {
          lastYear: {
            year: lastYear.fiscal_year,
            accuracy: Number(lastYear.accuracy_percentage),
            materialCount: lastYear.material_count,
            submissionRate: Number(lastYear.submission_rate)
          },
          currentYear: {
            year: currentYear.fiscal_year,
            accuracy: Number(currentYear.accuracy_percentage),
            materialCount: currentYear.material_count,
            submissionRate: Number(currentYear.submission_rate)
          },
          change: {
            accuracy: Number(currentYear.accuracy_percentage) - Number(lastYear.accuracy_percentage),
            materialCount: currentYear.material_count - lastYear.material_count,
            submissionRate: Number(currentYear.submission_rate) - Number(lastYear.submission_rate)
          }
        };
      });

      cache.set(cacheKey, result);
      return result;
    } catch (error: any) {
      console.error('Error fetching year-over-year forecast accuracy:', error);
      throw new Error(`Unable to load year-over-year forecast accuracy: ${error.message}`);
    }
  }

  static async getYearOverYearDemandSubmission(): Promise<{
    lastYear: { year: number; materials: Array<{ type: string; count: number }> };
    currentYear: { year: number; materials: Array<{ type: string; count: number }> };
    totalChange: number;
  }> {
    const cacheKey = 'yoy_demand_submission';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const result = await RetryManager.withRetry(async () => {
        const { data, error } = await supabase
          .from('fact_yoy_demand_submission')
          .select('*')
          .order('fiscal_year', { ascending: false });

        if (error) throw new Error(`Failed to fetch year-over-year demand submission: ${error.message}`);

        if (!data || data.length === 0) {
          throw new Error('No demand submission data available');
        }

        const currentYearData = data.filter(d => d.fiscal_year === data[0].fiscal_year);
        const lastYearData = data.filter(d => d.fiscal_year === data[0].fiscal_year - 1);

        const currentYearMaterials = currentYearData.map(d => ({
          type: d.material_type,
          count: d.material_count
        }));

        const lastYearMaterials = lastYearData.map(d => ({
          type: d.material_type,
          count: d.material_count
        }));

        const currentTotal = currentYearMaterials.reduce((sum, m) => sum + m.count, 0);
        const lastTotal = lastYearMaterials.reduce((sum, m) => sum + m.count, 0);

        return {
          lastYear: {
            year: data[0].fiscal_year - 1,
            materials: lastYearMaterials
          },
          currentYear: {
            year: data[0].fiscal_year,
            materials: currentYearMaterials
          },
          totalChange: currentTotal - lastTotal
        };
      });

      cache.set(cacheKey, result);
      return result;
    } catch (error: any) {
      console.error('Error fetching year-over-year demand submission:', error);
      throw new Error(`Unable to load year-over-year demand submission: ${error.message}`);
    }
  }

  static async getYearOverYearBudget(): Promise<{
    lastYear: { year: number; total: number; quarters: Array<{ quarter: string; budget: number; actual: number }> };
    currentYear: { year: number; total: number; quarters: Array<{ quarter: string; budget: number; actual: number }> };
    change: { amount: number; percentage: number };
  }> {
    const cacheKey = 'yoy_budget';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const result = await RetryManager.withRetry(async () => {
        const { data, error } = await supabase
          .from('fact_yoy_budget')
          .select('*')
          .order('fiscal_year', { ascending: false })
          .order('quarter', { ascending: true });

        if (error) throw new Error(`Failed to fetch year-over-year budget: ${error.message}`);

        if (!data || data.length === 0) {
          throw new Error('No budget data available');
        }

        const currentYearData = data.filter(d => d.fiscal_year === data[0].fiscal_year);
        const lastYearData = data.filter(d => d.fiscal_year === data[0].fiscal_year - 1);

        const currentYearQuarters = currentYearData.map(d => ({
          quarter: d.quarter,
          budget: Number(d.budget_amount),
          actual: Number(d.actual_amount)
        }));

        const lastYearQuarters = lastYearData.map(d => ({
          quarter: d.quarter,
          budget: Number(d.budget_amount),
          actual: Number(d.actual_amount)
        }));

        const currentTotal = currentYearQuarters.reduce((sum, q) => sum + q.budget, 0);
        const lastTotal = lastYearQuarters.reduce((sum, q) => sum + q.budget, 0);

        const changeAmount = currentTotal - lastTotal;
        const changePercentage = lastTotal > 0 ? (changeAmount / lastTotal) * 100 : 0;

        return {
          lastYear: {
            year: data[0].fiscal_year - 1,
            total: lastTotal,
            quarters: lastYearQuarters
          },
          currentYear: {
            year: data[0].fiscal_year,
            total: currentTotal,
            quarters: currentYearQuarters
          },
          change: {
            amount: changeAmount,
            percentage: changePercentage
          }
        };
      });

      cache.set(cacheKey, result);
      return result;
    } catch (error: any) {
      console.error('Error fetching year-over-year budget:', error);
      throw new Error(`Unable to load year-over-year budget: ${error.message}`);
    }
  }
}

export default DPKService;
