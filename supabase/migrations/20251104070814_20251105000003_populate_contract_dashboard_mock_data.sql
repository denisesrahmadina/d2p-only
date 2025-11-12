/*
  # Populate Contract Lifecycle Dashboard Mock Data
  
  1. Purpose
    - Add comprehensive mock data for Contract Lifecycle Management dashboard
    - Populate templates, workspaces, approvals, insights, and personnel assignments
    
  2. Mock Data Includes
    - 5 contract templates with varied statuses
    - 3 active workspace drafts
    - Personnel assignments with Indonesian names
    - AI insights with specific messages
    
  3. Personnel: Ari Pramana, Nina Kusuma, Rafi Santoso, Diah Ramadhani
*/

DO $$
DECLARE
  org_id UUID;
  template_id_1 UUID;
  template_id_2 UUID;
  template_id_3 UUID;
  template_id_4 UUID;
  template_id_5 UUID;
  workspace_id_1 UUID;
  workspace_id_2 UUID;
  workspace_id_3 UUID;
BEGIN
  SELECT id INTO org_id FROM organizations LIMIT 1;

  -- Templates
  INSERT INTO fact_contract_template (sourcing_event_id, template_name, template_content, template_sections, status, version, created_by, approved_by, approval_status, approval_date, organization_id, created_at, updated_at)
  VALUES ('se-renewable-001', 'Wind Turbine Supply Agreement - 100 MW Project', '{"header": {"title": "Wind Turbine Supply Agreement"}}', '{"header": true, "parties": true, "scopeOfWork": true}', 'Pending Approval', 1, 'Ari Pramana', NULL, 'Pending', NULL, org_id, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day')
  RETURNING id INTO template_id_1;

  INSERT INTO fact_contract_template (sourcing_event_id, template_name, template_content, template_sections, status, version, created_by, approval_status, organization_id, created_at, updated_at)
  VALUES ('se-renewable-002', 'Battery Energy Storage System - Service Agreement', '{"header": {"title": "Battery Storage Service Contract"}}', '{"header": true, "parties": true}', 'Draft', 1, 'Nina Kusuma', 'Pending', org_id, NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 hours')
  RETURNING id INTO template_id_2;

  INSERT INTO fact_contract_template (sourcing_event_id, template_name, template_content, template_sections, status, version, created_by, approved_by, approval_status, approval_date, organization_id, created_at, updated_at)
  VALUES ('se-renewable-003', 'Solar Panel Installation Agreement - 50 MW', '{"header": {"title": "Solar Panel Installation Agreement"}}', '{"header": true}', 'Approved', 2, 'Rafi Santoso', 'Diah Ramadhani', 'Approved', NOW() - INTERVAL '1 day', org_id, NOW() - INTERVAL '10 days', NOW() - INTERVAL '1 day')
  RETURNING id INTO template_id_3;

  INSERT INTO fact_contract_template (sourcing_event_id, template_name, template_content, template_sections, status, version, created_by, approval_status, organization_id, created_at, updated_at)
  VALUES ('se-renewable-004', 'Geothermal Equipment Lease Agreement', '{"header": {"title": "Geothermal Equipment Lease"}}', '{"header": true}', 'Draft', 1, 'Ari Pramana', 'Pending', org_id, NOW() - INTERVAL '1 day', NOW() - INTERVAL '4 hours')
  RETURNING id INTO template_id_4;

  INSERT INTO fact_contract_template (sourcing_event_id, template_name, template_content, template_sections, status, version, created_by, approval_status, organization_id, created_at, updated_at)
  VALUES ('se-renewable-005', 'Hydropower Maintenance SLA - 3 Year Term', '{"header": {"title": "Hydropower Maintenance SLA"}}', '{"header": true}', 'Pending Approval', 1, 'Nina Kusuma', 'Pending', org_id, NOW() - INTERVAL '6 days', NOW() - INTERVAL '3 days')
  RETURNING id INTO template_id_5;

  -- Workspaces
  INSERT INTO fact_contract_workspace (contract_template_id, sourcing_event_id, current_content, workspace_status, active_editors, organization_id, created_at, updated_at)
  VALUES (template_id_1, 'se-renewable-001', '{"header": {"title": "Wind Turbine Supply Agreement"}}', 'Active', '["Ari Pramana", "Rafi Santoso"]', org_id, NOW() - INTERVAL '3 days', NOW() - INTERVAL '5 hours')
  RETURNING id INTO workspace_id_1;

  INSERT INTO fact_contract_workspace (contract_template_id, sourcing_event_id, current_content, workspace_status, active_editors, organization_id, created_at, updated_at)
  VALUES (template_id_2, 'se-renewable-002', '{"header": {"title": "Battery Storage Service Contract"}}', 'Active', '["Nina Kusuma"]', org_id, NOW() - INTERVAL '5 days', NOW() - INTERVAL '8 hours')
  RETURNING id INTO workspace_id_2;

  INSERT INTO fact_contract_workspace (contract_template_id, sourcing_event_id, current_content, workspace_status, active_editors, organization_id, created_at, updated_at)
  VALUES (template_id_5, 'se-renewable-005', '{"header": {"title": "Hydropower Maintenance SLA"}}', 'Submitted for Approval', '[]', org_id, NOW() - INTERVAL '6 days', NOW() - INTERVAL '1 day')
  RETURNING id INTO workspace_id_3;

  -- Personnel
  INSERT INTO fact_contract_personnel_assignment (contract_workspace_id, user_id, user_name, user_role, assigned_by, assignment_status, assigned_at, organization_id) VALUES 
    (workspace_id_1, 'user-ari', 'Ari Pramana', 'Procurement Lead', 'System', 'Active', NOW() - INTERVAL '3 days', org_id),
    (workspace_id_1, 'user-rafi', 'Rafi Santoso', 'Legal Counsel', 'System', 'Active', NOW() - INTERVAL '2 days', org_id),
    (workspace_id_2, 'user-nina', 'Nina Kusuma', 'Procurement Lead', 'System', 'Active', NOW() - INTERVAL '5 days', org_id),
    (workspace_id_2, 'user-diah', 'Diah Ramadhani', 'Technical Reviewer', 'System', 'Active', NOW() - INTERVAL '4 days', org_id),
    (workspace_id_3, 'user-nina', 'Nina Kusuma', 'Procurement Lead', 'System', 'Active', NOW() - INTERVAL '6 days', org_id);

  -- Change logs
  INSERT INTO fact_contract_change_log (contract_workspace_id, changed_by, change_type, change_location, previous_content, new_content, character_count_change, timestamp, organization_id) VALUES 
    (workspace_id_1, 'Ari Pramana', 'Content Edit', 'performanceStandards.warranties', '12 months warranty', '24 months comprehensive warranty', 25, NOW() - INTERVAL '5 hours', org_id),
    (workspace_id_2, 'Nina Kusuma', 'Section Added', 'specialConditions.esgCompliance', NULL, 'ESG compliance requirements added', 150, NOW() - INTERVAL '8 hours', org_id);

  -- Approvals
  INSERT INTO fact_contract_approval (contract_workspace_id, contract_version, approver_id, approver_name, approver_role, approval_status, comments, ai_insights_reviewed, organization_id, created_at) VALUES 
    (workspace_id_1, 1, 'user-rafi', 'Rafi Santoso', 'Legal', 'Pending', 'Legal review in progress', true, org_id, NOW() - INTERVAL '1 day'),
    (workspace_id_3, 1, 'user-diah', 'Diah Ramadhani', 'Procurement Manager', 'Pending', NULL, false, org_id, NOW() - INTERVAL '8 days');

  -- AI Insights
  INSERT INTO ref_contract_ai_insight (contract_workspace_id, insight_type, risk_category, severity, title, description, affected_section, recommendations, auto_applied, organization_id, created_at) VALUES 
    (workspace_id_1, 'Legal Risk', 'Legal', 'High', 'Legal review pending for Wind Turbine SLA', 'Contract has been awaiting legal review for 1 day. Delay may impact project timeline.', 'legalTerms', '["Assign legal reviewer immediately", "Set review deadline"]', false, org_id, NOW() - INTERVAL '1 day'),
    (workspace_id_2, 'Compliance Issue', 'Compliance', 'Critical', 'Battery Storage Contract missing ESG clause', 'Environmental, Social, and Governance (ESG) compliance requirements are not specified. This is mandatory for renewable energy projects.', 'specialConditions', '["Add ESG compliance section", "Reference ISO 26000 standards"]', false, org_id, NOW() - INTERVAL '2 days'),
    (workspace_id_3, 'Delivery Risk', 'Delivery', 'Critical', 'Approval overdue for Hydropower Maintenance SLA', 'Contract pending approval for 8 days, exceeding standard 5-day review period.', 'approvalWorkflow', '["Expedite manager approval", "Schedule approval meeting"]', false, org_id, NOW() - INTERVAL '3 days'),
    (workspace_id_1, 'Missing Clause', 'Financial', 'Medium', 'Ambiguous payment clause in Wind Turbine contract', 'Payment terms section lacks clarity on milestone-based payment schedule.', 'paymentTerms', '["Define specific payment milestones", "Add late payment penalty clause"]', false, org_id, NOW() - INTERVAL '5 hours');

END $$;
