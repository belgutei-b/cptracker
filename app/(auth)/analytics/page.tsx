import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUserId, getUserTimezone } from "@/lib/user";
import { getBarChartDataV2 } from "@/lib/userStat";
import {
  ANALYTICS_RANGE_OPTIONS,
  type AnalyticsRangeDays,
} from "@/constants/analytics";
import AnalyticsSummary from "./components/AnalyticsSummary";
import AvgSolveTimeByTopic from "./components/AvgSolveTimeByTopic";
import AvgSolveTimeCards from "./components/AvgSolveTimeCards";
import DailyTotalTimeBarChart from "./components/DailyTotalTimeBarChart";
import RangeSelector from "./components/RangeSelector";
import SpeedVsAverageByTag from "./components/SpeedVsAverageByTag";
import TagPerformanceRadar from "./components/TagPerformanceRadar";

export const metadata: Metadata = {
  title: "Analytics - CPTracker",
};

function parseRange(value: string | undefined): AnalyticsRangeDays {
  const parsed = Number(value);
  return ANALYTICS_RANGE_OPTIONS.includes(parsed as AnalyticsRangeDays)
    ? (parsed as AnalyticsRangeDays)
    : 7;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/auth");

  const numberOfDays = parseRange((await searchParams).range);
  const timezone = await getUserTimezone({ userId });
  const { avgSolveTime, dailyBarChart, tagsReceivedData } = await getBarChartDataV2({
    query: { numberOfDays, userId, timezone },
  });

  return (
    <main className="page-container flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-[28px]">Analytics</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Where your time goes, by difficulty and by topic.
          </p>
        </div>
        <RangeSelector current={numberOfDays} />
      </header>

      <AnalyticsSummary
        dailyBarChart={dailyBarChart}
        avgSolveTime={avgSolveTime}
        numberOfDays={numberOfDays}
      />
      <DailyTotalTimeBarChart data={dailyBarChart} numberOfDays={numberOfDays} />
      <AvgSolveTimeCards data={avgSolveTime} numberOfDays={numberOfDays} />

      <SpeedVsAverageByTag data={tagsReceivedData} />
      <AvgSolveTimeByTopic data={tagsReceivedData} />
      <TagPerformanceRadar data={tagsReceivedData} />
    </main>
  );
}
