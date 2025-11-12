import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Info } from 'lucide-react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DPKService } from '../../services/dpkService';

const BudgetComparisonCard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await DPKService.getYearOverYearBudget();
      setData(result);
    } catch (err: any) {
      console.error('Error loading budget data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-800 p-6">
        <p className="text-red-600 dark:text-red-400 text-sm">{error || 'No data available'}</p>
      </div>
    );
  }

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const chartData = quarters.map(quarter => {
    const lastYearQuarter = data.lastYear.quarters.find((q: any) => q.quarter === quarter);
    const currentYearQuarter = data.currentYear.quarters.find((q: any) => q.quarter === quarter);

    return {
      quarter,
      [data.lastYear.year]: lastYearQuarter ? lastYearQuarter.budget / 1000000000 : 0,
      [data.currentYear.year]: currentYearQuarter ? currentYearQuarter.budget / 1000000000 : 0
    };
  });

  const isPositiveChange = data.change.amount >= 0;
  const changePercentage = Math.abs(data.change.percentage);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: IDR {entry.value.toFixed(1)}B
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isPositiveChange
              ? 'bg-emerald-100 dark:bg-emerald-900/20'
              : 'bg-orange-100 dark:bg-orange-900/20'
          }`}>
            <DollarSign className={`h-6 w-6 ${
              isPositiveChange
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-orange-600 dark:text-orange-400'
            }`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Annual Budget
              </h3>
              <div className="relative">
                <Info
                  className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
                {showTooltip && (
                  <div className="absolute left-0 top-full mt-1 w-56 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-20">
                    Budget allocation comparing current vs previous fiscal year
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(data.currentYear.total)}
              </p>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                isPositiveChange
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
              }`}>
                {isPositiveChange ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{isPositiveChange ? '+' : ''}{changePercentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis
              dataKey="quarter"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '11px' }}
              tick={{ fill: '#6b7280' }}
              label={{ value: 'Billion IDR', angle: -90, position: 'insideLeft', style: { fontSize: '10px', fill: '#6b7280' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Bar
              dataKey={data.lastYear.year}
              fill="#60A5FA"
              radius={[4, 4, 0, 0]}
              name={`${data.lastYear.year}`}
            />
            <Bar
              dataKey={data.currentYear.year}
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              name={`${data.currentYear.year}`}
            />
            <Line
              type="monotone"
              dataKey={data.currentYear.year}
              stroke="#059669"
              strokeWidth={2}
              dot={{ fill: '#059669', r: 4 }}
              name={`${data.currentYear.year} Trend`}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Previous Year ({data.lastYear.year})</p>
            <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{formatCurrency(data.lastYear.total)}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Current Year ({data.currentYear.year})</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(data.currentYear.total)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetComparisonCard;
