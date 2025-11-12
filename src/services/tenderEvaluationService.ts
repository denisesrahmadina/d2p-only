import mockData from '../data/eprocurementMockData.json';

export interface TenderEvaluation {
  id?: string;
  sourcing_event_id: string;
  vendor_id: string;
  criteria_name: string;
  ai_score?: number;
  manual_score?: number;
  weight: number;
  justification?: string;
  scored_by?: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface VendorEvaluationSummary {
  vendor_id: string;
  vendor_name?: string;
  total_score: number;
  weighted_score: number;
  evaluations: TenderEvaluation[];
}

export class TenderEvaluationService {
  private static getMockEvaluations(): TenderEvaluation[] {
    return mockData.tenderEvaluations as TenderEvaluation[];
  }

  static async getEvaluationsByEvent(sourcingEventId: string): Promise<TenderEvaluation[]> {
    const evaluations = this.getMockEvaluations();
    return evaluations.filter(e => e.sourcing_event_id === sourcingEventId);
  }

  static async getEvaluationsByVendor(
    sourcingEventId: string,
    vendorId: string
  ): Promise<TenderEvaluation[]> {
    const evaluations = await this.getEvaluationsByEvent(sourcingEventId);
    return evaluations.filter(e => e.vendor_id === vendorId);
  }

