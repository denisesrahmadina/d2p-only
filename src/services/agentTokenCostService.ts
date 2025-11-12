import agentTokenCostData from '../data/agentTokenCost.json';
import { ModelTokenPriceService, type ModelTokenPrice } from './modelTokenPriceService';

export interface TokenCostRecord {
  date: string;
  subAgentId: string;
  subAgentName: string;
  llmProvider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  tasksExecuted: number;
  avgTokensPerTask: number;
  costPerInputToken: number;
  costPerOutputToken: number;
  modelPricing: ModelTokenPrice | null;
  cachingUsed: boolean;
}

export interface AgentTokenCostData {
  agentId: string;
  organizationId: string;
  tokenCosts: TokenCostRecord[];
}

export interface TotalCostsResult {
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  totalInputCost: number;
  totalOutputCost: number;
  totalCost: number;
  totalTasks: number;
  avgCostPerTask: number;
  avgTokensPerTask: number;
  modelBreakdown: {
    [model: string]: {
      totalCost: number;
      totalTokens: number;
      avgCostPerToken: number;
      modelPricing: ModelTokenPrice | null;
    }
  };
  costOptimizationOpportunities: {
    potentialSavings: number;
    recommendedModel: string | null;
    currentAvgCostPerToken: number;
    optimizedAvgCostPerToken: number;
  };
}

export interface SubAgentCost {
  subAgentId: string;
  subAgentName: string;
  totalCost: number;
  totalTokens: number;
  tasksExecuted: number;
}

export interface ProviderCost {
  provider: string;
  totalCost: number;
  totalTokens: number;
  models: string[];
}

export interface CostTrend {
  date: string;
  totalCost: number;
  totalTokens: number;
}

export interface EfficiencyMetric {
  metric: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  percentageChange: number;
}

export class AgentTokenCostService {
  /**
   * Get all agent token cost data
   */
  static async getAgentTokenCosts(): Promise<AgentTokenCostData[]> {
    return agentTokenCostData as AgentTokenCostData[];
  }

  /**
   * Get token costs by agent ID
   */
  static async getTokenCostsByAgentId(agentId: string): Promise<AgentTokenCostData | undefined> {
    const tokenCosts = await this.getAgentTokenCosts();
    return tokenCosts.find(cost => cost.agentId === agentId);
  }

  /**
   * Get token cost records by agent ID
   */
  static async getTokenCostRecordsByAgentId(agentId: string): Promise<TokenCostRecord[]> {
    const agentTokenCost = await this.getTokenCostsByAgentId(agentId);
    return agentTokenCost?.tokenCosts || [];
  }

  /**
   * Get token costs by organization ID
   */
  static async getTokenCostsByOrganizationId(organizationId: string): Promise<AgentTokenCostData[]> {
    const tokenCosts = await this.getAgentTokenCosts();
    return tokenCosts.filter(cost => cost.organizationId === organizationId);
  }

  /**
   * Get token costs by sub-agent ID
   */
  static async getTokenCostsBySubAgentId(agentId: string, subAgentId: string): Promise<TokenCostRecord[]> {
    const records = await this.getTokenCostRecordsByAgentId(agentId);
    return records.filter(record => record.subAgentId === subAgentId);
  }

  /**
   * Get token costs by LLM provider
   */
  static async getTokenCostsByProvider(agentId: string, provider: string): Promise<TokenCostRecord[]> {
    const records = await this.getTokenCostRecordsByAgentId(agentId);
    return records.filter(record => 
      record.llmProvider.toLowerCase().includes(provider.toLowerCase())
    );
  }

  /**
   * Get token costs by date
   */
  static async getTokenCostsByDate(agentId: string, date: string): Promise<TokenCostRecord[]> {
    const records = await this.getTokenCostRecordsByAgentId(agentId);
    return records.filter(record => record.date === date);
  }

