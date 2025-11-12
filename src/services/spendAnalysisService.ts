import { supabase } from './supabaseClient';

export interface Category {
  id: string;
  category_code: string;
  category_name: string;
  parent_category_id: string | null;
  level: number;
  category_type: string;
  organization_id: string;
}

export interface Material {
  id: string;
  material_code: string;
  description: string;
  category_id: string | null;
  unit_of_measure: string;
  is_categorized: boolean;
  suggested_category_id: string | null;
  confidence_score: number | null;
  organization_id: string;
}

export interface Unit {
  id: string;
  unit_code: string;
  unit_name: string;
  province: string;
  city: string;
  latitude: number;
  longitude: number;
  unit_type: string;
  organization_id: string;
}

export interface Vendor {
  id: string;
  vendor_code: string;
  vendor_name: string;
  segmentation: string;
  is_local: boolean;
  is_subsidiary: boolean;
  performance_score: number;
  risk_score: number;
  compliance_score: number;
  primary_categories: string[];
  organization_id: string;
}

export interface Contract {
  id: string;
  contract_number: string;
  contract_name: string;
  vendor_id: string;
  category_id: string;
  contract_value: number;
  start_date: string;
  end_date: string;
  status: string;
  organization_id: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  po_line_number: number;
  material_id: string;
  vendor_id: string;
  unit_id: string;
  category_id: string;
  contract_id: string | null;
  po_date: string;
  fiscal_year: number;
  fiscal_quarter: number;
  quantity: number;
  unit_price: number;
  total_amount: number;
  currency: string;
  has_contract: boolean;
  is_maverick: boolean;
  budget_code: string;
  budgeted_amount: number;
  requestor_name: string;
  organization_id: string;
}

export interface SpendSummaryMetrics {
  totalSpend: number;
  totalAddressableSpend: number;
  contractedSpend: number;
  nonContractedSpend: number;
  localVendorSpend: number;
  subsidiarySpend: number;
  tailSpend: number;
  maverickSpend: number;
  poCount: number;
  poWithContractCount: number;
  uniqueVendorsCount: number;
  poCoveragePercent: number;
  contractCoveragePercent: number;
  localVendorPercent: number;
  subsidiaryPercent: number;
  maverickPercent: number;
}

export interface SpendDistribution {
  name: string;
  value: number;
  percentage: number;
  count?: number;
}

export interface CategorySpendMetrics {
  category_id: string;
  category_name: string;
  category_code: string;
  total_spend: number;
  contracted_spend: number;
  non_contracted_spend: number;
  po_count: number;
  vendor_count: number;
  contract_coverage: number;
  risk_score: number;
  opportunity_score: number;
}

export interface UnitSpendMetrics {
  unit_id: string;
  unit_name: string;
  unit_code: string;
  province: string;
  total_spend: number;
  budgeted_amount: number;
  variance: number;
  variance_percent: number;
  contracted_spend: number;
  po_count: number;
  efficiency_score: number;
}

export interface VendorSpendMetrics {
  vendor_id: string;
  vendor_name: string;
  vendor_code: string;
  segmentation: string;
  total_spend: number;
  po_count: number;
  performance_score: number;
  risk_score: number;
  is_local: boolean;
  is_subsidiary: boolean;
  has_expiring_contracts: boolean;
}

export interface SpendTrend {
  period: string;
  total_spend: number;
  contracted_spend: number;
  non_contracted_spend: number;
}

export interface CategoryMapping {
  id: string;
  material_id: string;
  material_code: string;
  material_description: string;
  suggested_category_id: string;
  suggested_category_name: string;
  approved_category_id: string | null;
  confidence_score: number;
  status: string;
  organization_id: string;
}

