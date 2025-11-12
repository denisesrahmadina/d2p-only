export type MetricStatus = 'great' | 'good' | 'needs-attention';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface KeyPerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  displayValue: string;
  trend: {
    direction: TrendDirection;
    percentage: number;
    label: string;
  };
  status: MetricStatus;
  target?: number;
  benchmark?: number;
  description: string;
  lastUpdated: string;
}

export interface MetricDetailData {
  metricId: string;
  historicalData: {
    period: string;
    value: number;
  }[];
  breakdown: {
    category: string;
    value: number;
    percentage: number;
  }[];
  insights: string[];
  recommendations: string[];
}

export class KeyPerformanceMetricsService {
  static async generateInventoryTurnOver(): Promise<KeyPerformanceMetric> {
    try {
      const { InventoryTurnOverService } = await import('./inventoryTurnOverService');
      const locations = await InventoryTurnOverService.getAllUnitLocationsWithTurnover();

      // Calculate average turnover ratio across all locations
      const avgTurnoverRatio = locations.length > 0
        ? locations.reduce((sum, loc) => sum + loc.turnover_ratio, 0) / locations.length
        : 0;

      const roundedRatio = Math.round(avgTurnoverRatio * 100) / 100;
      const target = 13;
      const previousValue = 8.5;
      const change = ((roundedRatio - previousValue) / previousValue) * 100;

      return {
        id: 'inventory-turnover',
        name: 'Inventory Turn Over',
        value: roundedRatio,
        unit: 'x',
        displayValue: `${roundedRatio}x`,
        trend: {
          direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
          percentage: Math.abs(change),
          label: change > 0 ? 'Improved' : change < 0 ? 'Declined' : 'Stable'
        },
        status: roundedRatio >= 13 ? 'great' : roundedRatio >= 7 ? 'good' : 'needs-attention',
        target,
        benchmark: 10,
        description: 'Average inventory turnover ratio (Consumption ÷ Average Inventory)',
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating inventory turnover metric:', error);
      // Fallback to default value if database query fails
      const roundedRatio = 9.5;
      const target = 13;
      const previousValue = 8.5;
      const change = ((roundedRatio - previousValue) / previousValue) * 100;

      return {
        id: 'inventory-turnover',
        name: 'Inventory Turn Over',
        value: roundedRatio,
        unit: 'x',
        displayValue: `${roundedRatio}x`,
        trend: {
          direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
          percentage: Math.abs(change),
          label: change > 0 ? 'Improved' : change < 0 ? 'Declined' : 'Stable'
        },
        status: roundedRatio >= 13 ? 'great' : roundedRatio >= 7 ? 'good' : 'needs-attention',
        target,
        benchmark: 10,
        description: 'Average inventory turnover ratio (Consumption ÷ Average Inventory)',
        lastUpdated: new Date().toISOString()
      };
    }
  }

  static generateInventoryWithinTolerance(): KeyPerformanceMetric {
    const percentage = 87;
    const target = 90;
    const previousValue = 82;
    const change = percentage - previousValue;

    return {
      id: 'inventory-tolerance',
      name: '% Inventory within Planning Tolerance',
      value: percentage,
      unit: '%',
      displayValue: `${percentage}%`,
      trend: {
        direction: change < 0 ? 'down' : change > 0 ? 'up' : 'stable',
        percentage: Math.abs(change),
        label: change > 0 ? 'Improving' : change < 0 ? 'Declining' : 'Stable'
      },
      status: percentage >= 90 ? 'great' : percentage >= 80 ? 'good' : 'needs-attention',
      target,
      benchmark: 85,
      description: 'Percentage of inventory items within acceptable planning tolerance levels',
      lastUpdated: new Date().toISOString()
    };
  }

  static async generateProcurementSavings(): Promise<KeyPerformanceMetric> {
    try {
      const { ProcurementSavingsService } = await import('./procurementSavingsService');
      const summary = await ProcurementSavingsService.getOverallSummary('ORG001');

      const savingsAmount = summary.total_actual_savings;
      const previousAmount = savingsAmount * 0.92; // 8% increase from previous
      const change = ((savingsAmount - previousAmount) / previousAmount) * 100;

      // Format as IDR
      let displayValue = '';
      if (savingsAmount >= 1000000000000) {
        displayValue = `IDR ${(savingsAmount / 1000000000000).toFixed(2)}T`;
      } else if (savingsAmount >= 1000000000) {
        displayValue = `IDR ${(savingsAmount / 1000000000).toFixed(2)}B`;
      } else if (savingsAmount >= 1000000) {
        displayValue = `IDR ${(savingsAmount / 1000000).toFixed(2)}M`;
      } else {
        displayValue = `IDR ${savingsAmount.toLocaleString('id-ID')}`;
      }

      return {
        id: 'procurement-savings',
        name: 'Procurement Savings',
        value: savingsAmount,
        unit: 'IDR',
        displayValue,
        trend: {
          direction: change < 0 ? 'down' : change > 0 ? 'up' : 'stable',
          percentage: Math.abs(change),
          label: change > 0 ? 'Increasing' : change < 0 ? 'Decreasing' : 'Stable'
        },
        status: summary.average_savings_percentage >= 12 ? 'great' : summary.average_savings_percentage >= 8 ? 'good' : 'needs-attention',
        target: summary.yearly_target_amount || 500000000000,
        benchmark: savingsAmount * 0.9,
        description: 'Total procurement cost savings from owner estimate vs contracted value',
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating procurement savings metric:', error);
      const savingsAmount = 89645000000;
      const previousAmount = savingsAmount * 0.92;
      const change = ((savingsAmount - previousAmount) / previousAmount) * 100;

      return {
        id: 'procurement-savings',
        name: 'Procurement Savings',
        value: savingsAmount,
        unit: 'IDR',
        displayValue: `IDR ${(savingsAmount / 1000000000).toFixed(2)}B`,
        trend: {
          direction: change < 0 ? 'down' : change > 0 ? 'up' : 'stable',
          percentage: Math.abs(change),
          label: change > 0 ? 'Increasing' : change < 0 ? 'Decreasing' : 'Stable'
        },
        status: 'great',
        target: 500000000000,
        benchmark: savingsAmount * 0.9,
        description: 'Total procurement cost savings from owner estimate vs contracted value',
        lastUpdated: new Date().toISOString()
      };
    }
  }

  static async generateAverageSourcingTime(): Promise<KeyPerformanceMetric> {
    try {
      const { sourcingSpeedService } = await import('./sourcingSpeedService');
      const summary = await sourcingSpeedService.getOverallSummary();

      // Use the within target percentage from summary
      const percentage = summary.withinTargetPercentage || 0;

      const target = 70; // 70% target
      const previousValue = 65;
      const change = percentage - previousValue;

      return {
        id: 'sourcing-time',
        name: 'Procurement Sourcing Speed',
        value: percentage,
        unit: '%',
        displayValue: `${percentage}%`,
        trend: {
          direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
          percentage: Math.abs(change),
          label: change > 0 ? 'Improved' : change < 0 ? 'Declined' : 'Stable'
        },
        status: percentage >= 75 ? 'great' : percentage >= 65 ? 'good' : 'needs-attention',
        target,
        benchmark: 70,
        description: 'Percentage of contracts awarded within target timeframe',
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating sourcing speed metric:', error);
      // Fallback
      const percentage = 76;
      const target = 70;
      const previousValue = 72;
      const change = percentage - previousValue;

      return {
        id: 'sourcing-time',
        name: 'Procurement Sourcing Speed',
        value: percentage,
        unit: '%',
        displayValue: `${percentage}%`,
        trend: {
          direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
          percentage: Math.abs(change),
          label: change > 0 ? 'Improved' : change < 0 ? 'Declined' : 'Stable'
        },
        status: percentage >= 75 ? 'great' : percentage >= 65 ? 'good' : 'needs-attention',
        target,
        benchmark: 70,
        description: 'Percentage of contracts awarded within target timeframe',
        lastUpdated: new Date().toISOString()
      };
    }
  }

  static async generateSupplierOTIF(): Promise<KeyPerformanceMetric> {
    try {
      const { CategoryService } = await import('./categoryService');

      // Get top suppliers to calculate average OTIF across all categories A-F
      const topSuppliers = await CategoryService.getTopSuppliersGlobal(null, 100); // Get more suppliers for accurate average

      // Calculate average OTIF percentage from all suppliers
      const percentage = topSuppliers.length > 0
        ? Math.round(topSuppliers.reduce((sum, supplier) => sum + supplier.otif_percentage, 0) / topSuppliers.length * 10) / 10
        : 0;

      const target = 95;
      const previousValue = 91;
      const change = percentage - previousValue;

      return {
        id: 'supplier-otif',
        name: '% Supplier On Time In Full',
        value: percentage,
        unit: '%',
        displayValue: `${percentage}%`,
        trend: {
          direction: change < 0 ? 'down' : change > 0 ? 'up' : 'stable',
          percentage: Math.abs(change),
          label: change > 0 ? 'Improving' : change < 0 ? 'Declining' : 'Stable'
        },
        status: percentage >= 95 ? 'great' : percentage >= 90 ? 'good' : 'needs-attention',
        target,
        benchmark: 92,
        description: 'Average percentage of supplier deliveries that are on time and in full quantity across all categories',
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating supplier OTIF metric:', error);
      const percentage = 94;
      const target = 95;
      const previousValue = 91;
      const change = percentage - previousValue;

      return {
        id: 'supplier-otif',
        name: '% Supplier On Time In Full',
        value: percentage,
        unit: '%',
        displayValue: `${percentage}%`,
        trend: {
          direction: change < 0 ? 'down' : change > 0 ? 'up' : 'stable',
          percentage: Math.abs(change),
          label: change > 0 ? 'Improving' : change < 0 ? 'Declining' : 'Stable'
        },
        status: percentage >= 95 ? 'great' : percentage >= 90 ? 'good' : 'needs-attention',
        target,
        benchmark: 92,
        description: 'Average percentage of supplier deliveries that are on time and in full quantity across all categories',
        lastUpdated: new Date().toISOString()
      };
    }
  }

  static async getAllMetrics(): Promise<KeyPerformanceMetric[]> {
    const [inventoryTurnOver, supplierOTIF, procurementSavings, sourcingTime] = await Promise.all([
      this.generateInventoryTurnOver(),
      this.generateSupplierOTIF(),
      this.generateProcurementSavings(),
      this.generateAverageSourcingTime()
    ]);

    return [
      this.generateInventoryWithinTolerance(),
      inventoryTurnOver,
      procurementSavings,
      sourcingTime,
      supplierOTIF
    ];
  }

  static async getMetricById(id: string): Promise<KeyPerformanceMetric | null> {
    const metrics = await this.getAllMetrics();
    return metrics.find(m => m.id === id) || null;
  }

  static generateMetricDetailData(metricId: string): MetricDetailData {
    const baseData = {
      metricId,
      historicalData: this.generateHistoricalData(metricId),
      breakdown: this.generateBreakdown(metricId),
      insights: this.generateInsights(metricId),
      recommendations: this.generateRecommendations(metricId)
    };

    return baseData;
  }

  private static generateHistoricalData(metricId: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const data = [];

    for (let i = 11; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const value = this.getRandomValueForMetric(metricId, i);
      data.push({
        period: months[monthIndex],
        value
      });
    }

    return data;
  }

  private static getRandomValueForMetric(metricId: string, monthsAgo: number): number {
    const baseValues: Record<string, number> = {
      'inventory-turnover': 2.1,
      'inventory-tolerance': 85,
      'procurement-savings': 11,
      'sourcing-time': 32,
      'supplier-otif': 92
    };

    const base = baseValues[metricId] || 50;
    const variance = metricId === 'inventory-turnover' ? 0.2 : 5;
    const trend = metricId === 'inventory-turnover' ? 0.02 : -0.3;

    return Math.round((base + (Math.random() * variance * 2 - variance) + (trend * monthsAgo)) * 100) / 100;
  }

  private static generateBreakdown(metricId: string) {
    const breakdowns: Record<string, { category: string; value: number }[]> = {
      'inventory-turnover': [
        { category: 'Raw Materials', value: 2.8 },
        { category: 'Work in Progress', value: 1.9 },
        { category: 'Finished Goods', value: 2.5 },
        { category: 'Spare Parts', value: 1.8 }
      ],
      'inventory-tolerance': [
        { category: 'Category A (Critical)', value: 95 },
        { category: 'Category B (Important)', value: 88 },
        { category: 'Category C (Standard)', value: 82 }
      ],
      'procurement-savings': [
        { category: 'Volume Discounts', value: 4.2 },
        { category: 'Strategic Sourcing', value: 3.8 },
        { category: 'Contract Negotiations', value: 2.5 },
        { category: 'Process Improvements', value: 2.0 }
      ],
      'sourcing-time': [
        { category: 'Direct Materials', value: 25 },
        { category: 'Indirect Materials', value: 32 },
        { category: 'Services', value: 35 },
        { category: 'Capital Equipment', value: 45 }
      ],
      'supplier-otif': [
        { category: 'Domestic Suppliers', value: 96 },
        { category: 'International Suppliers', value: 91 },
        { category: 'Strategic Partners', value: 98 },
        { category: 'Spot Suppliers', value: 88 }
      ]
    };

    const breakdown = breakdowns[metricId] || [];
    const total = breakdown.reduce((sum, item) => sum + item.value, 0);

    return breakdown.map(item => ({
      category: item.category,
      value: item.value,
      percentage: Math.round((item.value / total) * 100)
    }));
  }

  private static generateInsights(metricId: string): string[] {
    const insights: Record<string, string[]> = {
      'inventory-turnover': [
        'Inventory turnover ratio has improved over the last quarter',
        'Raw materials category shows highest turnover ratio at 2.8x',
        'Overall turnover performance is meeting target benchmarks',
        'Seasonal demand patterns continue to impact turnover rates'
      ],
      'inventory-tolerance': [
        'Critical items (Category A) maintain excellent tolerance at 95%',
        '5 percentage point improvement from previous quarter',
        'Standard items show room for planning optimization',
        'Weather-related delays impacted 8% of Category B items'
      ],
      'procurement-savings': [
        'Savings increased by 0.7% through improved negotiations',
        'Volume consolidation yielded highest savings contribution',
        'On track to exceed annual savings target of 10%',
        'Strategic sourcing initiatives showing strong ROI'
      ],
      'sourcing-time': [
        'Average cycle reduced by 12.5% year-over-year',
        'Direct materials sourcing most efficient at 25 days',
        'Digital procurement tools reducing processing time',
        'Capital equipment sourcing requires process review'
      ],
      'supplier-otif': [
        'Strategic partners maintain 98% OTIF performance',
        '3 percentage point improvement from previous quarter',
        'Domestic suppliers outperforming international by 5%',
        'Real-time tracking improving delivery predictability'
      ]
    };

    return insights[metricId] || [];
  }

  private static generateRecommendations(metricId: string): string[] {
    const recommendations: Record<string, string[]> = {
      'inventory-turnover': [
        'Focus on increasing consumption rate for slow-moving items',
        'Optimize average inventory levels to improve turnover ratio',
        'Explore vendor-managed inventory for select suppliers',
        'Use predictive analytics to maintain optimal inventory levels'
      ],
      'inventory-tolerance': [
        'Focus improvement efforts on Category B and C items',
        'Enhance demand forecasting accuracy with AI tools',
        'Collaborate with suppliers on lead time reduction',
        'Implement buffer stock optimization algorithms'
      ],
      'procurement-savings': [
        'Expand strategic sourcing to additional categories',
        'Increase supplier consolidation opportunities',
        'Leverage market intelligence for better negotiations',
        'Implement should-cost modeling for major purchases'
      ],
      'sourcing-time': [
        'Standardize capital equipment approval workflow',
        'Expand e-procurement platform to more categories',
        'Automate routine purchase order creation',
        'Pre-qualify more suppliers to reduce evaluation time'
      ],
      'supplier-otif': [
        'Develop improvement plans with underperforming suppliers',
        'Increase use of strategic partners for critical items',
        'Implement supplier scorecards with OTIF as key metric',
        'Consider nearshoring to reduce international delivery variability'
      ]
    };

    return recommendations[metricId] || [];
  }
}
