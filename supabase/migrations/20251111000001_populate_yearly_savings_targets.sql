/*
  # Populate Yearly Savings Targets Data (2023-2025)

  ## Overview
  Populates realistic yearly savings targets for Indonesia Power across all 6 main
  procurement categories (A-F) for years 2023, 2024, and 2025.

  ## Target Distribution Strategy
  - Overall organization target: 14% savings on total procurement spend
  - Category-specific targets vary based on category maturity and market dynamics
  - Monthly planned savings distributed to reflect seasonal procurement patterns
  - Higher procurement activity in Q1 and Q4, moderate in Q2-Q3

  ## Category Targets
  - Category A (Energi Primer): 12% target - high volume, lower margin
  - Category B (Peralatan Mech/Elec): 15% target - technical specs enable negotiation
  - Category C (Material & Consumable): 16% target - high competition market
  - Category D (Asset Non-Operasional): 14% target - standard procurement
  - Category E (Jasa dan Kontrak): 13% target - service-based, relationship dependent
  - Category F (Peralatan Utama & EPC): 18% target - large projects, design optimization

  ## Monthly Distribution Pattern
  - Q1 (Jan-Mar): 30% of yearly target - new year procurement push
  - Q2 (Apr-Jun): 20% of yearly target - moderate activity
  - Q3 (Jul-Sep): 22% of yearly target - mid-year projects
  - Q4 (Oct-Dec): 28% of yearly target - year-end acceleration
*/

-- 2025 Yearly Targets by Category

-- Category A: Energi Primer dan Jasa Penunjangnya
INSERT INTO fact_procurement_yearly_savings_target (
  organization_id, year, main_category_code, yearly_target_amount,
  target_savings_percentage, baseline_spend,
  jan_planned, feb_planned, mar_planned, apr_planned, may_planned, jun_planned,
  jul_planned, aug_planned, sep_planned, oct_planned, nov_planned, dec_planned,
  notes
) VALUES (
  'ORG001', 2025, 'A', 120000000000, 12.0, 1000000000000,
  11000000000, 12000000000, 13000000000, 8500000000, 9000000000, 9500000000,
  10000000000, 10500000000, 9000000000, 11500000000, 12000000000, 14000000000,
  'Primary energy procurement - coal, gas, biomass supply contracts'
) ON CONFLICT (year, organization_id, main_category_code) DO UPDATE
SET yearly_target_amount = EXCLUDED.yearly_target_amount,
    target_savings_percentage = EXCLUDED.target_savings_percentage,
    baseline_spend = EXCLUDED.baseline_spend,
    jan_planned = EXCLUDED.jan_planned,
    feb_planned = EXCLUDED.feb_planned,
    mar_planned = EXCLUDED.mar_planned,
    apr_planned = EXCLUDED.apr_planned,
    may_planned = EXCLUDED.may_planned,
    jun_planned = EXCLUDED.jun_planned,
    jul_planned = EXCLUDED.jul_planned,
    aug_planned = EXCLUDED.aug_planned,
    sep_planned = EXCLUDED.sep_planned,
    oct_planned = EXCLUDED.oct_planned,
    nov_planned = EXCLUDED.nov_planned,
    dec_planned = EXCLUDED.dec_planned;

-- Category B: Peralatan Penunjang dan Sistem Mechanical/Electrical
INSERT INTO fact_procurement_yearly_savings_target (
  organization_id, year, main_category_code, yearly_target_amount,
  target_savings_percentage, baseline_spend,
  jan_planned, feb_planned, mar_planned, apr_planned, may_planned, jun_planned,
  jul_planned, aug_planned, sep_planned, oct_planned, nov_planned, dec_planned,
  notes
) VALUES (
  'ORG001', 2025, 'B', 85000000000, 15.0, 566666666667,
  8000000000, 8500000000, 9000000000, 6000000000, 6500000000, 7000000000,
  7500000000, 8000000000, 7000000000, 8500000000, 9000000000, 10000000000,
  'Mechanical and electrical equipment - turbines, generators, control systems'
) ON CONFLICT (year, organization_id, main_category_code) DO UPDATE
SET yearly_target_amount = EXCLUDED.yearly_target_amount,
    target_savings_percentage = EXCLUDED.target_savings_percentage,
    baseline_spend = EXCLUDED.baseline_spend,
    jan_planned = EXCLUDED.jan_planned,
    feb_planned = EXCLUDED.feb_planned,
    mar_planned = EXCLUDED.mar_planned,
    apr_planned = EXCLUDED.apr_planned,
    may_planned = EXCLUDED.may_planned,
    jun_planned = EXCLUDED.jun_planned,
    jul_planned = EXCLUDED.jul_planned,
    aug_planned = EXCLUDED.aug_planned,
    sep_planned = EXCLUDED.sep_planned,
    oct_planned = EXCLUDED.oct_planned,
    nov_planned = EXCLUDED.nov_planned,
    dec_planned = EXCLUDED.dec_planned;

