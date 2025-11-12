/*
  # Enhanced PR Management and Order Monitoring System

  ## Overview
  This migration creates a comprehensive procurement request management system with multi-step approval workflows
  and detailed order monitoring through a 7-step delivery process.

  ## New Tables Created

  ### 1. **dim_pr_status_lookup** - PR status definitions
  ### 2. **fact_pr_approval_workflow** - Individual approval steps tracking
  ### 3. **fact_pr_revision_history** - Complete revision history
  ### 4. **dim_order_status_lookup** - 7-step order status definitions
  ### 5. **fact_order_monitoring** - Core order tracking table
  ### 6. **fact_order_tracking_milestones** - Detailed milestone tracking
  ### 7. **fact_order_inspection** - Inspection details and results
  ### 8. **fact_goods_receipt** - GR records with ERP sync status
  ### 9. **vw_pr_status_summary** - PR statistics view
  ### 10. **vw_order_monitoring_summary** - Order statistics view

  ## Security
  - RLS enabled on all tables
  - Authenticated and anonymous users can read data
  - Role-based access for create/update operations
*/

-- ============================================================================
-- PR STATUS LOOKUP
-- ============================================================================

CREATE TABLE IF NOT EXISTS dim_pr_status_lookup (
  status_code text PRIMARY KEY,
  status_name text NOT NULL,
  status_description text,
  status_order integer NOT NULL,
  is_active boolean DEFAULT true,
  created_date timestamptz DEFAULT now()
);

INSERT INTO dim_pr_status_lookup (status_code, status_name, status_description, status_order) VALUES
  ('DRAFT', 'Draft', 'PR is being created but not yet submitted', 1),
  ('PENDING_APPROVAL', 'Pending Approval', 'PR submitted and awaiting approval', 2),
  ('REQUESTED_REVISION', 'Requested Revision', 'Approver requested changes to PR', 3),
  ('APPROVED', 'Approved', 'PR fully approved, ready for PO creation', 4),
  ('REJECTED', 'Rejected', 'PR rejected by approver', 5),
  ('IN_PROCUREMENT', 'In Procurement', 'PO created, order being processed', 6),
  ('COMPLETED', 'Completed', 'Goods received and order completed', 7),
  ('CANCELLED', 'Cancelled', 'PR cancelled by requestor', 8)
ON CONFLICT (status_code) DO NOTHING;

-- ============================================================================
-- ORDER STATUS LOOKUP
-- ============================================================================

CREATE TABLE IF NOT EXISTS dim_order_status_lookup (
  status_code text PRIMARY KEY,
  status_name text NOT NULL,
  status_description text,
  status_order integer NOT NULL,
  icon_name text,
  color_class text,
  is_active boolean DEFAULT true,
  created_date timestamptz DEFAULT now()
);

INSERT INTO dim_order_status_lookup (status_code, status_name, status_description, status_order, icon_name, color_class) VALUES
  ('ORDER_PLACED', 'Order Placed', 'PO created and sent to vendor', 1, 'FileText', 'blue'),
  ('PROCESSING_ORDER', 'Processing Order', 'Vendor preparing order for shipment', 2, 'Package', 'indigo'),
  ('SHIPPED', 'Shipped', 'Order shipped from vendor facility', 3, 'Truck', 'purple'),
  ('DELIVERY', 'Delivery', 'Order in transit to destination', 4, 'MapPin', 'violet'),
  ('ARRIVED_AT_DESTINATION', 'Arrived at Destination', 'Order arrived, GR pending in ERP', 5, 'CheckCircle', 'orange'),
  ('IN_INSPECTION', 'In Inspection', 'Quality inspection in progress, BA documents being generated', 6, 'Search', 'yellow'),
  ('ORDER_RECEIVED', 'Order Received', 'GR completed, order closed', 7, 'CheckCircle2', 'green')
ON CONFLICT (status_code) DO NOTHING;

-- ============================================================================
-- PR APPROVAL WORKFLOW
-- ============================================================================

