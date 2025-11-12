import mockData from '../data/eprocurementMockData.json';

export interface ProcurementChecklistItem {
  id: string;
  sourcing_event_id?: string;
  sourcing_event_line_id?: number;
  item_name: string;
  item_type: string;
  description?: string;
  status: string;
  priority: string;
  ai_rationale?: string;
  completion_date?: string;
  completed_by?: string;
  auto_complete_trigger: boolean;
  linked_document_id?: string;
  assigned_to?: string;
  notes?: string;
  organization_id: string;
  file_name?: string;
  file_url?: string;
  uploaded_by?: string;
  uploaded_on?: string;
  document_summary?: string;
  ai_generated?: boolean;
  action_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChecklistGenerationParams {
  sourcing_event_id?: string;
  sourcing_event_line_id?: number;
  event_details: {
    title: string;
    category: string;
    estimate_price: number;
    material_ids?: string[];
    delivery_location?: string;
  };
  organization_id: string;
}

export class ProcurementChecklistService {
  private static readonly SESSION_STORAGE_KEY = 'session_checklist_items';

  private static getMockChecklists(): ProcurementChecklistItem[] {
    return mockData.checklistItems as ProcurementChecklistItem[];
  }

  private static getSessionChecklists(): ProcurementChecklistItem[] {
    try {
      const stored = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading session checklists:', error);
      return [];
    }
  }

  private static saveSessionChecklistItem(item: ProcurementChecklistItem): void {
    try {
      const sessionItems = this.getSessionChecklists();
      const existingIndex = sessionItems.findIndex(i => i.id === item.id);

      if (existingIndex >= 0) {
        sessionItems[existingIndex] = item;
      } else {
        sessionItems.push(item);
      }

      sessionStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify(sessionItems));
    } catch (error) {
      console.error('Error saving session checklist item:', error);
    }
  }

  static async getChecklistBySourcingEvent(
    sourcingEventId: string,
    organizationId: string
  ): Promise<ProcurementChecklistItem[]> {
    const mockItems = this.getMockChecklists();
    const sessionItems = this.getSessionChecklists();
    const allItems = [...mockItems, ...sessionItems];

    return allItems.filter(
      i => i.sourcing_event_id === sourcingEventId && i.organization_id === organizationId
    );
  }

  static async getChecklistBySourcingEventLineId(
    sourcingEventLineId: number
  ): Promise<ProcurementChecklistItem[]> {
    const mockItems = this.getMockChecklists();
    const sessionItems = this.getSessionChecklists();
    const allItems = [...mockItems, ...sessionItems];
    return allItems.filter(i => i.sourcing_event_line_id === sourcingEventLineId);
  }

  static async getChecklistItem(id: string): Promise<ProcurementChecklistItem | null> {
    const mockItems = this.getMockChecklists();
    const sessionItems = this.getSessionChecklists();
    const allItems = [...mockItems, ...sessionItems];
    return allItems.find(i => i.id === id) || null;
  }

  static async createChecklistItem(
    item: Omit<ProcurementChecklistItem, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ProcurementChecklistItem> {
    const newItem: ProcurementChecklistItem = {
      ...item,
      id: `CHK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Save to session storage
    this.saveSessionChecklistItem(newItem);

    return newItem;
  }

  static async updateChecklistItem(
    id: string,
    updates: Partial<ProcurementChecklistItem>
  ): Promise<ProcurementChecklistItem> {
    const existing = await this.getChecklistItem(id);
    if (!existing) throw new Error('Checklist item not found');

    const updatedItem = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Save to session storage
    this.saveSessionChecklistItem(updatedItem);

    return updatedItem;
  }

  static async deleteChecklistItem(id: string): Promise<void> {
    return;
  }

  static async completeChecklistItem(
    id: string,
    completedBy: string
  ): Promise<ProcurementChecklistItem> {
    return this.updateChecklistItem(id, {
      status: 'Completed',
      completion_date: new Date().toISOString(),
      completed_by: completedBy
    });
  }

  static async generateAIChecklist(
    params: ChecklistGenerationParams
  ): Promise<ProcurementChecklistItem[]> {
    console.log('ProcurementChecklistService.generateAIChecklist called with:', params);

    if (!params.organization_id) {
      throw new Error('Organization ID is required to generate checklist');
    }

    const { sourcing_event_id, sourcing_event_line_id, event_details, organization_id } = params;
    const checklistItems: Omit<ProcurementChecklistItem, 'id' | 'created_at' | 'updated_at'>[] = [];

    checklistItems.push({
      sourcing_event_id,
      sourcing_event_line_id,
      item_name: 'Compliance Review',
      item_type: 'Document',
      description: 'Review procurement for regulatory and internal policy compliance',
      status: 'Completed',
      priority: 'Critical',
      ai_rationale: 'Compliance review ensures adherence to procurement regulations and company policies.',
      auto_complete_trigger: false,
      organization_id,
      file_name: 'Compliance_Review_Report.pdf',
      uploaded_by: 'System Administrator',
      uploaded_on: new Date().toISOString(),
      completion_date: new Date().toISOString(),
      completed_by: 'System Administrator',
      document_summary: 'All regulatory and internal policy requirements have been verified and approved.',
      ai_generated: false
    });

    checklistItems.push({
      sourcing_event_id,
      sourcing_event_line_id,
      item_name: 'Budget Verification',
      item_type: 'Document',
      description: 'Verify budget allocation and financial approval for procurement',
      status: 'Completed',
      priority: 'Critical',
      ai_rationale: 'Budget verification confirms financial resources are available and properly allocated.',
      auto_complete_trigger: false,
      organization_id,
      file_name: 'Budget_Verification_Report.pdf',
      uploaded_by: 'Finance Team',
      uploaded_on: new Date().toISOString(),
      completion_date: new Date().toISOString(),
      completed_by: 'Finance Team',
      document_summary: 'Budget has been verified and approved. Funds are allocated and available.',
      ai_generated: false
    });

    checklistItems.push({
      sourcing_event_id,
      sourcing_event_line_id,
      item_name: 'Tender Document',
      item_type: 'Document',
      description: 'Create and finalize tender documentation including technical specifications and commercial terms',
      status: 'Pending',
      priority: 'Critical',
      ai_rationale: 'Tender document is required to formally invite vendors and define procurement requirements.',
      auto_complete_trigger: true,
      organization_id,
      action_type: 'create_tender'
    });

    checklistItems.push({
      sourcing_event_id,
      sourcing_event_line_id,
      item_name: 'Vendor Shortlist Verification',
      item_type: 'Validation',
      description: 'Verify and validate shortlisted vendors meet qualification criteria',
      status: 'Pending',
      priority: 'High',
      ai_rationale: 'Vendor qualification verification ensures only capable suppliers participate in the tender.',
      auto_complete_trigger: false,
      organization_id,
      action_type: 'select_vendor'
    });

    console.log(`Attempting to create ${checklistItems.length} checklist items`);

    const createdItems: ProcurementChecklistItem[] = [];
    for (const item of checklistItems) {
      try {
        const created = await this.createChecklistItem(item);
        createdItems.push(created);
        console.log(`Created checklist item: ${item.item_name}`);
      } catch (error) {
        console.error(`Failed to create checklist item: ${item.item_name}`, error);
        throw new Error(`Failed to create checklist item "${item.item_name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    console.log(`Successfully created ${createdItems.length} checklist items`);
    return createdItems;
  }

  static async getChecklistStats(organizationId: string) {
    const items = this.getMockChecklists().filter(i => i.organization_id === organizationId);

    const stats = {
      total: items.length,
      pending: items.filter(item => item.status === 'Pending').length,
      inProgress: items.filter(item => item.status === 'In Progress').length,
      completed: items.filter(item => item.status === 'Completed').length,
      blocked: items.filter(item => item.status === 'Blocked').length,
      critical: items.filter(item => item.priority === 'Critical').length,
      high: items.filter(item => item.priority === 'High').length
    };

    return stats;
  }

  static async checkIfAllItemsCompleted(
    sourcingEventId: string,
    organizationId: string
  ): Promise<boolean> {
    const items = await this.getChecklistBySourcingEvent(sourcingEventId, organizationId);

    if (items.length === 0) {
      return false;
    }

    return items.every(item => item.status === 'Completed');
  }

  static async checkIfAllItemsCompletedByLineId(
    sourcingEventLineId: number
  ): Promise<boolean> {
    const items = await this.getChecklistBySourcingEventLineId(sourcingEventLineId);

    if (items.length === 0) {
      return false;
    }

    return items.every(item => item.status === 'Completed');
  }
}
