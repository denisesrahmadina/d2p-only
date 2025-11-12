import { supabase } from './supabaseClient';

export interface TenderAnnouncementV2 {
  id?: string;
  sourcing_event_id: string;
  title: string;
  header?: string;
  opener?: string;
  body?: string;
  closing?: string;
  publication_date?: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Published' | 'Closed';
  target_vendors: string[];
  approved_by?: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export class TenderAnnouncementV2Service {
  static async getAllAnnouncements(organizationId: string): Promise<TenderAnnouncementV2[]> {
    const { data, error } = await supabase
      .from('ref_tender_announcement_v2')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getAnnouncementById(id: string): Promise<TenderAnnouncementV2 | null> {
    const { data, error } = await supabase
      .from('ref_tender_announcement_v2')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getAnnouncementBySourcingEvent(sourcingEventId: string): Promise<TenderAnnouncementV2 | null> {
    const { data, error } = await supabase
      .from('ref_tender_announcement_v2')
      .select('*')
      .eq('sourcing_event_id', sourcingEventId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async createAnnouncement(
    announcement: Omit<TenderAnnouncementV2, 'id' | 'created_at' | 'updated_at'>
  ): Promise<TenderAnnouncementV2> {
    const { data, error } = await supabase
      .from('ref_tender_announcement_v2')
      .insert([announcement])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateAnnouncement(
    id: string,
    updates: Partial<TenderAnnouncementV2>
  ): Promise<TenderAnnouncementV2> {
    const { data, error } = await supabase
      .from('ref_tender_announcement_v2')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteAnnouncement(id: string): Promise<void> {
    const { error } = await supabase
      .from('ref_tender_announcement_v2')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async publishAnnouncement(id: string, approvedBy: string): Promise<TenderAnnouncementV2> {
    return this.updateAnnouncement(id, {
      status: 'Published',
      approved_by: approvedBy,
      publication_date: new Date().toISOString().split('T')[0]
    });
  }

  static generateAnnouncementFromEvent(event: any, organizationId: string): Omit<TenderAnnouncementV2, 'id' | 'created_at' | 'updated_at'> {
    const estimatedPrice = event.estimated_price
      ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(event.estimated_price)
      : 'To be determined';

    const quantity = event.material_qty ? `${event.material_qty} units` : 'As specified';
    const deadline = event.tender_end_date || 'To be announced';

    return {
      sourcing_event_id: event.sourcing_event_id,
      title: `Tender Announcement: ${event.sourcing_event_name}`,
      header: 'PT Indonesia Power (Persero)',
      opener: `We are pleased to announce an open tender for ${event.sourcing_event_name}.`,
      body: `PT Indonesia Power (Persero) invites qualified vendors to submit their proposals for the supply of materials required for ${event.sourcing_event_name}. The estimated contract value is ${estimatedPrice} for ${quantity}. All submissions must comply with our technical specifications and quality standards. Interested vendors should submit complete documentation including company profile, technical specifications, financial proposal, and relevant certifications by the submission deadline.`,
      closing: `All submissions must be received no later than ${deadline}. For inquiries, please contact procurement@indonesiapower.co.id. We look forward to your participation.`,
      status: 'Draft',
      target_vendors: [],
      organization_id: organizationId
    };
  }
}
