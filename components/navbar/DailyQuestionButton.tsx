"use client";

import { Swords } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useDailyProblemMutation } from "@/hooks/problems/useDailyProblemMutation";

export default function DailyQuestionButton() {
  const dailyProblemMutation = useDailyProblemMutation();
  const pathname = usePathname();
  const router = useRouter();

  function handleClick() {
    dailyProblemMutation.mutate();
    if (pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={dailyProblemMutation.isPending}
      className="landing-button font-normal! disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Swords size={16} />
      Daily Question
    </button>
  );
}
