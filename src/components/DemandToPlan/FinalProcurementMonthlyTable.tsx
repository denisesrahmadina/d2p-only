import React from 'react';
import { Calendar, TrendingUp, DollarSign, Download } from 'lucide-react';

interface MonthlyProcurementData {
  month: string;
  netProcurement: number;
  unitPrice: number;
  totalAmount: number;
}

interface MaterialProcurementData {
  totalQuantity: number;
  unitPrice: number;
  totalAmount: number;
  monthlyData: MonthlyProcurementData[];
}

interface FinalProcurementMonthlyTableProps {
  materialName: string;
  data: MaterialProcurementData;
}

const FinalProcurementMonthlyTable: React.FC<FinalProcurementMonthlyTableProps> = ({ materialName, data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleExport = () => {
    const csvContent = [
      ['Month', 'Net Procurement (Qty)', 'Unit Price (IDR)', 'Total Amount (IDR)'].join(','),
      ...data.monthlyData.map(row =>
        [row.month, row.netProcurement, row.unitPrice, row.totalAmount].join(',')
      ),
      ['Annual Total', data.totalQuantity, '', data.totalAmount].join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `final_procurement_${materialName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg p-6 border-2 border-emerald-200 dark:border-emerald-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Final Procurement Table - {materialName}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Complete monthly procurement schedule with pricing details
          </p>
        </div>
        <button
          onClick={handleExport}
          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center space-x-2 text-sm font-semibold shadow-lg"
        >
          <Download className="h-3 w-3" />
          <span>Export</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg border border-emerald-200 dark:border-emerald-700 mb-4">
        <table className="w-full">
          <thead className="bg-emerald-100 dark:bg-emerald-900/40 border-b border-emerald-200 dark:border-emerald-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 dark:text-white uppercase">Month</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-900 dark:text-white uppercase">Net Procurement</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-900 dark:text-white uppercase">Unit Price</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-900 dark:text-white uppercase">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {data.monthlyData.map((row, index) => (
              <tr key={index} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{row.month}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-blue-700 dark:text-blue-400">
                  {row.netProcurement.toLocaleString()} {row.netProcurement > 0 ? 'units' : ''}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">{formatCurrency(row.unitPrice)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(row.totalAmount)}
                </td>
              </tr>
            ))}
            <tr className="bg-emerald-100 dark:bg-emerald-900/40 font-bold border-t-2 border-emerald-300 dark:border-emerald-700">
              <td className="px-4 py-4 text-sm text-gray-900 dark:text-white uppercase">Annual Total</td>
              <td className="px-4 py-4 text-sm text-right text-blue-700 dark:text-blue-300">
                {data.totalQuantity.toLocaleString()} units
              </td>
              <td className="px-4 py-4 text-xs text-right text-gray-600 dark:text-gray-400">
                Avg: {formatCurrency(data.unitPrice)}
              </td>
              <td className="px-4 py-4 text-base text-right text-emerald-700 dark:text-emerald-300 font-extrabold">
                {formatCurrency(data.totalAmount)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center space-x-2 mb-1">
            <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs font-semibold text-gray-900 dark:text-white uppercase">Procurement Period</p>
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            12 months (January - December)
          </p>
        </div>
        <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs font-semibold text-gray-900 dark:text-white uppercase">Average Monthly</p>
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            {Math.round(data.totalQuantity / 12).toLocaleString()} units / {formatCurrency(Math.round(data.totalAmount / 12))}
          </p>
        </div>
        <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center space-x-2 mb-1">
            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs font-semibold text-gray-900 dark:text-white uppercase">Unit Price</p>
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            {formatCurrency(data.unitPrice)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinalProcurementMonthlyTable;
