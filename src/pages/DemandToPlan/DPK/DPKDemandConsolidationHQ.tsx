import React, { useState, useMemo } from 'react';
import {
  Download,
  Save,
  X,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Edit3,
  Package,
  GitMerge,
  ChevronDown,
  ChevronUp,
  Send
} from 'lucide-react';
import plnUnitsData from '../../../data/plnUnits.json';

interface ForecastData {
  id: string;
  unitId: string;
  unitName: string;
  material: string;
  month: string;
  monthNumber: number;
  userForecast: number;
  aiForecast: number;
  finalUnitForecast: number;
  selectedSource: 'ai' | 'user' | 'final' | 'custom';
  customValue: number;
  unitPrice: number;
  status: 'pending' | 'adjusted' | 'approved';
}

const categoryMaterialsMap: { [key: string]: string[] } = {
  'Filter': [
    'Air Filter',
    'Fuel Filter',
    'Chemical filter',
    'Oil filter',
    'Special filter',
    'Multi function filter',
    'Water filter',
    'Gas filter'
  ],
  'Fuel and Combustion': [],
  'Mechanical Equipment': [],
  'Spare Part and Maintenance': [],
  'Water Treatment System': []
};

const materials = [
  'Air Filter',
  'Fuel Filter',
  'Chemical filter',
  'Oil filter',
  'Special filter',
  'Multi function filter',
  'Water filter',
  'Gas filter'
];

const materialCategories: { [key: string]: string } = {
  'Air Filter': 'Filter',
  'Fuel Filter': 'Filter',
  'Chemical filter': 'Filter',
  'Oil filter': 'Filter',
  'Special filter': 'Filter',
  'Multi function filter': 'Filter',
  'Water filter': 'Filter',
  'Gas filter': 'Filter'
};

const materialPrices: { [key: string]: number } = {
  'Coal': 850000,
  'Gas Turbine Parts': 2500000,
  'Boiler Components': 1800000,
  'Generator Parts': 3200000,
  'Electrical Equipment': 1500000,
  'Lubricants': 450000,
  'Chemicals': 780000,
  'Spare Parts': 1200000
};

function generateMockData(): ForecastData[] {
  const data: ForecastData[] = [];
  const units = plnUnitsData.slice(0, 15);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const allMaterials = materials;

  units.forEach(unit => {
    allMaterials.forEach(material => {
      months.forEach((month, monthIndex) => {
        const baseValue = Math.floor(Math.random() * 1000) + 500;
        const userForecast = baseValue;
        const aiForecast = baseValue + Math.floor(Math.random() * 100) - 50;

        const shouldHaveHighDeviation = Math.random() < 0.15;
        let finalUnitForecast;

        if (shouldHaveHighDeviation) {
          const deviationDirection = Math.random() < 0.5 ? 1 : -1;
          const deviationPercent = 0.25 + (Math.random() * 0.20);
          finalUnitForecast = Math.round(aiForecast * (1 + (deviationDirection * deviationPercent)));
        } else {
          finalUnitForecast = baseValue + Math.floor(Math.random() * 80) - 40;
        }

        data.push({
          id: `${unit.id}-${material}-${monthIndex + 1}`,
          unitId: unit.id,
          unitName: unit.name,
          material,
          month,
          monthNumber: monthIndex + 1,
          userForecast,
          aiForecast,
          finalUnitForecast,
          selectedSource: 'ai',
          customValue: aiForecast,
          unitPrice: materialPrices[material] || 1000000,
          status: 'pending'
        });
      });
    });
  });

  return data;
}

interface DPKDemandConsolidationHQProps {
  onSuccess?: () => void;
}

