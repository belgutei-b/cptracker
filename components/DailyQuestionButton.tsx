"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Swords } from "lucide-react";
import toast from "react-hot-toast";
import { actionDailyProblem } from "../app/dashboard/actions";

export default function DailyQuestionButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await actionDailyProblem();
      toast(res.message);
      if (res.success && res.problemId) {
        router.push(`/dashboard?openProblemId=${res.problemId}`);
        if (!res.alreadyAdded) {
          router.refresh();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSubmitting}
      className="px-4 py-2 rounded-xl flex items-center gap-2 border bg-amber-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Swords size={16} />
      Daily Question
    </button>
  );
}
