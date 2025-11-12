import { PurchaseOrder, DeliveryTracking, DeliveryMilestone, ProcurementRequest } from '../types/marketplace';
import { mockPurchaseOrders } from '../data/marketplaceMockData';

export class OrderTrackingService {
  private static orders = [...mockPurchaseOrders];
  private static nextPOId = 3;

  static getNextPOId(): number {
    return this.nextPOId++;
  }

  static async createPOFromPR(pr: ProcurementRequest, poNumber: string): Promise<void> {
    const poDate = new Date().toISOString().split('T')[0];

    const newPO: PurchaseOrder = {
      po_line_id: this.nextPOId++,
      po_number: poNumber,
      po_line_number: 1,
      po_description: pr.notes || `Auto-generated from ${pr.pr_number}`,
      po_status: 'Open',
      material_id: pr.material_id,
      vendor_id: pr.vendor_id,
      receiving_unit_id: pr.unit_requestor_id,
      po_date: poDate,
      order_date: poDate,
      expected_delivery_date: pr.delivery_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      qty_ordered: pr.demand_qty,
      qty_received: 0,
      unit_price: pr.unit_price,
      total_po_value: pr.pr_value,
      currency: pr.currency,
      transaction_date: poDate,
      created_date: new Date().toISOString()
    };

    this.orders.push(newPO);
  }

