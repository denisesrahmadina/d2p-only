import React from 'react';
import { Info, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface MapLegendProps {
  stats: {
    total: number;
    excellent: number;
    good: number;
    needsAttention: number;
    averageHealthIndex?: number;
    totalCapacityMW?: number;
  };
  useTolerance?: boolean;
  useTurnover?: boolean;
}

export const MapLegend: React.FC<MapLegendProps> = ({ stats, useTolerance = false, useTurnover = false }) => {
  const getRangeText = (level: 'excellent' | 'good' | 'needs-attention') => {
    if (useTurnover) {
      switch (level) {
        case 'excellent': return '≥13.0';
        case 'good': return '7.0-13';
        case 'needs-attention': return '<7.0';
      }
    } else if (useTolerance) {
      switch (level) {
        case 'excellent': return '90-100';
        case 'good': return '80-90';
        case 'needs-attention': return '<80';
      }
    } else {
      switch (level) {
        case 'excellent': return '85-100';
        case 'good': return '70-84.9';
        case 'needs-attention': return '<70';
      }
    }
  };

  return (
    <div className="absolute bottom-6 right-6 z-10 bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4 max-w-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-bold text-gray-900 dark:text-white">Map Legend</h3>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow-sm flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Excellent</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{getRangeText('excellent')}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stats.excellent} units ({((stats.excellent / stats.total) * 100).toFixed(0)}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 border-2 border-white shadow-sm flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Good</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{getRangeText('good')}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stats.good} units ({((stats.good / stats.total) * 100).toFixed(0)}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-sm flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Needs Attention</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{getRangeText('needs-attention')}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stats.needsAttention} units ({((stats.needsAttention / stats.total) * 100).toFixed(0)}%)
            </p>
          </div>
        </div>
      </div>

      {!useTolerance && !useTurnover && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Health</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {stats.averageHealthIndex?.toFixed(1) || '0.0'}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Capacity</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {stats.totalCapacityMW?.toFixed(0) || '0'} MW
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        Total: {stats.total} Business Units
      </div>
    </div>
  );
};
