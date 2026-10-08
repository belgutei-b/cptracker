"use client";

import { useEffect, useRef, useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ProfileCard from "@/components/profile/ProfileCard";
import { cn, pluralize } from "@/lib/utils";
import { formatDuration } from "@/lib/date";
import type { HeatmapDay } from "@/lib/profile-stats";

type Metric = "time" | "solved";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];
const LEVEL_CLASSES = ["bg-muted", "bg-primary/20", "bg-primary/40", "bg-primary/65", "bg-primary"];

function getLevel(day: HeatmapDay, metric: Metric) {
  if (metric === "solved") {
    if (day.solved === 0) return day.seconds > 0 ? 1 : 0;
    return Math.min(day.solved + 1, 4);
  }

  const minutes = day.seconds / 60;
  if (minutes === 0) return 0;
  if (minutes <= 15) return 1;
  if (minutes <= 35) return 2;
  if (minutes <= 60) return 3;
  return 4;
}

function getCellClass(day: HeatmapDay, metric: Metric) {
  if (day.future) return "invisible";
  if (day.beforeJoin) return "ring-1 ring-muted ring-inset";
  return LEVEL_CLASSES[getLevel(day, metric)];
}

function getCellTitle(day: HeatmapDay, metric: Metric) {
  if (day.beforeJoin) return `${day.label} · before you joined`;
  if (metric === "solved") return `${day.label} · ${day.solved} solved`;
  return `${day.label} · ${day.seconds > 0 ? formatDuration(day.seconds) : "no activity"}`;
}

/** month label on the first week column of each month */
function getMonthLabels(days: HeatmapDay[]) {
  const labels: { column: number; label: string }[] = [];
  const monthOf = (column: number) => Number(days[column * 7].date.slice(5, 7)) - 1;

  for (let column = 1; column < days.length / 7; column++) {
    if (monthOf(column) !== monthOf(column - 1)) {
      labels.push({ column, label: MONTHS[monthOf(column)] });
    }
  }
  return labels;
}

/** one square per day for the last year, colored by time spent or problems solved */
export default function ActivityHeatmap({ days }: { days: HeatmapDay[] }) {
  const [metric, setMetric] = useState<Metric>("time");
  const scrollRef = useRef<HTMLDivElement>(null);

  const weeks = days.length / 7;
  const activeDays = days.filter((day) => day.seconds > 0 || day.solved > 0).length;

  // on narrow screens show the most recent weeks first
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  return (
    <ProfileCard
      title="Activity"
      description={`${pluralize(activeDays, "active day")} in the last 12 months`}
      action={
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          aria-label="Color days by"
          value={metric}
          onValueChange={(value) => value && setMetric(value as Metric)}
        >
          <ToggleGroupItem value="time">Time</ToggleGroupItem>
          <ToggleGroupItem value="solved">Solved</ToggleGroupItem>
        </ToggleGroup>
      }
    >
      <div ref={scrollRef} className="overflow-x-auto px-5 pt-1">
        <div
          role="img"
          aria-label={`Activity for the last 12 months: ${pluralize(activeDays, "active day")}`}
          className="grid min-w-[680px] gap-[3px]"
          style={{
            gridTemplateColumns: `auto repeat(${weeks}, minmax(0, 1fr))`,
            gridTemplateRows: "auto repeat(7, auto)",
          }}
        >
          {getMonthLabels(days).map(({ column, label }) => (
            <span
              key={column}
              className="pb-1 text-[11px] whitespace-nowrap text-muted-foreground"
              style={{ gridRow: 1, gridColumn: column + 2 }}
            >
              {label}
            </span>
          ))}

          {WEEKDAY_LABELS.map((label, row) => (
            <span
              key={row}
              className="self-center pr-2 text-[11px] leading-none text-muted-foreground"
              style={{ gridRow: row + 2, gridColumn: 1 }}
            >
              {label}
            </span>
          ))}

          {days.map((day, i) => (
            <span
              key={day.date}
              title={day.future ? undefined : getCellTitle(day, metric)}
              className={cn("aspect-square rounded-[3px]", getCellClass(day, metric))}
              style={{ gridRow: (i % 7) + 2, gridColumn: Math.floor(i / 7) + 2 }}
            />
          ))}
        </div>
      </div>

      <div
        aria-hidden
        className="flex items-center justify-end gap-1 px-5 pt-3 pb-4 text-xs text-muted-foreground"
      >
        <span className="mr-1">Less</span>
        {LEVEL_CLASSES.map((levelClass) => (
          <span key={levelClass} className={cn("size-3 rounded-[3px]", levelClass)} />
        ))}
        <span className="ml-1">More</span>
      </div>
    </ProfileCard>
  );
}
