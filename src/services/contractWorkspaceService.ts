import contractsData from '../data/contractWorkspaceContracts.json';
import vendorFeedbackData from '../data/contractWorkspaceVendorFeedback.json';
import aiSuggestionsData from '../data/contractWorkspaceAISuggestions.json';
import stakeholderApprovalsData from '../data/contractWorkspaceStakeholderApprovals.json';

export interface ContractReview {
  id: string;
  contract_id: string;
  sourcing_event_id: string;
  vendor_name: string;
  contract_type: string;
  contract_value: number;
  deadline: string;
  status: 'pending_review' | 'in_review' | 'approved' | 'rejected';
  stage: 'stage_1_selection' | 'stage_2_ai_review' | 'stage_3_manual_edit' | 'stage_4_approval';
  original_content: any;
  created_at: string;
  updated_at: string;
}

export interface VendorFeedback {
  id: string;
  contract_review_id: string;
  section_name: string;
  feedback_type: 'modification_request' | 'clarification' | 'concern' | 'suggestion';
  feedback_text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  priority: 'high' | 'medium' | 'low';
  submitted_at: string;
}

export interface AISuggestedChange {
  id: string;
  contract_review_id: string;
  vendor_feedback_id: string;
  section_name: string;
  change_type: 'text_modification' | 'clause_addition' | 'clause_removal' | 'term_adjustment';
  original_text: string;
  suggested_text: string;
  reasoning: string;
  confidence_score: number;
  accepted: boolean;
  created_at: string;
}

export interface StakeholderApproval {
  id: string;
  contract_review_id: string;
  stakeholder_type: 'procurement' | 'legal' | 'finance' | 'executive';
  approval_status: 'pending' | 'approved' | 'rejected' | 'escalated';
  approved_by: string | null;
  approved_at: string | null;
  comments: string | null;
}

export interface InternalComment {
  id: string;
  contract_review_id: string;
  user_name: string;
  comment_text: string;
  comment_type: 'general' | 'question' | 'concern' | 'suggestion';
  created_at: string;
}

let contracts = [...contractsData] as ContractReview[];
let vendorFeedback = [...vendorFeedbackData] as VendorFeedback[];
let aiSuggestions = [...aiSuggestionsData] as AISuggestedChange[];
let stakeholderApprovals = [...stakeholderApprovalsData] as StakeholderApproval[];
let internalComments: InternalComment[] = [];

export const contractWorkspaceService = {
  async getContractsForReview(): Promise<ContractReview[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sorted = [...contracts].sort((a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );
        resolve(sorted);
      }, 300);
    });
  },

  async getContractById(id: string): Promise<ContractReview | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contract = contracts.find(c => c.id === id);
        resolve(contract || null);
      }, 200);
    });
  },

  async getVendorFeedback(contractReviewId: string): Promise<VendorFeedback[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const feedback = vendorFeedback
          .filter(f => f.contract_review_id === contractReviewId)
          .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
        resolve(feedback);
      }, 200);
    });
  },

  async getAISuggestions(contractReviewId: string): Promise<AISuggestedChange[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestions = aiSuggestions
          .filter(s => s.contract_review_id === contractReviewId)
          .sort((a, b) => b.confidence_score - a.confidence_score);
        resolve(suggestions);
      }, 200);
    });
  },

  async getStakeholderApprovals(contractReviewId: string): Promise<StakeholderApproval[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const approvals = stakeholderApprovals
          .filter(a => a.contract_review_id === contractReviewId)
          .sort((a, b) => {
            if (!a.approved_at) return 1;
            if (!b.approved_at) return -1;
            return new Date(b.approved_at).getTime() - new Date(a.approved_at).getTime();
          });
        resolve(approvals);
      }, 200);
    });
  },

  async submitStakeholderApproval(approval: StakeholderApproval): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = stakeholderApprovals.findIndex(
          a => a.contract_review_id === approval.contract_review_id &&
               a.stakeholder_type === approval.stakeholder_type
        );

        if (index !== -1) {
          stakeholderApprovals[index] = approval;
        } else {
          stakeholderApprovals.push(approval);
        }
        resolve();
      }, 300);
    });
  },

  async getInternalComments(contractReviewId: string): Promise<InternalComment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const comments = internalComments
          .filter(c => c.contract_review_id === contractReviewId)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        resolve(comments);
      }, 200);
    });
  },

  async addInternalComment(comment: Partial<InternalComment>): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newComment: InternalComment = {
          id: `comment-${Date.now()}`,
          contract_review_id: comment.contract_review_id || '',
          user_name: comment.user_name || 'Anonymous',
          comment_text: comment.comment_text || '',
          comment_type: comment.comment_type || 'general',
          created_at: new Date().toISOString()
        };
        internalComments.push(newComment);
        resolve();
      }, 200);
    });
  },

  async updateContractStage(contractId: string, stage: ContractReview['stage']): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contract = contracts.find(c => c.id === contractId);
        if (contract) {
          contract.stage = stage;
          contract.updated_at = new Date().toISOString();
        }
        resolve();
      }, 200);
    });
  },

  async updateContractStatus(contractId: string, status: ContractReview['status']): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contract = contracts.find(c => c.id === contractId);
        if (contract) {
          contract.status = status;
          contract.updated_at = new Date().toISOString();
        }
        resolve();
      }, 200);
    });
  },

  async toggleAISuggestionAcceptance(suggestionId: string, accepted: boolean): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestion = aiSuggestions.find(s => s.id === suggestionId);
        if (suggestion) {
          suggestion.accepted = accepted;
        }
        resolve();
      }, 200);
    });
  }
};
