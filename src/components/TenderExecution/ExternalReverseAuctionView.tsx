import React, { useState, useEffect } from 'react';
import { Gavel, TrendingDown, Clock, Trophy, DollarSign, Send, Activity, AlertCircle, CheckCircle, Users } from 'lucide-react';
import mockAuctionData from '../../data/mockAuctionData.json';

interface Auction {
  id: string;
  sourcing_event_id: string;
  title: string;
  starting_price: number;
  current_lowest_bid: number;
  current_leader: string;
  end_time: string;
  status: 'Active' | 'Scheduled' | 'Ended';
  my_current_bid?: number;
  my_rank?: number;
  my_total_bids?: number;
  participants: number;
}

const ExternalReverseAuctionView: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidHistory, setBidHistory] = useState<any[]>([]);

  useEffect(() => {
    loadAuctions();
  }, []);

  useEffect(() => {
    if (selectedAuction) {
      const updateTimer = () => {
        const now = new Date();
        const endTime = new Date(selectedAuction.end_time);
        const diff = endTime.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeRemaining('Auction Ended');
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedAuction]);

  const loadAuctions = () => {
    const mockAuctions: Auction[] = mockAuctionData.map((auction: any) => ({
      id: auction.id,
      sourcing_event_id: auction.sourcing_event_id,
      title: auction.title,
      starting_price: auction.starting_price,
      current_lowest_bid: auction.current_lowest_bid || auction.starting_price,
      current_leader: auction.participants?.[0]?.vendor_name || 'No bids yet',
      end_time: auction.end_time,
      status: new Date(auction.end_time) > new Date() ? 'Active' : 'Ended',
      my_current_bid: auction.starting_price * 0.95,
      my_rank: 2,
      my_total_bids: 3,
      participants: auction.participants?.length || 0
    }));

    setAuctions(mockAuctions);

    const mockHistory = [
      {
        bid_amount: mockAuctions[0]?.starting_price * 0.98,
        bid_time: new Date(Date.now() - 7200000).toISOString(),
        rank: 3
      },
      {
        bid_amount: mockAuctions[0]?.starting_price * 0.96,
        bid_time: new Date(Date.now() - 3600000).toISOString(),
        rank: 2
      },
      {
        bid_amount: mockAuctions[0]?.starting_price * 0.95,
        bid_time: new Date(Date.now() - 1800000).toISOString(),
        rank: 2
      }
    ];
    setBidHistory(mockHistory);
  };

  const handleSubmitBid = () => {
    if (!bidAmount || !selectedAuction) return;

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount >= (selectedAuction.current_lowest_bid || selectedAuction.starting_price)) {
      alert('Bid must be lower than the current lowest bid');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newBid = {
        bid_amount: amount,
        bid_time: new Date().toISOString(),
        rank: 1
      };

      setBidHistory(prev => [newBid, ...prev]);
      setSelectedAuction({
        ...selectedAuction,
        current_lowest_bid: amount,
        my_current_bid: amount,
        my_rank: 1,
        my_total_bids: (selectedAuction.my_total_bids || 0) + 1
      });

      setAuctions(prev =>
        prev.map(a =>
          a.id === selectedAuction.id
            ? { ...a, current_lowest_bid: amount }
            : a
        )
      );

      setBidAmount('');
      setIsSubmitting(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Ended':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { emoji: '🥇', color: 'bg-yellow-400 text-yellow-900' };
    if (rank === 2) return { emoji: '🥈', color: 'bg-gray-300 text-gray-900' };
    if (rank === 3) return { emoji: '🥉', color: 'bg-orange-400 text-orange-900' };
    return { emoji: `#${rank}`, color: 'bg-gray-200 text-gray-700' };
  };

  if (!selectedAuction) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Gavel className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reverse Auctions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Participate in active reverse auctions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <Gavel className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{auctions.length}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Auctions</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {auctions.filter(a => a.status === 'Active').length}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Now</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {auctions.filter(a => a.my_rank === 1).length}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Leading</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {auctions.reduce((sum, a) => sum + (a.my_total_bids || 0), 0)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Bids</p>
          </div>
        </div>

        <div className="space-y-4">
          {auctions.map((auction) => {
            const savingsPercent = ((auction.starting_price - auction.current_lowest_bid) / auction.starting_price * 100).toFixed(1);
            const rankBadge = auction.my_rank ? getRankBadge(auction.my_rank) : null;

            return (
              <button
                key={auction.id}
                onClick={() => setSelectedAuction(auction)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-green-400 dark:hover:border-green-600 transition-colors text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {auction.title}
                      </h4>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(auction.status)}`}>
                        {auction.status}
                      </span>
                      {rankBadge && (
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${rankBadge.color}`}>
                          {rankBadge.emoji} Your Rank
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {auction.participants} participants • Current leader: {auction.current_leader}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Starting Price</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(auction.starting_price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Current Lowest</p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(auction.current_lowest_bid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">My Bid</p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {auction.my_current_bid ? formatCurrency(auction.my_current_bid) : 'Not placed'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Savings</p>
                    <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                      {savingsPercent}%
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const savingsAmount = selectedAuction.starting_price - selectedAuction.current_lowest_bid;
  const savingsPercent = ((savingsAmount / selectedAuction.starting_price) * 100).toFixed(2);
  const isLeading = selectedAuction.my_rank === 1;
  const isActive = selectedAuction.status === 'Active';
  const currentRankBadge = selectedAuction.my_rank ? getRankBadge(selectedAuction.my_rank) : null;

  return (
    <div className="space-y-6">
      <button
        onClick={() => setSelectedAuction(null)}
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        ← Back to All Auctions
      </button>

      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold">{selectedAuction.title}</h2>
              {isActive && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full">
                  <Activity className="h-4 w-4 animate-pulse" />
                  <span className="text-sm font-medium">Live</span>
                </div>
              )}
            </div>
            {currentRankBadge && (
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${currentRankBadge.color}`}>
                <span className="text-lg font-bold">{currentRankBadge.emoji}</span>
                <span className="font-semibold">You are currently rank #{selectedAuction.my_rank}</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-green-200 mb-1">Time Remaining</p>
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8" />
              <p className="text-3xl font-bold">{timeRemaining}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs text-green-200 mb-1">Starting Price</p>
            <p className="text-lg font-bold">{formatCurrency(selectedAuction.starting_price)}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs text-green-200 mb-1">Current Lowest</p>
            <p className="text-lg font-bold text-yellow-300">{formatCurrency(selectedAuction.current_lowest_bid)}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs text-green-200 mb-1">Your Bid</p>
            <p className="text-lg font-bold">{selectedAuction.my_current_bid ? formatCurrency(selectedAuction.my_current_bid) : 'None'}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs text-green-200 mb-1">Total Savings</p>
            <p className="text-lg font-bold flex items-center space-x-1">
              <TrendingDown className="h-5 w-5" />
              <span>{savingsPercent}%</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {isActive && (
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Gavel className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span>Place Your Bid</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bid Amount (must be lower than current lowest)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={String(selectedAuction.current_lowest_bid - 1000000)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg font-semibold"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Current lowest: {formatCurrency(selectedAuction.current_lowest_bid)} •
                    You need to bid lower than this amount
                  </p>
                </div>

                {isLeading && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 p-4">
                    <div className="flex items-start space-x-3">
                      <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800 dark:text-yellow-300">
                        <p className="font-semibold mb-1">You're Currently Winning!</p>
                        <p className="text-xs">
                          You have the lowest bid. Keep monitoring as other vendors may submit lower bids.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmitBid}
                  disabled={!bidAmount || isSubmitting}
                  className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold text-lg flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Submit Bid</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Bid History</h3>
            <div className="space-y-3">
              {bidHistory.length > 0 ? (
                bidHistory.map((bid, idx) => {
                  const badge = getRankBadge(bid.rank);
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${badge.color}`}>
                          <span className="font-bold">{badge.emoji}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(bid.bid_amount)}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(bid.bid_time).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 text-sm font-medium rounded bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        Rank #{bid.rank}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Gavel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No bids placed yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Bids</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedAuction.my_total_bids || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Rank</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  #{selectedAuction.my_rank || '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Your Best Bid</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {selectedAuction.my_current_bid ? formatCurrency(selectedAuction.my_current_bid) : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Competitors</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedAuction.participants}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Auction Rules</h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p>Each bid must be lower than the current lowest bid</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p>Minimum bid decrement: Rp 100,000</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p>Unlimited bids allowed per vendor</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p>Lowest bidder at end time wins the contract</p>
              </div>
            </div>
          </div>

          {!isActive && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-semibold mb-1">Auction Ended</p>
                  <p className="text-xs">
                    This auction has concluded. Check the winner announcement for results.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExternalReverseAuctionView;
