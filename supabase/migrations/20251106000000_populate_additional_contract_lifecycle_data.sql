/*
  # Populate Additional Contract Lifecycle Management Data
  
  Adds comprehensive mock data for demonstration including AI insights,
  change logs, approvals, personnel, and digital signatures.
*/

-- Insert AI Insights for Solar Panel Contract Workspace
INSERT INTO ref_contract_ai_insight (contract_workspace_id, insight_type, risk_category, severity, title, description, affected_section, recommendations, auto_applied, applied_by, applied_at)
SELECT
  w.id,
  'Missing Clause',
  'Compliance',
  'High',
  'Missing Grid Compliance Clause',
  'The contract does not explicitly reference PLN Grid Code 2023 compliance requirements. All solar installations connecting to the national grid must demonstrate compliance with PLN technical standards including voltage regulation, frequency response, and power quality specifications.',
  'gridIntegration',
  '["Add specific PLN Grid Code 2023 reference", "Include grid connection technical requirements", "Specify grid synchronization protocols"]'::jsonb,
  false,
  NULL,
  NULL
FROM fact_contract_workspace w
WHERE w.sourcing_event_id = 'SE-2025-SOLAR-Q1'
LIMIT 1;

