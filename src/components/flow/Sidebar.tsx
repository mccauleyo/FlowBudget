import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { APP_NAV_ITEMS } from "@/lib/nav-items";
import { useAuth } from "@/hooks/use-auth";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";

function userInitials(email?: string | null, metadata?: Record<string, unknown>) {
  const fullName = metadata?.full_name;
  if (typeof fullName === "string" && fullName.trim()) {
    const parts = fullName.trim().split(/\s+/);
    return parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");
  }
  if (email) {
    return email[0]?.toUpperCase() ?? "?";
  }
  return "?";
}

export function Sidebar() {
  const { user } = useAuth();
  const { play } = useSound();
  const initials = userInitials(user?.email, user?.user_metadata);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        data-tour="sidebar"
        className="sidebar-rail hidden lg:flex fixed left-6 top-6 bottom-6 z-30 flex-col items-center justify-between glass-strong rounded-[28px] py-6 w-[72px] group-hover/app:w-[200px] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden"
      >
        <div className="flex flex-col items-stretch w-full px-3 gap-2">
          <Link
            to="/dashboard"
            onClick={() => play("navigate")}
            className="size-11 mx-auto group-hover/app:mx-0 rounded-2xl bg-gradient-to-br from-[oklch(0.72_0.16_240)] to-[oklch(0.6_0.2_290)] flex items-center justify-center shadow-lg hover:scale-105 transition-transform shrink-0"
          >
            <Sparkles className="size-5 text-white" />
          </Link>
          <div className="h-px w-8 mx-auto group-hover/app:w-full bg-border my-2 transition-all duration-500" />
          <nav className="flex flex-col gap-1.5 w-full">
            {APP_NAV_ITEMS.map((it) => {
              const active = pathname === it.to;
              return (
                <Tooltip key={it.to}>
                  <TooltipTrigger asChild>
                    <Link
                      to={it.to}
                      onClick={() => play("navigate")}
                      className={cn(
                        "relative flex items-center gap-3 h-11 rounded-2xl px-3 transition-all duration-300",
                        active
                          ? "nav-item-active text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-[oklch(1_0_0_/_0.06)]",
                      )}
                    >
                      <it.icon className="size-[18px] shrink-0 transition-transform duration-300 group-hover/app:scale-105" />
                      <span className="text-sm font-medium whitespace-nowrap opacity-0 -translate-x-2 group-hover/app:opacity-100 group-hover/app:translate-x-0 transition-all duration-400 max-w-0 group-hover/app:max-w-[120px] overflow-hidden">
                        {it.label}
                      </span>
                      {active && (
                        <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-primary" />
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="group-hover/app:hidden">
                    {it.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </div>
        <div className="size-10 mx-auto group-hover/app:ml-3 rounded-full bg-gradient-to-br from-[oklch(0.7_0.15_30)] to-[oklch(0.6_0.18_320)] flex items-center justify-center text-sm font-medium text-white shrink-0 transition-all duration-500">
          {initials}
        </div>
      </aside>
    </TooltipProvider>
  );
}
