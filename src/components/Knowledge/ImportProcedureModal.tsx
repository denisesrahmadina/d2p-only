import React, { useState } from 'react';
import { X, Upload, FileText, AlertTriangle, CheckCircle, Loader, File } from 'lucide-react';
import { KnowledgeService, type KnowledgeDocument } from '../../services';

interface ProcedureData {
  name: string;
  description: string;
  type: 'procedure';
  category: string;
  version: string;
  status: 'active' | 'draft' | 'archived' | 'under_review';
  fileType: 'pdf' | 'docx' | 'xlsx' | 'html';
  tags: string[];
  uploadedBy: string;
  uploadedByRole: string;
  approvedBy: string;
  effectiveDate: string;
  lastReviewed: string;
  nextReview: string;
  fileContent: string;
  fileName: string;
  fileSize: string;
  url: string;
  previewUrl?: string;
}

interface ImportProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (procedureData: ProcedureData) => void;
}

const ImportProcedureModal: React.FC<ImportProcedureModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [formData, setFormData] = useState<ProcedureData>({
    name: '',
    description: '',
    type: 'procedure',
    category: '',
    version: 'v1.0',
    status: 'draft',
    fileType: 'pdf',
    tags: [],
    uploadedBy: '',
    uploadedByRole: '',
    approvedBy: '',
    effectiveDate: '',
    lastReviewed: '',
    nextReview: '',
    fileContent: '',
    fileName: '',
    fileSize: '',
    url: '',
    previewUrl: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [fileAnalysis, setFileAnalysis] = useState<{
    pageCount: number;
    wordCount: number;
    hasValidStructure: boolean;
    procedureType: string;
  } | null>(null);
  const [tagsInput, setTagsInput] = useState('');

  const handleInputChange = (field: keyof ProcedureData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleTagsChange = (tagsString: string) => {
    setTagsInput(tagsString);
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    handleInputChange('tags', tagsArray);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['.pdf', '.docx', '.doc', '.html', '.htm'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(fileExtension)) {
      setValidationErrors(['Please upload a valid document file: .pdf, .docx, .doc, .html, or .htm']);
      return;
    }

    // Validate file size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      setValidationErrors(['File size must be less than 25MB']);
      return;
    }

    setSelectedFile(file);
    setIsFileUploading(true);
    setValidationErrors([]);

    try {
      // Simulate file analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock analysis results based on filename
      const fileName = file.name.toLowerCase();
      let procedureType = 'Standard Operating Procedure';
      
      if (fileName.includes('invoice') || fileName.includes('payment')) {
        procedureType = 'Finance Operations Procedure';
      } else if (fileName.includes('employee') || fileName.includes('hr') || fileName.includes('payroll')) {
        procedureType = 'HR Services Procedure';
      } else if (fileName.includes('it') || fileName.includes('incident') || fileName.includes('support')) {
        procedureType = 'IT Support Procedure';
      } else if (fileName.includes('procurement') || fileName.includes('purchase')) {
        procedureType = 'Procurement Procedure';
      } else if (fileName.includes('compliance') || fileName.includes('audit')) {
        procedureType = 'Compliance Procedure';
      }
      
      const analysis = {
        pageCount: Math.floor(Math.random() * 20) + 10,
        wordCount: Math.floor(Math.random() * 5000) + 2000,
        hasValidStructure: true,
        procedureType
      };
      
      setFileAnalysis(analysis);
      
      // Auto-populate form fields based on analysis
      const fileTypeMap: { [key: string]: 'pdf' | 'docx' | 'xlsx' | 'html' } = {
        '.pdf': 'pdf',
        '.docx': 'docx',
        '.doc': 'docx',
        '.html': 'html',
        '.htm': 'html'
      };
      
      // Generate mock URL (in real implementation, this would be the actual upload URL)
      const mockUrl = `https://ssc-knowledge.s3.amazonaws.com/procedures/${file.name.replace(/\s+/g, '-').toLowerCase()}`;
      const mockPreviewUrl = `https://ssc-knowledge.s3.amazonaws.com/procedures/preview/${file.name.replace(/\s+/g, '-').toLowerCase().replace(/\.[^/.]+$/, '.html')}`;
      
      setFormData(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        fileContent: `Document file content: ${file.name}`,
        fileType: fileTypeMap[fileExtension] || 'pdf',
        name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
        url: mockUrl,
        previewUrl: mockPreviewUrl,
        category: procedureType.includes('Finance') ? 'Finance Operations' :
                 procedureType.includes('HR') ? 'HR Services' :
                 procedureType.includes('IT') ? 'IT Support Services' :
                 procedureType.includes('Procurement') ? 'Procurement Services' :
                 procedureType.includes('Compliance') ? 'Compliance & Risk Management' :
                 'General Operations'
      }));
      
    } catch (error) {
      setValidationErrors(['Failed to analyze file content. Please try again.']);
      setFileAnalysis(null);
    } finally {
      setIsFileUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFileAnalysis(null);
    setFormData(prev => ({
      ...prev,
      fileName: '',
      fileSize: '',
      fileContent: '',
      name: '',
      url: '',
      previewUrl: ''
    }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push('Procedure name is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (!formData.category.trim()) errors.push('Category is required');
    if (!formData.uploadedBy.trim()) errors.push('Uploaded by is required');
    if (!formData.uploadedByRole.trim()) errors.push('Uploaded by role is required');
    if (!formData.approvedBy.trim()) errors.push('Approved by is required');
    if (!formData.effectiveDate.trim()) errors.push('Effective date is required');
    if (!formData.nextReview.trim()) errors.push('Next review date is required');
    if (!selectedFile) errors.push('Procedure document file is required');
    if (!formData.version.trim()) errors.push('Version is required');

    // Validate file analysis
    if (fileAnalysis && !fileAnalysis.hasValidStructure) {
      errors.push('Document file does not have valid procedure structure');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set upload date and last reviewed date
      const now = new Date().toISOString();
      const procedureData: ProcedureData = {
        ...formData,
        lastReviewed: formData.lastReviewed || now
      };
      
      // Call the import callback
      onImport(procedureData);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: 'procedure',
        category: '',
        version: 'v1.0',
        status: 'draft',
        fileType: 'pdf',
        tags: [],
        uploadedBy: '',
        uploadedByRole: '',
        approvedBy: '',
        effectiveDate: '',
        lastReviewed: '',
        nextReview: '',
        fileContent: '',
        fileName: '',
        fileSize: '',
        url: '',
        previewUrl: ''
      });
      setSelectedFile(null);
      setFileAnalysis(null);
      setTagsInput('');
      
    } catch (error) {
      console.error('Error importing procedure:', error);
      setValidationErrors(['Failed to import procedure. Please try again.']);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      setValidationErrors([]);
      setFileAnalysis(null);
      setSelectedFile(null);
      setTagsInput('');
    }
  };

  const availableCategories = [
    'Finance Operations',
    'HR Services', 
    'IT Support Services',
    'Procurement Services',
    'Data Analytics & Reporting',
    'Compliance & Risk Management',
    'Service Management',
    'Quality Assurance',
    'General Operations'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Import Procedure Document
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload standard operating procedure for SSC operations
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900 dark:text-red-300 mb-2">Please fix the following errors:</h3>
                    <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Procedure Document File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Procedure Document File *
              </label>
              
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="procedure-file-upload"
                    accept=".pdf,.docx,.doc,.html,.htm"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isProcessing || isFileUploading}
                  />
                  <label
                    htmlFor="procedure-file-upload"
                    className="cursor-pointer flex flex-col items-center space-y-3"
                  >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                      {isFileUploading ? (
                        <Loader className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin" />
                      ) : (
                        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {isFileUploading ? 'Analyzing procedure document...' : 'Upload Procedure Document'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Supports .pdf, .docx, .doc, .html files (max 25MB)
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File Info */}
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                          <File className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-300">{selectedFile.name}</p>
                          <p className="text-xs text-blue-700 dark:text-blue-400">
                            {(selectedFile.size / 1024 / 1024).toFixed(1)} MB • {selectedFile.type || 'application/pdf'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={clearFile}
                        disabled={isProcessing}
                        className="p-2 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors disabled:opacity-50"
                        title="Remove file and upload different one"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* File Analysis Results */}
                  {fileAnalysis && (
                    <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
                      <h3 className="font-semibold text-green-900 dark:text-green-300 mb-3 flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Document Analysis Results</span>
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-green-800 dark:text-green-200 font-medium">Pages:</span>
                          <span className="ml-2 text-green-900 dark:text-green-100">{fileAnalysis.pageCount}</span>
                        </div>
                        <div>
                          <span className="text-green-800 dark:text-green-200 font-medium">Words:</span>
                          <span className="ml-2 text-green-900 dark:text-green-100">{fileAnalysis.wordCount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-green-800 dark:text-green-200 font-medium">Structure:</span>
                          <span className="ml-2 text-green-900 dark:text-green-100">
                            {fileAnalysis.hasValidStructure ? '✓ Valid' : '✗ Invalid'}
                          </span>
                        </div>
                        <div>
                          <span className="text-green-800 dark:text-green-200 font-medium">Type:</span>
                          <span className="ml-2 text-green-900 dark:text-green-100">{fileAnalysis.procedureType}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Upload your procedure document. The system will analyze and categorize it automatically.
              </p>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Procedure Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Invoice Processing Standard Operating Procedure"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                  required
                >
                  <option value="">Select Category</option>
                  {availableCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Version *
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  placeholder="e.g., v1.0, v2.1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                >
                  <option value="draft">Draft</option>
                  <option value="under_review">Under Review</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the procedure purpose, scope, and key processes covered..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                disabled={isProcessing}
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="e.g., finance, invoice, payment, automation (comma-separated)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isProcessing}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Ownership and Approval */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Uploaded By *
                </label>
                <input
                  type="text"
                  value={formData.uploadedBy}
                  onChange={(e) => handleInputChange('uploadedBy', e.target.value)}
                  placeholder="e.g., Sarah Johnson"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Uploaded By Role *
                </label>
                <input
                  type="text"
                  value={formData.uploadedByRole}
                  onChange={(e) => handleInputChange('uploadedByRole', e.target.value)}
                  placeholder="e.g., Finance Operations Director"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Approved By *
                </label>
                <input
                  type="text"
                  value={formData.approvedBy}
                  onChange={(e) => handleInputChange('approvedBy', e.target.value)}
                  placeholder="e.g., Michael Chen"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Effective Date *
                </label>
                <input
                  type="date"
                  value={formData.effectiveDate ? formData.effectiveDate.split('T')[0] : ''}
                  onChange={(e) => handleInputChange('effectiveDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                  required
                />
              </div>
            </div>

            {/* Review Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Reviewed
                </label>
                <input
                  type="date"
                  value={formData.lastReviewed ? formData.lastReviewed.split('T')[0] : ''}
                  onChange={(e) => handleInputChange('lastReviewed', e.target.value ? new Date(e.target.value).toISOString() : '')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Next Review Date *
                </label>
                <input
                  type="date"
                  value={formData.nextReview ? formData.nextReview.split('T')[0] : ''}
                  onChange={(e) => handleInputChange('nextReview', e.target.value ? new Date(e.target.value).toISOString() : '')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                  required
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>The procedure document will be analyzed and made available in the knowledge base.</p>
              <p className="text-xs mt-1">* Required fields</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isProcessing}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isProcessing || validationErrors.length > 0}
                className="flex text-sm items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isProcessing ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Import Procedure</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportProcedureModal;