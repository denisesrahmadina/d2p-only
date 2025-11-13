export interface MonthlyProcurementData {
  month: string;
  netProcurement: number;
  unitPrice: number;
  totalAmount: number;
}

export interface MaterialProcurementData {
  totalQuantity: number;
  unitPrice: number;
  totalAmount: number;
  monthlyData: MonthlyProcurementData[];
}

export interface UnitRequest {
  unit: string;
  quantity: string;
}

export interface ProcurementRequestItem {
  id: string;
  materialId: string;
  materialName: string;
  materialValue: number;
  category: string;
  unitRequests: UnitRequest[];
  totalQuantity: string;
}

export interface CategorySummary {
  categoryName: string;
  itemsCount: number;
  totalValue: number;
  mostRequested: string;
}

export interface AnnualBudgetData {
  totalBudget: number;
  totalUnits: number;
  currency: string;
}

export interface CategoryBudgetData {
  name: string;
  value: number;
  percentage: number;
}

export const annualBudget: AnnualBudgetData = {
  totalBudget: 848457012000,
  totalUnits: 3234734,
  currency: 'IDR'
};

export const categoryBudgetDistribution: CategoryBudgetData[] = [
  {
    name: 'Others',
    value: 776557012000,
    percentage: 91.5
  },
  {
    name: 'Ash Handling System',
    value: 11800000000,
    percentage: 1.39
  },
  {
    name: 'Electrical Equipment',
    value: 18800000000,
    percentage: 2.22
  },
  {
    name: 'Filters',
    value: 29400000000,
    percentage: 3.47
  },
  {
    name: 'Consumables',
    value: 11900000000,
    percentage: 1.4
  }
];

export const categorySummaries: CategorySummary[] = [
  {
    categoryName: 'Ash Handling System',
    itemsCount: 4,
    totalValue: 11800000000,
    mostRequested: 'Fly Ash Handling Equipment'
  },
  {
    categoryName: 'Filters',
    itemsCount: 5,
    totalValue: 29400000000,
    mostRequested: 'Filter air'
  },
  {
    categoryName: 'Consumables',
    itemsCount: 3,
    totalValue: 11900000000,
    mostRequested: 'Turbine Oil'
  },
  {
    categoryName: 'Electrical Equipment',
    itemsCount: 3,
    totalValue: 18800000000,
    mostRequested: 'Transformers'
  },
  {
    categoryName: 'Boiler and Pressure Vessel Equipment',
    itemsCount: 2,
    totalValue: 13700000000,
    mostRequested: 'Boiler Tubes'
  },
  {
    categoryName: 'Civil Works and Construction Materials',
    itemsCount: 2,
    totalValue: 8300000000,
    mostRequested: 'Steel Reinforcement Bars'
  },
  {
    categoryName: 'Emission Control Systems',
    itemsCount: 2,
    totalValue: 14000000000,
    mostRequested: 'Flue Gas Desulfurization Equipment'
  },
  {
    categoryName: 'Engineering and Design Materials',
    itemsCount: 2,
    totalValue: 5500000000,
    mostRequested: 'Engineering Tools & Equipment'
  },
  {
    categoryName: 'Fuel',
    itemsCount: 2,
    totalValue: 133500000000,
    mostRequested: 'Coal'
  },
  {
    categoryName: 'IT and Communication Systems',
    itemsCount: 2,
    totalValue: 7000000000,
    mostRequested: 'Servers'
  },
  {
    categoryName: 'Instrumentation and Control System',
    itemsCount: 2,
    totalValue: 12700000000,
    mostRequested: 'DCS Controllers'
  },
  {
    categoryName: 'Mechanical Equipment',
    itemsCount: 2,
    totalValue: 10100000000,
    mostRequested: 'Pumps'
  },
  {
    categoryName: 'Renewable Energy Equipment',
    itemsCount: 2,
    totalValue: 23500000000,
    mostRequested: 'Solar Panels'
  },
  {
    categoryName: 'Safety and Environmental Equipment',
    itemsCount: 2,
    totalValue: 7200000000,
    mostRequested: 'Fire Suppression Systems'
  },
  {
    categoryName: 'Spare part and Maintenance',
    itemsCount: 2,
    totalValue: 5300000000,
    mostRequested: 'Bearings'
  },
  {
    categoryName: 'Water Treatment System',
    itemsCount: 2,
    totalValue: 9800000000,
    mostRequested: 'Water Treatment Chemicals'
  }
];

