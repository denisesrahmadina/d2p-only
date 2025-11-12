export interface AIInsight {
  id: string;
  module: string;
  page: string;
  view_mode?: string;
  context_id?: string;
  insight_type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  risk_category: string;
  title: string;
  description: string;
  affected_section?: string;
  key_metrics: Record<string, any>;
  action_plan: string[];
  confidence_score: number;
  auto_generated: boolean;
  user_action: 'Pending' | 'Acknowledged' | 'Dismissed' | 'Applied' | 'In_Progress';
  acknowledged_by?: string;
  acknowledged_at?: string;
  user_comment?: string;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}

// Mock data for AI Insights
const mockInsights: AIInsight[] = [
  {
    id: '1',
    module: 'Procurement',
    page: 'PurchaseOrders',
    view_mode: 'list',
    insight_type: 'Cost_Optimization',
    severity: 'High',
    risk_category: 'Financial',
    title: 'Potential Cost Savings on Material Orders',
    description: 'Analysis shows that consolidating orders from Supplier A could reduce costs by 15% through volume discounts.',
    affected_section: 'Purchase Orders List',
    key_metrics: {
      potential_savings: '$45,000',
      affected_orders: 12,
      confidence: 0.87
    },
    action_plan: [
      'Review current purchase order patterns',
      'Negotiate volume discount with Supplier A',
      'Consolidate orders for Q1 2025',
      'Monitor savings achievement'
    ],
    confidence_score: 0.87,
    auto_generated: true,
    user_action: 'Pending',
    organization_id: 'org-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    module: 'Procurement',
    page: 'Suppliers',
    insight_type: 'Risk',
    severity: 'Critical',
    risk_category: 'Supply Chain',
    title: 'High Risk Supplier Detected',
    description: 'Supplier B has shown declining on-time delivery rates (62%) and quality issues in recent months.',
    affected_section: 'Supplier Performance',
    key_metrics: {
      on_time_delivery: '62%',
      quality_score: '73%',
      risk_score: 'High'
    },
    action_plan: [
      'Schedule immediate supplier review meeting',
      'Identify alternative suppliers',
      'Implement enhanced monitoring',
      'Consider contract renegotiation'
    ],
    confidence_score: 0.92,
    auto_generated: true,
    user_action: 'Acknowledged',
    acknowledged_by: 'john.doe@example.com',
    acknowledged_at: new Date(Date.now() - 86400000).toISOString(),
    organization_id: 'org-1',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    module: 'Procurement',
    page: 'Invoices',
    insight_type: 'Compliance',
    severity: 'Medium',
    risk_category: 'Regulatory',
    title: 'Invoice Processing Delays',
    description: 'Average invoice processing time has increased to 8.5 days, exceeding the target of 5 days.',
    key_metrics: {
      current_avg: '8.5 days',
      target: '5 days',
      affected_invoices: 23
    },
    action_plan: [
      'Review approval workflow bottlenecks',
      'Implement automated matching rules',
      'Train staff on new system features',
      'Set up automated reminders'
    ],
    confidence_score: 0.81,
    auto_generated: true,
    user_action: 'In_Progress',
    acknowledged_by: 'jane.smith@example.com',
    acknowledged_at: new Date(Date.now() - 43200000).toISOString(),
    user_comment: 'Working on workflow optimization',
    organization_id: 'org-1',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString()
  },
  {
    id: '4',
    module: 'Procurement',
    page: 'Contracts',
    insight_type: 'Strategic',
    severity: 'Low',
    risk_category: 'Planning',
    title: 'Contract Renewal Opportunity',
    description: '3 contracts expiring in next 60 days present opportunity for better terms negotiation.',
    key_metrics: {
      expiring_contracts: 3,
      total_value: '$120,000',
      renewal_potential: 'High'
    },
    action_plan: [
      'Review current contract terms',
      'Benchmark market rates',
      'Prepare negotiation strategy',
      'Schedule renewal discussions'
    ],
    confidence_score: 0.78,
    auto_generated: true,
    user_action: 'Pending',
    organization_id: 'org-1',
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: '5',
    module: 'Inventory',
    page: 'Dashboard',
    insight_type: 'Quality',
    severity: 'High',
    risk_category: 'Operations',
    title: 'Inventory Turnover Below Target',
    description: 'Several business units showing inventory turnover ratios below 7x, indicating potential overstocking.',
    key_metrics: {
      affected_units: 14,
      avg_turnover: '5.2x',
      target: '7x'
    },
    action_plan: [
      'Analyze slow-moving inventory',
      'Implement just-in-time ordering',
      'Review demand forecasting accuracy',
      'Consider promotions for excess stock'
    ],
    confidence_score: 0.85,
    auto_generated: true,
    user_action: 'Applied',
    acknowledged_by: 'admin@example.com',
    acknowledged_at: new Date(Date.now() - 604800000).toISOString(),
    user_comment: 'Implemented new ordering policies',
    organization_id: 'org-1',
    created_at: new Date(Date.now() - 864000000).toISOString(),
    updated_at: new Date(Date.now() - 604800000).toISOString()
  }
];

