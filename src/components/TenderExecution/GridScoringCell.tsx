import React, { useState, useRef, useEffect } from 'react';
import { Brain, Check, X, Sparkles } from 'lucide-react';

interface GridScoringCellProps {
  vendorId: string;
  criteriaName: string;
  currentScore: number | null;
  aiScore: number | null;
  isAIScore: boolean;
  aiJustification?: string | null;
  onScoreChange: (score: number) => void;
  disabled?: boolean;
}

const GridScoringCell: React.FC<GridScoringCellProps> = ({
  vendorId,
  criteriaName,
  currentScore,
  aiScore,
  isAIScore,
  aiJustification,
  onScoreChange,
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentScore?.toString() || '');
  const [showAITooltip, setShowAITooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('top');
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(currentScore?.toString() || '');
  }, [currentScore]);

  useEffect(() => {
    if (cellRef.current && showAITooltip) {
      const rect = cellRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;

      setTooltipPosition(spaceBelow > 250 || spaceBelow > spaceAbove ? 'bottom' : 'top');
    }
  }, [showAITooltip]);

  const handleSave = () => {
    const numValue = parseFloat(editValue);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      onScoreChange(numValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(currentScore?.toString() || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const useAIScore = () => {
    if (aiScore !== null) {
      onScoreChange(aiScore);
      setShowAITooltip(false);
    }
  };

  const hasScore = currentScore !== null;
  const showAIIndicator = aiScore !== null && !hasScore;

  return (
    <div
      ref={cellRef}
      className="relative"
      onMouseEnter={() => !hasScore && aiScore !== null && setShowAITooltip(true)}
      onMouseLeave={() => setShowAITooltip(false)}
    >
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-20 px-2 py-1 text-center border border-blue-400 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={disabled}
          />
          <button
            onClick={handleSave}
            className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
            disabled={disabled}
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !disabled && setIsEditing(true)}
          className={`
            relative px-3 py-2 rounded-lg transition-all cursor-pointer
            ${hasScore
              ? isAIScore
                ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/40'
                : 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/40'
              : showAIIndicator
              ? 'bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10'
              : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {hasScore ? (
            <div className="flex flex-col items-center space-y-1">
              <span className="text-base font-semibold text-gray-900 dark:text-white">
                {currentScore.toFixed(1)}
              </span>
              {isAIScore ? (
                <div className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400">
                  <Brain className="h-3 w-3" />
                  <span>AI</span>
                </div>
              ) : (
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Manual
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-1">
              <span className="text-gray-400 dark:text-gray-500 text-sm">--</span>
              {showAIIndicator && (
                <Sparkles className="h-4 w-4 text-blue-400 dark:text-blue-500 animate-pulse" />
              )}
            </div>
          )}
        </div>
      )}

      {showAITooltip && aiScore !== null && !hasScore && (
        <div
          className={`
            absolute left-1/2 transform -translate-x-1/2 z-30 w-72
            ${tooltipPosition === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'}
          `}
        >
          <div className="bg-white dark:bg-gray-800 border-2 border-blue-400 dark:border-blue-600 rounded-lg shadow-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-900 dark:text-white">AI Recommendation</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">Recommended Score:</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {aiScore.toFixed(1)}
                </span>
              </div>

              {aiJustification && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">Justification:</p>
                  <p className="text-xs leading-relaxed">{aiJustification}</p>
                </div>
              )}

              <button
                onClick={useAIScore}
                disabled={disabled}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4" />
                <span>Use AI Score</span>
              </button>

              <button
                onClick={() => {
                  setShowAITooltip(false);
                  setIsEditing(true);
                }}
                disabled={disabled}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enter Manual Score
              </button>
            </div>

            <div className={`
              absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45
              bg-white dark:bg-gray-800 border-blue-400 dark:border-blue-600
              ${tooltipPosition === 'bottom' ? 'top-0 -mt-2 border-l-2 border-t-2' : 'bottom-0 -mb-2 border-r-2 border-b-2'}
            `} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GridScoringCell;
