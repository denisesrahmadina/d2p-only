import { supabase } from './supabaseClient';

export interface DocumentSubmissionSection {
  id?: string;
  sourcing_event_id: string;
  section_name: string;
  section_description?: string;
  section_order: number;
  is_required: boolean;
  file_types_allowed: string[];
  max_file_size_mb: number;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export class DocumentSubmissionSectionService {
  static async getSectionsByEvent(sourcingEventId: string): Promise<DocumentSubmissionSection[]> {
    const { data, error } = await supabase
      .from('ref_document_submission_section')
      .select('*')
      .eq('sourcing_event_id', sourcingEventId)
      .order('section_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getSectionById(id: string): Promise<DocumentSubmissionSection | null> {
    const { data, error } = await supabase
      .from('ref_document_submission_section')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async createSection(
    section: Omit<DocumentSubmissionSection, 'id' | 'created_at' | 'updated_at'>
  ): Promise<DocumentSubmissionSection> {
    const { data, error } = await supabase
      .from('ref_document_submission_section')
      .insert([section])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSection(
    id: string,
    updates: Partial<DocumentSubmissionSection>
  ): Promise<DocumentSubmissionSection> {
    const { data, error } = await supabase
      .from('ref_document_submission_section')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteSection(id: string): Promise<void> {
    const { error } = await supabase
      .from('ref_document_submission_section')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async batchCreateSections(
    sections: Omit<DocumentSubmissionSection, 'id' | 'created_at' | 'updated_at'>[]
  ): Promise<DocumentSubmissionSection[]> {
    const { data, error } = await supabase
      .from('ref_document_submission_section')
      .insert(sections)
      .select();

    if (error) throw error;
    return data || [];
  }

  static generateStandardSections(
    sourcingEventId: string,
    organizationId: string,
    category?: string
  ): Omit<DocumentSubmissionSection, 'id' | 'created_at' | 'updated_at'>[] {
    const standardSections = [
      {
        sourcing_event_id: sourcingEventId,
        section_name: 'Company Profile',
        section_description: 'Complete company profile including business license, organizational structure, and company history',
        section_order: 1,
        is_required: true,
        file_types_allowed: ['pdf', 'doc', 'docx'],
        max_file_size_mb: 10,
        organization_id: organizationId
      },
      {
        sourcing_event_id: sourcingEventId,
        section_name: 'Technical Specifications',
        section_description: 'Detailed technical specifications of offered products with compliance certifications',
        section_order: 2,
        is_required: true,
        file_types_allowed: ['pdf', 'xlsx', 'dwg', 'zip'],
        max_file_size_mb: 20,
        organization_id: organizationId
      },
      {
        sourcing_event_id: sourcingEventId,
        section_name: 'Financial Proposal',
        section_description: 'Itemized pricing breakdown and payment terms',
        section_order: 3,
        is_required: true,
        file_types_allowed: ['pdf', 'xlsx'],
        max_file_size_mb: 5,
        organization_id: organizationId
      },
      {
        sourcing_event_id: sourcingEventId,
        section_name: 'Quality Certifications',
        section_description: 'ISO certifications, quality assurance documents, and test reports',
        section_order: 4,
        is_required: true,
        file_types_allowed: ['pdf'],
        max_file_size_mb: 15,
        organization_id: organizationId
      },
      {
        sourcing_event_id: sourcingEventId,
        section_name: 'Delivery Schedule',
        section_description: 'Proposed delivery timeline with milestones',
        section_order: 5,
        is_required: true,
        file_types_allowed: ['pdf', 'xlsx', 'mpp'],
        max_file_size_mb: 5,
        organization_id: organizationId
      }
    ];

    if (category?.toLowerCase().includes('electronic')) {
      standardSections.push({
        sourcing_event_id: sourcingEventId,
        section_name: 'Safety Certifications',
        section_description: 'Electrical safety certifications and testing reports',
        section_order: 6,
        is_required: true,
        file_types_allowed: ['pdf'],
        max_file_size_mb: 10,
        organization_id: organizationId
      });
    }

    return standardSections;
  }
}
