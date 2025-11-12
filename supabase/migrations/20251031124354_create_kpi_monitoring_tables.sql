/*
  # KPI Monitoring and Strategic Initiatives Schema

  1. New Tables
    - `ref_kpi`
      - KPI definitions with targets, actual values, and thresholds
      - Links to strategic initiatives and categories
      - Tracks historical performance data

    - `ref_strategic_initiative`
      - Strategic initiative master data
      - Tracks activities, timelines, owners, and outcomes
      - Links to stakeholders and impact estimates

    - `kpi_alerts`
      - Auto-generated alerts when KPIs breach thresholds
      - Stores severity levels and recommendations
      - Tracks alert status and resolution

    - `risk_log`
      - Risk tracking for strategic initiatives
      - Severity, likelihood, mitigation actions
      - Status tracking and deadlines

    - `issue_log`
      - Issue tracking for strategic initiatives
      - Impact assessment and resolution tracking
      - Linked to specific initiatives

  2. Security
    - Enable RLS on all tables
    - Public read access for dashboard views
    - Authenticated users can create and update

  3. Important Notes
    - All monetary values in IDR
    - Timeline tracking with start and end dates
    - Status tracking for initiatives, risks, and issues
    - Auto-calculation of KPI achievement percentages
*/

-- Create ref_kpi table
CREATE TABLE IF NOT EXISTS ref_kpi (
  kpi_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_code text NOT NULL UNIQUE,
  kpi_name text NOT NULL,
  kpi_category text NOT NULL,
  initiative_category text NOT NULL,
  unit_of_measure text NOT NULL,
  target_value numeric NOT NULL,
  actual_value numeric NOT NULL DEFAULT 0,
  achievement_percentage numeric GENERATED ALWAYS AS (
    CASE
      WHEN target_value > 0 THEN ROUND((actual_value / target_value) * 100, 2)
      ELSE 0
    END
  ) STORED,
  threshold_critical numeric DEFAULT 50,
  threshold_warning numeric DEFAULT 75,
  threshold_target numeric DEFAULT 100,
  baseline_value numeric,
  timeline_start date NOT NULL,
  timeline_end date NOT NULL,
  frequency text DEFAULT 'Monthly' CHECK (frequency IN ('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly')),
  data_source text,
  calculation_method text,
  background_issue text,
  strategic_objective text,
  kpi_owner text,
  kpi_status text DEFAULT 'Active' CHECK (kpi_status IN ('Active', 'Paused', 'Completed', 'Cancelled')),
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  created_by text,
  historical_data jsonb DEFAULT '[]'::jsonb,
  related_initiatives jsonb DEFAULT '[]'::jsonb,
  notes text
);

-- Create ref_strategic_initiative table
CREATE TABLE IF NOT EXISTS ref_strategic_initiative (
  initiative_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_code text NOT NULL UNIQUE,
  initiative_name text NOT NULL,
  initiative_activities text NOT NULL,
  initiative_category text NOT NULL,
  initiative_owner text NOT NULL,
  background_issue text NOT NULL,
  expected_outcome text NOT NULL,
  related_stakeholders jsonb DEFAULT '[]'::jsonb,
  impact_estimate text,
  impact_value numeric,
  timeline_start date NOT NULL,
  timeline_end date NOT NULL,
  milestones jsonb DEFAULT '[]'::jsonb,
  priority text NOT NULL CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
  initiatives_status text DEFAULT 'Planning' CHECK (initiatives_status IN ('Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled', 'At Risk')),
  completion_percentage numeric DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  budget_allocated numeric,
  budget_spent numeric DEFAULT 0,
  dependencies jsonb DEFAULT '[]'::jsonb,
  deliverables jsonb DEFAULT '[]'::jsonb,
  success_criteria text,
  risks_identified integer DEFAULT 0,
  issues_identified integer DEFAULT 0,
  last_status_update timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  created_by text,
  updated_at timestamptz DEFAULT now(),
  updated_by text,
  notes text
);

-- Create kpi_alerts table
CREATE TABLE IF NOT EXISTS kpi_alerts (
  alert_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id uuid NOT NULL REFERENCES ref_kpi(kpi_id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('Threshold Breach', 'Trend Alert', 'Anomaly', 'Prediction', 'Manual')),
  severity text NOT NULL CHECK (severity IN ('High', 'Medium', 'Low')),
  alert_message text NOT NULL,
  root_cause_analysis text,
  actionable_recommendations jsonb DEFAULT '[]'::jsonb,
  predicted_impact text,
  alert_status text DEFAULT 'Active' CHECK (alert_status IN ('Active', 'Acknowledged', 'In Progress', 'Resolved', 'Dismissed')),
  triggered_at timestamptz DEFAULT now(),
  acknowledged_at timestamptz,
  acknowledged_by text,
  resolved_at timestamptz,
  resolved_by text,
  resolution_notes text,
  auto_generated boolean DEFAULT true,
  notification_sent boolean DEFAULT false,
  related_data jsonb DEFAULT '{}'::jsonb
);

