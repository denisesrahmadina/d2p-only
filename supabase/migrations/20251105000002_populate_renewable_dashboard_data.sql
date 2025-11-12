/*
  # Populate Renewable Energy Dashboard Mock Data

  1. Data Population
    - Insert 5 renewable energy sourcing events (Solar, Wind, Battery)
    - Add vendor submission data with realistic ratios
    - Insert evaluation assignments with Indonesian personnel
    - Generate actionable insights based on event status

  2. Personnel Names (Indonesian)
    - Ari Pramana (Procurement Officer)
    - Nina Kusuma (Senior Buyer)
    - Rafi Santoso (Category Manager)
    - Dewi Lestari (Technical Evaluator)
    - Budi Hartono (Financial Analyst)
    - Siti Nurhaliza (Compliance Officer)
    - Agus Wijaya (Procurement Manager)
*/

-- Insert renewable sourcing events
INSERT INTO renewable_sourcing_events (id, title, category, description, status, deadline, assigned_personnel, budget_estimate, vendor_invited_count, vendor_submitted_count, evaluation_progress, approval_status) VALUES
('RSE-2025-001', 'Solar Panel Supply Q1 2025', 'Solar', 'Procurement of 500 high-efficiency solar panels for Suralaya renewable energy expansion project', 'In Progress', '2025-02-15', 'Ari Pramana', 8500000000, 5, 3, 60, 'Approved'),
('RSE-2025-002', 'Wind Turbine Components', 'Wind', 'Supply of wind turbine blades and control systems for offshore wind farm development', 'Scheduled', '2025-03-10', 'Nina Kusuma', 15000000000, 6, 2, 30, 'Approved'),
('RSE-2025-003', 'Battery Storage System Procurement', 'Battery', 'Large-scale lithium-ion battery storage system for grid stabilization and renewable integration', 'Draft', '2025-03-25', 'Rafi Santoso', 12000000000, 4, 0, 0, 'Pending'),
('RSE-2025-004', 'Solar Inverter and Power Electronics', 'Solar', 'High-capacity solar inverters and power conversion equipment for multiple power plants', 'In Progress', '2025-02-28', 'Ari Pramana', 6500000000, 5, 4, 85, 'Approved'),
('RSE-2025-005', 'Offshore Wind Foundation Engineering', 'Wind', 'Design and supply of offshore wind turbine foundation structures and marine equipment', 'Scheduled', '2025-04-05', 'Nina Kusuma', 22000000000, 3, 1, 45, 'Approved')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  deadline = EXCLUDED.deadline,
  assigned_personnel = EXCLUDED.assigned_personnel,
  budget_estimate = EXCLUDED.budget_estimate,
  vendor_invited_count = EXCLUDED.vendor_invited_count,
  vendor_submitted_count = EXCLUDED.vendor_submitted_count,
  evaluation_progress = EXCLUDED.evaluation_progress,
  approval_status = EXCLUDED.approval_status,
  updated_at = NOW();

-- Insert vendor submissions for RSE-2025-001 (Solar Panel Supply)
INSERT INTO vendor_submissions (sourcing_event_id, vendor_name, invitation_date, submission_date, submission_status, document_completeness, technical_doc_status, financial_doc_status) VALUES
('RSE-2025-001', 'PT Len Industri (Persero)', '2025-01-15', '2025-01-28', 'Submitted', 100, 'Complete', 'Complete'),
('RSE-2025-001', 'PT United Tractors Tbk', '2025-01-15', '2025-01-30', 'Submitted', 95, 'Complete', 'Incomplete'),
('RSE-2025-001', 'PT Wijaya Karya (Persero) Tbk', '2025-01-15', '2025-02-02', 'Submitted', 88, 'Incomplete', 'Complete'),
('RSE-2025-001', 'PT Waskita Karya (Persero) Tbk', '2025-01-15', NULL, 'Pending', 0, 'Missing', 'Missing'),
('RSE-2025-001', 'PT Adhi Karya (Persero) Tbk', '2025-01-15', NULL, 'Overdue', 0, 'Missing', 'Missing')
ON CONFLICT DO NOTHING;

-- Insert vendor submissions for RSE-2025-002 (Wind Turbine)
INSERT INTO vendor_submissions (sourcing_event_id, vendor_name, invitation_date, submission_date, submission_status, document_completeness, technical_doc_status, financial_doc_status) VALUES
('RSE-2025-002', 'PT General Electric Indonesia', '2025-01-20', '2025-02-05', 'Submitted', 100, 'Complete', 'Complete'),
('RSE-2025-002', 'PT Siemens Indonesia', '2025-01-20', '2025-02-08', 'Submitted', 92, 'Complete', 'Incomplete'),
('RSE-2025-002', 'PT Vestas Indonesia', '2025-01-20', NULL, 'Pending', 0, 'Missing', 'Missing'),
('RSE-2025-002', 'PT Gamesa Renewable Indonesia', '2025-01-20', NULL, 'Pending', 0, 'Missing', 'Missing'),
('RSE-2025-002', 'PT Nordex Indonesia', '2025-01-20', NULL, 'Pending', 0, 'Missing', 'Missing'),
('RSE-2025-002', 'PT Suzlon Energy Indonesia', '2025-01-20', NULL, 'Pending', 0, 'Missing', 'Missing')
ON CONFLICT DO NOTHING;

