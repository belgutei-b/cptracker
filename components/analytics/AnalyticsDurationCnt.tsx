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
import { useEffect, useState } from "react";
import { DIFFICULTY_COLORS as COLORS } from "@/components/stat/AverageDuration";
import { Filter } from "lucide-react";

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
        const mapped = data.map(
          (entry: {
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
          }),
        );
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
          <div className="mt-2 flex space-x-3">
            <div className="flex items-center bg-[#1a1a1a] rounded-lg p-1 border border-[#3e3e3e]">
              {([7, 14, 28] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setNumberOfDays(range)}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                    numberOfDays === range
                      ? "bg-[#ffa116] text-black shadow-lg shadow-[#ffa11633]"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {range === 7
                    ? "7 Days"
                    : range === 14
                      ? "2 Weeks"
                      : "1 Month"}
                </button>
              ))}
            </div>

            {/* Solved Only Toggle */}
            <button
              type="button"
              onClick={() => setIsSolvedOnly(!isSolvedOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[10px] font-bold uppercase w-31 ${
                isSolvedOnly
                  ? "bg-[#00af9b20] border-[#00af9b40] text-[#00af9b]"
                  : "bg-[#1a1a1a] border-[#3e3e3e] text-gray-500 hover:text-white"
              }`}
            >
              <Filter size={12} />
              {isSolvedOnly ? "Solved Only" : "All Attempts"}
            </button>
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
