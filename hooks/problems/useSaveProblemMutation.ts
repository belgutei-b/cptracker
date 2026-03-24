"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserProblemFullClient } from "@/types/client";
import { queryKeys } from "@/lib/queryKeys";
import toast from "react-hot-toast";

type SaveResponse = {
  ok: boolean;
};

type ProblemsQueryData = {
  timezone: string;
  problems: UserProblemFullClient[];
};

async function saveProblemApi({
  userProblemId,
  note,
  timeComplexity,
  spaceComplexity,
}: {
  userProblemId: string;
  note: string;
  timeComplexity: string;
  spaceComplexity: string;
}) {
  const res = await fetch(`/api/problems/${userProblemId}/save`, {
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
    throw new Error("error");
  }

  return (await res.json()) as SaveResponse;
}

export function useSaveProblemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveProblemApi,
    onSuccess: (_data, variables) => {
      const nowIso = new Date().toISOString();
      queryClient.setQueryData<ProblemsQueryData | undefined>(
        queryKeys.problems,
        (old) => {
          if (!old) return old;

          return {
            ...old,
            problems: old.problems.map((p) =>
              p.id === variables.userProblemId
                ? {
                    ...p,
                    updatedAt: nowIso,
                    note: variables.note,
                    timeComplexity: variables.timeComplexity,
                    spaceComplexity: variables.spaceComplexity,
                  }
                : p,
            ),
          };
        },
      );
      toast.success("Notes saved");
    },
  });
}
