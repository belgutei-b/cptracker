import { redirect } from "next/navigation";
import { getCurrentUserId, getUserTimezone } from "@/lib/user";
import { getBarChartDataV2 } from "@/lib/userStat";
import {
  ANALYTICS_RANGE_OPTIONS,
  type AnalyticsRangeDays,
} from "@/constants/analytics";
import AvgSolveTimeCards from "./components/AvgSolveTimeCards";
import DailyTotalTimeBarChart from "./components/DailyTotalTimeBarChart";
import TagPerformanceRadar from "./components/TagPerformanceRadar";
import AvgSolveTimeByTopic from "./components/AvgSolveTimeByTopic";
import SpeedVsAverageByTag from "./components/SpeedVsAverageByTag";
import RangeSelector from "./components/RangeSelector";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const { range: rawRange } = await searchParams;
  const parsedRange = Number(rawRange);
  const numberOfDays: AnalyticsRangeDays = (
    ANALYTICS_RANGE_OPTIONS.includes(parsedRange as AnalyticsRangeDays)
      ? parsedRange
      : 7
  ) as AnalyticsRangeDays;

  const timezone = await getUserTimezone({ userId });
  const { avgSolveTime, dailyBarChart, tagsReceivedData } =
    await getBarChartDataV2({
      query: { numberOfDays, userId, timezone },
    });

  return (
    <main className="min-h-screen p-6 text-white space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Analytics</h1>
        <RangeSelector current={numberOfDays} />
      </div>

      <AvgSolveTimeCards data={avgSolveTime} numberOfDays={numberOfDays} />
      <DailyTotalTimeBarChart data={dailyBarChart} numberOfDays={numberOfDays} />
      <TagPerformanceRadar data={tagsReceivedData} />
      <AvgSolveTimeByTopic data={tagsReceivedData} />
      <SpeedVsAverageByTag />
    </main>
  );
}
