import { supabase } from './supabaseClient';

export interface Vendor {
  id: string;
  company_name: string;
  email: string;
  contact_person: string;
  phone?: string;
  categories: string[];
  address?: string;
  registration_number?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  user_id?: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export class VendorService {
  static async getAllVendors(organizationId: string): Promise<Vendor[]> {
    const { data, error } = await supabase
      .from('dim_vendor')
      .select('*')
      .eq('organization_id', organizationId)
      .order('company_name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getVendorById(id: string): Promise<Vendor | null> {
    const { data, error } = await supabase
      .from('dim_vendor')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getVendorByEmail(email: string): Promise<Vendor | null> {
    const { data, error } = await supabase
      .from('dim_vendor')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getVendorByUserId(userId: string): Promise<Vendor | null> {
    const { data, error } = await supabase
      .from('dim_vendor')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getVendorsByCategory(
    organizationId: string,
    category: string
  ): Promise<Vendor[]> {
    const { data, error } = await supabase
      .from('dim_vendor')
      .select('*')
      .eq('organization_id', organizationId)
      .contains('categories', [category])
      .order('company_name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getVendorsByStatus(
    organizationId: string,
    status: string
  ): Promise<Vendor[]> {
    const { data, error } = await supabase
      .from('dim_vendor')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', status)
      .order('company_name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createVendor(vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>): Promise<Vendor> {
    const { data, error } = await supabase
      .from('dim_vendor')
      .insert([vendor])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateVendor(id: string, updates: Partial<Vendor>): Promise<Vendor> {
    const { data, error } = await supabase
      .from('dim_vendor')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteVendor(id: string): Promise<void> {
    const { error } = await supabase
      .from('dim_vendor')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async searchVendors(organizationId: string, query: string): Promise<Vendor[]> {
    const { data, error } = await supabase
      .from('dim_vendor')
      .select('*')
      .eq('organization_id', organizationId)
      .or(`company_name.ilike.%${query}%,email.ilike.%${query}%,contact_person.ilike.%${query}%`)
      .order('company_name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getVendorsSummary(organizationId: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    byCategory: { [key: string]: number };
  }> {
    const vendors = await this.getAllVendors(organizationId);

    const summary = {
      total: vendors.length,
      active: vendors.filter(v => v.status === 'Active').length,
      inactive: vendors.filter(v => v.status === 'Inactive').length,
      suspended: vendors.filter(v => v.status === 'Suspended').length,
      byCategory: {} as { [key: string]: number }
    };

    vendors.forEach(vendor => {
      vendor.categories.forEach(category => {
        summary.byCategory[category] = (summary.byCategory[category] || 0) + 1;
      });
    });

    return summary;
  }
}
