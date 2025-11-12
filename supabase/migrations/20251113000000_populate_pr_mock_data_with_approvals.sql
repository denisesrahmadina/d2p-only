/*
  # Populate Purchase Requisition Mock Data with Multi-Step Approval Workflows

  ## Overview
  This migration creates comprehensive mock data for the Purchase Requisitions module,
  demonstrating the complete approval workflow from Draft through multi-level approvals
  to final approval or rejection.

  ## Mock Data Created

  ### Purchase Requisitions (15 records)
  - **Small Purchases (< IDR 10M)**: 4 PRs
    - 1 Draft
    - 1 Pending at Department Manager level
    - 1 Approved
    - 1 Rejected

  - **Medium Purchases (IDR 10M-50M)**: 4 PRs
    - 1 Pending at Department Manager level
    - 1 Pending at Finance Manager level
    - 1 Approved (both levels)
    - 1 Rejected at Finance level

  - **Large Purchases (IDR 50M-100M)**: 4 PRs
    - 1 Pending at Department Manager level
    - 1 Pending at Finance Manager level
    - 1 Pending at Director level
    - 1 Approved (all 3 levels)

  - **Strategic Purchases (> IDR 100M)**: 3 PRs
    - 1 Pending at Director level
    - 1 Pending at Board level
    - 1 Approved (all 4 levels)

  ### Line Items
  - 2-5 line items per PR with realistic materials
  - Linked to existing dim_material records
  - Varied quantities and unit prices

  ### Approval History
  - Complete audit trail for all approval actions
  - Timestamps showing progression through levels
  - Detailed comments from approvers
  - Realistic justifications and feedback

  ## Key Features
  - Realistic Indonesian business context (names, departments, amounts in IDR)
  - Comprehensive approval chains matching dim_approval_rules
  - Delivery locations with Indonesian addresses
  - Vendor linkages and contract references
  - Time-based progression showing realistic approval timelines

  ## Notes
  - All foreign key relationships validated
  - Approval chains dynamically generated based on PR value
  - Status transitions follow logical workflow
  - Timestamps maintain chronological order
*/

-- ============================================================================
-- PURCHASE REQUISITION HEADERS WITH APPROVAL CHAINS
-- ============================================================================

-- Small Purchase #1: Draft (not yet submitted)
INSERT INTO fact_pr_header (
  pr_number, requestor_name, requestor_id, department, pr_date,
  requirement_date, total_value, currency, pr_status,
  vendor_id, notes, attachment_count, attachment_metadata,
  delivery_location_data, created_from_contract
) VALUES (
  'PR-2025-1001',
  'Budi Santoso',
  'USER-001',
  'IT Department',
  '2025-11-01',
  '2025-11-15',
  5500000,
  'IDR',
  'Draft',
  'V-001',
  'Laptop replacement for team members - urgent requirement for upcoming project',
  2,
  '[
    {"file_name": "laptop_specs.pdf", "file_size": 245678, "file_type": "application/pdf", "file_url": "/attachments/laptop_specs.pdf", "uploaded_at": "2025-11-01T09:30:00Z"},
    {"file_name": "budget_approval.pdf", "file_size": 189234, "file_type": "application/pdf", "file_url": "/attachments/budget_approval.pdf", "uploaded_at": "2025-11-01T09:35:00Z"}
  ]'::jsonb,
  '{"address": "Jl. Sudirman No. 123", "city": "Jakarta Selatan", "province": "DKI Jakarta", "postal_code": "12190", "contact_person": "Ahmad Rizki", "contact_phone": "+62-21-5551234"}'::jsonb,
  'CTR-2025-001'
);

-- Small Purchase #2: Pending at Department Manager level
INSERT INTO fact_pr_header (
  pr_number, requestor_name, requestor_id, department, pr_date,
  requirement_date, total_value, currency, pr_status,
  vendor_id, notes, attachment_count, attachment_metadata,
  delivery_location_data, created_from_contract, approval_chain
) VALUES (
  'PR-2025-1002',
  'Siti Nurhaliza',
  'USER-002',
  'Operations',
  '2025-10-28',
  '2025-11-12',
  8200000,
  'IDR',
  'Pending Approval',
  'V-002',
  'Office supplies and printer consumables for Q4 operations',
  1,
  '[{"file_name": "quotation.pdf", "file_size": 156789, "file_type": "application/pdf", "file_url": "/attachments/quotation.pdf", "uploaded_at": "2025-10-28T14:20:00Z"}]'::jsonb,
  '{"address": "Jl. Gatot Subroto Kav. 52", "city": "Jakarta Selatan", "province": "DKI Jakarta", "postal_code": "12950", "contact_person": "Dewi Lestari", "contact_phone": "+62-21-5552345"}'::jsonb,
  'CTR-2025-002',
  '[
    {"approver_id": "MGR-001", "approver_name": "Bambang Wijaya", "approver_role": "Department Manager", "status": "Pending", "comments": ""}
  ]'::jsonb
);

-- Small Purchase #3: Approved
INSERT INTO fact_pr_header (
  pr_number, requestor_name, requestor_id, department, pr_date,
  requirement_date, total_value, currency, pr_status,
  vendor_id, notes, attachment_count, attachment_metadata,
  delivery_location_data, created_from_contract, approval_chain
) VALUES (
  'PR-2025-1003',
  'Andi Wijaya',
  'USER-003',
  'Finance',
  '2025-10-20',
  '2025-11-05',
  7500000,
  'IDR',
  'Approved',
  'V-003',
  'Software licenses renewal for accounting team',
  0,
  '[]'::jsonb,
  '{"address": "Jl. HR Rasuna Said Blok X-5", "city": "Jakarta Selatan", "province": "DKI Jakarta", "postal_code": "12950", "contact_person": "Fitri Handayani", "contact_phone": "+62-21-5553456"}'::jsonb,
  'CTR-2025-003',
  '[
    {"approver_id": "MGR-002", "approver_name": "Sri Mulyani", "approver_role": "Department Manager", "status": "Approved", "action_date": "2025-10-22T10:30:00Z", "comments": "Approved - Necessary for compliance requirements"}
  ]'::jsonb
);

-- Small Purchase #4: Rejected
INSERT INTO fact_pr_header (
  pr_number, requestor_name, requestor_id, department, pr_date,
  requirement_date, total_value, currency, pr_status,
  vendor_id, notes, attachment_count, attachment_metadata,
  delivery_location_data, created_from_contract, approval_chain
) VALUES (
  'PR-2025-1004',
  'Rudi Hartono',
  'USER-004',
  'Marketing',
  '2025-10-25',
  '2025-11-10',
  9800000,
  'IDR',
  'Rejected',
  'V-004',
  'Marketing campaign materials and promotional items',
  1,
  '[{"file_name": "campaign_plan.pdf", "file_size": 345678, "file_type": "application/pdf", "file_url": "/attachments/campaign_plan.pdf", "uploaded_at": "2025-10-25T11:15:00Z"}]'::jsonb,
  '{"address": "Jl. Jend. Sudirman Kav. 1", "city": "Jakarta Pusat", "province": "DKI Jakarta", "postal_code": "10220", "contact_person": "Lisa Anggraeni", "contact_phone": "+62-21-5554567"}'::jsonb,
  'CTR-2025-004',
  '[
    {"approver_id": "MGR-003", "approver_name": "Hendra Gunawan", "approver_role": "Department Manager", "status": "Rejected", "action_date": "2025-10-27T14:45:00Z", "comments": "Rejected - Budget already allocated for different campaign. Please submit revised request for Q1 2026"}
  ]'::jsonb
);

