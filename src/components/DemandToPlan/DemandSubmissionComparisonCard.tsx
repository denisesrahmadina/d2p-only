import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Package, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DPKService } from '../../services/dpkService';

const DemandSubmissionComparisonCard: React.FC = () => {
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
      const result = await DPKService.getYearOverYearDemandSubmission();
      setData(result);
    } catch (err: any) {
      console.error('Error loading demand submission data:', err);
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

  const chartData = data.currentYear.materials.map((material: any) => {
    const lastYearMaterial = data.lastYear.materials.find((m: any) => m.type === material.type);
    return {
      material: material.type.length > 15 ? material.type.substring(0, 15) + '...' : material.type,
      fullName: material.type,
      [data.lastYear.year]: lastYearMaterial?.count || 0,
      [data.currentYear.year]: material.count
    };
  });

  const lastYearTotal = data.lastYear.materials.reduce((sum: number, m: any) => sum + m.count, 0);
  const currentYearTotal = data.currentYear.materials.reduce((sum: number, m: any) => sum + m.count, 0);
  const isPositiveChange = data.totalChange >= 0;
  const changePercentage = lastYearTotal > 0 ? Math.abs((data.totalChange / lastYearTotal) * 100) : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const fullName = payload[0]?.payload?.fullName || label;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">{fullName}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} materials
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
              ? 'bg-blue-100 dark:bg-blue-900/20'
              : 'bg-orange-100 dark:bg-orange-900/20'
          }`}>
            <Package className={`h-6 w-6 ${
              isPositiveChange
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-orange-600 dark:text-orange-400'
            }`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Demand Submitted
              </h3>
              <div className="relative">
                <Info
                  className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
                {showTooltip && (
                  <div className="absolute left-0 top-full mt-1 w-56 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-20">
                    Number of materials submitted comparing current vs previous year
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentYearTotal}
              </p>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                isPositiveChange
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
              }`}>
                {isPositiveChange ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{isPositiveChange ? '+' : ''}{Math.abs(data.totalChange)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis
              dataKey="material"
              stroke="#6b7280"
              style={{ fontSize: '10px' }}
              tick={{ fill: '#6b7280' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#6b7280' }}
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
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              name={`${data.currentYear.year}`}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Previous Year ({data.lastYear.year})</p>
            <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{lastYearTotal} materials</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Current Year ({data.currentYear.year})</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{currentYearTotal} materials</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandSubmissionComparisonCard;
