import { createFileRoute } from "@tanstack/react-router";
import { PieChart, TrendingUp, TrendingDown, Wallet } from "lucide-react";

import { TopBar } from "@/components/flow/TopBar";
import { useBudget } from "@/hooks/use-budget";
import { EmptySection } from "@/components/flow/EmptySection";
import { useBudgetUi } from "@/hooks/use-budget-ui";

export const Route = createFileRoute("/_app/insights")({
  head: () => ({
    meta: [{ title: "Insights — FlowBudget" }],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const { budget } = useBudget();
  const { openDialog } = useBudgetUi();
  const { monthly, categories, transactions } = budget;

  const hasData =
    monthly.income > 0 ||
    categories.length > 0 ||
    transactions.length > 0;

  const topCategory = [...categories].sort((a, b) => b.spent - a.spent)[0];
  const spendTotal = categories.reduce((s, c) => s + c.spent, 0);
  const recentSpend = transactions
    .filter((t) => t.amount < 0)
    .reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <>
      <TopBar greeting="Insights" subtitle="Patterns from the numbers you've entered" />
      <div data-tour="page-insights" className="space-y-5">
        {!hasData ? (
          <div className="glass rounded-[24px]">
            <EmptySection
              icon={<PieChart className="size-5" />}
              title="Insights appear as you add data"
              description="Log transactions and categories on the dashboard — this page will summarize your spending patterns."
              actionLabel="Add monthly overview"
              onAction={() => openDialog("monthly")}
            />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InsightCard
                icon={TrendingUp}
                label="Monthly income"
                value={`$${monthly.income.toLocaleString()}`}
                accent="oklch(0.78 0.16 155)"
              />
              <InsightCard
                icon={TrendingDown}
                label="Category spending"
                value={`$${spendTotal.toLocaleString()}`}
                accent="oklch(0.72 0.16 240)"
              />
              <InsightCard
                icon={Wallet}
                label="Remaining this month"
                value={`$${monthly.remaining.toLocaleString()}`}
                accent="oklch(0.7 0.2 290)"
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="glass rounded-[24px] p-6 md:p-7">
                <h2 className="text-base font-semibold mb-4">Top spending category</h2>
                {topCategory ? (
                  <div>
                    <p className="text-2xl font-semibold">{topCategory.name}</p>
                    <p className="text-sm text-muted-foreground mt-1 tabular-nums">
                      ${topCategory.spent} of ${topCategory.budget} budget
                    </p>
                    <div className="h-2 rounded-full bg-[oklch(1_0_0_/_0.06)] mt-4 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{
                          width: `${topCategory.budget > 0 ? Math.min(100, (topCategory.spent / topCategory.budget) * 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Add categories to see breakdowns.</p>
                )}
              </div>

              <div className="glass rounded-[24px] p-6 md:p-7">
                <h2 className="text-base font-semibold mb-4">Recent activity</h2>
                <p className="text-3xl font-semibold tabular-nums">${recentSpend.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Total logged expenses in your transaction list
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function InsightCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof PieChart;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="glass rounded-[22px] p-5 animate-[fade-in_0.5s_ease-out]">
      <div
        className="size-9 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `color-mix(in oklab, ${accent} 18%, transparent)`, color: accent }}
      >
        <Icon className="size-4" />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tabular-nums mt-1">{value}</p>
    </div>
  );
}
