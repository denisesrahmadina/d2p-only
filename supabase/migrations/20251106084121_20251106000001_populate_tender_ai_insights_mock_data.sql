/*
  # Populate Tender AI Insights Mock Data

  1. Purpose
    - Populate realistic AI insights for Distribution Transformer Tender 6
    - Include insights for all three tabs: Quote Detail, Evaluation Process, Sourcing Summary
    - Cover various insight types: Pricing, Supplier, Negotiation, Compliance, Risk

  2. Insight Categories
    - Pricing anomalies and cost breakdown analysis
    - Supplier risk assessment and performance indicators
    - Negotiation opportunities and leverage points
    - Compliance and quality considerations
    - Timeline and delivery risks

  3. Data Quality
    - Insights are specific to tender data
    - Recommendations are actionable
    - Confidence scores reflect data reliability
    - Mix of severity levels for realistic demo
*/

-- Insert AI insights for Tender 6 (Distribution Transformer Tender 6)
INSERT INTO fact_tender_ai_insight (
  tender_id, insight_type, severity, risk_category, title, description,
  affected_section, recommendations, key_metrics, confidence_score, organization_id
) VALUES

-- Critical Pricing Insight
(
  '6',
  'Pricing',
  'Critical',
  'Financial',
  'General Electric Accessories Cost 63% Above Estimate',
  'General Electric''s quoted accessories cost of USD 154,850 is 63% higher than the owner estimate of USD 95,000, representing an additional USD 59,850 expenditure. This represents the largest cost variance across all components and suppliers.',
  'Quote Detail - Cost Components',
  '["Negotiate accessories pricing with GE, targeting 30-40% reduction", "Request detailed breakdown of accessories components", "Consider cherry-picking accessories from ABB (USD 93,000)", "Evaluate if premium accessories justify the price premium"]'::jsonb,
  '{"variance_amount": 59850, "variance_percentage": 63.0, "component": "Accessories", "supplier": "General Electric", "estimated_cost": 95000, "quoted_cost": 154850}'::jsonb,
  92.5,
  NULL
),

-- High Negotiation Opportunity
(
  '6',
  'Negotiation',
  'High',
  'Financial',
  'Schneider Electric Oil Component 26% Above Market',
  'Schneider Electric''s oil cost of USD 107,100 is 26% higher than the estimate and significantly above ABB''s quote of USD 83,000. This presents a strong negotiation opportunity with potential savings of USD 24,100.',
  'Evaluation Process - Cost Comparison',
  '["Present ABB''s oil pricing as benchmark in negotiations", "Request volume discount commitment from Schneider", "Explore alternative oil specifications that meet requirements", "Consider split award strategy for oil components"]'::jsonb,
  '{"savings_potential": 24100, "variance_percentage": 26.0, "component": "Oil", "supplier": "Schneider Electric", "competitor_price": 83000, "quoted_price": 107100}'::jsonb,
  88.0,
  NULL
),

-- High Supplier Risk
(
  '6',
  'Supplier',
  'High',
  'Operational',
  'ABB Offers Lowest Price But Core Cost Deviates Significantly',
  'While ABB provides the most competitive overall price at USD 769,100 (0.32% below estimate), their core component cost of USD 123,100 is 5.6% higher than estimated. This unusual pattern warrants technical clarification.',
  'Quote Detail - Supplier Analysis',
  '["Request technical justification for higher core costs", "Verify core specifications match RFQ requirements", "Conduct reference checks with recent ABB projects", "Review ABB''s quality certifications for core manufacturing"]'::jsonb,
  '{"total_quote": 769100, "price_vs_estimate": -0.32, "core_variance": 5.6, "supplier": "ABB", "total_savings": 2485}'::jsonb,
  85.5,
  NULL
),

-- Medium Negotiation Leverage
(
  '6',
  'Negotiation',
  'Medium',
  'Financial',
  'Cherry-Pick Opportunity Across Multiple Components',
  'Analysis reveals opportunity to cherry-pick best component prices from different suppliers, potentially reducing total cost to USD 701,425. Key savings from ABB''s accessories and core, GE''s oil, and Schneider''s coil pricing.',
  'Evaluation Process - Bid Comparison',
  '["Present cherry-pick analysis to preferred supplier", "Use as negotiation leverage for overall price reduction", "Consider technical risks of multi-supplier approach", "Evaluate warranty implications of component sourcing"]'::jsonb,
  '{"cherry_pick_total": 701425, "potential_savings": 70160, "savings_percentage": 9.1, "components_optimized": 7}'::jsonb,
  82.0,
  NULL
),