-- Insert vendor submissions for RSE-2025-003 (Battery Storage)
INSERT INTO vendor_submissions (sourcing_event_id, vendor_name, invitation_date, submission_date, submission_status, document_completeness, technical_doc_status, financial_doc_status) VALUES
('RSE-2025-003', 'PT LG Energy Solution Indonesia', '2025-02-01', NULL, 'Invited', 0, 'Missing', 'Missing'),
('RSE-2025-003', 'PT Tesla Energy Indonesia', '2025-02-01', NULL, 'Invited', 0, 'Missing', 'Missing'),
('RSE-2025-003', 'PT CATL Indonesia', '2025-02-01', NULL, 'Invited', 0, 'Missing', 'Missing'),
('RSE-2025-003', 'PT BYD Energy Indonesia', '2025-02-01', NULL, 'Invited', 0, 'Missing', 'Missing')
ON CONFLICT DO NOTHING;

-- Insert vendor submissions for RSE-2025-004 (Solar Inverter)
INSERT INTO vendor_submissions (sourcing_event_id, vendor_name, invitation_date, submission_date, submission_status, document_completeness, technical_doc_status, financial_doc_status) VALUES
('RSE-2025-004', 'PT ABB Power Systems Indonesia', '2025-01-18', '2025-01-25', 'Submitted', 100, 'Complete', 'Complete'),
('RSE-2025-004', 'PT Schneider Electric Indonesia', '2025-01-18', '2025-01-27', 'Submitted', 100, 'Complete', 'Complete'),
('RSE-2025-004', 'PT SMA Solar Technology Indonesia', '2025-01-18', '2025-01-29', 'Submitted', 95, 'Complete', 'Incomplete'),
('RSE-2025-004', 'PT Fronius Indonesia', '2025-01-18', '2025-02-01', 'Submitted', 98, 'Complete', 'Complete'),
('RSE-2025-004', 'PT Huawei Digital Power Indonesia', '2025-01-18', NULL, 'Pending', 0, 'Missing', 'Missing')
ON CONFLICT DO NOTHING;

-- Insert vendor submissions for RSE-2025-005 (Offshore Wind Foundation)
INSERT INTO vendor_submissions (sourcing_event_id, vendor_name, invitation_date, submission_date, submission_status, document_completeness, technical_doc_status, financial_doc_status) VALUES
('RSE-2025-005', 'PT McDermott Indonesia', '2025-02-05', '2025-02-18', 'Submitted', 87, 'Complete', 'Incomplete'),
('RSE-2025-005', 'PT Saipem Indonesia', '2025-02-05', NULL, 'Pending', 0, 'Missing', 'Missing'),
('RSE-2025-005', 'PT TechnipFMC Indonesia', '2025-02-05', NULL, 'Pending', 0, 'Missing', 'Missing')
ON CONFLICT DO NOTHING;

-- Insert tender evaluations for RSE-2025-001 (Solar Panel Supply)
INSERT INTO tender_evaluations (sourcing_event_id, evaluator_name, evaluation_criteria, progress_percentage, status, assigned_date, completion_date, notes) VALUES
('RSE-2025-001', 'Dewi Lestari', 'Technical', 80, 'In Progress', '2025-02-03', NULL, 'Technical specifications review ongoing'),
('RSE-2025-001', 'Budi Hartono', 'Financial', 60, 'In Progress', '2025-02-03', NULL, 'Cost analysis in progress'),
('RSE-2025-001', 'Siti Nurhaliza', 'Compliance', 40, 'In Progress', '2025-02-04', NULL, 'Regulatory compliance check started')
ON CONFLICT DO NOTHING;

-- Insert tender evaluations for RSE-2025-002 (Wind Turbine)
INSERT INTO tender_evaluations (sourcing_event_id, evaluator_name, evaluation_criteria, progress_percentage, status, assigned_date, completion_date, notes) VALUES
('RSE-2025-002', 'Dewi Lestari', 'Technical', 40, 'In Progress', '2025-02-09', NULL, 'Reviewing turbine specifications and certifications'),
('RSE-2025-002', 'Budi Hartono', 'Financial', 20, 'In Progress', '2025-02-09', NULL, 'Initial financial assessment'),
('RSE-2025-002', 'Siti Nurhaliza', 'Compliance', 30, 'In Progress', '2025-02-10', NULL, 'Environmental compliance review')
ON CONFLICT DO NOTHING;

-- Insert tender evaluations for RSE-2025-003 (Battery Storage) - Not yet assigned
-- No evaluations as event is still in Draft status

-- Insert tender evaluations for RSE-2025-004 (Solar Inverter)
INSERT INTO tender_evaluations (sourcing_event_id, evaluator_name, evaluation_criteria, progress_percentage, status, assigned_date, completion_date, notes) VALUES
('RSE-2025-004', 'Dewi Lestari', 'Technical', 100, 'Completed', '2025-02-02', '2025-02-12', 'All technical evaluations completed successfully'),
('RSE-2025-004', 'Budi Hartono', 'Financial', 85, 'In Progress', '2025-02-02', NULL, 'Final cost-benefit analysis in progress'),
('RSE-2025-004', 'Siti Nurhaliza', 'Compliance', 70, 'In Progress', '2025-02-03', NULL, 'Safety standards verification ongoing')
ON CONFLICT DO NOTHING;

-- Insert tender evaluations for RSE-2025-005 (Offshore Wind Foundation)
INSERT INTO tender_evaluations (sourcing_event_id, evaluator_name, evaluation_criteria, progress_percentage, status, assigned_date, completion_date, notes) VALUES
('RSE-2025-005', 'Dewi Lestari', 'Technical', 60, 'In Progress', '2025-02-19', NULL, 'Marine engineering review in progress'),
('RSE-2025-005', 'Budi Hartono', 'Financial', 30, 'In Progress', '2025-02-19', NULL, 'Budget allocation analysis started'),
('RSE-2025-005', 'Siti Nurhaliza', 'Compliance', 45, 'In Progress', '2025-02-20', NULL, 'Environmental impact assessment review')
ON CONFLICT DO NOTHING;

-- Insert procurement insights
INSERT INTO procurement_insights (sourcing_event_id, insight_type, severity, title, description, suggested_action, is_resolved) VALUES
('RSE-2025-003', 'Assignment', 'Critical', 'Evaluator Not Assigned', 'Battery Storage System Procurement (RSE-2025-003) has no evaluators assigned despite approaching deadline', 'Assign technical, financial, and compliance evaluators immediately', false),
('RSE-2025-003', 'Deadline', 'Warning', 'Deadline Approaching with No Submissions', 'Battery Storage procurement deadline is 30 days away with zero vendor submissions received', 'Consider extending deadline or sending reminder to invited vendors', false),
('RSE-2025-001', 'Participation', 'Warning', 'Low Vendor Response Rate', 'Solar Panel Supply has only 60% vendor submission rate (3 out of 5 invited)', 'Follow up with pending vendors: PT Waskita Karya and PT Adhi Karya', false),
('RSE-2025-002', 'Participation', 'Critical', 'Poor Vendor Participation', 'Wind Turbine Components has only 33% submission rate (2 out of 6 vendors)', 'Extend submission deadline and send urgent reminders to 4 pending vendors', false),
('RSE-2025-004', 'Approval', 'Info', 'Ready for Manager Approval', 'Solar Inverter evaluation is 85% complete and ready for final manager approval', 'Route to Agus Wijaya (Procurement Manager) for approval decision', false),
(NULL, 'Evaluation', 'Warning', 'Delayed Evaluations Across Multiple Events', 'Average evaluation progress across all active events is only 52%, below target of 75%', 'Allocate additional resources and set milestone checkpoints for evaluators', false)
ON CONFLICT DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_procurement_dashboard_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_renewable_sourcing_events_updated_at ON renewable_sourcing_events;
CREATE TRIGGER trigger_update_renewable_sourcing_events_updated_at
  BEFORE UPDATE ON renewable_sourcing_events
  FOR EACH ROW
  EXECUTE FUNCTION update_procurement_dashboard_updated_at();

DROP TRIGGER IF EXISTS trigger_update_vendor_submissions_updated_at ON vendor_submissions;
CREATE TRIGGER trigger_update_vendor_submissions_updated_at
  BEFORE UPDATE ON vendor_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_procurement_dashboard_updated_at();

DROP TRIGGER IF EXISTS trigger_update_tender_evaluations_updated_at ON tender_evaluations;
CREATE TRIGGER trigger_update_tender_evaluations_updated_at
  BEFORE UPDATE ON tender_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_procurement_dashboard_updated_at();

DROP TRIGGER IF EXISTS trigger_update_procurement_insights_updated_at ON procurement_insights;
CREATE TRIGGER trigger_update_procurement_insights_updated_at
  BEFORE UPDATE ON procurement_insights
  FOR EACH ROW
  EXECUTE FUNCTION update_procurement_dashboard_updated_at();
