import type { Status } from "@/prisma/generated/prisma/enums";
import type { ProblemDifficulty } from "@/constants/difficulty";
import type { UserProblemFullClient } from "@/types/client";

export type ProblemFilters = {
  query: string;
  difficulties: ProblemDifficulty[];
  statuses: Status[];
};

export const EMPTY_FILTERS: ProblemFilters = {
  query: "",
  difficulties: [],
  statuses: [],
};

export function hasActiveFilters(filters: ProblemFilters) {
  return (
    filters.query.trim() !== "" ||
    filters.difficulties.length > 0 ||
    filters.statuses.length > 0
  );
}

/**
 * query matches the title or the exact problem number,
 * an empty difficulty/status list means "any"
 */
export function filterProblems(
  problems: UserProblemFullClient[],
  filters: ProblemFilters,
) {
  const query = filters.query.trim().toLowerCase();

  return problems.filter((p) => {
    const matchesQuery =
      !query ||
      p.problem.title.toLowerCase().includes(query) ||
      p.problem.questionId === query;
    const matchesDifficulty =
      filters.difficulties.length === 0 ||
      filters.difficulties.includes(p.problem.difficulty as ProblemDifficulty);
    const matchesStatus =
      filters.statuses.length === 0 || filters.statuses.includes(p.status);

    return matchesQuery && matchesDifficulty && matchesStatus;
  });
}

export function countByStatus(problems: UserProblemFullClient[]) {
  const counts: Record<Status, number> = {
    TODO: 0,
    IN_PROGRESS: 0,
    TRIED: 0,
    SOLVED: 0,
  };
  for (const p of problems) counts[p.status] += 1;
  return counts;
}
