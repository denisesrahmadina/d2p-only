/*
  # Populate Contract Monitoring Mock Data

  Populates realistic contract monitoring data for Indonesia Power with:
  - Active contracts with varying consumption levels
  - Contracts nearing expiration
  - Compliance issues (penalties, breaches)
  - AI-generated insights and action plans
*/

-- Insert contract monitoring data
INSERT INTO contract_monitoring (organization_id, contract_id, contract_name, vendor_name, contract_value, start_date, end_date, capacity, actual_consumption, consumption_percentage, status, category) VALUES
-- Active contracts with good performance
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2024-001', 'Coal Supply Agreement', 'PT Bukit Asam', 50000000000, '2024-01-01', '2025-12-31', 1000000, 650000, 65, 'active', 'Raw Materials'),
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2024-002', 'Maintenance Services Contract', 'PT Wijaya Karya', 15000000000, '2024-01-15', '2025-01-14', 12, 7, 58, 'active', 'Services'),
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2023-015', 'Turbine Parts Supply', 'Siemens Energy', 8500000000, '2023-06-01', '2025-05-31', 500, 410, 82, 'active', 'Equipment'),

-- Contracts with high consumption (at risk)
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2024-005', 'Chemical Treatment Supplies', 'PT Petro Kimia', 3200000000, '2024-03-01', '2025-02-28', 100000, 92000, 92, 'at_risk', 'Chemicals'),
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2023-022', 'IT Infrastructure Support', 'PT Telkom Indonesia', 12000000000, '2023-08-01', '2025-07-31', 24, 22, 91, 'at_risk', 'IT Services'),

-- Contracts expiring soon
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2023-008', 'Fuel Oil Supply Agreement', 'PT Pertamina', 75000000000, '2023-01-01', '2024-12-31', 500000, 385000, 77, 'expiring_soon', 'Fuel'),
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2023-011', 'Security Services', 'PT Securindo', 2400000000, '2023-11-01', '2024-10-31', 12, 9, 75, 'expiring_soon', 'Services'),
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2024-003', 'Air Filter Supply - Annual Contract', 'PT Astra Otoparts', 4500000000, '2024-02-01', '2025-01-31', 15000, 11200, 75, 'expiring_soon', 'Supplies'),

-- Expired contracts
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2022-018', 'Boiler Inspection Services', 'PT Lloyd Register', 1800000000, '2022-09-01', '2024-08-31', 6, 6, 100, 'expired', 'Services'),

-- Contracts with issues
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2024-007', 'Cooling System Maintenance', 'PT Industri Pendingin', 6700000000, '2024-04-01', '2025-03-31', 12, 5, 42, 'active', 'Maintenance'),
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2023-019', 'Transformer Supply Contract', 'ABB Indonesia', 25000000000, '2023-10-01', '2025-09-30', 50, 28, 56, 'active', 'Equipment');

-- Insert compliance issues
INSERT INTO contract_compliance_issues (organization_id, contract_id, issue_type, severity, description, financial_impact, detected_date, status) VALUES
-- Late delivery issues
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2024-002', 'late_delivery', 'medium', 'Maintenance crew arrived 3 days late for scheduled preventive maintenance at Semarang plant. Contract stipulates penalty of Rp 50M per day delay.', 150000000, '2024-10-15', 'under_review'),
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2023-019', 'late_delivery', 'high', 'Transformer delivery delayed by 45 days causing production delays. Liquidated damages clause: Rp 100M per week delay.', 600000000, '2024-09-20', 'open'),

-- Quality issues
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2024-005', 'quality_issue', 'high', 'Chemical batch #CH-2024-089 failed quality specifications. pH level out of acceptable range causing boiler scaling. Requires replacement and cleaning costs.', 425000000, '2024-10-28', 'open'),
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2024-003', 'quality_issue', 'medium', 'Air filters from September shipment showing premature clogging. Filter life reduced from 6 months to 3 months.', 180000000, '2024-09-12', 'resolved'),

-- SLA breach
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2024-007', 'sla_breach', 'critical', 'Cooling system maintenance response time exceeded SLA (24 hours) by 72 hours during critical period. Production unit shutdown for 3 days. Contract penalty: Rp 200M per day.', 600000000, '2024-11-01', 'open'),

-- Contract breach
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2023-015', 'contract_breach', 'medium', 'Vendor supplied non-certified parts for turbine maintenance, violating contract specifications. Parts rejected and require re-procurement.', 350000000, '2024-10-05', 'under_review'),

