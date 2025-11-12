/*
  # Populate Contract Lifecycle Sample Data

  1. Content
    - Sample contract templates linked to sourcing events
    - Active contract workspaces with realistic content
    - Change logs showing individual user edits
    - Approval records with various states
    - AI insights categorized by risk type

  2. Coverage
    - Multiple contract templates in different approval states
    - Workspaces with active collaboration
    - Comprehensive change history
    - Multi-role approval workflows
    - Categorized AI insights: Legal, Financial, Operational, Compliance, Delivery, Performance
*/

-- Insert sample contract templates
INSERT INTO fact_contract_template (sourcing_event_id, template_name, template_content, template_sections, status, version, created_by, approved_by, approval_status, approval_date, organization_id) VALUES
('SE-2024-001', 'Steel Supply Contract Template', '{"header": {"title": "Steel Supply Agreement 2024", "contractNumber": "CNT-2024-001", "effectiveDate": "2024-11-01", "expiryDate": "2025-10-31"}, "parties": {"buyer": "PT Indonesia Power", "supplier": "PT Steel Indonesia"}, "scopeOfWork": {"description": "Supply of structural steel"}, "pricingTerms": {"totalValue": "IDR 5,000,000,000"}}', '{"header": true, "parties": true, "scopeOfWork": true, "pricingTerms": true}', 'Approved', 1, 'Arief Budiman', 'Siti Nurhaliza', 'Approved', '2024-10-28 10:30:00', null),

('SE-2024-002', 'IT Equipment Supply Contract', '{"header": {"title": "IT Equipment Supply Agreement", "contractNumber": "CNT-2024-002"}, "parties": {"buyer": "PT Indonesia Power", "supplier": "PT Tech Solutions"}}', '{"header": true, "parties": true}', 'Pending Approval', 1, 'Budi Santoso', null, 'Pending', null, null),

('SE-2024-003', 'Maintenance Services Contract', '{"header": {"title": "Preventive Maintenance Services Agreement", "contractNumber": "CNT-2024-003"}}', '{"header": true}', 'Approved', 1, 'Dewi Lestari', 'Ahmad Yani', 'Approved', '2024-10-30 14:20:00', null);

-- Get template IDs and create workspaces with change logs and insights
DO $$
DECLARE
  template_id_1 uuid;
  template_id_2 uuid;
  workspace_id_1 uuid;
  workspace_id_2 uuid;
BEGIN
  SELECT id INTO template_id_1 FROM fact_contract_template WHERE sourcing_event_id = 'SE-2024-001';
  SELECT id INTO template_id_2 FROM fact_contract_template WHERE sourcing_event_id = 'SE-2024-003';

  INSERT INTO fact_contract_workspace (contract_template_id, sourcing_event_id, current_content, workspace_status, active_editors)
  VALUES
  (template_id_1, 'SE-2024-001', '{"header": {"title": "Steel Supply Agreement 2024", "contractNumber": "CNT-2024-001"}, "parties": {"buyer": "PT Indonesia Power", "supplier": "PT Steel Indonesia"}, "scopeOfWork": {"description": "Supply of high-grade structural steel"}, "pricingTerms": {"totalValue": "IDR 5,250,000,000"}}', 'Active', '["Arief Budiman", "Rina Kusuma"]')
  RETURNING id INTO workspace_id_1;

  INSERT INTO fact_contract_workspace (contract_template_id, sourcing_event_id, current_content, workspace_status, active_editors)
  VALUES
  (template_id_2, 'SE-2024-003', '{"header": {"title": "Preventive Maintenance Services Agreement", "contractNumber": "CNT-2024-003"}}', 'Submitted for Approval', '["Dewi Lestari"]')
  RETURNING id INTO workspace_id_2;

  INSERT INTO fact_contract_change_log (contract_workspace_id, changed_by, change_type, change_location, previous_content, new_content, character_count_change, timestamp)
  VALUES
  (workspace_id_1, 'Arief Budiman', 'Content Edit', 'scopeOfWork.description', 'Supply of structural steel', 'Supply of high-grade structural steel', 11, '2024-11-01 09:15:00'),
  (workspace_id_1, 'Rina Kusuma', 'Content Edit', 'pricingTerms.totalValue', 'IDR 5,000,000,000', 'IDR 5,250,000,000', 3, '2024-11-01 10:30:00');

  INSERT INTO fact_contract_approval (contract_workspace_id, contract_version, approver_id, approver_name, approver_role, approval_status, ai_insights_reviewed)
  VALUES
  (workspace_id_1, 1, 'APPR001', 'Siti Nurhaliza', 'Procurement Manager', 'Pending', false),
  (workspace_id_1, 1, 'APPR002', 'Bambang Sutrisno', 'Requestor', 'Pending', false),
  (workspace_id_2, 1, 'APPR003', 'Ahmad Yani', 'Procurement Manager', 'Pending', false);

  INSERT INTO ref_contract_ai_insight (contract_workspace_id, insight_type, risk_category, severity, title, description, affected_section, recommendations)
  VALUES
  (workspace_id_1, 'Legal Risk', 'Legal', 'High', 'Limited Liability Clause Requires Review', 'Liability limited to contract value may not cover consequential damages', 'legalTerms.liability', '["Consider increasing liability cap", "Add separate cap for damages"]'),
  (workspace_id_1, 'Financial Risk', 'Financial', 'Medium', 'Price Escalation Not Addressed', 'Fixed price with no escalation clause for 12-month period', 'pricingTerms.priceAdjustment', '["Add price adjustment clause", "Include maximum escalation cap"]'),
  (workspace_id_1, 'Delivery Risk', 'Delivery', 'High', 'Insufficient Delivery Penalty Clauses', 'No liquidated damages specified for late delivery', 'deliverySchedule', '["Add liquidated damages clause", "Include milestone penalties"]'),
  (workspace_id_1, 'Risk Factor', 'Performance', 'Critical', 'Weak Quality Assurance Provisions', 'No detailed quality assurance plan specified', 'performanceStandards', '["Develop detailed inspection protocol", "Add supplier quality requirements"]'),
  (workspace_id_1, 'Compliance Issue', 'Compliance', 'Medium', 'Environmental Compliance Not Specified', 'Lacks environmental compliance requirements', 'specialConditions.compliance', '["Add ISO 14001 requirement", "Specify emissions standards"]'),
  (workspace_id_2, 'Risk Factor', 'Performance', 'Critical', 'Vague Performance Metrics', 'Uptime target measurement methodology not defined', 'performanceStandards', '["Define uptime calculation", "Add SLA with penalties"]'),
  (workspace_id_2, 'Financial Risk', 'Financial', 'High', 'Inadequate Performance Penalties', 'No penalties for failing to meet targets', 'pricingTerms', '["Add monthly fee reduction for below-target", "Include emergency response penalties"]'),
  (workspace_id_2, 'Legal Risk', 'Legal', 'Medium', 'Liability Cap May Be Insufficient', 'Liability cap may not cover extended outage costs', 'legalTerms.liability', '["Increase liability cap", "Exclude gross negligence from cap"]'),
  (workspace_id_2, 'Risk Factor', 'Operational', 'High', 'Emergency Response Requirements Unclear', 'Mobilization and spare parts requirements not specified', 'deliverySchedule.responseTime', '["Define response as on-site arrival", "Mandate spare parts inventory"]'),
  (workspace_id_2, 'Compliance Issue', 'Compliance', 'Medium', 'Safety Requirements Missing', 'No safety standards or training requirements', 'specialConditions', '["Add safety orientation requirement", "Mandate incident reporting"]');

END $$;
