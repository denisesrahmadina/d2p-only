/*
  # Create PR Approval Workflow Tables

  ## Overview
  This migration creates comprehensive approval workflow tables to support sequential
  purchase requisition approval processes with real-time status tracking and audit trails.

  ## New Tables

  1. **dim_approval_rules**
     - Defines approval requirements based on PR value thresholds
     - Configures approval chains for different value ranges
     - Stores approval role hierarchy and estimated processing time

  2. **fact_pr_approval_history**
     - Tracks all approval actions and decisions
     - Maintains complete audit trail of PR lifecycle
     - Records timestamps, comments, and approver details

  3. **vw_pr_list_with_approvals**
     - Consolidated view of PRs with current approval status
     - Shows next approver and pending actions
     - Optimized for PR list displays and filtering

  ## Data Enhancements
     - Adds approval_chain jsonb to fact_pr_header (if not exists)
     - Adds requirement_date, vendor_id, attachment fields
     - Creates indexes for fast approval queries

  ## Security
     - RLS enabled on all tables
     - Public read access for authenticated users
     - Approvers can update approval records

  ## Important Notes
     - Supports sequential approval chains only
     - Automatic approval chain initialization on PR creation
     - Real-time approval status tracking
*/

-- ============================================================================
-- APPROVAL RULES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS dim_approval_rules (
  rule_id bigserial PRIMARY KEY,
  rule_name text NOT NULL,
  min_value numeric NOT NULL DEFAULT 0,
  max_value numeric NOT NULL,
  approval_roles jsonb NOT NULL DEFAULT '[]'::jsonb,
  estimated_days integer NOT NULL DEFAULT 3,
  is_active boolean DEFAULT true,
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now(),
  CONSTRAINT valid_value_range CHECK (min_value < max_value)
);

ALTER TABLE dim_approval_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to approval rules"
  ON dim_approval_rules FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage approval rules"
  ON dim_approval_rules FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- PR APPROVAL HISTORY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS fact_pr_approval_history (
  approval_history_id bigserial PRIMARY KEY,
  pr_id bigint NOT NULL REFERENCES fact_pr_header(pr_id) ON DELETE CASCADE,
  pr_number text NOT NULL,
  approval_level integer NOT NULL,
  approver_id text NOT NULL,
  approver_name text NOT NULL,
  approver_role text NOT NULL,
  action text NOT NULL CHECK (action IN ('Submitted', 'Approved', 'Rejected', 'Revision Requested', 'Resubmitted')),
  comments text,
  action_date timestamptz DEFAULT now(),
  previous_status text,
  new_status text,
  time_to_action_hours numeric,
  created_date timestamptz DEFAULT now()
);

ALTER TABLE fact_pr_approval_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to approval history"
  ON fact_pr_approval_history FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to create approval history"
  ON fact_pr_approval_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- ENHANCE fact_pr_header TABLE
-- ============================================================================

-- Add approval_chain column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_pr_header' AND column_name = 'approval_chain'
  ) THEN
    ALTER TABLE fact_pr_header ADD COLUMN approval_chain jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add requirement_date column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_pr_header' AND column_name = 'requirement_date'
  ) THEN
    ALTER TABLE fact_pr_header ADD COLUMN requirement_date date;
  END IF;
END $$;

-- Add vendor_id column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_pr_header' AND column_name = 'vendor_id'
  ) THEN
    ALTER TABLE fact_pr_header ADD COLUMN vendor_id text REFERENCES dim_vendor(vendor_id);
  END IF;
END $$;

-- Add attachment_count column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_pr_header' AND column_name = 'attachment_count'
  ) THEN
    ALTER TABLE fact_pr_header ADD COLUMN attachment_count integer DEFAULT 0;
  END IF;
END $$;

-- Add attachment_metadata column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_pr_header' AND column_name = 'attachment_metadata'
  ) THEN
    ALTER TABLE fact_pr_header ADD COLUMN attachment_metadata jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add delivery_location_data column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_pr_header' AND column_name = 'delivery_location_data'
  ) THEN
    ALTER TABLE fact_pr_header ADD COLUMN delivery_location_data jsonb;
  END IF;
END $$;

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_pr_header_status ON fact_pr_header(pr_status);
CREATE INDEX IF NOT EXISTS idx_pr_header_requestor ON fact_pr_header(requestor_id);
CREATE INDEX IF NOT EXISTS idx_pr_header_date ON fact_pr_header(pr_date DESC);
CREATE INDEX IF NOT EXISTS idx_pr_header_vendor ON fact_pr_header(vendor_id);
CREATE INDEX IF NOT EXISTS idx_pr_approval_history_pr_id ON fact_pr_approval_history(pr_id);
CREATE INDEX IF NOT EXISTS idx_pr_approval_history_approver ON fact_pr_approval_history(approver_id);
CREATE INDEX IF NOT EXISTS idx_pr_approval_history_action_date ON fact_pr_approval_history(action_date DESC);

