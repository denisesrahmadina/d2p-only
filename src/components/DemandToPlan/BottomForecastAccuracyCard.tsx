import React, { useState } from 'react';
import { TrendingDown, Info, AlertTriangle } from 'lucide-react';

interface ForecastAccuracy {
  unit_id: string;
  unit_name: string;
  accuracy_percentage: number;
}

interface BottomForecastAccuracyCardProps {
  accuracyData: ForecastAccuracy[];
}

const BottomForecastAccuracyCard: React.FC<BottomForecastAccuracyCardProps> = ({ accuracyData }) => {
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null);
  const getAccuracyColor = (percentage: number) => {
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (percentage >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getAccuracyBgColor = (percentage: number) => {
    if (percentage >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    if (percentage >= 50) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
          <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bottom 5 Forecast Accuracy
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Units with lowest forecast accuracy
          </p>
        </div>
        <div className="group relative">
          <Info className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
          <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <p className="font-semibold mb-1">Forecast Accuracy Tracking</p>
            <p>This shows the 5 units with the lowest forecast accuracy rates. These units may require additional attention and planning support to improve their forecasting capabilities.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {accuracyData.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No forecast accuracy data available
          </div>
        ) : (
          accuracyData.map((unit, index) => (
            <div
              key={unit.unit_id}
              className="relative flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredUnit(unit.unit_id)}
              onMouseLeave={() => setHoveredUnit(null)}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-8 h-8 rounded-full ${getAccuracyBgColor(unit.accuracy_percentage)} flex items-center justify-center font-semibold text-sm ${getAccuracyColor(unit.accuracy_percentage)}`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {unit.unit_name}
                    </div>
                    {unit.accuracy_percentage < 50 && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {unit.unit_id}
                  </div>
                  {hoveredUnit === unit.unit_id && (
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            unit.accuracy_percentage >= 70 ? 'bg-yellow-500' :
                            unit.accuracy_percentage >= 50 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${unit.accuracy_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`text-lg font-bold ${getAccuracyColor(unit.accuracy_percentage)}`}>
                  {unit.accuracy_percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BottomForecastAccuracyCard;
