import { createFileRoute } from "@tanstack/react-router";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/layout/AppShell";
import { ProductTour } from "@/components/tour/ProductTour";
import { BudgetProvider } from "@/hooks/use-budget";
import { BudgetUiProvider } from "@/hooks/use-budget-ui";
import { TourProvider } from "@/hooks/use-tour";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <RequireAuth>
      <BudgetProvider>
        <BudgetUiProvider>
          <TourProvider autoStart>
            <AppShell />
            <ProductTour />
          </TourProvider>
        </BudgetUiProvider>
      </BudgetProvider>
    </RequireAuth>
  );
}
