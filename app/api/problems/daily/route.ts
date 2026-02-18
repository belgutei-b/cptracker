import { serverAddDailyProblem } from "@/lib/problem";
import { getCurrentUserId } from "@/lib/user";
import { NextResponse } from "next/server";

/**
 * user add daily problem
 */
export async function POST() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { problem, alreadyAdded, problemId } = await serverAddDailyProblem({
    userId,
  });

  if (alreadyAdded) {
    return NextResponse.json({
      alreadyAdded: true,
      problemId,
      problem: null,
    });
  }

  return NextResponse.json({
    alreadyAdded: false,
    problemId,
    problem,
  });
}
