/*
  # Split agentflow_id_url into separate columns

  1. Changes
    - Add new column `agentflow_id` (text) to store the flow ID
    - Add new column `agentflow_url` (text) to store the base URL
    - Migrate data from `agentflow_id_url` to the new columns
    - Drop the old `agentflow_id_url` column
    
  2. Data Migration
    - Extract flow ID from existing `agentflow_id_url` using regex
    - Set the base agentflow URL
    - Update the procurement-chat-agent with the specified values

  3. Notes
    - Uses conditional logic to prevent errors on re-run
    - Preserves existing data during migration
*/

-- Add new columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agents' AND column_name = 'agentflow_id'
  ) THEN
    ALTER TABLE agents ADD COLUMN agentflow_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agents' AND column_name = 'agentflow_url'
  ) THEN
    ALTER TABLE agents ADD COLUMN agentflow_url text;
  END IF;
END $$;

-- Migrate data from agentflow_id_url to new columns
-- Extract flow ID using regex pattern
UPDATE agents
SET 
  agentflow_id = (
    SELECT (regexp_matches(agentflow_id_url, 'canvas/([a-f0-9-]+)'))[1]
    WHERE agentflow_id_url IS NOT NULL
  ),
  agentflow_url = 'https://agentconsole.accentureid.ai/v2/agentcanvas/'
WHERE agentflow_id_url IS NOT NULL AND agentflow_id IS NULL;

-- Specifically update the procurement-chat-agent with provided values
UPDATE agents
SET 
  agentflow_id = '47f06086-82e7-4f66-a9f8-2eaf2e6ee786',
  agentflow_url = 'https://agentconsole.accentureid.ai/v2/agentcanvas/'
WHERE agent_id = 'procurement-chat-agent';

-- Drop the old column if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agents' AND column_name = 'agentflow_id_url'
  ) THEN
    ALTER TABLE agents DROP COLUMN agentflow_id_url;
  END IF;
END $$;
