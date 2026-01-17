"use client";

import { useEffect } from "react";

export default function HeartbeatManager() {
  useEffect(() => {
    let cancelled = false;
    let inFlight = false;

    async function sendBeat() {
      if (cancelled || inFlight) return;
      inFlight = true;
      try {
        await fetch("/api/problems/beat", { method: "POST" });
      } catch (err) {
        console.log("Error sending hearbeat api");
        console.log(err);
      } finally {
        inFlight = false;
      }
    }

    sendBeat();
    const id = window.setInterval(sendBeat, 10_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return null;
}
