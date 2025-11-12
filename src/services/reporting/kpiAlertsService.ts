import { supabase } from '../supabaseClient';
import type {
  KPIAlert,
  KPIInsight,
  KPIRecommendation,
  KPIAlertHistory,
  AlertWithDetails,
  AlertFilters,
  AlertStatistics,
  AlertStatus,
  AlertSeverity
} from '../../types/kpi-alerts';

export class KPIAlertsService {
  static async getAllAlerts(filters?: AlertFilters): Promise<KPIAlert[]> {
    let query = supabase
      .from('kpi_alerts')
      .select('*')
      .order('detected_at', { ascending: false });

    if (filters?.severity && filters.severity.length > 0) {
      query = query.in('severity', filters.severity);
    }

    if (filters?.status && filters.status.length > 0) {
      query = query.in('alert_status', filters.status);
    }

    if (filters?.alertType && filters.alertType.length > 0) {
      query = query.in('alert_type', filters.alertType);
    }

    if (filters?.dateFrom) {
      query = query.gte('detected_at', filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte('detected_at', filters.dateTo);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }

    return data || [];
  }

  static async getAlertById(alertId: number): Promise<AlertWithDetails | null> {
    const { data: alert, error: alertError } = await supabase
      .from('kpi_alerts')
      .select('*')
      .eq('alert_id', alertId)
      .maybeSingle();

    if (alertError) {
      console.error('Error fetching alert:', alertError);
      throw alertError;
    }

    if (!alert) return null;

    const [insights, recommendations, history] = await Promise.all([
      this.getInsightsForAlert(alertId),
      this.getRecommendationsForAlert(alertId),
      this.getAlertHistory(alertId)
    ]);

    return {
      ...alert,
      insights,
      recommendations,
      history
    };
  }

  static async getAlertsByKPI(kpiId: number): Promise<KPIAlert[]> {
    const { data, error } = await supabase
      .from('kpi_alerts')
      .select('*')
      .eq('kpi_id', kpiId)
      .order('detected_at', { ascending: false });

    if (error) {
      console.error('Error fetching KPI alerts:', error);
      throw error;
    }

    return data || [];
  }

  static async getInsightsForAlert(alertId: number): Promise<KPIInsight[]> {
    const { data, error } = await supabase
      .from('kpi_insights')
      .select('*')
      .eq('alert_id', alertId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }

    return data || [];
  }

  static async getRecommendationsForAlert(alertId: number): Promise<KPIRecommendation[]> {
    const { data, error } = await supabase
      .from('kpi_recommendations')
      .select('*')
      .eq('alert_id', alertId)
      .order('priority', { ascending: true });

    if (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }

    return data || [];
  }

  static async getAlertHistory(alertId: number): Promise<KPIAlertHistory[]> {
    const { data, error } = await supabase
      .from('kpi_alert_history')
      .select('*')
      .eq('alert_id', alertId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alert history:', error);
      throw error;
    }

    return data || [];
  }

  static async acknowledgeAlert(
    alertId: number,
    acknowledgedBy: string,
    notes?: string
  ): Promise<void> {
    const { data: currentAlert } = await supabase
      .from('kpi_alerts')
      .select('alert_status, current_value')
      .eq('alert_id', alertId)
      .maybeSingle();

    const { error: updateError } = await supabase
      .from('kpi_alerts')
      .update({
        alert_status: 'acknowledged',
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: acknowledgedBy
      })
      .eq('alert_id', alertId);

    if (updateError) {
      console.error('Error acknowledging alert:', updateError);
      throw updateError;
    }

    const { data: alertData } = await supabase
      .from('kpi_alerts')
      .select('kpi_id')
      .eq('alert_id', alertId)
      .maybeSingle();

    if (alertData) {
      await supabase.from('kpi_alert_history').insert({
        alert_id: alertId,
        kpi_id: alertData.kpi_id,
        action_type: 'acknowledged',
        action_by: acknowledgedBy,
        action_notes: notes,
        previous_status: currentAlert?.alert_status,
        new_status: 'acknowledged',
        kpi_value_at_action: currentAlert?.current_value
      });
    }
  }

  static async resolveAlert(
    alertId: number,
    resolvedBy: string,
    notes?: string
  ): Promise<void> {
    const { data: currentAlert } = await supabase
      .from('kpi_alerts')
      .select('alert_status, current_value')
      .eq('alert_id', alertId)
      .maybeSingle();

    const { error: updateError } = await supabase
      .from('kpi_alerts')
      .update({
        alert_status: 'resolved',
        resolved_at: new Date().toISOString(),
        resolved_by: resolvedBy
      })
      .eq('alert_id', alertId);

    if (updateError) {
      console.error('Error resolving alert:', updateError);
      throw updateError;
    }

    const { data: alertData } = await supabase
      .from('kpi_alerts')
      .select('kpi_id')
      .eq('alert_id', alertId)
      .maybeSingle();

    if (alertData) {
      await supabase.from('kpi_alert_history').insert({
        alert_id: alertId,
        kpi_id: alertData.kpi_id,
        action_type: 'resolved',
        action_by: resolvedBy,
        action_notes: notes,
        previous_status: currentAlert?.alert_status,
        new_status: 'resolved',
        kpi_value_at_action: currentAlert?.current_value
      });
    }
  }

  static async dismissAlert(
    alertId: number,
    dismissedBy: string,
    notes?: string
  ): Promise<void> {
    const { data: currentAlert } = await supabase
      .from('kpi_alerts')
      .select('alert_status, current_value')
      .eq('alert_id', alertId)
      .maybeSingle();

    const { error: updateError } = await supabase
      .from('kpi_alerts')
      .update({
        alert_status: 'dismissed'
      })
      .eq('alert_id', alertId);

    if (updateError) {
      console.error('Error dismissing alert:', updateError);
      throw updateError;
    }

    const { data: alertData } = await supabase
      .from('kpi_alerts')
      .select('kpi_id')
      .eq('alert_id', alertId)
      .maybeSingle();

    if (alertData) {
      await supabase.from('kpi_alert_history').insert({
        alert_id: alertId,
        kpi_id: alertData.kpi_id,
        action_type: 'dismissed',
        action_by: dismissedBy,
        action_notes: notes,
        previous_status: currentAlert?.alert_status,
        new_status: 'dismissed',
        kpi_value_at_action: currentAlert?.current_value
      });
    }
  }

  static async getAlertStatistics(filters?: AlertFilters): Promise<AlertStatistics> {
    const alerts = await this.getAllAlerts(filters);

    const stats: AlertStatistics = {
      total: alerts.length,
      active: alerts.filter(a => a.alert_status === 'active').length,
      acknowledged: alerts.filter(a => a.alert_status === 'acknowledged').length,
      resolved: alerts.filter(a => a.alert_status === 'resolved').length,
      high_severity: alerts.filter(a => a.severity === 'High').length,
      medium_severity: alerts.filter(a => a.severity === 'Medium').length,
      low_severity: alerts.filter(a => a.severity === 'Low').length,
      by_type: {
        threshold_breach: alerts.filter(a => a.alert_type === 'threshold_breach').length,
        trend_negative: alerts.filter(a => a.alert_type === 'trend_negative').length,
        target_miss: alerts.filter(a => a.alert_type === 'target_miss').length,
        critical_deviation: alerts.filter(a => a.alert_type === 'critical_deviation').length
      }
    };

    return stats;
  }

  static async updateRecommendationStatus(
    recommendationId: number,
    status: string,
    updatedBy: string
  ): Promise<void> {
    const updates: any = {
      implementation_status: status,
      updated_at: new Date().toISOString()
    };

    if (status === 'in_progress' && !updates.implementation_date) {
      updates.implementation_date = new Date().toISOString();
    }

    if (status === 'completed') {
      updates.completion_date = new Date().toISOString();
    }

    const { error } = await supabase
      .from('kpi_recommendations')
      .update(updates)
      .eq('recommendation_id', recommendationId);

    if (error) {
      console.error('Error updating recommendation:', error);
      throw error;
    }
  }

  static evaluateAlertSeverity(
    achievement: number,
    targetValue: number,
    thresholdCritical?: number,
    thresholdWarning?: number
  ): AlertSeverity {
    const variance = Math.abs(achievement - 100);

    if (thresholdCritical && achievement <= thresholdCritical) {
      return 'High';
    }

    if (thresholdWarning && achievement <= thresholdWarning) {
      return 'Medium';
    }

    if (variance > 20) {
      return 'High';
    } else if (variance > 10) {
      return 'Medium';
    } else {
      return 'Low';
    }
  }

  static generateRootCauseAnalysis(
    kpiName: string,
    actualValue: number,
    targetValue: number,
    historicalData?: any[]
  ): string {
    const variance = ((actualValue - targetValue) / targetValue * 100).toFixed(1);
    const direction = actualValue > targetValue ? 'exceeds' : 'falls short of';

    let analysis = `${kpiName} currently ${direction} target by ${Math.abs(parseFloat(variance))}%. `;

    if (historicalData && historicalData.length > 1) {
      const recent = historicalData.slice(-3);
      const trend = recent[recent.length - 1].value - recent[0].value;

      if (trend > 0) {
        analysis += 'Recent trend shows improvement, but not at sufficient pace to meet target. ';
      } else if (trend < 0) {
        analysis += 'Performance is declining, requiring immediate intervention. ';
      } else {
        analysis += 'Performance has plateaued, indicating systematic barriers to improvement. ';
      }
    }

    analysis += 'Detailed analysis of contributing factors is recommended to identify specific improvement opportunities.';

    return analysis;
  }
}
