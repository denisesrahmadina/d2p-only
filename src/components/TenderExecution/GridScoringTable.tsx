import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, TrendingUp, Award, Info, CheckCircle, AlertCircle, Brain, Download, Save, Eye, FileText } from 'lucide-react';
import { TenderEvaluationService, TenderEvaluation, VendorEvaluationSummary } from '../../services/tenderEvaluationService';
import GridScoringCell from './GridScoringCell';

interface GridScoringTableProps {
  sourcingEventId: string;
  evaluations: TenderEvaluation[];
  vendors: any[];
  onEvaluationsUpdate: () => void;
  onSubmitForApproval?: () => void;
  isReadOnly?: boolean;
}

const GridScoringTable: React.FC<GridScoringTableProps> = ({
  sourcingEventId,
  evaluations,
  vendors,
  onEvaluationsUpdate,
  onSubmitForApproval,
  isReadOnly = false
}) => {
  const [vendorScores, setVendorScores] = useState<VendorEvaluationSummary[]>([]);
  const [showCriteriaInfo, setShowCriteriaInfo] = useState(false);
  const [updatingScores, setUpdatingScores] = useState<Set<string>>(new Set());

  const criteria = TenderEvaluationService.getDefaultScoringCriteria();

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
    if (!evaluation) return null;
    return evaluation.manual_score ?? evaluation.ai_score ?? null;
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

  const vendorIds = useMemo(() => {
    return Array.from(new Set(evaluations.map(e => e.vendor_id)));
  }, [evaluations]);

  const overallProgress = useMemo(() => {
    const totalCells = criteria.length * vendorIds.length;
    const filledCells = evaluations.filter(e => e.manual_score !== null && e.manual_score !== undefined).length;
    return totalCells > 0 ? (filledCells / totalCells) * 100 : 0;
  }, [evaluations, criteria.length, vendorIds.length]);

  const isAllScoresComplete = useMemo(() => {
    return overallProgress === 100;
  }, [overallProgress]);

  const winningVendor = useMemo(() => {
    if (!isAllScoresComplete || vendorScores.length === 0) return null;
    return vendorScores[0];
  }, [isAllScoresComplete, vendorScores]);

  const exportResults = () => {
    const csvContent = [
      ['Criteria', 'Weight', ...vendorIds.map(getVendorName)],
      ...criteria.map(criterion => [
        criterion.name,
        `${(criterion.weight * 100).toFixed(0)}%`,
        ...vendorIds.map(vendorId => {
          const evaluation = getEvaluation(vendorId, criterion.name);
          const score = getDisplayScore(evaluation);
          return score !== null ? score.toFixed(1) : '-';
        })
      ]),
      [],
      ['Weighted Score', '', ...vendorScores.map(s => s.weighted_score.toFixed(2))],
      ['Rank', '', ...vendorScores.map((_, idx) => (idx + 1).toString())]
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
              Vendor Evaluation Matrix
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hover over empty cells to see AI score recommendations
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
              Overall Evaluation Progress
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
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white sticky left-0 bg-gray-50 dark:bg-gray-800 z-20 min-w-48">
                  Selection Criteria
                </th>
                <th className="px-3 py-3 text-center font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 min-w-20">
                  Weight
                </th>
                {vendorIds.map(vendorId => (
                  <th key={vendorId} className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white min-w-32">
                    {getVendorName(vendorId)}
                    {winningVendor?.vendor_id === vendorId && (
                      <Trophy className="h-4 w-4 text-yellow-500 inline-block ml-2" />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {criteria.map((criterion, criterionIdx) => (
                <tr
                  key={criterion.name}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-900 z-10">
                    <div className="flex flex-col">
                      <span>{criterion.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                        {criterion.description}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center text-blue-600 dark:text-blue-400 font-semibold bg-white dark:bg-gray-900">
                    {(criterion.weight * 100).toFixed(0)}%
                  </td>
                  {vendorIds.map(vendorId => {
                    const evaluation = getEvaluation(vendorId, criterion.name);
                    const displayScore = getDisplayScore(evaluation);
                    const scoreKey = `${vendorId}-${criterion.name}`;

                    return (
                      <td key={vendorId} className="px-4 py-3 text-center">
                        <GridScoringCell
                          vendorId={vendorId}
                          criteriaName={criterion.name}
                          currentScore={displayScore}
                          aiScore={evaluation?.ai_score ?? null}
                          isAIScore={isAIScore(evaluation)}
                          aiJustification={evaluation?.justification}
                          onScoreChange={(score) => handleScoreChange(vendorId, criterion.name, score)}
                          disabled={updatingScores.has(scoreKey) || isReadOnly}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="bg-yellow-50 dark:bg-yellow-900/10 border-t-2 border-yellow-400 dark:border-yellow-600">
                <td className="px-4 py-4 font-bold text-gray-900 dark:text-white sticky left-0 bg-yellow-50 dark:bg-yellow-900/10 z-10">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <span>Weighted Total Score</span>
                  </div>
                </td>
                <td className="px-3 py-4 bg-yellow-50 dark:bg-yellow-900/10"></td>
                {vendorIds.map(vendorId => {
                  const vendorSummary = vendorScores.find(s => s.vendor_id === vendorId);
                  const isWinner = winningVendor?.vendor_id === vendorId;

                  return (
                    <td key={vendorId} className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span className={`text-xl font-bold ${isWinner ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}`}>
                          {vendorSummary?.weighted_score.toFixed(2) || '0.00'}
                        </span>
                        {isWinner && (
                          <div className="flex items-center space-x-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                            <Award className="h-3 w-3" />
                            <span>WINNER</span>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {isAllScoresComplete && vendorScores.length > 0 && !isReadOnly && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-400 dark:border-green-600 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
                Evaluation Complete
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All vendor evaluations are complete. Winner: <span className="font-bold text-gray-900 dark:text-white">{getVendorName(winningVendor.vendor_id)}</span> with a weighted score of <span className="font-bold text-gray-900 dark:text-white">{winningVendor.weighted_score.toFixed(2)}</span>
              </p>
            </div>
            {onSubmitForApproval && (
              <button
                onClick={onSubmitForApproval}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                <FileText className="h-5 w-5" />
                <span>Submit for Approval</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GridScoringTable;