export interface AIInsightFilters {
  module?: string;
  page?: string;
  view_mode?: string;
  context_id?: string;
  insight_type?: string;
  severity?: string;
  user_action?: string;
}

class AIInsightsService {
  async getInsights(filters: AIInsightFilters): Promise<AIInsight[]> {
    try {
      // Use mock data instead of Supabase
      let filteredInsights = [...mockInsights];

      if (filters.module) {
        filteredInsights = filteredInsights.filter(insight => insight.module === filters.module);
      }
      if (filters.page) {
        filteredInsights = filteredInsights.filter(insight => insight.page === filters.page);
      }
      if (filters.view_mode) {
        filteredInsights = filteredInsights.filter(insight => insight.view_mode === filters.view_mode);
      }
      if (filters.context_id) {
        filteredInsights = filteredInsights.filter(insight => insight.context_id === filters.context_id);
      }
      if (filters.insight_type) {
        filteredInsights = filteredInsights.filter(insight => insight.insight_type === filters.insight_type);
      }
      if (filters.severity) {
        filteredInsights = filteredInsights.filter(insight => insight.severity === filters.severity);
      }
      if (filters.user_action) {
        filteredInsights = filteredInsights.filter(insight => insight.user_action === filters.user_action);
      }

      // Sort by severity and created_at
      const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      filteredInsights.sort((a, b) => {
        const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
        if (severityDiff !== 0) return severityDiff;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      return filteredInsights;
    } catch (error) {
      console.error('Error in getInsights:', error);
      return [];
    }
  }

  async getInsightById(id: string): Promise<AIInsight | null> {
    try {
      const insight = mockInsights.find(insight => insight.id === id);
      return insight || null;
    } catch (error) {
      console.error('Error in getInsightById:', error);
      return null;
    }
  }

  async updateInsightAction(
    id: string,
    action: 'Acknowledged' | 'Dismissed' | 'Applied' | 'In_Progress',
    acknowledgedBy?: string,
    comment?: string
  ): Promise<boolean> {
    try {
      const insight = mockInsights.find(insight => insight.id === id);
      
      if (!insight) {
        return false;
      }

      insight.user_action = action;
      insight.updated_at = new Date().toISOString();

      if (acknowledgedBy) {
        insight.acknowledged_by = acknowledgedBy;
        insight.acknowledged_at = new Date().toISOString();
      }

      if (comment !== undefined) {
        insight.user_comment = comment;
      }

      return true;
    } catch (error) {
      console.error('Error in updateInsightAction:', error);
      return false;
    }
  }

  async createInsight(insight: Omit<AIInsight, 'id' | 'created_at' | 'updated_at'>): Promise<AIInsight | null> {
    try {
      const newInsight: AIInsight = {
        ...insight,
        id: `insight-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      mockInsights.push(newInsight);
      return newInsight;
    } catch (error) {
      console.error('Error in createInsight:', error);
      return null;
    }
  }

  async deleteInsight(id: string): Promise<boolean> {
    try {
      const index = mockInsights.findIndex(insight => insight.id === id);
      
      if (index === -1) {
        return false;
      }

      mockInsights.splice(index, 1);
      return true;
    } catch (error) {
      console.error('Error in deleteInsight:', error);
      return false;
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'Critical':
        return 'red';
      case 'High':
        return 'orange';
      case 'Medium':
        return 'yellow';
      case 'Low':
        return 'green';
      default:
        return 'gray';
    }
  }

  getSeverityStyles(severity: string): { bg: string; text: string; border: string } {
    switch (severity) {
      case 'Critical':
        return {
          bg: 'bg-red-50 dark:bg-red-900/10',
          text: 'text-red-700 dark:text-red-400',
          border: 'border-red-200 dark:border-red-800',
        };
      case 'High':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/10',
          text: 'text-orange-700 dark:text-orange-400',
          border: 'border-orange-200 dark:border-orange-800',
        };
      case 'Medium':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/10',
          text: 'text-yellow-700 dark:text-yellow-400',
          border: 'border-yellow-200 dark:border-yellow-800',
        };
      case 'Low':
        return {
          bg: 'bg-green-50 dark:bg-green-900/10',
          text: 'text-green-700 dark:text-green-400',
          border: 'border-green-200 dark:border-green-800',
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-400',
          border: 'border-gray-200 dark:border-gray-700',
        };
    }
  }

  getInsightTypeIcon(type: string): string {
    switch (type) {
      case 'Pricing':
        return 'DollarSign';
      case 'Supplier':
        return 'Building2';
      case 'Negotiation':
        return 'Handshake';
      case 'Compliance':
        return 'ShieldCheck';
      case 'Risk':
        return 'AlertTriangle';
      case 'Quality':
        return 'Award';
      case 'Timeline':
        return 'Clock';
      case 'Strategic':
        return 'Target';
      case 'Cost_Optimization':
        return 'TrendingDown';
      case 'Market_Trend':
        return 'TrendingUp';
      default:
        return 'Info';
    }
  }
}

export const aiInsightsService = new AIInsightsService();
