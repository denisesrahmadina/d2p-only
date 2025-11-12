import { TenderDetail, BidderEvaluation, EvaluationCriteria, SourcingSummary, EvaluationData, CostComponentData, NegotiationData } from '../types/tenderAnalytics';

const mockTender6Data: TenderDetail = {
  id: '6',
  name: 'Distribution Transformer Tender 6',
  title: 'Distribution Transformer',
  status: 'On Progress',
  participatingSuppliers: 3,
  commercialEvaluationMethod: 'Lowest Price',
  ownerEstimateDate: '27 Oct 2021',
  quotationInputDate: '3 Nov 2021',
  productSpecification: 'Distribution Transformer - 20kV/400V DYN5',
  estimatedPrice: 771585,
  estimatedUnitPrice: 2204.53,
  orderQuantity: 350,
  estimatedCostBreakdown: {
    accessories: 95000,
    oil: 85000,
    insulation: 90000,
    casing: 110000,
    coilPrimary: 140000,
    coilSecondary: 135000,
    core: 116585,
  },
  bidders: [
    {
      id: 'schneider',
      name: 'Schneider Electric',
      quotedPrice: 806075,
      quotedUnitPrice: 2303.07,
      priceDifferencePercent: 4.47,
      majorDifferenceDriver: '26% Higher Oil Cost',
      costBreakdown: {
        accessories: 98000,
        oil: 107100,
        insulation: 92000,
        casing: 112000,
        coilPrimary: 145000,
        coilSecondary: 138000,
        core: 113975,
      },
    },
    {
      id: 'ge',
      name: 'General Electric',
      quotedPrice: 798080,
      quotedUnitPrice: 2280.23,
      priceDifferencePercent: 3.43,
      majorDifferenceDriver: '63% Higher Accessories Cost',
      costBreakdown: {
        accessories: 154850,
        oil: 87000,
        insulation: 88000,
        casing: 108000,
        coilPrimary: 138000,
        coilSecondary: 132000,
        core: 110230,
      },
    },
    {
      id: 'abb',
      name: 'ABB',
      quotedPrice: 769100,
      quotedUnitPrice: 2197.43,
      priceDifferencePercent: -0.32,
      majorDifferenceDriver: '5% Lower Core Cost',
      costBreakdown: {
        accessories: 93000,
        oil: 83000,
        insulation: 89000,
        casing: 109000,
        coilPrimary: 139000,
        coilSecondary: 134000,
        core: 123100,
      },
    },
  ],
};

const mockEvaluationCriteria: EvaluationCriteria[] = [
  { name: 'Price Competitiveness', weight: 0.4, description: 'Overall price compared to budget' },
  { name: 'Technical Compliance', weight: 0.3, description: 'Meets all technical specifications' },
  { name: 'Delivery Timeline', weight: 0.15, description: 'Proposed delivery schedule' },
  { name: 'Quality Certifications', weight: 0.15, description: 'ISO and industry certifications' },
];

const mockBidderEvaluations: BidderEvaluation[] = [
  {
    bidderId: 'abb',
    bidderName: 'ABB',
    criteriaScores: [
      { criteriaName: 'Price Competitiveness', score: 95, maxScore: 100 },
      { criteriaName: 'Technical Compliance', score: 92, maxScore: 100 },
      { criteriaName: 'Delivery Timeline', score: 88, maxScore: 100 },
      { criteriaName: 'Quality Certifications', score: 98, maxScore: 100 },
    ],
    totalScore: 373,
    weightedScore: 93.45,
  },
  {
    bidderId: 'schneider',
    bidderName: 'Schneider Electric',
    criteriaScores: [
      { criteriaName: 'Price Competitiveness', score: 82, maxScore: 100 },
      { criteriaName: 'Technical Compliance', score: 95, maxScore: 100 },
      { criteriaName: 'Delivery Timeline', score: 92, maxScore: 100 },
      { criteriaName: 'Quality Certifications', score: 96, maxScore: 100 },
    ],
    totalScore: 365,
    weightedScore: 89.25,
  },
  {
    bidderId: 'ge',
    bidderName: 'General Electric',
    criteriaScores: [
      { criteriaName: 'Price Competitiveness', score: 85, maxScore: 100 },
      { criteriaName: 'Technical Compliance', score: 90, maxScore: 100 },
      { criteriaName: 'Delivery Timeline', score: 85, maxScore: 100 },
      { criteriaName: 'Quality Certifications', score: 94, maxScore: 100 },
    ],
    totalScore: 354,
    weightedScore: 87.65,
  },
];

const mockSourcingSummary: SourcingSummary = {
  tenderTimeline: [
    { phase: 'Tender Created', date: '27 Oct 2021', status: 'completed' },
    { phase: 'Announcement Published', date: '28 Oct 2021', status: 'completed' },
    { phase: 'Bid Submission Period', date: '28 Oct - 3 Nov 2021', status: 'completed' },
    { phase: 'Bid Evaluation', date: '3 Nov 2021', status: 'in-progress' },
    { phase: 'Winner Selection', date: 'Pending', status: 'pending' },
    { phase: 'Contract Award', date: 'Pending', status: 'pending' },
  ],
  participationStats: {
    invitedVendors: 5,
    respondedVendors: 3,
    qualifiedVendors: 3,
  },
  recommendation: {
    recommendedBidder: 'ABB',
    reason: 'Lowest total cost with excellent technical compliance and quality certifications',
    estimatedSavings: 2485,
  },
};

