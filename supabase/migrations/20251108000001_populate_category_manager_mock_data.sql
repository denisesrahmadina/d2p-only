/*
  # Populate Category Manager Mock Data

  1. Mock Data
    - Dataset A: Generation Equipment Category Portfolio
    - Dataset B: Electrical & IT Infrastructure Category Portfolio

  2. Pre-populated Tables
    - dim_category: Category hierarchy with centralized/decentralized classification
    - dim_material: Material master linked to categories
    - fact_spend_summary: Aggregated spend by category, BU, and fiscal period
    - fact_supplier_performance: Supplier KPIs and ratings
    - fact_supplier_feedback: Voice of Supplier data
    - fact_mi_reference: Market Intelligence reference data
    - fact_kraljic_matrix: Kraljic positioning with auto-calculation
    - fact_category_strategy: Strategic levers and action plans
    - fact_category_action_plan: Detailed playbook initiatives
    - fact_category_ai_insight: AI-generated recommendations

  3. Important Notes
    - Two complete datasets for demonstration
    - Realistic spend figures and performance metrics
    - AI insights with confidence scoring
    - Full integration with Spend Analysis structure
*/

-- ============================================
-- DATASET A: GENERATION EQUIPMENT PORTFOLIO
-- ============================================

-- Categories for Dataset A
INSERT INTO dim_category (category_code, category_name, parent_category_code, level, classification, classification_rationale, total_annual_spend, business_units_count, vendor_count, strategic_importance, dataset_id, organization_id) VALUES
('GEN-000', 'Generation Equipment', NULL, 1, 'Centralized', 'High value, critical to all power generation units, requires national vendor coordination', 285000000000, 12, 45, 'High', 'DATASET_A', 'ORG001'),
('GEN-100', 'Power Equipment', 'GEN-000', 2, 'Centralized', 'Multi-unit dependency, high strategic value, limited qualified vendors nationally', 180000000000, 12, 18, 'High', 'DATASET_A', 'ORG001'),
('GEN-110', 'Turbines & Generators', 'GEN-100', 3, 'Centralized', 'Critical equipment requiring OEM support, long lead times, high technical complexity', 120000000000, 12, 6, 'High', 'DATASET_A', 'ORG001'),
('GEN-120', 'Boilers & Heat Recovery', 'GEN-100', 3, 'Centralized', 'Large value contracts, specialized engineering requirements, limited suppliers', 60000000000, 10, 8, 'High', 'DATASET_A', 'ORG001'),
('GEN-200', 'Control Systems', 'GEN-000', 2, 'Centralized', 'Technology standardization required across fleet, cybersecurity considerations', 45000000000, 12, 12, 'High', 'DATASET_A', 'ORG001'),
('GEN-210', 'DCS & SCADA', 'GEN-200', 3, 'Centralized', 'Platform standardization critical for operational efficiency and training', 30000000000, 12, 5, 'High', 'DATASET_A', 'ORG001'),
('GEN-220', 'Instrumentation', 'GEN-200', 3, 'Decentralized', 'Lower unit value, local availability sufficient, unit-specific requirements', 15000000000, 12, 15, 'Medium', 'DATASET_A', 'ORG001'),
('GEN-300', 'Auxiliaries', 'GEN-000', 2, 'Decentralized', 'High spend fragmentation, local vendor availability, lower technical complexity', 60000000000, 12, 35, 'Medium', 'DATASET_A', 'ORG001'),
('GEN-310', 'Pumps & Motors', 'GEN-300', 3, 'Decentralized', 'Standardizable but local sourcing more efficient, moderate value', 35000000000, 12, 20, 'Medium', 'DATASET_A', 'ORG001'),
('GEN-320', 'Valves & Actuators', 'GEN-300', 3, 'Decentralized', 'High SKU variety, local vendor support preferred', 25000000000, 12, 18, 'Low', 'DATASET_A', 'ORG001');

-- Materials for Dataset A
INSERT INTO dim_material (material_code, material_name, category_code, unit_of_measure, standard_price, lead_time_days, criticality, substitution_available, dataset_id, organization_id) VALUES
('MAT-GEN-001', 'Steam Turbine 500MW', 'GEN-110', 'UNIT', 45000000000, 720, 'Critical', false, 'DATASET_A', 'ORG001'),
('MAT-GEN-002', 'Gas Turbine 150MW', 'GEN-110', 'UNIT', 28000000000, 540, 'Critical', false, 'DATASET_A', 'ORG001'),
('MAT-GEN-003', 'Generator 500MVA', 'GEN-110', 'UNIT', 18000000000, 480, 'Critical', false, 'DATASET_A', 'ORG001'),
('MAT-GEN-004', 'HRSG Module Triple Pressure', 'GEN-120', 'SET', 25000000000, 540, 'Critical', false, 'DATASET_A', 'ORG001'),
('MAT-GEN-005', 'Coal Boiler 600MW', 'GEN-120', 'UNIT', 35000000000, 720, 'Critical', false, 'DATASET_A', 'ORG001'),
('MAT-GEN-006', 'DCS System Complete', 'GEN-210', 'SET', 8000000000, 360, 'Critical', false, 'DATASET_A', 'ORG001'),
('MAT-GEN-007', 'SCADA System', 'GEN-210', 'SET', 4000000000, 270, 'Important', false, 'DATASET_A', 'ORG001'),
('MAT-GEN-008', 'Pressure Transmitter', 'GEN-220', 'PCS', 15000000, 60, 'Important', true, 'DATASET_A', 'ORG001'),
('MAT-GEN-009', 'Temperature Sensor RTD', 'GEN-220', 'PCS', 8000000, 45, 'Standard', true, 'DATASET_A', 'ORG001'),
('MAT-GEN-010', 'Boiler Feed Pump', 'GEN-310', 'UNIT', 2500000000, 180, 'Important', true, 'DATASET_A', 'ORG001');

