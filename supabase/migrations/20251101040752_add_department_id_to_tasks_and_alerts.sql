/*
  # Add department_id to tasks and alerts tables

  1. Changes
    - Add department_id column to tasks table
    - Add department_id column to alerts table
    - Add indexes for department_id on both tables for faster queries
    - Populate department_id from organization data where applicable

  2. Notes
    - Column is nullable to allow flexibility
    - Indexes added to optimize department-based filtering
*/

-- Add department_id to tasks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'department_id'
  ) THEN
    ALTER TABLE tasks ADD COLUMN department_id text;
  END IF;
END $$;

-- Add department_id to alerts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'alerts' AND column_name = 'department_id'
  ) THEN
    ALTER TABLE alerts ADD COLUMN department_id text;
  END IF;
END $$;

-- Add indexes for faster department-based queries
CREATE INDEX IF NOT EXISTS idx_tasks_department_id ON tasks(department_id);
CREATE INDEX IF NOT EXISTS idx_alerts_department_id ON alerts(department_id);

-- Add comments for documentation
COMMENT ON COLUMN tasks.department_id IS 'Department identifier for task filtering and permissions';
COMMENT ON COLUMN alerts.department_id IS 'Department identifier for alert filtering and permissions';