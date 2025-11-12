import React, { useState, useMemo } from 'react';
import { Upload, Download, FileText, TrendingUp, GitMerge, AlertCircle, CheckCircle2, X, Filter, Package, Send, CreditCard as Edit3, Save, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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

interface UnitDemandConsolidationProps {
  unitName: string;
  unitCode: string;
  onSuccess?: () => void;
}

const UnitDemandConsolidation: React.FC<UnitDemandConsolidationProps> = ({ unitName, unitCode, onSuccess }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasUserData, setHasUserData] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('Filter air');
  const [showFinalTable, setShowFinalTable] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSendingToBudget, setIsSendingToBudget] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null });

  const materials = ['Filter air', 'Filter Udara Cartridge', 'Oil Filter', 'Filter Gas', 'Filter Udara Kassa'];

  const materialPrices: { [key: string]: number } = {
    'Filter air': 450000,
    'Filter Udara Cartridge': 650000,
    'Oil Filter': 350000,
    'Filter Gas': 550000,
    'Filter Udara Kassa': 280000
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
    'Filter air': [
      { month: 'Jan', userForecast: 320, erpForecast: 310, variance: 10, variancePercent: 3.23, unitPrice: 450000, erpAmount: 139500000, userAmount: 144000000 },
      { month: 'Feb', userForecast: 330, erpForecast: 320, variance: 10, variancePercent: 3.13, unitPrice: 450000, erpAmount: 144000000, userAmount: 148500000 },
      { month: 'Mar', userForecast: 340, erpForecast: 335, variance: 5, variancePercent: 1.49, unitPrice: 450000, erpAmount: 150750000, userAmount: 153000000 },
      { month: 'Apr', userForecast: 350, erpForecast: 345, variance: 5, variancePercent: 1.45, unitPrice: 450000, erpAmount: 155250000, userAmount: 157500000 },
      { month: 'May', userForecast: 360, erpForecast: 350, variance: 10, variancePercent: 2.86, unitPrice: 450000, erpAmount: 157500000, userAmount: 162000000 },
      { month: 'Jun', userForecast: 370, erpForecast: 360, variance: 10, variancePercent: 2.78, unitPrice: 450000, erpAmount: 162000000, userAmount: 166500000 },
      { month: 'Jul', userForecast: 380, erpForecast: 370, variance: 10, variancePercent: 2.70, unitPrice: 450000, erpAmount: 166500000, userAmount: 171000000 },
      { month: 'Aug', userForecast: 390, erpForecast: 380, variance: 10, variancePercent: 2.63, unitPrice: 450000, erpAmount: 171000000, userAmount: 175500000 },
      { month: 'Sep', userForecast: 370, erpForecast: 360, variance: 10, variancePercent: 2.78, unitPrice: 450000, erpAmount: 162000000, userAmount: 166500000 },
      { month: 'Oct', userForecast: 380, erpForecast: 370, variance: 10, variancePercent: 2.70, unitPrice: 450000, erpAmount: 166500000, userAmount: 171000000 },
      { month: 'Nov', userForecast: 400, erpForecast: 390, variance: 10, variancePercent: 2.56, unitPrice: 450000, erpAmount: 175500000, userAmount: 180000000 },
      { month: 'Dec', userForecast: 410, erpForecast: 400, variance: 10, variancePercent: 2.50, unitPrice: 450000, erpAmount: 180000000, userAmount: 184500000 }
    ],
    'Filter Udara Cartridge': [
      { month: 'Jan', userForecast: 220, erpForecast: 210, variance: 10, variancePercent: 4.76, unitPrice: 650000, erpAmount: 136500000, userAmount: 143000000 },
      { month: 'Feb', userForecast: 230, erpForecast: 220, variance: 10, variancePercent: 4.55, unitPrice: 650000, erpAmount: 143000000, userAmount: 149500000 },
      { month: 'Mar', userForecast: 240, erpForecast: 230, variance: 10, variancePercent: 4.35, unitPrice: 650000, erpAmount: 149500000, userAmount: 156000000 },
      { month: 'Apr', userForecast: 250, erpForecast: 240, variance: 10, variancePercent: 4.17, unitPrice: 650000, erpAmount: 156000000, userAmount: 162500000 },
      { month: 'May', userForecast: 260, erpForecast: 250, variance: 10, variancePercent: 4.00, unitPrice: 650000, erpAmount: 162500000, userAmount: 169000000 },
      { month: 'Jun', userForecast: 270, erpForecast: 260, variance: 10, variancePercent: 3.85, unitPrice: 650000, erpAmount: 169000000, userAmount: 175500000 },
      { month: 'Jul', userForecast: 280, erpForecast: 270, variance: 10, variancePercent: 3.70, unitPrice: 650000, erpAmount: 175500000, userAmount: 182000000 },
      { month: 'Aug', userForecast: 290, erpForecast: 280, variance: 10, variancePercent: 3.57, unitPrice: 650000, erpAmount: 182000000, userAmount: 188500000 },
      { month: 'Sep', userForecast: 270, erpForecast: 260, variance: 10, variancePercent: 3.85, unitPrice: 650000, erpAmount: 169000000, userAmount: 175500000 },
      { month: 'Oct', userForecast: 280, erpForecast: 270, variance: 10, variancePercent: 3.70, unitPrice: 650000, erpAmount: 175500000, userAmount: 182000000 },
      { month: 'Nov', userForecast: 300, erpForecast: 290, variance: 10, variancePercent: 3.45, unitPrice: 650000, erpAmount: 188500000, userAmount: 195000000 },
      { month: 'Dec', userForecast: 310, erpForecast: 300, variance: 10, variancePercent: 3.33, unitPrice: 650000, erpAmount: 195000000, userAmount: 201500000 }
    ],
    'Oil Filter': [
      { month: 'Jan', userForecast: 380, erpForecast: 370, variance: 10, variancePercent: 2.70, unitPrice: 350000, erpAmount: 129500000, userAmount: 133000000 },
      { month: 'Feb', userForecast: 390, erpForecast: 380, variance: 10, variancePercent: 2.63, unitPrice: 350000, erpAmount: 133000000, userAmount: 136500000 },
      { month: 'Mar', userForecast: 400, erpForecast: 390, variance: 10, variancePercent: 2.56, unitPrice: 350000, erpAmount: 136500000, userAmount: 140000000 },
      { month: 'Apr', userForecast: 410, erpForecast: 400, variance: 10, variancePercent: 2.50, unitPrice: 350000, erpAmount: 140000000, userAmount: 143500000 },
      { month: 'May', userForecast: 420, erpForecast: 410, variance: 10, variancePercent: 2.44, unitPrice: 350000, erpAmount: 143500000, userAmount: 147000000 },
      { month: 'Jun', userForecast: 430, erpForecast: 420, variance: 10, variancePercent: 2.38, unitPrice: 350000, erpAmount: 147000000, userAmount: 150500000 },
      { month: 'Jul', userForecast: 440, erpForecast: 430, variance: 10, variancePercent: 2.33, unitPrice: 350000, erpAmount: 150500000, userAmount: 154000000 },
      { month: 'Aug', userForecast: 450, erpForecast: 440, variance: 10, variancePercent: 2.27, unitPrice: 350000, erpAmount: 154000000, userAmount: 157500000 },
      { month: 'Sep', userForecast: 430, erpForecast: 420, variance: 10, variancePercent: 2.38, unitPrice: 350000, erpAmount: 147000000, userAmount: 150500000 },
      { month: 'Oct', userForecast: 440, erpForecast: 430, variance: 10, variancePercent: 2.33, unitPrice: 350000, erpAmount: 150500000, userAmount: 154000000 },
      { month: 'Nov', userForecast: 460, erpForecast: 450, variance: 10, variancePercent: 2.22, unitPrice: 350000, erpAmount: 157500000, userAmount: 161000000 },
      { month: 'Dec', userForecast: 470, erpForecast: 460, variance: 10, variancePercent: 2.17, unitPrice: 350000, erpAmount: 161000000, userAmount: 164500000 }
    ],
    'Filter Gas': [
      { month: 'Jan', userForecast: 170, erpForecast: 165, variance: 5, variancePercent: 3.03, unitPrice: 550000, erpAmount: 90750000, userAmount: 93500000 },
      { month: 'Feb', userForecast: 180, erpForecast: 175, variance: 5, variancePercent: 2.86, unitPrice: 550000, erpAmount: 96250000, userAmount: 99000000 },
      { month: 'Mar', userForecast: 190, erpForecast: 185, variance: 5, variancePercent: 2.70, unitPrice: 550000, erpAmount: 101750000, userAmount: 104500000 },
      { month: 'Apr', userForecast: 200, erpForecast: 195, variance: 5, variancePercent: 2.56, unitPrice: 550000, erpAmount: 107250000, userAmount: 110000000 },
      { month: 'May', userForecast: 210, erpForecast: 205, variance: 5, variancePercent: 2.44, unitPrice: 550000, erpAmount: 112750000, userAmount: 115500000 },
      { month: 'Jun', userForecast: 220, erpForecast: 215, variance: 5, variancePercent: 2.33, unitPrice: 550000, erpAmount: 118250000, userAmount: 121000000 },
      { month: 'Jul', userForecast: 230, erpForecast: 225, variance: 5, variancePercent: 2.22, unitPrice: 550000, erpAmount: 123750000, userAmount: 126500000 },
      { month: 'Aug', userForecast: 240, erpForecast: 235, variance: 5, variancePercent: 2.13, unitPrice: 550000, erpAmount: 129250000, userAmount: 132000000 },
      { month: 'Sep', userForecast: 220, erpForecast: 215, variance: 5, variancePercent: 2.33, unitPrice: 550000, erpAmount: 118250000, userAmount: 121000000 },
      { month: 'Oct', userForecast: 230, erpForecast: 225, variance: 5, variancePercent: 2.22, unitPrice: 550000, erpAmount: 123750000, userAmount: 126500000 },
      { month: 'Nov', userForecast: 250, erpForecast: 245, variance: 5, variancePercent: 2.04, unitPrice: 550000, erpAmount: 134750000, userAmount: 137500000 },
      { month: 'Dec', userForecast: 260, erpForecast: 255, variance: 5, variancePercent: 1.96, unitPrice: 550000, erpAmount: 140250000, userAmount: 143000000 }
    ],
    'Filter Udara Kassa': [
      { month: 'Jan', userForecast: 260, erpForecast: 250, variance: 10, variancePercent: 4.00, unitPrice: 280000, erpAmount: 70000000, userAmount: 72800000 },
      { month: 'Feb', userForecast: 270, erpForecast: 260, variance: 10, variancePercent: 3.85, unitPrice: 280000, erpAmount: 72800000, userAmount: 75600000 },
      { month: 'Mar', userForecast: 280, erpForecast: 270, variance: 10, variancePercent: 3.70, unitPrice: 280000, erpAmount: 75600000, userAmount: 78400000 },
      { month: 'Apr', userForecast: 290, erpForecast: 280, variance: 10, variancePercent: 3.57, unitPrice: 280000, erpAmount: 78400000, userAmount: 81200000 },
      { month: 'May', userForecast: 300, erpForecast: 290, variance: 10, variancePercent: 3.45, unitPrice: 280000, erpAmount: 81200000, userAmount: 84000000 },
      { month: 'Jun', userForecast: 310, erpForecast: 300, variance: 10, variancePercent: 3.33, unitPrice: 280000, erpAmount: 84000000, userAmount: 86800000 },
      { month: 'Jul', userForecast: 320, erpForecast: 310, variance: 10, variancePercent: 3.23, unitPrice: 280000, erpAmount: 86800000, userAmount: 89600000 },
      { month: 'Aug', userForecast: 330, erpForecast: 320, variance: 10, variancePercent: 3.13, unitPrice: 280000, erpAmount: 89600000, userAmount: 92400000 },
      { month: 'Sep', userForecast: 310, erpForecast: 300, variance: 10, variancePercent: 3.33, unitPrice: 280000, erpAmount: 84000000, userAmount: 86800000 },
      { month: 'Oct', userForecast: 320, erpForecast: 310, variance: 10, variancePercent: 3.23, unitPrice: 280000, erpAmount: 86800000, userAmount: 89600000 },
      { month: 'Nov', userForecast: 340, erpForecast: 330, variance: 10, variancePercent: 3.03, unitPrice: 280000, erpAmount: 92400000, userAmount: 95200000 },
      { month: 'Dec', userForecast: 350, erpForecast: 340, variance: 10, variancePercent: 2.94, unitPrice: 280000, erpAmount: 95200000, userAmount: 98000000 }
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

  // Month order mapping for chronological sorting
  const monthOrder: { [key: string]: number } = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
  };

  // Sorted data based on current sort configuration
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return consolidatedData;
    }

    const sorted = [...consolidatedData].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      // Handle different column types
      if (sortConfig.key === 'month') {
        aValue = monthOrder[a.month];
        bValue = monthOrder[b.month];
      } else if (sortConfig.key === 'userForecast') {
        aValue = a.userForecast;
        bValue = b.userForecast;
      } else if (sortConfig.key === 'erpForecast') {
        aValue = a.erpForecast;
        bValue = b.erpForecast;
      } else if (sortConfig.key === 'variance') {
        aValue = a.variance;
        bValue = b.variance;
      } else {
        return 0;
      }

      // Compare values
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [consolidatedData, sortConfig, monthOrder]);

  // Handle column header click for sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';

    // Toggle sort direction
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null; // Reset to no sort
      }
    }

    setSortConfig({ key, direction });
  };

  // Render sort icon based on current state
  const renderSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
    }

    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="h-3.5 w-3.5" />;
    }

    if (sortConfig.direction === 'desc') {
      return <ArrowDown className="h-3.5 w-3.5" />;
    }

    return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
  };

  const finalConsolidatedData = useMemo(() => {
    if (!hasUserData) return [];

    return consolidatedData.map(item => {
      const selection = forecastSelections[item.month];
      let selectedValue = 0;
      let source = '';

      if (selection.source === 'erp') {
        selectedValue = item.erpForecast;
        source = 'User Forecast';
      } else if (selection.source === 'user') {
        selectedValue = item.userForecast;
        source = 'AI Forecast';
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
    // Navigate back to units landing page (Stage 1)
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleExportComparison = () => {
    const csvContent = [
      ['Month', 'AI Forecast', 'User Forecast', 'Variance', 'Variance %'].join(','),
      ...consolidatedData.map(row =>
        [row.month, row.userForecast, row.erpForecast, row.variance, row.variancePercent.toFixed(2)].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `demand_consolidation_${unitCode}_${selectedMaterial}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportFinalSelection = () => {
    const csvContent = [
      ['Month', 'Selected Forecast', 'Source', 'AI Forecast', 'User Forecast'].join(','),
      ...finalConsolidatedData.map(row =>
        [row.month, row.selectedForecast, row.source, row.userForecast, row.erpForecast].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `final_consolidated_forecast_${unitCode}_${selectedMaterial}_${new Date().toISOString().split('T')[0]}.csv`);
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
              Demand Submission - {unitName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Compare user forecasts with ERP forecasts for {unitName} ({unitCode}). Choose ERP, User, or enter custom values for each month to create your final submitted demand dataset.
            </p>
          </div>
        </div>
      </div>

       <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Material Selection</span>
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <Package className="h-5 w-5 text-gray-400" />
          <select
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accenture-purple focus:border-transparent"
          >
            {materials.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
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
            Successfully sent to E-Budget system! Your submitted forecast for {unitName} - {selectedMaterial} has been submitted for approval.
          </p>
        </div>
      )}

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
                <span>AI Forecast Upload</span>
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
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">AI Forecast Summary</h4>
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
            <span>User Annual Forecast</span>
          </h3>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">User Forecast Summary</h4>
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
                This data was generated from historical demand patterns for {unitName} using ML time-series analysis.
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
                  name="AI Forecast"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              <Line
                type="monotone"
                dataKey="erpForecast"
                name="User Forecast"
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
                  name="AI Forecast"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
              )}
              <Bar
                dataKey="erpForecast"
                name="User Forecast"
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
                Upload an AI forecast CSV file to compare with user forecast data and enable selection features.
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
                    <th
                      onClick={() => handleSort('month')}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors select-none group"
                    >
                      <div className="flex items-center space-x-2">
                        <span>Month</span>
                        <span className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                          {renderSortIcon('month')}
                        </span>
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('userForecast')}
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors select-none group"
                    >
                      <div className="flex items-center justify-end space-x-2">
                        <span>User Forecast</span>
                        <span className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                          {renderSortIcon('userForecast')}
                        </span>
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('erpForecast')}
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors select-none group"
                    >
                      <div className="flex items-center justify-end space-x-2">
                        <span>AI Forecast</span>
                        <span className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                          {renderSortIcon('erpForecast')}
                        </span>
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('variance')}
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors select-none group"
                    >
                      <div className="flex items-center justify-end space-x-2">
                        <span>Variance</span>
                        <span className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                          {renderSortIcon('variance')}
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase min-w-[300px]">Select Forecast</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {sortedData.map((row, index) => (
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
                      Unit: <span className="font-semibold">{unitName}</span> • Material: <span className="font-semibold">{selectedMaterial}</span> • Ready for E-Budget Submission
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
                        <span>Confirm & Send to HQ</span>
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
                        This final consolidated forecast for {unitName} combines your selected values from ERP, User, and Custom edits.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-2">
                    <Send className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">HQ Integration</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Click "Confirm & Send to HQ" to submit this forecast to headquarters for consolidation and approval.
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
                Your consolidated forecast for {unitName} has been sent to HQ for review and consolidation.
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
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Sent to HQ</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Awaiting consolidation and approval from headquarters</p>
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

export default UnitDemandConsolidation;
