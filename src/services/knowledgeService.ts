import knowledgesData from '../data/knowledges.json';

export interface KnowledgeDocument {
  id: string;
  name: string;
  description: string;
  type: 'procedure' | 'policy' | 'user guide';
  category: string;
  uploadedDate: string;
  uploadedBy: string;
  uploadedByRole: string;
  version: string;
  status: 'active' | 'draft' | 'archived' | 'under_review';
  fileSize: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'html';
  url: string;
  previewUrl?: string;
  tags: string[];
  lastReviewed: string;
  nextReview: string;
  approvedBy: string;
  effectiveDate: string;
}

export class KnowledgeService {
  /**
   * Get all knowledge documents
   */
  static async getKnowledgeDocuments(): Promise<KnowledgeDocument[]> {
    return knowledgesData as KnowledgeDocument[];
  }

  /**
   * Get knowledge document by ID
   */
  static async getKnowledgeDocumentById(id: string): Promise<KnowledgeDocument | undefined> {
    const documents = await this.getKnowledgeDocuments();
    return documents.find(doc => doc.id === id);
  }

  /**
   * Get knowledge documents by type
   */
  static async getKnowledgeDocumentsByType(type: 'procedure' | 'policy' | 'user guide'): Promise<KnowledgeDocument[]> {
    const documents = await this.getKnowledgeDocuments();
    return documents.filter(doc => doc.type === type);
  }

