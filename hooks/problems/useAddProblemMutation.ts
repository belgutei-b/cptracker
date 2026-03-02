"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UserProblemFullClient } from "@/types/client";
import { queryKeys } from "@/lib/queryKeys";
import toast from "react-hot-toast";

type ProblemsQueryData = {
  timezone: string;
  problems: UserProblemFullClient[];
};

async function addProblemApi({ problemLink }: { problemLink: string }) {
  const res = await fetch("/api/problems", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      problemLink,
    }),
  });
  if (res.status === 409) {
    throw new Error("Problem already added");
  }

  if (!res.ok) {
    throw new Error("Error");
  }
  const data = (await res.json()) as { problem: UserProblemFullClient };
  return data.problem;
}

export function useAddProblemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProblemApi,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.setQueryData<ProblemsQueryData | undefined>(
        queryKeys.problems,
        (old) => {
          if (!old) {
            return {
              timezone: "UTC",
              problems: [data],
            };
          }

          const withoutDuplicate = old.problems.filter(
            (p) => p.problemId !== data.problemId,
          );

          return {
            ...old,
            problems: [data, ...withoutDuplicate],
          };
        },
      );
      toast.success(`${data.problem.title} added`);
    },
  });
}
