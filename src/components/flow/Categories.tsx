import {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Repeat,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useBudget } from "@/hooks/use-budget";
import { useBudgetUi } from "@/hooks/use-budget-ui";
import { EmptySection } from "@/components/flow/EmptySection";
import { FlowCard } from "@/components/ui/flow-card";

const iconMap: Record<string, LucideIcon> = {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Repeat,
  Wallet,
};

export function Categories() {
  const { budget } = useBudget();
  const { openDialog } = useBudgetUi();
  const categories = budget.categories;

  return (
    <FlowCard data-tour="categories" className="rounded-[24px] p-6 md:p-7" delay={80} interactive={false}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold">Spending Categories</h2>
        {categories.length > 0 && (
          <button
            type="button"
            onClick={() => openDialog("category")}
            className="text-xs text-primary hover:underline"
          >
            Add
          </button>
        )}
      </div>

      {categories.length === 0 ? (
        <EmptySection
          icon={<Wallet className="size-5" />}
          title="No categories yet"
          description="Create categories like Food or Transport and set a monthly budget for each."
          actionLabel="Add category"
          onAction={() => openDialog("category")}
        />
      ) : (
        <div className="space-y-4">
          {categories.map((c) => {
            const pct = c.budget > 0 ? Math.min(100, (c.spent / c.budget) * 100) : 0;
            const over = c.budget > 0 && c.spent / c.budget > 0.92;
            const warn = c.budget > 0 && c.spent / c.budget > 0.75 && !over;
            const color = over ? "var(--color-danger)" : warn ? "var(--color-warning)" : "var(--color-success)";
            const Icon = iconMap[c.icon] ?? Wallet;
            return (
              <div key={c.id} className="group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-xl glass flex items-center justify-center">
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 flex items-baseline justify-between">
                    <span className="text-sm font-medium">{c.name}</span>
                    <span className="text-sm tabular-nums text-muted-foreground">
                      <span className="text-foreground">${c.spent}</span> / ${c.budget}
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-[oklch(1_0_0_/_0.06)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${color}, color-mix(in oklab, ${color} 60%, white))`,
                      boxShadow: `0 0 16px color-mix(in oklab, ${color} 50%, transparent)`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </FlowCard>
  );
}
