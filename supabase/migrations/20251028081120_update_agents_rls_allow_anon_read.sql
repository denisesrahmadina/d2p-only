/*
  # Update agents RLS to allow anonymous read access

  1. Changes
    - Add policy to allow anonymous (anon) users to read agents
    - This enables the frontend to fetch agents using the anon key
  
  2. Security
    - Read-only access for anonymous users
    - Write operations still require authentication
*/

-- Drop the existing read policy
DROP POLICY IF EXISTS "Anyone can read agents" ON agents;

-- Create new policy allowing both authenticated and anonymous users to read
CREATE POLICY "Allow public read access to agents"
  ON agents FOR SELECT
  TO authenticated, anon
  USING (true);
