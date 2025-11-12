import React, { useState } from 'react';
import { Search, MapPin, Zap, ChevronDown, ChevronUp, X, Filter } from 'lucide-react';
import { UnitLocation, UnitLocationFilter } from '../../types/unitLocation';
import { UnitLocationsService } from '../../services/unitLocationsService';

interface MapSidebarProps {
  locations: UnitLocation[];
  selectedLocation: UnitLocation | null;
  onLocationSelect: (location: UnitLocation) => void;
  filter: UnitLocationFilter;
  onFilterChange: (filter: UnitLocationFilter) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const MapSidebar: React.FC<MapSidebarProps> = ({
  locations,
  selectedLocation,
  onLocationSelect,
  filter,
  onFilterChange,
  isOpen,
  onToggle
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const uniqueRegions = UnitLocationsService.getUniqueRegions(locations);
  const uniqueProvinces = UnitLocationsService.getUniqueProvinces(locations);
  const uniqueTypes = UnitLocationsService.getUniqueTypes(locations);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filter, search: e.target.value });
  };

  const handleHealthStatusChange = (status: UnitLocationFilter['healthStatus']) => {
    onFilterChange({ ...filter, healthStatus: status });
  };

  const handleRegionChange = (region: string) => {
    onFilterChange({ ...filter, region: region || undefined });
  };

  const handleProvinceChange = (province: string) => {
    onFilterChange({ ...filter, province: province || undefined });
  };

  const handleTypeChange = (type: string) => {
    onFilterChange({ ...filter, type: type || undefined });
  };

  const clearFilters = () => {
    onFilterChange({ search: '', healthStatus: 'all' });
  };

  const getHealthStatusBadge = (healthIndex: number) => {
    const healthInfo = UnitLocationsService.getHealthStatusInfo(healthIndex);
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium ${healthInfo.color}`}>
        {healthInfo.status === 'excellent' ? '🟢' : healthInfo.status === 'good' ? '🟡' : '🔴'}
        {healthIndex.toFixed(1)}
      </span>
    );
  };

  const activeFiltersCount = [
    filter.search,
    filter.healthStatus !== 'all' ? filter.healthStatus : null,
    filter.region,
    filter.province,
    filter.type
  ].filter(Boolean).length;

  return (
    <>
      {/* Compact Floating Sidebar */}
      <div
        className={`absolute top-4 left-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-2xl rounded-xl transition-all duration-300 ease-in-out z-20 ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0'
        } w-72 max-h-[calc(100%-2rem)] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700`}
      >
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Unit Locations
            </h2>
            <button
              onClick={onToggle}
              className="p-1.5 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Close sidebar"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={filter.search || ''}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-xs"
            />
          </div>
        </div>

        {/* Compact Filter Bar */}
        <div className="px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-[10px] font-semibold">
                  {activeFiltersCount}
                </span>
              )}
              {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-[10px] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-2 space-y-2 p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                  Health Status
                </label>
                <select
                  value={filter.healthStatus || 'all'}
                  onChange={(e) => handleHealthStatusChange(e.target.value as UnitLocationFilter['healthStatus'])}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="excellent">🟢 Excellent (85-100)</option>
                  <option value="good">🟡 Good (70-84.9)</option>
                  <option value="needs-attention">🔴 Needs Attention (&lt;70)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                  Region
                </label>
                <select
                  value={filter.region || ''}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">All Regions</option>
                  {uniqueRegions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                  Province
                </label>
                <select
                  value={filter.province || ''}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">All Provinces</option>
                  {uniqueProvinces.map((province) => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                  Unit Type
                </label>
                <select
                  value={filter.type || ''}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">All Types</option>
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Locations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {locations.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No locations found</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {locations.map((location) => {
                  const isSelected = selectedLocation?.id === location.id;

                  return (
                    <button
                      key={location.id}
                      onClick={() => onLocationSelect(location)}
                      className={`w-full text-left p-2.5 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-500 shadow-md'
                          : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-xs mb-0.5 truncate ${
                            isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                          }`}>
                            {location.name}
                          </h3>
                          <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate">
                            {location.city}, {location.province}
                          </p>
                        </div>
                        {getHealthStatusBadge(location.health_index)}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                        <span className="truncate">{location.plant_type || 'N/A'}</span>
                        {location.capacity_mw && (
                          <span className="flex items-center gap-0.5 ml-2 flex-shrink-0">
                            <Zap className="w-2.5 h-2.5" />
                            {location.capacity_mw} MW
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Compact Footer */}
        <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-800">
          <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
            Showing {locations.length} location{locations.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Toggle Button - Always Visible */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="absolute top-4 left-4 z-20 bg-white dark:bg-gray-900 p-2.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          title="Open locations sidebar"
        >
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </button>
      )}
    </>
  );
};
