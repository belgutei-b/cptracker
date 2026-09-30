type TimerDisplayInput = {
  duration: number;
  status: "TODO" | "IN_PROGRESS" | "TRIED" | "SOLVED";
  lastStartedAt?: string | Date | null;
};

/** a problem's timer runs while it is in progress and has been started */
export function isTimerRunning(p: TimerDisplayInput) {
  return p.status === "IN_PROGRESS" && !!p.lastStartedAt;
}

export function getDisplayedMilliseconds(p: TimerDisplayInput, nowMs: number) {
  const baseMs = Math.max(0, (p.duration ?? 0) * 1000);

  if (p.status !== "IN_PROGRESS" || !p.lastStartedAt) return baseMs;

  const startedMs =
    typeof p.lastStartedAt === "string"
      ? new Date(p.lastStartedAt).getTime()
      : p.lastStartedAt.getTime();

  const deltaMs = Math.max(0, nowMs - startedMs);
  return baseMs + deltaMs;
}

export function getDisplayedSeconds(p: TimerDisplayInput, nowMs: number) {
  const base = p.duration ?? 0;

  if (p.status !== "IN_PROGRESS" || !p.lastStartedAt) return base;

  const startedMs =
    typeof p.lastStartedAt === "string"
      ? new Date(p.lastStartedAt).getTime()
      : p.lastStartedAt.getTime();

  const delta = Math.max(0, Math.floor((nowMs - startedMs) / 1000));
  return base + delta;
}