export const procurementRequests: ProcurementRequestItem[] = [
  {
    id: '1',
    materialId: 'MTL-073',
    materialName: 'Bottom Ash Removal Systems',
    materialValue: 3700000000,
    category: 'Ash Handling System',
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
    category: 'Ash Handling System',
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
    category: 'Ash Handling System',
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
    category: 'Ash Handling System',
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
      { unit: 'UBP Suralaya', quantity: '2500 pcs' },
      { unit: 'UBP Paiton', quantity: '2000 pcs' },
      { unit: 'PLTU Indramayu', quantity: '1800 pcs' },
      { unit: 'PLTU Jawa Tengah', quantity: '1700 pcs' }
    ],
    totalQuantity: '8000 pcs'
  },
  {
    id: '6',
    materialId: 'FLT-002',
    materialName: 'Filter Udara Cartridge',
    materialValue: 3500000000,
    category: 'Filters',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '320 pcs' },
      { unit: 'UBP Paiton', quantity: '280 pcs' },
      { unit: 'PLTU Indramayu', quantity: '260 pcs' },
      { unit: 'PLTU Jawa Tengah', quantity: '200 pcs' }
    ],
    totalQuantity: '1060 pcs'
  },
  {
    id: '7',
    materialId: 'FLT-003',
    materialName: 'Oil Filter',
    materialValue: 1900000000,
    category: 'Filters',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '400 pcs' },
      { unit: 'UBP Paiton', quantity: '350 pcs' },
      { unit: 'PLTU Indramayu', quantity: '320 pcs' },
      { unit: 'PLTU Jawa Tengah', quantity: '250 pcs' }
    ],
    totalQuantity: '1320 pcs'
  },
  {
    id: '8',
    materialId: 'FLT-004',
    materialName: 'Filter Gas',
    materialValue: 2400000000,
    category: 'Filters',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '250 pcs' },
      { unit: 'UBP Paiton', quantity: '220 pcs' },
      { unit: 'PLTU Indramayu', quantity: '180 pcs' },
      { unit: 'PLTU Jawa Tengah', quantity: '140 pcs' }
    ],
    totalQuantity: '790 pcs'
  },
  {
    id: '9',
    materialId: 'FLT-005',
    materialName: 'Filter Udara Kassa',
    materialValue: 1600000000,
    category: 'Filters',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '380 pcs' },
      { unit: 'UBP Paiton', quantity: '340 pcs' },
      { unit: 'PLTU Indramayu', quantity: '310 pcs' },
      { unit: 'PLTU Jawa Tengah', quantity: '260 pcs' }
    ],
    totalQuantity: '1290 pcs'
  },
  {
    id: '10',
    materialId: 'LUB-001',
    materialName: 'Turbine Oil',
    materialValue: 5200000000,
    category: 'Consumables',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '11000 liters' },
      { unit: 'UBP Paiton', quantity: '10000 liters' },
      { unit: 'PLTU Indramayu', quantity: '9000 liters' },
      { unit: 'PLTU Jawa Tengah', quantity: '7000 liters' }
    ],
    totalQuantity: '37000 liters'
  },
  {
    id: '11',
    materialId: 'LUB-002',
    materialName: 'Hydraulic Oil',
    materialValue: 3800000000,
    category: 'Consumables',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '6500 liters' },
      { unit: 'UBP Paiton', quantity: '6000 liters' },
      { unit: 'PLTU Indramayu', quantity: '5000 liters' },
      { unit: 'PLTU Jawa Tengah', quantity: '4000 liters' }
    ],
    totalQuantity: '21500 liters'
  },
  {
    id: '12',
    materialId: 'LUB-003',
    materialName: 'Gear Oil',
    materialValue: 2900000000,
    category: 'Consumables',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '5000 liters' },
      { unit: 'UBP Paiton', quantity: '4500 liters' },
      { unit: 'PLTU Indramayu', quantity: '3800 liters' },
      { unit: 'PLTU Jawa Tengah', quantity: '2700 liters' }
    ],
    totalQuantity: '16000 liters'
  },
  {
    id: '13',
    materialId: 'ELC-001',
    materialName: 'Circuit Breakers',
    materialValue: 6500000000,
    category: 'Electrical Equipment',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '45 units' },
      { unit: 'UBP Paiton', quantity: '40 units' },
      { unit: 'PLTU Indramayu', quantity: '32 units' },
      { unit: 'PLTU Jawa Tengah', quantity: '23 units' }
    ],
    totalQuantity: '140 units'
  },
  {
    id: '14',
    materialId: 'ELC-002',
    materialName: 'Transformers',
    materialValue: 8200000000,
    category: 'Electrical Equipment',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '10 units' },
      { unit: 'UBP Paiton', quantity: '9 units' },
      { unit: 'PLTU Indramayu', quantity: '7 units' },
      { unit: 'PLTU Jawa Tengah', quantity: '4 units' }
    ],
    totalQuantity: '30 units'
  },
  {
    id: '15',
    materialId: 'ELC-003',
    materialName: 'Power Cables',
    materialValue: 4100000000,
    category: 'Electrical Equipment',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '13000 meters' },
      { unit: 'UBP Paiton', quantity: '12000 meters' },
      { unit: 'PLTU Indramayu', quantity: '10000 meters' },
      { unit: 'PLTU Jawa Tengah', quantity: '8500 meters' }
    ],
    totalQuantity: '43500 meters'
  },
  {
    id: '16',
    materialId: 'BPV-001',
    materialName: 'Boiler Tubes',
    materialValue: 8500000000,
    category: 'Boiler and Pressure Vessel Equipment',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '2500 meters' },
      { unit: 'UBP Paiton', quantity: '2200 meters' },
      { unit: 'PLTU Indramayu', quantity: '1800 meters' }
    ],
    totalQuantity: '6500 meters'
  },
  {
    id: '17',
    materialId: 'BPV-002',
    materialName: 'Pressure Vessel Components',
    materialValue: 5200000000,
    category: 'Boiler and Pressure Vessel Equipment',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '45 units' },
      { unit: 'UBP Paiton', quantity: '38 units' },
      { unit: 'PLTU Jawa Tengah', quantity: '27 units' }
    ],
    totalQuantity: '110 units'
  },
  {
    id: '18',
    materialId: 'CWC-001',
    materialName: 'Cement',
    materialValue: 3800000000,
    category: 'Civil Works and Construction Materials',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '850 tons' },
      { unit: 'UBP Paiton', quantity: '720 tons' },
      { unit: 'PLTU Indramayu', quantity: '630 tons' }
    ],
    totalQuantity: '2200 tons'
  },
  {
    id: '19',
    materialId: 'CWC-002',
    materialName: 'Steel Reinforcement Bars',
    materialValue: 4500000000,
    category: 'Civil Works and Construction Materials',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '650 tons' },
      { unit: 'UBP Paiton', quantity: '580 tons' },
      { unit: 'PLTU Jawa Tengah', quantity: '470 tons' }
    ],
    totalQuantity: '1700 tons'
  },
  {
    id: '20',
    materialId: 'ECS-001',
    materialName: 'Electrostatic Precipitator Parts',
    materialValue: 6200000000,
    category: 'Emission Control Systems',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '35 sets' },
      { unit: 'UBP Paiton', quantity: '28 sets' },
      { unit: 'PLTU Indramayu', quantity: '22 sets' }
    ],
    totalQuantity: '85 sets'
  },
  {
    id: '21',
    materialId: 'ECS-002',
    materialName: 'Flue Gas Desulfurization Equipment',
    materialValue: 7800000000,
    category: 'Emission Control Systems',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '4 systems' },
      { unit: 'UBP Paiton', quantity: '3 systems' },
      { unit: 'PLTU Jawa Tengah', quantity: '2 systems' }
    ],
    totalQuantity: '9 systems'
  },
  {
    id: '22',
    materialId: 'EDM-001',
    materialName: 'CAD Software Licenses',
    materialValue: 2100000000,
    category: 'Engineering and Design Materials',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '45 licenses' },
      { unit: 'UBP Paiton', quantity: '38 licenses' },
      { unit: 'PLTU Indramayu', quantity: '32 licenses' }
    ],
    totalQuantity: '115 licenses'
  },
  {
    id: '23',
    materialId: 'EDM-002',
    materialName: 'Engineering Tools & Equipment',
    materialValue: 3400000000,
    category: 'Engineering and Design Materials',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '125 units' },
      { unit: 'UBP Paiton', quantity: '98 units' },
      { unit: 'PLTU Jawa Tengah', quantity: '77 units' }
    ],
    totalQuantity: '300 units'
  },
  {
    id: '24',
    materialId: 'FUEL-001',
    materialName: 'Coal',
    materialValue: 125000000000,
    category: 'Fuel',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '850000 tons' },
      { unit: 'UBP Paiton', quantity: '720000 tons' },
      { unit: 'PLTU Indramayu', quantity: '680000 tons' },
      { unit: 'PLTU Jawa Tengah', quantity: '550000 tons' }
    ],
    totalQuantity: '2800000 tons'
  },
  {
    id: '25',
    materialId: 'FUEL-002',
    materialName: 'Diesel Fuel',
    materialValue: 8500000000,
    category: 'Fuel',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '45000 liters' },
      { unit: 'UBP Paiton', quantity: '38000 liters' },
      { unit: 'PLTU Indramayu', quantity: '32000 liters' }
    ],
    totalQuantity: '115000 liters'
  },
  {
    id: '26',
    materialId: 'ITC-001',
    materialName: 'Network Switches',
    materialValue: 2800000000,
    category: 'IT and Communication Systems',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '85 units' },
      { unit: 'UBP Paiton', quantity: '72 units' },
      { unit: 'PLTU Indramayu', quantity: '58 units' }
    ],
    totalQuantity: '215 units'
  },
  {
    id: '27',
    materialId: 'ITC-002',
    materialName: 'Servers',
    materialValue: 4200000000,
    category: 'IT and Communication Systems',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '12 units' },
      { unit: 'UBP Paiton', quantity: '10 units' },
      { unit: 'PLTU Jawa Tengah', quantity: '8 units' }
    ],
    totalQuantity: '30 units'
  },
  {
    id: '28',
    materialId: 'ICS-001',
    materialName: 'DCS Controllers',
    materialValue: 9500000000,
    category: 'Instrumentation and Control System',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '28 units' },
      { unit: 'UBP Paiton', quantity: '24 units' },
      { unit: 'PLTU Indramayu', quantity: '18 units' }
    ],
    totalQuantity: '70 units'
  },
  {
    id: '29',
    materialId: 'ICS-002',
    materialName: 'Pressure Transmitters',
    materialValue: 3200000000,
    category: 'Instrumentation and Control System',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '350 units' },
      { unit: 'UBP Paiton', quantity: '280 units' },
      { unit: 'PLTU Jawa Tengah', quantity: '220 units' }
    ],
    totalQuantity: '850 units'
  },
  {
    id: '30',
    materialId: 'MEQ-001',
    materialName: 'Pumps',
    materialValue: 5800000000,
    category: 'Mechanical Equipment',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '65 units' },
      { unit: 'UBP Paiton', quantity: '52 units' },
      { unit: 'PLTU Indramayu', quantity: '43 units' }
    ],
    totalQuantity: '160 units'
  },
  {
    id: '31',
    materialId: 'MEQ-002',
    materialName: 'Valves',
    materialValue: 4300000000,
    category: 'Mechanical Equipment',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '520 units' },
      { unit: 'UBP Paiton', quantity: '450 units' },
      { unit: 'PLTU Jawa Tengah', quantity: '380 units' }
    ],
    totalQuantity: '1350 units'
  },
  {
    id: '32',
    materialId: 'REE-001',
    materialName: 'Solar Panels',
    materialValue: 15000000000,
    category: 'Renewable Energy Equipment',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '850 units' },
      { unit: 'UBP Paiton', quantity: '720 units' },
      { unit: 'PLTU Indramayu', quantity: '630 units' }
    ],
    totalQuantity: '2200 units'
  },
  {
    id: '33',
    materialId: 'REE-002',
    materialName: 'Wind Turbine Components',
    materialValue: 8500000000,
    category: 'Renewable Energy Equipment',
    unitRequests: [
      { unit: 'UBP Paiton', quantity: '12 sets' },
      { unit: 'PLTU Jawa Tengah', quantity: '8 sets' }
    ],
    totalQuantity: '20 sets'
  },
  {
    id: '34',
    materialId: 'SEE-001',
    materialName: 'Personal Protective Equipment',
    materialValue: 2400000000,
    category: 'Safety and Environmental Equipment',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '2500 sets' },
      { unit: 'UBP Paiton', quantity: '2100 sets' },
      { unit: 'PLTU Indramayu', quantity: '1800 sets' },
      { unit: 'PLTU Jawa Tengah', quantity: '1600 sets' }
    ],
    totalQuantity: '8000 sets'
  },
  {
    id: '35',
    materialId: 'SEE-002',
    materialName: 'Fire Suppression Systems',
    materialValue: 4800000000,
    category: 'Safety and Environmental Equipment',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '18 systems' },
      { unit: 'UBP Paiton', quantity: '15 systems' },
      { unit: 'PLTU Indramayu', quantity: '12 systems' }
    ],
    totalQuantity: '45 systems'
  },
  {
    id: '36',
    materialId: 'SPM-001',
    materialName: 'Bearings',
    materialValue: 3500000000,
    category: 'Spare part and Maintenance',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '850 units' },
      { unit: 'UBP Paiton', quantity: '720 units' },
      { unit: 'PLTU Indramayu', quantity: '580 units' },
      { unit: 'PLTU Jawa Tengah', quantity: '450 units' }
    ],
    totalQuantity: '2600 units'
  },
  {
    id: '37',
    materialId: 'SPM-002',
    materialName: 'Seals and Gaskets',
    materialValue: 1800000000,
    category: 'Spare part and Maintenance',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '4500 units' },
      { unit: 'UBP Paiton', quantity: '3800 units' },
      { unit: 'PLTU Jawa Tengah', quantity: '2700 units' }
    ],
    totalQuantity: '11000 units'
  },
  {
    id: '38',
    materialId: 'WTS-001',
    materialName: 'Water Treatment Chemicals',
    materialValue: 5600000000,
    category: 'Water Treatment System',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '12000 kg' },
      { unit: 'UBP Paiton', quantity: '10500 kg' },
      { unit: 'PLTU Indramayu', quantity: '9200 kg' },
      { unit: 'PLTU Jawa Tengah', quantity: '7800 kg' }
    ],
    totalQuantity: '39500 kg'
  },
  {
    id: '39',
    materialId: 'WTS-002',
    materialName: 'Reverse Osmosis Membranes',
    materialValue: 4200000000,
    category: 'Water Treatment System',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '85 units' },
      { unit: 'UBP Paiton', quantity: '72 units' },
      { unit: 'PLTU Indramayu', quantity: '58 units' }
    ],
    totalQuantity: '215 units'
  }
];

