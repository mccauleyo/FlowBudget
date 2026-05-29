import { Link, useRouterState } from "@tanstack/react-router";

import { APP_NAV_ITEMS } from "@/lib/nav-items";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";

const MOBILE_ITEMS = APP_NAV_ITEMS.filter((item) =>
  ["/dashboard", "/insights", "/goals", "/transactions"].includes(item.to),
).map((item) => ({
  ...item,
  label: item.shortLabel ?? item.label,
}));

export function MobileDock() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { play } = useSound();

  return (
    <div
      data-tour="mobile-dock"
      className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-30 glass-strong rounded-full px-2 py-2 flex items-center gap-1 shadow-[0_12px_40px_-8px_oklch(0_0_0_/_0.5)]"
    >
      {MOBILE_ITEMS.map((it) => {
        const active = pathname === it.to;
        return (
          <Link
            key={it.to}
            to={it.to}
            title={it.label}
            onClick={() => play("navigate")}
            className={cn(
              "relative size-12 rounded-full flex flex-col items-center justify-center transition-all duration-300",
              active
                ? "bg-[oklch(1_0_0_/_0.14)] text-foreground scale-105"
                : "text-muted-foreground hover:text-foreground active:scale-95",
            )}
          >
            <it.icon className={cn("size-5 transition-transform", active && "scale-110")} />
            {active && (
              <span className="absolute -bottom-0.5 size-1 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
