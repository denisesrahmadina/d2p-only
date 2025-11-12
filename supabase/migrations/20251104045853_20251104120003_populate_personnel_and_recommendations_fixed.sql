/*
  # Populate Personnel Assignments and Template Recommendations (Fixed)

  1. Template Recommendations
    - Link templates to sourcing events with confidence scores
    
  2. Sample Contract Workspaces
    - Active contract drafts for demonstration
    
  3. Personnel Assignments
    - Team assignments with expertise areas
    
  4. Legal Collaboration Comments
    - Sample comments and discussions
*/

-- Insert Template Recommendations
INSERT INTO ref_template_recommendation (sourcing_event_id, template_id, recommendation_reason, confidence_score, analysis_context, contract_type, estimated_value, recommended_clauses, is_selected) 
SELECT 
  'SE-2025-SOLAR-Q1',
  t.id,
  'Highly recommended for Q1 Solar Farm Expansion based on similar project scope, capacity requirements (100MW), and proven template structure. Template includes all necessary solar-specific clauses including IEC 61215 certification requirements.',
  0.95,
  '{"sourcingEventType":"Solar Farm Development","capacity":"100 MW","location":"East Java","projectPhase":"Phase 1 Expansion","similarityScore":0.95,"keyMatchFactors":["capacity match","solar technology","Indonesia location","utility-scale"]}'::jsonb,
  'Solar Panel Supply',
  'IDR 1,250,000,000,000',
  ARRAY['IEC 61215 Solar Panel Certification','Solar Panel Efficiency Guarantee','Indonesian Manufacturing Requirement','PLN Grid Code Compliance','Environmental Compliance'],
  true
FROM fact_contract_template t 
WHERE t.template_name = 'Solar Panel Supply Agreement - Standard Template'
LIMIT 1;

INSERT INTO ref_template_recommendation (sourcing_event_id, template_id, recommendation_reason, confidence_score, analysis_context, contract_type, estimated_value, recommended_clauses, is_selected)
SELECT 
  'SE-2025-WIND-OFFSHORE',
  t.id,
  'Recommended for Offshore Wind Tender 2025. Template specifically designed for offshore wind maintenance with 97% availability guarantee, marine environmental protection clauses, and GWO-certified technician requirements.',
  0.92,
  '{"sourcingEventType":"Offshore Wind O&M","capacity":"150 MW","location":"Nusa Tenggara","turbineType":"5MW offshore","similarityScore":0.92,"keyMatchFactors":["offshore wind","O&M services","availability guarantee","marine environment"]}'::jsonb,
  'Wind Turbine Maintenance',
  'IDR 375,000,000,000',
  ARRAY['Wind Turbine Availability Guarantee','IEC 61400 Wind Turbine Standards','Environmental Compliance','Local Workforce Development'],
  true
FROM fact_contract_template t 
WHERE t.template_name = 'Wind Turbine Maintenance SLA - Standard Template'
LIMIT 1;

INSERT INTO ref_template_recommendation (sourcing_event_id, template_id, recommendation_reason, confidence_score, analysis_context, contract_type, estimated_value, recommended_clauses, is_selected)
SELECT 
  'SE-2025-BESS-EXPANSION',
  t.id,
  'Optimal match for Battery Storage Initiative. Template covers LFP technology, 50MWh capacity with 2-hour discharge, comprehensive BMS requirements, and grid frequency response capabilities matching project specifications.',
  0.98,
  '{"sourcingEventType":"Battery Energy Storage","capacity":"50 MWh","power":"25 MW","technology":"LFP","application":"Grid stabilization","similarityScore":0.98,"keyMatchFactors":["capacity match","LFP technology","grid services","frequency response"]}'::jsonb,
  'Battery Storage',
  'IDR 625,000,000,000',
  ARRAY['Battery Storage Capacity Retention','PLN Grid Code Compliance','Reactive Power Capability','Safety Requirements','Indonesian Manufacturing Requirement'],
  true
FROM fact_contract_template t 
WHERE t.template_name = 'Battery Storage Procurement Terms - Standard Template'
LIMIT 1;

