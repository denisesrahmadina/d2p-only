import invoicesData from '../data/invoices.json';

export interface Invoice {
  id: string;
  vendor: string;
  amount: string;
  description: string;
  status: 'Pending Approval' | 'In Processing' | 'Completed';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  receivedDate: string;
}

export class InvoicesService {
  /**
   * Get all invoices
   */
  static async getInvoices(): Promise<Invoice[]> {
    return invoicesData as Invoice[];
  }

  /**
   * Get invoice by ID
   */
  static async getInvoiceById(id: string): Promise<Invoice | undefined> {
    const invoices = await this.getInvoices();
    return invoices.find(invoice => invoice.id === id);
  }

  /**
   * Get invoices by status
   */
  static async getInvoicesByStatus(status: string): Promise<Invoice[]> {
    const invoices = await this.getInvoices();
    return invoices.filter(invoice => invoice.status === status);
  }

  /**
   * Get invoices by priority
   */
  static async getInvoicesByPriority(priority: string): Promise<Invoice[]> {
    const invoices = await this.getInvoices();
    return invoices.filter(invoice => invoice.priority === priority);
  }

  /**
   * Get invoices by vendor
   */
  static async getInvoicesByVendor(vendor: string): Promise<Invoice[]> {
    const invoices = await this.getInvoices();
    return invoices.filter(invoice => 
      invoice.vendor.toLowerCase().includes(vendor.toLowerCase())
    );
  }

  /**
   * Search invoices
   */
  static async searchInvoices(query: string): Promise<Invoice[]> {
    const invoices = await this.getInvoices();
    const lowerQuery = query.toLowerCase();
    return invoices.filter(invoice => 
      invoice.vendor.toLowerCase().includes(lowerQuery) ||
      invoice.description.toLowerCase().includes(lowerQuery) ||
      invoice.amount.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get invoices summary
   */
  static async getInvoicesSummary(): Promise<{
    total: number;
    pendingApproval: number;
    inProcessing: number;
    completed: number;
    totalValue: number;
    avgProcessingTime: string;
  }> {
    const invoices = await this.getInvoices();
    
    let totalValue = 0;
    invoices.forEach(invoice => {
      const amountMatch = invoice.amount.match(/[\d,]+/);
      if (amountMatch) {
        totalValue += parseInt(amountMatch[0].replace(/,/g, ''));
      }
    });

    return {
      total: invoices.length,
      pendingApproval: invoices.filter(i => i.status === 'Pending Approval').length,
      inProcessing: invoices.filter(i => i.status === 'In Processing').length,
      completed: invoices.filter(i => i.status === 'Completed').length,
      totalValue,
      avgProcessingTime: '2.1 days'
    };
  }
}