import { supabase } from './supabaseClient';
import {
  InventoryTolerance,
  MaterialToleranceDetail,
  ToleranceStatus,
  ToleranceStats,
  ToleranceStatusInfo,
  UnitLocationWithTolerance
} from '../types/inventoryTolerance';

export class InventoryToleranceService {
  static async getAllToleranceMetrics(): Promise<InventoryTolerance[]> {
    try {
      const { data, error } = await supabase
        .from('inventory_planning_tolerance')
        .select('*')
        .order('tolerance_percentage', { ascending: false });

      if (error) {
        console.error('Error fetching tolerance metrics:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllToleranceMetrics:', error);
      return [];
    }
  }

  static async getToleranceByUnitId(unitId: string): Promise<InventoryTolerance | null> {
    try {
      const { data, error } = await supabase
        .from('inventory_planning_tolerance')
        .select('*')
        .eq('unit_id', unitId)
        .order('measurement_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching tolerance by unit_id:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getToleranceByUnitId:', error);
      return null;
    }
  }

  static async getIncompliantMaterialsByUnitId(unitId: string): Promise<MaterialToleranceDetail[]> {
    try {
      const { data, error } = await supabase
        .from('material_tolerance_details')
        .select('*')
        .eq('unit_id', unitId)
        .eq('is_compliant', false)
        .order('tolerance_percentage', { ascending: true });

      if (error) {
        console.error('Error fetching incompliant materials:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getIncompliantMaterialsByUnitId:', error);
      return [];
    }
  }

  static async getAllUnitLocationsWithTolerance(): Promise<UnitLocationWithTolerance[]> {
    try {
      // Filter to get only the 28 standardized Business Units with complete data
      const { data: locations, error: locationsError } = await supabase
        .from('unit_locations')
        .select('*')
        .not('province', 'is', null)
        .not('region', 'is', null)
        .like('name', 'UBP %')
        .order('name', { ascending: true });

      if (locationsError) {
        console.error('Error fetching unit locations:', locationsError);
        throw locationsError;
      }

      if (!locations || locations.length === 0) return [];

      // Get all tolerance data
      const { data: toleranceData, error: toleranceError } = await supabase
        .from('inventory_planning_tolerance')
        .select('*');

      if (toleranceError) {
        console.error('Error fetching tolerance data:', toleranceError);
        // Continue even if tolerance data fails
      }

      const results: UnitLocationWithTolerance[] = [];

      for (const location of locations) {
        // Find matching tolerance data for this unit
        const tolerance = toleranceData?.find(t => t.unit_id === location.unit_id);

        if (tolerance) {
          // Get incompliant materials for this unit
          const incompliantMaterials = await this.getIncompliantMaterialsByUnitId(location.unit_id);

          results.push({
            id: location.id,
            unit_id: location.unit_id,
            name: location.name,
            type: location.type || 'power_plant',
            full_name: location.name, // Using 'name' as full_name if not available
            address: location.address || '',
            city: '', // Not in schema, set empty
            province: location.province || '',
            region: location.region || '',
            latitude: location.latitude,
            longitude: location.longitude,
            capacity_mw: null, // Not visible in schema
            plant_type: null, // Not visible in schema
            commission_year: null, // Not visible in schema
            tolerance_percentage: tolerance.tolerance_percentage,
            materials_out_of_tolerance: tolerance.materials_out_of_tolerance,
            total_materials: tolerance.total_materials,
            tolerance_status: tolerance.status,
            incompliant_materials: incompliantMaterials
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error in getAllUnitLocationsWithTolerance:', error);
      return [];
    }
  }

  static getToleranceStatus(tolerancePercentage: number): ToleranceStatus {
    if (tolerancePercentage > 95) return 'excellent';
    if (tolerancePercentage >= 90 && tolerancePercentage <= 95) return 'good';
    return 'needs-attention';
  }

  static getToleranceStatusInfo(tolerancePercentage: number): ToleranceStatusInfo {
    const status = this.getToleranceStatus(tolerancePercentage);

    const statusMap: Record<ToleranceStatus, ToleranceStatusInfo> = {
      'excellent': {
        status: 'excellent',
        label: 'Excellent',
        color: 'text-green-600 dark:text-green-400',
        markerColor: '#22c55e',
        range: '> 95%'
      },
      'good': {
        status: 'good',
        label: 'Good',
        color: 'text-yellow-600 dark:text-yellow-400',
        markerColor: '#eab308',
        range: '90-95%'
      },
      'needs-attention': {
        status: 'needs-attention',
        label: 'Needs Attention',
        color: 'text-red-600 dark:text-red-400',
        markerColor: '#ef4444',
        range: '< 90%'
      }
    };

    return statusMap[status];
  }

  static calculateToleranceStats(locations: UnitLocationWithTolerance[]): ToleranceStats {
    const total = locations.length;
    const excellent = locations.filter(
      loc => this.getToleranceStatus(loc.tolerance_percentage) === 'excellent'
    ).length;
    const good = locations.filter(
      loc => this.getToleranceStatus(loc.tolerance_percentage) === 'good'
    ).length;
    const needsAttention = locations.filter(
      loc => this.getToleranceStatus(loc.tolerance_percentage) === 'needs-attention'
    ).length;

    return {
      total,
      excellent,
      good,
      needsAttention
    };
  }
}
