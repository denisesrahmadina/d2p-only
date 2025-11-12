import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, DollarSign, FileText, Search, Filter, Eye, Clock, AlertCircle, Building2, Package, Sun, Wind, Droplet, Zap, Battery, Globe, Leaf, TrendingUp, Award, Download, MessageCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface TenderAnnouncement {
  sourcing_event_id: string;
  sourcing_event_name: string;
  event_status: string;
  material_id: string;
  material_qty: string;
  estimated_price: number;
  tender_start_date: string;
  tender_end_date: string;
  currency: string;
  category?: string;
  description?: string;
  delivery_location?: string;
}

const ExternalTenderAnnouncementView: React.FC = () => {
  const { selectedOrganization } = useAuth();
  const [announcements, setAnnouncements] = useState<TenderAnnouncement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<TenderAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<TenderAnnouncement | null>(null);

  useEffect(() => {
    loadPublishedAnnouncements();
  }, [selectedOrganization]);

  useEffect(() => {
    applyFilters();
  }, [announcements, searchQuery, categoryFilter]);

  const loadPublishedAnnouncements = async () => {
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
        .eq('event_status', 'Published')
        .order('tender_start_date', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Failed to load tender announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...announcements];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(announcement =>
        announcement.sourcing_event_name?.toLowerCase().includes(query) ||
        announcement.sourcing_event_id?.toLowerCase().includes(query) ||
        announcement.material_id?.toLowerCase().includes(query) ||
        announcement.category?.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(announcement =>
        announcement.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    setFilteredAnnouncements(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getDaysRemaining = (endDate: string): number => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getUrgencyColor = (daysRemaining: number) => {
    if (daysRemaining <= 7) return 'text-red-600 dark:text-red-400';
    if (daysRemaining <= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getCategoryIcon = (category?: string) => {
    if (!category) return Leaf;
    const cat = category.toLowerCase();
    if (cat.includes('solar')) return Sun;
    if (cat.includes('wind')) return Wind;
    if (cat.includes('hydro')) return Droplet;
    if (cat.includes('storage') || cat.includes('battery')) return Battery;
    if (cat.includes('smart') || cat.includes('grid')) return Zap;
    if (cat.includes('biomass')) return Leaf;
    if (cat.includes('geothermal')) return Globe;
    return Leaf;
  };

  const getCategoryGradient = (category?: string) => {
    if (!category) return 'from-green-500 to-emerald-600';
    const cat = category.toLowerCase();
    if (cat.includes('solar')) return 'from-yellow-500 to-orange-600';
    if (cat.includes('wind')) return 'from-cyan-500 to-blue-600';
    if (cat.includes('hydro')) return 'from-blue-500 to-indigo-600';
    if (cat.includes('storage') || cat.includes('battery')) return 'from-purple-500 to-pink-600';
    if (cat.includes('smart') || cat.includes('grid')) return 'from-indigo-500 to-purple-600';
    if (cat.includes('biomass')) return 'from-green-500 to-teal-600';
    if (cat.includes('geothermal')) return 'from-red-500 to-orange-600';
    return 'from-green-500 to-emerald-600';
  };

  const categories = ['all', 'Solar', 'Wind', 'Hydro', 'Energy Storage', 'Smart Grid', 'Biomass', 'Geothermal'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading tender opportunities...</span>
      </div>
    );
  }

  if (selectedAnnouncement) {
    const CategoryIcon = getCategoryIcon(selectedAnnouncement.category);
    const daysRemaining = getDaysRemaining(selectedAnnouncement.tender_end_date);

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedAnnouncement(null)}
          className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Tenders</span>
        </button>

        <div className={`bg-gradient-to-r ${getCategoryGradient(selectedAnnouncement.category)} rounded-2xl p-8 text-white shadow-2xl`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <CategoryIcon className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">{selectedAnnouncement.category || 'Renewable Energy'}</p>
                  <p className="text-white/60 text-xs">Tender ID: {selectedAnnouncement.sourcing_event_id}</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-6">{selectedAnnouncement.sourcing_event_name}</h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-white/70 mb-1">Estimated Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedAnnouncement.estimated_price)}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-white/70 mb-1">Submission Deadline</p>
                  <p className="text-2xl font-bold">{new Date(selectedAnnouncement.tender_end_date).toLocaleDateString('id-ID')}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-white/70 mb-1">Days Remaining</p>
                  <p className="text-2xl font-bold">{daysRemaining} days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span>Tender Details</span>
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Material Required</p>
                  <p className="text-base text-gray-900 dark:text-white">{selectedAnnouncement.material_id}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quantity</p>
                    <p className="text-base text-gray-900 dark:text-white">{selectedAnnouncement.material_qty}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Delivery Location</p>
                    <p className="text-base text-gray-900 dark:text-white">{selectedAnnouncement.delivery_location || 'TBD'}</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tender Period</p>
                  <p className="text-base text-gray-900 dark:text-white">
                    {new Date(selectedAnnouncement.tender_start_date).toLocaleDateString('id-ID')} - {new Date(selectedAnnouncement.tender_end_date).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedAnnouncement.description || `This tender is for the procurement of ${selectedAnnouncement.material_id} with quantity of ${selectedAnnouncement.material_qty}.
                    All interested vendors must submit their proposals including technical specifications, pricing details, and company credentials before the deadline.
                    Selected vendors will be invited to participate in the final evaluation process.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <Award className="h-5 w-5 text-green-600" />
                <span>Submission Requirements</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Company Profile and Registration Documents',
                  'Technical Specifications and Product Catalog',
                  'Price Quotation with Detailed Breakdown',
                  'Quality Certifications (ISO, IEC Standards)',
                  'Previous Renewable Energy Project References',
                  'Delivery Timeline and Logistics Plan',
                  'Warranty and After-Sales Support Plan',
                  'Environmental Compliance Certificates'
                ].map((req, idx) => (
                  <div key={idx} className="flex items-start space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">{idx + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 pt-0.5">{req}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all transform hover:scale-105 text-sm font-semibold shadow-lg flex items-center justify-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Submit Proposal</span>
                </button>
                <button className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download Documents</span>
                </button>
                <button className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Ask Question</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-5">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-sm text-green-900 dark:text-green-100">
                  <p className="font-bold mb-2">Important Notice</p>
                  <p className="text-xs leading-relaxed text-green-800 dark:text-green-200">
                    Late submissions will not be accepted. Please ensure all required documents meet renewable energy standards and are submitted before the deadline.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-green-600" />
                <span>Contact Information</span>
              </h3>
              <div className="space-y-3 text-sm">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Procurement Officer</p>
                  <p className="text-gray-900 dark:text-white font-semibold">Rahman Hidayat</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Email</p>
                  <p className="text-gray-900 dark:text-white font-medium">procurement@indonesia-power.co.id</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Phone</p>
                  <p className="text-gray-900 dark:text-white font-medium">+62 21 2525 0999</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalValue = announcements.reduce((sum, a) => sum + (a.estimated_price || 0), 0);
  const closingSoon = announcements.filter(a => getDaysRemaining(a.tender_end_date) <= 14).length;
  const highValue = announcements.filter(a => a.estimated_price > 100000000000).length;
  const uniqueCategories = new Set(announcements.map(a => a.category).filter(Boolean)).size;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64">
            <Sun className="h-full w-full text-yellow-300 animate-pulse" />
          </div>
          <div className="absolute bottom-10 left-10 w-48 h-48">
            <Wind className="h-full w-full text-cyan-300" style={{ animation: 'spin 20s linear infinite' }} />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56">
            <Droplet className="h-full w-full text-blue-300 opacity-50" />
          </div>
        </div>

        <div className="relative px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Renewable Energy Procurement Portal</h1>
                <p className="text-green-100 text-lg mt-2">Sustainable Energy Solutions for Indonesia's Future</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-white/90">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Powered by PT Indonesia Power</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Driving Clean Energy Transition</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{announcements.length}</span>
          </div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Active Tenders</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available opportunities</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-2xl border border-yellow-200 dark:border-yellow-800 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <Clock className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{closingSoon}</span>
          </div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Closing Soon</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Within 14 days</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl border border-green-200 dark:border-green-800 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <DollarSign className="h-7 w-7 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{highValue}</span>
          </div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Large Projects</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">&gt; IDR 100B value</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl border border-purple-200 dark:border-purple-800 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Zap className="h-7 w-7 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{uniqueCategories}</span>
          </div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Energy Categories</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Technology types</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tenders by name, ID, material, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-w-[200px] focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tender Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnnouncements.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-16 text-center">
            <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Tender Announcements Found
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => {
            const daysRemaining = getDaysRemaining(announcement.tender_end_date);
            const CategoryIcon = getCategoryIcon(announcement.category);
            return (
              <div
                key={announcement.sourcing_event_id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
                onClick={() => setSelectedAnnouncement(announcement)}
              >
                <div className={`h-40 bg-gradient-to-br ${getCategoryGradient(announcement.category)} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-4 right-4">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <CategoryIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-900 rounded-full">
                      {announcement.category || 'Renewable Energy'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                      {announcement.sourcing_event_name}
                    </h4>
                    <Eye className="h-5 w-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-1">{announcement.material_id}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Estimated Value</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {formatCurrency(announcement.estimated_price)}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Deadline</p>
                      <p className={`text-sm font-bold ${getUrgencyColor(daysRemaining)}`}>
                        {daysRemaining} days
                      </p>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-sm font-semibold transition-all transform group-hover:scale-105 shadow-md">
                    View Details & Apply
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Notice */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl border border-green-200 dark:border-green-800 p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Commitment to Sustainability</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              PT Indonesia Power is committed to accelerating Indonesia's clean energy transition. All tender opportunities support our mission to achieve
              renewable energy targets while maintaining world-class standards for quality, safety, and environmental protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalTenderAnnouncementView;