const DPKDemandConsolidationHQ: React.FC<DPKDemandConsolidationHQProps> = ({ onSuccess }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Filter');
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [forecastData, setForecastData] = useState<ForecastData[]>(() => generateMockData());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [customValues, setCustomValues] = useState<{ [key: string]: string }>({});
  const [sortColumn, setSortColumn] = useState<keyof ForecastData>('month');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const rowsPerPage = 20;

  function getSelectedValue(item: ForecastData): number {
    switch (item.selectedSource) {
      case 'ai': return item.aiForecast;
      case 'user': return item.userForecast;
      case 'final': return item.finalUnitForecast;
      case 'custom': return item.customValue;
      default: return item.aiForecast;
    }
  }

  const availableMaterials = useMemo(() => {
    const categoryMaterials = categoryMaterialsMap[selectedCategory] || [];
    if (categoryMaterials.length === 0) {
      return ['No filter material'];
    }
    return ['All Material', ...categoryMaterials];
  }, [selectedCategory]);

  const filteredData = useMemo(() => {
    let filtered = forecastData;

    if (selectedCategory) {
      const categoryMaterials = categoryMaterialsMap[selectedCategory] || [];
      if (categoryMaterials.length > 0) {
        filtered = filtered.filter(item => categoryMaterials.includes(item.material));
      } else {
        filtered = [];
      }
    }

    if (selectedUnit) {
      filtered = filtered.filter(item => item.unitId === selectedUnit);
    }

    if (selectedMaterial && selectedMaterial !== 'All Material' && selectedMaterial !== 'No filter material') {
      filtered = filtered.filter(item => item.material === selectedMaterial);
    }

    return filtered;
  }, [forecastData, selectedCategory, selectedUnit, selectedMaterial]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      // Special handling for month sorting - use monthNumber for chronological order
      if (sortColumn === 'month') {
        aVal = a.monthNumber;
        bVal = b.monthNumber;
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const stats = useMemo(() => {
    const total = filteredData.reduce((sum, item) => sum + getSelectedValue(item), 0);
    const totalValue = filteredData.reduce((sum, item) => sum + (getSelectedValue(item) * item.unitPrice), 0);
    const adjustedCount = filteredData.filter(item => item.status === 'adjusted').length;
    const pendingCount = filteredData.filter(item => item.status === 'pending').length;

    return { total, totalValue, adjustedCount, pendingCount };
  }, [filteredData]);

  const finalSummary = useMemo(() => {
    const monthlyGroups: { [key: string]: { month: string; monthNumber: number; items: any[] } } = {};

    filteredData.forEach(item => {
      if (!monthlyGroups[item.month]) {
        monthlyGroups[item.month] = {
          month: item.month,
          monthNumber: item.monthNumber,
          items: []
        };
      }
      monthlyGroups[item.month].items.push(item);
    });

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return months.map((month, index) => {
      const group = monthlyGroups[month];
      if (!group || group.items.length === 0) {
        return {
          id: `summary-${index + 1}`,
          month,
          monthNumber: index + 1,
          selectedSource: 'ai',
          selectedValue: 0,
          unitPrice: 850000,
          totalAmount: 0
        };
      }

      const totalQuantity = group.items.reduce((sum, item) => sum + getSelectedValue(item), 0);
      const avgUnitPrice = group.items.reduce((sum, item) => sum + item.unitPrice, 0) / group.items.length;
      const totalAmount = group.items.reduce((sum, item) => sum + (getSelectedValue(item) * item.unitPrice), 0);

      const aiCount = group.items.filter(item => item.selectedSource === 'ai').length;
      const userCount = group.items.filter(item => item.selectedSource === 'user').length;
      const finalCount = group.items.filter(item => item.selectedSource === 'final').length;
      const customCount = group.items.filter(item => item.selectedSource === 'custom').length;

      const dominantSource =
        aiCount >= userCount && aiCount >= finalCount && aiCount >= customCount ? 'ai' :
        userCount >= finalCount && userCount >= customCount ? 'user' :
        finalCount >= customCount ? 'final' : 'custom';

      return {
        id: `summary-${index + 1}`,
        month,
        monthNumber: index + 1,
        selectedSource: dominantSource,
        selectedValue: totalQuantity,
        unitPrice: avgUnitPrice,
        totalAmount: totalAmount
      };
    });
  }, [filteredData]);

  const handleSort = (column: keyof ForecastData) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSourceChange = (id: string, source: 'ai' | 'user' | 'final' | 'custom') => {
    setForecastData(prev => prev.map(item => {
      if (item.id === id) {
        let customValue = item.customValue;
        if (source !== 'custom') {
          customValue = source === 'ai' ? item.aiForecast :
                       source === 'user' ? item.userForecast :
                       item.finalUnitForecast;
        }
        return { ...item, selectedSource: source, customValue, status: 'adjusted' };
      }
      return item;
    }));

    if (source === 'custom') {
      setEditingRow(id);
    } else {
      setEditingRow(null);
    }
  };

  const handleCustomValueChange = (id: string, value: string) => {
    setCustomValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveCustomValue = (id: string) => {
    const value = parseFloat(customValues[id] || '0');
    if (isNaN(value) || value < 0) {
      alert('Please enter a valid positive number');
      return;
    }

    setForecastData(prev => prev.map(item =>
      item.id === id ? { ...item, customValue: value, status: 'adjusted' } : item
    ));
    setEditingRow(null);
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(item => item.id)));
    }
  };

  const handleBulkAdjustment = (source: 'ai' | 'user' | 'final') => {
    if (selectedRows.size === 0) {
      alert('Please select rows to adjust');
      return;
    }

    setForecastData(prev => prev.map(item => {
      if (selectedRows.has(item.id)) {
        const customValue = source === 'ai' ? item.aiForecast :
                          source === 'user' ? item.userForecast :
                          item.finalUnitForecast;
        return { ...item, selectedSource: source, customValue, status: 'adjusted' };
      }
      return item;
    }));

    setSelectedRows(new Set());
  };

  const handleConfirmSend = () => {
    setShowConfirmation(true);
  };

  const handleSendToEBudget = () => {
    setForecastData(prev => prev.map(item =>
      item.status === 'adjusted' ? { ...item, status: 'approved' } : item
    ));
    setShowConfirmation(false);
    setShowSuccessModal(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Unit', 'Material', 'AI Forecast', 'User Forecast', 'Final Unit Forecast', 'Selected Source', 'Selected Value', 'Unit Price', 'Total Amount', 'Status'].join(','),
      ...filteredData.map(row => [
        row.unitName,
        row.material,
        row.aiForecast,
        row.userForecast,
        row.finalUnitForecast,
        row.selectedSource.toUpperCase(),
        getSelectedValue(row),
        row.unitPrice,
        getSelectedValue(row) * row.unitPrice,
        row.status.toUpperCase()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `hq_demand_consolidation_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const SortIcon = ({ column }: { column: keyof ForecastData }) => {
    if (sortColumn !== column) return <ChevronDown className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />;
    return sortDirection === 'asc' ?
      <ChevronUp className="h-4 w-4 text-accenture-purple" /> :
      <ChevronDown className="h-4 w-4 text-accenture-purple" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accenture-purple/10 to-accenture-azure/10 dark:from-accenture-purple/20 dark:to-accenture-azure/20 rounded-xl p-6 border border-accenture-purple/20 dark:border-accenture-purple/30">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accenture-purple to-accenture-azure rounded-xl flex items-center justify-center flex-shrink-0">
              <GitMerge className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Headquarters Demand Consolidation
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Central management of all unit forecasts across {plnUnitsData.length} PLN IP Units. Search, filter, and adjust forecasts with AI, User, and Final Unit recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

    {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Unit
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accenture-purple focus:border-transparent"
            >
              <option value="">All Units (35 Units)</option>
              {plnUnitsData.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedMaterial('All Material');
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accenture-purple focus:border-transparent"
            >
              <option value="Filter">Filter</option>
              <option value="Fuel and Combustion">Fuel and Combustion</option>
              <option value="Mechanical Equipment">Mechanical Equipment</option>
              <option value="Spare Part and Maintenance">Spare Part and Maintenance</option>
              <option value="Water Treatment System">Water Treatment System</option>
            </select>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Material
            </label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              disabled={availableMaterials[0] === 'No filter material'}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accenture-purple focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {availableMaterials.map(material => (
                <option key={material} value={material}>{material}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2 flex items-end space-x-3">
            <button
              onClick={handleExport}
              className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2 font-semibold"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Total Quantity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Total Value</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Status</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {stats.adjustedCount} Adjusted • {stats.pendingCount} Pending
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRows.size > 0 && (
        <div className="bg-accenture-purple/10 dark:bg-accenture-purple/20 border-2 border-accenture-purple rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="h-5 w-5 text-accenture-purple" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {selectedRows.size} row(s) selected
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">Apply bulk adjustment:</span>
              <button
                onClick={() => handleBulkAdjustment('ai')}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-sm font-semibold"
              >
                AI Forecast
              </button>
              <button
                onClick={() => handleBulkAdjustment('user')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-semibold"
              >
                User Forecast
              </button>
              <button
                onClick={() => handleBulkAdjustment('final')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-semibold"
              >
                Final Unit
              </button>
              <button
                onClick={() => setSelectedRows(new Set())}
                className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjustments Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-accenture-purple focus:ring-accenture-purple rounded"
                  />
                </th>
                <th
                  className="px-4 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  onClick={() => handleSort('unitName')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Unit</span>
                    <SortIcon column="unitName" />
                  </div>
                </th>
                <th
                  className="px-4 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  onClick={() => handleSort('material')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Material</span>
                    <SortIcon column="material" />
                  </div>
                </th>
                <th
                  className="px-4 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  onClick={() => handleSort('month')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Month</span>
                    <SortIcon column="month" />
                  </div>
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  <div className="flex items-center justify-end space-x-1">
                    <span>User Forecast</span>
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  <div className="flex items-center justify-end space-x-1">
                    <span>AI Forecast</span>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  </div>
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  <div className="flex items-center justify-end space-x-1">
                    <span>Final Unit Forecast</span>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase min-w-[400px]">
                  Adjustment Selection
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  Selected Value
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    selectedRows.has(row.id) ? 'bg-accenture-purple/5 dark:bg-accenture-purple/10' : ''
                  }`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      className="w-4 h-4 text-accenture-purple focus:ring-accenture-purple rounded"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{row.unitName}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{row.material}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{row.month}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                      {row.userForecast.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">
                      {row.aiForecast.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                      {row.finalUnitForecast.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`source-${row.id}`}
                          checked={row.selectedSource === 'ai'}
                          onChange={() => handleSourceChange(row.id, 'ai')}
                          className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-300">AI</span>
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`source-${row.id}`}
                          checked={row.selectedSource === 'user'}
                          onChange={() => handleSourceChange(row.id, 'user')}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-300">User</span>
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`source-${row.id}`}
                          checked={row.selectedSource === 'final'}
                          onChange={() => handleSourceChange(row.id, 'final')}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-300">Final</span>
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`source-${row.id}`}
                          checked={row.selectedSource === 'custom'}
                          onChange={() => handleSourceChange(row.id, 'custom')}
                          className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-300">Custom</span>
                      </label>
                      {row.selectedSource === 'custom' && (
                        <div className="flex items-center space-x-2">
                          {editingRow === row.id ? (
                            <>
                              <input
                                type="number"
                                value={customValues[row.id] || row.customValue}
                                onChange={(e) => handleCustomValueChange(row.id, e.target.value)}
                                className="w-24 px-2 py-1 text-xs border border-orange-300 dark:border-orange-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                                placeholder="Value"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveCustomValue(row.id)}
                                className="p-1 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
                                {row.customValue.toLocaleString()}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingRow(row.id);
                                  setCustomValues(prev => ({ ...prev, [row.id]: row.customValue.toString() }));
                                }}
                                className="p-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {getSelectedValue(row).toLocaleString()} units
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCurrency(getSelectedValue(row) * row.unitPrice)}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                      row.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                        : row.status === 'adjusted'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {row.status === 'approved' ? 'Approved' : row.status === 'adjusted' ? 'Adjusted' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-accenture-purple text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Final Summary Table */}
      {finalSummary.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-4 border-b-2 border-green-500">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <span>Final Forecast Summary</span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Review all forecasts before sending to E-Budget
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Month</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Source</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Quantity</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Unit Price</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {finalSummary.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.month}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        item.selectedSource === 'ai' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300' :
                        item.selectedSource === 'user' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' :
                        item.selectedSource === 'final' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300'
                      }`}>
                        {item.selectedSource.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {item.selectedValue.toLocaleString()} units
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(item.unitPrice)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(item.totalAmount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gradient-to-r from-accenture-purple/10 to-accenture-azure/10 dark:from-accenture-purple/20 dark:to-accenture-azure/20 border-t-2 border-accenture-purple">
                <tr>
                  <td colSpan={2} className="px-4 py-4 text-right">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">GRAND TOTAL:</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {finalSummary.reduce((sum, item) => sum + item.selectedValue, 0).toLocaleString()} units
                    </span>
                  </td>
                  <td></td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-xl font-bold text-accenture-purple dark:text-accenture-purple-light">
                      {formatCurrency(finalSummary.reduce((sum, item) => sum + item.totalAmount, 0))}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={handleConfirmSend}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all flex items-center space-x-3 font-bold text-lg shadow-lg transform hover:scale-105"
            >
              <Send className="h-6 w-6" />
              <span>Confirm & Send to E-Budget</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Confirm Submission
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to send the forecast to E-Budget? This action will submit the data for approval.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendToEBudget}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Successfully Sent!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Your consolidated forecast has been successfully sent to E-Budget application.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                Total value: {formatCurrency(finalSummary.reduce((sum, item) => sum + item.totalAmount, 0))}
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  // Go back to the parent flow's first tab via onSuccess callback
                  if (onSuccess) onSuccess();
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-accenture-purple to-accenture-azure hover:from-accenture-purple-dark hover:to-accenture-azure-dark text-white rounded-lg font-semibold transition-all shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DPKDemandConsolidationHQ;
