/*
  # OTIF (On-Time In-Full) Tracking System

  ## Overview
  Creates comprehensive supplier delivery performance tracking system with OTIF metrics.
  OTIF measures supplier reliability based on two criteria:
  - On-Time: Delivery arrives by or before the expected delivery date
  - In-Full: Complete ordered quantity is delivered

  ## New Tables

  ### `supplier_otif_deliveries`
  Tracks individual delivery records with timeliness and quantity completeness data.

  **Columns:**
  - `id` (uuid, primary key) - Unique delivery record identifier
  - `organization_id` (text) - Organization identifier for multi-tenant support
  - `purchase_order_id` (text) - Reference to purchase order
  - `supplier_id` (text) - Supplier identifier
  - `supplier_name` (text) - Supplier name for easy reference
  - `order_date` (date) - When the order was placed
  - `expected_delivery_date` (date) - Expected/promised delivery date
  - `actual_delivery_date` (date, nullable) - When delivery actually occurred
  - `quantity_ordered` (numeric) - Total quantity ordered
  - `quantity_delivered` (numeric) - Total quantity actually delivered
  - `is_on_time` (boolean) - Calculated: delivery date <= expected date
  - `is_in_full` (boolean) - Calculated: delivered qty >= ordered qty
  - `is_otif` (boolean) - Calculated: both on_time AND in_full
  - `delivery_status` (text) - Current status: 'pending', 'delivered', 'partial', 'late'
  - `delay_days` (integer, nullable) - Days delayed if late
  - `quantity_shortage` (numeric, nullable) - Quantity short if partial
  - `product_category` (text) - Type of materials/products
  - `failure_reason` (text, nullable) - Reason for OTIF failure
  - `notes` (text, nullable) - Additional notes
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `supplier_otif_performance`
  Aggregated supplier performance metrics by time period.

  **Columns:**
  - `id` (uuid, primary key) - Unique performance record identifier
  - `organization_id` (text) - Organization identifier
  - `supplier_id` (text) - Supplier identifier
  - `supplier_name` (text) - Supplier name
  - `period_start` (date) - Start of measurement period
  - `period_end` (date) - End of measurement period
  - `total_deliveries` (integer) - Total number of deliveries
  - `on_time_deliveries` (integer) - Count of on-time deliveries
  - `in_full_deliveries` (integer) - Count of in-full deliveries
  - `otif_deliveries` (integer) - Count of OTIF (both) deliveries
  - `on_time_percentage` (numeric) - % on time (0-100)
  - `in_full_percentage` (numeric) - % in full (0-100)
  - `otif_percentage` (numeric) - % OTIF (0-100)
  - `avg_delay_days` (numeric, nullable) - Average delay for late deliveries
  - `supplier_tier` (text) - Supplier classification: 'strategic', 'preferred', 'standard'
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Allow public read access for demo purposes (can be restricted later)
  - Restrict write operations to authenticated users

  ## Indexes
  - Optimize queries by supplier_id, organization_id, and date ranges
*/

-- Create supplier_otif_deliveries table
CREATE TABLE IF NOT EXISTS supplier_otif_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NOT NULL,
  purchase_order_id text NOT NULL,
  supplier_id text NOT NULL,
  supplier_name text NOT NULL,
  order_date date NOT NULL,
  expected_delivery_date date NOT NULL,
  actual_delivery_date date,
  quantity_ordered numeric NOT NULL DEFAULT 0,
  quantity_delivered numeric NOT NULL DEFAULT 0,
  is_on_time boolean NOT NULL DEFAULT false,
  is_in_full boolean NOT NULL DEFAULT false,
  is_otif boolean NOT NULL DEFAULT false,
  delivery_status text NOT NULL DEFAULT 'pending',
  delay_days integer,
  quantity_shortage numeric,
  product_category text NOT NULL DEFAULT 'general',
  failure_reason text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create supplier_otif_performance table
