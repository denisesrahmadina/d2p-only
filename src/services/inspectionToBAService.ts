import { supabase } from './supabaseClient';
import { PurchaseOrder } from '../types/marketplace';

export interface BAGenerationResult {
  success: boolean;
  message: string;
  ba_id?: number;
  ba_number?: string;
}

export class InspectionToBAService {
  static async createBAFromInspection(
    po: PurchaseOrder,
    inspectorId: string,
    inspectorName: string
  ): Promise<BAGenerationResult> {
    try {
      const { data: contract, error: contractError } = await supabase
        .from('dim_contract')
        .select('*')
        .eq('contract_id', po.contract_id || '')
        .maybeSingle();

      if (contractError || !contract) {
        return {
          success: false,
          message: 'Contract not found for PO'
        };
      }

      const currentYear = new Date().getFullYear();
      const { count } = await supabase
        .from('dim_berita_acara')
        .select('*', { count: 'exact', head: true })
        .like('ba_number', `BA/${currentYear}/%`);

      const sequential = (count || 0) + 1;
      const baNumber = `BA/${currentYear}/${sequential.toString().padStart(3, '0')}`;

      let baType: string = 'Progressive';
      if (contract.contract_milestone && Array.isArray(contract.contract_milestone)) {
        const milestones = contract.contract_milestone;
        if (milestones.length === 1) {
          baType = 'Lumpsum';
        } else if (milestones.length > 1) {
          baType = 'Bertahap';
        }
      }

      const { data: template } = await supabase
        .from('dim_ba_template')
        .select('*')
        .eq('template_type', baType)
        .eq('is_active', true)
        .maybeSingle();

      let baContent = template?.template_content || '';

      const replacements: Record<string, string> = {
        '{{ba_number}}': baNumber,
        '{{ba_date}}': new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        '{{ba_type}}': baType,
        '{{project_name}}': po.po_description || 'Procurement Project',
        '{{contract_number}}': contract.contract_number,
        '{{vendor_name}}': '',
        '{{responsible_officer}}': inspectorName,
        '{{officer_position}}': 'Inspector',
        '{{payment_value}}': `${po.currency} ${po.total_po_value.toLocaleString()}`
      };

      Object.entries(replacements).forEach(([key, value]) => {
        baContent = baContent.replace(new RegExp(key, 'g'), value);
      });

      const baData = {
        ba_number: baNumber,
        ba_type: baType,
        ba_status: 'Draft',
        contract_id: contract.contract_id,
        template_id: template?.template_id,
        project_name: po.po_description || 'Procurement Project',
        responsible_officer: inspectorName,
        ba_content: baContent,
        ba_version: 1,
        source_po_number: po.po_number,
        created_by: inspectorId,
        created_date: new Date().toISOString()
      };

      const { data: baRecord, error: baError } = await supabase
        .from('dim_berita_acara')
        .insert([baData])
        .select()
        .single();

      if (baError || !baRecord) {
        return {
          success: false,
          message: 'Failed to create BA document'
        };
      }

      await supabase
        .from('fact_purchase_order')
        .update({ linked_ba_id: baRecord.ba_id })
        .eq('po_line_id', po.po_line_id);

      if (contract.contract_milestone && Array.isArray(contract.contract_milestone)) {
        const milestones = contract.contract_milestone.map((milestone: any, index: number) => ({
          ba_id: baRecord.ba_id,
          contract_id: contract.contract_id,
          milestone_number: index + 1,
          milestone_name: milestone.name,
          milestone_type: baType,
          payment_term: milestone.name,
          payment_percentage: milestone.percentage || 0,
          payment_value: (milestone.percentage / 100) * po.total_po_value,
          payment_status: 'Pending',
          due_date: milestone.date,
          payee_info: {},
          created_date: new Date().toISOString()
        }));

        await supabase.from('fact_ba_milestone').insert(milestones);
      }

      return {
        success: true,
        message: 'BA document created successfully',
        ba_id: baRecord.ba_id,
        ba_number: baNumber
      };
    } catch (error) {
      console.error('Error creating BA from inspection:', error);
      return {
        success: false,
        message: 'An error occurred while creating BA document'
      };
    }
  }

  static async getBAByPO(poNumber: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('dim_berita_acara')
        .select('*')
        .eq('source_po_number', poNumber)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching BA by PO:', error);
      return null;
    }
  }

  static async linkBAToOrder(baId: number, poLineId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('fact_purchase_order')
        .update({ linked_ba_id: baId })
        .eq('po_line_id', poLineId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error linking BA to order:', error);
      return false;
    }
  }

  static async getBATemplateForContractType(contractType: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('dim_ba_template')
        .select('*')
        .eq('template_type', contractType)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching BA template:', error);
      return null;
    }
  }
}
