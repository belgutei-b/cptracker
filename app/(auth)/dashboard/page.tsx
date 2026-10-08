"use client";

import AddProblem from "@/components/problems/AddProblem";
import DashboardMain from "@/components/problems/DashboardMain";
import { useProblemsQuery } from "@/hooks/problems/useProblemsQuery";
import { useSyncTimezone } from "@/hooks/useSyncTimezone";
import { pluralize } from "@/lib/utils";

export default function Page() {
  const { data, isLoading, isError } = useProblemsQuery();
  const { problems = [], timezone = "UTC" } = data ?? {};

  useSyncTimezone();

  return (
    <main className="page-container flex flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-[28px]">
            Problems
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {problems.length > 0
              ? `${pluralize(problems.length, "problem")} tracked. Start a timer from any row.`
              : "Keep track of your LeetCode progress and efficiency."}
          </p>
        </div>
        <AddProblem />
      </header>

      {isError ? (
        <p className="rounded-lg border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
          Couldn&apos;t load your problems. Refresh the page to try again.
        </p>
      ) : (
        <DashboardMain
          problems={problems}
          timezone={timezone}
          isLoading={isLoading}
        />
      )}
    </main>
  );
}
