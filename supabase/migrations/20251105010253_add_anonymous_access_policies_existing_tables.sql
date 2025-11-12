/*
  # Add Anonymous Access Policies for Demo Application

  ## Summary
  This migration adds anonymous (public) access policies to all existing e-procurement tables
  to allow the demo application to function without Supabase authentication.
  
  ## Rationale
  The application uses custom localStorage-based authentication and does not integrate
  with Supabase Auth. For demo purposes, we enable anonymous access to bypass RLS
  authentication requirements while maintaining the existing authenticated policies
  for future migration.

  ## Security Note
  ⚠️ This configuration is ONLY suitable for:
  - Demo environments
  - Development environments
  - Internal trusted networks
  
  For production deployments with external access, proper Supabase authentication
  should be implemented and these anonymous policies should be removed.

  ## Tables Updated
  The following tables receive anonymous access policies:
  
  1. **fact_sourcing_event** - Core sourcing event data (PRIMARY FIX)
  2. **fact_procurement_request** - Procurement requests
  3. **ref_bundling_recommendation** - AI bundling recommendations
  4. **ref_tender_document** - Tender document templates
  5. **dim_vendor** - Vendor master data
  6. **ref_document_submission** - Vendor submissions
  7. **fact_tender_scoring** - Evaluation scores
  8. **ref_winner_announcement** - Winner announcements
  9. **ref_tender_announcement_v2** - Public tender announcements

  ## Policy Structure
  Each table receives four policies for anonymous users:
  - SELECT: Read all records (no restrictions)
  - INSERT: Create new records (no restrictions)
  - UPDATE: Modify any record (no restrictions)
  - DELETE: Remove any record (no restrictions)

  ## Existing Policies
  All existing authenticated user policies remain in place for future migration
  to proper authentication.
*/

-- =====================================================
-- FACT_SOURCING_EVENT - Anonymous Access Policies
-- =====================================================

CREATE POLICY "Anonymous users can read sourcing events"
  ON fact_sourcing_event FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can create sourcing events"
  ON fact_sourcing_event FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update sourcing events"
  ON fact_sourcing_event FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete sourcing events"
  ON fact_sourcing_event FOR DELETE
  TO anon
  USING (true);

-- =====================================================
-- FACT_PROCUREMENT_REQUEST - Anonymous Access Policies
-- =====================================================

CREATE POLICY "Anonymous users can read procurement requests"
  ON fact_procurement_request FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can create procurement requests"
  ON fact_procurement_request FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update procurement requests"
  ON fact_procurement_request FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete procurement requests"
  ON fact_procurement_request FOR DELETE
  TO anon
  USING (true);

-- =====================================================
-- REF_BUNDLING_RECOMMENDATION - Anonymous Access Policies
-- =====================================================

CREATE POLICY "Anonymous users can read bundling recommendations"
  ON ref_bundling_recommendation FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can create bundling recommendations"
  ON ref_bundling_recommendation FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update bundling recommendations"
  ON ref_bundling_recommendation FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete bundling recommendations"
  ON ref_bundling_recommendation FOR DELETE
  TO anon
  USING (true);

-- =====================================================
-- REF_TENDER_DOCUMENT - Anonymous Access Policies
-- =====================================================

CREATE POLICY "Anonymous users can read tender documents"
  ON ref_tender_document FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can create tender documents"
  ON ref_tender_document FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update tender documents"
  ON ref_tender_document FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete tender documents"
  ON ref_tender_document FOR DELETE
  TO anon
  USING (true);

-- =====================================================
-- DIM_VENDOR - Anonymous Access Policies
-- =====================================================

CREATE POLICY "Anonymous users can read vendors"
  ON dim_vendor FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can create vendors"
  ON dim_vendor FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update vendors"
  ON dim_vendor FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete vendors"
  ON dim_vendor FOR DELETE
  TO anon
  USING (true);

-- =====================================================
-- REF_DOCUMENT_SUBMISSION - Anonymous Access Policies
-- =====================================================

CREATE POLICY "Anonymous users can read document submissions"
  ON ref_document_submission FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can create document submissions"
  ON ref_document_submission FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update document submissions"
  ON ref_document_submission FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete document submissions"
  ON ref_document_submission FOR DELETE
  TO anon
  USING (true);

-- =====================================================
-- FACT_TENDER_SCORING - Anonymous Access Policies
-- =====================================================

CREATE POLICY "Anonymous users can read tender scores"
  ON fact_tender_scoring FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can create tender scores"
  ON fact_tender_scoring FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update tender scores"
  ON fact_tender_scoring FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete tender scores"
  ON fact_tender_scoring FOR DELETE
  TO anon
  USING (true);

-- =====================================================
-- REF_WINNER_ANNOUNCEMENT - Anonymous Access Policies
-- =====================================================

CREATE POLICY "Anonymous users can read winner announcements"
  ON ref_winner_announcement FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can create winner announcements"
  ON ref_winner_announcement FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update winner announcements"
  ON ref_winner_announcement FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete winner announcements"
  ON ref_winner_announcement FOR DELETE
  TO anon
  USING (true);

-- =====================================================
-- REF_TENDER_ANNOUNCEMENT_V2 - Anonymous Access Policies
-- =====================================================

CREATE POLICY "Anonymous users can read tender announcements v2"
  ON ref_tender_announcement_v2 FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can create tender announcements v2"
  ON ref_tender_announcement_v2 FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update tender announcements v2"
  ON ref_tender_announcement_v2 FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete tender announcements v2"
  ON ref_tender_announcement_v2 FOR DELETE
  TO anon
  USING (true);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify all policies are created
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND policyname LIKE '%Anonymous%';
  
  RAISE NOTICE 'Total anonymous access policies created: %', policy_count;
  
  IF policy_count >= 36 THEN
    RAISE NOTICE '✅ All anonymous access policies successfully created';
  ELSE
    RAISE WARNING '⚠️ Expected at least 36 policies, but only % were created', policy_count;
  END IF;
END $$;
