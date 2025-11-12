import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, TrendingUp, Award, Info, CheckCircle, AlertCircle, Brain, Download } from 'lucide-react';
import { TenderEvaluationService, TenderEvaluation, VendorEvaluationSummary } from '../../services/tenderEvaluationService';
import ScoringTableCell from './ScoringTableCell';

interface EnhancedScoringTableProps {
  sourcingEventId: string;
  evaluations: TenderEvaluation[];
  vendors: any[];
  onEvaluationsUpdate: () => void;
  onWinnerSelected?: (vendorId: string) => void;
}

const EnhancedScoringTable: React.FC<EnhancedScoringTableProps> = ({
  sourcingEventId,
  evaluations,
  vendors,
  onEvaluationsUpdate,
  onWinnerSelected
}) => {
  const [vendorScores, setVendorScores] = useState<VendorEvaluationSummary[]>([]);
  const [showCriteriaInfo, setShowCriteriaInfo] = useState(false);
  const [updatingScores, setUpdatingScores] = useState<Set<string>>(new Set());

  const criteria = TenderEvaluationService.getDefaultScoringCriteria();
  const criteriaNames = criteria.map(c => c.name);

  useEffect(() => {
    calculateScores();
  }, [evaluations]);

  const calculateScores = async () => {
    try {
      const scores = await TenderEvaluationService.calculateVendorScores(sourcingEventId);
      setVendorScores(scores);
    } catch (error) {
      console.error('Failed to calculate scores:', error);
    }
  };

  const getVendorName = (vendorId: string) => {
    const vendor = vendors.find(v => v.vendor_id === vendorId);
    return vendor?.vendor_name || vendorId;
  };

  const getEvaluation = (vendorId: string, criteriaName: string) => {
    return evaluations.find(e => e.vendor_id === vendorId && e.criteria_name === criteriaName);
  };

  const getDisplayScore = (evaluation?: TenderEvaluation) => {
    if (!evaluation) return 0;
    return evaluation.manual_score ?? evaluation.ai_score ?? 0;
  };

  const isAIScore = (evaluation?: TenderEvaluation) => {
    if (!evaluation) return false;
    return evaluation.manual_score === null || evaluation.manual_score === undefined;
  };

  const handleScoreChange = async (vendorId: string, criteriaName: string, newScore: number) => {
    const evaluation = getEvaluation(vendorId, criteriaName);
    if (!evaluation?.id) return;

    const scoreKey = `${vendorId}-${criteriaName}`;
    setUpdatingScores(prev => new Set(prev).add(scoreKey));

    try {
      await TenderEvaluationService.updateEvaluation(evaluation.id, {
        manual_score: newScore,
        scored_by: 'user'
      });
      onEvaluationsUpdate();
    } catch (error) {
      console.error('Failed to update score:', error);
    } finally {
      setUpdatingScores(prev => {
        const newSet = new Set(prev);
        newSet.delete(scoreKey);
        return newSet;
      });
    }
  };

  const vendorCompletionStats = useMemo(() => {
    const stats = new Map<string, { total: number; filled: number }>();

    const vendorIds = new Set(evaluations.map(e => e.vendor_id));
    vendorIds.forEach(vendorId => {
      const vendorEvals = evaluations.filter(e => e.vendor_id === vendorId);
      const filledCount = vendorEvals.filter(e => e.manual_score !== null && e.manual_score !== undefined).length;
      stats.set(vendorId, {
        total: criteriaNames.length,
        filled: filledCount
      });
    });

    return stats;
  }, [evaluations, criteriaNames.length]);

  const overallProgress = useMemo(() => {
    const totalCells = vendorCompletionStats.size * criteriaNames.length;
    const filledCells = Array.from(vendorCompletionStats.values()).reduce(
      (sum, stat) => sum + stat.filled,
      0
    );
    return totalCells > 0 ? (filledCells / totalCells) * 100 : 0;
  }, [vendorCompletionStats, criteriaNames.length]);

  const isAllScoresComplete = useMemo(() => {
    return overallProgress === 100;
  }, [overallProgress]);

  const winningVendor = useMemo(() => {
    if (!isAllScoresComplete || vendorScores.length === 0) return null;
    return vendorScores[0];
  }, [isAllScoresComplete, vendorScores]);

  const getCriterionWeight = (criteriaName: string) => {
    const criterion = criteria.find(c => c.name === criteriaName);
    return criterion?.weight || 0;
  };

  const exportResults = () => {
    const csvContent = [
      ['Vendor', ...criteriaNames, 'Weighted Score', 'Rank'],
      ...vendorScores.map((summary, idx) => [
        getVendorName(summary.vendor_id),
        ...criteriaNames.map(name => {
          const evaluation = getEvaluation(summary.vendor_id, name);
          return getDisplayScore(evaluation).toFixed(1);
        }),
        summary.weighted_score.toFixed(2),
        (idx + 1).toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tender-evaluation-${sourcingEventId}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Vendor Evaluation Scoring
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hover over cells for AI-powered score recommendations
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCriteriaInfo(!showCriteriaInfo)}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Info className="h-4 w-4" />
            <span>{showCriteriaInfo ? 'Hide' : 'Show'} Criteria Info</span>
          </button>
          <button
            onClick={exportResults}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Results</span>
          </button>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Overall Completion Progress
            </span>
          </div>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {overallProgress.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-blue-600 dark:bg-blue-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        {isAllScoresComplete && (
          <div className="mt-3 flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">All scores complete! Winner has been calculated.</span>
          </div>
        )}
      </div>

      {showCriteriaInfo && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            Evaluation Criteria Details
          </h4>
          <div className="space-y-3">
            {criteria.map((criterion, idx) => (
              <div key={idx} className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {(criterion.weight * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Weight</div>
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {criterion.name}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {criterion.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white sticky left-0 bg-gray-50 dark:bg-gray-800 z-10">
                  Vendor
                </th>
                {criteriaNames.map(name => (
                  <th key={name} className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white min-w-32">
                    <div className="flex flex-col items-center space-y-1">
                      <span>{name}</span>
                      <span className="text-xs font-normal text-blue-600 dark:text-blue-400">
                        ({(getCriterionWeight(name) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white min-w-32">
                  <div className="flex flex-col items-center space-y-1">
                    <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span>Weighted Score</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from(new Set(evaluations.map(e => e.vendor_id))).map(vendorId => {
                const vendorSummary = vendorScores.find(s => s.vendor_id === vendorId);
                const stats = vendorCompletionStats.get(vendorId);
                const completionPercentage = stats ? (stats.filled / stats.total) * 100 : 0;
                const isComplete = completionPercentage === 100;

                return (
                  <tr
                    key={vendorId}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      winningVendor?.vendor_id === vendorId
                        ? 'bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-l-yellow-500'
                        : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-900">
                      <div className="flex items-center space-x-2">
                        {winningVendor?.vendor_id === vendorId && (
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        )}
                        <span>{getVendorName(vendorId)}</span>
                      </div>
                    </td>
                    {criteriaNames.map(criteriaName => {
                      const evaluation = getEvaluation(vendorId, criteriaName);
                      const displayScore = getDisplayScore(evaluation);
                      const scoreKey = `${vendorId}-${criteriaName}`;

                      return (
                        <td key={criteriaName} className="px-4 py-3 text-center">
                          <ScoringTableCell
                            vendorId={vendorId}
                            criteriaName={criteriaName}
                            currentScore={displayScore}
                            isAIScore={isAIScore(evaluation)}
                            onScoreChange={(score) => handleScoreChange(vendorId, criteriaName, score)}
                            disabled={updatingScores.has(scoreKey)}
                          />
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {vendorSummary?.weighted_score.toFixed(2) || '0.00'}
                        </span>
                        {isComplete && vendorSummary && (
                          <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            <span>Complete</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isComplete
                                ? 'bg-green-600 dark:bg-green-400'
                                : 'bg-blue-600 dark:bg-blue-400'
                            }`}
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {stats?.filled}/{stats?.total}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isAllScoresComplete && vendorScores.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-2" />
            Final Rankings & Winner Selection
          </h4>
          <div className="space-y-3">
            {vendorScores.map((summary, idx) => (
              <div
                key={summary.vendor_id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  idx === 0
                    ? 'border-yellow-400 dark:border-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                      idx === 0
                        ? 'bg-yellow-500 text-white'
                        : idx === 1
                        ? 'bg-gray-400 text-white'
                        : idx === 2
                        ? 'bg-orange-400 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {idx === 0 ? <Trophy className="h-6 w-6" /> : idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                      {getVendorName(summary.vendor_id)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Weighted Score: <span className="font-bold">{summary.weighted_score.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
                {idx === 0 && (
                  <button
                    onClick={() => onWinnerSelected?.(summary.vendor_id)}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                  >
                    <Trophy className="h-5 w-5" />
                    <span>Select as Winner</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedScoringTable;
