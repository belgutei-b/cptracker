"use server";

import { Difficulty } from "@/prisma/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { DateTime } from "luxon";
import type {
  DifficultyEntries,
  BarChartColumn,
  TopicRadarEntry,
  UserProblemWithProblem,
  SessionWithProblem,
} from "@/types/analytics";

function createEmptyDifficultyEntries(): DifficultyEntries {
  const difficultyEntries: Partial<DifficultyEntries> = {};

  for (const difficulty of Object.values(Difficulty)) {
    difficultyEntries[difficulty] = {
      difficulty,
      duration: 0,
      numberOfSolved: 0,
      durationPercentageComparison: 0,
    };
  }

  return difficultyEntries as DifficultyEntries;
}

// return top 10 topics for charts
function tagsData({
  solvedProblemsCurrent,
  avgSolveTime,
}: {
  solvedProblemsCurrent: UserProblemWithProblem[];
  avgSolveTime: DifficultyEntries;
}) {
  const topics: TopicRadarEntry[] = [];

  const topicsMap = new Map<string, TopicRadarEntry>();

  for (const problem of solvedProblemsCurrent) {
    for (const topic of problem.problem.tags) {
      let topicEntry = topicsMap.get(topic);
      if (!topicEntry) {
        topicEntry = {
          topic,
          difficultyEntries: createEmptyDifficultyEntries(),
        };
        topicsMap.set(topic, topicEntry);
      }

      // duration for difficulty
      topicEntry.difficultyEntries[problem.problem.difficulty].duration +=
        problem.duration;

      // number of solved for difficulty
      topicEntry.difficultyEntries[problem.problem.difficulty].numberOfSolved +=
        1;

      topicEntry.difficultyEntries.All.duration += problem.duration;
      topicEntry.difficultyEntries.All.numberOfSolved += 1;
    }
  }

  // select the top 10 by the number of solved problems
  topicsMap.forEach((value) => topics.push(value));
  topics.sort(
    (a, b) =>
      b.difficultyEntries.All.numberOfSolved -
      a.difficultyEntries.All.numberOfSolved,
  );

  const topTopics = topics.slice(0, 10);

  for (const topic of topTopics) {
    for (const difficulty of Object.values(Difficulty)) {
      const topicDifficultyEntry = topic.difficultyEntries[difficulty];
      const averageDifficultyEntry = avgSolveTime[difficulty];

      if (
        topicDifficultyEntry.numberOfSolved === 0 ||
        averageDifficultyEntry.numberOfSolved === 0
      ) {
        continue;
      }

      const topicAvg =
        topicDifficultyEntry.duration / topicDifficultyEntry.numberOfSolved;
      const overallAvg =
        averageDifficultyEntry.duration / averageDifficultyEntry.numberOfSolved;

      if (overallAvg !== 0) {
        topicDifficultyEntry.durationPercentageComparison =
          ((topicAvg - overallAvg) / overallAvg) * 100;
      }
    }
  }

  return topTopics;
}

// average solve time on each difficulty
// during this timeline
function getAvgSolveTime({
  currentSolvedProblems,
  previousSolvedProblems,
}: {
  currentSolvedProblems: UserProblemWithProblem[];
  previousSolvedProblems: UserProblemWithProblem[];
}): DifficultyEntries {
  const avgSolveTime = createEmptyDifficultyEntries();
  const previousSolveTime = createEmptyDifficultyEntries();

  for (const problem of currentSolvedProblems) {
    avgSolveTime[problem.problem.difficulty].numberOfSolved += 1;
    avgSolveTime[problem.problem.difficulty].duration += problem.duration;
    avgSolveTime.All.numberOfSolved += 1;
    avgSolveTime.All.duration += problem.duration;
  }

  for (const problem of previousSolvedProblems) {
    previousSolveTime[problem.problem.difficulty].numberOfSolved += 1;
    previousSolveTime[problem.problem.difficulty].duration += problem.duration;
    previousSolveTime.All.numberOfSolved += 1;
    previousSolveTime.All.duration += problem.duration;
  }

  for (const difficulty of Object.values(Difficulty)) {
    // average solve time for
    // this timeline and previous timeline
    const previous = previousSolveTime[difficulty];
    const previousAvg =
      previous.numberOfSolved === 0
        ? 0
        : previous.duration / previous.numberOfSolved;
    const currentAvg =
      avgSolveTime[difficulty].numberOfSolved === 0
        ? 0
        : avgSolveTime[difficulty].duration /
          avgSolveTime[difficulty].numberOfSolved;

    // only shows the change if there is solved problem in
    // this timeline & previous timeline
    if (currentAvg !== 0 && previousAvg !== 0) {
      avgSolveTime[difficulty].durationPercentageComparison =
        ((currentAvg - previousAvg) / previousAvg) * 100;
    }
  }

  return avgSolveTime;
}

