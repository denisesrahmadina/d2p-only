import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import {
  ArrowLeft,
  Calendar,
  GitMerge,
  Sliders,
  Scale,
  FileText,
  ChevronRight,
  CheckCircle2,
  Clock,
  Play,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';
import DPKDemandConsolidationHQ from './DPK/DPKDemandConsolidationHQ';
import DPKDemandAdjustment from './DPK/DPKDemandAdjustment';
import DPKDemandNetting from './DPK/DPKDemandNetting';
import DPKFinalProcurement from './DPK/DPKFinalProcurement';
import DPKUnitsLanding from './DPK/DPKUnitsLanding';
import DPKUnitDetail from './DPK/DPKUnitDetail';

type StageStatus = 'pending' | 'in-progress' | 'completed';

interface FlowStage {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  status: StageStatus;
  description: string;
  inputData: string;
  processingMethod: string;
  output: string;
}

const DPKFlow: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [currentView, setCurrentView] = useState<'units-list' | 'unit-detail'>('units-list');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [stages, setStages] = useState<FlowStage[]>([
    {
      id: 1,
      title: 'Annual Forecast 2026',
      subtitle: 'Generate ERP-based forecast',
      icon: Calendar,
      status: 'completed',
      description: 'AI-powered historical data analysis to generate annual procurement forecasts',
      inputData: 'Historical demand records from ERP system',
      processingMethod: 'Machine learning time-series analysis',
      output: 'Quarterly forecast data with confidence intervals'
    },
    {
      id: 2,
      title: 'Demand Consolidation 2026',
      subtitle: 'Merge ERP and user forecasts',
      icon: GitMerge,
      status: 'in-progress',
      description: 'Consolidate ERP forecasts with user-submitted forecast data',
      inputData: 'ERP forecasts and user-submitted data',
      processingMethod: 'Intelligent data merging with conflict resolution',
      output: 'Unified demand forecast dataset'
    },
    {
      id: 3,
      title: 'Demand Adjustment 2026',
      subtitle: 'Review and adjust forecasts',
      icon: Sliders,
      status: 'pending',
      description: 'Manual review and adjustment of consolidated demand forecasts',
      inputData: 'Consolidated demand forecasts',
      processingMethod: 'User-driven review and manual adjustments',
      output: 'Validated and adjusted demand forecasts'
    },
    {
      id: 4,
      title: 'Demand Netting 2026',
      subtitle: 'Calculate net requirements',
      icon: Scale,
      status: 'pending',
      description: 'Net demand against inventory and open purchase orders',
      inputData: 'Adjusted forecasts, inventory levels, open POs',
      processingMethod: 'Automated netting calculation engine',
      output: 'Net procurement requirements by period'
    },
    {
      id: 5,
      title: 'Final Procurement Table 2026',
      subtitle: 'Generate procurement plan',
      icon: FileText,
      status: 'pending',
      description: 'Create final procurement requirements and convert to DRP',
      inputData: 'Net requirements and supplier constraints',
      processingMethod: 'DRP generation with optimization',
      output: 'Final procurement plan ready for execution'
    }
  ]);

  const getStatusColor = (status: StageStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-gradient-to-br from-accenture-purple to-accenture-azure';
      default:
        return 'bg-gray-400 dark:bg-gray-600';
    }
  };

  const getStatusIcon = (status: StageStatus) => {
    switch (status) {
      case 'completed':
        return CheckCircle2;
      case 'in-progress':
        return Clock;
      default:
        return Play;
    }
  };

  const getStatusLabel = (status: StageStatus) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  const handleStageClick = (stageId: number) => {
    setStages(prevStages => {
      return prevStages.map(stage => {
        if (stage.id < stageId) {
          return { ...stage, status: 'completed' as StageStatus };
        } else if (stage.id === stageId) {
          return { ...stage, status: 'in-progress' as StageStatus };
        } else {
          return { ...stage, status: 'pending' as StageStatus };
        }
      });
    });
    setCurrentStage(stageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    setCurrentView('unit-detail');
  };

  const handleBackToUnits = () => {
    setSelectedUnitId(null);
    setCurrentView('units-list');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-accenture-gray-light dark:from-gray-900 dark:via-accenture-gray-dark dark:to-black transition-colors duration-300">
      {/* Enhanced Header with Accenture Branding */}
      <header className="relative bg-white dark:bg-accenture-black border-b border-gray-200 dark:border-accenture-gray-medium shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-accenture-purple/5 via-accenture-azure/5 to-transparent dark:from-accenture-purple/10 dark:via-accenture-azure/10"></div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          {/* Top Bar with Logo and Theme Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accenture-purple to-accenture-azure rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img src="/acnlogoonlywhite.png" alt="Accenture" className="w-7 object-contain" />
              </div>
              <div>
                <div className="text-xs font-semibold text-accenture-purple dark:text-accenture-purple-light uppercase tracking-wide">
                  Accenture Intelligent Procurement
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Demand to Plan Module
                </div>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-gray-100 dark:bg-accenture-gray-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-accenture-gray-dark transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Navigation and Title */}
          <button
            onClick={() => navigate('/procurements/demand-to-plan')}
            className="mb-4 flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-accenture-purple dark:hover:text-accenture-purple-light transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-accenture-gray-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Demand to Plan</span>
          </button>

          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-accenture-purple via-accenture-azure to-accenture-purple-dark bg-clip-text text-transparent mb-2">
              Daftar Permintaan Kebutuhan (DPK) Flow
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Intelligent step-by-step procurement requirements planning workflow
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Process Flow Visualization Panel */}
        <div className="bg-white dark:bg-accenture-gray-dark rounded-xl border border-gray-200 dark:border-accenture-gray-medium shadow-lg mb-6 overflow-hidden">
          {/* Panel Header */}
          <div className="border-b border-gray-200 dark:border-accenture-gray-medium px-6 py-3">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              DPK Process Flow
            </h2>
          </div>

          {/* Desktop Flow - Horizontal */}
          <div className="hidden lg:block px-8 py-6">
            <div className="flex items-center justify-between gap-4">
              {stages.map((stage, index) => {
                const StageIcon = stage.icon;

                return (
                  <React.Fragment key={stage.id}>
                    <div className="flex flex-col items-center flex-1">
                      <div
                        onClick={() => handleStageClick(stage.id)}
                        className={`relative cursor-pointer transition-all duration-200 ${
                          currentStage === stage.id
                            ? ''
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        {/* Icon Circle */}
                        <div
                          className={`w-14 h-14 rounded-full ${getStatusColor(stage.status)} flex items-center justify-center shadow-sm mb-2 transition-all duration-200`}
                        >
                          <StageIcon className="h-7 w-7 text-white" strokeWidth={2} />
                        </div>

                        {/* Stage Info */}
                        <div className="text-center max-w-[120px]">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">
                            {stage.title.replace(' 2026', '')}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Line Connector */}
                    {index < stages.length - 1 && (
                      <div className="flex-1 h-px bg-gray-300 dark:bg-accenture-gray-medium max-w-[100px] -mt-8" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Mobile/Tablet Flow - Vertical */}
          <div className="lg:hidden p-4 space-y-3">
            {stages.map((stage, index) => {
              const StageIcon = stage.icon;
              const StatusIcon = getStatusIcon(stage.status);

              return (
                <React.Fragment key={stage.id}>
                  <div
                    onClick={() => handleStageClick(stage.id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                      currentStage === stage.id
                        ? 'border-accenture-purple dark:border-accenture-azure bg-gradient-to-r from-accenture-purple/5 to-accenture-azure/5 dark:from-accenture-purple/10 dark:to-accenture-azure/10 shadow-lg'
                        : 'border-gray-200 dark:border-accenture-gray-medium hover:border-accenture-purple/50 dark:hover:border-accenture-azure/50 hover:shadow-md'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`relative w-14 h-14 rounded-lg ${getStatusColor(stage.status)} flex items-center justify-center shadow-md flex-shrink-0`}>
                      <div className="flex items-center justify-center w-full h-full">
                        <StageIcon className="h-7 w-7 text-white" strokeWidth={2} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded bg-white dark:bg-accenture-gray-medium shadow-sm flex items-center justify-center">
                        <StatusIcon className={`h-3 w-3 ${
                          stage.status === 'completed' ? 'text-green-500' :
                          stage.status === 'in-progress' ? 'text-accenture-purple' :
                          'text-gray-400'
                        }`} />
                      </div>
                      <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-accenture-purple to-accenture-azure shadow-md flex items-center justify-center border-2 border-white dark:border-accenture-gray-dark">
                        <span className="text-xs font-bold text-white">{stage.id}</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">
                        {stage.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {stage.subtitle}
                      </p>
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        stage.status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : stage.status === 'in-progress'
                          ? 'bg-purple-100 text-accenture-purple dark:bg-purple-900/30 dark:text-accenture-purple-light'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {getStatusLabel(stage.status)}
                      </span>
                    </div>
                  </div>

                  {/* Vertical Arrow */}
                  {index < stages.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <div className="w-1 h-6 bg-gradient-to-b from-accenture-purple to-accenture-azure rounded-full"></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Stage Details Panel */}
        <div className="bg-white dark:bg-accenture-gray-dark rounded-xl border border-gray-200 dark:border-accenture-gray-medium shadow-lg overflow-hidden">
          {(() => {
            const stage = stages.find(s => s.id === currentStage);
            if (!stage) return null;

            const StageIcon = stage.icon;

            return (
              <>
                {/* Details Header */}
                <div className="border-b border-gray-200 dark:border-accenture-gray-medium px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${getStatusColor(stage.status)} flex items-center justify-center flex-shrink-0`}>
                      <StageIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {stage.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stage Content */}
                <div className="p-6">
                  {/* Show specific content based on current stage */}
                  {currentStage === 1 ? (
                    <div className="space-y-6">
                      {currentView === 'unit-detail' && selectedUnitId ? (
                        <DPKUnitDetail unitId={selectedUnitId} onBack={handleBackToUnits} />
                      ) : (
                        <DPKUnitsLanding onSelectUnit={handleSelectUnit} />
                      )}
                    </div>
                  ) : currentStage === 2 ? (
                    <DPKDemandConsolidationHQ
                      onSuccess={() => {
                        // After consolidation success, navigate to Demand Adjustment tab (Stage 3)
                        handleStageClick(3);
                      }}
                    />
                  ) : currentStage === 3 ? (
                    <DPKDemandAdjustment />
                  ) : currentStage === 4 ? (
                    <DPKDemandNetting />
                  ) : currentStage === 5 ? (
                    <DPKFinalProcurement />
                  ) : null}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-accenture-gray-medium mt-4">
                    <button
                      disabled={currentStage === 1}
                      onClick={() => {
                        setCurrentStage(currentStage - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-accenture-gray-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-accenture-gray-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium flex items-center space-x-2 text-sm"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </button>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Step {currentStage} of {stages.length}
                    </div>
                    <button
                      onClick={() => {
                        if (currentStage === stages.length) {
                          navigate('/procurements/demand-to-plan');
                        } else {
                          setCurrentStage(currentStage + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-accenture-purple to-accenture-azure hover:from-accenture-purple-dark hover:to-accenture-azure-dark text-white rounded-lg transition-all duration-200 font-medium flex items-center space-x-2 shadow-sm hover:shadow text-sm"
                    >
                      <span>{currentStage === stages.length ? 'Close' : 'Next'}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </main>
    </div>
  );
};

export default DPKFlow;
