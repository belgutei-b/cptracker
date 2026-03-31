import { formatDayMonthYear } from "@/lib/date";
import SignOutButton from "@/components/profile/SignOutButton";
import type { getProfileOverview } from "@/lib/user";

type Props = {
  profile: NonNullable<Awaited<ReturnType<typeof getProfileOverview>>>;
  timezone: string;
};

export default function ProfileSummary({ profile, timezone }: Props) {
  const providerText =
    profile.providers.length > 0
      ? profile.providers.join(", ")
      : "Unknown provider";

  return (
    <aside className="w-full md:w-1/5 min-w-48 md:border-r md:border-[#3e3e3e] p-5 flex flex-col gap-5">
      <div className="text-xl font-bold">Profile</div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Username
          </p>
          <p className="font-medium truncate">{profile.identity}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Provider
          </p>
          <p className="font-medium">{providerText}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Joined
          </p>
          <p className="font-medium">
            {formatDayMonthYear(profile.createdAt, timezone)}
          </p>
        </div>

        <SignOutButton />
      </div>
    </aside>
  );
}
