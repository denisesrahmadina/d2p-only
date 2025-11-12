/*
  # Cost Estimator Module - Reference Data and Forecasts

  This migration continues populating mock data including:
  - Historical BOQ and RFI references
  - Cost baselines
  - 12-month forecasts
  - AI insights
*/

-- Insert Historical BOQ References for Dataset A Items
INSERT INTO fact_cost_model_reference (reference_code, item_id, reference_type, reference_source, reference_date, quantity, unit_cost, total_cost, material_cost, labor_cost, logistics_cost, overhead_cost, vendor_name, contract_number, notes)
SELECT
  'BOQ-2023-' || item_code,
  id,
  'Historical Contract',
  'Contract BOQ 2023',
  '2023-06-15'::timestamptz,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 10.0000
    WHEN 'GEN-GC-002' THEN 5.0000
    WHEN 'GEN-CP-003' THEN 8.0000
    WHEN 'GEN-RA-004' THEN 12.0000
    WHEN 'GEN-CS-005' THEN 6.0000
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 125000.00
    WHEN 'GEN-GC-002' THEN 250000.00
    WHEN 'GEN-CP-003' THEN 45000.00
    WHEN 'GEN-RA-004' THEN 98000.00
    WHEN 'GEN-CS-005' THEN 72000.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 1250000.00
    WHEN 'GEN-GC-002' THEN 1250000.00
    WHEN 'GEN-CP-003' THEN 360000.00
    WHEN 'GEN-RA-004' THEN 1176000.00
    WHEN 'GEN-CS-005' THEN 432000.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 75000.00
    WHEN 'GEN-GC-002' THEN 137500.00
    WHEN 'GEN-CP-003' THEN 20250.00
    WHEN 'GEN-RA-004' THEN 60760.00
    WHEN 'GEN-CS-005' THEN 36000.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 25000.00
    WHEN 'GEN-GC-002' THEN 62500.00
    WHEN 'GEN-CP-003' THEN 13500.00
    WHEN 'GEN-RA-004' THEN 17640.00
    WHEN 'GEN-CS-005' THEN 18000.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 12500.00
    WHEN 'GEN-GC-002' THEN 25000.00
    WHEN 'GEN-CP-003' THEN 6750.00
    WHEN 'GEN-RA-004' THEN 11760.00
    WHEN 'GEN-CS-005' THEN 10800.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 12500.00
    WHEN 'GEN-GC-002' THEN 25000.00
    WHEN 'GEN-CP-003' THEN 4500.00
    WHEN 'GEN-RA-004' THEN 7840.00
    WHEN 'GEN-CS-005' THEN 7200.00
  END,
  'PT Renewable Energy Solutions',
  'CTR-2023-RE-001',
  'Historical contract from 2023 renewable energy project'
FROM dim_item WHERE dataset = 'Dataset A';

-- Insert Supplier RFI References for Dataset A Items
INSERT INTO fact_cost_model_reference (reference_code, item_id, reference_type, reference_source, reference_date, quantity, unit_cost, total_cost, material_cost, labor_cost, logistics_cost, overhead_cost, vendor_name, contract_number, notes)
SELECT
  'RFI-2024-' || item_code,
  id,
  'Supplier RFI',
  'Vendor Quote 2024',
  '2024-11-20'::timestamptz,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 10.0000
    WHEN 'GEN-GC-002' THEN 5.0000
    WHEN 'GEN-CP-003' THEN 8.0000
    WHEN 'GEN-RA-004' THEN 12.0000
    WHEN 'GEN-CS-005' THEN 6.0000
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 118000.00
    WHEN 'GEN-GC-002' THEN 236000.00
    WHEN 'GEN-CP-003' THEN 42500.00
    WHEN 'GEN-RA-004' THEN 92500.00
    WHEN 'GEN-CS-005' THEN 68000.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 1180000.00
    WHEN 'GEN-GC-002' THEN 1180000.00
    WHEN 'GEN-CP-003' THEN 340000.00
    WHEN 'GEN-RA-004' THEN 1110000.00
    WHEN 'GEN-CS-005' THEN 408000.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 70800.00
    WHEN 'GEN-GC-002' THEN 129800.00
    WHEN 'GEN-CP-003' THEN 19125.00
    WHEN 'GEN-RA-004' THEN 57350.00
    WHEN 'GEN-CS-005' THEN 34000.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 23600.00
    WHEN 'GEN-GC-002' THEN 59000.00
    WHEN 'GEN-CP-003' THEN 12750.00
    WHEN 'GEN-RA-004' THEN 16650.00
    WHEN 'GEN-CS-005' THEN 17000.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 11800.00
    WHEN 'GEN-GC-002' THEN 23600.00
    WHEN 'GEN-CP-003' THEN 6375.00
    WHEN 'GEN-RA-004' THEN 11100.00
    WHEN 'GEN-CS-005' THEN 10200.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 11800.00
    WHEN 'GEN-GC-002' THEN 23600.00
    WHEN 'GEN-CP-003' THEN 4250.00
    WHEN 'GEN-RA-004' THEN 7400.00
    WHEN 'GEN-CS-005' THEN 6800.00
  END,
  'Global Power Components Ltd',
  'RFQ-2024-11-456',
  'Recent supplier quote reflecting current market conditions'
