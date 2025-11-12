import { supabase } from '../supabaseClient';

export interface StrategicInitiative {
  initiative_id: string;
  initiative_code: string;
  initiative_name: string;
  initiative_activities: string;
  initiative_category: string;
  initiative_owner: string;
  background_issue: string;
  expected_outcome: string;
  related_stakeholders?: string[];
  impact_estimate?: string;
  impact_value?: number;
  timeline_start: string;
  timeline_end: string;
  milestones?: Milestone[];
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  initiatives_status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled' | 'At Risk';
  completion_percentage: number;
  budget_allocated?: number;
  budget_spent?: number;
  dependencies?: string[];
  deliverables?: string[];
  success_criteria?: string;
  risks_identified: number;
  issues_identified: number;
  last_status_update?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  notes?: string;
}

export interface Milestone {
  name: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  completion_percentage?: number;
}

export interface RiskLog {
  risk_id: string;
  initiative_id: string;
  risk_code: string;
  risk_title: string;
  risk_description: string;
  risk_category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  likelihood: 'Very High' | 'High' | 'Medium' | 'Low' | 'Very Low';
  risk_score?: number;
  impact_description?: string;
  mitigation_actions: string;
  contingency_plan?: string;
  risk_owner: string;
  mitigation_deadline?: string;
  risk_status: 'Open' | 'In Mitigation' | 'Mitigated' | 'Accepted' | 'Closed';
  identified_date: string;
  last_review_date?: string;
  next_review_date?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  notes?: string;
}

export interface IssueLog {
  issue_id: string;
  initiative_id: string;
  issue_code: string;
  issue_title: string;
  issue_description: string;
  issue_category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  impact_description?: string;
  root_cause?: string;
  resolution_actions: string;
  issue_owner: string;
  resolution_deadline?: string;
  issue_status: 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'Deferred';
  reported_date: string;
  resolved_date?: string;
  completion_status: number;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  remarks?: string;
}

export class StrategicInitiativeService {
  /**
   * Get all strategic initiatives with optional filtering
   */
  static async getInitiatives(filters?: {
    initiative_category?: string;
    initiatives_status?: string;
    priority?: string;
  }): Promise<StrategicInitiative[]> {
    try {
      let query = supabase
        .from('ref_strategic_initiative')
        .select('*')
        .order('priority', { ascending: false })
        .order('timeline_start', { ascending: true });

      if (filters?.initiative_category) {
        query = query.eq('initiative_category', filters.initiative_category);
      }

      if (filters?.initiatives_status) {
        query = query.eq('initiatives_status', filters.initiatives_status);
      }

      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching strategic initiatives:', error);
      return [];
    }
  }

  /**
   * Get single initiative by ID
   */
  static async getInitiativeById(initiativeId: string): Promise<StrategicInitiative | null> {
    try {
      const { data, error } = await supabase
        .from('ref_strategic_initiative')
        .select('*')
        .eq('initiative_id', initiativeId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching initiative:', error);
      return null;
    }
  }

  /**
   * Update initiative status
   */
  static async updateInitiativeStatus(
    initiativeId: string,
    status: StrategicInitiative['initiatives_status'],
    completionPercentage?: number,
    updatedBy?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const updateData: any = {
        initiatives_status: status,
        last_status_update: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: updatedBy
      };

      if (completionPercentage !== undefined) {
        updateData.completion_percentage = completionPercentage;
      }

      const { error } = await supabase
        .from('ref_strategic_initiative')
        .update(updateData)
        .eq('initiative_id', initiativeId);

      if (error) throw error;

      return {
        success: true,
        message: 'Initiative status updated successfully'
      };
    } catch (error) {
      console.error('Error updating initiative status:', error);
      return { success: false, message: 'Failed to update initiative status' };
    }
  }

