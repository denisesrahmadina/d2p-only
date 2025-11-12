import { supabase } from '../supabaseClient';

export interface KPI {
  kpi_id: string;
  kpi_code: string;
  kpi_name: string;
  kpi_category: string;
  capability?: string;
  initiative_category: string;
  unit_of_measure: string;
  target_value: number;
  actual_value: number;
  achievement_percentage?: number;
  threshold_critical: number;
  threshold_warning: number;
  threshold_target: number;
  baseline_value?: number;
  timeline_start: string;
  timeline_end: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  data_source?: string;
  calculation_method?: string;
  background_issue?: string;
  strategic_objective?: string;
  kpi_owner?: string;
  kpi_status: 'Active' | 'Paused' | 'Completed' | 'Cancelled';
  last_updated?: string;
  created_at?: string;
  created_by?: string;
  historical_data?: HistoricalDataPoint[];
  related_initiatives?: string[];
  notes?: string;
}

export interface HistoricalDataPoint {
  month?: string;
  week?: number;
  quarter?: string;
  value: number;
}

export interface KPIAlert {
  alert_id: string;
  kpi_id: string;
  alert_type: 'Threshold Breach' | 'Trend Alert' | 'Anomaly' | 'Prediction' | 'Manual';
  severity: 'High' | 'Medium' | 'Low';
  alert_message: string;
  root_cause_analysis?: string;
  actionable_recommendations?: string[];
  predicted_impact?: string;
  alert_status: 'Active' | 'Acknowledged' | 'In Progress' | 'Resolved' | 'Dismissed';
  triggered_at: string;
  acknowledged_at?: string;
  acknowledged_by?: string;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
  auto_generated: boolean;
  notification_sent: boolean;
  related_data?: Record<string, any>;
  kpi?: KPI;
}

export interface KPISummary {
  total_kpis: number;
  on_track: number;
  at_risk: number;
  critical: number;
  avg_achievement: number;
  categories: {
    name: string;
    count: number;
    avg_achievement: number;
  }[];
}

export interface KPITrendData {
  kpi_code: string;
  kpi_name: string;
  historical_data: HistoricalDataPoint[];
  target_value: number;
  current_value: number;
  trend_direction: 'up' | 'down' | 'stable';
  trend_percentage: number;
}

