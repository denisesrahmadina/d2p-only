export type AlertType = 'threshold_breach' | 'trend_negative' | 'target_miss' | 'critical_deviation';
export type AlertSeverity = 'High' | 'Medium' | 'Low';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'dismissed';
export type TrendDirection = 'improving' | 'declining' | 'stable';

export type InsightType = 'predictive' | 'diagnostic' | 'prescriptive' | 'descriptive';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type RecommendationType = 'immediate_action' | 'short_term' | 'long_term' | 'preventive';
export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low';
export type ImplementationEffort = 'low' | 'medium' | 'high';
export type ImplementationStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type HistoryActionType = 'created' | 'acknowledged' | 'escalated' | 'resolved' | 'dismissed' | 'updated';

export interface KPIAlert {
  alert_id: number;
  kpi_id: number;
  kpi_code: string;
  kpi_name: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  alert_status: AlertStatus;

  current_value: number;
  target_value: number;
  threshold_breached?: string;
  variance_percentage?: number;

  root_cause_analysis?: string;
  trend_direction?: TrendDirection;
  predicted_value?: number;
  confidence_score?: number;

  detected_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
  acknowledged_by?: string;
  resolved_by?: string;

  alert_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KPIInsight {
  insight_id: number;
  kpi_id: number;
  alert_id?: number;

  insight_type: InsightType;
  insight_title: string;
  insight_description: string;

  predicted_outcome?: string;
  prediction_timeframe?: string;
  likelihood_percentage?: number;

  contributing_factors?: Array<{
    factor?: string;
    impact?: string;
    finding?: string;
    evidence?: string;
    issue_type?: string;
    frequency?: string;
    opportunity?: string;
    potential?: string;
    category?: string;
    value?: string;
  }>;
  historical_correlation?: Record<string, any>;
  confidence_level?: ConfidenceLevel;

  generated_by_ai: boolean;
  model_version?: string;

  created_at: string;
  created_by: string;
}

export interface ActionStep {
  step: number;
  action: string;
  duration: string;
}

export interface KPIRecommendation {
  recommendation_id: number;
  alert_id: number;
  kpi_id: number;

  recommendation_title: string;
  recommendation_description: string;
  recommendation_type?: RecommendationType;

  priority: RecommendationPriority;
  estimated_impact?: string;
  implementation_effort?: ImplementationEffort;

  action_steps?: ActionStep[];
  responsible_role?: string;
  estimated_timeline?: string;
  expected_outcome?: string;

  implementation_status: ImplementationStatus;
  implementation_date?: string;
  completion_date?: string;

  actual_impact?: string;
  effectiveness_score?: number;

  created_at: string;
  created_by: string;
  updated_at: string;
}

export interface KPIAlertHistory {
  history_id: number;
  alert_id: number;
  kpi_id: number;

  action_type: HistoryActionType;
  action_by?: string;
  action_notes?: string;

  previous_status?: string;
  new_status?: string;

  kpi_value_at_action?: number;

  created_at: string;
}

export interface AlertWithDetails extends KPIAlert {
  insights?: KPIInsight[];
  recommendations?: KPIRecommendation[];
  history?: KPIAlertHistory[];
}

export interface AlertFilters {
  severity?: AlertSeverity[];
  status?: AlertStatus[];
  alertType?: AlertType[];
  dateFrom?: string;
  dateTo?: string;
}

export interface AlertStatistics {
  total: number;
  active: number;
  acknowledged: number;
  resolved: number;
  high_severity: number;
  medium_severity: number;
  low_severity: number;
  by_type: Record<AlertType, number>;
}
