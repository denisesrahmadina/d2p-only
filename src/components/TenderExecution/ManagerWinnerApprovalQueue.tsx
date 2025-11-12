import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle, XCircle, Clock, FileText, Eye, MessageSquare, Send } from 'lucide-react';
import { WinnerSelectionService, WinnerSelection } from '../../services/tenderEvaluationService';
import { MomDocumentService, MomDocument } from '../../services/momDocumentService';
import { useAuth } from '../../contexts/AuthContext';

const ManagerWinnerApprovalQueue: React.FC = () => {
  const { selectedOrganization, user } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState<WinnerSelection[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<WinnerSelection | null>(null);
  const [momDocuments, setMomDocuments] = useState<MomDocument[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadPendingApprovals();
    loadVendors();
  }, [selectedOrganization]);

  useEffect(() => {
    if (selectedApproval) {
      loadMomDocuments(selectedApproval.sourcing_event_id);
    }
  }, [selectedApproval]);

  const loadPendingApprovals = async () => {
    setLoading(true);
    try {
      const approvals = await WinnerSelectionService.getPendingApprovals(
        selectedOrganization || 'indonesia-power'
      );
      setPendingApprovals(approvals);
      if (approvals.length > 0 && !selectedApproval) {
        setSelectedApproval(approvals[0]);
      }
    } catch (error) {
      console.error('Failed to load pending approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVendors = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );

      const { data, error } = await supabase
        .from('dim_vendor')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    }
  };

  const loadMomDocuments = async (sourcingEventId: string) => {
    try {
      const docs = await MomDocumentService.getDocumentsByEvent(sourcingEventId);
      setMomDocuments(docs);
    } catch (error) {
      console.error('Failed to load MoM documents:', error);
    }
  };

  const getVendorName = (vendorId: string) => {
    const vendor = vendors.find(v => v.vendor_id === vendorId);
    return vendor?.vendor_name || vendorId;
  };

  const handleApprove = async () => {
    if (!selectedApproval?.id || !user?.email) return;

    const confirmApproval = window.confirm(
      `Are you sure you want to approve the winner selection for ${getVendorName(selectedApproval.winner_vendor_id)}?`
    );

    if (!confirmApproval) return;

    setActionLoading(true);
    try {
      await WinnerSelectionService.approveWinner(selectedApproval.id, user.email);
      await loadPendingApprovals();
      setSelectedApproval(null);
      alert('Winner selection approved successfully!');
    } catch (error) {
      console.error('Failed to approve winner:', error);
      alert('Failed to approve winner. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApproval?.id || !user?.email || !rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    setActionLoading(true);
    try {
      await WinnerSelectionService.rejectWinner(
        selectedApproval.id,
        user.email,
        rejectionReason
      );
      await loadPendingApprovals();
      setSelectedApproval(null);
      setShowRejectModal(false);
      setRejectionReason('');
      alert('Winner selection rejected successfully.');
    } catch (error) {
      console.error('Failed to reject winner:', error);
      alert('Failed to reject winner. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-600 border-t-transparent" />
      </div>
    );
  }

  if (pendingApprovals.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-12">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Pending Approvals
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            There are currently no winner selections waiting for your approval
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Winner Approval Queue
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Review and approve tender winner selections
            </p>
          </div>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
          <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {pendingApprovals.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
            Pending
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Pending Approvals
              </h4>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
              {pendingApprovals.map((approval) => (
                <button
                  key={approval.id}
                  onClick={() => setSelectedApproval(approval)}
                  className={`w-full p-4 text-left transition-colors ${
                    selectedApproval?.id === approval.id
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-l-yellow-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                      {getVendorName(approval.winner_vendor_id)}
                    </h5>
                    <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 ml-2" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Event ID: {approval.sourcing_event_id}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Score: <span className="font-bold">{approval.weighted_score.toFixed(2)}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Submitted: {new Date(approval.submission_date || '').toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-8">
          {selectedApproval ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {getVendorName(selectedApproval.winner_vendor_id)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Selected Winner
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Weighted Score</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {selectedApproval.weighted_score.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Score</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedApproval.total_score.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Selection Date</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {new Date(selectedApproval.selection_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Justification
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedApproval.justification || 'No justification provided'}
                  </p>
                </div>

                {selectedApproval.submitted_by && (
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    Submitted by {selectedApproval.submitted_by} on{' '}
                    {new Date(selectedApproval.submission_date || '').toLocaleString()}
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  Negotiation MoM Documents
                </h4>

                {momDocuments.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No MoM documents found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {momDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {doc.document_name}
                            </p>
                            {doc.meeting_date && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(doc.meeting_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {doc.status === 'Completed' ? (
                            <span className="flex items-center space-x-1 text-xs font-medium text-green-600 dark:text-green-400">
                              <CheckCircle className="h-3 w-3" />
                              <span>Completed</span>
                            </span>
                          ) : (
                            <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              {doc.status}
                            </span>
                          )}
                          <button
                            onClick={() => window.open(doc.document_url, '_blank')}
                            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={actionLoading}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="h-5 w-5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Approve</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-12">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Select an approval from the list to review</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                Reject Winner Selection
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please provide a reason for rejecting this winner selection:
              </p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectionReason.trim()}
                className="flex items-center space-x-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Rejecting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Confirm Rejection</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerWinnerApprovalQueue;
