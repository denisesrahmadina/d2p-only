/*
  # Update Organizations Table ID to UUID
  
  1. Changes
    - Rename existing `id` column to `org_id`
    - Add new `id` column as UUID primary key
    - Generate UUIDs for existing records
    - Update RLS policies to use new primary key
  
  2. Data Safety
    - Preserves all existing organization IDs in `org_id` column
    - Uses conditional checks to prevent errors if already applied
    - Maintains data integrity throughout migration
*/

-- Step 1: Check if org_id column already exists, if not proceed with migration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organizations' AND column_name = 'org_id'
  ) THEN
    -- Add new UUID column that will become the primary key
    ALTER TABLE organizations ADD COLUMN new_id uuid DEFAULT gen_random_uuid();
    
    -- Populate UUIDs for existing records
    UPDATE organizations SET new_id = gen_random_uuid() WHERE new_id IS NULL;
    
    -- Make new_id NOT NULL
    ALTER TABLE organizations ALTER COLUMN new_id SET NOT NULL;
    
    -- Drop old primary key constraint
    ALTER TABLE organizations DROP CONSTRAINT organizations_pkey;
    
    -- Rename old id to org_id
    ALTER TABLE organizations RENAME COLUMN id TO org_id;
    
    -- Rename new_id to id
    ALTER TABLE organizations RENAME COLUMN new_id TO id;
    
    -- Add new primary key constraint
    ALTER TABLE organizations ADD PRIMARY KEY (id);
    
    -- Create index on org_id for lookups
    CREATE INDEX IF NOT EXISTS idx_organizations_org_id ON organizations(org_id);
  END IF;
END $$;

-- Step 2: Update RLS policies
DROP POLICY IF EXISTS "Anyone can view organizations" ON organizations;

CREATE POLICY "Anyone can view organizations"
  ON organizations
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert organizations" ON organizations;

CREATE POLICY "Authenticated users can insert organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update organizations" ON organizations;

CREATE POLICY "Authenticated users can update organizations"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete organizations" ON organizations;

CREATE POLICY "Authenticated users can delete organizations"
  ON organizations
  FOR DELETE
  TO authenticated
  USING (true);