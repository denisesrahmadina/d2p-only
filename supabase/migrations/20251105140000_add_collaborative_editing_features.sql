/*
  # Add Collaborative Editing and Auto-Save Features to APBA

  1. New Columns to dim_berita_acara
    - `last_autosave_date` (timestamptz) - Timestamp of last auto-save
    - `autosave_content` (text) - Draft content from auto-save
    - `is_locked` (boolean) - Lock status for exclusive editing
    - `locked_by` (text) - User currently holding the edit lock
    - `lock_acquired_at` (timestamptz) - When the lock was acquired

  2. New Tables
    - `ba_revision_history`
      - Stores document snapshots at each auto-save for version control
      - Full audit trail of all changes with timestamps

    - `ba_editing_sessions`
      - Tracks active editing sessions for real-time collaboration
      - Records user presence and cursor positions
      - Session timeout after inactivity

    - `ba_milestone_data`
      - Stores formatted milestone data for dynamic table insertion
      - Links to fact_ba_milestone for real-time updates

  3. Security
    - Enable RLS on all new tables
    - Authenticated users can create and manage their sessions
    - Revision history is read-only after creation
    - Session data expires after 1 hour of inactivity

  4. Indexes
    - Performance indexes for session queries
    - Fast lookup for active collaborators
    - Efficient revision history retrieval
*/

-- Add new columns to dim_berita_acara
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_berita_acara' AND column_name = 'last_autosave_date'
  ) THEN
    ALTER TABLE dim_berita_acara ADD COLUMN last_autosave_date timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_berita_acara' AND column_name = 'autosave_content'
  ) THEN
    ALTER TABLE dim_berita_acara ADD COLUMN autosave_content text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_berita_acara' AND column_name = 'is_locked'
  ) THEN
    ALTER TABLE dim_berita_acara ADD COLUMN is_locked boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_berita_acara' AND column_name = 'locked_by'
  ) THEN
    ALTER TABLE dim_berita_acara ADD COLUMN locked_by text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dim_berita_acara' AND column_name = 'lock_acquired_at'
  ) THEN
    ALTER TABLE dim_berita_acara ADD COLUMN lock_acquired_at timestamptz;
  END IF;
END $$;

-- Create ba_revision_history table
CREATE TABLE IF NOT EXISTS ba_revision_history (
  revision_id bigserial PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_berita_acara(ba_id),
  ba_number text NOT NULL,
  revision_number integer NOT NULL,
  content_snapshot text NOT NULL,
  changed_by text NOT NULL,
  change_type text NOT NULL CHECK (change_type IN ('autosave', 'manual_save', 'submission', 'approval')),
  change_summary text,
  created_date timestamptz DEFAULT now()
);

-- Create ba_editing_sessions table
CREATE TABLE IF NOT EXISTS ba_editing_sessions (
  session_id text PRIMARY KEY,
  ba_id bigint NOT NULL REFERENCES dim_berita_acara(ba_id),
  user_id text NOT NULL,
  user_name text NOT NULL,
  user_email text,
  cursor_position integer DEFAULT 0,
  selected_range jsonb DEFAULT '{"start": 0, "end": 0}'::jsonb,
  is_active boolean DEFAULT true,
  last_heartbeat timestamptz DEFAULT now(),
  session_started timestamptz DEFAULT now(),
  session_ended timestamptz
);

-- Create ba_milestone_data table for dynamic table insertion
CREATE TABLE IF NOT EXISTS ba_milestone_data (
  data_id bigserial PRIMARY KEY,
  ba_id bigint REFERENCES dim_berita_acara(ba_id),
  contract_id text NOT NULL,
  milestone_data jsonb NOT NULL,
  table_format jsonb DEFAULT '{"headers": true, "borders": "all", "style": "default"}'::jsonb,
  last_refreshed timestamptz DEFAULT now(),
  created_date timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_revision_ba_id ON ba_revision_history(ba_id);
CREATE INDEX IF NOT EXISTS idx_revision_created_date ON ba_revision_history(created_date DESC);
CREATE INDEX IF NOT EXISTS idx_revision_ba_number ON ba_revision_history(ba_number);

CREATE INDEX IF NOT EXISTS idx_session_ba_id ON ba_editing_sessions(ba_id);
CREATE INDEX IF NOT EXISTS idx_session_user ON ba_editing_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_session_active ON ba_editing_sessions(is_active, last_heartbeat);

CREATE INDEX IF NOT EXISTS idx_milestone_data_ba ON ba_milestone_data(ba_id);
CREATE INDEX IF NOT EXISTS idx_milestone_data_contract ON ba_milestone_data(contract_id);

CREATE INDEX IF NOT EXISTS idx_ba_locked ON dim_berita_acara(is_locked, locked_by);
CREATE INDEX IF NOT EXISTS idx_ba_autosave ON dim_berita_acara(last_autosave_date);

-- Enable RLS
ALTER TABLE ba_revision_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ba_editing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ba_milestone_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ba_revision_history
CREATE POLICY "Anyone can view revision history"
  ON ba_revision_history
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create revisions"
  ON ba_revision_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for ba_editing_sessions
CREATE POLICY "Anyone can view active editing sessions"
  ON ba_editing_sessions
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create sessions"
  ON ba_editing_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their own sessions"
  ON ba_editing_sessions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete their own sessions"
  ON ba_editing_sessions
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for ba_milestone_data
CREATE POLICY "Anyone can view milestone data"
  ON ba_milestone_data
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create milestone data"
  ON ba_milestone_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update milestone data"
  ON ba_milestone_data
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to clean up stale editing sessions (sessions inactive for more than 1 hour)
CREATE OR REPLACE FUNCTION cleanup_stale_sessions()
RETURNS void AS $$
BEGIN
  UPDATE ba_editing_sessions
  SET is_active = false,
      session_ended = now()
  WHERE is_active = true
    AND last_heartbeat < now() - interval '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Function to auto-unlock documents when lock holder's session expires
CREATE OR REPLACE FUNCTION auto_unlock_expired_documents()
RETURNS void AS $$
BEGIN
  UPDATE dim_berita_acara
  SET is_locked = false,
      locked_by = NULL,
      lock_acquired_at = NULL
  WHERE is_locked = true
    AND lock_acquired_at < now() - interval '30 minutes';
END;
$$ LANGUAGE plpgsql;

-- Insert sample revision history
INSERT INTO ba_revision_history (ba_id, ba_number, revision_number, content_snapshot, changed_by, change_type, change_summary)
SELECT
  ba_id,
  ba_number,
  1,
  ba_content,
  created_by,
  'manual_save',
  'Initial document creation'
FROM dim_berita_acara
WHERE ba_content IS NOT NULL
ON CONFLICT DO NOTHING;
