import { supabase } from './supabaseClient';
import { BAMasterService } from './baMasterService';
import { BAStatus, BAWorkflowStep, BAParty, RoleType, ActionStatus } from '../types/ba';

export class BAWorkflowService {
  private static STATUS_TRANSITIONS: Record<BAStatus, BAStatus[]> = {
    DRAFT: ['SUBMITTED', 'CANCELLED'],
    SUBMITTED: ['UNDER_REVIEW', 'CANCELLED'],
    UNDER_REVIEW: ['UNDER_APPROVAL', 'REJECTED', 'DRAFT'],
    UNDER_APPROVAL: ['APPROVED', 'REJECTED', 'UNDER_REVIEW'],
    APPROVED: [],
    REJECTED: ['DRAFT'],
    CANCELLED: []
  };

  static isValidTransition(currentStatus: BAStatus, newStatus: BAStatus): boolean {
    return this.STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) || false;
  }

  static async initializeWorkflow(
    baId: number,
    parties: BAParty[]
  ): Promise<boolean> {
    try {
      const checkerVendors = parties.filter(p => p.role_type === 'Checker Vendor');
      const checkerPLNs = parties.filter(p => p.role_type === 'Checker PLN');
      const approverVendors = parties.filter(p => p.role_type === 'Approver Vendor');
      const approverPLNs = parties.filter(p => p.role_type === 'Approver PLN');

      const workflowSteps: Omit<BAWorkflowStep, 'workflow_step_id' | 'created_date'>[] = [];
      let stepOrder = 1;

      for (const checker of checkerVendors) {
        workflowSteps.push({
          ba_id: baId,
          step_type: 'REVIEW',
          step_role: 'Checker Vendor',
          step_order: stepOrder++,
          actor_party_id: checker.party_id,
          actor_user_id: checker.party_user_id,
          actor_name: checker.party_name,
          actor_role: checker.party_position,
          action_status: 'PENDING',
          is_parallel: checkerVendors.length > 1,
          parallel_group_id: 'checker_vendor_group',
          requires_all_approval: true
        });
      }

      for (const checker of checkerPLNs) {
        workflowSteps.push({
          ba_id: baId,
          step_type: 'REVIEW',
          step_role: 'Checker PLN',
          step_order: stepOrder++,
          actor_party_id: checker.party_id,
          actor_user_id: checker.party_user_id,
          actor_name: checker.party_name,
          actor_role: checker.party_position,
          action_status: 'PENDING',
          is_parallel: checkerPLNs.length > 1,
          parallel_group_id: 'checker_pln_group',
          requires_all_approval: true
        });
      }

      for (const approver of approverVendors) {
        workflowSteps.push({
          ba_id: baId,
          step_type: 'APPROVE',
          step_role: 'Approver Vendor',
          step_order: stepOrder++,
          actor_party_id: approver.party_id,
          actor_user_id: approver.party_user_id,
          actor_name: approver.party_name,
          actor_role: approver.party_position,
          action_status: 'PENDING',
          is_parallel: approverVendors.length > 1,
          parallel_group_id: 'approver_vendor_group',
          requires_all_approval: true
        });
      }

      for (const approver of approverPLNs) {
        workflowSteps.push({
          ba_id: baId,
          step_type: 'APPROVE',
          step_role: 'Approver PLN',
          step_order: stepOrder++,
          actor_party_id: approver.party_id,
          actor_user_id: approver.party_user_id,
          actor_name: approver.party_name,
          actor_role: approver.party_position,
          action_status: 'PENDING',
          is_parallel: approverPLNs.length > 1,
          parallel_group_id: 'approver_pln_group',
          requires_all_approval: true
        });
      }

      if (workflowSteps.length > 0) {
        const { error } = await supabase
          .from('fact_ba_workflow_step')
          .insert(workflowSteps);

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error initializing workflow:', error);
      return false;
    }
  }

  static async submitForReview(
    baId: number,
    submittedBy: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const ba = await BAMasterService.getBAById(baId);
      if (!ba) {
        return { success: false, message: 'BA not found' };
      }

      if (ba.ba_status !== 'DRAFT') {
        return { success: false, message: 'Only DRAFT BAs can be submitted' };
      }

      const validationResult = await this.validateBeforeSubmit(ba);
      if (!validationResult.isValid) {
        return { success: false, message: validationResult.errors.join(', ') };
      }

      const hasCheckers =
        ba.parties?.some(p => p.role_type === 'Checker Vendor' || p.role_type === 'Checker PLN') ||
        false;

      const newStatus: BAStatus = hasCheckers ? 'UNDER_REVIEW' : 'UNDER_APPROVAL';

      await BAMasterService.updateBAStatus(baId, 'SUBMITTED', submittedBy, 'BA submitted for review');

      if (ba.parties) {
        await this.initializeWorkflow(baId, ba.parties);
      }

      await BAMasterService.updateBAStatus(baId, newStatus, submittedBy);

      return { success: true, message: 'BA submitted successfully' };
    } catch (error) {
      console.error('Error submitting BA:', error);
      return { success: false, message: 'An error occurred while submitting' };
    }
  }

  static async processReview(
    baId: number,
    actorUserId: string,
    actorName: string,
    action: 'APPROVED' | 'REJECTED',
    comments?: string,
    rejectionReasonId?: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const steps = await BAMasterService.getWorkflowSteps(baId);
      const userStep = steps.find(
        s =>
          s.actor_user_id === actorUserId &&
          s.action_status === 'PENDING' &&
          s.step_type === 'REVIEW'
      );

      if (!userStep) {
        return { success: false, message: 'No pending review found for this user' };
      }

      const { error: updateError } = await supabase
        .from('fact_ba_workflow_step')
        .update({
          action_status: action,
          action_date: new Date().toISOString(),
          action_comments: comments,
          rejection_reason_id: rejectionReasonId
        })
        .eq('workflow_step_id', userStep.workflow_step_id);

      if (updateError) throw updateError;

      await supabase
        .from('dim_ba_parties')
        .update({
          action_status: action,
          action_date: new Date().toISOString(),
          action_comments: comments
        })
        .eq('party_id', userStep.actor_party_id);

      if (action === 'REJECTED') {
        await BAMasterService.updateBAStatus(baId, 'REJECTED', actorName, comments);
        return { success: true, message: 'BA rejected' };
      }

      const allStepsApproved = await this.checkAllStepsInGroupApproved(baId, userStep.parallel_group_id || '', 'REVIEW');

      if (allStepsApproved) {
        const hasApprovers = steps.some(s => s.step_type === 'APPROVE');

        if (hasApprovers) {
          await BAMasterService.updateBAStatus(baId, 'UNDER_APPROVAL', actorName);
        } else {
          await BAMasterService.updateBAStatus(baId, 'APPROVED', actorName);
        }
      }

      return { success: true, message: 'Review processed successfully' };
    } catch (error) {
      console.error('Error processing review:', error);
      return { success: false, message: 'An error occurred while processing review' };
    }
  }

  static async processApproval(
    baId: number,
    actorUserId: string,
    actorName: string,
    action: 'APPROVED' | 'REJECTED',
    comments?: string,
    rejectionReasonId?: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const steps = await BAMasterService.getWorkflowSteps(baId);
      const userStep = steps.find(
        s =>
          s.actor_user_id === actorUserId &&
          s.action_status === 'PENDING' &&
          s.step_type === 'APPROVE'
      );

      if (!userStep) {
        return { success: false, message: 'No pending approval found for this user' };
      }

      const { error: updateError } = await supabase
        .from('fact_ba_workflow_step')
        .update({
          action_status: action,
          action_date: new Date().toISOString(),
          action_comments: comments,
          rejection_reason_id: rejectionReasonId
        })
        .eq('workflow_step_id', userStep.workflow_step_id);

      if (updateError) throw updateError;

      await supabase
        .from('dim_ba_parties')
        .update({
          action_status: action,
          action_date: new Date().toISOString(),
          action_comments: comments
        })
        .eq('party_id', userStep.actor_party_id);

      if (action === 'REJECTED') {
        await BAMasterService.updateBAStatus(baId, 'REJECTED', actorName, comments);
        return { success: true, message: 'BA rejected' };
      }

      const allStepsApproved = await this.checkAllStepsInGroupApproved(baId, userStep.parallel_group_id || '', 'APPROVE');

      if (allStepsApproved) {
        await BAMasterService.updateBAStatus(baId, 'APPROVED', actorName);

        const ba = await BAMasterService.getBAById(baId);
        if (ba && ba.ba_type === 'BA Serah Terima Barang') {
          await this.triggerERPIntegration(baId);
          await this.triggerOrderMonitoringSync(baId);
        }
      }

      return { success: true, message: 'Approval processed successfully' };
    } catch (error) {
      console.error('Error processing approval:', error);
      return { success: false, message: 'An error occurred while processing approval' };
    }
  }

  private static async checkAllStepsInGroupApproved(
    baId: number,
    parallelGroupId: string,
    stepType: 'REVIEW' | 'APPROVE'
  ): Promise<boolean> {
    try {
      const { data: steps, error } = await supabase
        .from('fact_ba_workflow_step')
        .select('*')
        .eq('ba_id', baId)
        .eq('step_type', stepType);

      if (error) throw error;

      if (!parallelGroupId) {
        return steps?.every(s => s.action_status === 'APPROVED') || false;
      }

      const groupSteps = steps?.filter(s => s.parallel_group_id === parallelGroupId) || [];
      const allGroupApproved = groupSteps.every(s => s.action_status === 'APPROVED');

      if (!allGroupApproved) {
        return false;
      }

      const otherGroupSteps = steps?.filter(s => s.parallel_group_id !== parallelGroupId) || [];
      const allOtherApproved = otherGroupSteps.every(s => s.action_status === 'APPROVED');

      return allOtherApproved;
    } catch (error) {
      console.error('Error checking group approval:', error);
      return false;
    }
  }

  private static async validateBeforeSubmit(ba: any): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!ba.parties || ba.parties.length === 0) {
      errors.push('No parties assigned');
    }

    const hasMakerVendor = ba.parties?.some((p: BAParty) => p.role_type === 'Maker Vendor');
    const hasMakerPLN = ba.parties?.some((p: BAParty) => p.role_type === 'Maker PLN');

    if (!hasMakerVendor) {
      errors.push('Maker Vendor is required');
    }

    if (!hasMakerPLN) {
      errors.push('Maker PLN is required');
    }

    if (ba.ba_type === 'BA Pemeriksaan') {
      if (!ba.pemeriksaan_details || ba.pemeriksaan_details.length === 0) {
        errors.push('Inspection details are required');
      }
    } else if (ba.ba_type === 'BA Serah Terima Barang') {
      if (!ba.serah_terima_details || ba.serah_terima_details.length === 0) {
        errors.push('Handover details are required');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static async triggerERPIntegration(baId: number): Promise<void> {
    try {
      const ba = await BAMasterService.getBAById(baId);
      if (!ba) return;

      const payload = {
        ba_id: baId,
        ba_number: ba.ba_number,
        po_number: ba.po_number,
        vendor_id: ba.vendor_id,
        handover_details: ba.serah_terima_details
      };

      await supabase.from('fact_ba_erp_integration_log').insert([
        {
          ba_id: baId,
          integration_type: 'GR_CREATION',
          integration_direction: 'OUTBOUND',
          request_payload: payload,
          request_timestamp: new Date().toISOString(),
          integration_status: 'PENDING',
          retry_count: 0,
          max_retry: 3
        }
      ]);

      await supabase
        .from('dim_ba_master')
        .update({ gr_creation_status: 'PENDING' })
        .eq('ba_id', baId);
    } catch (error) {
      console.error('Error triggering ERP integration:', error);
    }
  }

  private static async triggerOrderMonitoringSync(baId: number): Promise<void> {
    try {
      const ba = await BAMasterService.getBAById(baId);
      if (!ba) return;

      await supabase.from('fact_ba_order_monitoring_sync').insert([
        {
          ba_id: baId,
          po_number: ba.po_number,
          previous_status: 'In Inspection',
          new_status: 'Order Received',
          timeline_stage: 'RECEIVED',
          sync_status: 'PENDING',
          retry_count: 0
        }
      ]);

      await supabase
        .from('dim_ba_master')
        .update({ order_monitoring_sync_status: 'PENDING' })
        .eq('ba_id', baId);
    } catch (error) {
      console.error('Error triggering order monitoring sync:', error);
    }
  }

  static async cancelBA(
    baId: number,
    cancelledBy: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const ba = await BAMasterService.getBAById(baId);
      if (!ba) {
        return { success: false, message: 'BA not found' };
      }

      if (!['DRAFT', 'SUBMITTED'].includes(ba.ba_status)) {
        return { success: false, message: 'Only DRAFT or SUBMITTED BAs can be cancelled' };
      }

      await BAMasterService.updateBAStatus(baId, 'CANCELLED', cancelledBy, reason);

      return { success: true, message: 'BA cancelled successfully' };
    } catch (error) {
      console.error('Error cancelling BA:', error);
      return { success: false, message: 'An error occurred while cancelling' };
    }
  }

  static canUserAct(
    userId: string,
    ba: any,
    actionType: 'REVIEW' | 'APPROVE'
  ): boolean {
    if (!ba.parties || !ba.workflow_steps) return false;

    const userParty = ba.parties.find((p: BAParty) => p.party_user_id === userId);
    if (!userParty) return false;

    const userStep = ba.workflow_steps.find(
      (s: BAWorkflowStep) =>
        s.actor_user_id === userId &&
        s.action_status === 'PENDING' &&
        s.step_type === actionType
    );

    return !!userStep;
  }
}
