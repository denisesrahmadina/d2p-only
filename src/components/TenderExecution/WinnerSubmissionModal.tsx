import React, { useState } from 'react';
import { X, Trophy, FileText, AlertCircle, Send, CheckCircle } from 'lucide-react';
import { MomDocument } from '../../services/momDocumentService';

interface WinnerSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (justification: string) => Promise<void>;
  winnerVendorName: string;
  winnerScore: number;
  momDocuments: MomDocument[];
  allVendorScores: Array<{ vendorName: string; score: number }>;
}

const WinnerSubmissionModal: React.FC<WinnerSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  winnerVendorName,
  winnerScore,
  momDocuments,
  allVendorScores
}) => {
  const [justification, setJustification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const completedMomDocs = momDocuments.filter(doc => doc.status === 'Completed');
  const hasMomRequirement = completedMomDocs.length > 0;

  const handleSubmit = async () => {
    setError(null);

    if (!hasMomRequirement) {
      setError('At least one completed Negotiation MoM document is required before submitting for approval.');
      return;
    }

    if (!justification.trim()) {
      setError('Please provide a justification for the winner selection.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(justification);
      onClose();
    } catch (err) {
      setError('Failed to submit winner for approval. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Submit Winner for Approval
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review and submit winner selection to manager
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-2" />
              Selected Winner
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {winnerVendorName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Weighted Score: <span className="font-bold text-yellow-600 dark:text-yellow-400">{winnerScore.toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
              Final Vendor Rankings
            </h3>
            <div className="space-y-2">
              {allVendorScores.slice(0, 5).map((vendor, idx) => (
                <div
                  key={vendor.vendorName}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    idx === 0
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        idx === 0
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {vendor.vendorName}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {vendor.score.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              Negotiation MoM Documents
            </h3>
            {momDocuments.length === 0 ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    No MoM documents found
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    At least one completed MoM document is required before submission
                  </p>
                </div>
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
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          doc.status === 'Draft'
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        }`}>
                          {doc.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Justification for Winner Selection <span className="text-red-500">*</span>
            </label>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Provide a detailed explanation for why this vendor was selected as the winner..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This justification will be reviewed by the manager during the approval process.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !hasMomRequirement || !justification.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Submit for Approval</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerSubmissionModal;
