import productionOrdersData from '../data/productionOrders.json';

export interface ProductionOrder {
  id: string;
  product: string;
  category: string;
  quantity: string;
  status: 'In Production' | 'Quality Check' | 'Completed';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  startDate: string;
}

export class ProductionOrdersService {
  /**
   * Get all production orders
   */
  static async getProductionOrders(): Promise<ProductionOrder[]> {
    return productionOrdersData as ProductionOrder[];
  }

  /**
   * Get production order by ID
   */
  static async getProductionOrderById(id: string): Promise<ProductionOrder | undefined> {
    const orders = await this.getProductionOrders();
    return orders.find(order => order.id === id);
  }

  /**
   * Get production orders by status
   */
  static async getProductionOrdersByStatus(status: string): Promise<ProductionOrder[]> {
    const orders = await this.getProductionOrders();
    return orders.filter(order => order.status === status);
  }

  /**
   * Get production orders by priority
   */
  static async getProductionOrdersByPriority(priority: string): Promise<ProductionOrder[]> {
    const orders = await this.getProductionOrders();
    return orders.filter(order => order.priority === priority);
  }

  /**
   * Get production orders by category
   */
  static async getProductionOrdersByCategory(category: string): Promise<ProductionOrder[]> {
    const orders = await this.getProductionOrders();
    return orders.filter(order => 
      order.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  /**
   * Search production orders
   */
  static async searchProductionOrders(query: string): Promise<ProductionOrder[]> {
    const orders = await this.getProductionOrders();
    const lowerQuery = query.toLowerCase();
    return orders.filter(order => 
      order.product.toLowerCase().includes(lowerQuery) ||
      order.category.toLowerCase().includes(lowerQuery) ||
      order.quantity.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get production orders summary
   */
  static async getProductionOrdersSummary(): Promise<{
    total: number;
    inProduction: number;
    qualityCheck: number;
    completed: number;
    avgProductionTime: string;
    qualityRate: string;
  }> {
    const orders = await this.getProductionOrders();

    return {
      total: orders.length,
      inProduction: orders.filter(o => o.status === 'In Production').length,
      qualityCheck: orders.filter(o => o.status === 'Quality Check').length,
      completed: orders.filter(o => o.status === 'Completed').length,
      avgProductionTime: '5.2 days',
      qualityRate: '98.7%'
    };
  }
}