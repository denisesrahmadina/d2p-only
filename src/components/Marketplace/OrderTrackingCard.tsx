import React from 'react';
import {
  Package, Clock, Truck, MapPin, CheckCircle2, AlertTriangle, Calendar
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { MarketplaceOrder, ORDER_STATUS_STEPS, OrderStatus } from '../../types/marketplace';

interface OrderTrackingCardProps {
  order: MarketplaceOrder;
  onViewDetails: (order: MarketplaceOrder) => void;
}

const OrderTrackingCard: React.FC<OrderTrackingCardProps> = ({ order, onViewDetails }) => {
  const { isDarkMode } = useTheme();

  const getStepStatus = (stepNumber: number) => {
    if (order.current_step > stepNumber) return 'completed';
    if (order.current_step === stepNumber) return 'active';
    return 'pending';
  };

  const getStepIcon = (status: OrderStatus, stepStatus: 'completed' | 'active' | 'pending') => {
    if (stepStatus === 'completed') {
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    }

    const iconMap: Record<OrderStatus, any> = {
      ORDER_PLACED: Package,
      PROCESSING_ORDER: Clock,
      SHIPPED: Truck,
      DELIVERY: Truck,
      ARRIVED_AT_DESTINATION: MapPin
    };

    const Icon = iconMap[status] || Package;
    const colorClass = stepStatus === 'active' ? 'text-blue-600' : 'text-gray-400';

    return <Icon className={`h-5 w-5 ${colorClass}`} />;
  };

  return (
    <div
      className={`${
        isDarkMode ? 'bg-neutral-dark-900' : 'bg-white'
      } rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer`}
      onClick={() => onViewDetails(order)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold dark:text-white">{order.po_number}</h3>
            {order.is_delayed && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Delayed
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {order.supplier?.supplier_name}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(order.order_placed_date).toLocaleDateString('id-ID')}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Order Value</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Rp {order.total_value.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {order.delivery_facility && (
        <div
          className={`${
            isDarkMode ? 'bg-neutral-dark-800' : 'bg-gray-50'
          } rounded-lg p-3 mb-4`}
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Delivery Destination</p>
          <p className="text-sm font-medium dark:text-gray-100">
            {order.delivery_facility.facility_name} - {order.delivery_facility.city}
          </p>
        </div>
      )}

      <div className="relative">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-neutral-dark-700"></div>
          <div
            className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-500"
            style={{ width: `${((order.current_step - 1) / (ORDER_STATUS_STEPS.length - 1)) * 100}%` }}
          ></div>

          {ORDER_STATUS_STEPS.map((step, index) => {
            const stepStatus = getStepStatus(step.step);
            return (
              <div key={step.status} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    stepStatus === 'completed'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : stepStatus === 'active'
                      ? 'bg-blue-100 dark:bg-blue-900/30 ring-4 ring-blue-200 dark:ring-blue-800'
                      : 'bg-gray-100 dark:bg-neutral-dark-800'
                  }`}
                >
                  {getStepIcon(step.status, stepStatus)}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-xs font-medium ${
                      stepStatus === 'pending'
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {step.label}
                  </p>
                  {stepStatus === 'completed' && step.step === 1 && order.order_placed_date && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Date(order.order_placed_date).toLocaleDateString('id-ID', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  {stepStatus === 'completed' && step.step === 2 && order.processing_date && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Date(order.processing_date).toLocaleDateString('id-ID', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  {stepStatus === 'completed' && step.step === 3 && order.shipped_date && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Date(order.shipped_date).toLocaleDateString('id-ID', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  {stepStatus === 'completed' && step.step === 4 && order.delivery_date && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Date(order.delivery_date).toLocaleDateString('id-ID', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  {stepStatus === 'completed' && step.step === 5 && order.arrived_date && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Date(order.arrived_date).toLocaleDateString('id-ID', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {order.expected_delivery_date && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-dark-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Expected Delivery:</span>
            <span className={`font-medium ${order.is_delayed ? 'text-red-600' : 'text-green-600'}`}>
              {new Date(order.expected_delivery_date).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          {order.tracking_number && (
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600 dark:text-gray-300">Tracking Number:</span>
              <span className="font-mono text-xs dark:text-gray-200">{order.tracking_number}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Building2 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22V12h6v10" />
  </svg>
);

export default OrderTrackingCard;