FROM dim_item WHERE dataset = 'Dataset A';

-- Insert AI Recommendation References for Dataset A Items
INSERT INTO fact_cost_model_reference (reference_code, item_id, reference_type, reference_source, reference_date, quantity, unit_cost, total_cost, material_cost, labor_cost, logistics_cost, overhead_cost, vendor_name, notes)
SELECT
  'AI-REC-' || item_code,
  id,
  'AI Recommendation',
  'AI Cost Model',
  '2025-02-01'::timestamptz,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 10.0000
    WHEN 'GEN-GC-002' THEN 5.0000
    WHEN 'GEN-CP-003' THEN 8.0000
    WHEN 'GEN-RA-004' THEN 12.0000
    WHEN 'GEN-CS-005' THEN 6.0000
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 116000.00
    WHEN 'GEN-GC-002' THEN 232000.00
    WHEN 'GEN-CP-003' THEN 41800.00
    WHEN 'GEN-RA-004' THEN 91000.00
    WHEN 'GEN-CS-005' THEN 66800.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 1160000.00
    WHEN 'GEN-GC-002' THEN 1160000.00
    WHEN 'GEN-CP-003' THEN 334400.00
    WHEN 'GEN-RA-004' THEN 1092000.00
    WHEN 'GEN-CS-005' THEN 400800.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 69600.00
    WHEN 'GEN-GC-002' THEN 127600.00
    WHEN 'GEN-CP-003' THEN 18810.00
    WHEN 'GEN-RA-004' THEN 56420.00
    WHEN 'GEN-CS-005' THEN 33400.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 23200.00
    WHEN 'GEN-GC-002' THEN 58000.00
    WHEN 'GEN-CP-003' THEN 12540.00
    WHEN 'GEN-RA-004' THEN 16380.00
    WHEN 'GEN-CS-005' THEN 16700.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 11600.00
    WHEN 'GEN-GC-002' THEN 23200.00
    WHEN 'GEN-CP-003' THEN 6270.00
    WHEN 'GEN-RA-004' THEN 10920.00
    WHEN 'GEN-CS-005' THEN 10020.00
  END,
  CASE item_code
    WHEN 'GEN-TB-001' THEN 11600.00
    WHEN 'GEN-GC-002' THEN 23200.00
    WHEN 'GEN-CP-003' THEN 4180.00
    WHEN 'GEN-RA-004' THEN 7280.00
    WHEN 'GEN-CS-005' THEN 6680.00
  END,
  'AI Cost Model',
  'AI-optimized cost baseline using current market rates and reduced commodity prices'
FROM dim_item WHERE dataset = 'Dataset A';

