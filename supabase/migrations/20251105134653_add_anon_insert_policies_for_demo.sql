/*
  # Add Anonymous Insert Policies for Demo Data Generation

  ## Overview
  Adds INSERT and UPDATE policies for anonymous users on procurement tables to enable
  mock data generation for demonstration purposes.

  ## Security Note
  This is for demonstration only. Production systems should use authenticated access.
*/

-- Drop existing policies if they exist (using DO block to handle errors)
DO $$
BEGIN
  -- fact_pr_header policies
  DROP POLICY IF EXISTS "Allow insert for anon on pr_header" ON fact_pr_header;
  DROP POLICY IF EXISTS "Allow update for anon on pr_header" ON fact_pr_header;
  
  -- fact_pr_line policies
  DROP POLICY IF EXISTS "Allow insert for anon on pr_line" ON fact_pr_line;
  DROP POLICY IF EXISTS "Allow update for anon on pr_line" ON fact_pr_line;
  
  -- fact_pr_approval_workflow policies
  DROP POLICY IF EXISTS "Allow insert for anon on pr_approval" ON fact_pr_approval_workflow;
  DROP POLICY IF EXISTS "Allow update for anon on pr_approval" ON fact_pr_approval_workflow;
  
  -- fact_order_monitoring policies
  DROP POLICY IF EXISTS "Allow insert for anon on order_monitoring" ON fact_order_monitoring;
  DROP POLICY IF EXISTS "Allow update for anon on order_monitoring" ON fact_order_monitoring;
  
  -- fact_order_tracking_milestones policies
  DROP POLICY IF EXISTS "Allow insert for anon on milestones" ON fact_order_tracking_milestones;
  
  -- fact_order_inspection policies
  DROP POLICY IF EXISTS "Allow insert for anon on inspection" ON fact_order_inspection;
  DROP POLICY IF EXISTS "Allow update for anon on inspection" ON fact_order_inspection;
  
  -- fact_goods_receipt policies
  DROP POLICY IF EXISTS "Allow insert for anon on gr" ON fact_goods_receipt;
  DROP POLICY IF EXISTS "Allow update for anon on gr" ON fact_goods_receipt;
  
  -- fact_po_header policies
  DROP POLICY IF EXISTS "Allow insert for anon on po" ON fact_po_header;
  DROP POLICY IF EXISTS "Allow update for anon on po" ON fact_po_header;
  
  -- fact_po_status_log policies
  DROP POLICY IF EXISTS "Allow insert for anon on po_log" ON fact_po_status_log;
  
  -- fact_item_master policies
  DROP POLICY IF EXISTS "Allow insert for anon on items" ON fact_item_master;
  DROP POLICY IF EXISTS "Allow update for anon on items" ON fact_item_master;
  
  -- fact_ba_pemeriksaan policies
  DROP POLICY IF EXISTS "Allow insert for anon on ba_pemeriks" ON fact_ba_pemeriksaan;
  DROP POLICY IF EXISTS "Allow update for anon on ba_pemeriks" ON fact_ba_pemeriksaan;
  
  -- fact_ba_serah_terima policies
  DROP POLICY IF EXISTS "Allow insert for anon on ba_serah" ON fact_ba_serah_terima;
  DROP POLICY IF EXISTS "Allow update for anon on ba_serah" ON fact_ba_serah_terima;
  
  -- fact_gr_header policies
  DROP POLICY IF EXISTS "Allow insert for anon on gr_header" ON fact_gr_header;
  DROP POLICY IF EXISTS "Allow update for anon on gr_header" ON fact_gr_header;
END$$;

-- Create new anonymous insert policies
CREATE POLICY "Allow insert for anon on pr_header" ON fact_pr_header FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow update for anon on pr_header" ON fact_pr_header FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon on pr_line" ON fact_pr_line FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow update for anon on pr_line" ON fact_pr_line FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon on pr_approval" ON fact_pr_approval_workflow FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow update for anon on pr_approval" ON fact_pr_approval_workflow FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon on order_monitoring" ON fact_order_monitoring FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow update for anon on order_monitoring" ON fact_order_monitoring FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon on milestones" ON fact_order_tracking_milestones FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow insert for anon on inspection" ON fact_order_inspection FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow update for anon on inspection" ON fact_order_inspection FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon on gr" ON fact_goods_receipt FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow update for anon on gr" ON fact_goods_receipt FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon on po" ON fact_po_header FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow update for anon on po" ON fact_po_header FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon on po_log" ON fact_po_status_log FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow insert for anon on items" ON fact_item_master FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow update for anon on items" ON fact_item_master FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon on ba_pemeriks" ON fact_ba_pemeriksaan FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow update for anon on ba_pemeriks" ON fact_ba_pemeriksaan FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon on ba_serah" ON fact_ba_serah_terima FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow update for anon on ba_serah" ON fact_ba_serah_terima FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon on gr_header" ON fact_gr_header FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow update for anon on gr_header" ON fact_gr_header FOR UPDATE TO anon USING (true) WITH CHECK (true);