-- Create sample contract workspaces for active drafting
INSERT INTO fact_contract_workspace (contract_template_id, sourcing_event_id, current_content, workspace_status, active_editors)
SELECT 
  t.id,
  'SE-2025-SOLAR-Q1',
  '{"header":{"title":"Solar Panel Supply Agreement - Phase 2","contractNumber":"CNT-2025-SP-002","effectiveDate":"2025-03-01","expiryDate":"2026-03-01"},"parties":{"buyer":"PT Indonesia Power","supplier":"PT Surya Energy Indonesia","buyerAddress":"Jl. Jend. Gatot Subroto, Jakarta","supplierAddress":"Jl. Industri Raya, Bekasi"},"scopeOfWork":{"description":"Supply of 540Wp monocrystalline solar panels for Phase 2 expansion","totalCapacity":"50 MW DC","panelCount":"92,500 panels","deliveryLocation":"East Java Solar Farm Site"},"performanceGuarantee":{"powerOutput":"Min 80% after 25 years","annualDegradation":"Max 0.7% per year","testingStandard":"IEC 61853"},"pricing":{"totalValue":"IDR 625,000,000,000","pricePerPanel":"IDR 6,756,757"},"deliverySchedule":{"startDate":"2025-04-01","completionDate":"2025-10-01","monthlyDelivery":"8.3 MW per month","gridReadiness":"Aligned with PLN substation upgrade schedule"},"localContent":{"percentage":"42%","manufacturingLocation":"Bekasi, Indonesia","localEmployment":"78% Indonesian workforce"}}'::jsonb,
  'Active',
  '["Dimas Prastio","Intan Pratiwi","Jefferson Soesetyo"]'::jsonb
FROM fact_contract_template t 
WHERE t.template_name = 'Solar Panel Supply Agreement - Standard Template'
LIMIT 1;

INSERT INTO fact_contract_workspace (contract_template_id, sourcing_event_id, current_content, workspace_status, active_editors)
SELECT 
  t.id,
  'SE-2025-WIND-OFFSHORE',
  '{"header":{"title":"Wind Farm Maintenance SLA - Annual Renewal","contractNumber":"CNT-2025-WF-003","effectiveDate":"2025-04-01","expiryDate":"2030-03-31"},"parties":{"buyer":"PT Indonesia Power","supplier":"PT Angin Nusantara Services","buyerAddress":"Jl. Jend. Gatot Subroto, Jakarta","supplierAddress":"Jl. Pelabuhan Kupang, NTT"},"scopeOfWork":{"windFarmName":"Nusa Tenggara Offshore Wind Farm","capacity":"150 MW","turbineCount":"30 x 5MW turbines","location":"30km offshore Kupang"},"maintenanceScope":{"preventive":"Semi-annual per GE specifications","corrective":"24/7 emergency response","predictive":"Monthly SCADA analysis + quarterly vibration monitoring","bladeInspection":"Annual drone inspection + rope access every 2 years"},"performanceGuarantee":{"availability":"97.5% (improved from 97%)","responseTime":"On-site within 18 hours for offshore","spareParts":"Critical components at Kupang warehouse","warrantyCoverage":"Major components covered under OEM warranty"},"environmentalCompliance":{"marineProtection":"Monthly marine life monitoring reports","birdMigration":"Automated shutdown during peak migration (March-April, Sept-Oct)","oilSpill":"Spill response plan with certified contractor"}}'::jsonb,
  'Active',
  '["Jefferson Soesetyo","Intan Pratiwi","Bambang Sutrisno"]'::jsonb
FROM fact_contract_template t 
WHERE t.template_name = 'Wind Turbine Maintenance SLA - Standard Template'
LIMIT 1;

INSERT INTO fact_contract_workspace (contract_template_id, sourcing_event_id, current_content, workspace_status, locked_by, locked_at, active_editors)
SELECT 
  t.id,
  'SE-2025-BESS-EXPANSION',
  '{"header":{"title":"Battery Storage Expansion - Final Draft","contractNumber":"CNT-2025-BS-001","effectiveDate":"2025-05-01"},"parties":{"buyer":"PT Indonesia Power","supplier":"PT Energy Storage Solutions"},"technicalSpecs":{"capacity":"50 MWh","power":"25 MW","technology":"LFP (LiFePO4)","cycles":"6,000 full cycles @ 80% DoD","efficiency":"91% round-trip"},"gridIntegration":{"substationLocation":"Semarang Grid, Central Java","voltageLevel":"150 kV","frequencyResponse":"Primary frequency response <100ms","reactiveSupport":"±12.5 MVAr","gridCode":"Full PLN Grid Code 2023 compliance"},"safetyFeatures":{"fireSupression":"Novec 1230 gas suppression system","thermalManagement":"Liquid cooling with 2N redundancy","emergencyShutdown":"Dual redundant ESD systems","monitoring":"24/7 remote monitoring + on-site BMS"},"localContent":{"containerManufacturing":"PT Peti Kemas Indonesia, Surabaya","installationCrew":"85% local technicians","maintenanceTraining":"6-week program for 12 Indonesia Power technicians"}}'::jsonb,
  'Submitted for Approval',
  'Dimas Prastio',
  '2025-02-05 14:30:00+07',
  '["Dimas Prastio"]'::jsonb
FROM fact_contract_template t 
WHERE t.template_name = 'Battery Storage Procurement Terms - Standard Template'
LIMIT 1;

