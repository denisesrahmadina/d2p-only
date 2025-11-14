export interface ProcurementRequestItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
}

export interface ProcurementRequestCategory {
  categoryName: string;
  itemsCount: number;
  totalValue: number;
  mostRequested: string;
  items: ProcurementRequestItem[];
}

export const retrieveProcurementRequestData: ProcurementRequestCategory[] = [
  {
    categoryName: 'Ash Handling Systems',
    itemsCount: 4,
    totalValue: 1300000000,
    mostRequested: 'Ash Conveyors (4)',
    items: [
      {
        itemName: 'Bottom Ash Removal Systems',
        quantity: 5,
        unitPrice: 740000000,
        totalValue: 3700000000
      },
      {
        itemName: 'Fly Ash Handling Equipment',
        quantity: 7,
        unitPrice: 600000000,
        totalValue: 4200000000
      },
      {
        itemName: 'Ash Conveyors',
        quantity: 21,
        unitPrice: 100000000,
        totalValue: 2100000000
      },
      {
        itemName: 'Ash Silos',
        quantity: 9,
        unitPrice: 200000000,
        totalValue: 1800000000
      }
    ]
  },
  {
  categoryName: 'Filters',
  itemsCount: 5,
  totalValue: 22088750000,
  mostRequested: 'Filter air (6)',
  items: [
    {
      itemName: 'Air Filter',
      quantity: 8000,
      unitPrice: 2500000,
      totalValue: 20000000000
    },
    {
      itemName: 'Fuel Filter',
      quantity: 25,
      unitPrice: 15750000,
      totalValue: 393750000
    },
    {
      itemName: 'Chemical Filter',
      quantity: 300,
      unitPrice: 285000,
      totalValue: 85500000
    },
    {
      itemName: 'Oil Filter',
      quantity: 120,
      unitPrice: 1850000,
      totalValue: 222000000
    },
    {
      itemName: 'Special Filter',
      quantity: 60,
      unitPrice: 4250000,
      totalValue: 255000000
    }
  ]
  },
  {
    categoryName: 'Lubricants & Fluids',
    itemsCount: 3,
    totalValue: 11900000000,
    mostRequested: 'Turbine Oil (4)',
    items: [
      {
        itemName: 'Turbine Oil',
        quantity: 37000,
        unitPrice: 140540,
        totalValue: 5200000000
      },
      {
        itemName: 'Hydraulic Oil',
        quantity: 21500,
        unitPrice: 176744,
        totalValue: 3800000000
      },
      {
        itemName: 'Gear Oil',
        quantity: 16000,
        unitPrice: 181250,
        totalValue: 2900000000
      }
    ]
  },
  {
    categoryName: 'Electrical Components',
    itemsCount: 3,
    totalValue: 26000000000,
    mostRequested: 'Circuit Breakers (4)',
    items: [
      {
        itemName: 'Circuit Breakers',
        quantity: 140,
        unitPrice: 46428571,
        totalValue: 6500000000
      },
      {
        itemName: 'Transformers',
        quantity: 30,
        unitPrice: 273333333,
        totalValue: 8200000000
      },
      {
        itemName: 'Power Cables',
        quantity: 43500,
        unitPrice: 94252,
        totalValue: 4100000000
      }
    ]
  }
];

export const getRetrieveProcurementRequestSummary = () => {
  const totalCategories = retrieveProcurementRequestData.length;
  const totalItems = retrieveProcurementRequestData.reduce(
    (sum, category) => sum + category.itemsCount,
    0
  );
  const totalValue = retrieveProcurementRequestData.reduce(
    (sum, category) => sum + category.totalValue,
    0
  );

  return {
    totalCategories,
    totalItems,
    totalValue,
    message: `Retrieved ${totalItems} procurement requests grouped into ${totalCategories} material categories.`
  };
};

export const getCategoryByName = (categoryName: string) => {
  return retrieveProcurementRequestData.find(
    (cat) => cat.categoryName.toLowerCase() === categoryName.toLowerCase()
  );
};

export const getAllItems = () => {
  return retrieveProcurementRequestData.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      category: category.categoryName
    }))
  );
};
