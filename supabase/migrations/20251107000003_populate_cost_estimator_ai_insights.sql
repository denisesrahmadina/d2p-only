/*
  # Cost Estimator Module - AI Insights

  This migration populates AI-generated insights and recommendations
*/

-- Insert AI Insights
INSERT INTO fact_cost_ai_insight (insight_code, insight_type, priority_level, title, description, affected_items, affected_variables, recommendation, potential_impact_percentage, confidence_score, source_reference_id, is_active, generated_at, expires_at)
SELECT
  'INS-STEEL-001',
  'Price Alert',
  'High',
  'Steel Price at 12-Month Low',
  'Steel price index has dropped 15% to reach a 12-month low due to oversupply in Asian markets. This presents a significant cost-saving opportunity for steel-intensive components.',
  ARRAY(SELECT id FROM dim_item WHERE item_code IN ('GEN-TB-001', 'GEN-RA-004', 'ELEC-DT-003', 'ELEC-CB-004')),
  ARRAY['STEEL-IDX'],
  'Proceed with procurement of steel-intensive components immediately. Consider bulk purchasing to lock in current favorable rates. Estimated savings: 8-10% on material costs.',
  -8.3,
  0.92,
  (SELECT id FROM fact_mi_reference WHERE reference_code = 'MI-STL-2401'),
  true,
  now(),
  now() + interval '30 days'
UNION ALL
SELECT
  'INS-FOREX-002',
  'Market Intelligence',
  'Medium',
  'IDR Stabilization Benefits Import Costs',
  'USD/IDR exchange rate has stabilized at 15,000 following central bank intervention, creating favorable conditions for imported equipment. The rate represents a 2% improvement from previous quarter.',
  ARRAY(SELECT id FROM dim_item WHERE dataset IN ('Dataset A', 'Dataset B')),
  ARRAY['USD-IDR', 'EUR-IDR'],
  'Optimal timing for procuring imported components. The stable forex environment reduces currency risk for forward contracts. Consider negotiating fixed-price contracts to capitalize on current rates.',
  -2.1,
  0.88,
  (SELECT id FROM fact_mi_reference WHERE reference_code = 'MI-FX-2402'),
  true,
  now(),
  now() + interval '45 days'
UNION ALL
SELECT
  'INS-COPPER-003',
  'Price Alert',
  'Medium',
  'Copper Prices Declining Due to Supply Increase',
  'Copper price index down 4% as new Chilean mines increase global supply. This impacts cost structure of coil and winding-based components.',
  ARRAY(SELECT id FROM dim_item WHERE item_code IN ('GEN-GC-002', 'ELEC-DT-003')),
  ARRAY['COPPER-IDX'],
  'Good opportunity for procuring copper-intensive generator components. Prices expected to stabilize at current levels for next 6 months. Recommend securing supplier contracts at current rates.',
  -4.2,
  0.85,
  (SELECT id FROM fact_mi_reference WHERE reference_code = 'MI-COP-2401'),
  true,
  now(),
  now() + interval '60 days'
UNION ALL
SELECT
  'INS-TARIFF-004',
  'Policy Update',
  'High',
  'Import Tariff Reduction for Renewable Energy Equipment',
  'Indonesian government has reduced import tariffs on renewable energy equipment by 5%, effective February 2025. This directly reduces logistics and total cost for imported components.',
  ARRAY(SELECT id FROM dim_item WHERE dataset IN ('Dataset A', 'Dataset B')),
  ARRAY['TARIFF-IDX'],
  'Immediate procurement recommended to capitalize on tariff reduction. Expected 4-5% cost savings on imported renewable energy equipment. Update cost models to reflect new tariff structure.',
  -4.8,
  0.95,
  (SELECT id FROM fact_mi_reference WHERE reference_code = 'MI-TAR-2401'),
  true,
  now(),
  now() + interval '90 days'
UNION ALL
SELECT
  'INS-LOGISTICS-005',
  'Market Intelligence',
  'Medium',
  'Regional Logistics Costs Declining',
  'Container shipping costs down 8% YoY with improved port efficiency across Southeast Asia. Reduced port congestion in Indonesian facilities accelerating customs clearance.',
  ARRAY(SELECT id FROM dim_item WHERE dataset IN ('Dataset A', 'Dataset B')),
  ARRAY['LOGISTICS-IDX'],
  'Favorable logistics environment supports just-in-time procurement strategy. Consider optimizing delivery schedules to maximize savings. Logistics cost component expected to decrease by 5%.',
  -4.5,
  0.82,
  (SELECT id FROM fact_mi_reference WHERE reference_code = 'MI-LOG-2401'),
  true,
  now(),
  now() + interval '45 days'
