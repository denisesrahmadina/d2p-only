import React from 'react';
import { SkeletonCard } from '../../../components/Skeleton/SkeletonCard';
import { SkeletonTable } from '../../../components/Skeleton/SkeletonTable';
import { SkeletonChart } from '../../../components/Skeleton/SkeletonChart';

const CIInventoryAlert: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SkeletonCard height="h-28" />
        <SkeletonCard height="h-28" />
        <SkeletonCard height="h-28" />
        <SkeletonCard height="h-28" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="animate-pulse mb-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded">
                  <div className="animate-pulse">
                    <div className="w-12 h-12 bg-red-200 dark:bg-red-800 rounded-full"></div>
                  </div>
                  <div className="flex-1 animate-pulse space-y-2">
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SkeletonChart type="bar" height="h-64" title="Alert Frequency by Type" />
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="animate-pulse mb-4">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Critical', color: 'bg-red-500' },
                { label: 'High', color: 'bg-orange-500' },
                { label: 'Medium', color: 'bg-yellow-500' },
                { label: 'Low', color: 'bg-blue-500' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${item.color} rounded`}></div>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SkeletonChart type="pie" height="h-72" title="Alert Distribution" />
        </div>
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
              <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>
        <SkeletonTable rows={10} columns={9} />
      </div>
    </div>
  );
};

export default CIInventoryAlert;
