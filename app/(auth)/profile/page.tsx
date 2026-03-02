import { getProfileOverview, getUserTimezone } from "@/lib/user";
import { auth } from "@/lib/auth";
import { formatDayMonthYear } from "@/lib/date";
import SignOutButton from "@/components/profile/SignOutButton";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return <div>Login first</div>;
  }

  const profile = await getProfileOverview({ userId: session.user.id });
  if (!profile) {
    return <div className="px-4 py-6 text-white">User not found</div>;
  }
  const timezone = await getUserTimezone({ userId: session.user.id });

  const providerText =
    profile.providers.length > 0
      ? profile.providers.join(", ")
      : "Unknown provider";

  return (
    <div className="px-4 py-6 space-y-6 text-white">
      <div className="text-xl font-bold">Profile</div>

      <div className="rounded-xl border border-[#3e3e3e] bg-[#282828] p-5 space-y-3 w-80">
        <div>
          <p className="text-sm text-gray-500">Username</p>
          <p className="font-medium">{profile.identity}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Sign-in Provider</p>
          <p className="font-medium">{providerText}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Joined Date</p>
          <p className="font-medium">
            {formatDayMonthYear(profile.createdAt, timezone)}
          </p>
        </div>

        <div className="pt-2 w-full flex justify-end">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
