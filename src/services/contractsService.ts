import { supabase } from './supabaseClient';
import { Contract, Material, Vendor } from '../types/marketplace';

export interface ContractWithDetails extends Contract {
  material?: Material;
  vendor?: Vendor;
  available_quantity?: number;
}

export class ContractsService {
  static async getAllContracts(): Promise<ContractWithDetails[]> {
    try {
      const { data: contracts, error } = await supabase
        .from('dim_contract')
        .select(`
          *,
          material:dim_material(*),
          vendor:dim_vendor(*)
        `)
        .eq('contract_status', 'Active')
        .order('created_date', { ascending: false });

      if (error) throw error;

      return (contracts || []).map(contract => {
        const availableQty = contract.contract_boq && contract.contract_boq[0]
          ? contract.contract_boq[0].available_quantity || contract.contract_boq[0].quantity
          : 0;

        return {
          ...contract,
          material: Array.isArray(contract.material) ? contract.material[0] : contract.material,
          vendor: Array.isArray(contract.vendor) ? contract.vendor[0] : contract.vendor,
          available_quantity: availableQty
        };
      });
    } catch (error) {
      console.error('Error fetching contracts:', error);
      return [];
    }
  }

  static async getContractById(contractId: string): Promise<ContractWithDetails | null> {
    try {
      const { data: contract, error } = await supabase
        .from('dim_contract')
        .select(`
          *,
          material:dim_material(*),
          vendor:dim_vendor(*)
        `)
        .eq('contract_id', contractId)
        .maybeSingle();

      if (error) throw error;
      if (!contract) return null;

      const availableQty = contract.contract_boq && contract.contract_boq[0]
        ? contract.contract_boq[0].available_quantity || contract.contract_boq[0].quantity
        : 0;

      return {
        ...contract,
        material: Array.isArray(contract.material) ? contract.material[0] : contract.material,
        vendor: Array.isArray(contract.vendor) ? contract.vendor[0] : contract.vendor,
        available_quantity: availableQty
      };
    } catch (error) {
      console.error('Error fetching contract:', error);
      return null;
    }
  }

  static async getMaterialById(materialId: string): Promise<Material | null> {
    try {
      const { data, error } = await supabase
        .from('dim_material')
        .select('*')
        .eq('material_id', materialId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching material:', error);
      return null;
    }
  }

  static async getVendorById(vendorId: string): Promise<Vendor | null> {
    try {
      const { data, error } = await supabase
        .from('dim_vendor')
        .select('*')
        .eq('vendor_id', vendorId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching vendor:', error);
      return null;
    }
  }

  static async searchContracts(query: string): Promise<ContractWithDetails[]> {
    try {
      const lowerQuery = query.toLowerCase();
      const { data: contracts, error } = await supabase
        .from('dim_contract')
        .select(`
          *,
          material:dim_material(*),
          vendor:dim_vendor(*)
        `)
        .eq('contract_status', 'Active')
        .or(`contract_scope.ilike.%${lowerQuery}%,contract_number.ilike.%${lowerQuery}%`);

      if (error) throw error;

      return (contracts || []).map(contract => {
        const material = Array.isArray(contract.material) ? contract.material[0] : contract.material;
        const vendor = Array.isArray(contract.vendor) ? contract.vendor[0] : contract.vendor;

        const availableQty = contract.contract_boq && contract.contract_boq[0]
          ? contract.contract_boq[0].available_quantity || contract.contract_boq[0].quantity
          : 0;

        return {
          ...contract,
          material,
          vendor,
          available_quantity: availableQty
        };
      });
    } catch (error) {
      console.error('Error searching contracts:', error);
      return [];
    }
  }

  static async filterContracts(filters: {
    category?: string;
    vendorId?: string;
    minValue?: number;
    maxValue?: number;
  }): Promise<ContractWithDetails[]> {
    try {
      let query = supabase
        .from('dim_contract')
        .select(`
          *,
          material:dim_material(*),
          vendor:dim_vendor(*)
        `)
        .eq('contract_status', 'Active');

      if (filters.vendorId) {
        query = query.eq('vendor_id', filters.vendorId);
      }

      if (filters.minValue !== undefined) {
        query = query.gte('contract_value_limit', filters.minValue);
      }

      if (filters.maxValue !== undefined) {
        query = query.lte('contract_value_limit', filters.maxValue);
      }

      const { data: contracts, error } = await query;

      if (error) throw error;

      let filteredContracts = contracts || [];

      if (filters.category) {
        filteredContracts = filteredContracts.filter(contract => {
          const material = Array.isArray(contract.material) ? contract.material[0] : contract.material;
          return material?.material_category?.toLowerCase().includes(filters.category!.toLowerCase());
        });
      }

      return filteredContracts.map(contract => {
        const material = Array.isArray(contract.material) ? contract.material[0] : contract.material;
        const vendor = Array.isArray(contract.vendor) ? contract.vendor[0] : contract.vendor;

        const availableQty = contract.contract_boq && contract.contract_boq[0]
          ? contract.contract_boq[0].available_quantity || contract.contract_boq[0].quantity
          : 0;

        return {
          ...contract,
          material,
          vendor,
          available_quantity: availableQty
        };
      });
    } catch (error) {
      console.error('Error filtering contracts:', error);
      return [];
    }
  }

  static async getUniqueCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('dim_material')
        .select('material_category')
        .not('material_category', 'is', null);

      if (error) throw error;

      const categories = Array.from(
        new Set((data || []).map(m => m.material_category).filter(Boolean))
      );
      return categories.sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  static async getAllVendors(): Promise<Vendor[]> {
    try {
      const { data, error } = await supabase
        .from('dim_vendor')
        .select('*')
        .eq('is_active', true)
        .order('vendor_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching vendors:', error);
      return [];
    }
  }

  static async updateContractQuantity(
    contractId: string,
    quantityUsed: number
  ): Promise<boolean> {
    try {
      const contract = await this.getContractById(contractId);
      if (!contract || !contract.contract_boq) return false;

      const updatedBoq = contract.contract_boq.map(item => ({
        ...item,
        available_quantity: (item.available_quantity || item.quantity) - quantityUsed
      }));

      const { error } = await supabase
        .from('dim_contract')
        .update({
          contract_boq: updatedBoq,
          modified_date: new Date().toISOString()
        })
        .eq('contract_id', contractId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating contract quantity:', error);
      return false;
    }
  }
}
