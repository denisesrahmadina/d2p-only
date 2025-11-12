import React from 'react';

interface SkeletonFormProps {
  fields?: number;
  showButtons?: boolean;
}

export const SkeletonForm: React.FC<SkeletonFormProps> = ({
  fields = 4,
  showButtons = true
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="space-y-6">
        {Array.from({ length: fields }).map((_, idx) => (
          <div key={idx} className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-10 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"></div>
          </div>
        ))}
        {showButtons && (
          <div className="flex space-x-4 pt-4">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
