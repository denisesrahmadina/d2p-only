/*
  # Populate Voice of Supplier Data

  1. Data Population
    - Insert supplier business plans for major vendors
    - Insert R&D initiatives and innovation projects
    - Insert process feedback from various units
    - Cover all three categories with comprehensive data

  2. Categories Covered
    - Renewable Energy Equipment (CAT-RENEW-001)
    - Mechanical Equipment (CAT-MECH-001)
    - Electrical Equipment (CAT-ELEC-001)
*/

-- Populate Supplier Business Plans for Renewable Energy Equipment
INSERT INTO fact_supplier_business_plan (
  category_code, supplier_id, supplier_name,
  strategic_vision, strategic_priorities, alignment_score,
  annual_revenue_usd, rd_investment_usd, rd_investment_percentage, financial_stability_rating,
  projected_growth_percentage, expansion_markets, new_product_launches, capacity_expansion_planned,
  joint_development_interest, innovation_partnership_potential, strategic_partnership_level,
  ai_strategic_insights, collaboration_recommendations, risk_assessment,
  planning_period
) VALUES
('CAT-RENEW-001', 'V-RENEW-001', 'Vestas Wind Systems',
 'Global leader in sustainable energy solutions, committed to achieving 100% renewable energy by 2030 while expanding offshore wind capabilities and digital services.',
 ARRAY['Offshore wind technology advancement', 'Digital twin and predictive maintenance', 'Supply chain sustainability', 'Emerging markets expansion'],
 95,
 15000000000, 450000000, 3.00, 'Excellent',
 12.50, ARRAY['Southeast Asia', 'Middle East', 'South America'], 4, true,
 true, 'Excellent alignment for joint offshore wind projects and digital innovation. Strong partner for long-term strategic collaboration.',
 'Preferred',
 'Vestas demonstrates exceptional strategic alignment with company sustainability goals. Their significant R&D investment (3% of revenue) in offshore wind and digital services directly supports future energy transition initiatives. Financial stability is excellent with consistent growth trajectory. The company''s focus on supply chain sustainability and emerging market expansion creates multiple collaboration opportunities.',
 'Recommend establishing strategic partnership agreement with preferred supplier status. Explore joint development opportunities in offshore wind technology and digital twin applications. Consider co-investment in R&D initiatives for next-generation turbine designs. Leverage their emerging market expertise for regional expansion projects.',
 'Low risk. Financially stable with diversified revenue streams. Strong market position and technological leadership. Minimal supply chain vulnerabilities with proactive management.',
 '2025-2027'),

('CAT-RENEW-001', 'V-RENEW-002', 'Siemens Gamesa',
 'Pioneer in renewable energy innovation, integrating IoT and AI technologies to deliver intelligent wind energy solutions with focus on operational excellence.',
 ARRAY['AI-powered wind farm optimization', 'Hybrid renewable systems', 'Green hydrogen integration', 'Circular economy initiatives'],
 92,
 11000000000, 385000000, 3.50, 'Excellent',
 10.00, ARRAY['Europe', 'North America', 'Asia Pacific'], 3, true,
 true, 'High potential for AI/IoT collaboration and hybrid renewable system development. Strong candidate for innovation partnerships.',
 'Strategic',
 'Siemens Gamesa offers cutting-edge AI and IoT integration capabilities that align perfectly with digital transformation strategy. Their leadership in hybrid renewable systems and green hydrogen integration presents unique collaboration opportunities. The company''s circular economy focus supports sustainability commitments. Excellent financial position with strong R&D investment prioritization.',
 'Establish strategic innovation partnership focusing on AI-powered optimization and hybrid systems. Co-develop proof-of-concept for AI-driven wind farm management. Explore joint ventures in green hydrogen integration projects. Participate in their circular economy initiatives to improve sustainability metrics.',
 'Low-Medium risk. Excellent financial standing though slightly affected by market consolidation. Strong technological capabilities mitigate operational risks. Parent company (Siemens Energy) provides additional stability.',
 '2025-2027'),

