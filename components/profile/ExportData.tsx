"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { problemsToCsv } from "@/lib/export";
import type { UserProblemFullClient } from "@/types/client";

type Format = "json" | "csv";

function downloadFile(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function fetchJson<T>(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request to ${url} failed`);
  return (await res.json()) as T;
}

/** builds the export in the browser from the existing problems and sessions endpoints */
export default function ExportData() {
  const [pendingFormat, setPendingFormat] = useState<Format | null>(null);

  async function exportAs(format: Format) {
    setPendingFormat(format);
    const date = new Date().toISOString().slice(0, 10);

    try {
      const { problems } = await fetchJson<{ problems: UserProblemFullClient[] }>(
        "/api/problems",
      );

      if (format === "csv") {
        downloadFile(`cptracker-problems-${date}.csv`, problemsToCsv(problems), "text/csv");
      } else {
        const sessions = await fetchJson<unknown[]>("/api/solve-sessions");
        const content = JSON.stringify(
          { exportedAt: new Date().toISOString(), problems, sessions },
          null,
          2,
        );
        downloadFile(`cptracker-export-${date}.json`, content, "application/json");
      }
    } catch {
      toast.error("Export failed, please try again");
    } finally {
      setPendingFormat(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="lg"
        onClick={() => exportAs("json")}
        disabled={pendingFormat !== null}
      >
        <Download />
        {pendingFormat === "json" ? "Preparing..." : "Download JSON"}
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={() => exportAs("csv")}
        disabled={pendingFormat !== null}
      >
        <Download />
        {pendingFormat === "csv" ? "Preparing..." : "Download CSV"}
      </Button>
    </div>
  );
}
