"use client";

import { useMemo, useState } from "react";
import { DIFFICULTY_COLORS as COLORS } from "@/constants/difficulty";
import { Difficulty } from "@/prisma/generated/prisma/enums";
import type { TopicRadarEntry } from "@/types/analytics";
import DifficultyModeSelector, {
  DIFFICULTY_MODE_TO_DIFFICULTY,
  type DifficultyMode,
} from "./DifficultyModeSelector";
import SectionHeader from "./SectionHeader";

type Props = {
  data: TopicRadarEntry[];
};

type DisplayDifficulty = Exclude<Difficulty, "All">;

type DifficultySegment = {
  difficulty: DisplayDifficulty;
  avgMin: number;
  numberOfSolved: number;
};

type Row = {
  topic: string;
  segments: DifficultySegment[];
  totalSolved: number;
  avgMin: number;
  sumAvgMin: number;
  barWidthMin: number;
};

const ORDER: DisplayDifficulty[] = [
  Difficulty.Easy,
  Difficulty.Medium,
  Difficulty.Hard,
];

function getAvgMin({
  duration,
  numberOfSolved,
}: {
  duration: number;
  numberOfSolved: number;
}): number {
  return numberOfSolved > 0 ? Math.round(duration / numberOfSolved / 60) : 0;
}

function buildRows(data: TopicRadarEntry[], mode: DifficultyMode): Row[] {
  const selectedDifficulty = DIFFICULTY_MODE_TO_DIFFICULTY[mode];

  return data
    .map((t) => {
      const entries =
        selectedDifficulty === Difficulty.All
          ? ORDER.map((d) => t.difficultyEntries[d])
          : [t.difficultyEntries[selectedDifficulty as DisplayDifficulty]];

      const segments: DifficultySegment[] = entries.map((e, index) => ({
        difficulty:
          selectedDifficulty === Difficulty.All
            ? ORDER[index]
            : (selectedDifficulty as DisplayDifficulty),
        avgMin: getAvgMin(e),
        numberOfSolved: e.numberOfSolved,
      }));
      const totalEntry = t.difficultyEntries[selectedDifficulty];
      const avgMin = getAvgMin(totalEntry);
      const sumAvgMin = segments.reduce((s, seg) => s + seg.avgMin, 0);
      return {
        topic: t.topic,
        segments,
        totalSolved: totalEntry.numberOfSolved,
        avgMin,
        sumAvgMin,
        barWidthMin: avgMin,
      };
    })
    .sort((a, b) => b.barWidthMin - a.barWidthMin);
}

export default function AvgSolveTimeByTopic({ data }: Props) {
  const [mode, setMode] = useState<DifficultyMode>("all");
  const rows = useMemo(() => buildRows(data, mode), [data, mode]);
  const maxAvg = Math.max(...rows.map((r) => r.barWidthMin), 0);
  const [hovered, setHovered] = useState<{
    topic: string;
    difficulty: DisplayDifficulty;
  } | null>(null);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#1e1e1e] bg-[#111113] p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SectionHeader
          title="Avg Solve Time by Topic"
          description="time spent per topic"
        />

        <DifficultyModeSelector value={mode} onChange={setMode} />
      </div>

      {rows.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-xs font-semibold text-neutral-600">
          No topic data yet
        </div>
      ) : (
        <div className="flex flex-col">
          {rows.map((row, ri) => {
            const barWidthPct =
              maxAvg > 0 ? (row.barWidthMin / maxAvg) * 100 : 0;
            return (
              <div
                key={row.topic}
                className={`grid items-center gap-4 py-3 ${
                  ri < rows.length - 1 ? "border-b border-[#1a1a1a]" : ""
                }`}
                style={{ gridTemplateColumns: "140px 1fr 110px" }}
              >
                <div className="truncate text-right text-xs font-semibold text-stone-300">
                  {row.topic}
                </div>

                <div className="relative h-1">
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
                          {/* TODO: fix this hover issue */}
                          {/* {isHov && (
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
                          )} */}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="whitespace-nowrap text-right font-mono text-xs font-semibold text-stone-300">
                  <span className="">{row.avgMin} min</span>
                  <span className="mx-1">·</span>
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
