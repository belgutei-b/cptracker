import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function AnalyticsTooltip({ children, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-popover px-3 py-2.5 text-xs text-popover-foreground shadow-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
