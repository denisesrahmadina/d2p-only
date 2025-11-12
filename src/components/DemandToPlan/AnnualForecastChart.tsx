import React, { useState, useMemo } from 'react';
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
import {
  Download,
  Filter,
  BarChart3,
  LineChart as LineChartIcon,
  Package
} from 'lucide-react';

interface ForecastData {
  month: string;
  materialType: string;
  forecastedQuantity: number;
  actualVsForecast: number;
  revenueProjection: number;
}

const AnnualForecastChart: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Filter');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All Material');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [isLoading, setIsLoading] = useState(false);

  // Category definitions with materials
  const categoryMaterials: Record<string, string[]> = {
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

  // Mock data for power plant materials
  const mockData: ForecastData[] = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const materials = categoryMaterials[selectedCategory] || [];

    const data: ForecastData[] = [];

    materials.forEach(material => {
      months.forEach((month, index) => {
        const baseQuantityMap: Record<string, number> = {
          'Air Filter': 8000,
          'Fuel Filter': 6500,
          'Chemical filter': 3200,
          'Oil filter': 5800,
          'Special filter': 2400,
          'Multi function filter': 4100,
          'Water filter': 5500,
          'Gas filter': 3900
        };
        const baseQuantity = baseQuantityMap[material] || 3000;

        const seasonalFactor = 1 + (Math.sin((index / 12) * Math.PI * 2) * 0.15);
        const randomFactor = 0.9 + Math.random() * 0.2;

        const quantity = Math.round(baseQuantity * seasonalFactor * randomFactor);
        const variance = -15 + Math.random() * 35;
        const unitPriceMap: Record<string, number> = {
          'Air Filter': 850000,
          'Fuel Filter': 1200000,
          'Chemical filter': 2800000,
          'Oil filter': 980000,
          'Special filter': 3500000,
          'Multi function filter': 2100000,
          'Water filter': 1500000,
          'Gas filter': 2200000
        };
        const unitPrice = unitPriceMap[material] || 1000000;

        data.push({
          month,
          materialType: material,
          forecastedQuantity: quantity,
          actualVsForecast: Math.round(variance * 10) / 10,
          revenueProjection: quantity * unitPrice
        });
      });
    });

    return data;
  }, [selectedCategory]);

  // Filter data based on selected material
  const filteredData = useMemo(() => {
    if (selectedMaterial === 'All Material') {
      return mockData;
    }
    return mockData.filter(item => item.materialType === selectedMaterial);
  }, [mockData, selectedMaterial]);

  // Aggregate data for chart with historical comparisons
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (selectedMaterial === 'All Material') {
      return months.map(month => {
        const monthData = mockData.filter(item => item.month === month);
        const totalQuantity = monthData.reduce((sum, item) => sum + item.forecastedQuantity, 0);
        const totalRevenue = monthData.reduce((sum, item) => sum + item.revenueProjection, 0);
        const avgVariance = monthData.length > 0
          ? monthData.reduce((sum, item) => sum + item.actualVsForecast, 0) / monthData.length
          : 0;

        // Generate historical data (actual consumption) with variance from forecast
        const actual1YearAgo = Math.round(totalQuantity * (0.95 + Math.random() * 0.1));
        const actual2YearsAgo = Math.round(totalQuantity * (0.95 + Math.random() * 0.1));
        const actual3YearsAgo = Math.round(totalQuantity * (0.95 + Math.random() * 0.1));

        return {
          month,
          quantity: totalQuantity,
          actual1YearAgo,
          actual2YearsAgo,
          actual3YearsAgo,
          revenue: totalRevenue,
          variance: Math.round(avgVariance * 10) / 10
        };
      });
    } else {
      return filteredData.map(item => {
        // Generate historical data (actual consumption) with variance from forecast
        const actual1YearAgo = Math.round(item.forecastedQuantity * (0.95 + Math.random() * 0.1));
        const actual2YearsAgo = Math.round(item.forecastedQuantity * (0.95 + Math.random() * 0.1));
        const actual3YearsAgo = Math.round(item.forecastedQuantity * (0.95 + Math.random() * 0.1));

        return {
          month: item.month,
          quantity: item.forecastedQuantity,
          actual1YearAgo,
          actual2YearsAgo,
          actual3YearsAgo,
          revenue: item.revenueProjection,
          variance: item.actualVsForecast
        };
      });
    }
  }, [mockData, filteredData, selectedMaterial]);

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalQuantity = chartData.reduce((sum, item) => sum + item.quantity, 0);
    const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

    return {
      totalQuantity,
      totalRevenue,
      confidenceLevel: 96
    };
  }, [chartData]);

  // Get material types for current category
  const materialTypes = useMemo(() => {
    const materials = categoryMaterials[selectedCategory] || [];
    if (materials.length === 0) {
      return ['No filter material'];
    }
    return ['All Material', ...materials];
  }, [selectedCategory]);

  const categories = ['Filter', 'Fuel and Combustion', 'Mechanical Equipment', 'Spare Part and Maintenance', 'Water Treatment System'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const handleExport = (type: 'chart' | 'table') => {
    setIsLoading(true);
    setTimeout(() => {
      if (type === 'chart') {
        const csvContent = [
          ['Month', 'Forecasted Demand', 'Actual 1Y Ago', 'Actual 2Y Ago', 'Actual 3Y Ago', 'Revenue (IDR)', 'Variance (%)'].join(','),
          ...chartData.map(row =>
            [row.month, row.quantity, row.actual1YearAgo, row.actual2YearsAgo, row.actual3YearsAgo, row.revenue, row.variance].join(',')
          )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `forecast-chart-${selectedMaterial.replace(/\s+/g, '-')}.csv`;
        link.click();
      } else {
        const csvContent = [
          ['Month', 'Material Type', 'Forecasted Quantity', 'Actual vs Forecast (%)', 'Revenue Projection (IDR)'].join(','),
          ...filteredData.map(row =>
            [row.month, row.materialType, row.forecastedQuantity, row.actualVsForecast, row.revenueProjection].join(',')
          )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `forecast-table-${selectedMaterial.replace(/\s+/g, '-')}.csv`;
        link.click();
      }
      setIsLoading(false);
    }, 500);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-accenture-gray-dark border border-gray-200 dark:border-accenture-gray-medium rounded-lg shadow-lg p-4">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
              <span style={{ color: entry.color }}>{entry.name}: </span>
              {entry.dataKey === 'revenue'
                ? formatCurrency(entry.value)
                : entry.dataKey === 'variance'
                ? `${entry.value}%`
                : formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <div className="bg-white dark:bg-accenture-gray-dark rounded-2xl border border-gray-200 dark:border-accenture-gray-medium shadow-xl overflow-hidden">
        {/* Chart Header */}
        <div className="bg-gradient-to-r from-accenture-purple/10 via-accenture-azure/10 to-accenture-purple/10 dark:from-accenture-purple/20 dark:via-accenture-azure/20 dark:to-accenture-purple/20 border-b border-gray-200 dark:border-accenture-gray-medium px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Annual Forecast Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly forecast trends and projections</p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Chart Type Toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-accenture-gray-medium rounded-lg p-1">
                <button
                  onClick={() => setChartType('line')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    chartType === 'line'
                      ? 'bg-white dark:bg-accenture-gray-dark shadow-md text-accenture-purple'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <LineChartIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    chartType === 'bar'
                      ? 'bg-white dark:bg-accenture-gray-dark shadow-md text-accenture-purple'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedMaterial('All Material');
                  }}
                  className="bg-white dark:bg-accenture-gray-medium border border-gray-300 dark:border-accenture-gray-dark rounded-lg px-4 py-2 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accenture-purple"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Export Button */}
              <button
                onClick={() => handleExport('chart')}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-accenture-purple to-accenture-azure hover:from-accenture-purple-dark hover:to-accenture-azure-dark text-white rounded-lg transition-all duration-200 text-sm font-semibold disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chart Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accenture-purple"></div>
            </div>
          ) : mockData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">No data available</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                {selectedCategory === 'Filter'
                  ? 'Select a material type to view forecast data'
                  : 'No filter materials available for this category'}
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              {chartType === 'line' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="quantity"
                    stroke="#A100FF"
                    strokeWidth={3}
                    name="Forecasted Demand"
                    dot={{ fill: '#A100FF', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual1YearAgo"
                    stroke="#0ABFBC"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Actual Consumption 1 Year Ago"
                    dot={{ fill: '#0ABFBC', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual2YearsAgo"
                    stroke="#FF6B35"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Actual Consumption 2 Years Ago"
                    dot={{ fill: '#FF6B35', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual3YearsAgo"
                    stroke="#4ECDC4"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Actual Consumption 3 Years Ago"
                    dot={{ fill: '#4ECDC4', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar
                    dataKey="quantity"
                    fill="#A100FF"
                    name="Forecasted Demand"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="actual1YearAgo"
                    fill="#0ABFBC"
                    name="Actual Consumption 1 Year Ago"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="actual2YearsAgo"
                    fill="#FF6B35"
                    name="Actual Consumption 2 Years Ago"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="actual3YearsAgo"
                    fill="#4ECDC4"
                    name="Actual Consumption 3 Years Ago"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-accenture-gray-dark rounded-2xl border border-gray-200 dark:border-accenture-gray-medium shadow-xl overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-accenture-purple/10 via-accenture-azure/10 to-accenture-purple/10 dark:from-accenture-purple/20 dark:via-accenture-azure/20 dark:to-accenture-purple/20 border-b border-gray-200 dark:border-accenture-gray-medium px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detailed Forecast Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedMaterial === 'All Material'
                  ? `Showing all materials in ${selectedCategory}`
                  : `Filtered by: ${selectedMaterial}`}
              </p>
            </div>
            <button
              onClick={() => handleExport('table')}
              disabled={isLoading || filteredData.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-accenture-purple to-accenture-azure hover:from-accenture-purple-dark hover:to-accenture-azure-dark text-white rounded-lg transition-all duration-200 text-sm font-semibold disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>Export Table</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">No data available</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                No materials available for the selected category
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-accenture-gray-medium border-b border-gray-200 dark:border-accenture-gray-dark">
                <tr>
                  <th className="px-2 py-1.5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Month
                  </th>
                  <th className="px-2 py-1.5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Material
                  </th>
                  <th className="px-2 py-1.5 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Qty
                  </th>
                  <th className="px-2 py-1.5 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-accenture-gray-medium">
                {filteredData.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-accenture-gray-medium/50 transition-colors"
                  >
                    <td className="px-2 py-1.5 text-xs font-medium text-gray-900 dark:text-white">
                      {row.month}
                    </td>
                    <td className="px-2 py-1.5 text-xs text-gray-700 dark:text-gray-300">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-accenture-purple/10 text-accenture-purple dark:bg-accenture-purple/20 dark:text-accenture-purple-light">
                        {row.materialType}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-xs text-right text-gray-900 dark:text-white font-medium">
                      {formatNumber(row.forecastedQuantity)}
                    </td>
                    <td className="px-2 py-1.5 text-xs text-right text-gray-900 dark:text-white font-medium">
                      {formatCurrency(row.revenueProjection)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-accenture-purple/5 dark:bg-accenture-purple/10 border-t-2 border-accenture-purple/30">
                <tr>
                  <td colSpan={2} className="px-2 py-2 text-xs font-bold text-gray-900 dark:text-white uppercase">
                    Total
                  </td>
                  <td className="px-2 py-2 text-xs text-right font-bold text-gray-900 dark:text-white">
                    {formatNumber(filteredData.reduce((sum, row) => sum + row.forecastedQuantity, 0))}
                  </td>
                  <td className="px-2 py-2 text-xs text-right font-bold text-gray-900 dark:text-white">
                    {formatCurrency(filteredData.reduce((sum, row) => sum + row.revenueProjection, 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};

export default AnnualForecastChart;
