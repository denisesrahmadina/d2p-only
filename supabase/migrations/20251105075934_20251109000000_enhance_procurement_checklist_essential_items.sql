/*
  # Enhance Procurement Checklist with Essential Items and Demo Data

  1. Purpose
    - Add essential procurement checklist items with predefined demonstration data
    - Include document metadata fields for completed items
    - Support AI generation and upload actions for incomplete items

  2. New Columns Added to fact_procurement_checklist
    - `file_name` (text) - Name of uploaded/generated document
    - `file_url` (text) - URL or path to document
    - `uploaded_by` (text) - User who uploaded the document
    - `uploaded_on` (timestamptz) - Upload timestamp
    - `document_summary` (text) - Brief summary of document content
    - `ai_generated` (boolean) - Whether document was AI-generated
    - `action_type` (text) - Type of action available (View/Generate/Upload)

  3. Demo Data
    - 10 essential checklist items for sourcing event SRC-2025-001
    - 6 completed items with full document metadata
    - 4 incomplete items ready for AI generation or upload

  4. Security
    - Maintains existing RLS policies
    - All demo data scoped to organization
*/

-- Add new columns to fact_procurement_checklist if they don't exist
ALTER TABLE fact_procurement_checklist ADD COLUMN IF NOT EXISTS file_name text;
ALTER TABLE fact_procurement_checklist ADD COLUMN IF NOT EXISTS file_url text;
ALTER TABLE fact_procurement_checklist ADD COLUMN IF NOT EXISTS uploaded_by text;
ALTER TABLE fact_procurement_checklist ADD COLUMN IF NOT EXISTS uploaded_on timestamptz;
ALTER TABLE fact_procurement_checklist ADD COLUMN IF NOT EXISTS document_summary text;
ALTER TABLE fact_procurement_checklist ADD COLUMN IF NOT EXISTS ai_generated boolean DEFAULT false;
ALTER TABLE fact_procurement_checklist ADD COLUMN IF NOT EXISTS action_type text DEFAULT 'View';

-- Clear existing checklist items for SRC-2025-001 to ensure clean demo data
DELETE FROM fact_procurement_checklist
WHERE sourcing_event_id IN (
  SELECT id::text FROM fact_sourcing_event WHERE sourcing_event_id = 'SRC-2025-001'
);

-- Insert 10 essential procurement checklist items with demonstration data
INSERT INTO fact_procurement_checklist (
  sourcing_event_id,
  item_name,
  item_type,
  description,
  status,
  priority,
  ai_rationale,
  completion_date,
  completed_by,
  auto_complete_trigger,
  assigned_to,
  organization_id,
  file_name,
  file_url,
  uploaded_by,
  uploaded_on,
  document_summary,
  ai_generated,
  action_type
)
SELECT
  se.id::text,
  'Bill of Quantity (BOQ)',
  'Document',
  'Itemized list of materials, quantities, and costs.',
  'Completed',
  'Critical',
  'BOQ is essential for accurate cost estimation and vendor bidding. This procurement involves multiple turbine components requiring detailed quantity breakdown.',
  '2025-10-25'::timestamptz,
  'Planner A',
  false,
  'Planner A',
  se.organization_id,
  'BOQ_Turbine_2025_v2.xlsx',
  '/documents/BOQ_Turbine_2025_v2.xlsx',
  'Planner A',
  '2025-10-25'::timestamptz,
  'Consolidated turbine and generator component quantities with detailed cost breakdown for renewable energy project.',
  false,
  'View'
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-001'
LIMIT 1;

INSERT INTO fact_procurement_checklist (
  sourcing_event_id,
  item_name,
  item_type,
  description,
  status,
  priority,
  ai_rationale,
  completion_date,
  completed_by,
  auto_complete_trigger,
  assigned_to,
  organization_id,
  file_name,
  file_url,
  uploaded_by,
  uploaded_on,
  document_summary,
  ai_generated,
  action_type
)
SELECT
  se.id::text,
  'Technical Drawing',
  'Document',
  'Engineering or layout drawings for equipment or works.',
  'In-Completed',
  'High',
  'Technical drawings are required to communicate precise specifications to vendors and ensure compliance with engineering standards.',
  null,
  null,
  false,
  'Engineering Team',
  se.organization_id,
  null,
  null,
  null,
  null,
  null,
  false,
  'Generate'
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-001'
LIMIT 1;

