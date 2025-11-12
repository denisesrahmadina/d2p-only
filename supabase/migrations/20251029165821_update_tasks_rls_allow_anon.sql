/*
  # Update tasks table RLS policies to allow anonymous access

  1. Changes
    - Drop existing authenticated-only policies
    - Add new policies that allow anonymous (anon) role to read and modify tasks
    - This is necessary because the app uses custom authentication via localStorage,
      not Supabase authentication
    
  2. Security Notes
    - Since this is a demo/internal application with custom auth,
      allowing anon access is acceptable
    - In production, you would integrate Supabase auth properly
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can read all tasks" ON tasks;
DROP POLICY IF EXISTS "Authenticated users can insert tasks" ON tasks;
DROP POLICY IF EXISTS "Authenticated users can update tasks" ON tasks;
DROP POLICY IF EXISTS "Authenticated users can delete tasks" ON tasks;

-- Create new policies for anon role
CREATE POLICY "Allow anon to read all tasks"
  ON tasks FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow anon to insert tasks"
  ON tasks FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anon to update tasks"
  ON tasks FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to delete tasks"
  ON tasks FOR DELETE
  TO anon, authenticated
  USING (true);