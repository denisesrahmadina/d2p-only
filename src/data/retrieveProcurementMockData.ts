export interface UnitRequest {
  unit: string;
  quantity: string;
}

export interface ProcurementRequest {
  id: string;
  materialId: string;
  materialName: string;
  materialValue: number;
  category: string;
  unitRequests: UnitRequest[];
  totalQuantity: string;
}

export const mockProcurementData: ProcurementRequest[] = [
  {
    id: '1',
    materialId: 'MTL-073',
    materialName: 'Bottom Ash Removal Systems',
    materialValue: 3700000000,
    category: 'Ash Handling Systems',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '2 systems' },
      { unit: 'UBP Paiton', quantity: '2 systems' },
      { unit: 'PLTU Jawa Tengah', quantity: '1 system' }
    ],
    totalQuantity: '5 systems'
  },
  {
    id: '2',
    materialId: 'MTL-074',
    materialName: 'Fly Ash Handling Equipment',
    materialValue: 4200000000,
    category: 'Ash Handling Systems',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '3 sets' },
      { unit: 'UBP Paiton', quantity: '2 sets' },
      { unit: 'PLTU Indramayu', quantity: '2 sets' }
    ],
    totalQuantity: '7 sets'
  },
  {
    id: '3',
    materialId: 'MTL-075',
    materialName: 'Ash Conveyors',
    materialValue: 2100000000,
    category: 'Ash Handling Systems',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '8 units' },
      { unit: 'UBP Paiton', quantity: '6 units' },
      { unit: 'PLTU Indramayu', quantity: '4 units' },
      { unit: 'PLTU Jawa Tengah', quantity: '3 units' }
    ],
    totalQuantity: '21 units'
  },
  {
    id: '4',
    materialId: 'MTL-076',
    materialName: 'Ash Silos',
    materialValue: 1800000000,
    category: 'Ash Handling Systems',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '4 units' },
      { unit: 'UBP Paiton', quantity: '3 units' },
      { unit: 'PLTU Indramayu', quantity: '2 units' }
    ],
    totalQuantity: '9 units'
  },
  {
    id: '5',
    materialId: 'FLT-001',
    materialName: 'Filter air',
    materialValue: 20000000000,
    category: 'Filters',
    unitRequests: [
      { unit: 'UBP ADP', quantity: '450 units' },
      { unit: 'UBP Suralaya', quantity: '320 units' },
      { unit: 'UBP Paiton', quantity: '280 units' },
      { unit: 'PLTU Indramayu', quantity: '180 units' }
    ],
    totalQuantity: '8,000 units'
  },
  {
    id: '6',
    materialId: 'FLT-002',
    materialName: 'Filter Udara Cartridge',
    materialValue: 3500000000,
    category: 'Filters',
    unitRequests: [
      { unit: 'UBP ADP', quantity: '380 units' },
      { unit: 'UBP Suralaya', quantity: '290 units' },
      { unit: 'UBP Paiton', quantity: '240 units' },
      { unit: 'PLTU Jawa Tengah', quantity: '150 units' }
    ],
    totalQuantity: '1,060 units'
  },
  {
    id: '7',
    materialId: 'FLT-003',
    materialName: 'Oil Filter',
    materialValue: 1900000000,
    category: 'Filters',
    unitRequests: [
      { unit: 'UBP ADP', quantity: '560 units' },
      { unit: 'UBP Suralaya', quantity: '420 units' },
      { unit: 'UBP Paiton', quantity: '340 units' }
    ],
    totalQuantity: '1,320 units'
  },
  {
    id: '8',
    materialId: 'FLT-004',
    materialName: 'Filter Gas',
    materialValue: 2400000000,
    category: 'Filters',
    unitRequests: [
      { unit: 'UBP ADP', quantity: '280 units' },
      { unit: 'UBP Suralaya', quantity: '210 units' },
      { unit: 'PLTU Indramayu', quantity: '180 units' },
      { unit: 'PLTU Jawa Tengah', quantity: '120 units' }
    ],
    totalQuantity: '790 units'
  },
  {
    id: '9',
    materialId: 'FLT-005',
    materialName: 'Filter Udara Kassa',
    materialValue: 15000000000,
    category: 'Filters',
    unitRequests: [
      { unit: 'UBP ADP', quantity: '620 units' },
      { unit: 'UBP Suralaya', quantity: '380 units' },
      { unit: 'UBP Paiton', quantity: '290 units' }
    ],
    totalQuantity: '1,290 units'
  },
  {
    id: '10',
    materialId: 'LBT-001',
    materialName: 'Turbine Oil',
    materialValue: 5200000000,
    category: 'Lubricants & Fluids',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '12,000 liters' },
      { unit: 'UBP Paiton', quantity: '9,000 liters' },
      { unit: 'UBP ADP', quantity: '7,500 liters' },
      { unit: 'PLTU Jawa Tengah', quantity: '6,000 liters' }
    ],
    totalQuantity: '34,500 liters'
  },
  {
    id: '11',
    materialId: 'LBT-002',
    materialName: 'Hydraulic Oil',
    materialValue: 3800000000,
    category: 'Lubricants & Fluids',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '8,000 liters' },
      { unit: 'UBP Paiton', quantity: '6,500 liters' },
      { unit: 'PLTU Indramayu', quantity: '5,000 liters' }
    ],
    totalQuantity: '19,500 liters'
  },
  {
    id: '12',
    materialId: 'LBT-003',
    materialName: 'Grease',
    materialValue: 2900000000,
    category: 'Lubricants & Fluids',
    unitRequests: [
      { unit: 'UBP ADP', quantity: '450 drums' },
      { unit: 'UBP Suralaya', quantity: '380 drums' },
      { unit: 'UBP Paiton', quantity: '320 drums' },
      { unit: 'PLTU Jawa Tengah', quantity: '250 drums' }
    ],
    totalQuantity: '1,400 drums'
  },
  {
    id: '13',
    materialId: 'ELC-001',
    materialName: 'Circuit Breakers',
    materialValue: 6700000000,
    category: 'Electrical Components',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '45 units' },
      { unit: 'UBP Paiton', quantity: '38 units' },
      { unit: 'UBP ADP', quantity: '32 units' },
      { unit: 'PLTU Indramayu', quantity: '28 units' }
    ],
    totalQuantity: '143 units'
  },
  {
    id: '14',
    materialId: 'ELC-002',
    materialName: 'Transformers',
    materialValue: 8200000000,
    category: 'Electrical Components',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '12 units' },
      { unit: 'UBP Paiton', quantity: '10 units' },
      { unit: 'PLTU Indramayu', quantity: '8 units' }
    ],
    totalQuantity: '30 units'
  },
  {
    id: '15',
    materialId: 'ELC-003',
    materialName: 'Power Cables',
    materialValue: 3900000000,
    category: 'Electrical Components',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '15,000 meters' },
      { unit: 'UBP Paiton', quantity: '12,000 meters' },
      { unit: 'UBP ADP', quantity: '9,000 meters' },
      { unit: 'PLTU Jawa Tengah', quantity: '7,500 meters' }
    ],
    totalQuantity: '43,500 meters'
  }
];

export function formatCurrency(value: number): string {
  return `IDR ${value.toLocaleString('id-ID')}`;
}
