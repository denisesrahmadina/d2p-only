/*
  # Fix Alerts Table ID Structure

  1. Changes
    - Swap id and alert_id columns
    - Make id the UUID primary key
    - Make alert_id the text identifier (like 'ssc-001', 'ip-001')

  2. Data Safety
    - Creates temporary column to safely swap values
    - Preserves all existing data
    - No data loss

  3. Steps
    - Create temp column for swap
    - Copy values to swap id <-> alert_id
    - Update constraints and indexes
*/

-- Step 1: Create temporary column to hold text id values
ALTER TABLE alerts ADD COLUMN temp_text_id text;

-- Step 2: Copy current text id to temp column
UPDATE alerts SET temp_text_id = id;

-- Step 3: Copy current UUID alert_id to id column (after converting id to text temporarily)
ALTER TABLE alerts DROP CONSTRAINT IF EXISTS alerts_pkey;
ALTER TABLE alerts ALTER COLUMN id TYPE uuid USING alert_id;

-- Step 4: Copy temp_text_id to alert_id
ALTER TABLE alerts ALTER COLUMN alert_id TYPE text USING temp_text_id;

-- Step 5: Drop temp column
ALTER TABLE alerts DROP COLUMN temp_text_id;

-- Step 6: Set id as primary key
ALTER TABLE alerts ADD PRIMARY KEY (id);

-- Step 7: Make alert_id unique and NOT NULL
ALTER TABLE alerts ALTER COLUMN alert_id SET NOT NULL;
ALTER TABLE alerts DROP CONSTRAINT IF EXISTS alerts_alert_id_key;
ALTER TABLE alerts ADD CONSTRAINT alerts_alert_id_key UNIQUE (alert_id);

-- Step 8: Create index on alert_id for fast lookups by text identifier
DROP INDEX IF EXISTS idx_alerts_alert_id;
CREATE INDEX idx_alerts_alert_id ON alerts(alert_id);
