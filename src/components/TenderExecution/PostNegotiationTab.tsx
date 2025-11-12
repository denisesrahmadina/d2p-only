import React, { useState } from 'react';
import { Edit, Save, TrendingDown, TrendingUp, Brain, CheckCircle, AlertTriangle, XCircle, Send } from 'lucide-react';

interface PostNegotiationVendor {
  vendor_id: string;
  vendor_name: string;
  initial_offer: number;
  final_offer: number;
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
  ai_summary: string;
}

interface Props {
  data: PostNegotiationData;
}

const PostNegotiationTab: React.FC<Props> = ({ data }) => {
  const [editingMinutes, setEditingMinutes] = useState<string | null>(null);
  const [editingScores, setEditingScores] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const formatCurrency = (value: number): string => {
    return `$${value.toLocaleString()}`;
  };

  const calculateDeltaVsInitial = (initial: number, final: number): number => {
    return ((final - initial) / initial) * 100;
  };

  const calculateDeltaVsEstimate = (final: number, estimate: number): number => {
    return ((final - estimate) / estimate) * 100;
  };

  const getFinalScore = (vendor: PostNegotiationVendor): number => {
    const manualScore = editingScores[vendor.vendor_id];
    if (manualScore && manualScore.trim() !== '') {
      return parseFloat(manualScore);
    }
    return vendor.manual_score !== null ? vendor.manual_score : vendor.ai_score;
  };

  const handleScoreChange = (vendorId: string, value: string) => {
    setEditingScores(prev => ({
      ...prev,
      [vendorId]: value
    }));
  };

  const handleSubmitFinalScores = async () => {
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Final commercial scores submitted:', data);
    setSubmitting(false);
    alert('Final commercial evaluation submitted successfully (mock)!');
  };

  const getRecommendationBadge = (recommendation: string) => {
    if (recommendation === 'Preferred') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
          <CheckCircle className="h-3 w-3 mr-1" />
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
          <XCircle className="h-3 w-3 mr-1" />
          Not Recommended
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Minutes of Negotiation Section */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Edit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span>Minutes of Negotiation</span>
        </h2>

        <div className="space-y-4">
          {data.vendors.map((vendor) => (
            <div
              key={vendor.vendor_id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {vendor.vendor_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vendor ID: {vendor.vendor_id} • Negotiated on {new Date(vendor.negotiation_date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setEditingMinutes(editingMinutes === vendor.vendor_id ? null : vendor.vendor_id)}
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
                      <span>Edit Minutes</span>
                    </>
                  )}
                </button>
              </div>

              {editingMinutes === vendor.vendor_id ? (
                <textarea
                  defaultValue={vendor.negotiation_minutes}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono resize-y min-h-[200px]"
                  placeholder="Enter negotiation minutes..."
                />
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line font-mono">
                  {vendor.negotiation_minutes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Latest Vendor Offer Summary */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Post-Negotiation Offer Summary
        </h2>

        <div className="overflow-x-auto mb-6">
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
                  Final Offer
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Delta vs Initial
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Delta vs Estimate
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Key Concession
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.vendors.map((vendor) => {
                const deltaInitial = calculateDeltaVsInitial(vendor.initial_offer, vendor.final_offer);
                const deltaEstimate = calculateDeltaVsEstimate(vendor.final_offer, data.internal_estimate);

                return (
                  <tr key={vendor.vendor_id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {vendor.vendor_name}
                        </span>
                        {vendor.rank === 1 && (
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded">
                            Rank 1
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-gray-700 dark:text-gray-300">
                      {formatCurrency(vendor.initial_offer)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(vendor.final_offer)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-sm font-semibold flex items-center space-x-1 ${
                          deltaInitial < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {deltaInitial < 0 ? (
                            <TrendingDown className="h-4 w-4" />
                          ) : (
                            <TrendingUp className="h-4 w-4" />
                          )}
                          <span>{deltaInitial.toFixed(1)}%</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-sm font-semibold flex items-center space-x-1 ${
                          deltaEstimate < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {deltaEstimate < 0 ? (
                            <TrendingDown className="h-4 w-4" />
                          ) : (
                            <TrendingUp className="h-4 w-4" />
                          )}
                          <span>{deltaEstimate.toFixed(1)}%</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {vendor.key_concession}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                AI-Generated Insight
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {data.ai_summary}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Commercial Evaluation Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Final Commercial Evaluation
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
                  AI Score
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Manual Override
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Final Score
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Recommendation
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Justification
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.vendors.sort((a, b) => a.rank - b.rank).map((vendor) => {
                const finalScore = getFinalScore(vendor);

                return (
                  <tr
                    key={vendor.vendor_id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                      vendor.rank === 1 ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
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
                        vendor.rank === 1
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                      }`}>
                        {vendor.rank}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {vendor.ai_score}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editingScores[vendor.vendor_id] || ''}
                        onChange={(e) => handleScoreChange(vendor.vendor_id, e.target.value)}
                        placeholder={vendor.manual_score?.toString() || '-'}
                        className="w-20 px-2 py-1 text-sm text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {finalScore}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getRecommendationBadge(vendor.recommendation)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {vendor.justification}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmitFinalScores}
          disabled={submitting}
          className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white text-lg font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="h-6 w-6" />
              <span>Submit Final Commercial Score</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PostNegotiationTab;
