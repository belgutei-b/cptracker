"use server";

import { Difficulty } from "@/prisma/generated/prisma/enums";
import prisma from "@/lib/prisma";
import type { BarChartData } from "@/types/stat";
import { DateTime } from "luxon";
import { Prisma, UserProblem } from "@/prisma/generated/prisma/client";
import { Diff } from "lucide-react";

type DifficultyKey = keyof Pick<BarChartData, "easy" | "medium" | "hard">;

const difficultyToKey: Record<Difficulty, DifficultyKey> = {
  [Difficulty.Easy]: "easy",
  [Difficulty.Medium]: "medium",
  [Difficulty.Hard]: "hard",
};

function difficultyToIndex(difficulty: Difficulty) {
  if (difficulty === "Easy") return 0;
  if (difficulty === "Medium") return 1;
  else return 2;
}

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

export type AvgSolveTime = {
  difficulty: Difficulty;
  duration: number;
  numberOfSolved: number;
  // x% up compared to last week
  comparisonToLastWeek: number;
};

export type StatEntry = {
  difficulty: Difficulty;
  duration: number;
  numberOfSolved: number;
  durationPercentageComparison: number;
};

export type BarChartColumn = {
  date: string;
  entries: StatEntry[];
};

export type TopicRadarEntry = {
  topic: string;
  numberOfSolved: number;
  durationPercentageComparison: number;
  entries: StatEntry[];
};

type UserProblemWithProblem = Prisma.UserProblemGetPayload<{
  include: {
    problem: true;
  };
}>;

// return top 8 topics for charts

function tagsData({ problems }: { problems: UserProblemWithProblem[] }) {
  const topics: TopicRadarEntry[] = [];

  const topicsMap = new Map<string, TopicRadarEntry>();

  // TODO: use only solved problems
  for (let problem of problems) {
    // TODO: the below if statment should be removed
    // once it iterates in solved problems
    if (problem.status !== "SOLVED") continue;

    for (let topic of problem.problem.tags) {
      let topicEntry = topicsMap.get(topic);
      if (!topicEntry) {
        // new entry — each topic gets its own entries array
        const entries: StatEntry[] = Object.values(Difficulty).map(
          (difficulty) => ({
            difficulty,
            duration: 0,
            numberOfSolved: 0,
            durationPercentageComparison: 0,
          }),
        );
        topicEntry = {
          topic,
          numberOfSolved: 0,
          durationPercentageComparison: 0,
          entries,
        };
        topicsMap.set(topic, topicEntry);
      }
      topicEntry.entries[
        difficultyToIndex(problem.problem.difficulty)
      ].duration += problem.duration;
      topicEntry.entries[
        difficultyToIndex(problem.problem.difficulty)
      ].numberOfSolved += 1;
      topicEntry.numberOfSolved += 1;
    }
  }

  // select the top 8 by the number of solved problems
  topicsMap.forEach((value) => topics.push(value));
  topics.sort((a, b) => b.numberOfSolved - a.numberOfSolved);

  return topics.slice(0, 8);
}

export async function getBarChartDataV2({
  query,
}: {
  query: {
    numberOfDays: number;
    userId: string;
    timezone: string;
  };
}) {
  // 1. avg solve time this week for easy, medium and hard (this week)
  // return  [{difficulty, comparisonToLastWeek: number}]
  const now = DateTime.now().setZone(query.timezone);
  const start = now
    .minus({ days: query.numberOfDays - 1 })
    .startOf("day")
    .toJSDate();

  const solvedProblems = await prisma.userProblem.findMany({
    where: {
      userId: query.userId,
      solvedAt: { gte: start },
    },
    include: {
      problem: true,
    },
  });

  const avgSolveTime = new Array<AvgSolveTime>();
  for (let difficulty of Object.values(Difficulty)) {
    const difficultyStat: AvgSolveTime = {
      difficulty,
      duration: 0,
      numberOfSolved: 0,
      comparisonToLastWeek: 0,
    };

    for (let solvedProblem of solvedProblems) {
      if (solvedProblem.problem.difficulty === difficulty) {
        difficultyStat.duration += solvedProblem.duration;
        difficultyStat.numberOfSolved += 1;
      }
    }
    avgSolveTime.push(difficultyStat);
  }

  // 2. current total time on each day bar chart
  // return [{
  //    date,
  //    dayStat: [{difficulty, duration, numberOfSolved}]
  // }]
  const sessions = await prisma.solveSession.findMany({
    where: {
      userProblem: {
        userId: query.userId,
      },
      OR: [{ finishedAt: null }, { finishedAt: { gte: start } }],
    },
    include: {
      userProblem: {
        include: {
          problem: true,
        },
      },
    },
  });

  const problems = await prisma.userProblem.findMany({
    where: {
      userId: query.userId,
      status: "SOLVED",
      solvedAt: { gte: start },
    },
    include: {
      problem: true,
    },
  });

  const dailyBarChart = new Array<BarChartColumn>();
  for (let i = query.numberOfDays - 1; i >= 0; i--) {
    const idx = query.numberOfDays - 1 - i;

    // between start and end of the day
    const day = now.minus({ days: i });
    const startOfDayJs = day.startOf("day").toJSDate();
    const endOfDayJS = day.endOf("day").toJSDate();

    const dayStats = new Array<StatEntry>();
    for (let difficulty of Object.values(Difficulty)) {
      dayStats.push({
        difficulty,
        duration: 0,
        numberOfSolved: 0,
        durationPercentageComparison: 0,
      });
    }

    // updating numberOfSolved
    for (let problem of problems) {
      if (
        problem.solvedAt &&
        startOfDayJs <= problem.solvedAt &&
        problem.solvedAt <= endOfDayJS
      ) {
        const target = dayStats.find(
          (s) => s.difficulty === problem.problem.difficulty,
        );
        if (target) target.numberOfSolved += 1;
      }
    }

    // updating duration
    for (let session of sessions) {
      // Either has finishedAt or currently running
      const finishedAt = session.finishedAt ?? new Date();

      const newStart =
        session.startedAt > startOfDayJs ? session.startedAt : startOfDayJs;
      const newEnd = finishedAt < endOfDayJS ? finishedAt : endOfDayJS;

      // on i-th day the session is from newStart -> newEnd
      if (newEnd > newStart) {
        const target = dayStats.find(
          (s) => s.difficulty === session.userProblem.problem.difficulty,
        );
        if (target) {
          target.duration += Math.floor(
            (newEnd.getTime() - newStart.getTime()) / 1000,
          );
        }
      }
    }

    dailyBarChart.push({
      date: day.toFormat("yyyy LLL dd"),
      entries: dayStats,
    });
  }

  // 3. number of solved problems in most common 8 topics
  // return [{topic, numberOfSolved}]

  const tagsReceivedData = tagsData({ problems });

  return {
    avgSolveTime,
    dailyBarChart,
    tagsReceivedData,
  };
}
