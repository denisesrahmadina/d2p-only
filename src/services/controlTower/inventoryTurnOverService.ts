import { supabase } from '../supabaseClient';

export interface CriticalMaterial {
  material_id: string;
  material_name: string;
  material_code: string;
  category: string;
  description: string;
  is_critical: boolean;
  threshold_days: number;
  threshold_turnover_ratio: number;
  created_at?: string;
  updated_at?: string;
}

export interface MaterialInventoryTurnOver {
  id: string;
  material_id: string;
  unit_id: string;
  period_month: number;
  period_year: number;
  consumption_quantity: number;
  average_inventory: number;
  turnover_ratio: number;
  turnover_days: number; // Deprecated, kept for backward compatibility
  stock_quantity: number;
  demand_rate: number;
  last_replenishment_date: string;
  status: 'normal' | 'warning' | 'critical';
  measurement_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface UnitTurnOverData extends MaterialInventoryTurnOver {
  unit_name?: string;
  unit_province?: string;
  unit_region?: string;
}

export interface UnitLocationWithTurnover {
  id: string;
  unit_id: string;
  name: string;
  type: string;
  full_name: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  region: string | null;
  latitude: number;
  longitude: number;
  capacity_mw: number | null;
  plant_type: string | null;
  commission_year: number | null;
  turnover_ratio: number;
  consumption_quantity: number;
  average_inventory: number;
  turnover_status: 'excellent' | 'good' | 'needs-attention';
  material_count: number;
  materials_below_threshold: number;
}

export interface TurnoverStats {
  total: number;
  excellent: number;
  good: number;
  needsAttention: number;
}

export interface MaterialWithUnits extends CriticalMaterial {
  units: UnitTurnOverData[];
  averageTurnoverRatio: number;
  averageTurnoverDays: number; // Deprecated
  unitsAboveThreshold: number; // Low turnover ratio = problem (slow moving)
  unitsBelowThreshold: number; // Low turnover ratio = problem (slow moving)
  totalUnits: number;
}

export class InventoryTurnOverService {
  static async getAllCriticalMaterials(): Promise<CriticalMaterial[]> {
    try {
      const { data, error } = await supabase
        .from('critical_materials')
        .select('*')
        .eq('is_critical', true)
        .order('material_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching critical materials:', error);
      return [];
    }
  }

  static async getMaterialInventoryTurnOver(
    materialId: string,
    month?: number,
    year?: number
  ): Promise<UnitTurnOverData[]> {
    try {
      let query = supabase
        .from('material_inventory_turnover')
        .select(`
          *,
          unit_locations:unit_id (
            name,
            province,
            region
          )
        `)
        .eq('material_id', materialId);

      // If month and year are provided, filter by measurement_date
      if (month && year) {
        // Filter for dates within the specified month and year
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of month
        query = query.gte('measurement_date', startDate).lte('measurement_date', endDate);
      } else {
        // Otherwise get the latest measurement_date records
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];
        query = query.gte('measurement_date', startOfMonth).lte('measurement_date', endOfMonth);
      }

      query = query.order('turnover_days', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map((item: any) => ({
        id: item.id,
        material_id: item.material_id,
        unit_id: item.unit_id,
        turnover_days: item.turnover_days,
        stock_quantity: item.stock_quantity,
        demand_rate: item.demand_rate,
        last_replenishment_date: item.last_replenishment_date,
        status: item.status,
        measurement_date: item.measurement_date,
        created_at: item.created_at,
        updated_at: item.updated_at,
        unit_name: item.unit_locations?.name,
        unit_province: item.unit_locations?.province,
        unit_region: item.unit_locations?.region
      }));
    } catch (error) {
      console.error('Error fetching material inventory turnover:', error);
      return [];
    }
  }

  static async getMaterialWithUnits(
    materialId: string,
    month?: number,
    year?: number
  ): Promise<MaterialWithUnits | null> {
    try {
      const [material, units] = await Promise.all([
        this.getCriticalMaterialById(materialId),
        this.getMaterialInventoryTurnOver(materialId, month, year)
      ]);

      if (!material) return null;

      const averageTurnoverDays = units.length > 0
        ? units.reduce((sum, unit) => sum + unit.turnover_days, 0) / units.length
        : 0;

      // Units with turnover days above threshold are problematic (slow moving inventory)
      const unitsAboveThreshold = units.filter(
        unit => unit.turnover_days > (material.threshold_days || 30)
      ).length;

      return {
        ...material,
        units,
        averageTurnoverDays: Math.round(averageTurnoverDays * 100) / 100,
        unitsAboveThreshold,
        totalUnits: units.length
      };
    } catch (error) {
      console.error('Error fetching material with units:', error);
      return null;
    }
  }

