/*
  # Update agents table structure

  1. Changes
    - Add new `id` column with UUID type as primary key
    - Rename existing `id` column to `agent_id`
    - Update all foreign key references and indexes
    - Preserve all existing data

  2. Steps
    - Drop existing primary key constraint
    - Rename `id` column to `agent_id`
    - Add new `id` column with UUID and set as primary key
    - Update indexes to use new structure
    - Preserve unique constraint on `agent_id`
*/

-- Drop the existing primary key
ALTER TABLE agents DROP CONSTRAINT IF EXISTS agents_pkey;

-- Rename the existing id column to agent_id
ALTER TABLE agents RENAME COLUMN id TO agent_id;

-- Add the new UUID id column with default value
ALTER TABLE agents ADD COLUMN id uuid DEFAULT gen_random_uuid();

-- Update all existing rows to have UUID values
UPDATE agents SET id = gen_random_uuid() WHERE id IS NULL;

-- Make the new id column NOT NULL
ALTER TABLE agents ALTER COLUMN id SET NOT NULL;

-- Set the new id column as the primary key
ALTER TABLE agents ADD PRIMARY KEY (id);

-- Add unique constraint on agent_id to maintain uniqueness
ALTER TABLE agents ADD CONSTRAINT agents_agent_id_key UNIQUE (agent_id);

-- Recreate indexes
DROP INDEX IF EXISTS agents_organization_id_idx;
DROP INDEX IF EXISTS agents_department_id_idx;
DROP INDEX IF EXISTS agents_status_idx;

CREATE INDEX agents_organization_id_idx ON agents(organization_id);
CREATE INDEX agents_department_id_idx ON agents(department_id);
CREATE INDEX agents_status_idx ON agents(status);
CREATE INDEX agents_agent_id_idx ON agents(agent_id);
