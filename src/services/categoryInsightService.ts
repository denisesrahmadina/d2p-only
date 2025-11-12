import mockData from '../data/categoryManagerMockData.json';
import { CategoryAIInsight } from './categoryManagerService';

export interface InsightWithCategory extends CategoryAIInsight {
  category_name?: string;
}

export interface InsightSimulation {
  best_case: number;
  expected_case: number;
  worst_case: number;
  implementation_months: number;
  resource_requirements: string[];
  risk_factors: string[];
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class CategoryInsightService {
  static async getAllInsights(
    datasetId: string,
    organizationId: string,
    filters?: { type?: string; risk_level?: string; user_action?: string }
  ): Promise<InsightWithCategory[]> {
    await delay(200);

    let insights = mockData.aiInsights.filter(
      i => i.dataset_id === datasetId && i.organization_id === organizationId
    );

    if (filters?.type) {
      insights = insights.filter(i => i.insight_type === filters.type);
    }
    if (filters?.risk_level) {
      insights = insights.filter(i => i.risk_level === filters.risk_level);
    }
    if (filters?.user_action) {
      insights = insights.filter(i => i.user_action === filters.user_action);
    }

    return insights
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((insight: any) => {
        const category = mockData.categories.find(c => c.category_code === insight.category_code);
        return {
          ...insight,
          category_name: category?.category_name || 'Cross-Category',
        };
      });
  }

  static async getInsightsByCategory(
    categoryCode: string,
    datasetId: string,
    organizationId: string
  ): Promise<CategoryAIInsight[]> {
    await delay(180);

    return mockData.aiInsights
      .filter(
        i => i.category_code === categoryCode &&
             i.dataset_id === datasetId &&
             i.organization_id === organizationId
      )
      .sort((a, b) => b.confidence_score - a.confidence_score);
  }

  static async updateInsightAction(
    insightId: string,
    action: 'Accepted' | 'Rejected' | 'Deferred',
    comment?: string
  ): Promise<void> {
    await delay(150);

    const insight = mockData.aiInsights.find(i => i.id === insightId);

    if (insight) {
      insight.user_action = action;
      insight.user_comment = comment || null;
      insight.updated_at = new Date().toISOString();
    }
  }

  static simulateInsightOutcome(insight: CategoryAIInsight): InsightSimulation {
    const baseImpact = insight.financial_impact_estimate || 0;
    const confidence = insight.confidence_score / 100;

    let expectedCase = baseImpact * confidence;
    let bestCase = baseImpact * Math.min(confidence + 0.25, 1);
    let worstCase = baseImpact * Math.max(confidence - 0.3, 0.3);

    let implementationMonths = 12;
    const resourceReqs: string[] = [];
    const riskFactors: string[] = [];

    switch (insight.insight_type) {
      case 'Predictive':
        implementationMonths = 3;
        resourceReqs.push('Data Analytics Team', 'Procurement Planner');
        riskFactors.push('Market condition changes', 'Forecast accuracy limitations');
        break;
      case 'Prescriptive':
        implementationMonths = 18;
        resourceReqs.push('Category Manager', 'Legal Team', 'Supplier Relations', 'Change Management');
        riskFactors.push('Stakeholder resistance', 'Implementation complexity', 'Supplier collaboration required');
        break;
      case 'Diagnostic':
        implementationMonths = 6;
        resourceReqs.push('Process Improvement Team', 'Category Manager');
        riskFactors.push('Root cause validation', 'Data quality dependencies');
        break;
      case 'Explanatory':
        implementationMonths = 9;
        resourceReqs.push('Business Analyst', 'Category Manager', 'Operations Team');
        riskFactors.push('Process change adoption', 'Cross-functional coordination');
        break;
    }

    if (insight.risk_level === 'Critical') {
      riskFactors.push('High business impact if not addressed', 'Time-sensitive action required');
      implementationMonths = Math.max(implementationMonths - 3, 3);
    }

    if (insight.key_variables) {
      const vars = insight.key_variables;
      if (typeof vars === 'object') {
        Object.keys(vars).forEach(key => {
          if (key.includes('supplier') || key.includes('vendor')) {
            resourceReqs.push('Supplier Management Team');
          }
          if (key.includes('technology') || key.includes('system')) {
            resourceReqs.push('IT Department');
          }
          if (key.includes('compliance') || key.includes('regulatory')) {
            resourceReqs.push('Compliance Team');
          }
        });
      }
    }

    return {
      best_case: Math.round(bestCase),
      expected_case: Math.round(expectedCase),
      worst_case: Math.round(worstCase),
      implementation_months: implementationMonths,
      resource_requirements: [...new Set(resourceReqs)],
      risk_factors: [...new Set(riskFactors)],
    };
  }

  static getInsightTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      Predictive: '🔮',
      Prescriptive: '💡',
      Explanatory: '📊',
      Diagnostic: '🔍',
    };
    return icons[type] || '📌';
  }

  static getRiskLevelColor(level: string): { bg: string; text: string; border: string } {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      Critical: {
        bg: 'bg-red-50 dark:bg-red-950/30',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
      },
      Moderate: {
        bg: 'bg-yellow-50 dark:bg-yellow-950/30',
        text: 'text-yellow-700 dark:text-yellow-400',
        border: 'border-yellow-200 dark:border-yellow-800',
      },
      Low: {
        bg: 'bg-green-50 dark:bg-green-950/30',
        text: 'text-green-700 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800',
      },
    };
    return colors[level] || colors.Low;
  }

  static getInsightTypeColor(type: string): { bg: string; text: string } {
    const colors: Record<string, { bg: string; text: string }> = {
      Predictive: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
      Prescriptive: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
      Explanatory: { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-400' },
      Diagnostic: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400' },
    };
    return colors[type] || { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400' };
  }

  static getActionStatusBadge(action: string): { bg: string; text: string; label: string } {
    const statuses: Record<string, { bg: string; text: string; label: string }> = {
      Pending: {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-700 dark:text-gray-300',
        label: 'Pending Review',
      },
      Accepted: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        label: 'Accepted',
      },
      Rejected: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        label: 'Rejected',
      },
      Deferred: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-400',
        label: 'Deferred',
      },
    };
    return statuses[action] || statuses.Pending;
  }

  static formatConfidenceScore(score: number): string {
    if (score >= 90) return 'Very High';
    if (score >= 80) return 'High';
    if (score >= 70) return 'Moderate';
    if (score >= 60) return 'Fair';
    return 'Low';
  }

  static getRecommendedActions(insight: CategoryAIInsight): string[] {
    const actions: string[] = [];

    if (insight.risk_level === 'Critical') {
      actions.push('Immediate review with Category Manager required');
      actions.push('Escalate to Procurement Head if action needed');
    }

    if (insight.financial_impact_estimate && insight.financial_impact_estimate > 1000000000) {
      actions.push('Conduct detailed financial analysis');
      actions.push('Prepare business case for approval');
    }

    if (insight.confidence_score >= 85) {
      actions.push('High confidence - prioritize for implementation');
    } else if (insight.confidence_score < 70) {
      actions.push('Validate insight with additional data analysis');
    }

    switch (insight.insight_type) {
      case 'Predictive':
        actions.push('Monitor market conditions for validation');
        actions.push('Set up early warning indicators');
        break;
      case 'Prescriptive':
        actions.push('Develop detailed implementation roadmap');
        actions.push('Identify required resources and stakeholders');
        break;
      case 'Diagnostic':
        actions.push('Validate root cause analysis');
        actions.push('Implement corrective actions');
        break;
      case 'Explanatory':
        actions.push('Share insights with relevant stakeholders');
        actions.push('Document learnings for future reference');
        break;
    }

    return actions;
  }

  static async createAuditLog(
    categoryCode: string | null,
    actionType: string,
    actionDescription: string,
    userId: string,
    userName: string,
    beforeValue: any,
    afterValue: any,
    datasetId: string,
    organizationId: string
  ): Promise<void> {
    await delay(100);

    console.log('Audit log created:', {
      categoryCode,
      actionType,
      actionDescription,
      userId,
      userName,
      datasetId,
      organizationId,
      timestamp: new Date().toISOString()
    });
  }
}
