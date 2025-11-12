/*
  # Update Existing PRs with Multi-Step Approval Workflows

  ## Overview
  This migration enhances existing Purchase Requisitions with comprehensive approval
  workflow data, including approval chains, history, and status tracking.

  ## Updates Applied
  - Adds approval chains based on PR value (Small/Medium/Large purchases)
  - Creates approval history records showing progression through levels
  - Updates PR statuses to reflect various approval stages
  - Adds detailed comments and timestamps for approvers

  ## Approval Distribution
  - PR-2025-00001 (6.25M): Draft → keep as Draft for testing
  - PR-2025-00002 (0.6M): Approved → Small purchase, single approver
  - PR-2025-00003 (13.5M): Approved → Medium purchase, 2 approvers
  - PR-2025-00004 (17M): Pending at Finance level
  - PR-2025-00005 (25M): Pending at Department Manager level
  - PR-2025-00006 (18M): Rejected at Finance level
  - PR-2025-00007 (11M): Pending at Finance level
  - PR-2025-00008 (25M): Approved → Medium purchase, 2 approvers
*/

-- ============================================================================
-- UPDATE PR-2025-00001: Keep as Draft (no approval chain yet)
-- ============================================================================

UPDATE fact_pr_header
SET 
  requestor_id = 'USER-001',
  requirement_date = '2025-01-29',
  attachment_count = 2,
  attachment_metadata = '[
    {"file_name": "cement_specs.pdf", "file_size": 345678, "file_type": "application/pdf", "file_url": "/attachments/cement_specs.pdf", "uploaded_at": "2025-01-15T09:30:00Z"},
    {"file_name": "vendor_quote.pdf", "file_size": 234567, "file_type": "application/pdf", "file_url": "/attachments/vendor_quote.pdf", "uploaded_at": "2025-01-15T09:45:00Z"}
  ]'::jsonb,
  delivery_location_data = '{"address": "Plant Site, Kawasan Industri MM2100", "city": "Bekasi", "province": "Jawa Barat", "postal_code": "17520", "contact_person": "Ir. Gunawan", "contact_phone": "+62-21-5551234"}'::jsonb
WHERE pr_id = 104;

-- ============================================================================
-- UPDATE PR-2025-00002: Small Purchase - Fully Approved
-- ============================================================================

UPDATE fact_pr_header
SET 
  requestor_id = 'USER-002',
  requirement_date = '2025-02-05',
  pr_status = 'Approved',
  attachment_count = 1,
  attachment_metadata = '[{"file_name": "purchase_justification.pdf", "file_size": 156789, "file_type": "application/pdf", "file_url": "/attachments/justification.pdf", "uploaded_at": "2025-01-22T10:00:00Z"}]'::jsonb,
  delivery_location_data = '{"address": "Jl. Gatot Subroto Kav. 52", "city": "Jakarta Selatan", "province": "DKI Jakarta", "postal_code": "12950", "contact_person": "Dewi Lestari", "contact_phone": "+62-21-5552345"}'::jsonb,
  approval_chain = '[
    {"approver_id": "MGR-001", "approver_name": "Bambang Wijaya", "approver_role": "Department Manager", "status": "Approved", "action_date": "2025-01-24T10:30:00Z", "comments": "Approved - Standard operational requirement"}
  ]'::jsonb
WHERE pr_id = 105;

INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(105, 'PR-2025-00002', 0, 'USER-002', 'Budi Hartono', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-01-22T11:00:00Z', 'Draft', 'Pending Approval'),
(105, 'PR-2025-00002', 1, 'MGR-001', 'Bambang Wijaya', 'Department Manager', 'Approved', 'Approved - Standard operational requirement', '2025-01-24T10:30:00Z', 'Pending Approval', 'Approved');

-- ============================================================================
-- UPDATE PR-2025-00003: Medium Purchase - Fully Approved
-- ============================================================================

UPDATE fact_pr_header
SET 
  requestor_id = 'USER-003',
  requirement_date = '2025-02-15',
  pr_status = 'Approved',
  notes = 'Maintenance equipment and spare parts for preventive maintenance program',
  attachment_count = 3,
  attachment_metadata = '[
    {"file_name": "equipment_list.xlsx", "file_size": 123456, "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file_url": "/attachments/equipment_list.xlsx", "uploaded_at": "2025-01-29T08:30:00Z"},
    {"file_name": "vendor_proposal.pdf", "file_size": 456789, "file_type": "application/pdf", "file_url": "/attachments/vendor_proposal.pdf", "uploaded_at": "2025-01-29T08:45:00Z"},
    {"file_name": "budget_allocation.pdf", "file_size": 234567, "file_type": "application/pdf", "file_url": "/attachments/budget_allocation.pdf", "uploaded_at": "2025-01-29T09:00:00Z"}
  ]'::jsonb,
  delivery_location_data = '{"address": "Maintenance Workshop, Plant 2", "city": "Bekasi", "province": "Jawa Barat", "postal_code": "17550", "contact_person": "Hadi Pranoto", "contact_phone": "+62-21-5553456"}'::jsonb,
  approval_chain = '[
    {"approver_id": "MGR-002", "approver_name": "Ir. Suryadi", "approver_role": "Department Manager", "status": "Approved", "action_date": "2025-01-31T09:15:00Z", "comments": "Approved - Critical for preventive maintenance schedule"},
    {"approver_id": "FIN-001", "approver_name": "Dra. Wulandari", "approver_role": "Finance Manager", "status": "Approved", "action_date": "2025-02-02T14:20:00Z", "comments": "Approved - Budget verified for maintenance CAPEX"}
  ]'::jsonb
WHERE pr_id = 106;

INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(106, 'PR-2025-00003', 0, 'USER-003', 'Dewi Lestari', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-01-29T10:00:00Z', 'Draft', 'Pending Approval'),
(106, 'PR-2025-00003', 1, 'MGR-002', 'Ir. Suryadi', 'Department Manager', 'Approved', 'Approved - Critical for preventive maintenance schedule', '2025-01-31T09:15:00Z', 'Pending Approval', 'Pending Approval'),
(106, 'PR-2025-00003', 2, 'FIN-001', 'Dra. Wulandari', 'Finance Manager', 'Approved', 'Approved - Budget verified for maintenance CAPEX', '2025-02-02T14:20:00Z', 'Pending Approval', 'Approved');

-- ============================================================================
-- UPDATE PR-2025-00004: Medium Purchase - Pending at Finance Level
-- ============================================================================

UPDATE fact_pr_header
SET 
  requestor_id = 'USER-004',
  requirement_date = '2025-02-25',
  pr_status = 'Pending Approval',
  notes = 'IT infrastructure upgrade - network switches and server equipment',
  attachment_count = 2,
  attachment_metadata = '[
    {"file_name": "technical_specs.pdf", "file_size": 567890, "file_type": "application/pdf", "file_url": "/attachments/technical_specs.pdf", "uploaded_at": "2025-02-05T09:00:00Z"},
    {"file_name": "vendor_comparison.xlsx", "file_size": 234567, "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file_url": "/attachments/vendor_comparison.xlsx", "uploaded_at": "2025-02-05T09:30:00Z"}
  ]'::jsonb,
  delivery_location_data = '{"address": "IT Center, Gedung Cyber Lt. 8", "city": "Jakarta Selatan", "province": "DKI Jakarta", "postal_code": "12930", "contact_person": "Denny Kurniawan", "contact_phone": "+62-21-5554567"}'::jsonb,
  approval_chain = '[
    {"approver_id": "MGR-001", "approver_name": "Bambang Wijaya", "approver_role": "Department Manager", "status": "Approved", "action_date": "2025-02-07T11:30:00Z", "comments": "Approved - Network upgrade is critical for business operations"},
    {"approver_id": "FIN-001", "approver_name": "Dra. Wulandari", "approver_role": "Finance Manager", "status": "Pending", "comments": ""}
  ]'::jsonb
