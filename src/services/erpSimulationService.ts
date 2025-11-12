import { supabase } from './supabaseClient';

export interface GRPayload {
  ba_id: number;
  ba_number: string;
  po_number: string;
  vendor_id: string;
  material_items: {
    material_id?: string;
    material_description: string;
    quantity: number;
    unit_of_measure?: string;
    unit_price?: number;
  }[];
  delivery_date: string;
  delivery_location: string;
  gr_type: 'GOODS_RECEIPT' | 'SERVICE_ENTRY';
  created_by: string;
}

export interface GRResult {
  success: boolean;
  gr_number?: string;
  erp_document_number?: string;
  message: string;
  error_code?: string;
  error_details?: any;
  processing_time_ms: number;
}

export class ERPSimulationService {
  private static simulateNetworkDelay(minMs: number = 1500, maxMs: number = 3500): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private static generateGRNumber(): string {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    return `GR${year}${randomNum}`;
  }

  private static generateERPDocNumber(): string {
    const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
    return `${randomNum}`;
  }

  private static shouldSimulateFailure(): boolean {
    return Math.random() < 0.15;
  }

  static async createGoodsReceipt(payload: GRPayload): Promise<GRResult> {
    const startTime = Date.now();

    try {
      await ERPSimulationService.simulateNetworkDelay();

      const shouldFail = ERPSimulationService.shouldSimulateFailure();

      if (shouldFail) {
        const errorScenarios = [
          {
            error_code: 'ERP_CONN_TIMEOUT',
            message: 'Connection to ERP system timed out. Please retry.',
          },
          {
            error_code: 'INVALID_PO_NUMBER',
            message: 'PO number not found in ERP system. Please verify.',
          },
          {
            error_code: 'QUANTITY_MISMATCH',
            message: 'Quantity exceeds PO limits in ERP.',
          },
          {
            error_code: 'VENDOR_BLOCKED',
            message: 'Vendor is blocked in ERP system.',
          },
        ];

        const errorScenario = errorScenarios[Math.floor(Math.random() * errorScenarios.length)];

        await supabase.from('fact_ba_erp_integration_log').insert({
          ba_id: payload.ba_id,
          integration_type: 'GR_CREATION',
          integration_direction: 'OUTBOUND',
          request_payload: payload,
          request_timestamp: new Date().toISOString(),
          request_url: '/api/sap/goods-receipt',
          request_method: 'POST',
          response_payload: errorScenario,
          response_timestamp: new Date().toISOString(),
          response_status_code: 400,
          response_message: errorScenario.message,
          integration_status: 'FAILED',
          retry_count: 0,
          max_retry: 3,
          error_code: errorScenario.error_code,
          error_message: errorScenario.message,
        });

        return {
          success: false,
          message: errorScenario.message,
          error_code: errorScenario.error_code,
          error_details: errorScenario,
          processing_time_ms: Date.now() - startTime,
        };
      }

      const grNumber = ERPSimulationService.generateGRNumber();
      const erpDocNumber = ERPSimulationService.generateERPDocNumber();

      const responsePayload = {
        gr_number: grNumber,
        erp_document_number: erpDocNumber,
        posting_date: new Date().toISOString(),
        status: 'POSTED',
        total_quantity: payload.material_items.reduce((sum, item) => sum + item.quantity, 0),
        items_count: payload.material_items.length,
      };

      await supabase.from('fact_ba_erp_integration_log').insert({
        ba_id: payload.ba_id,
        integration_type: 'GR_CREATION',
        integration_direction: 'OUTBOUND',
        request_payload: payload,
        request_timestamp: new Date().toISOString(),
        request_url: '/api/sap/goods-receipt',
        request_method: 'POST',
        response_payload: responsePayload,
        response_timestamp: new Date().toISOString(),
        response_status_code: 200,
        response_message: 'Goods Receipt created successfully',
        integration_status: 'SUCCESS',
        retry_count: 0,
        gr_number: grNumber,
        erp_document_number: erpDocNumber,
      });

      await supabase
        .from('dim_ba_master')
        .update({
          gr_number: grNumber,
          gr_creation_status: 'SUCCESS',
          gr_created_date: new Date().toISOString(),
        })
        .eq('ba_id', payload.ba_id);

      return {
        success: true,
        gr_number: grNumber,
        erp_document_number: erpDocNumber,
        message: 'Goods Receipt created successfully in ERP',
        processing_time_ms: Date.now() - startTime,
      };
    } catch (error) {
      console.error('Error in GR simulation:', error);

      await supabase.from('fact_ba_erp_integration_log').insert({
        ba_id: payload.ba_id,
        integration_type: 'GR_CREATION',
        integration_direction: 'OUTBOUND',
        request_payload: payload,
        request_timestamp: new Date().toISOString(),
        integration_status: 'FAILED',
        retry_count: 0,
        error_code: 'SYSTEM_ERROR',
        error_message: 'Unexpected error during GR creation',
        error_details: { error: String(error) },
      });

      return {
        success: false,
        message: 'Unexpected error during GR creation',
        error_code: 'SYSTEM_ERROR',
        error_details: { error: String(error) },
        processing_time_ms: Date.now() - startTime,
      };
    }
  }

