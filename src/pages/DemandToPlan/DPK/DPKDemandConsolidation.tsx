import React, { useState, useMemo } from 'react';
import { Upload, Download, FileText, TrendingUp, GitMerge, AlertCircle, CheckCircle2, X, Filter, Package, Send, Edit3, Save, Factory } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface MonthlyData {
  month: string;
  userForecast: number;
  erpForecast: number;
  variance: number;
  variancePercent: number;
  unitPrice: number;
  erpAmount: number;
  userAmount: number;
}

interface MaterialData {
  [material: string]: MonthlyData[];
}

interface DataSummary {
  total: number;
  average: number;
  max: number;
  min: number;
  variance: number;
}

type ForecastSource = 'erp' | 'user' | 'custom';

interface ForecastSelection {
  source: ForecastSource;
  value: number;
}

interface DPKDemandConsolidationProps {
  onSuccess?: () => void;
}

const DPKDemandConsolidation: React.FC<DPKDemandConsolidationProps> = ({ onSuccess }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasUserData, setHasUserData] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All Material');
  const [showFinalTable, setShowFinalTable] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSendingToBudget, setIsSendingToBudget] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [forecastSelections, setForecastSelections] = useState<{ [key: string]: ForecastSelection }>({
    'Jan': { source: 'erp', value: 0 },
    'Feb': { source: 'erp', value: 0 },
    'Mar': { source: 'erp', value: 0 },
    'Apr': { source: 'erp', value: 0 },
    'May': { source: 'erp', value: 0 },
    'Jun': { source: 'erp', value: 0 },
    'Jul': { source: 'erp', value: 0 },
    'Aug': { source: 'erp', value: 0 },
    'Sep': { source: 'erp', value: 0 },
    'Oct': { source: 'erp', value: 0 },
    'Nov': { source: 'erp', value: 0 },
    'Dec': { source: 'erp', value: 0 }
  });

  const [editingMonth, setEditingMonth] = useState<string | null>(null);
  const [customValues, setCustomValues] = useState<{ [key: string]: string }>({});

  const categories = [
    'All Categories',
    'Filter',
    'Ash Handling System',
    'Boiler and Pressure Vessel Equipment',
    'Civil Works and Construction Materials',
    'Consumables',
    'Electrical Equipment',
    'Emission Control Systems',
    'Engineering and Design Materials',
    'Fuel',
    'IT and Communication Systems',
    'Instrumentation and Control System',
    'Mechanical Equipment',
    'Renewable Energy Equipment',
    'Safety and Environmental Equipment',
    'Spare part and Maintenance',
    'Water Treatment System'
  ];
  const materials = ['All Material', 'Air Filter', 'Fuel Filter', 'Chemical filter', 'Oil filter', 'Special filter', 'Multi function filter', 'Water filter', 'Gas Filter'];

  const materialPrices: { [key: string]: number } = {
    'Coal': 850000,
    'Gas Turbine Parts': 2500000,
    'Boiler Components': 1800000,
    'Generator Parts': 3200000,
    'Electrical Equipment': 1500000
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const materialDataMap: MaterialData = useMemo(() => ({
    'Coal': [
      { month: 'Jan', userForecast: 1250, erpForecast: 1200, variance: 50, variancePercent: 4.17 },
      { month: 'Feb', userForecast: 1300, erpForecast: 1350, variance: -50, variancePercent: -3.70 },
      { month: 'Mar', userForecast: 1320, erpForecast: 1280, variance: 40, variancePercent: 3.13 },
      { month: 'Apr', userForecast: 1400, erpForecast: 1420, variance: -20, variancePercent: -1.41 },
      { month: 'May', userForecast: 1450, erpForecast: 1380, variance: 70, variancePercent: 5.07 },
      { month: 'Jun', userForecast: 1480, erpForecast: 1450, variance: 30, variancePercent: 2.07 },
      { month: 'Jul', userForecast: 1550, erpForecast: 1520, variance: 30, variancePercent: 1.97 },
      { month: 'Aug', userForecast: 1520, erpForecast: 1480, variance: 40, variancePercent: 2.70 },
      { month: 'Sep', userForecast: 1420, erpForecast: 1390, variance: 30, variancePercent: 2.16 },
      { month: 'Oct', userForecast: 1490, erpForecast: 1460, variance: 30, variancePercent: 2.05 },
      { month: 'Nov', userForecast: 1580, erpForecast: 1550, variance: 30, variancePercent: 1.94 },
      { month: 'Dec', userForecast: 1630, erpForecast: 1600, variance: 30, variancePercent: 1.88 }
    ],
    'Gas Turbine Parts': [
      { month: 'Jan', userForecast: 850, erpForecast: 820, variance: 30, variancePercent: 3.66 },
      { month: 'Feb', userForecast: 900, erpForecast: 880, variance: 20, variancePercent: 2.27 },
      { month: 'Mar', userForecast: 920, erpForecast: 900, variance: 20, variancePercent: 2.22 },
      { month: 'Apr', userForecast: 950, erpForecast: 930, variance: 20, variancePercent: 2.15 },
      { month: 'May', userForecast: 980, erpForecast: 950, variance: 30, variancePercent: 3.16 },
      { month: 'Jun', userForecast: 1000, erpForecast: 980, variance: 20, variancePercent: 2.04 },
      { month: 'Jul', userForecast: 1050, erpForecast: 1020, variance: 30, variancePercent: 2.94 },
      { month: 'Aug', userForecast: 1020, erpForecast: 1000, variance: 20, variancePercent: 2.00 },
      { month: 'Sep', userForecast: 980, erpForecast: 960, variance: 20, variancePercent: 2.08 },
      { month: 'Oct', userForecast: 1000, erpForecast: 980, variance: 20, variancePercent: 2.04 },
      { month: 'Nov', userForecast: 1050, erpForecast: 1030, variance: 20, variancePercent: 1.94 },
      { month: 'Dec', userForecast: 1100, erpForecast: 1080, variance: 20, variancePercent: 1.85 }
    ],
    'Boiler Components': [
      { month: 'Jan', userForecast: 650, erpForecast: 620, variance: 30, variancePercent: 4.84 },
      { month: 'Feb', userForecast: 680, erpForecast: 650, variance: 30, variancePercent: 4.62 },
      { month: 'Mar', userForecast: 700, erpForecast: 680, variance: 20, variancePercent: 2.94 },
      { month: 'Apr', userForecast: 720, erpForecast: 700, variance: 20, variancePercent: 2.86 },
      { month: 'May', userForecast: 750, erpForecast: 720, variance: 30, variancePercent: 4.17 },
      { month: 'Jun', userForecast: 780, erpForecast: 750, variance: 30, variancePercent: 4.00 },
      { month: 'Jul', userForecast: 800, erpForecast: 780, variance: 20, variancePercent: 2.56 },
      { month: 'Aug', userForecast: 820, erpForecast: 800, variance: 20, variancePercent: 2.50 },
      { month: 'Sep', userForecast: 780, erpForecast: 760, variance: 20, variancePercent: 2.63 },
      { month: 'Oct', userForecast: 800, erpForecast: 780, variance: 20, variancePercent: 2.56 },
      { month: 'Nov', userForecast: 850, erpForecast: 820, variance: 30, variancePercent: 3.66 },
      { month: 'Dec', userForecast: 880, erpForecast: 850, variance: 30, variancePercent: 3.53 }
    ],
    'Generator Parts': [
      { month: 'Jan', userForecast: 450, erpForecast: 430, variance: 20, variancePercent: 4.65 },
      { month: 'Feb', userForecast: 480, erpForecast: 460, variance: 20, variancePercent: 4.35 },
      { month: 'Mar', userForecast: 500, erpForecast: 480, variance: 20, variancePercent: 4.17 },
      { month: 'Apr', userForecast: 520, erpForecast: 500, variance: 20, variancePercent: 4.00 },
      { month: 'May', userForecast: 550, erpForecast: 530, variance: 20, variancePercent: 3.77 },
      { month: 'Jun', userForecast: 580, erpForecast: 560, variance: 20, variancePercent: 3.57 },
      { month: 'Jul', userForecast: 600, erpForecast: 580, variance: 20, variancePercent: 3.45 },
      { month: 'Aug', userForecast: 620, erpForecast: 600, variance: 20, variancePercent: 3.33 },
      { month: 'Sep', userForecast: 580, erpForecast: 560, variance: 20, variancePercent: 3.57 },
      { month: 'Oct', userForecast: 600, erpForecast: 580, variance: 20, variancePercent: 3.45 },
      { month: 'Nov', userForecast: 650, erpForecast: 630, variance: 20, variancePercent: 3.17 },
      { month: 'Dec', userForecast: 680, erpForecast: 660, variance: 20, variancePercent: 3.03 }
    ],
    'Electrical Equipment': [
      { month: 'Jan', userForecast: 350, erpForecast: 330, variance: 20, variancePercent: 6.06 },
      { month: 'Feb', userForecast: 380, erpForecast: 360, variance: 20, variancePercent: 5.56 },
      { month: 'Mar', userForecast: 400, erpForecast: 380, variance: 20, variancePercent: 5.26 },
      { month: 'Apr', userForecast: 420, erpForecast: 400, variance: 20, variancePercent: 5.00 },
      { month: 'May', userForecast: 450, erpForecast: 430, variance: 20, variancePercent: 4.65 },
      { month: 'Jun', userForecast: 480, erpForecast: 460, variance: 20, variancePercent: 4.35 },
      { month: 'Jul', userForecast: 500, erpForecast: 480, variance: 20, variancePercent: 4.17 },
      { month: 'Aug', userForecast: 520, erpForecast: 500, variance: 20, variancePercent: 4.00 },
      { month: 'Sep', userForecast: 480, erpForecast: 460, variance: 20, variancePercent: 4.35 },
      { month: 'Oct', userForecast: 500, erpForecast: 480, variance: 20, variancePercent: 4.17 },
      { month: 'Nov', userForecast: 550, erpForecast: 530, variance: 20, variancePercent: 3.77 },
      { month: 'Dec', userForecast: 580, erpForecast: 560, variance: 20, variancePercent: 3.57 }
    ]
  }), []);

  const erpForecastData: MonthlyData[] = useMemo(() =>
    materialDataMap[selectedMaterial].map(item => ({
      ...item,
      userForecast: 0
    })), [selectedMaterial, materialDataMap]);

  const consolidatedData: MonthlyData[] = useMemo(() => {
    if (!hasUserData) return erpForecastData;
    return materialDataMap[selectedMaterial];
  }, [hasUserData, selectedMaterial, erpForecastData, materialDataMap]);

  const finalConsolidatedData = useMemo(() => {
    if (!hasUserData) return [];

    return consolidatedData.map(item => {
      const selection = forecastSelections[item.month];
      let selectedValue = 0;
      let source = '';

      if (selection.source === 'erp') {
        selectedValue = item.erpForecast;
        source = 'ERP Forecast';
      } else if (selection.source === 'user') {
        selectedValue = item.userForecast;
        source = 'User Forecast';
      } else {
        selectedValue = selection.value;
        source = 'Custom Edit';
      }

      return {
        month: item.month,
        selectedForecast: selectedValue,
        source: source,
        userForecast: item.userForecast,
        erpForecast: item.erpForecast
      };
    });
  }, [consolidatedData, forecastSelections, hasUserData]);

  const calculateSummary = (data: MonthlyData[], field: 'userForecast' | 'erpForecast'): DataSummary => {
    const values = data.map(d => d[field]).filter(v => v > 0);
    if (values.length === 0) return { total: 0, average: 0, max: 0, min: 0, variance: 0 };

    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;

    return { total, average, max, min, variance };
  };

  const userSummary = calculateSummary(consolidatedData, 'userForecast');
  const erpSummary = calculateSummary(consolidatedData, 'erpForecast');

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setHasUserData(true);
          setShowSuccess(true);

          const initialSelections: { [key: string]: ForecastSelection } = {};
          consolidatedData.forEach(item => {
            initialSelections[item.month] = {
              source: 'erp',
              value: materialDataMap[selectedMaterial].find(d => d.month === item.month)?.erpForecast || 0
            };
          });
          setForecastSelections(initialSelections);

          setTimeout(() => setShowSuccess(false), 3000);
        }, 500);
      }
    }, 150);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setHasUserData(false);
    setUploadProgress(0);
    setShowSuccess(false);
    setShowFinalTable(false);
  };

  const handleSourceChange = (month: string, source: ForecastSource) => {
    const monthData = consolidatedData.find(d => d.month === month);
    if (!monthData) return;

    let value = 0;
    if (source === 'erp') {
      value = monthData.erpForecast;
    } else if (source === 'user') {
      value = monthData.userForecast;
    } else {
      value = forecastSelections[month]?.value || monthData.erpForecast;
    }

    setForecastSelections(prev => ({
      ...prev,
      [month]: { source, value }
    }));

    if (source === 'custom') {
      setEditingMonth(month);
      setCustomValues(prev => ({
        ...prev,
        [month]: value.toString()
      }));
    } else {
      setEditingMonth(null);
    }
  };

  const handleCustomValueChange = (month: string, value: string) => {
    setCustomValues(prev => ({
      ...prev,
      [month]: value
    }));
  };

  const handleSaveCustomValue = (month: string) => {
    const value = parseFloat(customValues[month] || '0');
    if (isNaN(value) || value < 0) {
      alert('Please enter a valid positive number');
      return;
    }

    setForecastSelections(prev => ({
      ...prev,
      [month]: { source: 'custom', value }
    }));
    setEditingMonth(null);
  };

  const handleDone = () => {
    setShowFinalTable(true);
    setTimeout(() => {
      document.getElementById('final-table')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendToBudget = () => {
    setIsSendingToBudget(true);

    setTimeout(() => {
      setIsSendingToBudget(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Navigate back to units page
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleExportComparison = () => {
    const csvContent = [
      ['Month', 'User Forecast', 'ERP Forecast', 'Variance', 'Variance %'].join(','),
      ...consolidatedData.map(row =>
        [row.month, row.userForecast, row.erpForecast, row.variance, row.variancePercent.toFixed(2)].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `demand_consolidation_${selectedMaterial}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportFinalSelection = () => {
    const csvContent = [
      ['Month', 'Selected Forecast', 'Source', 'User Forecast', 'ERP Forecast'].join(','),
      ...finalConsolidatedData.map(row =>
        [row.month, row.selectedForecast, row.source, row.userForecast, row.erpForecast].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `final_consolidated_forecast_${selectedMaterial}_${new Date().toISOString().split('T')[0]}.csv`);
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
              {entry.name}: {entry.value.toLocaleString()} units
            </p>
          ))}
          {hasUserData && payload.length >= 2 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              Variance: {(payload[0].value - payload[1].value).toLocaleString()} units
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-accenture-purple/10 to-accenture-azure/10 dark:from-accenture-purple/20 dark:to-accenture-azure/20 rounded-xl p-6 border border-accenture-purple/20 dark:border-accenture-purple/30">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-accenture-purple to-accenture-azure rounded-xl flex items-center justify-center flex-shrink-0">
            <GitMerge className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Demand Consolidation
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Compare user forecasts with ERP forecasts. Choose ERP, User, or enter custom values for each month to create your final consolidated demand dataset.
            </p>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center space-x-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-green-800 dark:text-green-200">
            File uploaded successfully! Chart updated with user forecast data.
          </p>
        </div>
      )}

      {showConfirmation && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center space-x-3">
          <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <p className="text-blue-800 dark:text-blue-200">
            ✅ Successfully sent to E-Budget system! Your consolidated forecast for {selectedMaterial} has been submitted for approval.
          </p>
        </div>
      )}

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
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accenture-purple focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accenture-purple focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accenture-purple focus:border-transparent"
          >
            {materials.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`bg-white dark:bg-gray-900 rounded-xl border-2 border-dashed transition-all duration-200 ${
            isDragging
              ? 'border-accenture-purple bg-accenture-purple/5 dark:bg-accenture-purple/10'
              : hasUserData
              ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10'
              : 'border-gray-300 dark:border-gray-700'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>User Forecast Upload</span>
              </h3>
              {hasUserData && (
                <button
                  onClick={handleRemoveFile}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {!hasUserData ? (
              <div className="text-center">
                <div className="mb-6">
                  <FileText className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Maximum file size: 5MB
                  </p>
                </div>

                <label className="inline-block">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <span className="px-6 py-3 bg-gradient-to-r from-accenture-purple to-accenture-azure hover:from-accenture-purple-dark hover:to-accenture-azure-dark text-white rounded-xl transition-all duration-200 cursor-pointer inline-block font-semibold shadow-lg hover:shadow-xl">
                    Select CSV File
                  </span>
                </label>

                {isUploading && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-2.5 bg-gradient-to-r from-accenture-purple to-accenture-azure transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {uploadedFile?.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {uploadedFile ? `${(uploadedFile.size / 1024).toFixed(2)} KB` : ''}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">User Forecast Summary</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {userSummary.total.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Average</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {userSummary.average.toFixed(0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Max</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {userSummary.max.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Min</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {userSummary.min.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>ERP Annual Forecast</span>
          </h3>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">ERP Forecast Summary</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {erpSummary.total.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Average</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {erpSummary.average.toFixed(0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Max</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {erpSummary.max.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Min</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {erpSummary.min.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This data was generated from historical demand patterns using ML time-series analysis from Stage 1.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Forecast Comparison Chart
          </h3>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  chartType === 'line'
                    ? 'bg-white dark:bg-gray-700 text-accenture-purple shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  chartType === 'bar'
                    ? 'bg-white dark:bg-gray-700 text-accenture-purple shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Bar
              </button>
            </div>
            <button
              onClick={handleExportComparison}
              disabled={!hasUserData}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'line' ? (
            <LineChart data={consolidatedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis
                dataKey="month"
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              {hasUserData && (
                <Line
                  type="monotone"
                  dataKey="userForecast"
                  name="User Forecast"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              <Line
                type="monotone"
                dataKey="erpForecast"
                name="ERP Forecast"
                stroke="#06B6D4"
                strokeWidth={3}
                dot={{ fill: '#06B6D4', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={consolidatedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis
                dataKey="month"
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="rect"
              />
              {hasUserData && (
                <Bar
                  dataKey="userForecast"
                  name="User Forecast"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
              )}
              <Bar
                dataKey="erpForecast"
                name="ERP Forecast"
                fill="#06B6D4"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>

        {!hasUserData && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Upload a user forecast CSV file to compare with ERP forecast data and enable selection features.
              </p>
            </div>
          </div>
        )}
      </div>

      {hasUserData && (
        <>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Variance Analysis & Forecast Selection
              </h3>
              <button
                onClick={handleDone}
                className="px-6 py-2.5 bg-gradient-to-r from-accenture-purple to-accenture-azure hover:from-accenture-purple-dark hover:to-accenture-azure-dark text-white rounded-lg transition-colors flex items-center space-x-2 font-semibold shadow-lg"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Done - Show Final Table</span>
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Choose which forecast to use: <span className="font-semibold text-cyan-600 dark:text-cyan-400">ERP</span>, <span className="font-semibold text-purple-600 dark:text-purple-400">User Input</span>, or <span className="font-semibold text-orange-600 dark:text-orange-400">Custom Edit</span> for each month.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Month</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User Forecast</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ERP Forecast</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Variance</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase min-w-[300px]">Select Forecast</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {consolidatedData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.month}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{row.userForecast.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{row.erpForecast.toLocaleString()}</td>
                      <td className={`px-4 py-3 text-sm text-right font-semibold ${
                        row.variance > 0 ? 'text-green-600 dark:text-green-400' : row.variance < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {row.variance > 0 ? '+' : ''}{row.variance.toLocaleString()} ({row.variancePercent > 0 ? '+' : ''}{row.variancePercent.toFixed(2)}%)
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center space-x-3">
                          <label className="flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`forecast-${row.month}`}
                              checked={forecastSelections[row.month]?.source === 'erp'}
                              onChange={() => handleSourceChange(row.month, 'erp')}
                              className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                            />
                            <span className="text-xs text-gray-700 dark:text-gray-300">ERP</span>
                          </label>
                          <label className="flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`forecast-${row.month}`}
                              checked={forecastSelections[row.month]?.source === 'user'}
                              onChange={() => handleSourceChange(row.month, 'user')}
                              className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-xs text-gray-700 dark:text-gray-300">User</span>
                          </label>
                          <label className="flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`forecast-${row.month}`}
                              checked={forecastSelections[row.month]?.source === 'custom'}
                              onChange={() => handleSourceChange(row.month, 'custom')}
                              className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-xs text-gray-700 dark:text-gray-300">Custom</span>
                          </label>
                          {forecastSelections[row.month]?.source === 'custom' && (
                            <div className="flex items-center space-x-2">
                              {editingMonth === row.month ? (
                                <>
                                  <input
                                    type="number"
                                    value={customValues[row.month] || ''}
                                    onChange={(e) => handleCustomValueChange(row.month, e.target.value)}
                                    className="w-24 px-2 py-1 text-xs border border-orange-300 dark:border-orange-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                                    placeholder="Enter value"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveCustomValue(row.month)}
                                    className="p-1 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors"
                                    title="Save custom value"
                                  >
                                    <Save className="h-4 w-4" />
                                  </button>
                                </>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
                                    {forecastSelections[row.month]?.value.toLocaleString()}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setEditingMonth(row.month);
                                      setCustomValues(prev => ({
                                        ...prev,
                                        [row.month]: forecastSelections[row.month]?.value.toString() || ''
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {showFinalTable && (
            <div id="final-table" className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-300 dark:border-green-700 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Final Demand Table
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Material: <span className="font-semibold">{selectedMaterial}</span> • Ready for E-Budget Submission
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleExportFinalSelection}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2 font-semibold shadow-lg"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={handleSendToBudget}
                    disabled={isSendingToBudget}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl"
                  >
                    {isSendingToBudget ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Confirm & Send to E-Budget</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl border-2 border-green-300 dark:border-green-700 shadow-lg">
                <table className="w-full">
                  <thead className="bg-green-100 dark:bg-green-900/40 border-b-2 border-green-300 dark:border-green-700">
                    <tr>
                      <th className="px-4 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase">Month</th>
                      <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Final Forecast (Qty)</th>
                      <th className="px-4 py-4 text-center text-sm font-bold text-gray-900 dark:text-white uppercase">Source</th>
                      <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Unit Price</th>
                      <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {finalConsolidatedData.map((row, index) => {
                      const unitPrice = materialPrices[selectedMaterial] || 1000000;
                      const totalAmount = row.selectedForecast * unitPrice;
                      return (
                        <tr key={index} className="hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                          <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white">{row.month}</td>
                          <td className="px-4 py-4 text-sm text-right font-bold text-blue-700 dark:text-blue-400">
                            {row.selectedForecast.toLocaleString()} units
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${
                              row.source === 'User Forecast'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                                : row.source === 'Custom Edit'
                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300'
                                : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300'
                            }`}>
                              {row.source}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-right text-gray-600 dark:text-gray-400">
                            {formatCurrency(unitPrice)}
                          </td>
                          <td className="px-4 py-4 text-sm text-right font-bold text-green-700 dark:text-green-400 text-lg">
                            {formatCurrency(totalAmount)}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-green-100 dark:bg-green-900/40 font-bold border-t-2 border-green-300 dark:border-green-700">
                      <td className="px-4 py-5 text-base text-gray-900 dark:text-white uppercase">Annual Total</td>
                      <td className="px-4 py-5 text-base text-right text-blue-700 dark:text-blue-400 font-bold">
                        {finalConsolidatedData.reduce((sum, row) => sum + row.selectedForecast, 0).toLocaleString()} units
                      </td>
                      <td className="px-4 py-5"></td>
                      <td className="px-4 py-5 text-sm text-right text-gray-600 dark:text-gray-400 font-semibold">
                        Avg: {formatCurrency(materialPrices[selectedMaterial] || 1000000)}
                      </td>
                      <td className="px-4 py-5 text-base text-right text-green-700 dark:text-green-400 text-xl font-extrabold">
                        {formatCurrency(finalConsolidatedData.reduce((sum, row) => sum + row.selectedForecast, 0) * (materialPrices[selectedMaterial] || 1000000))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Ready for Submission</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        This final consolidated forecast combines your selected values from ERP, User, and Custom edits.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-2">
                    <Send className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">E-Budget Integration</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Click "Confirm & Send to E-Budget" to submit this forecast for approval and budget allocation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-300">
            <div className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Successfully Submitted!
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Your consolidated forecast has been sent to the E-Budget system.
              </p>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-800 dark:text-green-200">
                    Material: {selectedMaterial}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-800 dark:text-green-200">
                    Total: {finalConsolidatedData.reduce((sum, row) => sum + row.selectedForecast, 0).toLocaleString()} units
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start space-x-3 text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Forecast Consolidated</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">All monthly values have been finalized</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Sent to E-Budget</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Awaiting approval from budget team</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Notification Sent</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Stakeholders have been notified</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCloseSuccessModal}
                className="w-full px-6 py-3 bg-gradient-to-r from-accenture-purple to-accenture-azure hover:from-accenture-purple-dark hover:to-accenture-azure-dark text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
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

export default DPKDemandConsolidation;
