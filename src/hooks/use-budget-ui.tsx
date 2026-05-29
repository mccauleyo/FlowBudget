import { createContext, useContext, useState, type ReactNode } from "react";

import { BudgetDialogs, type DialogKind } from "@/components/budget/BudgetDialogs";

type BudgetUiContextValue = {
  openDialog: (kind: DialogKind) => void;
};

const BudgetUiContext = createContext<BudgetUiContextValue | null>(null);

export function BudgetUiProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<DialogKind>(null);

  return (
    <BudgetUiContext.Provider value={{ openDialog: setOpen }}>
      {children}
      <BudgetDialogs open={open} onOpenChange={setOpen} />
    </BudgetUiContext.Provider>
  );
}

export function useBudgetUi() {
  const context = useContext(BudgetUiContext);
  if (!context) {
    throw new Error("useBudgetUi must be used within BudgetUiProvider");
  }
  return context;
}

export type { DialogKind };