export class SpendAnalysisService {
  static async getSummaryMetrics(organizationId: string): Promise<SpendSummaryMetrics> {
    const { data: pos, error } = await supabase
      .from('fact_purchase_orders')
      .select(`
        *,
        dim_vendor_extended!fact_purchase_orders_vendor_id_fkey (
          is_local,
          is_subsidiary,
          segmentation
        )
      `)
      .eq('organization_id', organizationId);

    if (error) throw error;

    const totalSpend = pos.reduce((sum, po) => sum + po.total_amount, 0);
    const contractedSpend = pos.filter(po => po.has_contract).reduce((sum, po) => sum + po.total_amount, 0);
    const nonContractedSpend = totalSpend - contractedSpend;

    const localVendorSpend = pos.filter(po => po.dim_vendor_extended?.is_local).reduce((sum, po) => sum + po.total_amount, 0);
    const subsidiarySpend = pos.filter(po => po.dim_vendor_extended?.is_subsidiary).reduce((sum, po) => sum + po.total_amount, 0);
    const tailSpend = pos.filter(po => po.dim_vendor_extended?.segmentation === 'tail').reduce((sum, po) => sum + po.total_amount, 0);
    const maverickSpend = pos.filter(po => po.is_maverick).reduce((sum, po) => sum + po.total_amount, 0);

    const poCount = pos.length;
    const poWithContractCount = pos.filter(po => po.has_contract).length;
    const uniqueVendorsCount = new Set(pos.map(po => po.vendor_id)).size;

    return {
      totalSpend,
      totalAddressableSpend: totalSpend * 0.85,
      contractedSpend,
      nonContractedSpend,
      localVendorSpend,
      subsidiarySpend,
      tailSpend,
      maverickSpend,
      poCount,
      poWithContractCount,
      uniqueVendorsCount,
      poCoveragePercent: poCount > 0 ? (poWithContractCount / poCount) * 100 : 0,
      contractCoveragePercent: totalSpend > 0 ? (contractedSpend / totalSpend) * 100 : 0,
      localVendorPercent: totalSpend > 0 ? (localVendorSpend / totalSpend) * 100 : 0,
      subsidiaryPercent: totalSpend > 0 ? (subsidiarySpend / totalSpend) * 100 : 0,
      maverickPercent: totalSpend > 0 ? (maverickSpend / totalSpend) * 100 : 0,
    };
  }

  static async getSpendByCategory(organizationId: string, limit: number = 10): Promise<SpendDistribution[]> {
    const { data, error } = await supabase
      .from('fact_purchase_orders')
      .select(`
        category_id,
        total_amount,
        dim_categories!fact_purchase_orders_category_id_fkey (
          category_name
        )
      `)
      .eq('organization_id', organizationId);

    if (error) throw error;

    const categorySpend = data.reduce((acc: any, po: any) => {
      const categoryName = po.dim_categories?.category_name || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = { spend: 0, count: 0 };
      }
      acc[categoryName].spend += po.total_amount;
      acc[categoryName].count += 1;
      return acc;
    }, {});

    const totalSpend = Object.values(categorySpend).reduce((sum: number, cat: any) => sum + cat.spend, 0);