CREATE TABLE IF NOT EXISTS supplier_otif_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NOT NULL,
  supplier_id text NOT NULL,
  supplier_name text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_deliveries integer NOT NULL DEFAULT 0,
  on_time_deliveries integer NOT NULL DEFAULT 0,
  in_full_deliveries integer NOT NULL DEFAULT 0,
  otif_deliveries integer NOT NULL DEFAULT 0,
  on_time_percentage numeric NOT NULL DEFAULT 0,
  in_full_percentage numeric NOT NULL DEFAULT 0,
  otif_percentage numeric NOT NULL DEFAULT 0,
  avg_delay_days numeric,
  supplier_tier text NOT NULL DEFAULT 'standard',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_otif_deliveries_org ON supplier_otif_deliveries(organization_id);
CREATE INDEX IF NOT EXISTS idx_otif_deliveries_supplier ON supplier_otif_deliveries(supplier_id);
CREATE INDEX IF NOT EXISTS idx_otif_deliveries_status ON supplier_otif_deliveries(delivery_status);
CREATE INDEX IF NOT EXISTS idx_otif_deliveries_dates ON supplier_otif_deliveries(expected_delivery_date, actual_delivery_date);
CREATE INDEX IF NOT EXISTS idx_otif_deliveries_po ON supplier_otif_deliveries(purchase_order_id);

CREATE INDEX IF NOT EXISTS idx_otif_performance_org ON supplier_otif_performance(organization_id);
CREATE INDEX IF NOT EXISTS idx_otif_performance_supplier ON supplier_otif_performance(supplier_id);
CREATE INDEX IF NOT EXISTS idx_otif_performance_period ON supplier_otif_performance(period_start, period_end);

-- Enable Row Level Security
ALTER TABLE supplier_otif_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_otif_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for supplier_otif_deliveries
CREATE POLICY "Allow public read access to otif deliveries"
  ON supplier_otif_deliveries
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert otif deliveries"
  ON supplier_otif_deliveries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update otif deliveries"
  ON supplier_otif_deliveries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for supplier_otif_performance
CREATE POLICY "Allow public read access to otif performance"
  ON supplier_otif_performance
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert otif performance"
  ON supplier_otif_performance
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update otif performance"
  ON supplier_otif_performance
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Populate with mock data for demonstration
-- Strategic Partners - High Performance (95%+ OTIF)
INSERT INTO supplier_otif_deliveries (
  organization_id, purchase_order_id, supplier_id, supplier_name,
  order_date, expected_delivery_date, actual_delivery_date,
  quantity_ordered, quantity_delivered,
  is_on_time, is_in_full, is_otif,
  delivery_status, delay_days, quantity_shortage,
  product_category
) VALUES
-- PT Energi Prima (Strategic Partner - Excellent Performance)
('ORG001', 'PO-2024-001', 'SUP-001', 'PT Energi Prima', '2024-10-01', '2024-10-15', '2024-10-14', 1000, 1000, true, true, true, 'delivered', 0, 0, 'Raw Materials'),
('ORG001', 'PO-2024-002', 'SUP-001', 'PT Energi Prima', '2024-10-05', '2024-10-20', '2024-10-19', 500, 500, true, true, true, 'delivered', 0, 0, 'Components'),
('ORG001', 'PO-2024-003', 'SUP-001', 'PT Energi Prima', '2024-10-10', '2024-10-25', '2024-10-25', 750, 750, true, true, true, 'delivered', 0, 0, 'Raw Materials'),
('ORG001', 'PO-2024-004', 'SUP-001', 'PT Energi Prima', '2024-10-15', '2024-11-01', '2024-10-30', 1200, 1200, true, true, true, 'delivered', 0, 0, 'Equipment'),
('ORG001', 'PO-2024-005', 'SUP-001', 'PT Energi Prima', '2024-10-20', '2024-11-05', '2024-11-06', 800, 800, false, true, false, 'delivered', 1, 0, 'Components'),

