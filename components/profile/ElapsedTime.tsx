"use client";

import { LiveDot } from "@/components/problems/ProblemLabels";
import { useNowTick } from "@/hooks/useNowTick";
import { formatDuration } from "@/lib/date";

/** live duration of a running session */
export default function ElapsedTime({ startedAt }: { startedAt: string }) {
  const nowMs = useNowTick(true);
  const seconds = Math.max(0, Math.floor((nowMs - Date.parse(startedAt)) / 1000));

  return (
    <span className="inline-flex items-center gap-2 text-primary">
      <LiveDot />
      {/* server and browser clocks differ by the time the page takes to load */}
      <span suppressHydrationWarning>{formatDuration(seconds)}</span>
    </span>
  );
}