-- Insert Personnel Assignments
INSERT INTO fact_contract_personnel_assignment (contract_workspace_id, user_id, user_name, user_role, expertise_area, current_workload, assignment_status, assigned_by)
SELECT 
  w.id,
  'USR-001',
  'Dimas Prastio',
  'Procurement Lead',
  ARRAY['Renewable Energy Procurement','Solar Technology','Contract Negotiation','Vendor Management'],
  3,
  'Active',
  'System Auto-Assignment'
FROM fact_contract_workspace w 
WHERE w.sourcing_event_id = 'SE-2025-SOLAR-Q1'
LIMIT 1;

INSERT INTO fact_contract_personnel_assignment (contract_workspace_id, user_id, user_name, user_role, expertise_area, current_workload, assignment_status, assigned_by)
SELECT 
  w.id,
  'USR-002',
  'Intan Pratiwi',
  'Legal Counsel',
  ARRAY['ESG Compliance','Contract Law','Renewable Energy Regulations','International Standards'],
  5,
  'Active',
  'System Auto-Assignment'
FROM fact_contract_workspace w 
WHERE w.sourcing_event_id = 'SE-2025-SOLAR-Q1'
LIMIT 1;

INSERT INTO fact_contract_personnel_assignment (contract_workspace_id, user_id, user_name, user_role, expertise_area, current_workload, assignment_status, assigned_by)
SELECT 
  w.id,
  'USR-003',
  'Jefferson Soesetyo',
  'Technical Reviewer',
  ARRAY['Solar PV Systems','Grid Integration','Performance Testing','Quality Assurance'],
  4,
  'Active',
  'System Auto-Assignment'
FROM fact_contract_workspace w 
WHERE w.sourcing_event_id = 'SE-2025-SOLAR-Q1'
LIMIT 1;

INSERT INTO fact_contract_personnel_assignment (contract_workspace_id, user_id, user_name, user_role, expertise_area, current_workload, assignment_status, assigned_by)
SELECT 
  w.id,
  'USR-003',
  'Jefferson Soesetyo',
  'Technical Reviewer',
  ARRAY['Wind Turbine Technology','Offshore Wind','O&M Best Practices','SCADA Systems'],
  4,
  'Active',
  'Dimas Prastio'
FROM fact_contract_workspace w 
WHERE w.sourcing_event_id = 'SE-2025-WIND-OFFSHORE'
LIMIT 1;

INSERT INTO fact_contract_personnel_assignment (contract_workspace_id, user_id, user_name, user_role, expertise_area, current_workload, assignment_status, assigned_by)
SELECT 
  w.id,
  'USR-002',
  'Intan Pratiwi',
  'Legal Counsel',
  ARRAY['Service Agreements','Environmental Law','Marine Regulations','Liability Management'],
  5,
  'Active',
  'System Auto-Assignment'
FROM fact_contract_workspace w 
WHERE w.sourcing_event_id = 'SE-2025-WIND-OFFSHORE'
LIMIT 1;

INSERT INTO fact_contract_personnel_assignment (contract_workspace_id, user_id, user_name, user_role, expertise_area, current_workload, assignment_status, assigned_by)
SELECT 
  w.id,
  'USR-005',
  'Bambang Sutrisno',
  'Project Manager',
  ARRAY['Wind Farm Operations','Offshore Logistics','Maintenance Planning','Risk Management'],
  2,
  'Active',
  'Jefferson Soesetyo'
FROM fact_contract_workspace w 
WHERE w.sourcing_event_id = 'SE-2025-WIND-OFFSHORE'
LIMIT 1;

INSERT INTO fact_contract_personnel_assignment (contract_workspace_id, user_id, user_name, user_role, expertise_area, current_workload, assignment_status, assigned_by)
SELECT 
  w.id,
  'USR-001',
  'Dimas Prastio',
  'Procurement Lead',
  ARRAY['Energy Storage Procurement','Battery Technology','Grid Services','Financial Analysis'],
  3,
  'Active',
  'System Auto-Assignment'
FROM fact_contract_workspace w 
WHERE w.sourcing_event_id = 'SE-2025-BESS-EXPANSION'
LIMIT 1;

INSERT INTO fact_contract_personnel_assignment (contract_workspace_id, user_id, user_name, user_role, expertise_area, current_workload, assignment_status, assigned_by)
SELECT 
  w.id,
  'USR-004',
  'Siti Nurhaliza',
  'Finance Manager',
  ARRAY['Financial Modeling','Contract Valuation','Payment Terms','Risk Assessment'],
  6,
  'Active',
  'Dimas Prastio'
FROM fact_contract_workspace w 
WHERE w.sourcing_event_id = 'SE-2025-BESS-EXPANSION'
LIMIT 1;

