import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Sliders, CheckCircle2, Sparkles, Edit3, Save, Factory, Filter, Package, Database, Loader2, AlertCircle, Send } from 'lucide-react';
import plnUnitsData from '../../../data/plnUnits.json';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface MonthlyBudgetData {
  month: string;
  consolidatedDemand: number;
  budgetLimit: number;
  recommendedAdjustment: number;
  adjustmentPercent: number;
  status: 'within' | 'over';
}

interface MaterialData {
  totalBudget: number;
  totalDemand: number;
  adjustmentNeeded: number;
  monthlyData: MonthlyBudgetData[];
}

interface UnitBudgetData {
  [unit: string]: {
    [material: string]: MaterialData;
  };
}

type AdjustmentSource = 'recommended' | 'custom';

interface AdjustmentSelection {
  source: AdjustmentSource;
  value: number;
  percent: number;
}

type AdjustmentSelectionsByMaterial = {
  [material: string]: {
    [month: string]: AdjustmentSelection;
  };
};

// Define materials array outside component to prevent recreation on every render - ALL 5 CATEGORIES
const MATERIALS = [
  // Mechanical Equipment (6)
  'Turbine Blades', 'Pump Components', 'Valve Systems', 'Bearing Units', 'Coupling Systems', 'Gear Box Parts',
  // Water Treatment System (5)
  'Reverse Osmosis Membranes', 'Ion Exchange Resins', 'Chemical Dosing Pumps', 'Water Quality Sensors', 'Filtration Media',
  // Spare Parts and Maintenance (6)
  'Gaskets', 'Seals', 'Bolts and Fasteners', 'Electrical Cables', 'Sensors', 'Control Panels',
  // Filter (8)
  'Air Filter', 'Fuel Filter', 'Chemical filter', 'Oil filter', 'Special filter', 'Multi function filter', 'Water filter', 'Gas filter',
  // Fuel and Combustion (5)
  'Coal', 'Diesel Fuel', 'Natural Gas', 'Fuel Oil', 'Biomass Pellets'
];

const MATERIAL_PRICES: { [key: string]: number } = {
  // Mechanical Equipment
  'Turbine Blades': 16000000,
  'Pump Components': 8500000,
  'Valve Systems': 12000000,
  'Bearing Units': 4500000,
  'Coupling Systems': 6800000,
  'Gear Box Parts': 9200000,
  // Water Treatment System
  'Reverse Osmosis Membranes': 15000000,
  'Ion Exchange Resins': 8500000,
  'Chemical Dosing Pumps': 7200000,
  'Water Quality Sensors': 3800000,
  'Filtration Media': 3200000,
  // Spare Parts and Maintenance
  'Gaskets': 450000,
  'Seals': 380000,
  'Bolts and Fasteners': 85000,
  'Electrical Cables': 1200000,
  'Sensors': 2500000,
  'Control Panels': 18000000,
  // Filter
  'Air Filter': 450000,
  'Fuel Filter': 520000,
  'Chemical filter': 680000,
  'Oil filter': 350000,
  'Special filter': 780000,
  'Multi function filter': 920000,
  'Water filter': 410000,
  'Gas filter': 550000,
  // Fuel and Combustion
  'Coal': 850000,
  'Diesel Fuel': 15000,
  'Natural Gas': 8500,
  'Fuel Oil': 12000,
  'Biomass Pellets': 650000
};

interface ConsolidatedDemandAlert {
  unit: string;
  category: string;
  material: string;
  overBudgetPercent: number;
  alertDescription: string;
}

const CONSOLIDATED_DEMAND_ALERTS: ConsolidatedDemandAlert[] = [
  {
    unit: 'UBP ADP',
    category: 'Water Treatment System',
    material: 'Filtration Media',
    overBudgetPercent: 15.2,
    alertDescription: 'Consolidated demand exceeds approved budget by 15.2%. Immediate adjustment required.'
  },
  {
    unit: 'UBP ADP',
    category: 'Spare Parts and Maintenance',
    material: 'Bolts and Fasteners',
    overBudgetPercent: 12.8,
    alertDescription: 'Demand forecast significantly higher than budget allocation. Review and reduce quantities.'
  }
];