('CAT-RENEW-001', 'V-RENEW-003', 'Goldwind',
 'Asia''s leading wind turbine manufacturer focusing on cost-effective solutions, technological innovation, and international market penetration.',
 ARRAY['Cost optimization technologies', 'Direct-drive turbine advancement', 'International market expansion', 'Smart wind farm solutions'],
 78,
 9200000000, 230000000, 2.50, 'Good',
 18.00, ARRAY['Southeast Asia', 'Middle East', 'Africa', 'South America'], 5, true,
 true, 'Good potential for cost-effective solutions and emerging market projects. Suitable for transactional to strategic relationship development.',
 'Transactional',
 'Goldwind provides competitive cost advantages particularly valuable for emerging market projects. Strong growth trajectory (18% projected) indicates market confidence and expansion capability. Direct-drive technology expertise offers alternative technical approaches. International expansion aligns with company''s regional development plans, though strategic alignment is moderate.',
 'Maintain transactional relationship with potential for strategic elevation. Utilize for cost-sensitive emerging market projects. Evaluate direct-drive technology for specific applications. Monitor quality and delivery performance before increasing engagement. Consider pilot projects to assess partnership potential.',
 'Medium risk. Rapid growth may strain quality control and delivery capabilities. Heavy focus on emerging markets increases geopolitical exposure. Financial stability good but requires monitoring during expansion phase.',
 '2025-2027'),

('CAT-RENEW-001', 'V-RENEW-005', 'Nordex SE',
 'European wind turbine manufacturer specializing in onshore solutions with focus on operational efficiency and modular designs.',
 ARRAY['Modular turbine platforms', 'Operational efficiency improvements', 'European market consolidation', 'Service and maintenance optimization'],
 65,
 5800000000, 145000000, 2.50, 'Fair',
 5.00, ARRAY['Eastern Europe', 'Latin America'], 2, false,
 false, 'Limited alignment. Suitable for specific onshore projects but lacks strategic innovation focus.',
 'Under Review',
 'Nordex faces market challenges reflected in modest growth projections and fair financial stability. Limited R&D investment compared to peers. Strategic priorities focus on consolidation rather than innovation, creating misalignment with company''s growth and innovation objectives. Modular platform approach has merit but lacks differentiation.',
 'Maintain under review status. Use selectively for standard onshore projects where cost is primary consideration. Do not commit to long-term exclusive arrangements. Monitor financial stability closely. Require performance guarantees. Consider alternative suppliers for critical projects.',
 'Medium-High risk. Financial stability concerns require close monitoring. Limited innovation capability may impact competitiveness. Market position weakening relative to larger competitors. Service quality inconsistent based on feedback.',
 '2025-2027');

-- Populate Supplier Business Plans for Mechanical Equipment
INSERT INTO fact_supplier_business_plan (
  category_code, supplier_id, supplier_name,
  strategic_vision, strategic_priorities, alignment_score,
  annual_revenue_usd, rd_investment_usd, rd_investment_percentage, financial_stability_rating,
  projected_growth_percentage, expansion_markets, new_product_launches, capacity_expansion_planned,
  joint_development_interest, innovation_partnership_potential, strategic_partnership_level,
  ai_strategic_insights, collaboration_recommendations, risk_assessment,
  planning_period
) VALUES
('CAT-MECH-001', 'V-MECH-001', 'Grundfos',
 'Leading intelligent pump solutions provider, pioneering IoT-enabled systems and sustainable water management technologies.',
 ARRAY['Smart pump systems with IoT', 'Energy efficiency optimization', 'Water scarcity solutions', 'Predictive maintenance platforms'],
 90,
 4500000000, 180000000, 4.00, 'Excellent',
 8.50, ARRAY['Asia Pacific', 'Middle East', 'Africa'], 6, true,
 true, 'Excellent partner for IoT integration and predictive maintenance systems. High collaboration potential.',
 'Preferred',
 'Grundfos demonstrates exceptional innovation leadership with industry-high 4% R&D investment. Their IoT-enabled smart pump systems align perfectly with digital transformation initiatives. Strong focus on energy efficiency and predictive maintenance creates immediate value opportunities. Excellent financial stability supports long-term partnership confidence.',
 'Establish preferred supplier agreement with technology collaboration framework. Co-develop IoT integration projects for existing installations. Pilot predictive maintenance platforms across multiple sites. Leverage their water management expertise for sustainability initiatives. Consider joint R&D investment in next-generation smart systems.',
 'Low risk. Excellent financial position with consistent profitability. Strong market leadership and brand reputation. Diversified product portfolio reduces dependency risks.',
 '2025-2027'),

