/*
  # Populate KPI Alerts System with Sample Data
  
  Creates realistic alerts, insights, and recommendations based on existing KPI data
*/

-- Insert Alerts for KPIs that are missing targets
INSERT INTO kpi_alerts (kpi_id, kpi_code, kpi_name, alert_type, severity, alert_status, current_value, target_value, threshold_breached, variance_percentage, root_cause_analysis, trend_direction, predicted_value, confidence_score, alert_data)
VALUES
-- Alert 1: PO Cycle Time exceeding target
(1, 'SCM-001', 'PO Cycle Time', 'threshold_breach', 'Medium', 'active', 3.8, 3, 'warning', 26.67,
 'Analysis shows delays in approval workflows and vendor response times. Recent trends indicate processing bottlenecks in the procurement team during peak periods.',
 'declining', 4.1, 78,
 '{"days_over_target": 0.8, "affected_departments": ["Procurement", "Logistics"], "peak_delay_hours": "14:00-16:00"}'::jsonb),

-- Alert 2: On-Time Delivery Rate below target
(2, 'SCM-002', 'On-Time Delivery Rate', 'target_miss', 'High', 'active', 91.5, 95, 'warning', -3.68,
 'Primary factors include supplier capacity constraints and transportation delays. Three major suppliers showing consistent late deliveries over past 60 days.',
 'stable', 90.8, 82,
 '{"late_deliveries_count": 85, "main_suppliers": ["Supplier A", "Supplier B", "Supplier C"], "avg_delay_days": 2.3}'::jsonb),

-- Alert 3: Procurement Cost Savings below target
(3, 'SCM-003', 'Procurement Cost Savings', 'target_miss', 'High', 'active', 4250, 5000, 'warning', -15.00,
 'Savings shortfall driven by market price increases and limited negotiation leverage. Strategic sourcing initiatives need acceleration to close the gap.',
 'declining', 4400, 75,
 '{"remaining_target": 750, "months_remaining": 2, "required_monthly_savings": 375}'::jsonb),

-- Alert 4: Supplier Quality Rating below target
(4, 'SCM-004', 'Supplier Quality Rating', 'target_miss', 'Medium', 'active', 4.2, 4.5, 'warning', -6.67,
 'Quality issues traced to three suppliers with recurring non-conformance. Increased rejection rates in Q3 impacting overall score.',
 'improving', 4.3, 70,
 '{"quality_issues_count": 45, "rejection_rate": 8.5, "affected_categories": ["Electrical", "Mechanical"]}'::jsonb),

-- Alert 5: Inventory Turnover below target
(5, 'SCM-005', 'Inventory Turnover Ratio', 'threshold_breach', 'Medium', 'active', 6.5, 8, 'warning', -18.75,
 'Slow-moving inventory in spare parts category. Overstocking of seasonal items and forecast inaccuracies contributing to lower turnover.',
 'improving', 6.8, 73,
 '{"slow_moving_items": 1250, "excess_inventory_value": 2500000000, "storage_cost_impact": 125000000}'::jsonb);

-- Insert Insights for each alert
INSERT INTO kpi_insights (kpi_id, alert_id, insight_type, insight_title, insight_description, predicted_outcome, prediction_timeframe, likelihood_percentage, contributing_factors, confidence_level)
VALUES
-- Insights for Alert 1
(1, 1, 'predictive', 'PO Cycle Time Trend Analysis',
 'Based on historical data analysis, PO cycle time is predicted to increase to 4.1 days by end of Q4 if current bottlenecks persist. The approval workflow shows 40% increase in processing time during month-end periods.',
 'PO cycle time will reach 4.1 days, missing target by 37% if no corrective action taken',
 '2 months',
 78,
 '[{"factor": "Approval workflow delays", "impact": "35%"}, {"factor": "Vendor response time", "impact": "30%"}, {"factor": "System downtime", "impact": "20%"}, {"factor": "Staff training gaps", "impact": "15%"}]'::jsonb,
 'high'),

