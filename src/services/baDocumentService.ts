import { supabase } from './supabaseClient';
import { InspectionResult, BADocumentReference } from '../types/marketplace';

export interface BeritaAcara {
  ba_id?: number;
  ba_number: string;
  ba_type: 'BA Pemeriksaan' | 'BA Serah Terima Barang' | 'BA Pembayaran' | 'Progressive' | 'Lumpsum' | 'Bertahap' | 'Final Acceptance' | 'Partial Delivery';
  ba_status: 'Draft' | 'Pending Review' | 'Approved' | 'Rejected' | 'Finalized';
  contract_id: string;
  template_id: string;
  project_name?: string;
  responsible_officer?: string;
  ba_content: string;
  ba_version?: number;
  supporting_documents?: any[];
  digital_signature?: any;
  po_number?: string;
  inspection_data?: any;
  payment_reference?: string;
  vendor_id?: string;
  source_module?: string;
  created_by?: string;
  created_date?: string;
  modified_date?: string;
  finalized_date?: string;
}

export interface BAGenerationTrigger {
  trigger_type: 'Order Status Change' | 'Inspection Complete' | 'Payment Confirmed' | 'Manual' | 'Approval Complete';
  source_module: string;
  source_reference: string;
  ba_type: string;
  trigger_data: any;
  triggered_by?: string;
}

export class BADocumentService {

  private static async generateBANumber(baType: string): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

    const typePrefix = baType === 'BA Pemeriksaan' ? 'PERIKSA' :
                       baType === 'BA Serah Terima Barang' ? 'SERAH' :
                       baType === 'BA Pembayaran' ? 'BAYAR' : 'BA';

    const { data, error } = await supabase
      .from('dim_berita_acara')
      .select('ba_number')
      .like('ba_number', `BA/${typePrefix}/${year}/${month}/%`)
      .order('ba_number', { ascending: false })
      .limit(1);

    let sequence = 1;
    if (data && data.length > 0) {
      const lastNumber = data[0].ba_number;
      const lastSequence = parseInt(lastNumber.split('/').pop() || '0');
      sequence = lastSequence + 1;
    }

