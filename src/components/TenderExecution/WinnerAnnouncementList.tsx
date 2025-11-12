import React, { useState, useEffect } from 'react';
import { Megaphone, Clock, CheckCircle, FileText, Calendar, Package, ChevronRight, AlertCircle } from 'lucide-react';
import mockSourcingEvents from '../../data/mockSourcingEvents.json';

interface WinnerAnnouncementListProps {
  onSelectEvent: (event: any) => void;
}

const WinnerAnnouncementList: React.FC<WinnerAnnouncementListProps> = ({ onSelectEvent }) => {
  const [filter, setFilter] = useState<'all' | 'ready' | 'draft' | 'published'>('all');
  const [sourcingEvents, setSourcingEvents] = useState<any[]>([]);

  useEffect(() => {
    const eventsEligibleForAnnouncement = mockSourcingEvents
      .filter(event =>
        event.approval_status === 'Approved' &&
        (event.status === 'Evaluation' || event.status === 'In Progress' || event.status === 'Completed')
      )
      .map(event => ({
        ...event,
        announcementStatus: event.status === 'Completed' ? 'published' :
                           event.status === 'Evaluation' ? 'ready' : 'draft'
      }));

    setSourcingEvents(eventsEligibleForAnnouncement);
  }, []);

  const filteredEvents = sourcingEvents.filter(event => {
    if (filter === 'all') return true;
    return event.announcementStatus === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      case 'ready':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400';
      case 'draft':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'ready':
        return 'Ready to Announce';
      case 'draft':
        return 'Draft';
      default:
        return status;
    }
  };

  const stats = {
    total: sourcingEvents.length,
    ready: sourcingEvents.filter(e => e.announcementStatus === 'ready').length,
    draft: sourcingEvents.filter(e => e.announcementStatus === 'draft').length,
    published: sourcingEvents.filter(e => e.announcementStatus === 'published').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Winner Announcement</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create and publish winner announcements for completed tenders
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
            <Megaphone className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.ready}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Ready to Announce</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.draft}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Draft</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.published}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700">
        {['all', 'ready', 'draft', 'published'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
              filter === tab
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab === 'ready' ? 'Ready to Announce' : tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No events found for this filter</p>
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
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(event.announcementStatus)}`}>
                      {getStatusLabel(event.announcementStatus)}
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
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Contract Value</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Rp {event.estimate_price?.toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Announcement Date</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{event.estimate_schedule?.announcement_date || 'TBD'}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Sourcing Status</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {event.status}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Participants</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {event.shortlisted_vendors?.length || 0} vendors
                  </p>
                </div>
              </div>

              {event.announcementStatus === 'ready' && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
                    <Clock className="h-4 w-4" />
                    <p className="text-sm font-medium">
                      Evaluation completed - Ready for winner announcement
                    </p>
                  </div>
                </div>
              )}

              {event.announcementStatus === 'published' && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <p className="text-sm font-medium">
                      Winner announcement published on {event.estimate_schedule?.announcement_date}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Assigned to: {event.assigned_to || 'Unassigned'}
                </span>
                <span className={`font-medium ${
                  event.announcementStatus === 'ready' ? 'text-orange-600 dark:text-orange-400' :
                  event.announcementStatus === 'published' ? 'text-green-600 dark:text-green-400' :
                  'text-blue-600 dark:text-blue-400'
                }`}>
                  {event.announcementStatus === 'ready' ? 'Click to create announcement →' :
                   event.announcementStatus === 'published' ? 'Click to view announcement →' :
                   'Click to continue draft →'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WinnerAnnouncementList;
