export interface TenderMilestone {
  id?: string;
  sourcing_event_id: string;
  milestone_name: string;
  milestone_date: string;
  milestone_order: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  assigned_executor_name?: string;
  assigned_executor_id?: string;
  ai_generated: boolean;
  notes?: string;
  organization_id: string;
  created_at?: string;
}

export interface MilestoneTemplate {
  milestone_name: string;
  milestone_order: number;
  days_offset: number;
  notes: string;
}

export class TenderMilestoneService {
  private static readonly SESSION_STORAGE_KEY = 'session_tender_milestones';

  private static getSessionMilestones(): TenderMilestone[] {
    try {
      const stored = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading session milestones:', error);
      return [];
    }
  }

  private static saveSessionMilestones(milestones: TenderMilestone[]): void {
    try {
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify(milestones));
    } catch (error) {
      console.error('Error saving session milestones:', error);
    }
  }

  private static readonly MILESTONE_TEMPLATES: MilestoneTemplate[] = [
    {
      milestone_name: 'Tender Announcement',
      milestone_order: 1,
      days_offset: 0,
      notes: 'Publish tender announcement to vendors and prepare tender documentation'
    },
    {
      milestone_name: 'Document Submission',
      milestone_order: 2,
      days_offset: 14,
      notes: 'Deadline for vendors to submit required documents and proposals'
    },
    {
      milestone_name: 'Evaluation',
      milestone_order: 3,
      days_offset: 24,
      notes: 'Technical and commercial evaluation of vendor submissions'
    },
    {
      milestone_name: 'Winner Announcement',
      milestone_order: 4,
      days_offset: 35,
      notes: 'Announce winning vendor and tender results'
    },
    {
      milestone_name: 'Contract Negotiation',
      milestone_order: 5,
      days_offset: 40,
      notes: 'Negotiate contract terms and conditions with winning vendor'
    },
    {
      milestone_name: 'Final Awarding',
      milestone_order: 6,
      days_offset: 45,
      notes: 'Finalize and sign contract with winning vendor'
    }
  ];

  static async getMilestonesBySourcingEvent(
    sourcingEventId: string
  ): Promise<TenderMilestone[]> {
    const sessionMilestones = this.getSessionMilestones();
    return sessionMilestones
      .filter(m => m.sourcing_event_id === sourcingEventId)
      .sort((a, b) => a.milestone_order - b.milestone_order);
  }

  static async generateMilestones(
    sourcingEventId: string,
    organizationId: string,
    executorId?: string,
    startDate?: Date
  ): Promise<TenderMilestone[]> {
    const baseDate = startDate || new Date('2025-10-01');

    const milestones: Omit<TenderMilestone, 'id' | 'created_at'>[] = this.MILESTONE_TEMPLATES.map(
      (template) => {
        const milestoneDate = new Date(baseDate);
        milestoneDate.setDate(milestoneDate.getDate() + template.days_offset);

        return {
          sourcing_event_id: sourcingEventId,
          milestone_name: template.milestone_name,
          milestone_date: milestoneDate.toISOString().split('T')[0],
          milestone_order: template.milestone_order,
          status: 'Pending' as const,
          assigned_executor_id: executorId,
          ai_generated: true,
          notes: template.notes,
          organization_id: organizationId
        };
      }
    );

    return milestones as TenderMilestone[];
  }

  static async createMilestone(
    milestone: Omit<TenderMilestone, 'id' | 'created_at'>
  ): Promise<TenderMilestone> {
    const newMilestone: TenderMilestone = {
      ...milestone,
      id: `TM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };

    const sessionMilestones = this.getSessionMilestones();
    sessionMilestones.push(newMilestone);
    this.saveSessionMilestones(sessionMilestones);

    return newMilestone;
  }

  static async createMilestonesBatch(
    milestones: Omit<TenderMilestone, 'id' | 'created_at'>[]
  ): Promise<TenderMilestone[]> {
    const sessionMilestones = this.getSessionMilestones();

    // Remove existing milestones for this sourcing event
    const firstMilestone = milestones[0];
    if (firstMilestone) {
      const filtered = sessionMilestones.filter(
        m => m.sourcing_event_id !== firstMilestone.sourcing_event_id
      );

      const newMilestones: TenderMilestone[] = milestones.map((m, index) => ({
        ...m,
        id: `TM-${Date.now()}-${index}`,
        created_at: new Date().toISOString()
      }));

      this.saveSessionMilestones([...filtered, ...newMilestones]);
      return newMilestones;
    }

    return [];
  }

  static async updateMilestone(
    id: string,
    updates: Partial<TenderMilestone>
  ): Promise<TenderMilestone> {
    const sessionMilestones = this.getSessionMilestones();
    const index = sessionMilestones.findIndex(m => m.id === id);

    if (index === -1) throw new Error('Milestone not found');

    const updatedMilestone = {
      ...sessionMilestones[index],
      ...updates
    };

    sessionMilestones[index] = updatedMilestone;
    this.saveSessionMilestones(sessionMilestones);

    return updatedMilestone;
  }

  static async deleteMilestone(id: string): Promise<void> {
    const sessionMilestones = this.getSessionMilestones();
    const filtered = sessionMilestones.filter(m => m.id !== id);
    this.saveSessionMilestones(filtered);
  }

  static async deleteMilestonesBySourcingEvent(sourcingEventId: string): Promise<void> {
    const sessionMilestones = this.getSessionMilestones();
    const filtered = sessionMilestones.filter(m => m.sourcing_event_id !== sourcingEventId);
    this.saveSessionMilestones(filtered);
  }

  static validateMilestoneDates(milestones: TenderMilestone[]): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedMilestones = [...milestones].sort((a, b) => a.milestone_order - b.milestone_order);

    for (let i = 0; i < sortedMilestones.length; i++) {
      const milestone = sortedMilestones[i];
      const milestoneDate = new Date(milestone.milestone_date);

      if (milestoneDate < today) {
        errors.push(
          `${milestone.milestone_name} date is in the past. Please select a future date.`
        );
      }

      if (i > 0) {
        const prevMilestone = sortedMilestones[i - 1];
        const prevDate = new Date(prevMilestone.milestone_date);

        if (milestoneDate <= prevDate) {
          errors.push(
            `${milestone.milestone_name} must be after ${prevMilestone.milestone_name}`
          );
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static calculateTimelineStats(milestones: TenderMilestone[]): {
    startDate: string;
    endDate: string;
    totalDays: number;
    completedMilestones: number;
    pendingMilestones: number;
  } {
    if (milestones.length === 0) {
      return {
        startDate: '',
        endDate: '',
        totalDays: 0,
        completedMilestones: 0,
        pendingMilestones: 0
      };
    }

    const dates = milestones.map((m) => new Date(m.milestone_date));
    const startDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const endDate = new Date(Math.max(...dates.map((d) => d.getTime())));
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalDays,
      completedMilestones: milestones.filter((m) => m.status === 'Completed').length,
      pendingMilestones: milestones.filter((m) => m.status === 'Pending').length
    };
  }
}
