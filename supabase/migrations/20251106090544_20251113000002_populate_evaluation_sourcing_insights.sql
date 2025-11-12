/*
  # Populate AI Insights for Evaluation Process and Sourcing Summary

  1. Purpose
    - Add insights for Evaluation Process views (bid comparison, cost comparison, etc.)
    - Add insights for Sourcing Summary view
    - Complete the AI insights coverage across all Tender Analytics tabs

  2. Coverage
    - Evaluation Process: Component analysis, negotiation leverage, quality considerations
    - Sourcing Summary: Partnership opportunities, risk assessment, final recommendations
*/

-- Insert AI insights for Tender 6 - Evaluation Process
INSERT INTO fact_ai_insight_action_plan (
  module, page, view_mode, context_id, insight_type, severity, risk_category,
  title, description, affected_section, key_metrics, action_plan, confidence_score
) VALUES

-- Evaluation Process - Bid Comparison Insights
(
  'tender_analytics',
  'evaluation_process',
  'bid-comparison',
  '6',
  'Negotiation',
  'High',
  'Financial',
  'Cherry-Pick Strategy Could Save USD 70,160',
  'Analysis reveals significant opportunity to cherry-pick best component prices from different suppliers. By selecting ABB accessories and core, GE oil, and Schneider coil components, total cost could be reduced to USD 701,425, representing 9.1% savings.',
  'Bid Comparison Analysis',
  '{"cherry_pick_total": 701425, "potential_savings": 70160, "savings_percentage": 9.1, "components_optimized": 7, "baseline_price": 771585}'::jsonb,
  '[
    "Present cherry-pick analysis to preferred supplier as negotiation leverage",
    "Evaluate technical compatibility of mixed-supplier components",
    "Assess warranty implications of multi-supplier strategy",
    "Consider single-source discount if vendor matches cherry-pick pricing",
    "Develop contingency plan for component integration risks"
  ]'::jsonb,
  88.5
),

(
  'tender_analytics',
  'evaluation_process',
  'cost-comparison',
  '6',
  'Cost_Optimization',
  'High',
  'Financial',
  'Significant Cost Variance in Oil and Accessories Components',
  'Oil costs vary by 29% between suppliers (USD 83,000 to USD 107,100), and accessories costs vary by 67% (USD 93,000 to USD 154,850). These high-variance components offer the greatest negotiation potential.',
  'Cost Component Analysis',
  '{"oil_variance_percentage": 29, "accessories_variance_percentage": 67, "oil_range": "83000-107100", "accessories_range": "93000-154850", "negotiation_priority": "High"}'::jsonb,
  '[
    "Prioritize negotiations on oil and accessories components",
    "Request detailed specifications to understand cost drivers",
    "Benchmark pricing against industry standards",
    "Explore alternative suppliers for high-variance components",
    "Negotiate volume discounts for bulk component purchases"
  ]'::jsonb,
  91.0
),

(
  'tender_analytics',
  'evaluation_process',
  'negotiation-assistant',
  '6',
  'Negotiation',
  'High',
  'Financial',
  'Schneider Electric Negotiation Potential: USD 64,000',
  'Detailed component analysis shows Schneider Electric has negotiation potential of approximately USD 64,000 (7.9% reduction) by targeting oil costs reduction of 26% and achieving market-competitive pricing on accessories.',
  'Negotiation Assistant Analysis',
  '{"supplier": "Schneider Electric", "negotiation_potential": 64000, "percentage_reduction": 7.9, "target_components": ["Oil", "Accessories"], "confidence": 87.5}'::jsonb,
  '[
    "Focus on reducing oil costs by 15-20% to match ABB pricing",
    "Target 30-40% reduction in accessories to competitive levels",
    "Use cherry-pick pricing as baseline for negotiations",
    "Request volume commitment discounts for multi-year contracts",
    "Emphasize quality premium validation for higher-priced components"
  ]'::jsonb,
  87.5
),