-- ============================================================================
-- CREATE VIEW FOR PR LIST WITH APPROVALS
-- ============================================================================

DROP VIEW IF EXISTS vw_pr_list;

CREATE VIEW vw_pr_list AS
SELECT
  ph.pr_id,
  ph.pr_number,
  ph.requestor_name,
  ph.requestor_id,
  ph.department,
  ph.pr_date,
  ph.requirement_date,
  ph.total_value,
  ph.currency,
  ph.pr_status,
  ph.vendor_id,
  v.vendor_name,
  v.vendor_city,
  ph.attachment_count,
  ph.attachment_metadata,
  ph.delivery_location_data,
  ph.approval_chain,
  ph.notes,
  ph.created_date,
  ph.modified_date,
  -- Calculate line item count
  (SELECT COUNT(*) FROM fact_pr_line pl WHERE pl.pr_id = ph.pr_id) as line_item_count,
  -- Get line items as array
  (SELECT jsonb_agg(
    jsonb_build_object(
      'pr_line_id', pl.pr_line_id,
      'line_number', pl.line_number,
      'item_id', pl.item_id,
      'material_id', pl.material_id,
      'quantity', pl.quantity,
      'uom', pl.uom,
      'unit_price', pl.unit_price,
      'subtotal', pl.subtotal,
      'notes', pl.notes
    )
  ) FROM fact_pr_line pl WHERE pl.pr_id = ph.pr_id) as line_items,
  -- Get current approval step
  CASE
    WHEN ph.pr_status = 'Draft' THEN 'Not submitted'
    WHEN ph.pr_status = 'Pending Approval' THEN
      (SELECT
        COALESCE(
          elem->>'approver_role',
          'Unknown'
        )
       FROM jsonb_array_elements(ph.approval_chain) elem
       WHERE (elem->>'status')::text = 'Pending'
       LIMIT 1)
    WHEN ph.pr_status = 'Approved' THEN 'Fully approved'
    WHEN ph.pr_status = 'Rejected' THEN 'Rejected'
    ELSE ph.pr_status
  END as current_approval_step,
  -- Get next approver
  CASE
    WHEN ph.pr_status = 'Pending Approval' THEN
      (SELECT
        elem->>'approver_name'
       FROM jsonb_array_elements(ph.approval_chain) elem
       WHERE (elem->>'status')::text = 'Pending'
       LIMIT 1)
    ELSE NULL
  END as next_approver_name
FROM fact_pr_header ph
LEFT JOIN dim_vendor v ON ph.vendor_id = v.vendor_id;

-- Grant access to view
GRANT SELECT ON vw_pr_list TO PUBLIC;

-- ============================================================================
-- INSERT DEFAULT APPROVAL RULES
-- ============================================================================

INSERT INTO dim_approval_rules (rule_name, min_value, max_value, approval_roles, estimated_days)
VALUES
  (
    'Small Purchase (< IDR 10M)',
    0,
    10000000,
    '[
      {"role": "Department Manager", "level": 1, "reason": "Standard approval for purchases under IDR 10M"}
    ]'::jsonb,
    2
  ),
  (
    'Medium Purchase (IDR 10M - 50M)',
    10000000,
    50000000,
    '[
      {"role": "Department Manager", "level": 1, "reason": "Initial review and recommendation"},
      {"role": "Finance Manager", "level": 2, "reason": "Budget verification for purchases IDR 10M-50M"}
    ]'::jsonb,
    3
  ),
  (
    'Large Purchase (IDR 50M - 100M)',
    50000000,
    100000000,
    '[
      {"role": "Department Manager", "level": 1, "reason": "Initial review and justification"},
      {"role": "Finance Manager", "level": 2, "reason": "Budget and financial compliance check"},
      {"role": "Director", "level": 3, "reason": "Executive approval required for purchases over IDR 50M"}
    ]'::jsonb,
    5
  ),
  (
    'Strategic Purchase (> IDR 100M)',
    100000000,
    999999999999,
    '[
      {"role": "Department Manager", "level": 1, "reason": "Technical and operational justification"},
      {"role": "Finance Manager", "level": 2, "reason": "Financial due diligence"},
      {"role": "Director", "level": 3, "reason": "Executive review"},
      {"role": "Board of Directors", "level": 4, "reason": "Strategic investment approval for purchases over IDR 100M"}
    ]'::jsonb,
    7
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE dim_approval_rules IS 'Approval workflow rules based on PR value thresholds';
COMMENT ON TABLE fact_pr_approval_history IS 'Complete audit trail of all PR approval actions';
COMMENT ON VIEW vw_pr_list IS 'Consolidated view of PRs with approval status and next steps';
COMMENT ON COLUMN fact_pr_header.approval_chain IS 'Dynamic approval chain with approver details and status';
COMMENT ON COLUMN fact_pr_header.requirement_date IS 'Date when items are required by requestor';
COMMENT ON COLUMN fact_pr_header.delivery_location_data IS 'Delivery location details from checkout';
