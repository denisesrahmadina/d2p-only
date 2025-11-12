import React from 'react';
import { Trophy, Award, TrendingUp, Brain, CheckCircle2, ChevronRight, XCircle, Clock, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VendorScore {
  vendor_id: string;
  vendor_name: string;
  administration_result: 'Pass' | 'Not Pass';
  administration_status: 'On-Progress' | 'Final';
  administration_submitted_at?: string;
  technical_score: number;
  technical_status: 'On-Progress' | 'Final';
  technical_submitted_at?: string;
  commercial_score: number;
  commercial_status: 'On-Progress' | 'Final';
  commercial_submitted_at?: string;
  total_score: number;
  rank: number;
  status: string;
  eligible: boolean;
}

interface Winner {
  vendor_id: string;
  vendor_name: string;
  total_score: number;
  key_strengths: string[];
}

interface TenderEvaluationSummary {
  sourcing_event_id: string;
  event_name: string;
  evaluation_status: string;
  vendors: VendorScore[];
  winner: Winner;
  ai_summary: string;
  insights: string[];
  next_steps: string[];
}

interface Props {
  summary: TenderEvaluationSummary;
}

const TenderEvaluationSummaryCard: React.FC<Props> = ({ summary }) => {
  const getStatusBadge = (status: string, rank: number) => {
    if (status === 'Winner') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
          <Trophy className="h-3 w-3 mr-1" />
          Winner
        </span>
      );
    } else if (status === 'Runner-up') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
          <Award className="h-3 w-3 mr-1" />
          Runner-up
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
          Not Selected
        </span>
      );
    }
  };

  const getAdminBadge = (result: 'Pass' | 'Not Pass') => {
    if (result === 'Pass') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
          <CheckCircle className="h-3 w-3 mr-1" />
          Pass
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
          <XCircle className="h-3 w-3 mr-1" />
          Not Pass
        </span>
      );
    }
  };

  const getEvaluationStatusBadge = (status: 'On-Progress' | 'Final', submittedAt?: string) => {
    if (status === 'Final') {
      return (
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 cursor-help"
          title={submittedAt ? `Submitted at: ${new Date(submittedAt).toLocaleString()}` : 'Submitted'}
        >
          <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
          Final
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400">
          <Clock className="h-2.5 w-2.5 mr-0.5" />
          On-Progress
        </span>
      );
    }
  };

  const prepareChartData = () => {
    return summary.vendors.map(vendor => ({
      name: vendor.vendor_name.split(' ')[0],
      Technical: vendor.technical_score,
      Commercial: vendor.commercial_score,
      Total: vendor.total_score
    }));
  };

  const chartData = prepareChartData();

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      {/* Header with Winner Banner */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">
              {summary.event_name}
            </h3>
            <p className="text-green-100 text-sm">
              Event ID: {summary.sourcing_event_id} • Status: {summary.evaluation_status}
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-900 px-4 py-2 rounded-lg">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Winner</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {summary.winner.vendor_name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Scoring Info */}
      <div className="bg-blue-50 dark:bg-blue-900/10 px-6 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Scoring System:</span>
          <div className="flex items-center space-x-6">
            <span className="text-gray-600 dark:text-gray-400">
              Administration: <span className="font-semibold text-gray-900 dark:text-white">Pass / Not Pass</span>
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Technical: <span className="font-semibold text-gray-900 dark:text-white">0–80 points</span>
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Commercial: <span className="font-semibold text-gray-900 dark:text-white">0–20 points</span>
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Total: <span className="font-semibold text-gray-900 dark:text-white">100 max</span>
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Scores Table */}
        <div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Evaluation Scores Summary
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Vendor Name
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Admin
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Admin Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Tech (0–80)
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Tech Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Comm (0–20)
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Comm Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Total
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {summary.vendors.sort((a, b) => a.rank - b.rank).map((vendor) => (
                  <tr
                    key={vendor.vendor_id}
                    className={`transition-colors ${
                      !vendor.eligible
                        ? 'bg-red-50 dark:bg-red-900/10 opacity-60'
                        : vendor.status === 'Winner'
                        ? 'bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20'
                        : vendor.status === 'Runner-up'
                        ? 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        vendor.rank === 1
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                      }`}>
                        {vendor.rank}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-semibold ${
                          !vendor.eligible
                            ? 'text-red-700 dark:text-red-400 line-through'
                            : vendor.status === 'Winner'
                            ? 'text-green-700 dark:text-green-400'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {vendor.vendor_name}
                        </span>
                        {!vendor.eligible && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                            Disqualified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getAdminBadge(vendor.administration_result)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getEvaluationStatusBadge(vendor.administration_status, vendor.administration_submitted_at)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {vendor.technical_score}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getEvaluationStatusBadge(vendor.technical_status, vendor.technical_submitted_at)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {vendor.commercial_score}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getEvaluationStatusBadge(vendor.commercial_status, vendor.commercial_submitted_at)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-lg font-bold ${
                        !vendor.eligible
                          ? 'text-red-600 dark:text-red-400'
                          : vendor.status === 'Winner'
                          ? 'text-green-600 dark:text-green-400'
                          : vendor.total_score < 60
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {vendor.total_score}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getStatusBadge(vendor.status, vendor.rank)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Eligibility Note */}
          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Note:</span> Only vendors with <span className="font-semibold text-green-700 dark:text-green-400">Admin = Pass</span> are eligible for ranking. Total Score = Technical (0–80) + Commercial (0–20), max 100 points.
            </p>
          </div>
        </div>

        {/* Visualization */}
        <div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Score Comparison Chart
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="name" className="text-gray-700 dark:text-gray-300" />
                <YAxis domain={[0, 100]} className="text-gray-700 dark:text-gray-300" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Bar dataKey="Technical" fill="#10B981" name="Technical (0-80)" />
                <Bar dataKey="Commercial" fill="#F59E0B" name="Commercial (0-20)" />
                <Bar dataKey="Total" fill="#8B5CF6" name="Total Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Winner Highlights */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-600 rounded-lg flex-shrink-0">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Winner: {summary.winner.vendor_name}
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Total Score: <span className="font-bold text-green-600 dark:text-green-400">{summary.winner.total_score}/100</span>
              </p>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Key Strengths:</p>
                <ul className="space-y-1">
                  {summary.winner.key_strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                AI-Generated Analysis
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {summary.ai_summary}
              </p>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <h5 className="text-sm font-bold text-gray-900 dark:text-white">Key Insights</h5>
            </div>
            <ul className="space-y-2">
              {summary.insights.map((insight, index) => (
                <li key={index} className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300">
                  <ChevronRight className="h-3 w-3 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h5 className="text-sm font-bold text-gray-900 dark:text-white">Recommended Next Steps</h5>
            </div>
            <ul className="space-y-2">
              {summary.next_steps.map((step, index) => (
                <li key={index} className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderEvaluationSummaryCard;
