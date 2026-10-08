import type { ReactNode } from "react";
import { Check } from "lucide-react";

import SectionHeading from "@/components/landing/SectionHeading";
import { EXAMPLE_WEEK } from "@/components/landing/sample-data";
import { cn } from "@/lib/utils";

function formatMinutes(minutes: number) {
  if (minutes === 0) return "";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

const solvedCount = EXAMPLE_WEEK.filter((day) => day.solved).length;
const totalMinutes = EXAMPLE_WEEK.reduce((sum, day) => sum + day.minutes, 0);
const activeDays = EXAMPLE_WEEK.filter((day) => day.minutes > 0).length;
const longestDay = Math.max(...EXAMPLE_WEEK.map((day) => day.minutes));

/** the same week as a solved count and as tracked time */
export default function WhyTimeSection() {
  return (
    <section aria-labelledby="why-title" className="border-t">
      <div className="landing-container flex flex-col gap-12 py-16 md:py-26">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <SectionHeading
            id="why-title"
            eyebrow="Why time"
            title="Your solved count doesn’t show the work. Your time does."
          />
          <p className="max-w-[460px] text-base leading-relaxed text-muted-foreground">
            An hour on a hard problem you didn’t crack is still an hour of
            practice. Mark it Tried and it counts. Here’s the same example
            week, seen both ways.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <WeekCard
            title="Solved count"
            value={String(solvedCount)}
            unit="problems solved"
          >
            {EXAMPLE_WEEK.map((day) => (
              <DayColumn key={day.day} day={day.day}>
                <div className="flex h-full items-end justify-center pb-3">
                  {day.solved && (
                    <span className="flex size-6.5 items-center justify-center rounded-full border border-foreground/25">
                      <Check className="size-3.5" strokeWidth={2.5} />
                    </span>
                  )}
                </div>
              </DayColumn>
            ))}
          </WeekCard>

          <WeekCard
            highlighted
            title="Time tracked with CPTracker"
            meta={
              <div className="flex gap-3.5 text-[12.5px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-[2px] bg-primary" />
                  Solved
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-[2px] bg-primary/35" />
                  Tried
                </span>
              </div>
            }
            value={formatMinutes(totalMinutes)}
            unit={`across ${activeDays} days`}
          >
            {EXAMPLE_WEEK.map((day) => (
              <DayColumn key={day.day} day={day.day}>
                <div className="flex h-full flex-col justify-end">
                  <span className="pb-1.5 text-center font-mono text-[11px] text-foreground/75">
                    {formatMinutes(day.minutes)}
                  </span>
                  <span
                    className={day.solved ? "bg-primary" : "bg-primary/35"}
                    style={{ height: `${(day.minutes / longestDay) * 75}%` }}
                  />
                </div>
              </DayColumn>
            ))}
          </WeekCard>
        </div>
      </div>
    </section>
  );
}

function WeekCard({
  title,
  meta,
  value,
  unit,
  highlighted = false,
  children,
}: {
  title: string;
  meta?: ReactNode;
  value: string;
  unit: string;
  highlighted?: boolean;
  children: ReactNode;
}) {
  return (
    <article
      className={cn(
        "flex flex-col gap-7 rounded-2xl border bg-card p-6 md:p-8",
        highlighted && "border-primary/30",
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className={cn("text-base font-semibold", highlighted ? "text-primary" : "text-foreground/75")}>
          {title}
        </h3>
        {meta}
      </div>
      <p className="flex items-baseline gap-3">
        <span className="font-mono text-5xl leading-none font-medium tracking-tight md:text-[56px]">
          {value}
        </span>
        <span className="text-[15px] text-muted-foreground">{unit}</span>
      </p>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">{children}</div>
    </article>
  );
}

function DayColumn({ day, children }: { day: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="h-36 w-full overflow-hidden rounded-lg bg-muted/60">{children}</div>
      <span className="text-[12.5px] text-muted-foreground">{day}</span>
    </div>
  );
}