-- Spend Summary for Dataset A
INSERT INTO fact_spend_summary (category_code, business_unit, fiscal_year, fiscal_quarter, total_spend, contract_coverage_pct, maverick_spend_pct, vendor_count, po_count, avg_po_value, dataset_id, organization_id) VALUES
('GEN-110', 'Java 1', 2024, 4, 12000000000, 95, 2, 3, 4, 3000000000, 'DATASET_A', 'ORG001'),
('GEN-110', 'Java 2', 2024, 4, 15000000000, 92, 3, 3, 5, 3000000000, 'DATASET_A', 'ORG001'),
('GEN-110', 'Sumatra 1', 2024, 4, 18000000000, 98, 1, 2, 6, 3000000000, 'DATASET_A', 'ORG001'),
('GEN-120', 'Java 1', 2024, 4, 6000000000, 88, 5, 4, 8, 750000000, 'DATASET_A', 'ORG001'),
('GEN-120', 'Sumatra 2', 2024, 4, 8000000000, 90, 4, 3, 10, 800000000, 'DATASET_A', 'ORG001'),
('GEN-210', 'Java 1', 2024, 4, 3500000000, 85, 8, 5, 15, 233333333, 'DATASET_A', 'ORG001'),
('GEN-210', 'Java 2', 2024, 4, 4200000000, 87, 6, 4, 18, 233333333, 'DATASET_A', 'ORG001'),
('GEN-210', 'Kalimantan 1', 2024, 4, 2800000000, 82, 10, 5, 12, 233333333, 'DATASET_A', 'ORG001'),
('GEN-220', 'Java 1', 2024, 4, 1200000000, 65, 15, 12, 80, 15000000, 'DATASET_A', 'ORG001'),
('GEN-220', 'Sumatra 1', 2024, 4, 1500000000, 62, 18, 15, 95, 15789473, 'DATASET_A', 'ORG001'),
('GEN-310', 'Java 1', 2024, 4, 2800000000, 58, 22, 18, 120, 23333333, 'DATASET_A', 'ORG001'),
('GEN-310', 'Java 2', 2024, 4, 3200000000, 55, 25, 20, 135, 23703703, 'DATASET_A', 'ORG001'),
('GEN-320', 'Kalimantan 1', 2024, 4, 2000000000, 45, 28, 15, 100, 20000000, 'DATASET_A', 'ORG001');

-- Supplier Performance for Dataset A
INSERT INTO fact_supplier_performance (vendor_id, vendor_name, category_code, evaluation_period, delivery_score, quality_score, cost_score, collaboration_score, overall_score, total_po_value, on_time_delivery_pct, defect_rate_ppm, dataset_id, organization_id) VALUES
('VEND-A-001', 'Siemens Energy Indonesia', 'GEN-110', '2024-Q4', 92, 95, 88, 90, 91, 45000000000, 94, 120, 'DATASET_A', 'ORG001'),
('VEND-A-002', 'GE Power Indonesia', 'GEN-110', '2024-Q4', 88, 92, 85, 87, 88, 38000000000, 91, 180, 'DATASET_A', 'ORG001'),
('VEND-A-003', 'Mitsubishi Heavy Industries', 'GEN-110', '2024-Q4', 94, 96, 90, 93, 93, 37000000000, 96, 85, 'DATASET_A', 'ORG001'),
('VEND-A-004', 'Doosan Heavy Industries', 'GEN-120', '2024-Q4', 85, 88, 82, 80, 84, 20000000000, 88, 250, 'DATASET_A', 'ORG001'),
('VEND-A-005', 'Bharat Heavy Electricals', 'GEN-120', '2024-Q4', 82, 85, 90, 78, 84, 18000000000, 85, 320, 'DATASET_A', 'ORG001'),
('VEND-A-006', 'ABB Indonesia', 'GEN-210', '2024-Q4', 90, 93, 87, 91, 90, 12000000000, 93, 150, 'DATASET_A', 'ORG001'),
('VEND-A-007', 'Schneider Electric', 'GEN-210', '2024-Q4', 87, 90, 85, 88, 88, 10500000000, 90, 180, 'DATASET_A', 'ORG001'),
('VEND-A-008', 'Yokogawa Indonesia', 'GEN-220', '2024-Q4', 88, 92, 83, 86, 87, 4500000000, 91, 200, 'DATASET_A', 'ORG001'),
('VEND-A-009', 'PT Rekayasa Industri', 'GEN-310', '2024-Q4', 78, 82, 88, 75, 81, 8000000000, 82, 450, 'DATASET_A', 'ORG001'),
('VEND-A-010', 'PT Barata Indonesia', 'GEN-310', '2024-Q4', 75, 80, 92, 72, 80, 7500000000, 80, 520, 'DATASET_A', 'ORG001');

-- Supplier Feedback for Dataset A
INSERT INTO fact_supplier_feedback (vendor_id, vendor_name, category_code, feedback_date, feedback_type, sentiment, feedback_text, action_required, action_taken, dataset_id, organization_id) VALUES
('VEND-A-001', 'Siemens Energy Indonesia', 'GEN-110', '2024-10-15', 'Forecasting', 'Neutral', 'Request for improved demand forecasting accuracy to optimize inventory levels. Current 3-month visibility insufficient for long-lead components.', true, 'Implement collaborative planning portal with 6-month rolling forecast', 'DATASET_A', 'ORG001'),
('VEND-A-002', 'GE Power Indonesia', 'GEN-110', '2024-10-22', 'Collaboration', 'Positive', 'Appreciate joint engineering sessions for new turbine designs. Suggests expanding co-innovation framework to include digital twin development.', false, NULL, 'DATASET_A', 'ORG001'),
('VEND-A-004', 'Doosan Heavy Industries', 'GEN-120', '2024-09-18', 'Payment', 'Negative', 'Payment delays averaging 45 days beyond agreed terms impacting cash flow. Request adherence to 30-day payment cycle per contract.', true, 'Expedite approval process and implement automated payment triggers', 'DATASET_A', 'ORG001'),
('VEND-A-006', 'ABB Indonesia', 'GEN-210', '2024-10-05', 'Quality', 'Positive', 'Commend comprehensive quality documentation requirements. Clear specs reduce rework and improve first-time-right delivery.', false, NULL, 'DATASET_A', 'ORG001'),
('VEND-A-008', 'Yokogawa Indonesia', 'GEN-220', '2024-10-12', 'Process', 'Neutral', 'PO amendment process cumbersome with multiple approval layers. Suggest streamlined process for minor spec changes below threshold.', true, 'Implement threshold-based approval delegation', 'DATASET_A', 'ORG001'),
('VEND-A-009', 'PT Rekayasa Industri', 'GEN-310', '2024-09-25', 'Forecasting', 'Negative', 'Volatile order patterns make capacity planning difficult. Request commitment to minimum quarterly volumes for better resource allocation.', true, 'Establish blanket PO framework with quarterly release commitments', 'DATASET_A', 'ORG001');

