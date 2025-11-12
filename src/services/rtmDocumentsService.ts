import rtmDocumentsData from '../data/rtmDocuments.json';

export interface RTMDocument {
  id: string;
  name: string;
  description: string;
  functionalId: string | null;
  functionalName: string;
  businessProcess: string;
  moduleCode: string;
  moduleName: string;
  subModuleCode: string;
  subModuleName: string;
  version: string;
  status: 'draft' | 'review' | 'approved' | 'outdated';
  lastModified: string;
  modifiedBy: string;
  modifiedByRole: string;
  size: string;
  requirementCount: number;
  downloadUrl: string;
  previewUrl?: string;
  s3Location: {
    bucket: string;
    key: string;
    region: string;
  };
}

export class RTMDocumentsService {
  /**
   * Get all RTM documents
   */
  static async getRTMDocuments(): Promise<RTMDocument[]> {
    return rtmDocumentsData as RTMDocument[];
  }

  /**
   * Get RTM document by ID
   */
  static async getRTMDocumentById(id: string): Promise<RTMDocument | undefined> {
    const documents = await this.getRTMDocuments();
    return documents.find(doc => doc.id === id);
  }

  /**
   * Get RTM documents by functional ID
   */
  static async getRTMDocumentsByFunctional(functionalId: string): Promise<RTMDocument[]> {
    const documents = await this.getRTMDocuments();
    return documents.filter(doc => doc.functionalId === functionalId);
  }

  /**
   * Get RTM documents by business process
   */
  static async getRTMDocumentsByBusinessProcess(businessProcess: string): Promise<RTMDocument[]> {
    const documents = await this.getRTMDocuments();
    return documents.filter(doc => 
      doc.businessProcess.toLowerCase().includes(businessProcess.toLowerCase())
    );
  }

  /**
   * Get RTM documents by module code
   */
  static async getRTMDocumentsByModule(moduleCode: string): Promise<RTMDocument[]> {
    const documents = await this.getRTMDocuments();
    return documents.filter(doc => doc.moduleCode === moduleCode);
  }

  /**
   * Get RTM documents by sub-module code
   */
  static async getRTMDocumentsBySubModule(subModuleCode: string): Promise<RTMDocument[]> {
    const documents = await this.getRTMDocuments();
    return documents.filter(doc => doc.subModuleCode === subModuleCode);
  }

  /**
   * Get RTM documents by status
   */
  static async getRTMDocumentsByStatus(status: string): Promise<RTMDocument[]> {
    const documents = await this.getRTMDocuments();
    return documents.filter(doc => doc.status === status);
  }

