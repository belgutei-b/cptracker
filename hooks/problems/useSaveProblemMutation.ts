"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserProblemFullClient } from "@/types/client";
import { queryKeys } from "@/lib/queryKeys";
import toast from "react-hot-toast";

type SaveResponse = {
  ok: boolean;
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
    toast.error("Failed to save problem notes");
  }

  return (await res.json()) as SaveResponse;
}

export function useSaveProblemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveProblemApi,
    onSuccess: (_data, variables) => {
      const nowIso = new Date().toISOString();
      queryClient.setQueryData<UserProblemFullClient[]>(
        queryKeys.problems,
        (old = []) =>
          old.map((p) =>
            p.problemId === variables.problemId
              ? {
                  ...p,
                  updatedAt: nowIso,
                  note: variables.note,
                  timeComplexity: variables.timeComplexity,
                  spaceComplexity: variables.spaceComplexity,
                }
              : p,
          ),
      );
      toast.success("Notes saved");
    },
  });
}
