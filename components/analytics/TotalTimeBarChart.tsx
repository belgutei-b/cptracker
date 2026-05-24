"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import DifficultyStatsTooltip from "@/components/analytics/DifficultyStatsTooltip";
import { DIFFICULTY_COLORS as COLORS } from "@/constants/difficulty";
import type { AnalyticsRangeDays } from "@/constants/analytics";
import { formatDuration, formatDurationMinutes } from "@/lib/date";
import { Difficulty } from "@/prisma/generated/prisma/enums";
import type { BarChartColumn } from "@/types/analytics";

type Props = {
  numberOfDays: AnalyticsRangeDays;
  chartData: BarChartColumn[];
  isLoading: boolean;
  variant?: "dark" | "card";
};

function formatYAxis(seconds: number): string {
  return formatDurationMinutes(seconds).replace(" min", "m");
}

function getDuration(
  data: BarChartColumn,
  difficulty: Exclude<Difficulty, "All">,
) {
  return data.difficultyEntries[difficulty].duration;
}

function getTotalDuration(data: BarChartColumn) {
  return (
    getDuration(data, Difficulty.Easy) +
    getDuration(data, Difficulty.Medium) +
    getDuration(data, Difficulty.Hard)
  );
}

function getProblemCount(data: BarChartColumn) {
  return data.difficultyEntries[Difficulty.All].numberOfSolved;
}

function getYAxisTicks(chartData: BarChartColumn[]): number[] {
  const maxDuration = Math.max(
    ...chartData.map((data) => getTotalDuration(data)),
    0,
  );

  if (maxDuration === 0) {
    return [0, 900, 1800, 2700, 3600];
  }

  const targetTickCount = 5;
  const rawStepMinutes = Math.ceil(maxDuration / 60 / (targetTickCount - 1));
  const stepOptions = [5, 10, 15, 20, 30, 45, 60, 90, 120];
  const stepMinutes =
    stepOptions.find((step) => rawStepMinutes <= step) ??
    Math.ceil(rawStepMinutes / 60) * 60;
  const maxTickMinutes =
    Math.ceil(maxDuration / 60 / stepMinutes) * stepMinutes;

  const ticks: number[] = [];

  for (let minutes = 0; minutes <= maxTickMinutes; minutes += stepMinutes) {
    ticks.push(minutes * 60);
  }

  return ticks;
}

export default function TotalTimeBarChart({
  numberOfDays,
  chartData,
  isLoading,
  variant = "dark",
}: Props) {
  const barSize = numberOfDays === 7 ? 24 : numberOfDays === 14 ? 16 : 10;
  const xTickInterval = numberOfDays === 7 ? 0 : numberOfDays === 14 ? 1 : 3;
  const overviewLabel = `past ${numberOfDays} days · tried + solved`;
  const yAxisTicks = getYAxisTicks(chartData);
  const maxYAxisTick = yAxisTicks[yAxisTicks.length - 1] ?? 0;

  return (
    <AnalyticsCard
      title="Total Time"
      description={overviewLabel}
      className={
        variant === "card" ? "border-[#3e3e3e] bg-[#282828] p-6 shadow-xl" : ""
      }
      actions={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS.Easy }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
              Easy
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS.Medium }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
              Medium
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS.Hard }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
              Hard
            </span>
          </div>
          <div className="ml-1 flex items-center gap-1.5">
            <div
              className="h-px w-3.5"
              style={{ backgroundColor: "#ffa116" }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
              Solved
            </span>
          </div>
        </div>
      }
    >
      <div className="relative h-60 min-w-0">
        <ResponsiveContainer width="100%" height={240} minWidth={0}>
          <ComposedChart
            data={chartData}
            margin={{ top: 6, right: 12, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              yAxisId="left"
              strokeDasharray="3 3"
              vertical={false}
              horizontalValues={yAxisTicks}
              syncWithTicks
              stroke="#1e1e1e"
            />
            <XAxis
              dataKey="date"
              interval={xTickInterval}
              tick={{
                fill: "var(--color-zinc-300)",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "monospace",
              }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              yAxisId="left"
              domain={[0, maxYAxisTick]}
              ticks={yAxisTicks}
              interval={0}
              allowDecimals={false}
              tickFormatter={formatYAxis}
              tick={{
                fill: "var(--color-zinc-300)",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "monospace",
              }}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{
                fill: "var(--color-zinc-300)",
                fontSize: 10,
                fontFamily: "monospace",
              }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0]?.payload as BarChartColumn | undefined;
                if (!row) return null;

                return (
                  <DifficultyStatsTooltip
                    title={String(label)}
                    difficultyEntries={row.difficultyEntries}
                    difficulties={Object.values(Difficulty)}
                    valueLabel="Time"
                    formatValue={(entry) => formatDuration(entry.duration)}
                  />
                );
              }}
            />

            <Bar
              yAxisId="left"
              dataKey={(data: BarChartColumn) =>
                getDuration(data, Difficulty.Easy)
              }
              name="Easy"
              stackId="a"
              fill={COLORS.Easy}
              radius={[0, 0, 0, 0]}
              barSize={barSize}
            />
            <Bar
              yAxisId="left"
              dataKey={(data: BarChartColumn) =>
                getDuration(data, Difficulty.Medium)
              }
              name="Medium"
              stackId="a"
              fill={COLORS.Medium}
              radius={[0, 0, 0, 0]}
              barSize={barSize}
            />
            <Bar
              yAxisId="left"
              dataKey={(data: BarChartColumn) =>
                getDuration(data, Difficulty.Hard)
              }
              name="Hard"
              stackId="a"
              fill={COLORS.Hard}
              radius={[4, 4, 0, 0]}
              barSize={barSize}
            />

            <Line
              yAxisId="right"
              type="linear"
              dataKey={getProblemCount}
              name="Total Solved"
              stroke="var(--color-zinc-300)"
              strokeWidth={2}
              dot={{
                r: 3.5,
                fill: "var(--color-zinc-300)",
                strokeWidth: 2,
                stroke: "var(--color-zinc-300)",
              }}
              activeDot={{
                r: 5,
                fill: "var(--color-zinc-300)",
                strokeWidth: 0,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#111113]/80 text-xs font-semibold text-neutral-500">
            Loading chart...
          </div>
        )}
      </div>
    </AnalyticsCard>
  );
}
