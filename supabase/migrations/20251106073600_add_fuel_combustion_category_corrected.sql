/*
  # Add Fuel and Combustion Materials Category
  
  1. New Category
    - Add "Fuel and Combustion Materials" as a centralized category
    - Category code: FUEL-000
    - Complete the 3 mock categories for Category Analysis dropdown
    
  2. Supporting Data
    - Add Kraljic matrix positioning
    - Add category strategy
    - Add AI insights with correct user_action values
    
  3. Purpose
    - Provide 3rd mock centralized category alongside Mechanical Equipment and Electrical Equipment
    - Enable dropdown selection in Category Analysis sub-menu
*/

-- Add Fuel and Combustion Materials Category
INSERT INTO dim_category (
  category_code, 
  category_name, 
  parent_category_code, 
  level, 
  classification, 
  classification_rationale, 
  total_annual_spend, 
  business_units_count, 
  vendor_count, 
  strategic_importance, 
  dataset_id, 
  organization_id
) VALUES (
  'FUEL-000',
  'Fuel and Combustion Materials',
  'CAT-000',
  2,
  'Centralized',
  'Critical to all power generation operations, high value spend, volatile commodity pricing requires coordinated hedging and supplier management',
  175000000000,
  12,
  15,
  'High',
  'DATASET_A',
  'ORG001'
) ON CONFLICT (category_code) DO NOTHING;

-- Add Kraljic Matrix Positioning
INSERT INTO fact_kraljic_matrix (
  category_code, 
  profit_impact_score, 
  supply_risk_score, 
  kraljic_quadrant, 
  calculation_method, 
  manual_override, 
  override_rationale, 
  approved_by, 
  approved_at, 
  dataset_id, 
  organization_id
) 
SELECT 'FUEL-000', 95, 82, 'Strategic', 'Auto', false, NULL, NULL, NULL, 'DATASET_A', 'ORG001'
WHERE NOT EXISTS (SELECT 1 FROM fact_kraljic_matrix WHERE category_code = 'FUEL-000');

-- Add Category Strategy
INSERT INTO fact_category_strategy (
  category_code, 
  kraljic_quadrant, 
  strategic_lever, 
  lever_description, 
  impact_score, 
  implementation_complexity, 
  forecasted_savings_pct, 
  forecasted_savings_amount, 
  implementation_timeline, 
  status, 
  approved_by, 
  approved_at, 
  dataset_id, 
  organization_id
) 
SELECT * FROM (VALUES
  ('FUEL-000', 'Strategic', 'Long-Term Contracting with Price Hedging', 'Establish 3-5 year framework agreements with key suppliers with volume commitments and hybrid pricing formula combining fixed and indexed components', 9.0, 'Medium', 5.5, 9625000000, '18 months', 'Approved', 'Budi Santoso', '2024-10-28'::timestamptz, 'DATASET_A', 'ORG001'),
  ('FUEL-000', 'Strategic', 'Fuel Quality Optimization', 'Comprehensive analysis of coal quality specifications vs. actual requirements to identify cost optimization opportunities through specification relaxation where technically feasible', 8.0, 'Medium', 3.5, 6125000000, '12 months', 'In Progress', 'Budi Santoso', '2024-09-22'::timestamptz, 'DATASET_A', 'ORG001'),
  ('FUEL-000', 'Strategic', 'Alternative Fuel Co-Firing Initiative', 'Pilot program for biomass co-firing (10-15% blend) to reduce carbon footprint and diversify fuel mix, including supplier development for biomass pellet sourcing', 7.5, 'High', 2.0, 3500000000, '24 months', 'Under Review', NULL, NULL, 'DATASET_A', 'ORG001')
) AS v(category_code, kraljic_quadrant, strategic_lever, lever_description, impact_score, implementation_complexity, forecasted_savings_pct, forecasted_savings_amount, implementation_timeline, status, approved_by, approved_at, dataset_id, organization_id)
WHERE NOT EXISTS (
  SELECT 1 FROM fact_category_strategy 
  WHERE category_code = 'FUEL-000' 
    AND strategic_lever = v.strategic_lever
);

-- Add AI Insights (corrected user_action values)
INSERT INTO fact_category_ai_insight (
  category_code, 
  insight_type, 
  insight_title, 
  insight_description, 
  confidence_score, 
  financial_impact_estimate, 
  risk_level, 
  ai_source_type, 
  key_variables, 
  user_action, 
  user_comment, 
  dataset_id, 
  organization_id
)
SELECT * FROM (VALUES
  ('FUEL-000', 'Predictive', 'Coal Price Spike Alert', 'Predictive model indicates 12-15% coal price increase in Q2 2025 due to Indonesian export quota policies and increased Chinese demand. Recommend accelerating Q2-Q3 procurement and increasing inventory buffer by 20 days.', 89, 8400000000, 'Critical', 'Predictive Model', '{"export_quota_reduction": "15%", "china_demand_increase": "+22%", "weather_risk": "moderate"}'::jsonb, 'Accepted', 'Approved inventory increase and expedited Q2 contracting', 'DATASET_A', 'ORG001'),
  ('FUEL-000', 'Diagnostic', 'Supplier Concentration Risk', 'Current coal supplier base creates supply vulnerability. Analysis shows 85% probability of supply disruption scenario impacting 40%+ of volume based on historical patterns and geological risk factors.', 92, NULL::numeric, 'Critical', 'Pattern Recognition', '{"supplier_count": 2, "hhi_index": 4724, "geographic_concentration": "high"}'::jsonb, 'Accepted', 'Initiating tender for 2 additional qualified coal suppliers', 'DATASET_A', 'ORG001'),
  ('FUEL-000', 'Prescriptive', 'Natural Gas Contract Restructuring', 'Analysis suggests optimal gas contract portfolio: 60% long-term fixed, 25% indexed, 15% spot. Current mix: 45%, 35%, 20%. Restructuring projected to reduce cost volatility by 35% and save 4.2% annually.', 86, 7350000000, 'Moderate', 'Simulation', '{"volatility_reduction": 0.35, "cost_savings": 0.042, "supply_security": "improved"}'::jsonb, 'Pending', NULL, 'DATASET_A', 'ORG001'),
  ('FUEL-000', 'Prescriptive', 'Carbon Cost Hedging Strategy', 'With carbon pricing implementation approaching (est. Rp 75/kgCO2 by 2025), recommend establishing carbon offset portfolio and accelerating biomass co-firing to 15% to mitigate carbon cost exposure.', 84, 12500000000, 'Moderate', 'Predictive Model', '{"carbon_price_forecast": 75000, "emission_volume": "167M_kg", "offset_cost": 45000}'::jsonb, 'Accepted', 'Sustainability team developing carbon strategy with procurement support', 'DATASET_A', 'ORG001')
) AS v(category_code, insight_type, insight_title, insight_description, confidence_score, financial_impact_estimate, risk_level, ai_source_type, key_variables, user_action, user_comment, dataset_id, organization_id)
WHERE NOT EXISTS (
  SELECT 1 FROM fact_category_ai_insight 
  WHERE category_code = 'FUEL-000' 
    AND insight_title = v.insight_title
);