  static async createEvaluation(
    evaluation: Omit<TenderEvaluation, 'id' | 'created_at' | 'updated_at'>
  ): Promise<TenderEvaluation> {
    const newEval: TenderEvaluation = {
      ...evaluation,
      id: `EVAL-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newEval;
  }

  static async updateEvaluation(
    id: string,
    updates: Partial<TenderEvaluation>
  ): Promise<TenderEvaluation> {
    const evaluations = this.getMockEvaluations();
    const existing = evaluations.find(e => e.id === id);
    if (!existing) throw new Error('Evaluation not found');
    return { ...existing, ...updates, updated_at: new Date().toISOString() };
  }

  static async upsertEvaluation(
    sourcingEventId: string,
    vendorId: string,
    criteriaName: string,
    evaluation: Partial<TenderEvaluation>
  ): Promise<TenderEvaluation> {
    const newEval: TenderEvaluation = {
      sourcing_event_id: sourcingEventId,
      vendor_id: vendorId,
      criteria_name: criteriaName,
      weight: evaluation.weight || 0,
      organization_id: evaluation.organization_id || 'org-001',
      ...evaluation,
      id: `EVAL-${Date.now()}`,
      updated_at: new Date().toISOString()
    };
    return newEval;
  }

  static async batchCreateEvaluations(
    evaluations: Omit<TenderEvaluation, 'id' | 'created_at' | 'updated_at'>[]
  ): Promise<TenderEvaluation[]> {
    return evaluations.map(e => ({
      ...e,
      id: `EVAL-${Date.now()}-${Math.random()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  }

  static async calculateVendorScores(sourcingEventId: string): Promise<VendorEvaluationSummary[]> {
    const evaluations = await this.getEvaluationsByEvent(sourcingEventId);

    const vendorMap = new Map<string, TenderEvaluation[]>();
    evaluations.forEach(evaluation => {
      if (!vendorMap.has(evaluation.vendor_id)) {
        vendorMap.set(evaluation.vendor_id, []);
      }
      vendorMap.get(evaluation.vendor_id)!.push(evaluation);
    });

    const summaries: VendorEvaluationSummary[] = [];
    vendorMap.forEach((evals, vendorId) => {
      const finalScores = evals.map(e =>
        e.manual_score !== null && e.manual_score !== undefined ? e.manual_score : e.ai_score || 0
      );
      const weights = evals.map(e => e.weight);

      const totalScore = finalScores.reduce((sum, score) => sum + score, 0);
      const weightedScore = finalScores.reduce((sum, score, idx) => sum + (score * weights[idx]), 0);

      summaries.push({
        vendor_id: vendorId,
        total_score: Math.round(totalScore * 100) / 100,
        weighted_score: Math.round(weightedScore * 100) / 100,
        evaluations: evals
      });
    });

    return summaries.sort((a, b) => b.weighted_score - a.weighted_score);
  }

  static getDefaultScoringCriteria() {
    return [
      {
        name: 'Price Competitiveness',
        weight: 0.30,
        description: 'Competitive pricing compared to market rates and budget allocation',
        minScore: 0,
        maxScore: 100,
        aiRecommendedRange: '75-95'
      },
      {
        name: 'Technical Capability',
        weight: 0.25,
        description: 'Technical expertise, certifications, and ability to meet specifications',
        minScore: 0,
        maxScore: 100,
        aiRecommendedRange: '70-90'
      },
      {
        name: 'Delivery Timeline',
        weight: 0.20,
        description: 'Realistic delivery schedule and track record of on-time delivery',
        minScore: 0,
        maxScore: 100,
        aiRecommendedRange: '80-95'
      },
      {
        name: 'Quality Standards',
        weight: 0.15,
        description: 'Quality certifications, QC processes, and historical quality performance',
        minScore: 0,
        maxScore: 100,
        aiRecommendedRange: '75-92'
      },
      {
        name: 'Company Experience',
        weight: 0.10,
        description: 'Years in business, similar project experience, and client references',
        minScore: 0,
        maxScore: 100,
        aiRecommendedRange: '65-85'
      }
    ];
  }

  static generateAIScores(
    sourcingEventId: string,
    vendorId: string,
    organizationId: string
  ): Omit<TenderEvaluation, 'id' | 'created_at' | 'updated_at'>[] {
    const criteria = this.getDefaultScoringCriteria();

    return criteria.map(c => ({
      sourcing_event_id: sourcingEventId,
      vendor_id: vendorId,
      criteria_name: c.name,
      ai_score: Math.round((75 + Math.random() * 20) * 10) / 10,
      weight: c.weight,
      justification: `AI-analyzed based on ${c.description.toLowerCase()}`,
      organization_id: organizationId
    }));
  }

  static generateAIScoreRecommendation(
    vendorId: string,
    criteriaName: string,
    sourcingEventId?: string
  ): { score: number; confidence: number; justification: string } {
    const criteria = this.getDefaultScoringCriteria();
    const criterion = criteria.find(c => c.name === criteriaName);

    if (!criterion) {
      return {
        score: 75,
        confidence: 50,
        justification: 'No specific criteria found'
      };
    }

    const hash = vendorId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seedValue = (hash % 100) / 100;

    const [minRange, maxRange] = criterion.aiRecommendedRange.split('-').map(Number);
    const rangeSpread = maxRange - minRange;
    const baseScore = minRange + (seedValue * rangeSpread);
    const variance = (Math.random() - 0.5) * 5;
    const finalScore = Math.max(criterion.minScore, Math.min(criterion.maxScore, baseScore + variance));

    const confidence = 70 + Math.random() * 25;

    const justifications = {
      'Price Competitiveness': [
        'Historical pricing data indicates strong competitive positioning',
        'Market analysis shows favorable pricing compared to industry benchmarks',
        'Budget alignment analysis suggests optimal value proposition',
        'Cost structure review reveals efficient pricing model'
      ],
      'Technical Capability': [
        'Technical documentation demonstrates strong capability alignment',
        'Certification portfolio indicates comprehensive technical expertise',
        'Past project complexity matches current requirements',
        'Team composition shows appropriate technical skills'
      ],
      'Delivery Timeline': [
        'Historical delivery performance shows consistent on-time completion',
        'Resource allocation plan indicates realistic timeline commitment',
        'Project schedule analysis reveals feasible delivery approach',
        'Past performance data suggests reliable delivery capability'
      ],
      'Quality Standards': [
        'Quality certifications meet or exceed requirements',
        'QC process documentation demonstrates robust quality management',
        'Historical quality metrics indicate strong performance',
        'Industry compliance records show consistent quality standards'
      ],
      'Company Experience': [
        'Years in operation demonstrate market stability',
        'Portfolio of similar projects shows relevant experience',
        'Client references indicate strong track record',
        'Industry presence suggests established expertise'
      ]
    };

    const criteriaJustifications = justifications[criteriaName as keyof typeof justifications] || [
      'Analysis based on available vendor data and historical performance'
    ];

    const randomJustification = criteriaJustifications[
      Math.floor((hash % criteriaJustifications.length))
    ];

    return {
      score: Math.round(finalScore * 10) / 10,
      confidence: Math.round(confidence * 10) / 10,
      justification: randomJustification
    };
  }
}

export interface WinnerSelection {
  id?: string;
  sourcing_event_id: string;
  winner_vendor_id: string;
  total_score: number;
  weighted_score: number;
  selection_date: string;
  selected_by?: string;
  justification?: string;
  status: string;
  approval_status?: string;
  submitted_by?: string;
  submission_date?: string;
  approved_by?: string;
  approval_date?: string;
  rejection_reason?: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export class WinnerSelectionService {
  private static getMockWinners(): WinnerSelection[] {
    return (mockData.winnerSelections || []) as WinnerSelection[];
  }

  static async selectWinner(
    winner: Omit<WinnerSelection, 'id' | 'created_at' | 'updated_at'>
  ): Promise<WinnerSelection> {
    const newWinner: WinnerSelection = {
      ...winner,
      id: `WIN-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newWinner;
  }

  static async submitForApproval(
    sourcingEventId: string,
    winnerVendorId: string,
    totalScore: number,
    weightedScore: number,
    justification: string,
    submittedBy: string,
    organizationId: string
  ): Promise<WinnerSelection> {
    const winner = {
      id: `WIN-${Date.now()}`,
      sourcing_event_id: sourcingEventId,
      winner_vendor_id: winnerVendorId,
      total_score: totalScore,
      weighted_score: weightedScore,
      selection_date: new Date().toISOString().split('T')[0],
      justification,
      status: 'Selected',
      approval_status: 'Pending Approval',
      submitted_by: submittedBy,
      submission_date: new Date().toISOString(),
      organization_id: organizationId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return winner;
  }

  static async approveWinner(
    id: string,
    approvedBy: string
  ): Promise<WinnerSelection> {
    const winners = this.getMockWinners();
    const existing = winners.find(w => w.id === id);
    if (!existing) throw new Error('Winner selection not found');
    return {
      ...existing,
      approval_status: 'Approved',
      approved_by: approvedBy,
      approval_date: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  static async rejectWinner(
    id: string,
    rejectedBy: string,
    rejectionReason: string
  ): Promise<WinnerSelection> {
    const winners = this.getMockWinners();
    const existing = winners.find(w => w.id === id);
    if (!existing) throw new Error('Winner selection not found');
    return {
      ...existing,
      approval_status: 'Rejected',
      approved_by: rejectedBy,
      approval_date: new Date().toISOString(),
      rejection_reason: rejectionReason,
      updated_at: new Date().toISOString()
    };
  }

  static async getPendingApprovals(organizationId: string): Promise<WinnerSelection[]> {
    const winners = this.getMockWinners();
    return winners.filter(
      w => w.organization_id === organizationId && w.approval_status === 'Pending Approval'
    );
  }

  static async getWinnerByEvent(sourcingEventId: string): Promise<WinnerSelection | null> {
    const winners = this.getMockWinners();
    return winners.find(w => w.sourcing_event_id === sourcingEventId) || null;
  }

  static async updateWinner(
    id: string,
    updates: Partial<WinnerSelection>
  ): Promise<WinnerSelection> {
    const winners = this.getMockWinners();
    const existing = winners.find(w => w.id === id);
    if (!existing) throw new Error('Winner selection not found');
    return { ...existing, ...updates, updated_at: new Date().toISOString() };
  }
}
