import contractTemplates from '../data/contractTemplates.json';

export interface ContractTemplateLibrary {
  id: string;
  name: string;
  category: string;
  description: string;
  applicable_to: string[];
  template_content: {
    header: Record<string, string>;
    parties: Record<string, string>;
    scopeOfWork: Record<string, string>;
    pricingTerms: Record<string, string>;
    paymentTerms: Record<string, string>;
    deliverySchedule: Record<string, string>;
    performanceGuarantee: Record<string, string>;
    terminationClauses: Record<string, string>;
    legalTerms: Record<string, string>;
    specialConditions: Record<string, string>;
  };
  required_annexures: string[];
  created_by: string;
  version: string;
  last_updated: string;
}

export class ContractTemplateLibraryService {
  /**
   * Get all available contract templates from the standalone library
   */
  static getAllTemplates(): ContractTemplateLibrary[] {
    return contractTemplates as ContractTemplateLibrary[];
  }

  /**
   * Get a specific template by ID
   */
  static getTemplateById(id: string): ContractTemplateLibrary | undefined {
    return contractTemplates.find(template => template.id === id) as ContractTemplateLibrary | undefined;
  }

  /**
   * Get templates by category
   */
  static getTemplatesByCategory(category: string): ContractTemplateLibrary[] {
    return contractTemplates.filter(
      template => template.category.toLowerCase() === category.toLowerCase()
    ) as ContractTemplateLibrary[];
  }

  /**
   * Search templates by keyword in name or description
   */
  static searchTemplates(keyword: string): ContractTemplateLibrary[] {
    const lowerKeyword = keyword.toLowerCase();
    return contractTemplates.filter(template =>
      template.name.toLowerCase().includes(lowerKeyword) ||
      template.description.toLowerCase().includes(lowerKeyword) ||
      template.category.toLowerCase().includes(lowerKeyword) ||
      template.applicable_to.some(item => item.toLowerCase().includes(lowerKeyword))
    ) as ContractTemplateLibrary[];
  }

  /**
   * Get templates applicable to a specific sourcing event type
   */
  static getApplicableTemplates(sourcingEventType: string): ContractTemplateLibrary[] {
    return contractTemplates.filter(template =>
      template.applicable_to.some(type =>
        type.toLowerCase().includes(sourcingEventType.toLowerCase())
      )
    ) as ContractTemplateLibrary[];
  }

  /**
   * Get all unique categories
   */
  static getCategories(): string[] {
    const categories = contractTemplates.map(template => template.category);
    return [...new Set(categories)];
  }

  /**
   * Get template summary for listing (without full content)
   */
  static getTemplateSummaries(): Array<{
    id: string;
    name: string;
    category: string;
    description: string;
    applicable_to: string[];
    version: string;
    last_updated: string;
  }> {
    return contractTemplates.map(template => ({
      id: template.id,
      name: template.name,
      category: template.category,
      description: template.description,
      applicable_to: template.applicable_to,
      version: template.version,
      last_updated: template.last_updated
    }));
  }

  /**
   * Apply template to sourcing event data (merge placeholders with actual data)
   */
  static applyTemplateToSourcingEvent(
    templateId: string,
    sourcingEventData: any
  ): ContractTemplateLibrary | null {
    const template = this.getTemplateById(templateId);
    if (!template) return null;

    // Create a deep copy of the template
    const appliedTemplate = JSON.parse(JSON.stringify(template));

    // Replace common placeholders with sourcing event data
    if (sourcingEventData) {
      // Replace project title
      if (appliedTemplate.template_content.scopeOfWork) {
        if (sourcingEventData.title) {
          appliedTemplate.template_content.scopeOfWork['Project Title'] = sourcingEventData.title;
        }
        if (sourcingEventData.description) {
          appliedTemplate.template_content.scopeOfWork['Project Description'] = sourcingEventData.description;
        }
        if (sourcingEventData.requirements) {
          appliedTemplate.template_content.scopeOfWork['Deliverables'] =
            Array.isArray(sourcingEventData.requirements)
              ? sourcingEventData.requirements.join(', ')
              : sourcingEventData.requirements;
        }
      }

      // Replace contract value
      if (appliedTemplate.template_content.pricingTerms && sourcingEventData.estimatedValue) {
        appliedTemplate.template_content.pricingTerms['Total Contract Value'] = sourcingEventData.estimatedValue;
      }

      // Replace dates
      if (appliedTemplate.template_content.deliverySchedule && sourcingEventData.deadline) {
        appliedTemplate.template_content.deliverySchedule['Delivery Deadline'] = sourcingEventData.deadline;
      }

      // Replace contract ID with auto-generated
      if (appliedTemplate.template_content.header) {
        appliedTemplate.template_content.header['Contract ID'] = `ACN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        appliedTemplate.template_content.header['Effective Date'] = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }

    return appliedTemplate;
  }

  /**
   * Get template preview (first 3 sections only)
   */
  static getTemplatePreview(templateId: string): {
    header?: Record<string, string>;
    parties?: Record<string, string>;
    scopeOfWork?: Record<string, string>;
  } | null {
    const template = this.getTemplateById(templateId);
    if (!template) return null;

    return {
      header: template.template_content.header,
      parties: template.template_content.parties,
      scopeOfWork: template.template_content.scopeOfWork
    };
  }

  /**
   * Export template as formatted text
   */
  static exportTemplateAsText(templateId: string): string {
    const template = this.getTemplateById(templateId);
    if (!template) return '';

    let text = `${template.name}\n`;
    text += `${'='.repeat(template.name.length)}\n\n`;
    text += `Category: ${template.category}\n`;
    text += `Description: ${template.description}\n`;
    text += `Version: ${template.version}\n`;
    text += `Last Updated: ${template.last_updated}\n\n`;

    const sections = [
      { title: 'CONTRACT HEADER', data: template.template_content.header },
      { title: 'CONTRACTING PARTIES', data: template.template_content.parties },
      { title: 'SCOPE OF WORK', data: template.template_content.scopeOfWork },
      { title: 'PRICING TERMS', data: template.template_content.pricingTerms },
      { title: 'PAYMENT TERMS', data: template.template_content.paymentTerms },
      { title: 'DELIVERY SCHEDULE', data: template.template_content.deliverySchedule },
      { title: 'PERFORMANCE GUARANTEE', data: template.template_content.performanceGuarantee },
      { title: 'TERMINATION CLAUSES', data: template.template_content.terminationClauses },
      { title: 'LEGAL TERMS', data: template.template_content.legalTerms },
      { title: 'SPECIAL CONDITIONS', data: template.template_content.specialConditions }
    ];

    sections.forEach(section => {
      text += `\n${section.title}\n`;
      text += `${'-'.repeat(section.title.length)}\n`;
      if (section.data) {
        Object.entries(section.data).forEach(([key, value]) => {
          text += `${key}: ${value}\n`;
        });
      }
    });

    if (template.required_annexures && template.required_annexures.length > 0) {
      text += '\n\nREQUIRED ANNEXURES\n';
      text += '-------------------\n';
      template.required_annexures.forEach((annexure, index) => {
        text += `${index + 1}. ${annexure}\n`;
      });
    }

    return text;
  }
}

export default ContractTemplateLibraryService;