async function getDailyTotalTimeBarChart({
  sessions,
  solvedProblemsCurrent,
  numberOfDays,
  now,
}: {
  sessions: SessionWithProblem[];
  solvedProblemsCurrent: UserProblemWithProblem[];
  numberOfDays: number;
  now: DateTime<true> | DateTime<false>;
}) {
  const dailyBarChart = new Array<BarChartColumn>();
  for (let i = numberOfDays - 1; i >= 0; i--) {
    // between start and end of the day
    const day = now.minus({ days: i });
    const startOfDayJs = day.startOf("day").toJSDate();
    const endOfDayJS = day.endOf("day").toJSDate();

    const dayStats = createEmptyDifficultyEntries();

    // updating numberOfSolved
    for (const problem of solvedProblemsCurrent) {
      if (
        problem.solvedAt &&
        startOfDayJs <= problem.solvedAt &&
        problem.solvedAt <= endOfDayJS
      ) {
        dayStats[problem.problem.difficulty].numberOfSolved += 1;
        dayStats.All.numberOfSolved += 1;
      }
    }

    // updating duration
    for (const session of sessions) {
      // Either has finishedAt or currently running
      const finishedAt = session.finishedAt ?? new Date();

      const newStart =
        session.startedAt > startOfDayJs ? session.startedAt : startOfDayJs;
      const newEnd = finishedAt < endOfDayJS ? finishedAt : endOfDayJS;

      // on i-th day the session is from newStart -> newEnd
      if (newEnd > newStart) {
        const duration = Math.floor(
          (newEnd.getTime() - newStart.getTime()) / 1000,
        );
        dayStats[session.userProblem.problem.difficulty].duration += duration;
        dayStats.All.duration += duration;
      }
    }

    dailyBarChart.push({
      date: day.toFormat("yyyy LLL dd"),
      difficultyEntries: dayStats,
    });
  }

  return dailyBarChart;
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
  const now = DateTime.now().setZone(query.timezone);
  const currentTimelineStart = now
    .minus({ days: query.numberOfDays - 1 })
    .startOf("day")
    .toJSDate();

  // used for speed comparison to previous timeline
  const previousTimelineStart = now
    .minus({ days: query.numberOfDays * 2 - 1 })
    .startOf("day")
    .toJSDate();

  const solvedProblemsCurrent = await prisma.userProblem.findMany({
    where: {
      userId: query.userId,
      status: "SOLVED",
      solvedAt: { gte: currentTimelineStart },
    },
    include: {
      problem: true,
    },
  });

  const solvedProblemsPrevious = await prisma.userProblem.findMany({
    where: {
      userId: query.userId,
      status: "SOLVED",
      solvedAt: {
        gte: previousTimelineStart,
        lt: currentTimelineStart,
      },
    },
    include: {
      problem: true,
    },
  });

  const sessions = await prisma.solveSession.findMany({
    where: {
      userProblem: {
        userId: query.userId,
      },
      OR: [{ finishedAt: null }, { finishedAt: { gte: currentTimelineStart } }],
    },
    include: {
      userProblem: {
        include: {
          problem: true,
        },
      },
    },
  });

  // 1. Average solve time of each difficulty
  // return DifficultyEntries = Record<Difficulty, DifficultyEntry>
  const avgSolveTime = getAvgSolveTime({
    currentSolvedProblems: solvedProblemsCurrent,
    previousSolvedProblems: solvedProblemsPrevious,
  });

  // 2. total time on each day bar chart
  // return [BarChartColumn] =  [{
  //    date,
  //    difficultyEntries
  // }]
  const dailyBarChart = await getDailyTotalTimeBarChart({
    sessions,
    solvedProblemsCurrent,
    numberOfDays: query.numberOfDays,
    now,
  });

  // 3. number of solved problems in most common 10 topics
  // return [{topic, DifficultyEntries}]
  const tagsReceivedData: TopicRadarEntry[] = tagsData({
    solvedProblemsCurrent,
    avgSolveTime,
  });

  return {
    avgSolveTime,
    dailyBarChart,
    tagsReceivedData,
  };
}
