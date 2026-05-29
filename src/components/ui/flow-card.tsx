import type { HTMLAttributes, ReactNode } from "react";

import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";

type FlowCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Stagger delay in ms for entrance animation */
  delay?: number;
  strong?: boolean;
  interactive?: boolean;
};

export function FlowCard({
  children,
  className,
  delay = 0,
  strong = false,
  interactive = true,
  onClick,
  ...props
}: FlowCardProps) {
  const { play } = useSound();

  return (
    <div
      className={cn(
        "flow-card",
        strong ? "glass-strong" : "glass",
        interactive && "flow-card-interactive",
        className,
      )}
      style={{ animationDelay: delay ? `${delay}ms` : undefined }}
      onClick={(e) => {
        if (interactive && onClick) {
          play("tap");
        }
        onClick?.(e);
      }}
      {...props}
    >
      <div className="flow-card-shine pointer-events-none" aria-hidden />
      {children}
    </div>
  );
}
