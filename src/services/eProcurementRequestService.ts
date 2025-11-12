import mockData from '../data/eprocurementMockData.json';

export interface EProcurementRequest {
  id: string;
  title: string;
  category: string;
  requestor: string;
  amount: string;
  status: 'Pending Approval' | 'Approved' | 'In Procurement' | 'Completed' | 'Rejected';
  priority: 'high' | 'medium' | 'low';
  due_date: string;
  description?: string;
  vendor?: string;
  quantity?: string;
  related_model?: string;
  delivery_location?: string;
  estimated_price?: number;
  image_url?: string;
  ai_insights?: {
    market_analysis?: string;
    cost_optimization?: string;
    vendor_recommendations?: string;
    bundling_opportunity?: string;
    risk_assessment?: string;
  };
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface DBProcurementRequest {
  pr_id?: number;
  pr_number: string;
  pr_line_number: number;
  pr_type: string;
  pr_status: string;
  pr_date: string;
  material_id: string;
  vendor_id: string | null;
  unit_requestor_id: string;
  requirement_date: string;
  delivery_date: string;
  demand_qty: number;
  qty_ordered: number;
  unit_price: number;
  pr_value: number;
  currency: string;
  created_date: string;
  image_url?: string;
  ai_insights?: any;
}

export class EProcurementRequestService {
  private static getMockData(): DBProcurementRequest[] {
    return mockData.procurementRequests as DBProcurementRequest[];
  }

