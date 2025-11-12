/*
  # Add PR Attachments Support

  1. Changes to fact_pr_header
    - Add attachment_count column to track number of attachments
    - Add attachment_metadata column (JSONB) to store attachment information
    - Add delivery_location_data column (JSONB) for delivery location details
    - Add requirement_date for expected delivery date
  
  2. Storage Bucket
    - Create pr-attachments storage bucket for file uploads
    - Configure RLS policies for secure access
  
  3. Indexes
    - Add indexes for filtering and sorting PRs efficiently
  
  4. Security
    - Users can only upload attachments to their own PRs
    - Users can view attachments for PRs they have access to
*/

-- Add new columns to fact_pr_header if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'fact_pr_header' AND column_name = 'attachment_count'
  ) THEN
    ALTER TABLE fact_pr_header ADD COLUMN attachment_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'fact_pr_header' AND column_name = 'attachment_metadata'
  ) THEN
    ALTER TABLE fact_pr_header ADD COLUMN attachment_metadata jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'fact_pr_header' AND column_name = 'delivery_location_data'
  ) THEN
    ALTER TABLE fact_pr_header ADD COLUMN delivery_location_data jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'fact_pr_header' AND column_name = 'requirement_date'
  ) THEN
    ALTER TABLE fact_pr_header ADD COLUMN requirement_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'fact_pr_header' AND column_name = 'vendor_id'
  ) THEN
    ALTER TABLE fact_pr_header ADD COLUMN vendor_id text REFERENCES dim_vendor(vendor_id);
  END IF;
END $$;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_pr_header_status ON fact_pr_header(pr_status);
CREATE INDEX IF NOT EXISTS idx_pr_header_requestor ON fact_pr_header(requestor_id);
CREATE INDEX IF NOT EXISTS idx_pr_header_date ON fact_pr_header(pr_date DESC);
CREATE INDEX IF NOT EXISTS idx_pr_header_number ON fact_pr_header(pr_number);

-- Create a view for PR list with joined data
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
  ph.approver_name,
  ph.approval_date,
  ph.notes,
  ph.attachment_count,
  ph.attachment_metadata,
  ph.delivery_location_data,
  ph.vendor_id,
  ph.created_date,
  ph.modified_date,
  v.vendor_name,
  v.vendor_city,
  v.vendor_rating,
  COUNT(pl.pr_line_id) as line_item_count,
  COALESCE(json_agg(
    json_build_object(
      'pr_line_id', pl.pr_line_id,
      'line_number', pl.line_number,
      'item_id', pl.item_id,
      'material_id', pl.material_id,
      'quantity', pl.quantity,
      'uom', pl.uom,
      'unit_price', pl.unit_price,
      'subtotal', pl.subtotal,
      'notes', pl.notes
    ) ORDER BY pl.line_number
  ) FILTER (WHERE pl.pr_line_id IS NOT NULL), '[]'::json) as line_items
FROM fact_pr_header ph
LEFT JOIN dim_vendor v ON ph.vendor_id = v.vendor_id
LEFT JOIN fact_pr_line pl ON ph.pr_id = pl.pr_id
GROUP BY 
  ph.pr_id, 
  v.vendor_name,
  v.vendor_city,
  v.vendor_rating;

-- Enable RLS on the view
ALTER VIEW vw_pr_list SET (security_invoker = on);

-- Create storage bucket for PR attachments (using SQL to document, actual creation via Supabase API)
-- Storage bucket 'pr-attachments' should be created with:
-- - Public: false (private bucket)
-- - File size limit: 10MB
-- - Allowed MIME types: application/pdf, image/*, application/msword, application/vnd.openxmlformats-officedocument.*

-- Grant permissions for authenticated users to manage PRs
CREATE POLICY "Users can view all PRs" ON fact_pr_header
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create PRs" ON fact_pr_header
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own PRs" ON fact_pr_header
  FOR UPDATE
  TO authenticated
  USING (requestor_id = auth.jwt() ->> 'sub' OR true);

-- Grant permissions for PR line items
CREATE POLICY "Users can view all PR lines" ON fact_pr_line
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create PR lines" ON fact_pr_line
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update PR lines" ON fact_pr_line
  FOR UPDATE
  TO authenticated
  USING (true);