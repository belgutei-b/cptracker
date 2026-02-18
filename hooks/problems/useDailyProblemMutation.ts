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

const DEFAULT_DAILY_PROBLEM_ERROR = "Failed to add daily problem";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Unexpected error occurred";
}

async function addDailyProblemApi() {
  const res = await fetch("/api/problems/daily", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    let errorMessage = DEFAULT_DAILY_PROBLEM_ERROR;
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
    throw new Error(errorMessage);
  }

  const data = (await res.json()) as AddDailyProblemResponse;

  if (data.alreadyAdded) {
    throw new Error("Daily problem already added");
  }

  return data.problem;
}

export function useDailyProblemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDailyProblemApi,
    onError: (error) => {
      toast.error(getErrorMessage(error));
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
