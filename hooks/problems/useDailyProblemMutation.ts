"use client";

import { type UserProblemFullClient } from "@/types/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import toast from "react-hot-toast";

type AddDailyProblemResponse = {
  problemId: string;
  problem: UserProblemFullClient;
  alreadyAdded: boolean;
};

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

async function addDailyProblemApi() {
  const res = await fetch("/api/problems/daily", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    let errorMessage = "Failed to add daily problem";
    try {
      const errorData = (await res.json()) as ApiErrorResponse;
      if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Non-JSON error response: use default fallback message.
    }
    toast.error(errorMessage);
    throw new Error("Error");
  }

  const data = (await res.json()) as AddDailyProblemResponse;

  if (data.alreadyAdded) {
    toast.error("Daily problem already added");
    throw new Error("Error");
  }

  return data.problem;
}

export function useDailyProblemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDailyProblemApi,
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
