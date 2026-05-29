import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FlowCard } from "@/components/ui/flow-card";
import { useBudget } from "@/hooks/use-budget";
import { useBudgetUi } from "@/hooks/use-budget-ui";

export function GetStartedBanner() {
  const { isEmpty } = useBudget();
  const { openDialog } = useBudgetUi();

  return (
    <FlowCard
      data-tour="get-started"
      strong
      className="rounded-[24px] p-6 md:p-8 mb-5"
      delay={0}
      interactive={false}
    >
      {isEmpty ? (
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-[oklch(0.72_0.16_240)] to-[oklch(0.6_0.2_290)] flex items-center justify-center shrink-0 shadow-lg">
            <Sparkles className="size-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold tracking-tight">Your budget starts here</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Nothing is pre-filled. Add your daily budget, monthly numbers, categories, and
              transactions to build a dashboard that reflects your real finances.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button type="button" className="rounded-full" onClick={() => openDialog("daily")}>
              Set daily budget
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => openDialog("monthly")}
            >
              Monthly overview
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Your budget is taking shape — keep adding details.</p>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={() => openDialog("daily")}>
              Edit daily plan
            </Button>
            <Button type="button" size="sm" className="rounded-full" onClick={() => openDialog("transaction")}>
              Add transaction
            </Button>
          </div>
        </div>
      )}
    </FlowCard>
  );
}