UNION ALL
SELECT
  'INS-ALUMINUM-006',
  'Price Alert',
  'Low',
  'Aluminum Market Softening Creates Opportunity',
  'Aluminum prices down 4.5% due to increased production capacity and moderate demand growth. Affects cooling systems and structural components.',
  ARRAY(SELECT id FROM dim_item WHERE item_code IN ('GEN-CS-005', 'ELEC-SP-005')),
  ARRAY['ALUMINUM-IDX'],
  'Monitor aluminum-intensive components for procurement opportunities. Price decline creating favorable conditions for bulk purchases. Consider 6-month forward contracts.',
  -3.8,
  0.78,
  (SELECT id FROM fact_mi_reference WHERE reference_code = 'MI-ALU-2401'),
  true,
  now(),
  now() + interval '60 days'
UNION ALL
SELECT
  'INS-TURBINE-007',
  'Item Recommendation',
  'High',
  'Turbine Blade Assembly - Proceed with Procurement',
  'AI cost analysis indicates Turbine Blade Assembly (GEN-TB-001) currently 7.2% below historical average due to favorable steel prices and forex rates. All market indicators support immediate procurement.',
  ARRAY(SELECT id FROM dim_item WHERE item_code = 'GEN-TB-001'),
  ARRAY['STEEL-IDX', 'USD-IDR'],
  'Strong recommendation to proceed with Turbine Blade Assembly procurement. Current Should-Cost of $116,000 vs historical price of $125,000 represents significant savings. Market conditions favorable for next 60 days.',
  -7.2,
  0.94,
  NULL,
  true,
  now(),
  now() + interval '60 days'
UNION ALL
SELECT
  'INS-GENERATOR-008',
  'Item Recommendation',
  'High',
  'Generator Coil System - Optimal Procurement Timing',
  'Generator Coil System (GEN-GC-002) shows 7.2% cost reduction opportunity driven by copper price decline and stable forex. AI baseline recommends proceeding with procurement.',
  ARRAY(SELECT id FROM dim_item WHERE item_code = 'GEN-GC-002'),
  ARRAY['COPPER-IDX', 'USD-IDR'],
  'Proceed with Generator Coil System purchase. Current Should-Cost of $232,000 vs $250,000 historical contract represents excellent value. Copper supply outlook supports price stability.',
  -7.2,
  0.91,
  NULL,
  true,
  now(),
  now() + interval '60 days'
UNION ALL
SELECT
  'INS-CONTROL-009',
  'Item Recommendation',
  'Medium',
  'Control Panel System - Favorable Conditions',
  'Control Panel System (GEN-CP-003) presents 7.1% savings opportunity. Reduced tariffs on electronic components and improved logistics costs create favorable environment.',
  ARRAY(SELECT id FROM dim_item WHERE item_code = 'GEN-CP-003'),
  ARRAY['TARIFF-IDX', 'LOGISTICS-IDX'],
  'Good timing for Control Panel System procurement. Should-Cost of $41,800 vs $45,000 historical baseline. Consider negotiating volume discounts for additional savings.',
  -7.1,
  0.87,
  NULL,
  true,
  now(),
  now() + interval '45 days'
UNION ALL
SELECT
  'INS-ROTOR-010',
  'Item Recommendation',
  'High',
  'Rotor Assembly - Significant Cost Reduction Available',
  'Rotor Assembly (GEN-RA-004) shows 7.1% potential savings driven by steel price reduction and tariff benefits. High precision components benefiting from improved supply chain.',
  ARRAY(SELECT id FROM dim_item WHERE item_code = 'GEN-RA-004'),
  ARRAY['STEEL-IDX', 'TARIFF-IDX'],
  'Strong buy recommendation for Rotor Assembly. AI Should-Cost of $91,000 vs $98,000 historical represents optimal value. Steel price stabilization expected to maintain savings window.',
  -7.1,
  0.93,
  NULL,
  true,
  now(),
  now() + interval '60 days'
