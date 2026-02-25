"use server";

import { Status } from "@/prisma/generated/prisma/enums";
import prisma from "@/lib/prisma";
import type { BarChartData } from "@/types/stat";

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
        : (row.lastStartedAt ?? row.updatedAt);

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
