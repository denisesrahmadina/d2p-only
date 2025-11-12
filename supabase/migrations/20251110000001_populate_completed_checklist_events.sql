/*
  # Populate Completed Checklist Sourcing Events Mock Data

  1. Mock Data
    - Create two sourcing events with completed checklists:
      - SRC-2025-005: ABB Electrical Systems (15.0 Bn IDR)
      - SRC-2025-006: GE Mechanical Equipment (18.7 Bn IDR)
    - Both events have checklist_completed_status = 'Submitted for Approval'
    - Assign responsible planners Emma White and John Black
    - Set appropriate categories and values

  2. Checklist Items
    - Create completed checklist items for both sourcing events
    - All items marked as 'Completed' with completion dates
    - Include various item types: Document, Validation, Review

  3. Purpose
    - Demonstrate completed checklist approval workflow
    - Provide realistic mock data for testing manager approval flow
    - Show progression from checklist completion to tender preparation
*/

-- Insert sourcing event SRC-2025-005 (ABB Electrical Systems)
INSERT INTO fact_sourcing_event (
  sourcing_event_id,
  title,
  category,
  total_value,
  status,
  approval_status,
  responsible_planner,
  created_by,
  vendor_count,
  checklist_completed_status,
  checklist_submitted_at,
  checklist_submitted_by,
  organization_id,
  created_at
) VALUES (
  'SRC-2025-005',
  'ABB Electrical Systems – Complete',
  'Electrical Systems',
  15.0,
  'Draft',
  'Pending',
  'Emma White',
  'Emma White',
  3,
  'Submitted for Approval',
  NOW() - INTERVAL '2 hours',
  'Emma White',
  (SELECT id FROM ref_organization LIMIT 1),
  NOW() - INTERVAL '3 days'
) ON CONFLICT (sourcing_event_id) DO NOTHING;

-- Insert sourcing event SRC-2025-006 (GE Mechanical Equipment)
INSERT INTO fact_sourcing_event (
  sourcing_event_id,
  title,
  category,
  total_value,
  status,
  approval_status,
  responsible_planner,
  created_by,
  vendor_count,
  checklist_completed_status,
  checklist_submitted_at,
  checklist_submitted_by,
  organization_id,
  created_at
) VALUES (
  'SRC-2025-006',
  'GE Mechanical Equipment – Complete',
  'Mechanical Equipment',
  18.7,
  'Draft',
  'Pending',
  'John Black',
  'John Black',
  3,
  'Submitted for Approval',
  NOW() - INTERVAL '1 hour',
  'John Black',
  (SELECT id FROM ref_organization LIMIT 1),
  NOW() - INTERVAL '2 days'
) ON CONFLICT (sourcing_event_id) DO NOTHING;

-- Create checklist items for SRC-2025-005
DO $$
DECLARE
  v_event_id uuid;
  v_event_line_id int;
  v_org_id uuid;
