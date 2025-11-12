export interface DashboardMetrics {
  kpis: {
    activeEvents: {
      total: number;
      trend: 'up' | 'down' | 'stable';
      change: number;
      byStage: {
        planning: number;
        preparation: number;
        execution: number;
        awarded: number;
      };
    };
    plannedSpend: {
      value: number;
      trend: 'up' | 'down' | 'stable';
      change: number;
      previousPeriod: number;
    };
    cycleTime: {
      actual: number;
      target: number;
      trend: 'up' | 'down' | 'stable';
      change: number;
    };
    eventsAtRisk: {
      count: number;
      scheduleBreaches: number;
      slaViolations: number;
    };
    tenderHealth: {
      avgBiddersPerTender: number;
      singleBidPercentage: number;
      competitiveRate: number;
    };
  };
  pipeline: {
    stages: Array<{
      name: string;
      count: number;
      totalValue: number;
      avgDaysInStage: number;
      slaTarget: number;
      slaStatus: 'on-track' | 'at-risk' | 'delayed';
    }>;
  };
  tasks: Array<{
    id: string;
    task: string;
    event: string;
    dueDate: string;
    status: string;
  }>;
  approvals: Array<{
    id: string;
    type: string;
    event: string;
    requester: string;
    daysPending: number;
  }>;
  milestones: Array<{
    id: string;
    date: string;
    milestone: string;
    event: string;
    responsible: string;
    status: string;
  }>;
  upcomingAuctions: Array<{
    id: string;
    dateTime: string;
    eventId: string;
    status: string;
  }>;
  alerts: Array<{
    id: string;
    severity: 'critical' | 'high' | 'medium';
    type: string;
    event: string;
    description: string;
  }>;
  spendByCategory: Array<{
    name: string;
    value: number;
  }>;
  largestTenders: Array<{
    event: string;
    value: number;
    stage: string;
    plannedAwardDate: string;
    riskFlag: boolean;
  }>;
}

