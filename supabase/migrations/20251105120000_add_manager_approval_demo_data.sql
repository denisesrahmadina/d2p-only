/*
  # Add Manager Approval Demo Data

  1. New Demo Data
    - Pre-defined sourcing event for Manager Approval demonstration
    - Sourcing Event ID: SRC-2025-004
    - Title: Schneider Electric Control Systems
    - Status: Waiting for Approval (Draft status, Pending approval_status)
    - Includes 2 procurement requests (PR-025, PR-026)

  2. Procurement Requests
    - PR-025: PLC System from Schneider (4.3 Bn IDR)
    - PR-026: DCS Control Unit from Schneider (8.2 Bn IDR)
    - Total Value: 12.5 Bn IDR

  3. AI Bundling Insight
    - Cost efficiency: 5%
    - Cycle reduction: 15%
    - Bundled based on technical specifications and delivery schedule

  4. Purpose
    - Enable testing and demonstration of Manager Approval Review functionality
    - Showcases AI bundling insights and approval workflow
*/

-- Insert demo procurement requests using the correct schema
INSERT INTO fact_procurement_request (
  id,
  title,
  category,
  requestor,
  amount,
  status,
  priority,
  due_date,
  description,
  vendor,
  quantity,
  delivery_location,
  estimated_price,
  organization_id
) VALUES
-- PR-025: PLC System
(
  'PR-025-1',
  'PLC System - Electrical Equipment',
  'Electrical Equipment',
  'Plant G',
  'Rp 4,300,000,000',
  'Approved',
  'high',
  '2025-08-15',
  'PLC (Programmable Logic Controller) System for industrial automation. Material ID: PLC-SYSTEM-SC001. CAPEX procurement for plant automation upgrade.',
  'Schneider Electric',
  '5 units',
  'Plant G',
  4300000000,
  'org-001'
),
-- PR-026: DCS Control Unit
(
  'PR-026-1',
  'DCS Control Unit - Electrical Equipment',
  'Electrical Equipment',
  'Plant H',
  'Rp 8,200,000,000',
  'Approved',
  'high',
  '2025-08-18',
  'DCS (Distributed Control System) Control Unit for process control. Material ID: DCS-CTRL-SC002. CAPEX procurement for plant control system modernization.',
  'Schneider Electric',
  '10 units',
  'Plant H',
  8200000000,
  'org-001'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  requestor = EXCLUDED.requestor,
  amount = EXCLUDED.amount,
  status = EXCLUDED.status,
  priority = EXCLUDED.priority,
  due_date = EXCLUDED.due_date,
  description = EXCLUDED.description,
  vendor = EXCLUDED.vendor,
  quantity = EXCLUDED.quantity,
  delivery_location = EXCLUDED.delivery_location,
  estimated_price = EXCLUDED.estimated_price,
  updated_at = now();

-- Insert demo sourcing event
INSERT INTO fact_sourcing_event (
  sourcing_event_id,
  title,
  material_ids,
  demand_quantity,
  delivery_date,
  delivery_location,
  estimate_price,
  estimate_schedule,
  shortlisted_vendors,
  status,
  approval_status,
  assigned_to,
  created_by,
  responsible_planner,
  category,
  total_value,
  vendor_count,
  organization_id,
  bundle_id
) VALUES (
  'SRC-2025-004',
  'Schneider Electric Control Systems',
  '["PR-025-1", "PR-026-1"]'::jsonb,
  '15 units (5 PLC + 10 DCS)',
  '2025-08-15',
  'Plant G, Plant H',
  12500000000,
  jsonb_build_object(
    'duration', '60 days',
    'milestones', jsonb_build_array(
      'Tender Preparation',
      'Announcement',
      'Vendor Submission',
      'Evaluation',
      'Award'
    ),
    'cost_efficiency', 5,
    'cycle_reduction', 15,
    'bundling_rationale', 'AI identified Schneider Electrical systems with compatible specifications and delivery timelines. Expected cost efficiency: 5%. Procurement cycle reduction: 15%.'
  ),
  '["Schneider Electric", "ABB", "Siemens"]'::jsonb,
  'Draft',
  'Pending',
  'John Doe',
  'Planner D',
  'John Doe',
  'Electrical Equipment',
  12.5,
  3,
  'org-001',
  'BUNDLE-SCH-2025-001'
)
ON CONFLICT (sourcing_event_id) DO UPDATE SET
  title = EXCLUDED.title,
  material_ids = EXCLUDED.material_ids,
  demand_quantity = EXCLUDED.demand_quantity,
  delivery_date = EXCLUDED.delivery_date,
  delivery_location = EXCLUDED.delivery_location,
  estimate_price = EXCLUDED.estimate_price,
  estimate_schedule = EXCLUDED.estimate_schedule,
  shortlisted_vendors = EXCLUDED.shortlisted_vendors,
  status = EXCLUDED.status,
  approval_status = EXCLUDED.approval_status,
  assigned_to = EXCLUDED.assigned_to,
  created_by = EXCLUDED.created_by,
  responsible_planner = EXCLUDED.responsible_planner,
  category = EXCLUDED.category,
  total_value = EXCLUDED.total_value,
  vendor_count = EXCLUDED.vendor_count,
  updated_at = now();

-- Insert tender milestones for the demo sourcing event
DO $$
DECLARE
  v_sourcing_event_id text;
BEGIN
  -- Get the sourcing event UUID
  SELECT id INTO v_sourcing_event_id
  FROM fact_sourcing_event
  WHERE sourcing_event_id = 'SRC-2025-004';

  -- Only insert milestones if sourcing event exists
  IF v_sourcing_event_id IS NOT NULL THEN
    -- Delete existing milestones for this event
    DELETE FROM fact_tender_milestone WHERE sourcing_event_id = v_sourcing_event_id;

    -- Insert new milestones
    INSERT INTO fact_tender_milestone (
      sourcing_event_id,
      milestone_name,
      milestone_date,
      status,
      responsible_person,
      notes,
      organization_id
    ) VALUES
    (
      v_sourcing_event_id,
      'Tender Document Preparation',
      '2025-08-01',
      'Pending',
      'John Doe',
      'Prepare comprehensive tender documentation including technical specifications and commercial terms',
      'org-001'
    ),
    (
      v_sourcing_event_id,
      'Tender Announcement',
      '2025-08-05',
      'Pending',
      'John Doe',
      'Publish tender announcement to shortlisted vendors',
      'org-001'
    ),
    (
      v_sourcing_event_id,
      'Vendor Submission Period',
      '2025-08-20',
      'Pending',
      'Procurement Team',
      'Vendors submit their technical and commercial proposals',
      'org-001'
    ),
    (
      v_sourcing_event_id,
      'Technical Evaluation',
      '2025-08-25',
      'Pending',
      'Technical Team',
      'Evaluate technical compliance and specifications',
      'org-001'
    ),
    (
      v_sourcing_event_id,
      'Commercial Evaluation',
      '2025-08-28',
      'Pending',
      'Finance Team',
      'Evaluate commercial proposals and pricing',
      'org-001'
    ),
    (
      v_sourcing_event_id,
      'Vendor Selection & Award',
      '2025-09-01',
      'Pending',
      'Procurement Manager',
      'Final vendor selection and contract award',
      'org-001'
    );
  END IF;
END $$;

-- Create bundling recommendation for this event
INSERT INTO ref_bundling_recommendation (
  procurement_request_ids,
  category,
  delivery_location,
  average_due_date,
  total_value,
  request_count,
  estimated_savings,
  similarity_score,
  bundling_logic,
  recommended_vendors,
  status,
  organization_id,
  tender_count_reduction,
  bundle_insights
) VALUES (
  ARRAY['PR-025-1', 'PR-026-1']:text[],
  'Electrical Equipment',
  'Plant G, Plant H',
  '2025-08-15',
  12500000000,
  2,
  625000000,
  95,
  'AI identified Schneider Electrical systems with compatible specifications and delivery timelines. Both requests are for CAPEX electrical equipment from the same vendor (Schneider Electric) with delivery dates within 3 days of each other. Expected cost efficiency: 5%. Procurement cycle reduction: 15%.',
  ARRAY['Schneider Electric', 'ABB', 'Siemens']::text[],
  'Applied',
  'org-001',
  1,
  jsonb_build_object(
    'cost_efficiency_percent', 5,
    'cycle_reduction_percent', 15,
    'savings_amount', 625000000,
    'tenders_eliminated', 1,
    'technical_compatibility', 'High',
    'vendor_consolidation', true,
    'delivery_synchronization', true,
    'risk_level', 'Low'
  )
)
ON CONFLICT DO NOTHING;
