/*
  # Drop and Recreate KPI Alerts & Insights System
  
  Dropping existing partial tables and creating complete system
*/

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS kpi_alert_history CASCADE;
DROP TABLE IF EXISTS kpi_recommendations CASCADE;
DROP TABLE IF EXISTS kpi_insights CASCADE;
DROP TABLE IF EXISTS kpi_alerts CASCADE;

-- Drop trigger function if exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Table 1: KPI Alerts
CREATE TABLE kpi_alerts (
    alert_id bigserial PRIMARY KEY,
    kpi_id bigint NOT NULL REFERENCES ref_kpi(kpi_id),
    kpi_code text NOT NULL,
    kpi_name text NOT NULL,
    alert_type text NOT NULL CHECK (alert_type IN ('threshold_breach', 'trend_negative', 'target_miss', 'critical_deviation')),
    severity text NOT NULL CHECK (severity IN ('High', 'Medium', 'Low')),
    alert_status text NOT NULL DEFAULT 'active' CHECK (alert_status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
    
    current_value numeric NOT NULL,
    target_value numeric NOT NULL,
    threshold_breached text,
    variance_percentage numeric,
    
    root_cause_analysis text,
    trend_direction text CHECK (trend_direction IN ('improving', 'declining', 'stable')),
    predicted_value numeric,
    confidence_score numeric CHECK (confidence_score >= 0 AND confidence_score <= 100),
    
    detected_at timestamp with time zone DEFAULT now(),
    acknowledged_at timestamp with time zone,
    resolved_at timestamp with time zone,
    acknowledged_by text,
    resolved_by text,
    
    alert_data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Table 2: KPI Insights
CREATE TABLE kpi_insights (
    insight_id bigserial PRIMARY KEY,
    kpi_id bigint NOT NULL REFERENCES ref_kpi(kpi_id),
    alert_id bigint REFERENCES kpi_alerts(alert_id),
    
    insight_type text NOT NULL CHECK (insight_type IN ('predictive', 'diagnostic', 'prescriptive', 'descriptive')),
    insight_title text NOT NULL,
    insight_description text NOT NULL,
    
    predicted_outcome text,
    prediction_timeframe text,
    likelihood_percentage numeric CHECK (likelihood_percentage >= 0 AND likelihood_percentage <= 100),
    
    contributing_factors jsonb DEFAULT '[]'::jsonb,
    historical_correlation jsonb DEFAULT '{}'::jsonb,
    confidence_level text CHECK (confidence_level IN ('high', 'medium', 'low')),
    
    generated_by_ai boolean DEFAULT true,
    model_version text,
    
    created_at timestamp with time zone DEFAULT now(),
    created_by text DEFAULT 'ai_system'
);

-- Table 3: KPI Recommendations
CREATE TABLE kpi_recommendations (
    recommendation_id bigserial PRIMARY KEY,
    alert_id bigint NOT NULL REFERENCES kpi_alerts(alert_id),
    kpi_id bigint NOT NULL REFERENCES ref_kpi(kpi_id),
    
    recommendation_title text NOT NULL,
    recommendation_description text NOT NULL,
    recommendation_type text CHECK (recommendation_type IN ('immediate_action', 'short_term', 'long_term', 'preventive')),
    
    priority text NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    estimated_impact text,
    implementation_effort text CHECK (implementation_effort IN ('low', 'medium', 'high')),
    
    action_steps jsonb DEFAULT '[]'::jsonb,
    responsible_role text,
    estimated_timeline text,
    expected_outcome text,
    
    implementation_status text DEFAULT 'pending' CHECK (implementation_status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    implementation_date timestamp with time zone,
    completion_date timestamp with time zone,
    
    actual_impact text,
    effectiveness_score numeric CHECK (effectiveness_score >= 0 AND effectiveness_score <= 10),
    
    created_at timestamp with time zone DEFAULT now(),
    created_by text DEFAULT 'ai_system',
    updated_at timestamp with time zone DEFAULT now()
);

-- Table 4: KPI Alert History
CREATE TABLE kpi_alert_history (
    history_id bigserial PRIMARY KEY,
    alert_id bigint NOT NULL REFERENCES kpi_alerts(alert_id),
    kpi_id bigint NOT NULL REFERENCES ref_kpi(kpi_id),
    
    action_type text NOT NULL CHECK (action_type IN ('created', 'acknowledged', 'escalated', 'resolved', 'dismissed', 'updated')),
    action_by text,
    action_notes text,
    
    previous_status text,
    new_status text,
    
    kpi_value_at_action numeric,
    
    created_at timestamp with time zone DEFAULT now()
);

-- Indexes for Performance
CREATE INDEX idx_kpi_alerts_kpi_id ON kpi_alerts(kpi_id);
CREATE INDEX idx_kpi_alerts_severity ON kpi_alerts(severity);
CREATE INDEX idx_kpi_alerts_status ON kpi_alerts(alert_status);
CREATE INDEX idx_kpi_alerts_detected_at ON kpi_alerts(detected_at DESC);
CREATE INDEX idx_kpi_insights_kpi_id ON kpi_insights(kpi_id);
CREATE INDEX idx_kpi_insights_alert_id ON kpi_insights(alert_id);
CREATE INDEX idx_kpi_recommendations_alert_id ON kpi_recommendations(alert_id);
CREATE INDEX idx_kpi_recommendations_priority ON kpi_recommendations(priority);
CREATE INDEX idx_kpi_alert_history_alert_id ON kpi_alert_history(alert_id);

-- Enable Row Level Security
ALTER TABLE kpi_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_alert_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow anonymous read on kpi_alerts"
    ON kpi_alerts FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow authenticated read on kpi_alerts"
    ON kpi_alerts FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow anonymous read on kpi_insights"
    ON kpi_insights FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow authenticated read on kpi_insights"
    ON kpi_insights FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow anonymous read on kpi_recommendations"
    ON kpi_recommendations FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow authenticated read on kpi_recommendations"
    ON kpi_recommendations FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow anonymous read on kpi_alert_history"
    ON kpi_alert_history FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow authenticated read on kpi_alert_history"
    ON kpi_alert_history FOR SELECT
    TO authenticated
    USING (true);

-- Function for Auto-Update Timestamps
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_kpi_alerts_updated_at BEFORE UPDATE ON kpi_alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kpi_recommendations_updated_at BEFORE UPDATE ON kpi_recommendations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
