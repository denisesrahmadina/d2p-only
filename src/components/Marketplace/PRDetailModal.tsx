import React, { useState, useEffect } from 'react';
import {
  X, FileText, Calendar, User, Building2, MapPin, Package,
  CheckCircle2, Clock, XCircle, AlertCircle, ArrowRight, Edit3
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { MarketplacePRWithDetails, MarketplacePRApproval } from '../../types/marketplace';
import { MarketplaceService } from '../../services/marketplaceService';

interface PRDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  prId: number;
}

const PRDetailModal: React.FC<PRDetailModalProps> = ({ isOpen, onClose, prId }) => {
  const { isDarkMode } = useTheme();
  const [prData, setPRData] = useState<MarketplacePRWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && prId) {
      loadPRDetails();
    }
  }, [isOpen, prId]);

  const loadPRDetails = async () => {
    setLoading(true);
    try {
      // Load PR details from MarketplaceService (uses mock data)
      const prWithApprovals = await MarketplaceService.getPRWithApprovals(prId);

      if (prWithApprovals) {
        setPRData(prWithApprovals as MarketplacePRWithDetails);
      }
    } catch (error) {
      console.error('Error loading PR details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getApprovalStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'Rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'Requested Revision':
        return <Edit3 className="h-5 w-5 text-orange-600" />;
      case 'Pending':
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Requested Revision':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    }
  };

  const getPRStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'In Procurement':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`${
          isDarkMode ? 'bg-neutral-dark-900' : 'bg-white'
        } rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-dark-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold dark:text-white">
                {prData?.pr_number || 'Loading...'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Purchase Request Details</p>
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : prData ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={`${
                    isDarkMode ? 'bg-neutral-dark-800' : 'bg-gray-50'
                  } rounded-lg p-4`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold dark:text-white">PR Information</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">PR Number:</span>
                      <span className="font-medium dark:text-white">{prData.pr_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Date:</span>
                      <span className="font-medium dark:text-white">
                        {new Date(prData.pr_date).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPRStatusColor(
                          prData.pr_status
                        )}`}
                      >
                        {prData.pr_status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Value:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        Rp {prData.total_value.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    isDarkMode ? 'bg-neutral-dark-800' : 'bg-gray-50'
                  } rounded-lg p-4`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold dark:text-white">Requestor Information</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Name:</span>
                      <span className="font-medium dark:text-white">{prData.requestor_name}</span>
                    </div>
                    {prData.department && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Department:</span>
                        <span className="font-medium dark:text-white flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {prData.department}
                        </span>
                      </div>
                    )}
                    {prData.delivery_facility && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Delivery To:</span>
                        <span className="font-medium dark:text-white flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {prData.delivery_facility.facility_name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`${
                  isDarkMode ? 'bg-neutral-dark-800' : 'bg-gray-50'
                } rounded-lg p-4`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold dark:text-white">Line Items</h3>
                </div>
                <div className="space-y-3">
                  {prData.lines?.map((line, index) => (
                    <div
                      key={line.pr_line_id}
                      className={`${
                        isDarkMode ? 'bg-neutral-dark-900' : 'bg-white'
                      } rounded-lg p-4 border border-gray-200 dark:border-neutral-dark-700`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                              #{line.line_number}
                            </span>
                            <h4 className="font-semibold dark:text-white">
                              {line.item?.item_name}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {line.item?.supplier?.supplier_name}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600 dark:text-gray-300">
                              Quantity: <span className="font-medium dark:text-white">{line.quantity}</span>
                            </span>
                            <span className="text-gray-600 dark:text-gray-300">
                              Unit Price:{' '}
                              <span className="font-medium dark:text-white">
                                Rp {line.unit_price.toLocaleString('id-ID')}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Line Total
                          </p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            Rp {line.total_price.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {prData.approvals && prData.approvals.length > 0 && (
                <div
                  className={`${
                    isDarkMode ? 'bg-neutral-dark-800' : 'bg-gray-50'
                  } rounded-lg p-4`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold dark:text-white">Approval Workflow</h3>
                  </div>

                  <div className="relative">
                    {prData.approvals.map((approval, index) => {
                      const isLast = index === prData.approvals!.length - 1;
                      const isPending = approval.approval_status === 'Pending';
                      const isApproved = approval.approval_status === 'Approved';

                      return (
                        <div key={approval.approval_id} className="relative pb-8">
                          {!isLast && (
                            <div
                              className={`absolute left-[18px] top-10 h-full w-0.5 ${
                                isApproved
                                  ? 'bg-green-500'
                                  : isPending
                                  ? 'bg-gray-300 dark:bg-gray-600'
                                  : 'bg-red-500'
                              }`}
                            />
                          )}

                          <div className="flex items-start gap-4">
                            <div
                              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                isApproved
                                  ? 'bg-green-100 dark:bg-green-900/30'
                                  : isPending
                                  ? 'bg-yellow-100 dark:bg-yellow-900/30'
                                  : 'bg-red-100 dark:bg-red-900/30'
                              }`}
                            >
                              {getApprovalStatusIcon(approval.approval_status)}
                            </div>

                            <div
                              className={`flex-1 ${
                                isDarkMode ? 'bg-neutral-dark-900' : 'bg-white'
                              } rounded-lg p-4 shadow-sm`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold dark:text-white">
                                    Level {approval.approval_level}: {approval.approver_role}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {approval.approver_name}
                                  </p>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getApprovalStatusColor(
                                    approval.approval_status
                                  )}`}
                                >
                                  {approval.approval_status}
                                </span>
                              </div>

                              {approval.action_date && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                  {approval.approval_status} on{' '}
                                  {new Date(approval.action_date).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              )}

                              {approval.comments && (
                                <div
                                  className={`mt-2 p-3 rounded ${
                                    isDarkMode ? 'bg-neutral-dark-800' : 'bg-gray-50'
                                  }`}
                                >
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {approval.comments}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">No data available</p>
            </div>
          )}
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

export default PRDetailModal;
