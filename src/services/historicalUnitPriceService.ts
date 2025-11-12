import mockData from '../data/categoryManagerMockData.json';

export interface HistoricalUnitPrice {
  id: string;
  organization_id: string;
  business_unit: string;
  category_id: string | null;
  sku_code: string;
  sku_name: string;
  price_per_unit: number;
  unit_of_measure: string;
  purchase_date: string;
  vendor_name: string | null;
  quantity_purchased: number | null;
  total_value: number | null;
  period_month: number;
  period_year: number;
}

export interface UnitPriceInsight {
  id: string;
  organization_id: string;
  business_unit: string;
  category_id: string | null;
  sku_code: string;
  analysis_period_start: string;
  analysis_period_end: string;
  average_price: number;
  lowest_price: number;
  highest_price: number;
  price_trend: 'Rising' | 'Falling' | 'Stable';
  trend_percentage: number;
  insight_summary: string;
  action_plan: ActionPlan[];
  priority: 'High' | 'Medium' | 'Low';
}

export interface ActionPlan {
  action: string;
  impact: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface PriceDataPoint {
  period: string;
  year: number;
  month: number;
  price: number;
  businessUnit: string;
}

export interface SKUOption {
  code: string;
  name: string;
}

export interface PeriodOption {
  label: string;
  year: number;
  month: number;
}

export class HistoricalUnitPriceService {
  static async getHistoricalPrices(
    organizationId: string,
    categoryId?: string,
    skuCode?: string,
    businessUnit?: string,
    startYear?: number,
    endYear?: number
  ): Promise<HistoricalUnitPrice[]> {
    // Use mock data instead of Supabase
    let filtered = (mockData.historicalUnitPrices as HistoricalUnitPrice[]).filter(
      price => price.organization_id === organizationId
    );

    if (categoryId) {
      filtered = filtered.filter(price => price.category_id === categoryId);
    }
    if (skuCode) {
      filtered = filtered.filter(price => price.sku_code === skuCode);
    }
    if (businessUnit) {
      filtered = filtered.filter(price => price.business_unit === businessUnit);
    }
    if (startYear) {
      filtered = filtered.filter(price => price.period_year >= startYear);
    }
    if (endYear) {
      filtered = filtered.filter(price => price.period_year <= endYear);
    }

    // Sort by purchase_date
    return filtered.sort((a, b) =>
      new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime()
    );
  }

  static async getSKUsByCategory(
    organizationId: string,
    categoryId?: string
  ): Promise<SKUOption[]> {
    // Use mock data
    let filtered = (mockData.historicalUnitPrices as HistoricalUnitPrice[]).filter(
      price => price.organization_id === organizationId
    );

    if (categoryId) {
      filtered = filtered.filter(price => price.category_id === categoryId);
    }

    const uniqueSKUs = Array.from(
      new Map(filtered.map(item => [item.sku_code, item])).values()
    );

    return uniqueSKUs.map(m => ({
      code: m.sku_code,
      name: m.sku_name,
    }));
  }

  static async getAvailablePeriods(
    organizationId: string,
    categoryId?: string,
    skuCode?: string
  ): Promise<PeriodOption[]> {
    // Use mock data
    let filtered = (mockData.historicalUnitPrices as HistoricalUnitPrice[]).filter(
      price => price.organization_id === organizationId
    );

    if (categoryId) {
      filtered = filtered.filter(price => price.category_id === categoryId);
    }
    if (skuCode) {
      filtered = filtered.filter(price => price.sku_code === skuCode);
    }

    const uniquePeriods = Array.from(
      new Set(filtered.map(item => `${item.period_year}-${item.period_month}`))
    );

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return uniquePeriods
      .map(period => {
        const [year, month] = period.split('-').map(Number);
        return {
          label: `${monthNames[month - 1]} ${year}`,
          year,
          month,
        };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });
  }

  static async getBusinessUnits(
    organizationId: string,
    categoryId?: string
  ): Promise<string[]> {
    // Use mock data
    let filtered = (mockData.historicalUnitPrices as HistoricalUnitPrice[]).filter(
      price => price.organization_id === organizationId
    );

    if (categoryId) {
      filtered = filtered.filter(price => price.category_id === categoryId);
    }

    return Array.from(new Set(filtered.map(item => item.business_unit)));
  }