    const distribution = Object.entries(categorySpend)
      .map(([name, data]: [string, any]) => ({
        name,
        value: data.spend,
        percentage: (data.spend / totalSpend) * 100,
        count: data.count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);

    return distribution;
  }

  static async getSpendByVendor(organizationId: string, limit: number = 10): Promise<SpendDistribution[]> {
    const { data, error } = await supabase
      .from('fact_purchase_orders')
      .select(`
        vendor_id,
        total_amount,
        dim_vendor_extended!fact_purchase_orders_vendor_id_fkey (
          vendor_name
        )
      `)
      .eq('organization_id', organizationId);

    if (error) throw error;

    const vendorSpend = data.reduce((acc: any, po: any) => {
      const vendorName = po.dim_vendor_extended?.vendor_name || 'Unknown';
      if (!acc[vendorName]) {
        acc[vendorName] = { spend: 0, count: 0 };
      }
      acc[vendorName].spend += po.total_amount;
      acc[vendorName].count += 1;
      return acc;
    }, {});

    const totalSpend = Object.values(vendorSpend).reduce((sum: number, v: any) => sum + v.spend, 0);

    const distribution = Object.entries(vendorSpend)
      .map(([name, data]: [string, any]) => ({
        name,
        value: data.spend,
        percentage: (data.spend / totalSpend) * 100,
        count: data.count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);

    return distribution;
  }

  static async getSpendByUnit(organizationId: string, limit: number = 10): Promise<SpendDistribution[]> {
    const { data, error } = await supabase
      .from('fact_purchase_orders')
      .select(`
        unit_id,
        total_amount,
        dim_units!fact_purchase_orders_unit_id_fkey (
          unit_name
        )
      `)
      .eq('organization_id', organizationId);

    if (error) throw error;

    const unitSpend = data.reduce((acc: any, po: any) => {
      const unitName = po.dim_units?.unit_name || 'Unknown';
      if (!acc[unitName]) {
        acc[unitName] = { spend: 0, count: 0 };
      }
      acc[unitName].spend += po.total_amount;
      acc[unitName].count += 1;
      return acc;
    }, {});

    const totalSpend = Object.values(unitSpend).reduce((sum: number, u: any) => sum + u.spend, 0);

    const distribution = Object.entries(unitSpend)
      .map(([name, data]: [string, any]) => ({
        name,
        value: data.spend,
        percentage: (data.spend / totalSpend) * 100,
        count: data.count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);

    return distribution;
  }

  static async getCategorySpendMetrics(organizationId: string): Promise<CategorySpendMetrics[]> {
    const { data, error } = await supabase
      .from('fact_purchase_orders')
      .select(`
        category_id,
        total_amount,
        has_contract,
        vendor_id,
        dim_categories!fact_purchase_orders_category_id_fkey (
          id,
          category_name,
          category_code
        )
      `)
      .eq('organization_id', organizationId);

    if (error) throw error;

    const categoryMetrics = data.reduce((acc: any, po: any) => {
      const categoryId = po.category_id;
      if (!categoryId) return acc;

      if (!acc[categoryId]) {
        acc[categoryId] = {
          category_id: categoryId,
          category_name: po.dim_categories?.category_name || 'Unknown',
          category_code: po.dim_categories?.category_code || 'UNK',
          total_spend: 0,
          contracted_spend: 0,
          non_contracted_spend: 0,
          po_count: 0,
          vendors: new Set(),
        };
      }

      acc[categoryId].total_spend += po.total_amount;
      if (po.has_contract) {
        acc[categoryId].contracted_spend += po.total_amount;
      } else {
        acc[categoryId].non_contracted_spend += po.total_amount;
      }
      acc[categoryId].po_count += 1;
      acc[categoryId].vendors.add(po.vendor_id);

      return acc;
    }, {});

    return Object.values(categoryMetrics).map((cat: any) => ({
      ...cat,
      vendor_count: cat.vendors.size,
      contract_coverage: cat.total_spend > 0 ? (cat.contracted_spend / cat.total_spend) * 100 : 0,
      risk_score: cat.contract_coverage < 50 ? 75 : cat.contract_coverage < 70 ? 50 : 25,
      opportunity_score: cat.non_contracted_spend > 1000000000 ? 85 : cat.non_contracted_spend > 500000000 ? 60 : 30,
    })).sort((a: any, b: any) => b.total_spend - a.total_spend);
  }

  static async getUnitSpendMetrics(organizationId: string): Promise<UnitSpendMetrics[]> {
    const { data, error } = await supabase
      .from('fact_purchase_orders')
      .select(`
        unit_id,
        total_amount,
        budgeted_amount,
        has_contract,
        dim_units!fact_purchase_orders_unit_id_fkey (
          id,
          unit_name,
          unit_code,
          province
        )
      `)
      .eq('organization_id', organizationId);

    if (error) throw error;

    const unitMetrics = data.reduce((acc: any, po: any) => {
      const unitId = po.unit_id;
      if (!unitId) return acc;

      if (!acc[unitId]) {
        acc[unitId] = {
          unit_id: unitId,
          unit_name: po.dim_units?.unit_name || 'Unknown',
          unit_code: po.dim_units?.unit_code || 'UNK',
          province: po.dim_units?.province || 'Unknown',
          total_spend: 0,
          budgeted_amount: 0,
          contracted_spend: 0,
          po_count: 0,
        };
      }

      acc[unitId].total_spend += po.total_amount;
      acc[unitId].budgeted_amount += po.budgeted_amount;
      if (po.has_contract) {
        acc[unitId].contracted_spend += po.total_amount;
      }
      acc[unitId].po_count += 1;

      return acc;
    }, {});

    return Object.values(unitMetrics).map((unit: any) => {
      const variance = unit.total_spend - unit.budgeted_amount;
      const variancePercent = unit.budgeted_amount > 0 ? (variance / unit.budgeted_amount) * 100 : 0;
      const contractRate = unit.total_spend > 0 ? (unit.contracted_spend / unit.total_spend) * 100 : 0;
      const efficiencyScore = Math.max(0, 100 - Math.abs(variancePercent) - (100 - contractRate));

      return {
        ...unit,
        variance,
        variance_percent: variancePercent,
        efficiency_score: Math.round(efficiencyScore),
      };
    }).sort((a: any, b: any) => b.total_spend - a.total_spend);
  }

  static async getVendorSpendMetrics(organizationId: string): Promise<VendorSpendMetrics[]> {
    const [posResult, contractsResult] = await Promise.all([
      supabase
        .from('fact_purchase_orders')
        .select(`
          vendor_id,
          total_amount,
          dim_vendor_extended!fact_purchase_orders_vendor_id_fkey (
            id,
            vendor_name,
            vendor_code,
            segmentation,
            is_local,
            is_subsidiary,
            performance_score,
            risk_score
          )
        `)
        .eq('organization_id', organizationId),
      supabase
        .from('dim_contracts')
        .select('vendor_id, status, end_date')
        .eq('organization_id', organizationId)
    ]);

    if (posResult.error) throw posResult.error;
    if (contractsResult.error) throw contractsResult.error;

    const vendorMetrics = posResult.data.reduce((acc: any, po: any) => {
      const vendorId = po.vendor_id;
      if (!vendorId) return acc;

      if (!acc[vendorId]) {
        acc[vendorId] = {
          vendor_id: vendorId,
          vendor_name: po.dim_vendor_extended?.vendor_name || 'Unknown',
          vendor_code: po.dim_vendor_extended?.vendor_code || 'UNK',
          segmentation: po.dim_vendor_extended?.segmentation || 'unknown',
          is_local: po.dim_vendor_extended?.is_local || false,
          is_subsidiary: po.dim_vendor_extended?.is_subsidiary || false,
          performance_score: po.dim_vendor_extended?.performance_score || 0,
          risk_score: po.dim_vendor_extended?.risk_score || 0,
          total_spend: 0,
          po_count: 0,
        };
      }

      acc[vendorId].total_spend += po.total_amount;
      acc[vendorId].po_count += 1;

      return acc;
    }, {});

    const expiringContractVendors = new Set(
      contractsResult.data
        .filter(c => c.status === 'expiring_soon')
        .map(c => c.vendor_id)
    );

    return Object.values(vendorMetrics).map((vendor: any) => ({
      ...vendor,
      has_expiring_contracts: expiringContractVendors.has(vendor.vendor_id),
    })).sort((a: any, b: any) => b.total_spend - a.total_spend);
  }

  static async getSpendTrend(organizationId: string, periods: number = 12): Promise<SpendTrend[]> {
    const { data, error } = await supabase
      .from('fact_purchase_orders')
      .select('po_date, total_amount, has_contract')
      .eq('organization_id', organizationId)
      .order('po_date', { ascending: true });

    if (error) throw error;

    const monthlyData = data.reduce((acc: any, po) => {
      const month = po.po_date.substring(0, 7);
      if (!acc[month]) {
        acc[month] = {
          period: month,
          total_spend: 0,
          contracted_spend: 0,
          non_contracted_spend: 0,
        };
      }
      acc[month].total_spend += po.total_amount;
      if (po.has_contract) {
        acc[month].contracted_spend += po.total_amount;
      } else {
        acc[month].non_contracted_spend += po.total_amount;
      }
      return acc;
    }, {});

    return Object.values(monthlyData).slice(-periods);
  }

  static async getCategoryMappings(organizationId: string, status: string = 'pending'): Promise<CategoryMapping[]> {
    const { data, error } = await supabase
      .from('fact_category_mappings')
      .select(`
        id,
        material_id,
        suggested_category_id,
        approved_category_id,
        confidence_score,
        status,
        organization_id,
        dim_materials!fact_category_mappings_material_id_fkey (
          material_code,
          description
        ),
        suggested:dim_categories!fact_category_mappings_suggested_category_id_fkey (
          category_name
        )
      `)
      .eq('organization_id', organizationId)
      .eq('status', status);

    if (error) throw error;

    return data.map((mapping: any) => ({
      id: mapping.id,
      material_id: mapping.material_id,
      material_code: mapping.dim_materials?.material_code || '',
      material_description: mapping.dim_materials?.description || '',
      suggested_category_id: mapping.suggested_category_id,
      suggested_category_name: mapping.suggested?.category_name || '',
      approved_category_id: mapping.approved_category_id,
      confidence_score: mapping.confidence_score || 0,
      status: mapping.status,
      organization_id: mapping.organization_id,
    }));
  }

  static async approveCategoryMapping(mappingId: string, approvedCategoryId: string): Promise<void> {
    const { error } = await supabase
      .from('fact_category_mappings')
      .update({
        approved_category_id: approvedCategoryId,
        status: 'approved',
        approved_at: new Date().toISOString(),
      })
      .eq('id', mappingId);

    if (error) throw error;
  }

  static async getAllCategories(organizationId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('dim_categories')
      .select('*')
      .eq('organization_id', organizationId)
      .order('category_name', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async getAllUnits(organizationId: string): Promise<Unit[]> {
    const { data, error } = await supabase
      .from('dim_units')
      .select('*')
      .eq('organization_id', organizationId)
      .order('unit_name', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async getAllVendors(organizationId: string): Promise<Vendor[]> {
    const { data, error } = await supabase
      .from('dim_vendor_extended')
      .select('*')
      .eq('organization_id', organizationId)
      .order('vendor_name', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async getExpiringContracts(organizationId: string): Promise<Contract[]> {
    const { data, error } = await supabase
      .from('dim_contracts')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'expiring_soon')
      .order('end_date', { ascending: true });

    if (error) throw error;
    return data;
  }
}