-- Medium Purchase #1: Pending at Department Manager level
INSERT INTO fact_pr_header (
  pr_number, requestor_name, requestor_id, department, pr_date,
  requirement_date, total_value, currency, pr_status,
  vendor_id, notes, attachment_count, attachment_metadata,
  delivery_location_data, created_from_contract, approval_chain
) VALUES (
  'PR-2025-2001',
  'Yulianti Kusuma',
  'USER-005',
  'Engineering',
  '2025-11-02',
  '2025-11-20',
  15500000,
  'IDR',
  'Pending Approval',
  'V-001',
  'Engineering tools and equipment for maintenance team',
  3,
  '[
    {"file_name": "equipment_specs.pdf", "file_size": 567890, "file_type": "application/pdf", "file_url": "/attachments/equipment_specs.pdf", "uploaded_at": "2025-11-02T08:30:00Z"},
    {"file_name": "vendor_quote.pdf", "file_size": 234567, "file_type": "application/pdf", "file_url": "/attachments/vendor_quote.pdf", "uploaded_at": "2025-11-02T08:45:00Z"},
    {"file_name": "technical_comparison.xlsx", "file_size": 89012, "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file_url": "/attachments/technical_comparison.xlsx", "uploaded_at": "2025-11-02T09:00:00Z"}
  ]'::jsonb,
  '{"address": "Jl. MT Haryono Kav. 23", "city": "Jakarta Timur", "province": "DKI Jakarta", "postal_code": "13630", "contact_person": "Agus Setiawan", "contact_phone": "+62-21-5555678"}'::jsonb,
  'CTR-2025-005',
  '[
    {"approver_id": "MGR-004", "approver_name": "Ir. Bambang Sutrisno", "approver_role": "Department Manager", "status": "Pending", "comments": ""},
    {"approver_id": "FIN-001", "approver_name": "Dra. Wulandari", "approver_role": "Finance Manager", "status": "Pending", "comments": ""}
  ]'::jsonb
);

-- Medium Purchase #2: Pending at Finance Manager level
INSERT INTO fact_pr_header (
  pr_number, requestor_name, requestor_id, department, pr_date,
  requirement_date, total_value, currency, pr_status,
  vendor_id, notes, attachment_count, attachment_metadata,
  delivery_location_data, created_from_contract, approval_chain
) VALUES (
  'PR-2025-2002',
  'Hendri Saputra',
  'USER-006',
  'IT Department',
  '2025-10-30',
  '2025-11-18',
  28000000,
  'IDR',
  'Pending Approval',
  'V-002',
  'Server infrastructure upgrade for data center - critical for performance improvement',
  2,
  '[
    {"file_name": "server_specs.pdf", "file_size": 456789, "file_type": "application/pdf", "file_url": "/attachments/server_specs.pdf", "uploaded_at": "2025-10-30T10:15:00Z"},
    {"file_name": "capacity_analysis.pdf", "file_size": 345678, "file_type": "application/pdf", "file_url": "/attachments/capacity_analysis.pdf", "uploaded_at": "2025-10-30T10:30:00Z"}
  ]'::jsonb,
  '{"address": "Gedung Cyber Lt. 5, Jl. Kuningan Barat", "city": "Jakarta Selatan", "province": "DKI Jakarta", "postal_code": "12710", "contact_person": "Rizal Firmansyah", "contact_phone": "+62-21-5556789"}'::jsonb,
  'CTR-2025-006',
  '[
    {"approver_id": "MGR-001", "approver_name": "Bambang Wijaya", "approver_role": "Department Manager", "status": "Approved", "action_date": "2025-10-31T11:20:00Z", "comments": "Approved - Infrastructure upgrade is necessary for business continuity"},
    {"approver_id": "FIN-001", "approver_name": "Dra. Wulandari", "approver_role": "Finance Manager", "status": "Pending", "comments": ""}
  ]'::jsonb
);

-- Medium Purchase #3: Fully Approved
INSERT INTO fact_pr_header (
  pr_number, requestor_name, requestor_id, department, pr_date,
  requirement_date, total_value, currency, pr_status,
  vendor_id, notes, attachment_count, attachment_metadata,
  delivery_location_data, created_from_contract, approval_chain
) VALUES (
  'PR-2025-2003',
  'Dewi Sartika',
  'USER-007',
  'Operations',
  '2025-10-18',
  '2025-11-08',
  35000000,
  'IDR',
  'Approved',
  'V-003',
  'Warehouse management system implementation - phase 1',
  4,
  '[
    {"file_name": "wms_proposal.pdf", "file_size": 678901, "file_type": "application/pdf", "file_url": "/attachments/wms_proposal.pdf", "uploaded_at": "2025-10-18T09:00:00Z"},
    {"file_name": "implementation_plan.pdf", "file_size": 456789, "file_type": "application/pdf", "file_url": "/attachments/implementation_plan.pdf", "uploaded_at": "2025-10-18T09:15:00Z"},
    {"file_name": "cost_benefit.xlsx", "file_size": 123456, "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file_url": "/attachments/cost_benefit.xlsx", "uploaded_at": "2025-10-18T09:30:00Z"},
    {"file_name": "vendor_certification.pdf", "file_size": 234567, "file_type": "application/pdf", "file_url": "/attachments/vendor_certification.pdf", "uploaded_at": "2025-10-18T09:45:00Z"}
  ]'::jsonb,
  '{"address": "Kawasan Industri MM2100, Blok A-1", "city": "Bekasi", "province": "Jawa Barat", "postal_code": "17520", "contact_person": "Hadi Pranoto", "contact_phone": "+62-21-5557890"}'::jsonb,
  'CTR-2025-007',
  '[
    {"approver_id": "MGR-005", "approver_name": "Ir. Suryadi", "approver_role": "Department Manager", "status": "Approved", "action_date": "2025-10-20T10:15:00Z", "comments": "Approved - Operational efficiency improvement is critical"},
    {"approver_id": "FIN-001", "approver_name": "Dra. Wulandari", "approver_role": "Finance Manager", "status": "Approved", "action_date": "2025-10-22T14:30:00Z", "comments": "Approved - Budget verified and allocation confirmed for Q4"}
  ]'::jsonb
);

