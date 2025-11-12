import React, { useState, useEffect } from 'react';
import { Sparkles, Save, Send, Eye, Edit2, FileText, Calendar, Trophy } from 'lucide-react';
import { EProcurementAgent } from '../../services/eProcurementAgent';

interface WinnerAnnouncementEditorProps {
  event: any;
  onSaved: () => void;
}

const WinnerAnnouncementEditor: React.FC<WinnerAnnouncementEditorProps> = ({ event, onSaved }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [announcement, setAnnouncement] = useState({
    title: '',
    header: '',
    opener: '',
    body: '',
    closing: ''
  });

  const [winnerInfo] = useState({
    vendor_name: event.shortlisted_vendors?.[0] || 'Selected Vendor',
    final_score: 92.5,
    contract_value: event.estimate_price,
    award_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    generateAnnouncement();
  }, []);

  const generateAnnouncement = async () => {
    setIsGenerating(true);

    try {
      const generatedContent = await EProcurementAgent.mockGenerateAnnouncement(event, 'winner');

      setAnnouncement({
        title: generatedContent.title,
        header: generatedContent.header,
        opener: generatedContent.opener,
        body: generatedContent.body,
        closing: generatedContent.closing
      });
    } catch (error) {
      console.error('Error generating announcement:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setAnnouncement(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegenerate = () => {
    generateAnnouncement();
  };

  const handleSaveDraft = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Announcement saved as draft');
    setIsGenerating(false);
  };

  const handlePublish = async () => {
    if (!window.confirm('Are you sure you want to publish this winner announcement? All participating vendors will be notified.')) {
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Winner announcement published successfully! Vendors have been notified.');
    onSaved();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-600 to-amber-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Winner Announcement</h2>
        <p className="text-yellow-100 mb-4">{event.title}</p>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-yellow-200 mb-1">Event ID</p>
            <p className="font-semibold">{event.id}</p>
          </div>
          <div>
            <p className="text-yellow-200 mb-1">Category</p>
            <p className="font-semibold">{event.category}</p>
          </div>
          <div>
            <p className="text-yellow-200 mb-1">Winner</p>
            <p className="font-semibold flex items-center space-x-1">
              <Trophy className="h-4 w-4" />
              <span>{winnerInfo.vendor_name}</span>
            </p>
          </div>
          <div>
            <p className="text-yellow-200 mb-1">Contract Value</p>
            <p className="font-semibold">Rp {winnerInfo.contract_value?.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowPreview(false)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              !showPreview
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white'
            }`}
          >
            <Edit2 className="h-4 w-4 inline mr-2" />
            Edit
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              showPreview
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white'
            }`}
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Preview
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {!showPreview && (
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isGenerating ? 'Regenerating...' : 'Regenerate'}</span>
            </button>
          )}
        </div>
      </div>

      {!showPreview ? (
        <div className="space-y-6">
          {isGenerating ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
              <div className="animate-spin h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Generating winner announcement...</p>
            </div>
          ) : (
            <>
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Announcement Title
                </label>
                <input
                  type="text"
                  value={announcement.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter announcement title"
                />
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Header
                </label>
                <input
                  type="text"
                  value={announcement.header}
                  onChange={(e) => handleFieldChange('header', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter header text"
                />
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Opening Statement
                </label>
                <textarea
                  value={announcement.opener}
                  onChange={(e) => handleFieldChange('opener', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter opening statement"
                />
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Body Content
                </label>
                <textarea
                  value={announcement.body}
                  onChange={(e) => handleFieldChange('body', e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter main content"
                />
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Closing Statement
                </label>
                <textarea
                  value={announcement.closing}
                  onChange={(e) => handleFieldChange('closing', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter closing statement"
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <img
                src="/acnlogoonlywhite.png"
                alt="Organization Logo"
                className="h-16 mx-auto mb-4 brightness-0 dark:brightness-100"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {announcement.header}
              </h1>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{winnerInfo.award_date}</span>
                </span>
                <span>•</span>
                <span>{event.id}</span>
              </div>
            </div>

            <div className="space-y-6 text-gray-700 dark:text-gray-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {announcement.title}
              </h2>

              <p className="text-lg">
                {announcement.opener}
              </p>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-600 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span>Selected Winner</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">Company Name</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{winnerInfo.vendor_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">Contract Value</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Rp {winnerInfo.contract_value?.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">Final Score</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{winnerInfo.final_score}/100</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">Award Date</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{winnerInfo.award_date}</p>
                  </div>
                </div>
              </div>

              <div className="whitespace-pre-wrap">
                {announcement.body}
              </div>

              <p className="pt-6 border-t border-gray-200 dark:border-gray-700">
                {announcement.closing}
              </p>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">Contact Information</p>
                <p>Procurement Department</p>
                <p>Email: procurement@company.com</p>
                <p>Phone: +62 21 1234 5678</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSaveDraft}
          disabled={isGenerating}
          className="px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>Save Draft</span>
        </button>
        <button
          onClick={handlePublish}
          disabled={isGenerating}
          className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          <span>{isGenerating ? 'Publishing...' : 'Publish Announcement'}</span>
        </button>
      </div>
    </div>
  );
};

export default WinnerAnnouncementEditor;
