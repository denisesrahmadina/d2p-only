import React, { useState, useMemo } from 'react';
import { Search, Filter, BarChart3, Building2, TrendingUp, AlertCircle } from 'lucide-react';
import UnitCard from '../../../components/DemandToPlan/UnitCard';
import plnUnitsData from '../../../data/plnUnits.json';

interface Unit {
  id: string;
  code: string;
  name: string;
  fullName: string;
  progress: number;
  location: string;
  capacity: string;
  status: string;
}

interface DPKUnitsLandingProps {
  onSelectUnit: (unitId: string) => void;
}

const DPKUnitsLanding: React.FC<DPKUnitsLandingProps> = ({ onSelectUnit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [progressFilter, setProgressFilter] = useState<'all' | 'completed' | 'low' | 'high'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const units: Unit[] = plnUnitsData;

  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      const matchesSearch =
        unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.fullName.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesProgress = true;
      if (progressFilter === 'completed') {
        matchesProgress = unit.progress === 100;
      } else if (progressFilter === 'low') {
        matchesProgress = unit.progress < 50;
      } else if (progressFilter === 'high') {
        matchesProgress = unit.progress > 50 && unit.progress < 100;
      }

      return matchesSearch && matchesProgress;
    });
  }, [units, searchQuery, progressFilter]);

  const statistics = useMemo(() => {
    const total = units.length;
    const completed = units.filter(u => u.progress === 100).length;
    const low = units.filter(u => u.progress < 50).length;
    const high = units.filter(u => u.progress > 50 && u.progress < 100).length;
    const avgProgress = Math.round(units.reduce((sum, u) => sum + u.progress, 0) / total);

    return { total, completed, low, high, avgProgress };
  }, [units]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accenture-purple/10 dark:bg-accenture-purple/20 rounded-full mb-4">
          <Building2 className="h-5 w-5 text-accenture-purple dark:text-accenture-purple-light" />
          <span className="text-sm font-semibold text-accenture-purple dark:text-accenture-purple-light">
            PLN Indonesia Power Units
          </span>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Annual Forecast Dashboard
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Monitor and manage annual demand forecasts across all {statistics.total} operational units
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-accenture-purple/10 to-accenture-azure/10 dark:from-accenture-purple/20 dark:to-accenture-azure/20 rounded-xl p-6 border border-accenture-purple/20 dark:border-accenture-purple/30">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="h-8 w-8 text-accenture-purple dark:text-accenture-purple-light" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Total Units</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.total}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Units</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 rounded-xl p-6 border border-green-500/20 dark:border-green-500/30">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Completed</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.completed}</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1 font-semibold">100% Complete</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20 rounded-xl p-6 border border-yellow-500/20 dark:border-yellow-500/30">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">High Progress</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.high}</p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1 font-semibold">&gt;50% Complete</p>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20 rounded-xl p-6 border border-red-500/20 dark:border-red-500/30">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Low Progress</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.low}</p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1 font-semibold">&lt;50% Complete</p>
        </div>
      </div>

      <div className="bg-white dark:bg-accenture-gray-dark rounded-xl border border-gray-200 dark:border-accenture-gray-medium shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search units by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-accenture-gray-medium rounded-lg bg-white dark:bg-accenture-gray-medium text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accenture-purple"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setProgressFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  progressFilter === 'all'
                    ? 'bg-accenture-purple text-white shadow-md'
                    : 'bg-gray-100 dark:bg-accenture-gray-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-accenture-gray-dark'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setProgressFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  progressFilter === 'completed'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-accenture-gray-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-accenture-gray-dark'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setProgressFilter('high')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  progressFilter === 'high'
                    ? 'bg-yellow-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-accenture-gray-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-accenture-gray-dark'
                }`}
              >
                High
              </button>
              <button
                onClick={() => setProgressFilter('low')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  progressFilter === 'low'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-accenture-gray-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-accenture-gray-dark'
                }`}
              >
                Low
              </button>
            </div>
          </div>
        </div>

        {filteredUnits.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredUnits.length}</span> of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{statistics.total}</span> units
            {searchQuery && (
              <span>
                {' '}matching "<span className="font-semibold text-accenture-purple dark:text-accenture-purple-light">{searchQuery}</span>"
              </span>
            )}
          </div>
        )}
      </div>

      {filteredUnits.length === 0 ? (
        <div className="bg-white dark:bg-accenture-gray-dark rounded-xl border border-gray-200 dark:border-accenture-gray-medium shadow-lg p-12 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Units Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setProgressFilter('all');
            }}
            className="px-6 py-2 bg-accenture-purple hover:bg-accenture-purple-dark text-white rounded-lg transition-colors font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUnits.map((unit) => (
            <UnitCard
              key={unit.id}
              id={unit.id}
              code={unit.code}
              name={unit.name}
              fullName={unit.fullName}
              progress={unit.progress}
              capacity={unit.capacity}
              onClick={() => onSelectUnit(unit.id)}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Average Progress Across All Units: {statistics.avgProgress}%
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              Click on any unit card to view detailed annual forecasts, manage demand adjustments, and submit to E-Budget.
              Progress is automatically tracked and updated in real-time based on forecast completion status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DPKUnitsLanding;
