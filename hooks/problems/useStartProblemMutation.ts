"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserProblemFullClient } from "@/types/client";
import { queryKeys } from "@/lib/queryKeys";
import toast from "react-hot-toast";

type ProblemsQueryData = {
  timezone: string;
  problems: UserProblemFullClient[];
};

async function startProblemApi(problemId: string) {
  const res = await fetch(`/api/problems/${problemId}/start`, {
    method: "POST",
  });
  if (!res.ok) {
    toast.error("Failed to start problem");
    throw new Error("error");
  }
  return (await res.json()) as { ok: true; lastStartedAt: string };
}

export function useStartProblemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startProblemApi,
    // onMutate: for optimistic update
    // onError: if mutationFn fails
    onSuccess: (data, problemId) => {
      queryClient.setQueryData<ProblemsQueryData | undefined>(
        queryKeys.problems,
        (old) => {
          if (!old) return old;

          return {
            ...old,
            problems: old.problems.map((p) =>
              p.problemId === problemId
                ? {
                    ...p,
                    status: "IN_PROGRESS",
                    lastStartedAt: data.lastStartedAt,
                  }
                : p,
            ),
          };
        },
      );
    },
  });
}
