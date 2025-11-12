import templateDocumentsData from '../data/templateDocuments.json';

export interface TemplateDocument {
  id: string;
  name: string;
  description: string;
  type: 'technical_design' | 'functional_design' | 'deployment_report';
  category: string;
  version: string;
  status: 'active' | 'deprecated' | 'draft';
  fileType: 'docx' | 'xlsx' | 'pdf';
  lastModified: string;
  modifiedBy: string;
  modifiedByRole: string;
  size: string;
  downloadUrl: string;
  previewUrl?: string;
  s3Location: {
    bucket: string;
    key: string;
    region: string;
  };
}

export class TemplateDocumentsService {
  /**
   * Get all template documents
   */
  static async getTemplateDocuments(): Promise<TemplateDocument[]> {
    return templateDocumentsData as TemplateDocument[];
  }

  /**
   * Get template document by ID
   */
  static async getTemplateDocumentById(id: string): Promise<TemplateDocument | undefined> {
    const documents = await this.getTemplateDocuments();
    return documents.find(doc => doc.id === id);
  }

  /**
   * Get template documents by type
   */
  static async getTemplateDocumentsByType(type: string): Promise<TemplateDocument[]> {
    const documents = await this.getTemplateDocuments();
    return documents.filter(doc => doc.type === type);
  }

  /**
   * Get template documents by status
   */
  static async getTemplateDocumentsByStatus(status: string): Promise<TemplateDocument[]> {
    const documents = await this.getTemplateDocuments();
    return documents.filter(doc => doc.status === status);
  }

  /**
   * Get template documents by category
   */
  static async getTemplateDocumentsByCategory(category: string): Promise<TemplateDocument[]> {
    const documents = await this.getTemplateDocuments();
    return documents.filter(doc => 
      doc.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  /**
   * Search template documents
   */
  static async searchTemplateDocuments(query: string): Promise<TemplateDocument[]> {
    const documents = await this.getTemplateDocuments();
    const lowerQuery = query.toLowerCase();
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(lowerQuery) ||
      doc.description.toLowerCase().includes(lowerQuery) ||
      doc.category.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter template documents by multiple criteria
   */
  static async filterTemplateDocuments(filters: {
    type?: string;
    status?: string;
    category?: string;
    searchTerm?: string;
  }): Promise<TemplateDocument[]> {
    let documents = await this.getTemplateDocuments();

    if (filters.type) {
      documents = documents.filter(doc => doc.type === filters.type);
    }

    if (filters.status) {
      documents = documents.filter(doc => doc.status === filters.status);
    }

    if (filters.category) {
      documents = documents.filter(doc => 
        doc.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters.searchTerm) {
      documents = await this.searchTemplateDocuments(filters.searchTerm);
    }

    return documents;
  }

  /**
   * Get template documents summary
   */
  static async getTemplateDocumentsSummary(): Promise<{
    totalDocuments: number;
    typeDistribution: { [type: string]: number };
    statusDistribution: { [status: string]: number };
    categoryDistribution: { [category: string]: number };
  }> {
    const documents = await this.getTemplateDocuments();
    
    if (documents.length === 0) {
      return {
        totalDocuments: 0,
        typeDistribution: {},
        statusDistribution: {},
        categoryDistribution: {}
      };
    }

    // Type distribution
    const typeDistribution: { [type: string]: number } = {};
    documents.forEach(doc => {
      typeDistribution[doc.type] = (typeDistribution[doc.type] || 0) + 1;
    });

    // Status distribution
    const statusDistribution: { [status: string]: number } = {};
    documents.forEach(doc => {
      statusDistribution[doc.status] = (statusDistribution[doc.status] || 0) + 1;
    });

    // Category distribution
    const categoryDistribution: { [category: string]: number } = {};
    documents.forEach(doc => {
      categoryDistribution[doc.category] = (categoryDistribution[doc.category] || 0) + 1;
    });

    return {
      totalDocuments: documents.length,
      typeDistribution,
      statusDistribution,
      categoryDistribution
    };
  }

  /**
   * Get all unique categories
   */
  static async getCategories(): Promise<string[]> {
    const documents = await this.getTemplateDocuments();
    return [...new Set(documents.map(doc => doc.category))].sort();
  }

  /**
   * Get all unique types
   */
  static async getTypes(): Promise<string[]> {
    return ['technical_design', 'functional_design', 'deployment_report'];
  }

  /**
   * Get all unique statuses
   */
  static async getStatuses(): Promise<string[]> {
    return ['active', 'deprecated', 'draft'];
  }

  /**
   * Get template documents by S3 location
   */
  static async getTemplateDocumentsByS3Bucket(bucket: string): Promise<TemplateDocument[]> {
    const documents = await this.getTemplateDocuments();
    return documents.filter(doc => doc.s3Location.bucket === bucket);
  }

  /**
   * Get template document S3 download URL
   */
  static async getS3DownloadUrl(documentId: string): Promise<string | null> {
    const document = await this.getTemplateDocumentById(documentId);
    return document?.downloadUrl || null;
  }

  /**
   * Create new template document
   */
  static async createTemplateDocument(documentData: Omit<TemplateDocument, 'id' | 'lastModified'>): Promise<TemplateDocument> {
    // In a real implementation, this would make an API call
    const newDocument: TemplateDocument = {
      ...documentData,
      id: `template-${Date.now()}`,
      lastModified: new Date().toISOString()
    };
    
    return newDocument;
  }

  /**
   * Update template document
   */
  static async updateTemplateDocument(id: string, updates: Partial<TemplateDocument>): Promise<TemplateDocument | null> {
    // In a real implementation, this would make an API call
    const document = await this.getTemplateDocumentById(id);
    if (!document) return null;

    return {
      ...document,
      ...updates,
      lastModified: new Date().toISOString()
    };
  }

  /**
   * Delete template document
   */
  static async deleteTemplateDocument(id: string): Promise<boolean> {
    // In a real implementation, this would make an API call
    const document = await this.getTemplateDocumentById(id);
    return !!document;
  }

  /**
   * Get template statistics
   */
  static async getTemplateStatistics(): Promise<{
    totalTemplates: number;
    technicalDesignTemplates: number;
    functionalDesignTemplates: number;
    deploymentReportTemplates: number;
    activeTemplates: number;
    draftTemplates: number;
    deprecatedTemplates: number;
  }> {
    const documents = await this.getTemplateDocuments();
    
    return {
      totalTemplates: documents.length,
      technicalDesignTemplates: documents.filter(d => d.type === 'technical_design').length,
      functionalDesignTemplates: documents.filter(d => d.type === 'functional_design').length,
      deploymentReportTemplates: documents.filter(d => d.type === 'deployment_report').length,
      activeTemplates: documents.filter(d => d.status === 'active').length,
      draftTemplates: documents.filter(d => d.status === 'draft').length,
      deprecatedTemplates: documents.filter(d => d.status === 'deprecated').length
    };
  }
}