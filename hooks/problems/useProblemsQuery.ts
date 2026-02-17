"use client";

import { useQuery } from "@tanstack/react-query";
import type { UserProblemFullClient } from "@/types/client";
import { queryKeys } from "@/lib/queryKeys";

async function fetchProblems() {
  const res = await fetch("/api/problems", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch problems");
  const data = (await res.json()) as { problems: UserProblemFullClient[] };
  return data.problems;
}

export function useProblemsQuery() {
  return useQuery({
    queryKey: queryKeys.problems,
    queryFn: fetchProblems,
  });
}
