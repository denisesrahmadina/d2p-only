import purchaseOrdersData from '../data/purchaseOrders.json';

export interface DeliveryMilestone {
  milestone: string;
  percent: number;
  plannedDate: string;
  plannedAmount: string;
}

export interface PurchaseOrder {
  id: string;
  vendor: string;
  category: string;
  amount: string;
  description: string;
  status: 'Approved' | 'In Progress' | 'Delivered';
  requestor: string;
  approvedBy: string;
  orderDate: string;
  expectedDelivery: string;
  deliveryMilestone: DeliveryMilestone[];
}

export class PurchaseOrdersService {
  /**
   * Get all purchase orders
   */
  static async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return purchaseOrdersData as PurchaseOrder[];
  }

  /**
   * Get purchase order by ID
   */
  static async getPurchaseOrderById(id: string): Promise<PurchaseOrder | undefined> {
    const orders = await this.getPurchaseOrders();
    return orders.find(order => order.id === id);
  }

  /**
   * Get purchase orders by status
   */
  static async getPurchaseOrdersByStatus(status: string): Promise<PurchaseOrder[]> {
    const orders = await this.getPurchaseOrders();
    return orders.filter(order => order.status === status);
  }

  /**
   * Get purchase orders by vendor
   */
  static async getPurchaseOrdersByVendor(vendor: string): Promise<PurchaseOrder[]> {
    const orders = await this.getPurchaseOrders();
    return orders.filter(order => 
      order.vendor.toLowerCase().includes(vendor.toLowerCase())
    );
  }

  /**
   * Get purchase orders by category
   */
  static async getPurchaseOrdersByCategory(category: string): Promise<PurchaseOrder[]> {
    const orders = await this.getPurchaseOrders();
    return orders.filter(order => 
      order.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  /**
   * Search purchase orders
   */
  static async searchPurchaseOrders(query: string): Promise<PurchaseOrder[]> {
    const orders = await this.getPurchaseOrders();
    const lowerQuery = query.toLowerCase();
    return orders.filter(order => 
      order.vendor.toLowerCase().includes(lowerQuery) ||
      order.category.toLowerCase().includes(lowerQuery) ||
      order.description.toLowerCase().includes(lowerQuery) ||
      order.requestor.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get purchase orders summary
   */
  static async getPurchaseOrdersSummary(): Promise<{
    total: number;
    approved: number;
    inProgress: number;
    delivered: number;
    byCategory: { [category: string]: number };
    totalValue: number;
  }> {
    const orders = await this.getPurchaseOrders();
    
    const byCategory: { [category: string]: number } = {};
    let totalValue = 0;
    
    orders.forEach(order => {
      byCategory[order.category] = (byCategory[order.category] || 0) + 1;
      // Extract numeric value from amount string
      const amountMatch = order.amount.match(/[\d,]+/);
      if (amountMatch) {
        totalValue += parseInt(amountMatch[0].replace(/,/g, ''));
      }
    });

    return {
      total: orders.length,
      approved: orders.filter(o => o.status === 'Approved').length,
      inProgress: orders.filter(o => o.status === 'In Progress').length,
      delivered: orders.filter(o => o.status === 'Delivered').length,
      byCategory,
      totalValue
    };
  }
}