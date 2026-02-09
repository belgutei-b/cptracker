"use client";

import { useEffect, useMemo, useState } from "react";
// import AverageSolveDuration from "@/components/analytics/AverageSolveDuration";
import TotalSolveDuration from "@/components/analytics/TotalSolveDuration";
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

export default function AnalyticsDashboard() {
  const [numberOfDays, setNumberOfDays] = useState<AnalyticsRangeDays>(7);
  const [chartData, setChartData] = useState<BarChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/analytics/bar-chart?numberOfDays=${numberOfDays}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Failed to fetch bar chart data");

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : [];

        setChartData(
          data.map((entry: BarChartData) => ({
            date: entry.date,
            easy: Number(entry.easy ?? 0),
            medium: Number(entry.medium ?? 0),
            hard: Number(entry.hard ?? 0),
            problemCount: Number(entry.problemCount ?? 0),
          })),
        );
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
  }, [numberOfDays]);

  const totalSecondsByDifficulty = useMemo(() => {
    return chartData.reduce(
      (acc, day) => {
        acc.easy += day.easy ?? 0;
        acc.medium += day.medium ?? 0;
        acc.hard += day.hard ?? 0;
        return acc;
      },
      { easy: 0, medium: 0, hard: 0 },
    );
  }, [chartData]);

  const totalSeconds =
    totalSecondsByDifficulty.easy +
    totalSecondsByDifficulty.medium +
    totalSecondsByDifficulty.hard;

  const totalSolved = useMemo(() => {
    return chartData.reduce((acc, day) => acc + (day.problemCount ?? 0), 0);
  }, [chartData]);

  return (
    <div className="mt-5 mx-5 space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-xl text-white font-bold">
          Performance Analytics
        </div>

        <div className="flex items-center bg-[#1a1a1a] rounded-lg p-1 border border-[#3e3e3e] w-max">
          {ANALYTICS_RANGE_OPTIONS.map((range) => (
            <button
              key={range}
              onClick={() => setNumberOfDays(range)}
              className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                numberOfDays === range
                  ? "bg-[#ffa116] text-black shadow-lg shadow-[#ffa11633]"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {range === 7 ? "7 Days" : range === 14 ? "2 Weeks" : "1 Month"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px] items-start">
        <div className="space-y-10">
          <TotalSolveDuration
            numberOfDays={numberOfDays}
            chartData={chartData}
            isLoading={isLoading}
          />
          {/* <AverageSolveDuration numberOfDays={numberOfDays} /> */}
        </div>

        <div className="bg-[#282828] p-6 rounded-2xl border border-[#3e3e3e] shadow-xl text-white">
          <p className="text-lg font-bold">Total Time</p>
          <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">
            {getRangeLabel(numberOfDays)}
          </p>

          <div className="mt-6">
            <p className="text-3xl font-extrabold text-[#ffa116]">
              {isLoading ? "Loading..." : formatDuration(totalSeconds)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {isLoading ? "" : `${totalSolved} problems solved`}
            </p>
          </div>

          <div className="mt-6 border-t border-[#3e3e3e] pt-4 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: DIFFICULTY_COLORS.Easy }}
                />
                <span className="text-gray-300">Easy</span>
              </div>
              <span className="font-semibold">
                {isLoading
                  ? "--"
                  : formatDuration(totalSecondsByDifficulty.easy)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: DIFFICULTY_COLORS.Medium }}
                />
                <span className="text-gray-300">Medium</span>
              </div>
              <span className="font-semibold">
                {isLoading
                  ? "--"
                  : formatDuration(totalSecondsByDifficulty.medium)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: DIFFICULTY_COLORS.Hard }}
                />
                <span className="text-gray-300">Hard</span>
              </div>
              <span className="font-semibold">
                {isLoading
                  ? "--"
                  : formatDuration(totalSecondsByDifficulty.hard)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