-- CV Mitra Sejati (Preferred Partner - Good Performance)
('ORG001', 'PO-2024-010', 'SUP-002', 'CV Mitra Sejati', '2024-10-02', '2024-10-18', '2024-10-17', 600, 600, true, true, true, 'delivered', 0, 0, 'Spare Parts'),
('ORG001', 'PO-2024-011', 'SUP-002', 'CV Mitra Sejati', '2024-10-08', '2024-10-22', '2024-10-23', 400, 400, false, true, false, 'delivered', 1, 0, 'Tools'),
('ORG001', 'PO-2024-012', 'SUP-002', 'CV Mitra Sejati', '2024-10-12', '2024-10-28', '2024-10-27', 900, 900, true, true, true, 'delivered', 0, 0, 'Spare Parts'),
('ORG001', 'PO-2024-013', 'SUP-002', 'CV Mitra Sejati', '2024-10-18', '2024-11-03', '2024-11-02', 550, 550, true, true, true, 'delivered', 0, 0, 'Components'),
('ORG001', 'PO-2024-014', 'SUP-002', 'CV Mitra Sejati', '2024-10-25', '2024-11-08', '2024-11-08', 700, 650, true, false, false, 'delivered', 0, 50, 'Tools'),

-- PT Indo Supply (Standard Supplier - Moderate Performance)
('ORG001', 'PO-2024-020', 'SUP-003', 'PT Indo Supply', '2024-10-03', '2024-10-19', '2024-10-21', 800, 800, false, true, false, 'delivered', 2, 0, 'General Supplies'),
('ORG001', 'PO-2024-021', 'SUP-003', 'PT Indo Supply', '2024-10-07', '2024-10-21', '2024-10-20', 300, 300, true, true, true, 'delivered', 0, 0, 'Office Supplies'),
('ORG001', 'PO-2024-022', 'SUP-003', 'PT Indo Supply', '2024-10-14', '2024-10-30', '2024-11-02', 450, 400, false, false, false, 'delivered', 3, 50, 'General Supplies'),
('ORG001', 'PO-2024-023', 'SUP-003', 'PT Indo Supply', '2024-10-20', '2024-11-05', '2024-11-04', 600, 600, true, true, true, 'delivered', 0, 0, 'Materials'),
('ORG001', 'PO-2024-024', 'SUP-003', 'PT Indo Supply', '2024-10-28', '2024-11-12', null, 500, 0, false, false, false, 'pending', null, null, 'Office Supplies'),

-- Global Tech Solutions (International - Variable Performance)
('ORG001', 'PO-2024-030', 'SUP-004', 'Global Tech Solutions', '2024-09-15', '2024-10-15', '2024-10-18', 2000, 2000, false, true, false, 'delivered', 3, 0, 'Electronics'),
('ORG001', 'PO-2024-031', 'SUP-004', 'Global Tech Solutions', '2024-09-25', '2024-10-25', '2024-10-24', 1500, 1500, true, true, true, 'delivered', 0, 0, 'Technology'),
('ORG001', 'PO-2024-032', 'SUP-004', 'Global Tech Solutions', '2024-10-05', '2024-11-05', '2024-11-08', 1800, 1600, false, false, false, 'delivered', 3, 200, 'Electronics'),
('ORG001', 'PO-2024-033', 'SUP-004', 'Global Tech Solutions', '2024-10-15', '2024-11-15', null, 2200, 0, false, false, false, 'pending', null, null, 'Technology'),

