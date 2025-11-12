import { supabase } from './supabaseClient';

export interface MomTemplate {
  id: string;
  template_name: string;
  template_description?: string;
  template_category: string;
  file_url: string;
  is_active: boolean;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface MomDocument {
  id?: string;
  sourcing_event_id: string;
  template_id: string;
  document_name: string;
  document_url: string;
  status: 'Draft' | 'In Progress' | 'Completed' | 'Archived';
  created_by?: string;
  meeting_date?: string;
  participants?: Array<{ name: string; role: string; email?: string }>;
  notes?: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export class MomDocumentService {
  static async getAllTemplates(organizationId?: string): Promise<MomTemplate[]> {
    let query = supabase
      .from('ref_mom_template')
      .select('*')
      .eq('is_active', true)
      .order('template_category', { ascending: true })
      .order('template_name', { ascending: true });

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async getTemplateById(id: string): Promise<MomTemplate | null> {
    const { data, error } = await supabase
      .from('ref_mom_template')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getDocumentsByEvent(sourcingEventId: string): Promise<MomDocument[]> {
    const { data, error } = await supabase
      .from('ref_mom_document')
      .select('*')
      .eq('sourcing_event_id', sourcingEventId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createDocument(
    document: Omit<MomDocument, 'id' | 'created_at' | 'updated_at'>
  ): Promise<MomDocument> {
    const { data, error } = await supabase
      .from('ref_mom_document')
      .insert([document])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateDocument(
    id: string,
    updates: Partial<MomDocument>
  ): Promise<MomDocument> {
    const { data, error } = await supabase
      .from('ref_mom_document')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('ref_mom_document')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static generateDocumentUrl(templateUrl: string, documentId: string, eventName: string): string {
    const baseUrl = templateUrl.replace('/edit', '/copy');
    const encodedName = encodeURIComponent(`MoM - ${eventName} - ${new Date().toLocaleDateString()}`);
    return `${baseUrl}?title=${encodedName}`;
  }

  static async getDocumentWithTemplate(documentId: string): Promise<(MomDocument & { template?: MomTemplate }) | null> {
    const { data, error } = await supabase
      .from('ref_mom_document')
      .select(`
        *,
        template:ref_mom_template(*)
      `)
      .eq('id', documentId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static getStatusColor(status: MomDocument['status']): string {
    switch (status) {
      case 'Draft':
        return 'gray';
      case 'In Progress':
        return 'blue';
      case 'Completed':
        return 'green';
      case 'Archived':
        return 'orange';
      default:
        return 'gray';
    }
  }

  static getStatusIcon(status: MomDocument['status']): string {
    switch (status) {
      case 'Draft':
        return 'FileText';
      case 'In Progress':
        return 'Edit';
      case 'Completed':
        return 'CheckCircle';
      case 'Archived':
        return 'Archive';
      default:
        return 'FileText';
    }
  }
}
