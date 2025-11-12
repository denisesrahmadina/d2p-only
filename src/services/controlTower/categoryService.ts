import { supabase } from '../supabaseClient';
import type {
  CategorySummary,
  CategorySavingsDetail,
  CategorySourcingDetail,
  CategoryOTIFDetail,
  SavingsContractDetail,
  SourcingContractDetail,
  DeliveryRecord,
  SupplierOTIFSummary,
  MonthlyTrendData,
  PipelineContract,
  CategoryCode
} from '../../types/procurementCategories';

export class CategoryService {
  /**
   * Get summary metrics for all 6 main categories (A-F)
   */
  static async getAllCategoriesSummary(organizationId: string = 'ORG001'): Promise<CategorySummary[]> {
    const { data, error } = await supabase
      .from('v_category_performance_summary')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching category summary:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get detailed metrics for a specific category
   */
  static async getCategorySummary(categoryCode: CategoryCode, organizationId: string = 'ORG001'): Promise<CategorySummary | null> {
    const { data, error } = await supabase
      .from('v_category_performance_summary')
      .select('*')
      .eq('main_category_code', categoryCode)
      .maybeSingle();

    if (error) {
      console.error('Error fetching category summary:', error);
      throw error;
    }

    return data;
  }

  /**
   * PROCUREMENT SAVINGS METHODS
   */

  static async getSavingsByCategory(categoryCode: CategoryCode, organizationId: string = 'ORG001'): Promise<CategorySavingsDetail[]> {
    const { data, error } = await supabase
      .from('v_contracts_savings_by_category')
      .select('*')
      .eq('main_category_code', categoryCode)
      .order('subcategory_code');

    if (error) {
      console.error('Error fetching savings by category:', error);
      throw error;
    }

    return data || [];
  }

  static async getSavingsContractsByCategory(
    categoryCode: CategoryCode,
    organizationId: string = 'ORG001',
    limit?: number
  ): Promise<SavingsContractDetail[]> {
    let query = supabase
      .from('fact_procurement_savings_contract')
      .select(`
        contract_id,
        contract_name,
        supplier_name,
        category,
        business_unit,
        award_date,
        owner_estimate,
        final_contract_value,
        savings_amount,
        savings_percentage,
        main_category_code,
        subcategory_code,
        notes
      `)
      .eq('main_category_code', categoryCode)
      .eq('organization_id', organizationId)
      .eq('contract_status', 'Finalized')
      .not('main_category_code', 'is', null)
      .order('savings_amount', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching savings contracts:', error);
      return [];
    }

    return (data || []).map(contract => ({
      contract_id: contract.contract_id,
      contract_name: contract.contract_name,
      contract_description: contract.notes || '',
      supplier_name: contract.supplier_name,
      contract_value: contract.final_contract_value || 0,
      main_category_code: contract.main_category_code || categoryCode,
      main_category_name_id: '',
      subcategory_code: contract.subcategory_code || `${categoryCode}-01`,
      subcategory_name_id: '',
      planned_award_date: null,
      actual_award_date: contract.award_date,
      planned_savings: (contract.owner_estimate || 0) - (contract.final_contract_value || 0),
      actual_savings: contract.savings_amount || 0,
      savings_percentage: contract.savings_percentage || 0,
      owner_estimate: contract.owner_estimate || 0,
      business_unit: contract.business_unit || ''
    }));
  }

  static async getSavingsTrendByCategory(
    categoryCode: CategoryCode,
    organizationId: string = 'ORG001',
    year: number = 2025
  ): Promise<MonthlyTrendData[]> {
    const { data, error } = await supabase
      .from('fact_procurement_savings_monthly')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('year', year)
      .eq('main_category_code', categoryCode)
      .order('month', { ascending: true });

    if (error) {
      console.error('Error fetching savings trend:', error);
      throw error;
    }

    return (data || []).map(m => ({
      year: m.year,
      month: m.month,
      month_name: m.month_name,
      actual_value: m.actual_savings || 0,
      planned_value: m.monthly_planned_savings || 0,
      main_category_code: categoryCode
    }));
  }

  static async getPipelineContractsByCategory(
    categoryCode: CategoryCode,
    organizationId: string = 'ORG001'
  ): Promise<PipelineContract[]> {
    const { data, error } = await supabase
      .from('ref_procurement_savings_pipeline')
      .select('*')
      .eq('organization_id', organizationId)
      .order('expected_award_date');

    if (error) {
      console.error('Error fetching pipeline contracts:', error);
      return [];
    }

    // TODO: Add main_category_code to pipeline table
    // For now, return all and filter client-side if needed
    return (data || []).map(contract => ({
      contract_reference: contract.contract_reference,
      contract_name: contract.contract_name,
      contract_description: contract.notes || '',
      main_category_code: categoryCode,
      estimated_value: contract.estimated_value,
      pipeline_status: contract.pipeline_status,
      expected_award_date: contract.expected_award_date,
      current_process_step: contract.pipeline_status,
      projected_savings: contract.projected_savings,
      probability_percentage: contract.probability_percentage
    }));
  }

  /**
   * SOURCING SPEED METHODS
   */

  static async getSourcingSpeedByCategory(categoryCode: CategoryCode): Promise<CategorySourcingDetail[]> {
    const { data, error } = await supabase
      .from('v_contracts_sourcing_by_category')
      .select('*')
      .eq('main_category_code', categoryCode)
      .order('subcategory_code');

    if (error) {
      console.error('Error fetching sourcing speed by category:', error);
      throw error;
    }

    return data || [];
  }

  static async getSourcingContractsByCategory(
    categoryCode: CategoryCode,
    limit?: number
  ): Promise<SourcingContractDetail[]> {
    let query = supabase
      .from('procurement_sourcing_contracts')
      .select(`
        contract_number,
        contract_name,
        contract_description,
        vendor_name,
        value_usd,
        sourcing_duration_days,
        request_date,
        contract_signed_date,
        status,
        current_process,
        main_category_code,
        subcategory_code
      `)
      .eq('main_category_code', categoryCode)
      .eq('status', 'Completed')
      .not('main_category_code', 'is', null)
      .order('sourcing_duration_days', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching sourcing contracts:', error);
      return [];
    }

    // Get target days for this category
    const { data: categoryData } = await supabase
      .from('ref_procurement_categories')
      .select('target_sourcing_days')
      .eq('main_category_code', categoryCode)
      .maybeSingle();

    const targetDays = categoryData?.target_sourcing_days || 60;

    return (data || []).map(contract => ({
      contract_id: contract.contract_number,
      contract_name: contract.contract_name,
      contract_description: contract.contract_description || '',
      supplier_name: contract.vendor_name || '',
      contract_value: (contract.value_usd || 0) * 15000,
      main_category_code: contract.main_category_code || categoryCode,
      main_category_name_id: '',
      subcategory_code: contract.subcategory_code || `${categoryCode}-01`,
      subcategory_name_id: '',
      sourcing_speed: contract.sourcing_duration_days || 0,
      request_date: contract.request_date,
      award_date: contract.contract_signed_date,
      status: contract.status,
      current_process_step: contract.current_process || '',
      expected_completion_date: null,
      target_sourcing_days: targetDays,
      variance_from_target: (contract.sourcing_duration_days || 0) - targetDays
    }));
  }

  static async getInProgressContractsByCategory(
    categoryCode: CategoryCode
  ): Promise<SourcingContractDetail[]> {
    const { data, error } = await supabase
      .from('procurement_sourcing_contracts')
      .select('*')
      .eq('main_category_code', categoryCode)
      .eq('status', 'In Progress')
      .order('request_date', { ascending: false });

    if (error) {
      console.error('Error fetching in-progress contracts:', error);
      return [];
    }

    const { data: categoryData } = await supabase
      .from('ref_procurement_categories')
      .select('target_sourcing_days')
      .eq('main_category_code', categoryCode)
      .maybeSingle();

    const targetDays = categoryData?.target_sourcing_days || 60;

    return (data || []).map(contract => {
      const daysSoFar = Math.floor(
        (new Date().getTime() - new Date(contract.request_date).getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        contract_id: contract.contract_number,
        contract_name: contract.contract_name,
        contract_description: contract.contract_description || '',
        supplier_name: contract.vendor_name,
        contract_value: contract.value_usd * 15000,
        main_category_code: contract.main_category_code,
        main_category_name_id: '',
        subcategory_code: contract.subcategory_code || '',
        subcategory_name_id: '',
        sourcing_speed: daysSoFar,
        request_date: contract.request_date,
        award_date: null,
        status: contract.status,
        current_process_step: contract.current_process,
        expected_completion_date: new Date(
          new Date(contract.request_date).getTime() + targetDays * 24 * 60 * 60 * 1000
        ).toISOString().split('T')[0],
        target_sourcing_days: targetDays,
        variance_from_target: daysSoFar - targetDays
      };
    });
  }

  /**
   * OTIF METHODS
   */

  static async getOTIFByCategory(categoryCode: CategoryCode): Promise<CategoryOTIFDetail[]> {
    const { data, error } = await supabase
      .from('v_supplier_otif_by_category')
      .select('*')
      .eq('main_category_code', categoryCode)
      .order('subcategory_code');

    if (error) {
      console.error('Error fetching OTIF by category:', error);
      throw error;
    }

    return data || [];
  }

  static async getTopSuppliersByCategory(
    categoryCode: CategoryCode,
    limit: number = 5
  ): Promise<SupplierOTIFSummary[]> {
    const { data, error } = await supabase
      .rpc('get_top_suppliers_by_category', {
        p_category_code: categoryCode,
        p_limit: limit
      });

    if (error) {
      // If RPC doesn't exist, fall back to manual query
      return this.getSuppliersByCategory(categoryCode, 'top', limit);
    }

    return data || [];
  }

  static async getBottomSuppliersByCategory(
    categoryCode: CategoryCode,
    limit: number = 5
  ): Promise<SupplierOTIFSummary[]> {
    return this.getSuppliersByCategory(categoryCode, 'bottom', limit);
  }

  /**
   * Get top suppliers globally across all categories or filtered by category
   */
  static async getTopSuppliersGlobal(
    categoryCode?: CategoryCode | null,
    limit: number = 10
  ): Promise<any[]> {
    const { data, error } = await supabase
      .rpc('get_top_suppliers_global', {
        p_category_code: categoryCode || null,
        p_limit: limit
      });

    if (error) {
      console.error('Error fetching top suppliers globally:', error);
      return [];
    }

    const suppliers = (data || []).map(supplier => ({
      supplier_id: supplier.supplier_id,
      supplier_name: supplier.supplier_name,
      main_category_code: supplier.main_category_codes?.[0] || 'A',
      contract_count: supplier.total_contracts,
      delivery_count: supplier.total_deliveries,
      otif_percentage: parseFloat(supplier.otif_percentage),
      on_time_percentage: parseFloat(supplier.on_time_percentage),
      in_full_percentage: parseFloat(supplier.in_full_percentage),
      avg_delay_days: supplier.avg_delay_days ? parseFloat(supplier.avg_delay_days) : null,
      total_contract_value: parseFloat(supplier.total_contract_value),
      supplier_tier: supplier.supplier_tier,
      latest_delivery_date: supplier.latest_delivery_date
    }));

    const supplierNames = suppliers.map(s => s.supplier_name);
    if (supplierNames.length === 0) return suppliers;

    const { data: contractData } = await supabase
      .from('supplier_otif_deliveries')
      .select('supplier_name, purchase_order_id')
      .in('supplier_name', supplierNames)
      .order('purchase_order_id');

    const contractsBySupplier: Record<string, string[]> = {};
    (contractData || []).forEach(record => {
      if (!contractsBySupplier[record.supplier_name]) {
        contractsBySupplier[record.supplier_name] = [];
      }
      if (!contractsBySupplier[record.supplier_name].includes(record.purchase_order_id)) {
        contractsBySupplier[record.supplier_name].push(record.purchase_order_id);
      }
    });

    return suppliers.map(supplier => ({
      ...supplier,
      contract_list: contractsBySupplier[supplier.supplier_name] || []
    }));
  }

  private static async getSuppliersByCategory(
    categoryCode: CategoryCode,
    type: 'top' | 'bottom',
    limit: number
  ): Promise<SupplierOTIFSummary[]> {
    const { data: deliveries, error } = await supabase
      .from('supplier_otif_deliveries')
      .select('*')
      .eq('main_category_code', categoryCode)
      .eq('delivery_status', 'delivered')
      .not('main_category_code', 'is', null);

    if (error) {
      console.error('Error fetching supplier deliveries:', error);
      return [];
    }

    // Group by supplier
    const supplierMap = new Map<string, {
      deliveries: number;
      otif: number;
      onTime: number;
      inFull: number;
      totalValue: number;
      latestDate: string;
      delays: number[];
    }>();

    (deliveries || []).forEach(delivery => {
      if (!supplierMap.has(delivery.supplier_name)) {
        supplierMap.set(delivery.supplier_name, {
          deliveries: 0,
          otif: 0,
          onTime: 0,
          inFull: 0,
          totalValue: 0,
          latestDate: delivery.order_date,
          delays: []
        });
      }

      const supplier = supplierMap.get(delivery.supplier_name)!;
      supplier.deliveries += 1;
      if (delivery.is_otif) supplier.otif += 1;
      if (delivery.is_on_time) supplier.onTime += 1;
      if (delivery.is_in_full) supplier.inFull += 1;
      supplier.totalValue += delivery.contract_value || 0;
      if (delivery.delay_days) supplier.delays.push(delivery.delay_days);
      if (new Date(delivery.order_date) > new Date(supplier.latestDate)) {
        supplier.latestDate = delivery.order_date;
      }
    });

    // Convert to array and calculate percentages
    const suppliers = Array.from(supplierMap.entries()).map(([name, stats]) => ({
      supplier_id: 'SUPP-' + name.substring(3, 10),
      supplier_name: name,
      main_category_code: categoryCode,
      contract_count: stats.deliveries,
      delivery_count: stats.deliveries,
      otif_percentage: (stats.otif / stats.deliveries) * 100,
      on_time_percentage: (stats.onTime / stats.deliveries) * 100,
      in_full_percentage: (stats.inFull / stats.deliveries) * 100,
      avg_delay_days: stats.delays.length > 0
        ? stats.delays.reduce((a, b) => a + b, 0) / stats.delays.length
        : null,
      total_contract_value: stats.totalValue,
      supplier_tier: stats.otif / stats.deliveries >= 0.95 ? 'strategic' :
                     stats.otif / stats.deliveries >= 0.85 ? 'preferred' : 'standard',
      latest_delivery_date: stats.latestDate
    }));

    // Sort and limit
    suppliers.sort((a, b) =>
      type === 'top'
        ? b.otif_percentage - a.otif_percentage
        : a.otif_percentage - b.otif_percentage
    );

    return suppliers.slice(0, limit);
  }

  static async getDeliveryRecordsByCategory(
    categoryCode: CategoryCode,
    limit?: number
  ): Promise<DeliveryRecord[]> {
    let query = supabase
      .from('supplier_otif_deliveries')
      .select('*')
      .eq('main_category_code', categoryCode)
      .eq('delivery_status', 'delivered')
      .not('main_category_code', 'is', null)
      .order('order_date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching delivery records:', error);
      return [];
    }

    return (data || []).map(delivery => ({
      delivery_id: delivery.id,
      contract_id: delivery.contract_id || '',
      contract_name: delivery.contract_name || '',
      contract_description: delivery.contract_description || '',
      supplier_name: delivery.supplier_name,
      contract_value: delivery.contract_value || 0,
      main_category_code: delivery.main_category_code,
      main_category_name_id: '',
      subcategory_code: '',
      subcategory_name_id: '',
      purchase_order_id: delivery.purchase_order_id,
      delivery_count: 1,
      otif_tag: delivery.is_otif,
      on_time_tag: delivery.is_on_time,
      in_full_tag: delivery.is_in_full,
      delivery_date: delivery.actual_delivery_date,
      expected_date: delivery.expected_delivery_date,
      delay_days: delivery.delay_days,
      quantity_ordered: delivery.quantity_ordered,
      quantity_delivered: delivery.quantity_delivered,
      quantity_shortage: delivery.quantity_shortage,
      delivery_status: delivery.delivery_status,
      failure_reason: delivery.failure_reason
    }));
  }

  /**
   * UTILITY METHODS
   */

  static formatCurrency(value: number): string {
    if (value >= 1000000000000) {
      return `Rp ${(value / 1000000000000).toFixed(2)}T`;
    } else if (value >= 1000000000) {
      return `Rp ${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(2)}M`;
    }
    return `Rp ${value.toLocaleString('id-ID')}`;
  }

  static formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`.replace('.', ',');
  }

  static formatDate(dateString: string): string {
    const monthsId = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const date = new Date(dateString);
    return `${date.getDate()} ${monthsId[date.getMonth()]} ${date.getFullYear()}`;
  }

  static getPerformanceColor(actual: number, target: number, higherIsBetter: boolean = true): string {
    const ratio = actual / target;

    if (higherIsBetter) {
      if (ratio >= 1.0) return 'text-green-600 dark:text-green-400';
      if (ratio >= 0.9) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-red-600 dark:text-red-400';
    } else {
      if (ratio <= 1.0) return 'text-green-600 dark:text-green-400';
      if (ratio <= 1.1) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-red-600 dark:text-red-400';
    }
  }

  static getPerformanceStatus(actual: number, target: number, higherIsBetter: boolean = true): string {
    const ratio = actual / target;

    if (higherIsBetter) {
      if (ratio >= 1.0) return 'On Target';
      if (ratio >= 0.9) return 'Near Target';
      return 'Below Target';
    } else {
      if (ratio <= 1.0) return 'On Target';
      if (ratio <= 1.1) return 'Near Target';
      return 'Below Target';
    }
  }
}
