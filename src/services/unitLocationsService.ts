import { supabase } from './supabaseClient';
import { UnitLocation, UnitLocationFilter, HealthStatus, HealthStatusInfo } from '../types/unitLocation';

export class UnitLocationsService {
  static async getAllUnitLocations(): Promise<UnitLocation[]> {
    try {
      const { data, error } = await supabase
        .from('unit_locations')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching unit locations:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllUnitLocations:', error);
      return [];
    }
  }

  static async getUnitLocationById(id: string): Promise<UnitLocation | null> {
    try {
      const { data, error } = await supabase
        .from('unit_locations')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching unit location by id:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getUnitLocationById:', error);
      return null;
    }
  }

  static async getUnitLocationByUnitId(unitId: string): Promise<UnitLocation | null> {
    try {
      const { data, error } = await supabase
        .from('unit_locations')
        .select('*')
        .eq('unit_id', unitId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching unit location by unit_id:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getUnitLocationByUnitId:', error);
      return null;
    }
  }

  static async filterUnitLocations(filter: UnitLocationFilter): Promise<UnitLocation[]> {
    try {
      let query = supabase
        .from('unit_locations')
        .select('*')
        .eq('is_active', true);

      if (filter.search) {
        const searchTerm = `%${filter.search}%`;
        query = query.or(`name.ilike.${searchTerm},full_name.ilike.${searchTerm},city.ilike.${searchTerm},province.ilike.${searchTerm}`);
      }

      if (filter.healthStatus && filter.healthStatus !== 'all') {
        const { min, max } = this.getHealthIndexRange(filter.healthStatus);
        query = query.gte('health_index', min).lte('health_index', max);
      }

      if (filter.region) {
        query = query.eq('region', filter.region);
      }

      if (filter.province) {
        query = query.eq('province', filter.province);
      }

      if (filter.type) {
        query = query.eq('type', filter.type);
      }

      query = query.order('name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error filtering unit locations:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in filterUnitLocations:', error);
      return [];
    }
  }

  static getHealthStatus(healthIndex: number): HealthStatus {
    if (healthIndex >= 85) return 'excellent';
    if (healthIndex >= 70) return 'good';
    return 'needs-attention';
  }

  static getHealthStatusInfo(healthIndex: number): HealthStatusInfo {
    const status = this.getHealthStatus(healthIndex);

    const statusMap: Record<HealthStatus, HealthStatusInfo> = {
      'excellent': {
        status: 'excellent',
        label: 'Excellent',
        color: 'text-green-600 dark:text-green-400',
        markerColor: '#22c55e',
        range: '85-100'
      },
      'good': {
        status: 'good',
        label: 'Good',
        color: 'text-yellow-600 dark:text-yellow-400',
        markerColor: '#eab308',
        range: '70-84.9'
      },
      'needs-attention': {
        status: 'needs-attention',
        label: 'Needs Attention',
        color: 'text-red-600 dark:text-red-400',
        markerColor: '#ef4444',
        range: '<70'
      }
    };

    return statusMap[status];
  }

  static getHealthIndexRange(status: HealthStatus): { min: number; max: number } {
    switch (status) {
      case 'excellent':
        return { min: 85, max: 100 };
      case 'good':
        return { min: 70, max: 84.99 };
      case 'needs-attention':
        return { min: 0, max: 69.99 };
      default:
        return { min: 0, max: 100 };
    }
  }

  static async getUnitLocationStats() {
    try {
      const locations = await this.getAllUnitLocations();

      const stats = {
        total: locations.length,
        excellent: locations.filter(loc => this.getHealthStatus(loc.health_index) === 'excellent').length,
        good: locations.filter(loc => this.getHealthStatus(loc.health_index) === 'good').length,
        needsAttention: locations.filter(loc => this.getHealthStatus(loc.health_index) === 'needs-attention').length,
        averageHealthIndex: locations.length > 0
          ? locations.reduce((sum, loc) => sum + loc.health_index, 0) / locations.length
          : 0,
        totalCapacityMW: locations.reduce((sum, loc) => sum + (loc.capacity_mw || 0), 0),
        byRegion: this.groupByRegion(locations),
        byProvince: this.groupByProvince(locations),
        byPlantType: this.groupByPlantType(locations)
      };

      return stats;
    } catch (error) {
      console.error('Error calculating unit location stats:', error);
      return null;
    }
  }

  static groupByRegion(locations: UnitLocation[]) {
    return locations.reduce((acc, loc) => {
      const region = loc.region || 'Unknown';
      if (!acc[region]) {
        acc[region] = { count: 0, totalCapacity: 0, avgHealthIndex: 0, locations: [] };
      }
      acc[region].count++;
      acc[region].totalCapacity += loc.capacity_mw || 0;
      acc[region].locations.push(loc);
      return acc;
    }, {} as Record<string, { count: number; totalCapacity: number; avgHealthIndex: number; locations: UnitLocation[] }>);
  }

  static groupByProvince(locations: UnitLocation[]) {
    return locations.reduce((acc, loc) => {
      const province = loc.province || 'Unknown';
      if (!acc[province]) {
        acc[province] = { count: 0, totalCapacity: 0, locations: [] };
      }
      acc[province].count++;
      acc[province].totalCapacity += loc.capacity_mw || 0;
      acc[province].locations.push(loc);
      return acc;
    }, {} as Record<string, { count: number; totalCapacity: number; locations: UnitLocation[] }>);
  }

  static groupByPlantType(locations: UnitLocation[]) {
    return locations.reduce((acc, loc) => {
      const plantType = loc.plant_type || 'Unknown';
      if (!acc[plantType]) {
        acc[plantType] = { count: 0, totalCapacity: 0 };
      }
      acc[plantType].count++;
      acc[plantType].totalCapacity += loc.capacity_mw || 0;
      return acc;
    }, {} as Record<string, { count: number; totalCapacity: number }>);
  }

  static getUniqueRegions(locations: UnitLocation[]): string[] {
    const regions = new Set(locations.map(loc => loc.region).filter(Boolean));
    return Array.from(regions).sort();
  }

  static getUniqueProvinces(locations: UnitLocation[]): string[] {
    const provinces = new Set(locations.map(loc => loc.province).filter(Boolean));
    return Array.from(provinces).sort();
  }

  static getUniqueTypes(locations: UnitLocation[]): string[] {
    const types = new Set(locations.map(loc => loc.type).filter(Boolean));
    return Array.from(types).sort();
  }
}
