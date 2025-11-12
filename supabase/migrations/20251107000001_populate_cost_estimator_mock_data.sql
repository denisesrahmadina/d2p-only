/*
  # Cost Estimator Module - Mock Data Population

  This migration populates comprehensive mock data for the Cost Estimator module including:

  1. Dataset A: Generation Equipment (5 items)
  2. Dataset B: Electrical Distribution Components (5 items)
  3. Historical cost variables with time series data (24 months)
  4. Market intelligence references
  5. Historical BOQ and RFI data
  6. Cost baselines and forecasts
  7. AI-generated insights and recommendations
*/

-- Insert Master Items for Dataset A: Generation Equipment
INSERT INTO dim_item (item_code, item_name, category, sub_category, unit_of_measure, description, dataset, image_url) VALUES
('GEN-TB-001', 'Turbine Blade Assembly', 'Generation Equipment', 'Turbine Components', 'Unit', 'High-efficiency turbine blade assembly for renewable energy generation', 'Dataset A', '/public/image.png'),
('GEN-GC-002', 'Generator Coil System', 'Generation Equipment', 'Generator Parts', 'Set', 'Advanced generator coil system with copper windings', 'Dataset A', '/public/image.png'),
('GEN-CP-003', 'Control Panel System', 'Generation Equipment', 'Control Systems', 'Unit', 'Intelligent control panel for power generation monitoring', 'Dataset A', '/public/image.png'),
('GEN-RA-004', 'Rotor Assembly', 'Generation Equipment', 'Turbine Components', 'Unit', 'Precision-engineered rotor assembly for maximum efficiency', 'Dataset A', '/public/image.png'),
('GEN-CS-005', 'Cooling System Module', 'Generation Equipment', 'Auxiliary Systems', 'Unit', 'Advanced cooling system for thermal management', 'Dataset A', '/public/image.png');

-- Insert Master Items for Dataset B: Electrical Distribution
INSERT INTO dim_item (item_code, item_name, category, sub_category, unit_of_measure, description, dataset, image_url) VALUES
('ELEC-SM-001', 'Smart Meter (3-Phase)', 'Electrical Distribution', 'Metering', 'Unit', 'IoT-enabled 3-phase smart meter with remote monitoring', 'Dataset B', '/public/image.png'),
('ELEC-FC-002', 'Fiber Optic Cable', 'Electrical Distribution', 'Cabling', 'Meter', 'High-speed fiber optic cable for power grid communication', 'Dataset B', '/public/image.png'),
('ELEC-DT-003', 'Distribution Transformer', 'Electrical Distribution', 'Transformers', 'Unit', '1000 kVA oil-immersed distribution transformer', 'Dataset B', '/public/image.png'),
('ELEC-CB-004', 'Circuit Breaker (HV)', 'Electrical Distribution', 'Protection', 'Unit', 'High-voltage circuit breaker with arc protection', 'Dataset B', '/public/image.png'),
('ELEC-SP-005', 'Switchgear Panel', 'Electrical Distribution', 'Distribution', 'Panel', 'Medium voltage switchgear panel with automation', 'Dataset B', '/public/image.png');

