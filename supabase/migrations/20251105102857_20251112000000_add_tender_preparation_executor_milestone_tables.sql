/*
  # Add Tender Preparation Executor and Milestone Tables

  ## Summary
  This migration creates the procurement executor and schedule milestone tables needed for
  the tender preparation workflow with AI-powered executor assignment and milestone generation.

  ## 1. New Tables

  ### `ref_procurement_executor`
  Stores procurement executor personnel information with availability tracking
  
  ### `fact_schedule_milestone`  
  Stores AI-generated schedule milestones for sourcing events

  ## 2. Data Population
  - 5 procurement executors with availability status
  - 5 predefined sourcing events for tender preparation

  ## 3. Security
  - Enable RLS on all new tables
  - Allow anonymous and authenticated read/write access for demo purposes
*/

-- Create procurement executor table
CREATE TABLE IF NOT EXISTS ref_procurement_executor (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  department text,
  current_workload integer DEFAULT 0,
  max_capacity integer DEFAULT 5,
  availability_status text DEFAULT 'Available',
  specialization text[],
  organization_id text DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now()
);

-- Create schedule milestone table
CREATE TABLE IF NOT EXISTS fact_schedule_milestone (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  sourcing_event_id text NOT NULL,
  milestone_name text NOT NULL,
  milestone_date date NOT NULL,
  milestone_order integer NOT NULL,
  status text DEFAULT 'Pending',
  assigned_executor_id text,
  ai_generated boolean DEFAULT false,
  notes text,
  organization_id text DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ref_procurement_executor ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_schedule_milestone ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous read access
CREATE POLICY "Allow anonymous read access to procurement executors"
  ON ref_procurement_executor FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to procurement executors"
  ON ref_procurement_executor FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous update to procurement executors"
  ON ref_procurement_executor FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated update to procurement executors"
  ON ref_procurement_executor FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous read access to schedule milestones"
  ON fact_schedule_milestone FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to schedule milestones"
  ON fact_schedule_milestone FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous insert to schedule milestones"
  ON fact_schedule_milestone FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert to schedule milestones"
  ON fact_schedule_milestone FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update to schedule milestones"
  ON fact_schedule_milestone FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated update to schedule milestones"
  ON fact_schedule_milestone FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous delete to schedule milestones"
  ON fact_schedule_milestone FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated delete to schedule milestones"
  ON fact_schedule_milestone FOR DELETE
  TO authenticated
  USING (true);

-- Add executor assignment fields to fact_sourcing_event if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'assigned_executor_id'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN assigned_executor_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'executor_assigned_at'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN executor_assigned_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'executor_assigned_by'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN executor_assigned_by text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'schedule_generated'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN schedule_generated boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'schedule_generated_at'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN schedule_generated_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'tender_preparation_status'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN tender_preparation_status text DEFAULT 'Not Started';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'material_ids'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN material_ids text[];
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'delivery_location'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN delivery_location text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'delivery_date'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN delivery_date date;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'estimate_price'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN estimate_price numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_sourcing_event' AND column_name = 'sourcing_event_line_id'
  ) THEN
    ALTER TABLE fact_sourcing_event ADD COLUMN sourcing_event_line_id text;
  END IF;
END $$;

-- Insert procurement executors
INSERT INTO ref_procurement_executor (id, name, email, department, current_workload, max_capacity, availability_status, specialization) VALUES
('EXEC-001', 'John Doe', 'john.doe@indonesiapower.com', 'Procurement Operations', 2, 5, 'Available', ARRAY['Electrical Systems', 'Industrial Equipment']),
('EXEC-002', 'Jane Smith', 'jane.smith@indonesiapower.com', 'Procurement Operations', 1, 5, 'Available', ARRAY['Mechanical Systems', 'Power Equipment']),
('EXEC-003', 'Alan Brown', 'alan.brown@indonesiapower.com', 'Procurement Operations', 5, 5, 'Not Available', ARRAY['Civil Works', 'Construction']),
('EXEC-004', 'Sarah Lee', 'sarah.lee@indonesiapower.com', 'Procurement Operations', 3, 5, 'Available', ARRAY['IT Systems', 'Automation']),
('EXEC-005', 'Michael Chen', 'michael.chen@indonesiapower.com', 'Procurement Operations', 1, 5, 'Available', ARRAY['Electrical Systems', 'Renewable Energy'])
ON CONFLICT (id) DO NOTHING;

-- Insert 5 predefined sourcing events for Tender Preparation
INSERT INTO fact_sourcing_event (
  id,
  sourcing_event_id,
  sourcing_event_line_id,
  title,
  category,
  estimate_price,
  total_value,
  status,
  approval_status,
  created_by,
  created_at,
  organization_id,
  material_ids,
  delivery_location,
  tender_preparation_status
) VALUES
(
  gen_random_uuid(),
  'SRC-2025-012',
  'SE-LINE-012',
  'Siemens Electrical Equipment',
  'Electrical Systems',
  25000000000,
  25.0,
  'Approved',
  'Approved',
  'Planner L',
  '2025-01-10 08:00:00',
  'ORG001',
  ARRAY['MAT-EE-001', 'MAT-EE-002', 'MAT-EE-003'],
  'Suralaya Power Plant, Banten',
  'Ready for Preparation'
),
(
  gen_random_uuid(),
  'SRC-2025-013',
  'SE-LINE-013',
  'GE Mechanical Systems',
  'Mechanical Systems',
  19500000000,
  19.5,
  'Approved',
  'Approved',
  'Planner M',
  '2025-01-12 09:30:00',
  'ORG001',
  ARRAY['MAT-MS-001', 'MAT-MS-002'],
  'Paiton Power Plant, East Java',
  'Ready for Preparation'
),
(
  gen_random_uuid(),
  'SRC-2025-014',
  'SE-LINE-014',
  'ABB Industrial Systems',
  'Industrial Automation',
  18800000000,
  18.8,
  'Approved',
  'Approved',
  'Planner N',
  '2025-01-15 10:00:00',
  'ORG001',
  ARRAY['MAT-IA-001', 'MAT-IA-002', 'MAT-IA-003', 'MAT-IA-004'],
  'Muara Karang Power Plant, Jakarta',
  'Ready for Preparation'
),
(
  gen_random_uuid(),
  'SRC-2025-015',
  'SE-LINE-015',
  'Mitsubishi Electric Components',
  'Electrical Components',
  22300000000,
  22.3,
  'Approved',
  'Approved',
  'Planner O',
  '2025-01-18 11:15:00',
  'ORG001',
  ARRAY['MAT-EC-001', 'MAT-EC-002', 'MAT-EC-003'],
  'Labuan Power Plant, Banten',
  'Ready for Preparation'
),
(
  gen_random_uuid(),
  'SRC-2025-016',
  'SE-LINE-016',
  'Schneider Power Systems',
  'Power Distribution',
  17000000000,
  17.0,
  'Approved',
  'Approved',
  'Planner P',
  '2025-01-20 13:45:00',
  'ORG001',
  ARRAY['MAT-PD-001', 'MAT-PD-002'],
  'Grati Power Plant, East Java',
  'Ready for Preparation'
)
ON CONFLICT (sourcing_event_id) DO NOTHING;