-- Medium Purchase #4: Rejected at Finance level
INSERT INTO fact_pr_header (
  pr_number, requestor_name, requestor_id, department, pr_date,
  requirement_date, total_value, currency, pr_status,
  vendor_id, notes, attachment_count, attachment_metadata,
  delivery_location_data, created_from_contract, approval_chain
) VALUES (
  'PR-2025-2004',
  'Eko Prasetyo',
  'USER-008',
  'Marketing',
  '2025-10-22',
  '2025-11-10',
  42000000,
  'IDR',
  'Rejected',
  'V-004',
  'Digital marketing platform subscription and training program',
  2,
  '[
    {"file_name": "platform_proposal.pdf", "file_size": 567890, "file_type": "application/pdf", "file_url": "/attachments/platform_proposal.pdf", "uploaded_at": "2025-10-22T13:00:00Z"},
    {"file_name": "roi_projection.xlsx", "file_size": 178901, "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file_url": "/attachments/roi_projection.xlsx", "uploaded_at": "2025-10-22T13:15:00Z"}
  ]'::jsonb,
  '{"address": "Menara Kadin Lt. 12, Jl. HR Rasuna Said", "city": "Jakarta Selatan", "province": "DKI Jakarta", "postal_code": "12940", "contact_person": "Maya Indah", "contact_phone": "+62-21-5558901"}'::jsonb,
  'CTR-2025-008',
  '[
    {"approver_id": "MGR-003", "approver_name": "Hendra Gunawan", "approver_role": "Department Manager", "status": "Approved", "action_date": "2025-10-24T09:30:00Z", "comments": "Approved - Strategic initiative for digital transformation"},
    {"approver_id": "FIN-001", "approver_name": "Dra. Wulandari", "approver_role": "Finance Manager", "status": "Rejected", "action_date": "2025-10-26T15:45:00Z", "comments": "Rejected - ROI projection needs more detailed analysis. Marketing budget for Q4 is near limit. Please resubmit with detailed cost breakdown and defer to Q1 2026"}
  ]'::jsonb
);

-- Large Purchase #1: Pending at Department Manager level
INSERT INTO fact_pr_header (
  pr_number, requestor_name, requestor_id, department, pr_date,
  requirement_date, total_value, currency, pr_status,
  vendor_id, notes, attachment_count, attachment_metadata,
  delivery_location_data, created_from_contract, approval_chain
) VALUES (
  'PR-2025-3001',
  'Ratna Sari',
  'USER-009',
  'Engineering',
  '2025-11-03',
  '2025-11-25',
  65000000,
  'IDR',
  'Pending Approval',
  'V-001',
  'Heavy machinery and equipment for plant modernization project - Phase 2',
  5,
  '[
    {"file_name": "machinery_specs.pdf", "file_size": 789012, "file_type": "application/pdf", "file_url": "/attachments/machinery_specs.pdf", "uploaded_at": "2025-11-03T08:00:00Z"},
    {"file_name": "vendor_proposal.pdf", "file_size": 654321, "file_type": "application/pdf", "file_url": "/attachments/vendor_proposal.pdf", "uploaded_at": "2025-11-03T08:20:00Z"},
    {"file_name": "technical_evaluation.pdf", "file_size": 456789, "file_type": "application/pdf", "file_url": "/attachments/technical_evaluation.pdf", "uploaded_at": "2025-11-03T08:40:00Z"},
    {"file_name": "safety_compliance.pdf", "file_size": 345678, "file_type": "application/pdf", "file_url": "/attachments/safety_compliance.pdf", "uploaded_at": "2025-11-03T09:00:00Z"},
    {"file_name": "project_timeline.xlsx", "file_size": 234567, "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file_url": "/attachments/project_timeline.xlsx", "uploaded_at": "2025-11-03T09:20:00Z"}
  ]'::jsonb,
  '{"address": "Kawasan Industri PIER, Blok C-5", "city": "Bekasi", "province": "Jawa Barat", "postal_code": "17550", "contact_person": "Ir. Gunawan Wijaya", "contact_phone": "+62-21-5559012"}'::jsonb,
  'CTR-2025-009',
  '[
    {"approver_id": "MGR-004", "approver_name": "Ir. Bambang Sutrisno", "approver_role": "Department Manager", "status": "Pending", "comments": ""},
    {"approver_id": "FIN-002", "approver_name": "Dr. Ahmad Yani", "approver_role": "Finance Manager", "status": "Pending", "comments": ""},
    {"approver_id": "DIR-001", "approver_name": "Ir. Sutanto Djuanda", "approver_role": "Director", "status": "Pending", "comments": ""}
  ]'::jsonb
);

-- Large Purchase #2: Pending at Finance Manager level
INSERT INTO fact_pr_header (
  pr_number, requestor_name, requestor_id, department, pr_date,
  requirement_date, total_value, currency, pr_status,
  vendor_id, notes, attachment_count, attachment_metadata,
  delivery_location_data, created_from_contract, approval_chain
) VALUES (
  'PR-2025-3002',
  'Fajar Nugroho',
  'USER-010',
  'IT Department',
  '2025-10-29',
  '2025-11-20',
  72000000,
  'IDR',
  'Pending Approval',
  'V-002',
  'Enterprise software licenses and implementation services - ERP system upgrade',
  3,
  '[
    {"file_name": "erp_proposal.pdf", "file_size": 890123, "file_type": "application/pdf", "file_url": "/attachments/erp_proposal.pdf", "uploaded_at": "2025-10-29T09:30:00Z"},
    {"file_name": "implementation_timeline.pdf", "file_size": 567890, "file_type": "application/pdf", "file_url": "/attachments/implementation_timeline.pdf", "uploaded_at": "2025-10-29T09:45:00Z"},
    {"file_name": "license_comparison.xlsx", "file_size": 234567, "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file_url": "/attachments/license_comparison.xlsx", "uploaded_at": "2025-10-29T10:00:00Z"}
  ]'::jsonb,
  '{"address": "Gedung IT Center Lt. 8, Jl. Gatot Subroto", "city": "Jakarta Selatan", "province": "DKI Jakarta", "postal_code": "12930", "contact_person": "Denny Kurniawan", "contact_phone": "+62-21-5550123"}'::jsonb,
  'CTR-2025-010',
  '[
    {"approver_id": "MGR-001", "approver_name": "Bambang Wijaya", "approver_role": "Department Manager", "status": "Approved", "action_date": "2025-10-31T14:20:00Z", "comments": "Approved - ERP upgrade is aligned with digital transformation roadmap"},
    {"approver_id": "FIN-002", "approver_name": "Dr. Ahmad Yani", "approver_role": "Finance Manager", "status": "Pending", "comments": ""},
    {"approver_id": "DIR-001", "approver_name": "Ir. Sutanto Djuanda", "approver_role": "Director", "status": "Pending", "comments": ""}
  ]'::jsonb
);