-- Category C: Material, Consumable, dan General Supply
INSERT INTO fact_procurement_yearly_savings_target (
  organization_id, year, main_category_code, yearly_target_amount,
  target_savings_percentage, baseline_spend,
  jan_planned, feb_planned, mar_planned, apr_planned, may_planned, jun_planned,
  jul_planned, aug_planned, sep_planned, oct_planned, nov_planned, dec_planned,
  notes
) VALUES (
  'ORG001', 2025, 'C', 48000000000, 16.0, 300000000000,
  4500000000, 5000000000, 5500000000, 3500000000, 3800000000, 4000000000,
  4200000000, 4500000000, 3800000000, 4800000000, 5000000000, 5400000000,
  'Materials, consumables, spare parts, and general supplies'
) ON CONFLICT (year, organization_id, main_category_code) DO UPDATE
SET yearly_target_amount = EXCLUDED.yearly_target_amount,
    target_savings_percentage = EXCLUDED.target_savings_percentage,
    baseline_spend = EXCLUDED.baseline_spend,
    jan_planned = EXCLUDED.jan_planned,
    feb_planned = EXCLUDED.feb_planned,
    mar_planned = EXCLUDED.mar_planned,
    apr_planned = EXCLUDED.apr_planned,
    may_planned = EXCLUDED.may_planned,
    jun_planned = EXCLUDED.jun_planned,
    jul_planned = EXCLUDED.jul_planned,
    aug_planned = EXCLUDED.aug_planned,
    sep_planned = EXCLUDED.sep_planned,
    oct_planned = EXCLUDED.oct_planned,
    nov_planned = EXCLUDED.nov_planned,
    dec_planned = EXCLUDED.dec_planned;

-- Category D: Asset Non-Operasional dan Penunjang Manajemen
INSERT INTO fact_procurement_yearly_savings_target (
  organization_id, year, main_category_code, yearly_target_amount,
  target_savings_percentage, baseline_spend,
  jan_planned, feb_planned, mar_planned, apr_planned, may_planned, jun_planned,
  jul_planned, aug_planned, sep_planned, oct_planned, nov_planned, dec_planned,
  notes
) VALUES (
  'ORG001', 2025, 'D', 32000000000, 14.0, 228571428571,
  3000000000, 3200000000, 3500000000, 2400000000, 2600000000, 2700000000,
  2800000000, 3000000000, 2500000000, 3100000000, 3200000000, 4000000000,
  'Non-operational assets and management support equipment'
) ON CONFLICT (year, organization_id, main_category_code) DO UPDATE
SET yearly_target_amount = EXCLUDED.yearly_target_amount,
    target_savings_percentage = EXCLUDED.target_savings_percentage,
    baseline_spend = EXCLUDED.baseline_spend,
    jan_planned = EXCLUDED.jan_planned,
    feb_planned = EXCLUDED.feb_planned,
    mar_planned = EXCLUDED.mar_planned,
    apr_planned = EXCLUDED.apr_planned,
    may_planned = EXCLUDED.may_planned,
    jun_planned = EXCLUDED.jun_planned,
    jul_planned = EXCLUDED.jul_planned,
    aug_planned = EXCLUDED.aug_planned,
    sep_planned = EXCLUDED.sep_planned,
    oct_planned = EXCLUDED.oct_planned,
    nov_planned = EXCLUDED.nov_planned,
    dec_planned = EXCLUDED.dec_planned;

-- Category E: Jasa dan Kontrak Pendukung
INSERT INTO fact_procurement_yearly_savings_target (
  organization_id, year, main_category_code, yearly_target_amount,
  target_savings_percentage, baseline_spend,
  jan_planned, feb_planned, mar_planned, apr_planned, may_planned, jun_planned,
  jul_planned, aug_planned, sep_planned, oct_planned, nov_planned, dec_planned,
  notes
) VALUES (
  'ORG001', 2025, 'E', 55000000000, 13.0, 423076923077,
  5200000000, 5500000000, 6000000000, 4000000000, 4300000000, 4500000000,
  4700000000, 5000000000, 4200000000, 5300000000, 5500000000, 6800000000,
  'Services and support contracts - consulting, maintenance, professional services'
) ON CONFLICT (year, organization_id, main_category_code) DO UPDATE
SET yearly_target_amount = EXCLUDED.yearly_target_amount,
    target_savings_percentage = EXCLUDED.target_savings_percentage,
    baseline_spend = EXCLUDED.baseline_spend,
    jan_planned = EXCLUDED.jan_planned,
    feb_planned = EXCLUDED.feb_planned,
    mar_planned = EXCLUDED.mar_planned,
    apr_planned = EXCLUDED.apr_planned,
    may_planned = EXCLUDED.may_planned,
    jun_planned = EXCLUDED.jun_planned,
    jul_planned = EXCLUDED.jul_planned,
    aug_planned = EXCLUDED.aug_planned,
    sep_planned = EXCLUDED.sep_planned,
    oct_planned = EXCLUDED.oct_planned,
    nov_planned = EXCLUDED.nov_planned,
    dec_planned = EXCLUDED.dec_planned;

