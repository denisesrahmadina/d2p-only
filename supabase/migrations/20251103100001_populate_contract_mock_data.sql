/*
  # Populate Comprehensive Contract Lifecycle Mock Data

  1. Content
    - Complete sourcing events with vendor and pricing details
    - Contract templates at various approval stages
    - Contract drafts in different states
    - Contract workspaces with change logs and AI insights
    - Digital signatures for approvals
    - Fully signed contracts
    - Complete audit trails

  2. Demo Flow Coverage
    - Sourcing Event → Template Creation → Template Approval
    - Approved Template → Draft Creation → Draft Review
    - Draft → Workspace Editing → AI Analysis
    - Workspace → Approval Request → Digital Signature
    - Dual Signature → Final Signed Contract
*/

-- Clear existing sample data to ensure clean state
DELETE FROM fact_signature_audit_log;
DELETE FROM fact_signed_contract;
DELETE FROM fact_digital_signature;
DELETE FROM fact_contract_draft;
DELETE FROM ref_contract_ai_insight;
DELETE FROM fact_contract_approval;
DELETE FROM fact_contract_change_log;
DELETE FROM fact_contract_workspace;
DELETE FROM fact_contract_template;

-- Insert comprehensive contract templates
INSERT INTO fact_contract_template (id, sourcing_event_id, template_name, template_content, template_sections, status, version, created_by, approved_by, approval_status, approval_date, organization_id) VALUES
-- Approved template ready for use
('a1111111-1111-1111-1111-111111111111', 'SE-2024-001', 'Steel Supply Contract Template - Approved',
'{"header": {"title": "Steel Supply Agreement 2024", "contractNumber": "CNT-2024-001", "effectiveDate": "2024-11-01", "expiryDate": "2025-10-31"},
"parties": {"buyer": "PT Indonesia Power", "supplier": "PT Krakatau Steel", "buyerAddress": "Jl. Ketintang Baru No. 11, Surabaya", "supplierAddress": "Jl. Industri No. 5, Cilegon"},
"scopeOfWork": {"description": "Supply of high-grade structural steel for power plant construction", "deliverables": ["Q345 Steel Plates - 500 tons", "H-Beam Sections - 300 tons", "Steel Pipes - 200 tons"], "specifications": "As per ASTM A36 and JIS G3101 standards"},
"pricingTerms": {"totalValue": "IDR 5,250,000,000", "currency": "IDR", "paymentStructure": "30% advance, 40% on delivery, 30% after inspection", "priceAdjustment": "Fixed price for contract duration"},
"paymentTerms": {"method": "Bank transfer to designated account", "schedule": "Net 30 days from invoice date", "bankDetails": "Bank Mandiri - Account 1234567890", "latePenalty": "2% per month on overdue amounts"},
"deliverySchedule": {"location": "PT Indonesia Power - Paiton Site, Probolinggo", "timeline": "Phased delivery over 6 months starting December 2024", "milestones": [{"phase": "Phase 1", "quantity": "40%", "date": "2024-12-30"}, {"phase": "Phase 2", "quantity": "35%", "date": "2025-02-28"}, {"phase": "Phase 3", "quantity": "25%", "date": "2025-04-30"}], "incoterms": "DDP (Delivered Duty Paid)"},
"performanceStandards": {"qualityStandards": "ISO 9001:2015 certified, material test certificates required", "inspectionProcess": "Third-party inspection by SGS before delivery", "acceptanceCriteria": "As per technical specifications, max 2% rejection rate", "warranties": "12 months warranty for material defects from acceptance date"},
"terminationClauses": {"terminationNotice": "90 days written notice for convenience termination", "terminationForCause": "Immediate termination for material breach after 30-day cure period", "consequences": "Return of advance payments minus completed work value, settlement within 60 days", "disputeResolution": "Arbitration under BANI rules in Jakarta, Indonesia"},
"legalTerms": {"governingLaw": "Laws of Republic of Indonesia", "jurisdiction": "Jakarta District Court", "confidentiality": "Both parties maintain confidentiality for 5 years post-contract", "liability": "Limited to 100% of contract value except for willful misconduct", "forceMajeure": "Standard force majeure provisions apply with notification requirements", "insurance": "Supplier maintains product liability insurance minimum IDR 10 billion"},
"specialConditions": {"compliance": "Supplier complies with all Indonesian safety and environmental regulations", "subcontracting": "Not permitted without prior written approval from buyer", "intellectualProperty": "All work product and designs owned by buyer", "amendments": "Must be in writing, signed by authorized representatives"}}',
'{"header": true, "parties": true, "scopeOfWork": true, "pricingTerms": true, "paymentTerms": true, "deliverySchedule": true, "performanceStandards": true, "terminationClauses": true, "legalTerms": true, "specialConditions": true}',
'Approved', 1, 'Arief Budiman', 'Siti Nurhaliza', 'Approved', '2024-10-28 10:30:00', null),