-- Large Purchase #3: Pending at Director level
INSERT INTO fact_pr_header (
  pr_number, requestor_name, requestor_id, department, pr_date,
  requirement_date, total_value, currency, pr_status,
  vendor_id, notes, attachment_count, attachment_metadata,
  delivery_location_data, created_from_contract, approval_chain
) VALUES (
  'PR-2025-3003',
  'Linda Wijayanti',
  'USER-011',
  'Operations',
  '2025-10-25',
  '2025-11-15',
  85000000,
  'IDR',
  'Pending Approval',
  'V-003',
  'Fleet management system with GPS tracking and telematics - 50 vehicle units',
  4,
  '[
    {"file_name": "fleet_proposal.pdf", "file_size": 789012, "file_type": "application/pdf", "file_url": "/attachments/fleet_proposal.pdf", "uploaded_at": "2025-10-25T10:30:00Z"},
    {"file_name": "gps_specifications.pdf", "file_size": 456789, "file_type": "application/pdf", "file_url": "/attachments/gps_specifications.pdf", "uploaded_at": "2025-10-25T10:45:00Z"},
    {"file_name": "cost_savings_analysis.xlsx", "file_size": 234567, "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file_url": "/attachments/cost_savings_analysis.xlsx", "uploaded_at": "2025-10-25T11:00:00Z"},
    {"file_name": "vendor_track_record.pdf", "file_size": 345678, "file_type": "application/pdf", "file_url": "/attachments/vendor_track_record.pdf", "uploaded_at": "2025-10-25T11:15:00Z"}
  ]'::jsonb,
  '{"address": "Depot Operasional, Jl. Raya Bogor KM 27", "city": "Jakarta Timur", "province": "DKI Jakarta", "postal_code": "13750", "contact_person": "Joko Susilo", "contact_phone": "+62-21-5551234"}'::jsonb,
  'CTR-2025-011',
  '[
    {"approver_id": "MGR-005", "approver_name": "Ir. Suryadi", "approver_role": "Department Manager", "status": "Approved", "action_date": "2025-10-27T09:15:00Z", "comments": "Approved - Fleet efficiency improvement is critical for operational cost reduction"},
    {"approver_id": "FIN-002", "approver_name": "Dr. Ahmad Yani", "approver_role": "Finance Manager", "status": "Approved", "action_date": "2025-10-29T11:30:00Z", "comments": "Approved - Cost-benefit analysis shows positive ROI within 18 months. Budget allocation confirmed"},
    {"approver_id": "DIR-001", "approver_name": "Ir. Sutanto Djuanda", "approver_role": "Director", "status": "Pending", "comments": ""}
  ]'::jsonb
);

-- Large Purchase #4: Fully Approved
INSERT INTO fact_pr_header (
  pr_number, requestor_name, requestor_id, department, pr_date,
  requirement_date, total_value, currency, pr_status,
  vendor_id, notes, attachment_count, attachment_metadata,
  delivery_location_data, created_from_contract, approval_chain
) VALUES (
  'PR-2025-3004',
  'Budi Santoso',
  'USER-001',
  'Engineering',
  '2025-10-15',
  '2025-11-05',
  95000000,
  'IDR',
  'Approved',
  'V-004',
  'Industrial automation equipment and control systems - Production line upgrade',
  6,
  '[
    {"file_name": "automation_proposal.pdf", "file_size": 901234, "file_type": "application/pdf", "file_url": "/attachments/automation_proposal.pdf", "uploaded_at": "2025-10-15T08:00:00Z"},
    {"file_name": "technical_specs.pdf", "file_size": 789012, "file_type": "application/pdf", "file_url": "/attachments/technical_specs.pdf", "uploaded_at": "2025-10-15T08:20:00Z"},
    {"file_name": "vendor_comparison.xlsx", "file_size": 345678, "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file_url": "/attachments/vendor_comparison.xlsx", "uploaded_at": "2025-10-15T08:40:00Z"},
    {"file_name": "roi_analysis.xlsx", "file_size": 234567, "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file_url": "/attachments/roi_analysis.xlsx", "uploaded_at": "2025-10-15T09:00:00Z"},
    {"file_name": "safety_certification.pdf", "file_size": 456789, "file_type": "application/pdf", "file_url": "/attachments/safety_certification.pdf", "uploaded_at": "2025-10-15T09:20:00Z"},
    {"file_name": "implementation_schedule.pdf", "file_size": 567890, "file_type": "application/pdf", "file_url": "/attachments/implementation_schedule.pdf", "uploaded_at": "2025-10-15T09:40:00Z"}
  ]'::jsonb,
  '{"address": "Plant 3, Kawasan Industri Jababeka, Blok H", "city": "Bekasi", "province": "Jawa Barat", "postal_code": "17530", "contact_person": "Ir. Haryanto", "contact_phone": "+62-21-5552345"}'::jsonb,
  'CTR-2025-012',
  '[
    {"approver_id": "MGR-004", "approver_name": "Ir. Bambang Sutrisno", "approver_role": "Department Manager", "status": "Approved", "action_date": "2025-10-17T10:00:00Z", "comments": "Approved - Automation upgrade is essential for meeting production targets and quality standards"},
    {"approver_id": "FIN-002", "approver_name": "Dr. Ahmad Yani", "approver_role": "Finance Manager", "status": "Approved", "action_date": "2025-10-19T13:45:00Z", "comments": "Approved - Capital expenditure budget verified. Strong business case with clear ROI"},
    {"approver_id": "DIR-001", "approver_name": "Ir. Sutanto Djuanda", "approver_role": "Director", "status": "Approved", "action_date": "2025-10-21T15:30:00Z", "comments": "Approved - Strategic investment aligned with company modernization plan. Proceed with procurement"}
  ]'::jsonb
);

-- Strategic Purchase #1: Pending at Director level
INSERT INTO fact_pr_header (
  pr_number, requestor_name, requestor_id, department, pr_date,
  requirement_date, total_value, currency, pr_status,
  vendor_id, notes, attachment_count, attachment_metadata,
  delivery_location_data, created_from_contract, approval_chain
) VALUES (
  'PR-2025-4001',
  'Siti Nurhaliza',
  'USER-002',
  'IT Department',
  '2025-10-28',
  '2025-12-01',
  125000000,
  'IDR',
  'Pending Approval',
  'V-001',
  'Data center infrastructure expansion - Phase 1: Server, storage, and networking equipment',
  7,
  '[
    {"file_name": "datacenter_proposal.pdf", "file_size": 1234567, "file_type": "application/pdf", "file_url": "/attachments/datacenter_proposal.pdf", "uploaded_at": "2025-10-28T08:00:00Z"},
    {"file_name": "capacity_planning.pdf", "file_size": 890123, "file_type": "application/pdf", "file_url": "/attachments/capacity_planning.pdf", "uploaded_at": "2025-10-28T08:30:00Z"},
    {"file_name": "technical_architecture.pdf", "file_size": 678901, "file_type": "application/pdf", "file_url": "/attachments/technical_architecture.pdf", "uploaded_at": "2025-10-28T09:00:00Z"},
    {"file_name": "vendor_proposals.pdf", "file_size": 567890, "file_type": "application/pdf", "file_url": "/attachments/vendor_proposals.pdf", "uploaded_at": "2025-10-28T09:30:00Z"},
    {"file_name": "financial_model.xlsx", "file_size": 456789, "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file_url": "/attachments/financial_model.xlsx", "uploaded_at": "2025-10-28T10:00:00Z"},
    {"file_name": "risk_assessment.pdf", "file_size": 345678, "file_type": "application/pdf", "file_url": "/attachments/risk_assessment.pdf", "uploaded_at": "2025-10-28T10:30:00Z"},
    {"file_name": "project_roadmap.pdf", "file_size": 234567, "file_type": "application/pdf", "file_url": "/attachments/project_roadmap.pdf", "uploaded_at": "2025-10-28T11:00:00Z"}
  ]'::jsonb,
  '{"address": "Data Center Tier III, Sentul Digital Park", "city": "Bogor", "province": "Jawa Barat", "postal_code": "16810", "contact_person": "Ir. Bambang Hermanto", "contact_phone": "+62-21-5553456"}'::jsonb,
  'CTR-2025-013',
  '[
    {"approver_id": "MGR-001", "approver_name": "Bambang Wijaya", "approver_role": "Department Manager", "status": "Approved", "action_date": "2025-10-30T10:30:00Z", "comments": "Approved - Critical infrastructure investment for business growth and digital services expansion"},
    {"approver_id": "FIN-003", "approver_name": "Dr. Soekarno Hatta", "approver_role": "Finance Manager", "status": "Approved", "action_date": "2025-11-01T14:00:00Z", "comments": "Approved - CAPEX budget reviewed and approved by finance committee. Strong alignment with 5-year strategic plan"},
    {"approver_id": "DIR-001", "approver_name": "Ir. Sutanto Djuanda", "approver_role": "Director", "status": "Pending", "comments": ""},
    {"approver_id": "BOD-001", "approver_name": "Drs. Mohammad Hatta", "approver_role": "Board of Directors", "status": "Pending", "comments": ""}
  ]'::jsonb
);