  /**
   * Get knowledge documents by category
   */
  static async getKnowledgeDocumentsByCategory(category: string): Promise<KnowledgeDocument[]> {
    const documents = await this.getKnowledgeDocuments();
    return documents.filter(doc => 
      doc.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  /**
   * Get knowledge documents by status
   */
  static async getKnowledgeDocumentsByStatus(status: string): Promise<KnowledgeDocument[]> {
    const documents = await this.getKnowledgeDocuments();
    return documents.filter(doc => doc.status === status);
  }

  /**
   * Get knowledge documents by uploaded by
   */
  static async getKnowledgeDocumentsByUploadedBy(uploadedBy: string): Promise<KnowledgeDocument[]> {
    const documents = await this.getKnowledgeDocuments();
    return documents.filter(doc => 
      doc.uploadedBy.toLowerCase().includes(uploadedBy.toLowerCase())
    );
  }

  /**
   * Search knowledge documents
   */
  static async searchKnowledgeDocuments(query: string): Promise<KnowledgeDocument[]> {
    const documents = await this.getKnowledgeDocuments();
    const lowerQuery = query.toLowerCase();
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(lowerQuery) ||
      doc.description.toLowerCase().includes(lowerQuery) ||
      doc.category.toLowerCase().includes(lowerQuery) ||
      doc.uploadedBy.toLowerCase().includes(lowerQuery) ||
      doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Filter knowledge documents by multiple criteria
   */
  static async filterKnowledgeDocuments(filters: {
    type?: 'procedure' | 'policy' | 'user guide';
    category?: string;
    status?: string;
    uploadedBy?: string;
    tag?: string;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
  }): Promise<KnowledgeDocument[]> {
    let documents = await this.getKnowledgeDocuments();

    if (filters.type) {
      documents = documents.filter(doc => doc.type === filters.type);
    }

    if (filters.category) {
      documents = documents.filter(doc => 
        doc.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters.status) {
      documents = documents.filter(doc => doc.status === filters.status);
    }

    if (filters.uploadedBy) {
      documents = documents.filter(doc => 
        doc.uploadedBy.toLowerCase().includes(filters.uploadedBy!.toLowerCase())
      );
    }

    if (filters.tag) {
      documents = documents.filter(doc => 
        doc.tags.some(tag => tag.toLowerCase().includes(filters.tag!.toLowerCase()))
      );
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      documents = documents.filter(doc => new Date(doc.uploadedDate) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      documents = documents.filter(doc => new Date(doc.uploadedDate) <= toDate);
    }

    if (filters.searchTerm) {
      documents = await this.searchKnowledgeDocuments(filters.searchTerm);
    }

    return documents;
  }

  /**
   * Get knowledge documents summary
   */
  static async getKnowledgeDocumentsSummary(): Promise<{
    totalDocuments: number;
    typeDistribution: { [type: string]: number };
    categoryDistribution: { [category: string]: number };
    statusDistribution: { [status: string]: number };
    recentDocuments: KnowledgeDocument[];
    documentsNeedingReview: KnowledgeDocument[];
  }> {
    const documents = await this.getKnowledgeDocuments();
    
    if (documents.length === 0) {
      return {
        totalDocuments: 0,
        typeDistribution: {},
        categoryDistribution: {},
        statusDistribution: {},
        recentDocuments: [],
        documentsNeedingReview: []
      };
    }

    // Type distribution
    const typeDistribution: { [type: string]: number } = {};
    documents.forEach(doc => {
      typeDistribution[doc.type] = (typeDistribution[doc.type] || 0) + 1;
    });

    // Category distribution
    const categoryDistribution: { [category: string]: number } = {};
    documents.forEach(doc => {
      categoryDistribution[doc.category] = (categoryDistribution[doc.category] || 0) + 1;
    });

    // Status distribution
    const statusDistribution: { [status: string]: number } = {};
    documents.forEach(doc => {
      statusDistribution[doc.status] = (statusDistribution[doc.status] || 0) + 1;
    });

    // Recent documents (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentDocuments = documents
      .filter(doc => new Date(doc.uploadedDate) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime())
      .slice(0, 5);

    // Documents needing review (next review date is within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const documentsNeedingReview = documents
      .filter(doc => new Date(doc.nextReview) <= thirtyDaysFromNow)
      .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());

    return {
      totalDocuments: documents.length,
      typeDistribution,
      categoryDistribution,
      statusDistribution,
      recentDocuments,
      documentsNeedingReview
    };
  }

  /**
   * Get all unique categories
   */
  static async getCategories(): Promise<string[]> {
    const documents = await this.getKnowledgeDocuments();
    return [...new Set(documents.map(doc => doc.category))].sort();
  }

  /**
   * Get all unique tags
   */
  static async getTags(): Promise<string[]> {
    const documents = await this.getKnowledgeDocuments();
    const allTags = documents.flatMap(doc => doc.tags);
    return [...new Set(allTags)].sort();
  }

  /**
   * Get all unique statuses
   */
  static async getStatuses(): Promise<string[]> {
    return ['active', 'draft', 'archived', 'under_review'];
  }

  /**
   * Get all unique uploaders
   */
  static async getUploaders(): Promise<string[]> {
    const documents = await this.getKnowledgeDocuments();
    return [...new Set(documents.map(doc => doc.uploadedBy))].sort();
  }

  /**
   * Get documents by tag
   */
  static async getKnowledgeDocumentsByTag(tag: string): Promise<KnowledgeDocument[]> {
    const documents = await this.getKnowledgeDocuments();
    return documents.filter(doc => 
      doc.tags.some(docTag => docTag.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  /**
   * Get documents needing review
   */
  static async getDocumentsNeedingReview(daysAhead: number = 30): Promise<KnowledgeDocument[]> {
    const documents = await this.getKnowledgeDocuments();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);
    
    return documents
      .filter(doc => new Date(doc.nextReview) <= targetDate)
      .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());
  }

  /**
   * Get recent documents
   */
  static async getRecentDocuments(daysBack: number = 30, limit: number = 10): Promise<KnowledgeDocument[]> {
    const documents = await this.getKnowledgeDocuments();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysBack);
    
    return documents
      .filter(doc => new Date(doc.uploadedDate) >= targetDate)
      .sort((a, b) => new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime())
      .slice(0, limit);
  }

  /**
   * Create new knowledge document
   */
  static async createKnowledgeDocument(documentData: Omit<KnowledgeDocument, 'id' | 'uploadedDate'>): Promise<KnowledgeDocument> {
    // In a real implementation, this would make an API call
    const newDocument: KnowledgeDocument = {
      ...documentData,
      id: `doc-${Date.now()}`,
      uploadedDate: new Date().toISOString()
    };
    
    return newDocument;
  }

  /**
   * Update knowledge document
   */
  static async updateKnowledgeDocument(id: string, updates: Partial<KnowledgeDocument>): Promise<KnowledgeDocument | null> {
    // In a real implementation, this would make an API call
    const document = await this.getKnowledgeDocumentById(id);
    if (!document) return null;

    return {
      ...document,
      ...updates
    };
  }

  /**
   * Delete knowledge document
   */
  static async deleteKnowledgeDocument(id: string): Promise<boolean> {
    // In a real implementation, this would make an API call
    const document = await this.getKnowledgeDocumentById(id);
    return !!document;
  }

  /**
   * Get knowledge statistics by type
   */
  static async getKnowledgeStatisticsByType(): Promise<{
    procedures: { count: number; categories: string[]; avgFileSize: number };
    policies: { count: number; categories: string[]; avgFileSize: number };
    userGuides: { count: number; categories: string[]; avgFileSize: number };
  }> {
    const documents = await this.getKnowledgeDocuments();
    
    const procedures = documents.filter(doc => doc.type === 'procedure');
    const policies = documents.filter(doc => doc.type === 'policy');
    const userGuides = documents.filter(doc => doc.type === 'user guide');

    const calculateAvgFileSize = (docs: KnowledgeDocument[]) => {
      if (docs.length === 0) return 0;
      const totalSize = docs.reduce((sum, doc) => {
        const sizeMatch = doc.fileSize.match(/(\d+\.?\d*)/);
        return sum + (sizeMatch ? parseFloat(sizeMatch[1]) : 0);
      }, 0);
      return Math.round((totalSize / docs.length) * 10) / 10;
    };

    return {
      procedures: {
        count: procedures.length,
        categories: [...new Set(procedures.map(doc => doc.category))],
        avgFileSize: calculateAvgFileSize(procedures)
      },
      policies: {
        count: policies.length,
        categories: [...new Set(policies.map(doc => doc.category))],
        avgFileSize: calculateAvgFileSize(policies)
      },
      userGuides: {
        count: userGuides.length,
        categories: [...new Set(userGuides.map(doc => doc.category))],
        avgFileSize: calculateAvgFileSize(userGuides)
      }
    };
  }

  /**
   * Get document version history
   */
  static async getDocumentVersionHistory(documentName: string): Promise<KnowledgeDocument[]> {
    const documents = await this.getKnowledgeDocuments();
    const baseName = documentName.replace(/\sv\d+\.\d+$/, ''); // Remove version from name
    
    return documents
      .filter(doc => doc.name.toLowerCase().includes(baseName.toLowerCase()))
      .sort((a, b) => {
        // Sort by version number (assuming format vX.Y)
        const aVersion = a.version.match(/v(\d+)\.(\d+)/);
        const bVersion = b.version.match(/v(\d+)\.(\d+)/);
        
        if (aVersion && bVersion) {
          const aMajor = parseInt(aVersion[1]);
          const aMinor = parseInt(aVersion[2]);
          const bMajor = parseInt(bVersion[1]);
          const bMinor = parseInt(bVersion[2]);
          
          if (aMajor !== bMajor) return bMajor - aMajor;
          return bMinor - aMinor;
        }
        
        return new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime();
      });
  }

  /**
   * Get compliance tracking for documents
   */
  static async getComplianceTracking(): Promise<{
    totalDocuments: number;
    upToDate: number;
    needingReview: number;
    overdue: number;
    complianceRate: number;
  }> {
    const documents = await this.getKnowledgeDocuments();
    const now = new Date();
    
    const needingReview = documents.filter(doc => {
      const reviewDate = new Date(doc.nextReview);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return reviewDate <= thirtyDaysFromNow && reviewDate > now;
    }).length;

    const overdue = documents.filter(doc => {
      const reviewDate = new Date(doc.nextReview);
      return reviewDate <= now;
    }).length;

    const upToDate = documents.length - needingReview - overdue;
    const complianceRate = documents.length > 0 ? (upToDate / documents.length) * 100 : 0;

    return {
      totalDocuments: documents.length,
      upToDate,
      needingReview,
      overdue,
      complianceRate: Math.round(complianceRate * 10) / 10
    };
  }
}