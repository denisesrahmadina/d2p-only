/*
  # Populate Quote Detail Action Plan Insights

  1. Purpose
    - Add AI-powered action plan insights for tender analytics quote detail page
    - Provide tactical recommendations based on quote analysis for tender 6

  2. New Data
    - Action plan insights for quote detail page (tender 6)
    - Insights cover pricing analysis, negotiation opportunities, and supplier evaluation
    - Includes criticality levels, tactical action steps, and key metrics
    
  3. Insight Categories
    - Pricing insights for cost variance analysis
    - Negotiation opportunities for high-impact components
    - Supplier risk assessments
    - Strategic recommendations for vendor selection
    
  4. Key Features
    - Criticality-based prioritization
    - Detailed tactical action steps
    - Quantifiable metrics for decision support
    - Context-aware recommendations for both table and graph views
*/

-- Insert quote detail action plan insights for tender 6
INSERT INTO fact_ai_insight_action_plan (
  module,
  page,
  view_mode,
  context_id,
  insight_type,
  severity,
  risk_category,
  title,
  description,
  affected_section,
  key_metrics,
  action_plan,
  confidence_score,
  auto_generated,
  user_action
) VALUES
(
  'tender_analytics',
  'quote_detail',
  'table',
  '6',
  'Pricing',
  'High',
  'Financial',
  'Significant Price Variance Detected on Oil Component',
  'Schneider Electric quoted 26% higher on oil costs compared to owner estimate (USD 126,119 vs USD 100,306). This represents USD 25,813 in excess cost and indicates potential negotiation leverage.',
  'Cost Components',
  '{
    "Price_Variance": "26%",
    "Excess_Cost": "USD 25,813",
    "Component": "Oil",
    "Impact_on_Total": "3.2%"
  }'::jsonb,
  '[
    "Schedule negotiation meeting with Schneider Electric to discuss oil component pricing",
    "Request detailed breakdown of oil sourcing costs and specifications",
    "Benchmark against ABB and GE oil pricing (both ~USD 85-97K)",
    "Consider cherry-pick strategy: Use ABB for oil component while maintaining Schneider for other areas",
    "Set target price of USD 97,000 (cherry-pick baseline) as negotiation goal"
  ]'::jsonb,
  92.5,
  true,
  'Pending'
),
(
  'tender_analytics',
  'quote_detail',
  'table',
  '6',
  'Negotiation',
  'Critical',
  'Financial',
  'Multi-Component Negotiation Opportunity Worth USD 64,975',
  'Analysis reveals negotiation opportunities across 6 components totaling USD 64,975 in potential savings. Oil (USD 28,822) and Core (USD 23,148) components represent 80% of this opportunity.',
  'Quote Comparison',
  '{
    "Total_Opportunity": "USD 64,975",
    "Top_Component_1": "Oil - USD 28,822",
    "Top_Component_2": "Core - USD 23,148",
    "Potential_Savings_Percent": "8.06%"
  }'::jsonb,
  '[
    "Prioritize negotiation on Oil and Core components (combined USD 51,970 opportunity)",
    "Prepare cherry-pick baseline analysis showing lowest cost per component across all bidders",
    "Use competitive tension: Share ABB lower pricing as market benchmark",
    "Target 5-7% reduction on Schneider total quote (USD 40,000-56,000 savings)",
    "Structure negotiation in phases: Start with high-value components, then bundle remaining items",
    "Set walk-away threshold if savings fall below USD 35,000"
  ]'::jsonb,
  95.0,
  true,
  'Pending'
),
(
  'tender_analytics',
  'quote_detail',
  'graph',
  '6',
  'Cost_Optimization',
  'High',
  'Financial',
  'Cherry-Pick Strategy Could Save USD 34,426 Over ABB Quote',
  'Visual analysis shows optimal component selection across bidders could reduce costs to USD 734,674 (cherry-pick total) vs ABB current low of USD 769,100. This represents 4.47% additional savings opportunity.',
  'Cost Breakdown Visualization',
  '{
    "Cherry_Pick_Total": "USD 734,674",
    "ABB_Current_Quote": "USD 769,100",
    "Additional_Savings": "USD 34,426",
    "Savings_Percentage": "4.47%"
  }'::jsonb,
  '[
    "Present cherry-pick analysis to winning bidder (ABB) as negotiation leverage",
    "Identify ABB weak components: Coil-Secondary (USD 77,065 vs USD 65,971 best)",
    "Request ABB to match or beat cherry-pick pricing on their high-cost components",
    "Alternative: Structure dual-source contract for high-variance components",
    "Calculate logistics and coordination costs for multi-supplier approach",
    "Document supply chain risk assessment for cherry-pick procurement strategy"
  ]'::jsonb,
  88.0,
  true,
  'Pending'
),
(
  'tender_analytics',
  'quote_detail',
  'table',
  '6',
  'Risk',
  'Medium',
  'Operational',
  'GE Accessories Cost 63% Above Estimate - Quality or Specification Concern',
  'General Electric quoted USD 154,850 for accessories vs estimate of USD 95,000 (63% premium). This significant variance requires clarification to ensure specification alignment and value proposition.',
  'Major Difference Drivers',
  '{
    "GE_Accessories_Quote": "USD 154,850",
    "Owner_Estimate": "USD 95,000",
    "Variance_Percentage": "63%",
    "Risk_Type": "Specification_Mismatch"
  }'::jsonb,
  '[
    "Request detailed accessories bill of materials from GE",
    "Verify accessories specifications match tender requirements",
    "Compare accessories scope across all three bidders for consistency",
    "Identify if GE included additional items beyond base specification",
    "Determine if premium represents value-add features or specification deviation",
    "Consider excluding GE from shortlist if specification variance confirmed"
  ]'::jsonb,
  85.0,
  true,
  'Pending'
),
(
  'tender_analytics',
  'quote_detail',
  'graph',
  '6',
  'Strategic',
  'High',
  'Performance',
  'ABB Demonstrates Most Balanced Cost Profile Across Components',
  'Graph analysis reveals ABB maintains competitive pricing across all 7 components with no extreme outliers. This indicates strong supply chain management and reduces single-component negotiation risk.',
  'Supplier Evaluation',
  '{
    "ABB_Overall_Rank": "1st (Lowest Total)",
    "Cost_Balance_Score": "95/100",
    "Component_Outliers": "0",
    "Price_vs_Estimate": "-0.32%"
  }'::jsonb,
  '[
    "Recommend ABB as preferred supplier based on total cost and risk profile",
    "Negotiate 3-5% volume discount for multi-year contract commitment",
    "Establish performance metrics and penalty clauses in contract",
    "Request ABB to provide cost reduction roadmap for future orders",
    "Explore partnership opportunities for joint cost optimization initiatives",
    "Include price adjustment mechanism tied to commodity indices for transparency"
  ]'::jsonb,
  91.0,
  true,
  'Pending'
),
(
  'tender_analytics',
  'quote_detail',
  'table',
  '6',
  'Pricing',
  'Low',
  'Financial',
  'Core Component Shows Minimal Variance - Market Price Convergence',
  'Core component pricing clustered tightly across all bidders (USD 110-124K range, 12% spread). This suggests mature market pricing and limited negotiation leverage on this component.',
  'Cost Components',
  '{
    "Price_Range": "USD 110,230 - USD 123,100",
    "Variance_Spread": "12%",
    "Market_Maturity": "High",
    "Negotiation_Potential": "Low"
  }'::jsonb,
  '[
    "Accept market pricing for core component (limited negotiation upside)",
    "Focus negotiation efforts on higher-variance components (Oil, Accessories)",
    "Consider long-term supply agreement to lock current core pricing",
    "Monitor commodity metal prices for future procurement cycle impacts",
    "Evaluate potential cost reduction through design modifications in next tender"
  ]'::jsonb,
  82.0,
  true,
  'Pending'
);
