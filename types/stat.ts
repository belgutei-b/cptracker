import type { Difficulty } from "@/prisma/generated/prisma/enums";

export type BarChartData = {
  // month/day
  date: string;
  // seconds trying problems / for now just duration
  easy: number;
  medium: number;
  hard: number;
  // number of solved problems
  problemCount: number;
};

export type SolvedDurationStats = {
  difficulty: Difficulty | "Total";
  count: number;
  totalDuration: number;
}[];

export type UserStats = {
  stats: SolvedDurationStats;
  streakDays: number;
};