-- Insert Legal Collaboration Comments
INSERT INTO fact_legal_collaboration (contract_workspace_id, clause_section, comment_text, comment_type, commenter_id, commenter_name, commenter_role, is_resolved)
SELECT 
  w.id,
  'deliverySchedule',
  'The current delivery schedule needs to be aligned with the PLN substation upgrade timeline. Grid interconnection point will not be ready until June 2025. Recommend updating the delivery start date.',
  'Concern',
  'USR-003',
  'Jefferson Soesetyo',
  'Technical Reviewer',
  false
FROM fact_contract_workspace w 
WHERE w.sourcing_event_id = 'SE-2025-SOLAR-Q1'
LIMIT 1;

INSERT INTO fact_legal_collaboration (contract_workspace_id, clause_section, comment_text, comment_type, commenter_id, commenter_name, commenter_role, is_resolved)
SELECT 
  w.id,
  'localContent',
  'Current local content percentage (42%) exceeds the minimum requirement of 40%. This is good for TKDN compliance. Please ensure we have proper documentation from the supplier to verify this percentage.',
  'Approval',
  'USR-002',
  'Intan Pratiwi',
  'Legal Counsel',
  true
FROM fact_contract_workspace w 
WHERE w.sourcing_event_id = 'SE-2025-SOLAR-Q1'
LIMIT 1;

INSERT INTO fact_legal_collaboration (contract_workspace_id, clause_section, comment_text, comment_type, commenter_id, commenter_name, commenter_role, is_resolved)
SELECT 
  w.id,
  'performanceGuarantee',
  'Need to clarify warranty period for turbine blades. Current template references OEM warranty but lacks specific blade warranty duration. Industry standard is 7 years for offshore blades.',
  'Suggestion',
  'USR-002',
  'Intan Pratiwi',
  'Legal Counsel',
  false
FROM fact_contract_workspace w 
WHERE w.sourcing_event_id = 'SE-2025-WIND-OFFSHORE'
LIMIT 1;

INSERT INTO fact_legal_collaboration (contract_workspace_id, clause_section, comment_text, comment_type, commenter_id, commenter_name, commenter_role, is_resolved)
SELECT 
  w.id,
  'environmentalCompliance',
  'Excellent addition of the bird migration clause with automated shutdown during peak migration periods. This demonstrates our commitment to environmental protection and should satisfy the EIA requirements.',
  'Approval',
  'USR-003',
  'Jefferson Soesetyo',
  'Technical Reviewer',
  true
FROM fact_contract_workspace w 
WHERE w.sourcing_event_id = 'SE-2025-WIND-OFFSHORE'
LIMIT 1;

INSERT INTO fact_legal_collaboration (contract_workspace_id, clause_section, comment_text, comment_type, commenter_id, commenter_name, commenter_role, is_resolved, resolved_by, resolved_at)
SELECT 
  w.id,
  'environmentalCompliance',
  'We need to add specific ESG reporting obligations for this battery storage project. The contract should require quarterly sustainability reports including carbon emissions from manufacturing, supply chain transparency, and end-of-life recycling plans.',
  'Concern',
  'USR-002',
  'Intan Pratiwi',
  'Legal Counsel',
  true,
  'Dimas Prastio',
  '2025-02-04 16:45:00+07'
FROM fact_contract_workspace w 
WHERE w.sourcing_event_id = 'SE-2025-BESS-EXPANSION'
LIMIT 1;

INSERT INTO fact_legal_collaboration (contract_workspace_id, parent_comment_id, clause_section, comment_text, comment_type, commenter_id, commenter_name, commenter_role, is_resolved)
SELECT 
  c.contract_workspace_id,
  c.id,
  'environmentalCompliance',
  'Agreed. I have added a comprehensive ESG reporting section under Section 9. It includes quarterly reporting requirements with specific KPIs for carbon footprint, water usage, and recycling rates. Please review.',
  'General',
  'USR-001',
  'Dimas Prastio',
  'Procurement Lead',
  true
FROM fact_legal_collaboration c
WHERE c.commenter_name = 'Intan Pratiwi' 
  AND c.clause_section = 'environmentalCompliance'
  AND c.is_resolved = true
LIMIT 1;

INSERT INTO fact_legal_collaboration (contract_workspace_id, clause_section, comment_text, comment_type, commenter_id, commenter_name, commenter_role, is_resolved)
SELECT 
  w.id,
  'gridIntegration',
  'The grid interconnection specifications are technically sound. Primary frequency response capability under 100ms meets PLN Grid Code requirements. Reactive power support range is adequate for voltage regulation.',
  'Approval',
  'USR-003',
  'Jefferson Soesetyo',
  'Technical Reviewer',
  true
FROM fact_contract_workspace w 
WHERE w.sourcing_event_id = 'SE-2025-BESS-EXPANSION'
LIMIT 1;