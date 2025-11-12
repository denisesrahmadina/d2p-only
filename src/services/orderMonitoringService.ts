import { supabase } from './supabaseClient';

export interface TimelineStage {
  stage_id: number;
  stage_code: string;
  stage_name: string;
  stage_description: string;
  stage_order: number;
  stage_category: string;
  sla_hours?: number;
  icon_name: string;
  color_scheme: string;
}

export interface OrderStatusHistory {
  history_id?: number;
  po_number: string;
  po_line_id?: number;
  contract_id?: string;
  vendor_id?: string;
  previous_stage_code?: string;
  current_stage_code: string;
  status_changed_at: string;
  time_in_previous_stage_hours?: number;
  changed_by_user_id?: string;
  changed_by_name: string;
  change_source: 'MANUAL' | 'BA_WORKFLOW' | 'ERP_SYNC' | 'SYSTEM';
  ba_id?: number;
  ba_number?: string;
  ba_type?: string;
  is_on_time?: boolean;
  delay_hours?: number;
  delay_reason?: string;
  notes?: string;
}

export interface OrderMilestone {
  milestone_id?: number;
  po_number: string;
  po_line_id?: number;
  stage_code: string;
  milestone_name: string;
  planned_date?: string;
  actual_date?: string;
  completed_at?: string;
  milestone_status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'SKIPPED';
  is_on_schedule?: boolean;
  days_early_late?: number;
  completed_by_user_id?: string;
  completed_by_name?: string;
  completion_notes?: string;
  ba_id?: number;
}

export interface OrderTimelineView {
  po_number: string;
  current_stage: TimelineStage;
  all_stages: TimelineStage[];
  completed_stages: TimelineStage[];
  milestones: OrderMilestone[];
  status_history: OrderStatusHistory[];
  overall_progress_percent: number;
  is_on_schedule: boolean;
  total_days_elapsed: number;
}

export class OrderMonitoringService {
  static async getAllTimelineStages(): Promise<TimelineStage[]> {
    try {
      const { data, error } = await supabase
        .from('dim_order_monitoring_timeline')
        .select('*')
        .eq('is_active', true)
        .order('stage_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching timeline stages:', error);
      return [];
    }
  }

