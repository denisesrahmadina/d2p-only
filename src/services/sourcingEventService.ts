import mockData from '../data/eprocurementMockData.json';

export interface SourcingEvent {
  sourcing_event_line_id?: number;
  id: string;
  sourcing_event_id: string;
  title: string;
  material_ids?: string[];
  demand_quantity?: string;
  delivery_date?: string;
  delivery_location?: string;
  estimate_price?: number;
  estimate_schedule?: any;
  shortlisted_vendors?: string[];
  status: 'Draft' | 'Scheduled' | 'Published' | 'In Progress' | 'Evaluation' | 'Completed' | 'Cancelled' | 'Approved' | 'Rejected' | 'Waiting for Approval';
  approval_status: 'Pending' | 'Approved' | 'Rejected';
  approved_by?: string;
  assigned_to?: string;
  assigned_executor_id?: string;
  executor_assigned_at?: string;
  executor_assigned_by?: string;
  schedule_generated?: boolean;
  schedule_generated_at?: string;
  tender_preparation_status?: string;
  category?: string;
  total_value: number;
  vendor_count?: number;
  responsible_planner?: string;
  organization_id: string;
  created_by?: string;
  rejection_reason?: string;
  approved_at?: string;
  rejected_at?: string;
  bundle_id?: string;
  checklist_completed_status?: string;
  checklist_submitted_at?: string;
  checklist_submitted_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SourcingEventMilestone {
  id: string;
  sourcing_event_id: string;
  milestone_name: string;
  milestone_date: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  responsible_person?: string;
  notes?: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface TenderDocument {
  id: string;
  sourcing_event_id: string;
  document_type: string;
  content?: any;
  tor_file_path?: string;
  spec_file_path?: string;
  status: string;
  version: number;
  approved_by?: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentSubmission {
  id: string;
  tender_id: string;
  vendor_id: string;
  section_name: string;
  section_order: number;
  file_path?: string;
  file_type?: string;
  file_size?: number;
  submission_status: string;
  ai_screening_score?: number;
  compliance_issues?: any[];
  recommendations?: any[];
  submitted_at?: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface EnrichedSourcingEvent extends SourcingEvent {
  tenderDocuments?: TenderDocument[];
  submissions?: DocumentSubmission[];
  hasTemplate?: boolean;
  description?: string;
  estimatedValue?: string;
  deadline?: string;
  requirements?: string[];
  timeline?: string;
  assignedVendor?: string;
}

export class SourcingEventService {
  private static readonly SESSION_STORAGE_KEY = 'session_sourcing_events';

  private static getMockEvents(): SourcingEvent[] {
    return mockData.sourcingEvents as SourcingEvent[];
  }

  private static getMockMilestones(): SourcingEventMilestone[] {
    return mockData.milestones as SourcingEventMilestone[];
  }

  private static getSessionEvents(): SourcingEvent[] {
    try {
      const stored = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading session events:', error);
      return [];
    }
  }

  private static saveSessionEvent(event: SourcingEvent): void {
    try {
      const sessionEvents = this.getSessionEvents();
      const existingIndex = sessionEvents.findIndex(e => e.id === event.id);

      if (existingIndex >= 0) {
        sessionEvents[existingIndex] = event;
      } else {
        sessionEvents.push(event);
      }

      sessionStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify(sessionEvents));
    } catch (error) {
      console.error('Error saving session event:', error);
    }
  }

  static async getAllEvents(organizationId: string): Promise<SourcingEvent[]> {
    const mockEvents = this.getMockEvents();
    const sessionEvents = this.getSessionEvents();

    // Combine mock events and session events
    const allEvents = [...mockEvents, ...sessionEvents];

    return allEvents.filter(e => e.organization_id === organizationId);
  }

  static async getEventById(id: string): Promise<SourcingEvent | null> {
    const mockEvents = this.getMockEvents();
    const sessionEvents = this.getSessionEvents();
    const allEvents = [...mockEvents, ...sessionEvents];
    return allEvents.find(e => e.id === id) || null;
  }

  static async getEventsByStatus(
    organizationId: string,
    status: string
  ): Promise<SourcingEvent[]> {
    const events = await this.getAllEvents(organizationId);
    return events.filter(e => e.status === status);
  }

  static async getEventsByApprovalStatus(
    organizationId: string,
    approvalStatus: string
  ): Promise<SourcingEvent[]> {
    const events = await this.getAllEvents(organizationId);
    return events.filter(e => e.approval_status === approvalStatus);
  }

  static async getEventsByChecklistStatus(
    organizationId: string,
    checklistStatus: string
  ): Promise<SourcingEvent[]> {
    const events = await this.getAllEvents(organizationId);
    return events.filter(e => e.checklist_completed_status === checklistStatus);
  }

  static async createEvent(event: Omit<SourcingEvent, 'id' | 'created_at' | 'updated_at'>): Promise<SourcingEvent> {
    console.log('SourcingEventService.createEvent called with:', event);

    if (!event.title || event.title.trim() === '') {
      throw new Error('Event title is required');
    }

    if (!event.organization_id) {
      throw new Error('Organization ID is required');
    }

    const newEvent: SourcingEvent = {
      ...event,
      id: `SE-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Save to session storage
    this.saveSessionEvent(newEvent);

    console.log('Sourcing event created and saved to session:', newEvent);
    return newEvent;
  }

  static async createQuickEvent(organizationId: string, assignedTo?: string): Promise<SourcingEvent> {
    console.log('SourcingEventService.createQuickEvent called');

    if (!organizationId) {
      throw new Error('Organization ID is required to create a sourcing event');
    }

    const currentDate = new Date();
    const deliveryDate = new Date(currentDate);
    deliveryDate.setDate(deliveryDate.getDate() + 30);

    const timestamp = currentDate.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const quickEvent: Omit<SourcingEvent, 'id' | 'created_at' | 'updated_at'> = {
      sourcing_event_id: this.generateSourcingEventId(),
      title: `Quick Sourcing Event - ${timestamp}`,
      material_ids: [],
      demand_quantity: 'TBD',
      delivery_date: deliveryDate.toISOString().split('T')[0],
      delivery_location: 'To be determined',
      estimate_price: 0,
      total_value: 0,
      estimate_schedule: null,
      shortlisted_vendors: [],
      status: 'Draft',
      approval_status: 'Approved',
      approved_by: 'System (Auto-approved)',
      approved_at: new Date().toISOString(),
      assigned_to: assignedTo,
      category: 'General',
      organization_id: organizationId
    };

    console.log('Creating quick event with default values:', quickEvent);
    return this.createEvent(quickEvent);
  }

  static async updateEvent(id: string, updates: Partial<SourcingEvent>): Promise<SourcingEvent> {
    const existing = await this.getEventById(id);
    if (!existing) throw new Error('Event not found');

    const updatedEvent = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Save to session storage
    this.saveSessionEvent(updatedEvent);

    return updatedEvent;
  }

  static async deleteEvent(id: string): Promise<void> {
    return;
  }

  static async approveEvent(id: string, approvedBy: string): Promise<SourcingEvent> {
    return this.updateEvent(id, {
      approval_status: 'Approved',
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
      status: 'Scheduled',
      rejection_reason: undefined
    });
  }

  static async rejectEvent(id: string, approvedBy: string, rejectionReason?: string): Promise<SourcingEvent> {
    return this.updateEvent(id, {
      approval_status: 'Rejected',
      approved_by: approvedBy,
      rejected_at: new Date().toISOString(),
      rejection_reason: rejectionReason || 'No reason provided'
    });
  }

  static async submitChecklistForApproval(
    id: string,
    submittedBy: string
  ): Promise<SourcingEvent> {
    return this.updateEvent(id, {
      checklist_completed_status: 'Submitted for Approval',
      checklist_submitted_at: new Date().toISOString(),
      checklist_submitted_by: submittedBy
    });
  }

  static async approveChecklistCompletion(
    id: string,
    approvedBy: string
  ): Promise<SourcingEvent> {
    return this.updateEvent(id, {
      checklist_completed_status: 'Approved',
      approval_status: 'Approved',
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
      status: 'Scheduled'
    });
  }

  static async rejectChecklistCompletion(
    id: string,
    rejectedBy: string,
    rejectionReason?: string
  ): Promise<SourcingEvent> {
    return this.updateEvent(id, {
      checklist_completed_status: 'In Progress',
      rejection_reason: rejectionReason || 'Checklist needs revision',
      rejected_at: new Date().toISOString()
    });
  }

  static async createEventFromBundle(
    bundleId: string,
    bundleName: string,
    category: string,
    totalValue: number,
    requests: any[],
    responsiblePlanner: string,
    organizationId: string
  ): Promise<SourcingEvent> {
    const sourcingEventId = this.generateSourcingEventId();

    const deliveryDates = requests
      .map(r => r.deliveryDate)
      .filter(d => d)
      .sort();
    const avgDeliveryDate = deliveryDates.length > 0 ? deliveryDates[Math.floor(deliveryDates.length / 2)] : undefined;

    const deliveryLocations = [...new Set(requests.map(r => r.unit).filter(u => u))];
    const deliveryLocation = deliveryLocations.length > 0 ? deliveryLocations.join(', ') : 'Multiple locations';

    const vendors = [...new Set(requests.map(r => r.vendor).filter(v => v))];

    const event: Omit<SourcingEvent, 'id' | 'created_at' | 'updated_at'> = {
      sourcing_event_id: sourcingEventId,
      title: bundleName,
      material_ids: requests.map(r => r.material),
      demand_quantity: `${requests.length} items`,
      delivery_date: avgDeliveryDate,
      delivery_location: deliveryLocation,
      estimate_price: totalValue * 1000000000,
      total_value: totalValue,
      vendor_count: vendors.length,
      estimate_schedule: {
        duration: '60 days',
        milestones: ['Tender Preparation', 'Announcement', 'Evaluation', 'Award']
      },
      shortlisted_vendors: vendors.slice(0, 5),
      status: 'Draft',
      approval_status: 'Pending',
      assigned_to: responsiblePlanner,
      created_by: responsiblePlanner,
      responsible_planner: responsiblePlanner,
      category: category,
      organization_id: organizationId,
      bundle_id: bundleId
    };

    console.log('Creating sourcing event from bundle:', event);
    return this.createEvent(event);
  }

  static generateSourcingEventId(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SRC-${year}-${random}`;
  }

  static async getMilestones(sourcingEventId: string): Promise<SourcingEventMilestone[]> {
    const milestones = this.getMockMilestones();
    return milestones.filter(m => m.sourcing_event_id === sourcingEventId);
  }

  static async createMilestone(
    milestone: Omit<SourcingEventMilestone, 'id' | 'created_at' | 'updated_at'>
  ): Promise<SourcingEventMilestone> {
    const newMilestone: SourcingEventMilestone = {
      ...milestone,
      id: `MS-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newMilestone;
  }

  static async updateMilestone(
    id: string,
    updates: Partial<SourcingEventMilestone>
  ): Promise<SourcingEventMilestone> {
    const milestones = this.getMockMilestones();
    const existing = milestones.find(m => m.id === id);
    if (!existing) throw new Error('Milestone not found');

    return {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };
  }

  static async getEventsSummary(organizationId: string): Promise<{
    total: number;
    draft: number;
    scheduled: number;
    published: number;
    inProgress: number;
    evaluation: number;
    completed: number;
    pendingApproval: number;
  }> {
    const events = await this.getAllEvents(organizationId);

    return {
      total: events.length,
      draft: events.filter(e => e.status === 'Draft').length,
      scheduled: events.filter(e => e.status === 'Scheduled').length,
      published: events.filter(e => e.status === 'Published').length,
      inProgress: events.filter(e => e.status === 'In Progress').length,
      evaluation: events.filter(e => e.status === 'Evaluation').length,
      completed: events.filter(e => e.status === 'Completed').length,
      pendingApproval: events.filter(e => e.approval_status === 'Pending').length
    };
  }

  static async getSourcingEvents(): Promise<EnrichedSourcingEvent[]> {
    const events = this.getMockEvents();
    const approvedEvents = events.filter(e => e.approval_status === 'Approved');

    const enrichedEvents: EnrichedSourcingEvent[] = approvedEvents.map(event => ({
      ...event,
      description: event.title,
      estimatedValue: event.estimate_price
        ? `Rp ${new Intl.NumberFormat('id-ID').format(event.estimate_price)}`
        : 'Not specified',
      deadline: event.delivery_date || 'Not specified',
      requirements: [],
      timeline: event.estimate_schedule?.duration || '60 days',
      assignedVendor: event.shortlisted_vendors?.[0] || 'TBD'
    }));

    return enrichedEvents;
  }

  static async getTenderDocumentsBySourcingEvent(sourcingEventId: string): Promise<TenderDocument[]> {
    return [];
  }

  static async getSubmissionsBySourcingEvent(sourcingEventId: string): Promise<DocumentSubmission[]> {
    return [];
  }

  static async getEventsWithoutTemplates(): Promise<EnrichedSourcingEvent[]> {
    const events = await this.getSourcingEvents();

    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const tenderDocuments = await this.getTenderDocumentsBySourcingEvent(event.id);
        const submissions = await this.getSubmissionsBySourcingEvent(event.id);

        return {
          ...event,
          tenderDocuments,
          submissions,
          hasTemplate: false
        };
      })
    );

    return enrichedEvents;
  }

  static async getEnrichedEventById(id: string): Promise<EnrichedSourcingEvent | null> {
    const event = await this.getEventById(id);
    if (!event) return null;

    const tenderDocuments = await this.getTenderDocumentsBySourcingEvent(id);
    const submissions = await this.getSubmissionsBySourcingEvent(id);

    return {
      ...event,
      description: event.title,
      estimatedValue: event.estimate_price
        ? `Rp ${new Intl.NumberFormat('id-ID').format(event.estimate_price)}`
        : 'Not specified',
      deadline: event.delivery_date || 'Not specified',
      requirements: [],
      timeline: event.estimate_schedule?.duration || '60 days',
      assignedVendor: event.shortlisted_vendors?.[0] || 'TBD',
      tenderDocuments,
      submissions,
      hasTemplate: false
    };
  }
}
