import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type EmptySectionProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function EmptySection({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptySectionProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
      {icon && (
        <div className="size-12 rounded-2xl glass flex items-center justify-center mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-2 max-w-xs leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button type="button" variant="outline" size="sm" className="mt-5 rounded-full" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