  static async getOrdersByUser(userId: string): Promise<PurchaseOrder[]> {
    try {
      return this.orders
        .filter(order => order.receiving_unit_id === userId)
        .sort((a, b) => {
          const dateA = new Date(a.po_date).getTime();
          const dateB = new Date(b.po_date).getTime();
          return dateB - dateA;
        });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }

  static async getAllOrders(filters?: {
    status?: string;
    vendorId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<PurchaseOrder[]> {
    try {
      let filteredOrders = [...this.orders];

      if (filters?.status) {
        filteredOrders = filteredOrders.filter(order => order.po_status === filters.status);
      }

      if (filters?.vendorId) {
        filteredOrders = filteredOrders.filter(order => order.vendor_id === filters.vendorId);
      }

      if (filters?.dateFrom) {
        filteredOrders = filteredOrders.filter(order => order.po_date >= filters.dateFrom!);
      }

      if (filters?.dateTo) {
        filteredOrders = filteredOrders.filter(order => order.po_date <= filters.dateTo!);
      }

      return filteredOrders.sort((a, b) => {
        const dateA = new Date(a.po_date).getTime();
        const dateB = new Date(b.po_date).getTime();
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  static async getOrderById(poLineId: number): Promise<PurchaseOrder | null> {
    try {
      return this.orders.find(order => order.po_line_id === poLineId) || null;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  static generateMockDeliveryTracking(order: PurchaseOrder): DeliveryTracking {
    const now = new Date();
    const orderDate = new Date(order.po_date);
    const expectedDelivery = order.expected_delivery_date
      ? new Date(order.expected_delivery_date)
      : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const arrivalDate = order.arrival_date ? new Date(order.arrival_date) : new Date(expectedDelivery.getTime() - 1 * 24 * 60 * 60 * 1000);
    const inspectionStartDate = order.inspection_start_date ? new Date(order.inspection_start_date) : new Date(arrivalDate.getTime() + 2 * 60 * 60 * 1000);
    const grDate = order.gr_date ? new Date(order.gr_date) : new Date(inspectionStartDate.getTime() + 4 * 60 * 60 * 1000);

    const milestones: DeliveryMilestone[] = [
      {
        status: 'Order Placed',
        location: 'System',
        timestamp: orderDate.toISOString(),
        description: 'Purchase order created and sent to vendor',
        completed: true
      },
      {
        status: 'Processing Order',
        location: 'Vendor Warehouse',
        timestamp: new Date(orderDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Order being prepared for shipment',
        completed: order.po_status !== 'Open'
      },
      {
        status: 'Shipped',
        location: 'In Transit',
        timestamp: new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Package shipped from vendor',
        completed: ['In Transit', 'Arrived at Destination', 'In Inspection', 'Partially Delivered', 'Delivered'].includes(order.po_status)
      },
      {
        status: 'Delivery',
        location: 'Local Distribution Center',
        timestamp: new Date(expectedDelivery.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Out for delivery to destination',
        completed: ['Arrived at Destination', 'In Inspection', 'Partially Delivered', 'Delivered'].includes(order.po_status)
      },
      {
        status: 'Arrived at Destination',
        location: 'Destination',
        timestamp: arrivalDate.toISOString(),
        description: 'Order arrived at destination. Goods Receipt (GR) pending in ERP.',
        completed: ['Arrived at Destination', 'In Inspection', 'Delivered'].includes(order.po_status),
        ba_documents: order.ba_documents?.filter(doc => doc.ba_type === 'BA Pemeriksaan')
      },
      {
        status: 'In Inspection',
        location: 'Inspection Area',
        timestamp: inspectionStartDate.toISOString(),
        description: 'Goods under inspection. BA Pemeriksaan and BA Serah Terima Barang will be generated.',
        completed: ['In Inspection', 'Delivered'].includes(order.po_status),
        ba_documents: order.ba_documents?.filter(doc => ['BA Pemeriksaan', 'BA Serah Terima Barang'].includes(doc.ba_type))
      },
      {
        status: 'Order Received',
        location: 'Destination',
        timestamp: grDate.toISOString(),
        description: 'Order received and Goods Receipt (GR) completed in ERP.',
        completed: order.po_status === 'Delivered' && order.gr_completed === true,
        ba_documents: order.ba_documents
      }
    ];

    let currentStatus: DeliveryTracking['current_status'] = 'Processing';
    if (order.po_status === 'Open') currentStatus = 'Processing';
    else if (order.po_status === 'In Transit') currentStatus = 'In Transit';
    else if (order.po_status === 'Arrived at Destination') currentStatus = 'Arrived at Destination';
    else if (order.po_status === 'In Inspection') currentStatus = 'In Inspection';
    else if (order.po_status === 'Partially Delivered') currentStatus = 'Out for Delivery';
    else if (order.po_status === 'Delivered') currentStatus = 'Delivered';

    const vendorLocations = [
      { lat: -6.2088, lng: 106.8456, name: 'Jakarta Warehouse' },
      { lat: -6.9175, lng: 107.6191, name: 'Bandung Distribution' },
      { lat: -7.2575, lng: 112.7521, name: 'Surabaya Logistics' }
    ];

    const destinationLocations = [
      { lat: -6.1751, lng: 106.8650, name: 'Jakarta Office' },
      { lat: -6.9147, lng: 107.6098, name: 'Bandung Plant' },
      { lat: -7.2504, lng: 112.7688, name: 'Surabaya Facility' }
    ];

    const randomVendor = vendorLocations[Math.floor(Math.random() * vendorLocations.length)];
    const randomDest = destinationLocations[Math.floor(Math.random() * destinationLocations.length)];

    const progressFactor = order.po_status === 'Delivered' ? 1 :
                          order.po_status === 'In Inspection' ? 0.95 :
                          order.po_status === 'Arrived at Destination' ? 0.9 :
                          order.po_status === 'In Transit' ? 0.5 :
                          order.po_status === 'Open' ? 0.1 : 0.7;

    const currentLat = randomVendor.lat + (randomDest.lat - randomVendor.lat) * progressFactor;
    const currentLng = randomVendor.lng + (randomDest.lng - randomVendor.lng) * progressFactor;

    return {
      tracking_number: `TRK-${order.po_number}`,
      current_status: currentStatus,
      current_location: {
        latitude: currentLat,
        longitude: currentLng,
        address: order.po_status === 'Delivered' ? randomDest.name : 'In Transit',
        timestamp: new Date().toISOString()
      },
      origin: {
        address: randomVendor.name,
        latitude: randomVendor.lat,
        longitude: randomVendor.lng
      },
      destination: {
        address: randomDest.name,
        latitude: randomDest.lat,
        longitude: randomDest.lng
      },
      milestones,
      estimated_delivery: expectedDelivery.toISOString(),
      last_updated: new Date().toISOString()
    };
  }

  static async updateOrderStatus(
    poLineId: number,
    newStatus: PurchaseOrder['po_status']
  ): Promise<boolean> {
    try {
      const orderIndex = this.orders.findIndex(order => order.po_line_id === poLineId);
      if (orderIndex === -1) return false;

      this.orders[orderIndex] = {
        ...this.orders[orderIndex],
        po_status: newStatus,
        modified_date: new Date().toISOString()
      };

      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  static async updateOrderQuantity(
    poLineId: number,
    qtyReceived: number
  ): Promise<boolean> {
    try {
      const orderIndex = this.orders.findIndex(order => order.po_line_id === poLineId);
      if (orderIndex === -1) return false;

      const order = this.orders[orderIndex];
      const totalReceived = order.qty_received + qtyReceived;

      let newStatus = order.po_status;
      if (totalReceived >= order.qty_ordered) {
        newStatus = 'Delivered';
      } else if (totalReceived > 0) {
        newStatus = 'Partially Delivered';
      }

      this.orders[orderIndex] = {
        ...order,
        qty_received: totalReceived,
        po_status: newStatus,
        gr_completed: totalReceived >= order.qty_ordered,
        gr_date: totalReceived >= order.qty_ordered ? new Date().toISOString().split('T')[0] : order.gr_date,
        modified_date: new Date().toISOString()
      };

      return true;
    } catch (error) {
      console.error('Error updating order quantity:', error);
      return false;
    }
  }

  static async getOrderStatistics(): Promise<{
    total: number;
    open: number;
    in_transit: number;
    arrived: number;
    in_inspection: number;
    delivered: number;
    total_value: number;
  }> {
    try {
      const stats = {
        total: this.orders.length,
        open: 0,
        in_transit: 0,
        arrived: 0,
        in_inspection: 0,
        delivered: 0,
        total_value: 0
      };

      this.orders.forEach(order => {
        stats.total_value += order.total_po_value;

        switch (order.po_status) {
          case 'Open':
            stats.open++;
            break;
          case 'In Transit':
            stats.in_transit++;
            break;
          case 'Arrived at Destination':
            stats.arrived++;
            break;
          case 'In Inspection':
            stats.in_inspection++;
            break;
          case 'Delivered':
          case 'Partially Delivered':
            stats.delivered++;
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting order statistics:', error);
      return {
        total: 0,
        open: 0,
        in_transit: 0,
        arrived: 0,
        in_inspection: 0,
        delivered: 0,
        total_value: 0
      };
    }
  }

  static async getOrdersByStatus(status: PurchaseOrder['po_status']): Promise<PurchaseOrder[]> {
    try {
      return this.orders.filter(order => order.po_status === status);
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      return [];
    }
  }

  static async getRecentOrders(limit: number = 10): Promise<PurchaseOrder[]> {
    try {
      return [...this.orders]
        .sort((a, b) => {
          const dateA = new Date(a.created_date || a.po_date).getTime();
          const dateB = new Date(b.created_date || b.po_date).getTime();
          return dateB - dateA;
        })
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      return [];
    }
  }
}
