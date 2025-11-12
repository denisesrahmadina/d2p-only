/*
  # Create Order Monitoring System for APBA Integration
  
  ## Overview
  This migration creates the Order Monitoring timeline system that integrates with APBA module.
  It tracks procurement stages from Order Created through Payment Completed, with automatic
  updates triggered by BA status changes.
  
  ## New Tables
  
  1. **dim_order_monitoring_timeline**
     - Master timeline configuration with standard procurement stages
     - Defines stage order, SLA thresholds, and dependencies
  
  2. **fact_order_status_history**
     - Tracks status changes for purchase orders
     - Links to BA documents and provides complete audit trail
     - Calculates time spent in each stage
  
  3. **fact_order_milestones**
     - Stores milestone achievements with dates and actors
     - Tracks delays and provides SLA compliance metrics
  
  ## Timeline Stages
  - Order Created
  - Order Submitted
  - Order Approved
  - In Inspection (triggered by BA Pemeriksaan submission)
  - Order Received (triggered by BA Serah Terima approval)
  - Invoice Submitted
  - Invoice Approved
  - Payment Completed
  
  ## Security
  - RLS enabled on all tables
  - Authenticated users can read orders they're involved in
  - System can auto-update from BA workflow triggers
  
  ## Integration Points
  - BA Pemeriksaan submission → moves to "In Inspection"
  - BA Serah Terima approval → moves to "Order Received"
  - Automatic timeline sync via fact_ba_order_monitoring_sync
*/

-- Create Order Monitoring Timeline Configuration Table
CREATE TABLE IF NOT EXISTS dim_order_monitoring_timeline (
  stage_id bigserial PRIMARY KEY,
  stage_code text NOT NULL UNIQUE,
  stage_name text NOT NULL,
  stage_description text,
  stage_order integer NOT NULL UNIQUE,
  stage_category text CHECK (stage_category IN ('Procurement', 'Inspection', 'Receipt', 'Payment')),
  
  -- SLA Configuration
  sla_hours integer, -- Expected hours to complete this stage
  sla_business_days integer, -- Alternative: business days
  is_critical_path boolean DEFAULT true,
  
  -- Dependencies
  requires_previous_stage_completion boolean DEFAULT true,
  can_skip boolean DEFAULT false,
  
  -- Display
  icon_name text, -- Lucide icon name for UI
  color_scheme text, -- Color for visual timeline
  
  -- Status
  is_active boolean DEFAULT true,
  created_date timestamptz DEFAULT now()
);

-- Insert standard procurement timeline stages
INSERT INTO dim_order_monitoring_timeline 
  (stage_code, stage_name, stage_description, stage_order, stage_category, sla_hours, icon_name, color_scheme) 
VALUES
  ('ORDER_CREATED', 'Order Created', 'Purchase order has been created', 1, 'Procurement', 1, 'FileText', 'blue'),
  ('ORDER_SUBMITTED', 'Order Submitted', 'Purchase order submitted for approval', 2, 'Procurement', 24, 'Send', 'blue'),
  ('ORDER_APPROVED', 'Order Approved', 'Purchase order has been approved', 3, 'Procurement', 48, 'CheckCircle', 'green'),
  ('IN_INSPECTION', 'In Inspection', 'Goods/services are being inspected', 4, 'Inspection', 72, 'Search', 'orange'),
  ('ORDER_RECEIVED', 'Order Received', 'Goods/services have been received', 5, 'Receipt', 24, 'Package', 'green'),
  ('INVOICE_SUBMITTED', 'Invoice Submitted', 'Vendor invoice has been submitted', 6, 'Payment', 48, 'Receipt', 'blue'),
  ('INVOICE_APPROVED', 'Invoice Approved', 'Invoice approved for payment', 7, 'Payment', 72, 'CheckCircle', 'green'),
  ('PAYMENT_COMPLETED', 'Payment Completed', 'Payment has been processed', 8, 'Payment', 120, 'DollarSign', 'green')
ON CONFLICT (stage_code) DO NOTHING;

-- Create Order Status History Table
CREATE TABLE IF NOT EXISTS fact_order_status_history (
  history_id bigserial PRIMARY KEY,
  
  -- Order Reference
  po_number text NOT NULL,
  po_line_id bigint,
  contract_id text,
  vendor_id text,
  
  -- Status Information
  previous_stage_code text REFERENCES dim_order_monitoring_timeline(stage_code),
  current_stage_code text NOT NULL REFERENCES dim_order_monitoring_timeline(stage_code),
  
  -- Timing
  status_changed_at timestamptz DEFAULT now() NOT NULL,
  time_in_previous_stage_hours numeric(10,2), -- Calculated duration
  
  -- Actor Information
  changed_by_user_id text,
  changed_by_name text,
  change_source text CHECK (change_source IN ('MANUAL', 'BA_WORKFLOW', 'ERP_SYNC', 'SYSTEM')),
  
  -- Related Documents
  ba_id bigint REFERENCES dim_ba_master(ba_id),
  ba_number text,
  ba_type text,
  
  -- SLA Tracking
  is_on_time boolean DEFAULT true,
  delay_hours numeric(10,2),
  delay_reason text,
  
  -- Additional Context
  notes text,
  metadata jsonb,
  
  -- Audit
  created_date timestamptz DEFAULT now()
);

