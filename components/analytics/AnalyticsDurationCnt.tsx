"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import * as Switch from "@radix-ui/react-switch";
import { useEffect, useState } from "react";
import "./swichStyles.css";
import { DIFFICULTY_COLORS as COLORS } from "@/components/stat/AverageDuration";

type ChartData = {
  date: string;
  Easy: number;
  Medium: number;
  Hard: number;
  Solved: number;
};

export default function ActivityChart() {
  const [isSolvedOnly, setIsSolvedOnly] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState(7);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/analytics/bar-chart?isSolvedOnly=${isSolvedOnly}&numberOfDays=${numberOfDays}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch bar chart data");
        }
        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : [];
        const mapped = data.map((entry: {
          date: string;
          easy: number;
          medium: number;
          hard: number;
          problemCount: number;
        }) => ({
          date: entry.date,
          Easy: entry.easy ?? 0,
          Medium: entry.medium ?? 0,
          Hard: entry.hard ?? 0,
          Solved: entry.problemCount ?? 0,
        }));
        setChartData(mapped);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setChartData([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    return () => controller.abort();
  }, [isSolvedOnly, numberOfDays]);

  return (
    <div className="bg-[#282828] p-6 rounded-2xl border border-[#3e3e3e] shadow-xl h-90 w-180">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-lg text-white font-bold">Total Time</p>
        </div>
        <div className="flex flex-col items-end">
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
          {/* switch and duration selector */}
          <div className="mt-2 flex space-x-5">
            <div style={{ display: "flex", alignItems: "center" }}>
              <label
                className="Label text-sm"
                htmlFor="solved-only"
                style={{ paddingRight: 15 }}
              >
                Solved Only
              </label>
              <Switch.Root
                className="SwitchRoot"
                id="solved-only"
                checked={isSolvedOnly}
                onCheckedChange={setIsSolvedOnly}
              >
                <Switch.Thumb className="SwitchThumb" />
              </Switch.Root>
            </div>
            <select
              className="bg-stone-700 border-stone-500 border rounded-md py-1 pl-2 text-sm text-white"
              value={numberOfDays}
              onChange={(event) => setNumberOfDays(Number(event.target.value))}
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 2 weeks</option>
              <option value={28}>Last month</option>
            </select>
          </div>
        </div>
      </div>

      <div className="relative h-full">
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
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #3e3e3e",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)",
              }}
              itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
            />

            <Bar
              yAxisId="left"
              dataKey="Easy"
              stackId="a"
              fill={COLORS.Easy}
              radius={[0, 0, 0, 0]}
              barSize={10} // 32 for last 7 days
            />
            <Bar
              yAxisId="left"
              dataKey="Medium"
              stackId="a"
              fill={COLORS.Medium}
              radius={[0, 0, 0, 0]}
              barSize={10}
            />
            <Bar
              yAxisId="left"
              dataKey="Hard"
              stackId="a"
              fill={COLORS.Hard}
              radius={[4, 4, 0, 0]}
              barSize={10}
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Solved"
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
