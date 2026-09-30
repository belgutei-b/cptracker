"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import ProblemFilters from "@/components/problems/ProblemFilters";
import ProblemList from "@/components/problems/ProblemList";
import ProblemListSkeleton from "@/components/problems/ProblemListSkeleton";
import ProblemEmptyState from "@/components/problems/ProblemEmptyState";
import ProblemSolving from "@/components/problems/ProblemSolving";
import { useStartProblemMutation } from "@/hooks/problems/useStartProblemMutation";
import { useNowTick } from "@/hooks/useNowTick";
import { isTimerRunning } from "@/lib/timer";
import {
  EMPTY_FILTERS,
  countByStatus,
  filterProblems,
} from "@/lib/problem-filters";
import { STARTABLE_STATUSES } from "@/constants/status";
import type { UserProblemFullClient } from "@/types/client";

/**
 * Filters + problems table + the solving sheet.
 * Opening a Todo/Tried problem starts a new solve session.
 */
export default function DashboardMain({
  problems,
  timezone,
  isLoading,
}: {
  problems: UserProblemFullClient[];
  timezone: string;
  isLoading: boolean;
}) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
  const startMutation = useStartProblemMutation();

  const visibleProblems = useMemo(
    () => filterProblems(problems, filters),
    [problems, filters],
  );
  const statusCounts = useMemo(() => countByStatus(problems), [problems]);

  // looked up in the full list so filtering never closes the open sheet
  const activeProblem = problems.find((p) => p.id === activeProblemId) ?? null;

  const nowMs = useNowTick(problems.some(isTimerRunning));
  const startingProblemId = startMutation.isPending
    ? (startMutation.variables ?? null)
    : null;

  function openProblem(problem: UserProblemFullClient) {
    setActiveProblemId(problem.id);

    if (STARTABLE_STATUSES.includes(problem.status)) {
      startMutation.mutate(problem.id);
    }
  }

  if (isLoading) return <ProblemListSkeleton />;
  if (problems.length === 0) return <ProblemEmptyState />;

  return (
    <div className="flex flex-col gap-4">
      <ProblemFilters
        filters={filters}
        onChange={setFilters}
        statusCounts={statusCounts}
        shownCount={visibleProblems.length}
        totalCount={problems.length}
      />

      {visibleProblems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border bg-card py-16">
          <p className="text-sm text-muted-foreground">
            No problems match these filters.
          </p>
          <Button variant="outline" onClick={() => setFilters(EMPTY_FILTERS)}>
            Clear filters
          </Button>
        </div>
      ) : (
        <ProblemList
          problems={visibleProblems}
          timezone={timezone}
          nowMs={nowMs}
          startingProblemId={startingProblemId}
          onOpenProblem={openProblem}
        />
      )}

      <ProblemSolving
        problem={activeProblem}
        onCloseAction={() => setActiveProblemId(null)}
      />
    </div>
  );
}
