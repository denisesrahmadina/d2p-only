import React, { useState } from 'react';
import { X, Package, MapPin, Truck, Calendar, Clock, CheckCircle2, Building2, FileText } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { MarketplaceOrder, ORDER_STATUS_STEPS } from '../../types/marketplace';
import { useNavigate } from 'react-router-dom';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: MarketplaceOrder;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, order }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getStepStatus = (stepNumber: number) => {
    if (order.current_step > stepNumber) return 'completed';
    if (order.current_step === stepNumber) return 'active';
    return 'pending';
  };

  const handleJumpToAPBA = () => {
    onClose();
    navigate('/procurements/procure-to-invoice?tab=apba');
  };

  const isDeliveryComplete = order.current_status === 'ARRIVED_AT_DESTINATION';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`${
          isDarkMode ? 'bg-neutral-dark-900' : 'bg-white'
        } rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-dark-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold dark:text-white">{order.po_number}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Order Tracking Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-dark-800 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`${isDarkMode ? 'bg-neutral-dark-800' : 'bg-gray-50'} rounded-lg p-4`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold dark:text-white">Order Information</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">PO Number:</span>
                    <span className="font-medium dark:text-white">{order.po_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Order Date:</span>
                    <span className="font-medium dark:text-white">
                      {new Date(order.order_placed_date).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Total Value:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      Rp {order.total_value.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {order.tracking_number && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Tracking #:</span>
                      <span className="font-mono text-xs dark:text-white">
                        {order.tracking_number}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`${isDarkMode ? 'bg-neutral-dark-800' : 'bg-gray-50'} rounded-lg p-4`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold dark:text-white">Delivery Information</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Supplier:</span>
                    <span className="font-medium dark:text-white">
                      {order.supplier?.supplier_name}
                    </span>
                  </div>
                  {order.delivery_facility && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Facility:</span>
                        <span className="font-medium dark:text-white">
                          {order.delivery_facility.facility_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Location:</span>
                        <span className="font-medium dark:text-white">
                          {order.delivery_facility.city}
                        </span>
                      </div>
                    </>
                  )}
                  {order.expected_delivery_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Expected:</span>
                      <span
                        className={`font-medium ${
                          order.is_delayed ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {new Date(order.expected_delivery_date).toLocaleDateString('id-ID', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`${isDarkMode ? 'bg-neutral-dark-800' : 'bg-gray-50'} rounded-lg p-6`}
            >
              <h3 className="font-semibold mb-6 dark:text-white">Delivery Timeline</h3>

              <div className="space-y-6">
                {ORDER_STATUS_STEPS.map((step, index) => {
                  const stepStatus = getStepStatus(step.step);
                  const isLast = index === ORDER_STATUS_STEPS.length - 1;

                  let stepDate = null;
                  if (stepStatus === 'completed') {
                    switch (step.step) {
                      case 1:
                        stepDate = order.order_placed_date;
                        break;
                      case 2:
                        stepDate = order.processing_date;
                        break;
                      case 3:
                        stepDate = order.shipped_date;
                        break;
                      case 4:
                        stepDate = order.delivery_date;
                        break;
                      case 5:
                        stepDate = order.arrived_date;
                        break;
                    }
                  }

                  return (
                    <div key={step.status} className="relative">
                      {!isLast && (
                        <div
                          className={`absolute left-[18px] top-10 h-full w-0.5 ${
                            stepStatus === 'completed'
                              ? 'bg-green-500'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      )}

                      <div className="flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            stepStatus === 'completed'
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : stepStatus === 'active'
                              ? 'bg-blue-100 dark:bg-blue-900/30 ring-4 ring-blue-200 dark:ring-blue-800'
                              : 'bg-gray-100 dark:bg-neutral-dark-700'
                          }`}
                        >
                          {stepStatus === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : stepStatus === 'active' ? (
                            <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1 pb-2">
                          <div className="flex items-center justify-between">
                            <h4
                              className={`font-semibold ${
                                stepStatus === 'pending'
                                  ? 'text-gray-400 dark:text-gray-500'
                                  : 'dark:text-white'
                              }`}
                            >
                              {step.label}
                            </h4>
                            {stepDate && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(stepDate).toLocaleDateString('id-ID', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm mt-1 ${
                              stepStatus === 'pending'
                                ? 'text-gray-400 dark:text-gray-500'
                                : 'text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {order.is_delayed && order.delay_reason && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <span className="text-red-600 text-sm font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                      Delivery Delayed
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-400">{order.delay_reason}</p>
                  </div>
                </div>
              </div>
            )}

            {isDeliveryComplete && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-300 mb-1">
                        Order Arrived at Destination
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        Your order has been delivered. You can now proceed to create a Berita Acara
                        (BA) document.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleJumpToAPBA}
                    className="flex-shrink-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Go to APBA
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-dark-700 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 dark:border-neutral-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-dark-800 transition-colors font-medium dark:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
