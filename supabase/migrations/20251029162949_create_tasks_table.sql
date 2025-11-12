/*
  # Create tasks table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key) - Auto-generated UUID
      - `task_id` (text, unique) - Original ticket ID from JSON (e.g., TKT-001)
      - `organization_id` (text) - Organization identifier
      - `title` (text) - Task title
      - `description` (text) - Task description
      - `type` (text) - Task type (automated/manual)
      - `source` (text) - Source system (e.g., SAP_ERP, HR_SYSTEM)
      - `source_event` (text) - Event that triggered the task
      - `priority` (text) - Priority level (low/medium/high)
      - `status` (text) - Current status
      - `assigned_to` (text) - Assigned person or agent ID
      - `assigned_to_type` (text) - Type of assignee (human/ai_agent)
      - `created_by` (text) - Creator identifier
      - `created_date` (timestamptz) - Creation timestamp
      - `last_updated` (timestamptz) - Last update timestamp
      - `due_date` (timestamptz) - Due date
      - `category` (text) - Task category
      - `tags` (jsonb) - Array of tags
      - `sap_document` (jsonb) - SAP document details
      
  2. Security
    - Enable RLS on `tasks` table
    - Add policy for authenticated users to read all tasks
    - Add policy for authenticated users to insert tasks
    - Add policy for authenticated users to update tasks
    - Add policy for authenticated users to delete tasks
    
  3. Indexes
    - Index on task_id for fast lookups
    - Index on organization_id for filtering
    - Index on status for filtering
    - Index on assigned_to for filtering
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id text UNIQUE NOT NULL,
  organization_id text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  type text DEFAULT 'manual',
  source text DEFAULT '',
  source_event text DEFAULT '',
  priority text DEFAULT 'medium',
  status text DEFAULT 'Created',
  assigned_to text DEFAULT '',
  assigned_to_type text DEFAULT 'human',
  created_by text DEFAULT '',
  created_date timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now(),
  due_date timestamptz,
  category text DEFAULT '',
  tags jsonb DEFAULT '[]'::jsonb,
  sap_document jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Authenticated users can read all tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_task_id ON tasks(task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_organization_id ON tasks(organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);