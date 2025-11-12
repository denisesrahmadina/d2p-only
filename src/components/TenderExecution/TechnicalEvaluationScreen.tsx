import React, { useState, useEffect } from 'react';
import { Wrench, ArrowLeft, Brain, CheckCircle, AlertTriangle, XCircle, FileText, X, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import mockData from '../../data/eprocurementMockData.json';

interface Criterion {
  name: string;
  weight: number;
  ai_score: number;
  justification: string;
  manual_score: number | null;
  documentSectionReference?: {
    page: number;
    section: string;
    content: string;
  };
}

interface Page {
  page_number: number;
  title: string;
  content: string;
}

interface TechnicalProposal {
  document_name: string;
  total_pages: number;
  document_quality: string;
  pages: Page[];
}

interface VendorEvaluation {
  vendor_id: string;
  scenario: string;
  criteria: Criterion[];
  overall_ai_score: number;
  overall_justification: string;
  technical_proposal?: TechnicalProposal;
  submitted: boolean;
}

interface TechnicalEvaluation {
  sourcing_event_id: string;
  vendor_evaluations: VendorEvaluation[];
}

interface Vendor {
  id: string;
  vendor_name: string;
  vendor_code: string;
}

interface SourcingEventBundle {
  id: string;
  sourcing_event_id: string;
  title: string;
}

interface Props {
  event: SourcingEventBundle;
  onBack: () => void;
}

const TechnicalEvaluationScreen: React.FC<Props> = ({ event, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState<VendorEvaluation[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editingJustification, setEditingJustification] = useState<{ vendorId: string; criterionName: string } | null>(null);
  const [justificationText, setJustificationText] = useState('');
  const [previewDocument, setPreviewDocument] = useState<{
    vendor: string;
    criterion: string;
    page: number;
    content: string;
  } | null>(null);

  const criteriaOptions = [
    'Design Compliance',
    'Performance Rating',
    'Material Specification',
    'Energy Efficiency',
    'Documentation Quality',
    'Technical Experience',
    'Product Quality & Standards',
    'Compliance with Specifications',
    'Technical Support & Warranty',
    'Innovation & R&D Capability'
  ];

  useEffect(() => {
    simulateAIProcessing();
  }, []);

  const simulateAIProcessing = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const techEvals = (mockData.technicalEvaluations || []) as any[];
      const vendorsList = (mockData.vendors || []) as Vendor[];

      const eventEval = techEvals.find(e => e.sourcing_event_id === event.sourcing_event_id);

      if (eventEval) {
        const enhancedEvaluations = eventEval.vendor_evaluations.map((ve: any) => ({
          ...ve,
          submitted: false,
          criteria: ve.criteria.map((c: any, idx: number) => ({
            ...c,
            documentSectionReference: ve.technical_proposal?.pages[idx] ? {
              page: ve.technical_proposal.pages[idx].page_number,
              section: ve.technical_proposal.pages[idx].title,
              content: ve.technical_proposal.pages[idx].content
            } : undefined
          }))
        }));
        setEvaluations(enhancedEvaluations);
      }
      setVendors(vendorsList);
    } catch (error) {
      console.error('Failed to load evaluation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVendorName = (vendorId: string): string => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor ? vendor.vendor_name : vendorId;
  };

  const getVendorCode = (vendorId: string): string => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor ? vendor.vendor_code : vendorId;
  };

  const toggleRow = (vendorId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(vendorId)) {
        newSet.delete(vendorId);
      } else {
        newSet.add(vendorId);
      }
      return newSet;
    });
  };

  const handleCriterionChange = (vendorId: string, oldCriterionName: string, newCriterionName: string) => {
    setEvaluations(prev => prev.map(evaluation => {
      if (evaluation.vendor_id === vendorId) {
        return {
          ...evaluation,
          criteria: evaluation.criteria.map(c =>
            c.name === oldCriterionName ? { ...c, name: newCriterionName } : c
          )
        };
      }
      return evaluation;
    }));
  };

  const handleManualScoreChange = (vendorId: string, criterionName: string, newScore: string) => {
    const scoreValue = parseFloat(newScore);
    if (!isNaN(scoreValue) && scoreValue >= 0 && scoreValue <= 100) {
      setEvaluations(prev => prev.map(evaluation => {
        if (evaluation.vendor_id === vendorId) {
          const criterion = evaluation.criteria.find(c => c.name === criterionName);
          if (criterion && scoreValue !== criterion.ai_score) {
            setEditingJustification({ vendorId, criterionName });
          }
          return {
            ...evaluation,
            criteria: evaluation.criteria.map(c =>
              c.name === criterionName ? { ...c, manual_score: scoreValue } : c
            )
          };
        }
        return evaluation;
      }));
    }
  };

  const handleSaveJustification = (vendorId: string, criterionName: string) => {
    setEvaluations(prev => prev.map(evaluation => {
      if (evaluation.vendor_id === vendorId) {
        return {
          ...evaluation,
          criteria: evaluation.criteria.map(c =>
            c.name === criterionName ? { ...c, justification: justificationText } : c
          )
        };
      }
      return evaluation;
    }));

    setEditingJustification(null);
    setJustificationText('');
  };

  const handleSubmitVendor = (vendorId: string) => {
    setEvaluations(prev => prev.map(evaluation =>
      evaluation.vendor_id === vendorId
        ? { ...evaluation, submitted: true }
        : evaluation
    ));
  };

  const handlePreviewDocument = (vendorName: string, criterion: Criterion) => {
    if (criterion.documentSectionReference) {
      setPreviewDocument({
        vendor: vendorName,
        criterion: criterion.name,
        page: criterion.documentSectionReference.page,
        content: criterion.documentSectionReference.content
      });
    }
  };

  const calculateWeightedScore = (criteria: Criterion[]): number => {
    const totalScore = criteria.reduce((sum, criterion) => {
      const score = criterion.manual_score ?? criterion.ai_score;
      return sum + (score * criterion.weight / 100);
    }, 0);
    return Math.round(totalScore * 10) / 10;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
          <CheckCircle className="h-3 w-3" />
          <span>Excellent</span>
        </span>
      );
    } else if (score >= 60) {
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
          <AlertTriangle className="h-3 w-3" />
          <span>Acceptable</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
          <XCircle className="h-3 w-3" />
          <span>Below Standard</span>
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-green-200 dark:border-green-900 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-green-600 dark:border-t-green-400 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="h-10 w-10 text-green-600 dark:text-green-400 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Analyzing Technical Documents
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Evaluating technical specifications, quality standards, and compliance...
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-full mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Evaluation Selection</span>
          </button>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Wrench className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Technical Evaluation
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {event.title}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Vendor ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Vendor Name
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Criteria
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Weighted Score
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {evaluations.map((evaluation) => {
                  const weightedScore = calculateWeightedScore(evaluation.criteria);

                  return (
                    <React.Fragment key={evaluation.vendor_id}>
                      <tr
                        className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                          evaluation.submitted ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        <td className="px-4 py-4">
                          <span className="text-sm font-mono text-gray-900 dark:text-white">
                            {getVendorCode(evaluation.vendor_id)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {getVendorName(evaluation.vendor_id)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => toggleRow(evaluation.vendor_id)}
                            className="inline-flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                          >
                            <span>{evaluation.criteria.length} Criteria</span>
                            {expandedRows.has(evaluation.vendor_id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`text-2xl font-bold ${getScoreColor(weightedScore)}`}>
                            {weightedScore}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {getScoreBadge(weightedScore)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => handleSubmitVendor(evaluation.vendor_id)}
                            disabled={evaluation.submitted}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              evaluation.submitted
                                ? 'bg-gray-400 dark:bg-gray-700 text-gray-200 dark:text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {evaluation.submitted ? 'Submitted' : 'Submit'}
                          </button>
                        </td>
                      </tr>

                      {expandedRows.has(evaluation.vendor_id) && (
                        <tr className="bg-gray-50 dark:bg-gray-800/50">
                          <td colSpan={6} className="px-4 py-4">
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Technical Evaluation Criteria
                              </h4>
                              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Evaluation Criteria
                                      </th>
                                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Weight (%)
                                      </th>
                                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        AI Score
                                      </th>
                                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Manual Score
                                      </th>
                                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Final Score
                                      </th>
                                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Related Document
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {evaluation.criteria.map((criterion, index) => {
                                      const finalScore = criterion.manual_score ?? criterion.ai_score;

                                      return (
                                        <React.Fragment key={index}>
                                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-4 py-3">
                                              <select
                                                value={criterion.name}
                                                onChange={(e) => handleCriterionChange(evaluation.vendor_id, criterion.name, e.target.value)}
                                                disabled={evaluation.submitted}
                                                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                              >
                                                {criteriaOptions.map(opt => (
                                                  <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                              </select>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {criterion.weight}%
                                              </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              <div className="flex items-center justify-center space-x-2">
                                                <Brain className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                <span className={`text-lg font-bold ${getScoreColor(criterion.ai_score)}`}>
                                                  {criterion.ai_score}
                                                </span>
                                              </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={criterion.manual_score ?? ''}
                                                onChange={(e) => handleManualScoreChange(evaluation.vendor_id, criterion.name, e.target.value)}
                                                disabled={evaluation.submitted}
                                                placeholder="Override"
                                                className="w-20 px-2 py-1 text-sm text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                              />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              <span className={`text-xl font-bold ${getScoreColor(finalScore)}`}>
                                                {finalScore}
                                              </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              {criterion.documentSectionReference && (
                                                <button
                                                  onClick={() => handlePreviewDocument(getVendorName(evaluation.vendor_id), criterion)}
                                                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                                                >
                                                  <Eye className="h-3 w-3" />
                                                  <span>Preview</span>
                                                </button>
                                              )}
                                            </td>
                                          </tr>
                                          {editingJustification?.vendorId === evaluation.vendor_id &&
                                           editingJustification?.criterionName === criterion.name &&
                                           criterion.manual_score !== null &&
                                           criterion.manual_score !== criterion.ai_score && (
                                            <tr className="bg-blue-50 dark:bg-blue-900/10">
                                              <td colSpan={6} className="px-4 py-3">
                                                <div className="space-y-2">
                                                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                    Justification for Manual Score Override
                                                  </label>
                                                  <textarea
                                                    value={justificationText}
                                                    onChange={(e) => setJustificationText(e.target.value)}
                                                    placeholder="Explain why you are overriding the AI score..."
                                                    rows={2}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                  />
                                                  <button
                                                    onClick={() => handleSaveJustification(evaluation.vendor_id, criterion.name)}
                                                    className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                                                  >
                                                    Save Justification
                                                  </button>
                                                </div>
                                              </td>
                                            </tr>
                                          )}
                                          {criterion.justification && (
                                            <tr className="bg-gray-100 dark:bg-gray-800">
                                              <td colSpan={6} className="px-4 py-2">
                                                <div className="flex items-start space-x-2">
                                                  <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                                                  <div>
                                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Justification:</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                      {criterion.justification}
                                                    </p>
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          )}
                                        </React.Fragment>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {previewDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {previewDocument.criterion}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {previewDocument.vendor} - Page {previewDocument.page}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 min-h-[300px]">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {previewDocument.content}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicalEvaluationScreen;
