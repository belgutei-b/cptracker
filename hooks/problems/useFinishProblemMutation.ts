"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserProblemFullClient } from "@/types/client";
import { queryKeys } from "@/lib/queryKeys";
import toast from "react-hot-toast";

type FinishStatus = "TRIED" | "SOLVED";

type FinishResponse = {
  ok: boolean;
  duration?: number | null;
};

type ProblemsQueryData = {
  timezone: string;
  problems: UserProblemFullClient[];
};

async function finishProblemApi({
  problemId,
  newStatus,
  note,
  timeComplexity,
  spaceComplexity,
}: {
  problemId: string;
  newStatus: FinishStatus;
  note: string;
  timeComplexity: string;
  spaceComplexity: string;
}) {
  const res = await fetch(`/api/problems/${problemId}/finish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      newStatus,
      note,
      timeComplexity,
      spaceComplexity,
    }),
  });

  if (!res.ok) {
    toast.error("Failed to finish problem");
    throw new Error("error");
  }

  return (await res.json()) as FinishResponse;
}

export function useFinishProblemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finishProblemApi,
    onSuccess: (_data, variables) => {
      const nowIso = new Date().toISOString();
      queryClient.setQueryData<ProblemsQueryData | undefined>(
        queryKeys.problems,
        (old) => {
          if (!old) return old;

          return {
            ...old,
            problems: old.problems.map((p) =>
              p.problemId === variables.problemId
                ? {
                    ...p,
                    status: variables.newStatus,
                    lastStartedAt: null,
                    updatedAt: nowIso,
                    solvedAt: variables.newStatus === "SOLVED" ? nowIso : null,
                    duration: p.duration,
                    note: variables.note,
                    timeComplexity: variables.timeComplexity,
                    spaceComplexity: variables.spaceComplexity,
                  }
                : p,
            ),
          };
        },
      );
      toast.success("Successfully finished");
    },
  });
}
