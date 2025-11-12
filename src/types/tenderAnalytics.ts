export interface TenderBidder {
  id: string;
  name: string;
  quotedPrice: number;
  quotedUnitPrice: number;
  priceDifferencePercent: number;
  majorDifferenceDriver: string;
  costBreakdown: {
    accessories: number;
    oil: number;
    insulation: number;
    casing: number;
    coilPrimary: number;
    coilSecondary: number;
    core: number;
  };
}

export interface TenderDetail {
  id: string;
  name: string;
  title: string;
  status: string;
  participatingSuppliers: number;
  commercialEvaluationMethod: string;
  ownerEstimateDate: string;
  quotationInputDate: string;
  productSpecification: string;
  estimatedPrice: number;
  estimatedUnitPrice: number;
  orderQuantity: number;
  bidders: TenderBidder[];
  estimatedCostBreakdown: {
    accessories: number;
    oil: number;
    insulation: number;
    casing: number;
    coilPrimary: number;
    coilSecondary: number;
    core: number;
  };
}

export interface EvaluationCriteria {
  name: string;
  weight: number;
  description: string;
}

export interface BidderEvaluation {
  bidderId: string;
  bidderName: string;
  criteriaScores: {
    criteriaName: string;
    score: number;
    maxScore: number;
  }[];
  totalScore: number;
  weightedScore: number;
}

export interface SourcingSummary {
  tenderTimeline: {
    phase: string;
    date: string;
    status: 'completed' | 'in-progress' | 'pending';
  }[];
  participationStats: {
    invitedVendors: number;
    respondedVendors: number;
    qualifiedVendors: number;
  };
  recommendation: {
    recommendedBidder: string;
    reason: string;
    estimatedSavings: number;
  };
}

export interface CostComponentData {
  component: string;
  estimated: number;
  cherryPick: number;
  schneiderElectric: number;
  generalElectric: number;
  abb: number;
}

export interface NegotiationData {
  component: string;
  estimated: number;
  cherryPick: number;
  negotiationOpportunity: number;
  supplierPrice: number;
  potentialSavings: number;
  savingsPercentage: number;
}

export interface EvaluationData {
  costComponents: CostComponentData[];
  negotiationData: NegotiationData[];
  iterations: string[];
  variants: string[];
  suppliers: string[];
}
