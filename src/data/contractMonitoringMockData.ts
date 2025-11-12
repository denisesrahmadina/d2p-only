import {
  ContractMonitoring,
  ContractComplianceIssue,
  ContractInsight,
  PenaltyClause
} from '../services/contractMonitoringService';

const generateContracts = (): ContractMonitoring[] => {
  const categories = ['Coal & Fuel', 'Maintenance', 'Equipment', 'IT Services', 'Consulting', 'Construction', 'Logistics', 'Security Services'];
  const vendors = [
    'PT Supplier A', 'PT Maintenance Services', 'PT Equipment Supplier', 'PT Tech Solutions',
    'PT Consulting Group', 'PT Construction Co', 'PT Logistics Express', 'PT Security Guard',
    'PT Energy Solutions', 'PT Industrial Parts', 'PT Transportation Services', 'PT Facility Management',
    'PT Engineering Works', 'PT Safety Systems', 'PT Environmental Services', 'PT Power Equipment'
  ];
  const units = ['Tons', 'Units', 'Service Hours', 'Liters', 'KWh', 'Days', 'Months', 'Pieces'];

  const statuses: Array<'active' | 'expiring_soon' | 'expired' | 'at_risk'> = ['active', 'expiring_soon', 'expired', 'at_risk'];

  const contracts: ContractMonitoring[] = [];

  for (let i = 1; i <= 62; i++) {
    const categoryIndex = (i - 1) % categories.length;
    const vendorIndex = (i - 1) % vendors.length;
    const unitIndex = (i - 1) % units.length;

    const statusIndex = i % 4;
    let status: 'active' | 'expiring_soon' | 'expired' | 'at_risk';

    if (i <= 35) {
      status = 'active';
    } else if (i <= 45) {
      status = 'expiring_soon';
    } else if (i <= 52) {
      status = 'at_risk';
    } else {
      status = 'expired';
    }

    const baseValue = 50000000000 + (i * 10000000000);
    const startMonth = ((i - 1) % 12) + 1;
    const startYear = i <= 30 ? 2023 : 2024;
    const contractDuration = 12 + ((i % 3) * 12);

    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(startYear, startMonth - 1 + contractDuration, 0);

    const capacity = 1000 + (i * 100);
    const consumptionPercentage = status === 'at_risk'
      ? 85 + (i % 10)
      : status === 'active'
      ? 40 + (i % 30)
      : status === 'expiring_soon'
      ? 60 + (i % 20)
      : 95 + (i % 5);

    const actualConsumption = Math.floor(capacity * (consumptionPercentage / 100));

    const totalCommittedValue = baseValue * 0.9;
    const totalCommittedQuantity = capacity * 0.85;
    const absorptionPercentage = 75 + (i % 20);
    const poTotalValue = totalCommittedValue * (absorptionPercentage / 100);
    const poTotalQuantity = totalCommittedQuantity * (absorptionPercentage / 100);

    const penaltyClauses: PenaltyClause[] = [];

    if (i % 3 === 0) {
      penaltyClauses.push({
        clause_id: `P${i}-1`,
        penalty_type: 'late_delivery',
        description: 'Penalty for late delivery beyond grace period',
        trigger_condition: 'Delivery exceeds agreed schedule by more than 7 days',
        calculation_method: 'percentage_per_day',
        penalty_amount: 0.1,
        penalty_unit: 'per day of delay',
        max_penalty: baseValue * 0.01,
        grace_period_days: 7,
        notes: 'Calculated based on delayed shipment value'
      });
    }

    if (i % 5 === 0) {
      penaltyClauses.push({
        clause_id: `P${i}-2`,
        penalty_type: 'quality_defect',
        description: 'Penalty for quality defects exceeding acceptable threshold',
        trigger_condition: 'Defect rate exceeds 2%',
        calculation_method: 'fixed_amount_per_unit',
        penalty_amount: baseValue * 0.00001,
        penalty_unit: 'per defective unit',
        max_penalty: baseValue * 0.05,
        notes: 'Subject to quality inspection report'
      });
    }

    if (i % 7 === 0) {
      penaltyClauses.push({
        clause_id: `P${i}-3`,
        penalty_type: 'sla_breach',
        description: 'Service Level Agreement breach penalty',
        trigger_condition: 'Response time exceeds agreed SLA',
        calculation_method: 'percentage_of_monthly_fee',
        penalty_amount: 5,
        penalty_unit: 'per incident',
        max_penalty: baseValue * 0.15,
        grace_period_hours: 4,
        sla_threshold: '99.5% uptime',
        notes: 'Monthly service credit applied'
      });
    }

    if (i % 11 === 0) {
      penaltyClauses.push({
        clause_id: `P${i}-4`,
        penalty_type: 'volume_shortfall',
        description: 'Penalty for failing to meet minimum volume commitment',
        trigger_condition: 'Delivered quantity below 80% of committed volume',
        calculation_method: 'percentage_price_adjustment',
        penalty_amount: 10,
        penalty_unit: 'of shortfall value',
        max_penalty: baseValue * 0.2,
        notes: 'Calculated quarterly'
      });
    }

    contracts.push({
      id: i.toString(),
      organization_id: 'indonesia-power',
      contract_id: `CNT-${startYear}-${String(i).padStart(3, '0')}`,
      contract_name: `${categories[categoryIndex]} Contract - ${vendors[vendorIndex].replace('PT ', '')}`,
      vendor_name: vendors[vendorIndex],
      contract_value: baseValue,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      capacity: capacity,
      actual_consumption: actualConsumption,
      consumption_percentage: consumptionPercentage,
      total_committed_value: totalCommittedValue,
      total_committed_quantity: totalCommittedQuantity,
      po_total_value: poTotalValue,
      po_total_quantity: poTotalQuantity,
      absorption_percentage: absorptionPercentage,
      unit_of_measure: units[unitIndex],
      penalty_clauses: penaltyClauses,
      status: status,
      category: categories[categoryIndex],
      created_at: startDate.toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  return contracts;
};

const generateComplianceIssues = (): ContractComplianceIssue[] => {
  const issueTypes = ['late_delivery', 'quality_defect', 'sla_breach', 'volume_shortfall', 'documentation_missing'];
  const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
  const statuses: Array<'open' | 'under_review' | 'resolved'> = ['open', 'under_review', 'resolved'];

  const issues: ContractComplianceIssue[] = [];

  for (let i = 1; i <= 25; i++) {
    const contractNum = (i % 62) + 1;
    const issueTypeIndex = (i - 1) % issueTypes.length;
    const severityIndex = i % 4;
    const statusIndex = i % 3;

    const descriptions: Record<string, string> = {
      late_delivery: `Delivery delayed by ${3 + (i % 15)} days, triggering penalty clause`,
      quality_defect: `Quality defect rate of ${2 + (i % 5)}% detected in shipment`,
      sla_breach: `Service response time exceeded SLA by ${1 + (i % 10)} hours`,
      volume_shortfall: `Delivered volume ${70 + (i % 15)}% of committed amount`,
      documentation_missing: 'Required compliance documentation not submitted on time'
    };

    const daysAgo = i * 2;
    const detectedDate = new Date();
    detectedDate.setDate(detectedDate.getDate() - daysAgo);

    issues.push({
      id: i.toString(),
      organization_id: 'indonesia-power',
      contract_id: `CNT-${contractNum <= 30 ? '2023' : '2024'}-${String(contractNum).padStart(3, '0')}`,
      issue_type: issueTypes[issueTypeIndex],
      severity: severities[severityIndex],
      description: descriptions[issueTypes[issueTypeIndex]],
      financial_impact: 100000000 * (i * (severityIndex + 1)),
      detected_date: detectedDate.toISOString().split('T')[0],
      status: statuses[statusIndex],
      created_at: detectedDate.toISOString()
    });
  }

  return issues;
};

const generateInsights = (): ContractInsight[] => {
  const insightTypes: Array<'penalty_calculation' | 'termination_analysis' | 'renewal_recommendation' | 'compliance_recommendation'> =
    ['penalty_calculation', 'termination_analysis', 'renewal_recommendation', 'compliance_recommendation'];
  const priorities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];

  const insights: ContractInsight[] = [];

  for (let i = 1; i <= 20; i++) {
    const contractNum = (i * 3) % 62 + 1;
    const insightTypeIndex = (i - 1) % insightTypes.length;
    const priorityIndex = i % 4;

    const titles: Record<string, string> = {
      penalty_calculation: `Penalty Assessment Required - Contract ${contractNum}`,
      termination_analysis: `Early Termination Analysis - Contract ${contractNum}`,
      renewal_recommendation: `Contract Renewal Recommendation - Contract ${contractNum}`,
      compliance_recommendation: `Compliance Improvement Plan - Contract ${contractNum}`
    };

    const descriptions: Record<string, string> = {
      penalty_calculation: 'Multiple delivery delays detected. Total penalty calculation: penalties may exceed maximum cap.',
      termination_analysis: 'Persistent performance issues. Consider termination clause activation and alternative sourcing.',
      renewal_recommendation: 'Contract expiring soon. Strong performance history suggests favorable renewal terms available.',
      compliance_recommendation: 'Documentation gaps identified. Implement stricter compliance tracking to avoid future penalties.'
    };

    const actionPlans: Record<string, any[]> = {
      penalty_calculation: [
        {
          step: 1,
          action: 'Verify delivery dates and penalties',
          details: 'Confirm actual delivery dates with logistics and calculate accumulated penalties',
          owner: 'Supply Chain Manager',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          step: 2,
          action: 'Issue penalty notice to vendor',
          details: 'Send formal penalty notice with detailed calculation breakdown',
          owner: 'Contract Manager',
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          step: 3,
          action: 'Negotiate resolution',
          details: 'Discuss penalty waiver options and performance improvement plan',
          owner: 'Procurement Director',
          deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ],
      termination_analysis: [
        {
          step: 1,
          action: 'Document performance issues',
          details: 'Compile comprehensive record of all breaches and performance failures',
          owner: 'Contract Manager',
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          step: 2,
          action: 'Legal review of termination clause',
          details: 'Review contract termination provisions and notice requirements',
          owner: 'Legal Team',
          deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          step: 3,
          action: 'Identify alternative suppliers',
          details: 'Begin sourcing process for replacement vendor',
          owner: 'Sourcing Manager',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ],
      renewal_recommendation: [
        {
          step: 1,
          action: 'Review performance metrics',
          details: 'Analyze delivery times, quality scores, and overall satisfaction',
          owner: 'Procurement Manager',
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          step: 2,
          action: 'Negotiate renewal terms',
          details: 'Discuss pricing, volume commitments, and service improvements',
          owner: 'Contract Manager',
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          step: 3,
          action: 'Prepare renewal agreement',
          details: 'Draft updated contract with negotiated terms',
          owner: 'Legal Team',
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ],
      compliance_recommendation: [
        {
          step: 1,
          action: 'Audit compliance documentation',
          details: 'Identify all missing or incomplete compliance documents',
          owner: 'Compliance Officer',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          step: 2,
          action: 'Implement tracking system',
          details: 'Set up automated compliance deadline reminders and tracking',
          owner: 'IT Manager',
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          step: 3,
          action: 'Vendor compliance training',
          details: 'Conduct training session on compliance requirements',
          owner: 'Procurement Manager',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ]
    };

    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - (i * 2));

    insights.push({
      id: i.toString(),
      organization_id: 'indonesia-power',
      contract_id: `CNT-${contractNum <= 30 ? '2023' : '2024'}-${String(contractNum).padStart(3, '0')}`,
      insight_type: insightTypes[insightTypeIndex],
      title: titles[insightTypes[insightTypeIndex]],
      description: descriptions[insightTypes[insightTypeIndex]],
      action_plan: actionPlans[insightTypes[insightTypeIndex]],
      priority: priorities[priorityIndex],
      created_at: createdDate.toISOString()
    });
  }

  return insights;
};

export const mockContracts = generateContracts();
export const mockComplianceIssues = generateComplianceIssues();
export const mockInsights = generateInsights();
