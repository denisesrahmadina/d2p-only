import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowLeft, TrendingDown, TrendingUp, Brain, Send, Edit, Save, ChevronDown, ChevronUp, Target, Lightbulb, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line, Cell } from 'recharts';
import mockData from '../../data/eprocurementMockData.json';

interface CostComponents {
  'Main Casing': number;
  'Bearing': number;
  'Oil': number;
  'Core': number;
  'Coil': number;
  'Accessories': number;
}

interface VendorBid {
  vendor_id: string;
  cost_components: CostComponents;
  total_offer: number;
  negotiation_notes: string;
  ai_insight: string;
}

interface CommercialEvaluation {
  sourcing_event_id: string;
  estimated_cost: CostComponents;
  vendor_bids: VendorBid[];
}

interface PostNegotiationVendor {
  vendor_id: string;
  vendor_name: string;
  initial_offer: number;
  final_offer: number;
  revised_offer_1?: number;
  revised_offer_2?: number;
  revised_offer_3?: number;
  negotiation_date: string;
  negotiation_minutes: string;
  key_concession: string;
  ai_score: number;
  manual_score: number | null;
  rank: number;
  justification: string;
  recommendation: string;
}

interface PostNegotiationData {
  sourcing_event_id: string;
  internal_estimate: number;
  vendors: PostNegotiationVendor[];
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

const COMPONENT_COLORS: Record<string, string> = {
  'Main Casing': '#3B82F6',
  'Bearing': '#10B981',
  'Oil': '#F59E0B',
  'Core': '#EF4444',
  'Coil': '#8B5CF6',
  'Accessories': '#EC4899'
};

const CommercialEvaluationScreen: React.FC<Props> = ({ event, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [negotiationRound, setNegotiationRound] = useState(0);
  const [evaluation, setEvaluation] = useState<CommercialEvaluation | null>(null);
  const [postNegotiation, setPostNegotiation] = useState<PostNegotiationData | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);
  const [editingMinutes, setEditingMinutes] = useState<string | null>(null);
  const [editingScores, setEditingScores] = useState<Record<string, string>>({});
  const [editingJustifications, setEditingJustifications] = useState<Record<string, string>>({});
  const [submittingVendor, setSubmittingVendor] = useState<string | null>(null);
  const [submittedVendors, setSubmittedVendors] = useState<Set<string>>(new Set());
  const [expandedNegotiationVendor, setExpandedNegotiationVendor] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (currentRound = 0) => {
    const isRefresh = currentRound > 0;

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    await new Promise(resolve => setTimeout(resolve, isRefresh ? 1500 : 2000));

    try {
      const commercialEvals = (mockData.commercialEvaluations || []) as any[];
      const postNegotiations = (mockData.commercialPostNegotiations || []) as any[];
      const vendorsList = (mockData.vendors || []) as Vendor[];

      const eventEval = commercialEvals.find(e => e.sourcing_event_id === event.sourcing_event_id);
      const postNeg = postNegotiations.find(e => e.sourcing_event_id === event.sourcing_event_id);

      if (eventEval) setEvaluation(eventEval);
      if (postNeg) {
        const enhancedVendors = postNeg.vendors.map((v: any) => {
          const baseReduction1 = 0.02;
          const baseReduction2 = 0.04;
          const baseReduction3 = 0.055;

          const variation = Math.random() * 0.005;

          const vendorData: any = {
            ...v,
            revised_offer_1: undefined,
            revised_offer_2: undefined,
            revised_offer_3: undefined
          };

          if (currentRound >= 1) {
            vendorData.revised_offer_1 = v.initial_offer * (1 - baseReduction1 - variation);
          }

          if (currentRound >= 2) {
            vendorData.revised_offer_2 = v.initial_offer * (1 - baseReduction2 - variation * 1.5);
          }

          if (currentRound >= 3) {
            vendorData.revised_offer_3 = v.initial_offer * (1 - baseReduction3 - variation * 2);
            vendorData.final_offer = vendorData.revised_offer_3;
          }

          return vendorData;
        });

        setPostNegotiation({ ...postNeg, vendors: enhancedVendors });
      }
      setVendors(vendorsList);
    } catch (error) {
      console.error('Failed to load commercial evaluation data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (negotiationRound < 3) {
      const nextRound = negotiationRound + 1;
      setNegotiationRound(nextRound);
      loadData(nextRound);
    }
  };

  const isRefreshDisabled = () => {
    return negotiationRound >= 3 || refreshing;
  };

  const getRefreshButtonLabel = () => {
    if (negotiationRound >= 3) {
      return 'All Rounds Completed';
    }
    if (refreshing) {
      return 'Refreshing...';
    }
    return `Refresh (Round ${negotiationRound + 1}/3)`;
  };

  const getVendorName = (vendorId: string): string => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor ? vendor.vendor_name : vendorId;
  };

  const formatCurrency = (amount: number): string => {
    return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
  };

  const calculateDelta = (current: number, previous: number): number => {
    return ((current - previous) / previous) * 100;
  };

  const getBestAndWorstOffers = (offers: number[]) => {
    const validOffers = offers.filter(o => o > 0);
    return {
      best: Math.min(...validOffers),
      worst: Math.max(...validOffers)
    };
  };

  const getOfferCellStyle = (offer: number, best: number, worst: number) => {
    if (offer === best) return 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-300 font-bold';
    if (offer === worst) return 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-300';
    return '';
  };

  const prepareStackedBreakdownChartData = () => {
    if (!evaluation || !postNegotiation) return [];

    const estimateData: any = {
      name: 'Estimate',
      total: Object.values(evaluation.estimated_cost).reduce((a, b) => a + b, 0)
    };
    Object.entries(evaluation.estimated_cost).forEach(([key, value]) => {
      estimateData[key] = value;
    });

    const vendorData = postNegotiation.vendors
      .sort((a, b) => a.final_offer - b.final_offer)
      .map(vendor => {
        const bid = evaluation.vendor_bids.find(b => b.vendor_id === vendor.vendor_id);
        if (!bid) return null;

        const data: any = {
          name: vendor.vendor_name,
          total: vendor.final_offer
        };
        Object.entries(bid.cost_components).forEach(([key, value]) => {
          data[key] = value;
        });
        return data;
      })
      .filter(Boolean);

    return [estimateData, ...vendorData];
  };

  const prepareCostBreakdownHeatmap = () => {
    if (!evaluation || !postNegotiation) return [];

    const components = Object.keys(evaluation.estimated_cost) as Array<keyof CostComponents>;

    return components.map(component => {
      const estimated = evaluation.estimated_cost[component];
      const vendorOffers = evaluation.vendor_bids.map(bid => bid.cost_components[component]);
      const lowestPrice = Math.min(...vendorOffers);

      const row: any = {
        component,
        estimated,
        lowestPrice
      };

      evaluation.vendor_bids.forEach((bid, index) => {
        const vendorName = getVendorName(bid.vendor_id);
        row[`vendor_${index}`] = bid.cost_components[component];
        row[`vendor_${index}_name`] = vendorName;
      });

      row.best = lowestPrice;
      row.worst = Math.max(...vendorOffers);

      return row;
    });
  };

  const prepareNegotiationAssistantData = (vendorId: string) => {
    if (!evaluation) return [];

    const selectedBid = evaluation.vendor_bids.find(b => b.vendor_id === vendorId);
    if (!selectedBid) return [];

    const components = Object.keys(evaluation.estimated_cost) as Array<keyof CostComponents>;

    const allBids = evaluation.vendor_bids;
    const lowestPrices: Partial<CostComponents> = {};
    components.forEach(comp => {
      lowestPrices[comp] = Math.min(...allBids.map(b => b.cost_components[comp]));
    });

    const componentData = components.map(component => {
      const estimated = evaluation.estimated_cost[component];
      const vendorOffer = selectedBid.cost_components[component];
      const lowestPrice = lowestPrices[component]!;
      const negotiationOpportunity = vendorOffer - lowestPrice;
      const savingsPercent = (negotiationOpportunity / vendorOffer) * 100;

      return {
        component,
        estimated,
        lowestPrice,
        negotiationOpportunity: Math.abs(negotiationOpportunity),
        vendorOffer,
        savingsPercent: Math.abs(savingsPercent)
      };
    });

    const sorted = componentData.sort((a, b) => b.savingsPercent - a.savingsPercent);

    let cumulative = 0;
    return sorted.map(item => {
      cumulative += item.savingsPercent;
      return {
        ...item,
        cumulativeSavings: cumulative
      };
    });
  };

  const handleScoreChange = (vendorId: string, value: string) => {
    setEditingScores(prev => ({
      ...prev,
      [vendorId]: value
    }));
  };

  const handleJustificationChange = (vendorId: string, value: string) => {
    setEditingJustifications(prev => ({
      ...prev,
      [vendorId]: value
    }));
  };

  const getFinalScore = (vendor: PostNegotiationVendor): number => {
    const manualScore = editingScores[vendor.vendor_id];
    if (manualScore && manualScore.trim() !== '') {
      return parseFloat(manualScore);
    }
    return vendor.manual_score !== null ? vendor.manual_score : vendor.ai_score;
  };

  const getJustification = (vendor: PostNegotiationVendor): string => {
    const editedJustification = editingJustifications[vendor.vendor_id];
    if (editedJustification !== undefined) {
      return editedJustification;
    }
    return vendor.justification;
  };

  const handleSubmitVendorScore = async (vendorId: string) => {
    setSubmittingVendor(vendorId);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmittedVendors(prev => new Set(prev).add(vendorId));
    setSubmittingVendor(null);

    console.log(`Commercial score submitted for vendor: ${vendorId}`);
  };

  const isVendorSubmitted = (vendorId: string): boolean => {
    return submittedVendors.has(vendorId);
  };

  const allVendorsSubmitted = (): boolean => {
    if (!postNegotiation) return false;
    return postNegotiation.vendors.every(v => submittedVendors.has(v.vendor_id));
  };

  const getRecommendationBadge = (recommendation: string) => {
    if (recommendation === 'Preferred') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Preferred
        </span>
      );
    } else if (recommendation === 'Alternative') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Alternative
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
          Not Recommended
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Commercial Evaluation...</p>
        </div>
      </div>
    );
  }

  const stackedChartData = prepareStackedBreakdownChartData();
  const heatmapData = prepareCostBreakdownHeatmap();
  const componentKeys = evaluation ? Object.keys(evaluation.estimated_cost) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Evaluation Selection</span>
          </button>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <DollarSign className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Commercial Evaluation
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {event.title}
              </p>
            </div>
          </div>
        </div>

        {/* 1. Offer Summary */}
        {postNegotiation && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Offer Summary
                </h2>
                {negotiationRound > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Negotiation Round: {negotiationRound}/3
                    {negotiationRound >= 3 && (
                      <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">
                        ✓ Completed
                      </span>
                    )}
                  </p>
                )}
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshDisabled()}
                className={`inline-flex items-center space-x-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all ${
                  isRefreshDisabled()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                title={
                  negotiationRound >= 3
                    ? 'All negotiation rounds completed'
                    : 'Click to simulate next negotiation round update'
                }
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{getRefreshButtonLabel()}</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Vendor Name
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Initial Offer
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Revised 1
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Revised 2
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Revised 3
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Final Offer
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Δ vs Previous
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Δ vs Estimate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {postNegotiation.vendors.map((vendor) => {
                    const offers = [
                      vendor.initial_offer,
                      vendor.revised_offer_1 || 0,
                      vendor.revised_offer_2 || 0,
                      vendor.revised_offer_3 || 0,
                      vendor.final_offer
                    ];
                    const { best: bestInRow, worst: worstInRow } = getBestAndWorstOffers(offers);

                    const allInitialOffers = postNegotiation.vendors.map(v => v.initial_offer);
                    const allRevised1 = postNegotiation.vendors.map(v => v.revised_offer_1 || 0).filter(o => o > 0);
                    const allRevised2 = postNegotiation.vendors.map(v => v.revised_offer_2 || 0).filter(o => o > 0);
                    const allRevised3 = postNegotiation.vendors.map(v => v.revised_offer_3 || 0).filter(o => o > 0);
                    const allFinalOffers = postNegotiation.vendors.map(v => v.final_offer);

                    const deltaLatest = calculateDelta(vendor.final_offer, vendor.revised_offer_3 || vendor.revised_offer_2 || vendor.initial_offer);
                    const deltaEstimate = calculateDelta(vendor.final_offer, postNegotiation.internal_estimate);

                    return (
                      <tr key={vendor.vendor_id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {vendor.vendor_name}
                          </span>
                        </td>
                        <td className={`px-4 py-4 text-right text-sm ${getOfferCellStyle(vendor.initial_offer, Math.min(...allInitialOffers), Math.max(...allInitialOffers))}`}>
                          {formatCurrency(vendor.initial_offer)}
                        </td>
                        <td className={`px-4 py-4 text-right text-sm ${vendor.revised_offer_1 ? getOfferCellStyle(vendor.revised_offer_1, Math.min(...allRevised1), Math.max(...allRevised1)) : ''}`}>
                          {vendor.revised_offer_1 ? formatCurrency(vendor.revised_offer_1) : '-'}
                        </td>
                        <td className={`px-4 py-4 text-right text-sm ${vendor.revised_offer_2 ? getOfferCellStyle(vendor.revised_offer_2, Math.min(...allRevised2), Math.max(...allRevised2)) : ''}`}>
                          {vendor.revised_offer_2 ? formatCurrency(vendor.revised_offer_2) : '-'}
                        </td>
                        <td className={`px-4 py-4 text-right text-sm ${vendor.revised_offer_3 ? getOfferCellStyle(vendor.revised_offer_3, Math.min(...allRevised3), Math.max(...allRevised3)) : ''}`}>
                          {vendor.revised_offer_3 ? formatCurrency(vendor.revised_offer_3) : '-'}
                        </td>
                        <td className={`px-4 py-4 text-right text-sm font-bold ${getOfferCellStyle(vendor.final_offer, Math.min(...allFinalOffers), Math.max(...allFinalOffers))}`}>
                          {formatCurrency(vendor.final_offer)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center space-x-1 text-sm font-semibold ${
                            deltaLatest < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {deltaLatest < 0 ? (
                              <TrendingDown className="h-4 w-4" />
                            ) : (
                              <TrendingUp className="h-4 w-4" />
                            )}
                            <span>{Math.abs(deltaLatest).toFixed(2)}%</span>
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center space-x-1 text-sm font-semibold ${
                            deltaEstimate < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {deltaEstimate < 0 ? (
                              <TrendingDown className="h-4 w-4" />
                            ) : (
                              <TrendingUp className="h-4 w-4" />
                            )}
                            <span>{Math.abs(deltaEstimate).toFixed(2)}%</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Material Cost Breakdown Comparison - Stacked Bar Chart */}
        {evaluation && postNegotiation && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Material Cost Breakdown Comparison
            </h2>
            <div className="h-96 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stackedChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" className="text-gray-700 dark:text-gray-300" />
                  <YAxis className="text-gray-700 dark:text-gray-300" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.95)',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                    formatter={(value: any) => formatCurrency(value)}
                  />
                  <Legend />
                  {componentKeys.map((key) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId="a"
                      fill={COMPONENT_COLORS[key] || '#94A3B8'}
                      name={key}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Cost Breakdown Heatmap Table */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Cost Breakdown Heatmap
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                        Cost Component
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                        Estimated Price
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                        Lowest Possible
                      </th>
                      {evaluation.vendor_bids.map((bid, idx) => (
                        <th key={idx} className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          {getVendorName(bid.vendor_id)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {heatmapData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                          {row.component}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                          {formatCurrency(row.estimated)}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-blue-600 dark:text-blue-400">
                          {formatCurrency(row.lowestPrice)}
                        </td>
                        {evaluation.vendor_bids.map((bid, vidx) => {
                          const value = row[`vendor_${vidx}`];
                          return (
                            <td
                              key={vidx}
                              className={`px-3 py-2 text-right ${getOfferCellStyle(value, row.best, row.worst)}`}
                            >
                              {formatCurrency(value)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. Negotiation Assistant - Per Vendor Cards */}
        {evaluation && postNegotiation && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Negotiation Assistant
              </h2>
            </div>

            <div className="space-y-6">
              {evaluation.vendor_bids.map((bid) => {
                const vendorName = getVendorName(bid.vendor_id);
                const negotiationData = prepareNegotiationAssistantData(bid.vendor_id);
                const isExpanded = expandedNegotiationVendor === bid.vendor_id;

                return (
                  <div
                    key={bid.vendor_id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                      onClick={() => setExpandedNegotiationVendor(isExpanded ? null : bid.vendor_id)}
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {vendorName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Total Offer: {formatCurrency(bid.total_offer)}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>

                    {isExpanded && (
                      <div className="p-6 space-y-6">
                        {/* Negotiation Opportunity Graph */}
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                            Negotiation Opportunity Analysis
                          </h4>
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart data={negotiationData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis dataKey="component" className="text-gray-700 dark:text-gray-300" />
                                <YAxis yAxisId="left" className="text-gray-700 dark:text-gray-300" />
                                <YAxis yAxisId="right" orientation="right" className="text-gray-700 dark:text-gray-300" />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                    border: '1px solid #374151',
                                    borderRadius: '0.5rem',
                                    color: '#fff'
                                  }}
                                />
                                <Legend />
                                <Bar
                                  yAxisId="left"
                                  dataKey="negotiationOpportunity"
                                  fill="url(#colorGradient)"
                                  name="Negotiation Opportunity (IDR)"
                                />
                                <Line
                                  yAxisId="right"
                                  type="monotone"
                                  dataKey="cumulativeSavings"
                                  stroke="#F59E0B"
                                  strokeWidth={3}
                                  name="Cumulative % Savings"
                                  dot={{ fill: '#F59E0B', r: 4 }}
                                />
                                <defs>
                                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                  </linearGradient>
                                </defs>
                              </ComposedChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* AI Insight */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                                AI Negotiation Guidance
                              </h4>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                Focus negotiation on <strong>{negotiationData[0]?.component}</strong> and <strong>{negotiationData[1]?.component}</strong>,
                                which account for {negotiationData[2]?.cumulativeSavings.toFixed(1)}% of cumulative saving potential.
                                Achieving benchmark prices on the top 3 components could reduce total spend by {negotiationData[2]?.cumulativeSavings.toFixed(1)}%.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Negotiation Table */}
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                            Component-Level Negotiation Details
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                    Cost Component
                                  </th>
                                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                    Estimated Price
                                  </th>
                                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                    Lowest Possible
                                  </th>
                                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                    Vendor Price
                                  </th>
                                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                    Negotiation Opportunity
                                  </th>
                                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                    % Saving Potential
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {negotiationData.map((row, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                                      {row.component}
                                    </td>
                                    <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                                      {formatCurrency(row.estimated)}
                                    </td>
                                    <td className="px-3 py-2 text-right font-semibold text-blue-600 dark:text-blue-400">
                                      {formatCurrency(row.lowestPrice)}
                                    </td>
                                    <td className="px-3 py-2 text-right text-gray-900 dark:text-white font-medium">
                                      {formatCurrency(row.vendorOffer)}
                                    </td>
                                    <td className="px-3 py-2 text-right text-orange-600 dark:text-orange-400 font-semibold"
                                        title={`Calculated as Vendor Price – Lowest Possible Price`}>
                                      {formatCurrency(row.negotiationOpportunity)}
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                      <span className={`font-semibold ${
                                        row.savingsPercent > 3 ? 'text-green-600 dark:text-green-400' :
                                        row.savingsPercent > 1 ? 'text-yellow-600 dark:text-yellow-400' :
                                        'text-gray-600 dark:text-gray-400'
                                      }`}>
                                        {row.savingsPercent.toFixed(2)}%
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Final Commercial Evaluation Scoring */}
        {postNegotiation && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Final Commercial Evaluation Scoring
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Vendor Name
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Final Offer
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      AI Score (0-20)
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Manual Score
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Final Score
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Justification
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {postNegotiation.vendors.sort((a, b) => a.final_offer - b.final_offer).map((vendor, index) => {
                    const finalScore = getFinalScore(vendor);
                    const normalizedScore = (finalScore / 100) * 20;
                    const rank = index + 1;
                    const isSubmitted = isVendorSubmitted(vendor.vendor_id);
                    const isSubmitting = submittingVendor === vendor.vendor_id;

                    return (
                      <tr
                        key={vendor.vendor_id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                          rank === 1 ? 'bg-green-50 dark:bg-green-900/10' : ''
                        } ${isSubmitted ? 'opacity-75' : ''}`}
                      >
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {vendor.vendor_name}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                          {formatCurrency(vendor.final_offer)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            rank === 1
                              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                          }`}>
                            {rank}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {((vendor.ai_score / 100) * 20).toFixed(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.1"
                            value={editingScores[vendor.vendor_id] || ''}
                            onChange={(e) => handleScoreChange(vendor.vendor_id, e.target.value)}
                            placeholder={vendor.manual_score ? ((vendor.manual_score / 100) * 20).toFixed(1) : '-'}
                            disabled={isSubmitted}
                            className="w-20 px-2 py-1 text-sm text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">
                            {normalizedScore.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                          {isSubmitted ? (
                            <span>{getJustification(vendor)}</span>
                          ) : (
                            <input
                              type="text"
                              value={editingJustifications[vendor.vendor_id] !== undefined ? editingJustifications[vendor.vendor_id] : vendor.justification}
                              onChange={(e) => handleJustificationChange(vendor.vendor_id, e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {isSubmitted ? (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Finalized
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSubmitVendorScore(vendor.vendor_id)}
                              disabled={isSubmitting}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-xs font-medium rounded-lg transition-colors"
                              title="Submit final commercial score for this vendor"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                                  <span>Submitting...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="h-3 w-3 mr-1" />
                                  <span>Submit</span>
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Completion Banner */}
            {allVendorsSubmitted() && (
              <div className="mt-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      All Commercial Evaluations Completed
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      All vendor commercial evaluations have been finalized and submitted successfully.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Summary */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                    AI-Generated Summary
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {postNegotiation.ai_summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Minutes of Negotiation */}
        {postNegotiation && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Edit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span>Minutes of Negotiation</span>
            </h2>

            <div className="space-y-4">
              {postNegotiation.vendors.map((vendor) => (
                <div
                  key={vendor.vendor_id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 cursor-pointer"
                    onClick={() => setExpandedVendor(expandedVendor === vendor.vendor_id ? null : vendor.vendor_id)}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {vendor.vendor_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Negotiated on {new Date(vendor.negotiation_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingMinutes(editingMinutes === vendor.vendor_id ? null : vendor.vendor_id);
                        }}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                      >
                        {editingMinutes === vendor.vendor_id ? (
                          <>
                            <Save className="h-4 w-4" />
                            <span>Save</span>
                          </>
                        ) : (
                          <>
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </>
                        )}
                      </button>
                      {expandedVendor === vendor.vendor_id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {expandedVendor === vendor.vendor_id && (
                    <div className="p-4">
                      {editingMinutes === vendor.vendor_id ? (
                        <textarea
                          defaultValue={vendor.negotiation_minutes}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono resize-y min-h-[250px]"
                          placeholder="Enter negotiation minutes..."
                        />
                      ) : (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Key Concession:
                              </h4>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {vendor.key_concession}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Detailed Minutes:
                              </h4>
                              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                                {vendor.negotiation_minutes}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommercialEvaluationScreen;