(1, 1, 'diagnostic', 'Root Cause: Approval Bottlenecks',
 'Deep dive analysis reveals that 65% of PO delays occur in the approval stage. Average approval time has increased from 8 hours to 14 hours over the past quarter, primarily due to manual review processes and approver availability.',
 NULL, NULL, NULL,
 '[{"finding": "Manual approval process", "evidence": "14-hour avg approval time"}, {"finding": "Approver availability", "evidence": "45% delays due to approver absence"}, {"finding": "Incomplete PO submissions", "evidence": "28% require rework"}]'::jsonb,
 'high'),

-- Insights for Alert 2
(2, 2, 'predictive', 'Delivery Performance Forecast',
 'Machine learning model indicates on-time delivery rate may decline further to 90.8% next month if supplier issues remain unresolved. Historical correlation shows strong relationship between supplier lead time variance and delivery performance.',
 'Delivery rate projected to drop to 90.8%, creating production delays and customer impact',
 '30 days',
 82,
 '[{"factor": "Supplier capacity constraints", "impact": "45%"}, {"factor": "Transportation delays", "impact": "30%"}, {"factor": "Order accuracy issues", "impact": "15%"}, {"factor": "Weather disruptions", "impact": "10%"}]'::jsonb,
 'high'),

-- Insights for Alert 3
(3, 3, 'prescriptive', 'Cost Savings Acceleration Plan',
 'To achieve the IDR 5B target, an additional IDR 750M savings needed in next 2 months. Analysis suggests focusing on top 20% spend categories which represent 80% of total spend could yield required savings through strategic negotiations.',
 'Targeted initiatives in high-spend categories can close savings gap',
 '60 days',
 75,
 '[{"opportunity": "Strategic sourcing - top suppliers", "potential": "IDR 400M"}, {"opportunity": "Volume consolidation", "potential": "IDR 200M"}, {"opportunity": "Contract renegotiation", "potential": "IDR 150M"}]'::jsonb,
 'medium'),

-- Insights for Alert 4
(4, 4, 'diagnostic', 'Quality Issue Root Causes',
 'Analysis of 45 quality incidents reveals concentration among 3 suppliers accounting for 67% of all issues. Common patterns include packaging defects (35%), specification non-compliance (28%), and documentation errors (22%).',
 NULL, NULL, NULL,
 '[{"issue_type": "Packaging defects", "frequency": "35%"}, {"issue_type": "Spec non-compliance", "frequency": "28%"}, {"issue_type": "Documentation errors", "frequency": "22%"}, {"issue_type": "Delivery damage", "frequency": "15%"}]'::jsonb,
 'high'),

-- Insights for Alert 5
(5, 5, 'predictive', 'Inventory Optimization Opportunity',
 'Predictive analysis identifies IDR 2.5B in slow-moving inventory that can be reduced through demand forecasting improvements and just-in-time ordering. Current storage costs of IDR 125M annually could be reduced by 45%.',
 'Inventory optimization can improve turnover to 7.5x and reduce carrying costs',
 '90 days',
 73,
 '[{"category": "Slow-moving spare parts", "value": "IDR 1.8B"}, {"category": "Obsolete materials", "value": "IDR 400M"}, {"category": "Overstocked consumables", "value": "IDR 300M"}]'::jsonb,
 'medium');

-- Insert Recommendations for each alert
INSERT INTO kpi_recommendations (alert_id, kpi_id, recommendation_title, recommendation_description, recommendation_type, priority, estimated_impact, implementation_effort, action_steps, responsible_role, estimated_timeline, expected_outcome)
VALUES
-- Recommendations for Alert 1
(1, 1, 'Implement Digital Approval Workflow',
 'Deploy automated approval routing system with mobile notifications to reduce approval cycle time. Configure parallel approvals where possible and implement auto-approval for low-value POs.',
 'immediate_action', 'high',
 'Reduce approval time from 14 hours to 4 hours, improving overall PO cycle time by 25%',
 'medium',
 '[{"step": 1, "action": "Configure workflow rules in procurement system", "duration": "1 week"}, {"step": 2, "action": "Enable mobile approval app for all approvers", "duration": "3 days"}, {"step": 3, "action": "Set auto-approval thresholds", "duration": "2 days"}, {"step": 4, "action": "Train users and monitor adoption", "duration": "2 weeks"}]'::jsonb,
 'IT Manager & Procurement Manager',
 '3-4 weeks',
 'PO cycle time reduced to 3.2 days, within acceptable range of target'),

