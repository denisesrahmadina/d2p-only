import React, { useState, useEffect } from 'react';
import { Award, ChevronDown, ChevronUp, ChevronRight, Package, Users, DollarSign, Calendar, Tag, X, FileCheck, Wrench, TrendingUp } from 'lucide-react';
import mockData from '../../data/eprocurementMockData.json';
import AdministrationEvaluationScreen from './AdministrationEvaluationScreen';
import TechnicalEvaluationScreen from './TechnicalEvaluationScreen';
import CommercialEvaluationScreen from './CommercialEvaluationScreen';
import TenderEvaluationSummaryCard from './TenderEvaluationSummaryCard';

interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unit_price: number;
}

interface SourcingEventBundle {
  id: string;
  sourcing_event_id: string;
  title: string;
  estimated_price: number;
  vendor_participants: string[];
  materials: Material[];
  category: string;
  status: string;
  created_at: string;
}

interface Vendor {
  id: string;
  vendor_name: string;
  vendor_code: string;
  category: string;
  performance_rating: number;
}

interface TenderEvaluationSummary {
  sourcing_event_id: string;
  event_name: string;
  evaluation_status: string;
  weights: {
    administration: number;
    technical: number;
    commercial: number;
  };
  vendors: any[];
  winner: any;
  ai_summary: string;
  insights: string[];
  next_steps: string[];
}

type EvaluationType = 'administration' | 'technical' | 'commercial';
type ViewMode = 'list' | 'administration' | 'technical' | 'commercial';