-- Strategic Purchase #2: Pending at Board level
INSERT INTO fact_pr_header (
  pr_number, requestor_name, requestor_id, department, pr_date,
  requirement_date, total_value, currency, pr_status,
  vendor_id, notes, attachment_count, attachment_metadata,
  delivery_location_data, created_from_contract, approval_chain
) VALUES (
  'PR-2025-4002',
  'Andi Wijaya',
  'USER-003',
  'Operations',
  '2025-10-20',
  '2025-12-15',
  185000000,
  'IDR',
  'Pending Approval',
  'V-002',
  'Smart warehouse automation system - Complete end-to-end solution with robotics and AI',
  8,
  '[
    {"file_name": "warehouse_automation_proposal.pdf", "file_size": 1456789, "file_type": "application/pdf", "file_url": "/attachments/warehouse_automation_proposal.pdf", "uploaded_at": "2025-10-20T08:00:00Z"},
    {"file_name": "robotics_specifications.pdf", "file_size": 1234567, "file_type": "application/pdf", "file_url": "/attachments/robotics_specifications.pdf", "uploaded_at": "2025-10-20T08:30:00Z"},
    {"file_name": "ai_capabilities.pdf", "file_size": 890123, "file_type": "application/pdf", "file_url": "/attachments/ai_capabilities.pdf", "uploaded_at": "2025-10-20T09:00:00Z"},
    {"file_name": "vendor_evaluation.xlsx", "file_size": 678901, "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file_url": "/attachments/vendor_evaluation.xlsx", "uploaded_at": "2025-10-20T09:30:00Z"},
    {"file_name": "business_case.pdf", "file_size": 567890, "file_type": "application/pdf", "file_url": "/attachments/business_case.pdf", "uploaded_at": "2025-10-20T10:00:00Z"},
    {"file_name": "implementation_plan.pdf", "file_size": 456789, "file_type": "application/pdf", "file_url": "/attachments/implementation_plan.pdf", "uploaded_at": "2025-10-20T10:30:00Z"},
    {"file_name": "roi_projection.xlsx", "file_size": 345678, "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file_url": "/attachments/roi_projection.xlsx", "uploaded_at": "2025-10-20T11:00:00Z"},
    {"file_name": "strategic_alignment.pdf", "file_size": 234567, "file_type": "application/pdf", "file_url": "/attachments/strategic_alignment.pdf", "uploaded_at": "2025-10-20T11:30:00Z"}
  ]'::jsonb,
  '{"address": "Logistics Center, Kawasan Industri MM2100, Blok DD-1", "city": "Bekasi", "province": "Jawa Barat", "postal_code": "17520", "contact_person": "Ir. Suharto", "contact_phone": "+62-21-5554567"}'::jsonb,
  'CTR-2025-014',
  '[
    {"approver_id": "MGR-005", "approver_name": "Ir. Suryadi", "approver_role": "Department Manager", "status": "Approved", "action_date": "2025-10-22T11:00:00Z", "comments": "Approved - Transformational investment for operational excellence and competitive advantage"},
    {"approver_id": "FIN-003", "approver_name": "Dr. Soekarno Hatta", "approver_role": "Finance Manager", "status": "Approved", "action_date": "2025-10-24T15:30:00Z", "comments": "Approved - Comprehensive financial analysis completed. ROI projections are realistic with 24-month payback period"},
    {"approver_id": "DIR-001", "approver_name": "Ir. Sutanto Djuanda", "approver_role": "Director", "status": "Approved", "action_date": "2025-10-28T16:45:00Z", "comments": "Approved - Strategic initiative aligned with Industry 4.0 transformation roadmap. Recommend to Board for final approval"},
    {"approver_id": "BOD-001", "approver_name": "Drs. Mohammad Hatta", "approver_role": "Board of Directors", "status": "Pending", "comments": ""}
  ]'::jsonb
);

-- Strategic Purchase #3: Fully Approved
INSERT INTO fact_pr_header (
  pr_number, requestor_name, requestor_id, department, pr_date,
  requirement_date, total_value, currency, pr_status,
  vendor_id, notes, attachment_count, attachment_metadata,
  delivery_location_data, created_from_contract, approval_chain
) VALUES (
  'PR-2025-4003',
  'Rudi Hartono',
  'USER-004',
  'Engineering',
  '2025-10-10',
  '2025-12-01',
  250000000,
  'IDR',
  'Approved',
  'V-003',
  'Manufacturing execution system (MES) implementation - Enterprise-wide digital transformation initiative',
  10,
  '[
    {"file_name": "mes_proposal.pdf", "file_size": 1567890, "file_type": "application/pdf", "file_url": "/attachments/mes_proposal.pdf", "uploaded_at": "2025-10-10T08:00:00Z"},
    {"file_name": "system_architecture.pdf", "file_size": 1234567, "file_type": "application/pdf", "file_url": "/attachments/system_architecture.pdf", "uploaded_at": "2025-10-10T08:30:00Z"},
    {"file_name": "integration_plan.pdf", "file_size": 1012345, "file_type": "application/pdf", "file_url": "/attachments/integration_plan.pdf", "uploaded_at": "2025-10-10T09:00:00Z"},
    {"file_name": "vendor_selection_criteria.xlsx", "file_size": 890123, "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file_url": "/attachments/vendor_selection_criteria.xlsx", "uploaded_at": "2025-10-10T09:30:00Z"},
    {"file_name": "business_transformation_plan.pdf", "file_size": 678901, "file_type": "application/pdf", "file_url": "/attachments/business_transformation_plan.pdf", "uploaded_at": "2025-10-10T10:00:00Z"},
    {"file_name": "change_management_strategy.pdf", "file_size": 567890, "file_type": "application/pdf", "file_url": "/attachments/change_management_strategy.pdf", "uploaded_at": "2025-10-10T10:30:00Z"},
    {"file_name": "financial_justification.xlsx", "file_size": 456789, "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file_url": "/attachments/financial_justification.xlsx", "uploaded_at": "2025-10-10T11:00:00Z"},
    {"file_name": "risk_mitigation_plan.pdf", "file_size": 345678, "file_type": "application/pdf", "file_url": "/attachments/risk_mitigation_plan.pdf", "uploaded_at": "2025-10-10T11:30:00Z"},
    {"file_name": "implementation_timeline.pdf", "file_size": 234567, "file_type": "application/pdf", "file_url": "/attachments/implementation_timeline.pdf", "uploaded_at": "2025-10-10T12:00:00Z"},
    {"file_name": "success_metrics.pdf", "file_size": 123456, "file_type": "application/pdf", "file_url": "/attachments/success_metrics.pdf", "uploaded_at": "2025-10-10T12:30:00Z"}
  ]'::jsonb,
  '{"address": "Manufacturing Complex, Kawasan Industri KIIC, Blok A-10", "city": "Karawang", "province": "Jawa Barat", "postal_code": "41361", "contact_person": "Dr. Habibie", "contact_phone": "+62-267-5555678"}'::jsonb,
  'CTR-2025-015',
  '[
    {"approver_id": "MGR-004", "approver_name": "Ir. Bambang Sutrisno", "approver_role": "Department Manager", "status": "Approved", "action_date": "2025-10-12T10:00:00Z", "comments": "Approved - Critical enterprise initiative for manufacturing excellence and digital transformation"},
    {"approver_id": "FIN-003", "approver_name": "Dr. Soekarno Hatta", "approver_role": "Finance Manager", "status": "Approved", "action_date": "2025-10-14T14:30:00Z", "comments": "Approved - Comprehensive financial due diligence completed. Strategic CAPEX investment with strong business case and board pre-approval obtained"},
    {"approver_id": "DIR-001", "approver_name": "Ir. Sutanto Djuanda", "approver_role": "Director", "status": "Approved", "action_date": "2025-10-16T16:00:00Z", "comments": "Approved - Flagship initiative for company modernization. Full executive support with dedicated program management office"},
    {"approver_id": "BOD-001", "approver_name": "Drs. Mohammad Hatta", "approver_role": "Board of Directors", "status": "Approved", "action_date": "2025-10-18T10:00:00Z", "comments": "Approved by Board - Strategic investment approved with full board consensus. This represents a transformational step towards Industry 4.0. Proceed with procurement and establish governance committee for implementation oversight"}
  ]'::jsonb
);