(1, 1, 'Vendor Performance Management Program',
 'Establish formal vendor SLA monitoring with penalties for slow response. Implement vendor scorecards tracking response time and compliance.',
 'short_term', 'high',
 'Improve vendor response time by 30%, contributing to faster PO completion',
 'medium',
 '[{"step": 1, "action": "Define vendor response SLAs", "duration": "1 week"}, {"step": 2, "action": "Communicate SLAs to vendors", "duration": "1 week"}, {"step": 3, "action": "Implement automated tracking", "duration": "2 weeks"}, {"step": 4, "action": "Monthly vendor review meetings", "duration": "ongoing"}]'::jsonb,
 'Supply Chain Director',
 '1 month',
 'Vendor response time improved from average 1.5 days to 1 day'),

-- Recommendations for Alert 2
(2, 2, 'Supplier Development Initiative',
 'Work directly with the 3 underperforming suppliers to address capacity and quality issues. Provide technical support and consider dual sourcing for critical items.',
 'immediate_action', 'critical',
 'Improve on-time delivery from 91.5% to 94% within 60 days',
 'high',
 '[{"step": 1, "action": "Conduct supplier assessments", "duration": "1 week"}, {"step": 2, "action": "Create improvement plans with each supplier", "duration": "1 week"}, {"step": 3, "action": "Weekly progress monitoring", "duration": "8 weeks"}, {"step": 4, "action": "Identify backup suppliers", "duration": "2 weeks"}]'::jsonb,
 'Procurement Director',
 '2 months',
 'On-time delivery reaches 94%, reducing production delays'),

(2, 2, 'Transportation Route Optimization',
 'Partner with logistics provider to optimize delivery routes and implement real-time tracking. Consider alternative carriers for high-delay routes.',
 'short_term', 'medium',
 'Reduce transportation-related delays by 40%',
 'low',
 '[{"step": 1, "action": "Analyze current delivery routes and delays", "duration": "1 week"}, {"step": 2, "action": "Negotiate with logistics partners", "duration": "2 weeks"}, {"step": 3, "action": "Implement GPS tracking", "duration": "1 week"}, {"step": 4, "action": "Monitor and adjust routes", "duration": "ongoing"}]'::jsonb,
 'Logistics Manager',
 '1 month',
 'Transportation delays reduced by 1.5 days average'),

-- Recommendations for Alert 3
(3, 3, 'Strategic Sourcing Blitz for Top Categories',
 'Launch intensive sourcing initiative for top 10 spend categories. Conduct competitive bidding events and leverage volume consolidation for better pricing.',
 'immediate_action', 'critical',
 'Generate additional IDR 400M savings in 45 days',
 'high',
 '[{"step": 1, "action": "Identify and prioritize top spend categories", "duration": "3 days"}, {"step": 2, "action": "Prepare RFQ packages for competitive bidding", "duration": "1 week"}, {"step": 3, "action": "Conduct e-auctions for major categories", "duration": "2 weeks"}, {"step": 4, "action": "Negotiate and award contracts", "duration": "3 weeks"}]'::jsonb,
 'Strategic Sourcing Manager',
 '6 weeks',
 'Achieve IDR 4.65B cumulative savings, 93% of target'),

(3, 3, 'Contract Renegotiation with Major Suppliers',
 'Renegotiate terms with top 15 suppliers representing 60% of spend. Leverage market conditions and competitor quotes for better pricing.',
 'short_term', 'high',
 'Secure additional IDR 200M in savings through improved contract terms',
 'medium',
 '[{"step": 1, "action": "Prepare negotiation strategy and targets", "duration": "1 week"}, {"step": 2, "action": "Schedule renegotiation meetings", "duration": "1 week"}, {"step": 3, "action": "Conduct negotiations", "duration": "3 weeks"}, {"step": 4, "action": "Finalize and sign amendments", "duration": "1 week"}]'::jsonb,
 'Supply Chain Director',
 '6 weeks',
 'Contracts renegotiated with 5-12% price reductions'),

