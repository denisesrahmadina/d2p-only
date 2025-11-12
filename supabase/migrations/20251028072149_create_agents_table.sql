/*
  # Create agents table

  1. New Tables
    - `agents`
      - `id` (text, primary key) - Agent identifier
      - `organization_id` (text, not null) - Reference to organizations table
      - `department_id` (text, not null) - Department identifier
      - `name` (text, not null) - Agent name
      - `goals` (text) - Agent goals description
      - `description` (text) - Agent description
      - `icon` (text) - Agent icon (emoji)
      - `color` (text) - Agent color class
      - `capabilities` (jsonb) - Array of agent capabilities
      - `business_benefit` (text) - Business benefit description
      - `status` (text, not null, default 'active') - Agent status
      - `last_updated` (text) - Last updated timestamp description
      - `llm` (jsonb) - LLM configuration object
      - `prompt` (jsonb) - Prompt configuration object
      - `tools` (jsonb) - Array of tools
      - `ai_app_url` (text) - Optional AI application URL
      - `created_at` (timestamptz, default now()) - Creation timestamp
      - `updated_at` (timestamptz, default now()) - Last update timestamp

  2. Security
    - Enable RLS on `agents` table
    - Add policy for authenticated users to read all agents
    - Add policy for authenticated users to create agents (for admins)
    - Add policy for authenticated users to update agents (for admins)
    - Add policy for authenticated users to delete agents (for admins)

  3. Indexes
    - Create index on organization_id for efficient filtering
    - Create index on department_id for efficient filtering
    - Create index on status for status-based queries
*/

CREATE TABLE IF NOT EXISTS agents (
  id text PRIMARY KEY,
  organization_id text NOT NULL,
  department_id text NOT NULL,
  name text NOT NULL,
  goals text,
  description text,
  icon text,
  color text,
  capabilities jsonb DEFAULT '[]'::jsonb,
  business_benefit text,
  status text NOT NULL DEFAULT 'active',
  last_updated text,
  llm jsonb,
  prompt jsonb,
  tools jsonb DEFAULT '[]'::jsonb,
  ai_app_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agents_organization_id_idx ON agents(organization_id);
CREATE INDEX IF NOT EXISTS agents_department_id_idx ON agents(department_id);
CREATE INDEX IF NOT EXISTS agents_status_idx ON agents(status);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read agents"
  ON agents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create agents"
  ON agents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update agents"
  ON agents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete agents"
  ON agents FOR DELETE
  TO authenticated
  USING (true);
