import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, CheckCircle, Clock, AlertCircle, Package, Activity, Eye } from 'lucide-react';
import mockSourcingEvents from '../../data/mockSourcingEvents.json';
import mockMilestones from '../../data/mockMilestones.json';

interface Milestone {
  id: string;
  name: string;
  date: string;
  status: string;
  description?: string;
}

interface JoinedEvent {
  id: string;
  title: string;
  category: string;
  status: string;
  milestones: Milestone[];
  current_phase: string;
  progress_percentage: number;
  next_deadline?: string;
  days_until_deadline?: number;
}

const ExternalSourcingMonitoringView: React.FC = () => {
  const [joinedEvents, setJoinedEvents] = useState<JoinedEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<JoinedEvent | null>(null);
  const [hoveredMilestone, setHoveredMilestone] = useState<Milestone | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadJoinedEvents();
  }, []);

  const loadJoinedEvents = () => {
    const participatedEvents = mockSourcingEvents
      .filter((_, idx) => idx < 10)
      .map((event) => {
        const milestoneData = mockMilestones.find((m: any) => m.sourcing_event_id === event.id);
        const milestones: Milestone[] = milestoneData?.milestones || generateDefaultMilestones(event);

        const completedMilestones = milestones.filter(m => m.status === 'Completed').length;
        const totalMilestones = milestones.length;
        const progressPercentage = Math.round((completedMilestones / totalMilestones) * 100);

        const nextPendingMilestone = milestones.find(m => m.status === 'Pending' || m.status === 'In Progress');
        const nextDeadline = nextPendingMilestone?.date;
        const daysUntilDeadline = nextDeadline
          ? Math.ceil((new Date(nextDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : undefined;

        return {
          id: event.id,
          title: event.title,
          category: event.category,
          status: event.status,
          milestones,
          current_phase: nextPendingMilestone?.name || 'Completed',
          progress_percentage: progressPercentage,
          next_deadline: nextDeadline,
          days_until_deadline: daysUntilDeadline
        };
      });

    setJoinedEvents(participatedEvents);
  };

  const generateDefaultMilestones = (event: any): Milestone[] => {
    const baseDate = new Date(event.tender_start_date || Date.now());

    return [
      {
        id: '1',
        name: 'Tender Announcement',
        date: baseDate.toISOString(),
        status: 'Completed',
        description: 'Tender has been publicly announced'
      },
      {
        id: '2',
        name: 'Document Submission',
        date: new Date(baseDate.getTime() + 7 * 86400000).toISOString(),
        status: event.status === 'In Progress' ? 'In Progress' : 'Completed',
        description: 'Submit all required documents'
      },
      {
        id: '3',
        name: 'Technical Evaluation',
        date: new Date(baseDate.getTime() + 14 * 86400000).toISOString(),
        status: event.status === 'Evaluation' ? 'In Progress' : event.status === 'Completed' ? 'Completed' : 'Pending',
        description: 'Technical proposal evaluation by committee'
      },
      {
        id: '4',
        name: 'Commercial Evaluation',
        date: new Date(baseDate.getTime() + 21 * 86400000).toISOString(),
        status: event.status === 'Evaluation' ? 'In Progress' : event.status === 'Completed' ? 'Completed' : 'Pending',
        description: 'Price and commercial terms evaluation'
      },
      {
        id: '5',
        name: 'Winner Announcement',
        date: new Date(baseDate.getTime() + 28 * 86400000).toISOString(),
        status: event.status === 'Completed' ? 'Completed' : 'Pending',
        description: 'Official winner announcement'
      },
      {
        id: '6',
        name: 'Contract Signing',
        date: new Date(baseDate.getTime() + 35 * 86400000).toISOString(),
        status: 'Pending',
        description: 'Contract finalization and signing'
      }
    ];
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-blue-500';
      case 'Pending':
        return 'bg-gray-400';
      case 'Delayed':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 25) return 'text-orange-600 dark:text-orange-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getDatePosition = (date: string, milestones: Milestone[], containerWidth: number): number => {
    const dates = milestones.map(m => new Date(m.date).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const totalRange = maxDate - minDate;

    const milestoneDate = new Date(date).getTime();
    const position = ((milestoneDate - minDate) / totalRange) * containerWidth;

    return Math.max(5, Math.min(95, position));
  };

  const stats = {
    total: joinedEvents.length,
    active: joinedEvents.filter(e => e.status === 'In Progress' || e.status === 'Evaluation').length,
    completed: joinedEvents.filter(e => e.status === 'Completed').length,
    upcomingDeadlines: joinedEvents.filter(e => e.days_until_deadline && e.days_until_deadline <= 7).length
  };

  if (selectedEvent) {
    return (
      <div className="space-y-6" onMouseMove={handleMouseMove}>
        <button
          onClick={() => setSelectedEvent(null)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to All Events
        </button>

        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
              <p className="text-teal-100">Category: {selectedEvent.category}</p>
            </div>
            <div className="text-right">
              <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold">{selectedEvent.progress_percentage}%</p>
                  <p className="text-xs text-teal-200">Complete</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-teal-200 mb-1">Current Phase</p>
              <p className="text-lg font-bold">{selectedEvent.current_phase}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-teal-200 mb-1">Status</p>
              <p className="text-lg font-bold capitalize">{selectedEvent.status}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-teal-200 mb-1">Next Deadline</p>
              <p className="text-lg font-bold">
                {selectedEvent.days_until_deadline ? `${selectedEvent.days_until_deadline} days` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Milestone Timeline</h3>

          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-32 mb-8">
            <div className="absolute inset-x-6 top-1/2 transform -translate-y-1/2 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>

            {selectedEvent.milestones.map((milestone, idx) => {
              const position = getDatePosition(milestone.date, selectedEvent.milestones, 100);

              return (
                <div
                  key={milestone.id}
                  className="absolute cursor-pointer transition-transform hover:scale-125"
                  style={{
                    left: `${position}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                  onMouseEnter={() => setHoveredMilestone(milestone)}
                  onMouseLeave={() => setHoveredMilestone(null)}
                >
                  <div className={`w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 ${getStatusColor(milestone.status)}`} />
                  <p className="absolute top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {new Date(milestone.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 space-y-3">
            {selectedEvent.milestones.map((milestone, idx) => (
              <div
                key={milestone.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  milestone.status === 'Completed'
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                    : milestone.status === 'In Progress'
                    ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      milestone.status === 'Completed'
                        ? 'bg-green-500'
                        : milestone.status === 'In Progress'
                        ? 'bg-blue-500'
                        : 'bg-gray-400'
                    }`}>
                      {milestone.status === 'Completed' ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : milestone.status === 'In Progress' ? (
                        <Activity className="h-5 w-5 text-white animate-pulse" />
                      ) : (
                        <Clock className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{milestone.name}</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                          milestone.status === 'Completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : milestone.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {milestone.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {milestone.description || 'Milestone in progress'}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(milestone.date).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {hoveredMilestone && (
          <div
            className="fixed z-50 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border-2 border-teal-600 dark:border-teal-400 p-4 w-72 pointer-events-none"
            style={{
              left: `${mousePosition.x + 20}px`,
              top: `${mousePosition.y + 20}px`
            }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 dark:text-white">{hoveredMilestone.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(hoveredMilestone.status)} text-white capitalize`}>
                  {hoveredMilestone.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {hoveredMilestone.description}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>{new Date(hoveredMilestone.date).toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-teal-100 dark:bg-teal-900/20 rounded-lg">
          <BarChart3 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sourcing Event Monitoring
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track your joined sourcing events and milestones
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Joined Events</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Events</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.upcomingDeadlines}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Deadlines</p>
        </div>
      </div>

      <div className="space-y-4">
        {joinedEvents.map((event) => (
          <button
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-teal-400 dark:hover:border-teal-600 transition-colors text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {event.title}
                  </h4>
                  <span className="px-3 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                    {event.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current Phase: {event.current_phase}
                </p>
              </div>
              <Eye className="h-5 w-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Progress</p>
                <p className={`text-lg font-semibold ${getProgressColor(event.progress_percentage)}`}>
                  {event.progress_percentage}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Status</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                  {event.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Next Deadline</p>
                <p className={`text-sm font-semibold ${
                  event.days_until_deadline && event.days_until_deadline <= 7
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {event.days_until_deadline ? `${event.days_until_deadline} days` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Milestones</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {event.milestones.filter(m => m.status === 'Completed').length}/{event.milestones.length}
                </p>
              </div>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-teal-600 to-cyan-600 h-2 rounded-full transition-all"
                style={{ width: `${event.progress_percentage}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExternalSourcingMonitoringView;
