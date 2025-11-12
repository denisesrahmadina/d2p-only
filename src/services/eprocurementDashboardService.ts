export interface DashboardMetrics {
  activeSourcingEvents: number;
  upcomingDeadlines: number;
  assignedTasks: number;
  vendorSubmissions: {
    invited: number;
    submitted: number;
    ratio: number;
  };
  evaluationProgress: {
    pending: number;
    inProgress: number;
    completed: number;
    completionPercentage: number;
  };
  reverseAuctions: {
    upcoming: number;
    active: number;
    nextAuctionStartsIn: number | null;
  };
  approvalQueue: number;
  recentlyCompleted: number;
}

export interface SourcingEventStatus {
  id: string;
  title: string;
  category: string;
  status: 'Draft' | 'Scheduled' | 'In Progress' | 'Evaluation' | 'Completed';
  deadline: string;
  assignedTo: string;
  vendorCount: number;
  daysUntilDeadline: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
}

export interface TenderMilestone {
  id: string;
  eventId: string;
  eventTitle: string;
  milestoneName: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  responsible: string;
  progress: number;
}

export interface TaskItem {
  id: string;
  title: string;
  category: 'Planning' | 'Preparation' | 'Execution';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
  daysOverdue: number;
}

export interface ReverseAuctionItem {
  id: string;
  eventTitle: string;
  startTime: string;
  status: 'upcoming' | 'active' | 'completed';
  participantCount: number;
  startingPrice: number;
  currentBestBid: number | null;
  minutesUntilStart: number | null;
}

export interface ApprovalQueueItem {
  id: string;
  documentType: string;
  eventTitle: string;
  submitter: string;
  submissionDate: string;
  daysInQueue: number;
  priority: 'urgent' | 'normal';
}

export interface AlertItem {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  eventId?: string;
  timestamp: string;
  actionRequired: boolean;
}

export interface InsightItem {
  id: string;
  type: 'recommendation' | 'warning' | 'opportunity';
  message: string;
  criticality: 'red' | 'yellow' | 'green';
  actionUrl?: string;
}

export interface EventStatusDistribution {
  draft: number;
  scheduled: number;
  inProgress: number;
  evaluation: number;
  completed: number;
}

export interface VendorSubmission {
  id: string;
  eventId: string;
  eventTitle: string;
  vendorName: string;
  submissionDate: string;
  documentCount: number;
  requiredDocumentCount: number;
  completeness: number;
  status: 'complete' | 'partial' | 'incomplete';
}

export interface WinnerSummary {
  id: string;
  eventTitle: string;
  category: string;
  winnerVendor: string;
  winnerScore: number;
  runnerUpVendor: string;
  runnerUpScore: number;
  contractValue: number;
  awardDate: string;
  evaluationDuration: number;
}

export interface EvaluationStatus {
  id: string;
  eventId: string;
  eventTitle: string;
  evaluatorName: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  vendorsAssigned: number;
  vendorsCompleted: number;
  daysInStatus: number;
  isBottleneck: boolean;
}

export class EProcurementDashboardService {
  private static generateRandomDate(daysFromNow: number, variance: number = 5): string {
    const days = daysFromNow + Math.floor(Math.random() * variance * 2) - variance;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  private static calculateDaysUntil(dateString: string): number {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static generateMockMetrics(): DashboardMetrics {
    const totalInvited = 45;
    const totalSubmitted = 32;

    return {
      activeSourcingEvents: 12,
      upcomingDeadlines: 5,
      assignedTasks: 18,
      vendorSubmissions: {
        invited: totalInvited,
        submitted: totalSubmitted,
        ratio: Math.round((totalSubmitted / totalInvited) * 100)
      },
      evaluationProgress: {
        pending: 4,
        inProgress: 6,
        completed: 8,
        completionPercentage: 67
      },
      reverseAuctions: {
        upcoming: 3,
        active: 1,
        nextAuctionStartsIn: 115
      },
      approvalQueue: 7,
      recentlyCompleted: 15
    };
  }

  static generateMockSourcingEvents(): SourcingEventStatus[] {
    const events = [
      { title: 'Solar Panel Procurement - 50 MW', category: 'Renewable Energy', status: 'In Progress' as const, deadline: this.generateRandomDate(5), assignedTo: 'Sarah Johnson', vendorCount: 8 },
      { title: 'Wind Turbine Components', category: 'Equipment', status: 'Scheduled' as const, deadline: this.generateRandomDate(12), assignedTo: 'Michael Chen', vendorCount: 5 },
      { title: 'Battery Energy Storage System', category: 'Energy Storage', status: 'Evaluation' as const, deadline: this.generateRandomDate(2), assignedTo: 'Amanda Rodriguez', vendorCount: 12 },
      { title: 'Grid Integration Equipment', category: 'Infrastructure', status: 'Draft' as const, deadline: this.generateRandomDate(20), assignedTo: 'David Kim', vendorCount: 0 },
      { title: 'Maintenance Services - 2-Year Contract', category: 'Services', status: 'In Progress' as const, deadline: this.generateRandomDate(8), assignedTo: 'Jennifer Lee', vendorCount: 6 },
      { title: 'Control System Upgrade', category: 'Technology', status: 'Scheduled' as const, deadline: this.generateRandomDate(15), assignedTo: 'Robert Taylor', vendorCount: 4 },
      { title: 'Emergency Backup Generators', category: 'Equipment', status: 'In Progress' as const, deadline: this.generateRandomDate(3), assignedTo: 'Sarah Johnson', vendorCount: 1 },
      { title: 'Transformer Replacement', category: 'Infrastructure', status: 'Evaluation' as const, deadline: this.generateRandomDate(1), assignedTo: 'Michael Chen', vendorCount: 9 },
      { title: 'Cooling System Components', category: 'Equipment', status: 'Scheduled' as const, deadline: this.generateRandomDate(18), assignedTo: 'Amanda Rodriguez', vendorCount: 7 },
      { title: 'Security System Installation', category: 'Services', status: 'Draft' as const, deadline: this.generateRandomDate(25), assignedTo: 'David Kim', vendorCount: 0 },
      { title: 'Environmental Monitoring Equipment', category: 'Technology', status: 'In Progress' as const, deadline: this.generateRandomDate(10), assignedTo: 'Jennifer Lee', vendorCount: 5 },
      { title: 'Fire Suppression System', category: 'Safety', status: 'Scheduled' as const, deadline: this.generateRandomDate(22), assignedTo: 'Robert Taylor', vendorCount: 3 }
    ];

    return events.map((event, idx) => {
      const daysUntil = this.calculateDaysUntil(event.deadline);
      let urgency: 'critical' | 'high' | 'medium' | 'low' = 'low';
      if (daysUntil <= 2) urgency = 'critical';
      else if (daysUntil <= 5) urgency = 'high';
      else if (daysUntil <= 10) urgency = 'medium';

      return {
        id: `SE-2025-${String(idx + 1).padStart(3, '0')}`,
        ...event,
        daysUntilDeadline: daysUntil,
        urgency
      };
    });
  }

  static generateMockMilestones(): TenderMilestone[] {
    const milestones = [
      { eventTitle: 'Solar Panel Procurement', milestoneName: 'Vendor Registration', startDate: this.generateRandomDate(-5), endDate: this.generateRandomDate(2), status: 'In Progress' as const, responsible: 'Sarah Johnson', progress: 75 },
      { eventTitle: 'Solar Panel Procurement', milestoneName: 'Document Submission', startDate: this.generateRandomDate(2), endDate: this.generateRandomDate(8), status: 'Pending' as const, responsible: 'Sarah Johnson', progress: 0 },
      { eventTitle: 'Wind Turbine Components', milestoneName: 'Technical Evaluation', startDate: this.generateRandomDate(-3), endDate: this.generateRandomDate(5), status: 'In Progress' as const, responsible: 'Michael Chen', progress: 60 },
      { eventTitle: 'Battery Energy Storage', milestoneName: 'Price Negotiation', startDate: this.generateRandomDate(-1), endDate: this.generateRandomDate(3), status: 'In Progress' as const, responsible: 'Amanda Rodriguez', progress: 85 },
      { eventTitle: 'Grid Integration Equipment', milestoneName: 'Tender Preparation', startDate: this.generateRandomDate(5), endDate: this.generateRandomDate(12), status: 'Pending' as const, responsible: 'David Kim', progress: 0 },
      { eventTitle: 'Maintenance Services', milestoneName: 'Reverse Auction', startDate: this.generateRandomDate(3), endDate: this.generateRandomDate(4), status: 'Pending' as const, responsible: 'Jennifer Lee', progress: 30 },
      { eventTitle: 'Control System Upgrade', milestoneName: 'Vendor Shortlisting', startDate: this.generateRandomDate(-7), endDate: this.generateRandomDate(0), status: 'Completed' as const, responsible: 'Robert Taylor', progress: 100 },
      { eventTitle: 'Emergency Backup Generators', milestoneName: 'Final Evaluation', startDate: this.generateRandomDate(-2), endDate: this.generateRandomDate(1), status: 'Delayed' as const, responsible: 'Sarah Johnson', progress: 45 }
    ];

    return milestones.map((m, idx) => ({
      id: `MS-${idx + 1}`,
      eventId: `SE-2025-${String(idx + 1).padStart(3, '0')}`,
      ...m
    }));
  }

  static generateMockTasks(): TaskItem[] {
    const tasks = [
      { title: 'Assign evaluators to Solar Panel tender', category: 'Execution' as const, priority: 'high' as const, dueDate: this.generateRandomDate(1), assignedTo: 'You', status: 'pending' as const },
      { title: 'Review vendor submissions for Wind Turbine', category: 'Execution' as const, priority: 'medium' as const, dueDate: this.generateRandomDate(3), assignedTo: 'You', status: 'in-progress' as const },
      { title: 'Schedule reverse auction for Battery Storage', category: 'Preparation' as const, priority: 'high' as const, dueDate: this.generateRandomDate(2), assignedTo: 'You', status: 'pending' as const },
      { title: 'Generate tender document for Grid Integration', category: 'Preparation' as const, priority: 'medium' as const, dueDate: this.generateRandomDate(7), assignedTo: 'Sarah Johnson', status: 'in-progress' as const },
      { title: 'Approve winner announcement for Transformer', category: 'Execution' as const, priority: 'high' as const, dueDate: this.generateRandomDate(0), assignedTo: 'You', status: 'pending' as const },
      { title: 'Create sourcing event for Cooling System', category: 'Planning' as const, priority: 'low' as const, dueDate: this.generateRandomDate(10), assignedTo: 'Michael Chen', status: 'pending' as const },
      { title: 'Review evaluation scores for Maintenance Services', category: 'Execution' as const, priority: 'medium' as const, dueDate: this.generateRandomDate(4), assignedTo: 'You', status: 'in-progress' as const },
      { title: 'Update tender schedule for Security System', category: 'Preparation' as const, priority: 'low' as const, dueDate: this.generateRandomDate(12), assignedTo: 'Amanda Rodriguez', status: 'pending' as const },
      { title: 'Conduct vendor briefing for Environmental Monitoring', category: 'Execution' as const, priority: 'medium' as const, dueDate: this.generateRandomDate(5), assignedTo: 'David Kim', status: 'pending' as const },
      { title: 'Finalize contract for Fire Suppression', category: 'Execution' as const, priority: 'high' as const, dueDate: this.generateRandomDate(-1), assignedTo: 'You', status: 'pending' as const }
    ];

    return tasks.map((task, idx) => {
      const daysUntil = this.calculateDaysUntil(task.dueDate);
      return {
        id: `TASK-${idx + 1}`,
        ...task,
        daysOverdue: daysUntil < 0 ? Math.abs(daysUntil) : 0
      };
    });
  }

  static generateMockReverseAuctions(): ReverseAuctionItem[] {
    const now = new Date();

    const auctions = [
      { eventTitle: 'Battery Energy Storage System', startTime: new Date(now.getTime() + 115 * 60000).toISOString(), status: 'upcoming' as const, participantCount: 8, startingPrice: 5000000, currentBestBid: null },
      { eventTitle: 'Maintenance Services - 2-Year Contract', startTime: new Date(now.getTime() + 3 * 24 * 60 * 60000).toISOString(), status: 'upcoming' as const, participantCount: 6, startingPrice: 2500000, currentBestBid: null },
      { eventTitle: 'Transformer Replacement', startTime: new Date(now.getTime() - 30 * 60000).toISOString(), status: 'active' as const, participantCount: 9, startingPrice: 8000000, currentBestBid: 7450000 },
      { eventTitle: 'Control System Upgrade', startTime: new Date(now.getTime() + 5 * 24 * 60 * 60000).toISOString(), status: 'upcoming' as const, participantCount: 4, startingPrice: 1800000, currentBestBid: null }
    ];

    return auctions.map((auction, idx) => {
      const startTime = new Date(auction.startTime);
      const minutesUntil = Math.floor((startTime.getTime() - now.getTime()) / 60000);

      return {
        id: `RA-2025-${idx + 1}`,
        ...auction,
        minutesUntilStart: auction.status === 'upcoming' ? minutesUntil : null
      };
    });
  }

  static generateMockApprovalQueue(): ApprovalQueueItem[] {
    const items = [
      { documentType: 'Tender Announcement', eventTitle: 'Solar Panel Procurement', submitter: 'Sarah Johnson', submissionDate: this.generateRandomDate(-5), priority: 'urgent' as const },
      { documentType: 'Winner Selection', eventTitle: 'Battery Energy Storage', submitter: 'Amanda Rodriguez', submissionDate: this.generateRandomDate(-3), priority: 'urgent' as const },
      { documentType: 'Vendor Assignment', eventTitle: 'Wind Turbine Components', submitter: 'Michael Chen', submissionDate: this.generateRandomDate(-7), priority: 'normal' as const },
      { documentType: 'Schedule Modification', eventTitle: 'Grid Integration Equipment', submitter: 'David Kim', submissionDate: this.generateRandomDate(-2), priority: 'normal' as const },
      { documentType: 'Evaluation Criteria', eventTitle: 'Maintenance Services', submitter: 'Jennifer Lee', submissionDate: this.generateRandomDate(-4), priority: 'urgent' as const },
      { documentType: 'Budget Approval', eventTitle: 'Control System Upgrade', submitter: 'Robert Taylor', submissionDate: this.generateRandomDate(-1), priority: 'normal' as const },
      { documentType: 'Contract Terms', eventTitle: 'Emergency Backup Generators', submitter: 'Sarah Johnson', submissionDate: this.generateRandomDate(-6), priority: 'urgent' as const }
    ];

    return items.map((item, idx) => {
      const daysInQueue = Math.abs(this.calculateDaysUntil(item.submissionDate));
      return {
        id: `APR-${idx + 1}`,
        ...item,
        daysInQueue
      };
    });
  }

  static generateMockAlerts(): AlertItem[] {
    return [
      { id: 'ALT-1', type: 'error', message: 'Tender "Emergency Backup Generators" has only 1 vendor submitted', eventId: 'SE-2025-007', timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), actionRequired: true },
      { id: 'ALT-2', type: 'warning', message: 'Evaluation deadline approaching for "Transformer Replacement" in 1 day', eventId: 'SE-2025-008', timestamp: new Date(Date.now() - 4 * 60 * 60000).toISOString(), actionRequired: true },
      { id: 'ALT-3', type: 'warning', message: 'No evaluators assigned to "Solar Panel Procurement"', eventId: 'SE-2025-001', timestamp: new Date(Date.now() - 6 * 60 * 60000).toISOString(), actionRequired: true },
      { id: 'ALT-4', type: 'info', message: 'Reverse auction for "Battery Energy Storage" starts in 2 hours', eventId: 'SE-2025-003', timestamp: new Date(Date.now() - 1 * 60 * 60000).toISOString(), actionRequired: false },
      { id: 'ALT-5', type: 'error', message: 'Missing required documents in "Grid Integration Equipment" tender', eventId: 'SE-2025-004', timestamp: new Date(Date.now() - 8 * 60 * 60000).toISOString(), actionRequired: true },
      { id: 'ALT-6', type: 'success', message: 'Winner announcement approved for "Control System Upgrade"', eventId: 'SE-2025-006', timestamp: new Date(Date.now() - 12 * 60 * 60000).toISOString(), actionRequired: false }
    ];
  }

  static generateMockInsights(): InsightItem[] {
    return [
      { id: 'INS-1', type: 'warning', message: 'Event "Solar Panel Procurement" has no evaluators assigned. Action required before evaluation phase.', criticality: 'red', actionUrl: '/assign-evaluators' },
      { id: 'INS-2', type: 'warning', message: 'Tender "Emergency Backup Generators" has only 1 vendor submitted. Consider extending deadline by 5 days.', criticality: 'yellow', actionUrl: '/extend-deadline' },
      { id: 'INS-3', type: 'recommendation', message: 'Reverse auction for "Battery Energy Storage" starts in 115 minutes. Confirm setup and participant readiness.', criticality: 'yellow', actionUrl: '/auction-setup' },
      { id: 'INS-4', type: 'opportunity', message: '7 approvals pending in queue. Average approval time is 3.2 days. Delegation recommended to reduce backlog.', criticality: 'green' },
      { id: 'INS-5', type: 'recommendation', message: 'Vendor engagement for "Wind Turbine Components" is below average (5 submissions vs. 8 expected). Proactive outreach suggested.', criticality: 'yellow' }
    ];
  }

  static generateEventStatusDistribution(): EventStatusDistribution {
    return {
      draft: 2,
      scheduled: 4,
      inProgress: 4,
      evaluation: 2,
      completed: 15
    };
  }

  static generateMockVendorSubmissions(): VendorSubmission[] {
    const submissions = [
      { eventTitle: 'Solar Panel Procurement', vendorName: 'SolarTech Industries', submissionDate: this.generateRandomDate(-3), documentCount: 12, requiredDocumentCount: 12, status: 'complete' as const },
      { eventTitle: 'Solar Panel Procurement', vendorName: 'Green Energy Solutions', submissionDate: this.generateRandomDate(-2), documentCount: 9, requiredDocumentCount: 12, status: 'partial' as const },
      { eventTitle: 'Solar Panel Procurement', vendorName: 'Renewable Power Corp', submissionDate: this.generateRandomDate(-4), documentCount: 12, requiredDocumentCount: 12, status: 'complete' as const },
      { eventTitle: 'Wind Turbine Components', vendorName: 'WindForce Manufacturing', submissionDate: this.generateRandomDate(-1), documentCount: 8, requiredDocumentCount: 10, status: 'partial' as const },
      { eventTitle: 'Wind Turbine Components', vendorName: 'TurbineTech Global', submissionDate: this.generateRandomDate(-5), documentCount: 10, requiredDocumentCount: 10, status: 'complete' as const },
      { eventTitle: 'Battery Energy Storage', vendorName: 'EnerStore Systems', submissionDate: this.generateRandomDate(-2), documentCount: 15, requiredDocumentCount: 15, status: 'complete' as const },
      { eventTitle: 'Battery Energy Storage', vendorName: 'PowerCell Technologies', submissionDate: this.generateRandomDate(-1), documentCount: 12, requiredDocumentCount: 15, status: 'partial' as const },
      { eventTitle: 'Battery Energy Storage', vendorName: 'Advanced Battery Co', submissionDate: this.generateRandomDate(-3), documentCount: 15, requiredDocumentCount: 15, status: 'complete' as const },
      { eventTitle: 'Maintenance Services', vendorName: 'ServicePro Indonesia', submissionDate: this.generateRandomDate(-4), documentCount: 7, requiredDocumentCount: 8, status: 'partial' as const },
      { eventTitle: 'Maintenance Services', vendorName: 'TotalCare Solutions', submissionDate: this.generateRandomDate(-2), documentCount: 8, requiredDocumentCount: 8, status: 'complete' as const }
    ];

    return submissions.map((sub, idx) => {
      const completeness = Math.round((sub.documentCount / sub.requiredDocumentCount) * 100);
      return {
        id: `VS-${idx + 1}`,
        eventId: `SE-2025-${String(idx + 1).padStart(3, '0')}`,
        completeness,
        ...sub
      };
    });
  }

  static generateMockWinnerSummaries(): WinnerSummary[] {
    const summaries = [
      { eventTitle: 'Control System Upgrade', category: 'Technology', winnerVendor: 'AutomationTech Pro', winnerScore: 92, runnerUpVendor: 'SmartControl Systems', runnerUpScore: 87, contractValue: 1800000, awardDate: this.generateRandomDate(-5), evaluationDuration: 12 },
      { eventTitle: 'Transformer Replacement', category: 'Infrastructure', winnerVendor: 'PowerGrid Solutions', winnerScore: 89, runnerUpVendor: 'ElectroTech Industries', runnerUpScore: 85, contractValue: 7450000, awardDate: this.generateRandomDate(-3), evaluationDuration: 15 },
      { eventTitle: 'Cooling System Components', category: 'Equipment', winnerVendor: 'ThermalCore Systems', winnerScore: 91, runnerUpVendor: 'CoolTech Manufacturing', runnerUpScore: 84, contractValue: 2300000, awardDate: this.generateRandomDate(-7), evaluationDuration: 10 },
      { eventTitle: 'Fire Suppression System', category: 'Safety', winnerVendor: 'SafeGuard Technologies', winnerScore: 94, runnerUpVendor: 'FireProtect Inc', runnerUpScore: 88, contractValue: 1250000, awardDate: this.generateRandomDate(-2), evaluationDuration: 8 },
      { eventTitle: 'Environmental Monitoring', category: 'Technology', winnerVendor: 'EcoMonitor Systems', winnerScore: 88, runnerUpVendor: 'GreenSense Technologies', runnerUpScore: 82, contractValue: 850000, awardDate: this.generateRandomDate(-10), evaluationDuration: 14 }
    ];

    return summaries.map((summary, idx) => ({
      id: `WIN-${idx + 1}`,
      ...summary
    }));
  }

  static generateMockEvaluationStatuses(): EvaluationStatus[] {
    const statuses = [
      { eventTitle: 'Solar Panel Procurement', evaluatorName: 'Dr. Lisa Chang', status: 'In Progress' as const, vendorsAssigned: 8, vendorsCompleted: 5, daysInStatus: 3, isBottleneck: false },
      { eventTitle: 'Wind Turbine Components', evaluatorName: 'James Anderson', status: 'In Progress' as const, vendorsAssigned: 5, vendorsCompleted: 2, daysInStatus: 6, isBottleneck: true },
      { eventTitle: 'Battery Energy Storage', evaluatorName: 'Maria Santos', status: 'Completed' as const, vendorsAssigned: 12, vendorsCompleted: 12, daysInStatus: 0, isBottleneck: false },
      { eventTitle: 'Maintenance Services', evaluatorName: 'Robert Chen', status: 'Pending' as const, vendorsAssigned: 6, vendorsCompleted: 0, daysInStatus: 2, isBottleneck: false },
      { eventTitle: 'Emergency Backup Generators', evaluatorName: 'Sarah Johnson', status: 'Pending' as const, vendorsAssigned: 1, vendorsCompleted: 0, daysInStatus: 5, isBottleneck: true },
      { eventTitle: 'Transformer Replacement', evaluatorName: 'Michael Brown', status: 'In Progress' as const, vendorsAssigned: 9, vendorsCompleted: 7, daysInStatus: 4, isBottleneck: false }
    ];

    return statuses.map((status, idx) => ({
      id: `EVAL-${idx + 1}`,
      eventId: `SE-2025-${String(idx + 1).padStart(3, '0')}`,
      ...status
    }));
  }
}
