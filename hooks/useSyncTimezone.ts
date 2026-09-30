"use client";

import { useEffect } from "react";

const STORAGE_KEY = "tz";

/**
 * Sends the browser's timezone to the server when it changed since the last sync.
 * The last synced value is kept in localStorage (cleared on sign out).
 */
export function useSyncTimezone() {
  useEffect(() => {
    const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (localStorage.getItem(STORAGE_KEY) === currentTz) return;

    async function syncTimezone() {
      const res = await fetch("/api/timezone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone: currentTz }),
      });

      if (res.ok) localStorage.setItem(STORAGE_KEY, currentTz);
    }

    void syncTimezone();
  }, []);
}
