import React, { useState } from 'react';
import { ArrowLeft, BarChart3, RefreshCw, AlertCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CIOverview from './CI/CIOverview';
import CIInventoryPlanning from './CI/CIInventoryPlanning';
import CIInventoryAlert from './CI/CIInventoryAlert';
import CIExecutionManagement from './CI/CIExecutionManagement';

type CITabType = 'overview' | 'inventory-planning' | 'inventory-alert' | 'execution-management';

const CIModule: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CITabType>('overview');

  const tabs = [
    { id: 'overview' as CITabType, label: 'Overview', icon: BarChart3 },
    { id: 'inventory-planning' as CITabType, label: 'Inventory Planning', icon: RefreshCw },
    { id: 'inventory-alert' as CITabType, label: 'Inventory Alert', icon: AlertCircle },
    { id: 'execution-management' as CITabType, label: 'Execution Management', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate('/procurement/demand-to-plan')}
            className="mb-4 flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Demand to Plan</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Centralized Inventory (CI)
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive inventory management and optimization
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600 dark:text-green-400'
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
          {activeTab === 'overview' && <CIOverview />}
          {activeTab === 'inventory-planning' && <CIInventoryPlanning />}
          {activeTab === 'inventory-alert' && <CIInventoryAlert />}
          {activeTab === 'execution-management' && <CIExecutionManagement />}
        </div>
      </main>
    </div>
  );
};

export default CIModule;