  static async getUnitPriceInsights(
    _organizationId: string,
    _categoryId?: string,
    _materialCode?: string,
    _businessUnit?: string
  ): Promise<UnitPriceInsight[]> {
    // Mock implementation - return empty array as this is not used in the component
    return [];
  }

  static formatPriceDataForChart(prices: HistoricalUnitPrice[]): PriceDataPoint[] {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return prices.map(price => ({
      period: `${monthNames[price.period_month - 1]} ${price.period_year}`,
      year: price.period_year,
      month: price.period_month,
      price: price.price_per_unit,
      businessUnit: price.business_unit,
    }));
  }

  static calculatePriceStatistics(prices: HistoricalUnitPrice[]): {
    average: number;
    lowest: number;
    highest: number;
    trend: 'Rising' | 'Falling' | 'Stable';
    trendPercentage: number;
  } {
    if (prices.length === 0) {
      return {
        average: 0,
        lowest: 0,
        highest: 0,
        trend: 'Stable',
        trendPercentage: 0,
      };
    }

    const priceValues = prices.map(p => p.price_per_unit);
    const average = priceValues.reduce((sum, price) => sum + price, 0) / priceValues.length;
    const lowest = Math.min(...priceValues);
    const highest = Math.max(...priceValues);

    let trend: 'Rising' | 'Falling' | 'Stable' = 'Stable';
    let trendPercentage = 0;

    if (prices.length >= 2) {
      const sortedPrices = [...prices].sort((a, b) => {
        if (a.period_year !== b.period_year) return a.period_year - b.period_year;
        return a.period_month - b.period_month;
      });

      const firstPrice = sortedPrices[0].price_per_unit;
      const lastPrice = sortedPrices[sortedPrices.length - 1].price_per_unit;
      trendPercentage = ((lastPrice - firstPrice) / firstPrice) * 100;

      if (trendPercentage > 5) {
        trend = 'Rising';
      } else if (trendPercentage < -5) {
        trend = 'Falling';
      } else {
        trend = 'Stable';
      }
    }

    return {
      average,
      lowest,
      highest,
      trend,
      trendPercentage,
    };
  }

  static generateActionPlan(
    trend: 'Rising' | 'Falling' | 'Stable',
    _trendPercentage: number,
    material: string
  ): ActionPlan[] {
    const actions: ActionPlan[] = [];

    if (trend === 'Rising') {
      actions.push({
        action: `Negotiate with vendors to secure better pricing for ${material}`,
        impact: `Potential to reduce costs by 5-8% through competitive negotiation`,
        priority: 'High',
      });
      actions.push({
        action: 'Explore alternative suppliers with competitive pricing',
        impact: 'Diversify supply base and create price competition',
        priority: 'High',
      });
      actions.push({
        action: 'Consider bulk purchasing to lock in current rates',
        impact: 'Hedge against further price increases',
        priority: 'Medium',
      });
    } else if (trend === 'Falling') {
      actions.push({
        action: 'Monitor market conditions for optimal purchasing window',
        impact: 'Time purchases to maximize cost savings',
        priority: 'Medium',
      });
      actions.push({
        action: 'Negotiate shorter-term contracts to benefit from declining prices',
        impact: 'Avoid locking into higher long-term prices',
        priority: 'Medium',
      });
      actions.push({
        action: 'Review inventory levels to avoid over-stocking at current prices',
        impact: 'Reduce carrying costs and obsolescence risk',
        priority: 'Low',
      });
    } else {
      actions.push({
        action: 'Establish long-term agreements to lock in stable pricing',
        impact: 'Ensure price predictability and budget certainty',
        priority: 'High',
      });
      actions.push({
        action: 'Implement volume-based pricing with preferred suppliers',
        impact: 'Leverage stable demand for better unit economics',
        priority: 'Medium',
      });
      actions.push({
        action: 'Standardize specifications to maintain purchasing efficiency',
        impact: 'Reduce complexity and improve procurement velocity',
        priority: 'Low',
      });
    }

    return actions;
  }

  static formatCurrency(value: number): string {
    if (value >= 1000000000) {
      return `Rp ${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `Rp ${(value / 1000).toFixed(2)}K`;
    }
    return `Rp ${value.toFixed(2)}`;
  }
}
