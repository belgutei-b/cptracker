"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Monitor, Smartphone } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import type { DeviceKind } from "@/lib/user-agent";

export type Device = {
  token: string;
  label: string;
  kind: DeviceKind;
  lastActive: string;
  isCurrent: boolean;
};

/** active better-auth sessions; any except the current one can be signed out */
export default function DeviceList({ devices }: { devices: Device[] }) {
  const router = useRouter();
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [isRevokingOthers, setIsRevokingOthers] = useState(false);

  const hasOtherDevices = devices.some((device) => !device.isCurrent);

  async function signOutDevice(token: string) {
    setPendingToken(token);
    const { error } = await authClient.revokeSession({ token });
    setPendingToken(null);

    if (error) {
      toast.error("Couldn't sign out that device");
      return;
    }
    toast.success("Device signed out");
    router.refresh();
  }

  async function signOutOtherDevices() {
    setIsRevokingOthers(true);
    const { error } = await authClient.revokeOtherSessions();
    setIsRevokingOthers(false);

    if (error) {
      toast.error("Couldn't sign out the other devices");
      return;
    }
    toast.success("Signed out of all other devices");
    router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <ul className="w-full divide-y rounded-lg border bg-card">
        {devices.map((device) => {
          const Icon = device.kind === "mobile" ? Smartphone : Monitor;
          return (
            <li key={device.token} className="flex items-center gap-3.5 px-4 py-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="size-4" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm font-medium">{device.label}</span>
                <span className="text-[13px] text-muted-foreground">
                  {device.lastActive}
                </span>
              </div>
              {device.isCurrent ? (
                <span className="rounded-md border border-primary/35 px-2 py-0.5 text-xs font-medium text-primary">
                  This device
                </span>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => signOutDevice(device.token)}
                  disabled={pendingToken !== null || isRevokingOthers}
                >
                  {pendingToken === device.token ? "Signing out..." : "Sign out"}
                </Button>
              )}
            </li>
          );
        })}
      </ul>

      {hasOtherDevices && (
        <Button
          variant="outline"
          onClick={signOutOtherDevices}
          disabled={pendingToken !== null || isRevokingOthers}
        >
          {isRevokingOthers ? "Signing out..." : "Sign out of all other devices"}
        </Button>
      )}
    </div>
  );
}