-- Pending approval template
('a2222222-2222-2222-2222-222222222222', 'SE-2024-002', 'IT Equipment Supply Contract Template',
'{"header": {"title": "IT Equipment Supply Agreement", "contractNumber": "CNT-2024-002", "effectiveDate": "2024-12-01", "expiryDate": "2025-11-30"},
"parties": {"buyer": "PT Indonesia Power", "supplier": "PT Acer Indonesia"},
"scopeOfWork": {"description": "Supply of enterprise IT equipment for data center upgrade", "deliverables": ["40 Desktop Computers", "20 Laptops", "5 Servers", "Network Equipment"], "specifications": "Minimum Intel Core i7, 16GB RAM, 512GB SSD"},
"pricingTerms": {"totalValue": "IDR 2,800,000,000", "currency": "IDR"}}',
'{"header": true, "parties": true, "scopeOfWork": true, "pricingTerms": true}',
'Pending Approval', 1, 'Budi Santoso', null, 'Pending', null, null),

-- Another approved template
('a3333333-3333-3333-3333-333333333333', 'SE-2024-003', 'Maintenance Services Contract Template - Approved',
'{"header": {"title": "Preventive Maintenance Services Agreement", "contractNumber": "CNT-2024-003", "effectiveDate": "2024-11-15", "expiryDate": "2025-11-14"},
"parties": {"buyer": "PT Indonesia Power", "supplier": "PT Wijaya Karya", "buyerAddress": "Jakarta", "supplierAddress": "Jakarta"},
"scopeOfWork": {"description": "Preventive maintenance services for turbine equipment", "deliverables": ["Monthly maintenance visits", "Quarterly inspections", "Emergency support 24/7"], "specifications": "As per OEM maintenance manual"}}',
'{"header": true, "parties": true, "scopeOfWork": true}',
'Approved', 1, 'Dewi Lestari', 'Ahmad Yani', 'Approved', '2024-10-30 14:20:00', null),

-- New template for demo
('a4444444-4444-4444-4444-444444444444', 'SE-2024-004', 'Coal Supply Contract Template',
'{"header": {"title": "Coal Supply Agreement", "contractNumber": "CNT-2024-004"},
"parties": {"buyer": "PT Indonesia Power", "supplier": "PT Bukit Asam"}}',
'{"header": true, "parties": true}',
'Draft', 1, 'Rahman Hidayat', null, 'Pending', null, null);

-- Insert contract drafts
INSERT INTO fact_contract_draft (id, contract_template_id, sourcing_event_id, draft_name, draft_content, draft_status, version, created_by, last_modified_by, submitted_for_approval_at, submitted_by) VALUES
-- Draft ready for approval
('d1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'SE-2024-001', 'Steel Supply Contract - Draft v1',
'{"header": {"title": "Steel Supply Agreement 2024", "contractNumber": "CNT-2024-001-DRAFT", "effectiveDate": "2024-12-01", "expiryDate": "2025-11-30"},
"parties": {"buyer": "PT Indonesia Power", "supplier": "PT Krakatau Steel", "buyerAddress": "Jl. Ketintang Baru No. 11, Surabaya", "supplierAddress": "Jl. Industri No. 5, Cilegon"}}',
'Ready for Approval', 1, 'Arief Budiman', 'Arief Budiman', '2024-11-01 14:30:00', 'Arief Budiman'),