const mockEvaluationData: EvaluationData = {
  costComponents: [
    {
      component: 'Accessories',
      estimated: 61726.80,
      cherryPick: 61109.53,
      schneiderElectric: 64536.40,
      generalElectric: 100412.84,
      abb: 61109.53,
    },
    {
      component: 'Oil',
      estimated: 100306.05,
      cherryPick: 97296.87,
      schneiderElectric: 126119.19,
      generalElectric: 97296.87,
      abb: 99302.99,
    },
    {
      component: 'Insulation',
      estimated: 30863.40,
      cherryPick: 30863.40,
      schneiderElectric: 32268.20,
      generalElectric: 30863.40,
      abb: 31480.67,
    },
    {
      component: 'Casing',
      estimated: 54010.95,
      cherryPick: 56711.50,
      schneiderElectric: 59412.05,
      generalElectric: 56711.50,
      abb: 62112.59,
    },
    {
      component: 'Coil - Primary',
      estimated: 69442.65,
      cherryPick: 65970.52,
      schneiderElectric: 65970.52,
      generalElectric: 68748.22,
      abb: 71525.93,
    },
    {
      component: 'Coil - Secondary',
      estimated: 69442.65,
      cherryPick: 65970.52,
      schneiderElectric: 68748.22,
      generalElectric: 65970.52,
      abb: 77065.41,
    },
    {
      component: 'Core',
      estimated: 385792.50,
      cherryPick: 366502.88,
      schneiderElectric: 389650.43,
      generalElectric: 378076.65,
      abb: 366502.88,
    },
  ],
  negotiationData: [
    {
      component: 'Oil',
      estimated: 100306.05,
      cherryPick: 97296.87,
      negotiationOpportunity: 97296.87,
      supplierPrice: 126119.19,
      potentialSavings: 28822.32,
      savingsPercentage: 3.57,
    },
    {
      component: 'Core',
      estimated: 385792.50,
      cherryPick: 366502.88,
      negotiationOpportunity: 366502.88,
      supplierPrice: 389650.43,
      potentialSavings: 23147.55,
      savingsPercentage: 2.87,
    },
    {
      component: 'Casing',
      estimated: 54010.95,
      cherryPick: 56711.50,
      negotiationOpportunity: 54010.95,
      supplierPrice: 59412.05,
      potentialSavings: 5401.10,
      savingsPercentage: 0.67,
    },
    {
      component: 'Accessories',
      estimated: 61726.80,
      cherryPick: 61109.53,
      negotiationOpportunity: 61109.53,
      supplierPrice: 64536.40,
      potentialSavings: 3426.87,
      savingsPercentage: 0.42,
    },
    {
      component: 'Coil - Secondary',
      estimated: 69442.65,
      cherryPick: 65970.52,
      negotiationOpportunity: 65970.52,
      supplierPrice: 68748.22,
      potentialSavings: 2777.71,
      savingsPercentage: 0.34,
    },
    {
      component: 'Insulation',
      estimated: 30863.40,
      cherryPick: 30863.40,
      negotiationOpportunity: 30863.40,
      supplierPrice: 32268.20,
      potentialSavings: 1404.80,
      savingsPercentage: 0.17,
    },
    {
      component: 'Coil - Primary',
      estimated: 69442.65,
      cherryPick: 65970.52,
      negotiationOpportunity: 65970.52,
      supplierPrice: 65970.52,
      potentialSavings: 0,
      savingsPercentage: 0.00,
    },
  ],
  iterations: ['1', '2', '3'],
  variants: ['20kV/400V 3P 200kVA', '20kV/400V DYN5', '25kV/400V 3P 250kVA'],
  suppliers: ['All', 'Schneider Electric', 'General Electric', 'ABB'],
};

export const tenderAnalyticsService = {
  getTenderDetail: async (tenderId: string): Promise<TenderDetail | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (tenderId === '6') {
      return mockTender6Data;
    }
    return null;
  },

  getEvaluationCriteria: async (tenderId: string): Promise<EvaluationCriteria[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (tenderId === '6') {
      return mockEvaluationCriteria;
    }
    return [];
  },

  getBidderEvaluations: async (tenderId: string): Promise<BidderEvaluation[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (tenderId === '6') {
      return mockBidderEvaluations;
    }
    return [];
  },

  getSourcingSummary: async (tenderId: string): Promise<SourcingSummary | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (tenderId === '6') {
      return mockSourcingSummary;
    }
    return null;
  },

  getEvaluationData: async (tenderId: string): Promise<EvaluationData | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (tenderId === '6') {
      return mockEvaluationData;
    }
    return null;
  },
};
