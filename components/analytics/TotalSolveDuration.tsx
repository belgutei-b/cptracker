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

function formatMinutes(value: number) {
  return `${(value / 60).toFixed(1)}`;
}

export default function TotalSolveDuration({
  numberOfDays,
  chartData,
  isLoading,
}: Props) {
  const barSize = numberOfDays === 7 ? 24 : numberOfDays === 14 ? 14 : 10;

  return (
    <div className="bg-[#282828] p-6 rounded-2xl border border-[#3e3e3e] shadow-xl h-[360px] w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-lg text-white font-bold">Total Time</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-tighter">
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS.Easy }}
            ></div>
            <span className="text-gray-400">Easy</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS.Medium }}
            ></div>
            <span className="text-gray-400">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS.Hard }}
            ></div>
            <span className="text-gray-400">Hard</span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <div
              className="w-4 h-0.5"
              style={{ backgroundColor: "#ffa116" }}
            ></div>
            <span className="text-gray-400">Solved Count</span>
          </div>
        </div>
      </div>

      <div className="relative h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            responsive
            data={chartData}
            margin={{ top: 10, right: 10, bottom: 50, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#333"
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#666", fontSize: 11, fontWeight: "bold" }}
              dy={10}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={formatMinutes}
              tick={{ fill: "#666", fontSize: 11 }}
              label={{
                value: "Minutes",
                angle: -90,
                position: "insideLeft",
                fill: "#444",
                fontSize: 10,
                fontWeight: "bold",
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#666", fontSize: 11 }}
              label={{
                value: "Solved Problems",
                angle: 90,
                position: "insideRight",
                fill: "#444",
                fontSize: 10,
                fontWeight: "bold",
              }}
            />
            <Tooltip
              cursor={{ fill: "#ffffff05" }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;

                const itemByName = new Map(
                  payload.map((item) => [String(item.name), item]),
                );

                const orderedRows = [
                  { name: "Easy", color: COLORS.Easy, isMinutes: true },
                  { name: "Medium", color: COLORS.Medium, isMinutes: true },
                  { name: "Hard", color: COLORS.Hard, isMinutes: true },
                  {
                    name: "Total Solved",
                    color: "#ffa116",
                    isMinutes: false,
                  },
                ];

                return (
                  <div
                    className="rounded-xl border border-[#3e3e3e] bg-[#1a1a1a] px-3 py-2 shadow-lg"
                    style={{ fontSize: "12px", fontWeight: "bold" }}
                  >
                    <p className="mb-1 text-white">{`Date: ${String(label)}`}</p>
                    {orderedRows.map((row) => {
                      const item = itemByName.get(row.name);
                      if (!item) return null;

                      const rawValue = Number(item.value ?? 0);
                      const displayValue = row.isMinutes
                        ? `${(rawValue / 60).toFixed(1)}m`
                        : String(rawValue);

                      return (
                        <p key={row.name} style={{ color: row.color }}>
                          {`${row.name}: ${displayValue}`}
                        </p>
                      );
                    })}
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
              stroke={"#ffa116"}
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#ffa116",
                strokeWidth: 2,
                stroke: "#282828",
              }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#1f1f1f]/80 text-sm font-semibold text-gray-200">
            Loading chart...
          </div>
        ) : null}
      </div>
    </div>
  );
}
