import { supabase } from '../supabaseClient';

export interface ExtractionFilters {
  timeline_start?: string;
  timeline_end?: string;
  vendor_id?: string;
  contract_id?: string;
  storage_location_id?: string;
  material_id?: string;
  status?: string;
  movement_type?: string;
  initiative_category?: string;
  priority?: string;
}

export interface PurchaseOrderExtractionData {
  po_number: string;
  po_line_item: number;
  vendor_name: string;
  contract_number?: string;
  material_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  delivery_date: string;
  po_status: string;
  created_date: string;
}

export interface GoodsReceiptExtractionData {
  gr_number: string;
  gr_line_item: number;
  po_reference: string;
  vendor_name: string;
  material_name: string;
  storage_location: string;
  quantity_received: number;
  uom: string;
  receipt_date: string;
  quality_status: string;
}

export interface GoodsIssuanceExtractionData {
  gi_number: string;
  gi_line_item: number;
  material_name: string;
  storage_location: string;
  quantity_issued: number;
  uom: string;
  movement_type: string;
  issuance_date: string;
  cost_center?: string;
  project_code?: string;
}

export class KPIDataExtractionService {
  static async extractPurchaseOrderData(
    filters: ExtractionFilters = {}
  ): Promise<PurchaseOrderExtractionData[]> {
    let query = supabase
      .from('fact_purchase_order')
      .select(`
        po_number,
        po_line_item,
        quantity,
        unit_price,
        total_amount,
        delivery_date,
        po_status,
        created_date,
        dim_vendor!inner(vendor_name),
        dim_material!inner(material_name),
        dim_contract(contract_number)
      `);

    if (filters.timeline_start) {
      query = query.gte('created_date', filters.timeline_start);
    }
    if (filters.timeline_end) {
      query = query.lte('created_date', filters.timeline_end);
    }
    if (filters.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters.contract_id) {
      query = query.eq('contract_id', filters.contract_id);
    }
    if (filters.status) {
      query = query.eq('po_status', filters.status);
    }

    const { data, error } = await query.order('created_date', { ascending: false });

    if (error) {
      console.error('Error extracting purchase order data:', error);
      throw error;
    }

    return (data || []).map((item: any) => ({
      po_number: item.po_number,
      po_line_item: item.po_line_item,
      vendor_name: item.dim_vendor?.vendor_name || 'N/A',
      contract_number: item.dim_contract?.contract_number || 'N/A',
      material_name: item.dim_material?.material_name || 'N/A',
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_amount: item.total_amount,
      delivery_date: item.delivery_date,
      po_status: item.po_status,
      created_date: item.created_date
    }));
  }

  static async extractGoodsReceiptData(
    filters: ExtractionFilters = {}
  ): Promise<GoodsReceiptExtractionData[]> {
    let query = supabase
      .from('fact_goods_receipt')
      .select(`
        gr_number,
        gr_line_item,
        po_reference,
        quantity_received,
        uom,
        receipt_date,
        quality_status,
        dim_vendor!inner(vendor_name),
        dim_material!inner(material_name),
        dim_storage_location!inner(storage_location_name)
      `);

    if (filters.timeline_start) {
      query = query.gte('receipt_date', filters.timeline_start);
    }
    if (filters.timeline_end) {
      query = query.lte('receipt_date', filters.timeline_end);
    }
    if (filters.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters.storage_location_id) {
      query = query.eq('storage_location_id', filters.storage_location_id);
    }
    if (filters.material_id) {
      query = query.eq('material_id', filters.material_id);
    }

    const { data, error } = await query.order('receipt_date', { ascending: false });

    if (error) {
      console.error('Error extracting goods receipt data:', error);
      throw error;
    }

    return (data || []).map((item: any) => ({
      gr_number: item.gr_number,
      gr_line_item: item.gr_line_item,
      po_reference: item.po_reference,
      vendor_name: item.dim_vendor?.vendor_name || 'N/A',
      material_name: item.dim_material?.material_name || 'N/A',
      storage_location: item.dim_storage_location?.storage_location_name || 'N/A',
      quantity_received: item.quantity_received,
      uom: item.uom,
      receipt_date: item.receipt_date,
      quality_status: item.quality_status
    }));
  }

  static async extractGoodsIssuanceData(
    filters: ExtractionFilters = {}
  ): Promise<GoodsIssuanceExtractionData[]> {
    let query = supabase
      .from('fact_goods_issuance')
      .select(`
        gi_number,
        gi_line_item,
        quantity_issued,
        uom,
        movement_type,
        issuance_date,
        cost_center,
        project_code,
        dim_material!inner(material_name),
        dim_storage_location!inner(storage_location_name)
      `);

    if (filters.timeline_start) {
      query = query.gte('issuance_date', filters.timeline_start);
    }
    if (filters.timeline_end) {
      query = query.lte('issuance_date', filters.timeline_end);
    }
    if (filters.storage_location_id) {
      query = query.eq('storage_location_id', filters.storage_location_id);
    }
    if (filters.material_id) {
      query = query.eq('material_id', filters.material_id);
    }
    if (filters.movement_type) {
      query = query.eq('movement_type', filters.movement_type);
    }

    const { data, error } = await query.order('issuance_date', { ascending: false });

    if (error) {
      console.error('Error extracting goods issuance data:', error);
      throw error;
    }

    return (data || []).map((item: any) => ({
      gi_number: item.gi_number,
      gi_line_item: item.gi_line_item,
      material_name: item.dim_material?.material_name || 'N/A',
      storage_location: item.dim_storage_location?.storage_location_name || 'N/A',
      quantity_issued: item.quantity_issued,
      uom: item.uom,
      movement_type: item.movement_type,
      issuance_date: item.issuance_date,
      cost_center: item.cost_center || 'N/A',
      project_code: item.project_code || 'N/A'
    }));
  }