INSERT INTO fact_procurement_checklist (
  sourcing_event_id,
  item_name,
  item_type,
  description,
  status,
  priority,
  ai_rationale,
  completion_date,
  completed_by,
  auto_complete_trigger,
  assigned_to,
  organization_id,
  file_name,
  file_url,
  uploaded_by,
  uploaded_on,
  document_summary,
  ai_generated,
  action_type
)
SELECT
  se.id::text,
  'Technical Specification',
  'Document',
  'Detailed material or system specifications.',
  'Completed',
  'Critical',
  'Technical specifications ensure vendors understand exact requirements for turbine components including mechanical and electrical systems.',
  '2025-10-26'::timestamptz,
  'Planner B',
  false,
  'Planner B',
  se.organization_id,
  'TechSpec_Turbine_Rev3.pdf',
  '/documents/TechSpec_Turbine_Rev3.pdf',
  'Planner B',
  '2025-10-26'::timestamptz,
  'Detailed specs for mechanical and electrical systems including performance requirements, materials, and quality standards.',
  false,
  'View'
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-001'
LIMIT 1;

INSERT INTO fact_procurement_checklist (
  sourcing_event_id,
  item_name,
  item_type,
  description,
  status,
  priority,
  ai_rationale,
  completion_date,
  completed_by,
  auto_complete_trigger,
  assigned_to,
  organization_id,
  file_name,
  file_url,
  uploaded_by,
  uploaded_on,
  document_summary,
  ai_generated,
  action_type
)
SELECT
  se.id::text,
  'Budget Availability Confirmation',
  'Approval',
  'Financial validation ensuring sufficient budget allocation.',
  'Completed',
  'Critical',
  'Budget confirmation is mandatory before proceeding with tender to ensure financial capability and prevent procurement delays.',
  '2025-10-20'::timestamptz,
  'Finance Officer',
  false,
  'Finance Department',
  se.organization_id,
  'Budget_Availability_Sheet_2025.pdf',
  '/documents/Budget_Availability_Sheet_2025.pdf',
  'Finance Officer',
  '2025-10-20'::timestamptz,
  'Verified budget allocation of IDR 245,000,000,000 for renewable energy turbine procurement with fiscal year 2025 approval.',
  false,
  'View'
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-001'
LIMIT 1;

INSERT INTO fact_procurement_checklist (
  sourcing_event_id,
  item_name,
  item_type,
  description,
  status,
  priority,
  ai_rationale,
  completion_date,
  completed_by,
  auto_complete_trigger,
  assigned_to,
  organization_id,
  file_name,
  file_url,
  uploaded_by,
  uploaded_on,
  document_summary,
  ai_generated,
  action_type
)
SELECT
  se.id::text,
  'Tender Documents (Draft)',
  'Document',
  'Initial draft of tender documents including RKS and PQ.',
  'In-Completed',
  'Critical',
  'Tender documentation must be complete and compliant with regulations before publishing to vendors.',
  null,
  null,
  true,
  'Procurement Team',
  se.organization_id,
  null,
  null,
  null,
  null,
  null,
  false,
  'Generate'
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-001'
LIMIT 1;

INSERT INTO fact_procurement_checklist (
  sourcing_event_id,
  item_name,
  item_type,
  description,
  status,
  priority,
  ai_rationale,
  completion_date,
  completed_by,
  auto_complete_trigger,
  assigned_to,
  organization_id,
  file_name,
  file_url,
  uploaded_by,
  uploaded_on,
  document_summary,
  ai_generated,
  action_type
)
SELECT
  se.id::text,
  'Procurement Method Selection',
  'Decision',
  'Selected sourcing approach (e.g., Open Tender, Limited Tender).',
  'Completed',
  'High',
  'Method selection based on procurement value and market conditions. Open Tender selected due to high value and multiple qualified suppliers.',
  '2025-10-22'::timestamptz,
  'Planner A',
  false,
  'Planner A',
  se.organization_id,
  'Procurement_Method_Justification.pdf',
  '/documents/Procurement_Method_Justification.pdf',
  'Planner A',
  '2025-10-22'::timestamptz,
  'Open Tender method selected. Rationale: Category value exceeds IDR 10Bn threshold with multiple qualified suppliers available in market.',
  false,
  'View'
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-001'
LIMIT 1;

