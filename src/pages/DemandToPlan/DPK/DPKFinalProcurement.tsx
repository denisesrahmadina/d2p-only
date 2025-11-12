import React, { useState, useMemo } from 'react';
import { FileText, Download, CheckCircle2, DollarSign, TrendingUp, Package, Calendar, Factory, Filter } from 'lucide-react';
import plnUnitsData from '../../../data/plnUnits.json';
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
  const [selectedMaterial, setSelectedMaterial] = useState<string>('Filter air');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const categories = ['All Categories', 'Filters', 'Fuel & Combustion', 'Lubricants & Fluids', 'Mechanical Parts', 'Electrical Components', 'Safety & Environment', 'Maintenance Supplies'];
  const materials = ['Filter air', 'Filter Udara Cartridge', 'Oil Filter', 'Filter Gas', 'Filter Udara Kassa'];

  const materialProcurementData: MaterialProcurementData = useMemo(() => ({
  'Filter air': {
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
  'Filter Udara Cartridge': {
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
  'Oil Filter': {
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
  'Filter Gas': {
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
  'Filter Udara Kassa': {
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
    materials.map(material => ({
      name: material,
      quantity: materialProcurementData[material].totalQuantity * unitMultiplier,
      amount: materialProcurementData[material].totalAmount * unitMultiplier
    }))
  , [materials, unitMultiplier]);

  const totalProcurementAmount = useMemo(() =>
    allMaterialsSummary.reduce((sum, item) => sum + item.amount, 0)
  , [allMaterialsSummary]);

  const chartData = currentMaterialData.monthlyData.map(item => ({
    month: item.month,
    Quantity: item.netProcurement,
    'Amount (M IDR)': item.totalAmount / 1000000
  }));

  const pieData = allMaterialsSummary.map(item => ({
    name: item.name,
    value: item.amount
  }));

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg flex flex-col justify-center">
            <p className="text-sm text-white/80 uppercase mb-2">Total Annual Budget</p>
            <p className="text-3xl font-extrabold text-white">
              {formatCurrency(totalProcurementAmount)}
            </p>
            <p className="text-sm text-white/80 mt-2">
              {allMaterialsSummary.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()} total units
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Budget Distribution by Material</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

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
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">All Units (35 Units)</option>
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
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
            onChange={(e) => setSelectedMaterial(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {materials.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
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

      <RetrieveProcurementRequestTable />

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border-2 border-emerald-300 dark:border-emerald-700 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Final Procurement Table - {selectedMaterial}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete procurement schedule with pricing
              </p>
            </div>
          </div>
          <button
            onClick={handleExportProcurement}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center space-x-2 font-semibold shadow-lg"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl border-2 border-emerald-300 dark:border-emerald-700 shadow-lg">
          <table className="w-full">
            <thead className="bg-emerald-100 dark:bg-emerald-900/40 border-b-2 border-emerald-300 dark:border-emerald-700">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase">Month</th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Net Procurement</th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Unit Price</th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {currentMaterialData.monthlyData.map((row, index) => (
                <tr key={index} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white">{row.month}</td>
                  <td className="px-4 py-4 text-sm text-right font-bold text-blue-700 dark:text-blue-400">{row.netProcurement.toLocaleString()} units</td>
                  <td className="px-4 py-4 text-sm text-right text-gray-600 dark:text-gray-400">{formatCurrency(row.unitPrice)}</td>
                  <td className="px-4 py-4 text-sm text-right font-bold text-emerald-700 dark:text-emerald-400 text-lg">{formatCurrency(row.totalAmount)}</td>
                </tr>
              ))}
              <tr className="bg-emerald-100 dark:bg-emerald-900/40 font-bold border-t-2 border-emerald-300 dark:border-emerald-700">
                <td className="px-4 py-5 text-base text-gray-900 dark:text-white uppercase">Annual Total</td>
                <td className="px-4 py-5 text-base text-right text-blue-700 dark:text-blue-300">{currentMaterialData.totalQuantity.toLocaleString()} units</td>
                <td className="px-4 py-5 text-sm text-right text-gray-600 dark:text-gray-400">Avg: {formatCurrency(currentMaterialData.unitPrice)}</td>
                <td className="px-4 py-5 text-base text-right text-emerald-700 dark:text-emerald-300 text-xl font-extrabold">{formatCurrency(currentMaterialData.totalAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-semibold text-gray-900 dark:text-white uppercase">Procurement Period</p>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              12 months (January - December)
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-semibold text-gray-900 dark:text-white uppercase">Average Monthly</p>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {Math.round(currentMaterialData.totalQuantity / 12).toLocaleString()} units / {formatCurrency(Math.round(currentMaterialData.totalAmount / 12))}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-semibold text-gray-900 dark:text-white uppercase">Budget Utilization</p>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {((currentMaterialData.totalAmount / totalProcurementAmount) * 100).toFixed(1)}% of total budget
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Procurement Requirements Finalized</p>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                This final procurement table includes complete quantity and pricing information after demand netting. Ready for DRP (Daftar Rencana Pengadaan) conversion and submission for approval. All figures have been validated against budget constraints and inventory optimization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DPKFinalProcurement;
