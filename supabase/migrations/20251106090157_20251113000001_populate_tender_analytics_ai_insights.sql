/*
  # Populate AI Insights for Tender Analytics Module

  1. Purpose
    - Populate comprehensive AI insights for Tender 6 (Distribution Transformer Tender 6)
    - Include insights for Quote Detail (Table and Graph views)
    - Include insights for Evaluation Process (all sub-menus)
    - Include insights for Sourcing Summary
    - Match the example format provided showing Key Insights and Action Plan

  2. Insight Coverage
    - Quote Detail: Pricing analysis, cost comparison, supplier variance
    - Evaluation Process: Negotiation opportunities, component analysis, strategic recommendations
    - Sourcing Summary: Final recommendations, savings potential, partnership opportunities

  3. Data Quality
    - Insights match the example format with estimated prices and quoted prices
    - Action plans provide specific, actionable recommendations
    - Key metrics include percentage differences and dollar amounts
    - Confidence scores reflect data reliability and analysis depth
*/

-- Insert AI insights for Tender 6 - Quote Detail (Table View)
INSERT INTO fact_ai_insight_action_plan (
  module, page, view_mode, context_id, insight_type, severity, risk_category,
  title, description, affected_section, key_metrics, action_plan, confidence_score
) VALUES

-- KEY INSIGHT 1: Estimated Price Overview
(
  'tender_analytics',
  'quote_detail',
  'table',
  '6',
  'Pricing',
  'Medium',
  'Financial',
  'Estimated Price Analysis',
  'The owner estimated price for this Distribution Transformer tender is USD 771,585 with a unit price of USD 2,204.53. This baseline serves as the benchmark for evaluating all supplier quotes.',
  'Estimated Price',
  '{"estimated_price": 771585, "unit_price": 2204.53, "order_quantity": 350}'::jsonb,
  '[
    "Use estimated price as negotiation baseline with all suppliers",
    "Compare quoted prices against this benchmark to identify outliers",
    "Focus negotiations on quotes exceeding 5% above estimate",
    "Validate that estimate reflects current market conditions"
  ]'::jsonb,
  90.0
),

-- KEY INSIGHT 2: Schneider Electric Quote Analysis
(
  'tender_analytics',
  'quote_detail',
  'table',
  '6',
  'Pricing',
  'High',
  'Financial',
  'Schneider Electric: 4.47% Above Estimate',
  'Schneider Electric quoted USD 806,075 (unit price USD 2,304.79), which is 4.47% higher than the estimated price. The major price driver is 26% higher oil cost compared to the owner estimate.',
  'Schneider Electric Pricing',
  '{"quoted_price": 806075, "unit_price": 2304.79, "variance_percentage": 4.47, "variance_amount": 34490, "major_driver": "26% higher oil cost"}'::jsonb,
  '[
    "Negotiate oil costs with Schneider Electric, targeting 15-20% reduction",
    "Present ABB oil pricing (USD 83,000) as competitive benchmark",
    "Request detailed breakdown of oil specifications and quality premium",
    "Evaluate if oil quality premium justifies 26% higher cost",
    "Consider requesting volume discount commitment for oil components"
  ]'::jsonb,
  92.5
),

-- KEY INSIGHT 3: General Electric Quote Analysis
(
  'tender_analytics',
  'quote_detail',
  'table',
  '6',
  'Pricing',
  'High',
  'Financial',
  'General Electric: 3.43% Above Estimate',
  'General Electric quoted USD 798,080 (unit price USD 2,286.51), which is 3.43% higher than the estimated price. The major price driver is 63% higher accessories cost compared to the owner estimate.',
  'General Electric Pricing',
  '{"quoted_price": 798080, "unit_price": 2286.51, "variance_percentage": 3.43, "variance_amount": 26495, "major_driver": "63% higher accessories cost"}'::jsonb,
  '[
    "Focus on reducing accessories costs (Schneider Electric and General Electric)",
    "Request itemized breakdown of accessories components from GE",
    "Use ABB accessories pricing (USD 93,000) as negotiation leverage",
    "Verify if accessories include premium features not in specification",
    "Consider cherry-picking accessories from lowest bidder (ABB)"
  ]'::jsonb,
  91.0
),

-- KEY INSIGHT 4: ABB Quote Analysis
(
  'tender_analytics',
  'quote_detail',
  'table',
  '6',
  'Pricing',
  'Low',
  'Financial',
  'ABB: 0.32% Below Estimate (Most Competitive)',
  'ABB quoted USD 769,100 (unit price USD 2,197.43), which is 0.32% lower than the estimated price. The major price driver is 5% lower core cost compared to other suppliers, making them the most cost-effective option.',
  'ABB Pricing',
  '{"quoted_price": 769100, "unit_price": 2197.43, "variance_percentage": -0.32, "variance_amount": -2485, "major_driver": "5% lower core cost"}'::jsonb,
  '[
    "Consider ABB for cost savings, but verify if quality is not compromised",
    "Verify ABB core specifications match technical requirements",
    "Request quality certifications and testing documentation",
    "Check ABB delivery timeline and manufacturing capacity",
    "Assess quality, after-sales support, and long-term savings to determine the best value beyond just price"
  ]'::jsonb,
  88.0
),