-- Sourcing Summary Insights
(
  'tender_analytics',
  'sourcing_summary',
  NULL,
  '6',
  'Strategic',
  'High',
  'Performance',
  'ABB Offers Best Value with Strategic Partnership Potential',
  'ABB provides the most competitive pricing at USD 769,100 (0.32% below estimate) combined with strong technical compliance scores. Their market leadership in transformer manufacturing and local service presence make them an ideal long-term partner.',
  'Strategic Recommendation',
  '{"recommended_supplier": "ABB", "total_savings": 2485, "technical_score": 92, "partnership_potential": "High", "local_presence": true}'::jsonb,
  '[
    "Negotiate multi-year framework agreement with ABB for volume discounts",
    "Explore innovation partnership opportunities in renewable energy transformers",
    "Establish quarterly business reviews for continuous improvement",
    "Align on sustainability goals and carbon reduction targets",
    "Develop joint product development roadmap for future needs"
  ]'::jsonb,
  89.0
),

(
  'tender_analytics',
  'sourcing_summary',
  NULL,
  '6',
  'Risk',
  'Low',
  'Operational',
  'Low Supply Chain Risk Across All Suppliers',
  'Financial health analysis confirms all three suppliers (Schneider, GE, ABB) maintain strong balance sheets with A-grade credit ratings and stable supply chains. No immediate risk of delivery disruption identified.',
  'Risk Assessment',
  '{"suppliers_analyzed": 3, "average_credit_rating": "A", "financial_health_score": 8.5, "supply_chain_risk": "Low", "delivery_confidence": 95}'::jsonb,
  '[
    "Include standard force majeure clauses in contract terms",
    "Request parent company guarantees where applicable",
    "Establish backup supplier contingency for critical components",
    "Monitor quarterly financial metrics for early warning signals",
    "Maintain relationships with all three suppliers for future flexibility"
  ]'::jsonb,
  82.0
),

(
  'tender_analytics',
  'sourcing_summary',
  NULL,
  '6',
  'Quality',
  'Medium',
  'Performance',
  'Quality Validation Required for ABB Core Components',
  'While ABB offers the lowest price, their core component cost is 5.6% higher than estimated (USD 123,100 vs USD 116,500). Technical validation is recommended to ensure quality standards are maintained.',
  'Quality Assurance',
  '{"supplier": "ABB", "component": "Core", "cost_variance": 5.6, "validation_required": true, "recommended_action": "Technical audit"}'::jsonb,
  '[
    "Request detailed core material specifications and certifications",
    "Conduct factory audit or review recent quality inspection reports",
    "Verify compliance with IEC 60076 transformer standards",
    "Check warranty terms specific to core components",
    "Review historical performance data on similar projects"
  ]'::jsonb,
  84.5
),

(
  'tender_analytics',
  'sourcing_summary',
  NULL,
  '6',
  'Timeline',
  'Low',
  'Delivery',
  'All Suppliers Commit to 120-Day Delivery Timeline',
  'Quote analysis confirms all three suppliers have committed to the required 120-day delivery timeline with no risk premiums in pricing. Manufacturing capacity verification shows all suppliers can meet the 350-unit order quantity within schedule.',
  'Delivery Timeline Assessment',
  '{"committed_days": 120, "suppliers_committed": 3, "order_quantity": 350, "capacity_verified": true, "on_time_confidence": 100}'::jsonb,
  '[
    "Include delivery milestone schedule in contract terms",
    "Establish penalty clauses for late delivery (2% per week)",
    "Implement early delivery incentives (1% bonus for 2+ weeks early)",
    "Set up weekly progress reporting during manufacturing",
    "Schedule mid-production quality inspection at 60-day mark"
  ]'::jsonb,
  90.0
),

(
  'tender_analytics',
  'sourcing_summary',
  NULL,
  '6',
  'Negotiation',
  'High',
  'Financial',
  'Target Final Price: USD 705,000 (8.6% Below Estimate)',
  'Based on comprehensive analysis, targeted negotiations should aim for a final price of approximately USD 705,000, representing 8.6% savings below the owner estimate through component-level negotiations and volume commitments.',
  'Final Negotiation Target',
  '{"target_price": 705000, "current_best": 769100, "estimated_price": 771585, "target_savings_percentage": 8.6, "negotiation_confidence": 85}'::jsonb,
  '[
    "Start negotiations with ABB to establish baseline at USD 769,100",
    "Use cherry-pick analysis to justify USD 705,000 target",
    "Request 5-7% volume discount for 350-unit order",
    "Explore multi-year framework pricing for additional 2-3% reduction",
    "Negotiate phased pricing with cost reduction commitment over time",
    "Maintain quality standards while pursuing cost optimization"
  ]'::jsonb,
  87.0
);
