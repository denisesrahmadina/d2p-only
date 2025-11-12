import React from 'react';
import { SkeletonCard } from '../../../components/Skeleton/SkeletonCard';
import { SkeletonTable } from '../../../components/Skeleton/SkeletonTable';
import { SkeletonChart } from '../../../components/Skeleton/SkeletonChart';
import { SkeletonForm } from '../../../components/Skeleton/SkeletonForm';

const CIExecutionManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonCard height="h-32" />
        <SkeletonCard height="h-32" />
        <SkeletonCard height="h-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SkeletonChart type="line" height="h-80" title="Execution Progress Tracking" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonChart type="bar" height="h-64" title="By Status" />
            <SkeletonChart type="pie" height="h-64" title="By Priority" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="animate-pulse mb-4">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="animate-pulse space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="animate-pulse mb-4">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
            </div>
            <SkeletonForm fields={4} showButtons={true} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="animate-pulse mb-4">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded">
                <div className="animate-pulse">
                  <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
                <div className="flex-1 animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="animate-pulse mb-4">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-56"></div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="animate-pulse space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-4 bg-blue-300 dark:bg-blue-700 rounded w-32"></div>
                    <div className="h-4 bg-blue-300 dark:bg-blue-700 rounded w-16"></div>
                  </div>
                  <div className="h-3 bg-blue-200 dark:bg-blue-800 rounded w-full"></div>
                  <div className="h-3 bg-blue-200 dark:bg-blue-800 rounded w-3/4"></div>
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
        <SkeletonTable rows={12} columns={10} />
      </div>
    </div>
  );
};

export default CIExecutionManagement;
