/*
  # Add Category A Data for Procurement Metrics

  ## Overview
  Adds comprehensive mock data for Category A (Energi Primer dan Jasa Penunjangnya) across:
  1. Procurement Savings Contracts
  2. Procurement Sourcing Speed Contracts

  ## Category A: Energi Primer dan Jasa Penunjangnya
  Primary energy and supporting services including:
  - Coal supply contracts
  - Natural gas supply
  - Fuel oil procurement
  - Energy logistics and transportation services
  - Fuel quality testing services
  - Fuel storage and handling services

  ## Data Inserted
  
  ### Procurement Savings (10 contracts)
  - Total savings: ~640 Billion IDR
  - Average savings percentage: ~15.5%
  - Mix of coal, gas, fuel oil, and supporting services

  ### Sourcing Speed (12 contracts)
  - Various energy procurement contracts
  - Supply chain service agreements
  - Logistics and transportation contracts
*/

-- Insert Category A data into Procurement Savings
INSERT INTO fact_procurement_savings_contract (
  contract_id, contract_name, supplier_name, category, business_unit,
  award_date, owner_estimate, final_contract_value,
  contract_status, contract_duration_months, notes,
  organization_id, main_category, sub_category, main_category_code, subcategory_code, category_id
) VALUES
  -- Coal Supply Contracts
  ('PSC-2025-A001', 'Coal Supply Agreement 2025-2027', 'PT Bukit Asam Tbk', 'EPC Projects', 'Coal Power Generation',
   '2025-02-15', 850000000000, 697500000000, 'Finalized', 24,
   'Long-term agreement with volume commitment discount', 'ORG001',
   'A', 'Batubara, Gas Alam, Minyak Bahan Bakar', 'A', 'A01',
   '6a6c3bd4-5897-4a64-b522-d957a04f5075'),

  ('PSC-2025-A002', 'Low-Sulfur Coal Premium Supply', 'PT Adaro Energy Indonesia', 'EPC Projects', 'Coal Power Generation',
   '2025-03-10', 620000000000, 527000000000, 'Finalized', 18,
   'Premium quality coal with sulfur content < 0.7%', 'ORG001',
   'A', 'Batubara, Gas Alam, Minyak Bahan Bakar', 'A', 'A01',
   '6a6c3bd4-5897-4a64-b522-d957a04f5075'),

  ('PSC-2025-A003', 'Coal Transportation and Logistics', 'PT Indo Logistics', 'Professional Services', 'Supply Chain',
   '2025-04-05', 280000000000, 238000000000, 'Finalized', 24,
   'Integrated rail and barge transportation', 'ORG001',
   'A', 'Jasa Penunjang Energi Primer', 'A', 'A02',
   '6a6c3bd4-5897-4a64-b522-d957a04f5075'),

  -- Natural Gas Contracts
  ('PSC-2025-A004', 'Natural Gas Supply Agreement', 'PT Pertamina Gas', 'EPC Projects', 'Gas Power Generation',
   '2025-05-12', 1200000000000, 1032000000000, 'Finalized', 36,
   'Multi-year gas supply with price indexation', 'ORG001',
   'A', 'Batubara, Gas Alam, Minyak Bahan Bakar', 'A', 'A01',
   '6a6c3bd4-5897-4a64-b522-d957a04f5075'),

  ('PSC-2025-A005', 'LNG Terminal Services', 'PT Pelabuhan Indonesia', 'Professional Services', 'Gas Power Generation',
   '2025-06-20', 180000000000, 151200000000, 'Finalized', 36,
   'Dedicated berth and storage facility access', 'ORG001',
   'A', 'Jasa Penunjang Energi Primer', 'A', 'A02',
   '6a6c3bd4-5897-4a64-b522-d957a04f5075'),

  -- Fuel Oil and Diesel
  ('PSC-2025-A006', 'Heavy Fuel Oil Supply', 'PT Pertamina Patra Niaga', 'MRO', 'Backup Generation',
   '2025-07-08', 420000000000, 352800000000, 'Finalized', 12,
   'Backup fuel for peaking units', 'ORG001',
   'A', 'Batubara, Gas Alam, Minyak Bahan Bakar', 'A', 'A01',
   '6a6c3bd4-5897-4a64-b522-d957a04f5075'),

  ('PSC-2025-A007', 'Marine Diesel Oil for Mobile Gen-Sets', 'PT AKR Corporindo', 'MRO', 'Emergency Power',
   '2025-08-15', 95000000000, 80750000000, 'Finalized', 12,
   'Emergency generator fuel stockpile', 'ORG001',
   'A', 'Batubara, Gas Alam, Minyak Bahan Bakar', 'A', 'A01',
   '6a6c3bd4-5897-4a64-b522-d957a04f5075'),

  -- Supporting Services
  ('PSC-2025-A008', 'Fuel Quality Testing Services', 'PT Sucofindo', 'Professional Services', 'Quality Control',
   '2025-09-10', 45000000000, 39150000000, 'Finalized', 24,
   'Comprehensive fuel analysis and certification', 'ORG001',
   'A', 'Jasa Penunjang Energi Primer', 'A', 'A02',
   '6a6c3bd4-5897-4a64-b522-d957a04f5075'),

  ('PSC-2025-A009', 'Fuel Storage and Handling', 'PT Patra Jasa', 'Facility Management', 'Fuel Management',
   '2025-10-18', 320000000000, 275200000000, 'Finalized', 36,
   'Integrated fuel depot management', 'ORG001',
   'A', 'Jasa Penunjang Energi Primer', 'A', 'A02',
   '6a6c3bd4-5897-4a64-b522-d957a04f5075'),

  ('PSC-2025-A010', 'Coal Stockyard Automation System', 'PT Mining Automation Indonesia', 'IT & Technology', 'Operations',
   '2025-11-25', 150000000000, 126000000000, 'Finalized', 18,
   'Automated inventory management for coal storage', 'ORG001',
   'A', 'Jasa Penunjang Energi Primer', 'A', 'A02',
   '6a6c3bd4-5897-4a64-b522-d957a04f5075');