-- Medium Quality Consideration
(
  '6',
  'Quality',
  'Medium',
  'Performance',
  'Schneider Electric Offers Premium Specifications',
  'Despite higher pricing, Schneider Electric''s quote includes premium insulation materials and enhanced oil quality that may extend transformer lifecycle by 15-20%. Long-term total cost of ownership may favor Schneider despite 4.47% price premium.',
  'Evaluation Process - Technical Evaluation',
  '["Request lifecycle cost analysis from Schneider", "Compare warranty terms and coverage periods", "Evaluate maintenance cost projections", "Consider strategic value of premium components"]'::jsonb,
  '{"price_premium": 34490, "premium_percentage": 4.47, "lifecycle_extension": "15-20%", "supplier": "Schneider Electric"}'::jsonb,
  78.5,
  NULL
),

-- Low Timeline Risk
(
  '6',
  'Timeline',
  'Low',
  'Delivery',
  'All Suppliers Meet Required Delivery Timeline',
  'Quote analysis confirms all three suppliers have committed to the required delivery timeline of 120 days. No delivery risk premium is included in pricing, indicating standard manufacturing schedule is feasible.',
  'Sourcing Summary - Timeline Assessment',
  '["Confirm delivery penalties in contract terms", "Request manufacturing schedule commitment", "Establish interim milestone delivery dates", "Include early delivery incentive clauses"]'::jsonb,
  '{"committed_delivery_days": 120, "suppliers_on_time": 3, "total_suppliers": 3, "on_time_percentage": 100}'::jsonb,
  90.0,
  NULL
),

-- Medium Compliance Check
(
  '6',
  'Compliance',
  'Medium',
  'Compliance',
  'Verify ISO Certification Currency for All Suppliers',
  'While all suppliers claim ISO 9001 and ISO 14001 certifications, audit dates should be verified to ensure certifications are current. Schneider''s last audit was 8 months ago, within acceptable range.',
  'Evaluation Process - Compliance Review',
  '["Request current ISO certification documents", "Verify certification body accreditation", "Check for any outstanding non-conformances", "Confirm scope covers transformer manufacturing"]'::jsonb,
  '{"certified_suppliers": 3, "last_audit_months": 8, "certifications_required": ["ISO 9001", "ISO 14001"], "compliance_status": "Pending Verification"}'::jsonb,
  75.0,
  NULL
),

-- High Value Optimization
(
  '6',
  'Pricing',
  'High',
  'Financial',
  'Negotiation Could Achieve 7-8% Additional Savings',
  'Based on cost component analysis and market benchmarks, targeted negotiations focusing on oil and accessories components could yield USD 56,000-64,000 in additional savings beyond current best bid.',
  'Sourcing Summary - Optimization Analysis',
  '["Prioritize negotiations with ABB as incumbent supplier", "Use Schneider and GE pricing as competitive leverage", "Focus negotiation on high-variance components", "Structure negotiations in phases targeting quick wins first"]'::jsonb,
  '{"current_best_bid": 769100, "estimated_savings_min": 56000, "estimated_savings_max": 64000, "target_savings_percentage": 7.5, "final_target_price": 705100}'::jsonb,
  87.5,
  NULL
),

-- Low Risk Assessment
(
  '6',
  'Risk',
  'Low',
  'Operational',
  'Supplier Financial Health Indicators Are Strong',
  'Financial analysis of all three suppliers shows strong balance sheets, positive cash flows, and stable credit ratings. No immediate supply chain disruption risk identified.',
  'Evaluation Process - Risk Assessment',
  '["Include standard force majeure clauses", "Request parent company guarantees if applicable", "Establish backup supply contingency", "Monitor supplier financial metrics quarterly"]'::jsonb,
  '{"suppliers_analyzed": 3, "credit_rating_avg": "A", "financial_health_score": 8.5, "risk_level": "Low"}'::jsonb,
  81.0,
  NULL
),

-- Medium Strategic Insight
(
  '6',
  'Supplier',
  'Medium',
  'Performance',
  'Consider Long-Term Partnership Value with ABB',
  'ABB''s competitive pricing combined with best-in-class technical compliance score of 92/100 positions them as strong candidate for long-term partnership. Consider volume commitment for improved future pricing.',
  'Sourcing Summary - Strategic Recommendation',
  '["Explore multi-year framework agreement with ABB", "Negotiate volume-based pricing tiers", "Discuss innovation partnership opportunities", "Align on joint sustainability goals"]'::jsonb,
  '{"technical_score": 92, "price_competitiveness": 95, "partnership_potential": "High", "strategic_value": "8.5/10"}'::jsonb,
  79.5,
  NULL
);