  /**
   * Get recent token costs (last N days)
   */
  static async getRecentTokenCosts(agentId: string, days: number = 7): Promise<TokenCostRecord[]> {
    const records = await this.getTokenCostRecordsByAgentId(agentId);
    // Sort by date (most recent first)
    records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Get unique dates and take the specified number of days
    const uniqueDates = [...new Set(records.map(r => r.date))];
    const recentDates = uniqueDates.slice(0, days);
    
    return records.filter(record => recentDates.includes(record.date));
  }

  /**
   * Get enhanced token costs with model pricing information
   */
  static async getEnhancedTokenCostsByAgentId(agentId: string): Promise<(TokenCostRecord & {
    costPerInputToken: number;
    costPerOutputToken: number;
    modelPricing: ModelTokenPrice | null;
    cachingUsed: boolean;
  })[]> {
    const records = await this.getTokenCostRecordsByAgentId(agentId);
    
    const enhancedRecords = await Promise.all(
      records.map(async (record) => {
        // Find model pricing information
        const modelPricing = await ModelTokenPriceService.findModelPrice(record.model);
        
        // Calculate cost per token
        const costPerInputToken = record.inputTokens > 0 ? record.inputCost / record.inputTokens : 0;
        const costPerOutputToken = record.outputTokens > 0 ? record.outputCost / record.outputTokens : 0;
        
        // Determine if caching was likely used (based on cost comparison)
        let cachingUsed = false;
        if (modelPricing && modelPricing.hasCaching && modelPricing.cachedInputPricePerMillion) {
          const expectedCachedCost = (record.inputTokens / 1000000) * modelPricing.cachedInputPricePerMillion;
          const tolerance = 0.0001; // Small tolerance for floating point comparison
          cachingUsed = Math.abs(record.inputCost - expectedCachedCost) < tolerance;
        }
        
        return {
          ...record,
          costPerInputToken: Math.round(costPerInputToken * 1000000) / 1000000,
          costPerOutputToken: Math.round(costPerOutputToken * 1000000) / 1000000,
          modelPricing,
          cachingUsed
        };
      })
    );
    
    return enhancedRecords;
  }

  /**
   * Get total costs for an agent
   */
  static async getTotalCosts(agentId: string, dateFrom?: string, dateTo?: string): Promise<TotalCostsResult> {

    let records = await this.getTokenCostRecordsByAgentId(agentId);
    const enhancedRecords = await this.getEnhancedTokenCostsByAgentId(agentId);
    
    // Apply date filters if provided
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      records = records.filter(record => new Date(record.date) >= fromDate);
    }
    
    if (dateTo) {
      const toDate = new Date(dateTo);
      records = records.filter(record => new Date(record.date) <= toDate);
    }

    const totals = records.reduce((acc, record) => ({
      totalInputTokens: acc.totalInputTokens + record.inputTokens,
      totalOutputTokens: acc.totalOutputTokens + record.outputTokens,
      totalTokens: acc.totalTokens + record.totalTokens,
      totalInputCost: acc.totalInputCost + record.inputCost,
      totalOutputCost: acc.totalOutputCost + record.outputCost,
      totalCost: acc.totalCost + record.totalCost,
      totalTasks: acc.totalTasks + record.tasksExecuted,
    }), {
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalTokens: 0,
      totalInputCost: 0,
      totalOutputCost: 0,
      totalCost: 0,
      totalTasks: 0,
    });

    // Calculate model breakdown
    const modelBreakdown: {
      [model: string]: {
        totalCost: number;
        totalTokens: number;
        avgCostPerToken: number;
        modelPricing: ModelTokenPrice | null;
      }
    } = {};
    enhancedRecords.forEach(record => {
      if (!modelBreakdown[record.model]) {
        modelBreakdown[record.model] = {
          totalCost: 0,
          totalTokens: 0,
          avgCostPerToken: 0,
          modelPricing: record.modelPricing
        };
      }
      
      modelBreakdown[record.model].totalCost += record.totalCost;
      modelBreakdown[record.model].totalTokens += record.totalTokens;
    });
    