-- Insert Cost Structure Standards for Dataset A
INSERT INTO fact_cost_structure_standard (
  item_id, material_percentage, labor_percentage, logistics_percentage, overhead_percentage,
  historical_avg_material, historical_avg_labor, historical_avg_logistics, historical_avg_overhead,
  ai_recommendation, variance_from_avg
)
SELECT
  id,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 60.00
    WHEN 'GEN-GC-002' THEN 55.00
    WHEN 'GEN-CP-003' THEN 45.00
    WHEN 'GEN-RA-004' THEN 62.00
    WHEN 'GEN-CS-005' THEN 50.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 20.00
    WHEN 'GEN-GC-002' THEN 25.00
    WHEN 'GEN-CP-003' THEN 30.00
    WHEN 'GEN-RA-004' THEN 18.00
    WHEN 'GEN-CS-005' THEN 25.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 10.00
    WHEN 'GEN-GC-002' THEN 10.00
    WHEN 'GEN-CP-003' THEN 15.00
    WHEN 'GEN-RA-004' THEN 12.00
    WHEN 'GEN-CS-005' THEN 15.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 10.00
    WHEN 'GEN-GC-002' THEN 10.00
    WHEN 'GEN-CP-003' THEN 10.00
    WHEN 'GEN-RA-004' THEN 8.00
    WHEN 'GEN-CS-005' THEN 10.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 55.00
    WHEN 'GEN-GC-002' THEN 52.00
    WHEN 'GEN-CP-003' THEN 42.00
    WHEN 'GEN-RA-004' THEN 58.00
    WHEN 'GEN-CS-005' THEN 48.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 22.00
    WHEN 'GEN-GC-002' THEN 26.00
    WHEN 'GEN-CP-003' THEN 32.00
    WHEN 'GEN-RA-004' THEN 20.00
    WHEN 'GEN-CS-005' THEN 27.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 13.00
    WHEN 'GEN-GC-002' THEN 12.00
    WHEN 'GEN-CP-003' THEN 16.00
    WHEN 'GEN-RA-004' THEN 14.00
    WHEN 'GEN-CS-005' THEN 16.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 10.00
    WHEN 'GEN-GC-002' THEN 10.00
    WHEN 'GEN-CP-003' THEN 10.00
    WHEN 'GEN-RA-004' THEN 8.00
    WHEN 'GEN-CS-005' THEN 9.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 'Material cost ratio trending above average vs historical contracts (5% deviation). Consider negotiating bulk purchase to optimize material costs.'
    WHEN 'GEN-GC-002' THEN 'Copper content high due to coil density. Current structure optimal given market conditions for raw copper.'
    WHEN 'GEN-CP-003' THEN 'Labor percentage increased due to software integration complexity. Recommend standardizing configuration to reduce customization labor.'
    WHEN 'GEN-RA-004' THEN 'Material costs elevated due to precision steel requirements. Structure aligns with industry benchmarks for high-tolerance components.'
    WHEN 'GEN-CS-005' THEN 'Balanced cost structure. Logistics percentage optimal given thermal insulation material requirements.'
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 5.00
    WHEN 'GEN-GC-002' THEN 3.00
    WHEN 'GEN-CP-003' THEN 3.00
    WHEN 'GEN-RA-004' THEN 4.00
    WHEN 'GEN-CS-005' THEN 2.00
  END
FROM dim_item
WHERE dataset = 'Dataset A';

