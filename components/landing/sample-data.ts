import type { ProblemDifficulty } from "@/constants/difficulty";
import type { Status } from "@/prisma/generated/prisma/enums";

/*
 * Illustrative numbers for the landing page previews. Not real user data.
 */

export const PREVIEW_PROBLEMS: {
  title: string;
  difficulty: ProblemDifficulty;
  status: Status;
  time: string;
}[] = [
  { title: "3Sum", difficulty: "Medium", status: "IN_PROGRESS", time: "18m 32s" },
  { title: "Trapping Rain Water", difficulty: "Hard", status: "TRIED", time: "48m 10s" },
  { title: "Two Sum", difficulty: "Easy", status: "SOLVED", time: "12m 40s" },
  { title: "Coin Change", difficulty: "Medium", status: "SOLVED", time: "27m 14s" },
  { title: "Number of Islands", difficulty: "Medium", status: "SOLVED", time: "21m 47s" },
  { title: "Course Schedule", difficulty: "Medium", status: "TODO", time: "—" },
];

/** average solve time per difficulty, and the % change from the previous period */
export const DIFFICULTY_AVERAGES: {
  difficulty: ProblemDifficulty;
  average: string;
  change: number;
}[] = [
  { difficulty: "Easy", average: "12m", change: -10 },
  { difficulty: "Medium", average: "27m", change: -8 },
  { difficulty: "Hard", average: "49m", change: 5 },
];

export const OVERALL_AVERAGE = "20m";

/** each topic's average solve time, as a % difference from the overall average */
export type TopicSpeed = { topic: string; average: string; vsAverage: number };

export const TOPIC_SPEEDS: TopicSpeed[] = [
  { topic: "Hash Table", average: "14m", vsAverage: -32 },
  { topic: "Two Pointers", average: "17m", vsAverage: -18 },
  { topic: "Sliding Window", average: "19m", vsAverage: -8 },
  { topic: "Binary Search", average: "23m", vsAverage: 12 },
  { topic: "Dynamic Programming", average: "29m", vsAverage: 41 },
  { topic: "Graph", average: "32m", vsAverage: 56 },
];

/** minutes practiced per day, by difficulty */
export const DAILY_TIME = [
  { day: "Mon", easy: 0, medium: 0, hard: 0 },
  { day: "Tue", easy: 30, medium: 45, hard: 0 },
  { day: "Wed", easy: 15, medium: 0, hard: 75 },
  { day: "Thu", easy: 20, medium: 60, hard: 0 },
  { day: "Fri", easy: 10, medium: 30, hard: 70 },
  { day: "Sat", easy: 40, medium: 50, hard: 0 },
  { day: "Sun", easy: 0, medium: 35, hard: 40 },
];

/** one week of practice: minutes spent and whether a problem was solved that day */
export const EXAMPLE_WEEK = [
  { day: "Mon", minutes: 45, solved: false },
  { day: "Tue", minutes: 70, solved: true },
  { day: "Wed", minutes: 90, solved: false },
  { day: "Thu", minutes: 20, solved: false },
  { day: "Fri", minutes: 50, solved: true },
  { day: "Sat", minutes: 0, solved: false },
  { day: "Sun", minutes: 0, solved: false },
];
