import receivablesData from '../data/receivables.json';

export interface Receivable {
  id: string;
  customer: string;
  amount: string;
  description: string;
  status: 'Pending Collection' | 'In Progress' | 'Collected';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  invoiceDate: string;
}

export class ReceivablesService {
  /**
   * Get all receivables
   */
  static async getReceivables(): Promise<Receivable[]> {
    return receivablesData as Receivable[];
  }

  /**
   * Get receivable by ID
   */
  static async getReceivableById(id: string): Promise<Receivable | undefined> {
    const receivables = await this.getReceivables();
    return receivables.find(receivable => receivable.id === id);
  }

  /**
   * Get receivables by status
   */
  static async getReceivablesByStatus(status: string): Promise<Receivable[]> {
    const receivables = await this.getReceivables();
    return receivables.filter(receivable => receivable.status === status);
  }

  /**
   * Get receivables by priority
   */
  static async getReceivablesByPriority(priority: string): Promise<Receivable[]> {
    const receivables = await this.getReceivables();
    return receivables.filter(receivable => receivable.priority === priority);
  }

  /**
   * Get receivables by customer
   */
  static async getReceivablesByCustomer(customer: string): Promise<Receivable[]> {
    const receivables = await this.getReceivables();
    return receivables.filter(receivable => 
      receivable.customer.toLowerCase().includes(customer.toLowerCase())
    );
  }

  /**
   * Search receivables
   */
  static async searchReceivables(query: string): Promise<Receivable[]> {
    const receivables = await this.getReceivables();
    const lowerQuery = query.toLowerCase();
    return receivables.filter(receivable => 
      receivable.customer.toLowerCase().includes(lowerQuery) ||
      receivable.description.toLowerCase().includes(lowerQuery) ||
      receivable.amount.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get receivables summary
   */
  static async getReceivablesSummary(): Promise<{
    total: number;
    pendingCollection: number;
    inProgress: number;
    collected: number;
    totalValue: number;
    avgCollectionTime: string;
    collectionRate: string;
  }> {
    const receivables = await this.getReceivables();
    
    let totalValue = 0;
    receivables.forEach(receivable => {
      const amountMatch = receivable.amount.match(/[\d,]+/);
      if (amountMatch) {
        totalValue += parseInt(amountMatch[0].replace(/,/g, ''));
      }
    });

    return {
      total: receivables.length,
      pendingCollection: receivables.filter(r => r.status === 'Pending Collection').length,
      inProgress: receivables.filter(r => r.status === 'In Progress').length,
      collected: receivables.filter(r => r.status === 'Collected').length,
      totalValue,
      avgCollectionTime: '18.5 days',
      collectionRate: '92.4%'
    };
  }
}