-- Insert Cost Structure Standards for Dataset B
INSERT INTO fact_cost_structure_standard (
  item_id, material_percentage, labor_percentage, logistics_percentage, overhead_percentage,
  historical_avg_material, historical_avg_labor, historical_avg_logistics, historical_avg_overhead,
  ai_recommendation, variance_from_avg
)
SELECT
  id,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 50.00
    WHEN 'ELEC-FC-002' THEN 65.00
    WHEN 'ELEC-DT-003' THEN 58.00
    WHEN 'ELEC-CB-004' THEN 52.00
    WHEN 'ELEC-SP-005' THEN 48.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 25.00
    WHEN 'ELEC-FC-002' THEN 15.00
    WHEN 'ELEC-DT-003' THEN 20.00
    WHEN 'ELEC-CB-004' THEN 22.00
    WHEN 'ELEC-SP-005' THEN 28.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 15.00
    WHEN 'ELEC-FC-002' THEN 12.00
    WHEN 'ELEC-DT-003' THEN 14.00
    WHEN 'ELEC-CB-004' THEN 16.00
    WHEN 'ELEC-SP-005' THEN 14.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 10.00
    WHEN 'ELEC-FC-002' THEN 8.00
    WHEN 'ELEC-DT-003' THEN 8.00
    WHEN 'ELEC-CB-004' THEN 10.00
    WHEN 'ELEC-SP-005' THEN 10.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 48.00
    WHEN 'ELEC-FC-002' THEN 62.00
    WHEN 'ELEC-DT-003' THEN 55.00
    WHEN 'ELEC-CB-004' THEN 50.00
    WHEN 'ELEC-SP-005' THEN 46.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 27.00
    WHEN 'ELEC-FC-002' THEN 18.00
    WHEN 'ELEC-DT-003' THEN 22.00
    WHEN 'ELEC-CB-004' THEN 24.00
    WHEN 'ELEC-SP-005' THEN 30.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 15.00
    WHEN 'ELEC-FC-002' THEN 12.00
    WHEN 'ELEC-DT-003' THEN 15.00
    WHEN 'ELEC-CB-004' THEN 16.00
    WHEN 'ELEC-SP-005' THEN 14.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 10.00
    WHEN 'ELEC-FC-002' THEN 8.00
    WHEN 'ELEC-DT-003' THEN 8.00
    WHEN 'ELEC-CB-004' THEN 10.00
    WHEN 'ELEC-SP-005' THEN 10.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 'IoT components driving material costs slightly above historical average. Recommend long-term supplier contracts for chipsets.'
    WHEN 'ELEC-FC-002' THEN 'Fiber optic material costs trending upward due to silica supply chain. Consider alternative suppliers in Southeast Asia.'
    WHEN 'ELEC-DT-003' THEN 'Transformer oil and copper content driving material costs. Structure optimal for current commodity pricing environment.'
    WHEN 'ELEC-CB-004' THEN 'Arc protection technology adding material complexity. Labor percentage reduced through automation improvements.'
    WHEN 'ELEC-SP-005' THEN 'Automation integration increasing labor percentage. Material costs optimized through modular design approach.'
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 2.00
    WHEN 'ELEC-FC-002' THEN 3.00
    WHEN 'ELEC-DT-003' THEN 3.00
    WHEN 'ELEC-CB-004' THEN 2.00
    WHEN 'ELEC-SP-005' THEN 2.00
  END
FROM dim_item
WHERE dataset = 'Dataset B';

-- Insert Cost Variables (Current and Historical)
INSERT INTO fact_cost_variable (variable_code, variable_name, variable_type, current_rate, rate_date, previous_rate, rate_change_percentage, unit, source_reference, is_alert_active, alert_type) VALUES
-- Commodities
('STEEL-IDX', 'Steel Price Index', 'Commodity', 890.00, '2025-02-01', 1015.00, -12.32, 'Index Points', 'MI-STL-2401', true, 'Favorable'),
('COPPER-IDX', 'Copper Price Index', 'Commodity', 8750.00, '2025-02-01', 9120.00, -4.06, 'USD/MT', 'MI-COP-2401', true, 'Favorable'),
('ALUMINUM-IDX', 'Aluminum Price Index', 'Commodity', 2340.00, '2025-02-01', 2450.00, -4.49, 'USD/MT', 'MI-ALU-2401', true, 'Favorable'),
('OIL-TRANS', 'Transformer Oil Price', 'Commodity', 1250.00, '2025-02-01', 1180.00, 5.93, 'USD/MT', 'MI-OIL-2401', false, null),
('SILICA-IDX', 'Silica Price Index', 'Commodity', 450.00, '2025-02-01', 430.00, 4.65, 'USD/MT', 'MI-SIL-2401', false, null),

-- Forex
('USD-IDR', 'USD to IDR Exchange Rate', 'Forex', 15000.00, '2025-02-01', 15300.00, -1.96, 'IDR', 'MI-FX-2402', true, 'Favorable'),
('EUR-IDR', 'EUR to IDR Exchange Rate', 'Forex', 16500.00, '2025-02-01', 16800.00, -1.79, 'IDR', 'MI-FX-2402', true, 'Favorable'),
('CNY-IDR', 'CNY to IDR Exchange Rate', 'Forex', 2100.00, '2025-02-01', 2150.00, -2.33, 'IDR', 'MI-FX-2402', true, 'Favorable'),