-- Payment disputes
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2024-001', 'payment_dispute', 'low', 'Invoice discrepancy: Vendor billed for premium coal grade but delivery note indicates standard grade. Difference: Rp 125M', 125000000, '2024-10-22', 'under_review');

-- Insert AI-generated insights and action plans
INSERT INTO contract_insights (organization_id, contract_id, insight_type, title, description, action_plan, priority) VALUES
-- Penalty calculations
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2024-007', 'penalty_calculation', 'Critical SLA Breach - Penalty Assessment', 'The cooling system maintenance vendor exceeded the 24-hour SLA response time by 72 hours during a critical period, causing a 3-day production shutdown. Based on contract clause 8.2, liquidated damages apply.',
'[
  {
    "step": 1,
    "action": "Document the incident timeline",
    "details": "Compile service request timestamp, vendor response time, and production impact records",
    "owner": "Contract Manager",
    "deadline": "2024-11-05"
  },
  {
    "step": 2,
    "action": "Calculate liquidated damages",
    "details": "Apply penalty rate of Rp 200M per day for 3-day delay = Rp 600M total",
    "owner": "Finance Team",
    "deadline": "2024-11-05"
  },
  {
    "step": 3,
    "action": "Issue formal notice to vendor",
    "details": "Send breach notification with penalty calculation and supporting evidence",
    "owner": "Legal Department",
    "deadline": "2024-11-08"
  },
  {
    "step": 4,
    "action": "Negotiate resolution",
    "details": "Schedule meeting with vendor to discuss penalty application and prevention measures",
    "owner": "Procurement Manager",
    "deadline": "2024-11-12"
  },
  {
    "step": 5,
    "action": "Process penalty deduction",
    "details": "Deduct penalty amount from next invoice payment or issue debit note",
    "owner": "Accounts Payable",
    "deadline": "2024-11-15"
  }
]'::jsonb, 'critical'),

((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2023-019', 'penalty_calculation', 'Late Delivery Penalty - Transformer Contract', 'Transformer delivery delayed by 45 days (6.4 weeks) causing production delays. Liquidated damages clause 7.1 stipulates Rp 100M per week delay.',
'[
  {
    "step": 1,
    "action": "Verify delay duration",
    "details": "Confirm original delivery date vs actual delivery date: 45 days = 6.4 weeks",
    "owner": "Logistics Team",
    "deadline": "2024-11-10"
  },
  {
    "step": 2,
    "action": "Calculate penalty amount",
    "details": "6.4 weeks × Rp 100M = Rp 640M (rounded to Rp 600M as per contract)",
    "owner": "Contract Administrator",
    "deadline": "2024-11-10"
  },
  {
    "step": 3,
    "action": "Assess production impact",
    "details": "Calculate actual financial impact from delayed commissioning",
    "owner": "Operations Manager",
    "deadline": "2024-11-12"
  },
  {
    "step": 4,
    "action": "Issue penalty notice",
    "details": "Formal notification to ABB Indonesia with penalty deduction schedule",
    "owner": "Legal Team",
    "deadline": "2024-11-15"
  }
]'::jsonb, 'high'),

-- Termination analysis
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2024-007', 'termination_analysis', 'Contract Termination Risk Assessment', 'Multiple SLA breaches and poor performance from cooling system vendor. Analysis indicates grounds for contract termination under clause 12.3 (Material Breach).',
'[
  {
    "step": 1,
    "action": "Review termination clauses",
    "details": "Analyze contract clause 12.3 - conditions for termination due to material breach",
    "owner": "Legal Department",
    "deadline": "2024-11-08"
  },
  {
    "step": 2,
    "action": "Document all breaches",
    "details": "Compile comprehensive record of SLA violations, quality issues, and financial impact",
    "owner": "Contract Manager",
    "deadline": "2024-11-10"
  },
  {
    "step": 3,
    "action": "Assess termination costs",
    "details": "Calculate early termination penalties, transition costs, and remaining contract value",
    "owner": "Finance Team",
    "deadline": "2024-11-12"
  },
  {
    "step": 4,
    "action": "Identify replacement vendors",
    "details": "Research qualified alternative maintenance providers with better track records",
    "owner": "Procurement Team",
    "deadline": "2024-11-15"
  },
  {
    "step": 5,
    "action": "Prepare termination notice",
    "details": "Draft formal termination letter with 30-day notice as per contract terms",
    "owner": "Legal Department",
    "deadline": "2024-11-18"
  },
  {
    "step": 6,
    "action": "Negotiate exit terms",
    "details": "Discuss amicable separation, final payments, and knowledge transfer",
    "owner": "Senior Management",
    "deadline": "2024-11-25"
  }
]'::jsonb, 'critical'),

