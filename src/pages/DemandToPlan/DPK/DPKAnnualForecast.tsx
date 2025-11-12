import React from 'react';
import { SkeletonCard } from '../../../components/Skeleton/SkeletonCard';
import { SkeletonTable } from '../../../components/Skeleton/SkeletonTable';
import { SkeletonChart } from '../../../components/Skeleton/SkeletonChart';
import { SkeletonForm } from '../../../components/Skeleton/SkeletonForm';

const DPKAnnualForecast: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonCard height="h-28" />
        <SkeletonCard height="h-28" />
        <SkeletonCard height="h-28" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonChart type="bar" height="h-96" title="Annual Forecast by Quarter" />
        </div>
        <div>
          <SkeletonForm fields={6} showButtons={true} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonChart type="line" height="h-72" title="Historical vs Forecast" />
        <SkeletonChart type="area" height="h-72" title="Budget Allocation" />
      </div>

      <div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-56 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-80"></div>
            </div>
            <div className="flex space-x-2">
              <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
            </div>
          </div>
        </div>
        <SkeletonTable rows={12} columns={9} />
      </div>
    </div>
  );
};

export default DPKAnnualForecast;
