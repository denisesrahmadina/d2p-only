import { ProcurementRequest, DeliveryLocation, CartItem } from '../types/marketplace';
import { MarketplaceService } from './marketplaceService';
import { ContractsService } from './contractsService';
import { mockProcurementRequests } from '../data/marketplaceMockData';

export class ProcurementRequestEnhancedService {
  private static prs = [...mockProcurementRequests];
  private static nextPRId = 3;

  static async createPRFromCart(
    deliveryLocation: DeliveryLocation,
    requestorId: string,
    notes?: string
  ): Promise<{
    success: boolean;
    message: string;
    pr_numbers?: string[];
  }> {
    try {
      const cart = MarketplaceService.getCart();

      if (cart.length === 0) {
        return { success: false, message: 'Cart is empty' };
      }

      const validation = MarketplaceService.validateCart();
      if (!validation.valid) {
        return {
          success: false,
          message: validation.errors.join(', ')
        };
      }

      const prNumbers: string[] = [];
      const prDate = new Date().toISOString().split('T')[0];

      for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const prNumber = `PR-${new Date().getFullYear()}-${String(this.nextPRId).padStart(4, '0')}`;

        const prData: ProcurementRequest = {
          pr_id: this.nextPRId++,
          pr_number: prNumber,
          pr_line_number: 1,
          pr_type: 'Standard',
          pr_status: 'Pending Approval',
          pr_date: prDate,
          material_id: item.material.material_id,
          vendor_id: item.vendor.vendor_id,
          unit_requestor_id: requestorId,
          requirement_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          delivery_location: deliveryLocation,
          demand_qty: item.quantity,
          qty_ordered: 0,
          unit_price: item.unit_price,
          pr_value: item.total_price,
          currency: item.contract.contract_currency,
          approval_chain: [
            {
              approver_id: 'APP-001',
              approver_name: 'Manager Procurement',
              approver_role: 'Manager',
              status: 'Pending',
              comments: ''
            }
          ],
          notes: notes || `Created from marketplace cart - ${item.material.material_description}`,
          created_date: new Date().toISOString()
        };

        this.prs.push(prData);
        prNumbers.push(prNumber);
      }

      if (prNumbers.length > 0) {
        MarketplaceService.clearCart();

        return {
          success: true,
          message: `${prNumbers.length} procurement request(s) created successfully`,
          pr_numbers: prNumbers
        };
      } else {
        return {
          success: false,
          message: 'Failed to create procurement requests'
        };
      }
    } catch (error) {
      console.error('Error creating PR from cart:', error);
      return {
        success: false,
        message: 'An error occurred while creating procurement requests'
      };
    }
  }

  static async getProcurementRequests(filters?: {
    status?: string;
    requestorId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ProcurementRequest[]> {
    try {
      let filteredPRs = [...this.prs];

      if (filters?.status) {
        filteredPRs = filteredPRs.filter(pr => pr.pr_status === filters.status);
      }

      if (filters?.requestorId) {
        filteredPRs = filteredPRs.filter(pr => pr.unit_requestor_id === filters.requestorId);
      }

      if (filters?.dateFrom) {
        filteredPRs = filteredPRs.filter(pr => pr.pr_date >= filters.dateFrom!);
      }

      if (filters?.dateTo) {
        filteredPRs = filteredPRs.filter(pr => pr.pr_date <= filters.dateTo!);
      }

      return filteredPRs.sort((a, b) => {
        const dateA = new Date(a.pr_date).getTime();
        const dateB = new Date(b.pr_date).getTime();
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error fetching procurement requests:', error);
      return [];
    }
  }

  static async getPRById(prId: number): Promise<ProcurementRequest | null> {
    try {
      return this.prs.find(pr => pr.pr_id === prId) || null;
    } catch (error) {
      console.error('Error fetching PR:', error);
      return null;
    }
  }

  static async updatePRStatus(
    prId: number,
    newStatus: string,
    comments?: string
  ): Promise<boolean> {
    try {
      const prIndex = this.prs.findIndex(pr => pr.pr_id === prId);
      if (prIndex === -1) return false;

      const pr = this.prs[prIndex];

      this.prs[prIndex] = {
        ...pr,
        pr_status: newStatus as ProcurementRequest['pr_status'],
        approval_chain: pr.approval_chain?.map(step => ({
          ...step,
          status: newStatus === 'Approved' ? 'Approved' : newStatus === 'Rejected' ? 'Rejected' : step.status,
          action_date: new Date().toISOString(),
          comments: comments || step.comments
        }))
      };

      if (newStatus === 'Approved') {
        await this.convertPRtoPO(prId);
      }

      return true;
    } catch (error) {
      console.error('Error updating PR status:', error);
      return false;
    }
  }

  private static async convertPRtoPO(prId: number): Promise<boolean> {
    try {
      const pr = await this.getPRById(prId);
      if (!pr) return false;

      const { OrderTrackingService } = await import('./orderTrackingService');
      const poNumber = `PO-${new Date().getFullYear()}-${String(OrderTrackingService.getNextPOId()).padStart(4, '0')}`;

      await OrderTrackingService.createPOFromPR(pr, poNumber);

      const prIndex = this.prs.findIndex(p => p.pr_id === prId);
      if (prIndex !== -1) {
        this.prs[prIndex] = {
          ...this.prs[prIndex],
          pr_status: 'In Procurement',
          qty_ordered: pr.demand_qty
        };
      }

      return true;
    } catch (error) {
      console.error('Error converting PR to PO:', error);
      return false;
    }
  }

  static async getPRSummary(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    in_procurement: number;
    total_value: number;
  }> {
    try {
      const summary = {
        total: this.prs.length,
        pending: 0,
        approved: 0,
        rejected: 0,
        in_procurement: 0,
        total_value: 0
      };

      this.prs.forEach(pr => {
        summary.total_value += pr.pr_value;

        switch (pr.pr_status) {
          case 'Pending Approval':
            summary.pending++;
            break;
          case 'Approved':
            summary.approved++;
            break;
          case 'Rejected':
            summary.rejected++;
            break;
          case 'In Procurement':
            summary.in_procurement++;
            break;
        }
      });

      return summary;
    } catch (error) {
      console.error('Error getting PR summary:', error);
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        in_procurement: 0,
        total_value: 0
      };
    }
  }

  static async getPRWithApprovalChain(prId: number) {
    try {
      return this.prs.find(pr => pr.pr_id === prId) || null;
    } catch (error) {
      console.error('Error fetching PR with approval chain:', error);
      return null;
    }
  }

  static async updateApprovalStep(
    prId: number,
    approverId: string,
    approverName: string,
    status: 'Approved' | 'Rejected',
    comments?: string
  ): Promise<boolean> {
    try {
      const pr = await this.getPRById(prId);
      if (!pr || !pr.approval_chain) return false;

      const approvalChain = Array.isArray(pr.approval_chain) ? [...pr.approval_chain] : [];
      const currentStepIndex = approvalChain.findIndex(
        step => step.approver_id === approverId && step.status === 'Pending'
      );

      if (currentStepIndex === -1) return false;

      approvalChain[currentStepIndex] = {
        ...approvalChain[currentStepIndex],
        status,
        action_date: new Date().toISOString(),
        comments
      };

      let newPRStatus = pr.pr_status;
      if (status === 'Rejected') {
        newPRStatus = 'Rejected';
      } else if (status === 'Approved') {
        const allApproved = approvalChain.every(step => step.status === 'Approved');
        if (allApproved) {
          newPRStatus = 'Approved';
        }
      }

      const prIndex = this.prs.findIndex(p => p.pr_id === prId);
      if (prIndex !== -1) {
        this.prs[prIndex] = {
          ...this.prs[prIndex],
          approval_chain: approvalChain,
          pr_status: newPRStatus
        };
      }

      if (newPRStatus === 'Approved') {
        await this.convertPRtoPO(prId);
      }

      return true;
    } catch (error) {
      console.error('Error updating approval step:', error);
      return false;
    }
  }

  static async getApprovalHistory(prId: number) {
    try {
      const pr = await this.getPRById(prId);
      if (!pr || !pr.approval_chain) return [];

      return Array.isArray(pr.approval_chain) ? pr.approval_chain : [];
    } catch (error) {
      console.error('Error getting approval history:', error);
      return [];
    }
  }

  static async calculateApprovalPath(prValue: number) {
    const { PRApprovalAgentService } = await import('./ai/prApprovalAgentService');
    return PRApprovalAgentService.suggestOptimalApprovalPath(prValue);
  }

  static async initializeApprovalChain(prId: number, prValue: number): Promise<boolean> {
    try {
      const approvalPath = await this.calculateApprovalPath(prValue);

      const approvalChain = approvalPath.approvers.map((approver, index) => ({
        approver_id: `APPROVER-${index + 1}`,
        approver_name: approver.role,
        approver_role: approver.role,
        status: 'Pending' as const,
        action_date: undefined,
        comments: undefined
      }));

      const prIndex = this.prs.findIndex(pr => pr.pr_id === prId);
      if (prIndex !== -1) {
        this.prs[prIndex] = {
          ...this.prs[prIndex],
          approval_chain: approvalChain,
          pr_status: 'Pending Approval'
        };
      }

      return true;
    } catch (error) {
      console.error('Error initializing approval chain:', error);
      return false;
    }
  }
}
