/*
  # Update organizations table RLS policies for public read access

  1. Changes
    - Drop existing restrictive SELECT policy
    - Add new policy allowing anonymous users to read organizations
    - This enables the login page to load organizations before authentication

  2. Security Notes
    - Organizations are non-sensitive data that needs to be visible on login page
    - Write operations remain restricted to authenticated users only
    - This is a common pattern for public-facing selection data
*/

-- Drop the existing restrictive read policy
DROP POLICY IF EXISTS "Anyone can read organizations" ON organizations;

-- Create new policy allowing anonymous (anon) role to read organizations
CREATE POLICY "Public can read organizations"
  ON organizations
  FOR SELECT
  TO anon
  USING (true);

-- Also allow authenticated users to read (keeping existing functionality)
CREATE POLICY "Authenticated can read organizations"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (true);