  /**
   * Get risks for an initiative
   */
  static async getRisksByInitiative(initiativeId: string): Promise<RiskLog[]> {
    try {
      const { data, error } = await supabase
        .from('risk_log')
        .select('*')
        .eq('initiative_id', initiativeId)
        .order('risk_score', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching risks:', error);
      return [];
    }
  }

  /**
   * Get all risks with optional filtering
   */
  static async getAllRisks(filters?: {
    severity?: string;
    risk_status?: string;
    initiative_id?: string;
  }): Promise<RiskLog[]> {
    try {
      let query = supabase
        .from('risk_log')
        .select('*')
        .order('risk_score', { ascending: false });

      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
      }

      if (filters?.risk_status) {
        query = query.eq('risk_status', filters.risk_status);
      }

      if (filters?.initiative_id) {
        query = query.eq('initiative_id', filters.initiative_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all risks:', error);
      return [];
    }
  }

  /**
   * Create new risk log entry
   */
  static async createRisk(risk: Omit<RiskLog, 'risk_id' | 'created_at' | 'updated_at' | 'risk_score'>): Promise<{
    success: boolean;
    message: string;
    risk_id?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('risk_log')
        .insert({
          ...risk,
          identified_date: risk.identified_date || new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) throw error;

      // Update initiative risk count
      await this.updateInitiativeRiskCount(risk.initiative_id);

      return {
        success: true,
        message: 'Risk created successfully',
        risk_id: data.risk_id
      };
    } catch (error) {
      console.error('Error creating risk:', error);
      return { success: false, message: 'Failed to create risk' };
    }
  }

  /**
   * Update risk status
   */
  static async updateRiskStatus(
    riskId: string,
    status: RiskLog['risk_status'],
    updatedBy?: string,
    notes?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const updateData: any = {
        risk_status: status,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy
      };

      if (notes) {
        updateData.notes = notes;
      }

      if (status === 'Mitigated' || status === 'Closed') {
        updateData.last_review_date = new Date().toISOString().split('T')[0];
      }

      const { error } = await supabase
        .from('risk_log')
        .update(updateData)
        .eq('risk_id', riskId);

      if (error) throw error;

      return {
        success: true,
        message: 'Risk status updated successfully'
      };
    } catch (error) {
      console.error('Error updating risk status:', error);
      return { success: false, message: 'Failed to update risk status' };
    }
  }

  /**
   * Get issues for an initiative
   */
  static async getIssuesByInitiative(initiativeId: string): Promise<IssueLog[]> {
    try {
      const { data, error } = await supabase
        .from('issue_log')
        .select('*')
        .eq('initiative_id', initiativeId)
        .order('severity', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching issues:', error);
      return [];
    }
  }

  /**
   * Get all issues with optional filtering
   */
  static async getAllIssues(filters?: {
    severity?: string;
    issue_status?: string;
    initiative_id?: string;
  }): Promise<IssueLog[]> {
    try {
      let query = supabase
        .from('issue_log')
        .select('*')
        .order('severity', { ascending: false })
        .order('reported_date', { ascending: false });

      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
      }

      if (filters?.issue_status) {
        query = query.eq('issue_status', filters.issue_status);
      }

      if (filters?.initiative_id) {
        query = query.eq('initiative_id', filters.initiative_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all issues:', error);
      return [];
    }
  }

  /**
   * Create new issue log entry
   */
  static async createIssue(issue: Omit<IssueLog, 'issue_id' | 'created_at' | 'updated_at'>): Promise<{
    success: boolean;
    message: string;
    issue_id?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('issue_log')
        .insert({
          ...issue,
          reported_date: issue.reported_date || new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) throw error;

      // Update initiative issue count
      await this.updateInitiativeIssueCount(issue.initiative_id);

      return {
        success: true,
        message: 'Issue created successfully',
        issue_id: data.issue_id
      };
    } catch (error) {
      console.error('Error creating issue:', error);
      return { success: false, message: 'Failed to create issue' };
    }
  }

  /**
   * Update issue status and completion
   */
  static async updateIssueStatus(
    issueId: string,
    status: IssueLog['issue_status'],
    completionStatus?: number,
    updatedBy?: string,
    remarks?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const updateData: any = {
        issue_status: status,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy
      };

      if (completionStatus !== undefined) {
        updateData.completion_status = completionStatus;
      }

      if (remarks) {
        updateData.remarks = remarks;
      }

      if (status === 'Resolved' || status === 'Closed') {
        updateData.resolved_date = new Date().toISOString().split('T')[0];
        updateData.completion_status = 100;
      }

      const { error } = await supabase
        .from('issue_log')
        .update(updateData)
        .eq('issue_id', issueId);

      if (error) throw error;

      return {
        success: true,
        message: 'Issue status updated successfully'
      };
    } catch (error) {
      console.error('Error updating issue status:', error);
      return { success: false, message: 'Failed to update issue status' };
    }
  }

  /**
   * Update initiative risk count
   */
  private static async updateInitiativeRiskCount(initiativeId: string): Promise<void> {
    try {
      const risks = await this.getRisksByInitiative(initiativeId);
      const openRisks = risks.filter(r => r.risk_status === 'Open' || r.risk_status === 'In Mitigation').length;

      await supabase
        .from('ref_strategic_initiative')
        .update({ risks_identified: openRisks })
        .eq('initiative_id', initiativeId);
    } catch (error) {
      console.error('Error updating initiative risk count:', error);
    }
  }

  /**
   * Update initiative issue count
   */
  private static async updateInitiativeIssueCount(initiativeId: string): Promise<void> {
    try {
      const issues = await this.getIssuesByInitiative(initiativeId);
      const openIssues = issues.filter(i => i.issue_status === 'Open' || i.issue_status === 'In Progress').length;

      await supabase
        .from('ref_strategic_initiative')
        .update({ issues_identified: openIssues })
        .eq('initiative_id', initiativeId);
    } catch (error) {
      console.error('Error updating initiative issue count:', error);
    }
  }

  /**
   * Check for overdue milestones and generate reminders
   */
  static async checkOverdueMilestones(): Promise<{
    overdue: Array<{ initiative: StrategicInitiative; milestone: Milestone }>;
    nearing: Array<{ initiative: StrategicInitiative; milestone: Milestone; days_left: number }>;
  }> {
    try {
      const initiatives = await this.getInitiatives({
        initiatives_status: 'In Progress'
      });

      const today = new Date();
      const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const overdue: Array<{ initiative: StrategicInitiative; milestone: Milestone }> = [];
      const nearing: Array<{ initiative: StrategicInitiative; milestone: Milestone; days_left: number }> = [];

      initiatives.forEach(initiative => {
        (initiative.milestones || []).forEach(milestone => {
          if (milestone.status !== 'Completed') {
            const milestoneDate = new Date(milestone.date);

            if (milestoneDate < today) {
              overdue.push({ initiative, milestone });
            } else if (milestoneDate <= sevenDaysFromNow) {
              const days_left = Math.ceil((milestoneDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
              nearing.push({ initiative, milestone, days_left });
            }
          }
        });
      });

      return { overdue, nearing };
    } catch (error) {
      console.error('Error checking overdue milestones:', error);
      return { overdue: [], nearing: [] };
    }
  }
}
