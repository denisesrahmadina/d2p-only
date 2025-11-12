/*
  # Add agentflow_id_url column to agents table

  1. Changes
    - Add `agentflow_id_url` column to agents table
    - Column is optional (nullable) text field
    - Stores URL to agent flow canvas

  2. Notes
    - This field will store links to the agent flow visualization/configuration
*/

-- Add agentflow_id_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agents' AND column_name = 'agentflow_id_url'
  ) THEN
    ALTER TABLE agents ADD COLUMN agentflow_id_url text;
  END IF;
END $$;
