import React, { useState } from 'react';
import { X, FileText, ChevronLeft, ChevronRight, Brain, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface Page {
  page_number: number;
  title: string;
  content: string;
}

interface AIGuidance {
  criteria: string;
  page: number;
  summary: string;
  confidence: string;
  key_findings: string;
}

interface TechnicalProposal {
  document_name: string;
  total_pages: number;
  document_quality: string;
  pages: Page[];
  ai_guidance: AIGuidance[];
}

interface Props {
  vendorName: string;
  vendorCode: string;
  proposal: TechnicalProposal;
  onClose: () => void;
}

const TechnicalProposalModal: React.FC<Props> = ({ vendorName, vendorCode, proposal, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<'document' | 'guidance'>('document');

  const getCurrentPageContent = () => {
    return proposal.pages.find(p => p.page_number === currentPage);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < proposal.total_pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getQualityBadge = () => {
    if (proposal.document_quality === 'excellent') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Excellent Quality
        </span>
      );
    } else if (proposal.document_quality === 'partial') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
          <AlertCircle className="h-3 w-3 mr-1" />
          Partial Compliance
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
          <XCircle className="h-3 w-3 mr-1" />
          Poor Quality
        </span>
      );
    }
  };

  const getConfidenceColor = (confidence: string) => {
    const value = parseInt(confidence);
    if (value >= 90) return 'text-green-600 dark:text-green-400';
    if (value >= 75) return 'text-blue-600 dark:text-blue-400';
    if (value >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const currentPageContent = getCurrentPageContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Technical Proposal Document
              </h3>
              <div className="flex items-center space-x-3 mt-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {vendorName} ({vendorCode})
                </p>
                {getQualityBadge()}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setView('document')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              view === 'document'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/10'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Document Preview
          </button>
          <button
            onClick={() => setView('guidance')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              view === 'guidance'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/10'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Brain className="h-4 w-4 inline mr-2" />
            AI Criteria Mapping
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {view === 'document' ? (
            <div className="space-y-6">
              {/* Document Info */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Document: {proposal.document_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Total Pages: {proposal.total_pages}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="p-2 rounded bg-blue-600 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3">
                      Page {currentPage} of {proposal.total_pages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === proposal.total_pages}
                      className="p-2 rounded bg-blue-600 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mock PDF Page */}
              {currentPageContent && (
                <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg shadow-lg min-h-[500px]">
                  {/* PDF Header */}
                  <div className="bg-gray-100 dark:bg-gray-700 px-6 py-3 border-b border-gray-300 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {proposal.document_name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Page {currentPage}
                      </span>
                    </div>
                  </div>

                  {/* PDF Content */}
                  <div className="p-8 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                        {currentPageContent.title}
                      </h2>
                      <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                        {currentPageContent.content}
                      </p>
                    </div>

                    {/* Mock footer */}
                    <div className="mt-12 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{vendorName}</span>
                        <span>Technical Proposal 2025</span>
                        <span>Page {currentPage} of {proposal.total_pages}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Page Thumbnails */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Quick Navigation
                </h4>
                <div className="grid grid-cols-6 gap-2">
                  {proposal.pages.map((page) => (
                    <button
                      key={page.page_number}
                      onClick={() => setCurrentPage(page.page_number)}
                      className={`p-2 rounded text-xs font-medium transition-colors ${
                        currentPage === page.page_number
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      Page {page.page_number}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* AI Guidance Header */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      AI Guidance: Technical Criteria Mapping
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      AI analysis has identified where each technical evaluation criterion is addressed in the document.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Guidance Table */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          Technical Criteria
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          Page Reference
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          Summary of Content
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          Confidence
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {proposal.ai_guidance.map((guidance, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                          onClick={() => {
                            setView('document');
                            setCurrentPage(guidance.page);
                          }}
                        >
                          <td className="px-4 py-4">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {guidance.criteria}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {guidance.page > 0 ? (
                              <button
                                className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                              >
                                <FileText className="h-3 w-3" />
                                <span>Page {guidance.page}</span>
                              </button>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                                Not Found
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                              {guidance.summary}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                              {guidance.key_findings}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex flex-col items-center space-y-1">
                              <span className={`text-lg font-bold ${getConfidenceColor(guidance.confidence)}`}>
                                {guidance.confidence}
                              </span>
                              <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    parseInt(guidance.confidence) >= 90
                                      ? 'bg-green-500'
                                      : parseInt(guidance.confidence) >= 75
                                      ? 'bg-blue-500'
                                      : parseInt(guidance.confidence) >= 60
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                  }`}
                                  style={{ width: guidance.confidence }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Additional Insights */}
              <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                  Usage Tips
                </h4>
                <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                  <li>Click on any row to jump to the referenced page in the document</li>
                  <li>Confidence scores indicate AI certainty in locating the criteria</li>
                  <li>Low confidence scores may require manual verification</li>
                  <li>"Not Found" indicates the criterion is not addressed in the document</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalProposalModal;
