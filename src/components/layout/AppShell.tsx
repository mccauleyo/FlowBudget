import { Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { MobileDock } from "@/components/flow/MobileDock";
import { Sidebar } from "@/components/flow/Sidebar";
import { PageTransition } from "@/components/layout/PageTransition";

export function AppShell({ children }: { children?: ReactNode }) {
  return (
    <div className="group/app min-h-screen relative">
      <Sidebar />
      <MobileDock />
      <main className="lg:pl-28 group-hover/app:lg:pl-[13.5rem] px-5 md:px-8 py-6 md:py-8 pb-28 lg:pb-8 max-w-[1400px] mx-auto transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
        <PageTransition>{children ?? <Outlet />}</PageTransition>
        <p className="text-center text-xs text-muted-foreground mt-10">
          FlowBudget · Designed with calm in mind
        </p>
      </main>
    </div>
  );
}