export const materialProcurementData: Record<string, MaterialProcurementData> = {
  'Filter air': {
    totalQuantity: 8000,
    unitPrice: 2500000,
    totalAmount: 20000000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 600, unitPrice: 2500000, totalAmount: 1500000000 },
      { month: 'Feb', netProcurement: 689, unitPrice: 2500000, totalAmount: 1722500000 },
      { month: 'Mar', netProcurement: 704, unitPrice: 2500000, totalAmount: 1760000000 },
      { month: 'Apr', netProcurement: 602, unitPrice: 2500000, totalAmount: 1505000000 },
      { month: 'May', netProcurement: 632, unitPrice: 2500000, totalAmount: 1580000000 },
      { month: 'Jun', netProcurement: 647, unitPrice: 2500000, totalAmount: 1617500000 },
      { month: 'Jul', netProcurement: 659, unitPrice: 2500000, totalAmount: 1647500000 },
      { month: 'Aug', netProcurement: 698, unitPrice: 2500000, totalAmount: 1745000000 },
      { month: 'Sep', netProcurement: 672, unitPrice: 2500000, totalAmount: 1680000000 },
      { month: 'Oct', netProcurement: 699, unitPrice: 2500000, totalAmount: 1747500000 },
      { month: 'Nov', netProcurement: 632, unitPrice: 2500000, totalAmount: 1580000000 },
      { month: 'Dec', netProcurement: 766, unitPrice: 2500000, totalAmount: 1915000000 }
    ]
  },
  'Filter Udara Cartridge': {
    totalQuantity: 1060,
    unitPrice: 3301887,
    totalAmount: 3500000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 82, unitPrice: 3301887, totalAmount: 270754734 },
      { month: 'Feb', netProcurement: 85, unitPrice: 3301887, totalAmount: 280660395 },
      { month: 'Mar', netProcurement: 87, unitPrice: 3301887, totalAmount: 287264169 },
      { month: 'Apr', netProcurement: 90, unitPrice: 3301887, totalAmount: 297169830 },
      { month: 'May', netProcurement: 92, unitPrice: 3301887, totalAmount: 303773604 },
      { month: 'Jun', netProcurement: 88, unitPrice: 3301887, totalAmount: 290566056 },
      { month: 'Jul', netProcurement: 91, unitPrice: 3301887, totalAmount: 300471717 },
      { month: 'Aug', netProcurement: 93, unitPrice: 3301887, totalAmount: 307075491 },
      { month: 'Sep', netProcurement: 86, unitPrice: 3301887, totalAmount: 283962282 },
      { month: 'Oct', netProcurement: 89, unitPrice: 3301887, totalAmount: 293867943 },
      { month: 'Nov', netProcurement: 94, unitPrice: 3301887, totalAmount: 310377378 },
      { month: 'Dec', netProcurement: 83, unitPrice: 3301887, totalAmount: 274056621 }
    ]
  },
  'Oil Filter': {
    totalQuantity: 1320,
    unitPrice: 1439393,
    totalAmount: 1900000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 105, unitPrice: 1439393, totalAmount: 151136265 },
      { month: 'Feb', netProcurement: 108, unitPrice: 1439393, totalAmount: 155454444 },
      { month: 'Mar', netProcurement: 110, unitPrice: 1439393, totalAmount: 158333230 },
      { month: 'Apr', netProcurement: 112, unitPrice: 1439393, totalAmount: 161212016 },
      { month: 'May', netProcurement: 115, unitPrice: 1439393, totalAmount: 165530195 },
      { month: 'Jun', netProcurement: 110, unitPrice: 1439393, totalAmount: 158333230 },
      { month: 'Jul', netProcurement: 113, unitPrice: 1439393, totalAmount: 162651409 },
      { month: 'Aug', netProcurement: 116, unitPrice: 1439393, totalAmount: 166969588 },
      { month: 'Sep', netProcurement: 107, unitPrice: 1439393, totalAmount: 154015051 },
      { month: 'Oct', netProcurement: 111, unitPrice: 1439393, totalAmount: 159772623 },
      { month: 'Nov', netProcurement: 114, unitPrice: 1439393, totalAmount: 164090802 },
      { month: 'Dec', netProcurement: 109, unitPrice: 1439393, totalAmount: 156893837 }
    ]
  },
  'Filter Gas': {
    totalQuantity: 790,
    unitPrice: 3037974,
    totalAmount: 2400000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 62, unitPrice: 3037974, totalAmount: 188354388 },
      { month: 'Feb', netProcurement: 64, unitPrice: 3037974, totalAmount: 194430336 },
      { month: 'Mar', netProcurement: 66, unitPrice: 3037974, totalAmount: 200506284 },
      { month: 'Apr', netProcurement: 67, unitPrice: 3037974, totalAmount: 203544258 },
      { month: 'May', netProcurement: 69, unitPrice: 3037974, totalAmount: 209620206 },
      { month: 'Jun', netProcurement: 65, unitPrice: 3037974, totalAmount: 197468310 },
      { month: 'Jul', netProcurement: 68, unitPrice: 3037974, totalAmount: 206582232 },
      { month: 'Aug', netProcurement: 70, unitPrice: 3037974, totalAmount: 212658180 },
      { month: 'Sep', netProcurement: 64, unitPrice: 3037974, totalAmount: 194430336 },
      { month: 'Oct', netProcurement: 66, unitPrice: 3037974, totalAmount: 200506284 },
      { month: 'Nov', netProcurement: 68, unitPrice: 3037974, totalAmount: 206582232 },
      { month: 'Dec', netProcurement: 61, unitPrice: 3037974, totalAmount: 185316414 }
    ]
  },
  'Filter Udara Kassa': {
    totalQuantity: 1290,
    unitPrice: 1240310,
    totalAmount: 1600000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 103, unitPrice: 1240310, totalAmount: 127751930 },
      { month: 'Feb', netProcurement: 106, unitPrice: 1240310, totalAmount: 131472860 },
      { month: 'Mar', netProcurement: 108, unitPrice: 1240310, totalAmount: 133953480 },
      { month: 'Apr', netProcurement: 110, unitPrice: 1240310, totalAmount: 136434100 },
      { month: 'May', netProcurement: 112, unitPrice: 1240310, totalAmount: 138914720 },
      { month: 'Jun', netProcurement: 107, unitPrice: 1240310, totalAmount: 132713170 },
      { month: 'Jul', netProcurement: 109, unitPrice: 1240310, totalAmount: 135193790 },
      { month: 'Aug', netProcurement: 111, unitPrice: 1240310, totalAmount: 137674410 },
      { month: 'Sep', netProcurement: 105, unitPrice: 1240310, totalAmount: 130232550 },
      { month: 'Oct', netProcurement: 108, unitPrice: 1240310, totalAmount: 133953480 },
      { month: 'Nov', netProcurement: 110, unitPrice: 1240310, totalAmount: 136434100 },
      { month: 'Dec', netProcurement: 101, unitPrice: 1240310, totalAmount: 125271310 }
    ]
  },
  'Bottom Ash Removal Systems': {
    totalQuantity: 5,
    unitPrice: 740000000,
    totalAmount: 3700000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Feb', netProcurement: 1, unitPrice: 740000000, totalAmount: 740000000 },
      { month: 'Mar', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Apr', netProcurement: 1, unitPrice: 740000000, totalAmount: 740000000 },
      { month: 'May', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Jun', netProcurement: 1, unitPrice: 740000000, totalAmount: 740000000 },
      { month: 'Jul', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Aug', netProcurement: 1, unitPrice: 740000000, totalAmount: 740000000 },
      { month: 'Sep', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Oct', netProcurement: 1, unitPrice: 740000000, totalAmount: 740000000 },
      { month: 'Nov', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Dec', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 }
    ]
  },
  'Fly Ash Handling Equipment': {
    totalQuantity: 7,
    unitPrice: 600000000,
    totalAmount: 4200000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Feb', netProcurement: 0, unitPrice: 600000000, totalAmount: 0 },
      { month: 'Mar', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Apr', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'May', netProcurement: 0, unitPrice: 600000000, totalAmount: 0 },
      { month: 'Jun', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Jul', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Aug', netProcurement: 0, unitPrice: 600000000, totalAmount: 0 },
      { month: 'Sep', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Oct', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Nov', netProcurement: 0, unitPrice: 600000000, totalAmount: 0 },
      { month: 'Dec', netProcurement: 0, unitPrice: 600000000, totalAmount: 0 }
    ]
  },
  'Ash Conveyors': {
    totalQuantity: 21,
    unitPrice: 100000000,
    totalAmount: 2100000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Feb', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Mar', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Apr', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'May', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Jun', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Jul', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Aug', netProcurement: 1, unitPrice: 100000000, totalAmount: 100000000 },
      { month: 'Sep', netProcurement: 1, unitPrice: 100000000, totalAmount: 100000000 },
      { month: 'Oct', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Nov', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Dec', netProcurement: 1, unitPrice: 100000000, totalAmount: 100000000 }
    ]
  },
  'Ash Silos': {
    totalQuantity: 9,
    unitPrice: 200000000,
    totalAmount: 1800000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Feb', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Mar', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Apr', netProcurement: 0, unitPrice: 200000000, totalAmount: 0 },
      { month: 'May', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Jun', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Jul', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Aug', netProcurement: 0, unitPrice: 200000000, totalAmount: 0 },
      { month: 'Sep', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Oct', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Nov', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Dec', netProcurement: 0, unitPrice: 200000000, totalAmount: 0 }
    ]
  },
  'Turbine Oil': {
    totalQuantity: 37000,
    unitPrice: 140540,
    totalAmount: 5200000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 3000, unitPrice: 140540, totalAmount: 421620000 },
      { month: 'Feb', netProcurement: 3100, unitPrice: 140540, totalAmount: 435674000 },
      { month: 'Mar', netProcurement: 3200, unitPrice: 140540, totalAmount: 449728000 },
      { month: 'Apr', netProcurement: 3000, unitPrice: 140540, totalAmount: 421620000 },
      { month: 'May', netProcurement: 3100, unitPrice: 140540, totalAmount: 435674000 },
      { month: 'Jun', netProcurement: 3200, unitPrice: 140540, totalAmount: 449728000 },
      { month: 'Jul', netProcurement: 3000, unitPrice: 140540, totalAmount: 421620000 },
      { month: 'Aug', netProcurement: 3100, unitPrice: 140540, totalAmount: 435674000 },
      { month: 'Sep', netProcurement: 3000, unitPrice: 140540, totalAmount: 421620000 },
      { month: 'Oct', netProcurement: 3200, unitPrice: 140540, totalAmount: 449728000 },
      { month: 'Nov', netProcurement: 3000, unitPrice: 140540, totalAmount: 421620000 },
      { month: 'Dec', netProcurement: 3100, unitPrice: 140540, totalAmount: 435674000 }
    ]
  },
  'Hydraulic Oil': {
    totalQuantity: 21500,
    unitPrice: 176744,
    totalAmount: 3800000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 1800, unitPrice: 176744, totalAmount: 318139200 },
      { month: 'Feb', netProcurement: 1900, unitPrice: 176744, totalAmount: 335813600 },
      { month: 'Mar', netProcurement: 1700, unitPrice: 176744, totalAmount: 300464800 },
      { month: 'Apr', netProcurement: 1800, unitPrice: 176744, totalAmount: 318139200 },
      { month: 'May', netProcurement: 1900, unitPrice: 176744, totalAmount: 335813600 },
      { month: 'Jun', netProcurement: 1700, unitPrice: 176744, totalAmount: 300464800 },
      { month: 'Jul', netProcurement: 1800, unitPrice: 176744, totalAmount: 318139200 },
      { month: 'Aug', netProcurement: 1900, unitPrice: 176744, totalAmount: 335813600 },
      { month: 'Sep', netProcurement: 1700, unitPrice: 176744, totalAmount: 300464800 },
      { month: 'Oct', netProcurement: 1800, unitPrice: 176744, totalAmount: 318139200 },
      { month: 'Nov', netProcurement: 1900, unitPrice: 176744, totalAmount: 335813600 },
      { month: 'Dec', netProcurement: 1600, unitPrice: 176744, totalAmount: 282790400 }
    ]
  },
  'Gear Oil': {
    totalQuantity: 16000,
    unitPrice: 181250,
    totalAmount: 2900000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 1300, unitPrice: 181250, totalAmount: 235625000 },
      { month: 'Feb', netProcurement: 1400, unitPrice: 181250, totalAmount: 253750000 },
      { month: 'Mar', netProcurement: 1300, unitPrice: 181250, totalAmount: 235625000 },
      { month: 'Apr', netProcurement: 1400, unitPrice: 181250, totalAmount: 253750000 },
      { month: 'May', netProcurement: 1300, unitPrice: 181250, totalAmount: 235625000 },
      { month: 'Jun', netProcurement: 1400, unitPrice: 181250, totalAmount: 253750000 },
      { month: 'Jul', netProcurement: 1300, unitPrice: 181250, totalAmount: 235625000 },
      { month: 'Aug', netProcurement: 1400, unitPrice: 181250, totalAmount: 253750000 },
      { month: 'Sep', netProcurement: 1300, unitPrice: 181250, totalAmount: 235625000 },
      { month: 'Oct', netProcurement: 1400, unitPrice: 181250, totalAmount: 253750000 },
      { month: 'Nov', netProcurement: 1300, unitPrice: 181250, totalAmount: 235625000 },
      { month: 'Dec', netProcurement: 1200, unitPrice: 181250, totalAmount: 217500000 }
    ]
  },
  'Circuit Breakers': {
    totalQuantity: 140,
    unitPrice: 46428571,
    totalAmount: 6500000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 12, unitPrice: 46428571, totalAmount: 557142852 },
      { month: 'Feb', netProcurement: 11, unitPrice: 46428571, totalAmount: 510714281 },
      { month: 'Mar', netProcurement: 12, unitPrice: 46428571, totalAmount: 557142852 },
      { month: 'Apr', netProcurement: 12, unitPrice: 46428571, totalAmount: 557142852 },
      { month: 'May', netProcurement: 11, unitPrice: 46428571, totalAmount: 510714281 },
      { month: 'Jun', netProcurement: 12, unitPrice: 46428571, totalAmount: 557142852 },
      { month: 'Jul', netProcurement: 12, unitPrice: 46428571, totalAmount: 557142852 },
      { month: 'Aug', netProcurement: 11, unitPrice: 46428571, totalAmount: 510714281 },
      { month: 'Sep', netProcurement: 12, unitPrice: 46428571, totalAmount: 557142852 },
      { month: 'Oct', netProcurement: 12, unitPrice: 46428571, totalAmount: 557142852 },
      { month: 'Nov', netProcurement: 11, unitPrice: 46428571, totalAmount: 510714281 },
      { month: 'Dec', netProcurement: 12, unitPrice: 46428571, totalAmount: 557142852 }
    ]
  },
  'Transformers': {
    totalQuantity: 30,
    unitPrice: 273333333,
    totalAmount: 8200000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 3, unitPrice: 273333333, totalAmount: 819999999 },
      { month: 'Feb', netProcurement: 2, unitPrice: 273333333, totalAmount: 546666666 },
      { month: 'Mar', netProcurement: 3, unitPrice: 273333333, totalAmount: 819999999 },
      { month: 'Apr', netProcurement: 2, unitPrice: 273333333, totalAmount: 546666666 },
      { month: 'May', netProcurement: 3, unitPrice: 273333333, totalAmount: 819999999 },
      { month: 'Jun', netProcurement: 2, unitPrice: 273333333, totalAmount: 546666666 },
      { month: 'Jul', netProcurement: 3, unitPrice: 273333333, totalAmount: 819999999 },
      { month: 'Aug', netProcurement: 2, unitPrice: 273333333, totalAmount: 546666666 },
      { month: 'Sep', netProcurement: 3, unitPrice: 273333333, totalAmount: 819999999 },
      { month: 'Oct', netProcurement: 2, unitPrice: 273333333, totalAmount: 546666666 },
      { month: 'Nov', netProcurement: 3, unitPrice: 273333333, totalAmount: 819999999 },
      { month: 'Dec', netProcurement: 2, unitPrice: 273333333, totalAmount: 546666666 }
    ]
  },
  'Power Cables': {
    totalQuantity: 43500,
    unitPrice: 94252,
    totalAmount: 4100000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 3600, unitPrice: 94252, totalAmount: 339307200 },
      { month: 'Feb', netProcurement: 3700, unitPrice: 94252, totalAmount: 348732400 },
      { month: 'Mar', netProcurement: 3600, unitPrice: 94252, totalAmount: 339307200 },
      { month: 'Apr', netProcurement: 3700, unitPrice: 94252, totalAmount: 348732400 },
      { month: 'May', netProcurement: 3600, unitPrice: 94252, totalAmount: 339307200 },
      { month: 'Jun', netProcurement: 3700, unitPrice: 94252, totalAmount: 348732400 },
      { month: 'Jul', netProcurement: 3600, unitPrice: 94252, totalAmount: 339307200 },
      { month: 'Aug', netProcurement: 3700, unitPrice: 94252, totalAmount: 348732400 },
      { month: 'Sep', netProcurement: 3500, unitPrice: 94252, totalAmount: 329882000 },
      { month: 'Oct', netProcurement: 3700, unitPrice: 94252, totalAmount: 348732400 },
      { month: 'Nov', netProcurement: 3600, unitPrice: 94252, totalAmount: 339307200 },
      { month: 'Dec', netProcurement: 3400, unitPrice: 94252, totalAmount: 320456800 }
    ]
  }
};

export const formatBudget = (value: number): string => {
  return `Rp ${value.toLocaleString('id-ID')}`;
};

export const formatUnits = (value: number): string => {
  return `${value.toLocaleString('id-ID')} total units`;
};

export const getProcurementSummary = () => {
  const totalCategories = categorySummaries.length;
  const totalItems = procurementRequests.length;
  const totalValue = categorySummaries.reduce((sum, cat) => sum + cat.totalValue, 0);

  return {
    totalCategories,
    totalItems,
    totalValue,
    message: `Retrieved ${totalItems} procurement requests grouped into ${totalCategories} material categories.`
  };
};

export const getCategoryByName = (categoryName: string): CategorySummary | undefined => {
  return categorySummaries.find(
    (cat) => cat.categoryName.toLowerCase() === categoryName.toLowerCase()
  );
};

export const getItemsByCategory = (categoryName: string): ProcurementRequestItem[] => {
  return procurementRequests.filter(
    (item) => item.category.toLowerCase() === categoryName.toLowerCase()
  );
};

export const getAllItems = (): ProcurementRequestItem[] => {
  return procurementRequests;
};

export const getMaterialMonthlyData = (materialName: string): MaterialProcurementData | undefined => {
  return materialProcurementData[materialName];
};
