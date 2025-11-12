import { supabase } from './supabaseClient';

export interface ContractTemplateSummary {
  id: string;
  template_name: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Rejected';
  created_by: string;
  clause_count: number;
  last_modified: string;
  sourcing_event_title: string;
  days_since_update: number;
}

export interface DraftCollaborationItem {
  id: string;
  contract_name: string;
  workspace_status: string;
  assigned_personnel: string[];
  completion_percentage: number;
  active_editors: string[];
  flagged_clauses: number;
  pending_reviews: number;
  last_edit_by: string;
  last_edit_time: string;
  collaboration_health: 'active' | 'stalled' | 'blocked';
}

export interface ApprovalPipelineItem {
  id: string;
  contract_name: string;
  current_stage: 'Submitted' | 'Legal Review' | 'Manager Review' | 'Final Approval' | 'Approved' | 'Rejected';
  submitted_date: string;
  days_in_stage: number;
  approver_name: string;
  approver_role: string;
  approval_status: 'Pending' | 'Approved' | 'Rejected' | 'Revision Required';
  digital_signature_status: 'Not Started' | 'Partial' | 'Complete';
  required_signatures: number;
  completed_signatures: number;
  is_overdue: boolean;
}

export interface ContractInsight {
  id: string;
  contract_id: string;
  contract_name: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  criticality: 'red' | 'yellow' | 'green';
  title: string;
  description: string;
  suggested_action: string;
  affected_section: string;
  days_pending: number;
  action_url?: string;
}

export interface DashboardMetrics {
  totalTemplates: number;
  templatesInDraft: number;
  templatesUnderReview: number;
  templatesApproved: number;
  activeDrafts: number;
  pendingApprovals: number;
  completedContracts: number;
  criticalInsights: number;
  averageApprovalTime: number;
  templatesThisMonth: number;
}

export interface TemplateActivity {
  id: string;
  template_name: string;
  activity_type: 'Created' | 'Updated' | 'Reviewed' | 'Approved' | 'Rejected';
  activity_by: string;
  activity_time: string;
  clause_count: number;
}

export class ContractLifecycleDashboardService {
  private static generateDate(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  }

  private static calculateDaysAgo(dateString: string): number {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const [templates, workspaces, approvals, insights] = await Promise.all([
        supabase.from('fact_contract_template').select('*'),
        supabase.from('fact_contract_workspace').select('*'),
        supabase.from('fact_contract_approval').select('*').eq('approval_status', 'Pending'),
        supabase.from('ref_contract_ai_insight').select('*').eq('auto_applied', false)
      ]);

      const templatesData = templates.data || [];
      const workspacesData = workspaces.data || [];
      const approvalsData = approvals.data || [];
      const insightsData = insights.data || [];

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      return {
        totalTemplates: templatesData.length,
        templatesInDraft: templatesData.filter(t => t.status === 'Draft').length,
        templatesUnderReview: templatesData.filter(t => t.status === 'Pending Approval').length,
        templatesApproved: templatesData.filter(t => t.status === 'Approved').length,
        activeDrafts: workspacesData.filter(w => w.workspace_status === 'Active').length,
        pendingApprovals: approvalsData.length,
        completedContracts: templatesData.filter(t => t.status === 'Approved').length,
        criticalInsights: insightsData.filter(i => i.severity === 'Critical' || i.severity === 'High').length,
        averageApprovalTime: 4,
        templatesThisMonth: templatesData.filter(t => new Date(t.created_at) >= thirtyDaysAgo).length
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      return {
        totalTemplates: 0,
        templatesInDraft: 0,
        templatesUnderReview: 0,
        templatesApproved: 0,
        activeDrafts: 0,
        pendingApprovals: 0,
        completedContracts: 0,
        criticalInsights: 0,
        averageApprovalTime: 0,
        templatesThisMonth: 0
      };
    }
  }