WHERE pr_id = 107;

INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(107, 'PR-2025-00004', 0, 'USER-004', 'Fajar Nugroho', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-02-05T10:00:00Z', 'Draft', 'Pending Approval'),
(107, 'PR-2025-00004', 1, 'MGR-001', 'Bambang Wijaya', 'Department Manager', 'Approved', 'Approved - Network upgrade is critical for business operations', '2025-02-07T11:30:00Z', 'Pending Approval', 'Pending Approval');

-- ============================================================================
-- UPDATE PR-2025-00005: Medium Purchase - Pending at Department Manager Level
-- ============================================================================

UPDATE fact_pr_header
SET 
  requestor_id = 'USER-005',
  requirement_date = '2025-03-05',
  pr_status = 'Pending Approval',
  notes = 'Procurement tools and equipment for warehouse operations',
  attachment_count = 2,
  attachment_metadata = '[
    {"file_name": "equipment_requirements.pdf", "file_size": 345678, "file_type": "application/pdf", "file_url": "/attachments/equipment_requirements.pdf", "uploaded_at": "2025-02-12T08:00:00Z"},
    {"file_name": "quotation.pdf", "file_size": 234567, "file_type": "application/pdf", "file_url": "/attachments/quotation.pdf", "uploaded_at": "2025-02-12T08:30:00Z"}
  ]'::jsonb,
  delivery_location_data = '{"address": "Warehouse Complex, Kawasan Logistik", "city": "Bekasi", "province": "Jawa Barat", "postal_code": "17530", "contact_person": "Joko Susilo", "contact_phone": "+62-21-5555678"}'::jsonb,
  approval_chain = '[
    {"approver_id": "MGR-003", "approver_name": "Hendra Gunawan", "approver_role": "Department Manager", "status": "Pending", "comments": ""},
    {"approver_id": "FIN-002", "approver_name": "Dr. Ahmad Yani", "approver_role": "Finance Manager", "status": "Pending", "comments": ""}
  ]'::jsonb
WHERE pr_id = 108;

INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(108, 'PR-2025-00005', 0, 'USER-005', 'Hendra Wijaya', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-02-12T09:00:00Z', 'Draft', 'Pending Approval');

-- ============================================================================
-- UPDATE PR-2025-00006: Medium Purchase - Rejected at Finance Level
-- ============================================================================

UPDATE fact_pr_header
SET 
  requestor_id = 'USER-006',
  requirement_date = '2025-03-10',
  pr_status = 'Rejected',
  notes = 'Engineering software licenses and tools for design team',
  attachment_count = 1,
  attachment_metadata = '[{"file_name": "software_proposal.pdf", "file_size": 456789, "file_type": "application/pdf", "file_url": "/attachments/software_proposal.pdf", "uploaded_at": "2025-02-19T09:00:00Z"}]'::jsonb,
  delivery_location_data = '{"address": "Engineering Department, Plant 3", "city": "Bekasi", "province": "Jawa Barat", "postal_code": "17540", "contact_person": "Ir. Haryanto", "contact_phone": "+62-21-5556789"}'::jsonb,
  approval_chain = '[
    {"approver_id": "MGR-004", "approver_name": "Ir. Bambang Sutrisno", "approver_role": "Department Manager", "status": "Approved", "action_date": "2025-02-21T10:00:00Z", "comments": "Approved - Software tools are necessary for project delivery"},
    {"approver_id": "FIN-002", "approver_name": "Dr. Ahmad Yani", "approver_role": "Finance Manager", "status": "Rejected", "action_date": "2025-02-23T15:30:00Z", "comments": "Rejected - Software budget for Q1 is fully allocated. Please consolidate with upcoming Q2 budget request or identify cost savings from existing licenses"}
  ]'::jsonb
