import { supabase } from '../supabaseClient';

export interface MarketIntelligence {
  id: string;
  category: 'commodity' | 'supplier' | 'geopolitical' | 'regulatory' | 'market_pricing' | 'embargo' | 'vendor_performance' | 'stock_market';
  title: string;
  summary: string;
  impact: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
  relevantMaterials?: string[];
  publishedDate: string;
  source: string;
  aiInsights?: {
    impactAssessment: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    recommendedActions: string[];
    confidenceScore: number;
  };
}

export interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  type: 'commodity_price' | 'supplier_disruption' | 'policy_change' | 'demand_shift';
  parameters: Record<string, any>;
  impact: ScenarioImpact;
}

export interface ScenarioImpact {
  financialImpact: number;
  procurementDelay: number;
  inventoryRisk: string;
  mitigationActions: string[];
  affectedBUs: string[];
  timeline: string;
}

export interface PeriodFilter {
  type: 'yearly' | 'monthly' | 'dateRange';
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
}

export class StrategicIntelligenceService {
  static async getMarketIntelligence(periodFilter?: PeriodFilter): Promise<MarketIntelligence[]> {
    return this.getMockMarketIntelligence();
  }

  private static mapMiTypeToCategory(miType: string): 'commodity' | 'supplier' | 'geopolitical' | 'regulatory' | 'market_pricing' | 'embargo' | 'vendor_performance' | 'stock_market' {
    const typeMapping: Record<string, 'commodity' | 'supplier' | 'geopolitical' | 'regulatory' | 'market_pricing' | 'embargo' | 'vendor_performance' | 'stock_market'> = {
      'commodity': 'commodity',
      'price': 'market_pricing',
      'pricing': 'market_pricing',
      'supplier': 'supplier',
      'vendor': 'vendor_performance',
      'geopolitical': 'geopolitical',
      'embargo': 'embargo',
      'restriction': 'embargo',
      'regulatory': 'regulatory',
      'policy': 'regulatory',
      'stock': 'stock_market',
      'market': 'stock_market'
    };
    return typeMapping[miType?.toLowerCase()] || 'commodity';
  }

  private static assessImpactLevel(indicatorValue: number): 'high' | 'medium' | 'low' {
    const absValue = Math.abs(indicatorValue);
    if (absValue > 15) return 'high';
    if (absValue > 5) return 'medium';
    return 'low';
  }