export class ProcurementDashboardService {
  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    // Simulate async data loading
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      kpis: {
        activeEvents: {
          total: 47,
          trend: 'up',
          change: 12.5,
          byStage: {
            planning: 8,
            preparation: 12,
            execution: 18,
            awarded: 9
          }
        },
        plannedSpend: {
          value: 245.8,
          trend: 'up',
          change: 8.3,
          previousPeriod: 227.1
        },
        cycleTime: {
          actual: 42,
          target: 45,
          trend: 'down',
          change: -5.2
        },
        eventsAtRisk: {
          count: 7,
          scheduleBreaches: 4,
          slaViolations: 3
        },
        tenderHealth: {
          avgBiddersPerTender: 5.3,
          singleBidPercentage: 15,
          competitiveRate: 85
        }
      },
      pipeline: {
        stages: [
          {
            name: 'Planning',
            count: 8,
            totalValue: 32.5,
            avgDaysInStage: 12,
            slaTarget: 14,
            slaStatus: 'on-track'
          },
          {
            name: 'Preparation',
            count: 12,
            totalValue: 58.3,
            avgDaysInStage: 18,
            slaTarget: 21,
            slaStatus: 'on-track'
          },
          {
            name: 'Execution',
            count: 18,
            totalValue: 125.7,
            avgDaysInStage: 28,
            slaTarget: 30,
            slaStatus: 'at-risk'
          },
          {
            name: 'Awarded',
            count: 9,
            totalValue: 29.3,
            avgDaysInStage: 5,
            slaTarget: 7,
            slaStatus: 'on-track'
          }
        ]
      },
      tasks: [
        {
          id: 'T-001',
          task: 'Complete Procurement Checklist',
          event: 'SE-2024-RE-001 - Solar PV Module Procurement',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Urgent'
        },
        {
          id: 'T-002',
          task: 'Assign Personnel for Tender Preparation',
          event: 'SE-2024-EL-042 - Transformer Upgrade Project',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Urgent'
        },
        {
          id: 'T-003',
          task: 'Review Technical Evaluation Results',
          event: 'SE-2024-ME-015 - Gas Turbine Maintenance',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Overdue'
        },
        {
          id: 'T-004',
          task: 'Publish Tender Announcement',
          event: 'SE-2024-RE-007 - Wind Turbine Installation',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Pending'
        },
        {
          id: 'T-005',
          task: 'Vendor Document Verification',
          event: 'SE-2024-EL-033 - Circuit Breaker Replacement',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Pending'
        }
      ],
      approvals: [
        {
          id: 'A-001',
          type: 'Checklist Completion',
          event: 'SE-2024-RE-001 - Solar PV Module Procurement',
          requester: 'Sarah Johnson',
          daysPending: 2
        },
        {
          id: 'A-002',
          type: 'Evaluation Result',
          event: 'SE-2024-EL-042 - Transformer Upgrade Project',
          requester: 'Michael Chen',
          daysPending: 1
        },
        {
          id: 'A-003',
          type: 'Award Recommendation',
          event: 'SE-2024-ME-015 - Gas Turbine Maintenance',
          requester: 'Dr. James Williams',
          daysPending: 3
        },
        {
          id: 'A-004',
          type: 'Sourcing Creation',
          event: 'SE-2024-RE-007 - Wind Turbine Installation',
          requester: 'Emily Davis',
          daysPending: 1
        }
      ],
      milestones: [
        {
          id: 'M-001',
          date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          milestone: 'Tender Announcement',
          event: 'SE-2024-RE-001 - Solar PV Module Procurement',
          responsible: 'Sarah Johnson',
          status: 'Pending'
        },
        {
          id: 'M-002',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          milestone: 'Submission Deadline',
          event: 'SE-2024-EL-042 - Transformer Upgrade Project',
          responsible: 'Michael Chen',
          status: 'Pending'
        },
        {
          id: 'M-003',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          milestone: 'Reverse Auction',
          event: 'SE-2024-ME-015 - Gas Turbine Maintenance',
          responsible: 'Dr. James Williams',
          status: 'In Progress'
        },
        {
          id: 'M-004',
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          milestone: 'Evaluation',
          event: 'SE-2024-RE-007 - Wind Turbine Installation',
          responsible: 'Emily Davis',
          status: 'Pending'
        },
        {
          id: 'M-005',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          milestone: 'Award Decision',
          event: 'SE-2024-EL-033 - Circuit Breaker Replacement',
          responsible: 'Ahmad Rahman',
          status: 'Pending'
        },
        {
          id: 'M-006',
          date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
          milestone: 'Tender Announcement',
          event: 'SE-2024-RE-008 - Battery Storage System',
          responsible: 'Lisa Anderson',
          status: 'Pending'
        },
        {
          id: 'M-007',
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          milestone: 'Submission Deadline',
          event: 'SE-2024-ME-022 - Cooling System Upgrade',
          responsible: 'David Thompson',
          status: 'Pending'
        },
        {
          id: 'M-008',
          date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
          milestone: 'Evaluation',
          event: 'SE-2024-EL-045 - Substation Modernization',
          responsible: 'Maria Garcia',
          status: 'Pending'
        }
      ],
      upcomingAuctions: [
        {
          id: 'RA-001',
          dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000).toISOString(),
          eventId: 'SE-2024-ME-015',
          status: 'Scheduled'
        },
        {
          id: 'RA-002',
          dateTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
          eventId: 'SE-2024-RE-007',
          status: 'Scheduled'
        },
        {
          id: 'RA-003',
          dateTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString(),
          eventId: 'SE-2024-EL-033',
          status: 'Scheduled'
        }
      ],
      alerts: [
        {
          id: 'AL-001',
          severity: 'critical',
          type: 'Missing Bids',
          event: 'SE-2024-EL-042 - Transformer Upgrade Project',
          description: 'Submission deadline passed with only 1 bid received'
        },
        {
          id: 'AL-002',
          severity: 'critical',
          type: 'Checklist Overdue',
          event: 'SE-2024-ME-015 - Gas Turbine Maintenance',
          description: 'Procurement checklist overdue by 3 days'
        },
        {
          id: 'AL-003',
          severity: 'high',
          type: 'Milestone Delay',
          event: 'SE-2024-RE-001 - Solar PV Module Procurement',
          description: 'Tender announcement delayed, risking overall timeline'
        },
        {
          id: 'AL-004',
          severity: 'high',
          type: 'SLA Breach',
          event: 'SE-2024-EL-033 - Circuit Breaker Replacement',
          description: 'Evaluation phase exceeding SLA by 2 days'
        },
        {
          id: 'AL-005',
          severity: 'medium',
          type: 'Approval Pending',
          event: 'SE-2024-RE-007 - Wind Turbine Installation',
          description: 'Manager approval pending for 3 days'
        },
        {
          id: 'AL-006',
          severity: 'medium',
          type: 'Low Participation',
          event: 'SE-2024-ME-022 - Cooling System Upgrade',
          description: 'Only 2 vendors registered, below target of 5'
        }
      ],
      spendByCategory: [
        {
          name: 'Renewable Energy Equipment',
          value: 87.5
        },
        {
          name: 'Electrical Equipment',
          value: 65.3
        },
        {
          name: 'Mechanical Equipment',
          value: 48.7
        },
        {
          name: 'Civil & Infrastructure',
          value: 28.2
        },
        {
          name: 'Services & Maintenance',
          value: 16.1
        }
      ],
      largestTenders: [
        {
          event: 'SE-2024-RE-001 - Solar PV Module Procurement',
          value: 42.5,
          stage: 'Execution',
          plannedAwardDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          riskFlag: false
        },
        {
          event: 'SE-2024-EL-042 - Transformer Upgrade Project',
          value: 38.3,
          stage: 'Execution',
          plannedAwardDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          riskFlag: true
        },
        {
          event: 'SE-2024-ME-015 - Gas Turbine Maintenance',
          value: 29.7,
          stage: 'Preparation',
          plannedAwardDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          riskFlag: false
        },
        {
          event: 'SE-2024-RE-007 - Wind Turbine Installation',
          value: 25.1,
          stage: 'Planning',
          plannedAwardDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
          riskFlag: false
        },
        {
          event: 'SE-2024-EL-033 - Circuit Breaker Replacement',
          value: 18.9,
          stage: 'Execution',
          plannedAwardDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          riskFlag: true
        }
      ]
    };
  }
}
