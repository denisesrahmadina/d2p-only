import React, { useState, useRef, useEffect } from 'react';
import { Brain, Check, Loader2 } from 'lucide-react';
import { TenderEvaluationService } from '../../services/tenderEvaluationService';

interface ScoringTableCellProps {
  vendorId: string;
  criteriaName: string;
  currentScore: number;
  isAIScore: boolean;
  onScoreChange: (score: number) => void;
  disabled?: boolean;
}

const ScoringTableCell: React.FC<ScoringTableCellProps> = ({
  vendorId,
  criteriaName,
  currentScore,
  isAIScore,
  onScoreChange,
  disabled = false
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{
    score: number;
    confidence: number;
    justification: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [localValue, setLocalValue] = useState(currentScore.toString());
  const timeoutRef = useRef<NodeJS.Timeout>();
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(currentScore.toString());
  }, [currentScore]);

  const handleMouseEnter = async () => {
    if (disabled) return;

    setShowTooltip(true);
    setLoading(true);

    timeoutRef.current = setTimeout(() => {
      try {
        const recommendation = TenderEvaluationService.generateAIScoreRecommendation(
          vendorId,
          criteriaName
        );
        setAiRecommendation(recommendation);
      } catch (error) {
        console.error('Failed to generate AI recommendation:', error);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
    setLoading(false);
  };

  const handleAcceptRecommendation = () => {
    if (aiRecommendation) {
      setLocalValue(aiRecommendation.score.toString());
      onScoreChange(aiRecommendation.score);
      setShowTooltip(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);
  };

  const handleInputBlur = () => {
    const numValue = parseFloat(localValue);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      onScoreChange(numValue);
    } else {
      setLocalValue(currentScore.toString());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col items-center space-y-1">
        {isAIScore && (
          <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
            <Brain className="h-3 w-3 mr-1" />
            AI: {currentScore.toFixed(1)}
          </span>
        )}
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className={`w-20 px-2 py-2 border rounded text-center font-medium transition-all
            ${disabled
              ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 cursor-not-allowed'
              : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }
            text-gray-900 dark:text-white text-sm`}
        />
      </div>

      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-64 bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-600 rounded-lg shadow-xl p-4 animate-fadeIn"
          style={{ pointerEvents: 'auto' }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Analyzing...
              </span>
            </div>
          ) : aiRecommendation ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    AI Recommendation
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {aiRecommendation.score.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {aiRecommendation.confidence.toFixed(0)}% confidence
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 dark:bg-blue-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${aiRecommendation.confidence}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {aiRecommendation.justification}
              </p>

              <button
                onClick={handleAcceptRecommendation}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>Accept Recommendation</span>
              </button>
            </div>
          ) : null}

          <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-500 dark:border-t-blue-600" />
        </div>
      )}
    </div>
  );
};

export default ScoringTableCell;
