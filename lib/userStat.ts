"use server";

import { Status } from "@/app/generated/prisma/enums";
import prisma from "./prisma";
import type { SolvedDurationStats } from "@/types/stat";
import type { BarChartData } from "@/types/stat";

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

export async function getBarChartData({
  numberOfDays,
  isSolvedOnly,
  userId,
}: {
  numberOfDays: number;
  isSolvedOnly: boolean;
  userId: string;
}): Promise<BarChartData[]> {
  console.log(numberOfDays, isSolvedOnly, userId);
  const now = new Date();
  const endDate = new Date(now);
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - (numberOfDays - 1));

  const statuses: Status[] = isSolvedOnly
    ? ["SOLVED"]
    : ["TRIED", "SOLVED", "IN_PROGRESS"];

  const rows = await prisma.userProblem.findMany({
    where: {
      userId,
      status: {
        in: statuses,
      },
      lastBeatAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      duration: true,
      lastBeatAt: true,
      problem: {
        select: {
          difficulty: true,
        },
      },
    },
  });

  const pad = (value: number) => String(value).padStart(2, "0");
  const toKey = (date: Date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const toLabel = (date: Date) =>
    `${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;

  const dayMap = new Map<string, BarChartData>();
  for (let i = 0; i < numberOfDays; i += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const key = toKey(date);
    dayMap.set(key, {
      date: toLabel(date),
      easy: 0,
      medium: 0,
      hard: 0,
      problemCount: 0,
    });
  }

  for (const row of rows) {
    if (!row.lastBeatAt) continue;
    const key = toKey(row.lastBeatAt);
    const entry = dayMap.get(key);
    if (!entry) continue;

    const duration = row.duration ?? 0;
    if (row.problem.difficulty === "Easy") entry.easy += duration;
    if (row.problem.difficulty === "Medium") entry.medium += duration;
    if (row.problem.difficulty === "Hard") entry.hard += duration;
    entry.problemCount += 1;
  }

  return Array.from(dayMap.values());
}
