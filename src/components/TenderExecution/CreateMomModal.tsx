import React, { useState, useEffect } from 'react';
import { X, FileText, Calendar, Users as UsersIcon, ExternalLink, CheckCircle } from 'lucide-react';
import { MomDocumentService, MomTemplate, MomDocument } from '../../services/momDocumentService';
import { useAuth } from '../../contexts/AuthContext';

interface CreateMomModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourcingEventId: string;
  sourcingEventName: string;
  onDocumentCreated?: () => void;
}

const CreateMomModal: React.FC<CreateMomModalProps> = ({
  isOpen,
  onClose,
  sourcingEventId,
  sourcingEventName,
  onDocumentCreated
}) => {
  const { user, selectedOrganization } = useAuth();
  const [templates, setTemplates] = useState<MomTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MomTemplate | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'details' | 'created'>('select');
  const [createdDocument, setCreatedDocument] = useState<MomDocument | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
      setDocumentName(`Negotiation MoM - ${sourcingEventName}`);
    }
  }, [isOpen, sourcingEventName]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await MomDocumentService.getAllTemplates(selectedOrganization || undefined);
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: MomTemplate) => {
    setSelectedTemplate(template);
    setStep('details');
  };

  const handleCreateDocument = async () => {
    if (!selectedTemplate) return;

    setLoading(true);
    try {
      const participantsList = participants
        .split('\n')
        .filter(p => p.trim())
        .map(p => {
          const parts = p.split('-').map(s => s.trim());
          return {
            name: parts[0] || '',
            role: parts[1] || '',
            email: parts[2] || ''
          };
        });

      const documentUrl = MomDocumentService.generateDocumentUrl(
        selectedTemplate.file_url,
        `${sourcingEventId}-${Date.now()}`,
        sourcingEventName
      );

      const newDocument = await MomDocumentService.createDocument({
        sourcing_event_id: sourcingEventId,
        template_id: selectedTemplate.id,
        document_name: documentName,
        document_url: documentUrl,
        status: 'Draft',
        created_by: user?.email || 'unknown',
        meeting_date: meetingDate,
        participants: participantsList,
        notes: notes,
        organization_id: selectedOrganization || 'indonesia-power'
      });

      setCreatedDocument(newDocument);
      setStep('created');

      if (onDocumentCreated) {
        onDocumentCreated();
      }
    } catch (error) {
      console.error('Failed to create document:', error);
      alert('Failed to create document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('select');
    setSelectedTemplate(null);
    setDocumentName('');
    setParticipants('');
    setNotes('');
    setCreatedDocument(null);
    onClose();
  };

  const handleOpenDocument = () => {
    if (createdDocument) {
      window.open(createdDocument.document_url, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {step === 'select' && 'Select MoM Template'}
            {step === 'details' && 'Enter Meeting Details'}
            {step === 'created' && 'Document Created Successfully'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {step === 'select' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select a template for your negotiation Minutes of Meeting document
              </p>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Loading templates...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="text-left p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-400 dark:hover:border-orange-600 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                          <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {template.template_name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {template.template_description}
                          </p>
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {template.template_category}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'details' && selectedTemplate && (
            <div className="space-y-6">
              <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  <strong>Selected Template:</strong> {selectedTemplate.template_name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document Name
                </label>
                <input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter document name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Meeting Date
                </label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <UsersIcon className="h-4 w-4 inline mr-1" />
                  Participants (one per line: Name - Role - Email)
                </label>
                <textarea
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="John Doe - Procurement Manager - john@example.com&#10;Jane Smith - Vendor Representative - jane@vendor.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Additional notes about this meeting..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setStep('select')}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateDocument}
                  disabled={loading || !documentName.trim()}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Document'}
                </button>
              </div>
            </div>
          )}

          {step === 'created' && createdDocument && (
            <div className="text-center py-8">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Document Created Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your negotiation MoM document has been created and is ready to use.
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Document:</strong> {createdDocument.document_name}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Status:</strong> {createdDocument.status}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Created:</strong> {new Date(createdDocument.created_at || '').toLocaleString()}
                </p>
              </div>

              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={handleOpenDocument}
                  className="flex items-center space-x-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Document</span>
                </button>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateMomModal;