-- Market Intelligence for Dataset A
INSERT INTO fact_mi_reference (category_code, reference_period, supply_demand_balance, price_trend, price_volatility_index, capacity_utilization_pct, innovation_index, market_concentration, supply_risk_score, forecasted_growth_pct, key_insights, dataset_id, organization_id) VALUES
('GEN-110', '2024-Q4', 'Balanced', 'Stable', 3.5, 78, 8, 'High', 4.5, 6, 'OEM consolidation continues. Digital twin and AI integration driving innovation. Long lead times persist due to global component shortages.', 'DATASET_A', 'ORG001'),
('GEN-120', '2024-Q4', 'Tight', 'Rising', 6.2, 85, 6, 'Medium', 6.8, 8, 'Strong demand from renewable integration projects. Steel and alloy prices up 12% YoY. Supplier capacity constraints in specialized fabrication.', 'DATASET_A', 'ORG001'),
('GEN-210', '2024-Q4', 'Balanced', 'Stable', 2.8, 72, 9, 'High', 3.2, 12, 'Rapid evolution toward IIoT and edge computing. Cybersecurity requirements increasing costs. Platform lock-in risk with major vendors.', 'DATASET_A', 'ORG001'),
('GEN-220', '2024-Q4', 'Surplus', 'Declining', 4.5, 65, 7, 'Low', 2.5, 4, 'Mature technology with high competition. Wireless and smart sensor adoption accelerating. Price pressure from Asian manufacturers.', 'DATASET_A', 'ORG001'),
('GEN-310', '2024-Q4', 'Balanced', 'Stable', 3.2, 70, 5, 'Low', 3.8, 5, 'Standardization opportunities exist. Energy-efficient models gaining traction. Local manufacturing capability adequate.', 'DATASET_A', 'ORG001'),
('GEN-320', '2024-Q4', 'Surplus', 'Stable', 2.5, 62, 4, 'Low', 2.2, 3, 'Highly commoditized with numerous suppliers. Smart actuation technology emerging. Strong local supplier base available.', 'DATASET_A', 'ORG001');

-- Kraljic Matrix for Dataset A
INSERT INTO fact_kraljic_matrix (category_code, profit_impact_score, supply_risk_score, kraljic_quadrant, calculation_method, manual_override, override_rationale, approved_by, approved_at, dataset_id, organization_id) VALUES
('GEN-110', 92, 78, 'Strategic', 'Auto', false, NULL, NULL, NULL, 'DATASET_A', 'ORG001'),
('GEN-120', 85, 68, 'Strategic', 'Auto', false, NULL, NULL, NULL, 'DATASET_A', 'ORG001'),
('GEN-210', 78, 72, 'Strategic', 'Auto', false, NULL, NULL, NULL, 'DATASET_A', 'ORG001'),
('GEN-220', 42, 35, 'Routine', 'Auto', false, NULL, NULL, NULL, 'DATASET_A', 'ORG001'),
('GEN-310', 55, 42, 'Leverage', 'Auto', false, NULL, NULL, NULL, 'DATASET_A', 'ORG001'),
('GEN-320', 38, 28, 'Routine', 'Auto', false, NULL, NULL, NULL, 'DATASET_A', 'ORG001');

-- Category Strategy for Dataset A
INSERT INTO fact_category_strategy (category_code, kraljic_quadrant, strategic_lever, lever_description, impact_score, implementation_complexity, forecasted_savings_pct, forecasted_savings_amount, implementation_timeline, status, approved_by, approved_at, dataset_id, organization_id) VALUES
('GEN-110', 'Strategic', 'Multi-Year Contracting', 'Establish 5-year framework agreements with key OEMs for turbine and generator supply with volume commitments and index-based pricing', 8.5, 'Medium', 4.5, 5400000000, '18 months', 'Approved', 'Budi Santoso', '2024-10-20', 'DATASET_A', 'ORG001'),
('GEN-110', 'Strategic', 'Co-Innovation Partnership', 'Joint R&D initiatives with Siemens and Mitsubishi for next-gen high-efficiency turbine technology and digital twin integration', 9.0, 'High', 8.0, 9600000000, '36 months', 'In Progress', 'Budi Santoso', '2024-09-15', 'DATASET_A', 'ORG001'),
('GEN-120', 'Strategic', 'TCO Optimization', 'Comprehensive should-cost analysis for HRSG and boiler systems focusing on material costs, fabrication efficiency, and logistics', 7.5, 'Medium', 6.5, 3900000000, '12 months', 'Approved', 'Budi Santoso', '2024-10-25', 'DATASET_A', 'ORG001'),
('GEN-210', 'Strategic', 'Platform Standardization', 'Consolidate to 2 primary DCS platforms (ABB, Schneider) across fleet with migration roadmap for legacy systems', 8.0, 'High', 12.0, 5400000000, '24 months', 'Under Review', NULL, NULL, 'DATASET_A', 'ORG001'),
('GEN-220', 'Routine', 'Catalog Management', 'Implement e-catalog with pre-negotiated prices for standard instrumentation items, automated PO generation', 6.0, 'Low', 8.0, 1200000000, '6 months', 'Proposed', NULL, NULL, 'DATASET_A', 'ORG001'),
('GEN-310', 'Leverage', 'Vendor Rationalization', 'Reduce supplier base from 20 to 8 preferred vendors with volume consolidation and performance-based selection', 7.5, 'Medium', 10.0, 3500000000, '12 months', 'Approved', 'Budi Santoso', '2024-10-18', 'DATASET_A', 'ORG001');

