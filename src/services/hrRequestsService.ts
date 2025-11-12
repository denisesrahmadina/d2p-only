import hrRequestsData from '../data/hrRequests.json';

export interface HRRequest {
  id: string;
  title: string;
  category: string;
  requestor: string;
  employee: string;
  status: 'In Processing' | 'Pending Approval' | 'Completed';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  createdDate: string;
}

export class HRRequestsService {
  /**
   * Get all HR requests
   */
  static async getHRRequests(): Promise<HRRequest[]> {
    return hrRequestsData as HRRequest[];
  }

  /**
   * Get HR request by ID
   */
  static async getHRRequestById(id: string): Promise<HRRequest | undefined> {
    const requests = await this.getHRRequests();
    return requests.find(request => request.id === id);
  }

  /**
   * Get HR requests by status
   */
  static async getHRRequestsByStatus(status: string): Promise<HRRequest[]> {
    const requests = await this.getHRRequests();
    return requests.filter(request => request.status === status);
  }

  /**
   * Get HR requests by priority
   */
  static async getHRRequestsByPriority(priority: string): Promise<HRRequest[]> {
    const requests = await this.getHRRequests();
    return requests.filter(request => request.priority === priority);
  }

  /**
   * Get HR requests by category
   */
  static async getHRRequestsByCategory(category: string): Promise<HRRequest[]> {
    const requests = await this.getHRRequests();
    return requests.filter(request => 
      request.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  /**
   * Search HR requests
   */
  static async searchHRRequests(query: string): Promise<HRRequest[]> {
    const requests = await this.getHRRequests();
    const lowerQuery = query.toLowerCase();
    return requests.filter(request => 
      request.title.toLowerCase().includes(lowerQuery) ||
      request.category.toLowerCase().includes(lowerQuery) ||
      request.requestor.toLowerCase().includes(lowerQuery) ||
      request.employee.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get HR requests summary
   */
  static async getHRRequestsSummary(): Promise<{
    total: number;
    pendingApproval: number;
    inProcessing: number;
    completed: number;
    avgProcessingTime: string;
    employeeSatisfaction: string;
  }> {
    const requests = await this.getHRRequests();

    return {
      total: requests.length,
      pendingApproval: requests.filter(r => r.status === 'Pending Approval').length,
      inProcessing: requests.filter(r => r.status === 'In Processing').length,
      completed: requests.filter(r => r.status === 'Completed').length,
      avgProcessingTime: '2.8 days',
      employeeSatisfaction: '94%'
    };
  }
}