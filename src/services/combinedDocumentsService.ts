import { RTMDocument, RTMDocumentsService } from './rtmDocumentsService';
import { TemplateDocument, TemplateDocumentsService } from './templateDocumentsService';

export type DocumentType = 'rtm' | 'template';

export interface UnifiedDocument {
  id: string;
  name: string;
  description: string;
  type: DocumentType;
  category: string;
  version: string;
  status: string;
  lastModified: string;
  modifiedBy: string;
  modifiedByRole: string;
  size: string;
  fileType?: string;
  downloadUrl: string;
  previewUrl?: string;
  s3Location: {
    bucket: string;
    key: string;
    region: string;
  };
  functionalId?: string;
  functionalName?: string;
  businessProcess?: string;
  moduleCode?: string;
  moduleName?: string;
  subModuleCode?: string;
  subModuleName?: string;
  requirementCount?: number;
}

export class CombinedDocumentsService {
  static async getAllDocuments(): Promise<UnifiedDocument[]> {
    const [rtmDocs, templateDocs] = await Promise.all([
      RTMDocumentsService.getRTMDocuments(),
      TemplateDocumentsService.getTemplateDocuments()
    ]);

    const unifiedRTM = rtmDocs.map(doc => this.convertRTMToUnified(doc));
    const unifiedTemplate = templateDocs.map(doc => this.convertTemplateToUnified(doc));

    return [...unifiedRTM, ...unifiedTemplate];
  }

  static convertRTMToUnified(rtmDoc: RTMDocument): UnifiedDocument {
    return {
      id: rtmDoc.id,
      name: rtmDoc.name,
      description: rtmDoc.description,
      type: 'rtm',
      category: rtmDoc.functionalName || 'Uncategorized',
      version: rtmDoc.version,
      status: rtmDoc.status,
      lastModified: rtmDoc.lastModified,
      modifiedBy: rtmDoc.modifiedBy,
      modifiedByRole: rtmDoc.modifiedByRole,
      size: rtmDoc.size,
      fileType: 'xlsx',
      downloadUrl: rtmDoc.downloadUrl,
      previewUrl: rtmDoc.previewUrl,
      s3Location: rtmDoc.s3Location,
      functionalId: rtmDoc.functionalId || undefined,
      functionalName: rtmDoc.functionalName,
      businessProcess: rtmDoc.businessProcess,
      moduleCode: rtmDoc.moduleCode,
      moduleName: rtmDoc.moduleName,
      subModuleCode: rtmDoc.subModuleCode,
      subModuleName: rtmDoc.subModuleName,
      requirementCount: rtmDoc.requirementCount
    };
  }

  static convertTemplateToUnified(templateDoc: TemplateDocument): UnifiedDocument {
    return {
      id: templateDoc.id,
      name: templateDoc.name,
      description: templateDoc.description,
      type: 'template',
      category: templateDoc.category,
      version: templateDoc.version,
      status: templateDoc.status,
      lastModified: templateDoc.lastModified,
      modifiedBy: templateDoc.modifiedBy,
      modifiedByRole: templateDoc.modifiedByRole,
      size: templateDoc.size,
      fileType: templateDoc.fileType,
      downloadUrl: templateDoc.downloadUrl,
      previewUrl: templateDoc.previewUrl,
      s3Location: templateDoc.s3Location
    };
  }

  static async getDocumentById(id: string): Promise<UnifiedDocument | null> {
    const allDocs = await this.getAllDocuments();
    return allDocs.find(doc => doc.id === id) || null;
  }

  static async searchDocuments(query: string): Promise<UnifiedDocument[]> {
    const allDocs = await this.getAllDocuments();
    const lowerQuery = query.toLowerCase();

    return allDocs.filter(doc =>
      doc.name.toLowerCase().includes(lowerQuery) ||
      doc.description.toLowerCase().includes(lowerQuery) ||
      doc.category.toLowerCase().includes(lowerQuery) ||
      doc.modifiedBy.toLowerCase().includes(lowerQuery) ||
      (doc.functionalName && doc.functionalName.toLowerCase().includes(lowerQuery)) ||
      (doc.businessProcess && doc.businessProcess.toLowerCase().includes(lowerQuery))
    );
  }

