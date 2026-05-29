import { useBudget } from "@/hooks/use-budget";
import { useBudgetUi } from "@/hooks/use-budget-ui";
import { EmptySection } from "@/components/flow/EmptySection";
import { FlowCard } from "@/components/ui/flow-card";
import { Plus, Target } from "lucide-react";

export function Goals() {
  const { budget } = useBudget();
  const { openDialog } = useBudgetUi();
  const goals = budget.goals;

  return (
    <FlowCard data-tour="goals" className="rounded-[24px] p-6 md:p-7" delay={120} interactive={false}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold">Savings Goals</h2>
        <button
          type="button"
          onClick={() => openDialog("goal")}
          className="size-8 rounded-full glass flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Add savings goal"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {goals.length === 0 ? (
        <EmptySection
          icon={<Target className="size-5" />}
          title="No savings goals yet"
          description="Add a goal like an emergency fund or vacation and track how close you are."
          actionLabel="Add goal"
          onAction={() => openDialog("goal")}
        />
      ) : (
        <div className="space-y-3">
          {goals.map((g) => {
            const pct = g.target > 0 ? Math.round((g.current / g.target) * 100) : 0;
            const r = 22;
            const c = 2 * Math.PI * r;
            const off = c - (c * pct) / 100;
            return (
              <div
                key={g.id}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[oklch(1_0_0_/_0.05)] transition-all cursor-pointer"
              >
                <div className="relative size-14 shrink-0">
                  <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
                    <circle cx="28" cy="28" r={r} stroke="oklch(1 0 0 / 0.08)" strokeWidth="4" fill="none" />
                    <circle
                      cx="28"
                      cy="28"
                      r={r}
                      stroke="oklch(0.72 0.16 240)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={c}
                      strokeDashoffset={off}
                      style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)" }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium tabular-nums">
                    {pct}%
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{g.name}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    ${g.current.toLocaleString()} of ${g.target.toLocaleString()}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{g.eta}</span>
              </div>
            );
          })}
        </div>
      )}
    </FlowCard>
  );
}
