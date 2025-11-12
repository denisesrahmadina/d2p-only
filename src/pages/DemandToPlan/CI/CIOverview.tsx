import React from 'react';
import { SkeletonCard } from '../../../components/Skeleton/SkeletonCard';
import { SkeletonTable } from '../../../components/Skeleton/SkeletonTable';
import { SkeletonChart } from '../../../components/Skeleton/SkeletonChart';

const CIOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SkeletonCard height="h-28" />
        <SkeletonCard height="h-28" />
        <SkeletonCard height="h-28" />
        <SkeletonCard height="h-28" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SkeletonCard height="h-32" />
        <SkeletonCard height="h-32" />
        <SkeletonCard height="h-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonChart type="bar" height="h-80" title="Inventory by Location" />
        <SkeletonChart type="pie" height="h-80" title="Stock Status Distribution" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonChart type="line" height="h-64" title="Stock Movement Trend" />
        <SkeletonChart type="area" height="h-64" title="Turnover Rate" />
      </div>

      <div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-56 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-80"></div>
            </div>
            <div className="flex space-x-2">
              <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
              <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
            </div>
          </div>
        </div>
        <SkeletonTable rows={10} columns={8} />
      </div>
    </div>
  );
};

export default CIOverview;
