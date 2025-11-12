import React, { useState, useEffect } from 'react';
import { Send, FileText, Calendar, Users, ChevronRight, Search, Filter, Megaphone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SourcingEvent {
  sourcing_event_id: string;
  sourcing_event_name: string;
  event_status: string;
  material_id: string;
  material_qty: string;
  estimated_price: number;
  tender_start_date: string;
  tender_end_date: string;
  currency: string;
}

interface TenderAnnouncementListProps {
  onSelectEvent: (event: SourcingEvent) => void;
}

const TenderAnnouncementList: React.FC<TenderAnnouncementListProps> = ({ onSelectEvent }) => {
  const { selectedOrganization } = useAuth();
  const [events, setEvents] = useState<SourcingEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<SourcingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadEvents();
  }, [selectedOrganization]);

  useEffect(() => {
    applyFilters();
  }, [events, searchQuery, statusFilter]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );

      const { data, error } = await supabase
        .from('fact_sourcing_event')
        .select('*')
        .in('event_status', ['Published', 'In Progress', 'EVALUATION'])
        .order('tender_start_date', { ascending: false })
        .limit(50);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Failed to load sourcing events:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.sourcing_event_name.toLowerCase().includes(query) ||
        event.sourcing_event_id.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.event_status === statusFilter);
    }

    setFilteredEvents(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Published': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'EVALUATION': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <Megaphone className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tender Announcements
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create and publish tender announcements
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Available Events', value: events.length, icon: FileText, color: 'blue' },
          { label: 'Published', value: events.filter(e => e.event_status === 'Published').length, icon: Send, color: 'green' },
          { label: 'In Evaluation', value: events.filter(e => e.event_status === 'EVALUATION').length, icon: Calendar, color: 'yellow' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="Published">Published</option>
            <option value="In Progress">In Progress</option>
            <option value="EVALUATION">Evaluation</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No sourcing events found
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <button
              key={event.sourcing_event_id}
              onClick={() => onSelectEvent(event)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-orange-400 dark:hover:border-orange-600 transition-colors text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {event.sourcing_event_name}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.event_status)}`}>
                      {event.event_status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    ID: {event.sourcing_event_id} • Material: {event.material_id}
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <FileText className="h-3 w-3" />
                      <span>Qty: {event.material_qty}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Users className="h-3 w-3" />
                      <span>{formatCurrency(event.estimated_price)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {new Date(event.tender_end_date).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 ml-4" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default TenderAnnouncementList;
