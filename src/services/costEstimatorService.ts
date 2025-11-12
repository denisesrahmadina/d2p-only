import { supabase } from './supabaseClient';

export interface Item {
  id: string;
  item_code: string;
  item_name: string;
  category: string;
  sub_category: string | null;
  unit_of_measure: string;
  description: string | null;
  image_url: string | null;
  dataset: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CostStructure {
  id: string;
  item_id: string;
  material_percentage: number;
  labor_percentage: number;
  logistics_percentage: number;
  overhead_percentage: number;
  effective_date: string;
  historical_avg_material: number | null;
  historical_avg_labor: number | null;
  historical_avg_logistics: number | null;
  historical_avg_overhead: number | null;
  ai_recommendation: string | null;
  variance_from_avg: number | null;
  created_at: string;
  updated_at: string;
}

export interface CostVariable {
  id: string;
  variable_code: string;
  variable_name: string;
  variable_type: string;
  current_rate: number;
  rate_date: string;
  previous_rate: number | null;
  rate_change_percentage: number | null;
  unit: string | null;
  source_reference: string | null;
  is_alert_active: boolean;
  alert_type: string | null;
  created_at: string;
}

export interface MIReference {
  id: string;
  reference_code: string;
  title: string;
  document_type: string;
  source: string;
  publish_date: string;
  document_url: string | null;
  summary: string | null;
  key_insights: any;
  related_variables: string[] | null;
  created_at: string;
}

export interface CostModelReference {
  id: string;
  reference_code: string;
  item_id: string;
  reference_type: string;
  reference_source: string;
  reference_date: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  material_cost: number | null;
  labor_cost: number | null;
  logistics_cost: number | null;
  overhead_cost: number | null;
  vendor_name: string | null;
  contract_number: string | null;
  notes: string | null;
  created_at: string;
}

export interface CostBaseline {
  id: string;
  item_id: string;
  baseline_name: string;
  baseline_type: string;
  reference_source: string;
  quantity: number;
  base_unit_cost: number;
  material_cost: number;
  labor_cost: number;
  logistics_cost: number;
  overhead_cost: number;
  total_baseline_cost: number;
  calculation_formula: string | null;
  applied_variables: any;
  effective_date: string;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
}

export interface CostForecast {
  id: string;
  item_id: string;
  baseline_id: string;
  forecast_month: string;
  forecasted_unit_cost: number;
  forecasted_total_cost: number;
  confidence_level: string | null;
  scenario_type: string;
  material_cost_forecast: number | null;
  labor_cost_forecast: number | null;
  logistics_cost_forecast: number | null;
  overhead_cost_forecast: number | null;
  applied_assumptions: any;
  created_at: string;
}

export interface AIInsight {
  id: string;
  insight_code: string;
  insight_type: string;
  priority_level: string;
  title: string;
  description: string;
  affected_items: string[] | null;
  affected_variables: string[] | null;
  recommendation: string | null;
  potential_impact_percentage: number | null;
  confidence_score: number | null;
  source_reference_id: string | null;
  is_active: boolean;
  generated_at: string;
  expires_at: string | null;
  created_at: string;
}

export interface ItemWithCostData extends Item {
  currentShouldCost?: number;
  historicalCost?: number;
  costTrend?: number[];
  deviationPercentage?: number;
}

class CostEstimatorService {
  async getAllItems(filters?: { category?: string; dataset?: string }): Promise<Item[]> {
    try {
      let query = supabase
        .from('dim_item')
        .select('*')
        .eq('is_active', true)
        .order('item_name');

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.dataset) {
        query = query.eq('dataset', filters.dataset);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  }

  async getItemById(itemId: string): Promise<Item | null> {
    try {
      const { data, error } = await supabase
        .from('dim_item')
        .select('*')
        .eq('id', itemId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching item:', error);
      return null;
    }
  }

  async getCostStructureByItemId(itemId: string): Promise<CostStructure | null> {
    try {
      const { data, error } = await supabase
        .from('fact_cost_structure_standard')
        .select('*')
        .eq('item_id', itemId)
        .order('effective_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching cost structure:', error);
      return null;
    }
  }

  async getAllCostVariables(): Promise<CostVariable[]> {
    try {
      const { data, error } = await supabase
        .from('fact_cost_variable')
        .select('*')
        .order('variable_type', { ascending: true })
        .order('rate_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching cost variables:', error);
      return [];
    }
  }

  async getCostVariablesByType(type: string): Promise<CostVariable[]> {
    try {
      const { data, error } = await supabase
        .from('fact_cost_variable')
        .select('*')
        .eq('variable_type', type)
        .order('rate_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching cost variables by type:', error);
      return [];
    }
  }

  async getActiveAlerts(): Promise<CostVariable[]> {
    try {
      const { data, error } = await supabase
        .from('fact_cost_variable')
        .select('*')
        .eq('is_alert_active', true)
        .order('rate_change_percentage', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      return [];
    }
  }

  async getMIReference(referenceCode: string): Promise<MIReference | null> {
    try {
      const { data, error } = await supabase
        .from('fact_mi_reference')
        .select('*')
        .eq('reference_code', referenceCode)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching MI reference:', error);
      return null;
    }
  }

  async getAllMIReferences(): Promise<MIReference[]> {
    try {
      const { data, error } = await supabase
        .from('fact_mi_reference')
        .select('*')
        .order('publish_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching MI references:', error);
      return [];
    }
  }

  async getCostModelReferencesByItemId(itemId: string): Promise<CostModelReference[]> {
    try {
      const { data, error } = await supabase
        .from('fact_cost_model_reference')
        .select('*')
        .eq('item_id', itemId)
        .order('reference_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching cost model references:', error);
      return [];
    }
  }

  async getCostBaselineByItemId(itemId: string): Promise<CostBaseline | null> {
    try {
      const { data, error } = await supabase
        .from('fact_cost_baseline')
        .select('*')
        .eq('item_id', itemId)
        .eq('is_active', true)
        .order('effective_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching cost baseline:', error);
      return null;
    }
  }

  async getCostForecastsByItemId(itemId: string): Promise<CostForecast[]> {
    try {
      const { data, error } = await supabase
        .from('fact_cost_forecast')
        .select('*')
        .eq('item_id', itemId)
        .eq('scenario_type', 'baseline')
        .order('forecast_month', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching cost forecasts:', error);
      return [];
    }
  }

  async getAllAIInsights(filters?: { priorityLevel?: string; insightType?: string }): Promise<AIInsight[]> {
    try {
      let query = supabase
        .from('fact_cost_ai_insight')
        .select('*')
        .eq('is_active', true)
        .order('priority_level', { ascending: true })
        .order('generated_at', { ascending: false });

      if (filters?.priorityLevel) {
        query = query.eq('priority_level', filters.priorityLevel);
      }

      if (filters?.insightType) {
        query = query.eq('insight_type', filters.insightType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      return [];
    }
  }

  async getAIInsightsByItemId(itemId: string): Promise<AIInsight[]> {
    try {
      const { data, error } = await supabase
        .from('fact_cost_ai_insight')
        .select('*')
        .contains('affected_items', [itemId])
        .eq('is_active', true)
        .order('priority_level', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching AI insights by item:', error);
      return [];
    }
  }

  async getItemsWithCostData(): Promise<ItemWithCostData[]> {
    try {
      const items = await this.getAllItems();

      const itemsWithCost = await Promise.all(
        items.map(async (item) => {
          const baseline = await this.getCostBaselineByItemId(item.id);
          const references = await this.getCostModelReferencesByItemId(item.id);

          const historicalRef = references.find(r => r.reference_type === 'Historical Contract');
          const currentShouldCost = baseline?.base_unit_cost || 0;
          const historicalCost = historicalRef?.unit_cost || 0;
          const deviationPercentage = historicalCost > 0
            ? ((currentShouldCost - historicalCost) / historicalCost) * 100
            : 0;

          const forecasts = await this.getCostForecastsByItemId(item.id);
          const costTrend = forecasts.slice(0, 6).map(f => f.forecasted_unit_cost);

          return {
            ...item,
            currentShouldCost,
            historicalCost,
            costTrend,
            deviationPercentage
          };
        })
      );

      return itemsWithCost;
    } catch (error) {
      console.error('Error fetching items with cost data:', error);
      return [];
    }
  }

  async updateCostStructure(itemId: string, structure: Partial<CostStructure>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('fact_cost_structure_standard')
        .update(structure)
        .eq('item_id', itemId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating cost structure:', error);
      return false;
    }
  }
}

export const costEstimatorService = new CostEstimatorService();
