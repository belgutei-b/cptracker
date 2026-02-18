"use client";

import { Swords } from "lucide-react";
import { useDailyProblemMutation } from "@/hooks/problems/useDailyProblemMutation";

export default function DailyQuestionButton() {
  const dailyProblemMutation = useDailyProblemMutation();

  function handleClick() {
    dailyProblemMutation.mutate();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={dailyProblemMutation.isPending}
      className="px-4 py-2 rounded-xl flex items-center gap-2 border bg-amber-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Swords size={16} />
      Daily Question
    </button>
  );
}
