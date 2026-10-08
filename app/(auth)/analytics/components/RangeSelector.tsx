import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ANALYTICS_RANGE_OPTIONS,
  type AnalyticsRangeDays,
} from "@/constants/analytics";

/** segmented control; the range lives in the URL (?range=7) */
export default function RangeSelector({ current }: { current: AnalyticsRangeDays }) {
  return (
    <nav aria-label="Time range" className="inline-flex self-start rounded-lg bg-muted p-[3px] sm:self-auto">
      {ANALYTICS_RANGE_OPTIONS.map((range) => {
        const isActive = range === current;
        return (
          <Link
            key={range}
            href={`/analytics?range=${range}`}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-md border px-3 py-1 text-[13px] font-medium transition-colors",
              isActive
                ? "border-input bg-input/30 text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {range} days
          </Link>
        );
      })}
    </nav>
  );
}