  static async getAllMaterialsWithUnits(month?: number, year?: number): Promise<MaterialWithUnits[]> {
    try {
      const materials = await this.getAllCriticalMaterials();

      const materialsWithUnits = await Promise.all(
        materials.map(async (material) => {
          const units = await this.getMaterialInventoryTurnOver(material.material_id, month, year);

          const averageTurnoverDays = units.length > 0
            ? units.reduce((sum, unit) => sum + unit.turnover_days, 0) / units.length
            : 0;

          const unitsAboveThreshold = units.filter(
            unit => unit.turnover_days > (material.threshold_days || 30)
          ).length;

          return {
            ...material,
            units,
            averageTurnoverDays: Math.round(averageTurnoverDays * 100) / 100,
            unitsAboveThreshold,
            totalUnits: units.length
          };
        })
      );

      return materialsWithUnits;
    } catch (error) {
      console.error('Error fetching all materials with units:', error);
      return [];
    }
  }

  static async getCriticalMaterialById(materialId: string): Promise<CriticalMaterial | null> {
    try {
      const { data, error } = await supabase
        .from('critical_materials')
        .select('*')
        .eq('material_id', materialId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching critical material:', error);
      return null;
    }
  }

  static async updateInventoryTurnOver(
    id: string,
    updates: Partial<MaterialInventoryTurnOver>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('material_inventory_turnover')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating inventory turnover:', error);
      return false;
    }
  }

  static async createInventoryTurnOver(
    data: Omit<MaterialInventoryTurnOver, 'id' | 'created_at' | 'updated_at'>
  ): Promise<MaterialInventoryTurnOver | null> {
    try {
      const { data: created, error } = await supabase
        .from('material_inventory_turnover')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return created;
    } catch (error) {
      console.error('Error creating inventory turnover:', error);
      return null;
    }
  }

  static getStatusColor(status: string): {
    bg: string;
    text: string;
    border: string;
    dot: string;
  } {
    switch (status) {
      case 'normal':
        return {
          bg: 'bg-green-50 dark:bg-green-950/30',
          text: 'text-green-700 dark:text-green-300',
          border: 'border-green-200 dark:border-green-800',
          dot: 'bg-green-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-950/30',
          text: 'text-yellow-700 dark:text-yellow-300',
          border: 'border-yellow-200 dark:border-yellow-800',
          dot: 'bg-yellow-500'
        };
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-950/30',
          text: 'text-red-700 dark:text-red-300',
          border: 'border-red-200 dark:border-red-800',
          dot: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-200 dark:border-gray-700',
          dot: 'bg-gray-500'
        };
    }
  }

  static getStatusLabel(status: string): string {
    switch (status) {
      case 'normal':
        return 'Normal';
      case 'warning':
        return 'Warning';
      case 'critical':
        return 'Critical';
      default:
        return 'Unknown';
    }
  }

  static calculateTurnoverRatio(
    consumptionQuantity: number,
    averageInventory: number
  ): number {
    if (averageInventory === 0) return 0;
    return Math.round((consumptionQuantity / averageInventory) * 100) / 100;
  }

