/*
  # Clean All Sourcing Events Data

  1. Purpose
    - Completely remove all existing sourcing events and related data
    - Ensure Step 2 (Select Sourcing Event) and Manager Approval pages start empty
    - Only dynamically created events from Step 1 bundling should appear

  2. Tables Affected
    - `fact_sourcing_event` - All sourcing event records
    - `fact_tender_milestone` - Related milestones
    - `ref_tender_document` - Related tender documents
    - `ref_tender_announcement` - Tender announcements
    - `ref_tender_announcement_v2` - Tender announcements v2
    - `ref_document_submission_section` - Document submission sections
    - `ref_tender_evaluation` - Tender evaluations
    - `ref_winner_selection` - Winner selections
    - `ref_document_submission` - Document submissions
    - `fact_tender_scoring` - Tender scoring records
    - `ref_winner_announcement` - Winner announcements
    - `ref_reverse_auction` - Reverse auctions
    - `fact_reverse_auction_bid` - Auction bids

  3. Expected Result
    - Both pages display empty states by default
    - No mock or placeholder data remains
    - Clean slate for new sourcing events from AI bundling workflow

  4. Important Notes
    - This migration removes ALL sourcing events and related data
    - Data will only repopulate when users finalize bundles in Step 1
    - Empty state messages will guide users to create new events
*/

-- Delete reverse auction bids first (has foreign key to ref_reverse_auction)
DELETE FROM fact_reverse_auction_bid;

-- Delete reverse auctions (has foreign key to fact_sourcing_event)
DELETE FROM ref_reverse_auction;

-- Delete winner announcements (has foreign key to fact_sourcing_event and dim_vendor)
DELETE FROM ref_winner_announcement;

-- Delete tender scoring records (has foreign key to fact_sourcing_event)
DELETE FROM fact_tender_scoring;

-- Delete document submissions (has foreign key to fact_sourcing_event)
DELETE FROM ref_document_submission;

-- Delete winner selections (has foreign key to sourcing_event_id)
DELETE FROM ref_winner_selection;

-- Delete tender evaluations (has foreign key to sourcing_event_id)
DELETE FROM ref_tender_evaluation;

-- Delete document submission sections (has foreign key to sourcing_event_id)
DELETE FROM ref_document_submission_section;

-- Delete tender announcements v2 (has foreign key to sourcing_event_id)
DELETE FROM ref_tender_announcement_v2;

-- Delete tender announcements (has foreign key to fact_sourcing_event)
DELETE FROM ref_tender_announcement;

-- Delete tender milestones (has foreign key to fact_sourcing_event)
DELETE FROM fact_tender_milestone;

-- Delete tender documents (has foreign key to fact_sourcing_event)
DELETE FROM ref_tender_document;

-- Finally, delete all sourcing events
DELETE FROM fact_sourcing_event;

-- Reset any sequences if needed (optional, for clean IDs)
-- Note: UUID-based IDs don't need sequence resets
