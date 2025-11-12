import React from 'react';
import { ArrowLeft, Factory, Zap, MapPin, CheckCircle2 } from 'lucide-react';
import AnnualForecastChart from '../../../components/DemandToPlan/AnnualForecastChart';
import UnitDemandConsolidation from '../../../components/DemandToPlan/UnitDemandConsolidation';
import plnUnitsData from '../../../data/plnUnits.json';

interface DPKUnitDetailProps {
  unitId: string;
  onBack: () => void;
}

const DPKUnitDetail: React.FC<DPKUnitDetailProps> = ({ unitId, onBack }) => {
  const unit = plnUnitsData.find(u => u.id === unitId);

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unit Not Found</h2>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-accenture-purple hover:bg-accenture-purple-dark text-white rounded-lg transition-colors"
          >
            Back to Units
          </button>
        </div>
      </div>
    );
  }

  const getProgressClasses = (progress: number) => {
    if (progress >= 67) {
      return {
        badge: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
        border: 'border-green-500 dark:border-green-400',
        text: 'text-green-600 dark:text-green-400'
      };
    }
    if (progress >= 34) {
      return {
        badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
        border: 'border-yellow-500 dark:border-yellow-400',
        text: 'text-yellow-600 dark:text-yellow-400'
      };
    }
    return {
      badge: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
      border: 'border-red-500 dark:border-red-400',
      text: 'text-red-600 dark:text-red-400'
    };
  };

  const colorClasses = getProgressClasses(unit.progress);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-accenture-gray-dark rounded-2xl border border-gray-200 dark:border-accenture-gray-medium shadow-xl overflow-hidden">
        <div className={`bg-gradient-to-r from-accenture-purple/10 via-accenture-azure/10 to-accenture-purple/10 dark:from-accenture-purple/20 dark:via-accenture-azure/20 dark:to-accenture-purple/20 border-b-4 ${colorClasses.border} px-8 py-6`}>
          <button
            onClick={onBack}
            className="mb-4 flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-accenture-purple dark:hover:text-accenture-purple-light transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-accenture-gray-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Units</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-start space-x-4">
              <div className={`w-16 h-16 rounded-xl border-2 ${colorClasses.border} bg-white dark:bg-accenture-gray-medium flex items-center justify-center shadow-lg`}>
                <Factory className={`h-8 w-8 ${colorClasses.text}`} />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {unit.name}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${colorClasses.badge}`}>
                    {unit.progress >= 67 ? 'On Track' : unit.progress >= 34 ? 'In Progress' : 'Needs Attention'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{unit.fullName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Zap className="h-4 w-4 text-accenture-azure" />
                  <span className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Capacity</span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{unit.capacity}</p>
              </div>
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <MapPin className="h-4 w-4 text-accenture-purple" />
                  <span className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Location</span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{unit.location}</p>
              </div>
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Progress</span>
                </div>
                <p className={`text-2xl font-bold ${colorClasses.text}`}>{unit.progress}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Card 1: Project Completion (Green) */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide leading-tight">Project<br/>Completion</h3>
                <div className="w-10 h-10 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-5xl font-bold text-gray-900 dark:text-white mb-1 leading-none">87%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Overall completion</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Progress</span>
                  <span className="font-bold text-green-600 dark:text-green-400">87%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: '87%' }}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Material Forecast Confirmation (Blue) */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide leading-tight">Material<br/>Forecast<br/>Confirmation</h3>
                <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1 leading-none">
                  <span className="text-blue-600 dark:text-blue-400">126</span>
                  <span className="text-3xl text-gray-500 dark:text-gray-400">/145</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 break-words">Materials Forecast Confirmed</p>
              </div>

              {/* Visual Indicator */}
              <div className="pt-3 border-t border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between text-[10px] text-gray-600 dark:text-gray-400">
                  <span>Confirmation Rate</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">87%</span>
                </div>
              </div>
            </div>

            {/* Card 3: Total Forecasted Value (Orange/Amber) */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide leading-tight">Total<br/>Forecasted<br/>Value</h3>
                <div className="w-10 h-10 bg-amber-600 dark:bg-amber-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1 leading-tight break-words">Rp 374.375.725.000</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 break-words">Total forecasted value across all materials</p>
              </div>
            </div>

            {/* Card 4: Forecasted Material (Purple) */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wide leading-tight">Forecasted<br/>Material</h3>
                <div className="w-10 h-10 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-start text-xs text-purple-800 dark:text-purple-200">
                  <span className="w-1.5 h-1.5 bg-purple-500 dark:bg-purple-400 rounded-full mr-2 flex-shrink-0 mt-1"></span>
                  <span className="font-medium break-words">Filter Udara Cartridge</span>
                </div>
                <div className="flex items-start text-xs text-purple-800 dark:text-purple-200">
                  <span className="w-1.5 h-1.5 bg-purple-500 dark:bg-purple-400 rounded-full mr-2 flex-shrink-0 mt-1"></span>
                  <span className="font-medium break-words">Oil Filter</span>
                </div>
                <div className="flex items-start text-xs text-purple-800 dark:text-purple-200">
                  <span className="w-1.5 h-1.5 bg-purple-500 dark:bg-purple-400 rounded-full mr-2 flex-shrink-0 mt-1"></span>
                  <span className="font-medium break-words">Filter Gas</span>
                </div>
                <div className="flex items-start text-xs text-purple-800 dark:text-purple-200">
                  <span className="w-1.5 h-1.5 bg-purple-500 dark:bg-purple-400 rounded-full mr-2 flex-shrink-0 mt-1"></span>
                  <span className="font-medium break-words">Filter Udara Kassa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <AnnualForecastChart />

        <UnitDemandConsolidation unitName={unit.name} unitCode={unit.code} onSuccess={onBack} />
      </div>
    </div>
  );
};

export default DPKUnitDetail;