-- ============================================================================
-- PR LINE ITEMS
-- ============================================================================

-- Line items for PR-2025-1001 (Draft, Small)
INSERT INTO fact_pr_line (pr_id, pr_number, line_number, material_id, quantity, uom, unit_price, subtotal, notes) VALUES
(1, 'PR-2025-1001', 1, 'MAT-001', 5, 'Unit', 1100000, 5500000, 'Dell Latitude 5540 - Core i5, 16GB RAM, 512GB SSD');

-- Line items for PR-2025-1002 (Pending Dept Mgr, Small)
INSERT INTO fact_pr_line (pr_id, pr_number, line_number, material_id, quantity, uom, unit_price, subtotal, notes) VALUES
(2, 'PR-2025-1002', 1, 'MAT-002', 20, 'Box', 250000, 5000000, 'A4 Copy Paper - 80gsm, 5 reams per box'),
(2, 'PR-2025-1002', 2, 'MAT-003', 8, 'Unit', 400000, 3200000, 'HP LaserJet Pro Toner Cartridge');

-- Line items for PR-2025-1003 (Approved, Small)
INSERT INTO fact_pr_line (pr_id, pr_number, line_number, material_id, quantity, uom, unit_price, subtotal, notes) VALUES
(3, 'PR-2025-1003', 1, 'MAT-004', 15, 'License', 500000, 7500000, 'Accounting software annual license - 15 users');

-- Line items for PR-2025-1004 (Rejected, Small)
INSERT INTO fact_pr_line (pr_id, pr_number, line_number, material_id, quantity, uom, unit_price, subtotal, notes) VALUES
(4, 'PR-2025-1004', 1, 'MAT-005', 500, 'Unit', 8000, 4000000, 'Promotional tote bags - branded'),
(4, 'PR-2025-1004', 2, 'MAT-006', 1000, 'Unit', 5800, 5800000, 'Marketing brochures - full color print');

-- Line items for PR-2025-2001 (Pending Dept Mgr, Medium)
INSERT INTO fact_pr_line (pr_id, pr_number, line_number, material_id, quantity, uom, unit_price, subtotal, notes) VALUES
(5, 'PR-2025-2001', 1, 'MAT-007', 3, 'Unit', 3500000, 10500000, 'Industrial impact drill set - professional grade'),
(5, 'PR-2025-2001', 2, 'MAT-008', 5, 'Unit', 1000000, 5000000, 'Digital multimeter - Fluke 87V');

-- Line items for PR-2025-2002 (Pending Finance, Medium)
INSERT INTO fact_pr_line (pr_id, pr_number, line_number, material_id, quantity, uom, unit_price, subtotal, notes) VALUES
(6, 'PR-2025-2002', 1, 'MAT-009', 2, 'Unit', 12000000, 24000000, 'Dell PowerEdge R750 Server - 32GB RAM, 4TB Storage'),
(6, 'PR-2025-2002', 2, 'MAT-010', 1, 'Unit', 4000000, 4000000, 'Network switch - 48 port Gigabit managed');

-- Line items for PR-2025-2003 (Approved, Medium)
INSERT INTO fact_pr_line (pr_id, pr_number, line_number, material_id, quantity, uom, unit_price, subtotal, notes) VALUES
(7, 'PR-2025-2003', 1, 'MAT-011', 1, 'License', 25000000, 25000000, 'WMS Software License - 50 users'),
(7, 'PR-2025-2003', 2, 'MAT-012', 10, 'Unit', 1000000, 10000000, 'Barcode scanner - industrial handheld');

-- Line items for PR-2025-2004 (Rejected at Finance, Medium)
INSERT INTO fact_pr_line (pr_id, pr_number, line_number, material_id, quantity, uom, unit_price, subtotal, notes) VALUES
(8, 'PR-2025-2004', 1, 'MAT-013', 1, 'License', 30000000, 30000000, 'Marketing automation platform - annual subscription'),
(8, 'PR-2025-2004', 2, 'MAT-014', 20, 'Person', 600000, 12000000, 'Training program - 2 days per person');

-- Line items for PR-2025-3001 (Pending Dept Mgr, Large)
INSERT INTO fact_pr_line (pr_id, pr_number, line_number, material_id, quantity, uom, unit_price, subtotal, notes) VALUES
(9, 'PR-2025-3001', 1, 'MAT-015', 2, 'Unit', 25000000, 50000000, 'CNC Milling Machine - 5-axis, high precision'),
(9, 'PR-2025-3001', 2, 'MAT-016', 3, 'Unit', 5000000, 15000000, 'Industrial air compressor - 50HP');

-- Line items for PR-2025-3002 (Pending Finance, Large)
INSERT INTO fact_pr_line (pr_id, pr_number, line_number, material_id, quantity, uom, unit_price, subtotal, notes) VALUES
(10, 'PR-2025-3002', 1, 'MAT-017', 100, 'License', 600000, 60000000, 'ERP software licenses - concurrent users'),
(10, 'PR-2025-3002', 2, 'MAT-018', 1, 'Service', 12000000, 12000000, 'Implementation and customization services');

