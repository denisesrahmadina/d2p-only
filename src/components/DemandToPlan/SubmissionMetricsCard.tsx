import React, { useState } from 'react';
import { FileText, CheckCircle, Info, TrendingUp, Minus } from 'lucide-react';

interface SubmissionMetricsCardProps {
  title: string;
  submittedUnits: number;
  totalUnits: number;
  submissionPercentage: number;
  type: 'PR' | 'STR';
}

const SubmissionMetricsCard: React.FC<SubmissionMetricsCardProps> = ({
  title,
  submittedUnits,
  totalUnits,
  submissionPercentage,
  type
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const getColor = () => {
    if (submissionPercentage >= 80) return 'text-green-600 dark:text-green-400';
    if (submissionPercentage >= 60) return 'text-blue-600 dark:text-blue-400';
    if (submissionPercentage >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getBgColor = () => {
    if (submissionPercentage >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (submissionPercentage >= 60) return 'bg-blue-100 dark:bg-blue-900/20';
    if (submissionPercentage >= 40) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const getProgressBarColor = () => {
    if (submissionPercentage >= 80) return 'bg-green-600';
    if (submissionPercentage >= 60) return 'bg-blue-600';
    if (submissionPercentage >= 40) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getStatusIcon = () => {
    if (submissionPercentage >= 80) return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getStatusText = () => {
    if (submissionPercentage >= 80) return 'Excellent';
    if (submissionPercentage >= 60) return 'Good';
    if (submissionPercentage >= 40) return 'Fair';
    return 'Needs Attention';
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 ${getBgColor()} rounded-lg`}>
            {type === 'PR' ? (
              <FileText className={`h-6 w-6 ${getColor()}`} />
            ) : (
              <CheckCircle className={`h-6 w-6 ${getColor()}`} />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </h3>
              <div className="relative">
                <Info
                  className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
                {showTooltip && (
                  <div className="absolute left-0 top-full mt-1 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-20">
                    {type === 'PR' ? 'Procurement Request submission status' : 'Stock Transfer Request submission status'}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {submissionPercentage.toFixed(1)}%
              </p>
              {getStatusIcon()}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Status: <span className={`font-semibold ${getColor()}`}>{getStatusText()}</span></span>
          <span>{submittedUnits}/{totalUnits}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full ${getProgressBarColor()} transition-all duration-500 relative overflow-hidden`}
            style={{ width: `${submissionPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${getProgressBarColor()}`}></div>
            <span className="text-gray-600 dark:text-gray-400">
              {submittedUnits} submitted
            </span>
          </div>
          <span className={`font-medium ${getColor()}`}>
            {totalUnits - submittedUnits} pending
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubmissionMetricsCard;
