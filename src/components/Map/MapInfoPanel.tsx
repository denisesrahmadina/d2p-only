import React from 'react';
import { X, MapPin } from 'lucide-react';
import { UnitLocationWithTurnover } from '../../services/controlTower/inventoryTurnOverService';

interface MapInfoPanelProps {
  location: UnitLocationWithTurnover;
  onClose: () => void;
}

const MapInfoPanel: React.FC<MapInfoPanelProps> = ({ location, onClose }) => {
  const getStatusBadge = () => {
    if (location.turnover_status === 'excellent') {
      return { text: 'Excellent', emoji: '🟢', color: 'bg-green-100 text-green-800' };
    } else if (location.turnover_status === 'good') {
      return { text: 'Good', emoji: '🟡', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { text: 'Needs Attention', emoji: '🔴', color: 'bg-red-100 text-red-800' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div
      className="absolute top-4 left-4 right-4 md:left-4 md:right-auto md:w-[420px] bg-white rounded-xl shadow-2xl z-[1000] overflow-hidden border border-gray-200 animate-slideIn"
      style={{
        animation: 'slideIn 0.3s ease-out forwards'
      }}
    >
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Header */}
      <div className="p-4 border-b border-gray-200 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="flex items-start justify-between pr-8">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{location.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{location.name}</p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge.color} flex-shrink-0`}>
            {statusBadge.emoji}
          </div>
        </div>
      </div>

      {/* Location Info */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 text-sm">
            <p className="text-gray-700">{location.address || 'Jl. MT Haryono, Samarinda'}</p>
            <p className="text-gray-600">, {location.province}</p>
            <p className="text-gray-500 text-xs mt-1">Region: {location.region}</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Turnover Ratio */}
          <div className="pb-3 border-b border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Turnover Ratio</p>
            <p className="font-bold text-2xl text-yellow-600">
              {location.turnover_ratio.toFixed(2)}<span className="text-base">x</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">{statusBadge.text}</p>
          </div>

          {/* Consumption Rate */}
          <div className="pb-3 border-b border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Avg. Consumption Rate</p>
            <p className="font-bold text-2xl text-gray-900">{location.consumption_quantity.toFixed(0)}</p>
            <p className="text-xs text-gray-600 mt-1">Units consumed per period</p>
          </div>

          {/* Average Inventory */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Average Inventory</p>
            <p className="font-bold text-2xl text-gray-900">{location.average_inventory.toFixed(0)}</p>
            <p className="text-xs text-gray-600 mt-1">Average units in stock</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapInfoPanel;
