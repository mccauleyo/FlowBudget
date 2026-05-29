import { useCountUp } from "@/hooks/use-count-up";
import { useBudget } from "@/hooks/use-budget";
import { useBudgetUi } from "@/hooks/use-budget-ui";
import { TrendingUp, Calendar, Wallet } from "lucide-react";
import { EmptySection } from "@/components/flow/EmptySection";
import { FlowCard } from "@/components/ui/flow-card";

export function HeroSpendCard() {
  const { budget } = useBudget();
  const { openDialog } = useBudgetUi();
  const { safeToSpend, dailyBudget, daysUntilPayday } = budget;
  const hasPlan = dailyBudget > 0 && daysUntilPayday > 0;
  const value = useCountUp(safeToSpend, 1400);

  if (!hasPlan) {
    return (
      <FlowCard data-tour="hero" strong className="relative rounded-[28px] p-8 md:p-10 overflow-hidden" delay={20} interactive={false}>
        <EmptySection
          icon={<Wallet className="size-5" />}
          title="No daily budget yet"
          description="Set how much you can spend each day and when payday is — we'll show your safe-to-spend amount here."
          actionLabel="Set daily budget"
          onAction={() => openDialog("daily")}
        />
      </FlowCard>
    );
  }

  const pct = dailyBudget > 0 ? Math.min(1, safeToSpend / dailyBudget) : 0;
  const r = 96;
  const c = 2 * Math.PI * r;
  const offset = c - c * pct;

  return (
    <FlowCard
      data-tour="hero"
      strong
      className="relative rounded-[28px] p-8 md:p-10 overflow-hidden group"
      delay={20}
      interactive
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-32 -left-20 size-80 rounded-full bg-[oklch(0.7_0.18_240_/_0.25)] blur-3xl" />
        <div className="absolute -bottom-32 -right-10 size-80 rounded-full bg-[oklch(0.65_0.2_300_/_0.2)] blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      <div className="relative flex flex-col md:flex-row items-center gap-10">
        <div className="relative shrink-0">
          <svg width="220" height="220" viewBox="0 0 220 220" className="-rotate-90">
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.78 0.16 200)" />
                <stop offset="100%" stopColor="oklch(0.7 0.2 280)" />
              </linearGradient>
            </defs>
            <circle cx="110" cy="110" r={r} stroke="oklch(1 0 0 / 0.07)" strokeWidth="14" fill="none" />
            <circle
              cx="110"
              cy="110"
              r={r}
              stroke="url(#ringGrad)"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">Today</span>
            <span className="text-4xl font-semibold tabular-nums">{Math.round(pct * 100)}%</span>
            <span className="text-xs text-muted-foreground mt-1">of daily budget</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Safe to spend today</p>
          <div className="mt-3 flex items-baseline gap-1 justify-center md:justify-start">
            <span className="text-2xl font-medium text-muted-foreground">$</span>
            <span className="text-6xl md:text-7xl font-semibold tabular-nums tracking-tight">
              {value.toFixed(2)}
            </span>
          </div>
          <p className="text-muted-foreground mt-3 max-w-md">
            Stay under this and you'll comfortably hit payday with savings intact.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
            <Pill icon={<TrendingUp className="size-3.5" />} label={`Daily budget $${dailyBudget}`} />
            <Pill icon={<Calendar className="size-3.5" />} label={`${daysUntilPayday} days to payday`} />
          </div>
        </div>
      </div>
    </FlowCard>
  );
}

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs text-foreground/80">
      {icon}
      {label}
    </span>
  );
}
