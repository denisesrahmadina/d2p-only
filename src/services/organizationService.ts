import { createClient } from '@supabase/supabase-js';
import { Organization, KPI } from '../types/agent';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class OrganizationService {
  /**
   * Get all organizations
   */
  static async getOrganizations(): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching organizations:', error);
      return [];
    }

    return data.map(org => ({
      id: org.org_id || org.id,
      industryId: org.industry_id,
      name: org.name,
      type: org.type,
      kpis: org.kpis || [],
      parentId: org.parent_id
    }));
  }

  /**
   * Get organization by ID (UUID)
   */
  static async getOrganizationById(id: string): Promise<Organization | undefined> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching organization:', error);
      return undefined;
    }

    return {
      id: data.org_id || data.id,
      industryId: data.industry_id,
      name: data.name,
      type: data.type,
      kpis: data.kpis || [],
      parentId: data.parent_id
    };
  }

  /**
   * Get organization by org_id (string identifier like 'indonesia-power')
   */
  static async getOrganizationByOrgId(orgId: string): Promise<Organization | undefined> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('org_id', orgId)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching organization by org_id:', error);
      return undefined;
    }

    return {
      id: data.org_id || data.id,
      industryId: data.industry_id,
      name: data.name,
      type: data.type,
      kpis: data.kpis || [],
      parentId: data.parent_id
    };
  }

  /**
   * Get organizations by type
   */
  static async getOrganizationsByType(type: 'holding' | 'subsidiary'): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('type', type)
      .order('name');

    if (error) {
      console.error('Error fetching organizations by type:', error);
      return [];
    }

    return data.map(org => ({
      id: org.org_id || org.id,
      industryId: org.industry_id,
      name: org.name,
      type: org.type,
      kpis: org.kpis || [],
      parentId: org.parent_id
    }));
  }

  /**
   * Get holding companies only
   */
  static async getHoldingCompanies(): Promise<Organization[]> {
    return this.getOrganizationsByType('holding');
  }

  /**
   * Get subsidiaries only
   */
  static async getSubsidiaries(): Promise<Organization[]> {
    return this.getOrganizationsByType('subsidiary');
  }

  /**
   * Get subsidiaries by parent ID
   */
  static async getSubsidiariesByParent(parentId: string): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('parent_id', parentId)
      .order('name');

    if (error) {
      console.error('Error fetching subsidiaries:', error);
      return [];
    }

    return data.map(org => ({
      id: org.org_id || org.id,
      industryId: org.industry_id,
      name: org.name,
      type: org.type,
      kpis: org.kpis || [],
      parentId: org.parent_id
    }));
  }

  /**
   * Get organizations by industry ID
   */
  static async getOrganizationsByIndustry(industryId: string): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('industry_id', industryId)
      .order('name');

    if (error) {
      console.error('Error fetching organizations by industry:', error);
      return [];
    }

    return data.map(org => ({
      id: org.org_id || org.id,
      industryId: org.industry_id,
      name: org.name,
      type: org.type,
      kpis: org.kpis || [],
      parentId: org.parent_id
    }));
  }

  /**
   * Get organization hierarchy (parent with all subsidiaries)
   */
  static async getOrganizationHierarchy(holdingId: string): Promise<{
    holding: Organization;
    subsidiaries: Organization[];
  } | null> {
    const holding = await this.getOrganizationById(holdingId);
    if (!holding || holding.type !== 'holding') {
      return null;
    }

    const subsidiaries = await this.getSubsidiariesByParent(holdingId);
    return { holding, subsidiaries };
  }

  /**
   * Get KPI by organization and KPI ID
   */
  static async getKPIById(organizationId: string, kpiId: string): Promise<KPI | undefined> {
    const organization = await this.getOrganizationById(organizationId);
    return organization?.kpis.find(kpi => kpi.id === kpiId);
  }

  /**
   * Get KPIs by trend
   */
  static async getKPIsByTrend(organizationId: string, trend: 'up' | 'down' | 'stable'): Promise<KPI[]> {
    const organization = await this.getOrganizationById(organizationId);
    return organization?.kpis.filter(kpi => kpi.trend === trend) || [];
  }

  /**
   * Get underperforming KPIs (value below target)
   */
  static async getUnderperformingKPIs(organizationId: string): Promise<KPI[]> {
    const organization = await this.getOrganizationById(organizationId);
    return organization?.kpis.filter(kpi => kpi.value < kpi.target) || [];
  }

  /**
   * Get overperforming KPIs (value above target)
   */
  static async getOverperformingKPIs(organizationId: string): Promise<KPI[]> {
    const organization = await this.getOrganizationById(organizationId);
    return organization?.kpis.filter(kpi => kpi.value > kpi.target) || [];
  }

  /**
   * Get organization performance summary
   */
  static async getOrganizationPerformanceSummary(organizationId: string): Promise<{
    totalKPIs: number;
    onTarget: number;
    aboveTarget: number;
    belowTarget: number;
    trendingUp: number;
    trendingDown: number;
    stable: number;
  } | null> {
    const organization = await this.getOrganizationById(organizationId);
    if (!organization) return null;

    const kpis = organization.kpis;
    const onTarget = kpis.filter(kpi => kpi.value === kpi.target).length;
    const aboveTarget = kpis.filter(kpi => kpi.value > kpi.target).length;
    const belowTarget = kpis.filter(kpi => kpi.value < kpi.target).length;
    const trendingUp = kpis.filter(kpi => kpi.trend === 'up').length;
    const trendingDown = kpis.filter(kpi => kpi.trend === 'down').length;
    const stable = kpis.filter(kpi => kpi.trend === 'stable').length;

    return {
      totalKPIs: kpis.length,
      onTarget,
      aboveTarget,
      belowTarget,
      trendingUp,
      trendingDown,
      stable
    };
  }

  /**
   * Search organizations by name
   */
  static async searchOrganizations(query: string): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name');

    if (error) {
      console.error('Error searching organizations:', error);
      return [];
    }

    return data.map(org => ({
      id: org.org_id || org.id,
      industryId: org.industry_id,
      name: org.name,
      type: org.type,
      kpis: org.kpis || [],
      parentId: org.parent_id
    }));
  }

  /**
   * Get consolidated KPIs for holding company (including subsidiaries)
   */
  static async getConsolidatedKPIs(holdingId: string): Promise<{
    holding: KPI[];
    subsidiaries: { [subsidiaryId: string]: KPI[] };
    consolidated: any;
  } | null> {
    const hierarchy = await this.getOrganizationHierarchy(holdingId);
    if (!hierarchy) return null;

    const subsidiaryKPIs: { [subsidiaryId: string]: KPI[] } = {};
    hierarchy.subsidiaries.forEach(subsidiary => {
      subsidiaryKPIs[subsidiary.id] = subsidiary.kpis;
    });

    const consolidated = {
      totalSubsidiaries: hierarchy.subsidiaries.length,
      avgPerformance: hierarchy.subsidiaries.reduce((sum, sub) => {
        const avgKPI = sub.kpis.reduce((kpiSum, kpi) => kpiSum + (kpi.value / kpi.target), 0) / sub.kpis.length;
        return sum + avgKPI;
      }, 0) / hierarchy.subsidiaries.length
    };

    return {
      holding: hierarchy.holding.kpis,
      subsidiaries: subsidiaryKPIs,
      consolidated
    };
  }

  /**
   * Get organization statistics
   */
  static async getOrganizationStatistics(): Promise<{
    totalOrganizations: number;
    holdingCompanies: number;
    subsidiaries: number;
    byIndustry: { [industryId: string]: number };
  }> {
    const organizations = await this.getOrganizations();
    const holdings = organizations.filter(org => org.type === 'holding');
    const subsidiaries = organizations.filter(org => org.type === 'subsidiary');

    const byIndustry: { [industryId: string]: number } = {};
    organizations.forEach(org => {
      if (org.industryId) {
        byIndustry[org.industryId] = (byIndustry[org.industryId] || 0) + 1;
      }
    });

    return {
      totalOrganizations: organizations.length,
      holdingCompanies: holdings.length,
      subsidiaries: subsidiaries.length,
      byIndustry
    };
  }

  /**
   * Create a new organization
   */
  static async createOrganization(organization: Omit<Organization, 'id'> & { id?: string }): Promise<Organization | null> {
    const { data, error } = await supabase
      .from('organizations')
      .insert({
        org_id: organization.id,
        industry_id: organization.industryId,
        name: organization.name,
        type: organization.type,
        kpis: organization.kpis || [],
        parent_id: organization.parentId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating organization:', error);
      return null;
    }

    return {
      id: data.org_id || data.id,
      industryId: data.industry_id,
      name: data.name,
      type: data.type,
      kpis: data.kpis || [],
      parentId: data.parent_id
    };
  }

  /**
   * Update an organization
   */
  static async updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization | null> {
    const updateData: any = {};
    if (updates.industryId !== undefined) updateData.industry_id = updates.industryId;
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.kpis !== undefined) updateData.kpis = updates.kpis;
    if (updates.parentId !== undefined) updateData.parent_id = updates.parentId;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('organizations')
      .update(updateData)
      .eq('org_id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating organization:', error);
      return null;
    }

    return {
      id: data.org_id || data.id,
      industryId: data.industry_id,
      name: data.name,
      type: data.type,
      kpis: data.kpis || [],
      parentId: data.parent_id
    };
  }

  /**
   * Delete an organization
   */
  static async deleteOrganization(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('org_id', id);

    if (error) {
      console.error('Error deleting organization:', error);
      return false;
    }

    return true;
  }
}
