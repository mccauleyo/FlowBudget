import { createFileRoute } from "@tanstack/react-router";

import { TopBar } from "@/components/flow/TopBar";
import { Transactions } from "@/components/flow/Transactions";

export const Route = createFileRoute("/_app/transactions")({
  head: () => ({
    meta: [{ title: "Transactions — FlowBudget" }],
  }),
  component: TransactionsPage,
});

function TransactionsPage() {
  return (
    <>
      <TopBar greeting="Transactions" subtitle="Your full income and spending history" />
      <div data-tour="page-transactions">
        <Transactions />
      </div>
    </>
  );
}