('CAT-MECH-001', 'V-MECH-002', 'Sulzer',
 'Global industrial solutions provider specializing in rotating equipment, flow control, and digital services for critical applications.',
 ARRAY['Digital services expansion', 'Additive manufacturing', 'Service lifecycle optimization', 'Emerging markets growth'],
 85,
 3200000000, 128000000, 4.00, 'Excellent',
 7.00, ARRAY['Southeast Asia', 'Middle East'], 4, true,
 true, 'Strong potential for digital services and additive manufacturing collaboration. Good strategic fit.',
 'Strategic',
 'Sulzer offers advanced capabilities in digital services and additive manufacturing that complement modernization plans. High R&D investment demonstrates innovation commitment. Strong technical expertise in critical applications ensures reliability. Service lifecycle optimization aligns with total cost of ownership objectives.',
 'Develop strategic partnership for digital services implementation. Explore additive manufacturing for spare parts optimization. Establish framework agreement for critical equipment supply. Collaborate on lifecycle optimization studies. Participate in their emerging market development initiatives.',
 'Low risk. Strong financial foundation with global presence. Diversified business model across industries. Proven track record in critical applications. Minimal delivery or quality concerns.',
 '2025-2027');

-- Populate Supplier Business Plans for Electrical Equipment  
INSERT INTO fact_supplier_business_plan (
  category_code, supplier_id, supplier_name,
  strategic_vision, strategic_priorities, alignment_score,
  annual_revenue_usd, rd_investment_usd, rd_investment_percentage, financial_stability_rating,
  projected_growth_percentage, expansion_markets, new_product_launches, capacity_expansion_planned,
  joint_development_interest, innovation_partnership_potential, strategic_partnership_level,
  ai_strategic_insights, collaboration_recommendations, risk_assessment,
  planning_period
) VALUES
('CAT-ELEC-001', 'V-ELEC-001', 'Schneider Electric',
 'Global specialist in energy management and automation, driving digital transformation in energy and infrastructure.',
 ARRAY['EcoStruxure digital platform expansion', 'Sustainability consulting services', 'Edge computing integration', 'Microgrid solutions'],
 95,
 32000000000, 1280000000, 4.00, 'Excellent',
 9.50, ARRAY['Asia Pacific', 'Middle East', 'Africa', 'Latin America'], 12, true,
 true, 'Outstanding alignment for comprehensive digital transformation and sustainability partnership. Premier strategic partner.',
 'Preferred',
 'Schneider Electric represents the gold standard for strategic alignment. Their EcoStruxure platform directly enables digital transformation objectives. Massive R&D investment ($1.28B) ensures continued innovation leadership. Sustainability consulting services support ESG goals. Microgrid capabilities align with energy independence strategy. Exceptional financial strength provides partnership confidence.',
 'Establish enterprise-wide strategic partnership as preferred supplier for electrical and automation systems. Deploy EcoStruxure platform across all facilities for integrated energy management. Engage sustainability consulting services for ESG roadmap development. Co-develop microgrid pilot projects. Create joint innovation lab for next-generation solutions. Negotiate volume discounts and technology access agreements.',
 'Very Low risk. Financial strength exceptional with global market leadership. Proven technology platform with extensive deployment success. Strong service and support network. Minimal supply chain vulnerabilities.',
 '2025-2027'),

