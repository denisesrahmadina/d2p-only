import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split('T')[0];
    const kpiData = [];

    // 1. Purchase Order KPIs
    const { data: poData, error: poError } = await supabase
      .from('fact_purchase_order')
      .select('total_po_value, po_status, po_date')
      .gte('po_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (!poError && poData) {
      const totalPOValue = poData.reduce((sum, po) => sum + Number(po.total_po_value || 0), 0);
      const totalPOCount = poData.length;
      const openPOs = poData.filter(po => po.po_status === 'OPEN').length;
      
      kpiData.push({
        kpi_type: 'Procurement',
        kpi_name: 'Total Purchase Order Value (30 days)',
        kpi_category: 'Financial',
        measurement_date: today,
        kpi_result: totalPOValue,
        kpi_target: totalPOValue * 1.1,
        kpi_unit: 'IDR',
        achievement_percentage: (totalPOValue / (totalPOValue * 1.1)) * 100
      });

      kpiData.push({
        kpi_type: 'Procurement',
        kpi_name: 'Total Purchase Orders (30 days)',
        kpi_category: 'Operational',
        measurement_date: today,
        kpi_result: totalPOCount,
        kpi_target: totalPOCount * 1.05,
        kpi_unit: 'Count',
        achievement_percentage: (totalPOCount / (totalPOCount * 1.05)) * 100
      });

      kpiData.push({
        kpi_type: 'Procurement',
        kpi_name: 'Open Purchase Orders',
        kpi_category: 'Operational',
        measurement_date: today,
        kpi_result: openPOs,
        kpi_target: 0,
        kpi_unit: 'Count',
        achievement_percentage: openPOs === 0 ? 100 : 50
      });
    }

    // 2. Goods Receipt KPIs
    const { data: grData, error: grError } = await supabase
      .from('fact_goods_receipt')
      .select('qty_ordered, qty_received, receipt_date, order_date')
      .gte('receipt_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (!grError && grData) {
      const totalReceived = grData.reduce((sum, gr) => sum + Number(gr.qty_received || 0), 0);
      const totalOrdered = grData.reduce((sum, gr) => sum + Number(gr.qty_ordered || 0), 0);
      const receiptFulfillmentRate = (totalReceived / totalOrdered) * 100;
      
      // Calculate on-time delivery
      const onTimeDeliveries = grData.filter(gr => {
        if (!gr.order_date || !gr.receipt_date) return false;
        const orderDate = new Date(gr.order_date);
        const receiptDate = new Date(gr.receipt_date);
        const daysDiff = (receiptDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 30; // Assuming 30 days is on-time
      }).length;
      
      const onTimeDeliveryRate = (onTimeDeliveries / grData.length) * 100;

      kpiData.push({
        kpi_type: 'Warehouse',
        kpi_name: 'Goods Receipt Fulfillment Rate',
        kpi_category: 'Operational',
        measurement_date: today,
        kpi_result: receiptFulfillmentRate,
        kpi_target: 100,
        kpi_unit: '%',
        achievement_percentage: receiptFulfillmentRate
      });

      kpiData.push({
        kpi_type: 'Procurement',
        kpi_name: 'On-Time Delivery Rate',
        kpi_category: 'Performance',
        measurement_date: today,
        kpi_result: onTimeDeliveryRate,
        kpi_target: 95,
        kpi_unit: '%',
        achievement_percentage: (onTimeDeliveryRate / 95) * 100
      });
    }

    // 3. Storage Location KPIs
    const { data: storageData, error: storageError } = await supabase
      .from('dim_storage_location')
      .select('storage_location_id, capacity')
      .eq('is_active', true);

    if (!storageError && storageData) {
      const totalCapacity = storageData.reduce((sum, loc) => sum + Number(loc.capacity || 0), 0);
      const activeLocations = storageData.length;

      kpiData.push({
        kpi_type: 'Warehouse',
        kpi_name: 'Total Storage Capacity',
        kpi_category: 'Capacity',
        measurement_date: today,
        kpi_result: totalCapacity,
        kpi_target: totalCapacity * 0.85,
        kpi_unit: 'Units',
        achievement_percentage: (totalCapacity / (totalCapacity * 0.85)) * 100
      });

      kpiData.push({
        kpi_type: 'Warehouse',
        kpi_name: 'Active Storage Locations',
        kpi_category: 'Operational',
        measurement_date: today,
        kpi_result: activeLocations,
        kpi_target: activeLocations,
        kpi_unit: 'Count',
        achievement_percentage: 100
      });
    }

    // 4. Material KPIs
    const { data: materialData, error: materialError } = await supabase
      .from('dim_material')
      .select('material_id, material_category, kraljic_category, is_active')
      .eq('is_active', true);

    if (!materialError && materialData) {
      const totalMaterials = materialData.length;
      const strategicMaterials = materialData.filter(m => m.kraljic_category === 'Strategic').length;

      kpiData.push({
        kpi_type: 'Inventory',
        kpi_name: 'Total Active Materials',
        kpi_category: 'Inventory',
        measurement_date: today,
        kpi_result: totalMaterials,
        kpi_target: totalMaterials,
        kpi_unit: 'Count',
        achievement_percentage: 100
      });

      kpiData.push({
        kpi_type: 'Inventory',
        kpi_name: 'Strategic Materials Count',
        kpi_category: 'Strategic',
        measurement_date: today,
        kpi_result: strategicMaterials,
        kpi_target: strategicMaterials,
        kpi_unit: 'Count',
        achievement_percentage: 100
      });
    }

    // 5. Vendor KPIs
    const { data: vendorData, error: vendorError } = await supabase
      .from('dim_vendor')
      .select('vendor_id, vendor_performance_score, is_active, is_contracted')
      .eq('is_active', true);

    if (!vendorError && vendorData) {
      const totalVendors = vendorData.length;
      const contractedVendors = vendorData.filter(v => v.is_contracted).length;
      const avgPerformanceScore = vendorData.reduce((sum, v) => sum + Number(v.vendor_performance_score || 0), 0) / totalVendors;

      kpiData.push({
        kpi_type: 'Vendor',
        kpi_name: 'Total Active Vendors',
        kpi_category: 'Vendor Management',
        measurement_date: today,
        kpi_result: totalVendors,
        kpi_target: totalVendors,
        kpi_unit: 'Count',
        achievement_percentage: 100
      });

      kpiData.push({
        kpi_type: 'Vendor',
        kpi_name: 'Contracted Vendors',
        kpi_category: 'Vendor Management',
        measurement_date: today,
        kpi_result: contractedVendors,
        kpi_target: totalVendors * 0.8,
        kpi_unit: 'Count',
        achievement_percentage: (contractedVendors / (totalVendors * 0.8)) * 100
      });

      kpiData.push({
        kpi_type: 'Vendor',
        kpi_name: 'Average Vendor Performance Score',
        kpi_category: 'Performance',
        measurement_date: today,
        kpi_result: avgPerformanceScore,
        kpi_target: 85,
        kpi_unit: 'Score',
        achievement_percentage: (avgPerformanceScore / 85) * 100
      });
    }

    // 6. Contract KPIs
    const { data: contractData, error: contractError } = await supabase
      .from('dim_contract')
      .select('contract_id, contract_status, contract_value_limit, contract_end_date');

    if (!contractError && contractData) {
      const activeContracts = contractData.filter(c => c.contract_status === 'Active').length;
      const expiringContracts = contractData.filter(c => {
        if (!c.contract_end_date) return false;
        const endDate = new Date(c.contract_end_date);
        const daysToExpiry = (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        return daysToExpiry > 0 && daysToExpiry <= 90;
      }).length;

      kpiData.push({
        kpi_type: 'Contract',
        kpi_name: 'Active Contracts',
        kpi_category: 'Contract Management',
        measurement_date: today,
        kpi_result: activeContracts,
        kpi_target: activeContracts,
        kpi_unit: 'Count',
        achievement_percentage: 100
      });

      kpiData.push({
        kpi_type: 'Contract',
        kpi_name: 'Contracts Expiring in 90 Days',
        kpi_category: 'Risk',
        measurement_date: today,
        kpi_result: expiringContracts,
        kpi_target: 0,
        kpi_unit: 'Count',
        achievement_percentage: expiringContracts === 0 ? 100 : 50
      });
    }

    // 7. Goods Issuance KPIs
    const { data: giData, error: giError } = await supabase
      .from('fact_goods_issuance')
      .select('qty_issued, transaction_date')
      .gte('transaction_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (!giError && giData) {
      const totalIssued = giData.reduce((sum, gi) => sum + Number(gi.qty_issued || 0), 0);

      kpiData.push({
        kpi_type: 'Warehouse',
        kpi_name: 'Total Goods Issued (30 days)',
        kpi_category: 'Operational',
        measurement_date: today,
        kpi_result: totalIssued,
        kpi_target: totalIssued,
        kpi_unit: 'Units',
        achievement_percentage: 100
      });
    }

    // 8. Strategic Initiative KPIs
    const { data: initiativeData, error: initiativeError } = await supabase
      .from('ref_strategic_initiative')
      .select('initiative_id, initiative_status, impact_estimate');

    if (!initiativeError && initiativeData) {
      const totalInitiatives = initiativeData.length;
      const completedInitiatives = initiativeData.filter(i => i.initiative_status === 'Completed').length;
      const inProgressInitiatives = initiativeData.filter(i => i.initiative_status === 'In Progress').length;

      kpiData.push({
        kpi_type: 'Strategic',
        kpi_name: 'Total Strategic Initiatives',
        kpi_category: 'Strategic',
        measurement_date: today,
        kpi_result: totalInitiatives,
        kpi_target: totalInitiatives,
        kpi_unit: 'Count',
        achievement_percentage: 100
      });

      kpiData.push({
        kpi_type: 'Strategic',
        kpi_name: 'Completed Strategic Initiatives',
        kpi_category: 'Strategic',
        measurement_date: today,
        kpi_result: completedInitiatives,
        kpi_target: totalInitiatives * 0.7,
        kpi_unit: 'Count',
        achievement_percentage: (completedInitiatives / (totalInitiatives * 0.7)) * 100
      });

      kpiData.push({
        kpi_type: 'Strategic',
        kpi_name: 'In Progress Strategic Initiatives',
        kpi_category: 'Strategic',
        measurement_date: today,
        kpi_result: inProgressInitiatives,
        kpi_target: totalInitiatives * 0.3,
        kpi_unit: 'Count',
        achievement_percentage: 100
      });
    }

    // Insert all KPI data into ref_kpi table
    if (kpiData.length > 0) {
      const { error: insertError } = await supabase
        .from('ref_kpi')
        .insert(kpiData);

      if (insertError) {
        throw new Error(`Failed to insert KPI data: ${insertError.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully extracted and inserted ${kpiData.length} KPI records`,
        kpis_generated: kpiData.length,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error extracting KPI data:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});