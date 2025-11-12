/*
  # Marketplace and Order Tracking Enhancements

  1. New Columns
    - `fact_procurement_request.approval_chain` (jsonb)
      - Stores dynamic approval stages based on PR value
      - Contains approver information, status, timestamps, and comments

    - `fact_purchase_order.linked_ba_id` (bigint)
      - Reference to automatically generated BA document
      - Links order inspection to BA document workflow

    - `dim_berita_acara.source_po_number` (text)
      - Tracks which PO triggered BA generation
      - Enables traceability from order to BA document

  2. Security
    - All tables already have RLS enabled
    - No new policy changes required

  3. Important Notes
    - Approval chain structure supports multiple approval levels
    - BA-PO linking enables automatic document generation workflow
    - Source PO tracking provides complete audit trail
*/

-- Add approval_chain column to fact_procurement_request
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'approval_chain'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN approval_chain jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add linked_ba_id column to fact_purchase_order
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_purchase_order' AND column_name = 'linked_ba_id'
  ) THEN
    ALTER TABLE fact_purchase_order ADD COLUMN linked_ba_id bigint REFERENCES dim_berita_acara(ba_id);
  END IF;
END $$;

-- Add source_po_number column to dim_berita_acara
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_berita_acara' AND column_name = 'source_po_number'
  ) THEN
    ALTER TABLE dim_berita_acara ADD COLUMN source_po_number text;
  END IF;
END $$;

-- Create index for BA-PO lookups
CREATE INDEX IF NOT EXISTS idx_berita_acara_source_po ON dim_berita_acara(source_po_number);
CREATE INDEX IF NOT EXISTS idx_purchase_order_linked_ba ON fact_purchase_order(linked_ba_id);
CREATE INDEX IF NOT EXISTS idx_procurement_request_status_value ON fact_procurement_request(pr_status, pr_value);

-- Add comment for documentation
COMMENT ON COLUMN fact_procurement_request.approval_chain IS 'Dynamic approval stages based on PR value - contains approver info, status, timestamps';
COMMENT ON COLUMN fact_purchase_order.linked_ba_id IS 'Reference to automatically generated BA document from inspection';
COMMENT ON COLUMN dim_berita_acara.source_po_number IS 'Purchase Order number that triggered BA generation';
