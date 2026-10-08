"use client";

import { Swords } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useDailyProblemMutation } from "@/hooks/problems/useDailyProblemMutation";

/** adds today's LeetCode daily question and goes to the dashboard */
export default function DailyQuestionButton({
  iconOnly = false,
}: {
  iconOnly?: boolean;
}) {
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
    <Button
      type="button"
      variant="outline"
      size={iconOnly ? "icon-lg" : "default"}
      onClick={handleClick}
      disabled={dailyProblemMutation.isPending}
      aria-label={iconOnly ? "Add today's daily question" : undefined}
    >
      <Swords />
      {!iconOnly && "Daily question"}
    </Button>
  );
}
