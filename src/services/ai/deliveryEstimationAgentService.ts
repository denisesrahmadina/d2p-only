import { PurchaseOrder } from '../../types/marketplace';

export interface DeliveryPrediction {
  estimated_delivery_date: string;
  confidence: number;
  factors: string[];
  potential_delays: string[];
  recommendations: string[];
}

export class DeliveryEstimationAgentService {
  static async predictDeliveryTime(
    order: PurchaseOrder,
    distance?: number
  ): Promise<DeliveryPrediction> {
    const factors: string[] = [];
    const potentialDelays: string[] = [];
    const recommendations: string[] = [];

    const orderDate = new Date(order.po_date);
    let estimatedDays = 7;

    if (order.material_id) {
      if (order.material_id.includes('MAT001') || order.material_id.includes('MAT002')) {
        estimatedDays = 45;
        factors.push('Heavy equipment requires specialized logistics');
      } else if (order.material_id.includes('MAT003') || order.material_id.includes('MAT004')) {
        estimatedDays = 21;
        factors.push('Standard industrial equipment delivery time');
      } else {
        estimatedDays = 10;
        factors.push('Standard delivery for this category');
      }
    }

    if (distance) {
      if (distance > 1000) {
        estimatedDays += 7;
        factors.push('Long-distance delivery requires additional time');
        recommendations.push('Consider regional warehousing for future orders');
      } else if (distance > 500) {
        estimatedDays += 3;
        factors.push('Inter-regional shipping');
      }
    }

    const orderValue = order.total_po_value;
    if (orderValue > 1000000000) {
      estimatedDays += 5;
      factors.push('High-value shipment requires additional security measures');
      potentialDelays.push('Customs clearance for high-value goods');
    }

    const quantity = order.qty_ordered;
    if (quantity > 100) {
      estimatedDays += 3;
      factors.push('Large quantity requires extended preparation time');
      potentialDelays.push('Inventory consolidation from multiple warehouses');
    }

    const currentMonth = new Date().getMonth();
    if (currentMonth === 11 || currentMonth === 0) {
      estimatedDays += 2;
      potentialDelays.push('Holiday season may cause logistics delays');
      recommendations.push('Plan buffer time for year-end deliveries');
    }

    if (order.po_status === 'Open') {
      potentialDelays.push('Awaiting vendor confirmation');
    } else if (order.po_status === 'In Transit') {
      const actualDays = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      if (actualDays > estimatedDays * 0.7) {
        potentialDelays.push('Shipment progress slower than expected');
        recommendations.push('Contact logistics provider for status update');
      }
    }

    const estimatedDeliveryDate = new Date(orderDate);
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + estimatedDays);

    const confidence = potentialDelays.length === 0 ? 0.88 :
                      potentialDelays.length === 1 ? 0.75 : 0.62;

    return {
      estimated_delivery_date: estimatedDeliveryDate.toISOString().split('T')[0],
      confidence,
      factors,
      potential_delays: potentialDelays,
      recommendations
    };
  }

  static async identifyDelayRisks(
    orders: PurchaseOrder[]
  ): Promise<{
    high_risk: PurchaseOrder[];
    medium_risk: PurchaseOrder[];
    low_risk: PurchaseOrder[];
    insights: string[];
  }> {
    const highRisk: PurchaseOrder[] = [];
    const mediumRisk: PurchaseOrder[] = [];
    const lowRisk: PurchaseOrder[] = [];
    const insights: string[] = [];

    for (const order of orders) {
      const orderDate = new Date(order.po_date);
      const daysElapsed = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

      if (order.expected_delivery_date) {
        const expectedDate = new Date(order.expected_delivery_date);
        const daysUntilExpected = Math.floor((expectedDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

        if (daysUntilExpected < 0 && order.po_status !== 'Delivered') {
          highRisk.push(order);
        } else if (daysUntilExpected < 3 && order.po_status === 'Open') {
          highRisk.push(order);
        } else if (daysUntilExpected < 7 && order.po_status === 'Open') {
          mediumRisk.push(order);
        } else {
          lowRisk.push(order);
        }
      } else {
        if (daysElapsed > 30) {
          highRisk.push(order);
        } else if (daysElapsed > 14) {
          mediumRisk.push(order);
        } else {
          lowRisk.push(order);
        }
      }
    }

    if (highRisk.length > 0) {
      insights.push(`${highRisk.length} order(s) require immediate attention due to delivery delays`);
    }

    if (mediumRisk.length > 0) {
      insights.push(`${mediumRisk.length} order(s) should be monitored closely`);
    }

    const onTimeRate = orders.length > 0
      ? Math.round((lowRisk.length / orders.length) * 100)
      : 0;

    insights.push(`Current on-time delivery rate: ${onTimeRate}%`);

    return {
      high_risk: highRisk,
      medium_risk: mediumRisk,
      low_risk: lowRisk,
      insights
    };
  }

  static async suggestRouteOptimization(
    origin: { lat: number; lng: number },
    destinations: Array<{ lat: number; lng: number; orderId: string }>
  ): Promise<{
    optimized_route: string[];
    estimated_time_savings: number;
    reasoning: string;
  }> {
    const calculateDistance = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ): number => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const sortedDestinations = [...destinations].sort((a, b) => {
      const distA = calculateDistance(origin.lat, origin.lng, a.lat, a.lng);
      const distB = calculateDistance(origin.lat, origin.lng, b.lat, b.lng);
      return distA - distB;
    });

    const optimizedRoute = sortedDestinations.map(d => d.orderId);
    const timeSavings = Math.max(1, Math.floor(destinations.length * 0.15));

    return {
      optimized_route: optimizedRoute,
      estimated_time_savings: timeSavings,
      reasoning: `Optimized route reduces total distance by consolidating nearby deliveries, saving approximately ${timeSavings} hour(s)`
    };
  }
}
