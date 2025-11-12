/*
  # Create task_historical table

  1. New Tables
    - `task_historical`
      - `id` (uuid, primary key) - Auto-generated UUID
      - `history_id` (text, unique) - Original history ID from JSON (e.g., hist-001)
      - `task_id` (text) - Reference to task_id in tasks table
      - `timestamp` (timestamptz) - When the change occurred
      - `from_status` (text) - Previous status (nullable)
      - `to_status` (text) - New status
      - `changed_by` (text) - Who made the change
      - `changed_by_type` (text) - Type of changer (human/ai_agent/system)
      - `reason` (text) - Reason for the change
      - `notes` (text) - Additional notes
      - `assigned_to` (text) - Who it was assigned to (nullable)
      - `assigned_to_type` (text) - Type of assignee (nullable)
      - `priority` (text) - Priority at time of change
      - `category` (text) - Category at time of change
      - `created_at` (timestamptz) - Record creation timestamp
      
  2. Security
    - Enable RLS on `task_historical` table
    - Add policy for authenticated users to read all history records
    - Add policy for authenticated users to insert history records
    
  3. Indexes
    - Index on history_id for fast lookups
    - Index on task_id for filtering by task
    - Index on timestamp for chronological queries
*/

CREATE TABLE IF NOT EXISTS task_historical (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  history_id text UNIQUE NOT NULL,
  task_id text NOT NULL,
  timestamp timestamptz NOT NULL,
  from_status text,
  to_status text NOT NULL,
  changed_by text NOT NULL,
  changed_by_type text DEFAULT 'human',
  reason text DEFAULT '',
  notes text DEFAULT '',
  assigned_to text,
  assigned_to_type text,
  priority text DEFAULT 'medium',
  category text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE task_historical ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Authenticated users can read all task history"
  ON task_historical FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert task history"
  ON task_historical FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_task_historical_history_id ON task_historical(history_id);
CREATE INDEX IF NOT EXISTS idx_task_historical_task_id ON task_historical(task_id);
CREATE INDEX IF NOT EXISTS idx_task_historical_timestamp ON task_historical(timestamp DESC);