  /**
   * Search RTM documents
   */
  static async searchRTMDocuments(query: string): Promise<RTMDocument[]> {
    const documents = await this.getRTMDocuments();
    const lowerQuery = query.toLowerCase();
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(lowerQuery) ||
      doc.description.toLowerCase().includes(lowerQuery) ||
      doc.functionalName.toLowerCase().includes(lowerQuery) ||
      doc.businessProcess.toLowerCase().includes(lowerQuery) ||
      doc.moduleCode.toLowerCase().includes(lowerQuery) ||
      doc.moduleName.toLowerCase().includes(lowerQuery) ||
      doc.subModuleCode.toLowerCase().includes(lowerQuery) ||
      doc.subModuleName.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter RTM documents by multiple criteria
   */
  static async filterRTMDocuments(filters: {
    functionalId?: string;
    businessProcess?: string;
    moduleCode?: string;
    subModuleCode?: string;
    status?: string;
    modifiedBy?: string;
    searchTerm?: string;
  }): Promise<RTMDocument[]> {
    let documents = await this.getRTMDocuments();

    if (filters.functionalId) {
      documents = documents.filter(doc => doc.functionalId === filters.functionalId);
    }

    if (filters.businessProcess) {
      documents = documents.filter(doc => 
        doc.businessProcess.toLowerCase().includes(filters.businessProcess!.toLowerCase())
      );
    }

    if (filters.moduleCode) {
      documents = documents.filter(doc => doc.moduleCode === filters.moduleCode);
    }

    if (filters.subModuleCode) {
      documents = documents.filter(doc => doc.subModuleCode === filters.subModuleCode);
    }

    if (filters.status) {
      documents = documents.filter(doc => doc.status === filters.status);
    }

    if (filters.modifiedBy) {
      documents = documents.filter(doc => 
        doc.modifiedBy.toLowerCase().includes(filters.modifiedBy!.toLowerCase())
      );
    }

    if (filters.searchTerm) {
      documents = await this.searchRTMDocuments(filters.searchTerm);
    }

    return documents;
  }

  /**
   * Get RTM documents summary
   */
  static async getRTMDocumentsSummary(): Promise<{
    totalDocuments: number;
    statusDistribution: { [status: string]: number };
    functionalDistribution: { [functional: string]: number };
    moduleDistribution: { [module: string]: number };
    totalRequirements: number;
    avgRequirementsPerDocument: number;
  }> {
    const documents = await this.getRTMDocuments();
    
    if (documents.length === 0) {
      return {
        totalDocuments: 0,
        statusDistribution: {},
        functionalDistribution: {},
        moduleDistribution: {},
        totalRequirements: 0,
        avgRequirementsPerDocument: 0,
      };
    }

    // Status distribution
    const statusDistribution: { [status: string]: number } = {};
    documents.forEach(doc => {
      statusDistribution[doc.status] = (statusDistribution[doc.status] || 0) + 1;
    });

    // Functional distribution
    const functionalDistribution: { [functional: string]: number } = {};
    documents.forEach(doc => {
      functionalDistribution[doc.functionalName] = (functionalDistribution[doc.functionalName] || 0) + 1;
    });

    // Module distribution
    const moduleDistribution: { [module: string]: number } = {};
    documents.forEach(doc => {
      moduleDistribution[doc.moduleCode] = (moduleDistribution[doc.moduleCode] || 0) + 1;
    });

    // Calculate totals
    const totalRequirements = documents.reduce((sum, doc) => sum + doc.requirementCount, 0);

    return {
      totalDocuments: documents.length,
      statusDistribution,
      functionalDistribution,
      moduleDistribution,
      totalRequirements,
      avgRequirementsPerDocument: Math.round((totalRequirements / documents.length) * 10) / 10,
    };
  }

  /**
   * Get all unique functional names
   */
  static async getFunctionalNames(): Promise<string[]> {
    const documents = await this.getRTMDocuments();
    return [...new Set(documents.map(doc => doc.functionalName))].sort();
  }

  /**
   * Get all unique business processes
   */
  static async getBusinessProcesses(): Promise<string[]> {
    const documents = await this.getRTMDocuments();
    return [...new Set(documents.map(doc => doc.businessProcess))].sort();
  }

  /**
   * Get all unique module codes
   */
  static async getModuleCodes(): Promise<string[]> {
    const documents = await this.getRTMDocuments();
    return [...new Set(documents.map(doc => doc.moduleCode))].sort();
  }

  /**
   * Get all unique statuses
   */
  static async getStatuses(): Promise<string[]> {
    return ['draft', 'review', 'approved', 'outdated'];
  }

  /**
   * Get RTM documents by S3 location
   */
  static async getRTMDocumentsByS3Bucket(bucket: string): Promise<RTMDocument[]> {
    const documents = await this.getRTMDocuments();
    return documents.filter(doc => doc.s3Location.bucket === bucket);
  }

  /**
   * Get RTM document S3 download URL
   */
  static async getS3DownloadUrl(documentId: string): Promise<string | null> {
    const document = await this.getRTMDocumentById(documentId);
    return document?.downloadUrl || null;
  }

  /**
   * Create new RTM document
   */
  static async createRTMDocument(documentData: Omit<RTMDocument, 'id' | 'lastModified'>): Promise<RTMDocument> {
    // In a real implementation, this would make an API call
    const newDocument: RTMDocument = {
      ...documentData,
      id: `rtm-${Date.now()}`,
      lastModified: new Date().toISOString()
    };
    
    return newDocument;
  }

  /**
   * Update RTM document
   */
  static async updateRTMDocument(id: string, updates: Partial<RTMDocument>): Promise<RTMDocument | null> {
    // In a real implementation, this would make an API call
    const document = await this.getRTMDocumentById(id);
    if (!document) return null;

    return {
      ...document,
      ...updates,
      lastModified: new Date().toISOString()
    };
  }

  /**
   * Delete RTM document
   */
  static async deleteRTMDocument(id: string): Promise<boolean> {
    // In a real implementation, this would make an API call
    const document = await this.getRTMDocumentById(id);
    return !!document;
  }

  /**
   * Get RTM coverage analysis
   */
  static async getRTMCoverageAnalysis(): Promise<{
    functionalCoverage: { [functional: string]: { documents: number; requirements: number; testCases: number } };
    moduleCoverage: { [module: string]: { documents: number; requirements: number; testCases: number } };
    overallCoverage: {
      totalFunctionals: number;
      coveredFunctionals: number;
      totalModules: number;
      coveredModules: number;
      coveragePercentage: number;
    };
  }> {
    const documents = await this.getRTMDocuments();
    
    // Functional coverage
    const functionalCoverage: { [functional: string]: { documents: number; requirements: number; testCases: number } } = {};
    documents.forEach(doc => {
      if (!functionalCoverage[doc.functionalName]) {
        functionalCoverage[doc.functionalName] = { documents: 0, requirements: 0, testCases: 0 };
      }
      functionalCoverage[doc.functionalName].documents++;
      functionalCoverage[doc.functionalName].requirements += doc.requirementCount;
    });

    // Module coverage
    const moduleCoverage: { [module: string]: { documents: number; requirements: number } } = {};
    documents.forEach(doc => {
      if (!moduleCoverage[doc.moduleCode]) {
        moduleCoverage[doc.moduleCode] = { documents: 0, requirements: 0 };
      }
      moduleCoverage[doc.moduleCode].documents++;
      moduleCoverage[doc.moduleCode].requirements += doc.requirementCount;
    });

    // Overall coverage
    const totalFunctionals = new Set(documents.map(doc => doc.functionalName)).size;
    const totalModules = new Set(documents.map(doc => doc.moduleCode)).size;
    const coveragePercentage = totalModules > 0 ? (totalModules / 8) * 100 : 0; // Assuming 8 total SAP modules

    return {
      functionalCoverage,
      moduleCoverage,
      overallCoverage: {
        totalFunctionals,
        coveredFunctionals: totalFunctionals,
        totalModules: 8, // Total SAP modules
        coveredModules: totalModules,
        coveragePercentage: Math.round(coveragePercentage * 10) / 10
      }
    };
  }
}