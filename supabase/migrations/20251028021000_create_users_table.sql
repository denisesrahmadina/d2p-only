/*
  # Create Users Table

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Auto-generated UUID
      - `user_id` (text, unique) - Original string identifier (e.g., 'user-ssc-004')
      - `organization_id` (text) - Reference to organization's org_id
      - `department_id` (text) - Reference to department's department_id
      - `name` (text) - User full name
      - `email` (text, unique) - User email address
      - `role` (text) - User role/position
      - `department` (text) - Department name
      - `permissions` (jsonb) - Array of user permissions
      - `last_login` (text) - Last login timestamp as text
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `users` table
    - Add policy for authenticated users to view all users
    - Add policies for authenticated users to manage users
    - Users can view their own data

  3. Data Migration
    - Imports existing user data from JSON structure
    - Links users to organizations and departments
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  organization_id text NOT NULL,
  department_id text NOT NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL,
  department text NOT NULL,
  permissions jsonb DEFAULT '[]'::jsonb,
  last_login text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_department_id ON users(department_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert initial user data
INSERT INTO users (user_id, organization_id, department_id, name, email, role, department, permissions, last_login)
VALUES
  (
    'user-ssc-004',
    'ssc-center',
    'ssc-procurement',
    'David Kumar',
    'david.kumar@ssc.com',
    'Procurement Director',
    'Procurement Services',
    '["procurement-operations", "vendor-management", "spend-analytics", "admin", "all-agents"]'::jsonb,
    '15 minutes ago'
  ),
  (
    'user-ssc-010',
    'ssc-center',
    'ssc-procurement',
    'James Wilson',
    'james.wilson@ssc.com',
    'Procurement Manager',
    'Procurement Services',
    '["procurement-operations", "vendor-management"]'::jsonb,
    '18 minutes ago'
  ),
  (
    'user-ssc-011',
    'ssc-center',
    'ssc-procurement',
    'Emily Zhang',
    'emily.zhang@ssc.com',
    'Senior Sourcing Specialist',
    'Procurement Services',
    '["procurement-operations", "sourcing-management"]'::jsonb,
    '25 minutes ago'
  ),
  (
    'user-ssc-012',
    'ssc-center',
    'ssc-procurement',
    'Robert Chen',
    'robert.chen@ssc.com',
    'Purchase Order Specialist',
    'Procurement Services',
    '["procurement-operations", "po-processing"]'::jsonb,
    '40 minutes ago'
  ),
  (
    'user-ssc-013',
    'ssc-center',
    'ssc-procurement',
    'Maria Garcia',
    'maria.garcia@ssc.com',
    'Vendor Relations Manager',
    'Procurement Services',
    '["vendor-management", "contract-management"]'::jsonb,
    '50 minutes ago'
  ),
  (
    'user-ssc-014',
    'ssc-center',
    'ssc-procurement',
    'Alex Thompson',
    'alex.thompson@ssc.com',
    'Spend Analytics Analyst',
    'Procurement Services',
    '["spend-analytics", "reporting"]'::jsonb,
    '1 hour ago'
  ),
  (
    'user-ip-001',
    'indonesia-power',
    'ip-procurement',
    'Rina Wijaya',
    'rina.wijaya@indonesiapower.co.id',
    'Procurement Director',
    'Procurement Department',
    '["procurement-operations", "vendor-management", "spend-analytics", "admin", "all-agents"]'::jsonb,
    '10 minutes ago'
  ),
  (
    'user-ip-002',
    'indonesia-power',
    'ip-procurement',
    'Agus Santoso',
    'agus.santoso@indonesiapower.co.id',
    'Strategic Sourcing Manager',
    'Strategic Sourcing',
    '["procurement-operations", "sourcing-management", "vendor-management"]'::jsonb,
    '22 minutes ago'
  ),
  (
    'user-ip-003',
    'indonesia-power',
    'ip-procurement',
    'Linda Kusuma',
    'linda.kusuma@indonesiapower.co.id',
    'Vendor Management Lead',
    'Vendor Management',
    '["vendor-management", "contract-management", "procurement-operations"]'::jsonb,
    '35 minutes ago'
  ),
  (
    'user-ip-004',
    'indonesia-power',
    'ip-procurement',
    'Budi Hartono',
    'budi.hartono@indonesiapower.co.id',
    'Contract Manager',
    'Contract Management',
    '["contract-management", "procurement-operations"]'::jsonb,
    '45 minutes ago'
  ),
  (
    'user-ip-005',
    'indonesia-power',
    'ip-procurement',
    'Sari Dewi',
    'sari.dewi@indonesiapower.co.id',
    'Senior Procurement Specialist',
    'Procurement Department',
    '["procurement-operations", "po-processing"]'::jsonb,
    '1 hour ago'
  ),
  (
    'user-ip-006',
    'indonesia-power',
    'ip-strategic-sourcing',
    'Hendra Wijaya',
    'hendra.wijaya@indonesiapower.co.id',
    'Sourcing Specialist - Coal & Fuel',
    'Strategic Sourcing',
    '["sourcing-management", "procurement-operations"]'::jsonb,
    '1 hour ago'
  ),
  (
    'user-ip-007',
    'indonesia-power',
    'ip-strategic-sourcing',
    'Putri Rahayu',
    'putri.rahayu@indonesiapower.co.id',
    'Sourcing Specialist - Equipment',
    'Strategic Sourcing',
    '["sourcing-management", "procurement-operations"]'::jsonb,
    '2 hours ago'
  ),
  (
    'user-ip-008',
    'indonesia-power',
    'ip-vendor-management',
    'Dedi Suryanto',
    'dedi.suryanto@indonesiapower.co.id',
    'Vendor Relations Specialist',
    'Vendor Management',
    '["vendor-management"]'::jsonb,
    '3 hours ago'
  ),
  (
    'user-ip-009',
    'indonesia-power',
    'ip-procurement',
    'Maya Sari',
    'maya.sari@indonesiapower.co.id',
    'Demand Planner',
    'Procurement Department',
    '["procurement-operations", "demand-planning"]'::jsonb,
    '4 hours ago'
  ),
  (
    'user-ip-010',
    'indonesia-power',
    'ip-procurement',
    'Andi Nugroho',
    'andi.nugroho@indonesiapower.co.id',
    'Procurement Analyst',
    'Procurement Department',
    '["spend-analytics", "reporting"]'::jsonb,
    '5 hours ago'
  )
ON CONFLICT (user_id) DO NOTHING;
