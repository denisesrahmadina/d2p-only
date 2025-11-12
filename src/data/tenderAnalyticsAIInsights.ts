// Mock AI Insights Data for Tender Analytics - Distribution Transformer (Tender 6)
// This provides comprehensive insights with action plans for all views

export interface AIInsight {
  id: string;
  module: string;
  page: string;
  view_mode?: string;
  context_id: string;
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
  created_at: string;
  updated_at: string;
}

export const tenderAnalyticsAIInsights: AIInsight[] = [
  // QUOTE DETAIL TAB - TABLE VIEW
  {
    id: 'insight-quote-table-001',
    module: 'tender_analytics',
    page: 'quote_detail',
    view_mode: 'table',
    context_id: '6',
    insight_type: 'Pricing',
    severity: 'High',
    risk_category: 'Financial',
    title: 'Schneider Electric Quote 18% Above Budget - Negotiate or Switch',
    description: 'Schneider Electric\'s total bid of IDR 699M significantly exceeds the engineering estimate by IDR 106M (18% premium). While their brand reputation is strong, this price point requires immediate negotiation. General Electric offers comparable technical specifications at IDR 644M, representing IDR 55M savings opportunity.',
    affected_section: 'Quote Comparison Analysis',
    key_metrics: {
      schneider_total: 699000000,
      engineering_estimate: 593000000,
      variance_amount: 106000000,
      variance_percentage: 18,
      ge_alternative: 644000000,
      potential_savings: 55000000
    },
    action_plan: [
      'Schedule urgent negotiation meeting with Schneider Electric within 48 hours',
      'Request detailed cost breakdown justifying premium pricing on core, coils, and insulation',
      'Benchmark Schneider\'s pricing against GE and ABB component-by-component',
      'Prepare negotiation leverage using GE\'s competitive offer as baseline',
      'Target 10-12% price reduction to bring total to IDR 620-630M range',
      'Set hard deadline for best-and-final offer submission (5 business days)',
      'If Schneider maintains price, pivot to General Electric as primary choice'
    ],
    confidence_score: 92,
    auto_generated: true,
    user_action: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'insight-quote-table-002',
    module: 'tender_analytics',
    page: 'quote_detail',
    view_mode: 'table',
    context_id: '6',
    insight_type: 'Quality',
    severity: 'Medium',
    risk_category: 'Performance',
    title: 'All Bidders Meet Minimum Technical Standards - GE Leads Quality Metrics',
    description: 'Technical evaluation shows all three suppliers meet the 90% compliance threshold. General Electric achieves highest score at 98%, followed by Schneider (95%) and ABB (92%). GE\'s superior performance in efficiency ratings, insulation materials, and IEC testing protocols provides technical advantage with minimal price premium.',
    affected_section: 'Technical Compliance Review',
    key_metrics: {
      ge_compliance: 98,
      schneider_compliance: 95,
      abb_compliance: 92,
      minimum_threshold: 90,
      ge_price_premium: 9
    },
    action_plan: [
      'Request detailed test certificates from GE validating 98% compliance claim',
      'Compare warranty coverage: standard terms vs extended protection options',
      'Verify GE\'s local Indonesia service network and spare parts inventory',
      'Conduct reference checks with 3 existing GE transformer installations',
      'Review GE\'s manufacturing quality certifications (ISO 9001, IEC 60076)',
      'Evaluate lead time: confirm 8-week delivery schedule is achievable'
    ],
    confidence_score: 88,
    auto_generated: true,
    user_action: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'insight-quote-table-003',
    module: 'tender_analytics',
    page: 'quote_detail',
    view_mode: 'table',
    context_id: '6',
    insight_type: 'Strategic',
    severity: 'High',
    risk_category: 'Financial',
    title: 'Recommend General Electric as Winner - Optimal Value Proposition',
    description: 'Comprehensive analysis indicates General Electric delivers best combination of technical excellence (98% compliance), competitive pricing (IDR 644M, only 9% above estimate), and proven reliability. Schneider\'s 18% premium not justified by technical superiority. ABB\'s aggressive pricing raises quality sustainability concerns.',
    affected_section: 'Final Recommendation',
    key_metrics: {
      recommended_supplier: 'General Electric',
      technical_score: 98,
      price_variance: 9,
      total_bid: 644000000,
      savings_vs_schneider: 55000000
    },
    action_plan: [
      'Issue conditional award letter to General Electric within 3 business days',
      'Negotiate final terms: target 5% additional discount through volume commitment',
      'Extend warranty from 24 to 36 months at no additional cost',
      'Include mandatory on-site commissioning and operations training',
      'Structure contract with liquidated damages clause (0.5% per week delay)',
      'Add option clause for 10 additional units at locked pricing for 12 months',
      'Require performance bond equal to 10% of contract value'
    ],
    confidence_score: 90,
    auto_generated: true,
    user_action: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // QUOTE DETAIL TAB - GRAPH VIEW
  {
    id: 'insight-quote-graph-001',
    module: 'tender_analytics',
    page: 'quote_detail',
    view_mode: 'graph',
    context_id: '6',
    insight_type: 'Cost_Optimization',
    severity: 'High',
    risk_category: 'Financial',
    title: 'Core Material Costs Show 22% Variance - Target for Negotiation',
    description: 'Visual analysis reveals core material represents largest cost variance across suppliers. Schneider\'s core cost of IDR 230M is 22% higher than estimate (IDR 188M), while GE maintains only 7% premium at IDR 201M. This component offers highest negotiation leverage potential.',
    affected_section: 'Component Cost Breakdown',
    key_metrics: {
      schneider_core_cost: 230000000,
      ge_core_cost: 201000000,
      estimate_core_cost: 188000000,
      schneider_variance_pct: 22,
      ge_variance_pct: 7,
      negotiation_target: 15000000
    },
    action_plan: [
      'Deep-dive into core material specifications: silicon steel grade and lamination thickness',
      'Request material sourcing details: domestic vs imported silicon steel',
      'Compare core loss guarantees across all three suppliers (no-load and full-load)',
      'Negotiate with Schneider to match GE\'s core pricing (IDR 29M reduction)',
      'If using premium materials, request energy efficiency calculations justifying cost',
      'Consider hybrid approach: Schneider coils + GE core for cost optimization'
    ],
    confidence_score: 87,
    auto_generated: true,
    user_action: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'insight-quote-graph-002',
    module: 'tender_analytics',
    page: 'quote_detail',
    view_mode: 'graph',
    context_id: '6',
    insight_type: 'Risk',
    severity: 'Medium',
    risk_category: 'Performance',
    title: 'ABB\'s Lower Secondary Coil Cost May Indicate Aluminum vs Copper',
    description: 'Graph comparison shows ABB\'s secondary coil pricing at IDR 110M is significantly below GE (IDR 148M) and Schneider (IDR 152M). This 26% discount may indicate use of aluminum conductors instead of copper, which could impact long-term efficiency and lifespan.',
    affected_section: 'Coil Material Analysis',
    key_metrics: {
      abb_secondary_coil: 110000000,
      ge_secondary_coil: 148000000,
      cost_difference_pct: 26,
      copper_vs_aluminum_efficiency_gap: 1.2
    },
    action_plan: [
      'Request explicit confirmation from ABB: copper or aluminum conductor material',
      'If aluminum, calculate lifecycle cost impact over 25-year transformer lifespan',
      'Review technical specifications: conductor cross-section and current density',
      'Assess heat dissipation and cooling requirements for aluminum vs copper design',
      'Verify ABB\'s warranty covers conductor material degradation',
      'Consider rejecting ABB bid if aluminum is confirmed without lifecycle cost adjustment'
    ],
    confidence_score: 78,
    auto_generated: true,
    user_action: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // EVALUATION PROCESS - BID COMPARISON VIEW
  {
    id: 'insight-eval-bidcomp-001',
    module: 'tender_analytics',
    page: 'evaluation_process',
    view_mode: 'bid-comparison',
    context_id: '6',
    insight_type: 'Negotiation',
    severity: 'High',
    risk_category: 'Financial',
    title: 'Strong Competitive Position - Leverage for 8-10% Discount',
    description: 'Three qualified bidders with only IDR 55M (8.5%) price spread creates ideal negotiation environment. Current market conditions favor buyers. Suppliers are eager to secure power sector contracts for portfolio diversification. Use this leverage to achieve 8-10% savings from current GE bid.',
    affected_section: 'Competitive Dynamics',
    key_metrics: {
      total_bidders: 3,
      price_spread: 55000000,
      spread_percentage: 8.5,
      target_discount_pct: 10,
      potential_savings: 64000000
    },
    action_plan: [
      'Launch parallel negotiations with all three suppliers simultaneously',
      'Share anonymized competitive landscape: "3 qualified bids ranging IDR 644M - IDR 699M"',
      'Propose bundled package: this transformer + 2 future units for volume discount',
      'Negotiate payment terms: offer 60-day payment extension for 3% price reduction',
      'Bundle 3-year preventive maintenance contract for additional 2% discount',
      'Set firm deadline for best-and-final offers: Friday 5 PM (3 days from now)',
      'Communicate final decision will be made by Monday based on total value proposition'
    ],
    confidence_score: 85,
    auto_generated: true,
    user_action: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'insight-eval-bidcomp-002',
    module: 'tender_analytics',
    page: 'evaluation_process',
    view_mode: 'bid-comparison',
    context_id: '6',
    insight_type: 'Timeline',
    severity: 'Medium',
    risk_category: 'Delivery',
    title: 'Tight Q1 2025 Installation Window - Expedite Decision by Nov 24',
    description: 'Project timeline requires transformer delivery by January 15, 2025 for Q1 commissioning target. With 8-week manufacturing lead time, contract award must occur by November 24, 2024 (14 days from now). Any delay pushes installation to Q2, impacting grid reliability improvement KPIs.',
    affected_section: 'Project Schedule',
    key_metrics: {
      target_delivery: '2025-01-15',
      manufacturing_leadtime: 56,
      decision_deadline: '2024-11-24',
      days_remaining: 14,
      risk_level: 'Medium'
    },
    action_plan: [
      'Establish firm decision deadline: November 24, 2024 (no extensions)',
      'Complete technical evaluation by November 15 (5 days)',
      'Execute negotiations November 16-22 with daily progress tracking',
      'Prepare parallel approval documents to fast-track management sign-off',
      'Schedule emergency procurement committee meeting for November 23',
      'Pre-draft purchase order with all terms except pricing for rapid execution',
      'Plan factory acceptance test (FAT) for December 20 to validate quality'
    ],
    confidence_score: 87,
    auto_generated: true,
    user_action: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // EVALUATION PROCESS - COST COMPARISON VIEW
  {
    id: 'insight-eval-costcomp-001',
    module: 'tender_analytics',
    page: 'evaluation_process',
    view_mode: 'cost-comparison',
    context_id: '6',
    insight_type: 'Pricing',
    severity: 'High',
    risk_category: 'Financial',
    title: 'Insulation Material Pricing Inconsistency - Validate Specifications',
    description: 'Cost comparison reveals 35% variance in insulation pricing: Schneider IDR 54M, GE IDR 40M, ABB IDR 35M. Such variance suggests different material grades (Class A vs Class F) or manufacturing processes. Lower pricing may indicate inferior thermal performance.',
    affected_section: 'Insulation System Costs',
    key_metrics: {
      schneider_insulation: 54000000,
      ge_insulation: 40000000,
      abb_insulation: 35000000,
      variance_pct: 35,
      class_f_vs_class_a_lifespan_years: 10
    },
    action_plan: [
      'Request detailed insulation system specifications from all suppliers',
      'Verify insulation class rating: Class F (155°C) vs Class H (180°C)',
      'Compare thermal aging characteristics and expected service life',
      'Review moisture resistance and environmental durability ratings',
      'Conduct lifecycle cost analysis: initial price vs maintenance over 25 years',
      'Mandate minimum Class F insulation as baseline requirement'
    ],
    confidence_score: 82,
    auto_generated: true,
    user_action: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // EVALUATION PROCESS - COST HEATMAP VIEW
  {
    id: 'insight-eval-heatmap-001',
    module: 'tender_analytics',
    page: 'evaluation_process',
    view_mode: 'cost-heatmap',
    context_id: '6',
    insight_type: 'Cost_Optimization',
    severity: 'Medium',
    risk_category: 'Financial',
    title: 'Primary Coil Pricing Cluster Reveals Market Standard - Outliers Need Review',
    description: 'Heatmap visualization shows primary coil pricing tightly clustered: GE IDR 133M, Schneider IDR 138M (3.8% variance). However, ABB\'s IDR 118M represents 11% discount. This outlier warrants investigation for material quality or winding technique differences.',
    affected_section: 'Component Price Distribution',
    key_metrics: {
      ge_primary_coil: 133000000,
      schneider_primary_coil: 138000000,
      abb_primary_coil: 118000000,
      market_standard_range: 5,
      abb_outlier_variance: 11
    },
    action_plan: [
      'Analyze ABB\'s primary coil winding configuration: layer vs disc winding',
      'Verify copper conductor grade and purity percentage (99.9% vs 99.5%)',
      'Compare short-circuit withstand capability across all suppliers',
      'Request impulse voltage test results and voltage regulation performance',
      'Assess manufacturing quality: automated vs manual winding process',
      'If quality is equivalent, challenge GE and Schneider to match ABB\'s pricing'
    ],
    confidence_score: 75,
    auto_generated: true,
    user_action: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // EVALUATION PROCESS - NEGOTIATION ASSISTANT VIEW
  {
    id: 'insight-eval-negotiate-001',
    module: 'tender_analytics',
    page: 'evaluation_process',
    view_mode: 'negotiation-assistant',
    context_id: '6',
    insight_type: 'Negotiation',
    severity: 'High',
    risk_category: 'Financial',
    title: 'Multi-Round Negotiation Strategy - Start with Non-Price Terms',
    description: 'Optimize negotiation sequence by addressing non-price terms first (warranty, payment, delivery) to build rapport and extract maximum value before final pricing discussion. This approach historically yields 12-15% better outcomes than price-first negotiations.',
    affected_section: 'Negotiation Tactics',
    key_metrics: {
      recommended_rounds: 3,
      expected_improvement_pct: 12,
      non_price_value_potential: 15000000,
      total_savings_target: 77000000
    },
    action_plan: [
      'Round 1 (Days 1-2): Negotiate warranty extension from 24 to 36 months',
      'Round 1 (Days 1-2): Secure payment terms: 30% advance, 60% on delivery, 10% after commissioning',
      'Round 1 (Days 1-2): Lock delivery schedule with penalty clause (0.5% per week)',
      'Round 2 (Days 3-4): Introduce volume commitment: 10 units over 18 months for bundled discount',
      'Round 2 (Days 3-4): Negotiate free on-site training and commissioning support',
      'Round 3 (Day 5): Final pricing discussion leveraging all previous concessions gained',
      'Round 3 (Day 5): Request best-and-final offer with breakdown showing value adds'
    ],
    confidence_score: 88,
    auto_generated: true,
    user_action: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'insight-eval-negotiate-002',
    module: 'tender_analytics',
    page: 'evaluation_process',
    view_mode: 'negotiation-assistant',
    context_id: '6',
    insight_type: 'Strategic',
    severity: 'Medium',
    risk_category: 'Operational',
    title: 'Local Content Requirements - Use as Negotiation Lever',
    description: 'Indonesia power sector regulations favor suppliers with local manufacturing or assembly. GE operates Jakarta assembly facility (40% local content). Schneider imports fully assembled units. Use regulatory compliance as negotiation angle to secure better GE pricing or force Schneider local partnership.',
    affected_section: 'Regulatory Leverage',
    key_metrics: {
      ge_local_content_pct: 40,
      schneider_local_content_pct: 15,
      abb_local_content_pct: 25,
      regulatory_preference_score: 10
    },
    action_plan: [
      'Verify current TKDN (local content) requirements for power equipment procurement',
      'Calculate local content scoring advantage in evaluation matrix',
      'Request formal local content certification from all suppliers',
      'Negotiate with Schneider: require local assembly partnership for contract eligibility',
      'Leverage GE\'s Jakarta facility as value-add justifying their pricing',
      'Structure contract to include technology transfer and local workforce training'
    ],
    confidence_score: 80,
    auto_generated: true,
    user_action: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // SOURCING SUMMARY TAB
  {
    id: 'insight-sourcing-001',
    module: 'tender_analytics',
    page: 'sourcing_summary',
    view_mode: undefined,
    context_id: '6',
    insight_type: 'Strategic',
    severity: 'High',
    risk_category: 'Financial',
    title: 'Tender Execution Excellence - Achieved 3 Competitive Bids Below Budget Ceiling',
    description: 'Sourcing process successfully attracted three tier-1 suppliers with bids ranging IDR 644M - IDR 699M, all within budget envelope. This competitive tension represents optimal market response, validating tender structure and technical specifications. Strong position for final negotiation.',
    affected_section: 'Overall Sourcing Performance',
    key_metrics: {
      total_bidders: 3,
      qualified_bidders: 3,
      budget_ceiling: 750000000,
      lowest_bid: 644000000,
      budget_utilization_pct: 86,
      competitive_tension_score: 9.2
    },
    action_plan: [
      'Document sourcing success factors for future transformer procurements',
      'Standardize tender technical specifications based on this template',
      'Maintain relationship with all three suppliers for future projects',
      'Execute award decision by November 24 to maintain supplier engagement',
      'Plan post-award debrief sessions with unsuccessful bidders',
      'Update supplier performance database with evaluation scores'
    ],
    confidence_score: 93,
    auto_generated: true,
    user_action: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'insight-sourcing-002',
    module: 'tender_analytics',
    page: 'sourcing_summary',
    view_mode: undefined,
    context_id: '6',
    insight_type: 'Quality',
    severity: 'Medium',
    risk_category: 'Performance',
    title: 'Technical Evaluation Process Demonstrates Robust Supplier Quality',
    description: 'All three bidders achieved >90% technical compliance, demonstrating effective pre-qualification and clear specification communication. Average compliance of 95% exceeds industry benchmark of 87% for power equipment tenders, indicating high-quality supplier pool.',
    affected_section: 'Quality Assessment',
    key_metrics: {
      average_compliance: 95,
      industry_benchmark: 87,
      highest_score: 98,
      lowest_score: 92,
      quality_variance: 6
    },
    action_plan: [
      'Recognize procurement team for effective supplier pre-qualification',
      'Publish case study on successful tender execution for internal knowledge sharing',
      'Refine technical evaluation criteria based on lessons learned',
      'Establish minimum 92% compliance threshold for future power equipment tenders',
      'Create preferred supplier list from this evaluation for fast-track future procurements'
    ],
    confidence_score: 91,
    auto_generated: true,
    user_action: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'insight-sourcing-003',
    module: 'tender_analytics',
    page: 'sourcing_summary',
    view_mode: undefined,
    context_id: '6',
    insight_type: 'Risk',
    severity: 'Low',
    risk_category: 'Compliance',
    title: 'Single Variant Approach Simplified Evaluation - Consider for Future Tenders',
    description: 'Focusing on single transformer variant (20kV/400V 3P 200kVA) streamlined evaluation and enabled precise cost comparison. This approach reduced evaluation time by 40% compared to multi-variant tenders and improved supplier response quality.',
    affected_section: 'Process Improvement',
    key_metrics: {
      evaluation_time_days: 12,
      multi_variant_benchmark_days: 20,
      time_savings_pct: 40,
      supplier_confusion_incidents: 0
    },
    action_plan: [
      'Adopt single-variant tender approach as standard for equipment with predictable specifications',
      'Reserve multi-variant tenders only for truly uncertain requirement scenarios',
      'Update procurement manual with streamlined evaluation methodology',
      'Train procurement team on focused specification development',
      'Monitor future single-variant tender performance against this baseline'
    ],
    confidence_score: 85,
    auto_generated: true,
    user_action: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Helper function to get insights by filters
export const getAIInsightsMockData = (filters: {
  module?: string;
  page?: string;
  view_mode?: string;
  context_id?: string;
}): AIInsight[] => {
  return tenderAnalyticsAIInsights.filter(insight => {
    if (filters.module && insight.module !== filters.module) return false;
    if (filters.page && insight.page !== filters.page) return false;
    if (filters.view_mode && insight.view_mode !== filters.view_mode) return false;
    if (filters.context_id && insight.context_id !== filters.context_id) return false;
    return true;
  });
};
