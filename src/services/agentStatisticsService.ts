import agentStatisticsData from '../data/agentStatistics.json';

export interface AgentStatistic {
  date: string;
  uptime: number;
  responseTime: number;
  tasksCompleted: number;
  errorRate: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface QualityStatistic {
  date: string;
  groundedness: number;
  relevance: number;
  coherence: number;
  contextAwareness: number;
}

export interface AgentStatisticsData {
  agentId: string;
  organizationId: string;
  statistic_type: "service" | "quality";
  targets?: any;
  statistics: any[];
}

export class AgentStatisticsService {
  /**
   * Get all agent statistics
   */
  static async getAgentStatistics(): Promise<AgentStatisticsData[]> {
    return agentStatisticsData as AgentStatisticsData[];
  }

  /**
   * Get statistics by agent ID (returns all entries for that agent)
   */
  static async getStatisticsByAgentId(agentId: string): Promise<AgentStatisticsData[]> {
    const statistics = await this.getAgentStatistics();
    return statistics.filter(stat => stat.agentId === agentId);
  }

  /**
   * Get service statistics by agent ID (for backward compatibility)
   */
  static async getServiceStatisticsByAgentId(agentId: string): Promise<AgentStatisticsData | undefined> {
    const statistics = await this.getAgentStatistics();
    return statistics.find(stat => stat.agentId === agentId && stat.statistic_type === 'service');
  }

  /**
   * Get quality statistics by agent ID
   */
  static async getQualityStatistics(agentId: string): Promise<QualityStatistic[]> {
    // Get all statistic entries for the given agent ID
    const agentAllStats = await this.getStatisticsByAgentId(agentId);

    // Find the specific entry that has statistic_type: "quality"
    const qualityEntry = agentAllStats.find(entry => entry.statistic_type === 'quality');

    if (!qualityEntry) {
      return []; // No quality data found for this agent
    }

    // Return the statistics array from the quality entry, sorted by date
    return qualityEntry.statistics
      .map(stat => stat as QualityStatistic)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Get statistics by organization ID
   */
  static async getStatisticsByOrganizationId(organizationId: string): Promise<AgentStatisticsData[]> {
    const statistics = await this.getAgentStatistics();
    return statistics.filter(stat => stat.organizationId === organizationId);
  }

  /**
   * Get recent statistics for an agent (last N days)
   */
  static async getRecentStatistics(agentId: string, days: number = 7): Promise<AgentStatistic[]> {
    const agentStats = await this.getServiceStatisticsByAgentId(agentId);
    if (!agentStats) return [];

    // Sort by date (most recent first) and take the specified number of days
    return agentStats.statistics
      .map(stat => stat as AgentStatistic)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, days);
  }

  /**
   * Get performance trend for a specific metric
   */
  static async getPerformanceTrend(agentId: string, metric: keyof AgentStatistic, days: number = 7): Promise<{
    dates: string[];
    values: number[];
    trend: 'up' | 'down' | 'stable';
  }> {
    const recentStats = await this.getRecentStatistics(agentId, days);
    
    if (recentStats.length === 0) {
      return { dates: [], values: [], trend: 'stable' };
    }

    // Sort by date (oldest first) for proper trend calculation
    const sortedStats = recentStats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const dates = sortedStats.map(stat => stat.date);
    const values = sortedStats.map(stat => stat[metric] as number);
    
    // Calculate trend
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (values.length >= 2) {
      const firstValue = values[0];
      const lastValue = values[values.length - 1];
      const percentChange = ((lastValue - firstValue) / firstValue) * 100;
      
      if (percentChange > 2) {
        trend = 'up';
      } else if (percentChange < -2) {
        trend = 'down';
      }
    }

    return { dates, values, trend };
  }

  /**
   * Get average performance metrics for an agent over a period
   */
  static async getAverageMetrics(agentId: string, days: number = 7): Promise<{
    avgUptime: number;
    avgResponseTime: number;
    avgThroughput: number;
    avgErrorRate: number;
  }> {
    const recentStats = await this.getRecentStatistics(agentId, days);
    
    if (recentStats.length === 0) {
      return { avgUptime: 0, avgResponseTime: 0, avgThroughput: 0, avgErrorRate: 0 };
    }

    const totals = recentStats.reduce((acc, stat) => ({
      uptime: acc.uptime + stat.uptime,
      responseTime: acc.responseTime + stat.responseTime,
      throughput: acc.throughput + stat.throughput,
      errorRate: acc.errorRate + stat.errorRate,
    }), { uptime: 0, responseTime: 0, throughput: 0, errorRate: 0 });

    const count = recentStats.length;
    
    return {
      avgUptime: Math.round((totals.uptime / count) * 10) / 10,
      avgResponseTime: Math.round((totals.responseTime / count) * 100) / 100,
      avgThroughput: Math.round((totals.throughput / count) * 10) / 10,
      avgErrorRate: Math.round((totals.errorRate / count) * 100) / 100,
    };
  }

  /**
   * Get performance comparison between agents
   */
  static async getAgentComparison(organizationId: string, metric: keyof AgentStatistic): Promise<{
    agentId: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
  }[]> {
    const orgStats = await this.getStatisticsByOrganizationId(organizationId);
    
    const comparison = await Promise.all(
      orgStats.filter(stat => stat.statistic_type === 'service').map(async (agentStat) => {
        const trend = await this.getPerformanceTrend(agentStat.agentId, metric, 7);
        const recentStats = await this.getRecentStatistics(agentStat.agentId, 1);
        const currentValue = recentStats.length > 0 ? recentStats[0][metric] as number : 0;
        
        return {
          agentId: agentStat.agentId,
          value: currentValue,
          trend: trend.trend
        };
      })
    );

    return comparison.sort((a, b) => b.value - a.value);
  }
}