"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import TotalTimeBarChart from "@/components/analytics/TotalTimeBarChart";
import { DIFFICULTY_COLORS } from "@/constants/difficulty";
import {
  ANALYTICS_RANGE_OPTIONS,
  type AnalyticsRangeDays,
} from "@/constants/analytics";
import { formatDuration } from "@/lib/date";
import type { BarChartData } from "@/types/stat";

function getRangeLabel(numberOfDays: AnalyticsRangeDays) {
  if (numberOfDays === 7) return "Last 7 Days";
  if (numberOfDays === 14) return "Last 2 Weeks";
  return "Last 1 Month";
}

export default function AnalyticsPanel({
  chartData,
  currentRange,
}: {
  chartData: BarChartData[];
  currentRange: AnalyticsRangeDays;
}) {
  const router = useRouter();

  const totalSecondsByDifficulty = useMemo(
    () =>
      chartData.reduce(
        (acc, day) => {
          acc.easy += day.easy ?? 0;
          acc.medium += day.medium ?? 0;
          acc.hard += day.hard ?? 0;
          return acc;
        },
        { easy: 0, medium: 0, hard: 0 },
      ),
    [chartData],
  );

  const totalSeconds =
    totalSecondsByDifficulty.easy +
    totalSecondsByDifficulty.medium +
    totalSecondsByDifficulty.hard;

  const totalSolved = useMemo(
    () => chartData.reduce((acc, day) => acc + (day.problemCount ?? 0), 0),
    [chartData],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-white">Performance</div>

        {/* duration picker */}
        <div className="flex items-center bg-[#1a1a1a] rounded-lg p-1 border border-[#3e3e3e]">
          {ANALYTICS_RANGE_OPTIONS.map((range) => (
            <button
              key={range}
              onClick={() => router.push(`?range=${range}`)}
              className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                currentRange === range
                  ? "bg-[#ffa116] text-black shadow-lg shadow-[#ffa11633]"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {range === 7 ? "7 Days" : range === 14 ? "2 Weeks" : "1 Month"}
            </button>
          ))}
        </div>
      </div>

      <TotalTimeBarChart
        numberOfDays={currentRange}
        chartData={chartData}
        isLoading={false}
        variant="card"
      />

      <div className="bg-[#282828] border border-[#3e3e3e] text-white flex">
        {/* Total */}
        <div className="px-6 py-4 flex flex-col justify-center min-w-40 border-r border-[#3e3e3e]">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            {getRangeLabel(currentRange)}
          </p>
          <p className="text-2xl font-extrabold font-mono text-[#ffa116] mt-1">
            {formatDuration(totalSeconds)}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">{totalSolved} solved</p>
        </div>

        {/* Per-difficulty */}
        <div className="px-6 py-4 flex gap-8">
          {(
            [
              ["Easy", totalSecondsByDifficulty.easy],
              ["Medium", totalSecondsByDifficulty.medium],
              ["Hard", totalSecondsByDifficulty.hard],
            ] as const
          ).map(([label, secs]) => (
            <div key={label} className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: DIFFICULTY_COLORS[label] }}
                />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  {label}
                </p>
              </div>
              <p
                className="text-xl font-bold font-mono"
                style={{ color: DIFFICULTY_COLORS[label] }}
              >
                {formatDuration(secs)}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                {totalSeconds > 0
                  ? Math.round((secs / totalSeconds) * 100)
                  : 0}
                %
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
