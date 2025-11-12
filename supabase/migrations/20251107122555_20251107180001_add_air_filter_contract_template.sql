/*
  # Add Air Filter Blanket Purchase Agreement Template

  1. New Template Data
    - Contract Name: Air Filter Blanket Purchase Agreement – FY2026
    - Owner: Nina Kusuma
    - Status: Draft
    - Last Modified: 3 days ago
    - Clause Count: 2 clauses
    
  2. Purpose
    - Add mock data for Recent Template Activity section
    - Demo contract template creation flow
*/

-- Insert Air Filter Blanket Purchase Agreement template
INSERT INTO fact_contract_template (
  id,
  sourcing_event_id,
  template_name,
  template_content,
  template_sections,
  status,
  version,
  created_by,
  approved_by,
  approval_status,
  approval_date,
  organization_id,
  created_at,
  updated_at
) VALUES (
  'a5555555-5555-5555-5555-555555555555',
  'SE-2026-005',
  'Air Filter Blanket Purchase Agreement – FY2026',
  '{"header": {"title": "Air Filter Blanket Purchase Agreement – FY2026", "contractNumber": "CNT-2026-005", "effectiveDate": "2026-01-01", "expiryDate": "2026-12-31"},
  "parties": {"buyer": "PT Indonesia Power", "supplier": "TBD - Pending Vendor Selection", "buyerAddress": "Jl. Ketintang Baru No. 11, Surabaya", "supplierAddress": "TBD"}}',
  '{"header": true, "parties": true}',
  'Draft',
  1,
  'Nina Kusuma',
  null,
  'Pending',
  null,
  null,
  now() - interval '3 days',
  now() - interval '3 days'
)
ON CONFLICT (id) DO UPDATE SET
  template_name = EXCLUDED.template_name,
  updated_at = EXCLUDED.updated_at;