import React from 'react';
import { SkeletonCard } from '../../../components/Skeleton/SkeletonCard';
import { SkeletonTable } from '../../../components/Skeleton/SkeletonTable';
import { SkeletonChart } from '../../../components/Skeleton/SkeletonChart';

const DPKMonthlyRollingForecast: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SkeletonCard height="h-24" />
        <SkeletonCard height="h-24" />
        <SkeletonCard height="h-24" />
        <SkeletonCard height="h-24" />
      </div>

      <div>
        <SkeletonChart type="line" height="h-96" title="Rolling 12-Month Forecast" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkeletonChart type="bar" height="h-64" title="Current Month" />
        <SkeletonChart type="bar" height="h-64" title="Next Month" />
        <SkeletonChart type="bar" height="h-64" title="Month+2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="animate-pulse space-y-4 mb-4">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="animate-pulse flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
                <div className="animate-pulse ml-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="animate-pulse space-y-4 mb-4">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-56"></div>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded">
                <div className="animate-pulse">
                  <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mt-1"></div>
                </div>
                <div className="flex-1 animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
            </div>
            <div className="flex space-x-2">
              <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
            </div>
          </div>
        </div>
        <SkeletonTable rows={10} columns={8} />
      </div>
    </div>
  );
};

export default DPKMonthlyRollingForecast;