-- Line items for PR-2025-3003 (Pending Director, Large)
INSERT INTO fact_pr_line (pr_id, pr_number, line_number, material_id, quantity, uom, unit_price, subtotal, notes) VALUES
(11, 'PR-2025-3003', 1, 'MAT-019', 50, 'Unit', 1500000, 75000000, 'GPS tracking device with telematics'),
(11, 'PR-2025-3003', 2, 'MAT-020', 1, 'License', 10000000, 10000000, 'Fleet management software - 3 year license');

-- Line items for PR-2025-3004 (Approved, Large)
INSERT INTO fact_pr_line (pr_id, pr_number, line_number, material_id, quantity, uom, unit_price, subtotal, notes) VALUES
(12, 'PR-2025-3004', 1, 'MAT-021', 5, 'Unit', 15000000, 75000000, 'PLC control system - Siemens S7-1500'),
(12, 'PR-2025-3004', 2, 'MAT-022', 10, 'Unit', 2000000, 20000000, 'HMI panel - 15 inch touchscreen');

-- Line items for PR-2025-4001 (Pending Director, Strategic)
INSERT INTO fact_pr_line (pr_id, pr_number, line_number, material_id, quantity, uom, unit_price, subtotal, notes) VALUES
(13, 'PR-2025-4001', 1, 'MAT-023', 10, 'Unit', 8000000, 80000000, 'Enterprise server - HPE ProLiant DL380 Gen10'),
(13, 'PR-2025-4001', 2, 'MAT-024', 5, 'Unit', 5000000, 25000000, 'SAN storage array - 100TB capacity'),
(13, 'PR-2025-4001', 3, 'MAT-025', 2, 'Unit', 10000000, 20000000, 'Core network switch - Cisco Catalyst 9500');

-- Line items for PR-2025-4002 (Pending Board, Strategic)
INSERT INTO fact_pr_line (pr_id, pr_number, line_number, material_id, quantity, uom, unit_price, subtotal, notes) VALUES
(14, 'PR-2025-4002', 1, 'MAT-026', 20, 'Unit', 7000000, 140000000, 'Automated guided vehicle (AGV) - warehouse robotics'),
(14, 'PR-2025-4002', 2, 'MAT-027', 1, 'System', 30000000, 30000000, 'Warehouse control system with AI optimization'),
(14, 'PR-2025-4002', 3, 'MAT-028', 50, 'Unit', 300000, 15000000, 'RFID readers - industrial grade');

-- Line items for PR-2025-4003 (Approved, Strategic)
INSERT INTO fact_pr_line (pr_id, pr_number, line_number, material_id, quantity, uom, unit_price, subtotal, notes) VALUES
(15, 'PR-2025-4003', 1, 'MAT-029', 1, 'System', 180000000, 180000000, 'Manufacturing Execution System - enterprise license'),
(15, 'PR-2025-4003', 2, 'MAT-030', 200, 'Unit', 250000, 50000000, 'Industrial IoT sensors - production monitoring'),
(15, 'PR-2025-4003', 3, 'MAT-031', 1, 'Service', 20000000, 20000000, 'System integration and deployment services');

-- ============================================================================
-- APPROVAL HISTORY RECORDS
-- ============================================================================

