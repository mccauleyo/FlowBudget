import { useMemo } from "react";
import { TrendingDown, AlertTriangle, LineChart } from "lucide-react";
import { useBudget } from "@/hooks/use-budget";
import { useBudgetUi } from "@/hooks/use-budget-ui";
import { EmptySection } from "@/components/flow/EmptySection";
import { FlowCard } from "@/components/ui/flow-card";

export function Forecast() {
  const { budget } = useBudget();
  const { openDialog } = useBudgetUi();
  const data = budget.forecast;
  const daysUntilPayday = budget.daysUntilPayday;

  const chart = useMemo(() => {
    if (data.length < 2) {
      return null;
    }
    const w = 600,
      h = 180,
      pad = 8;
    const xs = data.map((_, i) => pad + (i * (w - pad * 2)) / (data.length - 1));
    const max = Math.max(...data.map((d) => d.balance));
    const min = Math.min(...data.map((d) => d.balance));
    const range = max - min || 1;
    const ys = data.map((d) => pad + (1 - (d.balance - min) / range) * (h - pad * 2));
    const pts = xs.map((x, i) => [x, ys[i]] as const);

    const seg = (i: number) => {
      if (i === 0) return `M ${pts[0][0]} ${pts[0][1]}`;
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const cx = (x0 + x1) / 2;
      return ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
    };
    const d = pts.map((_, i) => seg(i)).join("");
    const area = `${d} L ${pts.at(-1)![0]} ${h - pad} L ${pts[0][0]} ${h - pad} Z`;
    return { path: d, area, points: pts };
  }, [data]);

  const hasMonthly = budget.monthly.income > 0 || budget.monthly.remaining > 0;
  const projected = hasMonthly ? budget.monthly.remaining : 0;
  const overspending = projected < 500 && projected > 0;

  return (
    <FlowCard data-tour="forecast" className="rounded-[24px] p-6 md:p-7" delay={60} interactive={false}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold">Smart Forecast</h2>
          <p className="text-xs text-muted-foreground mt-1">Projected balance before payday</p>
        </div>
        {hasMonthly && (
          <div className="text-right">
            <p className="text-2xl font-semibold tabular-nums">${projected.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              {daysUntilPayday > 0 ? `in ${daysUntilPayday} days` : "add payday date"}
            </p>
          </div>
        )}
      </div>

      {!hasMonthly ? (
        <EmptySection
          icon={<LineChart className="size-5" />}
          title="Forecast unlocks with your numbers"
          description="Fill in your monthly overview and daily budget — we'll project your balance before payday."
          actionLabel="Add monthly overview"
          onAction={() => openDialog("monthly")}
        />
      ) : !chart ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Based on your monthly remaining of{" "}
          <span className="text-foreground font-medium tabular-nums">${projected.toLocaleString()}</span>
          {daysUntilPayday > 0 ? ` over the next ${daysUntilPayday} days.` : "."}
        </p>
      ) : (
        <div className="relative -mx-2">
          <svg viewBox="0 0 600 180" className="w-full h-[180px]" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.16 240 / 0.45)" />
                <stop offset="100%" stopColor="oklch(0.72 0.16 240 / 0)" />
              </linearGradient>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="oklch(0.78 0.16 200)" />
                <stop offset="100%" stopColor="oklch(0.7 0.2 290)" />
              </linearGradient>
            </defs>
            <path d={chart.area} fill="url(#areaGrad)" />
            <path d={chart.path} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" />
            {chart.points.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={i === chart.points.length - 1 ? 5 : 0}
                fill="white"
                stroke="oklch(0.7 0.2 290)"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
      )}

      {hasMonthly && (
        <div
          className={`mt-4 flex items-center gap-3 rounded-2xl p-3 ${overspending ? "bg-[oklch(0.7_0.2_22_/_0.12)]" : "bg-[oklch(0.78_0.16_155_/_0.1)]"}`}
        >
          {overspending ? (
            <AlertTriangle className="size-4 text-[var(--color-danger)]" />
          ) : (
            <TrendingDown className="size-4 text-[var(--color-success)]" />
          )}
          <p className="text-xs text-foreground/80">
            {projected === 0
              ? "Add income and expenses to see how you're tracking this month."
              : overspending
                ? "Your remaining buffer is getting tight. Review categories or trim spending."
                : "You're on track based on the monthly numbers you've entered."}
          </p>
        </div>
      )}
    </FlowCard>
  );
}