  private static mapDBToRequest(dbRecord: DBProcurementRequest): EProcurementRequest {
    const statusMap: { [key: string]: EProcurementRequest['status'] } = {
      'APPROVED': 'Approved',
      'ORDERED': 'In Procurement',
      'DELIVERED': 'Completed',
      'PENDING': 'Pending Approval',
      'REJECTED': 'Rejected'
    };

    const prValue = parseFloat(String(dbRecord.pr_value));
    const formattedAmount = `Rp ${prValue.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;

    const priority = prValue > 1000000000 ? 'high' : prValue > 500000000 ? 'medium' : 'low';

    const category = this.getCategoryFromMaterialId(dbRecord.material_id);

    return {
      id: `${dbRecord.pr_number}-${dbRecord.pr_line_number}`,
      title: `${category} - ${dbRecord.material_id}`,
      category,
      requestor: dbRecord.unit_requestor_id || 'Unknown',
      amount: formattedAmount,
      status: statusMap[dbRecord.pr_status] || 'Pending Approval',
      priority: priority as 'high' | 'medium' | 'low',
      due_date: dbRecord.requirement_date,
      description: `Procurement request for ${category}. Material ID: ${dbRecord.material_id}. Quantity: ${dbRecord.demand_qty} units.`,
      vendor: dbRecord.vendor_id || undefined,
      quantity: `${dbRecord.demand_qty} units`,
      delivery_location: 'Warehouse',
      estimated_price: prValue,
      image_url: dbRecord.image_url,
      ai_insights: dbRecord.ai_insights || this.generateAIInsightsFromDB(dbRecord),
      created_at: dbRecord.created_date,
      updated_at: dbRecord.created_date
    };
  }

  private static getCategoryFromMaterialId(materialId: string): string {
    const categories = [
      'Engine Parts',
      'Frame & Chassis',
      'Electronics',
      'Brake System',
      'Wheels & Tires',
      'Suspension',
      'Transmission',
      'Body Parts',
      'Interior Components',
      'Lighting System',
      'Renewable Energy',
      'Energy Storage',
      'Equipment'
    ];

    const hash = materialId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return categories[hash % categories.length];
  }

  private static generateAIInsightsFromDB(dbRecord: DBProcurementRequest): EProcurementRequest['ai_insights'] {
    const prValue = parseFloat(String(dbRecord.pr_value));
    const insights: EProcurementRequest['ai_insights'] = {};

    if (prValue > 1000000000) {
      insights.cost_optimization = `High-value procurement (${prValue.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}). Consider volume discounts and long-term contracts for savings.`;
      insights.risk_assessment = 'High-value procurement requires executive approval and detailed risk assessment.';
    } else if (prValue > 500000000) {
      insights.cost_optimization = `Medium-value procurement. Explore bundling opportunities with similar requests.`;
    }

    const category = this.getCategoryFromMaterialId(dbRecord.material_id);
    insights.market_analysis = `Current market conditions favor ${category} procurement. Lead time: ${this.estimateLeadTime(category)} days.`;

    if (dbRecord.vendor_id) {
      insights.vendor_recommendations = `Suggested vendor: ${dbRecord.vendor_id}. Historical performance: Good. Average delivery time: 15-20 days.`;
    } else {
      insights.vendor_recommendations = `3-5 qualified vendors available for ${category}. Competitive bidding recommended.`;
    }

    insights.bundling_opportunity = `Can be bundled with similar ${category} requests for 12-15% cost savings.`;

    return insights;
  }

  static async getAllRequests(organizationId?: string): Promise<EProcurementRequest[]> {
    const mockRequests = this.getMockData();
    return mockRequests.map(record => this.mapDBToRequest(record));
  }

  static async getRequestById(id: string): Promise<EProcurementRequest | null> {
    const [prNumber, prLine] = id.split('-');
    const prLineNumber = parseInt(prLine);

    const mockRequests = this.getMockData();
    const record = mockRequests.find(
      r => r.pr_number === prNumber && r.pr_line_number === prLineNumber
    );

    return record ? this.mapDBToRequest(record) : null;
  }

  static async getRequestsByStatus(
    organizationId: string,
    status: string
  ): Promise<EProcurementRequest[]> {
    const dbStatus = status === 'Approved' ? 'APPROVED' :
                     status === 'In Procurement' ? 'ORDERED' :
                     status === 'Completed' ? 'DELIVERED' :
                     status === 'Pending Approval' ? 'PENDING' :
                     status === 'Rejected' ? 'REJECTED' : status.toUpperCase();

    const mockRequests = this.getMockData();
    const filtered = mockRequests.filter(r => r.pr_status === dbStatus);
    return filtered.map(record => this.mapDBToRequest(record));
  }

  static async getRequestsByPriority(
    organizationId: string,
    priority: string
  ): Promise<EProcurementRequest[]> {
    const allRequests = await this.getAllRequests(organizationId);
    return allRequests.filter(req => req.priority === priority);
  }

  static async createRequest(request: Omit<EProcurementRequest, 'created_at' | 'updated_at'>): Promise<EProcurementRequest> {
    return { ...request, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as EProcurementRequest;
  }

  static async updateRequest(id: string, updates: Partial<EProcurementRequest>): Promise<EProcurementRequest> {
    const existing = await this.getRequestById(id);
    if (!existing) throw new Error('Request not found');
    return { ...existing, ...updates, updated_at: new Date().toISOString() };
  }

  static async deleteRequest(id: string): Promise<void> {
    return;
  }

  static async searchRequests(organizationId: string, query: string): Promise<EProcurementRequest[]> {
    const allRequests = await this.getAllRequests(organizationId);
    const lowercaseQuery = query.toLowerCase();

    return allRequests.filter(req =>
      req.title.toLowerCase().includes(lowercaseQuery) ||
      req.category.toLowerCase().includes(lowercaseQuery) ||
      req.requestor.toLowerCase().includes(lowercaseQuery) ||
      req.id.toLowerCase().includes(lowercaseQuery) ||
      (req.vendor && req.vendor.toLowerCase().includes(lowercaseQuery))
    );
  }

  static async getRequestsSummary(organizationId: string): Promise<{
    total: number;
    pendingApproval: number;
    approved: number;
    inProcurement: number;
    completed: number;
    byPriority: { [key: string]: number };
    byCategory: { [key: string]: number };
  }> {
    const requests = await this.getAllRequests(organizationId);

    const summary = {
      total: requests.length,
      pendingApproval: requests.filter(r => r.status === 'Pending Approval').length,
      approved: requests.filter(r => r.status === 'Approved').length,
      inProcurement: requests.filter(r => r.status === 'In Procurement').length,
      completed: requests.filter(r => r.status === 'Completed').length,
      byPriority: {} as { [key: string]: number },
      byCategory: {} as { [key: string]: number }
    };

    requests.forEach(request => {
      summary.byPriority[request.priority] = (summary.byPriority[request.priority] || 0) + 1;
      summary.byCategory[request.category] = (summary.byCategory[request.category] || 0) + 1;
    });

    return summary;
  }

  static generateAIInsights(request: EProcurementRequest): EProcurementRequest['ai_insights'] {
    const priceNum = parseFloat(request.amount.replace(/[^0-9.]/g, ''));
    const insights: EProcurementRequest['ai_insights'] = {};

    if (priceNum > 1000000000) {
      insights.cost_optimization = `High-value procurement (${request.amount}). Consider volume discounts and long-term contracts for savings.`;
      insights.risk_assessment = 'High-value procurement requires executive approval and detailed risk assessment.';
    } else if (priceNum > 500000000) {
      insights.cost_optimization = `Medium-value procurement. Explore bundling opportunities with similar requests.`;
    }

    insights.market_analysis = `Current market conditions favor ${request.category} procurement. Lead time: ${this.estimateLeadTime(request.category)} days.`;

    if (request.vendor) {
      insights.vendor_recommendations = `Suggested vendor: ${request.vendor}. Historical performance: Good. Average delivery time: 15-20 days.`;
    } else {
      insights.vendor_recommendations = `3-5 qualified vendors available for ${request.category}. Competitive bidding recommended.`;
    }

    insights.bundling_opportunity = `Can be bundled with similar ${request.category} requests for 12-15% cost savings.`;

    return insights;
  }

  private static estimateLeadTime(category: string): number {
    const leadTimes: { [key: string]: number } = {
      'Engine Parts': 45,
      'Frame & Chassis': 30,
      'Electronics': 20,
      'Brake System': 25,
      'Wheels & Tires': 15,
      'Suspension': 30,
      'Transmission': 35,
      'Body Parts': 25,
      'Interior Components': 20,
      'Lighting System': 15,
      'Renewable Energy': 60,
      'Energy Storage': 90,
      'Equipment': 45
    };
    return leadTimes[category] || 30;
  }

  static generateMockRequest(organizationId: string): Omit<EProcurementRequest, 'created_at' | 'updated_at'> {
    const mockTemplates = [
      {
        title: 'Engine Block Components Procurement',
        category: 'Engine Parts',
        requestor: 'Production Team',
        amount: 'Rp 850,000,000',
        quantity: '200 units',
        vendor: 'PT Mesin Jaya',
        delivery_location: 'Jakarta Warehouse',
        estimated_price: 850000000,
        description: 'High-performance engine blocks for production line Model X2000. Requires heat-resistant alloy specifications and quality certification.'
      },
      {
        title: 'Brake Disc Assembly',
        category: 'Brake System',
        requestor: 'Engineering Department',
        amount: 'Rp 450,000,000',
        quantity: '500 units',
        delivery_location: 'Surabaya Plant',
        estimated_price: 450000000,
        description: 'Ventilated brake discs with ceramic coating. Must meet ISO safety standards for heavy-duty vehicles.'
      },
      {
        title: 'Electronic Control Unit Modules',
        category: 'Electronics',
        requestor: 'R&D Team',
        amount: 'Rp 1,200,000,000',
        quantity: '150 units',
        vendor: 'PT Elektronik Indonesia',
        delivery_location: 'Bandung Facility',
        estimated_price: 1200000000,
        description: 'Advanced ECU modules with AI-powered diagnostics. Compatible with CAN-BUS protocol and OBD-II standards.'
      },
      {
        title: 'Chassis Frame Components',
        category: 'Frame & Chassis',
        requestor: 'Assembly Team',
        amount: 'Rp 2,100,000,000',
        quantity: '100 units',
        delivery_location: 'Bekasi Factory',
        estimated_price: 2100000000,
        description: 'Reinforced steel chassis frames for SUV production. Must pass stress test requirements and corrosion resistance standards.'
      },
      {
        title: 'Suspension System Parts',
        category: 'Suspension',
        requestor: 'Quality Assurance',
        amount: 'Rp 680,000,000',
        quantity: '300 units',
        vendor: 'PT Suspensi Prima',
        delivery_location: 'Jakarta Warehouse',
        estimated_price: 680000000,
        description: 'Adjustable shock absorbers and spring assemblies. Must support 2-ton load capacity with 100,000km durability rating.'
      },
      {
        title: 'Premium Tire Set',
        category: 'Wheels & Tires',
        requestor: 'Procurement Team',
        amount: 'Rp 320,000,000',
        quantity: '400 sets',
        delivery_location: 'Tangerang Distribution Center',
        estimated_price: 320000000,
        description: 'All-season radial tires, size 225/65R17. Requires fuel efficiency rating A and wet grip rating A.'
      }
    ];

    const template = mockTemplates[Math.floor(Math.random() * mockTemplates.length)];
    const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
    const statuses: ('Pending Approval' | 'Approved')[] = ['Pending Approval', 'Approved'];

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 60) + 30);

    const mockRequest: Omit<EProcurementRequest, 'created_at' | 'updated_at'> = {
      id: `PR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      title: template.title,
      category: template.category,
      requestor: template.requestor,
      amount: template.amount,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      due_date: futureDate.toISOString().split('T')[0],
      description: template.description,
      vendor: template.vendor,
      quantity: template.quantity,
      delivery_location: template.delivery_location,
      estimated_price: template.estimated_price,
      organization_id: organizationId
    };

    mockRequest.ai_insights = this.generateAIInsights(mockRequest);

    return mockRequest;
  }

  static async createMockRequest(organizationId: string): Promise<EProcurementRequest> {
    const mockRequest = this.generateMockRequest(organizationId);
    return { ...mockRequest, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as EProcurementRequest;
  }
}