-- Similar references for Dataset B
INSERT INTO fact_cost_model_reference (reference_code, item_id, reference_type, reference_source, reference_date, quantity, unit_cost, total_cost, material_cost, labor_cost, logistics_cost, overhead_cost, vendor_name, contract_number, notes)
SELECT
  'BOQ-2023-' || item_code,
  id,
  'Historical Contract',
  'Contract BOQ 2023',
  '2023-08-10'::timestamptz,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 500.0000
    WHEN 'ELEC-FC-002' THEN 2000.0000
    WHEN 'ELEC-DT-003' THEN 8.0000
    WHEN 'ELEC-CB-004' THEN 25.0000
    WHEN 'ELEC-SP-005' THEN 12.0000
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 850.00
    WHEN 'ELEC-FC-002' THEN 45.00
    WHEN 'ELEC-DT-003' THEN 185000.00
    WHEN 'ELEC-CB-004' THEN 12500.00
    WHEN 'ELEC-SP-005' THEN 95000.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 425000.00
    WHEN 'ELEC-FC-002' THEN 90000.00
    WHEN 'ELEC-DT-003' THEN 1480000.00
    WHEN 'ELEC-CB-004' THEN 312500.00
    WHEN 'ELEC-SP-005' THEN 1140000.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 425.00
    WHEN 'ELEC-FC-002' THEN 29.25
    WHEN 'ELEC-DT-003' THEN 107300.00
    WHEN 'ELEC-CB-004' THEN 6500.00
    WHEN 'ELEC-SP-005' THEN 45600.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 212.50
    WHEN 'ELEC-FC-002' THEN 6.75
    WHEN 'ELEC-DT-003' THEN 37000.00
    WHEN 'ELEC-CB-004' THEN 2750.00
    WHEN 'ELEC-SP-005' THEN 26600.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 127.50
    WHEN 'ELEC-FC-002' THEN 5.40
    WHEN 'ELEC-DT-003' THEN 25900.00
    WHEN 'ELEC-CB-004' THEN 2000.00
    WHEN 'ELEC-SP-005' THEN 13300.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 85.00
    WHEN 'ELEC-FC-002' THEN 3.60
    WHEN 'ELEC-DT-003' THEN 14800.00
    WHEN 'ELEC-CB-004' THEN 1250.00
    WHEN 'ELEC-SP-005' THEN 9500.00
  END,
  'PT Electrical Solutions Indonesia',
  'CTR-2023-ELEC-002',
  'Grid modernization project 2023'
FROM dim_item WHERE dataset = 'Dataset B';

-- RFI for Dataset B
INSERT INTO fact_cost_model_reference (reference_code, item_id, reference_type, reference_source, reference_date, quantity, unit_cost, total_cost, material_cost, labor_cost, logistics_cost, overhead_cost, vendor_name, contract_number, notes)
SELECT
  'RFI-2024-' || item_code,
  id,
  'Supplier RFI',
  'Vendor Quote 2024',
  '2024-12-05'::timestamptz,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 500.0000
    WHEN 'ELEC-FC-002' THEN 2000.0000
    WHEN 'ELEC-DT-003' THEN 8.0000
    WHEN 'ELEC-CB-004' THEN 25.0000
    WHEN 'ELEC-SP-005' THEN 12.0000
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 820.00
    WHEN 'ELEC-FC-002' THEN 43.50
    WHEN 'ELEC-DT-003' THEN 178000.00
    WHEN 'ELEC-CB-004' THEN 12000.00
    WHEN 'ELEC-SP-005' THEN 91500.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 410000.00
    WHEN 'ELEC-FC-002' THEN 87000.00
    WHEN 'ELEC-DT-003' THEN 1424000.00
    WHEN 'ELEC-CB-004' THEN 300000.00
    WHEN 'ELEC-SP-005' THEN 1098000.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 410.00
    WHEN 'ELEC-FC-002' THEN 28.28
    WHEN 'ELEC-DT-003' THEN 103240.00
    WHEN 'ELEC-CB-004' THEN 6240.00
    WHEN 'ELEC-SP-005' THEN 43920.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 205.00
    WHEN 'ELEC-FC-002' THEN 6.53
    WHEN 'ELEC-DT-003' THEN 35600.00
    WHEN 'ELEC-CB-004' THEN 2640.00
    WHEN 'ELEC-SP-005' THEN 25620.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 123.00
    WHEN 'ELEC-FC-002' THEN 5.22
    WHEN 'ELEC-DT-003' THEN 24920.00
    WHEN 'ELEC-CB-004' THEN 1920.00
    WHEN 'ELEC-SP-005' THEN 12810.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 82.00
    WHEN 'ELEC-FC-002' THEN 3.48
    WHEN 'ELEC-DT-003' THEN 14240.00
    WHEN 'ELEC-CB-004' THEN 1200.00
    WHEN 'ELEC-SP-005' THEN 9150.00
  END,
  'Smart Grid Technologies Asia',
  'RFQ-2024-12-789',
  'Updated quote with improved component sourcing'
FROM dim_item WHERE dataset = 'Dataset B';

