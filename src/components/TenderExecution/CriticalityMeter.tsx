import React from 'react';

interface CriticalityMeterProps {
  level: string;
  percentage: number;
  color: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CriticalityMeter: React.FC<CriticalityMeterProps> = ({
  level,
  percentage,
  color,
  showLabel = true,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: { container: 'w-16 h-16', text: 'text-sm' },
    md: { container: 'w-20 h-20', text: 'text-md' },
    lg: { container: 'w-24 h-24', text: 'text-lg' },
  };

  const { container, text } = sizeClasses[size];

  return (
    <div className="flex items-center space-x-3">
      {showLabel && (
        <div className="text-right">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Criticality Level
          </div>
          <div className={`${text} font-bold`} style={{ color }}>
            {level}
          </div>
        </div>
      )}
      <div className={container}>
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${percentage * 2.51} 251`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
      </div>
    </div>
  );
};

export default CriticalityMeter;
