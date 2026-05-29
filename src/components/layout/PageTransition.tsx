import { useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { useSound } from "@/hooks/use-sound";
import { useTour } from "@/hooks/use-tour";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { play } = useSound();
  const { isActive: tourActive } = useTour();

  useEffect(() => {
    if (!tourActive) {
      play("whoosh");
    } else {
      play("navigate");
    }
  }, [pathname, play, tourActive]);

  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
