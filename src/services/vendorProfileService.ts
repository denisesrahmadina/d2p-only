import { supabase } from './supabaseClient';

export interface VendorProfile {
  id: string;
  vendor_id: string;
  company_registration_number?: string;
  tax_id?: string;
  established_date?: string;
  employee_count?: number;
  annual_revenue?: number;
  certifications?: Array<{
    name: string;
    issuer: string;
    issue_date: string;
    expiry_date?: string;
    certificate_url?: string;
  }>;
  service_areas?: string[];
  product_categories?: string[];
  payment_terms?: string;
  delivery_capabilities?: string;
  minimum_order_value?: number;
  average_rating?: number;
  total_ratings?: number;
  performance_score?: number;
  on_time_delivery_rate?: number;
  quality_score?: number;
  compliance_status?: string;
  primary_contact_name?: string;
  primary_contact_email?: string;
  primary_contact_phone?: string;
  billing_address?: {
    street: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
  };
  shipping_address?: {
    street: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
  };
  website_url?: string;
  logo_url?: string;
  documents?: Array<{
    name: string;
    type: string;
    url: string;
    uploaded_at: string;
  }>;
  notes?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProcurementTeamMember {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  specialization?: string;
  assigned_vendors?: string[];
  assigned_categories?: string[];
  performance_metrics?: {
    orders_processed: number;
    average_processing_time: number;
    approval_rate: number;
    cost_savings: number;
  };
  activity_log?: Array<{
    timestamp: string;
    action: string;
    details: string;
  }>;
  avatar_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VendorRating {
  id: string;
  vendor_id: string;
  rated_by_user_id: string;
  rated_by_name: string;
  po_number?: string;
  rating_overall: number;
  rating_quality?: number;
  rating_delivery?: number;
  rating_communication?: number;
  rating_value?: number;
  review_title?: string;
  review_text?: string;
  pros?: string;
  cons?: string;
  would_recommend?: boolean;
  is_verified?: boolean;
  helpful_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface VendorCommunication {
  id: string;
  vendor_id: string;
  communication_type: string;
  subject: string;
  content?: string;
  from_user_id: string;
  from_user_name: string;
  to_contacts?: Array<{
    name: string;
    email: string;
  }>;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  related_po_number?: string;
  related_contract_id?: string;
  status?: string;
  priority?: string;
  is_read?: boolean;
  read_at?: string;
  responded_at?: string;
  created_at?: string;
}

export class VendorProfileService {
  static async getVendorProfile(vendorId: string): Promise<VendorProfile | null> {
    try {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('vendor_id', vendorId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching vendor profile:', error);
      return null;
    }
  }

  static async getAllVendorProfiles(): Promise<VendorProfile[]> {
    try {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching vendor profiles:', error);
      return [];
    }
  }

  static async createVendorProfile(profile: Partial<VendorProfile>): Promise<VendorProfile | null> {
    try {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .insert([{
          ...profile,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating vendor profile:', error);
      return null;
    }
  }

  static async updateVendorProfile(id: string, updates: Partial<VendorProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('vendor_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating vendor profile:', error);
      return false;
    }
  }

  static async getVendorRatings(vendorId: string): Promise<VendorRating[]> {
    try {
      const { data, error } = await supabase
        .from('vendor_ratings')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching vendor ratings:', error);
      return [];
    }
  }

  static async addVendorRating(rating: Partial<VendorRating>): Promise<VendorRating | null> {
    try {
      const { data, error } = await supabase
        .from('vendor_ratings')
        .insert([{
          ...rating,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      await this.updateVendorAverageRating(rating.vendor_id!);

      return data;
    } catch (error) {
      console.error('Error adding vendor rating:', error);
      return null;
    }
  }

  static async updateVendorAverageRating(vendorId: string): Promise<void> {
    try {
      const ratings = await this.getVendorRatings(vendorId);

      if (ratings.length === 0) return;

      const averageRating = ratings.reduce((sum, r) => sum + r.rating_overall, 0) / ratings.length;

      const { error } = await supabase
        .from('vendor_profiles')
        .update({
          average_rating: averageRating,
          total_ratings: ratings.length,
          updated_at: new Date().toISOString()
        })
        .eq('vendor_id', vendorId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating vendor average rating:', error);
    }
  }

  static async getVendorCommunications(vendorId: string): Promise<VendorCommunication[]> {
    try {
      const { data, error } = await supabase
        .from('vendor_communications')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching vendor communications:', error);
      return [];
    }
  }

  static async addVendorCommunication(
    communication: Partial<VendorCommunication>
  ): Promise<VendorCommunication | null> {
    try {
      const { data, error } = await supabase
        .from('vendor_communications')
        .insert([{
          ...communication,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding vendor communication:', error);
      return null;
    }
  }

  static async getTeamMembers(): Promise<ProcurementTeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('procurement_team_members')
        .select('*')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  }

  static async getTeamMemberById(id: string): Promise<ProcurementTeamMember | null> {
    try {
      const { data, error } = await supabase
        .from('procurement_team_members')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching team member:', error);
      return null;
    }
  }

  static async getVendorPerformanceMetrics(vendorId: string): Promise<{
    on_time_delivery_rate: number;
    quality_score: number;
    total_orders: number;
    total_value: number;
    average_rating: number;
  }> {
    try {
      const { data: orders, error } = await supabase
        .from('fact_purchase_order')
        .select('po_status, total_po_value, expected_delivery_date, actual_delivery_date')
        .eq('vendor_id', vendorId);

      if (error) throw error;

      const totalOrders = orders?.length || 0;
      const totalValue = orders?.reduce((sum, o) => sum + parseFloat(o.total_po_value || 0), 0) || 0;

      let onTimeDeliveries = 0;
      orders?.forEach(order => {
        if (order.actual_delivery_date && order.expected_delivery_date) {
          const actual = new Date(order.actual_delivery_date);
          const expected = new Date(order.expected_delivery_date);
          if (actual <= expected) {
            onTimeDeliveries++;
          }
        }
      });

      const onTimeRate = totalOrders > 0 ? (onTimeDeliveries / totalOrders) * 100 : 0;

      const profile = await this.getVendorProfile(vendorId);

      return {
        on_time_delivery_rate: onTimeRate,
        quality_score: profile?.quality_score || 0,
        total_orders: totalOrders,
        total_value: totalValue,
        average_rating: profile?.average_rating || 0
      };
    } catch (error) {
      console.error('Error calculating vendor performance metrics:', error);
      return {
        on_time_delivery_rate: 0,
        quality_score: 0,
        total_orders: 0,
        total_value: 0,
        average_rating: 0
      };
    }
  }
}
