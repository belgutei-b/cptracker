"use client";

import AverageDuration from "@/components/stat/AverageDuration";
import BoxStats from "./BoxStats";
import DifficultyRatio from "./DifficultyRatio";
import { type UserProblemFullClient } from "@/types/client";
import { type SolvedDurationStats } from "@/types/stat";
import StatSkeloton from "@/components/stat/StatSkeloton";

export default function Stat({
  problems,
  timezone,
  className,
  isLoading,
}: {
  problems: UserProblemFullClient[];
  timezone: string;
  className?: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <StatSkeloton />;
  }
  /* Filtering only solved problems */
  const solvedProblems = problems.filter(
    (problem) => problem.status === "SOLVED",
  );

  let lastSolvedAt: string | null = null;

  const stats: SolvedDurationStats = [
    {
      difficulty: "Easy",
      count: 0,
      totalDuration: 0,
    },
    {
      difficulty: "Medium",
      count: 0,
      totalDuration: 0,
    },
    {
      difficulty: "Hard",
      count: 0,
      totalDuration: 0,
    },
    {
      difficulty: "Total",
      count: 0,
      totalDuration: 0,
    },
  ];

  for (const entry of solvedProblems) {
    /* Updating last solved problem */
    if (!lastSolvedAt && entry.solvedAt) {
      lastSolvedAt = entry.solvedAt;
    } else if (
      lastSolvedAt &&
      entry.solvedAt &&
      new Date(lastSolvedAt) < new Date(entry.solvedAt)
    ) {
      lastSolvedAt = entry.solvedAt;
    }

    // updating stat
    const difficulty = entry.problem.difficulty;
    const stat = stats.find((s) => s.difficulty === difficulty);
    if (!stat) {
      continue;
    }
    if (stat.difficulty === difficulty) {
      stat.count += 1;
      stat.totalDuration += entry.duration ?? 0;
    }
  }

  const totalStat = stats.find((stat) => stat.difficulty === "Total");
  if (totalStat) {
    for (const stat of stats) {
      if (stat.difficulty === "Total") continue;
      totalStat.count += stat.count;
      totalStat.totalDuration += stat.totalDuration;
    }
  }

  return (
    <div className={["space-y-6", className].filter(Boolean).join(" ")}>
      <BoxStats stats={stats} lastSolvedAt={lastSolvedAt} timezone={timezone} />
      <AverageDuration stats={stats} />
      <DifficultyRatio stats={stats} />
    </div>
  );
}
