import React, { useState, useMemo } from 'react';
import { FileText, Download, CheckCircle2, DollarSign, TrendingUp, Package, Calendar, Factory, Filter } from 'lucide-react';
import plnUnitsData from '../../../data/plnUnits.json';
import { annualBudgetMockData, categoryBudgetDistribution, formatBudget as formatBudgetDisplay, formatUnits } from '../../../data/annualBudgetMockData';
import RetrieveProcurementRequestTable from '../../../components/DemandToPlan/RetrieveProcurementRequestTable';
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
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface MonthlyProcurementData {
  month: string;
  netProcurement: number;
  unitPrice: number;
  totalAmount: number;
}

interface MaterialProcurementData {
  [material: string]: {
    totalQuantity: number;
    unitPrice: number;
    totalAmount: number;
    monthlyData: MonthlyProcurementData[];
  };
}

const DPKFinalProcurement: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All Material');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [filteredMaterial, setFilteredMaterial] = useState<string | null>(null);

  const categories = ['All Categories', 'Filters', 'Fuel & Combustion', 'Lubricants & Fluids', 'Mechanical Parts', 'Electrical Components', 'Safety & Environment', 'Maintenance Supplies'];
  const materials = ['All Material', 'Air Filter', 'Fuel Filter', 'Chemical filter', 'Oil filter', 'Special filter', 'Multi function filter', 'Water filter', 'Gas Filter'];
  const allMaterialsList = [
    'All Material',
    'Air Filter',
    'Fuel Filter',
    'Chemical filter',
    'Oil filter',
    'Special filter',
    'Multi function filter',
    'Water filter',
    'Gas Filter',
    'Bottom Ash Removal Systems',
    'Fly Ash Handling Equipment',
    'Ash Conveyors',
    'Ash Silos',
    'Turbine Oil',
    'Hydraulic Oil',
    'Gear Oil',
    'Circuit Breakers',
    'Transformers',
    'Power Cables'
  ];

  const materialProcurementData: MaterialProcurementData = useMemo(() => ({
  'All Material': {
    totalQuantity: 1392,
    unitPrice: 400000000,
    totalAmount: 629320000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 110, unitPrice: 400000000, totalAmount: 48800000000 },
      { month: 'Feb', netProcurement: 104, unitPrice: 400000000, totalAmount: 46480000000 },
      { month: 'Mar', netProcurement: 121, unitPrice: 400000000, totalAmount: 54200000000 },
      { month: 'Apr', netProcurement: 115, unitPrice: 400000000, totalAmount: 51950000000 },
      { month: 'May', netProcurement: 128, unitPrice: 400000000, totalAmount: 57900000000 },
      { month: 'Jun', netProcurement: 111, unitPrice: 400000000, totalAmount: 50190000000 },
      { month: 'Jul', netProcurement: 119, unitPrice: 400000000, totalAmount: 54100000000 },
      { month: 'Aug', netProcurement: 122, unitPrice: 400000000, totalAmount: 55360000000 },
      { month: 'Sep', netProcurement: 109, unitPrice: 400000000, totalAmount: 49400000000 },
      { month: 'Oct', netProcurement: 119, unitPrice: 400000000, totalAmount: 54020000000 },
      { month: 'Nov', netProcurement: 128, unitPrice: 400000000, totalAmount: 58080000000 },
      { month: 'Dec', netProcurement: 126, unitPrice: 400000000, totalAmount: 57340000000 }
    ]
  },
  'Air Filter': {
    totalQuantity: 392,
    unitPrice: 300000000,
    totalAmount: 117600000000,
    monthlyData: [
      {
        month: 'Jan',
        netProcurement: 28,
        unitPrice: 300000000,
        totalAmount: 8400000000
      },
      {
        month: 'Feb',
        netProcurement: 29,
        unitPrice: 300000000,
        totalAmount: 8700000000
      },
      {
        month: 'Mar',
        netProcurement: 30,
        unitPrice: 300000000,
        totalAmount: 9000000000
      },
      {
        month: 'Apr',
        netProcurement: 31,
        unitPrice: 300000000,
        totalAmount: 9300000000
      },
      {
        month: 'May',
        netProcurement: 32,
        unitPrice: 300000000,
        totalAmount: 9600000000
      },
      {
        month: 'Jun',
        netProcurement: 33,
        unitPrice: 300000000,
        totalAmount: 9900000000
      },
      {
        month: 'Jul',
        netProcurement: 34,
        unitPrice: 300000000,
        totalAmount: 10200000000
      },
      {
        month: 'Aug',
        netProcurement: 35,
        unitPrice: 300000000,
        totalAmount: 10500000000
      },
      {
        month: 'Sep',
        netProcurement: 33,
        unitPrice: 300000000,
        totalAmount: 9900000000
      },
      {
        month: 'Oct',
        netProcurement: 34,
        unitPrice: 300000000,
        totalAmount: 10200000000
      },
      {
        month: 'Nov',
        netProcurement: 36,
        unitPrice: 300000000,
        totalAmount: 10800000000
      },
      {
        month: 'Dec',
        netProcurement: 37,
        unitPrice: 300000000,
        totalAmount: 11100000000
      },
      
    ]
  },
  'Fuel Filter': {
    totalQuantity: 284,
    unitPrice: 700000000,
    totalAmount: 198800000000,
    monthlyData: [
      {
        month: 'Jan',
        netProcurement: 19,
        unitPrice: 700000000,
        totalAmount: 13300000000
      },
      {
        month: 'Feb',
        netProcurement: 20,
        unitPrice: 700000000,
        totalAmount: 14000000000
      },
      {
        month: 'Mar',
        netProcurement: 21,
        unitPrice: 700000000,
        totalAmount: 14700000000
      },
      {
        month: 'Apr',
        netProcurement: 22,
        unitPrice: 700000000,
        totalAmount: 15400000000
      },
      {
        month: 'May',
        netProcurement: 23,
        unitPrice: 700000000,
        totalAmount: 16100000000
      },
      {
        month: 'Jun',
        netProcurement: 24,
        unitPrice: 700000000,
        totalAmount: 16800000000
      },
      {
        month: 'Jul',
        netProcurement: 25,
        unitPrice: 700000000,
        totalAmount: 17500000000
      },
      {
        month: 'Aug',
        netProcurement: 26,
        unitPrice: 700000000,
        totalAmount: 18200000000
      },
      {
        month: 'Sep',
        netProcurement: 24,
        unitPrice: 700000000,
        totalAmount: 16800000000
      },
      {
        month: 'Oct',
        netProcurement: 25,
        unitPrice: 700000000,
        totalAmount: 17500000000
      },
      {
        month: 'Nov',
        netProcurement: 27,
        unitPrice: 700000000,
        totalAmount: 18900000000
      },
      {
        month: 'Dec',
        netProcurement: 28,
        unitPrice: 700000000,
        totalAmount: 19600000000
      },
      
    ]
  },
  'Oil filter': {
    totalQuantity: 464,
    unitPrice: 50000000,
    totalAmount: 23200000000,
    monthlyData: [
      {
        month: 'Jan',
        netProcurement: 34,
        unitPrice: 50000000,
        totalAmount: 1700000000
      },
      {
        month: 'Feb',
        netProcurement: 35,
        unitPrice: 50000000,
        totalAmount: 1750000000
      },
      {
        month: 'Mar',
        netProcurement: 36,
        unitPrice: 50000000,
        totalAmount: 1800000000
      },
      {
        month: 'Apr',
        netProcurement: 37,
        unitPrice: 50000000,
        totalAmount: 1850000000
      },
      {
        month: 'May',
        netProcurement: 38,
        unitPrice: 50000000,
        totalAmount: 1900000000
      },
      {
        month: 'Jun',
        netProcurement: 39,
        unitPrice: 50000000,
        totalAmount: 1950000000
      },
      {
        month: 'Jul',
        netProcurement: 40,
        unitPrice: 50000000,
        totalAmount: 2000000000
      },
      {
        month: 'Aug',
        netProcurement: 41,
        unitPrice: 50000000,
        totalAmount: 2050000000
      },
      {
        month: 'Sep',
        netProcurement: 39,
        unitPrice: 50000000,
        totalAmount: 1950000000
      },
      {
        month: 'Oct',
        netProcurement: 40,
        unitPrice: 50000000,
        totalAmount: 2000000000
      },
      {
        month: 'Nov',
        netProcurement: 42,
        unitPrice: 50000000,
        totalAmount: 2100000000
      },
      {
        month: 'Dec',
        netProcurement: 43,
        unitPrice: 50000000,
        totalAmount: 2150000000
      },
      
    ]
  },
  'Gas Filter': {
    totalQuantity: 180,
    unitPrice: 250000000,
    totalAmount: 57500000000,
    monthlyData: [
      {
        month: 'Jan',
        netProcurement: 15,
        unitPrice: 250000000,
        totalAmount: 3625000000
      },
      {
        month: 'Feb',
        netProcurement: 15,
        unitPrice: 250000000,
        totalAmount: 3875000000
      },
      {
        month: 'Mar',
        netProcurement: 15,
        unitPrice: 250000000,
        totalAmount: 4125000000
      },
      {
        month: 'Apr',
        netProcurement: 15,
        unitPrice: 250000000,
        totalAmount: 4375000000
      },
      {
        month: 'May',
        netProcurement: 15,
        unitPrice: 250000000,
        totalAmount: 4625000000
      },
      {
        month: 'Jun',
        netProcurement: 15,
        unitPrice: 250000000,
        totalAmount: 4875000000
      },
      {
        month: 'Jul',
        netProcurement: 15,
        unitPrice: 250000000,
        totalAmount: 5125000000
      },
      {
        month: 'Aug',
        netProcurement: 15,
        unitPrice: 250000000,
        totalAmount: 5375000000
      },
      {
        month: 'Sep',
        netProcurement: 15,
        unitPrice: 250000000,
        totalAmount: 4875000000
      },
      {
        month: 'Oct',
        netProcurement: 15,
        unitPrice: 250000000,
        totalAmount: 5125000000
      },
      {
        month: 'Nov',
        netProcurement: 15,
        unitPrice: 250000000,
        totalAmount: 5625000000
      },
      {
        month: 'Dec',
        netProcurement: 15,
        unitPrice: 250000000,
        totalAmount: 5875000000
      },
      
    ]
  },
  'Chemical filter': {
    totalQuantity: 320,
    unitPrice: 100000000,
    totalAmount: 32000000000,
    monthlyData: [
      {
        month: 'Jan',
        netProcurement: 22,
        unitPrice: 100000000,
        totalAmount: 2200000000
      },
      {
        month: 'Feb',
        netProcurement: 23,
        unitPrice: 100000000,
        totalAmount: 2300000000
      },
      {
        month: 'Mar',
        netProcurement: 24,
        unitPrice: 100000000,
        totalAmount: 2400000000
      },
      {
        month: 'Apr',
        netProcurement: 25,
        unitPrice: 100000000,
        totalAmount: 2500000000
      },
      {
        month: 'May',
        netProcurement: 26,
        unitPrice: 100000000,
        totalAmount: 2600000000
      },
      {
        month: 'Jun',
        netProcurement: 27,
        unitPrice: 100000000,
        totalAmount: 2700000000
      },
      {
        month: 'Jul',
        netProcurement: 28,
        unitPrice: 100000000,
        totalAmount: 2800000000
      },
      {
        month: 'Aug',
        netProcurement: 29,
        unitPrice: 100000000,
        totalAmount: 2900000000
      },
      {
        month: 'Sep',
        netProcurement: 27,
        unitPrice: 100000000,
        totalAmount: 2700000000
      },
      {
        month: 'Oct',
        netProcurement: 28,
        unitPrice: 100000000,
        totalAmount: 2800000000
      },
      {
        month: 'Nov',
        netProcurement: 30,
        unitPrice: 100000000,
        totalAmount: 3000000000
      },
      {
        month: 'Dec',
        netProcurement: 31,
        unitPrice: 100000000,
        totalAmount: 3100000000
      },

    ]
  },
  'Special filter': {
    totalQuantity: 156,
    unitPrice: 450000000,
    totalAmount: 70200000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 12, unitPrice: 450000000, totalAmount: 5400000000 },
      { month: 'Feb', netProcurement: 11, unitPrice: 450000000, totalAmount: 4950000000 },
      { month: 'Mar', netProcurement: 14, unitPrice: 450000000, totalAmount: 6300000000 },
      { month: 'Apr', netProcurement: 13, unitPrice: 450000000, totalAmount: 5850000000 },
      { month: 'May', netProcurement: 15, unitPrice: 450000000, totalAmount: 6750000000 },
      { month: 'Jun', netProcurement: 12, unitPrice: 450000000, totalAmount: 5400000000 },
      { month: 'Jul', netProcurement: 13, unitPrice: 450000000, totalAmount: 5850000000 },
      { month: 'Aug', netProcurement: 14, unitPrice: 450000000, totalAmount: 6300000000 },
      { month: 'Sep', netProcurement: 11, unitPrice: 450000000, totalAmount: 4950000000 },
      { month: 'Oct', netProcurement: 13, unitPrice: 450000000, totalAmount: 5850000000 },
      { month: 'Nov', netProcurement: 14, unitPrice: 450000000, totalAmount: 6300000000 },
      { month: 'Dec', netProcurement: 14, unitPrice: 450000000, totalAmount: 6300000000 }
    ]
  },
  'Multi function filter': {
    totalQuantity: 218,
    unitPrice: 520000000,
    totalAmount: 113360000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 17, unitPrice: 520000000, totalAmount: 8840000000 },
      { month: 'Feb', netProcurement: 16, unitPrice: 520000000, totalAmount: 8320000000 },
      { month: 'Mar', netProcurement: 19, unitPrice: 520000000, totalAmount: 9880000000 },
      { month: 'Apr', netProcurement: 18, unitPrice: 520000000, totalAmount: 9360000000 },
      { month: 'May', netProcurement: 20, unitPrice: 520000000, totalAmount: 10400000000 },
      { month: 'Jun', netProcurement: 17, unitPrice: 520000000, totalAmount: 8840000000 },
      { month: 'Jul', netProcurement: 19, unitPrice: 520000000, totalAmount: 9880000000 },
      { month: 'Aug', netProcurement: 18, unitPrice: 520000000, totalAmount: 9360000000 },
      { month: 'Sep', netProcurement: 17, unitPrice: 520000000, totalAmount: 8840000000 },
      { month: 'Oct', netProcurement: 19, unitPrice: 520000000, totalAmount: 9880000000 },
      { month: 'Nov', netProcurement: 19, unitPrice: 520000000, totalAmount: 9880000000 },
      { month: 'Dec', netProcurement: 19, unitPrice: 520000000, totalAmount: 9880000000 }
    ]
  },
  'Water filter': {
    totalQuantity: 342,
    unitPrice: 380000000,
    totalAmount: 129960000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 26, unitPrice: 380000000, totalAmount: 9880000000 },
      { month: 'Feb', netProcurement: 27, unitPrice: 380000000, totalAmount: 10260000000 },
      { month: 'Mar', netProcurement: 29, unitPrice: 380000000, totalAmount: 11020000000 },
      { month: 'Apr', netProcurement: 28, unitPrice: 380000000, totalAmount: 10640000000 },
      { month: 'May', netProcurement: 30, unitPrice: 380000000, totalAmount: 11400000000 },
      { month: 'Jun', netProcurement: 28, unitPrice: 380000000, totalAmount: 10640000000 },
      { month: 'Jul', netProcurement: 29, unitPrice: 380000000, totalAmount: 11020000000 },
      { month: 'Aug', netProcurement: 30, unitPrice: 380000000, totalAmount: 11400000000 },
      { month: 'Sep', netProcurement: 27, unitPrice: 380000000, totalAmount: 10260000000 },
      { month: 'Oct', netProcurement: 29, unitPrice: 380000000, totalAmount: 11020000000 },
      { month: 'Nov', netProcurement: 30, unitPrice: 380000000, totalAmount: 11400000000 },
      { month: 'Dec', netProcurement: 29, unitPrice: 380000000, totalAmount: 11020000000 }
    ]
  },
  'Bottom Ash Removal Systems': {
    totalQuantity: 5,
    unitPrice: 740000000,
    totalAmount: 3700000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Feb', netProcurement: 1, unitPrice: 740000000, totalAmount: 740000000 },
      { month: 'Mar', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Apr', netProcurement: 1, unitPrice: 740000000, totalAmount: 740000000 },
      { month: 'May', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Jun', netProcurement: 1, unitPrice: 740000000, totalAmount: 740000000 },
      { month: 'Jul', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Aug', netProcurement: 1, unitPrice: 740000000, totalAmount: 740000000 },
      { month: 'Sep', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Oct', netProcurement: 1, unitPrice: 740000000, totalAmount: 740000000 },
      { month: 'Nov', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Dec', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 }
    ]
  },
  'Fly Ash Handling Equipment': {
    totalQuantity: 7,
    unitPrice: 600000000,
    totalAmount: 4200000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Feb', netProcurement: 0, unitPrice: 600000000, totalAmount: 0 },
      { month: 'Mar', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Apr', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'May', netProcurement: 0, unitPrice: 600000000, totalAmount: 0 },
      { month: 'Jun', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Jul', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Aug', netProcurement: 0, unitPrice: 600000000, totalAmount: 0 },
      { month: 'Sep', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Oct', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Nov', netProcurement: 0, unitPrice: 600000000, totalAmount: 0 },
      { month: 'Dec', netProcurement: 0, unitPrice: 600000000, totalAmount: 0 }
    ]
  },
  'Ash Conveyors': {
    totalQuantity: 21,
    unitPrice: 100000000,
    totalAmount: 2100000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Feb', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Mar', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Apr', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'May', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Jun', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Jul', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Aug', netProcurement: 1, unitPrice: 100000000, totalAmount: 100000000 },
      { month: 'Sep', netProcurement: 1, unitPrice: 100000000, totalAmount: 100000000 },
      { month: 'Oct', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Nov', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Dec', netProcurement: 1, unitPrice: 100000000, totalAmount: 100000000 }
    ]
  },
  'Ash Silos': {
    totalQuantity: 9,
    unitPrice: 200000000,
    totalAmount: 1800000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Feb', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Mar', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Apr', netProcurement: 0, unitPrice: 200000000, totalAmount: 0 },
      { month: 'May', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Jun', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Jul', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Aug', netProcurement: 0, unitPrice: 200000000, totalAmount: 0 },
      { month: 'Sep', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Oct', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Nov', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Dec', netProcurement: 0, unitPrice: 200000000, totalAmount: 0 }
    ]
  },
  'Turbine Oil': {
    totalQuantity: 37000,
    unitPrice: 140,
    totalAmount: 5200000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 3000, unitPrice: 140, totalAmount: 420000000 },
      { month: 'Feb', netProcurement: 3100, unitPrice: 140, totalAmount: 434000000 },
      { month: 'Mar', netProcurement: 3200, unitPrice: 140, totalAmount: 448000000 },
      { month: 'Apr', netProcurement: 3000, unitPrice: 140, totalAmount: 420000000 },
      { month: 'May', netProcurement: 3100, unitPrice: 140, totalAmount: 434000000 },
      { month: 'Jun', netProcurement: 3200, unitPrice: 140, totalAmount: 448000000 },
      { month: 'Jul', netProcurement: 3000, unitPrice: 140, totalAmount: 420000000 },
      { month: 'Aug', netProcurement: 3100, unitPrice: 140, totalAmount: 434000000 },
      { month: 'Sep', netProcurement: 3000, unitPrice: 140, totalAmount: 420000000 },
      { month: 'Oct', netProcurement: 3200, unitPrice: 140, totalAmount: 448000000 },
      { month: 'Nov', netProcurement: 3000, unitPrice: 140, totalAmount: 420000000 },
      { month: 'Dec', netProcurement: 3100, unitPrice: 140, totalAmount: 434000000 }
    ]
  },
  'Hydraulic Oil': {
    totalQuantity: 21500,
    unitPrice: 176,
    totalAmount: 3800000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 1800, unitPrice: 176, totalAmount: 316800000 },
      { month: 'Feb', netProcurement: 1900, unitPrice: 176, totalAmount: 334400000 },
      { month: 'Mar', netProcurement: 1700, unitPrice: 176, totalAmount: 299200000 },
      { month: 'Apr', netProcurement: 1800, unitPrice: 176, totalAmount: 316800000 },
      { month: 'May', netProcurement: 1900, unitPrice: 176, totalAmount: 334400000 },
      { month: 'Jun', netProcurement: 1700, unitPrice: 176, totalAmount: 299200000 },
      { month: 'Jul', netProcurement: 1800, unitPrice: 176, totalAmount: 316800000 },
      { month: 'Aug', netProcurement: 1900, unitPrice: 176, totalAmount: 334400000 },
      { month: 'Sep', netProcurement: 1700, unitPrice: 176, totalAmount: 299200000 },
      { month: 'Oct', netProcurement: 1800, unitPrice: 176, totalAmount: 316800000 },
      { month: 'Nov', netProcurement: 1900, unitPrice: 176, totalAmount: 334400000 },
      { month: 'Dec', netProcurement: 1600, unitPrice: 176, totalAmount: 281600000 }
    ]
  },
  'Gear Oil': {
    totalQuantity: 16000,
    unitPrice: 181,
    totalAmount: 2900000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 1300, unitPrice: 181, totalAmount: 235300000 },
      { month: 'Feb', netProcurement: 1400, unitPrice: 181, totalAmount: 253400000 },
      { month: 'Mar', netProcurement: 1300, unitPrice: 181, totalAmount: 235300000 },
      { month: 'Apr', netProcurement: 1400, unitPrice: 181, totalAmount: 253400000 },
      { month: 'May', netProcurement: 1300, unitPrice: 181, totalAmount: 235300000 },
      { month: 'Jun', netProcurement: 1400, unitPrice: 181, totalAmount: 253400000 },
      { month: 'Jul', netProcurement: 1300, unitPrice: 181, totalAmount: 235300000 },
      { month: 'Aug', netProcurement: 1400, unitPrice: 181, totalAmount: 253400000 },
      { month: 'Sep', netProcurement: 1300, unitPrice: 181, totalAmount: 235300000 },
      { month: 'Oct', netProcurement: 1400, unitPrice: 181, totalAmount: 253400000 },
      { month: 'Nov', netProcurement: 1300, unitPrice: 181, totalAmount: 235300000 },
      { month: 'Dec', netProcurement: 1200, unitPrice: 181, totalAmount: 217200000 }
    ]
  },
  'Circuit Breakers': {
    totalQuantity: 140,
    unitPrice: 46400000,
    totalAmount: 6500000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 12, unitPrice: 46400000, totalAmount: 556800000 },
      { month: 'Feb', netProcurement: 11, unitPrice: 46400000, totalAmount: 510400000 },
      { month: 'Mar', netProcurement: 12, unitPrice: 46400000, totalAmount: 556800000 },
      { month: 'Apr', netProcurement: 12, unitPrice: 46400000, totalAmount: 556800000 },
      { month: 'May', netProcurement: 11, unitPrice: 46400000, totalAmount: 510400000 },
      { month: 'Jun', netProcurement: 12, unitPrice: 46400000, totalAmount: 556800000 },
      { month: 'Jul', netProcurement: 12, unitPrice: 46400000, totalAmount: 556800000 },
      { month: 'Aug', netProcurement: 11, unitPrice: 46400000, totalAmount: 510400000 },
      { month: 'Sep', netProcurement: 12, unitPrice: 46400000, totalAmount: 556800000 },
      { month: 'Oct', netProcurement: 12, unitPrice: 46400000, totalAmount: 556800000 },
      { month: 'Nov', netProcurement: 11, unitPrice: 46400000, totalAmount: 510400000 },
      { month: 'Dec', netProcurement: 12, unitPrice: 46400000, totalAmount: 556800000 }
    ]
  },
  'Transformers': {
    totalQuantity: 30,
    unitPrice: 273300000,
    totalAmount: 8200000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 3, unitPrice: 273300000, totalAmount: 819900000 },
      { month: 'Feb', netProcurement: 2, unitPrice: 273300000, totalAmount: 546600000 },
      { month: 'Mar', netProcurement: 3, unitPrice: 273300000, totalAmount: 819900000 },
      { month: 'Apr', netProcurement: 2, unitPrice: 273300000, totalAmount: 546600000 },
      { month: 'May', netProcurement: 3, unitPrice: 273300000, totalAmount: 819900000 },
      { month: 'Jun', netProcurement: 2, unitPrice: 273300000, totalAmount: 546600000 },
      { month: 'Jul', netProcurement: 3, unitPrice: 273300000, totalAmount: 819900000 },
      { month: 'Aug', netProcurement: 2, unitPrice: 273300000, totalAmount: 546600000 },
      { month: 'Sep', netProcurement: 3, unitPrice: 273300000, totalAmount: 819900000 },
      { month: 'Oct', netProcurement: 2, unitPrice: 273300000, totalAmount: 546600000 },
      { month: 'Nov', netProcurement: 3, unitPrice: 273300000, totalAmount: 819900000 },
      { month: 'Dec', netProcurement: 2, unitPrice: 273300000, totalAmount: 546600000 }
    ]
  },
  'Power Cables': {
    totalQuantity: 43500,
    unitPrice: 94,
    totalAmount: 4100000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 3600, unitPrice: 94, totalAmount: 338400000 },
      { month: 'Feb', netProcurement: 3700, unitPrice: 94, totalAmount: 347800000 },
      { month: 'Mar', netProcurement: 3600, unitPrice: 94, totalAmount: 338400000 },
      { month: 'Apr', netProcurement: 3700, unitPrice: 94, totalAmount: 347800000 },
      { month: 'May', netProcurement: 3600, unitPrice: 94, totalAmount: 338400000 },
      { month: 'Jun', netProcurement: 3700, unitPrice: 94, totalAmount: 347800000 },
      { month: 'Jul', netProcurement: 3600, unitPrice: 94, totalAmount: 338400000 },
      { month: 'Aug', netProcurement: 3700, unitPrice: 94, totalAmount: 347800000 },
      { month: 'Sep', netProcurement: 3500, unitPrice: 94, totalAmount: 329000000 },
      { month: 'Oct', netProcurement: 3700, unitPrice: 94, totalAmount: 347800000 },
      { month: 'Nov', netProcurement: 3600, unitPrice: 94, totalAmount: 338400000 },
      { month: 'Dec', netProcurement: 3400, unitPrice: 94, totalAmount: 319600000 }
    ]
  },
}), []);

  // Unit multiplier: if "All Units" selected, aggregate data across units
  const unitMultiplier = selectedUnit === '' ? 35 : 1; // 35 units for "All Units"
  const selectedUnitName = selectedUnit ? plnUnitsData.find(u => u.id === selectedUnit)?.name : 'All Units';

  const currentMaterialData = useMemo(() => {
    const baseData = materialProcurementData[selectedMaterial];
    return {
      totalQuantity: baseData.totalQuantity * unitMultiplier,
      unitPrice: baseData.unitPrice,
      totalAmount: baseData.totalAmount * unitMultiplier,
      monthlyData: baseData.monthlyData.map(month => ({
        ...month,
        netProcurement: month.netProcurement * unitMultiplier,
        totalAmount: month.totalAmount * unitMultiplier
      }))
    };
  }, [selectedMaterial, unitMultiplier]);

  const allMaterialsSummary = useMemo(() =>
    allMaterialsList.map(material => ({
      name: material,
      quantity: materialProcurementData[material].totalQuantity * unitMultiplier,
      amount: materialProcurementData[material].totalAmount * unitMultiplier
    }))
  , [allMaterialsList, unitMultiplier]);

  const totalProcurementAmount = useMemo(() =>
    allMaterialsSummary.reduce((sum, item) => sum + item.amount, 0)
  , [allMaterialsSummary]);

  const chartData = currentMaterialData.monthlyData.map(item => ({
    month: item.month,
    Quantity: item.netProcurement,
    'Amount (M IDR)': item.totalAmount / 1000000
  }));

  const materialToCategory: Record<string, string> = {
    'Filter air': 'Filters',
    'Filter Udara Cartridge': 'Filters',
    'Oil Filter': 'Filters',
    'Filter Gas': 'Filters',
    'Filter Udara Kassa': 'Filters',
    'Bottom Ash Removal Systems': 'Ash Handling Systems',
    'Fly Ash Handling Equipment': 'Ash Handling Systems',
    'Ash Conveyors': 'Ash Handling Systems',
    'Ash Silos': 'Ash Handling Systems',
    'Turbine Oil': 'Lubricants & Fluids',
    'Hydraulic Oil': 'Lubricants & Fluids',
    'Gear Oil': 'Lubricants & Fluids',
    'Circuit Breakers': 'Electrical Components',
    'Transformers': 'Electrical Components',
    'Power Cables': 'Electrical Components'
  };

  const categoryBudgetData = useMemo(() => {
    const categoryMap: Record<string, number> = {};

    allMaterialsSummary.forEach(material => {
      const category = materialToCategory[material.name] || 'Others';
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += material.amount;
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [allMaterialsSummary]);

  const pieData = categoryBudgetData;

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleExportProcurement = () => {
    const csvContent = [
      ['Month', 'Net Procurement (Qty)', 'Unit Price (IDR)', 'Total Amount (IDR)'].join(','),
      ...currentMaterialData.monthlyData.map(row =>
        [row.month, row.netProcurement, row.unitPrice, row.totalAmount].join(',')
      ),
      ['Annual Total', currentMaterialData.totalQuantity, '', currentMaterialData.totalAmount].join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `final_procurement_${selectedMaterial}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportAllMaterials = () => {
    const csvContent = [
      ['Material', 'Total Quantity', 'Unit Price (IDR)', 'Total Amount (IDR)'].join(','),
      ...allMaterialsSummary.map(item => {
        const material = materialProcurementData[item.name];
        return [item.name, material.totalQuantity, material.unitPrice, material.totalAmount].join(',');
      }),
      ['Grand Total', allMaterialsSummary.reduce((sum, item) => sum + item.quantity, 0), '', totalProcurementAmount].join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `all_materials_procurement_summary_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Amount') ? formatCurrency(entry.value * 1000000) : entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Final Procurement Table (Stage 5)
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Complete procurement requirements with detailed pricing information, ready for DRP conversion and execution. This is the final output of the DPK process.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="p-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg flex flex-col justify-center min-h-[200px]">
          <p className="text-sm text-white/80 uppercase mb-3 tracking-wider">Total Annual Budget</p>
          <p className="text-4xl font-extrabold text-white mb-2">
            {formatBudgetDisplay(annualBudgetMockData.totalBudget)}
          </p>
          <p className="text-base text-white/90 mt-2">
            {formatUnits(annualBudgetMockData.totalUnits)}
          </p>
        </div>
      </div>

      {/* <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Monthly Procurement Trend - {selectedMaterial}
          </h3>
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                chartType === 'bar'
                  ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                chartType === 'line'
                  ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Line
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          {chartType === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#10B981" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar yAxisId="left" dataKey="Quantity" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="Amount (M IDR)" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#10B981" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line yAxisId="left" type="monotone" dataKey="Quantity" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="Amount (M IDR)" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div> */}

      <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              How to View Final Procurement Tables
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Click the "See Full Forecast Table" button in the "Procurement Table" column to expand and view the detailed monthly procurement schedule for each material. The table shows:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Monthly procurement quantities and amounts</li>
              <li>Unit pricing information</li>
              <li>Annual totals and averages</li>
              <li>Export functionality for each material</li>
            </ul>
          </div>
        </div>
      </div>

      <RetrieveProcurementRequestTable />
    </div>
  );
};

export default DPKFinalProcurement;