-- Category Action Plans for Dataset A
INSERT INTO fact_category_action_plan (category_code, action_type, action_title, action_description, source_analysis, priority, owner, target_completion_date, status, expected_impact_amount, actual_impact_amount, kpi_linkage, dataset_id, organization_id) VALUES
('GEN-110', 'Innovation', 'Digital Twin Integration', 'Collaborate with Siemens to implement digital twin technology for predictive maintenance and performance optimization across turbine fleet', 'External', 'High', 'Engineering Dept', '2025-12-31', 'In Progress', 4500000000, NULL, 'Maintenance Cost Reduction', 'DATASET_A', 'ORG001'),
('GEN-110', 'Supplier Development', 'OEM Service Training', 'Establish comprehensive training program with GE and Mitsubishi for local service teams to reduce reliance on expat engineers', 'VoC', 'Medium', 'Operations Dept', '2025-06-30', 'Planned', 1800000000, NULL, 'Service Cost Optimization', 'DATASET_A', 'ORG001'),
('GEN-120', 'Cost Optimization', 'Material Specification Review', 'Review boiler tube specifications with metallurgy experts to identify opportunities for equivalent lower-cost alloys', 'Internal', 'High', 'Technical Dept', '2025-03-31', 'In Progress', 2400000000, NULL, 'Material Cost Reduction', 'DATASET_A', 'ORG001'),
('GEN-210', 'Process Improvement', 'Collaborative Forecasting Portal', 'Implement supplier portal for ABB and Schneider with rolling 6-month demand visibility to improve supply chain planning', 'VoS', 'Critical', 'Procurement Dept', '2025-02-28', 'In Progress', 600000000, NULL, 'Inventory Optimization', 'DATASET_A', 'ORG001'),
('GEN-210', 'Risk Mitigation', 'Cybersecurity Assessment', 'Conduct comprehensive cybersecurity audit of DCS platforms and implement recommended hardening measures', 'AI Generated', 'Critical', 'IT Security', '2025-04-30', 'Planned', NULL, NULL, 'Operational Risk Reduction', 'DATASET_A', 'ORG001'),
('GEN-220', 'Rationalization', 'SKU Consolidation', 'Reduce instrumentation SKU count by 30% through standardization and elimination of redundant specifications', 'Internal', 'Medium', 'Engineering Dept', '2025-06-30', 'Planned', 800000000, NULL, 'Inventory Carrying Cost', 'DATASET_A', 'ORG001'),
('GEN-310', 'Supplier Development', 'Local Vendor Capability Building', 'Partner with PT Rekayasa and PT Barata to enhance quality management systems and reduce defect rates', 'VoC', 'High', 'Quality Dept', '2025-09-30', 'Planned', 1200000000, NULL, 'Quality Cost Reduction', 'DATASET_A', 'ORG001');

-- AI Insights for Dataset A
INSERT INTO fact_category_ai_insight (category_code, insight_type, insight_title, insight_description, confidence_score, financial_impact_estimate, risk_level, ai_source_type, key_variables, user_action, user_comment, dataset_id, organization_id) VALUES
('GEN-110', 'Predictive', 'Turbine Price Increase Alert', 'Predictive model indicates 8-12% price increase for gas turbines in Q2 2025 due to steel and rare earth material cost escalation. Recommend accelerating procurement for upcoming projects.', 87, 3600000000, 'Moderate', 'Predictive Model', '{"steel_price_trend": "+15%", "rare_earth_availability": "tight", "oem_backlog": "18_months"}', 'Accepted', 'Confirmed with procurement team - expediting 2 turbine orders', 'DATASET_A', 'ORG001'),
('GEN-110', 'Prescriptive', 'OEM Partnership Optimization', 'Analysis suggests optimal supplier portfolio: 50% Siemens, 30% Mitsubishi, 20% GE based on performance, innovation capability, and total cost. Current split: 38%, 31%, 31%.', 82, 2400000000, 'Low', 'Prescriptive Analytics', '{"performance_weight": 0.4, "innovation_weight": 0.3, "cost_weight": 0.3}', 'Accepted', 'Aligning with strategic sourcing plan', 'DATASET_A', 'ORG001'),
('GEN-120', 'Diagnostic', 'Boiler Supplier Concentration Risk', 'Current reliance on Doosan (55% share) creates supply chain vulnerability. Insolvency risk score increased from 2.5 to 6.8 based on financial metrics. Recommend supply base diversification.', 91, NULL, 'Critical', 'Pattern Recognition', '{"debt_to_equity": 3.2, "current_ratio": 0.85, "market_share_loss": "12%"}', 'Accepted', 'Initiating vendor prequalification for alternative suppliers', 'DATASET_A', 'ORG001'),
('GEN-210', 'Prescriptive', 'Platform Consolidation Savings', 'Standardizing on 2 DCS platforms (current: 5 platforms) projected to save 12% through license optimization, reduced training costs, and improved maintenance efficiency. ROI: 24 months.', 89, 5400000000, 'Low', 'Simulation', '{"license_savings": "2.1B", "training_savings": "1.8B", "maintenance_savings": "1.5B"}', 'Under Review', NULL, 'DATASET_A', 'ORG001'),
('GEN-220', 'Explanatory', 'Maverick Spend Root Cause', 'Analysis reveals 78% of maverick spend in instrumentation driven by: emergency breakdowns (45%), specification changes (28%), and expedited delivery requirements (27%). Recommend inventory optimization and preventive maintenance enhancement.', 85, 900000000, 'Moderate', 'Pattern Recognition', '{"emergency_orders": 0.45, "spec_changes": 0.28, "expedited": 0.27}', 'Accepted', 'Implementing predictive maintenance program', 'DATASET_A', 'ORG001'),
('GEN-310', 'Prescriptive', 'Bundled Sourcing Opportunity', 'Combining pumps, motors, and valves (GEN-310, GEN-320) in single sourcing event can achieve 6-8% volume leverage savings. Total addressable: Rp 60B. Recommend Q1 2025 consolidated tender.', 84, 4200000000, 'Low', 'Prescriptive Analytics', '{"volume_leverage": "6.2%", "admin_efficiency": "1.8%", "total_savings": "8.0%"}', 'Pending', NULL, 'DATASET_A', 'ORG001');