CREATE TABLE IF NOT EXISTS fact_pr_approval_workflow (
  approval_id bigserial PRIMARY KEY,
  pr_id bigint NOT NULL,
  
  -- Approval Step Information
  approval_level integer NOT NULL,
  approval_sequence integer NOT NULL,
  is_parallel boolean DEFAULT false,
  
  -- Approver Information
  approver_id text NOT NULL,
  approver_name text NOT NULL,
  approver_role text NOT NULL,
  approver_department text,
  approver_email text,
  
  -- Approval Status
  approval_status text NOT NULL DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED', 'REQUESTED_REVISION', 'SKIPPED')),
  action_date timestamptz,
  action_comments text,
  rejection_reason text,
  revision_notes text,
  
  -- SLA Tracking
  assigned_date timestamptz DEFAULT now(),
  due_date timestamptz,
  is_overdue boolean DEFAULT false,
  
  -- Delegation
  delegated_to_id text,
  delegated_to_name text,
  delegation_date timestamptz,
  delegation_reason text,
  
  -- Audit
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pr_approval_pr_id ON fact_pr_approval_workflow(pr_id);
CREATE INDEX IF NOT EXISTS idx_pr_approval_approver ON fact_pr_approval_workflow(approver_id);
CREATE INDEX IF NOT EXISTS idx_pr_approval_status ON fact_pr_approval_workflow(approval_status);

-- ============================================================================
-- PR REVISION HISTORY
-- ============================================================================

CREATE TABLE IF NOT EXISTS fact_pr_revision_history (
  revision_id bigserial PRIMARY KEY,
  pr_id bigint NOT NULL,
  revision_number integer NOT NULL,
  
  -- Revision Details
  revision_reason text NOT NULL,
  revision_requested_by text NOT NULL,
  revision_requested_date timestamptz NOT NULL,
  revision_completed_by text,
  revision_completed_date timestamptz,
  
  -- Changes Made
  changes_summary text,
  changes_detail jsonb,
  
  -- Previous and New Values
  previous_total_value numeric(15,2),
  new_total_value numeric(15,2),
  line_items_changed integer DEFAULT 0,
  
  -- Audit
  created_date timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pr_revision_pr_id ON fact_pr_revision_history(pr_id);

-- ============================================================================
-- ORDER MONITORING
-- ============================================================================

CREATE TABLE IF NOT EXISTS fact_order_monitoring (
  order_monitoring_id bigserial PRIMARY KEY,
  
  -- Order References
  po_number text NOT NULL,
  po_line_id bigint,
  pr_id bigint,
  pr_number text,
  
  -- Order Details
  vendor_id text NOT NULL,
  vendor_name text NOT NULL,
  material_id text NOT NULL,
  material_description text NOT NULL,
  
  -- Quantities and Values
  qty_ordered numeric(15,3) NOT NULL,
  qty_received numeric(15,3) DEFAULT 0,
  qty_accepted numeric(15,3) DEFAULT 0,
  qty_rejected numeric(15,3) DEFAULT 0,
  unit_price numeric(15,2) NOT NULL,
  total_value numeric(15,2) NOT NULL,
  currency text DEFAULT 'IDR',
  
  -- Current Status
  current_status text NOT NULL DEFAULT 'ORDER_PLACED' REFERENCES dim_order_status_lookup(status_code),
  current_step integer DEFAULT 1 CHECK (current_step BETWEEN 1 AND 7),
  
  -- Dates
  order_placed_date timestamptz NOT NULL DEFAULT now(),
  processing_started_date timestamptz,
  shipped_date timestamptz,
  delivery_started_date timestamptz,
  arrived_at_destination_date timestamptz,
  inspection_started_date timestamptz,
  order_received_date timestamptz,
  
  -- Expected vs Actual
  expected_delivery_date timestamptz,
  actual_delivery_date timestamptz,
  is_delayed boolean DEFAULT false,
  delay_reason text,
  
  -- Tracking Information
  tracking_number text,
  current_location text,
  current_location_lat numeric(10,7),
  current_location_lng numeric(10,7),
  
  -- Delivery Location
  delivery_address text,
  delivery_city text,
  delivery_province text,
  delivery_contact_person text,
  delivery_contact_phone text,
  
  -- Inspection and GR Status
  inspection_status text CHECK (inspection_status IN ('NOT_STARTED', 'IN_PROGRESS', 'PASSED', 'FAILED', 'CONDITIONAL_PASS')),
  inspection_completed_date timestamptz,
  ba_pemeriksaan_id bigint,
  ba_serah_terima_id bigint,
  gr_number text,
  gr_status text CHECK (gr_status IN ('PENDING', 'CREATED', 'FAILED')),
  gr_created_date timestamptz,
  
  -- Flags
  requires_special_handling boolean DEFAULT false,
  is_urgent boolean DEFAULT false,
  is_completed boolean DEFAULT false,
  completion_date timestamptz,
  
  -- Audit
  created_by text,
  created_date timestamptz DEFAULT now(),
  modified_by text,
  modified_date timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_monitoring_po ON fact_order_monitoring(po_number);
CREATE INDEX IF NOT EXISTS idx_order_monitoring_pr ON fact_order_monitoring(pr_id);
CREATE INDEX IF NOT EXISTS idx_order_monitoring_status ON fact_order_monitoring(current_status);
CREATE INDEX IF NOT EXISTS idx_order_monitoring_vendor ON fact_order_monitoring(vendor_id);

-- ============================================================================
-- ORDER TRACKING MILESTONES
-- ============================================================================

CREATE TABLE IF NOT EXISTS fact_order_tracking_milestones (
  milestone_id bigserial PRIMARY KEY,
  order_monitoring_id bigint NOT NULL REFERENCES fact_order_monitoring(order_monitoring_id) ON DELETE CASCADE,
  
  -- Milestone Information
  milestone_step integer NOT NULL CHECK (milestone_step BETWEEN 1 AND 7),
  milestone_status text NOT NULL REFERENCES dim_order_status_lookup(status_code),
  milestone_name text NOT NULL,
  milestone_description text,
  
  -- Location and Time
  milestone_location text,
  milestone_location_lat numeric(10,7),
  milestone_location_lng numeric(10,7),
  milestone_timestamp timestamptz NOT NULL,
  
  -- Status
  is_completed boolean DEFAULT false,
  completed_by text,
  
  -- Supporting Documents
  ba_documents jsonb,
  photos jsonb,
  notes text,
  
  -- Audit
  created_date timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_milestone_order ON fact_order_tracking_milestones(order_monitoring_id);
CREATE INDEX IF NOT EXISTS idx_milestone_status ON fact_order_tracking_milestones(milestone_status);

-- ============================================================================
-- ORDER INSPECTION
-- ============================================================================

CREATE TABLE IF NOT EXISTS fact_order_inspection (
  inspection_id bigserial PRIMARY KEY,
  order_monitoring_id bigint NOT NULL REFERENCES fact_order_monitoring(order_monitoring_id) ON DELETE CASCADE,
  
  -- Inspection Details
  inspection_number text NOT NULL UNIQUE,
  inspection_date timestamptz NOT NULL,
  inspection_location text NOT NULL,
  
  -- Inspector Information
  inspector_id text NOT NULL,
  inspector_name text NOT NULL,
  inspector_role text,
  inspector_department text,
  
  -- Inspection Results
  inspection_status text NOT NULL CHECK (inspection_status IN ('IN_PROGRESS', 'PASSED', 'FAILED', 'CONDITIONAL_PASS', 'PENDING_REVIEW')),
  overall_result text,
  
  -- Quantity Verification
  qty_ordered numeric(15,3) NOT NULL,
  qty_delivered numeric(15,3) NOT NULL,
  qty_inspected numeric(15,3) NOT NULL,
  qty_accepted numeric(15,3),
  qty_rejected numeric(15,3),
  qty_variance numeric(15,3),
  
  -- Quality Checks
  quality_checks jsonb,
  passed_checks integer DEFAULT 0,
  failed_checks integer DEFAULT 0,
  total_checks integer DEFAULT 0,
  
  -- Acceptance
  acceptance_criteria_met boolean DEFAULT false,
  rejection_reasons text[],
  conditional_acceptance_terms text,
  
  -- Documentation
  inspection_notes text,
  photo_evidence jsonb,
  inspection_checklist jsonb,
  
  -- BA Document References
  ba_pemeriksaan_id bigint,
  ba_pemeriksaan_number text,
  ba_serah_terima_id bigint,
  ba_serah_terima_number text,
  
  -- Completion
  inspection_completed_date timestamptz,
  inspection_approved_by text,
  inspection_approved_date timestamptz,
  
  -- Audit
  created_by text,
  created_date timestamptz DEFAULT now(),
  modified_by text,
  modified_date timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inspection_order ON fact_order_inspection(order_monitoring_id);
CREATE INDEX IF NOT EXISTS idx_inspection_status ON fact_order_inspection(inspection_status);

-- ============================================================================
-- GOODS RECEIPT
-- ============================================================================

CREATE TABLE IF NOT EXISTS fact_goods_receipt (
  gr_id bigserial PRIMARY KEY,
  
  -- GR Information
  gr_number text NOT NULL UNIQUE,
  gr_date timestamptz NOT NULL,
  gr_type text CHECK (gr_type IN ('FULL', 'PARTIAL', 'OVER_DELIVERY')),
  
  -- Order References
  order_monitoring_id bigint NOT NULL REFERENCES fact_order_monitoring(order_monitoring_id),
  po_number text NOT NULL,
  inspection_id bigint REFERENCES fact_order_inspection(inspection_id),
  
  -- Quantities
  qty_ordered numeric(15,3) NOT NULL,
  qty_received numeric(15,3) NOT NULL,
  qty_variance numeric(15,3),
  variance_reason text,
  
  -- Values
  total_value numeric(15,2) NOT NULL,
  currency text DEFAULT 'IDR',
  
  -- Receiving Information
  received_by text NOT NULL,
  received_at_location text NOT NULL,
  receiving_department text,
  
  -- ERP Integration
  erp_sync_status text NOT NULL DEFAULT 'PENDING' CHECK (erp_sync_status IN ('PENDING', 'SUCCESS', 'FAILED', 'RETRY')),
  erp_sync_date timestamptz,
  erp_sync_attempts integer DEFAULT 0,
  erp_error_message text,
  erp_document_number text,
  
  -- Status
  gr_status text NOT NULL DEFAULT 'COMPLETED' CHECK (gr_status IN ('DRAFT', 'COMPLETED', 'CANCELLED', 'REVERSED')),
  
  -- Notes
  receiving_notes text,
  variance_notes text,
  
  -- Audit
  created_by text NOT NULL,
  created_date timestamptz DEFAULT now(),
  modified_by text,
  modified_date timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gr_order ON fact_goods_receipt(order_monitoring_id);
CREATE INDEX IF NOT EXISTS idx_gr_po ON fact_goods_receipt(po_number);
CREATE INDEX IF NOT EXISTS idx_gr_erp_status ON fact_goods_receipt(erp_sync_status);

-- ============================================================================
-- VIEWS FOR SUMMARIES
-- ============================================================================

-- PR Status Summary View
CREATE OR REPLACE VIEW vw_pr_status_summary AS
SELECT 
  COUNT(*) as total_prs,
  COUNT(*) FILTER (WHERE pr_status = 'Draft') as draft_count,
  COUNT(*) FILTER (WHERE pr_status = 'Pending Approval') as pending_approval_count,
  COUNT(*) FILTER (WHERE pr_status = 'Requested Revision') as revision_needed_count,
  COUNT(*) FILTER (WHERE pr_status = 'Approved') as approved_count,
  COUNT(*) FILTER (WHERE pr_status = 'Rejected') as rejected_count,
  COUNT(*) FILTER (WHERE pr_status = 'In Procurement') as in_procurement_count,
  COUNT(*) FILTER (WHERE pr_status = 'Completed') as completed_count,
  COALESCE(SUM(total_value), 0) as total_value_all_prs,
  COALESCE(SUM(total_value) FILTER (WHERE pr_status = 'Pending Approval'), 0) as total_value_pending,
  COALESCE(SUM(total_value) FILTER (WHERE pr_status = 'Approved'), 0) as total_value_approved
FROM fact_pr_header;

-- Order Monitoring Summary View
CREATE OR REPLACE VIEW vw_order_monitoring_summary AS
SELECT 
  COUNT(*) as total_orders,
  COUNT(*) FILTER (WHERE current_status = 'ORDER_PLACED') as order_placed_count,
  COUNT(*) FILTER (WHERE current_status = 'PROCESSING_ORDER') as processing_count,
  COUNT(*) FILTER (WHERE current_status = 'SHIPPED') as shipped_count,
  COUNT(*) FILTER (WHERE current_status = 'DELIVERY') as delivery_count,
  COUNT(*) FILTER (WHERE current_status = 'ARRIVED_AT_DESTINATION') as arrived_count,
  COUNT(*) FILTER (WHERE current_status = 'IN_INSPECTION') as inspection_count,
  COUNT(*) FILTER (WHERE current_status = 'ORDER_RECEIVED') as received_count,
  COUNT(*) FILTER (WHERE is_delayed = true AND is_completed = false) as delayed_orders_count,
  COALESCE(SUM(total_value), 0) as total_value_all_orders,
  COALESCE(SUM(total_value) FILTER (WHERE is_completed = true), 0) as total_value_completed
FROM fact_order_monitoring;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE dim_pr_status_lookup ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_order_status_lookup ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_pr_approval_workflow ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_pr_revision_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_order_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_order_tracking_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_order_inspection ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_goods_receipt ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users
CREATE POLICY "Allow read for authenticated users" ON dim_pr_status_lookup FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for authenticated users" ON dim_order_status_lookup FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for authenticated users" ON fact_pr_approval_workflow FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for authenticated users" ON fact_pr_revision_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for authenticated users" ON fact_order_monitoring FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for authenticated users" ON fact_order_tracking_milestones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for authenticated users" ON fact_order_inspection FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for authenticated users" ON fact_goods_receipt FOR SELECT TO authenticated USING (true);

-- Allow read access for anonymous users (for demo purposes)
CREATE POLICY "Allow read for anonymous users" ON dim_pr_status_lookup FOR SELECT TO anon USING (true);
CREATE POLICY "Allow read for anonymous users" ON dim_order_status_lookup FOR SELECT TO anon USING (true);
CREATE POLICY "Allow read for anonymous users" ON fact_pr_approval_workflow FOR SELECT TO anon USING (true);
CREATE POLICY "Allow read for anonymous users" ON fact_pr_revision_history FOR SELECT TO anon USING (true);
CREATE POLICY "Allow read for anonymous users" ON fact_order_monitoring FOR SELECT TO anon USING (true);
CREATE POLICY "Allow read for anonymous users" ON fact_order_tracking_milestones FOR SELECT TO anon USING (true);
CREATE POLICY "Allow read for anonymous users" ON fact_order_inspection FOR SELECT TO anon USING (true);
CREATE POLICY "Allow read for anonymous users" ON fact_goods_receipt FOR SELECT TO anon USING (true);

-- Allow insert/update for authenticated users
CREATE POLICY "Allow insert for authenticated users" ON fact_pr_approval_workflow FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON fact_pr_approval_workflow FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow insert for authenticated users" ON fact_pr_revision_history FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow insert for authenticated users" ON fact_order_monitoring FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON fact_order_monitoring FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow insert for authenticated users" ON fact_order_tracking_milestones FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow insert for authenticated users" ON fact_order_inspection FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON fact_order_inspection FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow insert for authenticated users" ON fact_goods_receipt FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON fact_goods_receipt FOR UPDATE TO authenticated USING (true);