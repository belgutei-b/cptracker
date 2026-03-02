"use server";

import { Difficulty, Status } from "@/prisma/generated/prisma/enums";
import prisma from "@/lib/prisma";
import type { BarChartData } from "@/types/stat";
import { DateTime } from "luxon";

type DifficultyKey = keyof Pick<BarChartData, "easy" | "medium" | "hard">;

const difficultyToKey: Record<Difficulty, DifficultyKey> = {
  [Difficulty.Easy]: "easy",
  [Difficulty.Medium]: "medium",
  [Difficulty.Hard]: "hard",
};

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

  const end = DateTime.now().setZone(timezone).endOf("day").toJSDate();

  const rows = await prisma.userProblem.findMany({
    where: {
      userId,
      OR: [
        {
          solvedAt: {
            gte: start,
            lte: end,
          },
          status: "SOLVED",
        },
        {
          triedAt: {
            gte: start,
            lte: end,
          },
          status: "TRIED",
        },
        {
          status: "IN_PROGRESS",
        },
      ],
    },
    select: {
      status: true,
      duration: true,
      solvedAt: true,
      triedAt: true,
      lastStartedAt: true,
      updatedAt: true,
      problem: {
        select: {
          difficulty: true,
        },
      },
    },
  });

  const ret: BarChartData[] = [];
  const now = DateTime.now().setZone(timezone);

  for (let i = numberOfDays - 1; i >= 0; i--) {
    const idx = numberOfDays - 1 - i;

    const day = now.minus({ days: i });
    const startOfDayJS = day.startOf("day").toJSDate();
    const endOfDayJS = day.endOf("day").toJSDate();

    ret.push({
      date: day.toFormat("yyyy LLL dd"),
      easy: 0,
      medium: 0,
      hard: 0,
      problemCount: 0,
    });

    for (const row of rows) {
      /* IN_PROGRESS */
      if (row.status === Status.IN_PROGRESS && i === 0) {
        const difficulty: Difficulty = row.problem.difficulty;
        const key = difficultyToKey[difficulty];
        ret[idx][key] += row.duration;
      }

      /* TRIED */
      if (
        row.status === Status.TRIED &&
        row.triedAt &&
        startOfDayJS <= row.triedAt &&
        row.triedAt <= endOfDayJS
      ) {
        const difficulty: Difficulty = row.problem.difficulty;
        const key = difficultyToKey[difficulty];
        ret[idx][key] += row.duration;
      }

      /* SOLVED */
      if (
        row.status === Status.SOLVED &&
        row.solvedAt &&
        startOfDayJS <= row.solvedAt &&
        row.solvedAt <= endOfDayJS
      ) {
        const difficulty: Difficulty = row.problem.difficulty;
        const key = difficultyToKey[difficulty];
        ret[idx][key] += row.duration;
        ret[idx].problemCount += 1;
      }
    }
  }

  return ret;
}
