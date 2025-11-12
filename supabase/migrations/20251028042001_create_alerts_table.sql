/*
  # Create Alerts Table

  1. New Tables
    - `alerts`
      - `id` (text, primary key) - Unique alert identifier
      - `organization_id` (text) - Organization the alert belongs to
      - `title` (text) - Alert title
      - `message` (text) - Detailed alert message
      - `severity` (text) - Alert severity level (low, medium, high, critical)
      - `source` (text) - Source system or AI agent that generated the alert
      - `timestamp` (text) - Human-readable timestamp
      - `action_required` (boolean) - Whether the alert requires user action
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record last update timestamp

  2. Security
    - Enable RLS on `alerts` table
    - Add policy for anonymous users to read alerts (for login/public pages)
    - Add policy for authenticated users to read alerts
    - Add policy for authenticated users to insert alerts
    - Add policy for authenticated users to update alerts
    - Add policy for authenticated users to delete alerts

  3. Indexes
    - Index on organization_id for fast filtering
    - Index on severity for priority sorting
    - Index on action_required for filtering actionable alerts
*/

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id text PRIMARY KEY,
  organization_id text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source text NOT NULL,
  timestamp text NOT NULL,
  action_required boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anonymous users can view all alerts"
  ON alerts
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can view all alerts"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert alerts"
  ON alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update alerts"
  ON alerts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete alerts"
  ON alerts
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_alerts_organization_id ON alerts(organization_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_action_required ON alerts(action_required);

-- Insert initial data for SSC Center and Indonesia Power
INSERT INTO alerts (id, organization_id, title, message, severity, source, timestamp, action_required) VALUES
  ('ssc-001', 'ssc-center', 'High Volume Invoice Processing Alert', 'Invoice processing volume 35% above normal. Finance AI scaling resources automatically.', 'medium', 'Finance Operations AI', '8 min ago', false),
  ('ssc-002', 'ssc-center', 'Payroll Processing Completed', 'Monthly payroll for 12,847 employees processed successfully with 99.9% accuracy.', 'low', 'HR Services AI', '2 hours ago', false),
  ('ssc-003', 'ssc-center', 'IT Incident Spike Detected', 'Password reset requests increased 45%. IT Support AI implementing automated resolution.', 'medium', 'IT Support AI', '25 min ago', true),
  ('ssc-004', 'ssc-center', 'Vendor Compliance Issue', '3 vendors missing required compliance documentation. Procurement AI initiating follow-up.', 'high', 'Procurement AI', '1 hour ago', true),
  ('ssc-005', 'ssc-center', 'SLA Performance Exceeding Target', 'Overall SLA compliance reached 99.4%, exceeding target of 99.0% for third consecutive month.', 'low', 'Data Analytics AI', '4 hours ago', false),
  ('ssc-006', 'ssc-center', 'Compliance Audit Preparation Complete', 'Q4 compliance audit documentation prepared and validated. 100% audit readiness achieved.', 'low', 'Compliance & Risk AI', '6 hours ago', false),
  ('ip-001', 'indonesia-power', 'Power Plant Efficiency Alert', 'Unit 5 thermal efficiency dropped by 3.2%. Maintenance team notified for inspection.', 'medium', 'Power Generation Monitor', '15 min ago', true),
  ('ip-002', 'indonesia-power', 'Renewable Energy Target Achievement', 'Solar and hydro generation exceeded monthly target by 8%. Green energy contribution up to 23%.', 'low', 'Renewable Energy Tracker', '1 hour ago', false),
  ('ip-003', 'indonesia-power', 'Grid Stability Warning', 'Frequency fluctuation detected in Java-Bali grid. Load balancing protocols activated.', 'high', 'Grid Operations Control', '30 min ago', true),
  ('ip-004', 'indonesia-power', 'Fuel Inventory Optimization', 'Coal inventory levels optimized. Cost savings of Rp 2.4B achieved through smart procurement.', 'low', 'Fuel Management AI', '3 hours ago', false),
  ('ip-005', 'indonesia-power', 'Environmental Compliance Success', 'Emissions monitoring shows 100% compliance with environmental standards for Q4.', 'low', 'Environmental Monitoring System', '5 hours ago', false)
ON CONFLICT (id) DO NOTHING;
