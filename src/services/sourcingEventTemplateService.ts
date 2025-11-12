import { supabase } from './supabaseClient';

export interface SourcingEventTemplate {
  id: string;
  template_name: string;
  template_description: string;
  category: string;
  default_delivery_terms: string;
  default_evaluation_criteria: EvaluationCriterion[];
  default_milestones: MilestoneTemplate[];
  estimated_duration_days: number;
  recommended_vendors: string[];
  is_active: boolean;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface EvaluationCriterion {
  name: string;
  weight: number;
  description: string;
}

export interface MilestoneTemplate {
  name: string;
  days_offset: number;
  description: string;
}

export class SourcingEventTemplateService {
  static async getAllTemplates(organizationId: string): Promise<SourcingEventTemplate[]> {
    const { data, error } = await supabase
      .from('ref_sourcing_event_template')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('template_name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getTemplateById(id: string): Promise<SourcingEventTemplate | null> {
    const { data, error } = await supabase
      .from('ref_sourcing_event_template')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getTemplatesByCategory(
    organizationId: string,
    category: string
  ): Promise<SourcingEventTemplate[]> {
    const { data, error } = await supabase
      .from('ref_sourcing_event_template')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('category', category)
      .eq('is_active', true)
      .order('template_name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createTemplate(
    template: Omit<SourcingEventTemplate, 'id' | 'created_at' | 'updated_at'>
  ): Promise<SourcingEventTemplate> {
    const { data, error } = await supabase
      .from('ref_sourcing_event_template')
      .insert([template])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTemplate(
    id: string,
    updates: Partial<SourcingEventTemplate>
  ): Promise<SourcingEventTemplate> {
    const { data, error } = await supabase
      .from('ref_sourcing_event_template')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deactivateTemplate(id: string): Promise<SourcingEventTemplate> {
    return this.updateTemplate(id, { is_active: false });
  }

  static getRecommendedTemplateForCategory(
    templates: SourcingEventTemplate[],
    category: string
  ): SourcingEventTemplate | null {
    const categoryMatch = templates.find(t =>
      t.category.toLowerCase().includes(category.toLowerCase()) ||
      category.toLowerCase().includes(t.category.toLowerCase())
    );

    if (categoryMatch) return categoryMatch;

    if (category.toLowerCase().includes('engine') || category.toLowerCase().includes('motor')) {
      return templates.find(t => t.category === 'Automotive Components') || templates[0] || null;
    }

    if (category.toLowerCase().includes('electronic') || category.toLowerCase().includes('electric')) {
      return templates.find(t => t.category === 'Electronics') || templates[0] || null;
    }

    if (category.toLowerCase().includes('brake') || category.toLowerCase().includes('safety')) {
      return templates.find(t => t.category === 'Safety Systems') || templates[0] || null;
    }

    if (category.toLowerCase().includes('chassis') || category.toLowerCase().includes('frame')) {
      return templates.find(t => t.category === 'Structural Components') || templates[0] || null;
    }

    return templates[0] || null;
  }

  static generateMilestonesFromTemplate(
    template: SourcingEventTemplate,
    startDate: Date
  ): Array<{ name: string; date: string; description: string }> {
    return template.default_milestones.map(milestone => {
      const milestoneDate = new Date(startDate);
      milestoneDate.setDate(milestoneDate.getDate() + milestone.days_offset);

      return {
        name: milestone.name,
        date: milestoneDate.toISOString().split('T')[0],
        description: milestone.description
      };
    });
  }
}
