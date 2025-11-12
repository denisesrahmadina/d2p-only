// TODO: Replace with agentConsoleService when integration is ready
// This is a mock AI agent for demand forecasting and suggestions

export interface ForecastSuggestion {
  material_id: string;
  suggested_qty: number;
  confidence: number;
  reasoning: string;
  factors: string[];
}

export interface AnomalyDetection {
  material_id: string;
  period: string;
  anomaly_type: string;
  severity: string;
  description: string;
  recommended_action: string;
}

export interface BudgetInsight {
  category: string;
  insight_type: string;
  message: string;
  impact: string;
  recommendation: string;
}

export class DemandForecastAgent {
  /**
   * Generate AI-powered forecast suggestions based on historical data
   */
  static async generateForecastSuggestions(
    historicalData: any[],
    targetPeriod: string
  ): Promise<ForecastSuggestion[]> {
    // TODO: Replace with agentConsoleService when integration is ready
    // Simulate AI analysis

    if (!historicalData || historicalData.length === 0) {
      return [];
    }

    const suggestions: ForecastSuggestion[] = [];

    // Group by material
    const materialMap = new Map<string, number[]>();
    historicalData.forEach(item => {
      const existing = materialMap.get(item.material_id) || [];
      existing.push(Number(item.demand_qty) || 0);
      materialMap.set(item.material_id, existing);
    });

    // Generate suggestions for each material
    materialMap.forEach((quantities, materialId) => {
      const avg = quantities.reduce((a, b) => a + b, 0) / quantities.length;
      const max = Math.max(...quantities);
      const min = Math.min(...quantities);
      const variance = Math.sqrt(
        quantities.reduce((sum, qty) => sum + Math.pow(qty - avg, 2), 0) / quantities.length
      );

      // Calculate trend
      const trend = quantities.length > 1
        ? ((quantities[quantities.length - 1] - quantities[0]) / quantities[0]) * 100
        : 0;

      // Determine confidence based on variance and trend
      const confidence = Math.max(0.5, Math.min(0.95, 1 - (variance / avg)));

      // Generate suggestion with reasoning
      let suggestedQty = Math.round(avg * 1.1); // Base: 10% above average
      let reasoning = `Based on ${quantities.length} historical data points`;
      const factors: string[] = [];

      if (trend > 10) {
        suggestedQty = Math.round(avg * 1.25);
        reasoning += `, upward trend detected (+${trend.toFixed(1)}%)`;
        factors.push('Growing demand trend');
      } else if (trend < -10) {
        suggestedQty = Math.round(avg * 0.9);
        reasoning += `, downward trend detected (${trend.toFixed(1)}%)`;
        factors.push('Declining demand trend');
      }

      if (variance / avg > 0.5) {
        factors.push('High variability in historical data');
        reasoning += ', high variability observed';
      }

      if (max > avg * 1.5) {
        suggestedQty = Math.max(suggestedQty, Math.round(max * 0.8));
        factors.push('Previous demand spikes considered');
        reasoning += ', accounting for peak demand';
      }

      factors.push(`Average: ${Math.round(avg)} units`);
      factors.push(`Range: ${Math.round(min)} - ${Math.round(max)} units`);

      suggestions.push({
        material_id: materialId,
        suggested_qty: suggestedQty,
        confidence: Number(confidence.toFixed(2)),
        reasoning,
        factors
      });
    });

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Detect anomalies in forecast data
   */
  static async detectAnomalies(forecastData: any[]): Promise<AnomalyDetection[]> {
    // TODO: Replace with agentConsoleService when integration is ready

    if (!forecastData || forecastData.length === 0) {
      return [];
    }

    const anomalies: AnomalyDetection[] = [];

    // Group by material
    const materialMap = new Map<string, any[]>();
    forecastData.forEach(item => {
      const existing = materialMap.get(item.material_id) || [];
      existing.push(item);
      materialMap.set(item.material_id, existing);
    });

    // Check for anomalies
    materialMap.forEach((items, materialId) => {
      const quantities = items.map(i => Number(i.forecast_qty) || 0);
      const avg = quantities.reduce((a, b) => a + b, 0) / quantities.length;
      const stdDev = Math.sqrt(
        quantities.reduce((sum, qty) => sum + Math.pow(qty - avg, 2), 0) / quantities.length
      );

      items.forEach((item, idx) => {
        const qty = Number(item.forecast_qty) || 0;
        const zScore = stdDev > 0 ? Math.abs((qty - avg) / stdDev) : 0;

        // Detect outliers (z-score > 2)
        if (zScore > 2) {
          anomalies.push({
            material_id: materialId,
            period: item.period_value || item.requirement_date,
            anomaly_type: qty > avg ? 'Unusually High Demand' : 'Unusually Low Demand',
            severity: zScore > 3 ? 'High' : 'Medium',
            description: `Forecast quantity (${qty}) deviates significantly from average (${Math.round(avg)})`,
            recommended_action: qty > avg
              ? 'Verify demand spike and ensure adequate supply'
              : 'Review for potential data entry error or demand reduction'
          });
        }

        // Detect sudden changes
        if (idx > 0) {
          const prevQty = Number(items[idx - 1].forecast_qty) || 0;
          const change = prevQty > 0 ? ((qty - prevQty) / prevQty) * 100 : 0;

          if (Math.abs(change) > 50) {
            anomalies.push({
              material_id: materialId,
              period: item.period_value || item.requirement_date,
              anomaly_type: 'Sudden Change',
              severity: Math.abs(change) > 100 ? 'High' : 'Medium',
              description: `${change > 0 ? 'Increase' : 'Decrease'} of ${Math.abs(change).toFixed(1)}% from previous period`,
              recommended_action: 'Verify forecast accuracy and investigate cause of change'
            });
          }
        }
      });
    });

    return anomalies;
  }

  /**
   * Generate budget insights and recommendations
   */
  static async generateBudgetInsights(
    consolidatedData: any[],
    budgetLimit: number
  ): Promise<BudgetInsight[]> {
    // TODO: Replace with agentConsoleService when integration is ready

    if (!consolidatedData || consolidatedData.length === 0) {
      return [];
    }

    const insights: BudgetInsight[] = [];
    const totalValue = consolidatedData.reduce((sum, item) => sum + (Number(item.total_value) || 0), 0);

    // Budget utilization
    const utilization = (totalValue / budgetLimit) * 100;

    if (utilization > 100) {
      insights.push({
        category: 'Budget',
        insight_type: 'Over Budget',
        message: `Total forecast (${totalValue.toLocaleString()}) exceeds budget by ${(utilization - 100).toFixed(1)}%`,
        impact: 'Critical',
        recommendation: 'Consider reducing forecast quantities or requesting budget increase'
      });
    } else if (utilization > 90) {
      insights.push({
        category: 'Budget',
        insight_type: 'High Utilization',
        message: `Budget utilization at ${utilization.toFixed(1)}% - limited headroom for adjustments`,
        impact: 'High',
        recommendation: 'Monitor closely and prioritize critical materials'
      });
    } else if (utilization < 70) {
      insights.push({
        category: 'Budget',
        insight_type: 'Under Utilization',
        message: `Budget utilization at ${utilization.toFixed(1)}% - significant headroom available`,
        impact: 'Low',
        recommendation: 'Consider expanding forecast or reallocating budget'
      });
    }

    // Material concentration
    const sortedByValue = [...consolidatedData].sort((a, b) =>
      (Number(b.total_value) || 0) - (Number(a.total_value) || 0)
    );

    const top10Value = sortedByValue
      .slice(0, Math.min(10, sortedByValue.length))
      .reduce((sum, item) => sum + (Number(item.total_value) || 0), 0);

    const concentration = (top10Value / totalValue) * 100;

    if (concentration > 80) {
      insights.push({
        category: 'Risk',
        insight_type: 'High Concentration',
        message: `Top 10 materials account for ${concentration.toFixed(1)}% of budget`,
        impact: 'Medium',
        recommendation: 'Diversify procurement to reduce dependency risk'
      });
    }

    // Efficiency opportunities
    const lowValueItems = consolidatedData.filter(item => (Number(item.total_value) || 0) < 10000);
    if (lowValueItems.length > consolidatedData.length * 0.5) {
      insights.push({
        category: 'Efficiency',
        insight_type: 'Consolidation Opportunity',
        message: `${lowValueItems.length} low-value items identified`,
        impact: 'Medium',
        recommendation: 'Consider bundling low-value items to reduce procurement overhead'
      });
    }

    return insights;
  }

  /**
   * Provide justification for manual entries
   */
  static async justifyManualEntry(
    material_id: string,
    manualQty: number,
    erpQty: number
  ): Promise<string> {
    // TODO: Replace with agentConsoleService when integration is ready

    const difference = manualQty - erpQty;
    const percentChange = erpQty > 0 ? (difference / erpQty) * 100 : 100;

    if (Math.abs(percentChange) < 10) {
      return `Manual adjustment aligns closely with ERP forecast (${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}% variance)`;
    } else if (percentChange > 50) {
      return `Significant increase from ERP forecast - may indicate new project requirements, planned expansion, or anticipated market changes`;
    } else if (percentChange < -50) {
      return `Substantial reduction from ERP forecast - could reflect efficiency improvements, process optimization, or reduced operational scope`;
    } else if (percentChange > 0) {
      return `Moderate increase from ERP forecast - likely accounting for growth projections or buffer stock requirements`;
    } else {
      return `Moderate reduction from ERP forecast - possibly due to improved inventory management or refined demand estimation`;
    }
  }

  /**
   * Suggest optimal inventory levels
   */
  static async suggestOptimalStock(
    material_id: string,
    currentStock: number,
    averageDemand: number,
    leadTime: number
  ): Promise<{ min: number; max: number; reorder: number; reasoning: string }> {
    // TODO: Replace with agentConsoleService when integration is ready

    // Simple EOQ-inspired calculation
    const safetyStock = Math.ceil(averageDemand * 0.2); // 20% safety buffer
    const reorderPoint = Math.ceil((averageDemand / 30) * leadTime) + safetyStock;
    const maxStock = Math.ceil(reorderPoint * 2);
    const minStock = safetyStock;

    let reasoning = `Based on average demand of ${averageDemand} units/month and ${leadTime}-day lead time. `;

    if (currentStock < minStock) {
      reasoning += `Current stock (${currentStock}) is below minimum - immediate replenishment recommended.`;
    } else if (currentStock < reorderPoint) {
      reasoning += `Current stock (${currentStock}) is below reorder point - initiate procurement soon.`;
    } else if (currentStock > maxStock) {
      reasoning += `Current stock (${currentStock}) exceeds maximum - consider reducing orders or reallocation.`;
    } else {
      reasoning += `Current stock (${currentStock}) is within optimal range.`;
    }

    return {
      min: minStock,
      max: maxStock,
      reorder: reorderPoint,
      reasoning
    };
  }
}

export default DemandForecastAgent;
