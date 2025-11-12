import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { UnitLocation } from '../../types/unitLocation';
import { UnitLocationWithTolerance } from '../../types/inventoryTolerance';
import { UnitLocationsService } from '../../services/unitLocationsService';
import { InventoryToleranceService } from '../../services/inventoryToleranceService';
import { InventoryTurnOverService } from '../../services/controlTower/inventoryTurnOverService';
import { Calendar, MapPinned, AlertTriangle } from 'lucide-react';

interface InteractiveMapProps {
  locations: UnitLocation[] | UnitLocationWithTolerance[] | any[];
  selectedLocation: UnitLocation | UnitLocationWithTolerance | any | null;
  onLocationSelect: (location: any) => void;
  className?: string;
  useTolerance?: boolean;
  useTurnover?: boolean;
}

const createCustomIcon = (color: string, size: 'small' | 'medium' | 'large' = 'medium') => {
  const sizeMap = {
    small: 24,
    medium: 32,
    large: 40
  };

  const iconSize = sizeMap[size];

  const svgIcon = `
    <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow-${size}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
        fill="${color}" 
        stroke="${color}" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        filter="url(#glow-${size})"
        opacity="0.9"/>
      <circle cx="12" cy="9" r="3" fill="#ffffff" opacity="0.95"/>
      <circle cx="12" cy="9" r="2" fill="${color}" opacity="0.8"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker-icon',
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize],
    popupAnchor: [0, -iconSize]
  });
};

const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 0.5 });
  }, [center, zoom, map]);

  return null;
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  locations,
  selectedLocation,
  onLocationSelect,
  className = '',
  useTolerance = false,
  useTurnover = false
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const defaultCenter: [number, number] = [-2.5, 118];
  const defaultZoom = 5;

  const [mapCenter, setMapCenter] = React.useState<[number, number]>(defaultCenter);
  const [mapZoom, setMapZoom] = React.useState(defaultZoom);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setMapCenter([selectedLocation.latitude, selectedLocation.longitude]);
      setMapZoom(10);
    }
  }, [selectedLocation]);

  const handleMarkerClick = (location: any) => {
    onLocationSelect(location);
  };

  const getMarkerIcon = (location: any) => {
    let markerColor;
    if (useTurnover && 'turnover_ratio' in location) {
      const turnoverInfo = InventoryTurnOverService.getTurnoverStatusInfo(location.turnover_ratio);
      markerColor = turnoverInfo.markerColor;
    } else if (useTolerance && 'tolerance_percentage' in location) {
      const toleranceInfo = InventoryToleranceService.getToleranceStatusInfo(location.tolerance_percentage);
      markerColor = toleranceInfo.markerColor;
    } else if ('health_index' in location) {
      const healthInfo = UnitLocationsService.getHealthStatusInfo(location.health_index);
      markerColor = healthInfo.markerColor;
    } else {
      markerColor = '#6b7280';
    }
    const isSelected = selectedLocation?.id === location.id;
    return createCustomIcon(markerColor, isSelected ? 'large' : 'medium');
  };

  return (
    <div className={`relative ${className}`}>
      <style>{`
        .leaflet-top.leaflet-left {
          display: none !important;
        }
        .leaflet-bottom.leaflet-left .leaflet-control-zoom {
          margin-left: 10px;
          margin-bottom: 10px;
        }
        
        /* Light Mode Map Styling */
        .leaflet-container {
          background: #f8fafc !important;
          font-family: 'Courier New', monospace !important;
        }
        
        /* Dark Mode Map Styling */
        .dark .leaflet-container {
          background: linear-gradient(135deg, #1a2332 0%, #1e2a3a 50%, #2a3647 100%) !important;
        }
        
        .leaflet-tile {
          opacity: 1;
        }
        
        /* Dark mode tile filter */
        .dark .leaflet-tile {
          filter: brightness(1.2) contrast(1.2) saturate(0.6) hue-rotate(190deg) !important;
          mix-blend-mode: lighten;
        }
        
        /* Zoom Controls - Light Mode */
        .leaflet-control-zoom {
          border: 2px solid rgba(59, 130, 246, 0.3) !important;
          border-radius: 8px !important;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.95) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }
        
        .leaflet-control-zoom a {
          background: rgba(255, 255, 255, 0.95) !important;
          color: rgba(59, 130, 246, 0.9) !important;
          border: none !important;
          font-family: 'Courier New', monospace !important;
          font-weight: bold;
          font-size: 20px;
          transition: all 0.3s ease !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: rgba(59, 130, 246, 0.1) !important;
          color: rgba(59, 130, 246, 1) !important;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.3) !important;
        }
        
        /* Zoom Controls - Dark Mode */
        .dark .leaflet-control-zoom {
          border: 2px solid rgba(0, 255, 255, 0.4) !important;
          background: rgba(10, 22, 40, 0.95) !important;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 10px rgba(0, 255, 255, 0.1) !important;
        }
        
        .dark .leaflet-control-zoom a {
          background: rgba(10, 22, 40, 0.95) !important;
          color: rgba(0, 255, 255, 0.9) !important;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
        }
        
        .dark .leaflet-control-zoom a:hover {
          background: rgba(0, 255, 255, 0.2) !important;
          color: rgba(0, 255, 255, 1) !important;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.6) !important;
        }
        
        .leaflet-control-zoom-in {
          border-bottom: 1px solid rgba(59, 130, 246, 0.2) !important;
        }
        
        .dark .leaflet-control-zoom-in {
          border-bottom: 1px solid rgba(0, 255, 255, 0.3) !important;
        }
        
        /* Custom Marker Glow */
        .custom-marker-icon {
          filter: drop-shadow(0 0 6px currentColor);
        }
        
        .dark .custom-marker-icon {
          filter: drop-shadow(0 0 8px currentColor) drop-shadow(0 0 12px currentColor);
          animation: marker-pulse 2s ease-in-out infinite;
        }
        
        @keyframes marker-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 8px currentColor) drop-shadow(0 0 12px currentColor);
          }
          50% {
            filter: drop-shadow(0 0 12px currentColor) drop-shadow(0 0 20px currentColor);
          }
        }
        
        /* Popup Light Mode Style */
        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.98) !important;
          border: 2px solid rgba(59, 130, 246, 0.3) !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          color: rgba(30, 41, 59, 1) !important;
          font-family: 'Courier New', monospace !important;
        }
        
        .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.98) !important;
          border: 2px solid rgba(59, 130, 246, 0.3) !important;
          border-top: none !important;
          border-right: none !important;
          box-shadow: -2px 2px 6px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* Popup Dark Mode Style */
        .dark .leaflet-popup-content-wrapper {
          background: linear-gradient(135deg, rgba(10, 14, 39, 0.98), rgba(15, 23, 42, 0.98)) !important;
          border: 2px solid rgba(59, 130, 246, 0.4) !important;
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.1) !important;
          color: rgba(148, 163, 184, 1) !important;
          backdrop-filter: blur(10px);
        }
        
        .dark .leaflet-popup-tip {
          background: rgba(10, 14, 39, 0.98) !important;
          border: 2px solid rgba(59, 130, 246, 0.4) !important;
          box-shadow: -2px 2px 8px rgba(59, 130, 246, 0.3) !important;
        }
        
        /* Popup Close Button */
        .leaflet-popup-close-button {
          color: rgba(59, 130, 246, 0.8) !important;
          font-size: 24px !important;
          font-weight: bold !important;
          transition: all 0.3s ease !important;
        }
        
        .dark .leaflet-popup-close-button {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
        }
        
        .leaflet-popup-close-button:hover {
          color: rgba(59, 130, 246, 1) !important;
        }
        
        .dark .leaflet-popup-close-button:hover {
          text-shadow: 0 0 15px rgba(59, 130, 246, 1);
        }
        
        /* Custom Popup Content Styling - Light Mode */
        .custom-popup h3 {
          color: rgba(59, 130, 246, 1) !important;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .custom-popup p {
          color: rgba(71, 85, 105, 0.9) !important;
        }
        
        /* Custom Popup Content Styling - Dark Mode */
        .dark .custom-popup h3 {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
        }
        
        .dark .custom-popup p {
          color: rgba(148, 163, 184, 0.9) !important;
        }
        
        /* Map Attribution - Light Mode */
        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.9) !important;
          color: rgba(59, 130, 246, 0.7) !important;
          border: 1px solid rgba(59, 130, 246, 0.2) !important;
          border-radius: 4px;
          font-family: 'Courier New', monospace !important;
          font-size: 10px;
        }
        
        .leaflet-control-attribution a {
          color: rgba(59, 130, 246, 0.8) !important;
          text-decoration: none;
        }
        
        /* Map Attribution - Dark Mode */
        .dark .leaflet-control-attribution {
          background: rgba(10, 14, 39, 0.8) !important;
          color: rgba(59, 130, 246, 0.6) !important;
          border: 1px solid rgba(59, 130, 246, 0.3) !important;
        }
      `}</style>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        className="rounded-lg"
        ref={mapRef}
        zoomControl={false}
      >
        <MapUpdater center={mapCenter} zoom={mapZoom} />
        
        <ZoomControl position="bottomleft" />

        {/* Conditional TileLayer - Light mode uses standard, Dark mode uses CartoDB Dark */}
        {isDarkMode ? (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        {locations.map((location: any) => {
          let statusInfo;
          if (useTurnover && 'turnover_ratio' in location) {
            statusInfo = InventoryTurnOverService.getTurnoverStatusInfo(location.turnover_ratio);
          } else if (useTolerance && 'tolerance_percentage' in location) {
            statusInfo = InventoryToleranceService.getToleranceStatusInfo(location.tolerance_percentage);
          } else {
            statusInfo = UnitLocationsService.getHealthStatusInfo(location.health_index);
          }

          return (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={getMarkerIcon(location)}
              eventHandlers={{
                click: () => handleMarkerClick(location)
              }}
            >
              <Popup className="custom-popup" maxWidth={useTolerance ? 450 : useTurnover ? 320 : 380}>
                <div className="p-3 max-h-96 overflow-y-auto" style={{ background: 'transparent' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1 uppercase tracking-wider" style={{ 
                        color: 'rgba(59, 130, 246, 1)',
                        textShadow: '0 0 10px rgba(59, 130, 246, 0.6)',
                        fontFamily: 'Courier New, monospace'
                      }}>{location.name}</h3>
                      <p className="text-sm" style={{ color: 'rgba(148, 163, 184, 0.9)' }}>{location.full_name}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      statusInfo.status === 'excellent' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40' :
                      statusInfo.status === 'good' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/40' :
                      'bg-red-500/20 text-red-400 border border-red-400/40'
                    }`} style={{
                      boxShadow: statusInfo.status === 'excellent' ? '0 0 10px rgba(52, 211, 153, 0.4)' :
                                 statusInfo.status === 'good' ? '0 0 10px rgba(234, 179, 8, 0.4)' :
                                 '0 0 10px rgba(239, 68, 68, 0.4)'
                    }}>
                      {statusInfo.status === 'excellent' ? '🟢' : statusInfo.status === 'good' ? '🟡' : '🔴'}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPinned className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'rgba(59, 130, 246, 0.8)' }} />
                      <div className="flex-1">
                        <p style={{ color: 'rgba(148, 163, 184, 0.95)' }}>{location.address}</p>
                        <p style={{ color: 'rgba(148, 163, 184, 0.8)' }}>{location.city}, {location.province}</p>
                        <p className="text-xs mt-1" style={{ color: 'rgba(148, 163, 184, 0.6)' }}>Region: {location.region}</p>
                      </div>
                    </div>

                    <div className="pt-2" style={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                            {useTurnover ? 'Turnover Ratio' : useTolerance ? 'Inventory Tolerance' : 'Health Index'}
                          </p>
                          <p className={`font-bold text-base ${statusInfo.color}`} style={{
                            fontFamily: 'Courier New, monospace',
                            textShadow: '0 0 8px currentColor'
                          }}>
                            {useTurnover && 'turnover_ratio' in location && location.turnover_ratio != null
                              ? `${location.turnover_ratio.toFixed(2)}x`
                              : useTolerance && 'tolerance_percentage' in location && location.tolerance_percentage != null
                              ? `${location.tolerance_percentage.toFixed(1)}%`
                              : location.health_index != null ? location.health_index.toFixed(1) : 'N/A'}
                          </p>
                          <p className="text-xs uppercase tracking-wider" style={{ color: 'rgba(148, 163, 184, 0.6)' }}>{statusInfo.label}</p>
                        </div>

                        {useTurnover && 'consumption_quantity' in location && (
                          <div>
                            <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: 'rgba(148, 163, 184, 0.6)' }}>Avg. Consumption</p>
                            <p className="font-semibold text-lg" style={{ 
                              color: 'rgba(168, 85, 247, 1)',
                              fontFamily: 'Courier New, monospace',
                              textShadow: '0 0 8px rgba(168, 85, 247, 0.6)'
                            }}>
                              {location.consumption_quantity != null ? location.consumption_quantity.toFixed(0) : 'N/A'}
                            </p>
                            <p className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.7)' }}>Units consumed</p>
                          </div>
                        )}

                        {useTurnover && 'average_inventory' in location && (
                          <div>
                            <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: 'rgba(148, 163, 184, 0.6)' }}>Avg. Inventory</p>
                            <p className="font-semibold text-lg" style={{ 
                              color: 'rgba(168, 85, 247, 1)',
                              fontFamily: 'Courier New, monospace',
                              textShadow: '0 0 8px rgba(168, 85, 247, 0.6)'
                            }}>
                              {location.average_inventory != null ? location.average_inventory.toFixed(0) : 'N/A'}
                            </p>
                            <p className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.7)' }}>Units in stock</p>
                          </div>
                        )}

                        {useTolerance && 'total_materials' in location && (
                          <div>
                            <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: 'rgba(148, 163, 184, 0.6)' }}>Materials</p>
                            <p className="font-semibold text-base" style={{ 
                              color: 'rgba(168, 85, 247, 1)',
                              fontFamily: 'Courier New, monospace',
                              textShadow: '0 0 8px rgba(168, 85, 247, 0.6)'
                            }}>
                              {location.total_materials}
                            </p>
                            <p className="text-xs" style={{ color: 'rgba(239, 68, 68, 0.9)' }}>
                              {location.materials_out_of_tolerance} out of tolerance
                            </p>
                          </div>
                        )}

                      </div>
                    </div>

                    {useTolerance && 'incompliant_materials' in location && location.incompliant_materials.length > 0 && (
                      <div className="pt-3" style={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <p className="text-sm font-semibold mb-2 flex items-center gap-1.5 uppercase tracking-wider" style={{ 
                          color: 'rgba(239, 68, 68, 1)',
                          textShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
                        }}>
                          <AlertTriangle className="w-4 h-4" style={{ color: 'rgba(239, 68, 68, 1)' }} />
                          Incompliant Materials
                        </p>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {location.incompliant_materials.map((material: any, idx: number) => (
                            <div key={idx} className="p-2.5 rounded-lg" style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)'
                            }}>
                              <p className="font-semibold text-sm mb-1 uppercase tracking-wide" style={{ 
                                color: 'rgba(148, 163, 184, 1)',
                                fontFamily: 'Courier New, monospace'
                              }}>{material.material_name}</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span style={{ color: 'rgba(148, 163, 184, 0.6)' }}>Actual:</span>
                                  <span className="font-medium ml-1" style={{ 
                                    color: 'rgba(59, 130, 246, 1)',
                                    fontFamily: 'Courier New, monospace'
                                  }}>{material.actual_quantity}</span>
                                </div>
                                <div>
                                  <span style={{ color: 'rgba(148, 163, 184, 0.6)' }}>Planned:</span>
                                  <span className="font-medium ml-1" style={{ 
                                    color: 'rgba(59, 130, 246, 1)',
                                    fontFamily: 'Courier New, monospace'
                                  }}>{material.planned_quantity}</span>
                                </div>
                              </div>
                              <div className="mt-1">
                                <span className="text-xs font-semibold uppercase tracking-wider" style={{ 
                                  color: 'rgba(239, 68, 68, 1)',
                                  textShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
                                }}>
                                  Deviation: {material.tolerance_percentage != null ? material.tolerance_percentage.toFixed(1) : 'N/A'}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!useTolerance && location.plant_type && (
                      <div className="pt-2" style={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: 'rgba(148, 163, 184, 0.6)' }}>Plant Type</p>
                        <p className="text-sm font-medium" style={{ color: 'rgba(148, 163, 184, 1)' }}>{location.plant_type}</p>
                      </div>
                    )}

                    {!useTolerance && location.commission_year && (
                      <div className="flex items-center gap-2 pt-1">
                        <Calendar className="w-3 h-3" style={{ color: 'rgba(148, 163, 184, 0.6)' }} />
                        <p className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.7)' }}>
                          Commissioned: {location.commission_year}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