BEGIN
  SELECT id, sourcing_event_line_id, organization_id
  INTO v_event_id, v_event_line_id, v_org_id
  FROM fact_sourcing_event
  WHERE sourcing_event_id = 'SRC-2025-005';

  IF v_event_id IS NOT NULL THEN
    -- Compliance Review
    INSERT INTO fact_procurement_checklist (
      sourcing_event_id,
      sourcing_event_line_id,
      item_name,
      item_type,
      description,
      status,
      priority,
      ai_rationale,
      completion_date,
      completed_by,
      auto_complete_trigger,
      organization_id,
      file_name,
      uploaded_by,
      uploaded_on,
      document_summary
    ) VALUES (
      v_event_id,
      v_event_line_id,
      'Compliance Review',
      'Document',
      'Review procurement for regulatory and internal policy compliance',
      'Completed',
      'Critical',
      'Compliance review ensures adherence to electrical systems procurement regulations.',
      NOW() - INTERVAL '1 day',
      'Emma White',
      false,
      v_org_id,
      'Compliance_Review_Electrical.pdf',
      'Emma White',
      NOW() - INTERVAL '1 day',
      'All regulatory requirements verified and approved for electrical systems procurement.'
    ) ON CONFLICT DO NOTHING;

    -- Budget Verification
    INSERT INTO fact_procurement_checklist (
      sourcing_event_id,
      sourcing_event_line_id,
      item_name,
      item_type,
      description,
      status,
      priority,
      ai_rationale,
      completion_date,
      completed_by,
      auto_complete_trigger,
      organization_id,
      file_name,
      uploaded_by,
      uploaded_on,
      document_summary
    ) VALUES (
      v_event_id,
      v_event_line_id,
      'Budget Verification',
      'Document',
      'Verify budget allocation and financial approval for procurement',
      'Completed',
      'Critical',
      'Budget verification confirms IDR 15.0 Bn is available and properly allocated.',
      NOW() - INTERVAL '20 hours',
      'Finance Team',
      false,
      v_org_id,
      'Budget_Verification_ABB.pdf',
      'Finance Team',
      NOW() - INTERVAL '20 hours',
      'Budget verified and approved. Funds allocated for ABB electrical systems.'
    ) ON CONFLICT DO NOTHING;

    -- Tender Document
    INSERT INTO fact_procurement_checklist (
      sourcing_event_id,
      sourcing_event_line_id,
      item_name,
      item_type,
      description,
      status,
      priority,
      ai_rationale,
      completion_date,
      completed_by,
      auto_complete_trigger,
      organization_id,
      document_summary
    ) VALUES (
      v_event_id,
      v_event_line_id,
      'Tender Document',
      'Document',
      'Create and finalize tender documentation including technical specifications',
      'Completed',
      'Critical',
      'Tender document completed with technical specifications for ABB systems.',
      NOW() - INTERVAL '12 hours',
      'Emma White',
      true,
      v_org_id,
      'Tender documentation finalized with technical and commercial terms for electrical systems.'
    ) ON CONFLICT DO NOTHING;

    -- Vendor Shortlist Verification
    INSERT INTO fact_procurement_checklist (
      sourcing_event_id,
      sourcing_event_line_id,
      item_name,
      item_type,
      description,
      status,
      priority,
      ai_rationale,
      completion_date,
      completed_by,
      auto_complete_trigger,
      organization_id
    ) VALUES (
      v_event_id,
      v_event_line_id,
      'Vendor Shortlist Verification',
      'Validation',
      'Verify shortlisted vendors meet qualification criteria',
      'Completed',
      'High',
      'Vendor qualification verified: ABB, Schneider, and Siemens meet all requirements.',
      NOW() - INTERVAL '8 hours',
      'Emma White',
      false,
      v_org_id
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Create checklist items for SRC-2025-006
DO $$
DECLARE
  v_event_id uuid;
  v_event_line_id int;
  v_org_id uuid;
BEGIN
  SELECT id, sourcing_event_line_id, organization_id
  INTO v_event_id, v_event_line_id, v_org_id
  FROM fact_sourcing_event
  WHERE sourcing_event_id = 'SRC-2025-006';

  IF v_event_id IS NOT NULL THEN
    -- Compliance Review
    INSERT INTO fact_procurement_checklist (
      sourcing_event_id,
      sourcing_event_line_id,
      item_name,
      item_type,
      description,
      status,
      priority,
      ai_rationale,
      completion_date,
      completed_by,
      auto_complete_trigger,
      organization_id,
      file_name,
      uploaded_by,
      uploaded_on,
      document_summary
    ) VALUES (
      v_event_id,
      v_event_line_id,
      'Compliance Review',
      'Document',
      'Review procurement for regulatory and internal policy compliance',
      'Completed',
      'Critical',
      'Compliance review ensures adherence to mechanical equipment procurement standards.',
      NOW() - INTERVAL '18 hours',
      'John Black',
      false,
      v_org_id,
      'Compliance_Review_Mechanical.pdf',
      'John Black',
      NOW() - INTERVAL '18 hours',
      'All regulatory requirements verified for GE mechanical equipment procurement.'
    ) ON CONFLICT DO NOTHING;

    -- Budget Verification
    INSERT INTO fact_procurement_checklist (
      sourcing_event_id,
      sourcing_event_line_id,
      item_name,
      item_type,
      description,
      status,
      priority,
      ai_rationale,
      completion_date,
      completed_by,
      auto_complete_trigger,
      organization_id,
      file_name,
      uploaded_by,
      uploaded_on,
      document_summary
    ) VALUES (
      v_event_id,
      v_event_line_id,
      'Budget Verification',
      'Document',
      'Verify budget allocation and financial approval for procurement',
      'Completed',
      'Critical',
      'Budget verification confirms IDR 18.7 Bn is available for mechanical equipment.',
      NOW() - INTERVAL '15 hours',
      'Finance Team',
      false,
      v_org_id,
      'Budget_Verification_GE.pdf',
      'Finance Team',
      NOW() - INTERVAL '15 hours',
      'Budget verified. Funds allocated for GE mechanical equipment procurement.'
    ) ON CONFLICT DO NOTHING;

    -- Tender Document
    INSERT INTO fact_procurement_checklist (
      sourcing_event_id,
      sourcing_event_line_id,
      item_name,
      item_type,
      description,
      status,
      priority,
      ai_rationale,
      completion_date,
      completed_by,
      auto_complete_trigger,
      organization_id,
      document_summary
    ) VALUES (
      v_event_id,
      v_event_line_id,
      'Tender Document',
      'Document',
      'Create and finalize tender documentation including technical specifications',
      'Completed',
      'Critical',
      'Tender document completed for GE mechanical equipment with detailed specs.',
      NOW() - INTERVAL '10 hours',
      'John Black',
      true,
      v_org_id,
      'Tender documentation finalized for mechanical equipment with all technical requirements.'
    ) ON CONFLICT DO NOTHING;

    -- Vendor Shortlist Verification
    INSERT INTO fact_procurement_checklist (
      sourcing_event_id,
      sourcing_event_line_id,
      item_name,
      item_type,
      description,
      status,
      priority,
      ai_rationale,
      completion_date,
      completed_by,
      auto_complete_trigger,
      organization_id
    ) VALUES (
      v_event_id,
      v_event_line_id,
      'Vendor Shortlist Verification',
      'Validation',
      'Verify shortlisted vendors meet qualification criteria',
      'Completed',
      'High',
      'Vendor qualification verified: GE, Mitsubishi, and Toshiba all qualified.',
      NOW() - INTERVAL '6 hours',
      'John Black',
      false,
      v_org_id
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;
