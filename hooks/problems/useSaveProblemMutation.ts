"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserProblemFullClient } from "@/types/client";
import { queryKeys } from "@/lib/queryKeys";

type SaveResponse = {
  ok: boolean;
  note?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
};

async function saveProblemApi({
  problemId,
  note,
  timeComplexity,
  spaceComplexity,
}: {
  problemId: string;
  note: string;
  timeComplexity: string;
  spaceComplexity: string;
}) {
  const res = await fetch(`/api/problems/${problemId}/save`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      note,
      timeComplexity,
      spaceComplexity,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to save problem notes");
  }

  return (await res.json()) as SaveResponse;
}

export function useSaveProblemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveProblemApi,
    onSuccess: (data, variables) => {
      const nowIso = new Date().toISOString();
      queryClient.setQueryData<UserProblemFullClient[]>(
        queryKeys.problems,
        (old = []) =>
          old.map((p) =>
            p.problemId === variables.problemId
              ? {
                  ...p,
                  updatedAt: nowIso,
                  note: data.note ?? variables.note,
                  timeComplexity:
                    data.timeComplexity ?? variables.timeComplexity,
                  spaceComplexity:
                    data.spaceComplexity ?? variables.spaceComplexity,
                }
              : p,
          ),
      );
    },
  });
}