-- Recommendations for Alert 4
(4, 4, 'Quality Audit and Corrective Actions',
 'Conduct comprehensive quality audits of the 3 problematic suppliers. Implement corrective action plans with measurable milestones and regular progress reviews.',
 'immediate_action', 'high',
 'Reduce quality issues by 60% and improve rating to 4.4',
 'medium',
 '[{"step": 1, "action": "Schedule on-site quality audits", "duration": "2 weeks"}, {"step": 2, "action": "Issue corrective action requests", "duration": "1 week"}, {"step": 3, "action": "Implement quality hold on shipments", "duration": "immediate"}, {"step": 4, "action": "Weekly progress reviews", "duration": "8 weeks"}]'::jsonb,
 'Quality Assurance Manager',
 '2 months',
 'Quality rating improves to 4.4, defect rate drops below 5%'),

(4, 4, 'Supplier Quality Agreement Updates',
 'Revise supplier quality agreements to include stricter quality specifications, inspection protocols, and penalty clauses for non-conformance.',
 'short_term', 'medium',
 'Establish clear quality expectations and accountability',
 'low',
 '[{"step": 1, "action": "Draft revised quality agreement template", "duration": "1 week"}, {"step": 2, "action": "Legal review", "duration": "1 week"}, {"step": 3, "action": "Negotiate with suppliers", "duration": "2 weeks"}, {"step": 4, "action": "Execute updated agreements", "duration": "1 week"}]'::jsonb,
 'Procurement Manager',
 '5 weeks',
 'All suppliers operating under enhanced quality agreements'),

-- Recommendations for Alert 5
(5, 5, 'Inventory Rationalization Project',
 'Conduct SKU-level analysis to identify slow-moving and obsolete inventory. Implement clearance strategies and tighten reorder policies for low-turnover items.',
 'immediate_action', 'high',
 'Reduce inventory value by IDR 1.5B and improve turnover to 7.2x',
 'medium',
 '[{"step": 1, "action": "Complete inventory analysis", "duration": "2 weeks"}, {"step": 2, "action": "Categorize items (A/B/C analysis)", "duration": "1 week"}, {"step": 3, "action": "Execute clearance sales for slow movers", "duration": "4 weeks"}, {"step": 4, "action": "Adjust reorder points and safety stock", "duration": "2 weeks"}]'::jsonb,
 'Inventory Manager',
 '9 weeks',
 'Inventory turnover improves to 7.2x, storage costs reduced 30%'),

(5, 5, 'Demand Forecasting Enhancement',
 'Implement advanced forecasting tools using historical consumption data and predictive analytics. Integrate with production planning for better demand visibility.',
 'short_term', 'medium',
 'Improve forecast accuracy by 25%, enabling optimal inventory levels',
 'high',
 '[{"step": 1, "action": "Select and procure forecasting software", "duration": "2 weeks"}, {"step": 2, "action": "Configure system with historical data", "duration": "2 weeks"}, {"step": 3, "action": "Train demand planning team", "duration": "1 week"}, {"step": 4, "action": "Pilot with key material categories", "duration": "4 weeks"}]'::jsonb,
 'Supply Planning Manager',
 '9 weeks',
 'Forecast accuracy improves from 68% to 85%');

-- Insert Alert History for tracking
INSERT INTO kpi_alert_history (alert_id, kpi_id, action_type, action_by, action_notes, previous_status, new_status, kpi_value_at_action)
VALUES
(1, 1, 'created', 'ai_system', 'Alert automatically generated due to threshold breach', NULL, 'active', 3.8),
(2, 2, 'created', 'ai_system', 'Alert generated for on-time delivery performance below target', NULL, 'active', 91.5),
(3, 3, 'created', 'ai_system', 'Cost savings tracking alert - significant gap to target', NULL, 'active', 4250),
(4, 4, 'created', 'ai_system', 'Quality performance alert - multiple supplier issues identified', NULL, 'active', 4.2),
(5, 5, 'created', 'ai_system', 'Inventory optimization alert - turnover below target', NULL, 'active', 6.5);
