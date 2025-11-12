import { supabase } from './supabaseClient';

export interface InventoryAlert {
  alert_id?: number;
  alert_type: string;
  material_id: string;
  storage_location_id?: string;
  unit_owner_id?: string;
  threshold_type: string;
  threshold_value: number;
  current_value?: number;
  alert_status: string;
  severity: string;
  alert_message?: string;
  triggered_date?: string;
  resolved_date?: string;
}

export interface ExecutionLog {
  execution_id?: number;
  execution_type: string;
  reference_number?: string;
  material_id?: string;
  from_location?: string;
  to_location?: string;
  qty_requested?: number;
  qty_executed?: number;
  execution_status: string;
  requester?: string;
  approver?: string;
  execution_date?: string;
  completion_date?: string;
  notes?: string;
}

export interface STRTransaction {
  str_id?: number;
  str_number: string;
  str_type: string;
  material_id: string;
  from_storage_location: string;
  to_storage_location: string;
  from_unit?: string;
  to_unit?: string;
  requested_qty: number;
  approved_qty?: number;
  executed_qty?: number;
  unit_price?: number;
  total_value?: number;
  currency?: string;
  request_status: string;
  requested_by?: string;
  request_date?: string;
  approved_by?: string;
  approval_date?: string;
  executed_by?: string;
  execution_date?: string;
  settlement_status?: string;
  settlement_date?: string;
  notes?: string;
}

export interface InventoryItem {
  inventory_snapshot_id: number;
  material_id: string;
  storage_location_id: string;
  unit_owner_id?: string;
  stock_qty: number;
  stock_value: number;
  unit_price_map: number;
  optimized_stock_qty?: number;
  snapshot_date: string;
}

export class CIService {
  // ===== INVENTORY OVERVIEW =====

  static async getInventorySnapshot(): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory_snapshot')
      .select('*')
      .order('snapshot_date', { ascending: false })
      .limit(1000);

