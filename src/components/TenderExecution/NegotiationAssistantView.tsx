import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';
import { EvaluationData } from '../../types/tenderAnalytics';

interface NegotiationAssistantViewProps {
  evaluationData: EvaluationData;
}

const NegotiationAssistantView: React.FC<NegotiationAssistantViewProps> = ({ evaluationData }) => {
  const chartData = evaluationData.negotiationData.map((item, index) => {
    let cumulativePercentage = 0;
    for (let i = 0; i <= index; i++) {
      cumulativePercentage += evaluationData.negotiationData[i].savingsPercentage;
    }
    return {
      name: item.component,
      'Potential Savings': item.potentialSavings,
      '% Savings (Cumulative)': cumulativePercentage,
    };
  });

  const formatNumber = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('%') ? `${entry.value.toFixed(2)}%` : formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text x={x + width / 2} y={y - 5} fill="#374151" textAnchor="middle" fontSize={11} fontWeight="600">
        {formatNumber(value)}
      </text>
    );
  };

  const CustomLineLabel = (props: any) => {
    const { x, y, value } = props;
    return (
      <text x={x} y={y - 10} fill="#f97316" textAnchor="middle" fontSize={11} fontWeight="600">
        {value.toFixed(2)}%
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
        Distribution Transformer - 20kV/400V DYN5
      </h3>

      <ResponsiveContainer width="100%" height={450}>
        <ComposedChart data={chartData} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
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
            yAxisId="left"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => value.toLocaleString()}
            label={{ value: 'Potential Savings', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 12 } }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => `${value}%`}
            label={{ value: '% Savings (Cumulative)', angle: 90, position: 'insideRight', style: { fill: '#6b7280', fontSize: 12 } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            formatter={(value) => <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>}
          />
          <Bar
            yAxisId="left"
            dataKey="Potential Savings"
            fill="#0d9488"
            radius={[4, 4, 0, 0]}
            label={<CustomLabel />}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="% Savings (Cumulative)"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ fill: '#f97316', r: 5 }}
            label={<CustomLineLabel />}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                COST COMPONENT
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                ESTIMATED
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                CHERRY PICK
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                NEGOTIATION OPPORTUNITY
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                SCHNEIDER ELECTRIC
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                POTENTIAL SAVINGS
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                % SAVINGS
              </th>
            </tr>
          </thead>
          <tbody>
            {evaluationData.negotiationData.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                  {item.component}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm text-gray-700 dark:text-gray-300">
                  {formatNumber(item.estimated)}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm text-gray-700 dark:text-gray-300">
                  {formatNumber(item.cherryPick)}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(item.negotiationOpportunity)}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm text-gray-700 dark:text-gray-300">
                  {formatNumber(item.supplierPrice)}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold text-teal-700 dark:text-teal-400">
                  {formatNumber(item.potentialSavings)}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold text-teal-700 dark:text-teal-400">
                  {item.savingsPercentage.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-teal-50 dark:bg-teal-900/10 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-teal-800 dark:text-teal-300 space-y-2">
            <p>
              <span className="font-semibold">• Cherry pick value</span> is the lowest quoted price from all supplier
            </p>
            <p>
              <span className="font-semibold">• Negotiation opportunity value</span> is the lowest value between estimated price and cherry pick
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegotiationAssistantView;
