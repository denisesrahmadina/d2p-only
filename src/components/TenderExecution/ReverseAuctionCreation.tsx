import React, { useState, useEffect } from 'react';
import { Sparkles, Save, Play, Settings, DollarSign, Clock, Eye, Users, Edit2, Check } from 'lucide-react';

interface ReverseAuctionCreationProps {
  event: any;
  onSaved: () => void;
}

const ReverseAuctionCreation: React.FC<ReverseAuctionCreationProps> = ({ event, onSaved }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [auctionConfig, setAuctionConfig] = useState({
    starting_price: event.estimate_price || 0,
    minimum_decrement: 0,
    minimum_decrement_percentage: 0.5,
    time_extension_trigger: 5,
    auto_extend_minutes: 3,
    bid_visibility: 'public',
    auction_duration_hours: 6,
    max_bids_per_vendor: 'unlimited'
  });

  const [rules, setRules] = useState<any>(null);
  const [supplierActions, setSupplierActions] = useState<any[]>([]);

  useEffect(() => {
    generateAuctionRules();
  }, []);

  const generateAuctionRules = async () => {
    setIsGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const minimumDecrement = Math.round(auctionConfig.starting_price * (auctionConfig.minimum_decrement_percentage / 100));

    const generatedRules = {
      minimum_bid_decrement: `Rp ${minimumDecrement.toLocaleString('id-ID')} (${auctionConfig.minimum_decrement_percentage}% of starting price)`,
      time_extension: `${auctionConfig.auto_extend_minutes} minutes if bid submitted in last ${auctionConfig.time_extension_trigger} minutes`,
      bid_withdrawal: 'Not allowed after submission',
      bid_visibility: auctionConfig.bid_visibility === 'public' ? 'All bids are visible to all participants' : 'Only your own bids are visible',
      maximum_bids_per_vendor: auctionConfig.max_bids_per_vendor === 'unlimited' ? 'Unlimited' : auctionConfig.max_bids_per_vendor,
      tie_breaker: 'First bid submitted at lowest price wins',
      auction_duration: `${auctionConfig.auction_duration_hours} hours from start time`,
      qualification_requirements: 'Must have submitted complete tender documents and passed technical evaluation',
      payment_terms: 'As per tender document specifications',
      delivery_terms: `Delivery to ${event.delivery_location} by ${event.delivery_date}`
    };

    const generatedActions = [
      {
        id: 'submit-bid',
        label: 'Submit Bid',
        type: 'primary',
        enabled: true,
        description: 'Submit a new bid lower than current lowest bid'
      },
      {
        id: 'view-history',
        label: 'View Bid History',
        type: 'secondary',
        enabled: true,
        description: 'View your bidding history and statistics'
      },
      {
        id: 'view-leaderboard',
        label: 'View Leaderboard',
        type: 'secondary',
        enabled: true,
        description: 'View current standings and competitor bids'
      },
      {
        id: 'send-inquiry',
        label: 'Send Inquiry',
        type: 'secondary',
        enabled: true,
        description: 'Send clarification questions to procurement team'
      }
    ];

    setRules(generatedRules);
    setSupplierActions(generatedActions);
    setAuctionConfig(prev => ({
      ...prev,
      minimum_decrement: minimumDecrement
    }));
    setIsGenerating(false);
  };

  const handleConfigChange = (field: string, value: any) => {
    setAuctionConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegenerate = () => {
    generateAuctionRules();
  };

  const handleSave = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSaved();
  };

  const handlePublish = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Auction published successfully! Vendors have been notified.');
    onSaved();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Configure Reverse Auction</h2>
        <p className="text-orange-100 mb-4">{event.title}</p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-orange-200 mb-1">Event ID</p>
            <p className="font-semibold">{event.id}</p>
          </div>
          <div>
            <p className="text-orange-200 mb-1">Category</p>
            <p className="font-semibold">{event.category}</p>
          </div>
          <div>
            <p className="text-orange-200 mb-1">Participants</p>
            <p className="font-semibold">{event.shortlisted_vendors?.length || 0} vendors</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <span>Auction Configuration</span>
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-orange-600 dark:text-orange-400 hover:underline flex items-center space-x-1"
              >
                {isEditing ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                <span>{isEditing ? 'Done' : 'Edit'}</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Starting Price
                </label>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={auctionConfig.starting_price}
                    onChange={(e) => handleConfigChange('starting_price', parseFloat(e.target.value))}
                    disabled={!isEditing}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Bid Decrement (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={auctionConfig.minimum_decrement_percentage}
                  onChange={(e) => handleConfigChange('minimum_decrement_percentage', parseFloat(e.target.value))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Minimum: Rp {Math.round(auctionConfig.starting_price * (auctionConfig.minimum_decrement_percentage / 100)).toLocaleString('id-ID')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auction Duration (hours)
                </label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={auctionConfig.auction_duration_hours}
                    onChange={(e) => handleConfigChange('auction_duration_hours', parseInt(e.target.value))}
                    disabled={!isEditing}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Extension Trigger (minutes before end)
                </label>
                <input
                  type="number"
                  value={auctionConfig.time_extension_trigger}
                  onChange={(e) => handleConfigChange('time_extension_trigger', parseInt(e.target.value))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auto-extend Duration (minutes)
                </label>
                <input
                  type="number"
                  value={auctionConfig.auto_extend_minutes}
                  onChange={(e) => handleConfigChange('auto_extend_minutes', parseInt(e.target.value))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bid Visibility
                </label>
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-gray-400" />
                  <select
                    value={auctionConfig.bid_visibility}
                    onChange={(e) => handleConfigChange('bid_visibility', e.target.value)}
                    disabled={!isEditing}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900"
                  >
                    <option value="public">Public - All bids visible</option>
                    <option value="private">Private - Own bids only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Bids per Vendor
                </label>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-400" />
                  <select
                    value={auctionConfig.max_bids_per_vendor}
                    onChange={(e) => handleConfigChange('max_bids_per_vendor', e.target.value)}
                    disabled={!isEditing}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900"
                  >
                    <option value="unlimited">Unlimited</option>
                    <option value="5">5 bids</option>
                    <option value="10">10 bids</option>
                    <option value="20">20 bids</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isGenerating ? 'Regenerating...' : 'Regenerate Rules'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span>Generated Auction Rules</span>
            </h3>

            {isGenerating ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Generating auction rules...</p>
              </div>
            ) : rules ? (
              <div className="space-y-3">
                {Object.entries(rules).map(([key, value]) => (
                  <div key={key} className="pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">{value as string}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Supplier Action Buttons</h3>

            <div className="space-y-3">
              {supplierActions.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{action.description}</p>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      action.type === 'primary'
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                    } ${!action.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!action.enabled}
                  >
                    {action.label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSave}
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
          <Play className="h-4 w-4" />
          <span>{isGenerating ? 'Publishing...' : 'Publish Auction'}</span>
        </button>
      </div>
    </div>
  );
};

export default ReverseAuctionCreation;