('CAT-ELEC-001', 'V-ELEC-002', 'ABB Ltd',
 'Technology leader in electrification and automation, focusing on sustainable transportation and intelligent infrastructure.',
 ARRAY['Electrification solutions', 'Industrial automation', 'Robotics integration', 'Sustainable transportation'],
 88,
 29000000000, 1160000000, 4.00, 'Excellent',
 7.50, ARRAY['Asia', 'Europe', 'Americas'], 10, true,
 true, 'Excellent partner for electrification and automation projects. Strong innovation and reliability.',
 'Strategic',
 'ABB provides world-class electrification and automation solutions with proven reliability. Significant R&D commitment ensures technology leadership. Robotics integration capabilities offer modernization opportunities. Sustainable transportation focus aligns with fleet electrification plans. Strong financial position and global reach support large-scale deployments.',
 'Establish strategic partnership for electrification and automation initiatives. Evaluate robotics integration for operational efficiency improvements. Collaborate on sustainable transportation solutions for fleet management. Engage in pilot projects for advanced automation systems. Leverage global network for multi-site standardization.',
 'Low risk. Excellent financial stability and market position. Comprehensive product portfolio reduces dependency. Strong technical support and service capabilities. Reliable delivery performance.',
 '2025-2027');

-- Populate Supplier R&D Initiatives (continued in next part due to length)
INSERT INTO fact_supplier_rd_initiatives (
  category_code, supplier_id, supplier_name,
  initiative_title, initiative_description, technology_area,
  investment_amount_usd, investment_timeline, status, completion_percentage, expected_completion_date,
  potential_impact, collaboration_opportunity, relevance_to_company
) VALUES
-- Vestas R&D Initiatives
('CAT-RENEW-001', 'V-RENEW-001', 'Vestas Wind Systems',
 'V236-15MW Offshore Wind Turbine Development',
 'Next-generation 15MW offshore wind turbine with 236-meter rotor diameter. Features advanced blade design, improved capacity factor, and reduced LCOE. Targeting 30% increase in annual energy production vs. current generation.',
 'Offshore Wind Technology',
 120000000, '2024-2026', 'In Progress', 75, '2026-06-30',
 'High', true,
 'Critical for planned offshore wind farm expansion. 15MW capacity aligns with grid infrastructure plans. Early adoption partnership could secure capacity allocation and preferential pricing.'),

('CAT-RENEW-001', 'V-RENEW-001', 'Vestas Wind Systems',
 'Digital Twin Platform for Predictive Maintenance',
 'AI-powered digital twin technology creating virtual replicas of wind turbines. Real-time monitoring, predictive failure analysis, and optimization recommendations. Target: 20% reduction in unplanned downtime and 15% increase in availability.',
 'Digital Services & IoT',
 45000000, '2024-2025', 'In Progress', 85, '2025-12-31',
 'High', true,
 'Directly supports digital transformation and predictive maintenance strategy. Could be piloted across existing Vestas fleet immediately. ROI projected within 18 months through reduced downtime.'),

-- Siemens Gamesa R&D Initiatives
('CAT-RENEW-001', 'V-RENEW-002', 'Siemens Gamesa',
 'Hybrid Renewable Energy System Integration',
 'Integrated system combining wind, solar, and battery storage with intelligent grid management. AI-based power optimization ensuring consistent output and grid stability. Includes green hydrogen production capability.',
 'Hybrid Systems & Energy Storage',
 95000000, '2025-2027', 'Planning', 15, '2027-12-31',
 'High', true,
 'Aligns with renewable energy diversification strategy and grid stability requirements. Green hydrogen capability supports future fuel transition. Potential site for demonstration project available.'),

