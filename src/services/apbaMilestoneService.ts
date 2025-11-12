import { supabase } from './supabaseClient';

export interface MilestoneData {
  milestone_number: number;
  milestone_name: string;
  payment_percentage: number;
  payment_value: number;
  payment_status: string;
  due_date: string;
}

export interface MilestoneTableData {
  data_id?: number;
  ba_id: number;
  contract_id: string;
  milestone_data: MilestoneData[];
  table_format: {
    headers: boolean;
    borders: 'all' | 'horizontal' | 'vertical' | 'none';
    style: 'default' | 'minimal' | 'formal';
  };
  last_refreshed?: string;
}

class APBAMilestoneService {
  /**
   * Generate HTML table from milestone data
   */
  generateMilestoneTable(milestones: MilestoneData[], style: 'default' | 'minimal' | 'formal' = 'formal'): string {
    if (!milestones || milestones.length === 0) {
      return '<p><em>No milestone data available</em></p>';
    }

    const totalValue = milestones.reduce((sum, m) => sum + m.payment_value, 0);
    const totalPercentage = milestones.reduce((sum, m) => sum + m.payment_percentage, 0);

    let tableClass = 'milestone-table';
    let cellPadding = '8px';
    let borderStyle = '1px solid #d1d5db';

    if (style === 'minimal') {
      borderStyle = '1px solid #e5e7eb';
      cellPadding = '6px';
    } else if (style === 'formal') {
      borderStyle = '2px solid #6b7280';
      cellPadding = '10px';
    }

    const html = `
<table class="${tableClass}" style="width: 100%; border-collapse: collapse; margin: 1.5em 0; font-size: 12pt; border: ${borderStyle};">
  <thead>
    <tr style="background-color: #f3f4f6; font-weight: 600;">
      <th style="border: ${borderStyle}; padding: ${cellPadding}; text-align: left;">No</th>
      <th style="border: ${borderStyle}; padding: ${cellPadding}; text-align: left;">Milestone</th>
      <th style="border: ${borderStyle}; padding: ${cellPadding}; text-align: right;">Persentase</th>
      <th style="border: ${borderStyle}; padding: ${cellPadding}; text-align: right;">Nilai (IDR)</th>
      <th style="border: ${borderStyle}; padding: ${cellPadding}; text-align: center;">Status</th>
      <th style="border: ${borderStyle}; padding: ${cellPadding}; text-align: center;">Jatuh Tempo</th>
    </tr>
  </thead>
  <tbody>
    ${milestones.map((milestone, idx) => `
    <tr>
      <td style="border: ${borderStyle}; padding: ${cellPadding}; text-align: left;">${milestone.milestone_number || idx + 1}</td>
      <td style="border: ${borderStyle}; padding: ${cellPadding}; text-align: left;">${milestone.milestone_name}</td>
      <td style="border: ${borderStyle}; padding: ${cellPadding}; text-align: right;">${milestone.payment_percentage.toFixed(1)}%</td>
      <td style="border: ${borderStyle}; padding: ${cellPadding}; text-align: right;">${this.formatCurrency(milestone.payment_value)}</td>
      <td style="border: ${borderStyle}; padding: ${cellPadding}; text-align: center;">${milestone.payment_status}</td>
      <td style="border: ${borderStyle}; padding: ${cellPadding}; text-align: center;">${this.formatDate(milestone.due_date)}</td>
    </tr>
    `).join('')}
  </tbody>
  <tfoot>
    <tr style="background-color: #f9fafb; font-weight: 600;">
      <td colspan="2" style="border: ${borderStyle}; padding: ${cellPadding}; text-align: right;">Total:</td>
      <td style="border: ${borderStyle}; padding: ${cellPadding}; text-align: right;">${totalPercentage.toFixed(1)}%</td>
      <td style="border: ${borderStyle}; padding: ${cellPadding}; text-align: right;">${this.formatCurrency(totalValue)}</td>
      <td colspan="2" style="border: ${borderStyle}; padding: ${cellPadding};"></td>
    </tr>
  </tfoot>
</table>
    `.trim();

    return html;
  }

