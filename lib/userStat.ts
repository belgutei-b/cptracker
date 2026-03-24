"use server";

import { Difficulty } from "@/prisma/generated/prisma/enums";
import prisma from "@/lib/prisma";
import type { BarChartData } from "@/types/stat";
import { DateTime } from "luxon";

type DifficultyKey = keyof Pick<BarChartData, "easy" | "medium" | "hard">;

const difficultyToKey: Record<Difficulty, DifficultyKey> = {
  [Difficulty.Easy]: "easy",
  [Difficulty.Medium]: "medium",
  [Difficulty.Hard]: "hard",
};

/**
 * @returns {Promise<Array<{
 *   date: string;
 *   easy: number; // seconds solving easy problems
 *   medium: number;
 *   hard: number;
 *   problemCount: number;
 * }>>}
 */
export async function getBarChartData({
  numberOfDays,
  userId,
  timezone,
}: {
  numberOfDays: number;
  userId: string;
  timezone: string;
}): Promise<BarChartData[]> {
  /* computing the start time in user timezone and then converting to UTC */
  const start = DateTime.now()
    .setZone(timezone)
    .minus({ days: numberOfDays - 1 })
    .startOf("day")
    .toJSDate();

  const solvedProblems = await prisma.userProblem.findMany({
    where: {
      userId,
      solvedAt: { gte: start },
    },
    select: { solvedAt: true },
  });

  const rows = await prisma.solveSession.findMany({
    where: {
      userProblem: {
        userId: userId,
      },
      OR: [
        { finishedAt: null },
        {
          finishedAt: {
            gte: start,
          },
        },
      ],
    },
    include: {
      userProblem: {
        include: {
          problem: true,
        },
      },
    },
  });

  const ret: BarChartData[] = [];

  const now = DateTime.now().setZone(timezone);
  for (let i = numberOfDays - 1; i >= 0; i--) {
    const idx = numberOfDays - 1 - i;

    // between start and end of the day
    const day = now.minus({ days: i });
    const startOfDayJs = day.startOf("day").toJSDate();
    const endOfDayJS = day.endOf("day").toJSDate();

    ret.push({
      date: day.toFormat("yyyy LLL dd"),
      easy: 0,
      medium: 0,
      hard: 0,
      problemCount: 0,
    });

    // number of solved problems
    ret[idx].problemCount = solvedProblems.filter(
      (p) => p.solvedAt! >= startOfDayJs && p.solvedAt! < endOfDayJS,
    ).length;

    // sessions
    for (const row of rows) {
      const difficulty: Difficulty = row.userProblem.problem.difficulty;
      const key = difficultyToKey[difficulty];

      const finishedAt = row.finishedAt ?? new Date();

      // on day, start and beginning
      const newStart =
        row.startedAt > startOfDayJs ? row.startedAt : startOfDayJs;
      const newEnd = finishedAt < endOfDayJS ? finishedAt : endOfDayJS;

      // adding number of seconds between [newStart, newEnd]
      if (newEnd > newStart) {
        ret[idx][key] += Math.floor(
          (newEnd.getTime() - newStart.getTime()) / 1000,
        );
      }
    }
  }

  return ret;
}
