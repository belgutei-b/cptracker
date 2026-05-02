"use client";

import { useState } from "react";
import { DIFFICULTY_COLORS as COLORS } from "@/constants/difficulty";
import { Difficulty } from "@/prisma/generated/prisma/enums";
import type { TopicRadarEntry } from "@/lib/userStat";

type Props = {
  data: TopicRadarEntry[];
};

type DifficultySegment = {
  difficulty: Difficulty;
  avgMin: number;
  numberOfSolved: number;
};

type Row = {
  topic: string;
  segments: DifficultySegment[];
  totalSolved: number;
  avgMin: number;
  sumAvgMin: number;
};

const ORDER: Difficulty[] = [
  Difficulty.Easy,
  Difficulty.Medium,
  Difficulty.Hard,
];

function buildRows(data: TopicRadarEntry[]): Row[] {
  return data
    .map((t) => {
      const entries = ORDER.map(
        (d) =>
          t.entries.find((e) => e.difficulty === d) ?? {
            difficulty: d,
            duration: 0,
            numberOfSolved: 0,
            durationPercentageComparison: 0,
          },
      );
      const segments: DifficultySegment[] = entries.map((e) => ({
        difficulty: e.difficulty,
        avgMin:
          e.numberOfSolved > 0
            ? Math.round(e.duration / e.numberOfSolved / 60)
            : 0,
        numberOfSolved: e.numberOfSolved,
      }));
      const totalSolved = entries.reduce((s, e) => s + e.numberOfSolved, 0);
      const totalDurationSec = entries.reduce((s, e) => s + e.duration, 0);
      const avgMin =
        totalSolved > 0
          ? Math.round(totalDurationSec / totalSolved / 60)
          : 0;
      const sumAvgMin = segments.reduce((s, seg) => s + seg.avgMin, 0);
      return { topic: t.topic, segments, totalSolved, avgMin, sumAvgMin };
    })
    .sort((a, b) => b.sumAvgMin - a.sumAvgMin);
}

export default function AvgSolveTimeByTopic({ data }: Props) {
  const rows = buildRows(data);
  const maxSumAvg = Math.max(...rows.map((r) => r.sumAvgMin), 0);
  const [hovered, setHovered] = useState<{
    topic: string;
    difficulty: Difficulty;
  } | null>(null);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#1e1e1e] bg-[#111113] p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-tight text-white">
            Avg Solve Time by Topic
          </p>
          <p className="mt-0.5 font-mono text-xs text-neutral-600">
            time spent per topic · split by difficulty
          </p>
        </div>

        <div className="flex items-center gap-4">
          {ORDER.map((label) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: COLORS[label] }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-xs font-semibold text-neutral-600">
          No topic data yet
        </div>
      ) : (
        <div className="flex flex-col">
          {rows.map((row, ri) => {
            const barWidthPct =
              maxSumAvg > 0 ? (row.sumAvgMin / maxSumAvg) * 100 : 0;
            return (
              <div
                key={row.topic}
                className={`grid items-center gap-4 py-2.5 ${
                  ri < rows.length - 1 ? "border-b border-[#1a1a1a]" : ""
                }`}
                style={{ gridTemplateColumns: "140px 1fr 110px" }}
              >
                <div className="truncate text-right text-[12.5px] font-medium text-neutral-300">
                  {row.topic}
                </div>

                <div className="relative h-5">
                  <div className="absolute inset-0 rounded bg-[#1a1a1a]" />
                  <div
                    className="absolute inset-y-0 left-0 flex overflow-hidden rounded"
                    style={{ width: `${barWidthPct}%` }}
                  >
                    {row.segments.map((seg) => {
                      const segPct =
                        row.sumAvgMin > 0
                          ? (seg.avgMin / row.sumAvgMin) * 100
                          : 0;
                      const isHov =
                        hovered?.topic === row.topic &&
                        hovered?.difficulty === seg.difficulty;

                      return (
                        <div
                          key={seg.difficulty}
                          className="relative cursor-default transition-opacity"
                          style={{
                            width: `${segPct}%`,
                            background: COLORS[seg.difficulty],
                            opacity: isHov ? 1 : 0.82,
                          }}
                          onMouseEnter={() =>
                            setHovered({
                              topic: row.topic,
                              difficulty: seg.difficulty,
                            })
                          }
                          onMouseLeave={() => setHovered(null)}
                        >
                          {isHov && (
                            <div className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-[#2e2e2e] bg-[#141414] px-2.5 py-1.5 font-mono text-[11px] shadow-xl">
                              <span
                                className="font-semibold"
                                style={{ color: COLORS[seg.difficulty] }}
                              >
                                {seg.difficulty}
                              </span>
                              <span className="text-neutral-400">
                                {" · "}
                                {seg.avgMin}m avg · {seg.numberOfSolved} solved
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="whitespace-nowrap text-right font-mono text-[11.5px] text-neutral-500">
                  <span className="font-medium text-neutral-300">
                    {row.avgMin} min
                  </span>
                  <span className="mx-1 text-neutral-700">·</span>
                  {row.totalSolved}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
