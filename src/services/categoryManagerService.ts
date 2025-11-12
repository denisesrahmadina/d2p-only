import mockData from '../data/categoryManagerMockData.json';

export interface Category {
  id: string;
  category_code: string;
  category_name: string;
  parent_category_code: string | null;
  level: number;
  classification: 'Centralized' | 'Decentralized' | 'Pending';
  classification_rationale: string | null;
  total_annual_spend: number;
  business_units_count: number;
  vendor_count: number;
  strategic_importance: 'High' | 'Medium' | 'Low' | null;
  dataset_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface SKU {
  id: string;
  sku_code: string;
  sku_name: string;
  category_code: string;
  unit_of_measure: string;
  standard_price: number | null;
  lead_time_days: number | null;
  criticality: 'Critical' | 'Important' | 'Standard' | null;
  substitution_available: boolean;
  dataset_id: string;
  organization_id: string;
}

export interface SpendSummary {
  id: string;
  category_code: string;
  business_unit: string;
  fiscal_year: number;
  fiscal_quarter: number;
  total_spend: number;
  contract_coverage_pct: number;
  maverick_spend_pct: number;
  vendor_count: number;
  po_count: number;
  avg_po_value: number | null;
  dataset_id: string;
  organization_id: string;
}

export interface SupplierPerformance {
  id: string;
  vendor_id: string;
  vendor_name: string;
  category_code: string;
  evaluation_period: string;
  delivery_score: number;
  quality_score: number;
  cost_score: number;
  collaboration_score: number;
  overall_score: number;
  total_po_value: number;
  on_time_delivery_pct: number | null;
  defect_rate_ppm: number | null;
  dataset_id: string;
  organization_id: string;
}

export interface SupplierFeedback {
  id: string;
  vendor_id: string;
  vendor_name: string;
  category_code: string;
  feedback_date: string;
  feedback_type: 'Payment' | 'Forecasting' | 'Collaboration' | 'Process' | 'Quality' | 'General';
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  feedback_text: string;
  action_required: boolean;
  action_taken: string | null;
  dataset_id: string;
  organization_id: string;
}

export interface MarketIntelligence {
  id: string;
  category_code: string;
  reference_period: string;
  supply_demand_balance: 'Tight' | 'Balanced' | 'Surplus';
  price_trend: 'Rising' | 'Stable' | 'Declining';
  price_volatility_index: number;
  capacity_utilization_pct: number | null;
  innovation_index: number;
  market_concentration: 'High' | 'Medium' | 'Low';
  supply_risk_score: number;
  forecasted_growth_pct: number | null;
  key_insights: string | null;
  dataset_id: string;
  organization_id: string;
}

export interface KraljicMatrix {
  id: string;
  category_code: string;
  profit_impact_score: number;
  supply_risk_score: number;
  kraljic_quadrant: 'Strategic' | 'Leverage' | 'Bottleneck' | 'Routine';
  calculation_method: string;
  manual_override: boolean;
  override_rationale: string | null;
  approved_by: string | null;
  approved_at: string | null;
  dataset_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryStrategy {
  id: string;
  category_code: string;
  kraljic_quadrant: string;
  strategic_lever: string;
  lever_description: string | null;
  impact_score: number | null;
  implementation_complexity: 'Low' | 'Medium' | 'High' | null;
  forecasted_savings_pct: number | null;
  forecasted_savings_amount: number | null;
  implementation_timeline: string | null;
  status: 'Proposed' | 'Under Review' | 'Approved' | 'In Progress' | 'Completed';
  approved_by: string | null;
  approved_at: string | null;
  dataset_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryActionPlan {
  id: string;
  category_code: string;
  action_type: 'Supplier Development' | 'Rationalization' | 'Cost Optimization' | 'Innovation' | 'Process Improvement' | 'Risk Mitigation';
  action_title: string;
  action_description: string;
  source_analysis: 'Internal' | 'External' | 'VoC' | 'VoS' | 'AI Generated';
  priority: 'Critical' | 'High' | 'Medium' | 'Low' | null;
  owner: string | null;
  target_completion_date: string | null;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
  expected_impact_amount: number | null;
  actual_impact_amount: number | null;
  kpi_linkage: string | null;
  dataset_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryAIInsight {
  id: string;
  category_code: string | null;
  insight_type: 'Predictive' | 'Prescriptive' | 'Explanatory' | 'Diagnostic';
  insight_title: string;
  insight_description: string;
  confidence_score: number;
  financial_impact_estimate: number | null;
  risk_level: 'Low' | 'Moderate' | 'Critical';
  ai_source_type: string;
  key_variables: any;
  user_action: 'Pending' | 'Accepted' | 'Rejected' | 'Deferred';
  user_comment: string | null;
  dataset_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  totalAnnualSpend: number;
  strategicSpendRatio: number;
  centralizedSpendPct: number;
  supplierPerformanceIndex: number;
  savingsOpportunitiesPct: number;
  supplierConcentrationIndex: number;
  crossBUDuplicationPct: number;
  forecastedGrowthPct: number;
  categoryCount: number;
  vendorCount: number;
  contractCoveragePct: number;
  maverickSpendPct: number;
}

export interface CategorySpendData {
  category_name: string;
  total_spend: number;
  percentage: number;
}

export interface CategoryPortfolioItem {
  category_code: string;
  category_name: string;
  total_spend: number;
  risk_score: number;
  vendor_count: number;
  classification: string;
  kraljic_quadrant: string | null;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class CategoryManagerService {
  static async getDashboardMetrics(datasetId: string, organizationId: string): Promise<DashboardMetrics> {
    await delay(250);

    const categories = mockData.categories.filter(
      c => c.dataset_id === datasetId && c.organization_id === organizationId
    );
    const spendData = mockData.spendSummary.filter(
      s => s.dataset_id === datasetId && s.organization_id === organizationId
    );
    const supplierPerf = mockData.supplierPerformance.filter(
      s => s.dataset_id === datasetId && s.organization_id === organizationId
    );
    const miData = mockData.marketIntelligence.filter(
      m => m.dataset_id === datasetId && m.organization_id === organizationId
    );

    const totalAnnualSpend = categories.reduce((sum, cat) => sum + (cat.total_annual_spend || 0), 0);
    const strategicCategories = categories.filter(c => c.strategic_importance === 'High');
    const strategicSpend = strategicCategories.reduce((sum, cat) => sum + (cat.total_annual_spend || 0), 0);
    const centralizedCategories = categories.filter(c => c.classification === 'Centralized');
    const centralizedSpend = centralizedCategories.reduce((sum, cat) => sum + (cat.total_annual_spend || 0), 0);

    const avgSupplierScore = supplierPerf.length > 0
      ? supplierPerf.reduce((sum, s) => sum + s.overall_score, 0) / supplierPerf.length
      : 0;

    const totalSpend = spendData.reduce((sum, s) => sum + s.total_spend, 0);
    const contractedSpend = spendData.reduce((sum, s) => sum + (s.total_spend * s.contract_coverage_pct / 100), 0);
    const maverickSpend = spendData.reduce((sum, s) => sum + (s.total_spend * s.maverick_spend_pct / 100), 0);

    const avgGrowth = miData.length > 0
      ? miData.reduce((sum, m) => sum + (m.forecasted_growth_pct || 0), 0) / miData.length
      : 0;

    const uniqueVendors = new Set(supplierPerf.map(s => s.vendor_id)).size;

    const top5Vendors = supplierPerf
      .sort((a, b) => b.total_po_value - a.total_po_value)
      .slice(0, 5);
    const top5Spend = top5Vendors.reduce((sum, v) => sum + v.total_po_value, 0);
    const totalSupplierSpend = supplierPerf.reduce((sum, v) => sum + v.total_po_value, 0);
    const concentrationIndex = totalSupplierSpend > 0 ? (top5Spend / totalSupplierSpend) * 100 : 0;

    return {
      totalAnnualSpend,
      strategicSpendRatio: totalAnnualSpend > 0 ? (strategicSpend / totalAnnualSpend) * 100 : 0,
      centralizedSpendPct: totalAnnualSpend > 0 ? (centralizedSpend / totalAnnualSpend) * 100 : 0,
      supplierPerformanceIndex: avgSupplierScore,
      savingsOpportunitiesPct: 100 - ((contractedSpend / totalSpend) * 100),
      supplierConcentrationIndex: concentrationIndex,
      crossBUDuplicationPct: 8.5,
      forecastedGrowthPct: avgGrowth,
      categoryCount: categories.length,
      vendorCount: uniqueVendors,
      contractCoveragePct: totalSpend > 0 ? (contractedSpend / totalSpend) * 100 : 0,
      maverickSpendPct: totalSpend > 0 ? (maverickSpend / totalSpend) * 100 : 0,
    };
  }

  static async getCategorySpendPyramid(datasetId: string, organizationId: string, limit: number = 10): Promise<CategorySpendData[]> {
    await delay(200);

    const categories = mockData.categories
      .filter(c => c.dataset_id === datasetId && c.organization_id === organizationId)
      .sort((a, b) => b.total_annual_spend - a.total_annual_spend)
      .slice(0, limit);

    const totalSpend = categories.reduce((sum, cat) => sum + cat.total_annual_spend, 0);

    return categories.map(cat => ({
      category_name: cat.category_name,
      total_spend: cat.total_annual_spend,
      percentage: totalSpend > 0 ? (cat.total_annual_spend / totalSpend) * 100 : 0,
    }));
  }

  static async getCategoryPortfolioMap(datasetId: string, organizationId: string): Promise<CategoryPortfolioItem[]> {
    await delay(220);

    const categories = mockData.categories.filter(
      c => c.dataset_id === datasetId && c.organization_id === organizationId && c.level >= 2
    );

    const kraljicData = mockData.kraljicMatrix;
    const miData = mockData.marketIntelligence;

    return categories.map((cat) => {
      const kraljic = kraljicData.find(k => k.category_code === cat.category_code);
      const mi = miData.find(m => m.category_code === cat.category_code);

      return {
        category_code: cat.category_code,
        category_name: cat.category_name,
        total_spend: cat.total_annual_spend,
        risk_score: mi?.supply_risk_score || kraljic?.supply_risk_score || 5,
        vendor_count: cat.vendor_count,
        classification: cat.classification,
        kraljic_quadrant: kraljic?.kraljic_quadrant || null,
      };
    });
  }

  static async getAllCategories(datasetId: string, organizationId: string): Promise<Category[]> {
    await delay(180);

    return mockData.categories
      .filter(c => c.dataset_id === datasetId && c.organization_id === organizationId)
      .sort((a, b) => a.category_code.localeCompare(b.category_code));
  }

  static async updateCategoryClassification(
    categoryCode: string,
    classification: 'Centralized' | 'Decentralized',
    rationale: string,
    datasetId: string
  ): Promise<void> {
    await delay(150);

    const category = mockData.categories.find(
      c => c.category_code === categoryCode && c.dataset_id === datasetId
    );

    if (category) {
      category.classification = classification;
      category.classification_rationale = rationale;
      category.updated_at = new Date().toISOString();
    }
  }

  static async getKraljicMatrix(datasetId: string, organizationId: string): Promise<KraljicMatrix[]> {
    await delay(180);

    return mockData.kraljicMatrix.filter(
      k => k.dataset_id === datasetId && k.organization_id === organizationId
    );
  }

  static async updateKraljicPosition(
    categoryCode: string,
    profitImpact: number,
    supplyRisk: number,
    quadrant: string,
    rationale: string,
    datasetId: string
  ): Promise<void> {
    await delay(150);

    const kraljic = mockData.kraljicMatrix.find(
      k => k.category_code === categoryCode && k.dataset_id === datasetId
    );

    if (kraljic) {
      kraljic.profit_impact_score = profitImpact;
      kraljic.supply_risk_score = supplyRisk;
      kraljic.kraljic_quadrant = quadrant as any;
      kraljic.manual_override = true;
      kraljic.override_rationale = rationale;
      kraljic.updated_at = new Date().toISOString();
    }
  }

  static async getCategoryStrategies(datasetId: string, organizationId: string): Promise<CategoryStrategy[]> {
    await delay(200);

    return mockData.categoryStrategies
      .filter(s => s.dataset_id === datasetId && s.organization_id === organizationId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async updateStrategyStatus(
    strategyId: string,
    status: string,
    approvedBy: string | null
  ): Promise<void> {
    await delay(150);

    const strategy = mockData.categoryStrategies.find(s => s.id === strategyId);

    if (strategy) {
      strategy.status = status as any;
      strategy.updated_at = new Date().toISOString();

      if (approvedBy) {
        strategy.approved_by = approvedBy;
        strategy.approved_at = new Date().toISOString();
      }
    }
  }

  static async getCategoryActionPlans(
    datasetId: string,
    organizationId: string,
    filters?: { source?: string; status?: string; priority?: string }
  ): Promise<CategoryActionPlan[]> {
    await delay(190);

    let plans = mockData.categoryActionPlans.filter(
      p => p.dataset_id === datasetId && p.organization_id === organizationId
    );

    if (filters?.source) {
      plans = plans.filter(p => p.source_analysis === filters.source);
    }
    if (filters?.status) {
      plans = plans.filter(p => p.status === filters.status);
    }
    if (filters?.priority) {
      plans = plans.filter(p => p.priority === filters.priority);
    }

    return plans.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async getSupplierPerformance(datasetId: string, organizationId: string): Promise<SupplierPerformance[]> {
    await delay(200);

    return mockData.supplierPerformance
      .filter(s => s.dataset_id === datasetId && s.organization_id === organizationId)
      .sort((a, b) => b.overall_score - a.overall_score);
  }

  static async getSupplierFeedback(datasetId: string, organizationId: string): Promise<SupplierFeedback[]> {
    await delay(180);

    return mockData.supplierFeedback
      .filter(f => f.dataset_id === datasetId && f.organization_id === organizationId)
      .sort((a, b) => new Date(b.feedback_date).getTime() - new Date(a.feedback_date).getTime());
  }

  static async getMarketIntelligence(datasetId: string, organizationId: string): Promise<MarketIntelligence[]> {
    await delay(200);

    return mockData.marketIntelligence.filter(
      m => m.dataset_id === datasetId && m.organization_id === organizationId
    );
  }

  static async getSpendSummary(datasetId: string, organizationId: string): Promise<SpendSummary[]> {
    await delay(190);

    return mockData.spendSummary
      .filter(s => s.dataset_id === datasetId && s.organization_id === organizationId)
      .sort((a, b) => b.total_spend - a.total_spend);
  }

  static formatCurrency(value: number): string {
    if (value >= 1000000000000) {
      return `Rp ${(value / 1000000000000).toFixed(1)}T`;
    } else if (value >= 1000000000) {
      return `Rp ${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}M`;
    }
    return `Rp ${value.toLocaleString('id-ID')}`;
  }

  static calculateKraljicQuadrant(profitImpact: number, supplyRisk: number): string {
    if (profitImpact >= 65 && supplyRisk >= 65) return 'Strategic';
    if (profitImpact >= 65 && supplyRisk < 65) return 'Leverage';
    if (profitImpact < 65 && supplyRisk >= 65) return 'Bottleneck';
    return 'Routine';
  }

  static getQuadrantColor(quadrant: string): string {
    const colors: Record<string, string> = {
      Strategic: 'bg-red-100 text-red-700 border-red-300',
      Leverage: 'bg-green-100 text-green-700 border-green-300',
      Bottleneck: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      Routine: 'bg-blue-100 text-blue-700 border-blue-300',
    };
    return colors[quadrant] || 'bg-gray-100 text-gray-700 border-gray-300';
  }

  static getClassificationColor(classification: string): string {
    const colors: Record<string, string> = {
      Centralized: 'bg-purple-100 text-purple-700 border-purple-300',
      Decentralized: 'bg-teal-100 text-teal-700 border-teal-300',
      Pending: 'bg-gray-100 text-gray-700 border-gray-300',
    };
    return colors[classification] || 'bg-gray-100 text-gray-700 border-gray-300';
  }
}
