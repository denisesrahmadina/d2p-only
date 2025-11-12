import React, { useState, useEffect } from 'react';
import { Save, Send, Eye, Sparkles, Users, X } from 'lucide-react';
import { TenderAnnouncementV2Service, TenderAnnouncementV2 } from '../../services/tenderAnnouncementV2Service';
import { useAuth } from '../../contexts/AuthContext';

interface TenderAnnouncementEditorProps {
  event: any;
  onSaved: () => void;
}

const TenderAnnouncementEditor: React.FC<TenderAnnouncementEditorProps> = ({ event, onSaved }) => {
  const { user, selectedOrganization } = useAuth();
  const [announcement, setAnnouncement] = useState<Partial<TenderAnnouncementV2>>({});
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [availableVendors, setAvailableVendors] = useState<any[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  useEffect(() => {
    loadExistingOrGenerate();
    loadVendors();
  }, [event]);

  const loadExistingOrGenerate = async () => {
    try {
      const existing = await TenderAnnouncementV2Service.getAnnouncementBySourcingEvent(
        event.sourcing_event_id
      );

      if (existing) {
        setAnnouncement(existing);
        setSelectedVendors(existing.target_vendors || []);
      } else {
        const generated = TenderAnnouncementV2Service.generateAnnouncementFromEvent(
          event,
          selectedOrganization || 'indonesia-power'
        );
        setAnnouncement(generated);
        setSelectedVendors([]);
      }
    } catch (error) {
      console.error('Failed to load announcement:', error);
    }
  };

  const loadVendors = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );

      const { data, error } = await supabase
        .from('dim_vendor')
        .select('vendor_id, vendor_name, vendor_category')
        .eq('is_active', true)
        .order('vendor_name', { ascending: true })
        .limit(50);

      if (error) throw error;
      setAvailableVendors(data || []);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    }
  };

  const handleAutoGenerate = () => {
    const generated = TenderAnnouncementV2Service.generateAnnouncementFromEvent(
      event,
      selectedOrganization || 'indonesia-power'
    );
    setAnnouncement({ ...announcement, ...generated });
  };

  const handleSave = async (status: 'Draft' | 'Published') => {
    setLoading(true);
    try {
      const announcementData = {
        ...announcement,
        status,
        target_vendors: selectedVendors,
        organization_id: selectedOrganization || 'indonesia-power'
      };

      if (announcement.id) {
        await TenderAnnouncementV2Service.updateAnnouncement(
          announcement.id,
          announcementData as Partial<TenderAnnouncementV2>
        );
      } else {
        await TenderAnnouncementV2Service.createAnnouncement(
          announcementData as Omit<TenderAnnouncementV2, 'id' | 'created_at' | 'updated_at'>
        );
      }

      onSaved();
    } catch (error) {
      console.error('Failed to save announcement:', error);
      alert('Failed to save announcement');
    } finally {
      setLoading(false);
    }
  };

  const toggleVendor = (vendorId: string) => {
    setSelectedVendors(prev =>
      prev.includes(vendorId)
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {announcement.id ? 'Edit' : 'Create'} Tender Announcement
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {event.sourcing_event_name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAutoGenerate}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            <span>Auto-Generate</span>
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>{showPreview ? 'Edit' : 'Preview'}</span>
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {announcement.title}
              </h1>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {announcement.header}
              </p>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="text-base leading-relaxed">{announcement.opener}</p>
              <p className="text-base leading-relaxed">{announcement.body}</p>
              <p className="text-base leading-relaxed font-medium">{announcement.closing}</p>
            </div>
            {selectedVendors.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Target Vendors ({selectedVendors.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedVendors.map(vendorId => {
                    const vendor = availableVendors.find(v => v.vendor_id === vendorId);
                    return (
                      <span
                        key={vendorId}
                        className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs"
                      >
                        {vendor?.vendor_name || vendorId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={announcement.title || ''}
              onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Tender Announcement: ..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Header
            </label>
            <input
              type="text"
              value={announcement.header || ''}
              onChange={(e) => setAnnouncement({ ...announcement, header: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Organization name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Opening Statement
            </label>
            <textarea
              value={announcement.opener || ''}
              onChange={(e) => setAnnouncement({ ...announcement, opener: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Opening statement..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Body
            </label>
            <textarea
              value={announcement.body || ''}
              onChange={(e) => setAnnouncement({ ...announcement, body: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Main announcement content..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Closing Statement
            </label>
            <textarea
              value={announcement.closing || ''}
              onChange={(e) => setAnnouncement({ ...announcement, closing: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Closing statement..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Target Vendors ({selectedVendors.length} selected)</span>
              </div>
            </label>
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 max-h-48 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {availableVendors.map(vendor => (
                  <label
                    key={vendor.vendor_id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vendor.vendor_id)}
                      onChange={() => toggleVendor(vendor.vendor_id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {vendor.vendor_name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => handleSave('Draft')}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>Save Draft</span>
        </button>
        <button
          onClick={() => handleSave('Published')}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          <span>Publish Announcement</span>
        </button>
      </div>
    </div>
  );
};

export default TenderAnnouncementEditor;