  private static getMockMarketIntelligence(): MarketIntelligence[] {
    return [
      // Market Pricing Changes
      {
        id: 'ai-001',
        category: 'market_pricing',
        title: 'Indonesian Coal Benchmark Price Rises 12% Amid Regional Demand',
        summary: 'Indonesian Coal Price (ICP) reference increased to USD 142/ton for December delivery. Regional power plants in Java and Sumatra competing for limited domestic supply as export quotas tighten.',
        impact: 'high',
        trend: 'up',
        relevantMaterials: ['Coal', 'Fuel', 'Energy'],
        publishedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Reuters Energy',
        aiInsights: {
          impactAssessment: 'PLN Indonesia Power will face 8-12% increase in fuel procurement costs across coal-fired units. PLTU Suralaya and PLTU Paiton most affected with combined additional cost of IDR 45B per month.',
          riskLevel: 'High',
          recommendedActions: [
            'Accelerate negotiations for Q1 2026 coal contracts at current rates',
            'Review hedging options with finance team by Dec 15',
            'Increase buffer stock at Suralaya and Paiton by 15 days',
            'Explore alternative suppliers in Kalimantan region'
          ],
          confidenceScore: 87
        }
      },

      // Regional Embargoes
      {
        id: 'ai-002',
        category: 'embargo',
        title: 'Surabaya Port Implements Temporary Import Restrictions on Industrial Equipment',
        summary: 'Tanjung Perak Port authority announces 45-day enhanced inspection protocol for imported machinery and electrical components. Affects shipments from 6 Southeast Asian countries due to counterfeit concerns.',
        impact: 'medium',
        trend: 'down',
        relevantMaterials: ['Turbines', 'Transformers', 'Electrical Components'],
        publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Indonesia Customs Authority',
        aiInsights: {
          impactAssessment: 'UBP Gresik and UBP Priok will experience 2-3 week delays on spare parts shipments. Critical turbine components for Q4 maintenance may be delayed, potentially affecting scheduled outages.',
          riskLevel: 'Medium',
          recommendedActions: [
            'Divert urgent shipments through Jakarta or Semarang ports',
            'Coordinate with customs broker for pre-clearance documentation',
            'Review Q4 maintenance schedule and identify critical path items',
            'Maintain emergency stock of high-priority components at affected units'
          ],
          confidenceScore: 82
        }
      },

      // Vendor Performance News - Positive
      {
        id: 'ai-003',
        category: 'vendor_performance',
        title: 'PT Krakatau Steel Achieves ISO 9001:2025 Certification, Delivery Times Improve 18%',
        summary: 'Major steel supplier reports significant quality improvements and faster turnaround. Company invested USD 12M in automated production lines at Cilegon facility, now capable of 30% higher output with better consistency.',
        impact: 'low',
        trend: 'up',
        relevantMaterials: ['Steel', 'Construction Materials', 'Structural Components'],
        publishedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Indonesia Manufacturing News',
        aiInsights: {
          impactAssessment: 'Positive development for infrastructure projects at UBP Barru and UBP Pesanggaran. Improved delivery reliability reduces buffer stock requirements and project delays. Estimated cost savings of IDR 2.3B annually through reduced expediting fees.',
          riskLevel: 'Low',
          recommendedActions: [
            'Consider increasing order volume with Krakatau Steel for ongoing projects',
            'Renegotiate framework agreement to capture improved lead times',
            'Schedule supplier audit to verify new capabilities',
            'Add to preferred vendor list for 2026 construction projects'
          ],
          confidenceScore: 91
        }
      },

      // Vendor Performance News - Negative
      {
        id: 'ai-004',
        category: 'vendor_performance',
        title: 'Singapore-Based Turbine Maintenance Firm Faces Financial Difficulties',
        summary: 'Asia Power Services Pte Ltd reported Q3 losses of USD 8.4M and delayed payments to subcontractors. Company provides maintenance services for 40% of gas turbine fleet across Indonesia. Credit rating downgraded to B+ with negative outlook.',
        impact: 'high',
        trend: 'down',
        relevantMaterials: ['Gas Turbines', 'Maintenance Services', 'Spare Parts'],
        publishedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Singapore Business Times',
        aiInsights: {
          impactAssessment: 'Critical risk to PLTG Muara Karang and PLTG Priok maintenance schedules. Company holds IDR 125B in active service contracts through 2026. Service disruption could impact 850 MW of gas generation capacity.',
          riskLevel: 'High',
          recommendedActions: [
            'Immediately identify alternative maintenance providers for critical units',
            'Review contract terms for performance guarantees and exit clauses',
            'Secure spare parts inventory currently held by vendor',
            'Escalate to executive team - recommend emergency procurement meeting',
            'Consider bringing maintenance in-house for Muara Karang unit'
          ],
          confidenceScore: 89
        }
      },

      // Stock Market Conditions
      {
        id: 'ai-005',
        category: 'stock_market',
        title: 'Jakarta Composite Index Gains 4.2%, Energy Sector Leads with Foreign Investment Inflow',
        summary: 'Indonesian stock market rallies on positive GDP growth data (5.8% YoY) and increased foreign portfolio investment. Energy and utilities sector up 6.7% with IDR 8.9T net buying. Analyst upgrades on renewable energy infrastructure spending.',
        impact: 'medium',
        trend: 'up',
        relevantMaterials: ['Investment', 'Financial Planning', 'Budget'],
        publishedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Jakarta Stock Exchange',
        aiInsights: {
          impactAssessment: 'Favorable market conditions for PLN Indonesia Power capital raising initiatives. Lower cost of capital for renewable energy projects. Positive sentiment may support FY2026 budget approvals and green energy transition funding.',
          riskLevel: 'Low',
          recommendedActions: [
            'Accelerate renewable energy project proposals while market sentiment is positive',
            'Coordinate with PLN parent on potential bond issuance timing',
            'Update investor relations materials with recent performance metrics',
            'Consider advancing timeline for solar farm projects in NTT and NTB regions'
          ],
          confidenceScore: 85
        }
      }
    ];
  }

