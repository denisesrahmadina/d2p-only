import businessMetricResultsData from '../data/businessMetricResults.json';

export interface WeeklyResult {
  week: string;
  value: number;
  variance: number;
  variancePercentage: number;
  status: 'above_target' | 'on_target' | 'below_target';
  notes: string;
}

export interface BusinessMetric {
  id: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  target: number;
  benchmark: number;
  benchmarkSource: string;
  currentValue: number;
  trend: 'up' | 'down' | 'stable';
  priority: 'High' | 'Medium' | 'Low';
  owner: string;
  weeklyResults: WeeklyResult[];
}

export class BusinessMetricsService {
  /**
   * Get all business metrics
   */
  static async getBusinessMetrics(): Promise<BusinessMetric[]> {
    return businessMetricResultsData as BusinessMetric[];
  }

  /**
   * Get business metric by ID
   */
  static async getBusinessMetricById(id: string): Promise<BusinessMetric | undefined> {
    const metrics = await this.getBusinessMetrics();
    return metrics.find(metric => metric.id === id);
  }

  /**
   * Get business metrics by category
   */
  static async getBusinessMetricsByCategory(category: string): Promise<BusinessMetric[]> {
    const metrics = await this.getBusinessMetrics();
    return metrics.filter(metric => 
      metric.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  /**
   * Get business metrics by priority
   */
  static async getBusinessMetricsByPriority(priority: string): Promise<BusinessMetric[]> {
    const metrics = await this.getBusinessMetrics();
    return metrics.filter(metric => metric.priority === priority);
  }

  /**
   * Get business metrics by trend
   */
  static async getBusinessMetricsByTrend(trend: 'up' | 'down' | 'stable'): Promise<BusinessMetric[]> {
    const metrics = await this.getBusinessMetrics();
    return metrics.filter(metric => metric.trend === trend);
  }

  /**
   * Get business metrics by owner
   */
  static async getBusinessMetricsByOwner(owner: string): Promise<BusinessMetric[]> {
    const metrics = await this.getBusinessMetrics();
    return metrics.filter(metric => 
      metric.owner.toLowerCase().includes(owner.toLowerCase())
    );
  }

  /**
   * Get metrics above target
   */
  static async getMetricsAboveTarget(): Promise<BusinessMetric[]> {
    const metrics = await this.getBusinessMetrics();
    return metrics.filter(metric => {
      // For metrics where lower is better (like cost, error rate, cycle time)
      const lowerIsBetter = metric.unit === 'USD' || 
                           metric.name.toLowerCase().includes('cost') ||
                           metric.name.toLowerCase().includes('error') ||
                           metric.name.toLowerCase().includes('time');
      
      if (lowerIsBetter) {
        return metric.currentValue <= metric.target;
      } else {
        return metric.currentValue >= metric.target;
      }
    });
  }

  /**
   * Get metrics below target
   */
  static async getMetricsBelowTarget(): Promise<BusinessMetric[]> {
    const metrics = await this.getBusinessMetrics();
    return metrics.filter(metric => {
      // For metrics where lower is better (like cost, error rate, cycle time)
      const lowerIsBetter = metric.unit === 'USD' || 
                           metric.name.toLowerCase().includes('cost') ||
                           metric.name.toLowerCase().includes('error') ||
                           metric.name.toLowerCase().includes('time');
      
      if (lowerIsBetter) {
        return metric.currentValue > metric.target;
      } else {
        return metric.currentValue < metric.target;
      }
    });
  }

  /**
   * Get recent weekly results for a metric
   */
  static async getRecentWeeklyResults(metricId: string, weeks: number = 5): Promise<WeeklyResult[]> {
    const metric = await this.getBusinessMetricById(metricId);
    if (!metric) return [];

    return metric.weeklyResults
      .sort((a, b) => new Date(b.week).getTime() - new Date(a.week).getTime())
      .slice(0, weeks);
  }

  /**
   * Get metrics performance summary
   */
  static async getMetricsPerformanceSummary(): Promise<{
    totalMetrics: number;
    aboveTarget: number;
    onTarget: number;
    belowTarget: number;
    trendingUp: number;
    trendingDown: number;
    stable: number;
    highPriority: number;
    categoryDistribution: { [category: string]: number };
  }> {
    const metrics = await this.getBusinessMetrics();
    const aboveTargetMetrics = await this.getMetricsAboveTarget();
    const belowTargetMetrics = await this.getMetricsBelowTarget();
    
    // Calculate on-target (exactly meeting target)
    const onTargetMetrics = metrics.filter(metric => {
      const lowerIsBetter = metric.unit === 'USD' || 
                           metric.name.toLowerCase().includes('cost') ||
                           metric.name.toLowerCase().includes('error') ||
                           metric.name.toLowerCase().includes('time');
      
      if (lowerIsBetter) {
        return metric.currentValue === metric.target;
      } else {
        return metric.currentValue === metric.target;
      }
    });

    // Category distribution
    const categoryDistribution: { [category: string]: number } = {};
    metrics.forEach(metric => {
      categoryDistribution[metric.category] = (categoryDistribution[metric.category] || 0) + 1;
    });

    return {
      totalMetrics: metrics.length,
      aboveTarget: aboveTargetMetrics.length,
      onTarget: onTargetMetrics.length,
      belowTarget: belowTargetMetrics.length,
      trendingUp: metrics.filter(m => m.trend === 'up').length,
      trendingDown: metrics.filter(m => m.trend === 'down').length,
      stable: metrics.filter(m => m.trend === 'stable').length,
      highPriority: metrics.filter(m => m.priority === 'High').length,
      categoryDistribution
    };
  }

  /**
   * Get metrics trend analysis
   */
  static async getMetricsTrendAnalysis(metricId: string): Promise<{
    metric: BusinessMetric;
    weeklyTrend: 'improving' | 'declining' | 'stable';
    averageWeeklyChange: number;
    bestWeek: WeeklyResult;
    worstWeek: WeeklyResult;
    consistencyScore: number;
  } | null> {
    const metric = await this.getBusinessMetricById(metricId);
    if (!metric || metric.weeklyResults.length === 0) return null;

    const sortedResults = metric.weeklyResults
      .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());

    // Calculate weekly trend
    const values = sortedResults.map(result => result.value);
    const weeklyChanges = values.slice(1).map((value, index) => value - values[index]);
    const averageWeeklyChange = weeklyChanges.length > 0 
      ? weeklyChanges.reduce((sum, change) => sum + change, 0) / weeklyChanges.length 
      : 0;

    let weeklyTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (Math.abs(averageWeeklyChange) > 0.1) {
      // For metrics where lower is better
      const lowerIsBetter = metric.unit === 'USD' || 
                           metric.name.toLowerCase().includes('cost') ||
                           metric.name.toLowerCase().includes('error') ||
                           metric.name.toLowerCase().includes('time');
      
      if (lowerIsBetter) {
        weeklyTrend = averageWeeklyChange < 0 ? 'improving' : 'declining';
      } else {
        weeklyTrend = averageWeeklyChange > 0 ? 'improving' : 'declining';
      }
    }

    // Find best and worst weeks
    const lowerIsBetter = metric.unit === 'USD' || 
                         metric.name.toLowerCase().includes('cost') ||
                         metric.name.toLowerCase().includes('error') ||
                         metric.name.toLowerCase().includes('time');
    
    const bestWeek = lowerIsBetter 
      ? sortedResults.reduce((best, current) => current.value < best.value ? current : best)
      : sortedResults.reduce((best, current) => current.value > best.value ? current : best);
    
    const worstWeek = lowerIsBetter 
      ? sortedResults.reduce((worst, current) => current.value > worst.value ? current : worst)
      : sortedResults.reduce((worst, current) => current.value < worst.value ? current : worst);

    // Calculate consistency score (lower variance = higher consistency)
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    const coefficientOfVariation = mean !== 0 ? standardDeviation / Math.abs(mean) : 0;
    const consistencyScore = Math.max(0, 100 - (coefficientOfVariation * 100));

    return {
      metric,
      weeklyTrend,
      averageWeeklyChange: Math.round(averageWeeklyChange * 100) / 100,
      bestWeek,
      worstWeek,
      consistencyScore: Math.round(consistencyScore * 10) / 10
    };
  }

  /**
   * Search business metrics
   */
  static async searchBusinessMetrics(query: string): Promise<BusinessMetric[]> {
    const metrics = await this.getBusinessMetrics();
    const lowerQuery = query.toLowerCase();
    return metrics.filter(metric => 
      metric.name.toLowerCase().includes(lowerQuery) ||
      metric.description.toLowerCase().includes(lowerQuery) ||
      metric.category.toLowerCase().includes(lowerQuery) ||
      metric.owner.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter business metrics by multiple criteria
   */
  static async filterBusinessMetrics(filters: {
    category?: string;
    priority?: string;
    trend?: 'up' | 'down' | 'stable';
    owner?: string;
    performanceStatus?: 'above_target' | 'on_target' | 'below_target';
    searchTerm?: string;
  }): Promise<BusinessMetric[]> {
    let metrics = await this.getBusinessMetrics();

    if (filters.category) {
      metrics = metrics.filter(metric => 
        metric.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters.priority) {
      metrics = metrics.filter(metric => metric.priority === filters.priority);
    }

    if (filters.trend) {
      metrics = metrics.filter(metric => metric.trend === filters.trend);
    }

    if (filters.owner) {
      metrics = metrics.filter(metric => 
        metric.owner.toLowerCase().includes(filters.owner!.toLowerCase())
      );
    }

    if (filters.performanceStatus) {
      const aboveTarget = await this.getMetricsAboveTarget();
      const belowTarget = await this.getMetricsBelowTarget();
      
      if (filters.performanceStatus === 'above_target') {
        const aboveTargetIds = new Set(aboveTarget.map(m => m.id));
        metrics = metrics.filter(metric => aboveTargetIds.has(metric.id));
      } else if (filters.performanceStatus === 'below_target') {
        const belowTargetIds = new Set(belowTarget.map(m => m.id));
        metrics = metrics.filter(metric => belowTargetIds.has(metric.id));
      } else if (filters.performanceStatus === 'on_target') {
        const aboveTargetIds = new Set(aboveTarget.map(m => m.id));
        const belowTargetIds = new Set(belowTarget.map(m => m.id));
        metrics = metrics.filter(metric => 
          !aboveTargetIds.has(metric.id) && !belowTargetIds.has(metric.id)
        );
      }
    }

    if (filters.searchTerm) {
      metrics = await this.searchBusinessMetrics(filters.searchTerm);
    }

    return metrics;
  }

  /**
   * Get all unique categories
   */
  static async getCategories(): Promise<string[]> {
    const metrics = await this.getBusinessMetrics();
    return [...new Set(metrics.map(metric => metric.category))].sort();
  }

  /**
   * Get all unique owners
   */
  static async getOwners(): Promise<string[]> {
    const metrics = await this.getBusinessMetrics();
    return [...new Set(metrics.map(metric => metric.owner))].sort();
  }

  /**
   * Get all unique priorities
   */
  static async getPriorities(): Promise<string[]> {
    return ['High', 'Medium', 'Low'];
  }

  /**
   * Get metrics dashboard data
   */
  static async getMetricsDashboardData(): Promise<{
    summary: any;
    criticalMetrics: BusinessMetric[];
    improvingMetrics: BusinessMetric[];
    decliningMetrics: BusinessMetric[];
    recentAlerts: {
      metricId: string;
      metricName: string;
      alertType: 'target_missed' | 'declining_trend' | 'improvement';
      message: string;
      severity: 'high' | 'medium' | 'low';
    }[];
  }> {
    const metrics = await this.getBusinessMetrics();
    const summary = await this.getMetricsPerformanceSummary();
    
    // Get critical metrics (high priority and below target)
    const belowTarget = await this.getMetricsBelowTarget();
    const criticalMetrics = belowTarget.filter(metric => metric.priority === 'High');
    
    // Get improving and declining metrics
    const improvingMetrics = metrics.filter(metric => metric.trend === 'up');
    const decliningMetrics = metrics.filter(metric => metric.trend === 'down');
    
    // Generate recent alerts
    const recentAlerts: any[] = [];
    
    // Alert for metrics below target
    belowTarget.forEach(metric => {
      recentAlerts.push({
        metricId: metric.id,
        metricName: metric.name,
        alertType: 'target_missed',
        message: `${metric.name} is ${Math.abs(metric.currentValue - metric.target).toFixed(2)} ${metric.unit} ${metric.currentValue > metric.target ? 'above' : 'below'} target`,
        severity: metric.priority === 'High' ? 'high' : 'medium'
      });
    });
    
    // Alert for declining trends
    decliningMetrics.forEach(metric => {
      if (metric.priority === 'High') {
        recentAlerts.push({
          metricId: metric.id,
          metricName: metric.name,
          alertType: 'declining_trend',
          message: `${metric.name} showing declining trend - requires attention`,
          severity: 'medium'
        });
      }
    });
    
    // Alert for significant improvements
    improvingMetrics.forEach(metric => {
      const latestResult = metric.weeklyResults[0];
      if (latestResult && Math.abs(latestResult.variancePercentage) > 10) {
        recentAlerts.push({
          metricId: metric.id,
          metricName: metric.name,
          alertType: 'improvement',
          message: `${metric.name} improved by ${Math.abs(latestResult.variancePercentage).toFixed(1)}% this week`,
          severity: 'low'
        });
      }
    });

    return {
      summary,
      criticalMetrics: criticalMetrics.slice(0, 5),
      improvingMetrics: improvingMetrics.slice(0, 5),
      decliningMetrics: decliningMetrics.slice(0, 5),
      recentAlerts: recentAlerts.slice(0, 10)
    };
  }

  /**
   * Get weekly performance comparison
   */
  static async getWeeklyPerformanceComparison(): Promise<{
    week: string;
    metricsAboveTarget: number;
    metricsOnTarget: number;
    metricsBelowTarget: number;
    averagePerformance: number;
  }[]> {
    const metrics = await this.getBusinessMetrics();
    
    // Get all unique weeks
    const allWeeks = new Set<string>();
    metrics.forEach(metric => {
      metric.weeklyResults.forEach(result => {
        allWeeks.add(result.week);
      });
    });
    
    const sortedWeeks = Array.from(allWeeks).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    return sortedWeeks.map(week => {
      const weekResults = metrics.map(metric => {
        const weekResult = metric.weeklyResults.find(result => result.week === week);
        return weekResult ? {
          metric,
          result: weekResult
        } : null;
      }).filter(Boolean);
      
      const aboveTarget = weekResults.filter(wr => wr!.result.status === 'above_target').length;
      const onTarget = weekResults.filter(wr => wr!.result.status === 'on_target').length;
      const belowTarget = weekResults.filter(wr => wr!.result.status === 'below_target').length;
      
      const averagePerformance = weekResults.length > 0 
        ? weekResults.reduce((sum, wr) => {
            const performance = wr!.result.status === 'above_target' ? 100 : 
                               wr!.result.status === 'on_target' ? 90 : 70;
            return sum + performance;
          }, 0) / weekResults.length
        : 0;

      return {
        week,
        metricsAboveTarget: aboveTarget,
        metricsOnTarget: onTarget,
        metricsBelowTarget: belowTarget,
        averagePerformance: Math.round(averagePerformance * 10) / 10
      };
    }).slice(0, 8); // Last 8 weeks
  }

  /**
   * Get metric variance analysis
   */
  static async getMetricVarianceAnalysis(metricId: string): Promise<{
    metric: BusinessMetric;
    currentVariance: number;
    averageVariance: number;
    varianceTrend: 'improving' | 'declining' | 'stable';
    volatilityScore: number;
    recommendations: string[];
  } | null> {
    const metric = await this.getBusinessMetricById(metricId);
    if (!metric || metric.weeklyResults.length === 0) return null;

    const currentVariance = metric.weeklyResults[0]?.variance || 0;
    const averageVariance = metric.weeklyResults.reduce((sum, result) => sum + Math.abs(result.variance), 0) / metric.weeklyResults.length;
    
    // Calculate variance trend
    const recentVariances = metric.weeklyResults.slice(0, 3).map(result => Math.abs(result.variance));
    const olderVariances = metric.weeklyResults.slice(3, 6).map(result => Math.abs(result.variance));
    
    const recentAvg = recentVariances.reduce((sum, v) => sum + v, 0) / recentVariances.length;
    const olderAvg = olderVariances.length > 0 ? olderVariances.reduce((sum, v) => sum + v, 0) / olderVariances.length : recentAvg;
    
    let varianceTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (Math.abs(recentAvg - olderAvg) > 0.1) {
      varianceTrend = recentAvg < olderAvg ? 'improving' : 'declining';
    }

    // Calculate volatility score (0-100, lower is better)
    const maxVariance = Math.max(...metric.weeklyResults.map(result => Math.abs(result.variance)));
    const volatilityScore = maxVariance > 0 ? (averageVariance / maxVariance) * 100 : 0;

    // Generate recommendations
    const recommendations: string[] = [];
    if (currentVariance > averageVariance * 1.5) {
      recommendations.push('Current performance significantly deviates from average - investigate root causes');
    }
    if (volatilityScore > 50) {
      recommendations.push('High volatility detected - implement process stabilization measures');
    }
    if (varianceTrend === 'declining') {
      recommendations.push('Variance trend is worsening - review process controls and monitoring');
    }
    if (metric.currentValue < metric.target && metric.priority === 'High') {
      recommendations.push('High priority metric below target - immediate action required');
    }

    return {
      metric,
      currentVariance: Math.round(currentVariance * 100) / 100,
      averageVariance: Math.round(averageVariance * 100) / 100,
      varianceTrend,
      volatilityScore: Math.round(volatilityScore * 10) / 10,
      recommendations
    };
  }

  /**
   * Get category performance overview
   */
  static async getCategoryPerformanceOverview(): Promise<{
    category: string;
    totalMetrics: number;
    aboveTarget: number;
    belowTarget: number;
    averagePerformance: number;
    trendingUp: number;
    trendingDown: number;
  }[]> {
    const metrics = await this.getBusinessMetrics();
    const categories = await this.getCategories();
    
    return categories.map(category => {
      const categoryMetrics = metrics.filter(metric => metric.category === category);
      const aboveTarget = categoryMetrics.filter(metric => {
        const lowerIsBetter = metric.unit === 'USD' || 
                             metric.name.toLowerCase().includes('cost') ||
                             metric.name.toLowerCase().includes('error') ||
                             metric.name.toLowerCase().includes('time');
        
        if (lowerIsBetter) {
          return metric.currentValue <= metric.target;
        } else {
          return metric.currentValue >= metric.target;
        }
      }).length;
      
      const belowTarget = categoryMetrics.length - aboveTarget;
      const averagePerformance = categoryMetrics.length > 0 
        ? (aboveTarget / categoryMetrics.length) * 100 
        : 0;
      
      const trendingUp = categoryMetrics.filter(metric => metric.trend === 'up').length;
      const trendingDown = categoryMetrics.filter(metric => metric.trend === 'down').length;

      return {
        category,
        totalMetrics: categoryMetrics.length,
        aboveTarget,
        belowTarget,
        averagePerformance: Math.round(averagePerformance * 10) / 10,
        trendingUp,
        trendingDown
      };
    });
  }
}