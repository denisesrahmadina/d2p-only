import { supabase } from './supabaseClient';

export interface PLNLocation {
  location_id: string;
  facility_name: string;
  facility_type: 'Power Plant' | 'Substation' | 'Warehouse' | 'Administrative Office' | 'Regional Office';
  address: string;
  city: string;
  province: string;
  postal_code?: string;
  region: 'Java-Bali' | 'Sumatera' | 'Kalimantan' | 'Sulawesi' | 'Maluku-Papua';
  latitude?: number;
  longitude?: number;
  facility_manager_name?: string;
  facility_phone?: string;
  facility_email?: string;
  receiving_dock_available?: boolean;
  storage_capacity_sqm?: number;
  delivery_time_window?: string;
  special_instructions?: string;
  is_active?: boolean;
}

export class PLNLocationsService {
  static async getAllLocations(): Promise<PLNLocation[]> {
    try {
      const { data, error } = await supabase
        .from('dim_pln_locations')
        .select('*')
        .eq('is_active', true)
        .order('facility_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching PLN locations:', error);
      return [];
    }
  }

  static async getLocationById(locationId: string): Promise<PLNLocation | null> {
    try {
      const { data, error } = await supabase
        .from('dim_pln_locations')
        .select('*')
        .eq('location_id', locationId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching location:', error);
      return null;
    }
  }

  static async searchLocations(query: string): Promise<PLNLocation[]> {
    try {
      const lowerQuery = query.toLowerCase();
      const { data, error } = await supabase
        .from('dim_pln_locations')
        .select('*')
        .eq('is_active', true)
        .or(`facility_name.ilike.%${lowerQuery}%,city.ilike.%${lowerQuery}%,address.ilike.%${lowerQuery}%`);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  }

  static async getLocationsByRegion(region: string): Promise<PLNLocation[]> {
    try {
      const { data, error } = await supabase
        .from('dim_pln_locations')
        .select('*')
        .eq('region', region)
        .eq('is_active', true)
        .order('facility_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching locations by region:', error);
      return [];
    }
  }

  static async getLocationsByFacilityType(facilityType: string): Promise<PLNLocation[]> {
    try {
      const { data, error } = await supabase
        .from('dim_pln_locations')
        .select('*')
        .eq('facility_type', facilityType)
        .eq('is_active', true)
        .order('facility_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching locations by facility type:', error);
      return [];
    }
  }

  static async getLocationsByCity(city: string): Promise<PLNLocation[]> {
    try {
      const { data, error } = await supabase
        .from('dim_pln_locations')
        .select('*')
        .eq('city', city)
        .eq('is_active', true)
        .order('facility_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching locations by city:', error);
      return [];
    }
  }

  static async getUniqueCities(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('dim_pln_locations')
        .select('city')
        .eq('is_active', true);

      if (error) throw error;

      const cities = Array.from(
        new Set((data || []).map(l => l.city).filter(Boolean))
      );
      return cities.sort();
    } catch (error) {
      console.error('Error fetching unique cities:', error);
      return [];
    }
  }

  static async getUniqueProvinces(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('dim_pln_locations')
        .select('province')
        .eq('is_active', true);

      if (error) throw error;

      const provinces = Array.from(
        new Set((data || []).map(l => l.province).filter(Boolean))
      );
      return provinces.sort();
    } catch (error) {
      console.error('Error fetching unique provinces:', error);
      return [];
    }
  }

  static formatLocationForDisplay(location: PLNLocation): string {
    return `${location.facility_name} - ${location.address}, ${location.city}, ${location.province}`;
  }

  static formatLocationShort(location: PLNLocation): string {
    return `${location.facility_name} (${location.city})`;
  }

  static getLocationCoordinates(location: PLNLocation): { lat: number; lng: number } | null {
    if (location.latitude && location.longitude) {
      return {
        lat: location.latitude,
        lng: location.longitude
      };
    }
    return null;
  }
}