-- ============================================
-- DATASET B: ELECTRICAL & IT INFRASTRUCTURE
-- ============================================

-- Categories for Dataset B
INSERT INTO dim_category (category_code, category_name, parent_category_code, level, classification, classification_rationale, total_annual_spend, business_units_count, vendor_count, strategic_importance, dataset_id, organization_id) VALUES
('ELEC-000', 'Electrical & IT Infrastructure', NULL, 1, 'Centralized', 'Technology standardization critical, cybersecurity requirements, enterprise-wide systems', 142000000000, 12, 38, 'High', 'DATASET_B', 'ORG001'),
('ELEC-100', 'Power Distribution', 'ELEC-000', 2, 'Centralized', 'Safety critical, regulatory compliance, national grid integration requirements', 68000000000, 12, 15, 'High', 'DATASET_B', 'ORG001'),
('ELEC-110', 'Transformers & Switchgear', 'ELEC-100', 3, 'Centralized', 'High voltage systems requiring certified suppliers, long lead times, safety critical', 45000000000, 12, 8, 'High', 'DATASET_B', 'ORG001'),
('ELEC-120', 'Protection & Metering', 'ELEC-100', 3, 'Centralized', 'Grid stability requirements, real-time monitoring criticality, cybersecurity considerations', 23000000000, 12, 10, 'High', 'DATASET_B', 'ORG001'),
('ELEC-200', 'IT Infrastructure', 'ELEC-000', 2, 'Centralized', 'Enterprise architecture standardization, data security, cloud strategy alignment', 48000000000, 12, 18, 'High', 'DATASET_B', 'ORG001'),
('ELEC-210', 'Enterprise Systems', 'ELEC-200', 3, 'Centralized', 'ERP and business systems requiring enterprise licenses and unified data architecture', 30000000000, 12, 6, 'High', 'DATASET_B', 'ORG001'),
('ELEC-220', 'Network & Security', 'ELEC-200', 3, 'Centralized', 'Cybersecurity strategy, OT/IT convergence, unified threat management', 18000000000, 12, 8, 'High', 'DATASET_B', 'ORG001'),
('ELEC-300', 'Electrical Components', 'ELEC-000', 2, 'Decentralized', 'High SKU variety, local availability, lower unit values, standardization possible', 26000000000, 12, 25, 'Medium', 'DATASET_B', 'ORG001'),
('ELEC-310', 'Cables & Wiring', 'ELEC-300', 3, 'Decentralized', 'Project-specific requirements, local sourcing efficient, mature market', 16000000000, 12, 18, 'Medium', 'DATASET_B', 'ORG001'),
('ELEC-320', 'Lighting & Small Power', 'ELEC-300', 3, 'Decentralized', 'Facility-specific, energy efficiency initiatives, local maintenance support', 10000000000, 12, 15, 'Low', 'DATASET_B', 'ORG001');

-- Materials for Dataset B
INSERT INTO dim_material (material_code, material_name, category_code, unit_of_measure, standard_price, lead_time_days, criticality, substitution_available, dataset_id, organization_id) VALUES
('MAT-ELEC-001', 'Power Transformer 400kV 300MVA', 'ELEC-110', 'UNIT', 18000000000, 540, 'Critical', false, 'DATASET_B', 'ORG001'),
('MAT-ELEC-002', 'Gas Insulated Switchgear 400kV', 'ELEC-110', 'BAY', 8000000000, 420, 'Critical', false, 'DATASET_B', 'ORG001'),
('MAT-ELEC-003', 'Circuit Breaker 150kV', 'ELEC-110', 'UNIT', 2500000000, 270, 'Critical', true, 'DATASET_B', 'ORG001'),
('MAT-ELEC-004', 'Numerical Relay Protection System', 'ELEC-120', 'SET', 450000000, 180, 'Critical', false, 'DATASET_B', 'ORG001'),
('MAT-ELEC-005', 'Smart Meter AMI System', 'ELEC-120', 'SET', 3500000000, 240, 'Important', false, 'DATASET_B', 'ORG001'),
('MAT-ELEC-006', 'SAP S/4HANA Enterprise License', 'ELEC-210', 'LICENSE', 12000000000, 180, 'Critical', false, 'DATASET_B', 'ORG001'),
('MAT-ELEC-007', 'Oracle Database Enterprise', 'ELEC-210', 'LICENSE', 4500000000, 90, 'Important', false, 'DATASET_B', 'ORG001'),
('MAT-ELEC-008', 'Firewall Next-Gen Enterprise', 'ELEC-220', 'UNIT', 850000000, 120, 'Critical', true, 'DATASET_B', 'ORG001'),
('MAT-ELEC-009', 'Network Switch Core 400G', 'ELEC-220', 'UNIT', 1200000000, 150, 'Important', true, 'DATASET_B', 'ORG001'),
('MAT-ELEC-010', 'Power Cable XLPE 150kV', 'ELEC-310', 'KM', 2800000000, 120, 'Important', true, 'DATASET_B', 'ORG001');