export class KPIService {
  /**
   * Get all KPIs with optional filtering
   */
  static async getKPIs(filters?: {
    initiative_category?: string;
    capability?: string;
    kpi_category?: string;
    kpi_status?: string;
    timeline_start?: string;
    timeline_end?: string;
  }): Promise<KPI[]> {
    try {
      let query = supabase
        .from('ref_kpi')
        .select('*')
        .order('kpi_code');

      if (filters?.initiative_category) {
        query = query.eq('initiative_category', filters.initiative_category);
      }

      if (filters?.capability) {
        query = query.eq('capability', filters.capability);
      }

      if (filters?.kpi_category) {
        query = query.eq('kpi_category', filters.kpi_category);
      }

      if (filters?.kpi_status) {
        query = query.eq('kpi_status', filters.kpi_status);
      }

      if (filters?.timeline_start) {
        query = query.gte('timeline_start', filters.timeline_start);
      }

      if (filters?.timeline_end) {
        query = query.lte('timeline_end', filters.timeline_end);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      return [];
    }
  }

  /**
   * Get single KPI by ID
   */
  static async getKPIById(kpiId: string): Promise<KPI | null> {
    try {
      const { data, error } = await supabase
        .from('ref_kpi')
        .select('*')
        .eq('kpi_id', kpiId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching KPI:', error);
      return null;
    }
  }

  /**
   * Get KPI summary statistics
   */
  static async getKPISummary(): Promise<KPISummary> {
    try {
      const kpis = await this.getKPIs({ kpi_status: 'Active' });

      const total_kpis = kpis.length;
      const on_track = kpis.filter(k => (k.achievement_percentage ?? 0) >= k.threshold_target).length;
      const at_risk = kpis.filter(
        k => (k.achievement_percentage ?? 0) >= k.threshold_warning &&
             (k.achievement_percentage ?? 0) < k.threshold_target
      ).length;
      const critical = kpis.filter(k => (k.achievement_percentage ?? 0) < k.threshold_warning).length;

      const avg_achievement = kpis.length > 0
        ? kpis.reduce((sum, k) => sum + (k.achievement_percentage ?? 0), 0) / kpis.length
        : 0;

      // Group by category
      const categoryMap = new Map<string, { count: number; total_achievement: number }>();
      kpis.forEach(kpi => {
        const cat = kpi.initiative_category;
        const existing = categoryMap.get(cat) || { count: 0, total_achievement: 0 };
        categoryMap.set(cat, {
          count: existing.count + 1,
          total_achievement: existing.total_achievement + (kpi.achievement_percentage ?? 0)
        });
      });

      const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
        name,
        count: data.count,
        avg_achievement: data.count > 0 ? data.total_achievement / data.count : 0
      }));

      return {
        total_kpis,
        on_track,
        at_risk,
        critical,
        avg_achievement,
        categories
      };
    } catch (error) {
      console.error('Error getting KPI summary:', error);
      return {
        total_kpis: 0,
        on_track: 0,
        at_risk: 0,
        critical: 0,
        avg_achievement: 0,
        categories: []
      };
    }
  }

  /**
   * Get KPI trend data for visualization
   */
  static async getKPITrends(kpiIds?: string[]): Promise<KPITrendData[]> {
    try {
      let kpis: KPI[];

      if (kpiIds && kpiIds.length > 0) {
        const { data, error } = await supabase
          .from('ref_kpi')
          .select('*')
          .in('kpi_id', kpiIds);

        if (error) throw error;
        kpis = data || [];
      } else {
        kpis = await this.getKPIs({ kpi_status: 'Active' });
      }

      return kpis.map(kpi => {
        const historical = kpi.historical_data || [];
        const current = kpi.actual_value;
        const baseline = kpi.baseline_value ?? current;

        let trend_direction: 'up' | 'down' | 'stable' = 'stable';
        let trend_percentage = 0;

        if (baseline !== 0) {
          trend_percentage = ((current - baseline) / baseline) * 100;
          if (trend_percentage > 5) trend_direction = 'up';
          else if (trend_percentage < -5) trend_direction = 'down';
        }

        return {
          kpi_code: kpi.kpi_code,
          kpi_name: kpi.kpi_name,
          historical_data: historical,
          target_value: kpi.target_value,
          current_value: current,
          trend_direction,
          trend_percentage: Math.abs(trend_percentage)
        };
      });
    } catch (error) {
      console.error('Error getting KPI trends:', error);
      return [];
    }
  }

  /**
   * Update KPI actual value and trigger alert check
   */
  static async updateKPIValue(
    kpiId: string,
    actualValue: number,
    updatedBy?: string
  ): Promise<{ success: boolean; message: string; alert?: KPIAlert }> {
    try {
      // Update the KPI
      const { error: updateError } = await supabase
        .from('ref_kpi')
        .update({
          actual_value: actualValue,
          last_updated: new Date().toISOString()
        })
        .eq('kpi_id', kpiId);

      if (updateError) throw updateError;

      // Check if alert should be generated
      const kpi = await this.getKPIById(kpiId);
      if (!kpi) {
        return { success: false, message: 'KPI not found after update' };
      }

      const achievement = kpi.achievement_percentage ?? 0;
      let alert: KPIAlert | undefined;

      // Generate alert if threshold breached
      if (achievement < kpi.threshold_warning) {
        const severity = achievement < kpi.threshold_critical ? 'High' : 'Medium';
        alert = await this.generateAlert(kpi, severity, updatedBy);
      }

      return {
        success: true,
        message: 'KPI value updated successfully',
        alert
      };
    } catch (error) {
      console.error('Error updating KPI value:', error);
      return { success: false, message: 'Failed to update KPI value' };
    }
  }

  /**
   * Generate alert for KPI threshold breach
   */
  private static async generateAlert(
    kpi: KPI,
    severity: 'High' | 'Medium' | 'Low',
    triggeredBy?: string
  ): Promise<KPIAlert | undefined> {
    try {
      const alertMessage = `${kpi.kpi_name} ${
        severity === 'High' ? 'critically below' : 'below'
      } target: ${kpi.actual_value} ${kpi.unit_of_measure} (target: ${kpi.target_value})`;

      const { data, error } = await supabase
        .from('kpi_alerts')
        .insert({
          kpi_id: kpi.kpi_id,
          alert_type: 'Threshold Breach',
          severity,
          alert_message: alertMessage,
          alert_status: 'Active',
          auto_generated: true,
          notification_sent: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating alert:', error);
      return undefined;
    }
  }

  /**
   * Get all KPI alerts with optional filtering
   */
  static async getKPIAlerts(filters?: {
    severity?: string;
    alert_status?: string;
    kpi_id?: string;
  }): Promise<KPIAlert[]> {
    try {
      let query = supabase
        .from('kpi_alerts')
        .select(`
          *,
          kpi:ref_kpi(*)
        `)
        .order('triggered_at', { ascending: false });

      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
      }

      if (filters?.alert_status) {
        query = query.eq('alert_status', filters.alert_status);
      }

      if (filters?.kpi_id) {
        query = query.eq('kpi_id', filters.kpi_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching KPI alerts:', error);
      return [];
    }
  }

  /**
   * Update alert status
   */
  static async updateAlertStatus(
    alertId: string,
    status: 'Acknowledged' | 'In Progress' | 'Resolved' | 'Dismissed',
    userId?: string,
    notes?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const updateData: any = {
        alert_status: status,
        updated_at: new Date().toISOString()
      };

      if (status === 'Acknowledged') {
        updateData.acknowledged_at = new Date().toISOString();
        updateData.acknowledged_by = userId;
      }

      if (status === 'Resolved') {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolved_by = userId;
        updateData.resolution_notes = notes;
      }

      const { error } = await supabase
        .from('kpi_alerts')
        .update(updateData)
        .eq('alert_id', alertId);

      if (error) throw error;

      return {
        success: true,
        message: `Alert ${status.toLowerCase()} successfully`
      };
    } catch (error) {
      console.error('Error updating alert status:', error);
      return { success: false, message: 'Failed to update alert status' };
    }
  }

  /**
   * Get unique initiative categories for filtering
   */
  static async getInitiativeCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('ref_kpi')
        .select('initiative_category')
        .order('initiative_category');

      if (error) throw error;

      const categories = Array.from(
        new Set((data || []).map(item => item.initiative_category).filter(Boolean))
      );

      return categories;
    } catch (error) {
      console.error('Error fetching initiative categories:', error);
      return [];
    }
  }

  /**
   * Get unique capabilities for filtering
   */
  static async getCapabilities(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('ref_kpi')
        .select('capability')
        .order('capability');

      if (error) throw error;

      const capabilities = Array.from(
        new Set((data || []).map(item => item.capability).filter(Boolean))
      );

      return capabilities;
    } catch (error) {
      console.error('Error fetching capabilities:', error);
      return [];
    }
  }

  /**
   * Get unique KPI categories for filtering with optional capability filter
   */
  static async getKPICategories(filters?: { capability?: string }): Promise<string[]> {
    try {
      let query = supabase
        .from('ref_kpi')
        .select('kpi_category')
        .order('kpi_category');

      if (filters?.capability) {
        query = query.eq('capability', filters.capability);
      }

      const { data, error } = await query;

      if (error) throw error;

      const categories = Array.from(
        new Set((data || []).map(item => item.kpi_category).filter(Boolean))
      );

      return categories;
    } catch (error) {
      console.error('Error fetching KPI categories:', error);
      return [];
    }
  }

  /**
   * Export KPIs to CSV format
   */
  static async exportKPIsToCSV(filters?: Parameters<typeof this.getKPIs>[0]): Promise<string> {
    try {
      const kpis = await this.getKPIs(filters);

      const headers = [
        'KPI Code',
        'KPI Name',
        'Category',
        'Initiative Category',
        'Target',
        'Actual',
        'Achievement %',
        'Status',
        'Owner',
        'Timeline Start',
        'Timeline End'
      ].join(',');

      const rows = kpis.map(kpi => [
        kpi.kpi_code,
        `"${kpi.kpi_name}"`,
        kpi.kpi_category,
        kpi.initiative_category,
        kpi.target_value,
        kpi.actual_value,
        kpi.achievement_percentage ?? 0,
        kpi.kpi_status,
        kpi.kpi_owner || '',
        kpi.timeline_start,
        kpi.timeline_end
      ].join(','));

      return [headers, ...rows].join('\n');
    } catch (error) {
      console.error('Error exporting KPIs:', error);
      return '';
    }
  }

  /**
   * Get KPIs grouped by initiative category
   */
  static async getKPIsByInitiativeCategory(filters?: Parameters<typeof this.getKPIs>[0]): Promise<Map<string, KPI[]>> {
    try {
      const kpis = await this.getKPIs(filters);
      const grouped = new Map<string, KPI[]>();

      kpis.forEach(kpi => {
        const category = kpi.initiative_category;
        if (!grouped.has(category)) {
          grouped.set(category, []);
        }
        grouped.get(category)!.push(kpi);
      });

      return grouped;
    } catch (error) {
      console.error('Error grouping KPIs by category:', error);
      return new Map();
    }
  }

  /**
   * Get KPI historical comparison with filtering
   */
  static async getKPIHistoricalComparison(
    kpiId: string,
    timelineFilter?: { start?: string; end?: string }
  ): Promise<HistoricalDataPoint[]> {
    try {
      const kpi = await this.getKPIById(kpiId);
      if (!kpi || !kpi.historical_data) {
        return [];
      }

      let historical = kpi.historical_data;

      // Filter by timeline if provided
      if (timelineFilter?.start || timelineFilter?.end) {
        historical = historical.filter(point => {
          if (!point.month) return true;

          const pointDate = new Date(point.month);
          if (timelineFilter.start && pointDate < new Date(timelineFilter.start)) {
            return false;
          }
          if (timelineFilter.end && pointDate > new Date(timelineFilter.end)) {
            return false;
          }
          return true;
        });
      }

      return historical;
    } catch (error) {
      console.error('Error getting KPI historical comparison:', error);
      return [];
    }
  }

  /**
   * Get detailed KPI drill-down information
   */
  static async getKPIDetailedDrilldown(kpiId: string): Promise<KPI | null> {
    try {
      const kpi = await this.getKPIById(kpiId);
      if (!kpi) return null;

      // Get related initiatives in the same category
      const relatedKPIs = await this.getKPIs({
        initiative_category: kpi.initiative_category
      });

      kpi.related_initiatives = relatedKPIs
        .filter(k => k.kpi_id !== kpiId)
        .map(k => k.kpi_code);

      return kpi;
    } catch (error) {
      console.error('Error getting KPI detailed drilldown:', error);
      return null;
    }
  }

  /**
   * Filter KPIs by timeline
   */
  static filterKPIsByTimeline(kpis: KPI[], timelineFilter: { start?: string; end?: string }): KPI[] {
    if (!timelineFilter.start && !timelineFilter.end) {
      return kpis;
    }

    return kpis.filter(kpi => {
      const kpiStart = new Date(kpi.timeline_start);
      const kpiEnd = new Date(kpi.timeline_end);

      if (timelineFilter.start) {
        const filterStart = new Date(timelineFilter.start);
        if (kpiEnd < filterStart) return false;
      }

      if (timelineFilter.end) {
        const filterEnd = new Date(timelineFilter.end);
        if (kpiStart > filterEnd) return false;
      }

      return true;
    });
  }

  /**
   * Filter KPIs by background issue keyword
   */
  static filterKPIsByBackgroundIssue(kpis: KPI[], issueKeyword: string): KPI[] {
    if (!issueKeyword || issueKeyword.trim() === '') {
      return kpis;
    }

    const keyword = issueKeyword.toLowerCase().trim();

    return kpis.filter(kpi => {
      if (!kpi.background_issue) return false;
      return kpi.background_issue.toLowerCase().includes(keyword);
    });
  }

  /**
   * Get category summary statistics
   */
  static getCategorySummary(kpis: KPI[]): {
    category: string;
    total: number;
    onTrack: number;
    atRisk: number;
    critical: number;
    avgAchievement: number;
  }[] {
    const categoryMap = new Map<string, KPI[]>();

    kpis.forEach(kpi => {
      const cat = kpi.initiative_category;
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, []);
      }
      categoryMap.get(cat)!.push(kpi);
    });

    return Array.from(categoryMap.entries()).map(([category, categoryKpis]) => {
      const onTrack = categoryKpis.filter(k => (k.achievement_percentage ?? 0) >= k.threshold_target).length;
      const atRisk = categoryKpis.filter(
        k => (k.achievement_percentage ?? 0) >= k.threshold_warning &&
             (k.achievement_percentage ?? 0) < k.threshold_target
      ).length;
      const critical = categoryKpis.filter(k => (k.achievement_percentage ?? 0) < k.threshold_warning).length;

      const avgAchievement = categoryKpis.length > 0
        ? categoryKpis.reduce((sum, k) => sum + (k.achievement_percentage ?? 0), 0) / categoryKpis.length
        : 0;

      return {
        category,
        total: categoryKpis.length,
        onTrack,
        atRisk,
        critical,
        avgAchievement
      };
    });
  }
}
