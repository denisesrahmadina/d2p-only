import React, { useEffect, useState } from 'react';
import { MapPin, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { UnitLocation, UnitLocationFilter } from '../types/unitLocation';
import { UnitLocationsService } from '../services/unitLocationsService';
import { InteractiveMap } from '../components/Map/InteractiveMap';
import { MapSidebar } from '../components/Map/MapSidebar';
import { MapLegend } from '../components/Map/MapLegend';

const MapView: React.FC = () => {
  const [allLocations, setAllLocations] = useState<UnitLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<UnitLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<UnitLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filter, setFilter] = useState<UnitLocationFilter>({
    search: '',
    healthStatus: 'all'
  });
  const [stats, setStats] = useState({
    total: 0,
    excellent: 0,
    good: 0,
    needsAttention: 0,
    averageHealthIndex: 0,
    totalCapacityMW: 0
  });

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    filterLocations();
  }, [allLocations, filter]);

  useEffect(() => {
    calculateStats();
  }, [filteredLocations]);

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const locations = await UnitLocationsService.getAllUnitLocations();
      setAllLocations(locations);
    } catch (err) {
      console.error('Error loading locations:', err);
      setError('Failed to load unit locations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterLocations = async () => {
    try {
      const filtered = await UnitLocationsService.filterUnitLocations(filter);
      setFilteredLocations(filtered);
    } catch (err) {
      console.error('Error filtering locations:', err);
      setFilteredLocations(allLocations);
    }
  };

  const calculateStats = () => {
    const total = filteredLocations.length;
    const excellent = filteredLocations.filter(
      loc => UnitLocationsService.getHealthStatus(loc.health_index) === 'excellent'
    ).length;
    const good = filteredLocations.filter(
      loc => UnitLocationsService.getHealthStatus(loc.health_index) === 'good'
    ).length;
    const needsAttention = filteredLocations.filter(
      loc => UnitLocationsService.getHealthStatus(loc.health_index) === 'needs-attention'
    ).length;
    const averageHealthIndex = total > 0
      ? filteredLocations.reduce((sum, loc) => sum + loc.health_index, 0) / total
      : 0;
    const totalCapacityMW = filteredLocations.reduce((sum, loc) => sum + (loc.capacity_mw || 0), 0);

    setStats({
      total,
      excellent,
      good,
      needsAttention,
      averageHealthIndex,
      totalCapacityMW
    });
  };

  const handleLocationSelect = (location: UnitLocation) => {
    setSelectedLocation(location);
  };

  const handleFilterChange = (newFilter: UnitLocationFilter) => {
    setFilter(newFilter);
  };

  const handleResetView = () => {
    setSelectedLocation(null);
    setFilter({ search: '', healthStatus: 'all' });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Map</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadLocations}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gray-50 dark:bg-gray-950">
      <div className="absolute top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-30 flex items-center px-4">
        <div className="flex items-center gap-2 flex-1">
          <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              PLN Indonesia Power - Business Unit Locations
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {filteredLocations.length} {filteredLocations.length === 1 ? 'location' : 'locations'} displayed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
          {(filter.search || filter.healthStatus !== 'all' || filter.region || filter.province || filter.type) && (
            <button
              onClick={handleResetView}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </div>

      <MapSidebar
        locations={filteredLocations}
        selectedLocation={selectedLocation}
        onLocationSelect={handleLocationSelect}
        filter={filter}
        onFilterChange={handleFilterChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="h-full pt-16">
        <InteractiveMap
          locations={filteredLocations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          className="w-full h-full"
        />

        <MapLegend stats={stats} />
      </div>
    </div>
  );
};

export default MapView;
