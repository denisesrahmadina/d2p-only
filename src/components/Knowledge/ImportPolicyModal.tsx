import React, { useState } from 'react';
import { X, Upload, Shield, AlertTriangle, CheckCircle, Loader, File } from 'lucide-react';
import { KnowledgeService, type KnowledgeDocument } from '../../services';

interface PolicyData {
  name: string;
  description: string;
  type: 'policy';
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

interface ImportPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (policyData: PolicyData) => void;
}

const ImportPolicyModal: React.FC<ImportPolicyModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [formData, setFormData] = useState<PolicyData>({
    name: '',
    description: '',
    type: 'policy',
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
    policyType: string;
  } | null>(null);
  const [tagsInput, setTagsInput] = useState('');

  const handleInputChange = (field: keyof PolicyData, value: string | string[]) => {
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
      let policyType = 'Organizational Policy';
      
      if (fileName.includes('security') || fileName.includes('information')) {
        policyType = 'Information Security Policy';
      } else if (fileName.includes('financial') || fileName.includes('finance')) {
        policyType = 'Financial Policy';
      } else if (fileName.includes('hr') || fileName.includes('human')) {
        policyType = 'Human Resources Policy';
      } else if (fileName.includes('procurement') || fileName.includes('vendor')) {
        policyType = 'Procurement Policy';
      } else if (fileName.includes('data') || fileName.includes('governance')) {
        policyType = 'Data Governance Policy';
      } else if (fileName.includes('quality') || fileName.includes('service')) {
        policyType = 'Quality Assurance Policy';
      } else if (fileName.includes('continuity') || fileName.includes('disaster')) {
        policyType = 'Business Continuity Policy';
      }
      
      const analysis = {
        pageCount: Math.floor(Math.random() * 15) + 8,
        wordCount: Math.floor(Math.random() * 3000) + 1500,
        hasValidStructure: true,
        policyType
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
      const mockUrl = `https://ssc-knowledge.s3.amazonaws.com/policies/${file.name.replace(/\s+/g, '-').toLowerCase()}`;
      const mockPreviewUrl = `https://ssc-knowledge.s3.amazonaws.com/policies/preview/${file.name.replace(/\s+/g, '-').toLowerCase().replace(/\.[^/.]+$/, '.html')}`;
      
      setFormData(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        fileContent: `Document file content: ${file.name}`,
        fileType: fileTypeMap[fileExtension] || 'pdf',
        name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
        url: mockUrl,
        previewUrl: mockPreviewUrl,
        category: policyType.includes('Security') ? 'IT Security' :
                 policyType.includes('Financial') ? 'Finance Operations' :
                 policyType.includes('Human') ? 'HR Services' :
                 policyType.includes('Procurement') ? 'Procurement Services' :
                 policyType.includes('Data') ? 'Data Analytics & Reporting' :
                 policyType.includes('Quality') ? 'Service Quality' :
                 policyType.includes('Continuity') ? 'Risk Management' :
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

    if (!formData.name.trim()) errors.push('Policy name is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (!formData.category.trim()) errors.push('Category is required');
    if (!formData.uploadedBy.trim()) errors.push('Uploaded by is required');
    if (!formData.uploadedByRole.trim()) errors.push('Uploaded by role is required');
    if (!formData.approvedBy.trim()) errors.push('Approved by is required');
    if (!formData.effectiveDate.trim()) errors.push('Effective date is required');
    if (!formData.nextReview.trim()) errors.push('Next review date is required');
    if (!selectedFile) errors.push('Policy document file is required');
    if (!formData.version.trim()) errors.push('Version is required');

    // Validate file analysis
    if (fileAnalysis && !fileAnalysis.hasValidStructure) {
      errors.push('Document file does not have valid policy structure');
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
      const policyData: PolicyData = {
        ...formData,
        lastReviewed: formData.lastReviewed || now
      };
      
      // Call the import callback
      onImport(policyData);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: 'policy',
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
      console.error('Error importing policy:', error);
      setValidationErrors(['Failed to import policy. Please try again.']);
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
    'IT Security',
    'Finance Operations',
    'HR Services', 
    'Procurement Services',
    'Data Analytics & Reporting',
    'Service Quality',
    'Risk Management',
    'Compliance & Governance',
    'General Operations'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-t-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Import Policy Document
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload organizational policy for SSC governance and compliance
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

            {/* Policy Document File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Policy Document File *
              </label>
              
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-orange-400 dark:hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    id="policy-file-upload"
                    accept=".pdf,.docx,.doc,.html,.htm"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isProcessing || isFileUploading}
                  />
                  <label
                    htmlFor="policy-file-upload"
                    className="cursor-pointer flex flex-col items-center space-y-3"
                  >
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                      {isFileUploading ? (
                        <Loader className="h-6 w-6 text-orange-600 dark:text-orange-400 animate-spin" />
                      ) : (
                        <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {isFileUploading ? 'Analyzing policy document...' : 'Upload Policy Document'}
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
                  <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                          <File className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-900 dark:text-orange-300">{selectedFile.name}</p>
                          <p className="text-xs text-orange-700 dark:text-orange-400">
                            {(selectedFile.size / 1024 / 1024).toFixed(1)} MB • {selectedFile.type || 'application/pdf'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={clearFile}
                        disabled={isProcessing}
                        className="p-2 rounded-md text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-800 transition-colors disabled:opacity-50"
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
                        <Shield className="h-4 w-4" />
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
                          <span className="ml-2 text-green-900 dark:text-green-100">{fileAnalysis.policyType}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Upload your policy document. The system will analyze and categorize it automatically.
              </p>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Policy Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Information Security Policy"
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
                placeholder="Describe the policy purpose, scope, and key requirements covered..."
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
                placeholder="e.g., security, data-protection, access-control, governance (comma-separated)"
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
                  placeholder="e.g., Jennifer Rodriguez"
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
                  placeholder="e.g., IT Support Director"
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
                  placeholder="e.g., Robert Thompson"
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
              <p>The policy document will be analyzed and made available in the knowledge base.</p>
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
                className="flex text-sm items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                {isProcessing ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Import Policy</span>
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

export default ImportPolicyModal;