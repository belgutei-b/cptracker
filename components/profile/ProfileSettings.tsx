import type { ReactNode } from "react";

import DeviceList, { type Device } from "@/components/profile/DeviceList";
import ProviderIcon, {
  SIGN_IN_PROVIDERS,
  getProviderLabel,
} from "@/components/profile/ProviderIcon";
import SignOutButton from "@/components/profile/SignOutButton";

/*
 * Parts without a backend yet (editing the profile, linking accounts,
 * choosing a time zone) are shown read-only with a "Coming soon" note.
 * See Changes.md.
 */
export default function ProfileSettings({
  name,
  email,
  providers,
  timezone,
  devices,
}: {
  name: string;
  email: string;
  providers: string[];
  timezone: string;
  devices: Device[];
}) {
  return (
    <div className="max-w-[1040px]">
      <SettingsSection
        title="Profile"
        description="Comes from the account you signed in with."
      >
        <dl className="divide-y rounded-lg border bg-card text-sm">
          <ReadOnlyRow label="Name" value={name || "—"} />
          <ReadOnlyRow label="Email" value={email || "—"} />
        </dl>
        <ComingSoon>Editing your name and username is coming soon.</ComingSoon>
      </SettingsSection>

      <SettingsSection
        title="Time zone"
        description="Dates, streaks and daily totals are counted in this zone."
      >
        <dl className="divide-y rounded-lg border bg-card text-sm">
          <ReadOnlyRow label="Zone" value={timezone} />
        </dl>
        <p className="text-[13px] text-muted-foreground">
          Set automatically from your browser when you open the dashboard.
        </p>
      </SettingsSection>

      <SettingsSection
        title="Signed-in devices"
        description="Includes the browser extension. Signing a device out ends its session there."
      >
        <DeviceList devices={devices} />
      </SettingsSection>

      <SettingsSection title="Account" description="Sign out here.">
        <div className="rounded-lg border bg-card">
          <div className="flex items-center gap-4 p-4">
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-sm font-medium">Sign out</span>
              <span className="text-[13px] text-muted-foreground">
                End your session in this browser.
              </span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-4 border-t py-7 first:border-t-0 first:pt-2 md:grid-cols-[260px_minmax(0,1fr)] md:gap-12">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-4 px-4 py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate">{value}</dd>
    </div>
  );
}

function ComingSoon({ children }: { children: ReactNode }) {
  return <p className="text-[13px] text-muted-foreground">{children}</p>;
}
