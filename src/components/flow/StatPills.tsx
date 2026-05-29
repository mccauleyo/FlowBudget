import { Calendar, TrendingUp, Wallet } from "lucide-react";

import { useBudget } from "@/hooks/use-budget";

export function StatPills() {
  const { budget } = useBudget();
  const { dailyBudget, daysUntilPayday, monthly } = budget;

  if (dailyBudget <= 0 && monthly.remaining <= 0) {
    return null;
  }

  const pills = [
    dailyBudget > 0 && {
      icon: TrendingUp,
      label: `$${dailyBudget}/day`,
    },
    daysUntilPayday > 0 && {
      icon: Calendar,
      label: `${daysUntilPayday}d to payday`,
    },
    monthly.remaining > 0 && {
      icon: Wallet,
      label: `$${monthly.remaining.toLocaleString()} left`,
    },
  ].filter(Boolean) as { icon: typeof Wallet; label: string }[];

  if (pills.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {pills.map((pill) => (
        <span
          key={pill.label}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-medium text-foreground/90 stat-pill-enter"
        >
          <pill.icon className="size-3.5 text-primary" />
          {pill.label}
        </span>
      ))}
    </div>
  );
}
