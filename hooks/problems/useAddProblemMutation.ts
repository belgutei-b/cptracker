"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UserProblemFullClient } from "@/types/client";
import { queryKeys } from "@/lib/queryKeys";

async function addProblemApi({ problemLink }: { problemLink: string }) {
  const res = await fetch("/api/problems", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      problemLink,
    }),
  });
  if (!res.ok) throw new Error("Failed to add problem");
  const data = (await res.json()) as { problem: UserProblemFullClient };
  return data.problem;
}

export function useAddProblemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProblemApi,
    onSuccess: (data) => {
      queryClient.setQueryData<UserProblemFullClient[]>(
        queryKeys.problems,
        (old = []) => {
          const withoutDuplicate = old.filter(
            (p) => p.problemId !== data.problemId,
          );
          return [data, ...withoutDuplicate];
        },
      );
    },
  });
}