  static async getAllUnitLocationsWithTurnover(
    month?: number,
    year?: number
  ): Promise<UnitLocationWithTurnover[]> {
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

      console.log(`Fetched ${locations.length} unit locations.`);
      
      let turnoverQuery = supabase
        .from('material_inventory_turnover')
        .select('*');

      if (month && year) {
        turnoverQuery = turnoverQuery
          .eq('period_month', month)
          .eq('period_year', year);
      } else {
        // Default to November 2025 where we have comprehensive data
        turnoverQuery = turnoverQuery
          .eq('period_month', 11)
          .eq('period_year', 2025);
      }

      const { data: turnoverData, error: turnoverError } = await turnoverQuery;

      if (turnoverError) {
        console.error('Error fetching turnover data:', turnoverError);
      }

      const results: UnitLocationWithTurnover[] = [];

      for (const location of locations) {
        // Filter turnover data for this specific unit
        const unitTurnoverRecords = (turnoverData || []).filter(
          record => record.unit_id === location.unit_id
        );

        if (unitTurnoverRecords.length > 0) {
          const avgTurnoverRatio = unitTurnoverRecords.reduce((sum, r) => sum + (r.turnover_ratio || 0), 0) / unitTurnoverRecords.length;
          const avgConsumption = unitTurnoverRecords.reduce((sum, r) => sum + (r.consumption_quantity || 0), 0) / unitTurnoverRecords.length;
          const avgInventory = unitTurnoverRecords.reduce((sum, r) => sum + (r.average_inventory || 0), 0) / unitTurnoverRecords.length;

          const materialsBelowThreshold = unitTurnoverRecords.filter(r => (r.turnover_ratio || 0) < 7.0).length;
          const turnoverStatus = this.getTurnoverStatus(avgTurnoverRatio);

          results.push({
            id: location.id,
            unit_id: location.unit_id,
            name: location.name,
            type: location.type || 'power_plant',
            full_name: location.name,
            address: location.address || '',
            city: '',
            province: location.province || '',
            region: location.region || '',
            latitude: location.latitude,
            longitude: location.longitude,
            capacity_mw: null,
            plant_type: null,
            commission_year: null,
            turnover_ratio: Math.round(avgTurnoverRatio * 100) / 100,
            consumption_quantity: Math.round(avgConsumption * 100) / 100,
            average_inventory: Math.round(avgInventory * 100) / 100,
            turnover_status: turnoverStatus,
            material_count: unitTurnoverRecords.length,
            materials_below_threshold: materialsBelowThreshold
          });
        } else {
          // If no turnover data, generate varied random values for demo purposes
          const randomTurnoverRatio = this.generateRandomTurnoverRatio();
          const randomConsumption = Math.random() * 5000 + 1000;
          const randomInventory = randomConsumption / randomTurnoverRatio;
          const turnoverStatus = this.getTurnoverStatus(randomTurnoverRatio);

          results.push({
            id: location.id,
            unit_id: location.unit_id,
            name: location.name,
            type: location.type || 'power_plant',
            full_name: location.name,
            address: location.address || '',
            city: '',
            province: location.province || '',
            region: location.region || '',
            latitude: location.latitude,
            longitude: location.longitude,
            capacity_mw: null,
            plant_type: null,
            commission_year: null,
            turnover_ratio: Math.round(randomTurnoverRatio * 100) / 100,
            consumption_quantity: Math.round(randomConsumption * 100) / 100,
            average_inventory: Math.round(randomInventory * 100) / 100,
            turnover_status: turnoverStatus,
            material_count: 0,
            materials_below_threshold: 0
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error in getAllUnitLocationsWithTurnover:', error);
      return [];
    }
  }

  static getTurnoverStatus(turnoverRatio: number): 'excellent' | 'good' | 'needs-attention' {
    if (turnoverRatio >= 13.0) return 'excellent';
    if (turnoverRatio >= 7.0) return 'good';
    return 'needs-attention';
  }

  static generateRandomTurnoverRatio(): number {
    // Generate varied turnover ratios across different ranges
    const rand = Math.random();
    
    if (rand < 0.15) {
      // 15% Excellent (≥13)
      return Math.round((13 + Math.random() * 5) * 100) / 100; // 13-18
    } else if (rand < 0.50) {
      // 35% Good (7-13)
      return Math.round((7 + Math.random() * 6) * 100) / 100; // 7-13
    } else {
      // 50% Needs Attention (<7)
      return Math.round((2 + Math.random() * 5) * 100) / 100; // 2-7
    }
  }

  static getTurnoverStatusInfo(turnoverRatio: number): {
    status: 'excellent' | 'good' | 'needs-attention';
    label: string;
    color: string;
    markerColor: string;
    range: string;
  } {
    const status = this.getTurnoverStatus(turnoverRatio);

    const statusMap = {
      'excellent': {
        status: 'excellent' as const,
        label: 'Excellent',
        color: 'text-green-600 dark:text-green-400',
        markerColor: '#22c55e',
        range: '≥13'
      },
      'good': {
        status: 'good' as const,
        label: 'Good',
        color: 'text-yellow-600 dark:text-yellow-400',
        markerColor: '#eab308',
        range: '7-13'
      },
      'needs-attention': {
        status: 'needs-attention' as const,
        label: 'Needs Attention',
        color: 'text-red-600 dark:text-red-400',
        markerColor: '#ef4444',
        range: '<7'
      }
    };

    return statusMap[status];
  }

  static calculateTurnoverStats(locations: UnitLocationWithTurnover[]): TurnoverStats {
    const total = locations.length;
    const excellent = locations.filter(
      loc => this.getTurnoverStatus(loc.turnover_ratio) === 'excellent'
    ).length;
    const good = locations.filter(
      loc => this.getTurnoverStatus(loc.turnover_ratio) === 'good'
    ).length;
    const needsAttention = locations.filter(
      loc => this.getTurnoverStatus(loc.turnover_ratio) === 'needs-attention'
    ).length;

    return {
      total,
      excellent,
      good,
      needsAttention
    };
  }

  static getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || 'Unknown';
  }

  static getPeriodLabel(month: number, year: number): string {
    return `${this.getMonthName(month)} ${year}`;
  }

  static async getAvailablePeriods(): Promise<{ month: number; year: number }[]> {
    try {
      const { data, error } = await supabase
        .from('material_inventory_turnover')
        .select('measurement_date')
        .order('measurement_date', { ascending: false });

      if (error) throw error;

      // Get unique periods from measurement_date
      const uniquePeriods = Array.from(
        new Set(data?.map(d => {
          const date = new Date(d.measurement_date);
          return `${date.getFullYear()}-${date.getMonth() + 1}`;
        }))
      ).map(period => {
        const [year, month] = period.split('-');
        return { month: parseInt(month), year: parseInt(year) };
      });

      return uniquePeriods;
    } catch (error) {
      console.error('Error fetching available periods:', error);
      return [];
    }
  }
}
