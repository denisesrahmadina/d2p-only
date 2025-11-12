/**
 * Demand Service
 * Handles all demand-related operations including forecasting, consolidation, and netting
 * Uses existing ERP tables: demand, forecast, inventory_snapshot, purchase_order
 */

import { supabase } from '../supabaseClient';

export interface DemandForecast {
  demand_id?: number;
  demand_type: 'UNIT' | 'CONSOLIDATED' | 'ADJUSTED' | 'NETT' | 'PROJECTED';
  material_id: string;
  unit_requestor_id?: string;
  requirement_date: string;
  demand_qty: number;
  is_selected_for_procurement: boolean;
}

export interface ForecastResult {
  id?: number;
  material_id: string;
  proyeksi_qty: number;
  requirement_date: string;
}

export interface InventorySnapshot {
  material_id: string;
  storage_location_id: string;
  stock_qty: number;
  snapshot_date: string;
}

export interface NettingResult {
  material_id: string;
  total_demand: number;
  available_stock: number;
  open_po_qty: number;
  net_requirement: number;
}

class DemandService {
  /**
   * Generate AI-powered demand forecast based on historical data
   * Uses ERP data and AI algorithms to predict future demand
   */
  async generateDemandForecast(params: {
    startDate: string;
    endDate: string;
    materialIds?: string[];
  }): Promise<ForecastResult[]> {
    try {
      // TODO: Replace with agentConsoleService when integration is ready
      // For now, use rule-based forecasting with historical data

      let query = supabase
        .from('demand')
        .select('material_id, demand_qty, requirement_date')
        .gte('requirement_date', params.startDate)
        .lte('requirement_date', params.endDate);

      if (params.materialIds && params.materialIds.length > 0) {
        query = query.in('material_id', params.materialIds);
      }

      const { data: historicalDemand, error } = await query;

      if (error) throw error;

      // Aggregate and project forward
      const forecastMap = new Map<string, Map<string, number>>();

      historicalDemand?.forEach((record) => {
        if (!forecastMap.has(record.material_id)) {
          forecastMap.set(record.material_id, new Map());
        }
        const materialMap = forecastMap.get(record.material_id)!;
        const month = record.requirement_date.substring(0, 7); // YYYY-MM
        const current = materialMap.get(month) || 0;
        materialMap.set(month, current + (record.demand_qty || 0));
      });

      // Convert to forecast results
      const forecasts: ForecastResult[] = [];
      forecastMap.forEach((monthMap, materialId) => {
        monthMap.forEach((qty, month) => {
          forecasts.push({
            material_id: materialId,
            proyeksi_qty: qty,
            requirement_date: `${month}-01`
          });
        });
      });

      return forecasts;
    } catch (error) {
      console.error('Error generating demand forecast:', error);
      throw error;
    }
  }

