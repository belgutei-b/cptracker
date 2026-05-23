import { Difficulty } from "@/prisma/generated/prisma/enums";
import { Prisma } from "@/prisma/generated/prisma/client";

export type DifficultyEntry = {
  difficulty: Difficulty;
  duration: number;
  numberOfSolved: number;
  // (avg solve time of topic / avg solve time of all)
  // in specified difficulty
  durationPercentageComparison: number;
};

export type DifficultyEntries = Record<Difficulty, DifficultyEntry>;

export type BarChartColumn = {
  date: string;
  // entry for each difficulty + (all difficulty combined)
  difficultyEntries: DifficultyEntries;
};

export type TopicRadarEntry = {
  topic: string;
  // entry for each difficulty + all difficulty combined
  difficultyEntries: DifficultyEntries;
};

export type UserProblemWithProblem = Prisma.UserProblemGetPayload<{
  include: {
    problem: true;
  };
}>;

export type SessionWithProblem = Prisma.SolveSessionGetPayload<{
  include: {
    userProblem: {
      include: {
        problem: true;
      };
    };
  };
}>;
