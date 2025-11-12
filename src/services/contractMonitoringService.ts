import { supabase } from './supabaseClient';
import { mockContracts, mockComplianceIssues, mockInsights } from '../data/contractMonitoringMockData';

export interface PenaltyClause {
  clause_id: string;
  penalty_type: string;
  description: string;
  trigger_condition: string;
  calculation_method: string;
  penalty_amount: number;
  penalty_unit: string;
  max_penalty?: number;
  grace_period_days?: number;
  grace_period_hours?: number;
  sla_threshold?: string;
  notes?: string;
}

export interface ContractMonitoring {
  id: string;
  organization_id: string;
  contract_id: string;
  contract_name: string;
  vendor_name: string;
  contract_value: number;
  start_date: string;
  end_date: string;
  capacity: number;
  actual_consumption: number;
  consumption_percentage: number;
  total_committed_value: number;
  total_committed_quantity: number;
  po_total_value: number;
  po_total_quantity: number;
  absorption_percentage: number;
  unit_of_measure: string;
  penalty_clauses: PenaltyClause[];
  status: 'active' | 'expiring_soon' | 'expired' | 'at_risk';
  category: string;
  created_at: string;
  updated_at: string;
}

export interface ContractComplianceIssue {
  id: string;
  organization_id: string;
  contract_id: string;
  issue_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  financial_impact: number;
  detected_date: string;
  status: 'open' | 'under_review' | 'resolved';
  created_at: string;
}

export interface ActionPlanStep {
  step: number;
  action: string;
  details: string;
  owner: string;
  deadline: string;
}

export interface ContractInsight {
  id: string;
  organization_id: string;
  contract_id: string;
  insight_type: 'penalty_calculation' | 'termination_analysis' | 'renewal_recommendation' | 'compliance_recommendation';
  title: string;
  description: string;
  action_plan: ActionPlanStep[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

export interface ContractMonitoringMetrics {
  totalContracts: number;
  activeContracts: number;
  expiringSoon: number;
  atRiskContracts: number;
  totalValue: number;
  avgConsumption: number;
  openIssues: number;
  criticalIssues: number;
}

export class ContractMonitoringService {
  static async getAllContracts(): Promise<ContractMonitoring[]> {
    const { data, error } = await supabase
      .from('contract_monitoring')
      .select('*')
      .order('end_date', { ascending: true });

    if (error) {
      console.error('Error fetching contracts:', error);
      return this.getMockContracts();
    }

    return data || this.getMockContracts();
  }

  static async getContractById(contractId: string): Promise<ContractMonitoring | null> {
    const { data, error } = await supabase
      .from('contract_monitoring')
      .select('*')
      .eq('contract_id', contractId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching contract:', error);
      const mockContracts = this.getMockContracts();
      return mockContracts.find(c => c.contract_id === contractId) || null;
    }

    return data;
  }

  static async getContractsByStatus(status: string): Promise<ContractMonitoring[]> {
    const { data, error } = await supabase
      .from('contract_monitoring')
      .select('*')
      .eq('status', status)
      .order('end_date', { ascending: true });

    if (error) {
      console.error('Error fetching contracts by status:', error);
      return this.getMockContracts().filter(c => c.status === status);
    }

    return data || this.getMockContracts().filter(c => c.status === status);
  }

  static async getComplianceIssues(contractId?: string): Promise<ContractComplianceIssue[]> {
    let query = supabase
      .from('contract_compliance_issues')
      .select('*')
      .order('detected_date', { ascending: false });

    if (contractId) {
      query = query.eq('contract_id', contractId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching compliance issues:', error);
      const mockIssues = this.getMockComplianceIssues();
      return contractId ? mockIssues.filter(i => i.contract_id === contractId) : mockIssues;
    }

    return data || [];
  }

  static async getInsights(contractId?: string): Promise<ContractInsight[]> {
    let query = supabase
      .from('contract_insights')
      .select('*')
      .order('created_at', { ascending: false });

    if (contractId) {
      query = query.eq('contract_id', contractId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching insights:', error);
      const mockInsights = this.getMockInsights();
      return contractId ? mockInsights.filter(i => i.contract_id === contractId) : mockInsights;
    }

    return data || [];
  }

  static async getMetrics(): Promise<ContractMonitoringMetrics> {
    const contracts = await this.getAllContracts();
    const issues = await this.getComplianceIssues();

    const totalContracts = contracts.length;
    const activeContracts = contracts.filter(c => c.status === 'active').length;
    const expiringSoon = contracts.filter(c => c.status === 'expiring_soon').length;
    const atRiskContracts = contracts.filter(c => c.status === 'at_risk').length;
    const totalValue = contracts.reduce((sum, c) => sum + c.contract_value, 0);
    const avgConsumption = contracts.length > 0
      ? contracts.reduce((sum, c) => sum + c.consumption_percentage, 0) / contracts.length
      : 0;
    const openIssues = issues.filter(i => i.status === 'open' || i.status === 'under_review').length;
    const criticalIssues = issues.filter(i => i.severity === 'critical' || i.severity === 'high').length;

    return {
      totalContracts,
      activeContracts,
      expiringSoon,
      atRiskContracts,
      totalValue,
      avgConsumption,
      openIssues,
      criticalIssues
    };
  }

  static getDaysUntilExpiry(endDate: string): number {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  static getConsumptionStatus(percentage: number): {
    status: string;
    color: string;
    label: string;
  } {
    if (percentage >= 90) {
      return { status: 'critical', color: 'red', label: 'Critical' };
    } else if (percentage >= 75) {
      return { status: 'warning', color: 'orange', label: 'Warning' };
    } else if (percentage >= 50) {
      return { status: 'normal', color: 'blue', label: 'Normal' };
    } else {
      return { status: 'low', color: 'green', label: 'Low Usage' };
    }
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  static getMockContracts(): ContractMonitoring[] {
    return mockContracts;
  }

  static getMockComplianceIssues(): ContractComplianceIssue[] {
    return mockComplianceIssues;
  }

  static getMockInsights(): ContractInsight[] {
    return mockInsights;
  }
}
