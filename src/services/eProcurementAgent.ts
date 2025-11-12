import { EProcurementRequest } from './eProcurementRequestService';
import { SourcingEvent } from './sourcingEventService';
import { DocumentSubmission } from './documentSubmissionService';

export interface GeneratedSourcingEvent {
  title: string;
  material_ids: string[];
  demand_quantity: string;
  delivery_date: string;
  delivery_location: string;
  estimate_price: number;
  estimate_schedule: {
    document_submission_deadline: string;
    evaluation_period_start: string;
    evaluation_period_end: string;
    auction_date?: string;
    announcement_date: string;
  };
  shortlisted_vendors: string[];
  category: string;
  bundling_rationale: string;
}

export interface TenderDocumentContent {
  title: string;
  introduction: string;
  scope_of_work: string;
  technical_specifications: string;
  commercial_terms: string;
  submission_requirements: string;
  evaluation_criteria: string;
  terms_and_conditions: string;
  contact_information: string;
}

export interface DocumentScreeningResult {
  compliance_score: number;
  missing_items: string[];
  recommendations: string[];
  strengths: string[];
  risks: string[];
}

export interface AnnouncementContent {
  title: string;
  header: string;
  opener: string;
  body: string;
  closing: string;
}

export interface VendorScoringRecommendation {
  criteria_name: string;
  recommended_score: number;
  justification: string;
  confidence: number;
}

export interface TenderInsights {
  timeline_assessment: string;
  risk_factors: string[];
  vendor_pool_quality: string;
  budget_alignment: string;
  recommendations: string[];
}

export class EProcurementAgent {
  static async mockGenerateSourcingEvents(
    procurementRequests: EProcurementRequest[]
  ): Promise<GeneratedSourcingEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const categoryGroups = new Map<string, EProcurementRequest[]>();
    procurementRequests.forEach(req => {
      if (!categoryGroups.has(req.category)) {
        categoryGroups.set(req.category, []);
      }
      categoryGroups.get(req.category)!.push(req);
    });

    const sourcingEvents: GeneratedSourcingEvent[] = [];

    categoryGroups.forEach((requests, category) => {
      if (requests.length === 1) {
        const req = requests[0];
        sourcingEvents.push({
          title: req.title,
          material_ids: [req.id],
          demand_quantity: req.quantity || '1 unit',
          delivery_date: req.due_date,
          delivery_location: req.delivery_location || 'Main Warehouse',
          estimate_price: req.estimated_price || parseFloat(req.amount.replace(/[^0-9]/g, '')),
          estimate_schedule: this.generateSchedule(req.due_date),
          shortlisted_vendors: req.vendor ? [req.vendor] : this.getVendorsForCategory(category),
          category: category,
          bundling_rationale: 'Single procurement request - no bundling required'
        });
      } else {
        const totalQuantity = requests.map(r => parseInt(r.quantity || '1')).reduce((a, b) => a + b, 0);
        const earliestDate = requests.map(r => r.due_date).sort()[0];
        const totalPrice = requests.reduce((sum, r) => sum + (r.estimated_price || 0), 0);

        sourcingEvents.push({
          title: `${category} Bundle - ${requests.length} Items`,
          material_ids: requests.map(r => r.id),
          demand_quantity: `${totalQuantity} units`,
          delivery_date: earliestDate,
          delivery_location: requests[0].delivery_location || 'Main Warehouse',
          estimate_price: totalPrice,
          estimate_schedule: this.generateSchedule(earliestDate),
          shortlisted_vendors: this.getVendorsForCategory(category),
          category: category,
          bundling_rationale: `Bundled ${requests.length} ${category} requests for economies of scale and streamlined procurement. Estimated savings: 12-15%.`
        });
      }
    });