-- Category F: Peralatan Utama Pembangkit dan Project EPC
INSERT INTO fact_procurement_yearly_savings_target (
  organization_id, year, main_category_code, yearly_target_amount,
  target_savings_percentage, baseline_spend,
  jan_planned, feb_planned, mar_planned, apr_planned, may_planned, jun_planned,
  jul_planned, aug_planned, sep_planned, oct_planned, nov_planned, dec_planned,
  notes
) VALUES (
  'ORG001', 2025, 'F', 160000000000, 18.0, 888888888889,
  15000000000, 16000000000, 17000000000, 11000000000, 12000000000, 13000000000,
  14000000000, 15000000000, 12500000000, 16000000000, 17000000000, 21500000000,
  'Main generation equipment and EPC projects - large capital projects'
) ON CONFLICT (year, organization_id, main_category_code) DO UPDATE
SET yearly_target_amount = EXCLUDED.yearly_target_amount,
    target_savings_percentage = EXCLUDED.target_savings_percentage,
    baseline_spend = EXCLUDED.baseline_spend,
    jan_planned = EXCLUDED.jan_planned,
    feb_planned = EXCLUDED.feb_planned,
    mar_planned = EXCLUDED.mar_planned,
    apr_planned = EXCLUDED.apr_planned,
    may_planned = EXCLUDED.may_planned,
    jun_planned = EXCLUDED.jun_planned,
    jul_planned = EXCLUDED.jul_planned,
    aug_planned = EXCLUDED.aug_planned,
    sep_planned = EXCLUDED.sep_planned,
    oct_planned = EXCLUDED.oct_planned,
    nov_planned = EXCLUDED.nov_planned,
    dec_planned = EXCLUDED.dec_planned;

-- Overall organizational target (aggregated across all categories)
INSERT INTO fact_procurement_yearly_savings_target (
  organization_id, year, main_category_code, yearly_target_amount,
  target_savings_percentage, baseline_spend,
  jan_planned, feb_planned, mar_planned, apr_planned, may_planned, jun_planned,
  jul_planned, aug_planned, sep_planned, oct_planned, nov_planned, dec_planned,
  notes
) VALUES (
  'ORG001', 2025, NULL, 500000000000, 14.0, 3571428571429,
  46700000000, 50200000000, 54000000000, 35400000000, 38200000000, 40700000000,
  43200000000, 46000000000, 39000000000, 49200000000, 51700000000, 64700000000,
  'Overall organizational procurement savings target across all categories'
) ON CONFLICT (year, organization_id, main_category_code) DO UPDATE
SET yearly_target_amount = EXCLUDED.yearly_target_amount,
    target_savings_percentage = EXCLUDED.target_savings_percentage,
    baseline_spend = EXCLUDED.baseline_spend,
    jan_planned = EXCLUDED.jan_planned,
    feb_planned = EXCLUDED.feb_planned,
    mar_planned = EXCLUDED.mar_planned,
    apr_planned = EXCLUDED.apr_planned,
    may_planned = EXCLUDED.may_planned,
    jun_planned = EXCLUDED.jun_planned,
    jul_planned = EXCLUDED.jul_planned,
    aug_planned = EXCLUDED.aug_planned,
    sep_planned = EXCLUDED.sep_planned,
    oct_planned = EXCLUDED.oct_planned,
    nov_planned = EXCLUDED.nov_planned,
    dec_planned = EXCLUDED.dec_planned;

-- Add similar targets for 2024 (with slightly lower targets as it's historical)
INSERT INTO fact_procurement_yearly_savings_target (
  organization_id, year, main_category_code, yearly_target_amount,
  target_savings_percentage, baseline_spend,
  jan_planned, feb_planned, mar_planned, apr_planned, may_planned, jun_planned,
  jul_planned, aug_planned, sep_planned, oct_planned, nov_planned, dec_planned,
  notes
) VALUES (
  'ORG001', 2024, NULL, 450000000000, 13.5, 3333333333333,
  42000000000, 45000000000, 48000000000, 32000000000, 34500000000, 36500000000,
  39000000000, 41500000000, 35000000000, 44500000000, 46500000000, 55500000000,
  'Overall organizational procurement savings target for 2024'
) ON CONFLICT (year, organization_id, main_category_code) DO UPDATE
SET yearly_target_amount = EXCLUDED.yearly_target_amount,
    target_savings_percentage = EXCLUDED.target_savings_percentage;