    if (error) throw error;
    return data || [];
  }

  static async getInventoryByMaterial(materialId: string): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory_snapshot')
      .select('*')
      .eq('material_id', materialId)
      .order('snapshot_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getInventorySummary(): Promise<any> {
    const { data: inventory } = await supabase
      .from('inventory_snapshot')
      .select('stock_qty, stock_value, material_id')
      .order('snapshot_date', { ascending: false })
      .limit(10000);

    if (!inventory || inventory.length === 0) {
      return {
        totalItems: 0,
        totalValue: 0,
        uniqueMaterials: 0,
        avgStockLevel: 0
      };
    }

    const uniqueMaterials = new Set(inventory.map(i => i.material_id));
    const totalQty = inventory.reduce((sum, i) => sum + (Number(i.stock_qty) || 0), 0);
    const totalValue = inventory.reduce((sum, i) => sum + (Number(i.stock_value) || 0), 0);

    return {
      totalItems: inventory.length,
      totalValue,
      uniqueMaterials: uniqueMaterials.size,
      avgStockLevel: totalQty / inventory.length
    };
  }

  // ===== INVENTORY PLANNING & NETTING =====

  static async performInventoryNetting(materialIds?: string[]): Promise<any[]> {
    // Get demand data
    let demandQuery = supabase
      .from('demand')
      .select('material_id, demand_qty')
      .eq('is_selected_for_procurement', true);

    if (materialIds && materialIds.length > 0) {
      demandQuery = demandQuery.in('material_id', materialIds);
    }

    const { data: demandData } = await demandQuery;

    // Get inventory data
    const { data: inventoryData } = await supabase
      .from('inventory_snapshot')
      .select('material_id, stock_qty, unit_price_map')
      .order('snapshot_date', { ascending: false })
      .limit(10000);

    // Get open PO data
    const { data: poData } = await supabase
      .from('purchase_order')
      .select('material_id, qty_ordered')
      .in('po_status', ['Open', 'Confirmed']);

    // Create maps
    const demandMap = new Map<string, number>();
    (demandData || []).forEach(item => {
      const existing = demandMap.get(item.material_id) || 0;
      demandMap.set(item.material_id, existing + (Number(item.demand_qty) || 0));
    });

    const inventoryMap = new Map<string, { qty: number; price: number }>();
    (inventoryData || []).forEach(item => {
      const existing = inventoryMap.get(item.material_id) || { qty: 0, price: 0 };
      inventoryMap.set(item.material_id, {
        qty: existing.qty + (Number(item.stock_qty) || 0),
        price: Number(item.unit_price_map) || 0
      });
    });

    const poMap = new Map<string, number>();
    (poData || []).forEach(item => {
      const existing = poMap.get(item.material_id) || 0;
      poMap.set(item.material_id, existing + (Number(item.qty_ordered) || 0));
    });

    // Calculate netting for all materials
    const allMaterialIds = Array.from(new Set([
      ...demandMap.keys(),
      ...inventoryMap.keys()
    ]));

    const nettingResults = allMaterialIds.map(materialId => {
      const demand = demandMap.get(materialId) || 0;
      const inventory = inventoryMap.get(materialId) || { qty: 0, price: 0 };
      const openPO = poMap.get(materialId) || 0;
      const netRequirement = Math.max(0, demand - inventory.qty - openPO);
      const surplus = Math.max(0, inventory.qty + openPO - demand);

      return {
        material_id: materialId,
        demand_qty: demand,
        available_stock: inventory.qty,
        open_po_qty: openPO,
        net_requirement: netRequirement,
        surplus_qty: surplus,
        unit_price: inventory.price,
        requirement_value: netRequirement * inventory.price,
        status: netRequirement > 0 ? 'Shortage' : surplus > 0 ? 'Surplus' : 'Balanced'
      };
    });

    return nettingResults;
  }

  static async generateDRPFromNetting(nettingResults: any[]): Promise<any[]> {
    const shortage = nettingResults.filter(r => r.net_requirement > 0);

    if (shortage.length === 0) {
      return [];
    }

    const drpRecords = shortage.map(item => ({
      material_id: item.material_id,
      requirement_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      demand_qty: item.net_requirement,
      demand_type: 'CI_DRP',
      is_selected_for_procurement: true
    }));

    const { data, error } = await supabase
      .from('demand')
      .insert(drpRecords)
      .select();

    if (error) throw error;
    return data || drpRecords;
  }

  // ===== INVENTORY ALERTS =====

  static async createInventoryAlert(alert: InventoryAlert): Promise<InventoryAlert> {
    const { data, error } = await supabase
      .from('dim_ci_inventory_alert')
      .insert(alert)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getActiveAlerts(): Promise<InventoryAlert[]> {
    const { data, error } = await supabase
      .from('dim_ci_inventory_alert')
      .select('*')
      .eq('alert_status', 'Active')
      .order('triggered_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async checkAndTriggerAlerts(): Promise<InventoryAlert[]> {
    // Get current inventory
    const { data: inventory } = await supabase
      .from('inventory_snapshot')
      .select('material_id, storage_location_id, stock_qty')
      .order('snapshot_date', { ascending: false })
      .limit(10000);

    if (!inventory || inventory.length === 0) {
      return [];
    }

    const triggeredAlerts: InventoryAlert[] = [];

    // Check for low stock (example threshold: < 100 units)
    inventory.forEach(item => {
      const stockQty = Number(item.stock_qty) || 0;

      if (stockQty < 100 && stockQty > 0) {
        triggeredAlerts.push({
          alert_type: 'Low Stock',
          material_id: item.material_id,
          storage_location_id: item.storage_location_id,
          threshold_type: 'Min Quantity',
          threshold_value: 100,
          current_value: stockQty,
          alert_status: 'Active',
          severity: 'High',
          alert_message: `Stock level (${stockQty}) is below minimum threshold (100)`,
          triggered_date: new Date().toISOString()
        });
      } else if (stockQty === 0) {
        triggeredAlerts.push({
          alert_type: 'Stock Out',
          material_id: item.material_id,
          storage_location_id: item.storage_location_id,
          threshold_type: 'Zero Stock',
          threshold_value: 0,
          current_value: 0,
          alert_status: 'Active',
          severity: 'Critical',
          alert_message: 'Material is out of stock',
          triggered_date: new Date().toISOString()
        });
      }
    });

    // Save alerts to database
    if (triggeredAlerts.length > 0) {
      await supabase
        .from('dim_ci_inventory_alert')
        .insert(triggeredAlerts);
    }

    return triggeredAlerts;
  }

  static async resolveAlert(alertId: number): Promise<boolean> {
    const { error } = await supabase
      .from('dim_ci_inventory_alert')
      .update({
        alert_status: 'Resolved',
        resolved_date: new Date().toISOString()
      })
      .eq('alert_id', alertId);

    if (error) throw error;
    return true;
  }

  // ===== STR (Stock Transfer Request) =====

  static async createSTR(str: STRTransaction): Promise<STRTransaction> {
    // Generate STR number if not provided
    if (!str.str_number) {
      const timestamp = Date.now().toString().slice(-8);
      str.str_number = `STR-${timestamp}`;
    }

    const { data, error } = await supabase
      .from('fact_str_transaction')
      .insert({
        ...str,
        request_status: 'Draft',
        request_date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getSTRTransactions(status?: string): Promise<STRTransaction[]> {
    let query = supabase
      .from('fact_str_transaction')
      .select('*')
      .order('request_date', { ascending: false });

    if (status) {
      query = query.eq('request_status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async approveSTR(strId: number, approvedBy: string, approvedQty: number): Promise<boolean> {
    const { error } = await supabase
      .from('fact_str_transaction')
      .update({
        request_status: 'Approved',
        approved_by: approvedBy,
        approved_qty: approvedQty,
        approval_date: new Date().toISOString().split('T')[0]
      })
      .eq('str_id', strId);

    if (error) throw error;
    return true;
  }

  static async executeSTR(strId: number, executedBy: string, executedQty: number): Promise<boolean> {
    const { error } = await supabase
      .from('fact_str_transaction')
      .update({
        request_status: 'Executed',
        executed_by: executedBy,
        executed_qty: executedQty,
        execution_date: new Date().toISOString().split('T')[0]
      })
      .eq('str_id', strId);

    if (error) throw error;
    return true;
  }

  static async settleSTR(strId: number): Promise<boolean> {
    const { error } = await supabase
      .from('fact_str_transaction')
      .update({
        settlement_status: 'Completed',
        settlement_date: new Date().toISOString().split('T')[0]
      })
      .eq('str_id', strId);

    if (error) throw error;
    return true;
  }

  // ===== EXECUTION MANAGEMENT =====

  static async logExecution(log: ExecutionLog): Promise<ExecutionLog> {
    const { data, error } = await supabase
      .from('dim_ci_execution_log')
      .insert(log)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getExecutionLogs(executionType?: string, status?: string): Promise<ExecutionLog[]> {
    let query = supabase
      .from('dim_ci_execution_log')
      .select('*')
      .order('created_date', { ascending: false });

    if (executionType) {
      query = query.eq('execution_type', executionType);
    }
    if (status) {
      query = query.eq('execution_status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async updateExecutionStatus(executionId: number, status: string): Promise<boolean> {
    const { error } = await supabase
      .from('dim_ci_execution_log')
      .update({
        execution_status: status,
        completion_date: status === 'Completed' ? new Date().toISOString().split('T')[0] : undefined
      })
      .eq('execution_id', executionId);

    if (error) throw error;
    return true;
  }

  // ===== DASHBOARD STATISTICS =====

  static async getDashboardStats(): Promise<any> {
    const [inventory, alerts, strs, executions] = await Promise.all([
      this.getInventorySummary(),
      this.getActiveAlerts(),
      this.getSTRTransactions(),
      this.getExecutionLogs()
    ]);

    const criticalAlerts = alerts.filter(a => a.severity === 'Critical').length;
    const pendingSTRs = strs.filter(s => s.request_status === 'Draft' || s.request_status === 'Pending').length;
    const pendingExecutions = executions.filter(e => e.execution_status === 'Pending').length;

    return {
      totalInventoryValue: inventory.totalValue,
      uniqueMaterials: inventory.uniqueMaterials,
      totalActiveAlerts: alerts.length,
      criticalAlerts,
      pendingSTRs,
      pendingExecutions,
      totalSTRs: strs.length,
      totalExecutions: executions.length
    };
  }
}

export default CIService;
