import { getSolveSessions } from "@/lib/solveSessions";
import { getCurrentUserId } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

/**
 * solve sessions of the authenticated user
 * @returns SolveSession[]
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await getSolveSessions({ userId });

    return NextResponse.json(sessions);
  } catch {
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 },
    );
  }
}
