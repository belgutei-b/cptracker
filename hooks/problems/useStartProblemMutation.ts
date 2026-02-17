"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserProblemFullClient } from "@/types/client";
import { queryKeys } from "@/lib/queryKeys";

async function startProblemApi(problemId: string) {
  const res = await fetch(`/api/problems/${problemId}/start`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to start problem");
  return (await res.json()) as { ok: true; lastStartedAt: string };
}

export function useStartProblemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startProblemApi,
    // onMutate: for optimistic update
    // onError: if mutationFn fails
    onSuccess: (data, problemId) => {
      queryClient.setQueryData<UserProblemFullClient[]>(
        queryKeys.problems,
        (old = []) =>
          old.map((p) =>
            p.problemId === problemId
              ? {
                  ...p,
                  status: "IN_PROGRESS",
                  lastStartedAt: data.lastStartedAt,
                }
              : p,
          ),
      );
    },
  });
}