('CAT-RENEW-001', 'V-RENEW-002', 'Siemens Gamesa',
 'RecyclableBlade Technology',
 'Revolutionary blade design using recyclable materials enabling end-of-life circularity. Maintains performance while achieving 100% recyclability. Supports circular economy and reduces environmental impact.',
 'Sustainability & Materials',
 30000000, '2024-2026', 'In Progress', 60, '2026-03-31',
 'Medium', false,
 'Supports ESG commitments and sustainability goals. Addresses future decommissioning challenges. May command premium pricing but offers long-term value.'),

-- Grundfos R&D Initiatives
('CAT-MECH-001', 'V-MECH-001', 'Grundfos',
 'iSOLUTIONS Smart Pump Ecosystem',
 'Comprehensive IoT platform integrating pumps, sensors, controllers, and cloud analytics. Real-time performance optimization, energy consumption reduction, and predictive maintenance. Expected energy savings: 20-30%.',
 'IoT & Smart Systems',
 55000000, '2024-2026', 'In Progress', 70, '2026-06-30',
 'High', true,
 'Perfect fit for facility-wide pump optimization initiative. Energy savings directly impact operational costs. IoT infrastructure already exists for rapid deployment. Potential for company-wide rollout.'),

('CAT-MECH-001', 'V-MECH-001', 'Grundfos',
 'AI-Powered Predictive Maintenance Platform',
 'Machine learning algorithms analyzing vibration, temperature, flow, and pressure data to predict failures 4-6 weeks in advance. Automated work order generation and spare parts optimization.',
 'Artificial Intelligence',
 28000000, '2025-2026', 'Planning', 25, '2026-12-31',
 'High', true,
 'Aligns with predictive maintenance strategy. Extended failure prediction window enables better planning. Integration with existing CMMS possible. ROI through avoided catastrophic failures.'),

-- Schneider Electric R&D Initiatives
('CAT-ELEC-001', 'V-ELEC-001', 'Schneider Electric',
 'EcoStruxure Microgrid Advisor',
 'Advanced microgrid control and optimization platform. Integrates renewable energy, storage, and conventional generation. AI-based load forecasting and economic optimization. Enables grid independence and resilience.',
 'Microgrid & Energy Management',
 85000000, '2024-2027', 'In Progress', 55, '2027-06-30',
 'High', true,
 'Critical for energy independence strategy. Addresses grid reliability concerns. Potential for pilot deployment at main campus. Could reduce energy costs by 25-35% while improving resilience.'),

('CAT-ELEC-001', 'V-ELEC-001', 'Schneider Electric',
 'Edge Computing for Industrial IoT',
 'Distributed edge computing infrastructure for industrial IoT applications. Real-time processing, reduced latency, enhanced security. Enables advanced analytics and AI at the edge.',
 'Edge Computing & IoT',
 42000000, '2025-2026', 'Planning', 30, '2026-09-30',
 'Medium', true,
 'Supports digital transformation and Industry 4.0 initiatives. Addresses data security and latency concerns. Potential integration with existing systems.');