  static async getNewsInsights(): Promise<MarketIntelligence[]> {
    try {
      const { data, error } = await supabase
        .from('ref_news_scraping')
        .select('*')
        .order('scraped_date', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (data && data.length > 0) {
        return data.map(item => ({
          id: item.news_id || item.id,
          category: 'geopolitical',
          title: item.title || item.headline,
          summary: item.summary || item.content?.substring(0, 200),
          impact: item.relevance_score > 0.7 ? 'high' : item.relevance_score > 0.4 ? 'medium' : 'low',
          trend: 'stable',
          relevantMaterials: item.related_materials || [],
          publishedDate: item.published_date || item.scraped_date,
          source: item.source || 'News'
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching news insights:', error);
      return [];
    }
  }

  static async runWhatIfScenario(scenarioType: string, parameters: Record<string, any>): Promise<ScenarioImpact> {
    await new Promise(resolve => setTimeout(resolve, 800));

    switch (scenarioType) {
      case 'commodity_price':
        return this.simulateCommodityPriceChange(parameters);
      case 'supplier_disruption':
        return this.simulateSupplierDisruption(parameters);
      case 'policy_change':
        return this.simulatePolicyChange(parameters);
      case 'demand_shift':
        return this.simulateDemandShift(parameters);
      default:
        return this.getDefaultImpact();
    }
  }

  private static simulateCommodityPriceChange(params: Record<string, any>): ScenarioImpact {
    const priceIncrease = params.priceIncrease || 10;
    const commodity = params.commodity || 'Coal';

    const baseImpact = 5000000;
    const financialImpact = baseImpact * (priceIncrease / 10);

    return {
      financialImpact: Math.round(financialImpact),
      procurementDelay: 0,
      inventoryRisk: priceIncrease > 15 ? 'High - Consider stockpiling' : 'Medium - Monitor closely',
      mitigationActions: [
        `Lock in long-term contracts at current rates`,
        `Explore alternative ${commodity} suppliers`,
        `Increase budget allocation by ${Math.round(priceIncrease * 0.8)}%`,
        `Review hedging strategies with finance team`
      ],
      affectedBUs: ['PLTU Suralaya', 'PLTU Paiton', 'Unit Semarang'],
      timeline: '3-6 months impact period'
    };
  }

  private static simulateSupplierDisruption(params: Record<string, any>): ScenarioImpact {
    const disruptionDays = params.disruptionDays || 30;
    const criticalSupplier = params.supplier || 'Primary Turbine Supplier';

    return {
      financialImpact: disruptionDays * 50000,
      procurementDelay: disruptionDays,
      inventoryRisk: disruptionDays > 45 ? 'Critical - Stockout risk' : 'High - Safety stock threatened',
      mitigationActions: [
        `Activate backup supplier agreements immediately`,
        `Expedite orders from alternative sources`,
        `Implement emergency procurement procedures`,
        `Coordinate with maintenance team to defer non-critical work`,
        `Consider air freight for critical components`
      ],
      affectedBUs: ['All generation units', 'HO Jakarta - Procurement'],
      timeline: `${disruptionDays} days disruption + ${Math.round(disruptionDays / 2)} days recovery`
    };
  }

  private static simulatePolicyChange(params: Record<string, any>): ScenarioImpact {
    const complianceCost = params.complianceCost || 2000000;
    const implementationMonths = params.months || 6;

    return {
      financialImpact: complianceCost,
      procurementDelay: implementationMonths * 7,
      inventoryRisk: 'Medium - New equipment required',
      mitigationActions: [
        `Establish compliance task force`,
        `Budget approval for ${(complianceCost / 1000000).toFixed(1)}M IDR`,
        `Identify certified suppliers for new requirements`,
        `Plan phased rollout across ${implementationMonths} months`,
        `Training programs for operations staff`
      ],
      affectedBUs: ['All power plants', 'HO Jakarta - Compliance'],
      timeline: `${implementationMonths} months implementation period`
    };
  }

  private static simulateDemandShift(params: Record<string, any>): ScenarioImpact {
    const demandChange = params.demandChange || 15;
    const direction = demandChange > 0 ? 'increase' : 'decrease';

    return {
      financialImpact: Math.abs(demandChange) * 150000,
      procurementDelay: Math.abs(demandChange) > 20 ? 14 : 7,
      inventoryRisk: direction === 'increase' ? 'High - Stockout potential' : 'Low - Excess inventory',
      mitigationActions: [
        `Revise forecast models immediately`,
        `${direction === 'increase' ? 'Accelerate' : 'Defer'} procurement orders`,
        `Coordinate with demand planning team`,
        `Review supplier capacity constraints`,
        `Update safety stock levels`
      ],
      affectedBUs: ['All units', 'HO Jakarta - Planning'],
      timeline: '2-4 weeks response time'
    };
  }

  private static getDefaultImpact(): ScenarioImpact {
    return {
      financialImpact: 0,
      procurementDelay: 0,
      inventoryRisk: 'Low',
      mitigationActions: [],
      affectedBUs: [],
      timeline: 'N/A'
    };
  }

  static getAvailableScenarios(): WhatIfScenario[] {
    return [
      {
        id: 'scenario-001',
        name: 'Coal Price Surge',
        description: '20% increase in coal prices due to supply constraints',
        type: 'commodity_price',
        parameters: { commodity: 'Coal', priceIncrease: 20 },
        impact: this.simulateCommodityPriceChange({ commodity: 'Coal', priceIncrease: 20 })
      },
      {
        id: 'scenario-002',
        name: 'Supplier Bankruptcy',
        description: 'Key supplier ceases operations unexpectedly',
        type: 'supplier_disruption',
        parameters: { supplier: 'Primary Turbine Supplier', disruptionDays: 60 },
        impact: this.simulateSupplierDisruption({ supplier: 'Primary Turbine Supplier', disruptionDays: 60 })
      },
      {
        id: 'scenario-003',
        name: 'Emission Regulation Change',
        description: 'New environmental standards require equipment upgrades',
        type: 'policy_change',
        parameters: { complianceCost: 5000000, months: 9 },
        impact: this.simulatePolicyChange({ complianceCost: 5000000, months: 9 })
      },
      {
        id: 'scenario-004',
        name: 'Demand Spike',
        description: '25% unexpected increase in electricity demand',
        type: 'demand_shift',
        parameters: { demandChange: 25 },
        impact: this.simulateDemandShift({ demandChange: 25 })
      }
    ];
  }

  private static applyPeriodFilter(query: any, periodFilter: PeriodFilter): any {
    if (periodFilter.type === 'yearly' && periodFilter.year) {
      const startDate = `${periodFilter.year}-01-01`;
      const endDate = `${periodFilter.year}-12-31`;
      query = query.gte('data_date', startDate).lte('data_date', endDate);
    } else if (periodFilter.type === 'monthly' && periodFilter.year && periodFilter.month) {
      const startDate = `${periodFilter.year}-${String(periodFilter.month).padStart(2, '0')}-01`;
      const lastDay = new Date(periodFilter.year, periodFilter.month, 0).getDate();
      const endDate = `${periodFilter.year}-${String(periodFilter.month).padStart(2, '0')}-${lastDay}`;
      query = query.gte('data_date', startDate).lte('data_date', endDate);
    } else if (periodFilter.type === 'dateRange' && periodFilter.startDate && periodFilter.endDate) {
      query = query.gte('data_date', periodFilter.startDate).lte('data_date', periodFilter.endDate);
    }
    return query;
  }
}