    return sourcingEvents;
  }

  private static generateSchedule(deliveryDate: string): any {
    const delivery = new Date(deliveryDate);
    const submissionDeadline = new Date(delivery);
    submissionDeadline.setDate(submissionDeadline.getDate() - 21);

    const evalStart = new Date(submissionDeadline);
    evalStart.setDate(evalStart.getDate() + 1);

    const evalEnd = new Date(evalStart);
    evalEnd.setDate(evalEnd.getDate() + 7);

    const auctionDate = new Date(evalEnd);
    auctionDate.setDate(auctionDate.getDate() + 2);

    const announcementDate = new Date(auctionDate);
    announcementDate.setDate(announcementDate.getDate() + 3);

    return {
      document_submission_deadline: submissionDeadline.toISOString().split('T')[0],
      evaluation_period_start: evalStart.toISOString().split('T')[0],
      evaluation_period_end: evalEnd.toISOString().split('T')[0],
      auction_date: auctionDate.toISOString().split('T')[0],
      announcement_date: announcementDate.toISOString().split('T')[0]
    };
  }

  private static getVendorsForCategory(category: string): string[] {
    const vendorDatabase: { [key: string]: string[] } = {
      'Engine Parts': ['Honda Motor Co., Ltd.', 'PT Astra Honda Motor', 'PT Yamaha Indonesia Motor'],
      'Frame & Chassis': ['PT Krakatau Steel', 'PT Gunung Steel', 'PT BlueScope Steel Indonesia'],
      'Electronics': ['PT Denso Indonesia', 'PT Astra Otoparts', 'PT Bosch Indonesia'],
      'Brake System': ['PT Nissin Brake Indonesia', 'PT Akebono Brake', 'PT Federal Mogul'],
      'Wheels & Tires': ['PT Bridgestone Tire Indonesia', 'PT Gajah Tunggal', 'PT Goodyear Indonesia'],
      'Suspension': ['PT Showa Indonesia', 'PT Kayaba Indonesia', 'PT KYB Indonesia']
    };

    return vendorDatabase[category] || ['PT Vendor A', 'PT Vendor B', 'PT Vendor C'];
  }

  static async mockReadTenderDocuments(
    uploadedFiles: { name: string; type: string }[]
  ): Promise<{
    extracted_requirements: string[];
    key_terms: string[];
    specifications: string[];
    compliance_standards: string[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      extracted_requirements: [
        'ISO 9001:2015 certification required',
        'Minimum 5 years industry experience',
        'Delivery within 30 days of PO',
        'Warranty period: 12 months',
        'Payment terms: Net 30 days'
      ],
      key_terms: [
        'Quality assurance standards',
        'Delivery schedule commitment',
        'Penalty clauses for delays',
        'Force majeure provisions',
        'Intellectual property rights'
      ],
      specifications: [
        'Material grade: AISI 304 stainless steel',
        'Tolerance: ±0.05mm',
        'Surface finish: Ra 0.8μm',
        'Testing requirements: 100% visual inspection',
        'Packaging: Individual protective wrapping'
      ],
      compliance_standards: [
        'ISO 9001:2015 Quality Management',
        'ISO 14001:2015 Environmental Management',
        'OHSAS 18001 Occupational Health and Safety',
        'SNI (Indonesian National Standard) compliance'
      ]
    };
  }

  static async mockGenerateTenderDocument(
    sourcingEvent: SourcingEvent,
    extractedData?: any
  ): Promise<TenderDocumentContent> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      title: `Tender Document - ${sourcingEvent.title}`,
      introduction: `This tender invitation is issued for the procurement of ${sourcingEvent.title}. The purpose is to select a qualified vendor capable of supplying high-quality products that meet our technical and commercial requirements.`,
      scope_of_work: `The vendor shall supply ${sourcingEvent.demand_quantity} of specified materials to be delivered to ${sourcingEvent.delivery_location} by ${sourcingEvent.delivery_date}. All items must conform to the technical specifications outlined in this document.`,
      technical_specifications: extractedData?.specifications?.join('\n') || 'Technical specifications as per attached documents and industry standards.',
      commercial_terms: `Estimated contract value: Rp ${sourcingEvent.estimate_price?.toLocaleString('id-ID')}\nPayment terms: Net 30 days from invoice date\nDelivery terms: FOB destination\nWarranty: 12 months from acceptance`,
      submission_requirements: `Vendors must submit:\n1. Company profile and registration documents\n2. Technical proposal with detailed specifications\n3. Commercial proposal with pricing breakdown\n4. Quality certifications (ISO 9001, etc.)\n5. References from similar projects\n6. Financial statements (last 2 years)`,
      evaluation_criteria: `Technical Capability: 40%\nPrice Competitiveness: 30%\nDelivery Capability: 15%\nQuality Assurance: 10%\nAfter-sales Support: 5%`,
      terms_and_conditions: `1. This tender is subject to the company's standard terms and conditions\n2. The company reserves the right to accept or reject any bid\n3. Late submissions will not be accepted\n4. Vendors must maintain bid validity for 90 days\n5. Contract award is subject to management approval`,
      contact_information: `For queries, contact:\nProcurement Department\nEmail: procurement@company.com\nPhone: +62 21 1234 5678`
    };
  }

  static async mockScreenSubmission(
    submissions: DocumentSubmission[]
  ): Promise<DocumentScreeningResult> {
    await new Promise(resolve => setTimeout(resolve, 2500));

    const uploadedDocs = submissions.filter(s => s.file_path).length;
    const totalDocs = submissions.length;
    const compliance_score = Math.round((uploadedDocs / totalDocs) * 100);

    const missing_items: string[] = [];
    submissions.forEach(sub => {
      if (!sub.file_path) {
        missing_items.push(sub.section_name);
      }
    });

    return {
      compliance_score,
      missing_items,
      recommendations: [
        'Complete all mandatory sections before final submission',
        'Ensure all documents are clearly legible and properly signed',
        'Verify that technical specifications match tender requirements',
        'Include detailed pricing breakdown for transparency'
      ],
      strengths: [
        'Well-organized documentation structure',
        'Company certifications are up to date',
        'Clear technical specifications provided'
      ],
      risks: [
        missing_items.length > 0 ? 'Missing critical documents' : null,
        compliance_score < 70 ? 'Low completion rate may affect evaluation' : null
      ].filter(Boolean) as string[]
    };
  }

  static async mockGenerateAnnouncement(
    sourcingEvent: SourcingEvent,
    type: 'tender' | 'winner'
  ): Promise<AnnouncementContent> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (type === 'tender') {
      return {
        title: `Tender Announcement: ${sourcingEvent.title}`,
        header: 'INVITATION TO TENDER',
        opener: `We are pleased to invite qualified vendors to participate in the tender for ${sourcingEvent.title}.`,
        body: `Tender Details:\n\nTender Reference: ${sourcingEvent.id}\nCategory: ${sourcingEvent.category}\nEstimated Value: Rp ${sourcingEvent.estimate_price?.toLocaleString('id-ID')}\nDelivery Location: ${sourcingEvent.delivery_location}\nRequired Delivery Date: ${sourcingEvent.delivery_date}\n\nQualification Requirements:\n- Proven track record in supplying similar products\n- Valid business licenses and certifications\n- Financial stability\n- Technical capability\n\nKey Dates:\n- Document Submission Deadline: ${(sourcingEvent.estimate_schedule as any)?.document_submission_deadline}\n- Reverse Auction: ${(sourcingEvent.estimate_schedule as any)?.auction_date}\n- Winner Announcement: ${(sourcingEvent.estimate_schedule as any)?.announcement_date}`,
        closing: 'Interested vendors are encouraged to register their interest and submit complete tender documents before the deadline. For further information, please contact our procurement department.'
      };
    } else {
      return {
        title: `Winner Announcement: ${sourcingEvent.title}`,
        header: 'TENDER RESULT ANNOUNCEMENT',
        opener: `We are pleased to announce the results of the tender for ${sourcingEvent.title}.`,
        body: `Following a comprehensive evaluation process, we have selected the winning vendor based on technical capability, price competitiveness, and overall proposal quality.\n\nThe selected vendor has demonstrated exceptional qualifications and commitment to meeting our requirements. We thank all participating vendors for their submissions and look forward to potential future collaborations.`,
        closing: 'The procurement process will proceed to contract negotiation and finalization. All participants will receive detailed feedback on their submissions upon request.'
      };
    }
  }

  static async mockScoreVendor(
    vendorId: string,
    criteria: string,
    submissions: DocumentSubmission[]
  ): Promise<VendorScoringRecommendation> {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const criteriaScoring: { [key: string]: { min: number; max: number; factors: string[] } } = {
      'Technical Capability': {
        min: 70,
        max: 95,
        factors: ['completeness of technical documents', 'certification validity', 'specification compliance']
      },
      'Price Competitiveness': {
        min: 65,
        max: 90,
        factors: ['price comparison with market rate', 'value for money', 'payment terms flexibility']
      },
      'Delivery Capability': {
        min: 75,
        max: 95,
        factors: ['proposed delivery schedule', 'logistics capability', 'track record']
      },
      'Quality Assurance': {
        min: 70,
        max: 95,
        factors: ['quality certifications', 'inspection procedures', 'warranty terms']
      },
      'After-sales Support': {
        min: 60,
        max: 85,
        factors: ['support infrastructure', 'response time commitment', 'spare parts availability']
      }
    };

    const config = criteriaScoring[criteria] || { min: 60, max: 90, factors: ['general assessment'] };
    const baseScore = config.min + Math.random() * (config.max - config.min);
    const completionBonus = (submissions.filter(s => s.file_path).length / submissions.length) * 10;
    const recommended_score = Math.min(100, Math.round(baseScore + completionBonus));

    return {
      criteria_name: criteria,
      recommended_score,
      justification: `Based on analysis of submitted documents, the vendor demonstrates strong performance in ${config.factors.join(', ')}. Document completion rate: ${Math.round((submissions.filter(s => s.file_path).length / submissions.length) * 100)}%. Score aligns with industry benchmarks for similar procurements.`,
      confidence: Math.round(85 + Math.random() * 10)
    };
  }

  static async mockGenerateInsights(
    sourcingEvent: SourcingEvent,
    submissions?: DocumentSubmission[]
  ): Promise<TenderInsights> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const today = new Date();
    const deliveryDate = new Date(sourcingEvent.delivery_date || today);
    const daysUntilDelivery = Math.floor((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const submissionCount = submissions?.length || 0;
    const uniqueVendors = new Set(submissions?.map(s => s.vendor_id)).size;

    return {
      timeline_assessment: daysUntilDelivery > 45
        ? 'Timeline is adequate for comprehensive evaluation and contract execution'
        : daysUntilDelivery > 21
        ? 'Timeline is tight but manageable - prioritize critical milestones'
        : 'Timeline is compressed - consider expedited evaluation process',
      risk_factors: [
        daysUntilDelivery < 30 ? 'Short delivery timeline may limit vendor pool' : null,
        uniqueVendors < 3 ? 'Limited vendor competition may affect pricing' : null,
        sourcingEvent.estimate_price && sourcingEvent.estimate_price > 5000000000 ? 'High-value procurement requires additional approval layers' : null,
        'Supply chain disruptions could impact delivery schedules',
        'Currency fluctuation may affect final pricing'
      ].filter(Boolean) as string[],
      vendor_pool_quality: uniqueVendors >= 5
        ? 'Excellent - Strong competition expected'
        : uniqueVendors >= 3
        ? 'Good - Adequate vendor participation'
        : 'Fair - May benefit from extended sourcing',
      budget_alignment: 'Estimated pricing is within budget parameters based on historical data',
      recommendations: [
        'Maintain regular communication with shortlisted vendors',
        'Schedule site visits for technical evaluation if required',
        'Prepare contract templates in advance to expedite award process',
        uniqueVendors < 3 ? 'Consider inviting additional qualified vendors' : 'Proceed with evaluation as planned',
        'Set up milestone tracking for critical delivery dates'
      ]
    };
  }
}
