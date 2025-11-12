import React from 'react';
import { Award, AlertCircle } from 'lucide-react';

const TenderEvaluationWorkflow: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-full">
                <Award className="h-16 w-16 text-gray-400 dark:text-gray-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tender Evaluation
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This module is currently being updated
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
                    Information
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    The Tender Evaluation functionality is temporarily unavailable while we enhance the system.
                    Please check back later or contact your system administrator for more information.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Available Actions
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Tender Announcement - Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Document Submission - Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Tender Evaluation - Under Maintenance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Reverse Auction - Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Winner Announcement - Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderEvaluationWorkflow;
