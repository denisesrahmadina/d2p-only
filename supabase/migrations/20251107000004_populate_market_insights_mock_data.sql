/*
  # Populate Market Intelligence and Sentiment Analysis Mock Data

  1. Market Insights
    - Populate market trends, supplier news, price changes, risk alerts
    - Real-time intelligence for strategic decision-making

  2. Sample Data
    - 30+ market insights across different categories
    - Covering various insight types and sentiment analysis
*/

-- Insert market intelligence and sentiment analysis data
INSERT INTO ref_category_market_insight (
  category_id,
  insight_type,
  insight_title,
  insight_content,
  sentiment,
  impact_level,
  source,
  published_date,
  estimated_financial_impact,
  organization_id
)
SELECT
  c.id,
  insight_data.type,
  insight_data.title,
  insight_data.content,
  insight_data.sentiment,
  insight_data.impact,
  insight_data.source,
  insight_data.pub_date,
  insight_data.financial_impact,
  'PLN-IP'
FROM dim_procurement_category c
CROSS JOIN LATERAL (
  VALUES
    -- Coal category insights
    ('MARKET_TREND', 'Global Coal Prices Stabilizing After Q3 2024 Volatility', 'International coal prices show signs of stabilization at $120-130/ton after experiencing significant volatility in Q3 2024. Major producers in Australia and Indonesia report normalized production levels.', 'POSITIVE', 'MEDIUM', 'Bloomberg Commodities', '2025-01-15'::date, 2500000000.00),
    ('SUPPLIER_NEWS', 'PT Bukit Asam Announces Capacity Expansion', 'Leading Indonesian coal supplier PT Bukit Asam announces 15% capacity expansion at Tanjung Enim mine, expected to come online Q2 2025. This will improve supply availability for power generation customers.', 'POSITIVE', 'HIGH', 'Reuters Energy', '2025-01-10'::date, 3200000000.00),
    ('RISK_ALERT', 'Potential Export Restrictions on Indonesian Coal', 'Indonesian government considering export quota adjustments for domestic energy security. May impact international pricing and availability for Q3-Q4 2025.', 'NEGATIVE', 'HIGH', 'Jakarta Post', '2025-01-08'::date, -4500000000.00),

    -- Natural Gas category insights
    ('PRICE_CHANGE', 'LNG Spot Prices Decrease 8% Month-over-Month', 'Asian LNG spot prices declined to $11.2/MMBtu in December 2024, down from $12.1/MMBtu in November. Mild winter weather and increased supply from Qatar contribute to price softening.', 'POSITIVE', 'HIGH', 'S&P Global Platts', '2025-01-12'::date, 5600000000.00),
    ('MARKET_TREND', 'Indonesia Gas Production Reaches Record High', 'Domestic natural gas production hits 1.2 billion cubic feet per day, highest in five years. Improved availability for power generation sector expected throughout 2025.', 'POSITIVE', 'MEDIUM', 'Ministry of Energy Indonesia', '2025-01-05'::date, 2800000000.00),

    -- Turbine Parts category insights
    ('SUPPLIER_NEWS', 'Siemens Energy Introduces Next-Gen Turbine Blade Technology', 'New turbine blade design promises 3% efficiency improvement and 25% longer service life. Available for retrofit on existing H-class gas turbines starting Q2 2025.', 'POSITIVE', 'MEDIUM', 'Power Engineering International', '2025-01-18'::date, 1200000000.00),
    ('RISK_ALERT', 'Global Supply Chain Delays for Specialty Alloys', 'Lead times for high-temperature alloy components extended to 18-24 months due to limited global production capacity. Early procurement recommended for 2026 maintenance schedules.', 'NEGATIVE', 'HIGH', 'Gas Turbine World', '2025-01-14'::date, -2100000000.00),
    ('OPPORTUNITY', 'Domestic Turbine Parts Manufacturing Initiative', 'Government incentive program for local turbine component manufacturing could reduce import dependency by 30% by 2026. Potential cost savings of 15-20% on select components.', 'POSITIVE', 'HIGH', 'Industry Ministry', '2025-01-20'::date, 6700000000.00),

    -- Generator Parts category insights
    ('MARKET_TREND', 'Predictive Maintenance Technology Reduces Generator Downtime', 'AI-powered predictive maintenance solutions showing 40% reduction in unplanned outages. Early adopters report 25% decrease in spare parts consumption.', 'POSITIVE', 'MEDIUM', 'Electric Power Research Institute', '2025-01-11'::date, 4200000000.00),

    -- Lubricants category insights
    ('PRICE_CHANGE', 'Industrial Lubricant Prices Drop Following Crude Oil Decline', 'Base oil prices decrease 6% quarter-over-quarter as crude oil stabilizes. Industrial lubricant manufacturers passing savings to customers.', 'POSITIVE', 'LOW', 'Lubes N Greases', '2025-01-16'::date, 510000000.00),

    -- Maintenance Services category insights
    ('SUPPLIER_NEWS', 'GE Vernova Expands Service Network in Southeast Asia', 'New service center in Jakarta provides 24/7 emergency support for gas turbines and generators. Expected to reduce response time by 40% for Indonesian customers.', 'POSITIVE', 'HIGH', 'GE Vernova Press Release', '2025-01-13'::date, 3300000000.00),
    ('MARKET_TREND', 'Remote Monitoring Services Gain Adoption', 'Remote asset performance monitoring services growing at 35% CAGR. Early detection of anomalies reducing major overhaul costs by 20-30%.', 'POSITIVE', 'MEDIUM', 'Power Magazine', '2025-01-09'::date, 13400000000.00),

    -- Electrical Components category insights
    ('RISK_ALERT', 'Semiconductor Shortage Impacts Power Electronics', 'Ongoing global semiconductor shortage affecting availability of IGBT modules and power electronics. Lead times extended to 36-48 weeks for certain components.', 'NEGATIVE', 'HIGH', 'IEEE Spectrum', '2025-01-17'::date, -1900000000.00),
    ('OPPORTUNITY', 'New Local Transformer Manufacturing Facility', 'ABB opens new transformer manufacturing plant in Cikarang, reducing import dependency and lead times by 50% for distribution transformers.', 'POSITIVE', 'MEDIUM', 'Jakarta Globe', '2025-01-07'::date, 2100000000.00),

    -- Renewable Energy Components category insights
    ('MARKET_TREND', 'Solar Panel Prices Hit Record Low', 'Polysilicon production capacity increases drive solar PV module prices below $0.20/watt. Favorable environment for renewable energy expansion projects.', 'POSITIVE', 'HIGH', 'PV Magazine', '2025-01-19'::date, 18750000000.00),
    ('SUPPLIER_NEWS', 'Major Wind Turbine OEM Establishes Indonesian Assembly Facility', 'Vestas announces wind turbine nacelle assembly plant in Batam. Local content will reach 40% by 2026, supporting renewable energy growth targets.', 'POSITIVE', 'HIGH', 'Renewable Energy World', '2025-01-06'::date, 12500000000.00),
    ('OPPORTUNITY', 'Government Renewable Energy Incentive Program Extended', 'Tax incentives and import duty exemptions for renewable energy equipment extended through 2027. Potential 15-20% cost reduction on project capital expenditure.', 'POSITIVE', 'CRITICAL', 'Ministry of Energy', '2025-01-21'::date, 22500000000.00)
) AS insight_data(type, title, content, sentiment, impact, source, pub_date, financial_impact)
WHERE (
  (c.category_code = 'CAT-001' AND insight_data.title LIKE '%Coal%') OR
  (c.category_code = 'CAT-002' AND insight_data.title LIKE '%Gas%' OR insight_data.title LIKE '%LNG%') OR
  (c.category_code = 'CAT-003' AND insight_data.title LIKE '%Turbine%') OR
  (c.category_code = 'CAT-004' AND insight_data.title LIKE '%Generator%') OR
  (c.category_code = 'CAT-005' AND insight_data.title LIKE '%Lubricant%') OR
  (c.category_code = 'CAT-006' AND (insight_data.title LIKE '%Maintenance%' OR insight_data.title LIKE '%Service%' OR insight_data.title LIKE '%Remote Monitoring%')) OR
  (c.category_code = 'CAT-010' AND (insight_data.title LIKE '%Electrical%' OR insight_data.title LIKE '%Transformer%' OR insight_data.title LIKE '%Semiconductor%')) OR
  (c.category_code = 'CAT-014' AND (insight_data.title LIKE '%Solar%' OR insight_data.title LIKE '%Wind%' OR insight_data.title LIKE '%Renewable%'))
);

-- Add additional insights for other categories
INSERT INTO ref_category_market_insight (
  category_id,
  insight_type,
  insight_title,
  insight_content,
  sentiment,
  impact_level,
  source,
  published_date,
  estimated_financial_impact,
  organization_id
)
SELECT
  c.id,
  'MARKET_TREND',
  'Industry 4.0 Digital Transformation Accelerating in Power Sector',
  'Digital transformation initiatives in power generation sector expected to reduce operational costs by 12-15% through improved asset utilization and predictive maintenance. IoT sensor deployment and cloud-based analytics becoming standard practice.',
  'POSITIVE',
  'MEDIUM',
  'McKinsey Energy Insights',
  '2025-01-22'::date,
  8000000000.00,
  'PLN-IP'
FROM dim_procurement_category c
WHERE c.category_code IN ('CAT-013', 'CAT-007')
LIMIT 2;
