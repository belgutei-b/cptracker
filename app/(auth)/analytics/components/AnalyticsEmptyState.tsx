import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function AnalyticsEmptyState({ children, className }: Props) {
  return (
    <div
      className={cn(
        "flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
