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
    name: 'Ash Handling Systems',
    value: 11800000000,
    percentage: 1.39
  },
  {
    name: 'Electrical Components',
    value: 18800000000,
    percentage: 2.22
  },
  {
    name: 'Filters',
    value: 29400000000,
    percentage: 3.47
  },
  {
    name: 'Lubricants & Fluids',
    value: 11900000000,
    percentage: 1.4
  }
];

export const categorySummaries: CategorySummary[] = [
  {
    categoryName: 'Ash Handling Systems',
    itemsCount: 4,
    totalValue: 13800000000,
    mostRequested: 'Ash Conveyors'
  },
  {
    categoryName: 'Filters',
    itemsCount: 5,
    totalValue: 22088750000,
    mostRequested: 'Filter air'
  },
  {
    categoryName: 'Lubricants & Fluids',
    itemsCount: 3,
    totalValue: 11900000000,
    mostRequested: 'Turbine Oil'
  },
  {
    categoryName: 'Electrical Components',
    itemsCount: 3,
    totalValue: 26000000000,
    mostRequested: 'Circuit Breakers'
  }
];

export const procurementRequests: ProcurementRequestItem[] = [
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
    category: 'Lubricants & Fluids',
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
    category: 'Lubricants & Fluids',
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
    category: 'Lubricants & Fluids',
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
    category: 'Electrical Components',
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
    category: 'Electrical Components',
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
    category: 'Electrical Components',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '13000 meters' },
      { unit: 'UBP Paiton', quantity: '12000 meters' },
      { unit: 'PLTU Indramayu', quantity: '10000 meters' },
      { unit: 'PLTU Jawa Tengah', quantity: '8500 meters' }
    ],
    totalQuantity: '43500 meters'
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
