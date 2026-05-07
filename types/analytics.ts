import { Difficulty } from "@/prisma/generated/prisma/enums";
import { Prisma } from "@/prisma/generated/prisma/client";

export type AvgSolveTime = {
  difficulty: Difficulty;
  duration: number;
  numberOfSolved: number;
  // x% up compared to last week
  comparisonToPreviousTimeline: number;
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

export type UserProblemWithProblem = Prisma.UserProblemGetPayload<{
  include: {
    problem: true;
  };
}>;
