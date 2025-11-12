import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Clock, AlertCircle, Download, Eye, Trash2, Send, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DocumentSection {
  id: string;
  section_name: string;
  description: string;
  required: boolean;
  file_types: string[];
  max_file_size: number;
  submitted: boolean;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  submission_date?: string;
  feedback?: string;
}

interface SourcingEvent {
  sourcing_event_id: string;
  sourcing_event_name: string;
  tender_end_date: string;
  estimated_price: number;
  material_id: string;
}

const ExternalDocumentSubmissionView: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<SourcingEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SourcingEvent | null>(null);
  const [documentSections, setDocumentSections] = useState<DocumentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);

  useEffect(() => {
    loadJoinedEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      loadDocumentSections(selectedEvent.sourcing_event_id);
    }
  }, [selectedEvent]);

  const loadJoinedEvents = async () => {
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
        .order('tender_end_date', { ascending: true })
        .limit(20);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Failed to load joined events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocumentSections = async (eventId: string) => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );

      const { data, error } = await supabase
        .from('ref_document_submission_section')
        .select('*')
        .eq('sourcing_event_id', eventId);

      if (error) throw error;

      const mockSections: DocumentSection[] = data && data.length > 0
        ? data.map((section: any, idx: number) => ({
            id: section.id || `section-${idx}`,
            section_name: section.section_name,
            description: section.description || '',
            required: section.required ?? true,
            file_types: section.allowed_file_types || ['.pdf', '.doc', '.docx'],
            max_file_size: section.max_file_size || 10,
            submitted: idx < 2,
            status: idx === 0 ? 'approved' : idx === 1 ? 'submitted' : 'pending',
            submission_date: idx < 2 ? new Date(Date.now() - idx * 86400000).toISOString() : undefined,
            feedback: idx === 0 ? 'Document approved and verified' : undefined
          }))
        : [
            {
              id: '1',
              section_name: 'Company Profile',
              description: 'Upload your company profile, registration documents, and business license',
              required: true,
              file_types: ['.pdf', '.doc', '.docx'],
              max_file_size: 10,
              submitted: true,
              status: 'approved',
              submission_date: new Date(Date.now() - 172800000).toISOString(),
              feedback: 'Document approved and verified'
            },
            {
              id: '2',
              section_name: 'Technical Specifications',
              description: 'Provide detailed technical specifications and product catalog',
              required: true,
              file_types: ['.pdf', '.doc', '.docx', '.xlsx'],
              max_file_size: 15,
              submitted: true,
              status: 'submitted',
              submission_date: new Date(Date.now() - 86400000).toISOString()
            },
            {
              id: '3',
              section_name: 'Price Quotation',
              description: 'Submit detailed price quotation with breakdown',
              required: true,
              file_types: ['.pdf', '.xlsx'],
              max_file_size: 5,
              submitted: false,
              status: 'pending'
            },
            {
              id: '4',
              section_name: 'Quality Certifications',
              description: 'Upload ISO certifications and quality standards compliance documents',
              required: true,
              file_types: ['.pdf'],
              max_file_size: 10,
              submitted: false,
              status: 'pending'
            },
            {
              id: '5',
              section_name: 'Project References',
              description: 'Provide references from previous similar projects',
              required: false,
              file_types: ['.pdf', '.doc', '.docx'],
              max_file_size: 10,
              submitted: false,
              status: 'pending'
            },
            {
              id: '6',
              section_name: 'Delivery Plan',
              description: 'Submit delivery timeline and logistics plan',
              required: true,
              file_types: ['.pdf', '.doc', '.docx'],
              max_file_size: 10,
              submitted: false,
              status: 'pending'
            }
          ];

      setDocumentSections(mockSections);
    } catch (error) {
      console.error('Failed to load document sections:', error);
    }
  };

  const handleFileUpload = (sectionId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingSection(sectionId);

    setTimeout(() => {
      setDocumentSections(prev =>
        prev.map(section =>
          section.id === sectionId
            ? {
                ...section,
                submitted: true,
                status: 'submitted',
                submission_date: new Date().toISOString()
              }
            : section
        )
      );
      setUploadingSection(null);
    }, 1500);
  };

  const handleDeleteSubmission = (sectionId: string) => {
    setDocumentSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              submitted: false,
              status: 'pending',
              submission_date: undefined,
              feedback: undefined
            }
          : section
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'submitted':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getDaysRemaining = (endDate: string): number => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const submittedCount = documentSections.filter(s => s.submitted).length;
  const totalRequired = documentSections.filter(s => s.required).length;
  const completionPercentage = totalRequired > 0 ? Math.round((submittedCount / totalRequired) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Document Submission
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select a tender to submit documents
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{events.length}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Available Tenders</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">0</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed Submissions</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {events.filter(e => getDaysRemaining(e.tender_end_date) <= 7).length}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Deadline Approaching</p>
          </div>
        </div>

        <div className="space-y-3">
          {events.map((event) => {
            const daysRemaining = getDaysRemaining(event.tender_end_date);
            return (
              <button
                key={event.sourcing_event_id}
                onClick={() => setSelectedEvent(event)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      {event.sourcing_event_name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                      Material: {event.material_id}
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-gray-500 dark:text-gray-500 mb-1">Value</p>
                        <p className="text-gray-900 dark:text-white font-semibold">
                          {formatCurrency(event.estimated_price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-500 mb-1">Deadline</p>
                        <p className={`font-semibold ${daysRemaining <= 7 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                          {daysRemaining} days left
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-500 mb-1">Status</p>
                        <p className="text-orange-600 dark:text-orange-400 font-semibold">
                          Not Started
                        </p>
                      </div>
                    </div>
                  </div>
                  <Upload className="h-5 w-5 text-gray-400 ml-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => setSelectedEvent(null)}
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        ← Back to Tenders
      </button>

      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{selectedEvent.sourcing_event_name}</h2>
            <p className="text-blue-100 mb-4">ID: {selectedEvent.sourcing_event_id}</p>
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-sm text-blue-200 mb-1">Submission Progress</p>
                <p className="text-xl font-bold">{submittedCount} of {totalRequired} required</p>
              </div>
              <div>
                <p className="text-sm text-blue-200 mb-1">Deadline</p>
                <p className="text-xl font-bold">{getDaysRemaining(selectedEvent.tender_end_date)} days remaining</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="w-32 h-32 rounded-full border-8 border-white/30 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold">{completionPercentage}%</p>
                <p className="text-xs text-blue-200">Complete</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Sections', value: documentSections.length, icon: FileText, color: 'blue' },
          { label: 'Submitted', value: submittedCount, icon: CheckCircle, color: 'green' },
          { label: 'Approved', value: documentSections.filter(s => s.status === 'approved').length, icon: CheckCircle, color: 'emerald' },
          { label: 'Pending', value: documentSections.filter(s => s.status === 'pending').length, icon: Clock, color: 'orange' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {documentSections.map((section) => (
          <div
            key={section.id}
            className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {section.section_name}
                  </h4>
                  {section.required && (
                    <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                      Required
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs font-medium rounded flex items-center space-x-1 ${getStatusColor(section.status)}`}>
                    {getStatusIcon(section.status)}
                    <span className="capitalize">{section.status}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {section.description}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-500">
                  <span>Accepted: {section.file_types.join(', ')}</span>
                  <span>Max size: {section.max_file_size}MB</span>
                </div>
                {section.submission_date && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Submitted: {new Date(section.submission_date).toLocaleString('id-ID')}
                  </p>
                )}
                {section.feedback && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-300">{section.feedback}</p>
                  </div>
                )}
              </div>
            </div>

            {section.submitted ? (
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                {section.status !== 'approved' && (
                  <button
                    onClick={() => handleDeleteSubmission(section.id)}
                    className="px-4 py-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="relative">
                <input
                  type="file"
                  id={`file-${section.id}`}
                  accept={section.file_types.join(',')}
                  onChange={(e) => handleFileUpload(section.id, e.target.files)}
                  className="hidden"
                  disabled={uploadingSection === section.id}
                />
                <label
                  htmlFor={`file-${section.id}`}
                  className={`block px-6 py-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                    uploadingSection === section.id
                      ? 'border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/10'
                      : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {uploadingSection === section.id ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-blue-600 dark:text-blue-400">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {section.file_types.join(', ')} up to {section.max_file_size}MB
                      </p>
                    </>
                  )}
                </label>
              </div>
            )}
          </div>
        ))}
      </div>

      {submittedCount === totalRequired && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800 p-6">
          <div className="flex items-center space-x-4">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <p className="text-lg font-semibold text-green-900 dark:text-green-300 mb-1">
                All Required Documents Submitted
              </p>
              <p className="text-sm text-green-700 dark:text-green-400">
                Your submission is complete and under review. You will be notified of any updates.
              </p>
            </div>
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Final Submit</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalDocumentSubmissionView;
