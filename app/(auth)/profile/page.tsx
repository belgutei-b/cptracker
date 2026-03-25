import { headers } from "next/headers";
import ProfileSummary from "@/components/profile/ProfileSummary";
import SolveSessions from "@/components/profile/SolveSessions";
import AnalyticsPanel from "@/components/profile/AnalyticsPanel";
import { getSolveSessions } from "@/lib/solveSessions";
import { getBarChartData } from "@/lib/userStat";
import { getProfileOverview, getUserTimezone } from "@/lib/user";
import { auth } from "@/lib/auth";
import {
  ANALYTICS_RANGE_OPTIONS,
  type AnalyticsRangeDays,
} from "@/constants/analytics";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return <div>Login first</div>;
  }
  const userId = session.user.id;

  const { range: rawRange } = await searchParams;
  const parsedRange = Number(rawRange);
  const numberOfDays: AnalyticsRangeDays = (
    ANALYTICS_RANGE_OPTIONS.includes(parsedRange as AnalyticsRangeDays)
      ? parsedRange
      : 7
  ) as AnalyticsRangeDays;

  const tz = await getUserTimezone({ userId });

  const [profile, solveSessions, chartData] = await Promise.all([
    getProfileOverview({ userId }),
    getSolveSessions({ userId }),
    getBarChartData({ numberOfDays, userId, timezone: tz }),
  ]);
  if (!profile) {
    return <div className="px-4 py-6 text-white">User not found</div>;
  }

  return (
    <div className="flex min-h-screen text-white flex-col md:flex-row">
      <ProfileSummary profile={profile} timezone={tz} />

      {/* Right content — 80% */}
      <main className="flex-1 p-6 space-y-6">
        <AnalyticsPanel chartData={chartData} currentRange={numberOfDays} />
        <SolveSessions sessions={solveSessions} timezone={tz} />
      </main>
    </div>
  );
}
