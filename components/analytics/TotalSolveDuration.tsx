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
  const minutes = seconds / 60;
  if (minutes === 0) return "0";
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const h = minutes / 60;
  return Number.isInteger(h) ? `${h}h` : `${h.toFixed(1)}h`;
}

export default function TotalSolveDuration({
  numberOfDays,
  chartData,
  isLoading,
}: Props) {
  const barSize = numberOfDays === 7 ? 28 : numberOfDays === 14 ? 16 : 10;

  return (
    <div className="bg-neutral-950 p-6 rounded-2xl border border-white/8 w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
            {numberOfDays}-day overview
          </p>
          <p className="text-lg font-bold text-white">Time Spent</p>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-semibold">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: COLORS.Easy }}
            />
            <span className="text-neutral-500">Easy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: COLORS.Medium }}
            />
            <span className="text-neutral-500">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: COLORS.Hard }}
            />
            <span className="text-neutral-500">Hard</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-neutral-800 pl-3">
            <div
              className="w-4 h-0.5 rounded-full"
              style={{ backgroundColor: "#ffa116" }}
            />
            <span className="text-neutral-500">Solved</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="#1e1e20"
              strokeWidth={1}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#525252", fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={formatYAxis}
              tick={{ fill: "#525252", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={38}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#525252", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip
              cursor={{ fill: "#ffffff06", radius: 6 }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;

                const byName = new Map(
                  payload.map((item) => [String(item.name), item]),
                );

                const easy = Number(byName.get("Easy")?.value ?? 0);
                const medium = Number(byName.get("Medium")?.value ?? 0);
                const hard = Number(byName.get("Hard")?.value ?? 0);
                const total = easy + medium + hard;
                const solved = Number(byName.get("Total Solved")?.value ?? 0);

                const rows = [
                  { label: "Easy", value: easy, color: COLORS.Easy },
                  { label: "Medium", value: medium, color: COLORS.Medium },
                  { label: "Hard", value: hard, color: COLORS.Hard },
                ].filter((r) => r.value > 0);

                return (
                  <div className="rounded-xl border border-neutral-800 bg-[#161618] px-4 py-3 shadow-2xl min-w-40">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">
                      {String(label)}
                    </p>
                    {rows.length === 0 ? (
                      <p className="text-xs text-neutral-600">No sessions</p>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {rows.map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center justify-between gap-8"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-sm shrink-0"
                                style={{ backgroundColor: row.color }}
                              />
                              <span className="text-xs text-neutral-400">
                                {row.label}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-white">
                              {formatSeconds(row.value)}
                            </span>
                          </div>
                        ))}
                        <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center justify-between gap-8">
                          <span className="text-xs text-neutral-500">
                            Total
                          </span>
                          <span className="text-xs font-bold text-white">
                            {formatSeconds(total)}
                          </span>
                        </div>
                        {solved > 0 && (
                          <div className="flex items-center justify-between gap-8">
                            <span className="text-xs text-neutral-500">
                              Solved
                            </span>
                            <span
                              className="text-xs font-bold"
                              style={{ color: "#ffa116" }}
                            >
                              {solved} {solved === 1 ? "problem" : "problems"}
                            </span>
                          </div>
                        )}
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
              strokeWidth={2}
              dot={{ r: 3, fill: "#ffa116", strokeWidth: 0 }}
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
