import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  Tag,
  LayoutGrid,
  List,
  X,
  ChevronDown
} from 'lucide-react';
import { CombinedDocumentsService, UnifiedDocument, DocumentType } from '../services/combinedDocumentsService';

const DocumentLibrary: React.FC = () => {
  const [documents, setDocuments] = useState<UnifiedDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<UnifiedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<{
    types: DocumentType[];
    categories: string[];
    statuses: string[];
    fileTypes: string[];
  }>({
    types: [],
    categories: [],
    statuses: [],
    fileTypes: []
  });

  const [availableFilters, setAvailableFilters] = useState({
    categories: [] as string[],
    statuses: [] as string[],
    fileTypes: [] as string[]
  });

  const [summary, setSummary] = useState({
    totalDocuments: 0,
    rtmDocuments: 0,
    templateDocuments: 0
  });

  useEffect(() => {
    loadDocuments();
    loadFilters();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, documents]);

  const loadDocuments = async () => {
    setLoading(true);
    const docs = await CombinedDocumentsService.getAllDocuments();
    const summaryData = await CombinedDocumentsService.getDocumentsSummary();

    setDocuments(docs);
    setFilteredDocuments(docs);
    setSummary({
      totalDocuments: summaryData.totalDocuments,
      rtmDocuments: summaryData.rtmDocuments,
      templateDocuments: summaryData.templateDocuments
    });
    setLoading(false);
  };

  const loadFilters = async () => {
    const [categories, statuses, fileTypes] = await Promise.all([
      CombinedDocumentsService.getAllCategories(),
      CombinedDocumentsService.getAllStatuses(),
      CombinedDocumentsService.getAllFileTypes()
    ]);

    setAvailableFilters({ categories, statuses, fileTypes });
  };

  const applyFilters = async () => {
    const filtered = await CombinedDocumentsService.filterDocuments({
      type: filters.types.length > 0 ? filters.types : undefined,
      category: filters.categories.length > 0 ? filters.categories : undefined,
      status: filters.statuses.length > 0 ? filters.statuses : undefined,
      fileType: filters.fileTypes.length > 0 ? filters.fileTypes : undefined,
      searchTerm: searchTerm || undefined
    });

    setFilteredDocuments(filtered);
  };

  const toggleFilter = (filterType: keyof typeof filters, value: any) => {
    setFilters(prev => {
      const currentArray = prev[filterType] as any[];
      const exists = currentArray.includes(value);

      return {
        ...prev,
        [filterType]: exists
          ? currentArray.filter((item: any) => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      types: [],
      categories: [],
      statuses: [],
      fileTypes: []
    });
    setSearchTerm('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Document Library
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unified repository for RTM documents and templates
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">Total Documents</div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{summary.totalDocuments}</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="text-sm text-purple-700 dark:text-purple-300 mb-1">RTM Documents</div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{summary.rtmDocuments}</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="text-sm text-green-700 dark:text-green-300 mb-1">Templates</div>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{summary.templateDocuments}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents by name, description, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {(filters.types.length + filters.categories.length + filters.statuses.length + filters.fileTypes.length) > 0 && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {filters.types.length + filters.categories.length + filters.statuses.length + filters.fileTypes.length}
                </span>
              )}
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">Document Type</label>
                  <div className="space-y-2">
                    {(['rtm', 'template'] as DocumentType[]).map(type => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.types.includes(type)}
                          onChange={() => toggleFilter('types', type)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">Status</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableFilters.statuses.map(status => (
                      <label key={status} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.statuses.includes(status)}
                          onChange={() => toggleFilter('statuses', status)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">File Type</label>
                  <div className="space-y-2">
                    {availableFilters.fileTypes.map(fileType => (
                      <label key={fileType} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.fileTypes.includes(fileType)}
                          onChange={() => toggleFilter('fileTypes', fileType)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 uppercase">{fileType}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">Category</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableFilters.categories.slice(0, 8).map(category => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={() => toggleFilter('categories', category)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-300">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading documents...</p>
            </div>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No documents found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredDocuments.length} of {documents.length} documents
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map(doc => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments.map(doc => (
                  <DocumentListItem key={doc.id} document={doc} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

const DocumentCard: React.FC<{ document: UnifiedDocument }> = ({ document }) => {
  const statusColors = CombinedDocumentsService.getStatusColor(document.status);
  const fileIcon = CombinedDocumentsService.getFileTypeIcon(document.fileType);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{fileIcon}</div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}>
          {document.status}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {document.name}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {document.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
          <Tag className="h-3 w-3 mr-2" />
          <span className="font-medium">{document.category}</span>
        </div>
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
          <User className="h-3 w-3 mr-2" />
          <span>{document.modifiedBy}</span>
        </div>
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
          <Calendar className="h-3 w-3 mr-2" />
          <span>{new Date(document.lastModified).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <a
          href={document.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </a>
        {document.previewUrl && (
          <a
            href={document.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Eye className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
};

const DocumentListItem: React.FC<{ document: UnifiedDocument }> = ({ document }) => {
  const statusColors = CombinedDocumentsService.getStatusColor(document.status);
  const fileIcon = CombinedDocumentsService.getFileTypeIcon(document.fileType);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="text-3xl flex-shrink-0">{fileIcon}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {document.name}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text} ${statusColors.border} border flex-shrink-0 ml-3`}>
              {document.status}
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
            {document.description}
          </p>

          <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
            <span className="flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              {document.category}
            </span>
            <span className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              {document.modifiedBy}
            </span>
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(document.lastModified).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <span className="text-gray-500">{document.version}</span>
            <span className="text-gray-500 uppercase">{document.fileType}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <a
            href={document.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </a>
          {document.previewUrl && (
            <a
              href={document.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Eye className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentLibrary;
