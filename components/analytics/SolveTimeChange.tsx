import { cn } from "@/lib/utils";

/**
 * Change in average solve time from the previous period.
 * Lower is better, so a drop is lime and a rise is red.
 * `percent` is 0 when either period has no solves.
 */
export default function SolveTimeChange({
  percent,
  numberOfSolved,
  previousLabel,
  className,
}: {
  percent: number;
  numberOfSolved: number;
  previousLabel: string;
  className?: string;
}) {
  if (numberOfSolved === 0) {
    return <span className={cn("text-muted-foreground", className)}>No solves in this period</span>;
  }

  const rounded = Math.round(percent);
  if (!Number.isFinite(percent) || rounded === 0) {
    return (
      <span className={cn("text-muted-foreground", className)}>
        No change vs {previousLabel}
      </span>
    );
  }

  const faster = rounded < 0;
  return (
    <span className={cn("text-muted-foreground", className)}>
      <span className={cn("font-mono", faster ? "text-primary" : "text-hard")}>
        {faster ? "↓" : "↑"} {Math.abs(rounded)}% {faster ? "faster" : "slower"}
      </span>{" "}
      vs {previousLabel}
    </span>
  );
}
