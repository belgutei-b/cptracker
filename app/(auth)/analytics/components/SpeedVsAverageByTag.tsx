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
import type { TopicRadarEntry } from "@/types/analytics";
import DifficultyModeSelector, {
  DIFFICULTY_MODE_TO_DIFFICULTY,
  type DifficultyMode,
} from "./DifficultyModeSelector";
import SectionHeader from "./SectionHeader";

type Props = {
  data: TopicRadarEntry[];
};

function formatPercent(value: number): string {
  const rounded = Math.round(value);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

export default function SpeedVsAverageByTag({ data }: Props) {
  const [mode, setMode] = useState<DifficultyMode>("all");

  const rows = useMemo(() => {
    const difficulty = DIFFICULTY_MODE_TO_DIFFICULTY[mode];

    return data
      .map((topic) => {
        const entry = topic.difficultyEntries[difficulty];
        return {
          tag: topic.topic,
          value: entry.durationPercentageComparison,
          numberOfSolved: entry.numberOfSolved,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [data, mode]);

  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.value)), 10);
  const domainPad = Math.ceil(maxAbs / 5) * 5 + 5;
  const chartHeight = Math.max(rows.length * 36, 144);

  return (
    <div className="relative min-w-0 w-full overflow-hidden rounded-2xl border border-[#1e1e1e] bg-[#111113] p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SectionHeader
          title="Speed vs. Average by Tag"
          description="% faster or slower than your overall average"
        />

        <DifficultyModeSelector value={mode} onChange={setMode} />
      </div>

      {rows.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-xs font-semibold text-neutral-600">
          No tag speed data yet
        </div>
      ) : (
        <div
          className="relative min-w-0"
          style={{ height: `${chartHeight}px` }}
        >
          <ResponsiveContainer width="100%" height={chartHeight} minWidth={0}>
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
                tickFormatter={(v) => formatPercent(Number(v))}
                tick={{
                  fill: "var(--color-zinc-300)",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-semibold)",
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
                  fill: "var(--color-zinc-300)",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-semibold)",
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
                  const row = payload[0]?.payload as
                    | {
                        tag?: string;
                        numberOfSolved?: number;
                      }
                    | undefined;
                  const tag = String(row?.tag ?? "");
                  let verdict = "matches average";
                  if (row?.numberOfSolved === 0) {
                    verdict = "no solves for this mode";
                  } else if (v > 0) {
                    verdict = "slower than avg";
                  } else if (v < 0) {
                    verdict = "faster than avg";
                  }
                  return (
                    <div className="rounded-xl border border-[#2e2e2e] bg-[#141414] px-3 py-2 font-mono text-xs shadow-xl font-semibold">
                      <p className="mb-0.5 text-xs text-zinc-300">{tag}</p>
                      <p className="text-stone-400">
                        {formatPercent(v)} - {verdict}
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="value" radius={[3, 3, 3, 3]} barSize={4}>
                {rows.map((r) => (
                  <Cell
                    key={r.tag}
                    fill={
                      r.value > 0
                        ? "var(--color-neutral-500)"
                        : "var(--color-stone-300)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