  static async retryFailedGR(baId: number): Promise<GRResult> {
    try {
      const { data: ba } = await supabase
        .from('dim_ba_master')
        .select('*, serah_terima_details:fact_ba_serah_terima_detail(*)')
        .eq('ba_id', baId)
        .single();

      if (!ba) {
        return {
          success: false,
          message: 'BA not found',
          error_code: 'BA_NOT_FOUND',
          processing_time_ms: 0,
        };
      }

      const payload: GRPayload = {
        ba_id: baId,
        ba_number: ba.ba_number,
        po_number: ba.po_number,
        vendor_id: ba.vendor_id,
        material_items: (ba.serah_terima_details || []).map((detail: any) => ({
          material_id: detail.material_id,
          material_description: detail.material_description,
          quantity: detail.qty_this_handover,
          unit_of_measure: detail.unit_of_measure,
        })),
        delivery_date: ba.created_date,
        delivery_location: ba.delivery_location || 'Default Location',
        gr_type: 'GOODS_RECEIPT',
        created_by: ba.created_by,
      };

      const { data: lastLog } = await supabase
        .from('fact_ba_erp_integration_log')
        .select('retry_count')
        .eq('ba_id', baId)
        .order('created_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      const retryCount = (lastLog?.retry_count || 0) + 1;

      if (retryCount > 3) {
        return {
          success: false,
          message: 'Maximum retry attempts exceeded',
          error_code: 'MAX_RETRY_EXCEEDED',
          processing_time_ms: 0,
        };
      }

      return await ERPSimulationService.createGoodsReceipt(payload);
    } catch (error) {
      console.error('Error retrying GR:', error);
      return {
        success: false,
        message: 'Error retrying GR creation',
        error_code: 'RETRY_ERROR',
        processing_time_ms: 0,
      };
    }
  }

  static async getIntegrationLogs(baId: number) {
    try {
      const { data, error } = await supabase
        .from('fact_ba_erp_integration_log')
        .select('*')
        .eq('ba_id', baId)
        .order('created_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching integration logs:', error);
      return [];
    }
  }

  static async getERPConnectionStatus(): Promise<{
    status: 'connected' | 'disconnected' | 'degraded';
    latency_ms?: number;
    message: string;
  }> {
    const startTime = Date.now();

    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    const latency = Date.now() - startTime;
    const statusOptions = [
      { status: 'connected' as const, weight: 0.85 },
      { status: 'degraded' as const, weight: 0.1 },
      { status: 'disconnected' as const, weight: 0.05 },
    ];

    const random = Math.random();
    let cumulative = 0;
    let selectedStatus: 'connected' | 'disconnected' | 'degraded' = 'connected';

    for (const option of statusOptions) {
      cumulative += option.weight;
      if (random <= cumulative) {
        selectedStatus = option.status;
        break;
      }
    }

    const messages = {
      connected: 'ERP connection is healthy',
      degraded: 'ERP connection is experiencing delays',
      disconnected: 'Unable to connect to ERP system',
    };

    return {
      status: selectedStatus,
      latency_ms: latency,
      message: messages[selectedStatus],
    };
  }
}
