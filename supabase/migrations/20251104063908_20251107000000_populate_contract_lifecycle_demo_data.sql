/*
  # Populate Contract Lifecycle Demonstration Data
  
  1. Legal Comments & Collaboration
    - Add realistic discussion threads between procurement, legal, and technical teams
    - Include resolved and unresolved comments on various contract sections
    
  2. Personnel Assignments
    - Assign Indonesian team members to active contract workspaces
    - Include expertise areas relevant to renewable energy projects
    
  3. Approval Workflow Configurations
    - Serial and parallel approval workflows for different contract types
    - Value-based escalation paths
    
  4. Template Recommendations
    - AI-generated recommendations linking templates to sourcing events
    - Confidence scores and reasoning
    
  This data is for demonstration purposes only and represents realistic
  contract lifecycle management scenarios in the renewable energy sector.
*/

-- Insert Legal Collaboration Comments (for Solar Panel Workspace)
INSERT INTO fact_legal_collaboration (contract_workspace_id, clause_section, comment_text, comment_type, commenter_id, commenter_name, commenter_role, is_resolved)
SELECT
  w.id,
  'performanceStandards',
  'The 25-year efficiency guarantee at 80% is standard, but we should consider adding specific testing protocols per IEC 61853. This ensures both parties have clear expectations on measurement methodology.',
  'Suggestion',
  'LEG001',
  'Budi Santoso',
  'Legal Counsel',
  false
FROM fact_contract_workspace w
WHERE w.sourcing_event_id = 'SE-2025-SOLAR-Q1'
LIMIT 1;

INSERT INTO fact_legal_collaboration (contract_workspace_id, clause_section, comment_text, comment_type, commenter_id, commenter_name, commenter_role, is_resolved)
SELECT
  w.id,
  'paymentTerms',
  'I recommend changing the payment schedule from 30 days to 45 days net. This aligns with our cash flow projections and is more favorable for our working capital management.',
  'Concern',
  'FIN001',
  'Ahmad Rizky',
  'Finance Manager',
  false
FROM fact_contract_workspace w
WHERE w.sourcing_event_id = 'SE-2025-SOLAR-Q1'
LIMIT 1;

INSERT INTO fact_legal_collaboration (contract_workspace_id, clause_section, comment_text, comment_type, commenter_id, commenter_name, commenter_role, is_resolved)
SELECT
  w.id,
  'legalTerms',
  'The limitation of liability clause needs strengthening. Current language "Limited to contract value" may not adequately protect us in case of catastrophic failure. Recommend adding specific caps for different liability types: product liability, consequential damages, and delay penalties.',
  'Concern',
  'LEG001',
  'Budi Santoso',
  'Legal Counsel',
  true
FROM fact_contract_workspace w
WHERE w.sourcing_event_id = 'SE-2025-SOLAR-Q1'
LIMIT 1;

INSERT INTO fact_legal_collaboration (contract_workspace_id, clause_section, comment_text, comment_type, commenter_id, commenter_name, commenter_role, is_resolved)
SELECT
  w.id,
  'specialConditions',
  'Please add explicit language about Indonesian local content requirements (TKDN). We need minimum 40% local content to comply with Ministry of Industry regulations for this renewable energy project.',
  'Question',
  'PROC001',
  'Siti Nurhaliza',
  'Procurement Manager',
  false
FROM fact_contract_workspace w
WHERE w.sourcing_event_id = 'SE-2025-SOLAR-Q1'
LIMIT 1;

-- Insert Personnel Assignments
INSERT INTO fact_contract_personnel_assignment (contract_workspace_id, user_id, user_name, user_role, expertise_area, current_workload, assignment_status, assigned_by)
SELECT
  w.id,
  'USR001',
  'Siti Nurhaliza',
  'Procurement Lead',
  ARRAY['Solar Energy', 'Contract Management', 'Indonesian Regulations'],
  3,
  'Active',
  'System Admin'
FROM fact_contract_workspace w
WHERE w.sourcing_event_id = 'SE-2025-SOLAR-Q1'
LIMIT 1;

INSERT INTO fact_contract_personnel_assignment (contract_workspace_id, user_id, user_name, user_role, expertise_area, current_workload, assignment_status, assigned_by)
SELECT
  w.id,
  'USR002',
  'Budi Santoso',
  'Legal Counsel',
  ARRAY['Contract Law', 'Indonesian Regulations', 'Risk Management'],
  5,
  'Active',
  'System Admin'
FROM fact_contract_workspace w
WHERE w.sourcing_event_id = 'SE-2025-SOLAR-Q1'
LIMIT 1;

INSERT INTO fact_contract_personnel_assignment (contract_workspace_id, user_id, user_name, user_role, expertise_area, current_workload, assignment_status, assigned_by)
SELECT
  w.id,
  'USR003',
  'Dewi Kartika',
  'Technical Reviewer',
  ARRAY['Solar Energy', 'Technical Specifications', 'Quality Assurance'],
  2,
  'Active',
  'System Admin'
FROM fact_contract_workspace w
WHERE w.sourcing_event_id = 'SE-2025-SOLAR-Q1'
LIMIT 1;

INSERT INTO fact_contract_personnel_assignment (contract_workspace_id, user_id, user_name, user_role, expertise_area, current_workload, assignment_status, assigned_by)
SELECT
  w.id,
  'USR004',
  'Ahmad Rizky',
  'Finance Manager',
  ARRAY['Financial Analysis', 'Budget Management', 'Payment Terms'],
  4,
  'Active',
  'System Admin'
FROM fact_contract_workspace w
WHERE w.sourcing_event_id = 'SE-2025-SOLAR-Q1'
LIMIT 1;

