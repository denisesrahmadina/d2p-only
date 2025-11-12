import React, { useState, useMemo } from 'react';
import { Package, Building2, Truck, FileText, Sparkles, Play, CheckCircle2, TrendingDown, Download, Scale, Factory, Filter } from 'lucide-react';
import plnUnitsData from '../../../data/plnUnits.json';

interface MonthlyNettingData {
  month: string;
  adjustedDemand: number;
  inventoryFulfillment: number;
  contractFulfillment: number;
  stockTransfer: number;
  netProcurement: number;
  unitPrice: number;
  totalAmount: number;
}

interface MaterialNettingData {
  [material: string]: {
    adjustedTotal: number;
    inventoryTotal: number;
    contractTotal: number;
    transferTotal: number;
    procurementTotal: number;
    unitPrice: number;
    totalAmount: number;
    monthlyData: MonthlyNettingData[];
  };
}

const DPKDemandNetting: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All Material');
  const [selectedCategory, setSelectedCategory] = useState<string>('Filters');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const categories = ['All Categories', 'Filters', 'Fuel & Combustion', 'Lubricants & Fluids', 'Mechanical Parts', 'Electrical Components', 'Safety & Environment', 'Maintenance Supplies'];
  const materials = ['All Material', 'Air Filter', 'Fuel Filter', 'Chemical filter', 'Oil filter', 'Special filter', 'Multi function filter', 'Water filter', 'Gas Filter'];

  const processingSteps = [
    'Analyzing adjusted demand forecasts...',
    'Checking inventory availability...',
    'Reviewing long-term contract commitments...',
    'Calculating stock transfer opportunities...',
    'Computing net procurement requirements...'
  ];

  const materialNettingData: MaterialNettingData = useMemo(() => ({
   'Filter air': {
     adjustedTotal: 25920,
     inventoryTotal: 8000,
     contractTotal: 4000,
     transferTotal: 200,
     procurementTotal: 13720,
     unitPrice: 450000,
     totalAmount: 1710000000,
     monthlyData: [
       { month: 'Jan', adjustedDemand: 330, inventoryFulfillment: 25, contractFulfillment: 15, stockTransfer: 10, netProcurement: 280, unitPrice: 450000, totalAmount: 126000000 },
       { month: 'Feb', adjustedDemand: 340, inventoryFulfillment: 25, contractFulfillment: 15, stockTransfer: 10, netProcurement: 290, unitPrice: 450000, totalAmount: 130500000 },
       { month: 'Mar', adjustedDemand: 355, inventoryFulfillment: 30, contractFulfillment: 15, stockTransfer: 10, netProcurement: 300, unitPrice: 450000, totalAmount: 135000000 },
       { month: 'Apr', adjustedDemand: 365, inventoryFulfillment: 25, contractFulfillment: 15, stockTransfer: 10, netProcurement: 310, unitPrice: 450000, totalAmount: 139500000 },
       { month: 'May', adjustedDemand: 375, inventoryFulfillment: 30, contractFulfillment: 15, stockTransfer: 10, netProcurement: 320, unitPrice: 450000, totalAmount: 144000000 },
       { month: 'Jun', adjustedDemand: 385, inventoryFulfillment: 30, contractFulfillment: 15, stockTransfer: 10, netProcurement: 330, unitPrice: 450000, totalAmount: 148500000 },
       { month: 'Jul', adjustedDemand: 395, inventoryFulfillment: 30, contractFulfillment: 20, stockTransfer: 5, netProcurement: 340, unitPrice: 450000, totalAmount: 153000000 },
       { month: 'Aug', adjustedDemand: 405, inventoryFulfillment: 30, contractFulfillment: 20, stockTransfer: 5, netProcurement: 350, unitPrice: 450000, totalAmount: 157500000 },
       { month: 'Sep', adjustedDemand: 385, inventoryFulfillment: 30, contractFulfillment: 20, stockTransfer: 5, netProcurement: 330, unitPrice: 450000, totalAmount: 148500000 },
       { month: 'Oct', adjustedDemand: 395, inventoryFulfillment: 30, contractFulfillment: 20, stockTransfer: 5, netProcurement: 340, unitPrice: 450000, totalAmount: 153000000 },
       { month: 'Nov', adjustedDemand: 415, inventoryFulfillment: 30, contractFulfillment: 20, stockTransfer: 5, netProcurement: 360, unitPrice: 450000, totalAmount: 162000000 },
       { month: 'Dec', adjustedDemand: 425, inventoryFulfillment: 25, contractFulfillment: 20, stockTransfer: 10, netProcurement: 370, unitPrice: 450000, totalAmount: 166500000 }
     ]
   },
   'Filter Udara Cartridge': {
     adjustedTotal: 20920,
     inventoryTotal: 7200,
     contractTotal: 3600,
     transferTotal: 180,
     procurementTotal: 9940,
     unitPrice: 650000,
     totalAmount: 6461000000,
     monthlyData: [
       { month: 'Jan', adjustedDemand: 780, inventoryFulfillment: 22, contractFulfillment: 15, stockTransfer: 6, netProcurement: 737, unitPrice: 650000, totalAmount: 479050000 },
       { month: 'Feb', adjustedDemand: 820, inventoryFulfillment: 23, contractFulfillment: 16, stockTransfer: 7, netProcurement: 774, unitPrice: 650000, totalAmount: 503100000 },
       { month: 'Mar', adjustedDemand: 850, inventoryFulfillment: 24, contractFulfillment: 17, stockTransfer: 7, netProcurement: 802, unitPrice: 650000, totalAmount: 521300000 },
       { month: 'Apr', adjustedDemand: 880, inventoryFulfillment: 24, contractFulfillment: 17, stockTransfer: 7, netProcurement: 832, unitPrice: 650000, totalAmount: 540800000 },
       { month: 'May', adjustedDemand: 910, inventoryFulfillment: 25, contractFulfillment: 18, stockTransfer: 7, netProcurement: 860, unitPrice: 650000, totalAmount: 559000000 },
       { month: 'Jun', adjustedDemand: 940, inventoryFulfillment: 25, contractFulfillment: 18, stockTransfer: 7, netProcurement: 890, unitPrice: 650000, totalAmount: 578500000 },
       { month: 'Jul', adjustedDemand: 970, inventoryFulfillment: 26, contractFulfillment: 19, stockTransfer: 7, netProcurement: 918, unitPrice: 650000, totalAmount: 596700000 },
       { month: 'Aug', adjustedDemand: 1000, inventoryFulfillment: 26, contractFulfillment: 19, stockTransfer: 7, netProcurement: 948, unitPrice: 650000, totalAmount: 616200000 },
       { month: 'Sep', adjustedDemand: 940, inventoryFulfillment: 25, contractFulfillment: 18, stockTransfer: 7, netProcurement: 890, unitPrice: 650000, totalAmount: 578500000 },
       { month: 'Oct', adjustedDemand: 970, inventoryFulfillment: 26, contractFulfillment: 19, stockTransfer: 7, netProcurement: 918, unitPrice: 650000, totalAmount: 596700000 },
       { month: 'Nov', adjustedDemand: 1030, inventoryFulfillment: 27, contractFulfillment: 20, stockTransfer: 7, netProcurement: 976, unitPrice: 650000, totalAmount: 634400000 },
       { month: 'Dec', adjustedDemand: 1060, inventoryFulfillment: 27, contractFulfillment: 20, stockTransfer: 8, netProcurement: 1005, unitPrice: 650000, totalAmount: 653250000 }
     ]
   },
   'Oil Filter': {
     adjustedTotal: 26122,
     inventoryTotal: 6480,
     contractTotal: 3240,
     transferTotal: 162,
     procurementTotal: 16240,
     unitPrice: 350000,
     totalAmount: 1610000000,
     monthlyData: [
       { month: 'Jan', adjustedDemand: 390, inventoryFulfillment: 30, contractFulfillment: 15, stockTransfer: 5, netProcurement: 340, unitPrice: 350000, totalAmount: 119000000 },
       { month: 'Feb', adjustedDemand: 400, inventoryFulfillment: 30, contractFulfillment: 15, stockTransfer: 5, netProcurement: 350, unitPrice: 350000, totalAmount: 122500000 },
       { month: 'Mar', adjustedDemand: 410, inventoryFulfillment: 30, contractFulfillment: 15, stockTransfer: 5, netProcurement: 360, unitPrice: 350000, totalAmount: 126000000 },
       { month: 'Apr', adjustedDemand: 420, inventoryFulfillment: 30, contractFulfillment: 15, stockTransfer: 5, netProcurement: 370, unitPrice: 350000, totalAmount: 129500000 },
       { month: 'May', adjustedDemand: 430, inventoryFulfillment: 30, contractFulfillment: 15, stockTransfer: 5, netProcurement: 380, unitPrice: 350000, totalAmount: 133000000 },
       { month: 'Jun', adjustedDemand: 440, inventoryFulfillment: 30, contractFulfillment: 15, stockTransfer: 5, netProcurement: 390, unitPrice: 350000, totalAmount: 136500000 },
       { month: 'Jul', adjustedDemand: 450, inventoryFulfillment: 30, contractFulfillment: 15, stockTransfer: 5, netProcurement: 400, unitPrice: 350000, totalAmount: 140000000 },
       { month: 'Aug', adjustedDemand: 460, inventoryFulfillment: 30, contractFulfillment: 15, stockTransfer: 5, netProcurement: 410, unitPrice: 350000, totalAmount: 143500000 },
       { month: 'Sep', adjustedDemand: 440, inventoryFulfillment: 30, contractFulfillment: 15, stockTransfer: 5, netProcurement: 390, unitPrice: 350000, totalAmount: 136500000 },
       { month: 'Oct', adjustedDemand: 450, inventoryFulfillment: 30, contractFulfillment: 15, stockTransfer: 5, netProcurement: 400, unitPrice: 350000, totalAmount: 140000000 },
       { month: 'Nov', adjustedDemand: 470, inventoryFulfillment: 30, contractFulfillment: 15, stockTransfer: 5, netProcurement: 420, unitPrice: 350000, totalAmount: 147000000 },
       { month: 'Dec', adjustedDemand: 480, inventoryFulfillment: 30, contractFulfillment: 15, stockTransfer: 5, netProcurement: 430, unitPrice: 350000, totalAmount: 150500000 }
     ]
   },
   'Filter Gas': {
     adjustedTotal: 15194,
     inventoryTotal: 5832,
     contractTotal: 2916,
     transferTotal: 146,
     procurementTotal: 6300,
     unitPrice: 550000,
     totalAmount: 1155000000,
     monthlyData: [
       { month: 'Jan', adjustedDemand: 180, inventoryFulfillment: 15, contractFulfillment: 10, stockTransfer: 5, netProcurement: 145, unitPrice: 550000, totalAmount: 79750000 },
       { month: 'Feb', adjustedDemand: 190, inventoryFulfillment: 15, contractFulfillment: 10, stockTransfer: 5, netProcurement: 155, unitPrice: 550000, totalAmount: 85250000 },
       { month: 'Mar', adjustedDemand: 200, inventoryFulfillment: 15, contractFulfillment: 10, stockTransfer: 5, netProcurement: 165, unitPrice: 550000, totalAmount: 90750000 },
       { month: 'Apr', adjustedDemand: 210, inventoryFulfillment: 15, contractFulfillment: 10, stockTransfer: 5, netProcurement: 175, unitPrice: 550000, totalAmount: 96250000 },
       { month: 'May', adjustedDemand: 220, inventoryFulfillment: 15, contractFulfillment: 10, stockTransfer: 5, netProcurement: 185, unitPrice: 550000, totalAmount: 101750000 },
       { month: 'Jun', adjustedDemand: 230, inventoryFulfillment: 15, contractFulfillment: 10, stockTransfer: 5, netProcurement: 195, unitPrice: 550000, totalAmount: 107250000 },
       { month: 'Jul', adjustedDemand: 240, inventoryFulfillment: 15, contractFulfillment: 10, stockTransfer: 5, netProcurement: 205, unitPrice: 550000, totalAmount: 112750000 },
       { month: 'Aug', adjustedDemand: 250, inventoryFulfillment: 15, contractFulfillment: 10, stockTransfer: 5, netProcurement: 215, unitPrice: 550000, totalAmount: 118250000 },
       { month: 'Sep', adjustedDemand: 230, inventoryFulfillment: 15, contractFulfillment: 10, stockTransfer: 5, netProcurement: 195, unitPrice: 550000, totalAmount: 107250000 },
       { month: 'Oct', adjustedDemand: 240, inventoryFulfillment: 15, contractFulfillment: 10, stockTransfer: 5, netProcurement: 205, unitPrice: 550000, totalAmount: 112750000 },
       { month: 'Nov', adjustedDemand: 260, inventoryFulfillment: 15, contractFulfillment: 10, stockTransfer: 5, netProcurement: 225, unitPrice: 550000, totalAmount: 123750000 },
       { month: 'Dec', adjustedDemand: 270, inventoryFulfillment: 15, contractFulfillment: 10, stockTransfer: 5, netProcurement: 235, unitPrice: 550000, totalAmount: 129250000 }
     ]
   },
   'Filter Udara Kassa': {
     adjustedTotal: 19206,
     inventoryTotal: 5249,
     contractTotal: 2625,
     transferTotal: 132,
     procurementTotal: 11200,
     unitPrice: 280000,
     totalAmount: 868000000,
     monthlyData: [
       { month: 'Jan', adjustedDemand: 265, inventoryFulfillment: 20, contractFulfillment: 10, stockTransfer: 5, netProcurement: 220, unitPrice: 280000, totalAmount: 61600000 },
       { month: 'Feb', adjustedDemand: 275, inventoryFulfillment: 20, contractFulfillment: 10, stockTransfer: 5, netProcurement: 230, unitPrice: 280000, totalAmount: 64400000 },
       { month: 'Mar', adjustedDemand: 285, inventoryFulfillment: 20, contractFulfillment: 10, stockTransfer: 5, netProcurement: 240, unitPrice: 280000, totalAmount: 67200000 },
       { month: 'Apr', adjustedDemand: 295, inventoryFulfillment: 20, contractFulfillment: 10, stockTransfer: 5, netProcurement: 250, unitPrice: 280000, totalAmount: 70000000 },
       { month: 'May', adjustedDemand: 305, inventoryFulfillment: 20, contractFulfillment: 10, stockTransfer: 5, netProcurement: 260, unitPrice: 280000, totalAmount: 72800000 },
       { month: 'Jun', adjustedDemand: 315, inventoryFulfillment: 20, contractFulfillment: 10, stockTransfer: 5, netProcurement: 270, unitPrice: 280000, totalAmount: 75600000 },
       { month: 'Jul', adjustedDemand: 325, inventoryFulfillment: 20, contractFulfillment: 10, stockTransfer: 5, netProcurement: 280, unitPrice: 280000, totalAmount: 78400000 },
       { month: 'Aug', adjustedDemand: 335, inventoryFulfillment: 20, contractFulfillment: 10, stockTransfer: 5, netProcurement: 290, unitPrice: 280000, totalAmount: 81200000 },
       { month: 'Sep', adjustedDemand: 315, inventoryFulfillment: 20, contractFulfillment: 10, stockTransfer: 5, netProcurement: 270, unitPrice: 280000, totalAmount: 75600000 },
       { month: 'Oct', adjustedDemand: 325, inventoryFulfillment: 20, contractFulfillment: 10, stockTransfer: 5, netProcurement: 280, unitPrice: 280000, totalAmount: 78400000 },
       { month: 'Nov', adjustedDemand: 345, inventoryFulfillment: 20, contractFulfillment: 10, stockTransfer: 5, netProcurement: 300, unitPrice: 280000, totalAmount: 84000000 },
       { month: 'Dec', adjustedDemand: 355, inventoryFulfillment: 20, contractFulfillment: 10, stockTransfer: 5, netProcurement: 310, unitPrice: 280000, totalAmount: 86800000 }
     ]
   }
 }), []);

  const currentMaterialData = materialNettingData[selectedMaterial];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleStartNetting = () => {
    setIsProcessing(true);
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsProcessing(false);
            setHasProcessed(true);
          }, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleExportTable = (tableName: string) => {
    let csvContent = '';
    let data: any[] = [];

    switch (tableName) {
      case 'inventory':
        csvContent = [
          ['Month', 'Adjusted Demand', 'Inventory Fulfillment', 'Percentage'].join(','),
          ...currentMaterialData.monthlyData.map(row =>
            [row.month, row.adjustedDemand, row.inventoryFulfillment, ((row.inventoryFulfillment / row.adjustedDemand) * 100).toFixed(1) + '%'].join(',')
          )
        ].join('\n');
        break;
      case 'contract':
        csvContent = [
          ['Month', 'Adjusted Demand', 'Contract Fulfillment', 'Percentage'].join(','),
          ...currentMaterialData.monthlyData.map(row =>
            [row.month, row.adjustedDemand, row.contractFulfillment, ((row.contractFulfillment / row.adjustedDemand) * 100).toFixed(1) + '%'].join(',')
          )
        ].join('\n');
        break;
      case 'transfer':
        csvContent = [
          ['Month', 'Adjusted Demand', 'Stock Transfer', 'Percentage'].join(','),
          ...currentMaterialData.monthlyData.map(row =>
            [row.month, row.adjustedDemand, row.stockTransfer, ((row.stockTransfer / row.adjustedDemand) * 100).toFixed(1) + '%'].join(',')
          )
        ].join('\n');
        break;
      case 'procurement':
        csvContent = [
          ['Month', 'Adjusted Demand', 'Inventory', 'Contract', 'Transfer', 'Net Procurement'].join(','),
          ...currentMaterialData.monthlyData.map(row =>
            [row.month, row.adjustedDemand, row.inventoryFulfillment, row.contractFulfillment, row.stockTransfer, row.netProcurement].join(',')
          )
        ].join('\n');
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${tableName}_${selectedMaterial}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Scale className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Demand Netting (Stage 4)
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered demand netting process that automatically allocates demand across inventory, long-term contracts, and stock transfers to determine final procurement requirements.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
              setHasProcessed(false);
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setHasProcessed(false);
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              setHasProcessed(false);
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {materials.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>AI Netting Process</span>
            </h3>
          </div>
          <button
            onClick={handleStartNetting}
            disabled={isProcessing || hasProcessed}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center space-x-2 font-semibold shadow-lg"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Processing...</span>
              </>
            ) : hasProcessed ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span>Netting Complete</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Start AI Netting</span>
              </>
            )}
          </button>
          {isProcessing && (
            <div className="mt-4 space-y-2">
              {processingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 text-sm transition-all duration-300 ${
                    index <= currentStep ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-600'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  ) : index === currentStep ? (
                    <div className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full flex-shrink-0"></div>
                  ) : (
                    <div className="h-4 w-4 border-2 border-gray-300 dark:border-gray-600 rounded-full flex-shrink-0"></div>
                  )}
                  <span>{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {hasProcessed && (
        <>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Netting Summary - {selectedMaterial}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-600 dark:text-blue-400 uppercase mb-1">Adjusted Demand</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {currentMaterialData.adjustedTotal.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-xs text-green-600 dark:text-green-400 uppercase mb-1">From Inventory</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {currentMaterialData.inventoryTotal.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-xs text-purple-600 dark:text-purple-400 uppercase mb-1">From Contracts</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {currentMaterialData.contractTotal.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-600 dark:text-amber-400 uppercase mb-1">From Transfers</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {currentMaterialData.transferTotal.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <p className="text-xs text-indigo-600 dark:text-indigo-400 uppercase mb-1">Net Procurement</p>
                <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                  {currentMaterialData.procurementTotal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    1. Inventory Fulfillment
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Demand covered by existing inventory
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleExportTable('inventory')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2 font-semibold text-sm"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 dark:text-white uppercase">Month</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 dark:text-white uppercase">Adjusted Demand (Qty)</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 dark:text-white uppercase">Inventory Fulfillment (Qty)</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 dark:text-white uppercase">Fulfillment Amount</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 dark:text-white uppercase">Coverage %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {currentMaterialData.monthlyData.map((row, index) => {
                    const inventoryAmount = row.inventoryFulfillment * row.unitPrice;
                    return (
                      <tr key={index} className="hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.month}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">{row.adjustedDemand.toLocaleString()} units</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-green-700 dark:text-green-400">{row.inventoryFulfillment.toLocaleString()} units</td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-green-700 dark:text-green-400">{formatCurrency(inventoryAmount)}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-green-700 dark:text-green-400">
                          {((row.inventoryFulfillment / row.adjustedDemand) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-green-100 dark:bg-green-900/30 font-bold">
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white uppercase">Total</td>
                    <td className="px-4 py-4 text-sm text-right text-gray-900 dark:text-white">{currentMaterialData.adjustedTotal.toLocaleString()} units</td>
                    <td className="px-4 py-4 text-sm text-right text-green-700 dark:text-green-300">{currentMaterialData.inventoryTotal.toLocaleString()} units</td>
                    <td className="px-4 py-4 text-sm text-right font-bold text-green-700 dark:text-green-300">{formatCurrency(currentMaterialData.inventoryTotal * currentMaterialData.unitPrice)}</td>
                    <td className="px-4 py-4 text-sm text-right text-green-700 dark:text-green-300">
                      {((currentMaterialData.inventoryTotal / currentMaterialData.adjustedTotal) * 100).toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    2. Long-term Contract Fulfillment
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Demand covered by existing contracts
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleExportTable('contract')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2 font-semibold text-sm"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 dark:text-white uppercase">Month</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 dark:text-white uppercase">Adjusted Demand (Qty)</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 dark:text-white uppercase">Contract Fulfillment (Qty)</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 dark:text-white uppercase">Contract Amount</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 dark:text-white uppercase">Coverage %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {currentMaterialData.monthlyData.map((row, index) => {
                    const contractAmount = row.contractFulfillment * row.unitPrice;
                    return (
                      <tr key={index} className="hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.month}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">{row.adjustedDemand.toLocaleString()} units</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-purple-700 dark:text-purple-400">{row.contractFulfillment.toLocaleString()} units</td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-purple-700 dark:text-purple-400">{formatCurrency(contractAmount)}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-purple-700 dark:text-purple-400">
                          {((row.contractFulfillment / row.adjustedDemand) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-purple-100 dark:bg-purple-900/30 font-bold">
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white uppercase">Total</td>
                    <td className="px-4 py-4 text-sm text-right text-gray-900 dark:text-white">{currentMaterialData.adjustedTotal.toLocaleString()} units</td>
                    <td className="px-4 py-4 text-sm text-right text-purple-700 dark:text-purple-300">{currentMaterialData.contractTotal.toLocaleString()} units</td>
                    <td className="px-4 py-4 text-sm text-right font-bold text-purple-700 dark:text-purple-300">{formatCurrency(currentMaterialData.contractTotal * currentMaterialData.unitPrice)}</td>
                    <td className="px-4 py-4 text-sm text-right text-purple-700 dark:text-purple-300">
                      {((currentMaterialData.contractTotal / currentMaterialData.adjustedTotal) * 100).toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    3. Stock Transfer Fulfillment
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Demand covered by inter-plant transfers
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleExportTable('transfer')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center space-x-2 font-semibold text-sm"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 dark:text-white uppercase">Month</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 dark:text-white uppercase">Adjusted Demand (Qty)</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 dark:text-white uppercase">Stock Transfer (Qty)</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 dark:text-white uppercase">Transfer Amount</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 dark:text-white uppercase">Coverage %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {currentMaterialData.monthlyData.map((row, index) => {
                    const transferAmount = row.stockTransfer * row.unitPrice;
                    return (
                      <tr key={index} className="hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.month}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">{row.adjustedDemand.toLocaleString()} units</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-amber-700 dark:text-amber-400">{row.stockTransfer.toLocaleString()} units</td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-amber-700 dark:text-amber-400">{formatCurrency(transferAmount)}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-amber-700 dark:text-amber-400">
                          {((row.stockTransfer / row.adjustedDemand) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-amber-100 dark:bg-amber-900/30 font-bold">
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white uppercase">Total</td>
                    <td className="px-4 py-4 text-sm text-right text-gray-900 dark:text-white">{currentMaterialData.adjustedTotal.toLocaleString()} units</td>
                    <td className="px-4 py-4 text-sm text-right text-amber-700 dark:text-amber-300">{currentMaterialData.transferTotal.toLocaleString()} units</td>
                    <td className="px-4 py-4 text-sm text-right font-bold text-amber-700 dark:text-amber-300">{formatCurrency(currentMaterialData.transferTotal * currentMaterialData.unitPrice)}</td>
                    <td className="px-4 py-4 text-sm text-right text-amber-700 dark:text-amber-300">
                      {((currentMaterialData.transferTotal / currentMaterialData.adjustedTotal) * 100).toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border-2 border-indigo-300 dark:border-indigo-700 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    4. Final Procurement Request
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Net procurement requirements after netting
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleExportTable('procurement')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-2 font-semibold shadow-lg"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl border-2 border-indigo-300 dark:border-indigo-700 shadow-lg">
              <table className="w-full">
                <thead className="bg-indigo-100 dark:bg-indigo-900/40 border-b-2 border-indigo-300 dark:border-indigo-700">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase">Month</th>
                    <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Adjusted Demand</th>
                    <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Inventory</th>
                    <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Contract</th>
                    <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Transfer</th>
                    <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Net Procurement</th>
                    <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Unit Price</th>
                    <th className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {currentMaterialData.monthlyData.map((row, index) => (
                    <tr key={index} className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white">{row.month}</td>
                      <td className="px-4 py-4 text-sm text-right text-gray-600 dark:text-gray-400">{row.adjustedDemand.toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm text-right text-green-600 dark:text-green-400">-{row.inventoryFulfillment.toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm text-right text-purple-600 dark:text-purple-400">-{row.contractFulfillment.toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm text-right text-amber-600 dark:text-amber-400">-{row.stockTransfer.toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm text-right font-bold text-blue-700 dark:text-blue-400">{row.netProcurement.toLocaleString()} units</td>
                      <td className="px-4 py-4 text-sm text-right text-gray-600 dark:text-gray-400">{formatCurrency(row.unitPrice)}</td>
                      <td className="px-4 py-4 text-sm text-right font-bold text-green-700 dark:text-green-400 text-lg">{formatCurrency(row.totalAmount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-indigo-100 dark:bg-indigo-900/40 font-bold border-t-2 border-indigo-300 dark:border-indigo-700">
                    <td className="px-4 py-5 text-base text-gray-900 dark:text-white uppercase">Annual Total</td>
                    <td className="px-4 py-5 text-sm text-right text-gray-900 dark:text-white">{currentMaterialData.adjustedTotal.toLocaleString()}</td>
                    <td className="px-4 py-5 text-sm text-right text-green-700 dark:text-green-300">-{currentMaterialData.inventoryTotal.toLocaleString()}</td>
                    <td className="px-4 py-5 text-sm text-right text-purple-700 dark:text-purple-300">-{currentMaterialData.contractTotal.toLocaleString()}</td>
                    <td className="px-4 py-5 text-sm text-right text-amber-700 dark:text-amber-300">-{currentMaterialData.transferTotal.toLocaleString()}</td>
                    <td className="px-4 py-5 text-base text-right text-blue-700 dark:text-blue-300 font-bold">{currentMaterialData.procurementTotal.toLocaleString()} units</td>
                    <td className="px-4 py-5 text-sm text-right text-gray-600 dark:text-gray-400 font-semibold">Avg: {formatCurrency(currentMaterialData.unitPrice)}</td>
                    <td className="px-4 py-5 text-base text-right text-green-700 dark:text-green-300 text-xl font-extrabold">{formatCurrency(currentMaterialData.totalAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Netting Complete</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Final procurement requirements have been calculated. Total net procurement needed: <span className="font-bold text-indigo-700 dark:text-indigo-400">{currentMaterialData.procurementTotal.toLocaleString()} units</span>. This represents {((currentMaterialData.procurementTotal / currentMaterialData.adjustedTotal) * 100).toFixed(1)}% of adjusted demand after netting against available resources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DPKDemandNetting;
