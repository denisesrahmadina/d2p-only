import React, { useState } from 'react';
import { ArrowLeft, Building2, Search, Filter, ChevronDown, ChevronUp, Database, Settings, FileText, Wrench, Users, FolderOpen, Shield, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { KnowledgeService, type KnowledgeDocument } from '../services';
import UserGuideTab from '../components/Knowledge/UserGuideTab';
import ImportUserGuideModal from '../components/Knowledge/ImportUserGuideModal';
import PolicyTab from '../components/Knowledge/PolicyTab';
import ImportPolicyModal from '../components/Knowledge/ImportPolicyModal';
import ImportProcedureModal from '../components/Knowledge/ImportProcedureModal';
import ProcedureTab from '../components/Knowledge/ProcedureTab';

const KnowledgeModules: React.FC = () => {
  const { selectedOrganization } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [complexityFilter, setComplexityFilter] = useState('');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'procedure' | 'policy' | 'userguide'>('procedure');
  const [showImportProcedureModal, setShowImportProcedureModal] = useState(false);
  const [showImportUserGuideModal, setShowImportUserGuideModal] = useState(false);
  const [showImportTemplateModal, setShowImportTemplateModal] = useState(false);
  const [showImportPolicyModal, setShowImportPolicyModal] = useState(false);
  const [knowledgeDocuments, setKnowledgeDocuments] = useState<KnowledgeDocument[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Load knowledge documents
  React.useEffect(() => {
    const loadDocuments = async () => {
      if (!selectedOrganization) return;

      try {
        setLoading(true);
        // Load knowledge documents
        const knowledgeDocs = await KnowledgeService.getKnowledgeDocuments();
        setKnowledgeDocuments(knowledgeDocs);
      } catch (error) {
        console.error('Error loading knowledge documents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [selectedOrganization]);

  // Filter documents based on active tab
  const filteredDocuments = React.useMemo(() => {
    let filtered = knowledgeDocuments;

    if (activeTab === 'userguide') {
      filtered = knowledgeDocuments.filter(doc => doc.type === 'user guide');
    } else if (activeTab === 'policy') {
      filtered = knowledgeDocuments.filter(doc => doc.type === 'policy');
    } else if (activeTab === 'procedure') {
      filtered = knowledgeDocuments.filter(doc => doc.type === 'procedure');
    }

    if (searchTerm) {
      const lowerQuery = searchTerm.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(lowerQuery) ||
        doc.description.toLowerCase().includes(lowerQuery) ||
        doc.category.toLowerCase().includes(lowerQuery)
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(doc => doc.category === categoryFilter);
    }

    return filtered;
  }, [knowledgeDocuments, activeTab, searchTerm, categoryFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, activeTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Testing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'Planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Not Started': return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Finance': return Database;
      case 'Logistics': return Wrench;
      case 'Manufacturing': return Settings;
      case 'Quality': return Shield;
      case 'Maintenance': return Wrench;
      case 'Human Resources': return Users;
      case 'Project Management': return FolderOpen;
      case 'Technical': return Settings;
      default: return FileText;
    }
  };

  const getObjectTypeIcon = (type: string) => {
    switch (type) {
      case 'Master Data': return Database;
      case 'Transaction Data': return FileText;
      case 'Configuration': return Settings;
      case 'Process': return Wrench;
      default: return FileText;
    }
  };

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-md font-semibold text-gray-900 dark:text-white">
                Migration Modules
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Loading SAP modules...
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading migration modules...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header with Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/dashboard" 
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-md font-semibold text-gray-900 dark:text-white">
              Knowlegde Management
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage documents such as procedure, policies, and user guided books.
            </p>
          </div>
        </div>
        
        {/* Import Button */}
        {activeTab === 'procedure' ? (
          <button
            onClick={() => setShowImportProcedureModal(true)}
            className="flex text-sm items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Import Procedure</span>
          </button>
        ) : activeTab === 'policy' ? (
          <button
            onClick={() => setShowImportPolicyModal(true)}
            className="flex text-sm items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Import Policy</span>
          </button>
        ) : activeTab === 'userguide' ? (
          <button
            onClick={() => setShowImportUserGuideModal(true)}
            className="flex text-sm items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Import User Guide</span>
          </button>
        ) : null}
      </div>

      {/* Tabs Navigation */}
      <div>
        <div className="bg-white dark:bg-gray-900 rounded-t-lg shadow-sm border border-gray-200 dark:border-gray-800 mb-6">
          <nav className="flex space-x-6 px-4">
              <button
                onClick={() => setActiveTab('procedure')}
                className={`flex items-center space-x-2 py-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'procedure'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Database className="h-4 w-4" />
                <span>Procedure</span>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {knowledgeDocuments.filter(doc => doc.type === 'procedure').length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('policy')}
                className={`flex items-center space-x-2 py-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'policy'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Wrench className="h-4 w-4" />
                <span>Policy</span>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {knowledgeDocuments.filter(doc => doc.type === 'policy').length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('userguide')}
                className={`flex items-center space-x-2 py-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'userguide'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>User Guide</span>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {knowledgeDocuments.filter(doc => doc.type === 'user guide').length}
                </span>
              </button>
            
          </nav>
        </div>

        <div>
          {/* Modules Tab */}
          {activeTab === 'procedure' && (
            <ProcedureTab selectedOrganization={selectedOrganization} />
          )}

          {/* Functional Tab */}
          {activeTab === 'policy' && (
            <PolicyTab selectedOrganization={selectedOrganization} />
          )}

          {/* Requirements Tab */}
          {activeTab === 'userguide' && (
            <UserGuideTab selectedOrganization={selectedOrganization} />
          )}

        </div>
      </div>

      {/* Import Sub-Module Modal */}
      {showImportProcedureModal && (
        <ImportProcedureModal
          isOpen={showImportProcedureModal}
          onClose={() => setShowImportProcedureModal(false)}
          onImport={(procedureData) => {
            // Handle import logic here
            console.log('Importing procedure:', procedureData);
            setShowImportProcedureModal(false);
          }}
        />
      )}

      {/* Create Functional Modal */}
      {showImportPolicyModal && (
        <ImportPolicyModal
          isOpen={showImportPolicyModal}
          onClose={() => setShowImportPolicyModal(false)}
          onImport={(policyData) => {
            // Handle import logic here
            console.log('Importing policy:', policyData);
            setShowImportPolicyModal(false);
          }}
        />
      )}

      {/* Import Requirement Modal */}
      {showImportUserGuideModal && (
        <ImportUserGuideModal
          isOpen={showImportUserGuideModal}
          onClose={() => setShowImportUserGuideModal(false)}
          onImport={(userGuideData) => {
            // Handle import logic here
            console.log('Importing user guide:', userGuideData);
            setShowImportUserGuideModal(false);
          }}
        />
      )}

      {/* Import Template Modal */}
      {showImportTemplateModal && (
        <ImportTemplateModal
          isOpen={showImportTemplateModal}
          onClose={() => setShowImportTemplateModal(false)}
          onImport={(templateData) => {
            // Handle import logic here
            console.log('Importing template:', templateData);
            setShowImportTemplateModal(false);
          }}
        />
      )}
    </div>
  );
};

export default KnowledgeModules;