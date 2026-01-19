"use server";

import prisma from "./prisma";
import type { Difficulty } from "../app/generated/prisma/enums";

export type SolvedDurationStats = {
  difficulty: Difficulty | "Total";
  count: number;
  totalDuration: number;
  averageMin: number;
}[];

export async function getUserStats({
  userId,
}: {
  userId: string;
}): Promise<SolvedDurationStats> {
  const solved = await prisma.userProblem.findMany({
    where: {
      userId,
      status: "SOLVED",
    },
    select: {
      duration: true,
      problem: {
        select: {
          difficulty: true,
        },
      },
    },
  });

  const stats: SolvedDurationStats = [
    {
      difficulty: "Easy",
      count: 0,
      totalDuration: 0,
      averageMin: 0,
    },
    {
      difficulty: "Medium",
      count: 0,
      totalDuration: 0,
      averageMin: 0,
    },
    {
      difficulty: "Hard",
      count: 0,
      totalDuration: 0,
      averageMin: 0,
    },
    {
      difficulty: "Total",
      count: 0,
      totalDuration: 0,
      averageMin: 0,
    },
  ];

  for (const entry of solved) {
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

  for (const stat of stats) {
    if (stat.count > 0) {
      stat.averageMin = Math.floor(stat.totalDuration / 60 / stat.count);
      // second -> min
      stat.totalDuration = Math.floor(stat.totalDuration / 60);
    }
  }

  return stats;
}