-- CV Berkah Jaya (Local Supplier - Below Average)
('ORG001', 'PO-2024-040', 'SUP-005', 'CV Berkah Jaya', '2024-10-04', '2024-10-20', '2024-10-23', 400, 350, false, false, false, 'delivered', 3, 50, 'Packaging'),
('ORG001', 'PO-2024-041', 'SUP-005', 'CV Berkah Jaya', '2024-10-10', '2024-10-26', '2024-10-27', 350, 350, false, true, false, 'delivered', 1, 0, 'Materials'),
('ORG001', 'PO-2024-042', 'SUP-005', 'CV Berkah Jaya', '2024-10-16', '2024-11-01', '2024-11-04', 500, 450, false, false, false, 'delivered', 3, 50, 'Packaging'),
('ORG001', 'PO-2024-043', 'SUP-005', 'CV Berkah Jaya', '2024-10-22', '2024-11-07', '2024-11-06', 300, 300, true, true, true, 'delivered', 0, 0, 'Materials'),
('ORG001', 'PO-2024-044', 'SUP-005', 'CV Berkah Jaya', '2024-10-30', '2024-11-14', null, 400, 0, false, false, false, 'pending', null, null, 'Packaging');

-- Add failure reasons for failed deliveries
UPDATE supplier_otif_deliveries
SET failure_reason = 'Logistics delay due to weather conditions'
WHERE is_otif = false AND delay_days > 0 AND delay_days <= 2;

UPDATE supplier_otif_deliveries
SET failure_reason = 'Production capacity constraints'
WHERE is_otif = false AND quantity_shortage > 0;

UPDATE supplier_otif_deliveries
SET failure_reason = 'Transportation bottleneck at port'
WHERE is_otif = false AND delay_days > 2;

-- Calculate aggregated performance metrics
INSERT INTO supplier_otif_performance (
  organization_id, supplier_id, supplier_name,
  period_start, period_end,
  total_deliveries, on_time_deliveries, in_full_deliveries, otif_deliveries,
  on_time_percentage, in_full_percentage, otif_percentage,
  avg_delay_days, supplier_tier
)
SELECT
  organization_id,
  supplier_id,
  supplier_name,
  DATE_TRUNC('month', MIN(order_date))::date as period_start,
  DATE_TRUNC('month', MAX(order_date))::date + INTERVAL '1 month - 1 day' as period_end,
  COUNT(*) FILTER (WHERE delivery_status = 'delivered') as total_deliveries,
  COUNT(*) FILTER (WHERE is_on_time = true AND delivery_status = 'delivered') as on_time_deliveries,
  COUNT(*) FILTER (WHERE is_in_full = true AND delivery_status = 'delivered') as in_full_deliveries,
  COUNT(*) FILTER (WHERE is_otif = true AND delivery_status = 'delivered') as otif_deliveries,
  ROUND((COUNT(*) FILTER (WHERE is_on_time = true AND delivery_status = 'delivered')::numeric /
         NULLIF(COUNT(*) FILTER (WHERE delivery_status = 'delivered'), 0) * 100), 2) as on_time_percentage,
  ROUND((COUNT(*) FILTER (WHERE is_in_full = true AND delivery_status = 'delivered')::numeric /
         NULLIF(COUNT(*) FILTER (WHERE delivery_status = 'delivered'), 0) * 100), 2) as in_full_percentage,
  ROUND((COUNT(*) FILTER (WHERE is_otif = true AND delivery_status = 'delivered')::numeric /
         NULLIF(COUNT(*) FILTER (WHERE delivery_status = 'delivered'), 0) * 100), 2) as otif_percentage,
  ROUND(AVG(delay_days) FILTER (WHERE delay_days > 0), 2) as avg_delay_days,
  CASE
    WHEN ROUND((COUNT(*) FILTER (WHERE is_otif = true AND delivery_status = 'delivered')::numeric /
         NULLIF(COUNT(*) FILTER (WHERE delivery_status = 'delivered'), 0) * 100), 2) >= 95 THEN 'strategic'
    WHEN ROUND((COUNT(*) FILTER (WHERE is_otif = true AND delivery_status = 'delivered')::numeric /
         NULLIF(COUNT(*) FILTER (WHERE delivery_status = 'delivered'), 0) * 100), 2) >= 85 THEN 'preferred'
    ELSE 'standard'
  END as supplier_tier
FROM supplier_otif_deliveries
WHERE delivery_status = 'delivered'
GROUP BY organization_id, supplier_id, supplier_name;
