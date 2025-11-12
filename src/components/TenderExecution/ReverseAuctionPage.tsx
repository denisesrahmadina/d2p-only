import React, { useState, useEffect } from 'react';
import { Trophy, TrendingDown, Clock, Users, DollarSign, Activity, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import mockAuctionData from '../../data/mockAuctionData.json';

interface ReverseAuctionPageProps {
  event: any;
}

const ReverseAuctionPage: React.FC<ReverseAuctionPageProps> = ({ event }) => {
  const [auctionData, setAuctionData] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const auction = mockAuctionData.find(a => a.sourcing_event_id === event.id);
    if (auction) {
      setAuctionData(auction);
    }
  }, [event]);

  useEffect(() => {
    if (!auctionData) return;

    const updateTimer = () => {
      const now = new Date();
      const endTime = new Date(auctionData.end_time);
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Auction Ended');
        setIsActive(false);
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
  }, [auctionData]);

  if (!auctionData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Auction data not found</p>
        </div>
      </div>
    );
  }

  const savingsPercentage = auctionData.current_lowest_bid
    ? ((auctionData.starting_price - auctionData.current_lowest_bid) / auctionData.starting_price * 100).toFixed(2)
    : '0.00';

  const savingsAmount = auctionData.current_lowest_bid
    ? auctionData.starting_price - auctionData.current_lowest_bid
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{auctionData.title}</h2>
            <p className="text-green-100">Live Reverse Auction</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-200 mb-1">Time Remaining</p>
            <p className="text-3xl font-bold flex items-center space-x-2">
              <Clock className="h-8 w-8" />
              <span>{timeRemaining}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs text-green-200 mb-1">Starting Price</p>
            <p className="text-lg font-bold">Rp {auctionData.starting_price.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs text-green-200 mb-1">Current Lowest</p>
            <p className="text-lg font-bold text-yellow-300">
              Rp {(auctionData.current_lowest_bid || auctionData.starting_price).toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs text-green-200 mb-1">Savings</p>
            <p className="text-lg font-bold flex items-center space-x-1">
              <TrendingDown className="h-5 w-5" />
              <span>{savingsPercentage}%</span>
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs text-green-200 mb-1">Participants</p>
            <p className="text-lg font-bold flex items-center space-x-1">
              <Users className="h-5 w-5" />
              <span>{auctionData.participants?.length || 0}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <span>Current Leaderboard</span>
              </h3>
              {isActive && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <Activity className="h-4 w-4 animate-pulse" />
                  <span className="text-sm font-medium">Live Updates</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {auctionData.participants && auctionData.participants.length > 0 ? (
                auctionData.participants.map((participant: any, index: number) => (
                  <div
                    key={participant.vendor_id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      index === 0
                        ? 'border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/10'
                        : index === 1
                        ? 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                        : 'border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                            index === 0
                              ? 'bg-yellow-400 text-yellow-900'
                              : index === 1
                              ? 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200'
                              : 'bg-orange-400 text-orange-900'
                          }`}
                        >
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {participant.vendor_name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {participant.total_bids} bids submitted • Last bid: {new Date(participant.bid_time).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Bid</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          Rp {participant.current_bid.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No bids submitted yet</p>
                </div>
              )}
            </div>
          </div>

          {savingsAmount > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-800 p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-600 rounded-full">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-green-700 dark:text-green-400 mb-1">Estimated Savings</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-300">
                    Rp {savingsAmount.toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {savingsPercentage}% reduction from starting price
                  </p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Auction Rules</h3>
            <div className="space-y-3 text-sm">
              {Object.entries(auctionData.rules).map(([key, value]) => (
                <div key={key} className="pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-gray-900 dark:text-white">{value as string}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Auction Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Bids</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {auctionData.participants?.reduce((sum: number, p: any) => sum + p.total_bids, 0) || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Bids/Vendor</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {auctionData.participants?.length > 0
                    ? (auctionData.participants.reduce((sum: number, p: any) => sum + p.total_bids, 0) / auctionData.participants.length).toFixed(1)
                    : '0.0'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Price Reduction</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  -{savingsPercentage}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Auction Status</span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  isActive
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400'
                }`}>
                  {isActive ? 'Active' : 'Ended'}
                </span>
              </div>
            </div>
          </div>

          {isActive && (
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  <p className="font-semibold mb-1">Active Auction</p>
                  <p className="text-xs">
                    Vendors are actively submitting bids. Leaderboard updates in real-time as new bids arrive.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bid Activity Timeline</h3>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
          <div className="space-y-4">
            {auctionData.participants?.slice(0, 5).map((participant: any, idx: number) => (
              <div key={idx} className="relative flex items-start space-x-4">
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 border-4 border-white dark:border-gray-900">
                  <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900 dark:text-white">{participant.vendor_name}</p>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(participant.bid_time).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    Rp {participant.current_bid.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Rank #{participant.rank} • Total bids: {participant.total_bids}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReverseAuctionPage;
