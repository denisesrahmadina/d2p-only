import { supabase } from './supabaseClient';

export interface BAParty {
  party_id?: number;
  ba_id?: number;
  role_type: 'Maker Vendor' | 'Maker PLN' | 'Checker Vendor' | 'Checker PLN' | 'Approver Vendor' | 'Approver PLN';
  party_name: string;
  party_position?: string;
  party_unit?: string;
  party_email?: string;
  party_phone?: string;
  is_primary?: boolean;
}

export interface BAInspectionDetail {
  inspection_id?: number;
  ba_id?: number;
  scenario_type: 'Stock' | 'Non-Stock';
  material_document_number?: string;
  po_number?: string;
  material_id?: string;
  material_description?: string;
  unit_of_measure?: string;
  qty_ordered: number;
  qty_previously_received?: number;
  qty_inspected: number;
  qty_approved: number;
  qty_rejected?: number;
  inspection_date?: string;
  inspection_by_both_parties?: boolean;
  inspection_remarks?: string;
}

export interface BAHandoverDetail {
  handover_id?: number;
  ba_id?: number;
  material_id?: string;
  material_description?: string;
  unit_of_measure?: string;
  qty_ordered: number;
  qty_already_handed_over?: number;
  qty_this_handover: number;
  qty_remaining?: number;
  handover_date: string;
  delivery_location?: string;
  transporter_do_number?: string;
  handover_by_both_parties?: boolean;
  direksi_inspection?: boolean;
  handover_remarks?: string;
}

export interface BADocumentPrerequisite {
  prerequisite_id?: number;
  ba_id?: number;
  document_type: string;
  document_name: string;
  file_url?: string;
  file_size?: number;
  file_type?: string;
  is_mandatory?: boolean;
  uploaded_by?: string;
  document_metadata?: any;
}

export interface BAProcessHistory {
  history_id?: number;
  ba_id?: number;
  action_type: 'Created' | 'Submitted' | 'Reviewed' | 'Approved' | 'Rejected' | 'Returned' | 'Cancelled' | 'Finalized' | 'Modified' | 'Document Uploaded' | 'Comment Added';
  action_by: string;
  action_by_role?: string;
  previous_status?: string;
  new_status?: string;
  comments?: string;
  rejection_reason_category?: string;
  rejection_reason_detail?: string;
  action_metadata?: any;
}

export interface BAPemeriksaanCreate {
  ba_type: 'BA Pemeriksaan';
  contract_id: string;
  po_number: string;
  vendor_id: string;
  work_location?: string;
  background_notes?: string;
  inspection_notes?: string;
  parties: BAParty[];
  inspection_details: BAInspectionDetail[];
  prerequisite_documents?: BADocumentPrerequisite[];
  created_by: string;
}

export interface BASerahTerimaCreate {
  ba_type: 'BA Serah Terima Barang';
  contract_id: string;
  po_number: string;
  vendor_id: string;
  linked_ba_pemeriksaan_id?: number;
  delivery_location: string;
  transporter_do_number?: string;
  parties: BAParty[];
  handover_details: BAHandoverDetail[];
  prerequisite_documents?: BADocumentPrerequisite[];
  created_by: string;
}

export class BAPemeriksaanSerahTerimaService {

  // Generate BA Number
  private static async generateBANumber(baType: string): Promise<string> {
    const year = new Date().getFullYear();
    const typePrefix = baType === 'BA Pemeriksaan' ? 'PERIKSA' :
                       baType === 'BA Serah Terima Barang' ? 'SERAH' : 'BA';

    const { data, error } = await supabase
      .from('dim_berita_acara')
      .select('ba_number')
      .like('ba_number', `BA/${typePrefix}/${year}/%`)
      .order('ba_number', { ascending: false })
      .limit(1);

    let sequence = 1;
    if (data && data.length > 0) {
      const lastNumber = data[0].ba_number;
      const parts = lastNumber.split('/');
      const lastSequence = parseInt(parts[parts.length - 1] || '0');
      sequence = lastSequence + 1;
    }

    return `BA/${typePrefix}/${year}/${String(sequence).padStart(4, '0')}`;
  }

