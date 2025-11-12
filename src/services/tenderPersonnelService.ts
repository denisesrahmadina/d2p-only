export interface TenderPersonnel {
  id: string;
  sourcing_event_id: string;
  role: string;
  name: string;
  department: string;
  email: string;
  phone?: string;
  ai_generated: boolean;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface PersonnelTemplate {
  role: string;
  department: string;
  priority: number;
}

export class TenderPersonnelService {
  private static readonly SESSION_STORAGE_KEY = 'session_tender_personnel';

  private static readonly PERSONNEL_TEMPLATES: Record<string, PersonnelTemplate[]> = {
    'Electrical Equipment': [
      { role: 'Procurement Officer', department: 'Procurement', priority: 1 },
      { role: 'Technical Evaluator - Electrical', department: 'Engineering', priority: 2 },
      { role: 'Legal Reviewer', department: 'Legal & Compliance', priority: 3 },
      { role: 'Commercial Analyst', department: 'Finance', priority: 4 },
      { role: 'Quality Assurance Specialist', department: 'Quality Control', priority: 5 }
    ],
    'Mechanical Equipment': [
      { role: 'Procurement Officer', department: 'Procurement', priority: 1 },
      { role: 'Technical Evaluator - Mechanical', department: 'Engineering', priority: 2 },
      { role: 'Legal Reviewer', department: 'Legal & Compliance', priority: 3 },
      { role: 'Commercial Analyst', department: 'Finance', priority: 4 },
      { role: 'Safety Officer', department: 'HSE', priority: 5 }
    ],
    'Renewable Energy Equipment': [
      { role: 'Procurement Officer', department: 'Procurement', priority: 1 },
      { role: 'Technical Evaluator - Renewable Energy', department: 'Engineering', priority: 2 },
      { role: 'Environmental Compliance Officer', department: 'Sustainability', priority: 3 },
      { role: 'Legal Reviewer', department: 'Legal & Compliance', priority: 4 },
      { role: 'Commercial Analyst', department: 'Finance', priority: 5 },
      { role: 'Project Manager', department: 'Project Management', priority: 6 }
    ],
    'General': [
      { role: 'Procurement Officer', department: 'Procurement', priority: 1 },
      { role: 'Technical Evaluator', department: 'Engineering', priority: 2 },
      { role: 'Legal Reviewer', department: 'Legal & Compliance', priority: 3 },
      { role: 'Commercial Analyst', department: 'Finance', priority: 4 }
    ]
  };

  private static readonly MOCK_NAMES: Record<string, string[]> = {
    'Procurement Officer': ['Sarah Johnson', 'Michael Chen', 'Ahmad Rahman'],
    'Technical Evaluator': ['Dr. James Williams', 'Eng. Lisa Anderson', 'Ir. Budi Santoso'],
    'Technical Evaluator - Electrical': ['Dr. Robert Martinez', 'Eng. Emily Davis', 'Ir. Agus Prasetyo'],
    'Technical Evaluator - Mechanical': ['Eng. David Thompson', 'Dr. Maria Garcia', 'Ir. Dewi Lestari'],
    'Technical Evaluator - Renewable Energy': ['Dr. Jennifer Kim', 'Eng. Thomas Wright', 'Ir. Siti Nurhaliza'],
    'Legal Reviewer': ['Jessica Brown', 'Daniel Lee', 'Rina Wijaya'],
    'Commercial Analyst': ['Kevin Anderson', 'Michelle Taylor', 'Bambang Sutrisno'],
    'Quality Assurance Specialist': ['Patricia Wilson', 'Christopher Moore', 'Indah Permatasari'],
    'Safety Officer': ['Steven Jackson', 'Laura White', 'Hendra Gunawan'],
    'Environmental Compliance Officer': ['Dr. Rachel Green', 'Mark Robinson', 'Dian Sastro'],
    'Project Manager': ['Andrew Clark', 'Samantha Lewis', 'Eko Prasetyo']
  };

  private static getSessionPersonnel(): TenderPersonnel[] {
    try {
      const stored = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading session personnel:', error);
      return [];
    }
  }

  private static saveSessionPersonnel(personnel: TenderPersonnel[]): void {
    try {
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify(personnel));
    } catch (error) {
      console.error('Error saving session personnel:', error);
    }
  }

  static async getPersonnelBySourcingEvent(
    sourcingEventId: string
  ): Promise<TenderPersonnel[]> {
    const sessionPersonnel = this.getSessionPersonnel();
    return sessionPersonnel.filter(p => p.sourcing_event_id === sourcingEventId);
  }

  static async generatePersonnel(
    sourcingEventId: string,
    category: string,
    organizationId: string,
    estimatedValue?: number
  ): Promise<TenderPersonnel[]> {
    const templates = this.PERSONNEL_TEMPLATES[category] || this.PERSONNEL_TEMPLATES['General'];

    // For high-value projects, add additional oversight roles
    const additionalRoles: PersonnelTemplate[] = [];
    if (estimatedValue && estimatedValue > 50000000000) { // > 50 Billion IDR
      additionalRoles.push(
        { role: 'Senior Manager Approval', department: 'Management', priority: 7 },
        { role: 'Risk Analyst', department: 'Risk Management', priority: 8 }
      );
    }

    const allTemplates = [...templates, ...additionalRoles];

    const personnel: TenderPersonnel[] = allTemplates.map((template, index) => {
      const names = this.MOCK_NAMES[template.role] || ['John Doe', 'Jane Smith', 'Alex Brown'];
      const selectedName = names[Math.floor(Math.random() * names.length)];
      const emailName = selectedName.toLowerCase().replace(/\s+/g, '.');

      return {
        id: `TPR-${Date.now()}-${index}`,
        sourcing_event_id: sourcingEventId,
        role: template.role,
        name: selectedName,
        department: template.department,
        email: `${emailName}@indonesiapower.co.id`,
        phone: `+62 ${800 + index} ${1000 + Math.floor(Math.random() * 9000)} ${1000 + Math.floor(Math.random() * 9000)}`,
        ai_generated: true,
        organization_id: organizationId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    return personnel;
  }

  static async savePersonnel(personnel: TenderPersonnel[]): Promise<void> {
    const sessionPersonnel = this.getSessionPersonnel();

    // Remove existing personnel for this sourcing event
    const filteredPersonnel = sessionPersonnel.filter(
      p => !personnel.some(newP => newP.sourcing_event_id === p.sourcing_event_id)
    );

    // Add new personnel
    const updatedPersonnel = [...filteredPersonnel, ...personnel];
    this.saveSessionPersonnel(updatedPersonnel);
  }

  static async updatePersonnel(
    id: string,
    updates: Partial<TenderPersonnel>
  ): Promise<TenderPersonnel | null> {
    const sessionPersonnel = this.getSessionPersonnel();
    const index = sessionPersonnel.findIndex(p => p.id === id);

    if (index === -1) return null;

    const updatedPerson = {
      ...sessionPersonnel[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    sessionPersonnel[index] = updatedPerson;
    this.saveSessionPersonnel(sessionPersonnel);

    return updatedPerson;
  }

  static async deletePersonnel(id: string): Promise<void> {
    const sessionPersonnel = this.getSessionPersonnel();
    const filtered = sessionPersonnel.filter(p => p.id !== id);
    this.saveSessionPersonnel(filtered);
  }
}
