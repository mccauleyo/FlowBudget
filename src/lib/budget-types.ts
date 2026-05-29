export type BudgetCategory = {
  id: string;
  name: string;
  spent: number;
  budget: number;
  color: string;
  icon: string;
};

export type BudgetGoal = {
  id: string;
  name: string;
  current: number;
  target: number;
  eta: string;
};

export type BudgetTransaction = {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
  icon: string;
};

export type ForecastPoint = {
  day: number;
  balance: number;
};

export type BudgetData = {
  safeToSpend: number;
  dailyBudget: number;
  daysUntilPayday: number;
  monthly: {
    income: number;
    bills: number;
    savings: number;
    remaining: number;
  };
  categories: BudgetCategory[];
  forecast: ForecastPoint[];
  goals: BudgetGoal[];
  transactions: BudgetTransaction[];
};

export function createEmptyBudget(): BudgetData {
  return {
    safeToSpend: 0,
    dailyBudget: 0,
    daysUntilPayday: 0,
    monthly: {
      income: 0,
      bills: 0,
      savings: 0,
      remaining: 0,
    },
    categories: [],
    forecast: [],
    goals: [],
    transactions: [],
  };
}

export function recomputeMonthlyRemaining(monthly: BudgetData["monthly"]) {
  return Math.max(0, monthly.income - monthly.bills - monthly.savings);
}

export function recomputeSafeToSpend(dailyBudget: number, daysUntilPayday: number) {
  if (dailyBudget <= 0 || daysUntilPayday <= 0) {
    return 0;
  }
  return dailyBudget;
}