-- Populate Supplier Process Feedback
INSERT INTO fact_supplier_process_feedback (
  category_code, supplier_id, supplier_name,
  feedback_period, reporting_unit, reporting_department, evaluator_name, evaluation_date,
  communication_score, responsiveness_score, flexibility_score, innovation_score,
  cost_competitiveness_score, technical_capability_score, overall_score, performance_rating,
  strengths, areas_for_improvement, efficiency_initiatives, quality_control_assessment, compliance_status,
  recommended_actions, follow_up_required
) VALUES
-- Vestas Process Feedback
('CAT-RENEW-001', 'V-RENEW-001', 'Vestas Wind Systems',
 '2025 Q3', 'Unit 1 - Suralaya Power Plant', 'Engineering & Maintenance', 'Dewi Kusuma, Chief Engineer', '2025-10-15',
 92, 88, 85, 95, 78, 93, 89, 'Excellent',
 'Exceptional technical support and engineering expertise. Proactive communication on project milestones. Strong innovation focus with regular technology updates. Digital platform integration excellent. Responsive to technical queries with detailed solutions.',
 'Pricing above market average but justified by quality. Delivery lead times occasionally extended during peak demand. Could improve spare parts availability in local markets. More flexibility needed on payment terms for large projects.',
 'Implementing local service center in Jakarta (Q1 2026) to improve response times. Expanding spare parts inventory in regional warehouses. Developing training programs for local technicians. Piloting remote monitoring service for better predictive maintenance.',
 'Quality control excellent. All equipment meets or exceeds specifications. Factory acceptance tests thorough and professional. Documentation complete and accurate. ISO certifications current and verified.',
 'Fully Compliant',
 'Continue strategic partnership. Negotiate framework agreement for next 3 years with volume discounts. Participate in local service center development. Enroll maintenance team in technical training programs. Explore co-investment opportunities in R&D initiatives.',
 false),

('CAT-RENEW-001', 'V-RENEW-001', 'Vestas Wind Systems',
 '2025 Q3', 'Unit 2 - Paiton Power Plant', 'Operations', 'Ahmad Santoso, Operations Manager', '2025-10-20',
 90, 92, 88, 90, 75, 95, 88, 'Excellent',
 'Outstanding technical performance and reliability. Digital monitoring tools provide excellent visibility. Remote support capabilities reduce downtime significantly. Proactive approach to preventive maintenance. Strong warranty support with quick resolution.',
 'Higher initial capital cost vs. competitors. Would benefit from more flexible financing options. Local spare parts support improving but still developing. More competitive pricing on service contracts needed.',
 'Rolling out enhanced digital monitoring platform with AI-powered analytics. Increasing local inventory of critical spare parts. Training local service teams to reduce dependency on expatriate technicians. Developing outcome-based service contracts.',
 'Excellent. Performance parameters consistently met. Reliability metrics exceed industry benchmarks. Quality issues minimal and quickly resolved. Maintenance requirements well-documented and manageable.',
 'Fully Compliant',
 'Maintain preferred supplier status. Negotiate multi-year service agreement with performance guarantees. Request proposal for outcome-based contract model. Increase spare parts consignment inventory. Schedule annual technical review meetings.',
 false);

-- Additional feedback samples for other suppliers
INSERT INTO fact_supplier_process_feedback (
  category_code, supplier_id, supplier_name,
  feedback_period, reporting_unit, reporting_department, evaluator_name, evaluation_date,
  communication_score, responsiveness_score, flexibility_score, innovation_score,
  cost_competitiveness_score, technical_capability_score, overall_score, performance_rating,
  strengths, areas_for_improvement, efficiency_initiatives, quality_control_assessment, compliance_status,
  recommended_actions, follow_up_required
) VALUES
-- Siemens Gamesa Feedback
('CAT-RENEW-001', 'V-RENEW-002', 'Siemens Gamesa',
 '2025 Q3', 'Unit 3 - Labuan Power Plant', 'Project Management', 'Rudi Wijaya, Project Director', '2025-10-25',
 88, 90, 82, 93, 80, 91, 87, 'Excellent',
 'Strong project management and engineering support. Innovative solutions for technical challenges. Excellent integration of digital technologies. Good commercial flexibility on large projects. Reliable delivery performance.',
 'Communication sometimes delayed during European holidays. More proactive escalation process needed for critical issues. Pricing complex with many line items. Documentation could be more user-friendly.',
 'Implementing 24/7 global support desk for critical projects. Developing simplified pricing structure. Creating customer portal for real-time project tracking. Training programs for local teams.',
 'Very good. Minor quality issues quickly addressed. Performance guarantees met. Testing protocols comprehensive. Continuous improvement visible.',
 'Fully Compliant',
 'Expand collaboration on digital initiatives. Request participation in 24/7 support pilot program. Negotiate simplified pricing structure for future projects. Schedule quarterly business reviews.',
 false),

