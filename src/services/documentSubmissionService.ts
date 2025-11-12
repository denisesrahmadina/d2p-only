import { supabase } from './supabaseClient';

export interface DocumentSubmission {
  id: string;
  tender_id: string;
  vendor_id: string;
  section_name: string;
  section_order: number;
  file_path?: string;
  file_type?: string;
  file_size?: number;
  submission_status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  ai_screening_score?: number;
  compliance_issues: string[];
  recommendations: string[];
  submitted_at?: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export class DocumentSubmissionService {
  static async getAllSubmissions(organizationId: string): Promise<DocumentSubmission[]> {
    const { data, error } = await supabase
      .from('ref_document_submission')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getSubmissionById(id: string): Promise<DocumentSubmission | null> {
    const { data, error } = await supabase
      .from('ref_document_submission')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getSubmissionsByTender(tenderId: string): Promise<DocumentSubmission[]> {
    const { data, error } = await supabase
      .from('ref_document_submission')
      .select('*')
      .eq('tender_id', tenderId)
      .order('vendor_id', { ascending: true })
      .order('section_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getSubmissionsByVendor(vendorId: string): Promise<DocumentSubmission[]> {
    const { data, error } = await supabase
      .from('ref_document_submission')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getSubmissionsByTenderAndVendor(
    tenderId: string,
    vendorId: string
  ): Promise<DocumentSubmission[]> {
    const { data, error } = await supabase
      .from('ref_document_submission')
      .select('*')
      .eq('tender_id', tenderId)
      .eq('vendor_id', vendorId)
      .order('section_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createSubmission(
    submission: Omit<DocumentSubmission, 'id' | 'created_at' | 'updated_at'>
  ): Promise<DocumentSubmission> {
    const { data, error } = await supabase
      .from('ref_document_submission')
      .insert([submission])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSubmission(
    id: string,
    updates: Partial<DocumentSubmission>
  ): Promise<DocumentSubmission> {
    const { data, error } = await supabase
      .from('ref_document_submission')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteSubmission(id: string): Promise<void> {
    const { error } = await supabase
      .from('ref_document_submission')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async submitDocuments(tenderId: string, vendorId: string): Promise<DocumentSubmission[]> {
    const { data, error } = await supabase
      .from('ref_document_submission')
      .update({
        submission_status: 'Submitted',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('tender_id', tenderId)
      .eq('vendor_id', vendorId)
      .select();

    if (error) throw error;
    return data || [];
  }

  static async getSubmissionProgress(
    tenderId: string,
    vendorId: string
  ): Promise<{
    totalSections: number;
    completedSections: number;
    percentageComplete: number;
    averageScore: number;
  }> {
    const submissions = await this.getSubmissionsByTenderAndVendor(tenderId, vendorId);

    const completedSections = submissions.filter(s => s.file_path && s.file_path.length > 0).length;
    const totalSections = submissions.length;
    const percentageComplete = totalSections > 0 ? (completedSections / totalSections) * 100 : 0;

    const scoresWithValues = submissions.filter(s => s.ai_screening_score !== null && s.ai_screening_score !== undefined);
    const averageScore = scoresWithValues.length > 0
      ? scoresWithValues.reduce((sum, s) => sum + (s.ai_screening_score || 0), 0) / scoresWithValues.length
      : 0;

    return {
      totalSections,
      completedSections,
      percentageComplete: Math.round(percentageComplete),
      averageScore: Math.round(averageScore)
    };
  }

  static async getVendorSubmissionSummary(vendorId: string): Promise<{
    total: number;
    draft: number;
    submitted: number;
    underReview: number;
    approved: number;
    rejected: number;
  }> {
    const submissions = await this.getSubmissionsByVendor(vendorId);

    const uniqueTenders = new Set(submissions.map(s => s.tender_id));

    return {
      total: uniqueTenders.size,
      draft: submissions.filter(s => s.submission_status === 'Draft').length,
      submitted: submissions.filter(s => s.submission_status === 'Submitted').length,
      underReview: submissions.filter(s => s.submission_status === 'Under Review').length,
      approved: submissions.filter(s => s.submission_status === 'Approved').length,
      rejected: submissions.filter(s => s.submission_status === 'Rejected').length
    };
  }
}