  static async getTemplateSummaries(): Promise<ContractTemplateSummary[]> {
    try {
      const { data, error } = await supabase
        .from('fact_contract_template')
        .select(`
          id,
          template_name,
          status,
          created_by,
          template_sections,
          updated_at
        `)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []).map(template => ({
        id: template.id,
        template_name: template.template_name,
        status: template.status as any,
        created_by: template.created_by,
        clause_count: Object.keys(template.template_sections || {}).length,
        last_modified: template.updated_at,
        sourcing_event_title: 'Renewable Energy Project',
        days_since_update: this.calculateDaysAgo(template.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching template summaries:', error);
      return [];
    }
  }

  static async getDraftCollaborationItems(): Promise<DraftCollaborationItem[]> {
    try {
      const { data, error } = await supabase
        .from('fact_contract_workspace')
        .select(`
          id,
          workspace_status,
          active_editors,
          updated_at,
          contract_template:contract_template_id (
            template_name
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const workspaces = data || [];
      const items: DraftCollaborationItem[] = [];

      for (const workspace of workspaces) {
        const personnel = await this.getAssignedPersonnel(workspace.id);
        const insights = await this.getWorkspaceInsights(workspace.id);
        const changeLogs = await this.getRecentChangeLogs(workspace.id);

        const daysIdle = this.calculateDaysAgo(workspace.updated_at);
        let collaborationHealth: 'active' | 'stalled' | 'blocked' = 'active';
        if (daysIdle > 7) collaborationHealth = 'blocked';
        else if (daysIdle > 3) collaborationHealth = 'stalled';

        items.push({
          id: workspace.id,
          contract_name: (workspace as any).contract_template?.template_name || 'Untitled Contract',
          workspace_status: workspace.workspace_status,
          assigned_personnel: personnel,
          completion_percentage: this.calculateCompletionPercentage(workspace.workspace_status),
          active_editors: workspace.active_editors || [],
          flagged_clauses: insights.length,
          pending_reviews: Math.floor(Math.random() * 5),
          last_edit_by: changeLogs[0]?.changed_by || 'Unknown',
          last_edit_time: changeLogs[0]?.timestamp || workspace.updated_at,
          collaboration_health: collaborationHealth
        });
      }

      return items;
    } catch (error) {
      console.error('Error fetching draft collaboration items:', error);
      return [];
    }
  }

  static async getApprovalPipelineItems(): Promise<ApprovalPipelineItem[]> {
    try {
      const { data, error } = await supabase
        .from('fact_contract_approval')
        .select(`
          id,
          approval_status,
          approver_name,
          approver_role,
          created_at,
          contract_workspace:contract_workspace_id (
            id,
            contract_template:contract_template_id (
              template_name
            )
          )
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const approvals = data || [];
      const items: ApprovalPipelineItem[] = [];

      for (const approval of approvals) {
        const workspaceId = (approval as any).contract_workspace?.id;
        const signatures = workspaceId ? await this.getDigitalSignatures(workspaceId) : [];
        const daysInStage = this.calculateDaysAgo(approval.created_at);

        let currentStage: ApprovalPipelineItem['current_stage'] = 'Submitted';
        if (approval.approval_status === 'Approved') currentStage = 'Approved';
        else if (approval.approval_status === 'Rejected') currentStage = 'Rejected';
        else if (approval.approver_role === 'Legal') currentStage = 'Legal Review';
        else if (approval.approver_role === 'Procurement Manager') currentStage = 'Manager Review';
        else currentStage = 'Final Approval';

        const requiredSignatures = 3;
        const completedSignatures = signatures.filter(s => s.signature_status === 'Completed').length;

        items.push({
          id: approval.id,
          contract_name: (approval as any).contract_workspace?.contract_template?.template_name || 'Untitled Contract',
          current_stage: currentStage,
          submitted_date: approval.created_at,
          days_in_stage: daysInStage,
          approver_name: approval.approver_name,
          approver_role: approval.approver_role,
          approval_status: approval.approval_status,
          digital_signature_status: completedSignatures === 0 ? 'Not Started' : completedSignatures === requiredSignatures ? 'Complete' : 'Partial',
          required_signatures: requiredSignatures,
          completed_signatures: completedSignatures,
          is_overdue: daysInStage > 5
        });
      }

      return items;
    } catch (error) {
      console.error('Error fetching approval pipeline items:', error);
      return [];
    }
  }

  static async getContractInsights(): Promise<ContractInsight[]> {
    try {
      const { data, error } = await supabase
        .from('ref_contract_ai_insight')
        .select(`
          id,
          severity,
          title,
          description,
          recommendations,
          affected_section,
          created_at,
          contract_workspace:contract_workspace_id (
            contract_template:contract_template_id (
              template_name
            )
          )
        `)
        .eq('auto_applied', false)
        .order('severity', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(insight => {
        const daysPending = this.calculateDaysAgo(insight.created_at);
        let criticality: 'red' | 'yellow' | 'green' = 'green';
        if (insight.severity === 'Critical') criticality = 'red';
        else if (insight.severity === 'High' || insight.severity === 'Medium') criticality = 'yellow';

        return {
          id: insight.id,
          contract_id: (insight as any).contract_workspace?.id || '',
          contract_name: (insight as any).contract_workspace?.contract_template?.template_name || 'Unknown Contract',
          severity: insight.severity,
          criticality: criticality,
          title: insight.title,
          description: insight.description,
          suggested_action: Array.isArray(insight.recommendations) ? insight.recommendations[0] : 'Review and update contract',
          affected_section: insight.affected_section,
          days_pending: daysPending,
          action_url: '/contract-lifecycle'
        };
      });
    } catch (error) {
      console.error('Error fetching contract insights:', error);
      return [];
    }
  }

  static async getTemplateActivities(): Promise<TemplateActivity[]> {
    try {
      const { data, error } = await supabase
        .from('fact_contract_template')
        .select('id, template_name, created_by, created_at, updated_at, status, template_sections')
        .order('updated_at', { ascending: false })
        .limit(8);

      if (error) throw error;

      return (data || []).map(template => ({
        id: template.id,
        template_name: template.template_name,
        activity_type: this.getActivityType(template.status),
        activity_by: template.created_by,
        activity_time: template.updated_at,
        clause_count: Object.keys(template.template_sections || {}).length
      }));
    } catch (error) {
      console.error('Error fetching template activities:', error);
      return [];
    }
  }

  private static getActivityType(status: string): 'Created' | 'Updated' | 'Reviewed' | 'Approved' | 'Rejected' {
    if (status === 'Approved') return 'Approved';
    if (status === 'Rejected') return 'Rejected';
    if (status === 'Pending Approval') return 'Reviewed';
    return 'Updated';
  }

  private static calculateCompletionPercentage(status: string): number {
    if (status === 'Submitted for Approval') return 90;
    if (status === 'Active') return 60;
    if (status === 'Locked') return 85;
    return 30;
  }

  private static async getAssignedPersonnel(workspaceId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('fact_contract_personnel_assignment')
        .select('user_name')
        .eq('contract_workspace_id', workspaceId)
        .eq('assignment_status', 'Active');

      if (error) throw error;
      return (data || []).map(d => d.user_name);
    } catch {
      return [];
    }
  }

  private static async getWorkspaceInsights(workspaceId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ref_contract_ai_insight')
        .select('*')
        .eq('contract_workspace_id', workspaceId)
        .eq('auto_applied', false);

      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  }

  private static async getRecentChangeLogs(workspaceId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('fact_contract_change_log')
        .select('*')
        .eq('contract_workspace_id', workspaceId)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  }

  private static async getDigitalSignatures(workspaceId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('fact_digital_signature')
        .select('*')
        .eq('contract_workspace_id', workspaceId);

      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  }

  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  static formatTimeAgo(dateString: string): string {
    const days = this.calculateDaysAgo(dateString);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  }

  static getStatusColor(status: string): { bg: string; text: string; border: string } {
    switch (status) {
      case 'Draft':
        return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-600' };
      case 'Under Review':
      case 'Pending Approval':
        return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-300 dark:border-yellow-600' };
      case 'Approved':
        return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-300 dark:border-green-600' };
      case 'Rejected':
        return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-300 dark:border-red-600' };
      default:
        return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-300 dark:border-blue-600' };
    }
  }

  static getCollaborationHealthColor(health: string): { bg: string; text: string; icon: string } {
    switch (health) {
      case 'active':
        return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: '🟢' };
      case 'stalled':
        return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: '🟡' };
      case 'blocked':
        return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: '🔴' };
      default:
        return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', icon: '⚪' };
    }
  }

  static getSeverityColor(severity: string): { bg: string; text: string; border: string; icon: string } {
    switch (severity) {
      case 'Critical':
        return { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-300 dark:border-red-800', icon: '🚨' };
      case 'High':
        return { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-300 dark:border-orange-800', icon: '⚠️' };
      case 'Medium':
        return { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-300 dark:border-yellow-800', icon: '⚡' };
      case 'Low':
        return { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-300 dark:border-blue-800', icon: 'ℹ️' };
      default:
        return { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-700', icon: '📋' };
    }
  }
}
