"use client";

import { useEffect, useState } from "react";

/** current time in ms, re-rendering every `intervalMs` while `enabled` */
export function useNowTick(enabled: boolean, intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, intervalMs]);

  return now;
}
