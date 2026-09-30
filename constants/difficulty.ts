import type { Difficulty } from "@/prisma/generated/prisma/enums";

// hex values for charts (recharts needs raw colors), kept in sync with --easy/--medium/--hard in globals.css
export const DIFFICULTY_COLORS = {
  Easy: "#4fc3b4",
  Medium: "#e9b44c",
  Hard: "#f0716a",
  Total: "#000000",
  All: "#000000",
} as const;

/** difficulties a problem can have ("All" only exists for analytics) */
export type ProblemDifficulty = Exclude<Difficulty, "All">;

export const DIFFICULTIES: ProblemDifficulty[] = ["Easy", "Medium", "Hard"];

export const DIFFICULTY_TEXT_CLASS: Record<ProblemDifficulty, string> = {
  Easy: "text-easy",
  Medium: "text-medium",
  Hard: "text-hard",
};

export const DIFFICULTY_DOT_CLASS: Record<ProblemDifficulty, string> = {
  Easy: "bg-easy",
  Medium: "bg-medium",
  Hard: "bg-hard",
};
