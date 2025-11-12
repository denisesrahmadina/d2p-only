import React, { useState, useEffect } from 'react';
import { Trophy, Award, CheckCircle, XCircle, Calendar, DollarSign, FileText, TrendingUp, AlertCircle, Star } from 'lucide-react';
import mockSourcingEvents from '../../data/mockSourcingEvents.json';

interface WinnerAnnouncement {
  id: string;
  sourcing_event_id: string;
  title: string;
  category: string;
  contract_value: number;
  winner_vendor: string;
  announcement_date: string;
  my_participation: boolean;
  my_result?: 'won' | 'lost';
  my_score?: number;
  my_rank?: number;
  total_participants?: number;
  evaluation_feedback?: string;
  winner_score?: number;
}

const ExternalWinnerAnnouncementView: React.FC = () => {
  const [announcements, setAnnouncements] = useState<WinnerAnnouncement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<WinnerAnnouncement | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'won' | 'participated'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWinnerAnnouncements();
  }, []);

  const loadWinnerAnnouncements = () => {
    const completedEvents = mockSourcingEvents.filter(
      event => event.status === 'Completed' && event.approval_status === 'Approved'
    );

    const mockAnnouncements: WinnerAnnouncement[] = completedEvents.map((event, idx) => {
      const myParticipation = idx < 8;
      const myResult = idx === 0 ? 'won' : idx < 4 ? 'lost' : undefined;
      const myScore = myParticipation ? Math.floor(Math.random() * 30) + 70 : undefined;
      const myRank = myParticipation ? (idx === 0 ? 1 : idx + 1) : undefined;

      return {
        id: event.id,
        sourcing_event_id: event.id,
        title: event.title,
        category: event.category,
        contract_value: event.estimate_price || 0,
        winner_vendor: idx === 0 ? 'Your Company' : `Vendor ${String.fromCharCode(65 + idx)}`,
        announcement_date: event.estimate_schedule?.announcement_date || new Date().toISOString(),
        my_participation: myParticipation,
        my_result: myResult,
        my_score: myScore,
        my_rank: myRank,
        total_participants: Math.floor(Math.random() * 10) + 5,
        evaluation_feedback: myParticipation
          ? idx === 0
            ? 'Congratulations! Your proposal demonstrated excellent technical capabilities, competitive pricing, and strong project references. You have been awarded the contract.'
            : `Your proposal scored ${myScore}/100. While your technical specifications were strong, other vendors offered more competitive pricing. We encourage you to participate in future tenders.`
          : undefined,
        winner_score: Math.floor(Math.random() * 10) + 90
      };
    });

    setAnnouncements(mockAnnouncements);
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getResultColor = (result?: 'won' | 'lost') => {
    if (result === 'won') return 'text-green-600 dark:text-green-400';
    if (result === 'lost') return 'text-orange-600 dark:text-orange-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getResultBadge = (result?: 'won' | 'lost') => {
    if (result === 'won') {
      return { text: 'You Won', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: Trophy };
    }
    if (result === 'lost') {
      return { text: 'Not Selected', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400', icon: XCircle };
    }
    return { text: 'Published', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: FileText };
  };

  const filteredAnnouncements = announcements.filter(a => {
    if (filterType === 'all') return true;
    if (filterType === 'won') return a.my_result === 'won';
    if (filterType === 'participated') return a.my_participation;
    return true;
  });

  const stats = {
    total: announcements.length,
    won: announcements.filter(a => a.my_result === 'won').length,
    participated: announcements.filter(a => a.my_participation).length,
    avgScore: announcements.filter(a => a.my_score).length > 0
      ? Math.round(
          announcements.filter(a => a.my_score).reduce((sum, a) => sum + (a.my_score || 0), 0) /
          announcements.filter(a => a.my_score).length
        )
      : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (selectedAnnouncement) {
    const isWinner = selectedAnnouncement.my_result === 'won';
    const badge = getResultBadge(selectedAnnouncement.my_result);

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedAnnouncement(null)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to All Announcements
        </button>

        <div className={`bg-gradient-to-r ${isWinner ? 'from-green-600 to-emerald-600' : 'from-orange-600 to-amber-600'} rounded-lg p-6 text-white`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold">{selectedAnnouncement.title}</h2>
                <div className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${isWinner ? 'bg-yellow-400 text-yellow-900' : 'bg-white/20'}`}>
                  <badge.icon className="h-5 w-5" />
                  <span className="font-semibold">{badge.text}</span>
                </div>
              </div>
              <p className={isWinner ? 'text-green-100' : 'text-orange-100'}>
                Announced on {new Date(selectedAnnouncement.announcement_date).toLocaleDateString('id-ID')}
              </p>
            </div>
            {isWinner && (
              <Trophy className="h-24 w-24 text-yellow-300" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Announcement Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Contract Value</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(selectedAnnouncement.contract_value)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Category</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedAnnouncement.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Winner</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedAnnouncement.winner_vendor}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Total Participants</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedAnnouncement.total_participants}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selection Rationale</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isWinner
                      ? 'The winning vendor demonstrated superior technical capabilities, competitive pricing, and proven track record in delivering similar projects. All requirements were met with the highest quality standards.'
                      : `${selectedAnnouncement.winner_vendor} was selected based on comprehensive evaluation criteria including technical specifications, pricing competitiveness, delivery timeline, and past performance references.`
                    }
                  </p>
                </div>
              </div>
            </div>

            {selectedAnnouncement.my_participation && (
              <div className={`rounded-lg border-2 p-6 ${isWinner ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'}`}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <FileText className={`h-5 w-5 ${getResultColor(selectedAnnouncement.my_result)}`} />
                  <span>Your Evaluation Results</span>
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Your Score</p>
                      <div className="flex items-center space-x-2">
                        <p className={`text-2xl font-bold ${getResultColor(selectedAnnouncement.my_result)}`}>
                          {selectedAnnouncement.my_score}/100
                        </p>
                        <Star className={`h-5 w-5 ${getResultColor(selectedAnnouncement.my_result)}`} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Your Rank</p>
                      <p className={`text-2xl font-bold ${getResultColor(selectedAnnouncement.my_result)}`}>
                        #{selectedAnnouncement.my_rank}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Winner Score</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedAnnouncement.winner_score}/100
                      </p>
                    </div>
                  </div>

                  {selectedAnnouncement.evaluation_feedback && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Evaluation Feedback</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedAnnouncement.evaluation_feedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isWinner && (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg border-2 border-yellow-200 dark:border-yellow-800 p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-400 rounded-full">
                    <Award className="h-8 w-8 text-yellow-900" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-1">
                      Congratulations on Winning!
                    </p>
                    <p className="text-sm text-yellow-800 dark:text-yellow-400">
                      You will be contacted shortly to proceed with contract signing and project kickoff.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Dates</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-gray-500 dark:text-gray-500">Announcement Date</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {new Date(selectedAnnouncement.announcement_date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
                {isWinner && (
                  <>
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-gray-500 dark:text-gray-500">Contract Signing</p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {new Date(Date.now() + 7 * 86400000).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-gray-500 dark:text-gray-500">Project Kickoff</p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {new Date(Date.now() + 14 * 86400000).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {selectedAnnouncement.my_participation && (
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Score Breakdown</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Technical Specs', score: 85 },
                    { label: 'Pricing', score: isWinner ? 95 : 75 },
                    { label: 'Timeline', score: 90 },
                    { label: 'References', score: isWinner ? 92 : 78 }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">{item.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${isWinner ? 'bg-green-600' : 'bg-orange-600'}`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p className="font-semibold mb-1">Next Steps</p>
                  <p className="text-xs">
                    {isWinner
                      ? 'Our procurement team will contact you within 2 business days to discuss contract details and next steps.'
                      : 'Thank you for participating. We value your submission and encourage you to apply for future opportunities.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Winner Announcements
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View results of completed tenders
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Announcements</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.won}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tenders Won</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.participated}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Participated</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgScore}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Score</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { key: 'all', label: 'All Announcements' },
          { key: 'won', label: 'Tenders Won' },
          { key: 'participated', label: 'My Participations' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filterType === tab.key
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-12 text-center">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No announcements found
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => {
            const badge = getResultBadge(announcement.my_result);
            return (
              <button
                key={announcement.id}
                onClick={() => setSelectedAnnouncement(announcement)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-purple-400 dark:hover:border-purple-600 transition-colors text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {announcement.title}
                      </h4>
                      {announcement.my_participation && (
                        <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${badge.color}`}>
                          <badge.icon className="h-3 w-3" />
                          <span>{badge.text}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Winner: {announcement.winner_vendor} • Category: {announcement.category}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Contract Value</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(announcement.contract_value)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Announced Date</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {new Date(announcement.announcement_date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  {announcement.my_participation && (
                    <>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Your Score</p>
                        <p className={`text-sm font-semibold ${getResultColor(announcement.my_result)}`}>
                          {announcement.my_score}/100
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Your Rank</p>
                        <p className={`text-sm font-semibold ${getResultColor(announcement.my_result)}`}>
                          #{announcement.my_rank}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ExternalWinnerAnnouncementView;