-- Spend Summary for Dataset B
INSERT INTO fact_spend_summary (category_code, business_unit, fiscal_year, fiscal_quarter, total_spend, contract_coverage_pct, maverick_spend_pct, vendor_count, po_count, avg_po_value, dataset_id, organization_id) VALUES
('ELEC-110', 'Java 1', 2024, 4, 4500000000, 92, 3, 4, 6, 750000000, 'DATASET_B', 'ORG001'),
('ELEC-110', 'Sumatra 1', 2024, 4, 5200000000, 95, 2, 3, 7, 742857142, 'DATASET_B', 'ORG001'),
('ELEC-110', 'Kalimantan 1', 2024, 4, 3800000000, 88, 5, 5, 5, 760000000, 'DATASET_B', 'ORG001'),
('ELEC-120', 'Java 1', 2024, 4, 2200000000, 85, 8, 6, 12, 183333333, 'DATASET_B', 'ORG001'),
('ELEC-120', 'Java 2', 2024, 4, 2600000000, 82, 10, 7, 14, 185714285, 'DATASET_B', 'ORG001'),
('ELEC-210', 'Corporate HQ', 2024, 4, 7500000000, 98, 1, 4, 8, 937500000, 'DATASET_B', 'ORG001'),
('ELEC-210', 'All Units', 2024, 4, 6800000000, 97, 1, 3, 12, 566666666, 'DATASET_B', 'ORG001'),
('ELEC-220', 'Corporate HQ', 2024, 4, 4200000000, 88, 6, 6, 18, 233333333, 'DATASET_B', 'ORG001'),
('ELEC-220', 'All Units', 2024, 4, 3900000000, 85, 8, 7, 22, 177272727, 'DATASET_B', 'ORG001'),
('ELEC-310', 'Java 1', 2024, 4, 1600000000, 62, 18, 15, 85, 18823529, 'DATASET_B', 'ORG001'),
('ELEC-310', 'Sumatra 2', 2024, 4, 1900000000, 58, 22, 18, 95, 20000000, 'DATASET_B', 'ORG001'),
('ELEC-320', 'Java 2', 2024, 4, 1000000000, 45, 28, 12, 120, 8333333, 'DATASET_B', 'ORG001');

-- Supplier Performance for Dataset B
INSERT INTO fact_supplier_performance (vendor_id, vendor_name, category_code, evaluation_period, delivery_score, quality_score, cost_score, collaboration_score, overall_score, total_po_value, on_time_delivery_pct, defect_rate_ppm, dataset_id, organization_id) VALUES
('VEND-B-001', 'ABB Power Grids Indonesia', 'ELEC-110', '2024-Q4', 93, 96, 87, 91, 92, 18000000000, 95, 95, 'DATASET_B', 'ORG001'),
('VEND-B-002', 'Siemens Energy (Grid)', 'ELEC-110', '2024-Q4', 91, 94, 85, 89, 90, 15000000000, 93, 120, 'DATASET_B', 'ORG001'),
('VEND-B-003', 'Schneider Electric', 'ELEC-120', '2024-Q4', 89, 92, 90, 88, 90, 8500000000, 92, 145, 'DATASET_B', 'ORG001'),
('VEND-B-004', 'GE Grid Solutions', 'ELEC-120', '2024-Q4', 87, 90, 86, 85, 87, 7200000000, 90, 180, 'DATASET_B', 'ORG001'),
('VEND-B-005', 'SAP Indonesia', 'ELEC-210', '2024-Q4', 92, 95, 78, 93, 90, 10500000000, 94, 50, 'DATASET_B', 'ORG001'),
('VEND-B-006', 'Oracle Indonesia', 'ELEC-210', '2024-Q4', 88, 92, 82, 87, 87, 8200000000, 91, 75, 'DATASET_B', 'ORG001'),
('VEND-B-007', 'Cisco Systems Indonesia', 'ELEC-220', '2024-Q4', 90, 94, 84, 89, 89, 5800000000, 93, 110, 'DATASET_B', 'ORG001'),
('VEND-B-008', 'Palo Alto Networks', 'ELEC-220', '2024-Q4', 91, 95, 80, 90, 89, 4600000000, 94, 85, 'DATASET_B', 'ORG001'),
('VEND-B-009', 'PT Voksel Electric', 'ELEC-310', '2024-Q4', 82, 85, 92, 78, 84, 6500000000, 85, 320, 'DATASET_B', 'ORG001'),
('VEND-B-010', 'PT Supreme Cable', 'ELEC-310', '2024-Q4', 80, 83, 94, 75, 83, 5800000000, 83, 380, 'DATASET_B', 'ORG001');

-- Supplier Feedback for Dataset B
INSERT INTO fact_supplier_feedback (vendor_id, vendor_name, category_code, feedback_date, feedback_type, sentiment, feedback_text, action_required, action_taken, dataset_id, organization_id) VALUES
('VEND-B-001', 'ABB Power Grids Indonesia', 'ELEC-110', '2024-10-08', 'Collaboration', 'Positive', 'Excellent collaboration on transformer specification review. Joint value engineering reduced material costs by 8% while maintaining performance standards.', false, NULL, 'DATASET_B', 'ORG001'),
('VEND-B-003', 'Schneider Electric', 'ELEC-120', '2024-10-15', 'Forecasting', 'Neutral', 'Request quarterly demand planning meetings to align production capacity with project pipeline. Current ad-hoc approach creates inefficiencies.', true, 'Schedule quarterly S&OP meetings with procurement and engineering', 'DATASET_B', 'ORG001'),
('VEND-B-005', 'SAP Indonesia', 'ELEC-210', '2024-09-20', 'Payment', 'Negative', 'License renewal payments delayed by 60 days impacting support service continuity. Request expedited processing for subscription renewals.', true, 'Implement auto-renewal with pre-approved budget allocation', 'DATASET_B', 'ORG001'),
('VEND-B-007', 'Cisco Systems Indonesia', 'ELEC-220', '2024-10-22', 'Quality', 'Positive', 'Appreciate detailed technical requirements documentation. Reduces ambiguity and enables accurate solution sizing and pricing.', false, NULL, 'DATASET_B', 'ORG001'),
('VEND-B-009', 'PT Voksel Electric', 'ELEC-310', '2024-09-12', 'Process', 'Neutral', 'Technical approval process for cable specifications taking 3-4 weeks. Suggest pre-approved catalog for standard applications to expedite.', true, 'Develop pre-qualified cable catalog with automated approval', 'DATASET_B', 'ORG001');

