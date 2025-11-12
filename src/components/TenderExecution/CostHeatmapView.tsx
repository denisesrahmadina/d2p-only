import React, { useState } from 'react';
import { Info, Sparkles, ChevronDown, ChevronUp, Target, TrendingDown, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';
import { EvaluationData } from '../../types/tenderAnalytics';

interface CostHeatmapViewProps {
  evaluationData: EvaluationData;
}

const CostHeatmapView: React.FC<CostHeatmapViewProps> = ({ evaluationData }) => {
  const [insightsExpanded, setInsightsExpanded] = useState(true);

  const aiInsights = [
    {
      id: 1,
      type: 'opportunity',
      icon: TrendingDown,
      title: 'Cherry Pick Strategy Saves 8.2%',
      description: 'By selecting the lowest quoted price for each component, you can achieve total savings of IDR 43.2M (8.2%) compared to awarding the entire contract to a single vendor.',
      impact: 'High',
      priority: 'high',
      actionItems: [
        'Verify all selected vendors can meet delivery timeline requirements',
        'Assess logistics coordination complexity for multi-vendor approach',
        'Negotiate bulk discount with General Electric for oil and coil components'
      ]
    },
    {
      id: 2,
      type: 'risk',
      icon: AlertTriangle,
      title: 'Schneider Electric Pricing Concerns',
      description: 'Schneider Electric quoted 25% above estimate for core component (IDR 389.6M vs IDR 385.8M estimated). This represents the highest variance among all suppliers.',
      impact: 'Medium',
      priority: 'medium',
      actionItems: [
        'Request detailed cost breakdown from Schneider Electric for core component',
        'Clarify if premium includes additional warranty or service benefits',
        'Consider negotiation focusing on core component price reduction'
      ]
    },
    {
      id: 3,
      type: 'insight',
      icon: Lightbulb,
      title: 'ABB Offers Balanced Pricing',
      description: 'ABB demonstrates consistent pricing across most components, with only 2.1% overall variance from estimates. This suggests reliable cost estimation and competitive positioning.',
      impact: 'Low',
      priority: 'low',
      actionItems: [
        'Use ABB pricing as benchmark for negotiating with other vendors',
        'Consider ABB as primary vendor if multi-vendor coordination is not feasible',
        'Request volume discount for potential future orders'
      ]
    },
    {
      id: 4,
      type: 'opportunity',
      icon: Target,
      title: 'Strategic Negotiation Leverage Points',
      description: 'Three components (accessories, oil, casing) show competitive pricing below 80% of estimate across multiple vendors, indicating strong market competition.',
      impact: 'High',
      priority: 'high',
      actionItems: [
        'Leverage competitive pressure to negotiate further 3-5% reduction on these components',
        'Request best and final offers (BAFO) round for these highly competitive items',
        'Consider extending contract terms for additional discounts'
      ]
    },
    {
      id: 5,
      type: 'success',
      icon: CheckCircle2,
      title: 'General Electric Oil Component Excellence',
      description: 'General Electric offers the most competitive pricing for oil component at IDR 97.3M, which is 3.1% below estimate and 23% lower than Schneider Electric.',
      impact: 'Medium',
      priority: 'medium',
      actionItems: [
        'Confirm GE oil component specifications match technical requirements',
        'Verify GE delivery capabilities for required volume',
        'Explore bundling opportunities with GE for coil components'
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      case 'low':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'risk':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      case 'success':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20';
    }
  };
  const getCellColor = (value: number, estimated: number) => {
    const ratio = value / estimated;
    if (ratio > 1.0) {
      return 'bg-red-100 dark:bg-red-900/20 text-red-900 dark:text-red-300';
    } else if (ratio >= 0.8 && ratio <= 1.0) {
      return 'bg-orange-100 dark:bg-orange-900/20 text-orange-900 dark:text-orange-300';
    } else {
      return 'bg-teal-100 dark:bg-teal-900/20 text-teal-900 dark:text-teal-300';
    }
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
        Distribution Transformer - 20kV/400V DYN5
      </h3>

      <div className="flex items-start gap-6">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  COST COMPONENT
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  ESTIMATED
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  CHERRY PICK
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  SCHNEIDER ELECTRIC
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  GENERAL ELECTRIC
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  ABB
                </th>
              </tr>
            </thead>
            <tbody>
              {evaluationData.costComponents.map((comp, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {comp.component}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm text-gray-900 dark:text-white font-medium">
                    {formatNumber(comp.estimated)}
                  </td>
                  <td className={`border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold ${getCellColor(comp.cherryPick, comp.estimated)}`}>
                    {formatNumber(comp.cherryPick)}
                  </td>
                  <td className={`border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold ${getCellColor(comp.schneiderElectric, comp.estimated)}`}>
                    {formatNumber(comp.schneiderElectric)}
                  </td>
                  <td className={`border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold ${getCellColor(comp.generalElectric, comp.estimated)}`}>
                    {formatNumber(comp.generalElectric)}
                  </td>
                  <td className={`border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm font-semibold ${getCellColor(comp.abb, comp.estimated)}`}>
                    {formatNumber(comp.abb)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex-shrink-0 w-80">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Legend</h4>
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 bg-teal-100 dark:bg-teal-900/20 border border-teal-300 dark:border-teal-700 rounded flex-shrink-0 mt-0.5"></div>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  Quoted price is within 80-100% of estimated price
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 bg-orange-100 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded flex-shrink-0 mt-0.5"></div>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  Quoted price is less than 80% of estimated price
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded flex-shrink-0 mt-0.5"></div>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  Quoted price is higher than estimated price
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-teal-50 dark:bg-teal-900/10 rounded-lg p-3 border border-teal-200 dark:border-teal-800">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-teal-800 dark:text-teal-300">
                    <span className="font-semibold">Cherry pick value</span> is the lowest quoted price from all supplier
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950/20 dark:to-blue-950/20 rounded-xl border-2 border-teal-200 dark:border-teal-800 overflow-hidden">
        <button
          onClick={() => setInsightsExpanded(!insightsExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-teal-100/50 dark:hover:bg-teal-900/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              AI Insights & Action Plan
            </h3>
          </div>
          {insightsExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>

        {insightsExpanded && (
          <div className="px-6 pb-6 space-y-4">
            {aiInsights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div
                  key={insight.id}
                  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg ${getIconColor(insight.type)} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="text-base font-bold text-gray-900 dark:text-white">
                          {insight.title}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(insight.priority)}`}>
                          {insight.impact} Impact
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        {insight.description}
                      </p>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h5 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                          Recommended Actions
                        </h5>
                        <ul className="space-y-2">
                          {insight.actionItems.map((action, actionIndex) => (
                            <li key={actionIndex} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 mt-1.5 flex-shrink-0"></div>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="bg-teal-100 dark:bg-teal-900/30 rounded-lg p-4 border border-teal-300 dark:border-teal-700">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-teal-700 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-teal-900 dark:text-teal-300">
                  <p className="font-semibold mb-1">About AI Insights</p>
                  <p>
                    These insights are generated by analyzing pricing patterns, variance from estimates, and competitive positioning across all suppliers.
                    Action items are prioritized based on potential cost savings and risk mitigation opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CostHeatmapView;
