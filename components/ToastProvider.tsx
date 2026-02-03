"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#1f1f1f",
          color: "#f5f5f5",
          border: "1px solid #3e3e3e",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          borderRadius: "14px",
          padding: "12px 14px",
          fontSize: "14px",
          fontWeight: 500,
        },
        success: {
          style: {
            border: "1px solid #10b981",
            color: "#e7fff5",
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(20,83,45,0.35))",
          },
        },
        error: {
          style: {
            border: "1px solid #f87171",
            color: "#ffecec",
            background:
              "linear-gradient(135deg, rgba(248,113,113,0.18), rgba(127,29,29,0.35))",
          },
        },
      }}
    />
  );
}
