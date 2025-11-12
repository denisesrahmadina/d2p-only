/*
  # Ensure Contract Reference Column and Create PR List View

  ## Overview
  Ensures contract_reference column exists on fact_pr_line and creates comprehensive
  view for PR listing.

  ## Changes
  1. Add contract_reference column if missing
  2. Create vw_pr_list view for comprehensive PR display
*/

-- Ensure contract_reference column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_pr_line' AND column_name = 'contract_reference'
  ) THEN
    ALTER TABLE fact_pr_line ADD COLUMN contract_reference text REFERENCES dim_contract(contract_id);
    CREATE INDEX IF NOT EXISTS idx_pr_line_contract_reference ON fact_pr_line(contract_reference);
  END IF;
END $$;

-- Drop existing view if exists
DROP VIEW IF EXISTS vw_pr_list CASCADE;

-- Create comprehensive PR list view
CREATE OR REPLACE VIEW vw_pr_list AS
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
  ph.notes,
  ph.attachment_count,
  ph.attachment_metadata,
  ph.delivery_location_data,
  ph.approval_chain,
  ph.created_date,
  ph.modified_date,
  
  -- Aggregate line item count
  COUNT(pl.pr_line_id) as line_item_count,
  
  -- Current approval step
  (
    SELECT approver_name 
    FROM fact_pr_approval_workflow 
    WHERE pr_id = ph.pr_id 
      AND approval_status = 'PENDING' 
    ORDER BY approval_level, approval_sequence 
    LIMIT 1
  ) as next_approver_name,
  
  (
    SELECT approver_role 
    FROM fact_pr_approval_workflow 
    WHERE pr_id = ph.pr_id 
      AND approval_status = 'PENDING' 
    ORDER BY approval_level, approval_sequence 
    LIMIT 1
  ) as current_approval_step,
  
  -- Collect line items as JSON array
  COALESCE(
    json_agg(
      json_build_object(
        'pr_line_id', pl.pr_line_id,
        'line_number', pl.line_number,
        'material_id', pl.material_id,
        'quantity', pl.quantity,
        'uom', pl.uom,
        'unit_price', pl.unit_price,
        'subtotal', pl.subtotal,
        'notes', pl.notes,
        'contract_reference', pl.contract_reference
      ) ORDER BY pl.line_number
    ) FILTER (WHERE pl.pr_line_id IS NOT NULL),
    '[]'::json
  ) as line_items

FROM fact_pr_header ph
LEFT JOIN dim_vendor v ON ph.vendor_id = v.vendor_id
LEFT JOIN fact_pr_line pl ON ph.pr_id = pl.pr_id
GROUP BY 
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
  ph.notes,
  ph.attachment_count,
  ph.attachment_metadata,
  ph.delivery_location_data,
  ph.approval_chain,
  ph.created_date,
  ph.modified_date;

-- Add comment
COMMENT ON VIEW vw_pr_list IS 'Comprehensive view for PR listing with vendor details, line items, and approval workflow status';
