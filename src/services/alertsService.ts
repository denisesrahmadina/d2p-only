import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Alert {
  id: string;
  alertId: string;
  organizationId: string;
  title: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  timestamp: string;
  actionRequired: boolean;
}

interface AlertRow {
  id: string;
  alert_id: string;
  organization_id: string;
  title: string;
  message: string;
  severity: string;
  source: string;
  timestamp: string;
  action_required: boolean;
  created_at: string;
  updated_at: string;
}

function mapAlertRowToAlert(row: AlertRow): Alert {
  return {
    id: row.id,
    alertId: row.alert_id,
    organizationId: row.organization_id,
    title: row.title,
    message: row.message,
    severity: row.severity as 'critical' | 'high' | 'medium' | 'low',
    source: row.source,
    timestamp: row.timestamp,
    actionRequired: row.action_required
  };
}

export class AlertsService {
  /**
   * Get all alerts
   */
  static async getAlerts(): Promise<Alert[]> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }

    return data ? data.map(mapAlertRowToAlert) : [];
  }

  /**
   * Get alert by UUID
   */
  static async getAlertById(id: string): Promise<Alert | undefined> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching alert by ID:', error);
      return undefined;
    }

    return data ? mapAlertRowToAlert(data) : undefined;
  }

  /**
   * Get alert by text alert ID (e.g., 'ssc-001', 'ip-001')
   */
  static async getAlertByAlertId(alertId: string): Promise<Alert | undefined> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('alert_id', alertId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching alert by alert_id:', error);
      return undefined;
    }

    return data ? mapAlertRowToAlert(data) : undefined;
  }

  /**
   * Get alerts by organization
   */
  static async getAlertsByOrganization(organizationId: string): Promise<Alert[]> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts by organization:', error);
      return [];
    }

    return data ? data.map(mapAlertRowToAlert) : [];
  }

  /**
   * Get alerts by severity
   */
  static async getAlertsBySeverity(severity: string): Promise<Alert[]> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('severity', severity)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts by severity:', error);
      return [];
    }

    return data ? data.map(mapAlertRowToAlert) : [];
  }

  /**
   * Get alerts by source
   */
  static async getAlertsBySource(source: string): Promise<Alert[]> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .ilike('source', `%${source}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts by source:', error);
      return [];
    }

    return data ? data.map(mapAlertRowToAlert) : [];
  }

  /**
   * Get alerts requiring action
   */
  static async getAlertsRequiringAction(): Promise<Alert[]> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('action_required', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts requiring action:', error);
      return [];
    }

    return data ? data.map(mapAlertRowToAlert) : [];
  }

  /**
   * Search alerts by title or message
   */
  static async searchAlerts(query: string): Promise<Alert[]> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .or(`title.ilike.%${query}%,message.ilike.%${query}%,source.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching alerts:', error);
      return [];
    }

    return data ? data.map(mapAlertRowToAlert) : [];
  }

  /**
   * Get alerts summary by severity
   */
  static async getAlertsSummary() {
    const alerts = await this.getAlerts();
    return {
      critical: alerts.filter(a => a.severity === 'critical').length,
      high: alerts.filter(a => a.severity === 'high').length,
      medium: alerts.filter(a => a.severity === 'medium').length,
      low: alerts.filter(a => a.severity === 'low').length,
      total: alerts.length,
      actionRequired: alerts.filter(a => a.actionRequired).length
    };
  }

  /**
   * Filter alerts by multiple criteria
   */
  static async filterAlerts(filters: {
    organizationId?: string;
    severity?: string;
    source?: string;
    actionRequired?: boolean;
    searchTerm?: string;
  }): Promise<Alert[]> {
    let query = supabase.from('alerts').select('*');

    if (filters.organizationId) {
      query = query.eq('organization_id', filters.organizationId);
    }

    if (filters.severity && filters.severity !== 'all') {
      query = query.eq('severity', filters.severity);
    }

    if (filters.source) {
      query = query.ilike('source', `%${filters.source}%`);
    }

    if (filters.actionRequired !== undefined) {
      query = query.eq('action_required', filters.actionRequired);
    }

    if (filters.searchTerm) {
      query = query.or(`title.ilike.%${filters.searchTerm}%,message.ilike.%${filters.searchTerm}%,source.ilike.%${filters.searchTerm}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error filtering alerts:', error);
      return [];
    }

    return data ? data.map(mapAlertRowToAlert) : [];
  }
}