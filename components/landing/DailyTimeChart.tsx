import { DAILY_TIME } from "@/components/landing/sample-data";
import { DIFFICULTIES, DIFFICULTY_DOT_CLASS } from "@/constants/difficulty";
import { cn } from "@/lib/utils";

// two hours fills the chart
const CHART_MAX_MINUTES = 120;

/** stacked bar per day: easy at the bottom, hard on top */
export default function DailyTimeChart() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Daily time</span>
        <div className="flex gap-3.5 text-[12.5px] text-muted-foreground">
          {DIFFICULTIES.map((difficulty) => (
            <span key={difficulty} className="flex items-center gap-1.5">
              <span className={cn("size-2 rounded-[2px]", DIFFICULTY_DOT_CLASS[difficulty])} />
              {difficulty}
            </span>
          ))}
        </div>
      </div>

      <div className="flex h-52 gap-3">
        <div
          aria-hidden
          className="flex w-6 flex-col justify-between pb-6 text-right font-mono text-[11px] text-muted-foreground"
        >
          <span>2h</span>
          <span>1h</span>
          <span>0</span>
        </div>

        <div className="grid flex-1 grid-cols-7 gap-2 sm:gap-4">
          {DAILY_TIME.map(({ day, easy, medium, hard }) => {
            const total = easy + medium + hard;
            const segments = [
              { minutes: hard, className: DIFFICULTY_DOT_CLASS.Hard },
              { minutes: medium, className: DIFFICULTY_DOT_CLASS.Medium },
              { minutes: easy, className: DIFFICULTY_DOT_CLASS.Easy },
            ].filter((segment) => segment.minutes > 0);

            return (
              <div key={day} className="flex min-w-0 flex-col gap-2">
                <div
                  className="flex flex-1 flex-col justify-end border-b"
                  title={`${day}: ${total} min`}
                >
                  <div
                    className="flex flex-col gap-0.5 overflow-hidden rounded-t-[3px]"
                    style={{ height: `${(total / CHART_MAX_MINUTES) * 100}%` }}
                  >
                    {segments.map((segment) => (
                      <span
                        key={segment.className}
                        className={segment.className}
                        style={{ flexGrow: segment.minutes }}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-center text-xs text-muted-foreground">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
