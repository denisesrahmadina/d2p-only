/*
  # Add Procurement Request Details to Sourcing Events

  1. Purpose
    - Add predefined procurement request details for each sourcing event
    - Populate demonstration data showing bundled requests with full details

  2. New Table: fact_sourcing_event_procurement_requests
    - Links procurement requests to sourcing events
    - Stores detailed request information for view details modal

  3. Demo Data
    - SRC-2025-001: Siemens Mechanical Equipment (3 requests)
    - SRC-2025-002: ABB Electrical Systems (3 requests)
    - SRC-2025-003: Schneider Control Systems (2 requests)

  4. Security
    - Enable RLS with anonymous access policies
*/

-- Create table for procurement request details
CREATE TABLE IF NOT EXISTS fact_sourcing_event_procurement_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_event_id uuid NOT NULL,
  request_id text NOT NULL,
  unit text NOT NULL,
  material text NOT NULL,
  vendor text,
  category text NOT NULL,
  value_bn_idr numeric NOT NULL,
  delivery_date date NOT NULL,
  request_type text NOT NULL DEFAULT 'CAPEX',
  organization_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fact_sourcing_event_procurement_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to procurement requests"
  ON fact_sourcing_event_procurement_requests FOR SELECT
  USING (true);

CREATE POLICY "Allow anonymous insert access to procurement requests"
  ON fact_sourcing_event_procurement_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to procurement requests"
  ON fact_sourcing_event_procurement_requests FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to procurement requests"
  ON fact_sourcing_event_procurement_requests FOR DELETE
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sourcing_event_pr_event_id ON fact_sourcing_event_procurement_requests(sourcing_event_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_event_pr_org_id ON fact_sourcing_event_procurement_requests(organization_id);

-- Insert procurement requests for SRC-2025-001 (Siemens Mechanical Equipment Bundle)
INSERT INTO fact_sourcing_event_procurement_requests (
  sourcing_event_id,
  request_id,
  unit,
  material,
  vendor,
  category,
  value_bn_idr,
  delivery_date,
  request_type,
  organization_id
)
SELECT
  se.id,
  'PR-001',
  'Plant A',
  'Steam Turbine',
  'Siemens',
  'Mechanical Equipment',
  12.5,
  '2025-06-20'::date,
  'CAPEX',
  se.organization_id
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-001'
LIMIT 1;

INSERT INTO fact_sourcing_event_procurement_requests (
  sourcing_event_id,
  request_id,
  unit,
  material,
  vendor,
  category,
  value_bn_idr,
  delivery_date,
  request_type,
  organization_id
)
SELECT
  se.id,
  'PR-003',
  'Plant B',
  'Generator Rotor',
  'Siemens',
  'Mechanical Equipment',
  7.3,
  '2025-06-25'::date,
  'CAPEX',
  se.organization_id
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-001'
LIMIT 1;

INSERT INTO fact_sourcing_event_procurement_requests (
  sourcing_event_id,
  request_id,
  unit,
  material,
  vendor,
  category,
  value_bn_idr,
  delivery_date,
  request_type,
  organization_id
)
SELECT
  se.id,
  'PR-005',
  'Plant A',
  'Feedwater Pump',
  'Siemens',
  'Mechanical Equipment',
  3.2,
  '2025-06-22'::date,
  'CAPEX',
  se.organization_id
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-001'
LIMIT 1;

-- Insert procurement requests for SRC-2025-002 (ABB Electrical Systems)
INSERT INTO fact_sourcing_event_procurement_requests (
  sourcing_event_id,
  request_id,
  unit,
  material,
  vendor,
  category,
  value_bn_idr,
  delivery_date,
  request_type,
  organization_id
)
SELECT
  se.id,
  'PR-011',
  'Plant C',
  'Medium Voltage Switchgear',
  'ABB',
  'Electrical Equipment',
  8.5,
  '2025-07-05'::date,
  'CAPEX',
  se.organization_id
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-002'
LIMIT 1;

INSERT INTO fact_sourcing_event_procurement_requests (
  sourcing_event_id,
  request_id,
  unit,
  material,
  vendor,
  category,
  value_bn_idr,
  delivery_date,
  request_type,
  organization_id
)
SELECT
  se.id,
  'PR-012',
  'Plant D',
  'Transformer 30MVA',
  'ABB',
  'Electrical Equipment',
  10.4,
  '2025-07-10'::date,
  'CAPEX',
  se.organization_id
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-002'
LIMIT 1;

INSERT INTO fact_sourcing_event_procurement_requests (
  sourcing_event_id,
  request_id,
  unit,
  material,
  vendor,
  category,
  value_bn_idr,
  delivery_date,
  request_type,
  organization_id
)
SELECT
  se.id,
  'PR-013',
  'Plant D',
  'Control Panel Assembly',
  'ABB',
  'Electrical Equipment',
  5.6,
  '2025-07-08'::date,
  'CAPEX',
  se.organization_id
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-002'
LIMIT 1;

-- Insert procurement requests for SRC-2025-003 (Schneider Control Systems)
INSERT INTO fact_sourcing_event_procurement_requests (
  sourcing_event_id,
  request_id,
  unit,
  material,
  vendor,
  category,
  value_bn_idr,
  delivery_date,
  request_type,
  organization_id
)
SELECT
  se.id,
  'PR-021',
  'Plant E',
  'PLC Unit',
  'Schneider',
  'Control Systems',
  4.1,
  '2025-07-12'::date,
  'CAPEX',
  se.organization_id
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-003'
LIMIT 1;

INSERT INTO fact_sourcing_event_procurement_requests (
  sourcing_event_id,
  request_id,
  unit,
  material,
  vendor,
  category,
  value_bn_idr,
  delivery_date,
  request_type,
  organization_id
)
SELECT
  se.id,
  'PR-022',
  'Plant F',
  'DCS Controller',
  'Schneider',
  'Control Systems',
  8.2,
  '2025-07-15'::date,
  'CAPEX',
  se.organization_id
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-003'
LIMIT 1;