-- Create risk_log table
CREATE TABLE IF NOT EXISTS risk_log (
  risk_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id uuid NOT NULL REFERENCES ref_strategic_initiative(initiative_id) ON DELETE CASCADE,
  risk_code text NOT NULL UNIQUE,
  risk_title text NOT NULL,
  risk_description text NOT NULL,
  risk_category text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  likelihood text NOT NULL CHECK (likelihood IN ('Very High', 'High', 'Medium', 'Low', 'Very Low')),
  risk_score numeric GENERATED ALWAYS AS (
    CASE severity
      WHEN 'Critical' THEN 4
      WHEN 'High' THEN 3
      WHEN 'Medium' THEN 2
      ELSE 1
    END *
    CASE likelihood
      WHEN 'Very High' THEN 5
      WHEN 'High' THEN 4
      WHEN 'Medium' THEN 3
      WHEN 'Low' THEN 2
      ELSE 1
    END
  ) STORED,
  impact_description text,
  mitigation_actions text NOT NULL,
  contingency_plan text,
  risk_owner text NOT NULL,
  mitigation_deadline date,
  risk_status text DEFAULT 'Open' CHECK (risk_status IN ('Open', 'In Mitigation', 'Mitigated', 'Accepted', 'Closed')),
  identified_date date NOT NULL DEFAULT CURRENT_DATE,
  last_review_date date,
  next_review_date date,
  created_at timestamptz DEFAULT now(),
  created_by text,
  updated_at timestamptz DEFAULT now(),
  updated_by text,
  notes text
);

-- Create issue_log table
CREATE TABLE IF NOT EXISTS issue_log (
  issue_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id uuid NOT NULL REFERENCES ref_strategic_initiative(initiative_id) ON DELETE CASCADE,
  issue_code text NOT NULL UNIQUE,
  issue_title text NOT NULL,
  issue_description text NOT NULL,
  issue_category text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  impact_description text,
  root_cause text,
  resolution_actions text NOT NULL,
  issue_owner text NOT NULL,
  resolution_deadline date,
  issue_status text DEFAULT 'Open' CHECK (issue_status IN ('Open', 'In Progress', 'Resolved', 'Closed', 'Deferred')),
  reported_date date NOT NULL DEFAULT CURRENT_DATE,
  resolved_date date,
  completion_status numeric DEFAULT 0 CHECK (completion_status >= 0 AND completion_status <= 100),
  created_at timestamptz DEFAULT now(),
  created_by text,
  updated_at timestamptz DEFAULT now(),
  updated_by text,
  remarks text
);

-- Enable RLS
ALTER TABLE ref_kpi ENABLE ROW LEVEL SECURITY;
ALTER TABLE ref_strategic_initiative ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ref_kpi
CREATE POLICY "Anyone can view KPIs"
  ON ref_kpi FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create KPIs"
  ON ref_kpi FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update KPIs"
  ON ref_kpi FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for ref_strategic_initiative
CREATE POLICY "Anyone can view strategic initiatives"
  ON ref_strategic_initiative FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create initiatives"
  ON ref_strategic_initiative FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update initiatives"
  ON ref_strategic_initiative FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for kpi_alerts
CREATE POLICY "Anyone can view KPI alerts"
  ON kpi_alerts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create alerts"
  ON kpi_alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update alerts"
  ON kpi_alerts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for risk_log
CREATE POLICY "Anyone can view risk logs"
  ON risk_log FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create risks"
  ON risk_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update risks"
  ON risk_log FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for issue_log
CREATE POLICY "Anyone can view issue logs"
  ON issue_log FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create issues"
  ON issue_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update issues"
  ON issue_log FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ref_kpi_category ON ref_kpi(initiative_category);
CREATE INDEX IF NOT EXISTS idx_ref_kpi_status ON ref_kpi(kpi_status);
CREATE INDEX IF NOT EXISTS idx_ref_kpi_timeline ON ref_kpi(timeline_start, timeline_end);
CREATE INDEX IF NOT EXISTS idx_ref_kpi_achievement ON ref_kpi(achievement_percentage);

CREATE INDEX IF NOT EXISTS idx_strategic_initiative_category ON ref_strategic_initiative(initiative_category);
CREATE INDEX IF NOT EXISTS idx_strategic_initiative_status ON ref_strategic_initiative(initiatives_status);
CREATE INDEX IF NOT EXISTS idx_strategic_initiative_priority ON ref_strategic_initiative(priority);
CREATE INDEX IF NOT EXISTS idx_strategic_initiative_timeline ON ref_strategic_initiative(timeline_start, timeline_end);

CREATE INDEX IF NOT EXISTS idx_kpi_alerts_kpi_id ON kpi_alerts(kpi_id);
CREATE INDEX IF NOT EXISTS idx_kpi_alerts_severity ON kpi_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_kpi_alerts_status ON kpi_alerts(alert_status);
CREATE INDEX IF NOT EXISTS idx_kpi_alerts_triggered ON kpi_alerts(triggered_at);

CREATE INDEX IF NOT EXISTS idx_risk_log_initiative_id ON risk_log(initiative_id);
CREATE INDEX IF NOT EXISTS idx_risk_log_severity ON risk_log(severity);
CREATE INDEX IF NOT EXISTS idx_risk_log_status ON risk_log(risk_status);
CREATE INDEX IF NOT EXISTS idx_risk_log_score ON risk_log(risk_score);

CREATE INDEX IF NOT EXISTS idx_issue_log_initiative_id ON issue_log(initiative_id);
CREATE INDEX IF NOT EXISTS idx_issue_log_severity ON issue_log(severity);
CREATE INDEX IF NOT EXISTS idx_issue_log_status ON issue_log(issue_status);
