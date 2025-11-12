import shipmentsData from '../data/shipments.json';

export interface Shipment {
  id: string;
  destination: string;
  items: string;
  carrier: string;
  status: 'In Transit' | 'Pending' | 'Delivered';
  priority: 'high' | 'medium' | 'low';
  estimatedDelivery: string;
  shipDate: string;
}

export class ShipmentsService {
  /**
   * Get all shipments
   */
  static async getShipments(): Promise<Shipment[]> {
    return shipmentsData as Shipment[];
  }

  /**
   * Get shipment by ID
   */
  static async getShipmentById(id: string): Promise<Shipment | undefined> {
    const shipments = await this.getShipments();
    return shipments.find(shipment => shipment.id === id);
  }

  /**
   * Get shipments by status
   */
  static async getShipmentsByStatus(status: string): Promise<Shipment[]> {
    const shipments = await this.getShipments();
    return shipments.filter(shipment => shipment.status === status);
  }

  /**
   * Get shipments by priority
   */
  static async getShipmentsByPriority(priority: string): Promise<Shipment[]> {
    const shipments = await this.getShipments();
    return shipments.filter(shipment => shipment.priority === priority);
  }

  /**
   * Get shipments by carrier
   */
  static async getShipmentsByCarrier(carrier: string): Promise<Shipment[]> {
    const shipments = await this.getShipments();
    return shipments.filter(shipment => 
      shipment.carrier.toLowerCase().includes(carrier.toLowerCase())
    );
  }

  /**
   * Search shipments
   */
  static async searchShipments(query: string): Promise<Shipment[]> {
    const shipments = await this.getShipments();
    const lowerQuery = query.toLowerCase();
    return shipments.filter(shipment => 
      shipment.destination.toLowerCase().includes(lowerQuery) ||
      shipment.items.toLowerCase().includes(lowerQuery) ||
      shipment.carrier.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get shipments summary
   */
  static async getShipmentsSummary(): Promise<{
    total: number;
    inTransit: number;
    pending: number;
    delivered: number;
    avgDeliveryTime: string;
    onTimeDelivery: string;
  }> {
    const shipments = await this.getShipments();

    return {
      total: shipments.length,
      inTransit: shipments.filter(s => s.status === 'In Transit').length,
      pending: shipments.filter(s => s.status === 'Pending').length,
      delivered: shipments.filter(s => s.status === 'Delivered').length,
      avgDeliveryTime: '3.8 days',
      onTimeDelivery: '96.2%'
    };
  }
}