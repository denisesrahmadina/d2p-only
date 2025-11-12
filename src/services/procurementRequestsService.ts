import procurementRequestsData from '../data/procurementRequests.json';

export interface ProcurementRequest {
  id: string;
  title: string;
  category: string;
  requestor: string;
  amount: string;
  status: 'Pending Approval' | 'In Procurement' | 'Completed';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

export class ProcurementRequestsService {
  /**
   * Get all procurement requests
   */
  static async getProcurementRequests(): Promise<ProcurementRequest[]> {
    return procurementRequestsData as ProcurementRequest[];
  }

  /**
   * Get procurement request by ID
   */
  static async getProcurementRequestById(id: string): Promise<ProcurementRequest | undefined> {
    const requests = await this.getProcurementRequests();
    return requests.find(request => request.id === id);
  }

  /**
   * Get procurement requests by status
   */
  static async getProcurementRequestsByStatus(status: string): Promise<ProcurementRequest[]> {
    const requests = await this.getProcurementRequests();
    return requests.filter(request => request.status === status);
  }

  /**
   * Get procurement requests by priority
   */
  static async getProcurementRequestsByPriority(priority: string): Promise<ProcurementRequest[]> {
    const requests = await this.getProcurementRequests();
    return requests.filter(request => request.priority === priority);
  }

  /**
   * Get procurement requests by category
   */
  static async getProcurementRequestsByCategory(category: string): Promise<ProcurementRequest[]> {
    const requests = await this.getProcurementRequests();
    return requests.filter(request => 
      request.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  /**
   * Get procurement requests by requestor
   */
  static async getProcurementRequestsByRequestor(requestor: string): Promise<ProcurementRequest[]> {
    const requests = await this.getProcurementRequests();
    return requests.filter(request => 
      request.requestor.toLowerCase().includes(requestor.toLowerCase())
    );
  }

  /**
   * Search procurement requests
   */
  static async searchProcurementRequests(query: string): Promise<ProcurementRequest[]> {
    const requests = await this.getProcurementRequests();
    const lowerQuery = query.toLowerCase();
    return requests.filter(request => 
      request.title.toLowerCase().includes(lowerQuery) ||
      request.category.toLowerCase().includes(lowerQuery) ||
      request.requestor.toLowerCase().includes(lowerQuery) ||
      request.amount.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get procurement requests summary
   */
  static async getProcurementRequestsSummary(): Promise<{
    total: number;
    pendingApproval: number;
    inProcurement: number;
    completed: number;
    byPriority: { [priority: string]: number };
    byCategory: { [category: string]: number };
  }> {
    const requests = await this.getProcurementRequests();
    
    const byPriority: { [priority: string]: number } = {};
    const byCategory: { [category: string]: number } = {};
    
    requests.forEach(request => {
      byPriority[request.priority] = (byPriority[request.priority] || 0) + 1;
      byCategory[request.category] = (byCategory[request.category] || 0) + 1;
    });

    return {
      total: requests.length,
      pendingApproval: requests.filter(r => r.status === 'Pending Approval').length,
      inProcurement: requests.filter(r => r.status === 'In Procurement').length,
      completed: requests.filter(r => r.status === 'Completed').length,
      byPriority,
      byCategory
    };
  }
}