    // Calculate average cost per token for each model
    Object.keys(modelBreakdown).forEach(model => {
      const breakdown = modelBreakdown[model];
      breakdown.avgCostPerToken = breakdown.totalTokens > 0 
        ? breakdown.totalCost / breakdown.totalTokens 
        : 0;
      breakdown.avgCostPerToken = Math.round(breakdown.avgCostPerToken * 1000000) / 1000000;
    });
    
    // Calculate cost optimization opportunities
    const currentAvgCostPerToken = totals.totalTokens > 0 ? totals.totalCost / totals.totalTokens : 0;
    
    // Find the most cost-effective model currently in use
    const modelCosts = Object.entries(modelBreakdown)
      .map(([model, data]) => ({ model, costPerToken: data.avgCostPerToken }))
      .sort((a, b) => a.costPerToken - b.costPerToken);
    
    const cheapestCurrentModel = modelCosts[0];
    const potentialSavings = cheapestCurrentModel 
      ? (currentAvgCostPerToken - cheapestCurrentModel.costPerToken) * totals.totalTokens
      : 0;

    return {
      ...totals,
      avgCostPerTask: totals.totalTasks > 0 ? totals.totalCost / totals.totalTasks : 0,
      avgTokensPerTask: totals.totalTasks > 0 ? totals.totalTokens / totals.totalTasks : 0,
      modelBreakdown,
      costOptimizationOpportunities: {
        potentialSavings: Math.round(potentialSavings * 100) / 100,
        recommendedModel: cheapestCurrentModel?.model || null,
        currentAvgCostPerToken: Math.round(currentAvgCostPerToken * 1000000) / 1000000,
        optimizedAvgCostPerToken: cheapestCurrentModel?.costPerToken || 0
      }
    };
  }

  /**
   * Get model pricing insights for an agent
   */
  static async getModelPricingInsights(agentId: string): Promise<{
    modelsUsed: string[];
    totalModelVariants: number;
    avgCostPerModel: { [model: string]: number };
    cachingOpportunities: {
      modelsWithCaching: string[];
      potentialCachingSavings: number;
    };
    providerDistribution: { [provider: string]: number };
    costEfficiencyRanking: {
      model: string;
      provider: string;
      costPerToken: number;
      totalUsage: number;
    }[];
  }> {
    const enhancedRecords = await this.getEnhancedTokenCostsByAgentId(agentId);
    
    // Get unique models and providers
    const modelsUsed = [...new Set(enhancedRecords.map(record => record.model))];
    const totalModelVariants = modelsUsed.length;
    
    // Calculate average cost per model
    const avgCostPerModel: { [model: string]: number } = {};
    modelsUsed.forEach(model => {
      const modelRecords = enhancedRecords.filter(record => record.model === model);
      const totalCost = modelRecords.reduce((sum, record) => sum + record.totalCost, 0);
      const totalTokens = modelRecords.reduce((sum, record) => sum + record.totalTokens, 0);
      avgCostPerModel[model] = totalTokens > 0 ? totalCost / totalTokens : 0;
    });
    
    // Identify caching opportunities
    const modelsWithCaching = enhancedRecords
      .filter(record => record.modelPricing?.hasCaching)
      .map(record => record.model);
    
    const uniqueModelsWithCaching = [...new Set(modelsWithCaching)];
    
    // Calculate potential caching savings
    let potentialCachingSavings = 0;
    for (const model of uniqueModelsWithCaching) {
      const modelRecords = enhancedRecords.filter(record => record.model === model && !record.cachingUsed);
      for (const record of modelRecords) {
        if (record.modelPricing?.cachedInputPricePerMillion) {
          const currentInputCost = record.inputCost;
          const cachedInputCost = (record.inputTokens / 1000000) * record.modelPricing.cachedInputPricePerMillion;
          potentialCachingSavings += currentInputCost - cachedInputCost;
        }
      }
    }
    
    // Provider distribution
    const providerDistribution: { [provider: string]: number } = {};
    enhancedRecords.forEach(record => {
      const provider = record.modelPricing?.provider || 'Unknown';
      providerDistribution[provider] = (providerDistribution[provider] || 0) + record.totalCost;
    });
    
    // Cost efficiency ranking
    const costEfficiencyRanking = modelsUsed.map(model => {
      const modelRecords = enhancedRecords.filter(record => record.model === model);
      const totalCost = modelRecords.reduce((sum, record) => sum + record.totalCost, 0);
      const totalTokens = modelRecords.reduce((sum, record) => sum + record.totalTokens, 0);
      const costPerToken = totalTokens > 0 ? totalCost / totalTokens : 0;
      const provider = modelRecords[0]?.modelPricing?.provider || 'Unknown';
      
      return {
        model,
        provider,
        costPerToken: Math.round(costPerToken * 1000000) / 1000000,
        totalUsage: totalTokens
      };
    }).sort((a, b) => a.costPerToken - b.costPerToken);
    
    return {
      modelsUsed,
      totalModelVariants,
      avgCostPerModel,
      cachingOpportunities: {
        modelsWithCaching: uniqueModelsWithCaching,
        potentialCachingSavings: Math.round(potentialCachingSavings * 100) / 100
      },
      providerDistribution,
      costEfficiencyRanking
    };
  }

  /**
   * Get costs by sub-agent for an agent
   */
  static async getCostsBySubAgent(agentId: string, date?: string): Promise<{
    subAgentId: string;
    subAgentName: string;
    totalCost: number;
    totalTokens: number;
    tasksExecuted: number;
    avgCostPerTask: number;
    llmProvider: string;
    model: string;
    modelPricing: ModelTokenPrice | null;
    costPerToken: number;
    cachingUsed: boolean;
  }[]> {
    let records = await this.getEnhancedTokenCostsByAgentId(agentId);
    
    // Filter by date if provided
    if (date) {
      records = records.filter(record => record.date === date);
    }

    // Group by sub-agent
    const subAgentMap = new Map<string, TokenCostRecord[]>();
    records.forEach(record => {
      const existing = subAgentMap.get(record.subAgentId) || [];
      subAgentMap.set(record.subAgentId, [...existing, record]);
    });

    // Calculate totals for each sub-agent
    return Array.from(subAgentMap.entries()).map(([subAgentId, subAgentRecords]) => {
      const totals = subAgentRecords.reduce((acc, record) => ({
        totalCost: acc.totalCost + record.totalCost,
        totalTokens: acc.totalTokens + record.totalTokens,
        tasksExecuted: acc.tasksExecuted + record.tasksExecuted,
      }), { totalCost: 0, totalTokens: 0, tasksExecuted: 0 });

      const firstRecord = subAgentRecords[0];
      const costPerToken = totals.totalTokens > 0 ? totals.totalCost / totals.totalTokens : 0;
      const cachingUsed = subAgentRecords.some(record => record.cachingUsed);
      
      return {
        subAgentId,
        subAgentName: firstRecord.subAgentName,
        totalCost: Math.round(totals.totalCost * 100) / 100,
        totalTokens: totals.totalTokens,
        tasksExecuted: totals.tasksExecuted,
        avgCostPerTask: totals.tasksExecuted > 0 ? 
          Math.round((totals.totalCost / totals.tasksExecuted) * 1000) / 1000 : 0,
        llmProvider: firstRecord.llmProvider,
        model: firstRecord.model,
        modelPricing: firstRecord.modelPricing,
        costPerToken: Math.round(costPerToken * 1000000) / 1000000,
        cachingUsed
      };
    }).sort((a, b) => b.totalCost - a.totalCost);
  }

  /**
   * Get cost optimization recommendations for an agent
   */
  static async getCostOptimizationRecommendations(agentId: string): Promise<{
    currentCosts: {
      totalCost: number;
      avgCostPerToken: number;
      modelsUsed: string[];
    };
    recommendations: {
      type: 'model_switch' | 'enable_caching' | 'optimize_usage';
      description: string;
      potentialSavings: number;
      implementation: string;
      riskLevel: 'Low' | 'Medium' | 'High';
    }[];
    estimatedMonthlySavings: number;
  }> {
    const enhancedRecords = await this.getEnhancedTokenCostsByAgentId(agentId);
    const totals = await this.getTotalCosts(agentId);
    
    const currentCosts = {
      totalCost: totals.totalCost,
      avgCostPerToken: totals.totalTokens > 0 ? totals.totalCost / totals.totalTokens : 0,
      modelsUsed: [...new Set(enhancedRecords.map(record => record.model))]
    };
    
    const recommendations: {
      type: 'model_switch' | 'enable_caching' | 'optimize_usage';
      description: string;
      potentialSavings: number;
      implementation: string;
      riskLevel: 'Low' | 'Medium' | 'High';
    }[] = [];
    let estimatedMonthlySavings = 0;
    
    // Check for caching opportunities
    const cachingOpportunities = enhancedRecords.filter(record => 
      record.modelPricing?.hasCaching && !record.cachingUsed
    );
    
    if (cachingOpportunities.length > 0) {
      let cachingSavings = 0;
      cachingOpportunities.forEach(record => {
        if (record.modelPricing?.cachedInputPricePerMillion) {
          const currentInputCost = record.inputCost;
          const cachedInputCost = (record.inputTokens / 1000000) * record.modelPricing.cachedInputPricePerMillion;
          cachingSavings += currentInputCost - cachedInputCost;
        }
      });
      
      if (cachingSavings > 0) {
        recommendations.push({
          type: 'enable_caching',
          description: `Enable caching for ${uniqueModelsWithCaching.length} models to reduce input token costs`,
          potentialSavings: Math.round(cachingSavings * 100) / 100,
          implementation: 'Configure caching in model API calls',
          riskLevel: 'Low'
        });
        estimatedMonthlySavings += cachingSavings * 30;
      }
    }
    
    // Check for model switching opportunities
    const modelCosts = Object.entries(totals.modelBreakdown)
      .map(([model, data]) => ({ model, costPerToken: data.avgCostPerToken }))
      .sort((a, b) => a.costPerToken - b.costPerToken);
    
    if (modelCosts.length > 1) {
      const cheapest = modelCosts[0];
      const mostExpensive = modelCosts[modelCosts.length - 1];
      const switchingSavings = (mostExpensive.costPerToken - cheapest.costPerToken) * totals.totalTokens;
      
      if (switchingSavings > 0.01) { // Only recommend if savings > $0.01
        recommendations.push({
          type: 'model_switch',
          description: `Switch from ${mostExpensive.model} to ${cheapest.model} for cost optimization`,
          potentialSavings: Math.round(switchingSavings * 100) / 100,
          implementation: 'Update model configuration in agent settings',
          riskLevel: 'Medium'
        });
        estimatedMonthlySavings += switchingSavings * 30;
      }
    }
    
    // Check for usage optimization
    const highCostRecords = enhancedRecords.filter(record => 
      record.costPerInputToken > 0.000003 || record.costPerOutputToken > 0.000015
    );
    
    if (highCostRecords.length > 0) {
      const usageOptimizationSavings = totals.totalCost * 0.15; // Estimate 15% savings
      recommendations.push({
        type: 'optimize_usage',
        description: 'Optimize prompt engineering and token usage to reduce costs',
        potentialSavings: Math.round(usageOptimizationSavings * 100) / 100,
        implementation: 'Review and optimize prompts, reduce unnecessary tokens',
        riskLevel: 'Low'
      });
      estimatedMonthlySavings += usageOptimizationSavings * 30;
    }
    
    return {
      currentCosts,
      recommendations,
      estimatedMonthlySavings: Math.round(estimatedMonthlySavings * 100) / 100
    };
  }

  /**
   * Get costs by LLM provider for an agent
   */
  static async getCostsByProvider(agentId: string, date?: string): Promise<{
    provider: string;
    totalCost: number;
    totalTokens: number;
    tasksExecuted: number;
    subAgentsCount: number;
    avgCostPerToken: number;
    modelVariants: string[];
  }[]> {
    let records = await this.getEnhancedTokenCostsByAgentId(agentId);
    
    // Filter by date if provided
    if (date) {
      records = records.filter(record => record.date === date);
    }

    // Group by provider
    const providerMap = new Map<string, TokenCostRecord[]>();
    records.forEach(record => {
      const existing = providerMap.get(record.llmProvider) || [];
      providerMap.set(record.llmProvider, [...existing, record]);
    });

    // Calculate totals for each provider
    return Array.from(providerMap.entries()).map(([provider, providerRecords]) => {
      const totals = providerRecords.reduce((acc, record) => ({
        totalCost: acc.totalCost + record.totalCost,
        totalTokens: acc.totalTokens + record.totalTokens,
        tasksExecuted: acc.tasksExecuted + record.tasksExecuted,
      }), { totalCost: 0, totalTokens: 0, tasksExecuted: 0 });

      const avgCostPerToken = totals.totalTokens > 0 ? totals.totalCost / totals.totalTokens : 0;
      const modelVariants = [...new Set(providerRecords.map(record => record.model))];

      return {
        provider,
        totalCost: Math.round(totals.totalCost * 100) / 100,
        totalTokens: totals.totalTokens,
        tasksExecuted: totals.tasksExecuted,
        subAgentsCount: new Set(providerRecords.map(r => r.subAgentId)).size,
        avgCostPerToken: Math.round(avgCostPerToken * 1000000) / 1000000,
        modelVariants
      };
    }).sort((a, b) => b.totalCost - a.totalCost);
  }

  /**
   * Get cost trends for an agent over time
   */
  static async getCostTrends(agentId: string, days: number = 7): Promise<{
    dates: string[];
    dailyCosts: number[];
    dailyTokens: number[];
    dailyTasks: number[];
    trend: 'up' | 'down' | 'stable';
  }> {
    const records = await this.getRecentTokenCosts(agentId, days);
    
    if (records.length === 0) {
      return { dates: [], dailyCosts: [], dailyTokens: [], dailyTasks: [], trend: 'stable' };
    }

    // Group by date and calculate daily totals
    const dailyTotals = new Map<string, { cost: number; tokens: number; tasks: number }>();
    
    records.forEach(record => {
      const existing = dailyTotals.get(record.date) || { cost: 0, tokens: 0, tasks: 0 };
      dailyTotals.set(record.date, {
        cost: existing.cost + record.totalCost,
        tokens: existing.tokens + record.totalTokens,
        tasks: existing.tasks + record.tasksExecuted
      });
    });

    // Sort by date and extract arrays
    const sortedEntries = Array.from(dailyTotals.entries())
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());
    
    const dates = sortedEntries.map(([date]) => date);
    const dailyCosts = sortedEntries.map(([, totals]) => Math.round(totals.cost * 100) / 100);
    const dailyTokens = sortedEntries.map(([, totals]) => totals.tokens);
    const dailyTasks = sortedEntries.map(([, totals]) => totals.tasks);

    // Calculate trend
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (dailyCosts.length >= 2) {
      const firstCost = dailyCosts[0];
      const lastCost = dailyCosts[dailyCosts.length - 1];
      const percentChange = ((lastCost - firstCost) / firstCost) * 100;
      
      if (percentChange > 5) {
        trend = 'up';
      } else if (percentChange < -5) {
        trend = 'down';
      }
    }

    return { dates, dailyCosts, dailyTokens, dailyTasks, trend };
  }

  /**
   * Get most expensive sub-agents
   */
  static async getMostExpensiveSubAgents(agentId: string, limit: number = 5): Promise<{
    subAgentId: string;
    subAgentName: string;
    totalCost: number;
    totalTokens: number;
    avgCostPerTask: number;
    llmProvider: string;
  }[]> {
    const subAgentCosts = await this.getCostsBySubAgent(agentId);
    return subAgentCosts.slice(0, limit);
  }

  /**
   * Get cost efficiency metrics
   */
  static async getCostEfficiencyMetrics(agentId: string): Promise<{
    mostEfficientSubAgent: string;
    leastEfficientSubAgent: string;
    avgCostPerTask: number;
    totalMonthlyCost: number;
    costPerToken: number;
    efficiencyScore: number;
  }> {
    const subAgentCosts = await this.getCostsBySubAgent(agentId);
    const totals = await this.getTotalCosts(agentId);
    
    if (subAgentCosts.length === 0) {
      return {
        mostEfficientSubAgent: 'N/A',
        leastEfficientSubAgent: 'N/A',
        avgCostPerTask: 0,
        totalMonthlyCost: 0,
        costPerToken: 0,
        efficiencyScore: 0
      };
    }

    // Sort by cost per task (ascending for efficiency)
    const sortedByEfficiency = [...subAgentCosts].sort((a, b) => a.avgCostPerTask - b.avgCostPerTask);
    
    return {
      mostEfficientSubAgent: sortedByEfficiency[0]?.subAgentName || 'N/A',
      leastEfficientSubAgent: sortedByEfficiency[sortedByEfficiency.length - 1]?.subAgentName || 'N/A',
      avgCostPerTask: Math.round(totals.avgCostPerTask * 1000) / 1000,
      totalMonthlyCost: Math.round(totals.totalCost * 30 * 100) / 100, // Estimate monthly cost
      costPerToken: totals.totalTokens > 0 ? 
        Math.round((totals.totalCost / totals.totalTokens) * 1000000) / 1000000 : 0,
      efficiencyScore: Math.round((1 / totals.avgCostPerTask) * 100) / 100
    };
  }

  /**
   * Search token cost records
   */
  static async searchTokenCosts(agentId: string, query: string): Promise<TokenCostRecord[]> {
    const records = await this.getTokenCostRecordsByAgentId(agentId);
    const lowerQuery = query.toLowerCase();
    return records.filter(record => 
      record.subAgentName.toLowerCase().includes(lowerQuery) ||
      record.llmProvider.toLowerCase().includes(lowerQuery) ||
      record.model.toLowerCase().includes(lowerQuery) ||
      record.subAgentId.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter token costs by multiple criteria
   */
  static async filterTokenCosts(agentId: string, filters: {
    subAgentId?: string;
    llmProvider?: string;
    model?: string;
    dateFrom?: string;
    dateTo?: string;
    minCost?: number;
    maxCost?: number;
  }): Promise<TokenCostRecord[]> {
    let records = await this.getTokenCostRecordsByAgentId(agentId);

    if (filters.subAgentId) {
      records = records.filter(record => record.subAgentId === filters.subAgentId);
    }

    if (filters.llmProvider) {
      records = records.filter(record => 
        record.llmProvider.toLowerCase().includes(filters.llmProvider!.toLowerCase())
      );
    }

    if (filters.model) {
      records = records.filter(record => 
        record.model.toLowerCase().includes(filters.model!.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      records = records.filter(record => new Date(record.date) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      records = records.filter(record => new Date(record.date) <= toDate);
    }

    if (filters.minCost !== undefined) {
      records = records.filter(record => record.totalCost >= filters.minCost!);
    }

    if (filters.maxCost !== undefined) {
      records = records.filter(record => record.totalCost <= filters.maxCost!);
    }

    return records;
  }

  /**
   * Get token cost summary by agent
   */
  static async getTokenCostSummary(agentId: string): Promise<{
    totalRecords: number;
    uniqueSubAgents: number;
    uniqueProviders: number;
    totalCost: number;
    totalTokens: number;
    totalTasks: number;
    avgCostPerTask: number;
    avgTokensPerTask: number;
    costByProvider: { [provider: string]: number };
    costBySubAgent: { [subAgent: string]: number };
  }> {
    const records = await this.getTokenCostRecordsByAgentId(agentId);
    
    const uniqueSubAgents = new Set(records.map(r => r.subAgentId)).size;
    const uniqueProviders = new Set(records.map(r => r.llmProvider)).size;
    
    const totals = records.reduce((acc, record) => ({
      totalCost: acc.totalCost + record.totalCost,
      totalTokens: acc.totalTokens + record.totalTokens,
      totalTasks: acc.totalTasks + record.tasksExecuted,
    }), { totalCost: 0, totalTokens: 0, totalTasks: 0 });

    // Cost by provider
    const costByProvider: { [provider: string]: number } = {};
    records.forEach(record => {
      costByProvider[record.llmProvider] = (costByProvider[record.llmProvider] || 0) + record.totalCost;
    });

    // Cost by sub-agent
    const costBySubAgent: { [subAgent: string]: number } = {};
    records.forEach(record => {
      costBySubAgent[record.subAgentName] = (costBySubAgent[record.subAgentName] || 0) + record.totalCost;
    });

    return {
      totalRecords: records.length,
      uniqueSubAgents,
      uniqueProviders,
      totalCost: Math.round(totals.totalCost * 100) / 100,
      totalTokens: totals.totalTokens,
      totalTasks: totals.totalTasks,
      avgCostPerTask: totals.totalTasks > 0 ? 
        Math.round((totals.totalCost / totals.totalTasks) * 1000) / 1000 : 0,
      avgTokensPerTask: totals.totalTasks > 0 ? 
        Math.round(totals.totalTokens / totals.totalTasks) : 0,
      costByProvider,
      costBySubAgent
    };
  }

  /**
   * Get all unique LLM providers
   */
  static async getAllProviders(): Promise<string[]> {
    const allData = await this.getAgentTokenCosts();
    const providers = new Set<string>();
    allData.forEach(agentData => {
      agentData.tokenCosts.forEach(record => {
        providers.add(record.llmProvider);
      });
    });
    return Array.from(providers).sort();
  }

  /**
   * Get all unique models
   */
  static async getAllModels(): Promise<string[]> {
    const allData = await this.getAgentTokenCosts();
    const models = new Set<string>();
    allData.forEach(agentData => {
      agentData.tokenCosts.forEach(record => {
        models.add(record.model);
      });
    });
    return Array.from(models).sort();
  }

  /**
   * Get organization-wide token cost summary
   */
  static async getOrganizationTokenCostSummary(organizationId: string): Promise<{
    totalAgents: number;
    totalCost: number;
    totalTokens: number;
    totalTasks: number;
    avgCostPerAgent: number;
    costByAgent: { [agentId: string]: number };
    costByProvider: { [provider: string]: number };
  }> {
    const orgData = await this.getTokenCostsByOrganizationId(organizationId);
    
    let totalCost = 0;
    let totalTokens = 0;
    let totalTasks = 0;
    const costByAgent: { [agentId: string]: number } = {};
    const costByProvider: { [provider: string]: number } = {};

    orgData.forEach(agentData => {
      let agentCost = 0;
      agentData.tokenCosts.forEach(record => {
        totalCost += record.totalCost;
        totalTokens += record.totalTokens;
        totalTasks += record.tasksExecuted;
        agentCost += record.totalCost;
        
        costByProvider[record.llmProvider] = (costByProvider[record.llmProvider] || 0) + record.totalCost;
      });
      costByAgent[agentData.agentId] = Math.round(agentCost * 100) / 100;
    });

    return {
      totalAgents: orgData.length,
      totalCost: Math.round(totalCost * 100) / 100,
      totalTokens,
      totalTasks,
      avgCostPerAgent: orgData.length > 0 ? Math.round((totalCost / orgData.length) * 100) / 100 : 0,
      costByAgent,
      costByProvider
    };
  }
}