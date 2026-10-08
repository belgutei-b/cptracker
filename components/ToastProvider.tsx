"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "var(--popover)",
          color: "var(--popover-foreground)",
          border: "1px solid var(--border)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          borderRadius: "10px",
          padding: "10px 14px",
          fontSize: "14px",
          fontWeight: 500,
        },
        success: {
          iconTheme: { primary: "var(--primary)", secondary: "var(--primary-foreground)" },
        },
        error: {
          style: { border: "1px solid color-mix(in srgb, var(--destructive) 45%, transparent)" },
          iconTheme: { primary: "var(--destructive)", secondary: "var(--background)" },
        },
      }}
    />
  );
}
