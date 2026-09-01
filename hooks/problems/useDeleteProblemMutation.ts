"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserProblemFullClient } from "@/types/client";
import { queryKeys } from "@/lib/queryKeys";
import toast from "react-hot-toast";

type DeleteResponse = {
  ok: boolean;
};

type ProblemsQueryData = {
  timezone: string;
  problems: UserProblemFullClient[];
};

async function deleteProblemApi({
  userProblemId,
}: {
  userProblemId: string;
}) {
  const res = await fetch(`/api/problems/${userProblemId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    toast.error("Failed to delete problem");
    throw new Error("error");
  }

  return (await res.json()) as DeleteResponse;
}

export function useDeleteProblemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProblemApi,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<ProblemsQueryData | undefined>(
        queryKeys.problems,
        (old) => {
          if (!old) return old;

          return {
            ...old,
            problems: old.problems.filter(
              (p) => p.id !== variables.userProblemId,
            ),
          };
        },
      );
      toast.success("Problem deleted");
    },
  });
}