-- AI Recommendation for Dataset B
INSERT INTO fact_cost_model_reference (reference_code, item_id, reference_type, reference_source, reference_date, quantity, unit_cost, total_cost, material_cost, labor_cost, logistics_cost, overhead_cost, vendor_name, notes)
SELECT
  'AI-REC-' || item_code,
  id,
  'AI Recommendation',
  'AI Cost Model',
  '2025-02-01'::timestamptz,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 500.0000
    WHEN 'ELEC-FC-002' THEN 2000.0000
    WHEN 'ELEC-DT-003' THEN 8.0000
    WHEN 'ELEC-CB-004' THEN 25.0000
    WHEN 'ELEC-SP-005' THEN 12.0000
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 805.00
    WHEN 'ELEC-FC-002' THEN 42.80
    WHEN 'ELEC-DT-003' THEN 175000.00
    WHEN 'ELEC-CB-004' THEN 11800.00
    WHEN 'ELEC-SP-005' THEN 90000.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 402500.00
    WHEN 'ELEC-FC-002' THEN 85600.00
    WHEN 'ELEC-DT-003' THEN 1400000.00
    WHEN 'ELEC-CB-004' THEN 295000.00
    WHEN 'ELEC-SP-005' THEN 1080000.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 402.50
    WHEN 'ELEC-FC-002' THEN 27.82
    WHEN 'ELEC-DT-003' THEN 101500.00
    WHEN 'ELEC-CB-004' THEN 6136.00
    WHEN 'ELEC-SP-005' THEN 43200.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 201.25
    WHEN 'ELEC-FC-002' THEN 6.42
    WHEN 'ELEC-DT-003' THEN 35000.00
    WHEN 'ELEC-CB-004' THEN 2596.00
    WHEN 'ELEC-SP-005' THEN 25200.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 120.75
    WHEN 'ELEC-FC-002' THEN 5.14
    WHEN 'ELEC-DT-003' THEN 24500.00
    WHEN 'ELEC-CB-004' THEN 1888.00
    WHEN 'ELEC-SP-005' THEN 12600.00
  END,
  CASE item_code
    WHEN 'ELEC-SM-001' THEN 80.50
    WHEN 'ELEC-FC-002' THEN 3.42
    WHEN 'ELEC-DT-003' THEN 14000.00
    WHEN 'ELEC-CB-004' THEN 1180.00
    WHEN 'ELEC-SP-005' THEN 9000.00
  END,
  'AI Cost Model',
  'AI-optimized baseline incorporating favorable forex and commodity rates'
FROM dim_item WHERE dataset = 'Dataset B';

-- Insert Cost Baselines for all items
INSERT INTO fact_cost_baseline (item_id, baseline_name, baseline_type, reference_source, quantity, base_unit_cost, material_cost, labor_cost, logistics_cost, overhead_cost, total_baseline_cost, calculation_formula, applied_variables, effective_date, is_active, created_by)
SELECT
  i.id,
  'FY2025 Q1 Baseline - ' || i.item_name,
  'AI Recommended',
  'AI Cost Model + Current Market Variables',
  r.quantity,
  r.unit_cost,
  r.material_cost,
  r.labor_cost,
  r.logistics_cost,
  r.overhead_cost,
  r.total_cost,
  'Base Cost × (Steel Index × 0.6) × (Labor Index × 0.2) × (Logistics Index × 0.1) × (Forex Adjustment)',
  '{"steel_index": 890, "copper_index": 8750, "labor_index": 118.5, "logistics_index": 112.3, "forex_usd_idr": 15000}'::jsonb,
  '2025-02-01'::timestamptz,
  true,
  'AI System'
FROM dim_item i
JOIN fact_cost_model_reference r ON r.item_id = i.id AND r.reference_type = 'AI Recommendation';

-- Generate 12-month forecasts for all items
INSERT INTO fact_cost_forecast (item_id, baseline_id, forecast_month, forecasted_unit_cost, forecasted_total_cost, confidence_level, scenario_type, material_cost_forecast, labor_cost_forecast, logistics_cost_forecast, overhead_cost_forecast, applied_assumptions)
SELECT
  b.item_id,
  b.id,
  date_trunc('month', '2025-03-01'::timestamptz + (month_offset || ' months')::interval),
  b.base_unit_cost * (1 + (month_offset * 0.008)),
  b.total_baseline_cost * (1 + (month_offset * 0.008)),
  CASE
    WHEN month_offset <= 3 THEN 'High'
    WHEN month_offset <= 6 THEN 'Medium'
    ELSE 'Low'
  END,
  'baseline',
  b.material_cost * (1 + (month_offset * 0.007)),
  b.labor_cost * (1 + (month_offset * 0.012)),
  b.logistics_cost * (1 + (month_offset * 0.005)),
  b.overhead_cost * (1 + (month_offset * 0.009)),
  jsonb_build_object(
    'steel_trend', 'gradual_increase',
    'labor_trend', 'moderate_increase',
    'forex_trend', 'stable',
    'inflation_factor', 1.032
  )
FROM fact_cost_baseline b
CROSS JOIN generate_series(0, 11) AS month_offset
WHERE b.is_active = true;

-- This continues with AI insights in the next part...
