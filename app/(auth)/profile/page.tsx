import { headers } from "next/headers";
import ProfileSummary from "@/components/profile/ProfileSummary";
import SolveSessions from "@/components/profile/SolveSessions";
import { getSolveSessions } from "@/lib/solveSessions";
import { getProfileOverview, getUserTimezone } from "@/lib/user";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return <div>Login first</div>;
  }
  const userId = session.user.id;

  const tz = await getUserTimezone({ userId });

  const [profile, solveSessions] = await Promise.all([
    getProfileOverview({ userId }),
    getSolveSessions({ userId }),
  ]);
  if (!profile) {
    return <div className="px-4 py-6 text-white">User not found</div>;
  }

  return (
    <div className="flex min-h-screen text-white flex-col md:flex-row">
      <ProfileSummary profile={profile} timezone={tz} />

      {/* Right content — 80% */}
      <main className="flex-1 p-6 space-y-6">
        <SolveSessions sessions={solveSessions} timezone={tz} />
      </main>
    </div>
  );
}
