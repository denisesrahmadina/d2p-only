import mockData from '../data/categoryManagerMockData.json';

export interface CategoryStrategyProcurementRequest {
  id: string;
  material_name: string;
  material_code: string;
  category: string;
  quantity: number;
  unit_of_measure: string;
  unit_price: number;
  total_amount: number;
  vendor: string | null;
  status: string | null;
  description: string | null;
  requestor: string;
  priority: 'High' | 'Medium' | 'Low';
  due_date: string;
  dataset_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryGroup {
  categoryName: string;
  items: CategoryStrategyProcurementRequest[];
  totalQuantity: number;
  totalAmount: number;
  itemCount: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockProcurementRequests: CategoryStrategyProcurementRequest[] = [
  {
    id: 'pr-001',
    material_name: 'Circuit Breaker 100A',
    material_code: 'EL-CB-100A',
    category: 'Electrical Equipment',
    quantity: 50,
    unit_of_measure: 'Unit',
    unit_price: 2500000,
    total_amount: 125000000,
    vendor: 'PT Siemens Indonesia',
    status: 'Pending',
    description: 'High voltage circuit breakers for substation upgrade',
    requestor: 'Electrical Engineering',
    priority: 'High',
    due_date: '2025-01-15',
    dataset_id: 'ds-001',
    organization_id: 'org-001',
    created_at: '2024-10-15T08:00:00Z',
    updated_at: '2024-10-15T08:00:00Z',
  },
  {
    id: 'pr-002',
    material_name: 'Power Transformer 500kVA',
    material_code: 'EL-TR-500',
    category: 'Electrical Equipment',
    quantity: 10,
    unit_of_measure: 'Unit',
    unit_price: 85000000,
    total_amount: 850000000,
    vendor: 'PT ABB Power',
    status: 'Approved',
    description: 'Distribution transformers for grid expansion',
    requestor: 'Power Distribution',
    priority: 'High',
    due_date: '2025-02-01',
    dataset_id: 'ds-001',
    organization_id: 'org-001',
    created_at: '2024-10-12T09:30:00Z',
    updated_at: '2024-10-20T14:15:00Z',
  },
  {
    id: 'pr-003',
    material_name: 'Diesel Fuel Grade A',
    material_code: 'FUEL-DSL-A',
    category: 'Fuel & Combustion Materials',
    quantity: 500000,
    unit_of_measure: 'Liter',
    unit_price: 15000,
    total_amount: 7500000000,
    vendor: 'PT Pertamina Energy Trading',
    status: 'In Progress',
    description: 'Monthly fuel supply for generators',
    requestor: 'Operations Management',
    priority: 'High',
    due_date: '2024-12-01',
    dataset_id: 'ds-001',
    organization_id: 'org-001',
    created_at: '2024-10-18T10:00:00Z',
    updated_at: '2024-10-25T16:30:00Z',
  },
  {
    id: 'pr-004',
    material_name: 'Enterprise Software Licenses',
    material_code: 'IT-SW-ENT',
    category: 'Information Technology',
    quantity: 500,
    unit_of_measure: 'License',
    unit_price: 8000000,
    total_amount: 4000000000,
    vendor: 'Microsoft Indonesia',
    status: 'Pending',
    description: 'Annual renewal of enterprise software licenses',
    requestor: 'IT Department',
    priority: 'Medium',
    due_date: '2025-01-31',
    dataset_id: 'ds-001',
    organization_id: 'org-001',
    created_at: '2024-10-20T11:15:00Z',
    updated_at: '2024-10-20T11:15:00Z',
  },
  {
    id: 'pr-005',
    material_name: 'Bearing Assembly',
    material_code: 'MECH-BRG-001',
    category: 'Mechanical Components',
    quantity: 200,
    unit_of_measure: 'Set',
    unit_price: 1200000,
    total_amount: 240000000,
    vendor: null,
    status: 'Pending',
    description: 'Replacement bearings for turbine maintenance',
    requestor: 'Maintenance Department',
    priority: 'High',
    due_date: '2024-12-15',
    dataset_id: 'ds-001',
    organization_id: 'org-001',
    created_at: '2024-10-22T08:45:00Z',
    updated_at: '2024-10-22T08:45:00Z',
  },
  {
    id: 'pr-006',
    material_name: 'Industrial Lubricant Type-X',
    material_code: 'CHEM-LUB-X',
    category: 'Chemicals & Lubricants',
    quantity: 10000,
    unit_of_measure: 'Liter',
    unit_price: 250000,
    total_amount: 2500000000,
    vendor: 'PT Shell Indonesia',
    status: 'Approved',
    description: 'High-performance lubricants for machinery',
    requestor: 'Operations',
    priority: 'Medium',
    due_date: '2025-01-10',
    dataset_id: 'ds-001',
    organization_id: 'org-001',
    created_at: '2024-10-10T13:20:00Z',
    updated_at: '2024-10-18T10:30:00Z',
  },
  {
    id: 'pr-007',
    material_name: 'Cement Type II',
    material_code: 'CONS-CEM-II',
    category: 'Construction Materials',
    quantity: 5000,
    unit_of_measure: 'Ton',
    unit_price: 1500000,
    total_amount: 7500000000,
    vendor: null,
    status: 'Pending',
    description: 'Construction materials for facility expansion',
    requestor: 'Project Management',
    priority: 'Low',
    due_date: '2025-03-01',
    dataset_id: 'ds-001',
    organization_id: 'org-001',
    created_at: '2024-10-25T09:00:00Z',
    updated_at: '2024-10-25T09:00:00Z',
  },
  {
    id: 'pr-008',
    material_name: 'Engineering Consulting Services',
    material_code: 'SERV-ENG-001',
    category: 'Professional Services',
    quantity: 1,
    unit_of_measure: 'Project',
    unit_price: 5000000000,
    total_amount: 5000000000,
    vendor: 'PT Consulting Engineers',
    status: 'In Progress',
    description: 'Design and engineering consultation for new plant',
    requestor: 'Engineering Division',
    priority: 'High',
    due_date: '2025-06-30',
    dataset_id: 'ds-001',
    organization_id: 'org-001',
    created_at: '2024-09-15T10:00:00Z',
    updated_at: '2024-10-15T14:00:00Z',
  },
  {
    id: 'pr-009',
    material_name: 'Safety Equipment Bundle',
    material_code: 'MRO-SAF-001',
    category: 'MRO Supplies',
    quantity: 300,
    unit_of_measure: 'Set',
    unit_price: 750000,
    total_amount: 225000000,
    vendor: null,
    status: 'Pending',
    description: 'Personal protective equipment for workers',
    requestor: 'HSE Department',
    priority: 'Medium',
    due_date: '2024-12-31',
    dataset_id: 'ds-001',
    organization_id: 'org-001',
    created_at: '2024-10-28T11:00:00Z',
    updated_at: '2024-10-28T11:00:00Z',
  },
  {
    id: 'pr-010',
    material_name: 'Freight Transportation Services',
    material_code: 'LOG-FRT-001',
    category: 'Logistics & Transportation',
    quantity: 1,
    unit_of_measure: 'Contract',
    unit_price: 3000000000,
    total_amount: 3000000000,
    vendor: 'PT Logistics Partner',
    status: 'Approved',
    description: 'Annual freight transportation contract',
    requestor: 'Supply Chain',
    priority: 'High',
    due_date: '2024-12-31',
    dataset_id: 'ds-001',
    organization_id: 'org-001',
    created_at: '2024-09-01T08:00:00Z',
    updated_at: '2024-09-20T15:00:00Z',
  },
];

export class CategoryStrategyService {
  static async getProcurementRequests(
    datasetId: string,
    organizationId: string
  ): Promise<CategoryStrategyProcurementRequest[]> {
    await delay(200);

    return mockProcurementRequests
      .filter(pr => pr.dataset_id === datasetId && pr.organization_id === organizationId)
      .sort((a, b) => {
        const categoryCompare = a.category.localeCompare(b.category);
        if (categoryCompare !== 0) return categoryCompare;
        return a.material_name.localeCompare(b.material_name);
      });
  }

  static formatCurrency(value: number): string {
    if (value >= 1000000000000) {
      return `Rp ${(value / 1000000000000).toFixed(2)}T`;
    } else if (value >= 1000000000) {
      return `Rp ${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(2)}M`;
    }
    return `Rp ${value.toLocaleString('id-ID')}`;
  }
}
