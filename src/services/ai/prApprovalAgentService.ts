import { ProcurementRequest } from '../../types/marketplace';

export interface ApprovalRecommendation {
  action: 'approve' | 'reject' | 'review';
  confidence: number;
  reasoning: string[];
  risk_factors: string[];
  compliance_checks: ComplianceCheck[];
}

export interface ComplianceCheck {
  check_name: string;
  status: 'passed' | 'failed' | 'warning';
  details: string;
}

export class PRApprovalAgentService {
  static async analyzeForApproval(
    pr: ProcurementRequest,
    userBudget?: number,
    historicalData?: ProcurementRequest[]
  ): Promise<ApprovalRecommendation> {
    const reasoning: string[] = [];
    const riskFactors: string[] = [];
    const complianceChecks: ComplianceCheck[] = [];
    let score = 50;

    complianceChecks.push({
      check_name: 'PR Format Validation',
      status: pr.pr_number && pr.pr_date ? 'passed' : 'failed',
      details: pr.pr_number && pr.pr_date
        ? 'All required fields present'
        : 'Missing required fields'
    });

    if (pr.pr_number && pr.pr_date) {
      score += 10;
      reasoning.push('All mandatory fields completed correctly');
    }

    if (pr.demand_qty > 0 && pr.unit_price > 0) {
      score += 15;
      reasoning.push('Valid quantities and pricing information');

      complianceChecks.push({
        check_name: 'Pricing Validation',
        status: 'passed',
        details: `Unit price: ${pr.currency} ${pr.unit_price.toLocaleString()}`
      });
    }

    if (userBudget && pr.pr_value > userBudget) {
      score -= 30;
      riskFactors.push(`Value exceeds allocated budget by ${pr.currency} ${(pr.pr_value - userBudget).toLocaleString()}`);

      complianceChecks.push({
        check_name: 'Budget Compliance',
        status: 'failed',
        details: `PR value ${pr.currency} ${pr.pr_value.toLocaleString()} exceeds budget ${pr.currency} ${userBudget.toLocaleString()}`
      });
    } else if (userBudget) {
      score += 20;
      reasoning.push('Within allocated budget limits');

      complianceChecks.push({
        check_name: 'Budget Compliance',
        status: 'passed',
        details: `Within budget: ${Math.round((pr.pr_value / userBudget) * 100)}% of allocation`
      });
    }

    if (historicalData && historicalData.length > 0) {
      const similarPRs = historicalData.filter(
        h => h.material_id === pr.material_id && h.pr_status === 'Completed'
      );

      if (similarPRs.length > 0) {
        const avgPrice = similarPRs.reduce((sum, p) => sum + p.unit_price, 0) / similarPRs.length;
        const priceDiff = ((pr.unit_price - avgPrice) / avgPrice) * 100;

        if (Math.abs(priceDiff) <= 10) {
          score += 15;
          reasoning.push('Pricing consistent with historical purchases');

          complianceChecks.push({
            check_name: 'Historical Price Comparison',
            status: 'passed',
            details: `Within ±10% of average historical price`
          });
        } else if (priceDiff > 10) {
          score -= 15;
          riskFactors.push(`Price ${Math.round(priceDiff)}% higher than historical average`);

          complianceChecks.push({
            check_name: 'Historical Price Comparison',
            status: 'warning',
            details: `${Math.round(priceDiff)}% above historical average - review recommended`
          });
        } else {
          score += 10;
          reasoning.push(`Favorable pricing: ${Math.abs(Math.round(priceDiff))}% below historical average`);

          complianceChecks.push({
            check_name: 'Historical Price Comparison',
            status: 'passed',
            details: `${Math.abs(Math.round(priceDiff))}% below historical average`
          });
        }
      }
    }

    const requirementDate = pr.requirement_date ? new Date(pr.requirement_date) : null;
    if (requirementDate) {
      const daysUntilRequired = Math.floor((requirementDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

      if (daysUntilRequired < 7) {
        score -= 10;
        riskFactors.push('Urgent request with short lead time may incur premium costs');

        complianceChecks.push({
          check_name: 'Lead Time Analysis',
          status: 'warning',
          details: `Only ${daysUntilRequired} days until required - expedited shipping may be needed`
        });
      } else if (daysUntilRequired > 30) {
        score += 10;
        reasoning.push('Adequate lead time allows for optimal vendor selection');

        complianceChecks.push({
          check_name: 'Lead Time Analysis',
          status: 'passed',
          details: `${daysUntilRequired} days lead time allows for standard procurement`
        });
      }
    }

    if (pr.vendor_id) {
      score += 10;
      reasoning.push('Vendor pre-selected, expediting procurement process');

      complianceChecks.push({
        check_name: 'Vendor Selection',
        status: 'passed',
        details: 'Approved vendor identified'
      });
    }

    let action: 'approve' | 'reject' | 'review' = 'review';
    if (score >= 70) {
      action = 'approve';
      reasoning.push('Strong justification for approval based on multiple criteria');
    } else if (score < 40) {
      action = 'reject';
      reasoning.push('Significant concerns require addressing before approval');
    } else {
      reasoning.push('Mixed indicators suggest additional review by procurement manager');
    }

    const confidence = Math.min(Math.max(score / 100, 0.3), 0.95);

    return {
      action,
      confidence,
      reasoning,
      risk_factors: riskFactors,
      compliance_checks: complianceChecks
    };
  }

  static async suggestOptimalApprovalPath(
    prValue: number,
    organizationHierarchy?: any[]
  ): Promise<{
    approvers: Array<{ role: string; reason: string }>;
    estimated_time: string;
  }> {
    const approvers: Array<{ role: string; reason: string }> = [];

    if (prValue < 10000000) {
      approvers.push({
        role: 'Department Manager',
        reason: 'Standard approval authority for purchases under IDR 10M'
      });
    } else if (prValue < 50000000) {
      approvers.push({
        role: 'Department Manager',
        reason: 'Initial review and recommendation'
      });
      approvers.push({
        role: 'Finance Manager',
        reason: 'Budget verification for purchases IDR 10M-50M'
      });
    } else if (prValue < 100000000) {
      approvers.push({
        role: 'Department Manager',
        reason: 'Initial review and justification'
      });
      approvers.push({
        role: 'Finance Manager',
        reason: 'Budget and financial compliance check'
      });
      approvers.push({
        role: 'Director',
        reason: 'Executive approval required for purchases over IDR 50M'
      });
    } else {
      approvers.push({
        role: 'Department Manager',
        reason: 'Technical and operational justification'
      });
      approvers.push({
        role: 'Finance Manager',
        reason: 'Financial due diligence'
      });
      approvers.push({
        role: 'Director',
        reason: 'Executive review'
      });
      approvers.push({
        role: 'Board of Directors',
        reason: 'Strategic investment approval for purchases over IDR 100M'
      });
    }

    const estimatedDays = Math.ceil(approvers.length * 1.5);
    const estimated_time = `${estimatedDays} business day${estimatedDays > 1 ? 's' : ''}`;

    return {
      approvers,
      estimated_time
    };
  }
}
