import React, { useState, useEffect } from 'react';
import { Clock, Gavel, TrendingDown, Users, Calendar, Package, ChevronRight, AlertCircle } from 'lucide-react';
import mockSourcingEvents from '../../data/mockSourcingEvents.json';
import mockAuctionData from '../../data/mockAuctionData.json';

interface ReverseAuctionListProps {
  onSelectEvent: (event: any) => void;
}

const ReverseAuctionList: React.FC<ReverseAuctionListProps> = ({ onSelectEvent }) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all');
  const [sourcingEvents, setSourcingEvents] = useState<any[]>([]);

  useEffect(() => {
    const eventsWithAuction = mockSourcingEvents
      .filter(event => event.approval_status === 'Approved')
      .map(event => {
        const auctionData = mockAuctionData.find(a => a.sourcing_event_id === event.id);
        return {
          ...event,
          auction: auctionData || null,
          auctionStatus: auctionData?.status || 'upcoming'
        };
      });

    setSourcingEvents(eventsWithAuction);
  }, []);

  const filteredEvents = sourcingEvents.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return !event.auction || event.auctionStatus === 'Upcoming';
    if (filter === 'active') return event.auctionStatus === 'Active';
    if (filter === 'completed') return event.auctionStatus === 'Completed';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      case 'Upcoming':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      case 'Completed':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
    }
  };

  const stats = {
    total: sourcingEvents.length,
    active: sourcingEvents.filter(e => e.auctionStatus === 'Active').length,
    upcoming: sourcingEvents.filter(e => !e.auction || e.auctionStatus === 'Upcoming').length,
    completed: sourcingEvents.filter(e => e.auctionStatus === 'Completed').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reverse Auction</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage reverse auction events for competitive bidding
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <Gavel className="h-6 w-6 text-green-600 dark:text-green-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Auctions</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.upcoming}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700">
        {['all', 'upcoming', 'active', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
              filter === tab
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No sourcing events found for this filter</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-orange-400 dark:hover:border-orange-600 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {event.title}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(event.auctionStatus)}`}>
                      {event.auctionStatus || 'Upcoming'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Event ID: {event.id} • Category: {event.category}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Starting Price</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Rp {event.estimate_price?.toLocaleString('id-ID')}
                  </p>
                </div>
                {event.auction && event.auction.current_lowest_bid && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Current Lowest</p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      Rp {event.auction.current_lowest_bid.toLocaleString('id-ID')}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Auction Date</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{event.estimate_schedule?.auction_date || 'TBD'}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Participants</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{event.auction?.participants?.length || event.shortlisted_vendors?.length || 0}</span>
                  </p>
                </div>
              </div>

              {event.auction && event.auction.participants && event.auction.participants.length > 0 && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">Current Leaders</p>
                  <div className="flex items-center space-x-4">
                    {event.auction.participants.slice(0, 3).map((participant: any, idx: number) => (
                      <div key={participant.vendor_id} className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 0 ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400' :
                          idx === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400' :
                          'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900 dark:text-white">{participant.vendor_name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Rp {participant.current_bid?.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Assigned to: {event.assigned_to || 'Unassigned'}
                </span>
                <span className={`font-medium ${
                  event.auctionStatus === 'Active' ? 'text-green-600 dark:text-green-400' :
                  event.auctionStatus === 'Upcoming' ? 'text-orange-600 dark:text-orange-400' :
                  'text-gray-600 dark:text-gray-400'
                }`}>
                  {event.auctionStatus === 'Active' ? 'Click to view live auction →' :
                   event.auctionStatus === 'Upcoming' ? 'Click to configure auction →' :
                   'Click to view results →'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReverseAuctionList;
