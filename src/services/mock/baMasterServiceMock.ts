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
} from '../../types/ba';
import { mockBADocuments } from '../../data/mockData/apbaMockData';
import { mockBAParties } from '../../data/mockData/apbaPartiesMockData';
import { mockPemeriksaanDetails, mockSerahTerimaDetails } from '../../data/mockData/apbaPemeriksaanSerahTerimaMockData';
import { mockWorkflowSteps } from '../../data/mockData/apbaWorkflowMockData';
import { mockBADocuments as mockDocuments } from '../../data/mockData/apbaDocumentsMockData';
import { mockProcessHistory } from '../../data/mockData/apbaHistoryMockData';

const STORAGE_KEYS = {
  BA_DOCUMENTS: 'apba_ba_documents',
  BA_PARTIES: 'apba_ba_parties',
  PEMERIKSAAN_DETAILS: 'apba_pemeriksaan_details',
  SERAH_TERIMA_DETAILS: 'apba_serah_terima_details',
  WORKFLOW_STEPS: 'apba_workflow_steps',
  DOCUMENTS: 'apba_documents',
  PROCESS_HISTORY: 'apba_process_history'
};

class BAMasterServiceMockClass {
  private initializeStorage(key: string, defaultData: any) {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(defaultData));
    }
  }

  private getFromStorage<T>(key: string, defaultData: T[]): T[] {
    this.initializeStorage(key, defaultData);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultData;
  }

  private saveToStorage<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private simulateDelay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAllBAs(filters?: {
    ba_type?: BAType;
    ba_status?: BAStatus;
    created_by?: string;
    vendor_id?: string;
    contract_id?: string;
    search_query?: string;
  }): Promise<BAMaster[]> {
    await this.simulateDelay();

    let bas = this.getFromStorage<BAMaster>(STORAGE_KEYS.BA_DOCUMENTS, mockBADocuments);

    if (filters?.ba_type) {
      bas = bas.filter(ba => ba.ba_type === filters.ba_type);
    }

    if (filters?.ba_status) {
      bas = bas.filter(ba => ba.ba_status === filters.ba_status);
    }

    if (filters?.created_by) {
      bas = bas.filter(ba => ba.created_by === filters.created_by);
    }

    if (filters?.vendor_id) {
      bas = bas.filter(ba => ba.vendor_id === filters.vendor_id);
    }

    if (filters?.contract_id) {
      bas = bas.filter(ba => ba.contract_id === filters.contract_id);
    }

    if (filters?.search_query) {
      const query = filters.search_query.toLowerCase();
      bas = bas.filter(ba =>
        ba.ba_number.toLowerCase().includes(query) ||
        ba.po_number.toLowerCase().includes(query) ||
        (ba.project_name && ba.project_name.toLowerCase().includes(query))
      );
    }

    return bas.sort((a, b) => {
      const dateA = new Date(a.created_date).getTime();
      const dateB = new Date(b.created_date).getTime();
      return dateB - dateA;
    });
  }

  async getBAById(baId: number): Promise<BAWithDetails | null> {
    await this.simulateDelay();

    const bas = this.getFromStorage<BAMaster>(STORAGE_KEYS.BA_DOCUMENTS, mockBADocuments);
    const ba = bas.find(b => b.ba_id === baId);

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
        const linkedBA = bas.find(b => b.ba_id === ba.linked_ba_pemeriksaan_id);
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
  }

  async getBAParties(baId: number): Promise<BAParty[]> {
    await this.simulateDelay(100);
    const parties = this.getFromStorage<BAParty>(STORAGE_KEYS.BA_PARTIES, mockBAParties);
    return parties.filter(p => p.ba_id === baId).sort((a, b) => {
      const order = ['Maker Vendor', 'Maker PLN', 'Checker Vendor', 'Checker PLN', 'Approver Vendor', 'Approver PLN'];
      return order.indexOf(a.role_type) - order.indexOf(b.role_type);
    });
  }

  async getPemeriksaanDetails(baId: number): Promise<BAPemeriksaanDetail[]> {
    await this.simulateDelay(100);
    const details = this.getFromStorage<BAPemeriksaanDetail>(STORAGE_KEYS.PEMERIKSAAN_DETAILS, mockPemeriksaanDetails);
    return details.filter(d => d.ba_id === baId);
  }

  async getSerahTerimaDetails(baId: number): Promise<BASerahTerimaDetail[]> {
    await this.simulateDelay(100);
    const details = this.getFromStorage<BASerahTerimaDetail>(STORAGE_KEYS.SERAH_TERIMA_DETAILS, mockSerahTerimaDetails);
    return details.filter(d => d.ba_id === baId);
  }

  async getWorkflowSteps(baId: number): Promise<BAWorkflowStep[]> {
    await this.simulateDelay(100);
    const steps = this.getFromStorage<BAWorkflowStep>(STORAGE_KEYS.WORKFLOW_STEPS, mockWorkflowSteps);
    return steps.filter(s => s.ba_id === baId).sort((a, b) => a.step_order - b.step_order);
  }

  async getDocuments(baId: number): Promise<BADocumentAttachment[]> {
    await this.simulateDelay(100);
    const documents = this.getFromStorage<BADocumentAttachment>(STORAGE_KEYS.DOCUMENTS, mockDocuments);
    return documents
      .filter(d => d.ba_id === baId && d.is_active)
      .sort((a, b) => {
        const dateA = new Date(a.uploaded_date || '').getTime();
        const dateB = new Date(b.uploaded_date || '').getTime();
        return dateB - dateA;
      });
  }

  async getProcessHistory(baId: number): Promise<BAProcessHistory[]> {
    await this.simulateDelay(100);
    const history = this.getFromStorage<BAProcessHistory>(STORAGE_KEYS.PROCESS_HISTORY, mockProcessHistory);
    return history
      .filter(h => h.ba_id === baId)
      .sort((a, b) => {
        const dateA = new Date(a.action_timestamp).getTime();
        const dateB = new Date(b.action_timestamp).getTime();
        return dateB - dateA;
      });
  }

  async createBA(
    baData: Partial<BAMaster>,
    parties: BAParty[],
    details?: BAPemeriksaanDetail[] | BASerahTerimaDetail[]
  ): Promise<BAWithDetails | null> {
    await this.simulateDelay();

    const bas = this.getFromStorage<BAMaster>(STORAGE_KEYS.BA_DOCUMENTS, mockBADocuments);
    const maxId = Math.max(...bas.map(ba => ba.ba_id || 0), 0);
    const newId = maxId + 1;

    const newBA: BAMaster = {
      ...baData,
      ba_id: newId,
      ba_status: 'DRAFT',
      ba_version: 1,
      is_overdue: false,
      is_locked: false,
      has_digital_signature: false,
      gr_creation_status: 'NOT_APPLICABLE',
      order_monitoring_sync_status: 'NOT_APPLICABLE',
      created_date: new Date().toISOString(),
      modified_date: new Date().toISOString()
    } as BAMaster;

    bas.push(newBA);
    this.saveToStorage(STORAGE_KEYS.BA_DOCUMENTS, bas);

    await this.addProcessHistory(newId, {
      action_type: 'CREATED',
      action_by_name: baData.created_by || 'System',
      action_comments: 'BA created',
      new_status: 'DRAFT'
    });

    if (parties && parties.length > 0) {
      await this.assignParties(newId, parties);
    }

    if (details && details.length > 0) {
      if (baData.ba_type === 'BA Pemeriksaan') {
        await this.savePemeriksaanDetails(newId, details as BAPemeriksaanDetail[]);
      } else if (baData.ba_type === 'BA Serah Terima Barang') {
        await this.saveSerahTerimaDetails(newId, details as BASerahTerimaDetail[]);
      }
    }

    return this.getBAById(newId);
  }

  async updateBA(baId: number, updates: Partial<BAMaster>): Promise<boolean> {
    await this.simulateDelay();

    const bas = this.getFromStorage<BAMaster>(STORAGE_KEYS.BA_DOCUMENTS, mockBADocuments);
    const index = bas.findIndex(ba => ba.ba_id === baId);

    if (index === -1) return false;

    bas[index] = {
      ...bas[index],
      ...updates,
      modified_date: new Date().toISOString()
    };

    this.saveToStorage(STORAGE_KEYS.BA_DOCUMENTS, bas);

    await this.addProcessHistory(baId, {
      action_type: 'MODIFIED',
      action_by_name: updates.modified_by || 'System',
      action_comments: 'BA updated'
    });

    return true;
  }

  async assignParties(baId: number, parties: BAParty[]): Promise<boolean> {
    await this.simulateDelay();

    const allParties = this.getFromStorage<BAParty>(STORAGE_KEYS.BA_PARTIES, mockBAParties);
    const maxId = Math.max(...allParties.map(p => p.party_id || 0), 0);

    const partiesWithBAId = parties.map((party, index) => ({
      ...party,
      party_id: maxId + index + 1,
      ba_id: baId,
      action_required: ['Checker Vendor', 'Checker PLN', 'Approver Vendor', 'Approver PLN'].includes(
        party.role_type
      ),
      action_status: ['Checker Vendor', 'Checker PLN', 'Approver Vendor', 'Approver PLN'].includes(
        party.role_type
      )
        ? 'PENDING'
        : 'NOT_REQUIRED',
      created_date: new Date().toISOString()
    }));

    allParties.push(...partiesWithBAId);
    this.saveToStorage(STORAGE_KEYS.BA_PARTIES, allParties);

    await this.addProcessHistory(baId, {
      action_type: 'PARTY_ASSIGNED',
      action_by_name: 'System',
      action_comments: `${parties.length} parties assigned`
    });

    return true;
  }

  async savePemeriksaanDetails(
    baId: number,
    details: BAPemeriksaanDetail[]
  ): Promise<boolean> {
    await this.simulateDelay();

    const allDetails = this.getFromStorage<BAPemeriksaanDetail>(STORAGE_KEYS.PEMERIKSAAN_DETAILS, mockPemeriksaanDetails);
    const maxId = Math.max(...allDetails.map(d => d.inspection_id || 0), 0);

    const detailsWithBAId = details.map((detail, index) => ({
      ...detail,
      inspection_id: maxId + index + 1,
      ba_id: baId,
      created_date: new Date().toISOString()
    }));

    allDetails.push(...detailsWithBAId);
    this.saveToStorage(STORAGE_KEYS.PEMERIKSAAN_DETAILS, allDetails);

    return true;
  }

  async saveSerahTerimaDetails(
    baId: number,
    details: BASerahTerimaDetail[]
  ): Promise<boolean> {
    await this.simulateDelay();

    const allDetails = this.getFromStorage<BASerahTerimaDetail>(STORAGE_KEYS.SERAH_TERIMA_DETAILS, mockSerahTerimaDetails);
    const maxId = Math.max(...allDetails.map(d => d.handover_id || 0), 0);

    const detailsWithBAId = details.map((detail, index) => ({
      ...detail,
      handover_id: maxId + index + 1,
      ba_id: baId,
      created_date: new Date().toISOString()
    }));

    allDetails.push(...detailsWithBAId);
    this.saveToStorage(STORAGE_KEYS.SERAH_TERIMA_DETAILS, allDetails);

    return true;
  }

  async addProcessHistory(
    baId: number,
    history: Partial<BAProcessHistory>
  ): Promise<boolean> {
    await this.simulateDelay(50);

    const allHistory = this.getFromStorage<BAProcessHistory>(STORAGE_KEYS.PROCESS_HISTORY, mockProcessHistory);
    const maxId = Math.max(...allHistory.map(h => h.history_id || 0), 0);

    const newHistory: BAProcessHistory = {
      ...history,
      history_id: maxId + 1,
      ba_id: baId,
      action_timestamp: new Date().toISOString(),
      created_date: new Date().toISOString()
    } as BAProcessHistory;

    allHistory.push(newHistory);
    this.saveToStorage(STORAGE_KEYS.PROCESS_HISTORY, allHistory);

    return true;
  }

  async updateBAStatus(
    baId: number,
    newStatus: BAStatus,
    actionBy: string,
    comments?: string
  ): Promise<boolean> {
    await this.simulateDelay();

    const bas = this.getFromStorage<BAMaster>(STORAGE_KEYS.BA_DOCUMENTS, mockBADocuments);
    const ba = bas.find(b => b.ba_id === baId);

    if (!ba) return false;

    const previousStatus = ba.ba_status;

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

    await this.updateBA(baId, updates);

    await this.addProcessHistory(baId, {
      action_type: this.mapStatusToActionType(newStatus),
      action_by_name: actionBy,
      previous_status: previousStatus,
      new_status: newStatus,
      action_comments: comments
    });

    return true;
  }

  private mapStatusToActionType(status: BAStatus): ActionType {
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

  async getKPIStats(userId?: string): Promise<BAKPIStats> {
    await this.simulateDelay();

    let bas = this.getFromStorage<BAMaster>(STORAGE_KEYS.BA_DOCUMENTS, mockBADocuments);

    if (userId) {
      const parties = this.getFromStorage<BAParty>(STORAGE_KEYS.BA_PARTIES, mockBAParties);
      const userBAIds = parties
        .filter(p => p.party_user_id === userId)
        .map(p => p.ba_id);

      bas = bas.filter(ba => ba.created_by === userId || (ba.ba_id && userBAIds.includes(ba.ba_id)));
    }

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
  }

  async getMyActionItems(userId: string): Promise<BAMaster[]> {
    await this.simulateDelay();

    const parties = this.getFromStorage<BAParty>(STORAGE_KEYS.BA_PARTIES, mockBAParties);
    const bas = this.getFromStorage<BAMaster>(STORAGE_KEYS.BA_DOCUMENTS, mockBADocuments);

    const myParties = parties.filter(
      p => p.party_user_id === userId && p.action_required && p.action_status === 'PENDING'
    );

    const baIds = myParties.map(p => p.ba_id);

    return bas
      .filter(ba => ba.ba_id && baIds.includes(ba.ba_id))
      .sort((a, b) => {
        const dateA = new Date(a.created_date).getTime();
        const dateB = new Date(b.created_date).getTime();
        return dateB - dateA;
      });
  }

  generateBANumber(baType: BAType): string {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    const prefix = baType === 'BA Pemeriksaan' ? 'BAP' : 'BAST';

    return `${prefix}/${year}/${month}/${random}`;
  }

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }

  resetToDefaults(): void {
    this.clearAllData();
    this.initializeStorage(STORAGE_KEYS.BA_DOCUMENTS, mockBADocuments);
    this.initializeStorage(STORAGE_KEYS.BA_PARTIES, mockBAParties);
    this.initializeStorage(STORAGE_KEYS.PEMERIKSAAN_DETAILS, mockPemeriksaanDetails);
    this.initializeStorage(STORAGE_KEYS.SERAH_TERIMA_DETAILS, mockSerahTerimaDetails);
    this.initializeStorage(STORAGE_KEYS.WORKFLOW_STEPS, mockWorkflowSteps);
    this.initializeStorage(STORAGE_KEYS.DOCUMENTS, mockDocuments);
    this.initializeStorage(STORAGE_KEYS.PROCESS_HISTORY, mockProcessHistory);
  }
}

export const BAMasterServiceMock = new BAMasterServiceMockClass();
