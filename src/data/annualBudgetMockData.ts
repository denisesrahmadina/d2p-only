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
  totalBudget: 49505400000000,
  totalUnits: 4268600,
  currency: 'IDR'
};

export const categoryBudgetDistribution: CategoryBudgetData[] = [
  {
    name: 'Others',
    value: 48025400000000,
    percentage: 97
  },
  {
    name: 'Ash Handling Systems',
    value: 740000000000,
    percentage: 1.5
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