-- Insert Category A data into Procurement Sourcing Speed
INSERT INTO procurement_sourcing_contracts (
  contract_number, contract_name, category, request_date, contract_signed_date,
  sourcing_duration_days, value_usd, status, unit_location_id, vendor_name,
  main_category, sub_category, main_category_code, subcategory_code
) VALUES
  -- Coal Procurement Contracts
  ('SRC-A-2025-001', 'Coal Supply Agreement Q1 2025', 'EPC Projects', '2024-11-01', '2025-02-15', 106,
   62500000, 'Completed', 'PLTU-JAVA-01', 'PT Bukit Asam Tbk',
   'A', 'Batubara, Gas Alam, Minyak Bahan Bakar', 'A', 'A01'),

  ('SRC-A-2025-002', 'Low-Sulfur Coal Premium Supply', 'EPC Projects', '2024-12-10', '2025-03-10', 90,
   46000000, 'Completed', 'PLTU-JAVA-02', 'PT Adaro Energy Indonesia',
   'A', 'Batubara, Gas Alam, Minyak Bahan Bakar', 'A', 'A01'),

  ('SRC-A-2025-003', 'Emergency Coal Supply', 'Emergency Procurement', '2025-01-05', '2025-02-20', 46,
   12000000, 'Completed', 'PLTU-SUMATRA-01', 'PT Indo Tambang',
   'A', 'Batubara, Gas Alam, Minyak Bahan Bakar', 'A', 'A01'),

  -- Natural Gas Contracts
  ('SRC-A-2025-004', 'Natural Gas Supply Agreement', 'EPC Projects', '2024-11-15', '2025-05-12', 178,
   89000000, 'Completed', 'PLTG-JAVA-01', 'PT Pertamina Gas',
   'A', 'Batubara, Gas Alam, Minyak Bahan Bakar', 'A', 'A01'),

  ('SRC-A-2025-005', 'LNG Import Contract', 'EPC Projects', '2025-02-01', '2025-07-15', 164,
   95000000, 'Completed', 'PLTG-SUMATRA-02', 'Shell Indonesia',
   'A', 'Batubara, Gas Alam, Minyak Bahan Bakar', 'A', 'A01'),

  -- Fuel Oil Contracts
  ('SRC-A-2025-006', 'Heavy Fuel Oil Supply', 'MRO', '2025-04-10', '2025-07-08', 89,
   31000000, 'Completed', 'PLTD-SULAWESI-01', 'PT Pertamina Patra Niaga',
   'A', 'Batubara, Gas Alam, Minyak Bahan Bakar', 'A', 'A01'),

  ('SRC-A-2025-007', 'Marine Diesel Oil Supply', 'MRO', '2025-05-20', '2025-08-15', 87,
   7100000, 'Completed', 'PLTD-KALBAR-01', 'PT AKR Corporindo',
   'A', 'Batubara, Gas Alam, Minyak Bahan Bakar', 'A', 'A01'),

  -- Supporting Services
  ('SRC-A-2025-008', 'Coal Transportation Services', 'Consulting', '2025-01-15', '2025-04-05', 80,
   21000000, 'Completed', 'PLTU-JAVA-01', 'PT Indo Logistics',
   'A', 'Jasa Penunjang Energi Primer', 'A', 'A02'),

  ('SRC-A-2025-009', 'LNG Terminal Services', 'Consulting', '2025-02-10', '2025-06-20', 130,
   13400000, 'Completed', 'PLTG-JAVA-01', 'PT Pelabuhan Indonesia',
   'A', 'Jasa Penunjang Energi Primer', 'A', 'A02'),

  ('SRC-A-2025-010', 'Fuel Quality Testing Services', 'Consulting', '2025-06-01', '2025-09-10', 101,
   3360000, 'Completed', 'ALL-UNITS', 'PT Sucofindo',
   'A', 'Jasa Penunjang Energi Primer', 'A', 'A02'),

  ('SRC-A-2025-011', 'Fuel Storage Management', 'Consulting', '2025-05-15', '2025-10-18', 156,
   23800000, 'Completed', 'FUEL-DEPOT-01', 'PT Patra Jasa',
   'A', 'Jasa Penunjang Energi Primer', 'A', 'A02'),

  ('SRC-A-2025-012', 'Coal Stockyard Automation', 'Capital Equipment', '2025-08-01', '2025-11-25', 116,
   9500000, 'Completed', 'PLTU-JAVA-01', 'PT Mining Automation Indonesia',
   'A', 'Jasa Penunjang Energi Primer', 'A', 'A02');