  static async updateOrderStatus(
    poNumber: string,
    newStageCode: string,
    options: {
      changedBy: string;
      changeSource: 'MANUAL' | 'BA_WORKFLOW' | 'ERP_SYNC' | 'SYSTEM';
      baId?: number;
      baNumber?: string;
      baType?: string;
      notes?: string;
      vendorId?: string;
      contractId?: string;
    }
  ): Promise<boolean> {
    try {
      const { data: currentStatus } = await supabase
        .from('fact_order_status_history')
        .select('current_stage_code')
        .eq('po_number', poNumber)
        .order('status_changed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const previousStageCode = currentStatus?.current_stage_code;

      const { error } = await supabase.from('fact_order_status_history').insert({
        po_number: poNumber,
        contract_id: options.contractId,
        vendor_id: options.vendorId,
        previous_stage_code: previousStageCode,
        current_stage_code: newStageCode,
        status_changed_at: new Date().toISOString(),
        changed_by_name: options.changedBy,
        change_source: options.changeSource,
        ba_id: options.baId,
        ba_number: options.baNumber,
        ba_type: options.baType,
        notes: options.notes,
        is_on_time: true,
      });

      if (error) throw error;

      if (options.baId) {
        await supabase.from('fact_ba_order_monitoring_sync').insert({
          ba_id: options.baId,
          po_number: poNumber,
          previous_status: previousStageCode,
          new_status: newStageCode,
          timeline_stage: newStageCode,
          sync_status: 'SYNCED',
          sync_timestamp: new Date().toISOString(),
        });

        await supabase
          .from('dim_ba_master')
          .update({
            order_monitoring_sync_status: 'SYNCED',
            order_monitoring_synced_date: new Date().toISOString(),
          })
          .eq('ba_id', options.baId);
      }

      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  static async getOrderTimeline(poNumber: string): Promise<OrderTimelineView | null> {
    try {
      const allStages = await this.getAllTimelineStages();

      const { data: statusHistory } = await supabase
        .from('fact_order_status_history')
        .select('*')
        .eq('po_number', poNumber)
        .order('status_changed_at', { ascending: false });

      const { data: milestones } = await supabase
        .from('fact_order_milestones')
        .select('*')
        .eq('po_number', poNumber)
        .order('stage_code');

      const currentStageCode = statusHistory?.[0]?.current_stage_code || 'ORDER_CREATED';
      const currentStage = allStages.find(s => s.stage_code === currentStageCode) || allStages[0];

      const completedStageCodes = new Set(
        (milestones || [])
          .filter(m => m.milestone_status === 'COMPLETED')
          .map(m => m.stage_code)
      );

      const completedStages = allStages.filter(s => completedStageCodes.has(s.stage_code));

      const overallProgress = (completedStages.length / allStages.length) * 100;

      const firstStatus = statusHistory?.[statusHistory.length - 1];
      const totalDaysElapsed = firstStatus
        ? Math.floor(
            (Date.now() - new Date(firstStatus.status_changed_at).getTime()) / (1000 * 60 * 60 * 24)
          )
        : 0;

      const isOnSchedule = !(milestones || []).some(m => m.milestone_status === 'DELAYED');

      return {
        po_number: poNumber,
        current_stage: currentStage,
        all_stages: allStages,
        completed_stages: completedStages,
        milestones: milestones || [],
        status_history: statusHistory || [],
        overall_progress_percent: overallProgress,
        is_on_schedule: isOnSchedule,
        total_days_elapsed: totalDaysElapsed,
      };
    } catch (error) {
      console.error('Error fetching order timeline:', error);
      return null;
    }
  }

  static async getOrdersByStage(stageCode: string): Promise<string[]> {
    try {
      const { data } = await supabase
        .from('fact_order_status_history')
        .select('po_number')
        .eq('current_stage_code', stageCode)
        .order('status_changed_at', { ascending: false });

      const uniquePOs = Array.from(new Set((data || []).map(d => d.po_number)));
      return uniquePOs;
    } catch (error) {
      console.error('Error fetching orders by stage:', error);
      return [];
    }
  }

  static async initializeOrderTracking(
    poNumber: string,
    contractId: string,
    vendorId: string,
    createdBy: string
  ): Promise<boolean> {
    try {
      const { data: existing } = await supabase
        .from('fact_order_status_history')
        .select('history_id')
        .eq('po_number', poNumber)
        .limit(1)
        .maybeSingle();

      if (existing) {
        console.log('Order tracking already initialized for', poNumber);
        return true;
      }

      await supabase.from('fact_order_status_history').insert({
        po_number: poNumber,
        contract_id: contractId,
        vendor_id: vendorId,
        current_stage_code: 'ORDER_CREATED',
        status_changed_at: new Date().toISOString(),
        changed_by_name: createdBy,
        change_source: 'SYSTEM',
        is_on_time: true,
      });

      const stages = await this.getAllTimelineStages();
      const milestoneInserts = stages.map(stage => ({
        po_number: poNumber,
        stage_code: stage.stage_code,
        milestone_name: stage.stage_name,
        milestone_status: stage.stage_code === 'ORDER_CREATED' ? 'COMPLETED' : 'PENDING',
        actual_date: stage.stage_code === 'ORDER_CREATED' ? new Date().toISOString() : null,
        completed_at: stage.stage_code === 'ORDER_CREATED' ? new Date().toISOString() : null,
        completed_by_name: stage.stage_code === 'ORDER_CREATED' ? createdBy : null,
      }));

      await supabase.from('fact_order_milestones').insert(milestoneInserts);

      return true;
    } catch (error) {
      console.error('Error initializing order tracking:', error);
      return false;
    }
  }

  static async handleBAInspectionSubmitted(baId: number, baNumber: string, poNumber: string, submittedBy: string): Promise<boolean> {
    return await this.updateOrderStatus(poNumber, 'IN_INSPECTION', {
      changedBy: submittedBy,
      changeSource: 'BA_WORKFLOW',
      baId,
      baNumber,
      baType: 'BA Pemeriksaan',
      notes: 'Moved to inspection stage upon BA Pemeriksaan submission',
    });
  }

  static async handleBASerahTerimaApproved(
    baId: number,
    baNumber: string,
    poNumber: string,
    approvedBy: string
  ): Promise<boolean> {
    return await this.updateOrderStatus(poNumber, 'ORDER_RECEIVED', {
      changedBy: approvedBy,
      changeSource: 'BA_WORKFLOW',
      baId,
      baNumber,
      baType: 'BA Serah Terima Barang',
      notes: 'Order received upon BA Serah Terima Barang approval',
    });
  }

  static async getOrderStatistics(): Promise<{
    total_active_orders: number;
    by_stage: Record<string, number>;
    delayed_orders: number;
    on_schedule_orders: number;
  }> {
    try {
      const { data: latestStatuses } = await supabase
        .from('fact_order_status_history')
        .select('po_number, current_stage_code, is_on_time')
        .order('status_changed_at', { ascending: false });

      const uniqueOrders = new Map<string, any>();
      (latestStatuses || []).forEach(status => {
        if (!uniqueOrders.has(status.po_number)) {
          uniqueOrders.set(status.po_number, status);
        }
      });

      const byStage: Record<string, number> = {};
      let delayedCount = 0;
      let onScheduleCount = 0;

      uniqueOrders.forEach(status => {
        byStage[status.current_stage_code] = (byStage[status.current_stage_code] || 0) + 1;
        if (status.is_on_time) {
          onScheduleCount++;
        } else {
          delayedCount++;
        }
      });

      return {
        total_active_orders: uniqueOrders.size,
        by_stage: byStage,
        delayed_orders: delayedCount,
        on_schedule_orders: onScheduleCount,
      };
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      return {
        total_active_orders: 0,
        by_stage: {},
        delayed_orders: 0,
        on_schedule_orders: 0,
      };
    }
  }
}