WHERE pr_id = 109;

INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(109, 'PR-2025-00006', 0, 'USER-006', 'Joko Susilo', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-02-19T10:00:00Z', 'Draft', 'Pending Approval'),
(109, 'PR-2025-00006', 1, 'MGR-004', 'Ir. Bambang Sutrisno', 'Department Manager', 'Approved', 'Approved - Software tools are necessary for project delivery', '2025-02-21T10:00:00Z', 'Pending Approval', 'Pending Approval'),
(109, 'PR-2025-00006', 2, 'FIN-002', 'Dr. Ahmad Yani', 'Finance Manager', 'Rejected', 'Rejected - Software budget for Q1 is fully allocated. Please consolidate with upcoming Q2 budget request or identify cost savings from existing licenses', '2025-02-23T15:30:00Z', 'Pending Approval', 'Rejected');

-- ============================================================================
-- UPDATE PR-2025-00007: Medium Purchase - Pending at Finance Level
-- ============================================================================

UPDATE fact_pr_header
SET 
  requestor_id = 'USER-007',
  requirement_date = '2025-03-15',
  pr_status = 'Pending Approval',
  notes = 'Operations equipment and safety gear for field teams',
  attachment_count = 3,
  attachment_metadata = '[
    {"file_name": "equipment_catalog.pdf", "file_size": 678901, "file_type": "application/pdf", "file_url": "/attachments/equipment_catalog.pdf", "uploaded_at": "2025-02-26T08:00:00Z"},
    {"file_name": "safety_requirements.pdf", "file_size": 345678, "file_type": "application/pdf", "file_url": "/attachments/safety_requirements.pdf", "uploaded_at": "2025-02-26T08:30:00Z"},
    {"file_name": "vendor_quote.pdf", "file_size": 234567, "file_type": "application/pdf", "file_url": "/attachments/vendor_quote.pdf", "uploaded_at": "2025-02-26T09:00:00Z"}
  ]'::jsonb,
  delivery_location_data = '{"address": "Operations HQ, Jl. MT Haryono", "city": "Jakarta Timur", "province": "DKI Jakarta", "postal_code": "13630", "contact_person": "Agus Setiawan", "contact_phone": "+62-21-5557890"}'::jsonb,
  approval_chain = '[
    {"approver_id": "MGR-002", "approver_name": "Ir. Suryadi", "approver_role": "Department Manager", "status": "Approved", "action_date": "2025-02-28T09:45:00Z", "comments": "Approved - Safety equipment is mandatory for field operations compliance"},
    {"approver_id": "FIN-001", "approver_name": "Dra. Wulandari", "approver_role": "Finance Manager", "status": "Pending", "comments": ""}
  ]'::jsonb
WHERE pr_id = 110;

INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(110, 'PR-2025-00007', 0, 'USER-007', 'Dewi Lestari', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-02-26T10:00:00Z', 'Draft', 'Pending Approval'),
(110, 'PR-2025-00007', 1, 'MGR-002', 'Ir. Suryadi', 'Department Manager', 'Approved', 'Approved - Safety equipment is mandatory for field operations compliance', '2025-02-28T09:45:00Z', 'Pending Approval', 'Pending Approval');

-- ============================================================================
-- UPDATE PR-2025-00008: Medium Purchase - Fully Approved
-- ============================================================================

UPDATE fact_pr_header
SET 
  requestor_id = 'USER-008',
  requirement_date = '2025-03-20',
  pr_status = 'Approved',
  notes = 'Maintenance spare parts and consumables for Q1-Q2 operations',
  attachment_count = 2,
  attachment_metadata = '[
    {"file_name": "spare_parts_list.xlsx", "file_size": 234567, "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file_url": "/attachments/spare_parts_list.xlsx", "uploaded_at": "2025-03-05T08:00:00Z"},
    {"file_name": "vendor_contract.pdf", "file_size": 456789, "file_type": "application/pdf", "file_url": "/attachments/vendor_contract.pdf", "uploaded_at": "2025-03-05T08:30:00Z"}
  ]'::jsonb,
  delivery_location_data = '{"address": "Central Warehouse, Plant 1", "city": "Karawang", "province": "Jawa Barat", "postal_code": "41361", "contact_person": "Hadi Pranoto", "contact_phone": "+62-267-5555678"}'::jsonb,
  approval_chain = '[
    {"approver_id": "MGR-005", "approver_name": "Sri Mulyani", "approver_role": "Department Manager", "status": "Approved", "action_date": "2025-03-07T10:15:00Z", "comments": "Approved - Spare parts procurement is essential for maintenance schedule"},
    {"approver_id": "FIN-002", "approver_name": "Dr. Ahmad Yani", "approver_role": "Finance Manager", "status": "Approved", "action_date": "2025-03-09T14:30:00Z", "comments": "Approved - Budget allocation confirmed for maintenance operations"}
  ]'::jsonb
WHERE pr_id = 111;

INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(111, 'PR-2025-00008', 0, 'USER-008', 'Fajar Nugroho', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-03-05T09:00:00Z', 'Draft', 'Pending Approval'),
(111, 'PR-2025-00008', 1, 'MGR-005', 'Sri Mulyani', 'Department Manager', 'Approved', 'Approved - Spare parts procurement is essential for maintenance schedule', '2025-03-07T10:15:00Z', 'Pending Approval', 'Pending Approval'),
(111, 'PR-2025-00008', 2, 'FIN-002', 'Dr. Ahmad Yani', 'Finance Manager', 'Approved', 'Approved - Budget allocation confirmed for maintenance operations', '2025-03-09T14:30:00Z', 'Pending Approval', 'Approved');

-- ============================================================================
-- SUMMARY
-- ============================================================================

DO $$
DECLARE
  pr_count INTEGER;
  approval_count INTEGER;
  pending_count INTEGER;
  approved_count INTEGER;
  rejected_count INTEGER;
  draft_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO pr_count FROM fact_pr_header WHERE pr_id BETWEEN 104 AND 111;
  SELECT COUNT(*) INTO approval_count FROM fact_pr_approval_history WHERE pr_id BETWEEN 104 AND 111;
  SELECT COUNT(*) INTO pending_count FROM fact_pr_header WHERE pr_id BETWEEN 104 AND 111 AND pr_status = 'Pending Approval';
  SELECT COUNT(*) INTO approved_count FROM fact_pr_header WHERE pr_id BETWEEN 104 AND 111 AND pr_status = 'Approved';
  SELECT COUNT(*) INTO rejected_count FROM fact_pr_header WHERE pr_id BETWEEN 104 AND 111 AND pr_status = 'Rejected';
  SELECT COUNT(*) INTO draft_count FROM fact_pr_header WHERE pr_id BETWEEN 104 AND 111 AND pr_status = 'Draft';

  RAISE NOTICE '========================================';
  RAISE NOTICE 'PR Approval Workflow Mock Data Updated!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total PRs updated: %', pr_count;
  RAISE NOTICE 'Total approval history entries: %', approval_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Status Distribution:';
  RAISE NOTICE '  - Draft: %', draft_count;
  RAISE NOTICE '  - Pending Approval: %', pending_count;
  RAISE NOTICE '  - Approved: %', approved_count;
  RAISE NOTICE '  - Rejected: %', rejected_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Users can now see:';
  RAISE NOTICE '  ✓ Multi-step approval workflows';
  RAISE NOTICE '  ✓ Approval history with comments';
  RAISE NOTICE '  ✓ PRs at various approval stages';
  RAISE NOTICE '  ✓ Realistic Indonesian business context';
  RAISE NOTICE '========================================';
END $$;
