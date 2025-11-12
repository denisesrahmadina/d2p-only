import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EvaluationData } from '../../types/tenderAnalytics';

interface BidComparisonViewProps {
  evaluationData: EvaluationData;
  tenderData: any;
}

const BidComparisonView: React.FC<BidComparisonViewProps> = ({ evaluationData, tenderData }) => {
  const chartData = [
    {
      name: 'Estimated',
      Accessories: tenderData.estimatedCostBreakdown.accessories,
      Oil: tenderData.estimatedCostBreakdown.oil,
      Insulation: tenderData.estimatedCostBreakdown.insulation,
      Casing: tenderData.estimatedCostBreakdown.casing,
      'Coil - Primary': tenderData.estimatedCostBreakdown.coilPrimary,
      'Coil - Secondary': tenderData.estimatedCostBreakdown.coilSecondary,
      Core: tenderData.estimatedCostBreakdown.core,
      total: tenderData.estimatedPrice,
    },
    ...tenderData.bidders.map((bidder: any) => ({
      name: bidder.name,
      Accessories: bidder.costBreakdown.accessories,
      Oil: bidder.costBreakdown.oil,
      Insulation: bidder.costBreakdown.insulation,
      Casing: bidder.costBreakdown.casing,
      'Coil - Primary': bidder.costBreakdown.coilPrimary,
      'Coil - Secondary': bidder.costBreakdown.coilSecondary,
      Core: bidder.costBreakdown.core,
      total: bidder.quotedPrice,
    })),
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
        Distribution Transformer - 20kV/400V DYN5
      </h3>

      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={chartData} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="Accessories" stackId="a" fill="#0f766e" />
          <Bar dataKey="Oil" stackId="a" fill="#14b8a6" />
          <Bar dataKey="Insulation" stackId="a" fill="#5eead4" />
          <Bar dataKey="Casing" stackId="a" fill="#fbbf24" />
          <Bar dataKey="Coil - Primary" stackId="a" fill="#f59e0b" />
          <Bar dataKey="Coil - Secondary" stackId="a" fill="#f97316" />
          <Bar dataKey="Core" stackId="a" fill="#dc2626" />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#0f766e]"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Accessories</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#14b8a6]"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Oil</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#5eead4]"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Insulation</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#fbbf24]"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Casing</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Coil - Primary</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Coil - Secondary</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#dc2626]"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Core</span>
        </div>
      </div>
    </div>
  );
};

export default BidComparisonView;