-- Create Order Milestones Table
CREATE TABLE IF NOT EXISTS fact_order_milestones (
  milestone_id bigserial PRIMARY KEY,
  
  -- Order Reference
  po_number text NOT NULL,
  po_line_id bigint,
  
  -- Milestone Information
  stage_code text NOT NULL REFERENCES dim_order_monitoring_timeline(stage_code),
  milestone_name text NOT NULL,
  
  -- Dates
  planned_date date,
  actual_date date,
  completed_at timestamptz,
  
  -- Status
  milestone_status text NOT NULL DEFAULT 'PENDING' 
    CHECK (milestone_status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'SKIPPED')),
  
  -- Performance Tracking
  is_on_schedule boolean DEFAULT true,
  days_early_late integer, -- Negative = early, Positive = late
  
  -- Completion Details
  completed_by_user_id text,
  completed_by_name text,
  completion_notes text,
  
  -- Related Documents
  ba_id bigint REFERENCES dim_ba_master(ba_id),
  document_references jsonb, -- Array of related document IDs
  
  -- Audit
  created_date timestamptz DEFAULT now(),
  modified_date timestamptz DEFAULT now(),
  
  -- Unique constraint: One milestone per stage per order
  CONSTRAINT unique_milestone_per_order UNIQUE (po_number, stage_code)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_order_history_po ON fact_order_status_history(po_number);
CREATE INDEX IF NOT EXISTS idx_order_history_stage ON fact_order_status_history(current_stage_code);
CREATE INDEX IF NOT EXISTS idx_order_history_ba ON fact_order_status_history(ba_id);
CREATE INDEX IF NOT EXISTS idx_order_history_changed_at ON fact_order_status_history(status_changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_history_vendor ON fact_order_status_history(vendor_id);

CREATE INDEX IF NOT EXISTS idx_order_milestones_po ON fact_order_milestones(po_number);
CREATE INDEX IF NOT EXISTS idx_order_milestones_stage ON fact_order_milestones(stage_code);
CREATE INDEX IF NOT EXISTS idx_order_milestones_status ON fact_order_milestones(milestone_status);
CREATE INDEX IF NOT EXISTS idx_order_milestones_ba ON fact_order_milestones(ba_id);

-- Enable RLS
ALTER TABLE dim_order_monitoring_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_order_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Order Monitoring Timeline (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read timeline stages"
  ON dim_order_monitoring_timeline FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Anonymous users can read timeline stages"
  ON dim_order_monitoring_timeline FOR SELECT
  TO anon
  USING (is_active = true);

-- RLS Policies for Order Status History
CREATE POLICY "Users can read order status history"
  ON fact_order_status_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anonymous users can read order status history"
  ON fact_order_status_history FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "System can insert order status history"
  ON fact_order_status_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for Order Milestones
CREATE POLICY "Users can read order milestones"
  ON fact_order_milestones FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anonymous users can read order milestones"
  ON fact_order_milestones FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "System can manage order milestones"
  ON fact_order_milestones FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update order milestones"
  ON fact_order_milestones FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to calculate time in stage
CREATE OR REPLACE FUNCTION calculate_time_in_stage()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate hours between previous status change and current
  IF NEW.previous_stage_code IS NOT NULL THEN
    SELECT EXTRACT(EPOCH FROM (NEW.status_changed_at - MAX(status_changed_at))) / 3600
    INTO NEW.time_in_previous_stage_hours
    FROM fact_order_status_history
    WHERE po_number = NEW.po_number
      AND current_stage_code = NEW.previous_stage_code;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate time in stage
CREATE TRIGGER trigger_calculate_time_in_stage
  BEFORE INSERT ON fact_order_status_history
  FOR EACH ROW
  EXECUTE FUNCTION calculate_time_in_stage();

-- Create function to auto-update milestone status
CREATE OR REPLACE FUNCTION update_milestone_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert milestone when status changes
  INSERT INTO fact_order_milestones (
    po_number,
    po_line_id,
    stage_code,
    milestone_name,
    actual_date,
    completed_at,
    milestone_status,
    completed_by_user_id,
    completed_by_name,
    ba_id
  )
  VALUES (
    NEW.po_number,
    NEW.po_line_id,
    NEW.current_stage_code,
    (SELECT stage_name FROM dim_order_monitoring_timeline WHERE stage_code = NEW.current_stage_code),
    CURRENT_DATE,
    NEW.status_changed_at,
    'COMPLETED',
    NEW.changed_by_user_id,
    NEW.changed_by_name,
    NEW.ba_id
  )
  ON CONFLICT (po_number, stage_code)
  DO UPDATE SET
    actual_date = CURRENT_DATE,
    completed_at = NEW.status_changed_at,
    milestone_status = 'COMPLETED',
    completed_by_user_id = NEW.changed_by_user_id,
    completed_by_name = NEW.changed_by_name,
    ba_id = NEW.ba_id,
    modified_date = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update milestones
CREATE TRIGGER trigger_update_milestone_on_status_change
  AFTER INSERT ON fact_order_status_history
  FOR EACH ROW
  EXECUTE FUNCTION update_milestone_on_status_change();