-- ACTION PLAN 1: Negotiate Higher Prices
(
  'tender_analytics',
  'quote_detail',
  'table',
  '6',
  'Negotiation',
  'High',
  'Financial',
  'Negotiate Higher Prices',
  'Schneider Electric and General Electric both quoted above the estimated price. Focus negotiations on reducing their premium components - oil costs for Schneider (26% premium) and accessories costs for General Electric (63% premium).',
  'Action Plan',
  '{"schneider_target_reduction": "15-20%", "ge_target_reduction": "30-40%", "total_savings_potential": "50000-80000"}'::jsonb,
  '[
    "Focus on reducing oil costs (Schneider Electric) and accessories costs (General Electric)",
    "Present competitive benchmarks from other suppliers",
    "Request detailed cost breakdowns to identify reduction opportunities",
    "Use cherry-pick pricing strategy as negotiation leverage"
  ]'::jsonb,
  90.0
),

-- ACTION PLAN 2: Consider ABB for Cost Savings
(
  'tender_analytics',
  'quote_detail',
  'table',
  '6',
  'Strategic',
  'Medium',
  'Financial',
  'Consider ABB for Cost Savings',
  'ABB offers a lower price due to core cost savings. However, it is essential to verify if quality is not compromised. Request detailed technical specifications and quality documentation.',
  'Action Plan',
  '{"abb_price_advantage": 2485, "risk_area": "Quality verification", "recommended_action": "Technical due diligence"}'::jsonb,
  '[
    "ABB offers a lower price due to core cost savings, but verify if quality is not compromised",
    "Request core material specifications and manufacturing process details",
    "Conduct factory audit or request recent quality inspection reports",
    "Check warranty terms and after-sales support capabilities",
    "Review past performance on similar projects"
  ]'::jsonb,
  85.0
),

-- ACTION PLAN 3: Evaluate Overall Value
(
  'tender_analytics',
  'quote_detail',
  'table',
  '6',
  'Strategic',
  'High',
  'Performance',
  'Evaluate Overall Value',
  'While ABB has the lowest price, consider other critical factors: quality standards, warranty coverage, after-sales support capabilities, delivery reliability, and long-term total cost of ownership to determine the best value proposition.',
  'Action Plan',
  '{"evaluation_criteria": ["Quality", "Warranty", "Support", "TCO"], "recommended_approach": "Multi-criteria evaluation"}'::jsonb,
  '[
    "Assess quality, after-sales support, and long-term savings to determine the best value beyond just price",
    "Compare warranty terms: coverage period, response time, replacement guarantees",
    "Evaluate technical support capabilities and local service presence",
    "Calculate total cost of ownership including maintenance and operational costs",
    "Consider strategic partnership value and innovation collaboration opportunities"
  ]'::jsonb,
  87.5
),

-- ACTION PLAN 4: Bulk Discount Opportunity
(
  'tender_analytics',
  'quote_detail',
  'table',
  '6',
  'Negotiation',
  'Medium',
  'Financial',
  'Bulk Discount Opportunity',
  'With an order quantity of 350 units, there is significant opportunity to negotiate bulk pricing discounts. Request volume-based pricing tiers and multi-year supply agreements for better rates.',
  'Action Plan',
  '{"order_quantity": 350, "bulk_discount_potential": "5-8%", "estimated_savings": "38000-62000"}'::jsonb,
  '[
    "Discuss bulk pricing for the 350 units to secure better deals",
    "Request tiered pricing structure for different volume levels",
    "Explore multi-year framework agreement for additional discounts",
    "Negotiate payment terms that provide cost benefits",
    "Consider consolidating future orders for improved pricing leverage"
  ]'::jsonb,
  82.0
),

-- RECOMMENDATION: Final Strategic Recommendation
(
  'tender_analytics',
  'quote_detail',
  'table',
  '6',
  'Strategic',
  'High',
  'Financial',
  'Strategic Recommendation',
  'ABB is the most cost-effective option at USD 769,100 (0.32% below estimate), but further negotiate with Schneider Electric and General Electric on their high-cost components. The optimal strategy combines ABB cost advantage with targeted negotiations to reduce Schneider oil costs and GE accessories costs.',
  'Final Recommendation',
  '{"recommended_supplier": "ABB", "negotiation_targets": ["Schneider oil costs", "GE accessories costs"], "potential_total_savings": "80000-120000"}'::jsonb,
  '[
    "ABB is the most cost-effective, but further negotiate with Schneider Electric and General Electric on their high-cost components",
    "Start negotiations with ABB to secure commitment and baseline pricing",
    "Use ABB pricing as leverage in parallel negotiations with Schneider and GE",
    "Target 15-20% reduction in Schneider oil costs and 30-40% in GE accessories",
    "Consider split-award strategy if technical evaluation supports it",
    "Maintain quality standards while pursuing cost optimization"
  ]'::jsonb,
  93.0
);