const TenderEvaluationWorkflowV2: React.FC = () => {
  const [sourcingEvents, setSourcingEvents] = useState<SourcingEventBundle[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [evaluationSummaries, setEvaluationSummaries] = useState<TenderEvaluationSummary[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SourcingEventBundle | null>(null);
  const [selectedEvaluationType, setSelectedEvaluationType] = useState<EvaluationType>('administration');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const events = (mockData.sourcingEventBundling || []) as SourcingEventBundle[];
      const vendorsList = (mockData.vendors || []) as Vendor[];
      const summaries = (mockData.tenderEvaluationSummaries || []) as TenderEvaluationSummary[];

      setSourcingEvents(events);
      setVendors(vendorsList);
      setEvaluationSummaries(summaries);
    } catch (error) {
      console.error('Failed to load sourcing events:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (eventId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const getVendorName = (vendorId: string): string => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor ? vendor.vendor_name : vendorId;
  };

  const formatCurrency = (amount: number): string => {
    return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
  };

  const handleProceedToEvaluation = (event: SourcingEventBundle) => {
    setSelectedEvent(event);
    setShowEvaluationModal(true);
  };

  const getEvaluationSummary = (sourcingEventId: string): TenderEvaluationSummary | null => {
    return evaluationSummaries.find(s => s.sourcing_event_id === sourcingEventId) || null;
  };

  const handleCloseModal = () => {
    setShowEvaluationModal(false);
    setSelectedEvent(null);
    setSelectedEvaluationType('administration');
  };

  const handleProceedWithEvaluation = () => {
    console.log('Proceeding with evaluation:', {
      event: selectedEvent?.id,
      evaluationType: selectedEvaluationType
    });
    setShowEvaluationModal(false);
    setViewMode(selectedEvaluationType);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedEvent(null);
    setSelectedEvaluationType('administration');
  };

  // Show administration evaluation screen
  if (viewMode === 'administration' && selectedEvent) {
    return (
      <AdministrationEvaluationScreen
        event={selectedEvent}
        onBack={handleBackToList}
      />
    );
  }

  // Show technical evaluation screen
  if (viewMode === 'technical' && selectedEvent) {
    return (
      <TechnicalEvaluationScreen
        event={selectedEvent}
        onBack={handleBackToList}
      />
    );
  }

  // Show commercial evaluation screen
  if (viewMode === 'commercial' && selectedEvent) {
    return (
      <CommercialEvaluationScreen
        event={selectedEvent}
        onBack={handleBackToList}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Sourcing Events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Award className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Tender Evaluation
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Review and evaluate sourcing event bundles ready for tender evaluation
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{sourcingEvents.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(sourcingEvents.reduce((sum, e) => sum + e.estimated_price, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(sourcingEvents.flatMap(e => e.vendor_participants)).size}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(sourcingEvents.map(e => e.category)).size}
                </p>
              </div>
              <Tag className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Sourcing Events Table */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Sourcing Event ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Estimated Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Vendor Participants
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Materials
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {sourcingEvents.map((event) => (
                  <React.Fragment key={event.id}>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.sourcing_event_id}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {new Date(event.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                          {event.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(event.estimated_price)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {event.vendor_participants.slice(0, 2).map((vendorId) => (
                            <span
                              key={vendorId}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400"
                            >
                              {getVendorName(vendorId)}
                            </span>
                          ))}
                          {event.vendor_participants.length > 2 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                              +{event.vendor_participants.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => toggleRow(event.id)}
                          className="inline-flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                        >
                          <span>{event.materials.length} Items</span>
                          {expandedRows.has(event.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleProceedToEvaluation(event)}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <span>Proceed to Evaluation</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Material Details / Evaluation Summary Row */}
                    {expandedRows.has(event.id) && (
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        <td colSpan={7} className="px-4 py-4">
                          {getEvaluationSummary(event.sourcing_event_id) ? (
                            <TenderEvaluationSummaryCard summary={getEvaluationSummary(event.sourcing_event_id)!} />
                          ) : (
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                Material Details
                              </h4>
                              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <table className="w-full">
                                <thead>
                                  <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                                      Material ID
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                                      Material Name
                                    </th>
                                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                                      Quantity
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                                      Unit
                                    </th>
                                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                                      Unit Price
                                    </th>
                                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                                      Total Value
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {event.materials.map((material) => (
                                    <tr key={material.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                      <td className="px-4 py-2 text-sm font-mono text-gray-600 dark:text-gray-400">
                                        {material.id}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                        {material.name}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-white font-medium">
                                        {material.quantity.toLocaleString('id-ID')}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                        {material.unit}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-white">
                                        {formatCurrency(material.unit_price)}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(material.quantity * material.unit_price)}
                                      </td>
                                    </tr>
                                  ))}
                                  <tr className="bg-yellow-50 dark:bg-yellow-900/10 font-semibold">
                                    <td colSpan={5} className="px-4 py-2 text-sm text-right text-gray-900 dark:text-white">
                                      Subtotal:
                                    </td>
                                    <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-white">
                                      {formatCurrency(
                                        event.materials.reduce(
                                          (sum, m) => sum + m.quantity * m.unit_price,
                                          0
                                        )
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evaluation Selection Modal */}
        {showEvaluationModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Select Evaluation Process
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedEvent.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Event Summary */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Sourcing Event ID</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedEvent.sourcing_event_id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Estimated Price</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(selectedEvent.estimated_price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Category</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedEvent.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Vendor Participants</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedEvent.vendor_participants.length} vendors</p>
                    </div>
                  </div>
                </div>

                {/* Evaluation Type Selection */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                    Choose Evaluation Process
                  </label>

                  {/* Administration Evaluation */}
                  <button
                    onClick={() => setSelectedEvaluationType('administration')}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedEvaluationType === 'administration'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        selectedEvaluationType === 'administration'
                          ? 'bg-blue-100 dark:bg-blue-900/30'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <FileCheck className={`h-6 w-6 ${
                          selectedEvaluationType === 'administration'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                          Administration Evaluation
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Evaluate based on administrative criteria including legal compliance, document completeness, vendor registration status, and regulatory requirements.
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedEvaluationType === 'administration'
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedEvaluationType === 'administration' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Technical Evaluation */}
                  <button
                    onClick={() => setSelectedEvaluationType('technical')}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedEvaluationType === 'technical'
                        ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        selectedEvaluationType === 'technical'
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <Wrench className={`h-6 w-6 ${
                          selectedEvaluationType === 'technical'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                          Technical Evaluation
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Evaluate based on technical criteria including product specifications, compliance with standards, technical capability, quality certifications, and performance benchmarks.
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedEvaluationType === 'technical'
                          ? 'border-green-600 bg-green-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedEvaluationType === 'technical' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Commercial Evaluation */}
                  <button
                    onClick={() => setSelectedEvaluationType('commercial')}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedEvaluationType === 'commercial'
                        ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-600'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        selectedEvaluationType === 'commercial'
                          ? 'bg-orange-100 dark:bg-orange-900/30'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <TrendingUp className={`h-6 w-6 ${
                          selectedEvaluationType === 'commercial'
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                          Commercial Evaluation
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Evaluate based on commercial aspects including pricing competitiveness, payment terms, delivery schedule, vendor financial stability, and overall value proposition.
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedEvaluationType === 'commercial'
                          ? 'border-orange-600 bg-orange-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedEvaluationType === 'commercial' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedWithEvaluation}
                  className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2"
                >
                  <span>Proceed with Evaluation</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenderEvaluationWorkflowV2;
