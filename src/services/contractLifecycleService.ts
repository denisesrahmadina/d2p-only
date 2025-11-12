export interface ContractTemplate {
  id: string;
  sourcing_event_id: string;
  template_name: string;
  template_content: Record<string, any>;
  template_sections: Record<string, any>;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected';
  version: number;
  created_by: string;
  approved_by?: string;
  approval_status: 'Pending' | 'Approved' | 'Rejected';
  approval_date?: string;
  rejection_reason?: string;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ContractWorkspace {
  id: string;
  contract_template_id: string;
  sourcing_event_id: string;
  current_content: Record<string, any>;
  workspace_status: 'Active' | 'Locked' | 'Archived' | 'Submitted for Approval';
  locked_by?: string;
  locked_at?: string;
  active_editors: string[];
  organization_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ContractChangeLog {
  id: string;
  contract_workspace_id: string;
  changed_by: string;
  change_type: 'Content Edit' | 'AI Suggestion Applied' | 'Section Added' | 'Section Deleted' | 'Format Change';
  change_location: string;
  previous_content?: string;
  new_content?: string;
  ai_suggestion_id?: string;
  character_count_change: number;
  timestamp: string;
  organization_id?: string;
}

export interface ContractApproval {
  id: string;
  contract_workspace_id: string;
  contract_version: number;
  submitted_by: string;
  submitted_at: string;
  approver_id?: string;
  approval_status: 'Pending' | 'Approved' | 'Rejected' | 'Revision Requested';
  approved_at?: string;
  rejection_reason?: string;
  revision_comments?: string;
  organization_id?: string;
}

export interface ContractAIInsight {
  id: string;
  contract_workspace_id: string;
  insight_type: 'Risk Assessment' | 'Compliance Check' | 'Optimization Suggestion' | 'Best Practice' | 'Legal Review';
  severity: 'High' | 'Medium' | 'Low';
  section_reference: string;
  insight_text: string;
  suggested_action?: string;
  is_applied: boolean;
  applied_by?: string;
  applied_at?: string;
  generated_at: string;
  organization_id?: string;
}

export interface TemplateAISuggestion {
  id: string;
  contract_template_id: string;
  section: string;
  suggestion_type: 'Content Addition' | 'Content Modification' | 'Structure Change' | 'Compliance Enhancement';
  suggested_content: string;
  rationale: string;
  confidence_score: number;
  is_accepted: boolean;
  reviewed_by?: string;
  reviewed_at?: string;
  generated_at: string;
  organization_id?: string;
}

// Mock data arrays
const mockContractTemplates: ContractTemplate[] = [
  {
    id: 'CT-SE-2025-001',
    sourcing_event_id: 'SE-2025-001',
    template_name: 'Solar Panel Supply Contract Template',
    template_content: {
      general: {
        title: 'Supply Contract for Solar Panel System',
        parties: {
          supplier: '[Supplier Name]',
          buyer: 'PT Indonesia Power'
        },
        effectiveDate: '[Contract Date]',
        contractValue: '500,000,000 IDR'
      },
      scopeOfWork: {
        description: 'Supply and delivery of high-efficiency solar panels',
        deliverables: [
          '100 units of Monocrystalline Solar Panels (400W)',
          'Installation mounting hardware',
          'Technical documentation and warranties'
        ],
        specifications: {
          panelType: 'Monocrystalline',
          powerOutput: '400W per panel',
          efficiency: '≥21%',
          warranty: '25 years performance warranty'
        }
      },
      deliveryTerms: {
        location: 'Specified project site',
        schedule: 'Within 90 days of contract signing',
        incoterms: 'DDP (Delivered Duty Paid)'
      },
      paymentTerms: {
        method: 'Bank transfer',
        schedule: [
          '30% advance payment upon contract signing',
          '60% upon delivery',
          '10% after installation and commissioning'
        ],
        currency: 'Indonesian Rupiah (IDR)'
      },
      legalTerms: {
        governingLaw: 'Indonesian Law',
        disputeResolution: 'Arbitration in Jakarta',
        liability: 'Limited to contract value',
        warranties: 'Performance and quality warranties as specified'
      }
    },
    template_sections: {
      general: 'General Information',
      scopeOfWork: 'Scope of Work',
      deliveryTerms: 'Delivery Terms',
      paymentTerms: 'Payment Terms',
      legalTerms: 'Legal Terms & Conditions'
    },
    status: 'Approved',
    version: 1,
    created_by: 'admin',
    approved_by: 'legal-reviewer',
    approval_status: 'Approved',
    approval_date: new Date(Date.now() - 604800000).toISOString(),
    organization_id: 'org-1',
    created_at: new Date(Date.now() - 1296000000).toISOString(),
    updated_at: new Date(Date.now() - 604800000).toISOString()
  },
  {
    id: 'CT-SE-2025-002',
    sourcing_event_id: 'SE-2025-002',
    template_name: 'Wind Turbine Supply Contract Template',
    template_content: {
      general: {
        title: 'Supply Contract for Wind Turbine System',
        parties: {
          supplier: '[Supplier Name]',
          buyer: 'PT Indonesia Power'
        },
        effectiveDate: '[Contract Date]',
        contractValue: '2,500,000,000 IDR'
      },
      scopeOfWork: {
        description: 'Supply and delivery of commercial wind turbines',
        deliverables: [
          '5 units of 2MW Wind Turbines',
          'Foundation and mounting systems',
          'Control systems and monitoring equipment',
          'Maintenance manuals and training'
        ],
        specifications: {
          turbineType: 'Horizontal Axis',
          powerOutput: '2MW per turbine',
          rotorDiameter: '100m',
          hubHeight: '80m',
          warranty: '5 years full warranty, 20 years structural warranty'
        }
      },
      deliveryTerms: {
        location: 'Designated wind farm site',
        schedule: 'Within 180 days of contract signing',
        incoterms: 'DDP (Delivered Duty Paid)'
      },
      paymentTerms: {
        method: 'Bank transfer',
        schedule: [
          '20% advance payment upon contract signing',
          '50% upon delivery',
          '20% after installation',
          '10% after commissioning and performance testing'
        ],
        currency: 'Indonesian Rupiah (IDR)'
      },
      legalTerms: {
        governingLaw: 'Indonesian Law',
        disputeResolution: 'Arbitration in Jakarta',
        liability: 'Limited to contract value',
        warranties: 'Performance and quality warranties as specified'
      }
    },
    template_sections: {
      general: 'General Information',
      scopeOfWork: 'Scope of Work',
      deliveryTerms: 'Delivery Terms',
      paymentTerms: 'Payment Terms',
      legalTerms: 'Legal Terms & Conditions'
    },
    status: 'Approved',
    version: 1,
    created_by: 'admin',
    approved_by: 'legal-reviewer',
    approval_status: 'Approved',
    approval_date: new Date(Date.now() - 604800000).toISOString(),
    organization_id: 'org-1',
    created_at: new Date(Date.now() - 1296000000).toISOString(),
    updated_at: new Date(Date.now() - 604800000).toISOString()
  }
];

const mockWorkspaces: ContractWorkspace[] = [];
const mockChangeLogs: ContractChangeLog[] = [];
const mockApprovals: ContractApproval[] = [];
const mockAIInsights: ContractAIInsight[] = [];
const mockAISuggestions: TemplateAISuggestion[] = [];

export class ContractLifecycleService {
  // Template Methods
  static async getAllContractTemplates(): Promise<ContractTemplate[]> {
    return [...mockContractTemplates];
  }

  static async getContractTemplatesBySourcingEvent(sourcingEventId: string): Promise<ContractTemplate[]> {
    return mockContractTemplates.filter(t => t.sourcing_event_id === sourcingEventId);
  }

  static async getContractTemplateById(id: string): Promise<ContractTemplate | null> {
    return mockContractTemplates.find(t => t.id === id) || null;
  }

  // Workspace Methods
  static async getContractWorkspaceBySourcingEvent(sourcingEventId: string): Promise<ContractWorkspace | null> {
    return mockWorkspaces.find(w => w.sourcing_event_id === sourcingEventId) || null;
  }

  static async createContractWorkspace(workspace: Partial<ContractWorkspace>): Promise<ContractWorkspace> {
    const newWorkspace: ContractWorkspace = {
      id: `WS${Date.now()}`,
      contract_template_id: workspace.contract_template_id || '',
      sourcing_event_id: workspace.sourcing_event_id || '',
      current_content: workspace.current_content || {},
      workspace_status: 'Active',
      active_editors: [],
      organization_id: workspace.organization_id || 'org-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockWorkspaces.push(newWorkspace);
    return newWorkspace;
  }

  static async updateWorkspaceContent(
    id: string,
    content: Record<string, any>,
    changedBy: string,
    changeLocation: string
  ): Promise<ContractWorkspace> {
    const workspace = mockWorkspaces.find(w => w.id === id);
    if (!workspace) throw new Error('Workspace not found');

    const previousContent = { ...workspace.current_content };
    workspace.current_content = content;
    workspace.updated_at = new Date().toISOString();

    // Create change log entry
    const changeLog: ContractChangeLog = {
      id: `CL${Date.now()}`,
      contract_workspace_id: id,
      changed_by: changedBy,
      change_type: 'Content Edit',
      change_location: changeLocation,
      previous_content: JSON.stringify(previousContent),
      new_content: JSON.stringify(content),
      character_count_change: JSON.stringify(content).length - JSON.stringify(previousContent).length,
      timestamp: new Date().toISOString(),
      organization_id: workspace.organization_id
    };
    mockChangeLogs.push(changeLog);

    return workspace;
  }

  static async submitWorkspaceForApproval(id: string): Promise<ContractWorkspace> {
    const workspace = mockWorkspaces.find(w => w.id === id);
    if (!workspace) throw new Error('Workspace not found');

    workspace.workspace_status = 'Submitted for Approval';
    workspace.updated_at = new Date().toISOString();

    return workspace;
  }

  // Change Log Methods
  static async createChangeLog(log: Partial<ContractChangeLog>): Promise<ContractChangeLog> {
    const newLog: ContractChangeLog = {
      id: `CL${Date.now()}`,
      contract_workspace_id: log.contract_workspace_id || '',
      changed_by: log.changed_by || '',
      change_type: log.change_type || 'Content Edit',
      change_location: log.change_location || '',
      previous_content: log.previous_content,
      new_content: log.new_content,
      ai_suggestion_id: log.ai_suggestion_id,
      character_count_change: log.character_count_change || 0,
      timestamp: new Date().toISOString(),
      organization_id: log.organization_id || 'org-1'
    };
    mockChangeLogs.push(newLog);
    return newLog;
  }

  static async getChangeLogsByWorkspace(workspaceId: string): Promise<ContractChangeLog[]> {
    return mockChangeLogs.filter(log => log.contract_workspace_id === workspaceId);
  }

  static async getChangeLogsByUser(userId: string): Promise<ContractChangeLog[]> {
    return mockChangeLogs.filter(log => log.changed_by === userId);
  }

  // Approval Methods
  static async createApprovalRequest(approval: Partial<ContractApproval>): Promise<ContractApproval> {
    const newApproval: ContractApproval = {
      id: `AP${Date.now()}`,
      contract_workspace_id: approval.contract_workspace_id || '',
      contract_version: approval.contract_version || 1,
      submitted_by: approval.submitted_by || '',
      submitted_at: new Date().toISOString(),
      approval_status: 'Pending',
      organization_id: approval.organization_id || 'org-1'
    };
    mockApprovals.push(newApproval);
    return newApproval;
  }

  static async getApprovalsByWorkspace(workspaceId: string): Promise<ContractApproval[]> {
    return mockApprovals.filter(a => a.contract_workspace_id === workspaceId);
  }

  static async getPendingApprovals(): Promise<ContractApproval[]> {
    return mockApprovals.filter(a => a.approval_status === 'Pending');
  }

  static async approveContract(approvalId: string, approverId: string, comments?: string): Promise<ContractApproval> {
    const approval = mockApprovals.find(a => a.id === approvalId);
    if (!approval) throw new Error('Approval not found');

    approval.approval_status = 'Approved';
    approval.approver_id = approverId;
    approval.approved_at = new Date().toISOString();

    return approval;
  }

  static async rejectContract(approvalId: string, approverId: string, comments: string): Promise<ContractApproval> {
    const approval = mockApprovals.find(a => a.id === approvalId);
    if (!approval) throw new Error('Approval not found');

    approval.approval_status = 'Rejected';
    approval.approver_id = approverId;
    approval.approved_at = new Date().toISOString();
    approval.rejection_reason = comments;

    return approval;
  }

  static async requestRevision(approvalId: string, approverId: string, comments: string): Promise<ContractApproval> {
    const approval = mockApprovals.find(a => a.id === approvalId);
    if (!approval) throw new Error('Approval not found');

    approval.approval_status = 'Revision Requested';
    approval.approver_id = approverId;
    approval.approved_at = new Date().toISOString();
    approval.revision_comments = comments;

    return approval;
  }

  // AI Insight Methods
  static async analyzeContractRisks(workspaceId: string, contractContent: Record<string, any>): Promise<ContractAIInsight[]> {
    const insights: ContractAIInsight[] = [];

    // Generate 2 mock insights for testing
    if (!contractContent.legalTerms?.liability || contractContent.legalTerms.liability.includes('Limited to contract value')) {
      insights.push({
        id: `AI${Date.now()}_1`,
        contract_workspace_id: workspaceId,
        insight_type: 'Risk Assessment',
        severity: 'High',
        section_reference: 'legalTerms.liability',
        insight_text: 'Liability is limited to contract value. Consider adding provisions for consequential damages in critical contracts.',
        suggested_action: 'Add clause: "Notwithstanding the limitation above, liability for gross negligence shall not be limited."',
        is_applied: false,
        generated_at: new Date().toISOString(),
        organization_id: 'org-1'
      });
    }

    if (!contractContent.deliveryTerms?.penaltyClause) {
      insights.push({
        id: `AI${Date.now()}_2`,
        contract_workspace_id: workspaceId,
        insight_type: 'Compliance Check',
        severity: 'Medium',
        section_reference: 'deliveryTerms',
        insight_text: 'No penalty clause found for late delivery. This is recommended for procurement contracts.',
        suggested_action: 'Add penalty clause: "For each day of delay, 0.1% of contract value shall be deducted, up to maximum 10%."',
        is_applied: false,
        generated_at: new Date().toISOString(),
        organization_id: 'org-1'
      });
    }

    // Add to mock array
    insights.forEach(insight => mockAIInsights.push(insight));

    return insights;
  }

  static async getInsightsByWorkspace(workspaceId: string): Promise<ContractAIInsight[]> {
    return mockAIInsights.filter(i => i.contract_workspace_id === workspaceId);
  }

  static async getInsightsByCategory(workspaceId: string, category: string): Promise<ContractAIInsight[]> {
    return mockAIInsights.filter(
      i => i.contract_workspace_id === workspaceId && i.insight_type === category
    );
  }

  static async applyAIInsight(insightId: string, appliedBy: string): Promise<ContractAIInsight> {
    const insight = mockAIInsights.find(i => i.id === insightId);
    if (!insight) throw new Error('Insight not found');

    insight.is_applied = true;
    insight.applied_by = appliedBy;
    insight.applied_at = new Date().toISOString();

    return insight;
  }
}
