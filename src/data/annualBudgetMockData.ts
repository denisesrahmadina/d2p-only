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
  },
];

export const formatBudget = (value: number): string => {
  return `Rp ${value.toLocaleString('id-ID')}`;
};

export const formatUnits = (value: number): string => {
  return `${value.toLocaleString('id-ID')} total units`;
};
