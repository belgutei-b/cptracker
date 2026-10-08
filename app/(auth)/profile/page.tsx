import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileOverview from "@/components/profile/ProfileOverview";
import ProfileSessions from "@/components/profile/ProfileSessions";
import ProfileSettings from "@/components/profile/ProfileSettings";
import ProfileTabs, { parseProfileTab } from "@/components/profile/ProfileTabs";
import { ProfileTabSkeleton } from "@/components/profile/ProfileSkeleton";
import { auth } from "@/lib/auth";
import { formatDayMonthYear } from "@/lib/date";
import { getProblems } from "@/lib/problem";
import {
  getDailyActivity,
  getHeatmapDays,
  getProblemStats,
  getStreaks,
  groupSessionsByDay,
} from "@/lib/profile-stats";
import { getSolveSessions } from "@/lib/solveSessions";
import { getProfileOverview, getUserTimezone } from "@/lib/user";

const RECENT_SESSION_DAYS = 3;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth");

  const { user } = session;
  const tab = parseProfileTab((await searchParams).tab);
  const [overview, timezone] = await Promise.all([
    getProfileOverview({ userId: user.id }),
    getUserTimezone({ userId: user.id }),
  ]);
  if (!overview) redirect("/auth");

  return (
    <main className="page-container flex flex-col gap-7">
      <ProfileHeader
        name={user.name}
        email={user.email}
        image={user.image}
        providers={overview.providers}
        joinedLabel={formatDayMonthYear(overview.createdAt, timezone)}
        timezone={timezone}
      />
      <ProfileTabs active={tab} />

      {/* keyed so switching tabs shows the skeleton while the next tab loads */}
      <Suspense key={tab} fallback={<ProfileTabSkeleton />}>
        {tab === "overview" && (
          <OverviewTab
            userId={user.id}
            timezone={timezone}
            joinedAt={overview.createdAt}
          />
        )}
        {tab === "sessions" && (
          <SessionsTab userId={user.id} timezone={timezone} />
        )}
        {tab === "settings" && (
          <ProfileSettings
            name={user.name}
            email={user.email}
            providers={overview.providers}
            timezone={timezone}
          />
        )}
      </Suspense>
    </main>
  );
}

async function OverviewTab({
  userId,
  timezone,
  joinedAt,
}: {
  userId: string;
  timezone: string;
  joinedAt: Date;
}) {
  const [problems, sessions] = await Promise.all([
    getProblems({ userId }),
    getSolveSessions({ userId }),
  ]);
  const now = new Date();
  const activity = getDailyActivity({ sessions, problems, timezone, now });

  return (
    <ProfileOverview
      stats={getProblemStats(problems, now.getTime())}
      sessionCount={sessions.length}
      streaks={getStreaks(activity, timezone, now)}
      heatmapDays={getHeatmapDays({ activity, timezone, now, joinedAt })}
      recentSessions={groupSessionsByDay(sessions, timezone, now).slice(
        0,
        RECENT_SESSION_DAYS,
      )}
    />
  );
}

async function SessionsTab({
  userId,
  timezone,
}: {
  userId: string;
  timezone: string;
}) {
  const sessions = await getSolveSessions({ userId });

  return (
    <ProfileSessions
      groups={groupSessionsByDay(sessions, timezone, new Date())}
      sessionCount={sessions.length}
    />
  );
}
