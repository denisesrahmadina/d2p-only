import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EvaluationData } from '../../types/tenderAnalytics';

interface CostComparisonViewProps {
  evaluationData: EvaluationData;
}

const CostComparisonView: React.FC<CostComparisonViewProps> = ({ evaluationData }) => {
  const chartData = evaluationData.costComponents.map(comp => ({
    name: comp.component,
    Estimated: comp.estimated,
    'Schneider Electric': comp.schneiderElectric,
    'General Electric': comp.generalElectric,
    ABB: comp.abb,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
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
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={{ stroke: '#d1d5db' }}
            angle={-15}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="Estimated" fill="#0f766e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Schneider Electric" fill="#14b8a6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="General Electric" fill="#5eead4" radius={[4, 4, 0, 0]} />
          <Bar dataKey="ABB" fill="#fbbf24" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-6 pt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#0f766e]"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Estimated</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#14b8a6]"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Schneider Electric</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#5eead4]"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">General Electric</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#fbbf24]"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">ABB</span>
        </div>
      </div>
    </div>
  );
};

export default CostComparisonView;
