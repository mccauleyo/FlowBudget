import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  createEmptyBudget,
  recomputeMonthlyRemaining,
  recomputeSafeToSpend,
  type BudgetCategory,
  type BudgetData,
  type BudgetGoal,
  type BudgetTransaction,
} from "@/lib/budget-types";
import { useAuth } from "@/hooks/use-auth";

type BudgetContextValue = {
  budget: BudgetData;
  isEmpty: boolean;
  hydrated: boolean;
  setDailyFlow: (dailyBudget: number, daysUntilPayday: number) => void;
  setMonthly: (patch: Partial<BudgetData["monthly"]>) => void;
  addCategory: (category: Omit<BudgetCategory, "id">) => void;
  addGoal: (goal: Omit<BudgetGoal, "id">) => void;
  addTransaction: (transaction: Omit<BudgetTransaction, "id">) => void;
};

const BudgetContext = createContext<BudgetContextValue | null>(null);

function storageKey(userId: string) {
  return `flowbudget:data:${userId}`;
}

function loadBudget(userId: string): BudgetData {
  if (typeof window === "undefined") {
    return createEmptyBudget();
  }
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) {
      return createEmptyBudget();
    }
    return { ...createEmptyBudget(), ...JSON.parse(raw) } as BudgetData;
  } catch {
    return createEmptyBudget();
  }
}

function saveBudget(userId: string, budget: BudgetData) {
  localStorage.setItem(storageKey(userId), JSON.stringify(budget));
}

function isBudgetEmpty(budget: BudgetData) {
  return (
    budget.dailyBudget === 0 &&
    budget.daysUntilPayday === 0 &&
    budget.monthly.income === 0 &&
    budget.monthly.bills === 0 &&
    budget.monthly.savings === 0 &&
    budget.categories.length === 0 &&
    budget.goals.length === 0 &&
    budget.transactions.length === 0
  );
}

export function BudgetProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? "guest";
  const [budget, setBudget] = useState<BudgetData>(createEmptyBudget);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBudget(loadBudget(userId));
    setHydrated(true);
  }, [userId]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    saveBudget(userId, budget);
  }, [budget, hydrated, userId]);

  const setDailyFlow = useCallback((dailyBudget: number, daysUntilPayday: number) => {
    setBudget((prev) => {
      const safeToSpend = recomputeSafeToSpend(dailyBudget, daysUntilPayday);
      return { ...prev, dailyBudget, daysUntilPayday, safeToSpend };
    });
  }, []);

  const setMonthly = useCallback((patch: Partial<BudgetData["monthly"]>) => {
    setBudget((prev) => {
      const monthly = { ...prev.monthly, ...patch };
      monthly.remaining = recomputeMonthlyRemaining(monthly);
      return { ...prev, monthly };
    });
  }, []);

  const addCategory = useCallback((category: Omit<BudgetCategory, "id">) => {
    setBudget((prev) => ({
      ...prev,
      categories: [...prev.categories, { ...category, id: crypto.randomUUID() }],
    }));
  }, []);

  const addGoal = useCallback((goal: Omit<BudgetGoal, "id">) => {
    setBudget((prev) => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: crypto.randomUUID() }],
    }));
  }, []);

  const addTransaction = useCallback((transaction: Omit<BudgetTransaction, "id">) => {
    setBudget((prev) => {
      const nextId = prev.transactions.reduce((max, t) => Math.max(max, t.id), 0) + 1;
      return {
        ...prev,
        transactions: [{ ...transaction, id: nextId }, ...prev.transactions],
      };
    });
  }, []);

  const value = useMemo<BudgetContextValue>(
    () => ({
      budget,
      isEmpty: isBudgetEmpty(budget),
      hydrated,
      setDailyFlow,
      setMonthly,
      addCategory,
      addGoal,
      addTransaction,
    }),
    [budget, hydrated, setDailyFlow, setMonthly, addCategory, addGoal, addTransaction],
  );

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within BudgetProvider");
  }
  return context;
}
