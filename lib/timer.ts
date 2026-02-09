import { useState, useEffect } from "react";

export function useNowTick(enabled: boolean, intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, intervalMs]);

  return now;
}

export function getDisplayedSeconds(
  p: {
    duration: number;
    status: "TODO" | "IN_PROGRESS" | "TRIED" | "SOLVED";
    lastStartedAt?: string | Date | null;
  },
  nowMs: number,
) {
  const base = p.duration ?? 0;

  if (p.status !== "IN_PROGRESS" || !p.lastStartedAt) return base;

  const startedMs =
    typeof p.lastStartedAt === "string"
      ? new Date(p.lastStartedAt).getTime()
      : p.lastStartedAt.getTime();

  const delta = Math.max(0, Math.floor((nowMs - startedMs) / 1000));
  return base + delta;
}
