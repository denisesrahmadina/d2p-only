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
    totalValue: 13800000000,
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
    totalValue: 29400000000,
    mostRequested: 'Filter air (4)',
    items: [
      {
        itemName: 'Filter air',
        quantity: 8000,
        unitPrice: 2500000,
        totalValue: 20000000000
      },
      {
        itemName: 'Filter Udara Cartridge',
        quantity: 1060,
        unitPrice: 3301887,
        totalValue: 3500000000
      },
      {
        itemName: 'Oil Filter',
        quantity: 1320,
        unitPrice: 1439393,
        totalValue: 1900000000
      },
      {
        itemName: 'Filter Gas',
        quantity: 790,
        unitPrice: 3037974,
        totalValue: 2400000000
      },
      {
        itemName: 'Filter Udara Kassa',
        quantity: 1290,
        unitPrice: 1240310,
        totalValue: 1600000000
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
    totalValue: 18800000000,
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
