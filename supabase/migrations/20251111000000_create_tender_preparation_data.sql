/*
  # Create Tender Preparation System

  ## Summary
  This migration sets up the complete tender preparation system with procurement executors,
  schedule milestones, and 5 predefined sourcing events ready for tender preparation.

  ## 1. New Tables

  ### `ref_procurement_executor`
  Stores procurement executor personnel information
  - `id` (text, primary key) - Unique executor ID
  - `name` (text) - Full name of executor
  - `email` (text) - Email address
  - `department` (text) - Department name
  - `current_workload` (integer) - Number of active assignments
  - `max_capacity` (integer) - Maximum concurrent assignments
  - `availability_status` (text) - Available/Not Available
  - `specialization` (text array) - Areas of expertise
  - `organization_id` (text) - Organization reference
  - `created_at` (timestamptz) - Creation timestamp

  ### `fact_schedule_milestone`
  Stores AI-generated schedule milestones for sourcing events
  - `id` (text, primary key) - Unique milestone ID
  - `sourcing_event_id` (text) - Reference to sourcing event
  - `milestone_name` (text) - Name of milestone
  - `milestone_date` (date) - Scheduled date
  - `milestone_order` (integer) - Sequence order
  - `status` (text) - Pending/In Progress/Completed
  - `assigned_executor_id` (text) - Reference to executor
  - `ai_generated` (boolean) - Whether AI generated
  - `organization_id` (text) - Organization reference
  - `created_at` (timestamptz) - Creation timestamp

  ## 2. Data Population
  - 5 predefined sourcing events (SRC-2025-012 through SRC-2025-016)
  - 5 procurement executors with availability status
  - Sample milestone templates

  ## 3. Security
  - Enable RLS on all new tables
  - Allow anonymous read access for demo purposes
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
  id text PRIMARY KEY,
  sourcing_event_id text NOT NULL,
  milestone_name text NOT NULL,
  milestone_date date NOT NULL,
  milestone_order integer NOT NULL,
  status text DEFAULT 'Pending',
  assigned_executor_id text,
  ai_generated boolean DEFAULT false,
  organization_id text DEFAULT 'ORG001',
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (sourcing_event_id) REFERENCES fact_sourcing_event(id)
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
  sourcing_event_line_id,
  title,
  category,
  estimate_price,
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
  'SRC-2025-012',
  'SE-LINE-012',
  'Siemens Electrical Equipment',
  'Electrical Systems',
  25000000000,
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
  'SRC-2025-013',
  'SE-LINE-013',
  'GE Mechanical Systems',
  'Mechanical Systems',
  19500000000,
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
  'SRC-2025-014',
  'SE-LINE-014',
  'ABB Industrial Systems',
  'Industrial Automation',
  18800000000,
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
  'SRC-2025-015',
  'SE-LINE-015',
  'Mitsubishi Electric Components',
  'Electrical Components',
  22300000000,
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
  'SRC-2025-016',
  'SE-LINE-016',
  'Schneider Power Systems',
  'Power Distribution',
  17000000000,
  'Approved',
  'Approved',
  'Planner P',
  '2025-01-20 13:45:00',
  'ORG001',
  ARRAY['MAT-PD-001', 'MAT-PD-002'],
  'Grati Power Plant, East Java',
  'Ready for Preparation'
)
ON CONFLICT (id) DO NOTHING;