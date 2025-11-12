/*
  # Add Tender Announcement Fields to Sourcing Events

  1. New Fields
    - `sourcing_event_id` (text) - Human-readable event ID
    - `sourcing_event_name` (text) - Event display name
    - `material_id` (text) - Primary material identifier
    - `material_qty` (text) - Quantity description
    - `tender_start_date` (date) - Tender opening date
    - `tender_end_date` (date) - Tender closing date
    - `event_status` (text) - Status for external display
    - `estimated_price` (numeric) - Price estimate
    - `currency` (text) - Currency code

  2. Purpose
    - Support external tender announcement view
    - Provide fields needed for public tender display
    - Enable better filtering and search capabilities
*/

DO $$
BEGIN
  -- Add sourcing_event_id (human-readable ID)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'sourcing_event_id'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN sourcing_event_id text;
  END IF;

  -- Add sourcing_event_name
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'sourcing_event_name'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN sourcing_event_name text;
  END IF;

  -- Add material_id (primary material)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'material_id'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN material_id text;
  END IF;

  -- Add material_qty
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'material_qty'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN material_qty text;
  END IF;

  -- Add tender_start_date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'tender_start_date'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN tender_start_date date;
  END IF;

  -- Add tender_end_date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'tender_end_date'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN tender_end_date date;
  END IF;

  -- Add event_status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'event_status'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN event_status text;
  END IF;

  -- Add estimated_price
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'estimated_price'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN estimated_price numeric;
  END IF;

  -- Add currency
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'currency'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN currency text DEFAULT 'IDR';
  END IF;

  -- Add description field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'description'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN description text;
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sourcing_event_id_text ON fact_sourcing_event(sourcing_event_id)
WHERE sourcing_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tender_dates ON fact_sourcing_event(tender_start_date, tender_end_date)
WHERE tender_start_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_event_status ON fact_sourcing_event(event_status)
WHERE event_status IS NOT NULL;

-- Allow anonymous users to read published tenders (for external view)
CREATE POLICY IF NOT EXISTS "Anonymous users can read published sourcing events"
  ON fact_sourcing_event FOR SELECT
  TO anon
  USING (event_status = 'Published' OR status = 'Published');