INSERT INTO fact_procurement_checklist (
  sourcing_event_id,
  item_name,
  item_type,
  description,
  status,
  priority,
  ai_rationale,
  completion_date,
  completed_by,
  auto_complete_trigger,
  assigned_to,
  organization_id,
  file_name,
  file_url,
  uploaded_by,
  uploaded_on,
  document_summary,
  ai_generated,
  action_type
)
SELECT
  se.id::text,
  'Risk & Compliance Review',
  'Compliance',
  'Compliance and risk assessment checklist.',
  'In-Completed',
  'High',
  'Risk and compliance review ensures adherence to regulatory requirements and identifies potential procurement risks.',
  null,
  null,
  false,
  'Compliance Team',
  se.organization_id,
  null,
  null,
  null,
  null,
  null,
  false,
  'Generate'
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-001'
LIMIT 1;

INSERT INTO fact_procurement_checklist (
  sourcing_event_id,
  item_name,
  item_type,
  description,
  status,
  priority,
  ai_rationale,
  completion_date,
  completed_by,
  auto_complete_trigger,
  assigned_to,
  organization_id,
  file_name,
  file_url,
  uploaded_by,
  uploaded_on,
  document_summary,
  ai_generated,
  action_type
)
SELECT
  se.id::text,
  'Approval Routing Setup',
  'Configuration',
  'List of required approvers and approval hierarchy.',
  'Completed',
  'High',
  'Approval routing must be configured to ensure proper governance and authorization throughout the procurement process.',
  '2025-10-23'::timestamptz,
  'Planner A',
  false,
  'Planner A',
  se.organization_id,
  'Approval_Routing_2025_Config.json',
  '/documents/Approval_Routing_2025_Config.json',
  'Planner A',
  '2025-10-23'::timestamptz,
  'Approval hierarchy configured: Procurement Manager → Legal Review → Finance Approval → Director Sign-off.',
  false,
  'View'
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-001'
LIMIT 1;

INSERT INTO fact_procurement_checklist (
  sourcing_event_id,
  item_name,
  item_type,
  description,
  status,
  priority,
  ai_rationale,
  completion_date,
  completed_by,
  auto_complete_trigger,
  assigned_to,
  organization_id,
  file_name,
  file_url,
  uploaded_by,
  uploaded_on,
  document_summary,
  ai_generated,
  action_type
)
SELECT
  se.id::text,
  'Evaluation Criteria Definition',
  'Document',
  'Defined criteria and weights for bid evaluation.',
  'In-Completed',
  'High',
  'Clear evaluation criteria ensure transparent and fair vendor selection based on technical capability, price, and delivery terms.',
  null,
  null,
  true,
  'Evaluation Committee',
  se.organization_id,
  null,
  null,
  null,
  null,
  null,
  false,
  'Generate'
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-001'
LIMIT 1;

INSERT INTO fact_procurement_checklist (
  sourcing_event_id,
  item_name,
  item_type,
  description,
  status,
  priority,
  ai_rationale,
  completion_date,
  completed_by,
  auto_complete_trigger,
  assigned_to,
  organization_id,
  file_name,
  file_url,
  uploaded_by,
  uploaded_on,
  document_summary,
  ai_generated,
  action_type
)
SELECT
  se.id::text,
  'Supplier Prequalification Review',
  'Validation',
  'Check existing vendor qualifications and eligibility.',
  'Completed',
  'Medium',
  'Supplier prequalification ensures only capable and reliable vendors participate, reducing procurement risk.',
  '2025-10-24'::timestamptz,
  'Procurement Officer',
  false,
  'Vendor Management Team',
  se.organization_id,
  'Supplier_Prequal_Report.pdf',
  '/documents/Supplier_Prequal_Report.pdf',
  'Procurement Officer',
  '2025-10-24'::timestamptz,
  'Prequalification review completed. Three vendors passed eligibility criteria: Siemens Energy, ABB Power Systems, Schneider Electric.',
  false,
  'View'
FROM fact_sourcing_event se
WHERE se.sourcing_event_id = 'SRC-2025-001'
LIMIT 1;