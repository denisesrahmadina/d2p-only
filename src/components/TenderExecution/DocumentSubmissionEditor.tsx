import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, GripVertical, Sparkles, Eye } from 'lucide-react';
import { DocumentSubmissionSectionService, DocumentSubmissionSection } from '../../services/documentSubmissionSectionService';
import { useAuth } from '../../contexts/AuthContext';

interface DocumentSubmissionEditorProps {
  event: any;
  onSaved: () => void;
}

const DocumentSubmissionEditor: React.FC<DocumentSubmissionEditorProps> = ({ event, onSaved }) => {
  const { selectedOrganization } = useAuth();
  const [sections, setSections] = useState<DocumentSubmissionSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadSections();
  }, [event]);

  const loadSections = async () => {
    try {
      const data = await DocumentSubmissionSectionService.getSectionsByEvent(event.sourcing_event_id);
      setSections(data);
    } catch (error) {
      console.error('Failed to load sections:', error);
    }
  };

  const handleAutoGenerate = async () => {
    const generated = DocumentSubmissionSectionService.generateStandardSections(
      event.sourcing_event_id,
      selectedOrganization || 'indonesia-power',
      event.sourcing_event_name
    );
    setSections(generated as DocumentSubmissionSection[]);
  };

  const handleAddSection = () => {
    const newSection: Partial<DocumentSubmissionSection> = {
      sourcing_event_id: event.sourcing_event_id,
      section_name: '',
      section_description: '',
      section_order: sections.length + 1,
      is_required: true,
      file_types_allowed: ['pdf'],
      max_file_size_mb: 10,
      organization_id: selectedOrganization || 'indonesia-power'
    };
    setSections([...sections, newSection as DocumentSubmissionSection]);
  };

  const handleUpdateSection = (index: number, updates: Partial<DocumentSubmissionSection>) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], ...updates };
    setSections(updated);
  };

  const handleDeleteSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await DocumentSubmissionSectionService.getSectionsByEvent(event.sourcing_event_id)
        .then(existing => {
          return Promise.all(existing.map(s => s.id && DocumentSubmissionSectionService.deleteSection(s.id)));
        });

      const validSections = sections
        .filter(s => s.section_name.trim().length > 0)
        .map((s, idx) => ({
          ...s,
          section_order: idx + 1
        }));

      if (validSections.length > 0) {
        await DocumentSubmissionSectionService.batchCreateSections(
          validSections.map(({ id, created_at, updated_at, ...rest }) => rest)
        );
      }

      onSaved();
    } catch (error) {
      console.error('Failed to save sections:', error);
      alert('Failed to save sections');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Document Submission Setup
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Document Submission Requirements
            </h2>
            <div className="space-y-6">
              {sections.map((section, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {idx + 1}. {section.section_name}
                      {section.is_required && <span className="text-red-500 ml-1">*</span>}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {section.section_description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-500">
                    <span>Accepted: {section.file_types_allowed?.join(', ')}</span>
                    <span>Max size: {section.max_file_size_mb}MB</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className="pt-2">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={section.section_name}
                      onChange={(e) => handleUpdateSection(idx, { section_name: e.target.value })}
                      placeholder="Section name"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={section.is_required}
                          onChange={(e) => handleUpdateSection(idx, { is_required: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <span>Required</span>
                      </label>
                    </div>
                  </div>
                  <textarea
                    value={section.section_description || ''}
                    onChange={(e) => handleUpdateSection(idx, { section_description: e.target.value })}
                    placeholder="Section description"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={section.file_types_allowed?.join(', ')}
                      onChange={(e) => handleUpdateSection(idx, { file_types_allowed: e.target.value.split(',').map(s => s.trim()) })}
                      placeholder="File types (pdf, doc, xlsx)"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                    <input
                      type="number"
                      value={section.max_file_size_mb}
                      onChange={(e) => handleUpdateSection(idx, { max_file_size_mb: parseInt(e.target.value) })}
                      placeholder="Max size (MB)"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteSection(idx)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddSection}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Section</span>
          </button>
        </div>
      )}

      <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>Save Configuration</span>
        </button>
      </div>
    </div>
  );
};

export default DocumentSubmissionEditor;