-- Draft in progress
('d2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', 'SE-2024-003', 'Maintenance Services Contract - Draft',
'{"header": {"title": "Preventive Maintenance Services Agreement", "contractNumber": "CNT-2024-003-DRAFT"}}',
'Draft', 1, 'Dewi Lestari', 'Dewi Lestari', null, null);

-- Create workspaces with complete data
DO $$
DECLARE
  workspace_id_1 uuid;
  workspace_id_2 uuid;
  approval_id_1 uuid;
  approval_id_2 uuid;
  approval_id_3 uuid;
  approval_id_4 uuid;
  signature_id_1 uuid;
  signature_id_2 uuid;
  signature_id_3 uuid;
  signature_id_4 uuid;
BEGIN
  -- Workspace 1: Active with pending approvals
  INSERT INTO fact_contract_workspace (contract_template_id, sourcing_event_id, current_content, workspace_status, active_editors)
  VALUES ('a1111111-1111-1111-1111-111111111111', 'SE-2024-001',
  '{"header": {"title": "Steel Supply Agreement 2024", "contractNumber": "CNT-2024-001", "effectiveDate": "2024-12-01", "expiryDate": "2025-11-30"},
  "parties": {"buyer": "PT Indonesia Power", "supplier": "PT Krakatau Steel", "buyerAddress": "Jl. Ketintang Baru No. 11, Surabaya", "supplierAddress": "Jl. Industri No. 5, Cilegon"},
  "scopeOfWork": {"description": "Supply of high-grade structural steel for power plant construction", "deliverables": ["Q345 Steel Plates - 500 tons", "H-Beam Sections - 300 tons", "Steel Pipes - 200 tons"], "specifications": "As per ASTM A36 and JIS G3101 standards"},
  "pricingTerms": {"totalValue": "IDR 5,250,000,000", "currency": "IDR", "paymentStructure": "30% advance, 40% on delivery, 30% after inspection"}}',
  'Submitted for Approval', '["Arief Budiman", "Rina Kusuma"]')
  RETURNING id INTO workspace_id_1;

  -- Workspace 2: Completed with all signatures
  INSERT INTO fact_contract_workspace (contract_template_id, sourcing_event_id, current_content, workspace_status, active_editors)
  VALUES ('a3333333-3333-3333-3333-333333333333', 'SE-2024-003',
  '{"header": {"title": "Preventive Maintenance Services Agreement", "contractNumber": "CNT-2024-003", "effectiveDate": "2024-11-15", "expiryDate": "2025-11-14"},
  "parties": {"buyer": "PT Indonesia Power", "supplier": "PT Wijaya Karya"},
  "scopeOfWork": {"description": "Preventive maintenance services for turbine equipment"}}',
  'Submitted for Approval', '["Dewi Lestari"]')
  RETURNING id INTO workspace_id_2;

  -- Change logs for workspace 1
  INSERT INTO fact_contract_change_log (contract_workspace_id, changed_by, change_type, change_location, previous_content, new_content, character_count_change, timestamp)
  VALUES
  (workspace_id_1, 'Arief Budiman', 'Content Edit', 'scopeOfWork.description', 'Supply of structural steel', 'Supply of high-grade structural steel for power plant construction', 35, '2024-11-01 09:15:00'),
  (workspace_id_1, 'Rina Kusuma', 'Content Edit', 'pricingTerms.totalValue', 'IDR 5,000,000,000', 'IDR 5,250,000,000', 3, '2024-11-01 10:30:00'),
  (workspace_id_1, 'Arief Budiman', 'Content Edit', 'parties.buyerAddress', '', 'Jl. Ketintang Baru No. 11, Surabaya', 35, '2024-11-01 11:45:00');

  -- Approval records for workspace 1 (pending)
  INSERT INTO fact_contract_approval (contract_workspace_id, contract_version, approver_id, approver_name, approver_role, approval_status, ai_insights_reviewed)
  VALUES
  (workspace_id_1, 1, 'PM001', 'Siti Nurhaliza', 'Procurement Manager', 'Pending', false),
  (workspace_id_1, 1, 'REQ001', 'Bambang Sutrisno', 'Requestor', 'Pending', false)
  RETURNING id INTO approval_id_1;

  SELECT id INTO approval_id_2 FROM fact_contract_approval
  WHERE contract_workspace_id = workspace_id_1 AND approver_role = 'Requestor' LIMIT 1;

  -- Approval records for workspace 2 (approved with signatures)
  INSERT INTO fact_contract_approval (contract_workspace_id, contract_version, approver_id, approver_name, approver_role, approval_status, comments, ai_insights_reviewed, reviewed_at)
  VALUES
  (workspace_id_2, 1, 'PM001', 'Siti Nurhaliza', 'Procurement Manager', 'Approved', 'Contract terms are acceptable. Approved for execution.', true, '2024-11-02 10:00:00'),
  (workspace_id_2, 1, 'REQ002', 'Ahmad Yani', 'Requestor', 'Approved', 'Maintenance scope meets our requirements. Approved.', true, '2024-11-02 14:30:00')
  RETURNING id INTO approval_id_3;

  SELECT id INTO approval_id_4 FROM fact_contract_approval
  WHERE contract_workspace_id = workspace_id_2 AND approver_role = 'Requestor' LIMIT 1;

  -- Digital signatures for workspace 2 (completed)
  INSERT INTO fact_digital_signature (contract_approval_id, contract_workspace_id, signer_id, signer_name, signer_role, signature_type, signature_data, signed_at, ip_address, device_info, signature_certificate, verification_hash, is_verified)
  VALUES
  (approval_id_3, workspace_id_2, 'PM001', 'Siti Nurhaliza', 'Procurement Manager', 'Drawn', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', '2024-11-02 10:05:00', '192.168.1.100', 'Chrome 120.0 / Windows 11', '{"issuer": "PT Indonesia Power CA", "issued_at": "2024-11-02T10:05:00Z", "expires_at": "2025-11-02T10:05:00Z", "certificate_id": "CERT-PM001-2024110210"}', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', true),
  (approval_id_4, workspace_id_2, 'REQ002', 'Ahmad Yani', 'Requestor', 'Typed', 'Ahmad Yani', '2024-11-02 14:35:00', '192.168.1.105', 'Firefox 119.0 / macOS Sonoma', '{"issuer": "PT Indonesia Power CA", "issued_at": "2024-11-02T14:35:00Z", "expires_at": "2025-11-02T14:35:00Z", "certificate_id": "CERT-REQ002-2024110214"}', 'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a', true)
  RETURNING id INTO signature_id_1;

  SELECT id INTO signature_id_2 FROM fact_digital_signature
  WHERE contract_workspace_id = workspace_id_2 AND signer_role = 'Requestor' LIMIT 1;

  -- Create signed contract for workspace 2
  INSERT INTO fact_signed_contract (contract_workspace_id, contract_name, final_content, execution_date, expiry_date, contract_value, contract_status, all_approvals_complete, procurement_manager_signature_id, requestor_signature_id, created_by)
  VALUES
  (workspace_id_2, 'Preventive Maintenance Services Agreement - Executed',
  '{"header": {"title": "Preventive Maintenance Services Agreement", "contractNumber": "CNT-2024-003", "effectiveDate": "2024-11-15", "expiryDate": "2025-11-14"}, "parties": {"buyer": "PT Indonesia Power", "supplier": "PT Wijaya Karya"}, "scopeOfWork": {"description": "Preventive maintenance services for turbine equipment"}}',
  '2024-11-02 15:00:00', '2025-11-14 23:59:59', 1500000000, 'Active', true, signature_id_1, signature_id_2, 'System');

  -- AI Insights for workspace 1
  INSERT INTO ref_contract_ai_insight (contract_workspace_id, insight_type, risk_category, severity, title, description, affected_section, recommendations)
  VALUES
  (workspace_id_1, 'Legal Risk', 'Legal', 'High', 'Limited Liability Clause Requires Review', 'Liability limited to contract value may not cover consequential damages in case of major quality issues or delays', 'legalTerms.liability', '["Consider increasing liability cap to 150% of contract value", "Add separate cap for consequential damages", "Include penalty clauses for delivery delays"]'),
  (workspace_id_1, 'Financial Risk', 'Financial', 'Medium', 'Price Escalation Not Addressed', 'Fixed price contract with no escalation clause for 12-month period may expose to commodity price fluctuations', 'pricingTerms.priceAdjustment', '["Add price adjustment clause tied to steel commodity index", "Include quarterly review mechanism", "Set maximum escalation cap at 10%"]'),
  (workspace_id_1, 'Delivery Risk', 'Delivery', 'Critical', 'Insufficient Delivery Penalty Clauses', 'No liquidated damages specified for late delivery which could impact project timeline', 'deliverySchedule', '["Add liquidated damages at 0.5% per week of delay", "Include milestone-specific penalties", "Maximum penalty cap at 10% of contract value"]'),
  (workspace_id_1, 'Risk Factor', 'Performance', 'High', 'Quality Assurance Plan Needs Detail', 'Quality standards mentioned but detailed QA/QC procedures not specified', 'performanceStandards', '["Develop detailed inspection protocol with hold points", "Specify sampling methodology and acceptance criteria", "Add non-conformance handling procedure"]'),
  (workspace_id_1, 'Compliance Issue', 'Compliance', 'Medium', 'Environmental Compliance Requirements Missing', 'No specific environmental compliance requirements or certifications mentioned', 'specialConditions.compliance', '["Add ISO 14001 certification requirement", "Specify emissions and waste handling standards", "Include environmental incident reporting obligations"]'),
  (workspace_id_1, 'Financial Risk', 'Financial', 'High', 'Payment Terms Favor Supplier', 'High advance payment (30%) without adequate bank guarantee protection', 'paymentTerms', '["Require bank guarantee for advance payment", "Reduce advance to 20% or condition on performance bond", "Add milestone-based payment schedule"]');

  -- Signature audit logs
  INSERT INTO fact_signature_audit_log (digital_signature_id, contract_workspace_id, action_type, actor_id, actor_name, action_details, ip_address, timestamp)
  VALUES
  (signature_id_1, workspace_id_2, 'Signature Requested', 'SYSTEM', 'System', '{"approver_role": "Procurement Manager", "contract_id": "CNT-2024-003"}', '192.168.1.1', '2024-11-02 09:00:00'),
  (signature_id_1, workspace_id_2, 'Document Viewed', 'PM001', 'Siti Nurhaliza', '{"view_duration_seconds": 180}', '192.168.1.100', '2024-11-02 09:55:00'),
  (signature_id_1, workspace_id_2, 'Signature Started', 'PM001', 'Siti Nurhaliza', '{"signature_type": "Drawn"}', '192.168.1.100', '2024-11-02 10:04:00'),
  (signature_id_1, workspace_id_2, 'Signature Completed', 'PM001', 'Siti Nurhaliza', '{"signature_type": "Drawn", "completion_time_seconds": 45}', '192.168.1.100', '2024-11-02 10:05:00'),
  (signature_id_1, workspace_id_2, 'Signature Verified', 'SYSTEM', 'System', '{"verification_method": "Certificate", "verified": true}', '192.168.1.1', '2024-11-02 10:05:05'),
  (signature_id_2, workspace_id_2, 'Signature Requested', 'SYSTEM', 'System', '{"approver_role": "Requestor", "contract_id": "CNT-2024-003"}', '192.168.1.1', '2024-11-02 10:10:00'),
  (signature_id_2, workspace_id_2, 'Document Viewed', 'REQ002', 'Ahmad Yani', '{"view_duration_seconds": 240}', '192.168.1.105', '2024-11-02 14:20:00'),
  (signature_id_2, workspace_id_2, 'Signature Completed', 'REQ002', 'Ahmad Yani', '{"signature_type": "Typed", "signature_text": "Ahmad Yani"}', '192.168.1.105', '2024-11-02 14:35:00'),
  (signature_id_2, workspace_id_2, 'Signature Verified', 'SYSTEM', 'System', '{"verification_method": "Certificate", "verified": true}', '192.168.1.1', '2024-11-02 14:35:05');

END $$;
