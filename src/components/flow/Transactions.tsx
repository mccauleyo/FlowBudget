import { useState } from "react";
import {
  Search,
  Coffee,
  Car,
  ShoppingBag,
  Music,
  Film,
  Apple,
  ArrowDownLeft,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import { useBudget } from "@/hooks/use-budget";
import { useBudgetUi } from "@/hooks/use-budget-ui";
import { EmptySection } from "@/components/flow/EmptySection";
import { FlowCard } from "@/components/ui/flow-card";

const iconMap: Record<string, LucideIcon> = {
  Coffee,
  Car,
  ShoppingBag,
  Music,
  Film,
  Apple,
  ArrowDownLeft,
};

export function Transactions() {
  const [q, setQ] = useState("");
  const { budget } = useBudget();
  const { openDialog } = useBudgetUi();
  const transactions = budget.transactions;

  const list = transactions.filter(
    (t) =>
      t.name.toLowerCase().includes(q.toLowerCase()) ||
      t.category.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <FlowCard data-tour="transactions" className="rounded-[24px] p-6 md:p-7" delay={100} interactive={false}>
      <div className="flex items-center justify-between mb-5 gap-3">
        <h2 className="text-base font-semibold">Recent Transactions</h2>
        <div className="flex items-center gap-2">
          {transactions.length > 0 && (
            <button
              type="button"
              onClick={() => openDialog("transaction")}
              className="text-xs text-primary hover:underline shrink-0"
            >
              Add
            </button>
          )}
          <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5 w-44">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="bg-transparent outline-none text-xs w-full placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <EmptySection
          icon={<Receipt className="size-5" />}
          title="No transactions yet"
          description="Log income and spending as you go — your recent activity will show up here."
          actionLabel="Add transaction"
          onAction={() => openDialog("transaction")}
        />
      ) : (
        <div className="space-y-1">
          {list.map((t, i) => {
            const Icon = iconMap[t.icon] ?? ShoppingBag;
            const positive = t.amount > 0;
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[oklch(1_0_0_/_0.05)] transition-all animate-[fade-in_0.5s_ease-out_both]"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div
                  className={`size-10 rounded-xl flex items-center justify-center ${positive ? "bg-[oklch(0.78_0.16_155_/_0.15)] text-[var(--color-success)]" : "bg-[oklch(1_0_0_/_0.06)] text-foreground"}`}
                >
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.category} · {t.date}
                  </p>
                </div>
                <span
                  className={`text-sm font-medium tabular-nums shrink-0 ${positive ? "text-[var(--color-success)]" : "text-foreground"}`}
                >
                  {positive ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
                </span>
              </div>
            );
          })}
          {list.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No transactions match your search</p>
          )}
        </div>
      )}
    </FlowCard>
  );
}
