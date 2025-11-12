import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, Clock, Package, Target, Zap, Activity, Calendar, Eye } from 'lucide-react';
import mockSourcingEvents from '../../data/mockSourcingEvents.json';
import mockMilestones from '../../data/mockMilestones.json';
import { EProcurementAgent } from '../../services/eProcurementAgent';

interface Milestone {
  id: string;
  name: string;
  date: string;
  status: string;
  responsible: string;
  notes: string;
  insights: string;
}

const SourcingMonitoringDashboard: React.FC = () => {
  const [sourcingEvents, setSourcingEvents] = useState<any[]>([]);
  const [hoveredMilestone, setHoveredMilestone] = useState<Milestone | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  useEffect(() => {
    const events = mockSourcingEvents
      .filter(event => event.approval_status === 'Approved')
      .map(event => {
        const milestoneData = mockMilestones.find((m: any) => m.sourcing_event_id === event.id);
        const daysUntilDelivery = Math.floor(
          (new Date(event.delivery_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        const criticalLevel =
          daysUntilDelivery < 21 && event.estimate_price > 1000000000 ? 'critical' :
          daysUntilDelivery < 30 ? 'high' :
          event.estimate_price > 2000000000 ? 'high' :
          'normal';

        return {
          ...event,
          milestones: milestoneData?.milestones || [],
          daysUntilDelivery,
          criticalLevel,
          progress: calculateProgress(event.status)
        };
      });

    setSourcingEvents(events);
  }, []);

  const calculateProgress = (status: string): number => {
    const statusProgress: { [key: string]: number } = {
      'Draft': 10,
      'Scheduled': 30,
      'Published': 50,
      'In Progress': 70,
      'Evaluation': 85,
      'Completed': 100
    };
    return statusProgress[status] || 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const generateInsights = async (event: any) => {
    setIsGeneratingInsights(true);
    setSelectedEvent(event);

    try {
      const insights = await EProcurementAgent.mockGenerateInsights(event);
      setAiInsights(insights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const stats = {
    total: sourcingEvents.length,
    active: sourcingEvents.filter(e => e.status === 'In Progress' || e.status === 'Published').length,
    atRisk: sourcingEvents.filter(e => e.criticalLevel === 'critical' || e.criticalLevel === 'high').length,
    completed: sourcingEvents.filter(e => e.status === 'Completed').length
  };

  const criticalEvents = sourcingEvents
    .filter(e => e.criticalLevel === 'critical')
    .sort((a, b) => a.daysUntilDelivery - b.daysUntilDelivery);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-blue-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Delayed':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getCriticalColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      case 'high':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getDatePosition = (date: string, startDate: Date, endDate: Date, containerWidth: number): number => {
    const milestoneDate = new Date(date);
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysFromStart = (milestoneDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return (daysFromStart / totalDays) * containerWidth;
  };

  return (
    <div className="space-y-6" onMouseMove={handleMouseMove}>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sourcing Monitoring Dashboard</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Comprehensive oversight of all sourcing events with AI-powered insights
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
            <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Events</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.atRisk}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">At Risk</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span>Sourcing Event Timeline (Gantt Chart)</span>
            </h3>

            <div className="space-y-6">
              {sourcingEvents.slice(0, 6).map((event) => {
                const allMilestoneDates = event.milestones.map((m: Milestone) => new Date(m.date));
                const startDate = new Date(Math.min(...allMilestoneDates.map(d => d.getTime())));
                const endDate = new Date(Math.max(...allMilestoneDates.map(d => d.getTime())));
                const containerWidth = 100;

                return (
                  <div key={event.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{event.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {event.id} • {event.milestones.length} milestones
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getCriticalColor(event.criticalLevel)}`}>
                          {event.criticalLevel === 'critical' ? 'CRITICAL' : event.criticalLevel === 'high' ? 'HIGH' : 'NORMAL'}
                        </span>
                        <button
                          onClick={() => generateInsights(event)}
                          className="px-3 py-1 text-xs bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors flex items-center space-x-1"
                        >
                          <Zap className="h-3 w-3" />
                          <span>AI Insights</span>
                        </button>
                      </div>
                    </div>

                    <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-16">
                      <div className="absolute inset-x-4 top-8 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>

                      {event.milestones.map((milestone: Milestone, idx: number) => {
                        const position = getDatePosition(milestone.date, startDate, endDate, containerWidth);

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
                            <div
                              className={`w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${getStatusColor(milestone.status)}`}
                            />
                          </div>
                        );
                      })}

                      <div className="absolute left-4 top-full mt-2 flex items-center justify-between w-[calc(100%-2rem)] text-xs text-gray-600 dark:text-gray-400">
                        <span>{startDate.toLocaleDateString()}</span>
                        <span>{endDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Legend:</p>
              <div className="flex items-center space-x-6 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-700 dark:text-gray-300">Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-700 dark:text-gray-300">In Progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-700 dark:text-gray-300">Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-700 dark:text-gray-300">Delayed</span>
                </div>
              </div>
            </div>
          </div>

          {selectedEvent && (
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <span>AI-Generated Insights: {selectedEvent.title}</span>
              </h3>

              {isGeneratingInsights ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Analyzing sourcing event...</p>
                </div>
              ) : aiInsights ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timeline Assessment</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{aiInsights.timeline_assessment}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Risk Factors</p>
                    <ul className="space-y-1">
                      {aiInsights.risk_factors?.map((risk: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vendor Pool Quality</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{aiInsights.vendor_pool_quality}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommended Actions</p>
                    <ul className="space-y-1">
                      {aiInsights.recommendations?.map((rec: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                          <Target className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span>Critical Sourcing</span>
            </h3>

            {criticalEvents.length > 0 ? (
              <div className="space-y-3">
                {criticalEvents.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {event.title}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{event.daysUntilDelivery} days left</span>
                      </span>
                      <span>Rp {(event.estimate_price / 1000000000).toFixed(1)}B</span>
                    </div>
                    <div className="mt-2 flex items-center space-x-1 text-xs text-red-600 dark:text-red-400">
                      <AlertCircle className="h-3 w-3" />
                      <span>Urgent attention required</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">No critical events</p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>Quick Stats</span>
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Completion Rate</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {Math.round(sourcingEvents.reduce((sum, e) => sum + e.progress, 0) / sourcingEvents.length)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${Math.round(sourcingEvents.reduce((sum, e) => sum + e.progress, 0) / sourcingEvents.length)}%`
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Value</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Rp {(sourcingEvents.reduce((sum, e) => sum + (e.estimate_price || 0), 0) / 1000000000).toFixed(1)}B
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Timeline</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {Math.round(sourcingEvents.reduce((sum, e) => sum + e.daysUntilDelivery, 0) / sourcingEvents.length)} days
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">On-Time Rate</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">94%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800 p-4">
            <div className="flex items-start space-x-3">
              <Eye className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-800 dark:text-orange-300">
                <p className="font-semibold mb-1">Hover for Details</p>
                <p className="text-xs">
                  Hover over milestone dots in the Gantt chart to view detailed information and AI insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {hoveredMilestone && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border-2 border-orange-600 dark:border-orange-400 p-4 w-80 pointer-events-none"
          style={{
            left: `${mousePosition.x + 20}px`,
            top: `${mousePosition.y + 20}px`
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 dark:text-white">{hoveredMilestone.name}</h4>
              <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(hoveredMilestone.status)} text-white`}>
                {hoveredMilestone.status}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">{hoveredMilestone.date}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Responsible:</span> {hoveredMilestone.responsible}
              </p>
              {hoveredMilestone.notes && (
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Notes:</span> {hoveredMilestone.notes}
                </p>
              )}
            </div>
            {hoveredMilestone.insights && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1 flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>AI Insight</span>
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300">{hoveredMilestone.insights}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SourcingMonitoringDashboard;
