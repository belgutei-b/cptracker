"use client";

import { DateTime } from "luxon";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import DifficultyStatsTooltip from "@/components/analytics/DifficultyStatsTooltip";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/date";
import {
  CHART_COLORS,
  CHART_TICK_STYLE,
  type AnalyticsRangeDays,
} from "@/constants/analytics";
import {
  DIFFICULTIES,
  DIFFICULTY_COLORS,
  DIFFICULTY_DOT_CLASS,
  type ProblemDifficulty,
} from "@/constants/difficulty";
import { Difficulty } from "@/prisma/generated/prisma/enums";
import type { BarChartColumn } from "@/types/analytics";

type Props = {
  data: BarChartColumn[];
  numberOfDays: AnalyticsRangeDays;
};

const CHART_HEIGHT = 260;

// bars get thinner and labels sparser as the range grows
const BAR_SIZE: Record<AnalyticsRangeDays, number> = { 7: 28, 14: 18, 28: 10 };
const X_TICK_INTERVAL: Record<AnalyticsRangeDays, number> = { 7: 0, 14: 1, 28: 3 };

/** dates come from the server as "2026 Sep 30" */
function parseDay(date: string) {
  return DateTime.fromFormat(date, "yyyy LLL dd", { locale: "en" });
}

/** axis label: "45m", "2h", "2h 15m" */
function formatAxisTime(seconds: number) {
  const minutes = Math.round(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

function getDuration(day: BarChartColumn, difficulty: ProblemDifficulty) {
  return day.difficultyEntries[difficulty].duration;
}

/** 4–5 evenly spaced ticks in whole minutes, ending above the tallest bar */
function getYAxisTicks(data: BarChartColumn[]): number[] {
  const maxSeconds = Math.max(
    ...data.map((day) => DIFFICULTIES.reduce((sum, d) => sum + getDuration(day, d), 0)),
    0,
  );
  if (maxSeconds === 0) return [0, 900, 1800, 2700, 3600];

  const rawStepMinutes = Math.ceil(maxSeconds / 60 / 4);
  const stepMinutes =
    [5, 10, 15, 20, 30, 45, 60, 90, 120].find((step) => rawStepMinutes <= step) ??
    Math.ceil(rawStepMinutes / 60) * 60;
  const maxTickMinutes = Math.ceil(maxSeconds / 60 / stepMinutes) * stepMinutes;

  const ticks: number[] = [];
  for (let minutes = 0; minutes <= maxTickMinutes; minutes += stepMinutes) {
    ticks.push(minutes * 60);
  }
  return ticks;
}

export default function DailyTotalTimeBarChart({ data, numberOfDays }: Props) {
  const yAxisTicks = getYAxisTicks(data);
  const formatXAxis = (date: string) =>
    parseDay(date).toFormat(numberOfDays === 7 ? "ccc" : "d LLL");

  return (
    <AnalyticsCard
      title="Daily time"
      description={`Time spent each day in the last ${numberOfDays} days, tried and solved`}
      actions={<Legend />}
    >
      <div className="min-w-0" style={{ height: CHART_HEIGHT }}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT} minWidth={0}>
          <ComposedChart data={data} margin={{ top: 6, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid
              yAxisId="time"
              vertical={false}
              stroke={CHART_COLORS.grid}
              strokeDasharray="3 3"
              horizontalValues={yAxisTicks}
              syncWithTicks
            />
            <XAxis
              dataKey="date"
              interval={X_TICK_INTERVAL[numberOfDays]}
              tickFormatter={formatXAxis}
              tick={CHART_TICK_STYLE}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              yAxisId="time"
              domain={[0, yAxisTicks[yAxisTicks.length - 1]]}
              ticks={yAxisTicks}
              interval={0}
              tickFormatter={formatAxisTime}
              tick={CHART_TICK_STYLE}
              axisLine={false}
              tickLine={false}
              width={56}
            />
            <YAxis
              yAxisId="solved"
              orientation="right"
              allowDecimals={false}
              tick={CHART_TICK_STYLE}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              cursor={{ fill: CHART_COLORS.cursor }}
              content={({ active, payload, label }) => {
                const day = payload?.[0]?.payload as BarChartColumn | undefined;
                if (!active || !day) return null;

                return (
                  <DifficultyStatsTooltip
                    title={parseDay(String(label)).toFormat("ccc, d LLL")}
                    difficultyEntries={day.difficultyEntries}
                    difficulties={Object.values(Difficulty)}
                    valueLabel="Time"
                    formatValue={(entry) => formatDuration(entry.duration)}
                  />
                );
              }}
            />

            {DIFFICULTIES.map((difficulty, i) => (
              <Bar
                key={difficulty}
                yAxisId="time"
                dataKey={(day: BarChartColumn) => getDuration(day, difficulty)}
                name={difficulty}
                stackId="time"
                fill={DIFFICULTY_COLORS[difficulty]}
                // round the top of the stack (hard is drawn last)
                radius={i === DIFFICULTIES.length - 1 ? [3, 3, 0, 0] : 0}
                barSize={BAR_SIZE[numberOfDays]}
              />
            ))}

            <Line
              yAxisId="solved"
              type="linear"
              dataKey={(day: BarChartColumn) => day.difficultyEntries[Difficulty.All].numberOfSolved}
              name="Solved"
              stroke={CHART_COLORS.solvedLine}
              strokeWidth={2}
              dot={{ r: 3, fill: CHART_COLORS.solvedLine, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: CHART_COLORS.solvedLine, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[12.5px] text-muted-foreground">
      {DIFFICULTIES.map((difficulty) => (
        <span key={difficulty} className="flex items-center gap-1.5">
          <span className={cn("size-2 rounded-[2px]", DIFFICULTY_DOT_CLASS[difficulty])} />
          {difficulty}
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <span className="h-0.5 w-3.5 rounded-full bg-primary" />
        Solved
      </span>
    </div>
  );
}
