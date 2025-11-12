/*
  # Update task_historical table RLS policies to allow anonymous access

  1. Changes
    - Drop existing authenticated-only policies
    - Add new policies that allow anonymous (anon) role to read and insert task history
    
  2. Security Notes
    - Since this is a demo/internal application with custom auth,
      allowing anon access is acceptable
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can read all task history" ON task_historical;
DROP POLICY IF EXISTS "Authenticated users can insert task history" ON task_historical;

-- Create new policies for anon role
CREATE POLICY "Allow anon to read all task history"
  ON task_historical FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow anon to insert task history"
  ON task_historical FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);