-- Renewal recommendations
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2023-008', 'renewal_recommendation', 'Fuel Oil Contract Renewal Strategy', 'Current fuel oil supply contract with PT Pertamina expires in 60 days. Performance has been excellent (77% utilization, zero breaches). Recommend early renewal with improved terms.',
'[
  {
    "step": 1,
    "action": "Conduct performance review",
    "details": "Evaluate delivery timeliness, quality compliance, pricing competitiveness over 24 months",
    "owner": "Category Manager",
    "deadline": "2024-11-20"
  },
  {
    "step": 2,
    "action": "Analyze market conditions",
    "details": "Research current fuel oil market prices and alternative suppliers",
    "owner": "Market Intelligence",
    "deadline": "2024-11-25"
  },
  {
    "step": 3,
    "action": "Identify improvement areas",
    "details": "Propose contract enhancements: volume flexibility, price adjustment mechanism",
    "owner": "Procurement Team",
    "deadline": "2024-11-28"
  },
  {
    "step": 4,
    "action": "Prepare negotiation strategy",
    "details": "Target: 3-year term, 5% volume increase, quarterly price reviews",
    "owner": "Procurement Manager",
    "deadline": "2024-12-01"
  },
  {
    "step": 5,
    "action": "Initiate renewal discussions",
    "details": "Schedule meeting with Pertamina to discuss contract extension",
    "owner": "Senior Buyer",
    "deadline": "2024-12-05"
  }
]'::jsonb, 'high'),

((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2024-003', 'renewal_recommendation', 'Air Filter Contract - Renewal with Modifications', 'Air filter supply contract expires in 90 days. Recent quality issues require contract modifications. Recommend renewal with enhanced quality specifications and penalty clauses.',
'[
  {
    "step": 1,
    "action": "Review quality incidents",
    "details": "Analyze all quality failures and their impact on operations",
    "owner": "Quality Manager",
    "deadline": "2024-11-15"
  },
  {
    "step": 2,
    "action": "Benchmark alternative suppliers",
    "details": "Evaluate 3-4 alternative filter manufacturers for comparison",
    "owner": "Sourcing Team",
    "deadline": "2024-11-22"
  },
  {
    "step": 3,
    "action": "Draft revised specifications",
    "details": "Strengthen quality requirements, testing protocols, and acceptance criteria",
    "owner": "Technical Team",
    "deadline": "2024-11-28"
  },
  {
    "step": 4,
    "action": "Negotiate improved terms",
    "details": "Seek warranty extension, quality guarantees, and performance bonds",
    "owner": "Procurement Manager",
    "deadline": "2024-12-05"
  }
]'::jsonb, 'medium'),

-- Compliance recommendations
((SELECT id FROM organizations WHERE name = 'Indonesia Power' LIMIT 1), 'CTR-2024-005', 'compliance_recommendation', 'Chemical Supply Contract - Quality Monitoring Enhancement', 'Recent quality failure in chemical batch indicates need for enhanced quality control measures and more frequent testing protocols.',
'[
  {
    "step": 1,
    "action": "Implement batch testing",
    "details": "Require certificate of analysis (CoA) for every batch before acceptance",
    "owner": "Quality Assurance",
    "deadline": "2024-11-10"
  },
  {
    "step": 2,
    "action": "Add quality hold points",
    "details": "Introduce factory audit rights and witness testing before shipment",
    "owner": "QA Manager",
    "deadline": "2024-11-15"
  },
  {
    "step": 3,
    "action": "Establish vendor improvement plan",
    "details": "Work with vendor to implement corrective actions and process improvements",
    "owner": "Supplier Quality Engineer",
    "deadline": "2024-11-20"
  },
  {
    "step": 4,
    "action": "Amend contract terms",
    "details": "Add stricter quality penalties and rejection procedures",
    "owner": "Contract Manager",
    "deadline": "2024-11-25"
  }
]'::jsonb, 'high');
