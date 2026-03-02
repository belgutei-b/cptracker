"use client";

import { useQuery } from "@tanstack/react-query";
import type { UserProblemFullClient } from "@/types/client";
import { queryKeys } from "@/lib/queryKeys";

async function fetchProblems() {
  const res = await fetch("/api/problems", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch problems");
  const data = (await res.json()) as {
    timezone: string;
    problems: UserProblemFullClient[];
  };
  return { problems: data.problems, timezone: data.timezone };
}

export function useProblemsQuery() {
  return useQuery({
    queryKey: queryKeys.problems,
    queryFn: fetchProblems,
  });
}