  static async extractStrategicInitiativesData(filters: ExtractionFilters = {}) {
    let query = supabase
      .from('ref_strategic_initiative')
      .select('*');

    if (filters.initiative_category) {
      query = query.eq('initiative_category', filters.initiative_category);
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters.status) {
      query = query.eq('initiatives_status', filters.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error extracting strategic initiatives data:', error);
      throw error;
    }

    return data || [];
  }

  static async extractAllProcurementData(filters: ExtractionFilters = {}) {
    const [purchaseOrders, goodsReceipts, goodsIssuances] = await Promise.all([
      this.extractPurchaseOrderData(filters),
      this.extractGoodsReceiptData(filters),
      this.extractGoodsIssuanceData(filters)
    ]);

    return {
      purchaseOrders,
      goodsReceipts,
      goodsIssuances
    };
  }

  // ==================== KPI Auto-Extraction Functions ====================

  /**
   * Get all KPI data mappings
   */
  static async getKPIDataMappings(filters?: {
    is_active?: boolean;
    kpi_code?: string;
  }): Promise<any[]> {
    try {
      let query = supabase
        .from('kpi_data_mapping')
        .select('*')
        .order('kpi_code');

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      if (filters?.kpi_code) {
        query = query.eq('kpi_code', filters.kpi_code);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching KPI data mappings:', error);
      return [];
    }
  }

  /**
   * Get extraction logs with optional filtering
   */
  static async getExtractionLogs(filters?: {
    kpi_code?: string;
    extraction_type?: string;
    extraction_status?: string;
    limit?: number;
  }): Promise<any[]> {
    try {
      let query = supabase
        .from('kpi_extraction_log')
        .select('*')
        .order('extracted_at', { ascending: false });

      if (filters?.kpi_code) {
        query = query.eq('kpi_code', filters.kpi_code);
      }

      if (filters?.extraction_type) {
        query = query.eq('extraction_type', filters.extraction_type);
      }

      if (filters?.extraction_status) {
        query = query.eq('extraction_status', filters.extraction_status);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching extraction logs:', error);
      return [];
    }
  }

  /**
   * Execute automatic extraction for all mapped KPIs
   */
  static async extractAllKPIs(): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('fn_extract_procurement_kpis');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error executing automatic KPI extraction:', error);
      throw error;
    }
  }

  /**
   * Execute manual extraction for specific KPI
   */
  static async extractKPI(kpiCode: string): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('fn_manual_extract_kpi', {
        p_kpi_code: kpiCode
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error executing manual KPI extraction:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Extraction failed'
      };
    }
  }

  /**
   * Get extraction statistics summary
   */
  static async getExtractionStats(): Promise<{
    total_extractions: number;
    successful_extractions: number;
    failed_extractions: number;
    last_extraction_time?: string;
    avg_execution_time_ms?: number;
  }> {
    try {
      const logs = await this.getExtractionLogs({ limit: 1000 });

      const total = logs.length;
      const successful = logs.filter((l: any) => l.extraction_status === 'Success').length;
      const failed = logs.filter((l: any) => l.extraction_status === 'Failed').length;
      const lastExtraction = logs[0]?.extracted_at;

      const executionTimes = logs
        .filter((l: any) => l.execution_time_ms)
        .map((l: any) => l.execution_time_ms);

      const avgExecutionTime = executionTimes.length > 0
        ? Math.round(executionTimes.reduce((a: number, b: number) => a + b, 0) / executionTimes.length)
        : undefined;

      return {
        total_extractions: total,
        successful_extractions: successful,
        failed_extractions: failed,
        last_extraction_time: lastExtraction,
        avg_execution_time_ms: avgExecutionTime
      };
    } catch (error) {
      console.error('Error getting extraction stats:', error);
      return {
        total_extractions: 0,
        successful_extractions: 0,
        failed_extractions: 0
      };
    }
  }

  /**
   * Get extraction history for specific KPI
   */
  static async getKPIExtractionHistory(kpiCode: string, limit: number = 30): Promise<any[]> {
    return this.getExtractionLogs({
      kpi_code: kpiCode,
      limit
    });
  }

  /**
   * Get next scheduled extraction times
   */
  static async getScheduledExtractions(): Promise<{
    kpi_code: string;
    kpi_name?: string;
    next_extraction_at: string;
    extraction_frequency: string;
  }[]> {
    try {
      const { data, error } = await supabase
        .from('kpi_data_mapping')
        .select(`
          kpi_code,
          next_extraction_at,
          extraction_frequency,
          ref_kpi!inner(kpi_name)
        `)
        .eq('is_active', true)
        .not('next_extraction_at', 'is', null)
        .order('next_extraction_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(item => ({
        kpi_code: item.kpi_code,
        kpi_name: (item.ref_kpi as any)?.kpi_name,
        next_extraction_at: item.next_extraction_at!,
        extraction_frequency: item.extraction_frequency
      }));
    } catch (error) {
      console.error('Error fetching scheduled extractions:', error);
      return [];
    }
  }

  /**
   * Get failed extractions that need attention
   */
  static async getFailedExtractions(limit: number = 10): Promise<any[]> {
    return this.getExtractionLogs({
      extraction_status: 'Failed',
      limit
    });
  }
}
