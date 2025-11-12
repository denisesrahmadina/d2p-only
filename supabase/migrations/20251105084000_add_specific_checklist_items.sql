/*
  # Add Specific Checklist Items for Step 3

  1. Purpose
    - Add predefined checklist items for demonstration:
      - Completed Items: Compliance Review, Budget Verification
      - Incomplete Items: Tender Document, Vendor Shortlist Verification

  2. Changes
    - Insert 4 specific checklist items with detailed metadata
    - Set proper status, priority, and action types for each item
    - Include document details for completed items

  3. Security
    - Maintains existing RLS policies
    - No changes to table structure
*/

-- Insert Compliance Review (Completed)
INSERT INTO fact_procurement_checklist (
  id,
  sourcing_event_id,
  item_name,
  description,
  status,
  priority,
  item_type,
  ai_rationale,
  completion_date,
  completed_by,
  file_name,
  document_summary,
  ai_generated,
  action_type,
  organization_id
) VALUES (
  gen_random_uuid(),
  'SRC-2025-001',
  'Compliance Review',
  'Verify compliance with procurement policies and regulations.',
  'Completed',
  'High',
  'Document',
  'Compliance review is essential to ensure all procurement activities adhere to organizational policies, industry regulations, and legal requirements.',
  NOW() - INTERVAL '2 days',
  'Andi Wijaya (Procurement Manager)',
  'Compliance_Report_2025.pdf',
  'Comprehensive compliance review document covering all regulatory requirements, procurement policies, and legal frameworks. Document includes verification of anti-corruption measures, competitive bidding processes, and vendor qualification standards.',
  false,
  'view_edit',
  'indonesia-power'
) ON CONFLICT DO NOTHING;

-- Insert Budget Verification (Completed)
INSERT INTO fact_procurement_checklist (
  id,
  sourcing_event_id,
  item_name,
  description,
  status,
  priority,
  item_type,
  ai_rationale,
  completion_date,
  completed_by,
  file_name,
  document_summary,
  ai_generated,
  action_type,
  organization_id
) VALUES (
  gen_random_uuid(),
  'SRC-2025-001',
  'Budget Verification',
  'Confirm that the necessary budget is available for the procurement event.',
  'Completed',
  'Critical',
  'Document',
  'Budget verification ensures sufficient funding is allocated before initiating the procurement process, preventing project delays and financial constraints.',
  NOW() - INTERVAL '1 day',
  'Siti Nurhaliza (Senior Buyer)',
  'Budget_Approval_2025.pdf',
  'Official budget approval document confirming availability of Rp 45.2 Billion IDR for Siemens Mechanical Equipment procurement. Includes budget allocation breakdown, approval signatures from Finance Director, and multi-year funding commitment.',
  false,
  'view_edit',
  'indonesia-power'
) ON CONFLICT DO NOTHING;

-- Insert Tender Document (Incomplete)
INSERT INTO fact_procurement_checklist (
  id,
  sourcing_event_id,
  item_name,
  description,
  status,
  priority,
  item_type,
  ai_rationale,
  ai_generated,
  action_type,
  organization_id
) VALUES (
  gen_random_uuid(),
  'SRC-2025-001',
  'Tender Document',
  'Tender document not yet created.',
  'Pending',
  'Critical',
  'Document',
  'The tender document is a critical component that defines technical specifications, commercial terms, evaluation criteria, and submission requirements. It must be comprehensive, clear, and compliant with all regulatory standards.',
  false,
  'create_tender',
  'indonesia-power'
) ON CONFLICT DO NOTHING;

-- Insert Vendor Shortlist Verification (Incomplete)
INSERT INTO fact_procurement_checklist (
  id,
  sourcing_event_id,
  item_name,
  description,
  status,
  priority,
  item_type,
  ai_rationale,
  ai_generated,
  action_type,
  organization_id
) VALUES (
  gen_random_uuid(),
  'SRC-2025-001',
  'Vendor Shortlist Verification',
  'Shortlisted vendors have not been finalized.',
  'Pending',
  'High',
  'Approval',
  'Vendor shortlist verification ensures that only qualified, pre-approved vendors are invited to participate in the tender. This step improves bid quality and reduces procurement risk by engaging with reliable suppliers.',
  false,
  'select_vendor',
  'indonesia-power'
) ON CONFLICT DO NOTHING;
