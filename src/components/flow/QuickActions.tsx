import { Plus, Wallet, Receipt, Target, PieChart } from "lucide-react";

import { useBudgetUi } from "@/hooks/use-budget-ui";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";

const actions = [
  { id: "transaction" as const, label: "Add expense", icon: Receipt, accent: "var(--color-danger)" },
  { id: "transaction" as const, label: "Add income", icon: Plus, accent: "var(--color-success)", income: true },
  { id: "daily" as const, label: "Daily budget", icon: Wallet, accent: "var(--color-primary)" },
  { id: "goal" as const, label: "New goal", icon: Target, accent: "oklch(0.7 0.2 290)" },
  { id: "monthly" as const, label: "Monthly", icon: PieChart, accent: "var(--color-warning)" },
];

export function QuickActions() {
  const { openDialog } = useBudgetUi();
  const { play } = useSound();

  return (
    <div className="mb-6 -mx-1 overflow-x-auto pb-1 scrollbar-none">
      <div className="flex gap-2 px-1 min-w-min">
        {actions.map((action, i) => (
          <button
            key={`${action.label}-${i}`}
            type="button"
            onClick={() => {
              play("tap");
              openDialog(action.id);
            }}
            className={cn(
              "quick-action-pill group flex items-center gap-2.5 shrink-0",
              "rounded-full pl-3 pr-4 py-2.5 glass",
              "transition-all duration-300 ease-out",
              "hover:-translate-y-0.5 hover:bg-[oklch(1_0_0_/_0.1)] active:scale-[0.98]",
            )}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span
              className="size-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{
                background: `color-mix(in oklab, ${action.accent} 22%, transparent)`,
                color: action.accent,
              }}
            >
              <action.icon className="size-4" />
            </span>
            <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