-- Market Intelligence for Dataset B
INSERT INTO fact_mi_reference (category_code, reference_period, supply_demand_balance, price_trend, price_volatility_index, capacity_utilization_pct, innovation_index, market_concentration, supply_risk_score, forecasted_growth_pct, key_insights, dataset_id, organization_id) VALUES
('ELEC-110', '2024-Q4', 'Tight', 'Rising', 5.8, 88, 7, 'High', 6.2, 9, 'Strong demand from grid modernization and renewable integration. Transformer lead times extended to 18-24 months. Steel and copper prices up 15% YoY.', 'DATASET_B', 'ORG001'),
('ELEC-120', '2024-Q4', 'Balanced', 'Stable', 3.2, 75, 9, 'Medium', 3.8, 14, 'Rapid digitalization driving smart grid investments. IEC 61850 protocol standardization accelerating. Cybersecurity requirements increasing product complexity.', 'DATASET_B', 'ORG001'),
('ELEC-210', '2024-Q4', 'Balanced', 'Rising', 4.5, 70, 8, 'High', 4.2, 11, 'Cloud migration momentum strong. SaaS adoption reducing capital expenditure but increasing operating costs. Vendor lock-in and data sovereignty concerns.', 'DATASET_B', 'ORG001'),
('ELEC-220', '2024-Q4', 'Balanced', 'Stable', 3.8, 72, 9, 'Medium', 4.5, 16, 'Zero-trust architecture becoming standard. AI-powered threat detection gaining traction. Supply chain security for network equipment critical.', 'DATASET_B', 'ORG001'),
('ELEC-310', '2024-Q4', 'Surplus', 'Declining', 4.2, 65, 5, 'Low', 2.8, 5, 'Competitive market with strong local manufacturing. Copper price volatility main cost driver. Energy-efficient and fire-resistant variants gaining share.', 'DATASET_B', 'ORG001'),
('ELEC-320', '2024-Q4', 'Surplus', 'Stable', 2.5, 60, 6, 'Low', 2.2, 7, 'LED technology mature with price stabilization. Smart lighting and IoT integration creating premium segment. Strong local supplier availability.', 'DATASET_B', 'ORG001');

-- Kraljic Matrix for Dataset B
INSERT INTO fact_kraljic_matrix (category_code, profit_impact_score, supply_risk_score, kraljic_quadrant, calculation_method, manual_override, override_rationale, approved_by, approved_at, dataset_id, organization_id) VALUES
('ELEC-110', 88, 72, 'Strategic', 'Auto', false, NULL, NULL, NULL, 'DATASET_B', 'ORG001'),
('ELEC-120', 75, 68, 'Strategic', 'Auto', false, NULL, NULL, NULL, 'DATASET_B', 'ORG001'),
('ELEC-210', 82, 75, 'Strategic', 'Auto', false, NULL, NULL, NULL, 'DATASET_B', 'ORG001'),
('ELEC-220', 78, 70, 'Strategic', 'Auto', false, NULL, NULL, NULL, 'DATASET_B', 'ORG001'),
('ELEC-310', 48, 35, 'Leverage', 'Auto', false, NULL, NULL, NULL, 'DATASET_B', 'ORG001'),
('ELEC-320', 32, 28, 'Routine', 'Auto', false, NULL, NULL, NULL, 'DATASET_B', 'ORG001');

-- Category Strategy for Dataset B
INSERT INTO fact_category_strategy (category_code, kraljic_quadrant, strategic_lever, lever_description, impact_score, implementation_complexity, forecasted_savings_pct, forecasted_savings_amount, implementation_timeline, status, approved_by, approved_at, dataset_id, organization_id) VALUES
('ELEC-110', 'Strategic', 'Index-Based Pricing', 'Link transformer pricing to copper and steel commodity indices with quarterly adjustment mechanism to manage material cost volatility', 8.0, 'Medium', 5.5, 2475000000, '12 months', 'Approved', 'Siti Rahayu', '2024-10-12', 'DATASET_B', 'ORG001'),
('ELEC-120', 'Strategic', 'Technology Partnership', 'Strategic partnership with Schneider Electric for smart grid solutions including joint training, technology roadmap alignment, and priority support', 8.5, 'High', 10.0, 2300000000, '24 months', 'In Progress', 'Siti Rahayu', '2024-09-08', 'DATASET_B', 'ORG001'),
('ELEC-210', 'Strategic', 'Enterprise Agreement Optimization', 'Renegotiate SAP and Oracle licenses to enterprise-wide subscription model with usage-based pricing and cloud migration incentives', 9.0, 'High', 15.0, 4500000000, '18 months', 'Under Review', NULL, NULL, 'DATASET_B', 'ORG001'),
('ELEC-220', 'Strategic', 'Security Architecture Consolidation', 'Standardize on integrated security platform (SASE) to reduce point solutions and improve threat visibility across OT and IT networks', 8.5, 'High', 18.0, 3240000000, '24 months', 'Approved', 'Siti Rahayu', '2024-10-25', 'DATASET_B', 'ORG001'),
('ELEC-310', 'Leverage', 'Volume Aggregation', 'Aggregate cable demand across all business units and establish annual contracts with 2-3 preferred suppliers for volume leverage', 7.0, 'Low', 12.0, 1920000000, '6 months', 'Approved', 'Siti Rahayu', '2024-10-20', 'DATASET_B', 'ORG001'),
('ELEC-320', 'Routine', 'Energy Efficiency Upgrade', 'Replace conventional lighting with LED across all facilities with energy-service company (ESCO) financing model', 6.5, 'Low', 25.0, 2500000000, '18 months', 'Proposed', NULL, NULL, 'DATASET_B', 'ORG001');

