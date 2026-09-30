import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import DeviceList, { type Device } from "@/components/profile/DeviceList";
import ExportData from "@/components/profile/ExportData";
import ProviderIcon, {
  SIGN_IN_PROVIDERS,
  getProviderLabel,
} from "@/components/profile/ProviderIcon";
import SignOutButton from "@/components/profile/SignOutButton";

/*
 * Parts without a backend yet (editing the profile, linking accounts,
 * choosing a time zone, deleting the account) are shown read-only or
 * disabled with a "Coming soon" note. See Changes.md.
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
        title="Sign-in methods"
        description="The accounts you can use to sign in."
      >
        <ul className="divide-y rounded-lg border bg-card">
          {SIGN_IN_PROVIDERS.map((provider) => {
            const isConnected = providers.includes(provider);
            return (
              <li key={provider} className="flex items-center gap-3.5 px-4 py-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                  <ProviderIcon provider={provider} className="size-4" />
                </span>
                <span className="flex-1 text-sm font-medium">
                  {getProviderLabel(provider)}
                </span>
                <span className={isConnected ? "text-sm text-primary" : "text-sm text-muted-foreground"}>
                  {isConnected ? "Connected" : "Not connected"}
                </span>
              </li>
            );
          })}
        </ul>
        <ComingSoon>Connecting another account is coming soon.</ComingSoon>
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

      <SettingsSection
        title="Export data"
        description="JSON has your problems, notes and every solve session. CSV has one row per problem."
      >
        <ExportData />
      </SettingsSection>

      <SettingsSection title="Account" description="Sign out here, or remove your account.">
        <div className="divide-y rounded-lg border bg-card">
          <div className="flex items-center gap-4 p-4">
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-sm font-medium">Sign out</span>
              <span className="text-[13px] text-muted-foreground">
                End your session in this browser.
              </span>
            </div>
            <SignOutButton />
          </div>
          <div className="flex items-center gap-4 p-4">
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-sm font-medium text-destructive">Delete account</span>
              <span className="text-[13px] text-muted-foreground">
                Permanently removes your problems, notes and solve sessions. Coming soon.
              </span>
            </div>
            <Button variant="destructive" disabled>
              <Trash2 />
              Delete account
            </Button>
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