  /**
   * Save forecast results to database
   */
  async saveForecastResults(forecasts: ForecastResult[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('demand_forecast_result')
        .upsert(forecasts, {
          onConflict: 'material_id,requirement_date'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving forecast results:', error);
      throw error;
    }
  }

  /**
   * Get saved forecast results
   */
  async getForecastResults(params: {
    startDate: string;
    endDate: string;
    materialIds?: string[];
  }): Promise<ForecastResult[]> {
    try {
      let query = supabase
        .from('demand_forecast_result')
        .select('*')
        .gte('requirement_date', params.startDate)
        .lte('requirement_date', params.endDate)
        .order('requirement_date', { ascending: true });

      if (params.materialIds && params.materialIds.length > 0) {
        query = query.in('material_id', params.materialIds);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching forecast results:', error);
      throw error;
    }
  }

  /**
   * Consolidate demand from multiple sources
   * Combines AI forecast with manual uploads
   */
  async consolidateDemand(params: {
    aiForecast: ForecastResult[];
    manualForecast: ForecastResult[];
  }): Promise<ForecastResult[]> {
    const consolidated = new Map<string, ForecastResult>();

    // Add AI forecast
    params.aiForecast.forEach((forecast) => {
      const key = `${forecast.material_id}-${forecast.requirement_date}`;
      consolidated.set(key, { ...forecast });
    });

    // Merge manual forecast (manual takes precedence)
    params.manualForecast.forEach((forecast) => {
      const key = `${forecast.material_id}-${forecast.requirement_date}`;
      const existing = consolidated.get(key);

      if (existing) {
        // Average or use manual value based on business logic
        consolidated.set(key, {
          ...existing,
          proyeksi_qty: forecast.proyeksi_qty // Manual overrides
        });
      } else {
        consolidated.set(key, { ...forecast });
      }
    });

    return Array.from(consolidated.values());
  }

  /**
   * Perform demand netting calculation
   * Net Requirement = Total Demand - Available Stock - Open PO
   */
  async calculateNetting(params: {
    materialIds: string[];
    requirementDate: string;
  }): Promise<NettingResult[]> {
    try {
      // Get demand
      const { data: demandData } = await supabase
        .from('demand')
        .select('material_id, demand_qty')
        .in('material_id', params.materialIds)
        .eq('requirement_date', params.requirementDate);

      // Get inventory
      const { data: inventoryData } = await supabase
        .from('inventory_snapshot')
        .select('material_id, stock_qty')
        .in('material_id', params.materialIds)
        .order('snapshot_date', { ascending: false })
        .limit(params.materialIds.length);

      // Get open POs
      const { data: poData } = await supabase
        .from('purchase_order')
        .select('material_id, qty_ordered, qty_received')
        .in('material_id', params.materialIds)
        .eq('po_status', 'OPEN');

      // Calculate netting
      const nettingMap = new Map<string, NettingResult>();

      params.materialIds.forEach((materialId) => {
        const totalDemand = demandData
          ?.filter((d) => d.material_id === materialId)
          .reduce((sum, d) => sum + (d.demand_qty || 0), 0) || 0;

        const availableStock = inventoryData
          ?.find((inv) => inv.material_id === materialId)?.stock_qty || 0;

        const openPoQty = poData
          ?.filter((po) => po.material_id === materialId)
          .reduce((sum, po) => sum + ((po.qty_ordered || 0) - (po.qty_received || 0)), 0) || 0;

        const netRequirement = Math.max(0, totalDemand - availableStock - openPoQty);

        nettingMap.set(materialId, {
          material_id: materialId,
          total_demand: totalDemand,
          available_stock: availableStock,
          open_po_qty: openPoQty,
          net_requirement: netRequirement
        });
      });

      return Array.from(nettingMap.values());
    } catch (error) {
      console.error('Error calculating netting:', error);
      throw error;
    }
  }

  /**
   * Get demand summary statistics
   */
  async getDemandSummary(params: {
    startDate: string;
    endDate: string;
  }): Promise<{
    totalDemandQty: number;
    uniqueMaterials: number;
    avgDemandPerMaterial: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('demand')
        .select('material_id, demand_qty')
        .gte('requirement_date', params.startDate)
        .lte('requirement_date', params.endDate);

      if (error) throw error;

      const totalDemandQty = data?.reduce((sum, d) => sum + (d.demand_qty || 0), 0) || 0;
      const uniqueMaterials = new Set(data?.map((d) => d.material_id)).size;
      const avgDemandPerMaterial = uniqueMaterials > 0 ? totalDemandQty / uniqueMaterials : 0;

      return {
        totalDemandQty,
        uniqueMaterials,
        avgDemandPerMaterial
      };
    } catch (error) {
      console.error('Error getting demand summary:', error);
      throw error;
    }
  }

  /**
   * Create procurement request (DRP) from netting results
   */
  async generateDRP(nettingResults: NettingResult[]): Promise<any[]> {
    const drpRecords = nettingResults
      .filter((result) => result.net_requirement > 0)
      .map((result) => ({
        material_id: result.material_id,
        requested_qty: result.net_requirement,
        requirement_type: 'DRP',
        status: 'DRAFT',
        created_date: new Date().toISOString()
      }));

    try {
      const { data, error } = await supabase
        .from('procurement_request')
        .insert(drpRecords)
        .select();

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error generating DRP:', error);
      throw error;
    }
  }
}

export const demandService = new DemandService();
