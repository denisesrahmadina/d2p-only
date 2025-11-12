import { supabase } from './supabaseClient';
import { MarketplaceService } from './marketplaceService';

export interface PRHeader {
  pr_id?: number;
  pr_number: string;
  requestor_name: string;
  requestor_id: string;
  department: string;
  pr_date: string;
  requirement_date: string;
  total_value: number;
  currency: string;
  pr_status: 'Draft' | 'Pending Approval' | 'Requested Revision' | 'Approved' | 'Rejected' | 'In Procurement' | 'Completed' | 'Cancelled';
  vendor_id?: string;
  notes?: string;
  attachment_count?: number;
  attachment_metadata?: any;
  delivery_location_data?: any;
  created_from_contract?: string;
  approval_chain?: any;
  created_date?: string;
  modified_date?: string;
}

export interface PRLine {
  pr_line_id?: number;
  pr_id: number;
  pr_number: string;
  line_number: number;
  material_id: string;
  quantity: number;
  uom: string;
  unit_price: number;
  subtotal: number;
  notes?: string;
  contract_reference?: string;
  created_date?: string;
}

export interface PRWithDetails extends PRHeader {
  lines?: PRLine[];
  vendor?: any;
  approval_history?: any[];
}

export class PRService {
  static async getPRList(filters?: {
    status?: string;
    requestorId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<PRWithDetails[]> {
    try {
      let query = supabase
        .from('fact_pr_header')
        .select(`
          *,
          vendor:dim_vendor(*)
        `)
        .order('pr_date', { ascending: false });

      if (filters?.status) {
        query = query.eq('pr_status', filters.status);
      }

      if (filters?.requestorId) {
        query = query.eq('requestor_id', filters.requestorId);
      }

      if (filters?.dateFrom) {
        query = query.gte('pr_date', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('pr_date', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(pr => ({
        ...pr,
        vendor: Array.isArray(pr.vendor) ? pr.vendor[0] : pr.vendor
      }));
    } catch (error) {
      console.error('Error fetching PR list:', error);
      return [];
    }
  }

  static async getPRById(prId: number): Promise<PRWithDetails | null> {
    try {
      const { data: pr, error: prError } = await supabase
        .from('fact_pr_header')
        .select(`
          *,
          vendor:dim_vendor(*)
        `)
        .eq('pr_id', prId)
        .maybeSingle();

      if (prError) throw prError;
      if (!pr) return null;

      const { data: lines, error: linesError } = await supabase
        .from('fact_pr_line')
        .select('*')
        .eq('pr_id', prId)
        .order('line_number');

      if (linesError) throw linesError;

      const { data: history, error: historyError } = await supabase
        .from('fact_pr_approval_history')
        .select('*')
        .eq('pr_id', prId)
        .order('action_date', { ascending: false });

      if (historyError) throw historyError;

      return {
        ...pr,
        vendor: Array.isArray(pr.vendor) ? pr.vendor[0] : pr.vendor,
        lines: lines || [],
        approval_history: history || []
      };
    } catch (error) {
      console.error('Error fetching PR details:', error);
      return null;
    }
  }

  static async getPRByNumber(prNumber: string): Promise<PRWithDetails | null> {
    try {
      const { data: pr, error: prError } = await supabase
        .from('fact_pr_header')
        .select(`
          *,
          vendor:dim_vendor(*)
        `)
        .eq('pr_number', prNumber)
        .maybeSingle();

      if (prError) throw prError;
      if (!pr) return null;

      const { data: lines, error: linesError } = await supabase
        .from('fact_pr_line')
        .select('*')
        .eq('pr_number', prNumber)
        .order('line_number');

      if (linesError) throw linesError;

      const { data: history, error: historyError } = await supabase
        .from('fact_pr_approval_history')
        .select('*')
        .eq('pr_number', prNumber)
        .order('action_date', { ascending: false });

      if (historyError) throw historyError;

      return {
        ...pr,
        vendor: Array.isArray(pr.vendor) ? pr.vendor[0] : pr.vendor,
        lines: lines || [],
        approval_history: history || []
      };
    } catch (error) {
      console.error('Error fetching PR by number:', error);
      return null;
    }
  }

  static async createPRFromCart(
    requestorName: string,
    requestorId: string,
    department: string,
    deliveryLocation: any,
    notes?: string
  ): Promise<{ success: boolean; message: string; pr_numbers?: string[] }> {
    try {
      const cart = MarketplaceService.getCart();

      if (cart.length === 0) {
        return { success: false, message: 'Cart is empty' };
      }

      const validation = MarketplaceService.validateCart();
      if (!validation.valid) {
        return { success: false, message: validation.errors.join(', ') };
      }

      const prNumbers: string[] = [];
      const today = new Date().toISOString().split('T')[0];
      const requirementDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      for (const item of cart) {
        const prNumber = `PR-${new Date().getFullYear()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const totalValue = item.total_price;
        let approvalChain: any[] = [];

        if (totalValue < 10000000) {
          approvalChain = [
            {
              approver_id: 'MGR-001',
              approver_name: 'Department Manager',
              approver_role: 'Manager',
              status: 'Pending'
            }
          ];
        } else if (totalValue < 50000000) {
          approvalChain = [
            {
              approver_id: 'MGR-001',
              approver_name: 'Department Manager',
              approver_role: 'Manager',
              status: 'Pending'
            },
            {
              approver_id: 'FIN-001',
              approver_name: 'Finance Manager',
              approver_role: 'Finance Manager',
              status: 'Pending'
            }
          ];
        } else {
          approvalChain = [
            {
              approver_id: 'MGR-001',
              approver_name: 'Department Manager',
              approver_role: 'Manager',
              status: 'Pending'
            },
            {
              approver_id: 'FIN-001',
              approver_name: 'Finance Manager',
              approver_role: 'Finance Manager',
              status: 'Pending'
            },
            {
              approver_id: 'DIR-001',
              approver_name: 'Director',
              approver_role: 'Director',
              status: 'Pending'
            }
          ];
        }

        const { data: prHeader, error: headerError } = await supabase
          .from('fact_pr_header')
          .insert({
            pr_number: prNumber,
            requestor_name: requestorName,
            requestor_id: requestorId,
            department,
            pr_date: today,
            requirement_date: requirementDate,
            total_value: totalValue,
            currency: item.contract.contract_currency,
            pr_status: 'Pending Approval',
            vendor_id: item.vendor.vendor_id,
            notes: notes || `Created from marketplace - ${item.material.material_description}`,
            attachment_count: 0,
            attachment_metadata: [],
            delivery_location_data: deliveryLocation,
            created_from_contract: item.contract_id,
            approval_chain: approvalChain
          })
          .select()
          .single();

        if (headerError) throw headerError;

        const { error: lineError } = await supabase
          .from('fact_pr_line')
          .insert({
            pr_id: prHeader.pr_id,
            pr_number: prNumber,
            line_number: 1,
            material_id: item.material.material_id,
            quantity: item.quantity,
            uom: item.material.unit_of_measure,
            unit_price: item.unit_price,
            subtotal: item.total_price,
            notes: item.notes,
            contract_reference: item.contract_id
          });

        if (lineError) throw lineError;

        const { error: historyError } = await supabase
          .from('fact_pr_approval_history')
          .insert({
            pr_id: prHeader.pr_id,
            pr_number: prNumber,
            approval_level: 0,
            approver_id: requestorId,
            approver_name: requestorName,
            approver_role: 'Requestor',
            action: 'Submitted',
            comments: 'PR created and submitted for approval',
            action_date: new Date().toISOString(),
            previous_status: 'Draft',
            new_status: 'Pending Approval'
          });

        if (historyError) throw historyError;

        prNumbers.push(prNumber);
      }

      MarketplaceService.clearCart();

      return {
        success: true,
        message: `${prNumbers.length} procurement request(s) created successfully`,
        pr_numbers: prNumbers
      };
    } catch (error) {
      console.error('Error creating PR from cart:', error);
      return {
        success: false,
        message: 'An error occurred while creating procurement requests'
      };
    }
  }

  static async getPRStatusSummary(): Promise<{
    total: number;
    draft: number;
    pending_approval: number;
    revision_needed: number;
    approved: number;
    rejected: number;
    in_procurement: number;
    completed: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('fact_pr_header')
        .select('pr_status');

      if (error) throw error;

      const summary = {
        total: data?.length || 0,
        draft: 0,
        pending_approval: 0,
        revision_needed: 0,
        approved: 0,
        rejected: 0,
        in_procurement: 0,
        completed: 0
      };

      (data || []).forEach(pr => {
        switch (pr.pr_status) {
          case 'Draft':
            summary.draft++;
            break;
          case 'Pending Approval':
            summary.pending_approval++;
            break;
          case 'Requested Revision':
            summary.revision_needed++;
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
          case 'Completed':
            summary.completed++;
            break;
        }
      });

      return summary;
    } catch (error) {
      console.error('Error fetching PR status summary:', error);
      return {
        total: 0,
        draft: 0,
        pending_approval: 0,
        revision_needed: 0,
        approved: 0,
        rejected: 0,
        in_procurement: 0,
        completed: 0
      };
    }
  }

  static async updatePRStatus(
    prId: number,
    newStatus: string,
    approverId: string,
    approverName: string,
    approverRole: string,
    comments?: string
  ): Promise<boolean> {
    try {
      const pr = await this.getPRById(prId);
      if (!pr) return false;

      const { error: updateError } = await supabase
        .from('fact_pr_header')
        .update({
          pr_status: newStatus,
          modified_date: new Date().toISOString()
        })
        .eq('pr_id', prId);

      if (updateError) throw updateError;

      const approvalLevel = pr.approval_chain?.findIndex((a: any) => a.approver_id === approverId) + 1 || 1;

      const { error: historyError } = await supabase
        .from('fact_pr_approval_history')
        .insert({
          pr_id: prId,
          pr_number: pr.pr_number,
          approval_level: approvalLevel,
          approver_id: approverId,
          approver_name: approverName,
          approver_role: approverRole,
          action: newStatus === 'Approved' ? 'Approved' : newStatus === 'Rejected' ? 'Rejected' : 'Reviewed',
          comments: comments || '',
          action_date: new Date().toISOString(),
          previous_status: pr.pr_status,
          new_status: newStatus
        });

      if (historyError) throw historyError;

      return true;
    } catch (error) {
      console.error('Error updating PR status:', error);
      return false;
    }
  }
}
