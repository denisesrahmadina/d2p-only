export class ExportService {
  static generateCSV(data: any[], columns?: string[]): string {
    if (!data || data.length === 0) {
      return '';
    }

    const keys = columns || Object.keys(data[0]);

    const header = keys.join(',');

    const rows = data.map(row => {
      return keys.map(key => {
        const value = row[key];

        if (value === null || value === undefined) {
          return '';
        }

        const stringValue = String(value);

        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      }).join(',');
    });

    return [header, ...rows].join('\n');
  }

  static downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  static exportToCSV(data: any[], filename: string, columns?: string[]): void {
    const csv = this.generateCSV(data, columns);
    this.downloadCSV(csv, filename);
  }

  static generateFilename(type: string, filters?: any): string {
    const timestamp = new Date().toISOString().split('T')[0];
    let filename = `${type}_${timestamp}`;

    if (filters) {
      if (filters.timeline_start) {
        filename += `_from_${filters.timeline_start}`;
      }
      if (filters.timeline_end) {
        filename += `_to_${filters.timeline_end}`;
      }
    }

    return `${filename}.csv`;
  }

  static formatDataForExport(rawData: any[], type: string): any[] {
    return rawData.map(item => {
      const formatted: any = {};

      for (const [key, value] of Object.entries(item)) {
        const readableKey = key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());

        formatted[readableKey] = value;
      }

      return formatted;
    });
  }

  static exportMultipleSheets(sheets: { name: string; data: any[] }[], filename: string): void {
    const allData: string[] = [];

    sheets.forEach(sheet => {
      allData.push(`Sheet: ${sheet.name}`);
      allData.push('');

      if (sheet.data.length > 0) {
        const csv = this.generateCSV(sheet.data);
        allData.push(csv);
      } else {
        allData.push('No data available');
      }

      allData.push('');
      allData.push('');
    });

    this.downloadCSV(allData.join('\n'), filename);
  }

  static async exportTableToCSV(tableId: string, filename: string): Promise<void> {
    const table = document.getElementById(tableId);
    if (!table) {
      throw new Error(`Table with id "${tableId}" not found`);
    }

    const rows: string[][] = [];
    const tableRows = table.querySelectorAll('tr');

    tableRows.forEach(row => {
      const cells: string[] = [];
      row.querySelectorAll('th, td').forEach(cell => {
        cells.push(cell.textContent?.trim() || '');
      });
      rows.push(cells);
    });

    const csv = rows.map(row => row.join(',')).join('\n');
    this.downloadCSV(csv, filename);
  }

  static exportAlertsToCSV(alerts: any[], filename?: string): void {
    const formattedAlerts = alerts.map(alert => ({
      'Alert ID': alert.alert_id,
      'KPI Code': alert.kpi?.kpi_code || 'N/A',
      'KPI Name': alert.kpi?.kpi_name || 'N/A',
      'Alert Type': alert.alert_type,
      'Severity': alert.severity,
      'Alert Message': alert.alert_message,
      'Status': alert.alert_status,
      'Triggered At': new Date(alert.triggered_at).toLocaleString(),
      'Acknowledged By': alert.acknowledged_by || 'N/A',
      'Resolved By': alert.resolved_by || 'N/A',
      'Root Cause': alert.root_cause_analysis || 'N/A',
      'Predicted Impact': alert.predicted_impact || 'N/A'
    }));

    const exportFilename = filename || this.generateFilename('KPI_Alerts', {});
    this.exportToCSV(formattedAlerts, exportFilename);
  }

  static exportInitiativesToCSV(initiatives: any[], filename?: string): void {
    const formattedInitiatives = initiatives.map(initiative => ({
      'Initiative ID': initiative.initiative_id,
      'Initiative Name': initiative.initiative_name,
      'Category': initiative.category,
      'Status': initiative.status,
      'Priority': initiative.priority,
      'Progress': `${initiative.progress_percentage}%`,
      'Start Date': initiative.start_date || 'N/A',
      'Target Date': initiative.target_completion_date || 'N/A',
      'Owner': initiative.owner || 'N/A',
      'Budget': initiative.budget || 'N/A',
      'Description': initiative.description || 'N/A',
      'Impact': initiative.expected_impact || 'N/A'
    }));

    const exportFilename = filename || this.generateFilename('Strategic_Initiatives', {});
    this.exportToCSV(formattedInitiatives, exportFilename);
  }

  static exportComprehensiveReport(data: {
    kpis?: any[];
    alerts?: any[];
    initiatives?: any[];
  }, filename?: string): void {
    const sheets: { name: string; data: any[] }[] = [];

    if (data.kpis && data.kpis.length > 0) {
      sheets.push({
        name: 'KPIs',
        data: data.kpis.map(kpi => ({
          'KPI Code': kpi.kpi_code,
          'KPI Name': kpi.kpi_name,
          'Category': kpi.initiative_category,
          'Target': kpi.target_value,
          'Actual': kpi.actual_value,
          'Achievement %': kpi.achievement_percentage,
          'Status': kpi.kpi_status
        }))
      });
    }

    if (data.alerts && data.alerts.length > 0) {
      sheets.push({
        name: 'Alerts',
        data: data.alerts.map(alert => ({
          'Alert ID': alert.alert_id,
          'KPI': alert.kpi?.kpi_name || 'N/A',
          'Severity': alert.severity,
          'Message': alert.alert_message,
          'Status': alert.alert_status,
          'Triggered': new Date(alert.triggered_at).toLocaleDateString()
        }))
      });
    }

    if (data.initiatives && data.initiatives.length > 0) {
      sheets.push({
        name: 'Initiatives',
        data: data.initiatives.map(initiative => ({
          'Initiative': initiative.initiative_name,
          'Category': initiative.category,
          'Status': initiative.status,
          'Progress': `${initiative.progress_percentage}%`,
          'Priority': initiative.priority
        }))
      });
    }

    const exportFilename = filename || this.generateFilename('Comprehensive_Report', {});
    this.exportMultipleSheets(sheets, exportFilename);
  }
}