UNION ALL
SELECT
  'INS-COOLING-011',
  'Item Recommendation',
  'Medium',
  'Cooling System Module - Cost Savings Opportunity',
  'Cooling System Module (GEN-CS-005) demonstrates 7.2% cost improvement from aluminum price softening and reduced logistics expenses.',
  ARRAY(SELECT id FROM dim_item WHERE item_code = 'GEN-CS-005'),
  ARRAY['ALUMINUM-IDX', 'LOGISTICS-IDX'],
  'Favorable conditions for Cooling System procurement. Current Should-Cost $66,800 vs $72,000 baseline. Aluminum market stability supports forward contracting.',
  -7.2,
  0.86,
  NULL,
  true,
  now(),
  now() + interval '45 days'
UNION ALL
SELECT
  'INS-SMARTMETER-012',
  'Item Recommendation',
  'Medium',
  'Smart Meter - Procurement Recommended',
  'Smart Meter (ELEC-SM-001) shows 5.3% savings opportunity from tariff reduction and stable component pricing. IoT chipset supply improving.',
  ARRAY(SELECT id FROM dim_item WHERE item_code = 'ELEC-SM-001'),
  ARRAY['TARIFF-IDX', 'USD-IDR'],
  'Good timing for Smart Meter bulk purchase. Should-Cost $805/unit vs $850/unit historical. Consider 500+ unit order for volume pricing.',
  -5.3,
  0.84,
  NULL,
  true,
  now(),
  now() + interval '45 days'
UNION ALL
SELECT
  'INS-FIBER-013',
  'Item Recommendation',
  'Medium',
  'Fiber Optic Cable - Market Conditions Favorable',
  'Fiber Optic Cable (ELEC-FC-002) presents 4.9% savings from improved silica supply and logistics cost reduction.',
  ARRAY(SELECT id FROM dim_item WHERE item_code = 'ELEC-FC-002'),
  ARRAY['SILICA-IDX', 'LOGISTICS-IDX'],
  'Proceed with Fiber Optic Cable procurement. Current rate $42.80/m vs $45/m historical. Large volume purchases (2000m+) recommended.',
  -4.9,
  0.81,
  NULL,
  true,
  now(),
  now() + interval '45 days'
UNION ALL
SELECT
  'INS-TRANSFORMER-014',
  'Item Recommendation',
  'High',
  'Distribution Transformer - Excellent Value',
  'Distribution Transformer (ELEC-DT-003) shows 5.4% cost reduction from combined steel, copper, and tariff benefits.',
  ARRAY(SELECT id FROM dim_item WHERE item_code = 'ELEC-DT-003'),
  ARRAY['STEEL-IDX', 'COPPER-IDX', 'TARIFF-IDX'],
  'Strong recommendation for Distribution Transformer procurement. Should-Cost $175,000 vs $185,000 represents significant savings on high-value equipment.',
  -5.4,
  0.90,
  NULL,
  true,
  now(),
  now() + interval '60 days'
UNION ALL
SELECT
  'INS-BREAKER-015',
  'Item Recommendation',
  'Medium',
  'Circuit Breaker - Cost Optimization Available',
  'Circuit Breaker HV (ELEC-CB-004) demonstrates 5.6% savings opportunity from steel price decline and improved logistics.',
  ARRAY(SELECT id FROM dim_item WHERE item_code = 'ELEC-CB-004'),
  ARRAY['STEEL-IDX', 'LOGISTICS-IDX'],
  'Favorable timing for Circuit Breaker procurement. Should-Cost $11,800 vs $12,500 historical. Arc protection technology costs stable.',
  -5.6,
  0.85,
  NULL,
  true,
  now(),
  now() + interval '45 days'
UNION ALL
SELECT
  'INS-SWITCHGEAR-016',
  'Item Recommendation',
  'Medium',
  'Switchgear Panel - Procurement Window Open',
  'Switchgear Panel (ELEC-SP-005) shows 5.3% cost improvement from aluminum and automation component pricing.',
  ARRAY(SELECT id FROM dim_item WHERE item_code = 'ELEC-SP-005'),
  ARRAY['ALUMINUM-IDX', 'TARIFF-IDX'],
  'Good conditions for Switchgear Panel purchase. Should-Cost $90,000 vs $95,000 baseline. Modular design approach optimizing costs.',
  -5.3,
  0.83,
  NULL,
  true,
  now(),
  now() + interval '45 days';
