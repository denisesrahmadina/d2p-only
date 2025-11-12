import { supabase } from './supabaseClient';

export interface OTIFDelivery {
  id: string;
  organization_id: string;
  purchase_order_id: string;
  supplier_id: string;
  supplier_name: string;
  order_date: string;
  expected_delivery_date: string;
  actual_delivery_date: string | null;
  quantity_ordered: number;
  quantity_delivered: number;
  is_on_time: boolean;
  is_in_full: boolean;
  is_otif: boolean;
  delivery_status: string;
  delay_days: number | null;
  quantity_shortage: number | null;
  product_category: string;
  failure_reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OTIFPerformance {
  id: string;
  organization_id: string;
  supplier_id: string;
  supplier_name: string;
  period_start: string;
  period_end: string;
  total_deliveries: number;
  on_time_deliveries: number;
  in_full_deliveries: number;
  otif_deliveries: number;
  on_time_percentage: number;
  in_full_percentage: number;
  otif_percentage: number;
  avg_delay_days: number | null;
  supplier_tier: string;
  created_at: string;
  updated_at: string;
}

export interface OTIFSummary {
  total_deliveries: number;
  delivered_count: number;
  pending_count: number;
  otif_count: number;
  on_time_count: number;
  in_full_count: number;
  otif_percentage: number;
  on_time_percentage: number;
  in_full_percentage: number;
  avg_delay_days: number;
}

export interface SupplierOTIFBreakdown {
  supplier_id: string;
  supplier_name: string;
  supplier_tier: string;
  total_deliveries: number;
  otif_percentage: number;
  on_time_percentage: number;
  in_full_percentage: number;
}

export class OTIFService {
  static async getOTIFDeliveries(
    organizationId: string = 'ORG001',
    filters?: {
      supplierId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<OTIFDelivery[]> {
    let query = supabase
      .from('supplier_otif_deliveries')
      .select('*')
      .eq('organization_id', organizationId)
      .order('order_date', { ascending: false });

    if (filters?.supplierId) {
      query = query.eq('supplier_id', filters.supplierId);
    }

    if (filters?.status) {
      query = query.eq('delivery_status', filters.status);
    }

    if (filters?.startDate) {
      query = query.gte('order_date', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('order_date', filters.endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching OTIF deliveries:', error);
      throw error;
    }

    return data || [];
  }

  static async getOTIFSummary(organizationId: string = 'ORG001'): Promise<OTIFSummary> {
    const { data, error } = await supabase
      .from('supplier_otif_deliveries')
      .select('*')
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Error fetching OTIF summary:', error);
      throw error;
    }

    const deliveries = data || [];
    const deliveredDeliveries = deliveries.filter(d => d.delivery_status === 'delivered');

    const total_deliveries = deliveries.length;
    const delivered_count = deliveredDeliveries.length;
    const pending_count = deliveries.filter(d => d.delivery_status === 'pending').length;
    const otif_count = deliveredDeliveries.filter(d => d.is_otif).length;
    const on_time_count = deliveredDeliveries.filter(d => d.is_on_time).length;
    const in_full_count = deliveredDeliveries.filter(d => d.is_in_full).length;

    const otif_percentage = delivered_count > 0 ? (otif_count / delivered_count) * 100 : 0;
    const on_time_percentage = delivered_count > 0 ? (on_time_count / delivered_count) * 100 : 0;
    const in_full_percentage = delivered_count > 0 ? (in_full_count / delivered_count) * 100 : 0;

    const delayedDeliveries = deliveredDeliveries.filter(d => d.delay_days && d.delay_days > 0);
    const avg_delay_days = delayedDeliveries.length > 0
      ? delayedDeliveries.reduce((sum, d) => sum + (d.delay_days || 0), 0) / delayedDeliveries.length
      : 0;

    return {
      total_deliveries,
      delivered_count,
      pending_count,
      otif_count,
      on_time_count,
      in_full_count,
      otif_percentage: Math.round(otif_percentage * 100) / 100,
      on_time_percentage: Math.round(on_time_percentage * 100) / 100,
      in_full_percentage: Math.round(in_full_percentage * 100) / 100,
      avg_delay_days: Math.round(avg_delay_days * 100) / 100
    };
  }

  static async getSupplierPerformance(
    organizationId: string = 'ORG001'
  ): Promise<OTIFPerformance[]> {
    const { data, error } = await supabase
      .from('supplier_otif_performance')
      .select('*')
      .eq('organization_id', organizationId)
      .order('otif_percentage', { ascending: false });

    if (error) {
      console.error('Error fetching supplier performance:', error);
      throw error;
    }

    return data || [];
  }

  static async getSupplierOTIFBreakdown(
    organizationId: string = 'ORG001'
  ): Promise<SupplierOTIFBreakdown[]> {
    const { data, error } = await supabase
      .from('supplier_otif_performance')
      .select('supplier_id, supplier_name, supplier_tier, total_deliveries, otif_percentage, on_time_percentage, in_full_percentage')
      .eq('organization_id', organizationId)
      .order('otif_percentage', { ascending: false });

    if (error) {
      console.error('Error fetching supplier breakdown:', error);
      throw error;
    }

    return data || [];
  }

  static async getTopPerformingSuppliers(
    organizationId: string = 'ORG001',
    limit: number = 5
  ): Promise<SupplierOTIFBreakdown[]> {
    const { data, error } = await supabase
      .from('supplier_otif_performance')
      .select('supplier_id, supplier_name, supplier_tier, total_deliveries, otif_percentage, on_time_percentage, in_full_percentage')
      .eq('organization_id', organizationId)
      .order('otif_percentage', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top suppliers:', error);
      throw error;
    }

    return data || [];
  }

  static async getBottomPerformingSuppliers(
    organizationId: string = 'ORG001',
    limit: number = 5
  ): Promise<SupplierOTIFBreakdown[]> {
    const { data, error } = await supabase
      .from('supplier_otif_performance')
      .select('supplier_id, supplier_name, supplier_tier, total_deliveries, otif_percentage, on_time_percentage, in_full_percentage')
      .eq('organization_id', organizationId)
      .order('otif_percentage', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching bottom suppliers:', error);
      throw error;
    }

    return data || [];
  }

  static async getFailureReasons(organizationId: string = 'ORG001'): Promise<{ reason: string; count: number }[]> {
    const { data, error } = await supabase
      .from('supplier_otif_deliveries')
      .select('failure_reason')
      .eq('organization_id', organizationId)
      .eq('is_otif', false)
      .not('failure_reason', 'is', null);

    if (error) {
      console.error('Error fetching failure reasons:', error);
      throw error;
    }

    const reasonCounts = (data || []).reduce((acc, delivery) => {
      const reason = delivery.failure_reason || 'Unknown';
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(reasonCounts)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count);
  }

  static async getOTIFTrend(
    organizationId: string = 'ORG001',
    months: number = 6
  ): Promise<{ month: string; otif_percentage: number; on_time_percentage: number; in_full_percentage: number }[]> {
    const { data, error } = await supabase
      .from('supplier_otif_deliveries')
      .select('order_date, is_otif, is_on_time, is_in_full, delivery_status')
      .eq('organization_id', organizationId)
      .eq('delivery_status', 'delivered')
      .order('order_date', { ascending: true });

    if (error) {
      console.error('Error fetching OTIF trend:', error);
      throw error;
    }

    const deliveries = data || [];
    const monthlyData: Record<string, { otif: number; on_time: number; in_full: number; total: number }> = {};

    deliveries.forEach(delivery => {
      const date = new Date(delivery.order_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { otif: 0, on_time: 0, in_full: 0, total: 0 };
      }

      monthlyData[monthKey].total++;
      if (delivery.is_otif) monthlyData[monthKey].otif++;
      if (delivery.is_on_time) monthlyData[monthKey].on_time++;
      if (delivery.is_in_full) monthlyData[monthKey].in_full++;
    });

    return Object.entries(monthlyData)
      .map(([month, stats]) => ({
        month,
        otif_percentage: Math.round((stats.otif / stats.total) * 100 * 100) / 100,
        on_time_percentage: Math.round((stats.on_time / stats.total) * 100 * 100) / 100,
        in_full_percentage: Math.round((stats.in_full / stats.total) * 100 * 100) / 100
      }))
      .slice(-months);
  }

  static async getDeliveryById(deliveryId: string): Promise<OTIFDelivery | null> {
    const { data, error } = await supabase
      .from('supplier_otif_deliveries')
      .select('*')
      .eq('id', deliveryId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching delivery:', error);
      throw error;
    }

    return data;
  }

  static formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  static getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'partial':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
      case 'late':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300';
    }
  }

  static getTierBadgeColor(tier: string): string {
    switch (tier) {
      case 'strategic':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'preferred':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'standard':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300';
    }
  }
}
