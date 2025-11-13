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

export const annualBudgetMockData: AnnualBudgetData = {
  totalBudget: 1028398868000,
  totalUnits: 3234734,
  currency: 'IDR'
};

export const categoryBudgetDistribution: CategoryBudgetData[] = [
  {
    name: 'Fuel',
    value: 303000000000,
    percentage: 29.46
  },
  {
    name: 'Mechanical Equipment',
    value: 181800000000,
    percentage: 17.68
  },
  {
    name: 'Spare part and Maintenance',
    value: 145500000000,
    percentage: 14.15
  },
  {
    name: 'Electrical Equipment',
    value: 115200000000,
    percentage: 11.20
  },
  {
    name: 'Boiler and Pressure Vessel Equipment',
    value: 84850000000,
    percentage: 8.25
  },
  {
    name: 'Civil Works and Construction Materials',
    value: 54500000000,
    percentage: 5.30
  },
  {
    name: 'IT and Communication Systems',
    value: 38800000000,
    percentage: 3.77
  },
  {
    name: 'Instrumentation and Control System',
    value: 33950000000,
    percentage: 3.30
  },
  {
    name: 'Water Treatment System',
    value: 26650000000,
    percentage: 2.59
  },
  {
    name: 'Emission Control Systems',
    value: 21800000000,
    percentage: 2.12
  },
  {
    name: 'Safety and Environmental Equipment',
    value: 18200000000,
    percentage: 1.77
  },
  {
    name: 'Ash Handling System',
    value: 14300000000,
    percentage: 1.39
  },
  {
    name: 'Engineering and Design Materials',
    value: 10300000000,
    percentage: 1.00
  },
  {
    name: 'Renewable Energy Equipment',
    value: 8740000000,
    percentage: 0.85
  },
  {
    name: 'Consumables',
    value: 6070000000,
    percentage: 0.59
  }
];

export const formatBudget = (value: number): string => {
  return `Rp ${value.toLocaleString('id-ID')}`;
};

export const formatUnits = (value: number): string => {
  return `${value.toLocaleString('id-ID')} total units`;
};
