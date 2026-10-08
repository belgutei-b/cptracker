import { DifficultyText } from "@/components/problems/ProblemLabels";
import { cn } from "@/lib/utils";
import { DIFFICULTY_AVERAGES } from "@/components/landing/sample-data";

/** lower is better, so a drop in solve time is shown in lime */
function ChangeText({ change }: { change: number }) {
  return (
    <span className={cn("font-mono", change < 0 ? "text-primary" : "text-hard")}>
      {change < 0 ? "↓" : "↑"} {Math.abs(change)}%
    </span>
  );
}

/** average solve time per difficulty; `compact` hides the change */
export default function DifficultyAverages({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("grid grid-cols-3", compact ? "gap-2" : "gap-2 sm:gap-3")}>
      {DIFFICULTY_AVERAGES.map(({ difficulty, average, change }) => (
        <div
          key={difficulty}
          className={cn(
            "flex flex-col border",
            compact ? "gap-1 rounded-lg px-3 py-2.5" : "gap-2.5 rounded-xl px-3.5 py-4 sm:px-4.5",
          )}
        >
          <DifficultyText difficulty={difficulty} className={compact ? "text-xs" : "text-[13px]"} />
          <span
            className={cn(
              "font-mono leading-none font-medium tracking-tight",
              compact ? "text-xl" : "text-2xl sm:text-3xl",
            )}
          >
            {average}
          </span>
          {!compact && (
            <span className="text-[12.5px] text-muted-foreground">
              <ChangeText change={change} />
              <span className="hidden sm:inline"> vs previous week</span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
