import { NextResponse } from "next/server";
import { getProblems } from "@/lib/problem";
import { getCurrentUserId } from "@/lib/user";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const problems = await getProblems({
    userId,
  });
  return NextResponse.json(
    {
      problems,
    },
    { status: 200 },
  );
}
