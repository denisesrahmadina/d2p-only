import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '../../../services/supabaseClient';
import { DPKService } from '../../../services/dpkService';
import StatusPieChart from '../../../components/DemandToPlan/StatusPieChart';
import BottomForecastAccuracyCard from '../../../components/DemandToPlan/BottomForecastAccuracyCard';
import SubmissionMetricsCard from '../../../components/DemandToPlan/SubmissionMetricsCard';
import ForecastAccuracyComparisonCard from '../../../components/DemandToPlan/ForecastAccuracyComparisonCard';
import DemandSubmissionComparisonCard from '../../../components/DemandToPlan/DemandSubmissionComparisonCard';
import BudgetComparisonCard from '../../../components/DemandToPlan/BudgetComparisonCard';
import { SkeletonCard } from '../../../components/Skeleton/SkeletonCard';
import { SkeletonChart } from '../../../components/Skeleton/SkeletonChart';
import { SkeletonTable } from '../../../components/Skeleton/SkeletonTable';

const DPKOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [dpkSubmissionStats, setDpkSubmissionStats] = useState({
    totalUnits: 0,
    submittedUnits: 0,
    notSubmittedUnits: 0,
    submissionPercentage: 0
  });

  const [bottomAccuracy, setBottomAccuracy] = useState<Array<{
    unit_id: string;
    unit_name: string;
    accuracy_percentage: number;
  }>>([]);

  const [prStats, setPrStats] = useState({
    totalUnits: 0,
    submittedUnits: 0,
    submissionPercentage: 0
  });

  const [strStats, setStrStats] = useState({
    totalUnits: 0,
    submittedUnits: 0,
    submissionPercentage: 0
  });


  const loadDashboardData = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
        DPKService.invalidateCache();
      } else {
        setLoading(true);
      }
      setError(null);

      const fiscalYear = new Date().getFullYear();

      const [
        dpkData,
        accuracyData,
        prData,
        strData
      ] = await Promise.all([
        DPKService.getDPKSubmissionStats(fiscalYear),
        DPKService.getBottom5ForecastAccuracy(fiscalYear),
        DPKService.getPRSubmissionStats(fiscalYear),
        DPKService.getSTRSubmissionStats(fiscalYear)
      ]);

      setDpkSubmissionStats(dpkData);
      setBottomAccuracy(accuracyData);
      setPrStats(prData);
      setStrStats(strData);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();

    const submissionChannel = supabase
      .channel('dpk-dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fact_dpk_submission'
        },
        () => {
          if (isAutoRefresh) {
            console.log('Detected submission changes, refreshing...');
            loadDashboardData(true);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dim_unit'
        },
        () => {
          if (isAutoRefresh) {
            console.log('Detected unit changes, refreshing...');
            loadDashboardData(true);
          }
        }
      )
      .subscribe();

    return () => {
      submissionChannel.unsubscribe();
    };
  }, [loadDashboardData, isAutoRefresh]);


  const handleRefresh = () => {
    loadDashboardData(true);
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <SkeletonCard height="h-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonCard height="h-48" />
          <SkeletonCard height="h-48" />
          <SkeletonCard height="h-48" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart type="pie" height="h-80" title="DPK Submission" />
          <SkeletonCard height="h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            DPK Dashboard Overview
          </h2>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: {lastUpdated.toLocaleString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            {isAutoRefresh && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                Live
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleAutoRefresh}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              isAutoRefresh
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title={isAutoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
          >
            <span className="text-sm font-medium">
              {isAutoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ForecastAccuracyComparisonCard />
        <DemandSubmissionComparisonCard />
        <BudgetComparisonCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusPieChart
          submittedUnits={dpkSubmissionStats.submittedUnits}
          notSubmittedUnits={dpkSubmissionStats.notSubmittedUnits}
          submissionPercentage={dpkSubmissionStats.submissionPercentage}
        />
        <BottomForecastAccuracyCard accuracyData={bottomAccuracy} />
      </div>
    </div>
  );
};

export default DPKOverview;
