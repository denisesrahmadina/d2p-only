import React, { useState, useEffect } from 'react';
import {
  Target,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Handshake,
  ShieldCheck,
} from 'lucide-react';
import { aiInsightsService, AIInsight } from '../../services/aiInsightsService';

interface QuoteActionPlanSectionProps {
  tenderId: string;
  viewMode: 'table' | 'graph';
  className?: string;
}

const QuoteActionPlanSection: React.FC<QuoteActionPlanSectionProps> = ({
  tenderId,
  viewMode,
  className = '',
}) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadActionPlanInsights();
  }, [tenderId, viewMode]);

  const loadActionPlanInsights = async () => {
    setLoading(true);
    try {
      const data = await aiInsightsService.getInsights({
        module: 'tender_analytics',
        page: 'quote_detail',
        view_mode: viewMode,
        context_id: tenderId,
      });

      setInsights(data);

      if (data.length > 0) {
        const autoExpand = new Set<string>();
        data.slice(0, 2).forEach((insight) => autoExpand.add(insight.id));
        setExpandedActions(autoExpand);
      }
    } catch (error) {
      console.error('Error loading action plan insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActionExpanded = (id: string) => {
    const newExpanded = new Set(expandedActions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedActions(newExpanded);
  };

  const handleAcknowledge = async (id: string) => {
    await aiInsightsService.updateInsightAction(id, 'Acknowledged', 'Current User');
    loadActionPlanInsights();
  };

  const handleDismiss = async (id: string) => {
    await aiInsightsService.updateInsightAction(id, 'Dismissed', 'Current User');
    loadActionPlanInsights();
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'Pricing':
        return DollarSign;
      case 'Negotiation':
        return Handshake;
      case 'Risk':
        return AlertTriangle;
      case 'Strategic':
        return Target;
      case 'Cost_Optimization':
        return TrendingDown;
      default:
        return ShieldCheck;
    }
  };

  const getPriorityBadge = (severity: string) => {
    const styles = aiInsightsService.getSeverityStyles(severity);
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${styles.bg} ${styles.text} ${styles.border} border`}
      >
        {severity} Priority
      </span>
    );
  };

  if (loading) {
    return (
      <div
        className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 ${className}`}
      >
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Loading action plan insights...
          </span>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-lg border-2 border-teal-300 dark:border-teal-700 shadow-lg ${className}`}
    >
      <div className="p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Recommended Actions
            </h4>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({insights.length} action{insights.length !== 1 ? 's' : ''})
            </span>
          </div>

          <div className="space-y-3">
            {insights.map((insight, index) => {
              const Icon = getInsightIcon(insight.insight_type);
              const styles = aiInsightsService.getSeverityStyles(insight.severity);
              const isExpanded = expandedActions.has(insight.id);

              return (
                <div
                  key={insight.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg border-2 ${styles.border} shadow-md overflow-hidden transition-all hover:shadow-lg`}
                >
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => toggleActionExpanded(insight.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 text-white text-lg font-bold flex-shrink-0 shadow-md">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3 flex-1">
                            <Icon className={`h-5 w-5 ${styles.text} flex-shrink-0`} />
                            <h5 className={`font-bold text-lg ${styles.text}`}>
                              {insight.title}
                            </h5>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {getPriorityBadge(insight.severity)}
                            {insight.user_action === 'Pending' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAcknowledge(insight.id);
                                  }}
                                  className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                  title="Acknowledge"
                                >
                                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDismiss(insight.id);
                                  }}
                                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                  title="Dismiss"
                                >
                                  <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                                </button>
                              </>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                          {insight.description}
                        </p>

                        {insight.key_metrics &&
                          Object.keys(insight.key_metrics).length > 0 && (
                            <div className="flex flex-wrap gap-3 mb-3">
                              {Object.entries(insight.key_metrics).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                                >
                                  <div className="text-xs text-gray-600 dark:text-gray-400">
                                    {key.replace(/_/g, ' ')}
                                  </div>
                                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                                    {typeof value === 'number'
                                      ? value.toLocaleString()
                                      : String(value)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                        {isExpanded &&
                          insight.action_plan &&
                          insight.action_plan.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <h6 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                                Tactical Action Steps:
                              </h6>
                              <ul className="space-y-2">
                                {insight.action_plan.map((action, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start space-x-3 text-sm"
                                  >
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-bold text-xs flex-shrink-0 mt-0.5">
                                      {idx + 1}
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300 flex-1">
                                      {action}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      </div>
    </div>
  );
};

export default QuoteActionPlanSection;
