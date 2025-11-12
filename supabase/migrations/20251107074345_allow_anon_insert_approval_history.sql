/*
  # Allow Anonymous Inserts for Approval History (Demo Only)
  
  Adds a policy to allow anonymous users to insert approval history records.
  This is for demo/development purposes only.
*/

CREATE POLICY "Allow anon insert for demo"
  ON fact_pr_approval_history FOR INSERT
  TO anon
  WITH CHECK (true);
