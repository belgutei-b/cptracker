"use client";

import { type UserProblemFullClient } from "@/types/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import toast from "react-hot-toast";

async function addDailyProblemApi() {
  const res = await fetch("/api/problems/daily", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Unexpected error occurred");
  }

  const data = await res.json();

  if (data.alreadyAdded) {
    throw new Error("Daily problem already added");
  }

  return data.problem as UserProblemFullClient;
}

export function useDailyProblemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDailyProblemApi,
    onError: (error) => {
      toast.error(error.message);
    },
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
      toast.success(`${data.problem.title} added`);
    },
  });
}