INSERT INTO fact_contract_personnel_assignment (contract_workspace_id, user_id, user_name, user_role, expertise_area, current_workload, assignment_status, assigned_by)
SELECT
  w.id,
  'USR006',
  'Hendra Gunawan',
  'ESG Compliance Officer',
  ARRAY['ESG Compliance', 'Environmental Standards', 'Sustainability Reporting'],
  2,
  'Active',
  'System Admin'
FROM fact_contract_workspace w
WHERE w.sourcing_event_id = 'SE-2025-SOLAR-Q1'
LIMIT 1;

-- Insert Approval Workflow Configurations
INSERT INTO ref_approval_workflow_config (workflow_name, contract_type, min_value, max_value, workflow_type, approval_steps, sla_hours, escalation_path, is_active) VALUES
('Standard Solar Procurement', 'Solar Panel Supply', 0, 500000000, 'Serial', 
 '[{"step_number": 1, "approver_role": "Procurement Manager", "approver_name": "Siti Nurhaliza", "required": true}, 
   {"step_number": 2, "approver_role": "Requestor", "approver_name": "Bambang Sutrisno", "required": true}]'::jsonb,
 72,
 '[{"trigger_hours": 48, "escalate_to_role": "Director of Procurement"}, 
   {"trigger_hours": 96, "escalate_to_role": "Chief Operating Officer"}]'::jsonb,
 true),

('High-Value Solar Procurement', 'Solar Panel Supply', 500000000, NULL, 'Hybrid',
 '[{"step_number": 1, "approver_role": "Procurement Manager", "approver_name": "Siti Nurhaliza", "required": true, "parallel_group": 1},
   {"step_number": 1, "approver_role": "Legal Counsel", "approver_name": "Budi Santoso", "required": true, "parallel_group": 1},
   {"step_number": 2, "approver_role": "Finance Manager", "approver_name": "Ahmad Rizky", "required": true},
   {"step_number": 3, "approver_role": "Director", "approver_name": "Bambang Sutrisno", "required": true}]'::jsonb,
 120,
 '[{"trigger_hours": 72, "escalate_to_role": "Chief Operating Officer"}, 
   {"trigger_hours": 144, "escalate_to_role": "Chief Executive Officer"}]'::jsonb,
 true),

('Wind Turbine Procurement', 'Wind Turbine', 0, 1000000000, 'Parallel',
 '[{"step_number": 1, "approver_role": "Procurement Manager", "required": true, "parallel_group": 1},
   {"step_number": 1, "approver_role": "Technical Reviewer", "required": true, "parallel_group": 1},
   {"step_number": 2, "approver_role": "Requestor", "required": true}]'::jsonb,
 96,
 '[{"trigger_hours": 60, "escalate_to_role": "Director of Engineering"}]'::jsonb,
 true),

('Battery Storage Procurement', 'Battery Storage', 0, NULL, 'Serial',
 '[{"step_number": 1, "approver_role": "Technical Reviewer", "approver_name": "Dewi Kartika", "required": true},
   {"step_number": 2, "approver_role": "ESG Compliance Officer", "approver_name": "Hendra Gunawan", "required": true},
   {"step_number": 3, "approver_role": "Procurement Manager", "approver_name": "Siti Nurhaliza", "required": true},
   {"step_number": 4, "approver_role": "Requestor", "required": true}]'::jsonb,
 96,
 '[{"trigger_hours": 72, "escalate_to_role": "Director of Operations"}]'::jsonb,
 true);

-- Insert Template Recommendations
INSERT INTO ref_template_recommendation (sourcing_event_id, template_id, recommendation_reason, confidence_score, analysis_context, contract_type, estimated_value, recommended_clauses, is_selected)
SELECT
  'SE-2025-SOLAR-Q1',
  t.id,
  'This template is highly suitable for the solar panel procurement as it includes comprehensive environmental compliance clauses, performance guarantees aligned with 25-year operational requirements, and local content provisions complying with Indonesian regulations. The payment terms and warranty structure match industry standards for large-scale solar installations.',
  0.95,
  '{"procurement_value": "IDR 150B", "project_scale": "50MW Solar Farm", "delivery_timeline": "18 months", "key_requirements": ["IEC 61215 certification", "25-year performance warranty", "40% TKDN compliance"]}'::jsonb,
  'Solar Panel Supply',
  'IDR 150,000,000,000',
  ARRAY['Environmental Compliance', 'Performance Guarantee', 'Local Content', 'Payment Terms'],
  true
FROM fact_contract_template t
WHERE t.template_name LIKE '%Solar Panel%'
LIMIT 1;

INSERT INTO ref_template_recommendation (sourcing_event_id, template_id, recommendation_reason, confidence_score, analysis_context, contract_type, estimated_value, recommended_clauses, is_selected)
SELECT
  'SE-2025-WIND-Q2',
  t.id,
  'Recommended for offshore wind turbine procurement based on technical specifications requiring IEC 61400 compliance, high availability guarantees (97%), and comprehensive maintenance SLA. Template includes appropriate force majeure clauses for marine environment risks and capacity factor guarantees.',
  0.88,
  '{"procurement_value": "IDR 300B", "project_type": "Offshore Wind", "turbine_capacity": "5MW units", "expected_capacity_factor": "35%"}'::jsonb,
  'Wind Turbine',
  'IDR 300,000,000,000',
  ARRAY['Performance Guarantee', 'Grid Interconnection', 'Force Majeure', 'Warranty'],
  false
FROM fact_contract_template t
WHERE t.template_name LIKE '%Wind%'
LIMIT 1;
