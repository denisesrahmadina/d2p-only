import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Industry {
  id: string;
  name: string;
  sector: string;
  description: string;
  keyMetrics: string[];
  regulatoryBodies: string[];
  sustainabilityFocus: string[];
}

export class IndustryService {
  /**
   * Get all industries
   */
  static async getIndustries(): Promise<Industry[]> {
    const { data, error } = await supabase
      .from('industries')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching industries:', error);
      return [];
    }

    return data.map(industry => ({
      id: industry.industry_id,
      name: industry.name,
      sector: industry.sector,
      description: industry.description,
      keyMetrics: industry.key_metrics || [],
      regulatoryBodies: industry.regulatory_bodies || [],
      sustainabilityFocus: industry.sustainability_focus || []
    }));
  }

  /**
   * Get industry by ID (using industry_id)
   */
  static async getIndustryById(id: string): Promise<Industry | undefined> {
    const { data, error } = await supabase
      .from('industries')
      .select('*')
      .eq('industry_id', id)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching industry:', error);
      return undefined;
    }

    return {
      id: data.industry_id,
      name: data.name,
      sector: data.sector,
      description: data.description,
      keyMetrics: data.key_metrics || [],
      regulatoryBodies: data.regulatory_bodies || [],
      sustainabilityFocus: data.sustainability_focus || []
    };
  }

  /**
   * Get industries by sector
   */
  static async getIndustriesBySector(sector: string): Promise<Industry[]> {
    const { data, error } = await supabase
      .from('industries')
      .select('*')
      .ilike('sector', `%${sector}%`)
      .order('name');

    if (error) {
      console.error('Error fetching industries by sector:', error);
      return [];
    }

    return data.map(industry => ({
      id: industry.industry_id,
      name: industry.name,
      sector: industry.sector,
      description: industry.description,
      keyMetrics: industry.key_metrics || [],
      regulatoryBodies: industry.regulatory_bodies || [],
      sustainabilityFocus: industry.sustainability_focus || []
    }));
  }

  /**
   * Get all sectors
   */
  static async getSectors(): Promise<string[]> {
    const industries = await this.getIndustries();
    return [...new Set(industries.map(industry => industry.sector))];
  }

  /**
   * Get all regulatory bodies
   */
  static async getAllRegulatoryBodies(): Promise<string[]> {
    const industries = await this.getIndustries();
    const allBodies = industries.flatMap(industry => industry.regulatoryBodies);
    return [...new Set(allBodies)];
  }

  /**
   * Get regulatory bodies by industry
   */
  static async getRegulatoryBodiesByIndustry(industryId: string): Promise<string[]> {
    const industry = await this.getIndustryById(industryId);
    return industry?.regulatoryBodies || [];
  }

  /**
   * Get key metrics by industry
   */
  static async getKeyMetricsByIndustry(industryId: string): Promise<string[]> {
    const industry = await this.getIndustryById(industryId);
    return industry?.keyMetrics || [];
  }

  /**
   * Get sustainability focus areas by industry
   */
  static async getSustainabilityFocusByIndustry(industryId: string): Promise<string[]> {
    const industry = await this.getIndustryById(industryId);
    return industry?.sustainabilityFocus || [];
  }

  /**
   * Search industries by name or description
   */
  static async searchIndustries(query: string): Promise<Industry[]> {
    const { data, error } = await supabase
      .from('industries')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,sector.ilike.%${query}%`)
      .order('name');

    if (error) {
      console.error('Error searching industries:', error);
      return [];
    }

    return data.map(industry => ({
      id: industry.industry_id,
      name: industry.name,
      sector: industry.sector,
      description: industry.description,
      keyMetrics: industry.key_metrics || [],
      regulatoryBodies: industry.regulatory_bodies || [],
      sustainabilityFocus: industry.sustainability_focus || []
    }));
  }

  /**
   * Get industries with specific regulatory body
   */
  static async getIndustriesByRegulatoryBody(regulatoryBody: string): Promise<Industry[]> {
    const industries = await this.getIndustries();
    return industries.filter(industry =>
      industry.regulatoryBodies.some(body =>
        body.toLowerCase().includes(regulatoryBody.toLowerCase())
      )
    );
  }

  /**
   * Get industries with specific sustainability focus
   */
  static async getIndustriesBySustainabilityFocus(focus: string): Promise<Industry[]> {
    const industries = await this.getIndustries();
    return industries.filter(industry =>
      industry.sustainabilityFocus.some(sustainabilityFocus =>
        sustainabilityFocus.toLowerCase().includes(focus.toLowerCase())
      )
    );
  }

  /**
   * Get industry compliance requirements
   */
  static async getIndustryComplianceRequirements(industryId: string): Promise<{
    industry: Industry;
    regulatoryBodies: string[];
    keyMetrics: string[];
    sustainabilityRequirements: string[];
  } | null> {
    const industry = await this.getIndustryById(industryId);
    if (!industry) return null;

    return {
      industry,
      regulatoryBodies: industry.regulatoryBodies,
      keyMetrics: industry.keyMetrics,
      sustainabilityRequirements: industry.sustainabilityFocus
    };
  }

  /**
   * Get industry benchmarking data
   */
  static async getIndustryBenchmarks(industryId: string): Promise<{
    industry: Industry;
    standardMetrics: string[];
    complianceAreas: string[];
    sustainabilityTargets: string[];
  } | null> {
    const industry = await this.getIndustryById(industryId);
    if (!industry) return null;

    return {
      industry,
      standardMetrics: industry.keyMetrics,
      complianceAreas: industry.regulatoryBodies,
      sustainabilityTargets: industry.sustainabilityFocus
    };
  }

  /**
   * Get industry statistics
   */
  static async getIndustryStatistics(): Promise<{
    totalIndustries: number;
    totalSectors: number;
    totalRegulatoryBodies: number;
    avgMetricsPerIndustry: number;
    avgRegulatoryBodiesPerIndustry: number;
    avgSustainabilityFocusPerIndustry: number;
  }> {
    const industries = await this.getIndustries();
    const sectors = await this.getSectors();
    const regulatoryBodies = await this.getAllRegulatoryBodies();

    const avgMetrics = industries.reduce((sum, industry) => sum + industry.keyMetrics.length, 0) / industries.length;
    const avgRegulatory = industries.reduce((sum, industry) => sum + industry.regulatoryBodies.length, 0) / industries.length;
    const avgSustainability = industries.reduce((sum, industry) => sum + industry.sustainabilityFocus.length, 0) / industries.length;

    return {
      totalIndustries: industries.length,
      totalSectors: sectors.length,
      totalRegulatoryBodies: regulatoryBodies.length,
      avgMetricsPerIndustry: Math.round(avgMetrics * 10) / 10,
      avgRegulatoryBodiesPerIndustry: Math.round(avgRegulatory * 10) / 10,
      avgSustainabilityFocusPerIndustry: Math.round(avgSustainability * 10) / 10
    };
  }

  /**
   * Get cross-industry analysis
   */
  static async getCrossIndustryAnalysis(): Promise<{
    commonRegulatoryBodies: string[];
    commonSustainabilityFocus: string[];
    sectorDistribution: { [sector: string]: number };
  }> {
    const industries = await this.getIndustries();

    // Find common regulatory bodies across industries
    const allRegulatoryBodies = industries.flatMap(industry => industry.regulatoryBodies);
    const regulatoryBodyCounts: { [body: string]: number } = {};
    allRegulatoryBodies.forEach(body => {
      regulatoryBodyCounts[body] = (regulatoryBodyCounts[body] || 0) + 1;
    });
    const commonRegulatoryBodies = Object.entries(regulatoryBodyCounts)
      .filter(([_, count]) => count > 1)
      .map(([body, _]) => body);

    // Find common sustainability focus areas
    const allSustainabilityFocus = industries.flatMap(industry => industry.sustainabilityFocus);
    const sustainabilityFocusCounts: { [focus: string]: number } = {};
    allSustainabilityFocus.forEach(focus => {
      sustainabilityFocusCounts[focus] = (sustainabilityFocusCounts[focus] || 0) + 1;
    });
    const commonSustainabilityFocus = Object.entries(sustainabilityFocusCounts)
      .filter(([_, count]) => count > 1)
      .map(([focus, _]) => focus);

    // Sector distribution
    const sectorDistribution: { [sector: string]: number } = {};
    industries.forEach(industry => {
      sectorDistribution[industry.sector] = (sectorDistribution[industry.sector] || 0) + 1;
    });

    return {
      commonRegulatoryBodies,
      commonSustainabilityFocus,
      sectorDistribution
    };
  }

  /**
   * Create a new industry
   */
  static async createIndustry(industry: Omit<Industry, 'id'> & { id?: string }): Promise<Industry | null> {
    const { data, error } = await supabase
      .from('industries')
      .insert({
        industry_id: industry.id,
        name: industry.name,
        sector: industry.sector,
        description: industry.description,
        key_metrics: industry.keyMetrics || [],
        regulatory_bodies: industry.regulatoryBodies || [],
        sustainability_focus: industry.sustainabilityFocus || []
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating industry:', error);
      return null;
    }

    return {
      id: data.industry_id,
      name: data.name,
      sector: data.sector,
      description: data.description,
      keyMetrics: data.key_metrics || [],
      regulatoryBodies: data.regulatory_bodies || [],
      sustainabilityFocus: data.sustainability_focus || []
    };
  }

  /**
   * Update an industry
   */
  static async updateIndustry(id: string, updates: Partial<Industry>): Promise<Industry | null> {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.sector !== undefined) updateData.sector = updates.sector;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.keyMetrics !== undefined) updateData.key_metrics = updates.keyMetrics;
    if (updates.regulatoryBodies !== undefined) updateData.regulatory_bodies = updates.regulatoryBodies;
    if (updates.sustainabilityFocus !== undefined) updateData.sustainability_focus = updates.sustainabilityFocus;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('industries')
      .update(updateData)
      .eq('industry_id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating industry:', error);
      return null;
    }

    return {
      id: data.industry_id,
      name: data.name,
      sector: data.sector,
      description: data.description,
      keyMetrics: data.key_metrics || [],
      regulatoryBodies: data.regulatory_bodies || [],
      sustainabilityFocus: data.sustainability_focus || []
    };
  }

  /**
   * Delete an industry
   */
  static async deleteIndustry(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('industries')
      .delete()
      .eq('industry_id', id);

    if (error) {
      console.error('Error deleting industry:', error);
      return false;
    }

    return true;
  }
}
