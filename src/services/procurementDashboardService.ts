import { supabase } from './supabaseClient';

export interface RenewableSourcingEvent {
  id: string;
  title: string;
  category: 'Solar' | 'Wind' | 'Battery';
  description: string;
  status: 'Draft' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  deadline: string;
  assigned_personnel: string;
  budget_estimate: number;
  vendor_invited_count: number;
  vendor_submitted_count: number;
  evaluation_progress: number;
  approval_status: 'Pending' | 'Approved' | 'Rejected';
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface VendorSubmission {
  id: string;
  sourcing_event_id: string;
  vendor_name: string;
  invitation_date: string;
  submission_date: string | null;
  submission_status: 'Invited' | 'Submitted' | 'Pending' | 'Overdue';
  document_completeness: number;
  technical_doc_status: 'Complete' | 'Incomplete' | 'Missing';
  financial_doc_status: 'Complete' | 'Incomplete' | 'Missing';
  created_at?: string;
  updated_at?: string;
}

export interface TenderEvaluation {
  id: string;
  sourcing_event_id: string;
  evaluator_name: string;
  evaluation_criteria: 'Technical' | 'Financial' | 'Compliance' | 'Overall';
  progress_percentage: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  assigned_date: string;
  completion_date: string | null;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProcurementInsight {
  id: string;
  sourcing_event_id: string | null;
  insight_type: 'Deadline' | 'Participation' | 'Assignment' | 'Approval' | 'Evaluation';
  severity: 'Critical' | 'Warning' | 'Info';
  title: string;
  description: string;
  suggested_action: string;
  is_resolved: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardSummary {
  totalEvents: number;
  eventsByStatus: {
    draft: number;
    scheduled: number;
    inProgress: number;
    completed: number;
  };
  totalVendorsInvited: number;
  totalVendorsSubmitted: number;
  submissionRate: number;
  averageEvaluationProgress: number;
  pendingApprovals: number;
  criticalInsights: number;
  warningInsights: number;
}

export interface EventWithDetails extends RenewableSourcingEvent {
  vendor_submissions: VendorSubmission[];
  evaluations: TenderEvaluation[];
}

export class ProcurementDashboardService {
  static async getAllSourcingEvents(organizationId: string = 'indonesia-power'): Promise<RenewableSourcingEvent[]> {
    try {
      const { data, error } = await supabase
        .from('renewable_sourcing_events')
        .select('*')
        .eq('organization_id', organizationId)
        .order('deadline', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching sourcing events:', error);
      return [];
    }
  }

  static async getEventById(eventId: string): Promise<EventWithDetails | null> {
    try {
      const { data: event, error: eventError } = await supabase
        .from('renewable_sourcing_events')
        .select('*')
        .eq('id', eventId)
        .maybeSingle();

      if (eventError) throw eventError;
      if (!event) return null;

      const { data: submissions, error: submissionsError } = await supabase
        .from('vendor_submissions')
        .select('*')
        .eq('sourcing_event_id', eventId);

      if (submissionsError) throw submissionsError;

      const { data: evaluations, error: evaluationsError } = await supabase
        .from('tender_evaluations')
        .select('*')
        .eq('sourcing_event_id', eventId);

      if (evaluationsError) throw evaluationsError;

      return {
        ...event,
        vendor_submissions: submissions || [],
        evaluations: evaluations || []
      };
    } catch (error) {
      console.error('Error fetching event details:', error);
      return null;
    }
  }

  static async getVendorSubmissions(eventId: string): Promise<VendorSubmission[]> {
    try {
      const { data, error } = await supabase
        .from('vendor_submissions')
        .select('*')
        .eq('sourcing_event_id', eventId)
        .order('invitation_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching vendor submissions:', error);
      return [];
    }
  }

  static async getTenderEvaluations(eventId: string): Promise<TenderEvaluation[]> {
    try {
      const { data, error } = await supabase
        .from('tender_evaluations')
        .select('*')
        .eq('sourcing_event_id', eventId)
        .order('assigned_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tender evaluations:', error);
      return [];
    }
  }

  static async getProcurementInsights(isResolvedFilter?: boolean): Promise<ProcurementInsight[]> {
    try {
      let query = supabase
        .from('procurement_insights')
        .select('*')
        .order('severity', { ascending: true })
        .order('created_at', { ascending: false });

      if (isResolvedFilter !== undefined) {
        query = query.eq('is_resolved', isResolvedFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching procurement insights:', error);
      return [];
    }
  }

  static async getDashboardSummary(organizationId: string = 'indonesia-power'): Promise<DashboardSummary> {
    try {
      const events = await this.getAllSourcingEvents(organizationId);
      const insights = await this.getProcurementInsights(false);

      const totalEvents = events.length;
      const eventsByStatus = {
        draft: events.filter(e => e.status === 'Draft').length,
        scheduled: events.filter(e => e.status === 'Scheduled').length,
        inProgress: events.filter(e => e.status === 'In Progress').length,
        completed: events.filter(e => e.status === 'Completed').length
      };

      const totalVendorsInvited = events.reduce((sum, e) => sum + e.vendor_invited_count, 0);
      const totalVendorsSubmitted = events.reduce((sum, e) => sum + e.vendor_submitted_count, 0);
      const submissionRate = totalVendorsInvited > 0
        ? Math.round((totalVendorsSubmitted / totalVendorsInvited) * 100)
        : 0;

      const activeEvents = events.filter(e => e.status === 'In Progress' || e.status === 'Scheduled');
      const averageEvaluationProgress = activeEvents.length > 0
        ? Math.round(activeEvents.reduce((sum, e) => sum + e.evaluation_progress, 0) / activeEvents.length)
        : 0;

      const pendingApprovals = events.filter(e => e.approval_status === 'Pending').length;
      const criticalInsights = insights.filter(i => i.severity === 'Critical').length;
      const warningInsights = insights.filter(i => i.severity === 'Warning').length;

      return {
        totalEvents,
        eventsByStatus,
        totalVendorsInvited,
        totalVendorsSubmitted,
        submissionRate,
        averageEvaluationProgress,
        pendingApprovals,
        criticalInsights,
        warningInsights
      };
    } catch (error) {
      console.error('Error generating dashboard summary:', error);
      return {
        totalEvents: 0,
        eventsByStatus: { draft: 0, scheduled: 0, inProgress: 0, completed: 0 },
        totalVendorsInvited: 0,
        totalVendorsSubmitted: 0,
        submissionRate: 0,
        averageEvaluationProgress: 0,
        pendingApprovals: 0,
        criticalInsights: 0,
        warningInsights: 0
      };
    }
  }

  static async getVendorSubmissionStats(): Promise<{
    invited: number;
    submitted: number;
    pending: number;
    overdue: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('vendor_submissions')
        .select('submission_status');

      if (error) throw error;

      const stats = {
        invited: 0,
        submitted: 0,
        pending: 0,
        overdue: 0
      };

      data?.forEach(submission => {
        if (submission.submission_status === 'Invited') stats.invited++;
        else if (submission.submission_status === 'Submitted') stats.submitted++;
        else if (submission.submission_status === 'Pending') stats.pending++;
        else if (submission.submission_status === 'Overdue') stats.overdue++;
      });

      return stats;
    } catch (error) {
      console.error('Error fetching vendor submission stats:', error);
      return { invited: 0, submitted: 0, pending: 0, overdue: 0 };
    }
  }

  static async updateEventStatus(eventId: string, status: RenewableSourcingEvent['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('renewable_sourcing_events')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', eventId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating event status:', error);
      return false;
    }
  }

  static async resolveInsight(insightId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('procurement_insights')
        .update({ is_resolved: true, updated_at: new Date().toISOString() })
        .eq('id', insightId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error resolving insight:', error);
      return false;
    }
  }

  static getCategoryIcon(category: string): string {
    switch (category) {
      case 'Solar':
        return '☀️';
      case 'Wind':
        return '💨';
      case 'Battery':
        return '🔋';
      default:
        return '⚡';
    }
  }

  static getCategoryColor(category: string): {
    bg: string;
    text: string;
    border: string;
    gradient: string;
  } {
    switch (category) {
      case 'Solar':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-950/30',
          text: 'text-yellow-700 dark:text-yellow-300',
          border: 'border-yellow-200 dark:border-yellow-800',
          gradient: 'from-yellow-500 to-orange-500'
        };
      case 'Wind':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/30',
          text: 'text-blue-700 dark:text-blue-300',
          border: 'border-blue-200 dark:border-blue-800',
          gradient: 'from-blue-500 to-cyan-500'
        };
      case 'Battery':
        return {
          bg: 'bg-green-50 dark:bg-green-950/30',
          text: 'text-green-700 dark:text-green-300',
          border: 'border-green-200 dark:border-green-800',
          gradient: 'from-green-500 to-emerald-500'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-200 dark:border-gray-700',
          gradient: 'from-gray-500 to-gray-600'
        };
    }
  }

  static getStatusColor(status: string): {
    bg: string;
    text: string;
    border: string;
  } {
    switch (status) {
      case 'Draft':
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-300 dark:border-gray-600'
        };
      case 'Scheduled':
        return {
          bg: 'bg-blue-100 dark:bg-blue-950/30',
          text: 'text-blue-700 dark:text-blue-300',
          border: 'border-blue-300 dark:border-blue-700'
        };
      case 'In Progress':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-950/30',
          text: 'text-yellow-700 dark:text-yellow-300',
          border: 'border-yellow-300 dark:border-yellow-700'
        };
      case 'Completed':
        return {
          bg: 'bg-green-100 dark:bg-green-950/30',
          text: 'text-green-700 dark:text-green-300',
          border: 'border-green-300 dark:border-green-700'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-300 dark:border-gray-600'
        };
    }
  }

  static getSeverityColor(severity: string): {
    bg: string;
    text: string;
    border: string;
    icon: string;
  } {
    switch (severity) {
      case 'Critical':
        return {
          bg: 'bg-red-50 dark:bg-red-950/30',
          text: 'text-red-700 dark:text-red-300',
          border: 'border-red-300 dark:border-red-700',
          icon: '🔴'
        };
      case 'Warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-950/30',
          text: 'text-yellow-700 dark:text-yellow-300',
          border: 'border-yellow-300 dark:border-yellow-700',
          icon: '⚠️'
        };
      case 'Info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/30',
          text: 'text-blue-700 dark:text-blue-300',
          border: 'border-blue-300 dark:border-blue-700',
          icon: 'ℹ️'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-300 dark:border-gray-600',
          icon: '📌'
        };
    }
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  static getDaysUntilDeadline(deadline: string): number {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}
