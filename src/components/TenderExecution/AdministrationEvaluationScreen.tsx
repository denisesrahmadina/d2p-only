import React, { useState, useEffect } from 'react';
import { FileCheck, CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, ArrowLeft, Brain, FileText, X, Eye } from 'lucide-react';
import mockData from '../../data/eprocurementMockData.json';

interface Document {
  name: string;
  status: string;
  validity: string;
}

interface VendorEvaluation {
  vendor_id: string;
  scenario: string;
  documents: Document[];
  submitted: boolean;
  evaluationResult: 'Pass' | 'Not Pass';
  justification: string;
  editedDocuments: Record<string, { status: string; validity: string; justification: string }>;
}

interface AdministrationEvaluation {
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

const AdministrationEvaluationScreen: React.FC<Props> = ({ event, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState<VendorEvaluation[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [previewDocument, setPreviewDocument] = useState<{ vendor: string; doc: Document } | null>(null);
  const [editingJustification, setEditingJustification] = useState<{ vendorId: string; docName: string } | null>(null);
  const [justificationText, setJustificationText] = useState('');

  useEffect(() => {
    simulateAIProcessing();
  }, []);

  const simulateAIProcessing = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const adminEvals = (mockData.administrationEvaluations || []) as any[];
      const vendorsList = (mockData.vendors || []) as Vendor[];

      const eventEval = adminEvals.find(e => e.sourcing_event_id === event.sourcing_event_id);

      if (eventEval) {
        const enhancedEvaluations = eventEval.vendor_evaluations.map((ve: any) => ({
          ...ve,
          submitted: false,
          evaluationResult: calculateEvaluationResult(ve.documents),
          justification: ve.justification || '',
          editedDocuments: {}
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

  const calculateEvaluationResult = (documents: Document[]): 'Pass' | 'Not Pass' => {
    const allPass = documents.every(doc => doc.status === 'Complete' && doc.validity === 'Valid');
    return allPass ? 'Pass' : 'Not Pass';
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

  const handleStatusChange = (vendorId: string, docName: string, newStatus: string) => {
    setEvaluations(prev => prev.map(evaluation => {
      if (evaluation.vendor_id === vendorId) {
        const updatedDocuments = evaluation.documents.map(doc =>
          doc.name === docName ? { ...doc, status: newStatus } : doc
        );

        const editedDoc = evaluation.editedDocuments[docName] || { status: '', validity: '', justification: '' };
        const updatedEditedDocuments = {
          ...evaluation.editedDocuments,
          [docName]: { ...editedDoc, status: newStatus }
        };

        return {
          ...evaluation,
          documents: updatedDocuments,
          editedDocuments: updatedEditedDocuments,
          evaluationResult: calculateEvaluationResult(updatedDocuments)
        };
      }
      return evaluation;
    }));

    setEditingJustification({ vendorId, docName });
  };

  const handleValidityChange = (vendorId: string, docName: string, newValidity: string) => {
    setEvaluations(prev => prev.map(evaluation => {
      if (evaluation.vendor_id === vendorId) {
        const updatedDocuments = evaluation.documents.map(doc =>
          doc.name === docName ? { ...doc, validity: newValidity } : doc
        );

        const editedDoc = evaluation.editedDocuments[docName] || { status: '', validity: '', justification: '' };
        const updatedEditedDocuments = {
          ...evaluation.editedDocuments,
          [docName]: { ...editedDoc, validity: newValidity }
        };

        return {
          ...evaluation,
          documents: updatedDocuments,
          editedDocuments: updatedEditedDocuments,
          evaluationResult: calculateEvaluationResult(updatedDocuments)
        };
      }
      return evaluation;
    }));

    setEditingJustification({ vendorId, docName });
  };

  const handleSaveJustification = (vendorId: string, docName: string) => {
    setEvaluations(prev => prev.map(evaluation => {
      if (evaluation.vendor_id === vendorId) {
        const updatedEditedDocuments = {
          ...evaluation.editedDocuments,
          [docName]: {
            ...evaluation.editedDocuments[docName],
            justification: justificationText
          }
        };

        return {
          ...evaluation,
          editedDocuments: updatedEditedDocuments
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

  const handlePreviewDocument = (vendorName: string, doc: Document) => {
    setPreviewDocument({ vendor: vendorName, doc });
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Complete') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
          <CheckCircle className="h-3 w-3" />
          <span>{status}</span>
        </span>
      );
    } else if (status === 'Incomplete') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
          <AlertTriangle className="h-3 w-3" />
          <span>{status}</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
          <XCircle className="h-3 w-3" />
          <span>{status}</span>
        </span>
      );
    }
  };

  const getValidityBadge = (validity: string) => {
    if (validity === 'Valid') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
          {validity}
        </span>
      );
    } else if (validity === 'N/A') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          {validity}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400">
          {validity}
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
              <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Processing Documents
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Analyzing vendor administrative documents and compliance...
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FileCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Administration Evaluation
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
                    Documents
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Evaluation Result
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {evaluations.map((evaluation) => (
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
                          <span>{evaluation.documents.length} Documents</span>
                          {expandedRows.has(evaluation.vendor_id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {evaluation.evaluationResult === 'Pass' ? (
                          <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-bold bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <span>Pass</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-bold bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                            <XCircle className="h-4 w-4" />
                            <span>Not Pass</span>
                          </span>
                        )}
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
                        <td colSpan={5} className="px-4 py-4">
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                              Administration Documents
                            </h4>
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                                      Document Name
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                                      Status
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                                      Validity
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {evaluation.documents.map((doc, index) => (
                                    <React.Fragment key={index}>
                                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                          {doc.name}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <select
                                            value={doc.status}
                                            onChange={(e) => handleStatusChange(evaluation.vendor_id, doc.name, e.target.value)}
                                            disabled={evaluation.submitted}
                                            className="px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                            <option value="Complete">Complete</option>
                                            <option value="Incomplete">Incomplete</option>
                                            <option value="Missing">Missing</option>
                                          </select>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <select
                                            value={doc.validity}
                                            onChange={(e) => handleValidityChange(evaluation.vendor_id, doc.name, e.target.value)}
                                            disabled={evaluation.submitted}
                                            className="px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                            <option value="Valid">Valid</option>
                                            <option value="Not Valid">Not Valid</option>
                                            <option value="Expired">Expired</option>
                                            <option value="Pending">Pending</option>
                                          </select>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <button
                                            onClick={() => handlePreviewDocument(getVendorName(evaluation.vendor_id), doc)}
                                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                                          >
                                            <Eye className="h-3 w-3" />
                                            <span>Preview Document</span>
                                          </button>
                                        </td>
                                      </tr>
                                      {editingJustification?.vendorId === evaluation.vendor_id &&
                                       editingJustification?.docName === doc.name && (
                                        <tr className="bg-blue-50 dark:bg-blue-900/10">
                                          <td colSpan={4} className="px-4 py-3">
                                            <div className="space-y-2">
                                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                Justification for Changes
                                              </label>
                                              <textarea
                                                value={justificationText}
                                                onChange={(e) => setJustificationText(e.target.value)}
                                                placeholder="Enter justification for status/validity changes..."
                                                rows={2}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                              />
                                              <button
                                                onClick={() => handleSaveJustification(evaluation.vendor_id, doc.name)}
                                                className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                                              >
                                                Save Justification
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      )}
                                      {evaluation.editedDocuments[doc.name]?.justification && (
                                        <tr className="bg-gray-100 dark:bg-gray-800">
                                          <td colSpan={4} className="px-4 py-2">
                                            <div className="flex items-start space-x-2">
                                              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                                              <div>
                                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Justification:</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                  {evaluation.editedDocuments[doc.name].justification}
                                                </p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      )}
                                    </React.Fragment>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {previewDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {previewDocument.doc.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {previewDocument.vendor}
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
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <FileText className="h-24 w-24 text-gray-400 dark:text-gray-600 mx-auto" />
                    <div>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Document Preview
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {previewDocument.doc.name}
                      </p>
                      <div className="mt-4 flex items-center justify-center space-x-2">
                        {getStatusBadge(previewDocument.doc.status)}
                        {getValidityBadge(previewDocument.doc.validity)}
                      </div>
                    </div>
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

export default AdministrationEvaluationScreen;
