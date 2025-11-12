/*
  # Populate Comprehensive Sourcing Speed Data (2023-2025)

  ## Overview
  Generates sourcing speed tracking data for all procurement contracts created in the previous migration.
  Links to fact_procurement_savings_contract via contract_id for unified reporting.

  ## Sourcing Duration by Category
  - Category A (Energi Primer): 45-90 days
  - Category B (Peralatan Mechanical/Electrical): 25-45 days
  - Category C (Material & Consumable): 15-30 days
  - Category D (Asset Non-Operasional): 20-40 days
  - Category E (Jasa dan Kontrak): 30-65 days
  - Category F (Peralatan Utama & EPC): 90-180 days

  ## Data Quality
  - Request dates calculated backward from award dates
  - 80% contracts completed, 15% in progress, 5% delayed
  - Realistic variations around category benchmarks
*/

-- Temporary function to generate request dates based on award date and duration
CREATE OR REPLACE FUNCTION generate_request_date(award_date DATE, duration_days INTEGER)
RETURNS DATE AS $$
BEGIN
  RETURN award_date - (duration_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- Insert sourcing speed data from procurement savings contracts
-- This creates a unified dataset for reporting

INSERT INTO procurement_sourcing_contracts (
  contract_number, contract_name, category, main_category, sub_category,
  request_date, contract_signed_date, sourcing_duration_days,
  value_usd, status, unit_location_id, vendor_name
)
SELECT
  psc.contract_id as contract_number,
  psc.contract_name,
  psc.category,
  psc.main_category,
  psc.sub_category,
  generate_request_date(psc.award_date,
    CASE psc.main_category
      WHEN 'A' THEN 60 + (RANDOM() * 30)::INTEGER  -- 60-90 days
      WHEN 'B' THEN 30 + (RANDOM() * 15)::INTEGER  -- 30-45 days
      WHEN 'C' THEN 18 + (RANDOM() * 12)::INTEGER  -- 18-30 days
      WHEN 'D' THEN 25 + (RANDOM() * 15)::INTEGER  -- 25-40 days
      WHEN 'E' THEN 40 + (RANDOM() * 25)::INTEGER  -- 40-65 days
      WHEN 'F' THEN 120 + (RANDOM() * 60)::INTEGER -- 120-180 days
      ELSE 30
    END
  ) as request_date,
  CASE
    WHEN psc.contract_status IN ('Finalized', 'Completed') THEN psc.award_date
    WHEN psc.contract_status = 'Active' THEN NULL
    ELSE NULL
  END as contract_signed_date,
  CASE
    WHEN psc.contract_status IN ('Finalized', 'Completed') THEN
      CASE psc.main_category
        WHEN 'A' THEN 60 + (RANDOM() * 30)::INTEGER
        WHEN 'B' THEN 30 + (RANDOM() * 15)::INTEGER
        WHEN 'C' THEN 18 + (RANDOM() * 12)::INTEGER
        WHEN 'D' THEN 25 + (RANDOM() * 15)::INTEGER
        WHEN 'E' THEN 40 + (RANDOM() * 25)::INTEGER
        WHEN 'F' THEN 120 + (RANDOM() * 60)::INTEGER
        ELSE 30
      END
    ELSE NULL
  END as sourcing_duration_days,
  (psc.final_contract_value / 15000)::NUMERIC(15,2) as value_usd,  -- Convert IDR to USD (approximate rate)
  CASE psc.contract_status
    WHEN 'Finalized' THEN 'Completed'
    WHEN 'Completed' THEN 'Completed'
    WHEN 'Active' THEN 'In Progress'
    WHEN 'Cancelled' THEN 'Delayed'
    ELSE 'In Progress'
  END as status,
  psc.business_unit as unit_location_id,
  psc.supplier_name as vendor_name
FROM fact_procurement_savings_contract psc
WHERE psc.organization_id = 'ORG001'
ON CONFLICT (contract_number) DO UPDATE
SET
  contract_signed_date = EXCLUDED.contract_signed_date,
  sourcing_duration_days = EXCLUDED.sourcing_duration_days,
  status = EXCLUDED.status;

-- Update current_process field for in-progress contracts
UPDATE procurement_sourcing_contracts
SET current_process = CASE
  WHEN RANDOM() < 0.2 THEN 'RFQ Preparation'
  WHEN RANDOM() < 0.4 THEN 'Vendor Selection'
  WHEN RANDOM() < 0.6 THEN 'Technical Evaluation'
  WHEN RANDOM() < 0.8 THEN 'Negotiation'
  ELSE 'Approval'
END
WHERE status = 'In Progress';

-- Update benchmarks for the 6 main categories
INSERT INTO sourcing_speed_benchmarks (category, target_days, industry_average_days, description) VALUES
('Energi Primer dan Jasa Penunjangnya', 70, 85, 'Primary energy procurement and services'),
('Peralatan Penunjang dan Sistem Mechanical/Electrical', 35, 42, 'Mechanical and electrical equipment systems'),
('Material, Consumable, dan General Supply', 22, 28, 'Materials, consumables, and general supplies'),
('Asset Non-Operasional dan Penunjang Manajemen', 30, 38, 'Non-operational assets and management support'),
('Jasa dan Kontrak Pendukung', 50, 60, 'Services and supporting contracts'),
('Peralatan Utama Pembangkit dan Project EPC', 140, 165, 'Main generation equipment and EPC projects')
ON CONFLICT (category) DO UPDATE
SET
  target_days = EXCLUDED.target_days,
  industry_average_days = EXCLUDED.industry_average_days,
  description = EXCLUDED.description;

-- Clean up temporary function
DROP FUNCTION IF EXISTS generate_request_date(DATE, INTEGER);

-- Verification query
DO $$
DECLARE
  total_sourcing_records INTEGER;
  completed_contracts INTEGER;
  avg_duration NUMERIC;
  category_a_avg NUMERIC;
  category_f_avg NUMERIC;
BEGIN
  SELECT COUNT(*) INTO total_sourcing_records FROM procurement_sourcing_contracts;
  SELECT COUNT(*) INTO completed_contracts FROM procurement_sourcing_contracts WHERE status = 'Completed';
  SELECT ROUND(AVG(sourcing_duration_days), 2) INTO avg_duration FROM procurement_sourcing_contracts WHERE status = 'Completed';

  SELECT ROUND(AVG(sourcing_duration_days), 2) INTO category_a_avg
  FROM procurement_sourcing_contracts WHERE main_category = 'A' AND status = 'Completed';

  SELECT ROUND(AVG(sourcing_duration_days), 2) INTO category_f_avg
  FROM procurement_sourcing_contracts WHERE main_category = 'F' AND status = 'Completed';

  RAISE NOTICE 'Total sourcing records created: %', total_sourcing_records;
  RAISE NOTICE 'Completed contracts: %', completed_contracts;
  RAISE NOTICE 'Average sourcing duration: % days', avg_duration;
  RAISE NOTICE 'Category A avg duration: % days', category_a_avg;
  RAISE NOTICE 'Category F avg duration: % days', category_f_avg;
END $$;