-- Category Action Plans for Dataset B
INSERT INTO fact_category_action_plan (category_code, action_type, action_title, action_description, source_analysis, priority, owner, target_completion_date, status, expected_impact_amount, actual_impact_amount, kpi_linkage, dataset_id, organization_id) VALUES
('ELEC-110', 'Cost Optimization', 'Transformer Specification Value Engineering', 'Collaborate with ABB on transformer design optimization to reduce material costs while maintaining performance. Focus on core steel grades and winding configurations.', 'VoS', 'High', 'Engineering Dept', '2025-06-30', 'In Progress', 1440000000, NULL, 'Material Cost Reduction', 'DATASET_B', 'ORG001'),
('ELEC-120', 'Innovation', 'Smart Grid Pilot Implementation', 'Deploy pilot smart grid protection and monitoring system at Java 1 using Schneider Electric IEC 61850 platform for proof of concept', 'External', 'High', 'Technology Dept', '2025-09-30', 'Planned', NULL, NULL, 'Grid Reliability Improvement', 'DATASET_B', 'ORG001'),
('ELEC-210', 'Process Improvement', 'License Renewal Automation', 'Implement automated license tracking and renewal process with pre-approved budget allocation to eliminate payment delays', 'VoS', 'Critical', 'IT Dept', '2025-02-28', 'In Progress', 180000000, NULL, 'Administrative Efficiency', 'DATASET_B', 'ORG001'),
('ELEC-220', 'Risk Mitigation', 'Zero Trust Architecture Implementation', 'Deploy zero-trust security model across enterprise network with micro-segmentation and continuous authentication', 'AI Generated', 'Critical', 'IT Security', '2025-12-31', 'Planned', NULL, NULL, 'Cybersecurity Posture', 'DATASET_B', 'ORG001'),
('ELEC-310', 'Supplier Development', 'Local Vendor Quality Enhancement', 'Partner with PT Voksel and PT Supreme to implement ISO 9001 quality management system improvements and reduce defect rates', 'VoC', 'Medium', 'Quality Dept', '2025-08-31', 'Planned', 520000000, NULL, 'Quality Cost Reduction', 'DATASET_B', 'ORG001'),
('ELEC-310', 'Process Improvement', 'Pre-Qualified Cable Catalog', 'Develop and maintain pre-qualified cable specifications catalog for standard applications to eliminate repetitive technical approvals', 'VoS', 'Medium', 'Engineering Dept', '2025-04-30', 'Planned', 240000000, NULL, 'Procurement Lead Time', 'DATASET_B', 'ORG001');

-- AI Insights for Dataset B
INSERT INTO fact_category_ai_insight (category_code, insight_type, insight_title, insight_description, confidence_score, financial_impact_estimate, risk_level, ai_source_type, key_variables, user_action, user_comment, dataset_id, organization_id) VALUES
('ELEC-110', 'Predictive', 'Transformer Lead Time Extension', 'Supply chain analysis indicates transformer delivery lead times will extend from 18 to 24+ months by Q2 2025 due to material shortages and capacity constraints. Recommend accelerating orders for 2026 projects.', 91, NULL, 'Critical', 'Predictive Model', '{"copper_availability": "tight", "steel_capacity": "85%", "oem_backlog": "24_months"}', 'Accepted', 'Expediting 2026 project procurement planning', 'DATASET_B', 'ORG001'),
('ELEC-120', 'Prescriptive', 'Smart Grid Platform Consolidation', 'Consolidating protection systems to single vendor (Schneider Electric) for IEC 61850 compliance will save 14% through standardization, training efficiency, and improved interoperability. Migration ROI: 18 months.', 87, 3220000000, 'Low', 'Simulation', '{"standardization_savings": "1.8B", "training_reduction": "0.9B", "maintenance_efficiency": "0.5B"}', 'Under Review', NULL, 'DATASET_B', 'ORG001'),
('ELEC-210', 'Diagnostic', 'SaaS Cost Escalation Alert', 'Cloud subscription costs increasing 22% annually vs 8% forecast. Root cause: unmanaged license sprawl (38% unused licenses) and lack of usage governance. Recommend immediate license optimization.', 89, 2700000000, 'Moderate', 'Pattern Recognition', '{"unused_licenses": 0.38, "price_increase": 0.22, "budget_variance": 0.14}', 'Accepted', 'Initiated license audit and optimization program', 'DATASET_B', 'ORG001'),
('ELEC-220', 'Prescriptive', 'Integrated Security Platform Migration', 'Migrating from 8 point security solutions to unified SASE platform (Palo Alto Prisma) will reduce costs by 18% and improve threat detection by 45%. Implementation complexity: High. ROI: 22 months.', 85, 3240000000, 'Moderate', 'Prescriptive Analytics', '{"cost_reduction": "18%", "threat_improvement": "45%", "complexity_score": 8.5}', 'Accepted', 'Aligned with enterprise security roadmap', 'DATASET_B', 'ORG001'),
('ELEC-310', 'Explanatory', 'Cable Procurement Inefficiency Analysis', 'Technical approval delays (avg 24 days) driving 18% maverick spend in cables. Root causes: non-standard specifications (52%), lack of pre-approved catalog (31%), and approval workflow complexity (17%). Recommend catalog standardization.', 88, 720000000, 'Moderate', 'Pattern Recognition', '{"non_standard": 0.52, "no_catalog": 0.31, "workflow_delay": 0.17}', 'Accepted', 'Implementing pre-qualified catalog solution', 'DATASET_B', 'ORG001'),
('ELEC-000', 'Prescriptive', 'Cross-Category Bundling Opportunity', 'Bundling transformers, cables, and lighting (ELEC-110, ELEC-310, ELEC-320) for substation modernization projects can achieve 7-9% savings through volume leverage and project coordination. Total addressable: Rp 71B annually.', 82, 5680000000, 'Low', 'Prescriptive Analytics', '{"volume_leverage": "6.5%", "project_efficiency": "2.5%", "total_savings": "9.0%"}', 'Pending', NULL, 'DATASET_B', 'ORG001');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_spend_summary_dataset_category ON fact_spend_summary(dataset_id, category_code);
CREATE INDEX IF NOT EXISTS idx_supplier_perf_dataset_category ON fact_supplier_performance(dataset_id, category_code);
CREATE INDEX IF NOT EXISTS idx_mi_reference_dataset_category ON fact_mi_reference(dataset_id, category_code);
CREATE INDEX IF NOT EXISTS idx_action_plan_dataset_status ON fact_category_action_plan(dataset_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_insight_dataset_action ON fact_category_ai_insight(dataset_id, user_action);
