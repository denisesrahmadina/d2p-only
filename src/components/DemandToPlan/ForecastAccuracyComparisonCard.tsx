import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { DPKService } from '../../services/dpkService';

const ForecastAccuracyComparisonCard: React.FC = () => {
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
      const result = await DPKService.getYearOverYearForecastAccuracy();
      setData(result);
    } catch (err: any) {
      console.error('Error loading forecast accuracy data:', err);
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

  const chartData = [
    {
      year: data.lastYear.year.toString(),
      accuracy: data.lastYear.accuracy,
      label: `${data.lastYear.year}`
    },
    {
      year: data.currentYear.year.toString(),
      accuracy: data.currentYear.accuracy,
      label: `${data.currentYear.year}`
    }
  ];

  const isPositiveChange = data.change.accuracy >= 0;
  const changePercentage = Math.abs(data.change.accuracy);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">
            Year {payload[0].payload.label}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Forecast Accuracy: {payload[0].value.toFixed(1)}%
          </p>
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
              ? 'bg-green-100 dark:bg-green-900/20'
              : 'bg-orange-100 dark:bg-orange-900/20'
          }`}>
            <Target className={`h-6 w-6 ${
              isPositiveChange
                ? 'text-green-600 dark:text-green-400'
                : 'text-orange-600 dark:text-orange-400'
            }`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Forecast Accuracy
              </h3>
              <div className="relative">
                <Info
                  className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
                {showTooltip && (
                  <div className="absolute left-0 top-full mt-1 w-56 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-20">
                    Year-over-year comparison of forecast accuracy performance
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.currentYear.accuracy.toFixed(1)}%
              </p>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                isPositiveChange
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
              }`}>
                {isPositiveChange ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{changePercentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis
              dataKey="label"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#6b7280' }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? '#60A5FA' : '#10B981'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Previous Year ({data.lastYear.year})</p>
            <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{data.lastYear.accuracy.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Current Year ({data.currentYear.year})</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{data.currentYear.accuracy.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastAccuracyComparisonCard;