  // Validate parties - ensure rules are followed
  static validateParties(parties: BAParty[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    const makerVendor = parties.filter(p => p.role_type === 'Maker Vendor');
    const makerPLN = parties.filter(p => p.role_type === 'Maker PLN');
    const checkerPLN = parties.filter(p => p.role_type === 'Checker PLN');
    const approverPLN = parties.filter(p => p.role_type === 'Approver PLN');
    const checkerVendor = parties.filter(p => p.role_type === 'Checker Vendor');
    const approverVendor = parties.filter(p => p.role_type === 'Approver Vendor');

    // Rule: Must have exactly 1 Maker Vendor
    if (makerVendor.length !== 1) {
      errors.push('Must have exactly 1 Maker Vendor');
    }

    // Rule: Must have exactly 1 Maker PLN
    if (makerPLN.length !== 1) {
      errors.push('Must have exactly 1 Maker PLN');
    }

    // Rule: Can have up to 3 Checker PLN
    if (checkerPLN.length > 3) {
      errors.push('Cannot have more than 3 Checker PLN');
    }

    // Rule: Can have up to 3 Approver PLN
    if (approverPLN.length > 3) {
      errors.push('Cannot have more than 3 Approver PLN');
    }

    // Rule: Can have up to 3 Checker Vendor
    if (checkerVendor.length > 3) {
      errors.push('Cannot have more than 3 Checker Vendor');
    }

    // Rule: Can have up to 3 Approver Vendor
    if (approverVendor.length > 3) {
      errors.push('Cannot have more than 3 Approver Vendor');
    }

    // Rule: Maker PLN cannot be in Checker PLN or Approver PLN
    if (makerPLN.length > 0) {
      const makerPLNName = makerPLN[0].party_name;
      const inChecker = checkerPLN.some(p => p.party_name === makerPLNName);
      const inApprover = approverPLN.some(p => p.party_name === makerPLNName);

      if (inChecker) {
        errors.push('Maker PLN cannot also be Checker PLN');
      }
      if (inApprover) {
        errors.push('Maker PLN cannot also be Approver PLN');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Create BA Pemeriksaan
  static async createBAPemeriksaan(data: BAPemeriksaanCreate): Promise<{
    success: boolean;
    ba_id?: number;
    ba_number?: string;
    message: string;
  }> {
    try {
      // Validate parties
      const validation = this.validateParties(data.parties);
      if (!validation.valid) {
        return {
          success: false,
          message: `Validation errors: ${validation.errors.join(', ')}`
        };
      }

      // Generate BA Number
      const baNumber = await this.generateBANumber('BA Pemeriksaan');

      // Generate BA Content
      const baContent = this.generateBAPemeriksaanContent(baNumber, data);

      // Create BA document
      const { data: baData, error: baError } = await supabase
        .from('dim_berita_acara')
        .insert({
          ba_number: baNumber,
          ba_type: 'BA Pemeriksaan',
          ba_status: 'Draft',
          contract_id: data.contract_id,
          po_number: data.po_number,
          vendor_id: data.vendor_id,
          template_id: 'TPL-PERIKSA-001',
          work_location: data.work_location,
          background_notes: data.background_notes,
          inspection_notes: data.inspection_notes,
          ba_content: baContent,
          source_module: 'APBA',
          created_by: data.created_by
        })
        .select()
        .single();

      if (baError) {
        console.error('Error creating BA:', baError);
        return { success: false, message: 'Failed to create BA document' };
      }

      const baId = baData.ba_id;

      // Insert parties
      for (const party of data.parties) {
        await supabase.from('ba_parties').insert({
          ba_id: baId,
          ...party
        });
      }

      // Insert inspection details
      for (const detail of data.inspection_details) {
        await supabase.from('ba_inspection_details').insert({
          ba_id: baId,
          ...detail
        });
      }

      // Insert prerequisite documents if any
      if (data.prerequisite_documents && data.prerequisite_documents.length > 0) {
        for (const doc of data.prerequisite_documents) {
          await supabase.from('ba_documents_prerequisite').insert({
            ba_id: baId,
            ...doc
          });
        }
      }

      // Create process history
      await this.addProcessHistory({
        ba_id: baId,
        action_type: 'Created',
        action_by: data.created_by,
        new_status: 'Draft',
        comments: 'BA Pemeriksaan created'
      });

      return {
        success: true,
        ba_id: baId,
        ba_number: baNumber,
        message: 'BA Pemeriksaan created successfully'
      };
    } catch (error) {
      console.error('Error creating BA Pemeriksaan:', error);
      return { success: false, message: 'Failed to create BA Pemeriksaan' };
    }
  }

  // Create BA Serah Terima Barang
  static async createBASerahTerima(data: BASerahTerimaCreate): Promise<{
    success: boolean;
    ba_id?: number;
    ba_number?: string;
    message: string;
  }> {
    try {
      // Validate parties
      const validation = this.validateParties(data.parties);
      if (!validation.valid) {
        return {
          success: false,
          message: `Validation errors: ${validation.errors.join(', ')}`
        };
      }

      // Generate BA Number
      const baNumber = await this.generateBANumber('BA Serah Terima Barang');

      // Generate BA Content
      const baContent = this.generateBASerahTerimaContent(baNumber, data);

      // Create BA document
      const { data: baData, error: baError } = await supabase
        .from('dim_berita_acara')
        .insert({
          ba_number: baNumber,
          ba_type: 'BA Serah Terima Barang',
          ba_status: 'Draft',
          contract_id: data.contract_id,
          po_number: data.po_number,
          vendor_id: data.vendor_id,
          linked_ba_pemeriksaan_id: data.linked_ba_pemeriksaan_id,
          template_id: 'TPL-SERAH-001',
          ba_content: baContent,
          source_module: 'APBA',
          created_by: data.created_by
        })
        .select()
        .single();

      if (baError) {
        console.error('Error creating BA:', baError);
        return { success: false, message: 'Failed to create BA document' };
      }

      const baId = baData.ba_id;

      // Insert parties
      for (const party of data.parties) {
        await supabase.from('ba_parties').insert({
          ba_id: baId,
          ...party
        });
      }

      // Insert handover details
      for (const detail of data.handover_details) {
        // Calculate remaining quantity
        const qtyRemaining = detail.qty_ordered - (detail.qty_already_handed_over || 0) - detail.qty_this_handover;

        await supabase.from('ba_handover_details').insert({
          ba_id: baId,
          ...detail,
          qty_remaining: qtyRemaining
        });
      }

      // Insert prerequisite documents if any
      if (data.prerequisite_documents && data.prerequisite_documents.length > 0) {
        for (const doc of data.prerequisite_documents) {
          await supabase.from('ba_documents_prerequisite').insert({
            ba_id: baId,
            ...doc
          });
        }
      }

      // Create process history
      await this.addProcessHistory({
        ba_id: baId,
        action_type: 'Created',
        action_by: data.created_by,
        new_status: 'Draft',
        comments: 'BA Serah Terima Barang created'
      });

      return {
        success: true,
        ba_id: baId,
        ba_number: baNumber,
        message: 'BA Serah Terima Barang created successfully'
      };
    } catch (error) {
      console.error('Error creating BA Serah Terima:', error);
      return { success: false, message: 'Failed to create BA Serah Terima Barang' };
    }
  }

  // Submit BA for review
  static async submitBA(baId: number, submittedBy: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const { error } = await supabase
        .from('dim_berita_acara')
        .update({ ba_status: 'Submitted', modified_date: new Date().toISOString() })
        .eq('ba_id', baId);

      if (error) {
        return { success: false, message: 'Failed to submit BA' };
      }

      await this.addProcessHistory({
        ba_id: baId,
        action_type: 'Submitted',
        action_by: submittedBy,
        previous_status: 'Draft',
        new_status: 'Submitted',
        comments: 'BA submitted for review'
      });

      return { success: true, message: 'BA submitted successfully' };
    } catch (error) {
      console.error('Error submitting BA:', error);
      return { success: false, message: 'Failed to submit BA' };
    }
  }

  // Approve BA
  static async approveBA(baId: number, approvedBy: string, approverRole: string, comments?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const { error } = await supabase
        .from('dim_berita_acara')
        .update({ ba_status: 'Approved', modified_date: new Date().toISOString() })
        .eq('ba_id', baId);

      if (error) {
        return { success: false, message: 'Failed to approve BA' };
      }

      await this.addProcessHistory({
        ba_id: baId,
        action_type: 'Approved',
        action_by: approvedBy,
        action_by_role: approverRole,
        previous_status: 'Under Review',
        new_status: 'Approved',
        comments: comments || 'BA approved'
      });

      return { success: true, message: 'BA approved successfully' };
    } catch (error) {
      console.error('Error approving BA:', error);
      return { success: false, message: 'Failed to approve BA' };
    }
  }

  // Reject BA
  static async rejectBA(
    baId: number,
    rejectedBy: string,
    rejectorRole: string,
    reasonCategory: string,
    reasonDetail: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const { error } = await supabase
        .from('dim_berita_acara')
        .update({ ba_status: 'Rejected', modified_date: new Date().toISOString() })
        .eq('ba_id', baId);

      if (error) {
        return { success: false, message: 'Failed to reject BA' };
      }

      await this.addProcessHistory({
        ba_id: baId,
        action_type: 'Rejected',
        action_by: rejectedBy,
        action_by_role: rejectorRole,
        previous_status: 'Under Review',
        new_status: 'Rejected',
        rejection_reason_category: reasonCategory,
        rejection_reason_detail: reasonDetail
      });

      return { success: true, message: 'BA rejected' };
    } catch (error) {
      console.error('Error rejecting BA:', error);
      return { success: false, message: 'Failed to reject BA' };
    }
  }

  // Get BA with all details
  static async getBAWithDetails(baId: number): Promise<any> {
    try {
      const { data: baData, error: baError } = await supabase
        .from('dim_berita_acara')
        .select('*')
        .eq('ba_id', baId)
        .single();

      if (baError || !baData) {
        return null;
      }

      // Get parties
      const { data: parties } = await supabase
        .from('ba_parties')
        .select('*')
        .eq('ba_id', baId);

      // Get inspection details if BA Pemeriksaan
      let inspectionDetails = [];
      if (baData.ba_type === 'BA Pemeriksaan') {
        const { data } = await supabase
          .from('ba_inspection_details')
          .select('*')
          .eq('ba_id', baId);
        inspectionDetails = data || [];
      }

      // Get handover details if BA Serah Terima
      let handoverDetails = [];
      if (baData.ba_type === 'BA Serah Terima Barang') {
        const { data } = await supabase
          .from('ba_handover_details')
          .select('*')
          .eq('ba_id', baId);
        handoverDetails = data || [];
      }

      // Get documents
      const { data: prerequisites } = await supabase
        .from('ba_documents_prerequisite')
        .select('*')
        .eq('ba_id', baId);

      const { data: attachments } = await supabase
        .from('ba_documents_attachment')
        .select('*')
        .eq('ba_id', baId);

      // Get process history
      const { data: history } = await supabase
        .from('ba_process_history')
        .select('*')
        .eq('ba_id', baId)
        .order('action_date', { ascending: false });

      return {
        ...baData,
        parties: parties || [],
        inspection_details: inspectionDetails,
        handover_details: handoverDetails,
        prerequisite_documents: prerequisites || [],
        attachments: attachments || [],
        process_history: history || []
      };
    } catch (error) {
      console.error('Error getting BA details:', error);
      return null;
    }
  }

  // Get all BAs with filters
  static async getAllBAs(filters?: {
    ba_type?: string;
    ba_status?: string;
    contract_id?: string;
    po_number?: string;
    vendor_id?: string;
  }): Promise<any[]> {
    try {
      let query = supabase.from('dim_berita_acara').select('*');

      if (filters) {
        if (filters.ba_type) query = query.eq('ba_type', filters.ba_type);
        if (filters.ba_status) query = query.eq('ba_status', filters.ba_status);
        if (filters.contract_id) query = query.eq('contract_id', filters.contract_id);
        if (filters.po_number) query = query.eq('po_number', filters.po_number);
        if (filters.vendor_id) query = query.eq('vendor_id', filters.vendor_id);
      }

      const { data, error } = await query.order('created_date', { ascending: false });

      if (error) {
        console.error('Error fetching BAs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting BAs:', error);
      return [];
    }
  }

  // Add process history
  static async addProcessHistory(history: BAProcessHistory): Promise<void> {
    try {
      await supabase.from('ba_process_history').insert({
        ...history,
        action_date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding process history:', error);
    }
  }

  // Get rejection reasons
  static async getRejectionReasons(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ba_rejection_reasons')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching rejection reasons:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting rejection reasons:', error);
      return [];
    }
  }

  // Generate BA Pemeriksaan content
  private static generateBAPemeriksaanContent(baNumber: string, data: BAPemeriksaanCreate): string {
    const makerVendor = data.parties.find(p => p.role_type === 'Maker Vendor');
    const makerPLN = data.parties.find(p => p.role_type === 'Maker PLN');

    let inspectionTable = '';
    data.inspection_details.forEach((detail, idx) => {
      inspectionTable += `${idx + 1}. ${detail.material_description || detail.material_id}
   Jumlah Dipesan: ${detail.qty_ordered} ${detail.unit_of_measure}
   Jumlah Diperiksa: ${detail.qty_inspected} ${detail.unit_of_measure}
   Jumlah Diterima: ${detail.qty_approved} ${detail.unit_of_measure}
   Jumlah Ditolak: ${detail.qty_rejected || 0} ${detail.unit_of_measure}

`;
    });

    return `BERITA ACARA PEMERIKSAAN BARANG

Nomor: ${baNumber}
Tanggal: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}

Yang bertanda tangan di bawah ini:

PIHAK VENDOR:
Nama: ${makerVendor?.party_name || '-'}
Jabatan: ${makerVendor?.party_position || '-'}

PIHAK PLN:
Nama: ${makerPLN?.party_name || '-'}
Jabatan: ${makerPLN?.party_position || '-'}
Unit: ${makerPLN?.party_unit || '-'}

Telah melakukan pemeriksaan terhadap barang yang diterima sebagai berikut:

PO Number: ${data.po_number}
Lokasi Pekerjaan: ${data.work_location || '-'}

Latar Belakang:
${data.background_notes || 'Tidak ada catatan'}

Hasil Pemeriksaan:
${inspectionTable}

Catatan Pemeriksaan:
${data.inspection_notes || 'Tidak ada catatan tambahan'}

Pemeriksaan dilakukan oleh kedua belah pihak.

Demikian berita acara ini dibuat untuk dipergunakan sebagaimana mestinya.

PIHAK VENDOR,                    PIHAK PLN,


${makerVendor?.party_name || '-'}             ${makerPLN?.party_name || '-'}`;
  }

  // Generate BA Serah Terima content
  private static generateBASerahTerimaContent(baNumber: string, data: BASerahTerimaCreate): string {
    const makerVendor = data.parties.find(p => p.role_type === 'Maker Vendor');
    const makerPLN = data.parties.find(p => p.role_type === 'Maker PLN');

    let handoverTable = '';
    data.handover_details.forEach((detail, idx) => {
      const qtyRemaining = detail.qty_ordered - (detail.qty_already_handed_over || 0) - detail.qty_this_handover;
      handoverTable += `${idx + 1}. ${detail.material_description || detail.material_id}
   Jumlah Dipesan: ${detail.qty_ordered} ${detail.unit_of_measure}
   Jumlah Sudah Diserahkan: ${detail.qty_already_handed_over || 0} ${detail.unit_of_measure}
   Jumlah Serah Terima Ini: ${detail.qty_this_handover} ${detail.unit_of_measure}
   Sisa: ${qtyRemaining} ${detail.unit_of_measure}

`;
    });

    return `BERITA ACARA SERAH TERIMA BARANG

Nomor: ${baNumber}
Tanggal: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}

Yang bertanda tangan di bawah ini:

PIHAK PERTAMA (Vendor):
Nama: ${makerVendor?.party_name || '-'}
Jabatan: ${makerVendor?.party_position || '-'}

PIHAK KEDUA (PLN):
Nama: ${makerPLN?.party_name || '-'}
Jabatan: ${makerPLN?.party_position || '-'}
Unit: ${makerPLN?.party_unit || '-'}

Dengan ini menyatakan bahwa PIHAK PERTAMA telah menyerahkan dan PIHAK KEDUA telah menerima barang sebagai berikut:

PO Number: ${data.po_number}
Lokasi Serah Terima: ${data.delivery_location}
Nomor Surat Jalan: ${data.transporter_do_number || '-'}

Detail Serah Terima:
${handoverTable}

Serah terima dilakukan oleh kedua belah pihak.
${data.handover_details[0]?.direksi_inspection ? 'Dilakukan peninjauan oleh Direksi Pekerjaan.' : ''}

${data.linked_ba_pemeriksaan_id ? `Referensi BA Pemeriksaan: BA ID ${data.linked_ba_pemeriksaan_id}` : ''}

Demikian berita acara ini dibuat dalam rangkap 2 (dua) untuk dipergunakan sebagaimana mestinya.

PIHAK PERTAMA,                    PIHAK KEDUA,


${makerVendor?.party_name || '-'}             ${makerPLN?.party_name || '-'}`;
  }
}
