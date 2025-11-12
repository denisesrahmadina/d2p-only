/*
  # Procurement Planning Enhancement - Add Fields for AI Insights and Images

  1. Updates to Existing Tables
    - `fact_procurement_request`
      - Add image_url field for material/service pictures
      - Add ai_insights JSONB field for hover-over insights
    
    - `fact_sourcing_event`
      - Add sourcing_event_line_id field if not exists
      - Add bundle_insights JSONB field for consolidation analysis
    
    - `ref_bundling_recommendation`
      - Add bundle_insights JSONB for hover insights
      - Add tender_count_reduction for efficiency metrics
    
    - `fact_procurement_checklist`
      - Add redirect_url field for navigation to document creation

  2. Indexes
    - Add index on image_url for faster image retrieval
    - Add index on ai_insights for JSONB queries

  3. Notes
    - All changes use IF NOT EXISTS to prevent errors on re-run
    - Existing data is preserved
    - Fields are nullable for backward compatibility
*/

-- Add fields to fact_procurement_request
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN image_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_request' AND column_name = 'ai_insights'
  ) THEN
    ALTER TABLE fact_procurement_request ADD COLUMN ai_insights jsonb;
  END IF;
END $$;

-- Add fields to fact_sourcing_event
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'sourcing_event_line_id'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN sourcing_event_line_id bigint;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'bundle_insights'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN bundle_insights jsonb;
  END IF;
END $$;

-- Add fields to ref_bundling_recommendation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_bundling_recommendation' AND column_name = 'bundle_insights'
  ) THEN
    ALTER TABLE ref_bundling_recommendation ADD COLUMN bundle_insights jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ref_bundling_recommendation' AND column_name = 'tender_count_reduction'
  ) THEN
    ALTER TABLE ref_bundling_recommendation ADD COLUMN tender_count_reduction integer;
  END IF;
END $$;

-- Add fields to fact_procurement_checklist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_procurement_checklist' AND column_name = 'redirect_url'
  ) THEN
    ALTER TABLE fact_procurement_checklist ADD COLUMN redirect_url text;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_procurement_request_image ON fact_procurement_request(image_url) WHERE image_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_procurement_request_ai_insights ON fact_procurement_request USING gin(ai_insights) WHERE ai_insights IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sourcing_event_line_id ON fact_sourcing_event(sourcing_event_line_id) WHERE sourcing_event_line_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sourcing_event_bundle_insights ON fact_sourcing_event USING gin(bundle_insights) WHERE bundle_insights IS NOT NULL;