  /**
   * Format currency value
   */
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  /**
   * Format date
   */
  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  /**
   * Save milestone table data to database
   */
  async saveMilestoneTableData(tableData: MilestoneTableData): Promise<number | null> {
    try {
      const { data, error } = await supabase
        .from('ba_milestone_data')
        .insert([{
          ba_id: tableData.ba_id,
          contract_id: tableData.contract_id,
          milestone_data: tableData.milestone_data,
          table_format: tableData.table_format,
          last_refreshed: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Failed to save milestone table data:', error);
        return null;
      }

      return data.data_id;
    } catch (error) {
      console.error('Error saving milestone table data:', error);
      return null;
    }
  }

  /**
   * Get milestone table data from database
   */
  async getMilestoneTableData(baId: number): Promise<MilestoneTableData | null> {
    try {
      const { data, error } = await supabase
        .from('ba_milestone_data')
        .select('*')
        .eq('ba_id', baId)
        .order('created_date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, not an error
          return null;
        }
        console.error('Failed to fetch milestone table data:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting milestone table data:', error);
      return null;
    }
  }

  /**
   * Refresh milestone data from contract
   */
  async refreshMilestoneData(baId: number, contractId: string): Promise<MilestoneData[] | null> {
    try {
      // Fetch contract milestones from fact_ba_milestone or contract_milestone
      const { data: milestones, error } = await supabase
        .from('fact_ba_milestone')
        .select('*')
        .eq('ba_id', baId)
        .order('milestone_number', { ascending: true });

      if (error) {
        console.error('Failed to fetch milestones:', error);
        return null;
      }

      if (!milestones || milestones.length === 0) {
        return null;
      }

      const milestoneData: MilestoneData[] = milestones.map((m: any) => ({
        milestone_number: m.milestone_number,
        milestone_name: m.milestone_name,
        payment_percentage: m.payment_percentage,
        payment_value: m.payment_value,
        payment_status: m.payment_status,
        due_date: m.due_date
      }));

      // Update the milestone table data
      await this.updateMilestoneTableData(baId, milestoneData);

      return milestoneData;
    } catch (error) {
      console.error('Error refreshing milestone data:', error);
      return null;
    }
  }

  /**
   * Update existing milestone table data
   */
  async updateMilestoneTableData(baId: number, milestoneData: MilestoneData[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ba_milestone_data')
        .update({
          milestone_data: milestoneData,
          last_refreshed: new Date().toISOString()
        })
        .eq('ba_id', baId);

      if (error) {
        console.error('Failed to update milestone table data:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating milestone table data:', error);
      return false;
    }
  }

  /**
   * Delete milestone table data
   */
  async deleteMilestoneTableData(baId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ba_milestone_data')
        .delete()
        .eq('ba_id', baId);

      if (error) {
        console.error('Failed to delete milestone table data:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting milestone table data:', error);
      return false;
    }
  }

  /**
   * Get milestones from contract
   */
  async getMilestonesFromContract(contractId: string): Promise<MilestoneData[] | null> {
    try {
      const { data: contract, error: contractError } = await supabase
        .from('dim_contract')
        .select('contract_milestone, contract_value_limit')
        .eq('contract_id', contractId)
        .single();

      if (contractError) {
        console.error('Failed to fetch contract:', contractError);
        return null;
      }

      if (!contract.contract_milestone || contract.contract_milestone.length === 0) {
        return null;
      }

      const milestones: MilestoneData[] = contract.contract_milestone.map((m: any, idx: number) => ({
        milestone_number: idx + 1,
        milestone_name: m.name || `Milestone ${idx + 1}`,
        payment_percentage: (m.amount / contract.contract_value_limit) * 100,
        payment_value: m.amount,
        payment_status: m.status || 'Pending',
        due_date: m.date || new Date().toISOString()
      }));

      return milestones;
    } catch (error) {
      console.error('Error getting milestones from contract:', error);
      return null;
    }
  }
}

export const apbaMilestoneService = new APBAMilestoneService();
