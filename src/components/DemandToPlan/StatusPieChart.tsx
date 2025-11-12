import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Info } from 'lucide-react';

interface StatusPieChartProps {
  submittedUnits: number;
  notSubmittedUnits: number;
  submissionPercentage: number;
}

const StatusPieChart: React.FC<StatusPieChartProps> = ({
  submittedUnits,
  notSubmittedUnits,
  submissionPercentage
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
  const data = [
    { name: 'Submitted', value: submittedUnits },
    { name: 'Not Submitted', value: notSubmittedUnits }
  ];

  const COLORS = ['#10b981', '#ef4444'];
  const HOVER_COLORS = ['#059669', '#dc2626'];

  const renderCustomLabel = (entry: any) => {
    if (entry.value === 0) return '';
    const percent = ((entry.value / (submittedUnits + notSubmittedUnits)) * 100).toFixed(1);
    return `${percent}%`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-900 dark:bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold text-sm mb-1">{data.name}</p>
          <p className="text-lg font-bold">{data.value} units</p>
          <p className="text-xs text-gray-300 mt-1">
            {((data.value / (submittedUnits + notSubmittedUnits)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              DPK Submission Status
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Units that have submitted DPK
            </p>
          </div>
          <div className="group relative">
            <Info className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
            <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <p className="font-semibold mb-1">DPK Submission Tracking</p>
              <p>This chart shows the current submission rate of Daftar Permintaan Kebutuhan (DPK) across all active organizational units for the fiscal year.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {submissionPercentage.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {submittedUnits} of {submittedUnits + notSubmittedUnits} units
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {submittedUnits} Submitted
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {notSubmittedUnits} Pending
            </span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={(_, index) => setHoveredSlice(data[index].name)}
            onMouseLeave={() => setHoveredSlice(null)}
            style={{ cursor: 'pointer' }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={hoveredSlice === entry.name ? HOVER_COLORS[index % HOVER_COLORS.length] : COLORS[index % COLORS.length]}
                style={{ transition: 'fill 0.3s ease' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusPieChart;
