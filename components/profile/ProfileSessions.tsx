import ProfileCard from "@/components/profile/ProfileCard";
import SessionList from "@/components/profile/SessionList";
import { pluralize } from "@/lib/utils";
import type { SessionDayGroup } from "@/lib/profile-stats";

/** every solve session, grouped by day */
export default function ProfileSessions({
  groups,
  sessionCount,
}: {
  groups: SessionDayGroup[];
  sessionCount: number;
}) {
  return (
    <ProfileCard
      title="All sessions"
      description={`${pluralize(sessionCount, "solve session")} since you joined`}
    >
      {groups.length > 0 ? (
        <SessionList groups={groups} />
      ) : (
        <p className="border-t px-5 py-10 text-center text-sm text-muted-foreground">
          No solve sessions yet. Start a problem from the dashboard.
        </p>
      )}
    </ProfileCard>
  );
}
