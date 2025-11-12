import { supabase } from './supabaseClient';
import { DeliveryTracking } from '../types/marketplace';

export interface LiveTrackingData {
  id: string;
  po_number: string;
  tracking_number: string;
  vendor_id: string;
  current_status: string;
  current_latitude: number;
  current_longitude: number;
  current_address?: string;
  origin_latitude: number;
  origin_longitude: number;
  origin_address: string;
  destination_latitude: number;
  destination_longitude: number;
  destination_address: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  route_polyline?: string;
  distance_km?: number;
  milestones?: Array<{
    status: string;
    location: string;
    timestamp: string;
    description: string;
    completed: boolean;
    latitude?: number;
    longitude?: number;
  }>;
  carrier_name?: string;
  carrier_contact?: string;
  vehicle_type?: string;
  vehicle_number?: string;
  driver_name?: string;
  driver_contact?: string;
  last_updated?: string;
  created_at?: string;
}

export class LiveTrackingService {
  static async getTrackingByPO(poNumber: string): Promise<LiveTrackingData | null> {
    try {
      const { data, error } = await supabase
        .from('delivery_tracking_live')
        .select('*')
        .eq('po_number', poNumber)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      return null;
    }
  }

  static async getTrackingByNumber(trackingNumber: string): Promise<LiveTrackingData | null> {
    try {
      const { data, error } = await supabase
        .from('delivery_tracking_live')
        .select('*')
        .eq('tracking_number', trackingNumber)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      return null;
    }
  }

  static async createTracking(tracking: Partial<LiveTrackingData>): Promise<LiveTrackingData | null> {
    try {
      const { data, error } = await supabase
        .from('delivery_tracking_live')
        .insert([{
          ...tracking,
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating tracking data:', error);
      return null;
    }
  }

  static async updateTrackingLocation(
    trackingNumber: string,
    latitude: number,
    longitude: number,
    address?: string,
    status?: string
  ): Promise<boolean> {
    try {
      const updateData: any = {
        current_latitude: latitude,
        current_longitude: longitude,
        last_updated: new Date().toISOString()
      };

      if (address) updateData.current_address = address;
      if (status) updateData.current_status = status;

      const { error } = await supabase
        .from('delivery_tracking_live')
        .update(updateData)
        .eq('tracking_number', trackingNumber);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating tracking location:', error);
      return false;
    }
  }

  static async updateTrackingStatus(
    trackingNumber: string,
    status: string,
    milestone?: {
      status: string;
      location: string;
      description: string;
      latitude?: number;
      longitude?: number;
    }
  ): Promise<boolean> {
    try {
      const tracking = await this.getTrackingByNumber(trackingNumber);
      if (!tracking) return false;

      const milestones = tracking.milestones || [];

      if (milestone) {
        milestones.push({
          ...milestone,
          timestamp: new Date().toISOString(),
          completed: true
        });
      }

      const updateData: any = {
        current_status: status,
        milestones: milestones,
        last_updated: new Date().toISOString()
      };

      if (status === 'Delivered') {
        updateData.actual_delivery = new Date().toISOString();
      }

      const { error } = await supabase
        .from('delivery_tracking_live')
        .update(updateData)
        .eq('tracking_number', trackingNumber);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating tracking status:', error);
      return false;
    }
  }

  static async getAllActiveTracking(): Promise<LiveTrackingData[]> {
    try {
      const { data, error } = await supabase
        .from('delivery_tracking_live')
        .select('*')
        .not('current_status', 'eq', 'Delivered')
        .order('last_updated', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active tracking:', error);
      return [];
    }
  }

  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  static calculateProgress(tracking: LiveTrackingData): number {
    const totalDistance = this.calculateDistance(
      tracking.origin_latitude,
      tracking.origin_longitude,
      tracking.destination_latitude,
      tracking.destination_longitude
    );

    const remainingDistance = this.calculateDistance(
      tracking.current_latitude,
      tracking.current_longitude,
      tracking.destination_latitude,
      tracking.destination_longitude
    );

    const progress = ((totalDistance - remainingDistance) / totalDistance) * 100;
    return Math.max(0, Math.min(100, progress));
  }

  static generateMockTrackingForOrder(
    poNumber: string,
    vendorId: string,
    vendorName: string
  ): Partial<LiveTrackingData> {
    const origins = [
      { lat: -6.2088, lng: 106.8456, name: 'Jakarta Warehouse' },
      { lat: -6.9175, lng: 107.6191, name: 'Bandung Distribution Center' },
      { lat: -7.2575, lng: 112.7521, name: 'Surabaya Logistics Hub' }
    ];

    const destinations = [
      { lat: -6.1751, lng: 106.8650, name: 'Jakarta Corporate Office' },
      { lat: -6.9147, lng: 107.6098, name: 'Bandung Plant' },
      { lat: -7.2504, lng: 112.7688, name: 'Surabaya Facility' }
    ];

    const origin = origins[Math.floor(Math.random() * origins.length)];
    const destination = destinations[Math.floor(Math.random() * destinations.length)];

    const progressFactor = Math.random() * 0.7;
    const currentLat = origin.lat + (destination.lat - origin.lat) * progressFactor;
    const currentLng = origin.lng + (destination.lng - origin.lng) * progressFactor;

    const statuses = ['Processing', 'Shipped', 'In Transit', 'Out for Delivery'];
    const currentStatus = statuses[Math.floor(Math.random() * statuses.length)];

    const milestones = [
      {
        status: 'Order Confirmed',
        location: origin.name,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Order received and confirmed by vendor',
        completed: true,
        latitude: origin.lat,
        longitude: origin.lng
      },
      {
        status: 'Package Prepared',
        location: origin.name,
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Package prepared and ready for shipment',
        completed: true,
        latitude: origin.lat,
        longitude: origin.lng
      },
      {
        status: 'Shipped',
        location: 'In Transit',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Package picked up by carrier',
        completed: currentStatus !== 'Processing',
        latitude: currentLat,
        longitude: currentLng
      },
      {
        status: 'Out for Delivery',
        location: destination.name,
        timestamp: new Date(Date.now() + 0.5 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Package out for final delivery',
        completed: currentStatus === 'Out for Delivery',
        latitude: destination.lat,
        longitude: destination.lng
      }
    ];

    return {
      po_number: poNumber,
      tracking_number: `TRK-${poNumber}-${Date.now()}`,
      vendor_id: vendorId,
      current_status: currentStatus,
      current_latitude: currentLat,
      current_longitude: currentLng,
      current_address: `En route to ${destination.name}`,
      origin_latitude: origin.lat,
      origin_longitude: origin.lng,
      origin_address: origin.name,
      destination_latitude: destination.lat,
      destination_longitude: destination.lng,
      destination_address: destination.name,
      estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      distance_km: this.calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng),
      milestones,
      carrier_name: 'Indonesia Express Logistics',
      vehicle_type: 'Truck',
      vehicle_number: `B-${Math.floor(Math.random() * 9000 + 1000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      driver_name: ['Budi Santoso', 'Ahmad Rahman', 'Siti Nurhaliza'][Math.floor(Math.random() * 3)],
      driver_contact: `+62 812-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`
    };
  }
}
