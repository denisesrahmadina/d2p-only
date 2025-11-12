import React from 'react';
import { Factory, ChevronRight, Zap, TrendingUp } from 'lucide-react';

interface UnitCardProps {
  id: string;
  code: string;
  name: string;
  fullName: string;
  progress: number;
  capacity: string;
  onClick: () => void;
  isLoading?: boolean;
}

const UnitCard: React.FC<UnitCardProps> = ({
  code,
  name,
  fullName,
  progress,
  capacity,
  onClick,
  isLoading = false
}) => {
  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'green';
    if (progress > 50) return 'yellow';
    return 'red';
  };

  const getProgressClasses = (progress: number) => {
    if (progress === 100) {
      return {
        border: 'border-green-500 dark:border-green-400',
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-400',
        progressBar: 'bg-green-500',
        progressBg: 'bg-green-100 dark:bg-green-900/30',
        badge: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
      };
    }
    if (progress > 50) {
      return {
        border: 'border-yellow-500 dark:border-yellow-400',
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        text: 'text-yellow-700 dark:text-yellow-400',
        progressBar: 'bg-yellow-500',
        progressBg: 'bg-yellow-100 dark:bg-yellow-900/30',
        badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
      };
    }
    return {
      border: 'border-red-500 dark:border-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-400',
      progressBar: 'bg-red-500',
      progressBg: 'bg-red-100 dark:bg-red-900/30',
      badge: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
    };
  };

  const colorClasses = getProgressClasses(progress);
  const progressColor = getProgressColor(progress);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-accenture-gray-dark rounded-xl border-2 border-gray-200 dark:border-accenture-gray-medium p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`group relative bg-white dark:bg-accenture-gray-dark rounded-xl border-2 ${colorClasses.border} hover:shadow-2xl transition-all duration-300 p-6 text-left w-full overflow-hidden transform hover:scale-105 hover:-translate-y-1`}
    >
      <div className={`absolute inset-0 ${colorClasses.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <div className={`w-10 h-10 rounded-lg ${colorClasses.border} border-2 flex items-center justify-center bg-white dark:bg-accenture-gray-medium shadow-sm`}>
                <Factory className={`h-5 w-5 ${colorClasses.text}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-accenture-purple dark:group-hover:text-accenture-purple-light transition-colors">
                  {name}
                </h3>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
              {fullName}
            </p>
          </div>

          <div className="ml-3 w-8 h-8 bg-gray-100 dark:bg-accenture-gray-medium rounded-full flex items-center justify-center group-hover:bg-accenture-purple group-hover:scale-110 transition-all duration-300 flex-shrink-0">
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-white" />
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400 flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>Capacity</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">{capacity}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Annual Forecast Progress</span>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${colorClasses.badge}`}>
              <TrendingUp className="h-3 w-3" />
              <span className="text-sm font-bold">{progress}%</span>
            </div>
          </div>

          <div className={`relative w-full h-2.5 ${colorClasses.progressBg} rounded-full overflow-hidden shadow-inner`}>
            <div
              className={`absolute top-0 left-0 h-full ${colorClasses.progressBar} rounded-full transition-all duration-500 shadow-sm`}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {progress === 100 ? 'Completed' : progress > 50 ? 'High Progress' : 'Needs Attention'}
          </span>
          <span className="text-xs font-semibold text-accenture-purple dark:text-accenture-purple-light">
            View Details →
          </span>
        </div>
      </div>
    </button>
  );
};

export default UnitCard;
