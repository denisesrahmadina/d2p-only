import { supabase } from './supabaseClient';
import {
  BAMaster,
  BAWithDetails,
  BAParty,
  BAPemeriksaanDetail,
  BASerahTerimaDetail,
  BAWorkflowStep,
  BADocumentAttachment,
  BAProcessHistory,
  BAStatus,
  BAType,
  BAKPIStats,
  ActionType
} from '../types/ba';
import { mockBAMasterData, mockBAKPIStats, mockBADetailsMap } from '../data/baMockData';

// Flag to use mock data instead of database
const USE_MOCK_DATA = true;

export class BAMasterService {
  static async getAllBAs(filters?: {
    ba_type?: BAType;
    ba_status?: BAStatus;
    created_by?: string;
    vendor_id?: string;
    contract_id?: string;
    search_query?: string;
  }): Promise<BAMaster[]> {
    if (USE_MOCK_DATA) {
      // Use mock data
      let filteredData = [...mockBAMasterData];

      if (filters?.ba_type) {
        filteredData = filteredData.filter(ba => ba.ba_type === filters.ba_type);
      }

      if (filters?.ba_status) {
        filteredData = filteredData.filter(ba => ba.ba_status === filters.ba_status);
      }

      if (filters?.created_by) {
        filteredData = filteredData.filter(ba => ba.created_by === filters.created_by);
      }

      if (filters?.vendor_id) {
        filteredData = filteredData.filter(ba => ba.vendor_id === filters.vendor_id);
      }

      if (filters?.contract_id) {
        filteredData = filteredData.filter(ba => ba.contract_id === filters.contract_id);
      }

      if (filters?.search_query) {
        const query = filters.search_query.toLowerCase();
        filteredData = filteredData.filter(ba =>
          ba.ba_number.toLowerCase().includes(query) ||
          ba.po_number.toLowerCase().includes(query) ||
          ba.project_name?.toLowerCase().includes(query) ||
          ba.vendor_id.toLowerCase().includes(query)
        );
      }

      return filteredData;
    }

    try {
      let query = supabase
        .from('dim_ba_master')
        .select('*')
        .order('created_date', { ascending: false });

      if (filters?.ba_type) {
        query = query.eq('ba_type', filters.ba_type);
      }

      if (filters?.ba_status) {
        query = query.eq('ba_status', filters.ba_status);
      }

      if (filters?.created_by) {
        query = query.eq('created_by', filters.created_by);
      }

      if (filters?.vendor_id) {
        query = query.eq('vendor_id', filters.vendor_id);
      }

      if (filters?.contract_id) {
        query = query.eq('contract_id', filters.contract_id);
      }

      if (filters?.search_query) {
        query = query.or(
          `ba_number.ilike.%${filters.search_query}%,po_number.ilike.%${filters.search_query}%,project_name.ilike.%${filters.search_query}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching BAs:', error);
      return [];
    }
  }

  static async getBAById(baId: number): Promise<BAWithDetails | null> {
    if (USE_MOCK_DATA) {
      // Use mock data
      const ba = mockBAMasterData.find(b => b.ba_id === baId);
      if (!ba) return null;

      // Return detailed data if available, otherwise return basic BA data
      return mockBADetailsMap[baId] || {
        ...ba,
        parties: [],
        pemeriksaan_details: [],
        serah_terima_details: [],
        workflow_steps: [],
        documents: [],
        process_history: []
      };
    }

    try {
      const { data: ba, error: baError } = await supabase
        .from('dim_ba_master')
        .select('*')
        .eq('ba_id', baId)
        .maybeSingle();

      if (baError) throw baError;
      if (!ba) return null;

      const parties = await this.getBAParties(baId);
      const workflowSteps = await this.getWorkflowSteps(baId);
      const documents = await this.getDocuments(baId);
      const processHistory = await this.getProcessHistory(baId);

      let pemeriksaan_details: BAPemeriksaanDetail[] = [];
      let serah_terima_details: BASerahTerimaDetail[] = [];
      let linked_ba_pemeriksaan: BAMaster | undefined;

      if (ba.ba_type === 'BA Pemeriksaan') {
        pemeriksaan_details = await this.getPemeriksaanDetails(baId);
      } else if (ba.ba_type === 'BA Serah Terima Barang') {
        serah_terima_details = await this.getSerahTerimaDetails(baId);

        if (ba.linked_ba_pemeriksaan_id) {
          const { data: linkedBA } = await supabase
            .from('dim_ba_master')
            .select('*')
            .eq('ba_id', ba.linked_ba_pemeriksaan_id)
            .maybeSingle();

          if (linkedBA) {
            linked_ba_pemeriksaan = linkedBA;
          }
        }
      }

      return {
        ...ba,
        parties,
        pemeriksaan_details,
        serah_terima_details,
        workflow_steps: workflowSteps,
        documents,
        process_history: processHistory,
        linked_ba_pemeriksaan
      };
    } catch (error) {
      console.error('Error fetching BA by ID:', error);
      return null;
    }
  }

  static async getBAParties(baId: number): Promise<BAParty[]> {
    try {
      const { data, error } = await supabase
        .from('dim_ba_parties')
        .select('*')
        .eq('ba_id', baId)
        .order('role_type');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching BA parties:', error);
      return [];
    }
  }

  static async getPemeriksaanDetails(baId: number): Promise<BAPemeriksaanDetail[]> {
    try {
      const { data, error } = await supabase
        .from('fact_ba_pemeriksaan_detail')
        .select('*')
        .eq('ba_id', baId)
        .order('inspection_id');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pemeriksaan details:', error);
      return [];
    }
  }

  static async getSerahTerimaDetails(baId: number): Promise<BASerahTerimaDetail[]> {
    try {
      const { data, error } = await supabase
        .from('fact_ba_serah_terima_detail')
        .select('*')
        .eq('ba_id', baId)
        .order('handover_id');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching serah terima details:', error);
      return [];
    }
  }

  static async getWorkflowSteps(baId: number): Promise<BAWorkflowStep[]> {
    try {
      const { data, error } = await supabase
        .from('fact_ba_workflow_step')
        .select('*')
        .eq('ba_id', baId)
        .order('step_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching workflow steps:', error);
      return [];
    }
  }

  static async getDocuments(baId: number): Promise<BADocumentAttachment[]> {
    try {
      const { data, error } = await supabase
        .from('fact_ba_document_attachment')
        .select('*')
        .eq('ba_id', baId)
        .eq('is_active', true)
        .order('uploaded_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  }

  static async getProcessHistory(baId: number): Promise<BAProcessHistory[]> {
    try {
      const { data, error } = await supabase
        .from('fact_ba_process_history')
        .select('*')
        .eq('ba_id', baId)
        .order('action_timestamp', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching process history:', error);
      return [];
    }
  }

  static async createBA(
    baData: Partial<BAMaster>,
    parties: BAParty[],
    details?: BAPemeriksaanDetail[] | BASerahTerimaDetail[]
  ): Promise<BAWithDetails | null> {
    try {
      const { data: newBA, error: baError } = await supabase
        .from('dim_ba_master')
        .insert([
          {
            ...baData,
            ba_status: 'DRAFT',
            ba_version: 1,
            is_overdue: false,
            is_locked: false,
            has_digital_signature: false,
            gr_creation_status: 'NOT_APPLICABLE',
            order_monitoring_sync_status: 'NOT_APPLICABLE'
          }
        ])
        .select()
        .single();

      if (baError) throw baError;

      await this.addProcessHistory(newBA.ba_id, {
        action_type: 'CREATED',
        action_by_name: baData.created_by || 'System',
        action_comments: 'BA created',
        new_status: 'DRAFT'
      });

      if (parties && parties.length > 0) {
        await this.assignParties(newBA.ba_id, parties);
      }

      if (details && details.length > 0) {
        if (baData.ba_type === 'BA Pemeriksaan') {
          await this.savePemeriksaanDetails(newBA.ba_id, details as BAPemeriksaanDetail[]);
        } else if (baData.ba_type === 'BA Serah Terima Barang') {
          await this.saveSerahTerimaDetails(newBA.ba_id, details as BASerahTerimaDetail[]);
        }
      }

      return this.getBAById(newBA.ba_id);
    } catch (error) {
      console.error('Error creating BA:', error);
      return null;
    }
  }

  static async updateBA(baId: number, updates: Partial<BAMaster>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('dim_ba_master')
        .update({
          ...updates,
          modified_date: new Date().toISOString()
        })
        .eq('ba_id', baId);

      if (error) throw error;

      await this.addProcessHistory(baId, {
        action_type: 'MODIFIED',
        action_by_name: updates.modified_by || 'System',
        action_comments: 'BA updated'
      });

      return true;
    } catch (error) {
      console.error('Error updating BA:', error);
      return false;
    }
  }

  static async assignParties(baId: number, parties: BAParty[]): Promise<boolean> {
    try {
      const partiesWithBAId = parties.map(party => ({
        ...party,
        ba_id: baId,
        action_required: ['Checker Vendor', 'Checker PLN', 'Approver Vendor', 'Approver PLN'].includes(
          party.role_type
        ),
        action_status: ['Checker Vendor', 'Checker PLN', 'Approver Vendor', 'Approver PLN'].includes(
          party.role_type
        )
          ? 'PENDING'
          : 'NOT_REQUIRED'
      }));

      const { error } = await supabase.from('dim_ba_parties').insert(partiesWithBAId);

      if (error) throw error;

      await this.addProcessHistory(baId, {
        action_type: 'PARTY_ASSIGNED',
        action_by_name: 'System',
        action_comments: `${parties.length} parties assigned`
      });

      return true;
    } catch (error) {
      console.error('Error assigning parties:', error);
      return false;
    }
  }

  static async savePemeriksaanDetails(
    baId: number,
    details: BAPemeriksaanDetail[]
  ): Promise<boolean> {
    try {
      const detailsWithBAId = details.map(detail => ({
        ...detail,
        ba_id: baId
      }));

      const { error } = await supabase
        .from('fact_ba_pemeriksaan_detail')
        .insert(detailsWithBAId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving pemeriksaan details:', error);
      return false;
    }
  }

  static async saveSerahTerimaDetails(
    baId: number,
    details: BASerahTerimaDetail[]
  ): Promise<boolean> {
    try {
      const detailsWithBAId = details.map(detail => ({
        ...detail,
        ba_id: baId
      }));

      const { error } = await supabase
        .from('fact_ba_serah_terima_detail')
        .insert(detailsWithBAId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving serah terima details:', error);
      return false;
    }
  }

  static async addProcessHistory(
    baId: number,
    history: Partial<BAProcessHistory>
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from('fact_ba_process_history').insert([
        {
          ...history,
          ba_id: baId,
          action_timestamp: new Date().toISOString()
        }
      ]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding process history:', error);
      return false;
    }
  }

  static async updateBAStatus(
    baId: number,
    newStatus: BAStatus,
    actionBy: string,
    comments?: string
  ): Promise<boolean> {
    try {
      const { data: currentBA, error: fetchError } = await supabase
        .from('dim_ba_master')
        .select('ba_status')
        .eq('ba_id', baId)
        .single();

      if (fetchError) throw fetchError;

      const previousStatus = currentBA.ba_status;

      const updates: Partial<BAMaster> = {
        ba_status: newStatus,
        modified_by: actionBy,
        modified_date: new Date().toISOString()
      };

      if (newStatus === 'SUBMITTED') {
        updates.submitted_date = new Date().toISOString();
        updates.submitted_by = actionBy;
      } else if (newStatus === 'UNDER_REVIEW') {
        updates.review_started_date = new Date().toISOString();
      } else if (newStatus === 'UNDER_APPROVAL') {
        updates.approval_started_date = new Date().toISOString();
      } else if (newStatus === 'APPROVED') {
        updates.final_approval_date = new Date().toISOString();
        updates.final_approved_by = actionBy;
      } else if (newStatus === 'REJECTED') {
        updates.rejection_date = new Date().toISOString();
        updates.rejection_by = actionBy;
      } else if (newStatus === 'CANCELLED') {
        updates.cancellation_date = new Date().toISOString();
        updates.cancellation_by = actionBy;
        updates.cancellation_reason = comments;
      }

      const { error: updateError } = await supabase
        .from('dim_ba_master')
        .update(updates)
        .eq('ba_id', baId);

      if (updateError) throw updateError;

      await this.addProcessHistory(baId, {
        action_type: this.mapStatusToActionType(newStatus),
        action_by_name: actionBy,
        previous_status: previousStatus,
        new_status: newStatus,
        action_comments: comments
      });

      return true;
    } catch (error) {
      console.error('Error updating BA status:', error);
      return false;
    }
  }

  private static mapStatusToActionType(status: BAStatus): ActionType {
    const mapping: Record<BAStatus, ActionType> = {
      DRAFT: 'SAVED_DRAFT',
      SUBMITTED: 'SUBMITTED',
      UNDER_REVIEW: 'REVIEWED',
      UNDER_APPROVAL: 'REVIEWED',
      APPROVED: 'APPROVED',
      REJECTED: 'REJECTED',
      CANCELLED: 'CANCELLED'
    };
    return mapping[status];
  }

  static async getKPIStats(userId?: string): Promise<BAKPIStats> {
    if (USE_MOCK_DATA) {
      // Use mock data - return pre-calculated stats
      return mockBAKPIStats;
    }

    try {
      let query = supabase.from('dim_ba_master').select('*');

      if (userId) {
        query = query.or(`created_by.eq.${userId},ba_id.in.(select ba_id from dim_ba_parties where party_user_id = '${userId}')`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const bas = data || [];

      const stats: BAKPIStats = {
        total: bas.length,
        by_status: {
          draft: bas.filter(ba => ba.ba_status === 'DRAFT').length,
          submitted: bas.filter(ba => ba.ba_status === 'SUBMITTED').length,
          under_review: bas.filter(ba => ba.ba_status === 'UNDER_REVIEW').length,
          under_approval: bas.filter(ba => ba.ba_status === 'UNDER_APPROVAL').length,
          approved: bas.filter(ba => ba.ba_status === 'APPROVED').length,
          rejected: bas.filter(ba => ba.ba_status === 'REJECTED').length,
          cancelled: bas.filter(ba => ba.ba_status === 'CANCELLED').length
        },
        by_type: {
          pemeriksaan: bas.filter(ba => ba.ba_type === 'BA Pemeriksaan').length,
          serah_terima: bas.filter(ba => ba.ba_type === 'BA Serah Terima Barang').length
        },
        outstanding_reviews: bas.filter(ba => ba.ba_status === 'UNDER_REVIEW').length,
        approvals_needed: bas.filter(ba => ba.ba_status === 'UNDER_APPROVAL').length,
        overdue: bas.filter(ba => ba.is_overdue).length,
        completed_this_month: bas.filter(ba => {
          if (!ba.final_approval_date) return false;
          const approvalDate = new Date(ba.final_approval_date);
          const now = new Date();
          return (
            approvalDate.getMonth() === now.getMonth() &&
            approvalDate.getFullYear() === now.getFullYear()
          );
        }).length
      };

      return stats;
    } catch (error) {
      console.error('Error fetching KPI stats:', error);
      return {
        total: 0,
        by_status: {
          draft: 0,
          submitted: 0,
          under_review: 0,
          under_approval: 0,
          approved: 0,
          rejected: 0,
          cancelled: 0
        },
        by_type: {
          pemeriksaan: 0,
          serah_terima: 0
        },
        outstanding_reviews: 0,
        approvals_needed: 0,
        overdue: 0,
        completed_this_month: 0
      };
    }
  }

  static async getMyActionItems(userId: string): Promise<BAMaster[]> {
    try {
      const { data: partiesData, error: partiesError } = await supabase
        .from('dim_ba_parties')
        .select('ba_id')
        .eq('party_user_id', userId)
        .eq('action_required', true)
        .eq('action_status', 'PENDING');

      if (partiesError) throw partiesError;

      if (!partiesData || partiesData.length === 0) {
        return [];
      }

      const baIds = partiesData.map(p => p.ba_id);

      const { data: basData, error: basError } = await supabase
        .from('dim_ba_master')
        .select('*')
        .in('ba_id', baIds)
        .order('created_date', { ascending: false });

      if (basError) throw basError;
      return basData || [];
    } catch (error) {
      console.error('Error fetching action items:', error);
      return [];
    }
  }

  static generateBANumber(baType: BAType): string {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    const prefix = baType === 'BA Pemeriksaan' ? 'BAP' : 'BAST';

    return `${prefix}/${year}/${month}/${random}`;
  }
}
