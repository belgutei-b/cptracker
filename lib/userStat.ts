"use server";

import { Status } from "@/prisma/generated/prisma/enums";
import prisma from "./prisma";
import type { SolvedDurationStats } from "@/types/stat";
import type { BarChartData } from "@/types/stat";
import type { UserStats } from "@/types/stat";

function toLocalDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getSolvedStreakDays(solvedDates: Date[]) {
  const solvedDaySet = new Set(solvedDates.map((date) => toLocalDateKey(date)));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  let streak = 0;
  while (solvedDaySet.has(toLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export async function getUserStats({
  userId,
}: {
  userId: string;
}): Promise<UserStats> {
  const solved = await prisma.userProblem.findMany({
    where: {
      userId,
      status: "SOLVED",
    },
    select: {
      duration: true,
      solvedAt: true,
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

  const solvedDates = solved
    .map((entry) => entry.solvedAt)
    .filter((value): value is Date => value instanceof Date);
  const streakDays = getSolvedStreakDays(solvedDates);

  return {
    stats,
    streakDays,
  };
}

export async function getBarChartData({
  numberOfDays,
  userId,
}: {
  numberOfDays: number;
  userId: string;
}): Promise<BarChartData[]> {
  const now = new Date();
  const endDate = new Date(now);
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - (numberOfDays - 1));

  const statuses: Status[] = ["TRIED", "SOLVED", "IN_PROGRESS"];

  const rows = await prisma.userProblem.findMany({
    where: {
      userId,
      status: {
        in: statuses,
      },
      OR: [
        {
          solvedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          lastStartedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          lastBeatAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          updatedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      ],
    },
    select: {
      status: true,
      duration: true,
      solvedAt: true,
      lastStartedAt: true,
      lastBeatAt: true,
      updatedAt: true,
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
    const durationDate =
      row.status === "SOLVED"
        ? row.solvedAt
        : (row.lastStartedAt ?? row.lastBeatAt ?? row.updatedAt);

    if (!durationDate) continue;

    const key = toKey(durationDate);
    const entry = dayMap.get(key);
    if (!entry) continue;

    let duration = row.duration ?? 0;
    if (row.status === "IN_PROGRESS" && row.lastStartedAt) {
      duration += Math.max(
        0,
        Math.floor((now.getTime() - row.lastStartedAt.getTime()) / 1000),
      );
    }

    if (row.problem.difficulty === "Easy") entry.easy += duration;
    if (row.problem.difficulty === "Medium") entry.medium += duration;
    if (row.problem.difficulty === "Hard") entry.hard += duration;

    if (row.status === "SOLVED" && row.solvedAt) {
      entry.problemCount += 1;
    }
  }

  return Array.from(dayMap.values());
}