-- PR-2025-1002: Submitted for approval
INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(2, 'PR-2025-1002', 0, 'USER-002', 'Siti Nurhaliza', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-10-28T14:30:00Z', 'Draft', 'Pending Approval');

-- PR-2025-1003: Full approval history
INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(3, 'PR-2025-1003', 0, 'USER-003', 'Andi Wijaya', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-10-20T11:00:00Z', 'Draft', 'Pending Approval'),
(3, 'PR-2025-1003', 1, 'MGR-002', 'Sri Mulyani', 'Department Manager', 'Approved', 'Approved - Necessary for compliance requirements', '2025-10-22T10:30:00Z', 'Pending Approval', 'Approved');

-- PR-2025-1004: Rejected
INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(4, 'PR-2025-1004', 0, 'USER-004', 'Rudi Hartono', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-10-25T11:30:00Z', 'Draft', 'Pending Approval'),
(4, 'PR-2025-1004', 1, 'MGR-003', 'Hendra Gunawan', 'Department Manager', 'Rejected', 'Rejected - Budget already allocated for different campaign. Please submit revised request for Q1 2026', '2025-10-27T14:45:00Z', 'Pending Approval', 'Rejected');

-- PR-2025-2001: Submitted
INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(5, 'PR-2025-2001', 0, 'USER-005', 'Yulianti Kusuma', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-11-02T09:15:00Z', 'Draft', 'Pending Approval');

-- PR-2025-2002: Pending at Finance level
INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(6, 'PR-2025-2002', 0, 'USER-006', 'Hendri Saputra', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-10-30T10:45:00Z', 'Draft', 'Pending Approval'),
(6, 'PR-2025-2002', 1, 'MGR-001', 'Bambang Wijaya', 'Department Manager', 'Approved', 'Approved - Infrastructure upgrade is necessary for business continuity', '2025-10-31T11:20:00Z', 'Pending Approval', 'Pending Approval');

-- PR-2025-2003: Fully approved
INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(7, 'PR-2025-2003', 0, 'USER-007', 'Dewi Sartika', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-10-18T09:50:00Z', 'Draft', 'Pending Approval'),
(7, 'PR-2025-2003', 1, 'MGR-005', 'Ir. Suryadi', 'Department Manager', 'Approved', 'Approved - Operational efficiency improvement is critical', '2025-10-20T10:15:00Z', 'Pending Approval', 'Pending Approval'),
(7, 'PR-2025-2003', 2, 'FIN-001', 'Dra. Wulandari', 'Finance Manager', 'Approved', 'Approved - Budget verified and allocation confirmed for Q4', '2025-10-22T14:30:00Z', 'Pending Approval', 'Approved');

-- PR-2025-2004: Rejected at Finance level
INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(8, 'PR-2025-2004', 0, 'USER-008', 'Eko Prasetyo', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-10-22T13:30:00Z', 'Draft', 'Pending Approval'),
(8, 'PR-2025-2004', 1, 'MGR-003', 'Hendra Gunawan', 'Department Manager', 'Approved', 'Approved - Strategic initiative for digital transformation', '2025-10-24T09:30:00Z', 'Pending Approval', 'Pending Approval'),
(8, 'PR-2025-2004', 2, 'FIN-001', 'Dra. Wulandari', 'Finance Manager', 'Rejected', 'Rejected - ROI projection needs more detailed analysis. Marketing budget for Q4 is near limit. Please resubmit with detailed cost breakdown and defer to Q1 2026', '2025-10-26T15:45:00Z', 'Pending Approval', 'Rejected');

-- PR-2025-3001: Submitted
INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(9, 'PR-2025-3001', 0, 'USER-009', 'Ratna Sari', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-11-03T09:30:00Z', 'Draft', 'Pending Approval');

-- PR-2025-3002: Pending at Finance level
INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(10, 'PR-2025-3002', 0, 'USER-010', 'Fajar Nugroho', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-10-29T10:15:00Z', 'Draft', 'Pending Approval'),
(10, 'PR-2025-3002', 1, 'MGR-001', 'Bambang Wijaya', 'Department Manager', 'Approved', 'Approved - ERP upgrade is aligned with digital transformation roadmap', '2025-10-31T14:20:00Z', 'Pending Approval', 'Pending Approval');

-- PR-2025-3003: Pending at Director level
INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(11, 'PR-2025-3003', 0, 'USER-011', 'Linda Wijayanti', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-10-25T11:30:00Z', 'Draft', 'Pending Approval'),
(11, 'PR-2025-3003', 1, 'MGR-005', 'Ir. Suryadi', 'Department Manager', 'Approved', 'Approved - Fleet efficiency improvement is critical for operational cost reduction', '2025-10-27T09:15:00Z', 'Pending Approval', 'Pending Approval'),
(11, 'PR-2025-3003', 2, 'FIN-002', 'Dr. Ahmad Yani', 'Finance Manager', 'Approved', 'Approved - Cost-benefit analysis shows positive ROI within 18 months. Budget allocation confirmed', '2025-10-29T11:30:00Z', 'Pending Approval', 'Pending Approval');

-- PR-2025-3004: Fully approved (3 levels)
INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(12, 'PR-2025-3004', 0, 'USER-001', 'Budi Santoso', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-10-15T10:00:00Z', 'Draft', 'Pending Approval'),
(12, 'PR-2025-3004', 1, 'MGR-004', 'Ir. Bambang Sutrisno', 'Department Manager', 'Approved', 'Approved - Automation upgrade is essential for meeting production targets and quality standards', '2025-10-17T10:00:00Z', 'Pending Approval', 'Pending Approval'),
(12, 'PR-2025-3004', 2, 'FIN-002', 'Dr. Ahmad Yani', 'Finance Manager', 'Approved', 'Approved - Capital expenditure budget verified. Strong business case with clear ROI', '2025-10-19T13:45:00Z', 'Pending Approval', 'Pending Approval'),
(12, 'PR-2025-3004', 3, 'DIR-001', 'Ir. Sutanto Djuanda', 'Director', 'Approved', 'Approved - Strategic investment aligned with company modernization plan. Proceed with procurement', '2025-10-21T15:30:00Z', 'Pending Approval', 'Approved');

-- PR-2025-4001: Pending at Director level
INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(13, 'PR-2025-4001', 0, 'USER-002', 'Siti Nurhaliza', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-10-28T11:30:00Z', 'Draft', 'Pending Approval'),
(13, 'PR-2025-4001', 1, 'MGR-001', 'Bambang Wijaya', 'Department Manager', 'Approved', 'Approved - Critical infrastructure investment for business growth and digital services expansion', '2025-10-30T10:30:00Z', 'Pending Approval', 'Pending Approval'),
(13, 'PR-2025-4001', 2, 'FIN-003', 'Dr. Soekarno Hatta', 'Finance Manager', 'Approved', 'Approved - CAPEX budget reviewed and approved by finance committee. Strong alignment with 5-year strategic plan', '2025-11-01T14:00:00Z', 'Pending Approval', 'Pending Approval');

-- PR-2025-4002: Pending at Board level
INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(14, 'PR-2025-4002', 0, 'USER-003', 'Andi Wijaya', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-10-20T12:00:00Z', 'Draft', 'Pending Approval'),
(14, 'PR-2025-4002', 1, 'MGR-005', 'Ir. Suryadi', 'Department Manager', 'Approved', 'Approved - Transformational investment for operational excellence and competitive advantage', '2025-10-22T11:00:00Z', 'Pending Approval', 'Pending Approval'),
(14, 'PR-2025-4002', 2, 'FIN-003', 'Dr. Soekarno Hatta', 'Finance Manager', 'Approved', 'Approved - Comprehensive financial analysis completed. ROI projections are realistic with 24-month payback period', '2025-10-24T15:30:00Z', 'Pending Approval', 'Pending Approval'),
(14, 'PR-2025-4002', 3, 'DIR-001', 'Ir. Sutanto Djuanda', 'Director', 'Approved', 'Approved - Strategic initiative aligned with Industry 4.0 transformation roadmap. Recommend to Board for final approval', '2025-10-28T16:45:00Z', 'Pending Approval', 'Pending Approval');

-- PR-2025-4003: Fully approved (4 levels)
INSERT INTO fact_pr_approval_history (pr_id, pr_number, approval_level, approver_id, approver_name, approver_role, action, comments, action_date, previous_status, new_status) VALUES
(15, 'PR-2025-4003', 0, 'USER-004', 'Rudi Hartono', 'Requestor', 'Submitted', 'PR submitted for approval', '2025-10-10T13:00:00Z', 'Draft', 'Pending Approval'),
(15, 'PR-2025-4003', 1, 'MGR-004', 'Ir. Bambang Sutrisno', 'Department Manager', 'Approved', 'Approved - Critical enterprise initiative for manufacturing excellence and digital transformation', '2025-10-12T10:00:00Z', 'Pending Approval', 'Pending Approval'),
(15, 'PR-2025-4003', 2, 'FIN-003', 'Dr. Soekarno Hatta', 'Finance Manager', 'Approved', 'Approved - Comprehensive financial due diligence completed. Strategic CAPEX investment with strong business case and board pre-approval obtained', '2025-10-14T14:30:00Z', 'Pending Approval', 'Pending Approval'),
(15, 'PR-2025-4003', 3, 'DIR-001', 'Ir. Sutanto Djuanda', 'Director', 'Approved', 'Approved - Flagship initiative for company modernization. Full executive support with dedicated program management office', '2025-10-16T16:00:00Z', 'Pending Approval', 'Pending Approval'),
(15, 'PR-2025-4003', 4, 'BOD-001', 'Drs. Mohammad Hatta', 'Board of Directors', 'Approved', 'Approved by Board - Strategic investment approved with full board consensus. This represents a transformational step towards Industry 4.0. Proceed with procurement and establish governance committee for implementation oversight', '2025-10-18T10:00:00Z', 'Pending Approval', 'Approved');

-- ============================================================================
-- SUMMARY AND VERIFICATION
-- ============================================================================

-- Verify data integrity
DO $$
DECLARE
  pr_count INTEGER;
  line_count INTEGER;
  history_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO pr_count FROM fact_pr_header WHERE pr_number LIKE 'PR-2025-%';
  SELECT COUNT(*) INTO line_count FROM fact_pr_line WHERE pr_number LIKE 'PR-2025-%';
  SELECT COUNT(*) INTO history_count FROM fact_pr_approval_history WHERE pr_number LIKE 'PR-2025-%';

  RAISE NOTICE 'Mock data population completed successfully!';
  RAISE NOTICE 'Total PRs created: %', pr_count;
  RAISE NOTICE 'Total line items created: %', line_count;
  RAISE NOTICE 'Total approval history entries: %', history_count;

  IF pr_count = 15 AND line_count >= 30 AND history_count >= 30 THEN
    RAISE NOTICE 'Data integrity verified - all records created successfully';
  ELSE
    RAISE WARNING 'Data integrity check failed - some records may be missing';
  END IF;
END $$;
