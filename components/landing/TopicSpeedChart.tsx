import { cn } from "@/lib/utils";
import type { TopicSpeed } from "@/components/landing/sample-data";

// a topic this far from the average fills one side of the chart
const SCALE_PERCENT = 60;

function formatDifference(vsAverage: number, long: boolean) {
  const amount = Math.abs(vsAverage);
  if (long) return `${amount}% ${vsAverage < 0 ? "faster" : "slower"}`;
  return `${vsAverage < 0 ? "−" : "+"}${amount}%`;
}

/**
 * Topics compared with the overall average solve time:
 * faster topics grow left in lime, slower ones grow right in red.
 * `detailed` adds column headers and each topic's average.
 */
export default function TopicSpeedChart({
  topics,
  detailed = false,
}: {
  topics: TopicSpeed[];
  detailed?: boolean;
}) {
  const columns = detailed
    ? "grid-cols-[112px_minmax(0,1fr)_minmax(0,1fr)_56px] sm:grid-cols-[170px_minmax(0,1fr)_minmax(0,1fr)_70px_110px]"
    : "grid-cols-[140px_minmax(0,1fr)_minmax(0,1fr)_52px]";

  return (
    <div className={cn("flex flex-col", detailed ? "text-sm" : "text-[12.5px]")}>
      {detailed && (
        <div
          aria-hidden
          className={cn("grid border-b pb-1.5 text-xs text-muted-foreground", columns)}
        >
          <span>Topic</span>
          <span className="pr-2.5 text-right">faster</span>
          <span className="pl-2.5">slower</span>
          <span className="hidden text-right sm:block">avg</span>
          <span className="text-right">vs average</span>
        </div>
      )}

      <ul>
        {topics.map(({ topic, average, vsAverage }) => {
          const width = `${Math.min(Math.abs(vsAverage) / SCALE_PERCENT, 1) * 100}%`;
          const isFaster = vsAverage < 0;

          return (
            <li
              key={topic}
              className={cn("grid items-center", columns, detailed ? "h-9.5" : "h-6.5")}
            >
              <span className={cn("truncate", !detailed && "text-foreground/75")}>{topic}</span>
              <span aria-hidden className={cn("flex justify-end", detailed ? "h-3.5" : "h-2.5")}>
                {isFaster && <span className="rounded-l-[3px] bg-primary" style={{ width }} />}
              </span>
              <span aria-hidden className={cn("flex border-l border-foreground/20", detailed ? "h-3.5" : "h-2.5")}>
                {!isFaster && <span className="rounded-r-[3px] bg-hard" style={{ width }} />}
              </span>
              {detailed && (
                <span className="hidden text-right font-mono text-[13px] text-foreground/75 sm:block">
                  {average}
                </span>
              )}
              <span
                className={cn(
                  "text-right font-mono",
                  detailed ? "text-[13px]" : "text-xs",
                  isFaster ? "text-primary" : "text-hard",
                )}
              >
                {formatDifference(vsAverage, detailed)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