  static async filterDocuments(filters: {
    type?: DocumentType[];
    category?: string[];
    status?: string[];
    fileType?: string[];
    modifiedBy?: string;
    searchTerm?: string;
  }): Promise<UnifiedDocument[]> {
    let docs = await this.getAllDocuments();

    if (filters.type && filters.type.length > 0) {
      docs = docs.filter(doc => filters.type!.includes(doc.type));
    }

    if (filters.category && filters.category.length > 0) {
      docs = docs.filter(doc => filters.category!.includes(doc.category));
    }

    if (filters.status && filters.status.length > 0) {
      docs = docs.filter(doc => filters.status!.includes(doc.status));
    }

    if (filters.fileType && filters.fileType.length > 0) {
      docs = docs.filter(doc => doc.fileType && filters.fileType!.includes(doc.fileType));
    }

    if (filters.modifiedBy) {
      docs = docs.filter(doc =>
        doc.modifiedBy.toLowerCase().includes(filters.modifiedBy!.toLowerCase())
      );
    }

    if (filters.searchTerm) {
      docs = await this.searchDocuments(filters.searchTerm);
    }

    return docs;
  }

  static async getDocumentsSummary(): Promise<{
    totalDocuments: number;
    rtmDocuments: number;
    templateDocuments: number;
    statusDistribution: { [status: string]: number };
    categoryDistribution: { [category: string]: number };
    fileTypeDistribution: { [fileType: string]: number };
    recentDocuments: UnifiedDocument[];
  }> {
    const allDocs = await this.getAllDocuments();

    const statusDistribution: { [status: string]: number } = {};
    const categoryDistribution: { [category: string]: number } = {};
    const fileTypeDistribution: { [fileType: string]: number } = {};

    allDocs.forEach(doc => {
      statusDistribution[doc.status] = (statusDistribution[doc.status] || 0) + 1;
      categoryDistribution[doc.category] = (categoryDistribution[doc.category] || 0) + 1;
      if (doc.fileType) {
        fileTypeDistribution[doc.fileType] = (fileTypeDistribution[doc.fileType] || 0) + 1;
      }
    });

    const recentDocuments = allDocs
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
      .slice(0, 10);

    return {
      totalDocuments: allDocs.length,
      rtmDocuments: allDocs.filter(d => d.type === 'rtm').length,
      templateDocuments: allDocs.filter(d => d.type === 'template').length,
      statusDistribution,
      categoryDistribution,
      fileTypeDistribution,
      recentDocuments
    };
  }

  static async getDocumentsByType(type: DocumentType): Promise<UnifiedDocument[]> {
    const allDocs = await this.getAllDocuments();
    return allDocs.filter(doc => doc.type === type);
  }

  static async getDocumentsByCategory(category: string): Promise<UnifiedDocument[]> {
    const allDocs = await this.getAllDocuments();
    return allDocs.filter(doc => doc.category === category);
  }

  static async getDocumentsByStatus(status: string): Promise<UnifiedDocument[]> {
    const allDocs = await this.getAllDocuments();
    return allDocs.filter(doc => doc.status === status);
  }

  static async getAllCategories(): Promise<string[]> {
    const allDocs = await this.getAllDocuments();
    const categories = new Set(allDocs.map(doc => doc.category));
    return Array.from(categories).sort();
  }

  static async getAllStatuses(): Promise<string[]> {
    const allDocs = await this.getAllDocuments();
    const statuses = new Set(allDocs.map(doc => doc.status));
    return Array.from(statuses).sort();
  }

  static async getAllFileTypes(): Promise<string[]> {
    const allDocs = await this.getAllDocuments();
    const fileTypes = new Set(allDocs.map(doc => doc.fileType).filter(Boolean));
    return Array.from(fileTypes).sort();
  }

  static async getAllAuthors(): Promise<string[]> {
    const allDocs = await this.getAllDocuments();
    const authors = new Set(allDocs.map(doc => doc.modifiedBy));
    return Array.from(authors).sort();
  }

  static getStatusColor(status: string): {
    bg: string;
    text: string;
    border: string;
  } {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'approved':
      case 'active':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-300',
          border: 'border-green-200 dark:border-green-800'
        };
      case 'review':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          text: 'text-yellow-700 dark:text-yellow-300',
          border: 'border-yellow-200 dark:border-yellow-800'
        };
      case 'draft':
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-200 dark:border-gray-700'
        };
      case 'outdated':
      case 'deprecated':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-300',
          border: 'border-red-200 dark:border-red-800'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-200 dark:border-gray-700'
        };
    }
  }

  static getFileTypeIcon(fileType?: string): string {
    if (!fileType) return '📄';

    switch (fileType.toLowerCase()) {
      case 'pdf':
        return '📕';
      case 'docx':
      case 'doc':
        return '📘';
      case 'xlsx':
      case 'xls':
        return '📊';
      case 'pptx':
      case 'ppt':
        return '📙';
      default:
        return '📄';
    }
  }
}
