import { ArrowDownLeft, Receipt, PiggyBank, Wallet } from "lucide-react";
import { useBudget } from "@/hooks/use-budget";
import { useBudgetUi } from "@/hooks/use-budget-ui";
import { EmptySection } from "@/components/flow/EmptySection";

export function MonthlyOverview() {
  const { budget } = useBudget();
  const { openDialog } = useBudgetUi();
  const m = budget.monthly;
  const hasData = m.income > 0 || m.bills > 0 || m.savings > 0;

  const items = [
    { label: "Income", value: m.income, icon: ArrowDownLeft, accent: "oklch(0.78 0.16 155)" },
    { label: "Bills", value: m.bills, icon: Receipt, accent: "oklch(0.72 0.16 240)" },
    { label: "Savings", value: m.savings, icon: PiggyBank, accent: "oklch(0.82 0.14 75)" },
    { label: "Remaining", value: m.remaining, icon: Wallet, accent: "oklch(0.7 0.2 290)" },
  ];

  if (!hasData) {
    return (
      <div data-tour="monthly" className="glass rounded-[22px]">
        <EmptySection
          icon={<Wallet className="size-5" />}
          title="No monthly numbers yet"
          description="Add your income, bills, and savings to see what's left this month."
          actionLabel="Add monthly overview"
          onAction={() => openDialog("monthly")}
        />
      </div>
    );
  }

  return (
    <div data-tour="monthly" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it, i) => (
        <div
          key={it.label}
          className="flow-card glass rounded-[22px] p-5 flow-card-interactive"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div
            className="size-9 rounded-xl flex items-center justify-center mb-4"
            style={{ background: `color-mix(in oklab, ${it.accent} 18%, transparent)`, color: it.accent }}
          >
            <it.icon className="size-4" />
          </div>
          <p className="text-xs text-muted-foreground">{it.label}</p>
          <p className="text-2xl font-semibold tabular-nums mt-1">${it.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
