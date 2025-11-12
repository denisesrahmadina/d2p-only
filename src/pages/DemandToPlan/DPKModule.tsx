import React, { useState } from 'react';
import { ArrowLeft, BarChart3, Calendar, TrendingUp, Workflow } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DPKOverview from './DPK/DPKOverview';
import DPKAnnualForecast from './DPK/DPKAnnualForecast';
import DPKMonthlyRollingForecast from './DPK/DPKMonthlyRollingForecast';

type DPKTabType = 'overview' | 'annual-forecast' | 'monthly-rolling';

const DPKModule: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DPKTabType>('overview');

  const tabs = [
    { id: 'overview' as DPKTabType, label: 'Overview', icon: BarChart3 },
    { id: 'annual-forecast' as DPKTabType, label: 'Annual Forecast', icon: Calendar },
    { id: 'monthly-rolling' as DPKTabType, label: 'Monthly Rolling Forecast', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate('/procurements/demand-to-plan')}
            className="mb-4 flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Demand to Plan</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Daftar Permintaan Kebutuhan (DPK)
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Procurement requirements planning and forecasting
              </p>
            </div>
            <button
              onClick={() => navigate('/procurements/demand-to-plan/dpk/flow')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl"
            >
              <Workflow className="h-5 w-5" />
              <span>View DPK Flow</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          {activeTab === 'overview' && <DPKOverview />}
          {activeTab === 'annual-forecast' && <DPKAnnualForecast />}
          {activeTab === 'monthly-rolling' && <DPKMonthlyRollingForecast />}
        </div>
      </main>
    </div>
  );
};

export default DPKModule;