-- Grundfos Feedback
('CAT-MECH-001', 'V-MECH-001', 'Grundfos',
 '2025 Q3', 'Unit 1 - Muara Karang Plant', 'Maintenance & Reliability', 'Hendra Gunawan, Maintenance Manager', '2025-10-18',
 94, 95, 90, 92, 82, 93, 91, 'Excellent',
 'Best-in-class technical support and responsiveness. IoT platform significantly improved monitoring capabilities. Predictive maintenance features reducing unplanned downtime. Training programs excellent. Strong local presence and support.',
 'Premium pricing vs. alternatives. Proprietary systems limit flexibility for third-party integration. Spare parts logistics can be improved. More competitive on energy efficiency retrofits needed.',
 'Launching enhanced IoT analytics platform. Expanding local spare parts distribution. Developing open API for third-party integrations. Piloting energy efficiency assessment services.',
 'Excellent. Pump reliability outstanding. Energy efficiency gains exceeding specifications. Quality issues negligible. Maintenance-friendly designs.',
 'Fully Compliant',
 'Continue preferred supplier relationship. Request proposal for facility-wide IoT platform deployment. Negotiate better spare parts pricing through framework agreement. Participate in energy efficiency pilot program.',
 false),

-- Schneider Electric Feedback
('CAT-ELEC-001', 'V-ELEC-001', 'Schneider Electric',
 '2025 Q3', 'Corporate Engineering', 'Electrical Engineering', 'Fajar Nugroho, Chief Electrical Engineer', '2025-10-22',
 93, 91, 88, 96, 85, 95, 92, 'Excellent',
 'Exceptional technical expertise and innovation leadership. EcoStruxure platform delivers significant value. Comprehensive solutions approach. Excellent training and support. Strong commitment to sustainability alignment. Professional project execution.',
 'Premium pricing though value proposition strong. Complexity of offerings requires dedicated resources to manage. Integration projects can be lengthy. More standardization would benefit deployment speed.',
 'Simplifying product portfolio and configuration tools. Developing rapid deployment packages for standard applications. Enhancing customer training programs. Creating industry-specific reference architectures.',
 'Outstanding. Equipment reliability exceptional. Performance specifications consistently exceeded. Quality control rigorous. Industry-leading safety standards.',
 'Fully Compliant',
 'Establish enterprise-wide strategic partnership. Deploy EcoStruxure platform in phases across all facilities. Create joint innovation roadmap. Negotiate enterprise licensing and volume discounts. Schedule executive-level strategic planning sessions.',
 false),

-- Example of "Needs Improvement" feedback
('CAT-RENEW-001', 'V-RENEW-005', 'Nordex SE',
 '2025 Q3', 'Unit 2 - Paiton Power Plant', 'Procurement & Quality', 'Siti Nurhaliza, Procurement Lead', '2025-10-12',
 65, 58, 60, 45, 72, 68, 62, 'Satisfactory',
 'Competitive pricing for standard products. Willing to negotiate on commercial terms. European manufacturing quality generally acceptable. Basic technical support adequate for routine issues.',
 'Communication often delayed and requires multiple follow-ups. Technical support lacks depth for complex issues. Innovation capability limited. Quality consistency issues between batches. Delivery reliability problematic with frequent delays. Documentation incomplete or incorrect.',
 'Attempting to improve response times through regional support team. Upgrading quality management system. Working on delivery performance improvement plan. Limited innovation initiatives.',
 'Inconsistent. Some deliveries meet specs while others fall short. Quality control processes need strengthening. Documentation errors frequent. Testing procedures adequate but not comprehensive.',
 'Minor Issues',
 'Move to transactional relationship only. Reduce order volumes and use for non-critical applications only. Require enhanced quality assurance and testing. Implement penalty clauses for delivery delays. Develop alternative supplier options. Conduct quarterly performance reviews with improvement milestones.',
 true);