-- Macro Indicators
('INFL-IDN', 'Indonesia Inflation Rate', 'Macro', 3.20, '2025-02-01', 3.45, -7.25, 'Percentage', 'MI-ECO-2401', false, null),
('TARIFF-IDX', 'Import Tariff Index', 'Macro', 105.00, '2025-02-01', 110.00, -4.55, 'Index Points', 'MI-TAR-2401', true, 'Favorable'),
('LABOR-IDX', 'Labor Cost Index', 'Macro', 118.50, '2025-02-01', 115.20, 2.86, 'Index Points', 'MI-LAB-2401', false, null),
('LOGISTICS-IDX', 'Logistics Cost Index', 'Macro', 112.30, '2025-02-01', 118.00, -4.83, 'Index Points', 'MI-LOG-2401', true, 'Favorable');

-- Insert Market Intelligence References
INSERT INTO fact_mi_reference (reference_code, title, document_type, source, publish_date, document_url, summary, key_insights, related_variables) VALUES
('MI-STL-2401', 'Global Steel Market Analysis Q4 2024', 'Market Report', 'World Steel Association', '2025-01-15', '/documents/steel-report-q4-2024.pdf',
  'Comprehensive analysis of global steel pricing trends showing significant oversupply in Asian markets leading to price corrections.',
  '["Steel prices dropped 15% due to oversupply in China and India", "Production capacity exceeding demand by 8%", "Price stabilization expected in Q2 2025", "Indonesian imports benefiting from reduced regional prices"]',
  ARRAY['STEEL-IDX']),

('MI-COP-2401', 'Copper Market Intelligence Report', 'Market Report', 'International Copper Study Group', '2025-01-20', '/documents/copper-analysis-2024.pdf',
  'Copper market showing moderate price decline due to increased mining output from South American operations.',
  '["New Chilean copper mines increasing global supply by 4%", "Electric vehicle demand growth slowing", "Price forecast stable for next 6 months", "Recommend long-term contracts at current rates"]',
  ARRAY['COPPER-IDX']),

('MI-FX-2402', 'Indonesia Currency Outlook February 2025', 'FX Analysis', 'Bank Indonesia', '2025-02-01', '/documents/bi-fx-outlook-feb-2025.pdf',
  'IDR stabilization following central bank intervention and improved trade balance. Exchange rate favorable for importers.',
  '["USD/IDR stabilized at 15,000 after central bank intervention", "Trade surplus contributing to currency strength", "Favorable conditions for equipment imports", "Expected stability through Q1 2025"]',
  ARRAY['USD-IDR', 'EUR-IDR', 'CNY-IDR']),

('MI-TAR-2401', 'Indonesia Import Tariff Policy Update', 'Policy Brief', 'Ministry of Trade', '2025-01-10', '/documents/import-tariff-update-2025.pdf',
  'Reduced import tariffs on renewable energy equipment and components to support clean energy transition goals.',
  '["5% reduction in tariffs for renewable energy equipment", "Effective February 2025", "Expected 4-5% cost savings on imported components", "Alignment with national energy transition roadmap"]',
  ARRAY['TARIFF-IDX']),

('MI-LOG-2401', 'Southeast Asia Logistics Cost Index', 'Industry Report', 'Asia Logistics Association', '2025-01-25', '/documents/sea-logistics-report-2024.pdf',
  'Declining shipping costs and improved port efficiency driving down logistics expenses across the region.',
  '["Container shipping costs down 8% YoY", "Port congestion reduced by 15%", "Faster customs clearance in Indonesian ports", "Recommend optimizing procurement timing"]',
  ARRAY['LOGISTICS-IDX']),

('MI-ALU-2401', 'Aluminum Market Dynamics Report', 'Market Report', 'International Aluminium Institute', '2025-01-18', '/documents/aluminum-market-2024.pdf',
  'Aluminum prices softening due to increased production capacity and moderate demand growth.',
  '["Global production capacity up 6%", "Construction sector demand moderating", "Price decline creating procurement opportunities", "Optimal timing for bulk purchases"]',
  ARRAY['ALUMINUM-IDX']);

-- This continues in the next part due to length...
