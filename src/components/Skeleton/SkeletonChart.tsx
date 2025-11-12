import React from 'react';

interface SkeletonChartProps {
  type?: 'bar' | 'line' | 'pie' | 'area';
  height?: string;
  title?: string;
}

export const SkeletonChart: React.FC<SkeletonChartProps> = ({
  type = 'bar',
  height = 'h-80',
  title
}) => {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 ${height}`}>
      {title && (
        <div className="mb-4">
          <div className="animate-pulse">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          </div>
        </div>
      )}
      <div className="animate-pulse h-full flex items-end justify-around space-x-2 pb-8">
        {type === 'bar' && Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-gray-200 dark:bg-gray-700 rounded-t w-full"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          ></div>
        ))}
        {type === 'line' && (
          <div className="w-full h-full relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                points="0,150 50,120 100,140 150,90 200,110 250,70 300,100 350,60 400,80"
                className="text-gray-200 dark:text-gray-700"
              />
            </svg>
          </div>
        )}
        {type === 'pie' && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        )}
        {type === 'area' && (
          <div className="w-full h-full relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <path
                d="M0,150 L50,120 L100,140 L150,90 L200,110 L250,70 L300,100 L350,60 L400,80 L400,200 L0,200 Z"
                className="fill-gray-200 dark:fill-gray-700"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        <div className="animate-pulse flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div className="animate-pulse flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};
