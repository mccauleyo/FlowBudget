import { createFileRoute } from "@tanstack/react-router";

import { TopBar } from "@/components/flow/TopBar";
import { Goals } from "@/components/flow/Goals";

export const Route = createFileRoute("/_app/goals")({
  head: () => ({
    meta: [{ title: "Goals — FlowBudget" }],
  }),
  component: GoalsPage,
});

function GoalsPage() {
  return (
    <>
      <TopBar greeting="Savings goals" subtitle="Track progress toward what matters to you" />
      <div data-tour="page-goals" className="max-w-2xl">
        <Goals />
      </div>
    </>
  );
}
