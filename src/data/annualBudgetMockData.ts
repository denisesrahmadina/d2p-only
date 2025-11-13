export interface AnnualBudgetData {
  totalBudget: number;
  totalUnits: number;
  currency: string;
}

export const annualBudgetMockData: AnnualBudgetData = {
  totalBudget: 49505400000000,
  totalUnits: 4268600,
  currency: 'IDR'
};

export const formatBudget = (value: number): string => {
  return `Rp ${value.toLocaleString('id-ID')}`;
};

export const formatUnits = (value: number): string => {
  return `${value.toLocaleString('id-ID')} total units`;
};
