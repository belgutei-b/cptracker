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
import { DIFFICULTY_COLORS as COLORS } from "@/constants/difficulty";
import type { AnalyticsRangeDays } from "@/constants/analytics";
import type { BarChartData } from "@/types/stat";

type Props = {
  numberOfDays: AnalyticsRangeDays;
  chartData: BarChartData[];
  isLoading: boolean;
};

function formatSeconds(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60);
  if (totalMinutes === 0) return "0m";
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function formatYAxis(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  return `${minutes}m`;
}

function getYAxisTicks(chartData: BarChartData[]): number[] {
  const maxDuration = Math.max(
    ...chartData.map((data) => data.easy + data.medium + data.hard),
    0,
  );

  if (maxDuration === 0) {
    return [0, 900, 1800, 2700, 3600];
  }

  const targetTickCount = 5;
  const rawStepMinutes = Math.ceil(
    maxDuration / 60 / (targetTickCount - 1),
  );
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

export default function TotalSolveDuration({
  numberOfDays,
  chartData,
  isLoading,
}: Props) {
  const barSize = numberOfDays === 7 ? 24 : numberOfDays === 14 ? 16 : 10;
  const overviewLabel = `past ${numberOfDays} days · tried + solved`;
  const yAxisTicks = getYAxisTicks(chartData);
  const maxYAxisTick = yAxisTicks[yAxisTicks.length - 1] ?? 0;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#1e1e1e] bg-[#111113] p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-tight text-white">
            Total Time
          </p>
          <p className="mt-0.5 font-mono text-xs text-neutral-600">
            {overviewLabel}
          </p>
        </div>

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
      </div>

      {/* Chart */}
      <div className="relative h-52">
        <ResponsiveContainer width="100%" height="100%">
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
              tick={{
                fill: "#555",
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
                fill: "#555",
                fontSize: 10,
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
                fill: "#555",
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

                const byName = new Map(
                  payload.map((item) => [String(item.name), item]),
                );

                const easy = Number(byName.get("Easy")?.value ?? 0);
                const medium = Number(byName.get("Medium")?.value ?? 0);
                const hard = Number(byName.get("Hard")?.value ?? 0);
                const solved = Number(byName.get("Total Solved")?.value ?? 0);

                const rows = [
                  {
                    label: "Easy",
                    value: easy,
                    color: COLORS.Easy,
                    hide: true,
                  },
                  {
                    label: "Medium",
                    value: medium,
                    color: COLORS.Medium,
                    hide: true,
                  },
                  {
                    label: "Hard",
                    value: hard,
                    color: COLORS.Hard,
                    hide: true,
                  },
                  {
                    label: "Total Solved",
                    value: solved,
                    color: "#ffa116",
                    hide: false,
                  },
                ].filter((row) => !(row.hide && row.value === 0));

                return (
                  <div className="min-w-36 rounded-xl border border-[#2e2e2e] bg-[#141414] px-3 py-2.5 font-mono text-[11px] shadow-xl">
                    <p className="mb-1.5 text-xs font-medium text-zinc-300">
                      {String(label)}
                    </p>
                    {rows.length === 0 ? (
                      <p className="leading-[1.7] text-zinc-600">No sessions</p>
                    ) : (
                      <div>
                        {rows.map((row) => (
                          <p
                            key={row.label}
                            className="leading-[1.7]"
                            style={{ color: row.color }}
                          >
                            {row.label}:{" "}
                            {row.label === "Total Solved"
                              ? row.value
                              : formatSeconds(row.value)}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }}
            />

            <Bar
              yAxisId="left"
              dataKey="easy"
              name="Easy"
              stackId="a"
              fill={COLORS.Easy}
              radius={[0, 0, 0, 0]}
              barSize={barSize}
            />
            <Bar
              yAxisId="left"
              dataKey="medium"
              name="Medium"
              stackId="a"
              fill={COLORS.Medium}
              radius={[0, 0, 0, 0]}
              barSize={barSize}
            />
            <Bar
              yAxisId="left"
              dataKey="hard"
              name="Hard"
              stackId="a"
              fill={COLORS.Hard}
              radius={[4, 4, 0, 0]}
              barSize={barSize}
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="problemCount"
              name="Total Solved"
              stroke="#ffa116"
              strokeWidth={2.5}
              dot={{
                r: 3.5,
                fill: "#ffa116",
                strokeWidth: 2,
                stroke: "#09090b",
              }}
              activeDot={{ r: 5, fill: "#ffa116", strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#111113]/80 text-xs font-semibold text-neutral-500">
            Loading chart...
          </div>
        )}
      </div>
    </div>
  );
}
