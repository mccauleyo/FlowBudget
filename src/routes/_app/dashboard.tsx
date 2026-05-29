import { createFileRoute } from "@tanstack/react-router";

import { GetStartedBanner } from "@/components/flow/GetStartedBanner";
import { QuickActions } from "@/components/flow/QuickActions";
import { StatPills } from "@/components/flow/StatPills";
import { TopBar } from "@/components/flow/TopBar";
import { HeroSpendCard } from "@/components/flow/HeroSpendCard";
import { MonthlyOverview } from "@/components/flow/MonthlyOverview";
import { Categories } from "@/components/flow/Categories";
import { Forecast } from "@/components/flow/Forecast";
import { Goals } from "@/components/flow/Goals";
import { Transactions } from "@/components/flow/Transactions";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — FlowBudget" },
      {
        name: "description",
        content: "Your daily safe-to-spend, monthly overview, and spending forecast.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <>
      <TopBar />
      <StatPills />
      <QuickActions />
      <GetStartedBanner />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        <div className="xl:col-span-2 space-y-5">
          <HeroSpendCard />
          <MonthlyOverview />
          <Forecast />
        </div>
        <div className="space-y-5">
          <Categories />
          <Goals />
        </div>
      </div>
      <Transactions />
    </>
  );
}
