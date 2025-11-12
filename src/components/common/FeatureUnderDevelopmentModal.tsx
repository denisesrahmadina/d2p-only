import React from 'react';
import { X, Construction, Clock, CheckCircle, Sparkles } from 'lucide-react';

interface FeatureUnderDevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  description?: string;
  expectedFeatures?: string[];
}

const FeatureUnderDevelopmentModal: React.FC<FeatureUnderDevelopmentModalProps> = ({
  isOpen,
  onClose,
  featureName,
  description,
  expectedFeatures = []
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-dark-900 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-divider-light dark:border-divider-dark flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Feature Under Development</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-dark-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-lg">
              <Construction className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {featureName}
              </h4>
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Development Status</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              This feature is currently under active development and will be available in an upcoming release.
            </p>
          </div>

          {expectedFeatures.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Expected Features</span>
              </div>
              <ul className="space-y-2">
                {expectedFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t border-divider-light dark:border-divider-dark">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-semibold transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureUnderDevelopmentModal;
