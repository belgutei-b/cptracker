"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DIFFICULTY_COLORS as COLORS } from "@/constants/difficulty";

// Static placeholder data — backend not yet implemented.
const TAG_DIFF_AVG: Record<
  string,
  { easy: number; medium: number; hard: number }
> = {
  Array: { easy: 11, medium: 34, hard: 68 },
  "Dynamic Programming": { easy: 18, medium: 52, hard: 95 },
  "Hash Table": { easy: 9, medium: 28, hard: 55 },
  Graph: { easy: 20, medium: 55, hard: 98 },
  "Binary Search": { easy: 12, medium: 32, hard: 60 },
  Tree: { easy: 15, medium: 40, hard: 75 },
  Greedy: { easy: 13, medium: 36, hard: 70 },
  "Two Pointers": { easy: 10, medium: 30, hard: 58 },
};

const OVERALL_AVG = { easy: 13.5, medium: 38.4, hard: 72.4, all: 41.3 };

type Mode = "all" | "easy" | "medium" | "hard";

const MODES: { key: Mode; label: string }[] = [
  { key: "all", label: "All" },
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

function getTagAllAvg(tag: string): number {
  const d = TAG_DIFF_AVG[tag];
  return Math.round(d.easy * 0.4 + d.medium * 0.45 + d.hard * 0.15);
}

export default function SpeedVsAverageByTag() {
  const [mode, setMode] = useState<Mode>("all");

  const rows = useMemo(() => {
    const tags = Object.keys(TAG_DIFF_AVG);
    return tags
      .map((tag) => {
        const avg = mode === "all" ? getTagAllAvg(tag) : TAG_DIFF_AVG[tag][mode];
        const baseline = OVERALL_AVG[mode];
        const value = Math.round(((avg - baseline) / baseline) * 100);
        return { tag, value };
      })
      .sort((a, b) => b.value - a.value);
  }, [mode]);

  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.value)), 10);
  const domainPad = Math.ceil(maxAbs / 5) * 5 + 5;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#1e1e1e] bg-[#111113] p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-tight text-white">
            Speed vs. Average by Tag
          </p>
          <p className="mt-0.5 font-mono text-xs text-neutral-600">
            % faster or slower than your overall average · static sample data
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-[#1e1e1e] bg-[#0c0c0e] p-1">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              className={`rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
                mode === m.key
                  ? "bg-[#1e1e1e] text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
          >
            <CartesianGrid
              horizontal={false}
              stroke="#1d1d1d"
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              domain={[-domainPad, domainPad]}
              tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`}
              tick={{
                fill: "#7e829e",
                fontSize: 10.5,
                fontFamily: "monospace",
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="tag"
              width={130}
              tick={{
                fill: "#d1d5db",
                fontSize: 11,
                fontFamily: "monospace",
              }}
              axisLine={false}
              tickLine={false}
            />
            <ReferenceLine x={0} stroke="#404460" />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const v = Number(payload[0]?.value ?? 0);
                const tag = String(payload[0]?.payload?.tag ?? "");
                const sign = v > 0 ? "+" : "";
                const verdict =
                  v === 0
                    ? "matches average"
                    : v > 0
                      ? "slower than avg"
                      : "faster than avg";
                return (
                  <div className="rounded-xl border border-[#2e2e2e] bg-[#141414] px-3 py-2 font-mono text-[11px] shadow-xl">
                    <p className="mb-0.5 text-xs font-medium text-zinc-300">
                      {tag}
                    </p>
                    <p
                      style={{
                        color: v > 0 ? COLORS.Hard : COLORS.Easy,
                      }}
                    >
                      {sign}
                      {v}% — {verdict}
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="value" radius={[3, 3, 3, 3]} barSize={14}>
              {rows.map((r) => (
                <Cell
                  key={r.tag}
                  fill={r.value > 0 ? COLORS.Hard : COLORS.Easy}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
