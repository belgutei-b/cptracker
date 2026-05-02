"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { DIFFICULTY_COLORS as COLORS } from "@/constants/difficulty";
import { Difficulty } from "@/prisma/generated/prisma/enums";
import type { TopicRadarEntry } from "@/lib/userStat";

const ACCENT = "#ffa116";

type Props = {
  data: TopicRadarEntry[];
};

type RadarRow = {
  topic: string;
  totalSolved: number;
  byDifficulty: Record<"Easy" | "Medium" | "Hard", number>;
};

function toRadarData(topics: TopicRadarEntry[]): RadarRow[] {
  return topics.map((t) => {
    const get = (d: Difficulty) =>
      t.entries.find((e) => e.difficulty === d) ?? { numberOfSolved: 0 };
    return {
      topic: t.topic,
      totalSolved: t.numberOfSolved,
      byDifficulty: {
        Easy: get(Difficulty.Easy).numberOfSolved,
        Medium: get(Difficulty.Medium).numberOfSolved,
        Hard: get(Difficulty.Hard).numberOfSolved,
      },
    };
  });
}

export default function TagPerformanceRadar({ data }: Props) {
  const radarData = toRadarData(data);
  const sortedList = [...radarData].sort(
    (a, b) => b.totalSolved - a.totalSolved,
  );
  const maxSolved = sortedList[0]?.totalSolved ?? 0;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#1e1e1e] bg-[#111113] p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-tight text-white">
            Tag Performance Radar
          </p>
          <p className="mt-0.5 font-mono text-xs text-neutral-600">
            problems solved per tag
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: ACCENT }}
          />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
            Solved
          </span>
        </div>
      </div>

      {radarData.length === 0 ? (
        <div className="flex h-80 items-center justify-center text-xs font-semibold text-neutral-600">
          No tag data yet
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="relative h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#1e1e1e" />
                <PolarAngleAxis
                  dataKey="topic"
                  tick={{
                    fill: "#7e829e",
                    fontSize: 10.5,
                    fontFamily: "monospace",
                  }}
                />
                <PolarRadiusAxis
                  tick={false}
                  axisLine={false}
                  stroke="#1e1e1e"
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as RadarRow | undefined;
                    if (!row) return null;
                    const breakdown: Array<{
                      name: "Easy" | "Medium" | "Hard";
                      color: string;
                    }> = [
                      { name: "Easy", color: COLORS.Easy },
                      { name: "Medium", color: COLORS.Medium },
                      { name: "Hard", color: COLORS.Hard },
                    ];
                    return (
                      <div className="min-w-44 rounded-xl border border-[#2e2e2e] bg-[#141414] px-3 py-2.5 font-mono text-[11px] shadow-xl">
                        <div className="mb-1.5 flex items-baseline justify-between gap-3">
                          <p className="text-xs font-medium text-zinc-300">
                            {String(label)}
                          </p>
                          <p
                            className="text-[10px] font-semibold"
                            style={{ color: ACCENT }}
                          >
                            {row.totalSolved} solved
                          </p>
                        </div>
                        {breakdown.map((b) => (
                          <p
                            key={b.name}
                            className="leading-[1.7]"
                            style={{ color: b.color }}
                          >
                            {b.name}: {row.byDifficulty[b.name]} solved
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Radar
                  name="Solved"
                  dataKey="totalSolved"
                  stroke={ACCENT}
                  fill={ACCENT}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  dot={{ r: 3, fill: ACCENT, stroke: ACCENT }}
                  activeDot={{ r: 5, fill: ACCENT, strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <ul className="flex flex-col gap-2">
            {sortedList.map((row) => {
              const ratio = maxSolved > 0 ? row.totalSolved / maxSolved : 0;
              return (
                <li
                  key={row.topic}
                  className="flex items-center gap-3 rounded-lg border border-[#1e1e1e] bg-[#141414] px-3 py-2"
                >
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-neutral-200">
                    {row.topic}
                  </span>
                  <span className="relative h-px w-24 bg-[#2a2a2a]">
                    <span
                      className="absolute inset-y-0 left-0 bg-neutral-500"
                      style={{ width: `${ratio * 100}%` }}
                    />
                  </span>
                  <span className="font-mono text-xs tabular-nums text-neutral-300">
                    {row.totalSolved}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
