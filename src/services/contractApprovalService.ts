import mockData from '../data/contractApprovalWorkflows.json';

export interface ApprovalWorkflow {
  id: string;
  contract_id: string;
  contract_title: string;
  vendor_name: string;
  contract_value: number;
  contract_type: string;
  status: string;
  current_stage: string;
  initiated_by?: string;
  initiated_at: string;
  completed_at?: string;
  final_document_url?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface ApprovalStage {
  id: string;
  workflow_id: string;
  stage_name: string;
  stage_order: number;
  approver_role: string;
  approver_id?: string;
  approver_name?: string;
  status: string;
  decision?: string;
  comments?: string;
  feedback?: string;
  requested_changes?: string;
  approved_at?: string;
  rejected_at?: string;
  signature_id?: string;
  notified_at?: string;
  reminder_sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ApprovalSignature {
  id: string;
  stage_id: string;
  workflow_id: string;
  signer_id?: string;
  signer_name: string;
  signer_role: string;
  signature_data: string;
  signature_type: string;
  ip_address?: string;
  user_agent?: string;
  signed_at: string;
  verification_code?: string;
  created_at: string;
}

export interface ApprovalHistory {
  id: string;
  workflow_id: string;
  stage_id?: string;
  action: string;
  actor_id?: string;
  actor_name: string;
  actor_role?: string;
  previous_status?: string;
  new_status?: string;
  comments?: string;
  metadata?: any;
  created_at: string;
}

let workflowsData = [...mockData.workflows];
let stagesData = [...mockData.stages];
let signaturesData = [...mockData.signatures];
let historyData = [...mockData.history];

export const contractApprovalService = {
  async getApprovalWorkflows(): Promise<ApprovalWorkflow[]> {
    return Promise.resolve(
      [...workflowsData].sort((a, b) =>
        new Date(b.initiated_at).getTime() - new Date(a.initiated_at).getTime()
      )
    );
  },

  async getWorkflowById(id: string): Promise<ApprovalWorkflow | null> {
    return Promise.resolve(workflowsData.find(w => w.id === id) || null);
  },

  async getWorkflowStages(workflowId: string): Promise<ApprovalStage[]> {
    return Promise.resolve(
      stagesData
        .filter(s => s.workflow_id === workflowId)
        .sort((a, b) => a.stage_order - b.stage_order)
    );
  },

  async getStageById(id: string): Promise<ApprovalStage | null> {
    return Promise.resolve(stagesData.find(s => s.id === id) || null);
  },

  async getWorkflowSignatures(workflowId: string): Promise<ApprovalSignature[]> {
    return Promise.resolve(
      signaturesData
        .filter(s => s.workflow_id === workflowId)
        .sort((a, b) => new Date(a.signed_at).getTime() - new Date(b.signed_at).getTime())
    );
  },

  async getWorkflowHistory(workflowId: string): Promise<ApprovalHistory[]> {
    return Promise.resolve(
      historyData
        .filter(h => h.workflow_id === workflowId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    );
  },

  async approveStage(
    stageId: string,
    workflowId: string,
    comments: string,
    actorName: string,
    signatureData: string
  ): Promise<void> {
    const now = new Date().toISOString();
    
    const newSigId = `sig-${Date.now()}`;
    const newSignature: ApprovalSignature = {
      id: newSigId,
      stage_id: stageId,
      workflow_id: workflowId,
      signer_name: actorName,
      signer_role: 'Approver',
      signature_data: signatureData,
      signature_type: 'drawn',
      signed_at: now,
      created_at: now
    };
    
    signaturesData.push(newSignature);
    
    const stageIndex = stagesData.findIndex(s => s.id === stageId);
    if (stageIndex !== -1) {
      stagesData[stageIndex] = {
        ...stagesData[stageIndex],
        status: 'approved',
        decision: 'approved',
        comments,
        approved_at: now,
        signature_id: newSigId,
        updated_at: now
      };
    }
    
    historyData.push({
      id: `hist-${Date.now()}`,
      workflow_id: workflowId,
      stage_id: stageId,
      action: 'stage_approved',
      actor_name: actorName,
      actor_role: 'Approver',
      previous_status: 'pending',
      new_status: 'approved',
      comments,
      created_at: now
    });
    
    const workflowStages = stagesData.filter(s => s.workflow_id === workflowId);
    const allApproved = workflowStages.every(s => s.status === 'approved');
    
    const workflowIndex = workflowsData.findIndex(w => w.id === workflowId);
    if (workflowIndex !== -1) {
      if (allApproved) {
        workflowsData[workflowIndex] = {
          ...workflowsData[workflowIndex],
          status: 'approved',
          current_stage: 'completed',
          completed_at: now,
          updated_at: now
        };
        
        historyData.push({
          id: `hist-${Date.now()}-complete`,
          workflow_id: workflowId,
          action: 'workflow_completed',
          actor_name: 'System',
          actor_role: 'System',
          new_status: 'approved',
          comments: 'All approvals completed',
          created_at: now
        });
      } else {
        const nextStage = workflowStages
          .sort((a, b) => a.stage_order - b.stage_order)
          .find(s => s.status === 'pending');
          
        if (nextStage) {
          workflowsData[workflowIndex] = {
            ...workflowsData[workflowIndex],
            current_stage: nextStage.stage_name.toLowerCase().replace(' ', '_'),
            status: 'in_progress',
            updated_at: now
          };
        }
      }
    }
    
    return Promise.resolve();
  },

  async rejectStage(
    stageId: string,
    workflowId: string,
    feedback: string,
    actorName: string
  ): Promise<void> {
    const now = new Date().toISOString();
    
    const stageIndex = stagesData.findIndex(s => s.id === stageId);
    if (stageIndex !== -1) {
      stagesData[stageIndex] = {
        ...stagesData[stageIndex],
        status: 'rejected',
        decision: 'rejected',
        feedback,
        rejected_at: now,
        updated_at: now
      };
    }
    
    const workflowIndex = workflowsData.findIndex(w => w.id === workflowId);
    if (workflowIndex !== -1) {
      workflowsData[workflowIndex] = {
        ...workflowsData[workflowIndex],
        status: 'rejected',
        updated_at: now
      };
    }
    
    historyData.push({
      id: `hist-${Date.now()}`,
      workflow_id: workflowId,
      stage_id: stageId,
      action: 'stage_rejected',
      actor_name: actorName,
      actor_role: 'Approver',
      previous_status: 'pending',
      new_status: 'rejected',
      comments: feedback,
      created_at: now
    });
    
    return Promise.resolve();
  },

  async requestChanges(
    stageId: string,
    workflowId: string,
    changes: string,
    actorName: string
  ): Promise<void> {
    const now = new Date().toISOString();
    
    const stageIndex = stagesData.findIndex(s => s.id === stageId);
    if (stageIndex !== -1) {
      stagesData[stageIndex] = {
        ...stagesData[stageIndex],
        status: 'changes_requested',
        requested_changes: changes,
        updated_at: now
      };
    }
    
    const workflowIndex = workflowsData.findIndex(w => w.id === workflowId);
    if (workflowIndex !== -1) {
      workflowsData[workflowIndex] = {
        ...workflowsData[workflowIndex],
        status: 'changes_requested',
        updated_at: now
      };
    }
    
    historyData.push({
      id: `hist-${Date.now()}`,
      workflow_id: workflowId,
      stage_id: stageId,
      action: 'changes_requested',
      actor_name: actorName,
      actor_role: 'Approver',
      previous_status: 'pending',
      new_status: 'changes_requested',
      comments: changes,
      created_at: now
    });
    
    return Promise.resolve();
  }
};
