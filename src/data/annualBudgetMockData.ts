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
    name: 'Ash Handling Systems',
    value: 13800000000,
    percentage: 17
  },
  {
    name: 'Filters',
    value: 29400000000,
    percentage: 97
  },
  {
    name: 'Electrical Components',
    value: 740000000000,
    percentage: 1.5
  }
];

export const formatBudget = (value: number): string => {
  return `Rp ${value.toLocaleString('id-ID')}`;
};

export const formatUnits = (value: number): string => {
  return `${value.toLocaleString('id-ID')} total units`;
};