const DPKDemandAdjustment: React.FC = () => {
  const navigate = useNavigate();
  const [selectedUnit, setSelectedUnit] = useState<string>('UBP ADP');
  // Material selection now acts as a filter for adjustments and final table
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All'); // now used only inside AI section filter
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [hasBudgetData, setHasBudgetData] = useState(false);
  const [showFinalTable, setShowFinalTable] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [isRetrievingBudget, setIsRetrievingBudget] = useState(false);
  const [demandAlerts] = useState<ConsolidatedDemandAlert[]>(CONSOLIDATED_DEMAND_ALERTS);
  const [resolvedAlerts, setResolvedAlerts] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const [adjustmentSelections, setAdjustmentSelections] = useState<AdjustmentSelectionsByMaterial>({});
  const [editingMonth, setEditingMonth] = useState<string | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<string | null>(null);
  const [customValues, setCustomValues] = useState<{ [key: string]: string }>({});

  const categories = ['All Categories', 'Filters', 'Fuel & Combustion', 'Lubricants & Fluids', 'Mechanical Parts', 'Electrical Components', 'Safety & Environment', 'Maintenance Supplies', 'Water Treatment System', 'Spare Parts and Maintenance'];
  const materials = MATERIALS;
  const materialPrices = MATERIAL_PRICES;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Helper function to generate material data with variation
  const generateMaterialData = (baseValues: number[], variation: number = 0) => {
    return baseValues.map(val => Math.round(val + (Math.random() * variation * 2 - variation)));
  };

  // Data structured by Unit -> Material -> Monthly Data
  const unitBudgetData: UnitBudgetData = useMemo(() => {
    // Target category totals (in billions converted to regular numbers)
    const categoryTargets: { [key: string]: number } = {
      'Fuel and Combustion': 44000000000,
      'Mechanical Equipment': 31000000000,
      'Water Treatment System': 28000000000,
      'Spare Parts and Maintenance': 21000000000,
      'Filter': 26000000000
    };

    // Base monthly patterns for each material (quantities, not values)
    const basePatterns: { [key: string]: number[] } = {
      // Mechanical Equipment (6 materials) - Target: 31 billion
      'Turbine Blades': [120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175],
      'Pump Components': [360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470],
      'Valve Systems': [250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360],
      'Bearing Units': [680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900],
      'Coupling Systems': [450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560],
      'Gear Box Parts': [330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440],
      // Water Treatment System (5 materials) - Target: 28 billion
      'Reverse Osmosis Membranes': [180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290],
      'Ion Exchange Resins': [320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430],
      'Chemical Dosing Pumps': [380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490],
      'Water Quality Sensors': [720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940],
      'Filtration Media': [850, 870, 890, 910, 930, 950, 970, 990, 1010, 1030, 1050, 1070],
      // Spare Parts and Maintenance (6 materials) - Target: 21 billion
      'Gaskets': [4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600],
      'Seals': [5300, 5400, 5500, 5600, 5700, 5800, 5900, 6000, 6100, 6200, 6300, 6400],
      'Bolts and Fasteners': [23000, 23500, 24000, 24500, 25000, 25500, 26000, 26500, 27000, 27500, 28000, 28500],
      'Electrical Cables': [1700, 1750, 1800, 1850, 1900, 1950, 2000, 2050, 2100, 2150, 2200, 2250],
      'Sensors': [800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020],
      'Control Panels': [110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165],
      // Filter (8 materials) - Target: 26 billion
      'Air Filter': [3200, 3250, 3300, 3350, 3400, 3450, 3500, 3550, 3600, 3650, 3700, 3750],
      'Fuel Filter': [2900, 2950, 3000, 3050, 3100, 3150, 3200, 3250, 3300, 3350, 3400, 3450],
      'Chemical filter': [2150, 2200, 2250, 2300, 2350, 2400, 2450, 2500, 2550, 2600, 2650, 2700],
      'Oil filter': [4100, 4150, 4200, 4250, 4300, 4350, 4400, 4450, 4500, 4550, 4600, 4650],
      'Special filter': [1900, 1950, 2000, 2050, 2100, 2150, 2200, 2250, 2300, 2350, 2400, 2450],
      'Multi function filter': [1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000, 2050, 2100, 2150],
      'Water filter': [3400, 3450, 3500, 3550, 3600, 3650, 3700, 3750, 3800, 3850, 3900, 3950],
      'Gas filter': [2600, 2650, 2700, 2750, 2800, 2850, 2900, 2950, 3000, 3050, 3100, 3150],
      // Fuel and Combustion (5 materials) - Target: 44 billion
      'Coal': [5000, 5200, 5400, 5600, 5800, 6000, 6200, 6400, 6600, 6800, 7000, 7200],
      'Diesel Fuel': [280000, 285000, 290000, 295000, 300000, 305000, 310000, 315000, 320000, 325000, 330000, 335000],
      'Natural Gas': [500000, 510000, 520000, 530000, 540000, 550000, 560000, 570000, 580000, 590000, 600000, 610000],
      'Fuel Oil': [330000, 335000, 340000, 345000, 350000, 355000, 360000, 365000, 370000, 375000, 380000, 385000],
      'Biomass Pellets': [1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000, 2050, 2100]
    };

    const createUnitData = (unitVariation: number) => {
      const unitData: { [material: string]: MaterialData } = {};

      materials.forEach((material) => {
        const pattern = basePatterns[material as keyof typeof basePatterns];
        if (!pattern) {
          console.error(`No pattern found for material: ${material}`);
          return;
        }
        const monthlyValues = generateMaterialData(pattern, unitVariation);
        const totalDemand = monthlyValues.reduce((sum, val) => sum + val, 0);
        const totalBudget = Math.round(totalDemand * (0.80 + Math.random() * 0.10)); // 80%-90% of demand - ALWAYS LOWER

        unitData[material] = {
          totalBudget,
          totalDemand,
          adjustmentNeeded: totalBudget - totalDemand,
          monthlyData: monthlyValues.map((val, idx) => {
            const budgetLimit = Math.round(val * (0.75 + Math.random() * 0.10)); // 75%-85% of demand - ALWAYS LOWER
            const reductionPercent = 0.30 + Math.random() * 0.25; // 30-55% below consolidated
            const recommendedAdjustment = Math.round(val * (1 - reductionPercent));
            const isOver = val > budgetLimit;
            return {
              month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx],
              consolidatedDemand: val,
              budgetLimit: budgetLimit,
              recommendedAdjustment: recommendedAdjustment,
              adjustmentPercent: ((recommendedAdjustment - val) / val) * 100,
              status: isOver ? 'over' as const : 'within' as const
            };
          })
        };
      });
      
      return unitData;
    };

    return {
      'UBP ADP': createUnitData(0),
      'UBP ASM': createUnitData(15),
      'UBP BEU': createUnitData(20),
      'UBP BKL': createUnitData(18),
      'UBP BKT': createUnitData(22),
      'UBP BLB': createUnitData(16),
      'UBP BLI': createUnitData(14),
      'UBP BLT': createUnitData(25),
      'UBP BRU': createUnitData(12),
      'UBP BSL': createUnitData(19),
      'UBP BTO': createUnitData(21),
      'UBP CLG': createUnitData(17),
      'UBP GRT': createUnitData(23),
      'UBP HTK': createUnitData(13),
      'UBP JMB': createUnitData(24),
      'UBP JPR': createUnitData(26),
      'UBP JRJ': createUnitData(11),
      'UBP KMJ': createUnitData(27),
      'UBP KRI': createUnitData(15),
      'UBP KRM': createUnitData(28),
      'UBP LBA': createUnitData(20),
      'UBP MHK': createUnitData(16),
      'UBP MRC': createUnitData(18),
      'UBP OMB': createUnitData(22),
      'UBP PNS': createUnitData(14),
      'UBP PRO': createUnitData(19),
      'UBP SGL': createUnitData(21),
      'UBP SGU': createUnitData(17),
      'UBP SKW': createUnitData(23),
      'UBP SLA': createUnitData(25),
      'UBP SMG': createUnitData(12),
      'UBP STG': createUnitData(24),
      'UBP TLO': createUnitData(26),
      'UBP TIR': createUnitData(13),
      'UBP JTG': createUnitData(27),
      'UBP TJB': createUnitData(28)
    };
  }, []);


  // Get current unit data (default to UBP ADP if "All Units" selected)
  // Get current unit data (default to UBP ADP if "All Units" selected)
  const currentUnit = selectedUnit;
  const materialBudgetData = useMemo(() => {
    return unitBudgetData[currentUnit] || unitBudgetData['UBP ADP'];
  }, [unitBudgetData, currentUnit]);
  
  // Get the display name for the current unit
  const currentUnitName = plnUnitsData.find(u => u.id === selectedUnit)?.name || selectedUnit;

  const currentMaterialKey = selectedMaterial === 'All' ? materials[0] : selectedMaterial;
  const currentMaterialData = useMemo(() => {
    const data = materialBudgetData[currentMaterialKey];
    if (!data) {
      console.warn(`No data found for material: ${currentMaterialKey}`);
      return {
        totalBudget: 0,
        totalDemand: 0,
        adjustmentNeeded: 0,
        monthlyData: []
      };
    }
    return data;
  }, [materialBudgetData, currentMaterialKey]);
  // Note: Currency helpers for overview removed; overview is now always aggregated across materials

  // Aggregated helpers when 'All' selected
  const aggregatedMonthly = useMemo(() => {
    const months = materialBudgetData[materials[0]].monthlyData.map(m => m.month);
    return months.map(month => {
      let consolidatedDemand = 0;
      let budgetLimit = 0;
      let recommendedAdjustment = 0;
      materials.forEach(mat => {
        const row = materialBudgetData[mat].monthlyData.find(r => r.month === month)!;
        consolidatedDemand += row.consolidatedDemand;
        budgetLimit += row.budgetLimit;
        recommendedAdjustment += row.recommendedAdjustment;
      });
      return { month, consolidatedDemand, budgetLimit, recommendedAdjustment };
    });
  }, [materialBudgetData, materials]);

  const aggregatedOverview = useMemo(() => {
    let totalBudgetQty = 0;
    let totalDemandQty = 0;
    let adjustmentNeededQty = 0;
    let totalBudgetAmt = 0;
    let totalDemandAmt = 0;
    let adjustmentNeededAmt = 0;
    materials.forEach(mat => {
      const data = materialBudgetData[mat];
      const price = materialPrices[mat] || 0;
      totalBudgetQty += data.totalBudget;
      totalDemandQty += data.totalDemand;
      adjustmentNeededQty += data.adjustmentNeeded;
      totalBudgetAmt += data.totalBudget * price;
      totalDemandAmt += data.totalDemand * price;
      adjustmentNeededAmt += data.adjustmentNeeded * price;
    });
    return {
      totalBudgetQty,
      totalDemandQty,
      adjustmentNeededQty,
      totalBudgetAmt,
      totalDemandAmt,
      adjustmentNeededAmt,
      status: adjustmentNeededQty < 0 ? 'Over Budget' : 'Within Budget'
    };
  }, [materialBudgetData, materialPrices, materials]);

  const finalAdjustedData = useMemo(() => {
    // Single material view
    if (selectedMaterial !== 'All') {
      const matKey = currentMaterialKey;
      if (!adjustmentSelections[matKey]) return [] as Array<{
        month: string; consolidatedDemand: number; budgetLimit: number; adjustedDemand: number; source: string; variance: number;
      }>;
      return currentMaterialData.monthlyData.map(item => {
        const selection = adjustmentSelections[matKey][item.month];
        const adjustedValue: number = selection ? selection.value : item.recommendedAdjustment;
        const src: AdjustmentSource = selection ? selection.source : 'recommended';
        return {
          month: item.month,
          consolidatedDemand: item.consolidatedDemand,
          budgetLimit: item.budgetLimit,
          adjustedDemand: adjustedValue,
          source: src === 'recommended' ? 'AI Recommended' : 'Custom Adjustment',
          variance: adjustedValue - item.budgetLimit
        };
      });
    }
    // Aggregated view for 'All'
    const months = materialBudgetData[materials[0]].monthlyData.map(m => m.month);
    return months.map(month => {
      let consolidatedDemand = 0;
      let budgetLimit = 0;
      let adjustedDemand = 0;
      let anyCustom = false;
      materials.forEach(mat => {
        const row = materialBudgetData[mat].monthlyData.find(r => r.month === month)!;
        consolidatedDemand += row.consolidatedDemand;
        budgetLimit += row.budgetLimit;
        const selection = adjustmentSelections[mat]?.[month];
        if (selection) {
          adjustedDemand += selection.value;
          if (selection.source === 'custom') anyCustom = true;
        } else {
          adjustedDemand += row.recommendedAdjustment;
        }
      });
      return {
        month,
        consolidatedDemand,
        budgetLimit,
        adjustedDemand,
        source: anyCustom ? 'Mixed' : 'AI Recommended',
        variance: adjustedDemand - budgetLimit
      };
    });
  }, [adjustmentSelections, currentMaterialData, currentMaterialKey, selectedMaterial, materialBudgetData, materials]);

  // Automatically load budget data and initialize selections when component mounts or filters change
  useEffect(() => {
    // Initialize selections for all materials
    const all: AdjustmentSelectionsByMaterial = {};
    materials.forEach(mat => {
      all[mat] = {};
      materialBudgetData[mat].monthlyData.forEach(item => {
        all[mat][item.month] = {
          source: 'recommended',
          value: item.recommendedAdjustment,
          percent: item.adjustmentPercent
        };
      });
    });
    setAdjustmentSelections(all);
    setHasBudgetData(true);
  }, [selectedUnit, materialBudgetData, materials]);

  const handleSourceChange = (month: string, source: AdjustmentSource, material?: string) => {
    const targetMaterial = material || currentMaterialKey;
    const monthData = materialBudgetData[targetMaterial].monthlyData.find(d => d.month === month);
    if (!monthData) return;

    let value = monthData.recommendedAdjustment;
    let percent = monthData.adjustmentPercent;

    if (source === 'custom') {
      value = adjustmentSelections[targetMaterial]?.[month]?.value || monthData.recommendedAdjustment;
      percent = adjustmentSelections[targetMaterial]?.[month]?.percent || monthData.adjustmentPercent;
      setEditingMonth(month);
      setEditingMaterial(targetMaterial);
      setCustomValues(prev => ({
        ...prev,
        [`${targetMaterial}:${month}`]: value.toString()
      }));
    } else {
      setEditingMonth(null);
      setEditingMaterial(null);
    }
    setAdjustmentSelections(prev => ({
      ...prev,
      [targetMaterial]: {
        ...(prev[targetMaterial] || {}),
        [month]: { source, value, percent }
      }
    }));
  };

  const handleCustomValueChange = (month: string, value: string, material?: string) => {
    const targetMaterial = material || currentMaterialKey;
    setCustomValues(prev => ({
      ...prev,
      [`${targetMaterial}:${month}`]: value
    }));
  };

  const handleSaveCustomValue = (month: string, material?: string) => {
    const targetMaterial = material || currentMaterialKey;
    const monthData = materialBudgetData[targetMaterial].monthlyData.find(d => d.month === month);
    if (!monthData) return;

    const valueKey = `${targetMaterial}:${month}`;
    const value = parseFloat(customValues[valueKey] || '0');
    if (isNaN(value) || value < 0) {
      alert('Please enter a valid positive number');
      return;
    }

    const percent = ((value - monthData.consolidatedDemand) / monthData.consolidatedDemand) * 100;
    setAdjustmentSelections(prev => ({
      ...prev,
      [targetMaterial]: {
        ...(prev[targetMaterial] || {}),
        [month]: { source: 'custom', value, percent }
      }
    }));
    setEditingMonth(null);
    setEditingMaterial(null);
  };

  const handleDone = () => {
    setShowFinalTable(true);
    setTimeout(() => {
      document.getElementById('final-adjusted-table')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleRetrieveBudgetData = () => {
    setIsRetrievingBudget(true);
    // Simulate data retrieval animation
    setTimeout(() => {
      setIsRetrievingBudget(false);
      setHasBudgetData(true);
    }, 2500);
  };

  const handleAlertClick = (alert: ConsolidatedDemandAlert) => {
    setSelectedUnit(alert.unit);
    setSelectedCategory(alert.category);
    setSelectedMaterial(alert.material);
    setTimeout(() => {
      document.getElementById('adjustments-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSaveAdjustments = () => {
    if (selectedUnit && selectedMaterial && selectedMaterial !== 'All') {
      const alertKey = `${selectedUnit}-${selectedCategory}-${selectedMaterial}`;
      setResolvedAlerts(prev => new Set([...prev, alertKey]));

      setSelectedUnit('UBP ADP');
      setSelectedMaterial('All');
      setSelectedCategory('');

      const newResolvedCount = resolvedAlerts.size + 1;
      if (newResolvedCount < CONSOLIDATED_DEMAND_ALERTS.length) {
        setTimeout(() => {
          document.getElementById('budget-deviation-alerts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        setTimeout(() => {
          document.getElementById('final-budget-category-breakdown')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  };

  const allAlertsResolved = resolvedAlerts.size === CONSOLIDATED_DEMAND_ALERTS.length;

  // Category mapping for materials - SAME AS DEMAND CONSOLIDATION
  const materialCategoryMapping: { [key: string]: string } = {
    'Filter air': 'Filter',
    'Air Filter': 'Filter',
    'Fuel Filter': 'Filter',
    'Chemical filter': 'Filter',
    'Oil filter': 'Filter',
    'Special filter': 'Filter',
    'Multi function filter': 'Filter',
    'Water filter': 'Filter',
    'Gas filter': 'Filter',
    'Coal': 'Fuel and Combustion',
    'Diesel Fuel': 'Fuel and Combustion',
    'Natural Gas': 'Fuel and Combustion',
    'Fuel Oil': 'Fuel and Combustion',
    'Biomass Pellets': 'Fuel and Combustion',
    'Turbine Blades': 'Mechanical Equipment',
    'Pump Components': 'Mechanical Equipment',
    'Valve Systems': 'Mechanical Equipment',
    'Bearing Units': 'Mechanical Equipment',
    'Coupling Systems': 'Mechanical Equipment',
    'Gear Box Parts': 'Mechanical Equipment',
    'Gaskets': 'Spare Parts and Maintenance',
    'Seals': 'Spare Parts and Maintenance',
    'Bolts and Fasteners': 'Spare Parts and Maintenance',
    'Electrical Cables': 'Spare Parts and Maintenance',
    'Sensors': 'Spare Parts and Maintenance',
    'Control Panels': 'Spare Parts and Maintenance',
    'Reverse Osmosis Membranes': 'Water Treatment System',
    'Ion Exchange Resins': 'Water Treatment System',
    'Chemical Dosing Pumps': 'Water Treatment System',
    'Water Quality Sensors': 'Water Treatment System',
    'Filtration Media': 'Water Treatment System'
  };

  // Calculate category breakdown when all alerts are resolved with material details
  const categoryBreakdown = useMemo(() => {
    if (!allAlertsResolved) return [];

    const categoryMap = new Map<string, {
      totalQuantity: number;
      totalValue: number;
      materials: Array<{
        id: string;
        name: string;
        unitPrice: number;
        units: number;
        totalQuantity: number;
        totalValue: number;
      }>;
    }>();

    materials.forEach(mat => {
      const category = materialCategoryMapping[mat] || 'Other';
      const price = materialPrices[mat] || 0;

      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          totalQuantity: 0,
          totalValue: 0,
          materials: []
        });
      }

      const categoryData = categoryMap.get(category)!;
      const matData = materialBudgetData[mat];

      let matTotalQty = 0;
      matData.monthlyData.forEach(row => {
        const selection = adjustmentSelections[mat]?.[row.month];
        const adjustedValue = selection ? selection.value : row.recommendedAdjustment;
        matTotalQty += adjustedValue;
        categoryData.totalQuantity += adjustedValue;
        categoryData.totalValue += adjustedValue * price;
      });

      categoryData.materials.push({
        id: `MAT-${mat.substring(0, 8).toUpperCase().replace(/\s+/g, '')}`,
        name: mat,
        unitPrice: price,
        units: 15,
        totalQuantity: matTotalQty,
        totalValue: matTotalQty * price
      });
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      totalQuantity: data.totalQuantity,
      totalValue: data.totalValue,
      materialsCount: data.materials.length,
      materials: data.materials.sort((a, b) => b.totalValue - a.totalValue)
    })).sort((a, b) => b.totalValue - a.totalValue);
  }, [allAlertsResolved, materials, materialBudgetData, adjustmentSelections, materialCategoryMapping, materialPrices]);

  const grandTotalValue = useMemo(() => {
    return aggregatedOverview.totalBudgetAmt;
  }, [aggregatedOverview]);

  const totalMaterialsCount = useMemo(() => {
    return categoryBreakdown.reduce((sum, cat) => sum + cat.materialsCount, 0);
  }, [categoryBreakdown]);

  const handleExportFinalAdjustment = () => {
    const csvContent = [
      ['Month', 'Consolidated Demand', 'Budget Limit', 'Adjusted Demand', 'Source', 'Variance'].join(','),
      ...finalAdjustedData.map(row =>
        [row.month, row.consolidatedDemand, row.budgetLimit, row.adjustedDemand, row.source, row.variance].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `adjusted_demand_${selectedMaterial}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = useMemo(() => {
    // Always show all materials in the chart, regardless of filter
    return aggregatedMonthly.map(item => ({
      month: item.month,
      'Consolidated Demand': item.consolidatedDemand,
      'Budget Limit': item.budgetLimit,
      'Recommended': item.recommendedAdjustment
    }));
  }, [aggregatedMonthly]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()} units
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sliders className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Demand Adjustment (Stage 3)
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Adjust your consolidated demand to fit within budget constraints. AI recommendations are provided based on historical patterns and priorities. Use the filters to view specific units and materials.
            </p>
          </div>
        </div>
      </div>

      {/* Retrieve Budget Data Button */}
      {!hasBudgetData && !isRetrievingBudget && (
        <div className="flex justify-center">
          <button
            onClick={handleRetrieveBudgetData}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Database className="h-6 w-6" />
            <span>Retrieve Budget Data from E-Budgeting</span>
          </button>
        </div>
      )}

      {/* Loading Animation */}
      {isRetrievingBudget && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
              <Database className="h-8 w-8 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Retrieving Budget Data...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connecting to E-Budgeting Application
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Overview Cards - Show after retrieval */}
      {hasBudgetData && aggregatedOverview && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Budget Data Retrieved from E-Budgeting
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Approved Budget - Highlighted */}
            <div className="relative p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border-2 border-blue-400 dark:border-blue-600 shadow-lg">
              <div className="absolute top-3 right-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-semibold mb-2">Total Approved Budget</p>
              <p className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-3 break-words">
                {formatCurrency(aggregatedOverview.totalBudgetAmt)}
              </p>
              <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Consolidated Demand Request</p>
                <p className="text-base font-semibold text-gray-700 dark:text-gray-300 break-words">
                  {formatCurrency(aggregatedOverview.totalDemandAmt)}
                </p>
              </div>
            </div>

            {/* Amount of Budget Adjusted */}
            <div className={`p-5 rounded-xl border-2 ${
              aggregatedOverview.adjustmentNeededAmt < 0
                ? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600'
                : 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600'
            }`}>
              <p className={`text-xs uppercase font-semibold mb-2 ${
                aggregatedOverview.adjustmentNeededAmt < 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-600 dark:text-green-400'
              }`}>
                Budget Adjustment Needed
              </p>
              <p className={`text-3xl font-extrabold mb-2 break-words ${
                aggregatedOverview.adjustmentNeededAmt < 0
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-green-700 dark:text-green-300'
              }`}>
                {formatCurrency(Math.abs(aggregatedOverview.adjustmentNeededAmt))}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {aggregatedOverview.adjustmentNeededAmt < 0
                  ? 'Budget exceeded - reduction required'
                  : 'Within budget - surplus available'
                }
              </p>
            </div>

            {/* Status Card */}
            <div className={`p-5 rounded-xl border-2 ${
              aggregatedOverview.adjustmentNeededAmt < 0
                ? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600'
                : 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600'
            }`}>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold mb-2">Budget Status</p>
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  aggregatedOverview.adjustmentNeededAmt < 0
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-green-500'
                }`}></div>
                <p className={`text-2xl font-extrabold break-words ${
                  aggregatedOverview.adjustmentNeededAmt < 0
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-green-700 dark:text-green-300'
                }`}>
                  {aggregatedOverview.adjustmentNeededAmt < 0 ? 'Over Budget' : 'Within Budget'}
                </p>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {aggregatedOverview.adjustmentNeededAmt < 0
                  ? `${Math.abs(((aggregatedOverview.adjustmentNeededAmt / aggregatedOverview.totalBudgetAmt) * 100).toFixed(1))}% over approved budget`
                  : 'All demands within budget limits'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Budget Deviation Alerts */}
      {hasBudgetData && demandAlerts.filter(alert => {
        const alertKey = `${alert.unit}-${alert.category}-${alert.material}`;
        return !resolvedAlerts.has(alertKey);
      }).length > 0 && (
        <div id="budget-deviation-alerts" className="bg-white dark:bg-gray-900 rounded-xl border-2 border-orange-200 dark:border-orange-800 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 border-b border-orange-200 dark:border-orange-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Budget Deviation Alerts
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {demandAlerts.filter(alert => {
                      const alertKey = `${alert.unit}-${alert.category}-${alert.material}`;
                      return !resolvedAlerts.has(alertKey);
                    }).length} alert{demandAlerts.filter(alert => {
                      const alertKey = `${alert.unit}-${alert.category}-${alert.material}`;
                      return !resolvedAlerts.has(alertKey);
                    }).length !== 1 ? 's' : ''} remaining - Click on each card to review and adjust
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demandAlerts.filter(alert => {
                const alertKey = `${alert.unit}-${alert.category}-${alert.material}`;
                return !resolvedAlerts.has(alertKey);
              }).map((alert, index) => (
                <div
                  key={`${alert.unit}-${alert.material}-${index}`}
                  onClick={() => handleAlertClick(alert)}
                  className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-xl p-4 hover:shadow-lg hover:border-orange-500 dark:hover:border-orange-500 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-orange-500 text-white">
                          {alert.overBudgetPercent.toFixed(1)}%
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">
                        {alert.unit}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Category:</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                        {alert.category}
                      </span>
                    </div>

                    <div className="flex items-start space-x-2">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex-shrink-0">Material:</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {alert.material}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-orange-200 dark:border-orange-800">
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {alert.alertDescription}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Final Budget Category Breakdown - Show after all alerts resolved */}
      {hasBudgetData && allAlertsResolved && (
        <div id="final-budget-category-breakdown" className="space-y-4">
          {/* Header */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Consolidated Procurement Requirements
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    All deviation alerts resolved. Review by category before sending to E-Budget.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  TOTAL CATEGORIES
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {categoryBreakdown.length}
                </p>
              </div>
            </div>
          </div>

          {/* Category Cards with Expandable Details */}
          <div className="space-y-2">
            {categoryBreakdown.map((category) => {
              const isExpanded = expandedCategories.has(category.category);
              return (
                <div
                  key={category.category}
                  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
                >
                  {/* Category Header - Clickable */}
                  <button
                    onClick={() => toggleCategory(category.category)}
                    className="w-full p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-base font-bold text-gray-900 dark:text-white">
                            {category.category}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {category.materialsCount} materials from 15 units
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-8">
                        <div className="text-right">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            TOTAL QUANTITY
                          </p>
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">
                            {category.totalQuantity.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            TOTAL VALUE
                          </p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(category.totalValue)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Material Details Table - Expandable */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Material ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Material Name
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Unit Price (IDR)
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Units
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Total Quantity
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Total Value (IDR)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {category.materials.map((material, idx) => (
                              <tr key={material.id} className="hover:bg-white dark:hover:bg-gray-900 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                                  {material.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                  {material.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white">
                                  {material.unitPrice.toLocaleString('id-ID')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-600 text-white text-xs font-bold rounded-full">
                                    {material.units}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900 dark:text-white">
                                  {material.totalQuantity.toLocaleString('id-ID')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-600 dark:text-green-400">
                                  {formatCurrency(material.totalValue)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                              <td colSpan={5} className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                                Category Total:
                              </td>
                              <td className="px-6 py-4 text-right text-base font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(category.totalValue)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grand Total */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">
                  GRAND TOTAL VALUE
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {formatCurrency(grandTotalValue)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">
                  TOTAL MATERIALS
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {totalMaterialsCount}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {hasBudgetData && !allAlertsResolved && (
        <>
          {/* <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Budget Overview - All Materials
            </h3>
            {aggregatedOverview ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-600 dark:text-blue-400 uppercase mb-3">Total Budget</p>
                  <p className="text-3xl font-extrabold text-blue-700 dark:text-blue-300">
                    {formatCurrency(aggregatedOverview.totalBudgetAmt)}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-xs text-purple-600 dark:text-purple-400 uppercase mb-3">Consolidated Demand</p>
                  <p className="text-3xl font-extrabold text-purple-700 dark:text-purple-300">
                    {formatCurrency(aggregatedOverview.totalDemandAmt)}
                  </p>
                </div>
                <div className={`p-4 rounded-lg border ${
                  aggregatedOverview.adjustmentNeededQty < 0
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                }`}>
                  <p className={`text-xs uppercase mb-3 ${
                    aggregatedOverview.adjustmentNeededQty < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    Adjustment Needed
                  </p>
                  <p className={`text-3xl font-extrabold ${
                    aggregatedOverview.adjustmentNeededQty < 0
                      ? 'text-red-700 dark:text-red-300'
                      : 'text-green-700 dark:text-green-300'
                  }`}>
                    {formatCurrency(aggregatedOverview.adjustmentNeededAmt)}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="text-xs text-orange-600 dark:text-orange-400 uppercase mb-1">Status</p>
                  <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                    {aggregatedOverview.status}
                  </p>
                </div>
              </div>
            ) : null}
          </div> */}

          {/* <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Budget vs Demand Comparison
              </h3>
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    chartType === 'bar'
                      ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Bar
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    chartType === 'line'
                      ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Line
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={400} key={`chart-${chartType}`}>
              {chartType === 'bar' ? (
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} domain={[0, 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Consolidated Demand" fill="#A855F7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Budget Limit" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Recommended" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} domain={[0, 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="Consolidated Demand" stroke="#A855F7" strokeWidth={3} dot={{ fill: '#A855F7', r: 4 }} />
                  <Line type="monotone" dataKey="Budget Limit" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 4 }} />
                  <Line type="monotone" dataKey="Recommended" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', r: 4 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Factory className="h-5 w-5" />
                  <span>Unit Selection</span>
                </h3>
              </div>
              <select
                value={selectedUnit}
                onChange={(e) => {
                  setSelectedUnit(e.target.value);
                  setShowFinalTable(false);
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {plnUnitsData.map(unit => (
                  <option key={unit.id} value={unit.id}>{unit.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Category</span>
                </h3>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setShowFinalTable(false);
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Material Selection</span>
                </h3>
              </div>
              <select
                value={selectedMaterial}
                onChange={(e) => {
                  setSelectedMaterial(e.target.value);
                  setShowFinalTable(false);
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="All">All Materials</option>
                {materials.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>
          </div>

          <div id="adjustments-table" className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-orange-500" />
                  <span>AI-Recommended Adjustments</span>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Choose AI recommendation or enter custom adjustment for each month
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleDone}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg transition-colors flex items-center space-x-2 font-semibold shadow-lg"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Done - Show Final Table</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {selectedMaterial === 'All' ? (
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Unit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Material</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Month</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Consolidated (Qty)</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Consolidated Amt</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">AI Recommended</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Recommended Amt</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase min-w-[300px]">Select Adjustment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {materials.map(mat => {
                      const price = materialPrices[mat] || 0;
                      return materialBudgetData[mat].monthlyData.map((row, idx) => {
                        const consolidatedAmount = row.consolidatedDemand * price;
                        const recommendedAmount = row.recommendedAdjustment * price;
                        const selection = adjustmentSelections[mat]?.[row.month];
                        const isEditing = editingMonth === row.month && editingMaterial === mat;
                        return (
                          <tr key={`${mat}-${row.month}-${idx}`} className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${row.status === 'over' ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">{currentUnitName}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{mat}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.month}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{row.consolidatedDemand.toLocaleString()} units</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">{formatCurrency(consolidatedAmount)}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              <div className="flex flex-col items-end">
                                <span className="font-semibold text-blue-700 dark:text-blue-400">{row.recommendedAdjustment.toLocaleString()} units</span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">(0%)</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-semibold text-green-700 dark:text-green-400">{formatCurrency(recommendedAmount)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center space-x-3">
                                <label className="flex items-center space-x-1.5 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`adjustment-${mat}-${row.month}`}
                                    checked={selection?.source === 'recommended'}
                                    onChange={() => handleSourceChange(row.month, 'recommended', mat)}
                                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                                  />
                                  <span className="text-xs text-gray-700 dark:text-gray-300">AI Recommended</span>
                                </label>
                                <label className="flex items-center space-x-1.5 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`adjustment-${mat}-${row.month}`}
                                    checked={selection?.source === 'custom'}
                                    onChange={() => handleSourceChange(row.month, 'custom', mat)}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-xs text-gray-700 dark:text-gray-300">Custom</span>
                                </label>
                                {selection?.source === 'custom' && (
                                  <div className="flex items-center space-x-2">
                                    {isEditing ? (
                                      <>
                                        <input
                                          type="number"
                                          value={customValues[`${mat}:${row.month}`] || ''}
                                          onChange={(e) => handleCustomValueChange(row.month, e.target.value, mat)}
                                          className="w-24 px-2 py-1 text-xs border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                          placeholder="Enter value"
                                          autoFocus
                                        />
                                        <button
                                          onClick={() => handleSaveCustomValue(row.month, mat)}
                                          className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                          title="Save custom value"
                                        >
                                          <Save className="h-4 w-4" />
                                        </button>
                                      </>
                                    ) : (
                                      <div className="flex items-center space-x-2">
                                        <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                                          {selection?.value.toLocaleString()}
                                        </span>
                                        <button
                                          onClick={() => {
                                            setEditingMonth(row.month);
                                            setEditingMaterial(mat);
                                            setCustomValues(prev => ({
                                              ...prev,
                                              [`${mat}:${row.month}`]: selection?.value.toString() || ''
                                            }));
                                          }}
                                          className="p-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                                          title="Edit value"
                                        >
                                          <Edit3 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Unit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Material</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Month</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Consolidated (Qty)</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Consolidated Amt</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">AI Recommended</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Difference</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Recommended Amt</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase min-w-[300px]">Select Adjustment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {currentMaterialData.monthlyData.map((row, index) => {
                      const unitPriceSingle = materialPrices[selectedMaterial] || 1000000;
                      const consolidatedAmount = row.consolidatedDemand * unitPriceSingle;
                      const recommendedAmount = row.recommendedAdjustment * unitPriceSingle;

                      return (
                        <tr key={index} className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                          row.status === 'over' ? 'bg-red-50/30 dark:bg-red-900/10' : ''
                        }`}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">{currentUnitName}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{selectedMaterial}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.month}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{row.consolidatedDemand.toLocaleString()} units</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">{formatCurrency(consolidatedAmount)}</td>
                          <td className="px-4 py-3 text-sm text-right">
                            <div className="flex flex-col items-end">
                              <span className="font-semibold text-blue-700 dark:text-blue-400">{row.recommendedAdjustment.toLocaleString()} units</span>
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                ({row.adjustmentPercent.toFixed(1)}%)
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-red-600 dark:text-red-400">
                            {(row.recommendedAdjustment - row.consolidatedDemand).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-green-700 dark:text-green-400">
                            {formatCurrency(recommendedAmount)}
                          </td>
                          <td className="px-4 py-3">
                          <div className="flex items-center justify-center space-x-3">
                            <label className="flex items-center space-x-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name={`adjustment-${row.month}`}
                                checked={adjustmentSelections[currentMaterialKey]?.[row.month]?.source === 'recommended'}
                                onChange={() => handleSourceChange(row.month, 'recommended')}
                                className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                              />
                              <span className="text-xs text-gray-700 dark:text-gray-300">AI Recommended</span>
                            </label>
                            <label className="flex items-center space-x-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name={`adjustment-${row.month}`}
                                checked={adjustmentSelections[currentMaterialKey]?.[row.month]?.source === 'custom'}
                                onChange={() => handleSourceChange(row.month, 'custom')}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-xs text-gray-700 dark:text-gray-300">Custom</span>
                            </label>
                            {adjustmentSelections[currentMaterialKey]?.[row.month]?.source === 'custom' && (
                              <div className="flex items-center space-x-2">
                                {editingMonth === row.month ? (
                                  <>
                                    <input
                                      type="number"
                                      value={customValues[`${currentMaterialKey}:${row.month}`] || ''}
                                      onChange={(e) => handleCustomValueChange(row.month, e.target.value)}
                                      className="w-24 px-2 py-1 text-xs border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                      placeholder="Enter value"
                                      autoFocus
                                    />
                                    <button
                                      onClick={() => handleSaveCustomValue(row.month)}
                                      className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                      title="Save custom value"
                                    >
                                      <Save className="h-4 w-4" />
                                    </button>
                                  </>
                                ) : (
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                                      {adjustmentSelections[currentMaterialKey]?.[row.month]?.value.toLocaleString()}
                                    </span>
                                    <button
                                      onClick={() => {
                                        setEditingMonth(row.month);
                                        setEditingMaterial(currentMaterialKey);
                                        setCustomValues(prev => ({
                                          ...prev,
                                          [`${currentMaterialKey}:${row.month}`]: adjustmentSelections[currentMaterialKey]?.[row.month]?.value.toString() || ''
                                        }));
                                      }}
                                      className="p-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                                      title="Edit value"
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Save Adjustments Button */}
            {selectedMaterial !== 'All' && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-semibold">
                      Filtered by: <span className="text-blue-600 dark:text-blue-400">{selectedUnit}</span> - <span className="text-blue-600 dark:text-blue-400">{selectedMaterial}</span>
                    </p>
                    <p className="text-xs mt-1">Click Save to mark this deviation alert as resolved</p>
                  </div>
                  <button
                    onClick={handleSaveAdjustments}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Save Adjustments</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {showFinalTable && (
            <div id="final-adjusted-table" className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-blue-300 dark:border-blue-700 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Final Adjusted Demand
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Material: <span className="font-semibold">{selectedMaterial}</span> • Ready for Approval
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleExportFinalAdjustment}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 font-semibold shadow-lg"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>

              <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-lg">
                {selectedMaterial === 'All' ? (
                  <table className="w-full">
                    <thead className="bg-blue-100 dark:bg-blue-900/40 border-b-2 border-blue-300 dark:border-blue-700">
                      <tr>
                        <th className="px-4 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase">Unit</th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase">Month</th>
                        <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Consolidated (All)</th>
                        <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Adjusted Demand (All)</th>
                        <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Total Amount (All)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {finalAdjustedData.map((row, idx) => {
                        let totalAmount = 0;
                        materials.forEach(mat => {
                          const selection = adjustmentSelections[mat]?.[row.month];
                          const rowData = materialBudgetData[mat].monthlyData.find(r => r.month === row.month)!;
                          const val = selection ? selection.value : rowData.recommendedAdjustment;
                          totalAmount += val * (materialPrices[mat] || 0);
                        });
                        return (
                          <tr key={idx} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">{currentUnitName}</td>
                            <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white">{row.month}</td>
                            <td className="px-4 py-4 text-sm text-right text-gray-600 dark:text-gray-400">{row.consolidatedDemand.toLocaleString()}</td>
                            <td className="px-4 py-4 text-sm text-right font-bold text-blue-700 dark:text-blue-400">{row.adjustedDemand.toLocaleString()} units</td>
                            <td className="px-4 py-4 text-sm text-right font-bold text-green-700 dark:text-green-400 text-lg">{formatCurrency(totalAmount)}</td>
                          </tr>
                        );
                      })}
                      <tr className="bg-blue-100 dark:bg-blue-900/40 font-bold border-t-2 border-blue-300 dark:border-blue-700">
                        <td className="px-4 py-5 text-base text-gray-900 dark:text-white uppercase" colSpan={1}>{currentUnitName}</td>
                        <td className="px-4 py-5 text-base text-gray-900 dark:text-white uppercase">Annual Total</td>
                        <td className="px-4 py-5 text-sm text-right text-gray-600 dark:text-gray-400 font-semibold">{finalAdjustedData.reduce((sum, row) => sum + row.consolidatedDemand, 0).toLocaleString()}</td>
                        <td className="px-4 py-5 text-base text-right text-blue-700 dark:text-blue-400 font-bold">{finalAdjustedData.reduce((sum, row) => sum + row.adjustedDemand, 0).toLocaleString()} units</td>
                        <td className="px-4 py-5 text-base text-right text-green-700 dark:text-green-400 text-xl font-extrabold">{formatCurrency(materials.reduce((amt, mat) => {
                          return amt + materialBudgetData[mat].monthlyData.reduce((inner, r) => {
                            const sel = adjustmentSelections[mat]?.[r.month];
                            const val = sel ? sel.value : r.recommendedAdjustment;
                            return inner + val * (materialPrices[mat] || 0);
                          }, 0);
                        }, 0))}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full">
                    <thead className="bg-blue-100 dark:bg-blue-900/40 border-b-2 border-blue-300 dark:border-blue-700">
                      <tr>
                        <th className="px-4 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase">Unit</th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase">Material</th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase">Month</th>
                        <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Consolidated</th>
                        <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Adjusted Demand</th>
                        <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Unit Price</th>
                        <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {finalAdjustedData.map((row, index) => {
                        const unitPriceSingle = materialPrices[selectedMaterial] || 1000000;
                        const totalAmount = row.adjustedDemand * unitPriceSingle;
                        return (
                          <tr key={index} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">{currentUnitName}</td>
                            <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white">{selectedMaterial}</td>
                            <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white">{row.month}</td>
                            <td className="px-4 py-4 text-sm text-right text-gray-600 dark:text-gray-400">{row.consolidatedDemand.toLocaleString()}</td>
                            <td className="px-4 py-4 text-sm text-right font-bold text-blue-700 dark:text-blue-400">{row.adjustedDemand.toLocaleString()} units</td>
                            <td className="px-4 py-4 text-sm text-right text-gray-600 dark:text-gray-400">{formatCurrency(unitPriceSingle)}</td>
                            <td className="px-4 py-4 text-sm text-right font-bold text-green-700 dark:text-green-400 text-lg">{formatCurrency(totalAmount)}</td>
                          </tr>
                        );
                      })}
                      <tr className="bg-blue-100 dark:bg-blue-900/40 font-bold border-t-2 border-blue-300 dark:border-blue-700">
                        <td className="px-4 py-5 text-base text-gray-900 dark:text-white uppercase" colSpan={1}>{currentUnitName}</td>
                        <td className="px-4 py-5 text-base text-gray-900 dark:text-white uppercase" colSpan={1}>{selectedMaterial}</td>
                        <td className="px-4 py-5 text-base text-gray-900 dark:text-white uppercase">Annual Total</td>
                        <td className="px-4 py-5 text-sm text-right text-gray-600 dark:text-gray-400 font-semibold">{currentMaterialData.totalDemand.toLocaleString()}</td>
                        <td className="px-4 py-5 text-base text-right text-blue-700 dark:text-blue-400 font-bold">{finalAdjustedData.reduce((sum, row) => sum + row.adjustedDemand, 0).toLocaleString()} units</td>
                        <td className="px-4 py-5 text-sm text-right text-gray-600 dark:text-gray-400 font-semibold">Avg: {formatCurrency(materialPrices[selectedMaterial] || 1000000)}</td>
                        <td className="px-4 py-5 text-base text-right text-green-700 dark:text-green-400 text-xl font-extrabold">{formatCurrency(finalAdjustedData.reduce((sum, row) => sum + row.adjustedDemand, 0) * (materialPrices[selectedMaterial] || 1000000))}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>

              <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Adjustments Complete</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      Your adjusted demand is ready for final approval. This data can now be sent to production planning or exported for further analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DPKDemandAdjustment;
