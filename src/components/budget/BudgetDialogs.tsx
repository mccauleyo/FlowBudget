import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBudget } from "@/hooks/use-budget";

type DialogKind = "daily" | "monthly" | "category" | "goal" | "transaction" | null;

type BudgetDialogsProps = {
  open: DialogKind;
  onOpenChange: (open: DialogKind) => void;
};

export function BudgetDialogs({ open, onOpenChange }: BudgetDialogsProps) {
  const { setDailyFlow, setMonthly, addCategory, addGoal, addTransaction } = useBudget();

  return (
    <>
      <DailyFlowDialog
        open={open === "daily"}
        onOpenChange={(v) => onOpenChange(v ? "daily" : null)}
        onSave={setDailyFlow}
      />
      <MonthlyDialog
        open={open === "monthly"}
        onOpenChange={(v) => onOpenChange(v ? "monthly" : null)}
        onSave={setMonthly}
      />
      <CategoryDialog
        open={open === "category"}
        onOpenChange={(v) => onOpenChange(v ? "category" : null)}
        onSave={addCategory}
      />
      <GoalDialog
        open={open === "goal"}
        onOpenChange={(v) => onOpenChange(v ? "goal" : null)}
        onSave={addGoal}
      />
      <TransactionDialog
        open={open === "transaction"}
        onOpenChange={(v) => onOpenChange(v ? "transaction" : null)}
        onSave={addTransaction}
      />
    </>
  );
}

function parseNumber(value: string) {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function DailyFlowDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (dailyBudget: number, daysUntilPayday: number) => void;
}) {
  const [dailyBudget, setDailyBudget] = useState("");
  const [daysUntilPayday, setDaysUntilPayday] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave(parseNumber(dailyBudget), Math.round(parseNumber(daysUntilPayday)));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-border/60 sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Daily spending plan</DialogTitle>
            <DialogDescription>
              Set how much you can spend per day and when your next paycheck arrives.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="daily-budget">Daily budget ($)</Label>
              <Input id="daily-budget" type="number" min="0" step="0.01" required value={dailyBudget} onChange={(e) => setDailyBudget(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="days-payday">Days until payday</Label>
              <Input id="days-payday" type="number" min="1" step="1" required value={daysUntilPayday} onChange={(e) => setDaysUntilPayday(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MonthlyDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (patch: { income?: number; bills?: number; savings?: number }) => void;
}) {
  const [income, setIncome] = useState("");
  const [bills, setBills] = useState("");
  const [savings, setSavings] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave({
      income: parseNumber(income),
      bills: parseNumber(bills),
      savings: parseNumber(savings),
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-border/60 sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Monthly overview</DialogTitle>
            <DialogDescription>Add your income, bills, and savings target for this month.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="income">Income ($)</Label>
              <Input id="income" type="number" min="0" step="0.01" value={income} onChange={(e) => setIncome(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bills">Bills ($)</Label>
              <Input id="bills" type="number" min="0" step="0.01" value={bills} onChange={(e) => setBills(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="savings">Savings ($)</Label>
              <Input id="savings" type="number" min="0" step="0.01" value={savings} onChange={(e) => setSavings(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CategoryDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (category: { name: string; spent: number; budget: number; color: string; icon: string }) => void;
}) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [spent, setSpent] = useState("0");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave({
      name: name.trim(),
      spent: parseNumber(spent),
      budget: parseNumber(budget),
      color: "var(--color-primary)",
      icon: "Wallet",
    });
    setName("");
    setBudget("");
    setSpent("0");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-border/60 sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add category</DialogTitle>
            <DialogDescription>Track spending against a monthly limit.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cat-name">Name</Label>
              <Input id="cat-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cat-budget">Monthly budget ($)</Label>
              <Input id="cat-budget" type="number" min="0" step="0.01" required value={budget} onChange={(e) => setBudget(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cat-spent">Spent so far ($)</Label>
              <Input id="cat-spent" type="number" min="0" step="0.01" value={spent} onChange={(e) => setSpent(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add category</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function GoalDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (goal: { name: string; current: number; target: number; eta: string }) => void;
}) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("0");
  const [eta, setEta] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave({
      name: name.trim(),
      current: parseNumber(current),
      target: parseNumber(target),
      eta: eta.trim() || "—",
    });
    setName("");
    setTarget("");
    setCurrent("0");
    setEta("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-border/60 sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add savings goal</DialogTitle>
            <DialogDescription>Track progress toward something you're saving for.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="goal-name">Goal name</Label>
              <Input id="goal-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goal-target">Target ($)</Label>
              <Input id="goal-target" type="number" min="0" step="0.01" required value={target} onChange={(e) => setTarget(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goal-current">Saved so far ($)</Label>
              <Input id="goal-current" type="number" min="0" step="0.01" value={current} onChange={(e) => setCurrent(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goal-eta">Target date (optional)</Label>
              <Input id="goal-eta" placeholder="e.g. Dec 2026" value={eta} onChange={(e) => setEta(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TransactionDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (transaction: { name: string; category: string; amount: number; date: string; icon: string }) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [isIncome, setIsIncome] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = parseNumber(amount);
    onSave({
      name: name.trim(),
      category: category.trim() || "Other",
      amount: isIncome ? Math.abs(value) : -Math.abs(value),
      date: "Today",
      icon: isIncome ? "ArrowDownLeft" : "ShoppingBag",
    });
    setName("");
    setCategory("");
    setAmount("");
    setIsIncome(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-border/60 sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add transaction</DialogTitle>
            <DialogDescription>Log income or spending to keep your dashboard current.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tx-name">Description</Label>
              <Input id="tx-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tx-category">Category</Label>
              <Input id="tx-category" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tx-amount">Amount ($)</Label>
              <Input id="tx-amount" type="number" min="0" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isIncome} onChange={(e) => setIsIncome(e.target.checked)} />
              This is income
            </label>
          </div>
          <DialogFooter>
            <Button type="submit">Add transaction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export type { DialogKind };
