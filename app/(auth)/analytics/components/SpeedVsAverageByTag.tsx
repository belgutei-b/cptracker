"use client";

import { useState } from "react";

import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/date";
import type { TopicRadarEntry } from "@/types/analytics";
import AnalyticsEmptyState from "./AnalyticsEmptyState";
import DifficultyModeSelector, {
  DIFFICULTY_MODE_TO_DIFFICULTY,
  type DifficultyMode,
} from "./DifficultyModeSelector";

type Props = {
  data: TopicRadarEntry[];
};

// never scale bars to less than this, so small differences stay small
const MIN_SCALE_PERCENT = 25;

const COLUMNS =
  "grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_88px] sm:grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)_64px_120px]";

/**
 * Each topic's average solve time compared with your overall average
 * for the same difficulty: faster topics grow left, slower ones right.
 */
export default function SpeedVsAverageByTag({ data }: Props) {
  const [mode, setMode] = useState<DifficultyMode>("all");
  const difficulty = DIFFICULTY_MODE_TO_DIFFICULTY[mode];

  const rows = data
    .map((topic) => {
      const entry = topic.difficultyEntries[difficulty];
      return {
        topic: topic.topic,
        percent: Math.round(entry.durationPercentageComparison),
        average: entry.avgSolveDuration,
        solved: entry.numberOfSolved,
      };
    })
    // fastest first, topics without solves at the end
    .sort((a, b) => Number(a.solved === 0) - Number(b.solved === 0) || a.percent - b.percent);

  const scale = Math.max(MIN_SCALE_PERCENT, ...rows.map((row) => Math.abs(row.percent)));

  return (
    <AnalyticsCard
      title="Strong and weak topics"
      description="Each topic's average solve time vs your overall average"
      actions={
        data.length > 0 && <DifficultyModeSelector value={mode} onChange={setMode} />
      }
    >
      {rows.length === 0 ? (
        <AnalyticsEmptyState>Solve a few problems to compare topics</AnalyticsEmptyState>
      ) : (
        <div className="flex flex-col text-sm">
          <div aria-hidden className={cn("grid border-b pb-1.5 text-xs text-muted-foreground", COLUMNS)}>
            <span className="max-sm:hidden">Topic</span>
            <span className="text-right max-sm:col-start-2 sm:pr-2.5">faster</span>
            <span className="pl-2.5">slower</span>
            <span className="hidden text-right sm:block">avg</span>
            <span className="text-right">vs average</span>
          </div>

          <ul>
            {rows.map((row) => {
              const width = `${(Math.abs(row.percent) / scale) * 100}%`;
              const hasSolves = row.solved > 0;
              const isFaster = hasSolves && row.percent < 0;
              const isSlower = hasSolves && row.percent > 0;

              return (
                <li
                  key={row.topic}
                  className={cn(
                    "grid items-center gap-y-1 py-2 max-sm:border-b max-sm:last:border-b-0 sm:h-10 sm:py-0",
                    COLUMNS,
                  )}
                >
                  <span className="truncate max-sm:col-span-full">{row.topic}</span>
                  <span aria-hidden className="flex h-3.5 justify-end max-sm:col-start-2">
                    {isFaster && <span className="rounded-l-[3px] bg-primary" style={{ width }} />}
                  </span>
                  <span aria-hidden className="flex h-3.5 border-l border-foreground/20">
                    {isSlower && <span className="rounded-r-[3px] bg-hard" style={{ width }} />}
                  </span>
                  <span className="hidden text-right font-mono text-[13px] text-foreground/75 sm:block">
                    {hasSolves ? formatDuration(Math.round(row.average)) : "—"}
                  </span>
                  <span
                    className={cn(
                      "text-right font-mono text-[13px]",
                      isFaster && "text-primary",
                      isSlower && "text-hard",
                      !isFaster && !isSlower && "text-muted-foreground",
                    )}
                  >
                    {!hasSolves
                      ? "no solves"
                      : row.percent === 0
                        ? "on average"
                        : `${Math.abs(row.percent)}% ${isFaster ? "faster" : "slower"}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </AnalyticsCard>
  );
}
