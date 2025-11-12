/*
  # Populate Historical Unit Price Analysis Data

  ## Overview
  Populates mock data for historical unit price analysis including:
  - Business units (regions)
  - Historical price records across multiple periods
  - AI-generated insights and action plans

  ## Data Scope
  - 5 Business Units (Java 1, Java 2, Sumatra, Kalimantan, Sulawesi)
  - 3 Material categories with multiple materials
  - 12 months of historical data (2024)
  - Price trends and insights
*/

-- Get organization ID
DO $$
DECLARE
  v_org_id uuid;
  v_unit_java1 text := 'Java 1';
  v_unit_java2 text := 'Java 2';
  v_unit_sumatra text := 'Sumatra';
  v_unit_kalimantan text := 'Kalimantan';
  v_unit_sulawesi text := 'Sulawesi';
BEGIN
  -- Get first organization
  SELECT id INTO v_org_id FROM organizations LIMIT 1;

  -- Insert business units
  INSERT INTO dim_business_units (organization_id, unit_code, unit_name, region, is_active) VALUES
  (v_org_id, 'JV1', v_unit_java1, 'West Java', true),
  (v_org_id, 'JV2', v_unit_java2, 'East Java', true),
  (v_org_id, 'SUM', v_unit_sumatra, 'Sumatra Island', true),
  (v_org_id, 'KAL', v_unit_kalimantan, 'Kalimantan Island', true),
  (v_org_id, 'SUL', v_unit_sulawesi, 'Sulawesi Island', true)
  ON CONFLICT (organization_id, unit_code) DO NOTHING;

  -- Insert historical prices for Coal (Material: Bituminous Coal)
  -- Java 1 - Stable trend
  INSERT INTO fact_historical_unit_prices (
    organization_id, business_unit, category_id, material_code, material_name,
    price_per_unit, unit_of_measure, purchase_date, vendor_name, 
    quantity_purchased, total_value, period_month, period_year
  ) VALUES
  (v_org_id, v_unit_java1, NULL, 'COAL-001', 'Bituminous Coal', 85.50, 'TON', '2024-01-15', 'PT Adaro Energy', 1000, 85500, 1, 2024),
  (v_org_id, v_unit_java1, NULL, 'COAL-001', 'Bituminous Coal', 86.20, 'TON', '2024-02-15', 'PT Adaro Energy', 1200, 103440, 2, 2024),
  (v_org_id, v_unit_java1, NULL, 'COAL-001', 'Bituminous Coal', 85.80, 'TON', '2024-03-15', 'PT Adaro Energy', 1100, 94380, 3, 2024),
  (v_org_id, v_unit_java1, NULL, 'COAL-001', 'Bituminous Coal', 86.50, 'TON', '2024-04-15', 'PT Adaro Energy', 1050, 90825, 4, 2024),
  (v_org_id, v_unit_java1, NULL, 'COAL-001', 'Bituminous Coal', 86.00, 'TON', '2024-05-15', 'PT Adaro Energy', 1150, 98900, 5, 2024),
  (v_org_id, v_unit_java1, NULL, 'COAL-001', 'Bituminous Coal', 86.30, 'TON', '2024-06-15', 'PT Adaro Energy', 1100, 94930, 6, 2024),
  (v_org_id, v_unit_java1, NULL, 'COAL-001', 'Bituminous Coal', 85.90, 'TON', '2024-07-15', 'PT Adaro Energy', 1200, 103080, 7, 2024),
  (v_org_id, v_unit_java1, NULL, 'COAL-001', 'Bituminous Coal', 86.40, 'TON', '2024-08-15', 'PT Adaro Energy', 1150, 99360, 8, 2024),
  (v_org_id, v_unit_java1, NULL, 'COAL-001', 'Bituminous Coal', 86.10, 'TON', '2024-09-15', 'PT Adaro Energy', 1100, 94710, 9, 2024),
  (v_org_id, v_unit_java1, NULL, 'COAL-001', 'Bituminous Coal', 86.60, 'TON', '2024-10-15', 'PT Adaro Energy', 1050, 90930, 10, 2024),
  (v_org_id, v_unit_java1, NULL, 'COAL-001', 'Bituminous Coal', 86.20, 'TON', '2024-11-15', 'PT Adaro Energy', 1200, 103440, 11, 2024),
  (v_org_id, v_unit_java1, NULL, 'COAL-001', 'Bituminous Coal', 86.50, 'TON', '2024-12-15', 'PT Adaro Energy', 1150, 99475, 12, 2024);

  -- Java 2 - Rising trend
  INSERT INTO fact_historical_unit_prices (
    organization_id, business_unit, category_id, material_code, material_name,
    price_per_unit, unit_of_measure, purchase_date, vendor_name, 
    quantity_purchased, total_value, period_month, period_year
  ) VALUES
  (v_org_id, v_unit_java2, NULL, 'COAL-001', 'Bituminous Coal', 83.00, 'TON', '2024-01-15', 'PT Bumi Resources', 900, 74700, 1, 2024),
  (v_org_id, v_unit_java2, NULL, 'COAL-001', 'Bituminous Coal', 84.50, 'TON', '2024-02-15', 'PT Bumi Resources', 950, 80275, 2, 2024),
  (v_org_id, v_unit_java2, NULL, 'COAL-001', 'Bituminous Coal', 86.20, 'TON', '2024-03-15', 'PT Bumi Resources', 920, 79304, 3, 2024),
  (v_org_id, v_unit_java2, NULL, 'COAL-001', 'Bituminous Coal', 87.80, 'TON', '2024-04-15', 'PT Bumi Resources', 880, 77264, 4, 2024),
  (v_org_id, v_unit_java2, NULL, 'COAL-001', 'Bituminous Coal', 89.50, 'TON', '2024-05-15', 'PT Bumi Resources', 940, 84130, 5, 2024),
  (v_org_id, v_unit_java2, NULL, 'COAL-001', 'Bituminous Coal', 91.20, 'TON', '2024-06-15', 'PT Bumi Resources', 910, 82992, 6, 2024),
  (v_org_id, v_unit_java2, NULL, 'COAL-001', 'Bituminous Coal', 92.80, 'TON', '2024-07-15', 'PT Bumi Resources', 970, 90016, 7, 2024),
  (v_org_id, v_unit_java2, NULL, 'COAL-001', 'Bituminous Coal', 94.30, 'TON', '2024-08-15', 'PT Bumi Resources', 930, 87699, 8, 2024),
  (v_org_id, v_unit_java2, NULL, 'COAL-001', 'Bituminous Coal', 95.70, 'TON', '2024-09-15', 'PT Bumi Resources', 900, 86130, 9, 2024),
  (v_org_id, v_unit_java2, NULL, 'COAL-001', 'Bituminous Coal', 97.40, 'TON', '2024-10-15', 'PT Bumi Resources', 880, 85712, 10, 2024),
  (v_org_id, v_unit_java2, NULL, 'COAL-001', 'Bituminous Coal', 98.90, 'TON', '2024-11-15', 'PT Bumi Resources', 950, 93955, 11, 2024),
  (v_org_id, v_unit_java2, NULL, 'COAL-001', 'Bituminous Coal', 100.20, 'TON', '2024-12-15', 'PT Bumi Resources', 920, 92184, 12, 2024);

  -- Sumatra - Falling trend
  INSERT INTO fact_historical_unit_prices (
    organization_id, business_unit, category_id, material_code, material_name,
    price_per_unit, unit_of_measure, purchase_date, vendor_name, 
    quantity_purchased, total_value, period_month, period_year
  ) VALUES
  (v_org_id, v_unit_sumatra, NULL, 'COAL-001', 'Bituminous Coal', 92.00, 'TON', '2024-01-15', 'PT Bukit Asam', 1100, 101200, 1, 2024),
  (v_org_id, v_unit_sumatra, NULL, 'COAL-001', 'Bituminous Coal', 90.50, 'TON', '2024-02-15', 'PT Bukit Asam', 1150, 104075, 2, 2024),
  (v_org_id, v_unit_sumatra, NULL, 'COAL-001', 'Bituminous Coal', 89.20, 'TON', '2024-03-15', 'PT Bukit Asam', 1080, 96336, 3, 2024),
  (v_org_id, v_unit_sumatra, NULL, 'COAL-001', 'Bituminous Coal', 87.80, 'TON', '2024-04-15', 'PT Bukit Asam', 1120, 98336, 4, 2024),
  (v_org_id, v_unit_sumatra, NULL, 'COAL-001', 'Bituminous Coal', 86.30, 'TON', '2024-05-15', 'PT Bukit Asam', 1090, 94067, 5, 2024),
  (v_org_id, v_unit_sumatra, NULL, 'COAL-001', 'Bituminous Coal', 84.90, 'TON', '2024-06-15', 'PT Bukit Asam', 1140, 96786, 6, 2024),
  (v_org_id, v_unit_sumatra, NULL, 'COAL-001', 'Bituminous Coal', 83.50, 'TON', '2024-07-15', 'PT Bukit Asam', 1100, 91850, 7, 2024),
  (v_org_id, v_unit_sumatra, NULL, 'COAL-001', 'Bituminous Coal', 82.20, 'TON', '2024-08-15', 'PT Bukit Asam', 1130, 92886, 8, 2024),
  (v_org_id, v_unit_sumatra, NULL, 'COAL-001', 'Bituminous Coal', 80.80, 'TON', '2024-09-15', 'PT Bukit Asam', 1070, 86456, 9, 2024),
  (v_org_id, v_unit_sumatra, NULL, 'COAL-001', 'Bituminous Coal', 79.50, 'TON', '2024-10-15', 'PT Bukit Asam', 1110, 88245, 10, 2024),
  (v_org_id, v_unit_sumatra, NULL, 'COAL-001', 'Bituminous Coal', 78.20, 'TON', '2024-11-15', 'PT Bukit Asam', 1080, 84456, 11, 2024),
  (v_org_id, v_unit_sumatra, NULL, 'COAL-001', 'Bituminous Coal', 77.00, 'TON', '2024-12-15', 'PT Bukit Asam', 1140, 87780, 12, 2024);

  -- Kalimantan - Volatile but trending up
  INSERT INTO fact_historical_unit_prices (
    organization_id, business_unit, category_id, material_code, material_name,
    price_per_unit, unit_of_measure, purchase_date, vendor_name, 
    quantity_purchased, total_value, period_month, period_year
  ) VALUES
  (v_org_id, v_unit_kalimantan, NULL, 'COAL-001', 'Bituminous Coal', 88.00, 'TON', '2024-01-15', 'PT Indo Tambangraya', 850, 74800, 1, 2024),
  (v_org_id, v_unit_kalimantan, NULL, 'COAL-001', 'Bituminous Coal', 90.50, 'TON', '2024-02-15', 'PT Indo Tambangraya', 900, 81450, 2, 2024),
  (v_org_id, v_unit_kalimantan, NULL, 'COAL-001', 'Bituminous Coal', 87.20, 'TON', '2024-03-15', 'PT Indo Tambangraya', 880, 76736, 3, 2024),
  (v_org_id, v_unit_kalimantan, NULL, 'COAL-001', 'Bituminous Coal', 91.80, 'TON', '2024-04-15', 'PT Indo Tambangraya', 920, 84456, 4, 2024),
  (v_org_id, v_unit_kalimantan, NULL, 'COAL-001', 'Bituminous Coal', 89.50, 'TON', '2024-05-15', 'PT Indo Tambangraya', 870, 77865, 5, 2024),
  (v_org_id, v_unit_kalimantan, NULL, 'COAL-001', 'Bituminous Coal', 93.20, 'TON', '2024-06-15', 'PT Indo Tambangraya', 940, 87608, 6, 2024),
  (v_org_id, v_unit_kalimantan, NULL, 'COAL-001', 'Bituminous Coal', 91.00, 'TON', '2024-07-15', 'PT Indo Tambangraya', 890, 80990, 7, 2024),
  (v_org_id, v_unit_kalimantan, NULL, 'COAL-001', 'Bituminous Coal', 94.80, 'TON', '2024-08-15', 'PT Indo Tambangraya', 930, 88164, 8, 2024),
  (v_org_id, v_unit_kalimantan, NULL, 'COAL-001', 'Bituminous Coal', 92.50, 'TON', '2024-09-15', 'PT Indo Tambangraya', 860, 79550, 9, 2024),
  (v_org_id, v_unit_kalimantan, NULL, 'COAL-001', 'Bituminous Coal', 96.20, 'TON', '2024-10-15', 'PT Indo Tambangraya', 910, 87542, 10, 2024),
  (v_org_id, v_unit_kalimantan, NULL, 'COAL-001', 'Bituminous Coal', 94.00, 'TON', '2024-11-15', 'PT Indo Tambangraya', 880, 82720, 11, 2024),
  (v_org_id, v_unit_kalimantan, NULL, 'COAL-001', 'Bituminous Coal', 97.50, 'TON', '2024-12-15', 'PT Indo Tambangraya', 920, 89700, 12, 2024);

  -- Sulawesi - Stable low prices
  INSERT INTO fact_historical_unit_prices (
    organization_id, business_unit, category_id, material_code, material_name,
    price_per_unit, unit_of_measure, purchase_date, vendor_name, 
    quantity_purchased, total_value, period_month, period_year
  ) VALUES
  (v_org_id, v_unit_sulawesi, NULL, 'COAL-001', 'Bituminous Coal', 81.00, 'TON', '2024-01-15', 'PT Vale Indonesia', 750, 60750, 1, 2024),
  (v_org_id, v_unit_sulawesi, NULL, 'COAL-001', 'Bituminous Coal', 81.50, 'TON', '2024-02-15', 'PT Vale Indonesia', 780, 63570, 2, 2024),
  (v_org_id, v_unit_sulawesi, NULL, 'COAL-001', 'Bituminous Coal', 80.80, 'TON', '2024-03-15', 'PT Vale Indonesia', 760, 61408, 3, 2024),
  (v_org_id, v_unit_sulawesi, NULL, 'COAL-001', 'Bituminous Coal', 81.20, 'TON', '2024-04-15', 'PT Vale Indonesia', 770, 62524, 4, 2024),
  (v_org_id, v_unit_sulawesi, NULL, 'COAL-001', 'Bituminous Coal', 81.00, 'TON', '2024-05-15', 'PT Vale Indonesia', 790, 63990, 5, 2024),
  (v_org_id, v_unit_sulawesi, NULL, 'COAL-001', 'Bituminous Coal', 81.60, 'TON', '2024-06-15', 'PT Vale Indonesia', 750, 61200, 6, 2024),
  (v_org_id, v_unit_sulawesi, NULL, 'COAL-001', 'Bituminous Coal', 81.30, 'TON', '2024-07-15', 'PT Vale Indonesia', 780, 63414, 7, 2024),
  (v_org_id, v_unit_sulawesi, NULL, 'COAL-001', 'Bituminous Coal', 81.80, 'TON', '2024-08-15', 'PT Vale Indonesia', 770, 62986, 8, 2024),
  (v_org_id, v_unit_sulawesi, NULL, 'COAL-001', 'Bituminous Coal', 81.40, 'TON', '2024-09-15', 'PT Vale Indonesia', 760, 61864, 9, 2024),
  (v_org_id, v_unit_sulawesi, NULL, 'COAL-001', 'Bituminous Coal', 81.90, 'TON', '2024-10-15', 'PT Vale Indonesia', 780, 63882, 10, 2024),
  (v_org_id, v_unit_sulawesi, NULL, 'COAL-001', 'Bituminous Coal', 81.50, 'TON', '2024-11-15', 'PT Vale Indonesia', 750, 61125, 11, 2024),
  (v_org_id, v_unit_sulawesi, NULL, 'COAL-001', 'Bituminous Coal', 82.00, 'TON', '2024-12-15', 'PT Vale Indonesia', 790, 64780, 12, 2024);

  -- Add data for another material: Heavy Fuel Oil (HFO)
  -- Java 1 - Rising trend
  INSERT INTO fact_historical_unit_prices (
    organization_id, business_unit, category_id, material_code, material_name,
    price_per_unit, unit_of_measure, purchase_date, vendor_name, 
    quantity_purchased, total_value, period_month, period_year
  ) VALUES
  (v_org_id, v_unit_java1, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 650.00, 'KL', '2024-01-15', 'PT Pertamina', 500, 325000, 1, 2024),
  (v_org_id, v_unit_java1, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 665.00, 'KL', '2024-02-15', 'PT Pertamina', 520, 345800, 2, 2024),
  (v_org_id, v_unit_java1, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 680.00, 'KL', '2024-03-15', 'PT Pertamina', 510, 346800, 3, 2024),
  (v_org_id, v_unit_java1, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 695.00, 'KL', '2024-04-15', 'PT Pertamina', 530, 368350, 4, 2024),
  (v_org_id, v_unit_java1, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 710.00, 'KL', '2024-05-15', 'PT Pertamina', 540, 383400, 5, 2024),
  (v_org_id, v_unit_java1, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 725.00, 'KL', '2024-06-15', 'PT Pertamina', 515, 373375, 6, 2024),
  (v_org_id, v_unit_java1, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 740.00, 'KL', '2024-07-15', 'PT Pertamina', 550, 407000, 7, 2024),
  (v_org_id, v_unit_java1, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 755.00, 'KL', '2024-08-15', 'PT Pertamina', 535, 403925, 8, 2024),
  (v_org_id, v_unit_java1, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 770.00, 'KL', '2024-09-15', 'PT Pertamina', 520, 400400, 9, 2024),
  (v_org_id, v_unit_java1, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 785.00, 'KL', '2024-10-15', 'PT Pertamina', 545, 427825, 10, 2024),
  (v_org_id, v_unit_java1, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 800.00, 'KL', '2024-11-15', 'PT Pertamina', 530, 424000, 11, 2024),
  (v_org_id, v_unit_java1, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 815.00, 'KL', '2024-12-15', 'PT Pertamina', 540, 440100, 12, 2024);

  -- Java 2 - Stable trend
  INSERT INTO fact_historical_unit_prices (
    organization_id, business_unit, category_id, material_code, material_name,
    price_per_unit, unit_of_measure, purchase_date, vendor_name, 
    quantity_purchased, total_value, period_month, period_year
  ) VALUES
  (v_org_id, v_unit_java2, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 720.00, 'KL', '2024-01-15', 'PT AKR Corporindo', 450, 324000, 1, 2024),
  (v_org_id, v_unit_java2, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 722.00, 'KL', '2024-02-15', 'PT AKR Corporindo', 460, 332120, 2, 2024),
  (v_org_id, v_unit_java2, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 718.00, 'KL', '2024-03-15', 'PT AKR Corporindo', 455, 326690, 3, 2024),
  (v_org_id, v_unit_java2, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 721.00, 'KL', '2024-04-15', 'PT AKR Corporindo', 470, 338870, 4, 2024),
  (v_org_id, v_unit_java2, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 719.00, 'KL', '2024-05-15', 'PT AKR Corporindo', 465, 334335, 5, 2024),
  (v_org_id, v_unit_java2, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 723.00, 'KL', '2024-06-15', 'PT AKR Corporindo', 450, 325350, 6, 2024),
  (v_org_id, v_unit_java2, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 720.00, 'KL', '2024-07-15', 'PT AKR Corporindo', 475, 342000, 7, 2024),
  (v_org_id, v_unit_java2, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 722.00, 'KL', '2024-08-15', 'PT AKR Corporindo', 460, 332120, 8, 2024),
  (v_org_id, v_unit_java2, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 719.00, 'KL', '2024-09-15', 'PT AKR Corporindo', 455, 327145, 9, 2024),
  (v_org_id, v_unit_java2, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 721.00, 'KL', '2024-10-15', 'PT AKR Corporindo', 465, 335265, 10, 2024),
  (v_org_id, v_unit_java2, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 720.00, 'KL', '2024-11-15', 'PT AKR Corporindo', 470, 338400, 11, 2024),
  (v_org_id, v_unit_java2, NULL, 'FUEL-002', 'Heavy Fuel Oil (HFO)', 722.00, 'KL', '2024-12-15', 'PT AKR Corporindo', 460, 332120, 12, 2024);

  -- Insert AI-generated insights for Coal - Bituminous Coal
  INSERT INTO fact_unit_price_insights (
    organization_id, business_unit, category_id, material_code,
    analysis_period_start, analysis_period_end,
    average_price, lowest_price, highest_price,
    price_trend, trend_percentage, insight_summary, action_plan, priority
  ) VALUES
  (v_org_id, v_unit_java1, NULL, 'COAL-001', '2024-01-01', '2024-12-31',
   86.17, 85.50, 86.60, 'Stable', 1.29,
   'Java 1 unit maintains consistent pricing with minimal fluctuation (±1.3% variance). The stable trend indicates a well-negotiated long-term contract with PT Adaro Energy.',
   '[
     {"action": "Leverage stable pricing to negotiate multi-year contract extension", "impact": "High", "timeline": "Q1 2025"},
     {"action": "Lock in current rates through 2026 before potential market increases", "impact": "High", "timeline": "Q1 2025"},
     {"action": "Consider bulk purchasing agreements to secure volume discounts", "impact": "Medium", "timeline": "Q2 2025"}
   ]'::jsonb,
   'Medium'),
  
  (v_org_id, v_unit_java2, NULL, 'COAL-001', '2024-01-01', '2024-12-31',
   90.63, 83.00, 100.20, 'Rising', 20.72,
   'Java 2 unit experiencing significant price increases (+20.7% YoY). Rising trend suggests market pressure or contract expiration. Immediate action required to control costs.',
   '[
     {"action": "Initiate urgent vendor negotiations to cap price increases", "impact": "Critical", "timeline": "Immediate"},
     {"action": "Explore alternative suppliers in East Java region", "impact": "High", "timeline": "Q1 2025"},
     {"action": "Consider switching to Sumatra supplier with falling prices", "impact": "High", "timeline": "Q2 2025"},
     {"action": "Evaluate long-term fixed-price contracts to hedge against further increases", "impact": "High", "timeline": "Q1 2025"}
   ]'::jsonb,
   'High'),
  
  (v_org_id, v_unit_sumatra, NULL, 'COAL-001', '2024-01-01', '2024-12-31',
   84.67, 77.00, 92.00, 'Falling', -16.30,
   'Sumatra unit benefits from declining prices (-16.3% YoY). PT Bukit Asam offers competitive rates. Opportunity to maximize savings and secure favorable long-term contracts.',
   '[
     {"action": "Negotiate aggressive long-term contracts at current low rates", "impact": "High", "timeline": "Immediate"},
     {"action": "Increase order volumes to capitalize on favorable pricing", "impact": "High", "timeline": "Q1 2025"},
     {"action": "Consider redistributing supply to other units from Sumatra", "impact": "Medium", "timeline": "Q2 2025"},
     {"action": "Lock in 2-3 year contracts before prices stabilize", "impact": "High", "timeline": "Q1 2025"}
   ]'::jsonb,
   'High'),
  
  (v_org_id, v_unit_kalimantan, NULL, 'COAL-001', '2024-01-01', '2024-12-31',
   91.39, 87.20, 97.50, 'Rising', 10.80,
   'Kalimantan unit shows volatile pricing with upward trend (+10.8% YoY). High variance indicates market instability or inconsistent contracting. Consider price stabilization strategies.',
   '[
     {"action": "Negotiate volume-based pricing to reduce volatility", "impact": "High", "timeline": "Q1 2025"},
     {"action": "Implement quarterly price review mechanisms", "impact": "Medium", "timeline": "Q1 2025"},
     {"action": "Diversify supplier base to reduce dependency", "impact": "Medium", "timeline": "Q2 2025"},
     {"action": "Consider fixed-price contracts for 50% of volume", "impact": "High", "timeline": "Q1 2025"}
   ]'::jsonb,
   'High'),
  
  (v_org_id, v_unit_sulawesi, NULL, 'COAL-001', '2024-01-01', '2024-12-31',
   81.42, 80.80, 82.00, 'Stable', 1.23,
   'Sulawesi unit achieves lowest and most stable prices among all units. PT Vale Indonesia provides exceptional value. Best-in-class pricing model for organization.',
   '[
     {"action": "Document and replicate Sulawesi contracting strategy across other units", "impact": "High", "timeline": "Q1 2025"},
     {"action": "Extend current contract with PT Vale Indonesia for 3+ years", "impact": "High", "timeline": "Immediate"},
     {"action": "Increase volume allocations to Sulawesi supplier", "impact": "Medium", "timeline": "Q2 2025"},
     {"action": "Share best practices with Java 2 and Kalimantan units", "impact": "Medium", "timeline": "Q1 2025"}
   ]'::jsonb,
   'Medium');

  -- Insert insights for Heavy Fuel Oil (HFO)
  INSERT INTO fact_unit_price_insights (
    organization_id, business_unit, category_id, material_code,
    analysis_period_start, analysis_period_end,
    average_price, lowest_price, highest_price,
    price_trend, trend_percentage, insight_summary, action_plan, priority
  ) VALUES
  (v_org_id, v_unit_java1, NULL, 'FUEL-002', '2024-01-01', '2024-12-31',
   727.50, 650.00, 815.00, 'Rising', 25.38,
   'Java 1 HFO prices rising significantly (+25.4% YoY). Reflects global fuel market trends. Urgent cost management required.',
   '[
     {"action": "Explore long-term fixed-price contracts to hedge against volatility", "impact": "Critical", "timeline": "Immediate"},
     {"action": "Investigate alternative fuel sources or suppliers", "impact": "High", "timeline": "Q1 2025"},
     {"action": "Consider fuel efficiency improvements to reduce consumption", "impact": "Medium", "timeline": "Q2 2025"}
   ]'::jsonb,
   'High'),
  
  (v_org_id, v_unit_java2, NULL, 'FUEL-002', '2024-01-01', '2024-12-31',
   720.50, 718.00, 723.00, 'Stable', 0.28,
   'Java 2 achieves remarkably stable HFO pricing with minimal variance. PT AKR Corporindo demonstrates excellent contract management.',
   '[
     {"action": "Extend contract with PT AKR Corporindo immediately", "impact": "High", "timeline": "Immediate"},
     {"action": "Share contracting approach with Java 1 unit", "impact": "High", "timeline": "Q1 2025"},
     {"action": "Consider increasing volume commitments for better rates", "impact": "Medium", "timeline": "Q2 2025"}
   ]'::jsonb,
   'Medium');

END $$;