    return `BA/${typePrefix}/${year}/${month}/${String(sequence).padStart(4, '0')}`;
  }

  static async generateBAPemeriksaan(
    poNumber: string,
    inspectionResult: InspectionResult,
    contractId: string,
    vendorId: string,
    materialDescription: string,
    qtyOrdered: number,
    unitOfMeasure: string,
    triggeredBy: string = 'system'
  ): Promise<BADocumentReference | null> {
    try {
      const baNumber = await this.generateBANumber('BA Pemeriksaan');

      const acceptanceDecision = inspectionResult.inspection_status === 'Passed'
        ? 'diterima dengan baik'
        : inspectionResult.inspection_status === 'Conditional Pass'
        ? 'diterima dengan catatan'
        : 'ditolak';

      const inspectionResultsText = inspectionResult.quality_checks
        .map((check, idx) => `${idx + 1}. ${check.check_name}: ${check.check_result}${check.check_notes ? ` (${check.check_notes})` : ''}`)
        .join('\n');

      const baContent = `BERITA ACARA PEMERIKSAAN BARANG

Nomor: ${baNumber}
Tanggal: ${new Date(inspectionResult.inspection_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}

Yang bertanda tangan di bawah ini:

Nama: ${inspectionResult.inspector_name}
Jabatan: Pemeriksa Barang
Unit: Procurement & Inspection Team

Telah melakukan pemeriksaan terhadap barang yang diterima sebagai berikut:

PO Number: ${poNumber}
Vendor: [Vendor Name - ${vendorId}]
Material: ${materialDescription}
Quantity Dipesan: ${qtyOrdered} ${unitOfMeasure}
Quantity Diterima: ${inspectionResult.quantity_received} ${unitOfMeasure}
Quantity Diterima: ${inspectionResult.quantity_accepted} ${unitOfMeasure}
Quantity Ditolak: ${inspectionResult.quantity_rejected} ${unitOfMeasure}

Hasil Pemeriksaan:
${inspectionResultsText}

Status Pemeriksaan: ${inspectionResult.inspection_status}
Catatan: ${inspectionResult.inspection_notes || 'Tidak ada catatan tambahan'}

Barang telah diperiksa dan ${acceptanceDecision}.

Demikian berita acara ini dibuat untuk dipergunakan sebagaimana mestinya.

Pemeriksa,


${inspectionResult.inspector_name}`;

      const { data: baData, error: baError } = await supabase
        .from('dim_berita_acara')
        .insert({
          ba_number: baNumber,
          ba_type: 'BA Pemeriksaan',
          ba_status: 'Draft',
          contract_id: contractId,
          template_id: 'TPL-PERIKSA-001',
          project_name: `Procurement Order ${poNumber}`,
          responsible_officer: inspectionResult.inspector_name,
          ba_content: baContent,
          po_number: poNumber,
          inspection_data: inspectionResult,
          vendor_id: vendorId,
          source_module: 'Marketplace',
          created_by: triggeredBy
        })
        .select()
        .single();

      if (baError) {
        console.error('Error creating BA Pemeriksaan:', baError);
        return null;
      }

      await supabase.from('inspection_results').insert({
        po_number: poNumber,
        inspector_name: inspectionResult.inspector_name,
        inspector_id: inspectionResult.inspector_id,
        inspection_date: inspectionResult.inspection_date,
        inspection_status: inspectionResult.inspection_status,
        quality_checks: inspectionResult.quality_checks,
        quantity_received: inspectionResult.quantity_received,
        quantity_accepted: inspectionResult.quantity_accepted,
        quantity_rejected: inspectionResult.quantity_rejected,
        rejection_reasons: inspectionResult.rejection_reasons,
        acceptance_criteria_met: inspectionResult.acceptance_criteria_met,
        inspection_notes: inspectionResult.inspection_notes,
        photo_evidence: inspectionResult.photo_evidence,
        ba_pemeriksaan_id: baData.ba_id,
        created_by: triggeredBy
      });

      await this.logBAGenerationTrigger({
        trigger_type: 'Inspection Complete',
        source_module: 'Marketplace',
        source_reference: poNumber,
        ba_type: 'BA Pemeriksaan',
        trigger_data: { inspection_result: inspectionResult },
        triggered_by: triggeredBy
      }, baData.ba_id);

      return {
        ba_id: baData.ba_id,
        ba_number: baNumber,
        ba_type: 'BA Pemeriksaan',
        ba_status: 'Draft',
        generated_date: new Date().toISOString(),
        generated_by: triggeredBy
      };
    } catch (error) {
      console.error('Error generating BA Pemeriksaan:', error);
      return null;
    }
  }

  static async generateBASerahTerimaBarang(
    poNumber: string,
    baPemeriksaanNumber: string,
    contractId: string,
    vendorId: string,
    vendorRepresentative: string,
    receiverName: string,
    receiverUnit: string,
    materialDescription: string,
    quantityDelivered: number,
    unitOfMeasure: string,
    goodsCondition: string,
    acceptanceStatus: string,
    triggeredBy: string = 'system'
  ): Promise<BADocumentReference | null> {
    try {
      const baNumber = await this.generateBANumber('BA Serah Terima Barang');

      const baContent = `BERITA ACARA SERAH TERIMA BARANG

Nomor: ${baNumber}
Tanggal: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}

Yang bertanda tangan di bawah ini:

PIHAK PERTAMA (Vendor):
Nama: ${vendorRepresentative}
Jabatan: Representative
Perusahaan: [Vendor Name - ${vendorId}]

PIHAK KEDUA (Penerima):
Nama: ${receiverName}
Jabatan: Receiver
Unit: ${receiverUnit}

Dengan ini menyatakan bahwa PIHAK PERTAMA telah menyerahkan dan PIHAK KEDUA telah menerima barang sebagai berikut:

PO Number: ${poNumber}
Material: ${materialDescription}
Quantity: ${quantityDelivered} ${unitOfMeasure}
Kondisi Barang: ${goodsCondition}

Barang telah diperiksa dan dinyatakan ${acceptanceStatus} sesuai BA Pemeriksaan No. ${baPemeriksaanNumber}.

Demikian berita acara ini dibuat dalam rangkap 2 (dua) untuk dipergunakan sebagaimana mestinya.

PIHAK PERTAMA,                    PIHAK KEDUA,


${vendorRepresentative}           ${receiverName}`;

      const { data: baData, error: baError } = await supabase
        .from('dim_berita_acara')
        .insert({
          ba_number: baNumber,
          ba_type: 'BA Serah Terima Barang',
          ba_status: 'Draft',
          contract_id: contractId,
          template_id: 'TPL-SERAH-001',
          project_name: `Procurement Order ${poNumber}`,
          responsible_officer: receiverName,
          ba_content: baContent,
          po_number: poNumber,
          vendor_id: vendorId,
          source_module: 'Marketplace',
          created_by: triggeredBy
        })
        .select()
        .single();

      if (baError) {
        console.error('Error creating BA Serah Terima:', baError);
        return null;
      }

      await this.logBAGenerationTrigger({
        trigger_type: 'Order Status Change',
        source_module: 'Marketplace',
        source_reference: poNumber,
        ba_type: 'BA Serah Terima Barang',
        trigger_data: {
          ba_pemeriksaan: baPemeriksaanNumber,
          vendor_representative: vendorRepresentative,
          receiver: receiverName
        },
        triggered_by: triggeredBy
      }, baData.ba_id);

      return {
        ba_id: baData.ba_id,
        ba_number: baNumber,
        ba_type: 'BA Serah Terima Barang',
        ba_status: 'Draft',
        generated_date: new Date().toISOString(),
        generated_by: triggeredBy
      };
    } catch (error) {
      console.error('Error generating BA Serah Terima:', error);
      return null;
    }
  }

  static async generateBAPembayaran(
    invoiceNumber: string,
    poNumber: string,
    baSerahTerimaNumber: string,
    contractNumber: string,
    vendorId: string,
    invoiceAmount: number,
    paymentAmount: number,
    paymentMethod: string,
    paymentReference: string,
    paymentTerms: string,
    financeOfficer: string,
    triggeredBy: string = 'system',
    triggerType: 'Payment Confirmed' | 'Approval Complete' = 'Payment Confirmed'
  ): Promise<BADocumentReference | null> {
    try {
      const baNumber = await this.generateBANumber('BA Pembayaran');
      const paymentDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      const currency = 'IDR';

      const baContent = `BERITA ACARA PEMBAYARAN

Nomor: ${baNumber}
Tanggal: ${paymentDate}

Yang bertanda tangan di bawah ini:

Nama: ${financeOfficer}
Jabatan: Finance Officer
Unit: Finance Department

Dengan ini menyatakan bahwa pembayaran telah dilakukan sebagai berikut:

Invoice Number: ${invoiceNumber}
PO Number: ${poNumber}
Vendor: [Vendor Name - ${vendorId}]
Nilai Invoice: ${currency} ${invoiceAmount.toLocaleString('id-ID')}
Nilai Dibayar: ${currency} ${paymentAmount.toLocaleString('id-ID')}
Tanggal Pembayaran: ${paymentDate}
Metode Pembayaran: ${paymentMethod}
Referensi Pembayaran: ${paymentReference}

Pembayaran dilakukan sesuai dengan:
- BA Serah Terima No: ${baSerahTerimaNumber}
- Kontrak No: ${contractNumber}
- Terms of Payment: ${paymentTerms}

Status: Pembayaran telah diproses dan diselesaikan.

Demikian berita acara ini dibuat untuk dipergunakan sebagaimana mestinya.

Petugas Keuangan,


${financeOfficer}`;

      const { data: baData, error: baError } = await supabase
        .from('dim_berita_acara')
        .insert({
          ba_number: baNumber,
          ba_type: 'BA Pembayaran',
          ba_status: 'Draft',
          contract_id: contractNumber,
          template_id: 'TPL-BAYAR-001',
          project_name: `Invoice ${invoiceNumber}`,
          responsible_officer: financeOfficer,
          ba_content: baContent,
          po_number: poNumber,
          payment_reference: paymentReference,
          vendor_id: vendorId,
          source_module: 'Receipt to Pay',
          created_by: triggeredBy
        })
        .select()
        .single();

      if (baError) {
        console.error('Error creating BA Pembayaran:', baError);
        return null;
      }

      await this.logBAGenerationTrigger({
        trigger_type: triggerType,
        source_module: 'Receipt to Pay',
        source_reference: invoiceNumber,
        ba_type: 'BA Pembayaran',
        trigger_data: {
          payment_amount: paymentAmount,
          payment_method: paymentMethod,
          payment_reference: paymentReference
        },
        triggered_by: triggeredBy
      }, baData.ba_id);

      return {
        ba_id: baData.ba_id,
        ba_number: baNumber,
        ba_type: 'BA Pembayaran',
        ba_status: 'Draft',
        generated_date: new Date().toISOString(),
        generated_by: triggeredBy
      };
    } catch (error) {
      console.error('Error generating BA Pembayaran:', error);
      return null;
    }
  }

  private static async logBAGenerationTrigger(
    trigger: BAGenerationTrigger,
    baId: number
  ): Promise<void> {
    try {
      await supabase.from('ba_generation_triggers').insert({
        trigger_type: trigger.trigger_type,
        source_module: trigger.source_module,
        source_reference: trigger.source_reference,
        ba_type: trigger.ba_type,
        ba_id: baId,
        trigger_data: trigger.trigger_data,
        triggered_by: trigger.triggered_by,
        generation_status: 'Completed',
        completed_date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging BA generation trigger:', error);
    }
  }

  static async getBADocumentsByPO(poNumber: string): Promise<BeritaAcara[]> {
    try {
      const { data, error } = await supabase
        .from('dim_berita_acara')
        .select('*')
        .eq('po_number', poNumber)
        .order('created_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching BA documents:', error);
      return [];
    }
  }

  static async getBADocumentById(baId: number): Promise<BeritaAcara | null> {
    try {
      const { data, error } = await supabase
        .from('dim_berita_acara')
        .select('*')
        .eq('ba_id', baId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching BA document:', error);
      return null;
    }
  }

  static async updateBAStatus(
    baId: number,
    newStatus: 'Draft' | 'Pending Review' | 'Approved' | 'Rejected' | 'Finalized',
    updatedBy: string
  ): Promise<boolean> {
    try {
      const updateData: any = {
        ba_status: newStatus,
        modified_date: new Date().toISOString()
      };

      if (newStatus === 'Finalized') {
        updateData.finalized_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('dim_berita_acara')
        .update(updateData)
        .eq('ba_id', baId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating BA status:', error);
      return false;
    }
  }

  static async getInspectionResultByPO(poNumber: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('inspection_results')
        .select('*')
        .eq('po_number', poNumber)
        .order('inspection_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching inspection result:', error);
      return null;
    }
  }
}
